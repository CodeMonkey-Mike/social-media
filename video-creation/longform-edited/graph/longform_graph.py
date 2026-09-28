# longform_graph.py — the longform-edited track as ONE LangGraph StateGraph (2026-09-17).
#
# The third automation (after LinkedIn and livestream-repurpose), built to the same
# doctrine (see common.py header). FULL-SPAN TOPOLOGY FROM DAY ONE: every step of the
# track is a node in the order the skills prescribe, so the order can never be argued
# in prose again (claudeisnaughty #3/#4). Steps that are not automated yet are
# artifact-aware PLACEHOLDERS (interrupt: "do it by hand", pass silently once the
# artifact exists); the frontier advances node by node, blessed live on a real video.
# The first video through it: kaspa vProgs (Mike, 2026-09-17).
#
#   PRE-PRODUCTION  init_project -> research -> screenplay -> [gate screenplay]
#                   -> await_recording (Mike records raw/<scope>.mkv)
#   SPINE           compress -> defumble -> cover_blackout -> desilence_coarse (700 ms)
#                   -> [gate spine_review: Mike listens] -> burst_removal -> desilence_final
#                   (two-zone) -> transcribe -> verify_spine -> [gate spine]
#   PLAN            as_recorded -> coverage -> music_plan -> [gate plan]
#                   -> assets -> verify_assets -> edit_plan -> transitions
#                   -> reconcile_docs -> lint_docset -> [gate blueprint]
#   BUILD           card_pauses -> captions -> comp_build -> verify_comp -> [gate draft]
#   DELIVER         final_render -> verify_final -> definition_of_done -> stage_longform -> END
#   any node        -> (failed) -> END                                   <- HALT route
#
# Wave A (built): init_project · research (data-researcher agent) · screenplay
# (screenplay-strategist agent + the Convention-5 format lint, skills/doc-reference/lint_screenplay.py) ·
# gate_screenplay · await_recording · compress · verify_spine. Wave B (2026-09-27): the spine
# chain as headless agent nodes (defumbler / cover-blackout / desilencer x2 / burst-removal /
# transcriber). Wave C so far: as_recorded (as-recorded-author agent + lint_as_recorded.py). Everything else is a placeholder until its wave. Judgment nodes spawn
# HEADLESS agents and verify the ARTIFACT from disk; nothing trusts chat text.

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402


class LongformState(TypedDict, total=False):
    # inputs (set by run.py)
    project: str            # folder name under longform-edited/media/
    project_dir: str
    brief: Optional[str]    # the concept brief (written into PROJECT-LOG by init_project)
    constraints: Optional[str]
    title: Optional[str]
    scope: str              # the recorded take's scope: ALL (single take) or CH1-CH3 ...
    face_max: Optional[int]  # mechanical gate: max [FACE] beats the screenplay may carry
    envato_max: Optional[int]   # plan: Envato video budget (default 10)
    chatgpt_max: Optional[int]  # plan: ChatGPT image budget (default 5)
    coarse_sil: Optional[float]  # spine: the COARSE one-zone min-silence (default 0.7)
    sil_pre: Optional[float]     # spine: FINAL two-zone intro min-silence (default 0.25)
    sil_post: Optional[float]    # spine: FINAL two-zone body min-silence (default 0.5)
    split: Optional[float]       # spine: the hook-end second for the two-zone pass
    bursts: Optional[str]        # spine: Mike's burst timestamps "a-b,c-d" (from the spine review)
    until: str              # stop after this gate is approved
    approve: list           # gates approved on this invocation
    done: list              # placeholder nodes marked done by hand on this invocation
    redo: list              # nodes to re-run even if their artifact exists
    stub: str               # "" = real; ok|fail = structural test
    thread: str             # checkpoint thread (for the printed resume command)
    # bookkeeping
    steps: dict
    status: str             # running | done | failed
    error: Optional[str]
    summary: dict


def _proj(state) -> Path:
    return Path(state["project_dir"])


def _redo(state, node) -> bool:
    return node in (state.get("redo") or [])


def _ffprobe(path: Path, *entries) -> list:
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", ",".join(entries),
             "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
        return [l.strip() for l in out.stdout.splitlines() if l.strip()]
    except Exception:
        return []


def _duration(path: Path) -> Optional[float]:
    v = _ffprobe(path, "format=duration")
    try:
        return float(v[0])
    except Exception:
        return None


# ── PRE-PRODUCTION ───────────────────────────────────────────────────────────

def init_project(state: LongformState) -> LongformState:
    node = "init_project"
    proj = _proj(state)
    args = [sys.executable, "-u", str(C.SCRIPTS / "init_project.py"), "--project", str(proj)]
    for k in ("brief", "constraints", "title"):
        if state.get(k):
            args += [f"--{k}", state[k]]
    cmd = C.stub_cmd(node, state["stub"], ["INIT ok stub"]) if state.get("stub") else args
    rc, out = C.run_streaming(cmd, state, node)
    if rc != 0:
        return C._fail(state, node, "init_project.py failed", out)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    missing = [d for d in ("raw", "spine", "assets", "_previews") if not (proj / d).is_dir()]
    if missing or not C.doc(proj, "project_log").is_file():
        return C._fail(state, node, f"skeleton incomplete: missing {missing or 'PROJECT-LOG.md'}")
    return {"steps": C._step(state, node, "ran", f"{proj.name}: folder + PROJECT-LOG ready")}


RESEARCH_PROMPT = """Project: {project}
Project folder: {project_dir}
Concept brief + hard constraints: read `{log}` ("Concept brief" and "Hard constraints" sections). The brief is LOCKED for this run; research it, do not change its angle.

Write the research dump for this longform-edited video to EXACTLY this file: `{dest}`
SHAPE: copy video-creation/longform-edited/skills/doc-reference/DATA.reference.md exactly (sections, columns). Format owner: video-creation/longform-edited/skills/charts/charts.md section 1 (DATA.md + the CHART-SOURCE INDEX). Read both first, plus persona/persona.json (verified_claims_only; no em dashes anywhere) and the brief.

Requirements (the graph verifies these FROM DISK and halts otherwise):
- every number, date, name and claim carries a source URL and the date you read it
- a `## Do-not-air numbers` section: claims that are wrong, unverifiable, or too stale to air, each with why
- a `## CHART-SOURCE INDEX` table: ID | chart / graphic | seen in / source | build mode (code | screencap | restyle)
- a `## Market snapshot` block, timestamped, for every live-drift number ([VERIFY] items)
- primary sources first (official docs, GitHub, KIPs, the founders' and core devs' own posts and talks, reputable coverage second); anything you could not confirm from a primary source is tagged [VERIFY]
When the file is written, print exactly one line: DATA-OK path={dest}
"""


