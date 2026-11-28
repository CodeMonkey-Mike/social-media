#!/usr/bin/env python
"""
schedule_tweets.py: the cleanup policy of schedule-tweets/ (target name: schedule-tweets).

Python port of targets/schedule-tweets.js (2026-11-27; the JS was deleted the same day).

Policy: reference-counted, against the post queues, for BOTH images and staged videos.
  - Images (images/) are keyed on each queue item's single status field; staged videos (longform/ + shorts/)
    are keyed on PER-PLATFORM status in longs.json / shorts.json (a staged video is "posted" only when EVERY
    platform is terminal). A referenced file is recycled only when its post is fully posted AND no item that
    is not posted references it.
  - An ORPHAN file (referenced by NO queue) is recycled once it is >= ORPHAN_AGE_DAYS old; a newer orphan is
    kept (it may be freshly generated or staged and not yet queued). Recency so protects active-batch work,
    which is always recent: no batch-id check is needed.
  - metadata.json (the active staging manifest) is always kept.
"""
import os
import re
import stat
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # cleanup/, for lib
from lib import age_days, entry_kind, read_json, scan, walk_files  # noqa: E402

NAME = "schedule-tweets"

# Orphan images (in no queue) are kept until this old, then recycled. About 2 weeks: long enough that an image
# generated but not yet queued survives a normal drafting cycle.
ORPHAN_AGE_DAYS = 14

# A staged folder whose batch is in one of these states is recycled WHOLE (see below).
ARCHIVED_STATUS = {"completed", "archived"}

# A platform slot in one of these states is done; a staged file is posted only when every slot is.
PLATFORM_DONE = {"posted", "posted_unverified", "skip", "skipped"}

# posted_replies.json results that mean the image reply went out.
POSTED_IMG_RESULTS = {"posted_image", "uncertain_image"}

SCREENSHOT_RE = re.compile(r"\.(png|jpe?g)$", re.I)
DATED_RE = re.compile(r"-[0-9]{4}-[0-9]{2}-[0-9]{2}$")


