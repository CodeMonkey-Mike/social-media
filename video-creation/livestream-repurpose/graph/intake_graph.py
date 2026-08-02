# intake_graph.py — livestream-repurpose Wave 1 (intake) as a LangGraph StateGraph.
#
# Phase 2 migration, second automation after linkedin-automation/graph/ (the
# template; ORCHESTRATOR-PLAN.md §"Phase 2 direction chosen" + §"Livestream
# migration"). ONE graph = ONE mechanical segment: Phase 1 (LOW BPS) + Lane 1
# (longform desilence/stage/queue) + Phase 1B (verticalize) + Phase 2 (transcribe
# + derivatives + glossary). The segment ENDS where judgment begins — Phase 3+
# (clip-strategist, Mike's gates) stays in the Claude session, consuming the same
# on-disk artifacts as before. Invoked per stream by run.py.
#
#   START -> encode -> verify_encode -> longform -> verify_longform
#         -> queue -> verify_queue -> vertical -> verify_vertical
#         -> transcribe -> verify_transcribe -> derive -> verify_derive -> END
#   --skip-longform: verify_encode -> vertical (Lane 1 skipped on Mike's ask)
#   any node:        -> (failed) -> END                    <- HALT route
#
# Principles carried over from lane_graph.py (do not undo):
#   - Blessed/ported scripts are WRAPPED as subprocesses, byte-untouched. The
#     graph replaces how a script is launched, never what it does.
#   - Files on disk remain the contract (media/<name>/, transcripts/, longs.json);
#     graph state carries paths + bookkeeping only.
#   - Zero retries anywhere. One attempt per run; a failure ends the run with the
#     output tail preserved for diagnosis. Resume = re-invoke the same --thread
#     (completed nodes skip via checkpoint; the interrupted node re-runs whole).
#     Every node is redo-safe: encodes overwrite derived files, the queue append
#     is idempotent by id (--if-absent).
#   - lane_runs.json / lane_progress.json feed the :8766 dashboard, same schema
#     as linkedin's; the checkpoint DB stays private and disposable.
#
# Documented DIVERGENCES from the linkedin template (deliberate):
#   - Verify nodes can HALT (status=failed -> END). Linkedin verifies run at END
#     and only annotate; here every downstream node consumes the verified
#     artifact, so a bad artifact must stop the chain, not annotate it.
#   - No kill-switch / no restriction concept: nodes are single long ffmpeg or
#     whisper processes, not per-member browser loops. The failure modes are a
#     non-zero exit or a bad artifact, both handled by the halt route.
#   - test_sandbox redirects the two PRODUCTION write targets (longform staged
#     root + longs.json) plus the transcripts dir, so a full real-subprocess run
#     can execute against scratch with zero production writes.

import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

HERE = Path(__file__).resolve().parent                    # .../livestream-repurpose/graph
LSR = HERE.parent                                         # .../livestream-repurpose
REPO_ROOT = LSR.parents[1]                                # .../social-media
SCRIPTS = LSR / "scripts"
TRANSCRIPTS = LSR / "transcripts"
SCHEDULE = REPO_ROOT / "schedule-tweets"
LONGS_FILE = SCHEDULE / "data" / "longs.json"
STAGED_ROOT = SCHEDULE / "longform"

DATA = HERE / "data"
CHECKPOINT_DB = DATA / "graph_checkpoints.sqlite"
LANE_RUNS = DATA / "lane_runs.json"                       # committed history feed
LANE_PROGRESS = DATA / "lane_progress.json"               # transient heartbeat, gitignored
LANE_RUNS_KEEP = 500
LANE_NAMES = {1: "intake"}
LANE_SUMMARY_KEY = {1: "intake"}

PROGRESS_RE = re.compile(r"^PROGRESS (\d+)%")
WHISPER_TS_RE = re.compile(r"^\[(\d+):(\d+)(?:\.\d+)? -->")
OUT_DURATION_RE = re.compile(r"^OUT_DURATION=([\d.]+)")
REMOVED_RE = re.compile(r"^REMOVED=([\d.]+)")
THUMB_RE = re.compile(r"^THUMB=(.+)")
APPENDED_RE = re.compile(r"^APPENDED id=(\S+);")
ALREADY_RE = re.compile(r"^ALREADY-PRESENT id=(\S+);")
PROBE_RE = re.compile(r"^PROBE (\d+)x(\d+) SAR (\S+) DAR (\S+) (OK|WRONG)")
GLOSSARY_RE = re.compile(r"^GLOSSARY fixes: (.+)")
FLAG_RE = re.compile(r"^FLAG (.+)")


