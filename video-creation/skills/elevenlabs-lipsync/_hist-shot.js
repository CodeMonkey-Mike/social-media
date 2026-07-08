// Navigate the Image & Video page to the History tab and screenshot it, so we can locate renders.
const { chromium } = require('playwright');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = await browser.newPage();
  await page.goto('https://elevenlabs.io/app/image-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  // click History tab
  for (const mk of [() => page.getByRole('tab', { name: 'History', exact: true }),
                    () => page.getByRole('button', { name: 'History', exact: true }),
                    () => page.getByText('History', { exact: true })]) {
    const t = mk().first();
    if (await t.isVisible().catch(() => false)) { await t.click().catch(() => {}); await page.waitForTimeout(3000); break; }
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'el-history-now.png', fullPage: false });
  console.log('URL:', page.url());
  // dump the tab labels + whether an active "History" tab exists
  const tabs = await page.$$eval('[role="tab"],button,a', els => els.map(e => (e.innerText||'').trim()).filter(t => t && t.length < 18 && /history|explore/i.test(t)));
  console.log('tabs seen:', [...new Set(tabs)].join(' | '));
  console.log('saved el-history-now.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
