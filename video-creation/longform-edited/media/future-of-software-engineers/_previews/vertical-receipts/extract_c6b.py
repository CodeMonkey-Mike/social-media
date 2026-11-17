from vlib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
U2 = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
PAGE_TEXT = r"""(args)=>{
  const [needle, which]=args; const norm=s=>s.replace(/\s+/g,' ');
  const pages=[...document.querySelectorAll('body div')].filter(d=>{const c=getComputedStyle(d);return c.position==='relative'&&c.width==='816px'});
  let idx=which; if(needle){ idx=-1; for(let i=0;i<pages.length;i++){ if(norm(pages[i].textContent).includes(needle)){idx=i;break} } }
  return {idx, text: pages[idx].innerText}; }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1000, "height": 800}, device_scale_factor=1, user_agent=UA_D, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000); time.sleep(8)
    ts = now(); print("CAPTURED AT", ts, "status", r.status)
    cov = pg.evaluate(PAGE_TEXT, [None, 0]); print("--- COVER innerText (page", cov["idx"], ") ---"); print(cov["text"][:2200])
    sp = pg.evaluate(PAGE_TEXT, [SENT, 0]); print("--- SENTENCE PAGE innerText (idx", sp["idx"], ") ---"); print(sp["text"][:2600])
    with open("c6_text.json", "w", encoding="utf-8") as f:
        json.dump({"captured": ts, "cover_text": cov["text"], "sentence_page_idx": sp["idx"], "sentence_page_text": sp["text"]}, f, ensure_ascii=False, indent=1)
    pg2 = ctx.new_page()
    pg2.goto(U2, wait_until="load", timeout=240000); time.sleep(5)
    flat = norm(pg2.evaluate("document.body.textContent"))
    m = re.search(r"As filed with the Securities and Exchange Commission on [A-Za-z]+ ?\d+ ?, ?\d{4}", flat)
    print("A2 filed:", m.group(0) if m else None)
    hits = [flat[max(0, m.start()-90):m.end()+90] for m in re.finditer(r"contributions to our codebase", flat)]
    print("A2 hits:", len(hits)); [print("  A2 HIT:", h) for h in hits[:3]]
    b.close()
