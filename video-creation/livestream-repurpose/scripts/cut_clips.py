"""
Cut raw clips for selected topics.
Uses word-level timestamps from Whisper JSON for precision — no bleed into off-topic sections.
"""
import json, subprocess, os

SRC      = r"C:\Users\mnede\Documents\Claude\video-creation\livestream-repurpose\media\market update VERTICAL.mp4"
OUT_BASE = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\market-update-clips"
JSON_SRC = r"C:\Users\mnede\Documents\Claude\video-creation\livestream-repurpose\transcripts\market update VERTICAL.json"

os.makedirs(OUT_BASE, exist_ok=True)

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)

segments = data["segments"]

# Build a flat word list with timestamps for granular lookup
all_words = []
for seg in segments:
    for w in seg.get("words", []):
        all_words.append({
            "word": w["word"].strip().lower().strip(".,!?'\""),
            "start": w.get("start", seg["start"]),
            "end":   w.get("end",   seg["end"]),
        })

def find_phrase_start(phrase, after=0):
    """Return the start timestamp of the first word of `phrase` occurring after `after` seconds."""
    words = [w.strip().lower().strip(".,!?'\"") for w in phrase.split()]
    n = len(words)
    for i, w in enumerate(all_words):
        if w["start"] < after:
            continue
        if all_words[i:i+n] and [x["word"] for x in all_words[i:i+n]] == words:
            return all_words[i]["start"]
    return None

def find_phrase_end(phrase, after=0):
    """Return the end timestamp of the last word of `phrase` occurring after `after` seconds."""
    words = [w.strip().lower().strip(".,!?'\"") for w in phrase.split()]
    n = len(words)
    for i, w in enumerate(all_words):
        if w["start"] < after:
            continue
        if all_words[i:i+n] and [x["word"] for x in all_words[i:i+n]] == words:
            return all_words[i+n-1]["end"]
    return None

def seg_end_after(phrase, after=0):
    """Return the segment end time for the segment containing phrase."""
    phrase = phrase.lower()
    for s in segments:
        if s["start"] < after: continue
        if phrase in s["text"].lower():
            return s["end"]
    return None

# ── Define clip boundaries (word-level precision) ────────────────────────────

clips = []

# ── Topic 7: AI Changing the Job Market  (~20:29–21:14) ──────────────────────
t7_start = find_phrase_start("we got this change of hands this change of hands happening")
t7_end   = find_phrase_end("it's probably before you know it", after=t7_start or 0)
if not t7_end:
    t7_end = find_phrase_end("before you know it", after=t7_start or 0)
print(f"Topic 7  AI job market:     {t7_start:.1f}s – {t7_end:.1f}s  ({(t7_end-t7_start):.0f}s)")
clips.append({
    "slug": "ai-job-market",
    "title": "AI Is Changing the Job Market",
    "segments": [(t7_start, t7_end)],
})

# ── Topic 8: Kaspa — price scenarios + 27-day hard fork ──────────────────────
# Seg 1: price scenarios  (~10:37–11:20)
t8a_start = find_phrase_start("with caspa we if this year goes well", after=600)
if not t8a_start:
    t8a_start = find_phrase_start("if this year goes well we could", after=600)
t8a_end   = find_phrase_end("we'll see what happens right", after=t8a_start or 0)
print(f"Topic 8a Kaspa prices:      {t8a_start:.1f}s – {t8a_end:.1f}s  ({(t8a_end-t8a_start):.0f}s)")

# Seg 2: 27-day hard fork + long-term thesis  (~24:33–29:10)
t8b_start = find_phrase_start("we got 27 days", after=1400)
if not t8b_start:
    t8b_start = find_phrase_start("27 days before this", after=1400)
# End: after "we have the best goddamn coin on planet earth"
t8b_end   = find_phrase_end("when the market does pump we have the best goddamn coin on planet earth", after=t8b_start or 0)
if not t8b_end:
    t8b_end = seg_end_after("when the market does pump we have the best", after=t8b_start or 0)
print(f"Topic 8b Kaspa hard fork:   {t8b_start:.1f}s – {t8b_end:.1f}s  ({(t8b_end-t8b_start):.0f}s)")

clips.append({
    "slug": "kaspa-hard-fork",
    "title": "Kaspa — Price Targets + 27-Day Hard Fork",
    "segments": [(t8a_start, t8a_end), (t8b_start, t8b_end)],
    "multi": True,
})

# ── Topic 10: Meme coins in a bear market  (~14:00–16:45) ────────────────────
t10_start = find_phrase_start("memes are not going to do anything", after=800)
t10_end   = find_phrase_end("risky to get into a meme in a bear market", after=t10_start or 0)
print(f"Topic 10 Meme bear market:  {t10_start:.1f}s – {t10_end:.1f}s  ({(t10_end-t10_start):.0f}s)")
clips.append({
    "slug": "meme-bear-market",
    "title": "Why I'm Avoiding New Meme Coins Right Now",
    "segments": [(t10_start, t10_end)],
})

