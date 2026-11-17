from vlib import *
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
SENT = "71% of the increase in Software Development job postings between May 2025 and May 2026 came from senior roles"
INK_L, INK_R, NAT_W = 38, 2009, 2048      # content bbox of the 2048-wide source PNG
EDGE = 9                                    # css px of page margin kept each side of the chart ink (= 25 px in the 1080 frame)
GAP_EXTRA = 22                              # extra css px between the paragraph and the chart (breathing room, uses the freed height)

IMG = """(alt)=>[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt))"""
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    for y in range(0, 9000, 500):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.35)
    time.sleep(2)
    try: pg.wait_for_load_state("networkidle", timeout=15000)
    except Exception: print("networkidle timeout (continuing)")
    ts = now()
    ok = pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); return {complete:i.complete,src:i.currentSrc.split('/').pop()}}""", ALT)
    print("chart loaded:", ok)
    flat = norm(pg.inner_text("body"))
    print("71% sentence present:", SENT in flat)
    # (1) hide the alt-text caption under the chart, (2) strip the page container's 1px side borders, (3) widen the chart so its INK spans edge to edge
    W_css = (390 - 2 * EDGE) / ((INK_R - INK_L) / NAT_W)
    left = EDGE - INK_L / NAT_W * W_css
    r = pg.evaluate("""([alt,W,left,gap])=>{
        const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt));
        document.querySelectorAll('figcaption').forEach(c=>{ if(c.innerText.startsWith('Bar graph titled')) c.style.visibility='hidden' });
        let n=0; for(const e of document.querySelectorAll('body *, body')){ const q=e.getBoundingClientRect(); if(q.width<340||q.height<400) continue;
            const cs=getComputedStyle(e); if((parseFloat(cs.borderLeftWidth)>0&&cs.borderLeftStyle!=='none')||(parseFloat(cs.borderRightWidth)>0&&cs.borderRightStyle!=='none')){e.style.borderLeft='0';e.style.borderRight='0';e.style.boxShadow='none';n++} }
        // let the image escape every ancestor's width / overflow clamp
        let a=i.parentElement; while(a&&a.tagName!=='BODY'){ a.style.overflow='visible'; a=a.parentElement }
        const q0=i.getBoundingClientRect();
        i.style.maxWidth='none'; i.style.width=W+'px'; i.style.height='auto'; i.style.position='relative'; i.style.left=(left-q0.x)+'px';
        const fig=i.closest('figure')||i.parentElement; fig.style.marginTop=(parseFloat(getComputedStyle(fig).marginTop)+gap)+'px';
        return n}""", [ALT, W_css, left, GAP_EXTRA])
    print("borders stripped on", r, "elements | chart css width", round(W_css, 1), "left", round(left, 2))
    time.sleep(1.5)
    g = pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); const q=i.getBoundingClientRect();
        const h=[...document.querySelectorAll('h2')].find(h=>h.innerText.startsWith('A senior, AI-fluent rebound')); const hr=h.getBoundingClientRect();
        return {img:{x:q.x,y:q.y+scrollY,w:q.width,h:q.height}, h2:{y:hr.y+scrollY,h:hr.height}, docW:document.documentElement.scrollWidth}}""", ALT)
    print(g)
    # ink bottom of the chart in css = img top + (INK bottom 1060 / 1170) * h
    ink_top = g["img"]["y"]; ink_bot = g["img"]["y"] + g["img"]["h"] * 1060 / 1170
    block_top = g["h2"]["y"]; block_bot = ink_bot
    block_h = block_bot - block_top
    T = int(round(block_top - (FRAME_H - block_h) / 2))
    print("block css", round(block_top), round(block_bot), "height", round(block_h, 1), "| T", T, "| top margin css", round(block_top - T, 1), "| bottom margin css", round(T + FRAME_H - block_bot, 1))
    # anything else inside the frame (outside the heading..chart block) is hidden so the frame has blank margins above and below
    L = pg.evaluate(LINES_JS)
    stray = [l for l in L if (T - 2 <= l[0] < block_top - 4) or (block_bot + 4 < l[1] <= T + FRAME_H + 2) or (l[0] < T and l[1] > T) or (l[0] < T + FRAME_H < l[1])]
    print("stray text lines in the margins:", [(round(l[0]), round(l[1])) for l in stray][:20])
    hid = pg.evaluate("""([top,bot,T,H])=>{ let n=[]; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let t;
        while(t=w.nextNode()){ if(!t.textContent.trim())continue; const pe=t.parentElement; if(!pe)continue; const rg=document.createRange(); rg.selectNodeContents(t);
          for(const q of rg.getClientRects()){ const y0=q.top+scrollY,y1=q.bottom+scrollY; if(q.width<2)continue;
            if(y1>T-4 && y0<T+H+4 && (y1<=top+2 || y0>=bot-2)){ pe.style.visibility='hidden'; n.push(pe.tagName+':'+t.textContent.trim().slice(0,30)); break } } }
        // also hide images / media that intrude in the margins
        for(const im of document.querySelectorAll('img,svg,video,iframe,figure')){ const q=im.getBoundingClientRect(); const y0=q.top+scrollY,y1=q.bottom+scrollY;
          if(q.width>40 && y1>T-4 && y0<T+H+4 && (y1<=top+2 || y0>=bot-2) && !im.contains(document.querySelector('h2'))){ im.style.visibility='hidden'; n.push(im.tagName) } }
        return n }""", [block_top, block_bot, T, FRAME_H])
    print("hidden margin elements:", hid)
    time.sleep(1)
    L = pg.evaluate(LINES_JS)
    print("cut lines at frame edges:", cuts(pg, T))
    # any element wider than the viewport inside the frame?
    over = pg.evaluate("""([T,H])=>{const o=[];for(const e of document.querySelectorAll('body *')){const q=e.getBoundingClientRect();const y0=q.top+scrollY,y1=q.bottom+scrollY;const cs=getComputedStyle(e);
        if(cs.visibility==='hidden'||cs.display==='none')continue; if(y1>T&&y0<T+H&&q.width>0&&(q.right>390.5||q.left<-0.5)&&q.height>2&&q.width<2000)o.push(e.tagName+' '+Math.round(q.left)+'..'+Math.round(q.right)+' '+(e.className||'').toString().slice(0,30))}return o.slice(0,12)}""", [T, FRAME_H])
    print("elements overflowing the 390 px viewport inside the frame:", over)
    path = shoot_page(pg, T, "C9-chart.png", settle=2)
    print(path, margin_check(path))
    save_geo("C9-chart", {"captured": ts, "clip_top_page_y": T, "chart_src": ok["src"], "chart_css_width": W_css, "block_h_css": block_h,
                          "note": "v2: real 2048 px chart PNG as served to the mobile page, widened so its ink spans edge to edge; heading + 71% paragraph above; block centred; margins blanked; alt-text caption hidden"})
    b.close()
