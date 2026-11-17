"""8-frame strip of a preview mp4: python _strip.py <mp4> <out.jpg> [n]"""
import subprocess, json, sys, os
from PIL import Image, ImageDraw
mp4, out = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 8
d = float(json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","json",mp4],capture_output=True,text=True).stdout)["format"]["duration"])
ims = []
for k in range(n):
    t = d*(k+0.5)/n
    p = f"{out}.{k}.jpg"
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",mp4,"-frames:v","1",p])
    im = Image.open(p).convert("RGB"); os.remove(p)
    ImageDraw.Draw(im).text((4,4), f"{t:.1f}s", fill=(255,255,0))
    ims.append(im)
W = sum(i.width for i in ims); H = max(i.height for i in ims)
s = Image.new("RGB",(W,H)); x = 0
for i in ims: s.paste(i,(x,0)); x += i.width
s.save(out, quality=85)
