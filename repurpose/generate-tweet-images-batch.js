// Batch image generator — launches Chrome ONCE, reuses session for every prompt.
// Handles: reference image uploads, IG 4:5 companions, JSON updates after each save.
//
// Usage: node generate-tweet-images-batch.js
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;
const TROLL_REF     = path.join(IMAGES_DIR, 'reference', 'troll.png');

const TWEETS_JSON = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');
const IG_JSON     = path.join(SCHEDULE_DIR, 'data', 'ig-single-image.json');

// ── IG match map: tweet hook snippet → IG post id ────────────────────────────
const IG_HOOK_MAP = {
  'Take the four-year cycle zombies':       'ig-2026-05-20-bottom-behind-us-1l',
  'Minnesota banks can custody Bitcoin':    'ig-2026-05-20-minnesota-custody-bill-1l',
  'Don\'t expect the $KAS pump in 23 days': 'ig-2026-05-20-hard-fork-23-days-priced-in-1l',
  '\'We could be dead in two days':         'ig-2026-05-20-senior-leadership-defects-1l',
  '$TAO might win the absolute mcap race':  'ig-2026-05-20-tau-vs-kaspa-multiplier-math-1l',
  '$TROLL on Solana is now bigger than the original': 'ig-2026-05-20-troll-solana-bigger-than-eth-1l',
};

