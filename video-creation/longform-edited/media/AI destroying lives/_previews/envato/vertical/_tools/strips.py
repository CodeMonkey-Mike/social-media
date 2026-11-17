"""strips.py <label> <BR-id> ... -> per pick, frames every 1 s of the preview (same timeline as the original), labelled with t."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parent.parent
picks = {p["id"]: p for p in json.loads((ROOT/"picks.json").read_text(encoding="utf-8"))}
font = ImageFont.load_default(size=16); big = ImageFont.load_default(size=20)
rows = []
for bid in sys.argv[2:]:
    p = picks[bid]; f = ROOT/"prev"/p["set"]/f"c{p['idx']:02d}.mp4"
    d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout)
    tmp = ROOT/"prev"/"_strip"; tmp.mkdir(exist_ok=True)
    for old in tmp.glob("*.jpg"): old.unlink()
    subprocess.run(["ffmpeg","-v","error","-y","-i",str(f),"-vf","fps=1,scale=96:-2",str(tmp/"s%03d.jpg")])
    fr = sorted(tmp.glob("s*.jpg"))
    ims = [Image.open(x).convert("RGB") for x in fr]
    w,h = ims[0].size
    row = Image.new("RGB",(len(ims)*(w+2)+2, h+40),(20,20,20))
    ImageDraw.Draw(row).text((3,2),f"{bid} {p['slug']} {d:.1f}s",fill=(255,255,0),font=big)
    for k,im in enumerate(ims):
        row.paste(im,(k*(w+2),22)); ImageDraw.Draw(row).text((k*(w+2)+2,24),f"{k}",fill=(0,255,0),font=font)
    rows.append(row)
W=max(r.size[0] for r in rows); H=sum(r.size[1]+4 for r in rows)
out=Image.new("RGB",(W,H)); y=0
for r in rows: out.paste(r,(0,y)); y+=r.size[1]+4
out.save(ROOT/f"strips-{sys.argv[1]}.jpg",quality=85); print(ROOT/f"strips-{sys.argv[1]}.jpg", out.size)
