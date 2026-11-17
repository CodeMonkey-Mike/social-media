"""compose_thumb.py: the "No More Software Engineers" thumbnail, rebuilt in CODE from Mike's PUBLISHED thumbnail
(youtu.be/dKX0Ktn9xiY, "Software Engineers Beware"; ref/maxresdefault.jpg, 1280x720).

The face, hair, room and blue gradient are the reference's OWN pixels, never regenerated (Mike's rule: no AI on his
face). Only the three yellow banners change:
  1. the old banners are painted out with a boundary-anchored HARMONIC fill (Laplace, solved at half resolution) + grain
     matched to the surrounding blue, margins kept clear of the hair;
  2. the plate is upscaled to 1920x1080 (Lanczos), and three new banners are drawn at the reference's measured geometry
     (x 24, 143 high, 13 gap, ~24 px side padding, baseline 117 px down; all x1.5), each hugging its own line, Roboto Black
     (calibrated against the reference's own "Software" / "Engineers" ink widths, printed below).

Takes:  A = "No More" on a RED block with white letters (the other two lines stay yellow / black)
        B = all three blocks yellow, "No More" in RED letters
Run:    python compose_thumb.py            -> ../takes/take-A-red-block.png/.jpg, take-B-red-letters.png/.jpg + a QA sheet
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import sparse
from scipy.sparse.linalg import spsolve

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
REF = THUMB / "ref" / "maxresdefault.jpg"
FONT = Path(r"C:\Windows\Fonts\impact.ttf")   # Windows system font; the reference's own lettering
TAKES = THUMB / "takes"
TAKES.mkdir(exist_ok=True)

S = 1.5                                  # 1280x720 -> 1920x1080
REF_BLOCKS = [(24, 133, 524, 275), (24, 289, 579, 431), (24, 445, 453, 586)]   # measured on the reference
OLD_MASK = (14, 123, 585, 604)           # x0, y0, x1, y1 (inclusive): blocks + shadow, 5 px clear of the hair on the right
YELLOW = (255, 235, 0)
RED = (228, 32, 43)
WHITE = (255, 255, 255)
BLACK = (10, 10, 10)
PAD_L, PAD_R = 24.3 * S, 24.3 * S        # measured on the reference ink (thresholded): L 23/25/25, R 25/24/24
BLOCK_H = 143 * S
BASELINE = 116.2 * S                     # from the block top: reference ink bottoms sit 26-27 px above the block bottom (143 high)
GAP = 13 * S
LEFT = 24 * S
TOP0 = 133 * S


# ---------- 1. paint the old banners out ----------
def harmonic_fill(img: np.ndarray, box, scale=2) -> np.ndarray:
    x0, y0, x1, y1 = box
    out = img.astype(np.float64).copy()
    h, w = img.shape[:2]
    # work on the crop at 1/scale, with a 6 px ring of known pixels
    cx0, cy0, cx1, cy1 = x0 - 6, y0 - 6, x1 + 7, y1 + 7
    crop = img[cy0:cy1, cx0:cx1].astype(np.float64)
    ch, cw = crop.shape[:2]
    small = np.asarray(Image.fromarray(crop.astype(np.uint8)).resize((cw // scale, ch // scale), Image.BOX)).astype(np.float64)
    sh, sw = small.shape[:2]
    m = np.zeros((sh, sw), bool)
    m[(y0 - cy0) // scale + 1:(y1 - cy0) // scale, (x0 - cx0) // scale + 1:(x1 - cx0) // scale] = True
    idx = -np.ones((sh, sw), int)
    idx[m] = np.arange(m.sum())
    n = m.sum()
    rows, cols, vals = [], [], []
    rhs = np.zeros((n, 3))
    ys, xs = np.where(m)
    for k, (y, x) in enumerate(zip(ys, xs)):
        rows.append(k); cols.append(k); vals.append(4.0)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if m[yy, xx]:
                rows.append(k); cols.append(idx[yy, xx]); vals.append(-1.0)
            else:
                rhs[k] += small[yy, xx]
    A = sparse.csr_matrix((vals, (rows, cols)), shape=(n, n))
    sol = np.stack([spsolve(A.tocsc(), rhs[:, c]) for c in range(3)], axis=1)
    fill_small = small.copy()
    fill_small[m] = sol
    fill = np.asarray(Image.fromarray(np.clip(fill_small, 0, 255).astype(np.uint8)).resize((cw, ch), Image.BICUBIC)).astype(np.float64)
    # grain matched to the blue left margin (high-pass std), added inside the mask only
    ref_patch = img[130:600, 0:12].astype(np.float64)
    blur = np.asarray(Image.fromarray(ref_patch.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float64)
    std = (ref_patch - blur).std(axis=(0, 1))
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 1, fill.shape) * std
    fill = fill + grain
    # feathered alpha so there is no seam
    alpha = np.zeros((ch, cw), np.float64)
    alpha[(y0 - cy0):(y1 - cy0) + 1, (x0 - cx0):(x1 - cx0) + 1] = 1.0
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.0))).astype(np.float64)[..., None] / 255.0
    blended = crop * (1 - alpha) + fill * alpha
    out[cy0:cy1, cx0:cx1] = blended
    return np.clip(out, 0, 255).astype(np.uint8)


# ---------- 2. fonts ----------
def font_at(size: float) -> ImageFont.FreeTypeFont:
    # the reference lettering is IMPACT (identified on a 2x zoom of its "Engineers": condensed, flat-bottomed g, square r)
    return ImageFont.truetype(str(FONT), int(round(size)))


def ink(text, font):
    """the REAL ink box of `text` rendered with anchor 'ls' at the origin (getbbox includes side bearings, which put the
    padding 6-8 px off the reference's): (x0, y0, x1, y1) relative to the pen origin / baseline, ink pixels > 127."""
    pad = 400
    layer = Image.new("L", (pad * 3, pad * 2), 0)
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=255, anchor="ls")
    ys, xs = np.where(np.asarray(layer) > 127)
    return int(xs.min() - pad), int(ys.min() - pad), int(xs.max() + 1 - pad), int(ys.max() + 1 - pad)


