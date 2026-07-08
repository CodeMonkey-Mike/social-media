// lipsync-create.js — drive the ElevenLabs Image & Video > Lip sync playground (UI-only, no API)
// to set up a Creatify Aurora lip-sync from a face IMAGE + a Speech AUDIO file, then optionally
// Generate. Real Chrome via elevenlabs-profile (run setup-elevenlabs.js once to log in).
//
// Anti-automation (per house pattern, like schedule-tweets/scripts/post-*.js):
//   - real Chrome, AutomationControlled disabled, navigator.webdriver masked
//   - hover -> randomized pause -> click on every interaction
//   - randomized action pauses between steps
//   - per-character typing for any text entry
//
// Usage:
//   node lipsync-create.js --image <face.png> --audio <line.wav> [--model "Creatify Aurora"]
//        [--prompt "optional guidance"] [--generate]
//   For VIDEO->lipsync models (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync), pass a driving clip with
//   --video <clip.mp4> instead of --image (those models expose a video file input, not an image one).
//   Default STAGES everything and STOPS before Generate (paid action). Add --generate to submit.

const { chromium } = require('playwright');
const fs = require('fs');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
const URL = 'https://elevenlabs.io/app/image-video';
const MODELS_RE = /Veed Fabric|Creatify Aurora|OmniHuman|Sync \d|Sync Lipsync|HeyGen|Veed Lipsync/;

function arg(name, dflt) { const i = process.argv.indexOf('--' + name); return i > -1 ? process.argv[i + 1] : dflt; }
const IMAGE = arg('image', null);
const VIDEO = arg('video', null); // driving clip for video->lipsync models (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync)
const AUDIO = arg('audio', null);
const MODEL = arg('model', 'Creatify Aurora');
const PROMPT = arg('prompt', null);
const RES = arg('resolution', '480p'); // project rule: always 480p (Remotion upscales free; saves EL allowance)
const DO_GENERATE = process.argv.includes('--generate');
const FACE = IMAGE || VIDEO;
if (!FACE || !AUDIO || !fs.existsSync(FACE) || !fs.existsSync(AUDIO)) {
  console.error('Need valid --image OR --video, plus --audio paths.'); process.exit(1);
}

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pause = (page, lbl = '') => { const ms = rnd(1500, 4000); if (lbl) console.log(`  ~${(ms/1000).toFixed(1)}s ${lbl}`); return page.waitForTimeout(ms); };

async function humanClick(page, locator, lbl = '') {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator.hover().catch(() => {});
  await page.waitForTimeout(rnd(450, 1300));
  await locator.click();
  if (lbl) console.log(`  clicked: ${lbl}`);
  await page.waitForTimeout(rnd(400, 900));
}

async function typeHuman(page, locator, text) {
  await humanClick(page, locator, 'focus text field');
  for (const ch of text) { await page.keyboard.type(ch); await page.waitForTimeout(rnd(40, 120)); }
}

