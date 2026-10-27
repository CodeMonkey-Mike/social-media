import json, sys, subprocess, os, urllib.request
n = sys.argv[1]; base = sys.argv[2]
res = json.load(open(os.path.join(base, f"r{n}.json"), encoding="utf-8"))
pv = os.path.join(base, "pv", f"br{n}"); os.makedirs(pv, exist_ok=True)
tiles = []
for i, r in enumerate(res):
    u = r.get("previewVideo")
    if not u: continue
    f = os.path.join(pv, f"{i}.mp4")
    if not os.path.exists(f):
        try: urllib.request.urlretrieve(u, f)
        except Exception as e: print(i, "dl fail", e); continue
    try:
        d = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]).strip())
    except Exception: continue
    out = os.path.join(pv, f"t{i}.jpg")
    # 3 frames at 15/50/85% tiled horizontally, labeled with the index
    subprocess.run(["ffmpeg","-y","-v","error","-i",f,"-vf",
        f"fps=3/{d:.2f},scale=320:-2,tile=3x1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='{i}':x=8:y=8:fontsize=36:fontcolor=yellow:box=1:boxcolor=black",
        "-frames:v","1",out])
    tiles.append(out)
    print(i, r.get("duration"), "|", r.get("title"))
# stack tiles vertically into one sheet
if tiles:
    args=["ffmpeg","-y","-v","error"]
    for t in tiles: args += ["-i", t]
    args += ["-filter_complex", "".join(f"[{k}:v]scale=960:-2[v{k}];" for k in range(len(tiles))) + "".join(f"[v{k}]" for k in range(len(tiles))) + f"vstack=inputs={len(tiles)}" if len(tiles)>1 else "[0:v]scale=960:-2", os.path.join(base, f"sheet{n}.jpg")]
    subprocess.run(args)
