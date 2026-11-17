"""Thumbnail "Peach Minute-maid" (2026-11-15): an edit of the "White Thr33-$ome with Kaspa" stream thumbnail (HsflRQDlS1g),
the same way 2026-11-09-my-100x-plays edited "The Bull Run Is Here".

source.jpg                   = that stream's thumbnail, YouTube's 1280x720 (kept as is: blue wall, Kaspa flame, "WITH KASPA", Mike).
assets/minute-maid-peach.jpg = the product shot Mike linked (569x904, on white, a "20oz" badge touching its left edge).
assets/clean-plate.png       = source with the first headline line and the cocktail glass taken out (made once, then reused).
assets/hands-matte.png       = Mike's fingers that sit in FRONT of the drink (made once by GrabCut, then reused).
Two changes only:
  1. the cocktail glass becomes the Minute Maid Peach bottle. The bottle goes BEHIND his fingers (the matte puts the
     source's own fingers back on top) and in front of everything else, lit like the scene: teal rim on the left, shade
     on the right, the fingers' shadows on the label.
  2. headline line 1 "WHITE Thr33-$ome" -> "PEACH Minute-maid": same font (Impact), size, angle and baseline as the
     source (fitted), "PEACH" in peach where "WHITE" was white, "Minute-maid" in the same green with its glow.
Run:  python build.py [take ...]   ->  take-<n>.jpg   (no argument = every take)
All coordinates below are SOURCE px (1280x720) unless they say canvas.
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import grey_closing, grey_opening
from scipy.signal import savgol_filter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from thumb_kit import HEADLINE_FONT, H, W, export  # noqa: E402

A = lambda *p: os.path.join(HERE, 'assets', *p)
K = W / 1280.0                                   # source px -> canvas px

# ---- headline line 1, fitted to the source (Impact; "WHITE" 109 px at 5.0 deg, "Thr33-$ome" 113 px at 5.5 deg) -----
PEACH_WORD = dict(text='PEACH', size=109, angle=5.0, origin=(35.0, 184.3))
GREEN_WORD = dict(text='Minute-maid', size=113, angle=5.5, origin=(333.1, 158.3))
PEACH_TOP, PEACH_BOT = (255, 200, 160), (255, 150, 106)       # the peach of the drink, lighter at the top of the letters
GREEN = (22, 244, 75)                                          # sampled from the source's "Thr33-$ome"

# ---- the bottle in the product shot ---------------------------------------------------------------------------------
B_CX, B_TOP, B_BOT, B_W = 430, 1, 867, 278                     # axis x, cap top, feet bottom, widest body (native px)

# ---- takes: where the bottle sits (source px). width = body width, cx = axis x, top = cap top, tilt = deg CCW --------
TAKES = {
    1: dict(width=205, cx=809, top=150, tilt=0.0),      # upright, the size of the grip
    2: dict(width=205, cx=818, top=152, tilt=7.0),      # tipped toward the headline
    3: dict(width=190, cx=817, top=165, tilt=0.0),      # smaller, the whole label clear of his fingers
}


def src_rgb():
    return np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB'))


# ---- the fingers in front of the drink ------------------------------------------------------------------------------

GC_BOX, GC_Z = (560, 320, 1000, 720), 2                        # the crop GrabCut runs on, and its upscale
GLINTS = [(680, 544, 708, 564), (682, 598, 712, 624), (738, 604, 754, 616)]   # boxes holding glass glints between his fingers


def hands_matte(out):
    """GrabCut on a 2x crop around the glass, seeded by hand: finger cores = sure hand, glass interior / wall / shirt =
    sure not. Saved at canvas size (L). Only its edges against the glass matter: everywhere else the picture under the
    matte is the source itself."""
    src = src_rgb()
    x0, y0, x1, y1 = GC_BOX
    crop = cv2.resize(src[y0:y1, x0:x1], None, fx=GC_Z, fy=GC_Z, interpolation=cv2.INTER_CUBIC)
    h, w = crop.shape[:2]
    P = lambda x, y: (int((x - x0) * GC_Z), int((y - y0) * GC_Z))
    m = np.full((h, w), cv2.GC_PR_BGD, np.uint8)

    def poly(pts, val):
        cv2.fillPoly(m, [np.array([P(*p) for p in pts], np.int32)], val)

    def line(pts, val, r):
        for a, b in zip(pts[:-1], pts[1:]):
            cv2.line(m, P(*a), P(*b), val, int(r * GC_Z * 2))

    poly([(560, 400), (700, 405), (740, 425), (770, 500), (770, 600), (745, 665), (700, 700), (560, 720)], cv2.GC_PR_FGD)   # left hand, roughly
    poly([(750, 660), (830, 632), (1000, 600), (1000, 720), (750, 720)], cv2.GC_PR_FGD)                                       # right hand, roughly
    poly([(772, 350), (905, 350), (895, 500), (885, 628), (772, 628)], cv2.GC_BGD)                    # glass, right of the fingertips
    poly([(672, 350), (772, 350), (772, 410), (740, 412), (700, 400), (676, 398)], cv2.GC_BGD)        # glass, above the index finger
    poly([(560, 320), (668, 320), (664, 395), (610, 398), (575, 415), (560, 440)], cv2.GC_BGD)        # wall above the hand
    poly([(664, 472), (680, 472), (682, 494), (668, 496)], cv2.GC_BGD)                                # wall between index + middle
    poly([(735, 483), (772, 480), (772, 496), (745, 496)], cv2.GC_BGD)                                # glass between index tip + middle
    poly([(915, 420), (1000, 420), (1000, 560), (915, 600)], cv2.GC_BGD)                              # shirt
    poly([(700, 668), (757, 667), (763, 690), (776, 720), (690, 720)], cv2.GC_BGD)                    # the dark gap between the hands
    poly([(735, 632), (820, 630), (880, 628), (878, 640), (832, 644), (812, 652), (742, 655)], cv2.GC_BGD)   # glass base
    line([(585, 455), (640, 440), (712, 452)], cv2.GC_FGD, 9)        # index
    line([(585, 520), (660, 512), (745, 533)], cv2.GC_FGD, 10)       # middle
    line([(585, 585), (660, 580), (735, 594)], cv2.GC_FGD, 8)        # ring
    line([(585, 640), (660, 636), (716, 642)], cv2.GC_FGD, 6)        # pinky
    line([(840, 668), (900, 664), (990, 650)], cv2.GC_FGD, 9)        # right index
    line([(775, 688), (840, 705), (990, 700)], cv2.GC_FGD, 7)        # right middle
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(crop[:, :, ::-1].copy(), m, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    fg = ((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg)                                   # specks out
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] < 1500:
            fg[lab == i] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(1 - fg)                               # pinholes in
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] < 300:
            fg[lab == i] = 1
    cw, ch = round((x1 - x0) * K), round((y1 - y0) * K)
    small = cv2.resize(fg.astype(np.float32), (cw, ch), interpolation=cv2.INTER_AREA)
    full = np.zeros((H, W), np.float32)
    full[round(y0 * K):round(y0 * K) + ch, round(x0 * K):round(x0 * K) + cw] = small
    full = cv2.GaussianBlur(full, (0, 0), 1.3)
    full = np.clip((full - .60) * 2.6 + .5, 0, 1)                                          # a hair inside the edge: no glass fringe
    # glints of the glass caught between two fingers: grey or white where everything around is skin. Out of the matte.
    up = cv2.resize(src, (W, H), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    val = up.max(-1)
    sat = (val - up.min(-1)) / np.maximum(val, 1)
    for bx0, by0, bx1, by1 in GLINTS:
        sl = (slice(round(by0 * K), round(by1 * K)), slice(round(bx0 * K), round(bx1 * K)))
        kill = cv2.dilate(((sat[sl] < .25) & (val[sl] > 100)).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32)
        full[sl] *= 1 - cv2.GaussianBlur(kill, (0, 0), .8)
    Image.fromarray((full * 255).astype(np.uint8)).save(out)
    print('hands matte ->', out)


# ---- the plate: the source without headline line 1 and without the glass --------------------------------------------

GLASS = [(664, 365), (668, 352), (690, 345), (720, 341), (735, 337), (755, 333), (790, 331), (815, 335), (840, 339),
         (880, 343), (905, 349), (913, 360), (910, 400), (903, 480), (897, 560), (890, 620), (884, 655), (876, 664),
         (830, 666), (760, 666), (722, 664), (704, 648), (686, 618), (683, 560), (679, 480), (671, 410)]


def _fill(src, hole, sources_off, seed):
    """`hole` (uint8 0/1) filled from its surroundings, never from `sources_off` pixels. Pull-push: the known pixels are
    averaged down a pyramid and the holes read back up it, so the fill is a smooth blend of everything around the hole
    (Telea dragged the dark top of the wall down as a band). The wall's own grain goes on top. Returns float32."""
    a = src.astype(np.float32)
    h, w = hole.shape
    known = 1 - ((hole > 0) | (sources_off > 0)).astype(np.float32)
    levels, ca, cw = [], a * known[..., None], known
    while min(ca.shape[:2]) > 6:
        levels.append((ca, cw))
        size = (ca.shape[1] // 2, ca.shape[0] // 2)
        ca, cw = cv2.resize(ca, size, interpolation=cv2.INTER_AREA), cv2.resize(cw, size, interpolation=cv2.INTER_AREA)
    cur = ca / np.maximum(cw[..., None], 1e-4)
    for la, lw in reversed(levels):
        up = cv2.resize(cur, (la.shape[1], la.shape[0]), interpolation=cv2.INTER_LINEAR)
        wc = np.clip(lw * 4, 0, 1)[..., None]                                             # trust a level once it is 1/4 known
        cur = wc * la / np.maximum(lw[..., None], 1e-4) + (1 - wc) * up
    fill = cv2.GaussianBlur(cur, (0, 0), 5)
    unknown = (known < .5).astype(np.uint8)
    ring = (cv2.dilate(unknown, np.ones((61, 61), np.uint8)) - unknown) > 0
    blue = (src[..., 2].astype(np.int16) > src[..., 0].astype(np.int16) + 60)          # grain is sampled off the wall only
    hp = a - cv2.GaussianBlur(a, (0, 0), 2.0)
    std = hp[ring & blue].std(0)
    rng = np.random.default_rng(seed)
    for c in range(3):
        nz = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 0.9)
        fill[..., c] += nz / nz.std() * std[c]
    return fill


