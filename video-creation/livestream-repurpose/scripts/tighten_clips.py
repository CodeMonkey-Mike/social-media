"""tighten_clips.py — CANONICAL Phase 5 tighten + 5B desilence (livestream-repurpose shorts, Wave 3).

De-forks the per-batch `tighten_clips_<batch>.py` scripts (ORCHESTRATOR-PLAN.md
§"Livestream-repurpose migration plan" wave 3). The per-batch forks are FROZEN as rollback
reference — `tighten_clips_october_bottom.py` (modeled on the whatif1000x reference) is the
blueprint this canonicalizes. New batches run this one script, parameterized by --batch,
wrapped by the tighten segment of graph/shorts_graph.py (or invoked directly with --stage all).

Reads shorts/<batch>/tighten-plan.json (the tighten-strategist's judgment artifact) plus
clip-plan.json (segments / assembly_order / titles, incl. Mike's 4b retitles), and executes
against the VERTICAL MASTER at absolute timestamps (never against a preview):

  tighten    per clip: segments IN assembly_order -> apply boundary_relock (uncapped,
             excluded from the ceiling) -> subtract the strategist's removals, guarded by
             the VOICED-CONTENT ceiling measured against Whisper word spans (~10% target,
             15% HARD ceiling — computed here, never trusted from the plan) -> render each
             keep span off the master with an 8 ms declick fade in/out -> concat ->
             <slug>/<slug>-tightened.mp4 -> 5B: the ONE canonical desilencer
             (skills/desilencer/scripts/desilence.py) renders
             <slug>/<slug>-tightened-desilenced.mp4 at the CALLER'S --min-sil
             (Mike's per-batch knob, recent batches 0.25 and 0.45; NEVER defaulted here,
             per the desilencer doctrine) -> every span logged to tighten_log.json
  finalize   rebuilds the ONE dashboard.html IN PLACE (canonical builder, never a second
             file) + patches progress.json to the 2nd-review gate — REFUSES to touch a
             batch whose progress is already past 5B (--force to override)
  all        both (the manual one-shot; the graph runs the stages as separate nodes)

ORDER IS LOAD-BEARING: raw cut -> tighten -> desilence. Silence removal only removes gaps;
the tighten pass is what removes spoken content. 4b deletes never renumber survivors.

5B note: the frozen forks called scripts/delete_silences.py (a thin wrapper that bakes the
250 ms shorts default). The canonical script calls the same underlying tool the wrapper
calls — skills/desilencer/scripts/desilence.py — directly, because the min-sil is Mike's
per-batch call and must never be baked. delete_silences.py remains for hand runs.

Single-clip corrections: `--only <slug> [<slug> ...]` re-renders only those clips and reuses
the previous tighten_log entries for the rest; the dashboard still rebuilds from the COMPLETE
set (fork behavior, kept).

Usage:
    python video-creation/livestream-repurpose/scripts/tighten_clips.py --batch <batch>
        --min-sil 0.25 [--stage all|tighten|finalize] [--plan PATH] [--clip-plan PATH]
        [--master PATH] [--transcript PATH] [--out-base DIR] [--title TEXT]
        [--subtitle TEXT] [--only SLUG ...] [--force]

Defaults: plan = video-creation/shorts/<batch>/tighten-plan.json · clip-plan =
video-creation/shorts/<batch>/clip-plan.json · master = the clip-plan's `source_vertical` ·
transcript = video-creation/livestream-repurpose/transcripts/<master stem>/<master stem>.json ·
out-base = video-creation/shorts/<batch>.

Prints `PROGRESS n%` + per-clip `TIGHT ...` lines (graph heartbeat) and machine-readable
`LOG=` / `DASHBOARD=` / `PROGRESSFILE=` lines (graph verification).
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[3]           # scripts/ -> livestream-repurpose -> video-creation -> repo
sys.path.insert(0, str(REPO_ROOT / "video-creation" / "shorts" / "_tooling"))
from build_clip_dashboard import build_dashboard          # noqa: E402

DESILENCE = REPO_ROOT / "video-creation" / "skills" / "desilencer" / "scripts" / "desilence.py"

FADE = 0.008   # 8 ms declick, same anti-pop technique as the desilencer
CAP = 0.15     # HARD ceiling on VOICED content removal (boundary re-lock is uncapped + excluded)
NOTE_FLOOR = 0.05  # below this, the strategist must have justified the light touch in notes

ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18",
       "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero"]

NOT_PAST_5B = (None, "cut", "tightened", "5B-desilenced")   # any other phase = past this stage


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
         str(p)]).decode().strip())


def die(msg):
    print(f"ABORT: {msg}", file=sys.stderr)
    sys.exit(1)


def overlap(a1, a2, b1, b2):
    return max(0.0, min(a2, b2) - max(a1, b1))


def complement(s, e, removes):
    """Keep spans = [s,e] minus the removal spans."""
    rs = sorted((max(s, a), min(e, b)) for a, b in removes if b > s and a < e)
    keeps, cur = [], s
    for a, b in rs:
        if a > cur:
            keeps.append((cur, a))
        cur = max(cur, b)
    if cur < e:
        keeps.append((cur, e))
    return [(a, b) for a, b in keeps if b - a > 0.05]


def load_words(transcript_path):
    """Whisper word spans: the source of truth for what counts as 'content'."""
    with open(transcript_path, encoding="utf-8") as f:
        return [(w.get("start", seg["start"]), w.get("end", seg["end"]))
                for seg in json.load(f)["segments"] for w in seg.get("words", [])]


def assembled_segments(cp_clip, t_clip):
    """The clip's master-time segments IN assembly order, with the strategist's
    boundary re-locks applied. Returns (segs, raw_dur, relocked_dur)."""
    segs_src = cp_clip["segments"]
    order = cp_clip.get("assembly_order") or list(range(len(segs_src)))
    segs = [(float(segs_src[i]["start"]), float(segs_src[i]["end"])) for i in order]
    raw_dur = sum(b - a for a, b in segs)
    for rl in (t_clip.get("boundary_relock") or []):
        si = rl["segment_index"]
        k = order.index(si) if si in order else si
        a, b = segs[k]
        segs[k] = (float(rl.get("new_start", a)), float(rl.get("new_end", b)))
    relocked_dur = sum(b - a for a, b in segs)
    return segs, raw_dur, relocked_dur


def clip_measures(cp_clip, t_clip, words):
    """Everything the ceiling gate and the verify nodes need, computed one way:
    keeps, expected tightened duration, voiced totals. Never trusts the plan's
    own est_removed_pct."""
    segs, raw_dur, relocked_dur = assembled_segments(cp_clip, t_clip)
    removals = [(float(r["start"]), float(r["end"]))
                for r in t_clip.get("removals", []) if float(r["end"]) - float(r["start"]) > 0.001]
    for a, b in removals:
        if not any(b > ss and a < se for ss, se in segs):
            die(f"{t_clip['id']}: removal {a:.2f}-{b:.2f} falls outside every kept segment "
                f"{[(round(x, 2), round(y, 2)) for x, y in segs]}. Planning error, not a no-op. "
                "Have the strategist re-author.")
    keeps = []
    for a, b in segs:
        keeps.extend(complement(a, b, removals))
    if not keeps:
        die(f"{t_clip['id']}: removals consumed the entire clip")
    voiced_total = sum(overlap(ws, we, ss, se) for ws, we in words for ss, se in segs)
    voiced_cut = sum(overlap(ws, we, max(a, ss), min(b, se))
                     for ws, we in words
                     for a, b in removals for ss, se in segs if b > ss and a < se)
    kept_voiced = voiced_total - voiced_cut
    pct_voiced = voiced_cut / voiced_total if voiced_total else 0.0
    return {"segs": segs, "removals": removals, "keeps": keeps,
            "raw_dur": raw_dur, "relocked_dur": relocked_dur,
            "tight_s": sum(b - a for a, b in keeps),
            "voiced_total": voiced_total, "kept_voiced_s": kept_voiced,
            "pct_voiced": pct_voiced}


def validate_tighten_plan(tighten, clip_plan, master_len, words):
    """Fail fast with a planning-error message instead of a mid-render surprise.
    Returns {slug: measures} for every clip in the tighten plan (the runner derives
    its `expected` from this — one source of truth)."""
    if not isinstance(tighten.get("clips"), list) or not tighten["clips"]:
        die("tighten-plan.json has no clips[]")
    cp_by_slug = {c["slug"]: c for c in clip_plan.get("clips", [])}
    seen = set()
    measures = {}
    for t in tighten["clips"]:
        slug = t.get("id")
        if not slug or not isinstance(t.get("n"), int):
            die(f"tighten clip missing id/n: {t}")
        if slug in seen:
            die(f"duplicate tighten clip id: {slug}")
        seen.add(slug)
        cp = cp_by_slug.get(slug)
        if cp is None:
            die(f"tighten clip {slug!r} not in clip-plan.json (deleted at 4b? then it must "
                "not be in the tighten plan either)")
        if cp.get("clip_id") != t["n"]:
            die(f"{slug}: tighten n={t['n']} != clip-plan clip_id={cp.get('clip_id')} "
                "(numbers are frozen at the 4b dashboard; never renumber)")
        n_segs = len(cp["segments"])
        for rl in (t.get("boundary_relock") or []):
            si = rl.get("segment_index")
            if not isinstance(si, int) or not (0 <= si < n_segs):
                die(f"{slug}: boundary_relock segment_index {si!r} out of range 0..{n_segs - 1}")
            ns, ne = rl.get("new_start"), rl.get("new_end")
            if ns is not None and ne is not None and not (float(ne) > float(ns)):
                die(f"{slug}: boundary_relock {ns}-{ne} is not a positive span")
            for v in (ns, ne):
                if v is not None and float(v) > master_len + 0.5:
                    die(f"{slug}: boundary_relock time {v} beyond the master ({master_len:.2f}s)")
        for r in t.get("removals", []):
            if not (isinstance(r.get("start"), (int, float)) and isinstance(r.get("end"), (int, float))
                    and float(r["end"]) > float(r["start"])):
                die(f"{slug}: bad removal {r}")
        m = clip_measures(cp, t, words)     # includes the inside-a-segment check
        if m["pct_voiced"] > CAP:
            die(f"{slug}: voiced-content removal is {m['pct_voiced']:.1%}, over the "
                f"{CAP:.0%} hard ceiling (measured vs Whisper words). Have the strategist "
                "re-author.")
        measures[slug] = m
    return measures


def render(master, keeps, out_path):
    """Cut each keep span from the MASTER with an 8 ms declick, then concat."""
    with tempfile.TemporaryDirectory() as work:
        parts = []
        for i, (a, b) in enumerate(keeps):
            d = b - a
            fo = max(0.0, d - FADE)
            af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
            t = os.path.join(work, f"k{i:03d}.mp4")
            r = subprocess.run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-i", str(master),
                                "-t", f"{d:.3f}", "-af", af, *ENC, t],
                               capture_output=True, text=True)
            if r.returncode != 0:
                die(f"ffmpeg keep-span cut failed ({a:.2f}-{b:.2f}) for {out_path}:\n"
                    f"{r.stderr[-600:]}")
            parts.append(t)
        lst = os.path.join(work, "concat.txt")
        with open(lst, "w", encoding="utf-8") as f:
            for t in parts:
                f.write(f"file '{t.replace(os.sep, '/')}'\n")
        r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                            "-c", "copy", str(out_path)], capture_output=True, text=True)
        if r.returncode != 0:
            die(f"ffmpeg concat failed for {out_path}:\n{r.stderr[-600:]}")


def desilence(tight_path, desil_path, min_sil):
    """5B via the ONE canonical desilencer, at the caller's min-sil. Renders to a
    temp name in the same folder, then replaces atomically."""
    tmp = str(desil_path) + ".part.mp4"
    r = subprocess.run([sys.executable, str(DESILENCE), str(tight_path),
                        "--out", tmp, "--min-sil", f"{min_sil}"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        if os.path.exists(tmp):
            os.remove(tmp)
        die(f"canonical desilencer failed for {tight_path}:\n{r.stdout[-400:]}\n{r.stderr[-800:]}")
    os.replace(tmp, desil_path)


def stage_tighten(args, clip_plan, tighten, master, out_base, measures):
    cp_by_slug = {c["slug"]: c for c in clip_plan["clips"]}
    clips = tighten["clips"]
    only = set(args.only or [])
    unknown = only - {t["id"] for t in clips}
    if unknown:
        die(f"--only names not in the tighten plan: {sorted(unknown)}")

    prev_log = {}
    log_path = out_base / "tighten_log.json"
    if only and log_path.is_file():
        prev_log = {e["slug"]: e for e in json.loads(log_path.read_text(encoding="utf-8"))}
        print(f"re-rendering ONLY: {', '.join(sorted(only))}", flush=True)

    log = []
    for ci, t in enumerate(clips):
        slug = t["id"]
        cp = cp_by_slug[slug]
        m = measures[slug]
        d = out_base / slug
        d.mkdir(parents=True, exist_ok=True)
        tight = d / f"{slug}-tightened.mp4"
        desil = d / f"{slug}-tightened-desilenced.mp4"

        if only and slug not in only and desil.is_file():
            p = prev_log.get(slug, {})
            tdur = p.get("tightened_s") or dur(tight)
            ddur = p.get("desilenced_s") or dur(desil)
            print(f"TIGHT n={t['n']} slug={slug} cuts={len(m['removals'])} "
                  f"tight={tdur:.3f} desil={ddur:.3f} (unchanged, reusing existing render)",
                  flush=True)
        else:
            if m["pct_voiced"] < NOTE_FLOOR:
                print(f"NOTE {slug}: only {m['pct_voiced']:.1%} of voiced content removed "
                      "(the strategist must have justified this explicitly in the plan notes).",
                      flush=True)
            render(master, m["keeps"], tight)
            tdur = dur(tight)
            desilence(tight, desil, args.min_sil)
            ddur = dur(desil)
            print(f"TIGHT n={t['n']} slug={slug} cuts={len(m['removals'])} "
                  f"tight={tdur:.3f} desil={ddur:.3f}", flush=True)

        pct_span = (1 - tdur / m["relocked_dur"]) * 100 if m["relocked_dur"] else 0
        pct_total = (1 - ddur / m["raw_dur"]) * 100 if m["raw_dur"] else 0
        log.append({
            "n": t["n"], "slug": slug, "variant": t.get("variant", cp.get("variant", "full")),
            "raw_s": round(m["raw_dur"], 1), "relocked_s": round(m["relocked_dur"], 1),
            "tightened_s": round(tdur, 1), "desilenced_s": round(ddur, 1),
            "span_removed_pct": round(pct_span, 1),
            "voiced_content_removed_pct": round(m["pct_voiced"] * 100, 1),
            "voiced_gate": f"measured against Whisper word spans; ceiling {CAP:.0%}",
            "min_sil_5b": args.min_sil,
            "total_reduction_pct": round(pct_total, 1),
            "boundary_relock": t.get("boundary_relock"),
            "removals": t.get("removals", []),
            "notes": t.get("notes", ""),
        })
        print(f"PROGRESS {int(100 * (ci + 1) / len(clips))}% clip {ci + 1}/{len(clips)}",
              flush=True)

    log_path.write_text(json.dumps(log, indent=2), encoding="utf-8")
    print(f"LOG={log_path}", flush=True)
    print("STAGE-DONE tighten", flush=True)
    return log


def stage_finalize(args, clip_plan, tighten, out_base):
    log_path = out_base / "tighten_log.json"
    if not log_path.is_file():
        die(f"finalize needs {log_path} — run --stage tighten first")
    log = json.loads(log_path.read_text(encoding="utf-8"))
    by_slug = {e["slug"]: e for e in log}
    topics = {t["topic_id"]: t for t in clip_plan.get("topics", [])}
    cp_by_slug = {c["slug"]: c for c in clip_plan["clips"]}
    batch = args.batch

    # clobber guard BEFORE the dashboard rebuild — a batch past 5B keeps its state
    prog_path = out_base / "progress.json"
    prog = {}
    if prog_path.is_file():
        try:
            prog = json.loads(prog_path.read_text(encoding="utf-8"))
        except Exception:
            prog = {}
        past = [c.get("slug") for c in prog.get("clips", [])
                if c.get("slug") in by_slug and c.get("phase") not in NOT_PAST_5B]
        if past and not args.force:
            die(f"progress.json clips already past 5B: {past} — refusing to reset them "
                "(re-run with --force only if you mean to re-tighten a built batch)")

    cards = []
    for e in log:
        slug = e["slug"]
        cp = cp_by_slug.get(slug, {})
        t = next((c for c in tighten["clips"] if c["id"] == slug), {})
        segs, _, _ = assembled_segments(cp, t) if cp else ([], 0, 0)
        seg_desc = " + ".join(f"{a:.1f}-{b:.1f}" for a, b in segs)
        hook = topics.get(cp.get("topic_id"), {}).get("hook_summary", "")
        cards.append(dict(
            n=e["n"], title=cp.get("title", slug),
            video=f"{slug}/{slug}-tightened-desilenced.mp4", variant=e["variant"],
            status="tightened+desilenced", duration=e["desilenced_s"],
            src=f"{e['variant']} - {len(segs)} segment(s) [{seg_desc}] - raw {e['raw_s']:.0f}s "
                f"-> {e['desilenced_s']:.0f}s (-{e['total_reduction_pct']:.0f}% total; "
                f"{len(e.get('removals', []))} tighten cuts = "
                f"-{e['voiced_content_removed_pct']:.0f}% voiced content)",
            note=(hook + "  |  TIGHTEN: " + e.get("notes", ""))[:600],
        ))

    ms = f" ({args.min_sil * 1000:.0f} ms)" if args.min_sil else ""
    dash = build_dashboard(
        batch, str(out_base), cards,
        title=args.title or f"{batch} — Phase 5 tightened + 5B desilenced{ms}",
        subtitle_extra=args.subtitle or
        "tightened per the strategist plan + desilenced via the canonical desilencer; "
        "awaiting Mike's 2nd review")
    print(f"DASHBOARD={dash}", flush=True)

    prog.setdefault("batch", batch)
    prog["phase"] = "5B-desilenced"
    prog["status"] = "awaiting-2nd-review"
    prog["last_updated"] = datetime.now().isoformat(timespec="seconds")
    prog["dashboard_status"] = ("tightened + desilenced clips awaiting Mike's 2nd review; "
                                "then 5C (optional) -> captions (6) -> remotion-builder (7) "
                                "-> publish (8)")
    prog["tighten_log"] = f"video-creation/shorts/{batch}/tighten_log.json"
    prog["tighten_plan"] = f"video-creation/shorts/{batch}/tighten-plan.json"
    for c in prog.get("clips", []):
        e = by_slug.get(c.get("slug"))
        if e:
            c["duration_seconds"] = e["desilenced_s"]
            c["output_mp4"] = f"{c['slug']}/{c['slug']}-tightened-desilenced.mp4"
            c["phase"] = "5B-desilenced"
            c["gate"] = "awaiting-2nd-review"
    prog_path.write_text(json.dumps(prog, indent=2), encoding="utf-8")
    print(f"PROGRESSFILE={prog_path}", flush=True)
    print("STAGE-DONE finalize", flush=True)


def main():
    ap = argparse.ArgumentParser(description="Canonical Phase 5 tighten + 5B desilence (Wave 3).")
    ap.add_argument("--batch", required=True)
    ap.add_argument("--stage", choices=["all", "tighten", "finalize"], default="all")
    ap.add_argument("--min-sil", type=float, default=None,
                    help="5B min-silence seconds — Mike's per-batch knob, REQUIRED for the "
                         "tighten stage (the desilencer doctrine: the caller specifies the "
                         "silence definition every time; recent batches used 0.25 and 0.45)")
    ap.add_argument("--plan", default=None, help="tighten-plan.json")
    ap.add_argument("--clip-plan", default=None)
    ap.add_argument("--master", default=None)
    ap.add_argument("--transcript", default=None,
                    help="whisper json with word timestamps (default: derived from the master stem)")
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--title", default=None)
    ap.add_argument("--subtitle", default=None)
    ap.add_argument("--only", nargs="*", default=None,
                    help="re-render only these slugs; others keep their existing renders/log")
    ap.add_argument("--force", action="store_true",
                    help="let finalize reset progress entries already past 5B")
    args = ap.parse_args()

    out_base = Path(args.out_base) if args.out_base else (
        REPO_ROOT / "video-creation" / "shorts" / args.batch)
    plan_path = Path(args.plan) if args.plan else out_base / "tighten-plan.json"
    cplan_path = Path(args.clip_plan) if args.clip_plan else out_base / "clip-plan.json"
    for p, what in ((plan_path, "tighten-plan.json"), (cplan_path, "clip-plan.json")):
        if not p.is_file():
            die(f"{what} not found: {p}")
    try:
        tighten = json.loads(plan_path.read_text(encoding="utf-8"))
    except Exception as e:
        die(f"tighten-plan.json is not valid JSON: {e}")
    try:
        clip_plan = json.loads(cplan_path.read_text(encoding="utf-8"))
    except Exception as e:
        die(f"clip-plan.json is not valid JSON: {e}")

    if args.master:
        master = Path(args.master)
    else:
        sv = clip_plan.get("source_vertical")
        if not sv:
            die("clip-plan.json has no source_vertical and no --master given")
        master = Path(sv) if os.path.isabs(sv) else REPO_ROOT / sv
    if not master.is_file():
        die(f"vertical master not found: {master}")

    stem = master.stem
    transcript = Path(args.transcript) if args.transcript else (
        REPO_ROOT / "video-creation" / "livestream-repurpose" / "transcripts" / stem
        / f"{stem}.json")
    if not transcript.is_file():
        die(f"whisper transcript not found: {transcript} (word timestamps are the ceiling "
            "gate's source of truth)")

    if args.stage in ("all", "tighten"):
        if args.min_sil is None:
            die("--min-sil is required for the tighten stage (Mike's per-batch 5B knob; "
                "recent batches: 0.25 and 0.45)")
        if not (0.15 <= args.min_sil <= 2.0):
            die(f"--min-sil {args.min_sil}s is outside the sane 0.15-2.0s range")
    if args.min_sil is None:
        args.min_sil = 0.0     # finalize-only invocations read it for the dashboard title

    words = load_words(transcript)
    if not words:
        die(f"transcript has no word timestamps: {transcript}")
    master_len = dur(master)

    print(f"tighten_clips | batch {args.batch} | {len(tighten.get('clips', []))} clips | "
          f"stage {args.stage} | min-sil {args.min_sil}s", flush=True)
    measures = validate_tighten_plan(tighten, clip_plan, master_len, words)

    if args.stage in ("all", "tighten"):
        stage_tighten(args, clip_plan, tighten, master, out_base, measures)
    if args.stage in ("all", "finalize"):
        stage_finalize(args, clip_plan, tighten, out_base)


if __name__ == "__main__":
    main()
