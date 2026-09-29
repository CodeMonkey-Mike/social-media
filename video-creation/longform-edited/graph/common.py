# common.py — shared helpers for the longform-edited LangGraph (2026-09-17, Wave A).
#
# Per-automation copy of the livestream graph's helper layer (intake_graph.py /
# batch_graph.py), parameterized on THIS track's feed dir, the same way LinkedIn keeps
# its own. Same doctrine: subprocess nodes streamed + heartbeat, verify FROM DISK, halt
# topology, zero retries, SQLite checkpoints, headless Claude agents spawned like ffmpeg,
# HITL gates = literal LangGraph interrupts (exit 2 + `--resume --approve <gate>`).
#
# THE ON-DISK CONTRACT IS THE PER-VIDEO FOLDER: the comp-build.md §13 document set + the
# §13a folder/naming layout. Graph state never exclusively carries anything a downstream
# (or still-manual) step needs. GRAPH-PROGRESS.json in the project root records the gate
# approvals + hand-done placeholders so a fresh thread honours them.
#
# Why this graph exists: claudeisnaughty.md (the 2026-07-18/19 + 07-31 failure log). The
# structural class (wrong order, skipped doc, wrong paths, dead gates, "work I said was
# happening", serial I/O, background kills) is fixed by topology; the content class stays
# with the exemplars + visual-qa + the lints, which the graph guarantees actually RUN.

import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from typing import Callable, List, Optional

HERE = Path(__file__).resolve().parent            # longform-edited/graph/
TRACK = HERE.parent                                # longform-edited/
REPO_ROOT = TRACK.parents[1]                       # social-media/
MEDIA = TRACK / "media"
SCRIPTS = TRACK / "scripts"
SKILLS = TRACK / "skills"
DATA = HERE / "data"
CHECKPOINT_DB = DATA / "graph_checkpoints.sqlite"
LANE_RUNS = DATA / "lane_runs.json"                # committed history feed (dashboard)
LANE_PROGRESS = DATA / "lane_progress.json"        # transient heartbeat, gitignored
LANE_RUNS_KEEP = 500
LANE_NAME = "longform"
GATE_EXIT_CODE = 2
PROGRESS_FILE = "GRAPH-PROGRESS.json"

# The five STAGES the dashboard cards show; every node belongs to one (heartbeat `lane`).
STAGES = {1: "pre-production", 2: "spine", 3: "plan", 4: "build", 5: "deliver", 6: "vertical"}
STAGE_OF = {
    "init_project": 1, "research": 1, "screenplay": 1, "gate_screenplay": 1, "await_recording": 1,
    "compress": 2, "defumble": 2, "cover_blackout": 2, "desilence_coarse": 2,
    "gate_spine_review": 2, "burst_removal": 2, "desilence_final": 2, "transcribe": 2,
    "verify_spine": 2, "gate_spine": 2,
    "as_recorded": 3, "coverage": 3, "music_plan": 3, "gate_plan": 3, "assets": 3, "mix_audio": 4,
    "verify_assets": 3, "edit_plan": 3, "transitions": 3, "reconcile_docs": 3,
    "lint_docset": 3, "gate_blueprint": 3,
    "card_pauses": 4, "captions": 4, "comp_build": 4, "verify_comp": 4, "gate_draft": 4,
    "final_render": 5, "verify_final": 5, "definition_of_done": 5, "stage_longform": 5,
    "v_preflight": 6, "v_face_crop": 6, "v_assets": 6, "v_verify_assets": 6, "v_comp": 6, "v_verify_comp": 6,
    "v_render": 6, "v_mix": 6, "v_verify_final": 6, "gate_vertical": 6, "v_deliver": 6,
}
GATES = ("screenplay", "spine_review", "spine", "plan", "blueprint", "draft")
VERTICAL_GATES = ("vertical",)   # the optional 9:16 lane (vertical_graph.py)

