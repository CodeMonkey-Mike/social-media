"""plan-to-make-millions thumbnail, step 2: compose in CODE (no image model anywhere).

Mike's ask (2026-11-23): the layout of a finance thumbnail he linked (`refs/layout-ref.jpg`: the person on one side of a
dark grid, a green line climbing to the top right, a big white "+$" number at the top, the year at the bottom), with
"+$11,512,788" and "2028", his portrait from his published Pieverse thumbnail (`refs/mike-portrait-plate.png`), and the
golden light on him turned into a GREEN glow, "because of the green chart".

    python cut_mike.py                     (once: work/mike-cut.png)
    python compose_thumb.py [A B ...]      -> takes/take-<X>.png + take-<X>-1920.jpg, takes/takes-sheet.jpg

What is done to his portrait, all pixel filters (no feature is moved or redrawn):
  1. the orange / golden cast is pulled back to plain skin (warm hues lose saturation, the hue moves a few degrees);
  2. the teal edge light on his cheek is turned to the chart's green;
  3. a green wash and a green rim are added on the side that faces the chart, and a green glow sits behind him
     where the plate had a golden outline.
Take A puts him on the LEFT like the reference: the plate cuts his shoulder at its right border, so that shoulder is
continued in code (the jacket mirrored past the border, under a drawn shoulder line).
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
WORK = THUMB / "work"
TAKES = THUMB / "takes"
W, H = 1920, 1080
SS = 2                                   # supersample for the line and the words
GREEN = np.array([38, 232, 74], np.float32)          # the chart line
GREEN_LIGHT = np.array([0.30, 1.00, 0.42], np.float32)   # the colour of the light it throws
BODY_Y = 1010                            # the row of his chin in the cut: below it is neck, shirt and jacket
FONTS = {
    "arial-black": (r"C:/Windows/Fonts/ariblk.ttf", None),
    "roboto-black": (r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/thumbnail/fonts/Roboto-var.ttf", 900),
    "montserrat-black": (r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/fonts/Montserrat-VF.ttf", 900),
}


def font(name, size):
    path, wght = FONTS[name]
    f = ImageFont.truetype(path, size)
    if wght:
        try:
            f.set_variation_by_axes([wght] + [100] * (len(f.get_variation_axes()) - 1))
        except Exception:
            f.set_variation_by_name("Black")
    return f


# ---------------------------------------------------------------- portrait
def load_cut():
    c = np.asarray(Image.open(WORK / "mike-cut.png")).astype(np.float32) / 255.0
    rgb, a = c[..., :3].copy(), c[..., 3].copy()
    # the plate's outline glow survives as a faint fringe: pull the low alphas in
    a = np.clip((a - 0.10) / 0.90, 0, 1) ** 1.25
    return rgb, a


def extend_shoulder(rgb, a, ext=440):
    """Continue the shoulder the plate cuts at its right border: mirror the jacket past the border and keep it only
    under a shoulder line that carries on the measured slope and then rounds down."""
    h, w = a.shape
    top = lambda col: int(np.where((a[:, col] > 0.5) & (np.arange(h) > 900))[0].min())
    y_edge, slope = top(w - 1), (top(w - 1) - top(w - 201)) / 200.0
    curv = (h - y_edge - slope * 400) / (400.0 ** 2)          # reaches the bottom about 400 px out
    d = np.arange(ext, dtype=np.float32)
    line = y_edge + slope * d + curv * d * d
    yy = np.arange(h, dtype=np.float32)[:, None]
    a_ext = np.clip((yy - line[None, :]) / 1.6 + 0.5, 0, 1)   # soft 1.6 px edge
    rgb_ext = rgb[:, ::-1][:, :ext].copy()
    t = np.clip(d / 90.0, 0, 1)                               # no step at the border: both changes ease in
    rgb_ext *= (1.0 - 0.08 * t - 0.42 * (d / ext))[None, :, None]     # falls into shadow away from him
    g = rgb_ext.mean(-1, keepdims=True)
    rgb_ext = g + (rgb_ext - g) * (1 - 0.45 * t)[None, :, None]       # and loses the plate's edge light
    rgb_ext = cv2.GaussianBlur(rgb_ext, (0, 0), 1.2)          # the mirrored weave must not read as a pattern
    return np.concatenate([rgb, rgb_ext], 1), np.concatenate([a, a_ext], 1)


def hsv_shift(rgb, gold_keep, teal_to):
    """1 + 2 of the docstring. gold_keep = how much of the warm saturation stays (1 = untouched)."""
    hsv = cv2.cvtColor(np.clip(rgb, 0, 1), cv2.COLOR_RGB2HSV)       # H 0..360, S, V 0..1
    hh, ss, vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # warm band (skin, copper hair lights): 0..55 deg, soft shoulders
    warm = np.clip((hh + 12) / 12, 0, 1) * np.clip((58 - hh) / 14, 0, 1)
    warm = np.where(hh > 340, 1.0, warm)
    ss2 = ss * (1 - warm * (1 - gold_keep))
    hh2 = np.where(warm > 0, hh - 4.0 * warm * (hh < 180), hh)
    hh2 = np.where(hh2 < 0, hh2 + 360, hh2)
    # teal / cyan band 135..215 deg -> the chart's green
    teal = np.clip((hh - 132) / 16, 0, 1) * np.clip((206 - hh) / 18, 0, 1) * np.clip(ss / 0.10, 0, 1)
    hh2 = hh2 * (1 - teal) + teal_to * teal
    ss2 = np.clip(ss2 * (1 + 0.22 * teal), 0, 1)
    vv2 = np.clip(vv * (1 + 0.05 * teal), 0, 1)
    return cv2.cvtColor(np.dstack([hh2, ss2, vv2]).astype(np.float32), cv2.COLOR_HSV2RGB)


def relight(rgb, a, side, wash=0.42, rim=0.55, gold_keep=0.70):
    """Green light from `side` ('right' or 'left' = where the chart is)."""
    h, w = a.shape
    out = hsv_shift(rgb, gold_keep, teal_to=128.0)
    lum = (out * np.array([0.30, 0.59, 0.11], np.float32)).sum(-1)
    sgn = 1.0 if side == "right" else -1.0
    # outward normal of the silhouette, from a wide blur of the matte
    soft = cv2.GaussianBlur(a, (0, 0), 28)
    gx, gy = cv2.Sobel(soft, cv2.CV_32F, 1, 0, ksize=5), cv2.Sobel(soft, cv2.CV_32F, 0, 1, ksize=5)
    mag = np.sqrt(gx * gx + gy * gy) + 1e-6
    nx, ny = -gx / mag, -gy / mag
    facing = np.clip(nx * sgn * 0.95 + ny * -0.30, 0, 1)             # light sits to the side and a little above
    inside = cv2.distanceTransform((a > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    # wash: a broad band, 0 at 190 px inside the edge, on the facing side only
    band = np.clip(1 - inside / 190.0, 0, 1) ** 1.6 * cv2.GaussianBlur(facing, (0, 0), 14)
    body = np.clip((np.arange(h, dtype=np.float32)[:, None] - BODY_Y) / 90.0, 0, 1)   # 0 on the head, 1 on the jacket
    band = band * (1 - 0.80 * body)
    tgt = lum[..., None] * GREEN_LIGHT[None, None, :] * 1.75
    k = (wash * band)[..., None]
    out = out * (1 - k) + tgt * k
    # rim: a tight band at the edge, added on top
    edge = np.clip(1 - inside / 34.0, 0, 1) ** 1.3 * cv2.GaussianBlur(facing, (0, 0), 6)
    edge = edge * (1 - 0.45 * body)
    out = out + (rim * edge * (0.25 + 0.9 * lum))[..., None] * GREEN_LIGHT[None, None, :]
    # the whole figure sits in a green-lit room: a breath of green in the shadows
    out *= np.array([0.955, 1.0, 0.965], np.float32)
    # half-transparent hair pixels take the glow's colour instead of the old gold
    fr = np.clip((0.75 - a) / 0.75, 0, 1)[..., None] * 0.65
    out = out * (1 - fr) + (0.35 + lum[..., None]) * GREEN_LIGHT[None, None, :] * 0.8 * fr
    # the jacket keeps its navy: green light on dark cloth only lifts it a little
    hsv = cv2.cvtColor(np.clip(out, 0, 1), cv2.COLOR_RGB2HSV)
    greenish = np.clip((hsv[..., 0] - 80) / 20, 0, 1) * np.clip((175 - hsv[..., 0]) / 20, 0, 1)
    hsv[..., 1] *= 1 - 0.55 * greenish * body
    out = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    return np.clip(out, 0, 1)


# ---------------------------------------------------------------- background + chart
def background(glows):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    bg = np.empty((H, W, 3), np.float32)
    t = yy / H
    bg[..., 0], bg[..., 1], bg[..., 2] = 9 + 5 * t, 13 + 8 * t, 12 + 6 * t
    for cx, cy, rx, ry, amt in glows:                         # soft green light pools
        g = np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))
        bg += g[..., None] * (GREEN * amt)[None, None, :]
    grid = np.zeros((H, W), np.float32)
    step = 72
    for x in range(step // 2, W, step):
        grid[:, x:x + 2] = 1
    for y in range(step // 2, H, step):
        grid[y:y + 2, :] = 1
    lumi = bg.mean(-1, keepdims=True)
    bg += grid[..., None] * (9.0 + 0.16 * lumi) * np.array([0.85, 1.0, 0.9], np.float32)
    vig = 1 - 0.38 * np.clip((((xx - W / 2) / (W * 0.72)) ** 2 + ((yy - H / 2) / (H * 0.78)) ** 2), 0, 1.6)
    return np.clip(bg * vig[..., None], 0, 255)


def chart_layers(pts, width=17, dot=None):
    """(line RGBA float, glow float RGB) of the polyline; drawn at SS x and reduced."""
    big = Image.new("L", (W * SS, H * SS), 0)
    d = ImageDraw.Draw(big)
    p = [(x * SS, y * SS) for x, y in pts]
    d.line(p, fill=255, width=width * SS, joint="curve")
    r = width * SS / 2
    for x, y in p:
        d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    if dot:
        x, y, rad = dot[0] * SS, dot[1] * SS, dot[2] * SS
        d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=255)
    m = np.asarray(big.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255.0
    glow = (cv2.GaussianBlur(m, (0, 0), 9) * 0.55 + cv2.GaussianBlur(m, (0, 0), 26) * 0.60
            + cv2.GaussianBlur(m, (0, 0), 70) * 0.75)
    # the light under the line: the area below it, fading down
    poly = Image.new("L", (W, H), 0)
    ImageDraw.Draw(poly).polygon(list(pts) + [(pts[-1][0], H), (pts[0][0], H)], fill=255)
    under = cv2.GaussianBlur(np.asarray(poly).astype(np.float32) / 255.0, (0, 0), 40)
    yy = np.arange(H, dtype=np.float32)[:, None]
    line_y = np.interp(np.arange(W), [q[0] for q in pts], [q[1] for q in pts])[None, :]
    under *= np.clip(1 - (yy - line_y) / 520.0, 0, 1) ** 1.5 * 0.20
    return m, glow, under


def over(dst, rgb, a):
    return dst * (1 - a[..., None]) + rgb * a[..., None]


def words(layer_rgb, items):
    """White heavy words with a soft glow and a drop shadow. items = [(text, font name, size, x, y, anchor)]."""
    big = Image.new("L", (W * SS, H * SS), 0)
    d = ImageDraw.Draw(big)
    boxes = []
    for text, fname, size, x, y, anchor in items:
        f = font(fname, size * SS)
        d.text((x * SS, y * SS), text, font=f, fill=255, anchor=anchor)
        b = d.textbbox((x * SS, y * SS), text, font=f, anchor=anchor)
        boxes.append(tuple(v / SS for v in b))
    m = np.asarray(big.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255.0
    shadow = cv2.GaussianBlur(np.roll(m, 7, axis=0), (0, 0), 9) * 0.75
    wide = cv2.GaussianBlur(m, (0, 0), 30) * 0.55            # a dark pad so the grid never cuts a digit
    out = layer_rgb * (1 - np.clip(shadow + wide, 0, 0.85)[..., None])
    glow = cv2.GaussianBlur(m, (0, 0), 7) * 0.30
    out = out + glow[..., None] * 255.0
    out = over(out, np.full((H, W, 3), 255.0, np.float32), m)
    return np.clip(out, 0, 255), boxes


# ---------------------------------------------------------------- takes
TAKE = {
    # Mike on the LEFT, the reference's own arrangement
    "A": dict(side="right", scale=0.770, face_x=452, hair_top=14, extend=True,
              glows=[(1350, 760, 620, 420, 0.30), (1700, 300, 420, 300, 0.10), (420, 560, 520, 520, 0.07)],
              pts=[(700, 742), (792, 806), (872, 748), (918, 700), (958, 742), (1040, 690), (1118, 672),
                   (1162, 602), (1206, 640), (1250, 668), (1330, 578), (1372, 612), (1492, 404), (1540, 452),
                   (1618, 416), (1650, 352), (1712, 382), (1812, 276), (1850, 304), (1972, 130)],
              text=[("+$11,512,788", "arial-black", 121, 1846, 196, "rs"), ("2028", "arial-black", 190, 1846, 1000, "rs")]),
    # Mike on the RIGHT, where he stands in his own thumbnail
    "B": dict(side="left", scale=0.735, face_x=1452, hair_top=14, extend=False,
              glows=[(560, 760, 640, 420, 0.30), (1000, 330, 380, 300, 0.12), (1500, 560, 520, 520, 0.06)],
              pts=[(-30, 742), (64, 790), (150, 716), (206, 748), (290, 676), (372, 706), (430, 630),
                   (486, 670), (560, 660), (640, 576), (690, 616), (790, 510), (838, 550), (910, 462),
                   (952, 492), (1030, 372), (1066, 400), (1150, 250)],
              dot=(1150, 250, 17),
              text=[("+$11,512,788", "arial-black", 121, 56, 196, "ls"), ("2028", "arial-black", 190, 50, 1000, "ls")]),
}
# the same two arrangements with MORE green on him (the light he asked for, pushed further)
TAKE["C"] = {**TAKE["A"], "light": dict(wash=0.64, rim=0.85, gold_keep=0.68)}
TAKE["D"] = {**TAKE["B"], "light": dict(wash=0.64, rim=0.85, gold_keep=0.68)}


def build(name, cfg, **over_cfg):
    cfg = {**cfg, **over_cfg}
    rgb, a = load_cut()
    if cfg.get("extend"):
        rgb, a = extend_shoulder(rgb, a)
    rgb = relight(rgb, a, cfg["side"], **cfg.get("light", {}))
    s = cfg["scale"]
    ph, pw = a.shape
    nw, nh = int(round(pw * s)), int(round(ph * s))
    prem = cv2.resize(np.dstack([rgb * a[..., None], a]), (nw, nh), interpolation=cv2.INTER_AREA)
    ox = int(round(cfg["face_x"] - 985 * s))                 # 985 = the face's centre line in the cut
    oy = int(round(cfg["hair_top"] - 30 * s))                # 30 = the top of his hair in the cut
    person = np.zeros((H, W, 4), np.float32)
    x0, y0 = max(ox, 0), max(oy, 0)
    x1, y1 = min(ox + nw, W), min(oy + nh, H)
    person[y0:y1, x0:x1] = prem[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    pa = person[..., 3]

    img = background(cfg["glows"])
    line, glow, under = chart_layers(cfg["pts"], dot=cfg.get("dot"))
    img = img + under[..., None] * GREEN[None, None, :] + glow[..., None] * GREEN[None, None, :] * 0.62
    img = over(img, np.broadcast_to(GREEN, (H, W, 3)), line)
    core = cv2.erode(line, np.ones((5, 5), np.uint8))        # a lighter core, so the line reads as lit
    img = over(img, np.broadcast_to(np.array([150, 255, 165], np.float32), (H, W, 3)), core * 0.35)
    # the green glow behind him (where the plate had a golden outline), stronger on the chart side
    halo = cv2.GaussianBlur(pa, (0, 0), 16) * 0.50 + cv2.GaussianBlur(pa, (0, 0), 46) * 0.42
    ramp = np.linspace(0.45, 1.0, W, dtype=np.float32)[None, :]
    if cfg["side"] == "left":
        ramp = ramp[:, ::-1]
    img = img + (halo * ramp * (1 - pa))[..., None] * GREEN[None, None, :] * 0.55
    # a soft contact shadow so he does not float on the grid
    img = img * (1 - 0.35 * cv2.GaussianBlur(pa, (0, 0), 6) * (1 - pa))[..., None]
    img = img * (1 - pa[..., None]) + person[..., :3] * 255.0
    img, boxes = words(img, cfg["text"])

    out = Image.fromarray(np.clip(img + 0.5, 0, 255).astype(np.uint8), "RGB")
    TAKES.mkdir(exist_ok=True)
    out.save(TAKES / f"take-{name}.png")
    q = 94
    while True:
        out.save(TAKES / f"take-{name}-1920.jpg", quality=q, subsampling=0)
        if (TAKES / f"take-{name}-1920.jpg").stat().st_size < 1_900_000 or q < 80:
            break
        q -= 3
    print(f"take {name}: words at {[tuple(round(v) for v in b) for b in boxes]}  jpg q{q} "
          f"{(TAKES / f'take-{name}-1920.jpg').stat().st_size // 1024} KB")
    return out


def sheet(names):
    order = [n for n in ("A", "C", "B", "D") if n in names] + [n for n in names if n not in "ACBD"]
    f = ImageFont.truetype(r"C:/Windows/Fonts/arialbd.ttf", 30)
    rows = (len(order) + 1) // 2
    sh = Image.new("RGB", (960 * 2 + 12, 540 * rows + 12 * (rows - 1)), (60, 60, 60))
    for i, n in enumerate(order):
        im = Image.open(TAKES / f"take-{n}.png").resize((960, 540), Image.LANCZOS)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 64, 46], fill=(0, 0, 0))
        d.text((18, 6), n, font=f, fill=(255, 255, 0))
        sh.paste(im, ((i % 2) * 972, (i // 2) * 552))
    sh.save(TAKES / "takes-sheet.jpg", quality=90)


if __name__ == "__main__":
    names = [n for n in sys.argv[1:] if n in TAKE] or list(TAKE)
    for n in names:
        build(n, TAKE[n])
    sheet(sorted(p.stem[5:] for p in TAKES.glob("take-?.png")))
