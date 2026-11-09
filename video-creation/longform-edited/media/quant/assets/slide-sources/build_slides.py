"""quant SLIDES (slide-builder, 2026-11-04): writes containers.html (one standalone 1920x1080 frame per state) and
screenshots each frame to ../title-slides/ or ../card-slides/.

The three stylesheets are pasted VERBATIM from container-reference/, in order: container-canonical.css,
container-canonical-light.css, accents/quant.css. LOCAL below only adds this build's components on those tokens.

Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1920x1080.
Gates (refuse to ship): a webfont did not load, a frame is not 1920x1080, an em dash is on screen, content overflows the
frame or its card.
Also writes C4-count.json: the geometry of C4's three hero figures, for the comp's count-up over C4-plate.png.
Run: python build_slides.py [frame-id ...]   (no args = every frame)
"""
import io
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REF = HERE.parents[3] / "skills" / "container-reference"
OUT = {"title": HERE.parent / "title-slides", "card": HERE.parent / "card-slides"}
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap")

LOCAL = """
/* this build's components, on the locked tokens. Chapter accent = Quant orange (--accent-cyan), words = --accent-text. */
/* divider: the locked gradient runs green -> cyan, which under quant.css reads green -> orange; the accent file keeps green
   for a tiny on-state only, so the divider runs the one chapter accent. Same size and margins. */
.divider{background:linear-gradient(90deg,var(--accent-cyan),rgba(var(--acc-rgb),.25))}
.orb.a{width:900px;height:900px;right:-280px;top:-400px;background:var(--accent-cyan);opacity:.10}
.ey .mono{font-weight:600}
h1.title{font-size:132px;line-height:1.05}
.card{position:relative;width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:60px 84px 58px;overflow:hidden}
.card>.top{position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-cyan) 38%,rgba(var(--acc-rgb),0) 92%)}
.frame .card h1{max-width:none}
/* rows: no filled box at rest (a hairline between rows); the lit row takes the tinted ring */
.rows{display:flex;flex-direction:column;width:100%}
.row{display:flex;align-items:baseline;gap:40px;padding:21px 30px;border:2px solid transparent;box-shadow:inset 0 -1px 0 var(--border)}
.row:last-child{box-shadow:none}
.row .lb{flex:0 0 250px;font:600 27px/1.2 'DM Sans';letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.row .v{font:600 50px/1.18 'DM Sans';color:var(--text-secondary)}
.row .v.mono{font-family:'JetBrains Mono';font-weight:600}
.row.done .v{color:var(--text-primary)}
.frame .row.on{border-radius:16px;border-color:var(--accent-cyan);background:rgba(var(--acc-rgb),.07);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.12),0 12px 28px rgba(20,22,26,.12)}
.row.on .v{color:var(--text-primary);font-weight:700}
.row.on .lb{color:var(--text-secondary)}
.row.key.on .v{color:var(--accent-text)}
.row.key.done .v{color:var(--accent-text)}
.src{font:500 26px/1.3 'DM Sans';color:var(--text-muted);margin-top:30px;max-width:none}
.src .mono{font-weight:500}
/* C4 stats */
.stats{display:grid;grid-template-columns:repeat(3,1fr);column-gap:0;width:100%}
.stat{padding:24px 34px 26px;border-radius:16px;border:2px solid transparent}
.stat .lb{font:600 27px/1.2 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px}
.stat .n{font:600 84px/1.08 'JetBrains Mono';letter-spacing:-.03em;color:var(--text-secondary);min-height:91px}
.stat.on{border-color:var(--accent-cyan);background:rgba(var(--acc-rgb),.07)}
.stat.on .n{color:var(--accent-text);font-weight:700}
.stat.on .lb{color:var(--text-secondary)}
.stat.done .n{color:var(--text-primary)}
.stats.small{margin-top:18px;padding-top:18px;border-top:1px solid var(--border)}
.stats.small .stat{padding:8px 36px}
.stats.small .n{font-size:46px;font-weight:500;min-height:0;letter-spacing:-.02em;color:var(--text-secondary)}
.stats.small .lb{font-size:25px;margin-bottom:8px}
.blank .n{visibility:hidden}
/* K3 the two actions */
.acts{display:flex;gap:30px;width:100%}
.act{flex:1;display:flex;align-items:center;gap:32px;padding:34px 44px;border-radius:20px;border:2px solid var(--border)}
.act svg{width:88px;height:88px;flex:0 0 88px;stroke:var(--text-secondary);fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.act .w{font:700 58px/1.1 'DM Sans';color:var(--text-secondary)}
.act.on{border-color:var(--accent-cyan);background:rgba(var(--acc-rgb),.07)}
.act.on svg{stroke:var(--accent-cyan)}
.act.on .w{color:var(--accent-text)}
.act.done svg{stroke:var(--text-primary)}
.act.done .w{color:var(--text-primary)}
/* K4 the card's lower band */
.card.hasband{padding-bottom:0}
.band{display:flex;align-items:center;gap:28px;margin:52px -84px 0;padding:36px 84px;border-top:1px solid var(--border)}
.band svg{width:60px;height:60px;flex:0 0 60px;stroke:var(--text-secondary);fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.band .w{font:700 54px/1.1 'DM Sans';color:var(--text-secondary)}
.band.on{background:rgba(var(--acc-rgb),.09);border-top:2px solid var(--accent-cyan)}
.band.on svg{stroke:var(--accent-cyan)}
.band.on .w{color:var(--accent-text)}
"""

