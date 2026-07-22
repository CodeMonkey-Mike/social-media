// probe-first-prompts.js — READ-ONLY: fetch each candidate conversation's first user
// prompts so provenance is judged on CONTENT, not sidebar title (titles misclassify:
// Mike's manual thumbnail chats and pipeline b-roll chats get similar auto-titles,
// 2026-07-22). Prints the first 2 user messages (trimmed) per chat id.
//
// Usage: node repurpose/probe-first-prompts.js --ids=<file with one chat id per line> [--json=<out>]
const fs = require('fs');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const A = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true];
}));
if (!A.ids) { console.error('need --ids=<file>'); process.exit(1); }
const IDS = fs.readFileSync(A.ids, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('a[href^="/c/"], #prompt-textarea', { timeout: 30000 });

    const results = [];
    for (const id of IDS) {
      const r = await page.evaluate(async (cid) => {
        const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.json());
        const resp = await fetch('/backend-api/conversation/' + cid, {
          credentials: 'include', headers: { Authorization: 'Bearer ' + s.accessToken },
        });
        if (!resp.ok) return { id: cid, error: 'HTTP ' + resp.status };
        const j = await resp.json();
        // walk mapping in chronological order, take user-authored text parts
        const nodes = Object.values(j.mapping || {})
          .filter(n => n.message && n.message.author && n.message.author.role === 'user')
          .sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0));
        const prompts = nodes.slice(0, 2).map(n => {
          const parts = (n.message.content && n.message.content.parts) || [];
          return parts.filter(p => typeof p === 'string').join(' ').replace(/\s+/g, ' ').slice(0, 280);
        });
        return { id: cid, title: j.title, user_messages: nodes.length, prompts };
      }, id);
      results.push(r);
      if (r.error) console.log(`\n### ${id}\n  ERROR ${r.error}`);
      else {
        console.log(`\n### ${r.title}  (${id.slice(0, 8)}…, ${r.user_messages} user msgs)`);
        r.prompts.forEach((p, i) => console.log(`  [${i + 1}] ${p || '(image/file-only message)'}`));
      }
      await page.waitForTimeout(400); // gentle pacing
    }
    if (A.json) fs.writeFileSync(A.json, JSON.stringify(results, null, 2) + '\n');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
