#!/usr/bin/env python
"""
_pick_voice.py: open the Selected Voice / Voice Preset picker (either label) and click the custom
preset card by its exact text. Python port of _pick-voice.js (2026-11-23).

    python _pick_voice.py "yuli-1"     pick that voice (case-insensitive)
    python _pick_voice.py              only open the picker and list what is visible
"""
import sys

from _cdp import IS_VIS, connect, run, shot

# 1. open the picker: prefer the "Change" button on the Selected Voice card, else any
#    "Voice Preset" / "Selected Voice" text
OPEN_JS = """(isVisSrc) => { const isVis = eval(isVisSrc);
  const btn = [...document.querySelectorAll('button')].find(b => /^change$/i.test((b.innerText||'').trim()) && isVis(b));
  if (btn) { btn.click(); return 'change-btn'; }
  const el = [...document.querySelectorAll('*')].find(e => /^(selected voice|voice preset)$/i.test((e.innerText||'').trim()) && isVis(e));
  if (el) { el.click(); return 'label'; }
  return null; }"""
LEAFS_JS = """(isVisSrc) => { const isVis = eval(isVisSrc); const out = [];
  for (const e of document.querySelectorAll('*')) { const t = (e.innerText||'').trim();
    if (t && t.length < 30 && e.children.length === 0 && isVis(e)) out.push(t); }
  return [...new Set(out)]; }"""
# Candidates with that exact text also appear in the LEFT composer panel (the selected voice, x<480) and
# in the History column (x~500, a card per past generation) -> take the one inside the picker MODAL:
# the right-most / largest-x candidate (the modal is centered and its cards sit right of the history column).
CARD_JS = """([t, isVisSrc]) => { const isVis = eval(isVisSrc); const c = [];
  for (const e of document.querySelectorAll('*')) {
    if ((e.textContent||'').trim().toLowerCase() !== t) continue;
    if (!isVis(e)) continue;
    const r = e.getBoundingClientRect(); c.push({ x: r.left + r.width/2, y: r.top + r.height/2 }); }
  c.sort((a,b) => b.x - a.x); return c[0] || null; }"""
SELECTED_JS = """(isVisSrc) => { const isVis = eval(isVisSrc); const out = [];
  for (const e of document.querySelectorAll('*')) { const t = (e.innerText||'').trim();
    if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/i.test(t) && e.children.length === 0 && isVis(e)) {
      const r = e.getBoundingClientRect(); out.push(t + '@' + Math.round(r.left) + ',' + Math.round(r.top)); } }
  return out; }"""


def main():
    target = (sys.argv[1] if len(sys.argv) > 1 else "").lower()
    with connect() as (_browser, _ctx, page):
        opened = page.evaluate(OPEN_JS, IS_VIS)
        print("opened via", opened)
        page.wait_for_timeout(2500)
        # 2. list visible leaf texts (so we can see what presets exist)
        leafs = page.evaluate(LEAFS_JS, IS_VIS)
        print("VISIBLE:", " | ".join(leafs[:120]))
        if not target:
            shot(page, "_pick.png")
            return
        # 3. click the card whose exact text == target
        box = page.evaluate(CARD_JS, [target, IS_VIS])
        if not box:
            print("CARD NOT FOUND for", target)
            shot(page, "_pick.png")
            sys.exit(2)
        page.mouse.click(box["x"], box["y"])
        page.wait_for_timeout(2000)
        sel = page.evaluate(SELECTED_JS, IS_VIS)
        print("CLICKED", target, "-> visible voice labels now:", " | ".join(sel))
        shot(page, "_pick.png")


if __name__ == "__main__":
    run(main)
