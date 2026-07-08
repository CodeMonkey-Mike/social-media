// _probe-group-search.js — RECON ONLY (no writes). Open a group's members page,
// find the in-page "Search members" box, run one test name search, and dump how
// results render so we can build the seed-by-name step.
//   node linkedin-automation/skills/scrape-group-members/_probe-group-search.js [groupId] [name]
//
// Single-instance: don't run while another li-bot-profile session is open.

const S = require('../../lib/_li-session');

const GROUP_ID = process.argv[2] || '6665791';
const NAME = process.argv[3] || 'Albert';
const MEMBERS_URL = `https://www.linkedin.com/groups/${GROUP_ID}/members/`;

// Dump every text-ish input on the page (placeholder / aria-label / id / class),
// so we can identify the member-search field even with hashed class names.
async function dumpInputs(page, label) {
  const inputs = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('input, [contenteditable="true"], [role="searchbox"]').forEach(el => {
      const r = el.getBoundingClientRect();
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        placeholder: el.getAttribute('placeholder') || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        id: el.id || '',
        cls: (el.className || '').toString().slice(0, 60),
        visible: r.width > 0 && r.height > 0,
      });
    });
    return out;
  }).catch(() => []);
  console.log(`\n--- inputs (${label}): ${inputs.length} ---`);
  inputs.forEach((i, n) => console.log(
    `  [${n}] ${i.tag}${i.type ? '/' + i.type : ''} vis=${i.visible} ` +
    `ph=${JSON.stringify(i.placeholder)} aria=${JSON.stringify(i.ariaLabel)} ` +
    `id=${JSON.stringify(i.id)} cls=${JSON.stringify(i.cls)}`
  ));
  return inputs;
}

// Count + sample the /in/ profile links currently on the page (the member rows).
async function dumpProfileLinks(page, label) {
  const links = await page.evaluate(() => {
    const seen = new Map();
    document.querySelectorAll('a[href*="/in/"]').forEach(a => {
      const m = a.getAttribute('href').match(/\/in\/([^/?#]+)/);
      if (!m) return;
      const slug = m[1];
      const text = (a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      if (!seen.has(slug)) seen.set(slug, text);
    });
    return [...seen.entries()].map(([slug, text]) => ({ slug, text }));
  }).catch(() => []);
  console.log(`\n--- /in/ links (${label}): ${links.length} distinct ---`);
  links.slice(0, 25).forEach((l, n) => console.log(`  [${n}] ${l.slug}  ::  ${JSON.stringify(l.text)}`));
  if (links.length > 25) console.log(`  ... +${links.length - 25} more`);
  return links;
}

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    console.log('Opening group members page:', MEMBERS_URL);
    await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await S.pause(page, 4000, 6000, 'let members page settle');
    console.log('URL  :', page.url());
    console.log('TITLE:', JSON.stringify(await page.title()));

    if (await S.isRestricted(page)) {
      console.log('\n!!! RESTRICTION/UNUSUAL-ACTIVITY PAGE DETECTED — stopping. !!!');
      return;
    }

    await dumpInputs(page, 'before search');
    await dumpProfileLinks(page, 'before search');

    // Try the likely member-search selectors (group pages historically use a
    // "Search members"/"Search by name" input). Best-effort; this is discovery.
    const CANDIDATES = [
      'input[placeholder*="Search" i]',
      'input[aria-label*="Search" i]',
      'input[placeholder*="member" i]',
      'input[aria-label*="member" i]',
      'input[type="search"]',
      '[role="searchbox"]',
    ];
    let used = null;
    for (const sel of CANDIDATES) {
      const loc = page.locator(sel).first();
      if (await loc.count().catch(() => 0)) {
        const vis = await loc.isVisible().catch(() => false);
        if (vis) { used = sel; break; }
      }
    }

    if (!used) {
      console.log('\n>>> No obvious member-search box found via candidate selectors.');
      console.log('>>> Inspect the "inputs (before search)" dump above to pick the right one.');
      await S.pause(page, 3000, 5000, 'hold for manual look');
      return;
    }

    console.log(`\n>>> Using member-search selector: ${used}`);
    const box = page.locator(used).first();
    await box.click({ timeout: 8000 });
    await S.pause(page, 600, 1200, 'focus search');
    await box.fill('');
    await box.type(NAME, { delay: S.randomBetween(60, 160) });
    await S.pause(page, 600, 1200, `typed "${NAME}"`);
    await box.press('Enter');
    await S.pause(page, 4000, 7000, 'wait for results');

    console.log('\nURL after search:', page.url());
    await dumpInputs(page, 'after search');
    await dumpProfileLinks(page, `after search "${NAME}"`);

    console.log('\n(Probe done. Review selectors + result shape above. Holding 6s.)');
    await S.pause(page, 6000, 6000, 'hold');
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