# ── Topic 11: Which memes Mike actually holds ─────────────────────────────────
# Seg 1: (~22:37–23:16) — "buy the good ones... housecoin, uranus"
t11a_start = find_phrase_start("buy the good ones that are tried and tested", after=1300)
# end at "how low their prices go" — avoids bleed into Bitcoin/bear-market-general discussion
t11a_end   = find_phrase_end("how low their prices go", after=t11a_start or 0)
if not t11a_end:
    t11a_end = seg_end_after("non-stop no matter how low their prices go", after=t11a_start or 0)
print(f"Topic 11a Meme holds seg1:  {t11a_start:.1f}s – {t11a_end:.1f}s  ({(t11a_end-t11a_start):.0f}s)")

# Seg 2: (~37:15–39:01) — Housecoin, MOTHER, URANUS with specific conviction
t11b_start = find_phrase_start("like you know house coin you know i know they're sticking", after=2100)
t11b_end   = find_phrase_end("it could easily go beyond a billion well beyond a billion", after=t11b_start or 0)
if not t11b_end:
    t11b_end = seg_end_after("it could easily go beyond a billion", after=t11b_start or 0)
print(f"Topic 11b Meme holds seg2:  {t11b_start:.1f}s – {t11b_end:.1f}s  ({(t11b_end-t11b_start):.0f}s)")

clips.append({
    "slug": "meme-holds",
    "title": "The Memes I'm Actually Holding",
    "segments": [(t11a_start, t11a_end), (t11b_start, t11b_end)],
    "multi": True,
})

# ── Topic 13: TAO — the AI all-in-one play  (~31:34–32:41) ──────────────────
# Use only the comprehensive TAO section; the earlier mention is only ~4 seconds
t13_start = find_phrase_start("same thing with tau tau is going to be a massive play", after=1800)
t13_end   = find_phrase_end("the market cap of casper is lower right", after=t13_start or 0)
if not t13_end:
    t13_end = seg_end_after("more multipliers out of casper because the market cap of casper is lower", after=t13_start or 0)
print(f"Topic 13  TAO:              {t13_start:.1f}s – {t13_end:.1f}s  ({(t13_end-t13_start):.0f}s)")

clips.append({
    "slug": "tao-ai-play",
    "title": "TAO — The AI All-In-One Play This Cycle",
    "segments": [(t13_start, t13_end)],
})

# ── Cut clips ─────────────────────────────────────────────────────────────────

def cut_single(src, start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", src, "-t", str(end - start), "-c", "copy", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    ffmpeg error: {r.stderr[-200:]}")
    return r.returncode == 0

def cut_multi(src, segs, out_path):
    tmp_files = []
    concat_txt = os.path.join(OUT_BASE, "_concat.txt")
    for i, (s, e) in enumerate(segs):
        tmp = os.path.join(OUT_BASE, f"_tmp{i}.mp4")
        tmp_files.append(tmp)
        cut_single(src, s, e, tmp)
    with open(concat_txt, "w") as f:
        for tmp in tmp_files:
            f.write(f"file '{tmp}'\n")
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_txt, "-c", "copy", out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: print(f"    concat error: {r.stderr[-200:]}")
    for tmp in tmp_files:
        if os.path.exists(tmp): os.remove(tmp)
    if os.path.exists(concat_txt): os.remove(concat_txt)
    return r.returncode == 0

print("\n== Cutting ==")
durations = {}
for clip in clips:
    slug = clip["slug"]
    segs = [(s, e) for s, e in clip["segments"] if s is not None and e is not None]
    if not segs:
        print(f"  SKIP {slug} — missing timestamps"); continue
    out_dir = os.path.join(OUT_BASE, slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "preview.mp4")
    total = sum(e - s for s, e in segs)
    durations[slug] = total
    print(f"  {slug} ({int(total//60)}m{int(total%60):02d}s) ...", end=" ", flush=True)
    ok = cut_single(SRC, segs[0][0], segs[0][1], out_path) if len(segs) == 1 else cut_multi(SRC, segs, out_path)
    print("OK" if ok else "FAILED")

# ── Dashboard ─────────────────────────────────────────────────────────────────

def fmt_dur(slug):
    d = durations.get(slug, 0)
    return f"{int(d//60)}m {int(d%60):02d}s"

def fmt_times(segs):
    return [f"{int(s//60)}:{int(s%60):02d}–{int(e//60)}:{int(e%60):02d}" for s, e in segs if s is not None]

card_data = []
for clip in clips:
    segs = [(s, e) for s, e in clip["segments"] if s is not None and e is not None]
    card_data.append({
        "slug": clip["slug"],
        "title": clip["title"],
        "times": fmt_times(segs),
        "multi": clip.get("multi", False),
        "duration": fmt_dur(clip["slug"]),
    })

cards_js = json.dumps(card_data, indent=2)

