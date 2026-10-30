#!/usr/bin/env python
"""
short_graph.py — the OPTIONAL SHORT lane of the longform-edited track (2026-09-29, Mike: "take the vertical video and
cut out the best moments into a 30-second short"). Runs AFTER the vertical is delivered. Canonical rules:
skills/longform-to-short/longform-to-short.md (this graph is the runner; the skill owns the rules): the short is a
CONDENSATION of the vertical master + the clean paused-spine VO, cut only at measured troughs, captioned end to end,
closed by the SHARED CTA take ("Click below to watch the full video", Mike's cloned voice, assets/vo/) over a
WATCH THE FULL VIDEO card. Mike's standing overrides for this lane: the target length is an argument (default 30 s,
outro inside it); the opening face hook is the natural hook; and for VARIETY, when a chosen span carries an Envato
clip or a ChatGPT image, ONE alternative asset is sourced/generated for the short and overlaid over that window.

  s_preflight -> s_cut_plan (short-cut-strategist, lint-short-spans gate) -> gate_short_plan (auto, NO HITL: Mike 2026-10-29)
  -> s_variants -> s_extract -> s_captions -> s_comp (comp-builder SHORT mode) -> s_verify_comp -> s_render
  -> s_mix -> s_verify_final -> gate_short (Mike) -> s_deliver (<project>-SHORT-<N>s.mp4 at the project root)

Invocation: python video-creation/longform-edited/graph/run.py short --project <name> [--seconds 30] [--brief "..."]
"""
import hashlib
import json
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402
import longform_graph as G  # noqa: E402
import vertical_graph as V  # noqa: E402

LANE = "short"
SK = C.SKILLS / "longform-to-short"
LINT_SPANS = SK / "lint-short-spans.py"
EXTRACT = SK / "short_extract_spans.py"
MIX_SHORT = C.SCRIPTS / "mix_short.py"
BUILD_CAPTIONS = C.REPO_ROOT / "video-creation" / "skills" / "captions" / "build_captions.py"
CTA = C.REPO_ROOT / "video-creation" / "assets" / "vo" / "cta-watch-full.mp3"
OUTRO_S = 3.0


class ShortState(TypedDict, total=False):
    project: str
    project_dir: str
    scope: str
    thread: str
    lane: str
    stub: str
    seconds: float
    brief: str
    approve: list
    done: list
    redo: list
    steps: dict
    status: str
    error: str


def _proj(state) -> Path:
    return Path(state["project_dir"])


def _redo(state, node) -> bool:
    return node in (state.get("redo") or [])


def _sdir(proj: Path) -> Path:
    return proj / "_previews" / "short"


def _work(proj: Path) -> Path:
    return _sdir(proj) / "work"


def _target(state) -> float:
    return float(state.get("seconds") or 30.0)


def _comp_id(proj: Path) -> str:
    return G._pascal(proj.name) + "Short"


def _sh_fn(proj: Path, scope: str):
    """source -> final seconds through EVERY pause's OWN `dur` (the comp's sh()). A clip insert's pause is the clip's length,
    not pause_s: retire-early 2026-10-11 mapped CLIP-2 / CLIP-3 as 1.5 s each and put every word after 94.7 s up to 17.8 s
    early (caught by the short-cut-strategist). card_t lists the chapter CARDS only (clip inserts are not card freezes)."""
    meta, _ = G._paused_meta(proj, scope)
    pause = float(meta.get("pause_s") or 0)
    pauses = [(float(p["at"]), float(p.get("dur") or pause)) for p in meta.get("pauses") or []]
    card_t = [float(p["at"]) for p in meta.get("pauses") or [] if not p.get("clip")]
    return (lambda t: t + sum(d for at, d in pauses if at <= t + 1e-6)), card_t, pause


FACE_ROW_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)
MISHEAR_RE = re.compile(r'"([^"]+)"\s*->\s*"([^"]+)"')


def _burned_final(proj: Path, scope: str):
    """The windows where the delivered picture ALREADY carries burned captions, in FINAL-video seconds: the project's
    captions node output (assets/captions.json `windows`, source-spine seconds through sh). Only these are exempt from
    the short's caption track. NOT every FACE window: the house rule burns captions on face holds over 5 s only, so a
    short face beat (golden-kitty F9, the kicker, 4.4 s) arrives bare (caught at the short gate, 2026-10-02)."""
    sh, _, _ = _sh_fn(proj, scope)
    # 16:9-SOURCED mode (every-job, 2026-10-08: Mike skipped the full vertical): the span pictures are re-framed from the 16:9
    # comp WITHOUT its burned captions, so nothing is exempt and every span gets the short's caption track.
    if (proj / "assets" / "short" / "from-16x9.json").is_file():
        return []
    cj = proj / "assets" / "captions.json"
    if cj.is_file():
        try:
            wins = json.loads(cj.read_text(encoding="utf-8")).get("windows") or []
            return [(sh(float(a)), sh(float(b))) for a, b in wins]
        except Exception:
            pass
    return _faces_final(proj, scope)


def _faces_final(proj: Path, scope: str):
    """AS-RECORDED FACE windows in FINAL-video seconds (sh applied)."""
    sh, _, _ = _sh_fn(proj, scope)
    ar = C.doc(proj, "as_recorded").read_text(encoding="utf-8")
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar, re.M | re.S)
    return [(sh(float(m.group(1))), sh(float(m.group(2)))) for m in FACE_ROW_RE.finditer(sec.group(0) if sec else "")]


# ── nodes ────────────────────────────────────────────────────────────────────────────
def _setup_16x9_mode(proj: Path, scope: str, vert: Path):
    """16:9-SOURCED MODE setup (longform-to-short.md): the flag file, the black ADAPTER master (1080x1920 on the FINAL's
    clock, carrying the FINAL audio) and the measured face crop. Done by hand on every-job / only-18 / reset until
    2026-10-30; now automatic when no <project>-VERTICAL.mp4 exists. Returns a failure reason or None."""
    final = proj / f"{proj.name}-FINAL.mp4"
    if not final.is_file():
        return f"no {vert.name} and no {final.name}: deliver the longform first"
    flag = proj / "assets" / "short" / "from-16x9.json"
    flag.parent.mkdir(parents=True, exist_ok=True)
    flag.write_text(json.dumps({"mode": "16:9-sourced", "set_by": "s_preflight",
                                "note": f"no full vertical; {vert.name} is the black ADAPTER master (FINAL audio)"}, indent=1), encoding="utf-8")
    dur = G._duration(final) or 0.0
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1080x1920:r=30:d={dur}", "-i", str(final),
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "30", "-pix_fmt", "yuv420p",
                        "-c:a", "copy", "-shortest", str(vert)], capture_output=True, text=True)
    if r.returncode != 0 or not vert.is_file():
        return f"could not build the 16:9 adapter master: {r.stderr[-400:]}"
    if not (proj / "assets" / "vertical" / "face-crop.json").is_file():
        r = subprocess.run([sys.executable, str(C.SCRIPTS / "measure_face_crop.py"), str(proj), "--scope", scope],
                           capture_output=True, text=True)
        if r.returncode != 0:
            return f"measure_face_crop.py failed: {(r.stdout + r.stderr)[-400:]}"
    print(f"[longform] s_preflight: 16:9-SOURCED MODE set up ({vert.name} adapter + flag + face crop)")
    return None