class IntakeState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    source: str              # the raw recording (pre-rename path)
    media_dir: str
    stem: str                # folder name = the load-bearing artifact name
    slug: str                # no-spaces slug (staged folder, longs id, batch id)
    meta_path: str           # longform-meta.json (title/description/tags seam artifact)
    min_sil: float           # the desilencer's ONE knob — caller-specified, never defaulted
    skip_longform: bool
    cpu_verticalize: bool
    test_sandbox: str        # "" = real run; else scratch dir replacing prod write targets
    stub: str                # "" = real; ok|fail = structural test, no ffmpeg/whisper
    # derived paths (run.py computes once; nodes never re-derive)
    master: str              # "<stem> LOW BPS.mp4"
    vertical: str            # "<stem> LOW BPS VERTICAL.mp4"
    tdir: str                # transcripts/<stem LOW BPS VERTICAL>/
    tjson: str
    staged_root: str
    longs_file: str
    # bookkeeping
    master_duration_s: float
    longs_before: int
    encode_out: dict
    longform_out: dict
    queue_out: dict
    vertical_out: dict
    transcribe_out: dict
    derive_out: dict
    intake: dict             # verify_derive's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


# ── helpers (shape shared with lane_graph.py) ────────────────────────────────

def _read_json(path, fallback):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fallback
    except Exception:
        return fallback


def _write_json_atomic(path: Path, data):
    tmp = Path(str(path) + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, path)


def _now_iso():
    return datetime.now().isoformat(timespec="seconds")


def write_progress(prog: dict):
    """Publish the live heartbeat. A dashboard feed must never fail a real run."""
    try:
        DATA.mkdir(parents=True, exist_ok=True)
        _write_json_atomic(LANE_PROGRESS, prog)
    except Exception:
        pass


def finish_progress(status: str, error: Optional[str] = None):
    try:
        prog = _read_json(LANE_PROGRESS, None)
        if not isinstance(prog, dict):
            return
        prog["status"] = status
        prog["updated_at"] = _now_iso()
        if error:
            prog["error"] = error
        _write_json_atomic(LANE_PROGRESS, prog)
    except Exception:
        pass


def record_run(lane: int, thread: str, final: dict, started_at: str, ended_at: str,
               duration_s: float, stub: str = "", requested=None) -> dict:
    """Append one finished run to lane_runs.json (same record shape as linkedin's;
    no profile_views — this automation has no rationed browser resource)."""
    status = final.get("status", "unknown") if isinstance(final, dict) else "unknown"
    summary = final.get(LANE_SUMMARY_KEY.get(lane, ""), None) if isinstance(final, dict) else None
    record = {
        "run_id": f"{thread}@{started_at}",
        "lane": lane,
        "lane_name": LANE_NAMES.get(lane, str(lane)),
        "thread": thread,
        "started_at": started_at,
        "ended_at": ended_at,
        "duration_s": round(duration_s, 1),
        "status": status,
        "stub": stub or "",
        "dry_run": False,
        "requested": requested,
        "summary": summary,
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


def _ffprobe_duration(path) -> Optional[float]:
    try:
        return float(subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(path)]).decode().strip())
    except Exception:
        return None


def _ffprobe_geometry(path):
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=width,height,sample_aspect_ratio", "-of", "csv=p=0", str(path)]
        ).decode().strip().split(",")
        return int(out[0]), int(out[1]), (out[2] if len(out) > 2 else "?")
    except Exception:
        return None


def _bitrate_mbps(path) -> Optional[float]:
    d = _ffprobe_duration(path)
    if not d:
        return None
    return os.path.getsize(path) * 8 / d / 1e6


