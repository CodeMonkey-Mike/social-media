"""longform_stage.py — Lane 1: desilence the LOW BPS master + stage the long-form.

Canonical de-fork (2026-08-02) of the six per-batch longform_desilence_<batch>.py
scripts, per Mike's call: the silence method is the DOCUMENTED desilencer
(video-creation/skills/desilencer/scripts/desilence.py, dual-threshold -57/-52 RMS +
8 ms declick), NOT the forks' single-threshold silencedetect — that method is banned
for cut edges (desilencer.md). The forks also predate desilence.py's --nvenc flag;
with it there is no crf-18 intermediate at all: ONE canonical-method pass lands the
staged file at ~0.7 Mbps directly (same end state the forks were shortcutting to,
without the banned detector).

Per the desilencer doctrine the min-silence duration is the ONLY knob and the CALLER
must specify it every run (--min-sil, no default here). Invoked by graph/run.py;
direct use:

    python longform_stage.py --master "<name> LOW BPS.mp4" --slug best-coin-to-buy \
        --min-sil 0.5

Stages into <staged-root>/<slug>/ (one folder per long-form, no-spaces slug):
    <slug>.mp4   desilenced + ~0.7 Mbps (written via .tmp + atomic replace)
    <slug>.png   the thumbnail SHIPPED in the media folder (Mike's PNG) — copied,
                 never generated. Missing PNG = WARN + no thumbnail (schema allows
                 null); more than one PNG = error, pass --thumb explicitly.
The desilence cut/keep map is kept next to the MASTER (working area, not the staged
folder): <media>/<slug>.desilence-map.json.
"""
import argparse
import os
import shutil
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
DESILENCE = os.path.join(REPO_ROOT, "video-creation", "skills", "desilencer",
                         "scripts", "desilence.py")
DEFAULT_STAGED_ROOT = os.path.join(REPO_ROOT, "schedule-tweets", "longform")


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]
    ).decode().strip())


def find_thumbnail(media_dir, explicit):
    if explicit:
        if not os.path.isfile(explicit):
            print(f"--thumb does not exist: {explicit}", file=sys.stderr)
            sys.exit(1)
        return explicit
    pngs = sorted(f for f in os.listdir(media_dir) if f.lower().endswith(".png"))
    if len(pngs) == 1:
        return os.path.join(media_dir, pngs[0])
    if not pngs:
        print("WARN no PNG thumbnail found in the media folder — staging without one "
              "(longs.json thumbnail_path will be null).")
        return None
    print(f"multiple PNGs in the media folder ({', '.join(pngs)}) — pass --thumb to pick one.",
          file=sys.stderr)
    sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Lane 1: desilence + stage the long-form.")
    ap.add_argument("--master", required=True, help='the "<name> LOW BPS.mp4" master')
    ap.add_argument("--slug", required=True, help="no-spaces slug (folder + file name)")
    ap.add_argument("--min-sil", required=True, type=float,
                    help="min silence duration to cut, seconds (the desilencer's one knob; "
                         "the caller decides — no default)")
    ap.add_argument("--thumb", default=None, help="explicit thumbnail PNG (default: the one "
                                                  "PNG shipped in the media folder)")
    ap.add_argument("--staged-root", default=DEFAULT_STAGED_ROOT,
                    help="schedule-tweets/longform (overridable for tests)")
    args = ap.parse_args()

    if not os.path.isfile(args.master):
        print(f"no such file: {args.master}", file=sys.stderr)
        sys.exit(1)
    if not (0.15 <= args.min_sil <= 2.0):
        print(f"--min-sil {args.min_sil}s is outside the sane 0.15-2.0s range.",
              file=sys.stderr)
        sys.exit(1)

    media_dir = os.path.dirname(os.path.abspath(args.master))
    staged_dir = os.path.join(args.staged_root, args.slug)
    os.makedirs(staged_dir, exist_ok=True)
    out = os.path.join(staged_dir, f"{args.slug}.mp4")
    tmp = os.path.join(staged_dir, f"{args.slug}.tmp.mp4")
    map_out = os.path.join(media_dir, f"{args.slug}.desilence-map.json")
    thumb_src = find_thumbnail(media_dir, args.thumb)

    src_d = dur(args.master)
    print(f"lane 1 stage: {src_d:.1f}s master, min-sil {args.min_sil}s, canonical desilencer")

    # The ONE canonical desilencer, its own --nvenc path: dual-threshold method,
    # ~0.7 Mbps out, no intermediate. Its stdout is informative — stream it through.
    r = subprocess.run(
        [sys.executable, DESILENCE, args.master, "--out", tmp,
         "--min-sil", str(args.min_sil), "--nvenc", "--bps", "700k", "--map-out", map_out],
        text=True)
    if r.returncode != 0 or not os.path.isfile(tmp):
        print(f"desilence.py failed (exit {r.returncode})", file=sys.stderr)
        if os.path.exists(tmp):
            os.remove(tmp)
        sys.exit(1)
    os.replace(tmp, out)

    thumb_staged = None
    if thumb_src:
        thumb_staged = os.path.join(staged_dir, f"{args.slug}.png")
        shutil.copy2(thumb_src, thumb_staged)

    od = dur(out)
    size_mb = os.path.getsize(out) / 1e6
    print(f'DONE staged "{out}"  {src_d:.1f}s -> {od:.1f}s  (-{src_d - od:.1f}s)  {size_mb:.0f} MB')
    print(f"THUMB={thumb_staged or 'none'}")
    print(f"MAP={map_out}")
    print(f"OUT_PATH={out}")
    print(f"OUT_DURATION={od:.2f}")
    print(f"REMOVED={src_d - od:.2f}")


if __name__ == "__main__":
    main()
