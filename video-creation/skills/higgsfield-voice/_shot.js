const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  await page.waitForTimeout(1500);
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  // dump top-level nav / link text to find the Audio section
  const links = await page.$$eval('a,button', els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length<40));
  console.log('NAV/LINKS:', [...new Set(links)].slice(0,60).join(' | '));
  await page.screenshot({ path: '_shot.png', fullPage: false });
  console.log('saved _shot.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
