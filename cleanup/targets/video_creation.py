#!/usr/bin/env python
"""
video_creation.py: the cleanup policy of video-creation/ (target name: video-creation).

Python port of targets/video-creation.js (2026-11-27; the JS was deleted the same day).

Policy: HYBRID.
  - Protected (never touched): the WHOLE assets/ tree, and every <batch>-progress.json. assets/ is the STATIC,
    REUSABLE shared library (sfx, music, fonts, transitions, vo, banners, broll, STYLE-GUIDE.md, TODO.md):
    nothing in it is spent per-batch output, so it is never swept by age (Mike 2026-07-28: an age sweep was
    flagging durable assets). Per-batch working assets live in the project's OWN folder, not here.
  - Always swept: any _bad-*/ reject folder (whatever its age), including under assets/.
  - Registry-driven (assets/projects/<batch>/, the LEGACY per-batch asset home of shorts batches from before
    2026-06-25; new shorts use shorts/<batch>/render-assets/, covered by the whole-folder shorts tier below):
    keep the folders whose <batch> is ACTIVE in batches.json, recycle those of an ARCHIVED batch; a folder
    that matches no batch is KEPT (assets/ is protected by default). This tier is dormant: assets/projects/
    no longer exists.
  - Age-based (recycled when older than --age-days, default 30): any livestream-repurpose/media entry tied to
    no batch (this protects a just-recorded stream until it ages out or is registered).
  - Whole-folder, batch-aware (recycle the ENTIRE project folder of a completed/archived batch, keep an
    active one, leave an unregistered folder alone):
      * shorts/<batch>/                              matched by the batch's `directories`.
      * longform-presentation/media/<format>/<proj>/ matched by the batch's `source_media`.
      * longform-edited/media/<proj>/                matched by the batch's `source_media`.
      * livestream-repurpose/media/<sub>/            matched by the batch's `source_media` (also loose files
        directly under media/); an entry that matches nothing falls to the age rule.
    For a shorts folder tied to no batch, only the gitignored per-clip artifacts (preview.mp4 /
    whisper-words.json / captions.ts.draft) are swept.
  - remotion/out/: only an ACTIVE batch's render folder is kept (the queue copy of a posted short is the
    canonical one).
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # cleanup/, for lib
from lib import MISSING, age_days, entry_kind, js_str, read_json, scan, walk_files  # noqa: E402

NAME = "video-creation"
# Only the gitignored per-clip artifacts that can be made again, NOT tracked source like whisper.json /
# preview.json / index.html / gen_captions.py.
ARTIFACT_RE = re.compile(r"(preview\.mp4|whisper-words\.json|captions\.ts\.draft)", re.I)
LOGO_RE = re.compile(r"logo-.*\.(png|jpe?g)", re.I)
BAD_RE = re.compile(r"_bad", re.I)
# What counts as loose render / QA output at the remotion/ root.
OUTPUT_EXT_RE = re.compile(r"\.(png|jpe?g|gif|webp|mp4|mov|webm|mkv|mp3|wav|m4a|log)$", re.I)


def load_batches(repo_root):
    """The batch registry (repo-root batches.json). An ACTIVE batch's folders are protected; everything else
    is eligible."""
    data = read_json(os.path.join(repo_root, "batches.json"))
    rows = data.get("batches") if isinstance(data, dict) else None
    return [b for b in rows if isinstance(b, dict)] if isinstance(rows, list) else []


def _slashed(value):
    """A registry path as a lowercased forward-slash string ('' when the field is empty or not text)."""
    return value.replace("\\", "/").lower() if isinstance(value, str) and value else ""


def _dirs(batch):
    d = batch.get("directories")
    return [x for x in d if isinstance(x, str)] if isinstance(d, list) else []


def _status(batch):
    return js_str(batch.get("status", MISSING))


def _id(batch):
    return js_str(batch.get("batch", MISSING))


def plan(repo_root, age_days_max=30):
    root = os.path.join(repo_root, "video-creation")
    recycle = []
    skipped = []

    def keep(path, reason):
        skipped.append({"path": path, "reason": reason})

    def bin_(path, reason):
        recycle.append({"path": path, "reason": reason})

    def classify_age(f, label):
        if age_days(f) >= age_days_max:
            bin_(f, f"{label} (>{age_days_max}d old)")
        else:
            keep(f, f"{label} but too recent (<{age_days_max}d)")

    def by_status(batch, path, kind):
        """Keep an active batch's path; recycle the path of a batch in any other state."""
        if batch.get("status") == "active":
            keep(path, f"{kind} — active batch ({_id(batch)})")
        else:
            bin_(path, f"{kind} — {_status(batch)} batch ({_id(batch)})")

    batches = load_batches(repo_root)
    # batch id (lowercased) -> status, for the assets/projects/<batch>/ registry tier
    batch_status = {str(b["batch"]).lower(): b.get("status") for b in batches if b.get("batch")}

    def batch_for_source(rel_lower):
        """The batch whose source_media is `rel_lower` (a media subfolder or loose file), or lies inside it:
        source_media may name the folder OR a file in it."""
        for b in batches:
            sm = _slashed(b.get("source_media"))
            if sm and (sm == rel_lower or sm.startswith(rel_lower + "/")):
                return b
        return None

    # ── assets/ ──────────────────────────────────────────────────────────────
    assets = os.path.join(root, "assets")
    projects = os.path.join(assets, "projects").lower()
    protect_dirs = {os.path.join(assets, d).lower() for d in ("sfx", "music", "fonts", "transitions")}
    protect_list = [os.path.join(assets, d).lower() for d in ("sfx", "music", "fonts", "transitions")]
    bad_dirs = []

    def on_dir(full, name):
        if BAD_RE.match(name):
            bad_dirs.append(full)                       # do not enter it: the whole folder goes
            return True
        return False

    asset_files = walk_files(assets, skip_dirs=protect_dirs, on_dir=on_dir)
    for d in bad_dirs:
        bin_(d, "reject folder (_bad-*)")

    def project_batch_of(f):
        """For a file under assets/projects/<batch>/..., that <batch> folder name; else None."""
        fl = f.lower()
        if not fl.startswith(projects + os.sep):
            return None
        return os.path.relpath(fl, projects).split(os.sep)[0] or None

    for f in asset_files:
        if LOGO_RE.fullmatch(os.path.basename(f)):
            keep(f, "protected logo")
            continue
        batch = project_batch_of(f)
        if batch:
            status = batch_status.get(batch)
            if status == "active":
                keep(f, f"project asset — active batch ({batch})")
            elif status in ("completed", "archived"):
                bin_(f, f"project asset — {status} batch ({batch})")
            else:
                # no matching batch in the registry: KEEP (assets/ is protected by default)
                keep(f, f'project asset — batch "{batch}" not in registry')
            continue
        # everything else under assets/ is the static shared library: never swept by age
        keep(f, "static shared asset (assets/ is protected)")

    # ── livestream-repurpose/media: whole-folder + loose-file, batch-aware ────
    # media/ holds one SUBFOLDER per livestream (the source .mkv/.mp4 master, LOW BPS re-encodes, working PNGs,
    # encode logs), plus a few loose working files. Each is matched to the batch whose source_media points at
    # it (NOT by livestream_title, which is the name of the LOW-BPS-VERTICAL derivative and never a prefix of
    # the real source file names). The WHOLE folder is recycled for a completed/archived batch and kept for an
    # active one. Anything that matches no batch falls back to the age rule, so a freshly recorded livestream
    # (added today, not yet repurposed into a batch) is protected until it ages out or is registered, while
    # long-dead stray files still go. The media is on YouTube and every re-encode can be made again.
    lsr_media = os.path.join(root, "livestream-repurpose", "media")
    if os.path.isdir(lsr_media):
        for entry in scan(lsr_media):
            full = os.path.join(lsr_media, entry.name)
            rel = f"video-creation/livestream-repurpose/media/{entry.name}".lower()
            kind = "livestream media" if entry_kind(entry) == "dir" else "loose livestream media"
            b = batch_for_source(rel)
            if not b:
                classify_age(full, f"{kind} — not in batch registry")
            else:
                by_status(b, full, kind)

    # ── livestream-repurpose/transcripts: batch-aware ─────────────────────────
    # One folder (or legacy loose file) per livestream. Matched on the batch's OWN `transcripts_dir` pointer
    # first: the folders are named after the LOW BPS master ("robinhood LOW BPS VERTICAL"), NOT after
    # `livestream_title` ("Best Meme Coins on the Robinhood Chain (rh FINAL)"), so the title match below never
    # fired for a real repurpose batch and every transcript was kept forever (Mike 2026-07-22). The title
    # match stays as the fallback for legacy and loose entries.
    titled = [b for b in batches if b.get("livestream_title") and isinstance(b.get("livestream_title"), str)]

    def batch_for_transcript(name):
        rel = f"video-creation/livestream-repurpose/transcripts/{name.lower()}"
        for b in batches:
            td = _slashed(b.get("transcripts_dir")).rstrip("/")
            if td and (td == rel or td.startswith(rel + "/")):
                return b
        best = None
        for b in titled:
            title = b["livestream_title"]
            if name.startswith(title) and (best is None or len(title) > len(best["livestream_title"])):
                best = b
        return best

    tdir = os.path.join(root, "livestream-repurpose", "transcripts")
    if os.path.isdir(tdir):
        for entry in scan(tdir):
            full = os.path.join(tdir, entry.name)
            kind = "transcript folder" if entry_kind(entry) == "dir" else "transcript file"
            b = batch_for_transcript(entry.name)
            if not b:
                keep(full, f"{kind} — not in batch registry")
            else:
                by_status(b, full, kind)

    # ── shorts/<batch>/: the whole project folder, batch-aware (matched by directories) ──
    # Each immediate subfolder of shorts/ is a batch's clip project. The WHOLE folder is recycled for a
    # completed/archived batch and kept for an active one. A folder tied to no batch (_tooling, or a project
    # not registered yet) is left in place: only its gitignored per-clip artifacts are swept, tracked source
    # is left untouched.
    shorts_dir = os.path.join(root, "shorts")
    shorts_batch_by_dir = {}                 # resolved shorts subfolder (lowercased) -> the batch it belongs to
    for b in batches:
        for d in _dirs(b):
            full = os.path.abspath(os.path.join(repo_root, d)).lower()
            if f"{os.sep}shorts{os.sep}" in full:
                shorts_batch_by_dir[full] = b
    if os.path.isdir(shorts_dir):
        for entry in scan(shorts_dir):
            if entry_kind(entry) != "dir":
                continue
            full = os.path.join(shorts_dir, entry.name)
            b = shorts_batch_by_dir.get(full.lower())
            if not b:
                continue                     # an unregistered folder: handled by the artifact sweep below
            by_status(b, full, "shorts project")
    # The per-clip artifact sweep, for shorts files NOT inside a registered batch folder (those are governed
    # whole, above). Unregistered = recycle the heavy artifact only.
    matched_roots = tuple(d + os.sep for d in shorts_batch_by_dir)
    for f in walk_files(shorts_dir):
        if not ARTIFACT_RE.fullmatch(os.path.basename(f)):
            continue
        if matched_roots and f.lower().startswith(matched_roots):
            continue                         # inside a batch folder
        bin_(f, "clip artifact — outside any batch folder")

    # ── remotion/out/: keep ONLY the render folders of active batches ───────────────
    # out/ is disposable scratch: posted shorts live in the schedule-tweets queue, so anything not tied to an
    # active batch can go. (The comps in remotion/src/ follow the same active-batch rule, in
    # cleanup/remotion_comps.py: they need Root.tsx edited, not just a move.)
    out = os.path.join(root, "remotion", "out")
    active_out_dirs = {os.path.abspath(os.path.join(repo_root, d)).lower()
                       for b in batches if b.get("status") == "active" for d in _dirs(b)}
    if os.path.isdir(out):
        for entry in scan(out):
            full = os.path.join(out, entry.name)
            kind = entry_kind(entry)
            if kind == "dir":
                if full.lower() in active_out_dirs:
                    keep(full, "active batch render folder")
                else:
                    bin_(full, "render folder — not an active batch")
            elif kind == "file":
                bin_(full, "loose legacy render (no active batch folder)")

    # ── the remotion/ ROOT: loose render / QA output that leaked OUTSIDE out/ ───────────
    # Renders and QA stills are meant to go into media/<project>/_previews (comp-build.md §10-11); anything
    # that landed as a loose OUTPUT file at the remotion/ root (QA frame grabs `_q_*.png`, `_render_*.log`,
    # stray media) is orphan scratch with no project home. ONLY top-level files with an output extension
    # (image / video / audio / log) are swept: source (.ts/.tsx/.js), config (package*.json, *.config.ts,
    # tsconfig.json) and every subfolder (src/, components/, out/, node_modules/) are left untouched.
    remotion = os.path.join(root, "remotion")
    if os.path.isdir(remotion):
        for entry in scan(remotion):
            if entry_kind(entry) != "file" or not OUTPUT_EXT_RE.search(entry.name):
                continue
            bin_(os.path.join(remotion, entry.name),
                 "loose render/QA output at remotion/ root (belongs in media/<project>/_previews)")

    # ── media/<project>/ project trees: whole-folder, batch-aware (matched by source_media) ──
    # Each immediate subfolder holds one batch's source and render artifacts (master .mkv, EDIT/FINAL renders,
    # intermediates, deck, transcript, thumbnail). The WHOLE folder is recycled for a completed/archived
    # batch, kept for an active one, and LEFT ALONE when it maps to no batch (it cannot be classified safely).
    # ONLY media/<project>/ subfolders are eligible: each track's skill doc, scripts/ and decks are never
    # touched. source_media may be the project FOLDER or a FILE in it, so the match is on the path prefix.
    lfp_media = os.path.join(root, "longform-presentation", "media")
    lfe_media = os.path.join(root, "longform-edited", "media")
    vap_media = os.path.join(root, "vertical-ai-persona", "media")
    yuli_media = os.path.join(root, "yuli-y-ana", "media")

    def subfolders(folder):
        return [e.name for e in scan(folder) if entry_kind(e) == "dir"] if os.path.isdir(folder) else []

    def classify_media_projects(media_dir, rel_prefix, label):
        for name in subfolders(media_dir):
            full = os.path.join(media_dir, name)
            b = batch_for_source(f"{rel_prefix}/{name}".lower())
            if not b:
                keep(full, f"{label} project — not in batch registry (left alone)")
            else:
                by_status(b, full, f"{label} project")

    # longform-presentation nests one level deeper: media/<format>/<project>/ (Mike, 2026-10-31; the format
    # folders are deck-lecture / desilence-only / vscode-coding / standard). A format folder is never itself
    # a project, so the projects inside each one are classified.
    formats = subfolders(lfp_media)
    for fmt in formats:
        classify_media_projects(os.path.join(lfp_media, fmt),
                                f"video-creation/longform-presentation/media/{fmt}", f"longform-presentation/{fmt}")
    classify_media_projects(lfe_media, "video-creation/longform-edited/media", "longform-edited")
    # vertical-ai-persona main-likeness projects ARE batch-tracked (e.g. kaspa-covenants-short).
    classify_media_projects(vap_media, "video-creation/vertical-ai-persona/media", "vertical-ai-persona")
    # Yuli y Ana is a SEPARATE persona channel NOT tracked in batches.json; with no batch match every folder
    # is "left alone" by design: these concept folders are a reusable library and must never be recycled by
    # this tool (recycle one only on an explicit, per-folder instruction).
    classify_media_projects(yuli_media, "video-creation/yuli-y-ana/media", "yuli-y-ana")

    # Empty folders left after a recycle pass are pruned by the engine across these roots, so a cleaned-out
    # <batch>/ or render folder never lingers. assets/ is NOT a prune root: the whole tree is protected, so an
    # empty shared-library folder is left exactly as the user left it.
    prune_roots = [
        shorts_dir,
        out,
        os.path.join(root, "livestream-repurpose", "media"),
        os.path.join(root, "livestream-repurpose", "transcripts"),
        # Each longform-presentation FORMAT folder is its own root (a root is never pruned), so an emptied
        # standard/ etc. survives for the next project of that format.
        *[os.path.join(lfp_media, fmt) for fmt in formats],
        lfe_media,
        vap_media,
        yuli_media,
    ]
    return {"name": NAME, "recycle": recycle, "skipped": skipped, "prune_roots": prune_roots,
            "prune_skip_dirs": protect_list}
