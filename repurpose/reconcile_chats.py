# reconcile_chats.py — reconcile the chat registry against the LIVE ChatGPT account.
# (Hardening item 2026-08-11, born from the gen_batch first-run incident where a
# read-after-write title-verify lag orphaned a freshly-rotated chat OUTSIDE the registry.
# Widened 2026-09-17 after Mike found 68 unregistered automation chats by hand in the
# sidebar — not one of them visible to the old report.)
#
# Compares chatgpt-image-chats.json against the live conversation list and reports:
#   DEAD      registry-active entry whose conversation 404s (deleted out from under us)
#   DRIFTED   registry-active entry whose live title differs from the recorded one
#   ORPHAN    live chat whose title passes the TITLE GATE (b-roll:/social:) — a prefix
#             ONLY our automation writes — that no registry list contains
#   REVIEW    live chat no registry list contains, whose title does NOT carry our
#             prefix, created inside a recorded automation run window (the registry's
#             `runs` journal, chat_pool.journal_start) or after --since. Provenance by
#             recorded time, never by title guessing. REPORT ONLY: each one needs Mike's
#             per-URL approval (repurpose/delete_chats.py --approved-file). Never
#             auto-deleted — the 2026-07-22 rule (an inferred list once held two of
#             Mike's personal chats) stands.
#   QUEUED    retired entries still awaiting the delete sweep (context, not a defect)
#
# READ-ONLY by default. --fix applies the safe subset:
#   - ORPHAN  -> chat_pool.queue_orphan: onto the delete queue, never the active slot
#               (its count is unknown; rotation would replace it anyway). The sweep's
#               live-title gate still runs at delete time.
#   - DEAD    -> chat_pool.mark_dead (clears the active slot; nothing to delete)
#   - DRIFTED with verified-rename provenance -> chat_delete.heal_titles; no provenance
#               = report only, never touch (a human may own it)
#   - REVIEW  -> never touched
# Deletion itself stays with the sweep (chat_delete.sweep_retired) and its two hard
# rules (title gate + verified 404) — this tool never deletes anything.
#
# The WHOLE account is paged (visible + archived; the old 200-most-recent window hid two
# gate-titled orphans from August). The counts (+ the review list) are written to the
# registry's `last_reconcile` so cleanup's --dry-run can show them without a browser, and
# one machine line is printed for cleanup:
#   RECONCILE live=N dead=N drifted=N orphans=N review=N queued=N
#
# Usage (needs the chatgpt Chrome profile; do NOT run while an image-gen stage holds
# the chatgpt stage lock):
#   python repurpose/reconcile_chats.py                    # report
#   python repurpose/reconcile_chats.py --fix              # report + safe repairs
#   python repurpose/reconcile_chats.py --since 2026-08-04 # widen REVIEW to every
#                                                          # unregistered chat created
#                                                          # on/after that date
# delete_chats.py (cleanup) calls run_reconcile(page, ...) inside its own session.

import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool          # noqa: E402
import chat_delete                # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# List conversations via the same in-page backend API the delete/rename paths use
# (literal JS body, session-token authed; sidebar scraping is not a data source).
# Pages until the API's own `total` is reached; `limit` 0 = everything.
_LIST_JS = r"""
async ({ limit, archived }) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { error: 'no access token' };
  const out = [];
  let total = null;
  for (let offset = 0; ; offset += 100) {
    const u = '/backend-api/conversations?offset=' + offset + '&limit=100&order=updated' +
              (archived ? '&is_archived=true' : '');
    const r = await fetch(u, { credentials: 'include', headers: { Authorization: 'Bearer ' + tok } });
    if (!r.ok) return { error: 'HTTP ' + r.status, items: out, total };
    const j = await r.json();
    if (j.total != null) total = j.total;
    const items = j.items || [];
    for (const it of items) {
      out.push({ id: it.id, title: it.title || '', created: it.create_time || '',
                 updated: it.update_time || '', archived: !!it.is_archived });
    }
    if (!items.length) break;
    if (total != null && out.length >= total) break;
    if (limit && out.length >= limit) break;
  }
  return { items: out, total };
}
"""

PURPOSE_RE = re.compile(r"^(?:b-roll|social)\s*:\s*(\S+)", re.IGNORECASE)
WINDOW_PAD = timedelta(minutes=2)       # clock slack around a journaled run window
OPEN_WINDOW_CAP = timedelta(hours=6)    # a window never closed (crash/kill) counts this long


def cid_of(url):
    m = chat_delete.CHAT_ID_RE.search(str(url or ""))
    return m.group(1) if m else None


