# lane_graph.py — Lane 1 (seed-by-name) as a LangGraph StateGraph.
#
# First graph of the Phase 2 migration (ORCHESTRATOR-PLAN.md §"Phase 2 direction
# chosen"). Scope is Lane 1 ONLY: seed the queue by name search. Lanes 2-5 stay
# manual; they join later, one node at a time. See DESIGN.html in this folder.
#
# Shape:  START -> seed -> (ok) -> verify_seed -> END
#                       -> (restricted / failed) -> END        <- the HALT route
#
# Principles this file encodes (do not undo):
#   - The blessed script is WRAPPED as a subprocess, byte-untouched. The graph
#     replaces how the script is launched, never what it does.
#   - Files on disk (members-urls.json, groups.json) remain the contract; graph
#     state carries bookkeeping counts only, never member data.
#   - Zero retries anywhere. One attempt per run; a failure ends the run with the
#     stderr tail preserved for diagnosis. Never relaunch automatically.
#   - A restriction page ends the run as halted_restricted. The seeder exits 0
#     after a restriction (it saves partial progress first), so detection is by
#     its printed marker line, NOT the exit code.

import re
import subprocess
import sys
import os
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

LINKEDIN = Path(__file__).resolve().parents[1]           # linkedin-automation/
DATA = LINKEDIN / "data"
QUEUE = DATA / "members-urls.json"
GROUPS = DATA / "groups.json"
SEED_SCRIPT = LINKEDIN / "skills" / "scrape-group-members" / "seed_by_name.py"
CHECKPOINT_DB = DATA / "graph_checkpoints.sqlite"

# The exact line seed_by_name.py prints when it hits a restriction page and stops.
RESTRICTION_MARKER = "restriction/unusual-activity page"
# Per-name progress line:    "Will": 118 matched, 98 new -> queue now 6379
PER_NAME_RE = re.compile(
    r'^\s*"(?P<name>[^"]+)": (?P<matched>\d+) matched, (?P<added>\d+) new -> queue now \d+'
)


class LaneState(TypedDict, total=False):
    group_id: str            # e.g. "6665791"
    names: list[str]         # seed targets for this run
    stub: str                # "" = real run; "ok"|"restricted"|"fail" = structural test
    queue_before: int        # queue length snapshot taken before the seeder runs
    per_name: dict           # {name: {matched, added}} parsed from seeder output
    output_tail: str         # last chunk of seeder output, for the report / diagnosis
    seeded: dict             # verify_seed's from-disk result
    status: str              # running | done | failed | halted_restricted
    error: Optional[str]


# ── helpers ──────────────────────────────────────────────────────────────────

def _read_json(path: Path, fallback):
    try:
        import json
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fallback


def _stub_script(kind: str, names: list[str]) -> str:
    """A tiny inline script that mimics the seeder's output without touching
    LinkedIn or any data file — used by --stub structural tests only."""
    lines = [f'print("Queue starts at 0 members. [STUB {kind}]")']
    if kind == "fail":
        lines.append('import sys; print("stub failure", file=sys.stderr); sys.exit(3)')
    else:
        for n in names:
            lines.append(f'print("[search] \\"{n}\\"")')
            if kind == "restricted":
                lines.append(
                    'print("\\n!!! LinkedIn restriction/unusual-activity page - STOPPING. !!!")'
                )
                break
            lines.append(f'print("   \\"{n}\\": 3 matched, 0 new -> queue now 0")')
        lines.append('print(" SEED DONE.")')
    return "\n".join(lines)


# ── nodes ────────────────────────────────────────────────────────────────────

def seed(state: LaneState) -> LaneState:
    """Run seed_by_name.py as a subprocess, streaming its output through."""
    names = state["names"]
    group_id = state.get("group_id", "6665791")
    queue_before = len(_read_json(QUEUE, []))

    if state.get("stub"):
        cmd = [sys.executable, "-c", _stub_script(state["stub"], names)]
    else:
        cmd = [
            sys.executable, "-u", str(SEED_SCRIPT),
            f"--group={group_id}",
            f"--names={','.join(names)}",
        ]

    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8", errors="replace", env=env,
    )
    captured = []
    for line in proc.stdout:
        print(line, end="", flush=True)      # live tee to the terminal
        captured.append(line)
    proc.wait()
    output = "".join(captured)

    per_name = {
        m.group("name"): {"matched": int(m.group("matched")), "added": int(m.group("added"))}
        for m in (PER_NAME_RE.match(l) for l in captured) if m
    }

    out: LaneState = {
        "queue_before": queue_before,
        "per_name": per_name,
        "output_tail": output[-4000:],
    }
    if RESTRICTION_MARKER in output:
        out["status"] = "halted_restricted"
        out["error"] = "LinkedIn restriction page hit; seeder stopped itself. No more runs today."
    elif proc.returncode != 0:
        out["status"] = "failed"
        out["error"] = f"seeder exit code {proc.returncode}; output tail:\n{output[-1500:]}"
    else:
        out["status"] = "running"
    return out


def verify_seed(state: LaneState) -> LaneState:
    """Idempotency check: trust the disk, not the subprocess's own claims."""
    queue = _read_json(QUEUE, [])
    queue_after = len(queue)
    new = queue_after - state.get("queue_before", 0)

    per_name = state.get("per_name", {})
    names_skipped = [n for n in state["names"] if n not in per_name]

    if state.get("stub"):
        searched_missing = ["(stub run - searched_names check skipped)"]
    else:
        groups = _read_json(GROUPS, [])
        g = next((x for x in groups if x.get("group_id") == state.get("group_id")), {})
        recorded = set(g.get("searched_names") or [])
        searched_missing = [n for n in per_name if n not in recorded]

    return {
        "seeded": {
            "queue_before": state.get("queue_before", 0),
            "queue_after": queue_after,
            "new": new,
            "per_name": per_name,
            "names_skipped": names_skipped,
            "searched_names_missing": searched_missing,
        },
        "status": "done",
    }


def route_after_seed(state: LaneState) -> str:
    return "verify" if state.get("status") == "running" else "halt"


# ── graph ────────────────────────────────────────────────────────────────────

def build_graph(checkpointer=None):
    g = StateGraph(LaneState)
    g.add_node("seed", seed)             # default retry policy = none. Keep it that way.
    g.add_node("verify_seed", verify_seed)
    g.add_edge(START, "seed")
    g.add_conditional_edges("seed", route_after_seed, {"verify": "verify_seed", "halt": END})
    g.add_edge("verify_seed", END)
    return g.compile(checkpointer=checkpointer)
