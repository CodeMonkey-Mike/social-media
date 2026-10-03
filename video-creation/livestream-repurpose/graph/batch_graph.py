# batch_graph.py — the BATCH ORCHESTRATOR: one invocation drives a livestream through ALL
# THREE LANES and refuses to report DONE while any lane is still pending.
#
# Built 2026-09-10 after batch `kaspa`: the intake graph printed its LANE FRONTIER banner
# ("Lane 3's ONLY precondition is its plan file. Do not hold it for Lane 2.") and the
# human/Claude orchestrator still never invoked Lane 3. An advisory banner cannot stop a
# lane from being forgotten; only a graph that OWNS the DAG can. This is the "full batch
# orchestrator" the ORCHESTRATOR-PLAN's Phase 2 section deferred, built to the same rules
# as every segment: wrap, verify from disk, halt on failure, zero retries, SQLite
# checkpoints, stub mode, artifacts on disk are the contract.
#
# Topology (supervisor; peers never spawn peers):
#
#   START -> intake -> register -> launch_lane3 -> lane2_select -> lane2_cut
#         -> gate_4b (HITL: interrupt unless approved) -> lane2_tighten_plan -> lane2_tighten
#         -> gate_2nd (HITL) -> lane2_finish -> lane2_build -> lane2_publish
#         -> join_lane3 -> verify_batch -> END
#
#   * intake        = the Wave 1 intake graph, run as a subprocess (`run.py --source`).
#   * launch_lane3  = Lane 3 runs CONCURRENTLY as its own detached process
#                     (`run.py lane3 --batch <b>` = drafter agent -> repurpose graph ->
#                     visual-qa). It is fire-and-VERIFY: join_lane3 waits on it, re-launches
#                     it if it died, and verify_batch refuses DONE until
#                     batches.json pipelines.repurpose == "done". A lane can no longer be
#                     forgotten, and Lane 3 never waits behind a Lane 2 gate.
#   * Judgment steps spawn HEADLESS CLAUDE AGENTS (`claude -p --agent <name>`) the way
#     nodes spawn ffmpeg, then verify the agent's ARTIFACT from disk (never its chat text):
#     clip-strategist -> clip-plan.json · tighten-strategist -> tighten-plan.json ·
#     lane3-drafter -> <batch>-lane3-plan.json · remotion-builder -> 7-built PASS ·
#     publish-meta-author -> publish-meta.json · visual-qa -> report (non-fatal).
#   * The ONLY human gates are Mike's 4b review and 2nd review. They are literal LangGraph
#     interrupts: the run ends with exit code 2 and prints the resume command;
#     `run.py batch --batch <b> --resume --approve 4b [--delete 2,5]` continues.
#     Approvals are ALSO persisted in progress.json `gates`, so a fresh thread honours them.
#   * `--until 4b|2nd|finish|build|publish` scopes a run (e.g. "up to clip generation only"):
#     Lane 2 stops there, Lane 3 is still awaited, and the report says what was skipped.
#   * Every node is redo-safe: it derives "already done" from disk (phase strings written by
#     the segments themselves) and skips, so `--resume` and re-invocation are always safe.
#
# Known limitation: the dashboard heartbeat (lane_progress.json) is one file; while Lane 3
# runs concurrently its segments overwrite the supervisor's heartbeat and vice versa. The
# run LOG for each is authoritative (graph/data/batch-<b>.log, lane3-<b>.log).

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
from pathlib import Path
from typing import List, Optional, TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt

import intake_graph as ig
from intake_graph import (  # noqa: F401
    DATA, LONGS_FILE, REPO_ROOT, TRANSCRIPTS, _now_iso, _read_json, _write_json_atomic,
    write_progress,
)

HERE = Path(__file__).resolve().parent
RUN_PY = HERE / "run.py"
LSR = HERE.parent
SCRIPTS = LSR / "scripts"
MEDIA = LSR / "media"
SHORTS = REPO_ROOT / "video-creation" / "shorts"
BATCHES = REPO_ROOT / "batches.json"
LANE3_OUT = REPO_ROOT / "repurpose" / "output"
SHORTS_QUEUE = REPO_ROOT / "schedule-tweets" / "data" / "shorts.json"
LANE_BATCH = 9          # supervisor lane number on the dashboard
LANE_LANE3 = 8          # the lane-3 wrapper (draft -> repurpose -> visual-qa)
UNTIL_STAGES = ["4b", "2nd", "finish", "build", "publish"]
GATE_EXIT_CODE = 2      # "waiting on a human gate" — distinct from 1 = failed

# Windows creation flags so a detached child survives this process ending at a gate.
_DETACHED = 0
if os.name == "nt":
    _DETACHED = subprocess.CREATE_NEW_PROCESS_GROUP | getattr(subprocess, "DETACHED_PROCESS", 0x8)


class BatchState(TypedDict, total=False):
    batch: str
    source: str
    media_dir: str
    min_sil: float               # Lane 1 longform desilence knob (canonical 0.5)
    shorts_min_sil: float        # Lane 2 5B knob (canonical 0.25)
    skip_longform: bool
    publish_date: str
    until: str
    approve: List[str]
    delete_4b: List[int]
    delete_2nd: List[int]
    max_builders: int
    lane3_brief: Optional[str]
    clip_brief: Optional[str]
    stub: str
    steps: dict
    lane3_pid: Optional[int]
    status: str
    error: str
    waiting_gate: str
    summary: dict


# ── small disk helpers ───────────────────────────────────────────────────────

def slugify(stem: str) -> str:
    s = re.sub(r"[^a-z0-9-]", "", stem.lower().replace(" ", "-"))
    return re.sub(r"-{2,}", "-", s).strip("-")


def reg_entry(batch: str) -> Optional[dict]:
    d = _read_json(BATCHES, None)
    if not isinstance(d, dict):
        return None
    for e in d.get("batches", []):
        if e.get("batch") == batch:
            return e
    return None


def reg_write(entry: dict):
    raw = BATCHES.read_text(encoding="utf-8")
    d = json.loads(raw)
    m = re.search(r'\n( +)"', raw)
    indent = len(m.group(1)) if m else 2
    found = False
    for i, e in enumerate(d["batches"]):
        if e.get("batch") == entry["batch"]:
            d["batches"][i] = entry
            found = True
    if not found:
        d["batches"].append(entry)
    BATCHES.write_text(json.dumps(d, indent=indent, ensure_ascii=False),
                       encoding="utf-8", newline="\n")


def prog_path(batch: str) -> Path:
    return SHORTS / batch / "progress.json"


def prog(batch: str) -> dict:
    p = _read_json(prog_path(batch), None)
    return p if isinstance(p, dict) else {}


def prog_write(batch: str, p: dict):
    p["last_updated"] = datetime.now().isoformat(timespec="seconds")
    _write_json_atomic(prog_path(batch), p)


def clip_plan_path(batch: str) -> Path:
    return SHORTS / batch / "clip-plan.json"


def tighten_plan_path(batch: str) -> Path:
    return SHORTS / batch / "tighten-plan.json"


