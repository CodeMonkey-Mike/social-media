#!/usr/bin/env python
"""Faithful Crypto YouTube banner from the REAL photos in ../source-photos/ (Mike, 2026-10-18: the banner's job is to show
they are real people, so the photos stay phone selfies; no coins named). Canvas 2560x1440; what matters sits inside
YouTube's 1546x423 centre strip (what phones show); desktop/tablet see the full 2560x423 band.
  python build_banner.py v1   -> 2 photos (both-01 left, both-04 right), wordmark between them, all inside the strip
  python build_banner.py v2   -> 3 photos fill the strip (both-01, both-04, both-02), wordmark in the desktop wings
  python build_banner.py v3   -> Mike's pick 2026-10-18: both-01 centre, yuli-06-rose LEFT + both-04 RIGHT as tilted
                                 photo PRINTS (white border, shadow); wordmark one line under the centre faces
  python build_banner.py v4   -> same prints, big two-line wordmark in the desktop right wing instead (mobile shows none)
Outputs faithful-crypto-banner-<v>.png (upload) + _preview-safe-<v>.png (strip + band outlined)."""
import math, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance

SRC = '../source-photos/'
W, H = 2560, 1440
SAFE_W, SAFE_H = 1546, 423
SX0, SY0 = (W - SAFE_W) // 2, (H - SAFE_H) // 2
PINK, TEAL, PLUM = (255, 47, 164), (0, 229, 255), (10, 4, 16)
V = sys.argv[1] if len(sys.argv) > 1 else 'v1'


def inscribed(w, h, deg):
    a = math.radians(deg); sa, ca = abs(math.sin(a)), abs(math.cos(a))
    if w <= 2 * sa * ca * h or abs(sa - ca) < 1e-10:
        x = 0.5 * min(w, h); wr, hr = (x / sa, x / ca) if w < h else (x / ca, x / sa)
    else:
        c2 = ca * ca - sa * sa; wr, hr = (w * ca - h * sa) / c2, (h * ca - w * sa) / c2
    return int(wr), int(hr)


def load(name, angle=0.0):
    im = Image.open(SRC + name).convert('RGB')
    if angle:
        rot = im.rotate(angle, resample=Image.BICUBIC, expand=True); iw, ih = inscribed(im.width, im.height, angle)
        cx, cy = rot.width // 2, rot.height // 2; im = rot.crop((cx - iw // 2, cy - ih // 2, cx + iw // 2, cy + ih // 2))
    return im


def tile(im, box, height, depth=None, feather=50, radius=150):
    """crop box (fractions) -> resized to height; optional depth ellipse (fractions of the crop) keeps faces sharp,
    softens the rest; returns (image, alpha mask with feathered rounded edges)"""
    w, h = im.size; c = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    c = c.resize((int(c.width * height / c.height), height), Image.LANCZOS)
    c = ImageEnhance.Sharpness(c).enhance(1.2); c = ImageEnhance.Contrast(c).enhance(1.1); c = ImageEnhance.Color(c).enhance(1.06)
    if depth:
        soft = c.filter(ImageFilter.GaussianBlur(8)); dm = Image.new('L', c.size, 0)
        ImageDraw.Draw(dm).ellipse((depth[0] * c.width, depth[1] * c.height, depth[2] * c.width, depth[3] * c.height), fill=255)
        c = Image.composite(c, soft, dm.filter(ImageFilter.GaussianBlur(60)))
    m = Image.new('L', c.size, 0); F = feather
    ImageDraw.Draw(m).rounded_rectangle((F, F, c.width - F, c.height - F), radius=radius, fill=255)
    return c, m.filter(ImageFilter.GaussianBlur(F * 0.9))


def print_tile(im, box, photo_h, angle, border=16, bottom=58):
    """a physical photo print: white frame (fatter at the bottom), tilted, with a soft drop shadow"""
    w, h = im.size; c = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    c = c.resize((int(c.width * photo_h / c.height), photo_h), Image.LANCZOS)
    c = ImageEnhance.Sharpness(c).enhance(1.15); c = ImageEnhance.Contrast(c).enhance(1.06)
    fw, fh = c.width + 2 * border, c.height + border + bottom
    card = Image.new('RGBA', (fw, fh), (248, 246, 242, 255)); card.paste(c, (border, border))
    card = card.rotate(angle, resample=Image.BICUBIC, expand=True)
    sh = Image.new('RGBA', card.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 170), (0, 0), card.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(22))
    return card, sh


