from playwright.sync_api import sync_playwright
import rc, time
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.coingecko.com/en/coins/janction", wait=8000, scroll_through=False)
    print(pg.title(), pg.evaluate("document.documentElement.scrollHeight"))
    pg.screenshot(path="probe-JCT-top.png")
    b.close()