def lane3_plan_path(batch: str) -> Path:
    return LANE3_OUT / f"{batch}-lane3-plan.json"


def lane3_log_path(batch: str) -> Path:
    return DATA / f"lane3-{batch}.log"


def lane3_pid_path(batch: str) -> Path:
    return DATA / f"lane3-{batch}.pid"


def media_paths(state: BatchState) -> dict:
    """Derive every intake artifact path from the media folder (the folder name is the
    artifact name — the intake graph's own rule)."""
    e = reg_entry(state["batch"])
    media_dir = Path(state.get("media_dir") or (
        Path(state["source"]).parent if state.get("source") else MEDIA / state["batch"]))
    name = media_dir.name
    tdir = Path(e["transcripts_dir"]) if e and e.get("transcripts_dir") \
        else TRANSCRIPTS / f"{name} LOW BPS VERTICAL"
    if not tdir.is_absolute():
        tdir = REPO_ROOT / tdir
    vertical = Path(e["source_media"]) if e and e.get("source_media") \
        else media_dir / f"{name} LOW BPS VERTICAL.mp4"
    if not vertical.is_absolute():
        vertical = REPO_ROOT / vertical
    return {
        "media_dir": media_dir, "name": name, "vertical": vertical, "tdir": tdir,
        "plain": tdir / f"{name} LOW BPS VERTICAL_plain.txt",
        "chunks": tdir / f"{name} LOW BPS VERTICAL_chunks_90s.txt",
        "words": tdir / f"{name} LOW BPS VERTICAL_words.txt",
        "words_json": tdir / f"{name} LOW BPS VERTICAL.json",
        "meta": media_dir / "longform-meta.json",
    }


def longs_has(batch: str) -> bool:
    d = _read_json(LONGS_FILE, None)
    items = d.get("longs", d) if isinstance(d, dict) else d
    if not isinstance(items, list):
        return False
    return any(x.get("batch") == batch or str(x.get("id", "")).endswith(f"-{batch}")
               for x in items if isinstance(x, dict))


def intake_done(state: BatchState) -> bool:
    mp = media_paths(state)
    ok = mp["plain"].is_file() and mp["words_json"].is_file() and mp["vertical"].is_file()
    if not state.get("skip_longform"):
        ok = ok and longs_has(state["batch"])
    return ok


def pipelines(batch: str) -> dict:
    e = reg_entry(batch)
    return (e or {}).get("pipelines", {}) or {}


def pid_alive(pid: Optional[int]) -> bool:
    if not pid:
        return False
    if os.name == "nt":
        r = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/NH"],
                           capture_output=True, text=True)
        return str(pid) in r.stdout
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def shorts_queued(batch: str) -> int:
    d = _read_json(SHORTS_QUEUE, None)
    items = d.get("shorts", d) if isinstance(d, dict) else d
    if not isinstance(items, list):
        return 0
    return sum(1 for x in items if isinstance(x, dict) and x.get("batch") == batch)


def queue_counts(batch: str) -> dict:
    files = {"x-tweets.json": "tweets", "x-threads.json": "threads", "x-polls.json": "polls",
             "yt-posts.json": "posts", "yt-text-polls.json": "polls",
             "ig-single-image.json": "posts"}
    out = {}
    for fn, key in files.items():
        d = _read_json(REPO_ROOT / "schedule-tweets" / "data" / fn, None)
        items = (d.get(key) if isinstance(d, dict) else d) or []
        out[fn.replace(".json", "")] = sum(
            1 for x in items if isinstance(x, dict) and x.get("batch") == batch)
    return out


# ── running things ───────────────────────────────────────────────────────────

def _step(state: BatchState, node: str, status: str, detail: str = "") -> dict:
    steps = dict(state.get("steps") or {})
    steps[node] = {"status": status, "detail": detail, "at": _now_iso()}
    print(f"[batch] {node}: {status}{(' — ' + detail) if detail else ''}", flush=True)
    return steps


def _beat(state: BatchState, node: str, event: str):
    write_progress({
        "lane": LANE_BATCH, "lane_name": "batch", "node": node,
        "batch": state.get("batch"), "status": "running", "stub": bool(state.get("stub")),
        "started_at": _now_iso(), "updated_at": _now_iso(), "pid": os.getpid(),
        "index": None, "total": None, "last_event": event[:200], "ok": 0, "errors": 0,
    })


def run_segment(state: BatchState, node: str, args: List[str]):
    """Run one `run.py <segment> ...` as a subprocess, streamed + heartbeat. Returns
    (rc, output). Stub mode never launches anything."""
    if state.get("stub"):
        return (0 if state["stub"] == "ok" else 1), f"STUB {state['stub']} {' '.join(args)}"
    cmd = [sys.executable, "-u", str(RUN_PY), *args]
    print(f"[batch] {node}: run.py {' '.join(args)}", flush=True)
    return ig._run_streaming(cmd, lane=LANE_BATCH, node=node)


def claude_cmd() -> List[str]:
    exe = shutil.which("claude") or "claude"
    if exe.lower().endswith((".cmd", ".bat")):
        # npm's claude.CMD shim runs under cmd.exe, and cmd.exe CUTS a multi-line argument at its first newline:
        # every headless agent received only LINE ONE of its prompt (found 2026-10-01 on the longform graph, when
        # the desilencer never got its --min-sil). Call the real executable the shim wraps whenever it exists.
        real = Path(exe).parent / "node_modules" / "@anthropic-ai" / "claude-code" / "bin" / "claude.exe"
        if real.is_file():
            return [str(real)]
        return ["cmd.exe", "/c", exe]
    return [exe]


def headless_env() -> dict:
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    # A Claude Code session refuses to nest unless these are cleared (verified 2026-09-10).
    for k in ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT"):
        env.pop(k, None)
    return env


def spawn_agent(state: BatchState, node: str, agent: str, prompt: str, log_name: str,
                marker: Optional[Path] = None):
    """Spawn a headless Claude agent (`claude -p --agent <name>`) like any other tool,
    tee its output to graph/data/<log_name>, and return (rc, output). The CALLER verifies
    the agent's artifact from disk; nothing here trusts the chat text. `marker` = a file
    that holds the agent's pid while it runs (a resumed supervisor reads it to avoid
    double-spawning the same work); removed on exit."""
    if state.get("stub"):
        return (0 if state["stub"] == "ok" else 1), f"STUB agent {agent}"
    rc, out = _spawn_agent_once(state, node, agent, prompt, log_name, marker, model=None)
    # FABLE ALLOWANCE FALLBACK (Mike, 2026-08-09; put in code 2026-09-14 after both Lane 2 + 3
    # advisors of batch `perpspad` died in 6s): a `model: fable` agent has no automatic fallback,
    # so when the weekly Fable allowance is out, respawn ONCE with an explicit Opus override
    # (CLI --model beats the agent frontmatter; the definitions are never edited).
    if rc != 0 and FABLE_LIMIT_RE.search(out or ""):
        print(f"[batch] {node}: Fable allowance exhausted — respawning {agent} with "
              f"--model {FABLE_FALLBACK_MODEL}", flush=True)
        rc, out = _spawn_agent_once(state, node, agent, prompt, log_name, marker,
                                    model=FABLE_FALLBACK_MODEL)
    return rc, out


