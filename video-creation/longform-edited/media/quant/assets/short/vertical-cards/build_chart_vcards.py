"""build_chart_vcards.py: native 1080x1920 rebuilds of C1 and C6 for the SHORT of `quant` (16:9-sourced mode, s_vertical_cards).

Same content, same locked stylesheet, reflowed: the <head> (light theme + quant accent) is lifted byte for byte from the 16:9
source and only a PORTRAIT REFLOW <style> is added after it. C6's numbers come from assets/charts/C6-data.json and nowhere else.

Layout constraints:
- Everything printed sits above y 1410: the short's captions (bottom pad 320, 72 px, up to two lines, pop 1.12) own y ~1420-1610,
  and below that is the platform UI.
- Side margin 48 px, so text is far clear of the 22 px strip check_short_edge_text.py scores.
- C1: the VO says "on the left" and "in the middle", so the three columns stay physically left / middle / right. A wide mesh
  becomes a tall one by wrapping and stacking inside each column, never by moving the bank stack above Quant.

  python build_chart_vcards.py            (writes the .html sources + the .png stills beside this file, prints the layout audit)
"""
import asyncio
import datetime as dt
import html
import json
import re
from pathlib import Path

from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent.parent
FRAME_W, FRAME_H = 1080, 1920
CAPTION_TOP = 1410          # nothing printed at or below this y

HEAD_RE = re.compile(r"^(.*?</style>)", re.S)


def locked_head(src: Path) -> str:
    """The 16:9 source's <head> up to and including its locked </style>, byte for byte."""
    return HEAD_RE.match(src.read_text(encoding="utf-8")).group(1)


# ------------------------------------------------------------------------------------------------ shared portrait reflow
PORTRAIT_CSS = """
<style>
/* PORTRAIT REFLOW (short of quant, 1080x1920). Only size, spacing and wrap change; every token above stays. */
.frame{width:1080px;height:1920px;padding:104px 48px 0}
.orb{width:620px;height:620px;top:-290px;right:-220px}
.ey{font-size:29px;line-height:38px;height:38px;margin-bottom:6px}
.divider{margin:24px 0 26px}
</style>
"""


# ------------------------------------------------------------------------------------------------ C1: bank stack + Quant both lit
C1_CSS = """
<style>
/* C1 portrait: three real columns, wrapped and stacked inside each one */
h1.sm{font-size:86px;line-height:92px;max-width:none;white-space:nowrap}
.diag{width:984px;height:1000px}
.dim{opacity:.34}
.cl{font-size:22px;letter-spacing:.08em;line-height:28px;white-space:normal}
.nd{padding:0 14px}
.nd .n{font-size:46px;line-height:1.14}
.nd .s{font-size:29px;line-height:1.26;margin-top:6px;white-space:normal}
.nd.sub{padding:0 18px}
.nd.sub .n{font-size:44px}
.nd .row{flex-direction:column;align-items:flex-start;gap:10px}
.nd.far{padding:0 10px}
.nd.far .n{font-size:28px;line-height:1.2}
.qt{font-size:76px;top:16px}
.chips{gap:8px;margin-top:16px}
.pill{padding:6px 10px}
</style>
"""

# one column of the reflow per x; heights chosen so every name wraps on its own and the panel fills the column
L_X, L_W = 0, 272
M_X, M_W = 328, 384
R_X, R_W = 768, 216
PANEL_TOP, PANEL_BOTTOM = 72, 992
LEFT = [("Core banking", 96, 232, None), ("Treasury / ERP", 350, 232, None),
        ("Payment rails", 604, 388, ["RTGS", "Faster Payments", "RTP", "CHIPS"])]
SUBS = [("Overledger", "the API connector", None, 194, 160), ("Quant Flow", "where the bank writes the rules", "PayScript", 368, 282),
        ("QuantNet", "the orchestration layer", None, 664, 160), ("Quant Fusion", "the rollup", None, 838, 138)]
# the three wire levels: each runs straight across the gap (a 56 px gap leaves no room for the 16:9's S-curve), left and right on one line
WIRE_Y = [212, 466, 744]
RIGHT = [("Public ledgers", 122, 180), ("Permissioned ledgers", 376, 180), ("Tokenised-deposit platforms", 634, 220)]


