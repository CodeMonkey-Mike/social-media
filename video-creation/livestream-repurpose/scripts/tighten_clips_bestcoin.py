"""
Phase 5 - Tighten pass for 'best-coin-to-buy' (Mike: DELETE clips 1,2,5; tighten the other 4,
then remove silences as a separate step).
DELETE: kaspa-favorites-hardfork (1), kaspa-favorites-punch (2), lab-353x-punch (5).
TIGHTEN (re-lock boundaries to phrase anchors + auto filler tics + authored fumble/restatement cuts):
  - tao-decentralized-ai: open on "Bittensor for the last couple weeks" (drop the triple "bettensir"),
    cut the doubled "200/$200" and the duplicated "went on a nice pump".
  - lab-353x-bear-call: this span is full of screen-scrolling asides ("look at that... I got him back
    here"), so re-lock to 3 tight windows (hook+353x, the 7.7c->$27 line, the "20x target/private gem"
    payoff) and drop the navigation between them; small internal restart cuts inside the windows.
  - ai-supercycle-bigger-than-dotcom: already tight; drop the doubled "we're gonna go".
  - linea-chosen-by-swift: cut the doubled "it stands to reason", "top of the bull run", the
    "let's say... let's say" restart, "my my", and the "as we've seen well" run-off.
Cuts from the MASTER vertical with an 8ms declick. Writes <slug>/tightened.mp4 + tighten_log.json,
deletes the 3 clip folders, rebuilds the SAME dashboard.html in place (Review 2). Silence removal is
a SEPARATE step run after this (delete_silences.py per tightened clip).
"""
import json, subprocess, os, tempfile, shutil

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "best coin to buy LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "best coin to buy", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\best-coin-to-buy"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP  = 0.20   # ceiling on filler/fumble content removal WITHIN re-locked windows (boundary re-lock is uncapped)

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

DELETE_SLUGS = ["kaspa-favorites-hardfork", "kaspa-favorites-punch", "lab-353x-punch"]

CLIPS = [
    {"slug": "tao-decentralized-ai", "title": "They Switched Off an AI Model, So Buy Decentralized AI",
     "hook": "Bittensor pumped after the government got a frontier AI model switched off. Everybody realized the government can just step in and shut things down, so now we want to switch toward decentralized AI nobody can turn off.",
     "segs": [(322.8, 370.2)],
     "fillers": True,
     "cuts": [
        (331.5, 332.1, "doubled '200' before '$200'"),
        (335.8, 336.6, "doubled 'went on a nice pump'"),
     ]},
    {"slug": "lab-353x-bear-call", "title": "I Targeted 20x on LAB, It Did 353x in a Bear Market",
     "hook": "I thought we would do a 20x off the LAB token; we did a 353x in a bear market. Imagine getting in at 7.7 cents and watching it run to 27 dollars. I had it listed as a 20x for my community.",
     "segs": [(532.4, 540.1), (569.8, 579.5), (589.5, 603.8)],   # re-lock to 3 windows, drop screen-nav between
     "fillers": True,
     "cuts": [
        (570.6, 571.5, "false start 'and this'"),
        (574.6, 576.0, "restart 'imagine getting in and then'"),
        (601.2, 601.6, "doubled 'I wasn't'"),
     ]},
    {"slug": "ai-supercycle-bigger-than-dotcom", "title": "The Expansion Bigger Than Dot-Com Is Starting Now",
     "hook": "We are starting right now a major economic expansion unlike anything we have ever seen, bigger than the dot-com explosion. Fueled by AI, then robotics, then biotech; AI is going to drive advancements in diseases and cures.",
     "segs": [(662.3, 689.4)],
     "fillers": True,
     "cuts": [
        (677.3, 677.7, "doubled 'we're gonna go'"),
     ]},
    {"slug": "linea-chosen-by-swift", "title": "Linea Was Chosen by Swift",
     "hook": "It is a low market cap and it was chosen by Swift. Swift now has a partnership with a blockchain called Linea, so this is going to be a good play. At the top of the bull run, even if it underperforms, that is a 100x.",
     "segs": [(2071.4, 2132.5)],
     "fillers": True,
     "cuts": [
        (2092.0, 2094.3, "doubled 'yeah it stands to reason'"),
        (2099.0, 2100.5, "doubled 'top of the bull run'"),
        (2113.1, 2115.7, "restart 'let's say it's supposed to go to let's say'"),
        (2121.8, 2122.1, "doubled 'my'"),
        (2126.3, 2128.7, "run-off 'apparently as we've seen well'"),
     ]},
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

for slug in DELETE_SLUGS:
    p = os.path.join(OUT_BASE, slug)
    if os.path.isdir(p):
        shutil.rmtree(p); print(f"DELETED clip folder: {slug}")

print("== Tighten pass (best-coin-to-buy) ==")
log = []
for c in CLIPS:
    raw_dur = sum(e - s for s, e in c["segs"])
    fillers = []
    if c.get("fillers"):
        for s, e in c["segs"]:
            fillers += detect_fillers(s, e)
    authored = [(a, b, lbl) for (a, b, lbl) in c.get("cuts", [])]
    removes = fillers + authored
    removed_t = sum(b - a for a, b, *_ in removes)
    if removed_t > CAP * raw_dur:
        removes.sort(key=lambda r: r[1] - r[0])
        while removes and removed_t > CAP * raw_dur:
            r0 = removes.pop(0); removed_t -= (r0[1] - r0[0])
    rm_intervals = [(a, b) for a, b, *_ in removes]
    keeps = []
    for s, e in c["segs"]:
        keeps += complement(s, e, rm_intervals)
    out_dir = os.path.join(OUT_BASE, c["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "tightened.mp4")
    with tempfile.TemporaryDirectory() as work:
        ok = render(keeps, out_path, work)
    final = sum(b - a for a, b in keeps)
    c["final_dur"] = final; c["raw_dur"] = raw_dur; c["ok"] = ok
    c["removed"] = [{"start": round(r[0], 2), "end": round(r[1], 2), "label": r[2]} for r in removes]
    c["n_fillers"] = len(fillers)
    pct = (1 - final / raw_dur) * 100 if raw_dur else 0
    print(f"  {c['slug']:34s} {raw_dur:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(fillers)} fillers + {len(authored)} cuts) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "raw_s": round(raw_dur, 1), "final_s": round(final, 1),
                "removed_pct": round(pct, 1), "n_fillers": len(fillers), "removed": c["removed"]})

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
<title>Best Coin To Buy - Tightened + Silence-Removed (Review 2)</title>
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
<header><h1>Best Coin To Buy - Tightened + Silence-Removed (Review 2)</h1>
<p>__N__ clips (clips 1, 2, 5 deleted) &middot; re-locked to phrase anchors &middot; filler tics + restatement/doubling cuts &middot; internal silences removed (declicked)</p></header>
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
    prog["dashboard_status"] = "Review 2 (2026-06-17): clips 1,2,5 deleted; the other 4 tightened (re-lock + filler/fumble cuts). Silence removal applied next. Awaiting Mike before captions/render."
    prog["tighten_log"] = "shorts/best-coin-to-buy/tighten_log.json"
    prog["clips"] = [cl for cl in prog.get("clips", []) if cl.get("slug") not in DELETE_SLUGS]
    with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened")
print(f"Dashboard: {DASHBOARD}")
