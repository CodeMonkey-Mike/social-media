#!/usr/bin/env python
"""
render_transitions.py — TRANSITION-PLAN.json (the transition-strategist's verified proposal) -> TRANSITIONS.md
in the comp-build.md §14 skeleton. Deterministic, no judgment (longform graph `transitions` node, 2026-09-28).

Usage: python video-creation/longform-edited/skills/comp-build/render_transitions.py <media/<project>> [--force]
Reads:  <project>/TRANSITION-PLAN.json (+ AS-RECORDED.md chapter headers for the card list)
Writes: <project>/TRANSITIONS.md (refuses to overwrite unless --force, so hand edits after GATE 4 survive)
Machine lines: TRANSITION-PLAN rows=N melt=a spin=b · RENDERED <file> · PROGRESS 100%
"""
import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
CH_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)


def mmss(t):
    t = float(t)
    return f"{int(t // 60)}:{t % 60:04.1f}"


def tag(tid: str) -> str:
    tid = str(tid or "")
    return tid if re.match(r"^(rmn|lib|hand):", tid) else f"?:{tid}"


def render(plan: dict, proj: Path) -> str:
    rows = sorted(plan.get("transitions") or [], key=lambda r: float(r.get("tc", 0)))
    card, face = plan.get("card_pick") or {}, plan.get("face_glitch_pick") or {}
    melt, spin = plan.get("melt_pick") or {}, plan.get("spin_pick") or {}
    budget = plan.get("melt_spin_budget") or {}
    L = [f"# {proj.name} - TRANSITIONS plan",
         f"_Rendered {date.today().isoformat()} from `TRANSITION-PLAN.json` (the transition-strategist's proposal, verified by the "
         "graph, gated by Mike at GATE 4) by `skills/comp-build/render_transitions.py`. Three-bucket policy (canonical: "
         "`../../assets/transitions/README.md` + longform-edited.md #5). Glitch ids: `assets/transitions/library.json`. "
         "Do NOT collapse all cuts into the glitch library._", "",
         "**Transition SOURCE prefix (every transition here, in EDIT-PLAN and CUE-SHEET carries one):** `rmn:` = "
         "@remotion/transitions · `lib:` = our transition library · `hand:` = hand-rolled overlay code. A bare name is a gap.", "",
         f"**Spine:** `{plan.get('spine', '')}` · aspect {plan.get('aspect', '16:9')} · {len(rows)} scene changes assigned.", ""]
    L += ["## 1. Chapter / title cards → ONE pick for the whole video",
          f"This video = **{tag(card.get('id'))}**. {card.get('why', '')}",
          "Cards ON at: " + (" · ".join(f"{mmss(c.get('tc', 0))} {c.get('card', '')}" for c in card.get("fires_at") or []) or "(none)")
          + ". Self-contained @remotion/transitions scene; never wrap the locked spine in TransitionSeries.", ""]
    stills = [r for r in rows if str(r.get("role")) == "glitch-still"]
    L += ["## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)",
          "ChatGPT stills + AI clips get a Cinematic Bad Signal ingress from the library:"]
    L += [f"- {mmss(r['tc'])}  {tag(r.get('id'))}  {r.get('change', '')}" for r in stills] or ["- (none in this video)"]
    L.append("")
    L += ["## 3. Face + b-roll + TEXT-containers → hand-rolled overlays on the spine (house rule #5)",
          f"- FACE cut in/out → **{tag(face.get('id'))}** (the per-video pick; {face.get('why', '')}) + ~15-20% punch-in on face beats > 2 s.",
          "- Envato VIDEO b-roll → fade (~0.5 s).   TEXT-container swap → cross-fade + 0.93→1 scale-in (the quiet default).", ""]
    L += ["## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)",
          f"ONE melt look (`lib:{melt.get('family', '')}-*`, {melt.get('why', '')}) + ONE spin look (`lib:{spin.get('family', '')}-*`, "
          f"{spin.get('why', '')}), deployed ONLY on the marquee diagram/chart beats. Budget: melt {budget.get('melt_used', 0)} · "
          f"spin {budget.get('spin_used', 0)}. {budget.get('note', '')}", "",
          "| TC | move | id | TRANSFORM-vs-NEWFACET why |", "|---|---|---|---|"]
    marquee = [r for r in rows if str(r.get("role")) in ("MELT-transform", "SPIN-newfacet")]
    L += [f"| {float(r['tc']):.2f} | {'MELT' if 'MELT' in str(r.get('role')) else 'SPIN'} | {tag(r.get('id'))} | {r.get('why', '')} |"
          for r in marquee] or ["| (none) | | | |"]
    L += ["", "Everything else stays §1-3. SFX ducks under the VO on every melt/spin.", ""]
    L += ["## 5. Every scene change, time-ordered (the build reconciles the comp to THIS list)", "",
          "| TC | bucket | role | source | id | dur s | duck | change |", "|---|---|---|---|---|---|---|---|"]
    L += [f"| {mmss(r['tc'])} | {r.get('bucket', '')} | {r.get('role', '')} | {r.get('source', '')} | {tag(r.get('id'))} | "
          f"{float(r.get('duration_s') or 0):.2f} | {'yes' if r.get('sfx_duck') else 'no'} | {str(r.get('change', ''))[:110]} |" for r in rows]
    L += ["", f"**Consistency:** {plan.get('consistency_check', '')}", ""]
    if plan.get("open_questions"):
        L += ["## Open questions (Mike)"] + [f"- [ ] {q}" for q in plan["open_questions"]] + [""]
    return "\n".join(L).replace("—", ", ") + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    src = proj / "TRANSITION-PLAN.json"
    if not src.is_file():
        print(f"FATAL: {src} missing", file=sys.stderr)
        sys.exit(2)
    plan = json.loads(src.read_text(encoding="utf-8"))
    rows = plan.get("transitions") or []
    melt = sum(1 for r in rows if "MELT" in str(r.get("role")))
    spin = sum(1 for r in rows if "SPIN" in str(r.get("role")))
    print(f"TRANSITION-PLAN rows={len(rows)} melt={melt} spin={spin}")
    dest = proj / "TRANSITIONS.md"
    if dest.is_file() and not a.force:
        print(f"KEPT {dest} (exists; --force to overwrite)")
    else:
        dest.write_text(render(plan, proj), encoding="utf-8", newline="\n")
        print(f"RENDERED {dest}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