def s_preflight(state: ShortState) -> ShortState:
    """Phase 0: the delivered vertical + the paused spine share one clock; the CTA take exists; write the FINAL-TIME
    transcript (sh() applied to the word JSON) the strategist works from."""
    node = "s_preflight"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    vert = proj / f"{proj.name}-VERTICAL.mp4"
    paused = C.paused_spine(proj, scope)
    if not vert.is_file():   # Mike skipped the full vertical: set up 16:9-SOURCED MODE here (reset, 2026-10-30)
        why = _setup_16x9_mode(proj, scope, vert)
        if why:
            return C._fail(state, node, why)
    wj = C.words_json(proj, scope)
    missing = [str(p) for p in (vert, CTA, C.doc(proj, "cue_sheet"), C.doc(proj, "transitions"), C.doc(proj, "music_plan")) if not p.is_file()]
    if missing or not paused or not wj:
        return C._fail(state, node, "short needs the delivered vertical, the paused spine, the word JSON and the shared CTA take; missing: "
                       + ", ".join(missing + ([] if paused else ["paused spine"]) + ([] if wj else ["word json"])))
    dv, dp = G._duration(vert) or 0.0, G._duration(paused) or 0.0
    if abs(dv - dp) > 0.2:
        return C._fail(state, node, f"vertical ({dv:.2f}s) and paused spine ({dp:.2f}s) are not on one clock")
    sh, _, _ = _sh_fn(proj, scope)
    d = json.loads(wj.read_text(encoding="utf-8"))
    segs, lines = [], []
    for s in d.get("segments", []):
        seg = {"id": s.get("id"), "start": round(sh(float(s["start"])), 3), "end": round(sh(float(s["end"])), 3), "text": s.get("text", ""),
               "words": [{"word": w["word"], "start": round(sh(float(w["start"])), 3), "end": round(sh(float(w["end"])), 3), "probability": w.get("probability", 1.0)}
                         for w in s.get("words", [])]}
        segs.append(seg)
        lines.append(f"{seg['start']:8.2f} - {seg['end']:8.2f}  {seg['text'].strip()}")
    (proj / "spine" / "FINAL-TIME-words.json").write_text(json.dumps({"text": d.get("text", ""), "segments": segs, "language": d.get("language", "en"),
                                                                       "clock": "final-video seconds (sh applied)"}, indent=1, ensure_ascii=False), encoding="utf-8")
    (proj / "spine" / "FINAL-TIME-transcript.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    _work(proj).mkdir(parents=True, exist_ok=True)
    return {"steps": C._step(state, node, "ran", f"vertical {dv:.2f}s == spine {dp:.2f}s; FINAL-TIME transcript written ({len(segs)} segments)")}


def _plan_check(plan: dict, target: float, total: float, faces):
    for k in ("claim", "spans", "assembled_read", "outro"):
        if k not in plan:
            return f"missing key {k}"
    spans = plan["spans"]
    if not isinstance(spans, list) or not spans:
        return "spans is empty"
    if "\u2014" in json.dumps(plan, ensure_ascii=False):
        return "em dash in the plan"
    sum_s = 0.0
    for s in spans:
        try:
            a, b = float(s["start"]), float(s["end"])
        except (KeyError, TypeError, ValueError):
            return f"span without numeric start/end: {str(s)[:60]}"
        if not (0 <= a < b <= total + 0.05):
            return f"span {a}-{b} outside the video ({total:.2f}s)"
        if not s.get("says"):
            return f"span {a}-{b} has no verbatim `says`"
        if str(s.get("sourced", "")).upper() not in ("FACE", "COVER"):
            return f"span {a}-{b} lacks `sourced: FACE|COVER` (the hook-face check and the caption windows depend on it)"
        sum_s += b - a
    budget = target - OUTRO_S
    if not (budget - 3.0 <= sum_s <= budget + 1.0):
        return f"spans total {sum_s:.1f}s; the target is {target:.0f}s with a {OUTRO_S:.0f}s outro, so {budget - 3:.0f}-{budget + 1:.0f}s of spans"
    return None


def s_cut_plan(state: ShortState) -> ShortState:
    """Phase 1: short-cut-strategist (Fable/max) -> SHORT-CUT-PLAN.json (verified: schema, clock, budget), then the
    lint-short-spans gate SNAPS every boundary to a measured trough -> SHORT-CUT-PLAN.snapped.json (the build input)."""
    node = "s_cut_plan"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    target = _target(state)
    vert, paused = proj / f"{proj.name}-VERTICAL.mp4", C.paused_spine(proj, scope)
    plan_p, snapped_p = proj / "SHORT-CUT-PLAN.json", proj / "SHORT-CUT-PLAN.snapped.json"
    faces = _faces_final(proj, scope)
    total = G._duration(paused) or 0.0
    sh, card_t, pause = _sh_fn(proj, scope)
    if not (plan_p.is_file() and not _redo(state, node)):
        brief = state.get("brief") or ""
        prompt = (f"Author the cut plan for a {target:.0f}-second short condensed from the DELIVERED vertical of the longform-edited project "
                  f"`{proj.name}` (folder `{proj}`), per your agent definition and longform-to-short.md §2/§3.\n"
                  f"Sources on ONE clock (final-video seconds): video `{vert}`, audio `{paused}` ({total:.2f}s). Final-time transcript: "
                  f"`{proj / 'spine' / 'FINAL-TIME-words.json'}` + `{proj / 'spine' / 'FINAL-TIME-transcript.txt'}` (already sh()-applied; every "
                  "number you return is in THIS clock, do not convert).\n"
                  f"FACE windows (final time; a span inside one is FACE-sourced and carries burned captions): {[(round(a, 2), round(b, 2)) for a, b in faces]}. "
                  f"Chapter-card freezes (final time, {pause}s each): {[round(sh(c) - pause, 2) for c in card_t]} (never cut inside one).\n"
                  f"Docs: `{C.doc(proj, 'cue_sheet')}`, `{C.doc(proj, 'edit_plan')}`, `{C.doc(proj, 'transitions')}`, `{C.doc(proj, 'screenplay')}`, "
                  f"`{C.doc(proj, 'project_log')}`.\n"
                  f"Target: {target:.0f} s DELIVERED, with a {OUTRO_S:.0f} s outro INSIDE it, so {target - OUTRO_S:.0f} s of spans (+-1 s). "
                  "Mike's standing rules for this lane: the opening FACE hook is the natural hook (use it unless it does not serve the claim); "
                  "mark every span `sourced`: FACE or COVER; prefer visual variety (name which cover/asset is on screen in `on_screen`).\n"
                  + (f"Per-run brief from Mike: {brief}\n" if brief else "")
                  + f"Return the JSON per your definition AND save it to EXACTLY `{plan_p}` with Bash (a quoted heredoc).")
        rc, out = C.spawn_agent(state, node, "short-cut-strategist", prompt, f"agent-short-plan-{proj.name}.log")
        if not C.persist_agent_json(out, plan_p, want_key="spans"):
            return C._fail(state, node, f"short-cut-strategist returned no usable plan (rc {rc})", out)
    plan = json.loads(plan_p.read_text(encoding="utf-8"))
    why = _plan_check(plan, target, total, faces)
    if why:
        return C._fail(state, node, f"SHORT-CUT-PLAN.json failed verification: {why} (fix the plan and re-drive; --redo s_cut_plan re-runs the strategist)")
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_SPANS), str(plan_p), str(paused), "--write-snapped", str(snapped_p)], state, node)
    if rc != 0 or not snapped_p.is_file():
        return C._fail(state, node, "lint-short-spans GATE FAILED: a boundary sits mid-vowel; move that span edge in SHORT-CUT-PLAN.json and re-drive", out)
    n = len(plan["spans"])
    return {"steps": C._step(state, node, "ran", f"{n} spans, {sum(float(s['end']) - float(s['start']) for s in plan['spans']):.1f}s + {OUTRO_S:.0f}s outro; boundaries snapped to troughs")}


def gate_short_plan(state: ShortState) -> ShortState:
    # NOT a HITL gate (Mike, 2026-10-29): "There's no gate to ask me if I approve of the plan for the short." He has never
    # rejected a short's cut; he reviews the FINISHED short at the `short` gate and asks for a second or two of change there.
    # The node stays so the plan is still logged (and an old thread's checkpoint still resolves); it never interrupts.
    return {"steps": C._step(state, "gate_short_plan", "ran", "auto-approved (no plan gate: Mike reviews the finished short)")}


PAINT_16X9 = C.SCRIPTS / "short_spans_from_16x9.py"


def s_paint_16x9(state: ShortState) -> ShortState:
    """16:9-SOURCED MODE only (assets/short/from-16x9.json; longform-to-short.md): paint the APPROVED plan's spans into the
    black adapter master, rendered from the 16:9 comp with captions off and re-framed 9:16 (--face-from-render). A graph node
    since 2026-10-27 (only-18-months-left: Mike pre-approves the plan gate, so the hand step between the gate and the build
    would have let the lane cut its spans out of a BLACK canvas). Skipped when the master is already painted from this exact
    plan (assets/short/painted.json carries the plan's hash)."""
    node = "s_paint_16x9"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not (proj / "assets" / "short" / "from-16x9.json").is_file():
        return {"steps": C._step(state, node, "skipped", "not 16:9-sourced (a delivered vertical is the master)")}
    plan_p = proj / "SHORT-CUT-PLAN.snapped.json"
    digest = hashlib.sha256(plan_p.read_bytes()).hexdigest()[:16]
    marker = proj / "assets" / "short" / "painted.json"
    master = proj / f"{proj.name}-VERTICAL.mp4"
    if marker.is_file() and master.is_file() and not _redo(state, node):
        if json.loads(marker.read_text(encoding="utf-8")).get("plan_sha") == digest:
            return {"steps": C._step(state, node, "skipped", "master already painted from this plan")}
    rc, out = C.run_streaming([sys.executable, "-u", str(PAINT_16X9), str(proj), "--plan", str(plan_p), "--scope", scope,
                               "--face-from-render"], state, node)
    m = re.search(r"^MASTER-PAINTED .* spans=(\d+)", out or "", re.M)
    if rc != 0 or not m:
        return C._fail(state, node, "short_spans_from_16x9.py failed (see above)", out)
    marker.write_text(json.dumps({"plan_sha": digest, "spans": int(m.group(1)), "at": C._now_iso()}, indent=1), encoding="utf-8")
    return {"steps": C._step(state, node, "ran", f"{m.group(1)} span(s) rendered from the 16:9 comp and painted into {master.name}")}


