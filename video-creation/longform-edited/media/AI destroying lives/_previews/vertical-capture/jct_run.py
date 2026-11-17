"""R-JCT in mobile view, round 2: CoinGecko Janction 1M chart, re-laid out TALLER (Highcharts setSize) so the panel fills 9:16;
range bar / Compare / chart-type toggles hidden; ends on blank page margin."""
import sys, time, datetime, json
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\AI destroying lives\vertical-qa\receipts-build")
import rc
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
OUT = Path(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\AI destroying lives\assets\vertical\receipts\R-JCT-price-chart.png")
CH = float(sys.argv[1]) if len(sys.argv) > 1 else 560
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.coingecko.com/en/coins/janction", wait=8000, scroll_through=False)
    y = rc.y_of(pg, "Janction Price Chart (JCT)")[0]
    pg.evaluate(f"window.scrollTo(0,{y-100})"); time.sleep(1.5)
    pg.get_by_role("button", name="1M", exact=True).first.click(); time.sleep(4)
    rc.unfix(pg)
    print("hid:", rc.hide_card(pg, "Ask Gecko AI"), "|", rc.hide_card(pg, "14d"))
    # hide the range bar (7D..Max + icons), the Compare dropdown and the chart-type toggles row
    print(pg.evaluate("""()=>{ const hid=[]; const hideUp=(el,stop)=>{ let c=el; for(let i=0;i<6&&c&&c.parentElement;i++){ const r=c.parentElement.getBoundingClientRect(); if(r.height>90||c.parentElement.querySelector('canvas,svg.highcharts-root')) break; c=c.parentElement; } c.style.setProperty('display','none','important'); hid.push(c.tagName+' '+(c.className||'').toString().slice(0,30)); };
        const btn=[...document.querySelectorAll('button')].filter(b=>/^(7D|1M|3M|YTD|1Y|Max)$/.test(b.textContent.trim()));
        if(btn.length) hideUp(btn[0]);
        [...document.querySelectorAll('button,div,span')].filter(e=>e.children.length<4&&/^Compare/.test((e.textContent||'').trim())&&e.getBoundingClientRect().height>20&&e.getBoundingClientRect().height<80).slice(0,1).forEach(e=>hideUp(e));
        [...document.querySelectorAll('button')].filter(e=>/^Price/.test((e.textContent||'').trim())).slice(0,1).forEach(e=>hideUp(e));
        return hid}"""))
    time.sleep(0.6)
    # hide the leftover chart-type pill (between the title and the chart)
    print("pill:", pg.evaluate("""()=>{const ch=document.querySelector('.highcharts-container').getBoundingClientRect().top+scrollY; const out=[];
        document.querySelectorAll('button').forEach(b=>{const r=b.getBoundingClientRect(); const y=r.top+scrollY; if(r.height>0&&y<ch&&y>ch-140){ let c=b; while(c.parentElement && c.parentElement.getBoundingClientRect().height<110 && c.parentElement.querySelectorAll('button').length<=4) c=c.parentElement; c.style.setProperty('display','none','important'); out.push(c.tagName+' '+(c.className||'').toString().slice(0,30)) }}); return out}"""))
    time.sleep(0.4)
    print("resize:", pg.evaluate(f"""()=>{{ const H={CH};
        const t=document.querySelector('gecko-coin-chart'); const els=[t, ...t.querySelectorAll('div')];
        els.forEach(e=>{{ e.style.setProperty('height', H+'px','important'); e.style.setProperty('min-height', H+'px','important'); }});
        window.dispatchEvent(new Event('resize')); return document.querySelector('.highcharts-container').getBoundingClientRect().height }}"""))
    time.sleep(2.0)
    print("badges hidden:", pg.evaluate("""()=>{let n=0; document.querySelectorAll('.gecko-insight-badge,.gecko-insight-badge-arrow').forEach(e=>{e.style.setProperty('display','none','important'); n++}); return n}"""))
    time.sleep(0.5)
    pg.mouse.move(2, 2); time.sleep(0.6)
    rc.unfix(pg)
    t = rc.y_of(pg, "Janction Price Chart (JCT)")[0]
    info = pg.evaluate("""()=>{const e=document.querySelector('.highcharts-container'); const r=e.getBoundingClientRect(); return {top:r.top+scrollY,bottom:r.bottom+scrollY,h:r.height}}""")
    print("title y", t, "chart", info, "span css", info["bottom"] - t)
    w = rc.choose_window(pg, t - 12, max_end=info["bottom"] + 40, min_frac=0.5)
    print("window", w)
    y0, h = w
    ov = rc.overflow_report(pg, y0, y0 + h)
    im = rc.shoot_window(pg, y0, h, OUT)
    print(f"OK R-JCT-price-chart.png y0={y0} h={h} overflow={len(ov)} {ov[:3]} size={im.size} at {datetime.datetime.now():%Y-%m-%d %H:%M}")
    b.close()
