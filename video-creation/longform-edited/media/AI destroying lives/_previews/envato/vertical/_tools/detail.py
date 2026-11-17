"""detail.py <label> <set>:<idx> ... -> one row per finalist, 6 frames at preview res. Writes detail-<label>.jpg"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parent.parent
font = ImageFont.load_default(size=20)
label = sys.argv[1]; rows = []
for spec in sys.argv[2:]:
    s, i = spec.split(":"); i = int(i)
    f = ROOT / "prev" / s / f"c{i:02d}.mp4"
    d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout)
    fr = []
    for k in range(6):
        t = 0.02*d + k*(0.96*d)/5
        p = ROOT / "prev" / s / f"d{i:02d}_{k}.jpg"
        subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",str(f),"-frames:v","1",str(p)])
        fr.append(Image.open(p).convert("RGB"))
    w,h = fr[0].size
    title = json.loads((ROOT/f"{s}.json").read_text(encoding="utf-8"))[i]["title"]
    row = Image.new("RGB",(6*(w+4),h+28),(25,25,25))
    for k,im in enumerate(fr): row.paste(im,(k*(w+4),28))
    ImageDraw.Draw(row).text((4,3),f"{spec} {d:.1f}s {title[:80]}",fill=(255,255,0),font=font)
    rows.append(row)
W = max(r.size[0] for r in rows); H = sum(r.size[1]+6 for r in rows)
out = Image.new("RGB",(W,H)); y=0
for r in rows: out.paste(r,(0,y)); y+=r.size[1]+6
out.save(ROOT/f"detail-{label}.jpg",quality=85); print(ROOT/f"detail-{label}.jpg")
