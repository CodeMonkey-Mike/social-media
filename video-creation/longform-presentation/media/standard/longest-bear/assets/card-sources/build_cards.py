#!/usr/bin/env python
"""build_cards.py: rebuild EVERY cover-card still and the deck of longest-bear from ONE facts block.

  python assets/card-sources/build_cards.py            (from the project folder, or any cwd)
  python assets/card-sources/build_cards.py --html-only   (write the HTML, no screenshots)
  python assets/card-sources/build_cards.py --vertical    (the VERTICAL card set only: 1080x1920, native re-layout)

--vertical writes ONLY assets/card-sources/cards-vertical.html + assets/vertical/cards/<id>.png (same ids, same FACTS,
the cards re-composed for a tall frame: titles wrap, rows stack, the lower third kept light for the phone UI). It never
writes cards.html, assets/cards/ or the deck. The two full-frame slide covers come from build_share_pages.py --vertical-full.
NOTE: longest-bear.html was extended by hand past the 4 slides deck_html() writes (8 slides on 2026-11-25), so a plain
run of this script would overwrite it: re-sync deck_html() first.

What it writes
  assets/card-sources/cards.html   every cover card, one <section class="frame" id="<file stem>"> per still
  assets/cards/<id>.png | <id>-<state>.png   exactly the files the SCRIPT.md [SHOW] lines name, 1920x1080, scale 1
  longest-bear.html                the 4-slide screen-share deck (project root)
  _qa/deck/slide-<n>.png           the deck shot at 1920x1080, for QA only

Every figure on screen comes from FACTS below, and every FACTS value from RESEARCH.md (read 2026-11-25). On the
recording day: re-pull the numbers into RESEARCH.md, change FACTS to match, run this script again.

Style: container-canonical.css (longform-edited/skills/container-reference/) is read from its file and pasted
VERBATIM first; the per-video block after it only re-maps tokens to Mike's look for this video (2026-11-24: dark,
white #f5f5f7 + gold #f5b942 ink, a muted red for the falls only).

Machine line: BUILD-CARDS PASS|FAIL cards=N deck_slides=N out=<assets/cards>
"""
import argparse
import struct
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parents[1]                                   # .../media/standard/longest-bear
REPO = PROJECT.parents[3]                                   # .../video-creation
CANON = REPO / "longform-edited" / "skills" / "container-reference" / "container-canonical.css"
CARDS_DIR = PROJECT / "assets" / "cards"
V_CARDS_DIR = PROJECT / "assets" / "vertical" / "cards"
V_SAFE_BOTTOM = 1320      # vertical: nothing below this y (the phone's caption / buttons UI owns the lower third)
DECK = PROJECT / "longest-bear.html"
QA_DECK = PROJECT / "_qa" / "deck"

# ------------------------------------------------------------------ FACTS (RESEARCH.md, read 2026-11-25)
FACTS = {
    # section 2 / 3
    "top_date": "October 6, 2025",
    "top_close": "124,753",          # close, not the intraday high
    "now_close": "59,072",           # 2026-11-25 (partial day): re-pull on the recording day
    "days_since_top": "415",         # 2025-10-06 to the read date: re-pull on the recording day
    # section 3 (deck slide 2)
    "leg1_days": "267",
    "leg1_fall": "53%",
    "leg2_age": "2 weeks",
    "leg2_fall": "32%",
    # section 3d (the hope)
    "breakeven": "2.1%",             # FRED T10YIE 2.12% on 2026-11-24
    "wti": "81",                     # WTI about 80.86
    "wti_month": "20%",              # down 20.5% in a month
    "fed_odds": "90%",               # about 90% priced for a quarter-point hike in December
    "cpi": "3.7%",                   # CPI, September 2026, year over year
    # section 3b (the 200-week line)
    "w200": "68K",                   # 68,264
    "w200_2018_pct": 0.9,            # bottom +0.9% vs the line (drawn on the line)
    "w200_2022_pct": -34.4,
    "w200_now_pct": -13.5,
    "w200_2018_txt": "WITHIN 1%",
    "w200_2022_txt": "34% UNDER",
    "w200_now_txt": "13% UNDER",
    # section 2 (top to a new high, in days)
    "new_high_days": [("2013", 1127), ("2017", 1080), ("2021", 847)],
}

FONTS_LINK = ('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900'
              '&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')

