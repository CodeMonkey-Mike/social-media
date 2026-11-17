"""pieverse thumbnail, step 1: find REAL frames of Mike in the raw master (no AI on his face: the canton template,
2026-11-10). The raw take mixes two OBS scenes: the full CAMERA scene (the face lines and their retakes) and the
SCREEN-SHARE layout (webcam small, bottom right). Only the camera scene is usable, so:

  1. probe the whole raw at 2 fps, tiny grey frames: the screen-share layout has a black deck area on the left, the
     camera scene does not -> the CAMERA segments;
  2. pull full-size frames at --fps inside those segments (retakes included: a thumbnail frame never has to be in the cut);
  3. score every frame with the MediaPipe face landmarker blendshapes (smile, jaw, blink, eye-look) + a Laplacian
     sharpness on the face box; keep full-camera faces only (a face narrower than 14% of the frame is the small webcam);
  4. write stills-scores.json, stills-picked.json and contact sheets of the best CALM, eyes-to-camera candidates.

    python score_stills.py [--fps 3] [--top 30]
"""
import argparse
import json
import subprocess
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
THUMB = HERE.parent
PROJ = THUMB.parent
RAW = PROJ / "raw" / "2026-11-14 08-49-36.mkv"
OUT = THUMB / "stills"
MODEL = Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/mediapipe/face_landmarker.task")
PW, PH, PFPS = 160, 90, 2


def camera_segments():
    """[(a, b)] seconds of the raw where the picture is the full CAMERA scene (left 55% of the frame is not black)."""
    cache = THUMB / "camera-segments.json"
    if cache.is_file():
        return [tuple(s) for s in json.loads(cache.read_text(encoding="utf-8"))]
    p = subprocess.run(["ffmpeg", "-v", "error", "-i", str(RAW), "-vf", f"fps={PFPS},scale={PW}:{PH},format=gray",
                        "-f", "rawvideo", "-"], capture_output=True, check=True)
    fr = np.frombuffer(p.stdout, dtype=np.uint8).reshape(-1, PH, PW)
    left = fr[:, int(PH * 0.15):int(PH * 0.85), :int(PW * 0.55)].reshape(len(fr), -1).mean(axis=1)
    cam = left > 15.0
    segs, start = [], None
    for i, c in enumerate(cam):
        if c and start is None:
            start = i
        if (not c or i == len(cam) - 1) and start is not None:
            a, b = start / PFPS, (i if not c else i + 1) / PFPS
            if b - a >= 1.5:
                segs.append((round(a, 2), round(b, 2)))
            start = None
    cache.write_text(json.dumps(segs), encoding="utf-8")
    return segs


