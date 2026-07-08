// One-time setup: opens real Chrome with elevenlabs-profile pointed at ElevenLabs so
// you can log in. The session is saved automatically in the profile — no auth file written.
// Re-run only if Chrome wipes elevenlabs-profile or logs you out.
//
// Run: node setup-elevenlabs.js

const { chromium } = require('playwright');
const readline = require('readline');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';

async function main() {
  console.log('Launching Chrome with elevenlabs-profile...');
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
  await page.goto('https://elevenlabs.io/app/home');

  console.log('\n=================================================');
  console.log('Sign in to ElevenLabs in the browser window.');
  console.log('When you can see the app dashboard,');
  if (process.stdin.isTTY) {
    console.log('come back here and press Enter to close.');
    console.log('=================================================\n');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(resolve => rl.question('Press Enter when done: ', () => { rl.close(); resolve(); }));
    await browser.close();
  } else {
    console.log('just CLOSE the Chrome window. The session is saved in the profile.');
    console.log('=================================================\n');
    await new Promise(resolve => browser.on('close', resolve));
  }
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
