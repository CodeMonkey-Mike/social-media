#!/usr/bin/env python
"""
vertical_graph.py — the OPTIONAL vertical (9:16) lane of the longform-edited track, as its own LangGraph
(2026-09-29, Mike: "occasionally, like with this video, I want to convert the longform video into a vertical
video"). Runs AFTER the 16:9 FINAL is delivered. Canonical rules: skills/vertical-repurpose/vertical-repurpose.md
(this graph is the runner; the skill owns the rules). The vertical is a REFRAMING, not a re-edit: same spine,
same duration, same beat times, same audio (the 16:9 mix is reused verbatim); only what fills the frame changes,
and EVERY asset is rebuilt native-vertical, never landscape-cropped.

  v_preflight -> v_face_crop -> v_assets -> v_verify_assets -> v_comp -> v_verify_comp -> v_render -> v_mix
  -> v_verify_final -> gate_vertical (Mike) -> v_deliver

Invocation: python video-creation/longform-edited/graph/run.py vertical --project <name> [--resume --approve vertical]
Vertical artifacts live beside the 16:9 ones and never overwrite them: assets/vertical/<same subfolders> (the
render's LEAN public dir, with its own spine.mp4 hardlink), remotion/src/<Project>Vertical.tsx,
_previews/vertical/, and the deliverable <project>-VERTICAL.mp4 at the project root (NOT queued unless Mike says).
"""
import json
import os
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

LANE = "vertical"
VER_W, VER_H = 1080, 1920
MEASURE_FACE = C.SCRIPTS / "measure_face_crop.py"
STITCH_CEILING = 12000  # frames per render part (the ~14436-frame FFmpeg stitch ceiling, with margin)


class VerticalState(TypedDict, total=False):
    project: str
    project_dir: str
    scope: str
    thread: str
    lane: str
    stub: str
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


def _vdir(proj: Path) -> Path:
    return proj / "assets" / "vertical"


def _vprev(proj: Path) -> Path:
    return proj / "_previews" / "vertical"


def _comp_id(proj: Path) -> str:
    return G._pascal(proj.name) + "Vertical"


def _dims(path: Path):
    if path.suffix.lower() in G.VIDEO_EXT:
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(path)],
                           capture_output=True, text=True)
        try:
            w, h = (int(x) for x in r.stdout.strip().strip(",").split(",")[:2])
            return w, h
        except Exception:
            return None
    try:
        from PIL import Image
        with Image.open(path) as im:
            return im.size
    except Exception:
        return None


# ── nodes ────────────────────────────────────────────────────────────────────────────
def v_preflight(state: VerticalState) -> VerticalState:
    """Phase 0: the 16:9 FINAL exists (Mike approved it), the blueprint + paused spine + mix record are on disk;
    create the lean vertical asset tree with its own spine hardlink."""
    node = "v_preflight"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    final = proj / f"{proj.name}-FINAL.mp4"
    missing = [p.name for p in (final, C.doc(proj, "edit_plan"), C.doc(proj, "cue_sheet"), C.doc(proj, "transitions"),
                                C.doc(proj, "transition_plan"), C.doc(proj, "cover_plan"), C.doc(proj, "as_recorded"),
                                proj / "mix-audio.json", proj / "assets" / "spine.mp4", proj / "assets" / "captions.json") if not p.is_file()]
    if missing:
        return C._fail(state, node, "vertical needs the delivered 16:9 first; missing: " + ", ".join(missing))
    if not C.paused_spine(proj, scope):
        return C._fail(state, node, "paused spine missing")
    vd = _vdir(proj)
    for sub in set(G.ASSET_FOLDERS.values()) | {"transitions", "slide-sources"}:
        (vd / sub).mkdir(parents=True, exist_ok=True)
    _vprev(proj).mkdir(parents=True, exist_ok=True)
    vs = vd / "spine.mp4"
    if not vs.is_file():
        try:
            os.link(proj / "assets" / "spine.mp4", vs)   # same volume: a hardlink keeps the lean dir lean
        except OSError:
            shutil.copyfile(proj / "assets" / "spine.mp4", vs)
    return {"steps": C._step(state, node, "ran", f"{final.name} present, vertical asset tree ready under assets/vertical/")}


