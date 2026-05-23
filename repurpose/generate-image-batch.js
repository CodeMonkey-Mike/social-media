// Generates multiple images in a single Chrome session — one launch, one close.
// Drop-in companion to generate-image.js for batch runs (carousels, regen jobs, etc.)
//
// Usage:
//   node generate-image-batch.js --jobs-file=<path-to-jobs.json>
//
// Jobs file: JSON array of objects. Each object supports the same fields as
// generate-image.js CLI flags:
//   imageId        (required) 8-char hex
//   slug           (required) kebab-case
//   prompt         (required, or use promptFile)
//   promptFile     path to a .txt file containing the prompt
//   prefix         default: "x-tweets"
//   chatUrl        default: fresh chat (https://chatgpt.com/)
//   referenceImage path to reference image file (optional)
//
// Example jobs.json:
// [
//   {
//     "imageId": "2e48acb6",
//     "slug": "03-priced-in-everyone-knows",
//     "prefix": "yt-posts",
//     "chatUrl": "https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa",
//     "referenceImage": "C:\\path\\to\\ref.png",
//     "prompt": "Bold crypto news graphic..."
//   }
// ]

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DEFAULT_CHAT_URL = 'https://chatgpt.com/';
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const IMAGE_URL_PATTERN = 'estuary/content';

const SEL = {
  composer: '#prompt-textarea, div[contenteditable="true"][data-id]',
  uploadBtn: 'button[aria-label*="ttach"], button[aria-label*="pload"], [data-testid*="attach"]',
};

function parseArgs() {
  const args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([\w-]+)=(.*)$/s);
    if (m) args[m[1]] = m[2];
  }
  if (!args['jobs-file']) {
    console.error('Usage: node generate-image-batch.js --jobs-file=<path>');
    process.exit(1);
  }
  if (!fs.existsSync(args['jobs-file'])) {
    console.error(`Jobs file not found: ${args['jobs-file']}`);
    process.exit(1);
  }
  return args['jobs-file'];
}

function loadJobs(jobsFile) {
  const raw = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
  if (!Array.isArray(raw) || raw.length === 0) {
    console.error('Jobs file must be a non-empty JSON array.');
    process.exit(1);
  }
  return raw.map((job, i) => {
    if (!job.imageId || !job.slug || (!job.prompt && !job.promptFile)) {
      console.error(`Job ${i}: missing imageId, slug, or prompt/promptFile`);
      process.exit(1);
    }
    if (!/^[a-f0-9]{8}$/i.test(job.imageId)) {
      console.error(`Job ${i}: imageId must be 8 hex chars, got: ${job.imageId}`);
      process.exit(1);
    }
    if (job.promptFile) {
      if (!fs.existsSync(job.promptFile)) {
        console.error(`Job ${i}: promptFile not found: ${job.promptFile}`);
        process.exit(1);
      }
      job.prompt = fs.readFileSync(job.promptFile, 'utf8').trim();
    }
    if (job.referenceImage && !fs.existsSync(job.referenceImage)) {
      console.error(`Job ${i}: referenceImage not found: ${job.referenceImage}`);
      process.exit(1);
    }
    return {
      imageId: job.imageId,
      slug: job.slug,
      prompt: job.prompt,
      prefix: job.prefix || 'x-tweets',
      chatUrl: job.chatUrl || DEFAULT_CHAT_URL,
      referenceImage: job.referenceImage || null,
    };
  });
}

function targetPath(job) {
  const { prefix, imageId, slug } = job;
  const platformSubdir = prefix === 'x-tweets' ? 'x'
    : prefix === 'yt-posts' ? 'yt'
    : prefix === 'ig-carousel' ? 'ig'
    : '';
  const dir = platformSubdir ? path.join(IMAGES_DIR, platformSubdir) : IMAGES_DIR;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return { dir, filePath: path.join(dir, `${prefix}-${imageId}-${slug}.png`) };
}