def _cover_windows_final(proj: Path, scope: str):
    """COVER-PLAN beats of the kinds Mike wants varied, in final time: [{id, kind, a, b, spoken}]."""
    sh, _, _ = _sh_fn(proj, scope)
    plan = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8"))
    out = []
    for b in plan.get("cover_beats") or []:
        kind = str(b.get("cover_type", ""))
        if kind not in ("envato-video", "chatgpt-image"):
            continue
        what = str(b.get("what", ""))
        # the beat names its asset either by the coverage code (E3 / G2, kcc20) or by the on-disk id (BR-1 / IMG-5, growth-vs-product
        # 2026-10-23: the E/G-only match found no variants for a plan that carried three)
        m = re.search(r"\b(?:([EG])(\d+)|(BR|IMG)-(\d+))\b", what)
        if not m:
            continue
        ident = (("BR-" if m.group(1) == "E" else "IMG-") + m.group(2)) if m.group(1) else f"{m.group(3)}-{m.group(4)}"
        out.append({"id": ident, "kind": kind, "a": sh(float(b["tIn"])), "b": sh(float(b["tOut"])), "spoken": b.get("spoken", ""), "what": what})
    return out


_qa_stem = G._qa_stem   # shared with the longform + vertical asset nodes


VARIANT_ROUNDS = 2   # source + visual-qa rounds per variant slot before it is auto-waived


def s_variants(state: ShortState) -> ShortState:
    """Mike's variety rule: for each span that overlaps an Envato or ChatGPT cover beat, source ONE alternative asset
    (a different clip / a differently composed image of the same concept) into assets/short/, visual-qa it, and
    record the overlay windows (SHORT time) in assets/short/variants.json. No such span -> nothing to do."""
    node = "s_variants"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    plan = json.loads((proj / "SHORT-CUT-PLAN.snapped.json").read_text(encoding="utf-8"))
    covers = _cover_windows_final(proj, scope)
    sdir = proj / "assets" / "short"
    (sdir / "vid").mkdir(parents=True, exist_ok=True)
    (sdir / "img").mkdir(parents=True, exist_ok=True)
    hits = []
    t_out = 0.0
    for s in sorted(plan["spans"], key=lambda x: int(x.get("order", 0))):
        a, b = float(s["start"]), float(s["end"])
        for cv in covers:
            lo, hi = max(a, cv["a"]), min(b, cv["b"])
            if hi - lo >= 0.8:  # a visible overlap worth varying
                hits.append({**cv, "span_start": a, "overlay_short": [round(t_out + (lo - a), 3), round(t_out + (hi - a), 3)]})
        t_out += b - a
    seen, uniq = set(), []
    for h in hits:
        if h["id"] not in seen:
            seen.add(h["id"])
            uniq.append(h)
    hits = uniq
    # a slot Mike (or the orchestrator, logged in PROJECT-LOG) waived keeps the longform's own asset in the short
    wv = sdir / "variant-waivers.json"
    waivers = json.loads(wv.read_text(encoding="utf-8")) if wv.is_file() else {}
    for h in [h for h in hits if h["id"] in waivers]:
        print(f"VARIANT-WAIVED {h['id']}: {waivers[h['id']]}", flush=True)
    hits = [h for h in hits if h["id"] not in waivers]
    vjson = sdir / "variants.json"
    if not hits:
        vjson.write_text(json.dumps({"variants": []}, indent=1), encoding="utf-8")
        return {"steps": C._step(state, node, "ran", "no span carries an Envato clip or ChatGPT image; no variants needed")}
    def vfile(h):
        d = sdir / ("vid" if h["kind"] == "envato-video" else "img")
        c = sorted(d.glob(f"{h['id']}-*.*")) + sorted(d.glob(f"{h['id']}.*"))
        return c[0] if c else None
    redo = _redo(state, node)
    qa_dest = sdir / "VISUAL-QA.json"
    rej = _sdir(proj) / "qa" / "rejected"
    # verdicts by file name. A PASS carries over: re-judging passed files flip-flopped (only-18 2026-10-28: a second QA pass failed
    # the four images the first had passed and cost a 26-minute regeneration). Every FAIL stays on as the next sourcer's feedback.
    verdicts = {}
    if qa_dest.is_file() and not redo:
        try:
            verdicts = {Path(str(a.get("path", ""))).name: a for a in json.loads(qa_dest.read_text(encoding="utf-8")).get("assets", [])}
        except Exception:
            verdicts = {}
    def passed(a):
        return bool(a) and str(a.get("verdict", "")).upper() == "PASS"
    shown_cache = {}
    def shown(f):   # a clip is judged by its middle frame
        if f not in shown_cache:
            shown_cache[f] = (G._mid_frame(f, _sdir(proj) / "qa" / f"{f.stem}.mid.png") or f) if f.suffix.lower() in G.VIDEO_EXT else f
        return shown_cache[f]
    def prior_fail(h):
        """Every earlier visual-qa FAIL for this slot (those files sit in _previews/short/qa/rejected/), as the sourcer's feedback."""
        fs = [a for n, a in verdicts.items() if not passed(a) and G._qa_names_id(G._qa_stem(n), h["id"])]
        if not fs:
            return ""
        return (" EARLIER ATTEMPTS FAILED visual-qa (moved to _previews/short/qa/rejected/; pick something visibly different from ALL of them): "
                + " | ".join(f"{G._qa_stem(a.get('path', ''))}: " + "; ".join(a.get("defects") or [])[:240]
                             + f" -> FIX: {str(a.get('fix', ''))[:160]}" for a in fs[-3:]))
    def open_slots():
        return [h for h in hits if not vfile(h) or not passed(verdicts.get(shown(vfile(h)).name))]
    # A variant is OPTIONAL (without one the short shows the longform's own asset), so it never stops the run: up to
    # VARIANT_ROUNDS source + visual-qa rounds, a FAIL moved aside and re-sourced with the verdict as feedback, then any slot still
    # open is AUTO-WAIVED. (only-18 2026-10-27: one Envato slot failed visual-qa three times and the run sat failed overnight
    # instead of delivering the short; Mike: "this should NEVER happen again".)
    for rnd in range(1, VARIANT_ROUNDS + 1):
        todo = [h for h in hits if (redo and rnd == 1) or not vfile(h)]
        if todo:
            print(f"[longform] {node}: round {rnd}/{VARIANT_ROUNDS}: sourcing " + ", ".join(h["id"] for h in todo), flush=True)
            specs = []
            env = [h for h in todo if h["kind"] == "envato-video"]
            img = [h for h in todo if h["kind"] == "chatgpt-image"]
            if env:
                specs.append(("envato-sourcer",
                              f"SHORT variant b-roll for `{proj.name}` (folder `{proj}`): for EACH slot below source ONE DIFFERENT native VERTICAL Envato clip "
                              "(`search_envato.py --portrait`), same beat meaning and query family as the BROLL-PLAN row but a visibly different shot "
                              "(not the clip already in assets/vertical/vid/ or assets/vid/; open those to avoid a look-alike); 1080x1920, audio stripped, "
                              "trimmed to the window + 1 s handles. Output assets/short/vid/<id>-<slug>.mp4. Slots:\n"
                              + "\n".join(f"- {h['id']}: window {h['overlay_short']} s of the short; beat: {h['what'][:160]}{prior_fail(h)}" for h in env)
                              + f"\nWorklist rows: `{C.doc(proj, 'broll_plan')}`. QA-open every clip; report per slot.", f"agent-short-env-{proj.name}.log"))
            if img:
                specs.append(("image-gen",
                              f"SHORT variant images for `{proj.name}` (folder `{proj}`): for EACH slot below generate ONE NEW 9:16 portrait image of the SAME "
                              "concept but a different composition/angle than the existing image (attach the existing assets/vertical/img/<id>-*.png, or assets/img/<id>-*.png when no vertical exists, as "
                              "a reference for palette + subject, and the row's real-mark reference when the BROLL-PLAN Reference column names one). Output "
                              "assets/short/img/<id>-<slug>.png. Slots:\n"
                              + "\n".join(f"- {h['id']}: window {h['overlay_short']} s of the short; concept: {h['what'][:160]}{prior_fail(h)}" for h in img)
                              + f"\nWorklist rows: `{C.doc(proj, 'broll_plan')}`. Every image unique; QA-open; report per slot.", f"agent-short-img-{proj.name}.log"))
            C.spawn_agents_parallel(state, node, specs)
        # visual-qa on every variant file without a PASS (only those: the passed ones carry over)
        need = [(h, vfile(h)) for h in hits if vfile(h) and not passed(verdicts.get(shown(vfile(h)).name))]
        if need:
            new_dest = sdir / "VISUAL-QA.new.json"
            new_dest.unlink(missing_ok=True)
            prompt = (f"Visual QA for the SHORT's variant assets of `{proj.name}`: open every file below and judge it (portrait, house style, the named "
                      "concept, nothing clipped, no text/watermark; a `.mid.png` is a clip's middle frame). Check ONLY the files listed.\n"
                      + "\n".join(f"- `{shown(f)}`  [{h['kind']} variant for {h['id']}, portrait 1080x1920] concept: {h['what'][:140]}" for h, f in need)
                      + f"\nReturn your JSON verdict AND save it to EXACTLY `{new_dest}` with Bash. Every listed file appears with PASS or FAIL.")
            rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-short-visual-qa-{proj.name}.log")
            if C.persist_agent_json(out, new_dest, want_key="assets"):
                for a in json.loads(new_dest.read_text(encoding="utf-8")).get("assets", []):
                    verdicts[Path(str(a.get("path", ""))).name] = a
                new_dest.unlink(missing_ok=True)
                C._write_json_atomic(qa_dest, {"assets": list(verdicts.values())})
            else:
                print(f"[longform] {node}: round {rnd}: visual-qa returned no verdict (rc {rc}); the unjudged files are judged next round", flush=True)
        # every judged FAIL moves aside, so the next round re-sources only that slot
        fails = [verdicts[shown(f).name] for _, f in need if shown(f).name in verdicts and not passed(verdicts[shown(f).name])]
        for m in G._reject_qa_fails(fails, [(f, shown(f)) for _, f in need], rej):
            print(f"VARIANT-REJECTED {m} -> {rej}", flush=True)
        if not open_slots():
            break
    left = open_slots()
    if left:
        stamp = time.strftime("%Y-%m-%d %H:%M")
        for h in left:
            f = vfile(h)
            failed = [n for n, a in verdicts.items() if not passed(a) and G._qa_names_id(G._qa_stem(n), h["id"])]
            why = (f"visual-qa FAILED {len(failed)} attempt(s)" if failed else
                   "no file produced" if not f else "never judged by visual-qa")
            waivers[h["id"]] = (f"AUTO-WAIVED {stamp} by s_variants after {VARIANT_ROUNDS} sourcing round(s) ({why}): the short keeps the "
                                "longform's own asset for this beat. To try again: delete this entry and re-drive s_variants.")
            print(f"VARIANT-AUTO-WAIVED {h['id']}: {why}; the short keeps the longform's own asset", flush=True)
        C._write_json_atomic(wv, waivers)
        hits = [h for h in hits if h not in left]
    variants = [{"id": h["id"], "kind": h["kind"], "file": str(vfile(h)), "overlay_short": h["overlay_short"], "replaces_window_final": [round(h["a"], 3), round(h["b"], 3)]} for h in hits]
    vjson.write_text(json.dumps({"variants": variants}, indent=1), encoding="utf-8")
    note = (f"; {len(left)} slot(s) AUTO-WAIVED, the longform's own asset kept (assets/short/variant-waivers.json): "
            + ", ".join(h["id"] for h in left)) if left else ""
    return {"steps": C._step(state, node, "ran", f"{len(variants)} variant asset(s) ready: " + (", ".join(v["id"] for v in variants) or "none") + note)}


