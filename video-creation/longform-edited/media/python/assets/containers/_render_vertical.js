// Renders each .frame#<slug> in containers-vertical.html to <slug>.png (3840x2160 @2x) in place.
// Usage: node _render.js            -> renders every slug in SLUGS
//        node _render.js a b c      -> renders only the named slugs
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const SLUGS = [
  'card-title',
  'card-need',
  'card-build',
  'card-rule',
  'c1a-prompt',
  'c1b-generated',
  'c2-amplifier',
  'c3-skilled',
  'c4-unskilled',
  'c5-blurcode',
  'c6-series',
  'c7-channel',
  'c8-jspython',
  'c9-audience',
  'c10-cadence',
  'c11-ramp',
  'c12-curriculum',
  'c12b-curriculum-cut',
  'c13-scope',
  'c14-shape',
  'c15-skip',
  'c16-heycomputer',
  'c17a-ladder-binary',
  'c17b-ladder',
  'c18-print',
  'c19-translator',
  'c20-underhood',
  'c21-frontdoor',
  'c22-question',
  'c23-lanes',
  'c23b-lanes-build',
  'c24-groups',
  'c24a-fundamentals',
  'c24b-apis',
  'c24c-files',
  'c24d-environments',
  'c25-collision',
  'c26-groups-done',
  'c27-portfolio',
  'c28a-stack-call',
  'c28b-stack-sat',
  'c28c-stack-memory',
  'c28d-stack-docs',
  'c28e-stack-tools',
  'c28f-stack-agent',
  'c29-onesystem',
  'c30-onerule',
  'c31-split40h',
  'c32-rulecard',
  'c33-checks',
];

(async () => {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : SLUGS;
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await b.newPage({ viewport: { width: 1080, height: 1960 }, deviceScaleFactor: 2 });
  const url = 'file://' + path.join(__dirname, 'containers-vertical.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  let ok = 0, fail = 0;
  for (const s of want) {
    try {
      const el = page.locator('#' + s);
      const n = await el.count();
      if (n !== 1) { console.log('MISSING #' + s + ' (count=' + n + ')'); fail++; continue; }
      await el.screenshot({ path: path.join(__dirname, '..', 'ctr-v', s + '.png') });
      const bytes = fs.statSync(path.join(__dirname, '..', 'ctr-v', s + '.png')).size;
      console.log('OK   ' + s + '  ' + Math.round(bytes / 1024) + 'KB');
      ok++;
    } catch (e) { console.log('FAIL ' + s + '  ' + e.message.split('\n')[0]); fail++; }
  }
  await b.close();
  console.log('\nDONE  ok=' + ok + '  fail=' + fail + '  of ' + want.length);
})();
