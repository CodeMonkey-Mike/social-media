# reconcile_chats.py — periodic chat-registry reconcile (hardening item, 2026-08-11,
# born from the gen_batch first-run incident: a read-after-write title-verify lag
# orphaned a freshly-rotated chat OUTSIDE the registry while its rename had in fact
# landed — invisible until hand-checked. This tool makes that class VISIBLE.)
#
# Compares chatgpt-image-chats.json against the LIVE ChatGPT conversation list and
# reports, per class:
#   DEAD      registry-active entry whose conversation 404s (deleted out from under us)
#   DRIFTED   registry-active entry whose live title differs from the recorded one
#   ORPHAN    live conversation whose title passes the pool TITLE GATE (b-roll:/social:)
#             but which no registry list (active/retired/gate-skipped) contains
#   QUEUED    retired entries still awaiting the delete sweep (context, not a defect)
#
# READ-ONLY by default. --fix applies the safe subset:
#   - ORPHAN whose title parses to a purpose -> pool.register_new_chat (adopting it;
#     if that purpose already has an active chat the old one rotates to retired,
#     exactly the normal cap-rotation path)
#   - DEAD  -> pool.mark_dead (clears the active slot; nothing to delete, it is gone)
#   - DRIFTED with verified-rename provenance -> chat_delete.heal_titles handles these;
#     --fix runs it. No provenance = report only, never touch (a human may own it).
# Deletion itself stays with the sweep (chat_delete.sweep_retired) and its two hard
# rules (title gate + verified 404) — this tool never deletes anything.
#
# Usage (needs the chatgpt Chrome profile; do NOT run while an image-gen stage holds
# the chatgpt stage lock):
#   python repurpose/reconcile_chats.py            # report
#   python repurpose/reconcile_chats.py --fix      # report + safe repairs

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool          # noqa: E402
import chat_delete                # noqa: E402
from gen_images import PROFILE_DIR  # noqa: E402  (one profile, one source of truth)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# List conversations via the same in-page backend API the delete/rename paths use
# (literal JS body, session-token authed; sidebar scraping is not a data source).
_LIST_JS = r"""
async (limit) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { error: 'no access token' };
  const out = [];
  for (let offset = 0; offset < limit; offset += 100) {
    const r = await fetch('/backend-api/conversations?offset=' + offset +
                          '&limit=100&order=updated', {
      credentials: 'include', headers: { Authorization: 'Bearer ' + tok },
    });
    if (!r.ok) return { error: 'HTTP ' + r.status, items: out };
    const j = await r.json();
    for (const it of (j.items || [])) {
      out.push({ id: it.id, title: it.title || '', updated: it.update_time || '' });
    }
    if (!j.items || j.items.length < 100) break;
  }
  return { items: out };
}
"""

PURPOSE_RE = re.compile(r"^(?:b-roll|social)\s*:\s*(\S+)", re.IGNORECASE)


def cid_of(url):
    m = chat_delete.CHAT_ID_RE.search(str(url or ""))
    return m.group(1) if m else None


def main():
    ap = argparse.ArgumentParser(description="Reconcile the pooled-chat registry "
                                             "against the live ChatGPT account.")
    ap.add_argument("--fix", action="store_true",
                    help="apply the safe repairs (adopt orphans, clear dead slots, "
                         "heal provenance-backed titles). Default: report only.")
    ap.add_argument("--limit", type=int, default=200,
                    help="how many recent conversations to list (default 200)")
    ap.add_argument("--registry", default=None, help="alternate registry path (tests)")
    args = ap.parse_args()

    reg_path = Path(args.registry) if args.registry else None
    reg = pool.status(reg_path)
    active = reg.get("chats") or []
    retired = reg.get("retired") or []
    gate_skipped = reg.get("title_gate_skipped") or []
    known_ids = {cid_of(c.get("url")) for c in active + retired + gate_skipped}
    known_ids.discard(None)

    print(f"registry: {len(active)} active · {len(retired)} retired (delete-queued) · "
          f"{len(gate_skipped)} gate-skipped")

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            PROFILE_DIR, channel="chrome", headless=False,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        browser.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = browser.new_page()
        try:
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            listing = page.evaluate(_LIST_JS, args.limit)
            if listing.get("error") and not listing.get("items"):
                print(f"FATAL: could not list conversations ({listing['error']}) — "
                      "is the chatgpt profile signed in?", file=sys.stderr)
                sys.exit(1)
            live = listing.get("items") or []
            live_by_id = {c["id"]: c for c in live}
            print(f"live: {len(live)} conversation(s) listed"
                  + (f" (listing error after partial read: {listing['error']})"
                     if listing.get("error") else ""))

            # DEAD + DRIFTED (active entries checked against the live account)
            dead, drifted = [], []
            for c in active:
                cid = cid_of(c.get("url"))
                if not cid:
                    continue
                hit = live_by_id.get(cid)
                if hit is None:
                    # not in the recent listing — confirm individually before
                    # calling it dead (an old quiet chat can fall off the window)
                    got = chat_delete._api_get_chat(page, cid)
                    if got.get("status") == 404:
                        dead.append(c)
                        continue
                    hit = {"title": got.get("title", "")} if got.get("status") == 200 else None
                if hit is not None and c.get("title") and hit.get("title") != c["title"]:
                    drifted.append((c, hit.get("title") or ""))

            # ORPHANS (gate-titled live chats no registry list knows)
            orphans = [c for c in live
                       if c["id"] not in known_ids
                       and pool.TITLE_GATE_RE.match(c.get("title") or "")]

            print()
            if not (dead or drifted or orphans):
                print("RECONCILED ✓ — no dead entries, no title drift, no orphans.")
            for c in dead:
                print(f"DEAD    {c.get('purpose', '?')}: {c.get('url')} (live 404)")
            for c, live_title in drifted:
                print(f"DRIFTED {c.get('purpose', '?')}: recorded {c.get('title')!r} "
                      f"vs live {live_title!r}")
            for c in orphans:
                print(f"ORPHAN  live \"{c['title']}\" https://chatgpt.com/c/{c['id']} "
                      f"(updated {c['updated'][:19]})")
            if retired:
                print(f"QUEUED  {len(retired)} retired chat(s) awaiting the delete "
                      "sweep (normal; run the sweep via the repurpose graph or "
                      "cleanup)")

            if not args.fix:
                if dead or drifted or orphans:
                    print("\n(report only — re-run with --fix to apply the safe repairs)")
                return

            print("\napplying --fix repairs...")
            for c in dead:
                pool.mark_dead(c["purpose"], reg_path)
                print(f"  cleared dead active slot: {c.get('purpose')}")
            for c in orphans:
                m = PURPOSE_RE.match(c["title"])
                if not m:
                    print(f"  orphan NOT adopted (no purpose in title): \"{c['title']}\"")
                    continue
                purpose = m.group(1)
                pool.register_new_chat(purpose, f"https://chatgpt.com/c/{c['id']}",
                                       title=c["title"], reg_path=reg_path)
                print(f"  adopted orphan as active {purpose} chat")
            if drifted:
                print("  healing drifted titles (provenance-backed only)...")
                chat_delete.heal_titles(page, reg_path)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
