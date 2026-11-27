"""The join at 0:09 of the intro: c2a (the retake of the walk-in) ends a little closer on Mike than c2 is at 3.25 s.
This builds clips/c2t.mp4 = c2 from 3.25 s on, starting zoomed and shifted so his face sits where c2a leaves it, easing
back to c2's own framing by the end (so c3, which starts on c2's last frame, still joins), with a 5-frame dissolve out of
c2a. python vertical-intro/match_cut.py"""
import subprocess
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent / "clips"
CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
START, FADE, A_LAST = 3.25, 5, 95          # c2 start (s); dissolve frames; c2a's last frame used (120 frames at 30 fps)


def frames(name):
    cap, out = cv2.VideoCapture(str(HERE / name)), []
    while True:
        ok, f = cap.read()
        if not ok:
            return out, cap.get(cv2.CAP_PROP_FPS)
        out.append(f)


def his_face(f):
    """His face: the biggest face whose centre sits below the top fifth of the frame (the other man stands higher)."""
    h = f.shape[0]
    d = CASCADE.detectMultiScale(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), 1.05, 5, minSize=(60, 60))
    d = [b for b in d if b[1] + b[3] / 2 > 0.22 * h]
    if not len(d):
        raise SystemExit("MATCH-CUT FAIL: his face was not found")
    x, y, w, hh = max(d, key=lambda b: b[2] * b[3])
    return np.array([x + w / 2, y + hh / 2]), float(w)


def main():
    a, _ = frames("c2a.mp4")
    b, fps = frames("c2.mp4")
    tail = b[round(START * fps):]
    H, W = tail[0].shape[:2]
    pa, wa = his_face(a[A_LAST])
    pb, wb = his_face(tail[0])
    s0 = min(max(wa / wb, 1.0), 1.35)
    print(f"c2a face {pa.round()} w={wa:.0f}; c2 face {pb.round()} w={wb:.0f}; zoom {s0:.3f}")
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r",
                            f"{fps}", "-i", "-", "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", str(HERE / "c2t.mp4")],
                           stdin=subprocess.PIPE)
    n = len(tail)
    for i, f in enumerate(tail):
        u = i / (n - 1)
        e = u * u * (3 - 2 * u)                              # ease in and out
        s = s0 + (1 - s0) * e
        target = pa + (pb - pa) * e                          # where his face centre should sit on this frame
        t = target + (1 - e) * 0 - s * pb if i == 0 else target - s * pb
        t = np.minimum(np.maximum(t, [W * (1 - s), H * (1 - s)]), [0, 0])      # never show outside the picture
        g = cv2.warpAffine(f, np.float32([[s, 0, t[0]], [0, s, t[1]]]), (W, H), flags=cv2.INTER_LANCZOS4)
        if i < FADE:
            k = (i + 1) / (FADE + 1)
            g = cv2.addWeighted(g, k, a[A_LAST], 1 - k, 0)
        enc.stdin.write(g.tobytes())
    enc.stdin.close()
    if enc.wait():
        raise SystemExit("MATCH-CUT FAIL: ffmpeg")
    print(f"MATCH-CUT PASS c2t.mp4 frames={n} fps={fps}")


if __name__ == "__main__":
    main()