# ------------------------------------------------------------------ the per-video token block (cards)
VIDEO_CSS = r"""
/* ===== longest-bear: Mike's look for this video (2026-11-24). Tokens re-mapped, anatomy untouched. ===== */
:root{ --text-primary:#f5f5f7; --accent-gold:#f5b942; --accent-red:#e0606e; --rest:#b4bac6; }
.divider{background:linear-gradient(90deg,var(--accent-gold),rgba(245,185,66,.18))}
h1{font-size:92px;font-variant-numeric:lining-nums}
.ey{font-size:30px;color:#6b7488}

/* ROW CARD: label | big mono value | words. Resting rows are muted but READABLE; the lit row is gold. */
.rows{display:flex;flex-direction:column;gap:22px;margin-top:6px;width:1640px}
.row{display:grid;grid-template-columns:300px 400px 1fr;align-items:center;column-gap:20px;
  padding:26px 44px;border-radius:20px;background:var(--bg-card);border:2px solid var(--border);
  border-left:8px solid #2a3142}
.row .lab{font-family:'DM Sans';font-weight:700;font-size:32px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.row .val{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:76px;line-height:1.05;color:var(--rest)}
.row .val small{font-size:40px;color:var(--text-secondary);margin-left:6px}
.row .txt{font-family:'DM Sans';font-size:36px;line-height:1.3;color:var(--text-secondary)}
.row.lit{background:linear-gradient(90deg,rgba(245,185,66,.13),rgba(245,185,66,.03));border-color:rgba(245,185,66,.55);
  border-left-color:var(--accent-gold);box-shadow:0 0 60px rgba(245,185,66,.12)}
.row.lit .lab{color:var(--accent-gold)}
.row.lit .val{color:var(--text-primary)}
.row.lit .txt{color:var(--text-primary)}
.row.lit .txt .re,.row.lit .val.re{color:var(--accent-red)}
.row:not(.lit) .txt .re{opacity:.45}
.row.lit.red{background:linear-gradient(90deg,rgba(224,96,110,.14),rgba(224,96,110,.03));border-color:rgba(224,96,110,.55);
  border-left-color:var(--accent-red);box-shadow:0 0 60px rgba(224,96,110,.12)}
.row.lit.red .lab{color:var(--accent-red)}
.hope .row{padding:22px 44px;grid-template-columns:270px 330px 1fr}
.hope .row .val{font-size:70px}
.hope .row .txt{font-size:34px}

/* THE 200-WEEK LINE: a stage with the line and three bottoms hung under it at their real distance */
.stage{position:relative;width:1640px;height:470px;margin-top:10px}
.wline{position:absolute;left:0;right:0;top:70px;height:6px;border-radius:3px;background:var(--accent-gold);opacity:.75}
.wline.lit{opacity:1;box-shadow:0 0 28px rgba(245,185,66,.9),0 0 70px rgba(245,185,66,.45);height:8px}
.wtag{position:absolute;left:0;top:0;display:flex;align-items:baseline;gap:22px}
.wtag .n{font-family:'DM Sans';font-weight:700;font-size:32px;letter-spacing:.14em;color:var(--text-secondary)}
.wtag .v{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:48px;color:var(--rest)}
.wtag.lit .n{color:var(--accent-gold)} .wtag.lit .v{color:var(--accent-gold);text-shadow:0 0 24px rgba(245,185,66,.5)}
.mk{position:absolute}
.mk .drop{position:absolute;left:12px;width:0;border-left:3px dashed #3a4256}
.mk .dot{position:absolute;left:0;width:30px;height:30px;border-radius:50%;background:#7c8496;border:4px solid var(--bg-deep)}
.mk .lbl{position:absolute;left:52px;white-space:nowrap;transform:translateY(-50%)}
.mk .lbl .a{font-family:'DM Sans';font-weight:700;font-size:30px;letter-spacing:.12em;color:var(--text-secondary)}
.mk .lbl .b{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:46px;color:var(--rest);margin-top:4px}
.mk.lit .dot{background:var(--accent-gold);box-shadow:0 0 30px rgba(245,185,66,.9)}
.mk.lit .lbl .a{color:var(--accent-gold)} .mk.lit .lbl .b{color:var(--text-primary)}
.mk.lit.red .dot{background:var(--accent-red);box-shadow:0 0 30px rgba(224,96,110,.9)}
.mk.lit.red .drop{border-left-color:rgba(224,96,110,.7)}
.mk.lit.red .lbl .a{color:var(--accent-red)} .mk.lit.red .lbl .b{color:var(--accent-red)}

/* TOP TO A NEW HIGH: horizontal bars, days to scale */
.bars{display:flex;flex-direction:column;gap:30px;margin-top:10px;width:1640px}
.bar{display:flex;align-items:center;gap:26px}
.bar .yr{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:46px;color:var(--text-secondary);width:150px}
.bar .fill{height:74px;border-radius:12px;background:linear-gradient(90deg,#3a4256,#8a93a6)}
.bar .num{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:56px;color:var(--text-primary)}
.bar.now .yr{color:var(--accent-gold)}
.bar.now .fill{background:linear-gradient(90deg,rgba(245,185,66,.35),var(--accent-gold));box-shadow:0 0 40px rgba(245,185,66,.35)}
.bar.now .num{color:var(--accent-gold);font-size:46px;font-family:'DM Sans';font-weight:700;letter-spacing:.06em}
.bar.now .num .mono{font-size:56px;letter-spacing:0}
"""

