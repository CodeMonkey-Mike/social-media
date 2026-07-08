"""
Phase 5 (tighten) + Phase 5B (desilence) for the 'better-coins' batch.
Mike: focus on fillers (um/uh/ah + you know / i mean / right?) and don't talk too much,
but he likes the clips so do not over-cut. Then run the desilencer on each tightened clip.

For each clip: auto-detect filler disfluencies within its source span(s) + apply a few
authored tangent/false-start cuts, re-cut from the MASTER vertical with an 8 ms declick
(tightened.mp4), then desilence that (min-sil 0.25) -> final.mp4. Rebuilds dashboard.html
(pointing at final.mp4) and updates progress.json + tighten_log.json.
"""
import json, subprocess, os, tempfile

BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME = "code monkeys call better coins LOW BPS VERTICAL"
SRC = os.path.join(BASE, "media", "code monkeys call better coins", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
DESIL = os.path.join(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\skills\desilencer\scripts\desilence.py")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\better-coins"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP = 0.16  # ceiling on AUTO filler removal as a fraction of raw dur (authored cuts are always kept)

FILLER_SINGLES = {"um", "umm", "uh", "uhh", "uhm", "erm", "er", "hmm", "ah", "ahh", "ahem"}
FILLER_TIC = {"right"}
FILLER_PAIRS = [("you", "know"), ("i", "mean")]

def _w(s): return s.strip().lower().replace("'", "").replace("’", "").strip('.,!?"')
with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)
ALL = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        ALL.append({"raw": w["word"].strip(), "word": _w(w["word"]),
                    "start": w.get("start", seg["start"]), "end": w.get("end", seg["end"])})

# slug, title, topic, hook, snips[(s,e)], authored removes[(a,b)]
CLIPS = [
  {"slug": "didnt-you-learn-your-lesson", "topic": "4-year cycle is dead",
   "title": "The Same Guys Who Missed The Top Are Now Calling The Bottom",
   "hook": "The influencers who promised a November blow off top now preach an October bottom. Didn't you learn your lesson?",
   "snips": [(994.9, 1025.5)], "removes": []},
  {"slug": "four-year-cycle-breakage-stack", "topic": "4-year cycle is dead",
   "title": "Every Rule Of The 4-Year Cycle Just Broke, One By One",
   "hook": "New ATH before the halving, a bear market in the post halving year, no cycle top: breakage after breakage.",
   "snips": [(2061.9, 2110.4)],
   "removes": [(2061.9, 2063.67), (2094.4, 2098.6)]},  # weak opener; "I dont, I just like, I dont know, man"
  {"slug": "tao-decentralizing-intelligence", "topic": "TAO / decentralized AI",
   "title": "When Governments Ban AI Models, You Want Decentralized Intelligence",
   "hook": "The government pulled Fable offline and locked GPT 5.6 down. Decentralized intelligence is the answer.",
   "snips": [(2252.2, 2347.4)],
   "removes": [(2327.0, 2329.95)]},  # "I think that its going to be like a wild..." trailing false start
  {"slug": "buying-bitcoin-at-200", "topic": "TAO / decentralized AI",
   "title": "Buying TAO Now Is Like Buying Bitcoin At $200",
   "hook": "If TAO ever reaches Bitcoin's old all time high price, buying it now is like buying Bitcoin at 200 dollars.",
   "snips": [(2348.5, 2383.4)],
   "removes": [(2380.0, 2381.4)]},  # "But it's very interesting." filler
  {"slug": "kaspa-whales-accumulating", "topic": "Kaspa whales accumulating",
   "title": "Retail Is Selling Kaspa. 20-30 Whales Are Quietly Eating It All",
   "hook": "Retail exits while a handful of whales keep growing their bags. They are preparing for something.",
   "snips": [(2384.1, 2406.0), (2433.5, 2458.5)], "removes": []},
  {"slug": "building-the-best-takes-time", "topic": "Kaspa whales accumulating",
   "title": "Kaspa is a sh** coin",
   "hook": "They call Kaspa a shit coin. That patient holder is going to be the one smiling. Building the best takes time.",
   "snips": [(2438.7, 2458.5)], "removes": []},
  {"slug": "stop-waiting-buy-kaspa", "topic": "Stop waiting for the bottom",
   "title": "Stop Waiting For A Bottom You'll Never See",
   "hook": "The people sitting on cash waiting for the exact bottom just watch the price climb and miss it.",
   "snips": [(1470.8, 1547.7)],
   "removes": [(1501.0, 1501.95), (1505.15, 1505.62)]},  # "like, I dont know," / "I dont know."
  {"slug": "the-1992-magnificent-crash", "topic": "1992 vs 2000 thesis",
   "title": "We're At 1992, Not 2000. The Real Crash Is Years Away",
   "hook": "The AI driven expansion is like 1992. It tops like 2000, then a magnificent crash. The expansion has not even started.",
   "snips": [(452.8, 553.4)],
   "removes": [(465.4, 485.0)]},  # screen-dependent chart-hover digression
]

def detect_fillers(s, e):
    idx = [i for i, w in enumerate(ALL) if w["start"] >= s and w["end"] <= e]
    spans = []; i = 0
    while i < len(idx):
        wi = idx[i]; w = ALL[wi]; paired = False
        if i + 1 < len(idx) and idx[i + 1] == wi + 1:
            w2 = ALL[wi + 1]
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
        for t in parts: f.write(f"file '{t.replace(os.sep, '/')}'\n")
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out_path],
                       capture_output=True, text=True)
    return r.returncode == 0

