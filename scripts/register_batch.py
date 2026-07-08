"""
register_batch.py — upsert a video-creation batch into the repo-root batches.json registry.

WHY THIS EXISTS: cleanup/targets/video-creation.js protects ONLY the `directories` of
`status:"active"` batches in batches.json and recycles everything else. A batch that is
created (shorts/<batch>/ + progress.json) but never registered here is UNPROTECTED and can
be deleted. So every cut_topics_<batch>.py should call register_batch() right after it writes
the dashboard + progress.json. See video-creation/SKILL.md Phase 4b.

Use as a library:
    from register_batch import register_batch
    register_batch(batch="353x", date="2026-06-03",
                   livestream_title="My new 353x LOW BPS VERTICAL",
                   source_media=".../X VERTICAL.mp4", transcripts_dir=".../X VERTICAL",
                   dashboard="video-creation/shorts/353x/dashboard.html")

Or from the CLI:
    python scripts/register_batch.py --batch 353x --date 2026-06-03 \
        --title "My new 353x LOW BPS VERTICAL" --dashboard video-creation/shorts/353x/dashboard.html

Idempotent: upserts by `batch` name (replaces an existing entry, never duplicates).
"""
import json, os, argparse


def repo_root():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # scripts/ -> repo root


def make_entry(batch, date, livestream_title, *, source_media=None, transcript_plain=None,
               transcripts_dir=None, dashboard=None, status="active", shorts="active",
               repurpose="pending", shorts_source=None, note=None, directories=None):
    # default transcript_plain from the transcripts_dir (the standard naming)
    if transcript_plain is None and transcripts_dir:
        leaf = os.path.basename(transcripts_dir.rstrip("/"))
        transcript_plain = f"{transcripts_dir}/{leaf}_plain.txt"
    if directories is None:
        directories = [f"video-creation/remotion/out/{batch}", f"video-creation/shorts/{batch}"]
    entry = {
        "batch": batch, "status": status, "date": date,
        "livestream_title": livestream_title, "shorts_source": shorts_source,
        "source_media": source_media, "transcript_plain": transcript_plain,
        "transcripts_dir": transcripts_dir, "dashboard": dashboard,
        "directories": directories,
        "pipelines": {"shorts": shorts, "repurpose": repurpose},
    }
    if note:
        entry["note"] = note
    return entry


def upsert(entry, root=None):
    root = root or repo_root()
    p = os.path.join(root, "batches.json")
    d = json.load(open(p, encoding="utf-8"))
    batches = d.setdefault("batches", [])
    name = entry["batch"]
    for i, b in enumerate(batches):
        if b.get("batch") == name:
            batches[i] = entry          # replace in place (preserve ordering)
            action = "updated"
            break
    else:
        batches.insert(0, entry)        # newest first
        action = "inserted"
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2)
    print(f"batches.json: {action} '{name}'  (status={entry['status']})")
    return p


def register_batch(**kwargs):
    """Convenience: build + upsert in one call. Same kwargs as make_entry."""
    return upsert(make_entry(**kwargs))


def _cli():
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--title", dest="livestream_title", required=True)
    ap.add_argument("--source-media", dest="source_media")
    ap.add_argument("--transcripts-dir", dest="transcripts_dir")
    ap.add_argument("--dashboard")
    ap.add_argument("--status", default="active")
    ap.add_argument("--shorts", default="active")
    ap.add_argument("--repurpose", default="pending")
    ap.add_argument("--shorts-source", dest="shorts_source")
    ap.add_argument("--note")
    a = ap.parse_args()
    register_batch(**{k: v for k, v in vars(a).items() if v is not None})


if __name__ == "__main__":
    _cli()
