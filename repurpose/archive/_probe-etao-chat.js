// _probe-etao-chat.js — READ-ONLY probe of a b-roll pool chat.
// Recovers an image that finished server-side but was never captured by a killed generator run,
// and reports the EXACT prompts that were actually sent (so a leftover-composer-draft corruption
// is visible). It NEVER types, NEVER sends, NEVER clicks send. Usage:
//   node _probe-etao-chat.js <conversationUrlOrId> [outDir]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const arg = process.argv[2];
const OUT = process.argv[3] || null;
const convId = (arg.match(/\/c\/([0-9a-f-]+)/i) || [null, arg])[1];

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  await page.goto('https://chatgpt.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(4000);

  const data = await page.evaluate(async (id) => {
    const s = await (await fetch('/api/auth/session')).json();
    const tok = s.accessToken;
    const r = await fetch('/backend-api/conversation/' + id, { headers: { Authorization: 'Bearer ' + tok } });
    if (!r.ok) return { error: r.status + ' ' + (await r.text()).slice(0, 200) };
    const j = await r.json();
    const out = [];
    for (const k of Object.keys(j.mapping || {})) {
      const n = j.mapping[k];
      const m = n && n.message;
      if (!m) continue;
      const role = m.author && m.author.role;
      const parts = (m.content && m.content.parts) || [];
      const text = parts.filter(p => typeof p === 'string').join(' ');
      const assets = [];
      for (const p of parts) {
        if (p && typeof p === 'object' && p.asset_pointer) assets.push(String(p.asset_pointer).replace(/^.*file[-_]/, 'file-'));
      }
      for (const a of (m.metadata && m.metadata.attachments) || []) assets.push(a.id);
      out.push({ ct: m.create_time || 0, role, len: text.length, text: text.slice(0, 260), assets });
    }
    out.sort((a, b) => (a.ct || 0) - (b.ct || 0));
    return { title: j.title, n: out.length, msgs: out, token: tok };
  }, convId);

  if (data.error) { console.log('API ERROR', data.error); await browser.close(); return; }
  console.log('conversation:', data.title, '| messages:', data.n, '\n');
  for (const m of data.msgs) {
    const ts = m.ct ? new Date(m.ct * 1000).toISOString().replace('T', ' ').slice(0, 19) : '?';
    console.log(`[${ts}] ${m.role} len=${m.len} assets=${JSON.stringify(m.assets)}`);
    if (m.role === 'user') console.log('    PROMPT: ' + m.text.replace(/\s+/g, ' '));
  }

  // download any assistant images if an out dir was given (names by index; caller renames)
  if (OUT) {
    fs.mkdirSync(OUT, { recursive: true });
    const imgs = [];
    for (const m of data.msgs) if (m.role === 'assistant') for (const a of m.assets) imgs.push(a);
    console.log('\nassistant image assets (chronological):', imgs.length);
    let i = 0;
    for (const fid of imgs) {
      i++;
      const url = await page.evaluate(async ([id, tok]) => {
        const r = await fetch('/backend-api/files/' + id + '/download', { headers: { Authorization: 'Bearer ' + tok } });
        if (!r.ok) return null;
        const j = await r.json();
        return j.download_url || null;
      }, [fid, data.token]);
      if (!url) { console.log(`  ${i} ${fid}: no download url`); continue; }
      const resp = await page.request.get(url);
      const buf = await resp.body();
      const out = path.join(OUT, `probe-${String(i).padStart(2, '0')}-${fid}.png`);
      fs.writeFileSync(out, buf);
      console.log(`  ${i} ${fid} -> ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
