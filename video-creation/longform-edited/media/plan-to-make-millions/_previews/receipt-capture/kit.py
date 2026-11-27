"""Shared helpers for the plan-to-make-millions receipt captures (scratch tooling, project-local)."""
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).parent
PROJECT = HERE.parent.parent
RECEIPTS = PROJECT / "assets" / "receipts"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/128.0.0.0 Safari/537.36")

CONSENT_BUTTONS = ["Reject all", "Reject All", "Reject Optional", "Allow all", "Accept all", "Accept All",
                   "Accept All Cookies", "I agree", "Got it", "Agree"]
# generic overlay killers (cookie banners, newsletter / sale modals, ad slots, sticky promos)
KILL_SEL = [
    "#onetrust-banner-sdk", "#onetrust-consent-sdk", ".fc-consent-root", '[id*="sp_message_container"]',
    '[class*="cookie"]', '[class*="Cookie"]', '[class*="consent"]', '[aria-label*="cookie"]',
    '[id*="cookie"]', "iframe[id*=google_ads]", "ins.adsbygoogle", '[id*="google_ads"]',
]


def launch(p):
    return p.chromium.launch(headless=True, channel="chrome")


def new_page(browser, w=1920, h=1080, dsf=2, **kw):
    return browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=dsf, user_agent=UA, **kw)


def goto(page, url, wait=6.0):
    resp = page.goto(url, wait_until="domcontentloaded", timeout=60000)
    time.sleep(wait)
    return resp


def click_buttons(page, names):
    for label in names:
        try:
            b = page.get_by_role("button", name=label, exact=True).first
            if b.is_visible(timeout=400):
                b.click(timeout=1500)
                time.sleep(0.8)
                return label
        except Exception:
            pass
    return None


def kill(page, extra=None):
    # never remove html/body or any container that holds the page's headline / main content
    page.evaluate(
        """(sels) => { for (const s of sels) document.querySelectorAll(s).forEach(e => {
             if (e === document.body || e === document.documentElement) return;
             if (e.querySelector('h1, main, article, table')) return;
             try { e.remove(); } catch (x) {} }); }""",
        KILL_SEL + list(extra or []))


def hide(page, sels):
    """visibility:hidden keeps layout (so nothing reflows) but shows nothing."""
    page.evaluate(
        "(sels) => { for (const s of sels) document.querySelectorAll(s).forEach(e => { e.style.visibility = 'hidden'; }); }",
        list(sels))


def find_text(page, pattern, flags="i", limit=6):
    """Return page-coordinate rects of the smallest elements whose own text matches the regex."""
    return page.evaluate(
        """([pat, flags, limit]) => {
          const re = new RegExp(pat, flags); const out = [];
          const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = w.nextNode())) {
            if (!re.test(n.nodeValue)) continue;
            const el = n.parentElement; if (!el) continue;
            const r = el.getBoundingClientRect();
            out.push({tag: el.tagName, cls: (el.className && el.className.toString().slice(0, 60)) || '',
                      x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY),
                      w: Math.round(r.width), h: Math.round(r.height), text: n.nodeValue.trim().slice(0, 240)});
            if (out.length >= limit) break;
          }
          return out; }""", [pattern, flags, limit])


def shot(page, path, clip=None, full=False):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    opts = {"path": str(path), "full_page": full, "timeout": 120000}
    if clip:
        opts["clip"] = clip
    page.screenshot(**opts)
    return path
