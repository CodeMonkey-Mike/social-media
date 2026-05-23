const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');

const CDP_PORT   = 9223;
const CHROME_EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const POST_URL   = 'https://www.youtube.com/post/UgkxWHH2yWqqoDidgieI83aMXwo71H9a6-gz';
const YT_JSON    = path.join(__dirname, '..', 'data', 'yt-posts.json');
const POST_ID    = 'yt-post-2026-05-15-ai-mania-compressed-kaspa-window';

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

  await page.goto(POST_URL);
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    let bodyText = '';
    for (const sel of ['#post-text yt-formatted-string', '#post-text', 'yt-formatted-string#content']) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.length > 20) { bodyText = el.innerText; break; }
    }
    const imageCount = document.querySelectorAll(
      'ytd-backstage-image-renderer img, #post-multi-image-attachment img, #post-image-attachment img'
    ).length;
    return { bodySnippet: bodyText.slice(0, 120), imageCount };
  });

  console.log('Body snippet:', info.bodySnippet);
  console.log('Images found:', info.imageCount);

  const bodyOk  = info.bodySnippet.includes("dot-com mania didn't start");
  const imageOk = info.imageCount >= 5;
  console.log('Body match:', bodyOk ? '✓' : '✗');
  console.log('Images OK:', imageOk ? `✓ (${info.imageCount})` : `✗ (${info.imageCount})`);

  if (bodyOk) {
    const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
    const post = data.posts.find(p => p.id === POST_ID);
    post.status    = 'posted';
    post.posted_at = new Date().toISOString();
    post.post_url  = POST_URL;
    delete post.error;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.log('\nJSON updated ✓');
  } else {
    console.log('\nBody mismatch — JSON NOT updated. Check the post manually.');
  }

  await browser.close();
  process.exit(0);
})();