def v_face_crop(state: VerticalState) -> VerticalState:
    """§1b: the face crop is MEASURED (face detection, never a whole-frame centroid) -> assets/vertical/face-crop.json."""
    node = "v_face_crop"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    out = _vdir(proj) / "face-crop.json"
    if not (out.is_file() and not _redo(state, node)):
        rc, res = C.run_streaming([sys.executable, "-u", str(MEASURE_FACE), str(proj), "--scope", scope, "--out", str(out)], state, node)
        if rc != 0 or not out.is_file():
            return C._fail(state, node, "measure_face_crop.py failed (no green screen and no detectable face?)", res)
    m = json.loads(out.read_text(encoding="utf-8"))
    return {"steps": C._step(state, node, "ran", f"face at {m.get('mean_pct')}% (spread {m.get('spread')}), objectPosition '{m.get('objectPosition')}'")}


def _qa_path_exists(proj: Path, raw: str) -> bool:
    """visual-qa writes paths absolute OR relative to the project folder OR to the repo root; test all three."""
    p = Path(str(raw))
    if p.is_absolute():
        return p.is_file()
    return (proj / p).is_file() or (C.REPO_ROOT / p).is_file() or p.is_file()


def _vexpectations(proj: Path):
    plan = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8"))
    return G._asset_expectations(plan)


def _vfiles(proj: Path, e: dict):
    return G._asset_files(proj, e, base=_vdir(proj))


def _hfiles(proj: Path, e: dict):
    return G._asset_files(proj, e)


VERTICAL_BRIEFS = {
    "envato-sourcer": ("Re-source EVERY listed slot as a NATIVE VERTICAL (portrait 9:16) clip: search with `python "
                       "video-creation/skills/envato-broll/search_envato.py \"<query>\" --portrait`, pick by the same literal-noun + tone rule "
                       "against the BROLL-PLAN query and beat, download with download_envato.py into assets/vertical/vid/<BR-id>-<slug>.mp4, "
                       "1080x1920 H.264, audio stripped, trimmed to slot + ~1 s handles, no watermark. If NO vertical inventory exists for a "
                       "slot, the sanctioned fallback is a centre-crop of the 16:9 clip in assets/vid/ to 1080x1920 (ffmpeg crop) and it MUST be "
                       "FLAGGED per slot in your report, never used silently."),
    "image-gen": ("Regenerate every listed image at TRUE 9:16 (portrait 1024x1536; SAY 'vertical 9:16 portrait' in every prompt) as the SAME "
                  "shot recomposed for portrait, never a crop: attach its 16:9 original from assets/img/ as a reference image (`ref`) so the "
                  "composition, palette and subject carry over, plus the row's real-mark reference (e.g. kaspa-logo.png) when the BROLL-PLAN "
                  "Reference column names one. Output assets/vertical/img/<IMG-id>-<slug>.png. Every image unique."),
    "receipt-capturer": ("Re-capture every listed receipt in MOBILE VIEW: portrait viewport 390x844 (device scale 3) via "
                         "video-creation/skills/receipt-capture/capture.py or Playwright Python, so the page reflows to one readable column; "
                         "same pages, same highlighted lines and the same cropping intent as the 16:9 captures in assets/receipts/ (open them "
                         "to match), never a centre-crop of the desktop capture. Output assets/vertical/receipts/<R-id>-<slug>.png (the R5 "
                         "split stays two files). Open and verify every capture."),
    "slide-builder": ("RE-SHOOT the existing HTML sources at 1080x1920 so the layout REFLOWS (headline wraps, card rows stack, the same locked "
                      "stylesheet, the same state variants -s1..-sN): the source is assets/slide-sources/containers.html + its driver _shot.py; "
                      "add a portrait frame size/media rules rather than redesigning, and write the PNGs to assets/vertical/title-slides/ and "
                      "assets/vertical/card-slides/ with the SAME file names as the 16:9 PNGs. Nothing may clip; text readable at phone size."),
    "chart-builder": ("RE-SHOOT every listed diagram's HTML (assets/diagrams/<id>.html) at 1080x1920 so the node mesh goes TALL (restack, same "
                      "roles/colours, same states, same file names) into assets/vertical/diagrams/; and re-lay the animated chart's design states "
                      "for portrait IN THE SAME HTML CONTRACT (assets/charts/<id>.html -> assets/vertical/charts/<id>-<state>.png + an updated "
                      "<id>.vertical.spec.md with the portrait geometry) so the comp's useCurrentFrame component can reproduce it. Never letterbox "
                      "the 16:9 layout."),
}


