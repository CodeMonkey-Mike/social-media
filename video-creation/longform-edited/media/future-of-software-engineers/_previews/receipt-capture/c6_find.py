from rc_lib import *
import re
def load_text(p, url, label, settle=8, maxwait=240):
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(url, wait_until="domcontentloaded", timeout=240000)
    print(f"[{label}] status", r.status if r else None, "| title:", pg.title())
    last = -1; t0 = time.time()
    while time.time()-t0 < maxwait:
        n = pg.evaluate("document.body.innerText.length")
        if n == last and n > 50000: break
        last = n; time.sleep(settle)
    print(f"[{label}] text chars {last:,} after {time.time()-t0:.0f}s")
    return b, pg
with sync_playwright() as p:
    # 1. the S-1 itself
    b, pg = load_text(p, "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm", "S-1")
    body = pg.inner_text("body")
    flat = re.sub(r"\s+"," ",body)
    for m in re.finditer(r"contributions to our codebase", flat):
        print("  S-1 HIT:", flat[max(0,m.start()-250):m.end()+200]); 
    print("  S-1 'over 90%' count:", len(re.findall(r"over 90%", flat)))
    b.close()
    # 2. newest amendment I know (No.2, 2026-11-10)
    b, pg = load_text(p, "https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm", "S-1/A No.2")
    flat = re.sub(r"\s+"," ",pg.inner_text("body"))
    print("  A2 header:", flat[:260])
    for m in re.finditer(r"contributions to our codebase", flat):
        print("  A2 HIT:", flat[max(0,m.start()-250):m.end()+200])
    b.close()
