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
import shutil
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
    card_pause: Optional[float]  # build: title-card pause seconds (default 1.5)
    caption_windows: Optional[str]  # build: extra caption windows a-b,a-b (cold-open exception)
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


LINT_DOCSET = C.SKILLS / "doc-reference" / "lint_docset.py"
DOCSET_RE = re.compile(r"^DOCSET-LINT (PASS|FAIL) stage=(\w+) fails=(\d+) warns=(\d+)", re.M)


def run_lint_docset(state, node, stage):
    proj = _proj(state)
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_DOCSET), str(proj), "--stage", stage], state, node)
    m = DOCSET_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (int(m.group(4)) if m else 0), out



MUSIC_LIB = C.REPO_ROOT / "video-creation" / "assets" / "music" / "library.json"
CH_HEADER_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)
MAX_BREATH_S = 1.0     # house rule #10: a breath between beds, never a silent stretch
LEVEL_RANGE = (-24.0, -12.0)   # music.md: ~16-22 dB under the VO; anything outside is a typo, not a call


def _chapters(proj: Path):
    """[(id, title, tIn, tOut, header_tail)] from AS-RECORDED's `### CHn - TITLE (tIn-tOut) ...` headers."""
    ar = C.doc(proj, "as_recorded")
    if not ar.is_file():
        return []
    return [(m.group(1).replace(" ", ""), m.group(2).strip(), float(m.group(3)), float(m.group(4)), m.group(5).strip())
            for m in CH_HEADER_RE.finditer(ar.read_text(encoding="utf-8"))]


def _resolve_music(path_str: str) -> Optional[Path]:
    p = Path(str(path_str))
    for cand in ([p] if p.is_absolute() else [C.REPO_ROOT / p, C.REPO_ROOT / "video-creation" / "assets" / "music" / p]):
        if cand.is_file():
            return cand
    return None


def _music_plan_check(plan: dict, chapters, duration: float):
    """MUSIC-PLAN.json verified from disk: schema, every chapter has a bed, beds cover the whole spine with
    at most a breath between them, every source file exists, a bed shorter than its span loops (the bed-A
    rule), levels sane, no em dashes. Returns a reason or None."""
    for k in ("beds", "hard_hits", "energy_profile"):
        if k not in plan:
            return f"missing key {k}"
    if "track" not in plan and "tracks" not in plan:
        return "missing key track/tracks"
    beds = plan["beds"]
    if not isinstance(beds, list) or not beds:
        return "beds is empty"
    if "\u2014" in json.dumps(plan, ensure_ascii=False):
        return "em dash in the plan text (persona rule)"
    try:
        rows = sorted(((str(b["chapter"]).replace(" ", ""), float(b["span"][0]), float(b["span"][1]), b) for b in beds), key=lambda r: r[1])
    except Exception as e:
        return f"bed rows malformed: {e}"
    have = {r[0] for r in rows}
    for cid, title, a, z, _ in chapters:
        if cid not in have:
            return f"{cid} ({title}) has no bed (house rule #10: music covers EVERY chapter)"
    cursor = 0.0
    for cid, a, z, b in rows:
        if z <= a:
            return f"{cid} bed span {a}-{z} has no length"
        if a - cursor > MAX_BREATH_S:
            return f"{a - cursor:.2f}s of silence before the {cid} bed at {a:.2f}s (max breath {MAX_BREATH_S}s)"
        cursor = max(cursor, z)
        src = _resolve_music(b.get("source_file", ""))
        if src is None:
            return f"{cid} bed source_file not found: {b.get('source_file')}"
        cover = str(b.get("cover", "")).lower()
        if cover not in ("loop", "oneshot", "section"):
            return f"{cid} bed cover must be loop|oneshot|section, got {b.get('cover')!r}"
        file_len = _duration(src) or 0.0
        avail = file_len - float(b.get("source_in") or 0.0)
        if cover != "loop" and avail + 0.25 < (z - a):
            return (f"{cid} bed: {src.name} has {avail:.1f}s from its in-point but the span is {z - a:.1f}s and cover is "
                    f"'{cover}' (a bed shorter than its span MUST loop, music.md)")
        try:
            lvl = float(b.get("level_db_under_vo"))
        except Exception:
            return f"{cid} bed level_db_under_vo missing"
        if not (LEVEL_RANGE[0] <= lvl <= LEVEL_RANGE[1]):
            return f"{cid} bed level_db_under_vo {lvl} outside {LEVEL_RANGE} (music.md: ~16-22 dB under the VO)"
    if duration - cursor > MAX_BREATH_S:
        return f"the last {duration - cursor:.2f}s of the spine have no bed"
    return None


def music_plan(state: LongformState) -> LongformState:
    """Wave C node 3 (2026-09-28): the music-placement-strategist (Fable/max, read-only) carves the beds
    against the FINAL spine's chapter map + the catalog's waveform analysis; the node persists MUSIC-PLAN.json
    and verifies it from disk (every chapter has a bed, beds cover the spine with at most a breath between,
    every file exists, short beds loop, levels sane), then runs the plan-stage docset lint so the whole plan
    stage is complete before GATE 3."""
    node = "music_plan"
    proj, scope = _proj(state), state.get("scope", "ALL")
    dest = C.doc(proj, "music_plan")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    if not fs:
        return C._fail(state, node, "final spine missing")
    duration = _duration(fs) or 0.0
    chapters = _chapters(proj)
    if not chapters:
        return C._fail(state, node, "no `### CHn - TITLE (tIn-tOut)` chapter headers in AS-RECORDED.md")
    if not MUSIC_LIB.is_file():
        return C._fail(state, node, f"music catalog missing: {MUSIC_LIB}")
    if not (dest.is_file() and not _redo(state, node)):
        ch_lines = "\n".join(f"  - {cid} {title}: {a:.2f}-{z:.2f}s {tail}" for cid, title, a, z, tail in chapters)
        prompt = (f"Author the MUSIC bed plan for the longform-edited project `{proj.name}` (folder `{proj}`).\n"
                  f"FINAL spine: `{fs}` ({duration:.2f}s, 30 fps; every timecode in your plan is a FINAL-spine second, "
                  "pre-card-pause; the comp routes them through sh()).\n"
                  f"Chapter map (from AS-RECORDED.md `{C.doc(proj, 'as_recorded')}`, its FACE windows section tells you the face beats):\n{ch_lines}\n"
                  f"Register / gear map + the MUSIC-MOOD-PLAN with the track shortlist: `{C.doc(proj, 'screenplay')}` "
                  f"(section MUSIC-MOOD-PLAN); rulings: `{C.doc(proj, 'project_log')}`. Cover plan (the hard beats and marquee "
                  f"reveals the music must respect): `{C.doc(proj, 'cover_plan')}`.\n"
                  f"Catalog with the precomputed waveform analysis: `{MUSIC_LIB}` (files under video-creation/assets/music/<folder>/).\n"
                  "Hard rules the graph verifies from disk: EVERY chapter above appears in `beds`; the beds cover the whole spine "
                  f"0-{duration:.2f}s with at most a {MAX_BREATH_S}s breath between them (no silent stretch); every `source_file` "
                  "is an existing file path (absolute, or relative to the repo root); a bed whose file is shorter than its span "
                  "MUST have cover 'loop' with a loop_point_sec; `level_db_under_vo` between -24 and -12; no em dashes anywhere. "
                  "Prefer the instrumental variant under VO. Right-align the final bed so its ending lands on the last spoken word "
                  "when the screenplay asks for it, and state the exact source_in that achieves it.\n"
                  f"Return the JSON per your definition AND also save it to EXACTLY `{dest}` with Bash (a quoted heredoc).")
        rc, out = C.spawn_agent(state, node, "music-placement-strategist", prompt, f"agent-music-{proj.name}.log")
        if not C.persist_agent_json(out, dest, want_key="beds"):
            return C._fail(state, node, f"music-placement-strategist returned no usable MUSIC-PLAN.json (rc {rc})", out)
    try:
        plan = json.loads(dest.read_text(encoding="utf-8"))
    except Exception as e:
        return C._fail(state, node, f"MUSIC-PLAN.json invalid JSON: {e}")
    why = _music_plan_check(plan, chapters, duration)
    if why:
        return C._fail(state, node, f"MUSIC-PLAN.json failed verification: {why} (fix MUSIC-PLAN.json and re-drive; "
                                    "--redo music_plan re-runs the strategist instead)")
    ok, warns, out = run_lint_docset(state, node, "plan")
    if not ok:
        return C._fail(state, node, "plan-stage document set incomplete (see FAIL lines above)", out)
    n = len(plan["beds"])
    return {"steps": C._step(state, node, "ran", f"MUSIC-PLAN.json ok ({n} beds over {len(chapters)} chapters), plan-stage docset PASS")}