def _ts(s):
    """ISO-8601 (ChatGPT create_time / registry Z-times) -> aware datetime, or None."""
    if not s:
        return None
    try:
        d = datetime.fromisoformat(str(s).replace("Z", "+00:00"))
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def list_live(page, limit=0):
    """Every conversation on the account (visible + archived), de-duplicated by id."""
    live, errors = [], []
    for archived in (False, True):
        r = page.evaluate(_LIST_JS, {"limit": limit, "archived": archived})
        if r.get("error"):
            errors.append(r["error"])
        live.extend(r.get("items") or [])
    seen, out = set(), []
    for c in live:
        if c["id"] in seen:
            continue
        seen.add(c["id"])
        out.append(c)
    return out, errors


def review_reason(chat, windows, since=None):
    """Why an unregistered, un-prefixed live chat lands on REVIEW — or None."""
    created = _ts(chat.get("created"))
    if created is None:
        return None
    for started, ended, run in windows:
        a = _ts(started)
        if a is None:
            continue
        b = _ts(ended) or (a + OPEN_WINDOW_CAP)
        if a - WINDOW_PAD <= created <= b + WINDOW_PAD:
            tag = run.get("purpose") or "?"
            if run.get("batch"):
                tag += f"/{run['batch']}"
            return f"created during run {tag} started {str(started)[:16]}Z"
    if since is not None and created >= since:
        return f"created on/after --since {since.date()}"
    return None


