from playwright.sync_api import sync_playwright
import rc, time
CSS = """html,body{overflow-x:hidden!important}
table{table-layout:fixed!important;width:100%!important}
td,th{max-width:none!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;padding-left:7px!important;padding-right:5px!important}
th,td{font-size:13.5px!important;line-height:1.25!important}
th:nth-child(1){width:25%!important} th:nth-child(2){width:29%!important} th:nth-child(3){width:20%!important} th:nth-child(4){width:26%!important}"""
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://cryptorich.vip/showcase", wait=6000, scroll_through=False, extra_css=CSS)
    time.sleep(1)
    print("H", pg.evaluate("document.documentElement.scrollHeight"), "W", pg.evaluate("document.documentElement.scrollWidth"))
    print("overflow", rc.overflow_report(pg)[:5])
    for k in ["Top Performing Assets", "2026", "2025", "2024", "BSTONK", "WCT", "TURBO"]:
        print(k, rc.y_of(pg, k))
    pg.screenshot(path="probe-show2.png")
    b.close()