VCARD_KINDS = {"container": "slide-builder", "title": "slide-builder", "diagram": "chart-builder", "animated-chart": "chart-builder",
               "timeline": "chart-builder", "real-chart": "receipt-capturer", "receipt": "receipt-capturer"}
VCARD_ROUNDS = 2
SLIVER_S = 0.5   # a cover overlap this short at a span edge is a burn sliver: a held face frame, not a rebuilt card


def _span_cover_hits(proj: Path, scope: str, kinds):
    """COVER-PLAN beats of `kinds` that show inside the approved spans, as [{id, kind, what, a, b, overlay_short, edge}] (final + SHORT
    seconds). `edge` = the overlap touches the span start/end (a burn sliver candidate)."""
    sh, _, _ = _sh_fn(proj, scope)
    plan = json.loads((proj / "SHORT-CUT-PLAN.snapped.json").read_text(encoding="utf-8"))
    beats = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8")).get("cover_beats") or []
    hits, t_out = [], 0.0
    for s in sorted(plan["spans"], key=lambda x: int(x.get("order", 0))):
        a, b = float(s["start"]), float(s["end"])
        for i, bt in enumerate(beats):
            kind = str(bt.get("cover_type", ""))
            if kind not in kinds:
                continue
            ba, bb = sh(float(bt["tIn"])), sh(float(bt["tOut"]))
            lo, hi = max(a, ba), min(b, bb)
            if hi - lo < 1.5 / 30:
                continue
            what = str(bt.get("what", ""))
            m = re.search(r"\b([A-Z]{1,2}\d+(?:\.\d+)?)\b", what)
            hits.append({"id": m.group(1) if m else f"beat{i}", "kind": kind, "what": what, "a": lo, "b": hi,
                         "overlay_short": [round(t_out + lo - a, 3), round(t_out + hi - a, 3)],
                         "edge": (hi - lo) < SLIVER_S and (abs(lo - a) < 0.05 or abs(hi - b) < 0.05), "span_ab": (a, b)})
        t_out += b - a
    return hits


