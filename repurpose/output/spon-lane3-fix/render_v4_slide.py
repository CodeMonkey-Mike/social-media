# Code-rendered V4 DATA slides for batch spon's Zombies carousel (2026-09-30, V2 -> V4 switch per Mike),
# copied from repurpose/output/kaspa-lane3-fix/render_v4_slide.py (+ a 'versus' panel kind).
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
  "5b71261a": {
    "out": "yt-posts-5b71261a-02-the-flows.png", "page": 2,
    "title": "Nine straight days of <em>ETF inflows</em>",
    "stats": [("SPOT BTC ETFS", "9 DAYS", "straight inflows"), ("INFLOWS", "$3.1B", "through Sept 29"), ("WEEKLY CLOSE", "ABOVE MAY HIGH", "the level Cowen doubted")],
    "panel_kind": "timeline", "panel": ["INFLOWS", "WEEKLY CLOSE", "MAY HIGH BROKEN"],
    "panel_caption": "Bitcoin keeps tapping the May high, tries to go down, and will not",
    "box_label": "THE TELL",
    "bullets": ["Benjamin Cowen did not think the May high would get taken out.",
                "His own words this week: he 'clearly got wrong' that break."],
  },
  "72d30224": {
    "out": "yt-posts-72d30224-03-the-cracks.png", "page": 3,
    "title": "Cracks everywhere <em>except crypto</em>",
    "stats": [("30-YEAR YIELD", "5.62%", "highest since 2002"), ("CONSUMER CONFIDENCE", "81.9", "lowest since 2014"), ("JOLTS OPENINGS", "7.08M", "vs 7.23M expected")],
    "panel_kind": "fan", "panel": ["BONDS", "STOCKS", "HOUSING"], "panel_center": "CRACKS",
    "panel_caption": "Every one of them is showing cracks at the same time",
    "box_label": "THE READ",
    "bullets": ["JOLTS printed a five-month low. Stocks sold off intraday and closed lower.",
                "A weak job market takes a rate hike off the table."],
  },
  "81c1e035": {
    "out": "yt-posts-81c1e035-04-the-flip.png", "page": 4,
    "title": "The <em>zombies</em> are buying back in",
    "stats": [("LAST NOVEMBER", "SOLD", "the whole way down"), ("NOW", "BUYING", "back above the 50-week"), ("THEIR SCRIPT", "OCT BOTTOM", "so they front-run it")],
    "panel_kind": "timeline", "panel": ["BELOW 50-WEEK SMA", "BACK ABOVE", "ABOVE MAY HIGH"],
    "panel_caption": "The four-year cycle zombies pushed Bitcoin down, and now they are pushing it back up",
    "box_label": "WHY IT FLIPS",
    "bullets": ["If crypto dips, the zombies buy more.",
                "Their own demand is why the candles are not allowed to go far."],
  },
  "868a5291": {
    "out": "yt-posts-868a5291-05-question.png", "page": 5,
    "title": "<em>Q4:</em> the past year, reversed?",
    "stats": [("METALS, BONDS, STOCKS", "STRUGGLING", "cracks everywhere"), ("CRYPTO", "RUNNING", "zombies buying back in"), ("THE PAST YEAR", "REVERSED", "crypto bled, others ran")],
    "panel_kind": "versus", "panel": ["CRYPTO RUNS", "EVERYTHING SELLS"],
    "panel_caption": "Does crypto run while the rest of the economy struggles, or does everything sell off together?",
    "box_label": "YOUR CALL",
    "bullets": ["Drop your bet in the comments.",
                "Like and subscribe for the macro read that ignores the four-year cycle echo chamber."],
  },
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{display:flex;flex-direction:column;width:1254px;height:1254px;background:#fff;font-family:'Segoe UI',Inter,Arial,sans-serif;color:#111;padding:48px 52px;position:relative}
.page{position:absolute;top:34px;right:44px;width:60px;height:60px;border:3px solid #222;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700}
h1{text-wrap:balance;padding:0 80px;font-size:64px;font-weight:800;letter-spacing:-1px;text-align:center;margin-top:14px;line-height:1.1}
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
.panel{margin-top:34px;flex:1;min-height:0;padding:10px 0;border:3px solid #dfe5e2;border-radius:16px;background:#fafcfb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding-left:40px;padding-right:40px}
.row{display:flex;align-items:center;gap:26px}
.node{border:4px solid #1a8f3a;border-radius:22px;padding:16px 26px;font-size:32px;font-weight:800;color:#1a8f3a;background:#fff;min-width:210px;text-align:center}
.node.center{background:#1a8f3a;color:#fff;font-size:44px}
.arrow{font-size:52px;color:#1a8f3a;font-weight:800}
.fanwrap{display:flex;align-items:stretch;gap:10px}.fancol{display:flex;flex-direction:column;gap:14px}.fan{display:flex;align-items:center;gap:18px}.fan .node{width:250px}.node.center.big{display:flex;align-items:center;justify-content:center}.node.big{padding:40px 44px;font-size:52px}
.vs{font-size:44px;font-weight:800;color:#444}
.node.orange{border-color:#e07a12;color:#e07a12}
.cap{text-wrap:balance;font-size:24px;color:#444;font-weight:600;text-align:center;padding:0 60px}
.box{margin-top:34px;display:flex;border-radius:16px;overflow:hidden;background:#e9f7ec;min-height:200px}
.box .tag{width:210px;background:#1a8f3a;color:#fff;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;letter-spacing:1px}
.box ul{list-style:none;padding:26px 34px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.box li{text-wrap:pretty;font-size:30px;line-height:1.3;color:#111;padding-left:30px;position:relative}
.box li:before{content:'';position:absolute;left:0;top:16px;width:14px;height:14px;border-radius:50%;background:#1a8f3a}
"""

def html(spec):
    stats = ""
    for i, (l, v, s) in enumerate(spec["stats"]):
        cls = "stat orange" if i == 2 else "stat"
        vcls = "v small" if max(len(x[1]) for x in spec["stats"]) > 8 else "v"
        stats += f'<div class="{cls}"><div class="l">{l}:</div><div class="{vcls}">{v}</div><div class="s">{s}</div></div>'
    if spec["panel_kind"] == "timeline":
        items = spec["panel"]
        row = '<span class="arrow">&#8594;</span>'.join(f'<div class="node">{x}</div>' for x in items)
    elif spec["panel_kind"] == "versus":
        a, b = spec["panel"]
        row = f'<div class="node big">{a}</div><span class="vs">OR</span><div class="node big orange">{b}</div>'
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
<div class="panel"><div class="row">{row}</div><div class="cap">{spec['panel_caption']}</div></div>
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
