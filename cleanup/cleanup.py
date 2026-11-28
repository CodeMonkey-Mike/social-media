#!/usr/bin/env python
"""
cleanup.py: the multi-target asset cleaner. It moves assets that are no longer needed to the Windows Recycle
Bin (it never deletes outright). Each target supplies its own policy in ./targets/<name>.py; this engine does
the command line, the report and the move.

Python port of cleanup.js (2026-11-27; the JS was deleted the same day).

Usage:
  python cleanup/cleanup.py --target <name|all> [--dry-run] [--age-days N] [--only <path-substring>]

  --target      schedule-tweets | video-creation | all   (required)
  --dry-run     show what would be recycled; move nothing
  --age-days N  the age threshold of the video-creation target (default 30)
  --only TEXT   only the paths that contain TEXT (forward slashes, any case), e.g.
                --only video-creation/remotion/out

Recycling can be undone (Recycle Bin), but always run --dry-run first. A flag this tool does not know is an
error and nothing runs, so a mistyped --dry-run can never turn into a live run.

Exit 0 = done · 1 = a step failed (the Recycle Bin move, or the comp cleanup) · 2 = bad arguments.
"""
import argparse
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import lib  # noqa: E402
from targets import schedule_tweets, video_creation  # noqa: E402

REPO_ROOT = os.path.dirname(HERE)

TARGETS = {
    schedule_tweets.NAME: schedule_tweets,
    video_creation.NAME: video_creation,
}

# The React files of finished livestream shorts live here; see run_comp_cleanup.
COMP_SRC = "video-creation/remotion/src"


def protected_roots():
    """NEVER RECYCLED, whatever a target plans: the eval record of the livestream clip-strategist (every keep
    and kill at a gate, the transcripts kept for replays, the replays and scores). It is permanent by design
    (video-creation/livestream-repurpose/skills/clip-evals/clip-evals.md). No target touches it today; this
    guard makes sure a later change to a target, or an empty-folder prune of a parent, never does."""
    return [os.path.join(REPO_ROOT, "video-creation", "livestream-repurpose", "evals")]


def is_protected(path):
    a = os.path.abspath(path).lower()
    for root in protected_roots():
        b = root.lower()
        if a == b or a.startswith(b + os.sep) or b.startswith(a + os.sep):     # inside it, or a parent of it
            return True
    return False


def warn(text):
    print(text, file=sys.stderr, flush=True)


def spawn(cmd):
    """Run a child with our own stdout / stderr, from the repo root. -> its exit status (None = not started)."""
    sys.stdout.flush()
    try:
        return subprocess.run(cmd, cwd=REPO_ROOT).returncode
    except OSError as e:
        warn(f"  could not start {cmd[0]}: {e}")
        return None


def sync_batch_status(dry_run):
    """Bring the batch lifecycle status up to date before planning. The video-creation target PROTECTS active
    batches and RECYCLES completed ones, so a finished batch still flagged `active` would wrongly shield its
    source artifacts (and a batch that is never reconciled is never reclaimed). The reconciler runs first, so
    cleanup always acts on current status; in --dry-run it runs dry too (it reports drift, writes nothing)."""
    script = os.path.join(REPO_ROOT, "scripts", "reconcile_batch_status.py")
    if not os.path.exists(script):
        return
    print(f"\n--- syncing batch status (reconcile_batch_status.py{' --dry-run' if dry_run else ''}) ---")
    status = spawn([sys.executable, script] + (["--dry-run"] if dry_run else []))
    if status != 0:
        warn("  WARNING: reconcile failed; proceeding with existing batches.json status.")


