# run.py — CLI runner for the LinkedIn lane graphs (lane_graph.py).
#
# Lane 1 (seed):    python linkedin-automation/graph/run.py --names "Xavier,Xander"
# Lane 2 (scrape):  python linkedin-automation/graph/run.py --lane 2 --max 50
#
# Mike's morning contract (2026-07-28): "Lane 2, 50" -> --lane 2 --max 50. The
# number in the ask IS the human decision — no interrupts. The Lane 2 report
# always ends with the REGIONS breakdown of the new captures.
#
# Flags:
#   --lane N          1 (default) or 2
#   --names "A,B,C"   lane 1: names to seed
#   --max N           lane 2: profiles to visit this run (Mike's per-day choice)
#   --thread ID       checkpoint thread id (default <lane>-<YYYYMMDD>)
#   --stub MODE       structural test, no browser, no data writes.
#                     lane 1: ok | restricted | fail
#                     lane 2: ok | restricted | fail | errors (kill-switch test)
#
# Exit codes: 0 = done · 2 = halted (restriction page) · 1 = failed
#
# Single-instance rule applies to real runs: one li-bot-profile Chrome, never two
# lanes at once, lanes strictly sequential. Scrape stays <= 50 profiles/day.

import argparse
import sqlite3
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lane_graph import CHECKPOINT_DB, build_graph, build_lane2_graph  # noqa: E402

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


def main():
    ap = argparse.ArgumentParser(description="Run a LinkedIn morning lane through LangGraph.")
    ap.add_argument("--lane", type=int, choices=[1, 2], default=1)
    ap.add_argument("--names", help='lane 1: comma-separated, e.g. "Xavier,Xander"')
    ap.add_argument("--group", default="6665791", help="lane 1: group to search")
    ap.add_argument("--max", type=int, help="lane 2: profiles to visit this run")
    ap.add_argument("--thread", default=None, help="checkpoint thread id")
    ap.add_argument("--stub", choices=["ok", "restricted", "fail", "errors"], default="")
    args = ap.parse_args()

    if args.lane == 1:
        names = [n.strip() for n in (args.names or "").split(",") if n.strip()]
        if not names:
            print("Lane 1 needs --names.", file=sys.stderr)
            sys.exit(1)
        if args.stub == "errors":
            print("--stub errors is a lane 2 test.", file=sys.stderr)
            sys.exit(1)
        init = {"group_id": args.group, "names": names, "stub": args.stub, "status": "running"}
        thread = args.thread or f"seed-{args.group}-{date.today():%Y%m%d}"
        banner = f"Lane 1 seed graph | group {args.group} | names: {', '.join(names)}"
        build, report = build_graph, report_lane1
    else:
        if not args.max or args.max < 1:
            print("Lane 2 needs --max N (Mike's number for the day).", file=sys.stderr)
            sys.exit(1)
        if not args.stub and args.max > 50:
            print("Lane 2 hard rule: scraping <= 50 profile views/day.", file=sys.stderr)
            sys.exit(1)
        init = {"max_views": args.max, "stub": args.stub, "status": "running"}
        thread = args.thread or f"scrape-{date.today():%Y%m%d}"
        banner = f"Lane 2 scrape graph | max {args.max}"
        build, report = build_lane2_graph, report_lane2

    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build(checkpointer=SqliteSaver(conn))

    print(banner)
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (f" | STUB MODE: {args.stub}" if args.stub else ""))
    print("-" * 60)
    final = app.invoke(init, config={"configurable": {"thread_id": thread}})
    print("-" * 60)
    sys.exit(report(final))


if __name__ == "__main__":
    main()
