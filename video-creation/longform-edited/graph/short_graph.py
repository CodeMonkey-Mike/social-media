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

  s_preflight -> s_cut_plan (short-cut-strategist, lint-short-spans gate) -> gate_short_plan (Mike reads the cut)
  -> s_variants -> s_extract -> s_captions -> s_comp (comp-builder SHORT mode) -> s_verify_comp -> s_render
  -> s_mix -> s_verify_final -> gate_short (Mike) -> s_deliver (<project>-SHORT-<N>s.mp4 at the project root)

Invocation: python video-creation/longform-edited/graph/run.py short --project <name> [--seconds 30] [--brief "..."]
"""
import json
import re
import shutil
import subprocess
import sys
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
    meta, _ = G._paused_meta(proj, scope)
    card_t = [float(p["at"]) for p in meta.get("pauses") or []]
    pause = float(meta.get("pause_s") or 0)
    return (lambda t: t + pause * sum(1 for c in card_t if c <= t + 1e-6)), card_t, pause


FACE_ROW_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)
MISHEAR_RE = re.compile(r'"([^"]+)"\s*->\s*"([^"]+)"')


def _burned_final(proj: Path, scope: str):
    """The windows where the delivered picture ALREADY carries burned captions, in FINAL-video seconds: the project's
    captions node output (assets/captions.json `windows`, source-spine seconds through sh). Only these are exempt from
    the short's caption track. NOT every FACE window: the house rule burns captions on face holds over 5 s only, so a
    short face beat (golden-kitty F9, the kicker, 4.4 s) arrives bare (caught at the short gate, 2026-10-02)."""
    sh, _, _ = _sh_fn(proj, scope)
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
def s_preflight(state: ShortState) -> ShortState:
    """Phase 0: the delivered vertical + the paused spine share one clock; the CTA take exists; write the FINAL-TIME
    transcript (sh() applied to the word JSON) the strategist works from."""
    node = "s_preflight"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    vert = proj / f"{proj.name}-VERTICAL.mp4"
    paused = C.paused_spine(proj, scope)
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
    proj = _proj(state)
    return C.gate(state, "short_plan", "the short's cut plan (claim, assembled read, spans); nothing is built before this",
                  [proj / "SHORT-CUT-PLAN.snapped.json"])


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
        m = re.search(r"\b([EG])(\d+)\b", what)
        if not m:
            continue
        ident = ("BR-" if m.group(1) == "E" else "IMG-") + m.group(2)
        out.append({"id": ident, "kind": kind, "a": sh(float(b["tIn"])), "b": sh(float(b["tOut"])), "spoken": b.get("spoken", ""), "what": what})
    return out


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
    vjson = sdir / "variants.json"
    if not hits:
        vjson.write_text(json.dumps({"variants": []}, indent=1), encoding="utf-8")
        return {"steps": C._step(state, node, "ran", "no span carries an Envato clip or ChatGPT image; no variants needed")}
    def vfile(h):
        d = sdir / ("vid" if h["kind"] == "envato-video" else "img")
        c = sorted(d.glob(f"{h['id']}-*.*")) + sorted(d.glob(f"{h['id']}.*"))
        return c[0] if c else None
    todo = [h for h in hits if _redo(state, node) or not vfile(h)]
    if todo:
        specs = []
        env = [h for h in todo if h["kind"] == "envato-video"]
        img = [h for h in todo if h["kind"] == "chatgpt-image"]
        if env:
            specs.append(("envato-sourcer",
                          f"SHORT variant b-roll for `{proj.name}` (folder `{proj}`): for EACH slot below source ONE DIFFERENT native VERTICAL Envato clip "
                          "(`search_envato.py --portrait`), same beat meaning and query family as the BROLL-PLAN row but a visibly different shot "
                          "(not the clip already in assets/vertical/vid/ or assets/vid/; open those to avoid a look-alike); 1080x1920, audio stripped, "
                          "trimmed to the window + 1 s handles. Output assets/short/vid/<id>-<slug>.mp4. Slots:\n"
                          + "\n".join(f"- {h['id']}: window {h['overlay_short']} s of the short; beat: {h['what'][:160]}" for h in env)
                          + f"\nWorklist rows: `{C.doc(proj, 'broll_plan')}`. QA-open every clip; report per slot.", f"agent-short-env-{proj.name}.log"))
        if img:
            specs.append(("image-gen",
                          f"SHORT variant images for `{proj.name}` (folder `{proj}`): for EACH slot below generate ONE NEW 9:16 portrait image of the SAME "
                          "concept but a different composition/angle than the existing vertical image (attach the existing assets/vertical/img/<id>-*.png as "
                          "a reference for palette + subject, and the row's real-mark reference when the BROLL-PLAN Reference column names one). Output "
                          "assets/short/img/<id>-<slug>.png. Slots:\n"
                          + "\n".join(f"- {h['id']}: window {h['overlay_short']} s of the short; concept: {h['what'][:160]}" for h in img)
                          + f"\nWorklist rows: `{C.doc(proj, 'broll_plan')}`. Every image unique; QA-open; report per slot.", f"agent-short-img-{proj.name}.log"))
        C.spawn_agents_parallel(state, node, specs)
    missing = [h["id"] for h in hits if not vfile(h)]
    if missing:
        return C._fail(state, node, "variant assets missing: " + ", ".join(missing))
    # visual-qa on the variants
    lines = []
    for h in hits:
        f = vfile(h)
        shown = G._mid_frame(f, _sdir(proj) / "qa" / f"{f.stem}.mid.png") if f.suffix.lower() in G.VIDEO_EXT else f
        lines.append(f"- `{shown}`  [{h['kind']} variant for {h['id']}, portrait 1080x1920] concept: {h['what'][:140]}")
    qa_dest = sdir / "VISUAL-QA.json"
    if not (qa_dest.is_file() and not _redo(state, node)):
        prompt = (f"Visual QA for the SHORT's variant assets of `{proj.name}`: open every file below and judge it (portrait, house style, the named "
                  "concept, nothing clipped, no text/watermark; a `.mid.png` is a clip's middle frame).\n" + "\n".join(lines)
                  + f"\nReturn your JSON verdict AND save it to EXACTLY `{qa_dest}` with Bash.")
        rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-short-visual-qa-{proj.name}.log")
        if not C.persist_agent_json(out, qa_dest, want_key="assets"):
            return C._fail(state, node, "visual-qa returned no verdict on the variants", out)
    bad = [a for a in json.loads(qa_dest.read_text(encoding="utf-8")).get("assets", []) if str(a.get("verdict", "")).upper() != "PASS"]
    if bad:
        return C._fail(state, node, "variant assets failed visual-qa: " + "; ".join(f"{Path(a.get('path', '?')).name}: {', '.join(a.get('defects') or [])[:100]}" for a in bad))
    variants = [{"id": h["id"], "kind": h["kind"], "file": str(vfile(h)), "overlay_short": h["overlay_short"], "replaces_window_final": [round(h["a"], 3), round(h["b"], 3)]} for h in hits]
    vjson.write_text(json.dumps({"variants": variants}, indent=1), encoding="utf-8")
    return {"steps": C._step(state, node, "ran", f"{len(variants)} variant asset(s) ready: " + ", ".join(v["id"] for v in variants))}


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
    r = subprocess.run([sys.executable, str(BUILD_CAPTIONS), "--words", str(proj / "spine" / "FINAL-TIME-words.json"), "--style", "montserrat",
                        "--max-words", "2", "--max-short", "4", "--var", "ZCAPTIONS", "--out", str(raw)], capture_output=True, text=True)
    if r.returncode != 0 or not raw.is_file():
        return C._fail(state, node, "build_captions.py failed on the FINAL-TIME words", (r.stderr or r.stdout)[-600:])
    rows = [(float(t), h) for t, h in re.findall(r"\{\s*t:\s*([\d.]+)\s*,\s*h:\s*'((?:[^'\\]|\\.)*)'\s*\}", raw.read_text(encoding="utf-8"))]
    ar = C.doc(proj, "as_recorded").read_text(encoding="utf-8")
    fixes = [(w, rr) for w, rr in MISHEAR_RE.findall(ar)]
    kept, windows = [], []
    for s in table["spans"]:
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
                if x - 0.05 <= t < y:
                    for w, rr in fixes:
                        h = re.sub(re.escape(w), rr, h, flags=re.I)
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
                  "inside CAPTION_WINDOWS, they are the COVER-sourced frames; the FACE-sourced frames already carry burned captions). Montserrat house style.\n"
                  f"Variant overlays (Mike's variety rule): `{proj / 'assets' / 'short' / 'variants.json'}`; for each entry overlay the file full-frame over "
                  "its `overlay_short` window (copy the file into the public dir under variants/ first), with the same ingress the vertical used.\n"
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
    if abs(d - _target(state)) > 0.25:
        probs.append(f"runtime {d:.2f}s vs target {_target(state):.1f}s")
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
    C._write_json_atomic(_sdir(proj) / "verify-final.json", {"short": str(mixed), "duration_s": d, "target_s": _target(state), "lufs": lu, "peak": pk,
                                                             "hook_face_pct": face_pct, "problems": probs})
    if probs:
        return C._fail(state, node, "short does not verify: " + "; ".join(probs))
    return {"steps": C._step(state, node, "ran", f"{mixed.name}: {d:.2f}s, {lu} LUFS, peak {pk} dBFS" + (f", hook face {face_pct:.0f}%" if face_pct else ""))}


def gate_short(state: ShortState) -> ShortState:
    proj = _proj(state)
    video = _latest_short_video(proj, int(round(_target(state))))
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else _sdir(proj)
    return C.gate(state, "short", "the mixed SHORT (seams, captions end to end, the CTA outro)", [mixed])


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
    ok, msg = G._recycle([_sdir(proj)])
    if not ok:
        return C._fail(state, node, f"promoted, but recycling _previews/short failed: {msg}")
    return {"steps": C._step(state, node, "ran", f"promoted -> {dest.name} ({dest.stat().st_size / 1e6:.0f} MB); not queued"), "status": "done"}


ORDER = ["s_preflight", "s_cut_plan", "gate_short_plan", "s_variants", "s_extract", "s_captions", "s_comp", "s_verify_comp",
         "s_render", "s_mix", "s_verify_final", "gate_short", "s_deliver"]
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
