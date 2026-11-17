from rc_lib import *
URL = "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/"
with sync_playwright() as p:
    b, pg = open_page(p, URL)
    ts = now()
    sent = "75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall."
    r = rect_of_text(pg, sent)
    print("sentence rect", r)
    hd = rect_of_text(pg, "Staying on the cutting-edge")
    print("section heading rect", hd)
    # view 1: window opens a little above the section heading so heading + coding bullets + start of security all sit in frame
    top = max(0, hd["y"] - 90)
    sy = shoot_at(pg, top, OUT / "C5-sentence.png")
    r2 = rect_of_text(pg, sent)
    save_geo("C5-sentence", {"captured": ts, "scrollY": sy, "viewport": [1920,1080], "scale": 2, "sentence_rect_in_image_css_px": {"x": r2["x"], "y": r2["y"]-sy, "w": r2["w"], "h": r2["h"]}})
    # view 2: the post header (title, date, byline)
    sy = shoot_at(pg, 0, OUT / "C5-header.png")
    bl = rect_of_text(pg, "CEO of Google and Alphabet")
    dt = rect_of_text(pg, "Apr 22, 2026")
    save_geo("C5-header", {"captured": ts, "scrollY": sy, "byline_rect": bl, "date_rect": dt})
    print("captured at", ts)
    b.close()
