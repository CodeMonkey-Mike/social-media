// check-endorsements.js
// Reads MY OWN skills page (…/in/michael-luis/details/skills/), opens each
// endorsed skill's endorsers overlay, and records WHO endorsed each skill into
// data/endorsements.json. New endorsers are stamped with first_seen = the date
// this run first OBSERVED them — LinkedIn does not expose the real endorsement
// date, so run this frequently and first_seen stays roughly in line with when
// the endorsement happened (Mike, 2026-07-22; same observed-date convention as
// check-connections.js when the connect date isn't shown).
//
// It then joins the endorsers back to data/members.json and stamps the members
// who endorsed us:
//   endorsed_back        true
//   endorsed_back_on     earliest first_seen among their endorsements (set once)
//   endorsed_back_skills [skill names]        (kept current as new ones appear)
//   endorsed_back_count  how many of our skills they've endorsed
//
// This closes the loop on skill 4 (endorse-and-message): its DM asks the member
// to endorse back, and this script is how we find out who actually did.
//
// VOLUME: everything here is our OWN profile (the skills page + its endorser
// overlays) — NO member profiles are visited, so like check-connections this
// does not consume the member profile-view budget. Run freely.
//
// Run:  node linkedin-automation/skills/check-endorsements/check-endorsements.js [--dry-run] [--all]
//   --dry-run   navigate + report everything, but write NO files.
//   --all       visit every endorsed skill's endorsers page even when its
//               endorsement count matches what we already have recorded
//               (default: unchanged counts are skipped as "no change").
//
// Selector notes (probed live 2026-07-22, _probe-endorsements.js +
// _probe-endorsers-page.js — re-probe with those if this breaks):
//   - Each endorsed skill row on /details/skills/ has TWO <a>s to the SAME
//     href ending /endorsers/ ("Endorsed by N people…" + "N endorsements");
//     the href embeds a stable skill id: urn:li:fsd_skill:(<me>,<skillId>).
//     Skills with zero endorsements have no such anchor. Dedupe by href;
//     parse the total from the /^\d+ endorsement/ anchor text.
//   - The skill NAME is found by climbing the anchor's ancestors until a text
//     line appears that is neither "N endorsement(s)" nor "Endorsed by …".
//   - Navigating to the /endorsers/ URL opens an OVERLAY that is OUTSIDE
//     <main> and has NO role="dialog". Endorser rows are document-level
//     a[href*="/in/"] links (text "Name · 1st Headline…") whose closest('main')
//     is null. Exclude our own slug and any /details/ / /edit/ hrefs.
//   - The overlay LAZY-LOADS on its own internal scroll container — scrolling
//     the window does NOT load more rows (the 50-endorser probe only rendered
//     10). Scroll the overlay: climb from an endorser link to the first
//     ancestor with scrollHeight > clientHeight and drive its scrollTop.

const path = require('path');
const S = require('../../lib/_li-session');

const MEMBERS = path.join(__dirname, '..', '..', 'data', 'members.json');
const ENDORSEMENTS = path.join(__dirname, '..', '..', 'data', 'endorsements.json');

// Own profile — the one whose incoming endorsements we read. Also hardcoded in
// endorse-and-message.js's DM template (the link we ask members to visit).
const MY_SLUG = 'michael-luis';
const MY_SKILLS_URL = `https://www.linkedin.com/in/${MY_SLUG}/details/skills/`;

const ARGV = process.argv.slice(2);
const DRY_RUN = ARGV.includes('--dry-run');
const FORCE_ALL = ARGV.includes('--all');

// Overlay scrolling: rounds and stall tolerance while harvesting endorser rows.
const OVERLAY_MAX_ROUNDS = 25;
const OVERLAY_STALL_LIMIT = 4;
// Skills-list scrolling on the main page (loads lazy skill rows).
const SKILLS_MAX_ROUNDS = 12;
const SKILLS_STALL_LIMIT = 3;

