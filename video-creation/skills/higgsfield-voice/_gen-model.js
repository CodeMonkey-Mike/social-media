// Generate chunks on a NON-default TTS model of the Audio page (Seed Audio 1.0 / ElevenLabs v3 / ...), one at a time.
// Usage: node _gen-model.js <model name> <chunks.json> <outDir> [voice-details text]
//   chunks.json = [{file, text}]; for Seed Audio 1.0 the text is prefixed with the voice handle (e.g. "@ana-2 ").
//   Captures each result from `higgsfield generate list` (the CLI lists Text-to-Speech jobs with their mp3 URLs) by
//   waiting for a NEW completed job id after each Generate. Writes <outDir>/_manifest.json and downloads the mp3s.
const { connect } = require('./_cdp');
const fs = require('fs'); const { execSync } = require('child_process');
const [model, chunksFile, outDir, details] = process.argv.slice(2);
const chunks = JSON.parse(fs.readFileSync(chunksFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const listTTS = () => { try { const j = JSON.parse(execSync('higgsfield generate list --json', { encoding: 'utf8' })); const arr = Array.isArray(j) ? j : (j.items || j.jobs || []); return arr.filter(x => /speech|audio|tts|voice/i.test(JSON.stringify([x.job_type, x.display_name, x.model]))); /* TTS V2, Seed Audio 1.0, ElevenLabs vN */ } catch (e) { return null; } };
const isVis = `(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>4&&r.height>4&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0&&r.bottom>0&&r.top<innerHeight;}`;
(async () => {
  const { browser, page } = await connect();
  // 1. pick the model if not already shown in the left panel
  const shown = await page.evaluate(([m, v]) => { const isVis = eval(v); return [...document.querySelectorAll('*')].some(e => (e.innerText||'').trim()===m && e.children.length===0 && isVis(e) && e.getBoundingClientRect().left < 620); }, [model, isVis]);
  if (!shown) {
    await page.evaluate((v) => { const isVis = eval(v); for (const e of document.querySelectorAll('*')) { if ((e.innerText||'').trim()==='Model' && isVis(e) && e.children.length===0) { let el=e; for (let h=0;h<5&&el;h++){ const s=getComputedStyle(el); if (el.tagName==='BUTTON'||el.getAttribute('role')==='button'||s.cursor==='pointer'){ el.click(); return; } el=el.parentElement; } e.click(); return; } } }, isVis);
    await page.waitForTimeout(2000);
    const box = await page.evaluate(([t, v]) => { const isVis = eval(v); for (const e of document.querySelectorAll('*')) { if ((e.innerText||'').trim()!==t || e.children.length>1 || !isVis(e)) continue; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; } return null; }, [model, isVis]);
    if (!box) { console.error('MODEL NOT FOUND', model); process.exit(2); }
    await page.mouse.click(box.x, box.y); await page.waitForTimeout(2500);
  }
  console.log('model:', model);
  const manifest = [];
  for (const c of chunks) {
    // Script box = the contenteditable; "Voice details" (Seed Audio 1.0) = the only textarea.
    const ce = await page.$('[contenteditable="true"]'); if (!ce) { console.error('no script box'); process.exit(3); }
    await ce.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Delete'); await page.keyboard.type(c.text, { delay: 6 }); await page.waitForTimeout(300);
    const ta = await page.$('textarea');
    if (details && ta) { await ta.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Delete'); await page.keyboard.type(details, { delay: 4 }); await page.waitForTimeout(300); }
    const typed = await page.evaluate(() => ({ script: (document.querySelector('[contenteditable="true"]')||{}).innerText, details: (document.querySelector('textarea')||{}).value }));
    console.log('typed:', JSON.stringify(typed).slice(0, 160));
    const before = (listTTS() || []).map(x => x.id);
    const clicked = await page.evaluate(() => { const cs=[...document.querySelectorAll('button')].filter(e => /^GENERATE/i.test((e.innerText||'').trim())); const v=cs.map(e=>({e,r:e.getBoundingClientRect()})).filter(o=>o.r.width>30).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height)); if(!v.length) return false; v[0].e.click(); return true; });
    if (!clicked) { manifest.push({ file: c.file, ok: false, err: 'no-generate-btn' }); continue; }
    let job = null;
    for (let i = 0; i < 90 && !job; i++) { await page.waitForTimeout(2000); const now = listTTS() || []; job = now.find(x => !before.includes(x.id) && /completed/i.test(x.status || '') && x.result_url); }
    if (!job) { manifest.push({ file: c.file, ok: false, err: 'timeout' }); console.log('FAIL', c.file); continue; }
    execSync(`curl -s -o "${outDir}/${c.file}" "${job.result_url}"`);
    manifest.push({ file: c.file, ok: true, url: job.result_url, id: job.id }); console.log('OK  ', c.file, job.result_url);
    fs.writeFileSync(outDir + '/_manifest.json', JSON.stringify(manifest, null, 1));
    await page.waitForTimeout(800);
  }
  await browser.close(); console.log('DONE', manifest.filter(m => m.ok).length + '/' + chunks.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
