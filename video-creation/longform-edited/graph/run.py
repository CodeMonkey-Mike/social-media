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
from vertical_graph import build_vertical_graph  # noqa: E402
from short_graph import build_short_graph  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def _parse_list(csv):
    return [x.strip() for x in (csv or "").split(",") if x.strip()]


def _now_run():
    return datetime.now().isoformat(timespec="seconds")


# ── the run queue + supervisor (video-creation/skills/run-queue, Mike 2026-10-27) ──────────────────────────────────
# Every longform / vertical / short invocation takes the machine-wide TURN, releases it at a gate / done / failure, and
# a failure of a render/build node is re-driven ONCE automatically (nodes are redo-safe), then ONE desktop notification.
# Judgment-free deterministic gates (lints, verify_*) are not retried (a re-drive would fail the same way); stage_longform
# is never retried (it appends to the posting queue).
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "skills" / "run-queue"))
import run_queue as RQ  # noqa: E402

RETRY_LONGFORM = {"compress", "transcribe", "as_recorded", "coverage", "music_plan", "assets", "edit_plan", "transitions",
                  "card_pauses", "captions", "comp_build", "mix_audio", "final_render", "definition_of_done"}
RETRY_VERTICAL = {"v_face_crop", "v_assets", "v_comp", "v_render", "v_mix"}
RETRY_SHORT = {"s_paint_16x9", "s_variants", "s_vertical_cards", "s_qa_final", "s_extract", "s_captions", "s_comp", "s_render", "s_mix"}


def _gate_name(final):
    intr = final.get("__interrupt__")
    if not intr:
        return None
    v = intr[0].value if hasattr(intr[0], "value") else intr[0]
    v = v if isinstance(v, dict) else {}
    return v.get("gate") or (f"'{v.get('placeholder')}' (a by-hand step)" if v.get("placeholder") else "next")