def _run_streaming(cmd, lane=1, node=None, stub="", total_s=None):
    """Run a wrapped script, tee its output live, publish the heartbeat, and
    return (returncode, output). The scripts print curated PROGRESS n% lines
    (ffmpeg) and whisper prints per-segment timestamps — both are mapped onto the
    heartbeat's index/total as a percentage, because LangGraph only checkpoints
    BETWEEN nodes and each node here is one long process (a transcribe can run
    20+ minutes)."""
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    started = _now_iso()
    prog = {
        "lane": lane, "lane_name": LANE_NAMES.get(lane), "node": node,
        "status": "running", "stub": bool(stub),
        "started_at": started, "updated_at": started,
        "pid": None, "index": None, "total": None,
        "last_event": "launching...", "ok": 0, "errors": 0,
    }
    write_progress(prog)

    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8", errors="replace", env=env, cwd=str(REPO_ROOT))
    prog["pid"] = proc.pid
    write_progress(prog)

    captured = []
    last_publish = 0.0
    for line in proc.stdout:
        print(line, end="", flush=True)
        captured.append(line)
        text = line.strip()
        if not text:
            continue
        bumped = False
        m = PROGRESS_RE.match(text)
        if m:
            prog["index"], prog["total"] = int(m.group(1)), 100
            bumped = True
        elif total_s:
            w = WHISPER_TS_RE.match(text)
            if w:
                t = int(w.group(1)) * 60 + int(w.group(2))
                prog["index"] = min(100, int(100 * t / total_s))
                prog["total"] = 100
                bumped = True
        prog["last_event"] = text[:200]
        prog["updated_at"] = _now_iso()
        now = time.monotonic()
        if bumped or now - last_publish > 1.0:
            write_progress(prog)
            last_publish = now
    proc.wait()

    prog["status"] = "node_done" if proc.returncode == 0 else "node_failed"
    prog["updated_at"] = _now_iso()
    write_progress(prog)
    return proc.returncode, "".join(captured)


def _script_cmd(name, *args):
    return [sys.executable, "-u", str(SCRIPTS / name), *args]


def _fail(out_key, parsed, rc, output, what) -> dict:
    return {out_key: parsed, "status": "failed",
            "error": f"{what} exit code {rc}; output tail:\n{output[-1500:]}"}


# ── stubs (structural tests — no ffmpeg, no whisper, no data writes) ─────────

def _stub_script(node: str, kind: str) -> str:
    if kind == "fail":                       # every stub node fails the same way;
        return ("import sys\n"               # the run halts at whichever runs first
                'print("stub: pretending to work")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "encode": ['print("PROGRESS 50% t=37:00 (LOW BPS encode)")',
                   'print("DONE stub 4520.0s -> 4520.0s")',
                   'print("OUT_DURATION=4520.00")'],
        "longform": ['print("lane 1 stage: stub")',
                     'print("DONE staged stub")', 'print("THUMB=stub.png")',
                     'print("MAP=stub-map.json")',
                     'print("OUT_DURATION=4100.00")', 'print("REMOVED=420.00")'],
        "queue": ['print("APPENDED id=lf-20260101-stub-stream; total now 1; dur=4100.0s; thumb=yes")'],
        "vertical": ['print("PROGRESS 50% t=37:00 (verticalize)")',
                     'print("PROBE 1080x1920 SAR 1:1 DAR 9:16 OK")',
                     'print("OUT_DURATION=4520.00")'],
        "transcribe": ['print("[00:00.000 --> 00:07.000]  stub words here")',
                       'print("[74:00.000 --> 74:07.000]  stub end")'],
        "derive": ['print("GLOSSARY fixes: Kaspa:3 TAO:12")',
                   "print(\"FLAG 'kaspy' x2 at [01:10.00, 44:02.10] — real KRC20 token or "
                   'Kaspa mishear? Human call at the Phase 3 seam; NOT auto-changed.")',
                   'print("3 chunks (90s windows) -> stub")'],
    }[node]
    return "\n".join(lines)


def _cmd_for(state: IntakeState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_script(node, state["stub"])]
    return real_cmd


# ── nodes ────────────────────────────────────────────────────────────────────