def make_plate(out, matte_canvas):
    src = src_rgb()
    s = src.astype(np.int16)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    h, w = src.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]

    # 1. headline line 1: the white word and the green word, with their shadow and glow
    white = ((s.min(-1) > 205) & (yy < 205) & (xx < 335)).astype(np.uint8)
    green = ((g > 150) & (g > r + 60) & (g > b + 40) & (yy < 200)).astype(np.uint8)
    text = cv2.dilate(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (63, 63))) | \
        cv2.dilate(green, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (67, 67)))
    text[:, 935:] = 0                                                                    # Mike's hair starts here
    text[(yy > 210) & (xx < 330)] = 0                                                    # the tip of the Kaspa flame
    gold = ((r > 150) & (g > 100) & (b < 120) & (r > b + 70) & (yy > 160) & (yy < 372) & (xx > 315) & (xx < 625)).astype(np.uint8)
    keep = cv2.dilate(gold, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))      # "WITH KASPA" + its outline stay
    hole = (text > 0) & (keep == 0)
    fill = _fill(src, hole.astype(np.uint8), cv2.dilate(gold, np.ones((41, 41), np.uint8)), seed=5)   # gold + its shadow: never a source
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
    a = src.astype(np.float32) * (1 - m) + fill * m

    # 2. the glass: everything inside its outline that is not a finger. Filled with the fingers switched off as
    #    sources, so no skin smears into the wall; the fingers themselves come back from the source in build().
    glass = np.zeros((h, w), np.uint8)
    cv2.fillPoly(glass, [np.array(GLASS, np.int32)], 1)
    glass = cv2.dilate(glass, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    hands = cv2.resize(matte_canvas, (w, h), interpolation=cv2.INTER_AREA)
    hands_off = (cv2.dilate((hands > .15).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))) > 0).astype(np.uint8)
    hands_off[:, :540] = 0
    hands_off[:300] = 0
    base = np.clip(a, 0, 255).astype(np.uint8)
    gfill = _fill(base, glass, hands_off, seed=9)
    # between two fingers the wall is in the hand's shade
    occl = cv2.GaussianBlur((hands > .5).astype(np.float32), (0, 0), 10)
    gfill *= (1 - .45 * np.clip((occl - .5) / .3, 0, 1))[..., None]
    gm = cv2.GaussianBlur(glass.astype(np.float32), (0, 0), 1.5)[..., None]
    a = a * (1 - gm) + gfill * gm
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out)
    print('plate ->', out)


