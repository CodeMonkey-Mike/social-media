p='receipts_run.py'
s=open(p,encoding='utf-8').read()
a=s.index("def job_C13(b):"); z=s.index("def job_C15(b):")
new = r'''def job_C13(b):
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


'''
open(p,'w',encoding='utf-8').write(s[:a]+new+s[z:])
