"""Sequential licensed downloads through the canonical download_envato.py, each into its own new empty dir. One attempt per item: a failure is logged, never retried blind."""
import json, subprocess, sys
from pathlib import Path
root=Path(sys.argv[1]); skill=root.parent
P=json.loads((root/"tools/picks.json").read_text(encoding="utf-8"))
for sid,v in P.items():
    d=root/"dl"/sid
    if d.exists() and any(d.iterdir()):
        print(sid,"already",flush=True); continue
    d.mkdir(parents=True,exist_ok=True)
    r=subprocess.run([sys.executable,str(skill/"download_envato.py"),v["full"],"--dir",str(d),"--name",sid],capture_output=True,text=True,encoding="utf-8",errors="replace")
    print(sid,"rc",r.returncode,r.stdout.strip().replace("\n"," ")[-160:],"|",r.stderr.strip().replace("\n"," ; ")[-300:],flush=True)
print("DONE",flush=True)