def wire(x1, y1, x2, y2, stroke):
    """A two-headed curve, the same marks as the 16:9 wires: 3.5 px stroke, heads 16 long and 18 tall."""
    a, b = x1 + 14, x2 - 14
    mid = (a + b) / 2
    return (f'<path d="M{a} {y1} C{mid} {y1},{mid} {y2},{b} {y2}" fill="none" stroke="{stroke}" stroke-width="3.5"/>'
            f'<polygon points="{x2},{y2} {x2 - 16},{y2 - 9} {x2 - 16},{y2 + 9}" fill="{stroke}"/>'
            f'<polygon points="{x1},{y1} {x1 + 16},{y1 - 9} {x1 + 16},{y1 + 9}" fill="{stroke}"/>')


def build_c1() -> str:
    lit, rest = "#F15A22", "#C9C5C0"
    wires = "".join(f"<g>{wire(L_X + L_W, y, M_X, y, lit)}</g>" for y in WIRE_Y)
    wires += "".join(f'<g opacity=".45">{wire(M_X + M_W, y, R_X, y, rest)}</g>' for y in WIRE_Y)

    parts = [f'<svg class="w" width="984" height="1000" viewBox="0 0 984 1000">{wires}</svg>',
             f'<div class="cl" style="left:{L_X}px;width:{L_W}px;top:4px">What a bank<br>already runs</div>',
             f'<div class="cl" style="left:{M_X}px;width:{M_W}px;top:32px">In the middle</div>',
             f'<div class="cl dim" style="left:{R_X}px;width:{R_W}px;top:4px">The ledgers<br>and platforms</div>']
    for name, top, h, chips in LEFT:
        chip_html = ('<div class="chips">' + "".join(f'<span class="pill">{c}</span>' for c in chips) + "</div>") if chips else ""
        parts.append(f'<div class="nd lit" style="left:{L_X}px;top:{top}px;width:{L_W}px;height:{h}px"><div class="n">{name}</div>{chip_html}</div>')
    parts.append(f'<div class="qp lit" style="left:{M_X}px;top:{PANEL_TOP}px;width:{M_W}px;height:{PANEL_BOTTOM - PANEL_TOP}px"><div class="qt">Quant</div></div>')
    for name, sub, pill, top, h in SUBS:
        head = (f'<div class="row"><div class="n">{name}</div><span class="pill">{pill}</span></div>' if pill else f'<div class="n">{name}</div>')
        parts.append(f'<div class="nd sub" style="left:{M_X + 14}px;top:{top}px;width:{M_W - 28}px;height:{h}px">{head}<div class="s">{sub}</div></div>')
    for name, top, h in RIGHT:
        parts.append(f'<div class="nd far dim" style="left:{R_X}px;top:{top}px;width:{R_W}px;height:{h}px"><div class="n">{name}</div></div>')

    head = locked_head(ASSETS / "diagrams" / "C1.html") + PORTRAIT_CSS + C1_CSS
    return (head + '\n</head><body>\n<div class="frame" id="C1-v"><div class="orb"></div>'
            '<div class="ey">The system, with the real names</div>'
            '<h1 class="sm"><span class="hl">One layer</span> between<br>the bank and the ledgers</h1><div class="divider"></div>'
            '<div class="diag">' + "".join(parts) + "</div></div>\n</body></html>\n")


# ------------------------------------------------------------------------------------------------ C6: the payoff state
C6_CSS = """
<style>
/* C6 portrait: one-line head, legend on two rows, a tall plot, takeaway + source stacked under it */
h1.sm{font-size:88px;line-height:96px;white-space:nowrap}
.legend{display:flex;flex-wrap:wrap;gap:8px 36px;height:92px;align-content:flex-start;padding-left:2px}
.legend i{flex-basis:100%;height:0}
.lg{display:flex;align-items:center;gap:10px;font-size:34px;font-weight:600;line-height:42px;color:var(--text-secondary)}
.lg.o{color:var(--accent-text);font-weight:700}
.lg svg{flex:none}
svg.plot{margin-top:10px}
svg .tk{font-size:28px}
svg .sub{font-size:32px}
svg .big{font-size:100px}
svg .end{font-size:34px}
.foot{display:block;height:auto;margin-top:8px}
.take{font-size:52px;line-height:64px}
.src{font-size:26px;line-height:1.28;text-align:left;margin:6px 0 0;white-space:nowrap}
</style>
"""
SVG_W = 984
PLOT_L, PLOT_R = 68, 784
PLOT_T, PLOT_B = 16, 806          # svg coords
ORDER = ["CC", "HBAR", "XRP", "XLM", "LINK", "BTC", "QNT"]      # the 16:9's stacking order, Quant on top
LEGEND = [("Quant", "QNT"), ("Chainlink", "LINK"), ("Hedera", "HBAR"), ("XRP", "XRP"), ("Stellar", "XLM"), ("Canton", "CC"), ("Bitcoin", "BTC")]


