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
# Wave 3 (2026-08-05): the TIGHTEN segment (Phase 5 exec + 5B desilence),
# wrapping the canonical scripts/tighten_clips.py (de-forks the frozen
# tighten_clips_<batch>.py hand-forks). Starts AFTER Mike's 4b verdicts have
# been applied to clip-plan.json AND the tighten-strategists' judgment lands
# on disk (tighten-plan.json); the min-sil 5B knob travels IN the invocation
# (Mike's per-batch call). ENDS at Mike's 2nd review of the tightened clips.
#
#   START -> tighten -> verify_tighten -> finalize -> verify_finalize -> END
#   (same halt route on every node)
#
# Plan validation is fail-fast in run.py (like validate_meta for intake), and
# again inside cut_topics.py / tighten_clips.py themselves; the verify nodes
# trust only the disk.
#
# Wave 4 (2026-08-07): the FINISH segment (Phase 5C fillers + Phase 6 caption
# source + render-assets staging), wrapping the canonical scripts/finish_batch.py.
# Starts AFTER Mike's 2nd review of the tightened clips (the invocation IS the
# record of his approval — the human decision travels IN the invocation) and an
# OPTIONAL filler-plan.json (5C span adjudication is judgment; no plan = all
# passthrough). ENDS at the builder frontier: Phase 7 (remotion-builder agents,
# ChatGPT b-roll, comps, SFX, renders) stays agent territory.
#
#   START -> fillers -> verify_fillers -> transcribe -> verify_transcribe
#         -> assets -> verify_assets -> finalize -> verify_finalize -> END
#   (same halt route on every node)
#
# Wave 5 (2026-08-07): the PUBLISH segment (Phase 8 exec), wrapping the
# already-Python scripts/publish-shorts.py + scripts/persona-lint.py. Starts
# AFTER Mike gates the renders AND says publish, with the judgment fields
# (hook/caption/tags/title) authored BEFORE the run in publish-meta.json (the
# longform-meta.json contract). verify_publish mechanizes the standing manual
# sweeps: staged-copy md5 vs the FINAL render (the 2026-07-23 stale-stage
# hazard), complete entries, all 7 platforms pending. POSTING stays Mike-gated
# and sequential — this segment stages the queue, it never posts.
#
#   START -> publish -> verify_publish -> lint -> verify_lint -> END
#   (same halt route on every node)

import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
from intake_graph import (  # noqa: E402
    REPO_ROOT, SCRIPTS, _fail, _ffprobe_duration, _ffprobe_geometry, _read_json,
    _run_streaming, _script_cmd,
)

CUT_RE = re.compile(r"^CUT n=(\d+) slug=(\S+) segs=(\d+) dur=([\d.]+)")
TIGHT_RE = re.compile(r"^TIGHT n=(\d+) slug=(\S+) cuts=(\d+) tight=([\d.]+) desil=([\d.]+)")
LOG_RE = re.compile(r"^LOG=(.+)")
DASHBOARD_RE = re.compile(r"^DASHBOARD=(.+)")
REGISTERED_RE = re.compile(r"^REGISTERED=(.+)")
PROGRESSFILE_RE = re.compile(r"^PROGRESSFILE=(.+)")
FILLER_RE = re.compile(r"^FILLER n=(\d+) slug=(\S+) mode=(\S+) removed=([\d.]+) out=([\d.]+)")
SPINE_RE = re.compile(r"^SPINE slug=(\S+) src=(\S+) dur=([\d.]+)")
ENTRY_RE = re.compile(r"^\s*entry (ADDED|SKIP \(present\))\s*:\s*(\S+)")


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


# ═════════════════════════════════════════════════════════════════════════════
# Wave 3 — TIGHTEN segment (Phase 5 exec + 5B desilence)
# ═════════════════════════════════════════════════════════════════════════════

class TightenState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    batch: str
    plan_path: str           # tighten-plan.json
    clip_plan_path: str
    master: str
    transcript: str          # whisper word-timestamps json (the ceiling gate's truth)
    out_base: str            # shorts/<batch>/ (or its sandbox twin)
    min_sil: float           # Mike's per-batch 5B knob — travels IN the invocation
    title: Optional[str]     # dashboard title/subtitle (publish-metadata judgment,
    subtitle: Optional[str]  # authored by the orchestrator per run)
    force: bool
    test_sandbox: str        # "" = real run
    stub: str                # "" = real; ok|fail = structural test
    # derived by run.py from the validated plans (nodes never re-derive)
    expected: list           # [{n, slug, tight_s, kept_voiced_s}] per clip
    master_geometry: str     # "WxH" — the desilenced output must match the master
    # bookkeeping
    tighten_out: dict
    finalize_out: dict
    tighten: dict            # verify_finalize's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


