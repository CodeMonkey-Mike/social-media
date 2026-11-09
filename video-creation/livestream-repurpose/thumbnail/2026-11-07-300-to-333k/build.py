"""Thumbnail "$300 to $333,000" (2026-11-07, Mike's live stream over the discussion topics): an edit of the "Get Ready For Pumps"
thumbnail, the same way 2026-11-04-bull-run-back was.

assets/clean-plate.png = that stream's plate: the old headline + Robinhood feather already gone, Mike's face the source's own.
This script takes out the green "?" coin by its color, sets Mike's Kaspa coin in its place behind the same dirt, puts a Bitcoin coin
in the bowl behind its front rim, and sets a new white headline. The blue "?" coin stays.
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

LINES, SIZE, X, Y, GAP = ['$300 to', '$333,000'], 198, 52, 40, 22
KAS_W, KAS_CX, KAS_CY = 668, 1098, 770            # the Kaspa coin on the 1920 canvas
BTC_D, BTC_CX, BTC_CY = 250, 590, 574             # the Bitcoin coin, its foot behind the bowl's front rim


def white_headline(canvas, lines, x, y, size, line_gap):
    """White Impact, soft dark halo + drop shadow, matching the source thumbnail's text."""
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


def btc_shape(scale):
    """The B-symbol as an L mask, same proportions as bull-run-back's. Design units: 675 wide, 1005 tall."""
    U = 4 * scale
    pad = 12
    W_, H_ = int((675 + 2 * pad) * U), int((1005 + 2 * pad) * U)
    m = Image.new('L', (W_, H_), 0)
    d = ImageDraw.Draw(m)
    box = lambda x0, y0, x1, y1: [(x0 + pad) * U, (y0 + pad) * U, (x1 + pad) * U, (y1 + pad) * U]
    for x0, x1 in ((150, 272), (305, 450)):
        d.rectangle(box(x0, 0, x1, 200), fill=255)
        d.rectangle(box(x0, 820, x1, 1005), fill=255)
    d.rounded_rectangle(box(100, 160, 625, 505), radius=165 * U, fill=255)
    d.rectangle(box(100, 160, 330, 505), fill=255)
    d.rounded_rectangle(box(100, 465, 675, 860), radius=190 * U, fill=255)
    d.rectangle(box(100, 465, 350, 860), fill=255)
    d.rectangle(box(0, 160, 240, 262), fill=255)
    d.rectangle(box(0, 758, 240, 860), fill=255)
    d.rounded_rectangle(box(248, 285, 415, 420), radius=62 * U, fill=0)
    d.rectangle(box(248, 285, 340, 420), fill=0)
    d.rounded_rectangle(box(248, 565, 450, 738), radius=78 * U, fill=0)
    d.rectangle(box(248, 565, 350, 738), fill=0)
    return m.resize((W_ // 4, H_ // 4), Image.LANCZOS)


def btc_coin(D):
    """A round orange coin with the white B, tilted like the logo, with the thick edge to the lower right that the scene's coins have."""
    S = 4
    n = D * S
    edge = int(n * .055)
    im = Image.new('RGBA', (n + edge, n + edge), (0, 0, 0, 0))
    for i in range(edge, 0, -1):            # the coin's side
        t = i / edge
        col = tuple(int(a * (1 - t) + b * t) for a, b in zip((214, 124, 22), (126, 66, 8)))
        ImageDraw.Draw(im).ellipse([i, i, n - 1 + i, n - 1 + i], fill=col + (255,))
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32)
    t = np.clip((xx * .5 + yy * .85) / (n * 1.35), 0, 1)[..., None]
    rgb = np.array((255, 183, 62), np.float32) * (1 - t) + np.array((232, 122, 12), np.float32) * t
    disc = Image.new('L', (n, n), 0)
    ImageDraw.Draw(disc).ellipse([0, 0, n - 1, n - 1], fill=255)
    face = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA')
    d = ImageDraw.Draw(face)
    w = int(n * .022)
    d.ellipse([w, w, n - 1 - w, n - 1 - w], outline=(255, 226, 150), width=w)       # the raised rim
    r2 = int(n * .082)
    d.ellipse([r2, r2, n - 1 - r2, n - 1 - r2], outline=(206, 112, 12), width=int(n * .008))
    im.paste(face, (0, 0), disc)
    glyph = btc_shape(n * .62 / 1029)
    pale = Image.new('RGBA', glyph.size, (255, 255, 255, 255))
    pale.putalpha(glyph)
    pale = pale.rotate(-14, expand=True, resample=Image.BICUBIC)
    sh = Image.new('RGBA', pale.size, (120, 58, 0, 0))
    sh.putalpha(pale.split()[3].point(lambda v: int(v * .55)))
    gx, gy = (n - pale.width) // 2, (n - pale.height) // 2
    im.alpha_composite(sh, (gx + int(n * .008), gy + int(n * .012)))
    im.alpha_composite(pale, (gx, gy))
    return im.resize((im.width // S, im.height // S), Image.LANCZOS)


def rim_mask():
    """255 above the bowl's front rim, the same measurement bull-run-back used on this plate."""
    xs = np.array([270, 450, 540, 640, 830, 880], np.float32)
    ys = np.array([618, 624, 628, 628, 618, 606], np.float32)
    top = np.interp(np.arange(W, dtype=np.float32), xs, ys)
    yy = np.arange(H, dtype=np.float32)[:, None]
    return Image.fromarray((np.clip(top - yy + .5, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))


plate = Image.open(os.path.join(HERE, 'assets', 'clean-plate.png')).convert('RGB').resize((W, H), Image.LANCZOS)
a = np.array(plate)
# the green coin, by color, opened and filled so its worn texture and "?" go with it
r, g, b = a[..., 0].astype(np.int16), a[..., 1].astype(np.int16), a[..., 2].astype(np.int16)
green = ((g > r + 18) & (g > b + 10)).astype(np.uint8)
green[:, :760] = 0
green[:, 1440:] = 0
green = cv2.morphologyEx(green, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(cv2.morphologyEx(green, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)))
big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
contours, _ = cv2.findContours((lab == big).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
coin = np.zeros(green.shape, np.uint8)
cv2.drawContours(coin, contours, -1, 1, -1)
x, y, w_, h_ = cv2.boundingRect(coin)
print('green coin', x, y, x + w_, y + h_)
# whatever lies below the coin's lower edge is dirt in front of it, and goes back over the new coin
lower = np.array([np.where(coin[:, c])[0].max() if coin[:, c].any() else -1 for c in range(W)], np.float32)
# at the coin's sides that edge climbs its curve, which would bite the wider new coin: there the line follows the ground instead
ground = np.interp(np.arange(W, dtype=np.float32), [740, 880, 1000, 1330, 1450], [925, 985, 1005, 985, 925])
lower = cv2.GaussianBlur(np.maximum(lower, ground).astype(np.float32)[None, :], (0, 0), 2)[0]
hole = cv2.dilate(coin, np.ones((15, 15), np.uint8))
small = cv2.resize(a, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
ms = cv2.resize(hole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST)
fill = cv2.resize(cv2.inpaint(small[:, :, ::-1], ms * 255, 9, cv2.INPAINT_TELEA)[:, :, ::-1], (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
rng = np.random.default_rng(7)
grain = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 1.6)
fill += (grain / grain.std() * 7)[..., None]
m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
canvas = Image.fromarray(np.clip(a * (1 - m) + fill * m, 0, 255).astype(np.uint8)).convert('RGBA')

# the Bitcoin coin in the bowl
sym = btc_coin(BTC_D)
sx, sy = BTC_CX - BTC_D // 2, BTC_CY - BTC_D // 2
back = Image.new('RGBA', (W, H), (0, 0, 0, 0))
glow = Image.new('RGBA', sym.size, (16, 8, 0, 0))
glow.putalpha(sym.split()[3].point(lambda v: int(v * .8)))
back.alpha_composite(glow, (sx + 10, sy + 12))
back = back.filter(ImageFilter.GaussianBlur(14))
back.alpha_composite(sym, (sx, sy))
back.putalpha(ImageChops.multiply(back.split()[3], rim_mask()))
canvas.alpha_composite(back)

# the Kaspa coin, with a contact shadow, behind the same dirt the green coin sat behind
kas = Image.open(os.path.join(HERE, 'assets', 'kaspa.png')).convert('RGBA')
kas = kas.crop(kas.getbbox())
kas = kas.resize((KAS_W, round(kas.height * KAS_W / kas.width)), Image.LANCZOS)
kx, ky = KAS_CX - kas.width // 2, KAS_CY - kas.height // 2
print('kaspa coin', kx, ky, kx + kas.width, ky + kas.height)
layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sh = Image.new('RGBA', kas.size, (10, 6, 0, 0))
sh.putalpha(kas.split()[3].point(lambda v: int(v * .75)))
layer.alpha_composite(sh, (kx + 14, ky + 20))
layer = layer.filter(ImageFilter.GaussianBlur(16))
layer.alpha_composite(kas, (kx, ky))
yy = np.arange(H, dtype=np.float32)[:, None]
keep_dirt = np.clip((lower[None, :] - yy + 2) / 3, 0, 1)            # 1 above the old coin's lower edge: the new coin may show there
keep_dirt[:, lower < 0] = 1
layer.putalpha(ImageChops.multiply(layer.split()[3], Image.fromarray((keep_dirt * 255).astype(np.uint8))))
canvas.alpha_composite(layer)

white_headline(canvas, LINES, X, Y, SIZE, GAP)
export(canvas, os.path.join(HERE, 'thumbnail.jpg'))
