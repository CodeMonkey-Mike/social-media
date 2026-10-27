// Click Login on higgsfield.ai, then look for a Google button; stop before anything needing credentials.
const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  await page.keyboard.press('Escape').catch(()=>{});
  await page.waitForTimeout(500);
  const login = page.locator('a:has-text("Login"), button:has-text("Login")').first();
  await login.click({ timeout: 8000 });
  await page.waitForTimeout(3500);
  console.log('URL after Login click:', page.url());
  const texts = await page.$$eval('a,button,[role="button"]', els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length < 60));
  console.log('CONTROLS:', [...new Set(texts)].slice(0, 40).join(' | '));
  await page.screenshot({ path: '_login1.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
