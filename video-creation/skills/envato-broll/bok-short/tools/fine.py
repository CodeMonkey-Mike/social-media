"""fine.py <root> <out.jpg> <preview> <start> <end> <step> [crop filter]: larger frames across one candidate trim."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root, out, f, a, b, step = Path(sys.argv[1]), sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])
font = ImageFont.load_default(size=16); ims = []; t = a
while t <= b + 1e-6:
    png = root / "pv" / "_f.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", f, "-frames:v", "1", "-vf", "scale=304:540", str(png)], capture_output=True)
    im = Image.open(png).convert("RGB").copy(); ImageDraw.Draw(im).text((4, 4), f"{t:.2f}s", fill=(255, 255, 0), font=font); ims.append(im); t += step
s = Image.new("RGB", (len(ims) * 306, 540))
for i, im in enumerate(ims): s.paste(im, (i * 306, 0))
s.save(root / "sheets" / out, quality=86)
