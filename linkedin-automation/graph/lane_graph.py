# lane_graph.py — LinkedIn morning lanes as LangGraph StateGraphs.
#
# Phase 2 migration (ORCHESTRATOR-PLAN.md §"Phase 2 direction chosen"). One graph
# per lane, individually invoked ("Lane 2, 50") — NO lane-chaining, NO interrupts
# (Mike, 2026-07-28: the number in his ask IS the human decision). See DESIGN.html.
#
#   Lane 1 (seed):    START -> seed    -> (ok) -> verify_seed    -> END
#   Lane 2 (scrape):  START -> scrape  -> (ok) -> verify_scrape  -> END
#   Lane 3 (invite):  START -> invite  -> (ok) -> verify_invite  -> END
#   Lane 4 (check):   START -> check   -> (ok) -> verify_check   -> END
#   Lane 5 (endorse): START -> endorse -> (ok) -> verify_endorse -> END
#   any lane:                        -> (restricted / failed) -> END   <- HALT route
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

import json
import re
import subprocess
import sys
import os
import time
from datetime import date, datetime
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
# Python port (2026-07-30, bless pending). Rollback: swap in INVITE_SCRIPT_JS —
# the frozen JS original stays until the port is blessed on a live run.
INVITE_SCRIPT = LINKEDIN / "skills" / "request-connections" / "request_connections.py"
INVITE_SCRIPT_JS = LINKEDIN / "skills" / "request-connections" / "request-connections.js"
# Python port (2026-07-30, bless pending). Rollback: swap in CHECK_SCRIPT_JS — but
# note the port carries two DOCUMENTED fixes the JS lacks (percent-encoded slug
# matching, relative-date clamping); see check_connections.py's header.
CHECK_SCRIPT = LINKEDIN / "skills" / "check-connections" / "check_connections.py"
CHECK_SCRIPT_JS = LINKEDIN / "skills" / "check-connections" / "check-connections.js"
# Python port, BLESSED live 2026-08-01 (amandafetters 9 skills + amanda-marlow 10, both
# DMs sent, all three disk deltas matched the parsed lines). Rollback: swap in
# ENDORSE_SCRIPT_JS — _wrap_cmd() picks `node` for a .js path, so it is a one-line swap.
ENDORSE_SCRIPT = LINKEDIN / "skills" / "endorse-and-message" / "endorse_and_message.py"
ENDORSE_SCRIPT_JS = LINKEDIN / "skills" / "endorse-and-message" / "endorse-and-message.js"
CHECKPOINT_DB = DATA / "graph_checkpoints.sqlite"

# ── dashboard feed: run history + live progress ──────────────────────────────
# Two purpose-built files. Deliberately NOT the LangGraph checkpoint DB, which is
# gitignored, documented as disposable, keyed by LangGraph's own internal
# serialization, and 75 of whose 89 threads are stub tests — a UI built on it would
# break when it is deleted (which the design says is safe) and when langgraph
# changes its format. These two are our schema, ours to keep.
#
#   lane_runs.json      append-only history, ONE record per finished run. Also the
#                       only place a same-day PROFILE-VIEW total can come from:
#                       members-urls.json carries no processed_at, which is exactly
#                       why the Lane 5 gate is otherwise blind to Lane 2's views.
#   lane_progress.json  ONE record, overwritten live while a run is in flight.
LANE_RUNS = DATA / "lane_runs.json"
LANE_PROGRESS = DATA / "lane_progress.json"
LANE_RUNS_KEEP = 500                      # trim the history; it is a feed, not an archive
LANE_NAMES = {1: "seed", 2: "scrape", 3: "invite", 4: "check", 5: "endorse"}
# Which verify-block key each lane parks its result under, and whether each member
# it works costs a profile view. Lane 1 searches names (zero views); Lane 4 reads one
# list page (~zero). Lanes 2/3/5 are one view per member visited.
LANE_SUMMARY_KEY = {1: "seeded", 2: "scraped", 3: "invited", 4: "checked", 5: "endorsed"}
LANE_COSTS_VIEWS = {1: False, 2: True, 3: True, 4: False, 5: True}
# The pacing lines ("  ~ 3.2s (read profile)") are the bulk of the stream and say
# nothing about progress — skipped when picking the "what is it doing now" line.
PACING_LINE_RE = re.compile(r"^\s*~ [\d.]+s \(")

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
# Inviter per-member lines (request_connections.py output, byte-identical to the JS).
SENT_LINE_RE = re.compile(r"^\s+INVITE SENT$")
ALREADY_STATUS_RE = re.compile(r"^\s+(?P<status>already_pending|already_connected)$")
NOCB_LINE_RE = re.compile(r"^\s+no_connect_button \(")
LIMIT_LINE_RE = re.compile(r"^\s+LIMIT reached")
DRY_LINE_RE = re.compile(r"^\s+\[dry\] Connect available")
# The exact line the inviter prints when is_restricted() fires and it stops itself.
INVITE_RESTRICTION_MARKER = "restriction / unusual-activity page detected"
# Acceptance-scanner lines (check_connections.py output, byte-identical to the JS).
CONNECTED_RE = re.compile(
    r"^\s+CONNECTED (?P<slug>\S+) -> (?P<date>\d{4}-\d{2}-\d{2})(?P<inexact> \(date not shown[^)]*\))?\s*$"
)
SCROLL_ROUND_RE = re.compile(
    r"^\s+scroll round (?P<round>\d+): (?P<seen>\d+) connection cards seen, "
    r"(?P<matched>\d+)/(?P<outstanding>\d+) of ours matched"
)
NOTHING_TO_CHECK = "Nothing to check."
# The exact line the scanner prints when is_restricted() fires and it stops itself.
CHECK_RESTRICTION_MARKER = "LinkedIn restriction page detected"
# Endorser per-member lines (endorse_and_message.py output, byte-identical to the JS).
# The visit line carries the URL, so the report can name who got what.
ENDORSE_VISIT_RE = re.compile(
    r"^\[(?P<i>\d+)/(?P<n>\d+)\] (?P<url>\S+) \(connected (?P<connected>[^)]*)\)"
)
ENDORSED_RE = re.compile(r"^\s+ENDORSED (?P<count>\d+) skill\(s\)\.$")
NO_SKILLS_RE = re.compile(r"^\s+NO ENDORSABLE SKILLS")
DM_SENT_RE = re.compile(r"^\s+DM SENT\.$")
DM_FAILED_RE = re.compile(r"^\s+DM (?P<status>\S+) — endorsements recorded")
ENDORSE_FAILED_RE = re.compile(r"^\s+endorse failed \(left for retry next run\)")
ALREADY_ENDORSED_RE = re.compile(r"^\s+already endorsed on a previous run")
DRY_ENDORSE_RE = re.compile(r"^\s+\[dry\] would endorse (?P<count>\d+) skill\(s\)\.")
DRY_DM_RE = re.compile(r"^\s+\[dry\] Message button located")
NOTHING_TO_DO = "Nothing to do."
# The endorser prints the SAME restriction marker as the inviter on the profile page,
# plus its own when the restriction lands on the /details/skills/ page instead.
SKILLS_RESTRICTION_MARKER = "Restriction page on the skills page"
# The Lane 5 selection rule (endorse-and-message.md, Mike 2026-07-21), now IN CODE
# rather than in a human's head every morning — see lane5_plan(). Mike ran it by hand
# daily and miscounted it once (07-29, --max=3), which is exactly the kind of recurring
# manual step that becomes a mechanical gate.
ENDORSE_AGE_DAYS = 14
ENDORSE_FALLBACK_AGE_DAYS = 7
# A derived run this size or smaller launches with no argument at all. Above it the
# CLI REFUSES and hands the number back to Mike (his call, 2026-08-01): the rule says
# "DM everyone over 14 days", but a 24-member endorse run stacked on a scrape day is
# ~85 profile views PLUS 24 DMs PLUS ~240 endorse clicks, against the ~120/24h
# threshold that has restricted this account twice. Same shape as Lane 2's --max>75
# refusal: the tool will not cross the line for you, it makes you decide.
LANE5_AUTO_MAX = 10

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
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fallback
    except Exception:
        return fallback


