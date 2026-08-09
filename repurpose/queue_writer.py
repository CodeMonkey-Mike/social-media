# queue_writer.py — Lane 3's canonical queue-writer module (Wave 6, 2026-08-09).
# Replaces the per-batch `_lane3_*.js` throwaway writers and the ad-hoc Node one-liner
# edits with ONE validated, idempotent, emoji-safe appender for the six Lane 3 queues:
#
#   x-tweets.json (tweets) · x-threads.json (threads) · x-polls.json (polls)
#   yt-posts.json (posts) · yt-text-polls.json (polls) · ig-single-image.json (posts)
#
# It also owns `validate_lane3_plan` — the fail-fast validator for the per-batch
# lane3-plan.json seam artifact (drafting is judgment and happens in the Claude session;
# the plan lands on disk BEFORE `run.py repurpose` runs; the graph consumes it). One
# source of truth: run.py AND lane3_batch.py import this validator (the cut_topics
# validate_plan pattern).
#
# Emoji safety: files are read/written utf-8 with ensure_ascii=False and the file's OWN
# detected indent, LF line endings. This is the sanctioned replacement for "edit
# data/*.json with Node, never PowerShell" — the rule's target was PowerShell's
# ConvertFrom/To-Json emoji mangling; Python utf-8 round-trips byte-clean.
#
# Idempotency: an entry whose id (or, for id-less x-tweets, image_id) already exists is
# SKIPPED, never touched — Mike's hand-edits to queued entries survive re-runs (the
# publish-shorts --meta contract).
#
# HARD GATES carried in code (gate-rules-in-code doctrine):
#   - em/en dash anywhere in a NEW entry (or anywhere in the plan) = die
#   - chart emojis (the AI tell) in plan strings = die
#   - every image unique: an image_id used ANYWHERE before (any queue, any images/ file)
#     = die at validation
#   - IG single-image is KASPA ONLY (same subject regex as scripts/persona-lint.py, and
#     the plan must ALSO declare kaspa_subject=true — belt and braces)
#   - X polls only for Kaspa/TAO/Toncoin: the plan entry must declare its
#     eligible_topic; anything else = die
#   - threads are 5-8 tweets (the predefined thread rule)

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR_DEFAULT = REPO_ROOT / "schedule-tweets" / "data"
IMAGES_BASE_DEFAULT = REPO_ROOT / "schedule-tweets" / "images"

HEX8_RE = re.compile(r"^[0-9a-f]{8}$")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DASHES = ("—", "–")                       # em dash, en dash
CHART_EMOJI = ("\U0001F4C8", "\U0001F4C9")          # the AI-tell chart emojis
# Same subject regex as scripts/persona-lint.py lint_ig_kaspa_only (keep in sync).
KASPA_RX = re.compile(
    r"\bkaspa\b|\$kas\b|\bkrc-?20\b|\bghostdag\b|\bdagknight\b|\bkaspy\b|\bkasy\b|\bkappy\b",
    re.IGNORECASE)
X_POLL_TOPICS = {"kaspa", "tao", "toncoin"}

QUEUE_FILES = {
    "x_tweets": ("x-tweets.json", "tweets"),
    "x_threads": ("x-threads.json", "threads"),
    "x_polls": ("x-polls.json", "polls"),
    "yt_posts": ("yt-posts.json", "posts"),
    "yt_text_polls": ("yt-text-polls.json", "polls"),
    "ig_single": ("ig-single-image.json", "posts"),
}
PURPOSE_SUBDIR = {"x-tweets": "x", "yt-posts": "yt", "ig-single": "ig",
                  "ig-carousel": "ig"}


# ── file I/O (indent-preserving, emoji-safe) ─────────────────────────────────

def sniff_indent(raw: str) -> int:
    m = re.search(r'\n( +)"', raw)
    return len(m.group(1)) if m else 2


def load_queue(path: Path, listkey: str):
    raw = path.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, dict) or not isinstance(data.get(listkey), list):
        raise SystemExit(f"{path}: expected a dict with a {listkey!r} array")
    return data, sniff_indent(raw)


def save_queue(path: Path, data: dict, indent: int):
    txt = json.dumps(data, indent=indent, ensure_ascii=False)
    path.write_text(txt, encoding="utf-8", newline="\n")


# ── plan-wide helpers ────────────────────────────────────────────────────────

