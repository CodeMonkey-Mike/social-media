"""tutorial / clip 5 (doginme-100x-if-500x) — build the clip's TRUE-ALPHA overlay PNGs.

⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim):
   "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
    overlaying graphics or images with background transparency."
So every asset this script writes is a REAL RGBA sticker (a large fraction of each PNG is fully
transparent) that floats over the live base video and never fills the content zone.

⭐ REFERENCE-IMAGE GATE, run LIVE 2026-08-10 against schedule-tweets/images/reference/:
   doginme  -> DogInMe.png EXISTS  -> both stickers are derived PIXEL-EXACTLY from it. Nothing is
               generated and nothing is paraphrased: the mark is a BLUE muscular pit bull with a
               thick black outline, pointing at the viewer, and that is what ships. (Standing rule:
               "no invented logo" NEVER means shipping a blank-faced object - and the sibling
               precedent where a black lab was rendered as a golden retriever is exactly why this
               clip does not let an image model re-draw the mascot.)
   Coinbase -> no reference on disk -> NO logo is invented; the credential is a TEXT-ONLY code badge.
   Base     -> no reference on disk -> no chain logo anywhere; the chain is carried by COLOUR only
               (Base blue #3aa0ff, never Robinhood neon-green, which is clip 2's palette).
   what-if  -> what-if.jpg EXISTS and is BANNED on this clip (the $IF tail was deleted at 4b, so
               nothing on screen may reference $IF / What If / a 500X). It is not opened here.

Method: the reference ships on PURE WHITE, so alpha-from-luminance (the glow-on-black recipe in
SKILL.md) would eat the dog's white eyes and highlights. Instead the background is removed with a
BORDER FLOOD FILL over near-white/low-saturation pixels, which cannot reach an interior white
(eyes, teeth, muscle highlights) because the black outline seals the figure. The alpha edge is then
feathered 1 px and an outer GLOW is composited underneath so each sticker still separates from the
near-white CoinMarketCap page behind it.

Two DISTINCT treatments (SKILL: never reuse one image for two beats):
  broll-tut-dgn-ov-dog-point.png  full figure, upright, BASE-BLUE halo   -> the hook, 1.82-3.02 s
  broll-tut-dgn-ov-dog-head.png   tight HEAD crop, tilted -8 deg, YELLOW halo -> the hard-out, 36.70+

Run from the repo root:
  python video-creation/shorts/tutorial/doginme-100x-if-500x/_make_alpha_overlays.py
"""
import os
from collections import deque
from PIL import Image, ImageFilter

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", ".."))
REF = os.path.join(REPO, "schedule-tweets", "images", "reference", "DogInMe.png")
OUT = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")

BASE_BLUE = (58, 160, 255)
YELLOW = (255, 230, 0)


def cut_background(src_path):
    """Border flood fill over near-white / low-saturation pixels -> real alpha."""
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    px = im.load()
    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()

    def is_bg(x, y):
        r, g, b = px[x, y]
        return min(r, g, b) >= 232 and (max(r, g, b) - min(r, g, b)) <= 14

    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not seen[y * w + x] and is_bg(x, y):
                seen[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y * w + x] and is_bg(x, y):
                seen[y * w + x] = 1; q.append((x, y))
    n = 0
    while q:
        x, y = q.popleft()
        ap[x, y] = 0
        n += 1
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and is_bg(nx, ny):
                seen[ny * w + nx] = 1; q.append((nx, ny))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))   # feather the cut edge
    im.putalpha(alpha)
    return im, n, w * h


def add_halo(rgba, colour, spread, strength):
    """Composite a coloured outer glow UNDER the sticker so it reads over a light screen-share."""
    pad = spread * 3
    w, h = rgba.size
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    a = rgba.split()[3]
    glow_a = Image.new("L", canvas.size, 0)
    glow_a.paste(a, (pad, pad))
    glow_a = glow_a.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(spread))
    glow_a = glow_a.point(lambda v: min(255, int(v * strength)))
    glow = Image.new("RGBA", canvas.size, colour + (0,))
    glow.putalpha(glow_a)
    canvas = Image.alpha_composite(canvas, glow)
    canvas.alpha_composite(rgba, (pad, pad))
    return canvas


def report(name, im):
    a = im.split()[3]
    hist = a.histogram()
    total = im.size[0] * im.size[1]
    clear = hist[0]
    opaque = sum(hist[250:])
    print("  %-34s %dx%d  fully-transparent %.1f%%  fully-opaque %.1f%%"
          % (name, im.size[0], im.size[1], 100 * clear / total, 100 * opaque / total))


# Guarded so _make_thumb.py can import cut_background()/REF without rewriting the stickers.
if __name__ == "__main__":
    cut, n, tot = cut_background(REF)
    print("flood fill removed %d px (%.1f%% of the reference) as background" % (n, 100 * n / tot))

    # ── 1. HOOK sticker: full figure, Base-blue halo ────────────────────────────────────────────────
    point = add_halo(cut, BASE_BLUE, 14, 1.15)
    p1 = os.path.join(OUT, "broll-tut-dgn-ov-dog-point.png")
    point.save(p1)
    report("broll-tut-dgn-ov-dog-point.png", point)

    # ── 2. HARD-OUT sticker: tight HEAD crop, tilted, yellow halo ───────────────────────────────────
    # Head box measured on the 655x745 reference: the ear tips span x 268-552 and the jowl bottom sits at
    # y ~285, where the neck begins. A straight crop THERE leaves a hard flat edge across the muzzle that
    # reads as a bad crop (caught on the first build), so the box runs 37 px past it and the last 96 px of
    # ALPHA are ramped to zero: the head dissolves down the neck instead of being sliced off.
    head = cut.crop((262, 12, 556, 322))
    hw, hh = head.size
    FADE = 96
    _ha = head.split()[3]          # split() COPIES, so the ramp is applied to this band and put BACK
    _hp = _ha.load()
    for y in range(hh - FADE, hh):
        k = (hh - 1 - y) / float(FADE)
        for x in range(hw):
            _hp[x, y] = int(_hp[x, y] * k)
    head.putalpha(_ha)
    head = head.rotate(-8, resample=Image.BICUBIC, expand=True)
    head = add_halo(head, YELLOW, 16, 1.25)
    p2 = os.path.join(OUT, "broll-tut-dgn-ov-dog-head.png")
    head.save(p2)
    report("broll-tut-dgn-ov-dog-head.png", head)
    print("wrote:\n  %s\n  %s" % (p1, p2))