def run_chat_cleanup(dry_run):
    """ChatGPT image chats are cleaned alongside files: a chat tied (by its `batch` property in
    chatgpt-image-chats.json) to a completed/archived batch is deleted in the ChatGPT UI, plus any rotation
    leftovers on the registry's `retired` list. The browser work lives in repurpose/delete_chats.py; this
    engine only starts it. A LIVE run also RECONCILES the registry against the live account in the same
    browser session (DEAD / DRIFTED / ORPHAN / REVIEW classes, see repurpose/reconcile_chats.py; --fix = its
    safe repairs), so an unregistered automation chat shows up HERE, not in Mike's sidebar; --dry-run prints
    the plan plus the last reconcile summary without a browser. A LIVE run opens the shared chatgpt-profile
    Chrome briefly (never in --dry-run), so do not run a live cleanup while an image-gen batch is in flight;
    a locked profile fails loudly and the chats stay queued for the next run."""
    script = os.path.join(REPO_ROOT, "repurpose", "delete_chats.py")
    if not os.path.exists(script):
        return
    print(f"\n--- ChatGPT image chats (repurpose/delete_chats.py{' --dry-run' if dry_run else ' --fix'}) ---")
    if spawn([sys.executable, script, "--dry-run" if dry_run else "--fix"]) != 0:
        warn("  WARNING: chat cleanup incomplete (profile busy, UI drift, or a failed delete); "
             "retired chats stay queued for the next run.")


def run_comp_cleanup(dry_run):
    """The React files of finished livestream shorts (video-creation/remotion/src/) are cleaned alongside
    files too, but they are not a plain path list: each short is a family of files PLUS an import and a
    <Composition> block in Root.tsx, so recycling one means rewriting Root.tsx and type-checking it before
    anything moves. That lives in cleanup/remotion_comps.py; this engine only starts it. It keeps the comps
    of ACTIVE batches and anything written in the last 24 h, and never touches a longform / ai-engineering
    comp or the shared kit. (Mike 2026-10-03: 461 files had piled up.)  -> False when it failed."""
    script = os.path.join(REPO_ROOT, "cleanup", "remotion_comps.py")
    if not os.path.exists(script):
        return True
    print(f"\n--- Remotion shorts comps (cleanup/remotion_comps.py{' --dry-run' if dry_run else ''}) ---")
    if spawn([sys.executable, script] + (["--dry-run"] if dry_run else [])) != 0:
        warn("  WARNING: comp cleanup failed (see above); Root.tsx is restored whenever its check fails.")
        return False
    return True


def run_chat_open_lint():
    """A static gate, no browser: a script that opens chatgpt.com / the chatgpt profile outside the pool
    (chat_pool.launch_profile / probe_session) is exactly how untitled chats leak. WARN lines only."""
    script = os.path.join(REPO_ROOT, "scripts", "chatgpt-open-lint.py")
    if not os.path.exists(script):
        return
    print("\n--- chatgpt.com openers outside the pool (scripts/chatgpt-open-lint.py) ---")
    spawn([sys.executable, script])


def _rel_key(path):
    return lib.rel_path(path, REPO_ROOT).replace("\\", "/").lower()


