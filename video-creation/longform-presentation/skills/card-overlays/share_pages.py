"""share_pages.py: a static page in the DECK AREA of a scripted video's screen-share scenes (Mike 2026-11-25, longest-bear:
the deck was never on screen while he recorded, "put some static page, like a slide deck or a chart ... it can change
every 20 seconds or so ... but not more frequent than that"). The webcam and the membership box stay as filmed.

Which page: a `[NOTE]` above a `[SCREENSHARE]` line that carries `page: <id>`, e.g.
    💬 `[NOTE]` On screen: the deck slide THE HOPE (`page: the-hope`)
    🖥️ `[SCREENSHARE]` Now the reason I still have some hope...
The page is assets/share-pages/<id>.png, already at the deck area's size. Its window is the line's cue window (ad-libs
after the line included, they hold its scene); it never starts inside a full-camera window, and after the script's LAST
line it ends with his words (what he says after the script keeps its own picture).

Run after the cue and after `cover_runs.py --step build` (it keeps these cards), then `cover_runs.py --step render`:
    python share_pages.py "<project>/SCRIPT.md" [--region 0,0,1370,1080] [--dry-run]
It rewrites only the `share-*` cards of overlays/cards.json. Machine line: `SHARE-PAGES PASS|FAIL`.
"""
import argparse
import json
import re
import sys
from pathlib import Path

from PIL import Image

PAGE_NOTE = re.compile(r"\[NOTE\].*?page:\s*([A-Za-z0-9_-]+)")
MIN_HOLD = 20.0      # his rule: a page changes every 20 s or so, not more often


