"""longest-bear thumbnail "BTC going parabolic in January" (2026-11-25; lives in this video's folder). Mike: "like with my image here" (Wf-5-UoAr4E, the
plan-to-make-millions thumbnail: his portrait, green light, dark grid) "but the green candles here" (AXFQBOWPfMw, "My
Plays Are Ripping": glowing candlesticks). Composed in code, no image model.

assets/mike-cut.png = his cut-out portrait from that thumbnail's build (copied in: project folders are deleted after
publish). The green relight and the grid are the same pixel filters as that build (no feature is moved or redrawn).
    python build.py   ->  take-A.jpg (white headline), take-B.jpg (PARABOLIC in green)
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
W, H = 1920, 1080
SS = 2
GREEN = np.array([38, 232, 74], np.float32)
RED = np.array([255, 58, 44], np.float32)
GREEN_LIGHT = np.array([0.30, 1.00, 0.42], np.float32)
IMPACT = r"C:/Windows/Fonts/impact.ttf"
BODY_Y = 1010


# ---------------------------------------------------------------- portrait (the 2028 thumbnail's relight)
def load_cut():
    c = np.asarray(Image.open(HERE / "assets" / "mike-cut.png")).astype(np.float32) / 255.0
    return c[..., :3].copy(), np.clip((c[..., 3] - 0.10) / 0.90, 0, 1) ** 1.25


def hsv_shift(rgb, gold_keep, teal_to):
    hsv = cv2.cvtColor(np.clip(rgb, 0, 1), cv2.COLOR_RGB2HSV)
    hh, ss, vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    warm = np.clip((hh + 12) / 12, 0, 1) * np.clip((58 - hh) / 14, 0, 1)
    warm = np.where(hh > 340, 1.0, warm)
    ss2 = ss * (1 - warm * (1 - gold_keep))
    hh2 = np.where(warm > 0, hh - 4.0 * warm * (hh < 180), hh)
    hh2 = np.where(hh2 < 0, hh2 + 360, hh2)
    teal = np.clip((hh - 132) / 16, 0, 1) * np.clip((206 - hh) / 18, 0, 1) * np.clip(ss / 0.10, 0, 1)
    hh2 = hh2 * (1 - teal) + teal_to * teal
    ss2 = np.clip(ss2 * (1 + 0.22 * teal), 0, 1)
    vv2 = np.clip(vv * (1 + 0.05 * teal), 0, 1)
    return cv2.cvtColor(np.dstack([hh2, ss2, vv2]).astype(np.float32), cv2.COLOR_HSV2RGB)


def relight(rgb, a, wash=0.50, rim=0.68, gold_keep=0.70):
    """Green light from the LEFT, where the candles are."""
    h = a.shape[0]
    out = hsv_shift(rgb, gold_keep, teal_to=128.0)
    lum = (out * np.array([0.30, 0.59, 0.11], np.float32)).sum(-1)
    soft = cv2.GaussianBlur(a, (0, 0), 28)
    gx, gy = cv2.Sobel(soft, cv2.CV_32F, 1, 0, ksize=5), cv2.Sobel(soft, cv2.CV_32F, 0, 1, ksize=5)
    mag = np.sqrt(gx * gx + gy * gy) + 1e-6
    facing = np.clip((-gx / mag) * -0.95 + (-gy / mag) * -0.30, 0, 1)
    inside = cv2.distanceTransform((a > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    band = np.clip(1 - inside / 190.0, 0, 1) ** 1.6 * cv2.GaussianBlur(facing, (0, 0), 14)
    body = np.clip((np.arange(h, dtype=np.float32)[:, None] - BODY_Y) / 90.0, 0, 1)
    band = band * (1 - 0.80 * body)
    k = (wash * band)[..., None]
    out = out * (1 - k) + lum[..., None] * GREEN_LIGHT[None, None, :] * 1.75 * k
    edge = np.clip(1 - inside / 34.0, 0, 1) ** 1.3 * cv2.GaussianBlur(facing, (0, 0), 6) * (1 - 0.45 * body)
    out = out + (rim * edge * (0.25 + 0.9 * lum))[..., None] * GREEN_LIGHT[None, None, :]
    out *= np.array([0.955, 1.0, 0.965], np.float32)
    fr = np.clip((0.75 - a) / 0.75, 0, 1)[..., None] * 0.65
    out = out * (1 - fr) + (0.35 + lum[..., None]) * GREEN_LIGHT[None, None, :] * 0.8 * fr
    hsv = cv2.cvtColor(np.clip(out, 0, 1), cv2.COLOR_RGB2HSV)
    greenish = np.clip((hsv[..., 0] - 80) / 20, 0, 1) * np.clip((175 - hsv[..., 0]) / 20, 0, 1)
    hsv[..., 1] *= 1 - 0.55 * greenish * body
    return np.clip(cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB), 0, 1)


def background():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    bg = np.empty((H, W, 3), np.float32)
    t = yy / H
    bg[..., 0], bg[..., 1], bg[..., 2] = 9 + 5 * t, 13 + 8 * t, 12 + 6 * t
    for cx, cy, rx, ry, amt in ((520, 820, 700, 430, 0.26), (1090, 330, 330, 420, 0.17), (1520, 560, 520, 520, 0.06)):
        bg += np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))[..., None] * (GREEN * amt)[None, None, :]
    grid = np.zeros((H, W), np.float32)
    for x in range(36, W, 72):
        grid[:, x:x + 2] = 1
    for y in range(36, H, 72):
        grid[y:y + 2, :] = 1
    bg += grid[..., None] * (9.0 + 0.16 * bg.mean(-1, keepdims=True)) * np.array([0.85, 1.0, 0.9], np.float32)
    vig = 1 - 0.38 * np.clip((((xx - W / 2) / (W * 0.72)) ** 2 + ((yy - H / 2) / (H * 0.78)) ** 2), 0, 1.6)
    return np.clip(bg * vig[..., None], 0, 255)


# ---------------------------------------------------------------- candles
# (centre x, open y, close y, high y, low y): screen y, so close < open = green. A slow base that turns vertical.
CANDLES = [   # the climb stays under the headline, then turns vertical in the gap between the words and his hair
    (46, 1056, 1024, 1004, 1070), (112, 1028, 1000, 980, 1044), (178, 1000, 1016, 978, 1036), (244, 1012, 976, 958, 1030),
    (310, 980, 950, 930, 996), (376, 952, 968, 930, 990), (442, 964, 928, 910, 978), (508, 930, 900, 882, 948),
    (574, 904, 918, 880, 942), (640, 910, 872, 852, 926), (706, 874, 836, 816, 892), (772, 840, 856, 818, 876),
    (838, 850, 804, 784, 864), (904, 806, 762, 738, 824), (980, 764, 712, 692, 786),
    (1094, 716, 436, 404, 744), (1180, 442, 30, -30, 476),
]


def candles():
    """(RGBA colour layer, alpha, glow RGB) of the glowing candlesticks, drawn at SS x."""
    col = np.zeros((H, W, 3), np.float32)
    alpha = np.zeros((H, W), np.float32)
    glow = np.zeros((H, W, 3), np.float32)
    for i, (x, o, c, hi, lo) in enumerate(CANDLES):
        colour = GREEN if c < o else RED
        bw = 40 if i < 14 else (48, 68, 76)[i - 14]
        top, bot = min(o, c), max(o, c)
        body = Image.new("L", (W * SS, H * SS), 0)
        edge = Image.new("L", (W * SS, H * SS), 0)
        d, e = ImageDraw.Draw(body), ImageDraw.Draw(edge)
        box = [(x - bw / 2) * SS, top * SS, (x + bw / 2) * SS, bot * SS]
        d.rounded_rectangle(box, radius=5 * SS, fill=255)
        e.rounded_rectangle(box, radius=5 * SS, outline=255, width=4 * SS)
        for y0, y1 in ((hi, top), (bot, lo)):
            e.line([(x * SS, y0 * SS), (x * SS, y1 * SS)], fill=255, width=5 * SS)
        b = np.asarray(body.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
        ed = np.asarray(edge.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
        # glassy body: brighter in the middle column, a lit rim and wicks
        xx = np.arange(W, dtype=np.float32)[None, :]
        shine = 0.62 + 0.38 * np.exp(-((xx - x) / (bw * 0.28)) ** 2)
        layer = colour[None, None, :] * shine[..., None]
        lit = np.minimum(colour * 0.35 + 165, 255)
        a = np.clip(b * 0.90, 0, 1)
        col = col * (1 - a[..., None]) + layer * a[..., None]
        col = col * (1 - ed[..., None]) + lit[None, None, :] * ed[..., None]
        alpha = alpha + np.maximum(a, ed) * (1 - alpha)
        m = np.maximum(b, ed)
        strength = 1.0 if i < 14 else 1.35
        g = cv2.GaussianBlur(m, (0, 0), 9) * 0.55 + cv2.GaussianBlur(m, (0, 0), 28) * 0.55 + cv2.GaussianBlur(m, (0, 0), 70) * 0.45
        glow += g[..., None] * colour[None, None, :] * 0.62 * strength
    return col, alpha, glow


def sparks(img, rng):
    """Embers thrown off the climb, like the streaks around the source candles."""
    m = np.zeros((H, W), np.float32)
    for _ in range(420):
        x = rng.uniform(0, 1240)
        base = np.interp(x, [c[0] for c in CANDLES], [(c[1] + c[2]) / 2 for c in CANDLES])
        y = base + rng.normal(0, 90)
        if 0 <= y < H - 2:
            cv2.circle(m, (int(x), int(y)), int(rng.integers(1, 3)), float(rng.uniform(0.35, 1.0)), -1, cv2.LINE_AA)
    glow = cv2.GaussianBlur(m, (0, 0), 5) * 2.2 + m
    return img + glow[..., None] * np.array([120, 255, 120], np.float32) * 0.45


# ---------------------------------------------------------------- headline
def headline(img, lines):
    """lines = [(text, colour)]: Impact, one idea per line, top left, a dark pad and a drop shadow."""
    maxw, x, y = 1010, 52, 28
    size = 400
    while max(ImageFont.truetype(IMPACT, size).getlength(t) for t, _ in lines) > maxw:
        size -= 2
    step = int(size * 0.98)
    masks = []
    for k, (text, colour) in enumerate(lines):
        big = Image.new("L", (W * SS, H * SS), 0)
        ImageDraw.Draw(big).text((x * SS, (y + k * step) * SS), text, font=ImageFont.truetype(IMPACT, size * SS), fill=255)
        masks.append((np.asarray(big.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255, np.array(colour, np.float32)))
    m = np.clip(sum(mk for mk, _ in masks), 0, 1)
    outline = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
    shadow = cv2.GaussianBlur(np.roll(outline, 10, axis=0), (0, 0), 10) * 0.85
    pad = cv2.GaussianBlur(m, (0, 0), 34) * 0.62
    img = img * (1 - np.clip(shadow + pad, 0, 0.9)[..., None])
    img = img * (1 - outline[..., None]) + np.array([6, 12, 8], np.float32) * outline[..., None]
    for mk, colour in masks:
        img = img * (1 - mk[..., None]) + colour * mk[..., None]
    ys = np.where(m.max(1) > 0.5)[0]
    xs = np.where(m.max(0) > 0.5)[0]
    print(f"  headline size {size}px, box x {xs.min()}-{xs.max()}  y {ys.min()}-{ys.max()}")
    return img


def build(name, lines):
    rgb, a = load_cut()
    rgb = relight(rgb, a)
    s, face_x, hair_top = 0.748, 1535, 62
    ph, pw = a.shape
    nw, nh = int(round(pw * s)), int(round(ph * s))
    prem = cv2.resize(np.dstack([rgb * a[..., None], a]), (nw, nh), interpolation=cv2.INTER_AREA)
    ox, oy = int(round(face_x - 985 * s)), int(round(hair_top - 30 * s))
    person = np.zeros((H, W, 4), np.float32)
    x0, y0, x1, y1 = max(ox, 0), max(oy, 0), min(ox + nw, W), min(oy + nh, H)
    person[y0:y1, x0:x1] = prem[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    pa = person[..., 3]

    img = background()
    col, al, glow = candles()
    img = img + glow
    img = img * (1 - al[..., None]) + col * al[..., None]
    img = sparks(img, np.random.default_rng(11))
    halo = cv2.GaussianBlur(pa, (0, 0), 16) * 0.50 + cv2.GaussianBlur(pa, (0, 0), 46) * 0.42
    ramp = np.linspace(1.0, 0.45, W, dtype=np.float32)[None, :]
    img = img + (halo * ramp * (1 - pa))[..., None] * GREEN * 0.55
    img = img * (1 - 0.35 * cv2.GaussianBlur(pa, (0, 0), 6) * (1 - pa))[..., None]
    img = img * (1 - pa[..., None]) + person[..., :3] * 255.0
    img = headline(img, lines)
    out = Image.fromarray(np.clip(img + 0.5, 0, 255).astype(np.uint8), "RGB")
    dst = HERE / f"take-{name}.jpg"
    out.save(dst, quality=94, subsampling=0)
    print(f"take {name} -> {dst} ({dst.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    WHITE, LIME = (255, 255, 255), (70, 255, 100)
    build("A", [("BTC GOING", WHITE), ("PARABOLIC", WHITE), ("IN JANUARY", WHITE)])
    build("B", [("BTC GOING", WHITE), ("PARABOLIC", LIME), ("IN JANUARY", WHITE)])
