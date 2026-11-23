#!/usr/bin/env python
"""
_generate.py: click GENERATE for whatever is in the prompt field (voice already picked, prompt already
filled: _pick_voice.py, _fill_prompt.py) and print the new take's mp3 URL. SPENDS CREDITS: only with
Mike's OK. Python port of _generate.js (2026-11-23).

    python _generate.py

The JS version waited for an <audio> element, which the page stopped mounting on 2026-10-17, so it
printed "(none found)" for takes that had in fact generated. This one finds the take the way
_batch_generate.py does (the new History card's Play), and still checks the old way first.
"""
import re

from _cdp import DOM_AUDIO_JS, click_generate, connect, run, shot, wait_for_new_mp3, watch_mp3s

MP3_RE = re.compile(r"\.mp3(\?|$)", re.IGNORECASE)


def main():
    with connect() as (_browser, _ctx, page):
        page.wait_for_timeout(400)
        # Capture mp3 URLs seen via network from this point on.
        seen = watch_mp3s(page, MP3_RE)
        # snapshot existing audio srcs in DOM (to diff)
        dom_before = set(page.evaluate(DOM_AUDIO_JS))

        clicked = click_generate(page)
        print("GENERATE clicked:", clicked)
        if not clicked:
            return

        # Up to 90 s for a new mp3 (network, DOM, or the new History card).
        found = wait_for_new_mp3(page, seen, dom_before, 90, dom_before=dom_before, log_every=5)
        print("NEW MP3 URL:", found or "(none found in 90s)")
        shot(page, "_generated.png")


if __name__ == "__main__":
    run(main)
