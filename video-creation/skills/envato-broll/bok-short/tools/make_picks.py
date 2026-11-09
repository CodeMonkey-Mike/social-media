"""Write tools/picks.json: slot -> search row, source trim start and output name."""
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
S = {
 "BR-1": ("br1b", 9, "phone-chart-teal-night", 3.5, 2.503),
 "BR-4": ("br4", 14, "terminal-build-angled", 2.2, 1.23),
 "BR-5": ("br5", 15, "devs-code-lanyard-night", 2.4, 2.033),
 "BR-8": ("br8b", 4, "container-ship-dusk-river", 21.6, 2.195),
}
out = {}
for sid, (src, i, slug, start, win) in S.items():
    it = json.loads((root / "search" / f"{src}.json").read_text(encoding="utf-8"))[i]
    out[sid] = {"title": it["title"], "full": it["url"], "url": it["url"].split("?")[0], "listed": it["duration"], "name": f"{sid}-{slug}", "start": start, "window": win, "dur": round(win + 2, 3)}
    print(sid, out[sid]["title"], "|", out[sid]["url"])
(root / "tools" / "picks.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
