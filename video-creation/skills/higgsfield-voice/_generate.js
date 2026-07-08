const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  await page.waitForTimeout(400);

  // Capture mp3 URLs seen via network from this point on.
  const seenMp3 = new Set();
  page.on('response', (resp) => {
    const u = resp.url();
    if (/\.mp3(\?|$)/i.test(u)) seenMp3.add(u);
  });

  // snapshot existing audio srcs in DOM (to diff)
  const before = await page.evaluate(() =>
    [...document.querySelectorAll('audio,source')].map(a=>a.src||a.currentSrc).filter(Boolean)
  );
  const beforeSet = new Set(before);

  // Click the GENERATE action button (uppercase; not the footer "Generate" nav item).
  const clicked = await page.evaluate(() => {
    // The action button is a <button> whose text starts with GENERATE (e.g. "GENERATE\n0.6").
    const cands = [...document.querySelectorAll('button')].filter(e => {
      const t=(e.innerText||'').trim();
      return /^GENERATE/i.test(t);
    });
    if (!cands.length) return false;
    const vis = cands.map(e=>({e,r:e.getBoundingClientRect()}))
                     .filter(o=>o.r.width>30 && o.r.height>20)
                     .sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height));
    if (!vis.length) return false;
    vis[0].e.click();
    return true;
  });
  console.log('GENERATE clicked:', clicked);
  if (!clicked) { await browser.close(); return; }

  // Poll up to 90s for a new mp3 (network or DOM).
  let found = null;
  for (let i=0;i<90;i++) {
    await page.waitForTimeout(1000);
    // network-captured
    for (const u of seenMp3) { if (!beforeSet.has(u)) { found = u; break; } }
    if (found) break;
    // DOM-captured
    const now = await page.evaluate(() =>
      [...document.querySelectorAll('audio,source')].map(a=>a.src||a.currentSrc).filter(Boolean)
    );
    for (const u of now) { if (!beforeSet.has(u) && /\.mp3/i.test(u)) { found = u; break; } }
    if (found) break;
    if (i%5===0) console.log(`  waiting... ${i}s`);
  }
  console.log('NEW MP3 URL:', found || '(none found in 90s)');
  await page.screenshot({ path: '_generated.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
