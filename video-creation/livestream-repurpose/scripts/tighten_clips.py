"""
Phase 5 — Tighten pass (runs AFTER raw preview clips, BEFORE delete_silences).

For each kept clip it:
  1. Re-locks the OUTER boundaries to phrase anchors (start = the real hook, end = the
     topic's final word) — this fixes trailing run-off into the next sentence/topic and
     skips dead lead-in (e.g. the opening countdown card).
  2. Auto-removes filler disfluencies (um/uh/erm/hmm, "you know", "i mean", "right?" tics)
     inside the kept range, each excised with an 8ms declick fade so the splice never pops.
  3. Removes any authored mid-asides (chat tangents / "hold on let me share").
Removal of content (2+3) is capped at ~15% of the re-locked range; boundary re-lock (1) is
not capped (it's fixing a bad cut, not trimming content).

Writes <slug>/tightened.mp4, rebuilds the dashboard to show the tightened clips for a 2nd
review, logs every removed span, and updates progress.json. Cut from the MASTER vertical at
absolute timestamps (cleanest quality). Does NOT run silence removal — that is the next phase
after Mike approves the tightened clips.
"""
import json, subprocess, os, sys, tempfile, shutil

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
NAME     = "Best 350x Cryptos To Make Me Millions! LOW BPS VERTICAL"
SRC      = os.path.join(BASE, "media", "Best 350x Cryptos That Will Make me a Millionaire", NAME + ".mp4")
JSON_SRC = os.path.join(BASE, "transcripts", NAME, NAME + ".json")
OUT_BASE = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\best-350x"
DASHBOARD = os.path.join(OUT_BASE, "dashboard.html")
PROGRESS  = os.path.join(OUT_BASE, "progress.json")
FADE = 0.008
CAP  = 0.15  # max fraction of the re-locked range removable as content (fillers+asides)

# Filler tics to auto-remove (matched on normalized tokens; pairs matched on consecutive words)
FILLER_SINGLES = {"um", "umm", "uh", "uhh", "erm", "hmm"}
FILLER_TIC     = {"right"}          # only when the raw token is "right?" or "right," (a verbal tic)
FILLER_PAIRS   = [("you", "know"), ("i", "mean")]

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)
ALL = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        ALL.append({"raw": w["word"].strip(),
                    "word": w["word"].strip().lower().strip(".,!?'\""),
                    "start": w.get("start", seg["start"]),
                    "end":   w.get("end",   seg["end"])})

def _norm(p): return [x.strip().lower().strip(".,!?'\"") for x in p.split()]
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

# ── 8 kept clips (dropped: moon-bag [boring], linea-xrp-useless [project-negative]) ──
CLIPS = [
    {"slug": "353x-20x-punch", "title": "I Said 20x. It Did 353x.",
     "hook": "\"I said lab was going to be a goddamn 20x, and then I'm doing a 353x. Isn't it good to be wrong?\"",
     "start_ph": "i said lab was going to be a 20x", "end_ph": "holy crap", "after": 1265,
     "removes": [], "fb": (1271, 1286)},
    {"slug": "353x-reveal", "title": "353x on LAB: The Private Gem I Called at a 40x",
     "hook": "\"Lab was a private gem. We got in at a 40x, that's when I exposed it, and it just kept pumping. 353x.\"",
     "start_ph": "look at this lab", "end_ph": "353x it's crazy", "after": 1410,
     "removes": [], "fb": (1419, 1456)},
    {"slug": "short-squeeze-leverage", "title": "Why Leverage Is a Trap: You're Betting Against the System",
     "hook": "\"The market makers buy the supply and liquidate the shorts. You're betting against the people who run the system, and they want you to lose.\"",
     "start_ph": "whenever the market makers decide", "end_ph": "want you to lose", "after": 1710,
     "removes": [], "fb": (1717, 1748)},
    {"slug": "saylor-fraction-panic", "title": "Saylor Sold a Fraction of a Percent and Everyone Panicked",
     "hook": "\"We broke the channel because Michael Saylor sold a fraction of a percent. Everybody freaked out.\"",
     "start_ph": "the reason why we broke down", "end_ph": "everybody freaked out", "after": 2000,
     "removes": [], "fb": (2009, 2033)},
    {"slug": "economy-1992", "title": "We're in 1992: The Four-Year-Cycle Zombies Are About to Be Wrong",
     "hook": "\"The economy is screaming. The four-year-cycle zombies calling 32k don't see it yet.\"",
     "start_ph": "even when all this", "end_ph": "pulling us back down", "after": 2250,
     "removes": [], "fb": (2256, 2330)},
    {"slug": "ai-dwarfs-dotcom", "title": "AI Is Going to Dwarf the Dot-Com Explosion",
     "hook": "\"AI is a massive economic expansion. It's going to dwarf the dot-com era.\"",
     "start_ph": "the ai in my opinion", "end_ph": "started in 1992", "after": 630,
     "removes": [], "fb": (636, 716),
     "note": "Has a ~25s internet/telecom digression in the middle that a >15% cut would remove; left in (over cap). Flag for Mike."},
    {"slug": "pippin-85x-cex-tell", "title": "How I Caught an 85x on Pippin: Watch the Exchange Listings",
     "hook": "\"It went dead in August. Then it got listed on four exchanges in a single day, and Pippin started ripping. 85x.\"",
     "start_ph": "okay it's dead but then suddenly", "end_ph": "one after another after another", "after": 4260,
     "removes": [], "fb": (4268, 4345)},
    {"slug": "elizaos-freebie", "title": "Don't Sleep on ElizaOS: A Free 24x I Already Called",
     "hook": "\"Don't sleep on ElizaOS. That's a freebie. 24x on AI16Z, and it's just a rebrand.\"",
     "start_ph": "don't be sleeping on", "end_ph": "sleeping on that", "after": 940,
     "removes": [], "fb": (944, 968)},
]
DROPPED = ["moon-bag", "linea-xrp-useless"]

