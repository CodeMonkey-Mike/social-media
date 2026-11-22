"""Thumbnail "Token reveal" (2026-11-19): an edit of the "PEACH Minute-maid with Kaspa" stream thumbnail (-QEsb6QZbdQ),
which was itself built by ../peach/build.py. This one starts from that build's own pieces, not from YouTube's copy:

../peach/source.jpg              = the original scene (blue wall, Kaspa flame, Mike holding a cocktail glass).
../peach/assets/clean-plate.png  = that scene with headline line 1 and the glass taken out.
../peach/assets/hands-matte.png  = Mike's fingers that sit in FRONT of what he holds.
source.jpg                       = the published "PEACH Minute-maid" thumbnail (reference only).
assets/color-ref.png             = the colour Mike linked (an X profile picture): flat (52, 0, 236), an electric indigo.

Changes:
  1. the bottle becomes a COIN with a "?" on its face, in the reference indigo, held behind his fingers like the bottle.
  2. the Kaspa flame on the left is recoloured from teal to that indigo, and its "K" becomes a "?".
  3. headline: "Token reveal" in the source's green (where "PEACH Minute-maid" was, same tilt), "my new" / "200x" in the
     gold of "WITH KASPA" (where that sat). No peach.
Run:  python build.py   ->  thumbnail.jpg
All coordinates below are SOURCE px (1280x720) unless they say canvas.
"""
import importlib.util
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
from thumb_kit import GOLD_BOT, GOLD_MID, GOLD_TOP, HEADLINE_FONT, OUTLINE, H, W, export  # noqa: E402

_spec = importlib.util.spec_from_file_location('peach_build', os.path.join(ROOT, 'peach', 'build.py'))
peach = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(peach)

A = lambda *p: os.path.join(HERE, 'assets', *p)
P = lambda *p: os.path.join(ROOT, 'peach', *p)
K = W / 1280.0

INDIGO = np.array([52, 0, 236], np.float32)            # the reference colour
TARGET_HUE = 253.0                                     # its hue, degrees

# ---- headline -------------------------------------------------------------------------------------------------------
GREEN_LINE = dict(text='Token reveal', size=140, angle=5.5, origin=(42.0, 205.0))
GOLD_LINES = [dict(text='my new', size=92, x=328, base=275), dict(text='200x', size=150, x=322, base=405)]

# ---- the coin (source px): face centre, face semi-axes, edge thickness (seen on the right), tilt deg CCW ---------------
COIN = dict(cx=792, cy=505, rx=142, ry=170, edge=24, tilt=-6.0)

# ---- the "?" in the flame (source px): where the K was --------------------------------------------------------------
K_BOX = (86, 482, 210, 646)
FIRE_Q = dict(cx=147, cy=563, h=150)


def rgb(path, size=(W, H)):
    return np.array(Image.open(path).convert('RGB').resize(size, Image.LANCZOS)).astype(np.float32)


# ---- plate: peach's clean plate, minus "WITH KASPA", minus the K, glass hole refilled without the hand shade ----------

def make_plate(out):
    src = np.array(Image.open(P('assets', 'clean-plate.png')).convert('RGB'))
    s = src.astype(np.int16)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    h, w = src.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    a = src.astype(np.float32)

    # 1. "WITH KASPA": the gold letters, their black outline and drop shadow
    gold = ((r > 150) & (g > 100) & (b < 120) & (r > b + 70) & (yy > 150) & (yy < 380) & (xx > 310) & (xx < 630)).astype(np.uint8)
    hole = cv2.dilate(gold, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (45, 45)))
    hole[(xx < 300)] = 0
    fill = peach._fill(src, hole, hole, seed=3)
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
    a = a * (1 - m) + fill * m

    # 2. the glass hole again, filled from the wall WITHOUT peach's finger shade (the coin covers most of it; the rest
    #    must read as wall, not as dark finger shadows)
    matte = np.array(Image.open(P('assets', 'hands-matte.png')).convert('L')).astype(np.float32) / 255
    hands = cv2.resize(matte, (w, h), interpolation=cv2.INTER_AREA)
    glass = np.zeros((h, w), np.uint8)
    cv2.fillPoly(glass, [np.array(peach.GLASS, np.int32)], 1)
    glass = cv2.dilate(glass, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    hands_off = cv2.dilate((hands > .15).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    hands_off[:, :540] = 0
    hands_off[:300] = 0
    face_off = ((xx > 880) & (r > b)).astype(np.uint8)                 # his skin is no source for the wall
    base = np.clip(a, 0, 255).astype(np.uint8)
    gfill = peach._fill(base, glass & (1 - hands_off), hands_off | face_off, seed=11)
    gm = cv2.GaussianBlur((glass & (1 - hands_off)).astype(np.float32), (0, 0), 1.5)[..., None]
    a = a * (1 - gm) + gfill * gm

    # 3. the K inside the flame: pale, low-saturation, sharp-edged
    x0, y0, x1, y1 = K_BOX
    mx, mn = s.max(-1), s.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    kk = np.zeros((h, w), np.uint8)
    kk[y0:y1, x0:x1] = ((mn > 125) & (sat < .45))[y0:y1, x0:x1]
    kk = cv2.morphologyEx(kk, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    khole = cv2.dilate(kk, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17)))
    base = np.clip(a, 0, 255).astype(np.uint8)
    kfill = peach._fill(base, khole, khole, seed=21)
    km = cv2.GaussianBlur(khole.astype(np.float32), (0, 0), 2)[..., None]
    a = a * (1 - km) + kfill * km
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out)
    print('plate ->', out)


