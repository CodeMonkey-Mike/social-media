// Lightweight driver/probe for the Higgsfield Audio (Seed Speech) flow. No screenshot (avoids 30s timeouts).
// Usage:
//   node _probe.js                 -> dump visible controls
//   node _probe.js esc             -> press Escape (dismiss popover), then dump
//   node _probe.js click "<text>"  -> click first element whose visible text includes <text>, then dump
const { connect } = require('./_cdp');

function dump(page) {
  return page.$$eval('a,button,[role="button"],[role="option"],[role="menuitem"],[role="dialog"] *',
    els => els.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim())
      .filter(t => t && t.length < 60));
}

(async () => {
  const { browser, page } = await connect();
  const cmd = process.argv[2];
  if (cmd === 'esc') { try { await page.keyboard.press('Escape'); } catch (e) {} await page.waitForTimeout(700); }
  if (cmd === 'click') {
    const text = process.argv[3];
    const el = page.locator(`text="${text}"`).first();
    await el.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await el.click({ timeout: 8000 });
    await page.waitForTimeout(1500);
  }
  console.log('URL:', page.url());
  const links = await dump(page);
  console.log('CTRL:', [...new Set(links)].slice(0, 90).join(' | '));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