FABLE_LIMIT_RE = re.compile(r"reached your Fable limit", re.I)
FABLE_FALLBACK_MODEL = "opus"


def _spawn_agent_once(state: BatchState, node: str, agent: str, prompt: str, log_name: str,
                      marker: Optional[Path], model: Optional[str]):
    base = claude_cmd()
    if base[0].lower() == "cmd.exe":
        # Only the cmd.exe shim is available: it would cut the prompt at its first newline, so flatten it to one line.
        prompt = " ".join(x.strip() for x in prompt.splitlines() if x.strip())
    cmd = [*base, "-p", "--agent", agent, "--dangerously-skip-permissions",
           "--output-format", "text", *(["--model", model] if model else []), prompt]
    print(f"[batch] {node}: spawning headless agent {agent}"
          f"{f' (--model {model})' if model else ''} (log {log_name})", flush=True)
    started = time.monotonic()
    env = headless_env()
    proc = subprocess.Popen(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, encoding="utf-8", errors="replace", env=env,
                            cwd=str(REPO_ROOT))
    if marker is not None:
        try:
            marker.parent.mkdir(parents=True, exist_ok=True)
            marker.write_text(f"{proc.pid} {_now_iso()}", encoding="utf-8")
        except Exception:
            pass
    lines = []
    log = DATA / log_name
    DATA.mkdir(parents=True, exist_ok=True)
    with open(log, "a", encoding="utf-8") as lf:
        lf.write(f"\n===== {agent} @ {_now_iso()} =====\n")
        for line in proc.stdout:
            lines.append(line)
            lf.write(line)
            lf.flush()
            _beat(state, node, f"{agent}: {line.strip()[:120]}")
    proc.wait()
    if marker is not None:
        try:
            marker.unlink()
        except Exception:
            pass
    print(f"[batch] {node}: agent {agent} exit {proc.returncode} after "
          f"{(time.monotonic() - started) / 60:.1f} min", flush=True)
    return proc.returncode, "".join(lines)


def persist_agent_json(out: str, dest: Path, want_key: Optional[str] = None) -> bool:
    """Advisor contract: the agents' own definitions say "return the JSON, the orchestrator
    persists it" (they carry no Write tool). Fable happened to write the file via Bash; Opus
    (the Fable-limit fallback) returned it as chat text and batch `perpspad` failed on
    "clip-plan.json missing" (2026-09-14). So: when the agent did not write `dest`, pull the
    LAST JSON object out of its output (fenced or bare) and write it. Returns True if `dest`
    now holds a JSON object (with `want_key`, when given)."""
    def _ok(d):
        return isinstance(d, (dict, list)) and (not want_key or (isinstance(d, dict) and d.get(want_key)))
    if dest.is_file() and _ok(_read_json(dest, None)):
        return True
    cands = re.findall(r"```(?:json)?\s*([\{\[].*?[\}\]])\s*```", out or "", flags=re.S)
    if not cands:
        m = re.search(r"[\{\[].*[\}\]]", out or "", flags=re.S)   # bare: first bracket to last
        cands = [m.group(0)] if m else []
    for txt in reversed(cands):
        try:
            data = json.loads(txt)
        except Exception:
            continue
        if _ok(data):
            dest.parent.mkdir(parents=True, exist_ok=True)
            _write_json_atomic(dest, data)
            print(f"[batch] persisted agent-returned JSON -> {dest}", flush=True)
            return True
    return False


# ── gates (HITL) ─────────────────────────────────────────────────────────────

def _apply_deletes(batch: str, gate: str, deletes: List[int]) -> List[int]:
    """4b/2nd verdicts: a deleted clip leaves clip-plan.json clips[] (numbers stay frozen;
    the tighten validator refuses a deleted clip in its plan)."""
    applied = []
    if deletes:
        cp_path = clip_plan_path(batch)
        cp = _read_json(cp_path, None) or {}
        keep, gone = [], []
        for c in cp.get("clips", []):
            (gone if int(c.get("clip_id", -1)) in deletes else keep).append(c)
        if gone:
            cp["clips"] = keep
            cp.setdefault("deleted_at_gate", []).extend(
                {"gate": gate, "clip_id": c["clip_id"], "slug": c.get("slug"),
                 "at": _now_iso()} for c in gone)
            _write_json_atomic(cp_path, cp)
            applied = [c["clip_id"] for c in gone]
        p = prog(batch)
        for c in p.get("clips", []):
            if int(c.get("n", -1)) in deletes:
                c["gate"] = f"deleted-{gate}"
        if p:
            prog_write(batch, p)
    return applied


def _record_gate(batch: str, gate: str, deletes: List[int]):
    p = prog(batch)
    p.setdefault("gates", {})[gate] = {"approved_at": _now_iso(), "deleted": deletes}
    if p:
        prog_write(batch, p)


def _gate(state: BatchState, gate: str, delete_key: str) -> BatchState:
    node = f"gate_{gate}"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    already = (prog(batch).get("gates") or {}).get(gate)
    if already:
        return {"steps": _step(state, node, "skipped",
                               f"approved {already.get('approved_at')}")}
    if gate in (state.get("approve") or []):
        applied = _apply_deletes(batch, gate, state.get(delete_key) or [])
        _record_gate(batch, gate, applied)
        return {"steps": _step(state, node, "ran", f"approved via flag; deleted {applied}")}
    _beat(state, node, f"WAITING on Mike's {gate} review")
    # Literal LangGraph HITL: the run stops here (exit 2) and prints the resume command.
    answer = interrupt({
        "gate": gate, "batch": batch,
        "dashboard": str(SHORTS / batch / "dashboard.html"),
        "resume": f"python video-creation/livestream-repurpose/graph/run.py batch "
                  f"--batch {batch} --resume --approve {gate} [--delete N,N]",
    })
    deletes = [int(x) for x in (answer or {}).get("delete", [])]
    applied = _apply_deletes(batch, gate, deletes)
    _record_gate(batch, gate, applied)
    return {"steps": _step(state, node, "ran", f"approved on resume; deleted {applied}")}


# ── nodes ────────────────────────────────────────────────────────────────────

def intake(state: BatchState) -> BatchState:
    node = "intake"
    _beat(state, node, "checking intake artifacts")
    if state.get("stub"):
        rc, out = run_segment(state, node, ["--source", "stub.mkv"])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    if intake_done(state):
        return {"steps": _step(state, node, "skipped", "artifacts on disk")}
    if not state.get("source"):
        err = ("intake artifacts are missing and no --source was given; pass the recording "
               "path to run the intake graph")
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    args = ["--source", state["source"], "--min-sil", str(state.get("min_sil", 0.5))]
    if state.get("skip_longform"):
        args.append("--skip-longform")
    rc, out = run_segment(state, node, args)
    if rc != 0 or not intake_done(state):
        err = f"intake graph exit {rc} or artifacts still missing; tail:\n{out[-1200:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran")}


