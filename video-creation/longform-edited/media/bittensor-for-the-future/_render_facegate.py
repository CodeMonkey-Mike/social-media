"""One-pass render from the ORIGINAL mkv: defumble cuts (_cuts.txt) + gated-face blackout.
Keep spans = complement of _cuts.txt over [0,total]. After concat, a full-frame black drawbox is
enabled during every COVER span (= complement of the FACE chunk spans, EDIT timeline). FACE chunks are
tagged from SCREENPLAY.md. Audio plays throughout. Output 6M edit-quality.
  --dry  : print face/cover spans (with EDIT chunk text) and exit, no render."""
import json, os, subprocess, sys

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "2026-06-17 11-40-46.mkv")
OUT = os.path.join(BASE, "2026-06-17 11-40-46 GATED.mp4")
EDITMAP = json.load(open(os.path.join(BASE, "2026-06-17 11-40-46 EDIT._chunkmap.json"), encoding="utf-8"))
TOTAL_SRC = 2715.333
PAD = 0.4  # max seconds of face shown before/after speech (transition still lands in silence)

# EDIT-timeline chunk indices where Mike's face is on screen (from SCREENPLAY.md [FACE] beats)
FACE = {
 0,1,2, 11, 21,                                   # CH1 cold open
 22, 72,73,74,75,76,77,78,79,80,                  # CH2 setup + "one company/one switch/anyone"
 83,84,85, 104,105,106,107,108,109,               # CH3 1992 thesis + "who owns it"
 123,124,125, 144,145,146,147, 182,183,184,       # CH4 scourge / nobody owns it / "plainly...not a preference"
 253,254,255,256,257,258,259,260,                 # CH5 bring-it-home / no off switch
 269,270,271, 274,275,                            # CH6 "it moved" / "saw it coming"
 276,277,278,279,280,281,282,283,284,285,286,     # CH7 mid-roll plug (face throughout)
 287,288, 312, 322,323,                           # CH8 two ways / "Bitcoin at $200" / "not a trade"
 332,333,334,335,336,337, 342,343,                # CH9 inevitability + CTA
}

def mid(s): return (s[0] + s[1]) / 2.0

# ---- defumble keep spans (complement of _cuts.txt) ----
cuts = []
for ln in open(os.path.join(BASE, "_cuts.txt"), encoding="utf-8"):
    ln = ln.strip()
    if ln and "-" in ln:
        a, b = ln.split("-"); cuts.append((float(a), float(b)))
cuts.sort()
keeps, cur = [], 0.0
for a, b in cuts:
    if a > cur: keeps.append((cur, a))
    cur = max(cur, b)
if cur < TOTAL_SRC: keeps.append((cur, TOTAL_SRC))
total_edit = sum(b - a for a, b in keeps)

# ---- face spans (EDIT timeline), padded, merged across consecutive face chunks ----
chunks = {c["i"]: c for c in EDITMAP}
face_idx = sorted(FACE)
runs, run = [], [face_idx[0]]
for i in face_idx[1:]:
    if i == run[-1] + 1: run.append(i)
    else: runs.append(run); run = [i]
runs.append(run)
face_spans = []
for r in runs:
    c0, c1 = chunks[r[0]], chunks[r[-1]]
    a = max(mid(c0["sil_before"]), c0["start"] - PAD)
    b = min(mid(c1["sil_after"]), c1["end"] + PAD)
    face_spans.append((max(0.0, a), min(total_edit, b)))
face_spans.sort()

# ---- cover spans = complement of face over [0,total_edit] ----
cover, cur = [], 0.0
for a, b in face_spans:
    if a > cur: cover.append((cur, a))
    cur = max(cur, b)
if cur < total_edit: cover.append((cur, total_edit))

if "--dry" in sys.argv:
    print(f"edit duration {total_edit:.1f}s | {len(face_spans)} FACE spans | {len(cover)} COVER(black) spans\n")
    print("=== FACE (video shown) ===")
    for r in runs:
        t = " ".join(chunks[i]["text"].strip() for i in r)
        print(f"  [{r[0]:>3}-{r[-1]:<3}] {chunks[r[0]]['start']:7.1f}-{chunks[r[-1]]['end']:7.1f}  {t[:90]}")
    print(f"\nblack covers {sum(b-a for a,b in cover):.0f}s / {total_edit:.0f}s "
          f"({100*sum(b-a for a,b in cover)/total_edit:.0f}% of runtime)")
    sys.exit(0)

# ---- build filter: trim/atrim/concat -> drawbox(cover) ----
parts, labels = [], []
for i, (a, b) in enumerate(keeps):
    d = b - a
    fade = f",afade=t=in:st=0:d=0.008,afade=t=out:st={max(0.0,d-0.008):.3f}:d=0.008" if d > 0.02 else ""
    parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}];")
    parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS{fade}[a{i}];")
    labels.append(f"[v{i}][a{i}]")
parts.append("".join(labels) + f"concat=n={len(keeps)}:v=1:a=1[cv][outa];")
enable = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in cover)
parts.append(f"[cv]drawbox=x=0:y=0:w=iw:h=ih:color=black@1.0:t=fill:enable='{enable}'[outv]")
fc = os.path.join(BASE, "_facegate.filter.txt")
open(fc, "w", encoding="utf-8").write("\n".join(parts))

print(f"render: {len(keeps)} keeps, {len(cover)} black covers -> {OUT}")
r = subprocess.run(["ffmpeg", "-y", "-i", SRC, "-filter_complex_script", fc,
                    "-map", "[outv]", "-map", "[outa]",
                    "-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", "6M",
                    "-maxrate", "8M", "-bufsize", "16M", "-preset", "p5",
                    "-c:a", "aac", "-b:a", "160k", OUT], capture_output=True, text=True)
os.remove(fc)
if r.returncode != 0:
    print("FFMPEG FAIL:\n", r.stderr[-2000:]); sys.exit(1)
od = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",OUT]).decode().strip())
print(f"DONE -> {OUT}  ({od:.1f}s)")
