"""Convert the 353x redo glow-on-black overlays to TRUE alpha PNGs.
alpha = boosted luminance -> pure black becomes fully transparent, the glowing
subject stays opaque, glow feathers out. Composites cleanly over video.
Overwrites in place. See video-creation/SKILL.md (transparent-overlay method).
"""
from PIL import Image
import os

d = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\assets"
FILES = ["ov-353x-m-arrow.png", "ov-353x-l-coin.png"]

for f in FILES:
    p = os.path.join(d, f)
    if not os.path.exists(p):
        print(f"  MISSING: {f}"); continue
    im = Image.open(p).convert("RGB")
    lum = im.convert("L")
    alpha = lum.point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    rgba.save(p)
    lo, hi = alpha.getextrema()
    print(f"  {f:24s} -> RGBA, alpha range {lo}-{hi}")
print("Done. Black dropped to transparent; glow preserved.")
