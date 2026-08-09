"""_key_alpha.py — turn the black-field overlay art into TRUE-ALPHA transparent PNGs.

batch tutorial / clip #6 `tut-94x-euphoria-impact`.
Run:  python _key_alpha.py      (from this folder; idempotent, re-run safe)

WHY: Mike's Phase 7 directive for this batch allows "overlaying graphics or images WITH BACKGROUND
TRANSPARENCY" and bans anything that covers the frame or fills the content zone. ChatGPT returns
opaque PNGs, so the art is generated as luminous sticker art on a FLAT PURE-BLACK field and keyed
here. Luminance keying is the correct key for glow-on-black art: it reproduces exactly what a
'screen' blend would do, but bakes it into a real alpha channel, so the sticker also reads over a
LIGHT background (screen blend cannot darken white) and the comp can use blend 'normal'.

Method, per image:
  1. alpha = smoothstep(LO, HI, luma)  -> the black field goes fully transparent, the glow falloff
     survives as a soft edge instead of a hard cutout.
  2. UN-PREMULTIPLY: the art was rendered over black, so the observed pixel is C = a * C_true.
     Dividing the colour back out restores full saturation at the soft edges (without this, every
     glow edge reads muddy/grey once composited over the green screen).
  3. Crop to the alpha bounding box + a 3 % margin, so the subject fills the 300 px slot instead of
     floating inside a big empty square.

Reads  _raw/_raw-tut6-*.png  ->  writes  ../render-assets/broll-tut6-*.png
"""
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "_raw")
OUT = os.path.abspath(os.path.join(HERE, "..", "render-assets"))

# Luminance ramp. LO is just above the encoder noise floor of a "pure black" JPEG-ish field; HI is
# where the art is treated as fully solid. Measured against the delivered images below.
LO, HI = 0.035, 0.230

PAIRS = [
    ("_raw-tut6-breakout-arrow.png", "broll-tut6-breakout-arrow.png"),
    ("_raw-tut6-euphoria-burst.png", "broll-tut6-euphoria-burst.png"),
    ("_raw-tut6-second-rocket.png", "broll-tut6-second-rocket.png"),
]


def smoothstep(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def key(src, dst):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im, dtype=np.float64) / 255.0
    luma = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    alpha = smoothstep(luma, LO, HI)

    # un-premultiply (art was composited over black)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip(a / safe, 0.0, 1.0)

    # crop to the alpha bbox + 3 % margin
    ys, xs = np.where(alpha > 0.06)
    if len(ys):
        m = int(0.03 * max(a.shape[0], a.shape[1]))
        y0, y1 = max(0, ys.min() - m), min(a.shape[0], ys.max() + 1 + m)
        x0, x1 = max(0, xs.min() - m), min(a.shape[1], xs.max() + 1 + m)
        rgb, alpha = rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1]

    out = np.dstack([rgb, alpha[..., None]])
    Image.fromarray((out * 255.0 + 0.5).astype(np.uint8), mode="RGBA").save(dst)
    cov = float((alpha > 0.5).mean())
    print(f"{os.path.basename(dst):34s} {alpha.shape[1]}x{alpha.shape[0]}  opaque-coverage {cov:5.1%}")


def main():
    os.makedirs(OUT, exist_ok=True)
    missing = [s for s, _ in PAIRS if not os.path.exists(os.path.join(RAW, s))]
    if missing:
        raise SystemExit(f"missing raw art (generate first): {missing}")
    for s, d in PAIRS:
        key(os.path.join(RAW, s), os.path.join(OUT, d))


if __name__ == "__main__":
    main()
