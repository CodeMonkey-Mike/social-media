"""reconcile_short_urls.py — post-run URL reconciliation for Rumble + BitChute shorts.

WHY THIS EXISTS (2026-08-13). Both posters capture their video URL mid-flight, while the
platform is still processing the upload, and both got it wrong in ways that were silent:

  * Rumble's title-to-anchor match on /account/content climbed into a container spanning
    SEVERAL rows, so each row was handed its neighbour's id. 18 consecutive rows
    (2026-08-07 -> 2026-08-13) each held the next-older video's URL. The liveness check
    reported the neighbour's title every time and it was misread as processing lag.
  * BitChute missed the `upload_code` (the popup URL is empty at domcontentloaded) and
    recorded the "/content" dashboard placeholder instead of a video URL.

Capturing at post time races processing; reconciling AFTERWARD does not. This script is the
end-of-run pass: scrape the platform's own content page ONCE, match every queue row by
TITLE, confirm each candidate against its public page, and write back only what verifies.

It never uploads and never posts. Read-only against the platforms; the only write is
shorts.json (and only with --apply).

Usage:
    python scripts/reconcile_short_urls.py --platform rumble            # dry run
    python scripts/reconcile_short_urls.py --platform bitchute --apply
    python scripts/reconcile_short_urls.py --platform both --apply
"""
import argparse
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ST_ROOT = Path(__file__).resolve().parents[1]
SHORTS_JSON = ST_ROOT / "data" / "shorts.json"

PROFILES = {
    "rumble": r"C:\Users\mnede\AppData\Local\Google\Chrome\rumblebot-profile",
    "bitchute": r"C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile",
}
CONTENT_PAGES = {
    "rumble": "https://rumble.com/account/content",
    "bitchute": "https://www.bitchute.com/content",
}
# Anchor pattern + how to build a public URL from a captured id.
LINK_RE = {
    "rumble": r"/shorts/(v[\w]+)",
    "bitchute": r"/video/([\w-]+)",
}
PUBLIC_URL = {
    "rumble": lambda i: f"https://rumble.com/shorts/{i}",
    "bitchute": lambda i: f"https://www.bitchute.com/video/{i}/",
}
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")


def norm(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"&#0?39;|&apos;", "'", s)
    s = s.replace("&amp;", "&").replace("&quot;", '"')
    return re.sub(r"\s+", " ", s).strip()


