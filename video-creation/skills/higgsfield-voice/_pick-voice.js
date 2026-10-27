// Open the Selected Voice / Voice Preset picker (either label) and click the custom preset card by exact text.
// Usage: node _pick-voice.js "yuli-1"
const { connect } = require('./_cdp');
(async () => {
  const { browser, page } = await connect();
  const target = (process.argv[2] || '').toLowerCase();
  const isVis = `(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>4&&r.height>4&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0&&r.bottom>0&&r.top<innerHeight;}`;
  // 1. open the picker: prefer the "Change" button on the Selected Voice card, else any "Voice Preset"/"Selected Voice" text
  let opened = await page.evaluate((isVisSrc) => {
    const isVis = eval(isVisSrc);
    const btn = [...document.querySelectorAll('button')].find(b => /^change$/i.test((b.innerText||'').trim()) && isVis(b));
    if (btn) { btn.click(); return 'change-btn'; }
    const el = [...document.querySelectorAll('*')].find(e => /^(selected voice|voice preset)$/i.test((e.innerText||'').trim()) && isVis(e));
    if (el) { el.click(); return 'label'; }
    return null;
  }, isVis);
  console.log('opened via', opened);
  await page.waitForTimeout(2500);
  // 2. list visible leaf texts (so we can see what presets exist)
  const leafs = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); const out=[]; for (const e of document.querySelectorAll('*')) { const t=(e.innerText||'').trim(); if (t && t.length<30 && e.children.length===0 && isVis(e)) out.push(t);} return [...new Set(out)]; }, isVis);
  console.log('VISIBLE:', leafs.slice(0, 120).join(' | '));
  if (!target) { await page.screenshot({ path: '_pick.png' }); await browser.close(); return; }
  // 3. click the card whose exact text == target
  // Candidates with that exact text also appear in the LEFT composer panel (the selected voice, x<480) and in the
  // History column (x~500, a card per past generation) -> take the one inside the picker MODAL: the right-most /
  // largest-x candidate (the modal is centered and its cards sit right of the history column).
  const box = await page.evaluate(([t, isVisSrc]) => { const isVis = eval(isVisSrc); const c=[]; for (const e of document.querySelectorAll('*')) { if ((e.textContent||'').trim().toLowerCase()!==t) continue; if (!isVis(e)) continue; const r=e.getBoundingClientRect(); c.push({x:r.left+r.width/2,y:r.top+r.height/2}); } c.sort((a,b)=>b.x-a.x); console.log('cands', JSON.stringify(c)); return c[0] || null; }, [target, isVis]);
  if (!box) { console.log('CARD NOT FOUND for', target); await page.screenshot({ path: '_pick.png' }); await browser.close(); process.exit(2); }
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(2000);
  const sel = await page.evaluate((isVisSrc) => { const isVis = eval(isVisSrc); const out=[]; for (const e of document.querySelectorAll('*')) { const t=(e.innerText||'').trim(); if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/i.test(t) && e.children.length===0 && isVis(e)) { const r=e.getBoundingClientRect(); out.push(t+'@'+Math.round(r.left)+','+Math.round(r.top)); } } return out; }, isVis);
  console.log('CLICKED', target, '-> visible voice labels now:', sel.join(' | '));
  await page.screenshot({ path: '_pick.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
