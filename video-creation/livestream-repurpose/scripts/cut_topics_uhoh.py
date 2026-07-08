"""
Cut preview clips for the "UH-OH LOW BPS VERTICAL" livestream (Phase 4b).
Source is the Phase-1 vertical (content top + face bottom) - no crop, just trim.
EXPLICIT second-based boundaries (Whisper mishears Mike's crypto vocab + "four-year"->"for your",
"Casper"->Kaspa, so phrase anchoring is unreliable; times pinned from the 90s-chunk file).
RE-ENCODE every segment (A/V sync: never -c copy across a trim). Emits dashboard + progress.json
and registers the batch.

REVISED 2026-06-11 (Mike's review): deleted the 3 macro/tribal extras (FOMO-cascade punch,
bitcoin-shrugs-off, step-up punch) and added 4 PROJECT clips he asked for.
6 clips now: 2 macro/tribal (kept) + 4 project (ElizaOS, LAB 353x, Linea, Kaspa).
NOTE: the Linea/XRP clip's core disparages XRP ("makes XRP useless"), which normally trips the
persona no-disparage-a-named-project shorts rule - Mike EXPLICITLY approved it for this batch
(2026-06-11). The rule itself stands for future auto-selection; this is a one-off override.
"""
import json, subprocess, os, sys

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "UH-OH LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "UH-OH", NAME + ".mp4")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\uh-oh"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
os.makedirs(OUT_BASE, exist_ok=True)

# -- Topic/clip definitions: (start_sec, end_sec) --
TOPICS = [
    {"slug": "october-turns-green", "title": "Why October Turns Green No Matter What",
     "hook": "The four-year cycle zombies all swear the bottom is in October. And just because of that, October is going to be green. Believers and non-believers both pile in, and the FOMO feeds itself.",
     "start": 298, "end": 363},
    {"slug": "still-here-worst-of-times", "title": "Still Here in the Worst of Times? You're Already Ahead",
     "hook": "If you are watching this in the worst of times and you are still sticking around, that already says something. You are a step up from everyone who checked out and will come crawling back in October.",
     "start": 1622, "end": 1698},
    {"slug": "elizaos-my-favorite-ai", "title": "My Favorite AI Coin Is ElizaOS",
     "hook": "My favorite AI coin? ElizaOS. The migrated ai16z, in the same realm as Bittensor and Virtuals, with the VC backing and the multiples still ahead of it that those two have already spent.",
     "start": 1726, "end": 1786},
    {"slug": "lab-353x-surprise", "title": "We Just Did a 353x on LAB",
     "hook": "A few weeks ago me and my community did a 353x on the LAB token. I called it back in October expecting a 20x. It did 353.",
     "start": 652, "end": 685},
    {"slug": "linea-not-xrp", "title": "Linea Is the Real SWIFT Play, Not XRP",
     "hook": "XRP's whole narrative was replacing SWIFT. But SWIFT just partnered with Linea. The pumps everyone expects out of XRP are going to happen on Linea instead, and it is still a tiny cap.",
     "start": 564, "end": 648},
    {"slug": "kaspa-refused-to-break-down", "title": "Kaspa Refused to Break Down",
     "hook": "Kaspa was the strongest thing in my bag last week. You would have expected it down to 2.7 cents. It refused. It barely cracked, and I never got my lower buy.",
     "start": 1318, "end": 1355},
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
<title>UH-OH - Draft Clips</title>
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
  <h1>UH-OH - Draft Clips</h1>
  <p>6 candidate clips (2 macro/tribal + 4 project: ElizaOS, LAB 353x, Linea, Kaspa) &nbsp;&middot;&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;&middot;&nbsp; Watch each, then Approve or Skip</p>
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
    "batch": "uh-oh",
    "source_livestream": NAME,
    "dashboard": "shorts/uh-oh/dashboard.html",
    "dashboard_status": "REVISED 2026-06-11 per Mike: 6 clips (2 macro/tribal kept + 4 project: ElizaOS, LAB 353x, Linea, Kaspa). Deleted FOMO-cascade, bitcoin-shrugs-off, step-up punch. Linea clip approved by Mike despite the no-disparage rule (one-off). AWAITING review/approval - do NOT start production until clips are approved.",
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
    batch="uh-oh", date="2026-06-11", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/UH-OH/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/uh-oh/dashboard.html",
    shorts="active", repurpose="pending",
)
ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
