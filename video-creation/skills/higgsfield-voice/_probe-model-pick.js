// Pick a TTS model in the (already open or reopened) Model selector and dump the composer state: selected voice,
// visible controls (speed / emotion / stability...). Read-only, no generation. Usage: node _probe-model-pick.js "Seed Audio 1.0"
const { connect } = require('./_cdp');
const { cachePath } = require('../cache-path');  // shared tool cache: video-creation/cache/<tool>/
(async () => {
  const { browser, page } = await connect();
  const name = process.argv[2];
  const isVis = `(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>4&&r.height>4&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0&&r.bottom>0&&r.top<innerHeight;}`;
  const open = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); return [...document.querySelectorAll('*')].some(e => (e.innerText||'').trim()==='Featured models' && isVis(e)); }, isVis);
  if (!open) {
    await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); for (const e of document.querySelectorAll('*')) { if ((e.innerText||'').trim() === 'Model' && isVis(e) && e.children.length === 0) { let el=e; for (let h=0; h<5 && el; h++){ const s=getComputedStyle(el); if (el.tagName==='BUTTON'||el.getAttribute('role')==='button'||s.cursor==='pointer'){ el.click(); return; } el=el.parentElement; } e.click(); return; } } }, isVis);
    await page.waitForTimeout(2000);
  }
  const box = await page.evaluate(([t, isVisSrc]) => { const isVis = eval(isVisSrc); const c=[]; for (const e of document.querySelectorAll('*')) { if ((e.innerText||'').trim()!==t || e.children.length>1) continue; if (!isVis(e)) continue; const r=e.getBoundingClientRect(); c.push({x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}); } return c[0]||null; }, [name, isVis]);
  if (!box) { console.log('MODEL NOT FOUND', name); await browser.close(); process.exit(2); }
  await page.mouse.click(box.x, box.y); await page.waitForTimeout(2500);
  const state = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); const out=[]; for (const e of document.querySelectorAll('*')) { const t=(e.innerText||'').trim(); if (t && t.length<40 && e.children.length===0 && isVis(e)) { const r=e.getBoundingClientRect(); if (r.left < 620) out.push(t); } } const sl=[...document.querySelectorAll('input[type=range],[role=slider]')].map(s=>s.getAttribute('aria-label')||s.getAttribute('aria-valuenow')||s.name||'slider'); return {left: [...new Set(out)], sliders: sl}; }, isVis);
  console.log('AFTER picking', name, '-> left panel:', state.left.join(' | '));
  console.log('sliders:', JSON.stringify(state.sliders));
  await page.screenshot({ path: cachePath('higgsfield-voice', 'shots', '_model-' + name.replace(/[^a-z0-9]+/gi,'-') + '.png') });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
