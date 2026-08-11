"""tutorial / clip 2 (robinhood-meme-rankings) - build the four TRUE-ALPHA overlay PNGs.

Mike's Phase 7 directive for this batch bans full-screen and content-zone b-roll but allows
"any overlaying graphics or images with background transparency", so every image asset on this clip
has to be a real RGBA PNG that composites over the base rather than covering it.

⛔ NOTHING HERE IS GENERATED. All four subjects are the project's OWN reference art, converted to
alpha in place. That is the strongest form of the SKILL's reference-image gate: the branding is
pixel-exact, and the failure mode it was written for cannot happen (a previous batch generated a
GOLDEN RETRIEVER for Cooper, who is a BLACK LAB, and Mike caught it - here the breed comes straight
out of `cooper.jpg`, so it cannot drift).

Two conversions, picked per source:

  A) ALPHA-FROM-LUMINANCE (the SKILL's documented method for glow-on-black art): alpha = boosted
     luminance, RGB kept. Used for the two arts that are already subjects on near-black:
       what-if.jpg  -> the green figure + spiral galaxy float over the base
       tendies.jpg  -> CROPPED to the frog + platter first (see the do-not-copy note below)

  B) EDGE-FLOOD COLOUR KEY, for the two flat-background marks. A 4-neighbour flood from the border
     removes only background pixels that are CONNECTED to the edge, so identically-coloured pixels
     INSIDE the subject survive (this matters: Toshi's own head and ears are the same blue as his
     background, and a global colour key would punch holes straight through him).
       cooper.jpg -> lime disc background keyed out, the circular badge kept
       toshi.png  -> flat blue keyed out

⛔ tendies.jpg DO-NOT-COPY LIST. That reference is mostly furniture: a huge "TENDIES" wordmark, a
blond figure in a suit, a candlestick chart and a rocket. Only the frog and his platter are wanted,
so the crop below excludes the other four MECHANICALLY - there is no prompt that could leak them.

Run from the repo root:
  python video-creation/shorts/tutorial/robinhood-meme-rankings/_make_alpha_overlays.py
"""
import os
from collections import deque

from PIL import Image, ImageFilter

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", ".."))
REF = os.path.join(REPO, "schedule-tweets", "images", "reference")
OUT = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")


def alpha_from_luminance(im, floor=16, boost=1.9):
    """SKILL method: alpha = boosted luminance. Black -> transparent, glow feathers out."""
    im = im.convert("RGB")
    lum = im.convert("L").point(lambda v: 0 if v < floor else min(255, int(v * boost)))
    lum = lum.filter(ImageFilter.GaussianBlur(0.6))
    out = im.convert("RGBA")
    out.putalpha(lum)
    return out