def research(state: LongformState) -> LongformState:
    node = "research"
    proj = _proj(state)
    dest = C.doc(proj, "data")
    checks = [r"chart-source index", r"do-?not-?air", r"https?://"]
    if not state.get("stub") and not _redo(state, node):
        ok, _ = C.doc_check(dest, 1500, checks)
        if ok:
            return {"steps": C._step(state, node, "skipped", "DATA.md present")}
    prompt = RESEARCH_PROMPT.format(project=proj.name, project_dir=proj,
                                    log=C.doc(proj, "project_log"), dest=dest)
    rc, out = C.spawn_agent(state, node, "data-researcher", prompt, f"agent-research-{proj.name}.log")
    if state.get("stub"):
        return ({"steps": C._step(state, node, "stub")} if rc == 0
                else C._fail(state, node, "stub agent failure", out))
    ok, missing = C.doc_check(dest, 1500, checks)
    if not ok:
        return C._fail(state, node, f"DATA.md not acceptable ({', '.join(missing)}); agent rc {rc}", out)
    n_links = len(re.findall(r"https?://", dest.read_text(encoding="utf-8", errors="replace")))
    return {"steps": C._step(state, node, "ran", f"DATA.md written ({n_links} source links)")}


SCREENPLAY_PROMPT = """Author the pre-production SCREENPLAY.md for the longform-edited project `{project}` (folder `{project_dir}`).
Read first, all of them: video-creation/longform-edited/skills/doc-reference/SCREENPLAY.reference.md (the canonical SHAPE: copy it exactly), `{log}` (the LOCKED concept brief + Mike's hard constraints), `{data}` (the fact source: every on-screen number, date and name comes from here, never invented), video-creation/longform-edited/screenplay.md (the canonical format, Convention 5 tagged lines), persona/persona.json.
Mike's hard constraints for THIS video, obey them exactly: {constraints}
Output: return the COMPLETE SCREENPLAY.md per your definition AND save it to EXACTLY `{dest}` using Bash with a quoted heredoc (cat > "{dest}" <<'EOF' ... EOF). FORMAT: Convention 5 exactly as the exemplars write it. Every tagged line starts with its emoji and a BACKTICKED tag (the gray chip in the VS Code preview): 👤 `[FACE]` · 🗣️ `[COVER]` · 🔒 `[SAY-EXACT]` · 🎬 `[SHOW]` · 💬 `[NOTE]` · 🔍 `[VERIFY]`; a locked line is 🔒 `[SAY-EXACT]` 👤 `[FACE]` (or 🗣️ `[COVER]`); the legend table cells are backticked too; one job per line; no em dashes. The graph runs video-creation/longform-edited/skills/doc-reference/lint_screenplay.py on the file and HALTS on a format failure.
The graph also verifies the file from disk and halts if it is missing its sections (the chapter map, the tagged beats, per-chapter sections, ## MUSIC-MOOD-PLAN, ## VISUAL-PLAN, ## OPEN QUESTIONS).
"""

LINT_SCREENPLAY = C.SKILLS / "doc-reference" / "lint_screenplay.py"
LINT_RE = re.compile(r"^SCREENPLAY-LINT (PASS|FAIL) faces=(\d+) fails=(\d+) warns=(\d+)", re.M)


def lint_screenplay(state, node, dest: Path):
    """The Convention-5 format gate IN CODE (2026-09-17, after the first graph screenplay shipped
    bare [FACE] tags to Mike's gate). --fix repairs the safe mechanical class (backticks, locked-line
    order, em dashes) so a strategist's formatting slip never costs a re-run; anything else FAILS
    the node. Returns (ok, faces, output)."""
    args = [sys.executable, "-u", str(LINT_SCREENPLAY), str(dest), "--fix"]
    if state.get("face_max") is not None:
        args += ["--face-max", str(state["face_max"])]
    rc, out = C.run_streaming(args, state, node)
    m = LINT_RE.search(out or "")
    faces = int(m.group(2)) if m else -1
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), faces, out


def screenplay(state: LongformState) -> LongformState:
    node = "screenplay"
    proj = _proj(state)
    dest = C.doc(proj, "screenplay")
    checks = [r"chapter map", r"\[FACE\]", r"\[COVER\]", r"MUSIC-MOOD-PLAN", r"^#+.*\bCH\s*1\b"]
    if not state.get("stub") and not _redo(state, node):
        ok, _ = C.doc_check(dest, 2000, checks)
        if ok:
            lint_ok, faces, lint_out = lint_screenplay(state, node, dest)
            if not lint_ok:
                return C._fail(state, node, "SCREENPLAY.md on disk fails the Convention-5 format lint", lint_out)
            return {"steps": C._step(state, node, "skipped", f"SCREENPLAY.md present, lint PASS ({faces} FACE beat(s))")}
    prompt = SCREENPLAY_PROMPT.format(
        project=proj.name, project_dir=proj, log=C.doc(proj, "project_log"),
        data=C.doc(proj, "data"), dest=dest,
        constraints=state.get("constraints") or "(none beyond the brief)")
    rc, out = C.spawn_agent(state, node, "screenplay-strategist", prompt,
                            f"agent-screenplay-{proj.name}.log")
    if state.get("stub"):
        return ({"steps": C._step(state, node, "stub")} if rc == 0
                else C._fail(state, node, "stub agent failure", out))
    if not C.persist_agent_markdown(out, dest, head_re=r"^#\s.*SCREENPLAY", min_bytes=2000):
        C.persist_agent_markdown(out, dest, head_re=r"^#\s", min_bytes=2000)
    ok, missing = C.doc_check(dest, 2000, checks)
    if not ok:
        return C._fail(state, node, f"SCREENPLAY.md not acceptable ({', '.join(missing)}); agent rc {rc}", out)
    # The FORMAT gate (Convention 5 + the FACE budget), in code, every video: lint_screenplay.py.
    lint_ok, faces, lint_out = lint_screenplay(state, node, dest)
    if not lint_ok:
        return C._fail(state, node, "SCREENPLAY.md failed the Convention-5 format lint (see the FAIL "
                                    "lines above; fix the file, then --redo screenplay or resume)", lint_out)
    return {"steps": C._step(state, node, "ran", f"SCREENPLAY.md written, lint PASS ({faces} FACE beat(s))")}


