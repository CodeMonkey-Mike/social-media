"""Build a contact sheet for one slot's Envato search results: fetch each previewVideo, pull 4 frames
(5/35/65/95 %), tile one candidate per row with its index, duration and title. Usage:
python sheet.py <n> [--max 12]   -> prev/br<n>/sheet.jpg"""
import json, subprocess, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W = Path(__file__).parent
n = sys.argv[1]
mx = int(sys.argv[3]) if len(sys.argv) > 3 else 12
res = json.load(open(W / f"r-br{n}.json", encoding="utf-8"))[:mx]
out = W / "prev" / f"br{n}"
out.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
TW, TH = 320, 180
rows = []
for i, r in enumerate(res):
    mp4 = out / f"{i}.mp4"
    if r.get("previewVideo") and not mp4.exists():
        try:
            req = urllib.request.Request(r["previewVideo"], headers={"User-Agent": "Mozilla/5.0"})
            mp4.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print(i, "fetch fail", e)
    row = Image.new("RGB", (TW * 4, TH + 26), (20, 20, 20))
    d = ImageDraw.Draw(row)
    d.text((6, 3), f"#{i}  {r['duration']}  {r['title'][:95]}", fill=(255, 220, 0), font=font)
    if mp4.exists():
        try:
            dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)],
                                       capture_output=True, text=True).stdout.strip())
        except ValueError:
            dur = 0
        for k, frac in enumerate((0.05, 0.35, 0.65, 0.95)):
            jpg = out / f"{i}_{k}.jpg"
            if not jpg.exists():
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur*frac:.2f}", "-i", str(mp4), "-frames:v", "1",
                                "-vf", f"scale={TW}:{TH}:force_original_aspect_ratio=decrease,pad={TW}:{TH}:(ow-iw)/2:(oh-ih)/2", str(jpg)])
            if jpg.exists():
                row.paste(Image.open(jpg), (k * TW, 26))
    rows.append(row)
sheet = Image.new("RGB", (TW * 4, sum(r.height for r in rows)), (0, 0, 0))
y = 0
for r in rows:
    sheet.paste(r, (0, y)); y += r.height
sheet.save(out / "sheet.jpg", quality=80)
print(out / "sheet.jpg", len(rows))
