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
    envato_max: Optional[int]   # plan: Envato video budget (default scales with runtime, see _default_budgets)
    chatgpt_max: Optional[int]  # plan: ChatGPT image budget (default scales with runtime, see _default_budgets)
    coarse_sil: Optional[float]  # spine: the COARSE one-zone min-silence (default 0.7)
    sil_pre: Optional[float]     # spine: FINAL two-zone intro min-silence (default 0.25)
    sil_post: Optional[float]    # spine: FINAL two-zone body min-silence (default 0.5)
    pad_tail: Optional[float]    # spine: BOTH desilence passes, silence kept after the sentence before a cut (default 0)
    pad_head: Optional[float]    # spine: BOTH desilence passes, silence kept before the sentence after a cut (default = pad_tail)
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


# B-roll / image budgets scale with RUNTIME (Mike, 2026-10-07: "a default of 5 for a 5-minute video, much more for a
# 20-minute one"). Rates calibrated on golden-kitty (7:50, approved with 30 Envato + 15 ChatGPT, about 3.8 + 1.9 a
# minute, after Mike tripled the old flat 10 + 5); Mike then set the image default to a flat 1 a minute (2026-10-07),
# to be raised video by video with --chatgpt-max; the old flat numbers stay as FLOORS so a
# short video keeps what it had. `--envato-max` / `--chatgpt-max` override both.
ENVATO_PER_MIN, CHATGPT_PER_MIN = 3.0, 1.0   # Mike, 2026-10-07: images 1 a minute by default, raised per video
ENVATO_FLOOR, CHATGPT_FLOOR = 10, 5


def _default_budgets(duration_s: float):
    import math
    minutes = max(0.0, float(duration_s or 0.0)) / 60.0
    return (max(ENVATO_FLOOR, math.ceil(minutes * ENVATO_PER_MIN)),
            max(CHATGPT_FLOOR, math.ceil(minutes * CHATGPT_PER_MIN)))


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
- a `## 6. Clip candidates` table (clip inserts are CONSIDERED on every video, Mike 2026-10-09; rule video-creation/longform-edited/skills/clip-inserts/clip-inserts.md): every real VIDEO clip of someone saying a thing this video could splice in with their own voice, words quoted VERBATIM from the audio, URL + exact window, length, the full-context check; or "none found" + what was searched
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
    ok, missing = C.doc_check(dest, 1500, checks + [r"clip candidates"])   # a fresh DATA.md must carry the clip-candidates section
    if not ok:
        return C._fail(state, node, f"DATA.md not acceptable ({', '.join(missing)}); agent rc {rc}", out)
    n_links = len(re.findall(r"https?://", dest.read_text(encoding="utf-8", errors="replace")))
    return {"steps": C._step(state, node, "ran", f"DATA.md written ({n_links} source links)")}


SCREENPLAY_PROMPT = """Author the pre-production SCREENPLAY.md for the longform-edited project `{project}` (folder `{project_dir}`).
Read first, all of them: video-creation/longform-edited/skills/doc-reference/SCREENPLAY.reference.md (the canonical SHAPE: copy it exactly), `{log}` (the LOCKED concept brief + Mike's hard constraints), `{data}` (the fact source: every on-screen number, date and name comes from here, never invented), video-creation/longform-edited/screenplay.md (the canonical format, Convention 5 tagged lines), persona/persona.json.
Mike's hard constraints for THIS video, obey them exactly: {constraints}
{face_mode_clause}VARIETY (the MUSIC-MOOD-PLAN track shortlist): before you shortlist, run `python video-creation/skills/usage-ledger/usage_ledger.py report --what music --exclude-project "{project}"`. Never shortlist a track it marks BLOCKED (the previous video used it); avoid the last three videos' tracks; among tracks that fit the mood prefer `fresh`, then the least recently used.
CLIP INSERTS are CONSIDERED on every video (Mike, 2026-10-09; rule video-creation/longform-edited/skills/clip-inserts/clip-inserts.md, screenplay.md Convention 6): read DATA.md's `## 6. Clip candidates`; a clip that earns its seconds becomes a 🎞️ `[INSERT]` line (CLIP-<n>, who, seconds, the burned context caption) between a SET-UP line that names the speaker and ENDS THE SENTENCE and a RESUME line with Mike's own answer (he never reads the words the clip says); write the `## CLIP-INSERTS` table (one CLIP-<n> row per candidate with a status: PROPOSED / REJECTED / HELD) or the single line `NONE: <why none earns its seconds>`. A clip insert plays with its OWN voice while the spine pauses, never as a muted cover.
Output: return the COMPLETE SCREENPLAY.md per your definition AND save it to EXACTLY `{dest}` using Bash with a quoted heredoc (cat > "{dest}" <<'EOF' ... EOF). FORMAT: Convention 5 exactly as the exemplars write it. Every tagged line starts with its emoji and a BACKTICKED tag (the gray chip in the VS Code preview): 👤 `[FACE]` · 🗣️ `[COVER]` · 🔒 `[SAY-EXACT]` · 🎬 `[SHOW]` · 💬 `[NOTE]` · 🔍 `[VERIFY]` · 🎞️ `[INSERT]`; a locked line is 🔒 `[SAY-EXACT]` 👤 `[FACE]` (or 🗣️ `[COVER]`); the legend table cells are backticked too; one job per line; a spoken line (👤 `[FACE]` / 🗣️ `[COVER]` / 🔒 `[SAY-EXACT]`) is ONLY the words Mike says, never a parenthesis and never a placeholder line: a direction, aside or pronunciation goes on its own 💬 `[NOTE]` / 🎬 `[SHOW]` line (Mike, 2026-10-15); no em dashes. The graph runs video-creation/longform-edited/skills/doc-reference/lint_screenplay.py on the file and HALTS on a format failure.
The graph also verifies the file from disk and halts if it is missing its sections (the chapter map, the tagged beats, per-chapter sections, ## CLIP-INSERTS, ## MUSIC-MOOD-PLAN, ## VISUAL-PLAN, ## OPEN QUESTIONS).
"""

def _face_mode_prompt(proj: Path) -> str:
    """The per-video FACE MODE clause for the screenplay strategist (GRAPH-PROGRESS.json settings.face_mode)."""
    if C.face_mode(proj) != "screenshare":
        return ""
    return ("FACE MODE = SCREEN SHARE (Mike's per-video ruling, GRAPH-PROGRESS.json settings.face_mode; longform-edited.md house rule "
            "#1b): in this video a \U0001F464 `[FACE]` beat is NOT a full-screen face. It is Mike SHARING HIS SCREEN with his webcam in the "
            "bottom-right corner, and the BODY of the shared screen (the deck area, left of the webcam column) shows content WE put "
            "there: a deck card, a system-design chart, an animated chart or a whiteboard beat, cued to his words. So EVERY `[FACE]` "
            "beat MUST carry a \U0001F3AC `[SHOW]` line that names what fills the deck area for that beat (start it with `BODY:` + the "
            "content, e.g. `BODY: card ...`, `BODY: chart C2 ...`, `BODY: whiteboard WBn ...`). The LENGTH of a FACE beat does NOT "
            "change: Convention 3 holds, ONE sentence (a tight pair allowed) per screen-share beat, the body content landing on "
            "that sentence, and the next spoken line is an explicit [COVER] (typically the same card or chart full-frame, "
            "continuing under the read). Only a locked [SAY-EXACT] line in Mike's own words may run longer. The face cap in the "
            "constraints still holds. \U0001F5E3\uFE0F `[COVER]` beats are unchanged: full-frame visuals, no face. No captions on a "
            "screen-share beat.\n")


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
        constraints=state.get("constraints") or "(none beyond the brief)",
        face_mode_clause=_face_mode_prompt(proj))
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


# ── CLIPS-TO-WATCH (Mike, 2026-10-29: "if I can get the link to it earlier on, before we even download the clip")
# Every gate from the screenplay on lists each proposed clip insert as a TIMESTAMPED source link (opens at the
# clip's first second) and, once captured, the playable file. Regenerated at each gate from SCREENPLAY.md's
# CLIP-INSERTS table, then COVER-PLAN clip_inserts (which win once they exist), then assets/clip-inserts/.
_YT_RE = re.compile(r"(https?://(?:www\.)?(?:youtube\.com/watch\?v=[\w-]+|youtu\.be/[\w-]+)[^\s|)`]*)\s*([0-9:.]+)?(?:\s*-\s*([0-9:.]+))?")
# a LOCAL source (a reaction clip / meme from Mike's library, clip-inserts.md rule 6): the path is what Mike opens
_LOCAL_RE = re.compile(r"((?:[A-Za-z]:[\\/]|\\\\)[^|`\n]*?\.(?:mp4|mov|mkv|webm|m4v))\s*,?\s*([0-9:.]+)?(?:\s*-\s*([0-9:.]+))?", re.I)


def _tc_seconds(tc):
    try:
        parts = [float(x) for x in str(tc).split(":")]
    except ValueError:
        return None
    sec = 0.0
    for x in parts:
        sec = sec * 60 + x
    return sec


def _at(url, start):
    s = _tc_seconds(start) if start else None
    if s is None or "youtu" not in url:
        return url
    return f"{url}{'&' if '?' in url else '?'}t={int(s)}"


def write_clips_to_watch(proj: Path) -> Optional[Path]:
    rows = {}
    sp = C.doc(proj, "screenplay")
    if sp.is_file():
        txt = sp.read_text(encoding="utf-8")
        # the SECTION itself (line-anchored, as lint_screenplay.py finds it), never an earlier mention of its name in
        # a note: lets-get-rich (2026-10-31) cites `## CLIP-INSERTS` in its header notes, and a plain split on the
        # first occurrence returned the wrong block (no rows), so CLIPS-TO-WATCH.md was never written.
        m_sec = re.search(r"^##\s+CLIP-INSERTS.*?(?=^##\s|\Z)", txt, re.M | re.S)
        sec = m_sec.group(0) if m_sec else ""
        for line in sec.splitlines():
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 3 or not re.match(r"CLIP-\d+", cells[0]):
                continue
            m = _YT_RE.search(line) or re.search(r"(https?://\S+)", line) or _LOCAL_RE.search(line)
            url = m.group(1) if m else ""
            start = m.group(2) if m and m.lastindex and m.lastindex >= 2 else None
            end = m.group(3) if m and m.lastindex and m.lastindex >= 3 else None
            rows[cells[0]] = {"id": cells[0], "who": cells[1][:120], "url": url, "start": start, "end": end,
                              "status": cells[-1][:40]}
    cp = C.doc(proj, "cover_plan")
    if cp.is_file():
        try:
            for ci in json.loads(cp.read_text(encoding="utf-8")).get("clip_inserts") or []:
                r = rows.setdefault(str(ci.get("id")), {"id": str(ci.get("id"))})
                r.update(who=ci.get("who") or r.get("who", ""), url=ci.get("source") or r.get("url", ""),
                         start=ci.get("start"), end=ci.get("end"), status="IN COVER-PLAN", splice=ci.get("splice_at"))
        except Exception:
            pass
    if not rows:
        return None
    cdir = proj / "assets" / ASSET_FOLDERS["clip-insert"]
    files = sorted(cdir.glob("CLIP-*")) if cdir.is_dir() else []
    out = ["# Clips to watch", "", "_Generated by the graph at every gate. Click the link to open the source at the clip's "
           "first second; once captured, the file is the exact cut that goes in the video._", "",
           "| id | who | watch the source (timestamped) | window | status | captured file |", "|---|---|---|---|---|---|"]
    for k in sorted(rows, key=lambda x: int(re.sub(r"\D", "", x) or 0)):
        r = rows[k]
        f = next((x for x in files if x.name.startswith(k + "-")), None)
        link = _at(r.get("url", ""), r.get("start"))
        out.append(f"| {k} | {r.get('who', '')} | {link} | {r.get('start') or ''}-{r.get('end') or ''} | "
                   f"{r.get('status', '')} | {f.resolve() if f else 'not captured yet'} |")
    p = proj / "CLIPS-TO-WATCH.md"
    p.write_text("\n".join(out) + "\n", encoding="utf-8")
    return p


def _with_clips(proj: Path, review: list) -> list:
    try:
        p = write_clips_to_watch(proj)
    except Exception as e:   # never block a gate on the convenience sheet
        print(f"[longform] clips-to-watch: skipped ({e})")
        p = None
    return review + ([str(p)] if p else [])


def gate_screenplay(state: LongformState) -> LongformState:
    proj = _proj(state)
    out = C.gate(state, "screenplay", "the concept brief, DATA.md and SCREENPLAY.md",
                 _with_clips(proj, [C.doc(proj, "project_log"), C.doc(proj, "data"), C.doc(proj, "screenplay")]))
    if not state.get("stub") and C.gate_done(proj, "screenplay"):
        _record_handoff(proj)
    return out


def _record_handoff(proj: Path):
    """GATE 1 approved: the scripted CH1 handoff line goes to the top of persona.json dive_in_variants.recent_use
    (Mike 2026-10-01 rotation rule; automated 2026-11-01 after the hand-kept list went stale and "So, let's dive
    into all this." came back video after video). Idempotent: one entry per project, re-recorded on a re-approve."""
    try:
        sys.path.insert(0, str(C.SKILLS / "doc-reference"))
        import handoff_rotation as HR
        sp = C.doc(proj, "screenplay")
        line = HR.find_handoff(sp.read_text(encoding="utf-8")) if sp.is_file() else None
        if not line:
            return
        cur = HR._variants(HR._load()[0]).get("recent_use", [])
        if cur and HR._entry_project(cur[0]) == proj.name and HR.norm(HR._entry_line(cur[0])) == HR.norm(line):
            return
        print(f"[longform] handoff rotation: recorded {HR.record(proj.name, line)}")
    except Exception as e:   # bookkeeping never blocks the gate
        print(f"[longform] handoff rotation: not recorded ({e})")


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


def _av_end_drift(path: Path) -> Optional[float]:
    """Signed A/V end drift in seconds (video end minus audio end, start_time + duration per stream)."""
    v = _ffprobe(path, "stream=start_time,duration")
    try:
        nums = [float(x) if x not in ("N/A", "") else 0.0 for x in v]
        if len(nums) >= 4:
            return (nums[0] + nums[1]) - (nums[2] + nums[3])
        return nums[0] - nums[1]
    except Exception:
        return None


def _av_ok(path: Path, tol=0.06, ref: Optional[Path] = None):
    """A/V drift = do the two streams END together (start_time + duration per stream), not "are the two
    duration fields equal". An NVENC encode with B-frames gives the video an edit-list start offset of about
    one frame while the AAC audio starts at 0 and carries up to a frame of end padding; comparing raw
    durations adds those two artifacts and failed a perfectly synced spine by 3 ms (every-job coarse
    desilence, 2026-10-06: video 0.023 + 1143.058, audio 0 + 1143.122, ends 40 ms apart, durations 63 ms).
    With `ref` (the step's INPUT), only the drift the step ADDED is judged: a camera master whose audio already
    ends 66 ms before its video passes that gap down every step, and failing the defumbler for it was a false
    FAIL (inference 2026-10-26: source 66 ms, defumbled 72 ms, 63 joins added 6 ms).
    A file whose OWN drift is within `tol` always passes: a step that RE-SYNCS an inherited offset is not drift
    (only-18-months-left 2026-10-26: the proxy carried +56 ms, the defumbler re-synced it to +10 ms, the final
    spine ended at -34 ms; judged against the proxy that read as 90 ms "added" and failed a synced spine)."""
    d = _av_end_drift(path)
    if d is None:
        return True
    if abs(d) <= tol:
        return True
    base = _av_end_drift(ref) if ref is not None and Path(ref).is_file() else 0.0
    return abs(d - (base or 0.0)) <= tol


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
                 sidecars=(), drift_ref: Optional[Path] = None):
    d = _duration(out_path)
    if not d:
        return "unreadable / zero duration"
    fps = _ffprobe(out_path, "stream=r_frame_rate")
    if fps and fps[0] not in ("30/1", "30000/1000"):
        return f"fps {fps[0]} (expected 30/1; comp-build.md section 1)"
    if not _av_ok(out_path, ref=drift_ref or shorter_than or same_as):
        return "A/V duration drift over 60 ms (beyond what its input already carried)"
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
              "partials, 0 clipped joins, A/V drift) and print the numbers. Do not desilence and do not black out.\n"
              "SPOKEN INSTRUCTIONS: Mike sometimes stops and tells the editor what to do (re-order a line, use a take, drop or "
              "keep something). Follow each one, cut the instruction itself from the spine, and list every one in your "
              "report with its timecode and what you did. A note you cannot carry out with a cut goes in the report as a flag.")
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
              "every line tagged 👤 `[FACE]` is a face window, however many this video has; everything else is COVER).\n"
              f"OUTPUT (fixed 13a path): `{sp['b']}` plus its FACE/COVER map `{cover_json}`.\n"
              "Follow video-creation/skills/cover-blackout/cover-blackout.md exactly: paint black under every COVER "
              "span, audio untouched, duration identical to the input, frame-QA every window midpoint. Foreground only.")
    return _agent_step(state, node, "cover-blackout", prompt, sp["b"],
                       lambda: _spine_check(sp["b"], same_as=sp["a"], sidecars=[cover_json]),
                       f"{sp['b'].name} present")


def _pad_clause(state: LongformState) -> str:
    """The optional sentence residual (Mike, 2026-10-19, evals): BOTH desilence passes keep it. The coarse
    pass must carry it too: at pad 0 it cuts every pause >= the coarse min-silence to zero, and the final
    pass (which runs on the coarse output) can only remove silence, never put it back. COVER scenes only
    (Mike, 2026-10-19: "we can't add an additional 100 ms of dead silence to the face scenes"): desilence.py
    --pad-cover-only drops the pad on any cut edge inside a FACE window, so face scenes cut exactly as at pad 0."""
    tail = state.get("pad_tail")
    head = state.get("pad_head") if state.get("pad_head") is not None else tail
    if not tail:
        return ""
    return (f"; PLUS the sentence residual on COVER scenes only, every cut runs with `--pad {float(tail)} --pad-head "
            f"{float(head)} --pad-cover-only` ({float(tail)*1000:.0f} ms kept after the sentence before the cut, "
            f"{float(head)*1000:.0f} ms before the next, on black/cover picture only; a cut edge inside a FACE window "
            "gets no pad, exactly the normal pad-0 cut)")


def _face_pause_clause(state: LongformState) -> str:
    """Per-video setting `keep_face_pauses` (run.py --keep-face-pauses, GRAPH-PROGRESS.json; Mike, lets-get-rich
    2026-10-31: "the face scenes are intentional"): BOTH desilence passes leave every pause between the first and the
    last spoken word of a FACE scene uncut (desilence.py --keep-face-pauses); the dead air before the first word and
    after the last word is still cut, and the cover scenes are desilenced as usual."""
    if not C.setting(_proj(state), "keep_face_pauses", False):
        return ""
    return ("; AND add `--keep-face-pauses`: the FACE scenes are paced on purpose, so no pause between the first and "
            "the last spoken word of a face window is cut (only the cover scenes and the dead air at a face window's "
            "edges are desilenced); report the `keep-face-pauses:` line it prints")