# ------------------------------------------------------------------ VERTICAL (1080x1920): pasted AFTER VIDEO_CSS
# Same tokens, same anatomy; only the geometry changes. Content sits in y 170..1320, the lower third stays light.
VERTICAL_CSS = r"""
/* ===== VERTICAL 1080x1920: re-composed for a tall frame (title wraps, rows stack), lower third kept light ===== */
.frame{width:1080px;height:1920px;padding:150px 84px 600px;justify-content:center}
.frame>*{flex-shrink:0}       /* a tall stack must never squeeze the divider to 0 px */
h1{font-size:118px;line-height:1.04;max-width:none}
.ey{font-size:32px;line-height:1.4;margin-bottom:24px}
.divider{width:84px;height:5px;margin:40px 0}

.rows{width:912px;gap:24px;margin-top:4px}
.row{grid-template-columns:1fr auto;grid-template-areas:"lab val" "txt txt";align-items:center;row-gap:8px;
  padding:26px 38px}
.row .lab{grid-area:lab;font-size:32px}
.row .val{grid-area:val;font-size:96px;text-align:right}
.row .txt{grid-area:txt;font-size:38px}
.rows.hope{gap:20px}
.hope .row{grid-template-columns:1fr auto;padding:20px 38px}
.hope .row .val{font-size:80px}
.hope .row .txt{font-size:34px}

.stage{width:912px;margin-top:6px}
.mk .lbl{left:0;transform:none}
.mk .lbl .a{font-size:30px}
.mk .lbl .b{font-size:50px}
.wtag .n{font-size:32px} .wtag .v{font-size:54px}

.bars{width:912px;gap:32px;margin-top:6px}
.bar{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"yr num" "fill fill";align-items:baseline;
  column-gap:30px;row-gap:10px}
.bar .yr{grid-area:yr;width:auto;font-size:44px}
.bar .num{grid-area:num;font-size:62px}
.bar .fill{grid-area:fill;height:74px}
.bar.now .num{font-size:44px}
.bar.now .num .mono{font-size:62px}
"""

# 16:9 and vertical geometry for the cards whose layout is computed here (FACTS stay the one source of the figures)
GEOM = {
    False: {"w200_line_y": 73, "w200_px_per_pct": 10.5, "w200_x": (120, 640, 1160), "w200_stage_h": 470,
            "bar_max": 1080},
    True: {"w200_line_y": 98, "w200_px_per_pct": 13.0, "w200_x": (34, 322, 610), "w200_stage_h": 700,
           "bar_max": 912},
}

ORB_GOLD = '<div class="orb" style="width:620px;height:620px;background:var(--accent-gold);top:-260px;right:-200px;opacity:.16"></div>'
ORB_RED = '<div class="orb" style="width:520px;height:520px;background:var(--accent-red);bottom:-260px;left:-180px;opacity:.12"></div>'


def frame(fid, body, orbs=ORB_GOLD):
    return f'<section class="frame" id="{fid}">\n  {orbs}\n{body}\n</section>\n'


def lit(c, extra=""):
    return (" lit" + (" " + extra if extra else "")) if c else ""


# ------------------------------------------------------------------ since-the-top (states: top, now, days)
def since_the_top(state):
    F = FACTS
    rows = [
        ("top", "TOP", f'${F["top_close"]}', f'{F["top_date"]}, daily close', ""),
        ("now", "NOW", f'${F["now_close"]}', '<span class="re">Down more than half</span>', ""),
        ("days", "DAYS", F["days_since_top"], "Days since the top, no new high", ""),
    ]
    html = "\n".join(
        f'    <div class="row{lit(state == k, x)}"><div class="lab">{lab}</div><div class="val">{val}</div><div class="txt">{txt}</div></div>'
        for k, lab, val, txt, x in rows)
    body = f"""  <div class="ey">Bitcoin</div>
  <h1>Since the <span class="go">top</span></h1>
  <div class="divider"></div>
  <div class="rows">
{html}
  </div>"""
    return frame(f"since-the-top-{state}", body)


