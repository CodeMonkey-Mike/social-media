#!/usr/bin/env python
"""
lint_covers.py — MECHANICAL pre-render gate for the longform-edited cover layer (Python port of
lint-covers.js, 2026-09-28; the JS twin is frozen rollback).

Rules that kept getting violated because they lived only as prose (Mike, 2026-06-30: "I constantly
come across violations of rules"). Enforced in CODE so a non-compliant comp CANNOT be rendered.

  python video-creation/longform-edited/skills/comp-build/lint_covers.py <comp.tsx> [--plan <COVER-PLAN.json>]

Parses the comp's COVERS array + CAPTION_SRC and asserts:
  #12 (longform-edited.md)        no b-roll asset (still/clip) ref appears twice
  #2  (broll-and-containers.md)   no b-roll clip > 4.0 s (> 5.0 s if flagged `lead: true`)
  captions-never-over-cover       no CAPTION_SRC window overlaps a COVER window unless `cap: true`
  no overlap / no > 0.5 s gap between consecutive covers (WARN)
  WARNs to JUSTIFY: CONTAINER SCATTER (a deck/receipt/chart ref in > 2 spots), LONG HOLD (> 35 s),
  STATELESS deck covers, STATE SWAPs (confirm the ingress transition is suppressed).
B-roll kinds (subject to #2/#12): still, stillglitch, vid, vidglitch. Exempt: chart, split, deck, receipt.
WHITEBOARD beats (kind 'whiteboard', ref = the WB id; comp-build.md section 4b, 2026-11-01): exempt from #2 (a beat is 15 to
30 s), and #12 holds with ONE exception: a FACE window inside a beat splits it into rows with the same ref, each carrying
`from:` = its tIn minus the first row's tIn (the clip's clock runs with the spine), never overlapping, spanning <= 30.5 s.
--plan: every COVER-PLAN `whiteboards[]` beat is placed (a whiteboard row with its ref, starting at its planned tIn).
FACE BODY (screen-share face mode, longform-edited.md house rule #1b; comp-build.md section 4c): the comp's `FACE_BODY` array
paints the deck area during the FACE windows. Every row sits inside a plan FACE window, never overlaps a COVERS row or another
FACE_BODY row; with --plan every `face_body[]` row is placed (same ref, same tIn) and a plan with rows needs the array.
A derived comp (the VERTICAL cut) that IMPORTS COVERS from its 16:9 parent is followed to that file.
Exit: 0 = OK (warnings allowed) · 1 = violations · 2 = could not parse.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BROLL = {"still", "stillglitch", "vid", "vidglitch"}
CONTAINER = {"deck", "receipt", "chart"}
WHITEBOARD = {"whiteboard"}
WB_MAX_SPAN = 30.5   # whiteboard-beat.md: a beat is 15 to 30 s
ROW = re.compile(r"\{\s*tIn:\s*([\d.]+)\s*,\s*tOut:\s*([\d.]+)\s*,\s*kind:\s*'([^']+)'(?:\s*,\s*ref:\s*'([^']+)')?([^}]*)\}")


def load_source(path: Path):
    src = path.read_text(encoding="utf-8")
    if not re.search(r"COVERS[^=]*=\s*\[", src):
        imp = re.search(r"import\s*\{[^}]*\bCOVERS\b[^}]*\}\s*from\s*['\"]\./([\w.-]+)['\"]", src)
        if imp:
            p2 = path.parent / (re.sub(r"\.tsx?$", "", imp.group(1)) + ".tsx")
            if p2.is_file():
                print(f"  note  COVERS is imported from ./{imp.group(1)}; linting that file's table (shared by both cuts).")
                src = p2.read_text(encoding="utf-8")
    return src


def parse_covers(src: str):
    m = re.search(r"COVERS[^=]*=\s*\[([\s\S]*?)\];", src)
    block = m.group(1) if m else ""
    covers = []
    for r in ROW.finditer(block):
        extra = r.group(5) or ""
        st = re.search(r"state:\s*'([^']+)'", extra)
        fr = re.search(r"\bfrom:\s*([\d.]+)", extra)
        covers.append({"tIn": float(r.group(1)), "tOut": float(r.group(2)), "kind": r.group(3),
                       "ref": r.group(4), "lead": bool(re.search(r"lead:\s*true", extra)),
                       "cap": bool(re.search(r"cap:\s*true", extra)), "state": st.group(1) if st else None,
                       "from": float(fr.group(1)) if fr else None})
    return covers


def parse_caption_windows(src: str):
    m = re.search(r"CAPTION_SRC[^=]*=\s*\[([\s\S]*?)\]\s*;", src)
    block = m.group(1) if m else ""
    return [(float(a), float(b)) for a, b in re.findall(r"\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]", block)]


def lint_whiteboards(covers, plan=None):
    """WHITEBOARD rows: #12 with the FACE-split continuation exception, and (with a plan) every planned beat placed."""
    errs = []
    by_ref = {}
    for c in covers:
        if c["kind"] in WHITEBOARD:
            if not c["ref"]:
                errs.append(f"WHITEBOARD row at {c['tIn']}s has no ref (the WB id)")
                continue
            by_ref.setdefault(c["ref"], []).append(c)
    for ref, rows in by_ref.items():
        rows.sort(key=lambda c: c["tIn"])
        first = rows[0]
        if rows[-1]["tOut"] - first["tIn"] > WB_MAX_SPAN + 1e-6:
            errs.append(f"WHITEBOARD {ref} spans {rows[-1]['tOut'] - first['tIn']:.2f}s ({first['tIn']}->{rows[-1]['tOut']}), "
                        f"a beat is at most 30 s (whiteboard-beat.md)")
        for i, c in enumerate(rows):
            want = round(c["tIn"] - first["tIn"], 3)
            got = c["from"] if c["from"] is not None else (0.0 if i == 0 else None)
            if got is None or abs(got - want) > 0.05:
                errs.append(f"#12 REUSE: whiteboard \"{ref}\" row @{c['tIn']}s needs `from: {want:g}` (a second row of a beat is ONLY "
                            "its continuation across a FACE window, the clip's clock running with the spine)")
            if i and c["tIn"] < rows[i - 1]["tOut"] - 0.01:
                errs.append(f"WHITEBOARD {ref}: rows overlap near {c['tIn']}s")
    for w in (plan or {}).get("whiteboards") or []:
        wid, t = str(w.get("id")), float(w.get("tIn") or 0)
        rows = by_ref.get(wid) or []
        if not rows:
            errs.append(f"WHITEBOARD {wid} is planned (COVER-PLAN whiteboards) but no `kind: 'whiteboard'` row places it")
        elif abs(rows[0]["tIn"] - t) > 0.1:
            errs.append(f"WHITEBOARD {wid} starts at {rows[0]['tIn']}s in the comp, the plan says {t}s (the drawing is cued to the words)")
    return errs, len(by_ref)


