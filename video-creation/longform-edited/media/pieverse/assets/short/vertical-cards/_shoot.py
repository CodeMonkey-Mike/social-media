"""Shoot the pieverse SHORT's native-vertical C1 rebuild (C1.vertical.html, 1080x1920, fonts awaited).

    python _shoot.py                       -> C1-agent-v.png here (the ONE state the short shows, SHORT-CUT-PLAN native_vertical_rebuilds)
    python _shoot.py --states all --out <dir>   -> every state into <dir> (QA only; never into this folder: the short's
                                                    s_vertical_cards node takes the first C1-*v.png it finds here)
Each state is shot SOLO at the page origin (same recipe as ../../charts/_build_charts.py), so the shared pixels are
identical across states."""
import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
HTML = HERE / "C1.vertical.html"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--states", default="agent", help="comma list of state names, or 'all'")
    ap.add_argument("--out", default=str(HERE))
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        pg.goto(HTML.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready.then(() => true)")
        ok = pg.evaluate("""() => ['900 100px "Playfair Display"', '700 39px "DM Sans"', 'italic 400 26px "DM Sans"',
                                   '600 24px "JetBrains Mono"'].every(f => document.fonts.check(f))""")
        if not ok:
            sys.exit("C1.vertical.html: web fonts did not load (Playfair / DM Sans / JetBrains Mono); refusing to shoot")
        pg.wait_for_function("window.WIRES_READY === true")
        pg.add_style_tag(content="body{padding:0!important;gap:0!important;display:block!important}"
                                 ".frame{display:none!important}.frame.solo{display:flex!important}")
        pg.wait_for_timeout(300)
        ids = pg.evaluate("window.FRAME_IDS")
        want = ids if a.states == "all" else [f"C1-{s.strip()}" for s in a.states.split(",")]
        for fid in want:
            if fid not in ids:
                sys.exit(f"unknown state {fid}")
            pg.evaluate("""fid => { document.querySelectorAll('.frame').forEach(f => f.classList.toggle('solo', f.id === fid));
                                    window.scrollTo(0, 0); window.layoutWires(); }""", fid)
            pg.wait_for_timeout(150)
            info = pg.evaluate("""fid => { const f = document.getElementById(fid); const fb = f.getBoundingClientRect();
                const r = {stageBottom: +f.dataset.stageBottom, agentCentre: JSON.parse(f.dataset.agentCentre), nodes: {}, overflow: []};
                f.querySelectorAll('[data-node]').forEach(n => { const b = n.getBoundingClientRect();
                    r.nodes[n.dataset.node] = [Math.round(b.left-fb.left), Math.round(b.top-fb.top), Math.round(b.width), Math.round(b.height)];
                    n.querySelectorAll('*').forEach(c => { const cb = c.getBoundingClientRect();
                        if (c.classList.contains('badge')) return;
                        if (cb.right > b.right - 8 || cb.bottom > b.bottom - 4) r.overflow.push(n.dataset.node + ':' + (c.className || c.tagName)); }); });
                const s = f.querySelector('.src').getBoundingClientRect(); r.src = [Math.round(s.top-fb.top), Math.round(s.bottom-fb.top)];
                const h = f.querySelector('h1').getBoundingClientRect(); r.h1 = [Math.round(h.left-fb.left), Math.round(h.right-fb.left), Math.round(h.top-fb.top), Math.round(h.bottom-fb.top)];
                return r; }""", fid)
            name = f"{fid}-v.png"
            pg.screenshot(path=str(out / name), clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
            print("shot", out / name, json.dumps(info))
        br.close()


if __name__ == "__main__":
    main()
