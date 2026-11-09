"""First / 25 / 50 / 75 / last frame of every finished clip, one row each, for the look test."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root, vid = Path(sys.argv[1]), Path(sys.argv[2]); font = ImageFont.load_default(size=16)
rows = []
for f in sorted(vid.glob("BR-*.mp4"), key=lambda p: int(p.name.split("-")[1])):
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout)
    r = Image.new("RGB", (5 * 272, 508), (25, 25, 25))
    for k, fr in enumerate((0, .25, .5, .75, .985)):
        p = root / "qa" / "_q.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d*fr:.3f}", "-i", str(f), "-frames:v", "1", "-vf", "scale=270:480", str(p)], capture_output=True)
        r.paste(Image.open(p).convert("RGB"), (k * 272, 26))
    ImageDraw.Draw(r).text((4, 4), f"{f.stem} {d:.2f}s", fill=(255, 255, 0), font=font)
    rows.append(r)
s = Image.new("RGB", (rows[0].size[0], sum(r.size[1] for r in rows)))
y = 0
for r in rows:
    s.paste(r, (0, y)); y += r.size[1]
s.save(root / "qa" / "final_sheet.jpg", quality=86)
