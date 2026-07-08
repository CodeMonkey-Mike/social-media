"""
Phase 5 - Tighten pass for 'this-is-gonna-rip' (Mike: tighten 1/3/4, DELETE clip 2).
Multi-segment aware (clips 1 and 4 are multi-snippet).
- Clip 1 (kaspa-proved-improved): END re-lock ONLY (Mike: "tighten but only at the end").
  Trim the trailing run-off after "...Kaspa improved it. Perfect." (1387 -> 1381.0). No fillers/content cuts.
- Clip 3 (self-fulfilling-bear): full tighten. Re-lock start to the hook ("bitcoin whales appear to
  have stopped selling..."), end after "that's bullish news"; auto filler tics + authored restatement/
  doubling cuts (~12% content removal, under the 15% ceiling).
- Clip 4 (tao-decentralized-ai): full tighten. Re-lock both snippets (drop "i think tau is going to be
  and" false start + trailing "i was using it..." + the seg2 lead-in/run-off); cut "last this" stumble
  and the doubled "decentralized".
Cuts from the MASTER vertical with an 8ms declick. Writes <slug>/tightened.mp4 + tighten_log.json,
deletes clip 2 folder, rebuilds the SAME dashboard.html in place (Review 2). Silence removal is a
SEPARATE step after this (desilence.py per clip).
"""
import json, subprocess, os, tempfile, shutil

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "this is gonna rip LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "this is gonna rip", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\this-is-gonna-rip"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
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

# Clip 2 (kaspa-proved-improved-punch) is DELETED per Mike.
DELETE_SLUGS = ["kaspa-proved-improved-punch"]

CLIPS = [
    {"slug": "kaspa-proved-improved", "title": "Bitcoin Proved It, Kaspa Improved It",
     "hook": "Elon says money is just mass and energy. Bitcoin is the closest thing we have to energy-backed money, but it is not as efficient as Kaspa. Bitcoin proved it; Kaspa improved it.",
     "segs": [(1300.0, 1330.0), (1366.0, 1381.0)],  # END re-lock only: drop trailing "yeah i think it's a nice phrase isn't maybe..."
     "fillers": False, "cuts": []},
    {"slug": "self-fulfilling-bear", "title": "The Bear Was a Self-Fulfilling Prophecy",
     "hook": "Bitcoin whales stopped selling and started accumulating again. There was never a macro reason for this bear; the crowd that believed in it dumped and caused it themselves.",
     "segs": [(1019.74, 1129.1)],  # re-lock: start on the hook, end after "that's bullish news"
     "fillers": True,
     "cuts": [
        (1028.90, 1034.64, "stall 'uh i was pulling up those charts called check on chain and it just showed that'"),
        (1042.84, 1045.88, "restatement 'every single cycle every single year or whatever'"),
        (1047.98, 1048.76, "doubled 'every'"),
        (1057.56, 1057.82, "doubled 'they were'"),
        (1059.88, 1060.50, "false start 'they were causing' before 'they were causing the dumps'"),
        (1066.12, 1066.44, "doubled 'in this'"),
        (1122.76, 1123.82, "doubled 'right rightfully so'"),
        (1126.92, 1127.88, "doubled 'that's bullish'"),
     ]},
    {"slug": "tao-decentralized-ai", "title": "Why TAO Becomes a Powerhouse",
     "hook": "TAO is ripping. When a government can order a frontier AI model switched off for entire groups of people, a decentralized AI layer nobody can shut down is the obvious bet for this bull run.",
     "segs": [(824.90, 843.0), (993.82, 998.9)],  # re-lock both snippets (drop false-start lead-in + trailing run-off)
     "fillers": True,
     "cuts": [
        (826.04, 826.56, "stumble 'last this' before 'last weekend'"),
        (832.64, 833.12, "doubled 'decentralized'"),
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

# delete clip 2
for slug in DELETE_SLUGS:
    p = os.path.join(OUT_BASE, slug)
    if os.path.isdir(p):
        shutil.rmtree(p); print(f"DELETED clip folder: {slug}")

print("== Tighten pass (this-is-gonna-rip) ==")
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
    print(f"  {c['slug']:26s} {raw_dur:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(fillers)} fillers + {len(authored)} cuts) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "raw_s": round(raw_dur, 1), "final_s": round(final, 1),
                "removed_pct": round(pct, 1), "n_fillers": len(fillers), "removed": c["removed"]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['final_dur']//60)}m {int(c['final_dur']%60):02d}s",
    "trim": f"-{round((1-c['final_dur']/c['raw_dur'])*100)}% ({c['n_fillers']} fillers + {len(c.get('cuts',[]))} cuts)" if c.get('fillers') else "end re-lock only",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary only",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>This Is Gonna Rip - Tightened + Silence-Removed (Review 2)</title>
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
<header><h1>This Is Gonna Rip - Tightened + Silence-Removed (Review 2)</h1>
<p>__N__ clips (clip 2 deleted) &middot; clip 1 = end re-lock only &middot; clips 3/4 tightened (filler tics + restatement/doubling cuts) &middot; internal silences removed (declicked)</p></header>
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
    prog["dashboard_status"] = "Review 2 (2026-06-15): clip 2 deleted; clip 1 end-relocked; clips 3/4 tightened. Silence removal applied to all three. Awaiting Mike before captions/render."
    prog["tighten_log"] = "shorts/this-is-gonna-rip/tighten_log.json"
    prog["clips"] = [cl for cl in prog.get("clips", []) if cl.get("slug") not in DELETE_SLUGS]
    with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened")
print(f"Dashboard: {DASHBOARD}")