def _stub_tighten_script(node: str, kind: str) -> str:
    if kind == "fail":
        return ("import sys\n"
                'print("stub: pretending to tighten")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "tighten": ['print("TIGHT n=1 slug=stub-clip cuts=3 tight=42.000 desil=39.500")',
                    'print("PROGRESS 50% clip 1/2")',
                    'print("TIGHT n=2 slug=stub-clip-b cuts=1 tight=21.000 desil=20.100")',
                    'print("PROGRESS 100% clip 2/2")',
                    'print("LOG=stub_tighten_log.json")',
                    'print("STAGE-DONE tighten")'],
        "finalize": ['print("DASHBOARD=stub-dashboard.html")',
                     'print("PROGRESSFILE=stub-progress.json")',
                     'print("STAGE-DONE finalize")'],
    }[node]
    return "\n".join(lines)


def _tighten_cmd_for(state: TightenState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_tighten_script(node, state["stub"])]
    return real_cmd


def _tighten_cmd(state: TightenState, stage: str):
    args = ["tighten_clips.py", "--batch", state["batch"], "--stage", stage,
            "--plan", state["plan_path"], "--clip-plan", state["clip_plan_path"],
            "--master", state["master"], "--transcript", state["transcript"],
            "--out-base", state["out_base"],
            "--min-sil", str(state["min_sil"])]
    if state.get("title"):
        args += ["--title", state["title"]]
    if state.get("subtitle"):
        args += ["--subtitle", state["subtitle"]]
    if state.get("force"):
        args += ["--force"]
    return _script_cmd(*args)


# ── nodes ────────────────────────────────────────────────────────────────────

def tighten(state: TightenState) -> TightenState:
    """Phase 5 exec + 5B: tighten every planned clip off the vertical master and
    desilence via the ONE canonical desilencer at Mike's min-sil
    (tighten_clips.py --stage tighten)."""
    cmd = _tighten_cmd_for(state, "tighten", _tighten_cmd(state, "tighten"))
    rc, output = _run_streaming(cmd, lane=3, node="tighten", stub=state.get("stub", ""))
    lines = output.splitlines()
    tights = [{"n": int(m.group(1)), "slug": m.group(2), "cuts": int(m.group(3)),
               "tight_s": float(m.group(4)), "desil_s": float(m.group(5))}
              for m in map(TIGHT_RE.match, lines) if m]
    parsed = {"clips_tightened": len(tights), "tights": tights,
              "log": next((m.group(1) for m in map(LOG_RE.match, lines) if m), None),
              "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("tighten_out", parsed, rc, output, "tighten_clips.py --stage tighten")
    return {"tighten_out": parsed, "status": "running"}


def verify_tighten(state: TightenState) -> TightenState:
    """Trust the disk: every planned clip has a tightened render matching the
    plan-computed keep-span sum, and a desilenced render that is no longer than
    the tightened one but still holds every kept Whisper word."""
    if state.get("stub"):
        return {"tighten_out": {**state.get("tighten_out", {}),
                                "verified": "(stub - skipped)"},
                "status": "running"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])
    reported = {t["slug"]: t for t in state.get("tighten_out", {}).get("tights", [])}

    log = _read_json(out_base / "tighten_log.json", None)
    if not isinstance(log, list) or len(log) != len(expected):
        return {"status": "failed",
                "error": f"tighten_log.json missing or has "
                         f"{len(log) if isinstance(log, list) else 'no'} entries for "
                         f"{len(expected)} planned clips"}
    logged = {e.get("slug") for e in log}

    total = 0.0
    for e in expected:
        slug = e["slug"]
        if slug not in logged:
            return {"status": "failed", "error": f"{slug}: no tighten_log.json entry"}
        if slug not in reported:
            return {"status": "failed",
                    "error": f"{slug}: on disk but never reported by the tightener "
                             "(output parsing broke?)"}
        tight = out_base / slug / f"{slug}-tightened.mp4"
        desil = out_base / slug / f"{slug}-tightened-desilenced.mp4"
        td = _ffprobe_duration(tight)
        if td is None:
            return {"status": "failed", "error": f"tightened clip missing/unreadable: {tight}"}
        if abs(td - e["tight_s"]) > 1.0:
            return {"status": "failed",
                    "error": f"{slug}: tightened duration {td:.2f}s != plan keep-span sum "
                             f"{e['tight_s']:.2f}s (>1s off — wrong spans cut?)"}
        dd = _ffprobe_duration(desil)
        if dd is None:
            return {"status": "failed", "error": f"desilenced clip missing/unreadable: {desil}"}
        if dd > td + 0.5:
            return {"status": "failed",
                    "error": f"{slug}: desilenced {dd:.2f}s LONGER than tightened {td:.2f}s"}
        # Structural swallow guard only. Whisper word spans OVERCOUNT voiced time (word
        # boundaries bleed into pauses), so they are a ratio tool (the ceiling gate), never
        # an absolute floor — the sandbox bless proved a healthy 23% silence removal reads
        # as "ate speech" against a whisper-span floor. Real desilence removals on tightened
        # shorts run ~20-30%; a catastrophic swallow leaves far less than 35% standing.
        # Word-level speech QA stays where it lives: the desilencer's own guard + Mike's
        # 2nd review.
        if dd < td * 0.35:
            return {"status": "failed",
                    "error": f"{slug}: desilenced {dd:.2f}s is under 35% of the tightened "
                             f"{td:.2f}s — the desilencer ate speech (swallow guard)"}
        geo = _ffprobe_geometry(desil)
        geom = f"{geo[0]}x{geo[1]}" if geo else "?"
        if geom != state.get("master_geometry"):
            return {"status": "failed",
                    "error": f"{slug}: geometry {geom} != master "
                             f"{state.get('master_geometry')} — tightened from the wrong file?"}
        total += dd
    return {"tighten_out": {**state.get("tighten_out", {}), "total_s": round(total, 1)},
            "status": "running"}


