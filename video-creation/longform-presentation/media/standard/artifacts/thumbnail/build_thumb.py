"""artifacts thumbnail: paint the old banners out of take C in code, then set 3 straight yellow blocks.

The face is never regenerated: only pixels inside the old banners + their glow change.
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
SRC = HERE / "takes" / "take-c.png"
LINES = ["Software", "Engineers", "Beware"]
YELLOW = (255, 240, 0)
LEFT = 60          # px at 2752 wide
MAX_RIGHT = 1255   # Mike's hair starts just right of this at the middle line
GAP = 26


def plate():
    bgr = cv2.imread(str(SRC))
    h, w = bgr.shape[:2]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    yellow = cv2.inRange(hsv, (20, 140, 170), (36, 255, 255))
    yellow[:, 1500:] = 0
    n, lab, stats, _ = cv2.connectedComponentsWithStats(yellow)
    hull = np.zeros((h, w), "uint8")
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 3000:
            pts = cv2.findNonZero((lab == i).astype("uint8"))
            cv2.fillConvexPoly(hull, cv2.convexHull(pts), 255)
    kern = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))

    # The bottom banner hides a corner of the sweater: clone the knit from below the shoulder line.
    yy, xx = np.mgrid[0:h, 0:w]
    shoulder_y = 1138 + (xx - 1201) * (988 - 1138) / (1441 - 1201)
    below = yy > shoulder_y
    sweater = (cv2.dilate(hull, kern(34)) > 0) & below
    src = np.roll(bgr, (-190, -60), axis=(0, 1))  # each pixel samples knit further down the shoulder
    soft = cv2.GaussianBlur(sweater.astype("float32"), (0, 0), 2.5)[..., None]
    out = (bgr * (1 - soft) + src * soft).astype("uint8")

    # Everything else inside the banner + glow is blue wall: harmonic fill from the boundary.
    blue = (hsv[..., 0] > 90) & (hsv[..., 0] < 130) & (hsv[..., 1] > 50)
    fill = (cv2.dilate(hull, kern(30)) > 0) | ((cv2.dilate(hull, kern(62)) > 0) & blue)
    fill &= ~below
    small = cv2.resize(out, (w // 4, h // 4), interpolation=cv2.INTER_AREA).astype("float32")
    m = cv2.resize(fill.astype("uint8"), (w // 4, h // 4), interpolation=cv2.INTER_NEAREST) > 0
    m = cv2.dilate(m.astype("uint8"), kern(1)) > 0
    # Hair and sweater next to the fill must not feed it (dark smudges): solve over them too, wall pixels only as boundary.
    wall = cv2.resize(blue.astype("uint8"), (w // 4, h // 4), interpolation=cv2.INTER_NEAREST) > 0
    m_keep = m.copy()
    m = m | ((cv2.dilate(m.astype("uint8"), kern(40)) > 0) & ~cv2.erode(wall.astype("uint8"), kern(2)).astype(bool))
    # Seed with the wall's median so the solve converges quickly.
    small[m] = np.median(small[~m & (np.arange(w // 4)[None, :] < 300)], axis=0)
    for _ in range(4000):
        avg = (np.roll(small, 1, 0) + np.roll(small, -1, 0) + np.roll(small, 1, 1) + np.roll(small, -1, 1)) / 4
        small[m] = avg[m]
    filled = cv2.GaussianBlur(cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 3)

    # Put back the wall's own grain so the fill does not read as an airbrushed patch.
    patch = bgr[1200:1500, 60:760].astype("float32")
    grain = patch - cv2.GaussianBlur(patch, (0, 0), 6)
    tiled = np.tile(grain, (h // grain.shape[0] + 1, w // grain.shape[1] + 1, 1))[:h, :w]
    a = cv2.GaussianBlur(fill.astype("float32"), (0, 0), 4)[..., None]
    a = np.maximum(a, fill[..., None].astype("float32"))
    res = out * (1 - a) + (filled + tiled) * a
    return Image.fromarray(cv2.cvtColor(np.clip(res, 0, 255).astype("uint8"), cv2.COLOR_BGR2RGB))


def compose(base, font_path, name, pad_x=44, pad_y=30):
    w, h = base.size
    d0 = ImageDraw.Draw(base)
    size = 100
    while True:  # the widest word fixes the size
        f = ImageFont.truetype(font_path, size + 2)
        widest = max(d0.textbbox((0, 0), t, font=f)[2] - d0.textbbox((0, 0), t, font=f)[0] for t in LINES)
        if LEFT + widest + 2 * pad_x > MAX_RIGHT:
            break
        size += 2
    f = ImageFont.truetype(font_path, size)
    boxes = [d0.textbbox((0, 0), t, font=f) for t in LINES]
    # One height for every block, from the tallest ink (the g of Engineers), so the stack reads even.
    top, bot = min(b[1] for b in boxes), max(b[3] for b in boxes)
    bh = bot - top + 2 * pad_y
    total = 3 * bh + 2 * GAP
    y = (h - total) // 2
    shadow = Image.new("L", base.size, 0)
    sd = ImageDraw.Draw(shadow)
    rects = []
    for t, b in zip(LINES, boxes):
        rect = (LEFT, y, LEFT + (b[2] - b[0]) + 2 * pad_x, y + bh)
        rects.append((t, b, rect))
        sd.rectangle((rect[0] + 8, rect[1] + 10, rect[2] + 8, rect[3] + 10), fill=150)
        y += bh + GAP
    img = base.copy()
    img.paste((0, 0, 0), mask=shadow.filter(ImageFilter.GaussianBlur(12)))
    d = ImageDraw.Draw(img)
    for t, b, rect in rects:
        d.rectangle(rect, fill=YELLOW)
        d.text((rect[0] + pad_x - b[0], rect[1] + pad_y - top), t, font=f, fill="black")
    print(name, "font size", size, "block height", bh, "rects", [r[2] for r in rects])
    img.save(HERE / "takes" / f"{name}.png")
    # Exact 16:9 at 1920x1080 under YouTube's 2 MB cap.
    tw = int(h * 16 / 9)
    x0 = (w - tw) // 2
    img.crop((x0, 0, x0 + tw, h)).resize((1920, 1080), Image.LANCZOS).convert("RGB").save(
        HERE / "takes" / f"{name}-1920.jpg", quality=94, subsampling=0
    )


if __name__ == "__main__":
    p = plate()
    p.save(HERE / "takes" / "plate-c.png")
    compose(p, "C:/Windows/Fonts/impact.ttf", "c-impact")
    compose(p, "C:/Windows/Fonts/ariblk.ttf", "c-arialblack")
