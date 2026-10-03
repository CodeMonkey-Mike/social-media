#!/usr/bin/env python
"""
measure_face_reframe.py — the 16:9 FACE REFRAME is MEASURED, never eyeballed (comp-build.md section 3a; Mike,
2026-10-01, golden-kitty: "I appear to be off to the right... a lot of white space above my head... center me and
zoom in"). Standard for every gated-face comp: ONE global transform on the spine that puts Mike's face on the
horizontal centre, his eye line about 40% down the frame, leaves only a small gap above his hair, and pushes any
pillar / letter bars of the recording out of frame.

For every FACE window (AS-RECORDED.md, SOURCE-spine seconds) it samples N frames from the SOURCE spine, finds the
face box (OpenCV Haar, the same cascades as measure_face_crop.py), measures the recording's active picture area
(black bars), and solves the smallest scale that satisfies all of:
  - the face centre sits on the frame's horizontal centre,
  - the eye line sits at --eye-line of the frame height (default 0.40),
  - the gap above the hair is at most --max-headroom of the frame height (default 0.10),
  - the scaled picture still covers the whole frame (no bar, no edge shows).
The scale is clamped to [--min-scale, --max-scale]; if the cap is hit the window is clamped into the picture
and `centered` is false (say so, do not silently off-centre him).

Writes <project>/assets/face-reframe.json and one preview crop per FACE window into
<project>/_previews/qa/face-reframe/. The comp declares the result verbatim:
    export const FACE_REFRAME = { scale: <scale>, x: <x>, y: <y> };   // px, transform-origin 0 0, on a 1920x1080 spine
gated by skills/comp-build/lint_face_reframe.py.

Usage: python measure_face_reframe.py <media/<project>> [--scope ALL] [--samples 5] [--eye-line 0.40]
           [--max-headroom 0.10] [--min-scale 1.0] [--max-scale 1.6]
Machine line: FACE-REFRAME scale=1.427 x=-702 y=-388 windows=9 centered=true · WROTE <json>
"""
import argparse
import json
import re
import statistics
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)
W, H = 1920, 1080
EYE_IN_BOX = 0.40      # the eye line sits about 40% down a Haar frontal-face box
HAIR_ABOVE_BOX = 0.33  # the top of the hair sits about a third of the box height above the box


def source_spine(proj: Path, scope: str):
    hits = sorted(h for h in (proj / "spine").glob(f"{scope}.?.*.mp4")
                  if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)
    return hits[-1] if hits else None


def grab(video: Path, t: float, dest: Path):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", str(dest)], capture_output=True)
    return dest if dest.is_file() else None


def face_box(png: Path):
    """(x, y, w, h) of the largest frontal face, or None."""
    import cv2
    img = cv2.imread(str(png))
    if img is None:
        return None
    gray = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    for name, (sf, mn) in (("haarcascade_frontalface_default.xml", (1.1, 5)), ("haarcascade_frontalface_alt2.xml", (1.05, 3)),
                           ("haarcascade_frontalface_default.xml", (1.05, 2))):
        casc = cv2.CascadeClassifier(cv2.data.haarcascades + name)
        faces = casc.detectMultiScale(gray, scaleFactor=sf, minNeighbors=mn, minSize=(120, 120))
        if len(faces):
            return tuple(int(v) for v in max(faces, key=lambda f: f[2] * f[3]))
    return None


def active_area(png: Path):
    """(x0, x1, y0, y1) of the live picture: black pillar / letter bars excluded."""
    im = np.asarray(Image.open(png).convert("RGB")).astype(np.int32).sum(2)
    cols = np.where((im < 45).mean(0) < 0.98)[0]
    rows = np.where((im < 45).mean(1) < 0.98)[0]
    if not len(cols) or not len(rows):
        return None
    return int(cols[0]), int(cols[-1]) + 1, int(rows[0]), int(rows[-1]) + 1