# ------------------------------------------------------------------ the-hope (states: inflation, oil, fed, catch)
def the_hope(state):
    F = FACTS
    rows = [
        ("inflation", "INFLATION", F["breakeven"], f'What the bond market expects for the next <span class="mono">10</span> years', ""),
        ("oil", "OIL", f'${F["wti"]}', f'A barrel of WTI, down <span class="mono">{F["wti_month"]}</span> in a month', ""),
        ("fed", "THE FED", F["fed_odds"], "Priced for a quarter-point hike in December. Off the table if inflation is soft", ""),
        ("catch", "THE CATCH", F["cpi"], "Actual inflation, CPI, in September", ""),
    ]
    html = "\n".join(
        f'    <div class="row{lit(state == k, x)}"><div class="lab">{lab}</div><div class="val">{val}</div><div class="txt">{txt}</div></div>'
        for k, lab, val, txt, x in rows)
    body = f"""  <div class="ey">What's moving the right way</div>
  <h1>The <span class="go">hope</span></h1>
  <div class="divider"></div>
  <div class="rows hope">
{html}
  </div>"""
    return frame(f"the-hope-{state}", body)


# ------------------------------------------------------------------ the-200-week-line (states: line, 2018, 2022, now)
def the_200_week_line(state, vertical=False):
    F, G = FACTS, GEOM[vertical]
    line_y, px_per_pct = G["w200_line_y"], G["w200_px_per_pct"]   # line centre in the stage; px down per 1% under it
    xs = G["w200_x"]
    marks = [
        ("2018", "2018 BOTTOM", F["w200_2018_txt"], F["w200_2018_pct"], xs[0], ""),
        ("2022", "2022 BOTTOM", F["w200_2022_txt"], F["w200_2022_pct"], xs[1], "red"),
        ("now", "NOW", F["w200_now_txt"], F["w200_now_pct"], xs[2], "red"),
    ]
    mk = []
    for k, a, b, pct, x, extra in marks:
        dy = max(0.0, -pct) * px_per_pct          # a bottom ON or above the line sits on it
        cy = line_y + dy
        drop = f'<div class="drop" style="top:{line_y}px;height:{dy:.0f}px"></div>' if dy > 2 else ""
        if vertical:                              # tall frame: the label hangs UNDER its dot (three columns of 304 px)
            lbl_top = cy + 34
        else:
            lbl_top = cy + (58 if dy <= 2 else 0)
        mk.append(f'    <div class="mk{lit(state == k, extra)}" style="left:{x}px;top:0">{drop}'
                  f'<div class="dot" style="top:{cy - 15:.0f}px"></div>'
                  f'<div class="lbl" style="top:{lbl_top:.0f}px"><div class="a">{a}</div><div class="b">{b}</div></div></div>')
    stage_style = f' style="height:{G["w200_stage_h"]}px"' if vertical else ""
    line_style = f' style="top:{line_y - 3}px"' if vertical else ""
    body = f"""  <div class="ey">The average of the last <span class="mono">200</span> weekly closes</div>
  <h1>The <span class="go">200-week</span> line</h1>
  <div class="divider"></div>
  <div class="stage"{stage_style}>
    <div class="wtag{lit(state == 'line')}"><span class="n">THE LINE</span><span class="v">${F["w200"]}</span></div>
    <div class="wline{lit(state == 'line')}"{line_style}></div>
{chr(10).join(mk)}
  </div>"""
    return frame(f"the-200-week-line-{state}", body, ORB_GOLD + ORB_RED)


# ------------------------------------------------------------------ back-to-the-top (no states)
def back_to_the_top(vertical=False):
    F = FACTS
    days = F["new_high_days"]
    scale = GEOM[vertical]["bar_max"] / max(d for _, d in days)
    rows = [f'    <div class="bar"><div class="yr">{y}</div><div class="fill" style="width:{d * scale:.0f}px"></div>'
            f'<div class="num">{d:,}</div></div>' for y, d in days]
    now = int(F["days_since_top"])
    rows.append(f'    <div class="bar now"><div class="yr">2025</div><div class="fill" style="width:{now * scale:.0f}px"></div>'
                f'<div class="num">DAY <span class="mono">{now}</span> AND COUNTING</div></div>')
    body = f"""  <div class="ey">Every bear market before this one</div>
  <h1>Top to a <span class="go">new high</span>, in days</h1>
  <div class="divider"></div>
  <div class="bars">
{chr(10).join(rows)}
  </div>"""
    return frame("back-to-the-top", body)


