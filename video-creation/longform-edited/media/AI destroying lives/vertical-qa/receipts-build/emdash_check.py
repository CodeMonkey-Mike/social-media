from playwright.sync_api import sync_playwright
import rc, time
jobs = {"C17": ("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", 4256.25, 693.3), "C24": ("https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/", 2406.7, 649.3),
        "C14": ("https://www.figure.ai/news/production-at-bmw", 0, 1900)}
with sync_playwright() as p:
    for k, (u, y0, h) in jobs.items():
        b, ctx, pg = rc.open_page(p, u, wait=5000, scroll_through=False)
        for r in pg.evaluate(rc.RECTS_JS):
            if r[0]=='t' and r[2] > y0 and r[1] < y0 + h and ('\u2014' in r[5]): print(k, "EM DASH in", r[5])
        txt = pg.evaluate("""([a,b]) => { const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n, out=[]; while((n=w.nextNode())){ if(!n.textContent.includes('\u2014')) continue; const r=document.createRange(); r.selectNodeContents(n); const c=r.getBoundingClientRect(); const y=c.top+scrollY; if(y<b && y+c.height>a) out.push(n.textContent.trim().slice(0,80)); } return out; }""", [y0, y0 + h])
        print(k, "text nodes in window containing U+2014:", len(txt), txt[:3])
        b.close()