def parse_face_body(src: str):
    m = re.search(r"FACE_BODY[^=]*=\s*\[([\s\S]*?)\];", src)
    if not m:
        return None
    rows = []
    for r in ROW.finditer(m.group(1)):
        fr = re.search(r"\bfrom:\s*([\d.]+)", r.group(5) or "")
        rows.append({"tIn": float(r.group(1)), "tOut": float(r.group(2)), "kind": r.group(3), "ref": r.group(4),
                     "from": float(fr.group(1)) if fr else None})
    return rows


def lint_face_body(fb, covers, plan=None):
    """Screen-share deck-area rows (house rule #1b): inside a FACE window, clear of every cover and of each other, all planned rows placed."""
    errs = []
    planned = (plan or {}).get("face_body") or []
    faces = [(float(a), float(z)) for a, z in ((plan or {}).get("face_windows") or [])]
    if fb is None:
        if planned:
            errs.append(f"FACE BODY: COVER-PLAN carries {len(planned)} face_body row(s) but the comp declares no FACE_BODY array (comp-build.md section 4c)")
        return errs
    for r in fb:
        if r["tOut"] <= r["tIn"]:
            errs.append(f"FACE BODY row at {r['tIn']}s has no length")
        if faces and not any(a - 0.05 <= r["tIn"] and r["tOut"] <= z + 0.05 for a, z in faces):
            errs.append(f"FACE BODY row {r['ref'] or r['kind']} {r['tIn']}->{r['tOut']} is not inside a FACE window {faces}")
        for c in covers:
            if r["tIn"] < c["tOut"] and c["tIn"] < r["tOut"]:
                errs.append(f"FACE BODY row {r['ref'] or r['kind']} @{r['tIn']}s overlaps cover \"{c['ref'] or c['kind']}\" [{c['tIn']},{c['tOut']}] (a FACE window carries no cover)")
                break
    rows = sorted(fb, key=lambda r: r["tIn"])
    for i in range(1, len(rows)):
        if rows[i]["tIn"] < rows[i - 1]["tOut"] - 0.01:
            errs.append(f"FACE BODY rows overlap near {rows[i]['tIn']}s")
    for p in planned:
        pid, ref, t = str(p.get("id")), str(p.get("asset")), float(p.get("tIn") or 0)
        hit = [r for r in fb if r["ref"] == ref and abs(r["tIn"] - t) <= 0.1]
        if not hit:
            errs.append(f"FACE BODY {pid} ({ref} at {t}s) is planned but no FACE_BODY row places it (same ref, same tIn)")
        elif str(p.get("cover_type")) == "whiteboard":
            want = float(p.get("from") or 0)
            got = hit[0]["from"] if hit[0]["from"] is not None else 0.0
            if abs(got - want) > 0.05:
                errs.append(f"FACE BODY {pid}: whiteboard {ref} needs `from: {want:g}` (the clip's clock runs with the spine)")
    return errs


