// receipt-capture — canonical headless-Chrome screenshotter for "receipts"
// (article / chart / coin-aggregator screenshots) used as edit-time cutaway assets.
//
// Usage:
//   node capture.js <jobs.json>                      # batch (recommended)
//   node capture.js <jobs.json> <nameFilter>         # only jobs whose name includes the filter
//   node capture.js --url <url> --out <path> [opts]  # one-off
//     opts: --full  --wait <ms>  --w <px>  --h <px>  --click "Button Text"
//
// jobs.json = array of jobs. Each job:
//   { "name":"R1_cmc-unlocks", "url":"https://...", "out":"R1_cmc-unlocks.png",
//     "dir":"<abs output dir, optional if out is absolute>",
//     "wait":7000, "full":false, "w":1600, "h":2200,
//     "clicks":[ {"text":"Token Unlocks"}, {"sel":".someButton"} ],   // in order, after load+consent
//     "waitAfterClick":2500,
//     "removeSel":["[class*=promo]"],   // extra elements to nuke before shot
//     "clip":{"x":0,"y":0,"width":1600,"height":900}  // optional region crop
//   }
//
// Playwright is pulled from a repo-level node_modules (survives project-folder deletion).
const PW = 'C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright';
const { chromium } = require(PW);
const path = require('path'), fs = require('fs');

const CONSENT = ['Accept all','Accept All','I Accept','I agree','Agree','Accept','Got it','Okay, got it',
  'Allow all','Continue','Yes, I agree','AGREE','Accept Cookies','Reject all','Reject All','Continue to site'];
const KILL = ['#onetrust-banner-sdk','.fc-consent-root','[id*="sp_message_container"]','[class*="cookie"]',
  '[class*="consent"]','[class*="Cookie"]','[aria-label*="cookie"]'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function parseArgs(a){const o={};for(let i=0;i<a.length;i++){if(a[i].startsWith('--')){const k=a[i].slice(2);const v=(a[i+1]&&!a[i+1].startsWith('--'))?a[++i]:true;o[k]=v;}}return o;}

async function shoot(browser, j, baseDir){
  const out = path.isAbsolute(j.out||'') ? j.out : path.join(j.dir||baseDir||process.cwd(), j.out||(j.name+'.png'));
  const page = await browser.newPage({ viewport:{ width:j.w||1600, height:j.h||2000 }, deviceScaleFactor:2, userAgent:UA });
  try{
    await page.goto(j.url, { waitUntil:'domcontentloaded', timeout:60000 });
    await page.waitForTimeout(j.wait||4000);
    for(const label of CONSENT){ try{ const b=page.getByRole('button',{name:label,exact:false}).first();
      if(await b.isVisible({timeout:500})){ await b.click({timeout:1500}); await page.waitForTimeout(800); break; } }catch(e){} }
    for(const c of (j.clicks||[])){ try{
      const el = c.text ? page.getByText(c.text,{exact:false}).first() : page.locator(c.sel).first();
      await el.click({timeout:4000}); await page.waitForTimeout(j.waitAfterClick||2500);
    }catch(e){ console.log('   (click skipped:',(c.text||c.sel),'::',e.message.split('\n')[0],')'); } }
    await page.evaluate((sels)=>{ for(const s of sels) document.querySelectorAll(s).forEach(e=>{try{e.remove();}catch(x){}}); }, KILL.concat(j.removeSel||[]));
    await page.waitForTimeout(600);
    const opts = { path:out, fullPage:!!j.full }; if(j.clip) opts.clip=j.clip;
    await page.screenshot(opts);
    console.log('OK  ', j.name||out);
  }catch(e){ console.log('FAIL', j.name||j.url, '::', e.message.split('\n')[0]); }
  await page.close();
}

(async()=>{
  const argv = process.argv.slice(2);
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  if(argv[0] && !argv[0].startsWith('--') && argv[0].endsWith('.json')){
    const jobs = JSON.parse(fs.readFileSync(argv[0],'utf-8'));
    const baseDir = path.dirname(path.resolve(argv[0]));
    const filter = argv[1];
    for(const j of jobs){ if(filter && !(j.name||'').includes(filter)) continue; await shoot(browser, j, baseDir); }
  } else {
    const o = parseArgs(argv);
    await shoot(browser, { url:o.url, out:o.out, full:!!o.full, wait:o.wait?+o.wait:4000, w:o.w?+o.w:1600, h:o.h?+o.h:2000, clicks:o.click?[{text:o.click}]:[] });
  }
  await browser.close();
})();
