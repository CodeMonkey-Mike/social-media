from playwright.sync_api import sync_playwright
import rc, time
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm", wait=5000, scroll_through=False)
    pg.get_by_text("What They Do", exact=True).first.click(); time.sleep(1.5); rc.unfix(pg)
    rects = pg.evaluate(rc.RECTS_JS)
    iv = sorted((r[1], r[2], r[5]) for r in rects if r[2] > 700 and r[1] < 2700)
    # merge
    merged=[]
    for t,bt,s in iv:
        if merged and t <= merged[-1][1]: merged[-1][1]=max(merged[-1][1],bt)
        else: merged.append([t,bt])
    for a,c in zip(merged, merged[1:]):
        gap=c[0]-a[1]
        if gap>=8: print(f"gap {a[1]:.0f}-{c[0]:.0f} = {gap:.0f}")
    b.close()
