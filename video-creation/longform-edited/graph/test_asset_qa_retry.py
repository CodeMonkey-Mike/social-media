"""Proves the asset visual-qa retry guarantees with FAKE agents (no claude, no Envato, no ffmpeg):

  1. short s_variants NEVER fails the run on a variant: a slot that fails visual-qa is moved aside and re-sourced with the
     verdict as feedback, and after VARIANT_ROUNDS it is AUTO-WAIVED (the longform's own asset stays) so the short still renders.
  2. a PASS carries over (passed files are never re-judged), an IMAGE FAIL counts (the raw-name match dropped it).
  3. the shared helpers the longform `assets` and vertical `v_assets` nodes use: a FAIL file is moved aside so the supervisor's
     re-drive rebuilds only that id (left in place, the re-drive re-judged the same file and failed identically).

Why: only-18-months-left, 2026-10-27. One Envato slot failed visual-qa three times, the no-op re-drive changed nothing, and the
short sat failed overnight instead of being delivered. Run: python test_asset_qa_retry.py  (exit 0 = every check passed).
"""
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402
import longform_graph as G  # noqa: E402
import short_graph as S  # noqa: E402

FAILS = []


def check(name, ok, detail=""):
    print(("PASS  " if ok else "FAIL  ") + name + (f"  ({detail})" if detail and not ok else ""))
    if not ok:
        FAILS.append(name)


def make_project(root: Path) -> Path:
    proj = root / "proj"
    (proj / "assets" / "short").mkdir(parents=True)
    plan = {"spans": [{"order": 1, "start": 0.0, "end": 10.0}]}
    (proj / "SHORT-CUT-PLAN.snapped.json").write_text(json.dumps(plan), encoding="utf-8")
    return proj


HITS = [{"id": "BR-1", "kind": "envato-video", "a": 1.0, "b": 4.0, "spoken": "", "what": "fog over an empty city street (BR-1)"},
        {"id": "IMG-1", "kind": "chatgpt-image", "a": 5.0, "b": 8.0, "spoken": "", "what": "an empty writer's desk (IMG-1)"}]


class Fakes:
    """policy[(slot_id, attempt)] -> 'PASS' | 'FAIL' | 'NOFILE'; attempt counts per slot from 1."""

    def __init__(self, proj, policy):
        self.proj, self.policy = proj, policy
        self.attempt = {}
        self.qa_calls = []      # list of the file names each visual-qa call was asked to judge
        self.prompts = []

    def spawn_agents_parallel(self, state, node, specs):
        for builder, prompt, _log in specs:
            self.prompts.append(prompt)
            for h in HITS:
                if f"- {h['id']}:" not in prompt:
                    continue
                n = self.attempt[h["id"]] = self.attempt.get(h["id"], 0) + 1
                if self.policy.get((h["id"], n)) == "NOFILE":
                    continue
                sub, ext = ("vid", ".mp4") if h["kind"] == "envato-video" else ("img", ".png")
                f = self.proj / "assets" / "short" / sub / f"{h['id']}-try{n}{ext}"
                f.parent.mkdir(parents=True, exist_ok=True)
                f.write_bytes(b"x")
        return {b: (0, "") for b, _, _ in specs}

    def spawn_agent(self, state, node, agent, prompt, log):
        names = [ln.split("`")[1] for ln in prompt.splitlines() if ln.startswith("- `")]
        self.qa_calls.append([Path(n).name for n in names])
        dest = Path(prompt.split("EXACTLY `")[1].split("`")[0])
        out = []
        for n in names:
            stem = G._qa_stem(n)
            sid = "BR-1" if stem.startswith("BR-1") else "IMG-1"
            tryn = int(stem.rsplit("try", 1)[1])
            v = self.policy.get((sid, tryn), "PASS")
            out.append({"path": n, "verdict": "PASS" if v == "PASS" else "FAIL",
                        "defects": [] if v == "PASS" else [f"{stem} is off concept"], "fix": "pick another"})
        dest.write_text(json.dumps({"assets": out}), encoding="utf-8")
        return 0, ""


def run_variants(proj, fakes):
    S._cover_windows_final = lambda p, scope: [dict(h) for h in HITS]
    C.spawn_agents_parallel = fakes.spawn_agents_parallel
    C.spawn_agent = fakes.spawn_agent
    G._mid_frame = lambda f, dest: (dest.parent.mkdir(parents=True, exist_ok=True), dest.write_bytes(b"x"), dest)[-1]
    C._fail = lambda state, node, msg, out="": {"status": "failed", "error": f"{node}: {msg}"}
    C._step = lambda state, node, status, detail="": [{"node": node, "status": status, "detail": detail}]
    return S.s_variants({"project_dir": str(proj), "scope": "ALL"})


