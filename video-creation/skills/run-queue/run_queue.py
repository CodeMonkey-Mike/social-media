#!/usr/bin/env python
"""run_queue.py — the machine-wide VIDEO-PRODUCTION RUN QUEUE + the run supervisor (Mike, 2026-10-27). Read run-queue.md.

ONE video-production run owns the machine at a time. A run (longform graph, livestream batch, vertical, short, a hand-run
render) takes its TURN when it starts or resumes and RELEASES it the moment it stops: at a HITL gate, done, or failed. The
next waiting run then starts on its own, first come first served. Mike never sequences sessions by hand again.

    from run_queue import turn, supervise
    with turn("longform only-18-months-left", kind="longform", project="only-18-months-left"):
        ...                                          # the run; children inherit the turn (env RUN_QUEUE_HELD)

    python run_queue.py status                       # what runs, what waits (and at what position)
    python run_queue.py pause | resume               # a meeting: renders stop at their next chunk boundary,
                                                     #   nothing new starts until resume
    python run_queue.py cancel <id>                  # drop a WAITING run (it exits cleanly)
    python run_queue.py front <id>                   # move a waiting run to the front

SCOPE = video production ONLY. Posting task lists, the LinkedIn lanes, reply-guy and find-jobs never join the queue and
never wait on it. A video run started with --skip-queue (Mike: "run this now, skip the queue") starts immediately and
overlaps; it is still listed in `status` so the overlap is visible.

A dead holder never blocks the queue: every entry carries its PID + the process start time, and an entry whose process is
gone is pruned on the next look (no wmic, no command-line matching: 2026-10-27 a wait-launcher matched its own query).
State: state/queue.json (+ state/queue.lock, an msvcrt byte lock around every read-modify-write).

supervise() wraps one graph invocation: take the turn, run, and on a FAILURE of a node in the caller's retry set re-drive
ONCE automatically (the nodes are redo-safe: artifacts on disk skip), then release the turn and send ONE desktop
notification (gate reached / done / failed again). Posting is never retried (hard rule): no graph node posts.
"""
import argparse
import ctypes
import json
import os
import re
import sys
import time
import uuid
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from notify import notify  # noqa: E402

STATE = Path(os.environ.get("RUN_QUEUE_STATE_DIR") or HERE / "state")   # tests point it at a temp dir
QUEUE = STATE / "queue.json"
LOCK = STATE / "queue.lock"
HELD_ENV, ID_ENV, SKIP_ENV = "RUN_QUEUE_HELD", "RUN_QUEUE_ID", "RUN_QUEUE_SKIP"
POLL_S = 10


# ── process liveness (ctypes; PID + creation time so a recycled PID never looks alive) ─────────────────────────────

def _proc_start(pid: int):
    """The process creation time (100 ns ticks) or None when the process is gone."""
    if os.name != "nt":
        try:
            os.kill(pid, 0)
            return 0
        except OSError:
            return None
    k32 = ctypes.windll.kernel32
    h = k32.OpenProcess(0x1000, False, int(pid))          # PROCESS_QUERY_LIMITED_INFORMATION
    if not h:
        return None
    try:
        code = ctypes.c_ulong()
        if not k32.GetExitCodeProcess(h, ctypes.byref(code)) or code.value != 259:   # 259 = STILL_ACTIVE
            return None
        c, e, kk, u = (ctypes.c_ulonglong() for _ in range(4))
        if not k32.GetProcessTimes(h, ctypes.byref(c), ctypes.byref(e), ctypes.byref(kk), ctypes.byref(u)):
            return 0
        return c.value
    finally:
        k32.CloseHandle(h)


def _alive(entry) -> bool:
    st = _proc_start(int(entry.get("pid", 0)))
    return st is not None and (not entry.get("pstart") or st == entry["pstart"])


# ── locked state ────────────────────────────────────────────────────────────────────────────────────────────────────

