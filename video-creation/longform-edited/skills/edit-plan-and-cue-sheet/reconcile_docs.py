#!/usr/bin/env python
"""
reconcile_docs.py — fan the TRANSITION-PLAN.json picks back into EDIT-PLAN.md + CUE-SHEET.md and prove the
blueprint set agrees with itself (longform graph `reconcile_docs` node, 2026-09-28; Python, no JS twin).

The three blueprint documents are authored in sequence (event log -> cue sheet -> transitions), so the rows
written first still say `→TRANSITIONS.md` where the strategist has since picked the exact move. This script:
  --apply   replaces every `→TRANSITIONS.md` placeholder in EDIT-PLAN.md with the matching plan row
            (`→ lib:melt-rgb-3 (MELT-transform, 0.76s)`), matched by timecode (±0.6 s) and by the row's
            role vs the line's wording; rewrites the CUE-SHEET TRANSITIONS section's "not authored yet"
            paragraph into the resolved picks and marks the marquee candidates CHOSEN / NOT taken; and
            re-stamps both headers. Idempotent: a second run changes nothing.
  (always)  the CROSS-CHECK: zero placeholders left · every plan row has an EDIT-PLAN event within 0.6 s ·
            every [TRANSITION] event carries a prefixed id · every plan id appears in EDIT-PLAN.md · every
            COVER-PLAN beat tIn and every MUSIC-PLAN bed start has an event within 0.6 s · TRANSITIONS.md §5
            carries every plan row · no em dashes.
Usage: python reconcile_docs.py <media/<project>> [--apply]
Exit 0 = PASS · 1 = FAIL · 2 = usage. Machine line: RECONCILE PASS|FAIL resolved=N placeholders_left=N fails=N
"""
import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PLACEHOLDER = "→TRANSITIONS.md"
EVENT_RE = re.compile(r"^(\d+):(\d{2}\.\d)\s+")
ROLE_HINTS = [  # (regex on the line, role) checked in order; first hit wins
    (r"card presentation|same card pick|\[CARD\]|title card", "card"),
    (r"face→cover|cover→face|face cut|face pick|\[FACE\]", "face-cut"),
    (r"MELT", "MELT-transform"),
    (r"SPIN", "SPIN-newfacet"),
    (r"AI still|IMG-\d|badsignal|cross-warp", "glitch-still"),
    (r"dissolve|BR-\d|Envato|fade", "broll-fade"),
    (r"punch", "punch-in"),
    (r"cross-fade|ingress|scale-in|quiet|xfade|\[CONTAINER\]|\[DIAGRAM\]|\[CHART\]|\[RECEIPT\]", "container-xfade"),
]


def mmss(t):
    t = float(t)
    return f"{int(t // 60)}:{t % 60:04.1f}"


def line_time(lines, i):
    """The timecode that owns line i (its own, or the nearest timecoded line above)."""
    for k in range(i, -1, -1):
        m = EVENT_RE.match(lines[k])
        if m:
            return int(m.group(1)) * 60 + float(m.group(2))
        if lines[k].startswith("## ") or lines[k].startswith("```"):
            break
    return None


def pick_row(rows, t, line):
    near = [r for r in rows if abs(r["tc"] - t) <= 0.6]
    if not near:
        return None
    if len(near) == 1:
        return near[0]
    for rx, role in ROLE_HINTS:
        if re.search(rx, line, re.I):
            for r in near:
                if r["role"] == role:
                    return r
    return min(near, key=lambda r: abs(r["tc"] - t))


