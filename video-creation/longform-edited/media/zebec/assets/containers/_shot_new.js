const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path');
const files = [
  'price-vs-mcap','title-question','good-bad-why','solana-chip','payfi','zebec-stack',
  'backers','real-real-real','serious-names','nacha-ach','usd1-tailwind','the-knock',
  'float-fixed','flywheel-buyback','flywheel-staking','one-sentence','depends','parabolic-ponder',
  'penny-stock-q','split-adjusted','insiders','trust-question','small-rail','under-the-hood',
  'code-questioned','dyor-cta','who-runs-it','squint','other-way-around','link-fixed',
  'why-bullish','still-has-to','vertical-zbcn'
];
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
    const url = 'file://' + path.join(__dirname, '_mock_' + f + '.html').replace(/\\/g, '/');
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(1800);
      await p.screenshot({ path: path.join(__dirname, f + '.png') });
      console.log('OK  ', f);
    } catch (e) { console.log('FAIL', f, e.message.split('\n')[0]); }
    await p.close();
  }
  await b.close();
})();