// ── Image plan ────────────────────────────────────────────────────────────────
// Each entry: { hookSnippet, uuid, slug, xPrompt, igPrompt|null, refImage|null }
// hookSnippet is matched against pending tweet hooks to find the right tweet.
const IMAGES = [
  // ── TROLL tweets — both use troll.png reference ───────────────────────────
  {
    hookSnippet: '$TROLL on Solana is now bigger than the original',
    uuid: 'e42e6175', slug: 'troll-solana-beats-troll-eth',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. Two large anthropomorphized versions of the coin shown in the reference image face off dramatically. The smaller one stands on a purple Ethereum platform looking intimidated. The much larger, bolder one stands on a bright green Solana platform, arms crossed triumphantly. Render the character using the logo from the attached reference image. Deep navy near-black background. Dramatic cinematic green and purple rim lighting. Competitive triumphant mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. Two large anthropomorphized versions of the coin shown in the reference image face off dramatically. The smaller one stands on a purple Ethereum platform looking intimidated. The much larger, bolder one stands on a bright green Solana platform, arms crossed triumphantly. Render the character using the logo from the attached reference image. Deep navy near-black background. Dramatic cinematic green and purple rim lighting. Competitive triumphant mood. No text or words anywhere in the image.',
    refImage: TROLL_REF,
  },
  {
    hookSnippet: '$TROLL on Solana is now bigger than $TROLL on ETH.',
    uuid: 'e40a228f', slug: 'troll-copy-beats-original-eth',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A small original version of the coin from the reference image stands on a purple Ethereum stage, looking embarrassed and deflated. Next to it, a dramatically larger copy of the same coin on a bright green Solana stage towers over it confidently, holding a trophy. Render the coin character using the attached reference image logo. Deep navy near-black background. Dramatic cinematic green and purple rim lighting. Ironic comedic mood. No text or words anywhere in the image.',
    igPrompt: null,
    refImage: TROLL_REF,
  },

  // ── 8 remaining tweets with no image ─────────────────────────────────────
  {
    hookSnippet: 'Take the four-year cycle zombies',
    uuid: '67d2cc9e', slug: 'cycle-zombies-fading-btc-rises',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A group of zombie-like tired investor characters shuffle away and dissolve into mist, dropping heavy coin bags. Behind them, a glowing gold Bitcoin coin character rises triumphantly into golden light above. Deep navy near-black background. Dramatic cinematic gold and teal rim lighting. Triumphant hopeful mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. A group of zombie-like tired investor characters shuffle away and dissolve into mist, dropping heavy coin bags. Behind them, a glowing gold Bitcoin coin character rises triumphantly into golden light above. Deep navy near-black background. Dramatic cinematic gold and teal rim lighting. Triumphant hopeful mood. No text or words anywhere in the image.',
    refImage: null,
  },
  {
    hookSnippet: 'Minnesota banks can custody Bitcoin',
    uuid: '221dbeb4', slug: 'minnesota-banks-rolling-adoption',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A friendly bank building character opens its vault doors wide, welcoming a cheerful glowing gold Bitcoin coin character inside. In the background, a stylized map of the United States has multiple states lighting up with golden glows in a chain reaction spreading state by state. Deep navy near-black background. Dramatic cinematic gold rim lighting. Triumphant official mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. A friendly bank building character opens its vault doors wide, welcoming a cheerful glowing gold Bitcoin coin character inside. In the background, a stylized map of the United States has multiple states lighting up with golden glows in a chain reaction spreading state by state. Deep navy near-black background. Dramatic cinematic gold rim lighting. Triumphant official mood. No text or words anywhere in the image.',
    refImage: null,
  },
  {
    hookSnippet: 'Bought $PNUT back yesterday at 48% under my prior sell. Dry',
    uuid: '94c3df2f', slug: 'pnut-dry-powder-edge',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A confident investor character with bright green eyes holds a glowing peanut coin in one hand and a glowing reserve pouch of dry powder in the other, grinning with satisfaction. The peanut coin beams happily. Deep navy near-black background. Dramatic cinematic gold rim lighting. Savvy opportunistic mood. No text or words anywhere in the image.',
    igPrompt: null,
    refImage: null,
  },
  {
    hookSnippet: "Don't expect the $KAS pump in 23 days",
    uuid: 'cdae76ab', slug: 'kas-hard-fork-priced-in-crowd',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A glowing teal Kaspa coin character stands on a stage facing a huge excited crowd all pointing at a glowing countdown timer. A large rubber stamp descends from above stamping the air. The coin shrugs knowingly. Deep navy near-black background. Dramatic cinematic teal rim lighting. Knowing ironic mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. A glowing teal Kaspa coin character stands on a stage facing a huge excited crowd all pointing at a glowing countdown timer. A large rubber stamp descends from above stamping the air. The coin shrugs knowingly. Deep navy near-black background. Dramatic cinematic teal rim lighting. Knowing ironic mood. No text or words anywhere in the image.',
    refImage: null,
  },
  {
    hookSnippet: 'The Kaspa hard fork is 23 days out.',
    uuid: 'c6513e28', slug: 'kaspa-hard-fork-countdown-no-pump',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A glowing teal Kaspa coin character stands confidently in front of a large countdown timer. An excited crowd surrounds it expecting a celebration. The coin raises one eyebrow knowingly, unmoved by the hype. Deep navy near-black background. Dramatic cinematic teal rim lighting. Wise knowing mood. No text or words anywhere in the image.',
    igPrompt: null,
    refImage: null,
  },
  {
    hookSnippet: "'We could be dead in two days",
    uuid: 'c929e08f', slug: 'iran-geopolitical-calculus-chess',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. Two opposing chess piece characters face each other across a chessboard set in a dramatic desert landscape at night. Both look calculating and tense, each weighing impossible choices. A glowing gold Bitcoin coin observes calmly from the sidelines. Deep navy near-black background. Dramatic cinematic moonlit tension lighting. Tense strategic mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. Two opposing chess piece characters face each other across a chessboard set in a dramatic desert landscape at night. Both look calculating and tense, each weighing impossible choices. A glowing gold Bitcoin coin observes calmly from the sidelines. Deep navy near-black background. Dramatic cinematic moonlit tension lighting. Tense strategic mood. No text or words anywhere in the image.',
    refImage: null,
  },
  {
    hookSnippet: 'Theory on why this Iran ceasefire keeps holding',
    uuid: '6fc77eea', slug: 'iran-ceasefire-targeted-leadership-theory',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. Two opposing military chess piece characters sit across a table in a tense but stable ceasefire meeting. Both look uncomfortable but restrained. A spotlight clearly illuminates each one. The tension is palpable but neither moves. Deep navy near-black background. Dramatic cinematic cool blue rim lighting. Tense cautious mood. No text or words anywhere in the image.',
    igPrompt: null,
    refImage: null,
  },
  {
    hookSnippet: '$TAO might win the absolute mcap race',
    uuid: 'a881e0c8', slug: 'tao-kas-different-finish-lines',
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. Two coin characters race on parallel tracks with separate finish lines. A large TAO coin crosses the market cap finish line first, raising a trophy. A teal Kaspa coin crosses a different multiplier finish line at the same moment, holding an even bigger trophy and grinning wider. Both win in their own category. Deep navy near-black background. Dramatic cinematic teal and blue rim lighting. Competitive triumphant mood. No text or words anywhere in the image.',
    igPrompt: 'Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. Two coin characters race on parallel tracks with separate finish lines. A large TAO coin crosses the market cap finish line first, raising a trophy. A teal Kaspa coin crosses a different multiplier finish line at the same moment, holding an even bigger trophy and grinning wider. Both win in their own category. Deep navy near-black background. Dramatic cinematic teal and blue rim lighting. Competitive triumphant mood. No text or words anywhere in the image.',
    refImage: null,
  },
];

