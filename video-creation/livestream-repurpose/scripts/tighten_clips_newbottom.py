"""tighten_clips_newbottom.py - Phase 5 tighten pass for batch 'new-bottom'.

Applies the tighten-strategist plans (boundary relock + interior content-removal spans,
authored per clip after reading the actual master transcript) to each of the 4 clips.
Cuts from the MASTER vertical at absolute timestamps (cleanest quality), re-encodes each
kept span with an 8ms declick fade in/out, concats, writes <slug>/tightened.mp4.
Logs every removed span to tighten_log.json and rebuilds shorts/new-bottom/dashboard.html
IN PLACE. Does NOT run silence removal (that is Phase 5B, a separate step).
"""
import json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "shorts", "_tooling"))
from build_clip_dashboard import build_dashboard

VC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation"
BATCH = "new-bottom"
MASTER = os.path.join(VC, "livestream-repurpose", "media", "new bottom", "new bottom LOW BPS VERTICAL.mp4")
OUTBASE = os.path.join(VC, "shorts", BATCH)
FADE = 0.008

# ── tighten-strategist plans (one per clip, authored against the master transcript) ──
PLANS = [
    {
        "slug": "new-bottom-august",
        "title": "The New Bottom Hits in August, Not October",
        "segments": [
            {"start": 96.06, "end": 116.54, "removals": [(111.38, 114.56)]},
            {"start": 284.54, "end": 300.94, "removals": [(287.40, 287.64)]},
            {"start": 451.24, "end": 452.40, "removals": []},
            {"start": 456.24, "end": 470.96, "removals": [(461.50, 461.88), (463.68, 466.96)]},
        ],
    },
    {
        "slug": "kaspa-dagknight-100x",
        "title": "Kaspa at 2.7 Cents: Absolutely Unbelievable",
        "segments": [
            {"start": 1083.26, "end": 1097.98, "removals": [(1087.90, 1088.48)]},
            {"start": 1440.20, "end": 1456.36, "removals": [(1440.72, 1441.22), (1450.50, 1450.82), (1454.86, 1455.60)]},
            {"start": 1494.94, "end": 1514.20, "removals": [(1497.66, 1500.16), (1504.40, 1504.86), (1507.80, 1509.90)]},
            {"start": 1528.24, "end": 1533.48, "removals": []},
            {"start": 1536.04, "end": 1544.46, "removals": []},
        ],
    },
    {
        "slug": "tao-dont-be-that-guy",
        "title": "TAO Under $200: Don't Be That Guy",
        "segments": [
            {"start": 819.88, "end": 886.96, "removals": [
                (828.80, 830.06), (832.76, 833.18), (836.64, 837.12), (839.38, 841.52),
                (842.84, 845.60), (863.32, 866.46), (871.50, 872.40),
            ]},
            {"start": 909.84, "end": 917.58, "removals": []},
            {"start": 1049.12, "end": 1054.20, "removals": []},
        ],
    },
    {
        "slug": "ton-gram-rename",
        "title": "I'd Be a TON Maxi If Kaspa Never Existed",
        "segments": [
            {"start": 935.18, "end": 963.50, "removals": []},
            {"start": 967.94, "end": 1007.66, "removals": [(976.32, 981.88), (990.46, 991.96), (995.62, 998.38)]},
        ],
    },
]


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


def complement(s, e, removes):
    rs = sorted([(max(s, a), min(e, b)) for a, b in removes if b > s and a < e])
    keeps = []
    cur = s
    for a, b in rs:
        if a > cur:
            keeps.append((cur, a))
        cur = max(cur, b)
    if cur < e:
        keeps.append((cur, e))
    return [(a, b) for a, b in keeps if b - a > 0.05]


def render(keeps, out_path, work):
    parts = []
    for i, (a, b) in enumerate(keeps):
        d = b - a
        fo = max(0.0, d - FADE)
        af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
        t = os.path.join(work, f"k{i:03d}.mp4")
        r = subprocess.run([
            "ffmpeg", "-y", "-ss", f"{a:.3f}", "-i", MASTER, "-t", f"{d:.3f}",
            "-af", af, "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", t,
        ], capture_output=True, text=True)
        if r.returncode == 0:
            parts.append(t)
        else:
            print("   seg err:", r.stderr[-300:])
    lst = os.path.join(work, "c.txt")
    with open(lst, "w", encoding="utf-8") as f:
        for t in parts:
            f.write(f"file '{t.replace(os.sep, '/')}'\n")
    out = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out_path],
                         capture_output=True, text=True)
    return out.returncode == 0


def main():
    cut_results = json.load(open(os.path.join(OUTBASE, "_cut_results.json"), encoding="utf-8"))
    full_dur = {r["slug"]: r["duration"] for r in cut_results}

    log = []
    for plan in PLANS:
        slug = plan["slug"]
        all_keeps = []
        removed_log = []
        raw_kept_before = 0.0
        for seg in plan["segments"]:
            s, e = seg["start"], seg["end"]
            raw_kept_before += e - s
            keeps = complement(s, e, seg["removals"])
            all_keeps.extend(keeps)
            for a, b in seg["removals"]:
                removed_log.append({"start": round(a, 2), "end": round(b, 2)})
        out_dir = os.path.join(OUTBASE, slug)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "tightened.mp4")
        with tempfile.TemporaryDirectory() as work:
            ok = render(all_keeps, out_path, work)
        final = dur(out_path) if ok else 0.0
        before = full_dur.get(slug, raw_kept_before)
        pct = (1 - final / before) * 100 if before else 0
        print(f"  {slug:24s} {before:6.1f}s -> {final:6.1f}s (-{pct:.1f}%, {len(removed_log)} cuts) {'OK' if ok else 'FAIL'}")
        log.append({
            "slug": slug, "title": plan["title"],
            "full_dur": round(before, 2), "tightened_dur": round(final, 2),
            "tight_removed_pct": round(pct, 1), "n_removals": len(removed_log),
            "removed": removed_log, "keeps": len(all_keeps), "ok": ok,
        })

    with open(os.path.join(OUTBASE, "tighten_log.json"), "w", encoding="utf-8") as f:
        json.dump(log, f, indent=2)

    # rebuild dashboard.html IN PLACE, status='raw' still (desilence runs next; single combined
    # review happens after Phase 5B per this run's instruction to run both back to back)
    clips = []
    for c in log:
        clips.append({
            "title": c["title"],
            "video": f"{c['slug']}/tightened.mp4",
            "variant": "full",
            "status": "raw",
            "duration": c["tightened_dur"],
            "src": f"tightened -{c['tight_removed_pct']:.1f}% ({c['n_removals']} cuts)",
            "note": "Tightened (Phase 5). Desilence (Phase 5B) runs next before this dashboard reflects final status.",
        })
    build_dashboard(BATCH, OUTBASE, clips, title="New Bottom batch")
    print("DONE")


if __name__ == "__main__":
    main()