def edge_flood_key(im, tol=64, feather=1.1):
    """Remove background pixels CONNECTED to the border and within `tol` of the border colour.

    Interior pixels of the same colour survive, which is the whole point (Toshi's head is the same
    blue as his background).
    """
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    # background colour = median-ish of the four corners
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))

    def near(p):
        return abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) <= tol * 3

    mask = Image.new("L", (w, h), 255)
    mpx = mask.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near(px[x, y]) and not seen[y * w + x]:
                seen[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if near(px[x, y]) and not seen[y * w + x]:
                seen[y * w + x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        mpx[x, y] = 0
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and near(px[nx, ny]):
                seen[ny * w + nx] = 1
                q.append((nx, ny))
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    im.putalpha(mask)
    return im


def kill_neon_green(im):
    """Zero the alpha of the "TENDIES" wordmark's NEON brush stroke, which physically overlaps the
    platter's bounding box and so cannot be cropped away.

    MEASURED separation on the reference: the stroke runs G 191-249 with G-R 69-144 and B <= 39; the
    frog's own green tops out at G 150 with G-R 62, the tenders are orange (G-R negative), the sauce
    is cream and the platter rim is near-white (B ~240). So the three tests below hit the stroke and
    nothing else. This is the DO-NOT-COPY list enforced in pixels.
    """
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    killed = 0
    # The stroke's ANTI-ALIASED edge pixels sit under the main threshold and left faint green speckle
    # in the right-hand columns, so the right 18 % of the crop (which contains only the platter rim -
    # near-white, G-R ~ 0 - and the stroke) gets a looser test. The frog never reaches x > 0.82w.
    right = int(w * 0.82)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not a:
                continue
            hit = g > 175 and (g - r) > 55 and b < 120
            if not hit and x >= right:
                hit = g > 120 and (g - r) > 35 and b < 130
            if hit:
                px[x, y] = (r, g, b, 0)
                killed += 1
    print(f"    neon-green wordmark stroke: {killed} px alpha-zeroed")
    return im


def trim(im, pad=8):
    """Crop to the alpha bounding box so the placed `width` is the SUBJECT, not empty margin."""
    bb = im.split()[-1].getbbox()
    if not bb:
        return im
    x0, y0, x1, y1 = bb
    x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
    x1 = min(im.size[0], x1 + pad); y1 = min(im.size[1], y1 + pad)
    return im.crop((x0, y0, x1, y1))


def report(name, im):
    a = im.split()[-1]
    hist = a.histogram()
    n = im.size[0] * im.size[1]
    clear = sum(hist[:8]) / n * 100
    opaque = sum(hist[248:]) / n * 100
    print(f"  {name:34s} {im.size[0]}x{im.size[1]}  transparent {clear:5.1f}%  opaque {opaque:5.1f}%")


jobs = []

# ── 1. $IF — the real What If art (green figure, back to us, gazing at a spiral galaxy) ──────────
#    Already a subject on a near-black starfield, so alpha-from-luminance keeps the figure AND the
#    galaxy and drops the black. floor 22 so the faint star field does not survive as grey haze.
#    boost 3.0 (not the 1.9 default): at 1.9 the figure came out only 7 % fully-opaque and read as a
#    ghost over the near-WHITE CoinMarketCap page it sits on at 4-7 s. The green figure's luminance is
#    ~90-140, so x3.0 makes it solid while the starfield (luminance 5-30) stays transparent.
im = Image.open(os.path.join(REF, "what-if.jpg"))
jobs.append(("broll-tut-rhm-ov-if.png", trim(alpha_from_luminance(im, floor=26, boost=3.0))))

# ── 2. COOPER — the real mark: a BLACK LAB in a lime bandana carrying the Robinhood mark ─────────
#    Flat lime disc background -> edge-flood key. The dog is BLACK, i.e. the opposite of
#    glow-on-black, so alpha-from-luminance would have erased the subject and kept the background.
im = Image.open(os.path.join(REF, "cooper.jpg"))
jobs.append(("broll-tut-rhm-ov-cooper.png", trim(edge_flood_key(im, tol=58))))

# ── 3. TOSHI — Brian Armstrong's cat, the comparison Mike name-checks for Cooper ─────────────────
#    Flat blue background; his head/ears are the SAME blue, hence the edge-connected flood.
im = Image.open(os.path.join(REF, "toshi.png"))
jobs.append(("broll-tut-rhm-ov-toshi.png", trim(edge_flood_key(im, tol=52))))

# ── 4. TENDIES — the frog + platter ONLY, cropped out of the busy 1500x500 banner ────────────────
#    Excluded mechanically by this crop: the "TENDIES" wordmark, the blond suit figure, the
#    candlestick chart, the rocket. Source is black-backed, so alpha-from-luminance applies.
#    The crop is measured on the 1500x500 reference: frog+platter occupy x 60-455, y 100-465. The
#    wordmark's first brush stroke unavoidably overlaps that box (it runs x 375-470), so the crop is
#    followed by kill_neon_green() - see its docstring for the measured separation.
im = Image.open(os.path.join(REF, "tendies.jpg"))
im = im.crop((30, 95, 462, 468))
jobs.append(("broll-tut-rhm-ov-tendies.png",
             trim(kill_neon_green(alpha_from_luminance(im, floor=20, boost=2.1)))))

print(f"writing to {OUT}")
for name, im in jobs:
    p = os.path.join(OUT, name)
    im.save(p)
    report(name, im)
print("done - 4 true-alpha overlay PNGs, ZERO generated images")