def v_assets(state: VerticalState) -> VerticalState:
    """Phase 1: every 16:9 asset id rebuilt native-vertical by the same five builders (in parallel, each with the
    vertical brief), only the ids still missing under assets/vertical/, then visual-qa over every vertical file."""
    node = "v_assets"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    exp = _vexpectations(proj)
    redo = _redo(state, node)
    vd = _vdir(proj)
    qa_dest = vd / "VISUAL-QA.json"
    prev = {}
    if qa_dest.is_file() and not redo:
        try:
            prev = {Path(a.get("path", "")).name: a for a in json.loads(qa_dest.read_text(encoding="utf-8")).get("assets", [])}
        except Exception:
            prev = {}
    jobs = {}
    for e in exp:
        have = _vfiles(proj, e)
        gone = any(not _qa_path_exists(proj, a.get("path", "")) and str(a.get("verdict", "")).upper() != "PASS"
                   and (Path(a.get("path", "")).stem == e["id"] or Path(a.get("path", "")).stem.startswith(e["id"] + "-"))
                   for a in prev.values())
        need = redo or not have or gone
        b = G.BUILDER_OF[e["kind"]]
        jobs.setdefault(b, {"todo": [], "done": []})
        (jobs[b]["todo"] if need else jobs[b]["done"]).append(e if need else e["id"])
    dispatch = {b: j for b, j in jobs.items() if j["todo"]}
    if dispatch:
        specs = []
        for b, j in dispatch.items():
            ids = ", ".join(f"{e['id']} -> assets/vertical/{e['folder']}/" for e in j["todo"])
            prompt = (f"VERTICAL (9:16) rebuild for the longform-edited project `{proj.name}` (folder `{proj}`), per "
                      f"`video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` §1 (read it first). The 16:9 originals "
                      f"are under `{proj / 'assets'}`; the worklists are `{C.doc(proj, 'broll_plan')}` and `{C.doc(proj, 'cover_plan')}`. "
                      f"Build ONLY these ids, into the vertical folders named: {ids}."
                      + (f" Already present, leave alone: {', '.join(j['done'])}." if j["done"] else "")
                      + "\nEvery output is 1080x1920 (portrait), named exactly like its 16:9 twin (`<id>.<ext>` / `<id>-<state>.<ext>`), inside the "
                        "vertical folder only. No em dashes on screen. QA-open every file, return your per-id report, and flag every fallback.\n"
                      + VERTICAL_BRIEFS[b] + G._qa_feedback(prev, j["todo"]))
            specs.append((b, prompt, f"agent-vassets-{b}-{proj.name}.log"))
        print(f"[longform] {node}: dispatching {len(specs)} builder(s) in parallel for the vertical: "
              + ", ".join(f"{b} ({len(dispatch[b]['todo'])})" for b in dispatch), flush=True)
        results = C.spawn_agents_parallel(state, node, specs)
        for b, (rc, out) in results.items():
            print(f"[longform] {node}: {b} exit {rc}", flush=True)
    missing = [e["id"] for e in exp if not _vfiles(proj, e)]
    if missing:
        return C._fail(state, node, "vertical assets still missing: " + ", ".join(missing) + " (read graph/data/agent-vassets-<builder>-<project>.log; a re-drive rebuilds only the gap)")
    # visual-qa on every vertical file lacking a PASS
    lines, carried = [], []
    for e in exp:
        for f in _vfiles(proj, e):
            shown = f
            if f.suffix.lower() in G.VIDEO_EXT:
                shown = G._mid_frame(f, _vprev(proj) / "qa" / f"{f.stem}.mid.png") or f
            pa = prev.get(shown.name)
            if pa and str(pa.get("verdict", "")).upper() == "PASS":
                carried.append(pa)
            else:
                lines.append(f"- `{shown}`  [{e['kind']} {e['id']} VERTICAL 1080x1920] spec: {e['spec']}")
    if lines:
        new_dest = vd / "VISUAL-QA.new.json"
        new_dest.unlink(missing_ok=True)
        prompt = (f"Visual QA for the VERTICAL (9:16) assets of `{proj.name}` (folder `{proj}`): open EVERY file below and judge it against "
                  "its spec, the house style, and the vertical rules (vertical-repurpose.md §1): portrait 1080x1920, nothing important "
                  "cropped, text readable at PHONE size, slides/diagrams reflowed (stacked) rather than shrunk, receipts in a mobile single "
                  "column, images recomposed for portrait (not a crop with empty bands), b-roll portrait without letterboxing. A `.mid.png` "
                  "is a video slot's middle frame. Check ONLY the files listed.\n" + "\n".join(lines)
                  + f"\nReturn your JSON verdict AND save it to EXACTLY `{new_dest}` with Bash. Every listed asset appears with PASS or FAIL.")
        rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-vassets-visual-qa-{proj.name}.log")
        if not C.persist_agent_json(out, new_dest, want_key="assets"):
            return C._fail(state, node, f"visual-qa returned no usable verdict (rc {rc})", out)
        fresh = json.loads(new_dest.read_text(encoding="utf-8")).get("assets", [])
        by_name = {Path(a.get("path", "")).name: a for a in carried}
        by_name.update({Path(a.get("path", "")).name: a for a in fresh})
        merged = list(by_name.values())
        C._write_json_atomic(qa_dest, {"assets": merged, "summary": {"checked": len(merged),
                                       "passed": sum(1 for a in merged if str(a.get("verdict", "")).upper() == "PASS"),
                                       "failed": sum(1 for a in merged if str(a.get("verdict", "")).upper() != "PASS")}})
        new_dest.unlink(missing_ok=True)
    qa = json.loads(qa_dest.read_text(encoding="utf-8"))
    fails = [a for a in qa.get("assets", []) if str(a.get("verdict", "")).upper() != "PASS"]
    if fails:
        return C._fail(state, node, f"visual-qa FAILED {len(fails)} vertical asset(s): "
                       + "; ".join(f"{Path(a.get('path', '?')).name}: {', '.join(a.get('defects') or [])[:120]}" for a in fails[:8])
                       + " (delete the failing files and re-drive; the builders get the defects as feedback)")
    return {"steps": C._step(state, node, "ran", f"{len(exp)} vertical asset id(s) built, visual-qa PASS on {len(qa.get('assets', []))} file(s)")}


