# delete_chats.py — delete no-longer-needed ChatGPT image chats (registry:
# ../chatgpt-image-chats.json) and RECONCILE the registry against the live account in
# the SAME browser session. Python port of delete-chats.js (2026-09-17; the JS twin
# stays as frozen rollback). Spawned by cleanup/cleanup.js after the video-creation
# file targets; also a CLI.
#
# Sources of the deletion plan:
#   1. `retired`        chats the gen scripts rotated out / marked dead / born empty but
#                       failed to delete in their own end-of-run sweep
#   2. gate-skipped     entries WITH verified-rename provenance (ChatGPT's auto-title
#                       overwrote our rename): the sweep heals + requeues + deletes them
#   3. batch completed  a chat whose `batch` is completed/archived in ../batches.json is
#                       retired and deleted. No `batch` = evergreen purpose (rotation-only);
#                       a `batch` matching no batches.json entry is kept
#   4. --retire <p>     a purpose's active chat, on request (one-offs without a batch)
#   5. --approved-file  chats MIKE explicitly approved, by URL (the pick-list flow): the
#                       ONLY path that deletes a chat the registry never recorded. Each
#                       is renamed to a gated title first (so chat_delete's live-title
#                       gate still stands), deleted, verified 404, and logged under the
#                       registry's `manual_deletes`. Never run from cleanup.
#
# After the sweep, reconcile_chats.run_reconcile lists the whole account and reports
# DEAD / DRIFTED / ORPHAN / REVIEW (see that file); --fix lets it apply the safe repairs
# (cleanup passes --fix), and any orphan it queues is swept in the same session. REVIEW
# items are never touched: unregistered chats need Mike's per-URL approval.
#
# The two hard rules of chat_delete (live-title gate + verified 404) apply to every path.
#
# Usage: python repurpose/delete_chats.py [--dry-run] [--retire <purpose>]...
#                                          [--approved-file <json>] [--no-reconcile]
#                                          [--fix] [--since YYYY-MM-DD] [--registry <p>]
#   --dry-run   print the plan + the last reconcile summary; no browser, registry untouched
# Opens the shared chatgpt-profile Chrome on a live run — do NOT run while an image-gen
# batch is in flight (a locked profile fails loudly; everything stays queued).

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool          # noqa: E402
import chat_delete                # noqa: E402
import reconcile_chats            # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BATCHES = Path(__file__).resolve().parents[1] / "batches.json"
TERMINAL = {"completed", "archived"}


def batch_status_map():
    try:
        raw = json.loads(BATCHES.read_text(encoding="utf-8"))
        arr = raw if isinstance(raw, list) else raw.get("batches") or []
        return {str(b["batch"]).lower(): b.get("status") for b in arr if b.get("batch")}
    except Exception:
        print("  WARNING: could not read batches.json — batch-completion retirement skipped.")
        return {}


def build_plan(reg, statuses, retire_purposes):
    plan, to_retire = [], []
    for c in reg.get("retired") or []:
        plan.append({**c, "why": c.get("reason") or "previously retired"})
    for c in reg.get("title_gate_skipped") or []:
        if c.get("title") and pool.TITLE_GATE_RE.match(c["title"]):
            plan.append({**c, "why": "gate-skipped, healable (title drifted off the "
                                     "verified rename)"})
    for c in reg.get("chats") or []:
        st = statuses.get(str(c.get("batch")).lower()) if c.get("batch") else None
        if c.get("batch") and st in TERMINAL:
            why = f"batch {c['batch']} {st}"
            to_retire.append((c, why))
            plan.append({**c, "why": why})
        elif c.get("purpose") in retire_purposes:
            why = "retired on request (--retire)"
            to_retire.append((c, why))
            plan.append({**c, "why": why})
    retiring = {c.get("url") for c, _ in to_retire}
    kept = [c for c in reg.get("chats") or [] if c.get("url") not in retiring]
    return plan, to_retire, kept


def print_last_reconcile(reg):
    lr = reg.get("last_reconcile")
    if not lr:
        print("  last reconcile: never run — a live cleanup (or repurpose/reconcile_chats.py) "
              "runs it")
        return
    at = reconcile_chats._ts(lr.get("at"))
    age = ""
    if at:
        h = (datetime.now(timezone.utc) - at).total_seconds() / 3600
        age = f"{h:.0f}h ago" if h < 48 else f"{h / 24:.0f}d ago"
    print(f"  last reconcile ({str(lr.get('at'))[:16]}Z, {age}): live={lr.get('live')} "
          f"dead={lr.get('dead')} drifted={lr.get('drifted')} orphans={lr.get('orphans')} "
          f"review={lr.get('review')} queued={lr.get('queued')}")
    rl = lr.get("review_list") or []
    for r in rl[:20]:
        print(f"    REVIEW  \"{r.get('title')}\" https://chatgpt.com/c/{r.get('id')} "
              f"({r.get('why')})")
    if len(rl) > 20:
        print(f"    ... {len(rl) - 20} more on the registry's last_reconcile.review_list")
    if rl:
        print("    (review items are never auto-deleted: approve per URL with "
              "--approved-file <json>)")


