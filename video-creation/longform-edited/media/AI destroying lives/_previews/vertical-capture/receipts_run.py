"""receipts_run.py: the page receipts of 'AI destroying lives' in MOBILE VIEW (390 css px, scale 3) -> assets/vertical/receipts/.
Usage: python receipts_run.py <id> [<id> ...]   (ids as in JOBS)"""
import json
import sys
import time
from datetime import datetime
from pathlib import Path

from PIL import ImageDraw
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).parent))
import mcap
from mcap import *  # noqa

PROJ = Path(__file__).resolve().parents[2]
OUT = PROJ / "assets" / "vertical" / "receipts"
REPORT = Path(__file__).parent / "receipts-report.json"
OUT.mkdir(parents=True, exist_ok=True)


def load(browser, url, wait=3500, **kw):
    ctx = browser.new_context(viewport={"width": VW, "height": 844}, device_scale_factor=SCALE, user_agent=UA,
                              has_touch=True, locale="en-US")
    page = ctx.new_page()
    page.goto(url, wait_until="domcontentloaded", timeout=70000)
    time.sleep(wait / 1000)
    return ctx, page


def finish_job(ctx, page, parts, name, info, rule=True):
    imgs = [p[0] for p in parts]
    bg = parts[-1][1]
    canvas, total = compose(imgs, bg, rule=rule)
    out = finish(canvas, OUT / name)
    chk = check_edges(Image.open(out))
    ctx.close()
    return name, dict(info, content_device_px=total, frame_device_px=FRAME_H, **chk)


def hide_ad(page):
    page.evaluate("""()=>{document.querySelectorAll('body *').forEach(e=>{ if(e.children.length===0 && /^advertisement$/i.test((e.innerText||'').trim())){
        let c=e; for(let i=0;i<3&&c.parentElement&&c.parentElement!==document.body;i++){ const r=c.parentElement.getBoundingClientRect(); if(r.height>420) break; c=c.parentElement;} c.style.setProperty('display','none','important'); }})}""")


# ---- jobs ---------------------------------------------------------------------------------------------------
def job_C2(b, headline=False):
    ctx, page = load(b, "https://www.challengergray.com/blog/october-layoffs-at-three-year-low-seasonal-hiring-plans-up-26/")
    info = prep(page)
    if headline:
        y_end = find(page, "Publication Date").get("bottom")
        parts = [cut_region(page, 0, y_end + 20, top_edge="page")]
        name = "C2-headline.png"
    else:
        c = find(page, "Closings accounted for 10,250")
        q = find(page, "though the overall pace of cutting remains low")
        parts = [cut_region(page, c["top"] - 6, q["bottom"] + 2)]
        name = "C2-challenger-october.png"
    return finish_job(ctx, page, parts, name, info)


def job_INDEED(b):
    ctx, page = load(b, "https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/")
    info = prep(page)
    h = find(page, "The Labor Market Is Tilting Toward Seniority")
    d = find(page, "July 23, 2026")
    sec = find(page, "Differences across industries")
    end = find(page, "somewhat muted")
    A = cut_region(page, h["top"] - 6, d["bottom"] + 4)
    B = cut_region(page, sec["top"] - 6, end["bottom"] + 2)
    return finish_job(ctx, page, [A, B], "R-INDEED-seniority.png",
                      dict(info, stacked="headline+byline over the 'All of these factors may be at least partially at play' paragraph (two regions of one page)"))


def job_C5(b):
    ctx, page = load(b, "https://www.bls.gov/news.release/ecopro.nr0.htm", wait=3000)
    info = prep(page, scroll=False)
    n = page.evaluate(r"""()=>{let done=0; document.querySelectorAll('pre').forEach(pre=>{const txt=pre.innerText; if(!txt.includes('Although the growing adoption of AI')) return;
        const paras=txt.split(/\n\s*\n/); const box=/[|]|_{4,}|-{6,}/;
        const div=document.createElement('div'); div.style.cssText='font-family:Consolas,monospace;font-size:15px;line-height:1.5;padding:0 16px;color:#111;background:#fff;white-space:normal;margin:0';
        paras.forEach(p=>{ if(box.test(p)) return; const el=document.createElement('p'); el.style.cssText='margin:0 0 22px 0'; el.textContent=p.replace(/\s+/g,' ').trim(); div.appendChild(el)});
        pre.replaceWith(div); done++;}); return done}""")
    assert n == 1, f"pre blocks reflowed: {n}"
    info["reflow"] = "the release is one <pre> of 80-column lines: paragraphs re-joined so the text wraps to the phone column (same words)"
    s0 = find(page, "Although the growing adoption of AI")
    e0 = find(page, "production occupations (-0.4 percent)")
    A = cut_region(page, s0["top"] - 8, e0["bottom"] + 2)
    return finish_job(ctx, page, [A], "C5-bls-ecopro.png", info)


