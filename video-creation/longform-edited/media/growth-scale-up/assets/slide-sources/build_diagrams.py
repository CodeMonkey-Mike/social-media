"""growth-scale-up: builds C1-split-diagram + C3-experiment-loop-diagram (LIGHT theme), one HTML each, one PNG per state.
Shared elements are identical across states (same layout code); only the lit/dim classes change."""
import pathlib
from playwright.sync_api import sync_playwright

P = pathlib.Path(__file__).resolve().parents[1]          # assets/
REF = P.parents[2] / "skills" / "container-reference"
CSS = (REF / "container-canonical.css").read_text(encoding="utf-8") + "\n" + \
      (REF / "container-canonical-light.css").read_text(encoding="utf-8")
FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900'
         '&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">')
COMMON = """
.frame{justify-content:flex-start;padding:84px 140px 0}
.frame .ey{margin-bottom:18px} .frame h1{font-size:74px}
.divider{margin:26px 0 0}
.frame>.nd,.frame>svg.wires,.frame>.seats,.frame>.lap{position:absolute}
.nd{position:absolute;border:2px solid var(--border);border-radius:22px;padding:26px 30px}
.nd .nm{font-family:'DM Sans';font-weight:700;font-size:40px;letter-spacing:.04em;color:var(--text-primary)}
.nd .sub{font-family:'DM Sans';font-size:28px;color:var(--text-secondary);margin-top:6px;line-height:1.35}
.badge{display:inline-block;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.14em;
  padding:7px 14px;border-radius:999px;border:1.5px solid var(--border);color:var(--text-muted);background:#F1EFE9}
.nd.dim{opacity:.42}
.nd.lit{border-color:var(--accent-cyan)}
.nd.lit .nm{color:var(--accent-cyan)}
.nd.lit .badge{border-color:var(--accent-cyan);color:var(--accent-cyan);background:rgba(0,106,158,.07)}
svg.wires{position:absolute;left:0;top:0;z-index:1}
svg .wire{stroke-width:3;fill:none} svg .wire.lit{stroke:var(--accent-cyan);stroke-width:4}
"""
DEFS = ('<defs><marker id="aw" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">'
        '<path d="M0,0 L10,5 L0,10 z" fill="#8A877E"/></marker>'
        '<marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">'
        '<path d="M0,0 L10,5 L0,10 z" fill="#006A9E"/></marker></defs>')
ORB = '<div class="orb" style="width:760px;height:760px;right:-240px;top:-300px;background:#006A9E"></div>'


def page(title, css, frames):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>{FONTS}'
            f'<style>{CSS}\n{COMMON}\n{css}</style></head><body>{frames}</body></html>')


def wire(d, on):
    return f'<path class="wire{" lit" if on else ""}" d="{d}" marker-end="url(#{"ah" if on else "aw"})"/>'


# ---------------- C1 (DATA.md C1, pillar 2) ----------------
C1_COLS = [
    ("STRATEGY", "HUMAN", ["what matters", "which bets", "what to stop"], '<div class="extra">AI = SPARRING PARTNER</div>'),
    ("EXECUTION", "AGENTS", ["build variants", "draft", "instrument", "ship"], ""),
    ("ANALYSIS", "AGENT DRAFTS, HUMAN DECIDES", ["agent drafts the readout"], '<div class="extra stamp">SCRAP OR SCALE</div>'),
]
C1_STATES = ["strategy", "execution", "analysis"]
C1_CSS = """
.col3{top:320px;width:500px;height:510px}
.nd .badge{margin-top:16px}
.nd ul{list-style:none;margin-top:26px}
.nd li{font-family:'DM Sans';font-size:32px;line-height:1.6;color:var(--text-secondary);padding-left:26px;position:relative}
.nd li::before{content:"";position:absolute;left:0;top:22px;width:9px;height:9px;border-radius:50%;background:var(--wire)}
.nd.lit li{color:var(--text-primary)} .nd.lit li::before{background:var(--accent-cyan)}
.extra{margin-top:22px;font-family:'DM Sans';font-weight:700;font-size:23px;letter-spacing:.12em;color:var(--text-muted)}
.nd.lit .extra{color:var(--accent-cyan)}
.stamp{display:inline-block;border:2.5px solid var(--text-muted);border-radius:10px;padding:10px 18px;font-size:26px}
.nd.lit .stamp{border-color:var(--accent-cyan)}
.seats{position:absolute;top:868px;left:140px;width:1640px;height:116px;display:flex;gap:40px}
.seat{flex:1;border-radius:18px;background:#E9E6DE;border:1.5px solid var(--border);display:flex;align-items:center;
  padding:0 34px;font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.14em;color:#9A9688}
.seat span{font-weight:500;letter-spacing:.02em;margin-left:22px}
"""


