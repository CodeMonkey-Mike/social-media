// Type a line into the Seed Speech prompt, click Generate, wait for the new mp3, print its URL.
// Assumes the voice preset is already set (e.g. ANA-2). Usage: node _gen-line.js "the line to speak"
const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  const text = process.argv[2];
  if (!text) { console.error('need text arg'); process.exit(1); }

  const grabMp3 = () => page.evaluate(() => {
    const out = new Set();
    document.querySelectorAll('audio,source,a').forEach(e => {
      const u = e.currentSrc || e.src || e.href || '';
      if (/cloudfront[^ ]*\.mp3/.test(u)) out.add(u);
    });
    return [...out];
  });

  const before = await grabMp3();

  // focus + clear + type the line (per-character, anti-automation friendly)
  const ta = page.locator('textarea, [contenteditable="true"]').first();
  await ta.click({ timeout: 8000 });
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await ta.type(text, { delay: 18 });
  await page.waitForTimeout(400);

  // click Generate
  const gen = page.getByRole('button', { name: /generate/i }).first();
  await gen.click({ timeout: 8000 }).catch(async () => {
    await page.locator('text=/^GENERATE$/i').first().click({ timeout: 8000 });
  });

  // poll up to ~60s for a NEW cloudfront mp3
  let url = null;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(1500);
    const now = await grabMp3();
    const fresh = now.find(u => !before.includes(u));
    if (fresh) { url = fresh; break; }
  }
  console.log('MP3:', url || '(none found)');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
