#!/usr/bin/env python
"""
download_envato.py — download (license + save) ONE Envato Elements item into a target directory.
Python port of download-envato.js (2026-09-28, Mike's Python-first rule; the JS twin is frozen rollback).

Run: python video-creation/skills/envato-broll/download_envato.py "https://app.envato.com/search/stock-video/<uuid>?..."
       --dir "<project>/assets/vid" [--name <slot-slug>] [--debug]

Notes:
  - Elements downloads are covered by Mike's subscription; clicking Download records the license on the
    account (the normal flow). A license/project dialog, if one appears, is confirmed.
  - DOWNLOAD-FLOW (2026-07-10): Envato's item page RE-RENDERS on the Download click, which CANCELS the
    browser download. So the signed file URL is captured from the download EVENT and fetched with the
    authenticated cookies, streamed to disk.
  - CHROME-153 CRASH RACE (2026-09-28): on LARGE items the envato-profile browser CRASHES ~1-3 s after
    the click (Crashpad dump tagged LEGACY_DOWNLOAD). Cookies + UA are read BEFORE the click, every
    post-click wait is a Python sleep (never page.wait_for_timeout), and closing tolerates a dead browser.
  - Disk rule (SKILL.md): an original over 800,000,000 bytes is transcoded to ~100 MB 1080p H.264, audio
    stripped, orientation-aware (portrait sources scale the SHORT edge to 1080), and ONLY that is kept.
Prints one JSON object on stdout: { saved, bytes, source }. Exit 1 on failure (one attempt; read the log,
never relaunch blind; per-profile kills only).
"""
import argparse
import json
import os
import random
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PROFILE_DIR = r"C:\Users\mnede\AppData\Local\Google\Chrome\envato-profile"
CAP_BYTES = 800_000_000


def rnd(a, b):
    return random.randint(a, b) / 1000


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + ["-show_entries", entries, "-of", "csv=p=0", str(path)]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def cap_if_huge(target: Path) -> Path:
    if target.stat().st_size <= CAP_BYTES:
        return target
    dur = float(probe(target, "format=duration") or 0)
    br = round(100 * 8 * 1000 / dur * 0.92) if dur else 8000
    w, h = (int(x) for x in probe(target, "stream=width,height", "v:0").split(",")[:2])
    portrait = h > w
    vf = "scale=1080:-2" if portrait else "scale=-2:1080"
    cap = target.with_name(target.stem + ".cap.mp4")
    log(f"transcoding {target.stat().st_size / 1e6:.0f}MB -> ~100MB ({br}k, {'portrait' if portrait else 'landscape'} {vf})...")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(target), "-vf", vf, "-c:v", "libx264",
                    "-b:v", f"{br}k", "-maxrate", f"{br}k", "-bufsize", f"{br * 2}k", "-an", str(cap)], check=True)
    target.unlink()
    return cap


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("item_url")
    ap.add_argument("--dir", required=True)
    ap.add_argument("--name", default=None)
    ap.add_argument("--project", default=None, help="accepted for CLI parity; the license record is per account")
    ap.add_argument("--debug", action="store_true")
    a = ap.parse_args()
    if not a.item_url.startswith("http"):
        ap.error("item_url must be an app.envato.com item URL")
    out_dir = Path(a.dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    state = {"url": None, "name": None, "gone": False}
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR, channel="chrome", headless=False,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], viewport=None, accept_downloads=True)
        ctx.add_init_script("Object.defineProperty(navigator, 'webdriver', { get: () => undefined });")
        page = ctx.new_page()
        log("open: " + a.item_url)
        page.goto(a.item_url, wait_until="domcontentloaded", timeout=60000)
        time.sleep(rnd(4000, 6000))
        got_it = page.locator('button:has-text("Okay, got it")')
        try:
            if got_it.is_visible():
                got_it.click()
        except Exception:
            pass
        if a.debug:
            page.screenshot(path="envato-item-debug.png")
        dl = page.locator('button[data-cy="idp-download-button"], button:has-text("Download"), a[role="button"]:has-text("Download")').first
        dl.wait_for(state="visible", timeout=20000)
        try:
            dl.hover()
        except Exception:
            pass
        time.sleep(rnd(1800, 3500))
        # read everything the stream needs BEFORE the click (the browser may crash right after it)
        cookie_header = "; ".join(f"{c['name']}={c['value']}" for c in ctx.cookies())
        try:
            ua = page.evaluate("() => navigator.userAgent")
        except Exception:
            ua = ""

        def on_download(d):
            if not state["url"]:
                state["url"], state["name"] = d.url, d.suggested_filename

        ctx.on("close", lambda *_: state.__setitem__("gone", True))
        page.on("download", on_download)
        dl.click()
        time.sleep(rnd(1200, 2200))
        if not state["url"] and not state["gone"]:
            if a.debug:
                try:
                    page.screenshot(path="envato-license-debug.png")
                except Exception:
                    pass
            confirm = page.locator('[role="dialog"] button:has-text("Add & Download"), [role="dialog"] button:has-text("License & download"), [role="dialog"] button:has-text("Download")').first
            try:
                if confirm.is_visible():
                    confirm.click()
            except Exception:
                pass
        for _ in range(60):
            if state["url"] or state["gone"]:
                break
            time.sleep(0.5)
        if not state["url"]:
            raise RuntimeError("no download URL captured after clicking Download"
                               + (" (Chrome closed/crashed before the download event)" if state["gone"] else " (Envato DOM may have changed; re-probe)"))
        if state["gone"]:
            log("note: Chrome crashed after the download event (known Chrome-153 race); streaming with pre-click cookies")
        ext = Path(state["name"] or "").suffix or ".mov"
        target = out_dir / ((a.name + ext) if a.name else state["name"])
        log(f"fetching -> {target} (streaming; 4K originals are large)...")
        req = urllib.request.Request(state["url"], headers={"Cookie": cookie_header, "User-Agent": ua, "Referer": "https://app.envato.com/"})
        with urllib.request.urlopen(req, timeout=900) as r, open(target, "wb") as f:
            if r.status != 200:
                raise RuntimeError(f"download fetch HTTP {r.status}")
            while True:
                chunk = r.read(1 << 20)
                if not chunk:
                    break
                f.write(chunk)
        try:
            ctx.close()
        except Exception:
            pass
    saved = cap_if_huge(target)
    print(json.dumps({"saved": str(saved), "bytes": saved.stat().st_size, "source": a.item_url.split("?")[0]}, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"download failed: {e}")
        sys.exit(1)
