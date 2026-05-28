"""Convert the v34 coin overlays (glow-on-black) to TRUE alpha PNGs (alpha = boosted luminance)."""
from PIL import Image
import os
d = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\assets\v34"
for f in ["ov-eth-coin.png", "ov-btc-coin.png"]:
    p = os.path.join(d, f)
    if not os.path.exists(p):
        print(f"  MISSING: {f}"); continue
    im = Image.open(p).convert("RGB")
    alpha = im.convert("L").point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
    rgba = im.convert("RGBA"); rgba.putalpha(alpha); rgba.save(p)
    lo, hi = alpha.getextrema()
    print(f"  {f:18s} -> RGBA alpha {lo}-{hi}")
print("Done.")
