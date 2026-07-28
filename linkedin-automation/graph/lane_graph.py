# lane_graph.py — LinkedIn morning lanes as LangGraph StateGraphs.
#
# Phase 2 migration (ORCHESTRATOR-PLAN.md §"Phase 2 direction chosen"). One graph
# per lane, individually invoked ("Lane 2, 50") — NO lane-chaining, NO interrupts
# (Mike, 2026-07-28: the number in his ask IS the human decision). See DESIGN.html.
#
#   Lane 1 (seed):    START -> seed   -> (ok) -> verify_seed   -> END
#   Lane 2 (scrape):  START -> scrape -> (ok) -> verify_scrape -> END
#   either lane:                     -> (restricted / failed) -> END   <- HALT route
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
REPO_ROOT = LINKEDIN.parent
DATA = LINKEDIN / "data"
QUEUE = DATA / "members-urls.json"
GROUPS = DATA / "groups.json"
MEMBERS = DATA / "members.json"
SEED_SCRIPT = LINKEDIN / "skills" / "scrape-group-members" / "seed_by_name.py"
# Python port (2026-07-28, parity-tested, bless pending). Rollback: swap in
# SCRAPE_SCRIPT_JS below — the frozen JS original stays until the port is blessed.
SCRAPE_SCRIPT = LINKEDIN / "skills" / "scrape-group-members" / "scrape_group_members.py"
SCRAPE_SCRIPT_JS = LINKEDIN / "skills" / "scrape-group-members" / "scrape-group-members.js"
CHECKPOINT_DB = DATA / "graph_checkpoints.sqlite"

# The exact line seed_by_name.py prints when it hits a restriction page and stops.
RESTRICTION_MARKER = "restriction/unusual-activity page"
# LinkedIn's restriction-page phrasings (lib/_li-session isRestricted) — the scraper
# itself never checks isRestricted, but these can surface inside its error messages.
RESTRICTION_PAGE_RE = re.compile(
    r"temporarily restricted|unusual activity|high volume of LinkedIn profile data"
    r"|access to your account has been", re.I,
)
# Per-name progress line:    "Will": 118 matched, 98 new -> queue now 6379
PER_NAME_RE = re.compile(
    r'^\s*"(?P<name>[^"]+)": (?P<matched>\d+) matched, (?P<added>\d+) new -> queue now \d+'
)
# Scraper per-profile lines.
CAPTURE_RE = re.compile(r"^\s+CAPTURE \[(?P<zone>\w+)\] (?P<location>.+)$")
SKIP_RE = re.compile(r"^\s+skip\s+\(not a target zone\)")
ALREADY_RE = re.compile(r"^\s+already captured \[")
PROFILE_ERR_RE = re.compile(r"^\s+error \(will retry next run\)")
VISIT_RE = re.compile(r"^\[(?P<i>\d+)/(?P<n>\d+)\] ")

# The scraper's per-profile try/catch swallows errors and keeps going, so a
# systemic failure (restriction, logout, DOM change) looks like error after error.
# This many CONSECUTIVE per-profile errors => the wrapper kills the run.
CONSECUTIVE_ERROR_LIMIT = 5


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


def _stub_scrape_script(kind: str, max_views: int) -> str:
    """Mimics the scraper's output for --stub structural tests. No browser, no writes."""
    lines = [f'print("Queue: 6435 members, 1007 processed, 5428 remaining. [STUB {kind}]")']
    if kind == "fail":
        lines.append('import sys; print("FATAL: stub failure", file=sys.stderr); sys.exit(3)')
    elif kind == "restricted":
        lines.append('print("[1/5] https://www.linkedin.com/in/stub-a/")')
        lines.append('print("   error (will retry next run): unusual activity detected on this page")')
    elif kind == "errors":
        for i in range(CONSECUTIVE_ERROR_LIMIT + 2):
            lines.append(f'print("[{i + 1}/9] https://www.linkedin.com/in/stub-{i}/")')
            lines.append('print("   error (will retry next run): Timeout 15000ms exceeded")')
        lines.append('print(" DONE this run. 0 members captured")')
    else:  # ok
        lines.append('print("[1/4] https://www.linkedin.com/in/stub-a/")')
        lines.append('print("   CAPTURE [north_america] Austin, Texas, United States")')
        lines.append('print("[2/4] https://www.linkedin.com/in/stub-b/")')
        lines.append('print("   skip  (not a target zone) \\"Lagos, Nigeria\\"")')
        lines.append('print("[3/4] https://www.linkedin.com/in/stub-c/")')
        lines.append('print("   CAPTURE [europe] Cardiff, Wales, United Kingdom")')
        lines.append('print("[4/4] https://www.linkedin.com/in/stub-d/")')
        lines.append('print("   error (will retry next run): Timeout 15000ms exceeded")')
        lines.append('print(" DONE this run. 470 members captured -> members.json")')
    return "\n".join(lines)


