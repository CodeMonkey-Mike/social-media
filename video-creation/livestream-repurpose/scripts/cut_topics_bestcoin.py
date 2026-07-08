"""
Cut preview clips for the "best coin to buy LOW BPS VERTICAL" livestream (Phase 4b).
Source is the Phase-1 vertical (content top + face bottom) - no crop, just trim.
EXPLICIT second-based boundaries pinned from the words.txt timestamps (Whisper mishears Mike's
crypto vocab: "Casper"->Kaspa, "tau/tal"->TAO, "Linnea"->Linea, "suey"->SUI, so phrase anchoring
is unreliable). RE-ENCODE every segment (A/V sync: never -c copy). Multi-snippet topics concat'd
via the concat demuxer. Emits dashboard + progress.json and registers the batch.

SELECTION (2026-06-17): per Mike's lead-with-hype-and-conviction rule + Kaspa-heaviest weighting,
5 topics / 7 clips. Coin-review stream, so Kaspa material is scattered (mentions, not one arc) ->
assembled multi-snippet. Kaspa gets the long+punch treatment (heaviest):
  - Kaspa (heaviest): favorites + hard-fork + KRC20 LONG (multi-snippet) + a short PEAK-BEAT punch
    of just "we got the Kaspa hard fork in 13 days, Kaspa and TAO, my favorites" inside it.
  - TAO: Bittensor pumped after a frontier AI model was switched off -> buy decentralized AI nobody
    can shut down.
  - LAB: "I targeted 20x, did a 353x in a bear market" community-call conviction LONG + a punch.
  - AI super-cycle: the economic expansion bigger than dot-com is starting now (philosophical).
  - Linea: chosen by Swift, low cap, 100x potential (framed Linea-positive; ENDS before the
    "you won't get 100x out of XRP" line to respect the no-disparage-a-project shorts rule).
Awaiting Mike's dashboard review before any production.
"""
import json, subprocess, os, sys

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "best coin to buy LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "best coin to buy", NAME + ".mp4")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\best-coin-to-buy"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
os.makedirs(OUT_BASE, exist_ok=True)

TOPICS = [
    {"slug": "kaspa-favorites-hardfork", "title": "Kaspa and TAO Are My Favorites, Hard Fork Incoming",
     "hook": "We got the Kaspa hard fork coming up. Kaspa and TAO are my favorites; very similar, similar backing. And in KRC20, Slippy is another good one.",
     "segs": [(1885.0, 1900.0), (2909.2, 2917.0)]},
    {"slug": "kaspa-favorites-punch", "title": "Kaspa and TAO. My Favorites. (Punch)",
     "hook": "We got the Kaspa hard fork coming up. Kaspa and TAO. My favorites. (Peak beat inside the long Kaspa clip.)",
     "segs": [(1885.0, 1897.0)]},
    {"slug": "tao-decentralized-ai", "title": "They Switched Off an AI Model, So Buy Decentralized AI",
     "hook": "Bittensor pumped after the government got a frontier AI model switched off. Everybody realized the government can just step in and shut things down, so now we want to switch toward decentralized AI nobody can turn off.",
     "segs": [(320.5, 370.2)]},
    {"slug": "lab-353x-bear-call", "title": "I Targeted 20x on LAB, It Did 353x in a Bear Market",
     "hook": "I clearly underestimated a few things. I thought we would do a 20x off the LAB token; we did a 353x in a bear market. Imagine getting in at 7.7 cents and watching it run to 27 dollars. I had it listed as a 20x for my community.",
     "segs": [(532.4, 605.0)]},
    {"slug": "lab-353x-punch", "title": "20x Target, 353x Reality (Punch)",
     "hook": "I thought we would do a 20x off the LAB token. We did a 353x. In a bear market. Holy crap. (Peak beat inside the long LAB clip.)",
     "segs": [(532.4, 540.2)]},
    {"slug": "ai-supercycle-bigger-than-dotcom", "title": "The Expansion Bigger Than Dot-Com Is Starting Now",
     "hook": "We are starting right now a major economic expansion unlike anything we have ever seen, bigger than the dot-com explosion. Fueled by AI, then robotics, then biotech; AI is going to drive advancements in diseases and cures.",
     "segs": [(662.3, 689.4)]},
    {"slug": "linea-chosen-by-swift", "title": "Linea Was Chosen by Swift",
     "hook": "It is a low market cap and it was chosen by Swift. Swift now has a partnership with a blockchain called Linea, so this is going to be a good play. At the top of the bull run, even if it underperforms, that is a 100x.",
     "segs": [(2071.4, 2133.0)]},
]

