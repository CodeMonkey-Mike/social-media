from rc_lib import *
import re
URL = "https://digitaleconomy.stanford.edu/news/canariesaug26/"
HIRING = "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations."
GAP = "now stands about 19% below where it would be"
with sync_playwright() as p:
    b, pg = open_page(p, URL, wait=7)
    ts = now()
    head = rect_of_text(pg, "Has Widened to 19%"); print("headline rect", head and {k:head[k] for k in ("x","y","w","h","tag")})
    sy = shoot_at(pg, 0, OUT / "C10-headline.png")
    lab = rect_of_text(pg, "August 12, 2026")
    save_geo("C10-headline", {"captured": ts, "scrollY": sy, "headline_rect": head and {k:head[k] for k in ("x","y","w","h")}, "date_line_rect": lab and {k:lab[k] for k in ("x","y","w","h")}})
    h2 = rect_of_text(pg, "Our six main facts"); print("facts heading rect", h2 and {k:h2[k] for k in ("x","y","w","h","tag")})
    rh = rect_of_text(pg, HIRING); print("hiring rect", rh and {k:rh[k] for k in ("x","y","w","h","tag")})
    rg = rect_of_text(pg, GAP); print("gap rect", rg and {k:rg[k] for k in ("x","y","w","h","tag")})
    T = nice_top(pg, h2["y"] - 50); print("C10 chosen top", T)
    sy = shoot_at(pg, T, OUT / "C10-reduced-hiring.png")
    rh2 = rect_of_text(pg, HIRING); rg2 = rect_of_text(pg, GAP)
    save_geo("C10-reduced-hiring", {"captured": ts, "scrollY": sy,
        "reduced_hiring_rect_in_image_css_px": {"x": rh2["x"], "y": rh2["y"]-sy, "w": rh2["w"], "h": rh2["h"]},
        "gap_19_rect_in_image_css_px": {"x": rg2["x"], "y": rg2["y"]-sy, "w": rg2["w"], "h": rg2["h"]}})
    print("captured at", ts, "scrollY", sy)
    b.close()
