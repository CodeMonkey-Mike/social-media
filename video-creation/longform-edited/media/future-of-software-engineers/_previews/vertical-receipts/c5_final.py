from vlib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
SENT = "75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall."
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    ts = now()
    flat = norm(pg.inner_text("body"))
    print("75% sentence present:", SENT in flat)
    for n in ["50% last fall", "Apr 22, 2026", "Sundar Pichai", "CEO of Google and Alphabet"]:
        print("  ", n, "->", n in flat)
    # newer-figure check: every 'NN%' near 'code' in the post
    print("  every '% ... code' mention:", [m.group(0)[:120] for m in re.finditer(r"[^.]*\d+%[^.]*code[^.]*\.", flat)])
    # ---- view 2 first (page top): hide the breadcrumb (it is clipped mid-word at 390 wide) but KEEP its space
    pg.evaluate("document.querySelectorAll('uni-breadcrumbs, nav.breadcrumb').forEach(e=>e.style.visibility='hidden')")
    sy, path = shoot(pg, 0, "C5-header.png")
    print("header", sy, path, margin_check(path))
    pg.evaluate("document.querySelectorAll('uni-breadcrumbs, nav.breadcrumb').forEach(e=>e.style.visibility='')")
    # ---- view 1: the coding bullets. find the list + next heading
    r = rect_of_text(pg, SENT); print("sentence li", r)
    sec = rect_of_text(pg, "Second, security"); print("second heading", sec)
    lines = pg.evaluate(LINES_JS)
    c = window_candidates(pg, 3340, 3560, band=64, min_blank=22, lines=lines)
    print("candidates (T, bottom_blank, top_gap):", c[:40])
    open("c5_cands.json", "w").write(json.dumps(c))
    b.close()
