# Code-rendered V4 DATA slides 2 and 5 of batch spon's Golden Kitty carousel (2026-09-30, Mike).
# Visual QA failed the ChatGPT versions: slide 2 labelled market cap as "Price (USD)" and drew a
# ~30x climb that contradicted its own "+25% this week" box; slide 5 was 40% empty panels.
# Per repurpose/SKILL.md Version 4, figure-bearing data slides are CODE-RENDERED. Unlike the
# Zombies renderer (render_v4_slide.py) this one mimics the look of the set's passing ChatGPT
# slides 3 and 4 (condensed heavy type, red title accent, red / green / orange stat boxes with
# icons, green chart panel, green insight box with an icon tag) so the carousel stays one set.
#
# Every figure comes from the post body (repurpose/output/spon-lane3-plan.json):
#   ATH Sept 27 "a little over a $6M cap" -> 6.1M ; now ~$4.5M (26% under the top)
#   +25% on the week -> 7 days ago = 4.5 / 1.25 = 3.6M ; +120% over two weeks -> 4.5 / 2.2 = 2.05M
# The chart plots ONLY those four stated points (straight segments), nothing invented between.
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

RED, GREEN, ORANGE, GOLD = "#dc2626", "#15803d", "#ea7a12", "#e0a100"

ICONS = {
    "alert": '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="{c}"/><path d="M24 11 L38 35 H10 Z" fill="#fff"/><rect x="22.2" y="19" width="3.6" height="9" rx="1.5" fill="{c}"/><circle cx="24" cy="31.5" r="2" fill="{c}"/></svg>',
    "bars":  '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="{c}"/><rect x="13" y="25" width="5" height="10" fill="#fff"/><rect x="21.5" y="19" width="5" height="16" fill="#fff"/><rect x="30" y="13" width="5" height="22" fill="#fff"/></svg>',
    "star":  '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="{c}"/><path d="M24 10 l4.1 8.9 9.6 1 -7.2 6.5 2.1 9.5 -8.6-5 -8.6 5 2.1-9.5 -7.2-6.5 9.6-1z" fill="#fff"/></svg>',
    "chat":  '<svg viewBox="0 0 64 64"><path d="M10 12 h44 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 H26 l-12 10 v-10 h-4 a6 6 0 0 1 -6 -6 V18 a6 6 0 0 1 6 -6z" fill="#fff"/><circle cx="21" cy="30" r="4" fill="#15803d"/><circle cx="32" cy="30" r="4" fill="#15803d"/><circle cx="43" cy="30" r="4" fill="#15803d"/></svg>',
    "chart": '<svg viewBox="0 0 64 64"><rect x="8" y="34" width="12" height="22" fill="#fff"/><rect x="26" y="22" width="12" height="34" fill="#fff"/><rect x="44" y="8" width="12" height="48" fill="#fff"/></svg>',
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1254px;height:1254px;background:#fff;font-family:'Inter','Segoe UI',Arial,sans-serif;color:#111;
     padding:40px 36px 34px;position:relative;display:flex;flex-direction:column}
.cond{font-family:'Oswald','Bahnschrift SemiBold Condensed','Arial Narrow',Impact,sans-serif;font-weight:700}
.page{position:absolute;top:34px;right:36px;width:66px;height:66px;border:3px solid #222;border-radius:50%;
      display:flex;align-items:center;justify-content:center;font-size:34px}
