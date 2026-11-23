#!/usr/bin/env python
"""
_soundstripe_autodrive.py: RECON that drives itself (no human needed), for when Soundstripe changes its
site. Uses the logged-in soundstripe-profile to load the library, run a keyword search by typing in the
search box, and screenshot + dump the DOM, so the current search endpoint and the result-card /
download selectors can be read off. Captures every JSON response it sees (with the request body) to
video-creation/cache/music-sourcing/recon/. Python port of _soundstripe-autodrive.js (2026-11-23).

    python _soundstripe_autodrive.py ["calm ambient"]
"""
import json
import re
import sys

from soundstripe import cache_dir, launch

RECON_DIR = cache_dir("music-sourcing", "recon")
NET_DIR = cache_dir("music-sourcing", "recon", "net2")
SHOT_DIR = cache_dir("music-sourcing", "recon", "shots")
DOM_DIR = cache_dir("music-sourcing", "recon", "dom")
INDEX = RECON_DIR / "autodrive-index.jsonl"
NOISE_RE = re.compile(r"metrics\.soundstripe|ab\.soundstripe|hsappstatic|hubspot|google|doubleclick|segment|sentry|datadog")
SONGS_RE = re.compile(r'"type"\s*:\s*"songs"')
count = {"n": 0}

MAIN_HTML_JS = "() => { const main = document.querySelector('main') || document.body; return main ? main.outerHTML : ''; }"
PROBE_JS = """() => { const out = [];
  const sels = ['[data-testid]', '[class*="song" i]', '[class*="track" i]', '[class*="row" i]', 'li', 'article'];
  for (const s of sels) {
    const els = Array.from(document.querySelectorAll(s)).slice(0, 4);
    for (const e of els) {
      const t = (e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80);
      if (t) out.push({ sel: s, testid: e.getAttribute('data-testid'), cls: e.className?.toString().slice(0, 80), text: t });
    }
  }
  return out.slice(0, 40); }"""


def sanitize(u):
    return re.sub(r"[^a-zA-Z0-9]+", "_", re.sub(r"^https?://", "", u))[:120]


def wire_page(page):
    def on_response(resp):
        try:
            url = resp.url
            # skip known analytics / noise; capture every other JSON host so the search backend shows up
            if NOISE_RE.search(url):
                return
            if "json" not in (resp.headers.get("content-type") or "").lower():
                return
            try:
                body = resp.text()
            except Exception:
                return
            count["n"] += 1
            file = NET_DIR / f"{count['n']:03d}_{sanitize(url)}.json"
            file.write_text(body[:300 * 1024], encoding="utf-8", newline="\n")
            try:
                post_data = resp.request.post_data
            except Exception:
                post_data = None
            has_songs = bool(SONGS_RE.search(body))  # quick flag: does this response contain song objects?
            with open(INDEX, "a", encoding="utf-8", newline="\n") as f:
                f.write(json.dumps({
                    "n": count["n"], "status": resp.status, "method": resp.request.method, "url": url,
                    "bytes": len(body), "hasSongs": has_songs,
                    "postData": str(post_data)[:2000] if post_data else None, "file": file.name,
                }, ensure_ascii=False, separators=(",", ":")) + "\n")
            if has_songs:
                print(f"  [SONGS] {resp.request.method} {url[:140]}", flush=True)
        except Exception:
            pass

    page.on("response", on_response)


def shot(page, name):
    try:
        page.screenshot(path=str(SHOT_DIR / name), full_page=False)
        print("  shot:", name)
    except Exception as e:
        print("  shot failed", name, str(e).splitlines()[0])


def dump(name, text):
    try:
        (DOM_DIR / name).write_text(text or "", encoding="utf-8", newline="\n")
        print("  dom:", name, len(text or ""), "bytes")
    except Exception:
        pass


def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "calm ambient"
    INDEX.write_text("", encoding="utf-8")
    print(f'Auto-drive discovery, query="{query}"')
    with launch(slow_mo=40) as (ctx, page):
        ctx.on("page", wire_page)
        for p in ctx.pages:
            wire_page(p)
        try:
            page.goto("https://www.soundstripe.com/library", wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
            shot(page, "01-library.png")
            print("  url:", page.url)

            # find a search input
            typed = False
            for s in ['input[type="search"]', 'input[placeholder*="Search" i]', '[role="searchbox"]',
                      'input[name*="search" i]', 'input[aria-label*="search" i]', 'input[type="text"]']:
                el = page.locator(s).first
                try:
                    hit = el.count() and el.is_visible()
                except Exception:
                    hit = False
                if hit:
                    print("  search input via:", s)
                    el.click()
                    el.fill(query)
                    page.keyboard.press("Enter")
                    typed = True
                    break
            if not typed:
                print("  !! no search input found")
            page.wait_for_timeout(7000)
            shot(page, "02-results.png")
            print("  url after search:", page.url)

            # dump main content + first "card-ish" elements
            try:
                main_html = page.evaluate(MAIN_HTML_JS)
            except Exception:
                main_html = ""
            dump("results-main.html", (main_html or "")[:600 * 1024])

            # try to enumerate row / card candidates by common patterns
            try:
                probe = page.evaluate(PROBE_JS)
            except Exception:
                probe = []
            dump("probe-cards.json", json.dumps(probe, indent=1, ensure_ascii=False))
        except Exception as e:
            print("  ERROR:", str(e).splitlines()[0])
            shot(page, "zz-error.png")

        page.wait_for_timeout(1500)
        print(f"Captured {count['n']} api JSON responses. Closing.")


if __name__ == "__main__":
    main()