def s_vertical_cards(state: ShortState) -> ShortState:
    """16:9-SOURCED MODE only (Mike, reset 2026-10-30: "if we skip the vertical conversion, we still need to have those checks
    and that type of building process for the short"). Every card / chart / diagram / timeline / receipt that shows inside a
    span is REBUILT native 1080x1920 (slide-builder / chart-builder / receipt-capturer, the vertical-repurpose rules, never a crop
    or letterbox) into assets/short/vertical-cards/, visual-qa'd, and recorded in assets/short/vertical-cards.json for the short
    comp to overlay. A burn sliver (< SLIVER_S at a span edge) becomes a HOLD of the adjacent face frame instead. Envato and
    ChatGPT assets are s_variants' job. Unlike a variant, a card that never passes FAILS the node: shipping the 608 px crop is
    exactly what Mike rejected."""
    node = "s_vertical_cards"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not (proj / "assets" / "short" / "from-16x9.json").is_file():
        return {"steps": C._step(state, node, "skipped", "the delivered vertical already carries native-vertical assets")}
    sdir = proj / "assets" / "short"
    vdir = sdir / "vertical-cards"
    vdir.mkdir(parents=True, exist_ok=True)
    vj = sdir / "vertical-cards.json"
    doc = json.loads(vj.read_text(encoding="utf-8")) if vj.is_file() and not _redo(state, node) else {}
    cards = {c["id"]: c for c in doc.get("cards") or []}
    holds = list(doc.get("holds") or [])
    hits = _span_cover_hits(proj, scope, set(VCARD_KINDS))
    # burn slivers -> hold the face frame just inside the span on the other side of the sliver (the painted adapter master)
    master = proj / f"{proj.name}-VERTICAL.mp4"
    held = {tuple(h["overlay_short"]) for h in holds}
    for h in [h for h in hits if h["edge"]]:
        if tuple(h["overlay_short"]) in held:
            continue
        a, b = h["span_ab"]
        t = h["b"] + 2 / 30 if abs(h["a"] - a) < 0.05 else h["a"] - 2 / 30
        png = vdir / f"hold-{h['overlay_short'][0]:.2f}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(master), "-frames:v", "1", str(png)], capture_output=True)
        if png.is_file():
            holds.append({"file": str(png.relative_to(proj)).replace("\\", "/"), "overlay_short": h["overlay_short"],
                          "replaces": f"{h['id']} sliver on a span edge ({(h['b'] - h['a']) * 30:.1f} frames)"})
    hits = [h for h in hits if not h["edge"]]
    seen, todo = set(), []
    for h in hits:
        if h["id"] not in seen:
            seen.add(h["id"])
            todo.append(h)

    def vfile(h):
        c = sorted(vdir.glob(f"{h['id']}-*v.png")) + sorted(vdir.glob(f"{h['id']}-v*.png"))
        return c[0] if c else None
    qa_dest = sdir / "VERTICAL-CARDS-QA.json"
    verdicts = {}
    if qa_dest.is_file() and not _redo(state, node):
        verdicts = {Path(str(a.get("path", ""))).name: a for a in json.loads(qa_dest.read_text(encoding="utf-8")).get("assets", [])}
    ok = lambda f: bool(f) and str((verdicts.get(f.name) or {}).get("verdict", "")).upper() == "PASS"
    for rnd in range(1, VCARD_ROUNDS + 1):
        need = [h for h in todo if not vfile(h)]
        by_agent = {}
        for h in need:
            by_agent.setdefault(VCARD_KINDS[h["kind"]], []).append(h)
        specs = []
        for agent, hs in by_agent.items():
            fails = lambda h: "; ".join(f"{n}: {'; '.join(a.get('defects') or [])[:200]}" for n, a in verdicts.items()
                                        if n.startswith(h["id"] + "-") and str(a.get("verdict", "")).upper() != "PASS")
            specs.append((agent,
                          f"NATIVE VERTICAL rebuilds for the SHORT of `{proj.name}` (folder `{proj}`), 16:9-sourced mode: the short shows these "
                          "16:9 assets inside its spans, and a 608 px centre crop of them is NOT acceptable (Mike). For EACH asset below rebuild the "
                          "SAME content native 1080x1920 per `video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` section 1 "
                          "(same locked light/dark stylesheet, same numbers, same state as shown at that moment; reflow, never squeeze; receipts = "
                          "mobile-view captures). Find the 16:9 source in the project's assets/ (card-slides, title-slides, charts, diagrams, receipts) "
                          "by its id. Output EXACTLY `" + str(vdir) + "/<id>-<slug>-v.png`. Assets:\n"
                          + "\n".join(f"- {h['id']} [{h['kind']}] shown {h['overlay_short']} s of the short: {h['what'][:200]}"
                                      + (f" EARLIER ATTEMPT FAILED visual-qa: {fails(h)}" if fails(h) else "") for h in hs)
                          + "\nOpen every PNG you write; report per asset.", f"agent-short-vcards-{agent}-{proj.name}.log"))
        if specs:
            C.spawn_agents_parallel(state, node, specs)
        judge = [(h, vfile(h)) for h in todo if vfile(h) and not ok(vfile(h))]
        if judge:
            new_dest = sdir / "VERTICAL-CARDS-QA.new.json"
            new_dest.unlink(missing_ok=True)
            prompt = (f"Visual QA for the SHORT's native-vertical rebuilds of `{proj.name}`: open every file and judge it (1080x1920, the locked "
                      "stylesheet, the named content complete and legible, nothing cut at any edge, no overflow). Check ONLY these files.\n"
                      + "\n".join(f"- `{f}`  [{h['kind']} {h['id']}] content: {h['what'][:160]}" for h, f in judge)
                      + f"\nReturn your JSON verdict AND save it to EXACTLY `{new_dest}` with Bash. Every listed file appears with PASS or FAIL.")
            rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-short-vcards-qa-{proj.name}.log")
            if C.persist_agent_json(out, new_dest, want_key="assets"):
                for a in json.loads(new_dest.read_text(encoding="utf-8")).get("assets", []):
                    verdicts[Path(str(a.get("path", ""))).name] = a
                new_dest.unlink(missing_ok=True)
                C._write_json_atomic(qa_dest, {"assets": list(verdicts.values())})
            rej = _sdir(proj) / "qa" / "rejected"
            rej.mkdir(parents=True, exist_ok=True)
            for h, f in judge:
                a = verdicts.get(f.name)
                if a and str(a.get("verdict", "")).upper() != "PASS":
                    shutil.move(str(f), str(rej / f.name))
        if all(ok(vfile(h)) for h in todo):
            break
    left = [h["id"] for h in todo if not ok(vfile(h))]
    for h in todo:
        f = vfile(h)
        if f and ok(f):
            cards[h["id"]] = {"id": h["id"], "kind": h["kind"], "file": str(f.relative_to(proj)).replace("\\", "/"),
                              "overlay_short": h["overlay_short"], "replaces": h["what"][:120]}
    C._write_json_atomic(vj, {"note": "16:9-sourced short: native-vertical rebuilds + face holds the short comp overlays (SHORT seconds); "
                                      "written by s_vertical_cards", "cards": list(cards.values()), "holds": holds})
    if left:
        return C._fail(state, node, f"native-vertical rebuild did not pass visual-qa after {VCARD_ROUNDS} round(s): {', '.join(left)} "
                                    f"(see {qa_dest.name}; fix the card or rebuild it by hand, then re-drive)")
    return {"steps": C._step(state, node, "ran", f"{len(cards)} card(s) rebuilt 1080x1920, {len(holds)} face hold(s) -> {vj.name}")}


def s_extract(state: ShortState) -> ShortState:
    """Stage A: short_extract_spans.py -> frame-exact span intermediates (video from the vertical, VO from the spine)."""
    node = "s_extract"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    work = _work(proj)
    if (work / "spans.json").is_file() and not _redo(state, node):
        return {"steps": C._step(state, node, "skipped", "spans.json present")}
    rc, out = C.run_streaming([sys.executable, "-u", str(EXTRACT), str(proj / "SHORT-CUT-PLAN.snapped.json"), str(proj / f"{proj.name}-VERTICAL.mp4"),
                               str(C.paused_spine(proj, scope)), str(work)], state, node)
    if rc != 0 or not (work / "spans.json").is_file():
        return C._fail(state, node, "short_extract_spans.py failed (frame-count mismatch?)", out)
    t = json.loads((work / "spans.json").read_text(encoding="utf-8"))
    return {"steps": C._step(state, node, "ran", f"{len(t['spans'])} intermediates, {t['spans_total_seconds']}s of spans")}


def s_captions(state: ShortState) -> ShortState:
    """The caption trap: the longform burns captions on FACE beats only, so COVER-sourced frames of the short get the
    house caption track. build_captions.py on the FINAL-TIME words -> groups inside the spans and OUTSIDE the FACE
    windows -> remapped to SHORT seconds -> remotion/src/<Project>ShortCaptions.ts (+ assets/short/captions.json)."""
    node = "s_captions"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    work = _work(proj)
    table = json.loads((work / "spans.json").read_text(encoding="utf-8"))
    faces = _burned_final(proj, scope)            # the frames that already carry burned captions (not every FACE window)
    raw = work / "captions.raw.ts"
    # Group ONLY the words the short keeps: the builder groups 2 words at a time, and a group formed on the full transcript can
    # weld a span's last word to the longform's NEXT word, which the short never says ("fast i" at a span end, every-job
    # 2026-10-08: "coming fast" + "I think we're only..."). So the words JSON handed to the builder holds just the words whose
    # onset lies inside a span; groups then end where the span ends.
    full = json.loads((proj / "spine" / "FINAL-TIME-words.json").read_text(encoding="utf-8"))
    # a SILENT span (a held still; its VO is generated silence) says nothing, so it gets no words and no caption window
    keep_ranges = [(float(s["src_start"]) - 0.05, float(s["src_end"])) for s in table["spans"] if not s.get("silent")]
    segs = []
    for sg in full.get("segments", []):
        # a word belongs to a span when its MIDPOINT lies inside it: Whisper onsets run early (the next sentence's "I" was
        # stamped 65 ms before the snapped span end), so an onset test still welded "fast" + "i"
        ws = [w for w in sg.get("words", []) if any(a <= (float(w["start"]) + float(w.get("end", w["start"]))) / 2 < b for a, b in keep_ranges)]
        if ws:
            segs.append({**sg, "words": ws, "text": " ".join(w["word"].strip() for w in ws), "start": ws[0]["start"], "end": ws[-1]["end"]})
    span_words = work / "FINAL-TIME-words.spans.json"
    span_words.write_text(json.dumps({**full, "segments": segs}, ensure_ascii=False), encoding="utf-8")
    r = subprocess.run([sys.executable, str(BUILD_CAPTIONS), "--words", str(span_words), "--style", "montserrat",
                        "--max-words", "2", "--max-short", "4", "--var", "ZCAPTIONS", "--out", str(raw)], capture_output=True, text=True)
    if r.returncode != 0 or not raw.is_file():
        return C._fail(state, node, "build_captions.py failed on the FINAL-TIME words", (r.stderr or r.stdout)[-600:])
    # the captured h is still JS-escaped (they\'re): unescape it, or the re-escape at write time doubles it and the short
    # shows a literal backslash (growth-vs-product 2026-10-23)
    rows = [(float(t), re.sub(r"\\(.)", r"\1", h)) for t, h in re.findall(r"\{\s*t:\s*([\d.]+)\s*,\s*h:\s*'((?:[^'\\]|\\.)*)'\s*\}", raw.read_text(encoding="utf-8"))]
    ar = C.doc(proj, "as_recorded").read_text(encoding="utf-8")
    fixes = [(w, rr) for w, rr in MISHEAR_RE.findall(ar)]
    kept, windows = [], []
    for s in table["spans"]:
        if s.get("silent"):
            continue
        a, b, o = float(s["src_start"]), float(s["src_end"]), float(s["out_start"])
        # the part(s) of this span with NO burned captions = the span minus the burned-caption windows
        segs = [(a, b)]
        for fa, fz in faces:
            nxt = []
            for x, y in segs:
                if fz <= x or fa >= y:
                    nxt.append((x, y))
                else:
                    if x < fa:
                        nxt.append((x, fa))
                    if fz < y:
                        nxt.append((fz, y))
            segs = nxt
        for x, y in segs:
            windows.append([round(o + (x - a), 3), round(o + (y - a), 3)])
            for t, h in rows:
                # a group whose first word's onset Whisper stamped just BEFORE the span start (its token absorbed the pause:
                # reset 2026-10-30, 'Inflation' 26.30 vs span 26.40) still belongs here; it shows from the span's first frame.
                # Only the words the short keeps are in `rows`, so the lead-in cannot steal another span's words.
                if x - 0.6 <= t < x - 0.05 and not any(float(o2["src_start"]) <= t < float(o2["src_end"]) for o2 in table["spans"]):
                    t = x
                if x - 0.05 <= t < y:
                    for w, rr in fixes:
                        # whole words only: a bare substring turned "accountABle" into "accounta/ble" via "AB" -> "A/B"
                        h = re.sub(r"(?<!\w)" + re.escape(w) + r"(?!\w)", lambda m, rr=rr: rr, h, flags=re.I)
                    kept.append((round(o + (t - a), 3), h.lower()))
    kept.sort()
    name = _comp_id(proj) + "Captions.ts"
    dest = G.REMOTION / "src" / name
    body = [f"// {name}: GENERATED by the longform graph's short lane (build_captions.py montserrat 2/4 on FINAL-TIME words, COVER-sourced frames only). NEVER hand-edit.",
            "// Times are SHORT seconds (already remapped through the span table).",
            "export const CAPTION_WINDOWS: [number, number][] = [" + ", ".join(f"[{x:.3f}, {y:.3f}]" for x, y in windows) + "];",
            "export const ZCAPTIONS: { t: number; h: string }[] = ["]
    body += [f"  {{ t: {t:7.2f}, h: '{h.replace(chr(92), chr(92) * 2).replace(chr(39), chr(92) + chr(39))}' }}," for t, h in kept]
    body += ["];", ""]
    dest.write_text("\n".join(body), encoding="utf-8", newline="\n")
    (proj / "assets" / "short" / "captions.json").write_text(json.dumps({"file": str(dest), "groups": len(kept), "cover_windows_short": windows,
                                                                        "style": "montserrat 900 lowercase, 12px black stroke, bottom-center, topmost"}, indent=1), encoding="utf-8")
    return {"steps": C._step(state, node, "ran", f"{len(kept)} caption groups over {len(windows)} COVER-sourced window(s) -> {name}")}


