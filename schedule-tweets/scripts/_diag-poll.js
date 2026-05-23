// Diagnostic: navigate to poll composer, fill 2 options, then dump DOM info
const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CDP_PORT    = 9223;
const CHROME_EXE  = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE     = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const POSTS_URL   = 'https://www.youtube.com/@CodeMonkeyMike/posts';

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT,'127.0.0.1',()=>{s.destroy();r(true);});
    s.on('error',()=>r(false));
    setTimeout(()=>{try{s.destroy();}catch{}r(false);},500);
  });
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

  // Expand composer
  await page.locator('#placeholder-area').first().click({timeout:5000}).catch(()=>{});
  await page.waitForTimeout(1500);

  // Type something
  const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
  await ta.click();
  await page.keyboard.insertText('Test question');
  await page.waitForTimeout(500);

  // Click Poll button
  await page.locator('[aria-label="Poll"]').first().click({timeout:5000}).catch(()=>{});
  await page.waitForTimeout(1500);

  // Fill option 1
  const opts = page.locator('input[placeholder*="option" i]');
  await opts.nth(0).evaluate(el=>{el.scrollIntoView({block:'center'});el.focus();});
  await opts.nth(0).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},  'Option 1 test');
  await opts.nth(0).evaluate(el=>el.select());
  await page.keyboard.type('Option 1 test',{delay:30});
  await page.waitForTimeout(300);

  // Fill option 2
  await opts.nth(1).evaluate(el=>{el.scrollIntoView({block:'center'});el.focus();});
  await opts.nth(1).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},  'Option 2 test');
  await opts.nth(1).evaluate(el=>el.select());
  await page.keyboard.type('Option 2 test',{delay:30});
  await page.waitForTimeout(300);

  // Scroll down a bit
  await page.evaluate(()=>window.scrollBy(0,300));
  await page.waitForTimeout(500);

  // ---- DIAGNOSTIC DUMP ----
  const info = await page.evaluate(() => {
    const results = {
      allInputs: [],
      allButtons: [],
      customElements: [],
      bodyText: document.body.innerText.slice(0,500),
    };

    // All inputs
    for (const el of document.querySelectorAll('input')) {
      const r = el.getBoundingClientRect();
      results.allInputs.push({placeholder: el.placeholder, type: el.type, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y)});
    }

    // All buttons and button-like elements with text
    for (const el of document.querySelectorAll('button, a, [role="button"], tp-yt-paper-button')) {
      const text = el.textContent.trim().slice(0,40);
      if (!text) continue;
      const r = el.getBoundingClientRect();
      results.allButtons.push({tag: el.tagName, text, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), ariaLabel: el.getAttribute('aria-label')});
    }

    // Custom elements (for shadow DOM inspection)
    const customs = document.querySelectorAll('tp-yt-paper-button');
    for (const el of customs) {
      const text = el.shadowRoot ? el.shadowRoot.textContent.trim().slice(0,40) : el.textContent.trim().slice(0,40);
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        results.customElements.push({tag: el.tagName, text, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y)});
      }
    }

    return results;
  });

  console.log('\n=== INPUTS ===');
  info.allInputs.forEach(i=>console.log(i));

  console.log('\n=== BUTTONS (w>0) ===');
  info.allButtons.filter(b=>b.w>0).forEach(b=>console.log(b));

  console.log('\n=== CUSTOM ELEMENTS (tp-yt-paper-button, w>0) ===');
  info.customElements.forEach(c=>console.log(c));

  console.log('\n=== BODY TEXT SNIPPET ===');
  console.log(info.bodyText);

  await b.close();
  process.exit(0);
})();
