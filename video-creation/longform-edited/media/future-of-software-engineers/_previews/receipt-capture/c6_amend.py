from rc_lib import *
import re
def norm(s): return re.sub(r"\s+"," ",s)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    # A) S-1/A No.2 text
    pg = ctx.new_page()
    pg.goto("https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm", wait_until="load", timeout=240000); time.sleep(5)
    flat = norm(pg.evaluate("document.body.textContent"))
    print("A2 chars", len(flat))
    print("A2 filed:", re.search(r"As filed with the Securities and Exchange Commission on [A-Za-z]+ ?\d+ ?, ?\d{4}", flat).group(0))
    for m in re.finditer(r"contributions to our codebase", flat):
        print("  A2 HIT:", flat[max(0,m.start()-110):m.end()+110])
    pg.close()
    # B) EDGAR filing lists, as a real navigation
    for u in ["https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002130357&type=S-1&dateb=&owner=include&count=40",
              "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002130357&owner=include&count=40"]:
        pg = ctx.new_page()
        try:
            r = pg.goto(u, wait_until="load", timeout=90000)
            print("INDEX status", r.status if r else None, "| title:", pg.title())
            t = norm(pg.inner_text("body"))
            print("  ", t[:200])
            rows = pg.evaluate("""()=>[...document.querySelectorAll('table.tableFile2 tr')].map(tr=>[...tr.children].map(td=>td.innerText.trim().replace(/\s+/g,' ')).join(' | '))""")
            for r_ in rows[:25]: print("   ", r_[:160])
        except Exception as e:
            print("INDEX err", str(e).splitlines()[0])
        pg.close()
    b.close()
