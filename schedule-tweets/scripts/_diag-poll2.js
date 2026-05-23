// Diagnostic: trace tab order after filling poll options 1 and 2
const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CDP_PORT   = 9223;
const CHROME_EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const POSTS_URL  = 'https://www.youtube.com/@CodeMonkeyMike/posts';

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT,'127.0.0.1',()=>{s.destroy();r(true);});
    s.on('error',()=>r(false));
    setTimeout(()=>{try{s.destroy();}catch{}r(false);},500);
  });
}

function focusedInfo() {
  return {
    tag:         document.activeElement?.tagName,
    id:          document.activeElement?.id,
    placeholder: document.activeElement?.placeholder,
    ariaLabel:   document.activeElement?.getAttribute('aria-label'),
    type:        document.activeElement?.type,
    text:        document.activeElement?.textContent?.trim().slice(0, 60),
    rect:        (() => {
      const r = document.activeElement?.getBoundingClientRect();
      return r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null;
    })(),
  };
}

(async () => {
  if (!await isCDPReady()) {
    spawn(CHROME_EXE,[`--user-data-dir=${PROFILE}`,`--remote-debugging-port=${CDP_PORT}`,'--no-first-run','about:blank'],{stdio:'ignore'});
    for (let i=0;i<20;i++){await new Promise(r=>setTimeout(r,500));if(await isCDPReady())break;}
  }
  const b = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = b.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  await page.goto(POSTS_URL);
  await page.waitForTimeout(3000);

  // Expand + type question
  await page.locator('#placeholder-area').first().click({timeout:5000}).catch(()=>{});
  await page.waitForTimeout(1500);
  const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
  await ta.click();
  await page.keyboard.insertText('Test question for poll');
  await page.waitForTimeout(500);

  // Click Poll button
  const pollBtn = page.locator('[aria-label="Poll"]').first();
  if (await pollBtn.count() === 0) {
    // Try text poll
    await page.locator('button[aria-label*="text poll" i], button[aria-label*="poll" i]:not([aria-label*="image" i])').first().click();
  } else {
    await pollBtn.click();
  }
  await page.waitForTimeout(1500);

  // Scroll first option into view and focus it
  const OPT_SEL = 'input[placeholder*="option" i]';
  const firstOpt = page.locator(OPT_SEL).first();
  await firstOpt.evaluate(el => { el.scrollIntoView({ block: 'center' }); el.focus(); });
  await page.waitForTimeout(300);

  console.log('Focus after clicking opt1:', await page.evaluate(focusedInfo));

  // Type option 1
  await page.keyboard.type('TestOption1', { delay: 20 });
  await page.waitForTimeout(300);
  console.log('Option inputs after typing opt1:', await page.locator(OPT_SEL).count());

  // Tab
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  console.log('Focus after Tab from opt1:', await page.evaluate(focusedInfo));

  // Type option 2
  await page.keyboard.type('TestOption2', { delay: 20 });
  await page.waitForTimeout(300);
  console.log('Option inputs after typing opt2:', await page.locator(OPT_SEL).count());

  // Tab again — where does focus go?
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  const focusAfterOpt2 = await page.evaluate(focusedInfo);
  console.log('Focus after Tab from opt2:', focusAfterOpt2);
  console.log('Option inputs count now:', await page.locator(OPT_SEL).count());

  // If focus is on something that might be "Add option", try Enter
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  const afterEnter = await page.evaluate(focusedInfo);
  console.log('Focus after Enter:', afterEnter);
  console.log('Option inputs after Enter:', await page.locator(OPT_SEL).count());

  // Another Tab
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  console.log('Focus after second Tab:', await page.evaluate(focusedInfo));
  console.log('Option inputs count:', await page.locator(OPT_SEL).count());

  // Dump all poll-related DOM
  const pollDom = await page.evaluate(() => {
    // Look for ytd-poll or similar custom elements
    const pollEls = [...document.querySelectorAll('[id*="poll"], [class*="poll"], ytd-poll-creation-renderer, yt-poll-creation-renderer')];
    return pollEls.map(el => ({
      tag: el.tagName,
      id: el.id,
      html: el.outerHTML.slice(0, 300),
    }));
  });
  console.log('\nPoll-related DOM elements:', JSON.stringify(pollDom, null, 2));

  await b.close();
  process.exit(0);
})();