def _write_json_atomic(path: Path, data):
    """Write via a temp file + os.replace. The dashboard polls these files while a
    run is writing them; a partial read would show it garbage."""
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, path)


def _now_iso():
    return datetime.now().isoformat(timespec="seconds")


def write_progress(prog: dict):
    """Publish the live heartbeat. NEVER let a dashboard feed break a real run —
    this drives a browser against an account that has been restricted twice, so a
    failed status write is swallowed on purpose."""
    try:
        _write_json_atomic(LANE_PROGRESS, prog)
    except Exception:
        pass


def finish_progress(status: str, error: Optional[str] = None):
    """Stamp the in-flight heartbeat terminal once the graph returns. Without this a
    run that ends outside the subprocess (a halt route, a crash in run.py) would
    leave the dashboard showing a node that spins forever."""
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
               duration_s: float, stub: str = "", dry_run: bool = False,
               requested=None) -> dict:
    """Append one finished run to lane_runs.json and return the record.

    Stub runs ARE recorded (flagged), so a structural test is visible as what it was
    instead of vanishing — the dashboard hides them by default. They cost zero
    profile views, so they never pollute the volume total."""
    status = final.get("status", "unknown") if isinstance(final, dict) else "unknown"
    summary = final.get(LANE_SUMMARY_KEY.get(lane, ""), None) if isinstance(final, dict) else None
    views = 0
    if not stub and LANE_COSTS_VIEWS.get(lane) and isinstance(summary, dict):
        views = summary.get("visited", 0) or 0
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
        "dry_run": bool(dry_run),
        "requested": requested,
        "profile_views": views,
        "summary": summary,
        "error": final.get("error") if isinstance(final, dict) else None,
    }
    try:
        runs = _read_json(LANE_RUNS, [])
        if not isinstance(runs, list):
            runs = []
        runs.append(record)
        _write_json_atomic(LANE_RUNS, runs[-LANE_RUNS_KEEP:])
    except Exception as e:                      # a feed must never fail a real run
        print(f"[graph] WARNING could not write the run log: {e}", flush=True)
    return record


def views_today(runs=None) -> dict:
    """Profile views recorded today, per lane, from the run log. This is the number
    the Lane 5 gate currently cannot compute (it can only see members.json's dated
    fields) — once the log has a few days in it, the gate's flat ceiling can become
    a real volume budget."""
    if runs is None:
        runs = _read_json(LANE_RUNS, [])
    today = date.today().strftime("%Y-%m-%d")
    per_lane: dict = {}
    for r in runs if isinstance(runs, list) else []:
        if r.get("stub") or not str(r.get("started_at", "")).startswith(today):
            continue
        v = r.get("profile_views") or 0
        if v:
            per_lane[r.get("lane_name", "?")] = per_lane.get(r.get("lane_name", "?"), 0) + v
    return {"per_lane": per_lane, "total": sum(per_lane.values()), "date": today}


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


def _stub_invite_script(kind: str, max_invites: int) -> str:
    """Mimics the inviter's output for --stub structural tests. No browser, no writes."""
    lines = [
        f'print("members.json: 518 total, 318 already contacted, 200 to contact. [STUB {kind}]")',
        f'print("--max={max_invites}: sending at most {max_invites} invite(s) this run.")',
    ]
    if kind == "fail":
        lines.append('import sys; print("FATAL: stub failure", file=sys.stderr); sys.exit(3)')
    elif kind == "restricted":
        lines.append('print("[1/3] https://www.linkedin.com/in/stub-a/")')
        lines.append('print("   reached via clicked")')
        lines.append(r'print("\n!! LinkedIn restriction / unusual-activity page detected. STOPPING.")')
        lines.append('print(" DONE this run. 0 invite(s) sent.")')
    elif kind == "errors":
        for i in range(CONSECUTIVE_ERROR_LIMIT + 2):
            lines.append(f'print("[{i + 1}/9] https://www.linkedin.com/in/stub-{i}/")')
            lines.append('print("   error (will retry next run): Timeout 15000ms exceeded")')
        lines.append('print(" DONE this run. 0 invite(s) sent.")')
    elif kind == "limit":
        lines.append('print("[1/3] https://www.linkedin.com/in/stub-a/")')
        lines.append('print(\'   profile owner: "stub a"\')')
        lines.append('print("   LIMIT reached (weekly invite or note limit). STOPPING'
                     ' \\u2014 not marking this one.")')
        lines.append('print(" DONE this run. 0 invite(s) sent.")')
    else:  # ok
        lines.append('print("[1/4] https://www.linkedin.com/in/stub-a/")')
        lines.append('print(\'   profile owner: "stub a"\')')
        lines.append('print("   INVITE SENT")')
        lines.append('print("[2/4] https://www.linkedin.com/in/stub-b/")')
        lines.append('print("   already_pending")')
        lines.append('print("[3/4] https://www.linkedin.com/in/stub-c/")')
        lines.append('print("   no_connect_button (strike 1, one retry left)")')
        lines.append('print("[4/4] https://www.linkedin.com/in/stub-d/")')
        lines.append('print("   error (will retry next run): Timeout 15000ms exceeded")')
        lines.append('print(" DONE this run. 1 invite(s) sent.")')
        lines.append('print(\' Tally: {"sent":1,"already_pending":1,"no_connect_button":1,"error":1}\')')
    return "\n".join(lines)


