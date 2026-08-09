"""tutorial / clip 3 (binance-kaspa-catch22) — glow-on-black -> TRUE alpha PNG overlays.

Canonical method, from video-creation/_make_overlays_alpha.py (SKILL "Transparent overlays"):
    alpha = luminance, boosted: 0 if v < CUT else min(255, v * BOOST)
so pure black becomes fully transparent, the glowing subject stays opaque, and the glow feathers.
Then CROP to the subject bounding box (alpha > 8) so the PNG carries no dead transparent margin and
`width` in the comp maps to the subject itself.

BOOST is 3.0 here, not the reference file's 1.8: TWO of this clip's four overlay windows sit over the
near-WHITE CoinMarketCap page (the gem at 2.0-4.8 s and the bull at 29.3-32.1 s), and a chunk render
at 1.8 showed the gem's mid-tone facets going ~40 % transparent and washing out against the white.
At 3.0 the subject is opaque and only the outer glow feathers. Pure black is still fully transparent
(0 * 3.0 = 0) and the cut is 10, so no box edge appears.

RE-RUNNABLE: alpha is always recomputed from the RGB channels, which putalpha() never touches, so
running this again on an already-converted PNG is lossless and idempotent.

Sources:
  broll-tut-bkc-ov-gem.png  / -lock.png / -bull.png  = ChatGPT generations (in place, idempotent)
  broll-tut-bkc-ov-kaspa.png = the REAL Kaspa mark, copied from
      schedule-tweets/images/reference/kaspa-logo.png (reference-image gate; it already ships as a
      glowing teal coin on pure black, so no generation is needed and the branding is pixel-exact).
Run from the repo root:  python video-creation/shorts/tutorial/binance-kaspa-catch22/_make_alpha_overlays.py
"""
import os
import shutil
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RA = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")
REF = os.path.join(REPO, "schedule-tweets", "images", "reference", "kaspa-logo.png")

KASPA = os.path.join(RA, "broll-tut-bkc-ov-kaspa.png")
if not os.path.exists(KASPA):
    shutil.copyfile(REF, KASPA)
    print(f"  copied reference kaspa-logo.png -> {os.path.basename(KASPA)}")

FILES = [
    "broll-tut-bkc-ov-gem.png",
    "broll-tut-bkc-ov-lock.png",
    "broll-tut-bkc-ov-bull.png",
    "broll-tut-bkc-ov-kaspa.png",
]

CUT, BOOST = 10, 3.0

for f in FILES:
    p = os.path.join(RA, f)
    im = Image.open(p).convert("RGB")   # drops any existing alpha; RGB is the untouched source
    lum = im.convert("L")
    alpha = lum.point(lambda v: 0 if v < CUT else min(255, int(v * BOOST)))
    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    rgba.save(p)
    a = rgba.split()[3]
    hist = a.histogram()
    clear = sum(hist[:10]) / float(rgba.size[0] * rgba.size[1])
    print(f"  {f:30s} -> RGBA {rgba.size}  {clear*100:.1f}% fully transparent")
print("Done.")
