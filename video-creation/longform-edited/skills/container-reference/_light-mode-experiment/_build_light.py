"""LIGHT-MODE LOOK TEST (Mike, 2026-10-25). Not a skill, not a stylesheet change: a one-off experiment.

Reads the COPIED dark sources in _src/ (never the project originals), writes <name>-light.html beside this
script (same layout, type, sizes, words, data; palette only), renders each to a 1920x1080 PNG with the same
viewport / device-scale / state as its original driver, then builds compare-<name>.png (dark over light).

Run: python _build_light.py
"""
import io
import os
import sys

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "_src")

# ---------------------------------------------------------------------------------------------------------
# THE LIGHT PALETTE (dark token -> light token). Accents darkened until text >= 4.5:1 on the page (#F6F4EE)
# and on white cards; strokes >= 3:1. Every other rule of container-canonical.css is untouched.
# ---------------------------------------------------------------------------------------------------------
TOKENS = """
:root{
  --bg-deep:#F6F4EE; --bg-card:#FFFFFF; --bg-card-hover:#F1EFE9;
  --accent-green:#007A55; --accent-cyan:#006A9E; --accent-gold:#8F6500;
  --accent-red:#C41E3A; --accent-purple:#7C3AED; --accent-teal:#0E7A6C;
  --text-primary:#14161A; --text-secondary:#4A5263; --text-muted:#5E6676;
  --border:#DDD9CF;
}
body{background:#E4E1D8}
/* film grain kept, but multiplied so it reads as paper tooth instead of lifting the blacks */
.frame::after{opacity:.05;mix-blend-mode:multiply}
"""

# ---- 1. SYSTEM-DESIGN DIAGRAM: growth-vs-product C1-s1, state "crm" ----------------------------------
DIAGRAM_CSS = TOKENS + """
:root{--accent:#006A9E;--role-a:#8F6500;--role-b:#157A3A;--wire:#8A877E}
.role,.ch .rl{text-shadow:none}
.rw{color:var(--text-primary)}
.col{background:rgba(255,255,255,.55);border-color:var(--border);box-shadow:0 1px 2px rgba(20,22,26,.04),0 14px 34px rgba(20,22,26,.06)}
.nd{box-shadow:0 1px 2px rgba(20,22,26,.06),0 3px 10px rgba(20,22,26,.04)}
.nd.lit{border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,106,158,.10),rgba(0,106,158,.03)),var(--bg-card)}
.nd.lit .t{color:var(--text-primary)}
/* the "hot" glow becomes a tinted ring + a lifted shadow (glow on white smears) */
.nd.hot{box-shadow:0 0 0 6px rgba(0,106,158,.22),0 16px 34px rgba(20,22,26,.18)}
.impact{background:linear-gradient(135deg,rgba(0,106,158,.08),rgba(0,106,158,.02));border-color:rgba(0,106,158,.35)}
"""
DIAGRAM_SWAPS = [
    # wires: lit cyan / resting dark-slate  ->  lit deep cyan / resting warm grey; the SVG glow filter is dropped
    ("c = on ? '#00c2ff' : '#2a3142'", "c = on ? '#006A9E' : '#8A877E'"),
    ("""${on?'filter="url(#g)"':''}""", ""),
    # accent orbs: same position and blur, a pale tint instead of a saturated bloom
    ("right:-300px;top:-360px;background:#00c2ff", "right:-300px;top:-360px;background:#7cc4e8;opacity:.30"),
    ("background:#0b3a66;opacity:.35", "background:#c3cddd;opacity:.45"),
]

