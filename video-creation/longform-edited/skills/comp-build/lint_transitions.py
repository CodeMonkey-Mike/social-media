#!/usr/bin/env python
"""
lint_transitions.py — the TRANSITIONS.md gate (comp-build.md §14 skeleton + the three-bucket policy), in CODE
(longform graph `transitions` node, 2026-09-28). Sibling of lint_transition_assets.py, which later checks the
COMP against this plan; this one checks the PLAN against the library, the cue sheet and the spine.

Enforces:
  1. Sections §1 (cards, ONE pick) · §2 (glitch stills) · §3 (face + b-roll + text containers) · §4 (marquees, table)
  2. Every transition id carries a source prefix (rmn: / lib: / hand:); a `?:` or bare id is a gap
  3. Every `lib:<id>` resolves in assets/transitions/library.json (families with `*` allowed in prose)
  4. ONE card pick, ONE face pick; at most one melt family and one spin family in §4
  5. With AS-RECORDED.md present: every chapter `card ON` and every FACE cut-in appears in the plan (±0.6 s)
  6. No em dashes
Usage: python lint_transitions.py <media/<project>>   (reads TRANSITIONS.md, TRANSITION-PLAN.json if present)
Exit: 0 PASS · 1 FAIL · 2 usage. Machine line: TRANSITIONS-LINT PASS|FAIL rows=N fails=N warns=N
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
LIB = HERE.parents[2] / "assets" / "transitions" / "library.json"   # skills/comp-build/ -> video-creation/
CH_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)


def lib_ids():
    raw = json.loads(LIB.read_text(encoding="utf-8"))
    rows = raw if isinstance(raw, list) else (raw.get("rows") or raw.get("transitions") or next(iter(raw.values())))
    return {r["id"] for r in rows if isinstance(r, dict) and r.get("id")}


def main():
    if len(sys.argv) < 2:
        print("usage: lint_transitions.py <media/<project>>", file=sys.stderr)
        sys.exit(2)
    proj = Path(sys.argv[1]).resolve()
    doc_p, plan_p, ar_p = proj / "TRANSITIONS.md", proj / "TRANSITION-PLAN.json", proj / "AS-RECORDED.md"
    fails, warns = [], []
    if not doc_p.is_file():
        print("  FAIL  TRANSITIONS.md missing")
        print("TRANSITIONS-LINT FAIL rows=0 fails=1 warns=0")
        sys.exit(1)
    doc = doc_p.read_text(encoding="utf-8")
    ids = lib_ids()
    if "—" in doc:
        fails.append("em dash found (persona rule)")
    for n, sec in ((1, "Chapter / title cards"), (2, "Glitchy-fast hits"), (3, "Face + b-roll"), (4, "DIAGRAM / CHART MARQUEES")):
        if not re.search(rf"^##\s+{n}\.\s+{re.escape(sec)}", doc, re.M):
            fails.append(f"missing section `## {n}. {sec}...`")
    if re.search(r"\?:[a-z]", doc):
        fails.append("a transition without a source prefix (`?:` marker): every id must be rmn: / lib: / hand:")
    for tid in sorted(set(re.findall(r"\blib:([a-z0-9][a-z0-9_.*-]*)", doc))):
        if "*" in tid:
            continue
        if tid not in ids:
            if any(i.startswith(tid + "-") for i in ids):
                warns.append(f"lib:{tid} is a FAMILY shorthand in prose (fine); the per-cut rows must carry exact ids")
            else:
                fails.append(f"lib:{tid} does not resolve in assets/transitions/library.json")
    card_picks = set(re.findall(r"This video = \*\*(rmn:[a-z0-9-]+)\*\*", doc))
    if len(card_picks) != 1:
        fails.append(f"§1 must name exactly ONE rmn: card pick (found {sorted(card_picks)})")
    face_picks = set(re.findall(r"FACE cut in/out → \*\*((?:lib|hand):[a-z0-9-]+)\*\*", doc))
    if len(face_picks) != 1:
        fails.append(f"§3 must name exactly ONE face pick (found {sorted(face_picks)})")
    sec4 = re.search(r"^##\s+4\..*?(?=^##\s|\Z)", doc, re.M | re.S)
    if sec4:
        melt_fams = {re.sub(r"-\d+$", "", m) for m in re.findall(r"\|\s*MELT\s*\|\s*lib:([a-z0-9-]+)", sec4.group(0))}
        spin_fams = {re.sub(r"-(short-)?(left|right|up|down)$", "", m) for m in re.findall(r"\|\s*SPIN\s*\|\s*lib:([a-z0-9-]+)", sec4.group(0))}
        if len(melt_fams) > 1:
            fails.append(f"§4 uses more than one MELT look: {sorted(melt_fams)}")
        if len(spin_fams) > 1:
            fails.append(f"§4 uses more than one SPIN look: {sorted(spin_fams)}")
    rows = 0
    plan = json.loads(plan_p.read_text(encoding="utf-8")) if plan_p.is_file() else None
    tcs = []
    if plan:
        for r in plan.get("transitions") or []:
            try:
                tcs.append((float(r.get("tc")), str(r.get("role", "")), str(r.get("id", ""))))
            except (TypeError, ValueError):
                fails.append(f"TRANSITION-PLAN.json row without a numeric tc: {str(r)[:60]}")
        rows = len(tcs)
        for tc, role, tid in tcs:
            if role in ("MELT-transform", "SPIN-newfacet"):
                row = next(r for r in plan["transitions"] if str(r.get("id", "")) == tid and float(r.get("tc", -1)) == tc)
                if not row.get("sfx_duck"):
                    fails.append(f"{role} at {tc:.2f}s must set sfx_duck true")
                if not re.search(r"TRANSFORM|NEW.?FACET", str(row.get("why", "")), re.I):
                    fails.append(f"{role} at {tc:.2f}s: `why` must justify TRANSFORM vs NEW FACET")
    else:
        warns.append("TRANSITION-PLAN.json absent: per-cut coverage (cards, face cuts) not checked")
    if ar_p.is_file() and plan:
        ar = ar_p.read_text(encoding="utf-8")
        for m in CH_RE.finditer(ar):
            if re.search(r"card\s+ON", m.group(5)):
                ta = float(m.group(3))
                if not any(abs(tc - ta) <= 0.6 and role == "card" for tc, role, _ in tcs):
                    fails.append(f"{m.group(1)} title card at {ta:.2f}s has no `card` row in the plan")
        sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar, re.M | re.S)
        for fm in FACE_RE.finditer(sec.group(0) if sec else ""):
            fa, fz = float(fm.group(1)), float(fm.group(2))
            for edge, label in ((fa, "cut-in"), (fz, "cut-out")):
                if edge <= 0.05:
                    continue
                if not any(abs(tc - edge) <= 0.6 and role == "face-cut" for tc, role, _ in tcs):
                    fails.append(f"FACE {label} at {edge:.2f}s has no `face-cut` row in the plan")
    print(f"\nlint_transitions — {proj.name}\n{'-' * 64}")
    for w in warns:
        print(f"  warn  {w}")
    for f in fails:
        print(f"  FAIL  {f}")
    print("-" * 64)
    print(f"TRANSITIONS-LINT {'FAIL' if fails else 'PASS'} rows={rows} fails={len(fails)} warns={len(warns)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