def encode(state: IntakeState) -> IntakeState:
    """Phase 1 Step 1: source -> LOW BPS master (encode_low_bps.py, which also does
    the rename-to-folder-name housekeeping)."""
    cmd = _cmd_for(state, "encode", _script_cmd("encode_low_bps.py", state["source"]))
    rc, output = _run_streaming(cmd, node="encode", stub=state.get("stub", ""))
    m = next((OUT_DURATION_RE.match(l) for l in output.splitlines()
              if OUT_DURATION_RE.match(l)), None)
    parsed = {"reported_duration_s": float(m.group(1)) if m else None,
              "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("encode_out", parsed, rc, output, "encode_low_bps.py")
    return {"encode_out": parsed, "status": "running"}


def verify_encode(state: IntakeState) -> IntakeState:
    """Trust the disk: the master must exist, be ~the reported duration, and be a
    genuinely low-bitrate file (an un-honored -rc cap is a documented failure)."""
    if state.get("stub"):
        return {"encode_out": {**state.get("encode_out", {}), "verified": "(stub - skipped)"},
                "master_duration_s": state["encode_out"].get("reported_duration_s") or 0.0,
                "status": "running"}
    master = state["master"]
    d = _ffprobe_duration(master)
    if d is None:
        return {"status": "failed", "error": f"LOW BPS master missing/unreadable: {master}"}
    rep = state.get("encode_out", {}).get("reported_duration_s")
    if rep and abs(d - rep) > 2.0:
        return {"status": "failed",
                "error": f"master duration {d:.1f}s != reported {rep:.1f}s (>2s off)"}
    br = _bitrate_mbps(master)
    if br and br > 1.6:
        return {"status": "failed",
                "error": f"master bitrate {br:.2f} Mbps — LOW BPS must stay under ~1 Mbps "
                         "(NVENC cap not honored?)"}
    return {"encode_out": {**state.get("encode_out", {}),
                           "duration_s": round(d, 1), "mbps": round(br or 0, 2)},
            "master_duration_s": d, "status": "running"}


def longform(state: IntakeState) -> IntakeState:
    """Lane 1: canonical desilencer (--nvenc, one pass) -> staged longform/<slug>/."""
    cmd = _cmd_for(state, "longform", _script_cmd(
        "longform_stage.py", "--master", state["master"], "--slug", state["slug"],
        "--min-sil", str(state["min_sil"]), "--staged-root", state["staged_root"]))
    rc, output = _run_streaming(cmd, node="longform", stub=state.get("stub", ""))
    lines = output.splitlines()
    parsed = {
        "reported_duration_s": next((float(m.group(1)) for m in map(OUT_DURATION_RE.match, lines) if m), None),
        "removed_s": next((float(m.group(1)) for m in map(REMOVED_RE.match, lines) if m), None),
        "thumb": next((m.group(1) for m in map(THUMB_RE.match, lines) if m), None),
        "output_tail": output[-2000:],
    }
    if rc != 0:
        return _fail("longform_out", parsed, rc, output, "longform_stage.py")
    return {"longform_out": parsed, "status": "running"}


def verify_longform(state: IntakeState) -> IntakeState:
    if state.get("stub"):
        return {"longform_out": {**state.get("longform_out", {}), "verified": "(stub - skipped)"},
                "status": "running"}
    staged = Path(state["staged_root"]) / state["slug"] / f"{state['slug']}.mp4"
    d = _ffprobe_duration(staged)
    if d is None:
        return {"status": "failed", "error": f"staged longform missing/unreadable: {staged}"}
    rep = state.get("longform_out", {}).get("reported_duration_s")
    if rep and abs(d - rep) > 1.0:
        return {"status": "failed",
                "error": f"staged duration {d:.1f}s != reported {rep:.1f}s"}
    md = state.get("master_duration_s") or 0
    if md and d >= md:
        return {"status": "failed",
                "error": f"desilenced longform ({d:.1f}s) is not shorter than the master "
                         f"({md:.1f}s) — desilence did nothing?"}
    br = _bitrate_mbps(staged)
    if br and br > 1.6:
        return {"status": "failed",
                "error": f"staged longform bitrate {br:.2f} Mbps — must stay ~0.7 Mbps "
                         "(never queue a fat intermediate)"}
    thumb_ok = (Path(state["staged_root"]) / state["slug"] / f"{state['slug']}.png").is_file()
    return {"longform_out": {**state.get("longform_out", {}), "duration_s": round(d, 1),
                             "mbps": round(br or 0, 2), "thumb_staged": thumb_ok},
            "status": "running"}


def queue(state: IntakeState) -> IntakeState:
    """Append to longs.json via longs_append.py --if-absent (idempotent by id, so a
    checkpoint-resumed re-run of this node can never double-queue)."""
    longs_before = len(_read_json(state["longs_file"], {}).get("longs", []) or [])
    dur = (state.get("longform_out", {}).get("duration_s")
           or state.get("longform_out", {}).get("reported_duration_s") or 0)
    cmd = _cmd_for(state, "queue", _script_cmd(
        "longs_append.py", "--slug", state["slug"], "--meta", state["meta_path"],
        "--duration", str(dur), "--longs-file", state["longs_file"],
        "--staged-root", state["staged_root"], "--if-absent"))
    rc, output = _run_streaming(cmd, node="queue", stub=state.get("stub", ""))
    lines = output.splitlines()
    appended = next((m.group(1) for m in map(APPENDED_RE.match, lines) if m), None)
    already = next((m.group(1) for m in map(ALREADY_RE.match, lines) if m), None)
    parsed = {"queued_id": appended or already, "already_present": bool(already),
              "output_tail": output[-1500:]}
    if rc != 0:
        return _fail("queue_out", parsed, rc, output, "longs_append.py")
    return {"queue_out": parsed, "longs_before": longs_before, "status": "running"}


def verify_queue(state: IntakeState) -> IntakeState:
    if state.get("stub"):
        return {"queue_out": {**state.get("queue_out", {}), "verified": "(stub - skipped)"},
                "status": "running"}
    longs = _read_json(state["longs_file"], {}).get("longs", []) or []
    qid = state.get("queue_out", {}).get("queued_id")
    entry = next((l for l in longs if l.get("id") == qid), None)
    if not entry:
        return {"status": "failed",
                "error": f"longs.json has no entry with id {qid} after the append"}
    delta = len(longs) - state.get("longs_before", 0)
    expected = 0 if state.get("queue_out", {}).get("already_present") else 1
    if delta != expected:
        return {"status": "failed",
                "error": f"longs.json grew by {delta} but the append reported "
                         f"{'ALREADY-PRESENT' if expected == 0 else 'APPENDED'}"}
    expected_path = f"longform/{state['slug']}/{state['slug']}.mp4"
    if entry.get("video_path") != expected_path:
        return {"status": "failed",
                "error": f"entry video_path {entry.get('video_path')!r} != {expected_path!r}"}
    thumb_on_disk = (Path(state["staged_root"]) / state["slug"] / f"{state['slug']}.png").is_file()
    if bool(entry.get("thumbnail_path")) != thumb_on_disk:
        return {"status": "failed",
                "error": f"entry thumbnail_path={entry.get('thumbnail_path')!r} but the staged "
                         f"PNG {'exists' if thumb_on_disk else 'is missing'} — reconcile"}
    if "—" in json.dumps(entry, ensure_ascii=False):
        return {"status": "failed", "error": "em dash inside the queued longs entry"}
    return {"queue_out": {**state.get("queue_out", {}), "entry_total": len(longs)},
            "status": "running"}


def vertical(state: IntakeState) -> IntakeState:
    """Phase 1 Step 1B: LOW BPS -> 1080x1920 VERTICAL (verticalize.py)."""
    args = ["verticalize.py", state["master"]]
    if state.get("cpu_verticalize"):
        args.append("--cpu")
    cmd = _cmd_for(state, "vertical", _script_cmd(*args))
    rc, output = _run_streaming(cmd, node="vertical", stub=state.get("stub", ""))
    lines = output.splitlines()
    probe = next((m for m in map(PROBE_RE.match, lines) if m), None)
    parsed = {
        "reported_duration_s": next((float(m.group(1)) for m in map(OUT_DURATION_RE.match, lines) if m), None),
        "probe": probe.group(0) if probe else None,
        "output_tail": output[-2000:],
    }
    if rc != 0:
        return _fail("vertical_out", parsed, rc, output, "verticalize.py")
    return {"vertical_out": parsed, "status": "running"}


def verify_vertical(state: IntakeState) -> IntakeState:
    """Independent from-disk probe — the geometry rule (1080x1920 SAR 1:1) is the
    one that silently ships a STRETCHED video when violated."""
    if state.get("stub"):
        return {"vertical_out": {**state.get("vertical_out", {}), "verified": "(stub - skipped)"},
                "status": "running"}
    v = state["vertical"]
    geo = _ffprobe_geometry(v)
    if geo is None:
        return {"status": "failed", "error": f"vertical missing/unreadable: {v}"}
    w, h, sar = geo
    if (w, h) != (1080, 1920) or sar not in ("1:1", "N/A", "?"):
        return {"status": "failed",
                "error": f"vertical geometry {w}x{h} SAR {sar} — must be 1080x1920 SAR 1:1"}
    d = _ffprobe_duration(v)
    md = state.get("master_duration_s") or 0
    if d is None or (md and abs(d - md) > 2.0):
        return {"status": "failed",
                "error": f"vertical duration {d} vs master {md:.1f}s (>2s off)"}
    return {"vertical_out": {**state.get("vertical_out", {}), "duration_s": round(d, 1),
                             "geometry": f"{w}x{h} SAR {sar}"},
            "status": "running"}


def transcribe(state: IntakeState) -> IntakeState:
    """Phase 2 Step 1: local Whisper (small, word timestamps) on the VERTICAL."""
    Path(state["tdir"]).mkdir(parents=True, exist_ok=True)
    real = [sys.executable, "-u", "-m", "whisper", state["vertical"],
            "--model", "small", "--word_timestamps", "True",
            "--output_format", "json", "--output_dir", state["tdir"]]
    cmd = _cmd_for(state, "transcribe", real)
    rc, output = _run_streaming(cmd, node="transcribe", stub=state.get("stub", ""),
                                total_s=state.get("master_duration_s"))
    parsed = {"output_tail": output[-1500:]}
    if rc != 0:
        return _fail("transcribe_out", parsed, rc, output, "whisper")
    return {"transcribe_out": parsed, "status": "running"}


def verify_transcribe(state: IntakeState) -> IntakeState:
    if state.get("stub"):
        return {"transcribe_out": {"verified": "(stub - skipped)", "words": 0},
                "status": "running"}
    tj = state["tjson"]
    data = _read_json(tj, None)
    if not isinstance(data, dict) or not data.get("segments"):
        return {"status": "failed", "error": f"whisper JSON missing/empty: {tj}"}
    words = sum(len(s.get("words", [])) for s in data["segments"])
    if words == 0:
        return {"status": "failed",
                "error": "whisper JSON has no word timestamps (--word_timestamps lost?)"}
    last_end = max((s.get("end", 0) for s in data["segments"]), default=0)
    md = state.get("master_duration_s") or 0
    if md and last_end < 0.8 * md:
        return {"status": "failed",
                "error": f"transcript covers only {last_end:.0f}s of a {md:.0f}s stream "
                         "(whisper died early?)"}
    return {"transcribe_out": {**state.get("transcribe_out", {}), "words": words,
                               "segments": len(data["segments"]),
                               "covered_s": round(last_end, 1)},
            "status": "running"}


def derive(state: IntakeState) -> IntakeState:
    """Phase 2 Steps 2-3 in the CORRECT order: glossary fixes on the JSON first
    (fix_transcript_glossary.py), THEN parse/chunk so _plain/_words/_chunks_90s
    inherit the corrections."""
    outputs = []
    for label, real in (
        ("glossary", _script_cmd("fix_transcript_glossary.py", state["tjson"])),
        ("parse", _script_cmd("parse_transcript.py", state["tjson"])),
        ("chunk", _script_cmd("chunk_transcript.py", state["tjson"])),
    ):
        cmd = _cmd_for(state, "derive", real)
        rc, output = _run_streaming(cmd, node="derive", stub=state.get("stub", ""))
        outputs.append(output)
        if rc != 0:
            return _fail("derive_out", {"step": label}, rc, output, label)
        if state.get("stub"):
            break                              # one stub invocation covers the node
    all_out = "\n".join(outputs)
    lines = all_out.splitlines()
    parsed = {
        "glossary": next((m.group(1) for m in map(GLOSSARY_RE.match, lines) if m), None),
        "flags": [m.group(1) for m in map(FLAG_RE.match, lines) if m and m.group(1) != "none"],
        "output_tail": all_out[-1500:],
    }
    return {"derive_out": parsed, "status": "running"}


def verify_derive(state: IntakeState) -> IntakeState:
    """Final verify: the three text artifacts exist and are non-trivial, then the
    whole-run summary is assembled (this is what the report + dashboard show)."""
    if not state.get("stub"):
        base = os.path.splitext(state["tjson"])[0]
        missing = [p for p in (base + "_plain.txt", base + "_words.txt",
                               base + "_chunks_90s.txt")
                   if not os.path.isfile(p) or os.path.getsize(p) == 0]
        if missing:
            return {"status": "failed",
                    "error": "derived artifacts missing/empty: "
                             + ", ".join(os.path.basename(m) for m in missing)}
    lf = state.get("longform_out", {})
    q = state.get("queue_out", {})
    summary = {
        "slug": state.get("slug"),
        "sandbox": bool(state.get("test_sandbox")),
        "master_duration_s": state.get("master_duration_s"),
        "master_mbps": state.get("encode_out", {}).get("mbps"),
        "longform": ("skipped" if state.get("skip_longform") else {
            "duration_s": lf.get("duration_s") or lf.get("reported_duration_s"),
            "removed_s": lf.get("removed_s"),
            "mbps": lf.get("mbps"),
            "thumb_staged": lf.get("thumb_staged"),
            "queued_id": q.get("queued_id"),
            "already_present": q.get("already_present"),
            "queue_total": q.get("entry_total"),
        }),
        "vertical": {"geometry": state.get("vertical_out", {}).get("geometry"),
                     "duration_s": state.get("vertical_out", {}).get("duration_s")},
        "words": state.get("transcribe_out", {}).get("words"),
        "segments": state.get("transcribe_out", {}).get("segments"),
        "glossary": state.get("derive_out", {}).get("glossary"),
        "flags": state.get("derive_out", {}).get("flags", []),
    }
    return {"intake": summary, "status": "done"}


# ── routing ──────────────────────────────────────────────────────────────────

def _route(next_name):
    def route(state):
        return next_name if state.get("status") == "running" else "halt"
    return route


def route_after_verify_encode(state: IntakeState) -> str:
    if state.get("status") != "running":
        return "halt"
    return "vertical" if state.get("skip_longform") else "longform"


def build_intake_graph(checkpointer=None):
    g = StateGraph(IntakeState)
    for name, fn in (("encode", encode), ("verify_encode", verify_encode),
                     ("longform", longform), ("verify_longform", verify_longform),
                     ("queue", queue), ("verify_queue", verify_queue),
                     ("vertical", vertical), ("verify_vertical", verify_vertical),
                     ("transcribe", transcribe), ("verify_transcribe", verify_transcribe),
                     ("derive", derive), ("verify_derive", verify_derive)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "encode")
    g.add_conditional_edges("encode", _route("verify_encode"),
                            {"verify_encode": "verify_encode", "halt": END})
    g.add_conditional_edges("verify_encode", route_after_verify_encode,
                            {"longform": "longform", "vertical": "vertical", "halt": END})
    g.add_conditional_edges("longform", _route("verify_longform"),
                            {"verify_longform": "verify_longform", "halt": END})
    g.add_conditional_edges("verify_longform", _route("queue"),
                            {"queue": "queue", "halt": END})
    g.add_conditional_edges("queue", _route("verify_queue"),
                            {"verify_queue": "verify_queue", "halt": END})
    g.add_conditional_edges("verify_queue", _route("vertical"),
                            {"vertical": "vertical", "halt": END})
    g.add_conditional_edges("vertical", _route("verify_vertical"),
                            {"verify_vertical": "verify_vertical", "halt": END})
    g.add_conditional_edges("verify_vertical", _route("transcribe"),
                            {"transcribe": "transcribe", "halt": END})
    g.add_conditional_edges("transcribe", _route("verify_transcribe"),
                            {"verify_transcribe": "verify_transcribe", "halt": END})
    g.add_conditional_edges("verify_transcribe", _route("derive"),
                            {"derive": "derive", "halt": END})
    g.add_conditional_edges("derive", _route("verify_derive"),
                            {"verify_derive": "verify_derive", "halt": END})
    g.add_edge("verify_derive", END)
    return g.compile(checkpointer=checkpointer)