def gate_screenplay(state: LongformState) -> LongformState:
    proj = _proj(state)
    return C.gate(state, "screenplay", "the concept brief, DATA.md and SCREENPLAY.md",
                  [C.doc(proj, "project_log"), C.doc(proj, "data"), C.doc(proj, "screenplay")])


def await_recording(state: LongformState) -> LongformState:
    proj = _proj(state)
    return C.placeholder(
        state, "await_recording",
        how=f"Record the take(s) off SCREENPLAY.md into `{proj / 'raw'}` (the OBS master, "
            f"named `{state.get('scope', 'ALL')}.mkv` for a single take, or by chapter range). "
            "Never edit or delete a master.",
        artifact=lambda: bool(C.raw_takes(proj)), artifact_desc="a master in raw/")


# ── SPINE (Wave B, 2026-09-27) ───────────────────────────────────────────────
# The four shared spine-prep agents run HEADLESS from here, exactly like the strategists in
# the batch orchestrator: the prompt carries only facts (the fixed 13a paths + Mike's knobs);
# the agent's own skill doc is the method; the node verifies the ARTIFACT from disk. The
# chain is the ethereum-rwa shape Mike confirmed 2026-09-27: a COARSE desilence (one zone,
# ~700 ms) makes a reviewable spine -> Mike listens (bursts by ear, content flags) -> burst
# removal off that spine (never off the blackout) -> the FINAL two-zone tight pass ->
# transcribe -> verify -> Mike's transcript review. 13a letters: c.desilenced -> d.cleaned
# -> e.desilenced (no bursts: c.desilenced -> d.desilenced).

def _pick_raw(proj: Path, scope: str) -> Optional[Path]:
    takes = C.raw_takes(proj)
    named = [t for t in takes if t.stem == scope]
    if named:
        return named[0]
    return takes[0] if len(takes) == 1 else None


def _av_ok(path: Path, tol=0.06):
    v = _ffprobe(path, "stream=duration")
    try:
        return abs(float(v[0]) - float(v[1])) <= tol
    except Exception:
        return True


def compress(state: LongformState) -> LongformState:
    """Phase 1: the low-bitrate working proxy (`scripts/to_low_bps.py`, NVENC, no cutting)."""
    node = "compress"
    proj = _proj(state)
    scope = state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    if not state.get("stub") and sp["lowbps"].is_file() and not _redo(state, node):
        return {"steps": C._step(state, node, "skipped", f"{sp['lowbps'].name} present")}
    raw = None if state.get("stub") else _pick_raw(proj, scope)
    if not state.get("stub") and raw is None:
        return C._fail(state, node, f"could not pick the raw take in raw/ (name it {scope}.mkv per comp-build.md 13a)")
    args = [sys.executable, "-u", str(C.SCRIPTS / "to_low_bps.py"), str(raw), "--out", str(sp["lowbps"])]
    cmd = C.stub_cmd(node, state["stub"], ["to_low_bps stub"]) if state.get("stub") else args
    rc, out = C.run_streaming(cmd, state, node)
    if rc != 0:
        return C._fail(state, node, "to_low_bps.py failed", out)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not sp["lowbps"].is_file():
        return C._fail(state, node, f"{sp['lowbps']} not written")
    d_in, d_out = _duration(raw), _duration(sp["lowbps"])
    if d_in and d_out and abs(d_in - d_out) > 1.0:
        return C._fail(state, node, f"proxy duration {d_out:.2f}s != master {d_in:.2f}s")
    return {"steps": C._step(state, node, "ran", f"{sp['lowbps'].name} ({d_out or 0:.1f}s)")}


def _agent_step(state, node, agent, prompt, out_path: Path, check, skip_detail):
    """Spawn a shared agent for ONE spine step, then verify its artifact from disk.
    `check()` returns None when the artifact is acceptable, else the reason."""
    if not state.get("stub") and out_path.is_file() and not _redo(state, node):
        why = check()
        if why is None:
            return {"steps": C._step(state, node, "skipped", skip_detail)}
        return C._fail(state, node, f"{out_path.name} on disk is not acceptable: {why}")
    rc, out = C.spawn_agent(state, node, agent, prompt, f"agent-{node}-{state['project']}.log")
    if state.get("stub"):
        return ({"steps": C._step(state, node, "stub")} if rc == 0
                else C._fail(state, node, "stub agent failure", out))
    if not out_path.is_file():
        return C._fail(state, node, f"{agent} did not write {out_path} (agent rc {rc})", out)
    why = check()
    if why is not None:
        return C._fail(state, node, f"{out_path.name} failed verification: {why}", out)
    return {"steps": C._step(state, node, "ran", f"{out_path.name} ({_duration(out_path) or 0:.1f}s)")}


def _spine_check(out_path: Path, shorter_than: Optional[Path] = None, same_as: Optional[Path] = None,
                 sidecars=()):
    d = _duration(out_path)
    if not d:
        return "unreadable / zero duration"
    fps = _ffprobe(out_path, "stream=r_frame_rate")
    if fps and fps[0] not in ("30/1", "30000/1000"):
        return f"fps {fps[0]} (expected 30/1; comp-build.md section 1)"
    if not _av_ok(out_path):
        return "A/V duration drift over 60 ms"
    if shorter_than is not None:
        ref = _duration(shorter_than)
        if ref and d >= ref:
            return f"{d:.1f}s is not shorter than its input {ref:.1f}s"
    if same_as is not None:
        ref = _duration(same_as)
        if ref and abs(d - ref) > 0.05:
            return f"{d:.2f}s != input {ref:.2f}s (blackout paints, never cuts)"
    for sc in sidecars:
        if not Path(sc).is_file():
            return f"sidecar missing: {Path(sc).name}"
    return None