def register(state: BatchState) -> BatchState:
    node = "register"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    e = reg_entry(batch)
    mp = media_paths(state)
    rel = lambda p: os.path.relpath(str(p), str(REPO_ROOT)).replace("\\", "/")  # noqa: E731
    if not e:
        meta = _read_json(mp["meta"], {}) or {}
        e = {
            "batch": batch, "track": "livestream-repurpose", "status": "active",
            "date": str(date.today()),
            "livestream_title": f"{mp['name']} LOW BPS VERTICAL",
            "title": meta.get("title"), "shorts_source": None,
            "source_media": rel(mp["vertical"]),
            "transcript_plain": rel(mp["plain"]),
            "transcripts_dir": rel(mp["tdir"]),
            "dashboard": None, "directories": [f"video-creation/shorts/{batch}"],
            "pipelines": {"shorts": "active", "repurpose": "pending",
                          "longform": "skip" if state.get("skip_longform") else "done"},
            "note": f"registered by the batch orchestrator {date.today()}",
        }
        # first-run briefs were silently dropped here (perpspad 2026-09-14: "only do 4 clips"
        # never reached the clip-strategist); persist them on create too.
        briefs = {k: v for k, v in (("lane3", state.get("lane3_brief")),
                                    ("clips", state.get("clip_brief"))) if v}
        if briefs:
            e["briefs"] = briefs
        reg_write(e)
        return {"steps": _step(state, node, "ran",
                               "batches.json entry created" + (" (+briefs)" if briefs else ""))}
    changed = False
    e.setdefault("pipelines", {})
    if "repurpose" not in e["pipelines"]:
        e["pipelines"]["repurpose"] = "pending"
        changed = True
    # Mike's per-run briefs travel IN the invocation and persist on the registry entry so
    # every later resume (and the headless agents) read the same words.
    for key, val in (("lane3", state.get("lane3_brief")), ("clips", state.get("clip_brief"))):
        if val and (e.get("briefs") or {}).get(key) != val:
            e.setdefault("briefs", {})[key] = val
            changed = True
    if changed:
        reg_write(e)
    return {"steps": _step(state, node, "skipped" if not changed else "ran",
                           "already registered" + (" (briefs/pipelines updated)" if changed else ""))}


def _launch_lane3_process(state: BatchState) -> int:
    batch = state["batch"]
    log = lane3_log_path(batch)
    DATA.mkdir(parents=True, exist_ok=True)
    lf = open(log, "a", encoding="utf-8")
    lf.write(f"\n===== lane3 launched by batch orchestrator @ {_now_iso()} =====\n")
    lf.flush()
    proc = subprocess.Popen(
        [sys.executable, "-u", str(RUN_PY), "lane3", "--batch", batch, "--resume"],
        stdout=lf, stderr=subprocess.STDOUT, cwd=str(REPO_ROOT), env=headless_env(),
        creationflags=_DETACHED, close_fds=True)
    lane3_pid_path(batch).write_text(str(proc.pid), encoding="utf-8")
    print(f"[batch] lane3 running concurrently: pid {proc.pid}, log {log}", flush=True)
    return proc.pid


def launch_lane3(state: BatchState) -> BatchState:
    node = "launch_lane3"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    if pipelines(batch).get("repurpose") == "done":
        return {"steps": _step(state, node, "skipped", "lane 3 already done")}
    old = lane3_pid_path(batch)
    if old.is_file():
        pid = int(old.read_text().strip() or 0)
        if pid_alive(pid):
            return {"lane3_pid": pid,
                    "steps": _step(state, node, "skipped", f"lane 3 already running pid {pid}")}
    pid = _launch_lane3_process(state)
    return {"lane3_pid": pid, "steps": _step(state, node, "ran", f"pid {pid}")}


def _clip_prompt(state: BatchState) -> str:
    batch = state["batch"]
    mp = media_paths(state)
    e = reg_entry(batch) or {}
    brief = ((e.get("briefs") or {}).get("clips")) or "none"
    return (
        f"Select the vertical-shorts clip plan for livestream batch `{batch}` (Lane 2, Phase 3-4).\n\n"
        f"SOURCE ARTIFACTS (glossary-adjudicated by the intake graph):\n"
        f"- 90s chunk transcript (primary input): `{mp['chunks']}`\n"
        f"- Plain transcript: `{mp['plain']}`\n- Word timings: `{mp['words']}`\n"
        f"- Vertical master the timecodes index: `{mp['vertical']}`\n\n"
        f"OUTPUT: write `{clip_plan_path(batch)}` in the canonical clip-plan schema consumed by "
        f"`run.py cut --batch {batch}` (see `video-creation/livestream-repurpose/scripts/cut_topics.py` "
        f"validate_plan; it MUST pass). Create the folder if needed.\n\n"
        f"CONSTRAINTS: best 5 topics, no more than 8 clips total; a long clip AND a shorter impact "
        f"clip of a very impactful section within it are allowed; scatter-gather (stitching the same "
        f"topic from several points of the stream into one short) is allowed.\n"
        f"MIKE'S PER-RUN BRIEF FOR CLIPS: {brief}\n\n"
        f"SELECTION DOCTRINE: `video-creation/livestream-repurpose/skills/topic-finding/SKILL.md` and "
        f"`persona/persona.json` (avoid_in_drafts). Lead with hype and conviction, not market "
        f"narration; skip political/personal tangents, membership pitches, ElizaOS. Return the plan "
        f"with timecodes, durations and rationale per clip."
    )


def lane2_select(state: BatchState) -> BatchState:
    node = "lane2_select"
    batch = state["batch"]
    cp = clip_plan_path(batch)
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    if cp.is_file() and (_read_json(cp, {}) or {}).get("clips"):
        return {"steps": _step(state, node, "skipped", "clip-plan.json on disk")}
    _beat(state, node, "clip-strategist selecting clips")
    rc, out = spawn_agent(state, node, "clip-strategist", _clip_prompt(state),
                          f"agent-clip-strategist-{batch}.log")
    if not persist_agent_json(out, cp, want_key="clips"):
        err = f"clip-strategist exit {rc}; clip-plan.json missing/empty. tail:\n{out[-1000:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    # fail fast with the cutter's own validator (one source of truth)
    sys.path.insert(0, str(SCRIPTS))
    from cut_topics import validate_plan as validate_clip_plan  # noqa: E402
    try:
        validate_clip_plan(_read_json(cp, {}), str(media_paths(state)["vertical"]))
    except SystemExit as e:
        err = f"clip-plan.json INVALID: {e}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran",
                           f"{len(_read_json(cp, {})['clips'])} clips planned")}


