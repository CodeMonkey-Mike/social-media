# run.py — CLI for the longform-edited LangGraph (2026-09-17).
#
#   python video-creation/longform-edited/graph/run.py longform --project <name> \
#       [--brief "..."] [--constraints "..."] [--title "..."] [--scope ALL] [--face-max N] \
#       [--until <gate>] [--approve g,g] [--done node,node] [--redo node,node] \
#       [--resume] [--thread T] [--stub ok|fail]
#   python video-creation/longform-edited/graph/run.py status --project <name>
#
# One invocation drives the video from wherever it is until the next HITL gate or
# placeholder (exit 2 = waiting on Mike; the report prints the exact resume command).
# `--approve <gate>` / `--done <node>` ride IN the resume (Command(resume=...)); every
# approval is also recorded in the project's GRAPH-PROGRESS.json so a fresh thread honours
# it. Nodes are redo-safe (artifact on disk => skip); `--redo node` forces one to re-run.
# Thread = `longform-<project>` (stable per video); `--thread` sidesteps a corrupted one.
# Gates: screenplay · spine · plan · blueprint · draft.

import argparse
import sqlite3
import sys
import time
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402
from longform_graph import ORDER, build_longform_graph  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def _parse_list(csv):
    return [x.strip() for x in (csv or "").split(",") if x.strip()]


def _now_run():
    return datetime.now().isoformat(timespec="seconds")


# ── the footer: where THIS video stands (every report ends with it) ───────────

def print_project_footer(proj: Path, scope: str = "ALL"):
    if not proj.is_dir():
        print(f"\nPROJECT {proj.name}: folder does not exist yet ({proj})")
        return
    p = C.prog(proj)
    gates = p.get("gates") or {}
    manual = p.get("manual_done") or {}
    print(f"\n=== LONGFORM {proj.name} ===")
    have = [k for k, f in C.DOCS.items() if (proj / f).is_file()]
    miss = [f for k, f in C.DOCS.items() if k not in have]
    print(f"  docs   : {len(have)}/{len(C.DOCS)} present" + (f" · missing {', '.join(miss)}" if miss else ""))
    sp = C.spine_paths(proj, scope)
    chain = [k for k in ("lowbps", "a", "b", "c", "paused") if sp[k].is_file()]
    fs = C.final_spine(proj, scope)
    print(f"  spine  : {', '.join(chain) or 'none'}"
          + (f" · final {fs.name}" if fs else "")
          + (" · words json" if C.words_json(proj, scope) else ""))
    print(f"  raw    : {len(C.raw_takes(proj))} master(s)")
    print(f"  gates  : " + (", ".join(f"{g} ✓" for g in C.GATES if g in gates) or "none approved")
          + " · pending " + (", ".join(g for g in C.GATES if g not in gates) or "none"))
    if manual:
        print(f"  by hand: {', '.join(manual)}")
    finals = list(proj.glob("*-FINAL.mp4"))
    if finals:
        print(f"  FINAL  : {finals[0].name}")


def report(final: dict, proj: Path, scope: str) -> int:
    status = final.get("status", "?")
    intr = final.get("__interrupt__")
    steps = final.get("steps") or {}
    for node, st in steps.items():
        print(f"  {node:20s} {st.get('status', '?'):8s} {st.get('detail', '')}")
    if intr:
        v = intr[0].value if hasattr(intr[0], "value") else intr[0]
        v = v if isinstance(v, dict) else {}
        print("GRAPH WAITING")
        if v.get("gate"):
            print(f"  HITL gate: {v['gate']} — review {v.get('what')}")
            for r in v.get("review") or []:
                print(f"    - {r}")
        else:
            print(f"  placeholder: {v.get('placeholder')} is not automated yet — do it by hand:")
            print(f"    {v.get('how')}")
            if v.get("artifact"):
                print(f"    (passes on its own once `{v['artifact']}` exists)")
        print(f"  resume with: {v.get('resume')}")
        print_project_footer(proj, scope)
        return C.GATE_EXIT_CODE
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        print_project_footer(proj, scope)
        return 1
    print_project_footer(proj, scope)
    return 0


