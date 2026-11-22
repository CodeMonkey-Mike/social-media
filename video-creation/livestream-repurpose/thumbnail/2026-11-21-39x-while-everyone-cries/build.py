"""Thumbnail "39x while everyone cries" (2026-11-21): an edit of the "Biggest Bull Run Ever" stream thumbnail (pm1OlPrQuHQ),
the same way 2026-11-09-my-100x-plays edited "The Bull Run Is Here".

source.jpg              = that stream's thumbnail, YouTube's 1280x720 (red dust, the bull, blue "?" coin, green "?" coin, Mike).
assets/new-logo.png     = the logo Mike linked (an X profile picture, 400x400: white "E" bars on violet), on the green coin.
assets/kaspa2.png       = Mike's 3D Kaspa coin (transparent PNG), in place of the blue "?" coin.
assets/clean-plate.png  = source with the old headline taken out (made once by make_plate, then reused).
Three changes: the headline, the green coin's face (logo coin built to the old coin's ellipse, clipped to its silhouette so
the dirt in front stays), and the blue coin (filled out, the Kaspa coin set in its place, cut along the old coin's dirt line).
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

# the source's own layout: a long line 1 across the top, a short line 2 right-aligned under it (right of the bull's horns)
LINE1, LINE2 = '39X WHILE EVERYONE', 'CRIES'
X0, X1 = 34 * K, 849 * K                         # the old headline's left / right edge
Y1, Y2 = 31 * K, 150 * K                         # the old lines' cap tops
L2_SCALE = 1.0                                   # line 2 size relative to line 1

FACE_TOP = (98, 58, 255)                         # logo coin face, lit upper left -> shadow (the logo's violet is 52,0,236)
FACE_BOT = (34, 0, 170)


# ---- the plate: the source with its headline removed --------------------------------------------------------------

def make_plate(out):
    """White headline (both lines) + its dark halo and shadow, filled from the dust around it (smooth low-res fill + grain)."""
    src = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB'))
    a = src.astype(np.float32)
    band = np.zeros(src.shape[:2], np.uint8)
    band[20:275, 10:870] = 1
    white = ((src.min(-1) > 190) & (band > 0)).astype(np.uint8)
    mask = cv2.dilate(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (37, 37)))
    mask[:, 872:] = 0
    mask[132:, 150:500] = 0
    mask[255:300, 560:872] = np.maximum(mask[255:300, 560:872], 1)   # the old line 2's shadow under "EVER"                       # the bull's horn tips sit just under line 1: keep them sharp
    h, w = mask.shape
    small = cv2.resize(src, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    ms = (cv2.resize(mask, (w // 4, h // 4), interpolation=cv2.INTER_AREA) > 0).astype(np.uint8) * 255
    fill = cv2.inpaint(small[:, :, ::-1].copy(), ms, 7, cv2.INPAINT_TELEA)[:, :, ::-1]
    fill = cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    fill = cv2.GaussianBlur(fill, (0, 0), 4)
    ring = cv2.dilate(mask, np.ones((61, 61), np.uint8)) - mask
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

def white_headline(canvas):
    """Line 1 sized to span the old headline's width; line 2 right-aligned under it, at the old line 2's top."""
    f1 = ImageFont.truetype(HEADLINE_FONT, 100)
    size = int(100 * (X1 - X0) / f1.getlength(LINE1))
    f1 = ImageFont.truetype(HEADLINE_FONT, size)
    f2 = ImageFont.truetype(HEADLINE_FONT, int(size * L2_SCALE))
    txt = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(txt)
    for ln, f, x, y in ((LINE1, f1, X0, Y1), (LINE2, f2, X1 - f2.getlength(LINE2), Y2)):
        bb = f.getbbox(ln)
        d.text((x - bb[0], y - bb[1]), ln, font=f, fill=255)
        print(f'{ln!r}: size {f.size}, x {x:.0f}-{x + f.getlength(ln):.0f}, y {y:.0f}-{y + bb[3] - bb[1]:.0f}')
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
    ell = cv2.fitEllipse(c[c[:, 1] < 610].astype(np.float32))     # outline above the dirt only
    return mask, ell


# ---- the logo coin ------------------------------------------------------------------------------------------------

def logo_layer(N, glyph_r):
    """The logo's white glyph as an RGBA the size of the face disc (N px), its farthest point at `glyph_r` of the radius."""
    lg = np.array(Image.open(A('new-logo.png')).convert('RGB')).astype(np.float32)
    lo = lg.min(-1)                                                       # violet ground ~0, white glyph ~255
    al = np.clip((lo - 40) / 170, 0, 1)
    ys, xs = np.where(al > .5)
    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    far = np.sqrt((ys - cy) ** 2 + (xs - cx) ** 2).max()
    print(f'logo glyph centre ({cx:.0f},{cy:.0f}), farthest point {far:.0f}px of {lg.shape[1]}')
    k = (N / 2 * glyph_r) / far
    size = round(lg.shape[1] * k)
    alu = cv2.resize(al, (size, size), interpolation=cv2.INTER_CUBIC)
    alu = np.clip((alu - .5) * 2.0 + .5, 0, 1)                            # crisp edge after the upscale
    layer = np.zeros((N, N, 4), np.float32)
    layer[..., :3] = 250
    ox, oy = round(N / 2 - cx * k), round(N / 2 - cy * k)
    x0, y0 = max(ox, 0), max(oy, 0)
    x1, y1 = min(ox + size, N), min(oy + size, N)
    layer[y0:y1, x0:x1, 3] = alu[y0 - oy:y1 - oy, x0 - ox:x1 - ox] * 255
    return Image.fromarray(layer.astype(np.uint8), 'RGBA')