def job_C4(b):
    ctx, page = load(b, "https://www.bls.gov/emp/tables/fastest-declining-occupations.htm", wait=3000)
    info = prep(page, overflow=False)
    page.evaluate("""()=>{const t=document.querySelector('table'); [...t.rows].forEach(r=>{[1,4,6].forEach(i=>{const c=r.cells[i]; if(c) c.style.setProperty('display','none','important')})});
        t.style.width='100%'; t.style.fontSize='12.5px'; t.style.tableLayout='auto'; t.querySelectorAll('th,td').forEach(c=>{c.style.padding='5px 3px'; c.style.minWidth='0'; c.style.fontSize='12.5px'});
        t.querySelectorAll('th').forEach(c=>{c.style.fontSize='11.5px'});}""")
    time.sleep(0.5)
    info["hidden_overflow"] = page.evaluate(JS_OVERFLOW)
    info["note"] = "wide Table 1.5 (685 px) cannot reflow: columns 'matrix code', 'change numeric' and 'median wage' hidden so the title / 2025 / 2035 / percent columns fit the phone column"
    hd = find(page, "Other available formats")
    rows = page.evaluate("""()=>{const t=document.querySelector('table'); const sy=window.scrollY; return [...t.rows].map(r=>r.getBoundingClientRect().bottom+sy)}""")
    logo = find(page, "U.S. Bureau of Labor Statistics")
    hh = find(page, "Fastest declining occupations")
    yA0, yA1 = logo["top"] - 18, logo["top"] + 46
    y0 = hh["top"] - 12
    limit = y0 + 693 - (yA1 - yA0) - 18 - 22
    rb = max(r for r in rows if r <= limit)
    A = cut_hard(page, yA0, yA1, top_edge="exact", margin=6)
    Bn = cut_hard(page, y0, rb, top_edge="exact", lead=0)
    return finish_job(ctx, page, [A, Bn], "C4-bls-declining.png",
                      dict(info, rows_shown=sum(1 for r in rows if r <= rb), stacked="BLS masthead strip over the table title + first rows"))


def job_CSH(b):
    ctx, page = load(b, "https://csh.ac.at/news/how-is-generative-ai-impacting-the-freelance-job-market/")
    info = prep(page)
    d = find(page, "04.02.2025")
    blk = block(page, "over 3 million job postings")
    A = cut_region(page, d["top"] - 6, blk["bottom"] + 2)
    return finish_job(ctx, page, [A], "R-CSH-freelance-study.png", info)


def job_HDH(b):
    ctx, page = load(b, "https://cyprusshippingnews.com/2026/02/27/robotization-wave-hits-shipyards/", wait=4500)
    info = prep(page)
    page.evaluate("""()=>{document.querySelectorAll('img').forEach(i=>{ if((i.alt||'').toLowerCase()==='logo' || /logo/i.test(i.className)){ i.style.setProperty('width','120px','important'); i.style.setProperty('height','auto','important'); i.style.setProperty('max-width','120px','important'); } })}""")
    time.sleep(0.6)
    dt = find(page, "February 27, 2026")
    blk = block(page, "According to industry sources on Feb. 24")
    h1 = find(page, "Robotisation wave hits shipyards")
    A = cut_region(page, 0, h1["bottom"] + 4, top_edge="page")
    B = cut_region(page, blk["top"] - 6, blk["bottom"] + 2)
    print("   HDH parts px:", A[0].height, B[0].height)
    return finish_job(ctx, page, [A, B], "R-HDH-hyundai-robots.png",
                      dict(info, stacked="masthead + headline over the 'According to industry sources' paragraph (211 robots, up from 129)",
                           note="the site's oversized logo overlapped the headline on a phone: logo img clamped to 120 px wide"))


