"""check-lane2-build.py: prove the livestream batch graph's BUILD STEP behaves, whatever its shape.

The build step takes every surviving short through four steps:
  1 plan         remotion-builder writes BROLL-PLAN.md + broll-images.json and stops
  2 images       gen_batch.py runs IN CODE under the cross-process `chatgpt` stage lock
  3 image check  visual-qa opens every image; a FAIL moves the failed files aside, image-gen rewrites
                 only their prompts, and step 2 runs again (at most BROLL_QA_ROUNDS = 2 rounds)
  4 build        remotion-builder builds and renders the short from the images on disk

This check runs the REAL batch graph (`build_batch_graph`) from the end of `lane2_finish` up to
`lane2_publish`, with every outside effect faked: the headless agents, the image generator, the stage
lock, the dashboard heartbeat and the 30 s wait between polls of an outside builder. It never calls a
function inside the build step, so the same check proves the step in any shape: one node running thread
pools (the 2026-11-23 shape) or a per-short subgraph fanned out with Send (Mike, 2026-11-22).

What it checks, one case each:
  - the 4 steps run in order and a clean short builds with no note to the builder
  - a failed image check: failed file moved aside, prompts-only fix agent, a remake, round 2
  - two failed rounds: the builder is told to remap; never a third round
  - resume from disk: a plan on disk, a passed check on disk, a failed round 1 on disk (resumes at the
    fix round with no second look first), a failed round 2 on disk (no new rounds)
  - an empty worklist, a check that names no worklist file, a check with no verdict
  - one short failing (bad plan, plan agent crash, no images made, builder crash) never stops the others,
    and the step fails naming that short
  - a short already built is skipped; a short being built by a live outside builder is waited for, not
    spawned again; a stale marker is cleared and the short built
  - --clips scope, stub mode, nothing left to build
  - scheduling, on the SQLite checkpointer run.py uses: builds never exceed --max-builders, the ChatGPT
    browser runs one clip at a time and only under the lock, clips in steps 1-3 never exceed --max-prep, a
    clip's build starts as soon as its images pass, and other clips keep making images while builds run
  - a run killed mid-build and resumed from its checkpoint (no new input) does not redo a finished short,
    and the killed short resumes at its build
  - a remake (fix round) gets the ChatGPT browser before a clip's first round that was waiting longer
  - a re-drive on the same thread fails for its own reason, never the last run's

To prove the check itself, break the step on purpose (a build cap off by one, an image check that never
loops back, a prep slot freed too early) and this must FAIL.

Usage:  python scripts/check-lane2-build.py        exit 0 = every case passes, 1 = something failed.
Runs in a temp folder in well under a minute; never touches a real batch, the dashboard or the browser.
"""
import json
import re
import shutil
import sqlite3
import sys
import tempfile
import threading
import time
import types
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "video-creation" / "livestream-repurpose" / "graph"))

import batch_graph as bg  # noqa: E402
from langgraph.checkpoint.memory import MemorySaver  # noqa: E402
from langgraph.checkpoint.sqlite import SqliteSaver  # noqa: E402

REAL_SLEEP = time.sleep
CASE_TIMEOUT_S = 60
PREP_KINDS = ("plan", "gen", "qa", "fix")
fails = []


def report(ok: bool, label: str, detail=""):
    print(("PASS  " if ok else "FAIL  ") + label + (f"\n        got: {detail}" if detail != "" and not ok else ""))
    if not ok:
        fails.append(label)


