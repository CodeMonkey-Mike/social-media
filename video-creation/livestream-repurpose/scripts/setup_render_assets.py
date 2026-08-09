"""setup_render_assets.py — stage a SHORTS batch's render-ready assets into its OWN
self-contained public dir: video-creation/shorts/<batch>/render-assets/.

Python port of scripts/setup-batch-render-assets.js (Wave 4/5 of the livestream-repurpose
LangGraph migration; the JS stays frozen as rollback). Two upgrades over the JS, both fixing
documented failure modes:

  1. SPINE SELECTION is current: the JS predates 5B/5C and staged `tightened.mp4` only.
     This stages the clip's FINAL spine — `<slug>-final.mp4` (5C output) first, then
     `<slug>-tightened-desilenced.mp4`, then legacy `tightened.mp4` — and SAYS which it used.
  2. THE GOP RE-ENCODE IS BUILT IN, not a copy-pasted ffmpeg recipe: desilenced spines ship a
     250-frame GOP with B-frames, and Remotion's 8 concurrent OffthreadVideo seeks then fail
     intermittently with "No frame found at position N" and kill the render mid-way
     (2026-08-05 finding). Every staged spine is re-encoded seek-friendly
     (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0, audio stream-copied) and the result is
     GOP-verified. The canonical spine in the clip folder is NEVER touched.

We COPY (never junction) the shared SFX/logos a comp references — a junction inside
shorts/<batch>/ would be FOLLOWED by cleanup's recursive delete and recycle the real shared
library. Copies are transient and recycled with the batch.

Usage:
    python video-creation/livestream-repurpose/scripts/setup_render_assets.py <batch>
        [--data <dataFile.ts>] [--out-base DIR] [--assets-root DIR] [--crf 17] [--force]

    <batch>        batch id (folder name under video-creation/shorts/)
    --data FILE    OPTIONAL Remotion data/constants file. Every staticFile('X') it references
                   that exists under the shared assets root is COPIED into render-assets/X
                   (preserving subpaths). Run once early (spines), again with --data once the
                   constants file exists (builders may keep using it per clip).
    --out-base     the batch folder (default video-creation/shorts/<batch>; sandbox override)
    --assets-root  shared assets root (default video-creation/assets; sandbox override)
    --force        re-encode a spine even if the staged copy is current

Idempotent: a staged spine that is newer than its source and duration-matched is skipped, so
re-runs (graph --resume, a second --data pass) never re-encode for nothing.

Machine lines (the graph parses these):
    RENDER-ASSETS=<abs path>
    SPINE slug=<slug> src=<basename> dur=<s> [reused]
    SHARED <rel>  /  MISSING <rel>
    DATA-REFS total=N copied=A present=B missing=C
    STAGE-DONE assets
"""
import argparse
import json
import shutil
import subprocess
import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[3]

# FINAL spine first; legacy names only as loud fallbacks (old batches predate 5B/5C).
SPINE_CANDIDATES = ["{slug}-final.mp4", "{slug}-tightened-desilenced.mp4", "tightened.mp4"]

STATICFILE_RE = re.compile(r"staticFile\(\s*[`'\"]([^`'\"]+)[`'\"]\s*\)")


def die(msg):
    print(f"FATAL: {msg}", file=sys.stderr, flush=True)
    sys.exit(2)


def ffprobe_duration(path):
    try:
        return float(subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(path)]).decode().strip())
    except Exception:
        return None


def verify_gop(path):
    """Seek-friendliness: no B-frames, and a keyframe at least every 25 packets
    across the first ~300 video packets. Returns an error string or None."""
    try:
        bf = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=has_b_frames", "-of", "csv=p=0", str(path)]).decode().strip()
        if bf not in ("0", ""):
            return f"has_b_frames={bf} (want 0)"
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "packet=flags", "-of", "csv=p=0", "-read_intervals", "%+10",
             str(path)]).decode()
        flags = [l.strip().rstrip(",") for l in out.splitlines() if l.strip()]
        if not flags:
            return "no video packets probed"
        gap, worst = 0, 0
        for f in flags[:300]:
            if "K" in f:
                gap = 0
            else:
                gap += 1
                worst = max(worst, gap)
        if worst >= 25:
            return f"keyframe gap {worst + 1} packets in the probed window (want <=25)"
        return None
    except Exception as e:
        return f"gop probe failed: {e}"


def find_spine(clip_dir: Path, slug: str):
    for pat in SPINE_CANDIDATES:
        p = clip_dir / pat.format(slug=slug)
        if p.is_file():
            return p
    return None


