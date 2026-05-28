// gen-v34-assets.js — ALL new assets for videos 3 & 4 in ONE Chrome session.
// Reuses generate-broll-batch.js logic. chatgpt-profile. Output -> assets/v34/.
// 3 b-roll (v3) + 5 b-roll (v4) + 2 coin overlays (glow-on-black -> alpha later).

const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT_URL          = 'https://chatgpt.com/c/6a0deddf-1bac-83ea-8107-0e419a2c44ac';
const IMAGE_URL_PATTERN = 'estuary/content';
const MIN_GEN_DELAY_MS  = 10000;
const MAX_WAIT_MS       = 5 * 60 * 1000;
const ASSETS_DIR        = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation\\assets\\v34';
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

const ON_BLACK = ' Centered, brightly glowing and fully opaque, on a PURE SOLID BLACK (#000000) background and NOTHING else — no checkerboard, no gradient, no other objects, no text. Fills most of the frame.';

const IMAGES = [
  // ── Video 3 b-roll ──
  { file: 'v3-hook-btc-vs-kaspa.png',
    prompt: 'Cinematic vertical 9:16. A dramatic face-off: LEFT a large DIM, cracked, dated orange Bitcoin coin with faded glow; RIGHT a vivid glowing teal Kaspa coin with embossed "K", modern and powerful. A bright glowing vertical seam divides them. Dark dramatic background, cinematic lighting, 8K photorealistic. No text.' },
  { file: 'v3-bitcoin-dim.png',
    prompt: 'Cinematic vertical 9:16. A large orange Bitcoin coin looking dim, dated and cracked, faded glow, dark moody background. Photorealistic, 8K. No text.' },
  { file: 'v3-kaspa-flexing.png',
    prompt: 'Cinematic vertical 9:16. A glowing teal Kaspa coin with embossed "K" radiating power, surrounded by an energetic teal aura and upward energy bursts, dark background, dramatic, 8K. No text.' },
  // ── Video 4 b-roll ──
  { file: 'v4-hook-eth-flips-btc.png',
    prompt: 'Cinematic vertical 9:16. A glowing purple Ethereum diamond-coin rising ABOVE and overtaking a fading orange Bitcoin coin (a flip / changing of the guard), dramatic dark background with motion energy, 8K photorealistic. No text.' },
  { file: 'v4-maxi-mirror.png',
    prompt: 'Cinematic vertical 9:16. A conflicted male crypto investor looking into a mirror with a worried, doubtful expression, an orange bitcoin glow around him, dark dramatic moody cinematic lighting, 8K photorealistic. No text.' },
  { file: 'v4-kaspa-candidate.png',
    prompt: 'Cinematic vertical 9:16. A glowing teal Kaspa coin rising on a pedestal of light like "the chosen one", radiant teal beams, dark epic background, 8K photorealistic 3D. No text.' },
  { file: 'v4-ai-expansion.png',
    prompt: 'Cinematic vertical 9:16. A glowing futuristic city and economy expanding with AI neural-network light grids and upward energy, a massive AI-induced economic boom, teal and gold light, dark background, 8K. No text.' },
  { file: 'v4-kaspa-number-one.png',
    prompt: 'Cinematic vertical 9:16. A glowing teal Kaspa coin standing victorious on the #1 top step of a glowing podium, high above smaller faded purple Ethereum and orange Bitcoin coins on lower steps. Dark dramatic background, epic, 8K photorealistic. No text.' },
  // ── Transparent coin overlays (glow-on-black -> alpha later) ──
  { file: 'ov-eth-coin.png',  prompt: 'A glowing purple Ethereum coin showing the Ethereum diamond logo, glossy 3D, strong purple glow.' + ON_BLACK },
  { file: 'ov-btc-coin.png',  prompt: 'A glowing orange Bitcoin coin showing the bitcoin "B" symbol, glossy 3D, strong orange glow.' + ON_BLACK },
];

async function generateImage(page, prompt, outputPath) {
  const seen = new Set(), ts = new Map(), bufs = new Map();
  const handler = r => { const u = r.url(); if (!u.includes(IMAGE_URL_PATTERN)) return; seen.add(u); if (!ts.has(u)) ts.set(u, Date.now()); if (!bufs.has(u)) bufs.set(u, r.body().catch(() => null)); };
  page.on('response', handler);
  await page.waitForTimeout(2000);
  const baseline = new Set(seen);
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.keyboard.type(prompt, { delay: 10 });
  await page.keyboard.press('Enter');
  const sentAt = Date.now();
  console.log('  Prompt sent. Waiting...');
  const start = Date.now(); let imgUrl = null;
  while (Date.now() - start < MAX_WAIT_MS) {
    const fresh = [...seen].filter(u => !baseline.has(u)).filter(u => (ts.get(u) - sentAt) >= MIN_GEN_DELAY_MS);
    if (fresh.length) { fresh.sort((a, b) => ts.get(b) - ts.get(a)); imgUrl = fresh[0]; break; }
    await page.waitForTimeout(1500);
  }
  page.removeListener('response', handler);
  if (!imgUrl) { console.log('  TIMEOUT'); return false; }
  const buf = await bufs.get(imgUrl);
  if (!buf) { console.log('  EMPTY'); return false; }
  fs.writeFileSync(outputPath, buf);
  console.log(`  Saved -> ${path.basename(outputPath)}`);
  await page.waitForTimeout(3000);
  return true;
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log('Launching Chrome (chatgpt-profile)...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
  const page = await browser.newPage();
  const rp = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(rp, r => r.abort());
  await page.goto(CHAT_URL); await page.waitForLoadState('domcontentloaded');
  await page.locator(SEL.composer).first().waitFor({ timeout: 30000 });
  console.log('Chat ready.\n');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(4000); await page.unroute(rp); await page.waitForTimeout(2000);
  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const out = path.join(ASSETS_DIR, file);
    if (fs.existsSync(out)) { console.log(`[SKIP] ${file}`); done++; continue; }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${file}`);
    if (await generateImage(page, prompt, out)) done++; else console.log(`  Failed: ${file}`);
  }
  console.log(`\nDone: ${done}/${IMAGES.length}.`);
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
