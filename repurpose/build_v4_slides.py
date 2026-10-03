"""build_v4_slides.py - code-render the Version 4 carousel DATA slides.

Why this exists: the V4 data slides carry an argument that IS a dated number
series. ChatGPT image generation draws charts as illustration, not from data
(repurpose/SKILL.md, Version 4 "Important limitation"), so two generation passes
produced charts that contradicted their own stat boxes and plotted future dates.
These slides are therefore rendered from real verified data via HTML + inline SVG
and screenshotted with Playwright, matching the V4 reference look exactly.

The HOOK slide (slide 1) stays ChatGPT-generated: it is a photo hook with no data.

Usage:  python repurpose/build_v4_slides.py [--outdir DIR]
"""
import argparse
import asyncio
import datetime as dt
import pathlib
import sys

# ── verified CHUMP data ──────────────────────────────────────────────────────
# Every anchor below is a VERIFIED figure. Supply ~1.0B, so price x supply = cap.
#   Jul 31 launch cap ~$2,230                  (GlobeNewswire / crypto.news, Aug 25)
#   Aug 25 prior ATH ~ $15M cap                (same release, "over 6,700x")
#   Aug 26 ATL price $0.01090                  (CoinGecko)
#   Sep 1  ATH price $0.037                    (CoinMarketCap reading)
#   Sep 2  price $0.029  -> cap $29.26M        (CoinMarketCap reading)
#   Sep 3  price $0.03747 -> cap $37.375M      (CoinGecko, today)
# Segments between anchors are straight-line interpolation between verified
# endpoints. No invented inflections, and nothing plotted past today.
TODAY = dt.date(2026, 9, 3)
SERIES = [
    (dt.date(2026, 7, 1),  0.0),
    (dt.date(2026, 7, 31), 0.00223),   # launch, $2,230
    (dt.date(2026, 8, 25), 15.0),      # prior ATH per the Aug 25 release
    (dt.date(2026, 8, 26), 10.9),      # ATL price $0.01090
    (dt.date(2026, 9, 1),  37.0),      # ATH price $0.037
    (dt.date(2026, 9, 2),  29.3),      # $0.029
    (dt.date(2026, 9, 3),  37.4),      # today, $0.03747
]
LISTINGS = [
    (dt.date(2026, 8, 21), "AUG 21\nCOINMARKETCAP"),
    (dt.date(2026, 8, 29), "AUG 29\nLBANK"),
    (dt.date(2026, 9, 3),  "SEP 3\nNEW HIGH"),
]

W = H = 1254
X0, X1 = 150, 1195          # chart plot box
Y0, Y1 = 470, 880
YMAX = 40.0
D0, D1 = dt.date(2026, 7, 1), TODAY


def px(d):
    return X0 + (X1 - X0) * ((d - D0).days / (D1 - D0).days)


def py(v):
    return Y1 - (Y1 - Y0) * (v / YMAX)


def market_cap_svg(markers=()):
    """The verified market-cap series. Linear day axis, ends hard at today."""
    pts = [(px(d), py(v)) for d, v in SERIES]
    line = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    area = f"{X0},{Y1} " + line + f" {pts[-1][0]:.1f},{Y1}"

    g = []
    for i in range(5):
        v = YMAX * i / 4
        y = py(v)
        g.append(f'<line x1="{X0}" y1="{y:.1f}" x2="{X1}" y2="{y:.1f}" '
                 f'stroke="#dcdcdc" stroke-width="1.5" stroke-dasharray="5 6"/>')
        g.append(f'<text x="{X0-16}" y="{y+9:.1f}" text-anchor="end" '
                 f'class="ax">${v:.0f}M</text>')

    # x ticks every 7 days, evenly spaced because the axis is linear in time
    d = D0
    while d <= D1:
        x = px(d)
        g.append(f'<line x1="{x:.1f}" y1="{Y1}" x2="{x:.1f}" y2="{Y1+8}" '
                 f'stroke="#999" stroke-width="1.5"/>')
        g.append(f'<text x="{x:.1f}" y="{Y1+34}" text-anchor="middle" '
                 f'class="ax">{d.strftime("%b %-d") if sys.platform!="win32" else d.strftime("%b %#d")}</text>')
        d += dt.timedelta(days=7)
    # always tick today
    g.append(f'<line x1="{px(D1):.1f}" y1="{Y1}" x2="{px(D1):.1f}" y2="{Y1+8}" '
             f'stroke="#999" stroke-width="1.5"/>')

    # Markers are staggered onto two rows: Aug 29 and Sep 3 are only ~80px apart
    # on a 64-day axis, so same-row labels would collide.
    rows = [0, 1, 0]
    for i, (md, label) in enumerate(markers):
        x = px(md)
        row = rows[i % len(rows)]
        top = Y0 - 92 + row * 46
        g.append(f'<line x1="{x:.1f}" y1="{top+40:.1f}" x2="{x:.1f}" y2="{Y1}" '
                 f'stroke="#e8112d" stroke-width="3" stroke-dasharray="9 7"/>')
        # keep the right-most label inside the plot box
        anchor = "end" if x > X1 - 90 else "middle"
        tx = x - 8 if anchor == "end" else x
        for j, ln in enumerate(label.split("\n")):
            g.append(f'<text x="{tx:.1f}" y="{top+j*20:.1f}" text-anchor="{anchor}" '
                     f'class="mk">{ln}</text>')

    dots = "".join(
        f'<circle cx="{px(d):.1f}" cy="{py(v):.1f}" r="6" fill="#2563eb" '
        f'stroke="#fff" stroke-width="2.5"/>'
        for d, v in SERIES if v > 0)

    return f'''<svg width="{W}" height="{H}" class="chart">
      {"".join(g)}
      <polygon points="{area}" fill="rgba(37,99,235,.11)"/>
      <polyline points="{line}" fill="none" stroke="#2563eb" stroke-width="5"
                stroke-linejoin="round" stroke-linecap="round"/>
      {dots}
      <line x1="{X0}" y1="{Y1}" x2="{X1}" y2="{Y1}" stroke="#666" stroke-width="2"/>
      <text x="46" y="{(Y0+Y1)/2:.0f}" class="yl"
            transform="rotate(-90 46 {(Y0+Y1)/2:.0f})">MARKET CAPITALIZATION (USD)</text>
    </svg>'''


