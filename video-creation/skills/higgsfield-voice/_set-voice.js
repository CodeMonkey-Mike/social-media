// Open the Voice Preset picker and select a preset by clicking the VISIBLE in-modal card by rect.
// Usage: node _set-voice.js "ana-2"   (case-insensitive; CSS uppercases the card text)
const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  const target = (process.argv[2] || 'ana-2').toLowerCase();
  await page.locator('text="Voice Preset"').first().click({ timeout: 8000 });
  await page.waitForTimeout(1500);
  // Find the visible element whose exact trimmed text == target, return its center point.
  const box = await page.evaluate((t) => {
    for (const e of document.querySelectorAll('*')) {
      if ((e.textContent || '').trim().toLowerCase() !== t) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const s = getComputedStyle(e);
      if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return null;
  }, target);
  if (!box) { console.log('CARD NOT FOUND/visible for', target); await browser.close(); return; }
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(1500);
  const links = await page.$$eval('button,[role="button"]',
    els => els.map(e => (e.innerText || '').trim()).filter(t => t && t.length < 24));
  console.log('CLICKED', target, 'at', Math.round(box.x) + ',' + Math.round(box.y),
    '-> AFTER:', [...new Set(links)].slice(0, 40).join(' | '));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
