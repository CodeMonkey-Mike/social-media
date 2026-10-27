#!/usr/bin/env python
"""
build_project_captions.py — a longform-edited video's CAPTIONS the ONE canonical way, PRE-comp (longform graph
`captions` node, 2026-09-28). Wraps `video-creation/skills/captions/build_captions.py` (never re-implements
its grouping) and adds the track's rules (skills/captions/captions.md):
  - WINDOWS = every FACE hold longer than --min-hold seconds (default 5.0) from AS-RECORDED.md's FACE windows
    (the same > 5 s trigger as the light leak); never over a cover, never over short face punctuation.
    `--window a-b` adds a window by hand (the cold-open exception); `--all-faces` captions every face hold.
  - `--over-envato` (a per-video choice, the graph's `--caption-scope envato`; Mike 2026-10-19 for evals) ALSO captions
    every Envato video b-roll beat: each COVER-PLAN.json `cover_beats` row with cover_type `envato-video` becomes a window.
    The sidecar lists them as `cover_windows` so the comp flags exactly those covers `cap: true` (lint_covers).
  - CAPTIONS OFF (Mike, 2026-10-10): a line `Captions OFF: a-b (why)` inside AS-RECORDED's `## FACE windows` section
    SUBTRACTS a-b from every caption window (e.g. a screen share that ships as filmed: still a FACE window for the
    cover track, but its captions would sit over what Mike is showing). Repeatable; OFF wins over --window.
  - GROUPING = montserrat, 2 words per line, up to 4 if every word is <= 4 chars (the longform numbers).
  - CORRECTIONS = the tool's brand dict PLUS the project's AS-RECORDED "wrong" -> "right" mishear list.
Writes:
  video-creation/remotion/src/<PascalProject>Captions.ts   `export const ZCAPTIONS` (SOURCE-spine seconds; the comp
                                                          routes every t through sh()) + `export const CAPTION_WINDOWS`
  <project>/assets/captions.json                          sidecar: file, windows, count, style block (the §13 record)
Usage: python build_project_captions.py <media/<project>> [--scope ALL] [--min-hold 5.0] [--window a-b ...] [--all-faces] [--over-envato]
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
OFF_RE = re.compile(r"Captions OFF\W{0,6}(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)", re.I)
ROW_RE = re.compile(r"\{\s*t:\s*([\d.]+)\s*,\s*h:\s*'((?:[^'\\]|\\.)*)'\s*\}")
STYLE = {"fontFamily": "Montserrat,'Arial Black','Segoe UI',sans-serif", "fontWeight": 900, "textTransform": "lowercase",
         "WebkitTextStroke": "12px #000", "paintOrder": "stroke fill", "pop": "scale 0.7 -> 1.12 -> 1 over ~9f",
         "position": "bottom-center, TOPMOST (after the light-leak overlay in the tree)",
         "load": "@remotion/google-fonts/Montserrat"}


def pascal(slug: str) -> str:
    return "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", slug) if p)


def subtract(windows, offs):
    """windows minus every OFF span (a window split by a span keeps both sides; slivers under 50 ms dropped)."""
    out = []
    for a, b in windows:
        pieces = [(a, b)]
        for x, y in offs:
            nxt = []
            for p, q in pieces:
                if y <= p or x >= q:
                    nxt.append((p, q))
                    continue
                if p < x:
                    nxt.append((p, x))
                if y < q:
                    nxt.append((y, q))
            pieces = nxt
        out += [(p, q) for p, q in pieces if q - p > 0.05]
    return out


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
    ap.add_argument("--over-envato", action="store_true", help="also caption every envato-video beat in COVER-PLAN.json")
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
    cover_wins = []
    if a.over_envato:
        cp = proj / "COVER-PLAN.json"
        if not cp.is_file():
            print("FATAL: --over-envato needs COVER-PLAN.json", file=sys.stderr)
            sys.exit(2)
        beats = json.loads(cp.read_text(encoding="utf-8")).get("cover_beats") or []
        cover_wins = sorted((float(b["tIn"]), float(b["tOut"])) for b in beats
                            if str(b.get("cover_type", "")).lower() == "envato-video" and float(b["tOut"]) > float(b["tIn"]))
        if not cover_wins:
            print("FATAL: --over-envato but COVER-PLAN.json has no envato-video beat", file=sys.stderr)
            sys.exit(1)
        windows += cover_wins
        print(f"OVER-ENVATO {len(cover_wins)} envato-video beat(s) captioned")
    offs = [(float(x), float(y)) for x, y in OFF_RE.findall(sec.group(0) if sec else "")]
    if offs:
        windows = subtract(windows, offs)
        for x, y in offs:
            print(f"CAPTIONS-OFF {x:.3f}-{y:.3f} (AS-RECORDED FACE windows section)")
    windows.sort()
    merged = []                                  # butt-joined envato slots (and a slot touching a face hold) become one window
    for x, y in windows:
        if merged and x - merged[-1][1] <= 0.05:
            merged[-1] = (merged[-1][0], max(merged[-1][1], y))
        else:
            merged.append((x, y))
    windows = merged
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
    # ROW_RE captures the JS-escaped literal (`you\'ll`); UNESCAPE it before the corrections + the re-escape below,
    # or every apostrophe ships as a visible backslash (`you\'ll` on screen; retire-early comp_build, 2026-10-11).
    rows = [(float(t), re.sub(r"\\(.)", r"\1", h)) for t, h in ROW_RE.findall(tmp.read_text(encoding="utf-8"))]
    kept = []
    for t, h in rows:
        if any(fa - 0.05 <= t <= fz for fa, fz in windows):
            for w, rr in fixes:
                # WORD-BOUNDED (growth-vs-product 2026-10-23): the bare pattern rewrote the "ab" inside "accountable"
                # into "accounta/ble" from the AS-RECORDED fix "AB" -> "A/B"
                h = re.sub(r"(?<![a-z0-9])" + re.escape(w) + r"(?![a-z0-9])", rr, h, flags=re.I)
            kept.append((t, h.lower().replace("\u2014", ",")))
    if not kept:
        print("FATAL: no caption group falls inside the windows", file=sys.stderr)
        sys.exit(1)
    # a fix whose words SPAN two caption groups never matches a group (tao-detailed 2026-10-17: "or the long haul" was split
    # "production or" | "the long haul?" and shipped wrong); say so, so the fix is re-keyed on one group
    joined = " ".join(h for _, h in kept)
    for w, rr in fixes:
        if re.search(re.escape(w), joined, flags=re.I) and not re.search(re.escape(rr), joined, flags=re.I):
            print(f"  WARN  mishear fix \"{w}\" -> \"{rr}\" spans two caption groups and was NOT applied: add a fix keyed on one group")
    name = pascal(proj.name) + "Captions.ts"
    dest = REMOTION_SRC / name
    body = [f"// {name}: GENERATED {date.today().isoformat()} by longform-edited/scripts/build_project_captions.py",
            f"// (build_captions.py --style montserrat --max-words {a.max_words} --max-short {a.max_short} on {wj.name}; "
            "filtered to " + ("EVERY FACE hold" if a.all_faces else f"the FACE holds > {a.min_hold}s")
            + (" + every envato-video beat" if cover_wins else "") + (", minus the AS-RECORDED Captions OFF spans" if offs else "")
            + "). NEVER hand-edit; re-run the graph's captions node.",
            "// Times are SOURCE-spine seconds: the comp routes every t through sh() (card pauses).",
            "export const CAPTION_WINDOWS: [number, number][] = [" + ", ".join(f"[{fa:.3f}, {fz:.3f}]" for fa, fz in windows) + "];",
            "export const ZCAPTIONS: { t: number; h: string }[] = ["]
    body += [f"  {{ t: {t:7.2f}, h: '{h.replace(chr(92), chr(92) * 2).replace(chr(39), chr(92) + chr(39))}' }}," for t, h in kept]
    body += ["];", ""]
    dest.write_text("\n".join(body), encoding="utf-8", newline="\n")
    side = proj / "assets" / "captions.json"
    side.parent.mkdir(parents=True, exist_ok=True)
    side.write_text(json.dumps({"file": str(dest), "words": str(wj), "windows": windows, "captions_off": offs,
                                "all_faces": a.all_faces, "cover_windows": cover_wins,
                                "skipped_short_faces": skipped,
                                "min_hold_s": a.min_hold, "groups": len(kept), "grouping": {"max_words": a.max_words, "max_short": a.max_short},
                                "corrections_applied": len(fixes), "style": STYLE, "first_groups": kept[:6]}, indent=2), encoding="utf-8")
    print(f"CAPTIONS-BUILT groups={len(kept)} windows={len(windows)} file={dest}")
    print(f"WROTE {side}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