def approved_deletes(page, path, reg_path=None):
    """Delete exactly the chats Mike approved. File: {"approved": [url|id, ...]} or a
    bare list. Rename-to-gated first (an explicit, logged write), then the standard
    verified delete."""
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    items = raw.get("approved") if isinstance(raw, dict) else raw
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    gated = f"social: approved-delete {stamp}"
    ok = fail = 0
    print(f"\n[approved] {len(items or [])} chat(s) approved by Mike ({path})")
    for u in items or []:
        cid = reconcile_chats.cid_of(u) or (str(u) if re.fullmatch(r"[a-z0-9-]{8,}", str(u))
                                            else None)
        if not cid:
            print(f"  SKIP not a chat url/id: {u}")
            fail += 1
            continue
        url = f"https://chatgpt.com/c/{cid}"
        try:
            pre = chat_delete._api_get_chat(page, cid)
        except Exception as e:
            pre = {"status": 0, "note": str(e).splitlines()[0]}
        if pre.get("status") == 404:
            print(f"  already gone: {url}")
            ok += 1
            continue
        if pre.get("status") != 200:
            print(f"  FAILED pre-check HTTP {pre.get('status')} {pre.get('note') or ''}: {url}")
            fail += 1
            continue
        title = pre.get("title") or ""
        if not pool.TITLE_GATE_RE.match(title):
            try:
                r = page.evaluate(chat_delete._RENAME_JS, {"cid": cid, "title": gated})
            except Exception as e:
                r = {"ok": False, "note": str(e).splitlines()[0]}
            if not (r and r.get("ok")):
                # The PATCH usually landed; the single read-back lags (2026-09-17: five
                # "did not stick" under a 429 storm were all renamed). Re-read with backoff.
                for wait in (3000, 6000, 10000):
                    page.wait_for_timeout(wait)
                    back = chat_delete._api_get_chat(page, cid)
                    if back.get("status") == 200 and pool.TITLE_GATE_RE.match(back.get("title") or ""):
                        r = {"ok": True}
                        break
            if not (r and r.get("ok")):
                print(f"  FAILED rename-before-delete ({r and r.get('note')}): "
                      f"\"{title}\" {url} — left alive")
                fail += 1
                continue
        res = chat_delete.delete_chat(page, url)
        if res.get("ok"):
            pool.record_manual_delete(url, title, reg_path)
            ok += 1
            print(f"  deleted ({res.get('how')}) \"{title}\": {url}")
        else:
            # Renamed but not deleted: queue it so the next sweep finishes the job.
            pool.queue_orphan(url, "approved-delete", gated,
                              f"approved by Mike {stamp}, delete failed once", reg_path)
            fail += 1
            print(f"  FAILED \"{title}\": {url} - {res.get('note')} (queued for the next sweep)")
        page.wait_for_timeout(2500)      # pace: a burst of deletes trips the API's 429
    print(f"[approved] done: {ok} deleted, {fail} failed/skipped")
    return ok, fail


def main():
    ap = argparse.ArgumentParser(description="Delete spent ChatGPT image chats and "
                                             "reconcile the registry (one browser session).")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--retire", action="append", default=[], metavar="PURPOSE",
                    help="also queue this purpose's active chat")
    ap.add_argument("--approved-file", default=None,
                    help="JSON of chat URLs/ids Mike explicitly approved for deletion")
    ap.add_argument("--no-reconcile", action="store_true")
    ap.add_argument("--fix", action="store_true",
                    help="let the reconcile pass apply its safe repairs (cleanup does)")
    ap.add_argument("--since", default=None,
                    help="YYYY-MM-DD: reconcile REVIEW widened to chats created since")
    ap.add_argument("--registry", default=None, help="alternate registry path (tests)")
    args = ap.parse_args()
    reg_path = Path(args.registry) if args.registry else None

    reg = pool.status(reg_path)
    statuses = batch_status_map()
    plan, to_retire, kept = build_plan(reg, statuses, set(args.retire))

    if not plan:
        print(f"  No chats to delete. ({len(kept)} active chat(s) kept.)")
    else:
        print(f"  {'Would delete' if args.dry_run else 'Deleting'} {len(plan)} chat(s):")
        for p in plan:
            print(f"    {(p.get('purpose') or '?'):30} — {p['why']}\n      {p.get('url')}")
        print(f"  Keeping {len(kept)} active chat(s) (evergreen, active batch, or "
              "unregistered batch).")

    if args.dry_run:
        print_last_reconcile(reg)
        print("\n  [dry-run] nothing deleted, registry untouched.")
        return

    for c, why in to_retire:
        pool.retire_url(c["url"], why, reg_path)

    since = None
    if args.since:
        since = datetime.fromisoformat(args.since).replace(tzinfo=timezone.utc)

    from playwright.sync_api import sync_playwright
    failed = 0
    with sync_playwright() as p:
        try:
            browser = pool.launch_profile(p)
        except Exception as e:
            print("  ERROR: could not open the chatgpt-profile browser (in use by an "
                  "image-gen run?).")
            print("  " + str(e).splitlines()[0])
            print("  Retired chats stay queued; re-run later: python repurpose/delete_chats.py")
            sys.exit(1)
        try:
            page = browser.new_page()
            # Land on the chatgpt.com origin first: the title-gate pre-check fetches a
            # RELATIVE url, which has no origin on about:blank (Mike 2026-07-28).
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            r = chat_delete.sweep_retired(page, reg_path)
            failed += r.get("failed", 0)
            if args.approved_file:
                failed += approved_deletes(page, args.approved_file, reg_path)[1]
            if not args.no_reconcile:
                print("\n--- reconcile (registry vs live account) ---")
                summary = reconcile_chats.run_reconcile(page, reg_path, fix=args.fix,
                                                        since=since)
                fx = summary.get("fixed") or {}
                if fx.get("queued_orphans") or fx.get("cleared_dead"):
                    print("\n[chat-delete] sweeping what reconcile just queued "
                          "(adopted orphans / dead slots)...")
                    failed += chat_delete.sweep_retired(page, reg_path).get("failed", 0)
        finally:
            try:
                browser.close()
            except Exception:
                pass
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
