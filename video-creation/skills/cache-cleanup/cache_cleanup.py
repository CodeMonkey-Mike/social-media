"""Clear the After Effects + Remotion caches when a video project is declared complete, ONLY if no other video is in progress.

Canonical doc: cache-cleanup.md (Mike's design, 2026-11-05). Tests: test_cache_cleanup.py.

    python cache_cleanup.py check                                  what blocks, what would go; deletes nothing
    python cache_cleanup.py complete <project> --note "<his words>"   write the project's completion mark
    python cache_cleanup.py complete-batch <batch> --note "<his words>"   the same for a livestream batch
    python cache_cleanup.py run                                    re-check, then delete if clear

Exit codes: 0 = clear (run: deleted) · 3 = blocked, nothing deleted · 2 = usage error.

Fail-closed by construction: a check that cannot answer is a blocker, and an unmarked project counts as in progress.
Claude conversations and the pagefile are not in here and must never be added (Mike, 2026-11-05). There is no force flag.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from fnmatch import fnmatch
from pathlib import Path

HERE = Path(__file__).resolve().parent
VIDEO = HERE.parents[1]  # video-creation/
REPO = VIDEO.parent
MARK = "PROJECT-COMPLETE.json"
BATCH_MARKS = HERE / "completed-batches.json"  # Mike's word on a batch; batches.json stays untouched (its `completed` opens the batch to cleanup/cleanup.js)
LOW_C_GB = 25            # below this a blocked run warns; it still deletes nothing
FRESH_MIN = 10           # anything written this recently is left alone, whatever the checks said
SIZE_BUDGET_S = 20       # D:\ scratch folders are huge: sizes are "at least", never a stalled walk

# project parents: <dir>/<project>, or <dir>/<format>/<project> where nested
PROJECT_ROOTS = [("longform-edited/media", False), ("longform-presentation/media", True),
                 ("ai-engineering/media", False), ("yuli-y-ana/media", False)]

# THE ALLOWLIST. Only these names are ever deleted, and only as direct children of these folders. Masters and project
# files on D:\video-work, hand-made scratch (wb*, build-*) and everything else are unreachable.
RENDER_CACHE_NAMES = ["remotion-*", "react-motion-*", "puppeteer_dev_chrome_profile-*", "chunked-render-test-*"]
CHUNK_DIR = "chunked-render"     # its CHILDREN go (resume chunks + bundles), the folder stays
AE_CACHE_NAME = "Disk Cache*"    # Temp\Adobe\After Effects\<version>\Disk Cache - <machine>.noindex


@dataclass
class Config:
    video: Path = VIDEO
    batches: Path = REPO / "batches.json"
    batch_marks: Path = BATCH_MARKS
    ae_root: Path = Path(os.environ.get("LOCALAPPDATA", r"C:\Users\mnede\AppData\Local")) / "Temp" / "Adobe" / "After Effects"
    render_dirs: list = field(default_factory=lambda: [
        Path(os.environ.get("LOCALAPPDATA", r"C:\Users\mnede\AppData\Local")) / "Temp",
        Path(r"D:\remotion-tmp"), Path(r"D:\remotion-work"), Path(r"D:\tmp")])  # a missing D: is simply skipped
    disk: str = "C:\\"
    fresh_min: int = FRESH_MIN


# ── what blocks ─────────────────────────────────────────────────────────────────────────────────────────────────────

def queue_blockers():
    """Every open run-queue entry, running or waiting, and a paused queue (Mike paused something on purpose)."""
    try:
        sys.path.insert(0, str(HERE.parent / "run-queue"))
        import run_queue
        with run_queue._locked() as data:
            out = [f"run queue: {e.get('label', e.get('id'))} ({e.get('status')})" for e in data["entries"]]
            if data.get("paused"):
                out.append("run queue: paused")
            return out
    except Exception as e:  # noqa: BLE001 - fail closed
        return [f"run queue could not be read ({e})"]


def process_blockers():
    """A render or After Effects the queue does not know about (--skip-queue, a hand-run still, Mike's own AE session)."""
    ps = ("Get-CimInstance Win32_Process | Where-Object { $_.Name -match '^(AfterFX|aerender)' -or "
          "($_.Name -match '^node' -and $_.CommandLine -match 'remotion') } | ForEach-Object { $_.Name + ' ' + $_.ProcessId }")
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps], capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            return [f"process check failed (rc {r.returncode})"]
        return [f"running process: {line.strip()}" for line in r.stdout.splitlines() if line.strip()]
    except Exception as e:  # noqa: BLE001 - fail closed
        return [f"process check failed ({e})"]