def desilence_coarse(state: LongformState) -> LongformState:
    node = "desilence_coarse"
    proj, scope = _proj(state), state.get("scope", "ALL")
    sp = C.spine_paths(proj, scope)
    map_json = Path(str(sp["c"])[:-4] + ".map.json")
    coarse = float(state.get("coarse_sil") or 0.7)
    prompt = (f"Desilence (COARSE pass) the blacked spine for project `{proj.name}`.\n"
              f"INPUT: `{sp['b']}`\nOUTPUT (fixed 13a path): `{sp['c']}` with the cut map `{map_json}` (--map-out).\n"
              f"SILENCE DEFINITION for this pass, ONE zone, Mike's knob: min-silence {coarse:.3f} s "
              f"(`--min-sil {coarse}`; no --split, no two-zone){_pad_clause(state)}{_face_pause_clause(state)}. This is the reviewable spine Mike listens to "
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
                  "the COARSE spine: listen for bursts (give timestamps with --bursts a-b,c-d on the resume), flag content, "
                  "AND give the FINAL silence definition on the same resume (--sil-pre <intro s> --sil-post <body s>, "
                  "defaults 0.25 / 0.5; the sentence residual --pad-tail/--pad-head is NOT given here: it is set at "
                  "launch because the coarse pass already carries it, so changing it now needs --redo desilence_coarse "
                  "and a fresh listen): the cleanup + the tight two-zone pass + the transcription run right after this gate, "
                  "so a silently defaulted value costs a full redo (Mike, 2026-10-10)",
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
              "VERIFY every join on the rendered output. Foreground only.\n"
              "A span may also be a REPEATED WORD or false start Mike heard (a word said twice: the span holds the FIRST "
              "take; Mike, evals 2026-10-19): treat the speech island(s) inside the span exactly like a burst, cut from the "
              "silence trough before the span to the trough after it, and keep the take that follows. Whisper naming the "
              "island as a word is expected here, not a reason to stop.")
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
           (f"two-zone with the hook end measured by you: `--split <hook-end> --sil-pre {pre} --sil-post {post}`. The "
            "hook = the WHOLE of CH1 (the intro chapter): find the last spoken line of CH1 in SCREENPLAY.md on the input "
            "(a local Whisper pass over the first ~3 min), and split in the pause after it. NEVER a face-window or "
            "black-picture boundary (evals 2026-10-19: a split at the first face line's end, 4.2 s, left the whole intro "
            f"on the body setting). If no clear CH1 end exists, ONE zone at `--min-sil {post}`")
    zone += _pad_clause(state) + _face_pause_clause(state)
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
    why = _spine_check(fs, drift_ref=C.spine_paths(proj, scope)["lowbps"])  # drift the whole chain ADDED over the proxy
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


# ── Adobe Podcast Studio Enhance Speech handoff (Mike, 2026-11-04, quant: "in the end, the final process of the spine, I'm going
# to upload this to Adobe Podcast Studio so we can enhance the audio. You're going to have to drop a WAV file for me").
# Per video (`run.py --enhance-speech on`). The longform-presentation standard format did this by hand on binance
# (card-overlays.md procedure step 1); here it is two graph nodes around GATE spine, and the remux tool is shared.
ENHANCE_TOL = 0.25  # s; AAC priming/padding slack between a spine and its decoded / re-encoded audio (a real mismatch is a cut)
REMUX_ENHANCED = C.REPO_ROOT / "video-creation" / "longform-presentation" / "skills" / "card-overlays" / "remux_enhanced.py"
ENHANCED_EXT = (".wav", ".mp3", ".m4a", ".aac", ".flac", ".mp4", ".mov")


def _enhance_wav(proj: Path) -> Path:
    return proj / "spine" / f"{proj.name} FINAL.wav"


def _enhanced_returns(proj: Path, scope: str) -> list:
    """Mike's file back from Adobe: anything in spine/ with 'enhanced' in its name, or carrying Adobe Podcast Studio's own
    export tag (`<name>-esv2-50p-bg-10p-music-10p.wav`, seen on quant 2026-11-04), that is not our own remux output."""
    S = proj / "spine"
    return sorted((p for p in S.iterdir() if p.is_file() and p.suffix.lower() in ENHANCED_EXT
                   and ("nhanced" in p.name or re.search(r"-esv\d", p.name))
                   and not re.match(rf"^{re.escape(scope)}\.[a-z]\.enhanced\.mp4$", p.name)), key=lambda p: p.stat().st_mtime)


def enhance_handoff(state: LongformState) -> LongformState:
    """Drops the FINAL spine's audio as `spine/<project> FINAL.wav` (pcm_s16le, the spine's own rate and channels) for Mike's
    Adobe Podcast Studio pass. Skipped unless the video runs with --enhance-speech on."""
    node = "enhance_handoff"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not C.enhance_speech(proj):
        return {"steps": C._step(state, node, "skipped", "not requested for this video (run.py --enhance-speech on)")}
    fs = C.final_spine(proj, scope)
    if not fs:
        return C._fail(state, node, "final spine missing")
    if ".enhanced." in fs.name:
        return {"steps": C._step(state, node, "skipped", f"{fs.name} already carries the enhanced track")}
    wav = _enhance_wav(proj)
    if not wav.is_file() or wav.stat().st_mtime < fs.stat().st_mtime or _redo(state, node):
        rc, out = C.run_streaming(["ffmpeg", "-v", "error", "-y", "-i", str(fs), "-vn", "-c:a", "pcm_s16le", str(wav)], state, node)
        if rc != 0 or not wav.is_file():
            return C._fail(state, node, f"ffmpeg could not write {wav.name}", out)
    d_fs, d_wav = _duration(fs) or 0.0, _duration(wav) or 0.0
    # the WAV is the AAC stream decoded in full, which runs ~50-100 ms past the stream's declared length (encoder
    # priming + padding): a real mismatch is a whole cut, so the tolerance is ENHANCE_TOL, not a frame (quant, 2026-11-04)
    if abs(d_fs - d_wav) > ENHANCE_TOL:
        return C._fail(state, node, f"{wav.name} is {d_wav:.3f}s, the spine is {d_fs:.3f}s")
    return {"steps": C._step(state, node, "ran", f"WAV for Adobe Podcast Studio: {wav} ({d_wav:.1f}s). Enhance it and drop the result "
                                                f"into {proj / 'spine'} with 'enhanced' in its name, or Adobe's own export name (wav / mp3 / m4a / mp4, the same length)")}


def gate_spine(state: LongformState) -> LongformState:
    proj, scope = _proj(state), state.get("scope", "ALL")
    fs = C.final_spine(proj, scope)
    what = "the FINAL spine, its transcript, and the review flags in PROJECT-LOG"
    review = [fs or "spine/", C.words_json(proj, scope) or "spine/", C.doc(proj, "project_log")]
    if C.enhance_speech(proj) and fs and ".enhanced." not in fs.name:
        what += (f"; ENHANCE SPEECH: run Adobe Podcast Studio on `{_enhance_wav(proj)}` and drop the enhanced file into "
                 f"`{proj / 'spine'}` (any name containing 'enhanced') BEFORE resuming: the next node remuxes it onto the spine")
        review.append(_enhance_wav(proj))
    return C.gate(state, "spine", what, review)


def enhance_remux(state: LongformState) -> LongformState:
    """After GATE spine: Mike's enhanced track goes back onto the FINAL spine's video stream (copied, never re-encoded) as the
    next spine letter `<scope>.<x>.enhanced.mp4`, the transcript sidecars copied to the new stem (same timeline, the remux tool
    refuses a length mismatch). Waits (exit 2, the how-to printed) while the enhanced file is not in spine/ yet."""
    node = "enhance_remux"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    if not C.enhance_speech(proj):
        return {"steps": C._step(state, node, "skipped", "not requested for this video")}
    fs = C.final_spine(proj, scope)
    if not fs:
        return C._fail(state, node, "final spine missing")
    if ".enhanced." in fs.name:
        return {"steps": C._step(state, node, "skipped", f"{fs.name} already carries the enhanced track")}
    found = _enhanced_returns(proj, scope)
    if not found:
        return C.placeholder(state, node,
                             how=f"Run Adobe Podcast Studio Enhance Speech on `{_enhance_wav(proj)}` and drop the enhanced file into "
                                 f"`{proj / 'spine'}` with 'enhanced' in its name, or Adobe's own export name (wav / mp3 / m4a / mp4; the same length as the spine). "
                                 "Then re-run: the node remuxes it. `--done enhance_remux` skips the enhancement for this video.",
                             artifact=lambda: bool(_enhanced_returns(proj, scope)), artifact_desc="the enhanced track in spine/")
    src = found[-1]
    letter = chr(ord(fs.name.split(".")[1]) + 1)
    out = proj / "spine" / f"{scope}.{letter}.enhanced.mp4"
    rc, log = C.run_streaming([sys.executable, "-u", str(REMUX_ENHANCED), str(fs), str(src), "--out", str(out),
                               "--tolerance", str(ENHANCE_TOL)], state, node)
    if rc != 0 or not out.is_file() or "CHECK FAILED" in (log or "") or "OK" not in (log or ""):
        out.unlink(missing_ok=True)
        return C._fail(state, node, f"remux of {src.name} onto {fs.name} did not verify (length mismatch, or the video stream changed); "
                                    "the spine is unchanged", log)
    import shutil
    copied = []
    for sfx in (".medium-words.json", ".segments.txt"):
        s_p = fs.with_name(fs.name[:-4] + sfx)
        if s_p.is_file():
            shutil.copy2(s_p, out.with_name(out.name[:-4] + sfx))
            copied.append(sfx)
    if C.final_spine(proj, scope) != out:
        return C._fail(state, node, f"{out.name} is not the highest-letter spine after the remux (chain: {sorted(p.name for p in (proj / 'spine').glob(scope + '.?.*.mp4'))})")
    why = _spine_check(out, drift_ref=C.spine_paths(proj, scope)["lowbps"])
    if why:
        return C._fail(state, node, f"{out.name}: {why}")
    return {"steps": C._step(state, node, "ran", f"{src.name} remuxed onto {fs.name} -> {out.name} (video stream copied, "
                                                f"sidecars {'+'.join(copied) or 'none'} carried); the FINAL spine is now {out.name}")}


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

# WHITEBOARD BEATS (Mike, 2026-11-01, left-behind: the first longform-edited video carrying them, 25 percent of the runtime).
# A cover row of type `whiteboard` is a 15 to 30 s hand-drawn scene (video-creation/skills/whiteboard-beat/whiteboard-beat.md):
# COVER-PLAN `whiteboards[]` carries the brief, the assets node has the whiteboard-builder agent build the scene comp,
# visual-qa clears its stills, chunked-render renders it to assets/whiteboard/<id>.mp4, and the comp plays that clip as a
# full-frame cover. Not an Envato / ChatGPT item: never counted against those budgets.
WB_MIN_S, WB_MAX_S = 15.0, 30.0
WB_CANVAS = "1920x1080"   # longform-edited composites a beat over the FULL frame (whiteboard-beat.md, canvas row)
# SCREEN-SHARE face mode (longform-edited.md house rule #1b, built 2026-11-04 on quant): a FACE window is Mike's OBS screen
# share and the comp PAINTS its deck area (x 0 to 1464) with the plan's `face_body[]` rows. The asset is the normal 1920x1080
# stage (card / diagram / chart / receipt / whiteboard clip) scaled into the deck area by the comp (comp-build.md section 4c):
# no builder renders a second canvas.
FB_DECK_AREA = "1464x1080"
FB_TYPES = ("container", "card", "diagram", "timeline", "animated-chart", "real-chart", "receipt", "whiteboard")

WB_FPS = 30
PEN_TS = C.REPO_ROOT / "video-creation" / "remotion" / "src" / "whiteboard" / "pen.ts"


def _wb_pens() -> set:
    """The pen ids the kit registers (`PENS` in remotion/src/whiteboard/pen.ts): a beat never names a pen the kit lacks."""
    try:
        m = re.search(r"PENS[^=]*=\s*\{([^}]*)\}", PEN_TS.read_text(encoding="utf-8"))
        pens = set(re.findall(r"['\"]([\w-]+)['\"]\s*:", m.group(1))) if m else set()
    except OSError:
        pens = set()
    return pens or {"paper-pastel", "neon-ink"}


def _wb_runtime(plan: dict, duration: float, card_pause: float) -> float:
    """The DELIVERED runtime estimate the share is measured against: the source spine + every clip insert's own length
    + one title-card pause per carded chapter (Mike's '6 minute video' is what the viewer watches)."""
    n_titles = sum(1 for b in plan.get("cover_beats") or [] if str(b.get("cover_type", "")).lower() == "title")
    clips = sum(float(r.get("seconds") or 0) for r in plan.get("clip_inserts") or [])
    return float(duration) + clips + n_titles * float(card_pause)


def _wb_on_screen(plan: dict) -> dict:
    """{WB id: seconds on screen} = the sum of its cover rows (a FACE line inside a beat is not whiteboard time) plus any
    `face_body` row that paints the beat into a screen share's deck area (house rule #1b: still whiteboard on screen)."""
    out = {}
    for b in list(plan.get("cover_beats") or []) + list(plan.get("face_body") or []):
        if str(b.get("cover_type", "")).lower() == "whiteboard":
            wid = str(b.get("asset", ""))
            out[wid] = out.get(wid, 0.0) + float(b["tOut"]) - float(b["tIn"])
    return out


def _face_body_check(plan: dict, faces, duration: float):
    """SCREEN-SHARE face mode (house rule #1b): `face_body[]` rows, one or more per FACE window, each naming a declared asset
    (receipts[] / containers[] / whiteboards[] id) painted into the deck area. Returns a reason or None."""
    rows = plan.get("face_body")
    if not isinstance(rows, list):
        return "face_body must be a list (FACE MODE = screenshare: one row per FACE window naming its deck-area content)"
    if not faces:
        return None if not rows else "face_body rows exist but the spine has no FACE window"
    rec_ids = {str(r.get("id")) for r in plan.get("receipts") or []}
    con_ids = {str(c.get("id")) for c in plan.get("containers") or []}
    wbs = {str(w.get("id")): (float(w.get("tIn") or 0), float(w.get("tOut") or 0)) for w in plan.get("whiteboards") or []}
    covers = [(float(b["tIn"]), float(b["tOut"])) for b in plan.get("cover_beats") or [] if float(b["tOut"]) > float(b["tIn"])]
    seen, per_window = set(), {i: [] for i in range(len(faces))}
    for r in rows:
        rid = str(r.get("id", ""))
        if not re.match(r"^FB\d+$", rid):
            return f"face_body row with a bad id {rid!r} (FB<n>)"
        if rid in seen:
            return f"face_body id {rid} listed twice"
        seen.add(rid)
        try:
            a, z = float(r["tIn"]), float(r["tOut"])
        except (KeyError, TypeError, ValueError):
            return f"face_body {rid}: tIn / tOut must be numbers (final-spine seconds)"
        if not 0 <= a < z <= duration + 0.6:
            return f"face_body {rid}: {a}-{z} is outside the spine ({duration:.2f}s)"
        win = [i for i, (fa, fz) in enumerate(faces) if fa - 0.05 <= a and z <= fz + 0.05]
        if not win:
            return f"face_body {rid}: {a}-{z} does not sit inside one FACE window {[(round(x, 2), round(y, 2)) for x, y in faces]}"
        for (x, y) in covers:
            if a < y and x < z:
                return f"face_body {rid}: {a}-{z} overlaps a cover_beats row {x}-{y} (a FACE window carries no cover)"
        typ = str(r.get("cover_type", "")).lower()
        if typ not in FB_TYPES:
            return f"face_body {rid}: cover_type {typ!r} is not one of {', '.join(FB_TYPES)} (no Envato, no ChatGPT in a deck area)"
        asset = str(r.get("asset") or "")
        if not asset:
            return f"face_body {rid} names no `asset` (a receipts[] / containers[] / whiteboards[] id)"
        if typ == "receipt" and asset not in rec_ids:
            return f"face_body {rid}: receipt {asset!r} has no receipts[] row"
        if typ == "whiteboard":
            if asset not in wbs:
                return f"face_body {rid}: whiteboard {asset!r} has no whiteboards[] row"
            wa, wz = wbs[asset]
            if a < wa - 0.05 or z > wz + 0.05:
                return f"face_body {rid}: {a}-{z} runs outside the {asset} window {wa}-{wz}"
            try:
                frm = float(r.get("from", 0) or 0)
            except (TypeError, ValueError):
                return f"face_body {rid}: `from` must be a number (seconds into the {asset} clip)"
            if abs(frm - (a - wa)) > 0.05:
                return f"face_body {rid}: `from` must be {a - wa:.2f} (its tIn minus the {asset} beat's tIn; the clip's clock runs with the spine)"
        elif typ != "receipt" and asset not in con_ids:
            return f"face_body {rid}: {typ} {asset!r} has no containers[] row"
        if str(r.get("canvas") or FB_DECK_AREA).replace(" ", "").lower() != FB_DECK_AREA:
            return f"face_body {rid}: canvas is the deck area {FB_DECK_AREA} (the comp scales the 1920x1080 stage into it)"
        for (x, y) in per_window[win[0]]:
            if a < y and x < z:
                return f"face_body {rid}: overlaps another face_body row in the same FACE window ({x}-{y})"
        per_window[win[0]].append((a, z))
    for i, (fa, fz) in enumerate(faces):
        if not per_window[i]:
            return f"FACE window {i + 1} ({fa:.2f}-{fz:.2f}s) has no face_body row (every screen share needs its deck-area content)"
    return None


def _whiteboard_check(plan: dict, faces, duration: float, wb_share=None, card_pause: float = 1.5):
    """The `whiteboards[]` rows + their `whiteboard` cover rows. Returns a reason or None."""
    rows = plan.get("whiteboards")
    rows = [] if rows is None else rows
    if not isinstance(rows, list):
        return "whiteboards must be a list (one row per whiteboard beat)"
    beats = plan.get("cover_beats") or []
    wb_beats = [b for b in beats if str(b.get("cover_type", "")).lower() == "whiteboard"]
    pens = _wb_pens()
    seen, comps, windows = set(), set(), {}
    for r in rows:
        wid = str(r.get("id", ""))
        if not re.match(r"^WB\d+$", wid):
            return f"whiteboards row with a bad id {wid!r} (WB<n>)"
        if wid in seen:
            return f"whiteboards id {wid} listed twice"
        seen.add(wid)
        for k in ("tIn", "tOut", "words", "scene", "pen", "canvas", "comp", "out"):
            if r.get(k) in (None, ""):
                return f"whiteboards {wid} is missing `{k}`"
        try:
            a, z = float(r["tIn"]), float(r["tOut"])
        except (TypeError, ValueError):
            return f"whiteboards {wid}: tIn / tOut must be numbers (final-spine seconds)"
        if not 0 <= a < z <= duration + 0.6:
            return f"whiteboards {wid}: {a}-{z} is outside the spine ({duration:.2f}s)"
        if not WB_MIN_S - 0.05 <= z - a <= WB_MAX_S + 0.05:
            return (f"whiteboards {wid} runs {z - a:.2f}s; a whiteboard beat is {WB_MIN_S:g} to {WB_MAX_S:g} s "
                    "(video-creation/skills/whiteboard-beat/whiteboard-beat.md)")
        if str(r["pen"]) not in pens:
            return f"whiteboards {wid}: pen {r['pen']!r} is not a kit pen ({', '.join(sorted(pens))}; remotion/src/whiteboard/pen.ts)"
        if str(r["canvas"]).replace(" ", "").lower() != WB_CANVAS:
            return f"whiteboards {wid}: canvas must be {WB_CANVAS} (longform-edited composites a beat over the full frame)"
        comp = str(r["comp"])
        if not re.match(r"^[A-Z][A-Za-z0-9]*$", comp):
            return f"whiteboards {wid}: comp {comp!r} must be a PascalCase Remotion id (e.g. <Project>{wid})"
        if comp in comps:
            return f"whiteboards {wid}: comp id {comp} is used by another beat"
        comps.add(comp)
        if str(r["out"]).replace("\\", "/") != f"assets/whiteboard/{wid}.mp4":
            return f"whiteboards {wid}: out must be assets/whiteboard/{wid}.mp4 (comp-build section 10)"
        windows[wid] = (a, z)
    for b in wb_beats:
        wid = str(b.get("asset", ""))
        if wid not in windows:
            return f"cover_beats whiteboard row at {b.get('tIn')} names asset {wid!r}, which has no whiteboards row"
        a, z = windows[wid]
        if float(b["tIn"]) < a - 0.05 or float(b["tOut"]) > z + 0.05:
            return f"cover_beats whiteboard row {wid} {b['tIn']}-{b['tOut']} runs outside its beat window {a}-{z}"
    on_screen = _wb_on_screen(plan)
    for wid, (a, z) in windows.items():
        segs = sorted((float(b["tIn"]), float(b["tOut"])) for b in wb_beats if str(b.get("asset", "")) == wid)
        if not segs:
            return f"whiteboards {wid} has no cover_beats row (cover_type whiteboard, asset {wid})"
        # the window is its cover rows; a gap is legal ONLY where a FACE line interrupts the beat (the clip's clock keeps
        # running under the face, so the drawing stays in sync with the words when the cover returns)
        cursor = a
        for x, y in segs + [(z, z)]:
            if x - cursor > 0.5 and not any(fa - 0.05 <= cursor and x <= fz + 0.05 for fa, fz in faces):
                return (f"whiteboards {wid}: {cursor:.2f}-{x:.2f} s of its window is neither its cover row nor a FACE window "
                        "(a beat is one continuous clip; split it only around a FACE line)")
            cursor = max(cursor, y)
        for b in beats:   # a pause inside the window would freeze the spine while the drawing runs on
            ct = str(b.get("cover_type", "")).lower()
            if ct in ("title", "clip-insert") and a + 0.05 < float(b["tIn"]) < z - 0.05:
                return (f"whiteboards {wid}: a {ct} pause at {float(b['tIn']):.2f}s falls inside its window {a}-{z} "
                        "(the drawing is cued to the spine; move the beat or the pause)")
    if wb_share:
        lo, hi = wb_share
        runtime = _wb_runtime(plan, duration, card_pause)
        tot = sum(on_screen.get(w, 0.0) for w in windows)
        if not windows:
            return (f"the video's whiteboard target is {lo:.0%} to {hi:.0%} of the runtime (GRAPH-PROGRESS.json settings."
                    "whiteboard_share) and COVER-PLAN.json carries no whiteboards")
        frac = tot / runtime if runtime else 0.0
        if not lo - 1e-9 <= frac <= hi + 1e-9:
            return (f"whiteboard beats fill {tot:.1f}s = {frac:.1%} of the estimated runtime {runtime:.1f}s (spine + clip inserts "
                    f"+ title pauses); the target is {lo:.0%} to {hi:.0%} = {lo * runtime:.0f} to {hi * runtime:.0f}s")
    return None


