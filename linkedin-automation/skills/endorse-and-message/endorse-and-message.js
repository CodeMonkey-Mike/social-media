// endorse-and-message.js
// For each already-CONNECTED member in members.json (oldest connected_on first):
// endorse a random 5-10 of their top skills, then send ONE fixed favor-request
// DM asking them to endorse Mike's automation skills back.
//
// THE ONLY DM IN THIS FOLDER. The folder-wide "no DMs" rule has exactly one
// sanctioned exception (Mike, 2026-07-02): this script's fixed template, sent
// ONLY to members who already accepted our connection request AND whose skills
// we just endorsed. Never a cold DM. The only per-member variable is the
// recipient's FIRST NAME in the greeting (Mike, 2026-07-14) — read from their
// profile <h1>, falling back to "Hi there," when no clean name is found; the
// body below the greeting is fixed.
//
// ZERO-SKILLS RULE (Mike): if a member has no endorsable skills, ABANDON them —
// no endorsements means no DM either (the message says "I just endorsed you",
// which would be a lie). They're marked endorse_status:"no_skills" so we never
// revisit.
//
// members.json gains these fields per member as we go:
//   endorse_status   endorsed | no_skills
//   endorsed_at      date (YYYY-MM-DD) of the endorsements
//   endorsed_count   how many skills we endorsed
//   dm_status        sent
//   dm_sent_at       date (YYYY-MM-DD) the favor-request DM went out
//
// Run:  node linkedin-automation/skills/endorse-and-message/endorse-and-message.js [--max=N] [--dry-run]
//   --max=N     process at most N members this run. DEFAULT 3 — each member is a
//               profile view against the same daily volume budget as the scraper
//               and the invite sender, plus ~10 endorse clicks and a DM (a brand
//               new action signature for this account), so keep runs SMALL.
//   --dry-run   navigate to each member, count their endorsable skills, and
//               locate the Message button, but click/endorse/send NOTHING.
//
// Selector notes (probed live on sindhura-karnati, 2026-07-02, _probe-endorse.js):
//   - Endorse buttons: aria-label "Endorse <SkillName>" with visible text exactly
//     "Endorse". An already-endorsed skill does NOT match [aria-label^="Endorse "]
//     (no trailing space in "Endorsed..."). DOM order = display order = top first.
//   - The skills page has a "Navigate back to profile main screen" button.
//   - The profile OWNER's Message control is a plain <a> with NO aria-label,
//     text exactly "Message", href /messaging/compose/?...recipient=<urn>. The
//     "More profiles for you" module's "Message <OTHER person>" anchors ALL have
//     aria-labels — never match a bare aria-label*="Message" (wrong person;
//     selector-discipline rule #1, confirmed by _probe-message.js).
//   - The composer is div.msg-form__contenteditable[contenteditable]. Its Send
//     button does NOT render until text is typed — locate it AFTER typing. Line
//     breaks must be Shift+Enter (bare Enter can send a half-typed message).

const path = require('path');
const S = require('../../lib/_li-session');

const MEMBERS = path.join(__dirname, '..', '..', 'data', 'members.json');

// The favor-request DM. The greeting is personalized with the recipient's first
// name ("Hi <First>,", Mike 2026-07-14) when we can read a clean one off their
// profile, otherwise it falls back to "Hi there,". Everything from the greeting
// on ("we connected a couple of weeks ago...", including that phrasing regardless
// of the actual connection date) is FIXED. Lines are joined with Shift+Enter in
// the composer; '' = paragraph break.
const MESSAGE_INTRO =
  'we connected a couple of weeks ago. I am trying to build up my profile right now because my biggest issue is that I am getting a lot of recruiters contacting me about Front End and React roles... but I have been doing AI engineering work for almost two years. And my LinkedIn profile seems to be overwhelmingly optimized for front-end development. 😱';
const MESSAGE_BODY_LINES = [
  '',
  "I'm asking people if they could endorse some of my skills at the top of my list that are AI related. A direct link is here - https://www.linkedin.com/in/michael-luis/details/skills/",
  '',
  'I just endorsed you for a bunch of your skills. I was just curious if you would be kind enough to return the favor.',
  '',
  'Sincerely yours,',
  'Miguel 😇',
];

// Build the DM lines for a given first name. `firstName` null/empty -> "Hi there,".
function buildMessageLines(firstName) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  return [`${greeting} ${MESSAGE_INTRO}`, ...MESSAGE_BODY_LINES];
}

