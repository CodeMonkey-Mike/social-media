"""fetch_all.py -- sequential: download_envato.py (one attempt each) -> full-length 1080x1920 H.264 master (-an) -> unlink original.
Never relaunches a failed download; logs and moves on. Run from repo root with python -I."""
import json, subprocess, sys, zipfile, shutil
from pathlib import Path
V = Path(__file__).resolve().parent.parent
REPO = Path(r"C:\Users\mnede\Documents\Claude\social-media")
ORIG = V / "orig"; ORIG.mkdir(exist_ok=True)
picks = json.loads((V / "picks.json").read_text(encoding="utf-8"))
only = set(sys.argv[1:])
def log(m):
    print(m, flush=True)
def master(src: Path, dst: Path):
    r = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height","-of","csv=p=0",str(src)],capture_output=True,text=True).stdout.strip().split(",")
    w, h = int(r[0]), int(r[1])
    vf = "scale=1080:1920:flags=lanczos,setsar=1" if h > w else None
    if vf is None:
        raise RuntimeError(f"source is not portrait: {w}x{h}")
    subprocess.run(["ffmpeg","-y","-v","error","-i",str(src),"-vf",vf,"-c:v","libx264","-preset","slow","-crf","17","-pix_fmt","yuv420p","-an",str(dst)],check=True)
for p in picks:
    bid, slug = p["id"], p["slug"]
    if only and bid not in only: continue
    m = ORIG / f"{bid}-{slug}.master.mp4"
    if m.exists():
        log(f"{bid}: master exists, skip"); continue
    existing = [f for f in ORIG.glob(f"{bid}-{slug}.*") if f.suffix.lower() in (".mov",".mp4",".zip") and ".master" not in f.name]
    if not existing:
        log(f"{bid}: downloading {p['title'][:60]}")
        with open(ORIG / f"{bid}.out","w") as o, open(ORIG / f"{bid}.log","w") as e:
            rc = subprocess.run([sys.executable, str(REPO/"video-creation/skills/envato-broll/download_envato.py"), p["url"], "--dir", str(ORIG), "--name", f"{bid}-{slug}"],
                                cwd=str(REPO), stdout=o, stderr=e, timeout=1500).returncode
        if rc != 0:
            log(f"{bid}: DOWNLOAD FAILED rc={rc} (see orig/{bid}.log); not retried"); continue
        existing = [f for f in ORIG.glob(f"{bid}-{slug}.*") if f.suffix.lower() in (".mov",".mp4",".zip") and ".master" not in f.name]
    src = existing[0]
    if src.suffix.lower() == ".zip":
        xd = ORIG / f"{bid}-zip"; xd.mkdir(exist_ok=True)
        zipfile.ZipFile(src).extractall(xd)
        vids = sorted([f for f in xd.rglob("*") if f.suffix.lower() in (".mov",".mp4") and "alpha" not in f.name.lower()], key=lambda f: -f.stat().st_size)
        log(f"{bid}: zip -> {[v.name for v in vids]}")
        src_v = vids[0]
    else:
        src_v = src
    try:
        master(src_v, m)
    except Exception as ex:
        log(f"{bid}: MASTER FAILED {ex}"); continue
    sz = src.stat().st_size
    src.unlink()
    if src.suffix.lower() == ".zip": shutil.rmtree(ORIG / f"{bid}-zip", ignore_errors=True)
    log(f"{bid}: master ok {m.stat().st_size/1e6:.1f}MB (original {sz/1e6:.0f}MB removed per disk rule)")
log("FETCH-ALL DONE")