def detect_fillers(s, e):
    """Return list of (start,end,label) filler spans within [s,e]."""
    idx = [i for i, w in enumerate(ALL) if w["start"] >= s and w["end"] <= e]
    spans = []
    i = 0
    while i < len(idx):
        wi = idx[i]; w = ALL[wi]
        # pair fillers
        paired = False
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
    """Keep-spans = [s,e] minus removes."""
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

print("== Tighten pass ==")
log = []
for c in CLIPS:
    s = find_start(c["start_ph"], c["after"]); e = find_end(c["end_ph"], s if s else c["after"])
    if s is None or e is None or e <= s:
        s, e = c["fb"]; print(f"  {c['slug']:24s} anchors unresolved -> fallback {s}-{e}")
    raw_dur = e - s
    fillers = detect_fillers(s, e)
    mids = [(find_start(a, s), find_end(b, find_start(a, s) or s)) for a, b in c["removes"]]
    mids = [(a, b) for a, b in mids if a is not None and b is not None]
    removes = fillers + [(a, b, "aside") for a, b in mids]
    removed_t = sum(b - a for a, b, *_ in removes)
    # enforce cap on CONTENT removal (drop smallest fillers until under cap)
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
    print(f"  {c['slug']:24s} {int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}  "
          f"{raw_dur:.0f}s -> {final:.0f}s (-{pct:.0f}%, {len(removes)} cuts) {'OK' if ok else 'FAIL'}")
    log.append({"slug": c["slug"], "range": f"{int(s//60)}:{int(s%60):02d}-{int(e//60)}:{int(e%60):02d}",
                "raw_s": round(raw_dur, 1), "final_s": round(final, 1), "removed_pct": round(pct, 1),
                "removed": c["removed"], "note": c.get("note", "")})

# drop the cut clips' dirs
for d in DROPPED:
    p = os.path.join(OUT_BASE, d)
    if os.path.isdir(p): shutil.rmtree(p); print(f"  dropped dir: {d}")

with open(os.path.join(OUT_BASE, "tighten_log.json"), "w", encoding="utf-8") as f:
    json.dump(log, f, indent=2)

# ── Dashboard (review #2 — tightened clips) ──────────────────────────────────────
card_data = [{
    "slug": c["slug"], "title": c["title"], "hook": c["hook"],
    "dur": f"{int(c['final_dur']//60)}m {int(c['final_dur']%60):02d}s",
    "trim": f"-{round((1-c['final_dur']/c['raw_dur'])*100)}% ({len(c['removed'])} cuts)",
    "cuts": ", ".join(sorted({r['label'] for r in c['removed']})) or "boundary only",
    "note": c.get("note", ""),
} for c in CLIPS]
cards_js = json.dumps(card_data, indent=2)

