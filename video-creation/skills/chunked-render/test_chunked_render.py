#!/usr/bin/env python
"""test_chunked_render.py — proves chunked_render.py + run_queue.py on a FAKE Remotion (fake_remotion.py), no real render.

    python test_chunked_render.py            # every scenario; prints PASS/FAIL per test, exit 0 only when all pass

Scenarios: clean join (frames, timestamp grid, audio length) · a stalled chunk is killed and retried · a chunk that keeps
crashing fails the render but keeps the finished chunks, and a re-run resumes · a changed bundle never reuses chunks ·
the deadline stops cleanly · the queue's pause holds a render between chunks · two runs take turns · a dead holder is
pruned · cancel · the supervisor re-drives a retry-set failure once and never a non-retry one.
"""
import json
import os
import subprocess
import sys
import tempfile
import threading
import time
from datetime import datetime, timedelta
from pathlib import Path

HERE = Path(__file__).resolve().parent
TMP = Path(tempfile.mkdtemp(prefix="chunked-render-test-"))
os.environ["RUN_QUEUE_STATE_DIR"] = str(TMP / "queue-state")     # never the real queue
os.environ["RUN_QUEUE_NO_TOAST"] = "1"                          # never pop toasts
os.environ["CHUNKED_RENDER_FAKE"] = str(HERE / "fake_remotion.py")
sys.path.insert(0, str(HERE))
import chunked_render as CR  # noqa: E402
import run_queue as RQ  # noqa: E402

PUB = TMP / "public"
PUB.mkdir()
(PUB / "a.txt").write_text("x")
results = []


def check(name, cond, detail=""):
    results.append((name, bool(cond)))
    print(f"{'PASS' if cond else 'FAIL'}  {name}{('  ' + detail) if detail and not cond else ''}", flush=True)


def plan(d):
    p = TMP / f"plan-{time.time_ns()}.json"
    p.write_text(json.dumps(d))
    os.environ["FAKE_PLAN"] = str(p)
    return p


def run(**kw):
    base = dict(comp="FakeComp", public_dir=PUB, quality=["--crf=18"], chunk=60, stall_s=3, first_frame_s=6, attempts=3)
    base.update(kw)
    return CR.render(**base)


def frames_and_grid(p):
    pts = CR._frame_pts(p)
    return len(pts), sum(1 for k, t in enumerate(pts) if abs(t - k / 30) > 1e-4)


# 1. clean join
os.environ["FAKE_TOTAL"] = "200"
plan({})
out = TMP / "clean.mp4"
r = run(out=out, workdir=TMP / "w-clean")
n, off = frames_and_grid(out)
check("clean: 200 frames, 4 chunks", n == 200 and r["chunks"] == 4, f"{n} frames, {r['chunks']} chunks")
check("clean: every timestamp on the 1/30 grid", off == 0, f"{off} off-grid")
check("clean: audio == picture length", abs(CR._audio_seconds(out) - 200 / 30) < 0.03, str(CR._audio_seconds(out)))
check("clean: work dir removed after success", not (TMP / "w-clean").exists())

# 2. a stall is killed and retried; the stalled attempt's log is kept in the manifest
p = plan({"60-119": ["stall"]})
out = TMP / "stall.mp4"
t0 = time.time()
run(out=out, workdir=TMP / "w-stall", keep_chunks=True)
man = json.loads((TMP / "w-stall" / "manifest.json").read_text())
att = man["chunks"]["chunk-000060-000119"]["attempts"]
check("stall: killed and retried, render completes", out.is_file() and len(att) == 2 and att[0]["why"].startswith("STALL"),
      json.dumps(att))
check("stall: the stalled attempt's log is kept", (TMP / "w-stall" / att[0]["log"]).is_file() if att[0].get("log") else False)
check("stall: watchdog fired within ~10 s", time.time() - t0 < 40, f"{time.time() - t0:.0f} s")

# 3. a chunk that crashes 3x fails the render, finished chunks are kept; a re-run resumes
plan({"120-179": ["crash", "crash", "crash"]})
out = TMP / "crash.mp4"
work = TMP / "w-crash"
try:
    run(out=out, workdir=work)
    check("crash: render fails after 3 attempts", False)
except CR.RenderFailed:
    check("crash: render fails after 3 attempts", True)
kept = sorted(x.name for x in work.glob("chunk-*.mkv"))
check("crash: the 2 finished chunks are kept", kept == ["chunk-000000-000059.mkv", "chunk-000060-000119.mkv"], str(kept))
cnt_before = json.loads(Path(os.environ["FAKE_PLAN"] + ".count.json").read_text())
plan({})
run(out=out, workdir=work, keep_chunks=True)
cnt = json.loads(Path(os.environ["FAKE_PLAN"] + ".count.json").read_text())
check("resume: only the missing chunks re-render", sorted(cnt) == ["120-179", "180-199"], str(cnt))
check("resume: output complete", frames_and_grid(out) == (200, 0))

# 4. a changed bundle (comp edited) never reuses stale chunks
os.environ["FAKE_BUNDLE"] = "v2"
plan({})
run(out=out, workdir=work, keep_chunks=True)
cnt = json.loads(Path(os.environ["FAKE_PLAN"] + ".count.json").read_text())
check("fingerprint: a changed comp re-renders every chunk", len(cnt) == 4, str(cnt))
os.environ["FAKE_BUNDLE"] = "v1"

