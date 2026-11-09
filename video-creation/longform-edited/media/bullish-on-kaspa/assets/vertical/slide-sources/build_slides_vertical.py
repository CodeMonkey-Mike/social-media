"""bullish-on-kaspa VERTICAL card slides: re-shoots the 16:9 source (../../slide-sources/containers.html, untouched) at 1080x1920.
The locked stylesheet, light theme, per-video rules, frames, wording and state variants all come from that file; only the
PORTRAIT rules below are added, last in the cascade, so the layout reflows. Writes ./containers.html + ../card-slides/<frame id>.png.
Run: python build_slides_vertical.py [frame-id ...]"""
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SRC = HERE.parents[1] / "slide-sources" / "containers.html"
OUT = HERE.parent / "card-slides"
W, H = 1080, 1920
ALPHA = {"text-wall-early-alpha"}

PORTRAIT = """
/* PORTRAIT REFLOW: sizes and stacking only, no token, colour or anatomy change */
.frame{width:1080px;height:1920px;padding:0 48px}
.orb.a{width:820px;height:820px;right:-320px;top:-240px}
.orb.b{width:700px;height:700px;left:-320px;bottom:-260px}
.card{padding:76px 56px 84px;border-radius:32px}
.card>.top{height:6px}
.ey{font-size:36px;letter-spacing:.16em;margin-bottom:30px}
h1{font-size:112px;line-height:1.06;max-width:none}
h1.sm{font-size:100px}
.divider{width:92px;height:5px;margin:44px 0}
.rows{gap:24px}
.row{font-size:52px;padding:38px 40px;gap:24px}
.row.on{padding:37px 39px}
.row .yr{font-size:60px;white-space:nowrap}
.chips{gap:22px}
.chip{font-size:42px;padding:22px 38px}
.chip.big{font-size:68px;padding:30px 60px}
.sub{font-size:46px;line-height:1.3}
.src{font-size:38px;margin-top:48px}
.now{font-size:60px;margin:0 0 30px}
.big60{flex-wrap:wrap;gap:6px 30px;margin-top:0}
.big60 .ar{flex-basis:100%;font-size:92px}
.big60 .n{font-size:300px}
.big60 .l{font-size:124px}
.rung{flex-direction:column;align-items:flex-start;gap:6px;padding:22px 0}
.rung .n{font-size:118px;min-width:0}
.rung .t{font-size:50px}
.rung.pay{align-items:flex-start;margin-top:10px}
.rung.pay .n{font-size:300px}
.rung.pay .t{font-size:58px;max-width:none}
/* the roadmap strip: the horizontal rail becomes a vertical one */
.strip{grid-template-columns:1fr;margin-top:8px}
.strip:before{left:13px;right:auto;top:24px;bottom:210px;width:4px;height:auto}
.st{padding:0 0 54px 76px}
.st:last-child{padding-bottom:0}
.st:before{top:12px;width:30px;height:30px}
.st .w{font-size:46px}
.st .a{font-size:78px;margin-top:8px}
.st .x{font-size:44px}
.line{font-size:64px;line-height:1.25;padding:48px 44px;margin-top:0}
.line.on{padding:47px 43px}
.stmt{font-size:90px;line-height:1.16}
.stmt .gap{display:block;height:38px}
/* the text wall: same rows, scaled up so they fill the tall frame; filled and outlined stay pixel-registered */
.frame>.wallbox{left:-420px;right:-420px;top:-160px;bottom:-160px;zoom:1.5}
.frame>.early{font-size:226px;-webkit-text-stroke:8px #fff}
"""

html = SRC.read_text(encoding="utf-8").replace("</head>", f"<style>{PORTRAIT}</style></head>", 1)
# my-theory wraps to six lines in portrait: a gap at the source's first line break keeps its two clauses apart (same words)
html, n_gap = re.subn(r'(<div class="stmt">.*?)<br>', r'\1<span class="gap"></span>', html, count=1)
assert n_gap == 1, "my-theory statement not found"
(HERE / "containers.html").write_text(html, encoding="utf-8")

CHECK = """()=>[...document.querySelectorAll('.frame')].map(f=>{
  const F=f.getBoundingClientRect(),c=f.querySelector('.card');
  const bad=[...f.querySelectorAll('*')].filter(e=>!e.closest('.wallbox')&&!e.matches('.orb')&&!e.closest('svg')).filter(e=>{
    const r=e.getBoundingClientRect();
    if(!r.width||!r.height)return false;
    return r.left<F.left-.5||r.right>F.right+.5||r.top<F.top-.5||r.bottom>F.bottom+.5
      ||e.scrollWidth>e.clientWidth+1&&e.clientWidth>0&&getComputedStyle(e).display!=='inline'
  }).map(e=>(e.className||e.tagName)+':'+(e.textContent||'').trim().slice(0,28));
  const r=c&&c.getBoundingClientRect();
  return [f.id,r?Math.round(r.top-F.top):null,r?Math.round(r.bottom-F.top):null,bad]})"""

want = sys.argv[1:]
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    pg.goto((HERE / "containers.html").as_uri(), wait_until="networkidle")
    pg.evaluate("document.fonts.ready")
    for fam in ("900 40px 'Playfair Display'", "600 40px 'DM Sans'", "600 40px 'JetBrains Mono'", "900 40px Archivo", "italic 800 40px Montserrat"):
        print(fam, pg.evaluate("f=>document.fonts.check(f)", fam))
    rows = pg.evaluate(CHECK)
    for fid, top, bottom, bad in rows:
        print(f"{fid:32} card y {top}-{bottom}", "OVERFLOW " + repr(bad) if bad else "ok")
    for fid in want or [r[0] for r in rows]:
        if fid in ALPHA:
            pg.evaluate("document.body.style.background='transparent';document.documentElement.style.background='transparent'")
        pg.locator(f"#{fid}").screenshot(path=str(OUT / f"{fid}.png"), omit_background=fid in ALPHA)
        if fid in ALPHA:
            pg.evaluate("document.body.style.background='';document.documentElement.style.background=''")
    b.close()
print(len(want or rows), "frames written to", OUT)