def finalize_tighten(state: TightenState) -> TightenState:
    """Dashboard rebuild IN PLACE (canonical builder) + progress.json to the
    2nd-review gate (tighten_clips.py --stage finalize)."""
    cmd = _tighten_cmd_for(state, "finalize", _tighten_cmd(state, "finalize"))
    rc, output = _run_streaming(cmd, lane=3, node="finalize", stub=state.get("stub", ""))
    lines = output.splitlines()
    parsed = {
        "dashboard": next((m.group(1) for m in map(DASHBOARD_RE.match, lines) if m), None),
        "progress_file": next((m.group(1) for m in map(PROGRESSFILE_RE.match, lines) if m), None),
        "output_tail": output[-1500:],
    }
    if rc != 0:
        return _fail("finalize_out", parsed, rc, output, "tighten_clips.py --stage finalize")
    return {"finalize_out": parsed, "status": "running"}


def verify_finalize_tighten(state: TightenState) -> TightenState:
    """From-disk: the dashboard carries every tightened clip, progress.json sits
    at the 2nd-review gate. Then assemble the run summary."""
    if state.get("stub"):
        return {"tighten": {"batch": state.get("batch"), "stub": True,
                            "clips": state.get("tighten_out", {}).get("clips_tightened", 0)},
                "status": "done"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])

    dash = out_base / "dashboard.html"
    if not dash.is_file() or dash.stat().st_size == 0:
        return {"status": "failed", "error": f"dashboard missing/empty: {dash}"}
    html = dash.read_text(encoding="utf-8", errors="replace")
    if "tightened+desilenced" not in html:
        return {"status": "failed",
                "error": "dashboard.html carries no 'tightened+desilenced' status — "
                         "rebuilt from the wrong stage?"}
    for e in expected:
        if f"{e['slug']}/{e['slug']}-tightened-desilenced.mp4" not in html:
            return {"status": "failed",
                    "error": f"dashboard.html does not reference {e['slug']}'s "
                             "tightened-desilenced render"}
        if f"Clip {e['n']}" not in html:
            return {"status": "failed",
                    "error": f"dashboard.html has no 'Clip {e['n']}' chip (numbering broke?)"}

    prog = _read_json(out_base / "progress.json", None)
    if not isinstance(prog, dict):
        return {"status": "failed", "error": f"progress.json missing/unparseable in {out_base}"}
    if prog.get("phase") != "5B-desilenced":
        return {"status": "failed",
                "error": f"progress.json phase {prog.get('phase')!r} != '5B-desilenced'"}
    pclips = {c.get("slug"): c for c in prog.get("clips", [])}
    bad = [e["slug"] for e in expected
           if pclips.get(e["slug"], {}).get("phase") != "5B-desilenced"
           or pclips.get(e["slug"], {}).get("gate") != "awaiting-2nd-review"]
    if bad:
        return {"status": "failed",
                "error": f"progress.json clips not at the 2nd-review gate: {bad}"}

    summary = {
        "batch": state.get("batch"),
        "sandbox": bool(state.get("test_sandbox")),
        "clips": len(expected),
        "total_s": state.get("tighten_out", {}).get("total_s"),
        "min_sil": state.get("min_sil"),
        "dashboard": str(dash),
        "clip_durations": {t["slug"]: t["desil_s"]
                           for t in state.get("tighten_out", {}).get("tights", [])},
    }
    return {"tighten": summary, "status": "done"}


def build_tighten_graph(checkpointer=None):
    g = StateGraph(TightenState)
    for name, fn in (("tighten", tighten), ("verify_tighten", verify_tighten),
                     ("finalize", finalize_tighten),
                     ("verify_finalize", verify_finalize_tighten)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "tighten")
    g.add_conditional_edges("tighten", _route("verify_tighten"),
                            {"verify_tighten": "verify_tighten", "halt": END})
    g.add_conditional_edges("verify_tighten", _route("finalize"),
                            {"finalize": "finalize", "halt": END})
    g.add_conditional_edges("finalize", _route("verify_finalize"),
                            {"verify_finalize": "verify_finalize", "halt": END})
    g.add_edge("verify_finalize", END)
    return g.compile(checkpointer=checkpointer)


# ═════════════════════════════════════════════════════════════════════════════
# Wave 4 — FINISH segment (Phase 5C fillers + Phase 6 caption source + assets)
# ═════════════════════════════════════════════════════════════════════════════

