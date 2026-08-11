"""tutorial / clip 5 (doginme-100x-if-500x) — build the frame-0 cover BACKGROUND art.

The cover is ONE frame (LivestreamShort defaults thumb.durS to 1/fps) and the TITLE + CHIP are drawn
in CODE on top of this image by the shared `Thumb` component, never baked in (SKILL "B-ROLL IMAGE
GENERATION RULES": never bake text into an image you may need to edit).

⛔ CONTENT GUARD ON THIS CLIP: the slug `doginme-100x-if-500x` is VESTIGIAL. Mike's 4b review deleted
the $IF / What If tail (master 4541.98-4570.70), so NOTHING on screen may promise or reference $IF,
"What If" or a 500X - the cover included. This art therefore shows ONE token only, doginme, and the
code-drawn title carries only numbers from his own mouth (107M ATH, 400M, 100X).
`schedule-tweets/images/reference/what-if.jpg` is BANNED here and is never opened.

⭐ Brand accuracy: the mascot is composited PIXEL-EXACTLY from the real reference
`schedule-tweets/images/reference/DogInMe.png` (via this clip's _make_alpha_overlays.py cut), not
generated and not paraphrased. doginme is a BASE-chain token, so the palette is Base blue #3aa0ff /
deep navy - never the Robinhood neon-green of clip 2, and never Kaspa teal.

Layout: the `Thumb` component puts the title at top 240 and the chip under it, so the subject sits in
the LOWER half (head ~y 880-1250) and the frame's top third stays dark for the type. Nothing but the
full-bleed background crosses y 1680 (the platform safe zone); the title and chip are far above it.

Run from the repo root (after _make_alpha_overlays.py, which it imports the cut from):
  python video-creation/shorts/tutorial/doginme-100x-if-500x/_make_thumb.py
"""
import math
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets", "thumb-tutdgn.png")

sys.path.insert(0, HERE)
from _make_alpha_overlays import cut_background, REF  # noqa: E402  (same-folder helper)

W, H = 1080, 1920
BLUE = (58, 160, 255)

# ── 1. deep-navy radial base ────────────────────────────────────────────────────────────────────
img = Image.new("RGB", (W, H), (0, 0, 0))
px = img.load()
cx, cy = W * 0.52, H * 0.60
maxr = math.hypot(W, H) * 0.62
for y in range(0, H, 2):
    for x in range(0, W, 2):
        k = 1.0 - min(1.0, math.hypot(x - cx, y - cy) / maxr)
        k = k ** 2.1
        c = (int(4 + 26 * k), int(9 + 44 * k), int(20 + 88 * k))
        px[x, y] = c
        px[x + 1, y] = c
        px[min(W - 1, x), y + 1] = c
        px[min(W - 1, x + 1), y + 1] = c

# ── 2. rising momentum beam + halo rings behind the mascot ──────────────────────────────────────
beam = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(beam)
for i in range(9):
    a = int(46 - i * 4)
    half = 70 + i * 46
    bd.polygon([(cx - half * 0.30, 470), (cx + half * 0.30, 470),
                (cx + half, H), (cx - half, H)], fill=BLUE + (a,))
for i in range(4):
    r = 250 + i * 118
    bd.ellipse([cx - r, cy - r * 0.92, cx + r, cy + r * 0.92], outline=BLUE + (44 - i * 9,), width=7)
beam = beam.filter(ImageFilter.GaussianBlur(16))
img = Image.alpha_composite(img.convert("RGBA"), beam)

# ── 3. the real doginme mark, big, lower half ───────────────────────────────────────────────────
dog, _, _ = cut_background(REF)
TW = 880
dog = dog.resize((TW, int(TW * dog.size[1] / dog.size[0])), Image.LANCZOS)
dx, dy = (W - TW) // 2 + 14, 800
# soft blue rim-glow directly under the figure so it separates from the navy
rim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ga = Image.new("L", (W, H), 0)
ga.paste(dog.split()[3], (dx, dy))
ga = ga.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(26))
ga = ga.point(lambda v: min(255, int(v * 1.5)))
glow = Image.new("RGBA", (W, H), BLUE + (0,))
glow.putalpha(ga)
img = Image.alpha_composite(img, glow)
img.alpha_composite(dog, (dx, dy))

# ── 4. a touch of vignette so the code-drawn title reads on the top third ───────────────────────
vig = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vig)
for y in range(H):
    vd.line([(0, y), (W, y)], fill=int(118 * max(0.0, 1.0 - y / 760.0)))
img = Image.alpha_composite(img, Image.merge("RGBA", (Image.new("L", (W, H), 0),) * 3 + (vig,)))

img.convert("RGB").save(OUT)
print("wrote %s  %dx%d" % (OUT, W, H))