def job_C13(b):
    ctx, page = load(b, "https://weldingworkforcedata.com", wait=6000)
    info = prep(page)
    page.add_style_tag(content=".et_pb_scroll_top,.et-pb-icon{display:none !important}")
    # both figures must be in the DOM (the count-up / lazy slice have finished) before the shot
    txt = page.evaluate("document.body.innerText")
    assert "320,500" in txt and "157,000" in txt, "headline figures not in the DOM"
    for y in range(900, 5200, 350):                  # walk down the page so the slider / lazy blocks are rendered
        page.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.35)
    time.sleep(2.5)
    sl = page.evaluate("""()=>{for(const e of document.querySelectorAll('p')){ if((e.innerText||'').trim().startsWith('320,500')){ let c=e; while(c && !/et_pb_slide /.test((c.className||'')+' ')) c=c.parentElement; const r=c.getBoundingClientRect(); return {top:r.top+scrollY,bottom:r.bottom+scrollY}} } return null}""")
    h4 = page.evaluate("""()=>{const e=document.querySelector('.preview-footer'); const r=e.getBoundingClientRect(); return {top:r.top+scrollY,bottom:r.bottom+scrollY,t:e.innerText}}""")
    print("   C13 slide", sl, "h4", h4)
    A, _ = cut_hard(page, sl["top"], sl["bottom"] + 18, margin=0, top_edge="exact", lead=0, pad=0, bg=(255, 255, 255))
    Bc, _ = cut_hard(page, h4["top"] - 20, h4["bottom"], margin=60, top_edge="exact", lead=0, pad=0, bg=(255, 255, 255))
    left = FRAME_H - A.height - Bc.height
    gap = max(54, int(left * 0.4))
    canvas = Image.new("RGB", (A.width, FRAME_H), (255, 255, 255))
    canvas.paste(A, (0, 0)); canvas.paste(Bc, (0, A.height + gap))
    out = finish(canvas, OUT / "C13-welding-workforce.png")
    chk = check_edges(Image.open(out))
    ctx.close()
    print("   C13 parts px:", A.height, Bc.height, "gap", gap, "bottom blank", FRAME_H - A.height - gap - Bc.height)
    return "C13-welding-workforce.png", dict(info, figures_in_dom=["320,500", "157,000"], **chk,
        stacked="the orange '320,500 new welding professionals needed by 2029' panel over the '157,000 welding professionals approaching retirement' block (two sections of one page)")


def job_C15(b):
    ctx, page = load(b, "https://newsroom.bmwgroup.com/global/bmw-group-advances-the-use-of-physical-ai-in-production-with-figure-03-project-in-spartanburg", wait=4500)
    info = prep(page)
    mcap.BLANK_TOL, mcap.BLANK_PX = 40, 70      # dark page: navy page bg + black card + glow gradient
    h1 = page.evaluate("""()=>{const e=document.querySelector('h1'); const r=e.getBoundingClientRect(); return {top:r.top+scrollY,bottom:r.bottom+scrollY}}""")
    q1 = block(page, "Having already successfully completed a pilot")
    q2 = block(page, "Our 11-month deployment of Figure 02")
    A = cut_region(page, h1["top"] - 6, h1["bottom"] + 2)
    B = cut_region(page, q1["top"] - 6, q2["bottom"] + 2)
    mcap.BLANK_TOL, mcap.BLANK_PX = 12, 10
    return finish_job(ctx, page, [A, B], "C15-bmw-pilot.png",
                      dict(info, stacked="the release headline over the two quote paragraphs ('completed a pilot with Figure 02'); the intro paragraph with the Figure 03 start is left out"))


def job_C16(b):
    ctx, page = load(b, "https://www.agilityrobotics.com/content/digit-moves-over-100k-totes", wait=4500)
    info = prep(page)
    dt = find(page, "November 20, 2025")
    A = cut_fill(page, 0, dt["bottom"] + 4, 693, top_edge="page")
    return finish_job(ctx, page, [A], "C16-digit-totes.png", info)


