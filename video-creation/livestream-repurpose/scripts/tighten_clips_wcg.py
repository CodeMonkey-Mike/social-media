"""
Phase 5 - Tighten pass for the 'wife-changing-gains' batch (3 clips, 2 topics).
Multi-segment aware (clips can have >1 source range). Step 1 boundary/seg re-locks remove
fumbled lead-ins/restates; step 2 auto-removes filler tics (um/uh/you know/i mean/right?)
with an 8ms declick; step 3 authored span cuts remove redundant riffs. Cut from the MASTER
vertical. Writes <slug>/tightened.mp4 + tighten_log.json and REBUILDS dashboard.html in place
(never a second dashboard) for the tightened review.
"""
import json, subprocess, os, tempfile

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "wife-changing-gains LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "wife-changing-gains", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\wife-changing-gains"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")  # overwrite in place; do NOT make a second dashboard
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP  = 0.15

FILLER_SINGLES = {"um", "umm", "uh", "uhh", "erm", "hmm"}
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

# segs = kept source ranges (step-1 re-locks already applied). cuts = authored interior spans.
CLIPS = [
    {"slug": "ai-coming-for-every-job", "title": "AI Is Coming For Every Job. Here's the Hedge",
     "hook": "A robot can already do surgery better than an experienced surgeon. Self-driving trucks plus humanoid robots mean no job is safe. The one move that hedges all of it: get into crypto.",
     "preview_dur": 114.6,
     "segs": [(1402.6, 1500.4), (2223.5, 2240.3)],
     "cuts": [(1407.8, 1409.2, "aside: oh my god dude"),
              (1449.6, 1463.8, "redundant first salary riff (300k/million a year)")]},
    {"slug": "nobody-is-safe-punch", "title": "Nobody Is Safe (punch)",
     "hook": "A robot can now do a better job than an experienced surgeon. Nobody is safe. No one is safe at all.",
     "preview_dur": 13.4,
     "segs": [(1436.5, 1444.5), (1495.0, 1500.4)],
     "cuts": []},
    {"slug": "jobs-report-so-good-it-was-bad", "title": "The Jobs Report Was So Good It Was Bad",
     "hook": "Saturday's jobs report was so damn good it terrified everyone into pricing a rate hike. Great economy, but prices are sticking it to us. Good news became bad news.",
     "preview_dur": 49.6,
     "segs": [(2334.4, 2338.3), (2355.9, 2384.0)],   # re-lock: drop 'I just go into the previous' restate
     "cuts": []},
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

print("== Tighten pass (wife-changing-gains) ==")
log = []
for c in CLIPS:
    seg_total = sum(e - s for s, e in c["segs"])
    # collect fillers across all segs + authored cuts
    removes = []
    for s, e in c["segs"]:
        removes += detect_fillers(s, e)
    removes += [(a, b, lbl) for (a, b, lbl) in c.get("cuts", [])]
    removed_t = sum(b - a for a, b, *_ in removes)
    if removed_t > CAP * seg_total:   # cap content removal at 15% of kept source
        removes.sort(key=lambda r: r[1] - r[0])
        while removes and removed_t > CAP * seg_total:
            r0 = removes.pop(0); removed_t -= (r0[1] - r0[0])
    rem_ranges = [(a, b) for a, b, *_ in removes]
    keeps = []
    for s, e in c["segs"]:
        keeps += complement(s, e, rem_ranges)
    out_dir = os.path.join(OUT_BASE, c["slug"]); os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "tightened.mp4")
    with tempfile.TemporaryDirectory() as work:
        ok = render(keeps, out_path, work)
    final = sum(b - a for a, b in keeps)
    c["final_dur"] = final; c["ok"] = ok
    c["removed"] = [{"start": round(r[0], 2), "end": round(r[1], 2), "label": r[2]} for r in removes]
    pct = (1 - final / c["preview_dur"]) * 100 if c["preview_dur"] else 0
    print(f"  {c['slug']:32s} preview {c['preview_dur']:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(removes)} removed) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "segs": [f"{s:.1f}-{e:.1f}" for s, e in c["segs"]],
                "preview_s": c["preview_dur"], "final_s": round(final, 1), "removed_pct": round(pct, 1),
                "removed": c["removed"]})

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['final_dur']//60)}m {int(c['final_dur']%60):02d}s",
    "trim": f"-{round((1-c['final_dur']/c['preview_dur'])*100)}% ({len(c['removed'])} removed)",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary/seg re-lock + fillers",
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>wife-changing-gains - Tightened Clips (Review 2)</title>
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
<header><h1>wife-changing-gains - Tightened Clips (Review 2)</h1>
<p>__N__ clips (2 topics; Topic A = long + punch) &middot; boundary re-locks + filler tics removed &middot; silence removal (Phase 5B) is the next pass</p></header>
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
    prog["stage"] = "tightened-awaiting-review"
    prog["dashboard_status"] = "Tightened 3 clips (2 topics). Dashboard rebuilt in place showing tightened.mp4. AWAITING Mike's review; silence removal + production come after approval."
    prog["tighten_log"] = "shorts/wife-changing-gains/tighten_log.json"
    for cl in prog.get("clips", []):
        if "phase_status" in cl and "tighten" in cl["phase_status"]:
            cl["phase_status"]["tighten"] = "done"
    with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

print(f"\n{sum(1 for c in CLIPS if c.get('ok'))}/{len(CLIPS)} tightened")
print(f"Dashboard: {DASHBOARD}")