def _stub_check_script(kind: str) -> str:
    """Mimics the acceptance scanner's output for --stub structural tests.
    No browser, no writes."""
    if kind == "nothing":
        return "\n".join([
            'print("members.json: 518 total, 0 contacted & awaiting acceptance. [STUB nothing]")',
            'print("Nothing to check.")',
        ])
    lines = ['print("members.json: 518 total, 239 contacted & awaiting acceptance. [STUB %s]")' % kind]
    if kind == "fail":
        lines.append('import sys; print("FATAL: stub failure", file=sys.stderr); sys.exit(3)')
    elif kind == "restricted":
        lines.append(r'print("\n!! LinkedIn restriction page detected. STOPPING.")')
    else:  # ok
        lines.append('print("  scroll round 1: 20 connection cards seen, 2/239 of ours matched")')
        lines.append('print("  scroll round 2: 34 connection cards seen, 3/239 of ours matched")')
        lines.append('print("   CONNECTED stub-a-1234 -> 2026-07-29")')
        lines.append('print("   CONNECTED stub-b-5678 -> 2026-07-28")')
        lines.append('print("   CONNECTED stub-c-9012 -> 2026-07-30'
                     ' (date not shown; recorded as observed today)")')
        lines.append('print(" DONE. 3 member(s) marked connected.")')
        lines.append('print(" 236 contacted member(s) still not in your connections'
                     ' (pending or declined).")')
    return "\n".join(lines)


def _stub_endorse_script(kind: str, max_members: int, dry_run: bool = False) -> str:
    """Mimics the endorser's output for --stub structural tests. No browser,
    no writes, and above all NO DM. Honors dry_run (unlike the lane 3/4 stubs)
    because on this lane the dry path has its OWN output lines and its own
    verification rule — it needs to be testable without a browser."""
    eligible = 0 if kind == "nothing" else 48
    head = [
        f'print("members.json: 526 total, {eligible} connected member(s) eligible for'
        f' endorse+DM. [STUB {kind}]")',
    ]
    if dry_run:
        head.append('print("** DRY RUN ** \\u2014 will count skills + locate Message,'
                    ' but endorse/send NOTHING.")')
    head.append(
        f'print("--max={max_members}: processing at most {max_members} member(s) this run.")'
    )
    if kind == "nothing":
        return "\n".join(head + ['print("Nothing to do.")'])
    lines = list(head)

    def emit(s):
        lines.append(f"print({s})")

    if kind == "fail":
        lines.append('import sys; print("FATAL: stub failure", file=sys.stderr); sys.exit(3)')
    elif kind == "restricted":
        emit('"[1/3] https://www.linkedin.com/in/stub-a/ (connected 2026-07-01)"')
        emit('"   reached via clicked"')
        emit(r'"\n!! LinkedIn restriction / unusual-activity page detected. STOPPING."')
        emit('" DONE this run. 0 member(s) endorsed + DM\'d."')
    elif kind == "errors":
        for i in range(CONSECUTIVE_ERROR_LIMIT + 2):
            emit(f'"[{i + 1}/9] https://www.linkedin.com/in/stub-{i}/ (connected 2026-07-01)"')
            emit('"   error (will retry next run): Timeout 15000ms exceeded"')
        emit('" DONE this run. 0 member(s) endorsed + DM\'d."')
    else:  # ok — a full endorse+DM, a zero-skills abandon, a resumed member, an error
        emit('"[1/5] https://www.linkedin.com/in/stub-a/ (connected 2026-07-01)"')
        emit('"   reached via clicked"')
        emit('"   12 endorsable skill(s) visible; endorsing the top 11."')
        emit('"   [dry] would endorse 11 skill(s)."' if dry_run else '"   ENDORSED 11 skill(s)."')
        emit('\'   greeting: "Hi Ana," (first name from profile)\'')
        emit('"   [dry] Message button located \\u2014 would send the template."'
             if dry_run else '"   DM SENT."')
        emit('"[2/5] https://www.linkedin.com/in/stub-b/ (connected 2026-07-02)"')
        emit('"   reached via clicked"')
        # NOTE: a zero-skills finding IS recorded even on a dry run (the JS original
        # does this too) — verify_endorse allows exactly this one delta.
        emit('"   NO ENDORSABLE SKILLS \\u2014 abandoned (no DM), marked no_skills."')
        emit('"[3/5] https://www.linkedin.com/in/stub-c/ (connected 2026-07-03)"')
        emit('"   reached via clicked"')
        emit('"   already endorsed on a previous run \\u2014 going straight to the DM."')
        emit('"   [dry] Message button located \\u2014 would send the template."' if dry_run else
             '"   DM not_verified \\u2014 endorsements recorded, DM left for retry next run."')
        emit('"[4/5] https://www.linkedin.com/in/stub-d/ (connected 2026-07-04)"')
        emit('"   reached via clicked"')
        emit('"   error (will retry next run): Timeout 15000ms exceeded"')
        emit('"[5/5] https://www.linkedin.com/in/stub-e/ (connected 2026-07-05)"')
        emit('"   reached via clicked"')
        emit('"   9 endorsable skill(s) visible; endorsing the top 9."')
        emit('"   [dry] would endorse 9 skill(s)."' if dry_run else '"   ENDORSED 9 skill(s)."')
        emit('\'   greeting: "Hi there," (no clean name \\u2014 fell back to "there")\'')
        emit('"   [dry] Message button located \\u2014 would send the template."'
             if dry_run else '"   DM SENT."')
        if dry_run:
            emit('" DONE this run. 0 member(s) endorsed + DM\'d."')
            emit('\' Tally: {"dry-found":3,"no_skills":1,"error":1}\'')
            emit('" 47 eligible member(s) remaining."')
        else:
            emit('" DONE this run. 2 member(s) endorsed + DM\'d."')
            emit('\' Tally: {"sent":2,"no_skills":1,"not_verified":1,"error":1}\'')
            emit('" 46 eligible member(s) remaining."')
    return "\n".join(lines)


