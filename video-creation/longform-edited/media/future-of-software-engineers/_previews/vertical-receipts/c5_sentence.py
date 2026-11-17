from vlib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
SENT = "75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall."
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    ts = now()
    sy, path = shoot(pg, 3453, "C5-sentence.png", settle=2)
    print("scrollY", sy, path, margin_check(path))
    r = pg.evaluate("""(t)=>{const e=[...document.querySelectorAll('li')].find(l=>l.innerText.includes(t));const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}""", "75% of all new code")
    print("sentence li rect in viewport css:", r)
    save_geo("C5-sentence", {"captured": ts, "scrollY": sy, "viewport": [VW, VH], "scale": DSF, "frame": "390x693.33 css window -> 1080x1920",
                              "sentence_li_rect_css_in_frame": r, "px_per_css": 1080/390})
    b.close()
