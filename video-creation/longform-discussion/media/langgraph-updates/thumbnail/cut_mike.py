#!/usr/bin/env python
"""Cut Mike out of his "Python over JavaScript" thumbnail (youtu.be/h6aUzaCab2I) for the langgraph-updates thumbnail.

Mike, 2026-11-19: "I would like to add my picture as it is shown here". So this is his EXACT picture: no image model,
no change to his face. Only the blue background behind him is taken away, because the new thumbnail is dark.

  1. rembg `isnet-general-use` (offline model in ~/.u2net) gives a first mask.
  2. A trimap from that mask, then pymatting closed-form matting at the source's own 1280x720, so the curls keep
     their wisps. The old headline's letters are forced to background (they sit about 30 px from his hair).
  3. pymatting foreground estimation takes the blue out of the half-transparent hair pixels. Pixels fully inside him
     stay the source's own pixels.
  4. Lanczos to the 1920x1080 frame, premultiplied so no blue comes back in at the edge.

Run: python cut_mike.py  -> assets/mike-cut.png (1920x1080 RGBA, same position as in the source) + _qa/cut-*.jpg
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
SRC = HERE / "reference" / "h6aUzaCab2I-maxres.jpg"
OUT = HERE / "assets" / "mike-cut.png"
W, H = 1920, 1080
ROI_X0 = 470                      # source px: nothing of Mike is left of here
FG_ERODE, BG_ERODE = 7, 9         # source px: half-widths of the band the matting solves


def first_mask(img):
    from rembg import new_session, remove
    return np.asarray(remove(img, session=new_session("isnet-general-use"), only_mask=True)).astype(np.float32) / 255.0


def cut():
    src = Image.open(SRC).convert("RGB")
    rgb = np.asarray(src).astype(np.float64) / 255.0
    h, w = rgb.shape[:2]
    a0 = first_mask(src)
    a0[:, :ROI_X0] = 0
    # keep only the biggest piece of the mask: the model also took the last letters of "JavaScript" as a person
    n, lab, stats, _ = cv2.connectedComponentsWithStats((a0 > 0.5).astype(np.uint8), connectivity=8)
    main = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    print(f"mask pieces: {n - 1}, kept the biggest ({stats[main, cv2.CC_STAT_AREA]} px), dropped {sorted(int(s) for s in np.delete(stats[1:, cv2.CC_STAT_AREA], main - 1))}")
    a0[cv2.dilate((lab == main).astype(np.uint8), np.ones((15, 15), np.uint8)) == 0] = 0
    # the old thumbnail's letters and logos: bright pixels outside him, left of his head
    bright = (rgb.max(-1) > 0.72) & (a0 < 0.5)
    bright[:, 700:] = False
    letters = cv2.dilate(bright.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0

    k = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    fg = cv2.erode((a0 > 0.9).astype(np.uint8), k(FG_ERODE), borderType=cv2.BORDER_REPLICATE) > 0
    bg = cv2.erode((a0 < 0.1).astype(np.uint8), k(BG_ERODE), borderType=cv2.BORDER_REPLICATE) > 0
    tri = np.full((h, w), 0.5)
    tri[fg] = 1.0
    tri[bg | letters] = 0.0

    from pymatting import estimate_alpha_cf, estimate_foreground_ml
    roi = (slice(0, h), slice(ROI_X0, w))
    alpha = np.zeros((h, w))
    alpha[roi] = np.clip(estimate_alpha_cf(rgb[roi], tri[roi]), 0, 1)
    alpha[alpha < 0.02] = 0
    alpha[alpha > 0.98] = 1
    fgc = rgb.copy()
    fgc[roi] = estimate_foreground_ml(rgb[roi], alpha[roi])
    fgc = np.where((alpha >= 1.0)[..., None], rgb, np.clip(fgc, 0, 1))   # inside him: the source's own pixels
    print(f"trimap: sure-person {fg.mean():.3f}, sure-background {(bg | letters).mean():.3f}, solved {1 - fg.mean() - (bg | letters).mean():.3f}")

    # premultiplied upscale to the frame
    pm = np.dstack([fgc * alpha[..., None], alpha]).astype(np.float32)
    up = cv2.resize(pm, (W, H), interpolation=cv2.INTER_LANCZOS4)
    A = np.clip(up[..., 3], 0, 1)
    C = np.where(A[..., None] > 1e-3, up[..., :3] / np.maximum(A[..., None], 1e-3), 0)
    out = np.dstack([np.clip(C, 0, 1), A])
    OUT.parent.mkdir(exist_ok=True)
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(OUT)
    print("wrote", OUT)
    return out


def qa(out):
    """The cut over near-black and over mid-grey, plus 2x zooms of the hair edge, to look at before it is used."""
    qa_dir = HERE / "_qa"
    qa_dir.mkdir(exist_ok=True)
    for name, col in (("dark", (15, 14, 20)), ("grey", (128, 128, 128))):
        bgc = np.ones((H, W, 3)) * (np.array(col) / 255.0)
        comp = out[..., :3] * out[..., 3:] + bgc * (1 - out[..., 3:])
        im = Image.fromarray((comp * 255 + 0.5).astype(np.uint8))
        im.save(qa_dir / f"cut-on-{name}.jpg", quality=92)
        if name == "dark":
            for tag, box in (("hair-left", (900, 60, 1300, 560)), ("hair-right", (1450, 60, 1850, 560)), ("shoulder-left", (780, 620, 1180, 1080)), ("top", (1100, 0, 1700, 300))):
                z = im.crop(box)
                z.resize((z.width * 2, z.height * 2), Image.LANCZOS).save(qa_dir / f"cut-zoom-{tag}.jpg", quality=92)
    a = out[..., 3]
    ys, xs = np.where(a > 0.5)
    print(f"Mike in the frame: x {xs.min()} to {xs.max()}, y {ys.min()} to {ys.max()}")
    for y in (60, 150, 300, 450, 560, 640, 720, 800, 900, 1000, 1070):
        row = np.where(a[y] > 0.5)[0]
        if len(row):
            print(f"  y {y:4d}: left edge x {row.min()}, right edge x {row.max()}")


if __name__ == "__main__":
    qa(cut())
