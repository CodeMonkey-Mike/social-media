const { connect } = require('./_cdp');
(async () => {
  const target = process.argv[2];
  const { browser, page } = await connect();
  if (target && target.startsWith('http')) {
    await page.goto(target, { waitUntil: 'domcontentloaded' });
  } else if (target) {
    const el = page.locator(`a:has-text("${target}"), button:has-text("${target}")`).first();
    await el.click({ timeout: 8000 });
  }
  await page.waitForTimeout(2500);
  console.log('URL:', page.url());
  const links = await page.$$eval('a,button,[role="button"]', els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length<45));
  console.log('CONTROLS:', [...new Set(links)].slice(0,70).join(' | '));
  await page.screenshot({ path: '_shot.png' });
  console.log('saved _shot.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