# ---- 2. ANIMATED-CHART design state: evals chart-two-suites, state "payoff" ---------------------------
CHART_CSS = TOKENS + """
:root{--lit:#157A3A;--lit-rgb:21,122,58}
.pill.ill{border-color:rgba(74,82,99,.55);color:var(--text-secondary)}
.node.on,.box.on,.ecard.on{box-shadow:0 0 0 3px rgba(var(--lit-rgb),.14),0 12px 28px rgba(20,22,26,.12)}
.panel.on{box-shadow:0 12px 32px rgba(20,22,26,.08)}
.chip.on{box-shadow:none}
"""
CHART_SWAPS = [
    ('stroke="#1e2330"', 'stroke="#D6D2C7"'),          # dashed grid lines -> light grey
    ('stroke="#3a4357"', 'stroke="#7A808B"'),          # x axis -> mid grey (3.6:1)
    ("stroke:#e8eaf0", "stroke:#14161A"),              # the neutral "regression" line: white -> near-black
    ("fill:#e8eaf0", "fill:#14161A"),
    ("fill:#0a0c10", "fill:#FFFFFF"),                  # hollow point centres: page-black -> white
    ("rgba(232,234,240,.16)", "rgba(20,22,26,.07)"),   # the floor band under the regression line
    ("rgba(232,234,240,.22)", "rgba(20,22,26,.12)"),   # end-point halo (neutral)
    ("rgba(232,234,240,0)", "rgba(20,22,26,0)"),
    ("rgba(34,197,94,.50)", "rgba(21,122,58,.16)"),    # corner orb
    ("rgba(34,197,94,.20)", "rgba(21,122,58,.13)"),    # area fill under the capability line
    ("rgba(34,197,94,.22)", "rgba(21,122,58,.18)"),    # end-point halo (lit)
    ("rgba(34,197,94,0)", "rgba(21,122,58,0)"),
]

# ---- 3. CARD SLIDE: growth-vs-product scoreboard-growth, state s4 (c1 done, c2 done, c3 on, c4 resting) --
CARD_CSS = TOKENS + """
.frame{--roleA:#8F6500;--roleA-rgb:143,101,0;--roleB:#157A3A;--roleB-rgb:21,122,58}
.ch1{--acc:#8F6500;--acc-rgb:143,101,0}
.ch2,.ch3,.ch4{--acc:#006A9E;--acc-rgb:0,106,158}
.ch5,.ch6{--acc:#6D4ED8;--acc-rgb:109,78,216}
.orb.o1{opacity:.12}
.orb.o2{background:#b9c3d6;opacity:.30}
.ch1 .orb.o2{opacity:.10}
/* card: white surface, hairline border, soft shadow (was a 120 px black drop) */
.card{background:#FFFFFF;border-color:var(--border);box-shadow:0 1px 2px rgba(20,22,26,.05),0 24px 60px rgba(20,22,26,.10)}
.role{text-shadow:none}
/* the current chip: tinted ring instead of the cyan bloom */
.chip.on{background:rgba(var(--acc-rgb),.08);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10)}
"""

JOBS = [
    # name, source, css, swaps, frame id, (selector, class) mods, device scale, chrome channel, needs Lanczos
    ("C1-s1-crm", "C1-s1.html", DIAGRAM_CSS, DIAGRAM_SWAPS, "C1-s1-crm", [], 1, None),
    ("chart-two-suites-payoff", "chart-two-suites.html", CHART_CSS, CHART_SWAPS, "payoff", [], 1, None),
    ("scoreboard-growth-s4", "containers.html", CARD_CSS, [], "scoreboard-growth",
     [('[data-k="c1"]', "done"), ('[data-k="c2"]', "done"), ('[data-k="c3"]', "on")], 2, "chrome"),
]


def build_html(src, css, swaps):
    with open(os.path.join(SRC, src), encoding="utf-8") as f:
        html = f.read()
    for old, new in swaps:
        if old not in html:
            raise SystemExit(f"{src}: swap target not found: {old!r}")
        html = html.replace(old, new)
    marker = "</head>"
    if marker not in html:
        raise SystemExit(f"{src}: no </head>")
    return html.replace(marker, "<style>/* LIGHT-MODE OVERRIDES (experiment) */\n" + css + "</style>\n" + marker, 1)


