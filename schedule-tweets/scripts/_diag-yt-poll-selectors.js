// READ-ONLY diagnostic for the YouTube text-poll composer.
// Opens the composer, types a dummy question, clicks the poll button, then DUMPS the
// poll-attachment DOM so we can re-point the option-field + add-option selectors.
// Does NOT post anything. No pending poll is touched. Safe to run.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const path         = require('path');

const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const POSTS_URL      = 'https://www.youtube.com/@CodeMonkeyMike/posts';

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
async function isCDPReady(){
  return new Promise(r=>{ const s=net.connect(CDP_PORT,'127.0.0.1',()=>{s.destroy();r(true);}); s.on('error',()=>r(false)); setTimeout(()=>{try{s.destroy();}catch{}r(false);},600); });
}
async function startChrome(){
  if (await isCDPReady()){ console.log(`Chrome already on ${CDP_PORT} ✓`); return null; }
  console.log('Launching Chrome...');
  const proc = spawn(CHROME_EXE, [`--user-data-dir=${CHROME_PROFILE}`,`--remote-debugging-port=${CDP_PORT}`,'--no-first-run','--disable-blink-features=AutomationControlled','--disable-sync','about:blank'], { detached:false, stdio:'ignore' });
  for (let i=0;i<24;i++){ await sleep(500); if (await isCDPReady()){ console.log(`Chrome ready on ${CDP_PORT} ✓`); return proc; } }
  throw new Error('Chrome did not open CDP port');
}

async function main(){
  const chromeProc = await startChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();
  try {
    console.log('\nNavigating to posts page...');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded',{timeout:30000}).catch(()=>{});
    await sleep(3000);

    console.log('Expanding composer...');
    await page.locator('#placeholder-area').first().click({timeout:8000}).catch(e=>console.log('  placeholder click err:',e.message));
    await sleep(1500);

    const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
    await ta.waitFor({state:'visible',timeout:10000});
    await ta.click();
    await sleep(500);
    console.log('Typing dummy question...');
    await page.keyboard.type('DIAGNOSTIC TEST QUESTION (do not post)');
    await sleep(1000);

    console.log('Clicking #poll-button button...');
    const pollBtn = page.locator('#poll-button button').first();
    await pollBtn.waitFor({state:'attached',timeout:8000});
    await pollBtn.dispatchEvent('click');
    await sleep(2500);

    // ---- DUMP ----
    const dump = await page.evaluate(() => {
      const out = {};
      const attach = document.querySelector('ytd-poll-attachment');
      out.pollAttachmentExists = !!attach;
      out.pollAttachmentDisplay = attach ? getComputedStyle(attach).display : 'N/A';

      // Old selectors — still present?
      out.old_HOST_SEL_count = document.querySelectorAll('tp-yt-paper-input.poll-option-input').length;
      out.old_addOption_exists = !!document.querySelector('#add-option button');
      out.old_addOption_hostExists = !!document.querySelector('#add-option');

      // Scope inspection to the attachment (fallback to composer renderer)
      const scope = attach || document.querySelector('ytd-backstage-post-dialog-renderer, ytd-commentbox') || document;

      // Every input / textarea / contenteditable inside scope
      out.inputs = [...scope.querySelectorAll('input, textarea, [contenteditable="true"]')].map(el => ({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type'),
        id: el.id || null,
        cls: (el.className && typeof el.className === 'string') ? el.className.slice(0,80) : null,
        placeholder: el.getAttribute('placeholder'),
        ariaLabel: el.getAttribute('aria-label'),
        name: el.getAttribute('name'),
        value: (el.value !== undefined ? el.value : null),
        rectW: Math.round(el.getBoundingClientRect().width),
      }));

      // Polymer paper-input hosts (any class)
      out.paperInputs = [...scope.querySelectorAll('tp-yt-paper-input, ytd-poll-option-renderer, [class*="poll-option"]')].map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className && typeof el.className === 'string') ? el.className.slice(0,90) : null,
        rectW: Math.round(el.getBoundingClientRect().width),
        innerInput: !!el.querySelector('input,textarea'),
      }));

      // Candidate add-option controls: any button/yt-button/icon whose text/aria hints "add"
      const btnLike = [...scope.querySelectorAll('button, yt-button-shape, ytd-button-renderer, tp-yt-paper-icon-button, #add-option, [id*="add"], [aria-label]')];
      out.addCandidates = btnLike.filter(el=>{
        const t = (el.textContent||'').trim().toLowerCase();
        const a = (el.getAttribute('aria-label')||'').toLowerCase();
        const id = (el.id||'').toLowerCase();
        return id.includes('add') || a.includes('add') || (t && t.length<24 && t.includes('add'));
      }).map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className && typeof el.className === 'string') ? el.className.slice(0,80) : null,
        text: (el.textContent||'').trim().slice(0,40),
        ariaLabel: el.getAttribute('aria-label'),
        rectW: Math.round(el.getBoundingClientRect().width),
      }));

      // Raw attachment HTML (trimmed) for eyeballing structure
      out.attachmentHTML = attach ? attach.outerHTML.replace(/\s+/g,' ').slice(0, 2500) : null;
      return out;
    });

    console.log('\n=== DIAGNOSTIC DUMP ===');
    console.log('pollAttachmentExists:', dump.pollAttachmentExists, '| display:', dump.pollAttachmentDisplay);
    console.log('OLD tp-yt-paper-input.poll-option-input count:', dump.old_HOST_SEL_count);
    console.log('OLD #add-option exists:', dump.old_addOption_hostExists, '| #add-option button exists:', dump.old_addOption_exists);
    console.log('\n-- inputs/textareas/contenteditable in scope --');
    console.log(JSON.stringify(dump.inputs, null, 2));
    console.log('\n-- paper-input / poll-option hosts --');
    console.log(JSON.stringify(dump.paperInputs, null, 2));
    console.log('\n-- add-option candidates --');
    console.log(JSON.stringify(dump.addCandidates, null, 2));
    console.log('\n-- attachment outerHTML (trimmed) --');
    console.log(dump.attachmentHTML);
    console.log('\n=== END DUMP — NOTHING POSTED ===');
  } catch (err) {
    console.error('DIAG ERROR:', err.message);
  } finally {
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}
main();
