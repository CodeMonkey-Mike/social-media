"""ethereum-rwa slide driver.

Screenshots each standalone full-frame <div class="frame"> at 1920x1080 (device_scale_factor=1
so the PNG is exactly 1920x1080). Writes to a TEMP dir first, then copies into the project
(headless Chrome is blocked from writing directly into Documents).

Output split by TYPE per comp-build.md §10:
  assets/title-slides/  assets/card-slides/

Pass PNG names as argv to render only those (e.g. `python _shot.py "D2-B-buidl@end"`);
with no args it renders every job.
"""
import os, shutil, sys, tempfile
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file://" + os.path.join(HERE, "containers.html").replace("\\", "/")
OUT_TITLE = os.path.abspath(os.path.join(HERE, "..", "title-slides"))
OUT_CARD = os.path.abspath(os.path.join(HERE, "..", "card-slides"))
TMP = os.path.join(tempfile.gettempdir(), "eth-rwa-slides")
for d in (OUT_TITLE, OUT_CARD, TMP):
    os.makedirs(d, exist_ok=True)

TITLE_FRAMES = {"T-CH2", "T-CH3", "T-CH4"}

# (png_name, frame_id, [(selector, class_to_add), ...])
JOBS = [
    # ---- TITLE SLIDES ----
    ("T-CH2", "T-CH2", []),
    ("T-CH3", "T-CH3", []),
    ("T-CH4", "T-CH4", []),

    # ---- CARD SLIDES ----
    # D1: s1 resting (chips hidden) == the COVER-PLAN filename; s2 = roadmap chips reveal ~44.5
    ("D1-tease",    "D1-tease", []),
    ("D1-tease-s1", "D1-tease", []),
    ("D1-tease-s2", "D1-tease", [("#d1-chips", "on")]),

    ("D2-B-buidl",     "D2-B-buidl", []),
    # @end = the CH5 callback RECAP state, NOT a copy of the base card (a duplicate
    # asset trips house rule #12 / lint-covers.js). Own frame, simplified for a ~4s glance.
    ("D2-B-buidl@end", "D2-B-buidl-recap", []),

    # D2-C: s1 resting (no arrow); s2 = direction arrow up ~127.4; base file = finished frame
    ("D2-C-2t",    "D2-C-2t", [("#d2c-arrow", "on")]),
    ("D2-C-2t-s1", "D2-C-2t", []),
    ("D2-C-2t-s2", "D2-C-2t", [("#d2c-arrow", "on")]),

    ("D3-B-stocks", "D3-B-stocks", []),

    ("D4-B-etf",     "D4-B-etf", []),
    # @end = the CH5 callback RECAP state (see note above), simplified for a ~2.3s glance.
    ("D4-B-etf@end", "D4-B-etf-recap", []),

    ("D5-close", "D5-close", []),
]

RESET_JS = "() => document.querySelectorAll('.reveal').forEach(e => e.classList.remove('on'))"


def out_dir(fid):
    return OUT_TITLE if fid in TITLE_FRAMES else OUT_CARD


with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, channel="chrome")
    page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    page.goto(HTML, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2500)  # webfont settle
    only = set(sys.argv[1:])
    for name, fid, mods in JOBS:
        if only and name not in only:
            continue
        page.evaluate(RESET_JS)
        for sel, cls in mods:
            page.eval_on_selector(sel, f"(e) => e.classList.add('{cls}')")
        tmp_path = os.path.join(TMP, name + ".png")
        page.query_selector("#" + fid).screenshot(path=tmp_path)
        shutil.copyfile(tmp_path, os.path.join(out_dir(fid), name + ".png"))
        print("OK", name)
    b.close()
print("DONE ->", OUT_TITLE, "+", OUT_CARD)
