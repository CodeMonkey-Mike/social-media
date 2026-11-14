"""Proves the eval score layer's matching and scoring math on made-up clips (no claude, no real record).

Everything is written to a temp folder: the real evals/ folder is never touched.
Run: python test_clip_evals.py   (exit 0 = every check passed)
"""
import json
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import clip_evals as ce  # noqa: E402

FAILS = []


def check(name, ok, detail=""):
    print(("PASS  " if ok else "FAIL  ") + name + (f"  ({detail})" if detail and not ok else ""))
    if not ok:
        FAILS.append(name)


def clip(cid, slug, *segs):
    return {"clip_id": cid, "slug": slug, "title": slug, "variant": "full",
            "segments": [{"start": a, "end": b, "why": "x"} for a, b in segs]}


def main() -> int:
    tmp = Path(tempfile.mkdtemp(prefix="clip-evals-test-"))
    ce.EVALS = tmp / "evals"

    # ── overlap and matching ────────────────────────────────────────────────
    check("overlap of two single segments", ce.overlap([[0, 60]], [[30, 90]]) == 30)
    check("overlap across several segments", ce.overlap([[0, 10], [100, 120]], [[5, 105]]) == 10)
    check("no overlap", ce.overlap([[0, 10]], [[10, 20]]) == 0)
    share, iou = ce.match_score([[0, 60]], [[30, 90]])
    check("match_score: share of the shorter, and IoU", share == 0.5 and abs(iou - 30 / 90) < 1e-9, f"{share} {iou}")
    long_c = {"clip_id": 1, "slug": "long", "segments": [[100, 180]], "gates": {"4b": "kept"}}
    impact = {"clip_id": 2, "slug": "impact", "segments": [[130, 150]], "gates": {"4b": "killed"}}
    check("a long pick matches the long clip, not the impact clip inside it",
          ce.best_match([[102, 178]], [long_c, impact])["clip_id"] == 1)
    check("a short pick matches the impact clip",
          ce.best_match([[131, 149]], [long_c, impact])["clip_id"] == 2)
    check("a pick somewhere else matches nothing", ce.best_match([[400, 450]], [long_c, impact]) is None)
    check("under half of the shorter clip is not a match", ce.best_match([[170, 230]], [long_c]) is None)

    # ── --missed parsing ────────────────────────────────────────────────────
    m = ce.parse_missed("12:30-14:10 the ETF rant; 45:00 kaspa hashrate; the whole Q and A")
    check("missed: a time range", m[0] == {"none": False, "start": 750.0, "end": 850.0, "note": "the ETF rant"}, str(m[0]))
    check("missed: one timestamp", m[1]["start"] == 2700.0 and m[1]["end"] is None and m[1]["note"] == "kaspa hashrate")
    check("missed: a note with no time", m[2] == {"none": False, "start": None, "end": None, "note": "the whole Q and A"})
    check("missed: hours", ce.parse_missed("1:02:03 late one")[0]["start"] == 3723.0)
    check("missed: none", ce.parse_missed("None") == [{"none": True, "start": None, "end": None, "note": None}])

    # ── the gate record: two gates, append-only, safe to repeat ─────────────
    meta = {"prompt_version": "aaaaaaaaaaaa", "model": "fable/max", "brief": None, "prompt_parts": {"agent": "x"}}
    c1, c2, c3, c4 = (clip(1, "kept-both", (0, 60)), clip(2, "killed-4b", (100, 160)),
                      clip(3, "killed-2nd", (200, 260)), clip(4, "kept-both-2", (300, 330), (500, 520)))
    after_4b = {"clips": [c1, c3, c4], "eval": meta,
                "deleted_at_gate": [{"gate": "4b", "clip_id": 2, "slug": "killed-4b", "at": "2026-01-01T10:00:00", "clip": c2}]}
    n = ce.record_gate("demo", "4b", after_4b, missed="12:30-13:30 the rant", at="2026-01-01T10:00:00")
    check("gate 4b: 3 kept, 1 killed, 1 missed", (n["kept"], n["killed"], n["missed"]) == (3, 1, 1), str(n))
    after_2nd = {"clips": [c1, c4], "eval": meta, "deleted_at_gate": after_4b["deleted_at_gate"] + [
        {"gate": "2nd", "clip_id": 3, "slug": "killed-2nd", "at": "2026-01-01T11:00:00", "clip": c3}]}
    n = ce.record_gate("demo", "2nd", after_2nd, at="2026-01-01T11:00:00")
    check("gate 2nd: 2 kept, 1 killed (the 4b kill is not judged again)", (n["kept"], n["killed"]) == (2, 1), str(n))
    size = ce.record_path().stat().st_size
    n = ce.record_gate("demo", "2nd", after_2nd)
    check("recording a gate twice writes nothing", n["already"] == 3 and ce.record_path().stat().st_size == size, str(n))
    lines = ce.read_record()
    check("8 lines: 4 at gate 4b, 3 at gate 2nd, 1 missed", len(lines) == 8, str(len(lines)))
    first = [x for x in lines if x.get("clip_id") == 2][0]
    check("a killed clip keeps its full proposal", first["verdict"] == "killed" and first["proposal"]["segments"][0]["why"] == "x")
    check("the proposal is stored once per clip", sum(1 for x in lines if x.get("clip_id") == 1 and x.get("proposal")) == 1)
    check("every line carries the prompt version", all(x.get("prompt_version") == "aaaaaaaaaaaa" for x in lines if x["type"] == "verdict"))
    check("the file is one JSON object per line", all(json.loads(r) for r in ce.record_path().read_text(encoding="utf-8").splitlines()))

    # ── the score from the record ───────────────────────────────────────────
    row = ce.score_record(lines)["rows"][0]
    check("selection precision = kept at 4b / judged at 4b = 3/4", row["selection_precision"] == 75.0, str(row))
    check("final precision = kept at 2nd / judged = 2/4", row["final_precision"] == 50.0, str(row))
    check("recall = kept / (kept + missed) = 3/4", row["recall"] == 75.0 and row["recall_batches"] == 1, str(row))

    # a batch with no miss review has no recall; an unmatched kill leaves its batch out of the score
    ce.record_gate("other", "4b", {"clips": [clip(1, "a", (0, 30))], "eval": meta})
    ce.record_gate("old", "4b", {"clips": [], "deleted_at_gate": [{"gate": "4b", "clip_id": 6, "slug": None}]})
    rec = ce.score_record(ce.read_record())
    row = [r for r in rec["rows"] if r["prompt_version"] == "aaaaaaaaaaaa"][0]
    check("recall only counts the batches that were reviewed for misses", row["recall_batches"] == 1 and row["judged"] == 5, str(row))
    check("a kill with no proposal is left out of the score", rec["left_out_batches"] == ["old"] and len(rec["rows"]) == 1, str(rec))

    # ── a replay against the record ─────────────────────────────────────────
    ce.replays_dir().mkdir(parents=True)
    replay = {"v": 1, "batch": "demo", "prompt_version": "bbbbbbbbbbbb", "model": "fable/max", "plan": {"clips": [
        clip(1, "same-as-kept", (2, 58)),            # matches kept clip 1
        clip(2, "the-killed-one-again", (105, 158)),  # re-picks killed clip 2
        clip(3, "the-rant", (760, 800)),              # finds the recorded miss (12:30-13:30)
        clip(4, "brand-new", (900, 950)),             # no verdict on record
        clip(5, "edit-kill", (201, 259)),             # clip 3 was kept at 4b, killed at 2nd: the CHOICE was fine
    ]}}
    (ce.replays_dir() / "demo--bbbbbbbbbbbb--r1.json").write_text(json.dumps(replay), encoding="utf-8")
    rep = ce.score_replays(ce.read_record())
    r = rep["replays"][0]
    check("replay: 2 match a kept clip, 1 re-picks a kill, 1 finds a miss, 1 is new",
          (r["hit"], r["bad"], r["found_miss"], r["unjudged"]) == (2, 1, 1, 1), str({k: r[k] for k in ("hit", "bad", "found_miss", "unjudged")}))
    g = rep["rows"][0]
    check("replay precision on judged picks = 3 good / 4", g["precision_on_judged"] == 75.0, str(g))
    check("replay: 2 of 3 kept clips found again, 1 of 1 kill re-picked",
          g["kept_refound_pct"] == round(200 / 3, 1) and g["killed_repicked_pct"] == 100.0, str(g))
    check("a bad replay plan is refused", ce.check_replay_plan({"clips": [clip(1, "x", (10, 5))]}, None) is not None
          and ce.check_replay_plan({"clips": [clip(1, "x", (10, 900))]}, 600.0) is not None
          and ce.check_replay_plan(replay["plan"], 1000.0) is None)

    # ── scores.jsonl: saved once per distinct result ────────────────────────
    rec = ce.score_record(ce.read_record())
    check("a score is saved", ce.save_score(rec, rep) is True)
    check("the same score is not saved twice", ce.save_score(rec, ce.score_replays(ce.read_record())) is False)

    # ── a pick that matches a kept clip but carries a stretch of a killed one is flagged ──
    mixed = {"v": 1, "batch": "demo", "prompt_version": "cccccccccccc", "model": "fable/max", "plan": {"clips": [
        clip(1, "kept-plus-killed-material", (0, 50), (100, 115))]}}
    (ce.replays_dir() / "demo--cccccccccccc--r1.json").write_text(json.dumps(mixed), encoding="utf-8")
    r = [x for x in ce.score_replays(ce.read_record())["replays"] if x["prompt_version"] == "cccccccccccc"][0]
    check("a pick matching a kept clip that reuses 15 s of a killed one still counts as kept, and is flagged",
          r["hit"] == 1 and r["bad"] == 0 and r["reuses_killed"] == 1
          and r["detail"][0]["reuses_killed"] == [{"clip_id": 2, "seconds": 15.0}], str(r["detail"]))

    # ── run-to-run noise: the same prompt, twice, on one batch ──────────────
    a, b2, c5 = clip(1, "a", (0, 60)), clip(2, "b", (100, 160)), clip(3, "c", (300, 360))
    ce.record_gate("noisy", "4b", {"clips": [a], "eval": meta,
                                   "deleted_at_gate": [{"gate": "4b", "clip_id": 2, "slug": "b", "clip": b2}]})
    for n, picks in ((1, [a, b2]), (2, [clip(1, "a-again", (5, 58)), c5])):
        (ce.replays_dir() / f"noisy--dddddddddddd--r{n}.json").write_text(json.dumps(
            {"v": 1, "batch": "noisy", "prompt_version": "dddddddddddd", "model": "fable/max",
             "plan": {"clips": picks}}), encoding="utf-8")
    lines2 = ce.read_record()
    noise = ce.noise_table(ce.load_replays(), ce.score_replays(lines2)["replays"])
    row = [x for x in noise if x["batch"] == "noisy"]
    check("noise: one row per batch replayed more than once (single replays are left out)",
          len(noise) == 1 and len(row) == 1, str(noise))
    check("noise: 1 of 2 picks is shared between the runs = 50% agreement", row and row[0]["agreement"] == 50.0, str(row))
    check("noise: precision per run 50% and 100%, a 50 point spread",
          row and row[0]["precisions"] == [50.0, 100.0] and row[0]["precision_spread"] == 50.0, str(row))

    one = {"plan": {"clips": [clip(1, "long", (100, 180))]}}
    two = {"plan": {"clips": [clip(1, "long-again", (102, 178)), clip(2, "impact-of-it", (130, 150))]}}
    check("noise: picks pair one to one, so an added impact clip counts as a difference (2 x 1 / 3 = 66.7%)",
          ce.pick_agreement(one, two) == 66.7 and ce.pick_agreement(two, one) == 66.7 and ce.pick_agreement(one, one) == 100.0,
          str(ce.pick_agreement(one, two)))

    # ── the dashboard feed ──────────────────────────────────────────────────
    feed = ce.dashboard_data()
    json.dumps(feed)                       # must be plain JSON: no sets, no tuples as keys
    demo = [x for x in feed["batches"] if x["batch"] == "demo"][0]
    check("feed: totals leave the unscorable batch out", feed["totals"]["left_out"] == ["old"]
          and feed["totals"]["batches"] == 4 and feed["totals"]["judged"] == 7, str(feed["totals"]))
    check("feed: a batch carries its clips, both gate verdicts and the strategist's reasoning",
          [c["verdicts"] for c in demo["clips"]] == [{"4b": "kept", "2nd": "kept"}, {"4b": "killed"},
                                                     {"4b": "kept", "2nd": "killed"}, {"4b": "kept", "2nd": "kept"}]
          and demo["clips"][1]["why"] == ["x"] and demo["gates"]["4b"] == {"at": "2026-01-01T10:00:00", "kept": 3, "killed": 1},
          str(demo["gates"]))
    check("feed: misses, replays and noise ride along", demo["misses_reviewed"] and len(demo["misses"]) == 1
          and demo["replays"] == 2 and len(feed["replays"]) == 4 and len(feed["noise"]) == 1
          and feed["totals"]["recall_batches"] == 1)

    # ── the prompt version ──────────────────────────────────────────────────
    a, b = ce.prompt_info("template one"), ce.prompt_info("template two")
    check("the prompt version is stable", a == ce.prompt_info("template one"))
    check("editing the instruction text changes the prompt version", a["prompt_version"] != b["prompt_version"])
    check("the agent file is part of the version", bool(a["prompt_parts"]["agent"]) and len(a["prompt_version"]) == 12)

    # ── transcripts are kept, once ──────────────────────────────────────────
    src = tmp / "src"
    src.mkdir()
    files = {}
    for k in ("chunks", "plain", "words"):
        files[k] = src / f"x_{k}.txt"
        files[k].write_text("[00:01.00]  hi\n[44:20.96]  latest\n", encoding="utf-8")
    check("3 transcript files copied", ce.save_transcripts("demo", files, 2700.4, "EXACTLY 3 clips") == 3)
    check("nothing copied the second time", ce.save_transcripts("demo", files, 1.0, None) == 0)
    meta_saved = json.loads((ce.transcripts_dir("demo") / "meta.json").read_text(encoding="utf-8"))
    check("meta keeps the length, the last word and the brief",
          meta_saved["master_seconds"] == 2700.4 and meta_saved["last_word_seconds"] == 2660.96
          and meta_saved["brief"] == "EXACTLY 3 clips", str(meta_saved))

    # ── the batch graph's own gate functions write the record ───────────────
    sys.path.insert(0, str(ce.LSR / "graph"))
    import batch_graph as bg  # noqa: E402
    bg.SHORTS, bg.DATA = tmp / "shorts", tmp / "data"
    folder = bg.SHORTS / "gate-demo"
    folder.mkdir(parents=True)
    plan = {"topics": [{"topic_id": "t", "hook_summary": "h"}], "clips": [c1, c2, c3]}
    bg.clip_plan_path("gate-demo").write_text(json.dumps(plan), encoding="utf-8")
    (folder / "progress.json").write_text(json.dumps({"clips": [{"n": 1}, {"n": 2}, {"n": 3}]}), encoding="utf-8")
    state = {"batch": "gate-demo"}
    note = bg._evals_selected(state, 2700.0, bg.DATA / "none.log", 0)
    stamped = json.loads(bg.clip_plan_path("gate-demo").read_text(encoding="utf-8"))
    check("select: the plan is stamped with the prompt version", note.startswith("evals: prompt ")
          and len(stamped["eval"]["prompt_version"]) == 12 and stamped["eval"]["model"] == ce.agent_model(), note)
    applied = bg._apply_deletes("gate-demo", "4b", [2])
    note = bg._record_gate("gate-demo", "4b", applied, "none")
    check("gate: the step detail reports the record", note == "evals: 2 kept, 1 killed, 1 missed", note)
    after = json.loads(bg.clip_plan_path("gate-demo").read_text(encoding="utf-8"))
    check("gate: clip-plan.json keeps the killed clip's full proposal",
          after["deleted_at_gate"][0]["clip"]["slug"] == "killed-4b" and len(after["clips"]) == 2)
    got = [x for x in ce.read_record() if x.get("batch") == "gate-demo"]
    killed = [x for x in got if x.get("verdict") == "killed"]
    check("gate: the record has 2 kept, 1 killed with its proposal, and a 'none missed' line",
          len(got) == 4 and len(killed) == 1 and killed[0]["proposal"]["clip_id"] == 2
          and killed[0]["prompt_version"] == stamped["eval"]["prompt_version"]
          and [x for x in got if x["type"] == "missed"][0]["none"] is True, str(len(got)))
    check("gate: progress.json still gets the approval", json.loads((folder / "progress.json").read_text(
        encoding="utf-8"))["gates"]["4b"]["deleted"] == [2])
    # the gate node itself, the way `run.py batch --resume --approve 4b --delete 2 --missed none` drives it
    flag = bg.SHORTS / "gate-flag"
    flag.mkdir()
    bg.clip_plan_path("gate-flag").write_text(json.dumps(plan), encoding="utf-8")
    (flag / "progress.json").write_text(json.dumps({"clips": [{"n": 1}, {"n": 2}, {"n": 3}]}), encoding="utf-8")
    run_state = {"batch": "gate-flag", "approve": ["4b"], "delete_4b": [2], "missed": "40:00 the big call",
                 "missed_gate": "4b", "steps": {}}
    out = bg._gate(run_state, "4b", "delete_4b")
    check("gate node (4b): deletes, records the verdicts and the miss",
          out["steps"]["gate_4b"]["detail"] == "approved via flag; deleted [2]; evals: 2 kept, 1 killed, 1 missed",
          out["steps"]["gate_4b"]["detail"])
    out = bg._gate({**run_state, "approve": ["2nd"], "delete_2nd": []}, "2nd", "delete_2nd")
    check("gate node (2nd): a miss said at 4b is not recorded again at the 2nd gate",
          out["steps"]["gate_2nd"]["detail"] == "approved via flag; deleted []; evals: 2 kept, 0 killed",
          out["steps"]["gate_2nd"]["detail"])
    out = bg._gate(run_state, "4b", "delete_4b")
    check("gate node: an approved gate is skipped on a re-drive, nothing is recorded twice",
          out["steps"]["gate_4b"]["status"] == "skipped"
          and sum(1 for x in ce.read_record() if x.get("batch") == "gate-flag") == 6)

    ce.record_path().chmod(0o444)        # a record that cannot be written must never break the batch
    try:
        applied = bg._apply_deletes("gate-demo", "2nd", [3])
        note = bg._record_gate("gate-demo", "2nd", applied)
    finally:
        ce.record_path().chmod(0o666)
    check("gate: a failed record is reported, not raised", note.startswith("evals: NOT RECORDED"), note)
    template = bg.clip_prompt_template()
    check("the versioned instruction text has no batch-specific path in it",
          "{chunks}" in template and "{clip_plan}" in template and "{brief}" in template and str(tmp) not in template)
    silent = []
    bg.write_progress = lambda *a, **k: silent.append(1)
    bg._beat({"batch": "x", "no_heartbeat": True}, "n", "e")
    check("a replay does not touch the dashboard heartbeat", not silent)

    shutil.rmtree(tmp, ignore_errors=True)
    print(f"\n{'ALL PASSED' if not FAILS else str(len(FAILS)) + ' FAILED: ' + ', '.join(FAILS)}")
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main())