def _cover_plan_check(plan: dict, face_windows, duration: float, wb_share=None, card_pause: float = 1.5, face_mode: str = "gated"):
    """COVER-PLAN.json verified from disk: schema, consecutive beats, every non-FACE second assigned
    (no gap over 0.5 s, nothing past the spine), the budget honoured, the whiteboard beats (rows, windows, the
    per-video share when `wb_share` = (lo, hi) is set). Returns a reason or None."""
    for k in ("cover_beats", "receipts", "envato_list", "chatgpt_list", "containers", "budget", "budget_check", "clip_inserts"):
        if k not in plan:
            return f"missing key {k}" + (" (clip inserts are considered on every video: [] plus clip_inserts_note when none)" if k == "clip_inserts" else "")
    beats = plan["cover_beats"]
    if not isinstance(beats, list) or not beats:
        return "cover_beats is empty"
    try:
        seq = sorted(({"tIn": float(b["tIn"]), "tOut": float(b["tOut"]), "type": b.get("cover_type")} for b in beats),
                     key=lambda b: b["tIn"])
    except Exception as e:
        return f"cover_beats rows malformed: {e}"
    for b in seq:
        if b["tOut"] < b["tIn"] or (b["tOut"] == b["tIn"] and b["type"] not in ("title", "card", "container", "clip-insert")):
            return f"beat {b['tIn']}-{b['tOut']} has no length"  # zero-length is legal ONLY for a title-card / clip-insert pause
        if b["tOut"] > duration + 0.6:
            return f"beat {b['tIn']}-{b['tOut']} runs past the spine ({duration:.2f}s)"
        if b["type"] not in ("receipt", "real-chart", "animated-chart", "container", "diagram", "timeline",
                             "envato-video", "chatgpt-image", "card", "title", "clip-insert", "whiteboard"):
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
        if b["tIn"] < cursor - 0.05 and b["tOut"] > b["tIn"]:   # a zero-length pause marker (title / clip-insert) covers no time
            return f"beats overlap near {b['tIn']:.2f}s"
        cursor = max(cursor, b["tOut"])
    if duration - cursor > 0.5 and not any(a - 0.05 <= cursor and duration <= z + 0.6 for a, z in faces):
        return f"the last {duration - cursor:.2f}s of the spine are uncovered"
    for row in plan.get("chatgpt_list") or []:
        if not isinstance(row.get("reference"), str) or not row["reference"].strip():
            return (f"chatgpt_list row {row.get('n')} has no `reference` (a path under schedule-tweets/images/reference/ "
                    "or the string 'none exists (generic approved)')")
    # a REUSED file keeps its own number: ids are derived from `n` (BR-{n} / IMG-{n}), so a re-plan that renumbers 1..N
    # while reusing assets/vid/BR-4-... claims the WRONG file for the slot (kcc20, Mike 2026-10-21)
    for key, folder, pre in (("envato_list", "vid", "BR"), ("chatgpt_list", "img", "IMG")):
        for row in plan.get(key) or []:
            nums = set(re.findall(rf"assets/{folder}/{pre}-(\d+)-", json.dumps(row, ensure_ascii=False)))
            if len(nums) > 1:
                return f"{key} row n={row.get('n')} names more than one reused file ({pre}-{', '.join(sorted(nums))})"
            if nums and str(row.get("n")) != next(iter(nums)):
                return (f"{key} row n={row.get('n')} reuses assets/{folder}/{pre}-{next(iter(nums))}-...: set n to "
                        f"{next(iter(nums))} (the id is {pre}-{{n}}, so a renumbered row claims another slot's file)")
    bud = plan.get("budget") or {}
    for used, cap, what in (("envato_used", "envato_video_max", "Envato"), ("chatgpt_used", "chatgpt_image_max", "ChatGPT")):
        try:
            if int(bud.get(used, 0)) > int(bud.get(cap, 10 if what == "Envato" else 5)):
                return f"{what} budget exceeded ({bud.get(used)}/{bud.get(cap)})"
        except Exception:
            return "budget fields are not numbers"
    # CLIP INSERTS (skills/clip-inserts/clip-inserts.md, Mike 2026-10-09): considered on every video, so the key is
    # required; each row is a real clip with its own voice at a spine pause, cued off the transcript.
    ins = plan.get("clip_inserts")
    if not isinstance(ins, list):
        return "clip_inserts must be a list (empty when the video has none, with clip_inserts_note saying why)"
    seen_ids = set()
    for r in ins:
        rid = str(r.get("id", ""))
        if not re.match(r"^CLIP-\d+$", rid):
            return f"clip_inserts row with a bad id {rid!r} (CLIP-<n>)"
        if rid in seen_ids:
            return f"clip_inserts id {rid} listed twice"
        seen_ids.add(rid)
        for k in ("source", "caption", "splice_at", "seconds"):
            if r.get(k) in (None, ""):
                return f"clip_inserts {rid} is missing `{k}`"
        try:
            sa, sec = float(r["splice_at"]), float(r["seconds"])
        except (TypeError, ValueError):
            return f"clip_inserts {rid}: splice_at / seconds must be numbers"
        if not 0 < sa <= duration + 0.05:
            return f"clip_inserts {rid}: splice_at {sa} is outside the spine ({duration:.2f}s)"
        if sec <= 0.2:
            return f"clip_inserts {rid}: seconds must be the clip's length"
        if not any(b["type"] == "clip-insert" and abs(b["tIn"] - sa) <= 0.05 for b in seq):
            return f"clip_inserts {rid}: no zero-length cover_beats row (cover_type clip-insert, tIn == tOut) at {sa}"
    for b in seq:
        if b["type"] == "clip-insert" and not any(abs(float(r.get("splice_at") or -1) - b["tIn"]) <= 0.05 for r in ins):
            return f"cover_beats clip-insert at {b['tIn']} has no clip_inserts row"
    if not ins and not str(plan.get("clip_inserts_note", "")).strip():
        return "clip_inserts is empty and clip_inserts_note does not say why (clip inserts are considered on every video)"
    why = _whiteboard_check(plan, faces, duration, wb_share, card_pause)   # `faces` = the sorted FACE windows above
    if why:
        return why
    if face_mode == "screenshare":   # house rule #1b: the deck-area content of every screen share
        why = _face_body_check(plan, faces, duration)
        if why:
            return why
    elif plan.get("face_body"):
        return "face_body rows are only for FACE MODE = screenshare (this video is gated-face)"
    # CHAPTER THEMES (optional, Mike 2026-10-10): the per-chapter visual differential that mirrors the per-chapter beds.
    # {"CH1": {"accent": "#ffd700", "accent_name": "gold", "image_style": "...", "note": "..."}, ...}
    themes = plan.get("chapter_themes")
    if themes is not None:
        if not isinstance(themes, dict):
            return "chapter_themes must be an object keyed by chapter id (CH1, CH2 ...)"
        for ch, th in themes.items():
            if not re.match(r"^CH\d+$", str(ch)) or not isinstance(th, dict):
                return f"chapter_themes: bad entry {ch!r}"
            if not re.match(r"^#[0-9a-fA-F]{6}$", str(th.get("accent", ""))):
                return f"chapter_themes {ch}: accent must be a #rrggbb colour"
            if not str(th.get("image_style", "")).strip():
                return f"chapter_themes {ch}: image_style is required (the chapter's ChatGPT image look; 'house' for the persona default)"
    return None


def _insert_troughs(plan: dict, spine: Path):
    """Every clip insert's splice_at must snap into a silence trough on the SOURCE spine (bake_card_pauses.snap, the
    lint's own containment guard), checked at the PLAN gate so a bad boundary never reaches the build (every-job,
    2026-10-08: the point after 'Nvidia' had no 30 ms trough and was only found at bake time). Returns the bad ones."""
    ins = plan.get("clip_inserts") or []
    if not ins:
        return []
    if str(C.SCRIPTS) not in sys.path:
        sys.path.insert(0, str(C.SCRIPTS))
    from bake_card_pauses import snap  # noqa: E402
    bad = []
    for r in ins:
        t = float(r["splice_at"])
        at, where = snap(spine, t)
        if at is None:
            bad.append(f"{r.get('id')} @{t:.2f}s: {where}")
        else:
            print(f"[longform] coverage: {r.get('id')} splice {t:.2f}s -> trough {at:.3f}s ({where})", flush=True)
    return bad


def _face_body_prompt(proj: Path, faces) -> str:
    """The FACE BODY clause of the coverage prompt (screen-share face mode, house rule #1b)."""
    if C.face_mode(proj) != "screenshare":
        return ""
    return ("FACE MODE = SCREEN SHARE (Mike's per-video ruling; longform-edited.md house rule #1b; your definition, section "
            "'Screen-share face mode'): every FACE window above is Mike SHARING HIS SCREEN (webcam bottom-right, CTA box top-right, "
            "as recorded) and the comp PAINTS the deck area (x 0 to 1464 of 1920) with content WE choose, cued to his words. So the plan "
            "carries `face_body[]`: one row (or more, consecutive, never overlapping) per FACE window: id FB<n>, face (the window's "
            "ordinal), tIn / tOut INSIDE that window (final-spine seconds from the word JSON), cover_type one of "
            + " | ".join(FB_TYPES) + " (never envato-video, never chatgpt-image), `asset` = the id of a receipts[] / containers[] / "
            "whiteboards[] row (declare it there like any other asset; a whiteboard row also carries `from` = tIn minus the beat's "
            f"tIn), `state` where a container state applies, canvas '{FB_DECK_AREA}' (the comp scales the normal 1920x1080 stage into the "
            "deck area; no second canvas is built), spoken, what, notes. The screenplay's `BODY:` line on each [FACE] beat says what "
            "Mike planned there (AS-RECORDED tells you which beat each window is); keep it unless he dropped the line. A FACE window "
            "is never a cover_beats row and never a gap problem; every FACE window MUST have a face_body row (the graph checks). "
            f"The FACE windows are {[(round(a, 2), round(z, 2)) for a, z in (faces or [])]}.\n")


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
    wb_share = C.whiteboard_share(proj)
    card_pause = float(state.get("card_pause") or DEFAULT_CARD_PAUSE)
    if not (dest.is_file() and not _redo(state, node)):
        env_default, gpt_default = _default_budgets(duration)
        # an explicit 0 is a real value (quant, 2026-11-04: NO Envato, NO ChatGPT); only None falls back to the default
        envato_max = env_default if state.get("envato_max") is None else int(state["envato_max"])
        chatgpt_max = gpt_default if state.get("chatgpt_max") is None else int(state["chatgpt_max"])
        prompt = (f"Propose the COVER plan for the longform-edited project `{proj.name}` (folder `{proj}`).\n"
                  f"FINAL spine: `{fs}` ({duration:.2f}s, 30 fps). Word-level transcript (cue source): `{wj}`. "
                  f"AS-RECORDED (the as-built script; build to THIS): `{ar}`. DATA.md (every number + the CHART-SOURCE INDEX): "
                  f"`{C.doc(proj, 'data')}`. SCREENPLAY (the visual plan + SHOW cues): `{C.doc(proj, 'screenplay')}`. "
                  f"Rulings: `{C.doc(proj, 'project_log')}`.\n"
                  f"FACE windows (measured from the picture; do NOT cover them): {faces}. Everything else is black video and MUST "
                  f"be covered: consecutive cover_beats over every non-FACE second, no gap over 0.5 s, nothing past {duration:.2f}s.\n"
                  f"Budget: Envato video max {envato_max}, ChatGPT images max {chatgpt_max} for this {duration / 60:.1f}-minute video "
                  "(no asset used twice; each b-roll item is short punctuation, 4 s or less; receipts + code charts are budget-exempt and "
                  "still come first wherever the script needs a receipt or a chart). "
                  + (("Mike set BOTH b-roll budgets to ZERO for this video: NO envato-video and NO chatgpt-image rows at all "
                      "(envato_list and chatgpt_list are []); the cover layer is whiteboard beats, containers, diagrams, real / animated "
                      "charts and receipts. A receipt may be a SITE CAPTURE that the project log names for Seedance image-to-video motion "
                      "(a `motion` note on the row; 480p, 16:9, the still is the fallback); that is still a receipt, not a chatgpt-image. "
                      if (envato_max == 0 and chatgpt_max == 0) else ""))
                  + (f"Mike RAISED the b-roll budget for this video above the runtime default ({env_default} + {gpt_default}): he wants "
                     "MORE b-roll than usual, so place close to the max wherever a beat suits a clip or an image, and break long "
                     "container holds with b-roll cutaways. "
                     if (envato_max > env_default or chatgpt_max > gpt_default) else
                     (f"Mike LOWERED the b-roll budget for this video below the runtime default ({env_default} + {gpt_default}): "
                      "b-roll is sparse punctuation here, so containers, receipts, real charts and the FACE carry the video; a clip or "
                      "an image only where it earns its seconds, and the caps above are ceilings, not targets. "
                      if (envato_max < env_default or chatgpt_max < gpt_default) else
                      f"The budget is sized to the runtime ({ENVATO_PER_MIN:g} Envato + {CHATGPT_PER_MIN:g} ChatGPT a minute): use it "
                      "wherever a beat suits a clip or an image; containers still carry the explainer beats. "))
                  + "\n"
                  "CLIP INSERTS (considered on EVERY video, Mike 2026-10-09; rule video-creation/longform-edited/skills/clip-inserts/clip-inserts.md): "
                  "for every screenplay `[INSERT]` beat that AS-RECORDED marks `KEPT · INSERT CLIP-n`, emit a `clip_inserts[]` row (id CLIP-<n>, who, "
                  "says, source URL, start/end in the source as M:SS.s, seconds, `splice_at` = the END of the set-up line's LAST WORD on the final spine "
                  "from the word JSON, after_words, caption, expect, verify, beats) AND a zero-length cover_beats row at that point (tIn == tOut == "
                  "splice_at, cover_type 'clip-insert'); the clip plays with its OWN voice at a spine pause, never as a muted cover. The key is REQUIRED: "
                  "`[]` plus a one-line `clip_inserts_note` when the video has none. The graph dry-runs every splice_at against the silence-trough "
                  "snapper and halts the plan on a boundary with no trough.\n"
                  "WHITEBOARD BEATS (contract video-creation/skills/whiteboard-beat/whiteboard-beat.md; your agent definition, section "
                  "'Whiteboard beats'): every screenplay `WHITEBOARD WBn` [SHOW] line Mike recorded becomes a `whiteboards[]` row (id WB<n>, "
                  "chapter, tIn/tOut on the FINAL spine from the word JSON, 15 to 30 s, a MECHANISM or FLOW, self-contained; words = the "
                  "verbatim words in the window; scene = what is drawn, in what order, the payoff; cues = the draw-on events hung on his "
                  "words; numbers = every number drawn + its DATA.md row; do_not_draw; pen (the screenplay's, e.g. paper-pastel); canvas "
                  f"'{WB_CANVAS}'; comp '{_pascal(proj.name)}WB<n>'; out 'assets/whiteboard/WB<n>.mp4') AND cover_beats rows of cover_type "
                  "'whiteboard' with `asset` = the id over that window (split ONLY around a FACE window inside it). Whiteboard seconds are "
                  "budget-exempt (not Envato, not ChatGPT); no other cover overlaps a whiteboard window; no title or clip-insert pause "
                  "inside one. "
                  + (f"Mike's WHITEBOARD TARGET for this video: {wb_share[0]:.0%} to {wb_share[1]:.0%} of the delivered runtime "
                     f"(runtime = this {duration:.1f} s spine + every clip insert's length + {card_pause:g} s per title card; on the "
                     f"spine alone that is {wb_share[0] * duration:.0f} to {wb_share[1] * duration:.0f} s, more once the pauses are "
                     "counted): the graph holds the whiteboard ON-SCREEN seconds (the cover rows) to it in code. Put "
                     "`whiteboard_check` (total seconds, share of the runtime, the target) next to budget_check.\n"
                     if wb_share else "No whiteboard target is set for this video: use a beat only where the screenplay names one.\n")
                  + _face_body_prompt(proj, faces)
                  + "cover_type must be one of: receipt | real-chart | animated-chart | container | diagram | timeline | envato-video | "
                  "chatgpt-image | whiteboard | clip-insert (a chapter title card is a zero-length beat tIn == tOut with cover_type 'title', a clip insert a "
                  "zero-length beat with cover_type 'clip-insert'; both pauses are edit-time inserts). EVERY chatgpt_list row carries a `reference` key: a path under "
                  "schedule-tweets/images/reference/ when the image shows a real thing (token, logo, company, person, product), "
                  "else the exact string 'none exists (generic approved)'. An envato_list / chatgpt_list row that REUSES a file "
                  "already in assets/vid/ or assets/img/ keeps that file's number as `n` (reuse BR-4-... = n 4; never renumber "
                  "1..N, the id is BR-{n} / IMG-{n}). Chart IDs (C1, C2, C3 ...) and "
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
    why = _cover_plan_check(plan, faces, duration, wb_share, card_pause, face_mode=C.face_mode(proj))
    if why:
        return C._fail(state, node, f"COVER-PLAN.json failed verification: {why} (fix COVER-PLAN.json and resume; "
                                    "--redo coverage re-runs the strategist instead)")
    bad = _insert_troughs(plan, fs)
    if bad:
        return C._fail(state, node, "clip insert splice point(s) have no silence trough on the final spine: " + "; ".join(bad)
                       + " (move splice_at to a different sentence boundary in COVER-PLAN.json, e.g. the end of the previous or next "
                         "spoken line, and resume; never mid-word)")
    args = [sys.executable, "-u", str(RENDER_COVER_PLAN), str(proj)] + (["--force"] if _redo(state, node) else [])
    rc, out = C.run_streaming(args, state, node)
    if rc != 0:
        return C._fail(state, node, "render_cover_plan.py failed", out)
    for k in ("broll_plan", "edit_plan_prep"):
        ok, missing = C.doc_check(C.doc(proj, k), 400, [r"envato", r"chatgpt|image"] if k == "broll_plan" else [r"beat|layer"])
        if not ok:
            return C._fail(state, node, f"{C.DOCS[k]} not rendered acceptably ({', '.join(missing)})")
    n = len(plan.get("cover_beats") or [])
    n_ins = len(plan.get("clip_inserts") or [])
    n_wb = len(plan.get("whiteboards") or [])
    wb_s = sum(_wb_on_screen(plan).values())
    wb_note = (f", {n_wb} whiteboard beat(s) {wb_s:.0f}s = {wb_s / max(1e-6, _wb_runtime(plan, duration, card_pause)):.0%} of the runtime"
               if n_wb else "")
    return {"steps": C._step(state, node, "ran", f"COVER-PLAN.json ok ({n} cover beats, {n_ins} clip insert(s){wb_note}), BROLL-PLAN + EDIT-PLAN-prep rendered")}


LINT_DOCSET = C.SKILLS / "doc-reference" / "lint_docset.py"
DOCSET_RE = re.compile(r"^DOCSET-LINT (PASS|FAIL) stage=(\w+) fails=(\d+) warns=(\d+)", re.M)


def run_lint_docset(state, node, stage):
    proj = _proj(state)
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_DOCSET), str(proj), "--stage", stage], state, node)
    m = DOCSET_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (int(m.group(4)) if m else 0), out



