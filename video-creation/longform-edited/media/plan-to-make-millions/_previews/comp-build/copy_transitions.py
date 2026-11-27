"""Copy every asset the comp's library transition ids need into the project's lean assets/transitions/ (comp-build 6a)."""
import json, shutil, sys
from pathlib import Path
VC = Path(__file__).resolve().parents[5]          # video-creation/
LIBROOT = VC / "assets"                           # row paths are 'transitions/lib/...'
DEST = Path(__file__).resolve().parents[2] / "assets"
raw = json.loads((VC / "assets/transitions/library.json").read_text(encoding="utf-8"))
rows = raw if isinstance(raw, list) else (raw.get("rows") or raw.get("transitions") or next(iter(raw.values())))
by = {r["id"]: r for r in rows}
ids = sys.argv[1:]
paths = set()
def walk(v):
    if isinstance(v, str) and v.startswith("transitions/"):
        paths.add(v)
    elif isinstance(v, dict):
        for x in v.values(): walk(x)
    elif isinstance(v, list):
        for x in v: walk(x)
for i in ids:
    r = by[i]; walk(r.get("params")); walk(r.get("sfx"))
    for k in ("maskDir", "plateDir", "tileDir"):
        walk(r.get(k))
n = 0
for p in sorted(paths):
    s, d = LIBROOT / p, DEST / p
    if s.is_dir():
        shutil.copytree(s, d, dirs_exist_ok=True); n += sum(1 for _ in d.rglob("*"))
    elif s.is_file():
        d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(s, d); n += 1
    else:
        print("MISSING in library:", p)
    print("copied", p)
print("files", n)