def _walk_strings(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _walk_strings(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _walk_strings(v)


def image_out_rel(purpose: str, image_id: str, slug: str) -> str:
    sub = PURPOSE_SUBDIR.get(purpose, "x")
    return f"schedule-tweets/images/{sub}/{purpose}-{image_id}-{slug}.png"


def existing_image_ids(data_dir: Path, images_base: Path,
                       own_filenames=frozenset(), own_entry_keys=frozenset()):
    """Every image_id already spoken for: any queue file mention + any file on disk in
    the images dirs (the every-image-unique hard rule). `own_filenames` /
    `own_entry_keys` exclude THIS plan's own artifacts so an idempotent re-run of a
    partially-completed batch does not read its own output as a collision."""
    ids = set()
    for fname, listkey in QUEUE_FILES.values():
        p = data_dir / fname
        if not p.is_file():
            continue
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        for e in d.get(listkey, []) or []:
            if not isinstance(e, dict):
                continue
            if (e.get("id") or e.get("image_id")) in own_entry_keys:
                continue                       # this plan's own entry (resume)
            if e.get("image_id"):
                ids.add(str(e["image_id"]))
            for img in e.get("images", []) or []:
                if isinstance(img, dict) and img.get("image_id"):
                    ids.add(str(img["image_id"]))
    id_from_file = re.compile(r"^[a-z-]+-([0-9a-f]{8})-")
    if images_base.is_dir():
        for sub in ("x", "yt", "ig"):
            d = images_base / sub
            if not d.is_dir():
                continue
            for f in d.glob("*.png"):
                if f.name in own_filenames:
                    continue                   # this plan's own render (resume)
                m = id_from_file.match(f.name)
                if m:
                    ids.add(m.group(1))
    return ids


# ── the lane3-plan validator (one source of truth) ───────────────────────────

def validate_lane3_plan(plan: dict, data_dir: Path = None,
                        images_base: Path = None) -> list:
    """Die loudly (SystemExit) on any violation; return the plan's image list on
    success. Mirrors validate_meta/validate_plan: called fail-fast by run.py BEFORE the
    graph, and again by lane3_batch.py before any work."""
    data_dir = Path(data_dir) if data_dir else DATA_DIR_DEFAULT
    images_base = Path(images_base) if images_base else IMAGES_BASE_DEFAULT

    def die(msg):
        raise SystemExit(f"lane3-plan INVALID: {msg}")

    for k in ("batch", "date", "source_transcript"):
        if not plan.get(k):
            die(f"missing {k!r}")
    if not DATE_RE.match(plan["date"]):
        die(f"date {plan['date']!r} is not YYYY-MM-DD")

    blob = "\n".join(_walk_strings(plan))
    for d in DASHES:
        if d in blob:
            line = next(s for s in _walk_strings(plan) if d in s)
            die(f"em/en dash in plan copy (persona hard rule): {line[:90]!r}")
    for c in CHART_EMOJI:
        if c in blob:
            die("chart emoji in plan copy (the AI tell; persona bans it)")

    images = plan.get("images") or []
    own_filenames = {f"{im.get('purpose')}-{im.get('image_id')}-{im.get('slug')}.png"
                     for im in images}
    own_entry_keys = set()
    for key in QUEUE_FILES:
        for e in plan.get(key) or []:
            own_entry_keys.add(e.get("id") or e.get("image_id"))
    taken = existing_image_ids(data_dir, images_base, own_filenames, own_entry_keys)
    groups = {}
    for im in images:
        for k in ("purpose", "image_id", "slug", "prompt"):
            if not im.get(k):
                die(f"image missing {k!r}: {im}")
        if im["purpose"] not in PURPOSE_SUBDIR:
            die(f"image {im['image_id']}: unknown purpose {im['purpose']!r}")
        if not HEX8_RE.match(im["image_id"]):
            die(f"image_id {im['image_id']!r} is not 8-hex")
        if not SLUG_RE.match(im["slug"]):
            die(f"image slug {im['slug']!r} is not kebab-case")
        if im["image_id"] in taken:
            die(f"image_id {im['image_id']} is ALREADY USED (queue or images dir) — "
                "every image is unique, mint a fresh id")
        for r in (im.get("ref") if isinstance(im.get("ref"), list)
                  else [im["ref"]] if im.get("ref") else []):
            if not Path(r).is_file():
                die(f"image {im['image_id']}: ref not found: {r}")
        groups.setdefault(im["image_id"], []).append(im)
    for iid, grp in groups.items():
        if len(grp) == 1:
            continue
        # THE ONE sanctioned duplicate: the X 1:1 + IG 4:5 companion pair shares its
        # image_id BY DESIGN (SKILL.md "X image -> IG 4:5 companion", the 118377a2
        # precedent). Anything else sharing an id is the classic reuse bug.
        if (len(grp) == 2
                and {g["purpose"] for g in grp} == {"x-tweets", "ig-single"}
                and grp[0]["slug"] == grp[1]["slug"]):
            continue
        die(f"duplicate image_id in plan: {iid} (only an x-tweets + ig-single "
            "companion pair with the same slug may share an id)")
    by_id = {im["image_id"]: im for im in images}

    def need_image(image_id, want_purpose, where):
        im = next((x for x in images if x["image_id"] == image_id
                   and x["purpose"] == want_purpose), None)
        if not im:
            die(f"{where}: no plan image with id {image_id!r} and purpose "
                f"{want_purpose!r}")

    for i, t in enumerate(plan.get("x_tweets") or []):
        where = f"x_tweets[{i}]"
        for k in ("tweet", "hook", "image_id"):
            if not t.get(k):
                die(f"{where}: missing {k!r}")
        need_image(t["image_id"], "x-tweets", where)

    for i, th in enumerate(plan.get("x_threads") or []):
        where = f"x_threads[{i}]"
        for k in ("id", "topic", "variation_label", "tweets"):
            if not th.get(k):
                die(f"{where}: missing {k!r}")
        if not str(th["id"]).startswith("thread-"):
            die(f"{where}: id must start with 'thread-'")
        n = len(th["tweets"])
        if not 5 <= n <= 8:
            die(f"{where}: {n} tweets — threads are 5 to 8 tweets (predefined rule)")
        for j, tw in enumerate(th["tweets"]):
            if not tw.get("text"):
                die(f"{where}.tweets[{j}]: missing text")
        if not th["tweets"][0].get("hook"):
            die(f"{where}: first tweet needs a hook")

    for i, p in enumerate(plan.get("yt_posts") or []):
        where = f"yt_posts[{i}]"
        for k in ("id", "topic", "variation_label", "body_style", "cta_target", "body"):
            if not p.get(k):
                die(f"{where}: missing {k!r}")
        if not str(p["id"]).startswith("yt-post-"):
            die(f"{where}: id must start with 'yt-post-'")
        for j, img in enumerate(p.get("images") or []):
            if not img.get("image_id"):
                die(f"{where}.images[{j}]: missing image_id")
            need_image(img["image_id"], "yt-posts", f"{where}.images[{j}]")

    for i, p in enumerate(plan.get("yt_text_polls") or []):
        where = f"yt_text_polls[{i}]"
        for k in ("id", "topic", "question_text", "options"):
            if not p.get(k):
                die(f"{where}: missing {k!r}")
        if not str(p["id"]).startswith("yt-text-poll-"):
            die(f"{where}: id must start with 'yt-text-poll-'")
        if not 2 <= len(p["options"]) <= 4:
            die(f"{where}: {len(p['options'])} options (2-4 required)")

    for i, p in enumerate(plan.get("x_polls") or []):
        where = f"x_polls[{i}]"
        for k in ("id", "topic", "tweet_text", "hook", "options", "duration",
                  "eligible_topic"):
            if not p.get(k):
                die(f"{where}: missing {k!r} (eligible_topic is the HARD topic filter: "
                    "an X poll exists only for kaspa/tao/toncoin)")
        if str(p["eligible_topic"]).lower() not in X_POLL_TOPICS:
            die(f"{where}: eligible_topic {p['eligible_topic']!r} not in "
                f"{sorted(X_POLL_TOPICS)} — X polls are Kaspa/TAO/Toncoin ONLY")
        if not str(p["id"]).startswith("poll-"):
            die(f"{where}: id must start with 'poll-'")
        if not 2 <= len(p["options"]) <= 4:
            die(f"{where}: {len(p['options'])} options (2-4 required)")

    for i, p in enumerate(plan.get("ig_single") or []):
        where = f"ig_single[{i}]"
        for k in ("id", "caption", "hook", "hashtags", "image_id"):
            if not p.get(k):
                die(f"{where}: missing {k!r}")
        if not str(p["id"]).startswith("ig-"):
            die(f"{where}: id must start with 'ig-'")
        if p.get("kaspa_subject") is not True:
            die(f"{where}: kaspa_subject must be exactly true — IG single-image is "
                "KASPA ONLY (HARD RULE); a non-Kaspa topic gets ZERO IG entries")
        subject = " ".join(str(p.get(f) or "") for f in
                           ("caption", "hook", "id", "source_post"))
        if not KASPA_RX.search(subject):
            die(f"{where}: declared kaspa_subject but no Kaspa term in caption/hook/id/"
                "source_post — the persona-lint gate would flag it; fix the copy")
        need_image(p["image_id"], "ig-single", where)

    return images


# ── entry builders (schemas mirror the queue files' own $post_schema docs) ───

def _now_naive() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _now_z_ms() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds") \
                   .replace("+00:00", "Z")


def build_entries(plan: dict) -> dict:
    """plan -> {plan_key: [full queue entries]} exactly to each file's schema."""
    src = plan["source_transcript"]
    out = {}

    out["x_tweets"] = [{
        "tweet": t["tweet"], "hook": t["hook"], "status": "pending",
        "posted_at": None, "url": None, "views": None, "views_captured_at": None,
        "image_id": t["image_id"],
        "image_path": image_out_rel("x-tweets", t["image_id"],
                                    _slug_for(plan, t["image_id"], "x-tweets")),
    } for t in plan.get("x_tweets") or []]

    out["x_threads"] = [{
        "id": th["id"], "topic": th["topic"], "source_transcript": src,
        "variation_label": th["variation_label"], "created_at": _now_naive(),
        "status": "pending", "posted_at": None, "thread_root_url": None,
        "tweets": [{
            "position": j + 1, "text": tw["text"],
            "hook": tw.get("hook") if j == 0 else None,
            "char_count": len(tw["text"]),
            "posted_url": None, "views": None, "views_captured_at": None,
        } for j, tw in enumerate(th["tweets"])],
    } for th in plan.get("x_threads") or []]

    out["x_polls"] = [{
        "id": p["id"], "topic": p["topic"], "source_transcript": src,
        "tweet_text": p["tweet_text"], "hook": p["hook"], "options": p["options"],
        "duration": p["duration"], "created_at": _now_z_ms(), "status": "pending",
        "posted_at": None, "poll_url": None, "results": None,
        "results_captured_at": None,
    } for p in plan.get("x_polls") or []]

    out["yt_posts"] = [{
        "id": p["id"], "topic": p["topic"], "source_transcript": src,
        "variation_label": p["variation_label"], "body_style": p["body_style"],
        "cta_target": p["cta_target"], "created_at": _now_naive(),
        "status": "pending", "posted_at": None, "post_url": None,
        "body": p["body"], "engagement_question": p.get("engagement_question"),
        "char_count": len(p["body"]),
        "images": [{
            "seq": j + 1, "image_id": img["image_id"],
            "image_path": image_out_rel("yt-posts", img["image_id"],
                                        _slug_for(plan, img["image_id"], "yt-posts")),
            "slide_text": img.get("slide_text"),
        } for j, img in enumerate(p.get("images") or [])],
    } for p in plan.get("yt_posts") or []]

    out["yt_text_polls"] = [{
        "id": p["id"], "topic": p["topic"], "source_post": p.get("source_post"),
        "source_transcript": src, "question_text": p["question_text"],
        "hook": p.get("hook") or p["question_text"].split("\n")[0],
        "options": p["options"],
        "capture_results_after_days": p.get("capture_results_after_days", 7),
        "created_at": _now_naive(), "status": "pending", "posted_at": None,
        "post_url": None, "results": None, "results_captured_at": None,
    } for p in plan.get("yt_text_polls") or []]

    out["ig_single"] = [{
        "id": p["id"], "caption": p["caption"], "hook": p["hook"],
        "hashtags": p["hashtags"],
        "hashtag_placement": p.get("hashtag_placement", "caption_end"),
        "image_id": p["image_id"],
        "image_path": image_out_rel("ig-single", p["image_id"],
                                    _slug_for(plan, p["image_id"], "ig-single")),
        "aspect_ratio": p.get("aspect_ratio", "4:5"), "status": "pending",
        "created_at": _now_naive(), "posted_at": None, "post_url": None,
        "source_post": p.get("source_post"),
    } for p in plan.get("ig_single") or []]

    return out


def _slug_for(plan: dict, image_id: str, purpose: str) -> str:
    im = next(x for x in plan["images"]
              if x["image_id"] == image_id and x["purpose"] == purpose)
    return im["slug"]


# ── the idempotent append ────────────────────────────────────────────────────

def _entry_key(plan_key: str, entry: dict):
    return entry.get("id") or entry.get("image_id") or entry.get("tweet")


def append_to_queues(plan: dict, data_dir: Path = None) -> dict:
    """Append every plan entry to its queue file. Existing ids are SKIPPED and never
    touched. Prints the ENTRY machine lines the graph parses. Returns per-queue
    {added, skipped}."""
    data_dir = Path(data_dir) if data_dir else DATA_DIR_DEFAULT
    entries = build_entries(plan)
    summary = {}
    for plan_key, built in entries.items():
        fname, listkey = QUEUE_FILES[plan_key]
        path = data_dir / fname
        if not built:
            summary[plan_key] = {"added": 0, "skipped": 0}
            continue
        data, indent = load_queue(path, listkey)
        have = {_entry_key(plan_key, e) for e in data[listkey] if isinstance(e, dict)}
        added = skipped = 0
        for e in built:
            key = _entry_key(plan_key, e)
            if key in have:
                print(f"  entry SKIP (present) : {key}  ({fname})")
                skipped += 1
                continue
            data[listkey].append(e)
            have.add(key)
            print(f"  entry ADDED       : {key}  ({fname})")
            added += 1
        if added:
            save_queue(path, data, indent)
        summary[plan_key] = {"added": added, "skipped": skipped}
        print(f"QUEUE {fname} added={added} skipped={skipped} "
              f"total={len(data[listkey])}")
    return summary
