"""Phase 4b clip cutter for the 'kaspa changes everything' livestream batch.
Cuts preview clips from the VERTICAL master (re-encode, never -c copy), concats multi-snippet
topics via the concat demuxer, writes shorts/<batch>/<slug>/preview.mp4, builds dashboard.html,
writes progress.json, and registers the batch in batches.json. STOPS at clip generation
(no tighten / desilence / captions / render)."""
import os, subprocess, json, sys, html

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\kaspa changes everything\kaspa changes everything LOW BPS VERTICAL.mp4")
BATCH = "kaspa-changes-everything"
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
TRANSCRIPTS_DIR = "video-creation/livestream-repurpose/transcripts/kaspa changes everything LOW BPS VERTICAL"
SRC_MEDIA = "video-creation/livestream-repurpose/media/kaspa changes everything/kaspa changes everything LOW BPS VERTICAL.mp4"

# topic, slug, title, variant, snippets[(start,end)], note
# Re-scoped after Mike's review: keep the 2 Kaspa covenant clips, drop the macro/price clips,
# add the project/coin-spotlight clips that were under-weighted (ElizaOS, KRC20 memes).
CLIPS = [
  ("Kaspa covenants (Toccata)", "covenants-explained",
   "Kaspa Will Be The First Chain That Can Put Rules On Your Coins", "build",
   [(394.6, 471.5)], "Covenant explainer: send-only, time locks, 2-of-3 multisig, 10% auto-route, must move to a covenant with the same rules."),
  ("Kaspa covenants (Toccata)", "kaspa-first-covenants",
   "No Other Chain Does This, Not Even Centralized Ones", "peak",
   [(540.5, 557.0)], "Peak beat: Kaspa is the first blockchain, even vs centralized PoS, to ship covenants."),
  ("ElizaOS", "elizaos-500x",
   "ElizaOS Could 500x Just Matching Its Old High", "build",
   [(273.3, 297.0)], "Project hype + outsized prediction: in an AI driven cycle top, ElizaOS just matching its old AI16Z all-time high is roughly a 500x; the company and funding are still behind it."),
  ("KRC20 meme coins", "krc20-compilation",
   "KRC20 Memes: Tiny Caps, 100x Potential", "compilation (multi-snippet)",
   [(2276.88, 2286.4), (2332.20, 2376.0), (3961.52, 3997.0)],
   "KRC20 potential compilation: (1) 'Let's talk about these KRC20s, I love Kroak'; (2) the 100x thesis (throw in 20 bucks, pro ghosts at 20M = 100x, Nacho at 3M, tens of millions); (3) Slippy at 14K = 100x + Pac-Man 'really cool graphics'. Leaves out the Kango let-down (stopped posting since January) so the comp stays all-upside."),
]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", " ".join(str(c) for c in cmd), "\n", r.stderr[-1200:]); sys.exit(1)

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

os.makedirs(OUTDIR, exist_ok=True)
ENC = ["-c:v","libx264","-preset","fast","-crf","18","-c:a","aac","-b:a","192k","-avoid_negative_ts","make_zero"]
results = []
for topic, slug, title, variant, snips, note in CLIPS:
    d = os.path.join(OUTDIR, slug)
    os.makedirs(d, exist_ok=True)
    preview = os.path.join(d, "preview.mp4")
    if len(snips) == 1:
        s, e = snips[0]
        run(["ffmpeg","-y","-ss",f"{s:.3f}","-to",f"{e:.3f}","-i",MASTER, *ENC, preview])
    else:
        parts = []
        for i,(s,e) in enumerate(snips):
            p = os.path.join(d, f"_part{i}.mp4")
            run(["ffmpeg","-y","-ss",f"{s:.3f}","-to",f"{e:.3f}","-i",MASTER, *ENC, p])
            parts.append(p)
        listf = os.path.join(d, "_concat.txt")
        with open(listf,"w",encoding="utf-8") as f:
            for p in parts: f.write(f"file '{p.replace(os.sep,'/')}'\n")
        run(["ffmpeg","-y","-f","concat","-safe","0","-i",listf,"-c","copy",preview])
        for p in parts: os.remove(p)
        os.remove(listf)
    dd = dur(preview)
    tc = " + ".join(f"{int(s//60):02d}:{s%60:05.2f}-{int(e//60):02d}:{e%60:05.2f}" for s,e in snips)
    results.append(dict(topic=topic, slug=slug, title=title, variant=variant, snippets=snips, timecodes=tc, duration=round(dd,1), note=note, preview=f"{slug}/preview.mp4"))
    print(f"  {slug:26s} {dd:5.1f}s  [{tc}]")

