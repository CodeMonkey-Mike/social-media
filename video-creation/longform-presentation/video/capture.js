// Deterministic frame capture for presentation-video.html
// Usage:
//   node capture.js sample      -> one frame at the middle of each of the 9 scenes (frames-sample/)
//   node capture.js full        -> all frames at 30fps for 60s (frames/)
const path = require('path');
const PW = 'C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright';
const { chromium } = require(PW);
const CHROME = 'C:/Users/mnede/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';

const HTML = 'file://' + path.resolve(__dirname, 'presentation-video.html').replace(/\\/g, '/') + '#capture';
const FPS = 30;
const TOTAL = 60;

const SCENES = [
  { start: 0, dur: 6 }, { start: 6, dur: 7 }, { start: 13, dur: 8 },
  { start: 21, dur: 6 }, { start: 27, dur: 6 }, { start: 33, dur: 7 },
  { start: 40, dur: 6 }, { start: 46, dur: 7 }, { start: 53, dur: 7 },
];

(async () => {
  const mode = process.argv[2] || 'sample';
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // let webfonts paint

  const pad = (n, w) => String(n).padStart(w, '0');

  if (mode === 'sample') {
    const outDir = 'frames-sample';
    for (let i = 0; i < SCENES.length; i++) {
      const t = SCENES[i].start + Math.min(2.2, SCENES[i].dur - 0.5);
      await page.evaluate(tt => window.renderFrame(tt), t);
      await page.waitForTimeout(30);
      await page.screenshot({ path: `${outDir}/scene-${pad(i, 2)}.png` });
      console.log('sample scene', i, '@', t.toFixed(2) + 's');
    }
  } else {
    const total = Math.round(TOTAL * FPS);
    const t1 = Date.now();
    for (let f = 0; f < total; f++) {
      const t = f / FPS;
      await page.evaluate(tt => window.renderFrame(tt), t);
      await page.screenshot({ path: `frames/f${pad(f, 5)}.png` });
      if (f % 150 === 0) console.log(`frame ${f}/${total} (${(f / FPS).toFixed(1)}s)`);
    }
    console.log('done', total, 'frames in', ((Date.now() - t1) / 1000).toFixed(1) + 's');
  }

  await browser.close();
})();
