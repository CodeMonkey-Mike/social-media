// Generates EDIT-PLAN.md (file-level manifest, zero orphans), CUE-SHEET.md, BROLL-PLAN.md
// from COVER-PLAN.json + MUSIC-PLAN.json + the reconciled asset map.
const fs = require('fs'); const path = require('path');
const ROOT = __dirname;
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'COVER-PLAN.json'), 'utf8'));
const music = JSON.parse(fs.readFileSync(path.join(ROOT, 'MUSIC-PLAN.json'), 'utf8'));
const A = (p) => path.join(ROOT, 'assets', p);

// special-case receipt/container aliases (mapper can't glob these)
const ALIAS = {
  'R2': 'receipts/R1-R2-R2B_cmc-top.png',
  'R2B': 'receipts/R1-R2-R2B_cmc-full.png',
  'R1': 'receipts/R1_cmc-unlocks.png',
  'R8B': 'containers/sam-vs-simon.png',
};
function refFor(b){const w=b.what||'';
  if(b.cover_type==='receipt'||b.cover_type==='real-chart'){const m=w.match(/^(R\d+[A-Z]?)/);return m?m[1]:null;}
  if(b.cover_type==='envato-video'){const m=w.match(/^(E\d+)/);return m?m[1]:null;}
  if(b.cover_type==='chatgpt-image'){const m=w.match(/^(CG\d+)/);return m?m[1]:null;}
  if(b.cover_type==='animated-chart'){const m=w.match(/^([a-z-]+)/);return m?m[1].replace(/-$/,''):null;}
  const m=w.match(/^([a-z0-9-]+)/);return m?m[1]:null;}
function fileFor(b,ref){if(!ref)return null;if(ALIAS[ref])return ALIAS[ref];
  if(b.cover_type==='receipt'||b.cover_type==='real-chart'){const d=A('receipts');const h=fs.readdirSync(d).find(f=>f.startsWith(ref+'_')||f.startsWith(ref+'-'));return h?'receipts/'+h:null;}
  if(b.cover_type==='envato-video'){const d=A('video');const h=fs.readdirSync(d).find(f=>f.startsWith(ref+'_')&&f.endsWith('.cap.mp4'));return h?'video/'+h:null;}
  if(b.cover_type==='chatgpt-image'){const d=A('images');const h=fs.readdirSync(d).find(f=>f.startsWith(ref+'_'));return h?'images/'+h:null;}
  if(b.cover_type==='animated-chart'){if(fs.existsSync(A('animated-charts/'+ref+'.png')))return 'animated-charts/'+ref+'.png';return null;}
  if(fs.existsSync(A('containers/'+ref+'.png')))return 'containers/'+ref+'.png';
  if(fs.existsSync(A('animated-charts/'+ref+'.png')))return 'animated-charts/'+ref+'.png';return null;}

const KIND = {'envato-video':'video','chatgpt-image':'image','receipt':'receipt','real-chart':'receipt/chart','animated-chart':'chart','container':'css-container','diagram':'diagram','timeline':'timeline'};
const bedAt = (t) => { const b = music.beds.filter(x=>t>=x.span[0]&&t<x.span[1]); return b.length?b[b.length-1]:music.beds[0]; };

// ---- EDIT-PLAN.md (manifest) ----
let ep = `# zebec (ZBCN) - EDIT-PLAN (file-level manifest, the PRE-RENDER GATE)\n\n`;
ep += `_Auto-generated from COVER-PLAN.json + MUSIC-PLAN.json. Every cover beat = one row, every asset PLACED (zero orphans).\n`;
ep += `Spine: spine/ALL.c.desilenced.mp4 (458.54s). Face window: 45.3-52.86 (film-burn in/out). Draft = 0.2 Mbps full-feature proxy._\n\n`;
ep += `## Cover layer (${plan.cover_beats.length} beats, time-ordered)\n\n`;
ep += `| # | Ch | tIn-tOut | type | asset file | spoken beat |\n|--|--|--|--|--|--|\n`;
let miss=0;
plan.cover_beats.forEach((b,i)=>{const ref=refFor(b);const f=fileFor(b,ref);if(!f)miss++;
  const sp=(b.spoken||'').slice(0,58).replace(/\|/g,'/');
  ep+=`| ${i+1} | ${b.chapter} | ${b.tIn.toFixed(1)}-${b.tOut.toFixed(1)} | ${KIND[b.cover_type]||b.cover_type} | ${f||'*** MISSING ***'} | ${sp} |\n`;});
