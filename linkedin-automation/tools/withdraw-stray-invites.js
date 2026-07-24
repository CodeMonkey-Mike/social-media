// withdraw-stray-invites.js  (2026-07-22 wrong-person invite incident cleanup)
// Withdraws pending sent invites that our bot MISFIRED to strangers.
//
// A card is withdrawn ONLY if BOTH hold:
//   1. its preview text contains our exact invite-note phrase ("same AI automation
//      group") — so invites Mike sent manually to real acquaintances are untouchable;
//   2. its profile slug matches NO entry in data/members.json — so every intended
//      member's invite stays pending.
// Explicit exclude list on top of that (Ja'Claylyn: mid-conversation, Mike's call).
//
// One list page, no profile views. Withdraw-confirm modal is clicked per card.
// Small batches (--max, default 15) because long runs get killed externally.
//
// Run:  node linkedin-automation/tools/withdraw-stray-invites.js [--max=N] [--dry-run]

const path = require('path');
const S = require('../lib/_li-session');

const MEMBERS = path.join(__dirname, '..', 'data', 'members.json');
const SENT_URL = 'https://www.linkedin.com/mynetwork/invitation-manager/sent/';
const NOTE_MARK = /same AI automation group/i;
const EXCLUDE = new Set(['ja-claylyn-hamner-188455233']); // keep pending (Mike is chatting with her)

const ARGV = process.argv.slice(2);
const MAX = (() => { const a = ARGV.find(x => x.startsWith('--max=')); return a ? parseInt(a.split('=')[1], 10) : 15; })();
const DRY_RUN = ARGV.includes('--dry-run');
const MAX_SCROLL = 40;
const STALL_LIMIT = 4;

const normSlug = s => { try { return decodeURIComponent(String(s)).toLowerCase().replace(/\/+$/, ''); } catch { return String(s).toLowerCase(); } };