def lane2_cut(state: BatchState) -> BatchState:
    node = "lane2_cut"
    batch = state["batch"]
    if state.get("stub"):
        rc, out = run_segment(state, node, ["cut", "--batch", batch])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    if prog(batch).get("clips"):
        return {"steps": _step(state, node, "skipped", "progress.json past cut")}
    rc, out = run_segment(state, node, ["cut", "--batch", batch])
    if rc != 0 or not prog(batch).get("clips"):
        err = f"cut graph exit {rc}; tail:\n{out[-1200:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran", f"{len(prog(batch)['clips'])} clips cut")}


def gate_4b(state: BatchState) -> BatchState:
    return _gate(state, "4b", "delete_4b")


def _tighten_prompt(state: BatchState, group: List[dict], part: Path) -> str:
    batch = state["batch"]
    mp = media_paths(state)
    rows = "\n".join(f"{c['clip_id']}. `{c['slug']}` ({c.get('variant', 'full')})"
                     for c in group)
    return (
        f"Author the Phase 5 tighten removal spans for batch `{batch}`, ONLY these clips:\n{rows}\n\n"
        f"INPUTS: clip plan `{clip_plan_path(batch)}`; word timings `{mp['words']}`; words JSON "
        f"`{mp['words_json']}`; master (all timecodes are MASTER timecodes) `{mp['vertical']}`; "
        f"cut clips in `{SHORTS / batch}`.\n\n"
        f"TARGET ~10% voiced-content removal per clip, HARD CEILING 15% (measured vs Whisper words by "
        f"`video-creation/livestream-repurpose/scripts/tighten_clips.py` clip_measures). Remove false "
        f"starts, restatements, self-corrections, rambling, filler tics; never substance, numbers, "
        f"named opponents or the hard-out. Impact/short clips may need NO removals (an empty list is "
        f"correct; never manufacture cuts).\n\n"
        f"OUTPUT: WRITE the file `{part}` containing a JSON LIST, one object per clip:\n"
        f'[{{"id":"<slug>","n":<clip_id int>,"removals":[{{"start":<master sec>,"end":<master sec>,'
        f'"why":"<reason>"}}],"boundary_relock":[{{"segment_index":<int>,"new_start":<sec>,'
        f'"new_end":<sec>}}]}}]\n'
        f"In boundary_relock OMIT any key you are not changing; never write null (the tightener "
        f"does float(value) on every present key). "
        f"RULES: every removal inside one of that clip's segments; end > start; cut only in silence "
        f"between words (use the word timings), never mid-word; omit boundary_relock when unneeded; "
        f"no em dashes. Report the measured removal % per clip."
    )


def lane2_tighten_plan(state: BatchState) -> BatchState:
    node = "lane2_tighten_plan"
    batch = state["batch"]
    tp = tighten_plan_path(batch)
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    if tp.is_file():
        return {"steps": _step(state, node, "skipped", "tighten-plan.json on disk")}
    clips = (_read_json(clip_plan_path(batch), {}) or {}).get("clips", [])
    if not clips:
        err = "no surviving clips in clip-plan.json"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    groups = [clips[i:i + 4] for i in range(0, len(clips), 4)]
    parts = []
    for k, group in enumerate(groups, 1):
        part = SHORTS / batch / f"tighten-plan.part{k}.json"
        if not part.is_file():
            _beat(state, node, f"tighten-strategist group {k}/{len(groups)}")
            rc, out = spawn_agent(state, node, "tighten-strategist",
                                  _tighten_prompt(state, group, part),
                                  f"agent-tighten-strategist-{batch}.log")
            if not persist_agent_json(out, part):
                err = f"tighten-strategist group {k} exit {rc}; {part.name} missing. tail:\n{out[-800:]}"
                return {"status": "failed", "error": err,
                        "steps": _step(state, node, "failed", err)}
        parts.append(part)
    merged = []
    for part in parts:
        data = _read_json(part, None)
        if isinstance(data, dict) and "clips" in data:
            data = data["clips"]
        if not isinstance(data, list):
            err = f"{part.name} is not a JSON list"
            return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
        merged.extend(data)
    plan = {"batch": batch, "authored_by": f"tighten-strategist agents via batch orchestrator {date.today()}",
            "clips": merged}
    # fail fast with the tightener's own validator (one source of truth)
    sys.path.insert(0, str(SCRIPTS))
    from tighten_clips import dur as clip_dur, load_words, validate_tighten_plan  # noqa: E402
    mp = media_paths(state)
    try:
        validate_tighten_plan(plan, _read_json(clip_plan_path(batch), {}),
                              clip_dur(str(mp["vertical"])), load_words(str(mp["words_json"])))
    except SystemExit as e:
        err = f"merged tighten plan INVALID: {e}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    _write_json_atomic(tp, plan)
    return {"steps": _step(state, node, "ran", f"{len(merged)} clips planned from {len(parts)} part(s)")}


def lane2_tighten(state: BatchState) -> BatchState:
    node = "lane2_tighten"
    batch = state["batch"]
    if state.get("stub"):
        rc, out = run_segment(state, node, ["tighten", "--batch", batch])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    if prog(batch).get("phase") in ("5B-desilenced", "6-transcribed") or \
            any(str(c.get("phase", "")).startswith("7-") for c in prog(batch).get("clips", [])):
        return {"steps": _step(state, node, "skipped", f"phase {prog(batch).get('phase')}")}
    rc, out = run_segment(state, node, ["tighten", "--batch", batch, "--min-sil",
                                        str(state.get("shorts_min_sil", 0.25))])
    if rc != 0 or prog(batch).get("phase") != "5B-desilenced":
        err = f"tighten graph exit {rc}; phase {prog(batch).get('phase')!r}; tail:\n{out[-1200:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran", "5B-desilenced")}


def gate_2nd(state: BatchState) -> BatchState:
    return _gate(state, "2nd", "delete_2nd")


def lane2_finish(state: BatchState) -> BatchState:
    node = "lane2_finish"
    batch = state["batch"]
    if state.get("stub"):
        rc, out = run_segment(state, node, ["finish", "--batch", batch])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    if prog(batch).get("phase") == "6-transcribed" or \
            any(str(c.get("phase", "")).startswith("7-") for c in prog(batch).get("clips", [])):
        return {"steps": _step(state, node, "skipped", f"phase {prog(batch).get('phase')}")}
    rc, out = run_segment(state, node, ["finish", "--batch", batch])
    if rc != 0 or prog(batch).get("phase") != "6-transcribed":
        err = f"finish graph exit {rc}; phase {prog(batch).get('phase')!r}; tail:\n{out[-1200:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran", "6-transcribed, render-assets staged")}


def _built(c: dict) -> bool:
    return str(c.get("phase", "")) == "7-built" and "PASS" in str(c.get("gate", ""))


def _build_prompt(state: BatchState, c: dict) -> str:
    batch = state["batch"]
    return (
        f"Build vertical short clip {c['n']} `{c['slug']}` of batch `{batch}` end to end to the "
        f"FINALIZED-SHORT contract (`video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md`): "
        f"BROLL-PLAN, ChatGPT b-roll (house style, budget rules), Remotion composition, SFX, captions "
        f"(captions skill), frame-0 thumbnail, render, then run the mechanical gate "
        f"(`finalized_short_gate.py --clip {c['n']}`) and self-QA. Project folder: `{SHORTS / batch}`; "
        f"progress: `{prog_path(batch)}`. Respect the chatgpt/render stage locks (stage_lock.py). "
        f"Done means progress.json shows this clip phase 7-built with a PASS gate."
    )


