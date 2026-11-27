"""The clip montage for the VERTICAL cut: each captured clip (16:9) as a 4:5 crop centred on the speaker's face, full
width in the middle of the 1080x1920 frame, over a blurred, darkened fill of itself. One video, the clips back to back at
exactly the frame counts of overlays/inserts.json, so it lies on top of the spliced stretch of the spine (picture only:
the voices are already in the spine). python assets/card-sources/build_clips_vertical.py"""
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

PROJ = Path(__file__).resolve().parents[2]
OUT = PROJ / "assets" / "vertical" / "cards" / "cover-montage.mp4"
CROP_W, FG_H = 864, 1350                   # 4:5 of the 1080-high clip -> 1080x1350 on the vertical frame
CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def face_x(path, shots):
    """Median face centre per shot [(first frame, last frame)]; the biggest face of each sampled frame."""
    cap, frames = cv2.VideoCapture(str(path)), []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    out = []
    for a, b in shots:
        xs = []
        for f in frames[a:b:6]:
            d = CASCADE.detectMultiScale(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), 1.1, 6, minSize=(120, 120))
            if len(d):
                x, y, w, h = max(d, key=lambda r: r[2] * r[3])
                xs.append(x + w / 2)
        if not xs:
            raise SystemExit(f"no face found in {path.name} frames {a}-{b}")
        out.append(float(np.median(xs)))
    return out


def main():
    ins = json.loads((PROJ / "overlays" / "inserts.json").read_text(encoding="utf-8"))["inserts"][0]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    cmd, graph, labels = ["ffmpeg", "-y", "-v", "error"], [], []
    for i, c in enumerate(ins["clips"]):
        path, n = Path(c["file"]), c["frames"]
        cmd += ["-i", str(path)]
        shots = [(0, 49), (49, n)] if "saylor" in path.name else [(0, n)]      # that clip cuts to a second shot at frame 49
        parts = []
        for k, ((a, b), cx) in enumerate(zip(shots, face_x(path, shots))):
            x = int(min(max(cx - CROP_W / 2, 0), 1920 - CROP_W)) // 2 * 2
            print(f"{path.name} frames {a}-{b}: face x {cx:.0f}, crop x {x}")
            parts.append(f"[s{i}_{k}]trim=start_frame={a}:end_frame={b},setpts=PTS-STARTPTS,split=2[bg{i}_{k}][fg{i}_{k}];"
                         f"[bg{i}_{k}]scale=-2:1920,crop=1080:1920,boxblur=24:3,eq=brightness=-0.16:saturation=0.8[b{i}_{k}];"
                         f"[fg{i}_{k}]crop={CROP_W}:1080:{x}:0,scale=1080:{FG_H}:flags=lanczos[f{i}_{k}];"
                         f"[b{i}_{k}][f{i}_{k}]overlay=0:(H-h)/2,setsar=1,format=yuv420p[o{i}_{k}]")
            labels.append(f"[o{i}_{k}]")
        graph.append(f"[{i}:v]fps=30,tpad=stop_mode=clone:stop_duration=1,split={len(shots)}"
                     + "".join(f"[s{i}_{k}]" for k in range(len(shots))))
        graph += parts
    graph.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0[v]")
    cmd += ["-filter_complex", ";".join(graph), "-map", "[v]", "-frames:v", str(ins["frames"]), "-c:v", "libx264", "-crf", "12",
            "-preset", "medium", "-pix_fmt", "yuv420p", str(OUT)]
    subprocess.run(cmd, check=True)
    n = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames", "-of",
                        "csv=p=0", str(OUT)], capture_output=True, text=True).stdout.strip()
    print(f"montage -> {OUT} frames {n} (want {ins['frames']})")


if __name__ == "__main__":
    main()