def defumble(state: LongformState) -> LongformState:
    node = "defumble"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    prompt = (f"Defumble the longform-edited recording for project `{proj.name}`.\n"
              f"INPUT (the Phase-1 proxy): `{sp['lowbps']}`\n"
              f"OUTPUT (fixed 13a path, write exactly here): `{sp['a']}` with its sidecars next to it.\n"
              "Follow video-creation/skills/defumbler/defumbler.md exactly: chunk-map the takes, cut ONLY inside "
              "silence, keep the last clean take, no clipped words, sync-safe filter_complex. Run every render "
              "in the FOREGROUND. Finish with your automated QA (re-run the chunk map on the output: 0 surviving "
              "partials, 0 clipped joins, A/V drift) and print the numbers. Do not desilence and do not black out.")
    return _agent_step(state, node, "defumbler", prompt, sp["a"],
                       lambda: _spine_check(sp["a"], shorter_than=sp["lowbps"]),
                       f"{sp['a'].name} present")


def cover_blackout(state: LongformState) -> LongformState:
    node = "cover_blackout"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    cover_json = Path(str(sp["b"]) + ".cover.json")
    prompt = (f"Cover-blackout the defumbled spine for project `{proj.name}` (a gated-face video).\n"
              f"INPUT: `{sp['a']}`\nFACE/COVER tags: `{C.doc(proj, 'screenplay')}` (Convention 5 tagged beats; "
              "the two 👤 `[FACE]` beats are the ONLY face windows, everything else is COVER).\n"
              f"OUTPUT (fixed 13a path): `{sp['b']}` plus its FACE/COVER map `{cover_json}`.\n"
              "Follow video-creation/skills/cover-blackout/cover-blackout.md exactly: paint black under every COVER "
              "span, audio untouched, duration identical to the input, frame-QA every window midpoint. Foreground only.")
    return _agent_step(state, node, "cover-blackout", prompt, sp["b"],
                       lambda: _spine_check(sp["b"], same_as=sp["a"], sidecars=[cover_json]),
                       f"{sp['b'].name} present")


def desilence_coarse(state: LongformState) -> LongformState:
    node = "desilence_coarse"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    map_json = Path(str(sp["c"])[:-4] + ".map.json")
    coarse = float(state.get("coarse_sil") or 0.7)
    prompt = (f"Desilence (COARSE pass) the blacked spine for project `{proj.name}`.\n"
              f"INPUT: `{sp['b']}`\nOUTPUT (fixed 13a path): `{sp['c']}` with the cut map `{map_json}` (--map-out).\n"
              f"SILENCE DEFINITION for this pass, ONE zone, Mike's knob: min-silence {coarse:.3f} s "
              f"(`--min-sil {coarse}`; no --split, no two-zone). This is the reviewable spine Mike listens to "
              "for bursts and content; a tighter two-zone pass runs later on the cleaned spine.\n"
              "Follow video-creation/skills/desilencer/desilencer.md exactly (desilence.py, dual-threshold RMS, "
              "--nvenc). Foreground only. Finish with the swallowed-speech QA and print the numbers.")
    return _agent_step(state, node, "desilencer", prompt, sp["c"],
                       lambda: _spine_check(sp["c"], shorter_than=sp["b"], sidecars=[map_json]),
                       f"{sp['c'].name} present")


def gate_spine_review(state: LongformState) -> LongformState:
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    return C.gate(state, "spine_review",
                  "the COARSE spine: listen for bursts (give timestamps with --bursts a-b,c-d on the resume) "
                  "and flag content; then the cleanup + the tight two-zone pass run",
                  [sp["c"], C.doc(proj, "project_log")])


def _latest_letter(proj: Path, scope: str):
    """(letter, path) of the highest-letter spine file in spine/ (any stage)."""
    hits = sorted((proj / "spine").glob(f"{scope}.?.*.mp4"))
    if not hits:
        return None, None
    last = hits[-1]
    return last.name[len(scope) + 1], last


def burst_removal(state: LongformState) -> LongformState:
    node = "burst_removal"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    bursts = [x.strip() for x in (state.get("bursts") or "").split(",") if x.strip()]
    cleaned = proj / "spine" / f"{scope}.d.cleaned.mp4"
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not bursts and not cleaned.is_file():
        return {"steps": C._step(state, node, "skipped", "no bursts given at the spine review")}
    cuts_json = Path(str(cleaned) + ".cuts.json")
    prompt = (f"Burst removal on the coarse spine for project `{proj.name}`.\n"
              f"INPUT: `{sp['c']}` (the COARSE desilenced spine; never go back to the blackout).\n"
              f"OUTPUT (fixed 13a path): `{cleaned}` plus `{cuts_json}`.\n"
              f"Mike located these bursts by ear (seconds on the INPUT's timeline, approximate): {', '.join(bursts)}. "
              "Follow video-creation/skills/burst-removal/burst-removal.md exactly: profile each, cut end-of-word-A "
              "to start-of-word-B inside the silence troughs, ONE sync-safe multi-segment pass, both tracks together; "
              "VERIFY every join on the rendered output. Foreground only.")
    return _agent_step(state, node, "burst-removal", prompt, cleaned,
                       lambda: _spine_check(cleaned, shorter_than=sp["c"], sidecars=[cuts_json]),
                       f"{cleaned.name} present")


def desilence_final(state: LongformState) -> LongformState:
    node = "desilence_final"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    cleaned = proj / "spine" / f"{scope}.d.cleaned.mp4"
    src = cleaned if cleaned.is_file() else sp["c"]
    letter = "e" if cleaned.is_file() else "d"
    out = proj / "spine" / f"{scope}.{letter}.desilenced.mp4"
    map_json = Path(str(out)[:-4] + ".map.json")
    pre, post = float(state.get("sil_pre") or 0.25), float(state.get("sil_post") or 0.5)
    split = state.get("split")
    zone = (f"two-zone: `--split {split} --sil-pre {pre} --sil-post {post}` (intro {pre} s / body {post} s, "
            f"split at the measured hook end {split}s)") if split else \
           (f"two-zone with the hook end measured by you from the chunk map: `--split <hook-end> --sil-pre {pre} "
            f"--sil-post {post}`; if no clear hook boundary exists, ONE zone at `--min-sil {post}`")
    prompt = (f"Desilence (FINAL tight pass) for project `{proj.name}`.\n"
              f"INPUT: `{src}`\nOUTPUT (fixed 13a path): `{out}` with the cut map `{map_json}` (--map-out).\n"
              f"SILENCE DEFINITION, Mike's knob: {zone}.\n"
              "Follow video-creation/skills/desilencer/desilencer.md exactly (desilence.py, dual-threshold RMS, "
              "--nvenc). Foreground only. Finish with the swallowed-speech QA and print the numbers.")
    return _agent_step(state, node, "desilencer", prompt, out,
                       lambda: _spine_check(out, shorter_than=src, sidecars=[map_json]),
                       f"{out.name} present")


