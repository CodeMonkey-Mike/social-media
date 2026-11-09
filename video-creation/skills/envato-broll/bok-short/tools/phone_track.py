"""Crop the phone's title row at full resolution across the BR-1 clip so the ticker's drift can be measured by eye."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw
root, f = Path(sys.argv[1]), sys.argv[2]
ims = []
for t in (0.0, 1.1, 2.2, 3.3, 4.45):
    p = root / "qa" / "full" / "_p.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t}", "-i", f, "-frames:v", "1", "-vf", "crop=480:340:220:460", str(p)], capture_output=True)
    im = Image.open(p).convert("RGB").copy()
    d = ImageDraw.Draw(im)
    for x in range(0, 480, 60): d.line([(x, 0), (x, 339)], fill=(90, 90, 90))
    for y in range(0, 340, 40): d.line([(0, y), (479, y)], fill=(90, 90, 90))
    d.text((4, 4), f"t={t}", fill=(255, 255, 0))
    ims.append(im)
s = Image.new("RGB", (480 * len(ims) + 8 * (len(ims) - 1), 340))
for i, im in enumerate(ims): s.paste(im, (i * 488, 0))
s.save(root / "qa" / "full" / "br1_track.png")
