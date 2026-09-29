#!/usr/bin/env python
"""
capture.py — receipt-capture: the canonical headless-Chrome screenshotter for "receipts" (article /
chart / aggregator screenshots) used as edit-time cutaway assets.
Python port of capture.js (2026-09-28, Mike's Python-first rule; the JS twin is frozen rollback).

Usage:
  python capture.py <jobs.json>                       # batch (recommended)
  python capture.py <jobs.json> <nameFilter>          # only jobs whose name includes the filter
  python capture.py --url <url> --out <path> [--full] [--wait <ms>] [--w <px>] [--h <px>] [--click "Button Text"]

jobs.json = array of jobs. Each job:
  { "name":"R1_cmc-unlocks", "url":"https://...", "out":"R1_cmc-unlocks.png",
    "dir":"<abs output dir, optional if out is absolute>",
    "wait":7000, "full":false, "w":1600, "h":2200,
    "clicks":[ {"text":"Token Unlocks"}, {"sel":".someButton"} ],   # in order, after load + consent
    "waitAfterClick":2500,
    "removeSel":["[class*=promo]"],   # extra elements to remove before the shot
    "clip":{"x":0,"y":0,"width":1600,"height":900} }   # optional region crop
Prints `OK <name>` / `FAIL <name> :: <why>` per job. The receipt-capturer agent OPENS every file after
(the bot-wall / blank-page discipline lives there; this only shoots).
"""
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
CONSENT = ["Accept all", "Accept All", "I Accept", "I agree", "Agree", "Accept", "Got it", "Okay, got it",
           "Allow all", "Continue", "Yes, I agree", "AGREE", "Accept Cookies", "Reject all", "Reject All", "Continue to site"]
KILL = ["#onetrust-banner-sdk", ".fc-consent-root", '[id*="sp_message_container"]', '[class*="cookie"]',
        '[class*="consent"]', '[class*="Cookie"]', '[aria-label*="cookie"]']
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"


def parse_args(argv):
    o = {}
    i = 0
    while i < len(argv):
        if argv[i].startswith("--"):
            k = argv[i][2:]
            if i + 1 < len(argv) and not argv[i + 1].startswith("--"):
                o[k] = argv[i + 1]
                i += 1
            else:
                o[k] = True
        i += 1
    return o


def shoot(browser, j, base_dir):
    out = j.get("out") or (j.get("name", "shot") + ".png")
    out = Path(out) if Path(out).is_absolute() else Path(j.get("dir") or base_dir or Path.cwd()) / out
    page = browser.new_page(viewport={"width": int(j.get("w") or 1600), "height": int(j.get("h") or 2000)},
                            device_scale_factor=2, user_agent=UA)
    try:
        page.goto(j["url"], wait_until="domcontentloaded", timeout=60000)
        time.sleep((j.get("wait") or 4000) / 1000)
        for label in CONSENT:
            try:
                b = page.get_by_role("button", name=label, exact=False).first
                if b.is_visible(timeout=500):
                    b.click(timeout=1500)
                    time.sleep(0.8)
                    break
            except Exception:
                pass
        for c in j.get("clicks") or []:
            try:
                el = page.get_by_text(c["text"], exact=False).first if c.get("text") else page.locator(c["sel"]).first
                el.click(timeout=4000)
                time.sleep((j.get("waitAfterClick") or 2500) / 1000)
            except Exception as e:
                print(f"   (click skipped: {c.get('text') or c.get('sel')} :: {str(e).splitlines()[0]})")
        page.evaluate("(sels) => { for (const s of sels) document.querySelectorAll(s).forEach(e => { try { e.remove(); } catch (x) {} }); }",
                      KILL + list(j.get("removeSel") or []))
        time.sleep(0.6)
        out.parent.mkdir(parents=True, exist_ok=True)
        opts = {"path": str(out), "full_page": bool(j.get("full"))}
        if j.get("clip"):
            opts["clip"] = j["clip"]
        page.screenshot(**opts)
        print(f"OK   {j.get('name') or out}")
    except Exception as e:
        print(f"FAIL {j.get('name') or j.get('url')} :: {str(e).splitlines()[0]}")
    page.close()


def main():
    argv = sys.argv[1:]
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        if argv and not argv[0].startswith("--") and argv[0].endswith(".json"):
            jobs_p = Path(argv[0]).resolve()
            jobs = json.loads(jobs_p.read_text(encoding="utf-8"))
            flt = argv[1] if len(argv) > 1 else None
            for j in jobs:
                if flt and flt not in (j.get("name") or ""):
                    continue
                shoot(browser, j, jobs_p.parent)
        else:
            o = parse_args(argv)
            if not o.get("url") or not o.get("out"):
                print("usage: capture.py <jobs.json> [nameFilter] | --url <url> --out <path> [--full] [--wait ms] [--w px] [--h px] [--click text]", file=sys.stderr)
                sys.exit(2)
            shoot(browser, {"url": o["url"], "out": o["out"], "full": bool(o.get("full")), "wait": int(o.get("wait") or 4000),
                            "w": int(o.get("w") or 1600), "h": int(o.get("h") or 2000),
                            "clicks": [{"text": o["click"]}] if o.get("click") else []}, None)
        browser.close()


if __name__ == "__main__":
    main()