# ---- the flame: teal -> the reference indigo --------------------------------------------------------------------------

def recolor_fire(a):
    """Hue-rotates the cyan flame, its glow on the wall and the lit table edge to the reference hue, keeping each pixel's
    brightness and saturation (bright cores stay near white, so it still reads as fire). Wall blue is left alone."""
    u8 = np.clip(a, 0, 255).astype(np.uint8)
    hsv = cv2.cvtColor(u8, cv2.COLOR_RGB2HSV_FULL).astype(np.float32)
    hue = hsv[..., 0] * 360 / 256
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # hue weight: flame cyan / table green-teal = 1, fading out before the wall's royal blue (~212 deg)
    wh = np.clip((211 - hue) / 12, 0, 1) * np.clip((hue - 120) / 20, 0, 1)
    # space weight: the flame and its halo, and the table it lights (canvas px)
    fx, fy = 160 * K, 440 * K
    ell = ((xx - fx) / (230 * K)) ** 2 + ((yy - fy) / (330 * K)) ** 2
    ws = np.clip((1.35 - ell) / .35, 0, 1)
    ws = np.maximum(ws, ((xx < 470 * K) & (yy > 655 * K)).astype(np.float32))
    ws = cv2.GaussianBlur(ws, (0, 0), 12)
    wgt = (wh * ws)[..., None]
    nh = (TARGET_HUE * 256 / 360) % 256
    new = hsv.copy()
    new[..., 0] = nh
    new[..., 1] = np.clip(hsv[..., 1] * 1.08, 0, 255)
    new[..., 2] = np.clip(hsv[..., 2] * 1.06, 0, 255)
    rec = cv2.cvtColor(np.clip(new, 0, 255).astype(np.uint8), cv2.COLOR_HSV2RGB_FULL).astype(np.float32)
    return a * (1 - wgt) + rec * wgt


def fire_question(canvas):
    """A "?" where the K was: flat and pale like the K, with a faint indigo glow so it sits inside the fire."""
    Z = 2
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', 400)
    bb = font.getbbox('?')
    sc = FIRE_Q['h'] * K * Z / (bb[3] - bb[1])
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', round(400 * sc))
    L = Image.new('L', (W * Z, H * Z), 0)
    ImageDraw.Draw(L).text((FIRE_Q['cx'] * K * Z, FIRE_Q['cy'] * K * Z), '?', font=font, fill=255, anchor='mm')
    q = L.resize((W, H), Image.LANCZOS)
    canvas.alpha_composite(peach._layer(q.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(16)), (120, 90, 255), .75))
    canvas.alpha_composite(peach._layer(q, (226, 220, 255), .94))


# ---- the coin -------------------------------------------------------------------------------------------------------

