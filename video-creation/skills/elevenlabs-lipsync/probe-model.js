// probe-model.js --model "Sync 3"  — select a lip-sync model and report what inputs it expects
// (file input accept attrs + visible composer labels). Read-only; never generates.
const { chromium } = require('playwright');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
const URL = 'https://elevenlabs.io/app/image-video';
const MODELS_RE = /Veed Fabric|Creatify Aurora|OmniHuman|Sync \d|Sync Lipsync|HeyGen|Veed Lipsync/;
function arg(n,d){const i=process.argv.indexOf('--'+n);return i>-1?process.argv[i+1]:d;}
const MODEL = arg('model','Sync 3');
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
(async()=>{
  const b=await chromium.launchPersistentContext(PROFILE_DIR,{channel:'chrome',headless:false,
    ignoreDefaultArgs:['--enable-automation'],args:['--disable-blink-features=AutomationControlled'],viewport:null});
  await b.addInitScript(()=>Object.defineProperty(navigator,'webdriver',{get:()=>undefined}));
  const p=await b.newPage();
  await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(3000);
  // dismiss popovers
  for(let i=0;i<3;i++){await p.keyboard.press('Escape').catch(()=>{});await p.mouse.click(8,8).catch(()=>{});await p.waitForTimeout(700);}
  await p.locator('[role="radio"]:has-text("Lip sync"), button:has-text("Lip sync")').first().click().catch(()=>{});
  await p.waitForTimeout(1500);
  const pill=p.locator('button').filter({hasText:MODELS_RE}).first();
  await pill.click().catch(()=>{}); await p.waitForTimeout(1200);
  await p.locator(`text=/${MODEL}/i`).first().click().catch(()=>{}); await p.waitForTimeout(3000);
  const info=await p.evaluate(()=>{
    const inputs=[...document.querySelectorAll('input[type="file"]')].map(i=>({accept:i.getAttribute('accept')||''}));
    const labels=[...document.querySelectorAll('*')].filter(e=>!e.children.length)
      .map(e=>(e.innerText||'').trim()).filter(t=>t&&t.length<32&&/upload|image|video|avatar|speech|audio|drop|drag|reference|source/i.test(t));
    return {inputs,labels:[...new Set(labels)].slice(0,20)};
  });
  console.log('MODEL:',MODEL);
  console.log('file inputs accept:',JSON.stringify(info.inputs));
  console.log('composer labels:',JSON.stringify(info.labels));
  await p.screenshot({path:`el-probe-${MODEL.replace(/\W+/g,'-')}.png`});
  await p.waitForTimeout(1500); await b.close();
})().catch(e=>{console.error('probe failed:',e.message);process.exit(1);});
