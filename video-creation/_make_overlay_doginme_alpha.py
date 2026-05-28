"""Convert the DogInMe overlay (glowing-on-black) to a true-alpha PNG.
Same technique as _make_overlays_alpha.py: alpha = boosted luminance, so pure black
drops to transparent and the glowing subject stays opaque with a feathered glow.
"""
from PIL import Image
import os

ASSETS = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\assets"
FILE = "overlay-doginme-character.png"

p = os.path.join(ASSETS, FILE)
if not os.path.exists(p):
    raise SystemExit(f"MISSING: {p}")

im = Image.open(p).convert("RGB")
lum = im.convert("L")
# Boost so the cartoon's mid-tones stay opaque; only near-black goes transparent.
alpha = lum.point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
rgba = im.convert("RGBA")
rgba.putalpha(alpha)
rgba.save(p)
lo, hi = alpha.getextrema()
print(f"{FILE} -> RGBA, alpha range {lo}-{hi}")
print("Black dropped to transparent; glow preserved.")