@contextmanager
def _locked():
    STATE.mkdir(parents=True, exist_ok=True)
    fh = open(LOCK, "a+b")
    try:
        if os.name == "nt":
            import msvcrt
            fh.seek(0)
            for _ in range(600):
                try:
                    msvcrt.locking(fh.fileno(), msvcrt.LK_NBLCK, 1)
                    break
                except OSError:
                    time.sleep(0.05)
            else:
                raise RuntimeError("run-queue lock busy for 30 s")
        try:
            data = json.loads(QUEUE.read_text(encoding="utf-8")) if QUEUE.is_file() else {}
        except (OSError, ValueError):
            data = {}
        data.setdefault("paused", False)
        data.setdefault("entries", [])
        before = json.dumps(data, sort_keys=True)
        dead = [e for e in data["entries"] if not _alive(e)]
        data["entries"] = [e for e in data["entries"] if e not in dead]
        for e in dead:   # a clean stop removes its own entry, so a pruned one DIED (killed, crash, reboot): never silent
            notify(e.get("label", "Video run"), f"DIED while {e.get('status', 'queued')} (process {e.get('pid')} is gone, "
                   "it never reported a gate, done or failure). Nothing is running for it: it must be started again.")
        yield data
        if json.dumps(data, sort_keys=True) != before:
            tmp = QUEUE.with_suffix(".tmp")
            tmp.write_text(json.dumps(data, indent=2), encoding="utf-8")
            os.replace(tmp, QUEUE)
    finally:
        if os.name == "nt":
            import msvcrt
            try:
                fh.seek(0)
                msvcrt.locking(fh.fileno(), msvcrt.LK_UNLCK, 1)
            except OSError:
                pass
        fh.close()


def _now():
    return datetime.now().isoformat(timespec="seconds")


def _holder(data):
    return next((e for e in data["entries"] if e["status"] == "running" and not e.get("skip")), None)


def _waiting(data):
    return [e for e in data["entries"] if e["status"] == "waiting"]


# ── the turn ────────────────────────────────────────────────────────────────────────────────────────────────────────

class Cancelled(SystemExit):
    pass


@contextmanager
def turn(label: str, kind: str = "run", project: str = "", skip: bool = False, poll: float = POLL_S):
    """Hold the machine for one run. Nested calls (a child of a run that already holds the turn) pass straight through."""
    if os.environ.get(HELD_ENV):
        yield os.environ.get(ID_ENV)
        return
    skip = skip or bool(os.environ.get(SKIP_ENV))
    me = {"id": uuid.uuid4().hex[:6], "label": label, "kind": kind, "project": project, "pid": os.getpid(),
          "pstart": _proc_start(os.getpid()) or 0, "queued_at": _now(), "started_at": None,
          "status": "running" if skip else "waiting", "skip": skip}
    if skip:
        me["started_at"] = _now()
    with _locked() as data:
        data["entries"].append(me)
    waited, last_msg = False, ""
    try:
        while not skip:
            with _locked() as data:
                mine = next((e for e in data["entries"] if e["id"] == me["id"]), None)
                if mine is None:
                    if os.environ.get(REPORT_ENV):   # a deliberate cancel is not a silent death
                        Path(os.environ[REPORT_ENV]).write_text("cancelled", encoding="utf-8")
                    raise Cancelled(f"[run-queue] {label}: cancelled while waiting (run_queue.py cancel)")
                holder, waiting = _holder(data), _waiting(data)
                if not data["paused"] and holder is None and waiting and waiting[0]["id"] == me["id"]:
                    mine["status"], mine["started_at"] = "running", _now()
                    break
                pos = [e["id"] for e in waiting].index(me["id"]) + 1
                why = "the queue is PAUSED (run_queue.py resume)" if data["paused"] else \
                      (f"behind {holder['label']} (running since {holder['started_at']})" if holder else "behind an earlier run")
            msg = f"[run-queue] {label}: QUEUED #{pos} {why}; id {me['id']}; starts on its own"
            if msg != last_msg:
                print(msg, flush=True)
                if not waited:
                    notify(label, f"Queued #{pos}, {why}. It starts on its own when the turn is free.")
                last_msg, waited = msg, True
            time.sleep(poll)
        print(f"[run-queue] {label}: TURN TAKEN (id {me['id']}{', skip-queue: overlapping' if skip else ''})", flush=True)
        if waited:
            notify(label, "Its turn came: the run is starting now.")
        os.environ[HELD_ENV], os.environ[ID_ENV] = "1", me["id"]
        yield me["id"]
    finally:
        os.environ.pop(HELD_ENV, None)
        os.environ.pop(ID_ENV, None)
        with _locked() as data:
            data["entries"] = [e for e in data["entries"] if e["id"] != me["id"]]
        print(f"[run-queue] {label}: turn released", flush=True)


