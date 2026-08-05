# shorts_graph.py — livestream-repurpose Lane 2 (shorts) segments as LangGraph StateGraphs.
#
# Wave 2 (2026-08-04): the CUT segment (Phase 4 exec). Same doctrine as
# intake_graph.py (the template — read its header): blessed scripts wrapped as
# subprocesses, disk is the contract, zero retries, verify nodes HALT, SQLite
# checkpoints, stub + sandbox modes, runs feed the :8766 dashboard.
#
# ONE graph = ONE mechanical segment. The cut segment starts AFTER the
# clip-strategist's judgment lands on disk (clip-plan.json) and ENDS at Mike's
# Phase 4b dashboard review — the seam stays a seam; no interrupts.
#
#   START -> cut -> verify_cut -> finalize -> verify_finalize -> END
#   any node:    -> (failed) -> END                  <- HALT route
#
# Plan validation is fail-fast in run.py (like validate_meta for intake), and
# again inside cut_topics.py itself; the verify nodes trust only the disk.
# Wave 3+ segments (tighten, finish, render, publish) will be added here as they
# are built and blessed, one wave per real stream.

import json
import re
import sys
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
from intake_graph import (  # noqa: E402
    _fail, _ffprobe_duration, _ffprobe_geometry, _read_json, _run_streaming,
    _script_cmd,
)

CUT_RE = re.compile(r"^CUT n=(\d+) slug=(\S+) segs=(\d+) dur=([\d.]+)")
DASHBOARD_RE = re.compile(r"^DASHBOARD=(.+)")
REGISTERED_RE = re.compile(r"^REGISTERED=(.+)")
PROGRESSFILE_RE = re.compile(r"^PROGRESSFILE=(.+)")


class CutState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    batch: str
    plan_path: str
    master: str
    out_base: str            # shorts/<batch>/ (or its sandbox twin)
    registry_root: str       # dir holding batches.json (repo root, or the sandbox)
    run_date: str
    note: Optional[str]
    no_register: bool
    force: bool
    test_sandbox: str        # "" = real run
    stub: str                # "" = real; ok|fail = structural test
    # derived by run.py from the validated plan (nodes never re-derive)
    expected: list           # [{n, slug, sum_s}] per clip, from the plan's segments
    master_geometry: str     # "WxH" — every cut clip must match the master
    # bookkeeping
    cut_out: dict
    finalize_out: dict
    cut: dict                # verify_finalize's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


# ── stubs (structural tests — no ffmpeg, no writes) ──────────────────────────

def _stub_script(node: str, kind: str) -> str:
    if kind == "fail":
        return ("import sys\n"
                'print("stub: pretending to cut")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "cut": ['print("CUT n=1 slug=stub-clip segs=2 dur=42.000")',
                'print("PROGRESS 50% clip 1/2")',
                'print("CUT n=2 slug=stub-clip-b segs=1 dur=21.000")',
                'print("PROGRESS 100% clip 2/2")',
                'print("RESULTS=stub_cut_results.json")',
                'print("STAGE-DONE cut")'],
        "finalize": ['print("DASHBOARD=stub-dashboard.html")',
                     'print("REGISTERED=stub-batch")',
                     'print("PROGRESSFILE=stub-progress.json")',
                     'print("STAGE-DONE finalize")'],
    }[node]
    return "\n".join(lines)


def _cmd_for(state: CutState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_script(node, state["stub"])]
    return real_cmd


def _cut_cmd(state: CutState, stage: str):
    args = ["cut_topics.py", "--batch", state["batch"], "--stage", stage,
            "--plan", state["plan_path"], "--master", state["master"],
            "--out-base", state["out_base"],
            "--registry-root", state["registry_root"],
            "--date", state["run_date"]]
    if state.get("note"):
        args += ["--note", state["note"]]
    if state.get("no_register"):
        args += ["--no-register"]
    if state.get("force"):
        args += ["--force"]
    return _script_cmd(*args)


# ── nodes ────────────────────────────────────────────────────────────────────

def cut(state: CutState) -> CutState:
    """Phase 4 exec: cut every planned clip from the vertical master
    (cut_topics.py --stage cut; re-encode, never -c copy)."""
    cmd = _cmd_for(state, "cut", _cut_cmd(state, "cut"))
    rc, output = _run_streaming(cmd, lane=2, node="cut", stub=state.get("stub", ""))
    lines = output.splitlines()
    cuts = [{"n": int(m.group(1)), "slug": m.group(2), "segs": int(m.group(3)),
             "dur": float(m.group(4))}
            for m in map(CUT_RE.match, lines) if m]
    parsed = {"clips_cut": len(cuts), "cuts": cuts, "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("cut_out", parsed, rc, output, "cut_topics.py --stage cut")
    return {"cut_out": parsed, "status": "running"}


def verify_cut(state: CutState) -> CutState:
    """Trust the disk: every planned clip exists, matches its plan-sum duration,
    and carries the master's exact geometry (a wrong-master cut ships stretched)."""
    if state.get("stub"):
        return {"cut_out": {**state.get("cut_out", {}), "verified": "(stub - skipped)"},
                "status": "running"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])
    reported = {c["slug"]: c for c in state.get("cut_out", {}).get("cuts", [])}
    results = _read_json(out_base / "_cut_results.json", None)
    if not isinstance(results, list) or len(results) != len(expected):
        return {"status": "failed",
                "error": f"_cut_results.json missing or has {len(results) if isinstance(results, list) else 'no'} "
                         f"entries for {len(expected)} planned clips"}
    total = 0.0
    for e in expected:
        mp4 = out_base / e["slug"] / f"{e['slug']}-full.mp4"
        d = _ffprobe_duration(mp4)
        if d is None:
            return {"status": "failed", "error": f"cut clip missing/unreadable: {mp4}"}
        if abs(d - e["sum_s"]) > 1.0:
            return {"status": "failed",
                    "error": f"{e['slug']}: duration {d:.2f}s != plan segment sum "
                             f"{e['sum_s']:.2f}s (>1s off — wrong segments cut?)"}
        geo = _ffprobe_geometry(mp4)
        geom = f"{geo[0]}x{geo[1]}" if geo else "?"
        if geom != state.get("master_geometry"):
            return {"status": "failed",
                    "error": f"{e['slug']}: geometry {geom} != master "
                             f"{state.get('master_geometry')} — cut from the wrong file?"}
        if e["slug"] not in reported:
            return {"status": "failed",
                    "error": f"{e['slug']}: on disk but never reported by the cutter "
                             "(output parsing broke?)"}
        total += d
    return {"cut_out": {**state.get("cut_out", {}), "total_s": round(total, 1)},
            "status": "running"}