def cards_html(vertical=False):
    frames = []
    frames += [since_the_top(s) for s in ("top", "now", "days")]
    frames += [the_hope(s) for s in ("inflation", "oil", "fed", "catch")]
    frames += [the_200_week_line(s, vertical) for s in ("line", "2018", "2022", "now")]
    frames.append(back_to_the_top(vertical))
    canon = CANON.read_text(encoding="utf-8")
    title = "longest-bear cover cards" + (" (VERTICAL 1080x1920)" if vertical else "")
    return (f"<!doctype html>\n<html><head><meta charset=\"utf-8\"><title>{title}</title>\n"
            f"{FONTS_LINK}\n<style>\n/* ===== BEGIN container-canonical.css (verbatim) ===== */\n{canon}\n"
            f"/* ===== END container-canonical.css ===== */\n{VIDEO_CSS}\n{VERTICAL_CSS + chr(10) if vertical else ''}"
            "</style></head>\n<body>\n" + "\n".join(frames) + "</body></html>\n")


# ------------------------------------------------------------------ the deck (presentation.md foundation)
DECK_CSS = r"""
:root{
  --bg-deep:#0a0c10; --bg-card:#12151c; --bg-card-hover:#181c26;
  --accent-green:#00e68a; --accent-cyan:#00c2ff; --accent-gold:#f5b942; --accent-red:#e0606e;
  --accent-purple:#a855f7; --accent-teal:#49e0c8;
  --text-primary:#f5f5f7; --text-secondary:#8892a4; --text-muted:#5d6679; --border:#1e2330;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-snap-type:y mandatory}
body{background:var(--bg-deep);font-family:'DM Sans',sans-serif;color:var(--text-primary);overflow-x:hidden}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.slide{min-height:100vh;height:100vh;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:center;
  padding:60px 80px 60px 6vw;position:relative;overflow:hidden}
@media(max-width:900px){ .slide{padding:40px 28px} }
.orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4;pointer-events:none}
.slide>*:not(.orb){position:relative;z-index:1}
h1{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(3rem,6vw,6.4rem);line-height:1.05;letter-spacing:-.02em}
.ey{display:block;font-size:clamp(1rem,1.45vw,1.6rem);text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);font-weight:600;margin-bottom:22px}
.mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.divider{width:72px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--accent-gold),rgba(245,185,66,.18));margin:34px 0}
.go{color:var(--accent-gold)} .re{color:var(--accent-red)}

/* the screen-share recording: the webcam + the membership box own the right column, so content stays left */
html{scrollbar-width:none} html::-webkit-scrollbar{display:none}
.wrap{max-width:64vw}   /* 6vw padding + 64vw = 70vw: nothing passes x 1382 (the right 28% is the webcam column) */
@media(max-width:900px){ .wrap{max-width:none} }
.lines{list-style:none;display:flex;flex-direction:column;gap:22px}
.lines li{font-size:clamp(1.4rem,2.25vw,2.5rem);line-height:1.3;color:var(--text-secondary);padding-left:26px;border-left:4px solid #2a3142}
.lines li b{color:var(--text-primary);font-weight:700}
.lines li b.go{color:var(--accent-gold)}
.lines .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.lines li.hot{border-left-color:var(--accent-gold)}
.chips{display:flex;gap:22px;flex-wrap:wrap;margin-top:34px}
.chip{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:clamp(1.5rem,2.4vw,2.6rem);padding:14px 30px;border-radius:100px;
  border:2px solid #2a3142;color:var(--text-secondary);background:rgba(255,255,255,.02)}
.chip.go{border-color:rgba(245,185,66,.6);color:var(--accent-gold);background:rgba(245,185,66,.08)}

.fade-in{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}
.delay-1{transition-delay:.15s}.delay-2{transition-delay:.3s}.delay-3{transition-delay:.45s}
.nav-dots{display:none!important;position:fixed;right:28px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:100}
.nav-dots button{width:8px;height:8px;border-radius:50%;border:none;background:var(--text-muted);cursor:pointer;padding:0;transition:transform .3s,background .3s}
.nav-dots button.active{background:var(--accent-gold);transform:scale(1.4)}

/* G = the webcam + membership column guide (crypto layout: the right column, full height), F = fullscreen */
#pip-zone{position:fixed;right:0;top:0;width:28vw;height:100vh;border:3px dashed rgba(255,255,255,.35);border-radius:6px;
  display:none;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:.9rem;letter-spacing:.15em;text-transform:uppercase;z-index:200}
#pip-zone.show{display:flex}
"""

