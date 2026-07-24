"""Phase 5 tighten + Phase 5B desilence for the 'October-pumps' batch.

Reads the tighten-strategist's plan at shorts/October-pumps/tighten-plan.json, executes it against
the VERTICAL MASTER at absolute timestamps (never against the preview), then runs the ONE canonical
desilencer on the result.

Per clip:
  1. take the clip's segments from clip-plan.json IN assembly_order, apply any boundary_relock
  2. subtract the strategist's `removals` spans -> keep spans
  3. render each keep span from the MASTER with an 8 ms declick fade in/out, concat in order
     -> <slug>/<slug>-tightened.mp4
  4. desilence a COPY of that via scripts/delete_silences.py (thin wrapper around the canonical
     dual-threshold desilencer) -> <slug>/<slug>-tightened-desilenced.mp4
  5. log every removed span to tighten_log.json (auditable)
Finally rebuilds the ONE dashboard.html IN PLACE via the canonical builder (never a second file).

ORDER IS LOAD-BEARING: raw cut -> tighten -> desilence. Silence removal only removes gaps; the
tighten pass is what removes spoken content.

DIFFERENCES vs the clarity-act script this is modelled on:
  * clip ids come from `id` (not `slug`), and each clip carries a STABLE dashboard number `n`
    (Mike deleted clip 5, and per the dashboard convention the rest do NOT renumber: 1,2,3,4,6,7,8).
  * `boundary_relock` is a LIST of {segment_index,new_start,new_end} (all empty this run).
  * segments are emitted in `assembly_order`; clip 2 is deliberately NON-CHRONOLOGICAL.
"""
import json, os, subprocess, sys, tempfile, shutil

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
BATCH = "October-pumps"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\October-pumps\October-pumps LOW BPS VERTICAL.mp4")
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
CLIP_PLAN = os.path.join(OUTDIR, "clip-plan.json")
TIGHTEN_PLAN = os.path.join(OUTDIR, "tighten-plan.json")
DESILENCE = os.path.join(REPO, r"video-creation\livestream-repurpose\scripts\delete_silences.py")
TRANSCRIPT = os.path.join(REPO, r"video-creation\livestream-repurpose\transcripts"
                                r"\October-pumps LOW BPS VERTICAL\October-pumps LOW BPS VERTICAL.json")

FADE = 0.008   # 8 ms declick, same anti-pop technique as the desilencer
CAP = 0.15     # hard ceiling on VOICED content removal (boundary re-lock is uncapped and excluded)

sys.path.insert(0, os.path.join(REPO, "video-creation", "shorts", "_tooling"))
from build_clip_dashboard import build_dashboard

ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18",
       "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero"]

# Whisper word spans: the source of truth for what counts as "content" in the ceiling gate below.
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

print("== Phase 5 tighten + 5B desilence (October-pumps) ==")

# Optional clip filter: `python tighten_clips_october_pumps.py <id> [<id> ...]` re-renders only
# those clips and reuses the previous tighten_log entries for the rest, so a single QA-driven
# correction does not force a full 7-clip re-render. The dashboard is still rebuilt from the
# COMPLETE set, in place, exactly as the convention requires.
only = set(sys.argv[1:])
prev_log = {}
_log_path = os.path.join(OUTDIR, "tighten_log.json")
if only and os.path.exists(_log_path):
    with open(_log_path, encoding="utf-8") as f:
        prev_log = {e["slug"]: e for e in json.load(f)}
    print(f"   re-rendering ONLY: {', '.join(sorted(only))}")

log, cards = [], []

