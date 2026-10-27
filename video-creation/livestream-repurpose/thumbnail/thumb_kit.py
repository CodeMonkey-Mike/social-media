"""Shared building blocks for livestream thumbnails (see thumbnail.md).

Every thumbnail is composed in code, never by an image model: the layout is exact and
re-runs are instant. A stream's own build.py (one subfolder per stream) imports this.
"""
import math

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
SS = 4  # supersampling factor for badges

# headline style, sampled from Mike's original "Best Time To Buy" thumbnail
HEADLINE_FONT = 'C:/Windows/Fonts/impact.ttf'
GOLD_TOP, GOLD_MID, GOLD_BOT = (250, 222, 120), (247, 205, 80), (250, 180, 8)
OUTLINE = (12, 8, 2)


def clean_left(source, mask_boxes, feather_x=1130, top_clear=(1290, 250)):
    """Upscale `source` to 1920x1080 and replace the left side with a clean, blurred backdrop.

    mask_boxes: (x0, y0, x1, y1) boxes in SOURCE pixels covering whatever must disappear
    (old text, old logos). They are inpainted at low res, so the fill is a smooth gradient
    in the source's own colours. Right of `feather_x` the original (Mike) shows through.
    top_clear: (x, y) keeps the clean backdrop out to x for the top strip above y, for an old
    headline that ran further right than the feather.
    """
    src = source.convert('RGB')
    big = src.resize((W, H), Image.LANCZOS)
    lw, lh = 344, 192
    sx, sy = lw / src.width, lh / src.height
    a = np.array(src.resize((lw, lh), Image.LANCZOS))[:, :, ::-1].copy()
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in mask_boxes:
        m[int(y0 * sy):int(y1 * sy) + 1, int(x0 * sx):int(x1 * sx) + 1] = 255
    inp = cv2.inpaint(a, m, 12, cv2.INPAINT_TELEA)
    inp = cv2.GaussianBlur(inp, (0, 0), 6)
    bg = Image.fromarray(inp[:, :, ::-1]).resize((W, H), Image.BICUBIC)
    # darken a touch for text contrast + grain
    bg = Image.blend(bg, Image.new('RGB', (W, H), (6, 20, 22)), 0.25)
    rng = np.random.default_rng(1)
    g = np.array(bg).astype(np.int16) + rng.normal(0, 5, (H, W, 1)).astype(np.int16)
    bg = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8))
    # feather: left = clean backdrop, right = original
    x = np.arange(W, dtype=np.float32)
    mk = np.tile(np.clip((x - feather_x) / 140, 0, 1), (H, 1))
    if top_clear:
        tx, ty = top_clear
        top = np.clip((x[None, :] - tx) / 110, 0, 1)
        vy = np.clip((np.arange(H, dtype=np.float32)[:, None] - ty) / 50, 0, 1)
        mk = mk * vy + np.minimum(mk, top) * (1 - vy)
    mask = Image.fromarray((mk * 255).astype(np.uint8))
    return Image.composite(big, bg, mask).convert('RGBA')