def gate_plan(state):
    proj = _proj(state)
    return C.gate(state, "plan", "the cover plan, the music plan and the BROLL-PLAN worklists",
                  [C.doc(proj, "cover_plan"), C.doc(proj, "music_plan"), C.doc(proj, "broll_plan")])


# ── Wave D node 1+2 (2026-09-28): the ASSET FACTORY fan-out + the reconcile gate ─────────────
# The five builder agents (slide-builder · chart-builder · receipt-capturer · envato-sourcer ·
# image-gen) run IN PARALLEL: each owns a different browser (headless Chromium ×3, the dedicated
# envato-profile, the dedicated chatgpt-profile), so nothing collides. Every builder gets ONLY the
# ids that are still missing on disk (idempotent re-drives; `--redo assets` rebuilds everything),
# writes to the FIXED comp-build §10 folders, and the node verifies FROM DISK. Then `visual-qa`
# opens every asset once and its JSON verdict is persisted; `verify_assets` is the pure-code
# reconcile (zero orphans, no byte-duplicate b-roll, audio stripped, visual-qa clean).

ASSET_FOLDERS = {
    "envato": "vid", "chatgpt": "img", "receipt": "receipts",
    "chart": "charts", "diagram": "diagrams", "title": "title-slides", "card": "card-slides",
}
BUILDER_OF = {
    "envato": "envato-sourcer", "chatgpt": "image-gen", "receipt": "receipt-capturer",
    "chart": "chart-builder", "diagram": "chart-builder", "title": "slide-builder", "card": "slide-builder",
}
VIDEO_EXT = (".mp4", ".mov", ".webm")
IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp")


def _container_kind(c: dict) -> str:
    kind = str(c.get("kind", "")).lower()
    cid = str(c.get("id", ""))
    if kind in ("animated-chart", "chart"):
        return "chart"
    if kind in ("diagram", "timeline"):
        return "diagram"
    if kind == "title" or cid.startswith("title-card"):
        return "title"
    return "card"


def _asset_expectations(plan: dict):
    """Every renderable the cover plan commits to: [{id, kind, folder, spec}]."""
    exp = []
    for e in plan.get("envato_list") or []:
        exp.append({"id": f"BR-{e.get('n')}", "kind": "envato", "folder": ASSET_FOLDERS["envato"],
                    "spec": f"Envato video, query: {e.get('query')}; beat {e.get('beat')}; target {e.get('seconds')}s"
                            f"{'; LEADING continuous camera' if e.get('lead') else ''}"})
    for g in plan.get("chatgpt_list") or []:
        exp.append({"id": f"IMG-{g.get('n')}", "kind": "chatgpt", "folder": ASSET_FOLDERS["chatgpt"],
                    "spec": f"ChatGPT image: {g.get('prompt_concept')}; reference: {g.get('reference')}; beat {g.get('beat')}"})
    for r in plan.get("receipts") or []:
        exp.append({"id": str(r.get("id")), "kind": "receipt", "folder": ASSET_FOLDERS["receipt"],
                    "spec": f"Receipt proving: {r.get('claim')}; capture: {r.get('capture')}"
                            f"{'; VERIFY the claim at capture' if r.get('verify') else ''}"})
    for c in plan.get("containers") or []:
        k = _container_kind(c)
        exp.append({"id": str(c.get("id")), "kind": k, "folder": ASSET_FOLDERS[k],
                    "spec": f"{c.get('kind')} container: {c.get('shows')}; beats {', '.join(c.get('beats') or [])}"})
    return exp


def _asset_files(proj: Path, e: dict):
    """Files on disk for one expectation: <folder>/<id>.<ext> or <folder>/<id>-*.<ext> (states, slugs)."""
    d = proj / "assets" / e["folder"]
    if not d.is_dir():
        return []
    exts = VIDEO_EXT if e["kind"] == "envato" else (VIDEO_EXT + IMAGE_EXT if e["kind"] == "receipt" else IMAGE_EXT)
    out = []
    for f in sorted(d.iterdir()):
        if not f.is_file() or f.suffix.lower() not in exts:
            continue
        if f.stem == e["id"] or f.stem.startswith(e["id"] + "-") or f.stem.startswith(e["id"] + "_"):
            out.append(f)
    return out


def _qa_feedback(prev: dict, todo: list) -> str:
    """The prior visual-qa FAIL entries for the ids being rebuilt, as a fix list for the builder."""
    lines = []
    for e in todo:
        for name, a in prev.items():
            stem = name.replace(".mid.png", "")
            if (stem == e["id"] or stem.startswith(e["id"] + "-")) and str(a.get("verdict", "")).upper() != "PASS":
                lines.append(f"- {stem}: " + "; ".join(a.get("defects") or [])[:500] + f" -> FIX: {str(a.get('fix', ''))[:400]}")
    if not lines:
        return ""
    return ("\nYour EARLIER build of these ids FAILED visual-qa. The failing files were deleted; rebuild them with these defects "
            "fixed (this is the whole point of the rebuild):\n" + "\n".join(lines))


