"""Trim every downloaded master to slot + ~1 s handles, 1080x1920 H.264, no audio, into assets/vertical/vid/ under the 16:9 twin's filename."""
import json, subprocess, sys, zipfile
from pathlib import Path
root=Path(sys.argv[1]); only=set(sys.argv[3:]); out=Path(sys.argv[2])
T={"BR-1":3,"BR-2":2,"BR-3":2,"BR-4":6,"BR-5":2,"BR-6":2,"BR-7":2,"BR-8":5,"BR-9":0,"BR-10":.5,"BR-11":3,"BR-12":1,"BR-13":3,"BR-14":1,"BR-15":3,"BR-16":8.5,"BR-17":3,"BR-18":9,"BR-20":1.3,"BR-21":1}
override=root/"tools/trim_override.json"
if override.exists(): T.update(json.loads(override.read_text()))
rows=[l.split("\t") for l in (root/"tools/picks.tsv").read_text().splitlines() if l.strip()]
for sid,_,_,name,dur in rows:
    if sid=="BR-19" or (only and sid not in only): continue
    d=root/"dl"/sid
    z=list(d.glob("*.zip"))
    if z and not list(d.rglob("*.mp4"))+list(d.rglob("*.mov")):
        zipfile.ZipFile(z[0]).extractall(d/"x")
    vids=sorted([p for p in d.rglob("*") if p.suffix.lower() in(".mp4",".mov",".mxf",".m4v") and "alpha" not in p.name.lower()],key=lambda p:-p.stat().st_size)
    if not vids: print(sid,"NO MASTER",list(d.iterdir())); continue
    src=vids[0]; dd=round(float(dur)+2,3)
    if sid=="BR-9": dd=4.06
    r=subprocess.run([sys.executable,str(root/"tools/finish_clip.py"),str(src),str(out/f"{name}.mp4"),"--start",str(T[sid]),"--dur",str(dd)],capture_output=True,text=True)
    print(sid,src.name,src.stat().st_size//10**6,"MB",r.stdout.strip().split("vid\\")[-1][:120],r.stderr[-200:],flush=True)
