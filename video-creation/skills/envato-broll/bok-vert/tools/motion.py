#!/usr/bin/env python
"""motion.py <video> [<video> ...] -> per-file mean / min / max abs frame difference at 4 fps (64px gray),
plus mean luma. Mean diff ~<0.5 = near-static; >2 = clearly moving. Also flags a black/blank lead."""
import subprocess
import sys

import numpy as np

for path in sys.argv[1:]:
    p = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", "fps=4,scale=64:-2,format=gray",
                        "-f", "rawvideo", "-"], capture_output=True)
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                         "-of", "csv=p=0", path], capture_output=True, text=True)
    w, h = map(int, pr.stdout.strip().split(",")[:2])
    hh = int(round(64 * h / w / 2)) * 2
    buf = np.frombuffer(p.stdout, dtype=np.uint8)
    n = buf.size // (64 * hh)
    if n < 2:
        print(f"{path}: too few frames ({n})")
        continue
    fr = buf[: n * 64 * hh].reshape(n, hh, 64).astype(np.float32)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    luma = fr.mean(axis=(1, 2))
    print(f"{path}: frames={n} diff mean={d.mean():.2f} min={d.min():.2f} max={d.max():.2f} "
          f"luma mean={luma.mean():.1f} first={luma[0]:.1f} last={luma[-1]:.1f}")
