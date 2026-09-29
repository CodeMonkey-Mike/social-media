#!/usr/bin/env python
"""
search_envato.py — search Envato Elements (app.envato.com) stock video and dump result candidates as
JSON so Claude can evaluate and pick clips. READ-ONLY: no downloads, no licensing.
Python port of search-envato.js (2026-09-28, Mike's Python-first rule; the JS twin is frozen rollback).

Run: python video-creation/skills/envato-broll/search_envato.py "bank vault door closing" [--max 12]
       [--type stock-video] [--out results.json] [--portrait] [--debug]

Output: JSON array of { title, author, duration, url, previewImage, previewVideo } on stdout (and --out).
  previewVideo is a directly-downloadable h264 preview: fetch it to WATCH the clip (extract frames)
  before licensing anything. Selector notes live in SKILL.md; update BOTH when Envato changes the DOM.
Uses the dedicated envato-profile Chrome (never the main profile; per-profile kills only).
"""
import argparse
import json
import random
import sys
import time
import urllib.parse

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PROFILE_DIR = r"C:\Users\mnede\AppData\Local\Google\Chrome\envato-profile"

EXTRACT_JS = """
({ max, type }) => {
  const out = [];
  const seen = new Set();
  const re = new RegExp('/search/' + type + '/([0-9a-f-]{30,})');
  for (const a of document.querySelectorAll('a[href*="' + type + '"]')) {
    const href = a.getAttribute('href') || '';
    const m = href.match(re);
    if (!m || seen.has(m[1])) continue;
    const card = a.closest('article, li, div');
    const img = (card || a).querySelector('img');
    const video = (card || a).querySelector('video');
    const text = card ? card.innerText.replace(/\\n/g, ' ').trim() : '';
    const tm = text.match(/^(\\d{1,2}:\\d{2})\\s*\\u2022\\s*(.+?)(?:\\s*\\|\\s*(\\S.*))?$/);
    seen.add(m[1]);
    out.push({
      title: tm ? tm[2].trim() : text.slice(0, 80),
      author: tm && tm[3] ? tm[3].trim() : '',
      duration: tm ? tm[1] : '',
      url: 'https://app.envato.com' + href.split('&page')[0],
      previewImage: img ? (img.currentSrc || img.src) : '',
      previewVideo: video ? (video.currentSrc || video.src || '') : '',
    });
    if (out.length >= max) break;
  }
  return out;
}
"""


def rnd(a, b):
    return random.randint(a, b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--max", type=int, default=12)
    ap.add_argument("--type", default="stock-video")
    ap.add_argument("--out", default=None)
    ap.add_argument("--portrait", action="store_true")
    ap.add_argument("--debug", action="store_true")
    a = ap.parse_args()

    url = f"https://app.envato.com/search?itemType={a.type}&term=" + urllib.parse.quote(a.query).replace("%20", "+")
    print("search: " + url, file=sys.stderr)
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR, channel="chrome", headless=False,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], viewport=None)
        ctx.add_init_script("Object.defineProperty(navigator, 'webdriver', { get: () => undefined });")
        page = ctx.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        time.sleep(rnd(4000, 6000) / 1000)
        got_it = page.locator('button:has-text("Okay, got it")')
        try:
            if got_it.is_visible():
                got_it.click()
        except Exception:
            pass
        if a.portrait:  # Orientation filter -> Portrait/Vertical (UI-only; no URL param; NOT a guarantee, see SKILL.md)
            ori = page.locator('button:has-text("Orientation"), [aria-label*="Orientation" i]').first
            try:
                visible = ori.is_visible()
            except Exception:
                visible = False
            if visible:
                ori.click()
                time.sleep(rnd(1000, 1600) / 1000)
                picked = False
                for lbl in ("Portrait", "Vertical", "9:16"):
                    opt = page.locator(f'text="{lbl}"').first
                    try:
                        if opt.is_visible():
                            opt.click()
                            picked = True
                            break
                    except Exception:
                        pass
                print("Orientation->Portrait " + ("applied" if picked else "OPTION NOT FOUND"), file=sys.stderr)
                time.sleep(rnd(2500, 3500) / 1000)
            else:
                print("Orientation filter button NOT FOUND", file=sys.stderr)
        for _ in range(3):  # lazy grid: scroll so enough cards mount
            page.mouse.wheel(0, 1200)
            time.sleep(rnd(800, 1500) / 1000)
        if a.debug:
            page.screenshot(path="envato-search-debug.png")
        items = page.evaluate(EXTRACT_JS, {"max": a.max, "type": a.type})
        ctx.close()
    text = json.dumps(items, indent=2, ensure_ascii=False)
    print(text)
    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            f.write(text)
    print(f"\n{len(items)} result(s)", file=sys.stderr)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"search failed: {e}", file=sys.stderr)
        sys.exit(1)
