from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
JS = r"""()=>{
  const h=document.querySelector('h1'); const out=[];
  let el=h; for(let i=0;i<7&&el;i++){ const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
    out.push(['UP',i,el.tagName,(el.className||'').toString().slice(0,60),Math.round(r.y+scrollY),Math.round(r.height),cs.position,cs.minHeight,cs.height,cs.display]); el=el.parentElement; }
  // siblings of the hero section between h1 block and the first paragraph
  const p1=[...document.querySelectorAll('main p, article p')].find(p=>p.innerText.startsWith('For most of'));
  let e2=p1; for(let i=0;i<7&&e2;i++){ const r=e2.getBoundingClientRect(), cs=getComputedStyle(e2);
    out.push(['P1UP',i,e2.tagName,(e2.className||'').toString().slice(0,60),Math.round(r.y+scrollY),Math.round(r.height),cs.position,cs.minHeight,cs.height,cs.marginTop,cs.paddingTop]); e2=e2.parentElement; }
  // the art: canvas/svg/img/video in the first 900px
  const arts=[...document.querySelectorAll('canvas,svg,img,video,picture')].map(a=>{const r=a.getBoundingClientRect();return [a.tagName,(a.className&&a.className.baseVal!==undefined?a.className.baseVal:a.className||'').toString().slice(0,50),Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]}).filter(a=>a[3]>150&&a[3]<1200&&a[5]>100);
  arts.forEach(a=>out.push(['ART',...a]));
  return out.map(o=>o.join(' | ')).join(String.fromCharCode(10));}"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=7)
    print(pg.evaluate(JS))
    b.close()
