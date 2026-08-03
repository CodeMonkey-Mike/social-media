"""cut_topics_whatif1000x.py - Phase 4 multi-snippet cutter for batch 'what-if-1000x'.
Reads shorts/what-if-1000x/clip-plan.json, cuts each clip's segments from the VERTICAL master
(re-encode every segment, NEVER -c copy), concats them in assembly_order, writes
shorts/<batch>/<slug>/<slug>-full.mp4, builds the canonical dashboard, registers the batch,
and initializes progress.json. Stops at clip generation (no tighten/caption/render).
(Last fork before Wave 2 of the LangGraph migration de-forks this into a parameterized script.)
"""
import json, os, subprocess, sys, tempfile
from datetime import date, datetime

VC = "C:/Users/mnede/Documents/Claude/social-media/video-creation"
ROOT = "C:/Users/mnede/Documents/Claude/social-media"
BATCH = "what-if-1000x"
MASTER = f"{VC}/livestream-repurpose/media/what-if-1000x/what-if-1000x LOW BPS VERTICAL.mp4"
PLAN = f"{VC}/shorts/{BATCH}/clip-plan.json"
OUTBASE = f"{VC}/shorts/{BATCH}"
sys.path.insert(0, f"{VC}/shorts/_tooling")
sys.path.insert(0, f"{ROOT}/scripts")
from build_clip_dashboard import build_dashboard      # noqa: E402
from register_batch import register_batch             # noqa: E402


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


def mmss(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def main():
    plan = json.load(open(PLAN, encoding="utf-8"))
    topics = {t["topic_id"]: t for t in plan["topics"]}
    results = []
    for clip in plan["clips"]:
        slug = clip["slug"]
        d = os.path.join(OUTBASE, slug)
        os.makedirs(d, exist_ok=True)
        segs = clip["segments"]
        order = clip["assembly_order"]
        seg_files = []
        tc_parts = []
        with tempfile.TemporaryDirectory() as tmp:
            for i, idx in enumerate(order):
                s = segs[idx]
                st, en = float(s["start"]), float(s["end"])
                tc_parts.append(f"{mmss(st)}-{mmss(en)}")
                segf = os.path.join(tmp, f"seg{i:02d}.mp4")
                subprocess.run([
                    "ffmpeg", "-y", "-ss", f"{st}", "-to", f"{en}", "-i", MASTER,
                    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                    "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", segf
                ], check=True, capture_output=True)
                seg_files.append(segf)
            listf = os.path.join(tmp, "list.txt")
            with open(listf, "w", encoding="utf-8") as f:
                for sf in seg_files:
                    f.write(f"file '{sf.replace(os.sep, '/')}'\n")
            out = os.path.join(d, f"{slug}-full.mp4")
            subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
                            "-c", "copy", out], check=True, capture_output=True)
        od = dur(out)
        tc = " + ".join(tc_parts)
        results.append({"n": clip["clip_id"], "slug": slug, "title": clip["title"],
                        "topic": clip["topic_id"], "variant": clip["variant"],
                        "duration": round(od, 3), "timecodes": tc, "n_segs": len(order),
                        "output_mp4": f"{slug}/{slug}-full.mp4"})
        print(f"  [{clip['clip_id']}] {slug:34s} {len(order)} segs -> {od:6.1f}s")
    json.dump(results, open(os.path.join(OUTBASE, "_cut_results.json"), "w", encoding="utf-8"), indent=2)

    cards = [{
        "n": r["n"], "title": r["title"], "video": r["output_mp4"], "variant": r["variant"],
        "status": "raw", "duration": r["duration"],
        "src": f"{r['n_segs']} segment(s): {r['timecodes']}",
        "note": topics[r["topic"]]["hook_summary"],
    } for r in results]
    build_dashboard(BATCH, OUTBASE, cards,
                    title="what-if-1000x — clip review (Phase 4b)",
                    subtitle_extra="cut from the intake graph's vertical master; raw cuts, pre-tighten")

    register_batch(batch=BATCH, date=str(date.today()),
                   livestream_title="what-if-1000x LOW BPS VERTICAL",
                   source_media=f"video-creation/livestream-repurpose/media/{BATCH}/{BATCH} LOW BPS VERTICAL.mp4",
                   transcripts_dir=f"video-creation/livestream-repurpose/transcripts/{BATCH} LOW BPS VERTICAL",
                   dashboard=f"video-creation/shorts/{BATCH}/dashboard.html",
                   note="Wave 1 LangGraph intake bless batch (2026-08-02). Lanes: intake graph ran "
                        "Ph1+Lane1+1B+2; clips cut per clip-strategist plan; Lane 3 in flight.")

    progress = {
        "batch": BATCH, "track": "livestream-repurpose",
        "source_livestream": "what-if-1000x", "livestream_date": "2026-08-02",
        "last_updated": datetime.now().isoformat(timespec="seconds"),
        "dashboard": f"video-creation/shorts/{BATCH}/dashboard.html",
        "dashboard_status": "raw cuts awaiting Mike's Phase 4b review (delete calls by clip number)",
        "numbering_note": "clip numbers frozen at initial dashboard build; never renumber after deletes",
        "clips": [{"n": r["n"], "slug": r["slug"], "title": r["title"], "variant": r["variant"],
                   "duration_seconds": r["duration"], "phase": "cut", "gate": "awaiting-4b-review"}
                  for r in results],
        "resume_protocol": "Phase 4b: Mike reviews dashboard.html and names clips to delete by number. "
                           "Then per surviving clip: tighten-strategist -> tighten -> 2nd review -> "
                           "desilence (5B) -> filler pass (5C, optional) -> captions (6) -> "
                           "remotion-builder (7) -> publish-shorts (8). STT garble fixes for captions "
                           "are listed in clip-plan.json stt_garble_flags.",
    }
    json.dump(progress, open(os.path.join(OUTBASE, "progress.json"), "w", encoding="utf-8"), indent=2)
    print("DONE: dashboard + registry + progress.json written")


if __name__ == "__main__":
    main()