# comp-build.md §13 — the per-video document set (the graph's state contract on disk)
DOCS = {
    "screenplay": "SCREENPLAY.md", "as_recorded": "AS-RECORDED.md", "data": "DATA.md",
    "broll_plan": "BROLL-PLAN.md", "edit_plan_prep": "EDIT-PLAN-prep.md",
    "cue_sheet": "CUE-SHEET.md", "transitions": "TRANSITIONS.md", "edit_plan": "EDIT-PLAN.md",
    "project_log": "PROJECT-LOG.md", "cover_plan": "COVER-PLAN.json", "transition_plan": "TRANSITION-PLAN.json",
    "music_plan": "MUSIC-PLAN.json",
}
# comp-build.md §10 — the merged assets/ layout
ASSET_DIRS = ("img", "vid", "title-slides", "card-slides", "receipts", "charts", "diagrams",
              "slide-sources", "transitions")

PROGRESS_RE = re.compile(r"^PROGRESS (\d+)%")
FABLE_LIMIT_RE = re.compile(r"reached your Fable limit", re.I)
FABLE_FALLBACK_MODEL = "opus"

CURRENT_PROJECT = None


# ── tiny io ──────────────────────────────────────────────────────────────────

def _read_json(path, fallback):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return fallback


_WRITE_LOCK = threading.Lock()   # parallel builders heartbeat from threads (assets node, 2026-09-28)


def _write_json_atomic(path: Path, data):
    with _WRITE_LOCK:
        tmp = Path(f"{path}.{threading.get_ident()}.tmp")
        tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        os.replace(tmp, path)


def _now_iso():
    return datetime.now().isoformat(timespec="seconds")


# ── the project folder (comp-build.md §13 + §13a) ───────────────────────────

def project_dir(name_or_path: str) -> Path:
    p = Path(name_or_path)
    if p.is_absolute() or p.exists():
        return p.resolve()
    return (MEDIA / name_or_path).resolve()


def doc(proj: Path, key: str) -> Path:
    return proj / DOCS[key]


def spine_paths(proj: Path, scope: str) -> dict:
    s = proj / "spine"
    return {
        "lowbps": s / f"{scope}.lowbps.mp4",
        "a": s / f"{scope}.a.defumbled.mp4",
        "b": s / f"{scope}.b.blackout.mp4",
        "c": s / f"{scope}.c.desilenced.mp4",
        "paused": s / f"{scope}.d.paused.mp4",
    }


def final_spine(proj: Path, scope: str) -> Optional[Path]:
    """The FINAL spine = the highest-letter `<scope>.<x>.desilenced.mp4` (§13a lets a
    burst-removal / re-desilence insert letters: c.desilenced -> d.cleaned -> e.desilenced)."""
    # Any stage letter from c upward counts (c.desilenced, d.cleaned, e.desilenced, f.cut ...):
    # the highest letter IS the latest stage by construction of the chain.
    # The SOURCE timeline: the paused spine (a BUILD artifact, +PAUSE per card) is excluded so every
    # plan-stage check keeps the timeline the plans were authored on (regression caught 2026-09-28).
    hits = sorted(h for h in (proj / "spine").glob(f"{scope}.?.*.mp4")
                  if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)
    return hits[-1] if hits else None


def paused_spine(proj: Path, scope: str) -> Optional[Path]:
    """The BUILD spine: the highest-letter `<scope>.<x>.paused.mp4` (card pauses baked), or None."""
    hits = sorted((proj / "spine").glob(f"{scope}.?.paused.mp4"))
    return hits[-1] if hits else None


def words_json(proj: Path, scope: str) -> Optional[Path]:
    fs = final_spine(proj, scope)
    if not fs:
        return None
    p = fs.with_name(fs.name[:-4] + ".medium-words.json")
    return p if p.is_file() else None


def raw_takes(proj: Path) -> List[Path]:
    r = proj / "raw"
    return sorted([p for p in r.glob("*") if p.suffix.lower() in (".mkv", ".mp4", ".mov")]) \
        if r.is_dir() else []


# ── GRAPH-PROGRESS.json (gate approvals + hand-done placeholders) ────────────

def prog_path(proj: Path) -> Path:
    return proj / PROGRESS_FILE


def prog(proj: Path) -> dict:
    d = _read_json(prog_path(proj), {})
    return d if isinstance(d, dict) else {}


def prog_write(proj: Path, p: dict):
    p["project"] = proj.name
    p["updated_at"] = _now_iso()
    _write_json_atomic(prog_path(proj), p)