def pages_by_line(script_text):
    """{script line number: page id} for each [SCREENSHARE] line with a `page:` note above it."""
    out, pending = {}, None
    for n, raw in enumerate(script_text.splitlines(), 1):
        m = PAGE_NOTE.search(raw)
        if m:
            pending = m.group(1)
        elif "[SCREENSHARE]" in raw and raw.lstrip().startswith(("\U0001F5A5", "`[SCREENSHARE]", "[SCREENSHARE]")):
            if pending:
                out[n] = pending
            pending = None
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--region", default="0,0,1370,1080", help="the deck area, x,y,w,h in spine pixels")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--cards", default="cards.json", help="the spec in overlays/ to write (the vertical: cards-v.json)")
    ap.add_argument("--pages", default="assets/share-pages", help="page folder in the project (the vertical: its own size)")
    ap.add_argument("--extra", default="extra-covers.json", help="full-frame covers sidecar in overlays/")
    ap.add_argument("--face-crop", default=None, help="x,y,w,h: replace the spec's face-scene crop (a vertical whose first "
                    "frame must match an intro built on that crop)")
    a = ap.parse_args()
    proj = Path(a.script).resolve().parent
    x, y, w, h = (int(v) for v in a.region.split(","))
    cues = json.loads((proj / "overlays" / "cues.json").read_text(encoding="utf-8"))
    pages = pages_by_line(Path(a.script).read_text(encoding="utf-8"))
    live = [r for r in cues["lines"] if r["status"] != "MISSING"]
    cards, problems = [], []
    for k, r in enumerate(live):
        if r["tag"] != "SCREENSHARE" or r["n"] not in pages:
            continue
        page = pages[r["n"]]
        png = proj / a.pages / f"{page}.png"
        if not png.is_file():
            problems.append(f"line {r['n']}: no page {png}")
            continue
        if Image.open(png).size != (w, h):
            problems.append(f"{png.name} is {Image.open(png).size}, the deck area is {w}x{h}")
            continue
        t0, t1 = r["tIn"], r["tOut"]
        if k == len(live) - 1:
            t1 = min(t1, r["said_out"] + 0.3)
        for fa, fz in cues.get("face_windows", []):
            if fa - 0.05 <= t0 < fz:
                t0 = round(fz, 3)
        if t1 - t0 < 2.0:
            problems.append(f"line {r['n']}: page {page} would be up for only {t1 - t0:.2f} s")
            continue
        cards.append({"id": f"share-L{r['n']}-{page}", "in": round(t0, 3), "out": round(t1, 3), "say": r["heard"][:80],
                      "kind": "image", "src": f"../{a.pages}/{page}.png", "region": {"x": x, "y": y, "w": w, "h": h}})
    # EXTRA FULL-FRAME COVERS (a fix round: "cover the screen share completely from X to the next cover"): rows of
    # overlays/extra-covers.json {"id": "cover-...", "in", "out", "src" (1920x1080), "kind"?, "fade_in"?, "fade_out"?}.
    # The deck-area pages are cut around them, and a cover run that touches one meets it with no fade (no gap of recording).
    extra_path = proj / "overlays" / a.extra
    extra = json.loads(extra_path.read_text(encoding="utf-8")) if extra_path.is_file() else []
    for e in extra:
        e.setdefault("kind", "clip")
        e.setdefault("say", "full-frame cover (extra-covers.json)")
        kept = []
        for c in cards:
            if c["out"] <= e["in"] or c["in"] >= e["out"]:
                kept.append(c)
                continue
            if c["in"] < e["in"] - 2.0:
                kept.append({**c, "out": e["in"]})
            if c["out"] > e["out"] + 2.0:
                kept.append({**c, "id": c["id"] + "-b", "in": e["out"]})
        cards = kept
    missing = [n for n in pages if n not in {r["n"] for r in live}]
    for n in missing:
        problems.append(f"line {n} has a page but was not matched in the recording")
    for c, d in zip(cards, cards[1:]):
        if abs(c["out"] - d["in"]) < 0.05 and c["out"] - c["in"] < MIN_HOLD - 1.0:
            print(f"WARN {c['id']} changes after {c['out'] - c['in']:.1f} s (he asked for 20 s or so)")
    for c in cards:
        print(f"  {c['id']:34s} {c['in']:8.2f} - {c['out']:8.2f}  ({c['out'] - c['in']:5.1f} s)  {c['say'][:50]}")
    path = proj / "overlays" / a.cards
    spec = json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {"cards": []}
    others = [c for c in spec.get("cards", []) if not str(c.get("id", "")).startswith(("share-", "cover-"))]
    for e in extra:
        for o in others:
            if str(o.get("id", "")).startswith("run-"):
                if abs(o["in"] - e["out"]) < 0.05:
                    o["fade_in"], e["fade_out"] = False, False
                if abs(o["out"] - e["in"]) < 0.05:
                    o["fade_out"], e["fade_in"] = False, False
    cards += extra
    for e in extra:
        print(f"  {e['id']:34s} {e['in']:8.2f} - {e['out']:8.2f}  ({e['out'] - e['in']:5.1f} s)  full frame")
    for c in cards:
        for o in others:
            if c["in"] < o["out"] - 1e-6 and o["in"] < c["out"] - 1e-6:
                problems.append(f"{c['id']} ({c['in']}-{c['out']}) overlaps {o['id']} ({o['in']}-{o['out']})")
    if problems:
        for p in problems:
            print("FAIL " + p)
        print(f"SHARE-PAGES FAIL pages={len(cards)} problems={len(problems)}")
        sys.exit(1)
    if not a.dry_run:
        spec["cards"] = sorted(others + cards, key=lambda c: c["in"])
        if a.face_crop:
            if not spec.get("face_reframe"):
                print("SHARE-PAGES FAIL --face-crop given but the spec has no face_reframe")
                sys.exit(1)
            fx, fy, fw, fh = (int(v) for v in a.face_crop.split(","))
            spec["face_reframe"]["crop"] = {"x": fx, "y": fy, "w": fw, "h": fh}
        path.write_text(json.dumps(spec, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    print(f"SHARE-PAGES PASS pages={len(cards)}" + (" (dry run, nothing written)" if a.dry_run else f" -> {path}"))


if __name__ == "__main__":
    main()
