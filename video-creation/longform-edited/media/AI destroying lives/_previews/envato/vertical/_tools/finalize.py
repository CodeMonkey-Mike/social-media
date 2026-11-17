"""finalize.py [ids] -- trim each master to its window (start, dur = the 16:9 twin's length), 1080x1920 H.264 crf 18, no audio,
faststart, into assets/vertical/vid/<id>-<slug>.mp4; then QA: probe + first/mid/last frames + motion + blackdetect."""
import json, subprocess, sys
from pathlib import Path
V = Path(__file__).resolve().parent.parent
PROJ = V.parents[2]
OUT = PROJ / "assets" / "vertical" / "vid"; OUT.mkdir(parents=True, exist_ok=True)
QA = V / "qa"; QA.mkdir(exist_ok=True)
picks = json.loads((V/"picks.json").read_text(encoding="utf-8")); win = json.loads((V/"windows.json").read_text())
only = set(sys.argv[1:])
# DCI-portrait sources (2160x4096, aspect 0.527) were forced to 1080x1920 in the master step: restore the true aspect
# (1080x2048) and centre-crop to 1080x1920 (cover), never ship the squash.
DCI = {"BR-5", "BR-13", "BR-16"}
def run(c): return subprocess.run(c, capture_output=True, text=True)
rep = {}
for p in picks:
    bid, slug = p["id"], p["slug"]
    if only and bid not in only: continue
    m = V/"orig"/f"{bid}-{slug}.master.mp4"
    if not m.exists(): print(bid, "NO MASTER"); continue
    s, d = win[bid]
    md = float(run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(m)]).stdout)
    if s + d > md: s = max(0.0, md - d)
    o = OUT/f"{bid}-{slug}.mp4"
    vf = ["-vf","scale=1080:2048:flags=lanczos,crop=1080:1920:0:64,setsar=1"] if bid in DCI else []
    run(["ffmpeg","-y","-v","error","-ss",f"{s:.3f}","-i",str(m),"-t",f"{d:.3f}"]+vf+["-c:v","libx264","-preset","slow","-crf","18",
         "-pix_fmt","yuv420p","-an","-movflags","+faststart",str(o)])
    pr = json.loads(run(["ffprobe","-v","error","-show_entries","stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size","-of","json",str(o)]).stdout)
    vs = [x for x in pr["streams"] if x["codec_type"]=="video"][0]; aud = [x for x in pr["streams"] if x["codec_type"]=="audio"]
    od = float(pr["format"]["duration"])
    bd = run(["ffmpeg","-v","info","-i",str(o),"-vf","blackdetect=d=0.1:pix_th=0.05","-an","-f","null","-"]).stderr
    blacks = [l.split("blackdetect")[1].strip() for l in bd.splitlines() if "black_start" in l]
    # motion: mean abs diff between frames sampled 0.5 s apart
    fr = run(["ffmpeg","-v","info","-i",str(o),"-vf","fps=2,scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YAVG","-f","null","-"]).stderr
    ys = [float(l.split("=")[1]) for l in fr.splitlines() if "YAVG=" in l]
    mot = run(["ffmpeg","-v","info","-i",str(o),"-vf","fps=4,scale=270:480,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG","-f","null","-"]).stderr
    ms = [float(l.split("=")[1]) for l in mot.splitlines() if "YAVG=" in l]
    for tag, t in (("a", 0.05), ("b", od/2), ("c", od-0.1)):
        run(["ffmpeg","-y","-v","error","-ss",f"{t:.2f}","-i",str(o),"-frames:v","1","-vf","scale=360:-2",str(QA/f"{bid}-{tag}.jpg")])
    rep[bid] = {"file": str(o.relative_to(PROJ)).replace("\\","/"), "start_in_source": round(s,3), "dur": round(od,3), "w": vs["width"], "h": vs["height"],
                "codec": vs["codec_name"], "fps": vs["r_frame_rate"], "audio_streams": len(aud), "MB": round(int(pr["format"]["size"])/1e6,2),
                "luma_min_max": [round(min(ys),1), round(max(ys),1)] if ys else None, "motion_mean": round(sum(ms[1:])/max(1,len(ms)-1),2) if ms else None,
                "blackdetect": blacks}
    print(bid, json.dumps(rep[bid]))
old = {}
rp = V/"finalize-report.json"
if rp.exists(): old = json.loads(rp.read_text())
old.update(rep); rp.write_text(json.dumps(old, indent=1))
