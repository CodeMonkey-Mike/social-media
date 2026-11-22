"""Thumbnail "My plays are ripping" (2026-11-18): an edit of the "Best Crypto Stonk Plays" stream thumbnail (3IV_w9qecZE).

source.jpg              = that stream's thumbnail, YouTube's 1280x720 (dust storm, candles, tornado, Mike).
assets/clean-plate.png  = source with the old headline taken out (made once by make_plate, then reused).
ONE change only: the headline text. A green candle at x ~660-684 stands in the old headline between the "O" and
the "S" (the letters sit in front of it); the "S" hid its right edge, so that half is rebuilt as the mirror of its left.
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
K = W / 1280.0

TEXT = 'MY PLAYS ARE RIPPING'
X0, X1, CAP_TOP = 57, 1903, 24          # canvas px: same left/right span and cap top as the source headline
CANDLE = (650, 692)                     # source px columns kept for the upper candle body (+ glow) in the text band
CANDLE_MID = 672                        # its centre line
BAND = (8, 132)                         # source px rows of the old headline band


def make_plate(out):
    src = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB'))
    a = src.astype(np.float32)
    h, w = src.shape[:2]
    band = np.zeros((h, w), np.uint8)
    band[BAND[0]:BAND[1], 25:1280] = 1
    white = ((src.min(-1) > 175) & (band > 0)).astype(np.uint8)
    letters = cv2.morphologyEx(white, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    mask = cv2.dilate(letters, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))   # letters + dark halo + shadow
    mask[BAND[1] + 22:] = 0

    # background: smooth low-res fill + the sky's own grain
    small = cv2.resize(src, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    ms = (cv2.resize(mask, (w // 4, h // 4), interpolation=cv2.INTER_AREA) > 0).astype(np.uint8) * 255
    fill = cv2.inpaint(small[:, :, ::-1].copy(), ms, 7, cv2.INPAINT_TELEA)[:, :, ::-1]
    fill = cv2.GaussianBlur(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32), (0, 0), 4)
    ring = cv2.dilate(mask, np.ones((41, 41), np.uint8)) - mask
    hp = a - cv2.GaussianBlur(a, (0, 0), 2.0)
    std = hp[ring > 0].std(0)
    rng = np.random.default_rng(7)
    for c in range(3):
        n = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 0.9)
        fill[..., c] += n / n.std() * std[c]

    # the upper candle: its left half is clean between the "O" and the "S", the "S" sat on its right half, so the right
    # half is the left half mirrored about the body's centre line (the body is symmetric); kept out of the fill
    cx0, cx1, mid, ytop = CANDLE[0], CANDLE[1], CANDLE_MID, BAND[1] + 12
    a = a.copy()
    for x in range(mid, cx1):
        a[:ytop, x] = a[:ytop, 2 * mid - x]
    keep = np.zeros((h, w), np.float32)
    keep[:ytop - 4, cx0 + 4:cx1 - 4] = 1
    keep = cv2.GaussianBlur(keep, (0, 0), 3)                              # soft edges: no seam where the candle meets the fill
    m = (cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 3) * (1 - keep))[..., None]
    out_im = np.clip(a * (1 - m) + fill * m, 0, 255).astype(np.uint8)
    Image.fromarray(out_im).save(out)
    print('plate grain std', std.round(2), '->', out)


def white_headline(canvas, text, x0, x1, cap_top):
    """White Impact, fitted to the span x0..x1, with a soft dark halo + drop shadow (as in the source)."""
    size = 300
    while True:
        font = ImageFont.truetype(HEADLINE_FONT, size)
        bb = font.getbbox(text)
        if bb[2] - bb[0] <= x1 - x0:
            break
        size -= 1
    txt = Image.new('L', (W, H), 0)
    ImageDraw.Draw(txt).text((x0 - bb[0], cap_top - bb[1]), text, font=font, fill=255)
    print(f'{text!r}: size {size}, x {x0}-{x0 + bb[2] - bb[0]}, y {cap_top}-{cap_top + bb[3] - bb[1]}')
    halo = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    halo.putalpha(txt.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * .75)))
    canvas.alpha_composite(halo)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(txt.point(lambda v: int(v * .8)))
    canvas.alpha_composite(ImageChops.offset(sh, 7, 10).filter(ImageFilter.GaussianBlur(4)))
    fill = Image.new('RGBA', (W, H), (250, 250, 250, 255))
    fill.putalpha(txt)
    canvas.alpha_composite(fill)


def build():
    plate_path = A('clean-plate.png')
    if not os.path.exists(plate_path):
        make_plate(plate_path)
    canvas = Image.open(plate_path).convert('RGB').resize((W, H), Image.LANCZOS).convert('RGBA')
    white_headline(canvas, TEXT, X0, X1, CAP_TOP)
    export(canvas, os.path.join(HERE, 'thumbnail.jpg'))


if __name__ == '__main__':
    build()
