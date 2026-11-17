"""AI vs ML vertical b-roll: download each pick with the canonical download_envato.py (ONE attempt each, sequential),
then cut the final 1080x1920 H.264 clip (audio stripped, native fps) from the original, keep a full-length 1080-wide
mezzanine in _previews for any re-trim, and delete the original (C: is nearly full).
Usage (from repo root): python <this> <project dir> [ids...]"""
import json, subprocess, sys, zipfile
from pathlib import Path

proj = Path(sys.argv[1])
only = set(sys.argv[2:])
prev = proj / "_previews" / "envato" / "vertical"
vid = proj / "assets" / "vertical" / "vid"
mezz = prev / "mezz"
mezz.mkdir(parents=True, exist_ok=True)
vid.mkdir(parents=True, exist_ok=True)
NAMES = {  # identical to the 16:9 twins in assets/vid/
    "BR-1": "BR-1-two-engineers-side-by-side", "BR-2": "BR-2-app-ui-on-laptop", "BR-3": "BR-3-neural-network-model",
    "BR-4": "BR-4-leaning-back-hands-behind-head", "BR-5": "BR-5-chalk-math-equations",
    "BR-6": "BR-6-developer-coding-over-shoulder", "BR-7": "BR-7-team-celebrating-launch",
    "BR-8": "BR-8-code-scrolling-dark-screen", "BR-9": "BR-9-research-scientists-lab", "BR-10": "BR-10-door-opening-light"}
WIN = {"BR-1": (1.0, 4.7), "BR-2": (7.0, 5.4), "BR-3": (2.0, 5.9), "BR-4": (1.0, 5.1), "BR-5": (8.0, 5.5),
       "BR-6": (5.0, 4.9), "BR-7": (5.8, 4.3), "BR-8": (2.0, 5.4), "BR-9": (0.2, 5.95), "BR-10": (5.3, 4.9)}
# 60 fps masters conform to 30 (exact 2:1 decimation, no judder) so the comp's playbackRate = 30 / clip fps stays 1.0
FPS_CONFORM = {"BR-10": 30}
VF = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"
picks = json.loads((prev / "picks.json").read_text(encoding="utf-8"))


def probe(p):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                   "stream=width,height,r_frame_rate,codec_name", "-show_entries", "format=duration",
                                   "-of", "json", str(p)], capture_output=True, text=True).stdout)
    s = j["streams"][0]
    return s["width"], s["height"], s["r_frame_rate"], s["codec_name"], float(j["format"]["duration"])


for p in picks:
    sid = p["id"]
    if only and sid not in only:
        continue
    log = prev / f"dl-{sid}.log"
    print(f"== {sid} {p['url']}", flush=True)
    with open(log, "w", encoding="utf-8") as lf:
        r = subprocess.run([sys.executable, "video-creation/skills/envato-broll/download_envato.py", p["url"],
                            "--dir", str(vid), "--name", f"{sid}-orig"], stdout=subprocess.PIPE, stderr=lf, text=True)
    (prev / f"dl-{sid}.json").write_text(r.stdout or "", encoding="utf-8")
    if r.returncode != 0:
        print(f"   DOWNLOAD FAILED (exit {r.returncode}); read {log.name}; not retried", flush=True)
        continue
    src = Path(json.loads(r.stdout)["saved"])
    if not src.is_absolute():
        src = Path.cwd() / src
    if src.suffix.lower() == ".zip":
        ud = prev / "unzip" / sid
        ud.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(src) as z:
            z.extractall(ud)
        vids = sorted([f for f in ud.rglob("*") if f.suffix.lower() in (".mp4", ".mov", ".mxf", ".m4v")],
                      key=lambda f: f.stat().st_size, reverse=True)
        src.unlink()
        if not vids:
            print("   ZIP had no video; see unzip folder", flush=True)
            continue
        src = vids[0]
    w, h, fps, codec, dur = probe(src)
    print(f"   original {w}x{h} {fps} {codec} {dur:.2f}s {src.stat().st_size/1e6:.0f}MB", flush=True)
    if not h > w:
        print("   NOT PORTRAIT: original kept for inspection, no cut made", flush=True)
        continue
    s, d = WIN[sid]
    if s + d > dur:
        s = max(0.0, dur - d)
        print(f"   window clamped to start {s:.2f}", flush=True)
    out = vid / f"{NAMES[sid]}.mp4"
    vf = VF + (f",fps={FPS_CONFORM[sid]}" if sid in FPS_CONFORM else "")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s}", "-i", str(src), "-t", f"{d}", "-vf", vf,
                    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-an",
                    "-movflags", "+faststart", str(out)], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", VF, "-c:v", "libx264", "-preset", "veryfast",
                    "-crf", "22", "-pix_fmt", "yuv420p", "-an", str(mezz / f"{sid}-full.mp4")], check=True)
    ow, oh, ofps, oc, od = probe(out)
    print(f"   -> {out.name} {ow}x{oh} {ofps} {oc} {od:.2f}s {out.stat().st_size/1e6:.1f}MB (window {s}-{s+d:.2f})", flush=True)
    src.unlink()
    if src.parent.name == sid and src.parent.parent.name == "unzip":
        pass
    print("   original deleted", flush=True)
print("DONE", flush=True)
