"""QA sheets: first / 25 / 50 / 75 / last frame per finished clip, plus motion, black lead, audio check."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
vid=Path(sys.argv[1]); root=Path(sys.argv[2]); font=ImageFont.load_default(size=16)
fs=sorted(vid.glob("BR-*.mp4"),key=lambda p:int(p.name.split("-")[1]))
tiles=[]
for f in fs:
    d=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout)
    im=Image.new("RGB",(5*150+4,288),(30,30,30))
    for k,fr in enumerate((0,.25,.5,.75,.985)):
        p=root/"pv/_q.png"
        subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{d*fr:.3f}","-i",str(f),"-frames:v","1","-vf","scale=148:-2",str(p)],capture_output=True)
        im.paste(Image.open(p).convert("RGB"),(k*150,24))
    ImageDraw.Draw(im).text((3,3),f"{f.stem} {d:.2f}s",fill=(255,255,0),font=font)
    tiles.append(im)
    raw=subprocess.run(["ffmpeg","-v","error","-i",str(f),"-vf","fps=4,scale=64:114,format=gray","-f","rawvideo","-"],capture_output=True).stdout
    a=np.frombuffer(raw,dtype=np.uint8); n=a.size//(64*114); a=a[:n*64*114].reshape(n,114,64).astype(np.float32)
    dif=np.abs(np.diff(a,axis=0)).mean(axis=(1,2)); l=a.mean(axis=(1,2))
    print(f"{f.stem:34s} d={d:.2f} diff={dif.mean():.2f} min={dif.min():.2f} luma0={l[0]:.0f} lumamin={l.min():.0f} MB={f.stat().st_size/1e6:.1f}")
for s in range(0,len(tiles),6):
    ch=tiles[s:s+6]
    sh=Image.new("RGB",(2*(ch[0].size[0]+8),((len(ch)+1)//2)*(ch[0].size[1]+6)))
    for i,t in enumerate(ch): sh.paste(t,((i%2)*(t.size[0]+8),(i//2)*(t.size[1]+6)))
    sh.save(root/f"sheets/qa{s//6}.jpg",quality=82)
