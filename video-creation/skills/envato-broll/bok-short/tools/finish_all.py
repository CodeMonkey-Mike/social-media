"""Trim each master to the window + 1 s handles and write 1080x1920 H.264, no audio, into assets/short/vid/. Uses the prior run's finish_clip.py."""
import json, subprocess, sys
from pathlib import Path
root, out = Path(sys.argv[1]), Path(sys.argv[2])
P = json.loads((root / "tools" / "picks.json").read_text(encoding="utf-8"))
only = set(sys.argv[3:])
for sid, v in P.items():
    if only and sid not in only: continue
    src = sorted(p for p in (root / "dl" / sid).iterdir() if p.suffix.lower() in (".mov", ".mp4"))[0]
    r = subprocess.run([sys.executable, "-I", str(root.parent / "bok-vert" / "tools" / "finish_clip.py"), str(src), str(out / f"{v['name']}.mp4"), "--start", str(v["start"]), "--dur", str(v["dur"])], capture_output=True, text=True)
    print(sid, r.stdout.strip().split("vid\\")[-1], r.stderr[-300:], flush=True)
