"""Timestamped timeline sheet of a clip: one frame every STEP s (default 1.0), 6 per row, labelled with t.
Usage: python tl.py <video> <out.jpg> [--step 1.0]"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    step = float(sys.argv[sys.argv.index("--step") + 1]) if "--step" in sys.argv else 1.0
    d = dur(src)
    W, H, cols = 320, 180, 6
    tmp = out.with_suffix("")
    tmp.mkdir(parents=True, exist_ok=True)
    ts = []
    t = 0.0
    while t < d - 0.05:
        ts.append(t)
        t += step
    rows = (len(ts) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W, rows * H), (20, 20, 20))
    dr = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except OSError:
        font = ImageFont.load_default()
    for k, t in enumerate(ts):
        f = tmp / f"{k}.jpg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
                        "-vf", f"scale={W}:{H}", str(f)])
        if f.exists():
            x, y = (k % cols) * W, (k // cols) * H
            sheet.paste(Image.open(f), (x, y))
            dr.rectangle([x, y, x + 62, y + 24], fill=(0, 0, 0))
            dr.text((x + 4, y + 2), f"{t:.1f}s", fill=(255, 220, 0), font=font)
    sheet.save(out, quality=82)
    print(f"{out.name}: dur={d:.2f}s frames={len(ts)}")


if __name__ == "__main__":
    main()