def _builder_prompt(builder: str, proj: Path, fs: Path, todo: list, done: list, prev: Optional[dict] = None) -> str:
    plan_p, broll_p = C.doc(proj, "cover_plan"), C.doc(proj, "broll_plan")
    common = (f"Project `{proj.name}`, folder `{proj}`. Worklists: `{broll_p}` (your table) and the source of truth "
              f"`{plan_p}` (per-slot notes, spoken lines, bench). Numbers + phrasing guards: `{C.doc(proj, 'data')}`. "
              f"As-built script with timecodes: `{C.doc(proj, 'as_recorded')}`. FINAL spine: `{fs}`.\n"
              f"Build ONLY these ids (everything else on disk is done, leave it alone): "
              + ", ".join(f"{e['id']} -> assets/{e['folder']}/" for e in todo)
              + (f".\nAlready present, do NOT rebuild: {', '.join(done)}." if done else ".")
              + "\nName every output `<id>.<ext>` or `<id>-<slug>.<ext>` (state variants `<id>-<state>.png`) INSIDE the folder "
                "named for it; never another folder, never a separate render-assets/. No em dashes on screen. QA-open every "
                "file before returning, then return the per-id report your agent definition specifies. The graph verifies the "
                "files from disk and `visual-qa` opens every one.")
    extra = {
        "slide-builder": "\nTITLE SLIDES (`title-card-*` ids) -> assets/title-slides/, CARD SLIDES -> assets/card-slides/; HTML source "
                         "for all frames in assets/slide-sources/containers.html; 1920x1080; the locked container-canonical.css.",
        "chart-builder": "\nType 1 ANIMATED charts -> assets/charts/<id>.html + <id>-<state>.png (start/mid/payoff states = the design "
                         "spec for the comp's real useCurrentFrame animation, plus the what-moves-when note); Type 2 SYSTEM-DESIGN "
                         "diagrams -> assets/diagrams/<id>.html + <id>-<state>.png (one PNG per state, shared elements pixel-identical). "
                         "Every number from DATA.md only.",
        "receipt-capturer": "\nPlaywright Python, 1920 wide, device-scale 2, whole readable region (the comp does the push-in); "
                            "open and LOOK at every capture; a bot wall / blank / paywall is a FLAG, never shipped. State the capture "
                            "timestamp and every VERIFY answer.",
        "envato-sourcer": "\nOne clip per slot via the canonical envato-broll tooling on the envato-profile only (one download at a time); "
                          "trim to slot + ~1s handles, 1080p H.264, STRIP AUDIO (-an), no two slots alike, no watermark/text. A slot "
                          "with no clean match is FLAGGED, not filled off-tone.",
        "image-gen": "\nBrowser pipeline only (repurpose/gen_batch.py --fresh on the chatgpt-profile, sequential, one attempt). House "
                     "style from persona.json image_generation. A row with a Reference path is generated FROM that reference image "
                     "(the real mark, e.g. the Kaspa backwards-K in greenish cyan, never gold); a row with 'none exists (generic "
                     "approved)' is generic. Every image unique.",
    }
    return common + extra.get(builder, "") + _qa_feedback(prev or {}, todo)


def _mid_frame(video: Path, dest: Path) -> Optional[Path]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    d = _duration(video) or 0.0
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{d / 2:.3f}", "-i", str(video), "-frames:v", "1", str(dest)],
                       capture_output=True, text=True)
    return dest if r.returncode == 0 and dest.is_file() else None


def assets(state: LongformState) -> LongformState:
    node = "assets"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    plan_p = C.doc(proj, "cover_plan")
    if not plan_p.is_file():
        return C._fail(state, node, "COVER-PLAN.json missing")
    plan = json.loads(plan_p.read_text(encoding="utf-8"))
    fs = C.final_spine(proj, scope)
    exp = _asset_expectations(plan)
    if not exp:
        return C._fail(state, node, "the cover plan commits to no renderable assets")
    for sub in set(ASSET_FOLDERS.values()) | {"slide-sources"}:
        (proj / "assets" / sub).mkdir(parents=True, exist_ok=True)
    redo = _redo(state, node)
    qa_dest = proj / "assets" / "VISUAL-QA.json"
    prev = {}
    if qa_dest.is_file() and not redo:
        try:
            prev = {Path(a.get("path", "")).name: a for a in json.loads(qa_dest.read_text(encoding="utf-8")).get("assets", [])}
        except Exception:
            prev = {}
    jobs = {}
    for e in exp:
        have = _asset_files(proj, e)
        b = BUILDER_OF[e["kind"]]
        jobs.setdefault(b, {"todo": [], "done": []})
        (jobs[b]["todo"] if (redo or not have) else jobs[b]["done"]).append(e if (redo or not have) else e["id"])
    dispatch = {b: j for b, j in jobs.items() if j["todo"]}
    if dispatch:
        specs = [(b, _builder_prompt(b, proj, fs, j["todo"], j["done"], prev), f"agent-assets-{b}-{proj.name}.log")
                 for b, j in dispatch.items()]
        print(f"[longform] {node}: dispatching {len(specs)} builder(s) in parallel: "
              + ", ".join(f"{b} ({len(dispatch[b]['todo'])} id(s))" for b in dispatch), flush=True)
        results = C.spawn_agents_parallel(state, node, specs)
        for b, (rc, out) in results.items():
            print(f"[longform] {node}: {b} exit {rc}", flush=True)
    else:
        print(f"[longform] {node}: every asset already on disk; skipping the builders", flush=True)
    missing = [e for e in exp if not _asset_files(proj, e)]
    if missing:
        by_b = {}
        for e in missing:
            by_b.setdefault(BUILDER_OF[e["kind"]], []).append(e["id"])
        return C._fail(state, node, "assets still missing after the builders ran: "
                       + "; ".join(f"{b}: {', '.join(ids)}" for b, ids in by_b.items())
                       + " (read graph/data/agent-assets-<builder>-<project>.log; a re-drive dispatches only the missing ids)")
    # ── visual-qa: every file without a prior PASS (video slots contribute a mid frame); PASSes carry over ──
    lines, carried = [], []
    for e in exp:
        for f in _asset_files(proj, e):
            shown = f
            if f.suffix.lower() in VIDEO_EXT:
                shown = _mid_frame(f, proj / "_previews" / "qa" / "assets" / f"{f.stem}.mid.png") or f
            pa = prev.get(shown.name)
            if pa and str(pa.get("verdict", "")).upper() == "PASS":
                carried.append(pa)
            else:
                lines.append(f"- `{shown}`  [{e['kind']} {e['id']}] spec: {e['spec']}")
    if lines:
        print(f"[longform] {node}: visual-qa on {len(lines)} file(s) ({len(carried)} prior PASS carried over)", flush=True)
        new_dest = proj / "assets" / "VISUAL-QA.new.json"
        new_dest.unlink(missing_ok=True)
        prompt = (f"Visual QA for the longform-edited project `{proj.name}` (folder `{proj}`): open EVERY asset below and judge it "
                  "against its spec and the house style per your checklist (containers/diagrams -> container-reference + "
                  "container-canonical.css; charts -> charts.md; receipts -> the intended content, no blank/bot-wall/cookie banner; "
                  "b-roll frames -> no watermark/text, dark grade; ChatGPT images -> the named asset with the real mark and colors, "
                  "house style, no text). A `.mid.png` is the middle frame of the video slot it is named after. Check ONLY the "
                  "files listed here (the others already carry a verdict); do not re-open the rest of the folder.\n"
                  + "\n".join(lines)
                  + f"\nReturn your JSON verdict AND save it to EXACTLY `{new_dest}` with Bash (a quoted heredoc). "
                    "Every asset listed must appear in `assets` with PASS or FAIL.")
        rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-assets-visual-qa-{proj.name}.log")
        if not C.persist_agent_json(out, new_dest, want_key="assets"):
            return C._fail(state, node, f"visual-qa returned no usable verdict JSON (rc {rc})", out)
        fresh = json.loads(new_dest.read_text(encoding="utf-8")).get("assets", [])
        # one entry per file; a fresh verdict (the newest look, even on a file QA re-checked unasked) wins over a carried one
        by_name = {Path(a.get("path", "")).name: a for a in carried}
        by_name.update({Path(a.get("path", "")).name: a for a in fresh})
        merged = list(by_name.values())
        qa = {"assets": merged,
              "summary": {"checked": len(merged), "passed": sum(1 for a in merged if str(a.get("verdict", "")).upper() == "PASS"),
                          "failed": sum(1 for a in merged if str(a.get("verdict", "")).upper() != "PASS"),
                          "carried_over": len(carried), "fresh": len(fresh)},
              "must_fix": [a.get("path") for a in merged if str(a.get("verdict", "")).upper() != "PASS"]}
        C._write_json_atomic(qa_dest, qa)
        new_dest.unlink(missing_ok=True)
    else:
        print(f"[longform] {node}: every file already carries a visual-qa PASS", flush=True)
    qa = json.loads(qa_dest.read_text(encoding="utf-8"))
    fails = [a for a in qa.get("assets", []) if str(a.get("verdict", "")).upper() != "PASS"]
    if fails:
        return C._fail(state, node, f"visual-qa FAILED {len(fails)} asset(s): "
                       + "; ".join(f"{Path(a.get('path', '?')).name}: {', '.join(a.get('defects') or [])[:140]}" for a in fails[:8])
                       + " (delete the failing files and re-drive: the builders get these defects as feedback, only the gap is rebuilt and re-QA'd)")
    return {"steps": C._step(state, node, "ran", f"{len(exp)} asset id(s) built ({len(dispatch)} builder(s) dispatched), visual-qa PASS on {len(qa.get('assets', []))} file(s)")}


