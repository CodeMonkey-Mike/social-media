#!/usr/bin/env python
"""
check_broll_motion.py: prove the VIDEO b-roll moves in the RENDER as it moves in its source clip (Mike, 2026-10-17,
tao-detailed: "the broll looks like it is skipping frames ... I only see it in our final video").

The failure it catches: Remotion's OffthreadVideo cache, capped too small over a LONG render, served the nearest cached
frame instead of the exact one, so ~60% of b-roll frames were repeats (3-5 held, then a jump). Short chunk renders never
fill the cache, so chunk QA looked clean; only the full render was broken. This gate reads the FINISHED file.

Method: for every `kind: 'vid'` COVERS row of the comp, take ~1.2 s from the middle of its slot in the render (output
time through the comp's INSERTS time map) and the matching stretch of the source clip (x the clip's playbackRate from
the comp's VID_FPS map), and count FROZEN steps (mean |diff| < 0.05 on 160x90 luma). Allowed in the render = the
source's own frozen steps + the repeats the frame rate explains (30 fps output of an f fps clip at rate r repeats
1 - f*r/30 of its frames) + a margin of 3. More than that FAILS.

Usage: python check_broll_motion.py <render.mp4> <Comp.tsx> <assets dir> [--fps 30]
Machine line: BROLL-MOTION PASS|FAIL clips=N fails=M
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
FROZEN = 0.05
N = 37            # frames sampled -> 36 steps


def frames(v, ss, n):
    p = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0.0, ss):.3f}", "-i", str(v), "-frames:v", str(n),
                        "-vf", "scale=160:90,format=gray", "-f", "rawvideo", "-"], capture_output=True)
    a = np.frombuffer(p.stdout, dtype=np.uint8)
    return a.reshape(-1, 90 * 160).astype(float) if a.size else np.zeros((0, 90 * 160))


def frozen(a):
    return int(sum(np.abs(a[i] - a[i - 1]).mean() < FROZEN for i in range(1, len(a))))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("render")
    ap.add_argument("comp")
    ap.add_argument("assets")
    ap.add_argument("--fps", type=float, default=30.0)
    a = ap.parse_args()
    src = Path(a.comp).read_text(encoding="utf-8")
    ins = [(float(x), float(d)) for x, d in re.findall(r"\{\s*at:\s*([\d.]+),\s*dur:\s*([\d.]+)\s*\}", src.split("INSERTS", 1)[1].split("];", 1)[0])] \
        if "INSERTS" in src else []

    def sh(t):
        return t + sum(d for x, d in ins if x <= t)
    vfps = {}
    m = re.search(r"VID_FPS[^=]*=\s*\{(.*?)\};", src, re.S)
    if m:
        for ref, n, d in re.findall(r"'([^']+)':\s*([\d.]+)\s*/\s*([\d.]+)", m.group(1)):
            vfps[ref] = float(n) / float(d)
    rows = re.findall(r"\{ tIn: ([\d.]+), tOut: ([\d.]+), kind: 'vid', ref: '([^']+)'", src)
    fails = []
    for tin, tout, ref in rows:
        tin, tout = float(tin), float(tout)
        clip = Path(a.assets) / "vid" / f"{ref}.mp4"
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(clip)],
                           capture_output=True, text=True).stdout.strip().strip(",")
        n, d = r.split("/")
        cf = float(n) / float(d)
        rate = a.fps / vfps[ref] if ref in vfps else 1.0
        slot = tout - tin
        span = min(1.2, slot - 0.6)
        mid_out = sh(tin) + slot / 2 - span / 2
        out = frames(a.render, mid_out, N)
        clip_t = (slot / 2 - span / 2) * rate
        n_src = max(2, int(round(N * cf * rate / a.fps)))
        s_fr = frozen(frames(clip, clip_t, n_src))
        expect = max(0.0, 1 - cf * rate / a.fps) * (len(out) - 1)
        allowed = int(round(s_fr * (len(out) - 1) / max(1, n_src - 1) + expect)) + 3
        f_fr = frozen(out)
        ok = f_fr <= allowed
        print(f"  {'ok  ' if ok else 'FAIL'}  {ref:40} {cf:6.3f} fps x{rate:.3f}  render frozen {f_fr:2d}/{len(out) - 1}  "
              f"(source {s_fr}/{n_src - 1}, allowed {allowed})")
        if not ok:
            fails.append(ref)
    print(f"BROLL-MOTION {'FAIL' if fails else 'PASS'} clips={len(rows)} fails={len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
