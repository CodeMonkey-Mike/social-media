import sys
from kit import *
url, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, dsf=1)
    goto(page, url, 6)
    click_buttons(page, CONSENT_BUTTONS)
    page.screenshot(path=out, full_page=True)
    br.close()