def v_verify_assets(state: VerticalState) -> VerticalState:
    """Pure code: every id has a vertical file, every renderable is PORTRAIT (h > w), no orphans in assets/vertical/,
    every file PASS in the vertical visual-qa."""
    node = "v_verify_assets"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    exp = _vexpectations(proj)
    vd = _vdir(proj)
    problems, claimed = [], set()
    for e in exp:
        files = _vfiles(proj, e)
        if not files:
            problems.append(f"{e['id']} has no vertical file")
        for f in files:
            d = _dims(f)
            if d and not d[1] > d[0]:
                problems.append(f"{f.name} is not portrait ({d[0]}x{d[1]})")
        claimed.update(files)
    for sub in sorted(set(G.ASSET_FOLDERS.values())):
        d = vd / sub
        for f in sorted(d.iterdir()) if d.is_dir() else []:
            if f.is_file() and f.suffix.lower() in G.VIDEO_EXT + G.IMAGE_EXT and f not in claimed:
                problems.append(f"orphan vertical renderable: {sub}/{f.name}")
    qa_p = vd / "VISUAL-QA.json"
    if not qa_p.is_file():
        problems.append("assets/vertical/VISUAL-QA.json missing")
    else:
        verdict = {Path(a.get("path", "")).name.replace(".mid.png", ""): str(a.get("verdict", "")).upper() for a in json.loads(qa_p.read_text(encoding="utf-8")).get("assets", [])}
        for f in sorted(claimed):
            v = verdict.get(f.name) or verdict.get(f.stem)
            if v != "PASS":
                problems.append(f"{f.name} visual-qa {v or 'never opened'}")
    if problems:
        return C._fail(state, node, f"{len(problems)} problem(s): " + " | ".join(problems[:12]))
    return {"steps": C._step(state, node, "ran", f"{len(exp)} ids / {len(claimed)} portrait files reconciled, zero orphans, visual-qa clean")}