class World:
    """One fake batch on disk plus the fakes the graph calls. `clips` maps a clip number to its scenario:
      images     how many images the plan asks for (default 3; 0 = an empty worklist)
      plan       "write" (default) | "bad" (the agent leaves no valid files) | "raise"
      qa         the verdict per round: "PASS" | "FAIL:b" (image b fails) | "FAIL:?" (names no worklist
                 file) | "NONE" (no verdict line); the last entry repeats
      gen        "ok" (default: makes every missing file) | "none" (makes nothing)
      build      "pass" (default: marks the clip 7-built PASS) | "fail" (leaves it) | "raise" |
                 "crash_once" (the first call kills the whole run, the next one builds)
      t_<kind>   seconds the fake takes (plan, gen, qa, fix, build)
      disk_plan / disk_images / disk_report=(round, verdict)   state already on disk (a resumed run)
      phase, gate                                               the clip's progress.json row
      marker=<pid>, marker_live=True|False                      a .building.pid left by another builder
    """

    def __init__(self, root: Path, batch: str, clips: dict, prep=4, builds=2, scope=None, stub=""):
        self.root, self.batch, self.sc = root, batch, clips
        self.prep, self.builds, self.scope, self.stub = prep, builds, list(scope or []), stub
        self.dir = root / batch
        self.ra = self.dir / "render-assets"
        self.ra.mkdir(parents=True)
        self.lock = threading.RLock()
        self.t0 = time.perf_counter()
        self.events = []                                   # (t, clip, kind, "+"/"-")
        self.calls = {n: [] for n in clips}                # each clip's calls in order
        self.prompts = {n: {} for n in clips}              # each clip's last prompt per kind
        self.qa_round = {n: 0 for n in clips}
        self.gen_order = []                                # (clip, remake?) in the order the browser ran them
        self.lock_holder, self.lock_log, self.violations = None, [], []
        self.pid_polls = 0
        rows = []
        for n, s in clips.items():
            slug = f"clip-{n}"
            (self.dir / slug).mkdir()
            rows.append({"n": n, "slug": slug, "phase": s.get("phase", "6-transcribed"), "gate": s.get("gate", "")})
            if s.get("disk_plan") or s.get("disk_report"):
                self._write_plan(n)
            if s.get("disk_images"):
                for it in self.items(n):
                    Path(it["file"]).write_bytes(b"png")
            if s.get("disk_report"):
                rnd, verdict = s["disk_report"]
                self.report_path(n).write_text(
                    f"# {batch} clip {n} `{slug}`: b-roll visual QA, round {rnd} (2026-11-27T00:00:00)\n\n"
                    + self.qa_text(n, verdict), encoding="utf-8")
            if s.get("marker"):
                (self.dir / slug / ".building.pid").write_text(f"{s['marker']} 2026-11-27T00:00:00")
        (self.dir / "progress.json").write_text(
            json.dumps({"batch": batch, "phase": "6-transcribed", "clips": rows}, indent=2), encoding="utf-8")

    # ── disk ──
    def items(self, n):
        k = self.sc[n].get("images", 3)
        return [{"file": str(self.ra / f"broll-t{n}-{chr(97 + i)}.png"), "prompt": f"clip {n} image {i}",
                 "beat": i + 1} for i in range(k)]

    def list_path(self, n):
        return self.dir / f"clip-{n}" / "broll-images.json"

    def report_path(self, n):
        return self.dir / f"clip-{n}" / "broll-visual-qa.md"

    def _write_plan(self, n):
        (self.dir / f"clip-{n}" / "BROLL-PLAN.md").write_text("| beat | image |\n", encoding="utf-8")
        self.list_path(n).write_text(json.dumps(self.items(n), indent=2), encoding="utf-8")

    def qa_text(self, n, verdict):
        names = [Path(it["file"]).name for it in self.items(n)]
        if verdict == "PASS":
            return "\n".join(f"PASS: {x}" for x in names) + "\nVERDICT: PASS\n"
        if verdict == "FAIL:b":
            return "\n".join(f"FAIL: {x} | the cat has pink ears | say white ears" if x.endswith("-b.png")
                             else f"PASS: {x}" for x in names) + "\nVERDICT: FAIL\n"
        if verdict == "FAIL:?":
            return "FAIL: some-other-file.png | wrong subject | name it\nVERDICT: FAIL\n"
        return "I opened every image.\n"                    # "NONE": no verdict line

    def progress(self):
        return json.loads((self.dir / "progress.json").read_text(encoding="utf-8"))

    def built(self, n):
        row = next(c for c in self.progress()["clips"] if c["n"] == n)
        return row["phase"] == "7-built" and "PASS" in row.get("gate", "")

    def mark_built(self, n):
        with self.lock:
            p = self.progress()
            for c in p["clips"]:
                if c["n"] == n:
                    c["phase"], c["gate"] = "7-built", "PASS (fake builder)"
            (self.dir / "progress.json").write_text(json.dumps(p, indent=2), encoding="utf-8")

    # ── event log ──
    def _mark(self, n, kind, edge):
        with self.lock:
            self.events.append((time.perf_counter() - self.t0, n, kind, edge))
            if edge == "+":
                self.calls[n].append(kind)

    def violate(self, msg):
        with self.lock:
            self.violations.append(msg)

    # ── the fakes ──
    def spawn(self, state, node, agent, prompt, log_name, marker=None):
        n = int(re.search(r"clip (\d+) `", prompt).group(1))
        kind = {"visual-qa": "qa", "image-gen": "fix"}.get(agent) or ("plan" if "STAGE 1 of 2" in prompt else "build")
        s = self.sc[n]
        self._mark(n, kind, "+")
        try:
            self.prompts[n][kind] = prompt
            REAL_SLEEP(s.get(f"t_{kind}", 0.03))
            if kind == "plan":
                if s.get("plan") == "raise":
                    raise RuntimeError("plan agent crashed")
                if s.get("plan") == "bad":
                    return 1, "I could not write the plan."
                self._write_plan(n)
                return 0, '{"broll_plan": "x", "broll_list": "y", "images": 3}'
            if kind == "qa":
                with self.lock:
                    rnd = self.qa_round[n]
                    self.qa_round[n] += 1
                verdicts = s.get("qa", ["PASS"])
                return 0, self.qa_text(n, verdicts[min(rnd, len(verdicts) - 1)])
            if kind == "fix":
                if "Do NOT run any generator" not in prompt:
                    self.violate(f"clip {n}: the fix agent was not told to leave the generator alone")
                lst = json.loads(self.list_path(n).read_text(encoding="utf-8"))
                for it in lst:
                    if not Path(it["file"]).exists():            # moved aside by the graph = failed
                        it["prompt"] += " (fixed: white ears)"
                self.list_path(n).write_text(json.dumps(lst, indent=2), encoding="utf-8")
                return 0, "{}"
            if s.get("build") == "raise":
                raise RuntimeError("builder crashed")
            if s.get("build") == "crash_once" and not s.get("_crashed"):
                s["_crashed"] = True
                raise ProcessCrash()                             # the whole run dies, like a killed process
            if s.get("build", "pass") in ("pass", "crash_once"):     # crash_once builds on its second call
                self.mark_built(n)
            return 0, "built"
        finally:
            self._mark(n, kind, "-")

    def gen(self, state, node, c, n_missing, marker=None):
        n = c["n"]
        s = self.sc[n]
        with self.lock:
            if self.lock_holder is None:
                self.violate(f"clip {n}: the generator ran without the chatgpt lock")
            self.gen_order.append((n, "fix" in self.calls[n]))
        self._mark(n, "gen", "+")
        try:
            REAL_SLEEP(s.get("t_gen", 0.03))
            if s.get("gen", "ok") == "ok":
                for it in json.loads(self.list_path(n).read_text(encoding="utf-8")):
                    if not Path(it["file"]).exists():
                        Path(it["file"]).write_bytes(b"png")
            return 0
        finally:
            self._mark(n, "gen", "-")

    def stage_lock(self, action, stage, owner):
        with self.lock:
            self.lock_log.append((action, stage, owner))
            if stage == "chatgpt" and action == "acquire":
                if self.lock_holder is not None:
                    self.violate(f"{owner} took the chatgpt lock while {self.lock_holder} held it")
                self.lock_holder = owner
            elif stage == "chatgpt" and action == "release":
                if self.lock_holder != owner:
                    self.violate(f"{owner} released the chatgpt lock held by {self.lock_holder}")
                self.lock_holder = None
        return 0

    def pid_alive(self, pid):
        for n, s in self.sc.items():
            if s.get("marker") == pid:
                if not s.get("marker_live"):
                    return False
                with self.lock:
                    self.pid_polls += 1
                    if self.pid_polls < 3:
                        return True
                    if not self.built(n):
                        self.mark_built(n)                       # the outside builder finished its short
                    return False
        return False

    # ── analysis: overlaps are counted in the ORDER the events were logged (under one lock), never by
    # timestamp, so two events a clock tick apart are never mistaken for overlapping ──
    def max_overlap(self, kinds):
        cur = peak = 0
        for _, _, kind, edge in self.events:
            if kind in kinds:
                cur += 1 if edge == "+" else -1
                peak = max(peak, cur)
        return peak

    def prep_peak(self):
        """The most shorts inside steps 1-3 at once: a short is inside from its first step-1-3 call
        starting to its last one ending."""
        win = {}
        for i, (_, n, kind, _) in enumerate(self.events):
            if kind in PREP_KINDS:
                a, b = win.get(n, (i, i))
                win[n] = (min(a, i), max(b, i))
        return max((sum(1 for a, b in win.values() if a <= i <= b) for i, _ in win.values()), default=0)

    def first(self, n, kind, edge):
        return next((t for t, c, k, e in self.events if c == n and k == kind and e == edge), None)

    def last(self, n, kind, edge):
        ts = [t for t, c, k, e in self.events if c == n and k == kind and e == edge]
        return ts[-1] if ts else None


