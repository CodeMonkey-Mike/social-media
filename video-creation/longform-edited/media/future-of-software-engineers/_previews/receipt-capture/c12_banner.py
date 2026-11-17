from rc_lib import *
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto("https://www.clay.com/blog/gtm-engineering", wait_until="domcontentloaded", timeout=90000); time.sleep(8)
    print("frames:", [f.url[:90] for f in pg.frames])
    info = pg.evaluate("""()=>{
      const out=[];
      const el=document.elementFromPoint(960,1000);
      let e=el; const chain=[]; while(e&&chain.length<8){chain.push(e.tagName+'#'+(e.id||'')+'.'+String(e.className).slice(0,50)); e=e.parentElement||(e.getRootNode&&e.getRootNode().host)||null;}
      const hosts=[...document.querySelectorAll('*')].filter(x=>x.shadowRoot).map(x=>x.tagName+'#'+x.id);
      return {chain,hosts};}""")
    print(info)
    b.close()