def run_target(name, opts):
    """Plan, report and (unless --dry-run) move one target. -> {"moved", "bytes", "failed"}."""
    plan = TARGETS[name].plan(REPO_ROOT, opts.age_days)
    recycle, skipped = plan["recycle"], plan["skipped"]
    needle = opts.only.replace("\\", "/").lower() if opts.only else None
    if needle:
        recycle = [e for e in recycle if needle in _rel_key(e["path"])]
        skipped = [e for e in skipped if needle in _rel_key(e["path"])]
        print(f'  (filtered to paths matching "{opts.only}")')

    # The empty-folder prune: any folder under the target's prune roots that is left with no files once the
    # planned recycle set is gone is recycled too, so the empty <batch>/ folders are never stranded behind
    # cleaned-out files. It is worked out against the (filtered) recycle set, so a dry run reports the
    # folders and the live run removes them in the same single move.
    if plan.get("prune_roots"):
        removed = {e["path"].lower() for e in recycle}
        skip = {d.lower() for d in plan.get("prune_skip_dirs") or []}
        empty_dirs = lib.find_empty_dirs(plan["prune_roots"], skip_dirs=skip, removed=removed)
        if needle:
            empty_dirs = [d for d in empty_dirs if needle in _rel_key(d)]
        for d in empty_dirs:
            recycle.append({"path": d, "reason": "empty folder (no files remain after cleanup)"})

    blocked = [e for e in recycle if is_protected(e["path"])]
    if blocked:
        recycle = [e for e in recycle if not is_protected(e["path"])]
        print(f"  PROTECTED: kept {len(blocked)} path(s) that hold the eval record (never recycled):")
        for e in blocked:
            print(f"    {lib.rel_path(e['path'], REPO_ROOT)}")

    total_bytes = sum(lib.size_of(e["path"]) for e in recycle)

    print(f"\n=== target: {name} ===")
    print(f"  eligible to recycle : {len(recycle)}  ({lib.fmt_bytes(total_bytes)})")
    print(f"  skipped (kept)      : {len(skipped)}")

    if recycle:
        print("\n  Would recycle:")
        for e in recycle:
            print(f"    {lib.rel_path(e['path'], REPO_ROOT)}  — {e['reason']}")

    if opts.dry_run:
        print("\n  [dry-run] nothing moved." if recycle else "\n  Nothing to recycle.")
        return {"moved": 0, "bytes": 0, "failed": False}
    if not recycle:
        print("\n  Nothing to recycle.")
        return {"moved": 0, "bytes": 0, "failed": False}

    print("\n  Moving to Recycle Bin...")
    ok, left = lib.recycle_paths([e["path"] for e in recycle])
    if not ok:
        warn("  Recycle Bin operation FAILED.")
        if left:
            warn(f"  {len(left)} of {len(recycle)} path(s) are still on disk:")
            for p in left[:20]:
                warn(f"    {lib.rel_path(p, REPO_ROOT)}")
            if len(left) > 20:
                warn(f"    ... and {len(left) - 20} more")
        return {"moved": 0, "bytes": 0, "failed": True}
    print(f"  Done. Recycled {len(recycle)} item(s), freed ~{lib.fmt_bytes(total_bytes)}.")
    return {"moved": len(recycle), "bytes": total_bytes, "failed": False}


def non_negative_int(text):
    n = int(text)
    if n < 0:
        raise argparse.ArgumentTypeError("--age-days must be a non-negative integer")
    return n


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Move assets that are no longer needed to the Recycle Bin. Always run --dry-run first.")
    ap.add_argument("--target", "-t", required=True, choices=[*TARGETS, "all"],
                    help="which folder's policy to run")
    ap.add_argument("--dry-run", action="store_true", help="show what would be recycled; move nothing")
    ap.add_argument("--age-days", type=non_negative_int, default=30,
                    help="the age threshold of the video-creation target (default 30)")
    ap.add_argument("--only", default=None, metavar="TEXT",
                    help="only the paths that contain TEXT (forward slashes, any case)")
    opts = ap.parse_args(argv)
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

    if opts.dry_run:
        print("[DRY RUN] No files will be moved.")
    names = list(TARGETS) if opts.target == "all" else [opts.target]

    # What is eligible depends on batches.json status, so sync it first: ALWAYS, for every target. This used to
    # run only when video-creation was among the targets, so a `--target schedule-tweets` run skipped the sync
    # and left batches stale-`active`. Stale-active is the dangerous direction: it shields a finished batch's
    # source artifacts for good (1.4 GB of livestream media hid behind it), and the drift cannot be seen,
    # because the reconcile table only prints on a run that happens to include video-creation.
    # (Mike 2026-07-28)
    sync_batch_status(opts.dry_run)

    failed = False
    total_moved = total_bytes = 0
    for name in names:
        r = run_target(name, opts)
        total_moved += r["moved"]
        total_bytes += r["bytes"]
        failed = failed or r["failed"]

    # The shorts-comp tier rides with the video-creation target. It works on whole comp families, not paths,
    # so under --only it runs when the filter names remotion/src or a folder above it.
    needle = opts.only.replace("\\", "/").lower() if opts.only else None
    if video_creation.NAME in names and (not needle or needle in COMP_SRC):
        failed = (not run_comp_cleanup(opts.dry_run)) or failed

    # Chat cleanup rides with the video-creation target (its batch lifecycle decides what is eligible).
    # Skipped under --only: that is a folder-scoped file run, and chats are not paths.
    if video_creation.NAME in names and not needle:
        run_chat_cleanup(opts.dry_run)
        run_chat_open_lint()

    if len(names) > 1 and not opts.dry_run:
        print(f"\n=== total: recycled {total_moved} item(s), freed ~{lib.fmt_bytes(total_bytes)} ===")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