def wordline(canvas, cx, cy, fs):
    """single-line wordmark centred at (cx, cy), same gradient + glow"""
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', fs); l = 'FAITHFUL CRYPTO'
    d = ImageDraw.Draw(canvas); tw = d.textlength(l, font=font); wx0 = int(cx - tw / 2); wy0 = int(cy - fs * 0.6)
    text = Image.new('L', (W, H), 0); ImageDraw.Draw(text).text((wx0, wy0), l, font=font, fill=255)
    grad = Image.new('RGB', (W, H)); gp = grad.load()
    for x in range(wx0, int(wx0 + tw) + 1):
        t = (x - wx0) / max(1, tw)
        col = tuple(int(PINK[k] + (255 - PINK[k]) * (t / 0.55)) for k in range(3)) if t < 0.55 else tuple(int(255 + (TEAL[k] - 255) * ((t - 0.55) / 0.45)) for k in range(3))
        for y in range(max(0, wy0 - 10), min(H, int(wy0 + fs * 1.3))):
            gp[x, y] = col
    canvas.paste(Image.new('RGB', (W, H), (0, 0, 0)), (0, 0), text.filter(ImageFilter.GaussianBlur(26)).point(lambda v: min(255, int(v * 1.6))))
    canvas.paste(Image.new('RGB', (W, H), PINK), (0, 0), text.filter(ImageFilter.GaussianBlur(22)).point(lambda v: min(255, int(v * 0.9))))
    canvas.paste(Image.new('RGB', (W, H), (0, 0, 0)), (4, 6), text.filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.8)))
    canvas.paste(grad, (0, 0), text)


def wordmark(canvas, right_x, cy, fs, glow=1.0):
    font = ImageFont.truetype('C:/Windows/Fonts/ariblk.ttf', fs); lines = ['FAITHFUL', 'CRYPTO']
    d = ImageDraw.Draw(canvas); tw = max(d.textlength(l, font=font) for l in lines); th = fs * 1.02 * len(lines)
    wx1 = right_x; wx0 = int(wx1 - tw); wy0 = int(cy - th / 2) + 6
    text = Image.new('L', (W, H), 0); td = ImageDraw.Draw(text)
    for i, l in enumerate(lines):
        td.text((wx1 - td.textlength(l, font=font), wy0 + i * fs * 1.02), l, font=font, fill=255)
    grad = Image.new('RGB', (W, H)); gp = grad.load()
    for x in range(wx0, int(wx1) + 1):
        t = (x - wx0) / max(1, (wx1 - wx0))
        col = tuple(int(PINK[k] + (255 - PINK[k]) * (t / 0.55)) for k in range(3)) if t < 0.55 else tuple(int(255 + (TEAL[k] - 255) * ((t - 0.55) / 0.45)) for k in range(3))
        for y in range(max(0, wy0 - 10), min(H, int(wy0 + th) + 10)):
            gp[x, y] = col
    canvas.paste(Image.new('RGB', (W, H), PINK), (0, 0), text.filter(ImageFilter.GaussianBlur(30)).point(lambda v: min(255, int(v * 1.1 * glow))))
    canvas.paste(Image.new('RGB', (W, H), (0, 0, 0)), (6, 8), text.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.7)))
    canvas.paste(grad, (0, 0), text)
    return wx0


# ---- background: both-01 levelled, cover-scaled, blurred, darkened, pushed toward the channel plum
p01 = load('both-01-restaurant-laugh-wide.jpeg', 12.0)
s = max(W / p01.width, H / p01.height)
bg = p01.resize((int(p01.width * s) + 1, int(p01.height * s) + 1), Image.LANCZOS)
bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
bg = bg.filter(ImageFilter.GaussianBlur(120)); bg = ImageEnhance.Brightness(bg).enhance(0.6)
bg = Image.blend(bg, Image.new('RGB', (W, H), PLUM), 0.45)
grad = Image.new('L', (1, H))
for y in range(H):
    grad.putpixel((0, y), int(255 * (1 - min(1.0, min(y, H - 1 - y) / (H * 0.32))) * 0.75))
