"""Shoot every deck slide (clip-evals.html) at 1920x1080 for painting the empty deck area of the screen-share scenes:
nav dots hidden, every fade-in finished. Writes assets/paint/slide-NN.png (NN = chapter)."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).resolve().parent
DECK = HERE.parents[1] / "clip-evals.html"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto(DECK.as_uri(), wait_until="networkidle"); pg.evaluate("document.fonts.ready")
    pg.add_style_tag(content=".nav-dots{display:none!important} .fade-in{opacity:1!important;transform:none!important;transition:none!important}")
    n = pg.evaluate("document.querySelectorAll('section.slide').length")
    for i in range(n):
        el = pg.locator("section.slide").nth(i); el.scroll_into_view_if_needed(); pg.wait_for_timeout(150)
        out = HERE / f"slide-{i + 1:02d}.png"; el.screenshot(path=str(out)); print(out.name)
    b.close()
