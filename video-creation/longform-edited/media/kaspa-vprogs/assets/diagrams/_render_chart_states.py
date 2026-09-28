"""Screenshot every `.frame` in a chart HTML to `<frame-id>.png` beside the HTML.

Chart/diagram HTMLs (kaspa-vprogs, chart-builder) build one full-frame 1920x1080 `.frame` per STATE,
cloned from one <template> so every shared element is pixel-identical across states; the frame id is
`<chart-id>-<state>`. Rendered at device scale 2 (3840x2160) per container-canonical.css so comp
push-ins stay crisp.

usage: python _render_chart_states.py <chart.html> [<chart.html> ...]
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
        pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        for a in paths:
            for p in render(pg, Path(a)):
                print(p)
        b.close()


if __name__ == "__main__":
    main(sys.argv[1:])
