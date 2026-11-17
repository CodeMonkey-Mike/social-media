"""manifest.py -> VERTICAL-SOURCING.md: per slot, the 16:9 twin, the vertical pick, Envato item URL, source dims, window, QA numbers."""
import json, re
from pathlib import Path
V = Path(__file__).resolve().parent.parent; PROJ = V.parents[2]
picks = json.loads((V/"picks.json").read_text(encoding="utf-8")); rep = json.loads((V/"finalize-report.json").read_text())
dims = {}
for l in (V/"source-dims.log").read_text().splitlines():
    m = re.match(r"(BR-\d+)-\S+\s+(.*)", l)
    if m: dims[m.group(1)] = m.group(2)
twins = {p.name.split("-")[0]+"-"+p.name.split("-")[1]: p.name for p in (PROJ/"assets/vid").glob("BR-*.mp4")}
L = ["# AI destroying lives: VERTICAL b-roll sourcing (envato-sourcer, 2026-11-11)", "",
     "Native portrait (9:16) Envato clips for the vertical cut, one per BR slot, in `assets/vertical/vid/`. Every clip: 1080x1920 H.264, no audio, trimmed to the 16:9 twin's exact length (slot + ~1 s handles). Search JSON, contact sheets and QA frames live next to this file. No centre-crop fallback was used.", "",
     "| id | vertical file | 16:9 twin | Envato pick (author) | item | source | window in source | dur | QA |", "|---|---|---|---|---|---|---|---|---|"]
for p in picks:
    b = p["id"]; r = rep.get(b, {})
    item = p["url"].split("?")[0].rsplit("/",1)[-1]
    qa = f"{r.get('w')}x{r.get('h')} {r.get('codec')} {r.get('fps')} fps, audio {r.get('audio_streams')}, black {len(r.get('blackdetect',[]))}, motion {r.get('motion_mean')}" if r else "NOT BUILT"
    L.append(f"| {b} | `{Path(r.get('file','')).name}` | `{twins.get(b,'?')}` | {p['title']} ({p['author']}) | [{item[:8]}]({p['url'].split('?')[0]}) | {dims.get(b,'n/a')} | {r.get('start_in_source','?')} s | {r.get('dur','?')} s | {qa} |")
(V/"VERTICAL-SOURCING.md").write_text("\n".join(L)+"\n", encoding="utf-8"); print(V/"VERTICAL-SOURCING.md")
