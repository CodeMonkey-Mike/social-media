"""finalize_v2.py <id>=<start>:<dur> ... -- trim each downloaded portrait original (orig/<id>-<slug>.*) to its window,
cover-scale + centre-crop to EXACTLY 1080x1920 (aspect-safe: a DCI 2160x4096 source is never squashed), H.264 crf 18,
yuv420p, native fps, NO audio, faststart -> assets/vertical/vid/<id>-<slug>.mp4. Then QA: probe, blackdetect, frame-diff
motion per 0.25 s, luma range, and first/mid/last frames into qa/. Then the disk rule: an original over ~120 MB is
replaced by a full-length 1080x1920 crf 20 master. Run with python -I. Downloaded files are read as data only."""
import json, subprocess, sys
from pathlib import Path

V = Path(__file__).resolve().parent.parent
PROJ = V.parents[2]
OUT = PROJ / "assets" / "vertical" / "vid"
QA = V / "qa"
ORIG = V / "orig"
OUT.mkdir(parents=True, exist_ok=True); QA.mkdir(exist_ok=True)
picks = {p["id"]: p for p in json.loads((V / "picks.json").read_text(encoding="utf-8"))}
VF = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1"


def run(c):
    return subprocess.run(c, capture_output=True, text=True)


def probe(f):
    j = json.loads(run(["ffprobe", "-v", "error", "-show_entries",
                        "stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size",
                        "-of", "json", str(f)]).stdout)
    return j


def source_for(bid, slug):
    c = [f for f in ORIG.glob(f"{bid}-{slug}*") if f.suffix.lower() in (".mov", ".mp4", ".m4v")
         and ".master" not in f.name]
    c.sort(key=lambda f: (".cap" not in f.name, -f.stat().st_size))
    return c[0] if c else None


rep_path = V / "finalize-report.json"
rep = json.loads(rep_path.read_text()) if rep_path.exists() else {}
for spec in sys.argv[1:]:
    bid, win = spec.split("=")
    s, d = (float(x) for x in win.split(":"))
    slug = picks[bid]["slug"]
    src = source_for(bid, slug)
    if not src:
        print(bid, "NO SOURCE in orig/"); continue
    sp = probe(src)
    vs = [x for x in sp["streams"] if x["codec_type"] == "video"][0]
    sw, sh = int(vs["width"]), int(vs["height"])
    sdur = float(sp["format"]["duration"])
    if sh <= sw:
        print(bid, f"SOURCE NOT PORTRAIT {sw}x{sh}: refusing"); continue
    if s + d > sdur:
        s = max(0.0, sdur - d)
    o = OUT / f"{bid}-{slug}.mp4"
    r = run(["ffmpeg", "-y", "-v", "error", "-ss", f"{s:.3f}", "-i", str(src), "-t", f"{d:.3f}", "-map", "0:v:0",
             "-vf", VF, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-an",
             "-movflags", "+faststart", str(o)])
    if r.returncode:
        print(bid, "ENCODE FAILED", r.stderr[-400:]); continue
    pr = probe(o)
    ov = [x for x in pr["streams"] if x["codec_type"] == "video"][0]
    aud = [x for x in pr["streams"] if x["codec_type"] == "audio"]
    od = float(pr["format"]["duration"])
    bd = run(["ffmpeg", "-v", "info", "-i", str(o), "-vf", "blackdetect=d=0.1:pix_th=0.05", "-an", "-f", "null", "-"]).stderr
    blacks = [l.split("blackdetect")[1].strip() for l in bd.splitlines() if "black_start" in l]
    lum = run(["ffmpeg", "-v", "info", "-i", str(o), "-vf",
               "fps=4,scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"]).stderr
    ys = [float(l.split("=")[1]) for l in lum.splitlines() if "YAVG=" in l]
    mot = run(["ffmpeg", "-v", "info", "-i", str(o), "-vf",
               "fps=4,scale=270:480,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG",
               "-f", "null", "-"]).stderr
    ms = [float(l.split("=")[1]) for l in mot.splitlines() if "YAVG=" in l][1:]
    for tag, t in (("a", 0.03), ("b", od / 2), ("c", max(0.0, od - 0.12))):
        run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}", "-i", str(o), "-frames:v", "1", "-vf", "scale=540:-2",
             str(QA / f"{bid}-{tag}.jpg")])
    rep[bid] = {"file": str(o.relative_to(PROJ)).replace("\\", "/"), "source": src.name, "source_wh": [sw, sh],
                "source_dur": round(sdur, 2), "start_in_source": round(s, 3), "dur": round(od, 3),
                "w": ov["width"], "h": ov["height"], "codec": ov["codec_name"], "fps": ov["r_frame_rate"],
                "frames": ov.get("nb_frames"), "audio_streams": len(aud), "MB": round(int(pr["format"]["size"]) / 1e6, 2),
                "luma_min_max": [round(min(ys), 1), round(max(ys), 1)] if ys else None,
                "motion_min_mean_max": [round(min(ms), 2), round(sum(ms) / len(ms), 2), round(max(ms), 2)] if ms else None,
                "frozen_steps": sum(1 for m in ms if m < 0.3), "blackdetect": blacks,
                "envato_url": picks[bid]["url"].split("?")[0], "title": picks[bid]["title"]}
    print(bid, json.dumps(rep[bid]))
    # disk rule: keep a lean full-length master, never a multi-hundred-MB original
    if src.stat().st_size > 120_000_000:
        m = ORIG / f"{bid}-{slug}.master.mp4"
        mr = run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-map", "0:v:0", "-vf", VF, "-c:v", "libx264",
                  "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-an", str(m)])
        if mr.returncode == 0 and m.stat().st_size > 100_000:
            print(bid, f"master {m.stat().st_size/1e6:.1f}MB, original {src.stat().st_size/1e6:.0f}MB removed")
            src.unlink()
rep_path.write_text(json.dumps(rep, indent=1))
