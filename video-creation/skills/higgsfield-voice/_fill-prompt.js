const { connect } = require('./_cdp');
const fs = require('fs');

(async () => {
  const textFile = process.argv[2];
  const text = fs.readFileSync(textFile, 'utf8').trim();
  const { browser, page } = await connect();
  await page.waitForTimeout(500);

  // Find the prompt field: textarea or contenteditable with the scene placeholder.
  let handle = await page.$('textarea');
  if (!handle) handle = await page.$('[contenteditable="true"]');
  if (!handle) { console.log('prompt field not found'); await browser.close(); return; }

  await handle.click();
  await page.waitForTimeout(200);
  // select-all + delete, then type
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.waitForTimeout(150);
  await page.keyboard.type(text, { delay: 12 });
  await page.waitForTimeout(400);

  // read back what's in the field
  const val = await page.evaluate(() => {
    const ta = document.querySelector('textarea');
    if (ta) return ta.value;
    const ce = document.querySelector('[contenteditable="true"]');
    return ce ? ce.innerText : '(none)';
  });
  console.log('FIELD NOW:', JSON.stringify(val));
  await page.screenshot({ path: '_filled.png' });
  console.log('saved _filled.png');
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
