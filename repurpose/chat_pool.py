# chat_pool.py — Python port of chat-pool.js (Wave 6 Lane 3 migration, 2026-08-09).
# Shared helper for the ChatGPT image-chat registry (../chatgpt-image-chats.json).
#
# THE REGISTRY FILE IS SHARED WITH THE FROZEN JS STACK (chat-pool.js is rollback and
# still imported by the remotion-builder b-roll scripts gen-batch-freshchat.js /
# generate-broll-reload.js until Phase 7 ports). Every write here is byte-compatible:
# same keys, same "Z"-suffixed ISO-millisecond timestamps, 2-space indent, so either
# language can read what the other wrote. Do not "improve" the schema.
#
# TITLE CONVENTION + DELETION GATE (Mike, 2026-07-22): every automation-created chat is
# RENAMED at registration to start with "b-roll" (video b-roll purposes) or "social"
# (post images). That leading word is the ULTIMATE deletion gate: chat_delete refuses to
# delete any chat whose live title does not start with b-roll/social, so a human's
# personal chat can never be swept even if the registry is wrong. Do not widen the gate.
#
# Caller pattern (per image in a batch) — identical to the JS:
#   import chat_pool as pool
#   url = pool.get_active_url(purpose)            # None => open a fresh chatgpt.com/ chat
#   ... navigate (or open fresh) + generate ...
#   if opened_fresh_this_item: pool.confirm_and_register(page, purpose, batch)
#   if saved_ok: pool.record_image(purpose)       # increment ONLY on a successful save
#   # dead/deleted stored chat: pool.mark_dead(purpose) then treat as fresh
#   ... end of run: chat_delete.sweep_retired(page)
#
# Retired chats are MOVED to `retired` (never silently dropped) and deleted in the UI by
# chat_delete.sweep_retired; anything missed is swept by repurpose/delete-chats.js via
# cleanup/cleanup.js (still JS — cleanup lane not migrated).

import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REG = HERE.parent / "chatgpt-image-chats.json"     # repo root, same file as the JS

# The deletion gate: a chat is deletable ONLY if its live title starts with b-roll or
# social. Single source of truth — chat_delete imports this. Do not widen it.
TITLE_GATE_RE = re.compile(r"^(b-roll|social)\b", re.IGNORECASE)


def _now_iso_z() -> str:
    """JS `new Date().toISOString()` shape: 2026-08-09T14:03:22.123Z (the registry is
    shared with the JS stack; keep the timestamp format identical)."""
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds") \
                   .replace("+00:00", "Z")


def load(reg_path: Path = None) -> dict:
    p = Path(reg_path) if reg_path else REG
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
        d.setdefault("chats", [])
        d.setdefault("retired", [])
        return d
    except Exception:
        return {"cap": 25, "chats": [], "retired": []}


def save(d: dict, reg_path: Path = None):
    p = Path(reg_path) if reg_path else REG
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8",
                 newline="\n")


def cap(reg_path=None) -> int:
    return load(reg_path).get("cap") or 25


def get_active_url(purpose: str, reg_path=None):
    """Active chat URL for a purpose if it still has room (count < cap); else None
    (caller opens fresh)."""
    d = load(reg_path)
    c = next((x for x in d["chats"] if x.get("purpose") == purpose), None)
    if c and (c.get("count") or 0) < (d.get("cap") or 25):
        return c["url"]
    return None


def count_for(purpose: str, reg_path=None) -> int:
    c = next((x for x in load(reg_path)["chats"] if x.get("purpose") == purpose), None)
    return (c.get("count") or 0) if c else 0


def _push_retired(d: dict, chat: dict, reason: str):
    if not chat or not chat.get("url"):
        return
    if any(x.get("url") == chat["url"] for x in d["retired"]):
        return
    d["retired"].append({**chat, "retired_at": _now_iso_z(), "reason": reason})


def title_for(purpose: str) -> str:
    """Gated title for a purpose: "b-roll: <purpose>" for video b-roll purposes
    (anything with "broll" in the name), "social: <purpose>" for everything else."""
    prefix = "b-roll" if re.search(r"broll", purpose, re.IGNORECASE) else "social"
    return f"{prefix}: {purpose}"


