// Generates a single image via the persistent "X Tweets" ChatGPT chat and
// saves it to the schedule-tweets/images/ folder using the
// x-tweets-<image_id>-<slug>.png convention.
//
// Usage:
//   node generate-image.js --image-id=<8char> --slug=<kebab-slug> --prompt="..."
//   node generate-image.js --image-id=<8char> --slug=<kebab-slug> --prompt-file=path
//  opt: --prefix=yt-posts  (default: x-tweets)
//
// Prereq: chatgpt-profile must be logged into ChatGPT. Run setup-chatgpt.js once
// if it isn't. The session persists in the profile; no auth file needed.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// HARD RULE: image generation ALWAYS reuses the designated PERSISTENT chat per content type.
// Never a fresh chatgpt.com/ chat (that litters the user's sidebar with orphan chats they must
// hand-delete). The chat is auto-selected by --prefix; --chat-url only overrides to another
// persistent /c/<id> chat. (Prefer gen-batch.js for any batch of 2+ images.)
const PERSISTENT_CHATS = {
  'x-tweets':    'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24',
  'ig-single':   'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24',
  // ⚠ RETIRED 2026-06-05 (overloaded — stopped rendering images). On the NEXT YT gen, launch a NEW
  // chat, record its /c/<id> URL here (and in gen-batch.js + repurpose/SKILL.md), reuse it thereafter.
  'yt-posts':    'https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa',
  'ig-carousel': 'https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa',
};
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';

// Matches ChatGPT's image delivery endpoint only (not general API traffic).
const IMAGE_URL_PATTERN = 'estuary/content';

const SEL = {
  composer: '#prompt-textarea, div[contenteditable="true"][data-id]',
  // Attachment button — ChatGPT uses various labels across versions.
  uploadBtn: 'button[aria-label*="ttach"], button[aria-label*="pload"], [data-testid*="attach"]',
};

function parseArgs() {
  const args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([\w-]+)=(.*)$/s);
    if (m) args[m[1]] = m[2];
  }
  if (!args['image-id'] || !args.slug || (!args.prompt && !args['prompt-file'])) {
    console.error('Usage: node generate-image.js --image-id=<8char> --slug=<kebab-slug> --prompt="..."');
    console.error('   or: node generate-image.js --image-id=<8char> --slug=<kebab-slug> --prompt-file=path');
    console.error('  opt: --prefix=yt-posts          (default: x-tweets)');
    console.error('  opt: --subdir=version2          save into a subfolder of images/');
    console.error('  opt: --chat-url=<url>           override the ChatGPT chat to use');
    console.error('  opt: --reference-image=<path>   upload as style reference');
    process.exit(1);
  }
  if (args['reference-image'] && !fs.existsSync(args['reference-image'])) {
    console.error(`Reference image not found: ${args['reference-image']}`);
    process.exit(1);
  }
  if (args['prompt-file']) {
    if (!fs.existsSync(args['prompt-file'])) {
      console.error(`Prompt file not found: ${args['prompt-file']}`);
      process.exit(1);
    }
    args.prompt = fs.readFileSync(args['prompt-file'], 'utf8').trim();
  }
  if (!/^[a-f0-9]{8}$/i.test(args['image-id'])) {
    console.error(`--image-id must be 8 hex chars, got: ${args['image-id']}`);
    process.exit(1);
  }
  if (!/^[a-z0-9-]+$/.test(args.slug)) {
    console.error(`--slug must be lowercase kebab-case, got: ${args.slug}`);
    process.exit(1);
  }
  const prefix = args.prefix || 'x-tweets';
  if (!/^[a-z0-9-]+$/.test(prefix)) {
    console.error(`--prefix must be lowercase kebab-case, got: ${prefix}`);
    process.exit(1);
  }
  return {
    imageId: args['image-id'],
    slug: args.slug,
    prompt: args.prompt,
    prefix,
    subdir: args.subdir || '',
    chatUrl: args['chat-url'] || PERSISTENT_CHATS[prefix] || null,
    referenceImage: args['reference-image'] || null,
  };
}

