"""Render the plan-to-make-millions slides from containers.html (one standalone 1920x1080 frame per id).

Each id's build states come from the STATES table inside containers.html; every state is written as
<id>-<state>.png and the LAST state is also written as the base <id>.png. Title slides go to
assets/title-slides/, card slides to assets/card-slides/ (comp-build.md section 10 merged layout).

Run: python _shot.py [id ...]     (no ids = all)
"""
import os
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
HTML = os.path.join(HERE, "containers.html")
TITLE_IDS = {"title-CH2", "title-CH3", "title-CH5"}
FONTS = ["900 80px 'Playfair Display'", "600 30px 'DM Sans'", "600 30px 'JetBrains Mono'"]


def main(only):
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        pg.goto("file:///" + HTML.replace("\\", "/"))
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(800)
        missing = [f for f in FONTS if not pg.evaluate(f"document.fonts.check(\"{f}\")")]
        if missing:
            sys.exit(f"FONTS NOT LOADED: {missing}")
        states = pg.evaluate("Object.fromEntries(Object.entries(STATES).map(([k,v]) => [k, v.map(s => s[0])]))")
        written = []
        for fid, sufs in states.items():
            if only and fid not in only:
                continue
            out_dir = os.path.join(ASSETS, "title-slides" if fid in TITLE_IDS else "card-slides")
            os.makedirs(out_dir, exist_ok=True)
            for n, suf in enumerate(sufs):
                pg.evaluate(f"applyState({fid!r}, {n})")
                el = pg.locator(f"[id='{fid}']")
                names = [f"{fid}-{suf}.png"] if suf else []
                if n == len(sufs) - 1:
                    names.append(f"{fid}.png")
                for name in names:
                    path = os.path.join(out_dir, name)
                    el.screenshot(path=path)
                    written.append(path)
        b.close()
    for w in written:
        print(w)


if __name__ == "__main__":
    main(set(sys.argv[1:]))
