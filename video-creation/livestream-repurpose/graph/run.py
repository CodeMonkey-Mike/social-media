# run.py — CLI runner for the livestream-repurpose intake graph (intake_graph.py).
#
#   python video-creation/livestream-repurpose/graph/run.py \
#       --source "video-creation/livestream-repurpose/media/<folder>/<recording>.mkv" \
#       --min-sil 0.5
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
    build_intake_graph, finish_progress, record_run,
)

from langgraph.checkpoint.sqlite import SqliteSaver  # noqa: E402

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


if __name__ == "__main__":
    main()