# A "this profile succeeded" line resets the consecutive-error streak. Lane 2's
# outcomes are capture/skip/already; Lane 3's are sent/already_*/no-connect/dry;
# Lane 5's are endorsed/no-skills/DM-sent/DM-failed-but-endorsed/dry — anything
# proving the profile itself opened and was worked.
LANE2_SUCCESS_RES = (CAPTURE_RE, SKIP_RE, ALREADY_RE)
LANE3_SUCCESS_RES = (SENT_LINE_RE, ALREADY_STATUS_RE, NOCB_LINE_RE, DRY_LINE_RE)
LANE5_SUCCESS_RES = (ENDORSED_RE, NO_SKILLS_RE, DM_SENT_RE, DM_FAILED_RE,
                     ALREADY_ENDORSED_RE, DRY_ENDORSE_RE, DRY_DM_RE)


def _wrap_cmd(script: Path, *args) -> list:
    """Build the subprocess command for a wrapped skill script. Picks the right
    interpreter from the suffix so a rollback to the frozen JS original is a
    genuine one-line path swap (Lane 5 onward; lanes 1-4 predate this helper)."""
    if script.suffix == ".js":
        return ["node", str(script), *args]
    return [sys.executable, "-u", str(script), *args]


def _run_streaming(cmd, kill_after_consecutive_errors: bool = False,
                   success_res=LANE2_SUCCESS_RES, lane=None, node=None, stub=""):
    """Run a wrapped script, tee its output live, and return (returncode, output,
    killed_reason). When kill_after_consecutive_errors is set, a streak of
    CONSECUTIVE_ERROR_LIMIT per-profile error lines kills the whole process TREE
    (taskkill /T — node + its Playwright Chrome child; never the main Chrome).
    success_res = the per-profile "it worked" line patterns that reset the streak.

    ALSO publishes the live heartbeat (lane_progress.json). This is the only place in
    the system that knows what a run is doing WHILE it runs: LangGraph checkpoints
    only between nodes, and each lane's work node is a single long subprocess (Lane
    5's ran ~5 minutes), so the graph itself has nothing finer to report. The
    subprocess stream does, and it is already being parsed right here — so every lane
    gets progress from this one function."""
    env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"}
    started = _now_iso()
    prog = {
        "lane": lane, "lane_name": LANE_NAMES.get(lane), "node": node,
        "status": "running", "stub": bool(stub),
        "started_at": started, "updated_at": started,
        "pid": None, "index": None, "total": None,
        "last_event": "launching…", "ok": 0, "errors": 0,
    }
    write_progress(prog)

    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8", errors="replace", env=env, cwd=str(REPO_ROOT),
    )
    prog["pid"] = proc.pid
    write_progress(prog)

    captured = []
    killed_reason = None
    consecutive_errors = 0
    last_publish = 0.0
    for line in proc.stdout:
        print(line, end="", flush=True)      # live tee to the terminal
        captured.append(line)

        is_err = bool(PROFILE_ERR_RE.match(line))
        is_ok = (not is_err) and any(p.match(line) for p in success_res)

        # ── heartbeat ────────────────────────────────────────────────────────
        visit = VISIT_RE.match(line)
        if visit:
            prog["index"], prog["total"] = int(visit.group("i")), int(visit.group("n"))
        text = line.rstrip()
        if text.strip() and not PACING_LINE_RE.match(text):
            prog["last_event"] = text.strip()[:200]
        prog["errors"] += is_err
        prog["ok"] += is_ok
        prog["updated_at"] = _now_iso()
        # Throttled: the stream is chatty and every publish is a file replace. The
        # dashboard polls slower than this anyway.
        now = time.monotonic()
        if visit or is_err or is_ok or now - last_publish > 1.0:
            write_progress(prog)
            last_publish = now

        # ── kill-switch ──────────────────────────────────────────────────────
        if kill_after_consecutive_errors:
            if is_err:
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
            elif is_ok:
                consecutive_errors = 0   # any successful profile outcome breaks the streak
    proc.wait()

    prog["status"] = "killed" if killed_reason else (
        "node_done" if proc.returncode == 0 else "node_failed")
    prog["updated_at"] = _now_iso()
    if killed_reason:
        prog["error"] = killed_reason
    write_progress(prog)
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

    returncode, output, _ = _run_streaming(
        cmd, lane=1, node="seed", stub=state.get("stub", ""))

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

    returncode, output, killed_reason = _run_streaming(
        cmd, kill_after_consecutive_errors=True,
        lane=2, node="scrape", stub=state.get("stub", ""))

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


# ── Lane 3 (invite) ──────────────────────────────────────────────────────────

class Lane3State(TypedDict, total=False):
    max_invites: int         # N from Mike's "Lane 3, N" — the human decision, per run
    dry_run: bool            # pass --dry-run through: locate Connect, send nothing
    stub: str                # "" = real; ok|restricted|errors|fail|limit = structural test
    contacted_before: dict   # members.json per-contact_status counts snapshot
    counts: dict             # parsed from output (visited/sent/already_*/nocb/errors/dry)
    limit_hit: bool          # the run stopped on LinkedIn's weekly invite/note limit
    output_tail: str
    invited: dict            # verify_invite's from-disk result
    status: str              # running | done | failed | halted_restricted
    error: Optional[str]


def _contacted_status_counts(members) -> dict:
    """members.json contacted=true entries, bucketed by contact_status."""
    counts: dict = {}
    for m in members:
        if m.get("contacted") is True:
            s = m.get("contact_status") or "unknown"
            counts[s] = counts.get(s, 0) + 1
    return counts


