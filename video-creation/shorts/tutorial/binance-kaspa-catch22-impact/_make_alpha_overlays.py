"""tutorial / clip 7 (binance-kaspa-catch22-impact) — glow-on-black -> TRUE alpha PNG overlay.

Canonical method, from video-creation/_make_overlays_alpha.py (SKILL "Transparent overlays"):
    alpha = luminance, boosted: 0 if v < CUT else min(255, v * BOOST)
so pure black becomes fully transparent, the glowing subject stays opaque, and the glow feathers.
Then CROP to the subject bounding box (alpha > 8) so the PNG carries no dead transparent margin and
`width` in the comp maps to the subject itself.

CUT/BOOST are 10/3.0, the same values the sibling FULL cut (clip 3) measured and shipped, so the two
clips render the REAL Kaspa mark identically. 3.0 keeps the coin's mid-tone facets opaque instead of
washing out; pure black stays fully transparent (0 * 3.0 = 0) and the cut at 10 means no box edge.

RE-RUNNABLE: alpha is always recomputed from the RGB channels, which putalpha() never touches, so
running this again on an already-converted PNG is lossless and idempotent.

⛔ THIS CLIP OWNS EXACTLY ONE OVERLAY PNG, `broll-tut-bki-ov-kaspa.png`, and it is NOT generated:
it is the REAL Kaspa mark, copied from schedule-tweets/images/reference/kaspa-logo.png under the
reference-image gate (that reference already ships as a glowing teal coin on pure black, so the
branding is pixel-exact rather than invented). VERIFIED VISUALLY before use: the mark carries Kaspa's
BACKWARDS K (vertical stroke on the right, arms pointing left), so the conversion must never mirror it
- and it does not, because the pipeline only ever recomputes alpha and crops to the bbox.

The clip's other graphics are CODE-DRAWN (three badges + the SVG catch-22 loop in
remotion/src/TutBinanceKaspaCatch22Impact.tsx), so nothing else needs converting. See BROLL-PLAN.md
for why: two ChatGPT generations for a padlock/loop overlay both came back off-brief, and per Mike's
Phase 7 directive a code-drawn graphic is fully compliant, so the beat was code-drawn instead of
burning more generations.

⛔ NEVER touch clip 3's `broll-tut-bkc-ov-*.png` from here (shared public dir, separate owner).
Run from the repo root:  python video-creation/shorts/tutorial/binance-kaspa-catch22-impact/_make_alpha_overlays.py
"""
import os
import shutil
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RA = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")
REF = os.path.join(REPO, "schedule-tweets", "images", "reference", "kaspa-logo.png")

KASPA = os.path.join(RA, "broll-tut-bki-ov-kaspa.png")
if not os.path.exists(KASPA):
    shutil.copyfile(REF, KASPA)
    print(f"  copied reference kaspa-logo.png -> {os.path.basename(KASPA)}")

FILES = ["broll-tut-bki-ov-kaspa.png"]
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
