// Read-only check: does the TikTok content dashboard show a fresh upload?
// Never uploads anything. Mirrors the CDP-launch from post-tiktok-short.js.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const net = require('net');

const MAIN_USER_DATA = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\tiktokbot-profile';
const CHROME_EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9224;

function isCDPReady() {
  return new Promise((resolve) => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); resolve(true); });
    s.on('error', () => resolve(false));
  });
}

async function ensureChrome() {
  if (await isCDPReady()) { console.log('Chrome already on CDP', CDP_PORT); return null; }
  console.log('Launching Chrome...');
  const proc = spawn(CHROME_EXE, [
    `--user-data-dir=${MAIN_USER_DATA}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
  ], { detached: true, stdio: 'ignore' });
  proc.unref();
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (await isCDPReady()) { console.log('Chrome ready ✓'); return proc; }
  }
  throw new Error('Chrome did not open CDP in time');
}

(async () => {
  await ensureChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = browser.contexts()[0] || await browser.newContext();
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://www.tiktok.com/tiktokstudio/content', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const items = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-e2e*="video-item"], .content-item, a[href*="/video/"]').forEach(el => {
      const href = el.href || el.querySelector?.('a')?.href;
      const text = el.innerText?.slice(0, 120);
      if (href) out.push({ href, text });
    });
    return out.slice(0, 10);
  });
  console.log(JSON.stringify(items, null, 2));
  await browser.close().catch(() => {});
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
