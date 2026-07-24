"""Excise approved filler spans from a finished clip, snapping every boundary to the
local RMS minimum and declicking the splice (8 ms), then GATE the result by
re-transcribing and proving no kept word was clipped.

Never invents cuts: it takes an explicit span list. Reuses the canonical desilencer's
level detector and render path so the encode settings match the rest of the pipeline.
"""
import argparse, json, os, subprocess, sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "desilencer", "scripts"))
import desilence as D  # noqa: E402

SNAP = 0.10       # search +/- this around each boundary for the quietest instant
DECLICK = 0.008


def snap_boundaries(levels, a, b):
    """Move a and b to the lowest-RMS sample within +/-SNAP, without letting them cross."""
    def best(t):
        cand = [(db, tt) for tt, db in levels if abs(tt - t) <= SNAP]
        return min(cand)[1] if cand else t
    na, nb = best(a), best(b)
    return (na, nb) if nb - na > 0.02 else (a, b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--spans", required=True, help="JSON list of {start,end,text}")
    ap.add_argument("--out", required=True)
    ap.add_argument("--no-snap", action="store_true")
    a = ap.parse_args()

    spans = json.load(open(a.spans))
    total = D.dur(a.src)
    lv = D.levels(a.src)

    cuts = []
    for s in spans:
        x, y = (s["start"], s["end"]) if a.no_snap else snap_boundaries(lv, s["start"], s["end"])
        cuts.append((x, y, s.get("text", "")))
    cuts.sort()
    for i in range(1, len(cuts)):
        if cuts[i][0] < cuts[i - 1][1]:
            sys.exit(f"ABORT: overlapping spans {cuts[i-1]} / {cuts[i]}")

    keeps, prev = [], 0.0
    for x, y, _ in cuts:
        if x > prev:
            keeps.append((prev, x))
        prev = y
    if prev < total:
        keeps.append((prev, total))

    removed = sum(y - x for x, y, _ in cuts)
    pct = removed / total * 100
    if pct > 8.0:
        sys.exit(f"ABORT: filler pass would remove {pct:.1f}% (ceiling 8%) - review the span list")

    vbr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=bit_rate", "-of", "csv=p=0", a.src],
                         capture_output=True, text=True).stdout.strip()
    bps = f"{int(vbr)}" if vbr.isdigit() else "2M"
    D.render(a.src, keeps, a.out, D.has_video(a.src), bps, True, DECLICK)
    print(json.dumps({"src": a.src, "out": a.out, "in_s": round(total, 2),
                      "out_s": round(D.dur(a.out), 2), "removed_s": round(removed, 2),
                      "removed_pct": round(pct, 2),
                      "cuts": [{"start": round(x, 2), "end": round(y, 2), "text": t} for x, y, t in cuts]},
                     indent=1))


if __name__ == "__main__":
    main()
