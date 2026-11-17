from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
EX = HERE / "explore"
PARAS = """()=>{const col=[...document.querySelectorAll('main p, article p')].filter(p=>p.innerText.length>60);
  return col.slice(0,8).map(p=>{const r=p.getBoundingClientRect();return {y:Math.round(r.y+scrollY),h:Math.round(r.height),x:Math.round(r.x),w:Math.round(r.width),t:p.innerText.slice(0,50)}});}"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=7)
    flat = norm(pg.inner_text("body"))
    print("sentence present:", SENT in flat)
    for n in ["more than 80%", "low single digits", "We are not there yet"]:
        m = re.search(re.escape(n), flat)
        print(f"  [{n}] ...{flat[max(0,m.start()-100):m.end()+100]}..." if m else f"  [{n}] NOT FOUND")
    print("docH", pg.evaluate("document.documentElement.scrollHeight"), "scrollW", pg.evaluate("document.documentElement.scrollWidth"))
    print("h1", rect_of_text(pg, "When AI builds itself"))
    print("sub", rect_of_text(pg, "Our progress toward recursive self-improvement"))
    for q in pg.evaluate(PARAS): print("  para", q)
    # fixed/sticky bars
    print("fixed:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('*')].filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.y),Math.round(r.height),Math.round(r.width)]}).slice(0,10))"""))
    sy, path = shoot(pg, 0, "c7-top.png", outdir=EX, settle=2); print(path)
    b.close()
