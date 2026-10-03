# Tight glove inpaint for archie-promo visual-QA (708e665e, 5a094cad). Flat texture only (SKILL.md).
import cv2, numpy as np, sys, os
GLOVE_S = int(os.environ.get('GLOVE_S', 70)); ERODE = int(os.environ.get('ERODE', 4))
def run(src, dst, roi, mode, thr, dil, rad, dbg):
    im = cv2.imread(src)
    x0, y0, x1, y1 = roi
    sub = im[y0:y1, x0:x1].astype(np.float32)
    g = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY).astype(np.float32)
    bg = cv2.medianBlur(im[y0:y1, x0:x1], 21).astype(np.float32)
    if mode == "dark":
        gbg = cv2.cvtColor(bg.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
        m = (gbg - g) > thr
    else:  # colour deviation from the local (white glove) background
        m = np.linalg.norm(sub - bg, axis=2) > thr
    # restrict to the glove interior: low-saturation bright pixels, holes closed, edges eroded
    hsv = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2HSV)
    glove = ((hsv[..., 1] < GLOVE_S) & (hsv[..., 2] > 140)).astype(np.uint8)
    glove = cv2.morphologyEx(glove, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    nn, gl, gst, _ = cv2.connectedComponentsWithStats(glove)
    big = 1 + int(np.argmax(gst[1:, cv2.CC_STAT_AREA]))
    glove = (gl == big).astype(np.uint8)
    glove = cv2.erode(glove, np.ones((3, 3), np.uint8), iterations=ERODE)
    m = (m & (glove > 0)).astype(np.uint8) * 255
    # drop specks
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 4: keep[lab == i] = 255
    keep = cv2.dilate(keep, np.ones((3, 3), np.uint8), iterations=dil)
    full = np.zeros(im.shape[:2], np.uint8); full[y0:y1, x0:x1] = keep
    out = cv2.inpaint(im, full, rad, cv2.INPAINT_TELEA)
    # re-grain: add the glove's own fine noise so the patch is not waxy
    rng = np.random.default_rng(0)
    resid = (sub - bg)[keep == 0]
    sd = float(np.clip(resid.std(), 0, 4))
    patch = out[y0:y1, x0:x1].astype(np.float32)
    noise = rng.normal(0, sd * 0.6, patch.shape[:2])[..., None]
    soft = cv2.GaussianBlur(keep.astype(np.float32) / 255, (5, 5), 0)[..., None]
    patch = patch + noise * soft
    out[y0:y1, x0:x1] = np.clip(patch, 0, 255).astype(np.uint8)
    cv2.imwrite(dst, out)
    cv2.imwrite(dbg, keep)
    print("masked px:", int((keep > 0).sum()), "noise sd", round(sd, 2))
if __name__ == "__main__":
    a = sys.argv
    run(a[1], a[2], tuple(map(int, a[3].split(","))), a[4], float(a[5]), int(a[6]), int(a[7]), a[8])