def c1_frame(lit):
    xs = [140, 710, 1280]
    cols = ""
    for i, (nm, own, verbs, extra) in enumerate(C1_COLS):
        lis = "".join(f"<li>{v}</li>" for v in verbs)
        cols += (f'<div class="nd col3 {"lit" if i == lit else "dim"}" style="left:{xs[i]}px"><div class="nm">{nm}</div>'
                 f'<div class="badge">{own}</div><ul>{lis}</ul>{extra}</div>')
    wires = "".join(wire(f"M{xs[i]+508} 575 L{xs[i+1]-12} 575", lit == i + 1) for i in range(2))
    seats = ('<div class="seats"><div class="seat">TEAM OF ONE<span>you hold the strategy</span></div>'
             '<div class="seat">TEAM OF FIVE<span>you write the guardrails</span></div></div>')
    return (f'<div class="frame" id="C1-split-diagram-{C1_STATES[lit]}">{ORB}'
            f'<div class="ey">THE SPLIT</div><h1>Strategy stays <span class="c">human.</span></h1><div class="divider"></div>'
            f'<svg class="wires" width="1920" height="1080">{DEFS}{wires}</svg>{cols}{seats}</div>')


# ---------------- C3 (DATA.md C3, pillar 6 play (a)) ----------------
C3_NODES = [
    ("MINE", "sessions + funnel", "Clarity / Amplitude", (140, 330)),
    ("BACKLOG", "prioritized", "Optimizely", (710, 330)),
    ("PLAN", "hypothesis, metrics, sizing", "Optimizely", (1280, 330)),
    ("VARIANTS + FLAG", "build the variants", "PostHog", (1280, 700)),
    ("READOUT", "the agent drafts it", "Statsig / GrowthBook / PostHog", (710, 700)),
    ("HUMAN", "scrap or scale", "YOU", (140, 700)),
]
C3_STATES = ["mine", "backlog", "plan", "variants", "readout", "human"]
C3_CSS = """
.box6{width:500px;height:250px}
.vend{position:absolute;left:30px;bottom:24px;font-family:'DM Sans';font-weight:500;font-size:22px;letter-spacing:.06em;
  color:var(--text-muted);border-top:1.5px solid var(--border);padding-top:12px;width:440px}
.nd.lit .vend{color:var(--text-primary)}
.nd.human{border-style:dashed}
.nd.human.lit{border-style:solid;background:#F2F7FA}
.lap{position:absolute;left:0;width:1920px;top:628px;text-align:center;font-family:'DM Sans';font-weight:700;
  font-size:22px;letter-spacing:.2em;color:var(--text-muted);z-index:2}
"""


def c3_frame(lit):
    W, H = 500, 250
    nodes = ""
    for i, (nm, sub, vend, (x, y)) in enumerate(C3_NODES):
        cls = ("lit" if i == lit else "dim") + (" human" if nm == "HUMAN" else "")
        nodes += (f'<div class="nd box6 {cls}" style="left:{x}px;top:{y}px"><div class="nm">{nm}</div>'
                  f'<div class="sub">{sub}</div><div class="vend">{vend}</div></div>')
    E = [
        f"M{140+W+8} {330+H/2} L{710-12} {330+H/2}",
        f"M{710+W+8} {330+H/2} L{1280-12} {330+H/2}",
        f"M{1280+W/2} {330+H+8} L{1280+W/2} {700-12}",
        f"M{1280-8} {700+H/2} L{710+W+12} {700+H/2}",
        f"M{710-8} {700+H/2} L{140+W+12} {700+H/2}",
        f"M{140+W/2} {700-8} L{140+W/2} {330+H+12}",
    ]
    wires = "".join(wire(d, (j + 1) % 6 == lit) for j, d in enumerate(E))
    return (f'<div class="frame" id="C3-experiment-loop-diagram-{C3_STATES[lit]}">{ORB}'
            f'<div class="ey">PLAY 1 &middot; THE EXPERIMENT LOOP</div>'
            f'<h1>Agents run the loop. <span class="c">You</span> call it.</h1><div class="divider"></div>'
            f'<svg class="wires" width="1920" height="1080">{DEFS}{wires}</svg><div class="lap">THE LOOP</div>{nodes}</div>')


def shoot(html_path, ids, outdir):
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto(html_path.as_uri())
        pg.wait_for_load_state("networkidle")
        pg.evaluate("document.fonts.ready")
        for i in ids:
            pg.locator(f"#{i}").screenshot(path=str(outdir / f"{i}.png"))
        b.close()


if __name__ == "__main__":
    D = P / "diagrams"
    c1 = D / "C1-split-diagram.html"
    c1.write_text(page("C1-split-diagram", C1_CSS, "".join(c1_frame(k) for k in range(3))), encoding="utf-8")
    c3 = D / "C3-experiment-loop-diagram.html"
    c3.write_text(page("C3-experiment-loop-diagram", C3_CSS, "".join(c3_frame(k) for k in range(6))), encoding="utf-8")
    shoot(c1, [f"C1-split-diagram-{s}" for s in C1_STATES], D)
    shoot(c3, [f"C3-experiment-loop-diagram-{s}" for s in C3_STATES], D)
    print("ok")