THUMB = ('<svg viewBox="0 0 24 24"><path d="M7.5 10.5v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"/>'
         '<path d="M7.5 10.5 11.6 3a2.6 2.6 0 0 1 2.6 2.9L13.7 9.5h5.6a2 2 0 0 1 2 2.4l-1.4 7a2 2 0 0 1-2 1.6H7.5"/></svg>')
BELL = ('<svg viewBox="0 0 24 24"><path d="M18 9.2a6 6 0 0 0-12 0c0 6.3-2.6 8.1-2.6 8.1h17.2S18 15.5 18 9.2"/>'
        '<path d="M13.8 20.6a2 2 0 0 1-3.6 0"/></svg>')
ARROW = '<svg viewBox="0 0 24 24"><path d="M12 3.5v16"/><path d="m5.5 13 6.5 6.5 6.5-6.5"/></svg>'

FRAMES = []  # (frame id, type, inner html)


def add(fid, typ, inner):
    FRAMES.append((fid, typ, inner))


def card(ey, h1, body, cls="", h1cls="sm"):
    return (f'<div class="card {cls}"><div class="top"></div><div class="ey">{ey}</div><h1 class="{h1cls}">{h1}</h1>'
            f'<div class="divider"></div>{body}</div>')


def cls_for(i, lit):
    """lit = 1-based index of the row just spoken (0 = resting): earlier rows are done, the current one is on, later rest."""
    if lit == 0 or i > lit:
        return ""
    return "on" if i == lit else "done"


# ---- TITLE SLIDES (no box): chapter number + the chapter's name, one word in orange ----
for tid, ch, html in [("T2", "02", '<span class="hl">Islands</span> of Money'),
                      ("T3", "03", 'Who <span class="hl">Uses</span> It'),
                      ("T4", "04", 'The <span class="hl">Token</span>'),
                      ("T5", "05", 'Quant vs The <span class="hl">Market</span>'),
                      ("T6", "06", 'What’s <span class="hl">Next</span>')]:
    add(tid, "title", f'<div class="ey">Chapter <span class="mono">{ch}</span></div><h1 class="title">{html}</h1><div class="divider"></div>')

# ---- K1 ----
K1_ROWS = [("Based in", "London", ""), ("Founded", "2015", "mono"),
           ("Led by", "Gilbert Verdian, Founder and CEO", ""), ("What it sells", "Not a new blockchain", "")]


def k1(lit):
    rows = ""
    for i, (lb, v, c) in enumerate(K1_ROWS, 1):
        key = " key" if i == 4 else ""
        rows += f'<div class="row{key} {cls_for(i, lit)}"><div class="lb">{lb}</div><div class="v {c}">{v}</div></div>'
    return card("What is Quant?", "Quant, in one line", f'<div class="rows">{rows}</div>'
                '<div class="src">Companies House no. <span class="mono">09798383</span> · quant.network/about-us</div>')


add("K1", "card", k1(0))
for s in range(1, 5):
    add(f"K1-s{s}", "card", k1(s))


# ---- K2 ----
def k2(lit):
    rows = ""
    for i, v in enumerate(["Share of the total crypto market", "Against the peers", "Priced in Bitcoin"], 1):
        rows += f'<div class="row {cls_for(i, lit)}"><div class="v">{v}</div></div>'
    return card("The way the pros do it", 'Three <span class="hl">ratios</span>', f'<div class="rows">{rows}</div>', h1cls="")


add("K2", "card", k2(0))
for s in range(1, 4):
    add(f"K2-s{s}", "card", k2(s))

# ---- C4 ----
HERO = [("Price", "$199.08", "price"), ("Market cap", "$2.90B", "cap"), ("Rank", "#34", "rank")]
SMALL = [("FDV", "$2.91B"), ("24 h volume", "$57.4M"), ("1-year change", "+169.7%")]