def _supervised(label, kind, project, app, config, first_input, init, retry_nodes, stub, skip_queue):
    """One graph invocation under the run queue + supervisor. The re-drive is a FRESH run on the same thread from
    `init` (artifacts on disk skip; approvals live in GRAPH-PROGRESS.json), exactly the documented manual re-drive."""
    def invoke(retry):
        try:
            return app.invoke(init if retry else first_input, config)
        except Exception as e:  # noqa: BLE001
            return {"status": "failed", "error": f"graph crashed: {e!r}", "steps": {}}
    if stub:
        return invoke(False)           # stub runs never queue or notify
    return RQ.supervise(label, kind, project, invoke, retry_nodes, lambda f: bool(f.get("__interrupt__")),
                        skip=skip_queue, describe_gate=_gate_name)


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
    ap.add_argument("--pad-tail", type=float, default=None, help="spine: BOTH desilence passes, silence kept AFTER the sentence before each cut (s), default 0; set at launch, before the coarse pass")
    ap.add_argument("--pad-head", type=float, default=None, help="spine: BOTH desilence passes, silence kept BEFORE the sentence after each cut (s), default = --pad-tail")
    ap.add_argument("--split", type=float, default=None, help="spine: hook-end second for the two-zone pass")
    ap.add_argument("--bursts", default=None, help="spine: burst spans on the coarse spine, e.g. 262.6-262.8,296.7-296.95")
    ap.add_argument("--card-pause", type=float, default=None, help="build: title-card pause seconds baked per carded chapter (default 1.5)")
    ap.add_argument("--keep-face-pauses", choices=["on", "off"], default=None,
                    help="per-video, persisted in GRAPH-PROGRESS.json: on = both desilence passes keep every pause "
                         "between the first and last word of a FACE scene (Mike, lets-get-rich 2026-10-31)")
    ap.add_argument("--face-style", choices=C.FACE_STYLES, default=None,
                    help="per-video FACE transition style, persisted in GRAPH-PROGRESS.json: leak (default: face pick + "
                         "light leak on every punch-in) | glitch (random split swinging offset cut-in, random glitch "
                         "offset/blocks on every punch-in; Mike 2026-10-16) | optics (random ZOOM Optics cut-in, the rest as "
                         "leak; Mike 2026-11-03)")
    ap.add_argument("--caption-scope", default=None,
                    help="per-video caption scope, persisted in GRAPH-PROGRESS.json: a comma list of "
                         f"{'|'.join(C.CAPTION_SCOPES)} added to the default FACE holds over 5 s (all-faces = every "
                         "face hold, envato = every Envato b-roll beat, none = NO captions at all; Mike 2026-11-04), "
                         "or 'default' to clear; Mike 2026-10-19")
    ap.add_argument("--enhance-speech", choices=["on", "off"], default=None,
                    help="per-video, persisted in GRAPH-PROGRESS.json: on = the graph drops spine/<project> FINAL.wav for Mike's "
                         "Adobe Podcast Studio Enhance Speech pass at GATE spine and remuxes the enhanced track back as the next "
                         "spine letter (<scope>.<x>.enhanced.mp4) after the gate (Mike 2026-11-04, quant)")
    ap.add_argument("--face-mode", choices=C.FACE_MODES, default=None,
                    help="per-video FACE picture, persisted in GRAPH-PROGRESS.json: gated (default: the full-screen gated face) | "
                         "screenshare (a FACE beat is Mike's screen share, webcam PiP bottom-right kept verbatim, the deck area "
                         "painted with that beat's face_body content; Mike 2026-11-04, quant)")
    ap.add_argument("--container-accent", default=None,
                    help="per-video ACCENT stylesheet slug loaded after the theme file (skills/container-reference/accents/<slug>.css), "
                         "persisted in GRAPH-PROGRESS.json; 'off' clears it (Mike 2026-11-04, quant = Quant orange on white)")
    ap.add_argument("--container-theme", choices=C.CONTAINER_THEMES, default=None,
                    help="per-video palette for every CSS container / diagram / animated chart, persisted in GRAPH-PROGRESS.json: "
                         "dark (default, container-canonical.css) | light (container-canonical-light.css loaded after it; Mike 2026-10-25)")
    ap.add_argument("--delivery", choices=C.DELIVERIES, default=None,
                    help="per-video delivery, persisted in GRAPH-PROGRESS.json: queue (default: schedule-tweets/longform + longs.json) | "
                         "root (the FINAL stays at the project root, never longs.json: the AI Engineering Simplified channel)")
    ap.add_argument("--caption-windows", default=None, help="build: extra caption windows a-b,a-b in source seconds (the cold-open exception)")
    ap.add_argument("--envato-max", type=int, default=None, help="plan: Envato video budget (default: 3 per minute of final spine, floor 10)")
    ap.add_argument("--chatgpt-max", type=int, default=None, help="plan: ChatGPT image budget (default: 1 per minute of final spine, floor 5; raise it per video)")
    ap.add_argument("--whiteboard-share", default=None,
                    help="plan: share of the delivered runtime the WHITEBOARD beats fill, gated by the coverage node: 0.25 (= 0.22 to 0.28) "
                         "or an explicit range 0.22-0.28; 'off' clears it (saved in GRAPH-PROGRESS.json, any invocation)")
    ap.add_argument("--until", choices=["", *C.GATES], default="", help="stop after this gate is approved")
    ap.add_argument("--approve", default="", help="gates to approve: screenplay,spine_review,spine,plan,blueprint,draft")
    ap.add_argument("--done", default="", help="placeholder nodes done by hand, e.g. defumble,transcribe")
    ap.add_argument("--redo", default="", help="nodes to re-run even if their artifact exists")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--skip-queue", action="store_true", help="start NOW, overlapping the run queue (Mike's explicit ask only)")
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
                "sil_post": args.sil_post, "pad_tail": args.pad_tail, "pad_head": args.pad_head,
                "split": args.split, "bursts": args.bursts,
                "envato_max": args.envato_max, "chatgpt_max": args.chatgpt_max, "card_pause": args.card_pause, "caption_windows": args.caption_windows,
                "until": args.until, "approve": approve,
                "done": done, "redo": redo, "stub": "", "steps": {}, "status": "running"}
        # Per-video budgets + the sentence residual PERSIST in GRAPH-PROGRESS.json (2026-11-02, left-behind: a fresh
        # thread for a repair dropped Mike's --envato-max 10 --chatgpt-max 4 and the coverage plan came back at the
        # runtime defaults, 14 Envato + 7 ChatGPT). A flag given now is saved; a flag omitted falls back to the saved one.
        for key in ("face_max", "envato_max", "chatgpt_max", "pad_tail", "pad_head"):
            if init.get(key) is not None:
                C.set_setting(proj, key, init[key])
            elif C.setting(proj, key) is not None:
                init[key] = C.setting(proj, key)
                print(f"{key} for {project}: {init[key]} (from GRAPH-PROGRESS.json)")
        thread = args.thread or f"longform-{project}"
        init["thread"] = thread
        print(f"Longform graph | {project} | thread {thread}"
              + (f" | --until {args.until}" if args.until else "")
              + (f" | approve {approve}" if approve else "")
              + (f" | done {done}" if done else ""))
        C.set_current_project(project)
        if args.keep_face_pauses:
            C.set_setting(proj, "keep_face_pauses", args.keep_face_pauses == "on")
            print(f"keep face pauses for {project}: {args.keep_face_pauses} (saved in GRAPH-PROGRESS.json)")
        if args.enhance_speech:
            C.set_setting(proj, "enhance_speech", args.enhance_speech == "on")
            print(f"enhance speech for {project}: {args.enhance_speech} (saved in GRAPH-PROGRESS.json)")
        if args.face_style:
            C.set_setting(proj, "face_style", args.face_style)
            print(f"face style for {project}: {args.face_style} (saved in GRAPH-PROGRESS.json)")
        if args.container_theme:
            C.set_setting(proj, "container_theme", args.container_theme)
            print(f"container theme for {project}: {args.container_theme} (saved in GRAPH-PROGRESS.json)")
        if args.whiteboard_share:
            try:
                rng = C.parse_whiteboard_share(args.whiteboard_share)
            except ValueError as e:
                print(f"bad --whiteboard-share: {e}", file=sys.stderr)
                sys.exit(1)
            C.set_setting(proj, "whiteboard_share", args.whiteboard_share.strip() if rng else None)
            print(f"whiteboard share for {project}: "
                  + (f"{rng[0]:.0%} to {rng[1]:.0%} of the runtime" if rng else "no target")
                  + " (saved in GRAPH-PROGRESS.json; the coverage node holds COVER-PLAN.json to it)")
        if args.delivery:
            C.set_setting(proj, "delivery", args.delivery)
            print(f"delivery for {project}: {args.delivery} (saved in GRAPH-PROGRESS.json)")
        if args.face_mode:
            C.set_setting(proj, "face_mode", args.face_mode)
            print(f"face mode for {project}: {args.face_mode} (saved in GRAPH-PROGRESS.json)")
        if args.container_accent:
            slug = args.container_accent.strip()
            if slug == "off":
                C.set_setting(proj, "container_accent", None)
                print(f"container accent for {project}: none (saved in GRAPH-PROGRESS.json)")
            elif not (C.ACCENTS_DIR / f"{slug}.css").is_file():
                print(f"unknown --container-accent {slug!r}: no file {C.ACCENTS_DIR / (slug + '.css')}", file=sys.stderr)
                sys.exit(1)
            else:
                C.set_setting(proj, "container_accent", slug)
                print(f"container accent for {project}: {slug} ({C.ACCENTS_DIR / (slug + '.css')}, saved in GRAPH-PROGRESS.json)")
        if args.caption_scope:
            scope_items = [] if args.caption_scope.strip() == "default" else _parse_list(args.caption_scope)
            bad = [x for x in scope_items if x not in C.CAPTION_SCOPES]
            if bad:
                print(f"unknown --caption-scope {bad}; choose from {', '.join(C.CAPTION_SCOPES)} or 'default'", file=sys.stderr)
                sys.exit(1)
            C.set_setting(proj, "caption_scope", scope_items)
            print(f"caption scope for {project}: " + ("NONE (no captions at all)" if "none" in scope_items else
                  "FACE holds > 5 s" + "".join(f" + {x}" for x in scope_items)) + " (saved in GRAPH-PROGRESS.json)")

    C.DATA.mkdir(parents=True, exist_ok=True)
    from langgraph.checkpoint.sqlite import SqliteSaver
    from langgraph.types import Command
    conn = sqlite3.connect(str(C.CHECKPOINT_DB), check_same_thread=False)
    app = build_longform_graph(checkpointer=SqliteSaver(conn))
    config = {"configurable": {"thread_id": thread}, "recursion_limit": 150}
    started_at, t0 = _now_run(), time.monotonic()
    if args.resume:
        payload = {"approve": approve, "done": done} if (approve or done) else None
        update = {k: v for k, v in init.items()
                  if k in ("approve", "done", "redo", "until", "face_max", "constraints",
                           "coarse_sil", "sil_pre", "sil_post", "pad_tail", "pad_head", "split", "bursts",
                           "envato_max", "chatgpt_max", "card_pause", "caption_windows")
                  and (v is not None if k in ("pad_tail", "pad_head") else v)}   # --pad-head 0 is a real value
        # A plain resume (no decision) must carry NO state update: the checkpoint's own
        # pending writes + an update to the same key = InvalidUpdateError (batch, 2026-09-10).
        first = Command(resume=payload, update=update) if payload else None
    else:
        first = init
    final = _supervised(f"longform {project}", "longform", project, app, config, first, init, RETRY_LONGFORM,
                        args.stub, args.skip_queue)
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


