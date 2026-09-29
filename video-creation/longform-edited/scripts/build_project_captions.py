#!/usr/bin/env python
"""
build_project_captions.py — a longform-edited video's CAPTIONS the ONE canonical way, PRE-comp (longform graph
`captions` node, 2026-09-28). Wraps `video-creation/skills/captions/build_captions.py` (never re-implements
its grouping) and adds the track's rules (skills/captions/captions.md):
  - WINDOWS = every FACE hold longer than --min-hold seconds (default 5.0) from AS-RECORDED.md's FACE windows
    (the same > 5 s trigger as the light leak); never over a cover, never over short face punctuation.
    `--window a-b` adds a window by hand (the cold-open exception); `--all-faces` captions every face hold.
  - GROUPING = montserrat, 2 words per line, up to 4 if every word is <= 4 chars (the longform numbers).
  - CORRECTIONS = the tool's brand dict PLUS the project's AS-RECORDED "wrong" -> "right" mishear list.
Writes:
  video-creation/remotion/src/<PascalProject>Captions.ts   `export const ZCAPTIONS` (SOURCE-spine seconds; the comp
                                                          routes every t through sh()) + `export const CAPTION_WINDOWS`
  <project>/assets/captions.json                          sidecar: file, windows, count, style block (the §13 record)
Usage: python build_project_captions.py <media/<project>> [--scope ALL] [--min-hold 5.0] [--window a-b ...] [--all-faces]
Machine line: CAPTIONS-BUILT groups=N windows=N file=<ts>
"""
import argparse
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
TRACK = HERE.parent
REPO = TRACK.parents[1]
BUILD = REPO / "video-creation" / "skills" / "captions" / "build_captions.py"
REMOTION_SRC = REPO / "video-creation" / "remotion" / "src"
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)
MISHEAR_RE = re.compile(r'"([^"]+)"\s*->\s*"([^"]+)"')
ROW_RE = re.compile(r"\{\s*t:\s*([\d.]+)\s*,\s*h:\s*'((?:[^'\\]|\\.)*)'\s*\}")
STYLE = {"fontFamily": "Montserrat,'Arial Black','Segoe UI',sans-serif", "fontWeight": 900, "textTransform": "lowercase",
         "WebkitTextStroke": "12px #000", "paintOrder": "stroke fill", "pop": "scale 0.7 -> 1.12 -> 1 over ~9f",
         "position": "bottom-center, TOPMOST (after the light-leak overlay in the tree)",
         "load": "@remotion/google-fonts/Montserrat"}


def pascal(slug: str) -> str:
    return "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", slug) if p)


def words_json(proj: Path, scope: str):
    sp = proj / "spine"
    cands = sorted(sp.glob(f"{scope}.*.medium-words.json"), key=lambda p: p.name)
    cands = [c for c in cands if ".paused." not in c.name]  # captions are SOURCE times, pre-pause
    return cands[-1] if cands else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--min-hold", type=float, default=5.0)
    ap.add_argument("--window", action="append", default=[], help="extra window a-b (source seconds)")
    ap.add_argument("--all-faces", action="store_true")
    ap.add_argument("--max-words", type=int, default=2)
    ap.add_argument("--max-short", type=int, default=4)
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    ar = proj / "AS-RECORDED.md"
    wj = words_json(proj, a.scope)
    if not ar.is_file() or not wj:
        print("FATAL: AS-RECORDED.md or the final word JSON is missing", file=sys.stderr)
        sys.exit(2)
    text = ar.read_text(encoding="utf-8")
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", text, re.M | re.S)
    faces = [(float(m.group(1)), float(m.group(2))) for m in FACE_RE.finditer(sec.group(0) if sec else "")]
    windows = [(fa, fz) for fa, fz in faces if a.all_faces or (fz - fa) > a.min_hold]
    skipped = [(fa, fz) for fa, fz in faces if (fa, fz) not in windows]
    for w in a.window:
        x, _, y = w.partition("-")
        windows.append((float(x), float(y)))
    windows.sort()
    if not windows:
        print("FATAL: no caption window (no FACE hold over the minimum and no --window given)", file=sys.stderr)
        sys.exit(1)
    fixes = [(w, r) for w, r in MISHEAR_RE.findall(text)]
    tmp = proj / "_previews" / "captions.raw.ts"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run([sys.executable, str(BUILD), "--words", str(wj), "--style", "montserrat", "--max-words", str(a.max_words),
                        "--max-short", str(a.max_short), "--var", "ZCAPTIONS", "--out", str(tmp)], capture_output=True, text=True)
    if r.returncode != 0 or not tmp.is_file():
        print("FATAL: build_captions.py failed\n" + (r.stderr or r.stdout)[-800:], file=sys.stderr)
        sys.exit(1)
    rows = [(float(t), h) for t, h in ROW_RE.findall(tmp.read_text(encoding="utf-8"))]
    kept = []
    for t, h in rows:
        if any(fa - 0.05 <= t <= fz for fa, fz in windows):
            for w, rr in fixes:
                h = re.sub(re.escape(w), rr, h, flags=re.I)
            kept.append((t, h.lower().replace("\u2014", ",")))
    if not kept:
        print("FATAL: no caption group falls inside the windows", file=sys.stderr)
        sys.exit(1)
    name = pascal(proj.name) + "Captions.ts"
    dest = REMOTION_SRC / name
    body = [f"// {name}: GENERATED {date.today().isoformat()} by longform-edited/scripts/build_project_captions.py",
            f"// (build_captions.py --style montserrat --max-words {a.max_words} --max-short {a.max_short} on {wj.name}; "
            f"filtered to the FACE holds > {a.min_hold}s). NEVER hand-edit; re-run the graph's captions node.",
            "// Times are SOURCE-spine seconds: the comp routes every t through sh() (card pauses).",
            "export const CAPTION_WINDOWS: [number, number][] = [" + ", ".join(f"[{fa:.3f}, {fz:.3f}]" for fa, fz in windows) + "];",
            "export const ZCAPTIONS: { t: number; h: string }[] = ["]
    body += [f"  {{ t: {t:7.2f}, h: '{h.replace(chr(92), chr(92) * 2).replace(chr(39), chr(92) + chr(39))}' }}," for t, h in kept]
    body += ["];", ""]
    dest.write_text("\n".join(body), encoding="utf-8", newline="\n")
    side = proj / "assets" / "captions.json"
    side.parent.mkdir(parents=True, exist_ok=True)
    side.write_text(json.dumps({"file": str(dest), "words": str(wj), "windows": windows, "skipped_short_faces": skipped,
                                "min_hold_s": a.min_hold, "groups": len(kept), "grouping": {"max_words": a.max_words, "max_short": a.max_short},
                                "corrections_applied": len(fixes), "style": STYLE, "first_groups": kept[:6]}, indent=2), encoding="utf-8")
    print(f"CAPTIONS-BUILT groups={len(kept)} windows={len(windows)} file={dest}")
    print(f"WROTE {side}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