def gate_done(proj: Path, gate: str) -> Optional[dict]:
    return (prog(proj).get("gates") or {}).get(gate)


def mark_gate(proj: Path, gate: str, note: str = ""):
    p = prog(proj)
    p.setdefault("gates", {})[gate] = {"approved_at": _now_iso(), "note": note}
    prog_write(proj, p)


def manual_done(proj: Path, node: str) -> bool:
    return node in (prog(proj).get("manual_done") or {})


def mark_manual(proj: Path, node: str, note: str = ""):
    p = prog(proj)
    p.setdefault("manual_done", {})[node] = {"at": _now_iso(), "note": note}
    prog_write(proj, p)


# ── dashboard feed (heartbeat + run log) ─────────────────────────────────────

def set_current_project(project: str):
    global CURRENT_PROJECT
    CURRENT_PROJECT = project


def write_progress(p: dict):
    """Publish the live heartbeat. A dashboard feed must never fail a real run."""
    try:
        DATA.mkdir(parents=True, exist_ok=True)
        _write_json_atomic(LANE_PROGRESS, p)
    except Exception:
        pass


def finish_progress(status: str, error: Optional[str] = None):
    try:
        p = _read_json(LANE_PROGRESS, None)
        if not isinstance(p, dict):
            return
        p["status"] = status
        p["updated_at"] = _now_iso()
        if error:
            p["error"] = error
        _write_json_atomic(LANE_PROGRESS, p)
    except Exception:
        pass


def _beat(state: dict, node: str, event: str, index=None, total=None, pid=None):
    write_progress({
        "lane": STAGE_OF.get(node, 1), "lane_name": STAGES.get(STAGE_OF.get(node, 1)),
        "automation": LANE_NAME, "node": node, "batch": state.get("project"),
        "status": "running", "stub": bool(state.get("stub")),
        "started_at": _now_iso(), "updated_at": _now_iso(), "pid": pid or os.getpid(),
        "index": index, "total": total, "last_event": (event or "")[:200], "ok": 0, "errors": 0,
    })


def record_run(thread: str, final: dict, started_at: str, ended_at: str, duration_s: float,
               stub: str = "", requested=None) -> dict:
    status = final.get("status", "unknown") if isinstance(final, dict) else "unknown"
    steps = final.get("steps") if isinstance(final, dict) else None
    last = None
    if isinstance(steps, dict) and steps:
        last = list(steps.keys())[-1]
    record = {
        "run_id": f"{thread}@{started_at}",
        "lane": STAGE_OF.get(last, 1) if last else 1,
        "lane_name": LANE_NAME,
        "thread": thread,
        "started_at": started_at, "ended_at": ended_at, "duration_s": round(duration_s, 1),
        "status": status, "stub": stub or "", "dry_run": False, "requested": requested,
        "summary": {"batch": final.get("project") if isinstance(final, dict) else None,
                    "last_node": last, "steps": steps,
                    **((final.get("summary") if isinstance(final, dict) else None) or {})},
        "error": final.get("error") if isinstance(final, dict) else None,
    }
    try:
        DATA.mkdir(parents=True, exist_ok=True)
        runs = _read_json(LANE_RUNS, [])
        if not isinstance(runs, list):
            runs = []
        runs.append(record)
        _write_json_atomic(LANE_RUNS, runs[-LANE_RUNS_KEEP:])
    except Exception as e:
        print(f"[graph] WARNING could not write the run log: {e}", flush=True)
    return record


# ── node bookkeeping ─────────────────────────────────────────────────────────

def _step(state: dict, node: str, status: str, detail: str = "") -> dict:
    steps = dict(state.get("steps") or {})
    steps[node] = {"status": status, "detail": detail, "at": _now_iso()}
    print(f"[longform] {node}: {status}{(' — ' + detail) if detail else ''}", flush=True)
    return steps


def _fail(state: dict, node: str, why: str, output: str = "") -> dict:
    tail = ("\n" + output[-1500:]) if output else ""
    print(f"[longform] {node}: FAILED — {why}", flush=True)
    return {"steps": _step(state, node, "failed", why), "status": "failed",
            "error": f"{node}: {why}{tail}"}