def v_comp(state: VerticalState) -> VerticalState:
    """Phase 2: the comp-builder builds <Project>Vertical.tsx (1080x1920, same fps/DUR/CARD_T/COVERS/captions/transitions,
    a 16:9-ref -> vertical-asset lookup, the MEASURED face crop, the lean public dir), gates it, smoke-tests stills."""
    node = "v_comp"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp_id = _comp_id(proj)
    comp = G.REMOTION / "src" / f"{comp_id}.tsx"
    report = _vprev(proj) / "comp-build-report.json"
    meta, paused = G._paused_meta(proj, scope)
    face = json.loads((_vdir(proj) / "face-crop.json").read_text(encoding="utf-8"))
    if not (comp.is_file() and report.is_file() and not _redo(state, node)):
        prompt = (f"Build the VERTICAL (1080x1920) Remotion composition for the longform-edited project `{proj.name}` (folder `{proj}`) per "
                  f"`video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` §1b, §2 (read it first) and your VERTICAL "
                  f"section.\nComposition id + file: `{comp_id}` -> `{comp}` (register in Root.tsx at 1080x1920, fps 30, the SAME DUR as the 16:9). "
                  f"The 16:9 comp `{G.REMOTION / 'src' / (G._pascal(proj.name) + '.tsx')}` is YOUR OWN project file: reuse its constants and COVERS "
                  "(byte-identical beat times, CARD_T, PAUSE, SPINE_SECS, transition ids, caption windows) by importing or copying them, and put "
                  "the 16:9-ref -> vertical-asset mapping in explicit lookup tables so a missing vertical asset throws at build time.\n"
                  f"Lean public dir (the ONLY --public-dir for this comp): `{_vdir(proj)}` (spine.mp4 + the vertical asset folders). "
                  f"MEASURED face crop: `{_vdir(proj) / 'face-crop.json'}` -> objectPosition `{face.get('objectPosition')}` on the spine "
                  f"(per-window offsets allowed; spread {face.get('spread')}). Captions: same file + windows, restyled for the portrait frame.\n"
                  f"Blueprint: `{C.doc(proj, 'edit_plan')}` · `{C.doc(proj, 'cue_sheet')}` · `{C.doc(proj, 'transitions')}` + "
                  f"`{C.doc(proj, 'transition_plan')}`. Vertical chart geometry: assets/vertical/charts/*.vertical.spec.md. "
                  f"Vertical-only substitutions the lookup MUST honour: `{_vdir(proj) / 'NOTES.md'}` (read it).\n"
                  "Then: run the Python comp gates (lint_comp_imports, lint_covers, lint-deck-containers on the vertical slide/diagram dirs, "
                  "lint_slide_balance, lint_animated_charts, lint_transition_assets with the vertical public dir), bundle ONCE and smoke-test "
                  "one still per content type AND one per FACE window (`npx remotion bundle` + `npx remotion still` against the bundle) into "
                  f"`{_vprev(proj) / 'qa'}`, LOOK at them (face centred, nothing clipped, text readable at phone size), fix, and chunk-QA the "
                  "face cuts and both cards. Do NOT run the full render (the graph renders). "
                  f"Save your JSON report to EXACTLY `{report}` (fields as in your definition; `draft` may be null). Never end your turn "
                  "while a command runs.")
        rc, out = C.spawn_agent(state, node, "comp-builder", prompt, f"agent-vcomp-{proj.name}.log")
        if not report.is_file():
            C.persist_agent_json(out, report, want_key="comp_file")
    if not comp.is_file():
        return C._fail(state, node, f"vertical composition not written: {comp}")
    root = (G.REMOTION / "src" / "Root.tsx").read_text(encoding="utf-8", errors="replace")
    if f'id="{comp_id}"' not in root:
        return C._fail(state, node, f"{comp_id} is not registered in Root.tsx")
    src = comp.read_text(encoding="utf-8", errors="replace")
    if not re.search(r"1080", src) or not re.search(r"1920", src):
        return C._fail(state, node, "the vertical comp does not declare 1080x1920")
    return {"steps": C._step(state, node, "ran", f"{comp.name} registered (1080x1920), face crop {face.get('objectPosition')}")}


