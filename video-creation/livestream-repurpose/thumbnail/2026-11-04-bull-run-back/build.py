"""Thumbnail "Bull Run Back" (2026-11-04): an edit of a flattened earlier thumbnail, not a kit layout.

source.jpg = the 2026-09-15 "Get Ready For Pumps" stream thumbnail (lBFMVBWR87o), YouTube's 1280x720.
assets/clean-plate.png = source with the headline + Robinhood feather removed (LaMa inpaint at native res, local).
This script puts on a new white headline in the original's look and a 3D gold Bitcoin symbol rising out of
the bowl, its foot behind the front rim. Mike's face is the source's own, upscaled 1.5x.
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
    """The upright B-symbol as an L mask, proportions measured off Mike's reference (a paid stock
    photo, used for the SHAPE only, redrawn here). Design units: 675 wide, 1005 tall."""
    U = 4 * scale
    pad = 12
    W_, H_ = int((675 + 2 * pad) * U), int((1005 + 2 * pad) * U)
    m = Image.new('L', (W_, H_), 0)
    d = ImageDraw.Draw(m)
    box = lambda x0, y0, x1, y1: [(x0 + pad) * U, (y0 + pad) * U, (x1 + pad) * U, (y1 + pad) * U]
    for x0, x1 in ((150, 272), (305, 450)):                          # the four nubs
        d.rectangle(box(x0, 0, x1, 200), fill=255)
        d.rectangle(box(x0, 820, x1, 1005), fill=255)
    d.rounded_rectangle(box(100, 160, 625, 505), radius=165 * U, fill=255)    # upper lobe
    d.rectangle(box(100, 160, 330, 505), fill=255)
    d.rounded_rectangle(box(100, 465, 675, 860), radius=190 * U, fill=255)    # lower lobe
    d.rectangle(box(100, 465, 350, 860), fill=255)
    d.rectangle(box(0, 160, 240, 262), fill=255)                     # left serifs
    d.rectangle(box(0, 758, 240, 860), fill=255)
    d.rounded_rectangle(box(248, 285, 415, 420), radius=62 * U, fill=0)       # counters
    d.rectangle(box(248, 285, 340, 420), fill=0)
    d.rounded_rectangle(box(248, 565, 450, 738), radius=78 * U, fill=0)
    d.rectangle(box(248, 565, 350, 738), fill=0)
    return m.resize((W_ // 4, H_ // 4), Image.LANCZOS)


def gold_btc(height):
    """Render the symbol as extruded brushed gold: lit face, bevel, a thick side to the lower right."""
    SS_ = 3
    scale = height * SS_ / 1029
    face = np.array(btc_shape(scale)).astype(np.float32) / 255
    dx_max, dy_max = int(46 * scale), int(16 * scale)
    h, w = face.shape
    pad = int(30 * scale)
    Hh, Ww = h + dy_max + 2 * pad, w + dx_max + 2 * pad
    fa = np.zeros((Hh, Ww), np.float32)
    fa[pad:pad + h, pad:pad + w] = face
    yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
    # the side: the mask swept away from the face, bright near the face, deep bronze at the far edge
    rgb = np.zeros((Hh, Ww, 3), np.float32)
    al = np.zeros((Hh, Ww), np.float32)
    steps = max(dx_max, 1)
    for i in range(steps, 0, -1):
        t = i / steps
        M = np.float32([[1, 0, i], [0, 1, i * dy_max / steps]])
        layer = cv2.warpAffine(fa, M, (Ww, Hh))
        col = np.array((238, 186, 96), np.float32) * (1 - t) + np.array((112, 66, 20), np.float32) * t
        rgb = rgb * (1 - layer[..., None]) + col * layer[..., None]
        al = np.maximum(al, layer)
    band = .80 + .28 * np.sin((yy / Hh) * 15 + 1.0)                  # reflections running down the side
    rgb = rgb * band[..., None]
    # the face: diagonal gold ramp + soft reflection bands + horizontal brushing
    t = np.clip((xx * .55 + yy * .85) / (Ww * .55 + Hh * .85), 0, 1)
    stops = np.array(((255, 240, 190), (248, 208, 124), (214, 152, 64), (250, 214, 136), (168, 106, 38)), np.float32)
    pos = np.array((0, .3, .58, .76, 1), np.float32)
    col = np.stack([np.interp(t, pos, stops[:, k]) for k in range(3)], -1)
    rng = np.random.default_rng(11)
    brush = cv2.GaussianBlur(rng.normal(0, 1, (Hh, Ww)).astype(np.float32), (0, 0), sigmaX=70 * SS_, sigmaY=2.2 * SS_)
    col = col * (1 + (brush / brush.std())[..., None] * .016)
    # the bevel: a height field off the distance to the edge, lit from the upper left
    dist = cv2.distanceTransform((fa > .5).astype(np.uint8), cv2.DIST_L2, 5)
    bevel = 15 * scale
    hf = cv2.GaussianBlur(np.minimum(dist, bevel), (0, 0), 1.2 * SS_)
    gx, gy = cv2.Sobel(hf, cv2.CV_32F, 1, 0, ksize=3) / 8, cv2.Sobel(hf, cv2.CV_32F, 0, 1, ksize=3) / 8
    lit = gx * .62 + gy * .78                                        # + faces upper left, - lower right
    col = np.where(lit[..., None] > 0, col + (np.array((255, 248, 220), np.float32) - col) * np.clip(lit * 1.5, 0, .9)[..., None],
                   col * (1 + np.clip(lit * .75, -.26, 0))[..., None])
    rgb = rgb * (1 - fa[..., None]) + col * fa[..., None]
    al = np.maximum(al, fa)
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert('RGBA')
    im.putalpha(Image.fromarray((al * 255).astype(np.uint8)))
    return im.resize((Ww // SS_, Hh // SS_), Image.LANCZOS)


def rim_mask():
    """255 above the bowl's front rim (what the coin may show on), measured on the plate."""
    xs = np.array([270, 450, 540, 640, 830, 880], np.float32)
    ys = np.array([618, 624, 628, 628, 618, 606], np.float32)
    top = np.interp(np.arange(W, dtype=np.float32), xs, ys)
    yy = np.arange(H, dtype=np.float32)[:, None]
    return Image.fromarray((np.clip(top - yy + .5, 0, 1).T.T * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))


