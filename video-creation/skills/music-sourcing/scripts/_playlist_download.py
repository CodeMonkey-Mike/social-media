#!/usr/bin/env python
"""
_playlist_download.py: batch-download a Soundstripe playlist into the reusable music library. For each
track NOT already present: the full-track mp3 (+ license code, via the documented `download`) THEN the
alternate-versions WAV bundle (instrumentals / section cuts, via `download-alt`), unzipped into the
track's folder, the zip deleted. Step 2 of SKILL.md 2b. Python port of _playlist-download.js (2026-11-23).

    python _playlist_download.py <playlistId> [--limit N] [--skip 9141,11370]

Resumable: progress is kept in video-creation/cache/music-sourcing/recon/playlist-<id>-progress.json,
so re-invoking continues where it left off. SEQUENTIAL by design (shared soundstripe Chrome profile).
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent))  # video-creation/skills/
from cache_path import cache_dir  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MUSIC_DIR = HERE.parent                                   # skills/music-sourcing
RECON = cache_dir("music-sourcing", "recon")
ASSETS = MUSIC_DIR.parent.parent / "assets" / "music"     # video-creation/assets/music
SS = HERE / "soundstripe.py"


def sanitize(name):
    return re.sub(r"\s+", " ", re.sub(r'[<>:"/\\|?*]+', " ", str(name))).strip()


def run_ss(args, label):
    print(f"\n  $ python soundstripe.py {' '.join(args)}", flush=True)
    try:
        subprocess.run([sys.executable, "-u", str(SS), *args], cwd=str(HERE), timeout=300, check=True)
        return True
    except subprocess.TimeoutExpired:
        print(f"  [{label}] exited non-zero: timed out after 300 s")
    except subprocess.CalledProcessError as e:
        print(f"  [{label}] exited non-zero: exit code {e.returncode}")
    return False


def unzip_into(folder):
    """Unpack every zip in the folder into it, strip macOS junk, delete the zip."""
    for zp in [folder / f for f in os.listdir(folder) if f.lower().endswith(".zip")]:
        print(f"  unzip {zp.name}")
        try:
            with zipfile.ZipFile(zp) as z:
                z.extractall(folder)
        except Exception as e:
            print("  unzip err:", str(e).splitlines()[0] if str(e) else type(e).__name__)
            continue
        junk = folder / "__MACOSX"
        if junk.exists():
            shutil.rmtree(junk, ignore_errors=True)
        ds = folder / ".DS_Store"
        if ds.exists():
            ds.unlink()
        zp.unlink()
        print(f"  deleted {zp.name}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("playlistId")
    ap.add_argument("--limit", type=int, default=999)
    ap.add_argument("--skip", default="")
    a = ap.parse_args()
    skip_arg = [s.strip() for s in a.skip.split(",") if s.strip()]

    songs = json.loads((RECON / f"playlist-{a.playlistId}.json").read_text(encoding="utf-8"))["songs"]

    prog_path = RECON / f"playlist-{a.playlistId}-progress.json"
    prog = {"done": [], "failed": [], "skipped": []}
    if prog_path.exists():
        try:
            prog = json.loads(prog_path.read_text(encoding="utf-8"))
        except ValueError:
            pass

    def save_prog():
        prog_path.write_text(json.dumps(prog, indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")

    done_ids = {d["id"] for d in prog["done"]}       # what was done BEFORE this run
    skip_order = list(dict.fromkeys(skip_arg + prog["skipped"]))
    skip_ids = set(skip_order)

    processed = 0
    for s in songs:
        if s["id"] in done_ids or s["id"] in skip_ids:
            continue
        if processed >= a.limit:
            break
        processed += 1
        folder_name = sanitize(s["title"])
        folder = ASSETS / folder_name
        folder.mkdir(parents=True, exist_ok=True)
        print(f"\n=== [{s['id']}] {s['title']}  ->  assets/music/{folder_name} ===")

        if not run_ss(["download", s["id"], "--dest", str(folder)], "download"):
            prog["failed"] = [f for f in prog["failed"] if f["id"] != s["id"]]
            prog["failed"].append({"id": s["id"], "title": s["title"], "folder": folder_name,
                                   "reason": "full-track download failed"})
            save_prog()
            continue  # don't grab alt if the master failed; leave for a retry pass
        # alternate versions (instrumentals / section cuts). Some tracks have none -> non-fatal.
        ok_alt = run_ss(["download-alt", s["id"], "--dest", str(folder)], "download-alt")
        unzip_into(folder)

        files = os.listdir(folder)  # the folder's own listing order, as the JS readdir gave it
        prog["done"] = [d for d in prog["done"] if d["id"] != s["id"]]
        prog["done"].append({"id": s["id"], "title": s["title"], "folder": folder_name, "alt": ok_alt, "files": files})
        prog["failed"] = [f for f in prog["failed"] if f["id"] != s["id"]]
        save_prog()
        print(f"  OK: {len(files)} file(s) in {folder_name}{'' if ok_alt else ' (no alt bundle)'}")

    print("\n──────── progress ────────")
    print(f"playlist total : {len(songs)}")
    print(f"done           : {len(prog['done'])}")
    print(f"skipped(present): {', '.join(skip_order) or '(none)'}")
    failed = prog["failed"]
    print(f"failed         : {len(failed)}"
          + (" -> " + "; ".join(f["id"] + " " + f["title"] for f in failed) if failed else ""))
    now_done = {d["id"] for d in prog["done"]}
    remaining = sum(1 for s in songs
                    if s["id"] not in done_ids and s["id"] not in skip_ids and s["id"] not in now_done)
    print(f"remaining      : {remaining}")


if __name__ == "__main__":
    main()