def _run_streaming(cmd, kill_after_consecutive_errors: bool = False):
    """Run a wrapped script, tee its output live, and return (returncode, output,
    killed_reason). When kill_after_consecutive_errors is set, a streak of
    CONSECUTIVE_ERROR_LIMIT per-profile error lines kills the whole process TREE
    (taskkill /T — node + its Playwright Chrome child; never the main Chrome)."""
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8", errors="replace", env=env, cwd=str(REPO_ROOT),
    )
    captured = []
    killed_reason = None
    consecutive_errors = 0
    for line in proc.stdout:
        print(line, end="", flush=True)      # live tee to the terminal
        captured.append(line)
        if kill_after_consecutive_errors:
            if PROFILE_ERR_RE.match(line):
                consecutive_errors += 1
                if consecutive_errors >= CONSECUTIVE_ERROR_LIMIT:
                    killed_reason = (
                        f"{CONSECUTIVE_ERROR_LIMIT} consecutive per-profile errors — "
                        "systemic failure (restriction / logout / DOM change). Killing the run; "
                        "diagnose before any rerun. NO retry today if it looks like a restriction."
                    )
                    print(f"\n[graph] KILL-SWITCH: {killed_reason}", flush=True)
                    subprocess.run(
                        ["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                        capture_output=True,
                    )
                    break
            elif CAPTURE_RE.match(line) or SKIP_RE.match(line) or ALREADY_RE.match(line):
                consecutive_errors = 0   # any successful profile outcome breaks the streak
    proc.wait()
    return proc.returncode, "".join(captured), killed_reason


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

    returncode, output, _ = _run_streaming(cmd)

    per_name = {
        m.group("name"): {"matched": int(m.group("matched")), "added": int(m.group("added"))}
        for m in (PER_NAME_RE.match(l) for l in output.splitlines()) if m
    }

    out: LaneState = {
        "queue_before": queue_before,
        "per_name": per_name,
        "output_tail": output[-4000:],
    }
    if RESTRICTION_MARKER in output:
        out["status"] = "halted_restricted"
        out["error"] = "LinkedIn restriction page hit; seeder stopped itself. No more runs today."
    elif returncode != 0:
        out["status"] = "failed"
        out["error"] = f"seeder exit code {returncode}; output tail:\n{output[-1500:]}"
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


# ── Lane 2 (scrape) ──────────────────────────────────────────────────────────

class Lane2State(TypedDict, total=False):
    max_views: int           # N from Mike's "Lane 2, N" — the human decision, per run
    stub: str                # "" = real; ok|restricted|errors|fail = structural test
    processed_before: int    # queue processed-count snapshot
    captured_before: int     # members.json count snapshot
    captures: list           # [{zone, location}] parsed from CAPTURE lines (no URLs)
    counts: dict             # {visited, captured, already, skipped, errors} from output
    output_tail: str
    scraped: dict            # verify_scrape's from-disk result (incl. the regions report)
    status: str              # running | done | failed | halted_restricted
    error: Optional[str]


def scrape(state: Lane2State) -> Lane2State:
    """Run the scraper (--max=N) as a subprocess. The scraper — JS original and
    its 1:1 Python port alike — has no restriction check of its own (the
    per-profile try/except swallows errors), so the wrapper watches the stream:
    restriction phrasing => halt; a streak of CONSECUTIVE_ERROR_LIMIT
    per-profile errors => kill the process tree."""
    queue = _read_json(QUEUE, [])
    processed_before = sum(1 for e in queue if e.get("processed"))
    captured_before = len(_read_json(MEMBERS, []))

    if state.get("stub"):
        cmd = [sys.executable, "-c", _stub_scrape_script(state["stub"], state["max_views"])]
    else:
        cmd = [sys.executable, "-u", str(SCRAPE_SCRIPT), f"--max={state['max_views']}"]

    returncode, output, killed_reason = _run_streaming(cmd, kill_after_consecutive_errors=True)

    lines = output.splitlines()
    captures = [
        {"zone": m.group("zone"), "location": m.group("location").strip()}
        for m in (CAPTURE_RE.match(l) for l in lines) if m
    ]
    counts = {
        "visited": sum(1 for l in lines if VISIT_RE.match(l)),
        "captured": len(captures),
        "already": sum(1 for l in lines if ALREADY_RE.match(l)),
        "skipped": sum(1 for l in lines if SKIP_RE.match(l)),
        "errors": sum(1 for l in lines if PROFILE_ERR_RE.match(l)),
    }

    out: Lane2State = {
        "processed_before": processed_before,
        "captured_before": captured_before,
        "captures": captures,
        "counts": counts,
        "output_tail": output[-4000:],
    }
    if RESTRICTION_PAGE_RE.search(output):
        out["status"] = "halted_restricted"
        out["error"] = ("Restriction-page phrasing in scraper output — STOP for the rest of "
                        "the day. Never rerun after this.")
    elif killed_reason:
        out["status"] = "failed"
        out["error"] = killed_reason
    elif returncode != 0 or "FATAL:" in output:
        out["status"] = "failed"
        out["error"] = f"scraper exit code {returncode}; output tail:\n{output[-1500:]}"
    else:
        out["status"] = "running"
    return out


def verify_scrape(state: Lane2State) -> Lane2State:
    """From-disk verification + the standing REGIONS report (Mike, 2026-07-28:
    'tell me what regions they were from' is built in, never asked for)."""
    queue = _read_json(QUEUE, [])
    processed_after = sum(1 for e in queue if e.get("processed"))
    captured_after = len(_read_json(MEMBERS, []))

    new_processed = processed_after - state.get("processed_before", 0)
    new_captured = captured_after - state.get("captured_before", 0)

    regions: dict = {}
    for c in state.get("captures", []):
        regions.setdefault(c["zone"], []).append(c["location"])

    mismatch = None
    if not state.get("stub") and new_captured != len(state.get("captures", [])):
        mismatch = (f"members.json grew by {new_captured} but {len(state.get('captures', []))} "
                    f"CAPTURE lines were parsed — reconcile before trusting the report")

    return {
        "scraped": {
            "requested": state.get("max_views"),
            "visited": state.get("counts", {}).get("visited", 0),
            "processed_delta": new_processed,
            "captured_delta": new_captured,
            "captured_total": captured_after,
            "queue_remaining": len(queue) - processed_after,
            "already": state.get("counts", {}).get("already", 0),
            "skipped_out_of_zone": state.get("counts", {}).get("skipped", 0),
            "errors": state.get("counts", {}).get("errors", 0),
            "regions": regions,
            "mismatch": mismatch,
        },
        "status": "done",
    }


def route_after_scrape(state: Lane2State) -> str:
    return "verify" if state.get("status") == "running" else "halt"


# ── graphs ───────────────────────────────────────────────────────────────────

def build_graph(checkpointer=None):
    """Lane 1: seed-by-name."""
    g = StateGraph(LaneState)
    g.add_node("seed", seed)             # default retry policy = none. Keep it that way.
    g.add_node("verify_seed", verify_seed)
    g.add_edge(START, "seed")
    g.add_conditional_edges("seed", route_after_seed, {"verify": "verify_seed", "halt": END})
    g.add_edge("verify_seed", END)
    return g.compile(checkpointer=checkpointer)


def build_lane2_graph(checkpointer=None):
    """Lane 2: scrape the queue at --max=N."""
    g = StateGraph(Lane2State)
    g.add_node("scrape", scrape)         # zero retries here too — one attempt per run.
    g.add_node("verify_scrape", verify_scrape)
    g.add_edge(START, "scrape")
    g.add_conditional_edges("scrape", route_after_scrape, {"verify": "verify_scrape", "halt": END})
    g.add_edge("verify_scrape", END)
    return g.compile(checkpointer=checkpointer)
