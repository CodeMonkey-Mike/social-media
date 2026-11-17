from rc_lib import *
import re
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    sizes = []
    pg.on("response", lambda r: sizes.append((r.status, r.url[-60:], r.headers.get("content-length"), r.headers.get("content-type"))))
    pg.goto(U, wait_until="commit", timeout=240000)
    for i in range(12):
        time.sleep(5)
        try:
            d = pg.evaluate("({rs:document.readyState, tc:document.body?document.body.textContent.length:0, it:document.body?document.body.innerText.length:0, el:document.getElementsByTagName('*').length, sh:document.documentElement.scrollHeight})")
            print(i*5+5, "s", d)
        except Exception as e:
            print("eval err", str(e).splitlines()[0])
    print(sizes[:8])
    flat = re.sub(r"\s+"," ", pg.evaluate("document.body.textContent"))
    print("contributions hit:", [flat[max(0,m.start()-200):m.end()+150] for m in re.finditer("contributions to our codebase", flat)][:2])
    b.close()