async function main() {
  const { imageId, slug, prompt, prefix, subdir, chatUrl, referenceImage } = parseArgs();

  // HARD RULE guard: never run against a fresh chat. Must be a persistent /c/<id> chat.
  if (!chatUrl || /chatgpt\.com\/?$/.test(chatUrl)) {
    console.error(`Refusing to run: no persistent chat for prefix "${prefix}". Pass --chat-url=<persistent /c/ chat>; never a fresh chatgpt.com/ chat.`);
    console.error('For any batch of 2+ images use repurpose/gen-batch.js (one persistent chat for the whole list).');
    process.exit(1);
  }

  // Derive platform subfolder from prefix unless --subdir is explicit
  const platformSubdir = subdir || (prefix === 'x-tweets' ? 'x' : prefix === 'yt-posts' ? 'yt' : prefix === 'ig-carousel' ? 'ig' : '');
  const targetDir = platformSubdir ? path.join(IMAGES_DIR, platformSubdir) : IMAGES_DIR;
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, `${prefix}-${imageId}-${slug}.png`);
  console.log(`Target: ${targetPath}`);
  console.log(`Prompt length: ${prompt.length} chars`);

  // Pre-launch delay: 15–45s. ChatGPT Plus rate limit is ~40-50 images per 3 hours
  // (~13-16/hour). Combined with typing/pre-Enter delays, this paces requests.
  const preDelay = Math.floor(Math.random() * 30001) + 15000; // 15–45 seconds
  console.log(`Pre-launch delay: ${(preDelay / 1000).toFixed(1)}s (rate-limit buffer)...`);
  await new Promise(r => setTimeout(r, preDelay));

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

  try {
    // Phase 1 — block all image delivery while the page and sidebar load.
    // chatgpt-profile has cached history images; the sidebar lazy-loads them,
    // making it impossible to baseline reliably if they're allowed through.
    // Blocking them completely guarantees our baseline will be zero.
    const imageRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
    await page.route(imageRoutePattern, route => route.abort());

    console.log(`Navigating to chat: ${chatUrl}`);
    await page.goto(chatUrl);
    await page.waitForLoadState('domcontentloaded');

    const composer = page.locator(SEL.composer).first();
    try {
      await composer.waitFor({ timeout: 30000 });
    } catch {
      throw new Error('ChatGPT composer did not appear within 30s. Check that chatgpt-profile is logged into ChatGPT (run node setup-chatgpt.js to log in).');
    }
    console.log('Chat ready.');

    // Scroll so the sidebar exhausts all its (blocked) image requests.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    // Phase 2 — unblock and set up response capture.
    // Any sidebar retries fire quickly. The generated image comes much later
    // (after ChatGPT processes the prompt). We wait 5s to let sidebar retries
    // settle, then snapshot the baseline before sending the prompt.
    await page.unroute(imageRoutePattern);

    const allSeenUrls = new Set();
    const urlTimestamps = new Map(); // url -> ms when first seen
    const capturedBuffers = new Map();
    page.on('response', (response) => {
      const url = response.url();
      if (!url.includes(IMAGE_URL_PATTERN)) return;
      allSeenUrls.add(url);
      if (!urlTimestamps.has(url)) urlTimestamps.set(url, Date.now());
      if (!capturedBuffers.has(url)) {
        capturedBuffers.set(url, response.body().catch(() => null));
      }
    });

    // Grace period: let any sidebar retries fire and land in allSeenUrls.
    await page.waitForTimeout(5000);

    // Baseline: everything seen before the prompt is sent.
    const baselineUrls = new Set(allSeenUrls);
    console.log(`Baseline image URLs: ${baselineUrls.size} (expected 0)`);

    // Phase 3 — optionally upload a reference image, then send the prompt.
    await composer.click();

    if (referenceImage) {
      console.log(`Uploading reference image: ${referenceImage}`);
      let uploaded = false;

      // Approach 1: set files directly on the hidden file input (bypasses button UI).
      // ChatGPT keeps a hidden <input type="file"> in the DOM; force:true overrides
      // visibility checks so Playwright can set files without clicking anything.
      try {
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.waitFor({ state: 'attached', timeout: 10000 });
        await fileInput.setInputFiles(referenceImage, { timeout: 10000 });
        await page.waitForTimeout(4000);
        console.log('Reference image uploaded (direct input).');
        uploaded = true;
      } catch (e1) {
        console.log(`Direct input upload failed (${e1.message.split('\n')[0]}), trying attach button...`);
      }

      // Approach 2: click the attach button and wait for a file chooser event.
      if (!uploaded) {
        try {
          const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser', { timeout: 20000 }),
            page.locator(SEL.uploadBtn).first().click(),
          ]);
          await fileChooser.setFiles(referenceImage);
          await page.waitForTimeout(4000);
          console.log('Reference image uploaded (file chooser).');
          uploaded = true;
        } catch (e2) {
          console.warn(`Warning: could not upload reference image (${e2.message.split('\n')[0]}). Continuing without it.`);
        }
      }

      await composer.click();
    }

    console.log('Typing prompt (slow, char-by-char with jitter)...');
    for (const ch of prompt) {
      await page.keyboard.type(ch);
      await page.waitForTimeout(Math.floor(Math.random() * 41) + 60); // 60–100ms per char
    }
    // Pause before pressing Enter (looks more human, gives rate-limit headroom)
    await page.waitForTimeout(Math.floor(Math.random() * 10001) + 10000); // 10–20s
    await page.keyboard.press('Enter');
    const promptSentAt = Date.now();
    console.log('Prompt sent. Waiting for image (up to 5 min)...');

    // Only accept URLs that arrived at least 10s after the prompt was sent.
    // Route-unblocking causes immediate retries of previously blocked sidebar
    // images (arrives in 1–3s). Real generations take 15–60s minimum.
    const MIN_GEN_DELAY_MS = 10000;
    const maxWaitMs = 5 * 60 * 1000;
    const startTime = Date.now();
    let lastNewCount = 0;
    let stableSince = null;
    let imgUrl = null;

    while (Date.now() - startTime < maxWaitMs) {
      const newUrls = [...allSeenUrls]
        .filter(u => !baselineUrls.has(u))
        .filter(u => (urlTimestamps.get(u) - promptSentAt) >= MIN_GEN_DELAY_MS);
      if (newUrls.length > lastNewCount) {
        lastNewCount = newUrls.length;
        stableSince = Date.now();
      } else if (newUrls.length > 0 && stableSince && Date.now() - stableSince >= 3000) {
        imgUrl = newUrls[newUrls.length - 1];
        break;
      }
      await page.waitForTimeout(1500);
    }

    if (!imgUrl) {
      throw new Error('Timed out after 5 min waiting for the generated image. Inspect the chat manually.');
    }

    console.log('Image captured. Saving...');
    const buffer = await capturedBuffers.get(imgUrl);
    if (!buffer || buffer.length === 0) {
      throw new Error('Image buffer is empty — the response body was not captured.');
    }
    fs.writeFileSync(targetPath, buffer);

    // Fail loudly if the bytes match any existing file in the same directory.
    const targetName = path.basename(targetPath);
    const siblings = fs.readdirSync(targetDir).filter(f => f !== targetName && f.endsWith('.png'));
    for (const sibling of siblings) {
      const siblingBuf = fs.readFileSync(path.join(targetDir, sibling));
      if (siblingBuf.length === buffer.length && siblingBuf.equals(buffer)) {
        fs.unlinkSync(targetPath);
        throw new Error(`Saved image is identical to "${sibling}" — wrong image grabbed. Re-run.`);
      }
    }

    // Visually verify by reading the saved image.
    console.log(`\nDone. Image saved:`);
    console.log(`  Path: ${targetPath}`);
    console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);

  } catch (err) {
    console.error('\nGeneration failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