class ProcessCrash(BaseException):
    """Not an Exception, so no node catches it: it ends the whole graph run, as a killed process would."""


FAST_TIME = types.SimpleNamespace(sleep=lambda s: REAL_SLEEP(min(s, 0.01)), monotonic=time.monotonic,
                                  time=time.time, perf_counter=time.perf_counter)


def run(world: World, app=None, thread="t1", checkpointer=None, resume=False):
    """Drive the real batch graph from the end of lane2_finish up to lane2_publish. `resume` = pick
    the thread up from its last checkpoint (`run.py batch --resume` with no gate), no new input."""
    bg.SHORTS = world.root
    bg.DATA = world.root / "_data"
    bg.DATA.mkdir(exist_ok=True)
    bg.spawn_agent = world.spawn
    bg._run_generator = world.gen
    bg._stage_lock = world.stage_lock
    bg._beat = lambda *a, **k: None
    bg.pid_alive = world.pid_alive
    bg.CHATGPT_TURNS = bg.ChatGPTTurns()
    bg.time = FAST_TIME
    app = app or bg.build_batch_graph(checkpointer=checkpointer or MemorySaver())
    cfg = {"configurable": {"thread_id": thread}, "recursion_limit": 200}
    if not resume:
        app.update_state(cfg, {"batch": world.batch, "until": "", "stub": world.stub, "status": "running",
                               "steps": {}, "approve": [], "max_prep": world.prep, "max_builders": world.builds,
                               "build_clips": world.scope}, as_node="lane2_finish")
    box = {}

    def go():
        try:
            box["out"] = app.invoke(None, cfg, interrupt_before=["lane2_publish", "join_lane3"])
        except BaseException as e:                           # noqa: BLE001 (ProcessCrash too)
            box["exc"] = e

    th = threading.Thread(target=go, daemon=True)
    th.start()
    th.join(CASE_TIMEOUT_S)
    if th.is_alive():
        return {"__hung__": True}, app
    if "exc" in box:
        return {"__exc__": repr(box["exc"])}, app
    return box["out"], app