class FinishState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    batch: str
    plan_path: str           # filler-plan.json ("" = none on disk = all passthrough)
    out_base: str            # shorts/<batch>/ (or its sandbox twin)
    assets_root: str         # "" = default shared assets root
    model: str               # whisper model for the caption source
    title: Optional[str]
    subtitle: Optional[str]
    force: bool
    test_sandbox: str        # "" = real run
    stub: str                # "" = real; ok|fail = structural test
    # derived by run.py from the validated plan + probed spines (nodes never re-derive)
    expected: list           # [{n, slug, base_s, removed_s, n_spans}] per clip
    # bookkeeping
    fillers_out: dict
    transcribe_out: dict
    assets_out: dict
    finalize_out: dict
    finish: dict             # verify_finalize's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


def _stub_finish_script(node: str, kind: str) -> str:
    if kind == "fail":
        return ("import sys\n"
                'print("stub: pretending to finish")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "fillers": ['print("FILLER n=1 slug=stub-clip mode=cut removed=1.20 out=40.800")',
                    'print("PROGRESS 50% clip 1/2")',
                    'print("FILLER n=2 slug=stub-clip-b mode=passthrough removed=0.00 out=21.000")',
                    'print("PROGRESS 100% clip 2/2")',
                    'print("LOG=stub_filler_log.json")',
                    'print("STAGE-DONE fillers")'],
        "transcribe": ['print("  n=1 stub-clip: transcribing stub-clip-final.mp4 ...")',
                       'print("     -> 123 words, 1s -> whisper-words.json")',
                       'print("STAGE-DONE transcribe")'],
        "assets": ['print("RENDER-ASSETS=stub-render-assets")',
                   'print("SPINE slug=stub-clip src=stub-clip-final.mp4 dur=40.800")',
                   'print("SPINE slug=stub-clip-b src=stub-clip-b-final.mp4 dur=21.000")',
                   'print("STAGE-DONE assets")'],
        "finalize": ['print("DASHBOARD=stub-dashboard.html")',
                     'print("PROGRESSFILE=stub-progress.json")',
                     'print("STAGE-DONE finalize")'],
    }[node]
    return "\n".join(lines)


def _finish_cmd_for(state: FinishState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_finish_script(node, state["stub"])]
    return real_cmd


def _finish_cmd(state: FinishState, stage: str):
    args = ["finish_batch.py", "--batch", state["batch"], "--stage", stage,
            "--out-base", state["out_base"], "--model", state.get("model") or "medium"]
    if state.get("plan_path"):
        args += ["--plan", state["plan_path"]]
    if state.get("assets_root"):
        args += ["--assets-root", state["assets_root"]]
    if state.get("title"):
        args += ["--title", state["title"]]
    if state.get("subtitle"):
        args += ["--subtitle", state["subtitle"]]
    if state.get("force"):
        args += ["--force"]
    return _script_cmd(*args)


# ── nodes ────────────────────────────────────────────────────────────────────

def fillers(state: FinishState) -> FinishState:
    """Phase 5C exec: approved spans cut via the canonical cut_fillers.py, every
    other clip passthrough-copied — all end at <slug>-final.mp4
    (finish_batch.py --stage fillers)."""
    cmd = _finish_cmd_for(state, "fillers", _finish_cmd(state, "fillers"))
    rc, output = _run_streaming(cmd, lane=4, node="fillers", stub=state.get("stub", ""))
    lines = output.splitlines()
    cuts = [{"n": int(m.group(1)), "slug": m.group(2), "mode": m.group(3),
             "removed_s": float(m.group(4)), "out_s": float(m.group(5))}
            for m in map(FILLER_RE.match, lines) if m]
    parsed = {"clips_finished": len(cuts), "fillers": cuts,
              "log": next((m.group(1) for m in map(LOG_RE.match, lines) if m), None),
              "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("fillers_out", parsed, rc, output, "finish_batch.py --stage fillers")
    return {"fillers_out": parsed, "status": "running"}


def verify_fillers(state: FinishState) -> FinishState:
    """Trust the disk: every clip has a -final.mp4 whose duration matches
    base minus the approved spans (snap tolerance), never below the 5C ceiling."""
    if state.get("stub"):
        return {"fillers_out": {**state.get("fillers_out", {}),
                                "verified": "(stub - skipped)"},
                "status": "running"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])
    reported = {f["slug"]: f for f in state.get("fillers_out", {}).get("fillers", [])}

    log = _read_json(out_base / "filler_log.json", None)
    if not isinstance(log, list) or len(log) != len(expected):
        return {"status": "failed",
                "error": f"filler_log.json missing or has "
                         f"{len(log) if isinstance(log, list) else 'no'} entries for "
                         f"{len(expected)} clips"}
    logged = {e.get("slug") for e in log}

    total = 0.0
    for e in expected:
        slug = e["slug"]
        if slug not in logged:
            return {"status": "failed", "error": f"{slug}: no filler_log.json entry"}
        if slug not in reported:
            return {"status": "failed",
                    "error": f"{slug}: on disk but never reported by finish_batch "
                             "(output parsing broke?)"}
        final = out_base / slug / f"{slug}-final.mp4"
        d = _ffprobe_duration(final)
        if d is None:
            return {"status": "failed", "error": f"final spine missing/unreadable: {final}"}
        # cut_fillers may snap each boundary +/-0.10s to the RMS minimum
        tol = 0.15 if e["n_spans"] == 0 else 0.3 + 0.2 * e["n_spans"]
        want = e["base_s"] - e["removed_s"]
        if abs(d - want) > tol:
            return {"status": "failed",
                    "error": f"{slug}: final {d:.2f}s != expected {want:.2f}s "
                             f"(±{tol:.2f}s — wrong spans cut?)"}
        if d < e["base_s"] * 0.92 - 0.1:
            return {"status": "failed",
                    "error": f"{slug}: final {d:.2f}s is under 92% of the base "
                             f"{e['base_s']:.2f}s — the 5C ceiling was breached"}
        total += d
    return {"fillers_out": {**state.get("fillers_out", {}), "total_s": round(total, 1)},
            "status": "running"}