def calibrate():
    """size at which 'Software' ink width = the reference's (453 px at 720p); then check 'Engineers' (507) and 'Beware' (381)."""
    probe = font_at(100)
    w100 = {t: ink(t, probe)[2] - ink(t, probe)[0] for t in ("Software", "Engineers", "Beware")}
    h100 = {t: ink(t, probe)[3] - ink(t, probe)[1] for t in ("Software", "Engineers", "Beware")}
    size720 = 100 * 453 / w100["Software"]
    k = size720 / 100
    print(f"calibration: size@720p={size720:.1f}px; predicted ink width x height at 720p:  "
          f"Software {w100['Software'] * k:.0f}x{h100['Software'] * k:.0f} (ref 453x103)  "
          f"Engineers {w100['Engineers'] * k:.0f}x{h100['Engineers'] * k:.0f} (ref 507x113)  "
          f"Beware {w100['Beware'] * k:.0f}x{h100['Beware'] * k:.0f} (ref 381x100)")
    return size720 * S


# ---------- 3. draw ----------
def block(draw_img, text, top, fill, color, font):
    d = ImageDraw.Draw(draw_img)
    x0b, _, x1b, _ = ink(text, font)
    wtxt = x1b - x0b
    left = LEFT
    right = left + PAD_L + wtxt + PAD_R
    rect = (left, top, right, top + BLOCK_H)
    # soft shadow
    sh = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle((rect[0] + 5, rect[1] + 8, rect[2] + 5, rect[3] + 8), fill=(0, 0, 0, 95))
    sh = sh.filter(ImageFilter.GaussianBlur(11))
    draw_img.alpha_composite(sh)
    d = ImageDraw.Draw(draw_img)
    d.rectangle(rect, fill=fill + (255,))
    d.text((left + PAD_L - x0b, top + BASELINE), text, font=font, fill=color + (255,), anchor="ls")
    return rect


def compose(plate: Image.Image, lines, name):
    img = plate.convert("RGBA")
    font = font_at(SIZE)
    rects = []
    for i, (text, fill, color) in enumerate(lines):
        rects.append(block(img, text, TOP0 + i * (BLOCK_H + GAP), fill, color, font))
    rgb = img.convert("RGB")
    rgb.save(TAKES / f"{name}.png")
    rgb.save(TAKES / f"{name}-1920.jpg", quality=94, subsampling=0)
    print(name, [tuple(round(v) for v in r) for r in rects], "jpg KB", round((TAKES / f"{name}-1920.jpg").stat().st_size / 1024))
    return rgb


if __name__ == "__main__":
    ref = Image.open(REF).convert("RGB")
    arr = np.asarray(ref)
    clean = harmonic_fill(arr, OLD_MASK)
    Image.fromarray(clean).save(HERE / "plate-clean-1280.png")
    plate = Image.fromarray(clean).resize((1920, 1080), Image.LANCZOS)
    plate.save(HERE / "plate-clean-1920.png")
    SIZE = calibrate()
    A = compose(plate, [("No More", RED, WHITE), ("Software", YELLOW, BLACK), ("Engineers", YELLOW, BLACK)], "take-A-red-block")
    B = compose(plate, [("No More", YELLOW, RED), ("Software", YELLOW, BLACK), ("Engineers", YELLOW, BLACK)], "take-B-red-letters")
    # QA sheet: reference | A | B
    sheet = Image.new("RGB", (1280 * 3 // 2 + 20, 360 * 1 + 0), (20, 20, 20))
    for i, im in enumerate((ref.resize((640, 360)), A.resize((640, 360)), B.resize((640, 360)))):
        sheet.paste(im, (i * 650, 0))
    sheet.save(HERE / "qa-sheet.png")
    print("done")
