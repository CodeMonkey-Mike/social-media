const fs = require('fs'); const path = require('path');
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright');
const PROFILE = 'C:/Users/mnede/AppData/Local/Google/Chrome/soundstripe-profile';
const OUT = 'C:/Users/mnede/Documents/Claude/social-media/video-creation/skills/music-sourcing/_recon';
(async () => {
  const b = await chromium.launchPersistentContext(PROFILE, { channel: 'chrome', headless: false, slowMo: 50, acceptDownloads: true, viewport: null });
  const page = b.pages()[0] || await b.newPage();
  await page.goto('https://www.soundstripe.com/library/royalty-free-music?filter[q]=Theta%20Rest', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  await page.locator('button[data-testid="song-license-btn"]').first().click();
  await page.waitForTimeout(3500);
  // scroll the dialog to the bottom in steps
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => { const d = document.querySelector('[role="dialog"]') || document.querySelector('[class*="modal" i]'); if (d) d.scrollTop = d.scrollHeight; });
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: OUT + '/shots/m-modal-bottom.png', fullPage: true }).catch(() => {});
  const html = await page.evaluate(() => { const d = document.querySelector('[role="dialog"]') || document.querySelector('[class*="modal" i]'); return d ? d.outerHTML : document.body.outerHTML; });
  fs.writeFileSync(OUT + '/dom/download-modal-full.html', html.slice(0, 500 * 1024));
  // list interesting controls
  const ctrls = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]') || document;
    return Array.from(d.querySelectorAll('button, a, [role="button"]')).map(e => ({
      testid: e.getAttribute('data-testid'), aria: e.getAttribute('aria-label'),
      text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
    })).filter(x => x.text || x.testid || x.aria);
  });
  fs.writeFileSync(OUT + '/dom/modal-controls.json', JSON.stringify(ctrls, null, 1));
  console.log('controls:', JSON.stringify(ctrls).slice(0, 1500));
  await b.close(); process.exit(0);
})();