def cut_segment(start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", SRC, "-t", str(end - start),
           "-c:v", "libx264", "-preset", "fast", "-crf", "18",
           "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    ffmpeg error: {r.stderr[-300:]}")
    return r.returncode == 0

def build_clip(segs, out_dir, out_path):
    if len(segs) == 1:
        return cut_segment(segs[0][0], segs[0][1], out_path)
    parts = []
    for i, (s, e) in enumerate(segs):
        p = os.path.join(out_dir, f"_seg{i}.mp4")
        if not cut_segment(s, e, p):
            return False
        parts.append(p)
    listf = os.path.join(out_dir, "_concat.txt")
    with open(listf, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.replace(os.sep, '/')}'\n")
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
           "-c:v", "libx264", "-preset", "fast", "-crf", "18",
           "-c:a", "aac", "-b:a", "192k", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    concat error: {r.stderr[-300:]}")
    for p in parts + [listf]:
        try: os.remove(p)
        except OSError: pass
    return r.returncode == 0

print("== Cutting ==")
for t in TOPICS:
    t["duration"] = sum(e - s for s, e in t["segs"])
    t["multi"] = len(t["segs"]) > 1
    out_dir = os.path.join(OUT_BASE, t["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    print(f"  {t['slug']} ({t['duration']:.1f}s) ...", end=" ", flush=True)
    t["ok"] = build_clip(t["segs"], out_dir, out_path)
    print("OK" if t["ok"] else "FAILED")

def fmt(s): return f"{int(s//60)}:{int(s%60):02d}"

card_data = [{
    "slug": t["slug"], "title": t["title"], "hook": t["hook"],
    "times": [f"{fmt(s)}-{fmt(e)}" for s, e in t["segs"]],
    "multi": t["multi"], "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Coin To Buy - Draft Clips</title>
<style>
  *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
  body{{background:#0d0d0d;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px 24px 80px;}}
  header{{margin-bottom:40px;border-bottom:1px solid #2a2a2a;padding-bottom:20px;}}
  header h1{{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.04em;}}
  header p{{margin-top:6px;font-size:13px;color:#666;}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:28px;}}
  .card{{background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;transition:border-color .2s;}}
  .card:hover{{border-color:#444;}}
  .card.approved{{border-color:#00e5ff;box-shadow:0 0 0 1px #00e5ff22;}}
  .card.skipped{{opacity:.45;}}
  .video-wrap{{background:#000;aspect-ratio:9/16;max-height:520px;overflow:hidden;}}
  .video-wrap video{{width:100%;height:100%;object-fit:contain;display:block;}}
  .card-body{{padding:16px 18px 20px;}}
  .topic-num{{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#555;margin-bottom:4px;}}
  .card-title{{font-size:17px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}}
  .card-hook{{font-size:13px;color:#9a9a9a;margin-bottom:12px;line-height:1.4;font-style:italic;}}
  .meta{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}}
  .tag{{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase;}}
  .tag-time{{background:#1e1e1e;color:#888;border:1px solid #333;}}
  .tag-dur{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}}
  .tag-multi{{background:#26211e;color:#af925c;border:1px solid #403a2d;}}
  .actions{{display:flex;gap:10px;}}
  .btn{{flex:1;padding:9px 0;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.04em;transition:opacity .15s;}}
  .btn:hover{{opacity:.85;}}
  .btn-approve{{background:#00e5ff;color:#000;}}
  .btn-skip{{background:#2a2a2a;color:#888;}}
  .btn-approved{{background:#00e5ff22;color:#00e5ff;border:1px solid #00e5ff44;}}
  .btn-skipped{{background:#1e1e1e;color:#555;border:1px solid #333;}}
  .summary-bar{{position:fixed;bottom:0;left:0;right:0;background:#111;border-top:1px solid #2a2a2a;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;font-size:13px;z-index:100;}}
  .summary-bar span{{color:#666;}} .summary-bar strong{{color:#00e5ff;}}
  #approved-list{{color:#aaa;font-size:12px;max-width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}
</style></head><body>
<header>
  <h1>Best Coin To Buy - Draft Clips</h1>
  <p>7 candidate clips, 5 topics (Kaspa favorites/hard-fork long + punch, TAO decentralized-AI, LAB 353x long + punch, AI super-cycle, Linea chosen by Swift) &nbsp;&middot;&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;&middot;&nbsp; Watch each, then Approve or Skip</p>
</header>
<div class="grid" id="grid"></div>
<div class="summary-bar"><span>Approved: <strong id="count">0</strong></span><div id="approved-list">-</div></div>
<script>
const topics = {cards_js};
const state = {{}}; topics.forEach(t => state[t.slug]='none');
function render() {{
  const grid = document.getElementById('grid'); grid.innerHTML='';
  topics.forEach((t,i) => {{
    const s = state[t.slug];
    const timeTags = t.times.map(ts=>`<span class="tag tag-time">${{ts}}</span>`).join('');
    const durTag = `<span class="tag tag-dur">${{t.duration}}</span>`;
    const multiTag = t.multi ? `<span class="tag tag-multi">multi-snippet</span>` : '';
    const approveBtn = s==='approved'
      ? `<button class="btn btn-approved" onclick="toggle('${{t.slug}}','approved')">&#10003; Approved</button>`
      : `<button class="btn btn-approve" onclick="toggle('${{t.slug}}','approved')">Approve</button>`;
    const skipBtn = s==='skipped'
      ? `<button class="btn btn-skipped" onclick="toggle('${{t.slug}}','skipped')">Skipped</button>`
      : `<button class="btn btn-skip" onclick="toggle('${{t.slug}}','skipped')">Skip</button>`;
    const card = document.createElement('div');
    card.className = 'card' + (s==='approved'?' approved':s==='skipped'?' skipped':'');
    card.innerHTML = `
      <div class="video-wrap"><video controls preload="metadata" src="${{t.slug}}/preview.mp4"></video></div>
      <div class="card-body">
        <div class="topic-num">Clip ${{i+1}} of ${{topics.length}}</div>
        <div class="card-title">${{t.title}}</div>
        <div class="card-hook">${{t.hook}}</div>
        <div class="meta">${{timeTags}}${{durTag}}${{multiTag}}</div>
        <div class="actions">${{approveBtn}}${{skipBtn}}</div>
      </div>`;
    grid.appendChild(card);
  }});
  updateSummary();
}}
function toggle(slug,action){{ state[slug]=state[slug]===action?'none':action; render(); }}
function updateSummary(){{
  const a = topics.filter(t=>state[t.slug]==='approved');
  document.getElementById('count').textContent=a.length;
  document.getElementById('approved-list').textContent=a.length?a.map(t=>t.title).join(' · '):'-';
}}
render();
</script></body></html>"""
with open(DASHBOARD, "w", encoding="utf-8") as f:
    f.write(html)

def fmt2(s): return f"{int(s//60)}:{int(s%60):02d}"
PHASES = ["preview", "whisper", "captions", "broll_prompts", "broll_pngs",
          "constants", "comp", "root_registered", "rendered"]
clips = []
for i, t in enumerate(TOPICS, 1):
    clips.append({
        "n": i, "slug": t["slug"], "title": t["title"],
        "duration_seconds": round(t["duration"], 2),
        "source_times": [f"{fmt2(s)}-{fmt2(e)}" for s, e in t["segs"]],
        "multi": t["multi"],
        "phase_status": {p: ("done" if (p == "preview" and t.get("ok")) else "todo") for p in PHASES},
    })
rel = "livestream-repurpose/transcripts/" + NAME + "/" + NAME
progress = {
    "$schema_version": 1,
    "batch": "best-coin-to-buy",
    "source_livestream": NAME,
    "dashboard": "shorts/best-coin-to-buy/dashboard.html",
    "dashboard_status": "AWAITING review/approval (2026-06-17). 7 clips / 5 topics: Kaspa favorites+hard-fork long (kaspa-favorites-hardfork) + its punch (kaspa-favorites-punch), TAO decentralized-AI (tao-decentralized-ai), LAB 353x long (lab-353x-bear-call) + its punch (lab-353x-punch), AI super-cycle (ai-supercycle-bigger-than-dotcom), Linea chosen by Swift (linea-chosen-by-swift). Linea clip is framed Linea-positive and ends BEFORE the XRP put-down per the no-disparage shorts rule; confirm at review. Do NOT start production until clips are approved.",
    "source_transcript": rel + "_plain.txt",
    "source_transcript_words_json": rel + ".json",
    "source_transcript_chunks_90s": rel + "_chunks_90s.txt",
    "phases": PHASES,
    "clips": clips,
    "resume_protocol": [
        "1. Read this file at session start.",
        "2. Clips await Mike's dashboard approval before any production phase.",
        "3. Once approved, for each approved clip pick the leftmost non-'done' phase in `phases` order.",
        "4. Execute per video-creation/SKILL.md; mark phase 'in_progress' then 'done'; bump last_updated.",
    ],
}
with open(PROGRESS, "w", encoding="utf-8") as f:
    json.dump(progress, f, indent=2)

REPO_ROOT = os.path.dirname(os.path.dirname(BASE))
sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))
from register_batch import register_batch
register_batch(
    batch="best-coin-to-buy", date="2026-06-17", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/best coin to buy/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/best-coin-to-buy/dashboard.html",
    shorts="active", repurpose="pending",
)
ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
