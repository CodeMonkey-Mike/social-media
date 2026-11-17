from vlib import *
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART_ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    for y in range(0, 9000, 500):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.35)
    c = pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); const r=i.getBoundingClientRect(); return {y:r.y+scrollY,h:r.height,x:r.x,w:r.width}}""", CHART_ALT)
    print("chart", c, "bottom", c["y"] + c["h"])
    print("elements 4900-6100 (block-level):")
    print(pg.evaluate("""()=>{const out=[];for(const e of document.querySelectorAll('main *, article *')){const r=e.getBoundingClientRect();const y=r.y+scrollY;
        if(y>4900&&y<6100&&r.height>8&&r.width>150&&['P','H1','H2','H3','H4','FIGURE','FIGCAPTION','IMG','UL','OL','BLOCKQUOTE','DIV'].includes(e.tagName)&&e.children.length<6) out.push([e.tagName,(e.className||'').toString().slice(0,34),Math.round(r.x),Math.round(y),Math.round(r.width),Math.round(r.height),(e.innerText||'').slice(0,40).split(String.fromCharCode(10)).join(' ')].join(' | '))}return out.join(String.fromCharCode(10))}"""))
    L = pg.evaluate(LINES_JS)
    print("text lines 5000-5330:", [(round(l[0]), round(l[1])) for l in L if 5000 < l[0] < 5330][:30])
    print("text lines 5800-5900:", [(round(l[0]), round(l[1])) for l in L if 5800 < l[0] < 5900][:10])
    b.close()
