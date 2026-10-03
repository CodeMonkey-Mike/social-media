# Code-rendered V4 slides for batch archie-promo (visual-QA repair, 2026-09-23).
# Adapted from repurpose/output/kaspa-lane3-fix/render_v4_slide.py (SKILL.md 2026-09-10 rule:
# V4 data slides that carry specific numbers are code-rendered, never ChatGPT).
# Changes vs the kaspa script: every piece of text sits inside an 8% (100px) margin, stat-box icons
# match the figure's meaning, the centre panel is a hand-drawn SVG chart that plots ONLY figures
# from the lane-3 plan (schematic, no invented price history, no future dates), and a question
# slide variant (answer cards carry the text, no empty panels).
# Usage: python render_v4_archie.py <outdir>   -> 1254x1254 PNGs named exactly as the queue expects.
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

W = 1254
M = 100  # 8% of 1254 = 100.3px

GREEN, RED, ORANGE, GREY = "#1a8f3a", "#d6211f", "#e07a12", "#8a8f8c"

ICONS = {  # white glyphs on a coloured circle, 24x24 viewBox
  "up":    '<path d="M12 4l7 8h-4.5v8h-5v-8H5z" fill="#fff"/>',
  "down":  '<path d="M12 20l-7-8h4.5V4h5v8H19z" fill="#fff"/>',
  "bars":  '<rect x="4" y="12" width="4" height="8" rx="1" fill="#fff"/><rect x="10" y="7" width="4" height="13" rx="1" fill="#fff"/><rect x="16" y="3" width="4" height="17" rx="1" fill="#fff"/>',
  "clock": '<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M12 7v5.5l3.5 2.2" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>',
  "peak":  '<path d="M3 19l6-9 4 5 3-4 5 8z" fill="#fff"/>',
  "warn":  '<path d="M12 3l10 18H2z" fill="#fff"/><rect x="11" y="9" width="2.2" height="6.5" fill="{c}"/><rect x="11" y="17" width="2.2" height="2.2" fill="{c}"/>',
  "chat":  '<path d="M4 5h16v10H10l-5 4v-4H4z" fill="#fff"/>',
}

