#!/usr/bin/env python
"""
_open_preset.py: open the voice picker (the "Voice Preset" / "Selected Voice" panel) and dump the
texts on the page, so the available voices can be read. Python port of _open-preset.js (2026-11-23).

    python _open_preset.py
"""
import json

from _cdp import connect, run, shot

# Find a VISIBLE element whose text mentions Voice Preset / Selected Voice; return the centre of its
# clickable ancestor (smallest visible candidate = the panel; walk up to a button / clickable).
TARGET_JS = """() => {
  const isVis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 10 && r.height > 10 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const cands = [...document.querySelectorAll('*')].filter(e => {
    const t = (e.innerText||'').trim().toLowerCase();
    return (t.includes('voice preset') || t.includes('selected voice')) && isVis(e) && t.length < 60; });
  if (!cands.length) return null;
  cands.sort((a,b) => (a.getBoundingClientRect().width*a.getBoundingClientRect().height) - (b.getBoundingClientRect().width*b.getBoundingClientRect().height));
  let el = cands[0]; let hop = 0;
  while (el && hop < 6) {
    const s = getComputedStyle(el);
    if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || s.cursor === 'pointer') break;
    el = el.parentElement; hop++;
  }
  const r = (el||cands[0]).getBoundingClientRect();
  return { x: r.x + r.width/2, y: r.y + r.height/2, tag: (el||cands[0]).tagName }; }"""
LEAF_TEXTS_JS = """els => { const out = [];
  for (const e of els) { const t = (e.innerText||'').trim(); if (t && t.length > 0 && t.length < 40 && e.children.length === 0) out.push(t); }
  return [...new Set(out)]; }"""


def main():
    with connect() as (_browser, _ctx, page):
        page.wait_for_timeout(1000)
        clicked = page.evaluate(TARGET_JS)
        print("CLICK TARGET:", json.dumps(clicked, separators=(",", ":")))
        if clicked:
            page.mouse.click(clicked["x"], clicked["y"])
            page.wait_for_timeout(2500)
        print("URL:", page.url)
        texts = page.eval_on_selector_all("*", LEAF_TEXTS_JS)
        print("LEAF TEXTS:", " | ".join(texts[:150]))
        shot(page, "_preset.png")
        print("saved _preset.png")


if __name__ == "__main__":
    run(main)