def make_plate(example, out_path, text_until_x=760):
    """Turn a reference thumbnail into a reusable empty background plate (1920x1080).

    Removes the person (rembg human seg) and the headline (anything not blue-dominant left of
    `text_until_x`, source px), refills the hole with the colour field inpainted from the
    surroundings plus grain synthesized to the reference's own measured texture.
    Used once per plate: plates/blue.png came from ../blue.png (Mike, 2026-10-23)."""
    from rembg import new_session, remove
    ex = example.convert('RGB')
    a = np.array(ex).astype(np.float32)
    alpha = np.array(remove(ex, session=new_session('u2net_human_seg')).split()[3])
    person = cv2.dilate((alpha > 20).astype(np.uint8) * 255, np.ones((49, 49), np.uint8))
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    notblue = ((r > 60) | (b < g)).astype(np.uint8) * 255
    notblue[:, text_until_x:] = 0
    mask = cv2.max(person, cv2.dilate(notblue, np.ones((45, 45), np.uint8)))
    h0, w0 = mask.shape
    low = cv2.GaussianBlur(a, (0, 0), 6)
    small = cv2.resize(low, (w0 // 8, h0 // 8), interpolation=cv2.INTER_AREA)
    ms = (cv2.resize(mask, (w0 // 8, h0 // 8), interpolation=cv2.INTER_AREA) > 0).astype(np.uint8) * 255
    fill = cv2.inpaint(np.clip(small, 0, 255).astype(np.uint8), ms, 6, cv2.INPAINT_TELEA).astype(np.float32)
    fill = cv2.GaussianBlur(cv2.resize(fill, (w0, h0), interpolation=cv2.INTER_CUBIC), (0, 0), 25)
    # grain per band, std measured on clean pixels
    clean = cv2.erode((mask == 0).astype(np.uint8), np.ones((15, 15), np.uint8)) > 0
    bands = ((a - cv2.GaussianBlur(a, (0, 0), 1.5), 0.7), (cv2.GaussianBlur(a, (0, 0), 1.5) - low, 3.0))
    rng = np.random.default_rng(3)
    grain = np.zeros_like(a)
    for band, sig in bands:
        n = cv2.GaussianBlur(rng.normal(0, 1, (h0, w0)).astype(np.float32), (0, 0), sig)
        grain += (n / n.std())[..., None] * band[clean].std(0)[None, None, :]
    m = cv2.GaussianBlur((mask > 0).astype(np.float32), (0, 0), 4)[..., None]
    out = Image.fromarray(np.clip(a * (1 - m) + (fill + grain) * m, 0, 255).astype(np.uint8))
    out.resize((W, H), Image.LANCZOS).save(out_path)
    print('wrote', out_path)


def cut_person(photo, erode=2, feather=1.2):
    """Cut Mike out of a 16:9 photo, scaled to the 1920x1080 frame. isnet-general-use gave the
    cleanest curly-hair edge on a real photo (u2net_human_seg dragged in a door behind him)."""
    from rembg import new_session, remove
    cut = remove(photo.convert('RGB').resize((W, H), Image.LANCZOS), session=new_session('isnet-general-use'))
    a = np.array(cut.split()[3])
    if erode:   # replicate the border so a body cut off by the frame keeps its frame edge
        a = cv2.erode(a, np.ones((erode * 2 + 1,) * 2, np.uint8), borderType=cv2.BORDER_REPLICATE)
    cut.putalpha(Image.fromarray(a).filter(ImageFilter.GaussianBlur(feather)))
    return cut


def place_person(canvas, cut, scale=1.0, dx=0):
    """Composite a full-frame cutout scaled about the bottom-right corner, then shifted dx px
    right (pushing the far shoulder off-frame) to clear the headline and coins."""
    c = cut.resize((round(W * scale), round(H * scale)), Image.LANCZOS)
    layer = Image.new('RGBA', (W + abs(dx) + W, H), (0, 0, 0, 0))
    layer.alpha_composite(c, (W - c.width + dx, H - c.height))
    canvas.alpha_composite(layer.crop((0, 0, W, H)))


# ---- coin badges -------------------------------------------------------------------------

def badge(D, fill_top, fill_bot, icon=None, frac=.56, dy=0, ring=(235, 240, 240), ring_w=7):
    """A round DxD coin: vertical-gradient disc, light ring, `icon` centred at `frac` of D."""
    sz = D * SS
    grad = Image.new('RGB', (sz, sz))
    gd = ImageDraw.Draw(grad)
    for yy in range(sz):
        t = yy / sz
        gd.line([(0, yy), (sz, yy)], fill=tuple(int(fill_top[i] * (1 - t) + fill_bot[i] * t) for i in range(3)))
    im = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
    cm = Image.new('L', (sz, sz), 0)
    ImageDraw.Draw(cm).ellipse([0, 0, sz - 1, sz - 1], fill=255)
    im.paste(grad, (0, 0), cm)
    ImageDraw.Draw(im).ellipse([ring_w * 2, ring_w * 2, sz - 1 - ring_w * 2, sz - 1 - ring_w * 2],
                               outline=ring, width=ring_w * 4)
    if icon is not None:
        ic = icon.crop(icon.getbbox())
        r = int(sz * frac) / max(ic.size)
        ic = ic.resize((max(1, int(ic.width * r)), max(1, int(ic.height * r))), Image.LANCZOS)
        im.alpha_composite(ic, ((sz - ic.width) // 2, (sz - ic.height) // 2 + dy * SS // 4))
    return im.resize((D, D), Image.LANCZOS)


def icon_text(ch, font='C:/Windows/Fonts/ariblk.ttf', color=(255, 255, 255)):
    """A single character as an icon, e.g. '?'."""
    im = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((500, 500), ch, font=ImageFont.truetype(font, 620), fill=color, anchor='mm')
    return im


def icon_kaspa():
    """Kaspa K, flat white: stem on the right, two square-ended arms pointing left."""
    kk = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
    kd = ImageDraw.Draw(kk)
    Ls, sw = 520, 104                       # stem length, stroke width
    sx, sy = 600, 500                       # stem centre
    kd.rectangle([sx - sw / 2, sy - Ls / 2, sx + sw / 2, sy + Ls / 2], fill='white')
    jx = sx - sw / 2 + 8                    # arms meet the stem's left edge
    for d in (-1, 1):
        ex, ey = jx - 0.56 * Ls, sy + d * 0.30 * Ls
        ang = math.atan2(ey - sy, ex - jx)
        nx, ny = -math.sin(ang) * sw * 0.55, math.cos(ang) * sw * 0.55
        kd.polygon([(jx + nx, sy + ny), (ex + nx, ey + ny), (ex - nx, ey - ny), (jx - nx, sy - ny)], fill='white')
    return kk.rotate(3, resample=Image.BICUBIC)


def icon_glyph(source, box, chan='m', lo=110, hi=190, grow=0):
    """Lift a light glyph (logo letter) off a darker coin in `source` as a clean white icon.

    chan 'r' thresholds the red channel (white glyph on teal/green), 'm' the mean (on dark).
    grow thickens thin strokes (MaxFilter size, odd).
    """
    a = np.array(source.convert('RGB').crop(box)).astype(np.float32)
    v = a[:, :, 0] if chan == 'r' else a.mean(-1)
    al = cv2.GaussianBlur(np.clip((v - lo) / (hi - lo), 0, 1), (0, 0), 0.6)
    up = Image.fromarray((al * 255).astype(np.uint8)).resize((a.shape[1] * 4, a.shape[0] * 4), Image.BICUBIC)
    up = up.filter(ImageFilter.GaussianBlur(2)).point(lambda p: 0 if p < 90 else (255 if p > 165 else int((p - 90) * 255 / 75)))
    if grow:
        up = up.filter(ImageFilter.MaxFilter(grow)).filter(ImageFilter.GaussianBlur(1.5))
    g = Image.new('RGBA', up.size, (255, 255, 255, 255))
    g.putalpha(up)
    return g


def cutout(source, box, out_path=None):
    """Cut an object out of `source` with rembg (works when it contrasts with its background;
    a teal coin on a teal backdrop fails, draw that one instead)."""
    from rembg import remove
    im = remove(source.convert('RGB').crop(box))
    if out_path:
        im.save(out_path)
    return im


def rows_layout(D, counts=(3, 2), x0=64, y0=552, gap=40, rgap=14, stagger=True):
    """Top-left positions for coins in rows; with stagger each next row shifts half a step."""
    pos = []
    for r, n in enumerate(counts):
        off = (D + gap) // 2 * r if stagger else 0
        pos += [(x0 + off + i * (D + gap), y0 + r * (D + rgap)) for i in range(n)]
    return pos


def place(canvas, coins, positions):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for cc, (px, py) in zip(coins, positions):
        s_ = Image.new('RGBA', cc.size, (0, 0, 0, 0))
        s_.putalpha(cc.split()[3].point(lambda v: int(v * .7)))
        sh.alpha_composite(s_, (px + 8, py + 14))
        layer.alpha_composite(cc, (px, py))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    canvas.alpha_composite(layer)


# ---- headline ----------------------------------------------------------------------------

def headline(canvas, lines, x=60, y=30, max_w=1090, max_h=590, line_gap=34):
    """Gold-gradient Impact headline, dark outline + glow + drop shadow. Font size is the
    largest that keeps every line within max_w and the block within max_h. Returns the
    bottom y of the block."""
    fs = 400
    while True:
        font = ImageFont.truetype(HEADLINE_FONT, fs)
        caps = [font.getbbox(ln) for ln in lines]
        widest = max(font.getlength(ln) for ln in lines)
        block = sum(b[3] - b[1] for b in caps) + line_gap * (len(lines) - 1)
        if widest <= max_w and block <= max_h:
            break
        fs -= 2
    txt = Image.new('L', (W, H), 0)
    stroke = Image.new('L', (W, H), 0)
    td, sd = ImageDraw.Draw(txt), ImageDraw.Draw(stroke)
    grad = Image.new('RGB', (W, H))
    gdr = ImageDraw.Draw(grad)
    for ln in lines:
        bb = font.getbbox(ln)
        oy = y - bb[1]
        td.text((x, oy), ln, font=font, fill=255)
        sd.text((x, oy), ln, font=font, fill=255, stroke_width=6, stroke_fill=255)
        y1, y2 = y, y + (bb[3] - bb[1])
        for yy in range(y1 - 8, y2 + 9):
            t = min(1, max(0, (yy - y1) / (y2 - y1)))
            a_, b_, u = (GOLD_TOP, GOLD_MID, t / .45) if t < .45 else (GOLD_MID, GOLD_BOT, (t - .45) / .55)
            gdr.line([(0, yy), (W, yy)], fill=tuple(int(a_[k] * (1 - u) + b_[k] * u) for k in range(3)))
        y = y2 + line_gap
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow.putalpha(stroke.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * .85)))
    canvas.alpha_composite(glow)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(stroke.point(lambda v: int(v * .8)))
    canvas.alpha_composite(ImageChops.offset(sh, 5, 7).filter(ImageFilter.GaussianBlur(3)))
    ol = Image.new('RGBA', (W, H), OUTLINE + (255,))
    ol.putalpha(stroke)
    canvas.alpha_composite(ol)
    fill = grad.convert('RGBA')
    fill.putalpha(txt)
    canvas.alpha_composite(fill)
    print(f'headline: font {fs}px, bottom y {y - line_gap}')
    return y - line_gap


def export(canvas, path):
    """1920x1080 JPG, q94 4:4:4 (~600 KB, under YouTube's 2 MB cap)."""
    canvas.convert('RGB').save(path, quality=94, subsampling=0)
    print('wrote', path)


# ---- arrow -------------------------------------------------------------------------------

def arrow(canvas, p0, p1, p2, width=30, head=(96, 104), fill=(255, 255, 255), outline=OUTLINE, ow=7):
    """A curved callout arrow: quadratic Bezier p0 -> p2 bent toward control point p1, with a
    triangular head at p2 pointing along the curve. Dark outline + drop shadow like the headline."""
    def pt(t):
        return tuple((1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t ** 2 * p2[k] for k in range(2))
    hl, hw = head
    tx, ty = p2[0] - pt(.97)[0], p2[1] - pt(.97)[1]
    n = math.hypot(tx, ty)
    ux, uy = tx / n, ty / n
    base = (p2[0] - ux * hl, p2[1] - uy * hl)
    # shaft stops inside the head so its round cap is hidden
    ts = [i / 600 for i in range(601)]
    shaft = [pt(t) for t in ts if math.hypot(pt(t)[0] - p2[0], pt(t)[1] - p2[1]) > hl * .7]
    tri = [p2, (base[0] - uy * hw / 2, base[1] + ux * hw / 2), (base[0] + uy * hw / 2, base[1] - ux * hw / 2)]
    S = SS
    sc = lambda pts: [(x * S, y * S) for x, y in pts]

    def mask(grow):
        m = Image.new('L', (W * S, H * S), 0)
        d = ImageDraw.Draw(m)
        w = (width + 2 * grow) * S
        for x, y in sc(shaft):   # stamped discs: a wide polyline frays on a tight curve
            d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=255)
        t = sc(tri)
        if grow:   # fatten the head by stroking its edges
            d.polygon(t, fill=255, outline=255)
            d.line(t + t[:1], fill=255, width=int(2 * grow * S), joint='curve')
            for x, y in t:
                d.ellipse([x - grow * S, y - grow * S, x + grow * S, y + grow * S], fill=255)
        else:
            d.polygon(t, fill=255)
        return m.resize((W, H), Image.LANCZOS)

    inner = mask(0)
    # outline = the shape grown by dilation (a wide-stroked curve frays at this size)
    outer = inner.point(lambda v: 255 if v > 100 else 0).filter(ImageFilter.MaxFilter(2 * ow + 1)).filter(ImageFilter.GaussianBlur(1))
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(outer.point(lambda v: int(v * .75)))
    canvas.alpha_composite(ImageChops.offset(sh, 6, 9).filter(ImageFilter.GaussianBlur(6)))
    ol = Image.new('RGBA', (W, H), outline + (255,))
    ol.putalpha(outer)
    canvas.alpha_composite(ol)
    fl = Image.new('RGBA', (W, H), fill + (255,))
    fl.putalpha(inner)
    canvas.alpha_composite(fl)


def _band(d, a, b, w, fill):
    """A straight square-ended stroke from a to b, w wide."""
    ang = math.atan2(b[1] - a[1], b[0] - a[0])
    nx, ny = -math.sin(ang) * w / 2, math.cos(ang) * w / 2
    d.polygon([(a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny), (b[0] - nx, b[1] - ny), (a[0] - nx, a[1] - ny)], fill=fill)


def icon_litecoin():
    """Litecoin's slashed L (Ł), flat white, with a slight forward slant."""
    im = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([400, 180, 520, 800], fill='white')            # stem
    d.rectangle([400, 690, 800, 800], fill='white')            # foot
    _band(d, (250, 590), (680, 420), 100, 'white')             # slash
    return im.transform(im.size, Image.AFFINE, (1, .12, -60, 0, 1, 0), Image.BICUBIC)


def icon_arbitrum(blue=(18, 170, 255), edge=(150, 190, 220), navy=(33, 49, 71)):
    """Arbitrum mark redrawn: a rounded navy hexagon with a light edge, a white A-frame and a blue
    stroke running parallel to its right leg."""
    S_ = 1000
    im = Image.new('RGBA', (S_, S_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    hexp = [(500 + 470 * math.sin(math.radians(a)), 500 - 470 * math.cos(math.radians(a))) for a in range(0, 360, 60)]
    d.polygon(hexp, fill=edge)
    d.line(hexp + hexp[:2], fill=edge, width=60, joint='curve')
    inner = [(500 + 405 * math.sin(math.radians(a)), 500 - 405 * math.cos(math.radians(a))) for a in range(0, 360, 60)]
    d.polygon(inner, fill=navy)
    # the A-frame: a white triangle with a navy triangle inside; both run past the hexagon's
    # bottom so the legs meet its edge like the real mark (the clip below trims them)
    ax, ay, sl, t = 500, 205, .36, 95          # apex, leg run per unit rise, leg width
    d.polygon([(ax, ay), (ax + sl * 900, ay + 900), (ax - sl * 900, ay + 900)], fill='white')
    iy = ay + t * math.hypot(1, sl) / sl
    d.polygon([(ax, iy), (ax + sl * 900, iy + 900), (ax - sl * 900, iy + 900)], fill=navy)
    off = (t + 42) * math.hypot(1, sl)         # horizontal step to the parallel blue stroke
    _band(d, (ax + sl * (470 - ay) + off, 470), (ax + sl * (1100 - ay) + off, 1100), t, blue)
    # re-lay the hexagon edge over the strokes so they end in it
    ring = Image.new('L', (S_, S_), 0)
    rd = ImageDraw.Draw(ring)
    rd.line(hexp + hexp[:2], fill=255, width=60, joint='curve')
    rd.polygon(inner, fill=0)
    edge_layer = Image.new('RGBA', (S_, S_), edge + (255,))
    edge_layer.putalpha(ring)
    im.alpha_composite(edge_layer)
    # hide what spills past the inner hexagon
    m = Image.new('L', (S_, S_), 0)
    ImageDraw.Draw(m).polygon(hexp, fill=255)
    im.putalpha(ImageChops.multiply(im.split()[3], m))
    return im