DECK_JS = r"""
<div class="nav-dots" id="navDots"></div>
<div id="pip-zone">Webcam</div>
<script>
const slides = Array.from(document.querySelectorAll('.slide'));
const fadeObserver = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.15});
document.querySelectorAll('.fade-in').forEach(el=>fadeObserver.observe(el));
const dotsWrap = document.getElementById('navDots');
slides.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to slide '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior:'smooth'}));
  dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.children);
const dotObserver = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ const i=slides.indexOf(e.target); dots.forEach((d,j)=>d.classList.toggle('active',j===i)); } });
},{threshold:0.5});
slides.forEach(s=>dotObserver.observe(s));
function currentIndex(){
  const mid=window.innerHeight/2; let idx=0,best=Infinity;
  slides.forEach((s,i)=>{ const r=s.getBoundingClientRect(); const d=Math.abs((r.top+r.bottom)/2-mid); if(d<best){best=d;idx=i;} });
  return idx;
}
document.addEventListener('keydown',e=>{
  if(['ArrowRight','ArrowDown',' '].includes(e.key)){ e.preventDefault(); slides[Math.min(slides.length-1,currentIndex()+1)].scrollIntoView({behavior:'smooth'}); }
  if(['ArrowLeft','ArrowUp'].includes(e.key)){ e.preventDefault(); slides[Math.max(0,currentIndex()-1)].scrollIntoView({behavior:'smooth'}); }
});
document.addEventListener('keydown',e=>{
  if(e.key==='g'||e.key==='G') document.getElementById('pip-zone').classList.toggle('show');
  if(e.key==='f'||e.key==='F'){ if(!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
});
</script>
"""


def deck_html():
    F = FACTS
    orb = lambda c, pos: f'<div class="orb" style="width:560px;height:560px;background:var({c});{pos};opacity:.18"></div>'
    s1 = f"""<section class="slide" id="the-question">
  {orb('--accent-gold', 'top:-240px;left:30vw')}
  <div class="wrap">
    <span class="ey fade-in">Bitcoin</span>
    <h1 class="fade-in delay-1">The longest crypto bear market <span class="go">ever?</span></h1>
    <div class="divider fade-in delay-1"></div>
    <ul class="lines fade-in delay-2">
      <li>Top: <b>{F["top_date"]}</b>, <b class="mono">${F["top_close"]}</b></li>
      <li class="hot"><b class="mono go">{F["days_since_top"]}</b> days since, no new high</li>
    </ul>
  </div>
</section>"""
    s2 = f"""<section class="slide" id="two-bears">
  {orb('--accent-gold', 'bottom:-260px;left:10vw')}
  <div class="wrap">
    <span class="ey fade-in">Count it with one rule</span>
    <h1 class="fade-in delay-1">Two bear <span class="go">markets?</span></h1>
    <div class="divider fade-in delay-1"></div>
    <ul class="lines fade-in delay-2">
      <li>Over when Bitcoin is above its <b>50-week</b> and <b>200-day</b> averages, and stays there for a month and a half</li>
      <li>Bear <span class="mono">1</span>: <b class="mono">{F["leg1_days"]}</b> days, <span class="re">down <span class="mono">{F["leg1_fall"]}</span></span></li>
      <li class="hot">Bear <span class="mono">2</span>: <b>{F["leg2_age"].replace(" ", " ")}</b> old, <span class="re">down <span class="mono">{F["leg2_fall"]}</span></span></li>
    </ul>
  </div>
</section>"""
    s3 = f"""<section class="slide" id="the-hope">
  {orb('--accent-gold', 'top:-220px;left:40vw')}
  <div class="wrap">
    <span class="ey fade-in">What's moving the right way</span>
    <h1 class="fade-in delay-1">The <span class="go">hope</span></h1>
    <div class="divider fade-in delay-1"></div>
    <ul class="lines fade-in delay-2">
      <li>Inflation: the bond market expects <b class="mono">{F["breakeven"]}</b></li>
      <li>Oil: <b>down <span class="mono">{F["wti_month"]}</span></b> in a month</li>
      <li>The Fed: a quarter-point hike in December, about <b class="mono">{F["fed_odds"]}</b> priced</li>
    </ul>
  </div>
</section>"""
    s4 = f"""<section class="slide" id="the-long-view">
  {orb('--accent-gold', 'bottom:-260px;left:28vw')}
  <div class="wrap">
    <span class="ey fade-in">Zoom out</span>
    <h1 class="fade-in delay-1">The long <span class="go">view</span></h1>
    <div class="divider fade-in delay-1"></div>
    <ul class="lines fade-in delay-2"><li>Every bear market before this one ended the same way</li></ul>
    <div class="chips fade-in delay-3"><span class="chip">2013</span><span class="chip">2017</span><span class="chip">2021</span><span class="chip go">2025?</span></div>
  </div>
</section>"""
    return ("<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
            "<title>The Longest Crypto Bear Market Ever?</title>\n"
            f"{FONTS_LINK}\n<style>{DECK_CSS}</style></head>\n<body>\n"
            + "\n".join([s1, s2, s3, s4]) + DECK_JS + "</body></html>\n")