def stage_spine(src: Path, dest: Path, crf: int, force: bool):
    """GOP re-encode src -> dest (render copy only). Returns (duration, reused)."""
    sdur = ffprobe_duration(src)
    if sdur is None:
        die(f"cannot probe spine: {src}")
    if dest.is_file() and not force:
        ddur = ffprobe_duration(dest)
        if (ddur is not None and abs(ddur - sdur) <= 0.2
                and dest.stat().st_mtime >= src.stat().st_mtime
                and verify_gop(dest) is None):
            return ddur, True
    tmp = dest.with_suffix(".part.mp4")
    rc = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(src),
         "-c:v", "libx264", "-crf", str(crf), "-preset", "medium",
         "-g", "25", "-keyint_min", "25", "-bf", "0", "-sc_threshold", "0",
         "-c:a", "copy", str(tmp)]).returncode
    if rc != 0 or not tmp.is_file():
        tmp.unlink(missing_ok=True)
        die(f"GOP re-encode failed (exit {rc}) for {src.name}")
    ddur = ffprobe_duration(tmp)
    if ddur is None or abs(ddur - sdur) > 0.2:
        die(f"{src.name}: staged duration {ddur} != source {sdur:.2f} (±0.2s)")
    err = verify_gop(tmp)
    if err:
        die(f"{src.name}: staged spine failed the GOP check — {err}")
    tmp.replace(dest)
    return ddur, False


def main():
    ap = argparse.ArgumentParser(
        description="Stage a shorts batch's render-assets (final spines GOP re-encoded, "
                    "shared staticFile refs copied).")
    ap.add_argument("batch")
    ap.add_argument("--data", default=None)
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--assets-root", default=None)
    ap.add_argument("--crf", type=int, default=17)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    out_base = Path(args.out_base) if args.out_base else (
        REPO_ROOT / "video-creation" / "shorts" / args.batch)
    assets_root = Path(args.assets_root) if args.assets_root else (
        REPO_ROOT / "video-creation" / "assets")
    if not out_base.is_dir():
        die(f"batch folder not found: {out_base} (cut_topics writes shorts/<batch>/)")

    render_assets = out_base / "render-assets"
    render_assets.mkdir(parents=True, exist_ok=True)
    print(f"RENDER-ASSETS={render_assets}", flush=True)

    clip_dirs = sorted(d for d in out_base.iterdir()
                       if d.is_dir() and d.name != "render-assets")
    spines = 0
    for i, d in enumerate(clip_dirs):
        slug = d.name
        src = find_spine(d, slug)
        if src is None:
            continue
        if src.name == "tightened.mp4":
            print(f"NOTE {slug}: staging legacy tightened.mp4 (no -final / "
                  "-tightened-desilenced spine found)", flush=True)
        dur, reused = stage_spine(src, render_assets / f"{slug}.mp4", args.crf, args.force)
        spines += 1
        print(f"SPINE slug={slug} src={src.name} dur={dur:.3f}"
              + (" reused" if reused else ""), flush=True)
        print(f"PROGRESS {int(100 * (i + 1) / max(1, len(clip_dirs)))}% "
              f"spine {i + 1}/{len(clip_dirs)}", flush=True)
    if spines == 0:
        print("(no clip spine found yet — re-run after tighten/5C)", flush=True)

    if args.data:
        data_path = Path(args.data)
        if not data_path.is_absolute():
            data_path = REPO_ROOT / args.data
        if not data_path.is_file():
            die(f"--data file not found: {data_path}")
        refs = sorted(set(STATICFILE_RE.findall(
            data_path.read_text(encoding="utf-8", errors="replace"))))
        copied, present, missing = 0, 0, []
        for rel in refs:
            dest = render_assets / rel
            if dest.exists():
                present += 1
                continue
            shared = assets_root / rel
            if shared.is_file():
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(shared, dest)   # copy, NEVER junction (cleanup follows links)
                copied += 1
                print(f"SHARED {rel}", flush=True)
            else:
                missing.append(rel)
                print(f"MISSING {rel}", flush=True)
        print(f"DATA-REFS total={len(refs)} copied={copied} present={present} "
              f"missing={len(missing)}", flush=True)
        if missing:
            print("NOTE: missing refs must be generated INTO render-assets before the "
                  "render (b-roll, thumb):", flush=True)
            for r in missing:
                print(f"    - {r}", flush=True)

    print(f"\nRender this batch with:\n  --public-dir "
          f"video-creation/shorts/{args.batch}/render-assets", flush=True)
    print("STAGE-DONE assets", flush=True)


if __name__ == "__main__":
    main()
