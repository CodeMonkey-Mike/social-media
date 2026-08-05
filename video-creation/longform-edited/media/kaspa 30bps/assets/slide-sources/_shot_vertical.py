"""VERTICAL (9:16) re-shoot of the SAME containers.html at a 1080x1920 viewport.

Sets <html class="v"> so the portrait override block in containers.html applies
(layout reflow only: wrap widths, vertical rhythm, padding, stacked columns).
Writes to assets/vertical/{title-slides,card-slides}/ so the approved 16:9 PNGs
in assets/title-slides/ + assets/card-slides/ are NEVER touched.
Job list + state variants are identical to _shot.py.
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file://" + os.path.join(HERE, "containers.html").replace("\\", "/")
VROOT = os.path.abspath(os.path.join(HERE, "..", "vertical"))
OUT_TITLE = os.path.join(VROOT, "title-slides")
OUT_CARD = os.path.join(VROOT, "card-slides")
TITLE_SLIDES = {"card-40bps-open", "card-fastest-pow", "card-negation", "card-dagknight-intro", "stamp-subsecond", "card-cta-watch"}
os.makedirs(OUT_TITLE, exist_ok=True)
os.makedirs(OUT_CARD, exist_ok=True)


def out_dir(name):
    base = name.rsplit("-s", 1)[0] if name.rsplit("-s", 1)[-1].isdigit() else name
    return OUT_TITLE if base in TITLE_SLIDES else OUT_CARD


# (png_name, frame_id, [(selector, class_to_add), ...])  -- mirrors _shot.py exactly
JOBS = [
    ("card-40bps-open", "card-40bps-open", []),
    ("card-fastest-pow", "card-fastest-pow", []),
    ("card-negation", "card-negation", []),
    ("card-dagknight-intro", "card-dagknight-intro", []),
    ("stamp-subsecond", "stamp-subsecond", []),
    ("card-cta-watch", "card-cta-watch", []),

    ("toccata-features", "toccata-features", []),
    ("toccata-features-s1", "toccata-features", [("#tf-r1", "on")]),
    ("toccata-features-s2", "toccata-features", [("#tf-r2", "on")]),
    ("toccata-features-s3", "toccata-features", [("#tf-r3", "on")]),

    ("card-security-50", "card-security-50", []),

    ("compare-solana-kaspa", "compare-solana-kaspa", []),
    ("compare-solana-kaspa-s1", "compare-solana-kaspa", [("#cmp-k1", "on")]),
    ("compare-solana-kaspa-s2", "compare-solana-kaspa", [("#cmp-k1", "on"), ("#cmp-k2", "on")]),
    ("compare-solana-kaspa-s3", "compare-solana-kaspa", [("#cmp-k1", "on"), ("#cmp-k2", "on"), ("#cmp-k3", "on")]),
    ("compare-solana-kaspa-s4", "compare-solana-kaspa", [("#cmp-k1", "on"), ("#cmp-k2", "on"), ("#cmp-k3", "on"), ("#cmp-k4", "on")]),

    ("card-honest-target", "card-honest-target", []),
    ("card-honest-target-s1", "card-honest-target", [("#ht-r1", "onG")]),
    ("card-honest-target-s2", "card-honest-target", [("#ht-r1", "onG"), ("#ht-r2", "onG")]),
    ("card-honest-target-s3", "card-honest-target", [("#ht-r1", "onG"), ("#ht-r2", "onG"), ("#ht-r3", "onG")]),
]

RESET_JS = """() => {
  document.querySelectorAll('.frow').forEach(e => e.classList.remove('on','onG'));
  document.querySelectorAll('.col.kas li').forEach(e => e.classList.remove('on'));
}"""

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, channel="chrome")
    page = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=2)
    page.goto(HTML, wait_until="networkidle", timeout=30000)
    page.evaluate("() => document.documentElement.classList.add('v')")
    page.wait_for_timeout(1800)  # webfont settle
    for name, fid, mods in JOBS:
        page.evaluate(RESET_JS)
        for sel, cls in mods:
            page.eval_on_selector(sel, f"(e) => e.classList.add('{cls}')")
        el = page.query_selector("#" + fid)
        box = el.bounding_box()
        assert round(box["width"]) == 1080 and round(box["height"]) == 1920, (name, box)
        el.screenshot(path=os.path.join(out_dir(name), name + ".png"))
        print("OK", name)
    b.close()
print("DONE ->", OUT_TITLE, "+", OUT_CARD)
