"""Rebuild the storyboard review dashboard for a vertical-ai-persona project.

Reads <project>/storyboard.json, scans for each scene's keyframe still and (later)
its generated clip, and emits a self-contained <project>/storyboard.html.

Mirrors the livestream-repurpose dashboard (scripts/rebuild_dashboard.py): dark
card grid, per-item review buttons, summary bar — but each card is a SCENE, shown
keyframe-first so you can judge composition/flow before spending video generations.
Once a scene's clip exists, its card swaps the still for the video preview.

Usage:  python rebuild_storyboard.py [project-dir]
        default project-dir: ../crypto-promo (relative to this script)
"""
import json, subprocess, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(HERE, "..", "crypto-promo")
MANIFEST = os.path.join(PROJECT, "storyboard.json")
DASHBOARD = os.path.join(PROJECT, "storyboard.html")


def dur(path):
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]
        ).decode().strip()
        return float(out)
    except Exception:
        return 0.0


def fmt_dur(d):
    d = int(round(d))
    return f"{d // 60}m {d % 60:02d}s" if d >= 60 else f"{d}s"


with open(MANIFEST, encoding="utf-8") as f:
    man = json.load(f)

scenes_out = []
total = 0.0
for i, sc in enumerate(man.get("scenes", [])):
    kf = sc.get("keyframe") or ""
    clip = sc.get("clip") or ""
    has_kf = bool(kf and os.path.exists(os.path.join(PROJECT, kf)))
    has_clip = bool(clip and os.path.exists(os.path.join(PROJECT, clip)))
    stage = "clip" if has_clip else ("keyframe" if has_kf else "planned")
    planned = float(sc.get("duration", 0) or 0)
    d = dur(os.path.join(PROJECT, clip)) if has_clip else planned
    total += d
    scenes_out.append({
        "id": sc.get("id", f"s{i + 1:02d}"),
        "order": sc.get("order", i + 1),
        "character": sc.get("character", ""),
        "summary": sc.get("summary", ""),
        "dialogue": sc.get("dialogue", ""),
        "prompt": sc.get("prompt", ""),
        "duration": fmt_dur(d),
        "stage": stage,
        "keyframe": kf if has_kf else "",
        "clip": clip if has_clip else "",
    })

# --- generated clips gallery (separate group: actual rendered output) ---
clips_dir = os.path.join(PROJECT, "clips")
clips_out = []
if os.path.isdir(clips_dir):
    for fn in sorted(os.listdir(clips_dir)):
        if fn.startswith("_"):
            continue  # internal/test artifacts (e.g. _twovoice-test.mp4) are not storyboard clips
        if fn.lower().endswith((".mp4", ".mov", ".webm", ".m4v")):
            rel = ("clips/" + fn)
            clips_out.append({
                "name": fn,
                "clip": rel,
                "duration": fmt_dur(dur(os.path.join(clips_dir, fn))),
            })

aspect_css = str(man.get("aspect_ratio", "9:16")).replace(":", "/")

# --- final assembled video(s): the edited (captions+overlays) cut is the deliverable;
#     the raw concat is kept as the pre-edit reference ---
final_out = None
edited_path = os.path.join(PROJECT, "crypto-promo-EDITED.mp4")
concat_path = os.path.join(PROJECT, "crypto-promo-FINAL.mp4")
if os.path.isfile(edited_path):
    final_out = {"clip": "crypto-promo-EDITED.mp4", "duration": fmt_dur(dur(edited_path)),
                 "label": "EDITED (captions + overlays)"}
elif os.path.isfile(concat_path):
    final_out = {"clip": "crypto-promo-FINAL.mp4", "duration": fmt_dur(dur(concat_path)),
                 "label": "raw concat"}

