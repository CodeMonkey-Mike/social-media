// One-time setup: opens Chrome with xbot-profile pointed at ChatGPT so you
// can log in. The session is saved automatically in the profile — no auth
// file written. Re-run only if Chrome wipes xbot-profile or logs you out.
//
// Run: node setup-chatgpt.js

const { chromium } = require('playwright');
const readline = require('readline');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';

async function main() {
  console.log('Launching Chrome with xbot-profile...');
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
  await page.goto('https://chatgpt.com/');

  console.log('\n=================================================');
  console.log('Sign in to ChatGPT in the browser window if needed.');
  console.log('When you can see your chat list and can chat freely,');
  console.log('come back here and press Enter to close.');
  console.log('=================================================');
  console.log('\nSession is saved automatically in xbot-profile.');
  console.log('You will not need to run this again unless Chrome wipes the profile.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => rl.question('Press Enter when done: ', () => { rl.close(); resolve(); }));

  await browser.close();
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
