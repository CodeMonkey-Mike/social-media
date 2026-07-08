// Batch Seed Speech generation over CDP for the CURRENTLY-SELECTED voice.
// Usage: node _batch-generate.js <chunks.json> <audioDir>
//   chunks.json = [{ "file":"chunk-04.mp3", "text":"...TTS-ready text..." }, ...]
// Writes each result to <audioDir>/_manifest.json incrementally: [{file, ok, url, err}].
// Does NOT download — capture URLs, then curl them (cloudfront paths are stable/unsigned).
// SAFETY: aborts if the selected voice is not MIKE-CLONE (guard against wrong-voice batches).
const { connect } = require('./_cdp');
const fs = require('fs');

const chunksFile = process.argv[2];
const audioDir = process.argv[3];
const EXPECT_VOICE = process.env.HF_VOICE || 'MIKE-CLONE';
const chunks = JSON.parse(fs.readFileSync(chunksFile, 'utf8'));

const readVoice = (page) => page.evaluate(() => {
  for (const e of document.querySelectorAll('*')) {
    const t = (e.innerText || '').trim();
    if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/.test(t) && e.children.length === 0) {
      const r = e.getBoundingClientRect();
      if (r.left > 820 && r.top > 650) return t;
    }
  }
  return '?';
});

(async () => {
  const { browser, page } = await connect();
  await page.waitForTimeout(500);

  const voice = await readVoice(page);
  console.log('VOICE:', voice);
  if (voice !== EXPECT_VOICE) { console.error('WRONG VOICE — aborting'); await browser.close(); process.exit(2); }

  const seen = new Set();
  page.on('response', (r) => { const u = r.url(); if (/\.mp3(\?|$)/i.test(u)) seen.add(u); });
  (await page.evaluate(() => [...document.querySelectorAll('audio,source')].map(a => a.src || a.currentSrc).filter(Boolean)))
    .forEach(u => { if (/\.mp3/i.test(u)) seen.add(u); });

  const manifest = [];
  for (const c of chunks) {
    // fill prompt
    let h = await page.$('textarea'); if (!h) h = await page.$('[contenteditable="true"]');
    await h.click(); await page.waitForTimeout(150);
    await page.keyboard.press('Control+A'); await page.keyboard.press('Delete'); await page.waitForTimeout(120);
    await page.keyboard.type(c.text, { delay: 8 }); await page.waitForTimeout(300);

    const before = new Set(seen);
    const clicked = await page.evaluate(() => {
      const cs = [...document.querySelectorAll('button')].filter(e => /^GENERATE/i.test((e.innerText || '').trim()));
      const v = cs.map(e => ({ e, r: e.getBoundingClientRect() })).filter(o => o.r.width > 30 && o.r.height > 20)
                  .sort((a, b) => (b.r.width * b.r.height) - (a.r.width * a.r.height));
      if (!v.length) return false; v[0].e.click(); return true;
    });
    if (!clicked) { manifest.push({ file: c.file, ok: false, err: 'no-generate-btn' }); fs.writeFileSync(audioDir + '/_manifest.json', JSON.stringify(manifest, null, 1)); continue; }

    let url = null;
    for (let i = 0; i < 70; i++) {
      await page.waitForTimeout(1000);
      // network-captured
      for (const u of seen) { if (!before.has(u)) { url = u; break; } }
      if (url) break;
      // DOM fallback (the reliable path — the generated <audio> src)
      const now = await page.evaluate(() => [...document.querySelectorAll('audio,source')].map(a => a.src || a.currentSrc).filter(Boolean));
      for (const u of now) { if (/\.mp3/i.test(u) && !before.has(u)) { url = u; break; } }
      if (url) break;
    }
    if (!url) { manifest.push({ file: c.file, ok: false, err: 'timeout' }); }
    else { seen.add(url); manifest.push({ file: c.file, ok: true, url }); }
    console.log((url ? 'OK  ' : 'FAIL') + ' ' + c.file + (url ? ' ' + url : ''));
    fs.writeFileSync(audioDir + '/_manifest.json', JSON.stringify(manifest, null, 1));
    await page.waitForTimeout(700);
  }
  await browser.close();
  console.log('DONE ' + manifest.filter(m => m.ok).length + '/' + chunks.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
