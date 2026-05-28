"""Convert glowing-on-black overlays to TRUE alpha PNGs.
alpha = boosted luminance -> pure black becomes fully transparent, the glowing subject
stays opaque, and the glow feathers out naturally. Result composites cleanly over video.
Overwrites the files in place (originals already moved to _bad-checkerboard/).
"""
from PIL import Image
import os

d = r"C:\Users\mnede\Documents\Claude\video-creation\assets\price-vs-tech"
FILES = ["ov-kaspa-coin.png", "ov-arrow-up.png", "ov-diamond.png"]

for f in FILES:
    p = os.path.join(d, f)
    if not os.path.exists(p):
        print(f"  MISSING: {f}"); continue
    im = Image.open(p).convert("RGB")
    lum = im.convert("L")
    # Boost so mid-tones stay opaque; only near-black goes transparent.
    alpha = lum.point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    rgba.save(p)
    lo, hi = alpha.getextrema()
    print(f"  {f:22s} -> RGBA, alpha range {lo}-{hi}")
print("Done. Black dropped to transparent; glow preserved.")