# ── subprocess nodes (streamed + heartbeat) ──────────────────────────────────

def run_streaming(cmd: List[str], state: dict, node: str):
    """Run a wrapped script, tee its output live, publish the heartbeat, return
    (returncode, output). Scripts print curated `PROGRESS n%` lines. Zero retries."""
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    p = {
        "lane": STAGE_OF.get(node, 1), "lane_name": STAGES.get(STAGE_OF.get(node, 1)),
        "automation": LANE_NAME, "node": node, "batch": state.get("project"),
        "status": "running", "stub": bool(state.get("stub")),
        "started_at": _now_iso(), "updated_at": _now_iso(), "pid": None,
        "index": None, "total": None, "last_event": "launching...", "ok": 0, "errors": 0,
    }
    write_progress(p)
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                            encoding="utf-8", errors="replace", env=env, cwd=str(REPO_ROOT))
    p["pid"] = proc.pid
    write_progress(p)
    captured, last_pub = [], 0.0
    for line in proc.stdout:
        print(line, end="", flush=True)
        captured.append(line)
        text = line.strip()
        if not text:
            continue
        m = PROGRESS_RE.match(text)
        if m:
            p["index"], p["total"] = int(m.group(1)), 100
        p["last_event"] = text[:200]
        p["updated_at"] = _now_iso()
        now = time.monotonic()
        if m or now - last_pub > 1.0:
            write_progress(p)
            last_pub = now
    proc.wait()
    p["status"] = "node_done" if proc.returncode == 0 else "node_failed"
    p["updated_at"] = _now_iso()
    write_progress(p)
    return proc.returncode, "".join(captured)


def stub_cmd(node: str, kind: str, lines: List[str]) -> List[str]:
    """`--stub ok|fail`: a python -c stand-in that prints the node's machine lines."""
    if kind == "fail":
        body = ('import sys\nprint("stub: pretending to run %s")\n'
                'print("FATAL: stub failure", file=sys.stderr)\nsys.exit(3)' % node)
    else:
        body = "\n".join(f'print({json.dumps(l)})' for l in lines + ["PROGRESS 100%"])
    return [sys.executable, "-c", body]


# ── headless Claude agents (spawned like ffmpeg; the CALLER verifies the artifact) ──

def claude_cmd() -> List[str]:
    exe = shutil.which("claude") or "claude"
    if exe.lower().endswith((".cmd", ".bat")):
        return ["cmd.exe", "/c", exe]
    return [exe]


def headless_env() -> dict:
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    for k in ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT"):   # a session refuses to nest otherwise
        env.pop(k, None)
    return env


def spawn_agent(state: dict, node: str, agent: str, prompt: str, log_name: str):
    """`claude -p --agent <name>` as a supervised subprocess, output teed to
    graph/data/<log_name>. Fable-allowance fallback: respawn ONCE with --model opus
    (the batch orchestrator's 2026-09-14 rule). Nothing here trusts the chat text."""
    if state.get("stub"):
        return (0 if state["stub"] == "ok" else 1), f"STUB agent {agent}"
    rc, out = _spawn_once(state, node, agent, prompt, log_name, None)
    if rc != 0 and FABLE_LIMIT_RE.search(out or ""):
        print(f"[longform] {node}: Fable allowance exhausted — respawning {agent} with "
              f"--model {FABLE_FALLBACK_MODEL}", flush=True)
        rc, out = _spawn_once(state, node, agent, prompt, log_name, FABLE_FALLBACK_MODEL)
    return rc, out


def spawn_agents_parallel(state: dict, node: str, specs):
    """Run several headless agents at once: specs = [(agent, prompt, log_name)]. Each gets its own
    log; the heartbeat interleaves (last writer wins, harmless). Returns {agent: (rc, out)}. Only for
    agents that own DIFFERENT browsers/profiles (the asset factory); never for the shared-Chrome posters."""
    if state.get("stub"):
        return {a: ((0 if state["stub"] == "ok" else 1), f"STUB agent {a}") for a, _, _ in specs}
    with ThreadPoolExecutor(max_workers=max(1, len(specs))) as ex:
        futs = {a: ex.submit(spawn_agent, state, node, a, p, l) for a, p, l in specs}
        return {a: f.result() for a, f in futs.items()}


