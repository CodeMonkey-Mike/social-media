"""Dense frame strip of ONE clip: N frames evenly spaced, 2 rows. usage: python -I strip.py <mp4> <out.jpg> [N=8] [t0] [t1]"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw
src, out = Path(sys.argv[1]), Path(sys.argv[2])
n = int(sys.argv[3]) if len(sys.argv) > 3 else 8
j = json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","json",str(src)],capture_output=True,text=True).stdout)
dur = float(j["format"]["duration"])
t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
t1 = float(sys.argv[5]) if len(sys.argv) > 5 else dur
W, H = 480, 270
cols = 4; rows = (n + cols - 1) // cols
sheet = Image.new("RGB", (W*cols, (H+18)*rows), (20,20,20)); d = ImageDraw.Draw(sheet)
tmp = out.with_suffix(".tmp.jpg")
for i in range(n):
    t = t0 + (t1 - t0) * (i + 0.5) / n
    subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",f"{t:.3f}","-i",str(src),"-frames:v","1","-vf",f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2",str(tmp)])
    r, c = divmod(i, cols)
    if tmp.exists():
        sheet.paste(Image.open(tmp), (c*W, r*(H+18)+18))
    d.text((c*W+4, r*(H+18)+3), f"t={t:.2f}s / {dur:.2f}", fill=(255,255,0))
tmp.unlink(missing_ok=True)
sheet.save(out, quality=85); print(out, f"dur={dur:.2f}")
