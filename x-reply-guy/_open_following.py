import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
from playwright.sync_api import sync_playwright

CDP = "http://127.0.0.1:9226"
with sync_playwright() as pw:
    b = pw.chromium.connect_over_cdp(CDP)
    ctx = b.contexts[0] if b.contexts else b.new_context()
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    try:
        page.wait_for_load_state("domcontentloaded", timeout=15000)
    except Exception:
        pass
    page.wait_for_timeout(2000)
    try:
        tab = page.get_by_role("tab", name="Following")
        tab.wait_for(state="visible", timeout=10000)
        tab.click()
        page.wait_for_timeout(2000)
        active = page.evaluate(
            "() => { const t=document.querySelector('[role=\"tab\"][aria-selected=\"true\"]');"
            " return t ? t.innerText.replace(/\\s+/g,' ').trim() : '(none)'; }")
        print("Active tab now:", active)
    except Exception as e:
        print("Could not click Following automatically:", e)
        print("Please click the 'Following' tab manually in the open window.")
    b.close()  # disconnect Playwright only — the Chrome window stays open
print("Chrome is open on xbot-profile at the Following tab. It will stay open for you to inspect the sort control.")
