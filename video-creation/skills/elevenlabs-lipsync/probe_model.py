#!/usr/bin/env python
"""
probe_model.py: select a lip-sync model and report what inputs it expects (the file inputs' accept
attributes + the visible composer labels). Read-only; never generates. Use it whenever you try a new
model. Python port of probe-model.js (2026-11-23).

    python probe_model.py --model "Sync 3"
"""
import argparse
import json
import re

from _el import MODELS_RE, URL, launch, run, shot

INFO_JS = """() => {
  const inputs = [...document.querySelectorAll('input[type="file"]')].map(i => ({ accept: i.getAttribute('accept') || '' }));
  const labels = [...document.querySelectorAll('*')].filter(e => !e.children.length)
    .map(e => (e.innerText||'').trim()).filter(t => t && t.length < 32 && /upload|image|video|avatar|speech|audio|drop|drag|reference|source/i.test(t));
  return { inputs, labels: [...new Set(labels)].slice(0, 20) }; }"""


def quiet(fn, *args, **kw):
    try:
        return fn(*args, **kw)
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="Sync 3")
    a = ap.parse_args()
    with launch() as (_ctx, p):
        p.goto(URL, wait_until="domcontentloaded", timeout=60000)
        p.wait_for_timeout(3000)
        # dismiss popovers
        for _ in range(3):
            quiet(p.keyboard.press, "Escape")
            quiet(p.mouse.click, 8, 8)
            p.wait_for_timeout(700)
        quiet(p.locator('[role="radio"]:has-text("Lip sync"), button:has-text("Lip sync")').first.click)
        p.wait_for_timeout(1500)
        pill = p.locator("button").filter(has_text=MODELS_RE).first
        quiet(pill.click)
        p.wait_for_timeout(1200)
        quiet(p.locator(f"text=/{a.model}/i").first.click)
        p.wait_for_timeout(3000)
        info = p.evaluate(INFO_JS)
        print("MODEL:", a.model)
        print("file inputs accept:", json.dumps(info["inputs"], ensure_ascii=False, separators=(",", ":")))
        print("composer labels:", json.dumps(info["labels"], ensure_ascii=False, separators=(",", ":")))
        shot(p, "el-probe-" + re.sub(r"[^a-zA-Z0-9_]+", "-", a.model) + ".png")
        p.wait_for_timeout(1500)


if __name__ == "__main__":
    run(main, "probe")
