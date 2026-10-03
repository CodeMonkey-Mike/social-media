# Diagnostic (2026-09-10): what the ChatGPT composer does with a restored draft and with
# each clear/type method. Opens the SAME profile the generator uses, sends NOTHING.
import sys, time
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\repurpose")
from gen_images import PROFILE_DIR, COMPOSER_SEL, composer_loaded, dismiss_dialog
from playwright.sync_api import sync_playwright

def txt(c):
    try:
        return c.inner_text().strip().replace("\n", " ")[:90]
    except Exception as e:
        return f"<err {str(e).splitlines()[0][:60]}>"

with sync_playwright() as p:
    b = p.chromium.launch_persistent_context(
        PROFILE_DIR, channel="chrome", headless=False,
        ignore_default_args=["--enable-automation"],
        args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
    b.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    page = b.new_page()
    page.goto("https://chatgpt.com/")
    page.wait_for_load_state("domcontentloaded")
    print("composer loaded:", composer_loaded(page, 30000))
    page.wait_for_timeout(3000)
    dismiss_dialog(page)
    c = page.locator(COMPOSER_SEL).first
    print("composer count:", page.locator(COMPOSER_SEL).count(),
          "| tag:", c.evaluate("e => e.tagName + '#' + (e.id||'') + '.' + (e.className||'').slice(0,40)"))
    print("1 initial text     :", repr(txt(c)))
    c.click(); page.wait_for_timeout(300)
    page.keyboard.press("Control+A"); page.keyboard.press("Delete"); page.wait_for_timeout(500)
    print("2 after Ctrl+A/Del :", repr(txt(c)))
    try:
        c.fill(""); page.wait_for_timeout(500)
        print("3 after fill('')   :", repr(txt(c)))
    except Exception as e:
        print("3 fill('') failed  :", str(e).splitlines()[0][:100])
    try:
        c.evaluate("e => { e.innerHTML = '<p></p>'; e.dispatchEvent(new InputEvent('input', {bubbles:true})); }")
        page.wait_for_timeout(500)
        print("4 after innerHTML  :", repr(txt(c)))
    except Exception as e:
        print("4 innerHTML failed :", str(e).splitlines()[0][:100])
    c.click(); page.wait_for_timeout(300)
    page.keyboard.type("PROBE keyboard.type ONE TWO THREE", delay=40)
    page.wait_for_timeout(500)
    print("5 keyboard.type    :", repr(txt(c)))
    focused = page.evaluate("() => document.activeElement ? (document.activeElement.tagName + '#' + (document.activeElement.id||'')) : 'none'")
    print("  active element   :", focused)
    try:
        c.press_sequentially(" plus press_sequentially FOUR", delay=40)
        page.wait_for_timeout(500)
        print("6 press_sequentially:", repr(txt(c)))
    except Exception as e:
        print("6 press_sequentially failed:", str(e).splitlines()[0][:100])
    # clean up: leave the composer empty, never send
    c.click(); page.keyboard.press("Control+A"); page.keyboard.press("Backspace")
    page.wait_for_timeout(500)
    print("7 final text       :", repr(txt(c)))
    print("url:", page.url)
    b.close()
print("PROBE DONE")