def scenario_auto_waive():
    with tempfile.TemporaryDirectory() as td:
        proj = make_project(Path(td))
        fk = Fakes(proj, {("BR-1", 1): "FAIL", ("BR-1", 2): "FAIL", ("IMG-1", 1): "PASS"})
        res = run_variants(proj, fk)
        step = (res.get("steps") or [{}])[-1]
        check("auto-waive: the node does NOT fail when a slot fails every round", res.get("status") != "failed" and step.get("status") == "ran",
              json.dumps(res)[:300])
        wv = json.loads((proj / "assets" / "short" / "variant-waivers.json").read_text(encoding="utf-8"))
        check("auto-waive: the failing slot is recorded as AUTO-WAIVED, with the real reason",
              str(wv.get("BR-1", "")).startswith("AUTO-WAIVED") and "visual-qa FAILED 2 attempt(s)" in wv.get("BR-1", ""), str(wv))
        var = json.loads((proj / "assets" / "short" / "variants.json").read_text(encoding="utf-8"))["variants"]
        check("auto-waive: the passing slot still ships its variant", [v["id"] for v in var] == ["IMG-1"], str(var))
        rej = sorted(p.name for p in (proj / "_previews" / "short" / "qa" / "rejected").iterdir())
        check("auto-waive: both failing BR-1 files were moved aside", rej == ["BR-1-try1.mp4", "BR-1-try2.mp4"], str(rej))
        check("auto-waive: round 2 re-judged ONLY the re-sourced slot (the IMG-1 PASS carried over)",
              len(fk.qa_calls) == 2 and fk.qa_calls[1] == ["BR-1-try2.mid.png"], str(fk.qa_calls))
        check("auto-waive: the round-2 sourcer was told why round 1 failed",
              any("EARLIER ATTEMPTS FAILED" in p and "BR-1-try1 is off concept" in p for p in fk.prompts[1:]), fk.prompts[-1][-400:])
        check("auto-waive: the step message names the waived slot", "AUTO-WAIVED" in step.get("detail", "") and "BR-1" in step.get("detail", ""),
              step.get("detail", ""))
        # a second invocation (a re-drive) does nothing new: the waiver holds, the PASS carries, no agent runs
        fk2 = Fakes(proj, {})
        res2 = run_variants(proj, fk2)
        check("re-run: nothing re-sourced, nothing re-judged", not fk2.prompts and not fk2.qa_calls and res2.get("status") != "failed",
              f"{fk2.prompts} {fk2.qa_calls}")


def scenario_second_round_passes():
    with tempfile.TemporaryDirectory() as td:
        proj = make_project(Path(td))
        fk = Fakes(proj, {("BR-1", 1): "FAIL", ("BR-1", 2): "PASS", ("IMG-1", 1): "FAIL", ("IMG-1", 2): "PASS"})
        res = run_variants(proj, fk)
        var = json.loads((proj / "assets" / "short" / "variants.json").read_text(encoding="utf-8"))["variants"]
        check("round 2 fixes it: both slots ship their variant, no waiver",
              res.get("status") != "failed" and sorted(v["id"] for v in var) == ["BR-1", "IMG-1"]
              and not (proj / "assets" / "short" / "variant-waivers.json").exists(), json.dumps(res)[:300])
        check("an IMAGE FAIL counts (it was silently ignored before)",
              (proj / "_previews" / "short" / "qa" / "rejected" / "IMG-1-try1.png").is_file())


def scenario_no_file():
    with tempfile.TemporaryDirectory() as td:
        proj = make_project(Path(td))
        fk = Fakes(proj, {("BR-1", 1): "NOFILE", ("BR-1", 2): "NOFILE", ("IMG-1", 1): "PASS"})
        res = run_variants(proj, fk)
        wv = json.loads((proj / "assets" / "short" / "variant-waivers.json").read_text(encoding="utf-8"))
        check("a sourcer that produces nothing: waived, the run goes on",
              res.get("status") != "failed" and "no file produced" in wv.get("BR-1", ""), json.dumps(res)[:300])


def scenario_shared_helpers():
    check("_qa_stem: clip frame", G._qa_stem("x/qa/BR-1-fog.mid.png") == "BR-1-fog")
    check("_qa_stem: image", G._qa_stem("x/img/IMG-3-desk.png") == "IMG-3-desk")
    check("_qa_names_id", G._qa_names_id("IMG-3", "IMG-3") and G._qa_names_id("IMG-3-desk", "IMG-3") and not G._qa_names_id("IMG-30", "IMG-3"))
    with tempfile.TemporaryDirectory() as td:
        d = Path(td)
        vid, img, ok = d / "BR-2.mp4", d / "IMG-4.png", d / "IMG-5.png"
        for f in (vid, img, ok):
            f.write_bytes(b"x")
        frame = d / "qa" / "BR-2.mid.png"
        fails = [{"path": str(frame), "verdict": "FAIL"}, {"path": "assets/vertical/img/IMG-4.png", "verdict": "FAIL"}]
        moved = G._reject_qa_fails(fails, [(vid, frame), (img, img), (ok, ok)], d / "rejected")
        check("_reject_qa_fails: moves the failing clip (judged by its frame) and image, keeps the PASS",
              sorted(moved) == ["BR-2.mp4", "IMG-4.png"] and ok.is_file() and not vid.exists() and not img.exists(), str(moved))
        vid.write_bytes(b"y")
        G._reject_qa_fails([{"path": str(frame), "verdict": "FAIL"}], [(vid, frame)], d / "rejected")
        check("_reject_qa_fails: a second reject of the same name never overwrites the first", (d / "rejected" / "BR-2.try2.mp4").is_file())


if __name__ == "__main__":
    scenario_auto_waive()
    scenario_second_round_passes()
    scenario_no_file()
    scenario_shared_helpers()
    print(f"\n{'ALL PASS' if not FAILS else f'{len(FAILS)} FAILED'}")
    sys.exit(1 if FAILS else 0)