def c4(lit, blank=False):
    hero = ""
    for i, (lb, v, slot) in enumerate(HERO, 1):
        hero += f'<div class="stat {cls_for(i, lit)}"><div class="lb">{lb}</div><div class="n" data-slot="{slot}">{v}</div></div>'
    small = "".join(f'<div class="stat"><div class="lb">{lb}</div><div class="n">{v}</div></div>' for lb, v in SMALL)
    return card("At the time of this recording", '<span class="hl">$QNT</span> by the numbers',
                f'<div class="stats{" blank" if blank else ""}">{hero}</div><div class="stats small">{small}</div>'
                '<div class="src">CoinGecko, <span class="mono">2026-11-04 12:08</span> UTC</div>')


add("C4", "card", c4(0))
for s in range(1, 4):
    add(f"C4-s{s}", "card", c4(s))
add("C4-plate", "card", c4(0, blank=True))


# ---- K3 ----
def k3(lit):
    a = (f'<div class="act {cls_for(1, lit)}">{THUMB}<div class="w">Like</div></div>'
         f'<div class="act {cls_for(2, lit)}">{BELL}<div class="w">Subscribe</div></div>')
    return card("If you’re new here", 'Enjoyed this <span class="hl">Quant</span> rundown?', f'<div class="acts">{a}</div>', h1cls="")


add("K3", "card", k3(0))
add("K3-s1", "card", k3(1))
add("K3-s2", "card", k3(2))


# ---- K4 ----
def k4(lit):
    return card("Before you go", 'The <span class="hl">community</span>',
                '<p>A rock star community.</p>'
                f'<div class="band {"on" if lit else ""}">{ARROW}<div class="w">Link in the description</div></div>',
                cls="hasband", h1cls="")


add("K4", "card", k4(False))
add("K4-s1", "card", k4(True))


def build_html():
    css = "\n".join((REF / f).read_text(encoding="utf-8") for f in
                    ["container-canonical.css", "container-canonical-light.css", "accents/quant.css"])
    body = "\n".join(f'<div class="frame" id="{fid}" data-type="{typ}"><div class="orb a"></div>{inner}</div>'
                     for fid, typ, inner in FRAMES)
    html = (f'<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{LOCAL}</style></head><body>\n{body}\n</body></html>\n')
    (HERE / "containers.html").write_text(html, encoding="utf-8")


CHECK = """(el)=>{
  const r=el.getBoundingClientRect(); const out=[]; const ids=el.id;
  if(Math.round(r.width)!==1920||Math.round(r.height)!==1080) out.push('frame size '+r.width+'x'+r.height);
  if(/\\u2014/.test(el.innerText)) out.push('em dash');
  el.querySelectorAll('.ey,h1,p,.row,.v,.stat,.n,.act,.w,.band,.src,.card').forEach(n=>{
    const b=n.getBoundingClientRect();
    if(b.left-r.left<60||r.right-b.right<60||b.top-r.top<40||r.bottom-b.bottom<40) out.push('near edge: '+n.className+' '+[b.left-r.left,b.top-r.top,b.right-r.left,b.bottom-r.top].map(Math.round));
    if(n.scrollWidth>n.clientWidth+1&&n.clientWidth>0&&getComputedStyle(n).display!=='inline') out.push('overflow: '+n.className+' '+n.innerText.slice(0,30));
  });
  return out}"""


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    build_html()
    for d in OUT.values():
        d.mkdir(parents=True, exist_ok=True)
    problems = []
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        pg.goto((HERE / "containers.html").as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("DM Sans", 600), ("JetBrains Mono", 600)]:
            if not pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>x.family.replace(/\"/g,'')===f&&x.status==='loaded')", [fam, w]):
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        print("fonts:", pg.evaluate("[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight))]"))
        for fid, typ, _ in FRAMES:
            if only and fid not in only:
                continue
            el = pg.locator(f"#{fid}")
            for msg in el.evaluate(CHECK):
                problems.append(f"{fid}: {msg}")
            img = Image.open(io.BytesIO(el.screenshot(type="png"))).convert("RGB").resize((1920, 1080), Image.LANCZOS)
            path = OUT[typ] / f"{fid}.png"
            img.save(path)
            print("wrote", path)
        count = pg.evaluate("""()=>Object.fromEntries([...document.querySelectorAll('#C4 [data-slot]')].map(n=>{
            const f=document.getElementById('C4').getBoundingClientRect(),b=n.getBoundingClientRect(),s=getComputedStyle(n);
            return [n.dataset.slot,{x:Math.round(b.left-f.left),y:Math.round(b.top-f.top),w:Math.round(b.width),h:Math.round(b.height),
              text:n.innerText,fontFamily:'JetBrains Mono',fontSize:s.fontSize,fontWeight:s.fontWeight,letterSpacing:s.letterSpacing,color:s.color}]}))""")
        (HERE / "C4-count.json").write_text(json.dumps(count, indent=1), encoding="utf-8")
        br.close()
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
        sys.exit(1)
    print("GATES PASS")


if __name__ == "__main__":
    main()
