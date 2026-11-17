from vlib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
SENT = "75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall."
EX = HERE / "explore"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    print("docH", pg.evaluate("document.documentElement.scrollHeight"), "innerW", pg.evaluate("innerWidth"), "scrollW", pg.evaluate("document.documentElement.scrollWidth"))
    for t in ["Apr 22, 2026", "CEO of Google and Alphabet", "Staying on the cutting-edge", SENT]:
        print(t[:40], rect_of_text(pg, t))
    print("sentence present:", SENT in norm(pg.inner_text("body")))
    sy, path = shoot(pg, 0, "c5-top.png", outdir=EX); print("top", sy, path)
    r = rect_of_text(pg, SENT)
    sy, path = shoot(pg, r["y"] - 300, "c5-sent.png", outdir=EX); print("sent", sy, path)
    b.close()
