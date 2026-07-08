"""
Cut preview clips for the "My new 353x LOW BPS" vertical livestream (Phase 4b).
Source is the Phase-1 vertical (content top + face bottom) — no crop, just trim.
Phrase-anchored boundaries resolve to exact Whisper word timestamps. RE-ENCODE every
segment (A/V sync rule: never -c copy across splices); concat re-encoded segments for
multi-segment clips. Emits dashboard + progress.json.

IMPORTANT: only the derived .txt artifacts were STT-corrected this run, NOT the JSON.
So phrase anchors here must match the RAW Whisper tokens (e.g. avoid the corrected
terms; the anchors below were chosen to sit on clean, unambiguous raw words).

Topics: #1 (the 353x call) ships in THREE length variants — short punch, medium,
and the full-story long cut — so Mike can pick the runtime. Topic #2 (moon bag) is a
2-segment assembly; #3/#4/#5 are single contiguous cuts.
"""
import json, subprocess, os

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "My new 353x LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "my 353x", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\353x"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")

os.makedirs(OUT_BASE, exist_ok=True)

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)

all_words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        all_words.append({
            "word": w["word"].strip().lower().strip(".,!?'\""),
            "start": w.get("start", seg["start"]),
            "end":   w.get("end",   seg["end"]),
        })

def _norm(phrase):
    return [w.strip().lower().strip(".,!?'\"") for w in phrase.split()]

def find_start(phrase, after=0):
    words = _norm(phrase); n = len(words)
    for i, w in enumerate(all_words):
        if w["start"] < after: continue
        if [x["word"] for x in all_words[i:i+n]] == words:
            return all_words[i]["start"]
    return None

def find_end(phrase, after=0):
    words = _norm(phrase); n = len(words)
    for i, w in enumerate(all_words):
        if w["start"] < after: continue
        if [x["word"] for x in all_words[i:i+n]] == words:
            return all_words[i+n-1]["end"]
    return None

def resolve(seg):
    sp, ep, after = seg
    s = find_start(sp, after)
    e = find_end(ep, after=(s if s is not None else after))
    return s, e

# ── Topic definitions: each segment = (start_phrase, end_phrase, after_seconds) ──
TOPICS = [
    {"slug": "353x-reveal-short", "title": "353x in a Bear Market (punch)",
     "hook": "\"353x. Unbelievable. And we did it in a bear market.\" — the tightest version.",
     "multi": False, "segments": [
        ("we have a three hundred", "in a bear market it is crazy", 60),
     ]},
    {"slug": "353x-reveal-medium", "title": "353x: I Only Gave It a 20x Target",
     "hook": "\"I only gave it a 20x target and it went to 353x, and it still didn't even dump.\"",
     "multi": False, "segments": [
        ("we have a three hundred", "seen something more beautiful", 60),
     ]},
    {"slug": "353x-reveal-long", "title": "353x Bear-Market Call: The Full Story",
     "hook": "The build, the reveal, the insider-alert scanner, and the 2nd-best community call.",
     "multi": False, "segments": [
        ("we kept on going up and up", "second best call in my community", 50),
     ]},
    {"slug": "moon-bag-lesson", "title": "I Sold at 87x, It Hit 353x: The Moon Bag",
     "hook": "\"I sold the majority at an 87x. But I kept a moon bag — keep 10%, every time.\"",
     "multi": True, "segments": [
        ("i sold the majority of my bag", "so it's it is awesome", 270),
        ("lesson learned for a lot of folks", "keep selling my moon bag", 380),
     ]},
    {"slug": "short-squeeze-leverage", "title": "They Shorted It, Market Makers Liquidated Them",
     "hook": "\"Everyone was shorting it, so the market makers bought the supply and liquidated them. You're betting against the people who run the system.\"",
     "multi": False, "segments": [
        ("a lot of people was shorting it", "they want you to lose", 430),
     ]},
    {"slug": "saylor-fraction-panic", "title": "Saylor Sold a Fraction of a Percent, Everyone Panicked",
     "hook": "\"We broke the channel because Saylor sold a fraction of a percent. People react more to that than to an attack in Iran.\"",
     "multi": False, "segments": [
        ("we finally broke down below this channel", "then some attack and iran", 760),
     ]},
    {"slug": "kevin-warsh-100m", "title": "The New Fed Chair Has $100M in Crypto",
     "hook": "\"Kevin Warsh, the new Fed chair, has over $100 million in crypto. He's on our side.\"",
     "multi": False, "segments": [
        ("kevin warsh the new fed chair", "hopefully things work out", 860),
     ]},
]

