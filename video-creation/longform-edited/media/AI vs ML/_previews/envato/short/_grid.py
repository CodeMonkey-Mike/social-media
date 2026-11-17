"""Timed frame grid of a clip: python _grid.py <clip> <out.jpg> <t0> <t1> <step> [cols]"""
import subprocess, sys, os
from PIL import Image, ImageDraw
clip, out, t0, t1, step = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 9
ts = []; t = t0
while t <= t1 + 1e-6:
    ts.append(round(t, 3)); t += step
ims = []
for t in ts:
    p = f"{out}.{t}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t}", "-i", clip, "-frames:v", "1", "-vf", "setparams=color_trc=bt709:color_primaries=bt709:colorspace=bt709,scale=216:384,format=rgb24", p])
    im = Image.open(p).convert("RGB"); os.remove(p)
    ImageDraw.Draw(im).text((4, 4), f"{t:.2f}s", fill=(255, 255, 0))
    ims.append(im)
rows = (len(ims) + cols - 1) // cols
s = Image.new("RGB", (216 * cols, 384 * rows))
for i, im in enumerate(ims):
    s.paste(im, ((i % cols) * 216, (i // cols) * 384))
s.save(out, quality=85)
print(out, len(ims), "frames")