MUSIC_LIB = C.REPO_ROOT / "video-creation" / "assets" / "music" / "library.json"
# The VARIETY ledger (Mike, 2026-10-01): which music + transitions every delivered video used, so the next one
# picks something else. report = what the strategists read; check = the gate here; record = stage_longform.
USAGE_LEDGER = C.REPO_ROOT / "video-creation" / "skills" / "usage-ledger" / "usage_ledger.py"
USAGE_LINT_RE = re.compile(r"^USAGE-LINT (PASS|FAIL) what=(\w+) fails=(\d+) warns=(\d+)", re.M)


def _usage_prompt(proj: Path, what: str) -> str:
    return (f"VARIETY RULE (the graph verifies it from disk with usage_ledger.py check): FIRST run "
            f"`python video-creation/skills/usage-ledger/usage_ledger.py report --what {what} --exclude-project \"{proj.name}\"` "
            "and pick against it. Anything it marks BLOCKED (the previous video used it) is off the table unless "
            f"`{C.doc(proj, 'project_log')}` records Mike waiving it (then add a top-level `usage_waivers` object naming it). "
            "Avoid what the last three videos used. Among the options that FIT the beat, prefer `fresh` (never used), then "
            "the least recently used. Fit comes first: never pick a wrong-mood option only because it is unused.\n")


def _usage_check(state, node, proj: Path, what: str):
    """usage_ledger.py check: FAIL when the plan repeats the previous video in a rotating pool / slot with no waiver."""
    if not USAGE_LEDGER.is_file():
        return True, "usage ledger tool missing (variety not checked)"
    rc, out = C.run_streaming([sys.executable, "-u", str(USAGE_LEDGER), "check", "--project", str(proj), "--what", what], state, node)
    m = USAGE_LINT_RE.search(out or "")
    return bool(rc == 0 and m and m.group(1) == "PASS"), (f"variety {m.group(1)} ({m.group(3)} fails, {m.group(4)} warns)" if m else "no USAGE-LINT line")
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
        if cover == "loop" and avail + 0.25 < (z - a):
            # REMIX LOOP (Mike, 2026-10-06): a looping bed names a bar-aligned region; the mixer repeats it with aloop.
            li, lo = b.get("loop_in_sec", b.get("loop_point_sec")), b.get("loop_out_sec")
            try:
                li, lo = float(li), float(lo)
            except (TypeError, ValueError):
                return (f"{cid} bed loops but names no loop region: give loop_in_sec and loop_out_sec on the beat grid, inside one "
                        "steady section (music.md section LOOP, Mike 2026-10-06); a whole-file restart is not a loop")
            if not (0.0 <= li < lo <= file_len + 0.05) or (lo - li) < 1.0:
                return f"{cid} bed loop region {li:.3f}-{lo:.3f}s is not inside {src.name} ({file_len:.1f}s) or is under 1 s"
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
                  "MUST have cover 'loop' with a REMIX loop region: `loop_in_sec` and `loop_out_sec` on the beat grid, a whole "
                  "number of bars apart inside one steady section, never a whole-file restart (music.md section LOOP); "
                  "`level_db_under_vo` between -24 and -12; no em dashes anywhere. "
                  "Prefer the instrumental variant under VO. Right-align the final bed so its ending lands on the last spoken word "
                  "when the screenplay asks for it, and state the exact source_in that achieves it.\n"
                  + _usage_prompt(proj, "music") +
                  "The screenplay's shortlist was written before this report existed: if a shortlisted track is BLOCKED or was "
                  "used in the last three videos, replace it with a fresh track of the same role and say so in open_questions.\n"
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
    v_ok, v_msg = _usage_check(state, node, proj, "music")
    if not v_ok:
        return C._fail(state, node, "MUSIC-PLAN.json repeats the previous video's music (see the USAGE FAIL lines above): pick other "
                                    "tracks (--redo music_plan re-runs the strategist), or record Mike's waiver as `usage_waivers` in the plan")
    ok, warns, out = run_lint_docset(state, node, "plan")
    if not ok:
        return C._fail(state, node, "plan-stage document set incomplete (see FAIL lines above)", out)
    n = len(plan["beds"])
    return {"steps": C._step(state, node, "ran", f"MUSIC-PLAN.json ok ({n} beds over {len(chapters)} chapters), {v_msg}, plan-stage docset PASS")}


def gate_plan(state):
    proj = _proj(state)
    return C.gate(state, "plan", "the cover plan, the music plan and the BROLL-PLAN worklists",
                  _with_clips(proj, [C.doc(proj, "cover_plan"), C.doc(proj, "music_plan"), C.doc(proj, "broll_plan")]))


# ── Wave D node 1+2 (2026-09-28): the ASSET FACTORY fan-out + the reconcile gate ─────────────
# The five builder agents (slide-builder · chart-builder · receipt-capturer · envato-sourcer ·
# image-gen) run IN PARALLEL: each owns a different browser (headless Chromium ×3, the dedicated
# envato-profile, the dedicated chatgpt-profile), so nothing collides. Every builder gets ONLY the
# ids that are still missing on disk (idempotent re-drives; `--redo assets` rebuilds everything),
# writes to the FIXED comp-build §10 folders, and the node verifies FROM DISK. Then `visual-qa`
# opens every asset once and its JSON verdict is persisted; `verify_assets` is the pure-code
# reconcile (zero orphans, no byte-duplicate b-roll, audio stripped, visual-qa clean).

ASSET_FOLDERS = {
    "envato": "vid", "chatgpt": "img", "receipt": "receipts", "clip-insert": "clip-inserts",
    "chart": "charts", "diagram": "diagrams", "title": "title-slides", "card": "card-slides",
    "whiteboard": "whiteboard",
}
BUILDER_OF = {
    "envato": "envato-sourcer", "chatgpt": "image-gen", "receipt": "receipt-capturer", "clip-insert": "receipt-capturer",
    "chart": "chart-builder", "diagram": "chart-builder", "title": "slide-builder", "card": "slide-builder",
    "whiteboard": "whiteboard-builder",   # NOT in the parallel fan-out: the whiteboard lane (_whiteboard_lane) drives it
}
# the whiteboard lane's render (whiteboard-beat.md, clip row): the minimal public dir. Work dirs stay on C:, never D:
# (D: is a removable drive, often unplugged; Mike, 2026-11-08)
CHUNKED_RENDER = C.REPO_ROOT / "video-creation" / "skills" / "chunked-render" / "chunked_render.py"
WB_PUBLIC_DIR = C.REPO_ROOT / "video-creation" / "whiteboard" / "demo" / "pub"
WB_BEATS_DIR = C.REPO_ROOT / "video-creation" / "remotion" / "src" / "whiteboard" / "beats"
ROOT_TSX = C.REPO_ROOT / "video-creation" / "remotion" / "src" / "Root.tsx"
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
    for ci in plan.get("clip_inserts") or []:   # a third-party clip with its OWN voice (skills/clip-inserts)
        exp.append({"id": str(ci.get("id")), "kind": "clip-insert", "folder": ASSET_FOLDERS["clip-insert"],
                    "spec": f"CLIP INSERT (own voice, audio KEPT, caption burned): {ci.get('who', '')} says "
                            f"{str(ci.get('says', ''))[:160]}; source {ci.get('source')} {ci.get('start')}-{ci.get('end')} "
                            f"({ci.get('seconds')}s); caption: {ci.get('caption')}"
                            f"{'; expect: ' + str(ci.get('expect')) if ci.get('expect') else ''}"})
    for c in plan.get("containers") or []:
        k = _container_kind(c)
        exp.append({"id": str(c.get("id")), "kind": k, "folder": ASSET_FOLDERS[k],
                    "spec": f"{c.get('kind')} container: {c.get('shows')}; beats {', '.join(c.get('beats') or [])}"})
    for w in plan.get("whiteboards") or []:   # a hand-drawn beat rendered to assets/whiteboard/<id>.mp4 (whiteboard-beat.md)
        exp.append({"id": str(w.get("id")), "kind": "whiteboard", "folder": ASSET_FOLDERS["whiteboard"], "row": w,
                    "spec": f"WHITEBOARD beat {w.get('id')} ({w.get('pen')} pen, {w.get('canvas')}, "
                            f"{float(w.get('tOut') or 0) - float(w.get('tIn') or 0):.1f}s): {str(w.get('scene', ''))[:300]}. A video "
                            "slot's .mid.png of a whiteboard beat is MID-DRAW: a partly drawn hand-drawn scene on paper is expected; "
                            "judge legibility, the pen, nothing clipped or overlapping, numbers as planned"})
    # A planned chapter TITLE beat is a renderable even when no container row names it (retire-early, 2026-10-10: four
    # title beats, no title containers, and the factory never built the cards). Deduped by id AND by chapter.
    have_ids = {e["id"] for e in exp}
    have_ch = {str(bt).split("@")[0].replace(" ", "") for c in plan.get("containers") or [] if _container_kind(c) == "title"
               for bt in (c.get("beats") or [])}
    for b in plan.get("cover_beats") or []:
        if str(b.get("cover_type", "")).lower() != "title":
            continue
        ch = str(b.get("chapter", "")).replace(" ", "")
        cid = str(b.get("asset") or f"title-{ch}")
        if cid in have_ids or ch in have_ch:
            continue
        have_ids.add(cid)
        have_ch.add(ch)
        exp.append({"id": cid, "kind": "title", "folder": ASSET_FOLDERS["title"],
                    "spec": f"{b.get('what') or 'TITLE CARD'} (chapter title slide, the locked title-slide style, the chapter accent "
                            f"per chapter_themes when present); beat {ch}@{b.get('tIn')}"})
    return exp


def _qa_path_exists(proj: Path, raw: str) -> bool:
    """visual-qa writes paths absolute OR relative to the project folder OR to the repo root; test all three."""
    p = Path(str(raw))
    if p.is_absolute():
        return p.is_file()
    return (proj / p).is_file() or (C.REPO_ROOT / p).is_file() or p.is_file()


def _qa_stem(path) -> str:
    """The asset file stem a visual-qa verdict path names: a video is judged by its `<stem>.mid.png` frame, an image by
    itself (`<stem>.png`). Matching the raw name dropped image verdicts (only-18 short 2026-10-27: a Dell-logo FAIL was ignored)."""
    name = Path(str(path)).name
    return name[: -len(".mid.png")] if name.endswith(".mid.png") else Path(name).stem


def _qa_names_id(stem: str, ident: str) -> bool:
    return stem == ident or stem.startswith(ident + "-") or stem.startswith(ident + "_")


def _reject_qa_fails(fails: list, files: list, rej: Path) -> list:
    """Move every asset file whose visual-qa verdict is a FAIL into `rej` (`files` = (file, shown) pairs; a video is judged by
    its .mid.png), so the run's re-drive rebuilds ONLY that gap with the verdict as the builder's feedback. Left in place, the
    supervisor's automatic re-drive found every file present, re-judged the same file and failed identically: the retry was a
    no-op and the run sat failed overnight (inference vertical + only-18 short, 2026-10-27). Returns the moved file names."""
    bad = {Path(str(a.get("path", ""))).name for a in fails}
    moved = []
    for f, shown in files:
        if Path(shown).name in bad and f.is_file():
            rej.mkdir(parents=True, exist_ok=True)
            dest = rej / f.name
            n = 1
            while dest.exists():
                n += 1
                dest = rej / f"{f.stem}.try{n}{f.suffix}"
            shutil.move(str(f), str(dest))
            moved.append(f.name)
    return moved


def _asset_files(proj: Path, e: dict, base: Optional[Path] = None):
    """Files on disk for one expectation: <folder>/<id>.<ext> or <folder>/<id>-*.<ext> (states, slugs).
    `base` overrides the asset root (the vertical lane reads assets/vertical/)."""
    d = (base or (proj / "assets")) / e["folder"]
    if not d.is_dir():
        return []
    # a ChatGPT still may also carry its MOTION version (Higgsfield/Seedance image-to-video, e.g. IMG-5-<slug>-slowmo.mp4,
    # Mike 2026-10-16): it belongs to the same id, so it is claimed (and audio/duplicate-checked) instead of an orphan
    exts = VIDEO_EXT if e["kind"] in ("envato", "clip-insert", "whiteboard") else (VIDEO_EXT + IMAGE_EXT if e["kind"] in ("receipt", "chatgpt") else IMAGE_EXT)
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
            stem = _qa_stem(name)
            if _qa_names_id(stem, e["id"]) and str(a.get("verdict", "")).upper() != "PASS":
                lines.append(f"- {stem}: " + "; ".join(a.get("defects") or [])[:500] + f" -> FIX: {str(a.get('fix', ''))[:400]}")
    if not lines:
        return ""
    return ("\nYour EARLIER build of these ids FAILED visual-qa. The failing files were moved aside; rebuild them with these defects "
            "fixed (this is the whole point of the rebuild):\n" + "\n".join(lines))


def _container_theme_prompt(proj: Path) -> str:
    """The per-video CONTAINER THEME clause for the builders and visual-qa (GRAPH-PROGRESS.json settings.container_theme)."""
    if C.container_theme(proj) != "light":
        return ""
    return ("CONTAINER THEME = LIGHT (Mike's per-video ruling, GRAPH-PROGRESS.json settings.container_theme; README section "
            "'LIGHT THEME'): every CSS container, system-design diagram and animated-chart state is built on the locked "
            "stylesheet PLUS `video-creation/longform-edited/skills/container-reference/container-canonical-light.css` loaded "
            "right after it (warm off-white page, white cards with a hairline border, near-black text, the darkened accents, "
            "glows become tinted rings, SVG glow filters dropped, grid/axis/wire tokens from that file). Same anatomy, type, "
            "sizes and rules; only the palette. A white / off-white frame is the INTENDED look for this video, not a failed "
            "capture; palette drift is judged against the LIGHT tokens. Receipts and real marks keep their real pixels.\n"
            + _container_accent_prompt(proj))


def _container_accent_prompt(proj: Path) -> str:
    """The per-video ACCENT stylesheet clause (GRAPH-PROGRESS.json settings.container_accent): a third file loaded after the
    theme file that re-maps only the accent / text / page tokens to a brand palette (Mike 2026-11-04, quant)."""
    css = C.container_accent_css(proj)
    if not css:
        return ""
    return (f"CONTAINER ACCENT = `{C.container_accent(proj)}` (Mike's per-video ruling, GRAPH-PROGRESS.json settings.container_accent): "
            f"load `{css}` as a THIRD stylesheet right after the light file. It re-maps ONLY the page / card / text / accent tokens "
            "(read the file: the page and the accent colours, the --acc-rgb ring tint, the chart accent); every other rule, the "
            "anatomy, the type and the sizes stay the locked stylesheet's. Palette drift is judged against THAT file's tokens.\n")


def _builder_prompt(builder: str, proj: Path, fs: Path, todo: list, done: list, prev: Optional[dict] = None) -> str:
    plan_p, broll_p = C.doc(proj, "cover_plan"), C.doc(proj, "broll_plan")
    themes = {}
    try:
        themes = json.loads(plan_p.read_text(encoding="utf-8")).get("chapter_themes") or {}
    except Exception:
        themes = {}
    common = (f"Project `{proj.name}`, folder `{proj}`. Worklists: `{broll_p}` (your table) and the source of truth "
              f"`{plan_p}` (per-slot notes, spoken lines, bench). Numbers + phrasing guards: `{C.doc(proj, 'data')}`. "
              f"As-built script with timecodes: `{C.doc(proj, 'as_recorded')}`. FINAL spine: `{fs}`.\n"
              + (("CHAPTER THEMES (Mike, 2026-10-10: every chapter has its own visual differential, mirroring its music bed; "
                  "COVER-PLAN.json `chapter_themes`, printed at the top of the BROLL-PLAN): " + json.dumps(themes, ensure_ascii=False)
                  + ". A chart / slide / container built for a chapter uses THAT chapter's accent as its lit colour (the locked stylesheet "
                  "otherwise unchanged; receipts and real marks keep their real pixels); a ChatGPT image built for a chapter uses THAT "
                  "chapter's image_style ('house' = the persona look). Read the row's beat (CHn@...) to know its chapter.\n")
                 if themes else "")
              + _container_theme_prompt(proj)
              + f"Build ONLY these ids (everything else on disk is done, leave it alone): "
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
                     "style from persona.json image_generation, UNLESS COVER-PLAN.json carries an `image_style` (a per-video ruling by Mike, "
                     "printed at the top of the BROLL-PLAN ChatGPT table): then that style replaces the house look for every row. "
                     "A row with a Reference path is generated FROM that reference image "
                     "(the real mark, e.g. the Kaspa backwards-K in greenish cyan, never gold); a row with 'none exists (generic "
                     "approved)' is generic. Every image unique.",
    }
    if builder == "receipt-capturer" and any(e["kind"] == "clip-insert" for e in todo):
        extra["receipt-capturer"] += (
            "\nCLIP INSERTS (the CLIP-<n> ids above -> assets/clip-inserts/; rule video-creation/longform-edited/skills/clip-inserts/"
            "clip-inserts.md): a third-party clip that plays with its OWN VOICE while Mike's spine pauses. Capture each with the canonical tool, "
            "never by hand: `python video-creation/longform-edited/skills/clip-inserts/capture_clip_insert.py --url <source> --start <M:SS.s> "
            "--end <M:SS.s> --out <project>/assets/clip-inserts/<id>-<slug>.mp4 --caption \"<the plan's caption>\" --expect \"<the plan's expect "
            "phrase>\"`. The AUDIO IS KEPT (a muted clip insert is a FAIL; the strip-audio rule is for screen recordings only), the caption is "
            "burned on every frame, 1920x1080 at 30 fps, and Whisper must hear the expected words (the tool prints them: quote them in your "
            "report). FLAG a clip whose heard words differ from the plan or whose source is gone; never trim a clip into a different meaning.")
    return common + extra.get(builder, "") + _qa_feedback(prev or {}, todo)