def build_marker(batch: str, slug: str) -> Path:
    return SHORTS / batch / slug / ".building.pid"


def _marker_pid(marker: Path) -> Optional[int]:
    try:
        return int(marker.read_text(encoding="utf-8").split()[0])
    except Exception:
        return None


def lane2_build(state: BatchState) -> BatchState:
    """One headless remotion-builder per clip, `max_builders` at a time (state value,
    overridable per run via env BATCH_MAX_BUILDERS so a resumed supervisor can change
    it). A clip whose `.building.pid` marker points at a LIVE process is being built by
    someone else (a previous supervisor incarnation, or a hand-spawned builder): it is
    not re-spawned, it is WAITED for. Verification covers EVERY surviving clip."""
    node = "lane2_build"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    workers = int(os.environ.get("BATCH_MAX_BUILDERS") or state.get("max_builders") or 2)
    workers = max(1, workers)
    surviving = [c for c in prog(batch).get("clips", [])
                 if not str(c.get("gate", "")).startswith("deleted")]
    todo, external = [], []
    for c in surviving:
        if _built(c):
            continue
        m = build_marker(batch, c["slug"])
        pid = _marker_pid(m) if m.is_file() else None
        if pid and pid_alive(pid):
            external.append((c, pid))
        else:
            if m.is_file():
                m.unlink()          # stale marker from a dead builder
            todo.append(c)
    if not todo and not external:
        return {"steps": _step(state, node, "skipped", "every surviving clip is 7-built PASS")}
    print(f"[batch] {node}: {len(todo)} to build ({workers} at a time)"
          + (f"; {len(external)} already building elsewhere: "
             f"{[(c['n'], pid) for c, pid in external]}" if external else ""), flush=True)
    _beat(state, node, f"building {len(todo)} clip(s), {workers} concurrent")

    def one(c):
        return c, spawn_agent(state, node, "remotion-builder", _build_prompt(state, c),
                              f"agent-remotion-builder-{batch}-{c['n']}.log",
                              marker=build_marker(batch, c["slug"]))
    if todo:
        with ThreadPoolExecutor(max_workers=workers) as ex:
            list(ex.map(one, todo))
    waited = 0
    for c, pid in external:
        while pid_alive(pid):
            _beat(state, node, f"waiting on external builder pid {pid} (clip {c['n']}, {waited // 60} min)")
            time.sleep(30)
            waited += 30
        m = build_marker(batch, c["slug"])
        if m.is_file():
            m.unlink()
    fresh = {c["n"]: c for c in prog(batch).get("clips", [])}
    still = [c["slug"] for c in surviving if not _built(fresh.get(c["n"], {}))]
    if still:
        err = f"clips not 7-built PASS after the builders: {still}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran",
                           f"{len(todo)} built here, {len(external)} awaited; all {len(surviving)} 7-built PASS")}


def _queued_slugs(batch: str) -> set:
    d = _read_json(SHORTS_QUEUE, None)
    items = d.get("shorts", d) if isinstance(d, dict) else d
    out = set()
    for x in items or []:
        if isinstance(x, dict) and x.get("batch") == batch:
            out.add(x.get("source_clip") or x.get("slug")
                    or Path(str(x.get("video_path", ""))).stem)
    return out


def _queued_date(batch: str) -> Optional[str]:
    """The --date the batch was first staged under. publish refuses a second date for a
    staged batch, so every incremental run must reuse it."""
    d = _read_json(SHORTS_QUEUE, None)
    items = d.get("shorts", d) if isinstance(d, dict) else d
    for x in items or []:
        if isinstance(x, dict) and x.get("batch") == batch:
            m = re.search(r"(\d{4})(\d{2})(\d{2})", str(x.get("id", "")))
            if m:
                return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            m = re.search(r"(\d{4}-\d{2}-\d{2})", str(x.get("id", "")))
            if m:
                return m.group(1)
    return None


def lane2_publish(state: BatchState) -> BatchState:
    """INCREMENTAL: stage every 7-built PASS clip that is not in shorts.json yet (the
    publish segment is idempotent per clip and names the stragglers). Never skips just
    because something is already queued (Mike, 2026-09-10: clip 4 went to review while
    seven builders were still running)."""
    node = "lane2_publish"
    batch = state["batch"]
    if state.get("stub"):
        rc, out = run_segment(state, node, ["publish", "--batch", batch])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    built = [c for c in prog(batch).get("clips", []) if _built(c)]
    queued = _queued_slugs(batch)
    todo = [c for c in built if c["slug"] not in queued]
    if not todo:
        return {"steps": _step(state, node, "skipped",
                               f"{len(queued)} queued, nothing new to stage")}
    meta = SHORTS / batch / "publish-meta.json"
    covered = set()
    if meta.is_file():
        m = _read_json(meta, {}) or {}
        covered = {c.get("slug") for c in (m.get("clips") or []) if isinstance(c, dict)}
    if any(c["slug"] not in covered for c in todo):
        _beat(state, node, "publish-meta-author drafting hooks/captions/tags")
        rc, out = spawn_agent(state, node, "publish-meta-author",
                              f"Author or EXTEND `{meta}` for batch `{batch}` per "
                              f"`video-creation/PUBLISH-SHORTS.md`: an entry (slug, title, hook, "
                              f"caption, tags) for EVERY clip that is 7-built with a PASS gate in "
                              f"`{prog_path(batch)}`. Keep existing entries exactly as they are. "
                              f"No em dashes.",
                              f"agent-publish-meta-{batch}.log")
        m = _read_json(meta, {}) if meta.is_file() else {}
        covered = {c.get("slug") for c in ((m or {}).get("clips") or []) if isinstance(c, dict)}
        lacking = [c["slug"] for c in todo if c["slug"] not in covered]
        if lacking:
            err = (f"publish-meta-author exit {rc}; publish-meta.json still lacks {lacking}. "
                   f"tail: {out[-800:]}")
            return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    pub_date = _queued_date(batch) or state.get("publish_date") or str(date.today())
    rc, out = run_segment(state, node, ["publish", "--batch", batch, "--date", pub_date])
    now = _queued_slugs(batch)
    missing = [c["slug"] for c in todo if c["slug"] not in now]
    if rc != 0 or missing:
        err = f"publish graph exit {rc}; not staged: {missing}; tail: {out[-1200:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran",
                           f"staged {len(todo)} clip(s) under date {pub_date}; "
                           f"{len(now)} queued total")}


