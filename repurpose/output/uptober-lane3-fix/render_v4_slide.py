# uptober Lane 3 fix (2026-10-01): copy of golden-kitty-dominance-lane3-fix/render_v4_slide.py
# (itself a copy of kaspa-lane3-fix/render_v4_slide.py) + four panel kinds for this carousel:
#   pairs   - slide 2: expected vs actual bar pairs, EACH PAIR ON ITS OWN SCALE (QA FAIL: jobs in
#             thousands and inflation/GDP in percent shared one unlabeled 0-100 axis)
#   odds    - slide 3: the Oct 28 hike odds, 70 -> 50 -> 35 on a true 0-100% axis (fact_check:
#             FedWatch 70.9% hike a week ago, an even split the day before, 34.9% hike after the data)
#   candles - slide 4: a SCHEMATIC candlestick, no price axis numbers, no month labels (QA FAIL:
#             ChatGPT invented a $60K-$140K axis, a $100K May high and late-October candles; the
#             fact-check has BTC ~$83,444 and the copy never quotes the level)
#   choices - slide 5: the three answers as large cards, no empty panels (QA FAIL: artifact + empty panels)
# Code-rendered V4 DATA slides per repurpose/SKILL.md Version 4 (2026-09-10 rule): HTML in the V4
# look -> 1254x1254 PNG via Playwright, exact plan text, page number top-right, no em dashes.
# Slides 2-5 are rendered together so the set is consistent; the ChatGPT hook (slide 1) is kept.
# Usage: python render_v4_slide.py <outdir>
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

GREEN, RED, ORANGE, GREY = "#1a8f3a", "#c62828", "#e07a12", "#8a8f8c"

