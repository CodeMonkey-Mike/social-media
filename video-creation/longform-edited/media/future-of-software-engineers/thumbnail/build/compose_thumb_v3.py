"""compose_thumb_v3.py: the "No More / Software / Engineers" thumbnail on Mike's FIRST reference face
(youtu.be/dKX0Ktn9xiY, "Software Engineers Beware", the stern look), with the DISTORTED BACKGROUND RECREATED behind him.

Mike (2026-11-14): "a lot of distortion around the side of my head ... Can we just recreate the background and place my image
on top of it?" and, after v2 used the face from a second thumbnail: "It should be my face from the first YouTube link."

The distortion (an AI-enhancer smear: painterly blobs + ghost halos in the wall between the text and the hair) is ONLY on the left
of the head; the top of the hair and the door side are clean. So:
  1. crop the faint border rows, keep 16:9 (1272 x 716);
  2. alpha for the person: rembg `isnet-general-use` (offline model in ~/.u2net) -> trimap -> pymatting CLOSED-FORM matting, so the
     hair edge keeps its wisps; foreground/background colour estimation (pymatting `estimate_foreground_ml`);
  3. a NEW wall: a harmonic (Laplace) fill anchored ONLY on the clean edge strips (left, top, bottom-left), so no smear survives;
  4. out = I + w * (1 - alpha) * (NEW_WALL - OLD_WALL_ESTIMATE): his face, hair interior, sweater and the door side are the
     reference's OWN pixels (alpha = 1 or w = 0 leaves them bit-identical); only the background fraction of edge pixels changes;
  5. Lanczos to 1920x1080, then the calibrated Impact blocks of compose_thumb.py.
Run: python compose_thumb_v3.py  -> ../takes/take-A-first-face.png/.jpg, take-B-first-face.png/.jpg, qa images in build/
"""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image
from scipy import sparse
from scipy.sparse.linalg import spsolve
import compose_thumb as ct

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
REF = THUMB / "ref" / "maxresdefault.jpg"
CROP = (4, 2, 1276, 718)                    # 1272 x 716 = 16:9 (drops the faint dark border rows)
ROI = (380, 0, 900, 716)                    # x0, y0, x1, y1 where the matting is solved (the left boundary of the subject)
W_FULL, W_ZERO = 700, 900                   # the replacement weight w: 1 left of x=700, ramps to 0 at x=900 (top wall stays original)


def alpha_rembg(img: Image.Image) -> np.ndarray:
    from rembg import new_session, remove
    sess = new_session("isnet-general-use")
    m = remove(img, session=sess, only_mask=True)
    return np.asarray(m).astype(np.float32) / 255.0


def alpha_matting(rgb: np.ndarray, a0: np.ndarray) -> np.ndarray:
    from pymatting import estimate_alpha_cf
    x0, y0, x1, y1 = ROI
    img = (rgb[y0:y1, x0:x1] / 255.0).astype(np.float64)
    a = a0[y0:y1, x0:x1]
    fg = cv2.erode((a > 0.9).astype(np.uint8), np.ones((3, 3), np.uint8), iterations=6) > 0
    bg = cv2.erode((a < 0.1).astype(np.uint8), np.ones((3, 3), np.uint8), iterations=6) > 0
    tri = np.full(a.shape, 0.5)
    tri[fg] = 1.0
    tri[bg] = 0.0
    print(f"  trimap: fg {fg.mean():.2f} bg {bg.mean():.2f} unknown {(1 - fg.mean() - bg.mean()):.2f} of the ROI")
    alpha = estimate_alpha_cf(img, tri)
    out = np.zeros(a0.shape, np.float32)
    out[...] = a0
    out[y0:y1, x0:x1] = np.clip(alpha, 0, 1)
    return out


