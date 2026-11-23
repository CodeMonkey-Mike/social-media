#!/usr/bin/env python
"""
_register_playlist.py: register the freshly-downloaded playlist tracks into the canonical catalog
video-creation/assets/music/library.json. Reads the skill's library.json (objectID -> license_code +
Algolia meta) and the download progress file (folder + files). Idempotent: upserts by soundstripe_id.
Step 3 of SKILL.md 2b. Python port of _register-playlist.js (2026-11-23).

    python _register_playlist.py <playlistId> [--skip 9141,11370]
"""
import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent))  # video-creation/skills/
from cache_path import cache_dir  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MUSIC_DIR = HERE.parent
RECON = cache_dir("music-sourcing", "recon")
ASSETS = MUSIC_DIR.parent.parent / "assets" / "music"
ASSET_LIB = ASSETS / "library.json"
SKILL_LIB = MUSIC_DIR / "library.json"


def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", str(s).lower().replace("'", ""))
    return re.sub(r"^-+|-+$", "", s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("playlistId", nargs="?", default="430508")
    ap.add_argument("--skip", default="9141,11370")
    a = ap.parse_args()
    skip = {s.strip() for s in (a.skip or "").split(",") if s.strip()}

    skill_lib = json.loads(SKILL_LIB.read_text(encoding="utf-8"))
    skill_by_id = {str(t.get("objectID")): t for t in skill_lib["tracks"]}
    prog = json.loads((RECON / f"playlist-{a.playlistId}-progress.json").read_text(encoding="utf-8"))
    asset_lib = json.loads(ASSET_LIB.read_text(encoding="utf-8"))

    existing_ss_ids = {str(t["soundstripe_id"]) for t in asset_lib["tracks"] if t.get("soundstripe_id") is not None}
    used_ids = {t.get("id") for t in asset_lib["tracks"]}

    added = updated = 0
    for d in prog["done"]:
        if d["id"] in skip:
            continue
        sk = skill_by_id.get(d["id"])
        if not sk:
            print("  no skill-lib entry for", d["id"], d["title"], "- skipping")
            continue
        meta = sk.get("meta") or {}
        folder_rel = f"assets/music/{d['folder']}"
        files = d.get("files") or []
        mp3 = next((f for f in files if f.lower().endswith(".mp3")), None)
        sections = sorted(f for f in files if f.lower().endswith(".wav"))

        # build a compact vibe line from the Algolia tags
        bits = []
        if meta.get("energy"):
            bits.append(f"{meta['energy']}-energy")
        if meta.get("genre"):
            bits.append("/".join(meta["genre"]))
        if meta.get("mood"):
            bits.append("/".join(meta["mood"]).lower())
        if meta.get("characteristic"):
            bits.append(", ".join(meta["characteristic"]).lower())
        vibe = " — ".join(bits)

        # unique id from title slug
        tid = slug(d["title"])
        if tid in used_ids and d["id"] not in existing_ss_ids:
            n = 2
            while f"{tid}-{n}" in used_ids:
                n += 1
            tid = f"{tid}-{n}"
        used_ids.add(tid)

        entry = {
            "id": tid,
            "title": d["title"],
            "artist": ", ".join(a or "" for a in (meta.get("artists") or [])),
            "source": "soundstripe",
            "soundstripe_id": str(d["id"]),
            "url": f"https://www.soundstripe.com/library/songs/{d['id']}",
            "yt_license_code": sk.get("license_code") or None,
            "folder": folder_rel,
            "primary_file": mp3,
            "duration_sec": meta.get("duration_sec") or None,
            "vibe": vibe,
            "genre": meta.get("genre") or [],
            "mood": meta.get("mood") or [],
            "bpm": meta.get("bpm"),
            "energy": meta.get("energy") or None,
            "key": meta.get("key") or None,
            "instrument": meta.get("instrument") or [],
            "characteristic": meta.get("characteristic") or [],
            "has_vocal_version": meta.get("has_vocal_version") or False,
            "metadata_complete": True,
            "sections": sections,
            "sections_note": (
                "WAV section cuts from Soundstripe's Alternate Versions bundle (instrumental / bg-vocal "
                "section mixes). Same yt_license_code covers them." if sections
                else "No Alternate Versions bundle for this track (full track only)."),
            "added_from": f"soundstripe private playlist {a.playlistId}",
            "downloaded_at": sk.get("downloaded_at") or None,
            "used_in": [],
        }

        idx = next((i for i, t in enumerate(asset_lib["tracks"]) if str(t.get("soundstripe_id")) == str(d["id"])), -1)
        if idx >= 0:
            asset_lib["tracks"][idx] = {**asset_lib["tracks"][idx], **entry}
            updated += 1
        else:
            asset_lib["tracks"].append(entry)
            added += 1

    ASSET_LIB.write_text(json.dumps(asset_lib, indent=1, ensure_ascii=False), encoding="utf-8", newline="\n")
    print(f"Registered into assets/music/library.json: +{added} added, {updated} updated. "
          f"Total tracks now: {len(asset_lib['tracks'])}")


if __name__ == "__main__":
    main()
