# _diag_ig_create.py — READ-ONLY diagnostic. Walks IG Create -> Post and dumps
# DOM state at each step so we can see why input[type="file"] never attaches.
# Screenshots go to schedule-tweets/tmp/ig-diag/. Never selects a file, never posts.
# (Python port of _diag-ig-create.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_diag_ig_create.py
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"
WORKSPACE_ROOT = Path(__file__).resolve().parents[1]
DEBUG_DIR = WORKSPACE_ROOT / "tmp" / "ig-diag"

DUMP_JS = r"""
() => {
  const fileInputs = [...document.querySelectorAll('input[type="file"]')].map(i => ({
    accept: i.accept, multiple: i.multiple, name: i.name,
    hidden: i.offsetParent === null, cls: (i.className || '').slice(0, 40),
  }));
  const dialogs = [...document.querySelectorAll('[role="dialog"]')].map(d => ({
    aria: d.getAttribute('aria-label'),
    text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
  }));
  // clickable text inside any dialog (buttons / role=button / links)
  const clickable = [];
  const scope = document.querySelector('[role="dialog"]') || document.body;
  for (const el of scope.querySelectorAll('button,[role="button"],a,div[tabindex]')) {
    const t = (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    if (t && t.length < 40) clickable.push(t);
  }
  return { fileInputs, dialogs, clickable: [...new Set(clickable)].slice(0, 30) };
}
"""


def dump(page, label):
    info = page.evaluate(DUMP_JS)
    print(f"\n===== {label} =====")
    print("input[type=file] count:", len(info["fileInputs"]),
          json.dumps(info["fileInputs"], ensure_ascii=False))
    print("dialogs:", json.dumps(info["dialogs"], indent=2, ensure_ascii=False))
    print("clickable texts:", json.dumps(info["clickable"], ensure_ascii=False))
    try:
        page.screenshot(path=str(DEBUG_DIR / f"{label}.png"))
    except Exception as e:
        print("screenshot fail", e)


def click_center(page, locator):
    """Real mouse click at the element's centre (falls back to a locator click)."""
    box = locator.bounding_box()
    if box:
        page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    else:
        locator.click()


def main():
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        page = browser.pages[0] if browser.pages else browser.new_page()
        try:
            page.goto("https://www.instagram.com/")
            page.wait_for_timeout(3000)
            if page.locator('input[name="username"]').count() > 0:
                print("NOT LOGGED IN")
                return
            print("logged in ✓")
            dump(page, "0_home")

            # Click Create
            create_btn = None
            for sel in ['a[href="/create/select-type/"]', '[aria-label="New post"]',
                        '[aria-label="Create"]']:
                el = page.locator(sel).first
                if el.count() > 0:
                    create_btn = el
                    print(f"Create via: {sel}")
                    break
            if create_btn is None:
                create_btn = page.locator('text="Create"').first
            click_center(page, create_btn)
            page.wait_for_timeout(2500)
            dump(page, "1_after_create")

            # Click Post sub-link
            post_re = re.compile(r"^Post$")
            post_link = (page.get_by_role("link", name=post_re)
                         .or_(page.get_by_role("button", name=post_re)).first)
            if post_link.count() == 0:
                post_link = page.locator("a, button, span, div").filter(has_text=post_re).first
            print("Post sub-link count:", post_link.count())
            if post_link.count() > 0:
                click_center(page, post_link)
                print("clicked Post sub-link")
            page.wait_for_timeout(2500)
            dump(page, "2_after_post")

            # Look for a "Select from computer" button, then re-dump
            sel = page.locator('button:has-text("Select from"), '
                               '[role="button"]:has-text("Select from")').first
            print("Select-from-computer button count:", sel.count())
            if sel.count() > 0:
                print("NOTE: a Select-from-computer button exists — the file input likely appears "
                      "only AFTER clicking it (or is already behind it).")
            dump(page, "3_final")
            print("\nLeaving browser open 90s for manual inspection...", flush=True)
            page.wait_for_timeout(90000)
        except Exception as e:
            print(f"diag error: {e}", file=sys.stderr)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