# ---- the bottle -----------------------------------------------------------------------------------------------------

def bottle_rgba():
    """The product shot cut off its white background, RGBA float32 (native size). The silhouette is taken row by row
    (leftmost to rightmost non-white pixel), so the white in the label stays solid; where the "20oz" badge touches the
    left edge the right edge is mirrored. The empty neck above the drink is made see-through, and the bottle is lit for
    the scene: teal rim on its left, shade on its right, a little more contrast."""
    im = np.array(Image.open(A('minute-maid-peach.jpg')).convert('RGB')).astype(np.float32)
    h, w = im.shape[:2]
    nonwhite = im.min(-1) < 236
    nonwhite[:, :286] = False
    nonwhite[B_BOT + 1:] = False
    left, right = np.full(h, np.nan, np.float32), np.full(h, np.nan, np.float32)
    for y in range(h):
        xs = np.where(nonwhite[y])[0]
        if len(xs):
            l, r = xs.min(), xs.max()
            if 596 <= y <= 748 or 415 <= y <= 485:           # the badge, and the shop's faint watermark beside the label
                l = max(l, 2 * B_CX - r)
            left[y], right[y] = l, r
    ys = np.where(~np.isnan(left))[0]
    left[ys] = grey_closing(left[ys], size=13)                # nubs that stick OUT for a few rows (an embossed ridge, jpeg dust)
    right[ys] = grey_opening(right[ys], size=13)
    for arr in (left, right):                                 # the outline as two smooth curves: row jitter and stair-steps out
        v = cv2.medianBlur(arr[ys].reshape(-1, 1), 5)[:, 0]
        arr[ys] = savgol_filter(v, 9, 2)
    left[ys] += 1.4                                           # a hair inside the edge: no white fringe
    right[ys] -= 1.4
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    lcol, rcol = np.nan_to_num(left, nan=1e6)[:, None], np.nan_to_num(right, nan=-1e6)[:, None]
    alpha = np.clip(xx - lcol + .5, 0, 1) * np.clip(rcol - xx + .5, 0, 1)                 # exact pixel coverage of the outline
    inner = (alpha > .99).astype(np.float32)
    # colour at the edge: pushed out from the inside
    soft = cv2.GaussianBlur(im * inner[..., None], (0, 0), 2) / np.maximum(cv2.GaussianBlur(inner, (0, 0), 2), 1e-3)[..., None]
    rgb = np.where(inner[..., None] > .5, im, soft)

    span = np.maximum(rcol - lcol, 1)
    u = np.clip((xx - lcol) / span, 0, 1)                                                 # 0 = left edge, 1 = right edge
    # the empty neck: bright + colourless inside rows 60-160 -> mostly see-through, its grey edges stay
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    clear = np.clip((mn - 150) / 90, 0, 1) * (sat < .14) * ((yy > 58) & (yy < 162))
    alpha = alpha * (1 - .78 * clear)
    # tone: a little more contrast and colour, like the rest of the frame
    grey = rgb.mean(-1, keepdims=True)
    rgb = grey + (rgb - grey) * 1.14
    rgb = (rgb - 128) * 1.08 + 128
    # shade on the right (the side turned to his shirt), a soft fall-off on the far left before the rim
    sm = lambda e0, e1, x: np.clip((x - e0) / (e1 - e0), 0, 1) ** 2 * (3 - 2 * np.clip((x - e0) / (e1 - e0), 0, 1))
    shade = 1 - .34 * sm(.48, 1.0, u) - .10 * sm(.22, .04, u)
    rgb = rgb * shade[..., None]
    # teal rim light on the left edge, as on his fingers
    rim = np.exp(-(u / .038) ** 2) * .42
    teal = np.array([110, 245, 200], np.float32)
    rgb = rgb + (teal - rgb) * rim[..., None]
    return np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.float32)


