// Open the Audio page's Model selector and dump the model names + any per-model controls. Read-only.
const { connect } = require('./_cdp');
const { cachePath } = require('../cache-path');  // shared tool cache: video-creation/cache/<tool>/
(async () => {
  const { browser, page } = await connect();
  if (!page.url().includes('/audio')) { await page.goto('https://higgsfield.ai/audio', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000); }
  const isVis = `(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>4&&r.height>4&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0&&r.bottom>0&&r.top<innerHeight;}`;
  const clicked = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); for (const e of document.querySelectorAll('*')) { if ((e.innerText||'').trim() === 'Model' && isVis(e) && e.children.length === 0) { let el = e; for (let h=0; h<5 && el; h++) { const s = getComputedStyle(el); if (el.tagName==='BUTTON' || el.getAttribute('role')==='button' || s.cursor==='pointer') { el.click(); return el.tagName; } el = el.parentElement; } e.click(); return 'leaf'; } } return null; }, isVis);
  console.log('clicked Model via', clicked);
  await page.waitForTimeout(2000);
  const leafs = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); const out=[]; for (const e of document.querySelectorAll('*')) { const t=(e.innerText||'').trim(); if (t && t.length<60 && e.children.length===0 && isVis(e)) out.push(t);} return [...new Set(out)]; }, isVis);
  console.log('VISIBLE:', leafs.join(' | '));
  await page.screenshot({ path: cachePath('higgsfield-voice', 'shots', '_models.png') });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