async function processJob(page, job, jobIndex, total, allSeenUrls, urlTimestamps, capturedBuffers) {
  const start = new Date();
  console.log(`\n[${start.toTimeString().slice(0,8)}] [${jobIndex}/${total}] ${job.imageId}-${job.slug}`);

  const { dir, filePath } = targetPath(job);
  console.log(`Target: ${filePath}`);
  console.log(`Prompt length: ${job.prompt.length} chars`);

  // Rate-limit buffer between jobs (skip delay before first job — browser just launched)
  if (jobIndex > 1) {
    const delay = Math.floor(Math.random() * 30001) + 15000; // 15–45s
    console.log(`Pre-job delay: ${(delay / 1000).toFixed(1)}s (rate-limit buffer)...`);
    await new Promise(r => setTimeout(r, delay));
  }

  // Navigate to the target chat. Re-navigating on every job gives a clean composer
  // state and ensures the sidebar has settled before we take our baseline snapshot.
  const imageRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(imageRoutePattern, route => route.abort());

  console.log(`Navigating to chat: ${job.chatUrl}`);
  await page.goto(job.chatUrl);
  await page.waitForLoadState('domcontentloaded');

  // If asked for fresh chat but got redirected to existing one, navigate away.
  if (job.chatUrl === DEFAULT_CHAT_URL && page.url().includes('/c/')) {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }

  const composer = page.locator(SEL.composer).first();
  try {
    await composer.waitFor({ timeout: 30000 });
  } catch {
    throw new Error('ChatGPT composer did not appear within 30s. Is chatgpt-profile still logged in?');
  }
  console.log('Chat ready.');

  // Let sidebar exhaust its (blocked) image requests.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);

  // Unblock image delivery and let any sidebar retries fire.
  await page.unroute(imageRoutePattern);
  await page.waitForTimeout(5000);

  // Baseline: everything seen so far (sidebar retries land here; generated image comes later).
  const baselineUrls = new Set(allSeenUrls);
  console.log(`Baseline image URLs: ${baselineUrls.size}`);

  // Upload reference image if provided.
  await composer.click();
  if (job.referenceImage) {
    console.log(`Uploading reference image: ${job.referenceImage}`);
    let uploaded = false;
    try {
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached', timeout: 10000 });
      await fileInput.setInputFiles(job.referenceImage, { timeout: 10000 });
      await page.waitForTimeout(4000);
      console.log('Reference image uploaded (direct input).');
      uploaded = true;
    } catch (e1) {
      console.log(`Direct input upload failed (${e1.message.split('\n')[0]}), trying attach button...`);
    }
    if (!uploaded) {
      try {
        const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser', { timeout: 20000 }),
          page.locator(SEL.uploadBtn).first().click(),
        ]);
        await fileChooser.setFiles(job.referenceImage);
        await page.waitForTimeout(4000);
        console.log('Reference image uploaded (file chooser).');
        uploaded = true;
      } catch (e2) {
        console.warn(`Warning: could not upload reference image (${e2.message.split('\n')[0]}). Continuing without it.`);
      }
    }
    await composer.click();
  }

  // Type prompt char-by-char, pause, then send.
  console.log('Typing prompt (slow, char-by-char with jitter)...');
  for (const ch of job.prompt) {
    await page.keyboard.type(ch);
    await page.waitForTimeout(Math.floor(Math.random() * 41) + 60);
  }
  await page.waitForTimeout(Math.floor(Math.random() * 10001) + 10000); // 10–20s pause
  await page.keyboard.press('Enter');
  const promptSentAt = Date.now();
  console.log('Prompt sent. Waiting for image (up to 5 min)...');

  // Wait for a URL that arrived at least 10s after the prompt (filters sidebar retries).
  const MIN_GEN_DELAY_MS = 10000;
  const maxWaitMs = 5 * 60 * 1000;
  const waitStart = Date.now();
  let lastNewCount = 0;
  let stableSince = null;
  let imgUrl = null;

  while (Date.now() - waitStart < maxWaitMs) {
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
    throw new Error(`Job ${jobIndex}: timed out after 5 min waiting for generated image.`);
  }

  console.log('Image captured. Saving...');
  const buffer = await capturedBuffers.get(imgUrl);
  if (!buffer || buffer.length === 0) {
    throw new Error(`Job ${jobIndex}: image buffer is empty — response body not captured.`);
  }
  fs.writeFileSync(filePath, buffer);

  // Duplicate check against siblings.
  const targetName = path.basename(filePath);
  const siblings = fs.readdirSync(dir).filter(f => f !== targetName && f.endsWith('.png'));
  for (const sibling of siblings) {
    const siblingBuf = fs.readFileSync(path.join(dir, sibling));
    if (siblingBuf.length === buffer.length && siblingBuf.equals(buffer)) {
      fs.unlinkSync(filePath);
      throw new Error(`Job ${jobIndex}: saved image is identical to "${sibling}" — wrong image grabbed. Re-run this job.`);
    }
  }

  const end = new Date();
  const elapsed = Math.round((end - start) / 1000);
  console.log(`Done. Image saved:`);
  console.log(`  Path: ${filePath}`);
  console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`[${end.toTimeString().slice(0,8)}] [${jobIndex}/${total}] done in ${elapsed}s`);

  // Release captured buffer memory for this URL now that we've saved the file.
  capturedBuffers.delete(imgUrl);
}

async function main() {
  const jobsFile = parseArgs();
  const jobs = loadJobs(jobsFile);

  console.log(`Loaded ${jobs.length} job(s) from ${jobsFile}`);
  console.log('Launching Chrome (once for all jobs)...');

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

  // Session-level response interceptor: accumulates across all jobs.
  // Per-job baseline snapshots filter out URLs seen before each prompt was sent.
  const allSeenUrls = new Set();
  const urlTimestamps = new Map();
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

  const failed = [];
  for (let i = 0; i < jobs.length; i++) {
    try {
      await processJob(page, jobs[i], i + 1, jobs.length, allSeenUrls, urlTimestamps, capturedBuffers);
    } catch (err) {
      console.error(`\nJob ${i + 1} FAILED: ${err.message}`);
      failed.push({ index: i + 1, job: jobs[i], error: err.message });
    }
  }

  await browser.close();
  console.log('\nChrome closed.');

  if (failed.length === 0) {
    console.log(`\nAll ${jobs.length} job(s) completed successfully.`);
  } else {
    console.log(`\n${jobs.length - failed.length}/${jobs.length} succeeded. ${failed.length} failed:`);
    for (const f of failed) {
      console.log(`  [${f.index}] ${f.job.imageId}-${f.job.slug}: ${f.error}`);
    }
    process.exit(1);
  }
}

main();