bg.paste(Image.new('RGB', (W, H), PLUM), (0, 0), grad.resize((W, H)))
canvas = bg.copy()
CY = SY0 + SAFE_H // 2

# the three real photos as tiles (crop boxes eyeballed on the photos)
T01 = dict(im=p01, box=(0.10, 0.0, 0.82, 1.0), depth=(0.12, 0.02, 0.9, 0.82))                 # both laughing, heads together
T04 = dict(im=load('both-04-hands-bracelets.jpeg'), box=(0.26, 0.0, 1.0, 0.62), depth=None)   # Ana hair down + the bracelets
T02 = dict(im=load('both-02-restaurant-laugh-tall.jpeg'), box=(0.0, 0.12, 1.0, 0.72), depth=None)  # cheek to cheek laugh

if V == 'v1':
    a, am = tile(T01['im'], T01['box'], 480, T01['depth']); canvas.paste(a, (SX0 + 10, CY - a.height // 2 + 8), am)
    b, bm = tile(T04['im'], T04['box'], 520); canvas.paste(b, (SX0 + SAFE_W - b.width - 10, CY - b.height // 2 + 20), bm)
    wordmark(canvas, SX0 + SAFE_W - b.width - 40, CY, 96)
elif V == 'v2':
    a, am = tile(T01['im'], T01['box'], 480, T01['depth']); canvas.paste(a, (SX0 + 10, CY - a.height // 2 + 8), am)
    c, cm = tile(T02['im'], T02['box'], 500); canvas.paste(c, (SX0 + 10 + a.width - 30, CY - c.height // 2 + 10), cm)
    b, bm = tile(T04['im'], T04['box'], 520); canvas.paste(b, (SX0 + SAFE_W - b.width - 10, CY - b.height // 2 + 20), bm)
    wordmark(canvas, W - 60, CY, 110)   # desktop right wing, outside the mobile strip
else:
    # centre: both-01 levelled, faces sharp, feathered into the blur
    a, am = tile(T01['im'], (0.15, 0.0, 0.78, 1.0), 500, (0.1, 0.02, 0.92, 0.82)); ax = SX0 + (SAFE_W - a.width) // 2
    canvas.paste(a, (ax, CY - a.height // 2 + 4), am)
    # left print: Yuli with the rose (hair done); right print: Ana hair down + the bracelets
    L, Ls = print_tile(load('yuli-06-rose.jpeg'), (0.12, 0.20, 0.92, 0.80), 300, 6)
    R, Rs = print_tile(load('both-04-hands-bracelets.jpeg'), (0.34, 0.0, 1.0, 0.56), 310, -6)
    lx, ly = SX0 + 22, CY - L.height // 2 - 2; rx, ry = SX0 + SAFE_W - R.width - 22, CY - R.height // 2 - 2
    canvas.paste(Ls, (lx + 10, ly + 18), Ls); canvas.paste(L, (lx, ly), L)
    canvas.paste(Rs, (rx + 10, ry + 18), Rs); canvas.paste(R, (rx, ry), R)
    if V == 'v3':
        wordline(canvas, SX0 + SAFE_W // 2, SY0 + SAFE_H - 44, 64)
    else:
        wordmark(canvas, W - 40, CY, 72)   # desktop right wing only (mobile shows no wordmark)
canvas.save(f'faithful-crypto-banner-{V}.png')
prev = canvas.copy(); pd = ImageDraw.Draw(prev); f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 28)
pd.rectangle((SX0, SY0, SX0 + SAFE_W, SY0 + SAFE_H), outline=(255, 255, 0), width=4); pd.rectangle((0, SY0, W - 1, SY0 + SAFE_H), outline=(0, 255, 0), width=3)
pd.text((SX0 + 8, SY0 - 34), 'MOBILE SAFE 1546x423', font=f, fill=(255, 255, 0)); pd.text((8, SY0 - 34), 'DESKTOP 2560x423', font=f, fill=(0, 255, 0))
prev.save(f'_preview-safe-{V}.png'); print('wrote', V)
