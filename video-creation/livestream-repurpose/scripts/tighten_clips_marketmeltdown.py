"""
Phase 5 - Tighten pass for the 'market-meltdown' batch (Mike approved clips 2, 3, 4; deleted clip 1).
Step 1 = re-lock outer boundaries to phrase anchors (uncapped): drop lead-in banter and the
next-topic dangle (TAO clip ran into 'how's Casper'; Saylor clip ran into the Strive/dollar-reserve
tangent). Step 2 = auto filler tics (um/uh/ah/erm/hmm + you-know/i-mean + right?/right,). Step 3 =
authored least-relevant spans (restarts/restatements/false starts/doublings), kept under the 15%
ceiling. KEEP Mike's intentional rhetorical doublings ('he forced... he forced this cascade') - only
the FALSE START before it is cut. The excavator joke is kept intact (it is the peak beat). Cut from
the MASTER vertical with an 8ms declick. Writes <slug>/tightened.mp4 + tighten_log.json and rebuilds
the SAME dashboard.html in place (Review 2).
"""
import json, subprocess, os, tempfile

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "market-meltdown LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "market-meltdown", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\market-meltdown"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")  # overwrite in place; never a second dashboard
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP  = 0.15

FILLER_SINGLES = {"um", "umm", "uh", "uhh", "ah", "ahh", "erm", "hmm"}
FILLER_TIC     = {"right"}
FILLER_PAIRS   = [("you", "know"), ("i", "mean")]

def _w(s): return s.strip().lower().replace("'", "").replace("’", "").strip(".,!?\"")

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)
ALL = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        ALL.append({"raw": w["word"].strip(), "word": _w(w["word"]),
                    "start": w.get("start", seg["start"]), "end": w.get("end", seg["end"])})

CLIPS = [
    {"slug": "sold-my-excavator-for-kaspa", "title": "I Sold My Excavator to Buy Kaspa",
     "hook": "I sold my excavator to buy more Kaspa at 11 cents. Soon I will have enough to buy 100 of them.",
     "start": 1295.44, "end": 1311.65,  # re-lock: start on 'you know my story', drop trailing 'um'
     "cuts": [(1304.34, 1305.42, "doubled 'i was like i was like'")]},
    {"slug": "tao-10k-per-token", "title": "Why TAO Could Hit $10K a Token",
     "hook": "If TAO is good it could literally be 10k a token at an AI-driven cycle top. So who cares if you bought at 207 or 160.",
     "start": 1254.02, "end": 1281.45,  # re-lock: start on 'if tau is good', drop the next-topic dangle 'right how's casper'
     "cuts": [(1258.95, 1261.68, "restated '10k uh price you know' before '10k per token'")]},
    {"slug": "saylor-forced-the-cascade", "title": "Saylor Forced the Cascade, Then Bought the Dip",
     "hook": "Saylor sold a fraction of a percent to crack a 116 day channel, triggered the cascade everyone panicked over, then bought 110 million at the bottom. Brilliant.",
     "start": 672.44, "end": 753.30,  # re-lock: start on 'so we were in this 116 day bear flag', end after 'brilliant' (drop Strive tangent)
     "cuts": [(708.00, 711.96, "restated panic logic 'whenever we break out of a channel it goes way down'"),
              (728.02, 729.18, "doubled 'what does he do what does he do'"),
              (743.72, 744.34, "false start 'he forced' before 'he forced the prices down'"),
              (749.18, 749.78, "doubled 'bought in bought back in'")]},
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

print("== Tighten pass (market-meltdown) ==")
log = []
for c in CLIPS:
    s, e = c["start"], c["end"]; raw_dur = e - s
    fillers = detect_fillers(s, e)
    removes = fillers + [(a, b, lbl) for (a, b, lbl) in c.get("cuts", [])]
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
    c["removed"] = [{"start": round(r[0], 2), "end": round(r[1], 2), "label": r[2]} for r in removes]
    c["n_fillers"] = len(fillers)
    pct = (1 - final / raw_dur) * 100 if raw_dur else 0
    print(f"  {c['slug']:30s} {int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}  "
          f"{raw_dur:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(fillers)} fillers + {len(c.get('cuts',[]))} cuts) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "range": f"{int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}",
                "raw_s": round(raw_dur, 1), "final_s": round(final, 1), "removed_pct": round(pct, 1),
                "n_fillers": len(fillers), "removed": c["removed"]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['final_dur']//60)}m {int(c['final_dur']%60):02d}s",
    "trim": f"-{round((1-c['final_dur']/c['raw_dur'])*100)}% ({c['n_fillers']} fillers + {len(c.get('cuts',[]))} cuts)",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary only",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Market Meltdown - Tightened + Silence-Removed (Review 2)</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d0d0d;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px 24px 80px;}
  header{margin-bottom:40px;border-bottom:1px solid #2a2a2a;padding-bottom:20px;}
  header h1{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.04em;}
  header p{margin-top:6px;font-size:13px;color:#666;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:28px;}
  .card{background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;}
  .video-wrap{background:#000;aspect-ratio:9/16;max-height:560px;overflow:hidden;}
  .video-wrap video{width:100%;height:100%;object-fit:contain;display:block;}
  .card-body{padding:16px 18px 20px;}
  .topic-num{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#555;margin-bottom:4px;}
  .card-title{font-size:17px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}
  .card-hook{font-size:13px;color:#9a9a9a;margin-bottom:12px;line-height:1.4;font-style:italic;}
  .meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
  .tag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase;}
  .tag-dur{background:#1e2620;color:#5caf82;border:1px solid #2d4035;} .tag-trim{background:#26201e;color:#d49a5c;border:1px solid #40352d;}
  .cuts{font-size:11px;color:#666;margin-bottom:12px;}
</style></head><body>
<header><h1>Market Meltdown - Tightened + Silence-Removed (Review 2)</h1>
<p>__N__ clips (Mike approved 2/3/4) &middot; filler tics removed (um / uh / ah / you-know / i-mean / right?) &middot; boundaries re-locked (dropped next-topic dangle on TAO + Saylor) &middot; internal silences removed (declicked)</p></header>
<div class="grid" id="grid"></div>
<script>
const topics = __CARDS__;
const grid = document.getElementById('grid');
topics.forEach((t,i) => {
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `<div class="video-wrap"><video controls preload="metadata" src="${t.slug}/tightened.mp4"></video></div>
    <div class="card-body"><div class="topic-num">Clip ${i+1} of ${topics.length}</div>
    <div class="card-title">${t.title}</div><div class="card-hook">${t.hook}</div>
    <div class="meta"><span class="tag tag-dur">${t.dur}</span><span class="tag tag-trim">${t.trim}</span></div>
    <div class="cuts">removed: ${t.cuts}</div></div>`;
  grid.appendChild(card);
});
</script></body></html>"""
html = html.replace("__N__", str(len(CLIPS))).replace("__CARDS__", cards_js)
with open(DASHBOARD, "w", encoding="utf-8") as f: f.write(html)

if os.path.exists(PROGRESS):
    prog = json.load(open(PROGRESS, encoding="utf-8"))
    prog["dashboard_status"] = "Review 2: clip 1 deleted; clips 2/3/4 tightened + silence-removed. Awaiting Mike's review before captions/render."
    prog["tighten_log"] = "shorts/market-meltdown/tighten_log.json"
    with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened")
print(f"Dashboard: {DASHBOARD}")
