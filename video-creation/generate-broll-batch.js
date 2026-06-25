// generate-broll-batch.js
// Opens the B-roll chat once, generates all images in sequence, saves them.
// Each image: type prompt → wait for generation → download → save → repeat.
//
// OUTPUT DIR (must be a batch's OWN render-assets — NEVER the shared assets root or assets/projects/;
// see SKILL.md "Asset folder organization"). Pass one of:
//   --batch=<id>     SHORTS: writes to video-creation/shorts/<id>/render-assets/
//   --outdir=<abs>   LONGFORM/PERSONA: the project's own render-assets/ folder
// The script REFUSES to write under video-creation/assets/ (the old root-dump regression).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT_URL          = 'https://chatgpt.com/c/6a0deddf-1bac-83ea-8107-0e419a2c44ac';
const IMAGE_URL_PATTERN = 'estuary/content';
const MIN_GEN_DELAY_MS  = 10000;
const MAX_WAIT_MS       = 5 * 60 * 1000;

const VIDEO_CREATION = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation';
const ASSETS_ROOT    = path.join(VIDEO_CREATION, 'assets');
const ARGS = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));
const ASSETS_DIR = ARGS.outdir
  ? path.resolve(ARGS.outdir)
  : ARGS.batch ? path.join(VIDEO_CREATION, 'shorts', String(ARGS.batch), 'render-assets')
  : null;
if (!ASSETS_DIR) {
  console.error('ERROR: pass --batch=<id> (SHORTS → shorts/<id>/render-assets/) or --outdir=<abs> (LONGFORM/PERSONA → the project folder).');
  process.exit(2);
}
{
  const norm = (p) => path.resolve(p).replace(/[\\/]+$/, '').toLowerCase();
  const out = norm(ASSETS_DIR), root = norm(ASSETS_ROOT);
  if (out === root || out.startsWith(root + path.sep)) {
    console.error(`ERROR: refusing to write b-roll anywhere under the shared assets tree (${ASSETS_DIR}). Use --batch=<id> or --outdir at the project folder.`);
    process.exit(2);
  }
}

const SEL = {
  composer: '#prompt-textarea, div[contenteditable="true"][data-id]',
};

// ── Image list ────────────────────────────────────────────────────────────────
// Each entry: { file, prompt }
// Prompts: 9:16 vertical, cinematic, dark background, no text unless specified.

