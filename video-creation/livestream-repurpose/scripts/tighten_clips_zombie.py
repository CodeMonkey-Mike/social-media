"""
Phase 5 — Tighten pass for the zombie-class batch.
Modeled on tighten_clips.py: re-lock outer boundaries to phrase anchors, auto-remove
filler tics (um/uh/you know/i mean/right?) with an 8ms declick, cut from the MASTER
vertical at absolute timestamps. Writes <slug>/tightened.mp4 + tighten_log.json and
rebuilds dashboard.html for the tightened review.
"""
import json, subprocess, os, tempfile

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "4-year cycle zombie class LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "4-year cycle zombie class", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\zombie-class"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP  = 0.15

FILLER_SINGLES = {"um", "umm", "uh", "uhh", "erm", "hmm"}
FILLER_TIC     = {"right"}
FILLER_PAIRS   = [("you", "know"), ("i", "mean")]

# Normalize a token: lowercase, drop apostrophes ANYWHERE (so "it's" == "its"), strip edge punct.
def _w(s): return s.strip().lower().replace("'", "").replace("’", "").strip(".,!?\"")
def _norm(p): return [_w(x) for x in p.split()]

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)
ALL = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        ALL.append({"raw": w["word"].strip(),
                    "word": _w(w["word"]),
                    "start": w.get("start", seg["start"]),
                    "end":   w.get("end",   seg["end"])})
def find_start(phrase, after=0.0):
    ws = _norm(phrase); n = len(ws)
    for i, w in enumerate(ALL):
        if w["start"] < after: continue
        if [x["word"] for x in ALL[i:i+n]] == ws: return ALL[i]["start"]
    return None
def find_end(phrase, after=0.0):
    ws = _norm(phrase); n = len(ws)
    for i, w in enumerate(ALL):
        if w["start"] < after: continue
        if [x["word"] for x in ALL[i:i+n]] == ws: return ALL[i+n-1]["end"]
    return None

CLIPS = [
    {"slug": "birds-sun-analogy", "title": "The Birds Don't Make the Sun Rise",
     "hook": "Hearing birds chirp before dawn doesn't mean they cause the sunrise. The cycle is correlation mistaken for magic.",
     "start_ph": "you wake up in the morning and its still dark", "end_ph": "cause the sun to rise",
     "after": 110, "removes": [], "fb": (124.3, 150.5)},
    {"slug": "crypto-winter-official", "title": "It's Officially a Crypto Winter",
     "hook": "BTC wicked the 200-week moving average (59k vs 58k). By the textbook definition, winter is here.",
     "start_ph": "we are officially in a crypto winter", "end_ph": "hit on a wick",
     "after": 150, "removes": [], "fb": (160.3, 206.5)},
    {"slug": "saylor-breakdown", "title": "Saylor Sold — And the Chickens Ran",
     "hook": "Saylor announces a tiny sale, the non-chart crowd panics, and they break Bitcoin below the channel themselves.",
     "start_ph": "michael sailor comes out and says", "end_ph": "down below the channel",
     "after": 340, "removes": [], "fb": (348.6, 400.0)},
    {"slug": "not-rocket-science", "title": "This Is Not Rocket Science",
     "hook": "“Everybody's telling me the four-year cycle is intact. No it's not, man.”",
     "start_ph": "this is not rocket science folks", "end_ph": "no its not man",
     "after": 490, "removes": [], "fb": (497.3, 515.0)},
    {"slug": "economy-since-1948", "title": "The Business Cycle: First Time Since 1948",
     "hook": "ISM PMI sat below 50 for four years — never happened since 1948 — then flipped expansionary in January.",
     "start_ph": "the economy itself the business cycle has been in its bear market", "end_ph": "contractionary to expansionary",
     "after": 1090, "removes": [], "fb": (1098.5, 1127.0)},
    {"slug": "bull-run-next-month", "title": "The Bull Run Could Start Next Month",
     "hook": "If the war ends and the Strait of Hormuz reopens, the economy is already flying. “We could literally go into a bull run next month.”",
     "start_ph": "if the war ends tomorrow", "end_ph": "like next month",
     "after": 2085, "removes": [], "fb": (2096.8, 2161.0)},
    {"slug": "best-month-353x", "title": "Best Month Ever: 10x, 47x, 100x Every Week",
     "hook": "September was the best month the community ever had — a stream of 10x to 100x plays, then a 353x on LAB.",
     "start_ph": "we had the best month ever", "end_ph": "so that was september",
     "after": 755, "removes": [], "fb": (766.5, 818.0)},
    {"slug": "selling-into-the-crash", "title": "Zombies Were Selling INTO the Crash",
     "hook": "For the first time ever, the hordes were selling while price dropped with no pump — the exact opposite of every prior cycle.",
     "start_ph": "usually you sell at the pumps", "end_ph": "opposite of how its always been",
     "after": 1660, "removes": [], "fb": (1654.0, 1685.5)},
]

