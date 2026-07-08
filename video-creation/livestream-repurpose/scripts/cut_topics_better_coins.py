"""Phase 4b clip cutter for the 'better-coins' livestream batch
(source: 'Market Update | 4-Year Cycle Dead (Again)', folder 'code monkeys call better coins').
Cuts preview clips from the VERTICAL master (re-encode, never -c copy), concats multi-snippet
topics via the concat demuxer, writes shorts/<batch>/<slug>/preview.mp4, builds dashboard.html,
writes progress.json, and registers the batch in batches.json. STOPS at clip generation
(no tighten / desilence / captions / render). 5 topics, 8 clips."""
import os, subprocess, json, sys, html

REPO = r"C:\Users\mnede\Documents\Claude\social-media"
MASTER = os.path.join(REPO, r"video-creation\livestream-repurpose\media\code monkeys call better coins\code monkeys call better coins LOW BPS VERTICAL.mp4")
BATCH = "better-coins"
OUTDIR = os.path.join(REPO, "video-creation", "shorts", BATCH)
TRANSCRIPTS_DIR = "video-creation/livestream-repurpose/transcripts/code monkeys call better coins LOW BPS VERTICAL"
SRC_MEDIA = "video-creation/livestream-repurpose/media/code monkeys call better coins/code monkeys call better coins LOW BPS VERTICAL.mp4"

# topic, slug, title, variant, snippets[(start,end)], note
# Content priority: hype / conviction / philosophical / tribal ABOVE time-bound market recaps.
# STT corrected for titles/notes: Casper->Kaspa, "the Tensor"/Tao->TAO/Bittensor.
CLIPS = [
  ("4-year cycle is dead", "didnt-you-learn-your-lesson",
   "The Same Guys Who Missed The Top Are Now Calling The Bottom", "peak",
   [(994.9, 1025.5)],
   "Peak/tribal: same influencers who promised a 2017 style blow-off top in Nov are now preaching an October bottom. 'Danger, Danger Will Robinson. Didn't you learn your lesson?' Then opens the door to a real drop, but NOT from a magical 4yr cycle."),
  ("4-year cycle is dead", "four-year-cycle-breakage-stack",
   "Every Rule Of The 4-Year Cycle Just Broke, One By One", "build",
   [(2061.9, 2110.4)],
   "Rapid-fire violation stack: new ATH BEFORE the halving, bear market in the post-halving year, no cycle top, not even a mid-cycle top. 'Breakage of the four-year cycle' x4. Closes on 'never underestimate hordes of four-year cycle zombies.'"),
  ("TAO / decentralized AI", "tao-decentralizing-intelligence",
   "When Governments Start Banning AI Models, You Want Decentralized Intelligence", "build",
   [(2252.2, 2347.4)],
   "TAO hype + thesis: government cut public access to Anthropic's Fable model AND OpenAI's GPT-5.6. The Wild West of AI releases is ending, so decentralized intelligence (Bittensor) is the way. TAO heading for a trillion dollar market cap. (Fact-check the specific model/ban names before any spoken reuse.)"),
  ("TAO / decentralized AI", "buying-bitcoin-at-200",
   "Buying TAO Now Is Like Buying Bitcoin At $200", "peak",
   [(2348.5, 2383.4)],
   "Peak: if TAO reaches Bitcoin's all-time-high PRICE ($126K) someday, buying it now is 'literally like buying Bitcoin at $200.' TAO and Kaspa the two biggest winners. (Section continues out of clip 3.)"),
  ("Kaspa whales accumulating", "kaspa-whales-accumulating",
   "Retail Is Selling Kaspa. 20-30 Whales Are Quietly Eating It All", "build (multi-snippet)",
   [(2384.1, 2406.0), (2433.5, 2458.5)],
   "Kaspa conviction: retail exiting while a group of 20-30 whales just keep increasing their bags. 'They're preparing for something.' Part 2: the 'Kaspa is a shit coin' crowd is going to be really sorry. 'That's what it takes being a patient Kaspa holder. Building the best takes time.' (Dead chat-read between the two beats dropped via concat.)"),
  ("Kaspa whales accumulating", "building-the-best-takes-time",
   "They Call Kaspa A Shit Coin. They're Going To Be Really Sorry", "peak",
   [(2438.7, 2458.5)],
   "Peak/tribal beat (a section inside the whales clip): patient-holder conviction. 'Building the best takes time.'"),
  ("Stop waiting for the bottom", "stop-waiting-buy-kaspa",
   "Stop Waiting For A Bottom You'll Never See", "build",
   [(1470.8, 1547.7)],
   "Philosophical/conviction (Kaspa): the people sitting on 10 grand waiting for the exact bottom just miss out as price climbs. 'Are you really not going to buy Kaspa because you're waiting for a fraction of a cent lower?' Just keep buying some. (Kaspa price/mcap are the stream's snapshot; verify before any text reuse.)"),
  ("1992 vs 2000 thesis", "the-1992-magnificent-crash",
   "We're At 1992, Not 2000. The Real Crash Is Years Away", "build",
   [(452.8, 553.4)],
   "Evergreen macro thesis: the AI-driven expansion is like the economy starting to run in '92; it tops like 2000 (dot-com), THEN a magnificent crash worse than anything Bitcoin has seen. The expansion hasn't even started. (Chart-hovering mid-section; Mike to trim in/out.)"),
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
    print(f"  {slug:30s} {dd:5.1f}s  [{tc}]")

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

# register batch (idempotent upsert)
sys.path.insert(0, os.path.join(REPO,"scripts"))
import register_batch as rb
rb.register_batch(batch=BATCH, date="2026-06-29",
                  livestream_title="code monkeys call better coins LOW BPS VERTICAL",
                  source_media=SRC_MEDIA,
                  transcript_plain=TRANSCRIPTS_DIR + "/code monkeys call better coins LOW BPS VERTICAL_plain.txt",
                  transcripts_dir=TRANSCRIPTS_DIR,
                  dashboard=f"video-creation/shorts/{BATCH}/dashboard.html",
                  shorts="active", repurpose="pending")
print(f"\nDashboard: {os.path.join(OUTDIR,'dashboard.html')}")
print(f"Registered batch '{BATCH}' (shorts=active, repurpose=pending).")