def _mid_frame(video: Path, dest: Path) -> Optional[Path]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    d = _duration(video) or 0.0
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{d / 2:.3f}", "-i", str(video), "-frames:v", "1", str(dest)],
                       capture_output=True, text=True)
    return dest if r.returncode == 0 and dest.is_file() else None


# ── the WHITEBOARD lane (video-creation/skills/whiteboard-beat/whiteboard-beat.md, procedure steps 2-4) ──────────────
# Runs BESIDE the five-builder fan-out (its own thread) but its beats run ONE AT A TIME: every whiteboard-builder edits
# the shared kit (remotion/src/whiteboard/*.tsx) and Root.tsx and bundles Remotion for its stills, so two at once would
# collide. Per beat: the brief (written from COVER-PLAN `whiteboards[]`) -> whiteboard-builder (scene comp + still QA)
# -> visual-qa on its stills (one rebuild round with the defects) -> chunked-render to assets/whiteboard/<id>.mp4 ->
# verified from disk (frame count == the window, no audio). The common visual-qa pass then opens the clip's mid frame.

def _wb_frames(video: Path) -> Optional[int]:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                        "stream=nb_read_packets", "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    try:
        return int((r.stdout or "").strip().splitlines()[0])
    except (ValueError, IndexError):
        return None


def _wb_window_frames(row: dict) -> int:
    return int(round((float(row["tOut"]) - float(row["tIn"])) * WB_FPS))


def _ar_face_windows(proj: Path) -> list:
    """FACE windows from AS-RECORDED.md (the same table the coverage node reads)."""
    ar = C.doc(proj, "as_recorded")
    if not ar.is_file():
        return []
    return [(float(m.group(1)), float(m.group(2))) for m in
            re.finditer(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", ar.read_text(encoding="utf-8"), re.M)]


def _wb_words(wj: Optional[Path], a: float, z: float) -> list:
    """[(spine_s, word)] spoken inside [a, z] from the final spine's Whisper words JSON."""
    try:
        segs = json.loads(Path(wj).read_text(encoding="utf-8")).get("segments", [])
    except Exception:
        return []
    out = []
    for s in segs:
        for w in s.get("words") or []:
            t = float(w.get("start", -1))
            if a - 0.05 <= t <= z + 0.05:
                out.append((t, str(w.get("word", w.get("text", ""))).strip()))
    return out


def _wb_registered(comp: str) -> bool:
    try:
        root = ROOT_TSX.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return False
    return f'id="{comp}"' in root or f"id='{comp}'" in root or f"id={{'{comp}'}}" in root


def _wb_sha(path: Path) -> Optional[str]:
    import hashlib
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16] if path.is_file() else None


def _wb_stills(qa_dir: Path) -> list:
    return sorted(p for p in qa_dir.glob("*.png") if p.is_file()) if qa_dir.is_dir() else []


def _wb_brief(proj: Path, row: dict, wj: Optional[Path], plan: dict) -> Path:
    """whiteboard-beat.md procedure step 2: the brief, beside the clip (regenerated from COVER-PLAN every run)."""
    wid, a, z = str(row["id"]), float(row["tIn"]), float(row["tOut"])
    dest = proj / "assets" / "whiteboard" / f"{wid}.brief.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    faces_in = [(fa, fz) for fa, fz in _ar_face_windows(proj) if fa < z and fz > a]
    ch = str(row.get("chapter") or "")
    theme = (plan.get("chapter_themes") or {}).get(ch) or {}
    cues = row.get("cues") or []
    L = [f"# {wid} whiteboard beat brief ({proj.name})", "",
         "_Written by the longform graph's `assets` node from COVER-PLAN.json `whiteboards[]` (whiteboard-beat.md procedure step 2). "
         "Regenerated on every run: change COVER-PLAN.json, never this file._", "",
         f"- **Window on the FINAL spine:** in {a:.3f} s, out {z:.3f} s = {z - a:.3f} s = {_wb_window_frames(row)} frames at {WB_FPS} fps. "
         f"LOCAL time 0 = {a:.3f} s on the spine; every cue is local seconds.",
         f"- **Comp id:** `{row['comp']}` -> `video-creation/remotion/src/whiteboard/beats/{row['comp']}.tsx` (FPS {WB_FPS}, DUR "
         f"{_wb_window_frames(row)}), registered in `Root.tsx` at {WB_CANVAS}, no audio.",
         f"- **Pen:** `{row['pen']}` · **Canvas:** {WB_CANVAS} (longform-edited: the full frame).",
         f"- **Chapter:** {ch or '?'}" + (f" · accent {theme.get('accent')} ({theme.get('accent_name', '')}) for the ONE highlight mark "
                                         "of the beat; the pen is otherwise unchanged" if theme.get("accent") else ""),
         f"- **Fact source:** `{C.doc(proj, 'data')}`. Numbers allowed on screen: "
         + (", ".join(str(n) for n in row.get("numbers") or []) or "NONE (labels are words only)") + ".",
         f"- **Do not draw:** {row.get('do_not_draw') or '(nothing named; still obey DATA.md do-not-air)'}",
         "- **FACE interruptions inside the window:** "
         + ("; ".join(f"{fa:.2f}-{fz:.2f} s (local {fa - a:.2f}-{fz - a:.2f}): the clip keeps running under Mike's face, so draw "
                      "nothing new there; the cover returns on the next word" for fa, fz in faces_in) if faces_in else "none") + ".",
         f"- **Screenplay line:** {row.get('screenplay') or '(see SCREENPLAY.md WHITEBOARD lines)'}", "",
         "## The scene (what is drawn, in what order, the payoff)", "", str(row.get("scene", "")).strip(), ""]
    if cues:
        L += ["## Draw-on cues the plan proposes (re-derive every time from the word timings below)", ""]
        for c in cues:
            L.append(f"- {json.dumps(c, ensure_ascii=False) if isinstance(c, dict) else c}")
        L.append("")
    L += ["## The words in the window (verbatim)", "", f"> {str(row.get('words', '')).strip()}", "",
          "| local s | spine s | word |", "|---|---|---|"]
    for t, w in _wb_words(wj, a, z):
        L.append(f"| {t - a:.2f} | {t:.2f} | {w} |")
    dest.write_text("\n".join(L).replace("\u2014", ", ") + "\n", encoding="utf-8", newline="\n")
    return dest


def _wb_stills_qa(state, node, proj: Path, row: dict, stills: list, qa_dir: Path, sha: Optional[str]) -> dict:
    """visual-qa on the builder's stills BEFORE the render (cheap); the verdict is kept with the comp file's hash so an
    unchanged comp is never re-judged and a changed one always is."""
    wid = str(row["id"])
    new_dest = qa_dir / "VISUAL-QA.new.json"
    new_dest.unlink(missing_ok=True)
    prompt = (f"Visual QA of whiteboard beat {wid} for the longform-edited project `{proj.name}` (folder `{proj}`): STILLS from its "
              f"Remotion scene `{row['comp']}`, BEFORE the clip is rendered. The contract is `video-creation/skills/whiteboard-beat/"
              "whiteboard-beat.md` (its Lessons section lists the defects a builder stops seeing) and `video-creation/whiteboard/"
              f"whiteboard.md`. Pen `{row['pen']}` (paper-pastel = paper + pencil-pastel strokes; neon-ink = black + gold glow), canvas "
              f"{WB_CANVAS}, the brief `{proj / 'assets' / 'whiteboard' / (wid + '.brief.md')}`. Open EVERY still and check: "
              "every label fully inside the canvas with margin; nothing overlapping; two words never read as one (word gaps); "
              "decimals legible; the ONLY numbers on screen are "
              + (", ".join(str(n) for n in row.get("numbers") or []) or "none") +
              " (from DATA.md); no em dash; each object reads as what it is; draw order sane (no shadow or label before its object); "
              "the pen correct. Stills (the beat draws on, so early frames are partly drawn by design):\n"
              + "\n".join(f"- `{s}`" for s in stills)
              + f"\nReturn your JSON verdict ({{\"assets\": [{{\"path\", \"verdict\": \"PASS|FAIL\", \"defects\": [], \"fix\": \"\"}}]}}) "
                f"AND save it to EXACTLY `{new_dest}` with Bash (a quoted heredoc). Every still listed must appear with PASS or FAIL.")
    rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-assets-wb-qa-{wid}-{proj.name}.log")
    if not C.persist_agent_json(out, new_dest, want_key="assets"):
        return {"comp_sha": sha, "pass": False, "defects": [f"visual-qa returned no usable verdict (rc {rc})"], "assets": []}
    got = json.loads(new_dest.read_text(encoding="utf-8")).get("assets", [])
    new_dest.unlink(missing_ok=True)
    by = {Path(str(x.get("path", ""))).name: x for x in got}
    defects = []
    for s in stills:
        v = by.get(s.name)
        if v is None:
            defects.append(f"{s.name}: never opened by visual-qa")
        elif str(v.get("verdict", "")).upper() != "PASS":
            defects.append(f"{s.name}: " + "; ".join(v.get("defects") or [])[:400] + f" -> FIX: {str(v.get('fix', ''))[:300]}")
    verdict = {"comp_sha": sha, "pass": not defects, "defects": defects, "assets": got, "at": C._now_iso()}
    C._write_json_atomic(qa_dir / "VISUAL-QA.json", verdict)
    return verdict


def _wb_builder_prompt(proj: Path, row: dict, brief: Path, wj: Optional[Path], qa_dir: Path, feedback: str) -> str:
    wid, comp = str(row["id"]), str(row["comp"])
    return (f"Build whiteboard beat {wid} for the longform-edited project `{proj.name}` (folder `{proj}`), exactly per "
            "`video-creation/skills/whiteboard-beat/whiteboard-beat.md` and your agent definition (read both first).\n"
            f"Brief (the window, the scene, the numbers allowed, the do-not-draw, the words with their times): `{brief}`. Word timings "
            f"(the FINAL spine's Whisper words JSON, the cue source): `{wj}`; the beat is {float(row['tIn']):.3f}-{float(row['tOut']):.3f} s "
            f"on that spine (local 0 = {float(row['tIn']):.3f}). Fact source: `{C.doc(proj, 'data')}`.\n"
            f"Comp id EXACTLY `{comp}`: write `video-creation/remotion/src/whiteboard/beats/{comp}.tsx` (export the component, FPS = "
            f"{WB_FPS}, DUR = {_wb_window_frames(row)}) and register it in `video-creation/remotion/src/Root.tsx` as "
            f"`<Composition id=\"{comp}\" ... width={{1920}} height={{1080}} />`. Pen `{row['pen']}`, canvas {WB_CANVAS} (the full frame).\n"
            f"QA stills: at least 6 frames (`npx remotion still`, bundle / work dirs on C: (%TEMP%), NEVER D:, public dir video-creation/whiteboard/demo/pub) "
            f"written into `{qa_dir}` as `{wid}-f<frame>.png`, never into assets/. Write your CUES table (local s, spine s, the word, "
            f"what draws) to `{proj / 'assets' / 'whiteboard' / (wid + '.cues.md')}` (the edit-plan author hangs the draw-on SFX on it).\n"
            "Do NOT render the clip (the graph renders it through chunked-render once visual-qa clears your stills). Other whiteboard "
            "beats of this video may already exist in remotion/src/whiteboard/beats/: reuse their kit objects, never edit their scene "
            "files. Never touch the spine, the transcript or a project document. Return the report your agent definition specifies."
            + feedback)


def _whiteboard_lane(state, node, proj: Path, todo: list, prev: dict, wj: Optional[Path], plan: dict) -> list:
    """Build, QA and render every whiteboard id in `todo`, one at a time. Returns the problems (empty = all rendered)."""
    problems = []
    redo = _redo(state, node)
    env_extra = {}
    for e in todo:
        row, wid = e["row"], e["id"]
        comp = str(row["comp"])
        comp_file = WB_BEATS_DIR / f"{comp}.tsx"
        qa_dir = proj / "_previews" / "qa" / "whiteboard" / wid
        qa_dir.mkdir(parents=True, exist_ok=True)
        out = proj / "assets" / "whiteboard" / f"{wid}.mp4"
        brief = _wb_brief(proj, row, wj, plan)
        feedback = _qa_feedback(prev, [e])          # the rendered clip failed the common visual-qa pass and was moved aside
        rebuild = redo or bool(feedback)
        verdict = None
        for rnd in (1, 2):
            sha = _wb_sha(comp_file)
            if not rebuild and sha and _wb_registered(comp):
                try:
                    v = json.loads((qa_dir / "VISUAL-QA.json").read_text(encoding="utf-8"))
                    verdict = v if v.get("comp_sha") == sha else None
                except Exception:
                    verdict = None
            if rebuild or not sha or not _wb_registered(comp) or not _wb_stills(qa_dir) or (verdict and not verdict.get("pass")):
                if verdict and not verdict.get("pass"):
                    feedback += ("\nYour previous build of this beat FAILED visual-qa on its stills; fix exactly these and re-shoot "
                                 "the stills:\n" + "\n".join(f"- {d}" for d in verdict.get("defects") or []))
                old = _wb_stills(qa_dir)
                if old:
                    aside = qa_dir / f"_old-{_wb_stamp()}"
                    aside.mkdir(parents=True, exist_ok=True)
                    for s in old:
                        shutil.move(str(s), str(aside / s.name))
                rc, txt = C.spawn_agent(state, node, "whiteboard-builder", _wb_builder_prompt(proj, row, brief, wj, qa_dir, feedback),
                                        f"agent-assets-whiteboard-{wid}-{proj.name}.log")
                print(f"[longform] {node}: whiteboard-builder {wid} exit {rc}", flush=True)
                rebuild, verdict, feedback = False, None, ""
                sha = _wb_sha(comp_file)
                if not sha or not _wb_registered(comp):
                    problems.append(f"{wid}: the builder left no registered comp {comp} ({comp_file.name} / Root.tsx)")
                    break
                if len(_wb_stills(qa_dir)) < 3:
                    problems.append(f"{wid}: the builder wrote {len(_wb_stills(qa_dir))} QA still(s) into {qa_dir} (at least 3 needed)")
                    break
            if verdict is None:
                print(f"[longform] {node}: visual-qa on {wid}'s {len(_wb_stills(qa_dir))} still(s)", flush=True)
                verdict = _wb_stills_qa(state, node, proj, row, _wb_stills(qa_dir), qa_dir, sha)
            if verdict.get("pass"):
                break
            if rnd == 2:
                problems.append(f"{wid}: stills still FAIL visual-qa after one rebuild: " + " | ".join(verdict.get("defects") or [])[:500])
        if not (verdict and verdict.get("pass")):
            if not any(p.startswith(wid + ":") for p in problems):
                problems.append(f"{wid}: no visual-qa PASS on its stills")
            continue
        want = _wb_window_frames(row)
        args = [sys.executable, "-u", str(CHUNKED_RENDER), "--comp", comp, "--out", str(out), "--public-dir", str(WB_PUBLIC_DIR),
                "--crf", "18", "--no-audio", "--label", f"{proj.name}-wb-{wid}"]
        print(f"[longform] {node}: rendering {wid} ({comp}, {want} frames) -> {out}", flush=True)
        rc, txt = C.run_streaming(args, state, node, env_extra=env_extra)
        if rc != 0 or not out.is_file():
            problems.append(f"{wid}: chunked-render failed (rc {rc}; a re-drive resumes its chunks)")
            continue
        got = _wb_frames(out)
        if got is None or abs(got - want) > 1:
            problems.append(f"{wid}: rendered {got} frames, the window is {want} ({comp}'s DUR must be round((out - in) * {WB_FPS}))")
            rej = proj / "_previews" / "qa" / "rejected"
            rej.mkdir(parents=True, exist_ok=True)
            shutil.move(str(out), str(rej / f"{out.stem}.frames{got}{out.suffix}"))
            continue
        C._write_json_atomic(qa_dir / "render.json", {"comp": comp, "comp_sha": _wb_sha(comp_file), "frames": got,
                                                      "out": str(out), "at": C._now_iso()})
    return problems


def _wb_stamp() -> str:
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d-%H%M%S")


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
        # a partially rejected id (a FAILED state/crop file moved aside for rebuild while a sibling file remains) rebuilds too
        have_stems = {f.stem for f in have}
        gone = any(str(a.get("verdict", "")).upper() != "PASS" and _qa_names_id(_qa_stem(a.get("path", "")), e["id"])
                   and _qa_stem(a.get("path", "")) not in have_stems for a in prev.values())
        need = redo or not have or gone
        b = BUILDER_OF[e["kind"]]
        jobs.setdefault(b, {"todo": [], "done": []})
        (jobs[b]["todo"] if need else jobs[b]["done"]).append(e if need else e["id"])
    dispatch = {b: j for b, j in jobs.items() if j["todo"]}
    # the WHITEBOARD lane runs beside the five builders (its own thread), its beats one at a time (_whiteboard_lane)
    wb_job = dispatch.pop("whiteboard-builder", None)
    wb_problems = []
    if dispatch or wb_job:
        specs = [(b, _builder_prompt(b, proj, fs, j["todo"], j["done"], prev), f"agent-assets-{b}-{proj.name}.log")
                 for b, j in dispatch.items()]
        print(f"[longform] {node}: dispatching {len(specs)} builder(s) in parallel: "
              + ", ".join(f"{b} ({len(dispatch[b]['todo'])} id(s))" for b in dispatch)
              + (f"{' + ' if specs else ''}the whiteboard lane ({len(wb_job['todo'])} beat(s), one at a time)" if wb_job else ""),
              flush=True)
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=2) as ex:
            f_b = ex.submit(C.spawn_agents_parallel, state, node, specs) if specs else None
            f_w = ex.submit(_whiteboard_lane, state, node, proj, wb_job["todo"], prev, C.words_json(proj, scope), plan) if wb_job else None
            results = f_b.result() if f_b else {}
            wb_problems = f_w.result() if f_w else []
        for b, (rc, out) in results.items():
            print(f"[longform] {node}: {b} exit {rc}", flush=True)
        for p in wb_problems:
            print(f"[longform] {node}: whiteboard lane: {p}", flush=True)
        if wb_job:   # report the lane in the dispatch count below
            dispatch["whiteboard-builder"] = wb_job
    else:
        print(f"[longform] {node}: every asset already on disk; skipping the builders", flush=True)
    missing = [e for e in exp if not _asset_files(proj, e)]
    if missing:
        by_b = {}
        for e in missing:
            by_b.setdefault(BUILDER_OF[e["kind"]], []).append(e["id"])
        return C._fail(state, node, "assets still missing after the builders ran: "
                       + "; ".join(f"{b}: {', '.join(ids)}" for b, ids in by_b.items())
                       + (" | whiteboard lane: " + " | ".join(wb_problems)[:700] if wb_problems else "")
                       + " (read graph/data/agent-assets-<builder>-<project>.log; a re-drive dispatches only the missing ids)")
    # ── visual-qa: every file without a prior PASS (video slots contribute a mid frame); PASSes carry over ──
    lines, carried, pairs = [], [], []
    for e in exp:
        for f in _asset_files(proj, e):
            shown = f
            if f.suffix.lower() in VIDEO_EXT:
                shown = _mid_frame(f, proj / "_previews" / "qa" / "assets" / f"{f.stem}.mid.png") or f
            pairs.append((f, shown))
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
                  + _container_theme_prompt(proj)
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
    current = {Path(s).name for _, s in pairs}   # a verdict on a file already moved aside is not this round's
    fails = [a for a in qa.get("assets", []) if str(a.get("verdict", "")).upper() != "PASS" and Path(str(a.get("path", ""))).name in current]
    if fails:
        moved = _reject_qa_fails(fails, pairs, proj / "_previews" / "qa" / "rejected")
        return C._fail(state, node, f"visual-qa FAILED {len(fails)} asset(s): "
                       + "; ".join(f"{Path(a.get('path', '?')).name}: {', '.join(a.get('defects') or [])[:140]}" for a in fails[:8])
                       + f" (moved {len(moved)} failing file(s) to _previews/qa/rejected/: a re-drive rebuilds ONLY those, with these defects as feedback)")
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
    # clip inserts are the opposite case: they MUST carry their own voice, at the planned length (skills/clip-inserts)
    want_len = {str(ci.get("id")): float(ci.get("seconds") or 0) for ci in plan.get("clip_inserts") or []}
    for e in exp:
        if e["kind"] != "clip-insert":
            continue
        for f in _asset_files(proj, e):
            if not _has_audio(f):
                problems.append(f"{f.name} has NO audio stream (a clip insert plays with its own voice; recapture with capture_clip_insert.py)")
            elif want_len.get(e["id"]) and abs((_duration(f) or 0) - want_len[e["id"]]) > 0.3:
                problems.append(f"{f.name} is {(_duration(f) or 0):.2f}s, the plan says {want_len[e['id']]:.2f}s")
    # whiteboard beats: rendered silent (--no-audio; the draw-on SFX are post-mix rows), exactly the window's frames
    for e in exp:
        if e["kind"] != "whiteboard":
            continue
        for f in _asset_files(proj, e):
            if f.name != f"{e['id']}.mp4":
                problems.append(f"{f.name}: a whiteboard clip is assets/whiteboard/{e['id']}.mp4, nothing else")
                continue
            if _has_audio(f):
                problems.append(f"{f.name} carries an audio stream (whiteboard beats render with --no-audio)")
            got, want = _wb_frames(f), _wb_window_frames(e["row"])
            if got is None or abs(got - want) > 1:
                problems.append(f"{f.name} has {got} frames, its window is {want} ({float(e['row']['tIn']):.2f}-{float(e['row']['tOut']):.2f}s)")
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
LIST_FACE_JOINS = EP_SKILL.parents[1] / "scripts" / "list_face_joins.py"   # spine/jumpcuts-final.json (overlays.md 1)
LINT_EDIT_PLAN = EP_SKILL / "lint_edit_plan.py"
EP_LINT_RE = re.compile(r"^EDIT-PLAN-LINT (PASS|FAIL) events=(\d+) say=(\d+) fails=(\d+) warns=(\d+)", re.M)


