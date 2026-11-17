from rc_lib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    t0=time.time()
    try:
        r = pg.goto(U, wait_until="domcontentloaded", timeout=240000)
        print("status", r.status if r else None, f"{time.time()-t0:.0f}s")
    except Exception as e:
        print("goto error:", str(e).splitlines()[0])
    time.sleep(5)
    print("title:", pg.title())
    txt = pg.inner_text("body")
    print("chars", len(txt)); print(txt[:400].replace("\n"," | "))
    b.close()
