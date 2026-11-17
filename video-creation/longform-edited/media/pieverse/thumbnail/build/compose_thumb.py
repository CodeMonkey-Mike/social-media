"""pieverse thumbnail, step 2: compose in CODE, the canton template (2026-11-10, published youtu.be/hQN19dTqggU,
thumbnail/refs/canton-ref.jpg): Mike's REAL frame on the right, only scaled and placed (no AI, no matte, no key; pixel
filters at the "natural" level he picked on canton: a light CLAHE blend, a little warmth against the teal room light,
saturation 1.12, a two-radius unsharp mask), the room darkened by a face-centred vignette and faded into the brand page
by a left ramp. On the left: the real Pieverse mark (CoinGecko's file, untouched pixels, on a white coin badge), the
REAL price line from launch to the record day (research/coingecko-market-chart-daily-merged-2026-11-14.json, drawn from
the data, never from an image model) and two lines of Montserrat Black Italic.

    python compose_thumb.py <frame.png> <out.png> --line1 "I DID THE" --line2 "HOMEWORK" [--accent 255,196,46]
        [--scale 1.62] [--hair-top 55] [--hair-right 30]
"""
import argparse
import json
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
PROJ = THUMB.parent
FONT_I = Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/fonts/Montserrat-Italic-VF.ttf")
MODEL = Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/mediapipe/face_landmarker.task")
LOGO = THUMB / "refs" / "pieverse-logo-coingecko.png"
SERIES = PROJ / "research" / "coingecko-market-chart-daily-merged-2026-11-14.json"
W, H = 1920, 1080


def font(size, weight=900):
    f = ImageFont.truetype(str(FONT_I), size)
    f.set_variation_by_axes([weight])
    return f


def face_box(bgr):
    """(x0, y0, x1, y1) of the face mesh in source pixels."""
    opts = mp.tasks.vision.FaceLandmarkerOptions(base_options=mp.tasks.BaseOptions(model_asset_path=str(MODEL)), num_faces=1)
    with mp.tasks.vision.FaceLandmarker.create_from_options(opts) as det:
        res = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)))
    pts = np.array([(p.x, p.y) for p in res.face_landmarks[0]])
    h, w = bgr.shape[:2]
    return pts[:, 0].min() * w, pts[:, 1].min() * h, pts[:, 0].max() * w, pts[:, 1].max() * h


def hair_bounds(bgr, box):
    """Top and right edge of his dark hair against the bright wall, in source pixels (measured, not guessed)."""
    x0, y0, x1, y1 = box
    fw, fh = x1 - x0, y1 - y0
    g = cv2.GaussianBlur(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY), (0, 0), 3)
    dark = g < 70
    # top: first row above the forehead where the band over the face centre turns dark
    xa, xb = int(x0 + 0.25 * fw), int(x1 - 0.25 * fw)
    top = int(y0)
    for y in range(int(y0), max(0, int(y0 - 0.9 * fh)), -1):
        if dark[y, xa:xb].mean() > 0.25:
            top = y
        elif top < y0 - 0.05 * fh and dark[y, xa:xb].mean() < 0.05:
            break
    # right: last column right of the face (eye to mouth rows) that is still mostly dark hair
    ya, yb = int(y0 + 0.15 * fh), int(y0 + 0.75 * fh)
    right = int(x1)
    for x in range(int(x1), min(bgr.shape[1] - 1, int(x1 + 0.38 * fw))):   # capped: the dark door stands further right
        if dark[ya:yb, x].mean() > 0.25:
            right = x
        elif right > x1 + 0.05 * fw and dark[ya:yb, x].mean() < 0.12:
            break
    return top, right


def finish(bgr):
    """Pixel filters only, the natural level: no feature is moved, drawn or generated."""
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    l8 = lab[:, :, 0].astype(np.uint8)
    eq = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4, 4)).apply(l8).astype(np.float32)
    lab[:, :, 0] = lab[:, :, 0] * 0.72 + eq * 0.28
    lab[:, :, 1] = (lab[:, :, 1] - 128) * 1.12 + 128 + 1.5          # saturation 1.12 + a touch of warmth
    lab[:, :, 2] = (lab[:, :, 2] - 128) * 1.12 + 128 + 3.0
    out = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
    out = out + 0.40 * (out - cv2.GaussianBlur(out, (0, 0), 1.3)) + 0.16 * (out - cv2.GaussianBlur(out, (0, 0), 4.0))
    return np.clip(out, 0, 255).astype(np.uint8)


