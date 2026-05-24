// inspect-fb-video.js <url> — READ-ONLY. Opens a FB video/reel URL and reports the
// caption, video duration, and pixel dimensions so we can confirm a landscape longform
// posted correctly (vs. being mangled into a short vertical Reel).
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\fbbot-profile';
const url = process.argv[2];
if (!url) { console.error('usage: node inspect-fb-video.js <url>'); process.exit(1); }

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`HTTP ${resp ? resp.status() : '?'} — ${url}`);
    await page.waitForTimeout(7000);
    // Try to coax the video element to load metadata
    const info = await page.evaluate(async () => {
      const v = document.querySelector('video');
      let vid = null;
      if (v) {
        if (isNaN(v.duration) || !v.duration) { try { v.muted = true; await v.play().catch(()=>{}); await new Promise(r=>setTimeout(r,1500)); v.pause(); } catch {} }
        vid = { duration: v.duration, w: v.videoWidth, h: v.videoHeight };
      }
      const metaW = document.querySelector('meta[property="og:video:width"]');
      const metaH = document.querySelector('meta[property="og:video:height"]');
      const ogDur = document.querySelector('meta[property="video:duration"], meta[property="og:video:duration"]');
      const desc  = document.querySelector('meta[property="og:description"], meta[name="description"]');
      const title = document.querySelector('meta[property="og:title"]');
      // grab visible caption-ish text from the main article
      const art = document.querySelector('[role="main"]') || document.body;
      const text = (art.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300);
      return {
        videoEl: vid,
        ogWidth: metaW && metaW.content, ogHeight: metaH && metaH.content,
        ogDuration: ogDur && ogDur.content,
        ogTitle: title && title.content,
        ogDesc: desc && desc.content,
        visibleText: text,
      };
    });
    const dur = (info.videoEl && info.videoEl.duration) || (info.ogDuration ? parseFloat(info.ogDuration) : null);
    const w = (info.videoEl && info.videoEl.w) || (info.ogWidth ? parseInt(info.ogWidth) : null);
    const h = (info.videoEl && info.videoEl.h) || (info.ogHeight ? parseInt(info.ogHeight) : null);
    console.log(`\nDuration: ${dur ? (Math.floor(dur/60)+'m'+Math.round(dur%60)+'s ('+Math.round(dur)+'s)') : 'unknown'}`);
    console.log(`Dimensions: ${w && h ? `${w}x${h}  (${w>=h ? 'LANDSCAPE/SQUARE' : 'VERTICAL'}, ratio ${(w/h).toFixed(2)})` : 'unknown'}`);
    console.log(`og:title: ${info.ogTitle || '(none)'}`);
    console.log(`og:desc:  ${info.ogDesc ? info.ogDesc.slice(0,160) : '(none)'}`);
    console.log(`\nVisible text (first 300):\n  ${info.visibleText}`);
  } catch (e) {
    console.error('inspect error:', e.message);
  } finally {
    await browser.close();
  }
})();
