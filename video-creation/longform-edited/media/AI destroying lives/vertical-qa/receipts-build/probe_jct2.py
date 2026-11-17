from playwright.sync_api import sync_playwright
import rc, time
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.coingecko.com/en/coins/janction", wait=8000, scroll_through=False)
    y = rc.y_of(pg, "Janction Price Chart (JCT)"); print(y)
    pg.evaluate(f"window.scrollTo(0,{y[0]-100})"); time.sleep(1.5)
    btn = pg.get_by_role("button", name="1M", exact=True)
    print(btn.count())
    for i in range(btn.count()):
        print(i, btn.nth(i).is_visible(), btn.nth(i).bounding_box())
    btn.first.click(); time.sleep(3)
    for k in ["24H","7D","1M","3M","YTD","1Y","Max"]:
        print(k, rc.y_of(pg,k))
    pg.screenshot(path="probe-JCT-1m.png", clip={"x":0,"y":y[0]-60,"width":390,"height":900}, full_page=True)
    b.close()
