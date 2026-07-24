const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path'); const fs = require('fs');
const SLUGS = ['traction-scoreboard','buyback-flywheel','demand-vs-float'];
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await b.newPage({ viewport: { width: 1920, height: 1120 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'charts.html').replace(/\\/g, '/'), { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1400);
  for (const s of SLUGS) {
    await page.locator('#' + s).screenshot({ path: path.join(__dirname, s + '.png') });
    console.log('OK ' + s + '  ' + Math.round(fs.statSync(path.join(__dirname, s + '.png')).size/1024) + 'KB');
  }
  await b.close();
})();