def coin_disc(N=1500):
    """The coin face-on: a milled silver rim, a dark groove, a violet face (the logo's own ground) with the white glyph."""
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    u, v = (xx - N / 2 + .5) / (N / 2), (yy - N / 2 + .5) / (N / 2)
    rr, ph = np.hypot(u, v), np.arctan2(v, u)
    light = np.cos(ph - (-2.35))
    t = .5 + .5 * light
    rim = np.stack([np.interp(t, [0, 1], [62, 208]), np.interp(t, [0, 1], [64, 207]), np.interp(t, [0, 1], [70, 206])], -1)
    mill = (np.sin(ph * 132) > .35) & (rr > .925) & (rr < .985)
    rim = np.where(mill[..., None], rim * .80, rim)
    bevel = np.clip((rr - .90) / .02, 0, 1) * np.clip((1.0 - rr) / .018, 0, 1)
    rim = rim * (.72 + .28 * bevel[..., None])
    rim = np.where((rr > .975)[..., None], rim * (1 - (rr[..., None] - .975) / .025 * .55), rim)
    # face: violet, a diagonal gradient (lit upper left) plus a soft sheen
    gt = np.clip(.5 + .5 * (u + v) / 1.4, 0, 1)[..., None]
    face = np.array(FACE_TOP, np.float32) * (1 - gt) + np.array(FACE_BOT, np.float32) * gt
    face = face + (np.clip(light * (1 - rr) * .6, 0, 1) * 30)[..., None]
    groove = ((rr > .878) & (rr <= .90))[..., None]
    rgb = np.where((rr < .878)[..., None], face, np.where(groove, np.array([22, 18, 40], np.float32), rim))
    inner_lip = ((rr > .858) & (rr <= .878))[..., None]
    rgb = np.where(inner_lip, rgb + 26 * (.4 + .6 * light[..., None]).clip(0, 1), rgb)
    alpha = np.clip((1.0 - rr) * (N / 2), 0, 1)
    im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA')
    glyph = logo_layer(N, .62)
    sh = Image.new('RGBA', im.size, (10, 0, 60, 0))                       # a faint drop shadow under the glyph
    sh.putalpha(glyph.getchannel('A').point(lambda v: int(v * .45)))
    im.alpha_composite(ImageChops.offset(sh, 10, 14).filter(ImageFilter.GaussianBlur(8)))
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
    rgba[..., :3] *= np.array([1.03, 1.0, .96], np.float32)   # lighter than 11-09: the logo's white must stay white
    return rgba



# ---- the Kaspa coin, in place of the blue one ----------------------------------------------------------------------

