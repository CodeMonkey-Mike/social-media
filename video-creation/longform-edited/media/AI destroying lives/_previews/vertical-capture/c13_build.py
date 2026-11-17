import sys, time, json
from datetime import datetime
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
PROJ = Path(__file__).resolve().parents[2]
OUT = PROJ / "assets" / "vertical" / "receipts" / "C13-welding-workforce.png"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://weldingworkforcedata.com", wait_until="domcontentloaded", timeout=70000); time.sleep(6)
    info = prep(pg)
    pg.add_style_tag(content=".et_pb_scroll_top,.et-pb-icon{display:none !important}")
    txt = pg.evaluate("document.body.innerText")
    assert "320,500" in txt and "157,000" in txt and "SHINING A LIGHT" in txt.upper()
    for y in range(900, 5200, 350):
        pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.35)
    time.sleep(3)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1)
    r = pg.evaluate("""()=>{const q=s=>{const e=document.querySelector(s); const r=e.getBoundingClientRect(); return [r.top+scrollY,r.bottom+scrollY]};
        const sl=document.querySelector('.et_pb_slide_0').getBoundingClientRect();
        const spans=[...document.querySelectorAll('.preview-footer span')].map(e=>{const r=e.getBoundingClientRect(); return [r.top+scrollY,r.bottom+scrollY]});
        const ages=document.querySelector('.preview-cell img').getBoundingClientRect();
        return {slide:[sl.top+scrollY,sl.bottom+scrollY], spans, img:[ages.top+scrollY, ages.bottom+scrollY]}}""")
    print(r)
    # --- fixed device-px geometry (page css y * 3)
    s_top = r["slide"][0]; sp0 = r["spans"][0][0]; sp_end = r["spans"][-1][1]
    Bs = int(round(r["img"][1]*3)) + 12 + 0     # rows start just under the pie image block (its bottom margin 12 css)
    # B: begin in the blank run under the "AGE 55+" image, end 36 device px under the last text line
    B_top = int(round((sp0 - 7) * 3)); B_bot = int(round((sp_end + 12) * 3))
    B_im = grab(pg, B_top/3, B_bot/3)
    S_top = int(round(s_top*3)) + 205; S_h = 585
    S_im = grab(pg, S_top/3, (S_top+S_h)/3)
    hero_h = FRAME_H - B_im.height - S_im.height
    H_bot = 830
    H_im = grab(pg, (H_bot-hero_h)/3, H_bot/3)
    print("heights", H_im.height, S_im.height, B_im.height, "hero_h", hero_h, "top css", (H_bot-hero_h)/3)
    W = H_im.width
    canvas = Image.new("RGB", (W, FRAME_H), (255,255,255))
    y=0
    for im in (H_im, S_im, B_im):
        canvas.paste(im, (0,y)); y += im.height
    print("stack total", y)
    canvas.save(Path(__file__).parent/"_c13_1170.png")
    out = finish(canvas, OUT)
    chk = check_edges(Image.open(out))
    print(chk, Image.open(out).size, info)
    json.dump({"info":info,"chk":chk,"geom":r,"captured":datetime.now().strftime("%Y-%m-%d %H:%M")}, open(Path(__file__).parent/"c13-report.json","w"), indent=1)
    b.close()
