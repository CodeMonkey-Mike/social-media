const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path');
const files = ['_mock_history-timeline', '_mock_payroll-stream', '_mock_competition', '_mock_business-vs-token'];
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
    const url = 'file://' + path.join(__dirname, f + '.html').replace(/\\/g, '/');
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(1800);
      await p.screenshot({ path: path.join(__dirname, f.replace('_mock_', '') + '.png') });
      console.log('OK ', f);
    } catch (e) { console.log('FAIL', f, e.message.split('\n')[0]); }
    await p.close();
  }
  await b.close();
})();