def blue_coin():
    """Mask (source px) of the blue "?" coin (blue + its white glyph), and its dirt line: the lowest coin pixel per column
    where the coin is buried (x <= 182), held flat beyond that, where the coin's own round edge takes over."""
    s = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB')).astype(np.int16)
    b = ((s[..., 2] > s[..., 0] + 40) | (s.min(-1) > 200)).astype(np.uint8)
    b[:380] = 0
    b[:, 260:] = 0
    b = cv2.morphologyEx(b, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(b)
    m = (lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
    low = np.full(1280, np.nan, np.float32)
    for x in range(0, 183):
        col = np.where(m[:, x])[0]
        if len(col):
            low[x] = col.max()
    low[183:] = np.nanmean(low[170:183])
    return m, low


def kaspa_layer(dirt_line):
    """Mike's Kaspa coin on the canvas, sized a touch over the blue coin (so none of it shows), cut along the dirt line,
    shaded toward the ground so it sits in the dirt like the coin it replaces."""
    kc = Image.open(A('kaspa2.png')).convert('RGBA')
    bx = kc.getbbox()
    kc = kc.crop(bx)
    hgt = KASPA_H * K
    wid = hgt * kc.width / kc.height
    kc = kc.resize((round(wid), round(hgt)), Image.LANCZOS)
    cx, cy = KASPA_C[0] * K, KASPA_C[1] * K
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layer.alpha_composite(kc, (round(cx - wid / 2), round(cy - hgt / 2))) if cx - wid / 2 >= 0 else \
        layer.paste(kc.crop((round(wid / 2 - cx), 0, kc.width, kc.height)), (0, round(cy - hgt / 2)))
    rgba = np.array(layer).astype(np.float32)
    line = cv2.resize(dirt_line[None, :], (W, 1), interpolation=cv2.INTER_LINEAR)[0] * K
    line = cv2.GaussianBlur(line[None, :], (0, 0), 4)[0]
    yy = np.arange(H, dtype=np.float32)[:, None]
    below = np.clip((yy - line[None, :] + 2) / 4, 0, 1)                   # soft 4 px edge where the dirt covers it
    rgba[..., 3] *= 1 - below
    shade = 1 - .5 * np.clip(1 - (line[None, :] - yy) / 130, 0, 1)
    rgba[..., :3] *= shade[..., None]
    return rgba


KASPA_H = 345                                    # source px tall (the blue coin is ~305)
KASPA_C = (70, 548)                              # source px centre (the blue coin's ~(72, 548))


def fill_hole(a8, hole, r=9):
    small = cv2.resize(a8, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    ms = cv2.resize(hole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST) * 255
    fill = cv2.resize(cv2.inpaint(small[:, :, ::-1].copy(), ms, r, cv2.INPAINT_TELEA)[:, :, ::-1], (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
    return np.clip(a8 * (1 - m) + fill * m, 0, 255).astype(np.uint8)


def build():
    plate_path = A('clean-plate.png')
    if not os.path.exists(plate_path):
        make_plate(plate_path)
    plate = Image.open(plate_path).convert('RGB').resize((W, H), Image.LANCZOS)
    a8 = np.array(plate)

    # the green coin -> the logo coin
    mask, ell = old_coin()
    print('old coin ellipse', ell)
    old = cv2.resize(mask, (W, H), interpolation=cv2.INTER_NEAREST).astype(np.uint8)
    old = cv2.GaussianBlur(old.astype(np.float32), (0, 0), 1.6)
    clip = cv2.dilate((old > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))).astype(np.float32)
    clip = cv2.GaussianBlur(clip, (0, 0), 1.0)
    a8 = fill_hole(a8, cv2.dilate((old > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))))

    # the blue coin: filled out of the plate first
    bm, dirt = blue_coin()
    bmc = cv2.resize(bm, (W, H), interpolation=cv2.INTER_NEAREST)
    a8 = fill_hole(a8, cv2.dilate(bmc, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))))
    canvas = Image.fromarray(a8).convert('RGBA')

    coin = logo_coin(ell)
    low = np.array([np.where(old[:, x] > .5)[0].max() if (old[:, x] > .5).any() else -1 for x in range(W)], np.float32)
    low = cv2.GaussianBlur(low[None, :], (0, 0), 6)[0]
    yy = np.arange(H, dtype=np.float32)[:, None]
    shade = 1 - .55 * np.clip(1 - (low[None, :] - yy) / 150, 0, 1) * (low[None, :] > 0)
    coin[..., :3] *= shade[..., None]
    coin[..., 3] *= clip
    canvas.alpha_composite(Image.fromarray(np.clip(coin, 0, 255).astype(np.uint8), 'RGBA'))

    canvas.alpha_composite(Image.fromarray(np.clip(kaspa_layer(dirt), 0, 255).astype(np.uint8), 'RGBA'))

    white_headline(canvas)
    export(canvas, os.path.join(HERE, 'thumbnail.jpg'))


if __name__ == '__main__':
    build()
