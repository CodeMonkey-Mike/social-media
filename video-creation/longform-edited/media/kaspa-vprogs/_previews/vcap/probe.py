import sys,time
from playwright.sync_api import sync_playwright
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
urls={"R2":"https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0","R3":"https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698","R4":"https://kasmagazine.com/article/sneakpeaks-and-developments","R5":"https://docs.kaspa.org/toccata","R6":"https://github.com/kaspanet/silverscript/releases/tag/v1.0.0","R7":"https://kaspa.org/build"}
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome")
    for k,u in urls.items():
        pg=b.new_page(viewport={"width":390,"height":844},device_scale_factor=1,user_agent=UA,is_mobile=True,has_touch=True)
        try:
            pg.goto(u,wait_until="domcontentloaded",timeout=60000); time.sleep(5)
            print(k,pg.title(),pg.evaluate("document.body.scrollWidth"),pg.evaluate("document.body.scrollHeight"))
            pg.screenshot(path=f"probe_{k}.png",full_page=True)
        except Exception as e: print(k,"FAIL",str(e)[:100])
        pg.close()