def paused() -> bool:
    with _locked() as data:
        return bool(data["paused"])


def wait_while_paused(label: str, poll: float = POLL_S) -> float:
    """Called by renderers BETWEEN chunks: while the queue is paused, hold here (no Chrome, no CPU). Returns seconds held."""
    if not paused():
        return 0.0
    t0 = time.time()
    print(f"[run-queue] {label}: PAUSED at a chunk boundary (run_queue.py resume to continue)", flush=True)
    notify(label, "Paused at a safe point. Nothing is lost; run_queue.py resume continues it.")
    while paused():
        time.sleep(poll)
    print(f"[run-queue] {label}: resumed after {time.time() - t0:.0f} s", flush=True)
    return time.time() - t0


# ── the supervisor ──────────────────────────────────────────────────────────────────────────────────────────────────

def failed_node(final: dict):
    for node, st in reversed(list((final.get("steps") or {}).items())):
        if isinstance(st, dict) and st.get("status") == "failed":
            return node
    return None


def supervise(label, kind, project, invoke, retry_nodes, is_gate, skip=False, describe_gate=None):
    """Run ONE graph invocation inside the turn; re-drive once on a failure of a node in `retry_nodes` (or a crash).
    `invoke(retry: bool) -> final`; `is_gate(final) -> bool`. Returns the final state (the caller reports + exits)."""
    with turn(label, kind=kind, project=project, skip=skip):
        final = invoke(False)
        if final.get("status") == "failed" and not is_gate(final):
            node = failed_node(final)
            err = str(final.get("error") or "")
            crashed = node is None and "crashed" in err
            # a LINT failure is deterministic: a re-drive fails identically (only-18 2026-10-27, edit_plan), so never spend one
            linted = bool(re.search(r"\blint", err, re.I))
            if (crashed or node in retry_nodes) and not linted:
                why = err.splitlines()[0][:160] if err else "no detail"
                print(f"[supervisor] {label}: {node or 'graph'} failed ({why}); re-driving ONCE automatically", flush=True)
                notify(label, f"{node or 'The run'} failed: {why}. Retrying that step once automatically.")
                final = invoke(True)
    if is_gate(final):
        notify(label, f"Waiting for you at the {describe_gate(final) if describe_gate else 'next'} gate. The turn passed to the next run.")
    elif final.get("status") == "failed":
        node = failed_node(final) or "the run"
        why = (str(final.get("error") or "").splitlines() or ["no detail"])[0][:180]
        notify(label, f"FAILED at {node}: {why}. Nothing retried further; the turn passed to the next run.")
    elif final.get("status") == "done":
        notify(label, "Run finished.")
    else:   # e.g. a graph stopped by a persisted --until limit: neither done nor failed, so say exactly that
        last = next(reversed(list((final.get("steps") or {}).keys())), "?")
        notify(label, f"Stopped early after {last} (status '{final.get('status')}', not done): check the run's log. "
                      "The turn passed to the next run.")
    if os.environ.get(REPORT_ENV):
        Path(os.environ[REPORT_ENV]).write_text(str(final.get("status")), encoding="utf-8")
    return final


