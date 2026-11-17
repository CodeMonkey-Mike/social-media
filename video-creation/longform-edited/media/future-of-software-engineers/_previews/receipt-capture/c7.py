from rc_lib import *
import re
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
with sync_playwright() as p:
    b, pg = open_page(p, URL, wait=7)
    ts = now()
    flat = re.sub(r"\s+"," ", pg.inner_text("body"))
    for n in ["more than 80%", "this number was in the low single digits", "We are not there yet", "Update 9/18/2026"]:
        for m in list(re.finditer(re.escape(n), flat))[:2]:
            print(f"[{n}] ...{flat[max(0,m.start()-190):m.end()+170]}...")
    h1 = rect_of_text(pg, "When AI builds itself")
    r = rect_of_text(pg, SENT)
    print("title rect", h1); print("sentence rect", r)
    # one view: title at the top, sentence in the intro paragraph below it
    top = nice_top(pg, h1["y"] - 80, search=60); print("C7 chosen top", top)
    sy = shoot_at(pg, top, OUT / "C7-title-sentence.png")
    r2 = rect_of_text(pg, SENT)
    save_geo("C7-title-sentence", {"captured": ts, "scrollY": sy, "sentence_rect_in_image_css_px": {"x": r2["x"], "y": r2["y"]-sy, "w": r2["w"], "h": r2["h"], "note": "rect is the whole intro paragraph containing the sentence; the sentence is its 3rd to 4th lines"}})
    print("captured at", ts, "scrollY", sy)
    b.close()