def _has_audio(video: Path) -> bool:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type",
                        "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    return "audio" in (r.stdout or "")


def verify_assets(state: LongformState) -> LongformState:
    """Pure-code reconcile of BROLL-PLAN/COVER-PLAN against assets/: every id has its file, zero orphan
    renderables in the asset folders, no byte-duplicate b-roll (house rule #12), b-roll audio stripped,
    every file cleared by visual-qa."""
    node = "verify_assets"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    plan = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8"))
    exp = _asset_expectations(plan)
    problems = []
    claimed = set()
    for e in exp:
        files = _asset_files(proj, e)
        if not files:
            problems.append(f"{e['id']} has no file in assets/{e['folder']}/")
        claimed.update(files)
    for sub in sorted(set(ASSET_FOLDERS.values())):
        d = proj / "assets" / sub
        for f in sorted(d.iterdir()) if d.is_dir() else []:
            if f.is_file() and f.suffix.lower() in VIDEO_EXT + IMAGE_EXT and f not in claimed:
                problems.append(f"orphan renderable not in the plan: assets/{sub}/{f.name}")
    import hashlib
    seen = {}
    for e in exp:
        if e["kind"] not in ("envato", "chatgpt"):
            continue
        for f in _asset_files(proj, e):
            h = hashlib.sha256(f.read_bytes()).hexdigest()
            if h in seen:
                problems.append(f"byte-duplicate b-roll: {f.name} == {seen[h]} (house rule #12)")
            seen[h] = f.name
            if f.suffix.lower() in VIDEO_EXT and _has_audio(f):
                problems.append(f"{f.name} still carries an audio stream (strip it: ffmpeg -c copy -an)")
    qa_p = proj / "assets" / "VISUAL-QA.json"
    if not qa_p.is_file():
        problems.append("assets/VISUAL-QA.json missing (visual-qa never ran)")
    else:
        qa = json.loads(qa_p.read_text(encoding="utf-8"))
        verdict = {Path(a.get("path", "")).name.replace(".mid.png", ""): str(a.get("verdict", "")).upper() for a in qa.get("assets", [])}
        for f in sorted(claimed):
            v = verdict.get(f.name) or verdict.get(f.stem)
            if v is None:
                problems.append(f"{f.name} was never opened by visual-qa")
            elif v != "PASS":
                problems.append(f"{f.name} visual-qa {v}")
    if problems:
        return C._fail(state, node, f"{len(problems)} reconcile problem(s): " + " | ".join(problems[:12]))
    return {"steps": C._step(state, node, "ran", f"{len(exp)} ids / {len(claimed)} files reconciled, zero orphans, visual-qa clean")}


EP_SKILL = C.SKILLS / "edit-plan-and-cue-sheet"
GEN_EDITPLAN = EP_SKILL / "gen_editplan.py"
LINT_EDIT_PLAN = EP_SKILL / "lint_edit_plan.py"
EP_LINT_RE = re.compile(r"^EDIT-PLAN-LINT (PASS|FAIL) events=(\d+) say=(\d+) fails=(\d+) warns=(\d+)", re.M)


def _lint_edit_plan(state, node, proj: Path, duration: float):
    args = [sys.executable, "-u", str(LINT_EDIT_PLAN), str(proj)] + (["--duration", f"{duration:.3f}"] if duration else [])
    rc, out = C.run_streaming(args, state, node)
    m = EP_LINT_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (m.group(2) if m else "?"), (m.group(5) if m else "?"), out


def edit_plan(state: LongformState) -> LongformState:
    """Wave D node 3 (2026-09-28): the pre-build BLUEPRINT pair. gen_editplan.py (the Python port of the
    retired _gen_editplan.example.js, now PRE-build from the verified plans) seeds the event log; the
    edit-plan-author agent (opus/high) refines it into EDIT-PLAN.md + authors CUE-SHEET.md (sub-point
    spotlight rows, the SFX layer by measured tail, face treatment, zero orphans); lint_edit_plan.py is
    the code gate (format, monotonic timecodes, SAY coverage, zero orphans, every hard hit has its SFX
    event, every card has its impact, cue-sheet sections, no em dashes)."""
    node = "edit_plan"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    ep, cs = C.doc(proj, "edit_plan"), C.doc(proj, "cue_sheet")
    fs = C.final_spine(proj, scope)
    duration = (_duration(fs) or 0.0) if fs else 0.0
    if not (ep.is_file() and cs.is_file() and not _redo(state, node)):
        rc, out = C.run_streaming([sys.executable, "-u", str(GEN_EDITPLAN), str(proj), "--scope", scope], state, node)
        if rc != 0:
            return C._fail(state, node, "gen_editplan.py failed to seed the event log", out)
        seed = proj / "_previews" / "EDIT-PLAN.seed.md"
        prompt = (f"Author the pre-build blueprint pair for the longform-edited project `{proj.name}` (folder `{proj}`): "
                  f"`{ep}` and `{cs}`.\nSeed event log (every SAY line, cover beat, bed, duck, hard hit, FACE window and chapter "
                  f"card, already on FINAL-spine seconds): `{seed}`. FINAL spine: `{fs}` ({duration:.2f}s, 30 fps).\n"
                  f"Plans: `{C.doc(proj, 'as_recorded')}` (chapter map + FACE windows + flags), `{C.doc(proj, 'cover_plan')}`, "
                  f"`{C.doc(proj, 'music_plan')}` (beds, automation, hard hits, the ONE vibe-cut duck), `{C.doc(proj, 'project_log')}` "
                  f"(rulings: title-card pauses 1.5 s; the DELIVERED stamp on R8 is approved).\n"
                  f"Built assets + their word-cued states: `{proj / 'assets'}` (read assets/diagrams/_state-cues.md and "
                  "assets/charts/*.spec.md; card states are the -sN files).\n"
                  "SFX kit: video-creation/assets/sfx/ (Impacts/library.json + WHEN-TO-USE-IMPACTS.md, risers/). Pick every impact by "
                  "MEASURED tail and name the file in the log.\n"
                  "Follow your agent definition: refine the seed (never re-derive timecodes), remove the SEED marker and every "
                  "placeholder, zero orphans, no em dashes, write ONLY the two files, then run "
                  f"`python {LINT_EDIT_PLAN} \"{proj}\" --duration {duration:.3f}` until it prints EDIT-PLAN-LINT PASS and "
                  "report its last line plus every open decision that would move a cue.")
        rc, out = C.spawn_agent(state, node, "edit-plan-author", prompt, f"agent-edit-plan-{proj.name}.log")
        for p in (ep, cs):
            if not p.is_file() or p.stat().st_size < 1500:
                return C._fail(state, node, f"edit-plan-author did not write {p.name} (rc {rc})", out)
    ok, events, warns, out = _lint_edit_plan(state, node, proj, duration)
    if not ok:
        return C._fail(state, node, "EDIT-PLAN.md / CUE-SHEET.md fail lint_edit_plan.py (see FAIL lines above; fix and re-drive, "
                                    "--redo edit_plan re-runs the author)", out)
    return {"steps": C._step(state, node, "ran", f"EDIT-PLAN.md ({events} events) + CUE-SHEET.md written, lint PASS ({warns} warning(s))")}


