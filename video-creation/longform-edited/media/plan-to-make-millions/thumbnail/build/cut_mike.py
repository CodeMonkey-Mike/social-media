"""plan-to-make-millions thumbnail, step 1: cut Mike out of his portrait plate.

The plate is the clean portrait behind his published Pieverse thumbnail (youtu.be/7x2CVZQG6WQ): him on the right of a
plain dark gradient, 2752x1536, no text (`refs/mike-portrait-plate.png`, copied from the pieverse project because that
folder is deleted after publish). A matte on a STILL is fine here: Mike asked for his image on a new background.

    python cut_mike.py            -> work/mike-cut.png (RGBA, the crop below) + work/mike-cut.json

Method (the langgraph-updates recipe): rembg isnet-general-use -> keep the biggest piece -> trimap -> pymatting
closed-form alpha -> multi-level foreground estimation, so the dark plate and its golden outline glow do not stay in
the half-transparent hair pixels.
"""
import json
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from pymatting import estimate_alpha_cf, estimate_foreground_ml
from rembg import new_session, remove

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
PLATE = THUMB / "refs" / "mike-portrait-plate.png"
WORK = THUMB / "work"
CROP_X0 = 1100          # everything left of this is empty plate


def main():
    t0 = time.time()
    WORK.mkdir(exist_ok=True)
    full = Image.open(PLATE).convert("RGB")
    crop = full.crop((CROP_X0, 0, full.width, full.height))
    rgb = np.asarray(crop)
    h, w = rgb.shape[:2]

    mask = np.asarray(remove(crop, session=new_session("isnet-general-use"), only_mask=True))
    n, lab, stats, _ = cv2.connectedComponentsWithStats((mask > 127).astype(np.uint8), 8)
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    mask = np.where(lab == big, mask, 0).astype(np.uint8)
    print(f"mask done {time.time() - t0:.0f}s, pieces {n - 1}")

    # trimap: sure person = the mask well inside, sure plate = well outside, the band between is solved.
    # The band is wide (curls + the plate's outline glow sit 30 to 50 px off the hard edge).
    k = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    sure_fg = cv2.erode((mask > 250).astype(np.uint8), k(14))
    sure_bg = 1 - cv2.dilate((mask > 8).astype(np.uint8), k(46))
    trimap = np.full((h, w), 0.5, np.float64)
    trimap[sure_fg == 1] = 1.0
    trimap[sure_bg == 1] = 0.0
    # the right and bottom borders cut his body: there the person runs to the edge, never a soft edge
    trimap[:, -3:][mask[:, -3:] > 200] = 1.0
    trimap[-3:, :][mask[-3:, :] > 200] = 1.0

    img = rgb.astype(np.float64) / 255.0
    alpha = estimate_alpha_cf(img, trimap)
    print(f"alpha done {time.time() - t0:.0f}s")
    fg = estimate_foreground_ml(img, alpha)
    print(f"foreground done {time.time() - t0:.0f}s")

    out = np.dstack([np.clip(fg, 0, 1), np.clip(alpha, 0, 1)])
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(WORK / "mike-cut.png")
    Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8)).save(WORK / "mike-alpha.png")
    (WORK / "mike-cut.json").write_text(json.dumps({"plate": PLATE.name, "crop_x0": CROP_X0, "size": [w, h]}, indent=1))
    print(f"saved {WORK / 'mike-cut.png'} {w}x{h} in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
