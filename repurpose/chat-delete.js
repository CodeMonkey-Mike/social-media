// chat-delete.js — shared "delete a ChatGPT chat in the UI" routine for the image-gen pipeline.
//
// Why deletion at all: spent image chats were piling up in the ChatGPT sidebar (Mike, 2026-07-08).
// Chats are disposable — every generated image is downloaded to the project folder immediately, and
// a lost image is one re-prompt away — so a chat that leaves the registry gets DELETED, not orphaned.
//
// Two callers:
//   - the gen scripts (gen-images.js / gen-batch-freshchat.js / generate-broll-wlw.js) call
//     sweepRetired(page) at the END of a run, while their browser is already open — this deletes
//     whatever rotation/markDead just queued in the registry's `retired` list;
//   - repurpose/delete-chats.js (invoked by cleanup/cleanup.js) opens the profile itself and sweeps
//     leftovers + chats retired by batch completion.
//
// deleteChat() is layered: UI path first (options menu → Delete → confirm — what a human does,
// verified by the redirect off /c/<id>), then the backend PATCH the UI itself issues
// (is_visible:false) as a fallback when selectors drift. A failure NEVER throws to the caller;
// the chat just stays queued in `retired` for the next sweep.
const pool = require('./chat-pool');

const CHAT_ID_RE = /\/c\/([a-z0-9-]+)/i;

// Click the first visible candidate selector; returns the selector used or null.
async function tryClick(page, candidates, timeout = 3000) {
  for (const sel of candidates) {
    try {
      const loc = page.locator(sel).first();
      await loc.waitFor({ state: 'visible', timeout });
      await loc.click();
      return sel;
    } catch (e) { /* try the next candidate */ }
  }
  return null;
}

// API-side lookup of a conversation: { status, title }. Runs inside the authed page. Internal.
async function apiGetChat(page, chatId) {
  return page.evaluate(async (cid) => {
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
  }, chatId);
}

// Delete one chat by /c/ URL. Returns { ok, how?, note?, gated? }; never throws.
//
// TWO HARD RULES (Mike, 2026-07-22 — earned, do not relax):
//   1. TITLE GATE: the chat's LIVE title must start with "b-roll" or "social"
//      (pool.TITLE_GATE_RE). Anything else is presumed a human's chat and is NEVER
//      deleted, no matter what the registry claims. Gated refusals return { gated: true }.
//   2. VERIFIED DELETE: after any delete path, the conversation must ACTUALLY be gone
//      (API 404). "The URL bounced" is not proof — bad ids bounce too, and for ~2 weeks
//      that false success let every real chat survive its own "deletion".
async function deleteChat(page, url) {
  const m = String(url || '').match(CHAT_ID_RE);
  if (!m) return { ok: false, note: 'not a /c/ chat url' };
  const chatId = m[1];

  // Gate first, via the API (a hidden/deleted chat 404s here regardless of UI state).
  let pre = null;
  try { pre = await apiGetChat(page, chatId); }
  catch (e) { return { ok: false, note: 'pre-check failed: ' + e.message.split('\n')[0] }; }
  if (pre.status === 404) return { ok: true, how: 'already-gone' };
  if (pre.status !== 200) return { ok: false, note: `pre-check HTTP ${pre.status}${pre.note ? ' ' + pre.note : ''}` };
  if (!pool.TITLE_GATE_RE.test(pre.title || '')) {
    return { ok: false, gated: true, note: `TITLE GATE: live title ${JSON.stringify(pre.title || '')} does not start with b-roll/social — refusing to delete` };
  }

  try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); }
  catch (e) { return { ok: false, note: 'goto failed: ' + e.message.split('\n')[0] }; }
  await page.waitForTimeout(3000);

  // UI path: conversation options menu → Delete → confirm dialog.
  const opened = await tryClick(page, [
    '[data-testid="conversation-options-button"]',
    'button[aria-label="Open conversation options"]',
    'button[aria-label*="conversation options" i]',
  ]);
  if (opened) {
    const del = await tryClick(page, [
      '[data-testid="delete-chat-menu-item"]',
      '[role="menuitem"]:has-text("Delete")',
      'div[role="menu"] :text-is("Delete")',
    ]);
    if (del) {
      const confirmed = await tryClick(page, [
        '[data-testid="delete-conversation-confirm-button"]',
        'div[role="dialog"] button:has-text("Delete")',
      ], 5000);
      if (confirmed) {
        try {
          await page.waitForURL(u => !String(u).includes(chatId), { timeout: 15000 });
          // Redirect alone is NOT proof (rule 2) — verify the conversation is really gone.
          const post = await apiGetChat(page, chatId).catch(() => null);
          if (post && post.status === 404) return { ok: true, how: 'ui' };
          // Still alive after the UI claimed success — fall through to the API path.
        } catch (e) { /* no redirect — fall through to the API path */ }
      }
    }
    // Close any half-open menu/dialog so the API path starts clean.
    await page.keyboard.press('Escape').catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
  }

  // API fallback: the same PATCH the ChatGPT UI issues on delete, run inside the authed page.
  let res = null;
  try {
    res = await page.evaluate(async (cid) => {
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
    }, chatId);
  } catch (e) { return { ok: false, note: 'ui + api both failed: ' + e.message.split('\n')[0] }; }

  if (res && res.status === 404) return { ok: true, how: 'api', note: 'was already deleted' };
  if (res && res.status === 200) {
    // Verify the hide actually stuck (rule 2): the conversation must now 404.
    const post = await apiGetChat(page, chatId).catch(() => null);
    if (post && post.status === 404) return { ok: true, how: 'api' };
    return { ok: false, note: `api PATCH returned 200 but the chat is still alive (post-check ${post && post.status})` };
  }
  return { ok: false, note: `delete failed (ui selectors missed; api status ${res && res.status}${res && res.note ? ' ' + res.note : ''})` };
}