def transcribe(state: LongformState) -> LongformState:
    node = "transcribe"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    if not fs:
        return C._fail(state, node, "no final desilenced spine in spine/")
    words = fs.with_name(fs.name[:-4] + ".medium-words.json")
    prompt = (f"Transcribe the FINAL spine for project `{proj.name}` (word-level, Whisper medium, GPU).\n"
              f"INPUT (transcribe THIS file, it is what the comp will load): `{fs}`\n"
              f"OUTPUT: `{words}` (the word-time JSON, never hand-edited) plus the human breakdown "
              f"`{fs.with_name(fs.name[:-4] + '.segments.txt')}` with the persona mishears corrected in TEXT only.\n"
              f"Map segments to the chapters of `{C.doc(proj, 'screenplay')}`; report total duration, chapter "
              "opener timecodes, the FACE windows, and every substitution you made. Foreground only.")
    return _agent_step(state, node, "transcriber", prompt, words,
                       lambda: None if words.stat().st_size > 500 else "word JSON is empty",
                       f"{words.name} present")


def verify_spine(state: LongformState) -> LongformState:
    """Mechanical: the FINAL spine + its word JSON exist, fps is 30/1 (the ethereum-rwa
    29.97 trap clipped the last words), A/V durations agree, the letter chain is intact."""
    node = "verify_spine"
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    proj, scope = _proj(state), state.get("scope", "ALL")
    fs = C.final_spine(proj, scope)
    wj = C.words_json(proj, scope)
    if not fs or not wj:
        return C._fail(state, node, "final spine or its .medium-words.json missing")
    why = _spine_check(fs)
    if why:
        return C._fail(state, node, f"{fs.name}: {why}")
    try:
        words = json.loads(wj.read_text(encoding="utf-8"))
        segs = words.get("segments", []) if isinstance(words, dict) else words
        n = sum(len(sg.get("words", [])) for sg in segs) or len(segs)
    except Exception:
        n = "?"
    sp = C.spine_paths(proj, scope)
    chain = [k for k in ("lowbps", "a", "b", "c") if sp[k].is_file()]
    return {"steps": C._step(state, node, "ran", f"{fs.name} ok ({_duration(fs) or 0:.1f}s), {n} words, "
                                                f"fps 30, chain {'+'.join(chain)}+{fs.name.split('.')[1]}")}


def gate_spine(state: LongformState) -> LongformState:
    proj, scope = _proj(state), state.get("scope", "ALL")
    fs = C.final_spine(proj, scope)
    return C.gate(state, "spine", "the FINAL spine, its transcript, and the review flags in PROJECT-LOG",
                  [fs or "spine/", C.words_json(proj, scope) or "spine/", C.doc(proj, "project_log")])


# ── PLAN ─────────────────────────────────────────────────────────────────────

def _doc_placeholder(state, node, key, how):
    proj = _proj(state)
    p = C.doc(proj, key)
    return C.placeholder(state, node, how=how, artifact=lambda: p.is_file() and p.stat().st_size > 300,
                         artifact_desc=p.name)


LINT_AS_RECORDED = C.SKILLS / "doc-reference" / "lint_as_recorded.py"
AR_LINT_RE = re.compile(r"^AS-RECORDED-LINT (PASS|FAIL) faces=(\d+) fails=(\d+)", re.M)


def _lint_as_recorded(state, node, dest: Path, spine: Path):
    args = [sys.executable, "-u", str(LINT_AS_RECORDED), str(dest)]
    d = _duration(spine)
    if d:
        args += ["--duration", f"{d:.3f}"]
    if state.get("face_max") is not None:
        args += ["--face-max", str(state["face_max"])]
    rc, out = C.run_streaming(args, state, node)
    m = AR_LINT_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (int(m.group(2)) if m else -1), out


def as_recorded(state: LongformState) -> LongformState:
    """Wave C node 1 (2026-09-27): the as-recorded-author agent writes AS-RECORDED.md off the FINAL
    spine + transcript; the node verifies the SHAPE with lint_as_recorded.py (sections, beat verdicts,
    timecodes within the spine, the FACE budget). Every later plan step is built to this file."""
    node = "as_recorded"
    proj, scope = _proj(state), state.get("scope", "ALL")
    dest = C.doc(proj, "as_recorded")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    wj = C.words_json(proj, scope)
    if not fs or not wj:
        return C._fail(state, node, "final spine / word JSON missing (verify_spine should have halted)")
    if dest.is_file() and dest.stat().st_size > 1500 and not _redo(state, node):
        ok, faces, out = _lint_as_recorded(state, node, dest, fs)
        if not ok:
            return C._fail(state, node, "AS-RECORDED.md on disk fails its format lint", out)
        return {"steps": C._step(state, node, "skipped", f"AS-RECORDED.md present, lint PASS ({faces} FACE windows)")}
    segs = fs.with_name(fs.name[:-4] + ".segments.txt")
    prompt = (f"Author AS-RECORDED.md for the longform-edited project `{proj.name}` (folder `{proj}`).\n"
              f"FINAL spine: `{fs}` ({_duration(fs) or 0:.2f}s). Word-time JSON (cue source, never edit): `{wj}`. "
              f"Transcriber breakdown + flags: `{segs}`. Screenplay: `{C.doc(proj, 'screenplay')}`. "
              f"Rulings + decisions: `{C.doc(proj, 'project_log')}`. Guards: `{C.doc(proj, 'data')}`.\n"
              f"SHAPE: copy video-creation/longform-edited/skills/doc-reference/AS-RECORDED.reference.md exactly; format owner "
              "video-creation/longform-edited/screenplay.md § AS-RECORDED. Measure the FACE windows from the picture "
              "(blackdetect), list the timecode chain from spine/, quote the words as SPOKEN, mark every beat row KEPT / "
              "CHANGED / AD-LIB / DROPPED, put the Whisper mishears in their own section, and carry the flags.\n"
              f"Write EXACTLY this file: `{dest}`. The graph runs lint_as_recorded.py on it and halts on a format failure. "
              "No em dashes. Finish by printing: AS-RECORDED-OK path=" + str(dest))
    rc, out = C.spawn_agent(state, node, "as-recorded-author", prompt, f"agent-as_recorded-{proj.name}.log")
    if not dest.is_file():
        return C._fail(state, node, f"as-recorded-author did not write {dest} (rc {rc})", out)
    ok, faces, lint_out = _lint_as_recorded(state, node, dest, fs)
    if not ok:
        return C._fail(state, node, "AS-RECORDED.md failed its format lint (see FAIL lines above; fix, then "
                                    "--redo as_recorded or resume)", lint_out)
    return {"steps": C._step(state, node, "ran", f"AS-RECORDED.md written, lint PASS ({faces} FACE windows)")}