def longbow_svg():
    """Longbow has NO verified numbers, so this is an explicit schematic, never
    a price chart. Node-and-arrow, no y axis, no invented values."""
    def node(x, y, w, h, fill, stroke, t1, t2, tc="#fff"):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" '
                f'fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
                f'<text x="{x+w/2}" y="{y+52}" text-anchor="middle" class="n1" fill="{tc}">{t1}</text>'
                f'<text x="{x+w/2}" y="{y+92}" text-anchor="middle" class="n2" fill="{tc}">{t2}</text>')

    def arrow(x1, y, x2):
        return (f'<line x1="{x1}" y1="{y}" x2="{x2-18}" y2="{y}" stroke="#333" '
                f'stroke-width="4"/><polygon points="{x2},{y} {x2-20},{y-11} '
                f'{x2-20},{y+11}" fill="#333"/>')

    return f'''<svg width="{W}" height="{H}" class="chart">
      <text x="627" y="505" text-anchor="middle" class="schead">THE SAME DEV, TWICE</text>
      {node(120, 545, 290, 132, "#fff", "#e11d1d", "LONGBOW.CASH", "REAL LOOKING SITE", "#111")}
      {arrow(415, 611, 470)}
      {node(472, 545, 290, 132, "#e11d1d", "#e11d1d", "ONE LEG UP", "THEN RUGGED")}
      {arrow(767, 611, 822)}
      {node(824, 545, 300, 132, "#fff", "#f5821f", "LONGBOW.CREDIT", "SAME LOGO, NEW COLOR", "#111")}
      <line x1="265" y1="685" x2="265" y2="742" stroke="#bbb" stroke-width="3" stroke-dasharray="7 6"/>
      <line x1="974" y1="685" x2="974" y2="742" stroke="#bbb" stroke-width="3" stroke-dasharray="7 6"/>
      <text x="265" y="776" text-anchor="middle" class="sc">FIRST LAUNCH</text>
      <text x="974" y="776" text-anchor="middle" class="sc">ONE MONTH LATER</text>
      <rect x="120" y="812" width="1004" height="88" rx="12" fill="#fdf3e8" stroke="#f5821f" stroke-width="3"/>
      <text x="627" y="850" text-anchor="middle" class="sn">LISTED ON A CENTRALIZED EXCHANGE AND PUMPING AGAIN</text>
      <text x="627" y="882" text-anchor="middle" class="sn2">Schematic. Longbow market cap figures are not published.</text>
    </svg>'''


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1254px;height:1254px;background:#fff;position:relative;overflow:hidden;
     font-family:Inter,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased}
