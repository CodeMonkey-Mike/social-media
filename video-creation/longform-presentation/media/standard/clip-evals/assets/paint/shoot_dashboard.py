"""Capture the Evals dashboard (http://localhost:8766/evals.html) for CH15's three screen-share lines, at the width of
the deck area (1360 px) and full height, then pad to 1920x1080 with the page's own background so the webcam sits on
the right as filmed. Writes assets/paint/dash-top.png, dash-batch.png, dash-replays.png."""
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = Path(__file__).resolve().parent
W, H = 1360, 1080
def pad(src, dst):
    im = Image.open(src).convert("RGB").resize((W, H)); bg = im.getpixel((W - 4, H - 4))
    c = Image.new("RGB", (1920, 1080), bg); c.paste(im, (0, 0)); c.save(dst); Path(src).unlink()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": round(W / 1.35), "height": round(H / 1.35)}, device_scale_factor=1.35)
    pg.goto("http://localhost:8766/evals.html", wait_until="networkidle")
    pg.wait_for_selector("#batchTable tr.batch"); pg.wait_for_timeout(500)
    pg.screenshot(path=str(HERE / "t.png")); pad(HERE / "t.png", HERE / "dash-top.png")
    row = pg.locator('#batchTable tr.batch[data-batch="best-time"]'); row.click(); pg.wait_for_timeout(500)
    row.evaluate("e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 100)"); pg.wait_for_timeout(300)
    pg.screenshot(path=str(HERE / "t.png")); pad(HERE / "t.png", HERE / "dash-batch.png")
    h = pg.locator("#batchTable h3", has_text="Replays").first
    h.evaluate("e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 100)"); pg.wait_for_timeout(300)
    pg.screenshot(path=str(HERE / "t.png")); pad(HERE / "t.png", HERE / "dash-replays.png")
    b.close()
print("ok")