# ── self-detach + guard (Mike, 2026-10-29) ──────────────────────────────────────────────────────────────────────────
# 2026-10-28 night: a vertical-approve + short run was launched as a Claude Code background task; Claude Code reaped it
# for low memory while it WAITED in the queue, and nothing told Mike. HOW a run is launched is no longer anyone's choice:
# every queued entry point calls detach() first and re-executes itself as a DETACHED process (its own console-less
# process group, broken away from the launcher's job), under a GUARD that notifies when the run ends without having
# reported. The launcher mirrors the log and returns the run's exit code, so it reads like a foreground run; killing the
# launcher (or the whole session) never touches the run. Proven by test_detach.py.

DETACHED_ENV = "RUN_QUEUE_DETACHED"
REPORT_ENV = "RUN_QUEUE_REPORT"   # supervise() touches this file once it has sent its end report
LOGS = STATE / "logs"


def _spawn_detached(argv, log_path):
    flags = 0
    if os.name == "nt":
        flags = 0x00000008 | 0x00000200 | 0x08000000   # DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW
    import subprocess
    out = open(log_path, "ab")
    kw = dict(stdin=subprocess.DEVNULL, stdout=out, stderr=subprocess.STDOUT, close_fds=True,
              env={**os.environ, DETACHED_ENV: "1", "PYTHONIOENCODING": "utf-8", "PYTHONUNBUFFERED": "1"})
    try:
        return subprocess.Popen(argv, creationflags=flags | 0x01000000, **kw)   # + CREATE_BREAKAWAY_FROM_JOB
    except OSError:
        return subprocess.Popen(argv, creationflags=flags, **kw)                 # the job forbids breakaway


def detach(label: str, attach: bool = True):
    """Call FIRST in a queued entry point. In the launcher: start the guard detached and (attach) mirror its log until
    it ends, then exit with the run's exit code. In the detached run itself: return immediately."""
    if os.environ.get(DETACHED_ENV) or os.environ.get(HELD_ENV):
        return
    LOGS.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^\w.-]+", "-", label).strip("-")[:60]
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    log, rcf = LOGS / f"{stamp}-{slug}.log", LOGS / f"{stamp}-{slug}.rc"
    run_argv = [sys.executable, "-u", *sys.argv]
    guard = [sys.executable, "-u", str(Path(__file__).resolve()), "guard", "--label", label, "--rc", str(rcf), "--log", str(log), "--", *run_argv]
    # ORPHAN the guard: a short-lived trampoline starts it and exits at once, so no live parent links the run to the
    # launcher (a tree kill, `taskkill /T`, walks parent PIDs and took a merely-detached child with it in the test)
    pidf = LOGS / f"{stamp}-{slug}.pid"
    tramp = _spawn_detached([sys.executable, str(Path(__file__).resolve()), "spawn", "--log", str(log), "--pidfile", str(pidf),
                             "--", *guard], log)
    tramp.wait(30)
    gpid = int(pidf.read_text()) if pidf.is_file() else tramp.pid

    class _P:
        pid = gpid
    p = _P()
    print(f"[run-queue] {label}: DETACHED (guard pid {p.pid}); log {log}", flush=True)
    if not attach:
        sys.exit(0)
    pos = 0
    try:
        while True:
            with open(log, "rb") as f:
                f.seek(pos)
                chunk = f.read()
                pos += len(chunk)
            if chunk:
                sys.stdout.write(chunk.decode("utf-8", errors="replace"))
                sys.stdout.flush()
            if rcf.is_file():
                with open(log, "rb") as f:
                    f.seek(pos)
                    sys.stdout.write(f.read().decode("utf-8", errors="replace"))
                sys.exit(int(rcf.read_text().strip() or 1))
            if _proc_start(p.pid) is None and not rcf.is_file():
                print(f"[run-queue] {label}: the guard is gone without an exit code (see the notification log)", flush=True)
                sys.exit(1)
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n[run-queue] {label}: launcher stopped; the run continues detached (log {log})", flush=True)
        sys.exit(0)


