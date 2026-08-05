# run.py — CLI runner for the LinkedIn lane graphs (lane_graph.py).
#
# Lane 1 (seed):    python linkedin-automation/graph/run.py --names "Xavier,Xander"
# Lane 2 (scrape):  python linkedin-automation/graph/run.py --lane 2 --max 50
# Lane 3 (invite):  python linkedin-automation/graph/run.py --lane 3 --max 10
# Lane 4 (check):   python linkedin-automation/graph/run.py --lane 4
# Lane 5 (endorse): python linkedin-automation/graph/run.py --lane 5
#
# Mike's morning contract (2026-07-28): "Lane N, X" -> --lane N --max X. The
# number in the ask IS the human decision — no interrupts. The Lane 2 report
# always ends with the REGIONS breakdown of the new captures. Lane 4 takes NO
# number: it reads one list page, so there is nothing to budget.
#
# LANE 5 TAKES NO NUMBER EITHER (Mike, 2026-08-01): "the only thing I need to do in
# the morning is just say run lane five". Its number was never a judgment call, it
# is a documented rule applied to the data — endorse+DM everyone connected more than
# 14 days ago, else exactly ONE member in the 7-14 day band, else do nothing — so
# lane5_gate() derives it (lane5_plan() in lane_graph.py is the rule in code). The
# gate refuses three ways rather than guess: nothing qualifies -> exit 0 without
# opening Chrome; a derived run above LANE5_AUTO_MAX -> refuse, the volume call is
# Mike's; --max reaching PAST what the rule selects -> refuse, those connections are
# too recent to DM. --max may still REDUCE the run on a heavy-volume day.
#
# Flags:
#   --lane N          1 (default), 2, 3, 4, or 5
#   --names "A,B,C"   lane 1: names to seed
#   --max N           lanes 2-3: members to work this run (required, Mike's choice)
#                     lane 5: OPTIONAL — derived from the rule when omitted; when
#                             given it may only reduce, never exceed, the rule
#   --dry-run         lane 3: locate the Connect button but send NOTHING
#                     lane 4: scan + report matches but write NOTHING
#                     lane 5: count endorsable skills + locate Message, but
#                             endorse/send NOTHING
#   --thread ID       checkpoint thread id (default <lane>-<YYYYMMDD>; lane 4 adds
#                     -<HHMM> because it is run repeatedly on the same day)
#   --stub MODE       structural test, no browser, no data writes.
#                     lane 1: ok | restricted | fail
#                     lane 2: ok | restricted | fail | errors (kill-switch test)
#                     lane 3: ok | restricted | fail | errors | limit (weekly cap test)
#                     lane 4: ok | restricted | fail | nothing (empty-queue path)
#                     lane 5: ok | restricted | fail | errors | nothing
#
# Exit codes: 0 = done · 2 = halted (restriction page) · 1 = failed
#
# Single-instance rule applies to real runs: one li-bot-profile Chrome, never two
# lanes at once, lanes strictly sequential. Scrape stays <= 75 profiles/day (raised
# from 50, Mike, 2026-07-30). Invites have no fixed daily cap (rescinded 2026-07-28)
# — --max is Mike's per-run number; stay aware of TOTAL profile views vs the
# ~120/24h restriction threshold (each invite = 1 view). Lane 4 costs ~0 views.
# Lane 5 has no DM cap either (Mike, 2026-07-21: DM everyone connected >14 days
# ago) but is the heaviest per member — 1 profile view + ~10 endorse clicks + a DM.

import argparse
import sqlite3
import sys
import time
from datetime import date, datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lane_graph import (  # noqa: E402
    CHECKPOINT_DB, LANE5_AUTO_MAX, build_graph, build_lane2_graph, build_lane3_graph,
    build_lane4_graph, build_lane5_graph, finish_progress, lane5_plan, record_run,
)

from langgraph.checkpoint.sqlite import SqliteSaver  # noqa: E402