RENDER_COVER_PLAN = C.SCRIPTS / "render_cover_plan.py"


def _cover_plan_check(plan: dict, face_windows, duration: float):
    """COVER-PLAN.json verified from disk: schema, consecutive beats, every non-FACE second assigned
    (no gap over 0.5 s, nothing past the spine), the budget honoured. Returns a reason or None."""
    for k in ("cover_beats", "receipts", "envato_list", "chatgpt_list", "containers", "budget", "budget_check"):
        if k not in plan:
            return f"missing key {k}"
    beats = plan["cover_beats"]
    if not isinstance(beats, list) or not beats:
        return "cover_beats is empty"
    try:
        seq = sorted(({"tIn": float(b["tIn"]), "tOut": float(b["tOut"]), "type": b.get("cover_type")} for b in beats),
                     key=lambda b: b["tIn"])
    except Exception as e:
        return f"cover_beats rows malformed: {e}"
    for b in seq:
        if b["tOut"] < b["tIn"] or (b["tOut"] == b["tIn"] and b["type"] not in ("title", "card", "container")):
            return f"beat {b['tIn']}-{b['tOut']} has no length"  # zero-length is legal ONLY for a title-card insert
        if b["tOut"] > duration + 0.6:
            return f"beat {b['tIn']}-{b['tOut']} runs past the spine ({duration:.2f}s)"
        if b["type"] not in ("receipt", "real-chart", "animated-chart", "container", "diagram", "timeline",
                             "envato-video", "chatgpt-image", "card", "title"):
            return f"beat {b['tIn']}: unknown cover_type {b['type']!r}"
    # the non-FACE timeline must be covered: walk it and find any gap > 0.5 s outside a face window
    faces = sorted((float(a), float(z)) for a, z in (face_windows or []))
    def in_face(t):
        return any(a - 0.05 <= t <= z + 0.05 for a, z in faces)
    cursor = 0.0
    for b in seq:
        if b["tIn"] - cursor > 0.5 and not (in_face(cursor) and in_face(b["tIn"])):
            # a gap is fine only if the whole gap sits inside one face window
            covered_by_face = any(a - 0.05 <= cursor and b["tIn"] <= z + 0.05 for a, z in faces)
            if not covered_by_face:
                return f"{b['tIn'] - cursor:.2f}s uncovered between {cursor:.2f}s and {b['tIn']:.2f}s (not a FACE window)"
        if b["tIn"] < cursor - 0.05:
            return f"beats overlap near {b['tIn']:.2f}s"
        cursor = max(cursor, b["tOut"])
    if duration - cursor > 0.5 and not any(a - 0.05 <= cursor and duration <= z + 0.6 for a, z in faces):
        return f"the last {duration - cursor:.2f}s of the spine are uncovered"
    for row in plan.get("chatgpt_list") or []:
        if not isinstance(row.get("reference"), str) or not row["reference"].strip():
            return (f"chatgpt_list row {row.get('n')} has no `reference` (a path under schedule-tweets/images/reference/ "
                    "or the string 'none exists (generic approved)')")
    bud = plan.get("budget") or {}
    for used, cap, what in (("envato_used", "envato_video_max", "Envato"), ("chatgpt_used", "chatgpt_image_max", "ChatGPT")):
        try:
            if int(bud.get(used, 0)) > int(bud.get(cap, 10 if what == "Envato" else 5)):
                return f"{what} budget exceeded ({bud.get(used)}/{bud.get(cap)})"
        except Exception:
            return "budget fields are not numbers"
    return None


