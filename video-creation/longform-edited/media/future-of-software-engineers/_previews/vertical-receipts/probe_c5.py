from vlib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    print(pg.evaluate("""()=>{
      const q=(s)=>[...document.querySelectorAll(s)].slice(0,6).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,(e.className||'').toString().slice(0,60),Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]});
      return JSON.stringify({bc:q('nav[aria-label*=readcrumb i], [class*=readcrumb]'), img:q('article img, main img, picture img'), hr:q('hr'), hdr:q('header'), figure:q('figure')},null,0)}"""))
    # all block-level children of the header region with their y
    print(pg.evaluate("""()=>{const out=[];for(const e of document.querySelectorAll('main *, article *, body > * *')){const r=e.getBoundingClientRect();const y=r.y+scrollY;if(y<900&&r.height>0&&r.width>200&&['DIV','SECTION','NAV','H1','H2','P','FIGURE','IMG','HR','UL','OL','ASIDE'].includes(e.tagName))out.push([e.tagName,(e.className||'').toString().slice(0,50),Math.round(y),Math.round(r.height),Math.round(r.width)])}return JSON.stringify(out.slice(0,60))}"""))
    # sticky band size after scrolling
    pg.evaluate("window.scrollTo(0,3400)"); time.sleep(1)
    print("sticky:", pg.evaluate("""()=>{const out=[];for(const e of document.querySelectorAll('header, [class*=ticky], [class*=eader]')){const cs=getComputedStyle(e);if(cs.position==='fixed'||cs.position==='sticky'){const r=e.getBoundingClientRect();out.push([e.tagName,(e.className||'').toString().slice(0,50),cs.position,Math.round(r.y),Math.round(r.height)])}}return JSON.stringify(out)}"""))
    b.close()
