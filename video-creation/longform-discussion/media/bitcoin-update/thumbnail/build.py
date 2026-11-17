#!/usr/bin/env python
"""
Thumbnail for the bitcoin-update discussion video (Mike, 2026-11-13): his own earlier thumbnail as the reference
(https://youtu.be/KY27ZkytNF0, "I Was Wrong - The 4-Year Cycle Remains Intact": his face on a dark red radial glow, no text),
with three lines on the left: "Crypto / Is / F#%K'D...".

Composed in code with the livestream kit (video-creation/livestream-repurpose/thumbnail/thumb_kit.py), never an image model:
  1. cut Mike out of the reference (isnet-general-use, the kit's cut_person)
  2. rebuild the red glow as a plate, its colour + falloff MEASURED off the reference's own background
  3. place him on the right, the headline on the left
Takes: gold (the kit's house headline) and white. Writes thumbnail-gold.jpg / thumbnail-white.jpg next to this file.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[3] / "livestream-repurpose" / "thumbnail"))
import thumb_kit as tk  # noqa: E402

W, H = tk.W, tk.H
REF = Image.open(HERE / "reference" / "reference.jpg").convert("RGB")
LINES = ["Crypto", "Is", "F#%K'D..."]


def measure_glow(ref):
    """Background colour against distance from the glow's centre, from the reference's pixels left and right of him."""
    a = np.asarray(ref.resize((W, H), Image.LANCZOS)).astype(float)
    ys, xs = np.mgrid[0:H, 0:W]
    bg = (xs < 470) | (xs > 1390)                        # clear of his hair and shoulders at 1920 wide
    red = a[..., 0]
    # glow centre: the red-weighted centroid of the background pixels, mirrored about the person (it sits behind him)
    cy = (ys[bg] * red[bg]).sum() / red[bg].sum()
    cx = W / 2
    r = np.hypot(xs - cx, (ys - cy) * 1.0)
    bins = np.arange(0, 1400, 20)
    prof = []
    for b0 in bins:
        m = bg & (r >= b0) & (r < b0 + 20)
        prof.append(a[m].mean(axis=0) if m.sum() > 50 else None)
    return (cx, cy), bins, prof


def plate(center, bins, prof):
    known = [(b, p) for b, p in zip(bins, prof) if p is not None]
    rb = np.array([b + 10 for b, _ in known], float)
    cols = np.array([p for _, p in known], float)
    # radii inside the person have no background to measure: hold the innermost measured colour (the reference's centre is flat)
    ys, xs = np.mgrid[0:H, 0:W]
    r = np.hypot(xs - center[0], ys - center[1])
    out = np.stack([np.interp(r, rb, cols[:, k]) for k in range(3)], -1)
    noise = np.random.default_rng(7).normal(0, 1.2, out.shape)   # the reference's own grain, so the plate is not banded
    return Image.fromarray(np.clip(out + noise, 0, 255).astype(np.uint8)).convert("RGBA")


def build(gold=True, person_dx=470, glow_dx=330):
    (cx, cy), bins, prof = measure_glow(REF)
    print(f"glow centre measured at ({cx:.0f}, {cy:.0f}); innermost colour {next(p for p in prof if p is not None).round()}")
    canvas = plate((cx + glow_dx, cy), bins, prof)
    tk.place_person(canvas, tk.cut_person(REF), scale=1.0, dx=person_dx)
    if not gold:
        tk.GOLD_TOP, tk.GOLD_MID, tk.GOLD_BOT = (255, 255, 255), (250, 250, 250), (222, 222, 226)
    tk.headline(canvas, LINES, x=70, y=178, max_w=930, max_h=940, line_gap=30)
    tk.export(canvas, HERE / f"thumbnail-{'gold' if gold else 'white'}.jpg")


if __name__ == "__main__":
    build(gold=True)
    build(gold=False)