# ------------------------------------------------------------------ shoot
def png_size(p):
    with open(p, "rb") as f:
        return struct.unpack(">II", f.read(24)[16:24])


def shoot(cards_file, fails):
    from playwright.sync_api import sync_playwright
    CARDS_DIR.mkdir(parents=True, exist_ok=True)
    QA_DECK.mkdir(parents=True, exist_ok=True)
    n_cards = n_slides = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page.on("pageerror", lambda e: fails.append(f"page error: {e}"))
        # cards
        page.goto(cards_file.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        for fam, wt in (("Playfair Display", 900), ("DM Sans", 700), ("JetBrains Mono", 600)):
            if not page.evaluate("([f, w]) => document.fonts.check(w + ' 32px \"' + f + '\"')", [fam, wt]):
                fails.append(f"font not loaded: {fam} {wt}")
        if "\u2014" in page.evaluate("document.body.innerText"):
            fails.append("cards: em dash in the on-screen text")
        ids = page.evaluate("Array.from(document.querySelectorAll('section.frame[id]')).map(e => e.id)")
        for fid in ids:
            el = page.locator(f"section.frame#{fid}")
            # overflow check: nothing may reach the frame edge (48 px safe margin)
            bad = page.evaluate("""fid => { const f=document.getElementById(fid).getBoundingClientRect(); const out=[];
                document.getElementById(fid).querySelectorAll('*:not(.orb)').forEach(e=>{ const r=e.getBoundingClientRect();
                  if(r.width===0||r.height===0) return;
                  if(r.left<f.left+48||r.right>f.right-48||r.top<f.top+48||r.bottom>f.bottom-48) out.push((e.className||e.tagName)+' '+Math.round(r.left-f.left)+','+Math.round(r.top-f.top)+' '+Math.round(r.right-f.left)+','+Math.round(r.bottom-f.top)); });
                return out; }""", fid)
            if bad:
                fails.append(f"{fid}: element near/over the frame edge: {bad[:4]}")
            dst = CARDS_DIR / f"{fid}.png"
            el.screenshot(path=str(dst))
            if png_size(dst) != (1920, 1080):
                fails.append(f"{dst.name}: size {png_size(dst)} != 1920x1080")
            n_cards += 1
            print(f"  card  {dst}")
        # deck
        page.goto(DECK.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.add_style_tag(content=".fade-in{opacity:1!important;transform:none!important;transition:none!important}html{scroll-behavior:auto}")
        page.evaluate("""Promise.all(["900 64px 'Playfair Display'", "400 32px 'DM Sans'", "700 32px 'DM Sans'",
                          "600 32px 'JetBrains Mono'"].map(f => document.fonts.load(f, "0123456789$,.%?: abcdefghijklmnopqrstuvwxyz")))""")
        page.wait_for_timeout(800)          # the first slide was shot with fallback digits before the mono face landed
        page.evaluate("document.fonts.ready")
        for fam, wt in (("Playfair Display", 900), ("DM Sans", 700), ("JetBrains Mono", 600)):
            if not page.evaluate("([f, w]) => document.fonts.check(w + ' 32px \"' + f + '\"')", [fam, wt]):
                fails.append(f"deck font not loaded: {fam} {wt}")
        # every .mono element must RENDER in JetBrains Mono, and no deck text may pass x 1382 (the webcam column)
        bad = page.evaluate("""() => { const out=[];
            // a JetBrains Mono glyph is exactly 0.6 em wide: a span whose width is not chars x 0.6 em rendered in a fallback
            document.querySelectorAll('.slide .mono').forEach(e => { const cs=getComputedStyle(e);
              const want=e.textContent.length*0.6*parseFloat(cs.fontSize), got=e.getBoundingClientRect().width;
              if(!cs.fontFamily.includes('JetBrains') || Math.abs(got-want)>1) out.push('not mono: '+e.textContent+' w='+got.toFixed(1)+' want '+want.toFixed(1)); });
            document.querySelectorAll('.slide .wrap *').forEach(e => { const r=e.getBoundingClientRect(); if(r.width && r.right > window.innerWidth*0.72) out.push('past x1382: '+e.textContent.slice(0,40)+' '+Math.round(r.right)); });
            return out; }""")
        fails += [f"deck: {x}" for x in bad]
        n = page.evaluate("document.querySelectorAll('.slide').length")
        for i in range(n):
            page.evaluate(f"document.querySelectorAll('.slide')[{i}].scrollIntoView()")
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(250)
            dst = QA_DECK / f"slide-{i + 1}.png"
            page.screenshot(path=str(dst))
            n_slides += 1
            print(f"  deck  {dst}")
        browser.close()
    return n_cards, n_slides


def shoot_vertical(cards_file, fails):
    """The vertical card set: 1080x1920 per frame, a safe margin on every edge, nothing in the lower third below
    V_SAFE_BOTTOM, and every state of one card PIXEL-STABLE (same element boxes; only the lit colours differ)."""
    from playwright.sync_api import sync_playwright
    V_CARDS_DIR.mkdir(parents=True, exist_ok=True)
    n = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        page.on("pageerror", lambda e: fails.append(f"page error: {e}"))
        page.goto(cards_file.as_uri(), wait_until="networkidle")
        page.evaluate("""Promise.all(["900 64px 'Playfair Display'", "400 32px 'DM Sans'", "700 32px 'DM Sans'",
                          "600 32px 'JetBrains Mono'"].map(f => document.fonts.load(f, "0123456789$,.%?: abcdefghijklmnopqrstuvwxyz")))""")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(500)
        for fam, wt in (("Playfair Display", 900), ("DM Sans", 700), ("JetBrains Mono", 600)):
            if not page.evaluate("([f, w]) => document.fonts.check(w + ' 32px \"' + f + '\"')", [fam, wt]):
                fails.append(f"font not loaded: {fam} {wt}")
        if "—" in page.evaluate("document.body.innerText"):
            fails.append("vertical cards: em dash in the on-screen text")
        ids = page.evaluate("Array.from(document.querySelectorAll('section.frame[id]')).map(e => e.id)")
        boxes = {}
        for fid in ids:
            geo = page.evaluate("""fid => { const fr=document.getElementById(fid), f=fr.getBoundingClientRect(), out=[], boxes=[];
                fr.querySelectorAll('*:not(.orb)').forEach(e=>{ const r=e.getBoundingClientRect();
                  if(r.width===0||r.height===0) return;
                  const L=Math.round(r.left-f.left), T=Math.round(r.top-f.top), R=Math.round(r.right-f.left), B=Math.round(r.bottom-f.top);
                  if(!e.classList.contains('wline')) boxes.push([L,T,R,B].join(','));   // the lit line is 2 px thicker by design
                  if(L<48||R>1080-48||T<120||B>%d) out.push((e.className||e.tagName)+' '+L+','+T+' '+R+','+B); });
                return {out, boxes}; }""" % V_SAFE_BOTTOM, fid)
            if geo["out"]:
                fails.append(f"{fid}: element outside the safe area (x 48..1032, y 120..{V_SAFE_BOTTOM}): {geo['out'][:4]}")
            boxes[fid] = geo["boxes"]
            dst = V_CARDS_DIR / f"{fid}.png"
            page.locator(f"section.frame#{fid}").screenshot(path=str(dst))
            if png_size(dst) != (1080, 1920):
                fails.append(f"{dst.name}: size {png_size(dst)} != 1080x1920")
            n += 1
            print(f"  vcard {dst}")
        browser.close()
    groups = {}
    for fid in ids:
        groups.setdefault(fid.rsplit("-", 1)[0], []).append(fid)
    for g, members in groups.items():
        for m in members[1:]:
            if boxes[m] != boxes[members[0]]:
                fails.append(f"{m}: layout differs from {members[0]} (states must be pixel-stable)")
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--html-only", action="store_true")
    ap.add_argument("--vertical", action="store_true", help="the 1080x1920 card set only (never touches 16:9 or the deck)")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if a.vertical:
        vfile = HERE / "cards-vertical.html"
        vfile.write_text(cards_html(vertical=True), encoding="utf-8")
        print(f"  wrote {vfile}")
        fails = []
        nv = 0 if a.html_only else shoot_vertical(vfile, fails)
        for f in fails:
            print("  FAIL", f)
        print(f"BUILD-CARDS-VERTICAL {'FAIL' if fails else 'PASS'} cards={nv} out={V_CARDS_DIR}")
        return 1 if fails else 0
    cards_file = HERE / "cards.html"
    ch, dh = cards_html(), deck_html()
    fails = []
    if "\u2014" in dh:                       # the cards' check runs on their rendered text (the pasted CSS comments carry one)
        fails.append("longest-bear.html: em dash found")
    cards_file.write_text(ch, encoding="utf-8")
    DECK.write_text(dh, encoding="utf-8")
    print(f"  wrote {cards_file}\n  wrote {DECK}")
    nc = ns = 0
    if not a.html_only:
        nc, ns = shoot(cards_file, fails)
    for f in fails:
        print("  FAIL", f)
    print(f"BUILD-CARDS {'FAIL' if fails else 'PASS'} cards={nc} deck_slides={ns} out={CARDS_DIR}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
