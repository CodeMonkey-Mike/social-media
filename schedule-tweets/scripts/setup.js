// One-time setup: opens a Chrome window for you to log into X manually,
// then saves the session (cookies + localStorage) to x-auth.json.
// Run this once: node setup.js
// After that, post-thread.js uses x-auth.json and needs no manual steps.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

const AUTH_FILE = path.join(__dirname, '..', 'config', 'x-auth.json');
const TEMP_DIR = path.join(os.tmpdir(), `pw-setup-${Date.now()}`);

async function main() {
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const browser = await chromium.launchPersistentContext(TEMP_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--profile-directory=Default', '--disable-blink-features=AutomationControlled'],
    viewport: null,
  });

  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await browser.newPage();
  await page.goto('https://x.com/login');

  console.log('');
  console.log('A Chrome window has opened. Log into X normally.');
  console.log('This script will detect when you\'re in and save your session automatically.');
  console.log('Waiting (up to 5 minutes)...');

  await page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 300000 });
  console.log('Logged in! Saving session...');

  await browser.storageState({ path: AUTH_FILE });
  console.log(`Session saved to: ${AUTH_FILE}`);
  console.log('You can now run: node post-thread.js');

  await browser.close();
  try { fs.rmSync(TEMP_DIR, { recursive: true, force: true }); } catch {}
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