def detect_fillers(s, e):
    idx = [i for i, w in enumerate(ALL) if w["start"] >= s and w["end"] <= e]
    spans = []; i = 0
    while i < len(idx):
        wi = idx[i]; w = ALL[wi]; paired = False
        if i + 1 < len(idx) and idx[i+1] == wi + 1:
            w2 = ALL[wi+1]
            if (w["word"], w2["word"]) in FILLER_PAIRS:
                spans.append((w["start"], w2["end"], w["word"] + " " + w2["word"])); i += 2; paired = True
        if paired: continue
        if w["word"] in FILLER_SINGLES:
            spans.append((w["start"], w["end"], w["word"]))
        elif w["word"] in FILLER_TIC and (w["raw"].endswith("?") or w["raw"].endswith(",")):
            spans.append((w["start"], w["end"], w["raw"]))
        i += 1
    return spans

def complement(s, e, removes):
    rs = sorted([(max(s, a), min(e, b)) for a, b in removes if b > s and a < e])
    keeps = []; cur = s
    for a, b in rs:
        if a > cur: keeps.append((cur, a))
        cur = max(cur, b)
    if cur < e: keeps.append((cur, e))
    return [(a, b) for a, b in keeps if b - a > 0.05]

def render(keeps, out_path, work):
    parts = []
    for i, (a, b) in enumerate(keeps):
        d = b - a; fo = max(0.0, d - FADE)
        af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
        t = os.path.join(work, f"k{i}.mp4")
        r = subprocess.run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-i", SRC, "-t", f"{d:.3f}",
                            "-af", af, "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                            "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", t],
                           capture_output=True, text=True)
        if r.returncode == 0: parts.append(t)
        else: print("   seg err:", r.stderr[-200:])
    lst = os.path.join(work, "c.txt")
    with open(lst, "w") as f:
        for t in parts: f.write(f"file '{t.replace(os.sep,'/')}'\n")
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out_path],
                       capture_output=True, text=True)
    return r.returncode == 0

