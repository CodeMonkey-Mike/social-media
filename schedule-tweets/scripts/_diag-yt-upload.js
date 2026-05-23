// Diagnostic: open YT Studio upload dialog and dump all radio buttons, checkboxes,
// and buttons so we can find the correct selectors for audience + publish.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const path         = require('path');

const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const VIDEO          = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\shorts\\market-update-2026-05-20\\ai-job-market.mp4';

function isCDPReady() {
  return new Promise(resolve => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); resolve(true); });
    s.on('error', () => resolve(false));
    setTimeout(() => { try { s.destroy(); } catch {} resolve(false); }, 600);
  });
}

(async () => {
  if (!await isCDPReady()) {
    spawn(CHROME_EXE, [`--user-data-dir=${CHROME_PROFILE}`, `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run', '--disable-sync', 'about:blank'], { stdio: 'ignore' });
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isCDPReady()) break;
    }
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx  = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  await page.goto('https://studio.youtube.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Open create menu
  await page.locator('button[aria-label*="Create"]').first().click();
  await page.waitForTimeout(2000);

  // Click Upload videos
  await page.locator('tp-yt-paper-item:has-text("Upload videos")').first().click();
  await page.waitForTimeout(2000);

  // Attach file
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 15000 });
  await fileInput.setInputFiles(VIDEO);
  console.log('File attached — waiting for dialog...');

  // Wait for title field
  await page.waitForSelector('#title-textarea', { timeout: 30000 });
  await page.waitForTimeout(5000); // let the full dialog render

  // Scroll down to show all elements
  await page.evaluate(() => {
    const dialog = document.querySelector('ytcp-uploads-dialog');
    if (dialog) dialog.scrollTop = 500;
  });
  await page.waitForTimeout(2000);

  // Dump all radio buttons
  const radios = await page.evaluate(() =>
    [...document.querySelectorAll('tp-yt-paper-radio-button, input[type="radio"]')].map(el => ({
      tag: el.tagName,
      name: el.getAttribute('name') || el.name,
      id: el.id,
      label: el.getAttribute('aria-label') || el.innerText?.trim().slice(0, 80),
      checked: el.hasAttribute('checked') || el.checked,
    }))
  );
  console.log('\n=== Radio buttons ===');
  console.log(JSON.stringify(radios, null, 2));

  // Dump all checkboxes
  const checkboxes = await page.evaluate(() =>
    [...document.querySelectorAll('tp-yt-paper-checkbox, input[type="checkbox"], ytcp-checkbox-lit')].map(el => ({
      tag: el.tagName,
      id: el.id,
      label: el.getAttribute('aria-label') || el.innerText?.trim().slice(0, 80),
      checked: el.hasAttribute('checked') || el.checked,
    }))
  );
  console.log('\n=== Checkboxes ===');
  console.log(JSON.stringify(checkboxes, null, 2));

  // Dump all visible buttons
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll('button, ytcp-button')].filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).map(b => ({
      tag: b.tagName,
      id: b.id,
      label: b.getAttribute('aria-label') || b.innerText?.trim().slice(0, 60),
      testid: b.getAttribute('data-testid'),
    }))
  );
  console.log('\n=== Visible buttons ===');
  console.log(JSON.stringify(buttons, null, 2));

  // Wait 30s so you can inspect the page
  console.log('\nLeaving dialog open for 30s for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
})().catch(err => { console.error('Diag failed:', err.message); process.exit(1); });
