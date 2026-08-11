"""tutorial / clip 8 (freaking-early-not-degen-impact) — glow-on-black -> TRUE alpha PNG overlays.

Canonical method (SKILL "Transparent overlays" / video-creation/_make_overlays_alpha.py):
    alpha = luminance, boosted:  0 if v < CUT else min(255, v * BOOST)
so pure black becomes fully transparent, the glowing subject stays opaque, and the glow feathers out.
NEVER prompt ChatGPT for a transparent background: it bakes a painted checkerboard into a flat RGB
image. Then CROP to the subject bounding box (alpha > 8) so the PNG carries no dead transparent margin
and `width` in the comp maps to the subject itself.

BOOST = 2.6, the same value clip 4 measured for this EXACT screen-share, and for the same reason: the
base is one continuous DARK-THEME DEXScreener page. Re-measured on THIS spine rather than inherited —
a per-frame mean-luma scan of all 502 frames puts the whole frame at 104.6-118.4/255 (min at t 1.000,
max at t 5.280, last frame 116.9), with the chart area darker still. At 2.6 the subject core is opaque
against that and the outer glow keeps enough feather that the panels/leaves read as light ON the chart
rather than as a pasted card. Pure black stays fully transparent (0 * 2.6 = 0) and CUT is 10, so no box
edge appears.

`blend: 'normal'` is used on both in the comp, not 'screen': the page has near-white patches (the
right-hand stats rail and its ad panel) and a screen blend cannot darken white, so a screen-blended
overlay would vanish there.

RE-RUNNABLE: alpha is always recomputed from the RGB channels, which putalpha() never touches, so
running this again on an already-converted PNG is lossless and idempotent.

Sources: both are ChatGPT generations (see _write_genlists.py / _genlist-tutfei-*.json). NO reference
image is used and none may be: this clip names no project, coin, exchange or person.
`thumb-tutfei.png` is deliberately NOT processed — it is the full-frame 9:16 frame-0 cover art, drawn
under a scrim with the title in code, so it stays opaque RGB.

⚠ PROVENANCE NOTE (2026-08-10): the three generations came back CAPTURED ONE BEHIND (the generator's
documented "WRONG-IMAGE grab" against a chat that was already at 12/25 images, so its per-invocation
seen-set of file_ids started empty and run 1 grabbed a pre-existing image). No prompt was ever
re-sent: the two correctly-generated files were RENAMED to their true identities and the third was
recovered READ-ONLY from the conversation by `_recover_sprout.py`, which also PROVED the off-by-one
(conversation asset pointers 14 and 15 are byte-identical to the two files already on disk, and 16 —
the newest, never captured — is the sprout). All three were persona-inspected after the remap.

Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen-impact/_make_alpha_overlays.py
"""
import os
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RA = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")

FILES = [
    "broll-tut-fei-ov-lookup.png",   # beat 1, 1.05-3.30 s  "retail is gonna be looking at all these tokens"
    "broll-tut-fei-ov-sprout.png",   # beat 2, 7.50-9.20 s  "I was so freaking early"
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
