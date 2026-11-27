"""The deck slides as DECK-AREA pages: each <section> of longest-bear.html, screenshotted at the deck area's size
(1370x1080, the black area left of the webcam on the crypto OBS layout) to assets/share-pages/<section id>.png.
They go into the screen-share scenes of the FINAL with ../../../../skills/card-overlays/share_pages.py (Mike 2026-11-25:
the slides were never on screen during the recording). Rebuild: python assets/card-sources/build_share_pages.py
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

PROJ = Path(__file__).resolve().parents[2]
OUT = PROJ / "assets" / "share-pages"
W, H = 1370, 1080
CSS = """
html{scroll-snap-type:none!important;scroll-behavior:auto!important}
.fade-in{opacity:1!important;transform:none!important;transition:none!important}
#pip-zone,.nav-dots{display:none!important}
.slide{padding:60px 80px 60px 90px!important}
.wrap{max-width:none!important}
h1{font-size:100px!important}
.ey{font-size:26px!important}
.lines{gap:30px!important}
.lines li{font-size:42px!important;line-height:1.3!important}
.chip{font-size:44px!important}
"""


FULL_CSS = """
.slide{padding:60px 140px 60px 150px!important}
h1{font-size:140px!important}
.ey{font-size:34px!important}
.divider{width:110px!important;height:6px!important;margin:48px 0!important}
.lines{gap:42px!important}
.lines li{font-size:58px!important;line-height:1.3!important;padding-left:36px!important;border-left-width:6px!important}
"""
FULL_PAGES = ("four-year-cycle", "three-weeks")   # also as FULL-FRAME covers, 7:30 to 7:59 (Mike 2026-11-25)


VERT_CSS = """
.slide{padding:30px 44px 30px 50px!important}
h1{font-size:92px!important;line-height:1.06!important}
.ey{font-size:24px!important;margin-bottom:14px!important}
.divider{margin:26px 0!important}
.lines{gap:26px!important}
.lines li{font-size:42px!important;line-height:1.28!important}
.chip{font-size:40px!important;padding:10px 22px!important}
.chips{gap:14px!important}
"""
VW, VH = 1080, 850          # the vertical cut's top pane: the 1370x1080 deck area at 1080 wide (cover_runs rounds to 850)

# --vertical-full: FULL_PAGES as FULL-FRAME 1080x1920 covers for the vertical cut (assets/vertical/cards/full-<id>.png).
# Same words, re-composed for the tall frame: the title wraps, the lines stack large, the block sits in y 150..1320
# (the phone's UI owns the lower third). Never touches the 16:9 files.
VFULL_CSS = """
.slide{justify-content:center!important;padding:150px 84px 600px 84px!important}
.slide>*:not(.orb){flex-shrink:0}
h1{font-size:132px!important;line-height:1.04!important}
.ey{font-size:34px!important;margin-bottom:26px!important}
.divider{width:96px!important;height:6px!important;margin:44px 0!important}
.lines{gap:36px!important}
.lines li{font-size:54px!important;line-height:1.25!important;padding-left:34px!important;border-left-width:6px!important}
#three-weeks h1 .go{display:block}     /* "Everything / at once": the gold phrase never splits across lines */
"""
V_SAFE_BOTTOM = 1320


def main():
    if "--vertical-full" in sys.argv:
        return render(PROJ / "assets" / "vertical" / "cards", 1080, 1920, CSS + VFULL_CSS, FULL_PAGES, "full-",
                      safe_bottom=V_SAFE_BOTTOM)
    if "--vertical" in sys.argv:
        return render(PROJ / "assets" / "share-pages-v", VW, VH, CSS + VERT_CSS, None, "")
    if "--full" in sys.argv:
        return render(PROJ / "assets" / "cards", 1920, 1080, CSS + FULL_CSS, FULL_PAGES, "full-")
    render(OUT, W, H, CSS, None, "")


def render(OUT, W, H, CSS, only, prefix, safe_bottom=None):
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H})
        pg.goto((PROJ / "longest-bear.html").as_uri())
        pg.wait_for_load_state("networkidle")
        pg.add_style_tag(content=CSS)
        pg.evaluate("document.fonts.ready")
        if safe_bottom:                 # make sure the mono / display faces have landed before the first shot
            pg.evaluate("""Promise.all(["900 64px 'Playfair Display'", "400 32px 'DM Sans'", "700 32px 'DM Sans'",
                          "600 32px 'JetBrains Mono'"].map(f => document.fonts.load(f, "0123456789$,.%?: abcdefghijklmnopqrstuvwxyz")))""")
            pg.wait_for_timeout(500)
        for sid in only or pg.evaluate("[...document.querySelectorAll('.slide')].map(s => s.id)"):
            pg.evaluate("id => window.scrollTo(0, document.getElementById(id).offsetTop)", sid)
            pg.wait_for_timeout(250)
            bottom = safe_bottom or H
            over = pg.evaluate("([id, w, h, sb]) => { const r = document.querySelector('#' + id + ' .wrap').getBoundingClientRect();"
                               " return r.left < 48 * (sb < h) || r.top < 0 || r.right > w - 48 * (sb < h) || r.bottom > sb }",
                               [sid, W, H, bottom])
            pg.screenshot(path=str(OUT / f"{prefix}{sid}.png"))
            print("page", sid, "OVERFLOWS" if over else "ok")
        b.close()


if __name__ == "__main__":
    main()
