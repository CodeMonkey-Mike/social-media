"""Run the CANONICAL download_envato.py for ONE pick with a C: free-space guard (AI vs ML short variants, 2026-11-11).
C: was at ~0.8 GB free (filled by something outside this run); the first attempt hit ENOSPC and briefly took the whole
drive to zero. This wrapper only watches: if C: free space drops under GUARD_MB it kills THAT download's process tree
(python -> playwright driver -> envato-profile Chrome; never the main Chrome) and deletes the partial file.
Usage (from repo root): python <this> <short previews dir> <slot id>"""
import json, shutil, subprocess, sys, time
from pathlib import Path

GUARD_MB = 250
P = Path(sys.argv[1]); sid = sys.argv[2]
pick = next(p for p in json.loads((P / "picks.json").read_text(encoding="utf-8")) if p["id"] == sid)
orig = P / "orig"; orig.mkdir(exist_ok=True)
log = P / f"dl-{sid}.log"
free = lambda: shutil.disk_usage("C:/").free / 1e6
print(f"== {sid} {pick['url'].split('?')[0]}  C: free {free():.0f} MB (guard {GUARD_MB} MB)", flush=True)
if free() < GUARD_MB + 300:
    print("   NOT STARTED: not enough free space for a 4K original", flush=True); sys.exit(3)
with open(log, "w", encoding="utf-8") as lf, open(P / f"dl-{sid}.json", "w", encoding="utf-8") as jf:
    pr = subprocess.Popen([sys.executable, "video-creation/skills/envato-broll/download_envato.py", pick["url"],
                           "--dir", str(orig), "--name", f"{sid}-orig"], stdout=jf, stderr=lf, text=True)
    low = 10**9; tripped = False
    while pr.poll() is None:
        f = free(); low = min(low, f)
        if f < GUARD_MB:
            tripped = True
            subprocess.run(["taskkill", "/T", "/F", "/PID", str(pr.pid)], capture_output=True)
            break
        time.sleep(0.5)
    rc = pr.wait()
if tripped:
    for f in orig.glob(f"{sid}-orig*"):
        f.unlink(missing_ok=True)
    print(f"   GUARD TRIPPED at {low:.0f} MB free: download killed, partial deleted", flush=True); sys.exit(4)
print(f"   exit {rc}; lowest C: free during the run {low:.0f} MB; now {free():.0f} MB", flush=True)
print("   " + (P / f"dl-{sid}.json").read_text(encoding="utf-8").strip().replace("\n", " "), flush=True)
print("   log: " + log.read_text(encoding="utf-8").strip().replace("\n", " | "), flush=True)
sys.exit(rc)