def invite(state: Lane3State) -> Lane3State:
    """Run the inviter (--max=N [--dry-run]) as a subprocess. The inviter checks
    is_restricted itself and stops (exit 0), so detection is by its printed
    marker line; it also stops itself on LinkedIn's weekly invite/note limit
    (reported, not a halt — the account is fine, invites resume next week).
    Same kill-switch as Lane 2: a streak of CONSECUTIVE_ERROR_LIMIT per-member
    errors means something systemic broke — kill the process tree."""
    contacted_before = _contacted_status_counts(_read_json(MEMBERS, []))

    if state.get("stub"):
        cmd = [sys.executable, "-c", _stub_invite_script(state["stub"], state["max_invites"])]
    else:
        cmd = [sys.executable, "-u", str(INVITE_SCRIPT), f"--max={state['max_invites']}"]
        if state.get("dry_run"):
            cmd.append("--dry-run")

    returncode, output, killed_reason = _run_streaming(
        cmd, kill_after_consecutive_errors=True, success_res=LANE3_SUCCESS_RES,
        lane=3, node="invite", stub=state.get("stub", ""))

    lines = output.splitlines()
    counts = {
        "visited": sum(1 for l in lines if VISIT_RE.match(l)),
        "sent": sum(1 for l in lines if SENT_LINE_RE.match(l)),
        "already_pending": sum(1 for l in lines if ALREADY_STATUS_RE.match(l)
                               and "pending" in l),
        "already_connected": sum(1 for l in lines if ALREADY_STATUS_RE.match(l)
                                 and "connected" in l),
        "nocb_strike1": sum(1 for l in lines if NOCB_LINE_RE.match(l) and "strike 1" in l),
        "nocb_retired": sum(1 for l in lines if NOCB_LINE_RE.match(l) and "2nd strike" in l),
        "dry_found": sum(1 for l in lines if DRY_LINE_RE.match(l)),
        "errors": sum(1 for l in lines if PROFILE_ERR_RE.match(l)),
    }

    out: Lane3State = {
        "contacted_before": contacted_before,
        "counts": counts,
        "limit_hit": any(LIMIT_LINE_RE.match(l) for l in lines),
        "output_tail": output[-4000:],
    }
    if INVITE_RESTRICTION_MARKER in output or RESTRICTION_PAGE_RE.search(output):
        out["status"] = "halted_restricted"
        out["error"] = ("Restriction / unusual-activity page — inviter stopped itself. "
                        "STOP for the rest of the day. Never rerun after this.")
    elif killed_reason:
        out["status"] = "failed"
        out["error"] = killed_reason
    elif returncode != 0 or "FATAL:" in output:
        out["status"] = "failed"
        out["error"] = f"inviter exit code {returncode}; output tail:\n{output[-1500:]}"
    else:
        out["status"] = "running"
    return out


def verify_invite(state: Lane3State) -> Lane3State:
    """From-disk verification: members.json contacted-per-status deltas are the
    truth; the parsed INVITE SENT count must agree with the disk's sent delta."""
    members = _read_json(MEMBERS, [])
    after = _contacted_status_counts(members)
    before = state.get("contacted_before", {})
    delta = {k: after.get(k, 0) - before.get(k, 0) for k in set(before) | set(after)}
    delta = {k: v for k, v in delta.items() if v}
    counts = state.get("counts", {})

    mismatch = None
    if not state.get("stub") and not state.get("dry_run"):
        disk_sent = after.get("sent", 0) - before.get("sent", 0)
        if disk_sent != counts.get("sent", 0):
            mismatch = (f"members.json contact_status=sent grew by {disk_sent} but "
                        f"{counts.get('sent', 0)} INVITE SENT lines were parsed — "
                        "reconcile before trusting the report")

    return {
        "invited": {
            "requested": state.get("max_invites"),
            "dry_run": bool(state.get("dry_run")),
            "visited": counts.get("visited", 0),
            "sent": counts.get("sent", 0),
            "already_pending": counts.get("already_pending", 0),
            "already_connected": counts.get("already_connected", 0),
            "nocb_strike1": counts.get("nocb_strike1", 0),
            "nocb_retired": counts.get("nocb_retired", 0),
            "dry_found": counts.get("dry_found", 0),
            "errors": counts.get("errors", 0),
            "limit_hit": bool(state.get("limit_hit")),
            "contacted_delta": delta,
            "remaining_to_contact": sum(1 for m in members if m.get("contacted") is not True),
            "mismatch": mismatch,
        },
        "status": "done",
    }


def route_after_invite(state: Lane3State) -> str:
    return "verify" if state.get("status") == "running" else "halt"


# ── Lane 4 (check acceptances) ───────────────────────────────────────────────
# No --max: this is ONE list page, not a profile sweep, so it barely touches the
# volume budget and Mike runs it freely (often several times a day). No
# kill-switch either — there is no per-member visit loop to go systemically wrong;
# the failure modes are a restriction page (halt) or a hard crash (fail).

class Lane4State(TypedDict, total=False):
    dry_run: bool            # scan + report, write nothing
    stub: str                # "" = real; ok|restricted|fail|nothing = structural test
    connected_before: int    # members.json entries carrying connected_on
    outstanding_before: int   # contacted:true without connected_on
    connections: list        # [{slug, date, inexact}] parsed from CONNECTED lines
    rounds: int              # scroll rounds the scanner completed
    cards_seen: int          # distinct connection cards seen (last round's count)
    nothing_to_check: bool   # scanner exited before launching a browser
    output_tail: str
    checked: dict            # verify_check's from-disk result
    status: str              # running | done | failed | halted_restricted
    error: Optional[str]


def _connection_counts(members) -> tuple:
    """(connected, outstanding) — outstanding = invited but not yet known accepted."""
    connected = sum(1 for m in members if m.get("connected_on"))
    outstanding = sum(1 for m in members
                      if m.get("contacted") is True and not m.get("connected_on"))
    return connected, outstanding


