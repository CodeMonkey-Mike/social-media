"""
Cut preview clips for the "Best 350x Cryptos To Make Me Millions! LOW BPS" vertical
livestream (Phase 4b). Source is the Phase-1 GPU vertical (content top + face bottom) —
no crop, just trim. Direct word-level timestamps (resolved from the Whisper word file),
RE-ENCODE every segment (A/V sync rule: never -c copy across splices). Emits dashboard +
progress.json and registers the batch.

8 topics -> 10 clips. Topic "353x call" ships in 2 lengths (punch + reveal); the
BTC-bottom thesis ships as 2 angles (Saylor panic + the 1992 economy long cut).
All clips are single contiguous cuts (no multi-segment assembly this batch).
"""
import json, subprocess, os, sys

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "Best 350x Cryptos To Make Me Millions! LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "Best 350x Cryptos That Will Make me a Millionaire", NAME + ".mp4")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\best-350x"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")

os.makedirs(OUT_BASE, exist_ok=True)

# ── Topic definitions: each segment = (start_sec, end_sec) ──────────────────────
TOPICS = [
    {"slug": "353x-20x-punch", "title": "I Said 20x. It Did 353x.", "multi": False,
     "hook": "\"I said lab was going to be a goddamn 20x, and then I'm doing a 353x. Isn't it good to be wrong?\"",
     "segments": [(1268, 1296)]},
    {"slug": "353x-reveal", "title": "353x on LAB, My 2nd-Best Call Ever, In a Bear Market", "multi": False,
     "hook": "\"We did a 353x. My second best call, behind MYX. All-time high $27.22, and it still hasn't dumped.\"",
     "segments": [(10, 63)]},
    {"slug": "moon-bag", "title": "Sold at 80x, Kept a Moon Bag, Rode It to $26", "multi": False,
     "hook": "\"A lot of my group sold it all at 80x. I kept the moon bag and sold all the way up to $26.\"",
     "segments": [(1767, 1822)]},
    {"slug": "short-squeeze-leverage", "title": "Why Leverage Is a Trap: You're Betting Against the System", "multi": False,
     "hook": "\"The market makers buy the supply and liquidate the shorts. You're betting against the people who run the system, and they want you to lose.\"",
     "segments": [(1712, 1751)]},
    {"slug": "saylor-fraction-panic", "title": "Saylor Sold a Fraction of a Percent and Everyone Panicked", "multi": False,
     "hook": "\"We broke the channel because Michael Saylor sold a fraction of a percent. Everybody freaked out.\"",
     "segments": [(2002, 2036)]},
    {"slug": "economy-1992", "title": "We're in 1992: The Four-Year-Cycle Zombies Are About to Be Wrong", "multi": False,
     "hook": "\"New orders are rising even with these prices. The economy is screaming. The cycle zombies calling 32k don't see it yet.\"",
     "segments": [(2254, 2346)]},
    {"slug": "ai-dwarfs-dotcom", "title": "AI Is Going to Dwarf the Dot-Com Explosion", "multi": False,
     "hook": "\"AI is a massive economic expansion. It's going to dwarf the dot-com era, and it's happening far faster.\"",
     "segments": [(632, 721)]},
    {"slug": "pippin-85x-cex-tell", "title": "How I Caught an 85x on Pippin: Watch the Exchange Listings", "multi": False,
     "hook": "\"It went dead in August. Then it got listed on four exchanges in a single day, and Pippin started ripping. 85x.\"",
     "segments": [(4262, 4353)]},
    {"slug": "elizaos-freebie", "title": "Don't Sleep on ElizaOS: A Free 24x I Already Called", "multi": False,
     "hook": "\"Don't sleep on ElizaOS. That's a freebie. 24x on AI16Z, and it's just a rebrand.\"",
     "segments": [(941, 972)]},
    {"slug": "linea-xrp-useless", "title": "Linea Just Made XRP Useless", "multi": False,
     "hook": "\"Linea has the Swift partnership. It makes XRP useless. XRP is hoping on a banking miracle.\"",
     "segments": [(1105, 1143)]},
]

# ── Cut (RE-ENCODE; never -c copy across splices) ──────────────────────────────
def cut_segment(start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", SRC, "-t", str(end - start),
           "-c:v", "libx264", "-preset", "fast", "-crf", "18",
           "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    ffmpeg error: {r.stderr[-300:]}")
    return r.returncode == 0

