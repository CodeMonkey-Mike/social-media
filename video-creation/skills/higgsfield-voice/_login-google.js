// Continue with Google using the profile's PERSISTED Google session. Stops if a password is asked.
const { connect } = require('./_cdp');
(async () => {
  const { browser, ctx, page } = await connect();
  const popupP = ctx.waitForEvent('page', { timeout: 15000 }).catch(() => null);
  await page.locator('button:has-text("Continue with Google")').first().click({ timeout: 8000 });
  let pop = await popupP;
  await page.waitForTimeout(4000);
  const target = pop || page;
  console.log('popup?', !!pop, 'url:', target.url());
  await target.screenshot({ path: '_login2.png' }).catch(()=>{});
  const body = await target.evaluate(() => document.body.innerText.slice(0, 1500)).catch(()=> '');
  console.log('TEXT:', body.replace(/\s+/g, ' ').slice(0, 700));
  // Account chooser: click the row that mentions the gmail account (never type anything).
  const acct = target.locator('[data-identifier*="miguelneder"], div[role="link"]:has-text("miguelneder"), li:has-text("miguelneder")').first();
  if (await acct.count()) {
    await acct.click({ timeout: 8000 });
    console.log('clicked account row');
    await page.waitForTimeout(8000);
    await page.screenshot({ path: '_login3.png' });
    console.log('MAIN URL:', page.url());
    const t = await page.$$eval('a,button', els => els.map(e => (e.innerText||'').trim()).filter(t => /^(Login|Sign up|Profile|Library)$/.test(t)));
    console.log('nav state:', [...new Set(t)].join(' | '));
  } else {
    console.log('NO account row found (password or other prompt?) - stopping here');
  }
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