def place_bottle(bottle, width, cx, top, tilt, pivot_y=540):
    """The bottle warped onto the canvas: body `width` wide, axis at x=cx, cap top at y=top (source px), then turned
    `tilt` deg counter-clockwise about (cx, pivot_y), the height of the grip. Returns canvas-size RGBA float32."""
    s = width * K / B_W
    th = np.deg2rad(tilt)
    c, sn = np.cos(th), np.sin(th)
    # native -> canvas, upright: x = (xn - B_CX) s + cx K ; y = (yn - B_TOP) s + top K
    U = np.array([[s, 0, cx * K - B_CX * s], [0, s, top * K - B_TOP * s], [0, 0, 1]], np.float64)
    px, py = cx * K, pivot_y * K
    R = np.array([[c, sn, px - c * px - sn * py], [-sn, c, py + sn * px - c * py], [0, 0, 1]], np.float64)
    M = (R @ U)[:2]
    pm = bottle.copy()
    pm[..., :3] *= pm[..., 3:4] / 255                                                     # premultiplied through the warp
    out = cv2.warpAffine(pm, M, (W, H), flags=cv2.INTER_CUBIC, borderValue=(0, 0, 0, 0))
    out[..., 3] = np.clip(out[..., 3], 0, 255)
    out[..., :3] = np.clip(out[..., :3] / np.maximum(out[..., 3:4] / 255, 1e-3), 0, 255)
    return out