def _guard(label, rc_path, argv, log=None):
    """Run the real run as a child; if it ends without having sent its own notification, send one."""
    import subprocess
    marker = Path(str(rc_path) + ".reported")
    out = open(log, "ab", buffering=0) if log else None   # the run writes its own log: a detached child's inherited
    rc = subprocess.call(argv, stdin=subprocess.DEVNULL, stdout=out, stderr=subprocess.STDOUT if out else None,   # handles came out empty
                         env={**os.environ, DETACHED_ENV: "1", REPORT_ENV: str(marker)})
    reported = marker.is_file()
    if not reported:
        notify(label, f"STOPPED without reporting (exit {rc}): it never reached a gate, done or a failure report. "
                      "Nothing is running for it now; check its log in run-queue/state/logs and start it again.")
    Path(rc_path).write_text(str(rc))
    return rc


# ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

def _cli():
    if len(sys.argv) > 1 and sys.argv[1] == "spawn":     # the trampoline: start the guard detached, record it, exit
        g = argparse.ArgumentParser(prog="run_queue.py spawn")
        g.add_argument("--log", required=True)
        g.add_argument("--pidfile", required=True)
        g.add_argument("cmd", nargs=argparse.REMAINDER)
        a = g.parse_args(sys.argv[2:])
        child = _spawn_detached(a.cmd[1:] if a.cmd[:1] == ["--"] else a.cmd, a.log)
        Path(a.pidfile).write_text(str(child.pid))
        sys.exit(0)
    if len(sys.argv) > 1 and sys.argv[1] == "guard":
        g = argparse.ArgumentParser(prog="run_queue.py guard")
        g.add_argument("--label", required=True)
        g.add_argument("--rc", required=True)
        g.add_argument("--log", default=None)
        g.add_argument("cmd", nargs=argparse.REMAINDER)
        a = g.parse_args(sys.argv[2:])
        cmd = a.cmd[1:] if a.cmd[:1] == ["--"] else a.cmd
        sys.exit(_guard(a.label, a.rc, cmd, a.log))
    ap = argparse.ArgumentParser(prog="run_queue.py", description="The video-production run queue (run-queue.md).")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status")
    sub.add_parser("pause")
    sub.add_parser("resume")
    c = sub.add_parser("cancel"); c.add_argument("id")
    f = sub.add_parser("front"); f.add_argument("id")
    a = ap.parse_args()
    with _locked() as data:
        if a.cmd == "pause":
            data["paused"] = True
        elif a.cmd == "resume":
            data["paused"] = False
        elif a.cmd == "cancel":
            before = len(data["entries"])
            data["entries"] = [e for e in data["entries"] if not (e["id"] == a.id and e["status"] == "waiting")]
            if len(data["entries"]) == before:
                print(f"no WAITING run with id {a.id} (a running run is stopped in its own console)")
        elif a.cmd == "front":
            e = next((e for e in data["entries"] if e["id"] == a.id and e["status"] == "waiting"), None)
            if e:
                data["entries"].remove(e)
                data["entries"].insert(0, e)
            else:
                print(f"no WAITING run with id {a.id}")
        snap = json.loads(json.dumps(data))
    if a.cmd in ("pause", "resume"):
        notify("Run queue", "PAUSED: renders stop at their next chunk boundary, nothing new starts." if a.cmd == "pause"
               else "Resumed: paused renders continue and waiting runs start in order.")
    print(f"RUN QUEUE ({'PAUSED' if snap['paused'] else 'open'})")
    running = [e for e in snap["entries"] if e["status"] == "running"]
    waiting = [e for e in snap["entries"] if e["status"] == "waiting"]
    for e in running:
        print(f"  RUNNING  {e['id']}  {e['label']:45} since {e['started_at']}{'  (skip-queue)' if e.get('skip') else ''}  pid {e['pid']}")
    for i, e in enumerate(waiting, 1):
        print(f"  #{i} WAIT  {e['id']}  {e['label']:45} queued {e['queued_at']}  pid {e['pid']}")
    if not snap["entries"]:
        print("  (empty)")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    _cli()