def killmodal(page):
    """the 'Access Thousands of Articles' sign-up dialog + its backdrop appear on scroll: remove them and any scroll lock"""
    page.evaluate("""()=>{document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
        if((cs.position==='fixed'||/dialog|modal|overlay|backdrop/i.test((e.className||'').toString()+(e.getAttribute('role')||''))) && !(r.top<=2&&r.height<140)) e.style.setProperty('display','none','important')});
        document.documentElement.style.setProperty('overflow','auto','important'); document.body.style.setProperty('overflow','auto','important');
        document.body.style.setProperty('position','static','important'); document.body.classList.forEach(c=>{ if(/modal|lock|noscroll|no-scroll|overlay/i.test(c)) document.body.classList.remove(c)}) }""")


def job_C17(b):
    ctx, page = load(b, "https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", wait=4500)
    info = prep(page)
    page.add_style_tag(content=".lightbox-popup,[class*=lightbox],[id*=Session_Popup]{display:none !important;visibility:hidden !important}")
    AD = ".top-leader-container,.rbl-ad,[id^=rblad],[class*=rbl-ad],iframe[id^=google_ads],[id^=google_ads],ins.adsbygoogle,[class*=sponsor],[class*=Sponsor]"
    page.evaluate("(s)=>{document.querySelectorAll(s).forEach(e=>e.style.setProperty('display','none','important'))}", AD)
    for y in range(0, 7000, 600):                      # let any late ad slot / lazy block settle, hide it again
        page.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.15)
        page.evaluate("(s)=>{document.querySelectorAll(s).forEach(e=>e.style.setProperty('display','none','important'))}", AD)
    page.evaluate("window.scrollTo(0,0)"); time.sleep(1.5)
    killmodal(page)
    h2 = page.evaluate("""()=>{for(const e of document.querySelectorAll('h2')){ if(/Persona AI sees near-term/.test(e.innerText)){const r=e.getBoundingClientRect(); if(r.height>20) return {top:r.top+scrollY,bottom:r.bottom+scrollY}} } return null}""")
    assert h2, "dek not found"
    A, bgA = cut_hard(page, 0, h2["bottom"] + 8, margin=45, top_edge="page", pad=0)
    pg_bg = tuple(int(v) for v in A.getpixel((6, 400)))
    A = A.crop((0, 120, A.width, A.height))     # drop the thin black "IEEE.ORG / sign in" strip: the Spectrum masthead is the top of the frame
    # the weld-speed paragraph: element screenshot (positions on this page move as slots load, an element shot follows it)
    el = page.locator("p", has_text="easily manageable centimeter per second").first
    page.evaluate("""()=>{for(const e of document.querySelectorAll('p')){ if(/easily manageable centimeter per second/.test(e.innerText)){ e.style.setProperty('padding','8px 0 8px 0','important'); } }}""")
    el.scroll_into_view_if_needed(); time.sleep(0.8)
    killmodal(page); time.sleep(0.5)
    tmp = Path(__file__).parent / "_c17p.png"
    el.screenshot(path=str(tmp), animations="disabled")
    bx = el.bounding_box()
    Bi0 = Image.open(tmp).convert("RGB")
    Bi = Image.new("RGB", (A.width, Bi0.height), pg_bg)
    Bi.paste(Bi0, (int(round(bx["x"] * SCALE)), 0))
    Ad = ImageDraw.Draw(A); Ad.rectangle((0, A.height - 45, A.width, A.height), fill=pg_bg)     # bottom margin in the page colour
    print("   C17 parts px:", A.height, Bi.height, "bg", pg_bg, "x", bx["x"])
    return finish_job(ctx, page, [(A, pg_bg), (Bi, pg_bg)], "C17-persona-weld.png",
                      dict(info, stacked="IEEE Spectrum masthead + headline + dek over the paragraph carrying the centimeter-per-second weld speed (two regions of one page)",
                           note="the page's banner ad slots removed"))


