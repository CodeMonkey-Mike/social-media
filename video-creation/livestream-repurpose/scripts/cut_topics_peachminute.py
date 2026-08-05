"""cut_topics_peachminute.py - Phase 4 multi-snippet cutter for batch 'peach-minute'.
Reads shorts/peach-minute/clip-plan.json, cuts each clip's segments from the VERTICAL master
(re-encode every segment, NEVER -c copy), concats them in the order listed in the plan, writes
shorts/<batch>/<clip_id>/<clip_id>-full.mp4. Stops at clip generation (no tighten/caption/render).
Modeled on cut_topics_newbottom.py; this plan's segments are already in assembly order, so there
is no separate assembly_order key.
"""
import json, os, subprocess, sys, tempfile

VC = "C:/Users/mnede/Documents/Claude/social-media/video-creation"
sys.path.insert(0, f"{VC}/shorts/_tooling")
from build_clip_dashboard import build_dashboard  # CANONICAL builder, never inline HTML
BATCH = "peach-minute"
MASTER = f"{VC}/livestream-repurpose/media/peach-minute/peach-minute LOW BPS VERTICAL.mp4"
PLAN = f"{VC}/shorts/{BATCH}/clip-plan.json"
OUTBASE = f"{VC}/shorts/{BATCH}"


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


def mmss(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def main():
    plan = json.load(open(PLAN, encoding="utf-8"))
    results = []
    for clip in plan["clips"]:
        slug = clip["clip_id"]
        d = os.path.join(OUTBASE, slug)
        os.makedirs(d, exist_ok=True)
        segs = clip["segments"]
        seg_files = []
        tc_parts = []
        with tempfile.TemporaryDirectory() as tmp:
            for i, s in enumerate(segs):
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
            subprocess.run([
                "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
                "-c", "copy", out
            ], check=True, capture_output=True)
        od = dur(out)
        tc = " + ".join(tc_parts)
        results.append({"slug": slug, "title": clip["title"], "topic": clip["topic_id"],
                        "variant": clip["variant"],
                        "duration": round(od, 3), "timecodes": tc, "n_segs": len(segs),
                        "output_mp4": f"{slug}/{slug}-full.mp4"})
        print(f"  {slug:34s} {len(segs)} segs -> {od:6.1f}s  [{tc}]")
    json.dump(results, open(os.path.join(OUTBASE, "_cut_results.json"), "w", encoding="utf-8"), indent=2)

    by_id = {c["clip_id"]: c for c in plan["clips"]}
    cards = []
    for r in results:
        c = by_id[r["slug"]]
        cards.append({
            "title": r["title"],
            "video": r["output_mp4"],
            "variant": "full" if c["variant"] == "long" else "impact",
            "status": "raw",
            "duration": r["duration"],
            "src": f'{r["n_segs"]} segment(s) &middot; {r["timecodes"]}',
            "note": c["rationale"],
        })
    print("dashboard ->", build_dashboard(
        BATCH, OUTBASE, cards,
        title="peach-minute (livestream 2026-07-27)",
        subtitle_extra="Phase 4 output, raw cuts; no tighten / desilence / captions / render yet"))
    print("DONE")


if __name__ == "__main__":
    main()
