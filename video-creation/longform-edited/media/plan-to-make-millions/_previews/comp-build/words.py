"""Word spans on one text line of a receipt capture (projection of ink pixels): python words.py <png> y0 y1 [x0 x1] [--dark]
Prints each word's [x_start, x_end] and the line's ink y range, so a highlight rect is placed on measured pixels."""
import sys

import numpy as np
from PIL import Image

p, y0, y1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
x0 = int(sys.argv[4]) if len(sys.argv) > 4 and not sys.argv[4].startswith('--') else 0
x1 = int(sys.argv[5]) if len(sys.argv) > 5 and not sys.argv[5].startswith('--') else None
dark = '--dark' in sys.argv
a = np.asarray(Image.open(p).convert('L')).astype(int)[y0:y1, x0:x1]
bg = np.median(a)
ink = (a > bg + 60) if dark else (a < bg - 60)
cols = ink.any(axis=0)
rows = np.where(ink.any(axis=1))[0]
gap = int(sys.argv[sys.argv.index("--gap") + 1]) if "--gap" in sys.argv else max(6, int((y1 - y0) * 0.22))
spans, start, last = [], None, None
for i, c in enumerate(cols):
    if c:
        if start is None:
            start = i
        last = i
    elif start is not None and i - last > gap:
        spans.append((start + x0, last + x0))
        start = None
if start is not None:
    spans.append((start + x0, last + x0))
print('ink y', (rows.min() + y0, rows.max() + y0) if len(rows) else None)
for k, s in enumerate(spans):
    print(k, s)