TRANSITION_LIB = C.REPO_ROOT / "video-creation" / "assets" / "transitions" / "library.json"
RENDER_TRANSITIONS = C.SKILLS / "comp-build" / "render_transitions.py"
LINT_TRANSITIONS = C.SKILLS / "comp-build" / "lint_transitions.py"
TR_LINT_RE = re.compile(r"^TRANSITIONS-LINT (PASS|FAIL) rows=(\d+) fails=(\d+) warns=(\d+)", re.M)


def _lib_ids():
    raw = json.loads(TRANSITION_LIB.read_text(encoding="utf-8"))
    rows = raw if isinstance(raw, list) else (raw.get("rows") or raw.get("transitions") or next(iter(raw.values())))
    return {r["id"] for r in rows if isinstance(r, dict) and r.get("id")}


def _normalize_transition_ids(plan: dict) -> dict:
    """The strategist's schema carries `source` (lib|rmn|hand) beside a bare `id`; the doc convention is the
    prefixed form (`lib:melt-rgb-3`). Prefix in place so every downstream reader sees one form."""
    for r in plan.get("transitions") or []:
        tid, src = str(r.get("id", "")), str(r.get("source", "")).strip().lower()
        if tid and not re.match(r"^(rmn|lib|hand):", tid) and src in ("lib", "rmn", "hand"):
            r["id"] = f"{src}:{tid}"
    return plan


def _transition_plan_check(plan: dict, duration: float):
    """TRANSITION-PLAN.json verified from disk: schema, one card pick (rmn:), one face pick, every lib: id
    resolves in the library, every row source-tagged with a numeric tc on the spine, melt/spin rows duck
    the SFX and justify TRANSFORM vs NEW FACET, the budget matches the rows, no em dashes."""
    for k in ("card_pick", "face_glitch_pick", "transitions", "melt_spin_budget", "consistency_check"):
        if k not in plan:
            return f"missing key {k}"
    if "\u2014" in json.dumps(plan, ensure_ascii=False):
        return "em dash in the plan text (persona rule)"
    ids = _lib_ids()
    card = str((plan.get("card_pick") or {}).get("id", ""))
    if not re.match(r"^(rmn|hand):[a-z0-9-]+$", card):
        return f"card_pick.id must be rmn:<presentation> or hand:<name> (e.g. hand:cube-3d), got {card!r}"
    face = str((plan.get("face_glitch_pick") or {}).get("id", ""))
    fam_ok = face.startswith("lib:") and (face[4:] in ids or any(i.startswith(face[4:] + "-") for i in ids))
    if not (face.startswith("hand:") or fam_ok):
        return f"face_glitch_pick.id must be hand:<name>, a library id or a library family (lib:blocks-max), got {face!r}"
    rows = plan.get("transitions") or []
    if not rows:
        return "transitions is empty"
    melt = spin = 0
    for r in rows:
        try:
            tc = float(r.get("tc"))
        except (TypeError, ValueError):
            return f"row without a numeric tc: {str(r)[:70]}"
        if tc < 0 or tc > duration + 0.6:
            return f"row at {tc}s is outside the spine ({duration:.2f}s)"
        tid = str(r.get("id", ""))
        if not re.match(r"^(rmn|lib|hand):", tid):
            return f"row at {tc:.2f}s has no source prefix on its id: {tid!r}"
        if tid.startswith("lib:") and tid[4:] not in ids:
            return f"row at {tc:.2f}s: {tid} does not resolve in the transition library"
        role = str(r.get("role", ""))
        if role in ("MELT-transform", "SPIN-newfacet"):
            melt += role == "MELT-transform"
            spin += role == "SPIN-newfacet"
            if not r.get("sfx_duck"):
                return f"{role} at {tc:.2f}s must set sfx_duck true"
            if not re.search(r"TRANSFORM|NEW.?FACET", str(r.get("why", "")), re.I):
                return f"{role} at {tc:.2f}s: why must justify TRANSFORM vs NEW FACET"
    bud = plan.get("melt_spin_budget") or {}
    if int(bud.get("melt_used", -1)) != melt or int(bud.get("spin_used", -1)) != spin:
        return f"melt_spin_budget says melt {bud.get('melt_used')} / spin {bud.get('spin_used')} but the rows carry {melt} / {spin}"
    return None


def transitions(state: LongformState) -> LongformState:
    """Wave D node 4 (2026-09-28): the transition-strategist (Fable/max, read-only) assigns every scene change
    in the cue sheet across the three buckets and reserves MELT/SPIN for the marquees; the node persists
    TRANSITION-PLAN.json, verifies it from disk, renders TRANSITIONS.md (comp-build §14 skeleton) with
    render_transitions.py and gates it with lint_transitions.py (sections, prefixes, library ids, one card
    and one face pick, every card ON and FACE edge covered)."""
    node = "transitions"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    dest, doc = C.doc(proj, "transition_plan"), C.doc(proj, "transitions")
    fs = C.final_spine(proj, scope)
    duration = (_duration(fs) or 0.0) if fs else 0.0
    if not (dest.is_file() and not _redo(state, node)):
        prompt = (f"Author the TRANSITION plan for the longform-edited project `{proj.name}` (folder `{proj}`).\n"
                  f"FINAL spine: `{fs}` ({duration:.2f}s, 30 fps; every tc is a final-spine second, pre-card-pause).\n"
                  f"Placement (every scene change to assign): `{C.doc(proj, 'cue_sheet')}` (layer-grouped; its TRANSITIONS section "
                  f"lists the candidates) and `{C.doc(proj, 'edit_plan')}` (time-ordered event log; rows marked `→TRANSITIONS.md` are "
                  f"yours to resolve). FACE windows + chapter cards: `{C.doc(proj, 'as_recorded')}`. Cover beats + marquee notes: "
                  f"`{C.doc(proj, 'cover_plan')}`. Music hits: `{C.doc(proj, 'music_plan')}`. Rulings: `{C.doc(proj, 'project_log')}`.\n"
                  f"Library meta: `{TRANSITION_LIB}` (ids must resolve exactly).\n"
                  "Hard rules the graph verifies from disk: ONE rmn: card pick (fires at every chapter `card ON`); ONE face pick "
                  "(hand:film-burn or a lib:blocks-max-* id) with a `face-cut` row at EVERY FACE cut-in and cut-out edge; a `card` row at "
                  "every title card; every row source-tagged (rmn:/lib:/hand:) with a numeric tc on the spine; melt/spin rows set "
                  "sfx_duck true and justify TRANSFORM vs NEW FACET; melt_spin_budget equals the rows; no em dashes anywhere.\n"
                  f"Return the JSON per your definition AND also save it to EXACTLY `{dest}` with Bash (a quoted heredoc).")
        rc, out = C.spawn_agent(state, node, "transition-strategist", prompt, f"agent-transitions-{proj.name}.log")
        if not C.persist_agent_json(out, dest, want_key="transitions"):
            return C._fail(state, node, f"transition-strategist returned no usable TRANSITION-PLAN.json (rc {rc})", out)
    try:
        plan = json.loads(dest.read_text(encoding="utf-8"))
    except Exception as e:
        return C._fail(state, node, f"TRANSITION-PLAN.json invalid JSON: {e}")
    before = json.dumps(plan, sort_keys=True)
    plan = _normalize_transition_ids(plan)
    if json.dumps(plan, sort_keys=True) != before:
        C._write_json_atomic(dest, plan)
    why = _transition_plan_check(plan, duration)
    if why:
        return C._fail(state, node, f"TRANSITION-PLAN.json failed verification: {why} (fix the plan and re-drive; --redo transitions re-runs the strategist)")
    args = [sys.executable, "-u", str(RENDER_TRANSITIONS), str(proj)] + (["--force"] if _redo(state, node) else [])
    rc, out = C.run_streaming(args, state, node)
    if rc != 0:
        return C._fail(state, node, "render_transitions.py failed", out)
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_TRANSITIONS), str(proj)], state, node)
    m = TR_LINT_RE.search(out or "")
    if rc != 0 or not m or m.group(1) != "PASS":
        return C._fail(state, node, "TRANSITIONS.md fails lint_transitions.py (see FAIL lines above)", out)
    return {"steps": C._step(state, node, "ran", f"TRANSITION-PLAN.json ok ({m.group(2)} scene changes), TRANSITIONS.md rendered, lint PASS")}


