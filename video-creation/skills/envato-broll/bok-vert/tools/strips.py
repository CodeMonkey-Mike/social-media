"""One row per pick: frames every ~1 s across the whole preview + the full url; prints duration and motion so the trim point is chosen by looking."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(sys.argv[1]); font=ImageFont.load_default(size=14)
rows=[l.split("\t") for l in (root/"tools/picks.tsv").read_text().splitlines() if l.strip()]
out={}
batch=[];n=0
def flush():
    global batch,n
    if not batch:return
    s=Image.new("RGB",(1560,sum(b.size[1] for b in batch)))
    y=0
    for b in batch: s.paste(b,(0,y)); y+=b.size[1]
    s.save(root/"sheets"/f"strip{n}.jpg",quality=78); n+=1; batch=[]
for sid,src,i,name,dur in rows:
    it=[x for x in json.loads((root/"search"/f"{src}.json").read_text(encoding="utf-8")) if x.get("i")==int(i)][0]
    f=root/"pv"/f"{src}-{i}.mp4"
    d=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout.strip())
    out[sid]={"url":it["url"].split("?")[0],"full":it["url"],"title":it["title"],"dur":it["duration"],"pv":d,"src":f"{src}-{i}"}
    k=min(13,int(d)+1); step=min(1.0,d/k)
    row=Image.new("RGB",(1560,232),(25,25,25))
    for j in range(k):
        t=j*step
        p=root/"pv"/"_s.png"
        subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",str(f),"-frames:v","1","-vf","scale=118:210",str(p)],capture_output=True)
        row.paste(Image.open(p).convert("RGB"),(j*120,20))
    ImageDraw.Draw(row).text((3,2),f"{sid} {it['title'][:70]} pv={d:.1f}s step={step:.2f} slot={dur}",fill=(255,255,0),font=font)
    batch.append(row)
    if len(batch)==5: flush()
flush()
(root/"tools/picks.json").write_text(json.dumps(out,indent=1,ensure_ascii=False),encoding="utf-8")
for k,v in out.items(): print(k,v["dur"],f'{v["pv"]:.1f}',v["title"][:60])