def register_new_chat(purpose: str, url: str, batch=None, title=None, reg_path=None):
    """Replace-then-delete: any existing chat for this purpose moves to `retired`
    (queued for UI deletion) and the fresh one starts at count 0."""
    if not url or not re.search(r"chatgpt\.com/c/", url):
        print(f'  [chat-pool] refusing to register non-/c/ url for "{purpose}": {url}')
        return
    d = load(reg_path)
    for old in [x for x in d["chats"] if x.get("purpose") == purpose]:
        _push_retired(d, old, "rotated: replaced by a fresh chat")
    d["chats"] = [x for x in d["chats"] if x.get("purpose") != purpose]
    entry = {"purpose": purpose, "url": url, "count": 0, "created_at": _now_iso_z()}
    if batch:
        entry["batch"] = batch
    if title:
        entry["title"] = title
    d["chats"].append(entry)
    save(d, reg_path)
    print(f"  [chat-pool] new {purpose} chat registered: {url}"
          + (f" (batch {batch})" if batch else "")
          + (f' titled "{title}"' if title else ""))


# The in-page registration routine stays LITERAL JS (page.evaluate body) — it is the
# battle-tested code from chat-pool.js confirmAndRegister, moved verbatim so the
# hardening travels with it: API-confirmed conversation id (page.url() lied for ~2
# weeks, found 2026-07-22), the ±age adoption safety (never rename a human's chat),
# the auto-title race wait (2026-07-30), and the read-back-verified rename.
_CONFIRM_JS = r"""
async (wantTitle) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(x => (x.ok ? x.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { error: 'no access token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };

  const urlId = (location.pathname.match(/\/c\/([a-z0-9-]+)/i) || [])[1] || null;
  let id = null;
  if (urlId) {
    const g = await fetch('/backend-api/conversation/' + urlId, { credentials: 'include', headers: H });
    if (g.ok) id = urlId;
  }
  if (!id) {
    const l = await fetch('/backend-api/conversations?offset=0&limit=1&order=updated',
      { credentials: 'include', headers: H });
    if (!l.ok) return { error: 'conversations list HTTP ' + l.status, urlId };
    const j = await l.json();
    if (!j.items || !j.items.length) return { error: 'conversations list empty', urlId };
    // SAFETY: only adopt the newest conversation if it was CREATED moments ago (this
    // run's fresh chat). An older chat that merely got updated could be Mike chatting
    // in parallel — renaming that would hijack a human's chat. Fail registration instead.
    const it = j.items[0];
    const ageMin = (Date.now() - new Date(it.create_time).getTime()) / 60000;
    if (!(ageMin >= -5 && ageMin <= 10)) {
      return { error: `newest conversation created ${Math.round(ageMin)}m ago — not this run's fresh chat, refusing to adopt/rename it`, urlId };
    }
    id = it.id;
  }

  // Wait out ChatGPT's ASYNC auto-title before renaming (2026-07-30 race): once it has
  // landed, our rename is the last write and sticks. Bounded; healTitles backstops.
  for (let i = 0; i < 9; i++) {
    const g = await fetch('/backend-api/conversation/' + id, { credentials: 'include', headers: H })
      .then(x => (x.ok ? x.json() : null)).catch(() => null);
    const t = g && g.title;
    if (t && !/^new chat$/i.test(t)) break;
    await new Promise(res => setTimeout(res, 5000));
  }

  // Rename to the gated title, then read it back — the rename must VERIFIABLY stick,
  // because this title is what later authorizes deletion.
  const p = await fetch('/backend-api/conversation/' + id, {
    method: 'PATCH', credentials: 'include', headers: H, body: JSON.stringify({ title: wantTitle }),
  });
  if (!p.ok) return { error: 'rename PATCH HTTP ' + p.status, id, urlId };
  const back = await fetch('/backend-api/conversation/' + id, { credentials: 'include', headers: H })
    .then(x => (x.ok ? x.json() : null)).catch(() => null);
  if (!back || back.title !== wantTitle) return { error: 'rename did not stick', id, urlId, got: back && back.title };
  return { id, urlId, mismatched: !!(urlId && urlId !== id) };
}
"""


