"""8-frame strip of one preview (or any) video + a motion score (mean abs diff between consecutive samples).
Usage: python strip.py <video> <out.jpg> [--from S --to S]"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    a = float(sys.argv[sys.argv.index("--from") + 1]) if "--from" in sys.argv else 0.0
    b = float(sys.argv[sys.argv.index("--to") + 1]) if "--to" in sys.argv else dur(src)
    n = 8
    W, H = 480, 270
    tmp = out.with_suffix("")
    tmp.mkdir(parents=True, exist_ok=True)
    imgs = []
    for k in range(n):
        t = a + (b - a) * (k + 0.5) / n
        f = tmp / f"{k}.jpg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
                        "-vf", f"scale={W}:{H}", str(f)])
        if f.exists():
            imgs.append(Image.open(f).convert("RGB"))
    diffs = [ImageStat.Stat(ImageChops.difference(imgs[i], imgs[i + 1])).mean for i in range(len(imgs) - 1)]
    score = sum(sum(d) / 3 for d in diffs) / max(1, len(diffs))
    luma = [sum(ImageStat.Stat(im).mean) / 3 for im in imgs]
    sheet = Image.new("RGB", (4 * W, 2 * H))
    for k, im in enumerate(imgs):
        sheet.paste(im, ((k % 4) * W, (k // 4) * H))
    sheet.save(out, quality=85)
    print(f"{out.name}: span {a:.2f}-{b:.2f}s motion={score:.1f} luma=[{', '.join(f'{x:.0f}' for x in luma)}]")


if __name__ == "__main__":
    main()