def job_KH(b):
    ctx, page = load(b, "https://www.koreaherald.com/article/10883355", wait=4500)
    info = prep(page)
    dek = block(page, "Persona AI exec highlights HD Hyundai")
    blk = block(page, "For the field testing in 2027")
    A = cut_region(page, 0, dek["bottom"] + 2, top_edge="page")
    B = cut_region(page, blk["top"] - 6, blk["bottom"] + 2)
    return finish_job(ctx, page, [A, B], "R-KH-korea-herald.png",
                      dict(info, stacked="masthead + headline + standfirst over the 'field testing in 2027' paragraph"))


def job_C22(b):
    ctx, page = load(b, "https://www.bls.gov/ooh/installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm", wait=3500)
    info = prep(page, scroll=False)
    page.get_by_text("What They Do", exact=True).first.click()
    time.sleep(1.5)
    h = find(page, "What General Maintenance and Repair Workers Do")
    y0 = h["top"] - 14
    A = cut_fill(page, y0, y0 + 480, y0 + 690)
    return finish_job(ctx, page, [A], "C22-bls-maintenance.png", dict(info, note="mobile page collapses the sections; 'What They Do' expanded"))


def job_C24(b):
    ctx, page = load(b, "https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/", wait=4500)
    info = prep(page)
    h2 = page.evaluate("""()=>{const e=document.querySelector('h2'); const r=e.getBoundingClientRect(); return {top:r.top+scrollY,bottom:r.bottom+scrollY}}""")
    blk = block(page, "One of the main value propositions of humanoids")
    page.evaluate("window.scrollTo(0,0)"); time.sleep(0.8)
    M = cut_hard(page, 0, 52, margin=40, top_edge="page", pad=0, bg=(255, 255, 255))      # the TOYOTA NEWSROOM logo strip (source ID)
    import numpy as np
    arr = np.asarray(M[0]).copy(); arr[(arr >= 244).all(axis=2)] = 255      # the header strip's #f8f8f8 -> the page white (no box edge once the frame is centred)
    M = (Image.fromarray(arr), (255, 255, 255))
    A = cut_region(page, h2["top"] - 24, h2["bottom"] + 2)
    B = cut_region(page, blk["top"] - 6, blk["bottom"] + 2)
    return finish_job(ctx, page, [M, A, B], "C24-toyota-atlas.png",
                      dict(info, stacked="TOYOTA NEWSROOM logo strip + pressroom headline over the Tedrake quote paragraph (three regions of one page)"))


def job_C26(b):
    ctx, page = load(b, "https://www.aboutamazon.com/news/retail/amazon-shop-direct-external-stores", wait=4500)
    info = prep(page)
    blk = block(page, "handles the entire purchase process")
    A = cut_region(page, blk["top"] - 330, blk["bottom"] + 2)
    return finish_job(ctx, page, [A], "C26-amazon-agentic.png", info)


def job_C25(b):
    ctx, page = load(b, "https://www.1x.tech/order", wait=5000)
    info = prep(page)
    H = page.evaluate("document.documentElement.scrollHeight")
    n = find(page, "Home Robot")
    A = cut_hard(page, n["top"] - 40, H, margin=60, top_edge="exact", lead=0)
    return finish_job(ctx, page, [A], "C25-1x-order.png", dict(info, page_height=H))


JOBS = {
    "C2": lambda b: job_C2(b),
    "C2-headline": lambda b: job_C2(b, headline=True),
    "R-INDEED": job_INDEED, "C5": job_C5, "C4": job_C4, "R-CSH": job_CSH, "R-HDH": job_HDH, "C13": job_C13,
    "C15": job_C15, "C16": job_C16, "C17": job_C17, "R-KH": job_KH, "C22": job_C22, "C24": job_C24, "C26": job_C26, "C25": job_C25,
}


if __name__ == "__main__":
    ids = sys.argv[1:] or list(JOBS)
    rep = json.loads(REPORT.read_text(encoding="utf-8")) if REPORT.exists() else {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        for i in ids:
            try:
                name, notes = JOBS[i](browser)
                notes["captured"] = datetime.now().strftime("%Y-%m-%d %H:%M")
                rep[i] = dict(file=name, **notes)
                print("OK  ", i, name, json.dumps(notes, ensure_ascii=False), flush=True)
            except Exception as e:
                print("FAIL", i, str(e).splitlines()[0], flush=True)
                rep[i] = dict(error=str(e).splitlines()[0])
        browser.close()
    REPORT.write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
