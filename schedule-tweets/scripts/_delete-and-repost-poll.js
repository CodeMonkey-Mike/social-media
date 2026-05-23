const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CDP_PORT    = 9223;
const CHROME_EXE  = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE     = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const BAD_URL     = 'https://www.youtube.com/post/Ugkxei78pqe-3ffEBTocdsunMxVH7XMCc8py';

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

(async () => {
  if (!await isCDPReady()) {
    spawn(CHROME_EXE, [
      `--user-data-dir=${PROFILE}`,
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run', '--disable-sync', 'about:blank',
    ], { stdio: 'ignore' });
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isCDPReady()) { console.log('Chrome ready ✓'); break; }
    }
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx  = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  console.log('Navigating to broken post...');
  await page.goto(BAD_URL);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Click the three-dot / More actions menu on the post
  const menuSelectors = [
    'button[aria-label="More actions"]',
    '#action-menu yt-icon-button button',
    'ytd-menu-renderer yt-icon-button button',
    'yt-icon-button.ytd-menu-renderer button',
  ];
  let menuClicked = false;
  for (const sel of menuSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.count() > 0) {
      await btn.click();
      console.log(`  Three-dot menu clicked via: ${sel}`);
      menuClicked = true;
      break;
    }
  }
  if (!menuClicked) {
    // Fallback: find by aria-label pattern
    const btn = page.getByRole('button', { name: /more actions/i }).first();
    if (await btn.count() > 0) { await btn.click(); menuClicked = true; }
  }
  if (!menuClicked) throw new Error('Could not find three-dot menu on post');

  await page.waitForTimeout(1000);

  // Click Delete — try multiple approaches
  let deleteClicked = false;
  for (const sel of [
    'ytd-menu-service-item-renderer[aria-label="Delete"]',
    'ytd-menu-service-item-renderer:has(yt-formatted-string:text-is("Delete"))',
    '[role="menuitem"][aria-label*="Delete" i]',
    'tp-yt-paper-item:has-text("Delete")',
  ]) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      await el.click();
      console.log(`  Clicked Delete via: ${sel}`);
      deleteClicked = true;
      break;
    }
  }
  if (!deleteClicked) {
    // Last resort: find by role menuitem containing "Delete"
    const el = page.getByRole('menuitem', { name: /delete/i }).first();
    if (await el.count() > 0) { await el.click(); deleteClicked = true; }
  }
  if (!deleteClicked) throw new Error('Could not find Delete menu item');
  console.log('  Clicked Delete ✓');
  await page.waitForTimeout(1000);

  // Confirm in the dialog — try several selectors
  await page.waitForTimeout(1000);
  let confirmed = false;
  for (const sel of [
    'yt-confirm-dialog-renderer #confirm-button button',
    'yt-confirm-dialog-renderer button[aria-label*="Delete" i]',
    'paper-dialog button[aria-label*="Delete" i]',
    'tp-yt-paper-dialog button[aria-label*="Delete" i]',
    '#confirm-button button',
    'button[aria-label="Delete"]',
  ]) {
    const btn = page.locator(sel).first();
    if (await btn.count() > 0) {
      await btn.click();
      console.log(`  Confirmed via: ${sel}`);
      confirmed = true;
      break;
    }
  }
  if (!confirmed) {
    // Fallback: any visible button with "Delete" text in the current dialog/overlay
    const btn = page.getByRole('button', { name: /delete/i }).last();
    if (await btn.count() > 0) { await btn.click({ force: true }); confirmed = true; }
  }
  if (!confirmed) throw new Error('Could not find Delete confirmation button');
  console.log('  Confirmed deletion ✓');
  await page.waitForTimeout(3000);

  console.log('Broken post deleted.');
  await browser.close();
  process.exit(0);
})().catch(async err => {
  console.error('Delete failed:', err.message);
  process.exit(1);
});
