"""Phase 5 tighten + Phase 5B desilence for the 'clarity-act' batch.

Reads the tighten-strategist's plan at shorts/clarity-act/tighten-plan.json, executes it against
the VERTICAL MASTER at absolute timestamps (never against the preview), then runs the ONE canonical
desilencer on the result.

Per clip:
  1. take the clip's segments from clip-plan.json, apply the strategist's boundary_relock
  2. subtract the strategist's `removals` spans -> keep spans
  3. render each keep span from the MASTER with an 8 ms declick fade in/out, concat in order
     -> <slug>/tightened.mp4
  4. desilence a copy of that via scripts/delete_silences.py (the thin wrapper around the canonical
     dual-threshold desilencer) -> <slug>/tightened-desilenced.mp4
  5. log every removed span to tighten_log.json (auditable)
Finally rebuilds the ONE dashboard.html IN PLACE via the canonical builder (never a second file).

ORDER IS LOAD-BEARING: raw cut -> tighten -> desilence. Silence removal only removes gaps; the
tighten pass is what removes spoken content.
"""
import json, os, subprocess, sys, tempfile, shutil

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
BATCH = "clarity-act"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\clarity-act\clarity-act LOW BPS VERTICAL.mp4")
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
CLIP_PLAN = os.path.join(OUTDIR, "clip-plan.json")
TIGHTEN_PLAN = os.path.join(OUTDIR, "tighten-plan.json")
DESILENCE = os.path.join(REPO, r"video-creation\livestream-repurpose\scripts\delete_silences.py")

FADE = 0.008   # 8 ms declick, same anti-pop technique as the desilencer
CAP = 0.15     # hard ceiling on content removal (boundary re-lock is uncapped and excluded)

sys.path.insert(0, os.path.join(REPO, "video-creation", "shorts", "_tooling"))
from build_clip_dashboard import build_dashboard

ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18",
       "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero"]


TRANSCRIPT = os.path.join(REPO, r"video-creation\livestream-repurpose\transcripts"
                                r"\clarity-act LOW BPS VERTICAL\clarity-act LOW BPS VERTICAL.json")

# Whisper word spans, the source of truth for what counts as "content" in the ceiling gate below.
with open(TRANSCRIPT, encoding="utf-8") as f:
    WORDS = [(w.get("start", seg["start"]), w.get("end", seg["end"]))
             for seg in json.load(f)["segments"] for w in seg.get("words", [])]


def overlap(a1, a2, b1, b2):
    return max(0.0, min(a2, b2) - max(a1, b1))


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


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


def render(keeps, out_path):
    """Cut each keep span from the MASTER with an 8 ms declick, then concat."""
    with tempfile.TemporaryDirectory() as work:
        parts = []
        for i, (a, b) in enumerate(keeps):
            d = b - a
            fo = max(0.0, d - FADE)
            af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
            t = os.path.join(work, f"k{i:03d}.mp4")
            r = subprocess.run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-i", MASTER, "-t", f"{d:.3f}",
                                "-af", af, *ENC, t], capture_output=True, text=True)
            if r.returncode != 0:
                print("   seg err:", r.stderr[-300:])
                return False
            parts.append(t)
        lst = os.path.join(work, "concat.txt")
        with open(lst, "w", encoding="utf-8") as f:
            for t in parts:
                f.write(f"file '{t.replace(os.sep, '/')}'\n")
        r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                            "-c", "copy", out_path], capture_output=True, text=True)
        if r.returncode != 0:
            print("   concat err:", r.stderr[-300:])
        return r.returncode == 0


with open(CLIP_PLAN, encoding="utf-8") as f:
    clip_plan = {c["id"]: c for c in json.load(f)["clips"]}
with open(TIGHTEN_PLAN, encoding="utf-8") as f:
    tighten = json.load(f)

print("== Phase 5 tighten + 5B desilence (clarity-act) ==")
log, cards = [], []