def s_comp(state: ShortState) -> ShortState:
    """Stage B: comp-builder in SHORT mode -> remotion/src/<Project>Short.tsx (1080x1920): span intermediates end to end,
    a fast seam hit, captions over the COVER-sourced windows only, the variant overlays, the WATCH THE FULL VIDEO outro card."""
    node = "s_comp"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp_id = _comp_id(proj)
    comp = G.REMOTION / "src" / f"{comp_id}.tsx"
    report = _sdir(proj) / "comp-build-report.json"
    work = _work(proj)
    table = json.loads((work / "spans.json").read_text(encoding="utf-8"))
    # the outro ABSORBS the rounding: the spans land within +-1 s of their budget (the plan check), the final must hit
    # the target within 0.25 s (s_verify_final), so the card holds target - spans, never a fixed 3.0 s (golden-kitty
    # 2026-10-02: 26.53 s of spans + 3.0 = 29.53 s failed the 30 s target by construction)
    outro = max(OUTRO_S, round(_target(state) - float(table["spans_total_seconds"]), 3))
    total = float(table["spans_total_seconds"]) + outro
    if not (comp.is_file() and report.is_file() and not _redo(state, node)):
        prompt = (f"Build the SHORT composition for the longform-edited project `{proj.name}` (folder `{proj}`) per "
                  f"`video-creation/longform-edited/skills/longform-to-short/longform-to-short.md` §5 Stage B and your SHORT section.\n"
                  f"Composition id + file: `{comp_id}` -> `{comp}`, 1080x1920, fps 30, DUR = round({total:.3f} * 30) "
                  f"(spans {table['spans_total_seconds']}s + {OUTRO_S:.0f}s outro). Register in Root.tsx.\n"
                  f"Span table + intermediates (the render's public dir is THIS folder): `{work}` -> spans.json (out_start/frames per span; "
                  "one muted OffthreadVideo per span-NN.mp4 laid end to end in Sequences, NEVER seeking into the master). A fast ~0.3 s hit at "
                  "each seam from the video's own transition family (hand-rolled flash/zoom; a library engine over these small linear clips is fine "
                  "only with pre-extracted cut frames).\n"
                  f"Captions: import ZCAPTIONS + CAPTION_WINDOWS from `{G.REMOTION / 'src' / (comp_id + 'Captions.ts')}` (SHORT seconds; render only "
                  "inside CAPTION_WINDOWS, exactly as generated: s_captions already removed the frames that carry burned captions, and in 16:9-sourced "
                  "mode NOTHING is burned so the windows cover every span; never clip them further). Montserrat house style, in the SAFE ZONE: "
                  "bottom pad ~320 px so the block sits below a fit_window letterbox (y 656-1264) and above the platform UI, maxWidth <= 860 so "
                  "the pop overshoot + stroke stay inside 1080 px; a caption never sits on card text.\n"
                  f"Variant overlays (Mike's variety rule): `{proj / 'assets' / 'short' / 'variants.json'}`; for each entry overlay the file full-frame over "
                  "its `overlay_short` window (copy the file into the public dir under variants/ first), with the same ingress the vertical used.\n"
                  f"Native-vertical cards (16:9-sourced mode only): `{proj / 'assets' / 'short' / 'vertical-cards.json'}` when it exists; overlay "
                  "every `cards` entry full-frame over its `overlay_short` window (hard in/out on the window edges, UNDER any variant that fades in "
                  "over it) and every `holds` entry (a face frame) over its window: no frame of a cropped 16:9 card may show.\n"
                  f"Outro: the last {outro:.3f} s hold the last span's final frame and bring in a full-frame TITLE-SLIDE card reading exactly "
                  "\"WATCH THE FULL VIDEO\" in the locked container stylesheet (dark, Playfair headline, green accent word, no em dash), with a "
                  "downward arrow glyph; the CTA voice is mixed later, the comp has no audio.\n"
                  "Run lint_comp_imports.py + lint_covers.py on the comp, bundle once and smoke-test one still per span + the outro, LOOK at them, "
                  f"then save your JSON report to EXACTLY `{report}` (draft may be null). Do NOT run the full render. Never end your turn mid-command.")
        rc, out = C.spawn_agent(state, node, "comp-builder", prompt, f"agent-short-comp-{proj.name}.log")
        if not report.is_file():
            C.persist_agent_json(out, report, want_key="comp_file")
    if not comp.is_file():
        return C._fail(state, node, f"short composition not written: {comp}")
    if f'id="{comp_id}"' not in (G.REMOTION / "src" / "Root.tsx").read_text(encoding="utf-8", errors="replace"):
        return C._fail(state, node, f"{comp_id} is not registered in Root.tsx")
    return {"steps": C._step(state, node, "ran", f"{comp.name} registered ({total:.1f}s)")}


def s_verify_comp(state: ShortState) -> ShortState:
    node = "s_verify_comp"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp = G.REMOTION / "src" / f"{_comp_id(proj)}.tsx"
    fails = []
    for script, args in (("lint_comp_imports.py", [str(comp)]), ("lint_covers.py", [str(comp)])):
        rc, out = C.run_streaming([sys.executable, "-u", str(G.COMP_GATES / script), *args], state, node)
        if rc != 0:
            fails.append(script)
    if fails:
        return C._fail(state, node, "short comp gates failed: " + ", ".join(fails))
    return {"steps": C._step(state, node, "ran", f"gates PASS on {comp.name}")}


def _latest_short_video(proj: Path, secs: int):
    d = _sdir(proj)
    c = [(int(m.group(1)), p) for p in (d.glob(f"{proj.name}-SHORT-{secs}s-v*-video.mp4") if d.is_dir() else [])
         for m in [re.search(r"-v(\d+)-video\.mp4$", p.name)] if m]
    return max(c)[1] if c else None