def confirm_and_register(page, purpose: str, batch=None, reg_path=None):
    """Confirm the REAL conversation id via the backend API, rename to the gated title,
    register the confirmed URL. Returns {url, title} or None (loud warn)."""
    title = title_for(purpose)
    try:
        r = page.evaluate(_CONFIRM_JS, title)
    except Exception as e:
        print(f'  [chat-pool] confirmAndRegister failed for "{purpose}": '
              f'{str(e).splitlines()[0]}')
        return None
    if not r or r.get("error"):
        print(f'  [chat-pool] confirmAndRegister failed for "{purpose}": '
              f'{r.get("error") if r else "no result"} — chat NOT registered')
        return None
    if r.get("mismatched"):
        print(f'  [chat-pool] page.url() id {r.get("urlId")} != real conversation id '
              f'{r["id"]} — registered the REAL one')
    url = "https://chatgpt.com/c/" + r["id"]
    register_new_chat(purpose, url, batch, title, reg_path)
    return {"url": url, "title": title}


def record_image(purpose: str, reg_path=None):
    """Increment the active chat's count, AFTER a successful image save."""
    d = load(reg_path)
    c = next((x for x in d["chats"] if x.get("purpose") == purpose), None)
    if c:
        c["count"] = (c.get("count") or 0) + 1
        save(d, reg_path)


def mark_dead(purpose: str, reg_path=None):
    """Stored chat unreachable: retire it (through `retired`, never dropped) so a
    fresh one is made."""
    d = load(reg_path)
    dead = [x for x in d["chats"] if x.get("purpose") == purpose]
    if not dead:
        return
    for c in dead:
        _push_retired(d, c, "dead: unreachable in the UI")
    d["chats"] = [x for x in d["chats"] if x.get("purpose") != purpose]
    save(d, reg_path)
    print(f"  [chat-pool] retired dead {purpose} chat")


def retire(purpose: str, reason=None, reg_path=None) -> int:
    """Retire a purpose's active chat(s) on demand (no replacement)."""
    d = load(reg_path)
    hits = [x for x in d["chats"] if x.get("purpose") == purpose]
    if not hits:
        return 0
    for c in hits:
        _push_retired(d, c, reason or "retired")
    d["chats"] = [x for x in d["chats"] if x.get("purpose") != purpose]
    save(d, reg_path)
    print(f"  [chat-pool] retired {purpose} chat ({reason or 'retired'})")
    return len(hits)


def get_retired(reg_path=None):
    return load(reg_path)["retired"]


def remove_retired(url: str, reg_path=None):
    d = load(reg_path)
    before = len(d["retired"])
    d["retired"] = [x for x in d["retired"] if x.get("url") != url]
    if len(d["retired"]) != before:
        save(d, reg_path)


def record_gate_skip(chat: dict, note: str, reg_path=None):
    """A retired chat the title gate refused: off the retired queue (retry can never
    succeed) but kept on record for a human."""
    d = load(reg_path)
    d["retired"] = [x for x in d["retired"] if x.get("url") != chat.get("url")]
    d.setdefault("title_gate_skipped", [])
    if not any(x.get("url") == chat.get("url") for x in d["title_gate_skipped"]):
        d["title_gate_skipped"].append({**chat, "gate_skipped_at": _now_iso_z(),
                                        "gate_note": note})
    save(d, reg_path)


def requeue_gate_skipped(url: str, reg_path=None) -> bool:
    """A gate-skipped chat whose live title was HEALED back: requeue for deletion.
    Only heal_titles calls this, only for verified-rename provenance."""
    d = load(reg_path)
    hit = next((x for x in d.get("title_gate_skipped", []) if x.get("url") == url), None)
    if not hit:
        return False
    d["title_gate_skipped"] = [x for x in d["title_gate_skipped"] if x.get("url") != url]
    chat = {k: v for k, v in hit.items() if k not in ("gate_skipped_at", "gate_note")}
    _push_retired(d, chat, "requeued: live title healed back to the gated title")
    save(d, reg_path)
    return True


def status(reg_path=None) -> dict:
    return load(reg_path)
