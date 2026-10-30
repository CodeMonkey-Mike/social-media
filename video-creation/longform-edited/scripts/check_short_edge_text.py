"""check_short_edge_text.py: fail a 9:16 short whose picture carries TEXT CUT AT THE LEFT/RIGHT EDGE.

Why (reset, 2026-10-30, Mike rejected the short: "Do you not QA this?"): in 16:9-SOURCED mode the spans are 608 px slices of
the 16:9 comp. The comp ignored {"captions": false}, so its big burned captions ("president of", "debt gets pa...") rode into
every face span cut at both edges, and frame-filling cards (the debt ticker, "Same dollars. Less VALUE.") were chopped.
Nothing in the lane looked at the pixels. This does.

Method: EVERY frame (--fps, default 30) over the picture, scaled to 1080 wide. In each side strip (--margin, default 2 percent
= 22 px) count TEXT-EDGE pixels: a very bright pixel (>= 225) within 4 px of a very dark one (<= 40), i.e. stroked caption
glyphs (white fill, black stroke) or dark type on a light card, sliced by the frame edge. Faces, hair, walls and blurred
letterbox fills do not make that pattern densely. A frame fails when a strip holds >= --min-px such pixels spread over
>= --min-rows rows. Frames inside --skip windows (short seconds) are ignored.

  python check_short_edge_text.py <short.mp4> [--fps 2] [--margin 0.02] [--min-px 120] [--min-rows 25] [--skip a-b,a-b]
         [--json out.json] [--sheet out.png]

Exit 0 = clean, 1 = edge-clipped text found (one line per bad frame), 2 = error.
Machine line: EDGE-TEXT frames=N bad=K worst=<t>s/<px>px
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

try:
    import cv2
except ImportError:  # pragma: no cover
    print("FATAL: opencv-python is required", file=sys.stderr)
    sys.exit(2)


def frames(path: Path, fps: float, mw: int):
    """Yield (t, strips): only the two side strips (mw px each, hstacked), so every frame can be checked cheaply."""
    w, h = 2 * mw, 1920
    vf = (f"fps={fps},scale=1080:1920,split[a][b];[a]crop={mw}:1920:0:0[l];[b]crop={mw}:1920:{1080 - mw}:0[r];[l][r]hstack")
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(path), "-filter_complex", vf, "-f", "rawvideo",
                          "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
    n = w * h
    i = 0
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield i / fps, np.frombuffer(buf, np.uint8).reshape(h, w)
        i += 1
    p.wait()


def strip_score(strip: np.ndarray):
    bright = (strip >= 225).astype(np.uint8)
    dark = (strip <= 40).astype(np.uint8)
    near_dark = cv2.dilate(dark, np.ones((9, 9), np.uint8))
    m = (bright & near_dark).astype(bool)
    return int(m.sum()), int(m.any(axis=1).sum())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--fps", type=float, default=30.0, help="default EVERY frame: a 4-frame cropped-card flash slipped between 2 fps samples (reset 2026-10-30)")
    ap.add_argument("--margin", type=float, default=0.02)
    ap.add_argument("--min-px", type=int, default=120)
    ap.add_argument("--min-rows", type=int, default=25)
    ap.add_argument("--skip", default="", help="short-second windows to ignore, e.g. 27.2-30.2")
    ap.add_argument("--json", default=None)
    a = ap.parse_args()
    skips = [tuple(float(x) for x in w.split("-")) for w in a.skip.split(",") if w.strip()]
    mw = max(4, int(round(1080 * a.margin)))
    rows, bad = [], []
    for t, g in frames(Path(a.video), a.fps, mw):
        if any(x <= t < y for x, y in skips):
            continue
        lp, lr = strip_score(g[:, :mw])
        rp, rr = strip_score(g[:, mw:])
        r = {"t": round(t, 2), "left_px": lp, "left_rows": lr, "right_px": rp, "right_rows": rr}
        r["bad"] = (lp >= a.min_px and lr >= a.min_rows) or (rp >= a.min_px and rr >= a.min_rows)
        rows.append(r)
        if r["bad"]:
            bad.append(r)
            print(f"EDGE-TEXT-BAD t={t:.2f}s left={lp}px/{lr}rows right={rp}px/{rr}rows")
    if not rows:
        print("FATAL: no frames read", file=sys.stderr)
        sys.exit(2)
    worst = max(rows, key=lambda r: max(r["left_px"], r["right_px"]))
    print(f"EDGE-TEXT frames={len(rows)} bad={len(bad)} worst={worst['t']}s/{max(worst['left_px'], worst['right_px'])}px")
    if a.json:
        Path(a.json).write_text(json.dumps({"margin_px": mw, "min_px": a.min_px, "min_rows": a.min_rows, "frames": rows}, indent=1), encoding="utf-8")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