def transcribe_finish(state: FinishState) -> FinishState:
    """Phase 6 caption source: canonical transcribe_clips.py --force on every
    -final spine (finish_batch.py --stage transcribe)."""
    cmd = _finish_cmd_for(state, "transcribe", _finish_cmd(state, "transcribe"))
    rc, output = _run_streaming(cmd, lane=4, node="transcribe", stub=state.get("stub", ""))
    parsed = {"output_tail": output[-2000:]}
    if rc != 0:
        return _fail("transcribe_out", parsed, rc, output,
                     "finish_batch.py --stage transcribe")
    return {"transcribe_out": parsed, "status": "running"}


def verify_transcribe_finish(state: FinishState) -> FinishState:
    """From-disk: every clip's whisper-words.json exists, parses, holds words,
    and is NEWER than its -final spine (a stale caption source drifts every
    caption after the first 5C splice)."""
    if state.get("stub"):
        return {"transcribe_out": {**state.get("transcribe_out", {}),
                                   "verified": "(stub - skipped)"},
                "status": "running"}
    out_base = Path(state["out_base"])
    words_per = {}
    for e in state.get("expected", []):
        slug = e["slug"]
        final = out_base / slug / f"{slug}-final.mp4"
        ww = out_base / slug / "whisper-words.json"
        if not ww.is_file():
            return {"status": "failed", "error": f"{slug}: whisper-words.json missing"}
        if ww.stat().st_mtime < final.stat().st_mtime:
            return {"status": "failed",
                    "error": f"{slug}: whisper-words.json is OLDER than the -final spine "
                             "(transcribed off a stale spine?)"}
        wj = _read_json(ww, None)
        if not isinstance(wj, dict):
            return {"status": "failed", "error": f"{slug}: whisper-words.json unparseable"}
        n_words = sum(len(s.get("words", [])) for s in wj.get("segments", []))
        if n_words == 0:
            return {"status": "failed", "error": f"{slug}: whisper-words.json has no words"}
        d = _ffprobe_duration(final) or 0
        last_end = max((w.get("end", 0) for s in wj.get("segments", [])
                        for w in s.get("words", [])), default=0)
        if last_end > d + 2.0:
            return {"status": "failed",
                    "error": f"{slug}: last word at {last_end:.1f}s but the spine is "
                             f"{d:.1f}s — transcribed the wrong file?"}
        words_per[slug] = n_words
    return {"transcribe_out": {**state.get("transcribe_out", {}), "words": words_per},
            "status": "running"}