RECONCILE_DOCS = EP_SKILL / "reconcile_docs.py"
RECONCILE_RE = re.compile(r"^RECONCILE (PASS|FAIL) resolved=(\d+) placeholders_left=(\d+) fails=(\d+)", re.M)


def reconcile_docs(state: LongformState) -> LongformState:
    """Wave D node 5 (2026-09-28): pure code. reconcile_docs.py fans the TRANSITION-PLAN.json picks back into
    the EDIT-PLAN.md / CUE-SHEET.md rows still marked `→TRANSITIONS.md` (matched by timecode + role), then
    CROSS-CHECKS the blueprint set (zero placeholders, every plan row / cover beat / bed start has its event,
    every [TRANSITION] carries a prefixed id, TRANSITIONS.md §5 complete, no em dashes). The two document
    lints re-run afterwards so the fan-in cannot break a format the earlier nodes proved."""
    node = "reconcile_docs"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    duration = (_duration(fs) or 0.0) if fs else 0.0
    rc, out = C.run_streaming([sys.executable, "-u", str(RECONCILE_DOCS), str(proj), "--apply"], state, node)
    m = RECONCILE_RE.search(out or "")
    if rc != 0 or not m or m.group(1) != "PASS":
        return C._fail(state, node, "blueprint set does not reconcile (see FAIL lines above; fix the named rows by hand, then re-drive)", out)
    ok, events, warns, out2 = _lint_edit_plan(state, node, proj, duration)
    if not ok:
        return C._fail(state, node, "EDIT-PLAN.md / CUE-SHEET.md fail lint_edit_plan.py after the fan-in", out2)
    rc, out3 = C.run_streaming([sys.executable, "-u", str(LINT_TRANSITIONS), str(proj)], state, node)
    if rc != 0:
        return C._fail(state, node, "TRANSITIONS.md fails lint_transitions.py after the fan-in", out3)
    return {"steps": C._step(state, node, "ran", f"{m.group(2)} transition pick(s) fanned into the event log, cross-check PASS, both lints PASS")}


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

BAKE_CARD_PAUSES = C.SCRIPTS / "bake_card_pauses.py"
LINT_PAUSE_SILENCE = C.SKILLS / "comp-build" / "lint-pause-silence.py"
CHECK_SPINE_FPS = C.SKILLS / "comp-build" / "check_spine_fps.py"
DEFAULT_CARD_PAUSE = 1.5   # Mike's ruling on kaspa-vprogs (>= the 1 s readable minimum)


def card_pauses(state: LongformState) -> LongformState:
    """Wave E node 1 (2026-09-28): bake the title-card pauses into the FINAL spine. Cards ON come from
    AS-RECORDED's chapter headers; bake_card_pauses.py SNAPS each insert to the silence trough at the
    chapter boundary (RMS scan, the lint's method) and inserts freeze + silence (sync-safe filter_complex);
    lint-pause-silence.py then gates the SNAPPED points on the SOURCE spine; check_spine_fps + duration are
    verified on the output, which becomes spine/<scope>.<next letter>.paused.mp4 (+ .json with CARD_T and
    PAUSE for the comp) and is copied to assets/spine.mp4 (comp-build §10/§13a)."""
    node = "card_pauses"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)
    if not fs:
        return C._fail(state, node, "final spine missing")
    if ".paused." in fs.name:
        paused, source = fs, None   # already baked (re-drive)
    else:
        letter = re.search(rf"^{re.escape(scope)}\.([a-z])\.", fs.name)
        nxt = chr(ord(letter.group(1)) + 1) if letter else "g"
        paused, source = fs.with_name(f"{scope}.{nxt}.paused.mp4"), fs
    side = paused.with_suffix(".json")
    pause_s = float(state.get("card_pause") or DEFAULT_CARD_PAUSE)
    cards = [(ta, re.search(r'card\s+ON\s*"([^"]+)"', tail).group(1))
             for cid, title, ta, tz, tail in _chapters(proj) if re.search(r'card\s+ON\s*"', tail)]
    if not cards:
        return C._fail(state, node, "AS-RECORDED.md names no chapter with `card ON` (nothing to bake; if that is intended, --done card_pauses)")
    if not (paused.is_file() and side.is_file() and not _redo(state, node)):
        if source is None:
            return C._fail(state, node, f"{paused.name} exists without its sidecar; delete it and re-drive")
        args = [sys.executable, "-u", str(BAKE_CARD_PAUSES), str(source), "--cards", ",".join(f"{t}:{lbl}" for t, lbl in cards),
                "--pause", f"{pause_s}", "--out", str(paused), "--json", str(side)]
        rc, out = C.run_streaming(args, state, node)
        if rc != 0:
            return C._fail(state, node, "bake_card_pauses.py failed (a boundary with no silence trough: move that card per comp-build §5, as kaspa 30bps did)", out)
    meta = json.loads(side.read_text(encoding="utf-8"))
    inserts = ",".join(f"{p['at']}:{p['dur']}" for p in meta.get("pauses") or [])
    src_for_gate = Path(meta.get("source") or (source or fs))
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_PAUSE_SILENCE), "--inserts", inserts, str(src_for_gate)], state, node)
    if rc != 0:
        return C._fail(state, node, "lint-pause-silence.py FAILED on the snapped insert points (see above)", out)
    rc, out = C.run_streaming([sys.executable, "-u", str(CHECK_SPINE_FPS), str(paused), "30"], state, node)
    if rc != 0:
        return C._fail(state, node, "paused spine fps != 30 (check_spine_fps.py)", out)
    expect = (_duration(src_for_gate) or 0.0) + len(meta.get("pauses") or []) * float(meta.get("pause_s") or pause_s)
    got = _duration(paused) or 0.0
    if abs(got - expect) > 0.15:
        return C._fail(state, node, f"paused spine is {got:.3f}s, expected {expect:.3f}s")
    dest = proj / "assets" / "spine.mp4"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.is_file() or dest.stat().st_size != paused.stat().st_size:
        shutil.copyfile(paused, dest)
    C.mark_manual(proj, node)  # the spine letter advanced; downstream nodes read assets/spine.mp4
    return {"steps": C._step(state, node, "ran", f"{len(cards)} card pause(s) x {pause_s}s baked -> {paused.name} ({got:.2f}s), gate PASS, copied to assets/spine.mp4")}


