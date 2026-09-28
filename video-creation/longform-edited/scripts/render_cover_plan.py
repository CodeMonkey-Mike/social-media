#!/usr/bin/env python
"""
render_cover_plan.py — COVER-PLAN.json -> BROLL-PLAN.md (the acquisition + build worklists) and
EDIT-PLAN-prep.md (the beat-indexed layer plan). Deterministic, no judgment: the judgment is the
coverage-strategist's proposal; this only lays it out in the canonical shapes so the asset factory
(slide-builder, chart-builder, receipt-capturer, envato-sourcer, image-gen) and the edit-plan author
read one fixed format every video (edit-plan-and-cue-sheet.md §0; longform graph `coverage` node,
2026-09-28).

Usage: python video-creation/longform-edited/scripts/render_cover_plan.py <media/<project>> [--force]
Reads:  <project>/COVER-PLAN.json (+ AS-RECORDED.md for the chapter titles when present)
Writes: <project>/BROLL-PLAN.md · <project>/EDIT-PLAN-prep.md   (refuses to overwrite unless --force,
        so hand edits after GATE 3 survive a re-run)
Machine lines: COVER-PLAN beats=N cover_s=X envato=a/b chatgpt=c/d receipts=N containers=N · RENDERED <file>
"""
import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
REF_LIB = "schedule-tweets/images/reference/"


def mmss(t):
    t = float(t)
    return f"{int(t // 60)}:{t % 60:05.2f}"


def chapter_titles(proj: Path):
    """CH -> title from AS-RECORDED.md's `### CHn - TITLE (...)` headers (falls back to the id)."""
    out = {}
    p = proj / "AS-RECORDED.md"
    if p.is_file():
        for m in re.finditer(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+)", p.read_text(encoding="utf-8"), re.M):
            out[m.group(1).replace(" ", "")] = m.group(2).strip()
    return out


def render_broll(plan: dict, proj: Path) -> str:
    L = []
    L.append(f"# {proj.name} - BROLL-PLAN (acquisition + build worklists)")
    L.append(f"_Rendered {date.today().isoformat()} from `COVER-PLAN.json` (the coverage-strategist's proposal, gated by Mike at GATE 3) "
             "by `scripts/render_cover_plan.py`. Format owner: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0. Every row is PLACED at the "
             "beat named, or marked REJECTED / BENCH: zero orphans. Status ticks are updated by the asset factory as it builds._")
    L.append("")
    b = plan.get("budget") or {}
    L.append(f"**Budget:** Envato video {b.get('envato_used', 0)}/{b.get('envato_max', b.get('envato_video_max', 10))} · "
             f"ChatGPT images {b.get('chatgpt_used', 0)}/{b.get('chatgpt_max', b.get('chatgpt_image_max', 5))}. "
             f"{plan.get('budget_check', '')}")
    L.append("")
    if plan.get("open_questions"):
        L.append("## HOLDS before licensing (Mike rules at GATE 3)")
        for q in plan["open_questions"]:
            L.append(f"- [ ] {q}")
        L.append("")
    # Envato
    env = plan.get("envato_list") or []
    L.append(f"## Envato video ({len(env)}) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)")
    L.append("")
    L.append("| id | Beat (final spine) | Search query | Dur target | Motion | Status |")
    L.append("|---|---|---|---|---|---|")
    for e in env:
        motion = "LEADING (continuous camera, may run to 5s)" if e.get("lead") else "any"
        L.append(f"| BR-{e.get('n')} | {e.get('beat', '')} | {e.get('query', '')} | {float(e.get('seconds', 0)):.2f}s | {motion} | ☐ pending |")
    if not env:
        L.append("| (none) | | | | | |")
    L.append("")
    # ChatGPT images (Reference column mandatory)
    imgs = plan.get("chatgpt_list") or []
    L.append(f"## ChatGPT images ({len(imgs)}) - house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text (agent: image-gen)")
    L.append("")
    L.append(f"_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `{REF_LIB}`, "
             "or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._")
    L.append("")
    L.append("| id | Beat (final spine) | Prompt concept | Reference | Status |")
    L.append("|---|---|---|---|---|")
    for im in imgs:
        ref = im.get("reference") or "none exists (generic approved)"
        L.append(f"| IMG-{im.get('n')} | {im.get('beat', '')} | {im.get('prompt_concept', '')} | {ref} | ☐ pending |")
    if not imgs:
        L.append("| (none) | | | | |")
    L.append("")
    # Receipts
    rec = plan.get("receipts") or []
    L.append(f"## RECEIPTS capture worklist ({len(rec)}) - real-site captures, verified opened (agent: receipt-capturer)")
    L.append("")
    L.append("| id | Type | Claim it proves | Capture (URL + exact view) | Beats | Verify at capture | Status |")
    L.append("|---|---|---|---|---|---|---|")
    for r in rec:
        typ = r.get("type") or ("R(article)" if re.search(r"article|magazine|post|blog|news", str(r.get("capture", "")), re.I) else "R(other)")
        L.append(f"| {r.get('id')} | {typ} | {r.get('claim', '')} | {r.get('capture', '')} | {', '.join(r.get('beats') or [])} | "
                 f"{'yes' if r.get('verify') else 'no'} | ☐ pending |")
    if not rec:
        L.append("| (none) | | | | | | |")
    L.append("")
    # Charts + slides from containers
    conts = plan.get("containers") or []
    charts = [c for c in conts if c.get("kind") in ("animated-chart", "diagram", "timeline", "chart")]
    slides = [c for c in conts if c.get("kind") in ("card", "title", "slide", "container")]
    L.append(f"## CHARTS build worklist ({len(charts)}) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)")
    L.append("")
    L.append("| id | Type | What moves / which states | Placement (beats) | Data source | Status |")
    L.append("|---|---|---|---|---|---|")
    for c in charts:
        typ = "Type 1 ANIMATED" if c.get("kind") in ("animated-chart", "chart") else "Type 2 SYSTEM-DESIGN"
        L.append(f"| {c.get('id')} | {typ} | {c.get('shows', '')} | {', '.join(c.get('beats') or [])} | {c.get('source', 'DATA.md')} | ☐ pending |")
    if not charts:
        L.append("| (none) | | | | | |")
    L.append("")
    L.append(f"## SLIDES build worklist ({len(slides)}) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)")
    L.append("")
    L.append("| id | Slide type | Eyebrow / headline / content | Placement (beats) | Status |")
    L.append("|---|---|---|---|---|")
    for s in slides:
        typ = "TITLE SLIDE" if s.get("kind") == "title" else "CARD SLIDE"
        L.append(f"| {s.get('id')} | {typ} | {s.get('shows', '')} | {', '.join(s.get('beats') or [])} | ☐ pending |")
    if not slides:
        L.append("| (none) | | | | |")
    L.append("")
    L.append("## Bench (swap-ins if a primary fails)")
    L.append("")
    for cb in plan.get("cover_beats") or []:
        if cb.get("bench"):
            L.append(f"- {cb.get('chapter')} {mmss(cb['tIn'])}-{mmss(cb['tOut'])}: {cb['bench']}")
    L.append("")
    return "\n".join(L) + "\n"


