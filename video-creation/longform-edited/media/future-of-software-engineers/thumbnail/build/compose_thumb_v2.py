"""compose_thumb_v2.py: the same "No More / Software / Engineers" banners (the calibrated Impact blocks of compose_thumb.py),
on a CLEAN base: Mike's published "Evals in AI" thumbnail (youtu.be/7FCBlRdekMQ, ref/7FCB-maxresdefault.jpg).

Why: the first base (dKX0Ktn9xiY, "Software Engineers Beware") has an AI-enhancer smear around the hair: painterly blobs and
ghost halos in the blue wall between the head and the text (Mike, 2026-11-14: "a lot of distortion around the side of my head").
The "Evals in AI" frame has a smooth gradient and a natural hair edge. NO matte, NO cut-out of his face (Mike's standing rule): his
head, hair, sweater and room are the reference's own pixels; only the two tilted banners are painted out.

  1. crop the 3 px black border off the top and bottom (and 7 px each side to stay 16:9), Lanczos to 1920x1080;
  2. paint the two tilted banners out (their polygons + shadow) with a boundary-anchored HARMONIC fill + matched grain;
  3. draw the three new blocks with compose_thumb.py's calibrated Impact geometry.
Run: python compose_thumb_v2.py   -> ../takes/take-A-clean-base.png/.jpg (+ B), qa-sheet-v2.png
"""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageFilter
from scipy import sparse
from scipy.sparse.linalg import spsolve
import compose_thumb as ct

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
REF = THUMB / "ref" / "7FCB-maxresdefault.jpg"
CROP = (7, 4, 1273, 716)                         # 1266 x 712 = 16:9, drops the dark border rows 0-2 / 717-719
S2 = 1920 / (CROP[2] - CROP[0])                  # 1.5166
# the two banners' corners on the ORIGINAL 1280x720 (cv2.minAreaRect on the yellow pixels)
BANNERS = [[(78, 351), (58, 161), (535, 111), (555, 301)],
           [(128, 566), (107, 372), (522, 329), (542, 523)]]


def to_plate(p):
    return ((p[0] - CROP[0]) * S2, (p[1] - CROP[1]) * S2)


def banner_mask(shape):
    m = np.zeros(shape[:2], np.uint8)
    for poly in BANNERS:
        pts = np.array([to_plate(p) for p in poly], np.int32)
        cv2.fillPoly(m, [pts], 255)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 26 + 1, 2 * 26 + 1))
    grown = cv2.dilate(m, k)                                         # AA edge + the soft shadow all round
    shifted = cv2.warpAffine(cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 20 + 1, 2 * 20 + 1))),
                             np.float32([[1, 0, 10], [0, 1, 18]]), (shape[1], shape[0]))   # shadow falls down-right
    return (np.maximum(grown, shifted) > 0)


def harmonic_fill_mask(img: np.ndarray, mask: np.ndarray, scale=3) -> np.ndarray:
    """Laplace fill of `mask` anchored on the pixels just outside it, solved at 1/scale, + grain matched to the open gradient."""
    h, w = mask.shape
    ys, xs = np.where(mask)
    x0, x1, y0, y1 = max(0, xs.min() - 12), min(w, xs.max() + 13), max(0, ys.min() - 12), min(h, ys.max() + 13)
    x0 -= x0 % scale; y0 -= y0 % scale
    x1 -= (x1 - x0) % scale; y1 -= (y1 - y0) % scale
    crop = img[y0:y1, x0:x1].astype(np.float64)
    mcrop = mask[y0:y1, x0:x1]
    ch, cw = crop.shape[:2]
    small = np.asarray(Image.fromarray(crop.astype(np.uint8)).resize((cw // scale, ch // scale), Image.BOX)).astype(np.float64)
    msmall = cv2.resize(mcrop.astype(np.uint8) * 255, (cw // scale, ch // scale), interpolation=cv2.INTER_AREA) > 0
    msmall[0, :] = msmall[-1, :] = False
    msmall[:, 0] = msmall[:, -1] = False
    idx = -np.ones(msmall.shape, int)
    idx[msmall] = np.arange(msmall.sum())
    n = int(msmall.sum())
    rows, cols, vals = [], [], []
    rhs = np.zeros((n, 3))
    yy, xx = np.where(msmall)
    for k, (y, x) in enumerate(zip(yy, xx)):
        rows.append(k); cols.append(k); vals.append(4.0)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if msmall[ny, nx]:
                rows.append(k); cols.append(idx[ny, nx]); vals.append(-1.0)
            else:
                rhs[k] += small[ny, nx]
    A = sparse.csc_matrix((vals, (rows, cols)), shape=(n, n))
    sol = np.stack([spsolve(A, rhs[:, c]) for c in range(3)], axis=1)
    fs = small.copy()
    fs[msmall] = sol
    fill = np.asarray(Image.fromarray(np.clip(fs, 0, 255).astype(np.uint8)).resize((cw, ch), Image.BICUBIC)).astype(np.float64)
    # grain: high-pass std of the plain gradient strip left of the banners
    strip = img[600:960, 6:48].astype(np.float64)
    blur = np.asarray(Image.fromarray(strip.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float64)
    std = (strip - blur).std(axis=(0, 1))
    rng = np.random.default_rng(11)
    fill = fill + rng.normal(0, 1, fill.shape) * std
    alpha = cv2.GaussianBlur(mcrop.astype(np.float32), (0, 0), 3.0)[..., None]
    out = img.astype(np.float64).copy()
    out[y0:y1, x0:x1] = crop * (1 - alpha) + fill * alpha
    print(f"  fill: {n} unknowns at 1/{scale}; grain std {std.round(2).tolist()}")
    return np.clip(out, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    ref = Image.open(REF).convert("RGB")
    base = ref.crop(CROP).resize((1920, 1080), Image.LANCZOS)
    arr = np.asarray(base)
    mask = banner_mask(arr.shape)
    print("mask px", int(mask.sum()))
    clean = harmonic_fill_mask(arr, mask)
    plate = Image.fromarray(clean)
    plate.save(HERE / "plate-clean-v2-1920.png")
    ct.SIZE = ct.calibrate()
    A = ct.compose(plate, [("No More", ct.RED, ct.WHITE), ("Software", ct.YELLOW, ct.BLACK), ("Engineers", ct.YELLOW, ct.BLACK)], "take-A-clean-base")
    B = ct.compose(plate, [("No More", ct.YELLOW, ct.RED), ("Software", ct.YELLOW, ct.BLACK), ("Engineers", ct.YELLOW, ct.BLACK)], "take-B-clean-base")
    sheet = Image.new("RGB", (640 * 3 + 20, 360), (20, 20, 20))
    for i, im in enumerate((base.resize((640, 360)), A.resize((640, 360)), B.resize((640, 360)))):
        sheet.paste(im, (i * 650, 0))
    sheet.save(HERE / "qa-sheet-v2.png")
    print("done")