def scrape_content_page(page, platform: str) -> dict:
    """Return {video_id: row_text}. ANCHOR-ANCHORED: the row text is only taken from
    ancestors that contain exactly ONE video id, so a container spanning several rows can
    never attribute a neighbour's title to this anchor (that was the Rumble bug)."""
    page.goto(CONTENT_PAGES[platform], wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(6000)
    try:
        page.wait_for_function(
            "sel => document.querySelectorAll(sel).length > 0",
            arg=f'a[href*="{"/shorts/v" if platform == "rumble" else "/video/"}"]',
            timeout=20000)
    except Exception:
        pass
    return page.evaluate(
        """([hrefNeedle, idPattern]) => {
            const re = new RegExp(idPattern);
            const idOf = a => ((a.getAttribute('href') || '').match(re) || [])[1];
            const out = {};
            for (const a of document.querySelectorAll(`a[href*="${hrefNeedle}"]`)) {
              const id = idOf(a);
              if (!id) continue;
              // the anchor's own text is the most reliable label when present
              let best = (a.innerText || '').trim();
              let c = a.parentElement;
              for (let lvl = 0; lvl < 8 && c; lvl++) {
                const ids = new Set([...c.querySelectorAll(`a[href*="${hrefNeedle}"]`)]
                  .map(idOf).filter(Boolean));
                if (ids.size > 1) break;          // spans rows: stop climbing
                const t = (c.innerText || '').replace(/\\s+/g, ' ').trim();
                if (t.length > best.length) best = t;
                c = c.parentElement;
              }
              if (!out[id] || best.length > out[id].length) out[id] = best.slice(0, 300);
            }
            return out;
        }""",
        ["/shorts/v" if platform == "rumble" else "/video/", LINK_RE[platform]])


def public_title(ctx, url: str) -> str:
    """Fetch the public page and return its normalised title ('' if unavailable)."""
    try:
        resp = ctx.request.get(url, timeout=20000, headers={"User-Agent": UA})
        html = resp.text()
        m = (re.search(r'og:title"\s+content="([^"]*)"', html, re.I)
             or re.search(r"<title>([^<]*)</title>", html, re.I))
        got = norm(m.group(1) if m else "")
        return "" if got in ("bitchute", "rumble") else got
    except Exception:
        return ""


def reconcile(platform: str, apply: bool) -> int:
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))
    shorts = data.get("shorts", [])
    id_re = re.compile(LINK_RE[platform])

    fixes, confirmed, unresolved = [], [], []
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            PROFILES[platform], channel="chrome", headless=False, slow_mo=30,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            rows = scrape_content_page(page, platform)
            print(f"Scraped {len(rows)} video row(s) from {CONTENT_PAGES[platform]}\n")

            # title -> id, from the scraped rows
            by_title = {}
            for vid, text in rows.items():
                by_title.setdefault(norm(text), vid)

            for s in shorts:
                blk = (s.get("platforms") or {}).get(platform)
                if not blk or blk.get("status") == "pending":
                    continue
                title = norm(s.get("title") or "")
                if not title:
                    continue
                # find the scraped row whose text contains this row's title
                match = next((vid for rtext, vid in by_title.items() if title and title in rtext), None)
                if not match:
                    continue                      # not in the scraped window; leave alone
                want_url = PUBLIC_URL[platform](match)
                cur = blk.get("url") or ""
                cur_id = (id_re.search(cur) or [None, None])[1] if cur else None

                if cur_id == match and blk.get("status") == "posted":
                    confirmed.append((s["id"], match))
                    continue

                got = public_title(ctx, want_url)
                if got and title[:25] and title[:25] in got:
                    fixes.append((s, blk, s["id"], cur or "(none)", want_url, match))
                else:
                    unresolved.append((s["id"], want_url, got or "(no title)"))
        finally:
            try:
                ctx.close()
            except Exception:
                pass

    print(f"Already correct : {len(confirmed)}")
    print(f"To fix          : {len(fixes)}")
    for _, _, sid, old, new, _ in fixes:
        print(f"   FIX {sid:45s} {old} -> {new}")
    print(f"Unverifiable    : {len(unresolved)}")
    for sid, url, got in unresolved:
        print(f"   ??  {sid:45s} candidate {url} returned title {got!r}")

    if apply and fixes:
        for s, blk, sid, old, new, vid in fixes:
            blk["url"] = new
            blk["status"] = "posted"
            blk.pop("error", None)
            blk["url_note"] = (
                f"URL reconciled from {CONTENT_PAGES[platform]} by title match and confirmed "
                "against the public page. Post-time capture races platform processing; this "
                "pass runs after everything has settled.")
        SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False),
                               encoding="utf-8")
        print(f"\nshorts.json written ({len(fixes)} row(s) corrected).")
    elif fixes:
        print("\n(dry run; pass --apply to write)")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--platform", required=True, choices=["rumble", "bitchute", "both"])
    ap.add_argument("--apply", action="store_true",
                    help="write the corrections (default is a dry run)")
    a = ap.parse_args()
    targets = ["rumble", "bitchute"] if a.platform == "both" else [a.platform]
    for i, p in enumerate(targets):
        if i:
            print("\n" + "=" * 60 + "\n")
        print(f"### {p.upper()}")
        reconcile(p, a.apply)
    return 0


if __name__ == "__main__":
    sys.exit(main())