# 5. the deadline stops cleanly before a chunk that cannot finish, and a re-run resumes
plan({})
os.environ["FAKE_FRAME_DELAY"] = "2"
work = TMP / "w-deadline"
try:
    run(out=TMP / "deadline.mp4", workdir=work, deadline=datetime.now() + timedelta(seconds=24))
    check("deadline: stops before the chunk that would overrun", False)
except CR.DeadlineReached as e:
    check("deadline: stops before the chunk that would overrun", len(list(work.glob("chunk-*.mkv"))) >= 1, str(e))
os.environ["FAKE_FRAME_DELAY"] = "0"

# 6. the queue's pause holds a render between chunks
plan({})
with RQ._locked() as d:
    d["paused"] = True
holder = {}
th = threading.Thread(target=lambda: holder.setdefault("r", run(out=TMP / "pause.mp4", workdir=TMP / "w-pause")))
th.start()
time.sleep(4)
check("pause: render holds while paused", "r" not in holder and not (TMP / "pause.mp4").exists())
with RQ._locked() as d:
    d["paused"] = False
th.join(120)
check("pause: render finishes after resume", (TMP / "pause.mp4").is_file())

# 7. two runs take turns; a dead holder is pruned; cancel
child = ("import sys,time,os; sys.path.insert(0, r'{p}'); import run_queue as RQ\n"
         "with RQ.turn(sys.argv[1], kind='test', poll=0.5):\n"
         "    print('START', sys.argv[1], time.time(), flush=True); time.sleep(float(sys.argv[2]))\n"
         "print('END', sys.argv[1], time.time(), flush=True)\n").format(p=str(HERE.parents[0] / "run-queue"))
cf = TMP / "child.py"
cf.write_text(child)
env = {**os.environ}
env.pop("RUN_QUEUE_HELD", None)
pa = subprocess.Popen([sys.executable, str(cf), "A", "4"], stdout=subprocess.PIPE, text=True, env=env)
time.sleep(1.5)
pb = subprocess.Popen([sys.executable, str(cf), "B", "0.5"], stdout=subprocess.PIPE, text=True, env=env)
oa, ob = pa.communicate(60)[0], pb.communicate(60)[0]
ta_end = float(next(l for l in oa.splitlines() if l.startswith("END")).split()[2])
tb_start = float(next(l for l in ob.splitlines() if l.startswith("START")).split()[2])
check("queue: B waited for A's turn", tb_start >= ta_end - 0.2 and "QUEUED #1" in ob, ob[-300:])
pd = subprocess.Popen([sys.executable, str(cf), "DEAD", "60"], stdout=subprocess.PIPE, text=True, env=env)
time.sleep(2)
pd.kill()
pc = subprocess.Popen([sys.executable, str(cf), "AFTER-DEAD", "0.2"], stdout=subprocess.PIPE, text=True, env=env)
oc = pc.communicate(30)[0]
check("queue: a killed holder is pruned, the next run starts", "START AFTER-DEAD" in oc, oc[-300:])
ph = subprocess.Popen([sys.executable, str(cf), "HOLD", "6"], stdout=subprocess.PIPE, text=True, env=env)
time.sleep(1.5)
pw = subprocess.Popen([sys.executable, str(cf), "WAITER", "0.2"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=env)
time.sleep(2)
with RQ._locked() as d:
    wid = next(e["id"] for e in d["entries"] if e["label"] == "WAITER")
subprocess.run([sys.executable, str(HERE.parents[0] / "run-queue" / "run_queue.py"), "cancel", wid], env=env, capture_output=True)
ow = pw.communicate(30)[0]
ph.communicate(30)
check("queue: cancel drops a waiting run", "cancelled" in ow and "START WAITER" not in ow, ow[-300:])

# 8. the supervisor re-drives a retry-set failure once, never a non-retry one
calls = []
def inv_factory(fail_node, fail_times):
    def inv(retry):
        calls.append(retry)
        if len(calls) <= fail_times:
            return {"status": "failed", "error": f"{fail_node}: boom", "steps": {fail_node: {"status": "failed"}}}
        return {"status": "done", "steps": {fail_node: {"status": "ran"}}}
    return inv
calls.clear()
f = RQ.supervise("t", "test", "", inv_factory("comp_build", 1), {"comp_build"}, lambda f: False)
check("supervisor: retry-set failure re-driven once and recovers", calls == [False, True] and f["status"] == "done", str(calls))
calls.clear()
f = RQ.supervise("t", "test", "", inv_factory("stage_longform", 1), {"comp_build"}, lambda f: False)
check("supervisor: a non-retry node is never re-driven", calls == [False] and f["status"] == "failed", str(calls))
calls.clear()
f = RQ.supervise("t", "test", "", inv_factory("comp_build", 5), {"comp_build"}, lambda f: False)
check("supervisor: re-drives only ONCE", calls == [False, True] and f["status"] == "failed", str(calls))

calls.clear()
def inv_lint(retry):
    calls.append(retry)
    return {"status": "failed", "error": "edit_plan: EDIT-PLAN.md fail lint_edit_plan.py", "steps": {"edit_plan": {"status": "failed"}}}
f = RQ.supervise("t", "test", "", inv_lint, {"edit_plan"}, lambda f: False)
check("supervisor: a LINT failure is never re-driven", calls == [False], str(calls))

bad = [n for n, ok in results if not ok]
print(f"\n{len(results) - len(bad)}/{len(results)} passed" + (f"; FAILED: {bad}" if bad else ""))
sys.exit(1 if bad else 0)
