import sys, json, datetime
from playwright.sync_api import sync_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
OUT="../../assets/receipts/"
JS = r"""
(args)=>{
 const {startText,endText,hl,padX,padY,extra}=args;
 function findNode(t){
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n; while(n=w.nextNode()){ if(n.nodeValue.includes(t) && n.parentElement && n.parentElement.offsetParent!==null) return n;}
  return null;
 }
 // highlights first (may split nodes)
 for(const h of hl){
  const n=findNode(h); if(!n) return {err:'hl not found '+h};
  const i=n.nodeValue.indexOf(h);
  const r=document.createRange(); r.setStart(n,i); r.setEnd(n,i+h.length);
  const m=document.createElement('mark'); m.style.cssText='background:#ffe45c;color:#111;padding:2px 0;border-radius:3px;box-shadow:0 0 0 3px #ffe45c';
  r.surroundContents(m);
 }
 // hide fixed/sticky
 for(const el of document.querySelectorAll('*')){const cs=getComputedStyle(el); if(cs.position==='fixed'||cs.position==='sticky'){el.style.visibility='hidden';}}
 const a=findNode(startText), b=findNode(endText);
 if(!a||!b) return {err:'start/end not found', a:!!a, b:!!b};
 const ra=document.createRange(); ra.selectNodeContents(a); const rb=document.createRange(); rb.selectNodeContents(b);
 const A=ra.getBoundingClientRect(), B=rb.getBoundingClientRect();
 let top=A.top+scrollY, bottom=B.bottom+scrollY;
 let left=Math.min(A.left,B.left), right=Math.max(A.right,B.right);
 if(extra==='card'){ let el=b.parentElement; while(el && !(parseFloat(getComputedStyle(el).borderTopLeftRadius)>=14 && el.getBoundingClientRect().width>500)) el=el.parentElement; if(!el) return {err:'no card'}; const R=el.getBoundingClientRect(); return {top:R.top+scrollY,bottom:R.bottom+scrollY,left:R.left,right:R.right}; }
 return {top,bottom,left,right};
}
"""
def cap(pg, name, startText, endText, hl, padX=60, padY=40, extra=None):
    r=pg.evaluate(JS,{'startText':startText,'endText':endText,'hl':hl,'padX':padX,'padY':padY,'extra':extra})
    if 'err' in r: print(name,r); return None
    return r
