# run.py — CLI runner for the Lane 1 seed graph (lane_graph.py).
#
#   python linkedin-automation/graph/run.py --names "Xavier,Xander"
#   python linkedin-automation/graph/run.py --names "A,B" --stub ok          # no browser
#   python linkedin-automation/graph/run.py --names "A,B" --stub restricted  # halt-route test
#
# Flags:
#   --names "A,B,C"   names to seed (required)
#   --group ID        group to search (default 6665791)
#   --thread ID       checkpoint thread id (default seed-<group>-<YYYYMMDD>)
#   --stub MODE       ok | restricted | fail — structural test, seeder is stubbed,
#                     no browser is opened and no data file is written
#
# Exit codes: 0 = done · 2 = halted (restriction page) · 1 = failed
#
# Single-instance rule still applies to real runs: this launches the li-bot-profile
# Chrome via the wrapped seeder — never run alongside any other LinkedIn script.

import argparse
import sqlite3
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lane_graph import CHECKPOINT_DB, build_graph  # noqa: E402

from langgraph.checkpoint.sqlite import SqliteSaver  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description="Run LinkedIn Lane 1 (seed-by-name) through LangGraph.")
    ap.add_argument("--names", required=True, help='comma-separated, e.g. "Xavier,Xander"')
    ap.add_argument("--group", default="6665791")
    ap.add_argument("--thread", default=None, help="checkpoint thread id")
    ap.add_argument("--stub", choices=["ok", "restricted", "fail"], default="")
    args = ap.parse_args()

    names = [n.strip() for n in args.names.split(",") if n.strip()]
    if not names:
        print("No names given.", file=sys.stderr)
        sys.exit(1)

    thread = args.thread or f"seed-{args.group}-{date.today():%Y%m%d}"
    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build_graph(checkpointer=SqliteSaver(conn))

    print(f"Lane 1 seed graph | group {args.group} | names: {', '.join(names)}")
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (f" | STUB MODE: {args.stub}" if args.stub else ""))
    print("-" * 60)

    final = app.invoke(
        {"group_id": args.group, "names": names, "stub": args.stub, "status": "running"},
        config={"configurable": {"thread_id": thread}},
    )

    print("-" * 60)
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status == "done":
        s = final["seeded"]
        print(f"  queue: {s['queue_before']} -> {s['queue_after']}  (+{s['new']} new)")
        for n, r in s["per_name"].items():
            print(f"  {n}: {r['matched']} matched, {r['added']} added")
        if s["names_skipped"]:
            print(f"  WARNING names skipped (errored in seeder): {', '.join(s['names_skipped'])}")
        if s["searched_names_missing"]:
            print(f"  NOTE searched_names not recorded for: {', '.join(s['searched_names_missing'])}")
        sys.exit(0)
    else:
        print(f"  {final.get('error', 'no error detail')}")
        sys.exit(2 if status == "halted_restricted" else 1)


if __name__ == "__main__":
    main()