def report_lane1(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 2 if status == "halted_restricted" else 1
    s = final["seeded"]
    print(f"  queue: {s['queue_before']} -> {s['queue_after']}  (+{s['new']} new)")
    for n, r in s["per_name"].items():
        print(f"  {n}: {r['matched']} matched, {r['added']} added")
    if s["names_skipped"]:
        print(f"  WARNING names skipped (errored in seeder): {', '.join(s['names_skipped'])}")
    if s["searched_names_missing"]:
        print(f"  NOTE searched_names not recorded for: {', '.join(s['searched_names_missing'])}")
    return 0


def report_lane2(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 2 if status == "halted_restricted" else 1
    s = final["scraped"]
    print(f"  requested {s['requested']} | visited {s['visited']} | "
          f"processed +{s['processed_delta']} | captured +{s['captured_delta']} "
          f"(total {s['captured_total']})")
    print(f"  skipped out-of-zone {s['skipped_out_of_zone']} | already-captured "
          f"{s['already']} | errors (retry next run) {s['errors']}")
    print(f"  queue remaining: {s['queue_remaining']}")
    if s["mismatch"]:
        print(f"  WARNING {s['mismatch']}")
    print("  REGIONS of the new captures:")
    if not s["regions"]:
        print("    (none captured this run)")
    for zone, locs in s["regions"].items():
        print(f"    {zone}: {len(locs)}")
        for loc in locs:
            print(f"      - {loc}")
    return 0


def report_lane3(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 2 if status == "halted_restricted" else 1
    s = final["invited"]
    mode = " [DRY RUN]" if s["dry_run"] else ""
    print(f"  requested {s['requested']}{mode} | visited {s['visited']} | sent {s['sent']} | "
          f"already pending {s['already_pending']} | already connected {s['already_connected']}")
    print(f"  no-connect strike 1: {s['nocb_strike1']} | retired (2nd strike): {s['nocb_retired']} | "
          f"errors (retry next run): {s['errors']}"
          + (f" | dry-found {s['dry_found']}" if s["dry_run"] else ""))
    delta = ", ".join(f"{k} {v:+d}" for k, v in sorted(s["contacted_delta"].items())) or "none"
    print(f"  members.json contacted delta: {delta}")
    print(f"  still to contact: {s['remaining_to_contact']}")
    if s["limit_hit"]:
        print("  WARNING LinkedIn weekly invite/note LIMIT hit — the run stopped itself. "
              "No more invites until the cap resets; do NOT rerun today.")
    if s["mismatch"]:
        print(f"  WARNING {s['mismatch']}")
    return 0


def report_lane4(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 2 if status == "halted_restricted" else 1
    s = final["checked"]
    if s["nothing_to_check"]:
        print("  nothing to check: no contacted member is awaiting acceptance "
              "(no browser was launched).")
        return 0
    mode = " [DRY RUN]" if s["dry_run"] else ""
    print(f"  awaiting acceptance at start: {s['outstanding_before']}{mode} | "
          f"scroll rounds {s['rounds']} | connection cards seen {s['cards_seen']}")
    print(f"  newly connected: {s['newly_connected_count']}"
          + (f" ({s['inexact_dates']} with no date shown, recorded as observed today)"
             if s["inexact_dates"] else ""))
    for c in s["newly_connected"]:
        print(f"    - {c['slug']} -> {c['date']}" + ("  (observed)" if c["inexact"] else ""))
    print(f"  members.json connected_on: {s['connected_total']} total "
          f"({s['connected_delta']:+d} this run)")
    print(f"  still awaiting acceptance: {s['still_outstanding']}")
    if s["mismatch"]:
        print(f"  WARNING {s['mismatch']}")
    return 0


def report_lane5(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 2 if status == "halted_restricted" else 1
    s = final["endorsed"]
    if s["nothing_to_do"]:
        print("  nothing to do: no connected member is eligible for endorse+DM "
              "(no browser was launched).")
        return 0
    mode = " [DRY RUN]" if s["dry_run"] else ""
    print(f"  requested {s['requested']}{mode} | visited {s['visited']} | "
          f"endorsed {s['endorsed']} member(s) ({s['skills_endorsed']} skills) | "
          f"DMs sent {s['dm_sent']}")
    if s["dry_run"]:
        print(f"  [dry] would endorse {s['dry_endorse']} member(s) "
              f"({s['dry_skills']} skills) | Message button found on {s['dry_dm']}")
    print(f"  no endorsable skills (abandoned) {s['no_skills']} | already endorsed "
          f"{s['already_endorsed']} | endorse failures {s['endorse_failed']} | "
          f"DM failures {s['dm_failed']} | errors (retry next run) {s['errors']}")
    d = s["members_delta"]
    print(f"  members.json delta: endorsed {d['endorsed']:+d} | "
          f"no_skills {d['no_skills']:+d} | dm_sent {d['dm_sent']:+d}")
    if s["per_member"]:
        print("  per member:")
        for m in s["per_member"]:
            bits = []
            if m["skills"] is not None:
                bits.append(f"[dry] would endorse {m['skills']} skill(s)"
                            if m.get("skills_dry") else f"{m['skills']} skill(s) endorsed")
            if m["dm"] == "sent":
                bits.append("DM SENT")
            elif m["dm"] == "dry-found":
                bits.append("[dry] Message button found")
            elif m["dm"]:
                bits.append(f"DM {m['dm']} (retry next run)")
            if m["note"]:
                bits.append(m["note"])
            print(f"    - {m['slug']}: {', '.join(bits) or 'nothing recorded'}")
    ea = s["eligible_after"]
    print(f"  eligible remaining: {ea['total']}  (>14d: {ea['over_14d']}, "
          f"7-14d: {ea['days_7_to_14']}, <7d: {ea['under_7d']}"
          + (f", no date: {ea['unknown_date']}" if ea["unknown_date"] else "") + ")")
    over14 = s["eligible_before"].get("over_14d", 0)
    if not s["dry_run"] and over14 > (s["requested"] or 0):
        print(f"  WARNING --max {s['requested']} under-covered the pool: {over14} member(s) "
              "were connected more than 14 days ago, and the documented rule is to "
              "endorse+DM ALL of them (endorse-and-message.md, Mike 2026-07-21). Run "
              "again with a bigger --max, watching total profile-view volume.")
    if s["mismatch"]:
        print(f"  WARNING {s['mismatch']}")
    return 0


def lane5_gate(args):
    """Derive Lane 5's --max from the documented rule, or refuse. Returns
    (max_members, rule_label); exits the process on a refusal or a no-op day.

    This is the mechanical gate for the 14-day / 7-day rule (Mike, 2026-08-01): "the
    only thing I need to do in the morning is say run lane five". So a bare
    `--lane 5` derives its own number, `--max` may only REDUCE below what the rule
    selects (never reach past it into too-recent connections), and a derived run
    larger than LANE5_AUTO_MAX is refused so the volume decision stays human — same
    shape as Lane 2's --max>75 refusal."""
    if args.max is not None and args.max < 1:
        print("--max must be at least 1.", file=sys.stderr)
        sys.exit(1)
    if args.stub:
        # A stub is a structural test of the GRAPH; the gate reads real member data,
        # which a stub deliberately never touches. Keep the number explicit here.
        if args.max is None:
            print("A lane 5 --stub run still needs an explicit --max N "
                  "(the rule gate is bypassed under --stub).", file=sys.stderr)
            sys.exit(1)
        return args.max, "stub"

    plan = lane5_plan()
    b = plan["buckets"]
    v = plan["views_today"]
    print(f"Lane 5 rule: {plan['reason']}.")
    print(f"  eligible pool: {b['total']}  (>14d: {b['over_14d']}, "
          f"7-14d: {b['days_7_to_14']}, <7d: {b['under_7d']}"
          + (f", no connection date: {b['unknown_date']}" if b["unknown_date"] else "") + ")")
    print(f"  profile views already used today: {v['total']} of ~120 "
          f"({v['scrape']} scrape + {v['invites']} invite + {v['endorsed']} endorse)")
    if v["total"] >= 80:
        print(f"  ** {v['total']} views already today — the account was restricted at ~120. "
              "Consider stopping here.")

    if plan["max"] == 0:
        print("\nNothing qualifies today under the 14-day rule or its 7-day fallback. "
              "No browser launched, nothing endorsed, nothing sent.")
        sys.exit(0)

    if args.max is None:
        if plan["max"] > LANE5_AUTO_MAX:
            print(f"\nREFUSED: the rule selects {plan['max']} member(s), above the "
                  f"{LANE5_AUTO_MAX}/run ceiling for a self-derived run. Each member is a "
                  "profile view PLUS ~10 endorse clicks PLUS a DM, and this account has "
                  "been restricted twice at ~120 views/24h. Decide the number against "
                  f"today's total volume and re-run, e.g. --lane 5 --max {LANE5_AUTO_MAX} "
                  "— the rest stay queued for the next run.", file=sys.stderr)
            sys.exit(1)
        return plan["max"], "auto, from the rule"

    if args.max > plan["max"]:
        print(f"\nREFUSED: --max {args.max} reaches past what the rule selects "
              f"({plan['max']}) — {plan['reason']}. Anyone beyond that is too recent a "
              f"connection to DM today. Re-run with --max {plan['max']} or less, or bare "
              "--lane 5.", file=sys.stderr)
        sys.exit(1)
    return args.max, f"explicit --max, rule allows up to {plan['max']}"


def main():
    ap = argparse.ArgumentParser(description="Run a LinkedIn morning lane through LangGraph.")
    ap.add_argument("--lane", type=int, choices=[1, 2, 3, 4, 5], default=1)
    ap.add_argument("--names", help='lane 1: comma-separated, e.g. "Xavier,Xander"')
    ap.add_argument("--group", default="6665791", help="lane 1: group to search")
    ap.add_argument("--max", type=int,
                    help="lanes 2-3: members to work this run (required) · lane 5: "
                         "OPTIONAL override, derived from the 14/7-day rule if omitted")
    ap.add_argument("--dry-run", action="store_true",
                    help="lane 3: find Connect but send nothing · lane 4: scan but write "
                         "nothing · lane 5: count skills but endorse/send nothing")
    ap.add_argument("--thread", default=None, help="checkpoint thread id")
    ap.add_argument("--stub",
                    choices=["ok", "restricted", "fail", "errors", "limit", "nothing"], default="")
    args = ap.parse_args()

    if args.stub == "errors" and args.lane not in (2, 3, 5):
        print("--stub errors is a lane 2/3/5 test.", file=sys.stderr)
        sys.exit(1)
    if args.stub == "limit" and args.lane != 3:
        print("--stub limit is a lane 3 test.", file=sys.stderr)
        sys.exit(1)
    if args.stub == "nothing" and args.lane not in (4, 5):
        print("--stub nothing is a lane 4/5 test.", file=sys.stderr)
        sys.exit(1)
    if args.dry_run and args.lane not in (3, 4, 5):
        print("--dry-run is a lane 3/4/5 flag.", file=sys.stderr)
        sys.exit(1)
    if args.max and args.lane == 4:
        print("Lane 4 takes no --max (it reads one list page).", file=sys.stderr)
        sys.exit(1)

    if args.lane == 1:
        names = [n.strip() for n in (args.names or "").split(",") if n.strip()]
        if not names:
            print("Lane 1 needs --names.", file=sys.stderr)
            sys.exit(1)
        init = {"group_id": args.group, "names": names, "stub": args.stub, "status": "running"}
        thread = args.thread or f"seed-{args.group}-{date.today():%Y%m%d}"
        banner = f"Lane 1 seed graph | group {args.group} | names: {', '.join(names)}"
        build, report = build_graph, report_lane1
    elif args.lane == 2:
        if not args.max or args.max < 1:
            print("Lane 2 needs --max N (Mike's number for the day).", file=sys.stderr)
            sys.exit(1)
        if not args.stub and args.max > 75:
            print("Lane 2 hard rule: scraping <= 75 profile views/day.", file=sys.stderr)
            sys.exit(1)
        init = {"max_views": args.max, "stub": args.stub, "status": "running"}
        thread = args.thread or f"scrape-{date.today():%Y%m%d}"
        banner = f"Lane 2 scrape graph | max {args.max}"
        build, report = build_lane2_graph, report_lane2
    elif args.lane == 3:
        if not args.max or args.max < 1:
            print("Lane 3 needs --max N (Mike's number for the run).", file=sys.stderr)
            sys.exit(1)
        init = {"max_invites": args.max, "dry_run": args.dry_run,
                "stub": args.stub, "status": "running"}
        thread = args.thread or f"invite-{date.today():%Y%m%d}"
        banner = f"Lane 3 invite graph | max {args.max}" + (" | DRY RUN" if args.dry_run else "")
        build, report = build_lane3_graph, report_lane3
    elif args.lane == 4:
        init = {"dry_run": args.dry_run, "stub": args.stub, "status": "running"}
        # Lane 4 is cheap and Mike runs it repeatedly on the same day, so the default
        # thread carries the time too — each run gets its own checkpoint lineage.
        thread = args.thread or f"check-{datetime.now():%Y%m%d-%H%M}"
        banner = "Lane 4 check-acceptances graph" + (" | DRY RUN" if args.dry_run else "")
        build, report = build_lane4_graph, report_lane4
    else:
        max_members, rule = lane5_gate(args)
        init = {"max_members": max_members, "dry_run": args.dry_run,
                "stub": args.stub, "status": "running"}
        # Like Lane 4, the default thread carries the time: a refused run is meant to
        # be re-run immediately with an explicit --max, so same-day repeats are normal.
        thread = args.thread or f"endorse-{datetime.now():%Y%m%d-%H%M}"
        banner = (f"Lane 5 endorse+DM graph | max {max_members} ({rule})"
                  + (" | DRY RUN" if args.dry_run else ""))
        build, report = build_lane5_graph, report_lane5

    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build(checkpointer=SqliteSaver(conn))

    print(banner)
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (f" | STUB MODE: {args.stub}" if args.stub else ""))
    print("-" * 60)

    started_at, t0 = datetime.now().isoformat(timespec="seconds"), time.monotonic()
    try:
        final = app.invoke(init, config={"configurable": {"thread_id": thread}})
    except BaseException as e:
        # A crash or a Ctrl-C still ends the run — say so in the feed rather than
        # leaving the dashboard showing a node that spins forever.
        finish_progress("crashed", f"{type(e).__name__}: {e}")
        raise
    print("-" * 60)

    # Record the run BEFORE reporting: report() calls sys.exit(), and the run log is
    # what the dashboard and the volume total read.
    requested = {1: len(init.get("names", [])) or None}.get(args.lane, args.max)
    record_run(lane=args.lane, thread=thread, final=final, started_at=started_at,
               ended_at=datetime.now().isoformat(timespec="seconds"),
               duration_s=time.monotonic() - t0, stub=args.stub,
               dry_run=args.dry_run, requested=requested)
    finish_progress(final.get("status", "unknown"), final.get("error"))

    sys.exit(report(final))


if __name__ == "__main__":
    main()