html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best 350x — Tightened Clips (Review 2)</title>
<style>
  *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
  body{{background:#0d0d0d;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px 24px 80px;}}
  header{{margin-bottom:40px;border-bottom:1px solid #2a2a2a;padding-bottom:20px;}}
  header h1{{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.04em;}}
  header p{{margin-top:6px;font-size:13px;color:#666;}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:28px;}}
  .card{{background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;transition:border-color .2s;}}
  .card:hover{{border-color:#444;}} .card.approved{{border-color:#00e5ff;box-shadow:0 0 0 1px #00e5ff22;}} .card.skipped{{opacity:.45;}}
  .video-wrap{{background:#000;aspect-ratio:9/16;max-height:520px;overflow:hidden;}}
  .video-wrap video{{width:100%;height:100%;object-fit:contain;display:block;}}
  .card-body{{padding:16px 18px 20px;}}
  .topic-num{{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#555;margin-bottom:4px;}}
  .card-title{{font-size:17px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}}
  .card-hook{{font-size:13px;color:#9a9a9a;margin-bottom:12px;line-height:1.4;font-style:italic;}}
  .meta{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}}
  .tag{{font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;letter-spacing:.06em;text-transform:uppercase;}}
  .tag-dur{{background:#1e2620;color:#5caf82;border:1px solid #2d4035;}} .tag-trim{{background:#26201e;color:#d49a5c;border:1px solid #40352d;}}
  .cuts{{font-size:11px;color:#666;margin-bottom:6px;}} .note{{font-size:11px;color:#d4a017;margin-bottom:12px;}}
  .actions{{display:flex;gap:10px;}}
  .btn{{flex:1;padding:9px 0;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.04em;}}
  .btn:hover{{opacity:.85;}} .btn-approve{{background:#00e5ff;color:#000;}} .btn-skip{{background:#2a2a2a;color:#888;}}
  .btn-approved{{background:#00e5ff22;color:#00e5ff;border:1px solid #00e5ff44;}} .btn-skipped{{background:#1e1e1e;color:#555;border:1px solid #333;}}
  .summary-bar{{position:fixed;bottom:0;left:0;right:0;background:#111;border-top:1px solid #2a2a2a;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;font-size:13px;}}
  .summary-bar span{{color:#666;}} .summary-bar strong{{color:#00e5ff;}}
</style></head><body>
<header><h1>Best 350x Cryptos — Tightened Clips (Review 2)</h1>
<p>8 clips (dropped moon-bag + linea) &nbsp;·&nbsp; boundaries re-locked + fillers removed &nbsp;·&nbsp; still NO silence removal yet &nbsp;·&nbsp; Approve or Skip</p></header>
<div class="grid" id="grid"></div>
<div class="summary-bar"><span>Approved: <strong id="count">0</strong></span><div id="approved-list" style="color:#aaa;font-size:12px;">—</div></div>
<script>
const topics = {cards_js};
const state = {{}}; topics.forEach(t => state[t.slug]='none');
function render() {{
  const grid = document.getElementById('grid'); grid.innerHTML='';
  topics.forEach((t,i) => {{
    const s = state[t.slug];
    const ab = s==='approved' ? `<button class="btn btn-approved" onclick="tg('${{t.slug}}','approved')">✓ Approved</button>` : `<button class="btn btn-approve" onclick="tg('${{t.slug}}','approved')">Approve</button>`;
    const sb = s==='skipped' ? `<button class="btn btn-skipped" onclick="tg('${{t.slug}}','skipped')">Skipped</button>` : `<button class="btn btn-skip" onclick="tg('${{t.slug}}','skipped')">Skip</button>`;
    const note = t.note ? `<div class="note">⚠ ${{t.note}}</div>` : '';
    const card = document.createElement('div');
    card.className = 'card' + (s==='approved'?' approved':s==='skipped'?' skipped':'');
    card.innerHTML = `<div class="video-wrap"><video controls preload="metadata" src="${{t.slug}}/tightened.mp4"></video></div>
      <div class="card-body"><div class="topic-num">Clip ${{i+1}} of ${{topics.length}}</div>
      <div class="card-title">${{t.title}}</div><div class="card-hook">${{t.hook}}</div>
      <div class="meta"><span class="tag tag-dur">${{t.dur}}</span><span class="tag tag-trim">${{t.trim}}</span></div>
      <div class="cuts">removed: ${{t.cuts}}</div>${{note}}<div class="actions">${{ab}}${{sb}}</div></div>`;
    grid.appendChild(card);
  }});
  const a = topics.filter(t=>state[t.slug]==='approved');
  document.getElementById('count').textContent=a.length;
  document.getElementById('approved-list').textContent=a.length?a.map(t=>t.title).join(' · '):'—';
}}
function tg(slug,act){{ state[slug]=state[slug]===act?'none':act; render(); }}
render();
</script></body></html>"""
with open(DASHBOARD, "w", encoding="utf-8") as f: f.write(html)

# ── progress.json update ─────────────────────────────────────────────────────────
prog = json.load(open(PROGRESS, encoding="utf-8")) if os.path.exists(PROGRESS) else {}
prog["dashboard_status"] = ("Tighten pass done: 8 clips (dropped moon-bag + linea), boundaries re-locked + "
                            "fillers removed. AWAITING Mike's 2nd review on tightened.mp4. Next phase = delete_silences on approved.")
prog["tighten_log"] = "shorts/best-350x/tighten_log.json"
with open(PROGRESS, "w", encoding="utf-8") as f: json.dump(prog, f, indent=2)

ok_n = sum(1 for c in CLIPS if c.get("ok"))
print(f"\n{ok_n}/{len(CLIPS)} tightened")
print(f"Dashboard: {DASHBOARD}")