canvas = Image.open(os.path.join(HERE, 'assets', 'clean-plate.png')).convert('RGB').resize((W, H), Image.LANCZOS).convert('RGBA')

sym = gold_btc(372)
sx, sy = 550, 318      # upper left of the symbol; its foot drops behind the bowl's front rim
mask = rim_mask()
alpha = sym.split()[3]
back = Image.new('RGBA', (W, H), (0, 0, 0, 0))
# a dark contour + a soft shadow so the gold holds against the tan dust
dark = Image.new('RGBA', sym.size, (24, 12, 2, 0))
dark.putalpha(alpha.filter(ImageFilter.MaxFilter(5)))
back.alpha_composite(dark, (sx, sy))
glow = Image.new('RGBA', sym.size, (16, 8, 0, 0))
glow.putalpha(alpha.point(lambda v: int(v * .85)))
soft = Image.new('RGBA', (W, H), (0, 0, 0, 0))
soft.alpha_composite(glow, (sx + 10, sy + 12))
soft = soft.filter(ImageFilter.GaussianBlur(15))
soft.alpha_composite(back)
soft.alpha_composite(sym, (sx, sy))
soft.putalpha(ImageChops.multiply(soft.split()[3], mask))
canvas.alpha_composite(soft)

white_headline(canvas, ['Bull Run', 'Back'], x=52, y=46, size=232, line_gap=26)
export(canvas, os.path.join(HERE, 'thumbnail.jpg'))