def apply_edit_plan(text, rows):
    lines = text.split("\n")
    resolved, unresolved = 0, []
    for i, ln in enumerate(lines):
        if PLACEHOLDER not in ln:
            continue
        if ln.startswith(">"):
            lines[i] = ln.replace(f"Transition ids marked `{PLACEHOLDER}` resolve in that file", "Transition ids are RESOLVED from TRANSITION-PLAN.json")
            lines[i] = re.sub(r"\(NOT authored yet:[^)]*\)?", f"(reconciled {date.today().isoformat()})", lines[i])
            if PLACEHOLDER in lines[i]:
                lines[i] = lines[i].replace(PLACEHOLDER, "TRANSITIONS.md")
            continue
        t = line_time(lines, i)
        row = pick_row(rows, t, ln) if t is not None else None
        if row is None:
            unresolved.append(f"{mmss(t) if t is not None else '?'}: {ln.strip()[:80]}")
            continue
        lines[i] = ln.replace(PLACEHOLDER, f"→ {row['id']} ({row['role']}, {row['dur']:.2f}s)", 1)
        resolved += 1
    # second pass: plan rows whose id still appears nowhere get tagged onto the matching event line
    # (e.g. the seed's `[PUNCH-IN]` rows carried no id); matched by time (±0.6 s) and role hint
    joined = "\n".join(lines)
    for row in rows:
        if row["id"] in joined and any(row["id"] in ln and abs((line_time(lines, i) or -9) - row["tc"]) <= 0.6
                                       for i, ln in enumerate(lines)):
            continue
        best = None
        for i, ln in enumerate(lines):
            m = EVENT_RE.match(ln)
            if not m:
                continue
            t = int(m.group(1)) * 60 + float(m.group(2))
            if abs(t - row["tc"]) > 0.6 or "SAY:" in ln:
                continue
            hint = next((role for rx, role in ROLE_HINTS if re.search(rx, ln, re.I)), None)
            score = (hint == row["role"], -abs(t - row["tc"]))
            if best is None or score > best[0]:
                best = (score, i)
        if best and best[0][0]:
            lines[best[1]] = lines[best[1]].rstrip() + f" → {row['id']} ({row['role']}, {row['dur']:.2f}s)"
            resolved += 1
            joined = "\n".join(lines)
        else:
            unresolved.append(f"{mmss(row['tc'])}: no event line to carry {row['id']} ({row['role']})")
    return "\n".join(lines), resolved, unresolved


def apply_cue_sheet(text, plan, rows):
    card = (plan.get("card_pick") or {}).get("id", "")
    face = (plan.get("face_glitch_pick") or {}).get("id", "")
    marquee = [r for r in rows if r["role"] in ("MELT-transform", "SPIN-newfacet")]
    stills = [r for r in rows if r["role"] == "glitch-still"]
    para = (f"RESOLVED {date.today().isoformat()} from TRANSITION-PLAN.json ({len(rows)} scene changes, every one in TRANSITIONS.md §5): "
            f"card = `{card}` on both chapter cards · face cut in/out = `{face}` "
            + ("(" + ", ".join(r["id"] for r in rows if r["role"] == "face-cut") + ") " if any(r["role"] == "face-cut" for r in rows) else "")
            + "· AI stills = " + (", ".join(f"{r['id']} @{mmss(r['tc'])}" for r in stills) or "none")
            + " · marquees = " + (", ".join(f"{r['id']} @{mmss(r['tc'])} ({r['role']})" for r in marquee) or "none")
            + " · Envato video = hand:fade · container / diagram swaps = hand:xfade-scale · punch-ins = hand:punch.")
    new = re.sub(r"TRANSITIONS\.md is NOT authored yet:.*?(?=\nCHAPTER cards \(ON only)", para, text, count=1, flags=re.S)
    for r in marquee:
        kind = "MELT" if "MELT" in r["role"] else "SPIN"
        new = re.sub(rf"^(- {kind} candidate {re.escape(mmss(r['tc']))}[^\n]*?)(\s*→ CHOSEN[^\n]*)?$",
                     rf"\1 → CHOSEN `{r['id']}`", new, count=1, flags=re.M)
    for kind in ("MELT", "SPIN"):
        for m in re.finditer(rf"^- {kind} candidate (\d+:\d\d\.\d)[^\n]*$", new, re.M):
            ln = m.group(0)
            t = int(m.group(1).split(":")[0]) * 60 + float(m.group(1).split(":")[1])
            if "CHOSEN" not in ln and "NOT taken" not in ln and not any(abs(r["tc"] - t) <= 0.6 for r in marquee):
                new = new.replace(ln, ln + " → NOT taken (see TRANSITIONS.md §4)", 1)
    return new


