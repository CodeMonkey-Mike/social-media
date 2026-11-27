"""Thumbnail "Awesome Buys" (2026-11-22): an edit of the "Get Ready For Pumps" stream thumbnail (lBFMVBWR87o), the scene
2026-11-04-bull-run-back and 2026-11-07-300-to-333k were built on.

source.jpg             = that stream's thumbnail, YouTube's 1280x720 (bulls, bowl + Robinhood feather, two "?" coins, Mike).
assets/<donor>.jpg     = three OTHER stream thumbnails built on the same bull scene (DONORS below). Each has its headline on
                         one line up in the sky, so each shows the bulls the source hides behind "For Pumps".
assets/clean-plate.png = source with the old headline taken out and NOTHING else changed (made once by make_plate, then
                         reused; delete it to remake it). The bulls under the old text are REAL pixels from the donors,
                         lined up on the source; only the sky that every donor also covers comes from the 2026-11-04
                         LaMa plate. (LaMa alone had smeared those bulls into dust clouds: Mike, 2026-11-22.)
ONE change only: the headline text.
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
LAMA_PLATE = os.path.join(os.path.dirname(HERE), '2026-11-04-bull-run-back', 'assets', 'clean-plate.png')

# The headline block: two lines, upper left, like the source ("Get Ready" / "For Pumps": x 52-1004, y 54-452 on the canvas).
# 270 is as big as fits: "Awesome" ends at x 1121 (Mike's hair starts ~1260 at that height), "Buys" ends at x 590, y 526
# (the feather's tip is at ~720, 450, the bowl's rim at ~575). On ONE line the two words only fit at 190.
LINES, SIZE, X, Y, GAP = ['Awesome', 'Buys'], 270, 52, 46, 26
FEATHER_BOX = (290, 430, 345, 500)      # source px rows, cols: where the green feather stands in the bowl
FEATHER_TOP = 299                       # source px: no source pixel above this row (the old headline's shadow ends there)
HALO = 22                               # source px: how far past a white letter the old headline's halo + shadow reach

# Donors, in the order they are used. (file, what it hides besides its own headline). Found by scanning the channel's
# stream thumbnails for this scene; each is the same background at a slightly different scale (0.97 to 0.99).
DONORS = [
    ('more-10xs.jpg', 'feather'),        # 7WvlnsAdyOk "More 10x's": a bigger feather over the middle bull's right cheek
    ('my-next-100x.jpg', 'coins'),       # cao2mHWHlwc "my next 100x": two coins in the bowl, below the bulls' faces
    ('bull-run-is-here.jpg', 'card'),    # YaYyrok6rOs "The Bull Run Is Here": the NFT card over the middle bull's face
]
COINS_BOX = (295, 460, 235, 560)         # donor px rows, cols: where "my next 100x" has its two coins in the bowl


def _ell(r):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def _green(a8, box):
    """The Robinhood feather by colour, inside box (rows, cols), closed over its dark slit."""
    a = a8.astype(np.int16)
    m = ((a[..., 1] > a[..., 0] + 14) & (a[..., 1] > a[..., 2] + 8)).astype(np.uint8)
    keep = np.zeros_like(m)
    keep[box[0]:box[1], box[2]:box[3]] = 1
    return cv2.morphologyEx(m & keep, cv2.MORPH_CLOSE, _ell(7))


def register(donor, src):
    """Similarity transform donor px -> source px, from SIFT matches on the shared background (left of Mike, above the
    dirt). 95 to 260 inliers per donor, spread from x 29 to 837."""
    gd, gs = cv2.cvtColor(donor, cv2.COLOR_RGB2GRAY), cv2.cvtColor(src, cv2.COLOR_RGB2GRAY)
    md, ms = np.zeros(gd.shape, np.uint8), np.zeros(gs.shape, np.uint8)
    md[0:420, 0:870] = 255
    ms[0:400, 0:840] = 255
    sift = cv2.SIFT_create(6000, contrastThreshold=0.01)
    kd, dd = sift.detectAndCompute(gd, md)
    ks, ds = sift.detectAndCompute(gs, ms)
    good = [a for a, b in cv2.BFMatcher().knnMatch(dd, ds, k=2) if a.distance < 0.75 * b.distance]
    p0 = np.float32([kd[g.queryIdx].pt for g in good])
    p1 = np.float32([ks[g.trainIdx].pt for g in good])
    M, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=2.0)
    print(f'  scale {np.hypot(M[0, 0], M[1, 0]):.4f}, shift ({M[0, 2]:.1f}, {M[1, 2]:.1f}), {int(inl.sum())} inliers')
    assert inl.sum() >= 60, 'this donor no longer lines up with the source'
    return M


def donor_bad(d8, hides):
    """Donor px the donor cannot give (uint8 0/1): its own headline + halo, and the object it has in the bowl."""
    white = (d8.min(-1) > 205).astype(np.uint8)
    white[215:] = 0
    white[:, 900:] = 0
    bad = cv2.dilate(white, _ell(HALO + 2))
    if hides == 'feather':
        f = _green(d8, (225, 450, 320, 530))
        ys, xs = np.where(f > 0)
        print(f'  its feather: x {xs.min()}-{xs.max()}, y {ys.min()}-{ys.max()} (donor px)')
        bad |= cv2.dilate(f, _ell(6))
    elif hides == 'coins':
        # the teal Kaspa coin + the orange Bitcoin coin: everything from each coin's top edge down, column by column.
        # Kaspa = bright and greener than red (face teal, rim silver-green; the dust is always redder than green, the
        # bulls' teal flanks are dark). Bitcoin = a strict orange (the golden dust is orange too, but paler).
        a = d8.astype(np.int16)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        coin = (((g > r + 8) & (g > 130)) | ((r > 215) & (r > g + 55) & (r > b + 120))).astype(np.uint8)
        coin[:COINS_BOX[0]] = 0
        coin[COINS_BOX[1]:] = 0
        coin[:, :COINS_BOX[2]] = 0
        coin[:, COINS_BOX[3]:] = 0
        coin = cv2.morphologyEx(coin, cv2.MORPH_OPEN, _ell(2))
        cols = np.where(coin.any(0))[0]
        top = {int(x): int(np.argmax(coin[:, x])) for x in cols}
        print(f'  its coins: x {cols.min()}-{cols.max()}, top edge every 20 px:', [top.get(x, '-') for x in range(int(cols.min()), int(cols.max()) + 1, 20)])
        assert min(top.values()) > COINS_BOX[0] + 8, 'something that is not a coin matched the coin colours'
        for x, y in top.items():
            coin[y:, x] = 1
        bad |= cv2.dilate(coin, _ell(6))
    elif hides == 'card':
        a = d8.astype(np.int16)
        card = ((a[..., 2] > a[..., 1] + 12) & (a[..., 2] > 120)).astype(np.uint8)
        card[:240] = 0
        card[450:] = 0
        card[:, :260] = 0
        card[:, 530:] = 0
        ys, xs = np.where(card > 0)
        print(f'  its card: x {xs.min()}-{xs.max()}, y {ys.min()}-{ys.max()} (donor px)')
        bad[ys.min() - 5:ys.max() + 6, xs.min() - 5:xs.max() + 6] = 1
    return bad


def make_plate(out):
    """The source with its old headline taken out. Under the old text each pixel comes from the first donor that shows the
    background there (warped onto the source, its tone pulled onto the source's), else from the LaMa plate. The source's
    own feather stays: green pixels in the bowl, a 2 px rim for its soft edge."""
    s8 = np.array(Image.open(os.path.join(HERE, 'source.jpg')).convert('RGB'))
    src = s8.astype(np.float32)
    hh, ww = s8.shape[:2]

    # the old headline: white letters + the halo and shadow around them (measured: the darkening ends 21 px out)
    white = (s8.min(-1) > 205).astype(np.uint8)
    white[306:] = 0
    white[:, 676:] = 0
    text = cv2.dilate(white, _ell(HALO))
    feather = cv2.dilate(_green(s8, FEATHER_BOX), _ell(2))
    feather[:FEATHER_TOP] = 0
    clean = (text == 0) & (cv2.dilate(feather, _ell(6)) == 0)
    clean[430:] = False                     # below: dirt, coins and bowl, not the same in every thumbnail
    clean[:, 850:] = False                  # right: Mike

    fill = np.array(Image.open(LAMA_PLATE).convert('RGB')).astype(np.float32)
    covered = np.zeros((hh, ww), np.uint8)
    for name, hides in reversed(DONORS):
        print(name)
        d8 = np.array(Image.open(A(name)).convert('RGB'))
        M = register(d8, s8)
        warp = lambda a, flags: cv2.warpAffine(a, M, (ww, hh), flags=flags, borderMode=cv2.BORDER_REPLICATE)
        img = warp(d8, cv2.INTER_LANCZOS4).astype(np.float32)
        bad = (warp(donor_bad(d8, hides) * 255, cv2.INTER_LINEAR) > 0).astype(np.uint8)
        # the donor's tone -> the source's: the smooth difference where both show the same clean background
        both = (clean & (bad == 0) & (np.abs(src - img).max(-1) < 40)).astype(np.float32)
        den = np.maximum(cv2.GaussianBlur(both, (0, 0), 30), 1e-3)
        off = np.dstack([cv2.GaussianBlur((src[..., c] - img[..., c]) * both, (0, 0), 30) / den for c in range(3)])
        print('  tone offset under the old text: mean', off[text > 0].mean(0).round(1), 'max', np.abs(off[text > 0]).max().round(1))
        ok = cv2.erode(1 - bad, _ell(4))
        v = cv2.GaussianBlur(ok.astype(np.float32), (0, 0), 1.5)[..., None]
        fill = (img + off) * v + fill * (1 - v)
        covered |= ok

    t = cv2.GaussianBlur(text.astype(np.float32), (0, 0), 1.5)[..., None]
    plate = src * (1 - t) + fill * t
    f = cv2.GaussianBlur(feather.astype(np.float32), (0, 0), 1.0)[..., None]
    plate = plate * (1 - f) + src * f
    n, real = int(text.sum()), int((text & covered).sum())
    band = text.copy()
    band[:185] = 0                          # the bulls' rows (their horn tips start ~195)
    nb, realb = int(band.sum()), int((band & covered).sum())
    print(f'old headline area {n} px: {real / n:.0%} real pixels from the donors; in the bulls\' rows (y >= 185): {realb / nb:.1%}')
    Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8)).save(out)
    print('plate ->', out)


def white_headline(canvas, lines, x, y, size, line_gap):
    """White Impact, soft dark halo + drop shadow, matching the source thumbnail's text (as on 2026-11-04)."""
    font = ImageFont.truetype(HEADLINE_FONT, size)
    txt = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(txt)
    for ln in lines:
        bb = font.getbbox(ln)
        d.text((x - bb[0], y - bb[1]), ln, font=font, fill=255)
        print(f'{ln!r}: size {size}, x {x}-{x + bb[2] - bb[0]}, y {y}-{y + bb[3] - bb[1]}')
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


def build(lines=LINES, size=SIZE, out=None):
    plate_path = A('clean-plate.png')
    if not os.path.exists(plate_path):
        os.makedirs(A(), exist_ok=True)
        make_plate(plate_path)
    canvas = Image.open(plate_path).convert('RGB').resize((W, H), Image.LANCZOS).convert('RGBA')
    white_headline(canvas, lines, X, Y, size, GAP)
    export(canvas, out or os.path.join(HERE, 'thumbnail.jpg'))


if __name__ == '__main__':
    build()
