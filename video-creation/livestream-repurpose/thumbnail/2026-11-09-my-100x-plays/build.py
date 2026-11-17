"""Thumbnail "my 100x plays" (2026-11-09): an edit of the "The Bull Run Is Here" stream thumbnail (YaYyrok6rOs), the same way
2026-11-04-bull-run-back and 2026-11-07-300-to-333k edited "Get Ready For Pumps".

source.jpg        = that stream's thumbnail, YouTube's 1280x720 (kept as is: bulls, NFT cat card, blue "?" coin, Mike).
assets/logo.jpg   = the logo Mike linked (an X profile picture, natively 198x198) that replaces the green "?" coin.
assets/clean-plate.png = source with the old headline taken out (made once by make_plate, then reused).
Two changes only: the headline text, and the green coin's face. The logo coin keeps the old coin's exact outline, tilt and
thickness, so the dirt in front of it, the bowl behind it and the lighting all stay as they were.
Run:  python build.py   ->  thumbnail.jpg
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from thumb_kit import HEADLINE_FONT, H, W, export  # noqa: E402

A = lambda *p: os.path.join(HERE, 'assets', *p)
K = W / 1280.0                                   # source px -> canvas px

LINES, SIZE, X, Y, GAP = ['my 100x plays'], 205, 52, 46, 26     # one idea, one line, like the source; clears Mike's hair


# ---- the plate: the source with its headline removed --------------------------------------------------------------

def make_plate(out):
    """White headline + its dark halo and shadow, filled from the sky around it (smooth fill at low res + the sky's own grain)."""
    src = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB'))
    a = src.astype(np.float32)
    band = np.zeros(src.shape[:2], np.uint8)
    band[40:175, 30:870] = 1
    white = ((src.min(-1) > 205) & (band > 0)).astype(np.uint8)
    mask = cv2.dilate(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (47, 47)))
    mask[:, 880:] = 0
    mask = cv2.dilate(mask, np.ones((1, 1), np.uint8))
    h, w = mask.shape
    small = cv2.resize(src, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    ms = (cv2.resize(mask, (w // 4, h // 4), interpolation=cv2.INTER_AREA) > 0).astype(np.uint8) * 255
    fill = cv2.inpaint(small[:, :, ::-1].copy(), ms, 7, cv2.INPAINT_TELEA)[:, :, ::-1]
    fill = cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    fill = cv2.GaussianBlur(fill, (0, 0), 4)
    ring = cv2.dilate(mask, np.ones((61, 61), np.uint8)) - mask             # clean sky just outside the hole: the grain to match
    hp = a - cv2.GaussianBlur(a, (0, 0), 2.0)
    std = hp[ring > 0].std(0)
    rng = np.random.default_rng(5)
    for c in range(3):
        n = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 0.9)
        fill[..., c] += n / n.std() * std[c]
    m = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 5)[..., None]
    out_im = np.clip(a * (1 - m) + fill * m, 0, 255).astype(np.uint8)
    Image.fromarray(out_im).save(out)
    print('plate grain std', std.round(2), '->', out)


# ---- the headline: white Impact, soft dark halo + drop shadow (as in the source) ----------------------------------

def white_headline(canvas, lines, x, y, size, line_gap):
    font = ImageFont.truetype(HEADLINE_FONT, size)
    txt = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(txt)
    for ln in lines:
        bb = font.getbbox(ln)
        d.text((x, y - bb[1]), ln, font=font, fill=255)
        print(f'{ln!r}: x {x}-{x + font.getlength(ln):.0f}, y {y}-{y + bb[3] - bb[1]}')
        y += bb[3] - bb[1] + line_gap
    halo = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    halo.putalpha(txt.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * .85)))
    canvas.alpha_composite(halo)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(txt.point(lambda v: int(v * .8)))
    canvas.alpha_composite(ImageChops.offset(sh, 6, 9).filter(ImageFilter.GaussianBlur(4)))
    fill = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    fill.putalpha(txt)
    canvas.alpha_composite(fill)


# ---- the green coin's silhouette in the source, and the ellipse it traces -----------------------------------------

def old_coin():
    """Mask (source px) of the green coin by colour, closed over the "?" and rim texture, plus the rotated ellipse
    (centre, axes, angle) fitted to its outline above the dirt. The silhouette is the face ellipse plus a ~22 px side to
    the right, which is how the new coin is built too."""
    s = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB')).astype(np.int16)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    green = ((g > r + 14) & (g > b + 8)).astype(np.uint8)
    green[:, :500] = 0
    green[:, 990:] = 0
    green[:300] = 0
    green = cv2.morphologyEx(green, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.morphologyEx(green, cv2.MORPH_CLOSE, np.ones((21, 21), np.uint8)))
    big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    cs, _ = cv2.findContours((lab == big).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)[:, 0, :]
    mask = np.zeros(green.shape, np.uint8)
    cv2.drawContours(mask, [c.astype(np.int32)], -1, 1, -1)
    ell = cv2.fitEllipse(c[c[:, 1] < 640].astype(np.float32))
    return mask, ell