// Harvest sent-invite cards: {slug, href, text}.
async function harvest(page) {
  return page.$$eval('a[href*="/in/"]', els => {
    const slugOf = el => (((el.getAttribute('href') || '').match(/\/in\/([^/?#]+)/)) || [])[1];
    const out = [];
    for (const a of els) {
      const slug = slugOf(a);
      if (!slug) continue;
      let node = a, card = null;
      for (let i = 0; i < 7 && node.parentElement; i++) {
        node = node.parentElement;
        const slugs = new Set([...node.querySelectorAll('a[href*="/in/"]')].map(slugOf).filter(Boolean));
        if (slugs.size > 1) break;
        if (/withdraw/i.test(node.innerText || '')) card = node;
      }
      if (card) out.push({ slug, href: a.getAttribute('href'), text: (card.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) });
    }
    return out;
  }).catch(() => []);
}

(async () => {
  const members = S.readJson(MEMBERS, []);
  const memberSlugs = new Set(members.map(m => normSlug(S.slugFromUrl(m.profile_url) || '')));
  console.log(`${members.length} members loaded (${memberSlugs.size} protected slugs). max=${MAX}${DRY_RUN ? ' DRY RUN' : ''}`);

  const { browser, page } = await S.launchSession();
  let withdrawn = 0, protectedSeen = 0, excludedSeen = 0;
  const withdrawnSlugs = [];
  try {
    await page.goto(SENT_URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    if (await S.isRestricted(page)) { console.log('\n!! Restriction page. STOPPING.'); return; }
    await S.pause(page, 2500, 4500, 'let sent list render');

    let stalls = 0, prevSeen = 0;
    const handled = new Set();  // slugs already withdrawn / queued / failed — never re-process
    const seenAll = new Set();  // every distinct slug encountered (stall detection)
    for (let round = 0; round < MAX_SCROLL && withdrawn < MAX && stalls < STALL_LIMIT; round++) {
      const cards = await harvest(page);
      for (const c of cards) seenAll.add(normSlug(c.slug));

      // Withdraw every eligible card currently in the DOM (newest first).
      let actedThisRound = 0;
      for (const c of cards) {
        if (withdrawn >= MAX) break;
        const slug = normSlug(c.slug);
        if (handled.has(slug)) continue;
        if (!NOTE_MARK.test(c.text)) continue;                 // not our bot's note
        if (memberSlugs.has(slug)) { protectedSeen++; continue; } // intended member
        if (EXCLUDE.has(slug)) { excludedSeen++; continue; }
        handled.add(slug);

        console.log(`  STRAY: ${c.slug} — "${c.text.slice(0, 80)}"`);
        if (DRY_RUN) { withdrawn++; withdrawnSlugs.push(c.slug); actedThisRound++; continue; }

        // The Withdraw control in the 2026 UI is an <a aria-label="Withdraw
        // invitation sent to <Name>"> (probed 2026-07-22) — not a <button>.
        // Find it inside this card and click its real coordinates.
        const pt = await page.evaluate((href) => {
          const a = [...document.querySelectorAll('a[href*="/in/"]')].find(x => x.getAttribute('href') === href);
          if (!a) return null;
          let node = a;
          for (let i = 0; i < 8 && node.parentElement; i++) {
            node = node.parentElement;
            const ctl = node.querySelector('[aria-label^="Withdraw invitation"]');
            if (ctl) {
              ctl.scrollIntoView({ block: 'center' });
              const r = ctl.getBoundingClientRect();
              return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: ctl.tagName, aria: ctl.getAttribute('aria-label') };
            }
          }
          return null;
        }, c.href).catch(() => null);
        if (!pt) { console.log('    no Withdraw control found — skipped'); continue; }
        // Clear any modal left open by a previous attempt.
        await page.keyboard.press('Escape').catch(() => {});
        await S.pause(page, 500, 1000, 'clear overlays');
        console.log(`    clicking "${pt.aria}"`);
        await S.pause(page, 2000, 5000, 'before Withdraw');
        // Click the card control via its per-person aria-label (Playwright
        // locators pierce shadow DOM; the modal lives in one, which is why
        // querySelectorAll-based confirm attempts found nothing).
        await page.locator(`[aria-label="${pt.aria.replace(/"/g, '\\"')}"]`).first()
          .click({ timeout: 6000 }).catch(e => console.log('    card click error: ' + e.message.split('\n')[0]));
        await S.pause(page, 1000, 2200, 'confirm modal');
        if (!/invitation-manager/.test(page.url())) {
          console.log(`    NAVIGATED AWAY to ${page.url()} — going back`);
          await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
          await S.pause(page, 2000, 4000, 'back to sent list');
          continue;
        }
        // The modal confirm is a bare <span> with exact text "Withdraw" (Mike's
        // DevTools paste): the ONLY such span NOT inside a card's aria-labeled
        // Withdraw-invitation anchor.
        const spans = await page.locator('span:text-is("Withdraw")').all().catch(() => []);
        let confirmEl = null;
        for (const s of spans) {
          const inCard = await s.evaluate(el => !!el.closest('[aria-label^="Withdraw invitation"]')).catch(() => true);
          if (!inCard) { confirmEl = s; break; }
        }
        if (confirmEl) {
          console.log(`    confirming (modal span found, ${spans.length} spans total)`);
          await S.pause(page, 800, 1800, 'before confirm');
          await confirmEl.click({ timeout: 6000 }).catch(e => console.log('    confirm click error: ' + e.message.split('\n')[0]));
        } else {
          console.log(`    NO modal confirm span found (${spans.length} spans, all in cards)`);
        }
        await S.pause(page, 1500, 3000, 'after withdraw');
        // Verify the card is gone.
        if (!(await page.locator(`a[href="${c.href}"]`).count().catch(() => 0))) {
          withdrawn++; withdrawnSlugs.push(c.slug); actedThisRound++;
          console.log(`    WITHDRAWN (${withdrawn}/${MAX})`);
        } else {
          const shot = path.join(require('os').tmpdir(), `withdraw-fail-${withdrawn}-${Date.now()}.png`);
          await page.screenshot({ path: shot }).catch(() => {});
          console.log(`    still present after click — screenshot: ${shot}`);
        }
      }

      if (withdrawn >= MAX) break;
      // Load more of the list (same pagination that exhausted the audit's list).
      if (seenAll.size === prevSeen && !actedThisRound) stalls++; else stalls = 0;
      prevSeen = seenAll.size;
      const more = page.locator(
        'button:visible:has-text("Show more"), button:visible:has-text("Load more"), ' +
        'button[aria-label*="more results" i]:visible, button:visible:has-text("Next")'
      ).first();
      if (await more.count().catch(() => 0)) {
        await more.scrollIntoViewIfNeeded().catch(() => {});
        await more.click({ timeout: 5000 }).catch(() => {});
      } else {
        await page.evaluate(() => {
          window.scrollBy(0, document.body.scrollHeight);
          document.querySelectorAll('main, [class*="scaffold"], [class*="list"]').forEach(el => {
            if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
          });
        });
      }
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'paginate');
    }

    console.log('\n============================================================');
    console.log(` ${DRY_RUN ? 'WOULD withdraw' : 'Withdrawn'}: ${withdrawn} stray invite(s)`);
    console.log(` Protected (intended members seen): ${protectedSeen} · Excluded: ${excludedSeen}`);
    console.log(` Slugs: ${withdrawnSlugs.join(', ') || '(none)'}`);
    console.log(` ${withdrawn >= MAX ? 'BATCH CAP HIT — run again for the rest.' : 'List exhausted or no more strays in reach.'}`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
