"""Shoot the SHORT's native-vertical (1080x1920) card re-shoots from containers.html.

16:9-sourced short mode (vertical-repurpose.md section 1): the same card, same locked light stylesheet, same states,
reflowed at a portrait frame. Writes to assets/short/vertical-cards/:
  <short id>-<slug>-v.png          the main file (the state the card holds for most of the span)
  <short id>-<slug>-v-<state>.png  every state the span shows, + <short id>-<slug>-v.states.json (SHORT seconds)

Run: python _shot_short_v.py
"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "short", "vertical-cards")
HTML = os.path.join(HERE, "containers.html")
FONTS = ["900 80px 'Playfair Display'", "600 30px 'DM Sans'"]

# short id, frame id, file stem, the 16:9 id, short window, main state, [(state, {data-k: class}, from short s, cover clock)]
JOBS = [
    ("beat86", "D-ENTRIES-v", "beat86-d-entries-v", "D-ENTRIES", [19.235, 22.835], "s3", [
        ("s2", {"dv": "ghost", "l3": "ghost"}, 19.235, 519.60),
        ("s3", {}, 19.475, 519.84),
    ]),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    written = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        pg.goto("file:///" + HTML.replace("\\", "/"))
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(800)
        missing = [f for f in FONTS if not pg.evaluate(f"document.fonts.check(\"{f}\")")]
        if missing:
            sys.exit(f"FONTS NOT LOADED: {missing}")
        for sid, fid, stem, src, win, main_state, states in JOBS:
            el = pg.locator(f"[id='{fid}']")
            rows = []
            for st, classes, t0, clock in states:
                pg.evaluate("""([fid, st]) => {
                    document.getElementById(fid).querySelectorAll('[data-k]').forEach(e => {
                        e.classList.remove('ghost','done','on','rest');
                        const c = st[e.dataset.k]; if (c) e.classList.add(c);
                    });
                }""", [fid, classes])
                names = [f"{stem}-{st}.png"] + ([f"{stem}.png"] if st == main_state else [])
                for n in names:
                    path = os.path.join(OUT, n)
                    el.screenshot(path=path)
                    written.append(path)
                rows.append({"state": st, "file": f"{stem}-{st}.png", "from": t0, "cover_clock": clock})
            meta = {"id": sid, "source_16x9": src, "window_short": win, "main": f"{stem}.png", "main_state": main_state,
                    "note": "the 16:9 build progression in SHORT seconds; a comp that steps through it shows each file from its "
                            "`from` to the next state's `from` (the last to the window end)", "states": rows}
            mp = os.path.join(OUT, f"{stem}.states.json")
            with open(mp, "w", encoding="utf-8") as f:
                json.dump(meta, f, indent=1)
            written.append(mp)
        b.close()
    for w in written:
        print(w)


if __name__ == "__main__":
    main()
