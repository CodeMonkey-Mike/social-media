"""Phase 4 clip cutter for the 'October-pumps' livestream batch
(source: Tuesday stream 2026-07-21, folder 'October-pumps').

Reads the strategist plan at shorts/October-pumps/clip-plan.json (authored by the clip-strategist
subagent), cuts each clip from the VERTICAL master (re-encode, never -c copy), concats
multi-snippet clips via the concat demuxer IN assembly_order (clip 2 is deliberately
non-chronological), writes shorts/<batch>/<slug>/<slug>-<variant>.mp4, then builds the dashboard
through the CANONICAL builder (shorts/_tooling/build_clip_dashboard.py) and writes progress.json.

Numbering per the dashboard convention: all `full` clips first (1..k, by rank), then all `impact`
clips (k+1..).

Per-run override (Mike, 2026-07-22): best 5 topics / MAX 8 clips, and this run STOPS at clip
generation. No tighten / desilence / captions / render / publish.
"""
import os, subprocess, json, sys

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
BATCH = "October-pumps"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\October-pumps\October-pumps LOW BPS VERTICAL.mp4")
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
PLAN = os.path.join(OUTDIR, "clip-plan.json")
SRC_MEDIA = "video-creation/livestream-repurpose/media/October-pumps/October-pumps LOW BPS VERTICAL.mp4"
TRANSCRIPTS_DIR = "video-creation/livestream-repurpose/transcripts/October-pumps LOW BPS VERTICAL"

sys.path.insert(0, os.path.join(REPO, "video-creation", "shorts", "_tooling"))
from build_clip_dashboard import build_dashboard

ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18",
       "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero"]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", " ".join(str(c) for c in cmd), "\n", r.stderr[-1500:])
        sys.exit(1)


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


def tc(s, e):
    return f"{int(s//60):02d}:{s%60:05.2f}-{int(e//60):02d}:{e%60:05.2f}"


with open(PLAN, encoding="utf-8") as f:
    plan = json.load(f)

assert len(plan["clips"]) <= plan["constraints"]["max_clips"], "plan exceeds the max_clips ceiling"
assert len({c["topic"].split(":")[0] for c in plan["clips"] if c["variant"] == "full"}) \
    <= plan["constraints"]["max_topics"], "plan exceeds the max_topics ceiling"

os.makedirs(OUTDIR, exist_ok=True)

# dashboard order: all fulls (by rank), then all impacts (by rank)
ordered = sorted(plan["clips"], key=lambda c: (0 if c["variant"] == "full" else 1, c["rank"]))

cards, prog_clips = [], []

for n, clip in enumerate(ordered, start=1):
    slug = clip["id"]
    variant = clip["variant"]
    d = os.path.join(OUTDIR, slug)
    os.makedirs(d, exist_ok=True)
    out = os.path.join(d, f"{slug}-{variant}.mp4")

    # honour assembly_order: the short's segments play in THIS order, not stream order
    order = clip.get("assembly_order") or list(range(len(clip["segments"])))
    snips = [(clip["segments"][i]["start"], clip["segments"][i]["end"]) for i in order]

    if len(snips) == 1:
        s, e = snips[0]
        run(["ffmpeg", "-y", "-ss", f"{s:.3f}", "-to", f"{e:.3f}", "-i", MASTER, *ENC, out])
    else:
        parts = []
        for i, (s, e) in enumerate(snips):
            p = os.path.join(d, f"_part{i}.mp4")
            run(["ffmpeg", "-y", "-ss", f"{s:.3f}", "-to", f"{e:.3f}", "-i", MASTER, *ENC, p])
            parts.append(p)
        listf = os.path.join(d, "_concat.txt")
        with open(listf, "w", encoding="utf-8") as f:
            for p in parts:
                f.write(f"file '{p.replace(os.sep, '/')}'\n")
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf, "-c", "copy", out])
        for p in parts:
            os.remove(p)
        os.remove(listf)

    dd = dur(out)
    codes = " + ".join(tc(s, e) for s, e in snips)
    shape = ("multi-snippet, assembled " + str(order)) if clip["multi_snippet"] else "contiguous"
    src = f"{clip['hook_type']} - {shape} - {codes}"
    # NB: build_clip_dashboard numbers the cells itself ("Clip N"); do not prefix the title.
    cards.append(dict(title=clip["title"], video=f"{slug}/{slug}-{variant}.mp4",
                      variant=variant, status="raw", duration=dd, src=src,
                      note=clip["hook_summary"] + "  |  " + clip["notes"]))
    prog_clips.append(dict(n=n, slug=slug, title=clip["title"], topic=clip["topic"], variant=variant,
                           timecodes=codes, duration=round(dd, 1), approved=None,
                           output_mp4=f"{slug}/{slug}-{variant}.mp4", note=clip["notes"]))
    print(f"  {n}. {slug:34s} {variant:6s} {dd:6.1f}s  [{codes}]")

path = build_dashboard(BATCH, OUTDIR, cards,
                       title="October-pumps (October front-run + WHATIF/meme basket, 2026-07-21)",
                       subtitle_extra="per-run override: best 5 topics / MAX 8 shorts; run stops at clip generation")

prog = {
    "batch": BATCH, "phase": "4-clip-review", "status": "awaiting_review",
    "source_master": SRC_MEDIA,
    "transcripts_dir": TRANSCRIPTS_DIR,
    "clip_plan": f"video-creation/shorts/{BATCH}/clip-plan.json",
    "dashboard": f"video-creation/shorts/{BATCH}/dashboard.html",
    "topics": 5,
    "clips": prog_clips,
    "run_override": "Mike 2026-07-22 (/repurpose-livestream): best 5 topics, max 8 clips, and this run STOPS at clip generation. Do NOT tighten / desilence / caption / render / publish without a new instruction.",
    "resume_protocol": "Mike reviews dashboard.html and approves clips + in/out points. Only on his go-ahead: Phase 5 tighten -> 5B desilence -> 6 captions -> 7 render (remotion-builder subagent, one per clip) -> 8 publish-shorts.",
}
with open(os.path.join(OUTDIR, "progress.json"), "w", encoding="utf-8") as f:
    json.dump(prog, f, indent=2)

print(f"\nDashboard: {path}")
