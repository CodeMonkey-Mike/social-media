const fs = require('fs'); const path = require('path');
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright');
const PROFILE = 'C:/Users/mnede/AppData/Local/Google/Chrome/soundstripe-profile';
const OUT = 'C:/Users/mnede/Documents/Claude/social-media/video-creation/skills/music-sourcing/_recon';
(async () => {
  const b = await chromium.launchPersistentContext(PROFILE, { channel: 'chrome', headless: false, slowMo: 40, viewport: null });
  const page = b.pages()[0] || await b.newPage();
  let code = null;
  page.on('response', async (r) => {
    if (/content_id_licenses/.test(r.url())) { try { const j = await r.json(); console.log('  [CODE]', JSON.stringify(j)); if (j.code) code = j.code; } catch {} }
  });
  await page.goto('https://www.soundstripe.com/library/account/downloads', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  await page.screenshot({ path: OUT + '/shots/dlh1.png' }).catch(() => {});
  fs.writeFileSync(OUT + '/dom/dlhist.html', (await page.evaluate(() => (document.querySelector('main')||document.body).outerHTML)).slice(0, 500*1024));
  const ctrls = await page.evaluate(() => Array.from(document.querySelectorAll('button,a,[role="button"],[data-testid]'))
    .map(e => ({ testid: e.getAttribute('data-testid'), aria: e.getAttribute('aria-label'), tip: e.getAttribute('data-tooltip'), text: (e.textContent||'').trim().replace(/\s+/g,' ').slice(0,40) }))
    .filter(x => x.testid || x.aria || x.text));
  fs.writeFileSync(OUT + '/dom/dlhist-controls.json', JSON.stringify(ctrls, null, 1));
  console.log('first 25 controls:'); ctrls.slice(0,25).forEach(c => console.log('  ', JSON.stringify(c)));

  // try clicking a content-id / youtube / copy-code control on the first row
  for (const sel of ['[data-tooltip*="Content" i]','[aria-label*="content id" i]','button:has-text("Content ID")',
                     'button:has-text("YouTube")','[data-tooltip*="YouTube" i]','button:has-text("Copy")','[aria-label*="copy" i]']) {
    const el = page.locator(sel).first();
    if (await el.count() && await el.isVisible().catch(()=>false)) {
      console.log('clicking:', sel);
      await el.click().catch(()=>{});
      await page.waitForTimeout(3500);
      await page.screenshot({ path: OUT + '/shots/dlh2-after.png' }).catch(()=>{});
      if (code) break;
    }
  }
  console.log('captured code:', code);
  await b.close(); process.exit(0);
})();