PROMPT_ARG_MAX = 6000   # Windows caps a command line at ~32 K chars; long prompts ride in a file (2026-09-28)


def _spawn_once(state, node, agent, prompt, log_name, model):
    if len(prompt) > PROMPT_ARG_MAX:
        pf = DATA / f"{log_name}.prompt.md"
        DATA.mkdir(parents=True, exist_ok=True)
        pf.write_text(prompt, encoding="utf-8")
        prompt = (f"Your full task brief is in the file `{pf}`. Read it FIRST with the Read tool, then carry it out "
                  "exactly as written (it is the orchestrator's prompt to you, not user chatter).")
    cmd = [*claude_cmd(), "-p", "--agent", agent, "--dangerously-skip-permissions",
           "--output-format", "text", *(["--model", model] if model else []), prompt]
    print(f"[longform] {node}: spawning headless agent {agent}"
          f"{f' (--model {model})' if model else ''} (log graph/data/{log_name})", flush=True)
    started = time.monotonic()
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                            encoding="utf-8", errors="replace", env=headless_env(),
                            cwd=str(REPO_ROOT))
    lines = []
    DATA.mkdir(parents=True, exist_ok=True)
    with open(DATA / log_name, "a", encoding="utf-8") as lf:
        lf.write(f"\n===== {agent} @ {_now_iso()} =====\n")
        for line in proc.stdout:
            lines.append(line)
            lf.write(line)
            lf.flush()
            _beat(state, node, f"{agent}: {line.strip()[:120]}", pid=proc.pid)
    proc.wait()
    print(f"[longform] {node}: agent {agent} exit {proc.returncode} after "
          f"{(time.monotonic() - started) / 60:.1f} min", flush=True)
    return proc.returncode, "".join(lines)


def persist_agent_markdown(out: str, dest: Path, head_re: str = r"^#\s", min_bytes: int = 400) -> bool:
    """Advisor contract: an agent that carries no Write tool RETURNS the document; the
    orchestrator persists it. If the agent already wrote `dest` (Bash), keep it. Else take
    the largest fenced markdown block whose first heading matches `head_re`, else the text
    from the first such heading to the end. Returns True when `dest` holds a document."""
    if dest.is_file() and dest.stat().st_size >= min_bytes:
        return True
    text = out or ""
    blocks = re.findall(r"```(?:markdown|md)?\s*\n(.*?)```", text, flags=re.S)
    cands = [b for b in blocks if re.search(head_re, b, re.M)]
    if not cands:
        m = re.search(head_re, text, re.M)
        if m:
            cands = [text[m.start():]]
    if not cands:
        return False
    body = max(cands, key=len).strip() + "\n"
    if len(body) < min_bytes:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(body, encoding="utf-8", newline="\n")
    print(f"[longform] persisted agent-returned document -> {dest}", flush=True)
    return True


def persist_agent_json(out: str, dest: Path, want_key: Optional[str] = None) -> bool:
    """Advisor contract (batch_graph.persist_agent_json, 2026-09-14): the read-only strategists
    RETURN their JSON; the orchestrator persists it. If the agent already wrote `dest`, keep it;
    else pull the LAST JSON object out of the output (fenced or bare) and write it."""
    def _ok(d):
        return isinstance(d, (dict, list)) and (not want_key or (isinstance(d, dict) and d.get(want_key)))
    if dest.is_file():
        try:
            if _ok(json.loads(dest.read_text(encoding="utf-8"))):
                return True
        except Exception:
            pass
    text = out or ""
    cands = re.findall(r"```(?:json)?\s*([\{\[].*?[\}\]])\s*```", text, flags=re.S)
    if not cands:
        m = re.search(r"[\{\[].*[\}\]]", text, flags=re.S)
        cands = [m.group(0)] if m else []
    for txt in reversed(cands):
        try:
            data = json.loads(txt)
        except Exception:
            continue
        if _ok(data):
            dest.parent.mkdir(parents=True, exist_ok=True)
            _write_json_atomic(dest, data)
            print(f"[longform] persisted agent-returned JSON -> {dest}", flush=True)
            return True
    return False


