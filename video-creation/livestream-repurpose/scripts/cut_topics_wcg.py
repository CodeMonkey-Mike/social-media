"""
Cut preview clips for the "wife-changing-gains LOW BPS VERTICAL" livestream (Phase 4b).
Source is the Phase-1 vertical (content top + face bottom) - no crop, just trim.
Boundaries pinned from the word-level Whisper JSON. RE-ENCODE every segment (libx264 crf18);
multi-snippet clips concat identical-param segments with -c copy.

2 topics, 3 clips (Topic A ships a long cut + a punch sub-clip WITHIN it).
"""
import json, subprocess, os, sys

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "wife-changing-gains LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "wife-changing-gains", NAME + ".mp4")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\wife-changing-gains"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
os.makedirs(OUT_BASE, exist_ok=True)

# ── Topic/clip definitions ── segs = list of (start_sec, end_sec) ──
TOPICS = [
    {"slug": "ai-coming-for-every-job", "title": "AI Is Coming For Every Job. Here's the Hedge",
     "hook": "A robot can already do surgery better than an experienced surgeon. Self-driving trucks plus humanoid robots mean no job is safe. The one move that hedges all of it: get into crypto.",
     "segs": [(1402.6, 1500.4), (2223.5, 2240.3)]},
    {"slug": "nobody-is-safe-punch", "title": "Nobody Is Safe (punch)",
     "hook": "A robot can now do a better job than an experienced surgeon. Nobody is safe. No one is safe at all.",
     "segs": [(1436.5, 1444.5), (1495.0, 1500.4)]},
    {"slug": "jobs-report-so-good-it-was-bad", "title": "The Jobs Report Was So Good It Was Bad",
     "hook": "Saturday's jobs report was so damn good it terrified everyone into pricing a rate hike. Great economy, but prices are sticking it to us. Good news became bad news.",
     "segs": [(2334.4, 2384.0)]},
]

def cut_segment(start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", SRC, "-t", str(end - start),
           "-c:v", "libx264", "-preset", "fast", "-crf", "18",
           "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    ffmpeg error: {r.stderr[-300:]}")
    return r.returncode == 0

def cut_clip(segs, out_path):
    if len(segs) == 1:
        return cut_segment(segs[0][0], segs[0][1], out_path)
    parts = []
    for i, (s, e) in enumerate(segs):
        p = out_path[:-4] + f".part{i}.mp4"
        if not cut_segment(s, e, p): return False
        parts.append(p)
    listf = out_path[:-4] + ".concat.txt"
    with open(listf, "w", encoding="utf-8") as f:
        for p in parts: f.write("file '" + p.replace("\\", "/") + "'\n")
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
                        "-c", "copy", out_path], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"    concat error: {r.stderr[-300:]}"); return False
    for p in parts: os.remove(p)
    os.remove(listf)
    return True

def fmt(s): return f"{int(s//60)}:{int(s%60):02d}"

print("== Cutting ==")
for t in TOPICS:
    t["duration"] = sum(e - s for s, e in t["segs"])
    out_dir = os.path.join(OUT_BASE, t["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    print(f"  {t['slug']} ({t['duration']:.1f}s, {len(t['segs'])} seg) ...", end=" ", flush=True)
    t["ok"] = cut_clip(t["segs"], out_path)
    print("OK" if t["ok"] else "FAILED")

card_data = [{
    "slug": t["slug"], "title": t["title"], "hook": t["hook"],
    "times": [f"{fmt(s)}-{fmt(e)}" for s, e in t["segs"]],
    "multi": len(t["segs"]) > 1, "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>wife-changing-gains - Draft Clips</title>
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
  .tag-multi{{background:#261e26;color:#b07ac0;border:1px solid #402d40;}}
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
  <h1>wife-changing-gains - Draft Clips</h1>
  <p>3 candidate clips (2 topics; Topic A has a long cut + a punch WITHIN it) &nbsp;&middot;&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;&middot;&nbsp; Watch each, then Approve or Skip</p>
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

PHASES = ["preview", "tighten", "whisper", "captions", "broll_prompts", "broll_pngs",
          "constants", "comp", "root_registered", "rendered"]
clips = []
for i, t in enumerate(TOPICS, 1):
    clips.append({
        "n": i, "slug": t["slug"], "title": t["title"],
        "duration_seconds": round(t["duration"], 2),
        "source_times": [f"{fmt(s)}-{fmt(e)}" for s, e in t["segs"]],
        "multi": len(t["segs"]) > 1,
        "phase_status": {p: ("done" if (p == "preview" and t.get("ok")) else "todo") for p in PHASES},
    })
rel = "livestream-repurpose/transcripts/" + NAME + "/" + NAME
progress = {
    "$schema_version": 1,
    "batch": "wife-changing-gains",
    "source_livestream": NAME,
    "dashboard": "shorts/wife-changing-gains/dashboard.html",
    "dashboard_status": "Built 3 raw preview clips (2 topics; Topic A = long + punch). AWAITING Mike's review/approval - do NOT start production until clips are approved.",
    "source_transcript": rel + "_plain.txt",
    "source_transcript_words_json": rel + ".json",
    "source_transcript_chunks_90s": rel + "_chunks_90s.txt",
    "phases": PHASES,
    "clips": clips,
    "resume_protocol": [
        "1. Read this file at session start.",
        "2. Clips await Mike's dashboard approval before any production phase.",
        "3. Phase order: preview -> tighten -> review -> whisper -> captions -> production.",
        "4. Once approved, for each approved clip pick the leftmost non-'done' phase; mark in_progress then done; bump last_updated.",
    ],
}
with open(PROGRESS, "w", encoding="utf-8") as f:
    json.dump(progress, f, indent=2)

REPO_ROOT = os.path.dirname(os.path.dirname(BASE))
sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))
from register_batch import register_batch
register_batch(
    batch="wife-changing-gains", date="2026-06-08", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/wife-changing-gains/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/wife-changing-gains/dashboard.html",
    shorts="active", repurpose="done",
)
ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
