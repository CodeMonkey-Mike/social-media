#!/usr/bin/env python3
"""_diag_x_thread_addbutton.py: READ-ONLY. Never clicks Post.

Opens the X composer on xbot-profile, fills 5 placeholder thread tweets via the
addButton, then dumps every button/testid in the composer dialog so we can see
what replaces addButton after the 5th tweet. Closes and discards the draft.
"""
import json
import sys
from playwright.sync_api import sync_playwright

PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"

DUMP_JS = """() => {
  const dlg = document.querySelector('[role=dialog]') || document;
  const out = [];
  for (const el of dlg.querySelectorAll('button,[role=button],[data-testid]')) {
    const r = el.getBoundingClientRect();
    out.push({tag: el.tagName, testid: el.getAttribute('data-testid'),
      aria: el.getAttribute('aria-label'), disabled: el.disabled || el.getAttribute('aria-disabled'),
      text: (el.innerText||'').slice(0,40), y: Math.round(r.y), h: Math.round(r.height)});
  }
  return {vh: innerHeight, items: out.filter(o => o.testid || o.aria || o.text)};
}"""


def dump(page, label):
    d = page.evaluate(DUMP_JS)
    print(f"\n=== {label} (viewport h={d['vh']}) ===")
    for o in d["items"]:
        if o["testid"] and o["testid"].startswith("tweetTextarea") is False and o["tag"] == "DIV" and not o["aria"]:
            continue
        print("  ", json.dumps(o, ensure_ascii=False))


def real_texts():
    d = json.load(open("data/x-threads.json", encoding="utf-8"))["threads"]
    t = next(x for x in d if x["status"] == "pending")
    return [x["text"] for x in t["tweets"]][:5]


def main():
    texts = real_texts()
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            PROFILE, headless=False, channel="chrome", no_viewport=True,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"])
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto("https://x.com/home")
            page.wait_for_selector('[data-testid="SideNav_NewTweet_Button"]', timeout=60000)
            page.locator('[data-testid="SideNav_NewTweet_Button"]').click()
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=15000)
            page.locator('[role=dialog] [data-testid="tweetTextarea_0"]').click()
            page.keyboard.insert_text(texts[0])
            for i in range(1, 5):
                b = page.locator('[role=dialog] button[data-testid="addButton"]').last
                b.scroll_into_view_if_needed(timeout=10000)
                b.click(timeout=10000)
                page.wait_for_selector(f'[data-testid="tweetTextarea_{i}"]', state="attached", timeout=15000)
                ta = page.locator(f'[data-testid="tweetTextarea_{i}"]')
                ta.scroll_into_view_if_needed(timeout=10000)
                ta.click(timeout=5000)
                if i == 4:
                    page.keyboard.insert_text(texts[i][:-20])
                    page.keyboard.type(texts[i][-20:], delay=80)
                    page.wait_for_timeout(1500)
                    lb = '[id^="typeaheadDropdown"][role=listbox], [data-testid="typeaheadResult"]'
                    print("TYPEAHEAD NODES:", page.evaluate("""() => [...document.querySelectorAll('[id*=typeahead],[data-testid*=typeahead],[role=listbox],[role=option]')].map(e=>{const r=e.getBoundingClientRect();return [e.tagName,e.id,e.getAttribute('data-testid'),e.getAttribute('role'),Math.round(r.y),Math.round(r.height),(e.innerText||'').slice(0,40)]})"""))
                    page.screenshot(path="tmp-diag-typeahead.png")
                    print("TYPED: dropdown", page.locator(lb).count(), "addButton", page.locator('[role=dialog] [data-testid="addButton"]').count())
                    page.keyboard.press("Control+Home"); page.wait_for_timeout(800)
                    print("AFTER Ctrl+Home: dropdown", page.locator(lb).count(), "addButton", page.locator('[role=dialog] [data-testid="addButton"]').count())
                else:
                    page.keyboard.insert_text(texts[i])
                page.wait_for_timeout(800)
            print("addButton count (any):", page.locator('[data-testid="addButton"]').count(), "in dialog:", page.locator('[role=dialog] [data-testid="addButton"]').count())
            print("addButton count after 5 tweets:", page.locator('[data-testid="addButton"]').count())
            dump(page, "after 5 tweets")
            page.screenshot(path="tmp-diag-thread-5.png")
            print("screenshot: tmp-diag-thread-5.png")
        finally:
            ctx.close()  # closing the browser discards the unsent draft; Post is never clicked
    return 0


if __name__ == "__main__":
    sys.exit(main())
