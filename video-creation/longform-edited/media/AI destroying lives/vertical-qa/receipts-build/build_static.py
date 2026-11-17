import sys, time, json, datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
import rc
OUT = Path("../../assets/vertical/receipts").resolve()
which = sys.argv[1:]

def finish(pg, name, target, bg, max_end=None, min_frac=0.80):
    w = rc.choose_window(pg, target, max_end=max_end, min_frac=min_frac)
    assert w is not None, "no clean window near target"
    y0, h = w
    ov = rc.overflow_report(pg, y0, y0 + h)
    im = rc.shoot_window(pg, y0, h, OUT / name)
    print(f"OK {name} y0={y0} (target {target}) overflow_in_window={len(ov)} {ov[:3]} size={im.size} at {datetime.datetime.now():%Y-%m-%d %H:%M}")

with sync_playwright() as p:
    if "C17" in which:
        b, ctx, pg = rc.open_page(p, "https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", wait=6000, scroll_through=False)
        # lazy images only matter near the window: scroll there in small steps
        for y in range(3800, 4800, 200): pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.2)
        y = rc.y_of(pg, "centimeter per second")[0]
        finish(pg, "C17-persona-weld.png", y - 170, "#ffffff"); b.close()
    if "C22" in which:
        b, ctx, pg = rc.open_page(p, "https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm", wait=5000, scroll_through=False)
        pg.get_by_text("What They Do", exact=True).first.click(); time.sleep(1.5); rc.unfix(pg)
        y = rc.y_of(pg, "Duties")[0]
        finish(pg, "C22-bls-maintenance.png", y - 95, "#ffffff"); b.close()
    if "C24" in which:
        b, ctx, pg = rc.open_page(p, "https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/", wait=6000, scroll_through=False)
        for y in range(2000, 3200, 200): pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.2)
        y = rc.y_of(pg, "One of the main value")[0]
        finish(pg, "C24-toyota-atlas.png", y - 40, "#ffffff"); b.close()

with sync_playwright() as p:
    if "R-JCT" in which:
        b, ctx, pg = rc.open_page(p, "https://www.coingecko.com/en/coins/janction", wait=8000, scroll_through=False)
        y = rc.y_of(pg, "Janction Price Chart (JCT)")[0]
        pg.evaluate(f"window.scrollTo(0,{y-100})"); time.sleep(1.5)
        pg.get_by_role("button", name="1M", exact=True).first.click(); time.sleep(4)
        rc.unfix(pg)
        print("hid:", rc.hide_card(pg, "Ask Gecko AI"), "|", rc.hide_card(pg, "14d"))
        time.sleep(0.5); y = rc.y_of(pg, "Janction Price Chart (JCT)")[0]
        pg.mouse.move(2, 2); time.sleep(0.5)
        print("sel:", pg.evaluate("[...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='1M').map(b=>b.className+'|'+b.getAttribute('aria-pressed')+'|'+b.getAttribute('data-state'))"))
        cmp_ = rc.y_of(pg, "Compare"); print("compare", cmp_)
        finish(pg, "R-JCT-price-chart.png", y - 12, "#ffffff", max_end=cmp_[1] + 16 + 30, min_frac=0.5); b.close()