def v_verify_comp(state: VerticalState) -> VerticalState:
    """Pure code: the Python comp gates on the vertical comp with the vertical asset dirs."""
    node = "v_verify_comp"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp = G.REMOTION / "src" / f"{_comp_id(proj)}.tsx"
    vd = _vdir(proj)
    runs = [
        ("lint_comp_imports.py", [str(comp)]),
        ("lint_covers.py", [str(comp)]),
        ("lint-deck-containers.py", [str(comp)] + [str(vd / d) for d in ("card-slides", "title-slides", "diagrams") if (vd / d).is_dir()]),
        ("lint_slide_balance.py", [str(comp)]),
        ("lint_animated_charts.py", [str(comp)]),
        ("lint_transition_assets.py", [str(comp), str(vd), str(C.doc(proj, "transitions"))]),
        ("check_spine_fps.py", [str(vd / "spine.mp4"), "30"]),
    ]
    results, fails = {}, []
    for script, args in runs:
        rc, out = C.run_streaming([sys.executable, "-u", str(G.COMP_GATES / script), *args], state, node)
        pat = G.GATE_LINES.get(script)
        m = re.search(pat, out or "", re.M) if pat else None
        ok = rc == 0 and (m.group(1) == "PASS" if m else True)
        results[script] = {"ok": ok, "line": m.group(0) if m else ""}
        if not ok:
            fails.append(script)
    C._write_json_atomic(_vprev(proj) / "verify-comp.json", {"results": results, "fails": fails, "comp": str(comp)})
    if fails:
        return C._fail(state, node, "vertical comp gates failed: " + ", ".join(fails))
    return {"steps": C._step(state, node, "ran", f"{len(runs)} gate(s) PASS on {comp.name}")}


def _concat(parts, out: Path):
    n = len(parts)
    inputs = []
    for p in parts:
        inputs += ["-i", str(p)]
    fc = "".join(f"[{i}:v:0][{i}:a:0]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", str(out)],
                       capture_output=True, text=True)
    return r.returncode == 0, r.stderr[-600:]


