import sys, json
from playwright.sync_api import sync_playwright
import rc
pages = {
 "C17": ("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", ["Is Shipyard Welding", "centimeter per second", "A Humanoid for Shipyard Welding"]),
 "C22": ("https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm#tab-2", ["What General Maintenance", "Duties", "Keep detailed records", "Last modified"]),
 "C24": ("https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/", ["AI-Powered Robot", "less and less demonstrations", "Russ Tedrake"]),
}
which = sys.argv[1]
url, keys = pages[which]
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, url, wait=6000, scroll_through=(which not in ("C17",)))
    print(which, pg.title(), "H=", pg.evaluate("document.documentElement.scrollHeight"), "scrollW=", pg.evaluate("document.documentElement.scrollWidth"))
    for k in keys: print(k, rc.y_of(pg, k))
    ov = rc.overflow_report(pg); print("overflow:", len(ov), ov[:8])
    pg.screenshot(path=f"probe-{which}-top.png")
    b.close()
