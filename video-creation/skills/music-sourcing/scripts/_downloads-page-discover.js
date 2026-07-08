const fs = require('fs'); const path = require('path');
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright');
const PROFILE = 'C:/Users/mnede/AppData/Local/Google/Chrome/soundstripe-profile';
const OUT = 'C:/Users/mnede/Documents/Claude/social-media/video-creation/skills/music-sourcing/_recon';
const cands = ['https://www.soundstripe.com/library/downloads','https://www.soundstripe.com/account/downloads',
               'https://www.soundstripe.com/library/my-downloads','https://www.soundstripe.com/downloads'];
(async () => {
  const b = await chromium.launchPersistentContext(PROFILE, { channel: 'chrome', headless: false, slowMo: 40, viewport: null });
  const page = b.pages()[0] || await b.newPage();
  page.on('response', async (r) => {
    if (/content_id_licenses|songs\/sales|\/sales/.test(r.url())) console.log('  api:', r.request().method(), r.status(), r.url().replace('https://api.soundstripe.com',''));
  });
  let found = null;
  for (const u of cands) {
    const resp = await page.goto(u, { waitUntil: 'domcontentloaded' }).catch(() => null);
    await page.waitForTimeout(4000);
    const title = await page.title().catch(() => '');
    const url = page.url();
    const hasTracks = await page.evaluate(() => /download/i.test(document.body.innerText) && document.querySelectorAll('button').length > 5).catch(() => false);
    console.log(`try ${u} -> ${resp ? resp.status() : 'ERR'} | landed ${url} | "${title}"`);
    if (!/sign_in|not.found|404/i.test(url + title) && url.includes(u.split('soundstripe.com')[1].split('/')[2] || 'downloads')) { found = url; }
  }
  // whichever we're on now, screenshot + dump controls mentioning content id / youtube / copy
  await page.screenshot({ path: OUT + '/shots/dl-history.png', fullPage: false }).catch(() => {});
  const ctrls = await page.evaluate(() => Array.from(document.querySelectorAll('button,a,[role="button"]'))
    .map(e => ({ testid: e.getAttribute('data-testid'), aria: e.getAttribute('aria-label'), text: (e.textContent||'').trim().replace(/\s+/g,' ').slice(0,40) }))
    .filter(x => /content|youtube|copy|code|license|claim/i.test([x.testid,x.aria,x.text].join(' '))));
  fs.writeFileSync(OUT + '/dom/dl-history-controls.json', JSON.stringify(ctrls, null, 1));
  console.log('content-id-ish controls:', JSON.stringify(ctrls).slice(0, 1200));
  await b.close(); process.exit(0);
})();