def page():
    """The dark brand page: near-black navy with a soft blue lift top-left (the canton page, Pieverse has no accent)."""
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x - 260) / 1100) ** 2 + ((y - 120) / 800) ** 2)
    lift = np.clip(1 - d, 0, 1) ** 1.6
    base = np.array([6, 7, 16], np.float32)
    glow = np.array([22, 26, 96], np.float32)
    return (base[None, None, :] + lift[:, :, None] * glow[None, None, :]).clip(0, 255).astype(np.uint8)


def price_points(box):
    x0, y0, x1, y1 = box
    d = json.loads(SERIES.read_text(encoding="utf-8"))
    prices = [float(r["price_usd"]) for r in d["daily"]]             # one CoinGecko 00:00 UTC print a day, in order
    pmax, n = max(prices), len(prices) - 1
    return [(x0 + i / n * (x1 - x0), y1 - (p / pmax) * (y1 - y0)) for i, p in enumerate(prices)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("frame")
    ap.add_argument("out")
    ap.add_argument("--line1", default="I DID THE")
    ap.add_argument("--line2", default="HOMEWORK")
    ap.add_argument("--accent", default="255,196,46")
    ap.add_argument("--scale", type=float, default=1.62)
    ap.add_argument("--hair-top", type=int, default=55)
    ap.add_argument("--hair-right", type=int, default=30)
    ap.add_argument("--plate", default=None,
                    help="a finished full-frame picture of Mike on a plain dark background (an outfit edit of an earlier "
                         "thumbnail, Mike 2026-11-14): used as the whole background; the frame argument is ignored (pass -)")
    ap.add_argument("--max-w", type=int, default=880, help="the widest the words may run, px")
    a = ap.parse_args()
    acc = tuple(int(v) for v in a.accent.split(","))
    if a.plate:
        # Mike stands on the right of the plate, so any width trimmed to reach 16:9 comes off the left
        p = Image.open(a.plate).convert("RGB")
        k = max(W / p.width, H / p.height)
        p = p.resize((round(p.width * k), round(p.height * k)), Image.LANCZOS)
        top = (p.height - H) // 2
        canvas = p.crop((p.width - W, top, p.width, top + H)).convert("RGBA")
    else:
        canvas = from_frame(a)
    draw_left_and_save(canvas, a, acc)


def from_frame(a):
    """Mike's REAL frame, scaled and placed, the room darkened and faded into the page (the canton template)."""
    src = cv2.imread(a.frame)
    box = face_box(src)
    top, right = hair_bounds(src, box)
    s = a.scale
    big = finish(cv2.resize(src, None, fx=s, fy=s, interpolation=cv2.INTER_LANCZOS4))
    ox, oy = int(round(W - a.hair_right - right * s)), int(round(a.hair_top - top * s))
    fx0, fy0, fx1, fy1 = (box[0] * s + ox, box[1] * s + oy, box[2] * s + ox, box[3] * s + oy)
    fcx, fcy, fw, fh = (fx0 + fx1) / 2, (fy0 + fy1) / 2, fx1 - fx0, fy1 - fy0
    print(f"face {box[2] - box[0]:.0f}x{box[3] - box[1]:.0f} px in the source, hair top {top}, hair right {right}; "
          f"scale {s} -> face {fw:.0f}x{fh:.0f} at ({fcx:.0f},{fcy:.0f}), offset ({ox},{oy})")

    layer = np.zeros((H, W, 3), np.uint8)
    sy0, sx0 = max(0, -oy), max(0, -ox)
    dy0, dx0 = max(0, oy), max(0, ox)
    hh, ww = min(big.shape[0] - sy0, H - dy0), min(big.shape[1] - sx0, W - dx0)
    layer[dy0:dy0 + hh, dx0:dx0 + ww] = big[sy0:sy0 + hh, sx0:sx0 + ww]
    covered = np.zeros((H, W), np.float32)
    covered[dy0:dy0 + hh, dx0:dx0 + ww] = 1.0

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # the room darkens away from the face (a vignette, never a matte: every pixel is still his frame)
    d = np.sqrt(((xx - fcx) / (fw * 1.05)) ** 2 + ((yy - fcy) / (fh * 0.95)) ** 2)
    vig = 1.0 - 0.80 * np.clip((d - 0.62) / 0.85, 0, 1) ** 1.2
    # the left ramp into the page
    hair_left = fx0 - 0.42 * fw
    ramp = np.clip((xx - (hair_left - 230)) / 220, 0, 1)
    ramp = ramp * ramp * (3 - 2 * ramp)
    alpha = cv2.GaussianBlur(ramp * covered, (0, 0), 6)
    bg = page().astype(np.float32)[:, :, ::-1]                      # RGB -> BGR
    comp = bg * (1 - alpha[:, :, None]) + layer.astype(np.float32) * vig[:, :, None] * alpha[:, :, None]
    return Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8)[:, :, ::-1]).convert("RGBA")


