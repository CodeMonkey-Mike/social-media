# usage: python words.py <receipt.png> <y0> <y1> [gap_px]   (frame px; the PNG is 2x) -> word segments in frame px
import sys
import numpy as np
from PIL import Image
im = np.asarray(Image.open(sys.argv[1]).convert('L')).astype(int)
y0, y1 = int(float(sys.argv[2]) * 2), int(float(sys.argv[3]) * 2)
gap = int(float(sys.argv[4]) * 2) if len(sys.argv) > 4 else 9
band = im[y0:y1]
bg = np.median(band)
ink = (np.abs(band - bg) > 60).any(axis=0)
rows = (np.abs(band - bg) > 60).any(axis=1)
ys = np.where(rows)[0]
print(f"ink rows (frame px): {(y0 + ys.min()) / 2:.1f} .. {(y0 + ys.max()) / 2:.1f}" if len(ys) else "no ink")
segs, start, last = [], None, None
for x, v in enumerate(ink):
    if v:
        if start is None: start = x
        last = x
    elif start is not None and x - last > gap:
        segs.append((start, last)); start = None
if start is not None: segs.append((start, last))
print(' '.join(f"[{a/2:.0f}-{b/2:.0f}]" for a, b in segs))
