"""encode_low_bps.py — Phase 1 Step 1: high-bitrate source -> "<name> LOW BPS.mp4".

Python port (2026-08-02) of the inline ffmpeg command in
video-creation/livestream-repurpose/skills/intake-verticalize/SKILL.md Step 1 — the
command is frozen VERBATIM (NVENC single-pass VBR 700k/1000k/1400k, aac 96k); this
script only adds the documented source-housekeeping and progress reporting so the
intake graph can supervise it. Invoked by graph/run.py (Wave 1); direct use:

    python encode_low_bps.py "<media>/<folder>/<recording>.(mkv|mp4|mov)"

Housekeeping (per the skill, "don't ask, just do it and mention it"): OBS names
recordings with a timestamp, but the whole naming chain (LOW BPS -> VERTICAL ->
transcripts/) keys off the source filename — so the source is renamed to match its
FOLDER name before encoding. The container swap (.mkv -> .mp4) is free because we
re-encode anyway.

Output name is derived, never chosen: "<folder name> LOW BPS.mp4" next to the source.
Prints PROGRESS lines (parsed by the graph heartbeat) and OUT_DURATION= at the end.
Re-running overwrites the LOW BPS file (pure derivation — safe to redo).
"""
import argparse
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

VIDEO_EXTS = {".mp4", ".mkv", ".mov"}


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]
    ).decode().strip())


def housekeep(source: str) -> str:
    """Rename the source to match its folder (the load-bearing naming rule)."""
    folder = os.path.dirname(os.path.abspath(source))
    stem_target = os.path.basename(folder)
    stem, ext = os.path.splitext(os.path.basename(source))
    if stem == stem_target:
        return os.path.abspath(source)
    target = os.path.join(folder, stem_target + ext)
    if os.path.exists(target):
        print(f"FATAL: cannot rename source to match folder — '{target}' already exists.",
              file=sys.stderr)
        sys.exit(1)
    os.rename(source, target)
    print(f'renamed source to match its folder: "{os.path.basename(source)}" -> '
          f'"{os.path.basename(target)}"')
    return target


def run_ffmpeg_with_progress(cmd, total_s, label):
    """Run ffmpeg (-progress pipe:1 already in cmd), tee curated PROGRESS lines.
    stderr is merged so a warning flood can never deadlock the pipe; non-progress
    lines are kept as the error tail."""
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, encoding="utf-8", errors="replace")
    tail = []
    last_pct = -5
    for line in proc.stdout:
        line = line.strip()
        m = re.match(r"out_time=(\d+):(\d+):([\d.]+)", line)
        if m:
            t = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
            pct = min(100, int(100 * t / total_s)) if total_s else 0
            if pct >= last_pct + 2:
                print(f"PROGRESS {pct}% t={int(t) // 60:02d}:{int(t) % 60:02d} ({label})",
                      flush=True)
                last_pct = pct
        elif "=" not in line and line:            # ffmpeg -v warning: real messages only
            tail.append(line)
            if len(tail) > 40:
                tail.pop(0)
    proc.wait()
    return proc.returncode, "\n".join(tail)


def main():
    ap = argparse.ArgumentParser(description="Phase 1 Step 1: source -> LOW BPS master.")
    ap.add_argument("source", help="the raw recording inside its named media folder")
    ap.add_argument("--out", default=None, help="override output path (default: derived)")
    args = ap.parse_args()

    if not os.path.isfile(args.source):
        print(f"no such file: {args.source}", file=sys.stderr)
        sys.exit(1)
    stem, ext = os.path.splitext(os.path.basename(args.source))
    if ext.lower() not in VIDEO_EXTS:
        print(f"not a video source ({ext}) — expected one of {sorted(VIDEO_EXTS)}",
              file=sys.stderr)
        sys.exit(1)
    if stem.endswith(" LOW BPS"):
        print("source is already a LOW BPS file — point this at the RAW recording.",
              file=sys.stderr)
        sys.exit(1)

    src = housekeep(args.source)
    folder = os.path.dirname(src)
    name = os.path.splitext(os.path.basename(src))[0]
    out = args.out or os.path.join(folder, f"{name} LOW BPS.mp4")

    total = dur(src)
    if os.path.exists(out):
        print(f"note: overwriting existing LOW BPS file (re-run): {out}")
    print(f'encoding "{os.path.basename(src)}" ({total:.1f}s) -> "{os.path.basename(out)}"')

    # The skill's Step 1 command, verbatim (+ progress/verbosity transport only).
    cmd = ["ffmpeg", "-y", "-hide_banner", "-v", "warning", "-progress", "pipe:1",
           "-nostats", "-i", src,
           "-c:v", "h264_nvenc", "-b:v", "700k", "-maxrate", "1000k", "-bufsize", "1400k",
           "-preset", "p5", "-c:a", "aac", "-b:a", "96k", out]
    rc, tail = run_ffmpeg_with_progress(cmd, total, "LOW BPS encode")
    if rc != 0:
        print(f"FFMPEG FAIL (exit {rc}):\n{tail[-1500:]}", file=sys.stderr)
        sys.exit(1)

    od = dur(out)
    size_mb = os.path.getsize(out) / 1e6
    print(f'DONE "{out}"  {total:.1f}s -> {od:.1f}s  {size_mb:.0f} MB')
    print(f"OUT_PATH={out}")
    print(f"OUT_DURATION={od:.2f}")


if __name__ == "__main__":
    main()