def assets(state: FinishState) -> FinishState:
    """Stage render-assets/: GOP re-encoded final spines (finish_batch.py --stage
    assets -> canonical setup_render_assets.py)."""
    cmd = _finish_cmd_for(state, "assets", _finish_cmd(state, "assets"))
    rc, output = _run_streaming(cmd, lane=4, node="assets", stub=state.get("stub", ""))
    lines = output.splitlines()
    spines = [{"slug": m.group(1), "src": m.group(2), "dur": float(m.group(3))}
              for m in map(SPINE_RE.match, lines) if m]
    parsed = {"spines": spines, "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("assets_out", parsed, rc, output, "finish_batch.py --stage assets")
    return {"assets_out": parsed, "status": "running"}


def verify_assets(state: FinishState) -> FinishState:
    """From-disk: every staged spine exists, matches its -final duration, came
    from the -final source, and passes the seek-friendly GOP check (the
    'No frame found at position N' prevention)."""
    if state.get("stub"):
        return {"assets_out": {**state.get("assets_out", {}),
                               "verified": "(stub - skipped)"},
                "status": "running"}
    sys.path.insert(0, str(SCRIPTS))
    from setup_render_assets import verify_gop  # noqa: E402  (one source of truth)

    out_base = Path(state["out_base"])
    reported = {s["slug"]: s for s in state.get("assets_out", {}).get("spines", [])}
    for e in state.get("expected", []):
        slug = e["slug"]
        staged = out_base / "render-assets" / f"{slug}.mp4"
        final = out_base / slug / f"{slug}-final.mp4"
        if slug not in reported:
            return {"status": "failed",
                    "error": f"{slug}: no SPINE line reported (staging skipped it?)"}
        if reported[slug]["src"] != f"{slug}-final.mp4":
            return {"status": "failed",
                    "error": f"{slug}: staged from {reported[slug]['src']}, expected "
                             f"{slug}-final.mp4 (stale spine selection)"}
        d = _ffprobe_duration(staged)
        fd = _ffprobe_duration(final)
        if d is None:
            return {"status": "failed", "error": f"staged spine missing/unreadable: {staged}"}
        if fd is None or abs(d - fd) > 0.25:
            return {"status": "failed",
                    "error": f"{slug}: staged {d:.2f}s != final spine {fd}s (±0.25s)"}
        err = verify_gop(staged)
        if err:
            return {"status": "failed",
                    "error": f"{slug}: staged spine fails the GOP check — {err}"}
    return {"assets_out": {**state.get("assets_out", {}), "verified": True},
            "status": "running"}


def finalize_finish(state: FinishState) -> FinishState:
    """Dashboard rebuild IN PLACE + progress.json to the ready-for-build gate
    (finish_batch.py --stage finalize)."""
    cmd = _finish_cmd_for(state, "finalize", _finish_cmd(state, "finalize"))
    rc, output = _run_streaming(cmd, lane=4, node="finalize", stub=state.get("stub", ""))
    lines = output.splitlines()
    parsed = {
        "dashboard": next((m.group(1) for m in map(DASHBOARD_RE.match, lines) if m), None),
        "progress_file": next((m.group(1) for m in map(PROGRESSFILE_RE.match, lines) if m), None),
        "output_tail": output[-1500:],
    }
    if rc != 0:
        return _fail("finalize_out", parsed, rc, output, "finish_batch.py --stage finalize")
    return {"finalize_out": parsed, "status": "running"}


def verify_finalize_finish(state: FinishState) -> FinishState:
    """From-disk: dashboard carries every -final clip at the filler-cut status,
    progress.json sits at the ready-for-build gate. Then assemble the summary."""
    if state.get("stub"):
        return {"finish": {"batch": state.get("batch"), "stub": True,
                           "clips": state.get("fillers_out", {}).get("clips_finished", 0)},
                "status": "done"}
    out_base = Path(state["out_base"])
    expected = state.get("expected", [])

    dash = out_base / "dashboard.html"
    if not dash.is_file() or dash.stat().st_size == 0:
        return {"status": "failed", "error": f"dashboard missing/empty: {dash}"}
    html = dash.read_text(encoding="utf-8", errors="replace")
    if "filler-cut (final)" not in html:
        return {"status": "failed",
                "error": "dashboard.html carries no 'filler-cut (final)' status — "
                         "rebuilt from the wrong stage?"}
    for e in expected:
        if f"{e['slug']}/{e['slug']}-final.mp4" not in html:
            return {"status": "failed",
                    "error": f"dashboard.html does not reference {e['slug']}'s final spine"}
        if f"Clip {e['n']}" not in html:
            return {"status": "failed",
                    "error": f"dashboard.html has no 'Clip {e['n']}' chip (numbering broke?)"}

    prog = _read_json(out_base / "progress.json", None)
    if not isinstance(prog, dict):
        return {"status": "failed", "error": f"progress.json missing/unparseable in {out_base}"}
    if prog.get("phase") != "6-transcribed":
        return {"status": "failed",
                "error": f"progress.json phase {prog.get('phase')!r} != '6-transcribed'"}
    pclips = {c.get("slug"): c for c in prog.get("clips", [])}
    bad = [e["slug"] for e in expected
           if pclips.get(e["slug"], {}).get("phase") != "6-transcribed"
           or pclips.get(e["slug"], {}).get("gate") != "ready-for-build"]
    if bad:
        return {"status": "failed",
                "error": f"progress.json clips not at the ready-for-build gate: {bad}"}

    summary = {
        "batch": state.get("batch"),
        "sandbox": bool(state.get("test_sandbox")),
        "clips": len(expected),
        "total_s": state.get("fillers_out", {}).get("total_s"),
        "filler_cuts": sum(1 for f in state.get("fillers_out", {}).get("fillers", [])
                           if f.get("mode") == "cut"),
        "words": state.get("transcribe_out", {}).get("words"),
        "dashboard": str(dash),
        "clip_durations": {f["slug"]: f["out_s"]
                           for f in state.get("fillers_out", {}).get("fillers", [])},
    }
    return {"finish": summary, "status": "done"}


def build_finish_graph(checkpointer=None):
    g = StateGraph(FinishState)
    for name, fn in (("fillers", fillers), ("verify_fillers", verify_fillers),
                     ("transcribe", transcribe_finish),
                     ("verify_transcribe", verify_transcribe_finish),
                     ("assets", assets), ("verify_assets", verify_assets),
                     ("finalize", finalize_finish),
                     ("verify_finalize", verify_finalize_finish)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "fillers")
    order = ["fillers", "verify_fillers", "transcribe", "verify_transcribe",
             "assets", "verify_assets", "finalize", "verify_finalize"]
    for a, b in zip(order, order[1:]):
        g.add_conditional_edges(a, _route(b), {b: b, "halt": END})
    g.add_edge("verify_finalize", END)
    return g.compile(checkpointer=checkpointer)


# ═════════════════════════════════════════════════════════════════════════════
# Wave 5 — PUBLISH segment (Phase 8 exec: stage the queue; POSTING stays Mike's)
# ═════════════════════════════════════════════════════════════════════════════

class PublishState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    batch: str
    run_date: str            # publish date — MUST stay constant across re-runs
    meta_path: str           # publish-meta.json (judgment, authored BEFORE the run)
    out_root: str            # remotion render root (contains <batch>/)
    dest_root: str           # schedule-tweets/shorts (or its sandbox twin)
    shorts_json: str
    progress_path: str
    id_prefix: str           # "" = derived from the batch name
    test_sandbox: str        # "" = real run
    stub: str                # "" = real; ok|fail = structural test
    # derived by run.py from progress + renders + meta (nodes never re-derive)
    expected: list           # [{n, slug, id, render, staged_name}] per clip
    # bookkeeping
    publish_out: dict
    lint_out: dict
    publish: dict            # verify_lint's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


def _stub_publish_script(node: str, kind: str) -> str:
    if kind == "fail":
        return ("import sys\n"
                'print("stub: pretending to publish")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "publish": ['print("  copied            : 1-stub-clip.mp4 -> shorts/stub/1-stub-clip.mp4")',
                    'print("  entry ADDED       : sb-20260101-stub-clip  (title=\'stub\', dur=42.0)")',
                    'print("Done. added 1, skipped 0 existing, copied 1 file(s).")'],
        "lint": ['print("persona-lint: all clean")'],
    }[node]
    return "\n".join(lines)