def v_render(state: VerticalState) -> VerticalState:
    """Phase 3: render_comp.py --mode final on the vertical comp with the lean public dir; over the stitch ceiling it
    renders frame-range parts and joins them with a standalone sync-safe ffmpeg concat."""
    node = "v_render"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp_id = _comp_id(proj)
    vp = _vprev(proj)
    out = vp / f"{proj.name}-VERTICAL-v1-video.mp4"
    n = 1
    while out.is_file() and not _redo(state, node) and (vp / f"{proj.name}-VERTICAL-v{n}.mp4").is_file():
        n += 1
        out = vp / f"{proj.name}-VERTICAL-v{n}-video.mp4"
    if out.is_file() and not _redo(state, node):
        return {"steps": C._step(state, node, "skipped", f"{out.name} present")}
    paused = C.paused_spine(proj, scope)
    frames = int(round((G._duration(paused) or 0.0) * 30))
    base = [sys.executable, "-u", str(G.RENDER_COMP), str(proj), "--mode", "final", "--comp", comp_id, "--public-dir", str(_vdir(proj))]
    if frames > STITCH_CEILING:
        parts, a = [], 0
        while a < frames:
            b = min(frames - 1, a + STITCH_CEILING - 1)
            part = vp / f"_part-{a}-{b}.mp4"
            rc, res = C.run_streaming(base + ["--out", str(part), "--frames", f"{a}-{b}"], state, node)
            if rc != 0:
                return C._fail(state, node, f"part {a}-{b} failed", res)
            parts.append(part)
            a = b + 1
        ok, err = _concat(parts, out)
        if not ok:
            return C._fail(state, node, "ffmpeg concat of the parts failed", err)
    else:
        rc, res = C.run_streaming(base + ["--out", str(out)], state, node)
        if rc != 0:
            return C._fail(state, node, "vertical render failed", res)
    d = G._duration(out) or 0.0
    return {"steps": C._step(state, node, "ran", f"{out.name} ({d:.2f}s, {frames} frames{' in parts' if frames > STITCH_CEILING else ''})")}


def _latest_vertical_video(proj: Path):
    vp = _vprev(proj)
    c = [(int(m.group(1)), p) for p in (vp.glob(f"{proj.name}-VERTICAL-v*-video.mp4") if vp.is_dir() else [])
         for m in [re.search(r"-v(\d+)-video\.mp4$", p.name)] if m]
    return max(c)[1] if c else None


def v_mix(state: VerticalState) -> VerticalState:
    """Phase 4: the SAME mix (mix_music.py resolves the same plan onto the vertical video; the VO is identical)."""
    node = "v_mix"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    video = _latest_vertical_video(proj)
    if not video:
        return C._fail(state, node, "no vertical video render")
    out = video.with_name(video.name.replace("-video.mp4", ".mp4"))
    if not (out.is_file() and out.stat().st_mtime >= video.stat().st_mtime and not _redo(state, node)):
        rc, res = C.run_streaming([sys.executable, "-u", str(G.MIX_MUSIC), str(proj), "--video", str(video), "--out", str(out)], state, node)
        if rc != 0 or not out.is_file():
            return C._fail(state, node, "mix_music.py failed on the vertical", res)
    return {"steps": C._step(state, node, "ran", f"{out.name} mixed (same beds + SFX as the 16:9)")}


