"""AI vs ML thumbnail LAYOUT MOCK (code only, the frame is only scaled: no matte, no key, no AI on the face).
Layout after the reference (thumbnail/ref/ref-cqDQV5g7zHo.jpg): a split background, ML ENGINEER left, AI ENGINEER right,
Mike in the middle, a dashed bracket from each role down into ONE box at the bottom centre that holds the money number.
His room stays behind him and fades into the two panels with soft horizontal ramps + a vignette.

    python compose_mock.py <frame.jpg> <out.png> --palette silver|blues [--money "$340K"] [--cx 0.62]
"""
import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/fonts/Montserrat-VF.ttf")
W, H = 1920, 1080
YELLOW = (255, 214, 10)

PALETTES = {
    # left (ML) top/bottom, right (AI) top/bottom, ML text, AI text
    "silver": ((226, 231, 237), (150, 160, 172), (13, 72, 200), (7, 28, 78), (14, 22, 40), (255, 255, 255)),
    "blues": ((14, 30, 66), (6, 14, 34), (22, 119, 255), (9, 52, 160), (205, 214, 228), (255, 255, 255)),
}


def font(size, weight=900):
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_axes([weight])
    return f


def vgrad(w, h, top, bot):
    t = np.linspace(0, 1, h)[:, None, None]
    arr = (np.array(top)[None, None, :] * (1 - t) + np.array(bot)[None, None, :] * t)
    return Image.fromarray(np.repeat(arr, w, axis=1).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("frame")
    ap.add_argument("out")
    ap.add_argument("--palette", default="silver", choices=sorted(PALETTES))
    ap.add_argument("--money", default="$340K")
    ap.add_argument("--cx", type=float, default=0.62, help="face centre x in the source frame (0-1)")
    ap.add_argument("--scale", type=float, default=1.35)
    ap.add_argument("--top", type=int, default=-250, help="source y offset after scaling (moves him up/down)")
    a = ap.parse_args()
    lt, lb, rt, rb, ml_ink, ai_ink = PALETTES[a.palette]

    canvas = Image.new("RGB", (W, H))
    canvas.paste(vgrad(W // 2, H, lt, lb), (0, 0))
    canvas.paste(vgrad(W - W // 2, H, rt, rb), (W // 2, 0))

    # Mike: scale only, centred on his face; a soft column mask lets the room fade into the panels
    src = Image.open(a.frame).convert("RGB")
    sw, sh = int(src.width * a.scale), int(src.height * a.scale)
    src = src.resize((sw, sh), Image.LANCZOS)
    ox = int(W / 2 - a.cx * sw)
    layer = Image.new("RGB", (W, H))
    layer.paste(src, (ox, a.top))
    x = np.arange(W)[None, :]
    y = np.arange(H)[:, None]
    half, ramp = 330, 230                                   # solid half-width around the face, then the fade
    d = np.abs(x - W / 2)
    m = np.clip(1 - (d - half) / ramp, 0, 1) * np.ones((H, 1))
    m = m * np.clip(1 - np.maximum(0, (H * 0.05 - y)) / 60, 0, 1)   # keep the top edge clean
    mask = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(25))
    canvas = Image.composite(layer, canvas, mask)

    dr = ImageDraw.Draw(canvas)
    # role labels, two lines each, centred in their panel
    big, small = font(170), font(96)
    for cx, word, ink in ((W * 0.175, "ML", ml_ink), (W * 0.825, "AI", ai_ink)):
        for txt, f, yy in ((word, big, 170), ("ENGINEER", small, 345)):
            tw = dr.textlength(txt, font=f)
            dr.text((cx - tw / 2, yy), txt, font=f, fill=ink)

    # dashed bracket: down from each label, ONE rounded corner, along the bottom into the box.
    # The corner arc's CENTRE sits at (lx +- R, yb - R), so the curve meets the vertical line exactly at (lx, yb - R) and
    # the horizontal line exactly at (lx +- R, yb). (v1 centred the arc on lx itself, which pushed both corners R px
    # outward, off the lines: Mike 2026-11-10.) The dash pattern is anchored AT the arc ends so a full dash always
    # touches the curve. Drawn at 3x and downsampled for clean curves.
    S, R, LW, DASH, GAP = 3, 44, 14, 34, 22
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lay)
    ink = YELLOW + (255,)

    def dashed_from(anchor, far):
        (x0, y0), (x1, y1) = anchor, far
        L = math.hypot(x1 - x0, y1 - y0)
        ux, uy = (x1 - x0) / L, (y1 - y0) / L
        s = 0.0
        while s < L:
            e = min(L, s + DASH)
            ld.line([((x0 + ux * s) * S, (y0 + uy * s) * S), ((x0 + ux * e) * S, (y0 + uy * e) * S)],
                    fill=ink, width=LW * S)
            s += DASH + GAP

    bx0, bx1, by0, by1 = 650, 1270, 790, 1030
    yb = 905
    for lx, side in ((W * 0.175, 1), (W * 0.825, -1)):
        cx, cy = lx + side * R, yb - R
        ro = (R + LW / 2) * S          # PIL strokes inward from the bbox edge: this puts the stroke centreline at R
        start, end = (90, 180) if side == 1 else (0, 90)
        ld.arc([cx * S - ro, cy * S - ro, cx * S + ro, cy * S + ro], start, end, fill=ink, width=LW * S)
        dashed_from((lx, yb - R), (lx, 485))                               # up from the corner to the label
        dashed_from((lx + side * R, yb), (bx0 if side == 1 else bx1, yb))  # along from the corner to the box
    lay = lay.resize((W, H), Image.LANCZOS)
    canvas = canvas.convert("RGBA")
    canvas.alpha_composite(lay)
    canvas = canvas.convert("RGB")
    dr = ImageDraw.Draw(canvas)

    # the money box (covers the mic, like the reference's "?" box covers the chest)
    shadow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(shadow).rounded_rectangle([bx0 + 10, by0 + 16, bx1 + 10, by1 + 16], 38, fill=150)
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), canvas, shadow)
    dr = ImageDraw.Draw(canvas)
    dr.rounded_rectangle([bx0, by0, bx1, by1], 38, fill=YELLOW)
    f = font(150)
    tw = dr.textlength(a.money, font=f)
    l, t, r, b = dr.textbbox((0, 0), a.money, font=f)
    dr.text(((bx0 + bx1) / 2 - tw / 2, (by0 + by1) / 2 - (t + b) / 2), a.money, font=f, fill=(10, 10, 14))

    canvas.save(a.out)
    canvas.convert("RGB").save(Path(a.out).with_suffix(".jpg"), quality=90)
    print(a.out)


if __name__ == "__main__":
    main()
