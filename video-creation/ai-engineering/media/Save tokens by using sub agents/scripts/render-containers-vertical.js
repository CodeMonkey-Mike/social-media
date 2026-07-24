// render-containers-vertical.js — screenshot each #cNN from deck/containers-vertical.html to
// render-assets/vertical/container-NN.png at 1080x1920 @2x. Usage: node scripts/render-containers-vertical.js [NN]
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../../../schedule-tweets/node_modules/playwright'));

const HERE = path.resolve(__dirname, '..');
const HTML = 'file://' + path.join(HERE, 'deck', 'containers-vertical.html').replace(/\\/g, '/');
const OUT = path.join(HERE, 'render-assets', 'vertical');
const only = process.argv[2] ? String(process.argv[2]).padStart(2, '0') : null;

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const ids = await page.$$eval('section.frame', els => els.map(e => e.id));
  let done = 0;
  for (const id of ids) {
    const nn = id.replace('c', '');
    if (only && nn !== only) continue;
    const el = await page.$('#' + id);
    const out = path.join(OUT, `container-${nn}.png`);
    await el.screenshot({ path: out });
    done++;
    console.log('rendered', id, '->', path.basename(out));
  }
  await browser.close();
  console.log(`\nDONE: ${done} vertical container(s) -> ${OUT}`);
})().catch(e => { console.error(e); process.exit(1); });