def build_c6() -> str:
    data = json.loads((ASSETS / "charts" / "C6-data.json").read_text(encoding="utf-8"))
    sb, colors, series = data["scale_B"], data["colors"], data["series"]
    x0, x1 = sb["x0"], sb["x1"]
    y0, y1 = sb["y0"], sb["y1"]
    assert (y0, y1) == (0, 400), "the payoff state reads on scale B"

    def sx(ord_):
        return PLOT_L + (ord_ - x0) / (x1 - x0) * (PLOT_R - PLOT_L)

    def sy(v):
        return PLOT_B - (v - y0) / (y1 - y0) * (PLOT_B - PLOT_T)

    out = []
    for v in (0, 100, 200, 300, 400):
        if v == 0:
            out.append(f'<line x1="{PLOT_L}" y1="{PLOT_B}" x2="{PLOT_R}" y2="{PLOT_B}" stroke="#9A9693" stroke-width="2.5"/>')
        else:
            out.append(f'<line x1="{PLOT_L}" y1="{sy(v):.1f}" x2="{PLOT_R}" y2="{sy(v):.1f}" stroke="#ECE9E5" stroke-width="2"/>')
        out.append(f'<text x="{PLOT_L - 12}" y="{sy(v) + 10:.1f}" class="tk" text-anchor="end">{v}</text>')
    for iso, lab in (("2025-11-05", "Nov 2025"), ("2026-01-01", "Jan"), ("2026-03-01", "Mar"), ("2026-05-01", "May"),
                     ("2026-07-01", "Jul"), ("2026-09-01", "Sep"), ("2026-11-01", "Nov 2026")):
        x = sx(dt.date.fromisoformat(iso).toordinal())
        out.append(f'<line x1="{x:.1f}" y1="{PLOT_B}" x2="{x:.1f}" y2="{PLOT_B + 10}" stroke="#9A9693" stroke-width="2.5"/>')
        out.append(f'<text x="{x:.1f}" y="{PLOT_B + 44}" class="tk" text-anchor="middle">{lab}</text>')

    # the dashed baseline and its label: same words as the 16:9, placed in the clear above the peers
    yb = sy(100)
    out.append(f'<line x1="{PLOT_L}" y1="{yb:.1f}" x2="{PLOT_R}" y2="{yb:.1f}" stroke="#43403E" stroke-width="2.5" stroke-dasharray="10 8"/>')
    out.append(f'<text x="692" y="{sy(147):.1f}" class="sub" text-anchor="end">indexed to <tspan class="mono">100</tspan> '
               '<tspan dx="5">·</tspan><tspan dx="5"> </tspan><tspan class="mono">2025-11-05</tspan></text>')

    for k in ORDER:
        pts = series[k]
        d = "M" + " L".join(f"{sx(dt.date.fromisoformat(p['d']).toordinal()):.1f} {sy(p['idx']):.1f}" for p in pts)
        if k == "QNT":
            out.append(f'<path d="{d}" fill="none" stroke="{colors[k]}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>')
        elif k == "BTC":
            out.append(f'<path d="{d}" fill="none" stroke="{colors[k]}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="9 8"/>')
        else:
            out.append(f'<path d="{d}" fill="none" stroke="{colors[k]}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>')

    last = series["QNT"][-1]["idx"]
    yq = sy(last)
    out.append(f'<circle cx="{PLOT_R}" cy="{yq:.1f}" r="12" fill="#fff" stroke="#F15A22" stroke-width="5"/>')
    out.append(f'<text x="{PLOT_R + 18}" y="{yq + 35:.1f}" class="big" text-anchor="start">{round(last)}</text>')
    out.append(f'<text x="{PLOT_R + 22}" y="{yq + 78:.1f}" class="sub" text-anchor="start">Quant</text>')

    # endpoint labels: values come straight off the data file's end_labels (the table the 16:9 printed), order top to bottom kept
    rows = data["end_labels"]
    row_h, base = 44, PLOT_B - 8
    for i, row in enumerate(rows):
        assert round(series[row["k"]][-1]["idx"]) == row["v"], row
        label_c = base - (len(rows) - 1 - i) * row_h - 12
        out.append(f'<path d="M{PLOT_R + 4} {sy(series[row["k"]][-1]["idx"]):.1f} L{PLOT_R + 30} {label_c:.1f}" stroke="{colors[row["k"]]}" stroke-width="2" fill="none"/>')
        out.append(f'<text x="{PLOT_R + 38}" y="{label_c + 12:.1f}" class="end" text-anchor="start">{row["k"]} {row["v"]}</text>')

    legend = ""
    for name, k in LEGEND:
        if k == "BTC":
            sw = f'<line x1="2" y1="6" x2="38" y2="6" stroke="{colors[k]}" stroke-width="4" stroke-dasharray="8 7"/>'
        elif k == "QNT":
            sw = f'<line x1="3" y1="6" x2="37" y2="6" stroke="{colors[k]}" stroke-width="6" stroke-linecap="round"/>'
        else:
            sw = f'<line x1="3" y1="6" x2="37" y2="6" stroke="{colors[k]}" stroke-width="4.5" stroke-linecap="round"/>'
        legend += f'<div class="lg{" o" if k == "QNT" else ""}"><svg width="40" height="12" viewBox="0 0 40 12">{sw}</svg>{html.escape(name)}</div>'
        if k == "XRP":
            legend += "<i></i>"

    head = locked_head(ASSETS / "charts" / "C6.html") + PORTRAIT_CSS + C6_CSS
    svg_h = PLOT_B + 56
    return (head + '\n</head><body>\n<div class="frame" id="C6-v"><div class="orb"></div>'
            '<div class="ey">Ratio <span class="mono">2</span> of <span class="mono">3</span></div>'
            '<h1 class="sm">Quant against <span class="hl">the peers</span></h1><div class="divider"></div>'
            f'<div class="legend">{legend}</div>'
            f'<svg class="plot" width="{SVG_W}" height="{svg_h}" viewBox="0 0 {SVG_W} {svg_h}">' + "".join(out) + "</svg>"
            '<div class="foot"><div class="take">Every other line ends <span class="hl">below <span class="mono">100</span></span>.</div>'
            '<div class="src">Source: CoinGecko<br>Canton indexed from its first CoinGecko day, <span class="mono">2025-11-10</span></div></div>'
            "</div>\n</body></html>\n")