// Dismiss one-time announcement popovers/modals (radix popper) that intercept pointer events.
async function dismissPopovers(page) {
  for (let i = 0; i < 3; i++) {
    const popper = page.locator('[data-radix-popper-content-wrapper], [role="dialog"]').first();
    if (!(await popper.isVisible().catch(() => false))) {
      // also dismiss the GPT-Image launch promo specifically if its image is present
      const promo = page.locator('img[alt*="just launched" i]').first();
      if (!(await promo.isVisible().catch(() => false))) return;
    }
    // try a named close/dismiss button, else Escape, else click a neutral corner
    const btn = page.locator('button:has-text("Got it"), button:has-text("Dismiss"), button:has-text("Skip"), button:has-text("Maybe later"), button[aria-label*="close" i], button[aria-label*="dismiss" i]').first();
    if (await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); }
    else { await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(8, 8).catch(() => {}); }
    await page.waitForTimeout(rnd(600, 1100));
  }
  console.log('  dismissed announcement popover(s)');
}

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null, acceptDownloads: true,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();

  console.log('opening Image & Video...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pause(page, 'load');

  // 0) dismiss any one-time announcement popovers (e.g. "GPT Image 2 just launched!") that
  //    overlay a radix popper and intercept pointer events. (Appeared 2026-06-12.)
  await dismissPopovers(page);

  // 1) Lip sync modality
  await humanClick(page, page.locator('[role="radio"]:has-text("Lip sync"), button:has-text("Lip sync")').first(), 'Lip sync tab');
  await pause(page, 'modality');

  // 2) open model menu (pill shows current model) and pick MODEL
  const pill = page.locator('button').filter({ hasText: MODELS_RE }).first();
  const pillText = (await pill.innerText().catch(() => '')).trim();
  if (new RegExp(MODEL, 'i').test(pillText)) {
    console.log(`  model already "${pillText}"`);
  } else {
    await humanClick(page, pill, `model menu (was "${pillText}")`);
    await pause(page, 'model menu open');
    await humanClick(page, page.locator(`text=/${MODEL}/i`).first(), MODEL);
    await pause(page, 'model selected');
  }

  // 3) upload the face to the Avatar input, audio to the Speech (audio) input.
  //    VIDEO->lipsync models (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync) expose a video file input
  //    instead of an image one; pass --video for those, --image for image->lipsync models.
  if (VIDEO) {
    const vidInput = page.locator('input[type="file"][accept*="video"]').first();
    await vidInput.setInputFiles(VIDEO);
    console.log('  uploaded driving video:', VIDEO);
  } else {
    const imgInput = page.locator('input[type="file"][accept*="image"]').first();
    await imgInput.setInputFiles(IMAGE);
    console.log('  uploaded avatar image:', IMAGE);
  }
  await pause(page, 'avatar upload settle');

  const audInput = page.locator('input[type="file"][accept*="audio"]').first();
  await audInput.setInputFiles(AUDIO);
  console.log('  uploaded speech audio:', AUDIO);
  await pause(page, 'speech upload settle');

  // 4) optional guidance prompt
  if (PROMPT) {
    const box = page.locator('textarea, [contenteditable="true"], input[placeholder*="Guide" i]').first();
    if (await box.isVisible().catch(() => false)) await typeHuman(page, box, PROMPT);
    await pause(page, 'prompt typed');
  }

  // 5) set Resolution to 480p (project rule; composer defaults to 720p). NON-FATAL: never block Generate.
  try {
    const resPill = page.locator('[aria-label="Resolution"], button:has-text("720p"), button:has-text("1080p")').first();
    if (await resPill.isVisible().catch(() => false)) {
      const cur = (await resPill.innerText().catch(() => '')).trim();
      if (new RegExp(RES, 'i').test(cur)) { console.log(`  resolution already ${cur}`); }
      else {
        await humanClick(page, resPill, `resolution menu (was "${cur}")`);
        await pause(page, 'resolution menu');
        // click the visible menu option whose exact text is RES, by its center point (portal-safe)
        const pt = await page.evaluate((res) => {
          for (const e of document.querySelectorAll('*')) {
            if ((e.textContent || '').trim().toLowerCase() !== res.toLowerCase()) continue;
            const b = e.getBoundingClientRect();
            if (b.width < 3 || b.height < 3 || b.top > innerHeight || b.left > innerWidth) continue;
            const s = getComputedStyle(e);
            if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
            return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
          }
          return null;
        }, RES);
        if (pt) { await page.mouse.click(pt.x, pt.y); console.log(`  resolution set ${RES}`); await pause(page, 'res set'); }
        else { console.log(`  ${RES} option not found; pressing Escape, leaving default`); await page.keyboard.press('Escape').catch(() => {}); }
      }
    } else { console.log('  resolution control not found'); }
  } catch (e) { console.log('  resolution step skipped (non-fatal):', e.message); }

  await page.waitForTimeout(rnd(1800, 2800));
  await page.screenshot({ path: 'el-staged.png' });
  console.log('\nSTAGED. Screenshot: el-staged.png');

  // The submit control is an icon button (not text "Generate"); discover it robustly below.
  if (DO_GENERATE) {
    // log candidate submit buttons for the record
    const cands = await page.evaluate(() => [...document.querySelectorAll('button:not([disabled])')]
      .map(b => ({ t: (b.innerText||'').trim().slice(0,20), aria: b.getAttribute('aria-label')||'',
                   r: (() => { const x=b.getBoundingClientRect(); return [Math.round(x.right), Math.round(x.bottom)]; })() }))
      .filter(b => b.aria || b.t).slice(-12));
    console.log('  submit candidates (last 12 enabled):', JSON.stringify(cands));

    let clicked = false;
    const named = page.locator('button:has-text("Generate"), button[aria-label*="Generate" i], button[aria-label*="Create video" i], button[aria-label*="Submit" i]').first();
    if (await named.isVisible().catch(() => false)) {
      await humanClick(page, named, 'Generate (named)'); clicked = true;
    } else {
      // click the bottom-right enabled icon button directly via handle
      const handle = await page.evaluateHandle(() => {
        const btns = [...document.querySelectorAll('button:not([disabled])')];
        const vh = window.innerHeight; let best=null,bs=-1;
        for (const b of btns) { const r=b.getBoundingClientRect(); if(!r.width||r.top<vh*0.55) continue;
          if ((b.innerText||'').trim().length>2) continue; const s=r.right+r.bottom; if(s>bs){bs=s;best=b;} }
        return best;
      });
      const el = handle.asElement();
      if (el) { await el.hover().catch(()=>{}); await page.waitForTimeout(rnd(500,1200)); await el.click().catch(()=>{}); clicked = true; console.log('  clicked: submit (bottom-right icon)'); }
    }

    if (!clicked) { console.log('  could not locate submit control — left staged.'); }
    else {
      await page.waitForTimeout(rnd(1500, 2500));
      // one-time "Prohibited Use Policy" consent modal
      const consent = page.locator('button:has-text("Continue with Generation")').first();
      if (await consent.isVisible().catch(() => false)) {
        console.log('  policy consent modal -> Continue with Generation');
        await humanClick(page, consent, 'Continue with Generation');
      }
      console.log('  submitted. Waiting for render to register...');
      await page.waitForTimeout(10000);
      await page.screenshot({ path: 'el-generating.png' });
      const status = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e=>!e.children.length)
        .map(e=>(e.innerText||'').trim()).filter(t=>/Generating|Queued|Processing|In progress|%|remaining/i.test(t)&&t.length<40));
      console.log('  status hints:', JSON.stringify([...new Set(status)].slice(0,8)));
      console.log('  screenshot: el-generating.png (render runs server-side; check History / Assets)');
    }
    await page.waitForTimeout(4000);
  } else {
    console.log('Default = staged only. Re-run with --generate to submit.');
    await page.waitForTimeout(3000);
  }
  await browser.close();
})().catch(e => { console.error('lipsync-create failed:', e.message); process.exit(1); });
