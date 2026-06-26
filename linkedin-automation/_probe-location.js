// _probe-location.js — diagnostic v2: find where the location text actually lives.
//   node linkedin-automation/_probe-location.js [profileUrl] [needle]
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', 'schedule-tweets', 'node_modules', 'playwright'));
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\li-bot-profile';
const URL = process.argv[2] || 'https://www.linkedin.com/in/williamhgates/';
const NEEDLE = process.argv[3] || 'Seattle';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages()[0] || await browser.newPage();
  try {
    console.log('goto', URL);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);

    // Frames
    console.log('\nFRAMES:', page.frames().length);
    page.frames().forEach((fr, i) => console.log(`   [${i}] ${fr.url().slice(0, 80)}`));

    // Whole-document signal
    const diag = await page.evaluate((needle) => {
      const body = document.body ? document.body.innerText : '';
      const spans = document.querySelectorAll('span').length;
      const h1 = document.querySelectorAll('h1').length;
      const main = document.querySelector('main');
      return {
        bodyLen: body.length,
        hasNeedle: body.includes(needle),
        hasGates: body.includes('Bill Gates'),
        totalSpans: spans,
        totalH1: h1,
        mainText: main ? main.innerText.slice(0, 300) : '(no <main>)',
        bodyHead: body.slice(0, 200),
      };
    }, NEEDLE);
    console.log('\nDIAG:', JSON.stringify(diag, null, 2));

    // Locate the element that directly contains the needle
    const hits = await page.evaluate((needle) => {
      const out = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walk.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes(needle)) {
          const el = node.parentElement;
          out.push({
            text: node.nodeValue.trim().slice(0, 80),
            tag: el.tagName,
            cls: el.className,
            parentTag: el.parentElement ? el.parentElement.tagName : '',
            parentCls: el.parentElement ? el.parentElement.className : '',
          });
        }
      }
      return out.slice(0, 8);
    }, NEEDLE).catch(e => 'ERR ' + e.message);
    console.log('\nNEEDLE HITS:', JSON.stringify(hits, null, 2));

    console.log('\nBrowser open 25s for inspection...');
    await page.waitForTimeout(25000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
