// _probe-connect-guard.js — read-only diagnosis of one profile page (1 view):
// what does `main h1` say, what Connect controls exist, and would the
// request-connections identity guard match? Usage: node _probe-connect-guard.js <profile_url>
const S = require('../lib/_li-session');

const URL = process.argv[2];
if (!URL) { console.error('need a profile url'); process.exit(1); }

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    const nav = await S.searchAndOpen(page, { profile_url: URL });
    await S.ensureLoggedIn(page);
    console.log('reached via', nav, '->', page.url());
    await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
    await S.pause(page, 2000, 3500, 'read profile');

    const h1 = await page.locator('main h1').first().innerText().catch(e => `<error: ${e.message.split('\n')[0]}>`);
    console.log('main h1 innerText:', JSON.stringify(h1));
    const h1Count = await page.locator('main h1').count().catch(() => -1);
    console.log('main h1 count:', h1Count);

    const labels = await page.$$eval('main [aria-label]', els =>
      els.map(el => ({ tag: el.tagName, aria: el.getAttribute('aria-label') }))
         .filter(x => /connect|pending|follow|message/i.test(x.aria || '')).slice(0, 15));
    console.log('relevant aria-labels in main:');
    labels.forEach(l => console.log(`  <${l.tag}> ${l.aria}`));

    const shot = 'C:/Users/mnede/AppData/Local/Temp/claude/C--Users-mnede-Documents-Claude-social-media/6ffecafd-3d25-41d4-ae77-132329bc827f/scratchpad/probe-connect.png';
    await page.screenshot({ path: shot }).catch(() => {});
    console.log('screenshot:', shot);
  } finally {
    await browser.close();
  }
})();
