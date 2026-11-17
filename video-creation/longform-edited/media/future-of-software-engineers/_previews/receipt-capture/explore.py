"""Exploratory loader: open a URL at 1920 wide, DSF 1, dismiss consent, report text hits, save a full-page preview."""
import sys, time, json
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
url, out = sys.argv[1], sys.argv[2]
needles = sys.argv[3:]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1, user_agent=UA)
    resp = pg.goto(url, wait_until="domcontentloaded", timeout=90000)
    print("status", resp.status if resp else None, "final url", pg.url)
    time.sleep(6)
    print("title:", pg.title())
    for label in ["Accept all","Accept All","I Accept","I agree","Agree","Accept","Got it","OK","Allow all","Reject all"]:
        try:
            bt = pg.get_by_role("button", name=label, exact=False).first
            if bt.is_visible(timeout=400):
                bt.click(timeout=1500); print("clicked consent:", label); time.sleep(1); break
        except Exception: pass
    h = pg.evaluate("document.documentElement.scrollHeight")
    print("scrollHeight", h)
    body = pg.inner_text("body")
    print("body chars", len(body))
    for n in needles:
        i = body.find(n)
        print(f"needle {n!r}: {'FOUND' if i>=0 else 'MISSING'}", (body[max(0,i-80):i+len(n)+120].replace("\n"," | ") if i>=0 else ""))
    pg.screenshot(path=out, full_page=True)
    b.close()