FONTS_JS = """Promise.all([['900','Playfair Display'],['700','DM Sans'],['600','JetBrains Mono']]
  .map(([w,f]) => document.fonts.load(w + ' 40px "' + f + '"'))).then(() => document.fonts.ready)"""
FONTS_OK = """[['900','Playfair Display'],['700','DM Sans'],['600','JetBrains Mono']]
  .filter(([w,f]) => !document.fonts.check(w + ' 40px "' + f + '"')).map(x => x[1])"""


def shoot(pw, name, html_path, fid, mods, scale, channel):
    b = pw.chromium.launch(**({"channel": channel} if channel else {}))
    page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=scale)
    page.goto("file:///" + html_path.replace("\\", "/"), wait_until="networkidle", timeout=90000)
    page.evaluate(FONTS_JS)
    page.wait_for_timeout(800)
    missing = page.evaluate(FONTS_OK)
    if missing:
        raise SystemExit(f"{name}: fonts not loaded {missing}")
    if "\u2014" in page.evaluate("() => document.getElementById(%r).innerText" % fid):
        raise SystemExit(f"{name}: em dash on screen")
    for sel, cls in mods:
        page.evaluate("([f,s,c]) => document.getElementById(f).querySelectorAll(s).forEach(e => e.classList.add(c))",
                      [fid, sel, cls])
    el = page.locator(f'[id="{fid}"]')
    el.scroll_into_view_if_needed()
    im = Image.open(io.BytesIO(el.screenshot())).convert("RGB")
    if im.size != (1920, 1080):
        im = im.resize((1920, 1080), Image.LANCZOS)
    out = os.path.join(HERE, f"{name}-light.png")
    im.save(out, optimize=True)
    b.close()
    return out


def font(px):
    for p in [r"C:\Windows\Fonts\segoeuib.ttf", r"C:\Windows\Fonts\arialbd.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, px)
    return ImageFont.load_default()


def compare(name):
    dark = Image.open(os.path.join(HERE, f"{name}-dark.png")).convert("RGB")
    light = Image.open(os.path.join(HERE, f"{name}-light.png")).convert("RGB")
    assert dark.size == light.size == (1920, 1080), (name, dark.size, light.size)
    gut = 40
    # 2 x 1080 + 40 gutter = 2200 tall (the brief's "1920x2160 + 40 px gutter" cannot both hold without scaling)
    canvas = Image.new("RGB", (1920, 2160 + gut), (128, 128, 128))
    canvas.paste(dark, (0, 0))
    canvas.paste(light, (0, 1080 + gut))
    d = ImageDraw.Draw(canvas)
    f = font(22)
    for label, y0, fg, bg in [("DARK", 0, (232, 234, 240), (0, 0, 0, 0)), ("LIGHT", 1080 + gut, (20, 22, 26), None)]:
        tw = d.textlength(label, font=f)
        x, y = 1920 - 24 - tw - 28, y0 + 22
        box = (x, y, x + tw + 28, y + 38)
        d.rounded_rectangle(box, radius=8, fill=(20, 22, 26) if label == "DARK" else (255, 255, 255),
                            outline=(90, 96, 110) if label == "DARK" else (200, 196, 186), width=2)
        d.text((x + 14, y + 6), label, font=f, fill=fg)
    out = os.path.join(HERE, f"compare-{name}.png")
    canvas.save(out, optimize=True)
    return out


if __name__ == "__main__":
    only = sys.argv[1:]
    with sync_playwright() as pw:
        for name, src, css, swaps, fid, mods, scale, channel in JOBS:
            if only and name not in only:
                continue
            html_path = os.path.join(HERE, f"{name}-light.html")
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(build_html(src, css, swaps))
            print("HTML ", html_path)
            print("LIGHT", shoot(pw, name, html_path, fid, mods, scale, channel))
            print("CMP  ", compare(name))