# ---- the headline words ---------------------------------------------------------------------------------------------

def _word_mask(text, size, angle, origin):
    """The word as an L mask on the canvas: left end of its baseline at `origin`, turned `angle` deg CCW about it.
    Drawn at 2x and reduced, so the turned edges stay clean."""
    Z = 2
    font = ImageFont.truetype(HEADLINE_FONT, round(size * K * Z))
    ox, oy = origin[0] * K * Z, origin[1] * K * Z
    L = Image.new('L', (W * Z, H * Z), 0)
    ImageDraw.Draw(L).text((ox, oy), text, font=font, fill=255, anchor='ls')
    L = L.rotate(angle, resample=Image.BICUBIC, center=(ox, oy))
    return L.resize((W, H), Image.LANCZOS)


def _layer(mask, color, opacity=1.0):
    im = Image.new('RGBA', (W, H), tuple(color) + (0,))
    im.putalpha(mask.point(lambda v: int(v * opacity)))
    return im


def _extent(mask):
    bb = mask.getbbox()
    return f'x {bb[0] / K:.0f}-{bb[2] / K:.0f}, y {bb[1] / K:.0f}-{bb[3] / K:.0f} (source px)'


def peach_word(canvas, text, size, angle, origin):
    """Where the source had "WHITE": flat fill, a hard black drop shadow down-right and a soft dark halo. The fill is
    peach, a shade lighter at the top of the letters."""
    txt = _word_mask(text, size, angle, origin)
    print(f'{text!r}: {_extent(txt)}')
    canvas.alpha_composite(_layer(ImageChops.offset(txt.filter(ImageFilter.MaxFilter(9)), 8, 12).filter(ImageFilter.GaussianBlur(14)), (0, 4, 20), .70))
    canvas.alpha_composite(_layer(txt.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2.2)), (0, 2, 12), .90))
    canvas.alpha_composite(_layer(ImageChops.offset(txt, 5, 7).filter(ImageFilter.GaussianBlur(1.6)), (0, 0, 6), .96))
    bb = txt.getbbox()
    t = np.clip((np.arange(H, dtype=np.float32) - bb[1]) / max(bb[3] - bb[1], 1), 0, 1)[:, None, None]
    grad = np.array(PEACH_TOP, np.float32) * (1 - t) + np.array(PEACH_BOT, np.float32) * t
    fill = Image.fromarray(np.broadcast_to(grad, (H, W, 3)).astype(np.uint8)).convert('RGBA')
    fill.putalpha(txt)
    canvas.alpha_composite(fill)