def check(state: Lane4State) -> Lane4State:
    """Run the acceptance scanner ([--dry-run]) as a subprocess. The scanner checks
    is_restricted itself and stops (exit 0), so detection is by its printed marker
    line, NOT the exit code — same as the seeder."""
    connected_before, outstanding_before = _connection_counts(_read_json(MEMBERS, []))

    if state.get("stub"):
        cmd = [sys.executable, "-c", _stub_check_script(state["stub"])]
    else:
        cmd = [sys.executable, "-u", str(CHECK_SCRIPT)]
        if state.get("dry_run"):
            cmd.append("--dry-run")

    returncode, output, _ = _run_streaming(
        cmd, lane=4, node="check", stub=state.get("stub", ""))

    lines = output.splitlines()
    connections = [
        {"slug": m.group("slug"), "date": m.group("date"), "inexact": bool(m.group("inexact"))}
        for m in (CONNECTED_RE.match(l) for l in lines) if m
    ]
    rounds = [m for m in (SCROLL_ROUND_RE.match(l) for l in lines) if m]

    out: Lane4State = {
        "connected_before": connected_before,
        "outstanding_before": outstanding_before,
        "connections": connections,
        "rounds": len(rounds),
        "cards_seen": int(rounds[-1].group("seen")) if rounds else 0,
        "nothing_to_check": NOTHING_TO_CHECK in output,
        "output_tail": output[-4000:],
    }
    if CHECK_RESTRICTION_MARKER in output or RESTRICTION_PAGE_RE.search(output):
        out["status"] = "halted_restricted"
        out["error"] = ("Restriction page — scanner stopped itself. STOP for the rest of "
                        "the day. Never rerun after this.")
    elif returncode != 0 or "FATAL:" in output:
        out["status"] = "failed"
        out["error"] = f"scanner exit code {returncode}; output tail:\n{output[-1500:]}"
    else:
        out["status"] = "running"
    return out


def verify_check(state: Lane4State) -> Lane4State:
    """From-disk verification: members.json connected_on growth is the truth, and
    it must equal the number of CONNECTED lines parsed (except on a dry run, which
    deliberately writes nothing)."""
    members = _read_json(MEMBERS, [])
    connected_after, outstanding_after = _connection_counts(members)
    new_connected = connected_after - state.get("connected_before", 0)
    connections = state.get("connections", [])

    mismatch = None
    if not state.get("stub") and not state.get("dry_run"):
        if new_connected != len(connections):
            mismatch = (f"members.json connected_on grew by {new_connected} but "
                        f"{len(connections)} CONNECTED lines were parsed — reconcile "
                        "before trusting the report")
    elif state.get("dry_run") and new_connected:
        mismatch = (f"DRY RUN wrote to members.json ({new_connected} new connected_on) — "
                    "it must not write at all; investigate before the next real run")

    return {
        "checked": {
            "dry_run": bool(state.get("dry_run")),
            "nothing_to_check": bool(state.get("nothing_to_check")),
            "outstanding_before": state.get("outstanding_before", 0),
            "rounds": state.get("rounds", 0),
            "cards_seen": state.get("cards_seen", 0),
            "newly_connected": connections,
            "newly_connected_count": len(connections),
            "inexact_dates": sum(1 for c in connections if c["inexact"]),
            "connected_delta": new_connected,
            "connected_total": connected_after,
            "still_outstanding": outstanding_after,
            "mismatch": mismatch,
        },
        "status": "done",
    }


def route_after_check(state: Lane4State) -> str:
    return "verify" if state.get("status") == "running" else "halt"


# ── Lane 5 (endorse skills + the one sanctioned favor-request DM) ────────────
# The heaviest lane per member: 1 profile view PLUS ~10 endorse clicks PLUS a DM,
# and the DM is the only message this whole folder is allowed to send. Same
# wrap-verify shape as lanes 2-4, with two lane-specific additions:
#   - The eligibility rule that picks --max is DOCUMENTED but lives in a human's
#     head at run time (endorse-and-message.md: DM everyone connected more than
#     14 days ago; if none qualify, ONE member >= 7 days). The wrapper reports the
#     age buckets from disk and WARNS when --max under-covers them. It never
#     changes --max: the number in Mike's ask is still the decision.
#   - The report names WHO got endorsed / DM'd / abandoned, because a DM is not
#     reversible and "which members did this run touch" is the standing question.

class Lane5State(TypedDict, total=False):
    max_members: int         # N from Mike's "Lane 5, N" — the human decision, per run
    dry_run: bool            # pass --dry-run through: count skills, send NOTHING
    stub: str                # "" = real; ok|restricted|errors|fail|nothing = structural test
    endorsed_before: dict    # members.json {endorsed, no_skills, dm_sent} snapshot
    eligible_before: dict    # eligible pool bucketed by connection age
    per_member: list         # [{slug, skills, dm, note}] assembled from the output
    counts: dict             # parsed from output (visited/endorsed/dm_sent/errors/...)
    output_tail: str
    nothing_to_do: bool      # nobody eligible — the script exited before the browser
    endorsed: dict           # verify_endorse's from-disk result
    status: str              # running | done | failed | halted_restricted
    error: Optional[str]


def _endorse_eligible(m) -> bool:
    """Mirrors endorse_and_message.py's own todo filter — accepted our invite, not
    yet DM'd, not abandoned for zero skills, not manually dm_excluded."""
    return (m.get("contact_status") == "connected"
            and not m.get("dm_sent_at")
            and m.get("endorse_status") != "no_skills"
            and not m.get("dm_excluded"))


def _days_since(ymd) -> Optional[int]:
    try:
        return (date.today() - datetime.strptime(str(ymd), "%Y-%m-%d").date()).days
    except (TypeError, ValueError):
        return None


def _endorse_counts(members) -> dict:
    """The three members.json facts this lane writes."""
    return {
        "endorsed": sum(1 for m in members if m.get("endorse_status") == "endorsed"),
        "no_skills": sum(1 for m in members if m.get("endorse_status") == "no_skills"),
        "dm_sent": sum(1 for m in members if m.get("dm_sent_at")),
    }


def _eligibility_buckets(members) -> dict:
    """The eligible pool split by how long ago they accepted — the numbers the
    documented '>14 days, else one >=7 days' rule is supposed to be read off."""
    b = {"total": 0, "over_14d": 0, "days_7_to_14": 0, "under_7d": 0, "unknown_date": 0}
    for m in members:
        if not _endorse_eligible(m):
            continue
        b["total"] += 1
        age = _days_since(m.get("connected_on"))
        if age is None:
            b["unknown_date"] += 1
        elif age > ENDORSE_AGE_DAYS:
            b["over_14d"] += 1
        elif age >= ENDORSE_FALLBACK_AGE_DAYS:
            b["days_7_to_14"] += 1
        else:
            b["under_7d"] += 1
    return b


