import time,re
from playwright.sync_api import sync_playwright
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
chk={"R4":("https://kasmagazine.com/article/sneakpeaks-and-developments",["obsolete path","months","hard fork"]),
"R5":("https://docs.kaspa.org/toccata",["active on mainnet","ZK Precompiles","Groth16"]),
"R6":("https://github.com/kaspanet/silverscript/releases/tag/v1.0.0",["official release"]),
"R7":("https://kaspa.org/build",["In construction","future direction"])}
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome")
    for k,(u,ts) in chk.items():
        pg=b.new_page(viewport={"width":390,"height":844},user_agent=UA,is_mobile=True,has_touch=True)
        pg.goto(u,wait_until="domcontentloaded");time.sleep(5)
        t=pg.evaluate("document.body.innerText")
        for s in ts:
            for m in re.finditer(re.escape(s),t,re.I):
                print(k,s,"::",t[max(0,m.start()-200):m.end()+200].replace("\n"," | "));print()
        pg.close()
