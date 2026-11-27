"""Preview stills of the VERTICAL chart pages while laying them out (chart-builder, longest-bear vertical, 2026-11-25).

python preview.py <page.html> <t> [<t> ...] [--out <dir>] [--size 1080x1920]

One PNG per t (setT(t), as html_clip.py renders it), named <page>-t<t>.png, plus the page's own label boxes printed
(TwoLegs.qa() / Clock.qa()) so a collision shows up as numbers, not only by eye.
"""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page")
    ap.add_argument("t", nargs="+", type=float)
    ap.add_argument("--out", default=str(Path(__file__).resolve().parent / "preview"))
    ap.add_argument("--size", default="1080x1920")
    a = ap.parse_args()
    w, h = (int(v) for v in a.size.split("x"))
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    page = Path(a.page).resolve()
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.goto(page.as_uri())
        pg.wait_for_load_state("networkidle")
        pg.evaluate("document.fonts.ready")
        for t in a.t:
            pg.evaluate(f"window.setT({t:.6f})")
            fn = out / f"{page.stem}-t{t:06.3f}.png"
            pg.screenshot(path=str(fn))
            q = pg.evaluate("(window.TwoLegs || window.Clock).qa()")
            print(fn)
            for b in q["boxes"]:
                print(f"   {b['name']:16} x {b['x0']:7.1f} .. {b['x1']:7.1f}   y {b['y0']:7.1f} .. {b['y1']:7.1f}")
            if "geom" in q:
                print("   geom", json.dumps(q["geom"]))
        br.close()


if __name__ == "__main__":
    main()
