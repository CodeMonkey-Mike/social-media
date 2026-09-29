#!/usr/bin/env python
"""
measure_face_crop.py — the vertical cut's face crop is MEASURED, never assumed centre (vertical-repurpose.md §1b,
Mike 2026-07-25: a whole-frame centroid said 48% while he sat at 62-71%; the centre crop cut half his face off).

For every FACE window (AS-RECORDED.md, SOURCE-spine seconds) it samples N frames from the SOURCE spine, masks the
green screen out (strongly-green pixels are background; the master's pillarbox columns are dropped too), takes the
subject's horizontal centroid, and reports per-window and mean positions as a percentage of the frame width. The
vertical comp sets `objectPosition: '<pct>% center'` on the spine from this file.

Usage: python measure_face_crop.py <media/<project>> [--scope ALL] [--samples 5] [--out assets/vertical/face-crop.json]
Machine line: FACE-CROP windows=N mean=62.4% spread=61.0-71.2% · WROTE <json>
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)


def source_spine(proj: Path, scope: str):
    hits = sorted(h for h in (proj / "spine").glob(f"{scope}.?.*.mp4")
                  if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)
    return hits[-1] if hits else None


def grab(video: Path, t: float, dest: Path):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", str(dest)], capture_output=True)
    return dest if dest.is_file() else None


def face_centre_pct(png: Path):
    """Preferred: detect the FACE (OpenCV Haar cascade; the largest detection) -> centre % of width."""
    try:
        import cv2
    except ImportError:
        return None
    img = cv2.imread(str(png))
    if img is None:
        return None
    gray = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    # two cascades + relaxed params: a mic over the mouth or a warm light-leak tint defeats the default one
    for name, (sf, mn) in (("haarcascade_frontalface_default.xml", (1.1, 5)), ("haarcascade_frontalface_alt2.xml", (1.05, 3)),
                           ("haarcascade_frontalface_default.xml", (1.05, 2)), ("haarcascade_profileface.xml", (1.05, 3))):
        casc = cv2.CascadeClassifier(cv2.data.haarcascades + name)
        faces = casc.detectMultiScale(gray, scaleFactor=sf, minNeighbors=mn, minSize=(80, 80))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            return float((x + w / 2) / img.shape[1] * 100)
    return None


def subject_centre_pct(png: Path):
    """Fallback for GREEN-SCREEN masters: mask the green out and take the subject centroid. Returns None when the
    mask covers (almost) the whole frame, i.e. there is no green screen to key."""
    im = np.asarray(Image.open(png).convert("RGB")).astype(np.int32)
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    green = (G > 60) & (G > R * 1.25) & (G > B * 1.25)
    subj = ~green
    lum = im.sum(2)
    col_dark = (lum < 45).mean(0) > 0.98   # pillarbox columns
    subj[:, col_dark] = False
    cols = subj.sum(0)
    live_w = int((~col_dark).sum())
    if cols.sum() < 500 or subj[:, ~col_dark].mean() > 0.85:   # no green screen: the "subject" is the whole room
        return None, float(subj.mean())
    W = im.shape[1]
    cx = (cols * np.arange(W)).sum() / cols.sum()
    return float(cx / W * 100), float(subj.mean())


def centre_pct(png: Path):
    """Face detection first (works on any room); green-screen centroid second; never a whole-frame centroid."""
    pct = face_centre_pct(png)
    if pct is not None:
        return pct, "face-detect"
    pct, _ = subject_centre_pct(png)
    return pct, ("green-mask" if pct is not None else None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--samples", type=int, default=5)
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    spine = source_spine(proj, a.scope)
    ar = proj / "AS-RECORDED.md"
    if not spine or not ar.is_file():
        print("FATAL: source spine or AS-RECORDED.md missing", file=sys.stderr)
        sys.exit(2)
    text = ar.read_text(encoding="utf-8")
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", text, re.M | re.S)
    faces = [(float(m.group(1)), float(m.group(2))) for m in FACE_RE.finditer(sec.group(0) if sec else "")]
    if not faces:
        print("FATAL: no FACE windows in AS-RECORDED.md", file=sys.stderr)
        sys.exit(1)
    tmp = proj / "_previews" / "vertical-qa" / "face-measure"
    tmp.mkdir(parents=True, exist_ok=True)
    windows, all_pcts, methods = [], [], set()
    for i, (fa, fz) in enumerate(faces, 1):
        pcts = []
        for k in range(a.samples):
            t = fa + (fz - fa) * (k + 0.5) / a.samples
            png = grab(spine, t, tmp / f"F{i}-{k}.png")
            if not png:
                continue
            pct, how = centre_pct(png)
            if pct is not None:
                pcts.append(round(pct, 2))
                methods.add(how)
        if pcts:
            windows.append({"window": [fa, fz], "samples": pcts, "mean_pct": round(sum(pcts) / len(pcts), 2)})
            all_pcts += pcts
    if not all_pcts:
        print("FATAL: the subject could not be isolated (no green screen? use face detection per the skill)", file=sys.stderr)
        sys.exit(1)
    mean = round(sum(all_pcts) / len(all_pcts), 2)
    lo, hi = min(all_pcts), max(all_pcts)
    # a 9:16 crop of a 16:9 frame keeps 56.25% of the width: the crop window centred on `mean` must contain lo..hi
    half = 56.25 / 2
    fits = (mean - half) <= lo and hi <= (mean + half)
    out = Path(a.out) if a.out else proj / "assets" / "vertical" / "face-crop.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"spine": str(spine), "method": sorted(methods), "windows": windows, "mean_pct": mean, "spread": [lo, hi],
                               "crop_keeps_pct_of_width": 56.25, "all_windows_fit_one_offset": fits,
                               "objectPosition": f"{mean:.1f}% center",
                               "note": "per-window offsets are fine if the spread is large (skill §1b); QA one frame per FACE window on the render"},
                              indent=2), encoding="utf-8")
    print(f"FACE-CROP windows={len(windows)} mean={mean}% spread={lo}-{hi}% fits_one_offset={fits}")
    print(f"WROTE {out}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