def lint(covers, cap_wins):
    errs, warns = [], []
    seen = {}
    for c in covers:                                        # #12
        if not c["ref"] or c["kind"] not in BROLL:
            continue
        if c["ref"] in seen:
            errs.append(f"#12 REUSE: b-roll \"{c['ref']}\" appears twice (@{seen[c['ref']]}s and @{c['tIn']}s). "
                        "Each still/clip at most once; swap one for a new asset or a container.")
        else:
            seen[c["ref"]] = c["tIn"]
    for c in covers:                                        # #2
        if c["kind"] not in BROLL:
            continue
        d = round(c["tOut"] - c["tIn"], 2)
        cap = 5.0 if c["lead"] else 4.0
        if d > cap + 1e-6:
            errs.append(f"#2 DURATION: {c['kind']} \"{c['ref'] or ''}\" is {d}s ({c['tIn']}->{c['tOut']}), max {cap}s"
                        f"{' (lead)' if c['lead'] else ''}. Split into <=4s clips or carry the stretch with a container.")
    for a, b in cap_wins:                                   # captions never over a cover
        for c in covers:
            if a < c["tOut"] and c["tIn"] < b and not c["cap"]:
                errs.append(f"CAPTIONS-OVER-COVER: caption window [{a},{b}] overlaps cover \"{c['ref'] or c['kind']}\" "
                            f"[{c['tIn']},{c['tOut']}]. Captions never over a cover (flag the cover `cap: true` only if intended).")
                break
    blocks = []                                             # container scatter + long holds
    for c in covers:
        if not c["ref"] or c["kind"] not in CONTAINER:
            continue
        last = blocks[-1] if blocks else None
        if last and last["ref"] == c["ref"] and abs(c["tIn"] - last["end"]) < 0.6:
            last["end"] = c["tOut"]
        else:
            blocks.append({"ref": c["ref"], "start": c["tIn"], "end": c["tOut"]})
    by_ref = {}
    for b in blocks:
        by_ref.setdefault(b["ref"], []).append(b)
    for ref, bl in by_ref.items():
        total = round(sum(b["end"] - b["start"] for b in bl), 1)
        if len(bl) > 2:
            spots = ", @".join(f"{b['start']}s" for b in bl)
            warns.append(f"CONTAINER SCATTER: \"{ref}\" appears in {len(bl)} separate spots (@{spots}), {total}s total. "
                         "Justify each as a deliberate callback or swap in a distinct container.")
        for b in bl:
            d = round(b["end"] - b["start"], 1)
            if d > 35:
                warns.append(f"LONG HOLD: \"{ref}\" held {d}s straight ({b['start']}->{b['end']}). A system-design DIAGRAM "
                             "may hold while explained; a TEXT container must spotlight ONE sub-point at a time.")
    for c in covers:                                        # overview discipline
        if c["kind"] == "deck" and not c["state"]:
            warns.append(f"STATELESS CONTAINER: 'deck' cover \"{c['ref']}\" @{c['tIn']}s has no state; every container "
                         "spotlight must be an explicit choice (one sub-point; a whole-slide 'overview' state only where it fits).")
    seq = sorted(covers, key=lambda c: c["tIn"])
    for i in range(1, len(seq)):
        if seq[i]["ref"] and seq[i]["ref"] == seq[i - 1]["ref"] and abs(seq[i]["tIn"] - seq[i - 1]["tOut"]) < 0.05:
            warns.append(f"STATE SWAP @{seq[i]['tIn']}s: \"{seq[i]['ref']}\" continues with a new state; confirm the comp "
                         "suppresses the ingress transition here (no mid-slide glitch).")
        gap = round(seq[i]["tIn"] - seq[i - 1]["tOut"], 2)
        if gap > 0.5:
            warns.append(f"GAP: {gap}s uncovered between {seq[i - 1]['tOut']}s and {seq[i]['tIn']}s (face beat, or a missing cover?).")
        if gap < -0.01:
            warns.append(f"OVERLAP: covers overlap by {-gap}s near {seq[i]['tIn']}s.")
    return errs, warns, len(seen)


