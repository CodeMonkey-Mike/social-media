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
  "7e20eeb6": {
    "out": "yt-posts-7e20eeb6-02-the-week.png", "page": 2,
    "title": "The week <em>Kaspa</em> crossed a billion",
    "stats": [("ONE DAY", "+25%", "single session"), ("SEVEN DAYS", "+32%", "one week"), ("MARKET CAP", "$1.0B", "crossed this week")],
    "panel_kind": "timeline", "panel": ["SEPT 3", "THIS WEEK", "$1B"],
    "panel_caption": "Coinbase delists the perps  ->  price runs into it  ->  market cap crosses a billion",
    "box_label": "WHAT HAPPENED",
    "bullets": ["Sept 3: Coinbase delisted nine perpetual futures, Kaspa included.",
                "Spot untouched. The price ran into the delisting, not away from it."],
  },
  "aa13fcdf": {
    "out": "yt-posts-aa13fcdf-02-the-comeback-list.png", "page": 2,
    "title": "The <em>comeback</em> list",
    "stats": [("TUT", "+1,100%", "in August"), ("NACHO", "MOVING AGAIN", "after a dead bear"), ("KASPA", "+32%", "this week")],
    "panel_kind": "nodes", "panel": ["TUT", "NACHO", "KASPA"], "panel_center": "BACK",
    "panel_caption": "Written off in 2024 and 2025. Shipping through the bear. Moving again.",
    "box_label": "THE PATTERN",
    "bullets": ["TUT ran more than 1,100% to a new all-time high after everybody wrote it off.",
                "Nacho the Kat is moving again after a bear market with zero excitement."],
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
.node{border:4px solid #1a8f3a;border-radius:22px;padding:16px 30px;font-size:36px;font-weight:800;color:#1a8f3a;background:#fff;min-width:210px;text-align:center}
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
    if spec["panel_kind"] == "timeline":
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