def draw_left_and_save(canvas, a, acc):
    # ── the left page: grid, the real price line, the badge, the words ─────────────────────────────────────────
    box_c = (70, 175, 880, 700)
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(g)
    for i in range(5):
        y = box_c[1] + i * (box_c[3] - box_c[1]) / 4
        gd.line([(box_c[0], y), (box_c[2], y)], fill=(255, 255, 255, 26), width=2)
    canvas = Image.alpha_composite(canvas, g)

    pts = price_points(box_c)
    area = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(area).polygon(pts + [(box_c[2], box_c[3]), (box_c[0], box_c[3])], fill=acc + (38,))
    fade = np.clip((np.arange(H, dtype=np.float32) - box_c[1]) / (box_c[3] - box_c[1]), 0, 1)
    aa = np.array(area).astype(np.float32)
    aa[:, :, 3] *= (1 - fade)[:, None] * 0.9 + 0.1
    aa[:, :, 3] *= np.clip((box_c[2] - np.arange(W, dtype=np.float32)) / 170, 0, 1)[None, :]   # no hard edge at the chart's right end
    canvas = Image.alpha_composite(canvas, Image.fromarray(aa.astype(np.uint8)))
    line = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(line).line(pts, fill=acc + (255,), width=7, joint="curve")
    canvas = Image.alpha_composite(canvas, line.filter(ImageFilter.GaussianBlur(14)))
    canvas = Image.alpha_composite(canvas, line)
    ex, ey = pts[-1]
    dot = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(dot).ellipse([ex - 15, ey - 15, ex + 15, ey + 15], fill=(255, 255, 255, 255))
    canvas = Image.alpha_composite(canvas, dot.filter(ImageFilter.GaussianBlur(16)))
    canvas = Image.alpha_composite(canvas, dot)

    # the badge: the real mark, on a white coin (CoinGecko's own presentation of it), a soft accent halo behind
    bc, br = (285, 290), 140
    halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse([bc[0] - br - 14, bc[1] - br - 14, bc[0] + br + 14, bc[1] + br + 14], fill=acc + (150,))
    canvas = Image.alpha_composite(canvas, halo.filter(ImageFilter.GaussianBlur(34)))
    mark = Image.open(LOGO).convert("L").resize((br * 2, br * 2), Image.LANCZOS)
    mark = mark.point(lambda v: 0 if v < 96 else 255 if v > 160 else int((v - 96) * 255 / 64))   # crisp 2-tone edges
    disc = Image.new("L", (br * 2, br * 2), 0)
    ImageDraw.Draw(disc).ellipse([0, 0, br * 2 - 1, br * 2 - 1], fill=255)
    badge = Image.merge("RGBA", (mark, mark, mark, disc))
    canvas.alpha_composite(badge, (bc[0] - br, bc[1] - br))

    # the words: line 2 fits the left half, line 1 sits on it (the canton rhythm)
    d = ImageDraw.Draw(canvas)
    left, max_w, bottom = 68, a.max_w, 1012
    size2 = 230
    while size2 > 90 and d.textbbox((0, 0), a.line2, font=font(size2))[2] > max_w:
        size2 -= 2
    f2 = font(size2)
    b2 = d.textbbox((0, 0), a.line2, font=f2)
    y2 = bottom - b2[3]
    size1 = int(min(124, max(84, size2 * 0.62)))
    while size1 > 60 and d.textbbox((0, 0), a.line1, font=font(size1))[2] > max_w:
        size1 -= 2
    f1 = font(size1)
    b1 = d.textbbox((0, 0), a.line1, font=f1)
    y1 = y2 + b2[1] - 22 - b1[3]
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text((left, y1 + 6), a.line1, font=f1, fill=(0, 0, 0, 230))
    sd.text((left, y2 + 6), a.line2, font=f2, fill=(0, 0, 0, 230))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(12)))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).text((left, y2), a.line2, font=f2, fill=acc + (150,))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(22)))
    d = ImageDraw.Draw(canvas)
    d.text((left, y1), a.line1, font=f1, fill=(255, 255, 255, 255))
    d.text((left, y2), a.line2, font=f2, fill=acc + (255,))

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    rgb = canvas.convert("RGB")
    rgb.save(out)
    q = 92
    jpg = out.with_name(out.stem + "-1920.jpg")
    while True:
        rgb.save(jpg, quality=q, optimize=True)
        if jpg.stat().st_size < 1_950_000 or q <= 70:
            break
        q -= 3
    print(f"WROTE {out} + {jpg.name} ({jpg.stat().st_size / 1e6:.2f} MB, q{q}); line2 size {size2}, line1 size {size1}")


if __name__ == "__main__":
    main()
