// chat-pool.js — shared helper for the ChatGPT image-chat registry (../chatgpt-image-chats.json).
// Every image-gen script consults this so chats are capped (~25 images) and auto-rotated, and
// kept isolated per PURPOSE (cinematic b-roll never shares a chat with text-slide carousels, etc).
//
// TITLE CONVENTION + DELETION GATE (Mike, 2026-07-22): every automation-created chat is RENAMED
// at registration to start with "b-roll" (video b-roll: longform, shorts, persona — any purpose
// containing "broll") or "social" (post images: x-tweets, yt-posts, ig-single, reply-images,
// carousels, everything else). That leading word is the ULTIMATE deletion gate: chat-delete.js
// refuses to delete any chat whose live title does not start with b-roll/social, so a human's
// personal chat can never be swept even if the registry is wrong.
//
// Caller pattern (per image in a batch):
//   const pool = require('./chat-pool');
//   let url = pool.getActiveUrl(purpose);          // null => must open a fresh chatgpt.com/ chat
//   ... navigate (or open fresh) + generate ...
//   if (openedFreshThisItem) await pool.confirmAndRegister(page, purpose, batchId);
//     // confirmAndRegister: verifies the REAL conversation id via the backend API (page.url()
//     // alone lied to us for ~2 weeks — ids that 404'd while the real chats piled up unregistered,
//     // found 2026-07-22), renames the chat to the gated title, and registers the confirmed URL.
//   if (savedOk) pool.recordImage(purpose);        // increment ONLY on a successful save
//   // if the stored URL was a dead/deleted chat: pool.markDead(purpose) then treat as fresh.
//   ... end of run: await require('./chat-delete').sweepRetired(page);  // delete retired chats in the UI
//
// Retired chats: a replaced/dead chat is MOVED to the `retired` list (never silently dropped) so
// it can be deleted in the ChatGPT UI — the sidebar was drowning in spent image chats. Deletion is
// safe: every image is downloaded to the project folder at generation time, so a chat holds nothing
// we need. The gen scripts sweep `retired` at the end of each run (chat-delete.js); anything they
// miss is swept by repurpose/delete-chats.js (invoked from cleanup/cleanup.js), which also retires
// chats whose `batch` is completed/archived in batches.json.
const fs = require('fs');
const path = require('path');

const REG = path.join(__dirname, '..', 'chatgpt-image-chats.json');

function load() {
  try {
    const d = JSON.parse(fs.readFileSync(REG, 'utf8'));
    d.chats = d.chats || [];
    d.retired = d.retired || [];
    return d;
  }
  catch (e) { return { cap: 25, chats: [], retired: [] }; }
}
function save(d) { fs.writeFileSync(REG, JSON.stringify(d, null, 2)); }
function cap() { return load().cap || 25; }

// Active chat URL for a purpose if it still has room (count < cap); else null (caller opens fresh).
function getActiveUrl(purpose) {
  const d = load();
  const c = d.chats.find(x => x.purpose === purpose);
  return (c && (c.count || 0) < (d.cap || 25)) ? c.url : null;
}

function countFor(purpose) {
  const c = load().chats.find(x => x.purpose === purpose);
  return c ? (c.count || 0) : 0;
}

// Move a chat object onto the retired list (deduped by url). Internal.
function pushRetired(d, chat, reason) {
  if (!chat || !chat.url) return;
  if (d.retired.some(x => x.url === chat.url)) return;
  d.retired.push({ ...chat, retired_at: new Date().toISOString(), reason });
}

// The deletion gate: a chat is deletable ONLY if its live title starts with b-roll or social.
// Single source of truth — chat-delete.js imports this. Do not widen it.
const TITLE_GATE_RE = /^(b-roll|social)\b/i;

// The gated title for a purpose: "b-roll: <purpose>" for video b-roll purposes (anything with
// "broll" in the name), "social: <purpose>" for everything else (post images for the socials).
function titleFor(purpose) {
  const prefix = /broll/i.test(purpose) ? 'b-roll' : 'social';
  return `${prefix}: ${purpose}`;
}

// Replace-then-delete: any existing chat for this purpose (it was full or dead) moves to the
// `retired` list — queued for UI deletion by chat-delete.js — and the fresh one starts at count 0.
// Steady state => exactly one active object per purpose. Optional `batch` ties the chat to a
// batches.json id so cleanup deletes it when that batch completes (omit for evergreen purposes).
// Optional `title` records the gated title set on the chat (confirmAndRegister passes it).
function registerNewChat(purpose, url, batch, title) {
  if (!url || !/chatgpt\.com\/c\//.test(url)) {
    console.warn(`  [chat-pool] refusing to register non-/c/ url for "${purpose}": ${url}`);
    return;
  }
  const d = load();
  for (const old of d.chats.filter(x => x.purpose === purpose)) {
    pushRetired(d, old, 'rotated: replaced by a fresh chat');
  }
  d.chats = d.chats.filter(x => x.purpose !== purpose);
  const entry = { purpose, url, count: 0, created_at: new Date().toISOString() };
  if (batch) entry.batch = batch;
  if (title) entry.title = title;
  d.chats.push(entry);
  save(d);
  console.log(`  [chat-pool] new ${purpose} chat registered: ${url}${batch ? ` (batch ${batch})` : ''}${title ? ` titled "${title}"` : ''}`);
}

