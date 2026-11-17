from vlib import *
DEF = "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation."
with sync_playwright() as p:
    # Clay
    b, ctx, pg = open_mobile(p, "https://www.clay.com/blog/gtm-engineering", wait=8, consent=False)
    for a in range(6):
        pg.mouse.click(195, 752); time.sleep(2.5)
        t = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName:null})()")
        if not (t or "").lower().startswith("div"): break
    flat = norm(pg.inner_text("body"))
    print("CLAY", now())
    print("  definition sentence present:", DEF in flat)
    m = re.search(r"Clay coined the term in \d{4}", flat); print("  self-reported claim:", m.group(0) if m else None)
    print("  title:", "GTM Engineering: What It Is, How It Works, and How to Hire" in flat, "| date Apr 21, 2026:", "Apr 21, 2026" in flat, "| authors:", "Mishti Sharma" in flat and "Varun Anand" in flat)
    b.close()
    # Indeed
    b, ctx, pg = open_mobile(p, "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/", wait=6)
    flat = norm(pg.inner_text("body"))
    print("INDEED", now())
    print("  71% sentence:", "71% of the increase in Software Development job postings between May 2025 and May 2026 came from senior roles, and 37% came from jobs that mention AI in their title" in flat)
    m = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 2026", flat)
    print("  first dateline on page:", m.group(0) if m else None)
    b.close()
