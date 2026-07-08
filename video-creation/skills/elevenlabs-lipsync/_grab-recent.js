// Download the top-N most-recent rendered videos from ElevenLabs History to /tmp/cand-*.mp4
// so we can transcribe and pick the right one (handles duplicate same-model renders).
// Usage: node _grab-recent.js [N=5]
const { chromium } = require('playwright');
const fs = require('fs');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
const N = parseInt(process.argv[2] || '5', 10);
(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null, acceptDownloads: true,
  });
  const page = await browser.newPage();
  await page.goto('https://elevenlabs.io/app/image-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  // Go to the Assets section (left sidebar) which lists all generated renders
  for (const mk of [() => page.getByRole('link', { name: 'Assets', exact: true }),
                    () => page.getByText('Assets', { exact: true })]) {
    const t = mk().first();
    if (await t.isVisible().catch(() => false)) { await t.click().catch(() => {}); await page.waitForTimeout(3500); break; }
  }
  await page.waitForTimeout(1500);
  // scroll to load
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 1000); await page.waitForTimeout(800); }
  await page.screenshot({ path: 'el-assets.png' });
  console.log('after Assets nav URL:', page.url());
  // collect video srcs in DOM order (newest first), dedup
  const srcs = await page.evaluate((n) => {
    const out = []; const seen = new Set();
    for (const v of document.querySelectorAll('video')) {
      const u = v.currentSrc || v.src || '';
      if (/storage\.googleapis\.com.*xi-backend/.test(u) && !seen.has(u)) { seen.add(u); out.push(u); }
      if (out.length >= n) break;
    }
    return out;
  }, N);
  console.log('found', srcs.length, 'videos');
  for (let i = 0; i < srcs.length; i++) {
    const buf = await page.evaluate(async (u) => Array.from(new Uint8Array(await (await fetch(u)).arrayBuffer())), srcs[i]);
    const f = `C:\\Users\\mnede\\AppData\\Local\\Temp\\cand-${i}.mp4`;
    fs.writeFileSync(f, Buffer.from(buf));
    console.log(`cand-${i}: ${fs.statSync(f).size} bytes`);
  }
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
