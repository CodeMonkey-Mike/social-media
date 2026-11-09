"""sheet.py <root> <slot-file-stem>: contact sheet of the PORTRAIT candidates already fetched by search_all.py (4 frames each)."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(sys.argv[1]); sid=sys.argv[2]
items=json.loads((root/"search"/f"{sid}.json").read_text(encoding="utf-8"))
font=ImageFont.load_default(size=15)
tiles=[]
for it in items:
    if not it.get("portrait"): continue
    i=it["i"]; f=root/"pv"/f"{sid}-{i}.mp4"
    d=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout.strip() or 0)
    fr=[]
    for k,frac in enumerate((0.05,0.35,0.65,0.95)):
        png=root/"pv"/f"_t.png"
        subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{d*frac:.2f}","-i",str(f),"-frames:v","1","-vf","scale=135:240",str(png)],capture_output=True)
        if png.exists(): fr.append(Image.open(png).convert("RGB").copy())
    t=Image.new("RGB",(137*4,262),(30,30,30))
    for k,x in enumerate(fr): t.paste(x,(k*137,22))
    ImageDraw.Draw(t).text((3,2),f"#{i} {it.get('duration')} {it['title'][:58]}",fill=(255,255,0),font=font)
    tiles.append(t)
    print(i,it.get("duration"),it["title"],"|",it["url"].split("?")[0].split("/")[-1])
if tiles:
    cols=3; rows=(len(tiles)+cols-1)//cols
    tw,th=tiles[0].size
    s=Image.new("RGB",(cols*(tw+6),rows*(th+4)))
    for n,t in enumerate(tiles): s.paste(t,((n%cols)*(tw+6),(n//cols)*(th+4)))
    s.save(root/"sheets"/f"{sid}.jpg",quality=80)
print("SHEET",sid,len(tiles))