for t in tighten["clips"]:
    slug = t["id"]
    cp = clip_plan[slug]
    variant = t["variant"]

    # segments IN ASSEMBLY ORDER (clip 2 is deliberately non-chronological)
    order = cp.get("assembly_order") or list(range(len(cp["segments"])))
    segs = [(cp["segments"][i]["start"], cp["segments"][i]["end"]) for i in order]
    raw_dur = sum(b - a for a, b in segs)

    # 1. boundary re-lock (uncapped); list of {segment_index,new_start,new_end}
    for rl in (t.get("boundary_relock") or []):
        k = order.index(rl["segment_index"]) if rl["segment_index"] in order else rl["segment_index"]
        a, b = segs[k]
        segs[k] = (rl.get("new_start", a), rl.get("new_end", b))
    relocked_dur = sum(b - a for a, b in segs)

    # 2. content removals, guarded by the hard ceiling.
    #    MECHANICAL GATE: the Phase 5 ceiling is on CONTENT removal, not wall-clock span time.
    #    A span bracketing a dead pause would be removed by the desilencer anyway, so measuring raw
    #    span time over-counts and would falsely trip the ceiling. So we measure removed time that
    #    actually overlaps a Whisper WORD, against the clip's total voiced time. Computed here
    #    rather than trusting the strategist's own est_removed_pct.
    # zero-length entries are WITHDRAWN cuts (kept in the plan with a `_dropped` note for the audit
    # trail); drop them here so they neither render nor count toward the ceiling.
    removals = [(r["start"], r["end"]) for r in t.get("removals", []) if r["end"] - r["start"] > 0.001]

    # every removal must land inside a kept segment, else it is a planning error, not a no-op
    for a, b in removals:
        if not any(b > ss and a < se for ss, se in segs):
            raise SystemExit(f"ABORT {slug}: removal {a:.2f}-{b:.2f} falls outside every kept "
                             f"segment {segs}. Have the strategist re-author.")

    voiced_total = sum(overlap(ws, we, ss, se) for ws, we in WORDS for ss, se in segs)
    voiced_cut = sum(overlap(ws, we, max(a, ss), min(b, se))
                     for ws, we in WORDS
                     for a, b in removals for ss, se in segs if b > ss and a < se)
    pct_voiced = voiced_cut / voiced_total if voiced_total else 0
    if pct_voiced > CAP:
        raise SystemExit(f"ABORT {slug}: voiced-content removal is {pct_voiced:.1%}, over the "
                         f"{CAP:.0%} hard ceiling. Have the strategist re-author.")
    if pct_voiced < 0.05:
        print(f"   NOTE {slug}: only {pct_voiced:.1%} of voiced content removed "
              f"(strategist justified this explicitly for the impact cuts).")

    # 3. keep spans, per segment, in assembly order
    keeps = []
    for a, b in segs:
        keeps.extend(complement(a, b, removals))

    d = os.path.join(OUTDIR, slug)
    os.makedirs(d, exist_ok=True)
    tight = os.path.join(d, f"{slug}-tightened.mp4")
    desil = os.path.join(d, f"{slug}-tightened-desilenced.mp4")

    if only and slug not in only and os.path.exists(desil):
        # untouched this pass: keep the existing render, reuse its logged numbers for the dashboard
        p = prev_log.get(slug, {})
        tdur, ddur = p.get("tightened_s", dur(tight)), p.get("desilenced_s", dur(desil))
        print(f"  {t['n']}. {slug:34s} unchanged (reusing existing render, {ddur:.1f}s)")
    else:
        if not render(keeps, tight):
            raise SystemExit(f"render failed for {slug}")
        tdur = dur(tight)

        # 4. desilence a COPY via the canonical desilencer (delete_silences overwrites in place)
        shutil.copyfile(tight, desil)
        r = subprocess.run([sys.executable, DESILENCE, desil], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit(f"desilence failed for {slug}:\n{r.stdout}\n{r.stderr[-800:]}")
        ddur = dur(desil)

    pct_span = (1 - tdur / relocked_dur) * 100 if relocked_dur else 0
    pct_total = (1 - ddur / raw_dur) * 100 if raw_dur else 0
    print(f"  {t['n']}. {slug:34s} raw {raw_dur:6.1f}s -> tight {tdur:6.1f}s "
          f"({len(removals)} cuts, -{pct_span:.1f}% wall / -{pct_voiced * 100:.1f}% VOICED) "
          f"-> desil {ddur:6.1f}s (total -{pct_total:.1f}%)")

    log.append({
        "n": t["n"], "slug": slug, "variant": variant,
        "raw_s": round(raw_dur, 1), "relocked_s": round(relocked_dur, 1),
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
        n=t["n"], title=cp["title"],
        video=f"{slug}/{slug}-tightened-desilenced.mp4", variant=variant,
        status="tightened+desilenced", duration=ddur,
        src=f"{cp['hook_type']} - {'multi-snippet' if cp['multi_snippet'] else 'contiguous'} - "
            f"raw {raw_dur:.0f}s -> {ddur:.0f}s (-{pct_total:.0f}% total; {len(removals)} "
            f"tighten cuts = -{pct_voiced * 100:.0f}% voiced content)",
        note=cp["hook_summary"] + "  |  TIGHTEN: " + t.get("notes", ""),
    ))

with open(os.path.join(OUTDIR, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

path = build_dashboard(
    BATCH, OUTDIR, cards,
    title="October-pumps (October front-run + WHATIF/meme basket, 2026-07-21)",
    subtitle_extra="Phase 5 tightened + 5B desilenced; clip 5 deleted (numbers do NOT renumber); "
                   "awaiting Mike's 2nd review before any Remotion build")

prog_path = os.path.join(OUTDIR, "progress.json")
with open(prog_path, encoding="utf-8") as f:
    prog = json.load(f)
prog["phase"] = "5B-desilenced-awaiting-review"
prog["status"] = "awaiting_review"
prog["tighten_log"] = f"video-creation/shorts/{BATCH}/tighten_log.json"
prog["tighten_plan"] = f"video-creation/shorts/{BATCH}/tighten-plan.json"
for c in prog["clips"]:
    e = next((x for x in log if x["slug"] == c["slug"]), None)
    if e:
        c["duration"] = e["desilenced_s"]
        c["output_mp4"] = f"{c['slug']}/{c['slug']}-tightened-desilenced.mp4"
        c["status"] = "tightened+desilenced"
prog["resume_protocol"] = ("Mike reviews the tightened+desilenced clips on dashboard.html. ONLY on "
                           "his go-ahead: Phase 6 captions -> Phase 7 render (remotion-builder "
                           "subagent, one per clip) -> Phase 8 publish-shorts.")
with open(prog_path, "w", encoding="utf-8") as f:
    json.dump(prog, f, indent=2)

print(f"\nDashboard: {path}")
