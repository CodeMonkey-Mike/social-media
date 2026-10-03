# Code-rendered V4 DATA slide (2026-09-10). repurpose/SKILL.md, Version 4: "If you need exact
# data ... this style requires a code-generated chart approach rather than ChatGPT image
# generation." ChatGPT overrode the authored figures on every attempt (+68%, +320%), so the
# two figure-bearing data slides of batch kaspa are rendered from HTML with the exact text.
# Layout mirrors images/reference/carousels/version4/slide.png: bold title, three outlined
# stat boxes (green / green / orange), a large centre panel, a coloured insight box with
# bullets, page number top-right. 1254x1254, no em dashes.
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

SPECS = {
  "05669397": {
    "out": "yt-posts-05669397-03-the-chart.png", "page": 3,
    "title": "The chart <em>noticed</em>",
    "stats": [("SEVEN DAYS", "+17%", "one week"), ("THIRTY DAYS", "+35%", "one month"), ("MARKET CAP", "ABOUT $1B", "right now")],
    "panel_kind": "chart", "panel": [], "panel_caption": "",
    "box_label": "THE TELL",
    "bullets": ["The weekly candle tapped the 50-week SMA on a wick. No close above it yet.",
                "Bigger names in the industry started saying Kaspa out loud the same week."],
  },
  "e3dd8be2": {
    "out": "yt-posts-e3dd8be2-02-what-robinhood-did.png", "page": 2,
    "title": "What Robinhood <em>actually</em> did",
    "stats": [("JUGGERNAUT", "+380%", "on the day"), ("FRONG", "+100%", "on the day"), ("SPOT TRADING", "NO", "asset pages only")],
    "panel_kind": "nodes2", "panel": ["ASSET PAGE", "SPOT LISTING"],
    "panel_caption": "",
    "box_label": "THE DETAIL",
    "bullets": ["Searchable asset pages only: look the token up, watch the price, cannot buy it there.",
                "Volume still jumped 3,000% on JUGGERNAUT and 1,300% on FRONG."],
  },
  "b36c02eb": {
    "out": "yt-posts-b36c02eb-03-why-juggernaut.png", "page": 3,
    "title": "Why <em>JUGGERNAUT</em> of all things",
    "stats": [("FIRST HOUR", "+500%", "on the asset page"), ("SETTLED", "+380%", "after the spike"), ("VOLUME", "+3,000%", "on the day")],
    "panel_kind": "timeline", "panel": ["ONE PHOTO ON<br>WALL STREET", "THE CEO'S<br>FAVORITE MEME", "THE ASSET<br>PAGE"],
    "panel_caption": "",
    "box_label": "THE THESIS",
    "bullets": ["Memes built on an existing character almost never work in crypto.",
                "Vlad Tenev posting the Juggernaut hug as his favorite meme was the whole thesis, and it was enough."],
  },
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1254px;height:1254px;background:#fff;font-family:'Segoe UI',Inter,Arial,sans-serif;color:#111;padding:48px 52px;position:relative}
.page{position:absolute;top:34px;right:44px;width:60px;height:60px;border:3px solid #222;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700}
h1{font-size:64px;font-weight:800;letter-spacing:-1px;text-align:center;margin-top:14px;line-height:1.1}
h1 em{font-style:normal;color:#1a8f3a}
.rule{width:660px;height:3px;background:#222;margin:22px auto 0;position:relative}
.rule:after{content:'';position:absolute;left:50%;top:-9px;width:70px;height:20px;margin-left:-35px;background:#fff;border:3px solid #222;border-radius:20px}
.stats{display:flex;gap:22px;margin-top:38px}
.stat{flex:1;border:3px solid #1a8f3a;border-radius:14px;padding:20px 22px;background:#f7fbf8}
.stat.orange{border-color:#e07a12;background:#fff8f1}
.stat .l{font-size:22px;font-weight:700;letter-spacing:1px;color:#222}
.stat .v{font-size:58px;font-weight:800;color:#1a8f3a;line-height:1.05;margin-top:8px}
.stat.orange .v{color:#e07a12}
.stat .s{font-size:20px;color:#1a8f3a;margin-top:6px;font-weight:600}
.stat.orange .s{color:#e07a12}
.stat .v.small{font-size:38px;margin-top:14px}
.panel{margin-top:34px;height:470px;padding:10px 0;border:3px solid #dfe5e2;border-radius:16px;background:#fafcfb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}
.row{display:flex;align-items:center;gap:26px}
.node{border:4px solid #1a8f3a;border-radius:22px;padding:16px 30px;font-size:34px;line-height:1.15;font-weight:800;color:#1a8f3a;background:#fff;min-width:210px;text-align:center}
.node.center{background:#1a8f3a;color:#fff;font-size:44px}
.arrow{font-size:52px;color:#1a8f3a;font-weight:800}
.fanwrap{display:flex;align-items:center;gap:10px}.fancol{display:flex;flex-direction:column;gap:14px}.fan{display:flex;align-items:center;gap:18px}.node.big{padding:40px 44px;font-size:52px}
.cap{font-size:24px;color:#444;font-weight:600;text-align:center;padding:0 60px}
.box{margin-top:34px;display:flex;border-radius:16px;overflow:hidden;background:#e9f7ec;min-height:200px}
.box .tag{width:210px;background:#1a8f3a;color:#fff;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;letter-spacing:1px}
.box ul{list-style:none;padding:26px 34px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.box li{font-size:30px;line-height:1.3;color:#111;padding-left:30px;position:relative}
.box li:before{content:'';position:absolute;left:0;top:16px;width:14px;height:14px;border-radius:50%;background:#1a8f3a}
"""

def html(spec):
    stats = ""
    for i, (l, v, s) in enumerate(spec["stats"]):
        cls = "stat orange" if i == 2 else "stat"
        vcls = "v small" if len(v) > 8 else "v"
        stats += f'<div class="{cls}"><div class="l">{l}:</div><div class="{vcls}">{v}</div><div class="s">{s}</div></div>'
    if spec["panel_kind"] == "chart":
        pts = "40,380 120,360 200,372 280,330 360,338 440,300 520,310 600,270 680,282 760,240 840,225 900,200 940,130 960,96 985,125 1010,118"
        row = ('<svg width="1060" height="420" viewBox="0 0 1060 420">'
               '<line x1="40" y1="400" x2="1020" y2="400" stroke="#999" stroke-width="3"/>'
               '<line x1="40" y1="20" x2="40" y2="400" stroke="#999" stroke-width="3"/>'
               '<line x1="40" y1="96" x2="1020" y2="96" stroke="#777" stroke-width="4" stroke-dasharray="18,12"/>'
               '<text x="1015" y="80" font-size="26" font-weight="800" fill="#555" text-anchor="end">50-WEEK SMA</text>'
               f'<polyline points="{pts}" fill="none" stroke="#1a8f3a" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>'
               '<circle cx="960" cy="96" r="9" fill="#1a8f3a"/>'
               '<text x="60" y="30" font-size="22" fill="#555">PRICE</text>'
               '<text x="1000" y="392" font-size="22" fill="#555" text-anchor="end">WEEKS</text>'
               '</svg>')
    elif spec["panel_kind"] == "nodes2":
        a, b2 = spec["panel"]
        row = (f'<div class="node center big">{a}</div><span class="arrow">&#8594;</span>'
               f'<div class="node big" style="border-color:#888;color:#666">{b2}</div>')
    elif spec["panel_kind"] == "timeline":
        items = spec["panel"]
        row = '<span class="arrow">&#8594;</span>'.join(f'<div class="node">{x}</div>' for x in items)
    else:
        # fan-in: three source nodes stacked on the left, every one with its own arrow INTO the
        # single centre node on the right (QA 2026-09-10: a linear chain read as a sequence)
        col = "".join(f'<div class="fan"><div class="node">{x}</div><span class="arrow">&#8594;</span></div>' for x in spec["panel"])
        row = f'<div class="fanwrap"><div class="fancol">{col}</div><div class="node center big">{spec["panel_center"]}</div></div>'
    bullets = "".join(f"<li>{b}</li>" for b in spec["bullets"])
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="page">{spec['page']}</div>
<h1>{spec['title']}</h1><div class="rule"></div>
<div class="stats">{stats}</div>
<div class="panel"><div class="row">{row}</div>{('<div class="cap">'+spec['panel_caption']+'</div>') if spec['panel_caption'] else ''}</div>
<div class="box"><div class="tag">{spec['box_label']}</div><ul>{bullets}</ul></div>
</body></html>"""

outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
outdir.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1254, "height": 1254}, device_scale_factor=1)
    for iid, spec in SPECS.items():
        assert "—" not in json.dumps(spec) and "–" not in json.dumps(spec)
        page.set_content(html(spec))
        page.wait_for_timeout(300)
        out = outdir / spec["out"]
        page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1254, "height": 1254})
        print("rendered", out, out.stat().st_size, "bytes")
    b.close()
