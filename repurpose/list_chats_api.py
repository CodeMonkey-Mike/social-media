# list_chats_api.py — READ-ONLY conversation inventory via ChatGPT's own backend API.
# Python port of list-chats-api.js (2026-11-27; the JS was deleted the same day).
#
# Why not a sidebar DOM scrape: the sidebar hides archived chats and its lazy-load is
# flaky, so a DOM scrape and the registry can disagree wildly (2026-07-22: 182 sidebar
# chats, 0 of the 14 registry chats among them). The /backend-api/conversations endpoint
# is what the UI itself pages the sidebar from, and it can also return the archived set:
# the ground truth. The paging is reconcile_chats.list_live, the same call the reconcile
# uses, so the two can never disagree about what is on the account.
#
# This is the plain LIST (every chat, newest first, which registry list knows it).
# For the classes (DEAD / DRIFTED / ORPHAN / REVIEW) run reconcile_chats.py instead.
#
# Deletes NOTHING, writes only the --json report.
#
# Usage: python repurpose/list_chats_api.py [--json <out.json>] [--registry <path>]
# Needs the chatgpt profile free: do not run while an image run holds it.

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool  # noqa: E402
import reconcile_chats  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SHOWN = 40


def inventory(live, reg):
    """Join the live conversation list with the registry's active + retired lists.
    Newest update first. Pure (no browser), so it can be tested on its own."""
    known = {}
    for c in reg.get("chats", []):
        known[reconcile_chats.cid_of(c.get("url"))] = {"purpose": c.get("purpose"), "where": "active"}
    for c in reg.get("retired", []):
        known[reconcile_chats.cid_of(c.get("url"))] = {"purpose": c.get("purpose"), "where": "retired"}
    known.pop(None, None)
    chats = []
    for c in live:
        k = known.get(c["id"])
        chats.append({
            "id": c["id"], "title": c.get("title") or "",
            "create_time": c.get("created") or "", "update_time": c.get("updated") or "",
            "is_archived": bool(c.get("archived")),
            "bucket": "archived" if c.get("archived") else "visible",
            "url": f"https://chatgpt.com/c/{c['id']}",
            "registered": k["where"] if k else None,
            "purpose": k["purpose"] if k else None,
        })
    chats.sort(key=lambda c: str(c["update_time"]), reverse=True)
    return chats, known


def main():
    ap = argparse.ArgumentParser(description="List every ChatGPT conversation on the account (read-only).")
    ap.add_argument("--json", default=None, help="write the full list to this file")
    ap.add_argument("--registry", default=None, help="alternate registry path (tests)")
    args = ap.parse_args()
    reg = pool.load(Path(args.registry) if args.registry else None)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        ctx = pool.launch_profile(p)
        try:
            page = ctx.new_page()
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(4000)
            live, errors = reconcile_chats.list_live(page)
        finally:
            ctx.close()
    for e in errors:
        print("WARNING:", e, file=sys.stderr)

    chats, known = inventory(live, reg)
    vis = sum(1 for c in chats if c["bucket"] == "visible")
    print(f"\nConversations: {len(chats)}  (visible: {vis}, archived: {len(chats) - vis})")
    print(f"Registry matches: {sum(1 for c in chats if c['registered'])} of {len(known)}\n")
    for c in chats[:SHOWN]:
        tag = f"[{c['registered']}: {c['purpose']}]" if c["registered"] else ""
        title = (c["title"] or "(untitled)")[:45]
        print(f"  {title:<46} {c['bucket']:<9} {str(c['update_time'])[:10]}  {tag}")
    if len(chats) > SHOWN:
        print(f"  ... {len(chats) - SHOWN} more (see --json)")

    if args.json:
        report = {"scanned_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "chats": chats}
        Path(args.json).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(f"\nWrote {args.json}")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
