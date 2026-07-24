"""Phase 4 clip cutter for the 'clarity-act' livestream batch
(source: Sunday stream on the Clarity Act + Robinhood chain memes, folder 'clarity-act').

Reads the strategist plan at shorts/clarity-act/clip-plan.json (authored by the clip-strategist
subagent), cuts each clip from the VERTICAL master (re-encode, never -c copy), concats
multi-snippet clips via the concat demuxer, writes shorts/<batch>/<slug>/<slug>-full.mp4, then
builds the dashboard through the CANONICAL builder (shorts/_tooling/build_clip_dashboard.py) and
writes progress.json.

Per-run override (Mike, 2026-07-19): MAX 3 clips, and this run STOPS at clip generation.
No tighten / desilence / captions / render / publish.
"""
import os, subprocess, json, sys

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
BATCH = "clarity-act"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\clarity-act\clarity-act LOW BPS VERTICAL.mp4")
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
PLAN = os.path.join(OUTDIR, "clip-plan.json")
SRC_MEDIA = "video-creation/livestream-repurpose/media/clarity-act/clarity-act LOW BPS VERTICAL.mp4"
TRANSCRIPTS_DIR = "video-creation/livestream-repurpose/transcripts/clarity-act LOW BPS VERTICAL"

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

os.makedirs(OUTDIR, exist_ok=True)
cards, prog_clips = [], []

for clip in plan["clips"]:
    slug = clip["id"]
    d = os.path.join(OUTDIR, slug)
    os.makedirs(d, exist_ok=True)
    out = os.path.join(d, f"{slug}-full.mp4")
    snips = [(s["start"], s["end"]) for s in clip["segments"]]

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
    src = f"{clip['hook_type']} - {'multi-snippet, assembled ' + str(clip['assembly_order']) if clip['multi_snippet'] else 'contiguous'} - {codes}"
    cards.append(dict(title=clip["title"], video=f"{slug}/{slug}-full.mp4", variant="full",
                      status="raw", duration=dd, src=src,
                      note=clip["hook_summary"] + "  |  " + clip["notes"]))
    prog_clips.append(dict(slug=slug, title=clip["title"], topic=clip["topic"], variant="full",
                           timecodes=codes, duration=round(dd, 1), approved=None,
                           output_mp4=f"{slug}/{slug}-full.mp4", note=clip["notes"]))
    print(f"  {slug:28s} {dd:6.1f}s  [{codes}]")

path = build_dashboard(BATCH, OUTDIR, cards,
                       title="clarity-act (Clarity Act + Robinhood memes, 2026-07-19)",
                       subtitle_extra="per-run override: MAX 3 shorts; run stops at clip generation")

prog = {
    "batch": BATCH, "phase": "4-clip-review", "status": "awaiting_review",
    "source_master": SRC_MEDIA,
    "clip_plan": f"video-creation/shorts/{BATCH}/clip-plan.json",
    "dashboard": f"video-creation/shorts/{BATCH}/dashboard.html",
    "topics": len({c["topic"] for c in plan["clips"]}),
    "clips": prog_clips,
    "run_override": "Mike 2026-07-19: max 3 vertical videos, and this run STOPS at clip generation. Do NOT tighten / desilence / caption / render / publish without a new instruction.",
    "resume_protocol": "Mike reviews dashboard.html and approves clips + in/out points. Only on his go-ahead: Phase 5 tighten -> 5B desilence -> 6 captions -> 7 render (remotion-builder subagent, one per clip) -> 8 publish-shorts.",
}
with open(os.path.join(OUTDIR, "progress.json"), "w", encoding="utf-8") as f:
    json.dump(prog, f, indent=2)

print(f"\nDashboard: {path}")