# ---- the logo coin ------------------------------------------------------------------------------------------------

def logo_layer(N, glyph_r):
    """The logo on its own black, cleaned of JPEG noise and enlarged, as an RGBA the size of the coin face disc (N px
    across, unit radius = N/2), scaled so the logo's farthest point sits at `glyph_r` of the radius."""
    lg = Image.open(A('logo.jpg')).convert('RGB')
    a = np.array(lg).astype(np.float32)
    val = a.max(-1)
    al = np.clip((val - 14) / 34, 0, 1)                                  # black + jpeg ringing -> 0, the glyph -> 1
    ys, xs = np.where(val > 40)
    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    far = np.sqrt((ys - cy) ** 2 + (xs - cx) ** 2).max()
    print(f'logo glyph centre ({cx:.0f},{cy:.0f}), farthest point {far:.0f}px of {lg.width}')
    k = (N / 2 * glyph_r) / far
    size = round(lg.width * k)
    up = cv2.resize(a, (size, size), interpolation=cv2.INTER_LANCZOS4)
    alu = cv2.resize(al, (size, size), interpolation=cv2.INTER_CUBIC)
    # colour that stops at the glyph edge: push the glyph's colour outward so the dark fringe never tints it
    rgb = np.clip(up, 0, 255)
    soft = cv2.GaussianBlur(rgb * alu[..., None], (0, 0), 1.2) / np.maximum(cv2.GaussianBlur(alu, (0, 0), 1.2), 1e-3)[..., None]
    rgb = np.where(alu[..., None] > .5, rgb, soft)
    alu = np.clip((alu - .5) * 1.6 + .5, 0, 1)                           # a crisper edge than the upscale gives
    sharp = cv2.GaussianBlur(rgb, (0, 0), 1.6)
    rgb = np.clip(rgb + (rgb - sharp) * .55, 0, 255)
    layer = np.zeros((N, N, 4), np.float32)
    ox, oy = round(N / 2 - cx * k), round(N / 2 - cy * k)
    x0, y0 = max(ox, 0), max(oy, 0)
    x1, y1 = min(ox + size, N), min(oy + size, N)
    layer[y0:y1, x0:x1, :3] = rgb[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    layer[y0:y1, x0:x1, 3] = alu[y0 - oy:y1 - oy, x0 - ox:x1 - ox] * 255
    return Image.fromarray(layer.astype(np.uint8), 'RGBA')


def coin_disc(N=1500):
    """The coin seen face-on, N px across: a milled silver rim, a dark groove, a black face carrying the logo."""
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    u, v = (xx - N / 2 + .5) / (N / 2), (yy - N / 2 + .5) / (N / 2)
    rr, ph = np.hypot(u, v), np.arctan2(v, u)
    light = np.cos(ph - (-2.35))                                          # light from the upper left
    # rim: silver, lit on the upper left, with a milled edge
    t = .5 + .5 * light
    rim = np.stack([np.interp(t, [0, 1], [62, 208]), np.interp(t, [0, 1], [64, 207]), np.interp(t, [0, 1], [70, 206])], -1)
    mill = (np.sin(ph * 132) > .35) & (rr > .925) & (rr < .985)
    rim = np.where(mill[..., None], rim * .80, rim)
    bevel = np.clip((rr - .90) / .02, 0, 1) * np.clip((1.0 - rr) / .018, 0, 1)
    rim = rim * (.72 + .28 * bevel[..., None])
    rim = np.where((rr > .975)[..., None], rim * (1 - (rr[..., None] - .975) / .025 * .55), rim)
    # face: black with the faintest sheen, so it reads as a glossy surface, not a hole
    sheen = np.clip(light * (1 - rr) * .55, 0, 1) * 15
    face = np.stack([4 + sheen, 4 + sheen, 7 + sheen * 1.15], -1)
    groove = ((rr > .878) & (rr <= .90))[..., None]
    rgb = np.where((rr < .878)[..., None], face, np.where(groove, np.array([22, 22, 26], np.float32), rim))
    inner_lip = ((rr > .858) & (rr <= .878))[..., None]                   # a thin lit lip just inside the groove
    rgb = np.where(inner_lip, rgb + 26 * (.4 + .6 * light[..., None]).clip(0, 1), rgb)
    alpha = np.clip((1.0 - rr) * (N / 2), 0, 1)
    im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA')
    glyph = logo_layer(N, .74)
    im.alpha_composite(glyph)
    return im


def logo_coin(ell):
    """The logo coin on the 1920 canvas: the face warped onto the old coin's ellipse (pure stretch along its axes, so the
    logo stays upright), its milled side swept to the right, all clipped to the old coin's silhouette."""
    (ex, ey), (MA, ma), ang = ell
    th = np.deg2rad(ang)
    u = np.array([np.cos(th), np.sin(th)])                                # the short axis, the side the coin shows
    d_len = 25.0                                                          # source px of visible side
    cF = np.array([ex, ey]) - u * d_len / 2
    a_s, b_s = (MA - d_len) / 2 * K + 2, ma / 2 * K + 1                  # face semi-axes on the canvas (a hair over, then clipped)
    cF *= K
    R = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    Amat = R @ np.diag([a_s, b_s]) @ R.T                                  # symmetric stretch: the glyph does not roll with the ellipse
    N = 1500
    disc = np.array(coin_disc(N)).astype(np.float32)
    # texture px -> canvas px
    S = Amat / (N / 2)
    M = np.hstack([S, (cF - S @ np.array([N / 2, N / 2]))[:, None]])
    face = cv2.warpAffine(disc, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    face_a = face[..., 3] / 255.0
    # the side: the face ellipse swept along u, behind the face
    SS_ = 3
    sweep = np.zeros((H * SS_, W * SS_), np.uint8)
    ang_deg = np.rad2deg(th)
    steps = 50
    for i in range(steps + 1):
        t = i / steps
        c = cF + u * d_len * K * t
        cv2.ellipse(sweep, (round(c[0] * SS_), round(c[1] * SS_)), (round(a_s * SS_), round(b_s * SS_)), ang_deg, 0, 360, 255, -1, cv2.LINE_AA)
    sweep = cv2.resize(sweep, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    # side shading by position around the rim, plus milling lines and a darker far edge
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    pv = np.stack([xx - cF[0], yy - cF[1]], -1)
    q = pv @ np.linalg.inv(Amat).T
    phi = np.arctan2(q[..., 1], q[..., 0])
    lit = .5 + .5 * np.cos(phi - np.deg2rad(-40))
    base = np.stack([np.interp(lit, [0, 1], [70, 214]), np.interp(lit, [0, 1], [74, 216]), np.interp(lit, [0, 1], [82, 222])], -1)
    ridges = .80 + .20 * np.sin(phi * 190)
    side = base * ridges[..., None]
    # the far part of the side is deeper: how far past the face's own rim a pixel is, along u
    ex_ = np.clip(1 - (np.hypot(q[..., 0], q[..., 1])), -1, 0)           # <0 outside the face disc
    side *= (1 + np.clip(ex_ * 1.6, -.45, 0))[..., None]
    rgba = np.zeros((H, W, 4), np.float32)
    rgba[..., :3] = side
    rgba[..., 3] = sweep * 255
    fa = face_a[..., None]
    rgba[..., :3] = rgba[..., :3] * (1 - fa) + face[..., :3] * fa
    rgba[..., 3] = np.maximum(rgba[..., 3], face[..., 3])
    # one lighting pass over the whole coin so it sits in the scene: warm from the right (the sky's light), cooler in the dirt
    grad = np.clip(((xx - cF[0]) * -.5 + (yy - cF[1]) * -.85) / (b_s * 1.4), -1, 1)
    rgba[..., :3] *= (1 + grad * .10)[..., None]
    rgba[..., :3] *= np.array([1.07, 1.0, .88], np.float32)
    return rgba


def build():
    plate_path = A('clean-plate.png')
    if not os.path.exists(plate_path):
        make_plate(plate_path)
    plate = Image.open(plate_path).convert('RGB').resize((W, H), Image.LANCZOS)
    canvas = plate.convert('RGBA')

    mask, ell = old_coin()
    print('old coin ellipse', ell)
    old = cv2.resize(mask, (W, H), interpolation=cv2.INTER_NEAREST).astype(np.uint8)
    old = cv2.GaussianBlur(old.astype(np.float32), (0, 0), 1.6)
    clip = np.clip((cv2.dilate((old > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))).astype(np.float32)), 0, 1)
    clip = cv2.GaussianBlur(clip, (0, 0), 1.0)
    # background under the old coin: fill it from its surroundings first, so a hair of mismatch never shows green
    a8 = np.array(plate)
    hole = cv2.dilate((old > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17)))
    small = cv2.resize(a8, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    ms = cv2.resize(hole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST) * 255
    fill = cv2.resize(cv2.inpaint(small[:, :, ::-1].copy(), ms, 9, cv2.INPAINT_TELEA)[:, :, ::-1], (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
    canvas = Image.fromarray(np.clip(a8 * (1 - m) + fill * m, 0, 255).astype(np.uint8)).convert('RGBA')

    coin = logo_coin(ell)
    low = np.array([np.where(old[:, x] > .5)[0].max() if (old[:, x] > .5).any() else -1 for x in range(W)], np.float32)
    low = cv2.GaussianBlur(low[None, :], (0, 0), 6)[0]
    yy = np.arange(H, dtype=np.float32)[:, None]
    shade = 1 - .55 * np.clip(1 - (low[None, :] - yy) / 150, 0, 1) * (low[None, :] > 0)
    coin[..., :3] *= shade[..., None]
    coin[..., 3] *= clip
    cimg = Image.fromarray(np.clip(coin, 0, 255).astype(np.uint8), 'RGBA')
    # the coin sits on the dirt: a soft shadow where its side meets the ground, under the coin only
    canvas.alpha_composite(cimg)

    white_headline(canvas, LINES, X, Y, SIZE, GAP)
    export(canvas, os.path.join(HERE, 'thumbnail.jpg'))


if __name__ == '__main__':
    build()
