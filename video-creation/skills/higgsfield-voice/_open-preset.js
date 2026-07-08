const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  await page.waitForTimeout(1000);
  // Find a VISIBLE element whose text mentions Voice Preset / Selected Voice, click its clickable ancestor.
  const clicked = await page.evaluate(() => {
    const isVis = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 10 && r.height > 10 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const cands = [...document.querySelectorAll('*')].filter(e => {
      const t = (e.innerText||'').trim().toLowerCase();
      return (t.includes('voice preset') || t.includes('selected voice')) && isVis(e) && t.length < 60;
    });
    if (!cands.length) return null;
    // smallest visible candidate = the panel; walk up to a button/clickable
    cands.sort((a,b)=> (a.getBoundingClientRect().width*a.getBoundingClientRect().height) - (b.getBoundingClientRect().width*b.getBoundingClientRect().height));
    let el = cands[0];
    let hop = 0;
    while (el && hop < 6) {
      const s = getComputedStyle(el);
      if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || s.cursor === 'pointer') break;
      el = el.parentElement; hop++;
    }
    const r = (el||cands[0]).getBoundingClientRect();
    return { x: r.x + r.width/2, y: r.y + r.height/2, tag: (el||cands[0]).tagName };
  });
  console.log('CLICK TARGET:', JSON.stringify(clicked));
  if (clicked) {
    await page.mouse.click(clicked.x, clicked.y);
    await page.waitForTimeout(2500);
  }
  console.log('URL:', page.url());
  const texts = await page.$$eval('*', els => {
    const out = [];
    for (const e of els) {
      const t = (e.innerText||'').trim();
      if (t && t.length>0 && t.length<40 && e.children.length===0) out.push(t);
    }
    return [...new Set(out)];
  });
  console.log('LEAF TEXTS:', texts.slice(0,150).join(' | '));
  await page.screenshot({ path: '_preset.png' });
  console.log('saved _preset.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
