"""
Cut preview clips for the "market-meltdown LOW BPS VERTICAL" livestream (Phase 4b).
Source is the Phase-1 vertical (content top + face bottom) - no crop, just trim.
EXPLICIT second-based boundaries (Whisper mishears Mike's crypto vocab: "Casper"->Kaspa,
"tau"->TAO, so phrase anchoring is unreliable; times pinned from the words.txt timestamps).
RE-ENCODE every segment (A/V sync: never -c copy across a trim). Emits dashboard + progress.json
and registers the batch.

SELECTION (2026-06-12): per Mike's lead-with-hype-and-conviction rule, picked 3 topics / 4 clips,
project-hype first:
  - Kaspa (heaviest): a LONG conviction arc (excavator hook -> "built to go parabolic") PLUS a short
    PEAK-BEAT cut of just the excavator story sitting inside the long clip (Mike asked for a long clip
    + an impactful small section within it).
  - TAO: the "$10k a token at an AI cycle top" conviction punch.
  - Saylor: "he forced the cascade, then bought 110M at the bottom" - a high-energy contrarian insight
    with a named figure (not a flat market readout), self-contained, past tense.
Awaiting Mike's dashboard review before any production.
"""
import json, subprocess, os, sys

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "market-meltdown LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "market-meltdown", NAME + ".mp4")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\market-meltdown"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
os.makedirs(OUT_BASE, exist_ok=True)

# -- Topic/clip definitions: (start_sec, end_sec) --
TOPICS = [
    {"slug": "kaspa-built-to-go-parabolic", "title": "Kaspa Is Built to Go Parabolic",
     "hook": "Kaspa refused to drop with everything else last week. It is the type of token that goes absolutely parabolic, and the real multipliers only show up when the whole market runs.",
     "start": 1283, "end": 1375},
    {"slug": "sold-my-excavator-for-kaspa", "title": "I Sold My Excavator to Buy Kaspa",
     "hook": "I sold my excavator to buy more Kaspa at 11 cents. I figured soon I would have enough to buy 100 excavators. (Peak beat inside the long Kaspa clip.)",
     "start": 1293, "end": 1313},
    {"slug": "tao-10k-per-token", "title": "Why TAO Could Hit $10K a Token",
     "hook": "If TAO is good, it could literally be 10k a token at an AI-driven cycle top. So who cares if you buy at 207 or 160; in the long run you make a ton of money.",
     "start": 1253, "end": 1283},
    {"slug": "saylor-forced-the-cascade", "title": "Saylor Forced the Cascade, Then Bought the Dip",
     "hook": "We sat in a 116-day channel. Saylor sold a fraction of a percent to crack it, triggered the cascade everyone panicked over, then bought 110 million at the bottom. Brilliant.",
     "start": 670, "end": 755},
]

def cut_segment(start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", SRC, "-t", str(end - start),
           "-c:v", "libx264", "-preset", "fast", "-crf", "18",
           "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    ffmpeg error: {r.stderr[-300:]}")
    return r.returncode == 0

print("== Cutting ==")
for t in TOPICS:
    t["duration"] = t["end"] - t["start"]
    out_dir = os.path.join(OUT_BASE, t["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    print(f"  {t['slug']} ({t['duration']}s) ...", end=" ", flush=True)
    t["ok"] = cut_segment(t["start"], t["end"], out_path)
    print("OK" if t["ok"] else "FAILED")

def fmt(s): return f"{int(s//60)}:{int(s%60):02d}"

card_data = [{
    "slug": t["slug"], "title": t["title"], "hook": t["hook"],
    "times": [f"{fmt(t['start'])}-{fmt(t['end'])}"],
    "multi": False, "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Market Meltdown - Draft Clips</title>
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
  <h1>Market Meltdown - Draft Clips</h1>
  <p>4 candidate clips, 3 topics (Kaspa long arc + excavator peak, TAO $10k, Saylor cascade) &nbsp;&middot;&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;&middot;&nbsp; Watch each, then Approve or Skip</p>
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
        <div class="meta">${{timeTags}}${{durTag}}</div>
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
        "source_times": [f"{fmt2(t['start'])}-{fmt2(t['end'])}"],
        "multi": False,
        "phase_status": {p: ("done" if (p == "preview" and t.get("ok")) else "todo") for p in PHASES},
    })
rel = "livestream-repurpose/transcripts/" + NAME + "/" + NAME
progress = {
    "$schema_version": 1,
    "batch": "market-meltdown",
    "source_livestream": NAME,
    "dashboard": "shorts/market-meltdown/dashboard.html",
    "dashboard_status": "AWAITING review/approval (2026-06-12). 4 clips / 3 topics: Kaspa long arc (kaspa-built-to-go-parabolic) + excavator peak-beat within it (sold-my-excavator-for-kaspa), TAO $10k (tao-10k-per-token), Saylor cascade (saylor-forced-the-cascade). Do NOT start production until clips are approved.",
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
    batch="market-meltdown", date="2026-06-12", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/market-meltdown/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/market-meltdown/dashboard.html",
    shorts="active", repurpose="pending",
)
ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
