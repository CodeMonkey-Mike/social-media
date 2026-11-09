#!/usr/bin/env python
"""
gen_editplan.py — SEED the EDIT-PLAN.md event log, PRE-build, from the plan set (Python, 2026-09-28).

This is the port of the retired `_gen_editplan.example.js`. The JS read a finished comp and rebuilt the
log AFTER the fact (legacy, never how the plan is authored: edit-plan-and-cue-sheet.md §0 ⛔ ORDER). The
port keeps its one good idea, a mechanical time-sorted event log with SAY lines interleaved, but sources
it from the PRE-build artifacts the graph already verified, so every timecode is a final-spine second:
  - AS-RECORDED.md      chapter headers (card ON/OFF, bed letter), FACE windows, Whisper mishears
  - <spine>.medium-words.json   the SAY lines (segment text, mishears corrected, times untouched)
  - COVER-PLAN.json     every cover beat -> [CONTAINER]/[DIAGRAM]/[CHART]/[RECEIPT]/[VIDEO]/[IMAGE]/[CARD]/[WHITEBOARD]
                        (a whiteboard row names its clip, its `from` offset and its draw-on cues file, 2026-11-01)
                        + every clip_inserts row -> [INSERT] at its splice_at (the spine pauses, the clip plays with
                        its OWN voice; skills/clip-inserts/clip-inserts.md, 2026-10-09)
  - MUSIC-PLAN.json     beds, automation dips, hard hits -> [MUSIC]/[DUCK]/[IMPACT]/[RISER] placeholders
  - assets/diagrams/_state-cues.md + assets/charts/*.spec.md   (pointers only; the author writes the rows)
The `edit-plan-author` agent then REFINES the seed into EDIT-PLAN.md (sub-point spotlight rows, the SFX
picks by measured tail, transition marks) and authors CUE-SHEET.md; `lint_edit_plan.py` gates both.

Usage: python gen_editplan.py <media/<project>> [--out <file>] [--scope ALL]
Machine lines: EDITPLAN-SEED events=N say=N covers=N hits=N · WROTE <file>
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CH_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|\s*([^|]*)\|", re.M)
MISHEAR_RE = re.compile(r'"([^"]+)"\s*->\s*"([^"]+)"')
LAYER_OF = {"receipt": "RECEIPT", "real-chart": "RECEIPT", "animated-chart": "CHART", "container": "CONTAINER",
            "diagram": "DIAGRAM", "timeline": "DIAGRAM", "envato-video": "VIDEO", "chatgpt-image": "IMAGE",
            "card": "CONTAINER", "title": "CARD", "clip-insert": "INSERT", "whiteboard": "WHITEBOARD"}


def fmt(t):
    t = float(t)
    m = int(t // 60)
    return f"{m}:{t - m * 60:04.1f}"


def final_spine(proj: Path, scope: str):
    sp = proj / "spine"
    cands = sorted(sp.glob(f"{scope}.*.mp4"), key=lambda p: p.name)
    lettered = [p for p in cands if re.match(rf"^{re.escape(scope)}\.[c-z]\.", p.name)]
    return lettered[-1] if lettered else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--out", default=None)
    ap.add_argument("--scope", default="ALL")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    ar_p, cp_p, mp_p = proj / "AS-RECORDED.md", proj / "COVER-PLAN.json", proj / "MUSIC-PLAN.json"
    for p in (ar_p, cp_p, mp_p):
        if not p.is_file():
            print(f"FATAL: {p.name} missing", file=sys.stderr)
            sys.exit(2)
    fs = final_spine(proj, a.scope)
    words_p = fs.with_name(fs.stem + ".medium-words.json") if fs else None
    if not words_p or not words_p.is_file():
        print("FATAL: final spine word JSON missing", file=sys.stderr)
        sys.exit(2)
    ar = ar_p.read_text(encoding="utf-8")
    cover = json.loads(cp_p.read_text(encoding="utf-8"))
    music = json.loads(mp_p.read_text(encoding="utf-8"))
    segs = json.loads(words_p.read_text(encoding="utf-8"))["segments"]
    fixes = [(w, r) for w, r in MISHEAR_RE.findall(ar)]

    chapters = [(m.group(1).replace(" ", ""), m.group(2).strip(), float(m.group(3)), float(m.group(4)), m.group(5))
                for m in CH_RE.finditer(ar)]
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar, re.M | re.S)
    faces = [(float(m.group(1)), float(m.group(2)), m.group(3).strip()) for m in FACE_RE.finditer(sec.group(0) if sec else "")]
    ev = []  # (t, order, tag, text)

    def add(t, tag, text, order=0):
        ev.append((round(float(t), 2), order, tag, text))

    # SAY lines (segment text, mishears corrected)
    n_say = 0
    for s in segs:
        txt = s["text"].strip()
        for w, r in fixes:
            txt = txt.replace(w, r)
        add(s["start"], "SAY", f'"{txt}"', order=9)
        n_say += 1
    # FACE windows -> cut in/out, captions; the punch-in + library light leak land ON the desilencer joins inside the
    # window (spine/jumpcuts-final.json from scripts/list_face_joins.py; Mike 2026-10-07: library leaks on the punch
    # scenes, never the Remotion-synthetic glow; a hold with no interior join gets no punch and no leak)
    joins_p = proj / "spine" / "jumpcuts-final.json"
    if not joins_p.is_file():
        subprocess.run([sys.executable, str(Path(__file__).resolve().parents[2] / "scripts" / "list_face_joins.py"), str(proj), "--scope", scope],
                       check=False)
    # the per-video FACE transition style (graph/common.py FACE_STYLES, `run.py --face-style`, GRAPH-PROGRESS.json settings)
    try:
        _settings = json.loads((proj / "GRAPH-PROGRESS.json").read_text(encoding="utf-8")).get("settings") or {}
    except (OSError, ValueError):
        _settings = {}
    face_glitch = _settings.get("face_style") == "glitch"
    # SCREEN-SHARE face mode (longform-edited.md house rule #1b): a FACE window is the OBS screen share played verbatim, never
    # punched or leaked; caption scope `none` seeds no caption rows at all
    screenshare = _settings.get("face_mode") == "screenshare"
    _scope = _settings.get("caption_scope") or []
    captions_none = "none" in (_scope if isinstance(_scope, list) else [_scope])
    punch_by_window = {}
    if joins_p.is_file() and not screenshare:
        jj = json.loads(joins_p.read_text(encoding="utf-8"))
        for w in jj.get("face_windows") or []:
            punch_by_window[int(w["n"])] = [float(x) for x in w.get("punch_candidates_s") or []]
    for i, (fa, fz, what) in enumerate(faces, 1):
        if fa > 0.05:
            add(fa, "TRANSITION", f"cover→face cut-in F{i} →TRANSITIONS.md (face pick)")
        add(fa, "FACE", f"F{i} {'opens ON face' if fa <= 0.05 else 'IN'} → {fmt(fz)}  {what[:80]}"
                        + ("  [SCREEN SHARE: deck area painted per COVER-PLAN face_body]" if screenshare else ""))
        if fz - fa > 5.0 and not captions_none:   # captions.md: EVERY face hold over 5 s, never short face punctuation
            add(fa, "CAPTION", f"ON → {fmt(fz)} (face hold over 5 s; FACE window only; montserrat house style)")
        for pj in punch_by_window.get(i, []):
            add(pj, "PUNCH-IN", f"F{i} hard ~15-20% step ON the desilencer join (jumpcuts-final.json) → holds to the next join or {fmt(fz)}")
            if face_glitch:
                add(pj, "GLITCH", f"F{i} random glitch offset / glitch blocks hit ACROSS the same join (lib:glitchoffset-* / lib:blocks-*; "
                                  f"face style glitch, Mike 2026-10-16) →TRANSITIONS.md (punch-glitch)")
            else:
                add(pj, "LIGHTLEAK", f"F{i} library light leak ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) →TRANSITIONS.md (punch-leak)")
        add(fz, "TRANSITION", f"face→cover F{i} out →TRANSITIONS.md")
    # chapter cards + bed changes
    for cid, title, ta, tz, tail in chapters:
        card = re.search(r'card\s+ON\s*"([^"]+)"', tail)
        if card:
            add(ta, "CARD", f"{cid} title card \"{card.group(1)}\" (edit-time pause >= 1 s, zero spine time) · "
                            f"[TRANSITION] card presentation →TRANSITIONS.md · [IMPACT] card impact (pick by MEASURED tail)")
    # clip inserts (COVER-PLAN clip_inserts): the spine PAUSES at splice_at and the clip plays with its OWN voice
    n_ins = 0
    for ci in cover.get("clip_inserts") or []:
        t, sec = float(ci.get("splice_at") or 0), float(ci.get("seconds") or 0)
        add(t, "INSERT", f"{ci.get('id')} SPLICED CLIP, {sec:.1f} s: the spine PAUSES after \"{ci.get('after_words', '')}\" "
                         f"(bake_clip_insert.py snaps the point into the silence trough) and assets/clip-inserts/{ci.get('id')}-*.mp4 plays "
                         f"FULL-FRAME with {ci.get('who') or 'the speaker'}'s OWN voice (baked into the VO track); the bed ducks automatically; "
                         f"[TRANSITION] insert-in / insert-out →TRANSITIONS.md (bucket insert) · lead-in: the clip's FIRST frame held as a still "
                         f"under the set-up line before this point; lead-out: its LAST frame under the resume line (comp-build §3d; author both rows)",
            order=1)
        n_ins += 1
    # cover beats
    n_cov = 0
    wb_start = {str(w.get("id")): float(w.get("tIn") or 0) for w in cover.get("whiteboards") or []}
    for b in sorted(cover.get("cover_beats") or [], key=lambda b: float(b["tIn"])):
        ct = str(b.get("cover_type", "")).lower()
        if ct in ("title", "clip-insert"):
            continue  # the card row above / the [INSERT] row covers it
        tag = LAYER_OF.get(ct, ct.upper())
        dur = float(b["tOut"]) - float(b["tIn"])
        what = str(b.get("what", ""))[:150]
        if ct == "whiteboard":   # a hand-drawn beat (whiteboard-beat.md): the clip + its draw-on cues for the SFX rows
            wid = str(b.get("asset", ""))
            what = (f"{wid} assets/whiteboard/{wid}.mp4 (from: {float(b['tIn']) - wb_start.get(wid, float(b['tIn'])):.2f}) {what} · "
                    f"draw-on cues assets/whiteboard/{wid}.cues.md (hang any draw-on tick / pop SFX on them, catalog picks) · "
                    f"ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move, TRANSITIONS.md)")
        add(b["tIn"], tag, f"IN ({dur:.1f}s → {fmt(b['tOut'])}) {what}"
                           + (" `[VERIFY]`" if b.get("verify") else ""))
        n_cov += 1
    # music beds, dips, hits
    for bed in music.get("beds") or []:
        a0, a1 = bed["span"]
        add(a0, "MUSIC", f"Bed {bed.get('chapter')} {Path(str(bed.get('source_file'))).stem[:40]} "
                        f"{bed.get('cover')} {bed.get('intensity')} {bed.get('level_db_under_vo')} dB under VO"
                        + (f", breath {bed.get('breath_before_sec')}s before" if bed.get("breath_before_sec") else "")
                        + f" → {fmt(a1)}")
        for au in bed.get("automation") or []:
            w = au.get("window") or [a0, a0]
            add(w[0], "DUCK", f"bed to {au.get('gain_db')} dB → {fmt(w[1])}: {str(au.get('why', ''))[:100]}")
    n_hits = 0
    for h in music.get("hard_hits") or []:
        mv = str(h.get("music_move", ""))
        tag = "RISER→IMPACT" if "riser" in mv.lower() else ("IMPACT" if ("hit" in mv.lower() or "impact" in mv.lower() or "slam" in mv.lower()) else "MUSIC")
        add(h["t"], tag, f"{str(h.get('beat', ''))[:90]}: {mv[:140]} (SFX pick by MEASURED tail, assets/sfx/Impacts/library.json)")
        n_hits += 1
    ev.sort(key=lambda e: (e[0], e[1]))

    duration = max([float(s["end"]) for s in segs] + [c[3] for c in chapters]) if segs else 0.0
    out = [f"# {proj.name} - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)  <!-- SEED: refine, do not ship as-is -->",
           "",
           f"> SEEDED by `skills/edit-plan-and-cue-sheet/gen_editplan.py` from AS-RECORDED.md + `{words_p.name}` + COVER-PLAN.json + "
           "MUSIC-PLAN.json (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; the comp is built TO this log).",
           f"> Watch file: `spine/{fs.name}` ({duration:.2f}s / {fmt(duration)}). Timecodes = FINAL-spine seconds, pre-card-pause; the "
           "title-card pauses shift the final timeline via `sh()` at comp.",
           "> Transition ids marked `→TRANSITIONS.md` resolve in that file (authored next). SFX rows say `pick by MEASURED tail`: "
           "the author replaces each with the kit file (assets/sfx/Impacts/library.json).",
           "> Sub-point spotlight rows come from assets/diagrams/_state-cues.md and assets/charts/*.spec.md (word-cued states).",
           ""]
    ch_iter = iter(chapters)
    cur = next(ch_iter, None)
    nxt = next(ch_iter, None)
    opened = False
    for t, order, tag, text in ev:
        while nxt and t >= nxt[2] - 1e-6:
            cur, nxt = nxt, next(ch_iter, None)
            opened = False
        if cur and not opened:
            card = re.search(r'card\s+(ON|OFF)', cur[4])
            bed = re.search(r'Bed\s+([A-Z])', cur[4])
            out.append(f"\n## {cur[0]} - {cur[1]} ({fmt(cur[2])}-{fmt(cur[3])}"
                       + (f", Bed {bed.group(1)}" if bed else "") + (f", card {card.group(1)}" if card else "") + ")")
            out.append("```")
            opened = True
        out.append(f"{fmt(t):<7} {'SAY:  ' if tag == 'SAY' else '[' + tag + '] '}{text}")
    out.append("```")
    tallies = {}
    for _, _, tag, _ in ev:
        tallies[tag] = tallies.get(tag, 0) + 1
    out += ["", "---", "## Layer tallies (seed)"] + [f"- {k}: {v}" for k, v in sorted(tallies.items())] + [""]
    dest = Path(a.out) if a.out else proj / "_previews" / "EDIT-PLAN.seed.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(out).replace("—", ", "), encoding="utf-8", newline="\n")
    print(f"EDITPLAN-SEED events={len(ev)} say={n_say} covers={n_cov} hits={n_hits} inserts={n_ins}")
    print(f"WROTE {dest}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