def project_dirs(cfg):
    out = []
    for rel, nested in PROJECT_ROOTS:
        root = cfg.video / rel
        if not root.is_dir():
            continue
        for d in sorted(p for p in root.iterdir() if p.is_dir()):
            out.extend(sorted(p for p in d.iterdir() if p.is_dir()) if nested else [d])
    return out


def project_blockers(cfg):
    """A project is finished only when its folder carries the mark. Paused, at a gate or forgotten: all in progress. An empty
    folder holds no work and is skipped."""
    out = []
    for d in project_dirs(cfg):
        try:
            if any(d.iterdir()) and not (d / MARK).is_file():
                out.append(f"project in progress: {d.relative_to(cfg.video).as_posix()}")
        except OSError as e:
            out.append(f"project could not be read: {d} ({e})")
    return out


def batch_blockers(cfg):
    """Livestream repurposes: anything not `completed` in batches.json is in progress, unless Mike declared it complete."""
    try:
        data = json.loads(cfg.batches.read_text(encoding="utf-8"))
        rows = data["batches"] if isinstance(data, dict) else data
        marked = json.loads(cfg.batch_marks.read_text(encoding="utf-8")) if cfg.batch_marks.is_file() else {}
        return [f"livestream batch in progress: {b.get('batch')} ({b.get('status')})" for b in rows
                if b.get("status") != "completed" and b.get("batch") not in marked]
    except Exception as e:  # noqa: BLE001 - fail closed
        return [f"batches.json could not be read ({e})"]


def blockers(cfg):
    return queue_blockers() + process_blockers() + project_blockers(cfg) + batch_blockers(cfg)


def live_blockers():
    """The two that can change in seconds, re-read right before each delete."""
    return queue_blockers() + process_blockers()


# ── what goes ───────────────────────────────────────────────────────────────────────────────────────────────────────

def targets(cfg):
    out = []
    if cfg.ae_root.is_dir():
        for ver in sorted(p for p in cfg.ae_root.iterdir() if p.is_dir()):
            out += [c for c in ver.iterdir() if c.is_dir() and fnmatch(c.name, AE_CACHE_NAME)]
    for d in cfg.render_dirs:
        try:
            if not d.is_dir():
                continue
            out += [c for c in d.iterdir() if any(fnmatch(c.name, n) for n in RENDER_CACHE_NAMES)]
            chunks = d / CHUNK_DIR
            if chunks.is_dir():
                out += list(chunks.iterdir())
        except OSError:
            continue  # D: went away mid-walk
    return out


def size_of(paths, budget=SIZE_BUDGET_S):
    """(bytes, complete). Stops at the budget: a floor, never a stalled walk."""
    total, end = 0, time.time() + budget
    for p in paths:
        for base, _dirs, files in ([(str(p.parent), [], [p.name])] if p.is_file() else os.walk(p)):
            for f in files:
                try:
                    total += os.path.getsize(os.path.join(base, f))
                except OSError:
                    pass
            if time.time() > end:
                return total, False
    return total, True


def _gb(n):
    return f"{n / 1e9:.1f} GB"


def is_fresh(path, fresh_min):
    try:
        return (time.time() - path.stat().st_mtime) < fresh_min * 60
    except OSError:
        return False


def remove(path):
    if path.is_dir():
        shutil.rmtree(path, ignore_errors=True)
    else:
        try:
            path.unlink()
        except OSError:
            pass
    return not path.exists()


