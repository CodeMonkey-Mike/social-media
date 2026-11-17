from vlib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
PAGE_TC = r"""(args)=>{ const [needle]=args; const norm=s=>s.replace(/\s+/g,' ');
  const pages=[...document.querySelectorAll('body div')].filter(d=>{const c=getComputedStyle(d);return c.position==='relative'&&c.width==='816px'});
  let idx=-1; for(let i=0;i<pages.length;i++){ if(norm(pages[i].textContent).includes(needle)){idx=i;break} }
  return {idx, tc: norm(pages[idx].textContent), pagenum: (pages[idx+0].parentElement? '' : '')}; }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1000, "height": 800}, device_scale_factor=1, user_agent=UA_D, locale="en-US")
    pg = ctx.new_page()
    pg.goto(U, wait_until="load", timeout=240000); time.sleep(8)
    sp = pg.evaluate(PAGE_TC, [SENT])
    t = sp["tc"]
    i = t.index("Operating Efficiency"); print("idx", sp["idx"], "len", len(t))
    print("TEXT FROM HEADING:", t[i:i+1500])
    cov = pg.evaluate(PAGE_TC, ["FORM S-1"])
    print("COVER:", cov["tc"][:900])
    # newer amendment? EDGAR company filing list for the S-1 form type
    pg3 = ctx.new_page()
    try:
        r = pg3.goto("https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002130357&type=S-1&dateb=&owner=include&count=40", wait_until="load", timeout=90000)
        print("EDGAR list status", r.status if r else None, "|", pg3.title())
        rows = pg3.evaluate("""()=>[...document.querySelectorAll('table.tableFile2 tr')].map(tr=>[...tr.children].map(td=>td.innerText.trim().replace(/\s+/g,' ')).join(' | '))""")
        for x in rows[:12]: print("   ", x[:150])
        if not rows: print("   no table; body:", norm(pg3.inner_text('body'))[:300])
    except Exception as e:
        print("EDGAR list err", str(e).splitlines()[0])
    b.close()