def _lint_edit_plan(state, node, proj: Path, duration: float):
    args = [sys.executable, "-u", str(LINT_EDIT_PLAN), str(proj)] + (["--duration", f"{duration:.3f}"] if duration else [])
    rc, out = C.run_streaming(args, state, node)
    m = EP_LINT_RE.search(out or "")
    return (rc == 0 and bool(m) and m.group(1) == "PASS"), (m.group(2) if m else "?"), (m.group(5) if m else "?"), out


def _edit_plan_face_mode_clause(proj: Path) -> str:
    """Screen-share face mode (house rule #1b): the seed carries no punch / leak rows; the FACE rows name their deck-area body."""
    if C.face_mode(proj) != "screenshare":
        return ""
    try:
        fbs = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8")).get("face_body") or []
    except Exception:
        fbs = []
    return ("FACE MODE = SCREEN SHARE (house rule #1b): every FACE window is Mike's OBS screen share played verbatim, its deck area "
            "painted by the comp with COVER-PLAN face_body[]: "
            + "; ".join(f"{r.get('id')} F{r.get('face')} {float(r.get('tIn') or 0):.2f}-{float(r.get('tOut') or 0):.2f} s {r.get('cover_type')} {r.get('asset')}" for r in fbs)
            + ". Write that body (id, asset, state) into each FACE row's text so the event log reads it; NO [PUNCH-IN], [LIGHTLEAK] or "
            "[GLITCH] rows in this video (the seed carries none; a screen share is never zoomed), no caption rows, and no SFX hung on a "
            "screen-share beat's body change beyond what the CUE-SHEET's container rules allow.\n")


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
        # the joins inside every FACE window (frame-exact): the punch-in + library light leak land ON them (overlays.md 1)
        rc, out = C.run_streaming([sys.executable, "-u", str(LIST_FACE_JOINS), str(proj), "--scope", scope], state, node)
        if rc != 0:
            return C._fail(state, node, "list_face_joins.py failed to write spine/jumpcuts-final.json", out)
        rc, out = C.run_streaming([sys.executable, "-u", str(GEN_EDITPLAN), str(proj), "--scope", scope], state, node)
        if rc != 0:
            return C._fail(state, node, "gen_editplan.py failed to seed the event log", out)
        seed = proj / "_previews" / "EDIT-PLAN.seed.md"
        prompt = (f"Author the pre-build blueprint pair for the longform-edited project `{proj.name}` (folder `{proj}`): "
                  f"`{ep}` and `{cs}`.\nSeed event log (every SAY line, cover beat, bed, duck, hard hit, FACE window and chapter "
                  f"card, already on FINAL-spine seconds): `{seed}`. FINAL spine: `{fs}` ({duration:.2f}s, 30 fps).\n"
                  f"Plans: `{C.doc(proj, 'as_recorded')}` (chapter map + FACE windows + flags), `{C.doc(proj, 'cover_plan')}`, "
                  f"`{C.doc(proj, 'music_plan')}` (beds, automation, hard hits, the ONE vibe-cut duck), `{C.doc(proj, 'project_log')}` "
                  f"(Mike's rulings for THIS video: read its `Open flags` section, every flag is load-bearing, e.g. face background-swap "
                  f"clips in assets/face-swap/, image slots that play a motion clip from assets/img-motion/, on-screen figure rules).\n"
                  f"FACE joins: `{proj / 'spine' / 'jumpcuts-final.json'}` (every desilencer/defumbler jump cut inside each FACE window, frame-exact). "
                  + ("The seed already carries `[PUNCH-IN]` + `[GLITCH]` on each punch point (FACE STYLE glitch, Mike 2026-10-16: a random "
                     "glitch offset / glitch blocks hit across the join, a random split swinging offset on every cover->face cut-in, NO light "
                     "leaks): keep them ON those joins (never a fixed +2 s punch); a window with no interior join gets neither.\n"
                     if C.face_style(proj) == "glitch" else
                     "The seed already carries `[PUNCH-IN]` + `[LIGHTLEAK]` on each punch point: keep them ON those joins (never a fixed +2 s punch, "
                     "never a mid-hold leak pulse); a window with no interior join gets neither (overlays.md section 1, Mike 2026-10-07).\n") +
                  _edit_plan_face_mode_clause(proj) +
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


def _face_style_prompt(proj: Path) -> str:
    """The FACE PUNCH POINTS paragraph of the transition-strategist prompt, per the video's face style
    (common.FACE_STYLES; `run.py --face-style`, persisted in GRAPH-PROGRESS.json)."""
    joins = (f"FACE PUNCH POINTS: `{proj / 'spine' / 'jumpcuts-final.json'}` lists every desilencer/defumbler join inside each FACE window "
             "(`punch_candidates_s`). ")
    if C.face_mode(proj) == "screenshare":
        return (joins + "FACE MODE = SCREEN SHARE (house rule #1b, this video): a FACE window is Mike's OBS screen share played verbatim, "
                "so there are NO punch rows of any kind (no `punch-leak`, no `punch-glitch`, nothing on a join inside a FACE window). The "
                "cover->face CUT-IN and face->cover CUT-OUT rows are written as usual (the face pick); the deck-area body changes inside a "
                "window are container entrances handled by the comp, not transition rows.\n")
    if C.face_style(proj) == "glitch":
        return (joins + "FACE STYLE = glitch (Mike 2026-10-16, this video's setting; it overrides the light-leak default and the face-pick "
                "rule for CUT-INS): (1) every cover->face CUT-IN `face-cut` row takes a RANDOM `lib:split-swinging-offset-*` id (long or short; "
                "vary them, never the same id twice in a row); the face->cover CUT-OUT rows keep the face_glitch_pick. (2) At EVERY punch point "
                "write one bucket `face` row with role `punch-glitch`, source `lib`, id a RANDOM `lib:glitchoffset-*` or `lib:blocks-*` id (mix "
                "both families; vary, never the same id twice in a row), `duration_s` = that id's library durationSeconds, `why` naming the "
                "join: the comp steps the ~15-20% punch-in and plays the glitch ACROSS the join (the continuous spine is both A and B). No "
                "light leaks on face punch-ins in this video: no `punch-leak` rows, no synthetic light leak.\n")
    optics = ""
    if C.face_style(proj) == "optics":
        optics = ("FACE STYLE = optics (Mike 2026-11-03, this video's setting; it overrides the face-pick rule for CUT-INS): every "
                  "cover->face CUT-IN `face-cut` row takes a RANDOM id from " + ", ".join(f"`lib:{i}`" for i in C.OPTICS_FACE_IDS)
                  + " (use all 6 before repeating one, never the same id twice in a row), its `duration_s` = that id's library "
                  "durationSeconds, its `tc` = the face window's first frame. A face that opens the video has no cut-in. The face->cover "
                  "CUT-OUT rows keep the face_glitch_pick. Punch-ins stay light leaks as below.\n")
    return (joins + optics + "At EVERY punch point write one bucket `face` row with role `punch-leak`, source `lib`, id one of the "
            "video's 3-4 chosen LIGHT LEAKS ids (`lib:lightleaks-*`, cycle them, the previous video's ids are BLOCKED), `why` naming the "
            "join: the comp steps the ~15-20% punch-in and peaks the leak on that frame (overlays.md section 1, Mike 2026-10-07). "
            "No other punch-in rows, no synthetic light leak.\n")


def _face_style_check(plan: dict, proj: Path):
    """glitch face style (Mike 2026-10-16): the cut-ins are split swinging offsets, the punch rows are glitch
    offset / glitch blocks, and no light leak rides a punch. optics face style (Mike 2026-11-03): every face
    window's cut-in is one of the 6 ZOOM Optics ids, never the same id twice in a row."""
    if C.face_mode(proj) == "screenshare":
        bad = [r for r in plan.get("transitions") or [] if str(r.get("role")) in ("punch-leak", "punch-glitch")]
        if bad:
            return (f"face mode is screenshare (house rule #1b) but the plan carries {len(bad)} punch row(s) at "
                    f"{[r.get('tc') for r in bad][:6]} (a screen share is never zoomed)")
        return None
    if C.face_style(proj) == "optics":
        return _optics_face_check(plan, proj)
    if C.face_style(proj) != "glitch":
        return None
    rows = plan.get("transitions") or []
    if any(str(r.get("role")) == "punch-leak" for r in rows):
        return "face style is glitch (Mike 2026-10-16) but the plan carries punch-leak rows"
    for r in rows:
        tid = str(r.get("id", ""))
        if str(r.get("role")) == "punch-glitch" and not re.match(r"^lib:(glitchoffset-|blocks-)", tid):
            return f"punch-glitch at {r.get('tc')}s must be lib:glitchoffset-* or lib:blocks-*, got {tid!r}"
    if not any(str(r.get("role")) == "face-cut" and str(r.get("id", "")).startswith("lib:split-swinging-offset-") for r in rows):
        return "face style is glitch but no face-cut row uses a lib:split-swinging-offset-* id (every cover->face cut-in must)"
    return None


def _optics_face_check(plan: dict, proj: Path):
    """Every cover->face cut-in on the FINAL spine (spine/jumpcuts-final.json) has a face-cut row on an Optics id."""
    allowed = {f"lib:{i}" for i in C.OPTICS_FACE_IDS}
    rows = [r for r in plan.get("transitions") or [] if str(r.get("role")) == "face-cut"]
    try:
        windows = json.loads((proj / "spine" / "jumpcuts-final.json").read_text(encoding="utf-8")).get("face_windows") or []
    except (OSError, ValueError) as e:
        return f"face style is optics but spine/jumpcuts-final.json cannot be read ({e})"
    picked = []
    for w in windows:
        start = float(w["window_s"][0])
        if start <= 0.05:   # opens ON the face: no cut-in
            continue
        hit = [r for r in rows if abs(float(r.get("tc", -99)) - start) <= 0.5 and str(r.get("id", "")) in allowed]
        if not hit:
            return f"face style is optics but the cut-in of F{w.get('n')} at {start:.2f}s has no face-cut row on a ZOOM Optics id"
        picked.append(str(hit[0].get("id")))
    for a, b in zip(picked, picked[1:]):
        if a == b:
            return f"face style is optics but {a} is used on two cut-ins in a row"
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
                  + _usage_prompt(proj, "transitions") +
                  "The gated slots are the card move, the melt look, the spin look and the FACE LIGHT-LEAK SET (ledger slot face_leak); the face "
                  "pick and the AI-still glitch are reported for your judgment; fade / cross-fade / cross-warp stay the constant house style.\n"
                  + _face_style_prompt(proj) +
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
    why = _transition_plan_check(plan, duration) or _face_style_check(plan, proj)
    if why:
        return C._fail(state, node, f"TRANSITION-PLAN.json failed verification: {why} (fix the plan and re-drive; --redo transitions re-runs the strategist)")
    v_ok, v_msg = _usage_check(state, node, proj, "transitions")
    if not v_ok:
        return C._fail(state, node, "TRANSITION-PLAN.json repeats the previous video's card / melt / spin look (see the USAGE FAIL lines "
                                    "above): pick another (--redo transitions), or record Mike's waiver as `usage_waivers` in the plan")
    args = [sys.executable, "-u", str(RENDER_TRANSITIONS), str(proj)] + (["--force"] if _redo(state, node) else [])
    rc, out = C.run_streaming(args, state, node)
    if rc != 0:
        return C._fail(state, node, "render_transitions.py failed", out)
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_TRANSITIONS), str(proj)], state, node)
    m = TR_LINT_RE.search(out or "")
    if rc != 0 or not m or m.group(1) != "PASS":
        return C._fail(state, node, "TRANSITIONS.md fails lint_transitions.py (see FAIL lines above)", out)
    return {"steps": C._step(state, node, "ran", f"TRANSITION-PLAN.json ok ({m.group(2)} scene changes), {v_msg}, TRANSITIONS.md rendered, lint PASS")}


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
                  _with_clips(proj, [C.doc(proj, "edit_plan"), C.doc(proj, "cue_sheet"), C.doc(proj, "transitions")]))


# ── BUILD ────────────────────────────────────────────────────────────────────

BAKE_CARD_PAUSES = C.SCRIPTS / "bake_card_pauses.py"
BAKE_CLIP_INSERT = C.SCRIPTS / "bake_clip_insert.py"
CHECK_CARD_WORDS = C.SCRIPTS / "check_card_words.py"   # no card splits a word (Mike 2026-10-11, retire-early "Kas|pa")   # clip inserts: freeze + THE CLIP'S AUDIO in the VO gap (2026-10-08)
LINT_PAUSE_SILENCE = C.SKILLS / "comp-build" / "lint-pause-silence.py"
CHECK_SPINE_FPS = C.SKILLS / "comp-build" / "check_spine_fps.py"
DEFAULT_CARD_PAUSE = 1.5   # Mike's ruling on kaspa-vprogs (>= the 1 s readable minimum)


def _plan_inserts(proj: Path):
    """[(splice_at, clip file or None, id)] for every COVER-PLAN clip insert, the file resolved in assets/clip-inserts/."""
    plan_p = C.doc(proj, "cover_plan")
    if not plan_p.is_file():
        return []
    try:
        plan = json.loads(plan_p.read_text(encoding="utf-8"))
    except Exception:
        return []
    out = []
    for ci in plan.get("clip_inserts") or []:
        e = {"id": str(ci.get("id")), "kind": "clip-insert", "folder": ASSET_FOLDERS["clip-insert"]}
        files = _asset_files(proj, e)
        out.append((float(ci.get("splice_at") or 0), files[0] if files else None, e["id"]))
    return sorted(out, key=lambda x: x[0])


def _end_hold_extra(proj: Path, scope: str) -> float:
    """Seconds the comp legitimately runs PAST the paused spine: MUSIC-PLAN `end_card_hold.hold_until_sec` (a source-spine
    second, Mike's plan-gate ruling, e.g. the closing chord ringing out on a held end card, tao-detailed 2026-10-16) minus
    the source spine's own length. 0 when the plan holds nothing, or when `trim` is set (Mike 2026-10-22, kcc20: the video
    ends after the last word; the hold only positions the end-pinned music, mix_music.py cuts it at the video's end)."""
    try:
        hold = json.loads(C.doc(proj, "music_plan").read_text(encoding="utf-8")).get("end_card_hold") or {}
        until = 0.0 if hold.get("trim") else float(hold.get("hold_until_sec") or 0)
    except Exception:
        return 0.0
    fs = C.final_spine(proj, scope)
    return max(0.0, until - (_duration(fs) or until)) if (until and fs) else 0.0


def _waived_cards(proj: Path) -> dict:
    """Card cuts Mike waived (`card_cut_waivers` in GRAPH-PROGRESS.json settings): {round(at, 3): (label, why)}."""
    return {round(float(w["at"]), 3): (lbl, w.get("why", "")) for lbl, w in (C.setting(proj, "card_cut_waivers", {}) or {}).items()}


BEAT_PAUSE_RE = re.compile(r"spine pause\s+(\d+(?:\.\d+)?)\s*s(?:\s+at\s+(\d+(?:\.\d+)?))?", re.I)


def _beat_pauses(proj: Path) -> list:
    """BEAT PAUSES from the EDIT-PLAN event log: a `[BRAAM]` row that says `spine pause <dur> s [at <source s>]`
    (Mike 2026-10-17, tao-detailed: a braam goes BETWEEN sentences, after the intense line, with the figures on screen,
    and the voice stays silent until the braam ends; longform-edited.md section 7). [(planned source t, dur, label)]."""
    ep = C.doc(proj, "edit_plan")
    if not ep.is_file():
        return []
    blocks, cur = [], None
    for ln in ep.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^(\d+):(\d{2}\.\d)\s+", ln)
        if m:
            cur = [int(m.group(1)) * 60 + float(m.group(2)), ln]
            blocks.append(cur)
        elif cur is not None and ln.startswith(" ") and ln.strip():
            cur[1] += " " + ln.strip()
    out = []
    for t_row, text in blocks:
        if "[BRAAM]" not in text:
            continue
        m = BEAT_PAUSE_RE.search(text.split("[BRAAM]", 1)[1])
        if m:
            out.append((float(m.group(2)) if m.group(2) else t_row, float(m.group(1)), f"BRAAM-{len(out) + 1}"))
    return out


