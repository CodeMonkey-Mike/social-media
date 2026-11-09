"""strips.py <root> <slot:idx> ...: one large row per candidate preview, a frame about every second, plus motion + URL."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
root = Path(sys.argv[1]); font = ImageFont.load_default(size=16); rows = []
for spec in sys.argv[3:]:
    sid, i = spec.split(":"); i = int(i)
    it = json.loads((root / "search" / f"{sid}.json").read_text(encoding="utf-8"))[i]
    f = root / "pv" / f"{sid}-{i}.mp4"
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip())
    k = min(10, int(d) + 1); step = d / k
    row = Image.new("RGB", (10 * 182, 346), (25, 25, 25))
    for j in range(k):
        png = root / "pv" / "_s.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{j*step:.2f}", "-i", str(f), "-frames:v", "1", "-vf", "scale=180:320", str(png)], capture_output=True)
        row.paste(Image.open(png).convert("RGB"), (j * 182, 24))
    ImageDraw.Draw(row).text((3, 3), f"{sid}#{i} {it['title'][:80]} pv={d:.1f}s step={step:.2f}", fill=(255, 255, 0), font=font)
    rows.append(row)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-vf", "fps=4,scale=64:114,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8); n = a.size // (64 * 114); a = a[:n * 64 * 114].reshape(n, 114, 64).astype(np.float32)
    dif = np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))
    print(f"{sid}#{i} d={d:.1f} diff mean={dif.mean():.2f} min={dif.min():.2f} max={dif.max():.2f} luma={a.mean():.0f} | {it['url'].split('?')[0].split('/')[-1]} | {it['title']}")
s = Image.new("RGB", (rows[0].size[0], sum(r.size[1] for r in rows)))
y = 0
for r in rows:
    s.paste(r, (0, y)); y += r.size[1]
s.save(root / "sheets" / sys.argv[2], quality=84)
