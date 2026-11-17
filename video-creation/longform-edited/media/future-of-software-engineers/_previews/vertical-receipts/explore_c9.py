from vlib import *
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART_ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
EX = HERE / "explore"
CHART = """(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); if(!i) return null; const r=i.getBoundingClientRect();
  return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,ok:i.complete&&i.naturalWidth>0,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc}}"""
PARA = """()=>{const p=[...document.querySelectorAll('p')].find(p=>p.innerText.startsWith('Notably, the rebound is concentrated'));
  const r=p.getBoundingClientRect(); return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,text:p.innerText}}"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    print("docH", pg.evaluate("document.documentElement.scrollHeight"), "scrollW", pg.evaluate("document.documentElement.scrollWidth"))
    for y in range(0, 9000, 500):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.35)
    c = pg.evaluate(CHART, CHART_ALT); par = pg.evaluate(PARA)
    print("chart", c); print("para", {k: v for k, v in par.items() if k != "text"}); print(par["text"])
    print("fixed/sticky:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('*')].filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.y),Math.round(r.height),Math.round(r.width),getComputedStyle(e).position]}).slice(0,10))"""))
    T = int(par["y"] - 90)
    sy, path = shoot(pg, T, "c9-explore.png", outdir=EX, settle=3); print("explore shot at", sy, path)
    b.close()
