import time, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
import rc, rec_det
OUT = Path("../../assets/vertical/receipts/R-SHOWCASE-scroll.mp4").resolve()
CSS = """html,body{overflow-x:hidden!important}
table{table-layout:fixed!important;width:100%!important}
td,th{max-width:none!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;padding-left:7px!important;padding-right:4px!important;vertical-align:middle!important}
td{font-size:12.5px!important;line-height:1.25!important} th{font-size:11.5px!important;line-height:1.2!important}
th:nth-child(1){width:23%!important} th:nth-child(2){width:27%!important} th:nth-child(3){width:23%!important} th:nth-child(4){width:27%!important}"""
SECONDS = 8.967
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://cryptorich.vip/showcase", wait=6000, scroll_through=False, extra_css=CSS,
                              viewport={"width": 390, "height": 693}, dsf=rec_det.DSF)
    time.sleep(1.5)
    y2024 = rc.y_of(pg, "2024")[0]
    print("overflow:", rc.overflow_report(pg)[:3], "y2024", y2024, "H", pg.evaluate("document.documentElement.scrollHeight"))
    ye = y2024 - 26                      # window bottom sits in the blank gap above the "2024" heading
    y_end = ye - rec_det.WIN_H
    T0, T1 = 0.9, SECONDS - 1.0          # hold, scroll, hold
    f = lambda t: y_end * rec_det.ease((t - T0) / (T1 - T0))
    n = rec_det.render(pg, ctx, OUT, SECONDS, f, "rec/showcase")
    print("frames", n, "y_end", round(y_end))
    b.close()
