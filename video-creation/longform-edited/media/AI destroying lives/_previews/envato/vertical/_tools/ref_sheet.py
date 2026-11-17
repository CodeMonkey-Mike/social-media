import subprocess, sys, json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
vid = Path(sys.argv[1]); outp = Path(sys.argv[2]); tmp = outp.parent / "ref169"; tmp.mkdir(exist_ok=True)
font = ImageFont.load_default(size=20)
files = sorted(vid.glob("BR-*.mp4"), key=lambda p: int(p.name.split("-")[1]))
tiles = []
for f in files:
    j = json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=width,height","-of","json",str(f)],capture_output=True,text=True).stdout)
    d = float(j["format"]["duration"])
    fp = tmp / (f.stem + ".jpg")
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{d/2:.2f}","-i",str(f),"-frames:v","1","-vf","scale=320:-2",str(fp)])
    im = Image.open(fp).convert("RGB"); t = Image.new("RGB",(320,im.size[1]+26),(20,20,20)); t.paste(im,(0,26))
    ImageDraw.Draw(t).text((3,3),f"{f.stem[:34]} {d:.1f}s",fill=(255,255,0),font=font); tiles.append(t)
cols=4; tw=320; th=max(t.size[1] for t in tiles); rows=(len(tiles)+cols-1)//cols
s=Image.new("RGB",(cols*(tw+6),rows*(th+6)))
for n,t in enumerate(tiles): s.paste(t,((n%cols)*(tw+6),(n//cols)*(th+6)))
s.save(outp,quality=80); print(outp)
