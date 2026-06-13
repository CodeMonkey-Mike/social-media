#!/usr/bin/env python3
"""
publish-shorts.py — move a finalized shorts batch into the publishing queue.

Takes the rendered MP4s for a batch and (1) copies them into the schedule-tweets
queue folder, then (2) appends one STUB entry per clip to schedule-tweets/data/shorts.json
with every platform set to status="pending" (which is what the post-*.js scripts pick up).

Stub model: the mechanical fields are filled automatically (id, batch, slug, source, video_path,
width/height, duration, the platform blocks). `batch` is the registered batches.json id (the
<batch> arg) and is the join key used to compute when a batch is fully posted. `title` is pulled
from the batch progress JSON when available. `hook`, `caption`, and `tags` are left blank for you to fill in before posting.

Usage:
    python scripts/publish-shorts.py <batch> [--date YYYY-MM-DD] [--id-prefix mc] [--dry-run]

Example:
    python scripts/publish-shorts.py meme-coins
    python scripts/publish-shorts.py meme-coins --date 2026-05-28 --dry-run

Idempotent: skips ids already in shorts.json and never overwrites an MP4 already copied.
"""
import argparse
import datetime as dt
import json
import re
import shutil
import subprocess
from collections import OrderedDict
from pathlib import Path

# scripts/ lives directly under the social-media repo root.
REPO_ROOT = Path(__file__).resolve().parent.parent

PLATFORMS = ["yt_shorts", "ig_reels", "x", "tiktok", "facebook", "rumble", "bitchute"]
NUM_PREFIX = re.compile(r"^(\d+)-")  # leading "1-", "2-", ... on render filenames


def derive_prefix(batch: str) -> str:
    """meme-coins -> mc, market-update -> mu, toccata -> t."""
    return "".join(w[0] for w in batch.split("-") if w) or batch[:2]


def slug_from_filename(stem: str) -> str:
    return NUM_PREFIX.sub("", stem)


def sort_key(p: Path):
    m = NUM_PREFIX.match(p.stem)
    return (int(m.group(1)) if m else 9999, p.stem)


def ffprobe_dims_duration(mp4: Path):
    """Return (width, height, duration_seconds) via ffprobe, or (None, None, None)."""
    if not shutil.which("ffprobe"):
        return None, None, None
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height:format=duration",
             "-of", "json", str(mp4)],
            stderr=subprocess.STDOUT,
        )
        info = json.loads(out)
        st = (info.get("streams") or [{}])[0]
        w = st.get("width")
        h = st.get("height")
        dur = info.get("format", {}).get("duration")
        dur = round(float(dur), 2) if dur is not None else None
        return w, h, dur
    except Exception:
        return None, None, None


def platform_block():
    return OrderedDict([
        ("status", "pending"),
        ("posted_at", None),
        ("url", None),
        ("views", None),
        ("views_captured_at", None),
        ("caption_override", None),
    ])


def build_entry(*, id_, batch, slug, source_livestream, video_path, duration, width, height, title):
    return OrderedDict([
        ("id", id_),
        ("batch", batch),
        ("slug", slug),
        ("source_livestream", source_livestream),
        ("source_clip", slug),
        ("video_path", video_path),
        ("thumbnail_path", None),
        ("duration_seconds", duration),
        ("width", width if width is not None else 1080),
        ("height", height if height is not None else 1920),
        ("title", title),
        ("hook", ""),
        ("caption", ""),
        ("tags", []),
        ("platforms", OrderedDict([(p, platform_block()) for p in PLATFORMS])),
        ("created_at", dt.datetime.now().replace(microsecond=0).isoformat()),
    ])


def load_titles(progress_json: Path):
    """slug -> title from the batch progress JSON, if it exists."""
    if not progress_json.is_file():
        return {}
    try:
        data = json.loads(progress_json.read_text(encoding="utf-8"))
        return {c["slug"]: c.get("title", "") for c in data.get("clips", []) if "slug" in c}
    except Exception:
        return {}