h1{font-family:'Anton',Impact,sans-serif;font-weight:400;text-align:center;font-size:92px;line-height:1.05;letter-spacing:-1px;padding:0 84px;text-wrap:balance}
h1 em{font-style:normal;color:#dc2626}
.rule{width:720px;height:3px;background:#222;margin:20px auto 0;position:relative}
.rule span{position:absolute;top:-8px;width:26px;height:18px;background:#fff;border:3px solid #222;border-radius:50%}
.stats{display:flex;gap:18px;margin-top:30px}
.stat{flex:1;border:3px solid;border-radius:10px;padding:18px 16px 18px 20px;display:flex;align-items:center;gap:10px;min-height:185px}
.stat .t{flex:1;align-self:stretch;display:flex;flex-direction:column;justify-content:flex-start}
.stat .l{font-family:'Oswald','Arial Narrow',sans-serif;font-weight:500;font-size:24px;letter-spacing:.3px;color:#222;text-transform:uppercase}
.stat .v{font-size:38px;line-height:1.02;margin-top:8px;text-transform:uppercase}
.stat svg{width:78px;height:78px;flex:none}
.red{border-color:#dc2626;background:#fef2f2}.red .v{color:#dc2626}
.green{border-color:#15803d;background:#f0fdf4}.green .v{color:#15803d}
.orange{border-color:#ea7a12;background:#fff7ed}.orange .v{color:#ea7a12}
.panel{margin-top:24px;flex:1;min-height:0;border-radius:14px;background:#f1f8f3;
       display:flex;align-items:center;justify-content:center;overflow:hidden}
.panel svg{width:100%;height:100%}
.box{margin-top:26px;display:flex;border-radius:14px;overflow:hidden;background:#e7f6ea;min-height:190px}
.box .tag{width:230px;flex:none;background:#15803d;color:#fff;display:flex;flex-direction:column;align-items:center;
          justify-content:center;gap:12px;padding:16px;text-align:center;font-size:44px;line-height:1.02}
.box .tag svg{width:108px;height:108px}
.box ul{list-style:none;padding:22px 30px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.box li{font-size:36px;line-height:1.28;padding-left:32px;position:relative;text-wrap:pretty}
.box li:before{content:'';position:absolute;left:0;top:calc(.64em - 7px);width:15px;height:15px;border-radius:50%;background:#15803d}
.box .lead{font-size:52px;color:#15803d;line-height:1.05}
"""

HEAD = ('<!doctype html><html><head><meta charset="utf-8">'
        '<link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;700&family=Inter:wght@400;600&display=block" rel="stylesheet">'
        f'<style>{CSS}</style></head><body>')


def stat(cls, label, value, icon, color):
    return (f'<div class="stat {cls}"><div class="t"><div class="l">{label}:</div>'
            f'<div class="v cond">{value}</div></div>{ICONS[icon].format(c=color)}</div>')


def retrace_chart():
    # market cap in $M at the four stated points; x = days from Sept 16
    pts = [(0, 2.05, "SEPT 16"), (7, 3.6, "SEPT 23"), (11, 6.1, "SEPT 27"), (14, 4.5, "SEPT 30")]
    W, H, L, R, T, B = 1180, 520, 150, 90, 50, 80
    def X(d): return L + d / 14 * (W - L - R)
    def Y(v): return T + (1 - v / 7) * (H - T - B)
    g = []
    for v in range(0, 8):
        y = Y(v)
        g.append(f'<line x1="{L}" y1="{y:.0f}" x2="{W-R}" y2="{y:.0f}" stroke="#e3e9e5" stroke-width="2"/>'
                 f'<text x="{L-16}" y="{y+9:.0f}" text-anchor="end" font-size="30" fill="#555">${v}M</text>')
    for d, v, lab in pts:
        anc = "end" if d == 14 else ("start" if d == 0 else "middle")
        xx = X(d) + (14 if d == 14 else (-14 if d == 0 else 0))
        g.append(f'<text x="{xx:.0f}" y="{H-B+44}" text-anchor="{anc}" font-size="30" fill="#555">{lab}</text>')
    g.append(f'<text x="44" y="{(T+H-B)/2:.0f}" transform="rotate(-90 44 {(T+H-B)/2:.0f})" text-anchor="middle" '
             f'font-size="30" fill="#444">Market Cap (USD)</text>')
    line = " ".join(f"{X(d):.1f},{Y(v):.1f}" for d, v, _ in pts)
    area = f"{X(0):.1f},{Y(0):.1f} " + line + f" {X(14):.1f},{Y(0):.1f}"
    g.append(f'<polygon points="{area}" fill="#15803d" fill-opacity=".10"/>')
    g.append(f'<polyline points="{line}" fill="none" stroke="#15803d" stroke-width="7" stroke-linejoin="round"/>')
    callouts = {0: ("TWO WEEKS AGO", "$2.05M", "start"), 1: ("A WEEK AGO", "$3.6M", "end"),
                2: ("ATH, SEPT 27", "$6.1M", "middle"), 3: ("NOW", "$4.5M", "end")}
    for i, (d, v, _) in enumerate(pts):
        x, y = X(d), Y(v)
        col = RED if i == 2 else GREEN
        g.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="12" fill="#fff" stroke="{col}" stroke-width="6"/>')
        a, b, anchor = callouts[i]
        dx = 18 if anchor == "start" else (-18 if anchor == "end" else 0)
        if i in (0, 3):
            y += 100
        if i == 0:
            dx = 24
        g.append(f'<text x="{x+dx:.0f}" y="{y-62:.0f}" text-anchor="{anchor}" font-size="27" font-weight="600" fill="#333" stroke="#f1f8f3" stroke-width="10" paint-order="stroke">{a}</text>'
                 f'<text x="{x+dx:.0f}" y="{y-20:.0f}" text-anchor="{anchor}" class="cond" font-size="42" fill="{col}" stroke="#f1f8f3" stroke-width="10" paint-order="stroke">{b}</text>')
    return f'<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">{"".join(g)}</svg>'


def ladder():
    import math
    W, H, L, R = 1180, 350, 90, 90
    lo, hi = math.log10(1), math.log10(300)
    def X(m): return L + (math.log10(m) - lo) / (hi - lo) * (W - L - R)
    ty = 150
    g = [f'<rect x="{L}" y="{ty-20}" width="{W-L-R}" height="40" rx="20" fill="#dde7e0"/>']
    zones = [(1, 10, RED, "A", "UNDER $10M"), (20, 30, GREEN, "B", "$20M TO $30M"), (100, 300, ORANGE, "C", "$100M OR MORE")]
    for a, b, col, k, lab in zones:
        x1, x2 = X(a), X(b)
        g.append(f'<rect x="{x1:.0f}" y="{ty-20}" width="{x2-x1:.0f}" height="40" rx="20" fill="{col}"/>')
        cx = (x1 + x2) / 2
        g.append(f'<text x="{cx:.0f}" y="{ty-42}" text-anchor="middle" class="cond" font-size="72" fill="{col}">{k}</text>')
    for m, lab in [(1, "$1M"), (10, "$10M"), (20, "$20M"), (30, "$30M"), (100, "$100M")]:
        x = X(m)
        g.append(f'<line x1="{x:.0f}" y1="{ty+24}" x2="{x:.0f}" y2="{ty+40}" stroke="#777" stroke-width="3"/>'
                 f'<text x="{x:.0f}" y="{ty+70}" text-anchor="middle" font-size="24" fill="#666">{lab}</text>')
    nx = X(4.5)
    g.append(f'<path d="M{nx:.0f} {ty+86} l-22 40 h44 z" fill="{GOLD}"/>'
             f'<text x="{nx:.0f}" y="{ty+166}" text-anchor="middle" class="cond" font-size="40" fill="#b07d00">NOW: $4.5M</text>')
    g.append(f'<text x="{W-R}" y="{H-10}" text-anchor="end" font-size="24" fill="#444">MARKET CAP (USD), LOG SCALE</text>')
    return f'<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">{"".join(g)}</svg>'


SLIDES = {
    "yt-posts-46dafdfb-02-the-retrace.png": HEAD + f"""
<div class="page cond">2</div>
<h1 style="font-size:78px;letter-spacing:-2px;padding:0 70px">The retrace: <em>$GOLDEN</em> this week</h1><div class="rule"><span style="left:314px"></span><span style="left:336px"></span><span style="left:358px"></span><span style="left:380px"></span></div>
<div class="stats">
 {stat('red', 'All-time high', 'Sept 27,<br>just over $6M', 'alert', RED)}
 {stat('green', 'Now', 'About $4.5M,<br>26% off top', 'bars', GREEN)}
 {stat('orange', '7-day move', 'Still about<br>+25%', 'star', ORANGE)}
</div>
<div class="panel">{retrace_chart()}</div>
<div class="box"><div class="tag cond">{ICONS['chart']}THE READ</div><ul>
 <li>Up about 120% over two weeks while the rest of the Robinhood Chain board bleeds.</li>
 <li>I called for a retracement and I got it. Loading, not leaving. Never financial advice.</li>
</ul></div></body></html>""",
    "yt-posts-4ff05bc7-05-question.png": HEAD + f"""
<div class="page cond">5</div>
<h1>Where does <em>$GOLDEN</em> top out this cycle?</h1><div class="rule"><span style="left:314px"></span><span style="left:336px"></span><span style="left:358px"></span><span style="left:380px"></span></div>
<div class="stats">
 {stat('red', 'A', 'Under $10M', 'alert', RED)}
 {stat('green', 'B', '$20M<br>to $30M', 'bars', GREEN)}
 {stat('orange', 'C', '$100M<br>or more', 'star', ORANGE)}
</div>
<div class="panel">{ladder()}</div>
<div class="box" style="min-height:250px"><div class="tag cond">{ICONS['chat']}YOUR CALL</div><ul>
 <li>Bet right now: which one, and why?</li>
 <li>Some take a week to do it, some take two years.</li>
</ul></div></body></html>""",
}

outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
outdir.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1254, "height": 1254}, device_scale_factor=1)
    for name, html in SLIDES.items():
        assert "—" not in html and "–" not in html, f"em/en dash in {name}"
        page.set_content(html, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(400)
        out = outdir / name
        page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1254, "height": 1254})
        print("rendered", out, out.stat().st_size, "bytes")
    b.close()
