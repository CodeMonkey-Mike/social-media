# chat_delete.py — Python port of chat-delete.js (Wave 6 Lane 3 migration, 2026-08-09).
# Shared "delete a ChatGPT chat in the UI" routine for the image-gen pipeline.
#
# Why deletion at all: spent image chats were piling up in the ChatGPT sidebar (Mike,
# 2026-07-08). Chats are disposable — every generated image is downloaded to the project
# folder at generation time — so a chat that leaves the registry gets DELETED, not
# orphaned. The JS twin (chat-delete.js) stays frozen as rollback and continues to serve
# the still-JS callers (builder b-roll scripts, delete-chats.js via cleanup).
#
# TWO HARD RULES (Mike, 2026-07-22 — earned, do not relax):
#   1. TITLE GATE: the chat's LIVE title must start with "b-roll" or "social"
#      (chat_pool.TITLE_GATE_RE). Anything else is presumed a human's chat and is NEVER
#      deleted, no matter what the registry claims. Gated refusals return gated=True.
#   2. VERIFIED DELETE: after any delete path, the conversation must ACTUALLY be gone
#      (API 404). "The URL bounced" is not proof — bad ids bounce too, and for ~2 weeks
#      that false success let every real chat survive its own "deletion".
#
# The in-page fetch bodies stay LITERAL JS (page.evaluate) — moved verbatim from the
# battle-tested chat-delete.js so the hardening travels with the code.

import re

import chat_pool as pool

CHAT_ID_RE = re.compile(r"/c/([a-z0-9-]+)", re.IGNORECASE)

_GET_CHAT_JS = r"""
async (cid) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { status: 0, note: 'no access token' };
  const r = await fetch('/backend-api/conversation/' + cid, {
    credentials: 'include', headers: { Authorization: 'Bearer ' + tok },
  });
  if (!r.ok) return { status: r.status };
  const j = await r.json();
  return { status: 200, title: j.title };
}
"""

_HIDE_JS = r"""
async (cid) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { status: 0, note: 'no access token' };
  const r = await fetch('/backend-api/conversation/' + cid, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_visible: false }),
  });
  return { status: r.status };
}
"""

_RENAME_JS = r"""
async ({ cid, title }) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { ok: false, note: 'no access token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const p = await fetch('/backend-api/conversation/' + cid, {
    method: 'PATCH', credentials: 'include', headers: H, body: JSON.stringify({ title }),
  });
  if (!p.ok) return { ok: false, note: 'PATCH HTTP ' + p.status };
  const back = await fetch('/backend-api/conversation/' + cid, { credentials: 'include', headers: H })
    .then(r => (r.ok ? r.json() : null)).catch(() => null);
  return back && back.title === title ? { ok: true } : { ok: false, note: 'rename did not stick' };
}
"""


def _try_click(page, candidates, timeout=3000):
    """Click the first visible candidate selector; return the selector used or None."""
    for sel in candidates:
        try:
            loc = page.locator(sel).first
            loc.wait_for(state="visible", timeout=timeout)
            loc.click()
            return sel
        except Exception:
            continue
    return None


def _api_get_chat(page, chat_id):
    return page.evaluate(_GET_CHAT_JS, chat_id)


def delete_chat(page, url) -> dict:
    """Delete one chat by /c/ URL. Returns {ok, how?, note?, gated?}; never raises."""
    m = CHAT_ID_RE.search(str(url or ""))
    if not m:
        return {"ok": False, "note": "not a /c/ chat url"}
    chat_id = m.group(1)

    # Gate first, via the API (a hidden/deleted chat 404s here regardless of UI state).
    try:
        pre = _api_get_chat(page, chat_id)
    except Exception as e:
        return {"ok": False, "note": "pre-check failed: " + str(e).splitlines()[0]}
    if pre.get("status") == 404:
        return {"ok": True, "how": "already-gone"}
    if pre.get("status") != 200:
        note = f" {pre.get('note')}" if pre.get("note") else ""
        return {"ok": False, "note": f"pre-check HTTP {pre.get('status')}{note}"}
    if not pool.TITLE_GATE_RE.match(pre.get("title") or ""):
        return {"ok": False, "gated": True,
                "note": f"TITLE GATE: live title {(pre.get('title') or '')!r} does not "
                        "start with b-roll/social - refusing to delete"}

    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception as e:
        return {"ok": False, "note": "goto failed: " + str(e).splitlines()[0]}
    page.wait_for_timeout(3000)

    # UI path: conversation options menu -> Delete -> confirm dialog.
    opened = _try_click(page, [
        '[data-testid="conversation-options-button"]',
        'button[aria-label="Open conversation options"]',
        'button[aria-label*="conversation options" i]',
    ])
    if opened:
        d = _try_click(page, [
            '[data-testid="delete-chat-menu-item"]',
            '[role="menuitem"]:has-text("Delete")',
            'div[role="menu"] :text-is("Delete")',
        ])
        if d:
            confirmed = _try_click(page, [
                '[data-testid="delete-conversation-confirm-button"]',
                'div[role="dialog"] button:has-text("Delete")',
            ], timeout=5000)
            if confirmed:
                try:
                    page.wait_for_url(lambda u: chat_id not in str(u), timeout=15000)
                    # Redirect alone is NOT proof (rule 2) — verify it is really gone.
                    try:
                        post = _api_get_chat(page, chat_id)
                    except Exception:
                        post = None
                    if post and post.get("status") == 404:
                        return {"ok": True, "how": "ui"}
                    # Still alive after the UI claimed success — fall to the API path.
                except Exception:
                    pass  # no redirect — fall through to the API path
        for _ in range(2):
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass

    # API fallback: the same PATCH the ChatGPT UI issues on delete.
    try:
        res = page.evaluate(_HIDE_JS, chat_id)
    except Exception as e:
        return {"ok": False, "note": "ui + api both failed: " + str(e).splitlines()[0]}

    if res and res.get("status") == 404:
        return {"ok": True, "how": "api", "note": "was already deleted"}
    if res and res.get("status") == 200:
        try:
            post = _api_get_chat(page, chat_id)
        except Exception:
            post = None
        if post and post.get("status") == 404:
            return {"ok": True, "how": "api"}
        return {"ok": False,
                "note": "api PATCH returned 200 but the chat is still alive "
                        f"(post-check {post and post.get('status')})"}
    note = f" {res.get('note')}" if res and res.get("note") else ""
    return {"ok": False,
            "note": f"delete failed (ui selectors missed; api status "
                    f"{res and res.get('status')}{note})"}