def _views_today(members) -> dict:
    """Today's profile views, merged from the two sources — because NEITHER alone
    is complete, and this number is what stands between us and a third restriction:

      * members.json dated fields (contacted_at / endorsed_at) see Lane 3 and Lane 5
        even when run as a DIRECT, ungated script call, which the run log never records.
      * the run log (lane_runs.json) is the ONLY source for Lane 2 scrape views —
        members-urls.json carries no processed_at and captures carry no date.

    Take the larger of the two per category so neither source can under-report. Scrape
    used to be invisible here, which made the gate's printed total silently omit the
    single BIGGEST consumer of the daily budget (a scrape run is up to 75 views)."""
    t = date.today().strftime("%Y-%m-%d")
    from_members = {
        "invites": sum(1 for m in members if m.get("contacted_at") == t),
        "endorsed": sum(1 for m in members if m.get("endorsed_at") == t),
    }
    per_lane = (views_today() or {}).get("per_lane", {})
    invites = max(from_members["invites"], per_lane.get("invite", 0))
    endorsed = max(from_members["endorsed"], per_lane.get("endorse", 0))
    scrape = per_lane.get("scrape", 0)
    return {"invites": invites, "endorsed": endorsed, "scrape": scrape,
            "total": invites + endorsed + scrape}


def lane5_plan(members=None) -> dict:
    """THE LANE 5 SELECTION RULE, in code (endorse-and-message.md, Mike 2026-07-21):

        endorse + DM every member connected more than 14 days ago;
        if none qualify, exactly ONE member connected at least 7 days ago (oldest);
        if none qualify for that either, do nothing at all.

    The script itself only takes --max, so this rule used to run in Mike's head every
    morning. Now `--lane 5` with no number derives it. Returns {max, reason, buckets,
    oldest_days, views_today}; max == 0 means "do nothing today, don't open Chrome".

    Because the script works its queue OLDEST-FIRST, taking the top `max` entries
    selects exactly the members this rule means — and members with no connection date
    sort last, so they can never be swept in by the count."""
    if members is None:
        members = _read_json(MEMBERS, [])
    buckets = _eligibility_buckets(members)
    ages = [a for a in (_days_since(m.get("connected_on"))
                        for m in members if _endorse_eligible(m)) if a is not None]
    oldest = max(ages) if ages else None

    if buckets["over_14d"]:
        n = buckets["over_14d"]
        reason = (f"{n} member(s) connected more than {ENDORSE_AGE_DAYS} days ago "
                  f"(oldest {oldest} days)")
    elif buckets["days_7_to_14"]:
        n = 1
        reason = (f"nobody past {ENDORSE_AGE_DAYS} days, so the fallback sends to exactly "
                  f"ONE member in the {ENDORSE_FALLBACK_AGE_DAYS}-{ENDORSE_AGE_DAYS} day "
                  f"band (oldest {oldest} days)")
    else:
        n = 0
        reason = (f"nobody past {ENDORSE_AGE_DAYS} days and nobody in the "
                  f"{ENDORSE_FALLBACK_AGE_DAYS}-{ENDORSE_AGE_DAYS} day fallback band"
                  + (f" (oldest eligible is {oldest} days)" if oldest is not None
                     else " (no eligible member carries a connection date)"))
    return {"max": n, "reason": reason, "buckets": buckets,
            "oldest_days": oldest, "views_today": _views_today(members)}


def _parse_endorse_members(lines) -> list:
    """Walk the per-member blocks and record what happened to each one. The visit
    line opens a block; every outcome line until the next visit line belongs to it."""
    out, cur = [], None
    for line in lines:
        v = ENDORSE_VISIT_RE.match(line)
        if v:
            slug = re.search(r"/in/([^/?#]+)", v.group("url"))
            cur = {"slug": slug.group(1) if slug else v.group("url"),
                   "skills": None, "skills_dry": False, "dm": None, "note": None}
            out.append(cur)
            continue
        if cur is None:
            continue
        real, dry = ENDORSED_RE.match(line), DRY_ENDORSE_RE.match(line)
        dm_failed = DM_FAILED_RE.match(line)
        if real or dry:
            # Keep the dry flag: "would endorse 11" must never be reported as "endorsed 11".
            cur["skills"] = int((real or dry).group("count"))
            cur["skills_dry"] = real is None
        elif NO_SKILLS_RE.match(line):
            cur["note"] = "no endorsable skills (abandoned, no DM)"
        elif ALREADY_ENDORSED_RE.match(line):
            cur["note"] = "already endorsed on an earlier run"
        elif ENDORSE_FAILED_RE.match(line):
            cur["note"] = "endorse failed (retry next run)"
        elif DM_SENT_RE.match(line):
            cur["dm"] = "sent"
        elif DRY_DM_RE.match(line):
            cur["dm"] = "dry-found"
        elif dm_failed:
            cur["dm"] = dm_failed.group("status")
        elif PROFILE_ERR_RE.match(line):
            cur["note"] = "error (retry next run)"
    return out


def endorse(state: Lane5State) -> Lane5State:
    """Run the endorser (--max=N [--dry-run]) as a subprocess. It checks
    is_restricted itself and stops (exit 0) on BOTH the profile page and the
    skills page, so detection is by its printed marker lines, not the exit code.
    Same kill-switch as lanes 2-3: a streak of CONSECUTIVE_ERROR_LIMIT per-member
    errors means something systemic broke — kill the process tree."""
    members_before = _read_json(MEMBERS, [])
    endorsed_before = _endorse_counts(members_before)
    eligible_before = _eligibility_buckets(members_before)

    if state.get("stub"):
        cmd = [sys.executable, "-c",
               _stub_endorse_script(state["stub"], state["max_members"],
                                    bool(state.get("dry_run")))]
    else:
        args = [f"--max={state['max_members']}"]
        if state.get("dry_run"):
            args.append("--dry-run")
        cmd = _wrap_cmd(ENDORSE_SCRIPT, *args)

    returncode, output, killed_reason = _run_streaming(
        cmd, kill_after_consecutive_errors=True, success_res=LANE5_SUCCESS_RES,
        lane=5, node="endorse", stub=state.get("stub", ""))

    lines = output.splitlines()
    endorsed_lines = [m for m in (ENDORSED_RE.match(l) for l in lines) if m]
    dry_lines = [m for m in (DRY_ENDORSE_RE.match(l) for l in lines) if m]
    counts = {
        "visited": sum(1 for l in lines if VISIT_RE.match(l)),
        "endorsed": len(endorsed_lines),
        "skills_endorsed": sum(int(m.group("count")) for m in endorsed_lines),
        "no_skills": sum(1 for l in lines if NO_SKILLS_RE.match(l)),
        "dm_sent": sum(1 for l in lines if DM_SENT_RE.match(l)),
        "dm_failed": sum(1 for l in lines if DM_FAILED_RE.match(l)),
        "endorse_failed": sum(1 for l in lines if ENDORSE_FAILED_RE.match(l)),
        "already_endorsed": sum(1 for l in lines if ALREADY_ENDORSED_RE.match(l)),
        "dry_endorse": len(dry_lines),
        "dry_skills": sum(int(m.group("count")) for m in dry_lines),
        "dry_dm": sum(1 for l in lines if DRY_DM_RE.match(l)),
        "errors": sum(1 for l in lines if PROFILE_ERR_RE.match(l)),
    }

    out: Lane5State = {
        "endorsed_before": endorsed_before,
        "eligible_before": eligible_before,
        "per_member": _parse_endorse_members(lines),
        "counts": counts,
        "nothing_to_do": NOTHING_TO_DO in output,
        "output_tail": output[-4000:],
    }
    if (INVITE_RESTRICTION_MARKER in output or SKILLS_RESTRICTION_MARKER in output
            or RESTRICTION_PAGE_RE.search(output)):
        out["status"] = "halted_restricted"
        out["error"] = ("Restriction / unusual-activity page — endorser stopped itself. "
                        "STOP for the rest of the day. Never rerun after this.")
    elif killed_reason:
        out["status"] = "failed"
        out["error"] = killed_reason
    elif returncode != 0 or "FATAL:" in output:
        out["status"] = "failed"
        out["error"] = f"endorser exit code {returncode}; output tail:\n{output[-1500:]}"
    else:
        out["status"] = "running"
    return out


