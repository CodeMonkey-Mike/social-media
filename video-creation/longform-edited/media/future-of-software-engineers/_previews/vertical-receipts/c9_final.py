from vlib import *
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART_ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
CHART = """(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); if(!i) return null; const r=i.getBoundingClientRect();
  return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,ok:i.complete&&i.naturalWidth>0,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc}}"""
PARA = """()=>{const p=[...document.querySelectorAll('p')].find(p=>p.innerText.startsWith('Notably, the rebound is concentrated'));
  const r=p.getBoundingClientRect(); const w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT); let n,rr=null;
  while(n=w.nextNode()){ const i=n.textContent.indexOf('71%'); if(i>=0){ const g=document.createRange(); g.setStart(n,i); g.setEnd(n,i+3); const q=g.getBoundingClientRect(); rr={x:q.x,y:q.y+scrollY,w:q.width,h:q.height}; break; } }
  return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,text:p.innerText,r71:rr}}"""
H2 = """()=>{const h=[...document.querySelectorAll('h2')].find(h=>h.innerText.startsWith('A senior, AI-fluent rebound')); const r=h.getBoundingClientRect(); return {y:r.y+scrollY,h:r.height}}"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    for y in range(0, 9000, 500):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y)
        time.sleep(0.35)
    time.sleep(2)
    ts = now()
    c = pg.evaluate(CHART, CHART_ALT)
    par = pg.evaluate(PARA)
    h2 = pg.evaluate(H2)
    assert c["ok"], "chart image not loaded"
    print("chart", c)
    print("71% sentence present:", "71% of the increase in Software Development job postings between May 2025 and May 2026 came from senior roles" in norm(par["text"]))
    # hide the alt-text caption under the chart: it would be sliced by the bottom edge, and it only repeats the chart title
    n = pg.evaluate("""(()=>{const f=[...document.querySelectorAll('figcaption')].filter(c=>c.innerText.startsWith('Bar graph titled')); f.forEach(e=>e.style.visibility='hidden'); return f.length})()""")
    print("alt-text caption hidden:", n)
    # strip the page container's 1px left/right borders (they run the full height of the frame edge)
    nb = pg.evaluate("""(()=>{let n=0; for(const e of document.querySelectorAll('body *, body')){ const r=e.getBoundingClientRect(); if(r.width<340||r.height<400) continue;
        const cs=getComputedStyle(e); if((parseFloat(cs.borderLeftWidth)>0 && cs.borderLeftStyle!=='none') || (parseFloat(cs.borderRightWidth)>0 && cs.borderRightStyle!=='none')){ e.style.borderLeft='0'; e.style.borderRight='0'; e.style.boxShadow='none'; n++ } } return n})()""")
    print("side borders stripped on", nb, "elements")
    L = pg.evaluate(LINES_JS)
    T = None
    for t in range(int(h2["y"]) - 40, int(h2["y"]) - 20):
        if not any((l[0] < t < l[1] - 1) or (l[0] < t + FRAME_H < l[1] - 1) for l in L):
            T = t
            break
    # prefer 31+ css blank above the heading
    print("chosen T", T, "| heading y", round(h2["y"]), "| heading top gap css", round(h2["y"] - T), "| chart bottom", round(c["y"] + c["h"]), "| frame bottom", round(T + FRAME_H), "| cut lines", cuts(pg, T))
    path = shoot_page(pg, T, "C9-chart.png", settle=2)
    print(path, margin_check(path))
    R = lambda q: {"x": q["x"], "y": q["y"] - T, "w": q["w"], "h": q["h"]}
    save_geo("C9-chart", {"captured": ts, "clip_top_page_y": T, "frame": "390x693.33 css -> 1080x1920 (x2.769)", "chart_rect_css_in_frame": R(c), "paragraph_rect_css_in_frame": R(par),
                          "rect_71_css_in_frame": R(par["r71"]), "source_png": c["src"], "note": "real chart image, not restyled; alt-text caption under it hidden so the frame ends on a blank row"})
    b.close()
