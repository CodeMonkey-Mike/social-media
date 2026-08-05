"""tighten_clips_peachminute.py - Phase 5 tighten pass for batch 'peach-minute'.

Applies the tighten-strategist plans (boundary relock + interior content-removal spans,
authored against the master word-level transcript) to the 4 surviving clips. Cuts from the
MASTER vertical at absolute timestamps (cleanest quality), re-encodes each kept span with an
8ms declick fade in/out, concats, writes <slug>/tightened.mp4.
Logs every removed span to tighten_log.json and rebuilds shorts/peach-minute/dashboard.html
IN PLACE. Does NOT run silence removal (that is Phase 5B, a separate step).

Mike deleted clips 1, 6, 7, 8 on 2026-07-29; numbering is frozen (2, 3, 4, 5).
"""
import json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "shorts", "_tooling"))
from build_clip_dashboard import build_dashboard

VC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation"
BATCH = "peach-minute"
MASTER = os.path.join(VC, "livestream-repurpose", "media", "peach-minute",
                      "peach-minute LOW BPS VERTICAL.mp4")
OUTBASE = os.path.join(VC, "shorts", BATCH)
FADE = 0.008

# ── tighten-strategist plans (one per clip, authored against the master transcript) ──
PLANS = [
    {
        "slug": "02-the-pain-stick-through", "n": 2,
        "title": "If You Can Stick Through This Pain, You Win",
        "segments": [
            {"start": 2063.10, "end": 2125.72, "removals": [
                (2067.06, 2068.96), (2075.62, 2077.08), (2087.76, 2090.08), (2099.74, 2102.16)]},
        ],
    },
    {
        "slug": "03-kaspa-hate-bottom-signal", "n": 3,
        "title": "Three Out of Ten Kaspa Comments Are Negative Now",
        "segments": [
            {"start": 652.86, "end": 714.95, "removals": [
                (653.66, 656.30), (673.46, 674.56), (688.00, 692.56)]},
        ],
    },
    {
        "slug": "04-i-was-a-zombie", "n": 4,
        "title": "Kaspa $1 by the end of the year",
        "segments": [
            {"start": 2212.10, "end": 2280.42, "removals": [
                (2227.12, 2227.78), (2231.38, 2233.50), (2257.42, 2257.74), (2261.54, 2264.56)]},
        ],
    },
    {
        "slug": "05-housecoin-still-holding", "n": 5,
        "title": "Kraken Is Delisting Housecoin. I'm Still Holding.",
        "segments": [
            {"start": 196.40, "end": 213.08, "removals": [
                (197.94, 200.16), (208.28, 208.52), (209.64, 210.72)]},
            {"start": 233.80, "end": 252.18, "removals": [(235.92, 238.34)]},
            {"start": 359.50, "end": 368.60, "removals": []},
        ],
    },
]


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


def keeps(seg):
    """Segment minus its removal spans -> list of (start, end) keep spans."""
    out, cur = [], seg["start"]
    for a, b in sorted(seg["removals"]):
        if a > cur:
            out.append((cur, a))
        cur = max(cur, b)
    if cur < seg["end"]:
        out.append((cur, seg["end"]))
    return out


def main():
    log = []
    cards = []
    for plan in PLANS:
        slug = plan["slug"]
        d = os.path.join(OUTBASE, slug)
        os.makedirs(d, exist_ok=True)
        spans = []
        for seg in plan["segments"]:
            spans.extend(keeps(seg))
        parts = []
        with tempfile.TemporaryDirectory() as tmp:
            for i, (st, en) in enumerate(spans):
                f = os.path.join(tmp, f"k{i:03d}.mp4")
                ln = en - st
                subprocess.run([
                    "ffmpeg", "-y", "-ss", f"{st}", "-to", f"{en}", "-i", MASTER,
                    "-af", f"afade=t=in:st=0:d={FADE},afade=t=out:st={max(0, ln - FADE)}:d={FADE}",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                    "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", f
                ], check=True, capture_output=True)
                parts.append(f)
            listf = os.path.join(tmp, "list.txt")
            with open(listf, "w", encoding="utf-8") as fh:
                for f in parts:
                    fh.write(f"file '{f.replace(os.sep, '/')}'\n")
            out = os.path.join(d, "tightened.mp4")
            subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
                            "-c", "copy", out], check=True, capture_output=True)
        raw = sum(s["end"] - s["start"] for s in plan["segments"])
        od = dur(out)
        removed = raw - od
        pct = 100.0 * removed / raw
        log.append({"slug": slug, "n": plan["n"], "title": plan["title"],
                    "raw_seconds": round(raw, 2), "tightened_seconds": round(od, 2),
                    "removed_seconds": round(removed, 2), "pct_removed": round(pct, 2),
                    "keep_spans": [[round(a, 2), round(b, 2)] for a, b in spans],
                    "removals": [[round(a, 2), round(b, 2)] for s in plan["segments"] for a, b in s["removals"]]})
        cards.append({"n": plan["n"], "title": plan["title"], "video": f"{slug}/tightened.mp4",
                      "variant": "full", "status": "tightened+desilenced" if False else "raw",
                      "duration": od,
                      "src": f'{len(spans)} keep span(s) from master &middot; tightened {raw:.1f}s -> {od:.1f}s ({pct:.1f}% removed)',
                      "note": "Phase 5 tighten applied (tighten-strategist plan). Desilence pending."})
        print(f"  clip {plan['n']} {slug:30s} {raw:6.1f}s -> {od:6.1f}s  (-{removed:5.1f}s / {pct:5.1f}%)")
    json.dump(log, open(os.path.join(OUTBASE, "tighten_log.json"), "w", encoding="utf-8"), indent=2)
    print("dashboard ->", build_dashboard(
        BATCH, OUTBASE, cards, title="peach-minute (livestream 2026-07-27)",
        subtitle_extra="Mike deleted clips 1, 6, 7, 8; numbering frozen. Phase 5 tighten applied"))
    print("DONE")


if __name__ == "__main__":
    main()