print("== Tighten pass (zombie-class) ==")
log = []
for c in CLIPS:
    s = find_start(c["start_ph"], c["after"]); e = find_end(c["end_ph"], s if s else c["after"])
    if s is None or e is None or e <= s:
        s, e = c["fb"]; print(f"  {c['slug']:26s} anchors unresolved -> fallback {s}-{e}")
    raw_dur = e - s
    fillers = detect_fillers(s, e)
    mids = [(find_start(a, s), find_end(b, find_start(a, s) or s)) for a, b in c["removes"]]
    mids = [(a, b) for a, b in mids if a is not None and b is not None]
    removes = fillers + [(a, b, "aside") for a, b in mids]
    removed_t = sum(b - a for a, b, *_ in removes)
    if removed_t > CAP * raw_dur:
        removes.sort(key=lambda r: r[1] - r[0])
        while removes and removed_t > CAP * raw_dur:
            r0 = removes.pop(0); removed_t -= (r0[1] - r0[0])
    keeps = complement(s, e, [(a, b) for a, b, *_ in removes])
    out_dir = os.path.join(OUT_BASE, c["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "tightened.mp4")
    with tempfile.TemporaryDirectory() as work:
        ok = render(keeps, out_path, work)
    final = sum(b - a for a, b in keeps)
    c["final_dur"] = final; c["raw_dur"] = raw_dur; c["ok"] = ok
    c["removed"] = [{"start": round(a, 2), "end": round(b, 2), "label": (r[2] if len(r) > 2 else "?")} for r in removes for a, b in [(r[0], r[1])]]
    pct = (1 - final / raw_dur) * 100 if raw_dur else 0
    print(f"  {c['slug']:26s} {int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}  "
          f"{raw_dur:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(removes)} cuts) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "range": f"{int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}",
                "raw_s": round(raw_dur, 1), "final_s": round(final, 1), "removed_pct": round(pct, 1),
                "removed": c["removed"]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['final_dur']//60)}m {int(c['final_dur']%60):02d}s",
    "trim": f"-{round((1-c['final_dur']/c['raw_dur'])*100)}% ({len(c['removed'])} cuts)",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary only",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zombie Class — Tightened Clips (Review 2)</title>
<style>
  *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
  body{{background:#0d0d0d;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px 24px 80px;}}
  header{{margin-bottom:40px;border-bottom:1px solid #2a2a2a;padding-bottom:20px;}}
  header h1{{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.04em;}}
  header p{{margin-top:6px;font-size:13px;color:#666;}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:28px;}}
  .card{{background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;}}
  .video-wrap{{background:#000;aspect-ratio:9/16;max-height:560px;overflow:hidden;}}
  .video-wrap video{{width:100%;height:100%;object-fit:contain;display:block;}}
  .card-body{{padding:16px 18px 20px;}}
  .topic-num{{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#555;margin-bottom:4px;}}
  .card-title{{font-size:17px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}}
  .card-hook{{font-size:13px;color:#9a9a9a;margin-bottom:12px;line-height:1.4;font-style:italic;}}
  .meta{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}}
  .tag{{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase;}}
  .tag-dur{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}} .tag-trim{{background:#26201e;color:#d49a5c;border:1px solid #40352d;}}
  .cuts{{font-size:11px;color:#666;margin-bottom:12px;}}
</style></head><body>
<header><h1>4-Year Cycle Zombie Class — Tightened Clips (Review 2)</h1>
<p>{{N}} clips · boundaries re-locked + filler tics removed · SILENCE REMOVAL applied next · watch each</p></header>
<div class="grid" id="grid"></div>
<script>
const topics = {cards_js};
const grid = document.getElementById('grid');
topics.forEach((t,i) => {{
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `<div class="video-wrap"><video controls preload="metadata" src="${{t.slug}}/tightened.mp4"></video></div>
    <div class="card-body"><div class="topic-num">Clip ${{i+1}} of ${{topics.length}}</div>
    <div class="card-title">${{t.title}}</div><div class="card-hook">${{t.hook}}</div>
    <div class="meta"><span class="tag tag-dur">${{t.dur}}</span><span class="tag tag-trim">${{t.trim}}</span></div>
    <div class="cuts">removed: ${{t.cuts}}</div></div>`;
  grid.appendChild(card);
}});
</script></body></html>"""
html = html.replace("{N}", str(len(CLIPS)))
with open(DASHBOARD, "w", encoding="utf-8") as f: f.write(html)

prog = json.load(open(PROGRESS, encoding="utf-8")) if os.path.exists(PROGRESS) else {}
prog["stage"] = "tightened-awaiting-silence-removal"
prog["tighten_log"] = "shorts/zombie-class/tighten_log.json"
with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened")
