from rc_lib import *
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto("https://www.clay.com/blog/gtm-engineering", wait_until="domcontentloaded", timeout=90000); time.sleep(8)
    host = pg.evaluate("(()=>{const e=document.getElementById('transcend-consent-manager');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()")
    print("host rect before:", host)
    pg.mouse.click(1187, 960); time.sleep(2)
    top_el = pg.evaluate("(()=>{const e=document.elementFromPoint(960,1000);return e?e.tagName+'#'+e.id:null})()")
    host2 = pg.evaluate("(()=>{const e=document.getElementById('transcend-consent-manager');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,disp:getComputedStyle(e).display}})()")
    print("element at banner point after click:", top_el, "| host after:", host2)
    pg.screenshot(path="c12-banner-after-click.png", clip={"x":0,"y":700,"width":1920,"height":380})
    b.close()
