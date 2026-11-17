from vlib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
U2 = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
# page container = the DIV(w=816, position:relative) holding absolutely positioned lines
JS_PAGES = r"""()=>{
  const pages=[...document.querySelectorAll('body div')].filter(d=>{const c=getComputedStyle(d);return c.position==='relative'&&c.width==='816px'});
  return pages.length}"""
JS_PAGE_OF = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  const pages=[...document.querySelectorAll('body div')].filter(d=>{const c=getComputedStyle(d);return c.position==='relative'&&c.width==='816px'});
  let idx=-1; for(let i=0;i<pages.length;i++){ if(norm(pages[i].textContent).includes(needle)){idx=i;break} }
  if(idx<0) return null;
  const pg=pages[idx];
  // every absolutely positioned text block with its top/left, so reading order is by (top,left)
  const blocks=[...pg.querySelectorAll('font')].filter(f=>getComputedStyle(f).position==='absolute').map(f=>{const r=f.getBoundingClientRect();const pr=pg.getBoundingClientRect();
      return {t:norm(f.textContent).trim(), x:Math.round(r.x-pr.x), y:Math.round(r.y-pr.y), w:Math.round(r.width), h:Math.round(r.height), b:getComputedStyle(f).fontWeight, fs:getComputedStyle(f).fontSize, ta:getComputedStyle(f).textAlign}});
  return {idx, total:pages.length, blocks};}"""
def A(needle):
    return needle
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1000, "height": 800}, device_scale_factor=1, user_agent=UA_D, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000); time.sleep(8)
    ts = now()
    print("CAPTURED AT", ts, "| status", r.status, "| title", pg.title())
    print("filing pages:", pg.evaluate(JS_PAGES))
    cov = pg.evaluate(JS_PAGE_OF, "FORM S-1")
    print("cover = page index", cov["idx"], "of", cov["total"])
    cov["blocks"].sort(key=lambda q: (q["y"], q["x"]))
    for q in cov["blocks"][:45]: print(f"  y={q['y']:4d} x={q['x']:4d} w={q['w']:4d} fw={q['b']} fs={q['fs']} ta={q['ta']} | {q['t'][:110]}")
    sp = pg.evaluate(JS_PAGE_OF, SENT)
    print("sentence page index", sp["idx"] if sp else None, "(1-based filing page ~", (sp["idx"]+1) if sp else None, ")")
    sp["blocks"].sort(key=lambda q: (q["y"], q["x"]))
    for q in sp["blocks"][:30]: print(f"  y={q['y']:4d} x={q['x']:4d} w={q['w']:4d} fw={q['b']} fs={q['fs']} ta={q['ta']} | {q['t'][:150]}")
    json.dump({"captured": ts, "cover": cov, "sentence_page": sp}, open("c6_text.json", "w"), ensure_ascii=False, indent=1)
    # amendment check
    pg2 = ctx.new_page()
    pg2.goto(U2, wait_until="load", timeout=240000); time.sleep(5)
    flat = norm(pg2.evaluate("document.body.textContent"))
    m = re.search(r"As filed with the Securities and Exchange Commission on [A-Za-z]+ ?\d+ ?, ?\d{4}", flat)
    print("A2 filed:", m.group(0) if m else None)
    for m in re.finditer(r"contributions to our codebase", flat):
        print("  A2 HIT:", flat[max(0, m.start()-90):m.end()+90])
    b.close()
