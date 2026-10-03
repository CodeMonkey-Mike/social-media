# golden-kitty-dominance fix (2026-09-25): copy of kaspa-lane3-fix/render_v4_slide.py + line/bars panels.
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
  "698739ef": {
    "out": "yt-posts-698739ef-02-the-numbers.png", "page": 2,
    "title": "The numbers: <em>$GOLDEN</em> this week",
    "stats": [("LAUNCHED", "SEPT 4", "2026"), ("7-DAY MOVE", "+170%", "about"), ("MARKET CAP", "$4.8M", "about, new ATH")],
    "panel_kind": "line",
    "panel_caption": "",
    "box_label": "THE READ",
    "bullets": ["Up about 520% over two weeks while everything launched around it bleeds.",
                "My fib extension puts the next stop around $8M in the coming weeks. Never financial advice."],
  },
  "821bfcdb": {
    "out": "yt-posts-821bfcdb-04-the-rest-of-the-board.png", "page": 4, "red": True,
    "title": "The rest of the board has the lore, <em>not the chart</em>",
    "stats": [("$SWOLE", "UNDER $350K", "market cap"), ("$KITSU", "$1.1M", "about, market cap"), ("$TENDIES", "$9.4M", "about, market cap")],
    "panel_kind": "bars", "stat_colors": ["red", "green", "green"],
    # fact-check (2026-09-25): SWOLE ~0.34M, IF ~0.524M, KITSU ~1.14M, TENDIES ~9.4M; shortest -> longest
    "bars": [("$SWOLE", 0.34, "red"), ("$IF: UNDER $600K", 0.524, "red"), ("$KITSU", 1.14, "green"), ("$TENDIES", 9.4, "green")],
    "panel_caption": "",
    "box_label": "THE READ",
    "bullets": ["Vlad's swole cat, Vlad's actual dog, the CEX-listed one: all holding the line, none pumping.",
                "Lore alone does not pump a chart. Lore plus pairing plus content plus a market does."],
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
.box.red{background:#fdecec}.box.red .tag{background:#c62828}.box.red li:before{background:#c62828}
h1{font-size:56px;padding:0 80px}
.stat.red{border-color:#c62828;background:#fdf3f3}.stat.red .v,.stat.red .s{color:#c62828}
.stat.green{border-color:#1a8f3a;background:#f7fbf8}.stat.green .v,.stat.green .s{color:#1a8f3a}
"""

def html(spec):
    stats = ""
    for i, (l, v, s) in enumerate(spec["stats"]):
        cls = ("stat " + spec["stat_colors"][i]) if spec.get("stat_colors") else ("stat orange" if i == 2 else "stat")
        vcls = "v small" if len(v) > 8 else "v"
        stats += f'<div class="{cls}"><div class="l">{l}:</div><div class="{vcls}">{v}</div><div class="s">{s}</div></div>'
    if spec["panel_kind"] == "line":
        # stylized shape per the plan prompt: starts low, dips to the Sept 16 low, climbs to the ATH
        pts = [(60,300),(170,270),(280,285),(390,330),(470,352),(560,300),(660,230),(760,160),(820,95),(900,48)]
        path = " ".join(f"{x},{y}" for x, y in pts)
        row = f'''<svg width="1060" height="420" viewBox="0 0 1060 420">
<line x1="50" y1="20" x2="50" y2="380" stroke="#222" stroke-width="3"/><line x1="50" y1="380" x2="1020" y2="380" stroke="#222" stroke-width="3"/>
<text x="30" y="200" font-size="22" font-weight="700" fill="#444" transform="rotate(-90 30 200)" text-anchor="middle">PRICE</text>
<text x="535" y="412" font-size="22" font-weight="700" fill="#444" text-anchor="middle">TIME</text>
<polyline points="{path}" fill="none" stroke="#1a8f3a" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="470" cy="352" r="11" fill="#c62828"/><text x="470" y="322" font-size="26" font-weight="800" fill="#c62828" text-anchor="middle">SEPT 16</text>
<circle cx="900" cy="48" r="12" fill="#1a8f3a"/><text x="985" y="110" font-size="28" font-weight="800" fill="#1a8f3a" text-anchor="middle">NEW ATH</text>
</svg>'''
    elif spec["panel_kind"] == "bars":
        mx = max(v for _, v, _ in spec["bars"]); W = 620; rows = ""
        for i, (lab, v, c) in enumerate(spec["bars"]):
            col = "#c62828" if c == "red" else "#1a8f3a"; y = 30 + i * 88; w = max(8, W * v / mx)
            rows += f'<text x="300" y="{y+42}" font-size="26" font-weight="800" fill="{col}" text-anchor="end">{lab}</text>'
            rows += f'<rect x="320" y="{y+8}" width="{w:.0f}" height="52" rx="8" fill="{col}"/>'
        row = f'''<svg width="1060" height="420" viewBox="0 0 1060 420">{rows}
<line x1="320" y1="20" x2="320" y2="380" stroke="#222" stroke-width="3"/><line x1="320" y1="380" x2="960" y2="380" stroke="#222" stroke-width="3"/>
<text x="640" y="412" font-size="22" font-weight="700" fill="#444" text-anchor="middle">MARKET CAP</text></svg>'''
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
<div class="panel"><div class="row">{row}</div>{('<div class="cap">' + spec['panel_caption'] + '</div>') if spec['panel_caption'] else ''}</div>
<div class="box{' red' if spec.get('red') else ''}"><div class="tag">{spec['box_label']}</div><ul>{bullets}</ul></div>
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
