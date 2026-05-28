"""Rebuild the bulls-are-sleeping review dashboard for the clips that currently exist,
reading live durations and showing each clip's processing label."""
import json, subprocess, os

CLIPS = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\bulls-are-sleeping-clips"
DASHBOARD = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\bulls-are-sleeping-dashboard.html"

# slug -> (title, processing label, tag-class)
META = [
    ("bulls-are-sleeping",  "The Bulls Are Sleeping (109-Day Bear Flag)",            "silences removed", "sil"),
    ("price-vs-technology", "Price Is Today, Technology Is Tomorrow",                "silences removed", "sil"),
    ("heard-of-kaspa-brah", "Bitcoin Isn't the Best Tech — Heard of Kaspa, Brah?", "silences removed", "sil"),
    ("eth-flips-btc",       "ETH Flips Bitcoin, Then Kaspa Flips ETH",               "filler trimmed ~10% + silences removed", "trim"),
]

def dur(p):
    try: return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
    except: return 0.0

cards = []
for slug, title, proc, cls in META:
    f = os.path.join(CLIPS, slug, "preview.mp4")
    if not os.path.exists(f):
        continue
    d = dur(f)
    cards.append({"slug": slug, "title": title, "proc": proc, "cls": cls,
                  "duration": f"{int(d//60)}m {int(d%60):02d}s"})

cards_js = json.dumps(cards, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bulls Are Sleeping — Processed Clips</title>
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
  .card-title{{font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3;}}
  .meta{{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;}}
  .tag{{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.05em;text-transform:uppercase;}}
  .tag-dur{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}}
  .tag-sil{{background:#1a2330;color:#5b9bd5;border:1px solid #29405c;}}
  .tag-trim{{background:#2a2012;color:#d4a017;border:1px solid #4a3a12;}}
  .actions{{display:flex;gap:10px;}}
  .btn{{flex:1;padding:9px 0;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.04em;transition:opacity .15s;}}
  .btn:hover{{opacity:.85;}}
  .btn-approve{{background:#00e5ff;color:#000;}}
  .btn-skip{{background:#2a2a2a;color:#888;}}
  .btn-approved{{background:#00e5ff22;color:#00e5ff;border:1px solid #00e5ff44;}}
  .btn-skipped{{background:#1e1e1e;color:#555;border:1px solid #333;}}
  .summary-bar{{position:fixed;bottom:0;left:0;right:0;background:#111;border-top:1px solid #2a2a2a;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;font-size:13px;z-index:100;}}
  .summary-bar span{{color:#666;}} .summary-bar strong{{color:#00e5ff;}}
  #approved-list{{color:#aaa;font-size:12px;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}
</style></head><body>
<header>
  <h1>Bulls Are Sleeping — Processed Clips</h1>
  <p>4 clips (video 3 deleted) &nbsp;·&nbsp; silences removed on 1/2/4, video 5 filler-trimmed &nbsp;·&nbsp; still no captions/b-roll — judge content &amp; pacing</p>
</header>
<div class="grid" id="grid"></div>
<div class="summary-bar"><span>Approved: <strong id="count">0</strong></span><div id="approved-list">—</div></div>
<script>
const topics = {cards_js};
const state = {{}}; topics.forEach(t => state[t.slug]='none');
function render() {{
  const grid = document.getElementById('grid'); grid.innerHTML='';
  topics.forEach((t,i) => {{
    const s = state[t.slug];
    const procTag = `<span class="tag tag-${{t.cls}}">${{t.proc}}</span>`;
    const durTag = `<span class="tag tag-dur">${{t.duration}}</span>`;
    const approveBtn = s==='approved'
      ? `<button class="btn btn-approved" onclick="toggle('${{t.slug}}','approved')">✓ Approved</button>`
      : `<button class="btn btn-approve" onclick="toggle('${{t.slug}}','approved')">Approve</button>`;
    const skipBtn = s==='skipped'
      ? `<button class="btn btn-skipped" onclick="toggle('${{t.slug}}','skipped')">Skipped</button>`
      : `<button class="btn btn-skip" onclick="toggle('${{t.slug}}','skipped')">Skip</button>`;
    const card = document.createElement('div');
    card.className = 'card' + (s==='approved'?' approved':s==='skipped'?' skipped':'');
    card.innerHTML = `
      <div class="video-wrap"><video controls preload="metadata" src="bulls-are-sleeping-clips/${{t.slug}}/preview.mp4"></video></div>
      <div class="card-body">
        <div class="topic-num">Clip ${{i+1}} of ${{topics.length}}</div>
        <div class="card-title">${{t.title}}</div>
        <div class="meta">${{durTag}}${{procTag}}</div>
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
  document.getElementById('approved-list').textContent=a.length?a.map(t=>t.title).join(' · '):'—';
}}
render();
</script></body></html>"""

with open(DASHBOARD, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Dashboard rebuilt with {len(cards)} clips -> {DASHBOARD}")
for c in cards:
    print(f"  {c['slug']:24s} {c['duration']:8s} {c['proc']}")
