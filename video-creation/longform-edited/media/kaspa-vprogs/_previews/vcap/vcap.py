import time,sys,datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(r"C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/kaspa-vprogs/assets/vertical/receipts")
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mobile/15E148) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
DSF=1080/390
HL_JS="""(phrases)=>{
 const out=[];
 for(const ph of phrases){
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let nodes=[],full='';
  while(w.nextNode()){const n=w.currentNode;if(!n.parentElement||['SCRIPT','STYLE'].includes(n.parentElement.tagName))continue;nodes.push([n,full.length]);full+=n.nodeValue;}
  const norm=s=>s.replace(/\u2019/g,"'");
  const i=norm(full).indexOf(norm(ph));if(i<0){out.push('MISS:'+ph);continue;}
  const j=i+ph.length;
  for(const [n,off] of nodes){const s=Math.max(i,off)-off,e=Math.min(j,off+n.nodeValue.length)-off;
   if(e<=s)continue;const r=document.createRange();r.setStart(n,s);r.setEnd(n,e);
   const m=document.createElement('mark');m.style.cssText='background:#ffe45c;color:#111;border-radius:3px;padding:1px 0;box-decoration-break:clone;-webkit-box-decoration-break:clone';
   try{r.surroundContents(m)}catch(x){}}
  out.push('OK');
 }return out;}"""
POS_JS="(ph)=>{const m=document.querySelector('mark');if(!m)return null;const r=m.getBoundingClientRect();return r.top+scrollY}"
KILL=[".turbo-progress-bar","#topic-progress-wrapper",".topic-timeline",".timeline-container",".topic-navigation","[class*=timeline]","#onetrust-banner-sdk",'[class*="cookie"]','[class*="consent"]','[id*="cookie"]']
# name,url,phrases,clip(top_css,height_css) or ('mark',above,height)
J=[
("R3-b-vitalik-rollup-centric-roadmap-l2-accounts","https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698",["users have their primary accounts, balances, assets, etc entirely inside an L2"],("mark",330,1000),{}),
("R2-rusty-kaspa-v2-toccata-release","https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0",[],(178,1000),{}),
("R3-vitalik-rollup-centric-roadmap","https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698",["the Ethereum ecosystem is likely to be all-in on rollups (plus some plasma and channels) as a scaling strategy","users have their primary accounts, balances, assets, etc entirely inside an L2"],("mark",330,1000),{}),
("R4-kasmagazine-obsolete-path-quote","https://kasmagazine.com/article/sneakpeaks-and-developments",["avoid the obsolete path of L2’s"],("mark",230,1000),{}),
("R5-a-docs-kaspa-toccata-activation","https://docs.kaspa.org/toccata",["active on mainnet as of June 30, 2026, at DAA score 474_165_565"],("mark",380,1000),{}),
("R5-b-docs-kaspa-toccata-zk-precompiles","https://docs.kaspa.org/toccata",["direct verification of Groth16 and RISC Zero Succinct proofs inside script"],("mark",420,1000),{}),
("R6-silverscript-v1-0-0-release","https://github.com/kaspanet/silverscript/releases/tag/v1.0.0",["This release marks the official release of Silverscript"],(178,1000),{}),
("R7-kaspa-org-build-vprogs-in-construction","https://kaspa.org/build",["In construction","Full vProgs remain a future direction"],("mark",330,1000),{}),
("R8-kasmagazine-covenant-fork-3-6-months","https://kasmagazine.com/article/sneakpeaks-and-developments",["three to six months"],("mark",420,1000),{}),
]
flt=sys.argv[1:] 
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome")
    for name,url,phr,clip,_ in J:
        if flt and not any(name.startswith(f) for f in flt):continue
        pg=b.new_page(viewport={"width":390,"height":844},device_scale_factor=DSF,user_agent=UA,is_mobile=True,has_touch=True)
        pg.goto(url,wait_until="domcontentloaded",timeout=60000);time.sleep(6)
        pg.evaluate("(s)=>s.forEach(x=>document.querySelectorAll(x).forEach(e=>e.remove()))",KILL)
        res=pg.evaluate(HL_JS,phr) if phr else []
        time.sleep(.5)
        if clip[0]=="mark":
            y=pg.evaluate("()=>{const m=document.querySelector('mark');return m.getBoundingClientRect().top+scrollY}")
            top=max(0,y-clip[1]);h=clip[2]
        else: top,h=clip
        H=pg.evaluate("document.documentElement.scrollHeight")
        h=min(h,H-top)
        pg.screenshot(path=str(OUT/(name+".png")),full_page=True,clip={"x":0,"y":top,"width":390,"height":h})
        print(name,res,"top",top,"h",h,datetime.datetime.now().isoformat(timespec="seconds"))
        pg.close()