// ── JSON helpers ──────────────────────────────────────────────────────────────
function updateTweetJson(hookSnippet, uuid, slug) {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t =>
    (t.status === 'pending') &&
    (t.tweet || t.hook || '').includes(hookSnippet)
  );
  if (!tweet) { console.log(`  ⚠ Tweet not found for hook: ${hookSnippet.slice(0, 50)}`); return; }
  tweet.image_id   = uuid;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${uuid}-${slug}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ tweet updated: ${(tweet.hook || '').slice(0, 55)}`);
}

function updateIgJson(hookSnippet, uuid, slug) {
  const igId = IG_HOOK_MAP[hookSnippet];
  if (!igId) return;
  const ig   = JSON.parse(fs.readFileSync(IG_JSON, 'utf8'));
  const post = ig.posts.find(p => p.id === igId);
  if (!post) { console.log(`  ⚠ IG post not found: ${igId}`); return; }
  if (post.image_id) { console.log(`  ℹ IG already has image: ${igId}`); return; }
  post.image_id     = uuid;
  post.image_path   = `schedule-tweets/images/ig/ig-single-${uuid}-${slug}.png`;
  post.aspect_ratio = '4:5';
  fs.writeFileSync(IG_JSON, JSON.stringify(ig, null, 2));
  console.log(`  ✓ IG updated: ${igId}`);
}

// ── Upload reference image before typing prompt ───────────────────────────────
async function uploadReference(page, refPath) {
  console.log(`     Uploading reference: ${path.basename(refPath)}`);
  try {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles(refPath);
    await page.waitForTimeout(4000);
    console.log('     Reference uploaded ✓');
  } catch (e) {
    console.warn(`     Reference upload failed (${e.message.split('\n')[0]}) — continuing without it`);
  }
}

// ── Generate one image on the already-open page ───────────────────────────────
async function generateOne(page, { targetPath, prompt, refImage, label }) {
  console.log(`\n  → ${label}`);
  console.log(`     Target: ${path.basename(targetPath)}`);

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

  // Let any in-flight requests settle before baselining
  await page.waitForTimeout(2000);
  const baseline     = new Set(seenUrls);
  const promptSentAt = Date.now();

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();

  // Upload reference image if provided
  if (refImage) await uploadReference(page, refImage);

  // Type prompt character by character — 10–30ms per char
  for (const char of prompt) {
    await page.keyboard.type(char);
    await page.waitForTimeout(Math.floor(Math.random() * 21) + 10);
  }
  await page.keyboard.press('Enter');
  console.log(`     Prompt sent — waiting for image...`);

  // Wait for a new image URL that arrived at least MIN_GEN_MS after the prompt
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

  if (!imgUrl) throw new Error(`Timed out waiting for image: ${label}`);

  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error(`Empty buffer: ${label}`);

  fs.writeFileSync(targetPath, buffer);
  console.log(`     Saved: ${(buffer.length / 1024).toFixed(0)} KB`);

  // Human-like pause before next prompt — 20–30s
  const pauseMs = Math.floor(Math.random() * 11000) + 20000;
  console.log(`     Waiting ${(pauseMs / 1000).toFixed(1)}s before next prompt...`);
  await page.waitForTimeout(pauseMs);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Batch: ${IMAGES.length} images (2 TROLL regen + 8 missing)`);
  console.log(`${'━'.repeat(60)}\n`);

  console.log('Launching Chrome (once)...');
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

  // Block sidebar images during initial load so baseline is clean
  const imgPattern = `**/*${IMAGE_PATTERN}*`;
  await page.route(imgPattern, route => route.abort());
  console.log(`Navigating to chat: ${CHAT_URL}`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready. Starting batch...\n');

  let successCount = 0;
  let failCount    = 0;

  for (let i = 0; i < IMAGES.length; i++) {
    const { hookSnippet, uuid, slug, xPrompt, igPrompt, refImage } = IMAGES[i];

    console.log(`${'─'.repeat(60)}`);
    console.log(`[${i + 1}/${IMAGES.length}] ${uuid} — ${slug}`);

    // X tweet image (1:1)
    const xPath = path.join(IMAGES_DIR, 'x', `x-tweets-${uuid}-${slug}.png`);
    try {
      await generateOne(page, { targetPath: xPath, prompt: xPrompt, refImage, label: `X 1:1 — ${slug}` });
      updateTweetJson(hookSnippet, uuid, slug);
      successCount++;
    } catch (err) {
      console.error(`  ✗ X failed: ${err.message}`);
      failCount++;
    }

    // IG companion (4:5) if applicable
    if (igPrompt) {
      const igPath = path.join(IMAGES_DIR, 'ig', `ig-single-${uuid}-${slug}.png`);
      try {
        await generateOne(page, { targetPath: igPath, prompt: igPrompt, refImage, label: `IG 4:5 — ${slug}` });
        updateIgJson(hookSnippet, uuid, slug);
        successCount++;
      } catch (err) {
        console.error(`  ✗ IG failed: ${err.message}`);
        failCount++;
      }
    }
  }

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Done. ✓ ${successCount} saved  ✗ ${failCount} failed`);
  console.log(`${'━'.repeat(60)}\n`);

  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
