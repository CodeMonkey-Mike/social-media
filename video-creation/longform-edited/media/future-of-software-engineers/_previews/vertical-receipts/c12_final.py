from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
DEF = "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation."
TITLE = "GTM Engineering: What It Is, How It Works, and How to Hire"
NAV_BAND = 58   # the sticky nav pill is 56 css px tall


def dismiss_banner(pg):
    for attempt in range(1, 7):
        pg.mouse.click(195, 752)
        time.sleep(2.5)
        top = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName+'#'+(e.id||''):null})()")
        gone = not (top or "").lower().startswith("div#transcend")
        print("banner attempt", attempt, ": element at (195,700) =", top)
        if gone:
            return True
        time.sleep(2)
    return False


with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    assert dismiss_banner(pg), "consent banner would not clear"
    ts = now()
    flat = norm(pg.inner_text("body"))
    print("definition present:", DEF in flat)
    m = re.search(r"Clay coined the term in \d{4}", flat)
    print("self-reported claim:", m.group(0) if m else None)
    print("date present:", "Apr 21, 2026" in flat, "| title present:", TITLE in flat)

    # ---------- view 1: title + date (establish). The hero image (y 490-756) would be sliced by the bottom edge: hide it so the frame ends blank
    n = pg.evaluate("""(()=>{const i=[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.y+scrollY>400&&r.y+scrollY<700&&r.width>250}); i.forEach(e=>e.style.visibility='hidden'); return i.length})()""")
    print("hero image hidden:", n)
    date = rect_of_text(pg, "Apr 21, 2026")
    sy, path = shoot(pg, 0, "C12-title-date.png", settle=1.5)
    print("title-date", sy, path, margin_check(path), "| date rect css", round(date["y"]), round(date["h"]))
    save_geo("C12-title-date", {"captured": ts, "scrollY": sy, "date_rect_css": date, "note": "hero image hidden (it would be sliced by the bottom edge); consent banner accepted"})

    # ---------- view 2: TL;DR definition. keep TL;DR + bullets 1-3, hide bullet 4 and everything after the list
    tl = rect_of_text(pg, "TL;DR")
    hid = pg.evaluate("""()=>{const lis=[...document.querySelectorAll('li')]; const b4=lis.find(l=>l.innerText.startsWith('Great GTM engineers are hybrids')); if(!b4) return -1;
        let n=0; b4.style.visibility='hidden'; n++;
        let el=b4.parentElement; // the UL
        while(el && el.tagName!=='BODY'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement }
        return n}""")
    print("hidden after bullet 3:", hid)
    time.sleep(1)
    lines = pg.evaluate(LINES_JS)
    c = window_candidates(pg, int(tl["y"]) - 330, int(tl["y"]) - 40, band=NAV_BAND, min_blank=30, lines=lines)
    print("candidates (T, bottom_blank, top_gap):", c[:25])
    open("c12_cands.json", "w").write(json.dumps(c))
    if c:
        # prefer a window that keeps the TL;DR line and the whole of bullet 1 below the nav, with the most breathing room at the bottom
        best = sorted(c, key=lambda t: (abs(t[0] - (tl["y"] - 150)), -t[1]))[0]
        T = best[0]
        print("chosen T", T, best)
        sy, path = shoot(pg, T, "C12-definition.png", settle=2)
        d = rect_of_text(pg, DEF)
        print("definition", sy, path, margin_check(path), "| definition li rect in frame (css):", round(d["y"] - sy), round(d["h"]))
        save_geo("C12-definition", {"captured": ts, "scrollY": sy, "definition_li_rect_css_in_frame": {"x": d["x"], "y": d["y"] - sy, "w": d["w"], "h": d["h"]},
                                     "note": "bullet 4 onward hidden so the frame ends on a blank row; includes the 'Clay coined the term in 2023' sentence"})
    b.close()