def coverage(state: LongformState) -> LongformState:
    """Wave C node 2 (2026-09-28): the coverage-strategist (Fable/max, read-only) proposes what is on
    screen for every cover second; the node persists COVER-PLAN.json, verifies it from disk (schema,
    consecutive beats, every non-FACE second covered, budget), then renders the canonical BROLL-PLAN.md
    worklists + EDIT-PLAN-prep.md with scripts/render_cover_plan.py. Mike gates the plan next (GATE 3)."""
    node = "coverage"
    proj, scope = _proj(state), state.get("scope", "ALL")
    dest = C.doc(proj, "cover_plan")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    wj = C.words_json(proj, scope)
    if not fs or not wj:
        return C._fail(state, node, "final spine / word JSON missing")
    duration = _duration(fs) or 0.0
    # face windows from AS-RECORDED (measured from the picture there); fallback: none
    faces = []
    ar = C.doc(proj, "as_recorded")
    if ar.is_file():
        for m in re.finditer(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", ar.read_text(encoding="utf-8"), re.M):
            faces.append((float(m.group(1)), float(m.group(2))))
    if not (dest.is_file() and not _redo(state, node)):
        envato_max = int(state.get("envato_max") or 10)
        chatgpt_max = int(state.get("chatgpt_max") or 5)
        prompt = (f"Propose the COVER plan for the longform-edited project `{proj.name}` (folder `{proj}`).\n"
                  f"FINAL spine: `{fs}` ({duration:.2f}s, 30 fps). Word-level transcript (cue source): `{wj}`. "
                  f"AS-RECORDED (the as-built script; build to THIS): `{ar}`. DATA.md (every number + the CHART-SOURCE INDEX): "
                  f"`{C.doc(proj, 'data')}`. SCREENPLAY (the visual plan + SHOW cues): `{C.doc(proj, 'screenplay')}`. "
                  f"Rulings: `{C.doc(proj, 'project_log')}`.\n"
                  f"FACE windows (measured from the picture; do NOT cover them): {faces}. Everything else is black video and MUST "
                  f"be covered: consecutive cover_beats over every non-FACE second, no gap over 0.5 s, nothing past {duration:.2f}s.\n"
                  f"Budget: Envato video max {envato_max}, ChatGPT images max {chatgpt_max} (this is a 3-minute video: containers "
                  "dominate; b-roll is short punctuation; no asset used twice; receipts + code charts are budget-exempt).\n"
                  "cover_type must be one of: receipt | real-chart | animated-chart | container | diagram | timeline | envato-video | "
                  "chatgpt-image (a chapter title card is a zero-length beat tIn == tOut with cover_type 'title'; the pause is an "
                  "edit-time insert). EVERY chatgpt_list row carries a `reference` key: a path under "
                  "schedule-tweets/images/reference/ when the image shows a real thing (token, logo, company, person, product), "
                  "else the exact string 'none exists (generic approved)'. Chart IDs (C1, C2, C3 ...) and "
                  "receipt IDs come from DATA.md's CHART-SOURCE INDEX. No em dashes in any text.\n"
                  f"Return the JSON per your definition AND also save it to EXACTLY `{dest}` with Bash (a quoted heredoc). "
                  "The graph verifies the file from disk (schema, coverage of every second, budget) and halts otherwise.")
        rc, out = C.spawn_agent(state, node, "coverage-strategist", prompt, f"agent-coverage-{proj.name}.log")
        if not C.persist_agent_json(out, dest, want_key="cover_beats"):
            return C._fail(state, node, f"coverage-strategist returned no usable COVER-PLAN.json (rc {rc})", out)
    try:
        plan = json.loads(dest.read_text(encoding="utf-8"))
    except Exception as e:
        return C._fail(state, node, f"COVER-PLAN.json invalid JSON: {e}")
    why = _cover_plan_check(plan, faces, duration)
    if why:
        return C._fail(state, node, f"COVER-PLAN.json failed verification: {why} (fix COVER-PLAN.json and resume; "
                                    "--redo coverage re-runs the strategist instead)")
    args = [sys.executable, "-u", str(RENDER_COVER_PLAN), str(proj)] + (["--force"] if _redo(state, node) else [])
    rc, out = C.run_streaming(args, state, node)
    if rc != 0:
        return C._fail(state, node, "render_cover_plan.py failed", out)
    for k in ("broll_plan", "edit_plan_prep"):
        ok, missing = C.doc_check(C.doc(proj, k), 400, [r"envato", r"chatgpt|image"] if k == "broll_plan" else [r"beat|layer"])
        if not ok:
            return C._fail(state, node, f"{C.DOCS[k]} not rendered acceptably ({', '.join(missing)})")
    n = len(plan.get("cover_beats") or [])
    return {"steps": C._step(state, node, "ran", f"COVER-PLAN.json ok ({n} cover beats), BROLL-PLAN + EDIT-PLAN-prep rendered")}


def music_plan(state):
    return _doc_placeholder(state, "music_plan", "music_plan",
        "Run the `music-placement-strategist` agent (chapter map + register + assets/music/library.json) -> MUSIC-PLAN.json.")


def gate_plan(state):
    proj = _proj(state)
    return C.gate(state, "plan", "the cover plan, the music plan and the BROLL-PLAN worklists",
                  [C.doc(proj, "cover_plan"), C.doc(proj, "music_plan"), C.doc(proj, "broll_plan")])


def assets(state):
    return C.placeholder(state, "assets",
        how="Dispatch the asset factory per BROLL-PLAN.md worklists, IN PARALLEL where the Chrome "
            "profiles differ: slide-builder, chart-builder, receipt-capturer, envato-sourcer, image-gen; "
            "`visual-qa` clears every output. Outputs land in assets/<subdir>/ (comp-build.md section 10).")


def verify_assets(state):
    return C.placeholder(state, "verify_assets",
        how="Reconcile BROLL-PLAN.md against assets/: every worklist row has its file, zero orphans "
            "(renderables only), no byte-duplicate b-roll (house rule #12), visual-qa PASS on all.")


def edit_plan(state):
    proj = _proj(state)
    docs = [C.doc(proj, k) for k in ("edit_plan", "cue_sheet", "edit_plan_prep")]
    return C.placeholder(state, "edit_plan",
        how="Author EDIT-PLAN.md (time-ordered event log) + CUE-SHEET.md (layer-grouped, sub-point "
            "timing) off the word-level transcript + COVER-PLAN + MUSIC-PLAN (edit-plan-and-cue-sheet.md); "
            "keep EDIT-PLAN-prep.md as the prep record.",
        artifact=lambda: all(d.is_file() and d.stat().st_size > 300 for d in docs),
        artifact_desc="EDIT-PLAN.md + CUE-SHEET.md + EDIT-PLAN-prep.md")


def transitions(state):
    return _doc_placeholder(state, "transitions", "transitions",
        "Run the `transition-strategist` agent on the CUE-SHEET / EDIT-PLAN placement -> TRANSITIONS.md (three buckets + reserved MELT/SPIN marquees).")


def reconcile_docs(state):
    return C.placeholder(state, "reconcile_docs",
        how="Fan every TRANSITIONS.md pick into the matching EDIT-PLAN.md / CUE-SHEET.md / EDIT-PLAN-prep.md rows "
            "(the doc set is ONE blueprint; claudeisnaughty #12). A cross-check lint is the target for this node.")


LINT_DOCSET = C.SKILLS / "doc-reference" / "lint_docset.py"
DOCSET_RE = re.compile(r"^DOCSET-LINT (PASS|FAIL) stage=(\w+) fails=(\d+) warns=(\d+)", re.M)


def run_lint_docset(state, node, stage):
    proj = _proj(state)
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_DOCSET), str(proj), "--stage", stage], state, node)
    m = DOCSET_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (int(m.group(4)) if m else 0), out


