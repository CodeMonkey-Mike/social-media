"""longs_append.py — Lane 1: append the staged long-form to schedule-tweets/data/longs.json.

Python port (2026-08-02) of the per-batch repurpose/_lane1_*.js writers (frozen as
rollback), carrying both of their guards:
  - EM-DASH GUARD: a '—' anywhere in the entry fails the append (persona hard rule).
  - DUPLICATE-ID GUARD: an existing id fails the append (exit 3) — unless --if-absent,
    which exits 0 with "already present" so a RESUMED graph run can never double-queue
    (the idempotency shape: re-running the queue node is a no-op, not a duplicate).

The judgment fields (title / description / tags) are NOT authored here — they come
from the longform-meta.json the caller wrote before the run (the pre-run seam). This
script is mechanical: schema assembly + guards + atomic write. JSON is written
python-json with ensure_ascii=False (same bytes-shape as the Node writers; NEVER
PowerShell ConvertTo-Json).

    python longs_append.py --slug best-coin-to-buy --meta "<media>/longform-meta.json" \
        --duration 1088.3 [--date 2026-08-02] [--longs-file <path>] [--if-absent]
"""
import argparse
import json
import os
import sys
from datetime import date

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
DEFAULT_LONGS = os.path.join(REPO_ROOT, "schedule-tweets", "data", "longs.json")

PLATFORM_BLOCK = {"status": "pending", "posted_at": None, "url": None,
                  "views": None, "views_captured_at": None}


def write_json_atomic(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, path)


def main():
    ap = argparse.ArgumentParser(description="Append a staged long-form to longs.json.")
    ap.add_argument("--slug", required=True)
    ap.add_argument("--meta", required=True,
                    help="longform-meta.json: {title, description, tags[], batch?, source?}")
    ap.add_argument("--duration", required=True, type=float, help="staged (post-cut) seconds")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD for the id/created_at (default today)")
    ap.add_argument("--longs-file", default=DEFAULT_LONGS)
    ap.add_argument("--staged-root", default=None,
                    help="where longform/<slug>/ actually lives (default: derived from "
                         "--longs-file; pass explicitly when the roots are split, e.g. tests)")
    ap.add_argument("--if-absent", action="store_true",
                    help="exit 0 if the id already exists (idempotent resume path)")
    args = ap.parse_args()

    with open(args.meta, encoding="utf-8") as f:
        meta = json.load(f)
    missing = [k for k in ("title", "description", "tags") if not meta.get(k)]
    if missing:
        print(f"longform-meta.json is missing required field(s): {', '.join(missing)}",
              file=sys.stderr)
        sys.exit(1)
    if not isinstance(meta["tags"], list) or not all(isinstance(t, str) for t in meta["tags"]):
        print("longform-meta.json tags must be a list of strings", file=sys.stderr)
        sys.exit(1)

    d = args.date or date.today().isoformat()
    entry_id = f"lf-{d.replace('-', '')}-{args.slug}"
    staged_root = args.staged_root or os.path.join(
        os.path.dirname(os.path.dirname(args.longs_file)), "longform")
    thumb_rel = f"longform/{args.slug}/{args.slug}.png"
    has_thumb = os.path.isfile(os.path.join(staged_root, args.slug, f"{args.slug}.png"))

    entry = {
        "id": entry_id,
        "batch": meta.get("batch") or args.slug,
        "slug": args.slug,
        "source": meta.get("source") or f"{args.slug.replace('-', ' ')} livestream (desilenced LOW BPS)",
        "video_path": f"longform/{args.slug}/{args.slug}.mp4",
        "thumbnail_path": thumb_rel if has_thumb else None,
        "duration_seconds": round(args.duration, 1),
        "width": 1920,
        "height": 1080,
        "title": meta["title"],
        "description": meta["description"],
        "tags": meta["tags"],
        "categories": {"rumble": {"primary": "Finance & Crypto"}},
        "visibility": "public",
        "platforms": {p: dict(PLATFORM_BLOCK) for p in ("rumble", "bitchute", "facebook")},
        "created_at": d,
    }

    blob = json.dumps(entry, ensure_ascii=False)
    if "—" in blob:
        print("EM DASH in longs entry — fix the meta file (persona hard rule).", file=sys.stderr)
        sys.exit(1)
    if "–" in blob:
        print("WARN: en dash in the entry (allowed, but check it was intended).")

    with open(args.longs_file, encoding="utf-8") as f:
        data = json.load(f)
    if any(l.get("id") == entry_id for l in data["longs"]):
        if args.if_absent:
            print(f"ALREADY-PRESENT id={entry_id}; total {len(data['longs'])}; nothing appended")
            sys.exit(0)
        print(f"duplicate id {entry_id} in longs.json", file=sys.stderr)
        sys.exit(3)

    data["longs"].append(entry)
    write_json_atomic(args.longs_file, data)
    print(f"APPENDED id={entry_id}; total now {len(data['longs'])}; "
          f"dur={entry['duration_seconds']}s; thumb={'yes' if has_thumb else 'null'}")


if __name__ == "__main__":
    main()