for t in tighten["clips"]:
    slug = t["slug"]
    cp = clip_plan[slug]
    segs = [(s["start"], s["end"]) for s in cp["segments"]]

    # 1. boundary re-lock (uncapped): applies to the first/last segment edges
    rl = t.get("boundary_relock") or {}
    if rl.get("new_start") is not None:
        segs[0] = (rl["new_start"], segs[0][1])
    if rl.get("new_end") is not None:
        segs[-1] = (segs[-1][0], rl["new_end"])
    relocked_dur = sum(b - a for a, b in segs)
    raw_dur = sum(s["end"] - s["start"] for s in cp["segments"])

    # 2. content removals, guarded by the hard ceiling.
    #    MECHANICAL GATE: the Phase 5 ceiling is on CONTENT removal, not on wall-clock span time.
    #    A span that brackets a dead pause would be removed by the desilencer anyway, so measuring
    #    raw span time over-counts and would falsely trip the ceiling. So we measure the removed
    #    time that actually overlaps a Whisper WORD, against the clip's total voiced time. This is
    #    computed here rather than trusting the strategist's own removed_pct_est.
    removals = [(r["start"], r["end"]) for r in t.get("removals", [])]
    span_t = sum(min(b, se) - max(a, ss)
                 for a, b in removals for ss, se in segs if b > ss and a < se)
    voiced_total = sum(overlap(ws, we, ss, se) for ws, we in WORDS for ss, se in segs)
    voiced_cut = sum(overlap(ws, we, max(a, ss), min(b, se))
                     for ws, we in WORDS
                     for a, b in removals for ss, se in segs if b > ss and a < se)
    pct_voiced = voiced_cut / voiced_total if voiced_total else 0
    if pct_voiced > CAP:
        raise SystemExit(f"ABORT {slug}: voiced-content removal is {pct_voiced:.1%}, over the "
                         f"{CAP:.0%} hard ceiling. Have the strategist re-author.")
    if pct_voiced < 0.05:
        print(f"   WARNING {slug}: only {pct_voiced:.1%} of voiced content removed; the skill calls "
              f"a clip returning -1 to -3% a FAILED tighten.")

    # 3. keep spans, per segment, in assembly order
    keeps = []
    for a, b in segs:
        keeps.extend(complement(a, b, removals))

    d = os.path.join(OUTDIR, slug)
    os.makedirs(d, exist_ok=True)
    tight = os.path.join(d, f"{slug}-tightened.mp4")
    if not render(keeps, tight):
        raise SystemExit(f"render failed for {slug}")
    tdur = dur(tight)

    # 4. desilence a COPY via the canonical desilencer (delete_silences overwrites in place)
    desil = os.path.join(d, f"{slug}-tightened-desilenced.mp4")
    shutil.copyfile(tight, desil)
    r = subprocess.run([sys.executable, DESILENCE, desil], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"desilence failed for {slug}:\n{r.stdout}\n{r.stderr[-800:]}")
    ddur = dur(desil)

    pct_span = (1 - tdur / relocked_dur) * 100 if relocked_dur else 0
    pct_total = (1 - ddur / raw_dur) * 100 if raw_dur else 0
    print(f"  {slug:28s} raw {raw_dur:6.1f}s -> tight {tdur:6.1f}s ({len(t.get('removals', []))} cuts, "
          f"-{pct_span:.1f}% wall / -{pct_voiced * 100:.1f}% VOICED) -> desil {ddur:6.1f}s "
          f"(total -{pct_total:.1f}%)")

    log.append({
        "slug": slug, "raw_s": round(raw_dur, 1), "relocked_s": round(relocked_dur, 1),
        "tightened_s": round(tdur, 1), "desilenced_s": round(ddur, 1),
        "span_removed_pct": round(pct_span, 1),
        "voiced_content_removed_pct": round(pct_voiced * 100, 1),
        "voiced_gate": f"measured against Whisper word spans; ceiling {CAP:.0%}",
        "total_reduction_pct": round(pct_total, 1),
        "boundary_relock": t.get("boundary_relock"),
        "removals": t.get("removals", []),
        "notes": t.get("notes", ""),
    })
    cards.append(dict(
        title=cp["title"], video=f"{slug}/{slug}-tightened-desilenced.mp4", variant="full",
        status="tightened+desilenced", duration=ddur,
        src=f"{cp['hook_type']} - {'multi-snippet' if cp['multi_snippet'] else 'contiguous'} - "
            f"raw {raw_dur:.0f}s -> {ddur:.0f}s (-{pct_total:.0f}% total; {len(t.get('removals', []))} "
            f"tighten cuts = -{pct_voiced * 100:.0f}% voiced content)",
        note=cp["hook_summary"] + "  |  TIGHTEN: " + t.get("notes", ""),
    ))

with open(os.path.join(OUTDIR, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

path = build_dashboard(BATCH, OUTDIR, cards,
                       title="clarity-act (Clarity Act + Robinhood memes, 2026-07-19)",
                       subtitle_extra="Phase 5 tightened + 5B desilenced; awaiting Mike's 2nd review")

prog_path = os.path.join(OUTDIR, "progress.json")
prog = json.load(open(prog_path, encoding="utf-8"))
prog["phase"] = "5B-desilenced-awaiting-review"
prog["status"] = "awaiting_review"
prog["tighten_log"] = f"video-creation/shorts/{BATCH}/tighten_log.json"
for c in prog["clips"]:
    e = next((x for x in log if x["slug"] == c["slug"]), None)
    if e:
        c["duration"] = e["desilenced_s"]
        c["output_mp4"] = f"{c['slug']}/{c['slug']}-tightened-desilenced.mp4"
        c["tightened"] = True
prog["resume_protocol"] = ("Mike reviews the tightened+desilenced clips on dashboard.html. On his "
                           "go-ahead: Phase 6 captions -> Phase 7 render (remotion-builder subagent, "
                           "one per clip) -> Phase 8 publish-shorts.")
with open(prog_path, "w", encoding="utf-8") as f:
    json.dump(prog, f, indent=2)

print(f"\nDashboard (overwritten in place): {path}")