# ── Resolve timestamps ───────────────────────────────────────────────────────
print("== Resolving timestamps ==")
for t in TOPICS:
    resolved = []
    for seg in t["segments"]:
        s, e = resolve(seg)
        resolved.append((s, e))
        tag = "OK " if (s is not None and e is not None) else "!! MISSING"
        st = f"{int(s//60)}:{int(s%60):02d}" if s is not None else "??"
        en = f"{int(e//60)}:{int(e%60):02d}" if e is not None else "??"
        dur = f"{e-s:.0f}s" if (s is not None and e is not None) else "?"
        print(f"  [{tag}] {t['slug']:24s} {st}-{en} ({dur})  <- '{seg[0][:40]}'")
    t["resolved"] = resolved

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

print("\n== Cutting ==")
for t in TOPICS:
    segs = [(s, e) for s, e in t["resolved"] if s is not None and e is not None]
    out_dir = os.path.join(OUT_BASE, t["slug"])
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    if not segs:
        print(f"  SKIP {t['slug']} — no resolved segments"); t["duration"] = 0; t["ok"] = False; continue
    t["duration"] = sum(e - s for s, e in segs)
    print(f"  {t['slug']} ({int(t['duration']//60)}m{int(t['duration']%60):02d}s) ...", end=" ", flush=True)
    ok = cut_segment(segs[0][0], segs[0][1], out_path) if len(segs) == 1 else cut_multi(segs, out_path, out_dir)
    t["ok"] = ok
    print("OK" if ok else "FAILED")

# ── Dashboard ──────────────────────────────────────────────────────────────────
def fmt_times(resolved):
    out = []
    for s, e in resolved:
        if s is None: continue
        out.append(f"{int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}")
    return out

card_data = [{
    "slug": t["slug"], "title": t["title"], "hook": t["hook"], "times": fmt_times(t["resolved"]),
    "multi": t["multi"], "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]

cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>353x LOW BPS — Draft Clips</title>
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
  .tag-multi{{background:#201e10;color:#d4a017;border:1px solid #40380a;}}
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
  <h1>My new 353x LOW BPS — Draft Clips</h1>
  <p>7 candidate clips (Topic 1 in 3 lengths) &nbsp;·&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;·&nbsp; Watch each, then Approve or Skip</p>
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
    const multiTag = t.multi ? `<span class="tag tag-multi">multi-segment</span>` : '';
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
        <div class="meta">${{timeTags}}${{multiTag}}${{durTag}}</div>
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
        "source_times": fmt_times(t["resolved"]),
        "multi": t["multi"],
        "phase_status": {p: ("done" if (p == "preview" and t.get("ok")) else "todo") for p in PHASES},
    })

rel = "livestream-repurpose/transcripts/" + NAME + "/" + NAME
progress = {
    "$schema_version": 1,
    "batch": "353x",
    "source_livestream": NAME,
    "dashboard": "shorts/353x/dashboard.html",
    "dashboard_status": "Built 7 raw preview clips (Topic 1 in 3 lengths). AWAITING Mike's review/approval — do NOT start production until clips are approved.",
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

# ── Register the batch in the repo-root registry (MANDATORY — cleanup protects ONLY
#    registered active batches; an unregistered batch's dirs are recyclable). SKILL.md Phase 4b. ──
import sys
REPO_ROOT = os.path.dirname(os.path.dirname(BASE))   # livestream-repurpose -> video-creation -> repo root
sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))
from register_batch import register_batch
register_batch(
    batch="353x", date="2026-06-03", livestream_title=NAME,
    source_media="video-creation/livestream-repurpose/media/my 353x/" + NAME + ".mp4",
    transcripts_dir="video-creation/livestream-repurpose/transcripts/" + NAME,
    dashboard="video-creation/shorts/353x/dashboard.html",
    shorts="active", repurpose="pending",
)

ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
print(f"Progress:  {PROGRESS}")
