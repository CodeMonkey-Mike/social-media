const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CDP_PORT    = 9223;
const CHROME_EXE  = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE     = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const POSTS_URL   = 'https://www.youtube.com/@CodeMonkeyMike/posts';

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 500);
  });
}

(async () => {
  if (!await isCDPReady()) {
    spawn(CHROME_EXE, [
      `--user-data-dir=${PROFILE}`,
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run', 'about:blank',
    ], { stdio: 'ignore' });
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isCDPReady()) break;
    }
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx  = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  await page.goto(POSTS_URL);
  await page.waitForTimeout(4000);

  const urls = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href*="/post/"]')]
      .map(a => a.href.replace(/[?#].*$/, '')))]
      .slice(0, 8)
  );

  console.log('Most recent posts on @CodeMonkeyMike/posts:');
  urls.forEach((u, i) => console.log(`  ${i + 1}.`, u));

  await browser.close();
  process.exit(0);
})();