# ── commands ────────────────────────────────────────────────────────────────────────────────────────────────────────

def report_blocked(found, cfg):
    print(f"BLOCKED: {len(found)} thing(s) in progress, nothing deleted:")
    for b in found:
        print(f"  - {b}")
    free = shutil.disk_usage(cfg.disk).free
    if free < LOW_C_GB * 1e9:
        size, whole = size_of(targets(cfg))
        print(f"LOW DISK: {cfg.disk} has {_gb(free)} free. The caches hold {'' if whole else 'at least '}{_gb(size)}. "
              "This tool will not clear them while work is in progress: it is Mike's call.")


def cmd_check(cfg, argv_blockers=blockers):
    found = argv_blockers(cfg)
    tg = targets(cfg)
    size, whole = size_of(tg)
    print(f"Caches: {len(tg)} item(s), {'' if whole else 'at least '}{_gb(size)}.")
    if found:
        report_blocked(found, cfg)
        return 3
    print("CLEAR: no other video in progress. `run` would delete the caches above.")
    return 0


def cmd_run(cfg, all_check=blockers, live_check=live_blockers):
    found = all_check(cfg)
    if found:
        report_blocked(found, cfg)
        return 3
    before = shutil.disk_usage(cfg.disk).free
    done, kept, failed = 0, 0, []
    for p in targets(cfg):
        live = live_check()
        if live:  # a run started mid-sweep: stop right there
            print(f"STOPPED after {done} item(s): {live[0]}")
            return 3
        if is_fresh(p, cfg.fresh_min):
            kept += 1
            continue
        if remove(p):
            done += 1
        else:
            failed.append(str(p))
    print(f"DELETED {done} cache item(s); {kept} written in the last {cfg.fresh_min} min kept; "
          f"{cfg.disk} free {_gb(before)} -> {_gb(shutil.disk_usage(cfg.disk).free)}.")
    for f in failed[:20]:
        print(f"  could not delete (in use?): {f}")
    return 0


def cmd_complete_batch(cfg, name, note):
    data = json.loads(cfg.batches.read_text(encoding="utf-8"))
    rows = data["batches"] if isinstance(data, dict) else data
    if not any(b.get("batch") == name for b in rows):
        raise SystemExit(f"batch '{name}' is not in batches.json")
    marked = json.loads(cfg.batch_marks.read_text(encoding="utf-8")) if cfg.batch_marks.is_file() else {}
    marked[name] = {"completed_at": datetime.now().isoformat(timespec="seconds"), "note": note}
    cfg.batch_marks.write_text(json.dumps(marked, indent=2), encoding="utf-8")
    print(f"batch marked complete for cache cleanup: {name}")
    return 0


def find_project(cfg, name):
    p = Path(name)
    if p.is_absolute() and p.is_dir():
        return p
    hits = [d for d in project_dirs(cfg) if d.name == name or d.relative_to(cfg.video).as_posix().endswith(name)]
    if len(hits) != 1:
        raise SystemExit(f"project '{name}': {len(hits)} matches, give the path")
    return hits[0]


def cmd_complete(cfg, name, note):
    d = find_project(cfg, name)
    (d / MARK).write_text(json.dumps({"completed_at": datetime.now().isoformat(timespec="seconds"), "note": note}, indent=2), encoding="utf-8")
    print(f"marked complete: {d}")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    sub.add_parser("run")
    c = sub.add_parser("complete")
    c.add_argument("project")
    c.add_argument("--note", required=True, help="Mike's declaration: when and in what words")
    b = sub.add_parser("complete-batch")
    b.add_argument("batch")
    b.add_argument("--note", required=True, help="Mike's declaration: when and in what words")
    a = ap.parse_args()
    cfg = Config()
    if a.cmd == "check":
        return cmd_check(cfg)
    if a.cmd == "run":
        return cmd_run(cfg)
    if a.cmd == "complete-batch":
        return cmd_complete_batch(cfg, a.batch, a.note)
    return cmd_complete(cfg, a.project, a.note)


if __name__ == "__main__":
    sys.exit(main())
