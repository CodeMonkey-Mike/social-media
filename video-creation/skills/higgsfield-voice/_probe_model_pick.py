#!/usr/bin/env python
"""
_probe_model_pick.py: pick a TTS model in the (already open, or reopened) Model selector and dump the
composer state: the selected voice and the visible controls (speed / emotion / stability...).
Read-only, no generation. Python port of _probe-model-pick.js (2026-11-23).

    python _probe_model_pick.py "Seed Audio 1.0"
"""
import json
import re
import sys

from _cdp import IS_VIS, OPEN_MODEL_SELECTOR_JS, connect, run, shot

SELECTOR_OPEN_JS = """(isVisSrc) => { const isVis = eval(isVisSrc);
  return [...document.querySelectorAll('*')].some(e => (e.innerText||'').trim() === 'Featured models' && isVis(e)); }"""
MODEL_BOX_JS = """([t, isVisSrc]) => { const isVis = eval(isVisSrc); const c = [];
  for (const e of document.querySelectorAll('*')) {
    if ((e.innerText||'').trim() !== t || e.children.length > 1) continue;
    if (!isVis(e)) continue;
    const r = e.getBoundingClientRect(); c.push({ x: r.left + r.width/2, y: r.top + r.height/2, w: r.width }); }
  return c[0] || null; }"""
STATE_JS = """(isVisSrc) => { const isVis = eval(isVisSrc); const out = [];
  for (const e of document.querySelectorAll('*')) { const t = (e.innerText||'').trim();
    if (t && t.length < 40 && e.children.length === 0 && isVis(e)) { const r = e.getBoundingClientRect(); if (r.left < 620) out.push(t); } }
  const sl = [...document.querySelectorAll('input[type=range],[role=slider]')]
    .map(s => s.getAttribute('aria-label') || s.getAttribute('aria-valuenow') || s.name || 'slider');
  return { left: [...new Set(out)], sliders: sl }; }"""


def main():
    if len(sys.argv) < 2:
        print('usage: python _probe_model_pick.py "<model name>"', file=sys.stderr)
        sys.exit(2)
    name = sys.argv[1]
    with connect() as (_browser, _ctx, page):
        if not page.evaluate(SELECTOR_OPEN_JS, IS_VIS):
            page.evaluate(OPEN_MODEL_SELECTOR_JS, IS_VIS)
            page.wait_for_timeout(2000)
        box = page.evaluate(MODEL_BOX_JS, [name, IS_VIS])
        if not box:
            print("MODEL NOT FOUND", name)
            sys.exit(2)
        page.mouse.click(box["x"], box["y"])
        page.wait_for_timeout(2500)
        state = page.evaluate(STATE_JS, IS_VIS)
        print("AFTER picking", name, "-> left panel:", " | ".join(state["left"]))
        print("sliders:", json.dumps(state["sliders"], ensure_ascii=False))
        shot(page, "_model-" + re.sub(r"[^a-zA-Z0-9]+", "-", name) + ".png")


if __name__ == "__main__":
    run(main)
