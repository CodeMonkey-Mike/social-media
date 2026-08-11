"""_make_tut94x_overlays_alpha.py — batch `tutorial` / clip 1 `tut-94x-euphoria`.

Converts the six glow-on-black b-roll images into TRUE alpha PNGs so they composite over the live
CoinMarketCap screen-share as STICKERS, never as a zone fill. Method is the canonical one from
video-creation/SKILL.md ("Full-screen B-roll vs. transparent overlays"): alpha = boosted luminance,
so pure black becomes fully transparent, the glowing subject stays opaque and the glow feathers out.
The RGB is untouched, so the PNGs render with a plain <Img> at blend 'normal' (NOT screen blend,
which cannot darken the near-white CMC page and would make the sticker vanish over it).

Why this file exists at all: Mike's Phase 7 directive for this batch bans full-screen and
content-zone b-roll and allows "overlaying graphics or images with background transparency", so
every generated asset in this clip ships as an alpha overlay. See the clip's BROLL-PLAN.md.

The cover art is NOT converted: it is the frame-0 thumbnail, which is opaque by design.

Idempotent: re-running on an already-converted file recomputes the same alpha from the same RGB.
Run:  python video-creation/_make_tut94x_overlays_alpha.py
"""
import os

from PIL import Image

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shorts", "tutorial", "render-assets")
FILES = [
    "broll-tut94x-arrow.png",
    "broll-tut94x-coin.png",
    "broll-tut94x-confetti.png",
    "broll-tut94x-rocket.png",
    "broll-tut94x-firework.png",
    "broll-tut94x-sparkle.png",
]

for f in FILES:
    p = os.path.join(D, f)
    if not os.path.exists(p):
        print(f"  MISSING: {f}")
        continue
    im = Image.open(p).convert("RGB")
    lum = im.convert("L")
    alpha = lum.point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    rgba.save(p)
    lo, hi = alpha.getextrema()
    hist = alpha.histogram()
    opaque = sum(hist[200:]) / float(sum(hist))
    clear = hist[0] / float(sum(hist))
    print(f"  {f:30s} {im.size[0]}x{im.size[1]} -> RGBA  alpha {lo}-{hi}  "
          f"fully transparent {clear:5.1%}  near opaque {opaque:5.1%}")
print("Done. Black dropped to transparent; the glow is preserved.")