def icon(name, color, size=56):
    g = ICONS[name].replace("{c}", color)
    return f'<svg class="ic" width="{size}" height="{size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="{color}"/><g transform="translate(3.6 3.6) scale(0.7)">{g}</g></svg>'

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:{W}px;height:{W}px;background:#fff;font-family:'Segoe UI',Inter,Arial,sans-serif;color:#111;padding:{M}px;position:relative;overflow:hidden}}
.page{{position:absolute;top:{M}px;right:{M}px;width:58px;height:58px;border:3px solid #222;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700}}
h1{{font-size:56px;font-weight:800;letter-spacing:-1px;text-align:center;line-height:1.08;padding:8px 78px 0}}
h1 em{{font-style:normal}}
.rule{{width:560px;height:3px;background:#222;margin:20px auto 0;position:relative}}
.rule:after{{content:'';position:absolute;left:50%;top:-9px;width:70px;height:20px;margin-left:-35px;background:#fff;border:3px solid #222;border-radius:20px}}
.stats{{display:flex;gap:20px;margin-top:30px}}
.stat{{flex:1;min-width:0;border:3px solid var(--c);border-radius:14px;padding:14px 18px;background:var(--bg);height:166px;display:flex;flex-direction:column}}
.stat .top{{display:flex;align-items:center;justify-content:space-between;gap:8px}}
.stat .l{{font-size:20px;font-weight:700;letter-spacing:.5px;color:#222}}
.stat .ic{{flex:none;width:42px;height:42px}}
.stat .v{{font-weight:800;color:var(--c);line-height:1.08;margin-top:4px;flex:1;min-height:0;display:flex;align-items:center}}
.panel{{margin-top:26px;border:3px solid #dfe5e2;border-radius:16px;background:#fafcfb;position:relative;overflow:hidden}}
.box{{margin-top:26px;display:flex;border-radius:16px;overflow:hidden;background:var(--bg)}}
.box .tag{{width:190px;flex:none;background:var(--c);color:#fff;font-weight:800;font-size:25px;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;text-align:center;padding:16px;letter-spacing:1px;line-height:1.1}}
.box ul{{list-style:none;padding:22px 28px;display:flex;flex-direction:column;justify-content:center;gap:14px}}
.box li{{font-size:var(--fs,27px);line-height:1.28;color:#111;padding-left:28px;position:relative}}
.box li:before{{content:'';position:absolute;left:0;top:13px;width:13px;height:13px;border-radius:50%;background:var(--c)}}
.box li b{{font-weight:700}}
.cards{{display:flex;gap:20px;margin-top:30px}}
.card{{flex:1;min-width:0;border:4px solid var(--c);border-radius:18px;background:var(--bg);padding:30px 22px;display:flex;flex-direction:column;align-items:center;gap:22px;height:530px}}
.card .letter{{width:110px;height:110px;border-radius:50%;background:var(--c);color:#fff;font-size:70px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}}
.card .t{{font-size:44px;font-weight:800;color:var(--c);text-align:center;line-height:1.1;flex:1;display:flex;align-items:center}}
.cta{{margin-top:28px;text-align:center;font-size:44px;font-weight:800;letter-spacing:.5px}}
"""

FIT_JS = """
() => {
  // shrink each stat value until it fits its box on at most 2 lines, without breaking a word
  for (const el of document.querySelectorAll('[data-fit]')) {
    let fs = parseFloat(el.dataset.fit);
    const sp = el.firstElementChild;
    el.style.fontSize = fs + 'px';
    const maxH = el.clientHeight;
    const fits = () => sp.getBoundingClientRect().height <= maxH && sp.scrollWidth <= el.clientWidth && el.scrollWidth <= el.clientWidth + 1;
    while (!fits() && fs > 18) { fs -= 1; el.style.fontSize = fs + 'px'; }
  }
  // report every text node's bounding box for the 8% margin check
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) out.push([n.textContent.trim().slice(0, 40), b.left, b.top, b.right, b.bottom]);
  }
  for (const t of document.querySelectorAll('svg text')) {
    const b = t.getBoundingClientRect(); out.push([t.textContent, b.left, b.top, b.right, b.bottom]);
  }
  // overflow check for stat values and card text
  const ov = [];
  for (const el of document.querySelectorAll('[data-fit], .card .t, .box li, h1')) {
    if (el.scrollWidth > el.clientWidth + 1) ov.push(el.textContent);
  }
  return {boxes: out, overflow: ov};
}
"""

def stats_html(stats):
    s = ""
    for label, value, color, ic in stats:
        bg = {GREEN: "#f4faf6", RED: "#fdf3f3", ORANGE: "#fff8f1"}[color]
        s += (f'<div class="stat" style="--c:{color};--bg:{bg}"><div class="top"><div class="l">{label}</div>{icon(ic, color)}</div>'
              f'<div class="v" data-fit="52" data-maxh="80"><span>{value}</span></div></div>')
    return f'<div class="stats">{s}</div>'

def box_html(label, bullets, color, ic):
    bg = {GREEN: "#e9f7ec", RED: "#fbe9e9"}[color]
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    return (f'<div class="box" style="--c:{color};--bg:{bg}"><div class="tag">{icon(ic, "rgba(255,255,255,0.22)", 54)}<div>{label}</div></div>'
            f'<ul>{lis}</ul></div>')

# ---------------------------------------------------------------- chart 1: BTC vs 50-week SMA
def chart_btc(pw, ph):
    # SCHEMATIC. The only figures used are the plan's: close $81,159 at Sept 20 vs a ~$78,800 SMA,
    # below it for 45 weeks (since Nov 9, 2025 per the plan's fact_check). No y-axis price values,
    # no invented price history: a smooth illustrative path, data ends AT Sept 20.
    L, R, T, B = 70, pw - 60, 40, ph - 70
    sma_y = T + (B - T) * 0.36
    # x positions: a short run above the line, crossing below at x_cross, breakout at x_end
    x0, x_cross, x_end = L, L + (R - L) * 0.16, R - 10
    import math
    pts = []
    N = 160
    for i in range(N + 1):
        t = i / N
        x = x0 + (x_end - x0) * t
        u = (x - x_cross) / (x_end - x_cross)  # 0 at the cross-down, 1 at the breakout
        if x <= x_cross:
            v = 0.10 * (x_cross - x) / (x_cross - x0) + 0.012 * math.sin(t * 60)
        else:
            # below the SMA the whole span: dip then recover, touching up through the line at u=1
            v = -0.30 * math.sin(math.pi * min(u, 1) ** 0.85) - 0.06 * math.sin(math.pi * u) * (1 - u) \
                + 0.018 * math.sin(u * 23) * math.sin(math.pi * u)
            if u > 0.93:  # the final push through the line (close ~3% above the SMA)
                v = v + (u - 0.93) / 0.07 * 0.03
        y = sma_y - v * (B - T)
        pts.append((x, y))
    # force the last point to sit just above the SMA (81,159 vs 78,800)
    pts[-1] = (x_end, sma_y - 0.03 * (B - T))
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    area = d + f" L{x_end:.1f},{B} L{x0:.1f},{B} Z"
    ex, ey = pts[-1]
    return f'''<svg width="{pw}" height="{ph}" viewBox="0 0 {pw} {ph}">
  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GREEN}" stop-opacity=".16"/><stop offset="1" stop-color="{GREEN}" stop-opacity="0"/></linearGradient></defs>
  <line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="#555" stroke-width="2"/>
  <line x1="{L}" y1="{T-10}" x2="{L}" y2="{B}" stroke="#555" stroke-width="2"/>
  <text x="{L-22}" y="{(T+B)/2}" transform="rotate(-90 {L-22} {(T+B)/2})" text-anchor="middle" font-size="20" font-weight="700" fill="#555" letter-spacing="1">BTC PRICE</text>
  <path d="{area}" fill="url(#g1)"/>
  <line x1="{L}" y1="{sma_y:.1f}" x2="{R}" y2="{sma_y:.1f}" stroke="{GREY}" stroke-width="4" stroke-dasharray="14 10"/>
  <text x="{(L+R)/2:.1f}" y="{sma_y-16:.1f}" text-anchor="middle" font-size="22" font-weight="700" fill="#666">50-WEEK SMA</text>
  <path d="{d}" fill="none" stroke="{GREEN}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <line x1="{x_cross:.1f}" y1="{sma_y+34:.1f}" x2="{x_end:.1f}" y2="{sma_y+34:.1f}" stroke="none"/>
  <g stroke="{ORANGE}" stroke-width="3" fill="none">
    <path d="M{x_cross+6:.1f},{B-62} v-14 M{x_cross+6:.1f},{B-62} H{x_end-6:.1f} v-14"/>
  </g>
  <text x="{(x_cross+x_end)/2:.1f}" y="{B-26}" text-anchor="middle" font-size="23" font-weight="800" fill="{ORANGE}">45 WEEKS BELOW</text>
  <circle cx="{ex:.1f}" cy="{ey:.1f}" r="11" fill="{GREEN}" stroke="#fff" stroke-width="4"/>
  <rect x="{ex-118:.1f}" y="{ey-92:.1f}" width="112" height="42" rx="8" fill="{GREEN}"/>
  <text x="{ex-62:.1f}" y="{ey-63:.1f}" text-anchor="middle" font-size="23" font-weight="800" fill="#fff">SEPT 20</text>
  <path d="M{ex-40:.1f},{ey-48:.1f} L{ex-12:.1f},{ey-16:.1f}" stroke="{GREEN}" stroke-width="3"/>
  <text x="{x_cross:.1f}" y="{B+34}" text-anchor="middle" font-size="21" font-weight="600" fill="#444">NOV 2025</text>
  <line x1="{x_cross:.1f}" y1="{B}" x2="{x_cross:.1f}" y2="{B+8}" stroke="#555" stroke-width="2"/>
  <text x="{x_end:.1f}" y="{B+34}" text-anchor="end" font-size="21" font-weight="600" fill="#444">SEPT 20, 2026</text>
  <line x1="{x_end:.1f}" y1="{B}" x2="{x_end:.1f}" y2="{B+8}" stroke="#555" stroke-width="2"/>
  <line x1="{x_cross:.1f}" y1="{sma_y:.1f}" x2="{x_cross:.1f}" y2="{B}" stroke="#bbb" stroke-width="1.5" stroke-dasharray="4 5"/>
</svg>'''

# ---------------------------------------------------------------- chart 2: $IF market cap
def chart_if(pw, ph):
    # Market cap in $M by day (Aug 1 = day 0). ONLY the plan's figures anchor the line:
    # Aug 2 top ~24, higher daily lows through Sept (Sept 3 / 10 / 17 lows from the fact_check,
    # x ~905M supply: ~6.2 / ~7.0 / ~8.7), ~9.4 close Sept 17, -77% on Sept 18 (~2.1),
    # under 0.6 on Sept 23. Between anchors the path is a plain schematic interpolation.
    import datetime as dt
    d0 = dt.date(2026, 8, 1)
    day = lambda m, dd: (dt.date(2026, m, dd) - d0).days
    anchors = [(day(8,2), 24.0), (day(8,6), 19.5), (day(8,12), 16.0), (day(8,19), 12.5),
               (day(8,26), 9.5), (day(9,3), 6.3), (day(9,6), 8.0), (day(9,10), 7.1), (day(9,13), 8.8),
               (day(9,15), 8.4), (day(9,17), 9.4)]
    last = day(9, 23)
    L, R, T, B = 80, pw - 50, 60, ph - 70
    ymax = 26.0
    X = lambda dd: L + (R - L) * dd / last
    Y = lambda v: B - (B - T) * v / ymax
    # smooth-ish path through anchors (monotone cubic keeps it honest between points)
    import math
    xs = [a[0] for a in anchors]; ys = [a[1] for a in anchors]
    pts = []
    for i in range(len(anchors) - 1):
        for k in range(12):
            t = k / 12
            s = (1 - math.cos(math.pi * t)) / 2
            pts.append((xs[i] + (xs[i+1] - xs[i]) * t, ys[i] + (ys[i+1] - ys[i]) * s))
    pts.append((xs[-1], ys[-1]))
    cliff_x = day(9, 18)
    pts.append((cliff_x, 9.4))          # Sept 18 opens where Sept 17 closed
    pts.append((cliff_x, 2.15))         # -77% on the day
    pts += [(day(9,19), 1.6), (day(9,20), 1.25), (day(9,21), 0.95), (day(9,22), 0.74), (last, 0.59)]
    d = "M" + " L".join(f"{X(a):.1f},{Y(b):.1f}" for a, b in pts)
    area = d + f" L{X(last):.1f},{B} L{X(pts[0][0]):.1f},{B} Z"
    ticks = [("AUG 1", day(8,1), "start"), ("AUG 15", day(8,15), "middle"), ("SEPT 1", day(9,1), "middle"),
             ("SEPT 23", last, "end")]
    tick_svg = "".join(
        f'<line x1="{X(dd):.1f}" y1="{B}" x2="{X(dd):.1f}" y2="{B+8}" stroke="#555" stroke-width="2"/>'
        f'<line x1="{X(dd):.1f}" y1="{T-10}" x2="{X(dd):.1f}" y2="{B}" stroke="#e6e9e8" stroke-width="1.5"/>'
        f'<text x="{X(dd):.1f}" y="{B+34}" text-anchor="{a}" font-size="21" font-weight="600" fill="#444">{t}</text>'
        for t, dd, a in ticks)
    tx, ty = X(day(8,2)), Y(24.0)
    cx, cy = X(cliff_x), Y(9.4)
    ex, ey = X(last), Y(0.59)
    return f'''<svg width="{pw}" height="{ph}" viewBox="0 0 {pw} {ph}">
  <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{RED}" stop-opacity=".16"/><stop offset="1" stop-color="{RED}" stop-opacity="0"/></linearGradient></defs>
  {tick_svg}
  <line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="#555" stroke-width="2"/>
  <line x1="{L}" y1="{T-10}" x2="{L}" y2="{B}" stroke="#555" stroke-width="2"/>
  <text x="{L-24}" y="{(T+B)/2}" transform="rotate(-90 {L-24} {(T+B)/2})" text-anchor="middle" font-size="20" font-weight="700" fill="#555" letter-spacing="1">$IF MARKET CAP</text>
  <path d="{area}" fill="url(#g2)"/>
  <path d="{d}" fill="none" stroke="{RED}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="{tx:.1f}" cy="{ty:.1f}" r="10" fill="{RED}" stroke="#fff" stroke-width="3"/>
  <rect x="{tx+22:.1f}" y="{ty-24:.1f}" width="210" height="42" rx="8" fill="{RED}"/>
  <text x="{tx+127:.1f}" y="{ty+5:.1f}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">AUG 2: ~$24M</text>
  <circle cx="{cx:.1f}" cy="{cy:.1f}" r="10" fill="{RED}" stroke="#fff" stroke-width="3"/>
  <rect x="{cx-120:.1f}" y="{cy-92:.1f}" width="124" height="42" rx="8" fill="{RED}"/>
  <text x="{cx-58:.1f}" y="{cy-63:.1f}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">SEPT 18</text>
  <path d="M{cx-30:.1f},{cy-48:.1f} L{cx-8:.1f},{cy-12:.1f}" stroke="{RED}" stroke-width="3"/>
  <text x="{cx-14:.1f}" y="{Y(4.6):.1f}" text-anchor="end" font-size="26" font-weight="800" fill="{RED}">-77%</text>
  <circle cx="{ex:.1f}" cy="{ey:.1f}" r="9" fill="{RED}" stroke="#fff" stroke-width="3"/>
  <text x="{ex+6:.1f}" y="{Y(6.4):.1f}" text-anchor="end" font-size="20" font-weight="800" fill="{RED}">UNDER</text>
  <text x="{ex+6:.1f}" y="{Y(4.9):.1f}" text-anchor="end" font-size="20" font-weight="800" fill="{RED}">$600K</text>
</svg>'''


# ---------------------------------------------------------------- panel: three-node flow (HTML)
def flow_nodes(labels):
    def panel(pw, ph):
        arrow = (f'<svg width="64" height="48" viewBox="0 0 64 48" style="flex:none">'
                 f'<path d="M4 16h32V4l24 20-24 20V32H4z" fill="{GREEN}"/></svg>')
        nodes = arrow.join(
            f'<div style="flex:1;min-width:0;height:{int(ph*0.62)}px;border:4px solid {GREEN};border-radius:22px;background:#fff;'
            f'display:flex;align-items:center;justify-content:center;text-align:center;padding:14px 16px;'
            f'font-size:35px;font-weight:800;line-height:1.12;color:{GREEN}"><div>{t}</div></div>' for t in labels)
        return (f'<div style="width:{pw}px;height:{ph}px;display:flex;align-items:center;gap:14px;padding:0 34px">'
                f'{nodes}</div>')
    return panel

def data_slide(spec):
    pw, ph = W - 2 * M - 6, spec.get('ph', 500)
    chart = spec["chart"](pw, ph)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="page">{spec['page']}</div>
<h1>{spec['title']}</h1><div class="rule"></div>
{stats_html(spec['stats'])}
<div class="panel" style="height:{ph+6}px">{chart}</div>
{box_html(spec['box_label'], spec['bullets'], spec['box_color'], spec['box_icon'])}
</body></html>"""

def question_slide(spec):
    cards = ""
    for letter, text, color in spec["options"]:
        bg = {GREEN: "#f4faf6", RED: "#fdf3f3", ORANGE: "#fff8f1"}[color]
        cards += f'<div class="card" style="--c:{color};--bg:{bg}"><div class="letter">{letter}</div><div class="t">{text}</div></div>'
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="page">{spec['page']}</div>
<h1>{spec['title']}</h1><div class="rule"></div>
<div class="cards">{cards}</div>
<div class="cta">Comment <span style="color:{RED}">A</span>, <span style="color:{GREEN}">B</span> or <span style="color:{ORANGE}">C</span></div>
<div style="--fs:{spec['fs']}px">{box_html(spec['box_label'], spec['bullets'], GREEN, 'chat')}</div>
</body></html>"""

SPECS = [
  {"out": "yt-posts-87022d56-02-the-timing.png", "page": 2, "kind": "data", "chart": chart_btc,
   "title": f'The timing: <em style="color:{GREEN}">Friday, Sept 18, 2026</em>',
   "stats": [("BTC WEEKLY CLOSE:", "$81,159", GREEN, "up"),
             ("50-WEEK SMA:", "ABOUT $78,800", GREEN, "bars"),
             ("WEEKS BELOW IT:", "45", ORANGE, "clock")],
   "box_label": "WHAT HAPPENED", "box_color": GREEN, "box_icon": "bars",
   "bullets": ["<b>Friday Sept 18:</b> Archie put out a sell alert on his own $IF bag, the day the breakout was holding.",
               "Two weeks before October, with the four-year cycle zombies about to buy back in."]},
  {"out": "yt-posts-920b3df9-03-the-damage.png", "page": 3, "kind": "data", "chart": chart_if, "ph": 540,
   "title": f'The damage to <em style="color:{RED}">$IF</em>',
   "stats": [("AUG 2 TOP:", "ABOUT $24M CAP", ORANGE, "peak"),
             ("SEPT 18:", "DOWN 77% IN ONE DAY", RED, "down"),
             ("NOW:", "UNDER $600K, 98% OFF THE HIGH", RED, "warn")],
   "box_label": "THE READ", "box_color": RED, "box_icon": "warn",
   "bullets": ["It was holding higher lows since early September, about a $9M cap on Sept 17.",
               "Then the loudest voice behind it hit sell on his own bag."]},
  {"out": "yt-posts-96552efc-04-the-zombies.png", "page": 4, "kind": "data", "ph": 430,
   "chart": flow_nodes(["SOLD THE WHOLE WAY DOWN", "BOTTOM ALREADY IN", "<span style=\"white-space:nowrap\">FRONT-RUN</span> OCTOBER"]),
   "title": f'The piece Cowen and Archie<br>both <em style="color:{RED}">missed</em>',
   "stats": [("COWEN, SEPT 8:", "65% ODDS OF NEW LOWS", RED, "down"),
             ("COWEN, SEPT 21:", "I WAS WRONG", ORANGE, "chat"),
             ("ZOMBIES BUY BACK:", "OCTOBER", GREEN, "up")],
   "box_label": "THE READ", "box_color": GREEN, "box_icon": "bars",
   "bullets": ["Almost the entire market believed in a four-year cycle bear, so they caused one.",
               "Now they are waking up early. Everybody and their grandma buys in October."]},
  {"out": "yt-posts-a87f1fc2-05-question.png", "page": 5, "kind": "question",
   "title": "Did Archie just not think,<br>or am I missing something?",
   "options": [("A", "HE JUST DID NOT THINK", RED), ("B", "THERE IS A REASON I AM MISSING", GREEN),
               ("C", "$IF IS DONE EITHER WAY", ORANGE)],
   "box_label": "TELL ME<br>IN THE<br>COMMENTS",
   "fs": 32, "bullets": ["Do the zombies buying back in October put a bid under the Robinhood Chain memes?"]},
]

if __name__ == "__main__":
    outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    only = sys.argv[2:]  # optional image_id filter
    outdir.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={"width": W, "height": W}, device_scale_factor=1)
        for spec in SPECS:
            if only and not any(o in spec["out"] for o in only):
                continue
            doc = data_slide(spec) if spec["kind"] == "data" else question_slide(spec)
            assert "—" not in doc and "–" not in doc, "em/en dash in slide"
            page.set_content(doc)
            page.wait_for_timeout(300)
            rep = page.evaluate(FIT_JS)
            bad = [bx for bx in rep["boxes"] if bx[1] < M - 0.5 or bx[2] < M - 0.5 or bx[3] > W - M + 0.5 or bx[4] > W - M + 0.5]
            out = outdir / spec["out"]
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": W, "height": W})
            print("rendered", out, "| margin violations:", bad or "none", "| overflow:", rep["overflow"] or "none")
        b.close()
