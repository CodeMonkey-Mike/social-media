"""AI vs ML thumbnail: find REAL smiling, eyes-to-camera frames of Mike in the raw master (no AI on his face, the canton
template). Pulls frames at --fps from the WHOLE raw recording (retakes included: a thumbnail frame never has to be in the
cut), scores each with the MediaPipe face landmarker blendshapes (smile, blink, jaw, eye-look) + a Laplacian sharpness on
the face box, writes stills-scores.json and contact sheets of the best candidates.

    python score_stills.py [--fps 2] [--top 30]
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
PROJ = HERE.parent.parent
RAW = PROJ / "raw" / "2026-11-10 10-05-37.mkv"
OUT = HERE.parent / "stills"
MODEL = Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/cache/mediapipe/face_landmarker.task")


def extract(fps: float):
    frames = sorted(OUT.glob("raw-*.jpg"))
    if frames:
        return frames
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(RAW), "-vf", f"fps={fps}", "-q:v", "2",
                    str(OUT / "raw-%05d.jpg")], check=True)
    return sorted(OUT.glob("raw-*.jpg"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=float, default=2.0)
    ap.add_argument("--top", type=int, default=30)
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    frames = extract(a.fps)
    opts = mp.tasks.vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(MODEL)),
        output_face_blendshapes=True, num_faces=1)
    rows = []
    with mp.tasks.vision.FaceLandmarker.create_from_options(opts) as det:
        for f in frames:
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
            idx = int(f.stem.split("-")[1])
            rows.append({"f": f.name, "t": round((idx - 1) / a.fps, 2),
                         "smile": round((b["mouthSmileLeft"] + b["mouthSmileRight"]) / 2, 3),
                         "jaw": round(b["jawOpen"], 3),
                         "blink": round(max(b["eyeBlinkLeft"], b["eyeBlinkRight"]), 3),
                         "look": round(look, 3), "sharp": round(sharp, 1),
                         "cx": round(float((x0 + x1) / 2), 3), "fw": round(float(x1 - x0), 3)})
    (HERE.parent / "stills-scores.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
    ok = [r for r in rows if r["blink"] < 0.45 and r["look"] < 0.5]
    ok.sort(key=lambda r: -(r["smile"] * 2 - r["look"] * 0.5 + min(r["sharp"], 60) / 200))
    # keep the sheet varied: at most one frame per 1.5 s
    picked = []
    for r in ok:
        if all(abs(r["t"] - p["t"]) > 1.5 for p in picked):
            picked.append(r)
        if len(picked) >= a.top:
            break
    font = ImageFont.truetype("arial.ttf", 22)
    tw, th, cols = 480, 270, 5
    for sheet_i in range(0, len(picked), 15):
        chunk = picked[sheet_i:sheet_i + 15]
        rows_n = (len(chunk) + cols - 1) // cols
        sheet = Image.new("RGB", (tw * cols, th * rows_n), "black")
        for i, r in enumerate(chunk):
            im = Image.open(OUT / r["f"]).convert("RGB").resize((tw, th))
            d = ImageDraw.Draw(im)
            n = sheet_i + i + 1
            d.rectangle([0, 0, 300, 30], fill=(0, 0, 0))
            d.text((6, 3), f"#{n} t={r['t']:.1f} sm={r['smile']:.2f}", fill=(255, 255, 0), font=font)
            sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
        sheet.save(HERE.parent / f"stills-sheet-{sheet_i // 15 + 1}.jpg", quality=88)
    (HERE.parent / "stills-picked.json").write_text(json.dumps(picked, indent=1), encoding="utf-8")
    print(f"{len(rows)} frames scored, {len(ok)} eyes-open + to camera, {len(picked)} picked")
    for i, r in enumerate(picked[:15], 1):
        print(i, r)


if __name__ == "__main__":
    main()
