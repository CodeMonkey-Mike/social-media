#!/usr/bin/env python
"""
_fill_prompt.py: clear the prompt field and type a text file's content into it, then read the field
back. Python port of _fill-prompt.js (2026-11-23).

    python _fill_prompt.py <textfile>
"""
import json
import sys
from pathlib import Path

from _cdp import connect, run, shot

READBACK_JS = """() => { const ta = document.querySelector('textarea'); if (ta) return ta.value;
  const ce = document.querySelector('[contenteditable="true"]'); return ce ? ce.innerText : '(none)'; }"""


def main():
    if len(sys.argv) < 2:
        print("usage: python _fill_prompt.py <textfile>", file=sys.stderr)
        sys.exit(2)
    text = Path(sys.argv[1]).read_text(encoding="utf-8").strip()
    with connect() as (_browser, _ctx, page):
        page.wait_for_timeout(500)
        # Find the prompt field: textarea, or the contenteditable with the scene placeholder.
        handle = page.query_selector("textarea") or page.query_selector('[contenteditable="true"]')
        if not handle:
            print("prompt field not found")
            return
        handle.click()
        page.wait_for_timeout(200)
        # select-all + delete, then type
        page.keyboard.press("Control+A")
        page.keyboard.press("Delete")
        page.wait_for_timeout(150)
        page.keyboard.type(text, delay=12)
        page.wait_for_timeout(400)
        # read back what's in the field
        val = page.evaluate(READBACK_JS)
        print("FIELD NOW:", json.dumps(val, ensure_ascii=False))
        shot(page, "_filled.png")
        print("saved _filled.png")


if __name__ == "__main__":
    run(main)