# dashboard.html (single file, in-place)
cards = []
for r in results:
    cards.append(f"""
    <div class="card">
      <div class="meta">
        <span class="topic">{html.escape(r['topic'])}</span>
        <span class="variant">{html.escape(r['variant'])}</span>
      </div>
      <h2>{html.escape(r['title'])}</h2>
      <video src="{r['preview']}" controls preload="metadata"></video>
      <div class="tc">{html.escape(r['timecodes'])} &middot; {r['duration']}s</div>
      <div class="note">{html.escape(r['note'])}</div>
    </div>""")
doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>{BATCH} clips</title>
<style>
 body{{background:#0c0f14;color:#e7edf3;font-family:Segoe UI,Arial,sans-serif;margin:0;padding:24px}}
 h1{{font-size:20px;margin:0 0 4px}} .sub{{color:#8aa0b3;margin:0 0 20px;font-size:13px}}
 .grid{{display:flex;flex-wrap:wrap;gap:18px}}
 .card{{background:#141a22;border:1px solid #233040;border-radius:12px;padding:14px;width:340px}}
 .meta{{display:flex;justify-content:space-between;font-size:11px;text-transform:uppercase;letter-spacing:.5px}}
 .topic{{color:#3fd0c9}} .variant{{color:#c79a3f}}
 h2{{font-size:15px;margin:8px 0 10px;line-height:1.3}}
 video{{width:100%;border-radius:8px;background:#000}}
 .tc{{color:#8aa0b3;font-size:12px;margin-top:8px;font-family:Consolas,monospace}}
 .note{{color:#aab8c6;font-size:12px;margin-top:6px;line-height:1.4}}
</style></head><body>
<h1>{BATCH} &mdash; clip review ({len(results)} clips, {len(set(r['topic'] for r in results))} topics)</h1>
<p class="sub">Phase 4b previews cut from the VERTICAL master. Approve / mark in-out points, then tighten &rarr; desilence &rarr; captions &rarr; render.</p>
<div class="grid">{''.join(cards)}</div>
</body></html>"""
with open(os.path.join(OUTDIR,"dashboard.html"),"w",encoding="utf-8") as f:
    f.write(doc)

# progress.json
prog = {
  "batch": BATCH, "phase": "4b-clip-review", "status": "awaiting_review",
  "source_master": SRC_MEDIA, "dashboard": f"video-creation/shorts/{BATCH}/dashboard.html",
  "topics": len(set(r['topic'] for r in results)), "clips": [dict(slug=r['slug'], title=r['title'], topic=r['topic'], variant=r['variant'],
                               timecodes=r['timecodes'], duration=r['duration'], approved=None,
                               output_mp4=None, note=r['note']) for r in results],
  "resume_protocol": "Mike reviews dashboard.html, approves clips + in/out points. Then Phase 5 tighten -> 5B desilence -> 6 captions -> 7 render -> 8 publish-shorts.",
}
with open(os.path.join(OUTDIR,"progress.json"),"w",encoding="utf-8") as f:
    json.dump(prog,f,indent=2)

# register batch
sys.path.insert(0, os.path.join(REPO,"scripts"))
import register_batch as rb
rb.register_batch(batch=BATCH, date="2026-06-23",
                  livestream_title="kaspa changes everything LOW BPS VERTICAL",
                  source_media=SRC_MEDIA,
                  transcript_plain=TRANSCRIPTS_DIR + "/kaspa changes everything LOW BPS VERTICAL_plain.txt",
                  transcripts_dir=TRANSCRIPTS_DIR,
                  dashboard=f"video-creation/shorts/{BATCH}/dashboard.html",
                  shorts="active", repurpose="done")
print(f"\nDashboard: {os.path.join(OUTDIR,'dashboard.html')}")
print(f"Registered batch '{BATCH}' (shorts=active, repurpose=done).")
