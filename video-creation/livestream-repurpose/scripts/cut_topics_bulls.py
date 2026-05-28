"""
Cut preview clips for the 5 candidate topics from the "bulls are sleeping" vertical livestream.
Source is PRE-CROPPED vertical (content zone top + face bottom) — no crop, just trim.
Word-level phrase boundaries for precision. RE-ENCODE every segment (A/V sync rule:
never -c copy across splice points); concat re-encoded segments for multi-segment clips.
Generates a review dashboard.
"""
import json, subprocess, os

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
SRC      = os.path.join(BASE, "media", "bulls are sleeping LOW BPS VERTICAL.mp4")
JSON_SRC = os.path.join(BASE, "transcripts", "bulls are sleeping LOW BPS VERTICAL.json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips"
DASHBOARD = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-dashboard.html"

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
    """seg = (start_phrase, end_phrase, after). Returns (start, end) or (None, None)."""
    sp, ep, after = seg
    s = find_start(sp, after)
    e = find_end(ep, after=(s if s is not None else after))
    return s, e

# ── Topic definitions: each segment = (start_phrase, end_phrase, after_seconds) ──
# Phrases use the ACTUAL Whisper words (mishears included).

TOPICS = [
    {
        "slug": "bulls-are-sleeping",
        "title": "The Bulls Are Sleeping (109-Day Bear Flag)",
        "multi": True,
        "segments": [
            # hook — the thumbnail line (~15:13)
            ("i put my thumbnail", "the bears are coming back and knocked over", 600),
            # setup — 109-day bear flag (~01:38)
            ("we're in this gigantic bear flag", "unbelievably boring you know", 60),
            # payoff — 2017 290 days, not even halfway (~49:34)
            ("hopefully doesn't work out like what i showed you", "we're not even halfway through at this point", 2900),
        ],
    },
    {
        "slug": "price-vs-technology",
        "title": "Price Is Today, Technology Is Tomorrow",
        "multi": True,
        "segments": [
            # the quote + the gap-is-the-opportunity (contiguous ~40:52–42:55)
            ("but the price is what it is what the market thinks today", "that is taking advantage of the gap i would say", 2400),
            # closer — undervalued until a dollar (~52:08)
            ("caspa is undervalued until a dollar", "it all depends on the time frame", 3050),
        ],
    },
    {
        "slug": "sold-excavator",
        "title": "I Sold My Excavator to Buy Kaspa",
        "multi": False,
        "segments": [
            # contiguous: "I was wrong" admission + excavator (~47:20–48:30)
            ("i thought that you know going back to 2024", "if i waited and just did that right now crazy", 2750),
        ],
    },
    {
        "slug": "heard-of-kaspa-brah",
        "title": "Bitcoin Isn't the Best Tech — Heard of Kaspa, Brah?",
        "multi": True,
        "segments": [
            # the line over Fox Business (~16:25)
            ("well randy you go around", "somebody's gonna tell these people", 950),
            # the stable-coin joke button (~18:08)
            ("they're going to see kaspa", "remember that kaspa is a stable coin", 1080),
        ],
    },
    {
        "slug": "eth-flips-btc",
        "title": "ETH Flips Bitcoin, Then Kaspa Flips ETH",
        "multi": True,
        "segments": [
            # the 10-year thesis (~61:38)
            ("i think eth is eventually going to flip bitcoin", "but then eventually push casper to number one", 3650),
            # the market-cap math: $3 or $30 (~52:32)
            ("i think we're going to have a massive economic expansion", "a trillion market cap which is thirty dollars", 3100),
        ],
    },
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
        print(f"  [{tag}] {t['slug']:22s} {st}–{en} ({dur})  <- '{seg[0][:40]}'")
    t["resolved"] = resolved

# ── Cut (RE-ENCODE; never -c copy across splices) ──────────────────────────────
def cut_segment(start, end, out_path):
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", SRC, "-t", str(end - start),
           "-c:v", "libx264", "-preset", "fast", "-crf", "20",
           "-c:a", "aac", "-b:a", "128k", "-avoid_negative_ts", "make_zero", out_path]
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
        print(f"  SKIP {t['slug']} — no resolved segments"); t["duration"] = 0; continue
    t["duration"] = sum(e - s for s, e in segs)
    print(f"  {t['slug']} ({int(t['duration']//60)}m{int(t['duration']%60):02d}s) ...", end=" ", flush=True)
    ok = cut_segment(segs[0][0], segs[0][1], out_path) if len(segs) == 1 else cut_multi(segs, out_path, out_dir)
    print("OK" if ok else "FAILED")

# ── Dashboard ──────────────────────────────────────────────────────────────────
def fmt_times(resolved):
    out = []
    for s, e in resolved:
        if s is None: continue
        out.append(f"{int(s//60)}:{int(s%60):02d}–{int(e//60)}:{int(e%60):02d}")
    return out

card_data = [{
    "slug": t["slug"], "title": t["title"], "times": fmt_times(t["resolved"]),
    "multi": t["multi"], "duration": f"{int(t['duration']//60)}m {int(t['duration']%60):02d}s",
} for t in TOPICS]

cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bulls Are Sleeping — Draft Clips</title>
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
  #approved-list{{color:#aaa;font-size:12px;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}
</style></head><body>
<header>
  <h1>Bulls Are Sleeping — Draft Clips</h1>
  <p>5 candidate topics &nbsp;·&nbsp; Raw cuts (no captions/b-roll yet) &nbsp;·&nbsp; Watch each, then Approve or Skip</p>
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
      <div class="video-wrap"><video controls preload="metadata" src="bulls-are-sleeping-clips/${{t.slug}}/preview.mp4"></video></div>
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

print(f"\nDashboard: {DASHBOARD}")
