"""Run the slot queries through the canonical search_envato.py --portrait, one browser at a time; probe every preview for true portrait."""
import json, subprocess, sys, urllib.request
from pathlib import Path
root = Path(sys.argv[1]); skill = root.parent
Q = json.loads((root/"tools"/sys.argv[2]).read_text(encoding="utf-8"))
for sid, query in Q:
    out = root/"search"/f"{sid}.json"
    if out.exists() and out.stat().st_size > 5:
        continue
    r = subprocess.run([sys.executable, str(skill/"search_envato.py"), query, "--portrait", "--max", "16", "--out", str(out)], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=240)
    print(sid, query, "|", r.stderr.strip().replace("\n"," ; ")[-160:], flush=True)
    if not out.exists(): continue
    items = json.loads(out.read_text(encoding="utf-8"))
    kept=[]
    for i,it in enumerate(items):
        pv = it.get("previewVideo")
        if not pv: it["dims"]=None; continue
        f = root/"pv"/f"{sid}-{i}.mp4"
        try:
            req = urllib.request.Request(pv, headers={"User-Agent":"Mozilla/5.0"})
            f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
            d = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout.strip()
        except Exception as e:
            d = ""
        it["dims"]=d; it["i"]=i
        w,h = (d.split(",")+["0","0"])[:2] if d else ("0","0")
        it["portrait"]= int(h or 0)>int(w or 0)
        if not it["portrait"] and f.exists(): f.unlink()
    out.write_text(json.dumps(items,indent=1,ensure_ascii=False),encoding="utf-8")
    print(" ->", sum(1 for x in items if x.get("portrait")),"/",len(items),"portrait", flush=True)
print("DONE", flush=True)