def s_render(state: ShortState) -> ShortState:
    node = "s_render"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    secs = int(round(_target(state)))
    latest = _latest_short_video(proj, secs)
    if latest and not _redo(state, node):
        return {"steps": C._step(state, node, "skipped", f"{latest.name} present")}
    n = (int(re.search(r"-v(\d+)-video", latest.name).group(1)) + 1) if latest else 1
    out = _sdir(proj) / f"{proj.name}-SHORT-{secs}s-v{n}-video.mp4"
    work = _work(proj)
    rc, res = C.run_streaming([sys.executable, "-u", str(G.RENDER_COMP), str(proj), "--mode", "final", "--comp", _comp_id(proj),
                               "--public-dir", str(work), "--out", str(out), "--video-only"], state, node)  # the short's comp has no audio; the mix adds it
    if rc != 0 or not out.is_file():
        return C._fail(state, node, "short render failed", res)
    return {"steps": C._step(state, node, "ran", f"{out.name} ({G._duration(out) or 0:.2f}s)")}


def s_mix(state: ShortState) -> ShortState:
    node = "s_mix"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    video = _latest_short_video(proj, int(round(_target(state))))
    if not video:
        return C._fail(state, node, "no short render")
    out = video.with_name(video.name.replace("-video.mp4", ".mp4"))
    if not (out.is_file() and out.stat().st_mtime >= video.stat().st_mtime and not _redo(state, node)):
        rc, res = C.run_streaming([sys.executable, "-u", str(MIX_SHORT), str(proj), "--video", str(video), "--work", str(_work(proj)), "--out", str(out)], state, node)
        if rc != 0 or not out.is_file():
            return C._fail(state, node, "mix_short.py failed", res)
    return {"steps": C._step(state, node, "ran", f"{out.name}: VO spans crossfaded + shared CTA + bed")}


def _uncovered_16x9_covers(proj: Path, scope: str, min_frames: float = 1.5):
    """16:9-SOURCED mode: every non-FACE frame of every span is a 608 px slice of a 16:9 cover asset (card, chart, receipt,
    b-roll), which Mike rejected (reset 2026-10-30). Such frames must be covered in the short by a native-vertical overlay:
    a variant (assets/short/variants.json) or a re-shot card / face hold (assets/short/vertical-cards.json). Returns the
    uncovered windows in SHORT seconds that last >= min_frames frames (the H5 chart sliver on reset measured 1.8 frames on the plan clock and showed 3-4 in the render)."""
    faces = _faces_final(proj, scope)
    table = json.loads((_work(proj) / "spans.json").read_text(encoding="utf-8"))
    cov = []
    for name, key in (("variants.json", "variants"), ("vertical-cards.json", "cards"), ("vertical-cards.json", "holds")):
        f = proj / "assets" / "short" / name
        if f.is_file():
            cov += [tuple(map(float, v["overlay_short"])) for v in json.loads(f.read_text(encoding="utf-8")).get(key) or []]
    fps = float(table.get("fps") or 30)
    bad = []
    for sp in table["spans"]:
        if sp.get("silent"):
            continue
        a, b, o = float(sp["src_start"]), float(sp["src_end"]), float(sp["out_start"])
        segs = [(a, b)]
        for fa, fz in faces:
            nxt = []
            for x, y in segs:
                if fz <= x or fa >= y:
                    nxt.append((x, y))
                else:
                    if x < fa:
                        nxt.append((x, fa))
                    if fz < y:
                        nxt.append((fz, y))
            segs = nxt
        for x, y in segs:
            segs2 = [(o + x - a, o + y - a)]
            for ca, cb in cov:
                nxt = []
                for u, v in segs2:
                    if cb <= u or ca >= v:
                        nxt.append((u, v))
                    else:
                        if u < ca:
                            nxt.append((u, ca))
                        if cb < v:
                            nxt.append((cb, v))
                segs2 = nxt
            bad += [(round(u, 3), round(v, 3)) for u, v in segs2 if (v - u) * fps >= min_frames - 0.01]
    return bad


def outro_s_eff(state, spans_s: float) -> float:
    """The outro length s_comp built (target - spans, never under OUTRO_S)."""
    return max(OUTRO_S, round(_target(state) - spans_s, 3))


