// Mobile-view receipt capture v2: iPhone emulation, dismiss consent/modals, frame the article
// headline+lede band. Usage: node _cap-receipt.js <url> <outPng> [bandCSSpx=1500]
const { chromium, devices } = require('playwright');
const iphone = devices['iPhone 13 Pro'];
const [,, URL, OUT, BAND] = process.argv;
const BANDH = parseInt(BAND || '1500', 10);

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await browser.newContext({
    ...iphone,
    viewport: { width: 390, height: BANDH },   // tall viewport so one shot holds headline+lede+hero
    locale: 'en-US',
  });
  const page = await ctx.newPage();
  try { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  catch (e) { console.log('goto warn:', e.message.split('\n')[0]); }
  await page.waitForTimeout(5000);

  // 1) click consent / cookie buttons across frames
  const CONSENT = [/accept all/i, /accept cookies/i, /i accept/i, /^agree$/i, /^i agree/i, /got it/i, /^accept$/i, /allow all/i, /continue to site/i, /no thanks/i];
  for (const fr of page.frames()) for (const re of CONSENT) {
    try { const b = fr.locator('button, [role=button]', { hasText: re }).first();
      if (await b.count() && await b.isVisible().catch(()=>false)) { await b.click({ timeout: 2000 }).catch(()=>{}); await page.waitForTimeout(500); } } catch {}
  }
  await page.keyboard.press('Escape').catch(()=>{});

  // 2) hide ONLY overlays/modals/paywalls/ads/newsletter — do NOT touch normal content layout
  await page.evaluate(() => {
    const sel = ['[id*="onetrust" i]','[class*="onetrust" i]','[id*="cookie" i]','[class*="cookie-banner" i]',
      '[class*="paywall" i]','[id*="paywall" i]','[class*="piano" i]','[aria-modal="true"]',
      '[class*="newsletter-modal" i]','[class*="subscribe-modal" i]'];
    for (const s of sel) document.querySelectorAll(s).forEach(el => { try { el.remove(); } catch {} });
  }).catch(()=>{});
  await page.waitForTimeout(800);

  // 3) find the article headline: the visible <h1> with the most text, then scroll it near the top
  const ok = await page.evaluate(() => {
    const h1s = [...document.querySelectorAll('h1')].filter(h => {
      const r = h.getBoundingClientRect(); const cs = getComputedStyle(h);
      return h.innerText.trim().length > 12 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.width > 40;
    });
    if (!h1s.length) return false;
    h1s.sort((a,b) => b.innerText.trim().length - a.innerText.trim().length);
    const h = h1s[0];
    const y = h.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, y - 230));   // leave room above the headline to clear a multi-row sticky nav
    return true;
  }).catch(()=>false);
  console.log('headline located:', ok);
  await page.waitForTimeout(1500);

  // 4) LATE dismissal — timed promo modals (e.g. Forbes Wine Club) appear after the first pass
  const LATE = [/no thanks/i, /maybe later/i, /^close$/i, /dismiss/i, /not now/i];
  for (const re of LATE) {
    try { const b = page.locator('button, a[role=button], [role=button]', { hasText: re }).first();
      if (await b.count() && await b.isVisible().catch(()=>false)) { await b.click({ timeout: 2000 }).catch(()=>{}); await page.waitForTimeout(500); } } catch {}
  }
  try { const x = page.locator('[aria-label*="close" i], button[title*="close" i]').first();
    if (await x.count() && await x.isVisible().catch(()=>false)) { await x.click({ timeout: 2000 }).catch(()=>{}); } } catch {}
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(() => { document.querySelectorAll('[role="dialog"],[aria-modal="true"]').forEach(el => { try { el.remove(); } catch {} }); }).catch(()=>{});
  await page.waitForTimeout(700);

  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 390, height: BANDH } });
  console.log('saved', OUT);
  await browser.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