.page{position:absolute;top:22px;right:26px;font-weight:900;font-size:34px;color:#111}
h1{font-family:Anton,'Arial Black',Impact,sans-serif;font-size:64px;line-height:1.0;
   text-align:center;text-transform:uppercase;color:#0d0d0d;letter-spacing:.4px;
   padding:36px 108px 0}
.rule{display:flex;align-items:center;justify-content:center;gap:9px;margin:20px auto 0;width:660px}
.rule i{flex:1;height:2px;background:#111;display:block}
.rule b{width:11px;height:11px;border:2px solid #111;border-radius:50%;display:block}
.stats{display:flex;gap:22px;padding:26px 40px 0}
.stat{flex:1;border-radius:15px;border:3px solid;background:#fff;padding:16px 18px;
      display:flex;align-items:center;justify-content:space-between;min-height:146px}
.stat .lb{font-size:25px;font-weight:600;color:#2b2b2b;text-transform:uppercase;letter-spacing:.3px}
.stat .vl{font-family:Anton,'Arial Black',sans-serif;font-size:60px;line-height:1.04;margin-top:6px}
.stat .ic{width:64px;height:64px;border-radius:50%;flex:0 0 64px;display:flex;
          align-items:center;justify-content:center;color:#fff;font-size:33px;font-weight:900}
.red{border-color:#e11d1d}.red .vl{color:#e11d1d}.red .ic{background:#e11d1d}
.grn{border-color:#157a2b}.grn .vl{color:#157a2b}.grn .ic{background:#157a2b}
.org{border-color:#f5821f}.org .vl{color:#f5821f}.org .ic{background:#f5821f}
.chart{position:absolute;left:0;top:0;pointer-events:none}
.ax{font-family:Inter,sans-serif;font-size:19px;fill:#333}
.yl{font-family:Inter,sans-serif;font-size:20px;font-weight:700;fill:#333;letter-spacing:1.6px;text-anchor:middle}
.mk{font-family:Inter,sans-serif;font-size:17px;font-weight:700;fill:#e8112d;letter-spacing:.4px}
.lgd{position:absolute;left:150px;top:432px;font-size:21px;color:#333;display:flex;align-items:center;gap:10px}
.lgd s{width:34px;height:5px;background:#2563eb;border-radius:3px;display:block}
.schead{font-family:Anton,sans-serif;font-size:31px;fill:#666;letter-spacing:2.4px}
.n1{font-family:Anton,sans-serif;font-size:31px}
.n2{font-family:Inter,sans-serif;font-size:20px;font-weight:600}
.sc{font-family:Inter,sans-serif;font-size:20px;font-weight:700;fill:#777;letter-spacing:1.5px}
.sn{font-family:Anton,sans-serif;font-size:27px;fill:#c2610c;letter-spacing:.6px}
.sn2{font-family:Inter,sans-serif;font-size:19px;fill:#8a6a4f}
.warn{position:absolute;left:40px;right:40px;bottom:120px;display:flex;border-radius:14px;overflow:hidden}
.warn .w{background:#e8112d;width:216px;flex:0 0 216px;display:flex;flex-direction:column;
         align-items:center;justify-content:center;color:#fff;padding:16px 8px;gap:8px}
.warn .w .tri{font-size:62px;line-height:1}
.warn .w span{font-family:Anton,sans-serif;font-size:27px;text-align:center;line-height:1.06;letter-spacing:.5px}
.warn ul{background:#fdecec;flex:1;list-style:none;padding:22px 30px;display:flex;
         flex-direction:column;justify-content:center;gap:13px}
.warn li{font-size:30px;color:#111;font-weight:500;padding-left:30px;position:relative;line-height:1.24}
.warn li:before{content:'';position:absolute;left:0;top:12px;width:12px;height:12px;
                border-radius:50%;background:#e8112d}
.bar{position:absolute;left:0;right:0;bottom:0;height:100px;background:#000;
     display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px}
.bar .t{color:#fff;font-weight:900;font-size:29px;letter-spacing:4.6px}
.dots{display:flex;gap:15px}
.dots i{width:12px;height:12px;border-radius:50%;background:#555;display:block}
.dots i.on{background:#fff}
/* slide 5 has no chart, so its answer block is centred in the space a chart
   would occupy instead of leaving a dead white band */
.qwrap{position:absolute;left:40px;right:40px;top:300px;bottom:250px;
       display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}
.qbox{width:100%;border:3px solid #157a2b;border-radius:15px;padding:44px 30px;text-align:center}
.qbox .lb{font-size:30px;font-weight:600;color:#2b2b2b;text-transform:uppercase;letter-spacing:.3px}
.qbox .vl{font-family:Anton,sans-serif;font-size:76px;color:#157a2b;margin-top:16px}
.qsub{font-size:31px;color:#444;text-align:center;line-height:1.42;max-width:930px}
.qsub b{color:#111;font-weight:700}
"""


def dots(active):
    return '<div class="dots">' + "".join(
        f'<i class="{"on" if i == active - 1 else ""}"></i>' for i in range(5)) + '</div>'


def shell(page, body, title=None, rule=True):
    head = ""
    if title:
        head = f"<h1>{title}</h1>" + ('<div class="rule"><i></i><b></b><b></b><i></i></div>' if rule else "")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>
<body><div class="page">{page}</div>{head}{body}
<div class="bar"><div class="t">SWIPE FOR MORE</div>{dots(page)}</div></body></html>"""


BAR = '<svg width="30" height="30" viewBox="0 0 30 30"><rect x="3" y="16" width="6" height="11" fill="#fff" rx="1.5"/><rect x="12" y="9" width="6" height="18" fill="#fff" rx="1.5"/><rect x="21" y="3" width="6" height="24" fill="#fff" rx="1.5"/></svg>'


def stat(cls, label, value, icon):
    return (f'<div class="stat {cls}"><div><div class="lb">{label}</div>'
            f'<div class="vl">{value}</div></div><div class="ic">{icon}</div></div>')


def warn(title, bullets):
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    t = title.replace(" ", "<br>")
    return (f'<div class="warn"><div class="w"><div class="tri">&#9888;</div>'
            f'<span>{t}</span></div><ul>{lis}</ul></div>')


SLIDES = {
    "yt-posts-9b0318f0-chump-2230-to-29-million.png": shell(
        2,
        '<div class="stats">'
        + stat("red", "At launch, Jul 31", "$2,230", "&#9888;")
        + stat("grn", "Today", "$37.4M", BAR)
        + stat("org", "Gain", "OVER<br>16,000X", "&#9733;")
        + '</div><div class="lgd"><s></s>Market Capitalization (USD)</div>'
        + market_cap_svg()
        + warn("WARNING SIGNAL", [
            "The product never changed; the listings did.",
            "CoinMarketCap on Aug 21. LBank on Aug 29.",
            "A listing is a catalyst, not diligence."]),
        "A coin called Chump went from $2,230 to $37 million"),

    "yt-posts-da398d35-only-the-listings-changed.png": shell(
        3,
        '<div class="stats">'
        + stat("grn", "CoinMarketCap", "AUG 21", BAR)
        + stat("grn", "LBank spot", "AUG 29", BAR)
        + stat("org", "New all time high", "SEP 3", "&#9733;")
        + '</div><div class="lgd"><s></s>Market Capitalization (USD)</div>'
        + market_cap_svg(markers=LISTINGS)
        + warn("WARNING SIGNAL", [
            "No product shipped in that window.",
            "CoinMarketCap Aug 21. LBank Aug 29. New high Sep 3.",
            "Insiders plus funding plus an exchange equals a market cap."]),
        "The only thing that changed was the listings"),

    "yt-posts-57c6e77d-longbow-rugged-relaunched.png": shell(
        4,
        '<div class="stats">'
        + stat("red", "First site", "LONGBOW<br>.CASH", "&#9888;")
        + stat("red", "Outcome", "RUGGED", "&#9888;")
        + stat("org", "Live now", "LONGBOW<br>.CREDIT", "&#9733;")
        + '</div>'
        + longbow_svg()
        + warn("WARNING SIGNAL", [
            "Same dev. Same logo. Different color.",
            "A real website is not a real company.",
            "One leg up is the whole business model."]),
        "Longbow rugged, relaunched, and got listed again"),

    "yt-posts-0aec6dbe-would-you-buy-chump-question.png": shell(
        5,
        '<div class="qwrap">'
        '<div class="qbox"><div class="lb">Or is that exactly where you draw the line?</div>'
        '<div class="vl">TELL ME BELOW</div></div>'
        '<div class="qsub">It launched at <b>$2,230</b> on July 31 with no product. '
        'The only things that changed were <b>CoinMarketCap on Aug 21</b> and '
        '<b>LBank on Aug 29</b>.</div></div>'
        + warn("THE RULE", [
            "Listings are the catalyst, never the diligence.",
            "Check the market cap against the candles before you size in."]),
        "Would you buy a coin called Chump at $37 million?"),
}


async def main(outdir):
    from playwright.async_api import async_playwright
    tmp = pathlib.Path(outdir) / "_html"
    tmp.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as pw:
        br = await pw.chromium.launch()
        pg = await br.new_page(viewport={"width": W, "height": H},
                               device_scale_factor=1)
        for name, html in SLIDES.items():
            f = tmp / (name.replace(".png", ".html"))
            f.write_text(html, encoding="utf-8")
            await pg.goto(f.as_uri())
            await pg.wait_for_timeout(1400)          # let webfonts settle
            out = pathlib.Path(outdir) / name
            await pg.screenshot(path=str(out))
            print(f"BUILT {out}")
        await br.close()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--outdir",
                    default=r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt")
    a = ap.parse_args()
    asyncio.run(main(a.outdir))