def s_verify_final(state: ShortState) -> ShortState:
    """Runtime == target (+-0.2 s), portrait, audio, no clipping, the CTA present at the outro (energy in the last 3 s),
    a face detected on the hook frame when the hook is FACE-sourced."""
    node = "s_verify_final"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    secs = int(round(_target(state)))
    video = _latest_short_video(proj, secs)
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else None
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "mixed short missing")
    probs = []
    d = G._duration(mixed) or 0.0
    # The runtime must be what was BUILT (spans + the outro s_comp sized), inside the window the approved plan was allowed
    # (_plan_check: spans within target - outro -3 / +1 s). A flat +-0.25 s around the target failed every plan with more
    # than target - 3 s of spans by construction (retire-early 2026-10-11: 27.8 s of spans + the 3 s CTA = 30.85 s); the
    # target is a soft planning number (Mike), the plan gate is where its length is approved.
    spans_s = float(json.loads((_work(proj) / "spans.json").read_text(encoding="utf-8"))["spans_total_seconds"])
    built = spans_s + max(OUTRO_S, round(_target(state) - spans_s, 3))
    if abs(d - built) > 0.25 or d > _target(state) + 1.25:
        probs.append(f"runtime {d:.2f}s vs built {built:.2f}s (target {_target(state):.1f}s, plan window up to {_target(state) + 1:.1f}s)")
    if V._dims(mixed) != (1080, 1920):
        probs.append(f"dims {V._dims(mixed)}")
    if not G._has_audio_stream(mixed):
        probs.append("no audio")
    # the audio stream must run the full picture (a mix that ends with the last spoken span drops the CTA silently)
    ra = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=duration", "-of", "default=nw=1:nk=1", str(mixed)],
                        capture_output=True, text=True)
    try:
        a_dur = float(ra.stdout.strip().splitlines()[0])
        if d - a_dur > 0.15:
            probs.append(f"audio stream ends at {a_dur:.2f}s, the picture runs {d:.2f}s (the CTA/bed tail is missing)")
    except Exception:
        probs.append("audio stream duration unreadable")
    # the CTA words must actually be in the outro (local whisper on the tail; energy alone can be the bed)
    try:
        import whisper as _wh
        tail = qa_tail = _sdir(proj) / "qa" / "cta-tail.wav"
        tail.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{max(0, d - OUTRO_S - 0.3):.2f}", "-t", f"{OUTRO_S + 0.3:.2f}", "-i", str(mixed), "-vn", "-ac", "1", "-ar", "16000", str(tail)], capture_output=True)
        heard = _wh.load_model("small.en").transcribe(str(tail)).get("text", "").strip().lower()
        if "full video" not in heard:
            probs.append(f"CTA not heard in the outro (whisper: {heard[:60]!r})")
    except ImportError:
        pass
    lu, pk = G._lufs(mixed)
    if pk is not None and pk > -0.1:
        probs.append(f"peak {pk} dBFS")
    r = subprocess.run(["ffmpeg", "-hide_banner", "-ss", f"{max(0, d - OUTRO_S + 0.2):.2f}", "-t", f"{OUTRO_S - 0.4:.2f}", "-i", str(mixed), "-af",
                        "astats=metadata=1:reset=0,ametadata=print:key=lavfi.astats.Overall.RMS_level", "-f", "null", "-"], capture_output=True, text=True)
    rms = re.findall(r"RMS_level=(-?[\d.]+|-inf)", r.stderr)
    if rms and (rms[-1] == "-inf" or float(rms[-1]) < -45):
        probs.append("no CTA voice energy in the outro")
    table = json.loads((_work(proj) / "spans.json").read_text(encoding="utf-8"))
    qa = _sdir(proj) / "qa"
    qa.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(C.SCRIPTS))
    import measure_face_crop as MF  # noqa: E402
    first = table["spans"][0]
    face_pct = None
    if str(first.get("sourced", "")).upper() == "FACE":
        png = MF.grab(mixed, float(first["out_start"]) + min(1.0, first["frames"] / 60), qa / "hook-face.png")
        face_pct = MF.face_centre_pct(png) if png else None
        if face_pct is None or not 35 <= face_pct <= 65:
            probs.append(f"hook face {'not detected' if face_pct is None else f'at {face_pct:.0f}%'} on the short")
    # EDGE-CLIPPED TEXT / 16:9 CAPTION BURN-IN (reset 2026-10-30, Mike rejected the short: the 16:9 comp ignored
    # {"captions": false}, so its big burned captions rode into every 608 px face slice cut at both edges, and frame-filling
    # cards were chopped; nothing looked at the pixels). Two checks, longform-to-short.md "Edge-text gate":
    # (1) 16:9-sourced mode: the 16:9 comp must DECLARE the captions prop and GATE its caption track on it;
    # (2) every short: no stroked / dark-on-light text sliced by the left or right 2 percent margin (CTA card excluded).
    edge = None
    if (proj / "assets" / "short" / "from-16x9.json").is_file():
        src16 = G.REMOTION / "src" / f"{G._pascal(proj.name)}.tsx"
        body = src16.read_text(encoding="utf-8", errors="replace") if src16.is_file() else ""
        if not (re.search(r"captions\s*\??\s*:\s*boolean", body) and re.search(r"\{\s*captions\s*&&\s*<", body)):
            probs.append(f"16:9-sourced: {src16.name} does not honor inputProps.captions (declare `captions?: boolean` and render "
                         "`{captions && <Captions />}`), so its burned captions ride into the 9:16 spans")
        unc = _uncovered_16x9_covers(proj, scope)
        if unc:
            probs.append(f"16:9-sourced: non-FACE span frames show a CROPPED 16:9 cover asset with no native-vertical overlay at short "
                         f"{', '.join(f'{u:.2f}-{v:.2f}s' for u, v in unc[:6])} (rebuild the asset 1080x1920 or hold a face frame; record it "
                         "in assets/short/vertical-cards.json; longform-to-short.md 16:9-SOURCED MODE)")
    edge_json = qa / "edge-text.json"
    re_ = subprocess.run([sys.executable, "-u", str(C.SCRIPTS / "check_short_edge_text.py"), str(mixed), "--skip", f"{built - outro_s_eff(state, spans_s):.2f}-{d + 1:.2f}",
                          "--json", str(edge_json)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    m_edge = re.search(r"^EDGE-TEXT frames=(\d+) bad=(\d+) worst=(\S+)", re_.stdout or "", re.M)
    if re_.returncode == 2 or not m_edge:
        probs.append("edge-text check could not run: " + ((re_.stderr or re_.stdout) or "")[-200:])
    elif int(m_edge.group(2)):
        bad_t = re.findall(r"EDGE-TEXT-BAD t=([\d.]+)s", re_.stdout)
        edge = int(m_edge.group(2))
        probs.append(f"text cut at the left/right edge on {edge} of {m_edge.group(1)} sampled frames (t={', '.join(bad_t[:8])}s; "
                     "16:9 caption burn-in or a cropped card: honor captions:false, give the card a fit_window; see qa/edge-text.json)")
    C._write_json_atomic(_sdir(proj) / "verify-final.json", {"short": str(mixed), "duration_s": d, "target_s": _target(state), "lufs": lu, "peak": pk,
                                                             "hook_face_pct": face_pct, "edge_text_bad": edge, "problems": probs})
    if probs:
        return C._fail(state, node, "short does not verify: " + "; ".join(probs))
    return {"steps": C._step(state, node, "ran", f"{mixed.name}: {d:.2f}s, {lu} LUFS, peak {pk} dBFS" + (f", hook face {face_pct:.0f}%" if face_pct else ""))}


def s_qa_final(state: ShortState) -> ShortState:
    """The finished short is LOOKED AT before delivery (Mike, reset 2026-10-30: "Do you not QA this?"). Frames every 0.5 s are
    tiled into contact sheets and the visual-qa agent judges every frame: text cut at an edge, a cropped 16:9 card / chart /
    b-roll, 16:9 caption remnants, a caption on card text, a face out of frame. A FAIL stops delivery (the supervisor re-drives
    once and notifies); the verdict lands in _previews/short/qa/final-visual-qa.json."""
    node = "s_qa_final"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    video = _latest_short_video(proj, int(round(_target(state))))
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else None
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "mixed short missing")
    qa = _sdir(proj) / "qa"
    qa.mkdir(parents=True, exist_ok=True)
    dest = qa / "final-visual-qa.json"
    stamp = f"{mixed.name}:{mixed.stat().st_size}"
    if dest.is_file() and not _redo(state, node):
        prev = json.loads(dest.read_text(encoding="utf-8"))
        if prev.get("short") == stamp and str(prev.get("verdict", "")).upper() == "PASS":
            return {"steps": C._step(state, node, "skipped", f"{mixed.name} already passed final visual-qa")}
    for old in qa.glob("final-sheet-*.jpg"):
        old.unlink()
    # 2 fps, 270 px wide tiles, 5x4 = 10 s per sheet; each tile is time-stamped so a defect names its second
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mixed), "-vf",
                    "fps=2,scale=270:-1,drawtext=text='%{pts\\:hms}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=5x4",
                    str(qa / "final-sheet-%02d.jpg")], capture_output=True)
    sheets = sorted(qa.glob("final-sheet-*.jpg"))
    if not sheets:
        return C._fail(state, node, "could not tile the short's frames for visual-qa")
    dest.unlink(missing_ok=True)
    prompt = (f"FINAL visual QA of the finished vertical SHORT `{mixed}` (1080x1920, project `{proj.name}`). The contact sheets below hold one "
              "frame every 0.5 s (time-stamped, top-left). OPEN EVERY SHEET and judge EVERY frame for: text or captions cut at the left/right "
              "edge; a 16:9 card / chart / receipt / slide cropped instead of shown whole in a native vertical layout; leftover big 16:9 "
              "captions under the short's own; a caption sitting on card text; a face cut off or badly framed; black / blank frames before "
              "the outro; the WATCH THE FULL VIDEO outro card intact. Open the short itself at any timestamp you need to see larger "
              "(ffmpeg -ss <t> -frames:v 1). Sheets:\n" + "\n".join(f"- `{s}`" for s in sheets)
              + f"\nReturn JSON {{\"verdict\": \"PASS\"|\"FAIL\", \"defects\": [{{\"t\": <s>, \"what\": ..., \"fix\": ...}}]}} AND save it to "
              f"EXACTLY `{dest}` with Bash.")
    rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-short-final-qa-{proj.name}.log")
    if not C.persist_agent_json(out, dest, want_key="verdict"):
        return C._fail(state, node, f"final visual-qa returned no verdict (rc {rc}); see graph/data/agent-short-final-qa-{proj.name}.log")
    v = json.loads(dest.read_text(encoding="utf-8"))
    v["short"] = stamp
    C._write_json_atomic(dest, v)
    if str(v.get("verdict", "")).upper() != "PASS":
        d = v.get("defects") or []
        return C._fail(state, node, f"final visual-qa FAILED {len(d)} defect(s): "
                       + "; ".join(f"{x.get('t')}s {str(x.get('what', ''))[:90]}" for x in d[:6]) + f" (full list {dest})")
    return {"steps": C._step(state, node, "ran", f"{mixed.name}: final visual-qa PASS on {len(sheets)} contact sheet(s)")}


def gate_short(state: ShortState) -> ShortState:
    proj = _proj(state)
    video = _latest_short_video(proj, int(round(_target(state))))
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else _sdir(proj)
    wv = proj / "assets" / "short" / "variant-waivers.json"
    waived = json.loads(wv.read_text(encoding="utf-8")) if wv.is_file() else {}
    auto = [k for k, v in waived.items() if str(v).startswith("AUTO-WAIVED")]
    # NOT a HITL gate (Mike, 2026-10-29): "you could have already rendered it ... It could have already been done." A short
    # that passed s_verify_final is DELIVERED; Mike watches it afterwards and asks for a second or two of change if any.
    note = (f"; variant slot(s) {', '.join(auto)} AUTO-WAIVED (show the longform's own asset)" if auto else "")
    return {"steps": C._step(state, "gate_short", "ran", f"auto-approved: {mixed.name if video else 'short'} passed verify{note}")}


def s_deliver(state: ShortState) -> ShortState:
    node = "s_deliver"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub"), "status": "done"}
    secs = int(round(_target(state)))
    video = _latest_short_video(proj, secs)
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else None
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "no mixed short to promote")
    dest = proj / f"{proj.name}-SHORT-{secs}s.mp4"
    if not dest.is_file() or dest.stat().st_size != mixed.stat().st_size:
        shutil.copyfile(mixed, dest)
    # _previews/short is KEPT (no gate any more): Mike's after-the-fact "a second or two" change is a splice off it
    return {"steps": C._step(state, node, "ran", f"promoted -> {dest.name} ({dest.stat().st_size / 1e6:.0f} MB); not queued"), "status": "done"}


ORDER = ["s_preflight", "s_cut_plan", "gate_short_plan", "s_paint_16x9", "s_variants", "s_vertical_cards", "s_extract", "s_captions", "s_comp", "s_verify_comp",
         "s_render", "s_mix", "s_verify_final", "s_qa_final", "gate_short", "s_deliver"]
NODES = {n: globals()[n] for n in ORDER}


def _after(node: str, next_node: Optional[str]):
    def route(state):
        if state.get("status") == "failed":
            return END
        return next_node or END
    return route


def build_short_graph(checkpointer=None):
    g = StateGraph(ShortState)
    for n in ORDER:
        g.add_node(n, NODES[n])
    g.add_edge(START, ORDER[0])
    for i, n in enumerate(ORDER):
        g.add_conditional_edges(n, _after(n, ORDER[i + 1] if i + 1 < len(ORDER) else None))
    return g.compile(checkpointer=checkpointer)
