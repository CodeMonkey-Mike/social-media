# run.py — CLI runner for the livestream-repurpose graphs.
#
#   INTAKE (Wave 1, the default when no segment word is given):
#   python video-creation/livestream-repurpose/graph/run.py \
#       --source "video-creation/livestream-repurpose/media/<folder>/<recording>.mkv" \
#       --min-sil 0.5
#
#   CUT (Wave 2 — Lane 2 Phase 4 exec, AFTER the clip-strategist's clip-plan.json
#   lands in shorts/<batch>/; ends at Mike's Phase 4b dashboard review):
#   python video-creation/livestream-repurpose/graph/run.py cut --batch <batch>
#       [--plan PATH] [--master PATH] [--thread ID] [--resume]
#       [--stub ok|fail] [--test-sandbox DIR] [--no-register] [--force]
#
#   TIGHTEN (Wave 3 — Lane 2 Phase 5 exec + 5B desilence, AFTER Mike's 4b
#   verdicts are applied to clip-plan.json AND the tighten-strategists'
#   tighten-plan.json lands; ends at Mike's 2nd review of the tightened clips.
#   --min-sil here is the 5B knob = Mike's per-batch call, e.g. 0.25 / 0.45):
#   python video-creation/livestream-repurpose/graph/run.py tighten --batch <batch>
#       --min-sil 0.25 [--plan PATH] [--clip-plan PATH] [--master PATH]
#       [--transcript PATH] [--title TEXT] [--subtitle TEXT] [--thread ID]
#       [--resume] [--stub ok|fail] [--test-sandbox DIR] [--force]
#
# Wave 1 of the livestream migration (ORCHESTRATOR-PLAN.md §"Livestream migration"):
# ONE invocation runs Phase 1 (LOW BPS) + Lane 1 (longform desilence/stage/queue) +
# Phase 1B (verticalize) + Phase 2 (transcribe + glossary + derivatives), then ENDS.
# Phase 3+ (clip-strategist, Lane 3, Mike's gates) continues in the Claude session
# off the same on-disk artifacts, exactly as before — the graph's END is a frontier.
#
# The human decisions travel IN the invocation (no interrupts, same contract as the
# LinkedIn lanes):
#   --min-sil N       the desilencer's one knob for the Lane 1 longform cut.
#                     REQUIRED (the desilencer doctrine: the caller specifies the
#                     silence definition every time; nothing here defaults it).
#                     0.5 matched the pacing of the accepted longforms.
#   longform-meta.json  {title, description, tags[], batch?, source?} — the
#                     judgment fields for the longs.json entry, authored BEFORE the
#                     run (default location: next to the recording; --meta to point
#                     elsewhere). Validated up front so a bad meta file fails in
#                     seconds, not after a 20-minute encode.
#
# Flags:
#   --source PATH        the raw recording inside its named media folder (required
#                        for real runs; the folder name becomes the artifact name)
#   --min-sil N          Lane 1 min-silence seconds (required unless --skip-longform)
#   --meta PATH          longform-meta.json (default: <media folder>/longform-meta.json)
#   --skip-longform      run everything except Lane 1 (a per-run Mike override)
#   --cpu-verticalize    use the documented CPU-filter fallback for Step 1B
#   --thread ID          checkpoint thread id (default intake-<slug>-<YYYYMMDD>)
#   --resume             continue THIS thread from its last checkpoint (use after a
#                        crash/kill: completed nodes skip, the interrupted node
#                        re-runs whole; every node is redo-safe)
#   --stub ok|fail       structural test: no ffmpeg, no whisper, no writes
#   --test-sandbox DIR   redirect the production write targets (longform staged
#                        root, longs.json, transcripts dir) into DIR — a full real
#                        run against scratch. Loudly bannered; never use for a
#                        real stream.
#
# Exit codes: 0 = done · 1 = failed. No restriction concept in this pipeline; the
# halt route is for failures only. One attempt per run — on failure READ THE
# OUTPUT, diagnose, then re-run (with --resume if the failure was environmental).

import argparse
import json
import os
import re
import shutil
import sqlite3
import sys
import time
from datetime import date, datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from intake_graph import (  # noqa: E402
    CHECKPOINT_DB, DATA, LONGS_FILE, STAGED_ROOT, TRANSCRIPTS,
    _ffprobe_geometry, build_intake_graph, finish_progress, record_run,
)
from shorts_graph import build_cut_graph, build_tighten_graph  # noqa: E402