def coin_rgba():
    """The coin drawn at 4x then reduced, canvas-size RGBA float32. Built upright about its own centre, then turned:
    the edge (a darker reeded band) shows on the right, the face is an indigo gradient with a raised lavender rim and an
    embossed white "?", a soft specular sweep top-left."""
    Z = 4
    cx, cy = COIN['cx'] * K * Z, COIN['cy'] * K * Z
    rx, ry, e = COIN['rx'] * K * Z, COIN['ry'] * K * Z, COIN['edge'] * K * Z
    big = (W * Z, H * Z)

    def ell(dx, sx, sy):
        m = Image.new('L', big, 0)
        ImageDraw.Draw(m).ellipse((cx + dx - sx, cy - sy, cx + dx + sx, cy + sy), fill=255)
        return m

    out = Image.new('RGBA', big, (0, 0, 0, 0))
    # edge: a stack of ellipses from the face to `e` to the right, darker toward the back, then reeding lines
    side = Image.new('L', big, 0)
    sd = ImageDraw.Draw(side)
    for i in range(int(e) + 1):
        sd.ellipse((cx + i - rx, cy - ry, cx + i + rx, cy + ry), fill=255)
    side_rgb = Image.new('RGBA', big, (30, 4, 150, 255))
    # reeding: thin vertical darker/lighter stripes over the side band
    reed = Image.new('RGBA', big, (0, 0, 0, 0))
    rd = ImageDraw.Draw(reed)
    for k in range(-60, 61):
        t = k / 60.0
        y = cy + ry * np.sin(t * np.pi / 2)
        half = rx * np.cos(t * np.pi / 2)
        x0 = cx + half
        rd.line((x0, y, x0 + e, y), fill=(14, 0, 90, 150) if k % 2 else (90, 60, 230, 110), width=max(2, int(Z * 1.5)))
    side_rgb.putalpha(side)
    out.alpha_composite(side_rgb)
    reed_a = ImageChops.multiply(reed.getchannel('A'), side)
    reed.putalpha(reed_a)
    out.alpha_composite(reed)

    # face: indigo gradient, light top-left -> deep bottom-right
    face = ell(0, rx, ry)
    h, w = big[1], big[0]
    gy, gx = np.mgrid[0:h:8, 0:w:8].astype(np.float32)
    t = np.clip(((gx * 8 - (cx - rx)) / (2 * rx)) * .45 + ((gy * 8 - (cy - ry)) / (2 * ry)) * .55, 0, 1)
    top, mid, bot = np.array([118, 78, 255.]), INDIGO, np.array([26, 0, 128.])
    col = np.where(t[..., None] < .5, top + (mid - top) * (t[..., None] / .5), mid + (bot - mid) * ((t[..., None] - .5) / .5))
    grad = Image.fromarray(col.astype(np.uint8)).resize(big, Image.BILINEAR).convert('RGBA')
    grad.putalpha(face)
    out.alpha_composite(grad)
    # raised rim: a lavender ring, light on the top-left, dark inner bevel line
    rw = .085
    inner = ell(0, rx * (1 - rw), ry * (1 - rw))
    ring = ImageChops.subtract(face, inner)
    rcol = np.where(t[..., None] < .5, np.array([200, 185, 255.]) + (np.array([120, 90, 250.]) - np.array([200, 185, 255.])) * (t[..., None] / .5),
                    np.array([120, 90, 250.]) + (np.array([48, 14, 170.]) - np.array([120, 90, 250.])) * ((t[..., None] - .5) / .5))
    rimg = Image.fromarray(rcol.astype(np.uint8)).resize(big, Image.BILINEAR).convert('RGBA')
    rimg.putalpha(ring)
    out.alpha_composite(rimg)
    bevel = ImageChops.subtract(inner, ell(0, rx * (1 - rw) - 3 * Z, ry * (1 - rw) - 3 * Z))
    out.alpha_composite(peach_layer(bevel, (16, 0, 80), .85, big))
    # second thin inner ring (a coin's beaded border)
    ir = ImageChops.subtract(ell(0, rx * .80, ry * .80), ell(0, rx * .80 - 2.5 * Z, ry * .80 - 2.5 * Z))
    out.alpha_composite(peach_layer(ir, (170, 150, 255), .55, big))

    # "?": white, embossed (dark shadow down-right, lavender lip up-left), squeezed to the face's aspect
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', 400)
    bb = font.getbbox('?')
    qh = ry * 1.02
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', round(400 * qh / (bb[3] - bb[1])))
    q = Image.new('L', big, 0)
    ImageDraw.Draw(q).text((cx, cy - ry * .03), '?', font=font, fill=255, anchor='mm')
    sqx = rx / ry
    q = q.transform(big, Image.AFFINE, (1 / sqx, 0, cx - cx / sqx, 0, 1, 0), resample=Image.BICUBIC)
    out.alpha_composite(peach_layer(ImageChops.offset(q, int(5 * Z), int(7 * Z)).filter(ImageFilter.GaussianBlur(4 * Z)), (8, 0, 50), .75, big))
    out.alpha_composite(peach_layer(ImageChops.offset(q, int(-2 * Z), int(-2 * Z)), (190, 175, 255), 1.0, big))
    qf = Image.new('RGBA', big, (255, 255, 255, 0))
    # the "?" fill: white at the top, a touch lavender at the bottom
    qg = np.linspace(0, 1, h // 8, dtype=np.float32)[:, None, None]
    qcol = np.array([255, 255, 255.]) * (1 - qg) + np.array([222, 214, 255.]) * qg
    qf = Image.fromarray(np.broadcast_to(qcol, (h // 8, w // 8, 3)).astype(np.uint8)).resize(big, Image.BILINEAR).convert('RGBA')
    qf.putalpha(q)
    out.alpha_composite(qf)

    # specular sweep top-left over the face
    spec = ell(-rx * .28, rx * .55, ry * .42).filter(ImageFilter.GaussianBlur(rx * .25))
    spec = ImageChops.multiply(spec, inner)
    out.alpha_composite(peach_layer(spec.filter(ImageFilter.GaussianBlur(10 * Z)), (255, 255, 255), .28, big))

    out = out.rotate(COIN['tilt'], resample=Image.BICUBIC, center=(cx, cy))
    out = out.resize((W, H), Image.LANCZOS)
    return np.array(out).astype(np.float32)


def peach_layer(mask, color, opacity, size):
    im = Image.new('RGBA', size, tuple(color) + (0,))
    im.putalpha(mask.point(lambda v: int(v * opacity)))
    return im


# ---- gold words (the "WITH KASPA" look) -----------------------------------------------------------------------------

def gold_lines(canvas):
    for ln in GOLD_LINES:
        font = ImageFont.truetype(HEADLINE_FONT, round(ln['size'] * K))
        txt = Image.new('L', (W, H), 0)
        stroke = Image.new('L', (W, H), 0)
        org = (ln['x'] * K, ln['base'] * K)
        ImageDraw.Draw(txt).text(org, ln['text'], font=font, fill=255, anchor='ls')
        ImageDraw.Draw(stroke).text(org, ln['text'], font=font, fill=255, anchor='ls', stroke_width=6, stroke_fill=255)
        bb = txt.getbbox()
        print(f"{ln['text']!r}: x {bb[0] / K:.0f}-{bb[2] / K:.0f}, y {bb[1] / K:.0f}-{bb[3] / K:.0f} (source px)")
        y1, y2 = bb[1], bb[3]
        t = np.clip((np.arange(H, dtype=np.float32) - y1) / max(y2 - y1, 1), 0, 1)
        c0, c1, c2 = (np.array(c, np.float32) for c in (GOLD_TOP, GOLD_MID, GOLD_BOT))
        col = np.where((t < .45)[:, None], c0 + (c1 - c0) * (t / .45)[:, None], c1 + (c2 - c1) * ((t - .45) / .55)[:, None])
        fill = Image.fromarray(np.broadcast_to(col[:, None, :], (H, W, 3)).astype(np.uint8)).convert('RGBA')
        fill.putalpha(txt)
        canvas.alpha_composite(peach._layer(stroke.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(14)), (0, 0, 0), .85))
        canvas.alpha_composite(peach._layer(ImageChops.offset(stroke, 6, 9).filter(ImageFilter.GaussianBlur(3)), (0, 0, 0), .85))
        canvas.alpha_composite(peach._layer(stroke, OUTLINE))
        canvas.alpha_composite(fill)


# ---- build ----------------------------------------------------------------------------------------------------------

def build():
    plate_path = A('plate.png')
    if not os.path.exists(plate_path):
        make_plate(plate_path)
    plate = rgb(plate_path)
    orig = rgb(P('source.jpg'))
    matte = np.array(Image.open(P('assets', 'hands-matte.png')).convert('L')).astype(np.float32) / 255

    a = recolor_fire(plate)
    coin = coin_rgba()
    shift = lambda m, dx, dy: np.roll(np.roll(m, dy, 0), dx, 1)
    sh = .50 * cv2.GaussianBlur(shift(matte, 9, 12), (0, 0), 10) + .38 * cv2.GaussianBlur(shift(matte, 3, 5), (0, 0), 3.5)
    coin[..., :3] *= (1 - np.clip(sh, 0, .72))[..., None]
    ca = coin[..., 3:4] / 255
    a = a * (1 - ca) + coin[..., :3] * ca
    a = a * (1 - matte[..., None]) + orig * matte[..., None]                     # fingers back in front
    canvas = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')

    fire_question(canvas)
    peach.green_word(canvas, **GREEN_LINE)
    gold_lines(canvas)
    export(canvas, os.path.join(HERE, 'thumbnail.jpg'))


if __name__ == '__main__':
    build()