def extract(segs, fps):
    """Frames inside the camera segments -> stills/s<seg>-<n>.jpg; returns [(path, raw seconds)]."""
    idx = THUMB / "stills-index.json"
    if idx.is_file():
        return [(OUT / n, t) for n, t in json.loads(idx.read_text(encoding="utf-8"))]
    out = []
    for k, (a, b) in enumerate(segs):
        a2, b2 = a + 0.3, b - 0.3                      # stay clear of the scene switch
        if b2 - a2 < 0.5:
            continue
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a2:.3f}", "-to", f"{b2:.3f}", "-i", str(RAW),
                        "-vf", f"fps={fps}", "-q:v", "2", str(OUT / f"s{k:02d}-%04d.jpg")], check=True)
        for f in sorted(OUT.glob(f"s{k:02d}-*.jpg")):
            n = int(f.stem.split("-")[1])
            out.append((f, round(a2 + (n - 1) / fps, 3)))
    idx.write_text(json.dumps([(f.name, t) for f, t in out]), encoding="utf-8")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=float, default=3.0)
    ap.add_argument("--top", type=int, default=30)
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    segs = camera_segments()
    print(f"camera segments: {len(segs)}, {sum(b - x for x, b in segs):.1f} s in all")
    for s in segs:
        print(f"  {s[0]:8.2f} - {s[1]:8.2f}  ({s[1] - s[0]:.1f} s)")
    frames = extract(segs, a.fps)
    opts = mp.tasks.vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(MODEL)),
        output_face_blendshapes=True, num_faces=1)
    rows = []
    with mp.tasks.vision.FaceLandmarker.create_from_options(opts) as det:
        for f, t in frames:
            bgr = cv2.imread(str(f))
            res = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)))
            if not res.face_blendshapes:
                continue
            b = {c.category_name: c.score for c in res.face_blendshapes[0]}
            pts = np.array([(p.x, p.y) for p in res.face_landmarks[0]])
            x0, y0 = pts.min(0)
            x1, y1 = pts.max(0)
            h, w = bgr.shape[:2]
            crop = cv2.cvtColor(bgr[max(0, int(y0 * h)):int(y1 * h), max(0, int(x0 * w)):int(x1 * w)], cv2.COLOR_BGR2GRAY)
            sharp = float(cv2.Laplacian(crop, cv2.CV_64F).var()) if crop.size else 0.0
            look = max(b["eyeLookDownLeft"], b["eyeLookDownRight"], b["eyeLookUpLeft"], b["eyeLookUpRight"],
                       b["eyeLookOutLeft"], b["eyeLookOutRight"], b["eyeLookInLeft"], b["eyeLookInRight"])
            rows.append({"f": f.name, "t": t,
                         "smile": round((b["mouthSmileLeft"] + b["mouthSmileRight"]) / 2, 3),
                         "jaw": round(b["jawOpen"], 3),
                         "blink": round(max(b["eyeBlinkLeft"], b["eyeBlinkRight"]), 3),
                         "look": round(look, 3), "sharp": round(sharp, 1),
                         "cx": round(float((x0 + x1) / 2), 3), "cy": round(float((y0 + y1) / 2), 3),
                         "fw": round(float(x1 - x0), 3), "fh": round(float(y1 - y0), 3)})
    (THUMB / "stills-scores.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
    full = [r for r in rows if r["fw"] >= 0.14]                      # the full camera scene, not the small webcam
    ok = [r for r in full if r["blink"] < 0.45 and r["look"] < 0.5]
    # CALM, steady, eyes to camera, sharp (the canton pick; Mike picked calm over an excited face on bullish-on-kaspa)
    ok.sort(key=lambda r: -(min(r["sharp"], 80) / 160 - r["look"] * 1.0 - r["blink"] * 0.5 - r["jaw"] * 0.6 + r["smile"] * 0.3))
    picked = []
    for r in ok:
        if all(abs(r["t"] - p["t"]) > 1.0 for p in picked):
            picked.append(r)
        if len(picked) >= a.top:
            break
    font = ImageFont.truetype("arial.ttf", 20)
    tw, th, cols = 480, 270, 5
    for sheet_i in range(0, len(picked), 15):
        chunk = picked[sheet_i:sheet_i + 15]
        rows_n = (len(chunk) + cols - 1) // cols
        sheet = Image.new("RGB", (tw * cols, th * rows_n), "black")
        for i, r in enumerate(chunk):
            im = Image.open(OUT / r["f"]).convert("RGB").resize((tw, th))
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, 400, 28], fill=(0, 0, 0))
            d.text((6, 3), f"#{sheet_i + i + 1} t={r['t']:.1f} jaw={r['jaw']:.2f} sm={r['smile']:.2f} sh={r['sharp']:.0f}",
                   fill=(255, 255, 0), font=font)
            sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
        sheet.save(THUMB / f"stills-sheet-{sheet_i // 15 + 1}.jpg", quality=88)
    (THUMB / "stills-picked.json").write_text(json.dumps(picked, indent=1), encoding="utf-8")
    print(f"{len(rows)} frames with a face, {len(full)} full-camera, {len(ok)} eyes-open + to camera, {len(picked)} picked")
    for i, r in enumerate(picked[:12], 1):
        print(i, r)


if __name__ == "__main__":
    main()