// Confirm the REAL conversation id via the backend API, rename the chat to the gated title,
// and register the confirmed URL. This is the ONLY correct way to register a fresh chat:
// page.url()'s id can diverge from the server-side conversation id (it did from ~2026-07-08 —
// every registered id 404'd while the real chats sat unregistered in the sidebar, 2026-07-22).
// Returns { url, title } on success, null on failure (loud warn; caller may retry next item).
async function confirmAndRegister(page, purpose, batch) {
  const title = titleFor(purpose);
  let r = null;
  try {
    r = await page.evaluate(async (wantTitle) => {
      const s = await fetch('/api/auth/session', { credentials: 'include' })
        .then(x => (x.ok ? x.json() : null)).catch(() => null);
      const tok = s && s.accessToken;
      if (!tok) return { error: 'no access token' };
      const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };

      // Candidate 1: the id in the address bar. Candidate 2: the newest conversation on the
      // account (the chat we just generated in is by definition the most recently updated).
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
        // SAFETY: only adopt the newest conversation if it was CREATED moments ago (this run's
        // fresh chat). An older chat that merely got updated could be Mike chatting in parallel —
        // renaming that would hijack a human's chat. Fail registration instead.
        const it = j.items[0];
        const ageMin = (Date.now() - new Date(it.create_time).getTime()) / 60000;
        if (!(ageMin >= -5 && ageMin <= 10)) {
          return { error: `newest conversation created ${Math.round(ageMin)}m ago — not this run's fresh chat, refusing to adopt/rename it`, urlId };
        }
        id = it.id;
      }

      // RACE (found 2026-07-30): ChatGPT auto-titles a new conversation ASYNCHRONOUSLY after the
      // first response; if that lands after our PATCH it silently overwrites the gated title (the
      // read-back below passes, yet the chat later shows e.g. "Cinematic Trading Hall" and the
      // deletion gate refuses it). So wait for the auto-title to land FIRST — once it has, our
      // rename is the last write and sticks. Bounded: if it never lands, rename anyway and let
      // chat-delete's healTitles() end-of-run backstop re-assert.
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
    }, title);
  } catch (e) {
    console.warn(`  [chat-pool] confirmAndRegister failed for "${purpose}": ${e.message.split('\n')[0]}`);
    return null;
  }
  if (!r || r.error) {
    console.warn(`  [chat-pool] confirmAndRegister failed for "${purpose}": ${r ? r.error : 'no result'} — chat NOT registered`);
    return null;
  }
  if (r.mismatched) {
    console.warn(`  [chat-pool] page.url() id ${r.urlId} != real conversation id ${r.id} — registered the REAL one`);
  }
  const url = 'https://chatgpt.com/c/' + r.id;
  registerNewChat(purpose, url, batch, title);
  return { url, title };
}

// Increment the active chat's count for a purpose, AFTER a successful image save.
function recordImage(purpose) {
  const d = load();
  const c = d.chats.find(x => x.purpose === purpose);
  if (c) { c.count = (c.count || 0) + 1; save(d); }
}

// The stored chat was unreachable (conversation-not-found / no composer): retire it so a fresh one
// is made. It goes through `retired` rather than being dropped — if it was a transient load failure
// the chat still exists in the UI, and the sweep deletes it (a truly-gone chat sweeps as a no-op).
function markDead(purpose) {
  const d = load();
  const dead = d.chats.filter(x => x.purpose === purpose);
  if (!dead.length) return;
  for (const c of dead) pushRetired(d, c, 'dead: unreachable in the UI');
  d.chats = d.chats.filter(x => x.purpose !== purpose);
  save(d);
  console.log(`  [chat-pool] retired dead ${purpose} chat`);
}

// Retire a purpose's active chat(s) on demand (no replacement) — e.g. its batch completed, or a
// one-off purpose is done. Returns how many chats were queued for deletion.
function retire(purpose, reason) {
  const d = load();
  const hits = d.chats.filter(x => x.purpose === purpose);
  if (!hits.length) return 0;
  for (const c of hits) pushRetired(d, c, reason || 'retired');
  d.chats = d.chats.filter(x => x.purpose !== purpose);
  save(d);
  console.log(`  [chat-pool] retired ${purpose} chat (${reason || 'retired'})`);
  return hits.length;
}

// Retired-queue accessors for chat-delete.js: list what awaits UI deletion / clear one after
// a confirmed delete.
function getRetired() { return load().retired; }
function removeRetired(url) {
  const d = load();
  const before = d.retired.length;
  d.retired = d.retired.filter(x => x.url !== url);
  if (d.retired.length !== before) save(d);
}

// A retired chat the title gate refused to delete: take it off the retired queue (retrying
// can never succeed) but keep it on record so a human can decide. chat-delete.js calls this.
function recordGateSkip(chat, note) {
  const d = load();
  d.retired = d.retired.filter(x => x.url !== chat.url);
  d.title_gate_skipped = d.title_gate_skipped || [];
  if (!d.title_gate_skipped.some(x => x.url === chat.url)) {
    d.title_gate_skipped.push({ ...chat, gate_skipped_at: new Date().toISOString(), gate_note: note });
  }
  save(d);
}

// A gate-skipped chat whose live title has been HEALED back to its gated title (chat-delete's
// healTitles): move it back onto the retired queue so the sweep can delete it. Only healTitles
// calls this, and only for entries with verified-rename provenance (a recorded gated `title`).
function requeueGateSkipped(url) {
  const d = load();
  const hit = (d.title_gate_skipped || []).find(x => x.url === url);
  if (!hit) return false;
  d.title_gate_skipped = d.title_gate_skipped.filter(x => x.url !== url);
  const { gate_skipped_at, gate_note, ...chat } = hit;
  pushRetired(d, chat, 'requeued: live title healed back to the gated title');
  save(d);
  return true;
}

function status() { return load(); }

module.exports = {
  getActiveUrl, registerNewChat, confirmAndRegister, recordImage, markDead, retire,
  getRetired, removeRetired, recordGateSkip, requeueGateSkipped, countFor, cap, status, REG,
  TITLE_GATE_RE, titleFor,
};