def finalize(state: CutState) -> CutState:
    """Dashboard (canonical builder, in place) + batches.json registration
    (cleanup protection) + progress.json init (cut_topics.py --stage finalize)."""
    cmd = _cmd_for(state, "finalize", _cut_cmd(state, "finalize"))
    rc, output = _run_streaming(cmd, lane=2, node="finalize", stub=state.get("stub", ""))
    lines = output.splitlines()
    parsed = {
        "dashboard": next((m.group(1) for m in map(DASHBOARD_RE.match, lines) if m), None),
        "registered": next((m.group(1) for m in map(REGISTERED_RE.match, lines) if m), None),
        "progress_file": next((m.group(1) for m in map(PROGRESSFILE_RE.match, lines) if m), None),
        "output_tail": output[-1500:],
    }
    if rc != 0:
        return _fail("finalize_out", parsed, rc, output, "cut_topics.py --stage finalize")
    return {"finalize_out": parsed, "status": "running"}


def verify_finalize(state: CutState) -> CutState:
    """From-disk: dashboard carries every clip, the registry protects the batch,
    progress.json is initialized at the 4b gate. Then assemble the run summary."""
    if state.get("stub"):
        return {"cut": {"batch": state.get("batch"), "stub": True,
                        "clips": state.get("cut_out", {}).get("clips_cut", 0)},
                "status": "done"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])

    dash = out_base / "dashboard.html"
    if not dash.is_file() or dash.stat().st_size == 0:
        return {"status": "failed", "error": f"dashboard missing/empty: {dash}"}
    html = dash.read_text(encoding="utf-8", errors="replace")
    for e in expected:
        if e["slug"] not in html:
            return {"status": "failed",
                    "error": f"dashboard.html does not reference clip {e['slug']}"}
        if f"Clip {e['n']}" not in html:
            return {"status": "failed",
                    "error": f"dashboard.html has no 'Clip {e['n']}' chip (numbering broke?)"}

    registered = False
    if not state.get("no_register"):
        reg = _read_json(Path(state["registry_root"]) / "batches.json", {})
        entry = next((b for b in reg.get("batches", [])
                      if b.get("batch") == state["batch"]), None)
        if not entry:
            return {"status": "failed",
                    "error": f"batches.json has no entry for {state['batch']} after register"}
        if entry.get("status") != "active":
            return {"status": "failed",
                    "error": f"registered batch status {entry.get('status')!r} != 'active' "
                             "(cleanup would not protect it)"}
        registered = True

    prog = _read_json(out_base / "progress.json", None)
    if not isinstance(prog, dict):
        return {"status": "failed", "error": f"progress.json missing/unparseable in {out_base}"}
    pclips = prog.get("clips", [])
    if len(pclips) != len(expected):
        return {"status": "failed",
                "error": f"progress.json has {len(pclips)} clips, plan has {len(expected)}"}
    bad = [c.get("slug") for c in pclips
           if c.get("phase") != "cut" or c.get("gate") != "awaiting-4b-review"]
    if bad:
        return {"status": "failed",
                "error": f"progress.json clips not at the 4b gate: {bad}"}

    summary = {
        "batch": state.get("batch"),
        "sandbox": bool(state.get("test_sandbox")),
        "clips": len(expected),
        "total_s": state.get("cut_out", {}).get("total_s"),
        "dashboard": str(dash),
        "registered": registered,
        "clip_durations": {c["slug"]: c["dur"]
                           for c in state.get("cut_out", {}).get("cuts", [])},
    }
    return {"cut": summary, "status": "done"}


# ── routing ──────────────────────────────────────────────────────────────────

def _route(next_name):
    def route(state):
        return next_name if state.get("status") == "running" else "halt"
    return route


def build_cut_graph(checkpointer=None):
    g = StateGraph(CutState)
    for name, fn in (("cut", cut), ("verify_cut", verify_cut),
                     ("finalize", finalize), ("verify_finalize", verify_finalize)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "cut")
    g.add_conditional_edges("cut", _route("verify_cut"),
                            {"verify_cut": "verify_cut", "halt": END})
    g.add_conditional_edges("verify_cut", _route("finalize"),
                            {"finalize": "finalize", "halt": END})
    g.add_conditional_edges("finalize", _route("verify_finalize"),
                            {"verify_finalize": "verify_finalize", "halt": END})
    g.add_edge("verify_finalize", END)
    return g.compile(checkpointer=checkpointer)
