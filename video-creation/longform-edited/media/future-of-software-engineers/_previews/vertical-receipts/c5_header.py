from vlib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    ts = now()
    # hide the whole breadcrumb row (text + its chevron button) but keep its height, so nothing else moves
    n = pg.evaluate("(()=>{const e=document.querySelector('.uni-article-hero__header'); if(!e) return 0; e.style.opacity='0'; return 1})()")
    print("breadcrumb row hidden:", n)
    sy, path = shoot(pg, 0, "C5-header.png", settle=1.5)
    print("scrollY", sy, path, margin_check(path))
    save_geo("C5-header", {"captured": ts, "scrollY": sy, "note": "breadcrumb row opacity:0 (clipped mid-word at 390 wide), space kept"})
    b.close()