// PATCH a conversation's title inside the authed page and verify it stuck. Internal.
async function apiRename(page, chatId, wantTitle) {
  return page.evaluate(async ({ cid, title }) => {
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
  }, { cid: chatId, title: wantTitle });
}

// TITLE SELF-REPAIR (added 2026-07-30). ChatGPT auto-titles a new conversation asynchronously;
// when that landed AFTER confirmAndRegister's gated rename it overwrote the "b-roll:/social:"
// title, and the drifted chat later hit the deletion gate (live: "Cinematic Trading Hall" while
// the registry recorded "b-roll: broll", peach-minute 2026-07-29). confirmAndRegister now waits
// out the auto-title before renaming; this is the backstop for anything that still slips through.
//
// Scope is deliberately narrow: only registry entries with VERIFIED-RENAME PROVENANCE — a recorded
// `title` that itself passes the gate, which confirmAndRegister only writes after a read-back-
// verified rename — are ever re-renamed. That proves the chat was ours at registration, so healing
// it never touches a human's chat. Healed `title_gate_skipped` entries go back on the retired
// queue for deletion. Entries without that provenance are left strictly alone.
async function healTitles(page) {
  const reg = pool.status();
  const groups = [
    { list: reg.chats || [], requeue: false, tag: 'active' },
    { list: reg.retired || [], requeue: false, tag: 'retired' },
    { list: reg.title_gate_skipped || [], requeue: true, tag: 'gate-skipped' },
  ];
  let healed = 0, failed = 0;
  for (const { list, requeue, tag } of groups) {
    for (const c of list) {
      if (!c.title || !pool.TITLE_GATE_RE.test(c.title)) continue; // no provenance — never touch
      const m = String(c.url || '').match(CHAT_ID_RE);
      if (!m) continue;
      let live = null;
      try { live = await apiGetChat(page, m[1]); } catch (e) { continue; }
      if (!live || live.status !== 200) continue; // gone or unreachable — the sweep handles it
      if (pool.TITLE_GATE_RE.test(live.title || '')) continue; // compliant, nothing to heal
      const r = await apiRename(page, m[1], c.title).catch(e => ({ ok: false, note: e.message }));
      if (r && r.ok) {
        healed++;
        console.log(`  [heal] ${tag} ${c.purpose || '?'}: live title ${JSON.stringify(live.title || '')} → ${JSON.stringify(c.title)}`);
        if (requeue && pool.requeueGateSkipped(c.url)) {
          console.log(`         requeued for deletion (was title_gate_skipped)`);
        }
      } else {
        failed++;
        console.log(`  [heal] FAILED ${tag} ${c.purpose || '?'}: ${c.url} — ${r && r.note}`);
      }
    }
  }
  return { healed, failed };
}

// Delete everything on the registry's `retired` list using an already-open, logged-in page.
// Successes are removed from the list; transient failures stay queued for the next sweep.
// TITLE-GATE refusals will never succeed on retry, so they leave the queue and are recorded
// on the registry's `title_gate_skipped` list for a human to handle. Never throws.
// Heals drifted titles FIRST (healTitles) so a chat we verifiably renamed at registration is
// never gate-refused just because ChatGPT's auto-title overwrote it.
async function sweepRetired(page) {
  try { await healTitles(page); } catch (e) { console.warn('  [heal] skipped: ' + e.message.split('\n')[0]); }
  const retired = pool.getRetired();
  if (!retired.length) return { deleted: 0, failed: 0, gated: 0 };
  console.log(`\n[chat-delete] sweeping ${retired.length} retired chat(s)...`);
  let deleted = 0, failed = 0, gated = 0;
  for (const c of retired) {
    const r = await deleteChat(page, c.url);
    if (r.ok) {
      pool.removeRetired(c.url);
      deleted++;
      console.log(`  deleted (${r.how}) ${c.purpose || '?'}: ${c.url}${r.note ? ' — ' + r.note : ''}`);
    } else if (r.gated) {
      pool.recordGateSkip(c, r.note);
      gated++;
      console.log(`  ⛔ GATED ${c.purpose || '?'}: ${c.url} — ${r.note}`);
      console.log(`     Left alive and OFF the delete queue (recorded in title_gate_skipped). Delete manually if it truly is disposable.`);
    } else {
      failed++;
      console.log(`  FAILED ${c.purpose || '?'}: ${c.url} — ${r.note} (stays queued for the next sweep)`);
    }
    await page.waitForTimeout(1200);
  }
  console.log(`[chat-delete] sweep done: ${deleted} deleted, ${failed} still queued${gated ? `, ${gated} REFUSED by the title gate (see title_gate_skipped)` : ''}.`);
  return { deleted, failed, gated };
}

module.exports = { deleteChat, sweepRetired, healTitles };