def doc_check(path: Path, min_bytes: int, patterns: List[str]) -> (bool, List[str]):
    """Verify a document FROM DISK: exists, is not a stub, carries its mandatory sections."""
    if not path.is_file():
        return False, ["missing"]
    text = path.read_text(encoding="utf-8", errors="replace")
    missing = []
    if len(text.encode("utf-8")) < min_bytes:
        missing.append(f"too short (<{min_bytes} bytes)")
    for pat in patterns:
        if not re.search(pat, text, flags=re.I | re.M):
            missing.append(f"no /{pat}/")
    return (not missing), missing


# ── HITL gates + hand-done placeholders (both = literal interrupts) ──────────

def resume_cmd(state: dict, extra: str) -> str:
    thread = state.get("thread") or ""
    t = f" --thread {thread}" if thread and thread != f"{state.get('lane') or 'longform'}-{state.get('project')}" else ""
    lane = state.get("lane") or "longform"
    return (f"python video-creation/longform-edited/graph/run.py {lane} --project "
            f"\"{state.get('project')}\"{t} --resume {extra}")


def gate(state: dict, name: str, what: str, review: List[str]) -> dict:
    """Mike's approval gate. Approved earlier (GRAPH-PROGRESS.json) or via --approve on
    this invocation -> pass. Otherwise interrupt: the run stops here (exit 2) and prints
    the resume command; the resumed node records the approval on disk."""
    from langgraph.types import interrupt
    node = f"gate_{name}"
    proj = Path(state["project_dir"])
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    already = gate_done(proj, name)
    if already:
        return {"steps": _step(state, node, "skipped", f"approved {already.get('approved_at')}")}
    if name in (state.get("approve") or []):
        mark_gate(proj, name, "approved via --approve")
        return {"steps": _step(state, node, "ran", "approved via flag")}
    _beat(state, node, f"WAITING on Mike's {name} review")
    answer = interrupt({
        "gate": name, "project": proj.name, "what": what,
        "review": [str(r) for r in review],
        "resume": resume_cmd(state, f"--approve {name}"),
    })
    if name in ((answer or {}).get("approve") or []):
        mark_gate(proj, name, "approved on resume")
        return {"steps": _step(state, node, "ran", "approved on resume")}
    return _fail(state, node, f"resumed without --approve {name}")


def placeholder(state: dict, node: str, how: str, artifact: Optional[Callable[[], bool]] = None,
                artifact_desc: str = "") -> dict:
    """A step the graph does not automate YET (full-span topology from day one, per
    ORCHESTRATOR-PLAN: un-migrated steps are interrupt placeholders). If the step's
    ARTIFACT is already on disk (done by hand, or by an earlier run) it passes silently;
    else it interrupts with the how-to and resumes with `--done <node>`."""
    from langgraph.types import interrupt
    proj = Path(state["project_dir"])
    if state.get("stub"):
        return {"steps": _step(state, node, "stub", "placeholder")}
    if artifact is not None:
        try:
            if artifact():
                return {"steps": _step(state, node, "ran", f"artifact present: {artifact_desc}")}
        except Exception:
            pass
    if manual_done(proj, node):
        return {"steps": _step(state, node, "skipped", "marked done earlier")}
    if node in (state.get("done") or []):
        mark_manual(proj, node, "via --done flag")
        return {"steps": _step(state, node, "ran", "marked done via flag")}
    _beat(state, node, f"WAITING: {node} is not automated yet — do it by hand")
    answer = interrupt({
        "placeholder": node, "project": proj.name, "how": how,
        "artifact": artifact_desc,
        "resume": resume_cmd(state, f"--done {node}"),
    })
    if artifact is not None:
        try:
            if artifact():
                mark_manual(proj, node, "artifact present on resume")
                return {"steps": _step(state, node, "ran", f"artifact present: {artifact_desc}")}
        except Exception:
            pass
    if node in ((answer or {}).get("done") or []):
        mark_manual(proj, node, "via --done on resume")
        return {"steps": _step(state, node, "ran", "marked done on resume")}
    return _fail(state, node, f"resumed without --done {node} and no artifact on disk")
