# longform_queue.py — CANONICAL Python port of lib/longform-queue.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Sources the next longform
# to upload directly from data/longs.json and records completed uploads back.
#
# 1:1 port: same allow-list hard rule (YouTube longform is uploaded by Mike BY HAND,
# never queued), same title-keyed write-back, same re-read-before-write so a
# long-running upload cannot clobber another script's edits, same ISO-Z timestamps.

import json
import re
from datetime import datetime, timezone
from pathlib import Path

# __file__ = schedule-tweets/scripts/lib/longform_queue.py -> ST_ROOT = schedule-tweets
ST_ROOT = Path(__file__).resolve().parents[2]
LONGS_JSON = ST_ROOT / "data" / "longs.json"

# Longform fans out to EXACTLY these platforms (see the JS twin's comment for why
# a stray platform pins an entry in the dashboard forever).
ALLOWED_PLATFORMS = {"rumble", "bitchute", "facebook"}


def assert_allowed_platforms(longs):
    bad = []
    for entry in longs or []:
        for plat in (entry.get("platforms") or {}):
            if plat not in ALLOWED_PLATFORMS:
                bad.append(f'"{(entry.get("title") or "?")[:50]}" -> {plat}')
    if bad:
        raise RuntimeError(
            "longs.json has disallowed longform platform(s). Allowed: "
            + ", ".join(sorted(ALLOWED_PLATFORMS))
            + ". YouTube longform is uploaded manually, never queued — remove these:\n  "
            + "\n  ".join(bad))


def resolve_rel(rel):
    """Queue paths (video_path / thumbnail_path) are relative to the schedule-tweets root."""
    if not rel:
        return None
    rel = re.sub(r"^schedule-tweets[\\/]", "", rel)
    return ST_ROOT / rel.replace("/", "\\")


def pick_next_longform(platform):
    """Return {entry, metadata, video_path, thumb_path} for the first long whose
    platforms[platform].status == 'pending', or None. thumb_path is None when
    absent or missing on disk."""
    longs = json.loads(LONGS_JSON.read_text(encoding="utf-8")).get("longs") or []
    assert_allowed_platforms(longs)
    entry = next((l for l in longs
                  if (l.get("platforms") or {}).get(platform, {}).get("status") == "pending"),
                 None)
    if not entry:
        return None
    video_path = resolve_rel(entry.get("video_path"))
    thumb_path = resolve_rel(entry.get("thumbnail_path"))
    if thumb_path and not thumb_path.exists():
        thumb_path = None
    return {"entry": entry, "metadata": entry,
            "video_path": video_path, "thumb_path": thumb_path}


def strip_music_credits(desc):
    """Music-license credits belong ONLY in the YouTube description. Drop any
    paragraph whose first line is a 'Music ... Soundstripe' header."""
    if not desc:
        return desc
    kept = [p for p in re.split(r"\n{2,}", desc)
            if not re.match(r"^\s*music\b[^\n]*soundstripe", p, re.IGNORECASE)]
    return "\n\n".join(kept).strip()


def _now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def record_longform_post(platform, title, url, status="posted"):
    """Record a completed upload back into longs.json (title-keyed row). Without
    this a successful upload leaves the row pending and the NEXT RUN RE-UPLOADS
    THE SAME VIDEO — the duplicate-post near-miss class this write-back closed
    on 2026-08-07. Re-reads the file immediately before writing."""
    if platform not in ALLOWED_PLATFORMS:
        print(f'WARNING: refusing to record unknown platform "{platform}".')
        return False
    if not url:
        print("WARNING: no URL to record — longs.json left pending.")
        return False
    try:
        data = json.loads(LONGS_JSON.read_text(encoding="utf-8"))
        row = next((l for l in data.get("longs") or [] if l.get("title") == title), None)
        if not row or not (row.get("platforms") or {}).get(platform):
            print(f'WARNING: no "{title}" row for {platform} in longs.json — record the URL manually.')
            return False
        row["platforms"][platform]["status"] = status
        row["platforms"][platform]["url"] = url
        row["platforms"][platform]["posted_at"] = _now_iso_z()
        LONGS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n",
                              encoding="utf-8")
        print(f"longs.json updated ✓ ({platform} -> {status})")
        return True
    except Exception as e:
        print(f"WARNING: longs.json write failed ({e}) — record the URL manually.")
        return False
