#!/usr/bin/env python
"""
_probe_models.py: open the Audio page's Model selector and dump the model names + any per-model
controls. Read-only. Python port of _probe-models.js (2026-11-23).

    python _probe_models.py
"""
from _cdp import IS_VIS, OPEN_MODEL_SELECTOR_JS, connect, run, shot

LEAFS_JS = """(isVisSrc) => { const isVis = eval(isVisSrc); const out = [];
  for (const e of document.querySelectorAll('*')) { const t = (e.innerText||'').trim();
    if (t && t.length < 60 && e.children.length === 0 && isVis(e)) out.push(t); }
  return [...new Set(out)]; }"""


def main():
    with connect() as (_browser, _ctx, page):
        if "/audio" not in page.url:
            page.goto("https://higgsfield.ai/audio", wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
        clicked = page.evaluate(OPEN_MODEL_SELECTOR_JS, IS_VIS)
        print("clicked Model via", clicked)
        page.wait_for_timeout(2000)
        leafs = page.evaluate(LEAFS_JS, IS_VIS)
        print("VISIBLE:", " | ".join(leafs))
        shot(page, "_models.png")


if __name__ == "__main__":
    run(main)
