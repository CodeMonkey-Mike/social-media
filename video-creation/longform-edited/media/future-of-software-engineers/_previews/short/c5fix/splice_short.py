"""splice_short.py: splice the re-rendered window (short comp frames 140-215) into the short's picture master, the repo's way
(video-only concat via filter_complex, frame total + seam PSNR verified), writing the NEXT picture master
future-of-software-engineers-SHORT-30s-v2-video.mp4 so `run.py short` re-mixes, re-verifies, re-QAs and delivers it.
The change: the captions yield to the C5 receipt window (frames 160-205). Frames 140-159 and 206-215 must come out IDENTICAL to v1."""
import subprocess, sys
from pathlib import Path
import numpy as np
HERE = Path(__file__).resolve().parent
SD = HERE.parent
SRC = SD / "future-of-software-engineers-SHORT-30s-v1-video.mp4"
PATCH = HERE / "patch-140-215.mp4"
OUT = SD / "future-of-software-engineers-SHORT-30s-v2-video.mp4"
A, B, N = 140, 215, 900

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-700:]); sys.exit(1)
    return r
def nframes(p):
    return int(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", str(p)]).stdout.strip().split(",")[0])
def psnr(a, a0, b, b0, n):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(a), "-i", str(b), "-filter_complex",
        f"[0:v]select='between(n,{a0},{a0+n-1})',setpts=N/FRAME_RATE/TB,format=gray[x];[1:v]select='between(n,{b0},{b0+n-1})',setpts=N/FRAME_RATE/TB,format=gray[y];[x][y]psnr=stats_file=-",
        "-f", "null", "-"], capture_output=True, text=True)
    v = [min(float(t.split(":")[1]), 100.0) for line in r.stdout.splitlines() for t in line.split() if t.startswith("psnr_avg:")]
    return (float(np.mean(v)), float(np.min(v)), len(v)) if v else (None, None, 0)

pn = nframes(PATCH)
print("patch frames", pn, "expected", B - A + 1)
if pn != B - A + 1: sys.exit(2)
# the patch outside the change (frames 140-159 = patch 0-19, and 206-215 = patch 66-75) must equal v1
for nm, pa, sa, k in (("patch 140-159 vs v1", 0, 140, 20), ("patch 206-215 vs v1", 66, 206, 10)):
    m, mn, c = psnr(PATCH, pa, SRC, sa, k); print(f"  {nm}: mean {m:.1f} dB min {mn:.1f} dB ({c} frames)")
    if m is None or m < 45: print("FAIL: the patch is not pixel-consistent with v1 outside the change"); sys.exit(3)
fc = (f"[0:v]trim=start_frame=0:end_frame={A},setpts=PTS-STARTPTS[h];[1:v]trim=start_frame=0:end_frame={B-A+1},setpts=PTS-STARTPTS[p];"
      f"[0:v]trim=start_frame={B+1},setpts=PTS-STARTPTS[t];[h][p][t]concat=n=3:v=1:a=0[v]")
run(["ffmpeg", "-y", "-v", "error", "-i", str(SRC), "-i", str(PATCH), "-filter_complex", fc, "-map", "[v]", "-r", "30",
     "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", str(OUT)])
n = nframes(OUT); print("spliced frames", n, "expected", N)
if n != N: sys.exit(4)
ok = True
for nm, a0, k, lo in (("HEAD 0-139 (copied)", 0, 140, 38), ("seam out 216-250 (copied)", 216, 35, 38), ("TAIL 216-899 (copied)", 216, N - 216, 38)):
    m, mn, c = psnr(OUT, a0, SRC, a0, k); good = m is not None and m >= lo; ok &= good
    print(f"  PSNR {nm:28s} mean {m:.1f} dB  min {mn:.1f} dB  {'OK' if good else 'FAIL'}")
m, mn, c = psnr(OUT, 160, SRC, 160, 46); print(f"  PSNR changed window 160-205      mean {m:.1f} dB  min {mn:.1f} dB  (captions removed: expected LOWER)")
print("SPLICE OK" if ok else "SPLICE FAILED"); sys.exit(0 if ok else 5)