def solve(cx, eye_y, head_top, area, eye_line, max_headroom, smin, smax):
    ax0, ax1, ay0, ay1 = area
    need = {
        "cover_left_right": (W / 2) / max(1.0, min(cx - ax0, ax1 - cx)),
        "cover_top": eye_line * H / max(1.0, eye_y - ay0),
        "cover_bottom": (1 - eye_line) * H / max(1.0, ay1 - eye_y),
        "headroom": (eye_line - max_headroom) * H / max(1.0, eye_y - head_top),
    }
    s_want = max(smin, *need.values())
    s = min(s_want, smax)
    left, top = cx - (W / 2) / s, eye_y - eye_line * H / s
    centered = s_want <= smax + 1e-9
    # clamp the visible window into the live picture (only bites when the scale cap was hit)
    left = min(max(left, ax0), ax1 - W / s)
    top = min(max(top, ay0), ay1 - H / s)
    return s, left, top, centered, need


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--samples", type=int, default=5)
    ap.add_argument("--eye-line", type=float, default=0.40)
    ap.add_argument("--max-headroom", type=float, default=0.10)
    ap.add_argument("--min-scale", type=float, default=1.0)
    ap.add_argument("--max-scale", type=float, default=1.6)
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    spine, ar = source_spine(proj, a.scope), proj / "AS-RECORDED.md"
    if not spine or not ar.is_file():
        print("FATAL: source spine or AS-RECORDED.md missing", file=sys.stderr)
        sys.exit(2)
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar.read_text(encoding="utf-8"), re.M | re.S)
    faces = [(float(m.group(1)), float(m.group(2))) for m in FACE_RE.finditer(sec.group(0) if sec else "")]
    out = proj / "assets" / "face-reframe.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    if not faces:      # a video with no FACE windows: nothing to reframe, the gate passes on the identity transform
        out.write_text(json.dumps({"spine": str(spine), "windows": [], "scale": 1.0, "x": 0, "y": 0, "centered": True,
                                   "note": "no FACE windows in AS-RECORDED.md"}, indent=2), encoding="utf-8")
        print(f"FACE-REFRAME scale=1.000 x=0 y=0 windows=0 centered=true\nWROTE {out}\nPROGRESS 100%")
        return
    qa = proj / "_previews" / "qa" / "face-reframe"
    qa.mkdir(parents=True, exist_ok=True)
    wins, boxes, areas, first_frame = [], [], [], {}
    for i, (fa, fz) in enumerate(faces, 1):
        got = []
        for k in range(a.samples):
            t = fa + (fz - fa) * (k + 0.5) / a.samples
            png = grab(spine, t, qa / f"_src-F{i}-{k}.png")
            if not png:
                continue
            first_frame.setdefault(i, png)
            ar_ = active_area(png)
            if ar_:
                areas.append(ar_)
            b = face_box(png)
            if b:
                got.append(b)
        if got:
            cx = statistics.median(b[0] + b[2] / 2 for b in got)
            wins.append({"window": [fa, fz], "detections": len(got), "face_cx": round(cx, 1),
                         "eye_y": round(statistics.median(b[1] + EYE_IN_BOX * b[3] for b in got), 1),
                         "box_h": round(statistics.median(b[3] for b in got), 1)})
            boxes += got
        else:
            wins.append({"window": [fa, fz], "detections": 0})
    if not boxes or not areas:
        print("FATAL: no face detected in any FACE window (measure by eye, record FACE_REFRAME_WAIVED in the comp)", file=sys.stderr)
        sys.exit(1)
    cx = statistics.median(b[0] + b[2] / 2 for b in boxes)
    eye_y = statistics.median(b[1] + EYE_IN_BOX * b[3] for b in boxes)
    box_h = statistics.median(b[3] for b in boxes)
    head_top = statistics.median(b[1] for b in boxes) - HAIR_ABOVE_BOX * box_h
    # the tightest live area seen on any frame (+2 px safety) is what the frame must stay inside
    area = (max(x[0] for x in areas) + 2, min(x[1] for x in areas) - 2, max(x[2] for x in areas) + 2, min(x[3] for x in areas) - 2)
    s, left, top, centered, need = solve(cx, eye_y, head_top, area, a.eye_line, a.max_headroom, a.min_scale, a.max_scale)
    scale = round(s, 3)
    x, y = int(round(-left * scale)), int(round(-top * scale))
    spread = [w["face_cx"] for w in wins if w.get("detections")]
    for i, png in first_frame.items():      # what each FACE window looks like through the transform
        im = Image.open(png).convert("RGB")
        im.crop((int(left), int(top), int(left + W / s), int(top + H / s))).resize((960, 540)).save(qa / f"F{i}.jpg", quality=88)
    for p in qa.glob("_src-*.png"):
        p.unlink()
    result = {
        "spine": str(spine), "scale": scale, "x": x, "y": y, "centered": centered,
        "css": f"transformOrigin: '0 0', transform: 'translate({x}px, {y}px) scale({scale})'",
        "face_point_out": {"x": W // 2, "y": int(round(a.eye_line * H))},
        "punch_in_note": "scale punch-ins about face_point_out (the face stays put and the frame stays covered)",
        "targets": {"eye_line": a.eye_line, "max_headroom": a.max_headroom, "min_scale": a.min_scale, "max_scale": a.max_scale},
        "measured": {"face_cx": round(cx, 1), "face_cx_pct": round(cx / W * 100, 1), "eye_y": round(eye_y, 1), "box_h": round(box_h, 1),
                     "head_top_est": round(head_top, 1), "headroom_before_pct": round(head_top / H * 100, 1),
                     "headroom_after_pct": round((head_top - top) * s / H * 100, 1), "active_area": list(area),
                     "face_cx_spread": [min(spread), max(spread)], "scale_needed_by": {k: round(v, 3) for k, v in need.items()}},
        "windows": wins, "previews": str(qa),
        "note": "ONE global transform for every FACE window; background-swap clips of a face window get the same framing. "
                "If face_cx_spread is wider than about 8% of the frame, he moved between takes: QA the previews, a per-window offset may be needed.",
    }
    out.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"FACE-REFRAME scale={scale:.3f} x={x} y={y} windows={len(wins)} centered={'true' if centered else 'false'} "
          f"face_cx={cx / W * 100:.1f}% headroom {head_top / H * 100:.0f}% -> {(head_top - top) * s / H * 100:.0f}%")
    print(f"WROTE {out}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