def card_pauses(state: LongformState) -> LongformState:
    """Wave E node 1 (2026-09-28; clip inserts 2026-10-09): bake the title-card pauses AND the clip inserts into the
    FINAL spine. Cards ON come from AS-RECORDED's chapter headers; bake_card_pauses.py SNAPS each to the silence
    trough at the chapter boundary (RMS scan, the lint's method) and inserts freeze + silence (sync-safe
    filter_complex). Clip inserts come from COVER-PLAN.json `clip_inserts` (skills/clip-inserts): bake_clip_insert.py
    reuses the snapped cards, snaps each splice point and inserts freeze + THE CLIP'S OWN AUDIO for the clip's
    length, so the spliced voice is in the VO track. lint-pause-silence.py then gates every SNAPPED point on the
    SOURCE spine; check_spine_fps + duration (source + every pause's own dur) are verified on the output, which
    becomes spine/<scope>.<next letter>.paused.mp4 (+ .json: pauses[].at/dur/clip, the comp's time map) and is
    copied to assets/spine.mp4 (comp-build §10/§13a/§3d)."""
    node = "card_pauses"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    fs = C.final_spine(proj, scope)   # the SOURCE spine (never the paused one)
    if not fs:
        return C._fail(state, node, "final spine missing")
    source = fs
    pause_s = float(state.get("card_pause") or DEFAULT_CARD_PAUSE)
    cards = [(ta, re.search(r'card\s+ON\s*"([^"]+)"', tail).group(1))
             for cid, title, ta, tz, tail in _chapters(proj) if re.search(r'card\s+ON\s*"', tail)]
    inserts = _plan_inserts(proj)
    beats = _beat_pauses(proj)   # braam pauses between sentences (EDIT-PLAN `[BRAAM] ... spine pause <dur> s`), baked like cards
    if not cards and not inserts and not beats:
        # NOTHING TO BAKE (growth-scale-up 2026-10-28, the first video with no card ON, no clip insert and no beat pause: one
        # carved bed, so no title cards): the build spine IS the final spine. It is written as the next-letter paused spine with
        # an empty-pauses sidecar and copied to assets/spine.mp4, so comp_build, verify_comp, mix_audio and verify_final keep
        # their one contract. The old `--done card_pauses` advice left all four without a paused spine.
        letter = re.search(rf"^{re.escape(scope)}\.([a-z])\.", fs.name)
        paused = fs.with_name(f"{scope}.{chr(ord(letter.group(1)) + 1) if letter else 'g'}.paused.mp4")
        if not paused.is_file() or paused.stat().st_size != fs.stat().st_size:
            shutil.copyfile(fs, paused)
        d = _duration(paused) or 0.0
        C._write_json_atomic(paused.with_suffix(".json"), {
            "pauses": [], "pause_s": pause_s, "source": str(fs), "output": str(paused), "output_duration_s": round(d, 3), "fps": 30.0,
            "note": "no card ON, no clip insert, no beat pause: an identity copy of the final spine, so sh(t) = t"})
        rc, out = C.run_streaming([sys.executable, "-u", str(CHECK_SPINE_FPS), str(paused), "30"], state, node)
        if rc != 0:
            return C._fail(state, node, "paused spine fps != 30 (check_spine_fps.py)", out)
        dest = proj / "assets" / "spine.mp4"
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.is_file() or dest.stat().st_size != paused.stat().st_size:
            shutil.copyfile(paused, dest)
        C.mark_manual(proj, node)
        return {"steps": C._step(state, node, "ran", f"nothing to bake (no card ON, no clip insert, no beat pause): {paused.name} = "
                                                     f"{fs.name} ({d:.2f}s), copied to assets/spine.mp4")}
    missing = [cid for _, f, cid in inserts if f is None]
    if missing:
        return C._fail(state, node, f"clip insert file(s) missing in assets/clip-inserts/: {', '.join(missing)} "
                                    "(the assets node captures them with capture_clip_insert.py; re-drive from assets)")
    letter = re.search(rf"^{re.escape(scope)}\.([a-z])\.", fs.name)
    nxt = chr(ord(letter.group(1)) + 1) if letter else "g"
    cards_out = fs.with_name(f"{scope}.{nxt}.paused.mp4")                  # the cards-only bake
    final_out = fs.with_name(f"{scope}.{chr(ord(nxt) + 1)}.paused.mp4") if (cards and inserts) else cards_out
    # re-drive: reuse the latest paused spine only if it was baked from THIS source with exactly these inserts
    existing = C.paused_spine(proj, scope)
    reuse = False
    if existing and existing.with_suffix(".json").is_file() and not _redo(state, node):
        try:
            em = json.loads(existing.with_suffix(".json").read_text(encoding="utf-8"))
            have = sorted(str(p.get("label") or "") for p in em.get("pauses") or [] if p.get("clip"))
            have_beats = sorted((round(float(p["dur"]), 2), str(p["beat"])) for p in em.get("pauses") or [] if p.get("beat"))
            reuse = (have == sorted(cid for _, _, cid in inserts) and Path(str(em.get("source") or "")).name == fs.name
                     and have_beats == sorted((round(d, 2), lbl) for _, d, lbl in beats))
        except Exception:
            reuse = False
    if reuse:
        paused = existing
    else:
        paused = final_out
        cards_side = cards_out.with_suffix(".json")
        if cards or beats:
            waivers = C.setting(proj, "card_cut_waivers", {}) or {}
            spec = ",".join([f"{waivers[lbl]['at']}!:{lbl}" if lbl in waivers else f"{t}:{lbl}" for t, lbl in cards]
                            + [f"{t}@{d}:{lbl}" for t, d, lbl in beats])
            args = [sys.executable, "-u", str(BAKE_CARD_PAUSES), str(source), "--cards", spec,
                    "--pause", f"{pause_s}", "--out", str(cards_out), "--json", str(cards_side)]
            rc, out = C.run_streaming(args, state, node)
            if rc != 0:
                return C._fail(state, node, "bake_card_pauses.py failed (a boundary with no silence trough: move that card per comp-build §5, as kaspa 30bps did)", out)
        else:
            cards_side = fs.with_name(f"{scope}.{nxt}.cards.json")   # no title cards: an empty card sidecar for the insert baker
            C._write_json_atomic(cards_side, {"pauses": [], "pause_s": pause_s, "source": str(source),
                                              "note": "no chapter card ON; written so bake_clip_insert.py can bake the clip inserts"})
        if inserts:
            args = [sys.executable, "-u", str(BAKE_CLIP_INSERT), str(source), "--cards-json", str(cards_side),
                    "--out", str(final_out), "--json", str(final_out.with_suffix(".json"))]
            for t, f, cid in inserts:
                args += ["--insert", f"{t}:{f}:{cid}"]
            rc, out = C.run_streaming(args, state, node)
            if rc != 0:
                return C._fail(state, node, "bake_clip_insert.py failed (a splice point with no silence trough, or a clip without its own "
                                            "audio: see above; move splice_at in COVER-PLAN.json or recapture the clip, then re-drive)", out)
    side = paused.with_suffix(".json")
    meta = json.loads(side.read_text(encoding="utf-8"))
    # a card Mike waived (`card_cut_waivers`: the boundary has no 30 ms trough, he accepted the exact cut) is the one point
    # the silence gate does not judge; it is printed so the waiver is visible in every run (tao-detailed 2026-10-17)
    waived = _waived_cards(proj)
    for p in meta.get("pauses") or []:
        if round(float(p["at"]), 3) in waived:
            print(f"  WAIVED  card {waived[round(float(p['at']), 3)][0]} at {p['at']}: {waived[round(float(p['at']), 3)][1]}")
    inserts = ",".join(f"{p['at']}:{p['dur']}" for p in meta.get("pauses") or [] if round(float(p["at"]), 3) not in waived)
    src_for_gate = Path(meta.get("source") or (source or fs))
    rc, out = C.run_streaming([sys.executable, "-u", str(LINT_PAUSE_SILENCE), "--inserts", inserts, str(src_for_gate)], state, node)
    if rc != 0:
        return C._fail(state, node, "lint-pause-silence.py FAILED on the snapped insert points (see above)", out)
    rc, out = C.run_streaming([sys.executable, "-u", str(CHECK_SPINE_FPS), str(paused), "30"], state, node)
    if rc != 0:
        return C._fail(state, node, "paused spine fps != 30 (check_spine_fps.py)", out)
    # every pause's own length: title cards = pause_s, a spliced clip insert = the clip's length (bake_clip_insert.py, 2026-10-08)
    expect = (_duration(src_for_gate) or 0.0) + sum(float(pz.get("dur") or meta.get("pause_s") or pause_s) for pz in meta.get("pauses") or [])
    got = _duration(paused) or 0.0
    if abs(got - expect) > 0.15:
        return C._fail(state, node, f"paused spine is {got:.3f}s, expected {expect:.3f}s")
    # LISTEN, not just measure silence: a plosive closure inside a word is real silence and passes every silence gate.
    # The first word heard after each card must start like the chapter's first word in AS-RECORDED.md.
    rc, out = C.run_streaming([sys.executable, "-u", str(CHECK_CARD_WORDS), str(proj), "--paused", str(paused), "--sidecar", str(side)],
                              state, node)
    if rc != 0:
        return C._fail(state, node, "a chapter card splits a word or sits after the voice (check_card_words.py): set that chapter's "
                                    "AS-RECORDED header start to the first word's TRUE onset (RMS, not Whisper) and re-drive with "
                                    "--redo card_pauses", out)
    dest = proj / "assets" / "spine.mp4"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.is_file() or dest.stat().st_size != paused.stat().st_size:
        shutil.copyfile(paused, dest)
    C.mark_manual(proj, node)  # the spine letter advanced; downstream nodes read assets/spine.mp4
    n_ins = sum(1 for p in meta.get("pauses") or [] if p.get("clip"))
    n_beat = sum(1 for p in meta.get("pauses") or [] if p.get("beat"))
    return {"steps": C._step(state, node, "ran", f"{len(cards)} card pause(s) x {pause_s}s + {n_beat} beat pause(s) + {n_ins} clip insert(s) baked -> {paused.name} ({got:.2f}s), gate PASS, copied to assets/spine.mp4")}


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
        cscope = C.caption_scope(proj)
        if "none" in cscope:
            # CAPTIONS OFF for the whole video (Mike's per-video scope `none`, 2026-11-04 quant): an EMPTY captions module + sidecar so
            # the comp's import resolves and renders nothing; the builder never runs.
            ts_off = REMOTION / "src" / (_pascal(proj.name) + "Captions.ts")
            ts_off.write_text("// CAPTIONS OFF for this video (GRAPH-PROGRESS.json settings.caption_scope = none). Generated by the graph.\n"
                              "export const ZCAPTIONS: { t: number; h: string }[] = [];\n"
                              "export const CAPTION_WINDOWS: [number, number][] = [];\n", encoding="utf-8")
            side.parent.mkdir(parents=True, exist_ok=True)
            side.write_text(json.dumps({"file": str(ts_off), "windows": [], "groups": 0, "captions_none": True,
                                        "note": "captions OFF (per-video scope none)"}, indent=1), encoding="utf-8")
            return {"steps": C._step(state, node, "ran", f"captions OFF for this video (scope none) -> empty {ts_off.name}")}
        if "all-faces" in cscope:
            args.append("--all-faces")
        if "envato" in cscope:
            args.append("--over-envato")
        rc, out = C.run_streaming(args, state, node)
        if rc != 0:
            return C._fail(state, node, "build_project_captions.py failed (no FACE hold over 5 s? pass --caption-windows a-b for a cold-open exception)", out)
    meta = json.loads(side.read_text(encoding="utf-8"))
    if meta.get("captions_none"):
        return {"steps": C._step(state, node, "skipped", "captions OFF for this video (scope none)")}
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
    covers = meta.get("cover_windows") or []
    return {"steps": C._step(state, node, "ran", f"{len(rows)} caption groups over {len(wins)} window(s)"
                             + (" (every FACE hold" if meta.get("all_faces") else " (FACE holds > 5 s")
                             + (f" + {len(covers)} Envato beat(s))" if covers else ")") + f" -> {ts.name}")}


REMOTION = C.REPO_ROOT / "video-creation" / "remotion"
COMP_GATES = C.SKILLS / "comp-build"
BROLL_MOTION = C.SKILLS / "video-qa" / "check_broll_motion.py"


def _pascal(slug: str) -> str:
    return "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", slug) if p)


def _has_audio_stream(video: Path) -> bool:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type",
                        "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    return "audio" in (r.stdout or "")


def _latest_draft(proj: Path):
    prev = proj / "_previews"
    # the UNMIXED draft: <project>-draft-vN.mp4 (the -mix sibling is the mix_audio node's output)
    cands = [(int(m.group(1)), p) for p in (prev.glob(f"{proj.name}-draft-v*.mp4") if prev.is_dir() else [])
             for m in [re.search(r"-draft-v(\d+)\.mp4$", p.name)] if m]
    return max(cands)[1] if cands else None