from langgraph.checkpoint.sqlite import SqliteSaver  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]
LSR_SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"

VIDEO_EXTS = {".mp4", ".mkv", ".mov"}
MIN_FREE_GB = 5   # LOW BPS + vertical + staged longform for a 1-2h stream, with margin


def slugify(stem: str) -> str:
    s = re.sub(r"[^a-z0-9-]", "", stem.lower().replace(" ", "-"))
    return re.sub(r"-{2,}", "-", s).strip("-")


def validate_meta(path: str):
    """Fail fast on the judgment file — BEFORE any encoding starts."""
    if not os.path.isfile(path):
        print(f"longform-meta.json not found: {path}\n"
              "Author it first (title / description / tags for the longs.json entry), "
              "or pass --skip-longform.", file=sys.stderr)
        sys.exit(1)
    try:
        with open(path, encoding="utf-8") as f:
            meta = json.load(f)
    except Exception as e:
        print(f"longform-meta.json is not valid JSON: {e}", file=sys.stderr)
        sys.exit(1)
    missing = [k for k in ("title", "description", "tags") if not meta.get(k)]
    if missing:
        print(f"longform-meta.json missing field(s): {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)
    if "—" in json.dumps(meta, ensure_ascii=False):
        print("EM DASH in longform-meta.json — persona hard rule; fix it before running.",
              file=sys.stderr)
        sys.exit(1)


def report_intake(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 1
    s = final["intake"]
    if s.get("sandbox"):
        print("  ** TEST SANDBOX RUN — nothing was written to production paths **")
    print(f"  master: {s['master_duration_s']:.1f}s at {s.get('master_mbps') or '?'} Mbps"
          if s.get("master_duration_s") else "  master: (stub)")
    lf = s.get("longform")
    if lf == "skipped":
        print("  longform: skipped (--skip-longform)")
    elif isinstance(lf, dict):
        already = " (already queued — resume no-op)" if lf.get("already_present") else ""
        thumb = "thumb staged" if lf.get("thumb_staged") else "NO THUMB (null in queue)"
        print(f"  longform: {lf.get('duration_s') or '?'}s staged "
              f"(-{lf.get('removed_s') or '?'}s silence) at {lf.get('mbps') or '?'} Mbps · "
              f"{thumb}")
        print(f"  queued:   {lf.get('queued_id')}{already} · longs total {lf.get('queue_total')}")
    v = s.get("vertical") or {}
    print(f"  vertical: {v.get('geometry') or '?'} · {v.get('duration_s') or '?'}s")
    print(f"  transcript: {s.get('words') or 0} words / {s.get('segments') or 0} segments")
    print(f"  glossary: {s.get('glossary') or 'none'}")
    flags = s.get("flags") or []
    if flags:
        print("  ** GLOSSARY FLAGS — adjudicate before Phase 3 (real KRC20 token vs "
              "Kaspa mishear):")
        for fl in flags:
            print(f"     - {fl}")
    else:
        print("  glossary flags: none")
    print("  next: Phase 3+ as usual — clip-strategist off the _chunks_90s file, "
          "Lane 3 off the _plain transcript.")
    return 0


def report_cut(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 1
    s = final["cut"]
    if s.get("sandbox"):
        print("  ** TEST SANDBOX RUN — nothing was written to production paths **")
    if s.get("stub"):
        print(f"  batch: {s.get('batch')} (stub) · {s.get('clips')} clips")
        return 0
    print(f"  batch: {s['batch']} · {s['clips']} clips · "
          f"{s.get('total_s') or '?'}s total")
    for slug, d in (s.get("clip_durations") or {}).items():
        print(f"    - {slug}: {d:.1f}s")
    print(f"  dashboard:  {s.get('dashboard')}")
    print(f"  registered: {'yes (active)' if s.get('registered') else 'SKIPPED (--no-register)'}"
          " · progress.json at the 4b gate")
    print("  next: Mike's Phase 4b review on the dashboard (delete calls by clip number); "
          "then tighten-strategist per survivor (manual path until Wave 3).")
    return 0


def main_cut():
    sys.path.insert(0, str(LSR_SCRIPTS))
    from cut_topics import validate_plan  # noqa: E402  (one source of truth)

    ap = argparse.ArgumentParser(prog="run.py cut",
                                 description="Run the Lane 2 CUT segment (Phase 4 exec) "
                                             "through LangGraph.")
    ap.add_argument("--batch")
    ap.add_argument("--plan", default=None)
    ap.add_argument("--master", default=None)
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--registry-root", default=None)
    ap.add_argument("--date", default=str(date.today()))
    ap.add_argument("--note", default=None)
    ap.add_argument("--no-register", action="store_true")
    ap.add_argument("--force", action="store_true",
                    help="let finalize overwrite a progress.json already past the cut phase")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--test-sandbox", default="")
    args = ap.parse_args()

    if args.stub:
        init = {
            "batch": "stub-batch", "plan_path": "stub-plan.json", "master": "stub.mp4",
            "out_base": "stub-out", "registry_root": "stub-root",
            "run_date": args.date, "note": None, "no_register": False, "force": False,
            "test_sandbox": "", "stub": args.stub,
            "expected": [{"n": 1, "slug": "stub-clip", "sum_s": 42.0},
                         {"n": 2, "slug": "stub-clip-b", "sum_s": 21.0}],
            "master_geometry": "1080x1920", "status": "running",
        }
        thread = args.thread or f"cut-stub-{datetime.now():%Y%m%d-%H%M%S}"
        banner = f"Cut graph | STUB MODE: {args.stub}"
    else:
        if not args.batch:
            print("--batch is required for a real run.", file=sys.stderr)
            sys.exit(1)
        if args.test_sandbox:
            sandbox = os.path.abspath(args.test_sandbox)
            out_base = os.path.join(sandbox, "shorts", args.batch)
            registry_root = sandbox
            os.makedirs(out_base, exist_ok=True)
            reg_file = os.path.join(registry_root, "batches.json")
            if not os.path.isfile(reg_file):
                with open(reg_file, "w", encoding="utf-8") as f:
                    json.dump({"$note": "TEST SANDBOX batches.json — not production",
                               "batches": []}, f, indent=2)
        else:
            out_base = args.out_base or str(
                REPO_ROOT / "video-creation" / "shorts" / args.batch)
            registry_root = args.registry_root or str(REPO_ROOT)

        plan_path = os.path.abspath(args.plan) if args.plan else os.path.join(
            out_base, "clip-plan.json")
        if not os.path.isfile(plan_path):
            print(f"clip-plan.json not found: {plan_path}\n"
                  "The clip-strategist's plan must land on disk BEFORE the cut segment "
                  "runs (the judgment seam).", file=sys.stderr)
            sys.exit(1)
        try:
            with open(plan_path, encoding="utf-8") as f:
                plan = json.load(f)
        except Exception as e:
            print(f"clip-plan.json is not valid JSON: {e}", file=sys.stderr)
            sys.exit(1)

        if args.master:
            master = os.path.abspath(args.master)
        else:
            sv = plan.get("source_vertical")
            if not sv:
                print("clip-plan.json has no source_vertical and no --master given.",
                      file=sys.stderr)
                sys.exit(1)
            master = sv if os.path.isabs(sv) else str(REPO_ROOT / sv)
        if not os.path.isfile(master):
            print(f"vertical master not found: {master}", file=sys.stderr)
            sys.exit(1)

        validate_plan(plan, master)          # fail fast, same checks the cutter runs
        geo = _ffprobe_geometry(master)
        if geo is None:
            print(f"cannot probe the master: {master}", file=sys.stderr)
            sys.exit(1)
        master_geometry = f"{geo[0]}x{geo[1]}"
        if not args.test_sandbox and master_geometry != "1080x1920":
            print(f"WARNING: master geometry {master_geometry} != 1080x1920 — a real "
                  "batch master should be the verified VERTICAL.", file=sys.stderr)

        expected = [{"n": c["clip_id"], "slug": c["slug"],
                     "sum_s": round(sum(float(s["end"]) - float(s["start"])
                                        for s in c["segments"]), 3)}
                    for c in plan["clips"]]
        init = {
            "batch": args.batch, "plan_path": plan_path, "master": master,
            "out_base": out_base, "registry_root": registry_root,
            "run_date": args.date, "note": args.note,
            "no_register": args.no_register, "force": args.force,
            "test_sandbox": args.test_sandbox, "stub": "",
            "expected": expected, "master_geometry": master_geometry,
            "status": "running",
        }
        thread = args.thread or f"cut-{args.batch}-{date.today():%Y%m%d}"
        banner = (f"Cut graph | {args.batch} | {len(expected)} clips | master {master_geometry}"
                  + (f" | TEST SANDBOX {args.test_sandbox}" if args.test_sandbox else ""))

    DATA.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build_cut_graph(checkpointer=SqliteSaver(conn))

    print(banner)
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (" | RESUME" if args.resume else ""))
    print("-" * 60)

    started_at, t0 = datetime.now().isoformat(timespec="seconds"), time.monotonic()
    try:
        final = app.invoke(None if args.resume else init,
                           config={"configurable": {"thread_id": thread}})
    except BaseException as e:
        finish_progress("crashed", f"{type(e).__name__}: {e}")
        if args.resume:
            print("\n(--resume needs a thread that already has a checkpoint; run without "
                  "--resume for a fresh batch.)", file=sys.stderr)
        raise
    print("-" * 60)

    record_run(lane=2, thread=thread, final=final, started_at=started_at,
               ended_at=datetime.now().isoformat(timespec="seconds"),
               duration_s=time.monotonic() - t0, stub=args.stub,
               requested=init.get("batch") if not args.stub else "stub")
    finish_progress(final.get("status", "unknown"), final.get("error"))

    sys.exit(report_cut(final))


def report_tighten(final) -> int:
    status = final.get("status", "?")
    print(f"GRAPH {status.upper()}")
    if status != "done":
        print(f"  {final.get('error', 'no error detail')}")
        return 1
    s = final["tighten"]
    if s.get("sandbox"):
        print("  ** TEST SANDBOX RUN — nothing was written to production paths **")
    if s.get("stub"):
        print(f"  batch: {s.get('batch')} (stub) · {s.get('clips')} clips")
        return 0
    print(f"  batch: {s['batch']} · {s['clips']} clips tightened+desilenced "
          f"(min-sil {s.get('min_sil')}s) · {s.get('total_s') or '?'}s total")
    for slug, d in (s.get("clip_durations") or {}).items():
        print(f"    - {slug}: {d:.1f}s")
    print(f"  dashboard: {s.get('dashboard')} · progress at the 2nd-review gate")
    print("  next: Mike's 2nd review of the tightened clips on the dashboard; then "
          "5C (optional) -> captions (6) -> remotion-builder (7) -> publish (8).")
    return 0


def main_tighten():
    sys.path.insert(0, str(LSR_SCRIPTS))
    from tighten_clips import (  # noqa: E402  (one source of truth)
        dur as clip_dur, load_words, validate_tighten_plan,
    )

    ap = argparse.ArgumentParser(prog="run.py tighten",
                                 description="Run the Lane 2 TIGHTEN segment (Phase 5 exec "
                                             "+ 5B desilence) through LangGraph.")
    ap.add_argument("--batch")
    ap.add_argument("--min-sil", type=float, default=None,
                    help="5B min-silence seconds — Mike's per-batch knob, REQUIRED for a "
                         "real run (recent batches: 0.25 and 0.45)")
    ap.add_argument("--plan", default=None, help="tighten-plan.json")
    ap.add_argument("--clip-plan", default=None)
    ap.add_argument("--master", default=None)
    ap.add_argument("--transcript", default=None)
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--title", default=None)
    ap.add_argument("--subtitle", default=None)
    ap.add_argument("--force", action="store_true",
                    help="let finalize reset progress entries already past 5B")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--test-sandbox", default="")
    args = ap.parse_args()

    if args.stub:
        init = {
            "batch": "stub-batch", "plan_path": "stub-tighten-plan.json",
            "clip_plan_path": "stub-clip-plan.json", "master": "stub.mp4",
            "transcript": "stub-words.json", "out_base": "stub-out",
            "min_sil": 0.25, "title": None, "subtitle": None, "force": False,
            "test_sandbox": "", "stub": args.stub,
            "expected": [{"n": 1, "slug": "stub-clip", "tight_s": 42.0,
                          "kept_voiced_s": 30.0},
                         {"n": 2, "slug": "stub-clip-b", "tight_s": 21.0,
                          "kept_voiced_s": 15.0}],
            "master_geometry": "1080x1920", "status": "running",
        }
        thread = args.thread or f"tighten-stub-{datetime.now():%Y%m%d-%H%M%S}"
        banner = f"Tighten graph | STUB MODE: {args.stub}"
    else:
        if not args.batch:
            print("--batch is required for a real run.", file=sys.stderr)
            sys.exit(1)
        if args.min_sil is None:
            print("--min-sil is required (the 5B knob is Mike's per-batch call every "
                  "run; recent batches used 0.25 and 0.45).", file=sys.stderr)
            sys.exit(1)
        if not (0.15 <= args.min_sil <= 2.0):
            print(f"--min-sil {args.min_sil}s is outside the sane 0.15-2.0s range.",
                  file=sys.stderr)
            sys.exit(1)
        if args.test_sandbox:
            sandbox = os.path.abspath(args.test_sandbox)
            out_base = os.path.join(sandbox, "shorts", args.batch)
            os.makedirs(out_base, exist_ok=True)
        else:
            out_base = args.out_base or str(
                REPO_ROOT / "video-creation" / "shorts" / args.batch)

        plan_path = os.path.abspath(args.plan) if args.plan else os.path.join(
            out_base, "tighten-plan.json")
        cplan_path = os.path.abspath(args.clip_plan) if args.clip_plan else os.path.join(
            out_base, "clip-plan.json")
        if not os.path.isfile(plan_path):
            print(f"tighten-plan.json not found: {plan_path}\n"
                  "The tighten-strategists' plan must land on disk BEFORE the tighten "
                  "segment runs (the judgment seam).", file=sys.stderr)
            sys.exit(1)
        if not os.path.isfile(cplan_path):
            print(f"clip-plan.json not found: {cplan_path}", file=sys.stderr)
            sys.exit(1)
        try:
            with open(plan_path, encoding="utf-8") as f:
                tighten_plan = json.load(f)
            with open(cplan_path, encoding="utf-8") as f:
                clip_plan = json.load(f)
        except Exception as e:
            print(f"plan file is not valid JSON: {e}", file=sys.stderr)
            sys.exit(1)

        if args.master:
            master = os.path.abspath(args.master)
        else:
            sv = clip_plan.get("source_vertical")
            if not sv:
                print("clip-plan.json has no source_vertical and no --master given.",
                      file=sys.stderr)
                sys.exit(1)
            master = sv if os.path.isabs(sv) else str(REPO_ROOT / sv)
        if not os.path.isfile(master):
            print(f"vertical master not found: {master}", file=sys.stderr)
            sys.exit(1)

        stem = Path(master).stem
        transcript = os.path.abspath(args.transcript) if args.transcript else str(
            REPO_ROOT / "video-creation" / "livestream-repurpose" / "transcripts"
            / stem / f"{stem}.json")
        if not os.path.isfile(transcript):
            print(f"whisper transcript not found: {transcript}", file=sys.stderr)
            sys.exit(1)

        # fail fast, same checks + measures the tightener runs (one source of truth)
        words = load_words(transcript)
        if not words:
            print(f"transcript has no word timestamps: {transcript}", file=sys.stderr)
            sys.exit(1)
        measures = validate_tighten_plan(tighten_plan, clip_plan, clip_dur(master), words)
        geo = _ffprobe_geometry(master)
        if geo is None:
            print(f"cannot probe the master: {master}", file=sys.stderr)
            sys.exit(1)
        master_geometry = f"{geo[0]}x{geo[1]}"
        if not args.test_sandbox and master_geometry != "1080x1920":
            print(f"WARNING: master geometry {master_geometry} != 1080x1920 — a real "
                  "batch master should be the verified VERTICAL.", file=sys.stderr)

        expected = [{"n": t["n"], "slug": t["id"],
                     "tight_s": round(measures[t["id"]]["tight_s"], 3),
                     "kept_voiced_s": round(measures[t["id"]]["kept_voiced_s"], 3)}
                    for t in tighten_plan["clips"]]
        init = {
            "batch": args.batch, "plan_path": plan_path, "clip_plan_path": cplan_path,
            "master": master, "transcript": transcript, "out_base": out_base,
            "min_sil": args.min_sil, "title": args.title, "subtitle": args.subtitle,
            "force": args.force, "test_sandbox": args.test_sandbox, "stub": "",
            "expected": expected, "master_geometry": master_geometry,
            "status": "running",
        }
        thread = args.thread or f"tighten-{args.batch}-{date.today():%Y%m%d}"
        banner = (f"Tighten graph | {args.batch} | {len(expected)} clips | "
                  f"min-sil {args.min_sil}s | master {master_geometry}"
                  + (f" | TEST SANDBOX {args.test_sandbox}" if args.test_sandbox else ""))

    DATA.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build_tighten_graph(checkpointer=SqliteSaver(conn))

    print(banner)
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (" | RESUME" if args.resume else ""))
    print("-" * 60)

    started_at, t0 = datetime.now().isoformat(timespec="seconds"), time.monotonic()
    try:
        final = app.invoke(None if args.resume else init,
                           config={"configurable": {"thread_id": thread}})
    except BaseException as e:
        finish_progress("crashed", f"{type(e).__name__}: {e}")
        if args.resume:
            print("\n(--resume needs a thread that already has a checkpoint; run without "
                  "--resume for a fresh batch.)", file=sys.stderr)
        raise
    print("-" * 60)

    record_run(lane=3, thread=thread, final=final, started_at=started_at,
               ended_at=datetime.now().isoformat(timespec="seconds"),
               duration_s=time.monotonic() - t0, stub=args.stub,
               requested=init.get("batch") if not args.stub else "stub")
    finish_progress(final.get("status", "unknown"), final.get("error"))

    sys.exit(report_tighten(final))


def main():
    ap = argparse.ArgumentParser(description="Run livestream intake (Phases 1-2 + Lane 1) "
                                             "through LangGraph.")
    ap.add_argument("--source")
    ap.add_argument("--min-sil", type=float, default=None)
    ap.add_argument("--meta", default=None)
    ap.add_argument("--skip-longform", action="store_true")
    ap.add_argument("--cpu-verticalize", action="store_true")
    ap.add_argument("--thread", default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stub", choices=["ok", "fail"], default="")
    ap.add_argument("--test-sandbox", default="")
    args = ap.parse_args()

    if args.stub:
        stem, slug = "stub-stream", "stub-stream"
        init = {
            "source": "stub.mkv", "media_dir": "stub", "stem": stem, "slug": slug,
            "meta_path": "stub-meta.json", "min_sil": 0.5,
            "skip_longform": args.skip_longform, "cpu_verticalize": False,
            "test_sandbox": "", "stub": args.stub,
            "master": "stub LOW BPS.mp4", "vertical": "stub LOW BPS VERTICAL.mp4",
            "tdir": "stub-transcripts", "tjson": "stub.json",
            "staged_root": "stub-staged", "longs_file": "stub-longs.json",
            "status": "running",
        }
        thread = args.thread or f"intake-stub-{datetime.now():%Y%m%d-%H%M%S}"
        banner = f"Intake graph | STUB MODE: {args.stub}"
    else:
        if not args.source:
            print("--source is required for a real run.", file=sys.stderr)
            sys.exit(1)
        source = os.path.abspath(args.source)
        if not os.path.isfile(source):
            print(f"no such file: {source}", file=sys.stderr)
            sys.exit(1)
        if os.path.splitext(source)[1].lower() not in VIDEO_EXTS:
            print(f"source must be one of {sorted(VIDEO_EXTS)}", file=sys.stderr)
            sys.exit(1)
        if os.path.splitext(os.path.basename(source))[0].endswith(" LOW BPS"):
            print("source is already a LOW BPS file — point at the RAW recording.",
                  file=sys.stderr)
            sys.exit(1)
        media_dir = os.path.dirname(source)
        stem = os.path.basename(media_dir)       # the folder name IS the artifact name
        slug = slugify(stem)
        if not slug:
            print(f"cannot derive a slug from folder name {stem!r}", file=sys.stderr)
            sys.exit(1)

        free_gb = shutil.disk_usage(media_dir).free / 1e9
        if free_gb < MIN_FREE_GB:
            print(f"REFUSED: only {free_gb:.1f} GB free on the media drive — an intake "
                  f"needs ~{MIN_FREE_GB} GB headroom (LOW BPS + vertical + staged "
                  "longform). Free space first; do not let a render die mid-file.",
                  file=sys.stderr)
            sys.exit(1)

        meta_path = os.path.abspath(args.meta) if args.meta else os.path.join(
            media_dir, "longform-meta.json")
        if not args.skip_longform:
            if args.min_sil is None:
                print("--min-sil is required (the desilencer's one knob is the caller's "
                      "call every run; 0.5 matched the accepted longform pacing). Or pass "
                      "--skip-longform.", file=sys.stderr)
                sys.exit(1)
            if not (0.15 <= args.min_sil <= 2.0):
                print(f"--min-sil {args.min_sil}s is outside the sane 0.15-2.0s range.",
                      file=sys.stderr)
                sys.exit(1)
            validate_meta(meta_path)

        if args.test_sandbox:
            sandbox = os.path.abspath(args.test_sandbox)
            staged_root = os.path.join(sandbox, "longform")
            longs_file = os.path.join(sandbox, "longs.json")
            tdir_root = os.path.join(sandbox, "transcripts")
            os.makedirs(staged_root, exist_ok=True)
            os.makedirs(tdir_root, exist_ok=True)
            if not os.path.isfile(longs_file):
                with open(longs_file, "w", encoding="utf-8") as f:
                    json.dump({"$note": "TEST SANDBOX longs.json — not production",
                               "longs": []}, f, indent=2)
        else:
            staged_root = str(STAGED_ROOT)
            longs_file = str(LONGS_FILE)
            tdir_root = str(TRANSCRIPTS)

        vstem = f"{stem} LOW BPS VERTICAL"
        init = {
            "source": source, "media_dir": media_dir, "stem": stem, "slug": slug,
            "meta_path": meta_path,
            "min_sil": args.min_sil if args.min_sil is not None else 0.0,
            "skip_longform": args.skip_longform,
            "cpu_verticalize": args.cpu_verticalize,
            "test_sandbox": args.test_sandbox, "stub": "",
            "master": os.path.join(media_dir, f"{stem} LOW BPS.mp4"),
            "vertical": os.path.join(media_dir, f"{vstem}.mp4"),
            "tdir": os.path.join(tdir_root, vstem),
            "tjson": os.path.join(tdir_root, vstem, f"{vstem}.json"),
            "staged_root": staged_root, "longs_file": longs_file,
            "status": "running",
        }
        thread = args.thread or f"intake-{slug}-{date.today():%Y%m%d}"
        banner = (f"Intake graph | {stem} | slug {slug}"
                  + (f" | min-sil {args.min_sil}s" if not args.skip_longform else " | NO LONGFORM")
                  + (" | CPU verticalize" if args.cpu_verticalize else "")
                  + (f" | TEST SANDBOX {args.test_sandbox}" if args.test_sandbox else ""))

    DATA.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(CHECKPOINT_DB), check_same_thread=False)
    app = build_intake_graph(checkpointer=SqliteSaver(conn))

    print(banner)
    print(f"thread: {thread} | checkpoints: {CHECKPOINT_DB.name}"
          + (" | RESUME" if args.resume else ""))
    print("-" * 60)

    started_at, t0 = datetime.now().isoformat(timespec="seconds"), time.monotonic()
    try:
        final = app.invoke(None if args.resume else init,
                           config={"configurable": {"thread_id": thread}})
    except BaseException as e:
        finish_progress("crashed", f"{type(e).__name__}: {e}")
        if args.resume:
            print("\n(--resume needs a thread that already has a checkpoint; run without "
                  "--resume for a fresh stream.)", file=sys.stderr)
        raise
    print("-" * 60)

    record_run(lane=1, thread=thread, final=final, started_at=started_at,
               ended_at=datetime.now().isoformat(timespec="seconds"),
               duration_s=time.monotonic() - t0, stub=args.stub,
               requested=init.get("slug") if not args.stub else "stub")
    finish_progress(final.get("status", "unknown"), final.get("error"))

    sys.exit(report_intake(final))


SEGMENTS = {"cut": main_cut, "tighten": main_tighten}   # wave 4+ segments join here as blessed

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in SEGMENTS:
        seg = sys.argv.pop(1)    # legacy no-segment invocation stays intake (Wave 1)
        SEGMENTS[seg]()
    else:
        main()