// Reduce a raw profile display name to a usable, presentable FIRST name, or null
// if nothing clean is available (so the greeting safely falls back to "there").
// Tokenizes, strips anything that isn't a letter/apostrophe/hyphen, skips a leading
// honorific ("Dr. Amanda Lee" -> "Amanda"), rejects implausible lengths, and
// title-cases ALL-CAPS or all-lowercase tokens (leaving mixed case like "McKay").
const HONORIFICS = new Set([
  'dr', 'mr', 'mrs', 'ms', 'miss', 'mx', 'prof', 'professor', 'sir', 'dame',
  'rev', 'er', 'eng', 'capt', 'col', 'lt', 'sgt',
]);
function cleanFirstName(raw) {
  if (!raw) return null;
  const tokens = String(raw).trim().split(/\s+/)
    .map(t => t.replace(/[^\p{L}'-]/gu, ''))
    .filter(Boolean);
  let idx = 0;
  while (idx < tokens.length - 1 && HONORIFICS.has(tokens[idx].toLowerCase())) idx++;
  let tok = tokens[idx];
  if (!tok || tok.length < 2 || tok.length > 20) return null;
  if (tok === tok.toUpperCase() || tok === tok.toLowerCase()) {
    tok = tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
  }
  return tok;
}

// CLI flags.
const ARGV = process.argv.slice(2);
const MAX_MEMBERS = (() => {
  const a = ARGV.find(x => x.startsWith('--max='));
  return a ? parseInt(a.split('=')[1], 10) : 3;
})();
const DRY_RUN = ARGV.includes('--dry-run');

// How many skills to endorse: random 5-10 (Mike's manual habit), fewer if the
// member lists fewer.
const ENDORSE_MIN = 5;
const ENDORSE_MAX = 10;

// Pacing (ms). Endorse clicks are quick human actions (2-6s apart); the DM flow
// gets wider invite-style gaps before each click; members get a wide gap between.
const ENDORSE_GAP_MIN = 2000;
const ENDORSE_GAP_MAX = 6000;
const CLICK_GAP_MIN = 5000;
const CLICK_GAP_MAX = 15000;
const MEMBER_MIN = 40000;
const MEMBER_MAX = 90000;

const ENDORSE_BTN = 'main button[aria-label^="Endorse " i]';

function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Type text into the focused composer character-by-character. Astral chars
// (emoji) go via keyboard.insertText — keyboard.type can mangle surrogate pairs.
async function typeRich(page, text) {
  for (const ch of text) {
    if (ch.codePointAt(0) > 0xffff) await page.keyboard.insertText(ch);
    else await page.keyboard.type(ch);
    await page.waitForTimeout(S.randomBetween(S.CHAR_DELAY_MIN, S.CHAR_DELAY_MAX));
  }
}

// Read the recipient's first name off the profile top card. LinkedIn profiles
// have NO <h1> and ship hashed CSS class names (documented in the scraper's
// readLocation + PROJECT-LOG problem #2), so class/tag selectors find nothing.
// The stable, well-ordered source is <main>'s innerText, whose FIRST line is the
// display name (line 2 = headline, then location...). Same technique as the
// scraper. Returns a clean first name or null (greeting falls back to "there").
async function firstNameFromProfile(page) {
  await page.waitForFunction(() => {
    const m = document.querySelector('main');
    return m && m.innerText && m.innerText.trim().length > 80;
  }, { timeout: 15000 }).catch(() => {});
  const main = await page.$eval('main', el => el.innerText).catch(() => '');
  if (!main) return null;
  const lines = main.split('\n').map(s => s.trim()).filter(Boolean);
  return cleanFirstName(lines[0]);
}

// If an endorsement follow-up dialog pops ("How do you know ... ?"), dismiss it.
async function dismissDialog(page) {
  const dlg = page.locator('div[role="dialog"]').first();
  if ((await dlg.count().catch(() => 0)) && (await dlg.isVisible().catch(() => false))) {
    await page.keyboard.press('Escape').catch(() => {});
    await S.pause(page, 600, 1200, 'dismissed follow-up dialog');
  }
}

// ----------------------------------------------------------------------------
// Phase 1 — endorse: open <profile>/details/skills/, click Endorse on a random
// 5-10 of the TOP skills. Returns { status: 'endorsed'|'no_skills'|'error', count }.
// ----------------------------------------------------------------------------
async function endorseSkills(page, profileUrl) {
  const base = S.canonicalProfileUrl(profileUrl) || profileUrl;
  await page.goto(base + 'details/skills/', { waitUntil: 'domcontentloaded' });
  await S.pause(page, 3000, 6000, 'skills page render');

  if (await S.isRestricted(page)) return { status: 'restricted', count: 0 };

  // Endorsable = aria "Endorse <skill>" AND visible text exactly "Endorse".
  // Scroll a little if the list renders fewer than we want (lazy list).
  // NOTE: element HANDLES, not locator.all() — a clicked button's aria-label
  // flips out of the matched set, so nth-index locators would shift mid-loop
  // and endorse the wrong skills. Handles stay pinned to their DOM nodes.
  let buttons = [];
  for (let round = 0; round < 3; round++) {
    buttons = [];
    for (const b of await page.$$(ENDORSE_BTN)) {
      const ok = await b.evaluate(el =>
        (el.innerText || '').trim() === 'Endorse' &&
        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      ).catch(() => false);
      if (ok) buttons.push(b);
    }
    if (buttons.length >= ENDORSE_MAX) break;
    await page.evaluate(() => window.scrollBy(0, 1200)).catch(() => {});
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll skills list');
  }

  if (!buttons.length) {
    // Nothing to endorse. Distinguish "no skills at all" from "we already
    // endorsed everything" (aria flips off the "Endorse " prefix once endorsed).
    return { status: 'no_skills', count: 0 };
  }

  const target = Math.min(S.randomBetween(ENDORSE_MIN, ENDORSE_MAX), buttons.length);
  console.log(`   ${buttons.length} endorsable skill(s) visible; endorsing the top ${target}.`);
  if (DRY_RUN) return { status: 'dry', count: target };

  let clicked = 0;
  for (const b of buttons.slice(0, target)) {
    const aria = (await b.getAttribute('aria-label').catch(() => '')) || '';
    await b.scrollIntoViewIfNeeded().catch(() => {});
    await S.pause(page, ENDORSE_GAP_MIN, ENDORSE_GAP_MAX, `endorse: ${aria.replace(/^Endorse /i, '')}`);
    try {
      await b.click({ timeout: 5000 });
      clicked++;
    } catch (e) {
      console.log(`   endorse click failed (${aria}): ${String(e.message).split('\n')[0]}`);
    }
    await dismissDialog(page);
  }
  return { status: clicked > 0 ? 'endorsed' : 'error', count: clicked };
}

// ----------------------------------------------------------------------------
// Phase 2 — DM: back to the profile, open the Message composer, type the fixed
// template (Shift+Enter line breaks), click Send, verify the box emptied.
// Returns 'sent' | 'no_message_button' | 'no_composer' | 'no_send_button' | 'not_verified'.
// ----------------------------------------------------------------------------
async function sendDm(page, profileUrl) {
  // Human-like return: the skills page has an explicit back button.
  const back = page.locator('main button[aria-label="Navigate back to profile main screen"]').first();
  if ((await back.count().catch(() => 0)) && (await back.isVisible().catch(() => false))) {
    await S.pause(page, 1000, 2500, 'back to profile');
    await back.click({ timeout: 5000 }).catch(() => {});
  } else if (/details\/skills/.test(page.url())) {
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
  }
  if (!/\/in\//.test(page.url()) || /details\//.test(page.url())) {
    const base = S.canonicalProfileUrl(profileUrl) || profileUrl;
    await page.goto(base, { waitUntil: 'domcontentloaded' }).catch(() => {});
  }
  await S.pause(page, 2500, 5000, 'profile re-render');

  // Read the recipient's first name for the greeting BEFORE the composer overlay
  // covers the profile. Falls back to "there" if no clean name is found.
  const firstName = await firstNameFromProfile(page);
  const messageLines = buildMessageLines(firstName);
  console.log(`   greeting: "${messageLines[0].split(',')[0]}," ${firstName ? '(first name from profile)' : '(no clean name — fell back to "there")'}`);

  // The PROFILE OWNER's Message control (probed 2026-07-02, _probe-message.js):
  // a plain <a> with NO aria-label, visible text exactly "Message", and an href
  // to /messaging/compose/?...recipient=<their urn>. The "More profiles for you"
  // module's "Message <someone else>" anchors ALL carry aria-labels, so
  // "no aria-label + exact text Message + compose href" is what disambiguates —
  // never match a bare aria-label*="Message" here (it DMs the wrong person).
  let msgBtn = null;
  for (const h of await page.$$('main a[href*="/messaging/compose"], main button')) {
    const ok = await h.evaluate(el =>
      (el.innerText || '').trim() === 'Message' &&
      !el.getAttribute('aria-label') &&
      !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    ).catch(() => false);
    if (ok) { msgBtn = h; break; }
  }
  if (!msgBtn) {
    // Older top-card form: the owner's name inside the aria-label.
    const first = (S.nameQueryFromUrl(profileUrl) || '').split(' ')[0];
    if (first) {
      const scoped = page.locator(`main button[aria-label*="Message ${first}" i], main a[aria-label*="Message ${first}" i]`).first();
      if ((await scoped.count().catch(() => 0)) && (await scoped.isVisible().catch(() => false))) msgBtn = scoped;
    }
  }
  if (!msgBtn) return 'no_message_button';
  if (DRY_RUN) return 'dry-found';

  await S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, 'before Message');
  await msgBtn.click({ timeout: 6000 });
  await S.pause(page, 2500, 4500, 'composer open');

  const box = page.locator(
    'div.msg-form__contenteditable[contenteditable="true"], div[contenteditable="true"][aria-label*="message" i], [role="textbox"][contenteditable="true"]'
  ).first();
  if (!(await box.count().catch(() => 0))) return 'no_composer';
  await box.click({ timeout: 5000 }).catch(() => {});
  await S.pause(page, 800, 1800, 'focus composer');

  // Clear any leftover draft (e.g. from an interrupted earlier run) so the
  // member can never receive the template twice in one message.
  if (((await box.innerText().catch(() => '')) || '').trim()) {
    console.log('   clearing a leftover draft first.');
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(300);
    await page.keyboard.press('Delete');
    await S.pause(page, 600, 1200, 'cleared draft');
  }

  // Type the template. Line breaks are Shift+Enter — NEVER bare Enter (this
  // account has "Press Enter to send" ON, so a bare Enter fires the message).
  for (let i = 0; i < messageLines.length; i++) {
    if (messageLines[i]) await typeRich(page, messageLines[i]);
    if (i < messageLines.length - 1) {
      await page.keyboard.down('Shift');
      await page.keyboard.press('Enter');
      await page.keyboard.up('Shift');
      await page.waitForTimeout(S.randomBetween(60, 200));
    }
  }
  await S.pause(page, 1500, 3000, 'typed DM');

  // Verify the text actually landed BEFORE sending — otherwise an Enter on an
  // empty box "succeeds" silently and we'd wrongly mark the member dm_sent.
  const typedLen = (((await box.innerText().catch(() => '')) || '').trim()).length;
  if (typedLen < 100) {
    console.log(`   composer only has ${typedLen} chars after typing — aborting the send.`);
    await page.keyboard.press('Control+a').catch(() => {});
    await page.keyboard.press('Delete').catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    return 'typing_failed';
  }

  // Send. Two account modes (probed 2026-07-02, _probe-send.js):
  //   - "Press Enter to send" OFF: a Send button renders once there's content.
  //   - "Press Enter to send" ON (Mike's setting): NO Send button exists at all —
  //     the footer shows only a .msg-form__send-toggle ("Open send options")
  //     circle, and the send action is a bare Enter in the composer.
  let send = null;
  for (const sel of [
    'button.msg-form__send-button',
    '.msg-form button[type="submit"]',
    '.msg-convo-wrapper button[aria-label*="Send" i]',
  ]) {
    const cand = page.locator(sel).first();
    if ((await cand.count().catch(() => 0)) && (await cand.isVisible().catch(() => false))) { send = cand; break; }
  }
  if (!send) {
    const byText = page.locator('.msg-convo-wrapper button').filter({ hasText: /^Send$/ }).first();
    if ((await byText.count().catch(() => 0)) && (await byText.isVisible().catch(() => false))) send = byText;
  }

  await S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, 'before Send');
  if (send) {
    await send.click({ timeout: 6000 });
  } else if (await page.locator('.msg-form__send-toggle').first().count().catch(() => 0)) {
    console.log('   no Send button + send-toggle present (Enter-to-send mode) — sending with Enter.');
    await box.click({ timeout: 4000 }).catch(() => {});
    await page.keyboard.press('Enter');
  } else {
    return 'no_send_button';
  }
  await S.pause(page, 2000, 3500, 'after send');

  // Verify: on success the composer empties.
  const leftover = ((await box.innerText().catch(() => '')) || '').trim();
  await page.keyboard.press('Escape').catch(() => {}); // close the overlay
  return leftover === '' ? 'sent' : 'not_verified';
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
(async () => {
  const members = S.readJson(MEMBERS, []);
  // Eligible: accepted our invite, not yet DM'd, not abandoned for zero skills.
  // Oldest connection first (stable sort keeps file order on ties).
  const todo = members
    .filter(m => m.contact_status === 'connected' && !m.dm_sent_at && m.endorse_status !== 'no_skills')
    .sort((a, b) => String(a.connected_on || '9999').localeCompare(String(b.connected_on || '9999')));

  console.log(`members.json: ${members.length} total, ${todo.length} connected member(s) eligible for endorse+DM.`);
  if (DRY_RUN) console.log('** DRY RUN ** — will count skills + locate Message, but endorse/send NOTHING.\n');
  console.log(`--max=${MAX_MEMBERS}: processing at most ${MAX_MEMBERS} member(s) this run.\n`);

  const batch = todo.slice(0, MAX_MEMBERS);
  if (!batch.length) { console.log('Nothing to do.'); return; }

  const { browser, page } = await S.launchSession();
  const tally = {};
  let done = 0;

  try {
    let i = 0;
    for (const m of batch) {
      i++;
      console.log(`[${i}/${batch.length}] ${m.profile_url} (connected ${m.connected_on})`);
      try {
        const nav = await S.searchAndOpen(page, m);
        await S.ensureLoggedIn(page);
        console.log(`   reached via ${nav}`);

        if (await S.isRestricted(page)) {
          console.log('\n!! LinkedIn restriction / unusual-activity page detected. STOPPING.');
          break;
        }
        if (!/\/in\//.test(page.url())) throw new Error(`not on a profile page (${page.url()})`);
        await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
        await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'read profile');

        // Phase 1 — endorse (skipped if a previous run already endorsed them).
        if (m.endorse_status !== 'endorsed') {
          const e = await endorseSkills(page, m.profile_url);
          if (e.status === 'restricted') {
            console.log('\n!! Restriction page on the skills page. STOPPING.');
            break;
          }
          if (e.status === 'no_skills') {
            // Mike's rule: no endorsable skills -> abandon, no DM, never revisit.
            m.endorse_status = 'no_skills';
            m.endorsed_at = today();
            S.writeJson(MEMBERS, members);
            tally.no_skills = (tally.no_skills || 0) + 1;
            console.log('   NO ENDORSABLE SKILLS — abandoned (no DM), marked no_skills.');
            continue;
          }
          if (e.status === 'dry') {
            console.log(`   [dry] would endorse ${e.count} skill(s).`);
          } else if (e.status === 'endorsed') {
            m.endorse_status = 'endorsed';
            m.endorsed_at = today();
            m.endorsed_count = e.count;
            S.writeJson(MEMBERS, members);
            console.log(`   ENDORSED ${e.count} skill(s).`);
          } else {
            tally.endorse_error = (tally.endorse_error || 0) + 1;
            console.log('   endorse failed (left for retry next run)');
            continue;
          }
        } else {
          console.log('   already endorsed on a previous run — going straight to the DM.');
        }

        // Phase 2 — the favor-request DM.
        const d = await sendDm(page, m.profile_url);
        tally[d] = (tally[d] || 0) + 1;
        if (d === 'sent') {
          m.dm_status = 'sent';
          m.dm_sent_at = today();
          S.writeJson(MEMBERS, members);
          done++;
          console.log('   DM SENT.');
        } else if (d === 'dry-found') {
          console.log('   [dry] Message button located — would send the template.');
        } else {
          console.log(`   DM ${d} — endorsements recorded, DM left for retry next run.`);
        }
      } catch (err) {
        tally.error = (tally.error || 0) + 1;
        console.log(`   error (will retry next run): ${String(err.message).split('\n')[0]}`);
      }

      if (i < batch.length) await S.pause(page, MEMBER_MIN, MEMBER_MAX, 'between members');
    }

    const remaining = members.filter(m => m.contact_status === 'connected' && !m.dm_sent_at && m.endorse_status !== 'no_skills').length;
    console.log('\n============================================================');
    console.log(` DONE this run. ${done} member(s) endorsed + DM'd.`);
    console.log(` Tally: ${JSON.stringify(tally)}`);
    console.log(` ${remaining} eligible member(s) remaining.`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