def main():
    argv = sys.argv[1:]
    plan = None
    if "--plan" in argv:
        i = argv.index("--plan")
        try:
            import json
            plan = json.loads(Path(argv[i + 1]).read_text(encoding="utf-8"))
        except (IndexError, OSError, ValueError) as e:
            print(f"lint_covers: --plan needs a readable COVER-PLAN.json ({e})", file=sys.stderr)
            sys.exit(2)
        argv = argv[:i] + argv[i + 2:]
    if len(argv) < 1:
        print("usage: lint_covers.py <comp.tsx> [--plan <COVER-PLAN.json>]", file=sys.stderr)
        sys.exit(2)
    path = Path(argv[0])
    src = load_source(path)
    covers = parse_covers(src)
    # a DECLARED empty table is valid (a short whose spans need no variants, growth-scale-up 10-29); only a missing or
    # unparseable table is an error
    declared_empty = re.search(r"^\s*(?:export\s+)?const\s+COVERS(?![A-Za-z0-9_])[^=\n]*=\s*\[\s*\]\s*;", src, re.M)
    if not covers and not declared_empty:
        print(f"lint_covers: could not parse a COVERS array in {path}", file=sys.stderr)
        sys.exit(2)
    errs, warns, n_broll = lint(covers, parse_caption_windows(src))
    wb_errs, n_wb = lint_whiteboards(covers, plan)
    errs += wb_errs
    fb = parse_face_body(src)
    errs += lint_face_body(fb, covers, plan)
    for w in warns:
        print("  warn  " + w)
    if errs:
        print(f"\nlint_covers: {len(errs)} VIOLATION(S) in {path}:")
        for e in errs:
            print("  FAIL  " + e)
        print("\nFix these before rendering (PRE-RENDER GATE).")
        print(f"COVERS-LINT FAIL covers={len(covers)} fails={len(errs)} warns={len(warns)}")
        sys.exit(1)
    print(f"lint_covers: OK; {len(covers)} covers, {n_broll} distinct b-roll, all <=4s, captions clear of covers"
          + (f", {n_wb} whiteboard beat(s) placed once" if n_wb else "")
          + (f", {len(fb)} screen-share body row(s)" if fb else "") + ".")
    print(f"COVERS-LINT PASS covers={len(covers)} fails=0 warns={len(warns)}")


if __name__ == "__main__":
    main()