def cross_check(proj: Path, rows, plan):
    fails = []
    ep, cs, tr = (proj / n for n in ("EDIT-PLAN.md", "CUE-SHEET.md", "TRANSITIONS.md"))
    for p in (ep, cs, tr):
        if not p.is_file():
            fails.append(f"MISSING {p.name}")
    if fails:
        return fails, 0
    e, c, t = (p.read_text(encoding="utf-8") for p in (ep, cs, tr))
    left = e.count(PLACEHOLDER) + c.count(PLACEHOLDER)
    if left:
        fails.append(f"{left} `{PLACEHOLDER}` placeholder(s) still unresolved (run with --apply, then fix the leftovers by hand)")
    for name, txt in (("EDIT-PLAN.md", e), ("CUE-SHEET.md", c), ("TRANSITIONS.md", t)):
        if "—" in txt:
            fails.append(f"{name}: em dash found (persona rule)")
    times = [int(m.group(1)) * 60 + float(m.group(2)) for m in (EVENT_RE.match(ln) for ln in e.split("\n")) if m]
    for r in rows:
        if not any(abs(x - r["tc"]) <= 0.6 for x in times):
            fails.append(f"plan row {r['id']} at {r['tc']:.2f}s has no EDIT-PLAN event within 0.6 s")
        if r["id"] not in e:
            fails.append(f"plan id {r['id']} ({r['role']} at {r['tc']:.2f}s) never appears in EDIT-PLAN.md")
    for ln in e.split("\n"):
        if EVENT_RE.match(ln) and "[TRANSITION]" in ln and not re.search(r"(rmn|lib|hand):[a-z0-9-]+", ln):
            fails.append(f"[TRANSITION] event without a prefixed id: {ln.strip()[:80]}")
    cp = proj / "COVER-PLAN.json"
    if cp.is_file():
        for b in json.loads(cp.read_text(encoding="utf-8")).get("cover_beats") or []:
            if not any(abs(x - float(b["tIn"])) <= 0.6 for x in times):
                fails.append(f"cover beat at {float(b['tIn']):.2f}s ({str(b.get('what', ''))[:40]}) has no EDIT-PLAN event within 0.6 s")
    mp = proj / "MUSIC-PLAN.json"
    if mp.is_file():
        for bed in json.loads(mp.read_text(encoding="utf-8")).get("beds") or []:
            a0 = float(bed["span"][0])
            if not any(abs(x - a0) <= 0.6 for x in times):
                fails.append(f"music bed {bed.get('chapter')} starting {a0:.2f}s has no EDIT-PLAN event within 0.6 s")
    sec5 = re.search(r"^##\s+5\..*?(?=^##\s|\Z)", t, re.M | re.S)
    n5 = len(re.findall(r"^\|\s*\d+:\d\d\.\d\s*\|", sec5.group(0), re.M)) if sec5 else 0
    if n5 != len(rows):
        fails.append(f"TRANSITIONS.md §5 lists {n5} rows, TRANSITION-PLAN.json has {len(rows)}")
    return fails, left


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    pp = proj / "TRANSITION-PLAN.json"
    if not pp.is_file():
        print("FATAL: TRANSITION-PLAN.json missing", file=sys.stderr)
        sys.exit(2)
    plan = json.loads(pp.read_text(encoding="utf-8"))
    rows = []
    for r in plan.get("transitions") or []:
        rows.append({"tc": float(r["tc"]), "role": str(r.get("role", "")), "id": str(r.get("id", "")),
                     "dur": float(r.get("duration_s") or 0)})
    resolved = 0
    if a.apply:
        ep, cs = proj / "EDIT-PLAN.md", proj / "CUE-SHEET.md"
        e = ep.read_text(encoding="utf-8")
        e2, resolved, unresolved = apply_edit_plan(e, rows)
        if e2 != e:
            ep.write_text(e2, encoding="utf-8", newline="\n")
        for u in unresolved:
            print(f"  warn  no plan row matches the placeholder at {u}")
        c = cs.read_text(encoding="utf-8")
        c2 = apply_cue_sheet(c, plan, rows)
        if c2 != c:
            cs.write_text(c2, encoding="utf-8", newline="\n")
        print(f"  note  resolved {resolved} placeholder(s) in EDIT-PLAN.md; CUE-SHEET TRANSITIONS section {'rewritten' if c2 != c else 'unchanged'}")
    fails, left = cross_check(proj, rows, plan)
    print(f"\nreconcile_docs — {proj.name}\n{'-' * 64}")
    for f in fails:
        print(f"  FAIL  {f}")
    print("-" * 64)
    print(f"RECONCILE {'FAIL' if fails else 'PASS'} resolved={resolved} placeholders_left={left} fails={len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
