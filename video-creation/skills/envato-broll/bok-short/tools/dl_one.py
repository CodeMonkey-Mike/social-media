"""dl_one.py <root> <slot>: one licensed download via the canonical download_envato.py into its own new empty dir. One attempt only."""
import json, subprocess, sys
from pathlib import Path
root, sid = Path(sys.argv[1]), sys.argv[2]
v = json.loads((root / "tools" / "picks.json").read_text(encoding="utf-8"))[sid]
d = root / "dl" / sid
if d.exists() and any(d.iterdir()):
    print(sid, "already has files, not re-downloading:", [p.name for p in d.iterdir()]); sys.exit(0)
d.mkdir(parents=True, exist_ok=True)
r = subprocess.run([sys.executable, str(root.parent / "download_envato.py"), v["full"], "--dir", str(d), "--name", sid], capture_output=True, text=True, encoding="utf-8", errors="replace")
print(sid, "rc", r.returncode, r.stdout.strip().replace("\n", " "), "|", r.stderr.strip().replace("\n", " ; ")[-500:])
sys.exit(r.returncode)