function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ----------------------------------------------------------------------------
// Phase 1 — harvest the endorsed-skill list off my own /details/skills/ page.
// Returns [{ skill, skillId, href, count }] (one entry per skill, deduped).
// ----------------------------------------------------------------------------
async function harvestSkills(page) {
  // Load the whole lazy list first: scroll + click "Show more results" (exact
  // visible text only — selector-discipline rule) until the anchor set stalls.
  let prev = -1, stalls = 0;
  for (let round = 0; round < SKILLS_MAX_ROUNDS && stalls < SKILLS_STALL_LIMIT; round++) {
    const n = await page.locator('main a[href*="/endorsers/"]').count().catch(() => 0);
    if (n === prev) stalls++; else stalls = 0;
    prev = n;
    const more = page.locator('main button').filter({ hasText: /^(Show more results|Load more)$/ }).first();
    if ((await more.count().catch(() => 0)) && (await more.isVisible().catch(() => false))) {
      await more.scrollIntoViewIfNeeded().catch(() => {});
      await more.click({ timeout: 5000 }).catch(() => {});
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'show more skills');
    } else {
      await page.evaluate(() => window.scrollBy(0, 1400)).catch(() => {});
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll skills list');
    }
  }

  const raw = await page.$$eval('main a[href*="/endorsers/"]', els =>
    els.map(a => {
      // Skill name: climb until a text line that isn't the endorsement lines.
      let node = a, name = null;
      for (let i = 0; i < 8 && node.parentElement; i++) {
        node = node.parentElement;
        const lines = (node.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
        const cand = lines.find(l => !/endorsement/i.test(l) && !/^endorsed by/i.test(l));
        if (cand) { name = cand; break; }
      }
      return { href: a.href, text: (a.innerText || '').trim(), name };
    })
  );

  const byHref = new Map();
  for (const r of raw) {
    const idm = r.href.match(/fsd_skill:\(([^,]+),(\d+)\)/);
    if (!idm) continue;
    const cur = byHref.get(r.href) || { skill: null, skillId: idm[2], href: r.href, count: 0 };
    if (r.name && !cur.skill) cur.skill = r.name;
    const cm = r.text.match(/^(\d+)\s+endorsement/i);
    if (cm) cur.count = Math.max(cur.count, parseInt(cm[1], 10));
    byHref.set(r.href, cur);
  }
  return [...byHref.values()];
}