def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())

print("== Tighten + desilence pass (better-coins) ==")
log = []
for c in CLIPS:
    raw_dur = sum(e - s for s, e in c["snips"])
    authored = list(c["removes"])
    fillers = []
    for s, e in c["snips"]:
        fillers += detect_fillers(s, e)
    auto_t = sum(b - a for a, b, *_ in fillers)
    # cap only the auto fillers (authored cuts always kept)
    if auto_t > CAP * raw_dur:
        fillers.sort(key=lambda r: r[1] - r[0])
        while fillers and auto_t > CAP * raw_dur:
            r0 = fillers.pop(0); auto_t -= (r0[1] - r0[0])
    removes = [(a, b, "filler") for a, b, *_ in fillers] + [(a, b, "trim") for a, b in authored]
    # keeps per-snippet, concatenated in order
    keeps = []
    for s, e in c["snips"]:
        keeps += complement(s, e, [(a, b) for a, b, *_ in removes])
    out_dir = os.path.join(OUT_BASE, c["slug"]); os.makedirs(out_dir, exist_ok=True)
    tightened = os.path.join(out_dir, "tightened.mp4")
    final = os.path.join(out_dir, "final.mp4")
    with tempfile.TemporaryDirectory() as work:
        ok = render(keeps, tightened, work)
    tdur = dur(tightened) if ok else raw_dur
    # Phase 5B: desilence the tightened clip
    dok = False
    if ok:
        r = subprocess.run(["python", DESIL, tightened, "--out", final, "--min-sil", "0.25"],
                           capture_output=True, text=True)
        dok = r.returncode == 0 and os.path.exists(final)
        if not dok: print("   desil err:", (r.stderr or r.stdout)[-300:])
    fdur = dur(final) if dok else tdur
    tpct = (1 - tdur / raw_dur) * 100 if raw_dur else 0
    dpct = (1 - fdur / raw_dur) * 100 if raw_dur else 0
    c.update(raw=raw_dur, tdur=tdur, fdur=fdur, tpct=tpct, dpct=dpct, ncuts=len(removes),
             labels=sorted({r[2] for r in removes}), ok=ok and dok)
    print(f"  {c['slug']:32s} {raw_dur:5.1f}s -> tight {tdur:5.1f}s (-{tpct:3.0f}%) -> desil {fdur:5.1f}s (-{dpct:3.0f}%)  {len(removes)} cuts {'OK' if c['ok'] else 'FAIL'}")
    log.append({"slug": c["slug"], "title": c["title"], "raw_s": round(raw_dur, 1),
                "tightened_s": round(tdur, 1), "final_s": round(fdur, 1),
                "tighten_pct": round(tpct, 1), "total_pct": round(dpct, 1),
                "removed": [{"start": round(a, 2), "end": round(b, 2), "label": l} for a, b, l in removes]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "topic": c["topic"], "hook": c["hook"],
    "dur": f"{int(c['fdur'] // 60)}:{int(c['fdur'] % 60):02d}",
    "trim": f"-{round(c['dpct'])}% ({c['ncuts']} cuts)",
    "cuts": ", ".join(c["labels"]) or "boundary only",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)
html = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>better-coins - Tightened + Desilenced (Review 2)</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0c0f14;color:#e7edf3;font-family:'Segoe UI',system-ui,sans-serif;padding:28px 22px 80px;}
header{margin-bottom:30px;border-bottom:1px solid #233040;padding-bottom:16px;}
header h1{font-size:20px;color:#fff;letter-spacing:.03em;}
header p{margin-top:6px;font-size:13px;color:#7d93a6;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:24px;}
.card{background:#141a22;border:1px solid #233040;border-radius:12px;overflow:hidden;}
.video-wrap{background:#000;aspect-ratio:9/16;max-height:560px;}
.video-wrap video{width:100%;height:100%;object-fit:contain;display:block;}
.card-body{padding:14px 16px 18px;}
.num{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3fd0c9;margin-bottom:4px;}
.title{font-size:16px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}
.hook{font-size:12.5px;color:#9bb0c2;margin-bottom:12px;line-height:1.45;font-style:italic;}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.tag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.05em;text-transform:uppercase;}
.tag-dur{background:#13241c;color:#5caf82;border:1px solid #214034;} .tag-trim{background:#241f17;color:#d49a5c;border:1px solid #40352a;}
.cuts{font-size:11px;color:#6c8398;}
</style></head><body>
<header><h1>better-coins - Tightened + Desilenced (Review 2)</h1>
<p>__N__ clips - fillers removed (um/uh/ah, you know, i mean, right?) + a few tangents, then desilenced - watch each</p></header>
<div class="grid" id="grid"></div>
<script>
const topics = __CARDS__;
const grid = document.getElementById('grid');
topics.forEach((t,i) => {
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `<div class="video-wrap"><video controls preload="metadata" src="${t.slug}/final.mp4"></video></div>
    <div class="card-body"><div class="num">Clip ${i+1} of ${topics.length} - ${t.topic}</div>
    <div class="title">${t.title}</div><div class="hook">${t.hook}</div>
    <div class="meta"><span class="tag tag-dur">${t.dur}</span><span class="tag tag-trim">${t.trim}</span></div>
    <div class="cuts">removed: ${t.cuts}</div></div>`;
  grid.appendChild(card);
});
</script></body></html>"""
html = html.replace("__CARDS__", cards_js).replace("__N__", str(len(CLIPS)))
with open(DASHBOARD, "w", encoding="utf-8") as f: f.write(html)

prog = json.load(open(PROGRESS, encoding="utf-8")) if os.path.exists(PROGRESS) else {}
prog["phase"] = "5B-tightened-desilenced"
prog["status"] = "awaiting_review_2"
prog["tighten_log"] = "video-creation/shorts/better-coins/tighten_log.json"
by_slug = {c["slug"]: c for c in CLIPS}
for clip in prog.get("clips", []):
    c = by_slug.get(clip["slug"])
    if c:
        clip["title"] = c["title"]
        clip["final_mp4"] = f"video-creation/shorts/better-coins/{c['slug']}/final.mp4"
        clip["final_duration"] = round(c["fdur"], 1)
with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c['ok'])}/{len(CLIPS)} tightened + desilenced -> {DASHBOARD}")
