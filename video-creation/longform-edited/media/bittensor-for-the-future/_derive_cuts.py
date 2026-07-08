"""Derive the remove-span cut list from the DROP set. Each whole-chunk drop-run becomes ONE span
from midpoint(sil_before of first dropped chunk) to midpoint(sil_after of last dropped chunk),
so every edge sits in a silence. Then append the 3 verified tail-trim spans. Writes _cuts.txt."""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
chunks = {c["i"]: c for c in json.load(open(os.path.join(BASE, "2026-06-17 11-40-46.proxy._chunkmap.json"), encoding="utf-8"))}

DROP = {
 2, 4,5,6, 21, 23,24,25,26,27, 29, 33,34,35, 37,38, 42,43,44,47, 55,56, 62,
 65,66,67,68, 77, 89,90, 106,107,108,109,110,111,112,113, 120, 122,
 141,142,143,144, 162, 168, 172,
 181,182,183,184,185,186,187,188,189,190,194,195, 200, 206, 217, 219, 222, 225,
 228,229,230,231,232,233,234,235,236,237, 246,247,248, 255,256, 258, 262, 264,265,
 274, 277, 279, 282, 289, 292, 305,306,307, 309,310,311,312,313,314,315,316,317,
 322,323, 335,336, 341, 344, 346,347, 350,351, 359,360,361,362, 364,365,366, 371,
 373,374, 377,378,379,380, 384,385,386, 393, 396, 398,399, 402, 404, 408,409, 412, 414,
 416, 425,426, 428, 433,434,435,436, 441, 445, 449,450, 453,454, 461, 463,464, 473,
 479,480, 483, 492,493,494,495,496,497,498, 504, 506,507,508,509,510,511,
}
# NOTE: 516 kept (Mike), 396 + 483 added (Mike), tail-trims handled below.

def mid(span):
    return (span[0] + span[1]) / 2.0

# contiguous runs of dropped indices
ds = sorted(DROP)
runs, run = [], [ds[0]]
for i in ds[1:]:
    if i == run[-1] + 1:
        run.append(i)
    else:
        runs.append(run); run = [i]
runs.append(run)

cuts = []
for r in runs:
    a = mid(chunks[r[0]]["sil_before"])
    b = mid(chunks[r[-1]]["sil_after"])
    cuts.append((a, b))

# verified word-safe tail trims (front = inter-word gap midpoint, back = silence midpoint before next chunk)
cuts += [(77.45, 80.22), (1531.86, 1533.88), (1606.51, 1608.59)]
cuts.sort()

# sanity: no overlaps
for (a1, b1), (a2, b2) in zip(cuts, cuts[1:]):
    assert b1 <= a2, f"OVERLAP {b1} > {a2}"

total = 2715.333
removed = sum(b - a for a, b in cuts)
print(f"{len(cuts)} cut spans, removing {removed:.1f}s -> result ~{total-removed:.1f}s ({(total-removed)/60:.1f} min)")
with open(os.path.join(BASE, "_cuts.txt"), "w", encoding="utf-8") as f:
    for a, b in cuts:
        f.write(f"{a:.3f}-{b:.3f}\n")
print("wrote _cuts.txt")
