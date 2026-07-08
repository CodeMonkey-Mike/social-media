"""
Cut preview clips for the 14 selected shorts from the "Best Cryptos to Make Your
Wife Lose Weight" vertical livestream. Source is the Phase-1 vertical (content zone
top + face bottom) — no crop, just trim. Phrase-anchored boundaries resolve to exact
Whisper word timestamps. RE-ENCODE every segment (A/V sync rule: never -c copy across
splices); concat re-encoded segments for multi-segment clips. Emits dashboard + progress.json.

Kaspa mishears were already corrected to "Kaspa" in the JSON, so phrases use "kaspa".
NOTE: Whisper tokenizes hyphenated words with a leading hyphen ("all -time", "run -up"),
and _norm() does NOT strip hyphens — so phrases must keep them ("all -time", "run -up").
"""
import json, subprocess, os

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "best cryptos to make your wife lose weight LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\wife-lose-weight"
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
    {"slug": "wife-lose-weight-title", "title": "Cryptos to Make Your Wife Lose Weight",
     "hook": "The title gag — coins to move out of your mama's house and retire the bloodline.",
     "multi": True, "segments": [
        ("the best cryptos to make you move out", "make her lose some weight", 30),
        ("you want to retire your entire family bloodline", "have her invite a friend over", 285),
     ]},
    {"slug": "unicorn-fart-dust", "title": "Unicorn Fart Dust Is On Fire",
     "hook": "On fire the last two days; the founder's live in a space — going over 20 million.",
     "multi": True, "segments": [
        ("there's a few other ones like unicorn fart", "on fire like last two days", 285),
        ("ron is i guess the founder of unicorn fart dust", "definitely going to go over 20 million", 585),
     ]},
    {"slug": "pengu-launch-tell", "title": "How a VC Really Launches a Meme Coin (Pengu)",
     "hook": "Pengu hit every tier-one exchange at 8am — that's the VC-backed coordinated launch tell.",
     "multi": False, "segments": [
        ("the biggest coordinated effort launch that i've ever seen", "the way you're going to launch a meme coin", 1555),
     ]},
    {"slug": "lab-rotation", "title": "How I Rotate LAB Profits Into the Next 100x",
     "hook": "Take 50–100 of LAB on red and rotate it — 140 into Keeta, doginme again, and Bombett.",
     "multi": False, "segments": [
        ("i've been rotating like a whole bunch of my lab", "another high risk one is bombett", 1635),
     ]},
    {"slug": "lab-115x-bear-market", "title": "I Called a 20x on LAB — It Did 115x in a Bear Market",
     "hook": "\"My prediction was a 20x… we're at 115x already, in a bear market.\"",
     "multi": True, "segments": [
        ("this was my prediction for lab", "115x already in a bear market", 625),
        ("it's eight dollars and 11 cents", "this thing is still going man", 175),
     ]},
    {"slug": "lab-wont-go-down", "title": "LAB Just Won't Go Down — New ATH Every Week",
     "hook": "\"Every other week it's making another new all-time high — very interesting.\"",
     "multi": False, "segments": [
        ("lab is one of these things where it just doesn't want to go down",
         "making another new all -time high which is very interesting", 715),
     ]},
    {"slug": "kaspa-3-dollars", "title": "$3 Kaspa Is Realistic — Here's When",
     "hook": "\"100x puts Kaspa at $3 — realistic, but only in a parabolic cycle top.\"",
     "multi": True, "segments": [
        ("100x with kaspa put it at", "in a parabolic run -up in a cycle top", 1955),
        ("kaspa's definitely gonna do a lab", "get to like three dollars", 2875),
     ]},
    {"slug": "kaspa-hold-my-beer", "title": "Kaspa's Tech Is Off the Charts — Hold My Beer",
     "hook": "Bitcoin security + Ethereum programmability — \"they're saying hold my beer.\"",
     "multi": False, "segments": [
        ("kaspa's got this whole thing with the technology", "gonna steal the show at some point", 3195),
     ]},
    {"slug": "kaspa-ton-best-plays", "title": "Kaspa & TON: The Best Two Plays of the Cycle",
     "hook": "\"Bittensor and Kaspa… the best two plays — Kaspa and ton coin.\"",
     "multi": True, "segments": [
        ("i think like a bettanzer and kaspa", "the best place of this this cycle", 2975),
        ("the best two plays the best goddamn plays", "kaspa and ton coin", 3140),
     ]},
    {"slug": "thousand-dollar-bounty", "title": "My $1,000 Bounty Nobody Will Claim",
     "hook": "\"Find me another influencer with all this tech… nobody's even tried to claim it.\"",
     "multi": False, "segments": [
        ("i've had this bounty for a long time", "nobody has even tried to claim it", 1770),
     ]},
    {"slug": "wells-fargo-camera", "title": "$400 Edit: 100 Views. A Wells Fargo Rant: 10,000",
     "hook": "40 hours and $400 got 100 views; an unedited Wells Fargo rant got 10,000 in 3 days.",
     "multi": False, "segments": [
        ("i had a production budget of like let's say", "but i didn't do any editing", 1365),
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
<title>Wife Lose Weight — Draft Clips</title>
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
  <h1>Best Cryptos to Make Your Wife Lose Weight — Draft Clips</h1>
  <p>14 candidate shorts &nbsp;·&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;·&nbsp; Watch each, then Approve or Skip</p>
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
        <div class="topic-num">Short ${{i+1}} of ${{topics.length}}</div>
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
    "batch": "wife-lose-weight",
    "source_livestream": NAME,
    "dashboard": "shorts/wife-lose-weight/dashboard.html",
    "dashboard_status": "Built 14 raw preview clips. AWAITING Mike's review/approval — do NOT start production until clips are approved.",
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

ok_n = sum(1 for t in TOPICS if t.get("ok"))
print(f"\n{ok_n}/{len(TOPICS)} clips cut")
print(f"Dashboard: {DASHBOARD}")
print(f"Progress:  {PROGRESS}")