def main():
    ap = argparse.ArgumentParser(description="Move a finalized shorts batch into the publishing queue.")
    ap.add_argument("batch", help="batch name, e.g. meme-coins (matches remotion/out/<batch>/)")
    ap.add_argument("--date", default=dt.date.today().isoformat(), help="YYYY-MM-DD (default: today)")
    ap.add_argument("--id-prefix", default=None, help="id prefix (default: derived from batch, e.g. mc)")
    ap.add_argument("--out-root", default=str(REPO_ROOT / "video-creation" / "remotion" / "out"))
    ap.add_argument("--dest-root", default=str(REPO_ROOT / "schedule-tweets" / "shorts"))
    ap.add_argument("--shorts-json", default=str(REPO_ROOT / "schedule-tweets" / "data" / "shorts.json"))
    ap.add_argument("--progress-json", default=None,
                    help="default: video-creation/shorts/<batch>-progress.json")
    ap.add_argument("--dry-run", action="store_true", help="print what would happen; write nothing")
    args = ap.parse_args()

    batch = args.batch
    date = args.date
    date_compact = date.replace("-", "")
    prefix = args.id_prefix or derive_prefix(batch)
    source_livestream = f"{batch}-{date}"

    src_dir = Path(args.out_root) / batch
    dest_dir = Path(args.dest_root) / f"{batch}-{date}"
    shorts_json = Path(args.shorts_json)
    progress_json = Path(args.progress_json) if args.progress_json \
        else REPO_ROOT / "video-creation" / "shorts" / f"{batch}-progress.json"

    if not src_dir.is_dir():
        raise SystemExit(f"ERROR: render folder not found: {src_dir}")
    mp4s = sorted(src_dir.glob("*.mp4"), key=sort_key)
    if not mp4s:
        raise SystemExit(f"ERROR: no .mp4 files in {src_dir}")

    titles = load_titles(progress_json)

    data = json.loads(shorts_json.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    existing_ids = {s["id"] for s in data["shorts"]}

    print(f"Batch '{batch}'  date {date}  prefix '{prefix}'")
    print(f"  source : {src_dir}")
    print(f"  dest   : {dest_dir}")
    print(f"  queue  : {shorts_json}")
    print(f"  titles : {'progress JSON' if titles else 'none found — title will be blank'}")
    print(f"  found  : {len(mp4s)} mp4(s)\n")

    if not args.dry_run:
        dest_dir.mkdir(parents=True, exist_ok=True)

    added = 0
    skipped = 0
    copied = 0
    for mp4 in mp4s:
        slug = slug_from_filename(mp4.stem)
        id_ = f"{prefix}-{date_compact}-{slug}"
        video_path = f"shorts/{batch}-{date}/{mp4.name}"
        dest_file = dest_dir / mp4.name

        # 1. copy the MP4 into the queue folder
        if dest_file.exists():
            print(f"  copy SKIP (exists): {mp4.name}")
        elif args.dry_run:
            print(f"  copy [dry-run]    : {mp4.name} -> {video_path}")
        else:
            shutil.copy2(mp4, dest_file)
            copied += 1
            print(f"  copied            : {mp4.name} -> {video_path}")

        # 2. append the stub entry
        if id_ in existing_ids:
            print(f"  entry SKIP (present): {id_}\n")
            skipped += 1
            continue
        w, h, dur = ffprobe_dims_duration(mp4)
        entry = build_entry(
            id_=id_, batch=batch, slug=slug, source_livestream=source_livestream,
            video_path=video_path, duration=dur, width=w, height=h,
            title=titles.get(slug, ""),
        )
        if args.dry_run:
            print(f"  entry [dry-run]   : {id_}  (title={entry['title']!r}, dur={dur})\n")
        else:
            data["shorts"].append(entry)
            existing_ids.add(id_)
            print(f"  entry ADDED       : {id_}  (title={entry['title']!r}, dur={dur})\n")
        added += 1

    if not args.dry_run and added:
        shorts_json.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    verb = "would add" if args.dry_run else "added"
    print(f"Done. {verb} {added}, skipped {skipped} existing, copied {copied} file(s). "
          f"shorts.json has {len(data['shorts'])} entries.")
    if added and not args.dry_run:
        print("\nNEXT: fill in hook / caption / tags for the new stub entries in shorts.json")
        print("  -> Write them in Mike's PERSONA VOICE: read persona/persona.json first")
        print("     (no em dashes, cashtags, hashtags on their own line, etc.).")
        print("  -> Then run `python scripts/persona-lint.py` to catch any AI-tells before posting.")


if __name__ == "__main__":
    main()