def join_lane3(state: BatchState) -> BatchState:
    """Wait for the concurrent Lane 3 process; relaunch it ONCE per invocation if it died
    before finishing. Lane 3 can never be silently forgotten past this node."""
    node = "join_lane3"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    relaunched = False
    pid = state.get("lane3_pid")
    if not pid and lane3_pid_path(batch).is_file():
        pid = int(lane3_pid_path(batch).read_text().strip() or 0)
    waited = 0
    while True:
        if pipelines(batch).get("repurpose") == "done":
            return {"steps": _step(state, node, "ran" if waited else "skipped",
                                   f"lane 3 done (waited {waited // 60} min)")}
        if pid_alive(pid):
            _beat(state, node, f"waiting on lane 3 (pid {pid}, {waited // 60} min)")
            time.sleep(30)
            waited += 30
            continue
        if relaunched:
            err = (f"lane 3 process ended without pipelines.repurpose=done (twice). Read "
                   f"{lane3_log_path(batch)} and re-run `run.py lane3 --batch {batch} --resume`.")
            return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
        print(f"[batch] {node}: lane 3 not running and not done — relaunching once", flush=True)
        pid = _launch_lane3_process(state)
        relaunched = True


def verify_batch(state: BatchState) -> BatchState:
    node = "verify_batch"
    batch = state["batch"]
    if state.get("stub"):
        return {"status": "done", "summary": {"stub": True},
                "steps": _step(state, node, "stub")}
    p = prog(batch)
    clips = [c for c in p.get("clips", []) if not str(c.get("gate", "")).startswith("deleted")]
    queued = _queued_slugs(batch)
    lane2_stage = (
        "published" if clips and all(c["slug"] in queued for c in clips) else
        f"partially published ({sum(1 for c in clips if c['slug'] in queued)}/{len(clips)} staged)"
        if queued else
        "built" if clips and all(_built(c) for c in clips) else
        str(p.get("phase") or ("cut" if clips else "not started")))
    summary = {
        "batch": batch,
        "lane1_longform": "queued" if longs_has(batch) else
                          ("skipped" if state.get("skip_longform") else "MISSING"),
        "lane2_shorts": lane2_stage, "lane2_clips": len(clips),
        "lane3_repurpose": pipelines(batch).get("repurpose", "MISSING"),
        "lane3_queued": queue_counts(batch),
        "until": state.get("until") or "",
    }
    lane3_ok = summary["lane3_repurpose"] == "done"
    lane1_ok = summary["lane1_longform"] in ("queued", "skipped")
    lane2_ok = (summary["lane2_shorts"] == "published") or bool(state.get("until"))
    if lane3_ok and lane1_ok and lane2_ok:
        return {"status": "done", "summary": summary, "steps": _step(state, node, "ran")}
    err = f"batch NOT complete: {json.dumps(summary)}"
    return {"status": "failed", "error": err, "summary": summary,
            "steps": _step(state, node, "failed", err)}


# ── routing ──────────────────────────────────────────────────────────────────

def _after(node: str, next_node: str, until_key: Optional[str] = None):
    def route(state: BatchState) -> str:
        if state.get("status") == "failed":
            return END
        if until_key and state.get("until") == until_key:
            return "join_lane3"
        return next_node
    return route


def build_batch_graph(checkpointer=None):
    g = StateGraph(BatchState)
    for name, fn in [("intake", intake), ("register", register),
                     ("launch_lane3", launch_lane3), ("lane2_select", lane2_select),
                     ("lane2_cut", lane2_cut), ("gate_4b", gate_4b),
                     ("lane2_tighten_plan", lane2_tighten_plan), ("lane2_tighten", lane2_tighten),
                     ("gate_2nd", gate_2nd), ("lane2_finish", lane2_finish),
                     ("lane2_build", lane2_build), ("lane2_publish", lane2_publish),
                     ("join_lane3", join_lane3), ("verify_batch", verify_batch)]:
        g.add_node(name, fn)
    g.add_edge(START, "intake")
    g.add_conditional_edges("intake", _after("intake", "register"))
    g.add_conditional_edges("register", _after("register", "launch_lane3"))
    g.add_conditional_edges("launch_lane3", _after("launch_lane3", "lane2_select"))
    g.add_conditional_edges("lane2_select", _after("lane2_select", "lane2_cut"))
    g.add_conditional_edges("lane2_cut", _after("lane2_cut", "gate_4b", until_key="4b"))
    g.add_conditional_edges("gate_4b", _after("gate_4b", "lane2_tighten_plan"))
    g.add_conditional_edges("lane2_tighten_plan", _after("lane2_tighten_plan", "lane2_tighten"))
    g.add_conditional_edges("lane2_tighten", _after("lane2_tighten", "gate_2nd", until_key="2nd"))
    g.add_conditional_edges("gate_2nd", _after("gate_2nd", "lane2_finish"))
    g.add_conditional_edges("lane2_finish", _after("lane2_finish", "lane2_build", until_key="finish"))
    g.add_conditional_edges("lane2_build", _after("lane2_build", "lane2_publish", until_key="build"))
    g.add_conditional_edges("lane2_publish", _after("lane2_publish", "join_lane3"))
    g.add_conditional_edges("join_lane3", _after("join_lane3", "verify_batch"))
    g.add_edge("verify_batch", END)
    return g.compile(checkpointer=checkpointer)


# ── Lane 3 wrapper graph: draft (agent) -> repurpose (segment) -> visual-qa (agent) ─

class Lane3State(TypedDict, total=False):
    batch: str
    stub: str
    steps: dict
    status: str
    error: str


def _lane3_prompt(batch: str) -> str:
    return (f"Draft Lane 3 for livestream batch `{batch}`. Load its entry in batches.json and honor "
            f"briefs.lane3 in full if present. Write and validate "
            f"`repurpose/output/{batch}-lane3-plan.json` per your instructions, then report.")


def _plan_valid(batch: str) -> Optional[str]:
    p = lane3_plan_path(batch)
    if not p.is_file():
        return "plan file missing"
    sys.path.insert(0, str(REPO_ROOT / "repurpose"))
    from queue_writer import validate_lane3_plan  # noqa: E402
    try:
        plan = json.loads(p.read_text(encoding="utf-8"))
        if plan.get("batch") != batch:
            return f"plan batch {plan.get('batch')!r} != {batch!r}"
        validate_lane3_plan(plan)
    except SystemExit as e:
        return f"INVALID: {e}"
    except Exception as e:
        return f"unreadable: {e}"
    return None


def l3_draft(state: Lane3State) -> Lane3State:
    node = "draft"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    if pipelines(batch).get("repurpose") == "done":
        return {"steps": _step(state, node, "skipped", "lane 3 already done")}
    problem = _plan_valid(batch)
    if problem is None:
        return {"steps": _step(state, node, "skipped", "valid plan on disk")}
    print(f"[lane3] draft needed ({problem})", flush=True)
    rc, out = spawn_agent(state, node, "lane3-drafter", _lane3_prompt(batch),
                          f"agent-lane3-drafter-{batch}.log")
    problem = _plan_valid(batch)
    if problem:
        err = f"lane3-drafter exit {rc}; plan {problem}. tail:\n{out[-1000:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    return {"steps": _step(state, node, "ran", "plan validated")}


