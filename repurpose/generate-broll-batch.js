// generate-broll-batch.js
// Opens the B-roll chat once, generates all images in sequence, saves to assets/.
// Each image: type prompt → wait for generation → download → save → repeat.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT_URL          = 'https://chatgpt.com/';  // FRESH chat per run (fixed 2026-05-24 — history-heavy chats caused stale-image grabs)
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
  // ── kaspa-iso20022-swift ──────────────────────────────────────────────────
  {
    file: 'broll-iso-bank-network.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal/cyan Kaspa crypto coin with a "K" logo plugged into the center of a worldwide banking transfer network — a dark wireframe globe with glowing teal money-transfer arcs connecting corporate bank towers. Replacing the old slow system. Dramatic teal glow, dark background, cinematic 8K. No text.',
  },
  {
    file: 'broll-iso-kaspa-vs-xrp.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal Kaspa "K" coin racing ahead through a glowing financial pipeline while a dull grey XRP coin lags behind. Speed and momentum, light trails. Teal vs cold-grey lighting, dark cinematic background, 8K. No text.',
  },
  // ── kaspa-entry-doesnt-matter ─────────────────────────────────────────────
  {
    file: 'broll-entry-longchart.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive sweeping glowing teal upward price chart filling the frame, with a tiny insignificant entry-price marker dot near the bottom left, dwarfed by the huge climb above it. Long-term conviction. Teal glow, dark background, cinematic 8K. No text.',
  },
  {
    file: 'broll-entry-dca-stack.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A hand-like glow steadily stacking glowing teal Kaspa "K" coins into a tall growing tower, one coin at a time, dollar-cost-averaging. Steady, disciplined, patient. Teal glow, dark cinematic background, 8K. No text.',
  },
  // ── ideas-in-a-cemetery ───────────────────────────────────────────────────
  {
    file: 'broll-cemetery-ideas.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A misty moonlit graveyard at night, rows of old tombstones, and faint glowing lightbulb-shaped ideas dimly flickering and sinking down into the graves, fading away. Humanity\'s lost ideas buried forever. Moody blue moonlight, fog, dark cinematic 8K. No text.',
  },
  {
    file: 'broll-cemetery-rising.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A single brilliant glowing lightbulb idea bursting upward out of a cracked grave, beams of warm golden light breaking through the dark earth and fog into a hopeful dawn sky. An idea finally set free. Dramatic, uplifting, cinematic 8K. No text.',
  },
  // ── webcam-girl-rug-cycle ─────────────────────────────────────────────────
  {
    file: 'broll-cycle-feeding-screen.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A lone silhouetted person feeding a stream of dollar bills into a giant glowing phone screen that hungrily swallows the money into darkness. Endless one-sided spending. Moody dark lighting, cold glow from the screen, cinematic 8K. No text.',
  },
  {
    file: 'broll-cycle-hamster-wheel.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing hamster wheel made of money and crypto coins, a small silhouetted figure running endlessly inside it while coins fall out the bottom into a dark void. A pointless repeating cycle. Moody dark lighting, red accent glow, cinematic 8K. No text.',
  },
  {
    file: 'broll-cycle-paycheck-drain.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A paycheck and dollar bills swirling down a dark glowing drain, vanishing week after week. Money draining away repeatedly. Moody dark lighting, cold blue-and-red glow, cinematic 8K. No text.',
  },
  // ── why-200-keeps-rugging ─────────────────────────────────────────────────
  {
    file: 'broll-200-bleeding.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A stream of small cash bundles being tossed one after another into a row of little red glowing trapdoor holes in a dark floor, each one swallowing the money and vanishing. Small bets bleeding away. Red warning glow, dark cinematic 8K. No text.',
  },
  {
    file: 'broll-200-consolidate.png',
    prompt: 'Cinematic vertical 9:16 portrait image. Many scattered small dull coins flowing together and merging into one large solid glowing coin that rises powerfully upward with a bright green chart behind it. Consolidating into one strong play. Dramatic green-and-gold glow, dark background, cinematic 8K. No text.',
  },
  // ── no-new-memes-bear-market ──────────────────────────────────────────────
  {
    file: 'broll-memes-bear-flat.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dull deflated sad cartoon meme coin lying flat and lifeless on cracked frozen ground in a bleak dark bear-market wasteland, a red downtrend line in the grey sky. No momentum. Cold desaturated lighting, dark cinematic 8K. No text.',
  },
  {
    file: 'broll-memes-rally-rocket.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A bright green bull-market rocket blasting upward with several cheerful cartoon meme coins riding it, a glowing green price chart soaring behind. The rally. Vivid green and gold glow, energetic, dark sky, cinematic 8K. No text.',
  },
  {
    file: 'broll-memes-launchpad-timing.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing cartoon meme coin sitting on a launchpad, perfectly timed to ignite as a bright green rising market wave surges past behind it. Timing the launch to the rally. Green glow, dramatic, dark background, cinematic 8K. No text.',
  },
  // ── stablecoin-yield-fight ────────────────────────────────────────────────
  {
    file: 'broll-stable-deposit-flight.png',
    prompt: 'Cinematic vertical 9:16 portrait image. Streams of glowing money flying OUT of a grey classical bank building and toward bright glowing stablecoin discs that promise higher yield. Deposit flight. Cool lighting, the stablecoins glowing green, the bank dim grey, dark cinematic 8K. No text.',
  },
  {
    file: 'broll-stable-tugofwar.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A tug-of-war over a glowing rope of money between a grey institutional bank tower on one side and a bright glowing stablecoin disc on the other. A financial power struggle. Dramatic lighting, dark cinematic background, 8K. No text.',
  },
  {
    file: 'broll-stable-global-inflow.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing map of the United States with two large bright streams of money flowing IN from across a dark globe abroad, versus a single thin trickle flowing out. Net capital inflow. Cool green-and-gold glow, dark cinematic 8K. No text.',
  },
  // ── sui-favorites-etfs ────────────────────────────────────────────────────
  {
    file: 'broll-sui-favorite.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing aqua-blue water-drop shaped crypto coin sitting proudly on a spotlit pedestal marked as a favorite, with glowing upward multiplier arrows rising around it. Aqua-cyan glow, dark cinematic background, 8K. No text.',
  },
  {
    file: 'broll-sui-130x.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing aqua-blue water-drop crypto coin exploding upward with tremendous energy, a steep bright green price chart rocketing behind it. A massive multiplier gain. Aqua and green glow, dramatic, dark background, cinematic 8K. No text.',
  },
  {
    file: 'broll-sui-etf.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A grand institutional investment building with glowing aqua-blue light, a glowing aqua water-drop crypto coin displayed at its center like a regulated fund product, suited silhouettes nearby. Institutional ETF adoption. Cool aqua lighting, dark cinematic 8K. No text.',
  },
  // ── coinmarketcap-test ────────────────────────────────────────────────────
  {
    file: 'broll-cmc-rejected.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A shady dim crypto coin being denied entry at a guarded velvet-rope gate, a glowing red barrier blocking its path into a bright listing hall. Rejected and untrustworthy. Red warning glow, dark dramatic shadows, cinematic 8K. No text.',
  },
  {
    file: 'broll-cmc-redflag.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A large red warning flag planted firmly on top of a dull sketchy crypto coin in a dark spotlight, a caution glow around it. A clear red flag. Dramatic red lighting, dark cinematic background, 8K. No text.',
  },
  // ── human-driving-illegal ─────────────────────────────────────────────────
  {
    file: 'broll-selfdrive-future.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A sleek glowing autonomous self-driving car with no driver gliding smoothly along a futuristic neon smart highway at night, perfect flawless lanes of light. The future of transport. Cool blue-and-cyan glow, dark cinematic 8K. No text.',
  },
  {
    file: 'broll-selfdrive-banned.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing red circular prohibition symbol hovering over an old-fashioned car steering wheel, the concept of human driving being outlawed. Dramatic red warning glow, dark cinematic background, 8K. No text.',
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

  console.log(`Navigating to a fresh chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  if (page.url().includes('/c/')) {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }

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
