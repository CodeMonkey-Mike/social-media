"""cut_topics_whatif.py - Phase 4 multi-snippet cutter for batch 'whatif'.
Reads shorts/whatif/clip-plan.json, cuts each clip's segments from the VERTICAL master
(re-encode every segment, NEVER -c copy), concats them in assembly_order, writes
shorts/<batch>/<slug>/<slug>-full.mp4. Stops at clip generation (no tighten/caption/render).
"""
import json, os, subprocess, tempfile

VC = "C:/Users/mnede/Documents/Claude/social-media/video-creation"
BATCH = "whatif"
MASTER = f"{VC}/livestream-repurpose/media/whatif/whatif LOW BPS VERTICAL.mp4"
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
            # concat re-encoded segments (safe with -c copy: each starts at 0)
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
        results.append({"slug": slug, "title": clip["title"], "topic": clip["topic"],
                        "duration": round(od, 3), "timecodes": tc, "n_segs": len(order),
                        "output_mp4": f"{slug}/{slug}-full.mp4"})
        print(f"  {slug:34s} {len(order)} segs -> {od:6.1f}s  [{tc}]")
    json.dump(results, open(os.path.join(OUTBASE, "_cut_results.json"), "w", encoding="utf-8"), indent=2)
    print("DONE")


if __name__ == "__main__":
    main()
