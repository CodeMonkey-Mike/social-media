"""Fetch Envato preview videos for a results json and build a contact sheet (rows = candidates, 4 frames each)."""
import json, subprocess, sys, urllib.request
from pathlib import Path
res = Path(sys.argv[1]); out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
tag = res.stem
items = json.load(open(res, encoding="utf-8"))
rows = []
for i, it in enumerate(items):
    pv = out / f"{tag}-{i}.mp4"
    if not pv.exists() and it.get("previewVideo"):
        try:
            req = urllib.request.Request(it["previewVideo"], headers={"User-Agent": "Mozilla/5.0"})
            pv.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print(i, "fetch fail", e); continue
    if not pv.exists(): continue
    d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(pv)],capture_output=True,text=True).stdout.strip() or 0)
    dims = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height","-of","csv=p=0",str(pv)],capture_output=True,text=True).stdout.strip()
    row = out / f"{tag}-{i}-row.jpg"
    fr = [d*f for f in (0.05,0.3,0.55,0.85)]
    inputs = []
    for t in fr: inputs += ["-ss", f"{t:.2f}", "-i", str(pv)]
    fc = "".join(f"[{k}:v]scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:-1:-1[v{k}];" for k in range(4)) + "".join(f"[v{k}]" for k in range(4)) + "hstack=4"
    subprocess.run(["ffmpeg","-y","-v","error",*inputs,"-filter_complex",fc,"-frames:v","1",str(row)])
    rows.append(row); print(i, f"{d:.1f}s", dims, it["title"][:60])
if rows:
    inp = []; [inp.extend(["-i", str(r)]) for r in rows]
    subprocess.run(["ffmpeg","-y","-v","error",*inp,"-filter_complex","".join(f"[{k}:v]" for k in range(len(rows)))+f"vstack={len(rows)}" if len(rows)>1 else "null","-frames:v","1",str(out/f"{tag}-sheet.jpg")])
