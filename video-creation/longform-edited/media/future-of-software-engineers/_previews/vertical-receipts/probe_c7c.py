from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
JS = r"""()=>{const s=document.querySelector('section[class*=hero]'); const out=[];
  const walk=(e,d)=>{ if(d>4) return; for(const c of e.children){ const r=c.getBoundingClientRect(); const cs=getComputedStyle(c);
      out.push('  '.repeat(d)+[c.tagName,(c.className&&c.className.baseVal!==undefined?c.className.baseVal:c.className||'').toString().slice(0,50),Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height),cs.position,c.contains(document.querySelector('h1'))?'HAS-H1':''].join(' | '));
      walk(c,d+1);} };
  walk(s,0); return out.join(String.fromCharCode(10))}"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=7)
    print(pg.evaluate(JS))
    b.close()
