"""C9 rebuild probe: layout of the 71% paragraph, the chart figure, the share rail, the subscribe box, the Conclusion."""
from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART_ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    for y in range(0, 7000, 400):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.6)
    print("title:", pg.title())
    img = pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); if(!i) return null; const r=i.getBoundingClientRect();
        const fig=i.closest('figure'); const fr=fig&&fig.getBoundingClientRect();
        return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,ok:i.complete&&i.naturalWidth>0,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc,
                fig: fr&&{x:fr.x,y:fr.y+scrollY,w:fr.width,h:fr.height,html:fig.innerText.slice(0,200)}}}""", CHART_ALT)
    print("chart:", img)
    for t in ["71%", "Subscribe to Indeed Hiring Lab", "Conclusion", "Share"]:
        for i in range(3):
            r = rect_of_text(pg, t, i)
            if r: print(f"[{t}] #{i}", {k: (round(v) if isinstance(v, float) else v) for k, v in r.items() if k != 'text'}, "|", r["text"][:140].replace("\n", " / "))
    # the paragraph(s) around the chart
    paras = pg.evaluate("""(cy)=>[...document.querySelectorAll('p,h2,h3,figure,figcaption')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height),t:e.innerText.slice(0,70).replace(/\\n/g,' ')}}).filter(o=>o.y>cy-900&&o.y<cy+900&&o.w>200)""", img["y"])
    for q in paras: print("  ", q)
    b.close()
