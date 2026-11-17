"""C6 rebuild: candidate frames at several scroll tops (probe only, not shipped)."""
from rc_lib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
TOPS = [155900, 155960, 156124]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(U, wait_until="load", timeout=240000); time.sleep(8)
    for t in TOPS:
        pg.evaluate("(y)=>window.scrollTo(0,y)", t); time.sleep(4)
        print(t, "->", pg.evaluate("window.scrollY"))
        pg.screenshot(path=str(Path(__file__).parent / f"c6v2-cand-{t}.png"))
    b.close()