def main_vertical():
    """The OPTIONAL 9:16 lane (vertical_graph.py): runs after the 16:9 FINAL is delivered."""
    ap = argparse.ArgumentParser(prog="run.py vertical", description="Build the vertical (1080x1920) cut of a delivered longform-edited video.")
    ap.add_argument("--project", required=True)
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--approve", default="", help="gate approvals, e.g. vertical")
    ap.add_argument("--redo", default="", help="nodes to re-run even if their artifact exists")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--skip-queue", action="store_true", help="start NOW, overlapping the run queue (Mike's explicit ask only)")
    args = ap.parse_args()
    approve, redo = _parse_list(args.approve), _parse_list(args.redo)
    if args.stub:
        proj = Path(C.DATA) / "stub-project"
        project = "stub-project"
    else:
        p = Path(args.project)
        proj = p.resolve() if p.is_dir() else (C.MEDIA / args.project).resolve()
        project = proj.name
    thread = args.thread or (f"vertical-stub-{datetime.now():%Y%m%d-%H%M%S}" if args.stub else f"vertical-{project}")
    C.set_current_project(project)   # keys the per-project heartbeat (lane_progress/<project>.json)
    init = {"project": project, "project_dir": str(proj), "scope": args.scope, "thread": thread, "lane": "vertical",
            "stub": args.stub, "approve": approve, "done": [], "redo": redo, "steps": {}, "status": "running"}
    print(f"Vertical graph | {project} | thread {thread}" + (" | STUB " + args.stub if args.stub else "")
          + (f" | approve {approve}" if approve else "") + (f" | redo {redo}" if redo else ""))
    from langgraph.checkpoint.sqlite import SqliteSaver
    from langgraph.types import Command
    conn = sqlite3.connect(str(C.CHECKPOINT_DB), check_same_thread=False)
    app = build_vertical_graph(checkpointer=SqliteSaver(conn))
    config = {"configurable": {"thread_id": thread}, "recursion_limit": 60}
    started_at, t0 = _now_run(), time.monotonic()
    if args.resume:
        payload = {"approve": approve} if approve else None
        update = {k: v for k, v in init.items() if k in ("approve", "redo") and v}
        first = Command(resume=payload, update=update) if payload else None
    else:
        first = init
    final = _supervised(f"vertical {project}", "vertical", project, app, config, first, init, RETRY_VERTICAL,
                        args.stub, args.skip_queue)
    rc = report(final, proj, args.scope)
    status = "waiting" if rc == C.GATE_EXIT_CODE else final.get("status", "failed")
    C.finish_progress(status, None if rc == 0 else str(final.get("error") or "waiting"))   # the heartbeat ends with the run (was missing: the dashboard kept showing the gate as live)
    C.record_run(thread, {**final, "status": status}, started_at, _now_run(), time.monotonic() - t0, stub=args.stub,
                 requested={"lane": "vertical", "project": project, "approve": approve, "redo": redo, "resume": args.resume})
    vert = proj / f"{project}-VERTICAL.mp4"
    if vert.is_file():
        print(f"  VERTICAL: {vert}")
    sys.exit(rc)


def main_short():
    """The OPTIONAL short lane (short_graph.py): a ~30 s condensation of the delivered vertical."""
    ap = argparse.ArgumentParser(prog="run.py short", description="Cut the best moments of a delivered vertical into a short with the CTA outro.")
    ap.add_argument("--project", required=True)
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--seconds", type=float, default=30.0, help="delivered length incl. the 3 s outro (default 30)")
    ap.add_argument("--brief", default=None, help="per-run overrides for the cut strategist")
    ap.add_argument("--approve", default="", help="gate approvals: short (short_plan is automatic since 2026-10-29)")
    ap.add_argument("--redo", default="")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--skip-queue", action="store_true", help="start NOW, overlapping the run queue (Mike's explicit ask only)")
    args = ap.parse_args()
    approve, redo = _parse_list(args.approve), _parse_list(args.redo)
    if args.stub:
        proj, project = Path(C.DATA) / "stub-project", "stub-project"
    else:
        p = Path(args.project)
        proj = p.resolve() if p.is_dir() else (C.MEDIA / args.project).resolve()
        project = proj.name
    thread = args.thread or (f"short-stub-{datetime.now():%Y%m%d-%H%M%S}" if args.stub else f"short-{project}")
    C.set_current_project(project)   # keys the per-project heartbeat (lane_progress/<project>.json)
    init = {"project": project, "project_dir": str(proj), "scope": args.scope, "thread": thread, "lane": "short", "seconds": args.seconds,
            "brief": args.brief, "stub": args.stub, "approve": approve, "done": [], "redo": redo, "steps": {}, "status": "running"}
    print(f"Short graph | {project} | {args.seconds:.0f}s | thread {thread}" + (" | STUB " + args.stub if args.stub else "")
          + (f" | approve {approve}" if approve else "") + (f" | redo {redo}" if redo else ""))
    from langgraph.checkpoint.sqlite import SqliteSaver
    from langgraph.types import Command
    conn = sqlite3.connect(str(C.CHECKPOINT_DB), check_same_thread=False)
    app = build_short_graph(checkpointer=SqliteSaver(conn))
    config = {"configurable": {"thread_id": thread}, "recursion_limit": 60}
    started_at, t0 = _now_run(), time.monotonic()
    if args.resume:
        payload = {"approve": approve} if approve else None
        update = {k: v for k, v in init.items() if k in ("approve", "redo", "brief") and v}
        if any(x == "--seconds" or x.startswith("--seconds=") for x in sys.argv):
            update["seconds"] = args.seconds   # a plan approved at a new length (e.g. a silent beat added at the gate)
        first = Command(resume=payload, update=update) if payload else None
    else:
        first = init
    final = _supervised(f"short {project}", "short", project, app, config, first, init, RETRY_SHORT,
                        args.stub, args.skip_queue)
    rc = report(final, proj, args.scope)
    status = "waiting" if rc == C.GATE_EXIT_CODE else final.get("status", "failed")
    C.finish_progress(status, None if rc == 0 else str(final.get("error") or "waiting"))
    C.record_run(thread, {**final, "status": status}, started_at, _now_run(), time.monotonic() - t0, stub=args.stub,
                 requested={"lane": "short", "project": project, "seconds": args.seconds, "approve": approve, "redo": redo, "resume": args.resume})
    shorts = sorted(proj.glob(f"{project}-SHORT-*s.mp4"))
    if shorts:
        print(f"  SHORT: {shorts[-1]}")
    sys.exit(rc)


COMMANDS = {"longform": main_longform, "vertical": main_vertical, "short": main_short, "status": main_status}

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in COMMANDS:
        cmd = sys.argv[1]
        if cmd != "status" and "--stub" not in sys.argv:   # every real run is DETACHED + guarded (run-queue.md)
            proj = sys.argv[sys.argv.index("--project") + 1] if "--project" in sys.argv else "?"
            RQ.detach(f"{cmd} {Path(proj).name}")
        sys.argv.pop(1)
        COMMANDS[cmd]()
    else:
        main_longform()
