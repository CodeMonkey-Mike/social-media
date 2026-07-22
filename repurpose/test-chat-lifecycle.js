// test-chat-lifecycle.js — end-to-end smoke test of the chat registry lifecycle:
//   confirmAndRegister (API-confirmed id + gated rename) -> retire -> sweepRetired
//   (title gate PASS -> verified delete) and title gate REFUSAL on an un-renamed chat.
// Creates its own throwaway text chats ("hi", no image gen) and cleans up everything it
// makes, including its own registry entries. Safe to re-run. Uses test-only purposes so
// it can never collide with real pool state.
//
// Usage: node repurpose/test-chat-lifecycle.js
const fs = require('fs');
const pool = require('./chat-pool');
const { deleteChat, sweepRetired } = require('./chat-delete');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const T_PURPOSE = 'lifecycle-test-broll'; // contains "broll" -> "b-roll: " prefix

let pass = 0, fail = 0;
const check = (name, cond, detail) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  cond ? pass++ : fail++;
};

async function newThrowawayChat(page) {
  await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const box = page.locator('#prompt-textarea');
  await box.waitFor({ state: 'visible', timeout: 30000 });
  await box.click();
  await box.fill('Reply with only the word ok.');
  await page.keyboard.press('Enter');
  // The conversation exists server-side once the message sends; give the URL a moment.
  await page.waitForURL(/chatgpt\.com\/c\//, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
}

async function apiGet(page, id) {
  return page.evaluate(async (cid) => {
    const s = await fetch('/api/auth/session', { credentials: 'include' }).then(r => r.json());
    const r = await fetch('/backend-api/conversation/' + cid, {
      credentials: 'include', headers: { Authorization: 'Bearer ' + s.accessToken },
    });
    return r.ok ? { status: 200, title: (await r.json()).title } : { status: r.status };
  }, id);
}

async function apiHide(page, id) { // raw cleanup for our own un-renamed test chat (bypasses the gate on purpose)
  return page.evaluate(async (cid) => {
    const s = await fetch('/api/auth/session', { credentials: 'include' }).then(r => r.json());
    const r = await fetch('/backend-api/conversation/' + cid, {
      method: 'PATCH', credentials: 'include',
      headers: { Authorization: 'Bearer ' + s.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: false }),
    });
    return r.status;
  }, id);
}

(async () => {
  // Pure-function checks first (no browser needed).
  check('titleFor(broll purpose) -> b-roll prefix', pool.titleFor('carry-trade-broll') === 'b-roll: carry-trade-broll');
  check('titleFor(social purpose) -> social prefix', pool.titleFor('x-tweets') === 'social: x-tweets');
  check('gate accepts "b-roll: x"', pool.TITLE_GATE_RE.test('b-roll: broll'));
  check('gate accepts "social: x"', pool.TITLE_GATE_RE.test('social: yt-posts'));
  check('gate rejects auto-title', !pool.TITLE_GATE_RE.test('Tug-of-War Scene'));
  check('gate rejects mid-string match', !pool.TITLE_GATE_RE.test('my social chat'));

  const { chromium } = require('playwright');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  try {
    const page = await browser.newPage();

    // ── Chat A: full happy path ──────────────────────────────────────────────
    console.log('\n[A] fresh chat -> confirmAndRegister -> retire -> sweep (should delete)');
    await newThrowawayChat(page);
    const reg = await pool.confirmAndRegister(page, T_PURPOSE);
    check('confirmAndRegister returned a url', !!(reg && reg.url), reg && reg.url);
    let aId = null;
    if (reg) {
      aId = reg.url.match(/\/c\/([a-z0-9-]+)/i)[1];
      const live = await apiGet(page, aId);
      check('registered id resolves via API', live.status === 200, `HTTP ${live.status}`);
      check('live title is the gated title', live.title === 'b-roll: ' + T_PURPOSE, JSON.stringify(live.title));
      check('registry entry recorded with title', pool.status().chats.some(c => c.purpose === T_PURPOSE && c.title === 'b-roll: ' + T_PURPOSE));
    }
    pool.retire(T_PURPOSE, 'lifecycle test');
    const sweep1 = await sweepRetired(page);
    check('sweep deleted the gated-titled chat', sweep1.deleted >= 1 && sweep1.gated === 0, JSON.stringify(sweep1));
    if (aId) {
      const gone = await apiGet(page, aId);
      check('chat verifiably gone (404)', gone.status === 404, `HTTP ${gone.status}`);
    }

    // ── Chat B: un-renamed chat must be REFUSED by the gate ──────────────────
    console.log('\n[B] fresh chat, NOT renamed -> forced onto retired -> sweep (must refuse)');
    await newThrowawayChat(page);
    const bUrl = page.url().split('?')[0];
    const bId = (bUrl.match(/\/c\/([a-z0-9-]+)/i) || [])[1];
    check('test chat B has a /c/ url', !!bId, bUrl);
    if (bId) {
      // Force it onto the retired queue exactly like a bad registry entry would be.
      pool.registerNewChat(T_PURPOSE + '-b', bUrl);
      pool.retire(T_PURPOSE + '-b', 'lifecycle test: gate check');
      const sweep2 = await sweepRetired(page);
      check('sweep REFUSED the un-renamed chat', sweep2.gated >= 1 && sweep2.deleted === 0, JSON.stringify(sweep2));
      const stillAlive = await apiGet(page, bId);
      check('chat B still alive after refusal', stillAlive.status === 200, `HTTP ${stillAlive.status}`);
      check('refusal recorded in title_gate_skipped', (pool.status().title_gate_skipped || []).some(x => x.url === bUrl));

      // Cleanup our own artifacts: hide chat B via raw PATCH + drop the skip record.
      const hid = await apiHide(page, bId);
      check('cleanup: test chat B removed', hid === 200, `PATCH ${hid}`);
      const d = JSON.parse(fs.readFileSync(pool.REG, 'utf8'));
      d.title_gate_skipped = (d.title_gate_skipped || []).filter(x => x.url !== bUrl);
      fs.writeFileSync(pool.REG, JSON.stringify(d, null, 2) + '\n');
    }

    // Registry must end clean of all test-purpose residue.
    const end = pool.status();
    const residue = [].concat(end.chats, end.retired, end.title_gate_skipped || [])
      .filter(x => (x.purpose || '').startsWith('lifecycle-test'));
    check('registry clean of test residue', residue.length === 0, JSON.stringify(residue));
  } finally {
    await browser.close();
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