# ------------------------------------------------------------------------------------------------ shoot + audit
AUDIT_JS = """
() => {
  const out = {fonts: {}, boxes: [], clipped: [], lowest: 0, rightmost: 0, leftmost: 9999};
  for (const f of ['900 40px "Playfair Display"', '600 40px "DM Sans"', '600 40px "JetBrains Mono"']) out.fonts[f] = document.fonts.check(f);
  const walker = document.createTreeWalker(document.querySelector('.frame'), NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) {
      out.lowest = Math.max(out.lowest, b.bottom); out.rightmost = Math.max(out.rightmost, b.right); out.leftmost = Math.min(out.leftmost, b.left);
    }
    const box = n.parentElement.closest('.nd');
    if (box) {
      const bb = box.getBoundingClientRect(), tb = r.getBoundingClientRect();
      if (tb.left < bb.left + 2 || tb.right > bb.right - 2 || tb.top < bb.top + 2 || tb.bottom > bb.bottom - 2)
        out.clipped.push(n.textContent.trim() + ' ' + JSON.stringify([tb.left, tb.right, tb.top, tb.bottom, bb.left, bb.right, bb.top, bb.bottom].map(Math.round)));
    }
  }
  for (const sel of ['h1', '.diag', '.legend', 'svg.plot', '.take', '.src']) {
    const e = document.querySelector(sel);
    if (e) { const b = e.getBoundingClientRect(); out.boxes.push([sel, Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]); }
  }
  for (const e of document.querySelectorAll('.nd')) {
    if (e.scrollWidth > e.clientWidth + 1) out.clipped.push('overflow: ' + e.textContent.trim());
  }
  return out;
}
"""


async def main():
    jobs = [("C1-one-layer-v", build_c1()), ("C6-peers-payoff-v", build_c6())]
    async with async_playwright() as p:
        br = await p.chromium.launch()
        for name, doc in jobs:
            src = HERE / f"{name}.html"
            src.write_text(doc, encoding="utf-8")
            page = await br.new_page(viewport={"width": FRAME_W, "height": FRAME_H}, device_scale_factor=1)
            await page.goto(src.as_uri(), wait_until="networkidle")
            await page.evaluate("document.fonts.ready")
            await page.wait_for_timeout(300)
            audit = await page.evaluate(AUDIT_JS)
            await page.locator(".frame").screenshot(path=str(HERE / f"{name}.png"))
            await page.close()
            print(name, json.dumps(audit, ensure_ascii=False))
            if audit["lowest"] >= CAPTION_TOP:
                print(f"  WARNING text reaches y {audit['lowest']:.0f}, the caption band starts at {CAPTION_TOP}")
        await br.close()


if __name__ == "__main__":
    asyncio.run(main())
