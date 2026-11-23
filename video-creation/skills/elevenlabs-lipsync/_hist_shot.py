#!/usr/bin/env python
"""
_hist_shot.py: navigate the Image & Video page to the History tab and screenshot it, to see where the
renders are. Python port of _hist-shot.js (2026-11-23).

    python _hist_shot.py      -> video-creation/cache/elevenlabs-lipsync/shots/el-history-now.png
"""
from _el import URL, launch, open_history, run, shot


def main():
    with launch() as (_ctx, page):
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        # click History tab
        open_history(page, roles=("tab", "button"), wait_ms=3000)
        page.wait_for_timeout(2000)
        path = shot(page, "el-history-now.png", full_page=False)
        print("URL:", page.url)
        # dump the tab labels + whether an active "History" tab exists
        tabs = page.eval_on_selector_all(
            '[role="tab"],button,a',
            "els => els.map(e => (e.innerText||'').trim()).filter(t => t && t.length < 18 && /history|explore/i.test(t))")
        print("tabs seen:", " | ".join(dict.fromkeys(tabs)))
        print("saved", path)


if __name__ == "__main__":
    run(main, "_hist-shot")