DASHBOARD = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\market-update-dashboard.html"

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Market Update — Draft Clips</title>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: #0d0d0d; color: #e0e0e0; font-family: 'Segoe UI', system-ui, sans-serif; padding: 32px 24px 80px; }}
  header {{ margin-bottom: 40px; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; }}
  header h1 {{ font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 0.04em; }}
  header p {{ margin-top: 6px; font-size: 13px; color: #666; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 28px; }}
  .card {{ background: #161616; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }}
  .card:hover {{ border-color: #444; }}
  .card.approved {{ border-color: #00e5ff; box-shadow: 0 0 0 1px #00e5ff22; }}
  .card.skipped {{ opacity: 0.45; }}
  .video-wrap {{ background: #000; aspect-ratio: 9 / 16; max-height: 480px; overflow: hidden; }}
  .video-wrap video {{ width: 100%; height: 100%; object-fit: contain; display: block; }}
  .card-body {{ padding: 16px 18px 20px; }}
  .topic-num {{ font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin-bottom: 4px; }}
  .card-title {{ font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; line-height: 1.3; }}
  .meta {{ display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }}
  .tag {{ font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 4px; letter-spacing: 0.06em; text-transform: uppercase; }}
  .tag-time {{ background: #1e1e1e; color: #888; border: 1px solid #333; }}
  .tag-dur  {{ background: #1e2620; color: #5caf82; border: 1px solid #2d4035; }}
  .tag-multi {{ background: #201e10; color: #d4a017; border: 1px solid #40380a; }}
  .actions {{ display: flex; gap: 10px; }}
  .btn {{ flex: 1; padding: 9px 0; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.04em; transition: opacity 0.15s; }}
  .btn:hover {{ opacity: 0.85; }}
  .btn-approve {{ background: #00e5ff; color: #000; }}
  .btn-skip {{ background: #2a2a2a; color: #888; }}
  .btn-approved {{ background: #00e5ff22; color: #00e5ff; border: 1px solid #00e5ff44; }}
  .btn-skipped {{ background: #1e1e1e; color: #555; border: 1px solid #333; }}
  .summary-bar {{ position: fixed; bottom: 0; left: 0; right: 0; background: #111; border-top: 1px solid #2a2a2a; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; z-index: 100; }}
  .summary-bar span {{ color: #666; }}
  .summary-bar strong {{ color: #00e5ff; }}
  #approved-list {{ color: #aaa; font-size: 12px; max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
</style>
</head>
<body>
<header>
  <h1>Market Update — Draft Clips</h1>
  <p>5 topics &nbsp;·&nbsp; Raw cuts, no edits &nbsp;·&nbsp; Play each clip, then Approve or Skip</p>
</header>
<div class="grid" id="grid"></div>
<div class="summary-bar">
  <span>Approved: <strong id="count">0</strong></span>
  <div id="approved-list">—</div>
</div>
<script>
const topics = {cards_js};
const state = {{}};
topics.forEach(t => state[t.slug] = 'none');
function render() {{
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  topics.forEach((t, i) => {{
    const s = state[t.slug];
    const timeTags = t.times.map(ts => `<span class="tag tag-time">${{ts}}</span>`).join('');
    const multiTag = t.multi ? `<span class="tag tag-multi">multi-segment</span>` : '';
    const durTag = `<span class="tag tag-dur">${{t.duration}}</span>`;
    const approveBtn = s === 'approved'
      ? `<button class="btn btn-approved" onclick="toggle('${{t.slug}}','approved')">✓ Approved</button>`
      : `<button class="btn btn-approve" onclick="toggle('${{t.slug}}','approved')">Approve</button>`;
    const skipBtn = s === 'skipped'
      ? `<button class="btn btn-skipped" onclick="toggle('${{t.slug}}','skipped')">Skipped</button>`
      : `<button class="btn btn-skip" onclick="toggle('${{t.slug}}','skipped')">Skip</button>`;
    const card = document.createElement('div');
    card.className = 'card' + (s === 'approved' ? ' approved' : s === 'skipped' ? ' skipped' : '');
    card.innerHTML = `
      <div class="video-wrap">
        <video controls preload="metadata" src="market-update-clips/${{t.slug}}/preview.mp4"></video>
      </div>
      <div class="card-body">
        <div class="topic-num">Topic ${{i+1}} of ${{topics.length}}</div>
        <div class="card-title">${{t.title}}</div>
        <div class="meta">${{timeTags}}${{multiTag}}${{durTag}}</div>
        <div class="actions">${{approveBtn}}${{skipBtn}}</div>
      </div>`;
    grid.appendChild(card);
  }});
  updateSummary();
}}
function toggle(slug, action) {{ state[slug] = state[slug] === action ? 'none' : action; render(); }}
function updateSummary() {{
  const approved = topics.filter(t => state[t.slug] === 'approved');
  document.getElementById('count').textContent = approved.length;
  document.getElementById('approved-list').textContent = approved.length ? approved.map(t => t.title).join(' · ') : '—';
}}
render();
</script>
</body>
</html>"""

with open(DASHBOARD, "w", encoding="utf-8") as f:
    f.write(html)

print(f"\nDashboard: {DASHBOARD}")