const IMAGES = [
  // ── keycat-vs-doginme (meme-coins batch, clip 1) — DONE, skipped on re-run ───
  {
    file: 'broll-doginme-vs-keycat-hook.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic stadium face-off between two cartoon Solana meme-coin characters: on the LEFT, a hulking blue muscular cartoon PITBULL DOG character — heavily muscular bodybuilder physique with massive arms, chest, and abs, navy and royal blue colours, bold black cartoon outlines, confident pointing pose (representing DOG IN ME). On the RIGHT, a glowing orange cartoon tabby cat holding a large gold key in its paw (representing KEYCAT). Electric lightning arcs between them. Dark stadium showdown background, dramatic teal and gold rim lighting, volumetric fog. Bold cartoon comic-book illustration style, vivid colours, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-keycat-chart.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing orange cartoon tabby cat holding a large shining gold key, standing in front of a steep upward-rising green price chart line that climbs from bottom-left to top-right. Bright orange and gold accent lighting, dark space background with subtle chart grid lines. Photorealistic 3D render, 8K. No text.',
  },
  {
    file: 'broll-doginme-rocket.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A hulking blue muscular cartoon PITBULL DOG character — heavy bodybuilder physique with massive arms and chest, navy and royal blue colours, bold black cartoon outlines, flexing triumphantly (representing DOG IN ME) — riding on top of a sleek silver rocket ship blasting straight up through space. Bright orange and red rocket exhaust trails behind, motion streaks. Dark space with stars. Dramatic teal and red neon rim lighting. Bold cartoon comic-book illustration style, vivid colours, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-doginme-coinbase.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing blue circular Coinbase-style exchange logo (a simple lowercase letter c in a blue circle, no other text) dominates the centre. In front of the logo, a hulking blue muscular cartoon PITBULL DOG character — bodybuilder physique with massive arms and chest, navy and royal blue colours, bold black cartoon outlines, confident pointing pose (representing DOG IN ME) — stands triumphantly. Bright Coinbase-blue neon lighting, dark cinematic background. Bold cartoon comic-book illustration style, vivid colours, 8K.',
  },
  {
    file: 'broll-doginme-winner.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A hulking blue muscular cartoon PITBULL DOG character (DOG IN ME) — heavy bodybuilder physique with massive arms, chest, and abs, navy and royal blue colours, bold black cartoon outlines, wearing a golden champion crown, flexing both arms in victory — standing on top of a tall pile of glowing gold cryptocurrency coins. Bright golden victory light rays radiate outward. Confetti and sparks. Dark cinematic background. Bold cartoon comic-book illustration style, vivid colours, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'overlay-doginme-character.png',
    prompt: 'Vertical 9:16 portrait. A single hulking blue muscular cartoon PITBULL DOG character (DOG IN ME) — heavy bodybuilder physique with massive arms, chest, and abs, navy and royal blue body colours, bold thick black cartoon outlines, confident pointing pose, fully visible from head to waist, brightly glowing and fully opaque, centered in the frame on a PURE SOLID BLACK (#000000) background and nothing else, no checkerboard, no other elements, no text. Bold cartoon comic-book illustration style, vivid saturated colours, dramatic teal and white rim glow around the character.',
  },
  {
    file: 'broll-nfa-warning.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive glowing red caution warning triangle with a bright yellow exclamation mark in the centre, dominating the frame. Behind it, dramatic motion-streak background of swirling red and yellow danger lighting. Sparks and flashing alarm beams. Dark moody background. Photorealistic 8K render. No text other than the exclamation mark.',
  },

  // ── house-coin-1000x (meme-coins batch, clip 4) ──────────────────────────────
  {
    file: 'broll-house-vs-haters.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive glowing teal/cyan luxury mansion built from cryptocurrency coins floats triumphantly in the centre. Surrounding it on the ground, a crowd of small dark angry stick-figure crypto-influencer haters with red glowing eyes wave fists at the house. Dramatic teal up-lighting on the house, red ground-lighting on the haters. Dark moody background, volumetric fog. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-house-rocksolid.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal/cyan luxury cryptocurrency mansion (HOUSECOIN) sits on top of a massive solid bedrock platform. Floating around the house are multiple stylized crypto exchange logo discs (generic dark circular icons with letters like C, B, K, OK glowing in different colours). Teal neon glow on the house, cool blue rim lighting on the exchanges. Dark cinematic background. Photorealistic 3D render, 8K. No text other than single-letter exchange logos.',
  },
  {
    file: 'broll-house-1000x-rocket.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal cryptocurrency mansion (HOUSECOIN) strapped to the nose of a massive silver rocket ship blasting straight up through space, leaving a fire trail behind. A dark grizzly bear is being left behind in the bottom of the frame, faded and small. Bright green upward price chart lines surge in the background. Dramatic teal and orange rocket lighting. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-house-500x-half.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A split scene: on the left, a tall glowing teal cryptocurrency mansion (HOUSECOIN) labelled with a big bright "500X" multiplier glowing above it; on the right, a smaller faded house also glowing teal with a smaller "50X" label, both rising on green upward chart lines. Dark cinematic background, teal accent lighting. Photorealistic 3D render, 8K. The only text in the image is "500X" and "50X" as multipliers.',
  },
  {
    file: 'broll-house-already-5x.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal cryptocurrency mansion (HOUSECOIN) sitting on a winners podium with gold confetti raining down. Behind it, a green upward-spiking price chart shows the journey from a small base to a tall peak. Bright teal and gold celebratory lighting, dark cinematic background. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },

  // ── stop-hating-build-business (meme-coins batch, clip 2 — content-zone only,
  //    hyper-realistic photographs, no crypto theme, no neon, no cartoon style)
  {
    file: 'broll-bizp1-envious-scroll.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. A regular working-age man sitting on a worn couch in a dim living room at night, hunched over his phone with a frustrated, envious expression on his face, glow from the phone screen on his face. Natural domestic lighting only — a small lamp in the background. Cluttered apartment in the background. Real person, not a model. Slight grain. No text, no logos, no graphics.',
  },
  {
    file: 'broll-bizp2-hating.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. The same regular working-age man pacing in a cluttered apartment, looking visibly resentful and angry, fists slightly clenched, scowling. Natural late-evening interior light. Real person, candid, not posed. Slight grain. No text, no logos, no graphics.',
  },
  {
    file: 'broll-bizp3-decide-act.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. A regular working-age man sitting at a simple wooden desk in a quiet room, with a notebook open and a pen in his hand, looking determined and thoughtful — the visible moment of deciding to take action. Soft warm window light from one side. Real person, candid. Slight grain. No text, no logos, no graphics.',
  },
  {
    file: 'broll-bizp4-hands-work.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. Close-up of a regular person\'s hands doing skilled physical work in a workshop — sanding a piece of wood, or assembling a bicycle, or shaping clay. Strong natural light from a workshop window. Real hands with calluses and dirt, not staged. Slight grain. No text, no logos, no graphics.',
  },
  {
    file: 'broll-bizp5-skill-learn.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. A regular working-age person at a laptop in a tidy room, focused intently, with an open notebook beside the laptop and pages full of handwritten notes. Soft daylight from a window. Real person, candid, not staged. Slight grain. No text on screens, no logos, no graphics.',
  },
  {
    file: 'broll-bizp6-compound-growth.png',
    prompt: 'Hyper-realistic documentary-style vertical 9:16 photograph. The same regular working-age man some time later — confident posture, slightly better fitting clothes, standing in a cleaner organised space (perhaps a small workshop or office he built), looking satisfied and grounded. Warm natural daylight. Real person, candid. Slight grain. No text, no logos, no graphics.',
  },

  // ── pengu-flips-pepe (meme-coins batch, clip 3 — extends existing 3 PENGU pngs)
  {
    file: 'broll-pengu-vs-toshi.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A dramatic face-off between two cartoon meme-coin characters: on the LEFT, a glowing teal cartoon PENGUIN character labelled PENGU, larger and triumphant; on the RIGHT, a smaller glowing blue cartoon TOSHI cat character (a small cat sitting), looking up. Lightning between them. Dark stadium-showdown background, teal and blue rim lighting, volumetric fog. Photorealistic 3D render, ultra-dramatic, 8K. No text other than the labels PENGU and TOSHI.',
  },
  {
    file: 'broll-shib-40b.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A massive glowing orange Shiba Inu dog cartoon character (SHIB / Shiba Inu meme coin) holding up a huge floating glowing teal sign that displays "$40B" market cap. Bright orange and gold celebratory lighting, green upward chart lines in the background. Dark cinematic background. Photorealistic 3D render, ultra-dramatic, 8K. Text in the image is only "$40B".',
  },
  {
    file: 'broll-pengu-40b.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing teal cartoon PENGUIN (PENGU meme coin) standing triumphantly on top of a massive glowing teal "$40B" market cap sign. Bright teal and gold celebratory light radiates outward. Green upward-spiking price chart line in the background. Dark cinematic background, confetti and sparks. Photorealistic 3D render, ultra-dramatic, 8K. Text in the image is only "$40B".',
  },

  // ── pythia-28x (meme-coins batch, clip 5) ────────────────────────────────────
  {
    file: 'broll-pythia-hook.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing futuristic AI human brain made of bright blue circuits and neural pathways floats in deep space. The Greek letter pi (π) glows white-hot at the centre of the brain. Bright cyan and electric blue neural energy streams radiate outward. Dark cinematic space background with stars. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-pythia-brain.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A neuroscience laboratory visualization: a translucent glowing human brain hovers above a futuristic glass platform, surrounded by holographic blue circuit diagrams and DNA helixes. Wires connect from the brain to a central glowing core. Cyan and electric blue lab lighting, dark moody background. Photorealistic 3D render, 8K. No text.',
  },
  {
    file: 'broll-pythia-rodent.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A cute white lab rat character with bright glowing blue neural-interface electrodes attached to its head, sitting on a futuristic glowing platform. Above the rat\'s head, a translucent blue brain hologram floats. Cyan and electric blue neural lighting, dark cinematic lab background. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-pythia-comeback.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing blue Greek letter pi (π) coin riding on top of a comeback rocket blasting upward through space, leaving a bright fire trail. A bright green upward-surging price chart line forms the background behind the rocket. Cyan and electric blue neon glow. Dark cinematic space background. Photorealistic 3D render, ultra-dramatic, 8K. No text.',
  },
  {
    file: 'broll-pythia-community.png',
    prompt: 'Cinematic vertical 9:16 portrait image. A glowing crowd of small triumphant stick-figure community members raising their arms in celebration, all bathed in bright cyan and electric blue light. A massive glowing Greek letter pi (π) symbol floats above them. Confetti and sparks. Dark cinematic background. Photorealistic 3D render, 8K. No text.',
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
