// Renders each .frame#<slug> in containers-vertical.html to <slug>.png (2160x3840) into ../../assets-vertical/deck/.
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path'); const fs = require('fs');
const OUT = path.resolve(__dirname, '../../assets-vertical/deck');
fs.mkdirSync(OUT, { recursive: true });
const ALL = ['backers','business-vs-token','code-questioned','competition','depends','dyor-cta',
  'float-fixed','flywheel-buyback','flywheel-staking','good-bad-why','history-timeline','insiders',
  'link-fixed','nacha-ach','one-sentence','other-way-around','parabolic-ponder','payfi','payroll-stream',
  'penny-stock-q','price-vs-mcap','real-real-real','serious-names','small-rail','solana-chip','split-adjusted',
  'squint','still-has-to','the-knock','title-question','trust-question','under-the-hood','usd1-tailwind',
  'vertical-zbcn','who-runs-it','why-bullish','sam-vs-simon','zebec-stack','nacha-member'];
const SLUGS = process.argv[2] ? process.argv[2].split(',') : ALL;
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'containers-vertical.html').replace(/\\/g, '/'), { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1400);
  let ok = 0, fail = 0;
  for (const s of SLUGS) {
    const el = page.locator('#' + s); if (await el.count() !== 1) { console.log('MISSING ' + s); fail++; continue; }
    await el.screenshot({ path: path.join(OUT, s + '.png') });
    console.log('OK ' + s + '  ' + Math.round(fs.statSync(path.join(OUT, s + '.png')).size / 1024) + 'KB'); ok++;
  }
  await b.close(); console.log('DONE ok=' + ok + ' fail=' + fail);
})();
