"""verticalize.py — Phase 1 Step 1B: "<name> LOW BPS.mp4" -> "<name> LOW BPS VERTICAL.mp4".

Python port (2026-08-02) of the inline ffmpeg command in
video-creation/livestream-repurpose/skills/intake-verticalize/SKILL.md Step 1B — the
GPU filtergraph, the learned Premiere framing (face 258% at -1317,1005 behind /
content 81% at 696,416 on top), the bitrate rule (-rc vbr 600k/800k, NEVER -cq) and
all three GPU gotchas are frozen VERBATIM. This script only adds progress reporting
and the skill's mandatory output probe. Invoked by graph/run.py (Wave 1); direct use:

    python verticalize.py "<media>/<folder>/<name> LOW BPS.mp4" [--cpu]

--cpu is the skill's documented CPU-filter fallback (scale/overlay on CPU, still
NVENC encode) for when the CUDA filters are unavailable. There is NO auto-fallback:
one attempt per run — if CUDA fails, the error is printed and the caller decides
(zero-retry doctrine).

The probe is not optional: output must read 1080x1920, SAR 1:1 (scale_cuda stamps
SAR 256:81 without the final setsar=1 and the video renders STRETCHED).
"""
import argparse
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CUDA_FILTER = (
    "color=c=black:s=1080x1920,format=nv12,hwupload[bg];"
    "[0:v]split=2[v0][v1];"
    "[v0]scale_cuda=4954:2786[face];[v1]scale_cuda=1555:875[content];"
    "[bg][face]overlay_cuda=x=-3794:y=-388:shortest=1[t];"
    "[t][content]overlay_cuda=x=-82:y=-21[vg];[vg]setsar=1[vgo]"
)
CPU_FILTER = (
    "[0:v]scale=4954:2786,setsar=1[face];[0:v]scale=1555:875,setsar=1[content];"
    "color=c=black:s=1080x1920[bg];[bg][face]overlay=-3794:-388[t];"
    "[t][content]overlay=-82:-21[v]"
)


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]
    ).decode().strip())


def probe_geometry(p):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,sample_aspect_ratio,display_aspect_ratio",
         "-of", "csv=p=0", p]).decode().strip()
    parts = out.split(",")
    return (int(parts[0]), int(parts[1]),
            parts[2] if len(parts) > 2 else "?", parts[3] if len(parts) > 3 else "?")


def run_ffmpeg_with_progress(cmd, total_s, label):
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
        elif "=" not in line and line:
            tail.append(line)
            if len(tail) > 40:
                tail.pop(0)
    proc.wait()
    return proc.returncode, "\n".join(tail)


def main():
    ap = argparse.ArgumentParser(description="Phase 1 Step 1B: LOW BPS -> VERTICAL (9:16).")
    ap.add_argument("master", help='the "<name> LOW BPS.mp4" file')
    ap.add_argument("--out", default=None, help="override output path (default: derived)")
    ap.add_argument("--cpu", action="store_true",
                    help="documented CPU-filter fallback (only if CUDA filters unavailable)")
    args = ap.parse_args()

    if not os.path.isfile(args.master):
        print(f"no such file: {args.master}", file=sys.stderr)
        sys.exit(1)
    stem = os.path.splitext(os.path.basename(args.master))[0]
    if not stem.endswith(" LOW BPS"):
        print('input must be the "<name> LOW BPS.mp4" master (naming chain is load-bearing).',
              file=sys.stderr)
        sys.exit(1)
    out = args.out or os.path.join(os.path.dirname(os.path.abspath(args.master)),
                                   stem + " VERTICAL.mp4")

    total = dur(args.master)
    mode = "CPU-filter fallback" if args.cpu else "CUDA"
    print(f'verticalizing ({mode}) "{os.path.basename(args.master)}" ({total:.1f}s)')

    common_out = ["-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", "600k", "-maxrate", "800k",
                  "-bufsize", "1200k", "-c:a", "aac", "-b:a", "96k",
                  "-progress", "pipe:1", "-nostats", out]
    if args.cpu:
        cmd = ["ffmpeg", "-y", "-hide_banner", "-v", "warning", "-i", args.master,
               "-filter_complex", CPU_FILTER, "-map", "[v]", "-map", "0:a"] + common_out
    else:
        cmd = ["ffmpeg", "-y", "-hide_banner", "-v", "warning",
               "-init_hw_device", "cuda=cu", "-filter_hw_device", "cu",
               "-hwaccel", "cuda", "-hwaccel_output_format", "cuda", "-hwaccel_device", "cu",
               "-i", args.master,
               "-filter_complex", CUDA_FILTER, "-map", "[vgo]", "-map", "0:a",
               "-preset", "p5"] + common_out

    rc, tail = run_ffmpeg_with_progress(cmd, total, "verticalize")
    if rc != 0:
        print(f"FFMPEG FAIL (exit {rc}):\n{tail[-1500:]}", file=sys.stderr)
        if not args.cpu:
            print("If this is a CUDA-filter availability error, re-run with --cpu "
                  "(the documented fallback). Do not loop retries.", file=sys.stderr)
        sys.exit(1)

    w, h, sar, dar = probe_geometry(out)
    od = dur(out)
    ok = (w, h) == (1080, 1920) and sar in ("1:1", "N/A")
    print(f"PROBE {w}x{h} SAR {sar} DAR {dar} {'OK' if ok else 'WRONG'}")
    if not ok:
        print("FATAL: output geometry is wrong — must be 1080x1920 SAR 1:1 "
              "(see the skill's GPU gotchas).", file=sys.stderr)
        sys.exit(1)
    size_mb = os.path.getsize(out) / 1e6
    print(f'DONE "{out}"  {od:.1f}s  {size_mb:.0f} MB')
    print(f"OUT_PATH={out}")
    print(f"OUT_DURATION={od:.2f}")


if __name__ == "__main__":
    main()
