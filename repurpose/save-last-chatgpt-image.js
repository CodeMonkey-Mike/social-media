// Opens the ChatGPT chat, grabs the last generated image, saves it, updates tweets.json.
//
// Usage: node save-last-chatgpt-image.js
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const IMAGES_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL    = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const TWEETS_JSON = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');

const NEW_UUID = 'b3a7f2c4';
const NEW_SLUG = 'bobo-cmc-inflated-mcap-shocked';
const HOOK_SNIPPET = 'CoinMarketCap is showing $BOBO at a $2.7B market cap';

const TARGET_PATH = path.join(IMAGES_DIR, 'x', `x-tweets-${NEW_UUID}-${NEW_SLUG}.png`);

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(destPath);
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function updateTweetJson() {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t =>
    t.status === 'pending' && (t.tweet || t.hook || '').includes(HOOK_SNIPPET)
  );
  if (!tweet) { console.log('  ⚠ Tweet not found in JSON'); return; }
  tweet.image_id   = NEW_UUID;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${NEW_UUID}-${NEW_SLUG}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ tweets.json updated → image_id: ${NEW_UUID}`);
}

async function main() {
  console.log('\nOpening chat to grab last generated image...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });

  const page = await browser.newPage();
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(4000);

  // Scroll to bottom so last message is visible/loaded
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Find all generated images (ChatGPT wraps them in <img> with oaiusercontent or estuary URLs)
  const imgUrl = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const candidates = imgs
      .map(img => img.src)
      .filter(src =>
        src.includes('oaiusercontent') ||
        src.includes('estuary') ||
        src.includes('openai')
      );
    return candidates[candidates.length - 1] || null;
  });

  await browser.close();

  if (!imgUrl) {
    console.error('✗ No generated image found in the chat. Make sure the image is visible before running.');
    process.exit(1);
  }

  console.log(`  Found image URL: ${imgUrl.slice(0, 80)}...`);
  console.log(`  Downloading → ${path.basename(TARGET_PATH)}`);

  await downloadUrl(imgUrl, TARGET_PATH);
  const size = fs.statSync(TARGET_PATH).size;
  console.log(`  Saved: ${(size / 1024).toFixed(0)} KB`);

  updateTweetJson();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
