// Renders each .frame#<slug> in containers.html to <slug>.png (3840x2160) in place.
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const SLUGS = [
  'backers','business-vs-token','code-questioned','competition','depends','dyor-cta',
  'float-fixed','flywheel-buyback','flywheel-staking','good-bad-why','history-timeline',
  'insiders','link-fixed','nacha-ach','one-sentence','other-way-around','parabolic-ponder',
  'payfi','payroll-stream','penny-stock-q','price-vs-mcap','real-real-real','serious-names',
  'small-rail','solana-chip','split-adjusted','squint','still-has-to','the-knock',
  'title-question','trust-question','under-the-hood','usd1-tailwind','vertical-zbcn',
  'who-runs-it','why-bullish','sam-vs-simon','zebec-stack','nacha-member'
];

(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await b.newPage({ viewport: { width: 1920, height: 1120 }, deviceScaleFactor: 2 });
  const url = 'file://' + path.join(__dirname, 'containers.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  let ok = 0, fail = 0;
  for (const s of SLUGS) {
    try {
      const el = page.locator('#' + s);
      const n = await el.count();
      if (n !== 1) { console.log('MISSING #' + s + ' (count=' + n + ')'); fail++; continue; }
      await el.screenshot({ path: path.join(__dirname, s + '.png') });
      const bytes = fs.statSync(path.join(__dirname, s + '.png')).size;
      console.log('OK   ' + s + '  ' + Math.round(bytes/1024) + 'KB');
      ok++;
    } catch (e) { console.log('FAIL ' + s + '  ' + e.message.split('\n')[0]); fail++; }
  }
  await b.close();
  console.log('\nDONE  ok=' + ok + '  fail=' + fail + '  of ' + SLUGS.length);
})();