def lint_docset(state: LongformState) -> LongformState:
    """The PRE-BUILD gate in code: skills/doc-reference/lint_docset.py (ported from lint-docset.js 2026-09-28; JS
    frozen as rollback). The full §13 set + §13a naming + the transcript-first order, every video."""
    node = "lint_docset"
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    ok, warns, out = run_lint_docset(state, node, "build")
    if not ok:
        return C._fail(state, node, "document set fails the pre-build gate (see FAIL lines above)", out)
    return {"steps": C._step(state, node, "ran", f"docset PASS ({warns} warning(s) to review)")}


def gate_blueprint(state):
    proj = _proj(state)
    return C.gate(state, "blueprint", "the pre-build blueprint: EDIT-PLAN, CUE-SHEET, TRANSITIONS",
                  [C.doc(proj, "edit_plan"), C.doc(proj, "cue_sheet"), C.doc(proj, "transitions")])


# ── BUILD ────────────────────────────────────────────────────────────────────

def card_pauses(state):
    proj = _proj(state)
    p = proj / "assets" / "spine.mp4"
    return C.placeholder(state, "card_pauses",
        how="Bake the card-pause spine (+1s freeze+silence before each carded chapter's first word, "
            "lint-pause-silence.py containment check) -> spine/<scope>.d.paused.mp4, copied to assets/spine.mp4.",
        artifact=lambda: p.is_file(), artifact_desc="assets/spine.mp4")


def captions(state):
    return C.placeholder(state, "captions",
        how="Run the `captions-builder` agent on the FINAL spine's word JSON (montserrat, 2/4 grouping, "
            "the video's caption windows) -> the ZCAPTIONS TS file for the comp.")


def comp_build(state):
    proj = _proj(state)
    return C.placeholder(state, "comp_build",
        how="Build the Remotion comp to comp-build.md + the blueprint (spine, COVERS, cards, charts, "
            "captions, transitions), run the mechanical gates, chunk-QA, draft render at 200k, ffmpeg "
            "music+SFX mix, video-qa reconcile -> _previews/<project>-draft-vN(-sfx).mp4.",
        artifact=lambda: bool(list((proj / "_previews").glob("*draft*.mp4"))), artifact_desc="_previews/*draft*.mp4")


def verify_comp(state):
    return C.placeholder(state, "verify_comp",
        how="Every mechanical gate on the comp must exit 0 (all Python since 2026-09-28, all in skills/comp-build/): "
            "lint_covers.py, lint-deck-containers.py, lint-pause-silence.py, lint_transition_assets.py, "
            "lint_slide_balance.py, lint_animated_charts.py, check_spine_fps.py; render duration == spine duration; audio present.")


def gate_draft(state):
    proj = _proj(state)
    drafts = sorted((proj / "_previews").glob("*draft*.mp4")) if (proj / "_previews").is_dir() else []
    return C.gate(state, "draft", "the draft render (Mike's review; notes drive fix rounds)",
                  [drafts[-1] if drafts else proj / "_previews"])


# ── DELIVER ──────────────────────────────────────────────────────────────────

def final_render(state):
    proj = _proj(state)
    def have():
        return bool(list(proj.glob("*FINAL*.mp4")) or list((proj / "renders").glob("*.mp4")))
    return C.placeholder(state, "final_render",
        how="Full-bitrate render + the same ffmpeg mix -> renders/ (partial re-render + concat for fix rounds).",
        artifact=have, artifact_desc="renders/*.mp4 or <project>-FINAL.mp4")


def verify_final(state):
    return C.placeholder(state, "verify_final",
        how="Duration == spine, fps 30, audio parity with the approved draft, PSNR on any splice seams.")


def definition_of_done(state):
    proj = _proj(state)
    return C.placeholder(state, "definition_of_done",
        how="comp-build.md section 12a: promote the render to the project ROOT as <project>-FINAL.mp4, rescue the "
            "music bed to music/, recycle _previews/ and _tmp/ (Recycle Bin), confirm the queue copy first.",
        artifact=lambda: bool(list(proj.glob("*-FINAL.mp4"))) and not (proj / "_previews").exists(),
        artifact_desc="<project>-FINAL.mp4 at the root and no _previews/")


def stage_longform(state):
    proj = _proj(state)
    staged = C.REPO_ROOT / "schedule-tweets" / "longform" / proj.name
    r = C.placeholder(state, "stage_longform",
        how="Stage the FINAL into schedule-tweets/longform/<project>/ and append the longs.json entry "
            "(rumble / bitchute / facebook; never YouTube for longform).",
        artifact=lambda: staged.is_dir() and bool(list(staged.glob("*.mp4"))), artifact_desc=f"{staged}")
    if r.get("status") == "failed":
        return r
    st = r["steps"].get("stage_longform", {}).get("status")
    if st in ("ran", "skipped", "stub"):
        return {**r, "status": "done",
                "summary": {"project": proj.name, "final": [str(p) for p in proj.glob("*-FINAL.mp4")],
                            "stub": bool(state.get("stub"))}}
    return r


# ── topology ─────────────────────────────────────────────────────────────────

ORDER = [
    "init_project", "research", "screenplay", "gate_screenplay", "await_recording",
    "compress", "defumble", "cover_blackout", "desilence_coarse", "gate_spine_review",
    "burst_removal", "desilence_final", "transcribe", "verify_spine", "gate_spine",
    "as_recorded", "coverage", "music_plan", "gate_plan", "assets", "verify_assets", "edit_plan",
    "transitions", "reconcile_docs", "lint_docset", "gate_blueprint",
    "card_pauses", "captions", "comp_build", "verify_comp", "gate_draft",
    "final_render", "verify_final", "definition_of_done", "stage_longform",
]
NODES = {n: globals()[n] for n in ORDER}


def _after(node: str, next_node: Optional[str]):
    def route(state):
        if state.get("status") == "failed":
            return END
        if node.startswith("gate_") and state.get("until") == node[len("gate_"):]:
            print(f"[longform] stopping after {node} (--until {state['until']})", flush=True)
            return END
        return next_node or END
    return route


def build_longform_graph(checkpointer=None):
    g = StateGraph(LongformState)
    for n in ORDER:
        g.add_node(n, NODES[n])
    g.add_edge(START, ORDER[0])
    for i, n in enumerate(ORDER):
        nxt = ORDER[i + 1] if i + 1 < len(ORDER) else None
        g.add_conditional_edges(n, _after(n, nxt))
    return g.compile(checkpointer=checkpointer)