BUILD_CAPTIONS = C.SCRIPTS / "build_project_captions.py"
CAPTIONS_RE = re.compile(r"^CAPTIONS-BUILT groups=(\d+) windows=(\d+) file=(.+)$", re.M)


def captions(state: LongformState) -> LongformState:
    """Wave E node 2 (2026-09-28): pure code. build_project_captions.py runs the ONE caption tool
    (skills/captions/build_captions.py, montserrat 2/4) on the FINAL word JSON, filters to the FACE holds
    over 5 s (captions.md: never over a cover, never over short face punctuation), applies the project's
    AS-RECORDED mishears, writes remotion/src/<Project>Captions.ts (SOURCE seconds + CAPTION_WINDOWS) and the
    assets/captions.json sidecar. Verified from disk: sidecar, groups > 0, every t inside a window, no leftover
    brand mishear, no em dash."""
    node = "captions"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    side = proj / "assets" / "captions.json"
    if not (side.is_file() and not _redo(state, node)):
        args = [sys.executable, "-u", str(BUILD_CAPTIONS), str(proj), "--scope", scope]
        if state.get("caption_windows"):
            for w in str(state["caption_windows"]).split(","):
                args += ["--window", w.strip()]
        rc, out = C.run_streaming(args, state, node)
        if rc != 0:
            return C._fail(state, node, "build_project_captions.py failed (no FACE hold over 5 s? pass --caption-windows a-b for a cold-open exception)", out)
    meta = json.loads(side.read_text(encoding="utf-8"))
    ts = Path(meta.get("file", ""))
    if not ts.is_file():
        return C._fail(state, node, f"captions file missing: {ts}")
    rows = re.findall(r"\{\s*t:\s*([\d.]+)\s*,\s*h:\s*'((?:[^'\\]|\\.)*)'", ts.read_text(encoding="utf-8"))
    if not rows or int(meta.get("groups", 0)) != len(rows):
        return C._fail(state, node, f"captions file carries {len(rows)} groups, sidecar says {meta.get('groups')}")
    wins = [(float(a), float(b)) for a, b in meta.get("windows") or []]
    for t, h in rows:
        if not any(a - 0.05 <= float(t) <= b for a, b in wins):
            return C._fail(state, node, f"caption group at {t}s lies outside every caption window")
        if re.search(r"\bcasper\b|\u2014", h, re.I):
            return C._fail(state, node, f"caption text still carries a brand mishear / em dash: {h!r}")
    return {"steps": C._step(state, node, "ran", f"{len(rows)} caption groups over {len(wins)} FACE window(s) -> {ts.name}")}


REMOTION = C.REPO_ROOT / "video-creation" / "remotion"
COMP_GATES = C.SKILLS / "comp-build"


def _pascal(slug: str) -> str:
    return "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", slug) if p)


def _has_audio_stream(video: Path) -> bool:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type",
                        "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    return "audio" in (r.stdout or "")


def _latest_draft(proj: Path):
    prev = proj / "_previews"
    drafts = sorted(prev.glob(f"{proj.name}-draft-v*.mp4"), key=lambda p: int(re.search(r"-v(\d+)\.mp4$", p.name).group(1))) if prev.is_dir() else []
    return drafts[-1] if drafts else None


def _paused_meta(proj: Path, scope: str):
    fs = C.final_spine(proj, scope)
    side = fs.with_suffix(".json") if fs and ".paused." in fs.name else None
    return (json.loads(side.read_text(encoding="utf-8")) if side and side.is_file() else {}), fs


def comp_build(state: LongformState) -> LongformState:
    """Wave E node 3 (2026-09-28): the comp-builder executor (opus/xhigh) builds the Remotion composition TO the
    approved blueprint per comp-build.md, runs the Python gates, chunk-QAs, and renders the FULL draft at low
    bitrate into _previews/. The node verifies from disk: comp file + Root registration, the draft mp4 (duration
    == paused spine, fps 30, audio), and persists the builder's JSON report."""
    node = "comp_build"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp_id = _pascal(proj.name)
    comp = REMOTION / "src" / f"{comp_id}.tsx"
    report = proj / "_previews" / "comp-build-report.json"
    meta, paused = _paused_meta(proj, scope)
    if not paused or not meta:
        return C._fail(state, node, "paused spine + sidecar missing (card_pauses must run first)")
    src_secs = _duration(Path(meta.get("source", ""))) if meta.get("source") else None
    draft = _latest_draft(proj)
    if not (comp.is_file() and draft and report.is_file() and not _redo(state, node)):
        prompt = (f"Build the Remotion composition for the longform-edited project `{proj.name}` (folder `{proj}`) TO its approved "
                  f"blueprint, and render the full draft.\nComposition id + file: `{comp_id}` -> `{comp}` (register in `{REMOTION / 'src' / 'Root.tsx'}`).\n"
                  f"Paused spine: `{proj / 'assets' / 'spine.mp4'}` (= `{paused}`); its sidecar `{paused.with_suffix('.json')}` gives "
                  f"CARD_T = pauses[].at = {[p['at'] for p in meta.get('pauses', [])]} and PAUSE = {meta.get('pause_s')} s; SPINE_SECS = the "
                  f"SOURCE spine `{meta.get('source')}` = {src_secs or 0:.3f} s.\n"
                  f"Blueprint: `{C.doc(proj, 'edit_plan')}` · `{C.doc(proj, 'cue_sheet')}` · `{C.doc(proj, 'transitions')}` + "
                  f"`{C.doc(proj, 'transition_plan')}` · `{C.doc(proj, 'cover_plan')}` · `{C.doc(proj, 'as_recorded')}`.\n"
                  f"Assets (the render's --public-dir): `{proj / 'assets'}` (state cues in assets/diagrams/_state-cues.md, chart spec in "
                  f"assets/charts/*.spec.md). Captions: `{proj / 'assets' / 'captions.json'}` -> import ZCAPTIONS + CAPTION_WINDOWS from "
                  f"`{REMOTION / 'src' / (comp_id + 'Captions.ts')}`.\n"
                  f"Draft output: `{proj / '_previews' / (proj.name + '-draft-v1.mp4')}` (bump the N if it exists) with the render log beside it; "
                  f"chunk QA into `{proj / '_previews' / 'qa'}`. Save your JSON report to EXACTLY `{report}`.\n"
                  "Follow your agent definition and comp-build.md exactly; no music, no SFX, no watermark in the comp; never end your "
                  "turn while a render runs.")
        rc, out = C.spawn_agent(state, node, "comp-builder", prompt, f"agent-comp-build-{proj.name}.log")
        if not report.is_file():
            C.persist_agent_json(out, report, want_key="comp_file")
        draft = _latest_draft(proj)
    if not comp.is_file():
        return C._fail(state, node, f"composition file not written: {comp}")
    root = (REMOTION / "src" / "Root.tsx").read_text(encoding="utf-8", errors="replace")
    if f'id="{comp_id}"' not in root and f"id={{'{comp_id}'}}" not in root and f"id='{comp_id}'" not in root:
        return C._fail(state, node, f"{comp_id} is not registered in remotion/src/Root.tsx")
    if not draft:
        return C._fail(state, node, f"no draft render in {proj / '_previews'} ({proj.name}-draft-vN.mp4)")
    got = _duration(draft) or 0.0
    want = _duration(paused) or 0.0
    if abs(got - want) > 0.3:
        return C._fail(state, node, f"draft {draft.name} is {got:.2f}s, the paused spine is {want:.2f}s (every cue must route through sh())")
    if not _has_audio_stream(draft):
        return C._fail(state, node, f"draft {draft.name} has no audio stream")
    return {"steps": C._step(state, node, "ran", f"{comp.name} registered, draft {draft.name} ({got:.2f}s, audio ok)")}


