// One-time setup: opens Chrome with envato-profile pointed at Envato Elements so
// you can log in. The session is saved automatically in the profile — no auth
// file written. Re-run only if Chrome wipes envato-profile or logs you out.
//
// Run: node setup-envato.js

const { chromium } = require('playwright');
const readline = require('readline');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';

async function main() {
  console.log('Launching Chrome with envato-profile...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });

  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await browser.newPage();
  await page.goto('https://elements.envato.com/');

  console.log('\n=================================================');
  console.log('Sign in to Envato Elements in the browser window.');
  console.log('When you are logged in (avatar visible top-right),');
  if (process.stdin.isTTY) {
    console.log('come back here and press Enter to close.');
    console.log('=================================================\n');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(resolve => rl.question('Press Enter when done: ', () => { rl.close(); resolve(); }));
    await browser.close();
  } else {
    // launched non-interactively (e.g. by Claude as a background task):
    // just close the Chrome window when done — the profile saves the session.
    console.log('just CLOSE the Chrome window. The session is saved in the profile.');
    console.log('=================================================\n');
    await new Promise(resolve => browser.on('close', resolve));
  }
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