SPECS = {
  "b5b3921c": {
    "out": "yt-posts-b5b3921c-02-the-data-sweep.png", "page": 2,
    "title": "The data sweep: <em>Sept 30</em>",
    "stats": [("ADP JOBS", "+90K", "VS 73K EXPECTED"), ("PCE INFLATION", "3.4%", "VS 3.7% EXPECTED"),
              ("Q2 GDP FINAL", "2.2%", "VS 1.5% EXPECTED")],
    "stat_colors": ["green", "green", "green"],
    "panel_kind": "pairs",
    # (group label, expected value, expected label, actual value, actual label)
    "pairs": [("JOBS", 73, "73K", 90, "+90K"), ("INFLATION", 3.7, "3.7%", 3.4, "3.4%"),
              ("GDP", 1.5, "1.5%", 2.2, "2.2%")],
    "panel_caption": "Each pair is drawn on its own scale.",
    "box_label": "THE READ",
    "bullets": ["Employment, inflation and growth all came in better than expected on the same day.",
                "ADP more than doubled the prior month's 38K."],
  },
  "0e865240": {
    "out": "yt-posts-0e865240-03-the-fed-odds.png", "page": 3,
    "title": "The Fed on <em>Oct 28</em>",
    "stats": [("ONE WEEK AGO", "ABOUT 70%", "ODDS OF A HIKE"), ("THE DAY BEFORE", "A COIN FLIP", ""),
              ("AFTER THE DATA", "ABOUT 65%", "NO HIKE")],
    "stat_colors": ["red", "grey", "green"],
    "panel_kind": "odds",
    "odds": [("ONE WEEK AGO", 70, "ABOUT 70%"), ("THE DAY BEFORE", 50, "ABOUT 50%"), ("AFTER THE DATA", 35, "ABOUT 35%")],
    "panel_caption": "",
    "box_label": "WHY IT MATTERS",
    "bullets": ["Cooler inflation took the pressure off another rate hike.",
                "More readings like this and crypto will be absolutely flying."],
  },
  "1bf955bd": {
    "out": "yt-posts-1bf955bd-04-bitcoin-holds-the-line.png", "page": 4,
    "title": "Bitcoin is holding <em>the line</em>",
    "stats": [("THE MAY HIGH", "OLD RESISTANCE, NOW SUPPORT", ""), ("BITCOIN DOMINANCE", "UNDER 60%", ""),
              ("OCTOBER", "GREEN IN 10 OF THE LAST 15 YEARS", "")],
    "stat_colors": ["green", "orange", "green"],
    "panel_kind": "candles",
    "panel_caption": "",
    "box_label": "THE SETUP",
    "bullets": ["The four-year cycle zombies all planned to buy an October bottom.",
                "Their own demand turns October green. The real low prints before it."],
  },
  "3941a622": {
    "out": "yt-posts-3941a622-05-question.png", "page": 5,
    "title": "Where does Bitcoin <em>close October?</em>",
    "panel_kind": "choices",
    "choices": [("A", "ABOVE $90K", "green"), ("B", "$80K TO $90K", "orange"), ("C", "BELOW $80K", "red")],
    "panel_caption": "",
    "box_label": "TELL ME<br>IN THE<br>COMMENTS",
    "bullets": ["Bet right now: which one, and does the Fed spoil it on Oct 28?"],
  },
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1254px;height:1254px;background:#fff;font-family:'Segoe UI',Inter,Arial,sans-serif;color:#111;padding:48px 52px 52px;position:relative;display:flex;flex-direction:column}
.page{position:absolute;top:34px;right:44px;width:60px;height:60px;border:3px solid #222;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700}
h1{font-size:64px;font-weight:800;letter-spacing:-1px;text-align:center;margin-top:14px;line-height:1.1;padding:0 80px}
h1 em{font-style:normal;color:#1a8f3a}
.rule{width:660px;height:3px;background:#222;margin:22px auto 0;position:relative}
.rule:after{content:'';position:absolute;left:50%;top:-9px;width:70px;height:20px;margin-left:-35px;background:#fff;border:3px solid #222;border-radius:20px}
.stats{display:flex;gap:22px;margin-top:34px}
.stat{flex:1;border:3px solid #1a8f3a;border-radius:14px;padding:18px 22px;background:#f7fbf8;min-height:170px}
.stat .l{font-size:22px;font-weight:700;letter-spacing:1px;color:#222}
.stat .v{font-size:56px;font-weight:800;line-height:1.05;margin-top:8px}
.stat .v.mid{font-size:46px;white-space:nowrap}
.stat .v.small{font-size:34px;line-height:1.12;margin-top:12px}
.stat .s{font-size:21px;margin-top:6px;font-weight:700;letter-spacing:.5px}
.stat.green{border-color:#1a8f3a;background:#f7fbf8}.stat.green .v,.stat.green .s{color:#1a8f3a}
.stat.red{border-color:#c62828;background:#fdf3f3}.stat.red .v,.stat.red .s{color:#c62828}
.stat.orange{border-color:#e07a12;background:#fff8f1}.stat.orange .v,.stat.orange .s{color:#e07a12}
.stat.grey{border-color:#5f6461;background:#f5f6f5}.stat.grey .v,.stat.grey .s{color:#222}
.panel{margin-top:30px;flex:1;padding:10px 0;border:3px solid #dfe5e2;border-radius:16px;background:#fafcfb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.cap{font-size:22px;color:#555;font-weight:600;text-align:center;padding:0 60px}
.choices{display:flex;gap:26px;margin-top:36px;flex:1}
.choice{flex:1;border:4px solid;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:20px}
.choice .letter{width:240px;height:240px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:150px;font-weight:900;color:#fff}
.choice .range{font-size:42px;white-space:nowrap;font-weight:800;text-align:center;line-height:1.1}
.choice.green{border-color:#1a8f3a;background:#f7fbf8}.choice.green .letter{background:#1a8f3a}.choice.green .range{color:#1a8f3a}
.choice.orange{border-color:#e07a12;background:#fff8f1}.choice.orange .letter{background:#e07a12}.choice.orange .range{color:#e07a12}
.choice.red{border-color:#c62828;background:#fdf3f3}.choice.red .letter{background:#c62828}.choice.red .range{color:#c62828}
.box{margin-top:30px;display:flex;border-radius:16px;overflow:hidden;background:#e9f7ec;min-height:190px}
.box .tag{width:220px;flex:none;background:#1a8f3a;color:#fff;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;letter-spacing:1px;line-height:1.25}
.box ul{list-style:none;padding:24px 34px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.box li{font-size:30px;line-height:1.3;color:#111;padding-left:30px;position:relative}
.box li:before{content:'';position:absolute;left:0;top:16px;width:14px;height:14px;border-radius:50%;background:#1a8f3a}
"""


def svg_pairs(pairs):
    # three independent mini charts, each pair scaled to its own max (bars start at zero)
    W, H, base, top = 1060, 430, 350, 120
    gw = W / 3
    out = []
    # legend
    out.append(f'<rect x="{W/2-190}" y="14" width="26" height="26" rx="4" fill="{GREY}"/>'
               f'<text x="{W/2-154}" y="36" font-size="24" font-weight="700" fill="#444">EXPECTED</text>'
               f'<rect x="{W/2+40}" y="14" width="26" height="26" rx="4" fill="{GREEN}"/>'
               f'<text x="{W/2+76}" y="36" font-size="24" font-weight="700" fill="#444">ACTUAL</text>')
    for i, (lab, ev, el, av, al) in enumerate(pairs):
        x0 = i * gw
        mx = max(ev, av)
        bw = 110
        for j, (v, vl, col) in enumerate([(ev, el, GREY), (av, al, GREEN)]):
            h = (base - top) * v / mx
            bx = x0 + gw / 2 - bw - 8 + j * (bw + 16)
            out.append(f'<rect x="{bx:.0f}" y="{base-h:.0f}" width="{bw}" height="{h:.0f}" rx="6" fill="{col}"/>')
            out.append(f'<text x="{bx+bw/2:.0f}" y="{base-h-12:.0f}" font-size="32" font-weight="800" '
                       f'fill="{"#444" if col == GREY else GREEN}" text-anchor="middle">{vl}</text>')
        out.append(f'<line x1="{x0+30:.0f}" y1="{base}" x2="{x0+gw-30:.0f}" y2="{base}" stroke="#222" stroke-width="3"/>')
        out.append(f'<text x="{x0+gw/2:.0f}" y="{base+44}" font-size="30" font-weight="800" fill="#222" text-anchor="middle">{lab}</text>')
        if i:
            out.append(f'<line x1="{x0:.0f}" y1="70" x2="{x0:.0f}" y2="{base+50}" stroke="#dfe5e2" stroke-width="3"/>')
    return f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(out)}</svg>'


def svg_odds(points):
    W, H = 1060, 420
    L, R, T, B = 150, 1000, 40, 340   # plot box
    y = lambda p: B - (B - T) * p / 100
    out = []
    for p in (0, 25, 50, 75, 100):
        out.append(f'<line x1="{L}" y1="{y(p):.0f}" x2="{R}" y2="{y(p):.0f}" stroke="#e3e8e5" stroke-width="2"/>')
        out.append(f'<text x="{L-14}" y="{y(p)+8:.0f}" font-size="22" font-weight="600" fill="#555" text-anchor="end">{p}%</text>')
    out.append(f'<line x1="{L}" y1="{T}" x2="{L}" y2="{B}" stroke="#222" stroke-width="3"/>'
               f'<line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="#222" stroke-width="3"/>')
    out.append(f'<text x="44" y="{(T+B)/2:.0f}" font-size="22" font-weight="700" fill="#444" '
               f'transform="rotate(-90 44 {(T+B)/2:.0f})" text-anchor="middle">ODDS OF A HIKE</text>')
    xs = [L + 130, (L + R) / 2, R - 130]
    pts = " ".join(f"{x:.0f},{y(p):.0f}" for x, (_, p, _) in zip(xs, points))
    out.append(f'<polyline points="{pts}" fill="none" stroke="{RED}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>')
    for x, (xl, p, pl) in zip(xs, points):
        out.append(f'<circle cx="{x:.0f}" cy="{y(p):.0f}" r="12" fill="{RED}"/>')
        out.append(f'<text x="{x:.0f}" y="{y(p)-26:.0f}" font-size="30" font-weight="800" fill="{RED}" text-anchor="middle">{pl}</text>')
        out.append(f'<text x="{x:.0f}" y="{B+42}" font-size="24" font-weight="700" fill="#333" text-anchor="middle">{xl}</text>')
    return f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(out)}</svg>'


# Schematic only: relative units, no price levels. Rises under the May high (one wick tags it
# from below as resistance), breaks out, then the lower wicks keep touching it from above
# without a single close below it. (open, close, high, low); the line sits at 60.
CANDLES = [
    (10, 16, 18, 8), (16, 22, 24, 14), (22, 19, 25, 17), (19, 27, 29, 18), (27, 33, 35, 25),
    (33, 30, 36, 28), (30, 38, 40, 29), (38, 44, 46, 36), (44, 41, 47, 39), (41, 49, 51, 40),
    (49, 54, 56, 47), (54, 51, 57, 49), (51, 57, 60, 50), (57, 53, 58, 51),
    (53, 67, 69, 52), (67, 74, 77, 65),
    (74, 67, 75, 60), (67, 72, 74, 60), (72, 69, 75, 64), (69, 65, 71, 60), (65, 72, 74, 60),
    (72, 76, 79, 70), (76, 70, 77, 60), (70, 75, 77, 61), (75, 80, 83, 73),
]


def svg_candles():
    W, H = 1060, 420
    L, R, T, B = 90, 1020, 20, 360
    y = lambda p: B - 10 - (B - T - 20) * p / 90
    n = len(CANDLES)
    step = (R - L - 40) / n
    out = [f'<line x1="{L}" y1="{T}" x2="{L}" y2="{B}" stroke="#222" stroke-width="3"/>'
           f'<line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="#222" stroke-width="3"/>'
           f'<text x="50" y="{(T+B)/2:.0f}" font-size="22" font-weight="700" fill="#444" '
           f'transform="rotate(-90 50 {(T+B)/2:.0f})" text-anchor="middle">PRICE</text>'
           f'<text x="{(L+R)/2:.0f}" y="{B+40}" font-size="22" font-weight="700" fill="#444" text-anchor="middle">TIME</text>']
    ly = y(60)
    out.append(f'<line x1="{L}" y1="{ly:.0f}" x2="{R}" y2="{ly:.0f}" stroke="{RED}" stroke-width="4" stroke-dasharray="16 10"/>')
    out.append(f'<text x="{L+24}" y="{ly-16:.0f}" font-size="30" font-weight="800" fill="{RED}">MAY HIGH</text>')
    for i, (o, c, h, l) in enumerate(CANDLES):
        assert l <= min(o, c) and h >= max(o, c)
        if i >= 16:
            assert min(o, c) > 60 and l >= 60      # after the breakout: never a close below the line
        cx = L + 30 + step * i + step / 2
        col = GREEN if c >= o else RED
        bw = step * 0.62
        out.append(f'<line x1="{cx:.1f}" y1="{y(h):.1f}" x2="{cx:.1f}" y2="{y(l):.1f}" stroke="{col}" stroke-width="3"/>')
        top, bot = y(max(o, c)), y(min(o, c))
        out.append(f'<rect x="{cx-bw/2:.1f}" y="{top:.1f}" width="{bw:.1f}" height="{max(4, bot-top):.1f}" rx="3" fill="{col}"/>')
    return f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(out)}</svg>'


def html(spec):
    kind = spec["panel_kind"]
    if kind == "choices":
        middle = '<div class="choices">' + "".join(
            f'<div class="choice {c}"><div class="letter">{k}</div><div class="range">{r}</div></div>'
            for k, r, c in spec["choices"]) + '</div>'
    else:
        stats = ""
        for i, (l, v, s) in enumerate(spec["stats"]):
            cls = "stat " + spec["stat_colors"][i]
            vcls = "v small" if len(v) > 11 else ("v mid" if len(v) > 8 else "v")
            stats += (f'<div class="{cls}"><div class="l">{l}:</div><div class="{vcls}">{v}</div>'
                      + (f'<div class="s">{s}</div>' if s else '') + '</div>')
        chart = {"pairs": lambda: svg_pairs(spec["pairs"]), "odds": lambda: svg_odds(spec["odds"]),
                 "candles": svg_candles}[kind]()
        cap = f'<div class="cap">{spec["panel_caption"]}</div>' if spec["panel_caption"] else ""
        middle = f'<div class="stats">{stats}</div><div class="panel">{chart}{cap}</div>'
    bullets = "".join(f"<li>{b}</li>" for b in spec["bullets"])
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="page">{spec['page']}</div>
<h1>{spec['title']}</h1><div class="rule"></div>
{middle}
<div class="box"><div class="tag">{spec['box_label']}</div><ul>{bullets}</ul></div>
</body></html>"""


outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
outdir.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1254, "height": 1254}, device_scale_factor=1)
    for iid, spec in SPECS.items():
        blob = json.dumps(spec, ensure_ascii=False)
        assert "—" not in blob and "–" not in blob, f"em/en dash in {iid}"
        page.set_content(html(spec))
        page.wait_for_timeout(300)
        # nothing may spill past the 1254 canvas (clipping guard)
        sh = page.evaluate("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
        sw = page.evaluate("Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)")
        out = outdir / spec["out"]
        page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1254, "height": 1254})
        print("rendered", out, out.stat().st_size, "bytes", f"content={sw}x{sh}", "OVERFLOW" if sh > 1254 or sw > 1254 else "ok")
    b.close()