def main_longform():
    ap = argparse.ArgumentParser(prog="run.py longform",
                                 description="Drive a longform-edited video through the graph.")
    ap.add_argument("--project", required=False, help="folder name under longform-edited/media/ (or a path)")
    ap.add_argument("--brief", default=None, help="the concept brief (written into PROJECT-LOG on init)")
    ap.add_argument("--brief-file", default=None, help="read the brief from a file (long briefs)")
    ap.add_argument("--constraints", default=None, help="Mike's hard constraints for this video")
    ap.add_argument("--constraints-file", default=None, help="read the constraints from a file")
    ap.add_argument("--title", default=None)
    ap.add_argument("--scope", default="ALL", help="recorded take scope: ALL or CH1-CH3 ... (comp-build 13a)")
    ap.add_argument("--face-max", type=int, default=None, help="max [FACE] beats the screenplay may carry")
    ap.add_argument("--coarse-sil", type=float, default=None, help="spine: COARSE one-zone min-silence (s), default 0.7")
    ap.add_argument("--sil-pre", type=float, default=None, help="spine: FINAL intro min-silence (s), default 0.25")
    ap.add_argument("--sil-post", type=float, default=None, help="spine: FINAL body min-silence (s), default 0.5")
    ap.add_argument("--split", type=float, default=None, help="spine: hook-end second for the two-zone pass")
    ap.add_argument("--bursts", default=None, help="spine: burst spans on the coarse spine, e.g. 262.6-262.8,296.7-296.95")
    ap.add_argument("--card-pause", type=float, default=None, help="build: title-card pause seconds baked per carded chapter (default 1.5)")
    ap.add_argument("--envato-max", type=int, default=None, help="plan: Envato video budget (default 10)")
    ap.add_argument("--chatgpt-max", type=int, default=None, help="plan: ChatGPT image budget (default 5)")
    ap.add_argument("--until", choices=["", *C.GATES], default="", help="stop after this gate is approved")
    ap.add_argument("--approve", default="", help="gates to approve: screenplay,spine_review,spine,plan,blueprint,draft")
    ap.add_argument("--done", default="", help="placeholder nodes done by hand, e.g. defumble,transcribe")
    ap.add_argument("--redo", default="", help="nodes to re-run even if their artifact exists")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    args = ap.parse_args()

    approve, done, redo = _parse_list(args.approve), _parse_list(args.done), _parse_list(args.redo)
    if args.brief_file:
        args.brief = Path(args.brief_file).read_text(encoding="utf-8").strip()
    if args.constraints_file:
        args.constraints = Path(args.constraints_file).read_text(encoding="utf-8").strip()
    for n in done + redo:
        if n not in ORDER:
            print(f"unknown node {n!r}; nodes: {', '.join(ORDER)}", file=sys.stderr)
            sys.exit(1)

    if args.stub:
        project = "stub-project"
        proj = Path(C.DATA) / "stub-project"
        init = {"project": project, "project_dir": str(proj), "scope": "ALL", "stub": args.stub,
                "until": args.until, "approve": approve, "done": done, "redo": redo,
                "steps": {}, "status": "running"}
        thread = args.thread or f"longform-stub-{datetime.now():%Y%m%d-%H%M%S}"
        init["thread"] = thread
        print(f"Longform graph | STUB MODE: {args.stub}")
    else:
        if not args.project:
            print("--project is required.", file=sys.stderr)
            sys.exit(1)
        proj = C.project_dir(args.project)
        project = proj.name
        init = {"project": project, "project_dir": str(proj), "brief": args.brief,
                "constraints": args.constraints, "title": args.title, "scope": args.scope,
                "face_max": args.face_max, "coarse_sil": args.coarse_sil, "sil_pre": args.sil_pre,
                "sil_post": args.sil_post, "split": args.split, "bursts": args.bursts,
                "envato_max": args.envato_max, "chatgpt_max": args.chatgpt_max, "card_pause": args.card_pause,
                "until": args.until, "approve": approve,
                "done": done, "redo": redo, "stub": "", "steps": {}, "status": "running"}
        thread = args.thread or f"longform-{project}"
        init["thread"] = thread
        print(f"Longform graph | {project} | thread {thread}"
              + (f" | --until {args.until}" if args.until else "")
              + (f" | approve {approve}" if approve else "")
              + (f" | done {done}" if done else ""))
        C.set_current_project(project)

    C.DATA.mkdir(parents=True, exist_ok=True)
    from langgraph.checkpoint.sqlite import SqliteSaver
    from langgraph.types import Command
    conn = sqlite3.connect(str(C.CHECKPOINT_DB), check_same_thread=False)
    app = build_longform_graph(checkpointer=SqliteSaver(conn))
    config = {"configurable": {"thread_id": thread}, "recursion_limit": 150}
    started_at, t0 = _now_run(), time.monotonic()
    try:
        if args.resume:
            payload = {"approve": approve, "done": done} if (approve or done) else None
            update = {k: v for k, v in init.items()
                      if k in ("approve", "done", "redo", "until", "face_max", "constraints",
                               "coarse_sil", "sil_pre", "sil_post", "split", "bursts",
                               "envato_max", "chatgpt_max", "card_pause") and v}
            # A plain resume (no decision) must carry NO state update: the checkpoint's own
            # pending writes + an update to the same key = InvalidUpdateError (batch, 2026-09-10).
            final = app.invoke(Command(resume=payload, update=update) if payload else None, config)
        else:
            final = app.invoke(init, config)
    except Exception as e:
        final = {"status": "failed", "error": f"graph crashed: {e!r}"}
    ended_at = _now_run()
    rc = report(final, proj, init["scope"])
    status = "waiting" if rc == C.GATE_EXIT_CODE else final.get("status", "failed")
    C.finish_progress(status, None if rc == 0 else str(final.get("error") or "waiting"))
    C.record_run(thread, {**final, "status": status}, started_at, ended_at,
                 time.monotonic() - t0, stub=args.stub,
                 requested={"project": project, "until": args.until, "approve": approve,
                            "done": done, "resume": args.resume})
    sys.exit(rc)


def main_status():
    ap = argparse.ArgumentParser(prog="run.py status")
    ap.add_argument("--project", required=True)
    ap.add_argument("--scope", default="ALL")
    args = ap.parse_args()
    print_project_footer(C.project_dir(args.project), args.scope)


COMMANDS = {"longform": main_longform, "status": main_status}

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in COMMANDS:
        cmd = sys.argv.pop(1)
        COMMANDS[cmd]()
    else:
        main_longform()