def verify_endorse(state: Lane5State) -> Lane5State:
    """From-disk verification: members.json is the truth for all three facts this
    lane writes (endorse_status=endorsed, =no_skills, dm_sent_at), and each disk
    delta must equal the matching parsed line count. A DM cannot be unsent, so a
    disagreement here is reported loudly rather than smoothed over.

    DRY-RUN QUIRK (inherited from the JS original, deliberately preserved by the
    port): --dry-run endorses and DMs nothing, but it DOES record a zero-skills
    finding — the skills page really was opened and really had nothing to endorse,
    so the member is marked no_skills and never revisited. So on a dry run
    no_skills may move (and must match the parsed lines), while endorsed and
    dm_sent must not move at all."""
    members = _read_json(MEMBERS, [])
    after = _endorse_counts(members)
    before = state.get("endorsed_before", {})
    delta = {k: after.get(k, 0) - before.get(k, 0) for k in ("endorsed", "no_skills", "dm_sent")}
    counts = state.get("counts", {})

    problems = []
    if not state.get("stub"):
        if state.get("dry_run"):
            for key, verb in (("endorsed", "endorse"), ("dm_sent", "DM")):
                if delta[key]:
                    problems.append(f"DRY RUN changed members.json {key} by {delta[key]:+d} "
                                    f"— a dry run must never {verb} anyone")
            if delta["no_skills"] != counts.get("no_skills", 0):
                problems.append(f"members.json no_skills moved by {delta['no_skills']} but "
                                f"{counts.get('no_skills', 0)} NO ENDORSABLE SKILLS line(s) "
                                "were parsed")
        else:
            for key, parsed, label in (
                ("dm_sent", counts.get("dm_sent", 0), "DM SENT"),
                ("endorsed", counts.get("endorsed", 0), "ENDORSED"),
                ("no_skills", counts.get("no_skills", 0), "NO ENDORSABLE SKILLS"),
            ):
                if delta[key] != parsed:
                    problems.append(f"members.json {key} grew by {delta[key]} but {parsed} "
                                    f"{label} line(s) were parsed")
    mismatch = ("; ".join(problems) + " — reconcile before trusting the report"
                if problems else None)

    return {
        "endorsed": {
            "requested": state.get("max_members"),
            "dry_run": bool(state.get("dry_run")),
            "nothing_to_do": bool(state.get("nothing_to_do")),
            "visited": counts.get("visited", 0),
            "endorsed": counts.get("endorsed", 0),
            "skills_endorsed": counts.get("skills_endorsed", 0),
            "no_skills": counts.get("no_skills", 0),
            "dm_sent": counts.get("dm_sent", 0),
            "dm_failed": counts.get("dm_failed", 0),
            "endorse_failed": counts.get("endorse_failed", 0),
            "already_endorsed": counts.get("already_endorsed", 0),
            "dry_endorse": counts.get("dry_endorse", 0),
            "dry_skills": counts.get("dry_skills", 0),
            "dry_dm": counts.get("dry_dm", 0),
            "errors": counts.get("errors", 0),
            "per_member": state.get("per_member", []),
            "members_delta": delta,
            "eligible_before": state.get("eligible_before", {}),
            "eligible_after": _eligibility_buckets(members),
            "mismatch": mismatch,
        },
        "status": "done",
    }


def route_after_endorse(state: Lane5State) -> str:
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


def build_lane3_graph(checkpointer=None):
    """Lane 3: invite at --max=N."""
    g = StateGraph(Lane3State)
    g.add_node("invite", invite)         # zero retries here too — one attempt per run.
    g.add_node("verify_invite", verify_invite)
    g.add_edge(START, "invite")
    g.add_conditional_edges("invite", route_after_invite, {"verify": "verify_invite", "halt": END})
    g.add_edge("verify_invite", END)
    return g.compile(checkpointer=checkpointer)


def build_lane4_graph(checkpointer=None):
    """Lane 4: check acceptances (one list page, no --max)."""
    g = StateGraph(Lane4State)
    g.add_node("check", check)           # zero retries here too — one attempt per run.
    g.add_node("verify_check", verify_check)
    g.add_edge(START, "check")
    g.add_conditional_edges("check", route_after_check, {"verify": "verify_check", "halt": END})
    g.add_edge("verify_check", END)
    return g.compile(checkpointer=checkpointer)


def build_lane5_graph(checkpointer=None):
    """Lane 5: endorse skills + the favor-request DM at --max=N."""
    g = StateGraph(Lane5State)
    g.add_node("endorse", endorse)       # zero retries here too — one attempt per run.
    g.add_node("verify_endorse", verify_endorse)
    g.add_edge(START, "endorse")
    g.add_conditional_edges("endorse", route_after_endorse,
                            {"verify": "verify_endorse", "halt": END})
    g.add_edge("verify_endorse", END)
    return g.compile(checkpointer=checkpointer)
