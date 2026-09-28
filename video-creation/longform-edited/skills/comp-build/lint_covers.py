#!/usr/bin/env python
"""
lint_covers.py — MECHANICAL pre-render gate for the longform-edited cover layer (Python port of
lint-covers.js, 2026-09-28; the JS twin is frozen rollback).

Rules that kept getting violated because they lived only as prose (Mike, 2026-06-30: "I constantly
come across violations of rules"). Enforced in CODE so a non-compliant comp CANNOT be rendered.

  python video-creation/longform-edited/skills/comp-build/lint_covers.py <comp.tsx>

Parses the comp's COVERS array + CAPTION_SRC and asserts:
  #12 (longform-edited.md)        no b-roll asset (still/clip) ref appears twice
  #2  (broll-and-containers.md)   no b-roll clip > 4.0 s (> 5.0 s if flagged `lead: true`)
  captions-never-over-cover       no CAPTION_SRC window overlaps a COVER window unless `cap: true`
  no overlap / no > 0.5 s gap between consecutive covers (WARN)
  WARNs to JUSTIFY: CONTAINER SCATTER (a deck/receipt/chart ref in > 2 spots), LONG HOLD (> 35 s),
  STATELESS deck covers, STATE SWAPs (confirm the ingress transition is suppressed).
B-roll kinds (subject to #2/#12): still, stillglitch, vid, vidglitch. Exempt: chart, split, deck, receipt.
A derived comp (the VERTICAL cut) that IMPORTS COVERS from its 16:9 parent is followed to that file.
Exit: 0 = OK (warnings allowed) · 1 = violations · 2 = could not parse.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BROLL = {"still", "stillglitch", "vid", "vidglitch"}
CONTAINER = {"deck", "receipt", "chart"}
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
        covers.append({"tIn": float(r.group(1)), "tOut": float(r.group(2)), "kind": r.group(3),
                       "ref": r.group(4), "lead": bool(re.search(r"lead:\s*true", extra)),
                       "cap": bool(re.search(r"cap:\s*true", extra)), "state": st.group(1) if st else None})
    return covers


def parse_caption_windows(src: str):
    m = re.search(r"CAPTION_SRC[^=]*=\s*\[([\s\S]*?)\]\s*;", src)
    block = m.group(1) if m else ""
    return [(float(a), float(b)) for a, b in re.findall(r"\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]", block)]


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
    if len(sys.argv) < 2:
        print("usage: lint_covers.py <comp.tsx>", file=sys.stderr)
        sys.exit(2)
    path = Path(sys.argv[1])
    src = load_source(path)
    covers = parse_covers(src)
    if not covers:
        print(f"lint_covers: could not parse a COVERS array in {path}", file=sys.stderr)
        sys.exit(2)
    errs, warns, n_broll = lint(covers, parse_caption_windows(src))
    for w in warns:
        print("  warn  " + w)
    if errs:
        print(f"\nlint_covers: {len(errs)} VIOLATION(S) in {path}:")
        for e in errs:
            print("  FAIL  " + e)
        print("\nFix these before rendering (PRE-RENDER GATE).")
        print(f"COVERS-LINT FAIL covers={len(covers)} fails={len(errs)} warns={len(warns)}")
        sys.exit(1)
    print(f"lint_covers: OK; {len(covers)} covers, {n_broll} distinct b-roll, all <=4s, captions clear of covers.")
    print(f"COVERS-LINT PASS covers={len(covers)} fails=0 warns={len(warns)}")


if __name__ == "__main__":
    main()
