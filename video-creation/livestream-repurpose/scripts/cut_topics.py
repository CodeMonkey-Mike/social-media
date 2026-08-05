"""cut_topics.py — CANONICAL Phase 4 clip cutter (livestream-repurpose shorts, Wave 2).

De-forks the 17 per-batch `cut_topics_<batch>.py` scripts (ORCHESTRATOR-PLAN.md
§"Livestream-repurpose migration plan" wave 2). The per-batch forks are FROZEN as rollback
reference; new batches run this one script, parameterized by --batch, wrapped by the cut
segment of graph/shorts_graph.py (or invoked directly with --stage all).

Reads shorts/<batch>/clip-plan.json (the clip-strategist's judgment artifact) and:
  cut       cuts each clip's segments from the VERTICAL master (re-encode, NEVER -c copy),
            concats them in assembly_order -> <out-base>/<slug>/<slug>-full.mp4, and writes
            <out-base>/_cut_results.json
  finalize  builds the canonical dashboard IN PLACE (shorts/_tooling/build_clip_dashboard.py),
            registers the batch in batches.json (cleanup protection), and initializes
            progress.json — refuses to clobber a progress.json already past the cut phase
  all       both (the manual one-shot; the graph runs the stages as separate nodes)

Stops at clip generation. Phase 4b (Mike's dashboard review) is the seam — no tighten,
no captions, no render here.

Usage:
    python video-creation/livestream-repurpose/scripts/cut_topics.py --batch <batch>
        [--stage all|cut|finalize] [--plan PATH] [--master PATH] [--out-base DIR]
        [--registry-root DIR] [--no-register] [--date YYYY-MM-DD] [--note TEXT] [--force]

Defaults: plan = video-creation/shorts/<batch>/clip-plan.json · master = the plan's
`source_vertical` (absolute, or relative to the repo root) · out-base =
video-creation/shorts/<batch> · registry-root = the repo root (batches.json location).

Prints `PROGRESS n%` + per-clip `CUT ...` lines (graph heartbeat) and machine-readable
`RESULTS=` / `DASHBOARD=` / `REGISTERED=` / `PROGRESSFILE=` lines (graph verification).
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import date, datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[3]           # scripts/ -> livestream-repurpose -> video-creation -> repo
sys.path.insert(0, str(REPO_ROOT / "video-creation" / "shorts" / "_tooling"))
sys.path.insert(0, str(REPO_ROOT / "scripts"))
from build_clip_dashboard import build_dashboard          # noqa: E402
from register_batch import make_entry, upsert             # noqa: E402

ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18",
       "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero"]


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
         str(p)]).decode().strip())


def mmss(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def die(msg):
    print(f"ABORT: {msg}", file=sys.stderr)
    sys.exit(1)


def validate_plan(plan, master):
    """Fail fast with a planning-error message instead of a mid-cut ffmpeg surprise."""
    if not isinstance(plan.get("topics"), list) or not plan["topics"]:
        die("clip-plan.json has no topics[]")
    if not isinstance(plan.get("clips"), list) or not plan["clips"]:
        die("clip-plan.json has no clips[]")
    tids = {t.get("topic_id") for t in plan["topics"]}
    if len(tids) != len(plan["topics"]):
        die("duplicate topic_id in clip-plan.json")
    for t in plan["topics"]:
        if not t.get("topic_id") or "hook_summary" not in t:
            die(f"topic missing topic_id/hook_summary: {t}")
    seen_ids, seen_slugs = set(), set()
    master_len = dur(master)
    for c in plan["clips"]:
        cid, slug = c.get("clip_id"), c.get("slug")
        if not isinstance(cid, int) or not slug or not c.get("title"):
            die(f"clip missing clip_id/slug/title: {c}")
        if cid in seen_ids or slug in seen_slugs:
            die(f"duplicate clip_id/slug: {cid} {slug}")
        seen_ids.add(cid), seen_slugs.add(slug)
        if c.get("topic_id") not in tids:
            die(f"clip {slug}: unknown topic_id {c.get('topic_id')!r}")
        segs = c.get("segments")
        if not isinstance(segs, list) or not segs:
            die(f"clip {slug}: no segments[]")
        for s in segs:
            st, en = s.get("start"), s.get("end")
            if not (isinstance(st, (int, float)) and isinstance(en, (int, float)) and en > st):
                die(f"clip {slug}: bad segment {s}")
            if en > master_len + 0.5:
                die(f"clip {slug}: segment end {en:.2f}s beyond the master ({master_len:.2f}s)")
        order = c.get("assembly_order") or list(range(len(segs)))
        if sorted(order) != list(range(len(segs))):
            die(f"clip {slug}: assembly_order {order} is not a permutation of 0..{len(segs)-1}")
    return master_len


def stage_cut(plan, master, out_base):
    clips = plan["clips"]
    results = []
    for ci, clip in enumerate(clips):
        slug = clip["slug"]
        d = out_base / slug
        d.mkdir(parents=True, exist_ok=True)
        segs = clip["segments"]
        order = clip.get("assembly_order") or list(range(len(segs)))
        seg_files, tc_parts = [], []
        with tempfile.TemporaryDirectory() as tmp:
            for i, idx in enumerate(order):
                s = segs[idx]
                st, en = float(s["start"]), float(s["end"])
                tc_parts.append(f"{mmss(st)}-{mmss(en)}")
                segf = os.path.join(tmp, f"seg{i:02d}.mp4")
                r = subprocess.run(
                    ["ffmpeg", "-y", "-ss", f"{st}", "-to", f"{en}", "-i", str(master),
                     *ENC, segf], capture_output=True, text=True)
                if r.returncode != 0:
                    die(f"ffmpeg segment cut failed for {slug} seg {idx} "
                        f"({st:.2f}-{en:.2f}):\n{r.stderr[-600:]}")
                seg_files.append(segf)
            listf = os.path.join(tmp, "list.txt")
            with open(listf, "w", encoding="utf-8") as f:
                for sf in seg_files:
                    f.write(f"file '{sf.replace(os.sep, '/')}'\n")
            out = d / f"{slug}-full.mp4"
            r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
                                "-c", "copy", str(out)], capture_output=True, text=True)
            if r.returncode != 0:
                die(f"ffmpeg concat failed for {slug}:\n{r.stderr[-600:]}")
        od = dur(out)
        results.append({"n": clip["clip_id"], "slug": slug, "title": clip["title"],
                        "topic": clip["topic_id"], "variant": clip.get("variant", "full"),
                        "duration": round(od, 3), "timecodes": " + ".join(tc_parts),
                        "n_segs": len(order), "output_mp4": f"{slug}/{slug}-full.mp4"})
        print(f"CUT n={clip['clip_id']} slug={slug} segs={len(order)} dur={od:.3f}", flush=True)
        print(f"PROGRESS {int(100 * (ci + 1) / len(clips))}% clip {ci + 1}/{len(clips)}",
              flush=True)
    results_path = out_base / "_cut_results.json"
    results_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"RESULTS={results_path}", flush=True)
    print("STAGE-DONE cut", flush=True)
    return results


def stage_finalize(args, plan, master, out_base, registry_root):
    results_path = out_base / "_cut_results.json"
    if not results_path.is_file():
        die(f"finalize needs {results_path} — run --stage cut first")
    results = json.loads(results_path.read_text(encoding="utf-8"))
    topics = {t["topic_id"]: t for t in plan["topics"]}
    batch = args.batch

    cards = [{
        "n": r["n"], "title": r["title"], "video": r["output_mp4"], "variant": r["variant"],
        "status": "raw", "duration": r["duration"],
        "src": f"{r['n_segs']} segment(s): {r['timecodes']}",
        "note": topics.get(r["topic"], {}).get("hook_summary", ""),
    } for r in results]
    dash = build_dashboard(
        batch, str(out_base), cards,
        title=args.title or f"{batch} — clip review (Phase 4b)",
        subtitle_extra=args.subtitle or "cut from the intake graph's vertical master; "
                                       "raw cuts, pre-tighten")
    print(f"DASHBOARD={dash}", flush=True)

    if not args.no_register:
        # master is repo-relative in the registry when it lives under the repo
        try:
            rel_master = str(Path(master).resolve().relative_to(REPO_ROOT)).replace("\\", "/")
        except ValueError:
            rel_master = str(master)
        stem = Path(master).stem
        registry_file = Path(registry_root) / "batches.json"
        if not registry_file.is_file():
            registry_file.write_text(json.dumps({"batches": []}, indent=2), encoding="utf-8")
        entry = make_entry(
            batch=batch, date=args.date, livestream_title=stem,
            source_media=rel_master,
            transcripts_dir=f"video-creation/livestream-repurpose/transcripts/{stem}",
            dashboard=f"video-creation/shorts/{batch}/dashboard.html",
            note=args.note or f"cut via canonical cut_topics.py (Wave 2 cut graph), {args.date}.")
        upsert(entry, root=str(registry_root))
        print(f"REGISTERED={batch}", flush=True)
    else:
        print("REGISTERED=(skipped --no-register)", flush=True)

    prog_path = out_base / "progress.json"
    if prog_path.is_file() and not args.force:
        try:
            prev = json.loads(prog_path.read_text(encoding="utf-8"))
        except Exception:
            prev = {}
        past_cut = ("phase" in prev) or any(
            c.get("phase") not in (None, "cut") for c in prev.get("clips", []))
        if past_cut:
            die(f"{prog_path} is already past the cut phase — refusing to clobber it "
                "(re-run with --force only if you mean to reset the batch to Phase 4b)")
    progress = {
        "batch": batch, "track": "livestream-repurpose",
        "source_livestream": batch, "livestream_date": args.date,
        "last_updated": datetime.now().isoformat(timespec="seconds"),
        "dashboard": f"video-creation/shorts/{batch}/dashboard.html",
        "dashboard_status": "raw cuts awaiting Mike's Phase 4b review (delete calls by clip number)",
        "numbering_note": "clip numbers frozen at initial dashboard build; never renumber after deletes",
        "clips": [{"n": r["n"], "slug": r["slug"], "title": r["title"], "variant": r["variant"],
                   "duration_seconds": r["duration"], "phase": "cut",
                   "gate": "awaiting-4b-review"} for r in results],
        "resume_protocol": "Phase 4b: Mike reviews dashboard.html and names clips to delete by "
                           "number. Then per surviving clip: tighten-strategist -> tighten -> "
                           "2nd review -> desilence (5B) -> filler pass (5C, optional) -> "
                           "captions (6) -> remotion-builder (7) -> publish-shorts (8). STT "
                           "garble fixes for captions are listed in clip-plan.json "
                           "stt_garble_flags (verify each against the clip's OWN "
                           "whisper-words.json before applying).",
    }
    prog_path.write_text(json.dumps(progress, indent=2), encoding="utf-8")
    print(f"PROGRESSFILE={prog_path}", flush=True)
    print("STAGE-DONE finalize", flush=True)


def main():
    ap = argparse.ArgumentParser(description="Canonical Phase 4 clip cutter (Wave 2).")
    ap.add_argument("--batch", required=True)
    ap.add_argument("--stage", choices=["all", "cut", "finalize"], default="all")
    ap.add_argument("--plan", default=None)
    ap.add_argument("--master", default=None)
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--registry-root", default=None)
    ap.add_argument("--no-register", action="store_true")
    ap.add_argument("--date", default=str(date.today()))
    ap.add_argument("--note", default=None)
    ap.add_argument("--title", default=None)
    ap.add_argument("--subtitle", default=None)
    ap.add_argument("--force", action="store_true",
                    help="allow finalize to overwrite a progress.json already past the cut phase")
    args = ap.parse_args()

    out_base = Path(args.out_base) if args.out_base else (
        REPO_ROOT / "video-creation" / "shorts" / args.batch)
    plan_path = Path(args.plan) if args.plan else out_base / "clip-plan.json"
    if not plan_path.is_file():
        die(f"clip-plan.json not found: {plan_path}")
    try:
        plan = json.loads(plan_path.read_text(encoding="utf-8"))
    except Exception as e:
        die(f"clip-plan.json is not valid JSON: {e}")

    if args.master:
        master = Path(args.master)
    else:
        sv = plan.get("source_vertical")
        if not sv:
            die("clip-plan.json has no source_vertical and no --master given")
        master = Path(sv) if os.path.isabs(sv) else REPO_ROOT / sv
    if not master.is_file():
        die(f"vertical master not found: {master}")

    registry_root = Path(args.registry_root) if args.registry_root else REPO_ROOT
    out_base.mkdir(parents=True, exist_ok=True)

    print(f"cut_topics | batch {args.batch} | {len(plan.get('clips', []))} clips | "
          f"stage {args.stage}", flush=True)
    validate_plan(plan, master)

    if args.stage in ("all", "cut"):
        stage_cut(plan, master, out_base)
    if args.stage in ("all", "finalize"):
        stage_finalize(args, plan, master, out_base, registry_root)


if __name__ == "__main__":
    main()