def new_wall(shape, anchors: np.ndarray, rgb: np.ndarray, scale=4) -> np.ndarray:
    """Laplace fill over the WHOLE frame at 1/scale, Dirichlet only on `anchors` (clean edge strips): a smooth gradient with
    no structure; whatever is under the subject is never seen."""
    h, w = shape[:2]
    sh, sw = h // scale, w // scale
    small = cv2.resize(rgb.astype(np.float32), (sw, sh), interpolation=cv2.INTER_AREA).astype(np.float64)
    am = cv2.resize(anchors.astype(np.uint8), (sw, sh), interpolation=cv2.INTER_NEAREST) > 0
    unk = ~am
    idx = -np.ones((sh, sw), int)
    idx[unk] = np.arange(unk.sum())
    n = int(unk.sum())
    rows, cols, vals = [], [], []
    rhs = np.zeros((n, 3))
    ys, xs = np.where(unk)
    for k, (y, x) in enumerate(zip(ys, xs)):
        nb = [(y + dy, x + dx) for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= y + dy < sh and 0 <= x + dx < sw]
        rows.append(k); cols.append(k); vals.append(float(len(nb)))
        for ny, nx in nb:
            if unk[ny, nx]:
                rows.append(k); cols.append(idx[ny, nx]); vals.append(-1.0)
            else:
                rhs[k] += small[ny, nx]
    A = sparse.csc_matrix((vals, (rows, cols)), shape=(n, n))
    sol = np.stack([spsolve(A, rhs[:, c]) for c in range(3)], axis=1)
    fill = small.copy()
    fill[unk] = sol
    wall = cv2.resize(fill.astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    return np.clip(wall, 0, 255)


if __name__ == "__main__":
    src = Image.open(REF).convert("RGB").crop(CROP)
    rgb = np.asarray(src).astype(np.float32)
    H, W = rgb.shape[:2]
    print("source", W, "x", H)
    a0 = alpha_rembg(src)
    cv2.imwrite(str(HERE / "_alpha0.png"), (a0 * 255).astype(np.uint8))
    alpha = alpha_matting(rgb, a0)
    cv2.imwrite(str(HERE / "_alpha.png"), (alpha * 255).astype(np.uint8))
    # banner pixels (yellow + their shadow) are BACKGROUND to replace: force alpha 0 there
    yel = ((rgb[..., 0] > 215) & (rgb[..., 1] > 180) & (rgb[..., 2] < 110)).astype(np.uint8)
    ban = cv2.dilate(yel, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 30 + 1, 2 * 30 + 1))) > 0
    ban[:, 600:] = False
    alpha[ban & (np.arange(W)[None, :] < 590)] = 0.0
    # anchors: clean strips only
    anchors = np.zeros((H, W), bool)
    anchors[:, :16] = True                    # left edge
    anchors[:10, :1100] = True                # top strip above the hair (clean)
    anchors[H - 10:, :420] = True             # bottom-left strip
    wall = new_wall(rgb.shape, anchors, rgb)
    cv2.imwrite(str(HERE / "_wall.png"), cv2.cvtColor(wall.astype(np.uint8), cv2.COLOR_RGB2BGR))
    # old-wall estimate under the soft edge: the image itself where alpha ~ 0, else the matting colour estimate
    from pymatting import estimate_foreground_ml
    F, B = estimate_foreground_ml((rgb / 255.0).astype(np.float64), alpha.astype(np.float64), return_background=True)
    B = np.clip(B * 255.0, 0, 255)
    B = np.where((alpha < 0.02)[..., None], rgb, B)
    w = np.clip((W_ZERO - np.arange(W)[None, :]) / float(W_ZERO - W_FULL), 0, 1)[..., None] * np.ones((H, 1, 1))
    out = rgb + w * (1.0 - alpha)[..., None] * (wall - B)
    out = np.clip(out, 0, 255)
    interior = (alpha >= 0.999)
    changed_interior = int((np.abs(out - rgb).sum(axis=2)[interior] > 0.5).sum())
    right = np.arange(W)[None, :] >= W_ZERO
    changed_right = int((np.abs(out - rgb).sum(axis=2)[np.broadcast_to(right, (H, W))] > 0.5).sum())
    print(f"identity: changed pixels inside the subject (alpha>=0.999): {changed_interior}; right of x={W_ZERO}: {changed_right}")
    clean = Image.fromarray(np.round(out).astype(np.uint8))
    clean.save(HERE / "plate-clean-v3-1272.png")
    plate = clean.resize((1920, 1080), Image.LANCZOS)
    plate.save(HERE / "plate-clean-v3-1920.png")
    ct.SIZE = ct.calibrate()
    A = ct.compose(plate, [("No More", ct.RED, ct.WHITE), ("Software", ct.YELLOW, ct.BLACK), ("Engineers", ct.YELLOW, ct.BLACK)], "take-A-first-face")
    B2 = ct.compose(plate, [("No More", ct.YELLOW, ct.RED), ("Software", ct.YELLOW, ct.BLACK), ("Engineers", ct.YELLOW, ct.BLACK)], "take-B-first-face")
    print("done")