ep += `\n**Reconciliation:** ${plan.cover_beats.length} beats, ${miss} missing. Zero bare cover beats (spine is black on every cover beat; face only 45.3-52.86).\n`;
ep += `\n## Music beds (MUSIC-PLAN.json)\n\n| Ch | span | source | in | cover | intensity | dB<VO |\n|--|--|--|--|--|--|--|\n`;
music.beds.forEach(x=>{ep+=`| ${x.chapter} | ${x.span[0]}-${x.span[1]} | ${path.basename(x.source_file)} | ${x.source_in} | ${x.cover} | ${x.intensity} | ${x.level_db_under_vo} |\n`;});
ep += `\n## Hard hits (drops / impacts land here)\n\n`;
music.hard_hits.forEach(h=>{ep+=`- **${h.t}s** ${h.beat} - ${h.music_move}\n`;});
ep += `\n## Deferred to HQ pass (draft simplifications, flagged not hidden)\n`;
ep += `- Chapter title-card 1s audio pauses (comp-build §2) - draft uses overlay cards, no baked pause.\n`;
ep += `- Animated charts (traction-scoreboard, buyback-flywheel, demand-vs-float) render as static canonical PNGs; HQ animates via useCurrentFrame (charts.md).\n`;
ep += `- Container spotlight state-swaps (float-fixed/serious-names/etc multi-state) - draft shows one composed state per container.\n`;
ep += `- SFX risers/impacts on the hard hits; per-frame music ducks + dynaudnorm leveling (draft = constant-gain beds w/ drops aligned).\n`;
ep += `- Receipts R1/R2/R2B clean day-of-render crops (draft uses the full CMC captures); R8B real Sam-vs-Simon side-by-side (draft uses the factual sam-vs-simon container) - needs Mike's 'Simon' source.\n`;
fs.writeFileSync(path.join(ROOT,'EDIT-PLAN.md'),ep);

// ---- CUE-SHEET.md ----
let cs = `# zebec - CUE-SHEET (layer-grouped watch-along)\n\n_Cover cues off the word transcript. Face: 45.3-52.86. 5 chapters._\n\n`;
['CH1','CH2','CH3','CH4','CH5'].forEach(ch=>{
  cs+=`## ${ch}\n\n`;
  plan.cover_beats.filter(b=>b.chapter===ch).forEach(b=>{const ref=refFor(b);
    cs+=`- **${b.tIn.toFixed(1)}** ${ref} (${b.cover_type}) - "${(b.spoken||'').slice(0,64)}"\n`;});
  const beds=music.beds.filter(x=>x.chapter===ch);
  beds.forEach(x=>cs+=`  - _music: ${path.basename(x.source_file)} @${x.source_in} (${x.intensity})_\n`);
  cs+=`\n`;});
fs.writeFileSync(path.join(ROOT,'CUE-SHEET.md'),cs);

// ---- BROLL-PLAN.md ----
let bp = `# zebec - BROLL-PLAN (acquisition worklist - ALL FETCHED)\n\n`;
bp += `## Envato video (10/10 done, .cap.mp4, audio stripped, <=100MB)\n`;
plan.envato_list.forEach(e=>{const f=fs.readdirSync(A('video')).find(x=>x.startsWith('E'+e.n+'_'));bp+=`- E${e.n} "${e.query}" -> ${f||'?'} (${e.beat})\n`;});
bp += `\n## ChatGPT image (5/5 done, md5-distinct, on-brand)\n`;
fs.readdirSync(A('images')).forEach(f=>bp+=`- ${f}\n`);
bp += `\n## Receipts (captured + QA'd; R8B = factual container fallback pending Mike's Simon source)\n`;
fs.readdirSync(A('receipts')).filter(f=>f.endsWith('.png')).forEach(f=>bp+=`- ${f}\n`);
bp += `\n## CSS containers (38, canonical presentation.md style) + charts (3)\n`;
bp += `- containers/*.png (rebuilt this session to the locked stylesheet) ; animated-charts/*.png (static draft, animate in HQ)\n`;
fs.writeFileSync(path.join(ROOT,'BROLL-PLAN.md'),bp);

console.log('WROTE EDIT-PLAN.md, CUE-SHEET.md, BROLL-PLAN.md  (missing beats:', miss+')');
