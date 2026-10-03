"""_make_jcb_overlay_alpha.py — batch `johnny` / clip 1 `johnny-cash-button`.

Converts the ONE glow-on-black overlay image into a TRUE alpha PNG so the burning ring composites
over the live screen-share as a floating sticker, never as a zone fill. Method is the canonical one
from video-creation/SKILL.md ("Full-screen B-roll vs. transparent overlays"): alpha = boosted
luminance, so pure black becomes fully transparent, the glowing subject stays opaque and the glow
feathers out. The RGB is untouched, so the PNG renders with a plain <Img> at blend 'normal' (NOT
screen blend, which cannot darken the near-white DEXScreener page under it at 44-48 s and would make
the sticker vanish).

Only the overlay is converted. The seven zone/full-screen b-roll images and the frame-0 cover are
opaque by design and are left alone.

Idempotent: re-running on an already-converted file recomputes the same alpha from the same RGB.
Run:  python video-creation/_make_jcb_overlay_alpha.py
"""
import os

from PIL import Image

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shorts", "johnny", "render-assets")
FILES = ["broll-jcb-ov-ring-glow.png"]

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
