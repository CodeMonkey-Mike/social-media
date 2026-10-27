// Batch Seed Speech generation over CDP for the CURRENTLY-SELECTED voice.
// Usage: node _batch-generate.js <chunks.json> <audioDir> [SCRIPT.md]
//   chunks.json = [{ "file":"chunk-04.mp3", "text":"...TTS-ready text..." }, ...]
// Writes each result to <audioDir>/_manifest.json incrementally: [{file, ok, url, err}].
// Does NOT download — capture URLs, then curl them (cloudfront paths are stable/unsigned).
// SAFETY GATES (both abort BEFORE spending any credits):
//   1. SCRIPT gate — if a SCRIPT.md is passed (3rd arg or HF_SCRIPT env), every chunk's text
//      MUST match the canonical script (verify-tts.js). Added 2026-07-16 after tts-chunks.json
//      was hand-authored from a stale draft and 10 chunks got voiced with wrong text.
//   2. VOICE gate — aborts if the selected voice is not MIKE-CLONE (wrong-voice batches).
const { connect } = require('./_cdp');
const fs = require('fs');

const chunksFile = process.argv[2];
const audioDir = process.argv[3];
const scriptPath = process.argv[4] || process.env.HF_SCRIPT || null;
const EXPECT_VOICE = process.env.HF_VOICE || 'MIKE-CLONE';
const chunks = JSON.parse(fs.readFileSync(chunksFile, 'utf8'));

// GATE 1 — canonical-script match (no browser, no credits until this passes).
if (scriptPath) {
  const { check } = require('./verify-tts');
  const { ok, mismatches } = check(scriptPath, chunks);
  if (!ok) {
    console.error('SCRIPT GATE FAILED — tts-chunks do NOT match ' + scriptPath + ' (no credits spent):');
    for (const m of mismatches) console.error('  chunk ' + m.n + ': ' + m.reason);
    process.exit(3);
  }
  console.log('SCRIPT GATE OK — ' + chunks.length + ' chunks match ' + scriptPath);
} else {
  console.log('WARNING: no SCRIPT.md passed — running WITHOUT the script-match gate. Prefer: node _batch-generate.js <chunks.json> <audioDir> <SCRIPT.md>');
}

// The selected-voice label lives in the LEFT composer panel (2026-10 layout: "Selected Voice" card,
// x<480) — the older layout had it bottom-right (x>820, y>650). History cards (x~500) also print voice
// names, so geometry matters. Card text is lowercase in the DOM (CSS-uppercased) -> compare case-insensitively.
const readVoice = (page) => page.evaluate(() => {
  let fallback = '?';
  for (const e of document.querySelectorAll('*')) {
    const t = (e.innerText || '').trim();
    if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/i.test(t) && e.children.length === 0) {
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (r.left < 480 && r.top < 650) return t.toUpperCase();   // left composer panel = the selected voice
      if (r.left > 820 && r.top > 650) fallback = t.toUpperCase(); // legacy layout
    }
  }
  return fallback;
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

    // 2026-10-17: the Audio page no longer mounts an <audio> element for a fresh generation; the result
    // appears as a NEW History card (LI row, newest on top) and its mp3 only loads when the row's Play is
    // clicked. So: wait for the row count to grow, click the top row's Play, capture the cloudfront mp3.
    const countRows = () => page.evaluate(() => [...document.querySelectorAll('li')].filter(li => { const r = li.getBoundingClientRect(); return r.width > 300 && r.height > 50 && r.height < 130 && li.querySelector('button[aria-label="Play"]'); }).length);
    const rowsBefore = await countRows();
    let url = null;
    for (let i = 0; i < 70; i++) {
      await page.waitForTimeout(1000);
      for (const u of seen) { if (!before.has(u)) { url = u; break; } }
      if (url) break;
      if ((await countRows()) > rowsBefore) {
        await page.waitForTimeout(1500);
        const top = await page.evaluate(() => { const rows = [...document.querySelectorAll('li')].filter(li => { const r = li.getBoundingClientRect(); return r.width > 300 && r.height > 50 && r.height < 130 && li.querySelector('button[aria-label="Play"]'); }).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top); const b = rows[0] && rows[0].querySelector('button[aria-label="Play"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
        if (top) {
          await page.mouse.click(top.x, top.y);
          for (let k = 0; k < 24 && !url; k++) { await page.waitForTimeout(250); for (const u of seen) { if (!before.has(u)) { url = u; break; } } }
          await page.mouse.click(top.x, top.y); // pause
          if (url) break;
        }
      }
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
