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
Machine lines: COVER-PLAN beats=N cover_s=X envato=a/b chatgpt=c/d receipts=N containers=N clip_inserts=N whiteboards=N · RENDERED <file>
The WHITEBOARD worklist (2026-11-01) renders on every video: the plan's `whiteboards[]` rows (the whiteboard-builder's beats,
video-creation/skills/whiteboard-beat/whiteboard-beat.md), or a "(none this video)" row.
The CLIP INSERTS worklist (skills/clip-inserts, 2026-10-09) renders on every video: the plan's `clip_inserts[]` rows, or a
"(none this video)" row carrying `clip_inserts_note`, so the consideration is visible at GATE 3 either way.
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
    # The CONTAINER THEME is printed at the top so Mike can catch it at GATE plan, before any slide / chart is built
    # (Mike 2026-11-02, left-behind: "is there a place where I could have caught that before you generated them?").
    try:
        sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "graph"))
        import common as _C
        _theme = _C.container_theme(proj)
    except Exception:
        _theme = "dark"
    L.append(f"**Container theme: {_theme.upper()}** (title slides, card slides, system-design diagrams and animated charts; "
             "set per video with `run.py --container-theme dark|light`; receipts, b-roll and images are unaffected).")
    L.append("")
    themes = plan.get("chapter_themes") or {}
    def ch_of(beat):
        m = re.match(r"\s*(CH\d+)", str(beat or ""))
        return m.group(1) if m else None
    if themes:
        L.append("## CHAPTER THEMES (the visual differential per chapter, mirroring the music beds; Mike 2026-10-10)")
        L.append("")
        L.append("_Each chapter lights its charts, slides, containers and title card with ITS accent (the locked stylesheet is otherwise unchanged; receipts and real marks keep their real pixels), and its ChatGPT images use ITS image style ('house' = the persona look). Envato video is not themed. The builders read the chapter off every row's beat._")
        L.append("")
        L.append("| CH | Accent | Image style | Note |")
        L.append("|---|---|---|---|")
        for ch, th in themes.items():
            L.append(f"| {ch} | {th.get('accent', '')} ({th.get('accent_name', '')}) | {th.get('image_style', '')} | {th.get('note', '')} |")
        L.append("")
    if plan.get("open_questions"):
        # Once Mike rules the plan gate, a `rulings` entry with closes_open_questions: true turns the HOLDS into a
        # RULED list (checked) and prints the rulings under it, so no builder reads a ruled question as a hold.
        closing = [r for r in (plan.get("rulings") or []) if isinstance(r, dict) and r.get("closes_open_questions")]
        if closing:
            L.append(f"## Plan-gate questions: all RULED ({closing[-1].get('by', 'Mike')}, {closing[-1].get('date', '')}); nothing below is on hold")
        else:
            L.append("## HOLDS before licensing (Mike rules at GATE 3)")
        for q in plan["open_questions"]:
            L.append(f"- [{'x' if closing else ' '}] {q}")
        if closing:
            L.append("")
            L.append("**The rulings (build to these):**")
            for k, v in closing[-1].items():
                if k not in ("date", "by", "closes_open_questions"):
                    L.append(f"- **{k}:** {v}")
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
    style = plan.get("image_style") or "house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text"
    L.append(f"## ChatGPT images ({len(imgs)}) - {style} (agent: image-gen)")
    if plan.get("image_style"):
        L.append("")
        L.append("_**STYLE OVERRIDE for this video** (the plan's `image_style`, from Mike's ruling in PROJECT-LOG): it replaces the persona house style for every row below._")
    L.append("")
    L.append(f"_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `{REF_LIB}`, "
             "or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._")
    L.append("")
    L.append("| id | Beat (final spine) | Prompt concept | Reference | Chapter style | Status |")
    L.append("|---|---|---|---|---|---|")
    for im in imgs:
        ref = im.get("reference") or "none exists (generic approved)"
        th = themes.get(ch_of(im.get("beat")) or "", {}) if themes else {}
        L.append(f"| IMG-{im.get('n')} | {im.get('beat', '')} | {im.get('prompt_concept', '')} | {ref} | {th.get('image_style', 'house') if themes else 'house'} | ☐ pending |")
    if not imgs:
        L.append("| (none) | | | | | |")
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
    # Clip inserts (a third-party clip with its OWN voice at a spine pause): considered on every video, Mike 2026-10-09
    ins = plan.get("clip_inserts") or []
    L.append(f"## CLIP INSERTS capture worklist ({len(ins)}) - a third-party clip plays with its OWN voice while the spine pauses; "
             "audio KEPT, context caption burned, words verified (agent: receipt-capturer; tool + rule: `skills/clip-inserts/clip-inserts.md`)")
    L.append("")
    L.append("| id | Who / what plays | Source (URL + window) | Length | Splice at (final spine, after words) | Burned caption | Expect (Whisper) | Verify | Status |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for ci in ins:
        L.append(f"| {ci.get('id')} | {ci.get('who', '')}: {str(ci.get('says', ''))[:160]} | {ci.get('source', '')} {ci.get('start', '')}-{ci.get('end', '')} | "
                 f"{float(ci.get('seconds') or 0):.1f}s | {mmss(ci.get('splice_at', 0))} after \"{ci.get('after_words', '')}\" | {ci.get('caption', '')} | "
                 f"{ci.get('expect', '')} | {'yes' if ci.get('verify') else 'no'} | ☐ pending |")
    if not ins:
        L.append(f"| (none this video) | {plan.get('clip_inserts_note') or 'no reason recorded'} | | | | | | | |")
    L.append("")
    # Charts + slides from containers
    conts = plan.get("containers") or []
    charts = [c for c in conts if c.get("kind") in ("animated-chart", "diagram", "timeline", "chart")]
    slides = [c for c in conts if c.get("kind") in ("card", "title", "slide", "container")]
    L.append(f"## CHARTS build worklist ({len(charts)}) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)")
    L.append("")
    def accent_of(beats):
        th = themes.get(ch_of((beats or [""])[0]) or "", {}) if themes else {}
        return f"{th.get('accent', '')} ({th.get('accent_name', '')})" if th else "stylesheet default"
    L.append("| id | Type | What moves / which states | Placement (beats) | Data source | Chapter accent | Status |")
    L.append("|---|---|---|---|---|---|---|")
    for c in charts:
        typ = "Type 1 ANIMATED" if c.get("kind") in ("animated-chart", "chart") else "Type 2 SYSTEM-DESIGN"
        L.append(f"| {c.get('id')} | {typ} | {c.get('shows', '')} | {', '.join(c.get('beats') or [])} | {c.get('source', 'DATA.md')} | {accent_of(c.get('beats'))} | ☐ pending |")
    if not charts:
        L.append("| (none) | | | | | | |")
    L.append("")
    # Whiteboard beats (video-creation/skills/whiteboard-beat/whiteboard-beat.md; Mike 2026-11-01, left-behind): a 15 to 30 s
    # hand-drawn scene per row, built + still-QA'd + rendered by the assets node's whiteboard lane, one beat at a time
    wbs = plan.get("whiteboards") or []
    wb_s = sum(float(b["tOut"]) - float(b["tIn"]) for b in plan.get("cover_beats") or []
               if str(b.get("cover_type", "")).lower() == "whiteboard")
    L.append(f"## WHITEBOARD build worklist ({len(wbs)}, {wb_s:.1f}s on screen) - hand-drawn rough.js scenes, one Remotion comp each, "
             "rendered silent to `assets/whiteboard/<id>.mp4` (agent: whiteboard-builder, then visual-qa on its stills, then "
             "chunked-render; contract `video-creation/skills/whiteboard-beat/whiteboard-beat.md`)")
    L.append("")
    if plan.get("whiteboard_check"):
        L.append(f"**Whiteboard share:** {plan['whiteboard_check']}")
        L.append("")
    L.append("| id | Beat (final spine) | Length | Scene (what is drawn, the payoff) | Numbers drawn | Pen / canvas | Comp | Output | Status |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for w in wbs:
        a, z = float(w.get("tIn") or 0), float(w.get("tOut") or 0)
        nums = ", ".join(str(n) for n in w.get("numbers") or []) or "none"
        scene = " ".join(str(w.get("scene", "")).split()).replace("|", "/")
        L.append(f"| {w.get('id')} | {w.get('chapter', '')}@{mmss(a)}-{mmss(z)} | {z - a:.1f}s | {scene} | {nums} | "
                 f"{w.get('pen', '')} / {w.get('canvas', '')} | {w.get('comp', '')} | {w.get('out', '')} | ☐ pending |")
    if not wbs:
        L.append("| (none this video) | | | | | | | | |")
    L.append("")
    # Screen-share face mode (longform-edited.md house rule #1b, 2026-11-04 quant): the deck-area content of every FACE window
    fbs = plan.get("face_body") or []
    if fbs:
        L.append(f"## SCREEN-SHARE bodies ({len(fbs)}) - what the deck area of each FACE window shows (FACE MODE = screenshare; the assets are "
                 "the rows above, scaled into the 1464x1080 deck area by the comp, comp-build.md section 4c; nothing extra is built)")
        L.append("")
        L.append("| id | FACE window | Time (final spine) | Body (type · asset · state) | Spoken | Notes | Status |")
        L.append("|---|---|---|---|---|---|---|")
        for r in fbs:
            a, z = float(r.get("tIn") or 0), float(r.get("tOut") or 0)
            body = f"{str(r.get('cover_type', '')).upper()} · {r.get('asset', '')}" + (f" · {r.get('state')}" if r.get("state") else "") \
                   + (f" · from {r.get('from')}s" if str(r.get("cover_type")) == "whiteboard" else "")
            L.append(f"| {r.get('id')} | F{r.get('face', '')} | {mmss(a)}-{mmss(z)} | {body} | \"{str(r.get('spoken', ''))[:80]}\" | "
                     f"{str(r.get('notes', '')).replace('|', '/')[:120]} | ☐ pending |")
        L.append("")
    L.append(f"## SLIDES build worklist ({len(slides)}) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)")
    L.append("")
    L.append("| id | Slide type | Eyebrow / headline / content | Placement (beats) | Chapter accent | Status |")
    L.append("|---|---|---|---|---|---|")
    for s in slides:
        typ = "TITLE SLIDE" if s.get("kind") == "title" else "CARD SLIDE"
        L.append(f"| {s.get('id')} | {typ} | {s.get('shows', '')} | {', '.join(s.get('beats') or [])} | {accent_of(s.get('beats'))} | ☐ pending |")
    if not slides:
        L.append("| (none) | | | | | |")
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
    fbs = plan.get("face_body") or []
    if fbs:   # screen-share face mode (house rule #1b): the deck area of each FACE window
        L.append("**SCREEN-SHARE bodies (the deck area of each FACE window, painted by the comp):** "
                 + "; ".join(f"{r.get('id')} {mmss(float(r.get('tIn') or 0))}-{mmss(float(r.get('tOut') or 0))} "
                             f"{str(r.get('cover_type', '')).upper()} {r.get('asset', '')}" for r in fbs))
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
            if str(b.get("cover_type", "")).lower() == "whiteboard":   # name the beat + its clip
                layer = f"WHITEBOARD {b.get('asset', '')} (assets/whiteboard/{b.get('asset', '')}.mp4) {b.get('what', '')}"
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
          f"containers={len(plan.get('containers') or [])} clip_inserts={len(plan.get('clip_inserts') or [])} "
          f"whiteboards={len(plan.get('whiteboards') or [])} face_body={len(plan.get('face_body') or [])}")
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
