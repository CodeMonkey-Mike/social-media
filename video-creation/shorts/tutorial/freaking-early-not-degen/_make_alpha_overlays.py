"""tutorial / clip 4 (freaking-early-not-degen) — glow-on-black -> TRUE alpha PNG overlays.

Canonical method (SKILL "Transparent overlays" / video-creation/_make_overlays_alpha.py):
    alpha = luminance, boosted:  0 if v < CUT else min(255, v * BOOST)
so pure black becomes fully transparent, the glowing subject stays opaque, and the glow feathers out.
NEVER prompt ChatGPT for a transparent background: it bakes a painted checkerboard into a flat RGB
image. Then CROP to the subject bounding box (alpha > 8) so the PNG carries no dead transparent margin
and `width` in the comp maps to the subject itself.

BOOST = 2.6 here, between the reference file's 1.8 and clip 3's 3.0. Reason, measured: unlike clip 3
(two of whose overlay windows sat over a near-WHITE CoinMarketCap page and needed 3.0 to stay opaque),
this clip's single screen-share is a DARK-THEME DEXScreener page — a per-frame mean-luma scan of all
1082 frames puts the whole frame at 97.9-111.7/255 and the chart area darker still. At 2.6 the subject
core is opaque against that, and the outer glow keeps enough feather that the candles/silhouettes/rays
read as light ON the chart rather than as a pasted card. Pure black is still fully transparent
(0 * 2.6 = 0) and CUT is 10, so no box edge appears.

`blend: 'normal'` is used on all three in the comp, not 'screen': the page has near-white patches (the
right-hand stats rail and its ad panel) and a screen blend cannot darken white, so a screen-blended
overlay would vanish there.

RE-RUNNABLE: alpha is always recomputed from the RGB channels, which putalpha() never touches, so
running this again on an already-converted PNG is lossless and idempotent.

Sources: all three are ChatGPT generations (see _write_genlists.py / _genlist-tutfed-*.json). NO
reference image is used and none may be: this clip names no project, coin, exchange or person.
`thumb-tutfed.png` is deliberately NOT processed — it is the full-frame frame-0 cover art, drawn under
a scrim with the title in code, so it stays opaque RGB.

Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen/_make_alpha_overlays.py
"""
import os
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RA = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")

FILES = [
    "broll-tut-fed-ov-spike.png",   # beat 1, 1.95-4.55 s  "pump in two weeks ... and then die"
    "broll-tut-fed-ov-crowd.png",   # beat 4, 14.30-16.55 s "when retail starts coming back in"
    "broll-tut-fed-ov-dawn.png",    # beat 7, 30.40-32.30 s "I was so freaking early"
]

CUT, BOOST = 10, 2.6

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
    n = rgba.size[0] * rgba.size[1]
    clear = sum(hist[:10]) / float(n)
    solid = sum(hist[250:]) / float(n)
    print(f"  {f:32s} -> RGBA {str(rgba.size):12s} aspect {rgba.size[1]/rgba.size[0]:.3f}  "
          f"{clear*100:5.1f}% fully transparent  {solid*100:5.1f}% fully opaque")
print("Done.")
