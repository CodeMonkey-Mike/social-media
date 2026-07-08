// request-connections.js
// Sends a LinkedIn connection request (WITH a short personalized note) to each
// captured member in members.json that we haven't contacted yet, then records it.
//
// Mirrors the scraper: same persistent system-Chrome session (li-bot-profile) and
// "reach the profile like a human" navigation, both shared from _li-session.js.
//
// members.json gains three fields per member as we go:
//   contacted        true once an invite exists (sent now, or already pending/connected)
//   contacted_at     the date (YYYY-MM-DD) we sent / observed the invite
//   contact_status   sent | already_pending | already_connected | no_connect_button
//
// Run:  node linkedin-automation/request-connections.js [--max=N] [--dry-run]
//   --max=N     send at most N invites this run, then stop. DEFAULT 10 (Mike's
//               self-imposed daily cap — run this ONCE per day, not repeatedly).
//   --dry-run   navigate to each profile and locate the Connect button, but DON'T
//               click/send anything. Safe way to verify the flow.
//
// HARD LIMITS (LinkedIn, not this script): personalized-note invites need Premium
// (Mike has it); there is still a weekly invitation cap (~100-200). If LinkedIn
// shows a limit or restriction page, the run STOPS and reports — it never hammers.

const path = require('path');
const S = require('../../lib/_li-session');

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
const MEMBERS = path.join(__dirname, '..', '..', 'data', 'members.json');

// The note sent with every invite. No first name (Mike's call), no em dashes,
// well under LinkedIn's 300-char note limit.
const MESSAGE = "Hello there, I noticed we are in the same AI automation group. I am trying to build my connections list, and just wanted to see if I can connect with some like-minded people.";

// CLI flags.
const ARGV = process.argv.slice(2);
const MAX_INVITES = (() => {
  const a = ARGV.find(x => x.startsWith('--max='));
  return a ? parseInt(a.split('=')[1], 10) : 10; // default daily cap
})();
const DRY_RUN = ARGV.includes('--dry-run');

// Pacing between invites (ms) — wide, like the scraper.
const INVITE_MIN = 40000;
const INVITE_MAX = 90000;

// Randomized pause before EVERY click inside the connect flow (open More, click
// Connect, Add a note, Send) — deliberately slow / human.
const CLICK_GAP_MIN = 5000;
const CLICK_GAP_MAX = 20000;
const gap = (page, label) => S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, label);

// Today's date as YYYY-MM-DD (local).
function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function bodyText(page) {
  return page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
}

