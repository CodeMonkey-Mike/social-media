#!/usr/bin/env python
"""
_grab_history.py: capture the mp3 URLs of the N newest History cards (LI rows) for a voice by clicking
each row's Play (then Play again to pause it). Spends no credits; it does play each take for a moment.
Python port of _grab-history.js (2026-11-23).

    python _grab_history.py <voice> <N>      -> JSON [{idx, url}], newest (top) first
"""
import json
import re
import sys

from _cdp import connect, run, watch_mp3s

MP3_RE = re.compile(r"cloudfront.*\.mp3", re.IGNORECASE)
ROWS_JS = """(voice) => { const out = [];
  for (const li of document.querySelectorAll('li')) {
    const r = li.getBoundingClientRect();
    if (r.width < 300 || r.height < 50 || r.height > 130) continue;
    const leaf = [...li.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').trim().toLowerCase() === voice);
    if (!leaf) continue;
    const play = li.querySelector('button[aria-label="Play"]');
    if (!play) continue;
    const pr = play.getBoundingClientRect();
    out.push({ top: r.top, x: pr.left + pr.width / 2, y: pr.top + pr.height / 2 });
  }
  out.sort((a, b) => a.top - b.top);
  return out; }"""


def main():
    voice = (sys.argv[1] if len(sys.argv) > 1 else "yuli-1").lower()
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    with connect() as (_browser, _ctx, page):
        seen = watch_mp3s(page, MP3_RE)
        rows = page.evaluate(ROWS_JS, voice)
        print("cards found:", len(rows))
        result = []
        for i in range(min(n, len(rows))):
            before = len(seen)
            page.mouse.click(rows[i]["x"], rows[i]["y"])
            for _ in range(24):
                if len(seen) != before:
                    break
                page.wait_for_timeout(250)
            url = list(seen)[-1] if len(seen) > before else None
            result.append({"idx": i, "url": url})
            page.mouse.click(rows[i]["x"], rows[i]["y"])  # pause
            page.wait_for_timeout(500)
        print(json.dumps(result, separators=(",", ":")))


if __name__ == "__main__":
    run(main)
