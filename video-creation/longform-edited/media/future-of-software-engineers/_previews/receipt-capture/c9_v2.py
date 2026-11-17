"""C9-chart rebuild (visual-qa FAIL fix): the real Indeed chart + the 71% paragraph directly above it, as one 16:9 element region
(css 1040x585 around the article column, device scale 3.678 -> 3840x2160). No Share rail, no Subscribe box, no Conclusion in frame.
Real chart image from the page (the 2048px variant), not restyled."""
from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART_ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
W = 1040; H = 585
DSF = 3840 / W
TOP_ABOVE_P = 14
CHART = """(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); if(!i) return null; const r=i.getBoundingClientRect();
  return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,ok:i.complete&&i.naturalWidth>0,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc}}"""
PARA = """()=>{const p=[...document.querySelectorAll('main p, article p, p')].find(p=>p.innerText.startsWith('Notably, the rebound is concentrated'));
  const r=p.getBoundingClientRect(); const w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT); let n,rr=null;
  while(n=w.nextNode()){ const i=n.textContent.indexOf('71%'); if(i>=0){ const g=document.createRange(); g.setStart(n,i); g.setEnd(n,i+3); const q=g.getBoundingClientRect(); rr={x:q.x,y:q.y+scrollY,w:q.width,h:q.height}; break; } }
  return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,text:p.innerText,r71:rr}}"""
OVERLAYS = """()=>{const out=[];for(const t of ['Share','Subscribe to Indeed Hiring Lab']){
  const els=[...document.querySelectorAll('body *')].filter(e=>e.innerText&&e.innerText.trim().startsWith(t)&&![...e.children].some(c=>c.innerText&&c.innerText.trim().startsWith(t)));
  for(const e of els.slice(0,3)){const r=e.getBoundingClientRect();out.push({t,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),pos:getComputedStyle(e).position})}}
  return out}"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1920, "height": 1400}, device_scale_factor=DSF, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    for label in CONSENT:
        try:
            bt = pg.get_by_role("button", name=label, exact=True).first
            if bt.is_visible(timeout=400): bt.click(timeout=1500); print("consent clicked:", label); time.sleep(1); break
        except Exception: pass
    pg.evaluate("(sels)=>{for(const s of sels)document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}})}", KILL)
    for y in range(0, 7000, 400):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.5)
    c = pg.evaluate(CHART, CHART_ALT); par = pg.evaluate(PARA)
    print("chart", c); print("para:", {k: v for k, v in par.items() if k != "text"}); print("para text:", par["text"][:400])
    top = par["y"] - TOP_ABOVE_P
    S = top - 700   # region sits low in the (tall) window, under the sticky Share rail + Subscribe box
    pg.evaluate("(y)=>window.scrollTo(0,y)", S); time.sleep(4)
    c = pg.evaluate(CHART, CHART_ALT); par = pg.evaluate(PARA); assert c["ok"], "chart image not loaded"
    sy = pg.evaluate("window.scrollY"); ts = now()
    print("scrollY", sy, "| overlays (viewport coords):", pg.evaluate(OVERLAYS))
    cx = c["x"] + c["w"] / 2; x0 = cx - W / 2
    clip = {"x": x0, "y": top - sy, "width": W, "height": H}
    print("clip", clip, "| chart bottom (in clip)", round(c["y"] + c["h"] - top, 1), "of", round(H, 1))
    pg.screenshot(path=str(OUT / "C9-chart.png"), clip=clip)
    F = 1920 / W
    r = lambda q: {"x": (q["x"] - x0) * F, "y": (q["y"] - top) * F, "w": q["w"] * F, "h": q["h"] * F}
    save_geo("C9-chart", {"captured": ts, "scrollY": sy, "framing": f"element region {W}x{round(H)} css (paragraph + chart) at device scale {DSF:.3f}, PNG 3840x2160",
        "chart_rect_in_image_css_px": r(c), "sentence_rect_in_image_css_px": r(par), "rect_71_in_image_css_px": r(par["r71"]),
        "source_png": c["src"], "native_px": c["nat"], "note": "rects are in the 1920x1080 frame (PNG px / 2)"})
    print("captured at", ts)
    b.close()