def _publish_cmd_for(state: PublishState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_publish_script(node, state["stub"])]
    return real_cmd


def _md5(path: Path) -> Optional[str]:
    try:
        h = hashlib.md5()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return None


# ── nodes ────────────────────────────────────────────────────────────────────

def publish(state: PublishState) -> PublishState:
    """Phase 8 exec: copy renders into the queue folder + append complete entries
    (scripts/publish-shorts.py with --meta; idempotent, skips existing)."""
    real = [sys.executable, "-u", str(REPO_ROOT / "scripts" / "publish-shorts.py"),
            state["batch"], "--date", state["run_date"], "--meta", state["meta_path"],
            "--out-root", state["out_root"], "--dest-root", state["dest_root"],
            "--shorts-json", state["shorts_json"],
            "--progress-json", state["progress_path"]]
    if state.get("id_prefix"):
        real += ["--id-prefix", state["id_prefix"]]
    cmd = _publish_cmd_for(state, "publish", real)
    rc, output = _run_streaming(cmd, lane=5, node="publish", stub=state.get("stub", ""))
    lines = output.splitlines()
    entries = [{"action": m.group(1), "id": m.group(2)}
               for m in map(ENTRY_RE.match, lines) if m]
    parsed = {"entries": entries,
              "added": sum(1 for e in entries if e["action"] == "ADDED"),
              "skipped": sum(1 for e in entries if e["action"] != "ADDED"),
              "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("publish_out", parsed, rc, output, "publish-shorts.py")
    return {"publish_out": parsed, "status": "running"}


def verify_publish(state: PublishState) -> PublishState:
    """Trust the disk, mechanizing the standing manual sweeps: every staged copy
    md5-matches the render AS IT IS NOW (the 2026-07-23 stale-stage hazard —
    a builder re-render after staging MUST fail here), every entry is complete
    (hook/caption/tags/title), duration matches ffprobe, all 7 platforms pending,
    persona hard rules hold."""
    if state.get("stub"):
        return {"publish_out": {**state.get("publish_out", {}),
                                "verified": "(stub - skipped)"},
                "status": "running"}
    dest_dir = Path(state["dest_root"]) / f"{state['batch']}-{state['run_date']}"
    shorts = _read_json(state["shorts_json"], None)
    if not isinstance(shorts, dict) or "shorts" not in shorts:
        return {"status": "failed", "error": f"shorts.json unreadable: {state['shorts_json']}"}
    by_id = {s.get("id"): s for s in shorts["shorts"]}

    for e in state.get("expected", []):
        slug, id_ = e["slug"], e["id"]
        render = Path(e["render"])
        staged = dest_dir / e["staged_name"]
        if not staged.is_file():
            return {"status": "failed", "error": f"{slug}: staged copy missing: {staged}"}
        m1, m2 = _md5(render), _md5(staged)
        if m1 is None:
            return {"status": "failed", "error": f"{slug}: render unreadable: {render}"}
        if m1 != m2:
            return {"status": "failed",
                    "error": f"{slug}: staged md5 {m2} != render md5 {m1} — the render "
                             "changed after staging (post-QA re-render?); re-copy and "
                             "re-run"}
        entry = by_id.get(id_)
        if entry is None:
            return {"status": "failed", "error": f"{slug}: no shorts.json entry {id_}"}
        # Em/en dash check over the PERSONA COPY only, never the whole entry blob. The
        # posting scripts write prose diagnostics into platforms.<name>.error/.note (retry
        # windows, pre-check notes); those are logs, not copy Mike wrote, and a re-run of a
        # partially-posted batch would fail forever on them. Hit live 2026-08-08: clip 1 was
        # posted, rumble+bitchute both hit their URL races, and their (then em-dashed)
        # diagnostics landed in the entry and failed this gate on an otherwise clean batch.
        # Same scoping as scripts/persona-lint.py.
        copy_blob = json.dumps({k: entry.get(k) for k in ("title", "hook", "caption", "tags")},
                               ensure_ascii=False)
        if "—" in copy_blob or "–" in copy_blob:
            return {"status": "failed", "error": f"{id_}: em/en dash in the queue entry copy"}
        for field in ("title", "hook", "caption"):
            if not entry.get(field):
                return {"status": "failed", "error": f"{id_}: empty {field}"}
        if "#" in entry.get("caption", ""):
            return {"status": "failed",
                    "error": f"{id_}: hashtag in caption (captions are stored hashtag-free)"}
        if not entry.get("tags"):
            return {"status": "failed", "error": f"{id_}: empty tags[]"}
        plats = entry.get("platforms", {})
        bad = [p for p in ("yt_shorts", "ig_reels", "x", "tiktok", "facebook",
                           "rumble", "bitchute")
               if plats.get(p, {}).get("status") != "pending"]
        if bad:
            return {"status": "failed",
                    "error": f"{id_}: platform block(s) not pending: {bad}"}
        d = _ffprobe_duration(staged)
        if d is None or entry.get("duration_seconds") is None or \
                abs(d - float(entry["duration_seconds"])) > 0.2:
            return {"status": "failed",
                    "error": f"{id_}: duration_seconds {entry.get('duration_seconds')} != "
                             f"staged {d} (±0.2s)"}
        want_path = f"shorts/{state['batch']}-{state['run_date']}/{e['staged_name']}"
        if entry.get("video_path") != want_path:
            return {"status": "failed",
                    "error": f"{id_}: video_path {entry.get('video_path')!r} != "
                             f"{want_path!r}"}
    return {"publish_out": {**state.get("publish_out", {}), "verified": True},
            "status": "running"}


def lint(state: PublishState) -> PublishState:
    """Persona gate on the queue file (scripts/persona-lint.py, read-only;
    exit 1 = violations — the run halts and the violations are in the tail)."""
    real = [sys.executable, "-u", str(REPO_ROOT / "scripts" / "persona-lint.py"),
            "--file", state["shorts_json"]]
    cmd = _publish_cmd_for(state, "lint", real)
    rc, output = _run_streaming(cmd, lane=5, node="lint", stub=state.get("stub", ""))
    parsed = {"output_tail": output[-2000:]}
    if rc != 0:
        return _fail("lint_out", parsed, rc, output,
                     "persona-lint.py (queue violations — fix them, then re-run)")
    return {"lint_out": {**parsed, "clean": True}, "status": "running"}


def verify_lint(state: PublishState) -> PublishState:
    """Assemble the run summary (the lint node already halted on violations)."""
    if state.get("stub"):
        return {"publish": {"batch": state.get("batch"), "stub": True,
                            "added": state.get("publish_out", {}).get("added", 0)},
                "status": "done"}
    shorts = _read_json(state["shorts_json"], {})
    summary = {
        "batch": state.get("batch"),
        "sandbox": bool(state.get("test_sandbox")),
        "date": state.get("run_date"),
        "clips": len(state.get("expected", [])),
        "added": state.get("publish_out", {}).get("added"),
        "skipped": state.get("publish_out", {}).get("skipped"),
        "dest_dir": str(Path(state["dest_root"]) / f"{state['batch']}-{state['run_date']}"),
        "queue_total": len(shorts.get("shorts", [])) if isinstance(shorts, dict) else None,
        "lint": "clean",
    }
    return {"publish": summary, "status": "done"}


def build_publish_graph(checkpointer=None):
    g = StateGraph(PublishState)
    for name, fn in (("publish", publish), ("verify_publish", verify_publish),
                     ("lint", lint), ("verify_lint", verify_lint)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "publish")
    g.add_conditional_edges("publish", _route("verify_publish"),
                            {"verify_publish": "verify_publish", "halt": END})
    g.add_conditional_edges("verify_publish", _route("lint"),
                            {"lint": "lint", "halt": END})
    g.add_conditional_edges("lint", _route("verify_lint"),
                            {"verify_lint": "verify_lint", "halt": END})
    g.add_edge("verify_lint", END)
    return g.compile(checkpointer=checkpointer)
