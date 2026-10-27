"""Clean plate: paint the old yellow blocks out with a harmonic (Laplace) fill anchored to the surrounding wall + wall grain."""
import sys, numpy as np, cv2
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert("RGB")).astype(np.float32)
H, W, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]
yellow = ((r > 190) & (g > 170) & (b < 130)).astype(np.uint8)
yellow[:, 1235:] = 0
closed = cv2.morphologyEx(yellow, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
n, lab = cv2.connectedComponents(closed)
mask = np.zeros((H, W), np.uint8)
for i in range(1, n):
    pts = np.column_stack(np.where(lab == i))[:, ::-1]
    if len(pts) < 20000: continue
    cv2.fillConvexPoly(mask, cv2.convexHull(pts.astype(np.int32)), 1)
hull_only = mask.copy()
import os
DIL = int(os.environ.get("DIL", "41"))
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (DIL, DIL)))
# keep the hole on the wall: per row, stop 14 px short of the first non-wall pixel (hair / face / sweater) right of x=1150
wallish = (b > r + 50) & (b > 110)
blocked = cv2.dilate(hull_only, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (71, 71))) > 0   # the blocks + their shadow
cand = (~wallish) & (~blocked)
gaps = []
for y in range(H):
    row = np.where(cand[y, 1150:])[0]
    edge = 1150 + (int(row[0]) if len(row) else W - 1150)
    hr = np.where(hull_only[y] > 0)[0]
    if len(hr): gaps.append(edge - int(hr.max()))
    mask[y, max(0, edge - 14):] = 0
print("block-to-hair gap px: min", min(gaps), "median", int(np.median(gaps)))
print("hole px", int(mask.sum()), "bbox", cv2.boundingRect(mask))

def harmonic(img, m, iters):
    """Jacobi relaxation of Laplace's equation inside m, Dirichlet boundary = img outside m."""
    u = img.copy(); mm = m.astype(bool)
    for _ in range(iters):
        nb = 0.25 * (np.roll(u, 1, 0) + np.roll(u, -1, 0) + np.roll(u, 1, 1) + np.roll(u, -1, 1))
        u[mm] = nb[mm]
    return u

# multigrid: solve coarse, upsample the interior as the next level's initial guess
levels = [(16, 3000), (8, 800), (4, 300), (2, 120), (1, 40)]
guess = None
for s, iters in levels:
    small = cv2.resize(im, (W // s, H // s), interpolation=cv2.INTER_AREA)
    msmall = (cv2.resize(mask.astype(np.float32), (W // s, H // s), interpolation=cv2.INTER_AREA) > 0.5)
    if guess is not None:
        up = cv2.resize(guess, (W // s, H // s), interpolation=cv2.INTER_CUBIC)
        small[msmall] = up[msmall]
    guess = harmonic(small, msmall, iters)
fill = guess
# wall grain: high-pass texture of the undisturbed wall near the hole
far = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
samp = (far == 0) & (np.arange(W)[None, :] < 1300) & (b > r + 50) & (b > 110)
hp = im - cv2.GaussianBlur(im, (0, 0), 2.0)
gstd = np.array([float(hp[..., c][samp].std()) for c in range(3)], np.float32)
print("wall grain std", gstd.round(2))
rng = np.random.default_rng(11)
noise = cv2.GaussianBlur(rng.normal(0, 1, (H, W, 3)).astype(np.float32), (0, 0), 0.9)
noise *= gstd[None, None, :] / (noise.reshape(-1, 3).std(0)[None, None, :] + 1e-6)
fill = fill + noise
soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 5)[..., None]
outim = np.clip(im * (1 - soft) + fill * soft, 0, 255).astype(np.uint8)
Image.fromarray(outim).save(out)
Image.fromarray(outim).resize((1376, 768), Image.LANCZOS).save(out.replace(".png", "-preview.jpg"), quality=88)
print("wrote", out)
