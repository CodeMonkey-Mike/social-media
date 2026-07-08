"""
Phase 5 tighten + Phase 5B desilence(250ms) for the 'kaspa-changes-everything' batch (4 clips).
Per clip: re-lock outer boundaries to phrase anchors -> auto-remove filler tics -> remove authored
fumble/restatement/aside spans (declicked, capped 15%) -> write tightened.mp4. THEN run the canonical
desilencer at 250ms on each tightened.mp4 (in place). Rebuilds dashboard.html in place (Review 2),
writes tighten_log.json, updates progress.json. Cuts from the MASTER vertical at absolute timestamps.
"""
import json, subprocess, os, tempfile

HERE     = os.path.dirname(os.path.abspath(__file__))
BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "kaspa changes everything LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "kaspa changes everything", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\kaspa-changes-everything"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
# Call the canonical desilencer directly (the delete_silences.py wrapper has a stale path:
# it points at ../../desilencer/ but the skill moved to ../../skills/desilencer/).
DESILENCE = os.path.normpath(os.path.join(HERE, "..", "..", "skills", "desilencer", "scripts", "desilence.py"))
FADE = 0.008
CAP  = 0.15   # ceiling on filler/fumble content removal within re-locked windows (boundary re-lock uncapped)

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
    {"slug": "covenants-explained",
     "title": "Kaspa Will Be The First Chain That Can Put Rules On Your Coins",
     "hook": "Kaspa is about to be the only chain that can assign rules to how an address spends: send-only addresses, time locks, two of three signatures, auto-routing. Rules built into the coin itself.",
     "segs": [(394.84, 471.3)],
     "fillers": True,
     "cuts": [
        (415.22, 418.78, "restart 'something like something that you have'"),
        (426.68, 428.14, "doubled 'it's just'"),
        (439.16, 440.38, "filler 'uh just again'"),
        (440.72, 441.20, "restart 'require,'"),
        (446.66, 449.94, "filler stack 'like um you know like uh'"),
     ]},
    {"slug": "kaspa-first-covenants",
     "title": "No Other Chain Does This, Not Even Centralized Ones",
     "hook": "Kaspa is the first decentralized chain, the first blockchain at all, to do this. Not even a centralized proof of stake chain does it. Kaspa is going to be first.",
     "segs": [(540.52, 556.6)],
     "fillers": True,
     "cuts": [
        (546.42, 546.72, "restart 'this is'"),
     ]},
    {"slug": "elizaos-500x",
     "title": "ElizaOS Could 500x Just Matching Its Old High",
     "hook": "As long as the company stays around, in an AI driven cycle top ElizaOS just matching its old AI16Z all time high is about a 500x.",
     "segs": [(273.2, 298.3)],
     "fillers": True,
     "cuts": [
        (284.14, 287.40, "hedge 'price, you know, who knows? I mean'"),
        (288.96, 289.48, "restart 'if it just,'"),
        (290.66, 291.00, "doubled 'it's'"),
        (296.12, 296.80, "hedge 'or something like that'"),
     ]},
    {"slug": "krc20-compilation",
     "title": "KRC20 Memes: Tiny Caps, 100x Potential",
     "hook": "The KRC20 memes are tiny market cap 100x plays. I love Kroak. Pro ghosts at 20 million, Nacho at 3 million, Slippy at 14K, Pac-Man with great graphics. Imagine these at tens of millions.",
     "segs": [(2276.88, 2286.4), (2332.20, 2376.0), (3961.52, 3997.0)],
     "fillers": True,
     "cuts": [
        (2276.88, 2277.50, "soft opener 'yeah man'"),
        (2279.40, 2281.44, "doubled 'KC20 man / KC20s'"),
        (2335.86, 2340.22, "aside 'sometimes throw in 500 or a thousand'"),
        (2346.94, 2347.64, "filler 'like' before 'if pro ghosts'"),
        (2368.46, 2370.68, "restart 'imagine it goes, yeah'"),
        (3961.52, 3963.58, "soft opener 'some of these are so, like I said'"),
        (3973.84, 3979.62, "restatement of '1.4 million market cap' x3"),
        (3991.34, 3994.62, "doubled 'they've been in the game' (Pacman)"),
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

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

print("== Tighten + desilence(250ms) pass (kaspa-changes-everything) ==")
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
    tdur = dur(out_path) if ok else 0
    # Phase 5B: desilence the tightened clip at 250ms (canonical desilence.py, then move in place)
    ds = None
    if ok:
        tmp = out_path + ".desil.mp4"
        ds = subprocess.run(["python", DESILENCE, out_path, "--out", tmp, "--min-sil", "0.25"],
                            capture_output=True, text=True)
        if ds.returncode == 0 and os.path.exists(tmp):
            os.replace(tmp, out_path)
        elif os.path.exists(tmp):
            os.remove(tmp)
    fdur = dur(out_path) if ok else 0
    c["raw_dur"], c["tdur"], c["fdur"], c["ok"] = raw_dur, tdur, fdur, ok
    c["n_fillers"] = len(fillers)
    c["removed"] = [{"start": round(r[0],2), "end": round(r[1],2), "label": r[2]} for r in removes]
    tpct = (1 - tdur/raw_dur)*100 if raw_dur else 0
    fpct = (1 - fdur/raw_dur)*100 if raw_dur else 0
    print(f"  {c['slug']:24s} {raw_dur:5.1f}s -> tighten {tdur:5.1f}s (-{tpct:.0f}%) -> desil {fdur:5.1f}s (-{fpct:.0f}% total) {'OK' if ok else 'FAIL'}")
    if ds is not None and ds.returncode != 0: print("     desilence warn:", (ds.stderr or ds.stdout)[-300:])
    log.append({"slug": c["slug"], "raw_s": round(raw_dur,1), "tightened_s": round(tdur,1),
                "final_s": round(fdur,1), "tighten_pct": round(tpct,1), "total_pct": round(fpct,1),
                "n_fillers": len(fillers), "removed": c["removed"]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['fdur']//60)}m {int(c['fdur']%60):02d}s" if c['fdur']>=60 else f"{c['fdur']:.1f}s",
    "trim": f"raw {c['raw_dur']:.0f}s -> tighten -{round((1-c['tdur']/c['raw_dur'])*100)}% -> +silence = -{round((1-c['fdur']/c['raw_dur'])*100)}% total",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary only",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>kaspa-changes-everything - Tightened + Silence-Removed (Review 2)</title>
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
  .tag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.04em;}
  .tag-dur{background:#1e2620;color:#5caf82;border:1px solid #2d4035;} .tag-trim{background:#26201e;color:#d49a5c;border:1px solid #40352d;}
  .cuts{font-size:11px;color:#666;margin-bottom:4px;line-height:1.4;}
</style></head><body>
<header><h1>kaspa-changes-everything - Tightened + Silence-Removed (Review 2)</h1>
<p>__N__ clips &middot; re-locked to phrase anchors &middot; filler tics + restatement/doubling cuts (=15% cap) &middot; internal silences removed at 250ms (declicked)</p></header>
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
    prog["phase"] = "5B-tightened-desilenced"
    prog["dashboard_status"] = "Review 2 (2026-06-23): 4 clips tightened (re-lock + filler/fumble cuts, 15% cap) + silences removed at 250ms. Awaiting Mike before captions/render."
    prog["tighten_log"] = "video-creation/shorts/kaspa-changes-everything/tighten_log.json"
    by = {c["slug"]: c for c in CLIPS}
    for cl in prog.get("clips", []):
        if cl.get("slug") in by:
            cl["output_mp4"] = f"video-creation/shorts/kaspa-changes-everything/{cl['slug']}/tightened.mp4"
            cl["duration"] = round(by[cl["slug"]]["fdur"], 1)
    with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened + desilenced")
print(f"Dashboard: {DASHBOARD}")
