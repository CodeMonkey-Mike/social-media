"""chart-builder screenshot driver (growth-vs-product): every `.frame` in each HTML -> <frame-id>.png beside it.
Usage: python _shot.py <file.html> [<file.html> ...]   (headless Chromium via Playwright, 1920x1080, device scale 1)"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    for arg in sys.argv[1:]:
        html = Path(arg).resolve()
        page.goto(html.as_uri(), wait_until="networkidle")
        page.evaluate("""Promise.all([['900','Playfair Display'],['700','DM Sans'],['italic 700','DM Sans'],['600','JetBrains Mono']]
                         .map(([w,f]) => document.fonts.load(w + ' 40px "' + f + '"'))).then(() => document.fonts.ready)""")
        page.wait_for_timeout(400)
        missing = page.evaluate("""[['900','Playfair Display'],['700','DM Sans'],['600','JetBrains Mono']].filter(([w,f]) => !document.fonts.check(w + ' 40px "' + f + '"')).map(x => x[1])""")
        if missing:
            raise SystemExit(f"{html.name}: fonts not loaded: {missing}")
        for fid in page.eval_on_selector_all(".frame", "els => els.map(e => e.id)"):
            out = html.parent / f"{fid}.png"
            page.locator(f"#{fid}").screenshot(path=str(out))
            print(out)
    browser.close()