def v_verify_final(state: VerticalState) -> VerticalState:
    """Phase 5: duration/fps/audio parity with the 16:9 FINAL, portrait dimensions, and the MANDATORY face-centring
    check: one frame from EVERY face window of the rendered vertical, face detected and centred (35-65% of width)."""
    node = "v_verify_final"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    video = _latest_vertical_video(proj)
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else None
    final169 = proj / f"{proj.name}-FINAL.mp4"
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "mixed vertical missing")
    probs = []
    d, d169 = G._duration(mixed) or 0.0, G._duration(final169) or 0.0
    if abs(d - d169) > 0.1:
        probs.append(f"duration {d:.2f}s vs 16:9 {d169:.2f}s")
    dims = _dims(mixed)
    if dims != (VER_W, VER_H):
        probs.append(f"dimensions {dims}")
    if not G._has_audio_stream(mixed):
        probs.append("no audio")
    lv, pv = G._lufs(mixed)
    l169, _ = G._lufs(final169)
    if lv is not None and l169 is not None and abs(lv - l169) > 0.5:
        probs.append(f"loudness {lv} vs 16:9 {l169} LUFS")
    # face centring, every FACE window, on the RENDER (paused-spine times)
    meta, _ = G._paused_meta(proj, scope)
    card_t = [float(p["at"]) for p in meta.get("pauses") or []]
    pause = float(meta.get("pause_s") or 0)
    sh = lambda t: t + pause * sum(1 for c in card_t if c <= t + 1e-6)
    qa = _vprev(proj) / "qa"
    qa.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(C.SCRIPTS))
    import measure_face_crop as MF  # noqa: E402
    ar = C.doc(proj, "as_recorded").read_text(encoding="utf-8")
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar, re.M | re.S)
    faces = [(float(m.group(1)), float(m.group(2))) for m in MF.FACE_RE.finditer(sec.group(0) if sec else "")]
    face_report = []
    for i, (fa, fz) in enumerate(faces, 1):
        t = sh((fa + fz) / 2)
        png = MF.grab(mixed, t, qa / f"face-F{i}.png")
        pct = MF.face_centre_pct(png) if png else None
        face_report.append({"window": [fa, fz], "t_render": round(t, 2), "face_pct": pct})
        if pct is None:
            probs.append(f"F{i}: no face detected in the vertical render at {t:.2f}s")
        elif not 35 <= pct <= 65:
            probs.append(f"F{i}: face at {pct:.1f}% of width (not centred / clipped)")
    C._write_json_atomic(_vprev(proj) / "verify-final.json", {"vertical": str(mixed), "duration_s": d, "final_16x9_s": d169, "dims": dims,
                                                            "lufs": lv, "lufs_16x9": l169, "peak": pv, "faces": face_report, "problems": probs})
    if probs:
        return C._fail(state, node, "vertical does not verify: " + "; ".join(probs))
    return {"steps": C._step(state, node, "ran", f"{mixed.name}: {d:.2f}s, 1080x1920, {lv} LUFS, faces " + ", ".join(f"{f['face_pct']:.0f}%" for f in face_report))}


def gate_vertical(state: VerticalState) -> VerticalState:
    proj = _proj(state)
    video = _latest_vertical_video(proj)
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else _vprev(proj)
    return C.gate(state, "vertical", "the mixed VERTICAL render (face centring, framing at phone size, audio parity)", [mixed])


def v_deliver(state: VerticalState) -> VerticalState:
    """Promote the approved vertical to the project root as <project>-VERTICAL.mp4. NOT queued: a separate deliverable
    (vertical-repurpose.md §6), staged only when Mike says so. Vertical previews are recycled after the promote."""
    node = "v_deliver"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub"), "status": "done"}
    video = _latest_vertical_video(proj)
    mixed = video.with_name(video.name.replace("-video.mp4", ".mp4")) if video else None
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "no mixed vertical to promote")
    dest = proj / f"{proj.name}-VERTICAL.mp4"
    if not dest.is_file() or dest.stat().st_size != mixed.stat().st_size:
        shutil.copyfile(mixed, dest)
    ok, msg = G._recycle([_vprev(proj)])
    if not ok:
        return C._fail(state, node, f"promoted, but recycling _previews/vertical failed: {msg}")
    return {"steps": C._step(state, node, "ran", f"promoted -> {dest.name} ({dest.stat().st_size / 1e6:.0f} MB); not queued"), "status": "done"}


ORDER = ["v_preflight", "v_face_crop", "v_assets", "v_verify_assets", "v_comp", "v_verify_comp",
         "v_render", "v_mix", "v_verify_final", "gate_vertical", "v_deliver"]
NODES = {n: globals()[n] for n in ORDER}


def _after(node: str, next_node: Optional[str]):
    def route(state):
        if state.get("status") == "failed":
            return END
        return next_node or END
    return route


def build_vertical_graph(checkpointer=None):
    g = StateGraph(VerticalState)
    for n in ORDER:
        g.add_node(n, NODES[n])
    g.add_edge(START, ORDER[0])
    for i, n in enumerate(ORDER):
        g.add_conditional_edges(n, _after(n, ORDER[i + 1] if i + 1 < len(ORDER) else None))
    return g.compile(checkpointer=checkpointer)