def run_reconcile(page, reg_path=None, limit=0, fix=False, since=None,
                  fix_ids=None) -> dict:
    """The reconcile pass on an already-open, authed page (on chatgpt.com). Returns the
    summary it also writes to the registry's `last_reconcile`.

    fix_ids: when a set of conversation ids is given, --fix may adopt ONLY those orphans.
    A test running against the live account with a scratch registry sees every
    production chat as an orphan; unscoped, its --fix deleted all 7 registered
    production chats on 2026-09-17. Tests MUST pass their own ids here."""
    reg = pool.status(reg_path)
    active = reg.get("chats") or []
    retired = reg.get("retired") or []
    gate_skipped = reg.get("title_gate_skipped") or []
    known_ids = {cid_of(c.get("url")) for c in active + retired + gate_skipped}
    known_ids.discard(None)
    print(f"registry: {len(active)} active · {len(retired)} retired (delete-queued) · "
          f"{len(gate_skipped)} gate-skipped · {len(reg.get('runs') or [])} journaled run(s)")

    live, errors = list_live(page, limit)
    if not live and errors:
        print(f"FATAL: could not list conversations ({errors[0]}) — is the chatgpt "
              "profile signed in?", file=sys.stderr)
        return {"error": errors[0]}
    live_by_id = {c["id"]: c for c in live}
    print(f"live: {len(live)} conversation(s) listed (visible + archived)"
          + (f" — partial read: {'; '.join(errors)}" if errors else ""))

    # DEAD + DRIFTED (active entries checked against the live account)
    dead, drifted = [], []
    for c in active:
        cid = cid_of(c.get("url"))
        if not cid:
            continue
        hit = live_by_id.get(cid)
        if hit is None:
            # not in the listing — confirm individually before calling it dead
            got = chat_delete._api_get_chat(page, cid)
            if got.get("status") == 404:
                dead.append(c)
                continue
            hit = {"title": got.get("title", "")} if got.get("status") == 200 else None
        if hit is not None and c.get("title") and hit.get("title") != c["title"]:
            drifted.append((c, hit.get("title") or ""))

    # ORPHAN (gate-titled) + REVIEW (un-prefixed, inside a journaled run window / --since)
    unknown = [c for c in live if c["id"] not in known_ids]
    orphans = [c for c in unknown if pool.TITLE_GATE_RE.match(c.get("title") or "")]
    windows = pool.run_windows(reg_path)
    review = []
    for c in unknown:
        if pool.TITLE_GATE_RE.match(c.get("title") or ""):
            continue
        why = review_reason(c, windows, since)
        if why:
            review.append((c, why))
    review.sort(key=lambda t: t[0].get("created") or "", reverse=True)

    print()
    if not (dead or drifted or orphans or review):
        print("RECONCILED ✓ — no dead entries, no title drift, no orphans, nothing to review.")
    for c in dead:
        print(f"DEAD    {c.get('purpose', '?')}: {c.get('url')} (live 404)")
    for c, live_title in drifted:
        print(f"DRIFTED {c.get('purpose', '?')}: recorded {c.get('title')!r} "
              f"vs live {live_title!r}")
    for c in orphans:
        print(f"ORPHAN  live \"{c['title']}\" https://chatgpt.com/c/{c['id']} "
              f"(created {c['created'][:10]})")
    for c, why in review:
        print(f"REVIEW  \"{c['title']}\" https://chatgpt.com/c/{c['id']} "
              f"(created {c['created'][:10]}; {why})")
    if review:
        print(f"        ^ {len(review)} unregistered chat(s) our automation may have created. "
              "NOT deleted: Mike approves per URL\n"
              "          (python repurpose/delete_chats.py --approved-file <json>; "
              "see repurpose/SKILL.md).")
    if retired:
        print(f"QUEUED  {len(retired)} retired chat(s) awaiting the delete sweep (normal; "
              "the sweep runs at the end of every gen run and in cleanup)")

    summary = {
        "live": len(live), "dead": len(dead), "drifted": len(drifted),
        "orphans": len(orphans), "review": len(review), "queued": len(retired),
        "review_list": [{"id": c["id"], "title": c["title"], "created": c["created"][:19],
                         "why": why} for c, why in review][:200],
        "orphan_list": [{"id": c["id"], "title": c["title"], "created": c["created"][:19]}
                        for c in orphans][:100],
    }
    if review and reg_path is None:      # production only: the full list, for Mike's pick
        out = Path(__file__).resolve().parent / "output" / \
            f"chat-review-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.json"
        try:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps({
                "note": "REVIEW ONLY. Unregistered chats our automation may have created. "
                        "Nothing here is deleted without Mike approving each URL "
                        "(delete_chats.py --approved-file).",
                "scanned_at": pool._now_iso_z(),
                "rows": [{"n": i + 1, "created": c["created"][:10], "title": c["title"],
                          "id": c["id"], "url": f"https://chatgpt.com/c/{c['id']}",
                          "why": why} for i, (c, why) in enumerate(review)],
            }, indent=2, ensure_ascii=False), encoding="utf-8")
            summary["review_file"] = str(out)
            print(f"        full review list: {out}")
        except Exception as e:
            print(f"        (could not write the review file: {str(e).splitlines()[0]})")
    print(f"RECONCILE live={len(live)} dead={len(dead)} drifted={len(drifted)} "
          f"orphans={len(orphans)} review={len(review)} queued={len(retired)}")

    if fix:
        fixed = {"cleared_dead": 0, "queued_orphans": 0, "healed": 0}
        print("\napplying --fix repairs...")
        for c in dead:
            pool.mark_dead(c["purpose"], reg_path)
            fixed["cleared_dead"] += 1
            print(f"  cleared dead active slot: {c.get('purpose')}")
        for c in orphans:
            if fix_ids is not None and c["id"] not in fix_ids:
                continue
            m = PURPOSE_RE.match(c["title"])
            purpose = m.group(1) if m else "orphan"
            if pool.queue_orphan(f"https://chatgpt.com/c/{c['id']}", purpose, c["title"],
                                 f"orphan adopted by reconcile (created {c['created'][:10]})",
                                 reg_path):
                fixed["queued_orphans"] += 1
        if drifted:
            print("  healing drifted titles (provenance-backed only)...")
            r = chat_delete.heal_titles(page, reg_path)
            fixed["healed"] = r.get("healed", 0)
        summary["fixed"] = fixed
        if not any(fixed.values()):
            print("  nothing to repair")
    elif dead or drifted or orphans:
        print("\n(report only — re-run with --fix to apply the safe repairs)")

    pool.set_last_reconcile(summary, reg_path)
    return summary


def main():
    ap = argparse.ArgumentParser(description="Reconcile the pooled-chat registry "
                                             "against the live ChatGPT account.")
    ap.add_argument("--fix", action="store_true",
                    help="apply the safe repairs (queue gate-titled orphans for deletion, "
                         "clear dead slots, heal provenance-backed titles). Default: report.")
    ap.add_argument("--limit", type=int, default=0,
                    help="cap the conversations listed (default 0 = the whole account)")
    ap.add_argument("--since", default=None,
                    help="YYYY-MM-DD: also put every unregistered chat created on/after "
                         "this date on REVIEW (report only, never deleted)")
    ap.add_argument("--registry", default=None, help="alternate registry path (tests)")
    args = ap.parse_args()

    reg_path = Path(args.registry) if args.registry else None
    since = None
    if args.since:
        since = datetime.fromisoformat(args.since).replace(tzinfo=timezone.utc)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = pool.launch_profile(p)
        page = browser.new_page()
        try:
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            r = run_reconcile(page, reg_path, limit=args.limit, fix=args.fix, since=since)
            if r.get("error"):
                sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