def l3_repurpose(state: Lane3State) -> Lane3State:
    node = "repurpose"
    batch = state["batch"]
    if state.get("stub"):
        rc, out = run_segment(state, node, ["repurpose", "--batch", batch])
        return ({"steps": _step(state, node, "stub")} if rc == 0 else
                {"status": "failed", "error": out, "steps": _step(state, node, "failed", out)})
    if pipelines(batch).get("repurpose") == "done":
        return {"steps": _step(state, node, "skipped", "pipelines.repurpose already done")}
    # never --resume here: the repurpose graph is idempotent (existing images/entries are
    # skipped) and a --resume on a thread with no checkpoint raises EmptyInputError
    # (caught live on kaspa, 2026-09-10).
    rc, out = run_segment(state, node, ["repurpose", "--batch", batch])
    flag = pipelines(batch).get("repurpose")
    if rc != 0 or flag not in ("done", "partial"):
        err = f"repurpose graph exit {rc}; pipelines.repurpose={flag!r}; tail:\n{out[-1500:]}"
        return {"status": "failed", "error": err, "steps": _step(state, node, "failed", err)}
    if flag == "partial":
        # everything that verified is queued; the HELD ledger names the rest. The batch
        # supervisor's join relaunches this lane once, which retries the missing images.
        return {"steps": _step(state, node, "ran", "PARTIAL: some entries held back "
                               "(see repurpose/output/<batch>-lane3-held.json)")}
    return {"steps": _step(state, node, "ran", json.dumps(queue_counts(batch)))}


def l3_visual_qa(state: Lane3State) -> Lane3State:
    """Report-only gate: opens every generated image and writes a PASS/FAIL report for
    Mike. A FAIL never fails the lane (the copy is queued; a bad image is a regen call)."""
    node = "visual_qa"
    batch = state["batch"]
    if state.get("stub"):
        return {"steps": _step(state, node, "stub")}
    report = LANE3_OUT / f"{batch}-lane3-visual-qa.md"
    if report.is_file():
        return {"steps": _step(state, node, "skipped", f"report exists {report.name}")}
    plan = _read_json(lane3_plan_path(batch), {}) or {}
    sub = {"x-tweets": "x", "yt-posts": "yt", "ig-single": "ig"}
    files = [str(REPO_ROOT / "schedule-tweets" / "images" / sub.get(im["purpose"], "x") /
                 f"{im['purpose']}-{im['image_id']}-{im['slug']}.png")
             for im in plan.get("images", [])]
    prompt = (f"Visual-QA every Lane 3 image of batch `{batch}` against its prompt in "
              f"`{lane3_plan_path(batch)}` and the house style (repurpose/SKILL.md image sections; "
              f"carousel slides must match their version exemplar, no stray text, no chartreuse "
              f"drift on V1, counters exactly once). Files:\n" + "\n".join(files) +
              f"\n\nWrite the per-asset PASS/FAIL report with specific defects and the fix to "
              f"`{report}`. Report only; change nothing.")
    rc, out = spawn_agent(state, node, "visual-qa", prompt, f"agent-visual-qa-{batch}.log")
    if not report.is_file() and rc == 0 and (out or "").strip():
        # visual-qa carries no Write tool; it returns the report as text (perpspad 2026-09-14:
        # 17/17 PASS came back as chat and "no report" was logged). Persist it ourselves.
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(f"# {batch} — Lane 3 visual QA (persisted from agent output "
                          f"{_now_iso()})\n\n{out}", encoding="utf-8")
    detail = "report written" if report.is_file() else f"agent exit {rc}, no report (non-fatal)"
    return {"steps": _step(state, node, "ran", detail)}


def build_lane3_graph(checkpointer=None):
    g = StateGraph(Lane3State)
    g.add_node("draft", l3_draft)
    g.add_node("repurpose", l3_repurpose)
    g.add_node("visual_qa", l3_visual_qa)
    g.add_edge(START, "draft")
    g.add_conditional_edges("draft", _after("draft", "repurpose"))
    g.add_conditional_edges("repurpose", _after("repurpose", "visual_qa"))
    g.add_edge("visual_qa", END)
    return g.compile(checkpointer=checkpointer)


# ── the pending-lanes footer (printed by EVERY segment report + `run.py status`) ──

def lanes_status(batch: str) -> dict:
    e = reg_entry(batch) or {}
    p = prog(batch)
    clips = [c for c in p.get("clips", []) if not str(c.get("gate", "")).startswith("deleted")]
    gates = p.get("gates") or {}
    queued = _queued_slugs(batch)
    n_q = sum(1 for c in clips if c["slug"] in queued)
    n_b = sum(1 for c in clips if _built(c))
    if clips and n_q == len(clips):
        l2 = "published (queue staged)"
    elif n_q:
        l2 = f"{n_q}/{len(clips)} staged, {n_b - n_q} built awaiting publish, {len(clips) - n_b} building; PENDING"
    elif clips and all(_built(c) for c in clips):
        l2 = "built, publish PENDING"
    elif p.get("phase") == "6-transcribed":
        l2 = "finished, builds PENDING"
    elif p.get("phase") == "5B-desilenced":
        l2 = "tightened, 2nd review " + ("approved" if "2nd" in gates else "PENDING (HITL)")
    elif clips:
        l2 = "cut, 4b review " + ("approved" if "4b" in gates else "PENDING (HITL)")
    elif clip_plan_path(batch).is_file():
        l2 = "clip-plan on disk, cut PENDING"
    elif e:
        l2 = "PENDING (no clip-plan)"
    else:
        l2 = "PENDING (batch not registered)"
    rp = (e.get("pipelines") or {}).get("repurpose", "PENDING")
    l3 = "done" if rp == "done" else "PARTIAL: queued, some entries held back (re-run lane3) PENDING" if rp == "partial" else (
        "plan on disk, repurpose graph PENDING" if lane3_plan_path(batch).is_file()
        else "PENDING (no plan)")
    l1 = "queued" if longs_has(batch) else (
        "skipped" if (e.get("pipelines") or {}).get("longform") == "skip" else "PENDING")
    return {"lane1_longform": l1, "lane2_shorts": l2, "lane3_repurpose": l3,
            "pending": [k for k, v in (("lane1", l1), ("lane2", l2), ("lane3", l3))
                        if "PENDING" in v]}


def print_lanes_footer(batch: str):
    try:
        s = lanes_status(batch)
    except Exception as e:  # a footer must never fail a run
        print(f"  (lanes footer unavailable: {e})")
        return
    print("  --------------------------------------------------------------------")
    print(f"  BATCH LANES · {batch}")
    print(f"    lane 1 longform : {s['lane1_longform']}")
    print(f"    lane 2 shorts   : {s['lane2_shorts']}")
    print(f"    lane 3 repurpose: {s['lane3_repurpose']}")
    if s["pending"]:
        print(f"  ** STILL PENDING: {', '.join(s['pending'])} — the batch is NOT done. "
              f"`run.py batch --batch {batch} --resume` drives every lane to the end.")
    else:
        print("  all three lanes complete.")
    print("  --------------------------------------------------------------------")