def step_of(out):
    return ((out.get("steps") or {}).get("lane2_build") or {})


def ok_run(out):
    return not out.get("__hung__") and not out.get("__exc__") and out.get("status") != "failed" \
        and step_of(out).get("status") in ("ran", "skipped", "stub")


def failed_run(out):
    return not out.get("__hung__") and not out.get("__exc__") and out.get("status") == "failed" \
        and step_of(out).get("status") == "failed"


def report_clean(w, label):
    """No fake saw a rule broken, and every chatgpt lock taken was released."""
    acquires = sum(1 for a, s, _ in w.lock_log if s == "chatgpt" and a == "acquire")
    releases = sum(1 for a, s, _ in w.lock_log if s == "chatgpt" and a == "release")
    report(not w.violations and acquires == releases and w.lock_holder is None, label,
           {"violations": w.violations, "acquires": acquires, "releases": releases})


NOTE = "NOTE FROM THE GRAPH"


def main():
    base = Path(tempfile.mkdtemp(prefix="check-lane2-build-"))
    k = [0]

    def world(clips, **kw):
        k[0] += 1
        return World(base / f"c{k[0]}", f"tb{k[0]}", clips, **kw)

    try:
        print("== the 4 steps, one short")
        w = world({1: {}})
        out, _ = run(w)
        report(ok_run(out), "a clean short: the step reports ran", step_of(out) or out)
        report(w.calls[1] == ["plan", "gen", "qa", "build"], "plan -> images -> image check -> build, in order",
               w.calls[1])
        report(w.built(1), "the short ends 7-built PASS")
        report(NOTE not in w.prompts[1].get("build", ""), "a short whose images passed gets no note")
        report_clean(w, "the generator ran only under the chatgpt lock, taken and released once")

        print("== the image check loop (evaluator-optimizer, at most 2 rounds)")
        w = world({1: {"qa": ["FAIL:b", "PASS"]}})
        out, _ = run(w)
        report(ok_run(out), "FAIL then PASS: the step reports ran", step_of(out) or out)
        report(w.calls[1] == ["plan", "gen", "qa", "fix", "gen", "qa", "build"],
               "a FAIL: fix the prompts, remake, check again, then build", w.calls[1])
        report((w.dir / "clip-1" / "_qa" / "rejected" / "broll-t1-b.rejected-2.png").is_file(),
               "the failed image is moved aside for the round-2 remake, never deleted",
               [p.name for p in (w.dir / "clip-1").rglob("*.png")])
        report(w.gen_order == [(1, False), (1, True)], "the second generator run is the remake", w.gen_order)
        first_line = w.report_path(1).read_text(encoding="utf-8").splitlines()[0]
        report("round 2" in first_line, "the check's report records round 2", first_line)
        report(NOTE not in w.prompts[1].get("build", ""), "passed on round 2: no note to the builder")
        report_clean(w, "the lock was taken and released for both runs")

        w = world({1: {"qa": ["FAIL:b", "FAIL:b"]}})
        out, _ = run(w)
        report(w.calls[1] == ["plan", "gen", "qa", "fix", "gen", "qa", "build"],
               "FAIL twice: exactly 2 rounds, never a third", w.calls[1])
        report("after 2 image round(s) the image check ended FAIL" in w.prompts[1].get("build", ""),
               "the builder is told the check ended FAIL and to remap", w.prompts[1].get("build", "")[-300:])
        report(ok_run(out) and w.built(1), "the short is still built")

        w = world({1: {"qa": ["FAIL:?"]}})
        out, _ = run(w)
        report(w.calls[1] == ["plan", "gen", "qa", "build"],
               "a FAIL naming no worklist file: no blind regeneration", w.calls[1])
        report(NOTE in w.prompts[1].get("build", ""), "and the builder gets the note")

        w = world({1: {"qa": ["NONE"]}})
        out, _ = run(w)
        report(w.calls[1] == ["plan", "gen", "qa", "build"], "a check with no verdict: no regeneration", w.calls[1])
        report("with no verdict" in w.prompts[1].get("build", ""), "and the note says there was no verdict")

        w = world({1: {"images": 0}})
        out, _ = run(w)
        report(ok_run(out) and w.calls[1] == ["plan", "build"],
               "an empty worklist (exempt clip): no images, no check", w.calls[1])

        print("== resume from disk")
        w = world({1: {"disk_plan": True}})
        out, _ = run(w)
        report(w.calls[1] == ["gen", "qa", "build"], "a plan on disk is not planned again", w.calls[1])

        w = world({1: {"disk_report": (1, "PASS"), "disk_images": True}})
        out, _ = run(w)
        report(ok_run(out) and w.calls[1] == ["build"], "a passed check on disk goes straight to build", w.calls[1])
        report(NOTE not in w.prompts[1].get("build", ""), "and gets no note")

        w = world({1: {"disk_report": (1, "FAIL:b"), "disk_images": True, "qa": ["PASS"]}})
        out, _ = run(w)
        report(w.calls[1] == ["fix", "gen", "qa", "build"],
               "a failed round 1 on disk resumes AT the fix round, no second look first", w.calls[1])
        report("round 2" in w.report_path(1).read_text(encoding="utf-8").splitlines()[0],
               "and the new report is round 2")
        report(w.gen_order == [(1, True)], "the resumed generator run is a remake", w.gen_order)

        w = world({1: {"disk_report": (2, "FAIL:b"), "disk_images": True}})
        out, _ = run(w)
        report(w.calls[1] == ["build"], "a failed round 2 on disk: no more rounds", w.calls[1])
        report("after 2 image round(s) the image check ended FAIL" in w.prompts[1].get("build", ""),
               "and the builder is told to remap")

        print("== one short failing never stops the others")
        w = world({1: {}, 2: {"plan": "bad"}, 3: {}})
        out, _ = run(w)
        report(failed_run(out), "a bad plan: the step fails", step_of(out) or out)
        err = str(out.get("error") or "")
        report("clip 2:" in err and "clip-2" in err and "left no valid BROLL-PLAN.md" in err,
               "the error names the short and why", err)
        report(w.calls[2] == ["plan"], "the short with the bad plan goes no further", w.calls[2])
        report(w.built(1) and w.built(3), "the other shorts are built")

        w = world({1: {"plan": "raise"}, 2: {}})
        out, _ = run(w)
        err = str(out.get("error") or "")
        report(failed_run(out) and "clip 1: RuntimeError: plan agent crashed" in err,
               "a crashed plan agent is recorded as that short's error", err or out)
        report(w.built(2), "and the other short is built")

        w = world({1: {"gen": "none"}, 2: {}})
        out, _ = run(w)
        err = str(out.get("error") or "")
        report(failed_run(out) and "clip 1:" in err and "the generator produced none" in err,
               "no images made: that short fails", err or out)
        report(w.calls[1] == ["plan", "gen"], "and is neither checked nor built", w.calls[1])
        report_clean(w, "the lock is released after the failed run")
        report(w.built(2), "the other short is built")

        w = world({1: {"build": "raise"}, 2: {}})
        out, _ = run(w)
        err = str(out.get("error") or "")
        report(failed_run(out) and "clip 1: RuntimeError: builder crashed" in err,
               "a crashed builder is recorded as that short's error", err or out)
        report(w.built(2), "and the other short is built")

        w = world({1: {"build": "fail"}, 2: {}})
        out, _ = run(w)
        err = str(out.get("error") or "")
        report(failed_run(out) and "clip-1" in err and "not 7-built PASS" in err,
               "a builder that never reaches 7-built PASS fails the step, verified from disk", err or out)

        print("== already built, outside builders, scope, stub")
        w = world({1: {"phase": "7-built", "gate": "PASS"},
                   2: {"marker": 424242, "marker_live": True},
                   3: {"marker": 434343, "marker_live": False}})
        out, _ = run(w)
        report(ok_run(out), "built + outside builder + stale marker: the step reports ran", step_of(out) or out)
        report(w.calls[1] == [], "a short already built is skipped", w.calls[1])
        report(w.calls[2] == [] and w.pid_polls >= 3 and w.built(2),
               "a live outside builder is waited for, never spawned again", (w.calls[2], w.pid_polls))
        report(not (w.dir / "clip-3" / ".building.pid").exists() and w.calls[3] == ["plan", "gen", "qa", "build"],
               "a stale marker is cleared and that short is built", w.calls[3])
        report("1 awaited" in step_of(out).get("detail", ""), "the step says it awaited one",
               step_of(out).get("detail"))

        w = world({1: {}, 2: {}, 3: {}}, scope=[2])
        out, _ = run(w)
        report(ok_run(out) and w.calls[1] == [] and w.calls[3] == [] and w.built(2) and not w.built(1),
               "--clips 2 builds only clip 2 and holds the others", w.calls)

        w = world({1: {"phase": "7-built", "gate": "PASS"}, 2: {"phase": "7-built", "gate": "PASS"}})
        out, _ = run(w)
        report(ok_run(out) and step_of(out).get("status") == "skipped" and not any(w.calls.values()),
               "nothing left to build: the step is skipped", step_of(out))

        w = world({1: {}}, stub="ok")
        out, _ = run(w)
        report(ok_run(out) and step_of(out).get("status") == "stub" and w.calls[1] == [],
               "stub mode runs nothing", step_of(out))

        print("== scheduling (6 shorts, --max-prep 3, --max-builders 2, the SQLite checkpointer run.py uses)")
        clips = {n: {"t_plan": 0.04 * n, "t_gen": 0.06, "t_qa": 0.03, "t_build": 0.5} for n in range(1, 7)}
        w = world(clips, prep=3, builds=2)
        conn = sqlite3.connect(str(w.root / "checkpoints.sqlite"), check_same_thread=False)
        t0 = time.monotonic()
        out, _ = run(w, checkpointer=SqliteSaver(conn))
        took = time.monotonic() - t0
        report(ok_run(out) and all(w.built(n) for n in clips), "every short is built", step_of(out) or out)
        report(w.max_overlap({"build"}) == 2, "never more than 2 builds, and 2 do run at once",
               w.max_overlap({"build"}))
        report(w.max_overlap({"gen"}) == 1, "the ChatGPT browser runs one clip at a time", w.max_overlap({"gen"}))
        report(w.prep_peak() == 3, "never more than 3 shorts in steps 1-3 at once, and 3 do run", w.prep_peak())
        firsts = sorted((w.last(n, "qa", "-"), n) for n in clips)
        t_ready, n_ready = firsts[0]
        report(w.first(n_ready, "build", "+") - t_ready < 0.25,
               "the first short to pass its check starts building at once",
               w.first(n_ready, "build", "+") - t_ready)
        overlap = any(w.first(m, "build", "+") < t < w.last(m, "build", "-")
                      for m in clips for t, n, kind, e in w.events if kind in PREP_KINDS and e == "+" and n != m)
        report(overlap, "other shorts keep planning and making images while builds run")
        report_clean(w, "the lock was balanced across all 6 shorts")
        conn.close()
        print(f"      (6 shorts took {took:.1f} s)")

        print("== a short waiting for the ChatGPT browser keeps its slot (--max-prep 2, 3 shorts)")
        w = world({n: {"t_plan": 0.02, "t_gen": 0.4, "t_qa": 0.02, "t_build": 0.05} for n in (1, 2, 3)}, prep=2)
        out, _ = run(w)
        report(ok_run(out) and w.prep_peak() == 2,
               "while one short makes images and one waits for the browser, the third does not plan",
               w.prep_peak())

        print("== a crash in the middle of the build step, resumed from the checkpoint")
        w = world({1: {}, 2: {"t_plan": 0.4, "build": "crash_once"}})
        conn = sqlite3.connect(str(w.root / "checkpoints.sqlite"), check_same_thread=False)
        out, app = run(w, checkpointer=SqliteSaver(conn), thread="crash")
        report("ProcessCrash" in str(out.get("__exc__")), "the run dies when clip 2's builder is killed", out)
        report(w.built(1) and not w.built(2), "clip 1 finished before the crash, clip 2 did not")
        done = {n: list(v) for n, v in w.calls.items()}
        out2, _ = run(w, app=app, thread="crash", resume=True)
        report(ok_run(out2) and w.built(2), "resumed with no new input: the step reports ran", step_of(out2) or out2)
        report(w.calls[1] == done[1], "the finished short is not run again", w.calls[1])
        report(w.calls[2][len(done[2]):] == ["build"], "clip 2 resumes at its build, not its plan",
               w.calls[2][len(done[2]):])
        report_clean(w, "the lock was balanced across the crash")
        conn.close()

        print("== a remake goes before a first round")
        w = world({1: {"t_plan": 0.02, "t_gen": 0.1, "qa": ["FAIL:b", "PASS"], "t_qa": 0.03, "t_fix": 0.03},
                   2: {"t_plan": 0.04, "t_gen": 1.0},
                   3: {"t_plan": 0.08, "t_gen": 0.03}}, prep=4)
        out, _ = run(w)
        report(ok_run(out), "the step reports ran", step_of(out) or out)
        report(w.gen_order == [(1, False), (2, False), (1, True), (3, False)],
               "clip 1's remake runs before clip 3's first round, which was waiting longer", w.gen_order)

        print("== a re-drive on the same thread")
        w = world({1: {"plan": "bad"}, 2: {}})
        out, app = run(w, thread="redrive")
        report(failed_run(out), "first run: the bad plan fails the step", step_of(out) or out)
        w.sc[1].update(plan="write", build="fail")
        out2, _ = run(w, app=app, thread="redrive")
        err2 = str(out2.get("error") or "")
        report(failed_run(out2) and "clip-1" in err2 and "left no valid BROLL-PLAN.md" not in err2,
               "second run fails for its OWN reason, not the first run's", err2 or out2)
        w.sc[1]["build"] = "pass"
        before = list(w.calls[2])
        out3, _ = run(w, app=app, thread="redrive")
        report(ok_run(out3), "third run on the same thread: the step reports ran, no stale failure",
               step_of(out3) or out3)
        report(w.built(1) and w.calls[2] == before, "it builds the repaired short and leaves the built one alone",
               w.calls)
    finally:
        shutil.rmtree(base, ignore_errors=True)

    print("\n" + ("ALL PASS" if not fails else f"{len(fails)} FAILED:\n  - " + "\n  - ".join(fails)))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