def _paused_meta(proj: Path, scope: str):
    fs = C.paused_spine(proj, scope)
    side = fs.with_suffix(".json") if fs else None
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
    # FACE REFRAME (comp-build §3a, Mike 2026-10-01): measured in code, never eyeballed by the builder.
    reframe_p = proj / "assets" / "face-reframe.json"
    screenshare = C.face_mode(proj) == "screenshare"
    if screenshare:
        # house rule #1b: a FACE window is the OBS screen share, played VERBATIM (never re-centred, never punched); the comp
        # declares the identity reframe and the waiver comment, and lint_face_reframe.py passes on the waiver
        C._write_json_atomic(reframe_p, {"scale": 1, "x": 0, "y": 0, "centered": True, "measured": False,
                                         "waived": "FACE MODE = screenshare (house rule #1b): the screen share plays verbatim",
                                         "face_point_out": {"x": 960, "y": 540}, "windows": []})
    elif not reframe_p.is_file() or _redo(state, node):
        rc, out = C.run_streaming([sys.executable, "-u", str(MEASURE_FACE_REFRAME), str(proj), "--scope", scope], state, node)
        if rc != 0 or not reframe_p.is_file():
            return C._fail(state, node, "measure_face_reframe.py failed (no face found in the FACE windows? see above)", out)
    reframe = json.loads(reframe_p.read_text(encoding="utf-8"))
    try:
        fbs = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8")).get("face_body") or []
    except Exception:
        fbs = []
    fb_clause = (("FACE MODE = SCREEN SHARE (longform-edited.md house rule #1b; comp-build.md section 4c): every FACE window is Mike's "
                  "OBS screen share played VERBATIM (webcam bottom-right, CTA box top-right): NO face reframe (declare "
                  "`export const FACE_REFRAME = { scale: 1, x: 0, y: 0 };` plus the comment `// FACE_REFRAME_WAIVED: screen-share face "
                  "mode (Mike, 2026-11-04)`), NO punch-ins, NO light leaks, no captions. Paint the deck area (x 0 to 1464, y 0 to 1080) over "
                  "the spine during the FACE windows with the `FACE_BODY` rows from COVER-PLAN face_body[]: "
                  + "; ".join(f"{r.get('id')} F{r.get('face')} {float(r.get('tIn') or 0):.2f}-{float(r.get('tOut') or 0):.2f} s -> "
                              f"{r.get('cover_type')} {r.get('asset')}" + (f" state {r.get('state')}" if r.get('state') else "")
                              + (f" from {r.get('from')}" if r.get('cover_type') == 'whiteboard' else "") for r in fbs)
                  + ". Each row renders the SAME element a COVERS row of that kind would (CoverEl), inside a clipped deck-area box, the "
                  "1920x1080 stage scaled by 1464/1920 and vertically centred on the page colour, with the container entrance (0.35 s "
                  "fade + 0.97 -> 1 scale-in); a whiteboard row plays assets/whiteboard/<id>.mp4 from its `from` offset. The layer sits "
                  "above the spine and below the transitions and overlays; lint_covers.py checks the rows against the plan.\n")
                 if screenshare else "")
    draft = _latest_draft(proj)
    try:
        wbs = json.loads(C.doc(proj, "cover_plan").read_text(encoding="utf-8")).get("whiteboards") or []
    except Exception:
        wbs = []
    wb_clause = (("WHITEBOARD BEATS (comp-build.md section 4b): " + "; ".join(
        f"{w.get('id')} {float(w.get('tIn') or 0):.2f}-{float(w.get('tOut') or 0):.2f} s -> assets/whiteboard/{w.get('id')}.mp4" for w in wbs)
        + ". Each is a COVERS row `kind: 'whiteboard'`, `ref` = the id, `from` = the row's offset into the clip in seconds (0 for "
          "the first row): the rendered clip plays FULL-FRAME and muted, the paper sheet fading in over 11 frames and out over 0.3 s, "
          "nothing layered over it. A FACE window inside a beat splits it into two rows with the same ref, the second's `from` = its "
          "tIn minus the beat's tIn (the clip's clock runs with the spine; lint_covers.py checks it). No captions over it.\n")
        if wbs else "")
    if not (comp.is_file() and draft and report.is_file() and not _redo(state, node)):
        prompt = (f"Build the Remotion composition for the longform-edited project `{proj.name}` (folder `{proj}`) TO its approved "
                  f"blueprint, and render the full draft.\nComposition id + file: `{comp_id}` -> `{comp}` (register in `{REMOTION / 'src' / 'Root.tsx'}`).\n"
                  f"Paused spine: `{proj / 'assets' / 'spine.mp4'}` (= `{paused}`); its sidecar `{paused.with_suffix('.json')}` gives "
                  f"CARD_T = pauses[].at = {[p['at'] for p in meta.get('pauses', []) if not p.get('clip')]} and PAUSE = {meta.get('pause_s')} s; SPINE_SECS = the "
                  f"SOURCE spine `{meta.get('source')}` = {src_secs or 0:.3f} s.\n"
                  + (("CLIP INSERTS in this spine (comp-build.md section 3d; rule skills/clip-inserts/clip-inserts.md): the sidecar's pauses[] is the "
                      "TIME MAP, sh(t) = t + the sum of every pause's own `dur` with at <= t, and INSERTS = [{at, dur}] is exported for EVERY pause. "
                      "Clip rows: " + "; ".join(f"{p.get('label')} at {p['at']} s for {p.get('dur')} s ({Path(str(p.get('clip'))).name})" for p in meta.get('pauses', []) if p.get('clip'))
                      + ". Over each clip's paused window play assets/clip-inserts/<id>-*.mp4 FULL-FRAME and MUTED (its voice is already in the VO "
                      "track), with the plan's insert-in / insert-out transitions and the EDIT-PLAN's lead-in / lead-out stills (the clip's first frame "
                      "held under the set-up line, its last frame under the resume line). Captions stay gated to the FACE windows.\n")
                     if any(p.get("clip") for p in meta.get("pauses", [])) else "")
                  + wb_clause + fb_clause
                  + f"Blueprint: `{C.doc(proj, 'edit_plan')}` · `{C.doc(proj, 'cue_sheet')}` · `{C.doc(proj, 'transitions')}` + "
                  f"`{C.doc(proj, 'transition_plan')}` · `{C.doc(proj, 'cover_plan')}` · `{C.doc(proj, 'as_recorded')}`.\n"
                  f"Mike's rulings for THIS video: `{C.doc(proj, 'project_log')}`, its `Open flags` section is load-bearing (read it before "
                  "you write a line). An image slot whose flag or cover-plan note names a clip in assets/img-motion/ plays THAT clip as a "
                  "muted video cover (from clip 0, cut at the slot end, no extra push on top); the still is only the fallback.\n"
                  f"Assets (the render's --public-dir): `{proj / 'assets'}` (state cues in assets/diagrams/_state-cues.md, chart spec in "
                  f"assets/charts/*.spec.md). Captions: `{proj / 'assets' / 'captions.json'}` -> import ZCAPTIONS + CAPTION_WINDOWS from "
                  f"`{REMOTION / 'src' / (comp_id + 'Captions.ts')}`.\n"
                  + (("CAPTIONS OVER ENVATO B-ROLL (Mike's per-video caption scope, GRAPH-PROGRESS.json settings.caption_scope): the "
                      "sidecar's `cover_windows` are the envato-video beats CAPTION_WINDOWS also covers; flag EXACTLY those Envato covers "
                      "`cap: true` in COVERS (comp-build.md section 8, lint_covers.py), and no other cover. Captions stay topmost.\n")
                     if "envato" in C.caption_scope(proj) else "") +
                  (("CAPTIONS: OFF for this video (Mike's per-video caption scope `none`, GRAPH-PROGRESS.json settings.caption_scope): "
                    "the captions module is EMPTY on purpose; mount no caption layer, flag no cover `cap: true`, and the CUE-SHEET row "
                    "`CAPTIONS: OFF (Mike, 2026-11-04)` is the record (comp-build.md section 8).\n")
                   if C.captions_off(proj) else "") +
                  _container_theme_prompt(proj)
                  + (("FACE REFRAME: WAIVED in this video (screen-share face mode, see above): the spine plays at its raw framing, no "
                      "transform on the spine or on any SpineStill.\n") if screenshare else
                     f"FACE REFRAME (comp-build.md section 3a, measured, do not hand-tune): `{reframe_p}` -> declare exactly "
                     f"`export const FACE_REFRAME = {{ scale: {reframe.get('scale')}, x: {reframe.get('x')}, y: {reframe.get('y')} }};` and apply it to the "
                     f"spine and to every SpineStill (a background-swap clip `assets/face-swap/F<n>-higgsfield-bg-swap.mp4`, if the project has one, is PRE-FRAMED: play it full-frame WITHOUT FACE_REFRAME from its JSON's window_starts_at_clip_s, comp-build.md section 3b); punch-ins scale about the face point "
                     f"{reframe.get('face_point_out')}. Previews of each FACE window through the transform: `{proj / '_previews' / 'qa' / 'face-reframe'}`.\n")
                  +
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
    hold = _end_hold_extra(proj, scope)
    want = (_duration(paused) or 0.0) + hold
    if abs(got - want) > 0.3:
        return C._fail(state, node, f"draft {draft.name} is {got:.2f}s, the paused spine is {want:.2f}s"
                                    + (f" (incl. the {hold:.2f}s end-card hold)" if hold else "") + " (every cue must route through sh())")
    if not _has_audio_stream(draft):
        return C._fail(state, node, f"draft {draft.name} has no audio stream")
    return {"steps": C._step(state, node, "ran", f"{comp.name} registered, draft {draft.name} ({got:.2f}s, audio ok)")}


GATE_LINES = {
    "lint_comp_imports.py": r"^COMP-IMPORTS-LINT (PASS|FAIL)",
    "lint_covers.py": r"^COVERS-LINT (PASS|FAIL)", "lint-deck-containers.py": None, "lint_slide_balance.py": r"^SLIDE-BALANCE-LINT (PASS|FAIL)",
    "lint_animated_charts.py": r"^ANIMATED-CHARTS-LINT (PASS|FAIL)", "lint_transition_assets.py": r"^TRANSITION-ASSETS-LINT (PASS|FAIL)",
    "check_spine_fps.py": r"^SPINE-FPS (PASS|FAIL)",
    "lint_face_reframe.py": r"^FACE-REFRAME-LINT (PASS|FAIL)",
}
MEASURE_FACE_REFRAME = C.SCRIPTS / "measure_face_reframe.py"


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
        # --plan: every COVER-PLAN whiteboard beat is placed at its planned tIn (whiteboard rows, comp-build section 4b)
        ("lint_covers.py", [str(comp)] + (["--plan", str(C.doc(proj, "cover_plan"))] if C.doc(proj, "cover_plan").is_file() else [])),
        ("lint-deck-containers.py", [str(comp)] + [str(assets / d) for d in ("card-slides", "title-slides", "diagrams") if (assets / d).is_dir()]),
        ("lint_slide_balance.py", [str(comp)]),
        ("lint_animated_charts.py", [str(comp)]),
        ("lint_transition_assets.py", [str(comp), str(assets), str(C.doc(proj, "transitions"))]),
        ("check_spine_fps.py", [str(assets / "spine.mp4"), "30"]),
        ("lint_face_reframe.py", [str(comp), str(assets / "face-reframe.json")]),   # the face is centred with the MEASURED transform
    ]
    src_text = comp.read_text(encoding="utf-8", errors="replace")
    if re.search(r"INSERTS\s*=\s*\[", src_text):
        _, paused = _paused_meta(proj, scope)
        meta = json.loads(paused.with_suffix(".json").read_text(encoding="utf-8")) if paused else {}
        # the SAME points the card_pauses node gated: the sidecar's pauses minus any card cut Mike waived (card_cut_waivers)
        waived = _waived_cards(proj)
        pts = [p for p in meta.get("pauses") or [] if round(float(p["at"]), 3) not in waived]
        for at, (lbl, why) in waived.items():
            print(f"  WAIVED  card {lbl} at {at}: {why}")
        if pts:
            runs.append(("lint-pause-silence.py", ["--inserts", ",".join(f"{p['at']}:{p['dur']}" for p in pts),
                                                   str(meta.get("source") or paused)]))
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
    paused = C.paused_spine(proj, scope)
    hold = _end_hold_extra(proj, scope)   # the approved end-card hold runs the comp past the spine (MUSIC-PLAN end_card_hold)
    d_ok = bool(draft and paused and abs((_duration(draft) or 0) - (_duration(paused) or 0) - hold) <= 0.3 and _has_audio_stream(draft))
    results["draft"] = {"ok": d_ok, "file": str(draft) if draft else None, "end_card_hold_s": round(hold, 3),
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
    # ONLY the stitched drafts <project>-draft-vN.mp4: the split-render parts (-v1.part2.mp4) and the -mix outputs do not count
    _vn = re.compile(r"-v(\d+)\.mp4$")
    drafts = sorted([p for p in prev.glob(f"{proj.name}-draft-v*.mp4") if _vn.search(p.name) and not p.stem.endswith("-mix")],
                    key=lambda p: int(_vn.search(p.name).group(1))) if prev.is_dir() else []
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


def _mixed_or_plain(draft: Path):
    mixed = draft.with_name(draft.stem + "-mix.mp4")
    return mixed if mixed.is_file() else draft


def gate_draft(state):
    proj = _proj(state)
    draft = _latest_draft(proj)
    return C.gate(state, "draft", "the MIXED draft render (music + SFX on; Mike's review, notes drive fix rounds)",
                  [_mixed_or_plain(draft) if draft else proj / "_previews"])


RENDER_COMP = C.SCRIPTS / "render_comp.py"
YT_DELIVERY = C.SCRIPTS / "yt_delivery.py"   # the finalize hand-off block: chapters, music codes, keywords (Mike 2026-10-20)
RENDER_RE = re.compile(r"^RENDER-DONE mode=final out=(.+?) dur=([\d.]+) spine=([\d.]+) fps=(\S+) audio=(\S+)", re.M)


def _latest_final(proj: Path):
    prev = proj / "_previews"
    cands = [(int(m.group(1)), p) for p in (prev.glob(f"{proj.name}-final-v*.mp4") if prev.is_dir() else [])
             for m in [re.search(r"-final-v(\d+)\.mp4$", p.name)] if m]
    return max(cands)[1] if cands else None


def final_render(state: LongformState) -> LongformState:
    """Wave F node 1 (2026-09-28): the production render, as code. render_comp.py --mode final (crf 18, the §11
    flags, disk sweep, log beside the file) -> _previews/<project>-final-vN.mp4, then mix_music.py lays the
    same beds + SFX onto it -> -mix.mp4. Verified: duration == paused spine, fps 30, audio, peak under 0."""
    node = "final_render"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    final = _latest_final(proj)
    if not (final and not _redo(state, node)):
        rc, out = C.run_streaming([sys.executable, "-u", str(RENDER_COMP), str(proj), "--mode", "final"], state, node)
        m = RENDER_RE.search(out or "")
        if rc != 0 or not m:
            return C._fail(state, node, "render_comp.py --mode final failed (read the render log in _previews/)", out)
        final = Path(m.group(1))
    mixed = final.with_name(final.stem + "-mix.mp4")
    if not (mixed.is_file() and mixed.stat().st_mtime >= final.stat().st_mtime):
        rc, out = C.run_streaming([sys.executable, "-u", str(MIX_MUSIC), str(proj), "--video", str(final), "--out", str(mixed)], state, node)
        if rc != 0 or not mixed.is_file():
            return C._fail(state, node, "mix_music.py failed on the final render", out)
    d = _duration(mixed) or 0.0
    return {"steps": C._step(state, node, "ran", f"{final.name} (crf 18) + music/SFX -> {mixed.name} ({d:.2f}s)")}


def _lufs(path: Path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(m[-1]) if m else None), (float(p[-1]) if p else None)


def verify_final(state: LongformState) -> LongformState:
    """Wave F node 2: pure code. The mixed final == the paused spine (duration +-0.3 s), fps 30, audio present,
    loudness within 1 dB of the approved mixed draft (audio parity), peak under 0 dBFS, no WIP watermark marker
    in the comp (comp-build §11). Persisted to _previews/verify-final.json."""
    node = "verify_final"
    proj, scope = _proj(state), state.get("scope", "ALL")
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    final = _latest_final(proj)
    mixed = final.with_name(final.stem + "-mix.mp4") if final else None
    paused = C.paused_spine(proj, scope)
    if not (mixed and mixed.is_file() and paused):
        return C._fail(state, node, "mixed final render or paused spine missing")
    probs = []
    d, ds = _duration(mixed) or 0.0, _duration(paused) or 0.0
    hold = _end_hold_extra(proj, scope)   # MUSIC-PLAN end_card_hold: the comp legitimately runs past the spine
    if abs(d - ds - hold) > 0.3:
        probs.append(f"duration {d:.2f}s vs spine {ds:.2f}s" + (f" + {hold:.2f}s end-card hold" if hold else ""))
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(mixed)], capture_output=True, text=True)
    num, den = (r.stdout.strip().splitlines()[0].strip().strip(",").split(",")[0] if r.stdout.strip() else "0/1").split("/")  # ffprobe csv may trail a comma
    if abs(float(num) / float(den) - 30) > 0.01:
        probs.append(f"fps {num}/{den}")
    if not _has_audio_stream(mixed):
        probs.append("no audio stream")
    lf, pk = _lufs(mixed)
    draft = _latest_draft(proj)
    dm = _mixed_or_plain(draft) if draft else None
    ld = _lufs(dm)[0] if dm and dm.is_file() else None
    if lf is not None and ld is not None and abs(lf - ld) > 1.0:
        probs.append(f"loudness {lf} LUFS vs approved draft {ld} LUFS")
    if pk is not None and pk > -0.1:
        probs.append(f"peak {pk} dBFS (clipping)")
    comp = REMOTION / "src" / f"{_pascal(proj.name)}.tsx"
    # WIP as its own token only: a highlight-wipe constant (HL_WIPE, growth-scale-up 10-28) is not a watermark
    if comp.is_file() and re.search(r"(?<![A-Za-z])WIP(?![A-Za-z])|WATERMARK", comp.read_text(encoding="utf-8", errors="replace")):
        probs.append("comp still carries a WIP/WATERMARK marker (remove before a final)")
    # B-ROLL MOTION on the FINISHED file (Mike 2026-10-17, tao-detailed shipped stuttering b-roll: a too-small OffthreadVideo
    # cache over the long render served stale frames; chunk renders never show it). Every vid slot must move as its source.
    if comp.is_file():
        rc, out = C.run_streaming([sys.executable, "-u", str(BROLL_MOTION), str(final), str(comp), str(proj / "assets")], state, node)
        if rc != 0 or not re.search(r"^BROLL-MOTION PASS", out or "", re.M):
            probs.append("b-roll freezes / skips frames in the render (check_broll_motion.py): re-render with render_comp.py's default "
                         "--ov-cache-mb (3072 since 2026-10-20; if 3072 froze it, pass --ov-cache-mb 4096), never the old 400 MB cap")
    C._write_json_atomic(proj / "_previews" / "verify-final.json", {"final": str(mixed), "duration_s": d, "spine_s": ds, "lufs": lf, "peak_dbfs": pk,
                                                                   "draft_lufs": ld, "problems": probs})
    if probs:
        return C._fail(state, node, "final does not verify: " + "; ".join(probs))
    return {"steps": C._step(state, node, "ran", f"{mixed.name} verified ({d:.2f}s, {lf} LUFS, peak {pk} dBFS)")}


def definition_of_done(state: LongformState) -> LongformState:
    """Wave F node 3 (comp-build §12a): promote the verified mixed final to the project ROOT as <project>-FINAL.mp4.
    The music bed needs no rescue (the mix is code + mix-audio.json). The _previews/_tmp recycle happens in
    stage_longform AFTER the queue copy exists (§12a step 4: the deliverable exists in two places first)."""
    node = "definition_of_done"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    final = _latest_final(proj)
    mixed = final.with_name(final.stem + "-mix.mp4") if final else None
    if not (mixed and mixed.is_file()):
        return C._fail(state, node, "no mixed final to promote")
    dest = proj / f"{proj.name}-FINAL.mp4"
    if not dest.is_file() or dest.stat().st_size != mixed.stat().st_size:
        shutil.copyfile(mixed, dest)
    if (_duration(dest) or 0) < 1:
        return C._fail(state, node, f"{dest.name} did not copy cleanly")
    # the YouTube hand-off block (Mike 2026-10-20): chapters + timestamps, the music codes `|`-delimited, 10 keywords;
    # the main loop writes the judgment half (yt-delivery.json) and hands Mike the printed block at every finalize
    rc, out = C.run_streaming([sys.executable, "-u", str(YT_DELIVERY), str(proj)], state, node)
    if rc != 0:
        return C._fail(state, node, "YT-DELIVERY FAIL: write yt-delivery.json at the project root (the title, a two-sentence "
                                    "description whose first sentence is an open loop, 2-3 hashtags, names for the uncarded chapters, "
                                    "exactly 10 keyword phrases + their common misspellings; scripts/yt_delivery.py docstring), "
                                    "re-drive, then hand Mike the block", out)
    return {"steps": C._step(state, node, "ran", f"promoted {mixed.name} -> {dest.name} ({dest.stat().st_size / 1e6:.0f} MB); "
                                                 "YT-DELIVERY.md written (hand Mike the whole YouTube metadata block as printed)")}


def _recycle(paths):
    """Recycle Bin, never a hard delete (repo rule). PowerShell's VisualBasic FileSystem does the OS move."""
    import subprocess as sp
    cmds = ["Add-Type -AssemblyName Microsoft.VisualBasic"]
    for p in paths:
        p = Path(p)
        if not p.exists():
            continue
        esc = str(p).replace("'", "''")
        if p.is_dir():
            cmds.append(f"[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory('{esc}','OnlyErrorDialogs','SendToRecycleBin')")
        else:
            cmds.append(f"[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('{esc}','OnlyErrorDialogs','SendToRecycleBin')")
    r = sp.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", "; ".join(cmds)], capture_output=True, text=True)
    return r.returncode == 0, (r.stderr or r.stdout)[-400:]


def stage_longform(state: LongformState) -> LongformState:
    """Wave F node 4: the longform-meta-author writes publish-meta.json (title / description / tags in Mike's voice);
    the node copies <project>-FINAL.mp4 + the thumbnail into schedule-tweets/longform/<slug>/, appends the
    longs.json entry (rumble / bitchute / facebook pending; never YouTube; batch null = longform-edited original),
    confirms the queue copy, THEN recycles _previews/ and _tmp/ (comp-build §12a, Recycle Bin).
    `--delivery root` (the AI Engineering Simplified channel): publish-meta.json + the usage ledger only; the FINAL stays
    at the project root, nothing goes into schedule-tweets or longs.json, _previews is kept."""
    node = "stage_longform"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub"), "status": "done"}
    final = proj / f"{proj.name}-FINAL.mp4"
    if not final.is_file():
        return C._fail(state, node, f"{final.name} missing (definition_of_done first)")
    meta_p = proj / "publish-meta.json"
    if not (meta_p.is_file() and not _redo(state, node)):
        prompt = (f"Author `{meta_p}` for the longform-edited project `{proj.name}` (folder `{proj}`): title, description, tags per "
                  f"your agent definition. Sources: `{C.doc(proj, 'as_recorded')}`, `{C.doc(proj, 'data')}`, `{C.doc(proj, 'project_log')}`, "
                  "`persona/persona.json`, and the last entry of `schedule-tweets/data/longs.json` for the shape. No em dashes, no "
                  "sources or third-party links, no music codes. Write the file and return its path.")
        rc, out = C.spawn_agent(state, node, "longform-meta-author", prompt, f"agent-longform-meta-{proj.name}.log")
        if not meta_p.is_file():
            C.persist_agent_json(out, meta_p, want_key="title")
        if not meta_p.is_file():
            return C._fail(state, node, f"longform-meta-author wrote no publish-meta.json (rc {rc})", out)
    meta = json.loads(meta_p.read_text(encoding="utf-8"))
    if "\u2014" in json.dumps(meta, ensure_ascii=False) or not meta.get("title") or not meta.get("description"):
        return C._fail(state, node, "publish-meta.json incomplete or carries an em dash")

    def record_usage():
        """the variety ledger: this video's music + transitions are now "used" (None = ok, else the failure)"""
        if USAGE_LEDGER.is_file():
            rc, out = C.run_streaming([sys.executable, "-u", str(USAGE_LEDGER), "record", "--project", str(proj), "--source", "graph"], state, node)
            if rc != 0 or "USAGE-RECORD ok" not in (out or ""):
                return out or f"rc {rc}"
        return None

    if C.delivery(proj) == "root":
        bad = record_usage()
        if bad is not None:
            return C._fail(state, node, "usage_ledger.py record failed (the next video would not rotate against this one)", bad)
        return {"steps": C._step(state, node, "ran", f"root delivery: {final.name} + publish-meta.json stay at the project root, NOT "
                                                     "queued (longs.json untouched), usage ledger recorded, _previews kept"),
                "status": "done"}
    slug = proj.name
    st = C.REPO_ROOT / "schedule-tweets"
    dest_dir = st / "longform" / slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_mp4 = dest_dir / f"{slug}.mp4"
    if not dest_mp4.is_file() or dest_mp4.stat().st_size != final.stat().st_size:
        shutil.copyfile(final, dest_mp4)
    # the winner lives in <project>/thumbnail/ OR <project>/assets/thumbnail/ (recent videos keep it under assets; only-18
    # 2026-10-27 was staged with no thumbnail because only the first was searched); takes/ subfolders are never searched
    thumbs = sorted(p for d in (proj / "thumbnail", proj / "assets" / "thumbnail") if d.is_dir() for p in d.glob("*thumb*.png"))
    thumb_rel = None
    if thumbs:
        dest_png = dest_dir / f"{slug}.png"
        shutil.copyfile(thumbs[-1], dest_png)
        thumb_rel = f"longform/{slug}/{slug}.png"
    longs_p = st / "data" / "longs.json"
    data = json.loads(longs_p.read_text(encoding="utf-8"))
    longs = data.setdefault("longs", [])
    d = _duration(dest_mp4) or 0.0
    if not any(e.get("slug") == slug for e in longs):
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        longs.append({
            "id": f"lf-{now.strftime('%Y%m%d')}-{slug}", "batch": None, "slug": slug,
            "source": f"{slug} longform-edited original (LangGraph build, {now.strftime('%Y-%m-%d')})",
            "video_path": f"longform/{slug}/{slug}.mp4", "thumbnail_path": thumb_rel, "duration_seconds": round(d, 3),
            "width": 1920, "height": 1080, "title": meta["title"], "description": meta["description"], "tags": meta.get("tags") or [],
            "categories": {"rumble": {"primary": "Finance & Crypto"}}, "visibility": "public",
            "platforms": {p: {"status": "pending", "posted_at": None, "url": None, "views": None, "views_captured_at": None}
                          for p in ("rumble", "bitchute", "facebook")},
            "created_at": now.isoformat().replace("+00:00", "Z"),
        })
        C._write_json_atomic(longs_p, data)
    if not (dest_mp4.is_file() and (_duration(dest_mp4) or 0) > 1):
        return C._fail(state, node, "queue copy did not verify; nothing recycled")
    bad = record_usage()
    if bad is not None:
        return C._fail(state, node, "staged, but usage_ledger.py record failed (the next video would not rotate against this one); nothing recycled", bad)
    ok, msg = _recycle([proj / "_previews", proj / "_tmp"])
    if not ok:
        return C._fail(state, node, f"staged, but the _previews/_tmp recycle failed: {msg}")
    return {"steps": C._step(state, node, "ran", f"staged {dest_mp4.relative_to(st)} + longs.json entry '{meta['title'][:50]}', usage ledger recorded, _previews recycled"),
            "status": "done"}



ORDER = [
    "init_project", "research", "screenplay", "gate_screenplay", "await_recording",
    "compress", "defumble", "cover_blackout", "desilence_coarse", "gate_spine_review",
    "burst_removal", "desilence_final", "transcribe", "verify_spine", "enhance_handoff", "gate_spine", "enhance_remux",
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
