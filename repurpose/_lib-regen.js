// Shared helpers for one-off X tweet image regens with a reference image.
// Fixes the bug where the reference upload's CDN URL got captured as the
// "generated" image: take the baseline AFTER uploading the reference + a
// settle wait so the reference URLs are already in seenUrls and excluded
// from the candidates pool. Adds a size-equality paranoia check at the end.

const fs   = require('fs');
const path = require('path');

const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;
const REF_SETTLE_MS = 5000;  // wait this long after reference upload before baselining

async function uploadReference(page, refPath) {
  console.log(`  Uploading reference: ${path.basename(refPath)}`);
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput.setInputFiles(refPath);
  await page.waitForTimeout(4000);
  console.log('  Reference uploaded ✓');
}

async function generateOne(page, { targetPath, prompt, refImage }) {
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const seenUrls   = new Set();
  const timestamps = new Map();
  const buffers    = new Map();

  const onResponse = (response) => {
    const url = response.url();
    if (!url.includes(IMAGE_PATTERN)) return;
    seenUrls.add(url);
    if (!timestamps.has(url)) timestamps.set(url, Date.now());
    if (!buffers.has(url)) buffers.set(url, response.body().catch(() => null));
  };
  page.on('response', onResponse);

  // Pre-baseline settle for any in-flight requests
  await page.waitForTimeout(2000);

  // Focus composer + upload reference BEFORE taking baseline. This ensures the
  // reference's CDN URL(s) are already in seenUrls when we snapshot the baseline,
  // so they cannot be selected as "new" candidates later (the original bug).
  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();
  if (refImage) {
    await uploadReference(page, refImage);
    // Extra settle: ChatGPT sometimes makes a second fetch for thumbnail/preview
    // of the uploaded reference. Let those land before baseline.
    await page.waitForTimeout(REF_SETTLE_MS);
  }

  const baseline     = new Set(seenUrls);
  const promptSentAt = Date.now();
  console.log(`  Baseline set: ${baseline.size} URL(s) already in flight (reference + chat history)`);

  for (const char of prompt) {
    await page.keyboard.type(char);
    await page.waitForTimeout(Math.floor(Math.random() * 21) + 10);
  }
  await page.keyboard.press('Enter');
  console.log('  Prompt sent — waiting for image...');

  let imgUrl = null;
  const start = Date.now();
  let lastCount = 0;
  let stableSince = null;

  while (Date.now() - start < MAX_WAIT_MS) {
    const candidates = [...seenUrls]
      .filter(u => !baseline.has(u))
      .filter(u => (timestamps.get(u) - promptSentAt) >= MIN_GEN_MS);

    if (candidates.length > lastCount) {
      lastCount   = candidates.length;
      stableSince = Date.now();
    } else if (candidates.length > 0 && stableSince && Date.now() - stableSince >= 3000) {
      imgUrl = candidates[candidates.length - 1];
      break;
    }
    await page.waitForTimeout(1500);
  }

  page.off('response', onResponse);
  if (!imgUrl) throw new Error('Timed out waiting for image');
  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error('Empty buffer');

  // PARANOIA CHECK: if the saved buffer size matches the reference file size
  // exactly, we accidentally captured the reference upload — bail loudly.
  if (refImage && fs.existsSync(refImage)) {
    const refSize = fs.statSync(refImage).size;
    if (Math.abs(buffer.length - refSize) <= 8) {
      throw new Error(`Saved image size ${buffer.length} ≈ reference size ${refSize} — captured the reference instead of the generated image. Aborting.`);
    }
  }

  fs.writeFileSync(targetPath, buffer);
  console.log(`  Saved: ${(buffer.length / 1024).toFixed(0)} KB → ${path.basename(targetPath)}`);
}

module.exports = { generateOne, IMAGE_PATTERN, COMPOSER_SEL };
