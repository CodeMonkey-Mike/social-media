// chat-pool.js — shared helper for the ChatGPT image-chat registry (../chatgpt-image-chats.json).
// Every image-gen script consults this so chats are capped (~25 images) and auto-rotated, and
// kept isolated per PURPOSE (cinematic b-roll never shares a chat with text-slide carousels, etc).
//
// Caller pattern (per image in a batch):
//   const pool = require('./chat-pool');
//   let url = pool.getActiveUrl(purpose);          // null => must open a fresh chatgpt.com/ chat
//   ... navigate (or open fresh) + generate ...
//   if (openedFreshThisItem) pool.registerNewChat(purpose, page.url());  // after 1st gen, /c/<id> exists
//   if (savedOk) pool.recordImage(purpose);        // increment ONLY on a successful save
//   // if the stored URL was a dead/deleted chat: pool.markDead(purpose) then treat as fresh.
const fs = require('fs');
const path = require('path');

const REG = path.join(__dirname, '..', 'chatgpt-image-chats.json');

function load() {
  try { return JSON.parse(fs.readFileSync(REG, 'utf8')); }
  catch (e) { return { cap: 25, chats: [] }; }
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

// Replace-then-delete: drop any existing chat for this purpose (it was full or dead) and add the
// fresh one at count 0. Steady state => exactly one active object per purpose.
function registerNewChat(purpose, url) {
  if (!url || !/chatgpt\.com\/c\//.test(url)) {
    console.warn(`  [chat-pool] refusing to register non-/c/ url for "${purpose}": ${url}`);
    return;
  }
  const d = load();
  d.chats = d.chats.filter(x => x.purpose !== purpose);
  d.chats.push({ purpose, url, count: 0, created_at: new Date().toISOString() });
  save(d);
  console.log(`  [chat-pool] new ${purpose} chat registered: ${url}`);
}

// Increment the active chat's count for a purpose, AFTER a successful image save.
function recordImage(purpose) {
  const d = load();
  const c = d.chats.find(x => x.purpose === purpose);
  if (c) { c.count = (c.count || 0) + 1; save(d); }
}

// The stored chat was deleted in the ChatGPT UI (conversation-not-found): drop it so a fresh one is made.
function markDead(purpose) {
  const d = load();
  const before = d.chats.length;
  d.chats = d.chats.filter(x => x.purpose !== purpose);
  if (d.chats.length !== before) { save(d); console.log(`  [chat-pool] dropped dead ${purpose} chat`); }
}

function status() { return load(); }

module.exports = { getActiveUrl, registerNewChat, recordImage, markDead, countFor, cap, status, REG };
