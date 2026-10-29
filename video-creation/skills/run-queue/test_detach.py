#!/usr/bin/env python
"""test_detach.py — proves a queued run survives its launcher being killed, and that a run killed mid-way is NEVER
silent (Mike, 2026-10-29, after a queued vertical + short was reaped with no notification). Run it after touching
run_queue.detach / _guard:  python video-creation/skills/run-queue/test_detach.py
"""
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
FAKE = '''
import sys, time, os
sys.path.insert(0, {here!r})
import run_queue as RQ
RQ.detach("test run")
def invoke(retry):
    time.sleep(float(os.environ["FAKE_SECS"]))
    return {{"status": "done", "steps": {{}}}}
RQ.supervise("test run", "test", "t", invoke, set(), lambda f: False)
'''


def _kill_tree(pid):
    subprocess.run(["taskkill", "/T", "/F", "/PID", str(pid)], capture_output=True)


def _wait(cond, secs, what):
    t = time.time() + secs
    while time.time() < t:
        if cond():
            return
        time.sleep(0.5)
    raise AssertionError(f"timed out waiting for: {what}")


def _setup(secs):
    d = Path(tempfile.mkdtemp(prefix="rq-detach-"))
    fake = d / "fake_run.py"
    fake.write_text(FAKE.format(here=str(HERE)), encoding="utf-8")
    env = {**os.environ, "RUN_QUEUE_STATE_DIR": str(d / "state"), "RUN_QUEUE_NO_TOAST": "1", "FAKE_SECS": str(secs)}
    for k in ("RUN_QUEUE_DETACHED", "RUN_QUEUE_HELD", "RUN_QUEUE_REPORT"):
        env.pop(k, None)
    return d, fake, env


def _notes(d):
    f = d / "state" / "notifications.log"
    return f.read_text(encoding="utf-8") if f.is_file() else ""


def _rc_files(d):
    return list((d / "state" / "logs").glob("*.rc")) if (d / "state" / "logs").is_dir() else []


def test_launcher_killed_run_survives():
    d, fake, env = _setup(8)
    p = subprocess.Popen([sys.executable, "-u", str(fake)], env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                         creationflags=0x00000200)
    _wait(lambda: (d / "state" / "queue.json").is_file() and json.loads((d / "state" / "queue.json").read_text()).get("entries"),
          30, "the detached run to take its turn")
    _kill_tree(p.pid)                                   # what Claude Code's reaper does to a background task
    p.wait(10)
    _wait(lambda: _rc_files(d), 40, "the detached run to finish after its launcher was killed")
    assert _rc_files(d)[0].read_text().strip() == "0", "the run did not exit 0"
    assert "Run finished." in _notes(d), _notes(d)
    assert "STOPPED without reporting" not in _notes(d), _notes(d)
    log = next((d / "state" / "logs").glob("*.log")).read_text(encoding="utf-8", errors="replace")
    assert "TURN TAKEN" in log and "turn released" in log, f"the run's own output is missing from its log: {log!r}"
    print("PASS  launcher killed -> the run survived, finished and reported")


def test_run_killed_is_notified():
    d, fake, env = _setup(60)
    p = subprocess.Popen([sys.executable, "-u", str(fake)], env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                         creationflags=0x00000200)
    q = d / "state" / "queue.json"
    _wait(lambda: q.is_file() and json.loads(q.read_text()).get("entries"), 30, "the detached run to take its turn")
    run_pid = json.loads(q.read_text())["entries"][0]["pid"]
    _kill_tree(run_pid)                                 # the run itself dies (memory, crash)
    _wait(lambda: "STOPPED without reporting" in _notes(d), 30, "the guard's notification")
    p.wait(15)
    assert p.returncode != 0, "the launcher reported success for a killed run"
    print("PASS  run killed -> the guard notified and the launcher exited non-zero")


def test_dead_entry_pruned_with_notice():
    d, fake, env = _setup(0)
    st = d / "state"
    st.mkdir(parents=True)
    (st / "queue.json").write_text(json.dumps({"paused": False, "entries": [
        {"id": "dead01", "label": "ghost run", "status": "waiting", "pid": 999999, "pstart": 1}]}))
    subprocess.run([sys.executable, str(HERE / "run_queue.py"), "status"], env=env, capture_output=True)
    assert "ghost run" in _notes(d) and "DIED" in _notes(d), _notes(d)
    print("PASS  a dead queue entry is pruned WITH a notification")


if __name__ == "__main__":
    test_dead_entry_pruned_with_notice()
    test_launcher_killed_run_survives()
    test_run_killed_is_notified()
    print("DETACH-TEST PASS")