def green_word(canvas, text, size, angle, origin):
    """Where the source had "Thr33-$ome": flat green, a lighter lip just inside the edge, a thin dark-green outline, a
    green glow and a soft shadow down-right."""
    txt = _word_mask(text, size, angle, origin)
    print(f'{text!r}: {_extent(txt)}')
    canvas.alpha_composite(_layer(ImageChops.offset(txt, 7, 10).filter(ImageFilter.GaussianBlur(9)), (0, 10, 30), .55))
    canvas.alpha_composite(_layer(txt.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(13)), (20, 235, 80), .50))
    canvas.alpha_composite(_layer(txt.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(1.4)), (2, 96, 36), .85))
    canvas.alpha_composite(_layer(txt, GREEN))
    lip = ImageChops.subtract(txt, txt.filter(ImageFilter.MinFilter(7))).filter(ImageFilter.GaussianBlur(1.0))
    canvas.alpha_composite(_layer(ImageChops.multiply(lip, txt), (120, 255, 150), .55))


# ---- build ----------------------------------------------------------------------------------------------------------

def build(take):
    p = TAKES[take]
    matte_path, plate_path = A('hands-matte.png'), A('clean-plate.png')
    if not os.path.exists(matte_path):
        hands_matte(matte_path)
    matte = np.array(Image.open(matte_path).convert('L')).astype(np.float32) / 255
    if not os.path.exists(plate_path):
        make_plate(plate_path, matte)
    plate = np.array(Image.open(plate_path).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
    orig = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)

    bot = place_bottle(bottle_rgba(), p['width'], p['cx'], p['top'], p['tilt'])
    # his fingers shade the bottle: a tight contact shadow under each finger and a wider soft one, both down-right
    shift = lambda m, dx, dy: np.roll(np.roll(m, dy, 0), dx, 1)
    sh = .50 * cv2.GaussianBlur(shift(matte, 9, 12), (0, 0), 10) + .38 * cv2.GaussianBlur(shift(matte, 3, 5), (0, 0), 3.5)
    bot[..., :3] *= (1 - np.clip(sh, 0, .72))[..., None]
    ba = bot[..., 3:4] / 255
    a = plate * (1 - ba) + bot[..., :3] * ba
    a = a * (1 - matte[..., None]) + orig * matte[..., None]                              # fingers back in front
    canvas = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')

    peach_word(canvas, **PEACH_WORD)
    green_word(canvas, **GREEN_WORD)
    export(canvas, os.path.join(HERE, f'take-{take}.jpg'))


if __name__ == '__main__':
    for t in ([int(v) for v in sys.argv[1:]] or sorted(TAKES)):
        build(t)