def cut_multi(segs, out_path, work_dir):
    tmp_files = []
    for i, (s, e) in enumerate(segs):
        tmp = os.path.join(work_dir, f"_tmp{i}.mp4")
        if cut_segment(s, e, tmp): tmp_files.append(tmp)
    concat_txt = os.path.join(work_dir, "_concat.txt")
    with open(concat_txt, "w") as f:
        for tmp in tmp_files:
            f.write(f"file '{tmp.replace(os.sep, '/')}'\n")
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_txt, "-c", "copy", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    concat error: {r.stderr[-300:]}")
    for tmp in tmp_files + [concat_txt]:
        if os.path.exists(tmp): os.remove(tmp)
    return r.returncode == 0

print("== Cutting ==")
for t in TOPICS:
    segs = t["segments"]
    out_dir = os.path.join(OUT_BASE, t["slug"])
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    t["duration"] = sum(e - s for s, e in segs)
    print(f"  {t['slug']:24s} ({int(t['duration']//60)}m{int(t['duration']%60):02d}s) ...", end=" ", flush=True)
    ok = cut_segment(segs[0][0], segs[0][1], out_path) if len(segs) == 1 else cut_multi(segs, out_path, out_dir)
    t["ok"] = ok
    print("OK" if ok else "FAILED")

def fmt_times(segs):
    return [f"{int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}" for s, e in segs]

card_data = [{
    "slug": t["slug"], "title": t["title"], "hook": t["hook"], "times": fmt_times(t["segments"]),
    "multi": t["multi"], "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best 350x LOW BPS — Draft Clips</title>
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
  <h1>Best 350x Cryptos To Make Me Millions — Draft Clips</h1>
  <p>10 candidate clips / 8 topics &nbsp;·&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;·&nbsp; Watch each, then Approve or Skip</p>
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
    const timeTags = t.times.map(ts=>`<span class="tag tag-time">${{ts}}</span>`).join('');
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
  document.getElementById('approved-list').textContent=a.length?a.map(t=>t.title).join(' · '):'—';
}}
render();
</script></body></html>"""

with open(DASHBOARD, "w", encoding="utf-8") as f:
    f.write(html)

# ── progress.json ───────────────────────────────────────────────────────────────
PHASES = ["preview", "whisper", "captions", "broll_prompts", "broll_pngs",
          "constants", "comp", "root_registered", "rendered"]
clips = []
for i, t in enumerate(TOPICS, 1):
    clips.append({
        "n": i, "slug": t["slug"], "title": t["title"],
        "duration_seconds": round(t.get("duration", 0), 2),
        "source_times": fmt_times(t["segments"]),
        "multi": t["multi"],
        "phase_status": {p: ("done" if (p == "preview" and t.get("ok")) else "todo") for p in PHASES},
    })

rel = "livestream-repurpose/transcripts/" + NAME + "/" + NAME
progress = {
    "$schema_version": 1,
    "batch": "best-350x",
    "source_livestream": NAME,
    "dashboard": "shorts/best-350x/dashboard.html",
    "dashboard_status": "Built 10 raw preview clips (8 topics; 353x in 2 lengths, BTC-bottom in 2 angles). AWAITING Mike's review/approval — do NOT start silence removal or production until clips are approved.",
    "source_transcript": rel + "_plain.txt",
    "source_transcript_words_json": rel + ".json",
    "source_transcript_chunks_90s": rel + "_chunks_90s.txt",
    "phases": PHASES,
    "clips": clips,
    "resume_protocol": [
        "1. Read this file at session start.",
        "2. Clips await Mike's dashboard approval before any silence-removal/production phase.",
        "3. Once approved, for each approved clip pick the leftmost non-'done' phase in `phases` order.",
        "4. Execute per video-creation/SKILL.md; mark phase 'in_progress' then 'done'; bump last_updated.",
    ],
}
with open(PROGRESS, "w", encoding="utf-8") as f:
    json.dump(progress, f, indent=2)

# ── Register the batch in the repo-root registry (MANDATORY — SKILL.md Phase 4b) ──
REPO_ROOT = os.path.dirname(os.path.dirname(BASE))   # livestream-repurpose -> video-creation -> repo root
sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))
from register_batch import register_batch
register_batch(
    batch="best-350x", date="2026-06-04", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/Best 350x Cryptos That Will Make me a Millionaire/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/best-350x/dashboard.html",
    shorts="active", repurpose="pending",
)

ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
print(f"Progress:  {PROGRESS}")