// ----------------------------------------------------------------------------
// Phase 2 — open ONE skill's /endorsers/ overlay and harvest every endorser.
// Returns [{ slug, profile_url, name, headline }] (deduped by slug).
// ----------------------------------------------------------------------------
async function harvestEndorsers(page, skillEntry) {
  await page.goto(skillEntry.href, { waitUntil: 'domcontentloaded' });

  // The overlay's endorser rows are /in/ links OUTSIDE <main>, not our own slug.
  const harvest = () => page.$$eval('a[href*="/in/"]', (els, mySlug) =>
    els
      .filter(a => !a.closest('main') && !a.closest('#global-nav'))
      .map(a => ({
        href: a.href,
        text: (a.innerText || '').replace(/\s+/g, ' ').trim(),
      }))
      .filter(x => x.href && !x.href.includes(`/in/${mySlug}`) &&
                   !/\/details\/|\/edit\//.test(x.href) && x.text),
    MY_SLUG
  ).catch(() => []);

  await page.waitForFunction((mySlug) =>
    [...document.querySelectorAll('a[href*="/in/"]')].some(a =>
      !a.closest('main') && !(a.getAttribute('href') || '').includes(`/in/${mySlug}`) &&
      (a.innerText || '').trim()),
    MY_SLUG, { timeout: 20000 }
  ).catch(() => {});
  await S.pause(page, 2500, 5000, 'endorsers overlay settle');

  let rows = [], stalls = 0;
  for (let round = 0; round < OVERLAY_MAX_ROUNDS && stalls < OVERLAY_STALL_LIMIT; round++) {
    const cur = await harvest();
    if (cur.length >= skillEntry.count) { rows = cur; break; }
    if (cur.length === rows.length) stalls++; else stalls = 0;
    rows = cur;

    // Scroll INSIDE the overlay: the first scrollable ancestor of a row link.
    // Also click a "Show more results" button if the overlay paginates that way.
    const clicked = await page.evaluate((mySlug) => {
      const isRow = a => !a.closest('main') && !(a.getAttribute('href') || '').includes(`/in/${mySlug}`);
      const link = [...document.querySelectorAll('a[href*="/in/"]')].find(isRow);
      if (!link) return 'no-rows';
      let el = link.parentElement;
      while (el && el !== document.body) {
        if (el.scrollHeight > el.clientHeight + 60) {
          const btn = [...el.querySelectorAll('button')]
            .find(b => /^(Show more results|Load more)$/.test((b.innerText || '').trim()));
          if (btn) { btn.click(); return 'clicked-more'; }
          el.scrollTop = el.scrollTop + Math.max(600, el.clientHeight * 0.8);
          return 'scrolled';
        }
        el = el.parentElement;
      }
      window.scrollBy(0, 1200);
      return 'window-scrolled';
    }, MY_SLUG).catch(() => 'error');
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, `overlay ${clicked}`);
  }

  // Normalize + dedupe by slug. Row text is "Name · 1st Headline…".
  const bySlug = new Map();
  for (const r of rows) {
    const slug = S.slugFromUrl(r.href);
    const url = S.canonicalProfileUrl(r.href);
    if (!slug || !url || bySlug.has(slug)) continue;
    const parts = r.text.split('·').map(s => s.trim()).filter(Boolean);
    const name = parts[0] || null;
    // parts[1] starts with the degree badge ("1st Headline…") — strip it.
    const headline = (parts[1] || '').replace(/^(1st|2nd|3rd\+?)\s*/i, '').slice(0, 100) || null;
    bySlug.set(slug, { slug, profile_url: url, name, headline });
  }
  return [...bySlug.values()];
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
(async () => {
  const members = S.readJson(MEMBERS, []);
  const known = S.readJson(ENDORSEMENTS, []); // [{skill, skill_id, slug, profile_url, name, headline, first_seen}]
  const knownKeys = new Set(known.map(e => `${e.skill_id}|${e.slug}`));
  const knownPerSkill = new Map(); // skill_id -> count recorded
  for (const e of known) knownPerSkill.set(e.skill_id, (knownPerSkill.get(e.skill_id) || 0) + 1);

  console.log(`endorsements.json: ${known.length} endorsement(s) already recorded across ${knownPerSkill.size} skill(s).`);
  if (DRY_RUN) console.log('** DRY RUN ** — will scan + report, but write NOTHING.');

  const { browser, page } = await S.launchSession();
  const fresh = []; // new endorsement records this run
  let visited = 0, skipped = 0;

  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'land on feed');

    await page.goto(MY_SKILLS_URL, { waitUntil: 'domcontentloaded' });
    await S.pause(page, 3000, 6000, 'skills page render');
    if (await S.isRestricted(page)) { console.log('\n!! LinkedIn restriction page detected. STOPPING.'); return; }

    const skills = await harvestSkills(page);
    const totalOnPage = skills.reduce((n, s) => n + s.count, 0);
    console.log(`\n${skills.length} endorsed skill(s) on the page, ${totalOnPage} total endorsements:`);
    for (const s of skills) console.log(`  - ${s.skill} (${s.count})`);

    for (const s of skills) {
      const have = knownPerSkill.get(s.skillId) || 0;
      if (!FORCE_ALL && have === s.count) {
        skipped++;
        console.log(`\n[${s.skill}] ${s.count} endorsement(s), ${have} recorded — no change, skipping.`);
        continue;
      }
      if (have > s.count) {
        console.log(`\n[${s.skill}] page shows ${s.count} but we have ${have} recorded — an endorsement may have been retracted (records are append-only; visiting anyway).`);
      }
      visited++;
      console.log(`\n[${s.skill}] ${s.count} endorsement(s), ${have} recorded — opening endorsers…`);
      const endorsers = await harvestEndorsers(page, s);
      console.log(`   ${endorsers.length}/${s.count} endorser row(s) harvested.`);
      if (endorsers.length < s.count) {
        console.log('   (fewer rows than the count — some endorsers may be unlistable/deactivated, or the overlay stalled)');
      }
      for (const e of endorsers) {
        const key = `${s.skillId}|${e.slug}`;
        if (knownKeys.has(key)) continue;
        knownKeys.add(key);
        const rec = { skill: s.skill, skill_id: s.skillId, ...e, first_seen: today() };
        fresh.push(rec);
        known.push(rec);
        console.log(`   NEW: ${e.name || e.slug} endorsed "${s.skill}"`);
      }
      await S.pause(page, 2000, 4500, 'between skills');
    }

    if (fresh.length && !DRY_RUN) S.writeJson(ENDORSEMENTS, known);

    // ---- join back to members.json ----------------------------------------
    const bySlugAll = new Map(); // slug -> that person's endorsement records
    for (const e of known) {
      if (!bySlugAll.has(e.slug)) bySlugAll.set(e.slug, []);
      bySlugAll.get(e.slug).push(e);
    }
    let stamped = 0;
    for (const m of members) {
      const slug = S.slugFromUrl(m.profile_url);
      const recs = slug ? bySlugAll.get(slug) : null;
      if (!recs) continue;
      const skillsList = [...new Set(recs.map(r => r.skill))].sort();
      const firstSeen = recs.map(r => r.first_seen).sort()[0];
      const changed = !m.endorsed_back || m.endorsed_back_count !== recs.length;
      m.endorsed_back = true;
      if (!m.endorsed_back_on) m.endorsed_back_on = firstSeen;
      m.endorsed_back_skills = skillsList;
      m.endorsed_back_count = recs.length;
      if (changed) stamped++;
    }
    if (stamped && !DRY_RUN) S.writeJson(MEMBERS, members);

    // ---- report ------------------------------------------------------------
    const dmd = members.filter(m => m.dm_status === 'sent');
    const returned = dmd.filter(m => m.endorsed_back);
    const outstanding = dmd.filter(m => !m.endorsed_back)
      .sort((a, b) => String(a.dm_sent_at).localeCompare(String(b.dm_sent_at)));
    const memberSlugs = new Set(members.map(m => S.slugFromUrl(m.profile_url)).filter(Boolean));
    const organic = [...bySlugAll.keys()].filter(slug => !memberSlugs.has(slug));

    console.log('\n============================================================');
    console.log(` DONE. ${visited} skill(s) visited, ${skipped} unchanged (skipped).`);
    console.log(` ${fresh.length} NEW endorsement(s) recorded${DRY_RUN ? ' (dry-run, NOT written)' : ''}; ${known.length} total on file.`);
    console.log(` Members stamped/updated endorsed_back this run: ${stamped}${DRY_RUN ? ' (dry-run, NOT written)' : ''}.`);
    console.log(`\n CAMPAIGN: ${returned.length}/${dmd.length} DM'd member(s) have endorsed back.`);
    for (const m of returned) {
      console.log(`   ✓ ${S.slugFromUrl(m.profile_url)} — ${m.endorsed_back_count} skill(s) (${(m.endorsed_back_skills || []).join(', ')}) first seen ${m.endorsed_back_on} (DM'd ${m.dm_sent_at})`);
    }
    if (outstanding.length) {
      console.log(` Still outstanding (DM'd, no endorsement back yet):`);
      const now = new Date(today());
      for (const m of outstanding) {
        const days = Math.round((now - new Date(m.dm_sent_at)) / 864e5);
        console.log(`   … ${S.slugFromUrl(m.profile_url)} — DM'd ${m.dm_sent_at} (${days}d ago)`);
      }
    }
    console.log(` Non-member (organic) endorsers on file: ${organic.length}.`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