def render_prep(plan: dict, proj: Path) -> str:
    titles = chapter_titles(proj)
    L = []
    L.append(f"# {proj.name} - EDIT-PLAN-prep (beat-indexed layer plan)")
    L.append(f"_Rendered {date.today().isoformat()} from `COVER-PLAN.json` by `scripts/render_cover_plan.py`; format owner "
             "`skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0 (the PREP file: provisional, beat-indexed; the time-ordered `EDIT-PLAN.md` "
             "and the layer-grouped `CUE-SHEET.md` are authored post-record off the transcript). Timecodes here ARE final-spine "
             "seconds (the plan was authored on the final spine), so they carry straight into the event log. Transitions per "
             "`TRANSITIONS.md` (authored after this file)._")
    L.append("")
    fw = plan.get("face_windows") or []
    if fw:
        L.append("**FACE windows (from the spine picture, not covered):** " + ", ".join(f"{mmss(a)}-{mmss(b)}" for a, b in fw))
        L.append("")
    beats = sorted(plan.get("cover_beats") or [], key=lambda x: float(x["tIn"]))
    by_ch = {}
    for b in beats:
        by_ch.setdefault(b.get("chapter", "CH?"), []).append(b)
    for ch, rows in by_ch.items():
        t0, t1 = rows[0]["tIn"], rows[-1]["tOut"]
        L.append(f"## {ch} - {titles.get(ch, '').upper() or ch} ({mmss(t0)}-{mmss(t1)})")
        L.append("")
        L.append("| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |")
        L.append("|---|---|---|---|---|---|")
        for i, b in enumerate(rows, 1):
            layer = f"{str(b.get('cover_type', '')).upper()} {b.get('what', '')}"
            L.append(f"| B{i} | {mmss(b['tIn'])}-{mmss(b['tOut'])} | \"{str(b.get('spoken', ''))[:90]}\" | {layer} | "
                     f"{b.get('priority', '')}{' · VERIFY' if b.get('verify') else ''} | per TRANSITIONS.md |")
        L.append("")
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    src = proj / "COVER-PLAN.json"
    if not src.is_file():
        print(f"FATAL: {src} missing", file=sys.stderr)
        sys.exit(2)
    plan = json.loads(src.read_text(encoding="utf-8"))
    beats = plan.get("cover_beats") or []
    cover_s = sum(float(b["tOut"]) - float(b["tIn"]) for b in beats)
    b = plan.get("budget") or {}
    print(f"COVER-PLAN beats={len(beats)} cover_s={cover_s:.1f} envato={b.get('envato_used', 0)}/{b.get('envato_video_max', 10)} "
          f"chatgpt={b.get('chatgpt_used', 0)}/{b.get('chatgpt_image_max', 5)} receipts={len(plan.get('receipts') or [])} "
          f"containers={len(plan.get('containers') or [])}")
    for name, text in (("BROLL-PLAN.md", render_broll(plan, proj)), ("EDIT-PLAN-prep.md", render_prep(plan, proj))):
        dest = proj / name
        if dest.is_file() and not a.force:
            print(f"KEPT {dest} (exists; --force to overwrite)")
            continue
        dest.write_text(text.replace("—", ", "), encoding="utf-8", newline="\n")
        print(f"RENDERED {dest}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
