// generate-broll-batch.js
// Opens the B-roll chat once, generates all images in sequence, saves to assets/.
// Each image: type prompt → wait for generation → download → save → repeat.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT_URL          = 'https://chatgpt.com/c/6a0deddf-1bac-83ea-8107-0e419a2c44ac';
const IMAGE_URL_PATTERN = 'estuary/content';
const MIN_GEN_DELAY_MS  = 10000;
const MAX_WAIT_MS       = 5 * 60 * 1000;
const ASSETS_DIR        = 'C:\\Users\\mnede\\Documents\\Claude\\video-creation\\assets';

const SEL = {
  composer: '#prompt-textarea, div[contenteditable="true"][data-id]',
};

// ── Image list ────────────────────────────────────────────────────────────────
// Each entry: { file, prompt }
// Prompts: 9:16 vertical, cinematic, dark background, no text unless specified.

const IMAGES = [
  {
    file: 'broll-ai-jobs.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic scene: a massive glowing humanoid AI robot made of blue circuits and neural networks towers over a human worker sitting at a computer. The human looks small in comparison. Dark moody background, neon blue and white accent lighting, volumetric fog. Ultra-dramatic, photorealistic 8K render. No text.',
  },
  {
    file: 'broll-ai-layoff.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A corporate office — half the desks are empty with ghostly outlines where workers used to sit, the other half glow with AI terminals. A single human worker sits in the middle looking determined. Blue and white neon lighting, dark dramatic atmosphere. Photorealistic, 8K. No text.',
  },
  {
    file: 'broll-kaspa-3d.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive glowing Kaspa cryptocurrency coin — teal/cyan colored with the Kaspa "K" logo embossed — floating in deep space against a pitch-black background. Epic volumetric teal light rays radiate from the coin. The coin takes up most of the frame. Ultra-dramatic 8K photorealistic 3D render. No text.',
  },
  {
    file: 'broll-kaspa-chart-up.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic upward-surging price chart line glowing bright teal/cyan against a dark background with subtle grid lines. The chart starts low on the left and shoots up aggressively to the top right. Green and teal glow effects, cinematic lighting. No faces, no text, just the chart.',
  },
  {
    file: 'broll-kata-hardfork.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A blockchain network visualization: glowing nodes and chains split and upgrade mid-frame — like a blockchain forking into a newer stronger chain. Teal and blue energy pulses flow through the network. Dark space background. Ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-crypto-bear.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive dark grizzly bear sitting atop a pile of red downward price candles, illuminated by red light from below. Dramatic dark storm clouds in the background, lightning in the distance. Menacing and oversized. Photorealistic, 8K. No text.',
  },
  {
    file: 'broll-rug-pull.png',
    prompt: 'Cinematic vertical 9:16 portrait image. Stylized cartoon scene: a shadowy hooded figure dramatically yanks a glowing rug from underneath a crowd of small cartoon crypto investor figures holding coins and rockets who go flying. Dark background with ominous red lighting. Bold graphic style, no text.',
  },
  {
    file: 'broll-housecoin.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing luxury mansion/house built entirely of gold and teal cryptocurrency coins, floating in darkness with a dramatic green upward price chart in the background sky. The house gleams with teal and gold light. Epic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-peanut-coin.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A cute but epic 3D rendered cartoon squirrel in a business suit, holding a glowing gold peanut-shaped cryptocurrency coin. Green trading chart lines glow in the dark background behind it. Dramatic cinematic lighting, 8K render. No text.',
  },
  {
    file: 'broll-uranus-space.png',
    prompt: 'Cinematic vertical 9:16 portrait image. The planet Uranus — a pale icy-blue ringed giant — looms dramatically in deep space against a star field. A glowing cryptocurrency coin orbits it. Epic NASA-style space photography, ultra-dramatic, cinematic. No text.',
  },
  {
    file: 'broll-mother-iggy.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic glowing pink and gold crown floating in darkness, with a stylized "M" symbol glowing below it, representing a music/celebrity token. Purple and gold neon light rays. Dark, cinematic, ultra-HD. No text.',
  },
  {
    file: 'broll-tao-network.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive glowing blue neural network forming a giant brain shape in deep space. At the center of the brain, a glowing tau (τ) symbol pulses with bright white-blue energy. Tendrils of AI energy extend outward. Ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-tao-vs-stocks.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic comparison: on the left, a faded grey NVIDIA GPU chip labeled "NVDA" looking small and dim. On the right, a massive glowing TAO coin (with τ symbol) radiates bright blue-white light, dwarfing everything else. Green upward arrows surround the TAO coin. Dark cinematic background. Bold and dramatic.',
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function generateImage(page, prompt, outputPath) {
  const allSeenUrls    = new Set();
  const urlTimestamps  = new Map();
  const capturedBuffers = new Map();

  // Set up response capture
  const handler = response => {
    const url = response.url();
    if (!url.includes(IMAGE_URL_PATTERN)) return;
    allSeenUrls.add(url);
    if (!urlTimestamps.has(url)) urlTimestamps.set(url, Date.now());
    if (!capturedBuffers.has(url)) {
      capturedBuffers.set(url, response.body().catch(() => null));
    }
  };
  page.on('response', handler);

  await page.waitForTimeout(2000);
  const baselineUrls = new Set(allSeenUrls);

  // Type and send prompt
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.keyboard.type(prompt, { delay: 10 });
  await page.keyboard.press('Enter');
  const promptSentAt = Date.now();
  console.log('  Prompt sent. Waiting for image...');

  // Wait for new image URL
  const startTime = Date.now();
  let imgUrl = null;

  while (Date.now() - startTime < MAX_WAIT_MS) {
    const newUrls = [...allSeenUrls]
      .filter(u => !baselineUrls.has(u))
      .filter(u => (urlTimestamps.get(u) - promptSentAt) >= MIN_GEN_DELAY_MS);

    if (newUrls.length > 0) {
      // Pick the most recent
      newUrls.sort((a, b) => urlTimestamps.get(b) - urlTimestamps.get(a));
      imgUrl = newUrls[0];
      break;
    }
    await page.waitForTimeout(1500);
  }

  page.removeListener('response', handler);

  if (!imgUrl) {
    console.log('  TIMEOUT — no image received.');
    return false;
  }

  const buf = await capturedBuffers.get(imgUrl);
  if (!buf) {
    console.log('  ERROR — buffer empty.');
    return false;
  }

  fs.writeFileSync(outputPath, buf);
  console.log(`  Saved -> ${path.basename(outputPath)}`);

  // Wait a moment before next prompt so the chat is ready
  await page.waitForTimeout(3000);
  return true;
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  console.log('Launching Chrome...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });

  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await browser.newPage();

  // Block sidebar image loads initially
  const imgRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(imgRoutePattern, route => route.abort());

  console.log(`Navigating to B-roll chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');

  const composer = page.locator(SEL.composer).first();
  await composer.waitFor({ timeout: 30000 });
  console.log('Chat ready.\n');

  // Flush sidebar retries, then unblock
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(4000);
  await page.unroute(imgRoutePattern);
  await page.waitForTimeout(2000);

  // ── Generate each image ──────────────────────────────────────────────────
  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const outputPath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(outputPath)) {
      console.log(`[SKIP] ${file} already exists.`);
      done++;
      continue;
    }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${file}`);
    const ok = await generateImage(page, prompt, outputPath);
    if (ok) done++;
    else console.log(`  Failed — will need to retry ${file} manually.`);
  }

  console.log(`\nDone: ${done}/${IMAGES.length} images generated.`);
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