def _rows(data, key):
    """data[key] as a list of objects ([] when the file or the key is not what we expect)."""
    rows = data.get(key) if isinstance(data, dict) else None
    return [r for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []


def _field(rows, name):
    """row[name] for each row of a nested list (slides, images, a thread's tweets)."""
    return [r.get(name) for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []


def load_batch_status(repo_root):
    """batch id (lowercased) -> status, from the repo-root batches.json. Used to map a staged folder under
    longform/ or shorts/ to its batch, so a finished batch's folder is removed whole instead of being kept
    by one recent orphan thumbnail."""
    return {str(b["batch"]).lower(): b.get("status")
            for b in _rows(read_json(os.path.join(repo_root, "batches.json")), "batches") if b.get("batch")}


def plan(repo_root, age_days_max=30):
    base = os.path.join(repo_root, "schedule-tweets")
    images_dir = os.path.join(base, "images")
    data_dir = os.path.join(base, "data")
    reference_dir = os.path.join(images_dir, "reference")

    def resolve(img_path):
        """A queue's path ("schedule-tweets/images/x/foo.png", relative to the repo root) -> absolute."""
        if not img_path or not isinstance(img_path, str):
            return None
        rel = re.sub(r"^schedule-tweets/", "", img_path).replace("/", os.sep)
        return os.path.normpath(base + os.sep + rel)

    posted_paths = set()
    active_paths = set()

    def note(paths, posted):
        for p in paths:
            full = resolve(p)
            if full:
                (posted_paths if posted else active_paths).add(full.lower())

    def scan_file(name, key, image_paths):
        """A queue whose items carry ONE status field."""
        for item in _rows(read_json(os.path.join(data_dir, name)), key):
            note(image_paths(item), item.get("status") == "posted")

    scan_file("x-tweets.json", "tweets", lambda t: [t.get("image_path")])
    scan_file("x-threads.json", "threads", lambda t: _field(t.get("tweets"), "image_path"))
    scan_file("x-polls.json", "polls", lambda p: [p.get("image_path")])
    scan_file("ig-single-image.json", "posts", lambda p: [p.get("image_path")])
    scan_file("ig-carousel.json", "posts", lambda p: _field(p.get("slides"), "image_path"))
    scan_file("yt-posts.json", "posts", lambda p: _field(p.get("images"), "image_path"))
    # AI Engineering Simplified's community posts (2026-11-17), same shape; without this its pending slides
    # read as orphans
    scan_file("ai-yt-posts.json", "posts", lambda p: _field(p.get("images"), "image_path"))
    scan_file("yt-text-polls.json", "polls", lambda p: [p.get("image_path")])

    def scan_staged(name, key):
        """The staged video queues (shorts.json / longs.json) use PER-PLATFORM status, not one item status:
        a staged file counts as posted only when every platform is terminal."""
        for item in _rows(read_json(os.path.join(data_dir, name)), key):
            platforms = item.get("platforms")
            slots = list(platforms.values()) if isinstance(platforms, dict) else []
            fully_posted = bool(slots) and all(
                isinstance(s, dict) and isinstance(s.get("status"), str) and s["status"] in PLATFORM_DONE
                for s in slots)
            note([item.get("video_path"), item.get("thumbnail_path")], fully_posted)

    scan_staged("shorts.json", "shorts")
    scan_staged("longs.json", "longs")

    recycle = []
    skipped = []

    def keep(path, reason):
        skipped.append({"path": path, "reason": reason})

    def bin_(path, reason):
        recycle.append({"path": path, "reason": reason})

    for img in walk_files(images_dir, skip_dirs={reference_dir.lower()}):
        key = img.lower()
        if key in active_paths:
            keep(img, "still needed (non-posted item links it)")
        elif key in posted_paths:
            bin_(img, "posted, no active link")
        elif age_days(img) >= ORPHAN_AGE_DAYS:
            bin_(img, f"orphan (no queue ref, >={ORPHAN_AGE_DAYS}d old)")
        else:
            keep(img, f"orphan (no queue ref, <{ORPHAN_AGE_DAYS}d — may be unqueued)")

    # Staged video folders (longform/ + shorts/). Each immediate subfolder is one batch's staged deliverables.
    # The unit of cleanup is the WHOLE folder, keyed on batch status, so a finished batch's folder is removed
    # outright: leftover cover thumbnails (recent orphans the per-file rule would otherwise keep) never strand
    # an inactive folder:
    #   * batch completed/archived -> recycle the entire <batch>/ folder (thumbnails included).
    #   * batch active             -> KEEP the folder; clean only its individually posted files
    #                                 (per-platform status), so an in-flight batch is preserved.
    #   * folder maps to no batch  -> fall back to the per-file reference-counted + orphan-by-age policy
    #                                 (the folder cannot be classified safely, so it is not removed whole).
    # metadata.json directly under longform/ or shorts/ is the live staging manifest: always kept.
    batch_status = load_batch_status(repo_root)

    def batch_of_folder(name):
        """A folder name may carry a trailing -YYYY-MM-DD (best-coin-to-buy-2026-06-17): strip it to match."""
        lc = name.lower()
        if lc in batch_status:
            return lc
        stripped = DATED_RE.sub("", lc)
        return stripped if stripped in batch_status else None

    def classify_staged_file(f, sub):
        if os.path.basename(f).lower() == "metadata.json":
            keep(f, f"{sub} staging manifest")
            return
        key = f.lower()
        if key in active_paths:
            keep(f, f"{sub} — still needed (pending post links it)")
        elif key in posted_paths:
            bin_(f, f"{sub} — posted, no active link")
        elif age_days(f) >= ORPHAN_AGE_DAYS:
            bin_(f, f"{sub} orphan (no queue ref, >={ORPHAN_AGE_DAYS}d old)")
        else:
            keep(f, f"{sub} orphan (<{ORPHAN_AGE_DAYS}d — may be unstaged)")

    for sub in ("longform", "shorts"):
        folder = os.path.join(base, sub)
        if not os.path.isdir(folder):
            continue
        for entry in scan(folder):
            full = os.path.join(folder, entry.name)
            if entry_kind(entry) != "dir":
                classify_staged_file(full, sub)              # a loose top-level file (e.g. metadata.json)
                continue
            batch = batch_of_folder(entry.name)
            status = batch_status.get(batch) if batch else None
            if isinstance(status, str) and status in ARCHIVED_STATUS:
                bin_(full, f"{sub} project — {status} batch ({batch})")
                continue
            # an active batch, or a folder we cannot map to a batch: keep the folder, classify file by file
            for f in walk_files(full):
                classify_staged_file(f, sub)

    # Reply-guy image replies (x-reply-guy/data/reply-images/). Reference-counted like images/ above, but
    # against the REPLY queues and keyed by FILE NAME: the reply queues store image_path as an ABSOLUTE
    # Windows path, not a repo-relative one.
    #   * KEEP    : a PENDING entry in replies_to_post.json links it (the reply is not sent yet).
    #   * RECYCLE : posted_replies.json archived it as posted_image | uncertain_image (both mean the reply
    #               went out; under the reply-guy never-retry rule it is not fired again) and no pending
    #               entry links it, so the local file is spent (already uploaded to X).
    #   * ORPHAN  : generated but referenced by neither queue -> recycled once >= ORPHAN_AGE_DAYS old
    #               (a freshly generated image that is not posted yet survives a normal review cycle).
    # Only image replies carry an image_path; text / emoji / GIF entries contribute nothing here.
    reply_images_dir = os.path.join(repo_root, "x-reply-guy", "data", "reply-images")
    rg_data = os.path.join(repo_root, "x-reply-guy", "data")

    def base_name(p):
        return os.path.basename(str(p).rstrip("/\\")).lower() if p else None

    def entries(name):
        data = read_json(os.path.join(rg_data, name))
        return [e for e in data if isinstance(e, dict)] if isinstance(data, list) else []

    reply_active = set()        # file names a pending reply still needs (KEEP)
    reply_posted = set()        # file names whose reply already went out (RECYCLE)
    for e in entries("replies_to_post.json"):
        n = base_name(e.get("image_path"))
        if n:
            reply_active.add(n)
    for e in entries("posted_replies.json"):
        n = base_name(e.get("image_path"))
        result = e.get("result")
        if n and isinstance(result, str) and result in POSTED_IMG_RESULTS:
            reply_posted.add(n)
    for img in walk_files(reply_images_dir):
        n = os.path.basename(img).lower()
        if n in reply_active:
            keep(img, "reply image (pending reply links it)")
        elif n in reply_posted:
            bin_(img, "reply image (posted, no pending link)")
        elif age_days(img) >= ORPHAN_AGE_DAYS:
            bin_(img, f"reply image orphan (no queue ref, >={ORPHAN_AGE_DAYS}d old)")
        else:
            keep(img, f"reply image orphan (no queue ref, <{ORPHAN_AGE_DAYS}d — may be ungenerated/unqueued)")

    # Loose top-level artifacts in schedule-tweets/: recycled once >= 24 h old, so the current posting session
    # is preserved. Top level only, so the Chrome bot-profile logs deeper in the tree, and the real post images
    # under images/, are never touched.
    #   * run logs (post-step* / workflow-step*.log)
    #   * debug screenshots (*.png / *.jpg): the posting and diagnostic scripts dump these at the root
    #     (diag-poll-*, debug-after-*, dashboard_check*, replies_tab_*, ...); they are throwaway captures,
    #     never queue assets (those live under images/).
    if os.path.isdir(base):
        for name in os.listdir(base):
            full = os.path.join(base, name)
            try:
                if not stat.S_ISREG(os.stat(full).st_mode):
                    continue
            except OSError:
                continue
            lc = name.lower()
            if lc.endswith(".log"):
                if age_days(full) >= 1:
                    bin_(full, "run log (>=24h old)")
                else:
                    keep(full, "run log (<24h, current session)")
            elif SCREENSHOT_RE.search(lc):
                if age_days(full) >= 1:
                    bin_(full, "debug screenshot (>=24h old)")
                else:
                    keep(full, "debug screenshot (<24h, current session)")

    # Empty <batch>/ folders under longform/ and shorts/ are pruned by the engine once their files are
    # recycled, so a finished batch never leaves an empty folder behind.
    prune_roots = [os.path.join(base, "longform"), os.path.join(base, "shorts")]
    return {"name": NAME, "recycle": recycle, "skipped": skipped, "prune_roots": prune_roots, "prune_skip_dirs": []}
