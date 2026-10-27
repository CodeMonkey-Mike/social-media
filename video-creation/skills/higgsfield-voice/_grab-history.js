// Capture the mp3 URLs of the N newest History cards (LI rows) for a voice by clicking each row's Play.
// Usage: node _grab-history.js <voice> <N>  -> JSON [{idx,url}] newest (top) first. Spends no credits.
const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  const voice = (process.argv[2] || 'yuli-1').toLowerCase(); const N = +(process.argv[3] || 6);
  const seen = [];
  page.on('response', r => { const u = r.url(); if (/cloudfront.*\.mp3/i.test(u) && !seen.includes(u)) seen.push(u); });
  const rows = await page.evaluate((voice) => {
    const out = [];
    for (const li of document.querySelectorAll('li')) {
      const r = li.getBoundingClientRect();
      if (r.width < 300 || r.height < 50 || r.height > 130) continue;
      const leaf = [...li.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').trim().toLowerCase() === voice);
      if (!leaf) continue;
      const play = li.querySelector('button[aria-label="Play"]');
      if (!play) continue;
      const pr = play.getBoundingClientRect();
      out.push({ top: r.top, x: pr.left + pr.width / 2, y: pr.top + pr.height / 2 });
    }
    out.sort((a, b) => a.top - b.top);
    return out;
  }, voice);
  console.log('cards found:', rows.length);
  const result = [];
  for (let i = 0; i < Math.min(N, rows.length); i++) {
    const before = seen.length;
    await page.mouse.click(rows[i].x, rows[i].y);
    for (let k = 0; k < 24 && seen.length === before; k++) await page.waitForTimeout(250);
    const url = seen.length > before ? seen[seen.length - 1] : null;
    result.push({ idx: i, url });
    await page.mouse.click(rows[i].x, rows[i].y); // pause
    await page.waitForTimeout(500);
  }
  console.log(JSON.stringify(result));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
