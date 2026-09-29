"""Screenshot every `.frame` in a PORTRAIT chart HTML to `<frame-id>.png` beside the HTML.

Vertical (9:16) twin of assets/diagrams/_render_chart_states.py: each chart HTML builds one full-frame
1080x1920 `.frame` per STATE, cloned from one <template> so shared elements are pixel-identical across
states; frame id = `<chart-id>-<state>`. Device scale 2 -> 2160x3840 PNGs (same convention as the 16:9
set and the kaspa 30bps vertical), so comp push-ins stay crisp.

usage: python _render_states.py <chart.html> [<chart.html> ...]
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

FACES = ['900 70px "Playfair Display"', '700 30px "DM Sans"', '500 30px "DM Sans"',
         '600 30px "JetBrains Mono"', '400 30px "JetBrains Mono"']


def render(pg, html: Path) -> list[Path]:
    pg.goto(html.resolve().as_uri())
    pg.wait_for_load_state("networkidle")
    missing = pg.evaluate(
        "async (fs)=>{const bad=[];for(const f of fs){const r=await document.fonts.load(f);if(!r.length)bad.push(f);}"
        "await document.fonts.ready;return bad;}", FACES
    )
    if missing:
        raise SystemExit(f"FONT LOAD FAIL {html.name}: {missing}")
    # overflow guard: nothing inside a frame may spill past the 1080x1920 canvas
    spill = pg.evaluate("""()=>{const out=[];for(const f of document.querySelectorAll('.frame')){const R=f.getBoundingClientRect();
      for(const e of f.querySelectorAll('.node,.lab,.job,.row,.token,.badge,.tg,.src,.hdr,h1,.box,.l1,.q,.tx,.out,.lock,.elabel,.rl,.hazard,.legend')){
        const r=e.getBoundingClientRect(); if(!r.width) continue;
        if(r.left<R.left-1||r.right>R.right+1||r.top<R.top-1||r.bottom>R.bottom+1) out.push(f.id+' '+(e.className||e.tagName));}}return out;}""")
    for s in spill:
        print("  SPILL", s)
    out = []
    for fr in pg.query_selector_all(".frame"):
        fid = fr.get_attribute("id")
        p = html.parent / f"{fid}.png"
        fr.screenshot(path=str(p))
        out.append(p)
    return out


def main(paths):
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=2)
        for a in paths:
            for p in render(pg, Path(a)):
                print(p)
        b.close()


if __name__ == "__main__":
    main(sys.argv[1:])
