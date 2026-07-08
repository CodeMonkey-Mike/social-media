const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright');
const PROFILE = 'C:/Users/mnede/AppData/Local/Google/Chrome/soundstripe-profile';
(async () => {
  const b = await chromium.launchPersistentContext(PROFILE, { channel: 'chrome', headless: true });
  const g = await b.request.get('https://api.soundstripe.com/app/users/547636/account_entitlements');
  console.log('GET account_entitlements (cookies only):', g.status());
  const d = await b.request.post('https://api.soundstripe.com/app/songs/14240/download', { data: {} });
  console.log('POST songs/14240/download {}:', d.status());
  let body = ''; try { body = await d.text(); } catch {}
  console.log('   body head:', body.slice(0, 300));
  await b.close(); process.exit(0);
})();
