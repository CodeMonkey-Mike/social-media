// Capture a real token price chart (CoinMarketCap/CoinGecko). Optionally clicks a timeframe button.
// Usage: node _capture_chart.js <url> <out> [--range ALL] [--full]
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const url = process.argv[2], out = process.argv[3];
const rangeIdx = process.argv.indexOf('--range');
const range = rangeIdx > -1 ? process.argv[rangeIdx + 1] : null;
const full = process.argv.includes('--full');
const CONSENT = ['Accept all', 'Accept All', 'I Accept', 'I agree', 'Agree', 'Accept', 'Got it', 'Allow all', 'Continue'];
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(4500);
    for (const label of CONSENT) {
      try { const b = page.getByRole('button', { name: label, exact: false }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1500 }); await page.waitForTimeout(700); break; } } catch (e) {}
    }
    // kill promo popups that cover the timeframe controls
    await page.evaluate(() => {
      [...document.querySelectorAll('div,section')].forEach(e => {
        const t = (e.innerText || '').trim();
        if ((t.startsWith('Trade on CoinMarketCap') || t.startsWith('Download the')) && t.length < 160) { try { e.remove(); } catch (x) {} }
      });
    });
    await page.waitForTimeout(400);
    if (range) {  // click the CHART timeframe span (the one in the 24h/1W/1M/1Y/All row, not a markets filter)
      const target = range === 'ALL' ? 'All' : range;
      const box = await page.evaluate((label) => {
        const spans = [...document.querySelectorAll('span')];
        const y1 = spans.find(s => s.textContent.trim() === '1Y');
        let cand = spans.filter(s => s.textContent.trim() === label);
        let pick = cand[0];
        if (y1 && cand.length) { const ry = y1.getBoundingClientRect().top;
          pick = cand.sort((a, b) => Math.abs(a.getBoundingClientRect().top - ry) - Math.abs(b.getBoundingClientRect().top - ry))[0]; }
        if (!pick) return null;
        const r = pick.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, target);
      if (box) { await page.mouse.click(box.x, box.y); await page.waitForTimeout(2800); console.log('  range clicked', Math.round(box.x) + ',' + Math.round(box.y)); }
      else console.log('  range NOT FOUND');
    }
    await page.evaluate(() => { for (const s of ['[id*="onetrust"]','[class*="cookie"]','[class*="consent"]','[class*="banner"]']) document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}}); });
    await page.waitForTimeout(600);
    await page.screenshot({ path: out, fullPage: full });
    console.log('OK', out, '| title:', (await page.title()).slice(0, 70));
  } catch (e) { console.log('FAIL', e.message.split('\n')[0]); }
  await browser.close();
})();
