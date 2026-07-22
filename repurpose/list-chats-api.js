// list-chats-api.js — READ-ONLY conversation inventory via ChatGPT's own backend API.
//
// Why not a sidebar DOM scrape: the sidebar hides archived/is_visible:false chats
// and its lazy-load is flaky, so a DOM scrape and the registry can disagree wildly
// (2026-07-22: 182 sidebar chats, 0 of the 14 registry chats among them). The
// /backend-api/conversations endpoint is what the UI itself pages the sidebar from,
// and it can also return the archived set — the ground truth.
//
// Deletes NOTHING, writes only the --json report.
//
// Usage: node repurpose/list-chats-api.js [--json=<out.json>]
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const REG = path.join(__dirname, '..', 'chatgpt-image-chats.json');

const A = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true];
}));

const chatId = (url) => (String(url).match(/\/c\/([a-z0-9-]+)/i) || [])[1] || null;

async function main() {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  const known = new Map();
  for (const c of reg.chats) known.set(chatId(c.url), { purpose: c.purpose, where: 'active' });
  for (const c of reg.retired) known.set(chatId(c.url), { purpose: c.purpose, where: 'retired' });

  const { chromium } = require('playwright');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('a[href^="/c/"], #prompt-textarea', { timeout: 30000 });

    // Page through the same endpoint the sidebar uses; then the archived set.
    const fetchAll = (archived) => page.evaluate(async (isArch) => {
      const s = await fetch('/api/auth/session', { credentials: 'include' }).then(r => r.json());
      const H = { Authorization: 'Bearer ' + s.accessToken };
      const out = [];
      for (let offset = 0; ; offset += 100) {
        const u = `/backend-api/conversations?offset=${offset}&limit=100&order=updated` +
                  (isArch ? '&is_archived=true' : '');
        const r = await fetch(u, { credentials: 'include', headers: H });
        if (!r.ok) return { error: `${u} -> HTTP ${r.status}`, items: out };
        const j = await r.json();
        out.push(...j.items.map(it => ({
          id: it.id, title: it.title, create_time: it.create_time, update_time: it.update_time,
          is_archived: !!it.is_archived, workspace_id: it.workspace_id || null,
        })));
        if (out.length >= (j.total ?? 0) || j.items.length === 0) return { total: j.total, items: out };
      }
    }, archived);

    const active = await fetchAll(false);
    const archived = await fetchAll(true);
    if (active.error) console.error('WARNING:', active.error);
    if (archived.error) console.error('WARNING:', archived.error);

    const byId = new Map();
    for (const it of active.items) byId.set(it.id, { ...it, bucket: it.is_archived ? 'archived' : 'visible' });
    for (const it of archived.items) if (!byId.has(it.id)) byId.set(it.id, { ...it, bucket: 'archived' });

    const chats = [...byId.values()].map(c => ({
      ...c,
      url: `https://chatgpt.com/c/${c.id}`,
      registered: known.get(c.id) ? known.get(c.id).where : null,
      purpose: known.get(c.id) ? known.get(c.id).purpose : null,
    })).sort((a, b) => String(b.update_time).localeCompare(String(a.update_time)));

    const vis = chats.filter(c => c.bucket === 'visible').length;
    console.log(`\nConversations: ${chats.length}  (visible: ${vis}, archived: ${chats.length - vis})`);
    console.log(`Registry matches: ${chats.filter(c => c.registered).length} of ${known.size}\n`);
    for (const c of chats.slice(0, 40)) {
      const tag = c.registered ? `[${c.registered}: ${c.purpose}]` : '';
      console.log(`  ${(c.title || '(untitled)').slice(0, 45).padEnd(46)} ${c.bucket.padEnd(9)} ${String(c.update_time).slice(0, 10)}  ${tag}`);
    }
    if (chats.length > 40) console.log(`  ... ${chats.length - 40} more (see --json)`);

    if (A.json) {
      fs.writeFileSync(A.json, JSON.stringify({ scanned_at: new Date().toISOString(), chats }, null, 2) + '\n');
      console.log(`\nWrote ${A.json}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