data = {
    "title": man.get("title", man.get("project", "Storyboard")),
    "notes": man.get("notes", ""),
    "total": fmt_dur(total),
    "scenes": scenes_out,
    "clips": clips_out,
    "final": final_out,
}
data_js = json.dumps(data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{data['title']} — Storyboard</title>
<style>
  *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
  body{{background:#0d0d0d;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px 24px 90px;}}
  header{{margin-bottom:36px;border-bottom:1px solid #2a2a2a;padding-bottom:20px;}}
  header h1{{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.03em;}}
  header p{{margin-top:6px;font-size:13px;color:#666;max-width:900px;line-height:1.5;}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:28px;}}
  .card{{background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;transition:border-color .2s;display:flex;flex-direction:column;}}
  .card:hover{{border-color:#444;}}
  .card.approved{{border-color:#00e5ff;box-shadow:0 0 0 1px #00e5ff22;}}
  .card.regen{{border-color:#d4a017;box-shadow:0 0 0 1px #d4a01722;}}
  .media-wrap{{background:#000;aspect-ratio:{aspect_css};max-height:520px;overflow:hidden;position:relative;}}
  .media-wrap video,.media-wrap img{{width:100%;height:100%;object-fit:contain;display:block;}}
  .placeholder{{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#444;font-size:13px;letter-spacing:.08em;text-transform:uppercase;background:repeating-linear-gradient(45deg,#121212,#121212 10px,#161616 10px,#161616 20px);}}
  .card-body{{padding:16px 18px 18px;display:flex;flex-direction:column;gap:10px;flex:1;}}
  .row1{{display:flex;align-items:baseline;justify-content:space-between;gap:8px;}}
  .scene-num{{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#555;}}
  .char{{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#888;}}
  .summary{{font-size:15px;font-weight:700;color:#fff;line-height:1.3;}}
  .dialogue{{font-size:13px;color:#bbb;line-height:1.45;font-style:italic;border-left:2px solid #333;padding-left:10px;}}
  .meta{{display:flex;gap:8px;flex-wrap:wrap;}}
  .tag{{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.05em;text-transform:uppercase;}}
  .tag-dur{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}}
  .tag-planned{{background:#222;color:#888;border:1px solid #333;}}
  .tag-keyframe{{background:#1a2330;color:#5b9bd5;border:1px solid #29405c;}}
  .tag-clip{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}}
  details{{font-size:12px;color:#888;}}
  details summary{{cursor:pointer;color:#666;font-weight:600;letter-spacing:.04em;}}
  details pre{{margin-top:8px;white-space:pre-wrap;color:#9a9a9a;background:#101010;border:1px solid #242424;border-radius:6px;padding:10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11.5px;line-height:1.5;max-height:220px;overflow:auto;}}
  .actions{{display:flex;gap:10px;margin-top:auto;padding-top:4px;}}
  .btn{{flex:1;padding:9px 0;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.04em;transition:opacity .15s;}}
  .btn:hover{{opacity:.85;}}
  .btn-approve{{background:#00e5ff;color:#000;}}
  .btn-regen{{background:#2a2a2a;color:#d4a017;}}
  .btn-approved{{background:#00e5ff22;color:#00e5ff;border:1px solid #00e5ff44;}}
  .btn-regenset{{background:#2a2012;color:#d4a017;border:1px solid #4a3a12;}}
  .group-head{{margin:48px 0 20px;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;border-bottom:1px solid #2a2a2a;padding-bottom:12px;}}
  .clip-name{{font-size:13px;font-weight:600;color:#ddd;word-break:break-all;font-family:'JetBrains Mono',ui-monospace,monospace;}}
  .empty-note{{color:#555;font-size:13px;font-style:italic;}}
  .summary-bar{{position:fixed;bottom:0;left:0;right:0;background:#111;border-top:1px solid #2a2a2a;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;font-size:13px;z-index:100;}}
  .summary-bar span{{color:#666;}} .summary-bar strong{{color:#00e5ff;}} .summary-bar .runtime{{color:#5caf82;}}
</style></head><body>
<header>
  <h1>{data['title']} — Storyboard</h1>
  <p>{data['notes']}</p>
</header>
<div class="grid" id="grid"></div>
<h2 class="group-head" id="clips-head">Generated Clips</h2>
<div class="grid" id="clips-grid"></div>
<h2 class="group-head" id="final-head" style="display:none">Final Clip</h2>
<div class="grid" id="final-grid"></div>
<div class="summary-bar">
  <span>Total runtime: <strong class="runtime" id="runtime">{data['total']}</strong> &nbsp;·&nbsp; Approved: <strong id="count">0</strong> / <span id="total-scenes">0</span></span>
  <div id="approved-list" style="color:#aaa;font-size:12px;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">—</div>
</div>
<script>
const data = {data_js};
const scenes = data.scenes;
const state = {{}}; scenes.forEach(s => state[s.id]='none');
document.getElementById('total-scenes').textContent = scenes.length;

function mediaHTML(s) {{
  if (s.clip)     return `<video controls preload="metadata" src="${{s.clip}}"></video>`;
  if (s.keyframe) return `<img src="${{s.keyframe}}" alt="keyframe">`;
  return `<div class="placeholder">No keyframe yet</div>`;
}}

function render() {{
  const grid = document.getElementById('grid'); grid.innerHTML='';
  scenes.forEach((s,i) => {{
    const st = state[s.id];
    const stageTag = `<span class="tag tag-${{s.stage}}">${{s.stage}}</span>`;
    const durTag = `<span class="tag tag-dur">${{s.duration}}</span>`;
    const charTag = s.character ? `<span class="char">${{s.character}}</span>` : '';
    const dialogue = s.dialogue ? `<div class="dialogue">${{s.dialogue}}</div>` : '';
    const promptBlock = s.prompt ? `<details><summary>prompt</summary><pre>${{s.prompt.replace(/</g,'&lt;')}}</pre></details>` : '';
    const approveBtn = st==='approved'
      ? `<button class="btn btn-approved" onclick="toggle('${{s.id}}','approved')">✓ Approved</button>`
      : `<button class="btn btn-approve" onclick="toggle('${{s.id}}','approved')">Approve</button>`;
    const regenBtn = st==='regen'
      ? `<button class="btn btn-regenset" onclick="toggle('${{s.id}}','regen')">↻ Regenerate</button>`
      : `<button class="btn btn-regen" onclick="toggle('${{s.id}}','regen')">Regenerate</button>`;
    const card = document.createElement('div');
    card.className = 'card' + (st==='approved'?' approved':st==='regen'?' regen':'');
    card.innerHTML = `
      <div class="media-wrap">${{mediaHTML(s)}}</div>
      <div class="card-body">
        <div class="row1"><div class="scene-num">Scene ${{i+1}} of ${{scenes.length}}</div>${{charTag}}</div>
        <div class="summary">${{s.summary}}</div>
        ${{dialogue}}
        <div class="meta">${{durTag}}${{stageTag}}</div>
        ${{promptBlock}}
        <div class="actions">${{approveBtn}}${{regenBtn}}</div>
      </div>`;
    grid.appendChild(card);
  }});
  updateSummary();
}}
function renderClips() {{
  const grid = document.getElementById('clips-grid');
  const head = document.getElementById('clips-head');
  const clips = data.clips || [];
  head.textContent = `Generated Clips (${{clips.length}})`;
  grid.innerHTML = '';
  if (!clips.length) {{
    grid.innerHTML = `<div class="empty-note">No clips rendered yet.</div>`;
    return;
  }}
  clips.forEach(c => {{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="media-wrap"><video controls preload="metadata" src="${{c.clip}}"></video></div>
      <div class="card-body">
        <div class="clip-name">${{c.name}}</div>
        <div class="meta"><span class="tag tag-dur">${{c.duration}}</span></div>
      </div>`;
    grid.appendChild(card);
  }});
}}
function renderFinal() {{
  const f = data.final;
  if (!f) return;
  document.getElementById('final-head').style.display = '';
  document.getElementById('final-head').textContent = `Final Clip (${{f.duration}})`;
  const grid = document.getElementById('final-grid');
  const card = document.createElement('div');
  card.className = 'card approved';
  card.innerHTML = `
    <div class="media-wrap"><video controls preload="metadata" src="${{f.clip}}"></video></div>
    <div class="card-body">
      <div class="clip-name">${{f.clip}}</div>
      <div class="meta"><span class="tag tag-dur">${{f.duration}}</span><span class="tag tag-clip">FINAL</span></div>
    </div>`;
  grid.appendChild(card);
}}
function toggle(id,action){{ state[id]=state[id]===action?'none':action; render(); }}
function updateSummary(){{
  const a = scenes.filter(s=>state[s.id]==='approved');
  document.getElementById('count').textContent=a.length;
  document.getElementById('approved-list').textContent=a.length?a.map(s=>s.summary).join(' · '):'—';
}}
render();
renderClips();
renderFinal();
</script></body></html>"""

with open(DASHBOARD, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Storyboard rebuilt: {len(scenes_out)} scenes, total {fmt_dur(total)} -> {DASHBOARD}")
for s in scenes_out:
    print(f"  {s['id']:22s} {s['duration']:7s} {s['stage']:9s} {s['summary'][:50]}")