GATE_LINES = {
    "lint_comp_imports.py": r"^COMP-IMPORTS-LINT (PASS|FAIL)",
    "lint_covers.py": r"^COVERS-LINT (PASS|FAIL)", "lint-deck-containers.py": None, "lint_slide_balance.py": r"^SLIDE-BALANCE-LINT (PASS|FAIL)",
    "lint_animated_charts.py": r"^ANIMATED-CHARTS-LINT (PASS|FAIL)", "lint_transition_assets.py": r"^TRANSITION-ASSETS-LINT (PASS|FAIL)",
    "check_spine_fps.py": r"^SPINE-FPS (PASS|FAIL)",
}


def verify_comp(state: LongformState) -> LongformState:
    """Wave E node 4 (2026-09-28): pure code. Every Python comp gate must PASS on the built composition
    (covers, deck containers, slide balance, animated charts, transition assets, spine fps; pause-silence when
    the comp declares INSERTS), and the draft must match the paused spine (duration, fps, audio). Results are
    persisted to _previews/verify-comp.json for the draft gate."""
    node = "verify_comp"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    comp_id = _pascal(proj.name)
    comp = REMOTION / "src" / f"{comp_id}.tsx"
    assets = proj / "assets"
    if not comp.is_file():
        return C._fail(state, node, f"composition missing: {comp}")
    results, fails = {}, []
    runs = [
        ("lint_comp_imports.py", [str(comp)]),   # no React file from another project (Mike, 2026-09-28)
        ("lint_covers.py", [str(comp)]),
        ("lint-deck-containers.py", [str(comp)] + [str(assets / d) for d in ("card-slides", "title-slides", "diagrams") if (assets / d).is_dir()]),
        ("lint_slide_balance.py", [str(comp)]),
        ("lint_animated_charts.py", [str(comp)]),
        ("lint_transition_assets.py", [str(comp), str(assets), str(C.doc(proj, "transitions"))]),
        ("check_spine_fps.py", [str(assets / "spine.mp4"), "30"]),
    ]
    src_text = comp.read_text(encoding="utf-8", errors="replace")
    if re.search(r"INSERTS\s*=\s*\[", src_text):
        _, paused = _paused_meta(proj, scope)
        meta = json.loads(paused.with_suffix(".json").read_text(encoding="utf-8")) if paused else {}
        runs.append(("lint-pause-silence.py", [str(comp), str(meta.get("source") or paused)]))
    for script, args in runs:
        rc, out = C.run_streaming([sys.executable, "-u", str(COMP_GATES / script), *args], state, node)
        pat = GATE_LINES.get(script)
        m = re.search(pat, out or "", re.M) if pat else None
        ok = rc == 0 and (m.group(1) == "PASS" if m else True)
        line = (m.group(0) if m else (out or "").strip().splitlines()[-1:] or ["(no output)"])
        results[script] = {"ok": ok, "line": line if isinstance(line, str) else line[0]}
        if not ok:
            fails.append(script)
    draft = _latest_draft(proj)
    paused = C.final_spine(proj, scope)
    d_ok = bool(draft and paused and abs((_duration(draft) or 0) - (_duration(paused) or 0)) <= 0.3 and _has_audio_stream(draft))
    results["draft"] = {"ok": d_ok, "file": str(draft) if draft else None,
                        "duration_s": _duration(draft) if draft else None, "spine_s": _duration(paused) if paused else None}
    if not d_ok:
        fails.append("draft")
    (proj / "_previews").mkdir(parents=True, exist_ok=True)
    C._write_json_atomic(proj / "_previews" / "verify-comp.json", {"results": results, "fails": fails, "comp": str(comp)})
    if fails:
        return C._fail(state, node, "comp gates failed: " + ", ".join(fails) + " (see the gate output above; fix the comp, re-render the draft, re-drive)")
    return {"steps": C._step(state, node, "ran", f"{len(runs)} gate(s) PASS on {comp.name}, draft {draft.name} matches the spine")}


MIX_MUSIC = C.SCRIPTS / "mix_music.py"
MIX_RE = re.compile(r"^MIX-DONE out=(.+?) dur=([\d.]+) lufs_in=(\S+) lufs_out=(\S+) peak_out=(\S+)", re.M)


def mix_audio(state: LongformState) -> LongformState:
    """Wave E node 5 (2026-09-28, Mike: "there is no music, can you add it to the draft?"): pure code. mix_music.py
    lays the MUSIC-PLAN beds (sh()-mapped, breath at each card, the plan's seats and automation dips), the event
    log's impacts/risers and the library transitions' SFX onto the latest draft with ONE sync-safe filter_complex
    (video copied) -> <draft>-mix.mp4 + the re-runnable mix-audio.json. Verified: output exists, duration ==
    draft, peak under 0 dBFS. Mike reviews the MIXED draft at GATE 5 (video-qa: never a silent render)."""
    node = "mix_audio"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    prev = proj / "_previews"
    drafts = sorted([p for p in prev.glob(f"{proj.name}-draft-v*.mp4") if not p.stem.endswith("-mix")],
                    key=lambda p: int(re.search(r"-v(\d+)\.mp4$", p.name).group(1))) if prev.is_dir() else []
    if not drafts:
        return C._fail(state, node, "no draft render to mix")
    draft = drafts[-1]
    out = draft.with_name(draft.stem + "-mix.mp4")
    if not (out.is_file() and out.stat().st_mtime >= draft.stat().st_mtime and not _redo(state, node)):
        rc, res = C.run_streaming([sys.executable, "-u", str(MIX_MUSIC), str(proj), "--video", str(draft), "--out", str(out)], state, node)
        m = MIX_RE.search(res or "")
        if rc != 0 or not m:
            return C._fail(state, node, "mix_music.py failed (see above)", res)
    if not out.is_file():
        return C._fail(state, node, f"mixed draft missing: {out}")
    d_in, d_out = _duration(draft) or 0.0, _duration(out) or 0.0
    if abs(d_in - d_out) > 0.1:
        return C._fail(state, node, f"mixed draft is {d_out:.2f}s, the draft is {d_in:.2f}s")
    side = proj / "mix-audio.json"
    peak = json.loads(side.read_text(encoding="utf-8")).get("peak_out_dbfs") if side.is_file() else None
    if peak is not None and peak > -0.1:
        return C._fail(state, node, f"mixed draft clips (peak {peak} dBFS); lower --sfx-db / bed seats and re-drive")
    return {"steps": C._step(state, node, "ran", f"{out.name} ({d_out:.2f}s, peak {peak} dBFS) from MUSIC-PLAN + event-log SFX")}


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
    "card_pauses", "captions", "comp_build", "verify_comp", "mix_audio", "gate_draft",
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