// ----------------------------------------------------------------------------
// Send one connection request from the member's profile page.
// Returns: 'sent' | 'already_pending' | 'already_connected' | 'no_connect_button'
//          | 'limit_reached' | 'error' | 'dry-found' | 'dry-none'
// ----------------------------------------------------------------------------
async function sendConnectionRequest(page) {
  await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
  await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'read profile');

  // Already invited?
  if (await page.locator('button[aria-label*="Pending" i]').first().count().catch(() => 0)) {
    return 'already_pending';
  }

  // Find the Connect button. LinkedIn puts it in one of two places (seemingly at
  // random): a top-card PRIMARY control on the left, OR inside the top-card "More"
  // menu as a plain <a> with text "Connect".
  // The top-card primary is sometimes a <button> and sometimes an <a> anchor
  // (href=/preload/custom-invite, aria-label "Invite <Name> to connect", with a
  // <span>Connect</span> inside). We MUST match BOTH tags: matching only <button>
  // missed the anchor form and fell through to More, which then has no Connect
  // either -> false "no_connect_button" (hamza-moghe, 2026-06-29). The aria-label
  // carries the person's name, so this stays specific to THIS profile's primary
  // Connect, and .first() (top card renders before any in-page modules) avoids any
  // suggested-profile Connect.
  let connect = page.locator(
    'main button[aria-label*="to connect" i], main a[aria-label*="to connect" i]'
  ).first();
  let haveConnect = (await connect.count().catch(() => 0)) && (await connect.isVisible().catch(() => false));
  if (!haveConnect) {
    // Open the top-card "More" menu. The VISIBLE More button has no aria-label and
    // text exactly "More" (there's also a hidden aria-label="More" duplicate, and
    // unrelated "… more" buttons in the activity feed — so match text exactly).
    const more = page.locator('main button:visible', { hasText: /^More$/ }).first();
    if (await more.count().catch(() => 0)) {
      await gap(page, 'before opening More');
      await more.click({ timeout: 6000 }).catch(() => {});
      await S.pause(page, 800, 1600, 'open More menu');
      connect = page.locator('div[role="menu"] a, div[role="menu"] [role="menuitem"], div[role="menu"] button')
        .filter({ hasText: /^Connect$/ }).first();
      haveConnect = await connect.count().catch(() => 0);
    }
  }
  if (!haveConnect) {
    // No Connect anywhere: either already a 1st-degree connection (Message shown)
    // or follow-only / out of network.
    const msgBtn = await page.locator('main button[aria-label*="Message" i]').first().count().catch(() => 0);
    return msgBtn ? 'already_connected' : 'no_connect_button';
  }

  if (DRY_RUN) return 'dry-found';

  await gap(page, 'before clicking Connect');
  await connect.click({ timeout: 6000 });
  await S.pause(page, 1200, 2500, 'connect modal');

  // A weekly-limit or restriction modal can appear right here.
  if (/weekly invitation limit|reached the limit|no invitations left|temporarily restricted/i.test(await bodyText(page))) {
    return 'limit_reached';
  }

  // The modal opens on "Add a note" / "Send without a note". Click "Add a note"
  // to reveal the textarea (NEVER click "Send without a note").
  const addNote = page.locator('div[role="dialog"] button[aria-label="Add a note"], div[role="dialog"] button:has-text("Add a note")').first();
  if ((await addNote.count().catch(() => 0)) && (await addNote.isVisible().catch(() => false))) {
    await gap(page, 'before Add a note');
    await addNote.click({ timeout: 5000 });
    await S.pause(page, 800, 1600, 'add note');
  }

  const textarea = page.locator('div[role="dialog"] textarea[name="message"], div[role="dialog"] #custom-message, div[role="dialog"] textarea').first();
  if (!(await textarea.count().catch(() => 0))) {
    if (/reached the limit|upgrade to|premium/i.test(await bodyText(page))) return 'limit_reached';
    return 'error';
  }
  // Focus the field, then type the note character-by-character with a randomized
  // per-keystroke delay (same human-typing pattern as the posting scripts).
  await textarea.click({ timeout: 4000 }).catch(() => {});
  await S.typeHuman(page, MESSAGE);
  await S.pause(page, 600, 1400, 'typed note');

  // "Send invitation" (text "Send"). Scope to the dialog so we never grab the
  // "Send without a note" button (which is replaced once a note is added anyway).
  const send = page.locator(
    'div[role="dialog"] button[aria-label="Send invitation" i], div[role="dialog"] button[aria-label="Send now" i], div[role="dialog"] button[aria-label="Send" i]'
  ).first();
  if (!(await send.count().catch(() => 0))) return 'error';
  await gap(page, 'before Send');
  await send.click({ timeout: 6000 });
  await S.pause(page, 1500, 3000, 'after send');

  if (/weekly invitation limit|no invitations left/i.test(await bodyText(page))) return 'limit_reached';
  return 'sent';
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
(async () => {
  const members = S.readJson(MEMBERS, []);
  const todo = members.filter(m => m.contacted !== true);
  console.log(`members.json: ${members.length} total, ${members.length - todo.length} already contacted, ${todo.length} to contact.`);
  if (DRY_RUN) console.log('** DRY RUN ** — will locate the Connect button but NOT send anything.\n');
  console.log(`--max=${MAX_INVITES}: sending at most ${MAX_INVITES} invite(s) this run.\n`);

  const batch = todo.slice(0, MAX_INVITES);
  if (!batch.length) { console.log('Nothing to do.'); return; }

  const { browser, page } = await S.launchSession();
  const tally = {};
  let sent = 0;

  try {
    let i = 0;
    for (const m of batch) {
      i++;
      const url = m.profile_url;
      console.log(`[${i}/${batch.length}] ${url}`);
      try {
        const nav = await S.searchAndOpen(page, m);
        await S.ensureLoggedIn(page);
        console.log(`   reached via ${nav}`);

        if (await S.isRestricted(page)) {
          console.log('\n!! LinkedIn restriction / unusual-activity page detected. STOPPING.');
          break;
        }
        if (!/\/in\//.test(page.url())) throw new Error(`not on a profile page (${page.url()})`);

        const status = await sendConnectionRequest(page);
        tally[status] = (tally[status] || 0) + 1;

        if (status === 'limit_reached') {
          console.log('   LIMIT reached (weekly invite or note limit). STOPPING — not marking this one.');
          break;
        }

        if (status === 'sent' || status === 'already_pending' || status === 'already_connected') {
          m.contacted = true;
          m.contacted_at = today();
          m.contact_status = status;
          S.writeJson(MEMBERS, members);
          if (status === 'sent') sent++;
          console.log(`   ${status === 'sent' ? 'INVITE SENT' : status}`);
        } else if (status === 'dry-found') {
          console.log(`   [dry] Connect available — would send the note.`);
        } else {
          // no_connect_button / error -> leave contacted:false so it's retried.
          console.log(`   ${status} (left for retry next run)`);
        }
      } catch (err) {
        tally.error = (tally.error || 0) + 1;
        console.log(`   error (will retry next run): ${String(err.message).split('\n')[0]}`);
      }

      if (i < batch.length) await S.pause(page, INVITE_MIN, INVITE_MAX, 'between invites');
    }

    const remaining = members.filter(x => x.contacted !== true).length;
    console.log('\n============================================================');
    console.log(` DONE this run. ${sent} invite(s) sent.`);
    console.log(` Tally: ${JSON.stringify(tally)}`);
    console.log(` ${remaining} member(s) still to contact (run again, max ${MAX_INVITES}/day).`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