def heal_titles(page, reg_path=None) -> dict:
    """TITLE SELF-REPAIR (2026-07-30 backstop): re-assert the gated title on registry
    entries with VERIFIED-RENAME PROVENANCE only (a recorded `title` that itself passes
    the gate — written only after a read-back-verified rename, so the chat was provably
    ours). Healed gate-skipped entries requeue for deletion. No provenance = never touch."""
    reg = pool.status(reg_path)
    groups = [
        (reg.get("chats") or [], False, "active"),
        (reg.get("retired") or [], False, "retired"),
        (reg.get("title_gate_skipped") or [], True, "gate-skipped"),
    ]
    healed = failed = 0
    for lst, requeue, tag in groups:
        for c in lst:
            if not c.get("title") or not pool.TITLE_GATE_RE.match(c["title"]):
                continue  # no provenance — never touch
            m = CHAT_ID_RE.search(str(c.get("url") or ""))
            if not m:
                continue
            try:
                live = _api_get_chat(page, m.group(1))
            except Exception:
                continue
            if not live or live.get("status") != 200:
                continue  # gone or unreachable — the sweep handles it
            if pool.TITLE_GATE_RE.match(live.get("title") or ""):
                continue  # compliant, nothing to heal
            try:
                r = page.evaluate(_RENAME_JS, {"cid": m.group(1), "title": c["title"]})
            except Exception as e:
                r = {"ok": False, "note": str(e).splitlines()[0]}
            if r and r.get("ok"):
                healed += 1
                print(f"  [heal] {tag} {c.get('purpose', '?')}: live title "
                      f"{(live.get('title') or '')!r} -> {c['title']!r}")
                if requeue and pool.requeue_gate_skipped(c["url"], reg_path):
                    print("         requeued for deletion (was title_gate_skipped)")
            else:
                failed += 1
                print(f"  [heal] FAILED {tag} {c.get('purpose', '?')}: {c.get('url')} "
                      f"- {r and r.get('note')}")
    return {"healed": healed, "failed": failed}


def sweep_retired(page, reg_path=None) -> dict:
    """Delete everything on the registry's `retired` list using an already-open,
    logged-in page. Successes leave the list; transient failures stay queued; title-gate
    refusals move to title_gate_skipped (retry can never succeed). Never raises.
    Heals drifted titles FIRST so a chat we verifiably renamed is never gate-refused
    just because ChatGPT's auto-title overwrote it."""
    try:
        heal_titles(page, reg_path)
    except Exception as e:
        print("  [heal] skipped: " + str(e).splitlines()[0])
    retired = pool.get_retired(reg_path)
    if not retired:
        return {"deleted": 0, "failed": 0, "gated": 0}
    print(f"\n[chat-delete] sweeping {len(retired)} retired chat(s)...")
    deleted = failed = gated = 0
    for c in list(retired):
        r = delete_chat(page, c.get("url"))
        if r.get("ok"):
            pool.remove_retired(c["url"], reg_path)
            deleted += 1
            note = f" - {r['note']}" if r.get("note") else ""
            print(f"  deleted ({r.get('how')}) {c.get('purpose', '?')}: {c['url']}{note}")
        elif r.get("gated"):
            pool.record_gate_skip(c, r.get("note"), reg_path)
            gated += 1
            print(f"  GATED {c.get('purpose', '?')}: {c['url']} - {r.get('note')}")
            print("     Left alive and OFF the delete queue (recorded in "
                  "title_gate_skipped). Delete manually if it truly is disposable.")
        else:
            failed += 1
            print(f"  FAILED {c.get('purpose', '?')}: {c.get('url')} - {r.get('note')} "
                  "(stays queued for the next sweep)")
        page.wait_for_timeout(1200)
    print(f"[chat-delete] sweep done: {deleted} deleted, {failed} still queued"
          + (f", {gated} REFUSED by the title gate (see title_gate_skipped)" if gated
             else "") + ".")
    return {"deleted": deleted, "failed": failed, "gated": gated}
