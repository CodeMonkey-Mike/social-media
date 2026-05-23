// generate-asset.js — stripped-down image generator for local test assets.
// Same Playwright + ChatGPT web UI approach as generate-image.js, but saves
// to any arbitrary output path instead of the schedule-tweets folder.
//
// Usage:
//   node generate-asset.js --output=<abs-path.png> --prompt="..."
//   node generate-asset.js --output=<abs-path.png> --prompt-file=<path>

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGE_URL_PATTERN = 'estuary/content';
const MIN_GEN_DELAY_MS  = 10000; // real generations take >10s; sidebar retries arrive in <3s
const MAX_WAIT_MS       = 5 * 60 * 1000;

const SEL = {
  composer: '#prompt-textarea, div[contenteditable="true"][data-id]',
};

function parseArgs() {
  const args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([\w-]+)=(.*)$/s);
    if (m) args[m[1]] = m[2];
  }
  if (!args.output || (!args.prompt && !args['prompt-file'])) {
    console.error('Usage: node generate-asset.js --output=<path.png> --prompt="..."');
    console.error('   or: node generate-asset.js --output=<path.png> --prompt-file=<path>');
    console.error('   optional: --chat-url=<url>  (continue in a specific chat instead of fresh)');
    process.exit(1);
  }
  if (args['prompt-file']) {
    if (!fs.existsSync(args['prompt-file'])) {
      console.error(`Prompt file not found: ${args['prompt-file']}`);
      process.exit(1);
    }
    args.prompt = fs.readFileSync(args['prompt-file'], 'utf8').trim();
  }
  return { output: args.output, prompt: args.prompt, chatUrl: args['chat-url'] || null };
}

async function main() {
  const { output, prompt, chatUrl } = parseArgs();

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(output), { recursive: true });

  console.log(`Output : ${output}`);
  console.log(`Prompt : ${prompt.slice(0, 120)}...`);
  console.log('');

  console.log('Launching Chrome with chatgpt-profile...');
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

  try {
    // ── Phase 1: block image delivery while page + sidebar load ──────────────
    // The chatgpt-profile has cached chat history; sidebar images load on scroll.
    // Blocking them ensures our baseline is a clean zero before we send the prompt.
    const imgRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
    await page.route(imgRoutePattern, route => route.abort());

    const targetUrl = chatUrl || 'https://chatgpt.com/';
    console.log(`Navigating to ChatGPT (${chatUrl ? 'specific chat' : 'fresh chat'})...`);
    await page.goto(targetUrl);
    await page.waitForLoadState('domcontentloaded');

    // Only redirect to fresh if no specific chat was requested
    if (!chatUrl && page.url().includes('/c/')) {
      await page.goto('https://chatgpt.com/');
      await page.waitForLoadState('domcontentloaded');
    }

    const composer = page.locator(SEL.composer).first();
    try {
      await composer.waitFor({ timeout: 30000 });
    } catch {
      throw new Error('Composer not found within 30s — is chatgpt-profile logged into ChatGPT? Run setup-chatgpt.js to re-authenticate.');
    }
    console.log('Chat ready.');

    // Scroll to flush any lazy-loaded sidebar image requests (all blocked)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    // ── Phase 2: unblock and set up response capture ──────────────────────────
    await page.unroute(imgRoutePattern);

    const allSeenUrls    = new Set();
    const urlTimestamps  = new Map();
    const capturedBuffers = new Map();

    page.on('response', response => {
      const url = response.url();
      if (!url.includes(IMAGE_URL_PATTERN)) return;
      allSeenUrls.add(url);
      if (!urlTimestamps.has(url)) urlTimestamps.set(url, Date.now());
      if (!capturedBuffers.has(url)) {
        capturedBuffers.set(url, response.body().catch(() => null));
      }
    });

    // Let any immediate sidebar retries fire and land in allSeenUrls
    await page.waitForTimeout(5000);
    const baselineUrls = new Set(allSeenUrls);
    console.log(`Baseline captured (${baselineUrls.size} pre-existing URLs, expected 0).`);

    // ── Phase 3: send the prompt ──────────────────────────────────────────────
    await composer.click();
    console.log('Typing prompt...');
    await page.keyboard.type(prompt, { delay: 15 });
    await page.keyboard.press('Enter');
    const promptSentAt = Date.now();
    console.log('Prompt sent. Waiting for image (up to 5 min)...');

    // ── Phase 4: wait for the generated image ─────────────────────────────────
    // Only accept URLs that arrived ≥10s after prompt was sent.
    // Sidebar retries (from unblocking) arrive within 1–3s; real images take 15–60s.
    const startTime = Date.now();
    let lastNewCount = 0;
    let stableSince  = null;
    let imgUrl       = null;

    while (Date.now() - startTime < MAX_WAIT_MS) {
      const newUrls = [...allSeenUrls]
        .filter(u => !baselineUrls.has(u))
        .filter(u => (urlTimestamps.get(u) - promptSentAt) >= MIN_GEN_DELAY_MS);

      if (newUrls.length > lastNewCount) {
        lastNewCount = newUrls.length;
        stableSince  = Date.now();
        console.log(`  [${Math.round((Date.now()-startTime)/1000)}s] New image URL detected (${newUrls.length} so far)...`);
      } else if (newUrls.length > 0 && stableSince && Date.now() - stableSince >= 3000) {
        // No new URLs for 3s — generation complete, take the last one
        imgUrl = newUrls[newUrls.length - 1];
        break;
      }

      await page.waitForTimeout(1500);
    }

    if (!imgUrl) {
      throw new Error('Timed out after 5 min — no generated image detected. Check the browser window for errors.');
    }

    // ── Phase 5: save ─────────────────────────────────────────────────────────
    console.log('Image captured. Retrieving buffer...');
    const buffer = await capturedBuffers.get(imgUrl);
    if (!buffer || buffer.length === 0) {
      throw new Error('Buffer was empty — response body not captured in time.');
    }

    fs.writeFileSync(output, buffer);
    console.log('');
    console.log('✓ Done.');
    console.log(`  Saved : ${output}`);
    console.log(`  Size  : ${(buffer.length / 1024).toFixed(1)} KB`);

  } catch (err) {
    console.error('\n✗ Generation failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
