const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  await page.waitForTimeout(600);
  // MIKE-CLONE card container is the DIV at ~ x306,y374,w209,h170. Click its body (above title, below top icons).
  const card = await page.evaluate(() => {
    for (const e of document.querySelectorAll('div')) {
      const t = (e.innerText||'').trim();
      const r = e.getBoundingClientRect();
      if (t === 'MIKE-CLONE' && Math.abs(r.height-170) < 6 && r.width > 180 && r.top > 200) {
        return { x:r.left, y:r.top, w:r.width, h:r.height };
      }
    }
    return null;
  });
  if (!card) { console.log('card not found'); await browser.close(); return; }
  const cx = card.x + card.w*0.45;   // center-left to dodge the "..." menu (top-right)
  const cy = card.y + card.h*0.30;   // upper body, above title, below top icon row
  console.log('clicking card at', Math.round(cx), Math.round(cy));
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(1800);
  const label = await page.evaluate(() => {
    const cands = [];
    for (const e of document.querySelectorAll('*')) {
      const t=(e.innerText||'').trim();
      if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/.test(t) && e.children.length===0) {
        const r=e.getBoundingClientRect();
        if (r.left>820 && r.top>650) cands.push({t, x:Math.round(r.left), y:Math.round(r.top)});
      }
    }
    return cands;
  });
  console.log('BOTTOM-RIGHT VOICE PRESET LABEL:', JSON.stringify(label));
  await page.screenshot({ path: '_selected.png' });
  console.log('saved _selected.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
