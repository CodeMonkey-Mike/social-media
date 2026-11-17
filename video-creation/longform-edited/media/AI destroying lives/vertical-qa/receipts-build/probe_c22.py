from playwright.sync_api import sync_playwright
import rc, time
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm", wait=5000, scroll_through=False)
    pg.get_by_text("What They Do", exact=True).first.click(); time.sleep(1.5)
    rc.unfix(pg)
    for k in ["General Maintenance and Repair Workers","What They Do","What General Maintenance","Duties","Maintain and repair machines","Keep detailed records","Last modified"]:
        print(k, rc.y_of(pg,k))
    print(pg.evaluate("document.documentElement.scrollHeight"))
    pg.screenshot(path="probe-C22-open.png", full_page=True)
    b.close()
