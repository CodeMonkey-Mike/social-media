// Maps every COVER-PLAN beat -> (kind, ref, asset file) and checks the file exists. Reports gaps.
const fs = require('fs'); const path = require('path');
const ROOT = __dirname;
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'COVER-PLAN.json'), 'utf8'));
const A = (p) => path.join(ROOT, 'assets', p);

// derive a slug from the "what" field's leading token (before ':' or ' ')
function refFor(b) {
  const w = b.what || '';
  if (b.cover_type === 'receipt' || b.cover_type === 'real-chart') {
    const m = w.match(/^(R\d+[A-Z]?)/); return m ? m[1] : null;
  }
  if (b.cover_type === 'envato-video') { const m = w.match(/^(E\d+)/); return m ? m[1] : null; }
  if (b.cover_type === 'chatgpt-image') { const m = w.match(/^(CG\d+)/); return m ? m[1] : null; }
  if (b.cover_type === 'animated-chart') { const m = w.match(/^([a-z-]+)/); return m ? m[1].replace(/-$/,'') : null; }
  // container / diagram / timeline -> leading slug token
  const m = w.match(/^([a-z0-9-]+)/); return m ? m[1] : null;
}

// find the actual file for a ref
function fileFor(b, ref) {
  if (!ref) return null;
  const cands = [];
  if (b.cover_type === 'receipt' || b.cover_type === 'real-chart') {
    // receipts are named R#_something.png -> glob
    const dir = A('receipts');
    const hit = fs.readdirSync(dir).find(f => f.startsWith(ref + '_') || f.startsWith(ref + '-'));
    return hit ? 'receipts/' + hit : null;
  }
  if (b.cover_type === 'envato-video') {
    const dir = A('video');
    const hit = fs.readdirSync(dir).find(f => f.startsWith(ref + '_') && f.endsWith('.cap.mp4'));
    return hit ? 'video/' + hit : null;
  }
  if (b.cover_type === 'chatgpt-image') {
    const dir = A('images');
    const hit = fs.readdirSync(dir).find(f => f.startsWith(ref + '_'));
    return hit ? 'images/' + hit : null;
  }
  if (b.cover_type === 'animated-chart') {
    if (fs.existsSync(A('animated-charts/' + ref + '.png'))) return 'animated-charts/' + ref + '.png';
    return null;
  }
  // container/diagram/timeline
  if (fs.existsSync(A('containers/' + ref + '.png'))) return 'containers/' + ref + '.png';
  if (fs.existsSync(A('animated-charts/' + ref + '.png'))) return 'animated-charts/' + ref + '.png';
  return null;
}

let gaps = [], rows = [];
for (const b of plan.cover_beats) {
  const ref = refFor(b);
  const file = fileFor(b, ref);
  rows.push({ ch: b.chapter, t: b.tIn.toFixed(1)+'-'+b.tOut.toFixed(1), type: b.cover_type, ref, file: file||'*** MISSING ***' });
  if (!file) gaps.push({ ch: b.chapter, t: b.tIn, type: b.cover_type, ref, what: (b.what||'').slice(0,70) });
}
console.log('BEATS:', plan.cover_beats.length);
rows.forEach(r => console.log(`${r.ch} ${r.t.padEnd(13)} ${r.type.padEnd(14)} ${(r.ref||'?').padEnd(20)} ${r.file}`));
console.log('\n=== GAPS ('+gaps.length+') ===');
gaps.forEach(g => console.log(`${g.ch} @${g.t} ${g.type} ref=${g.ref} :: ${g.what}`));
// also list unused assets (orphans)
const used = new Set(rows.map(r=>r.file).filter(f=>!f.includes('MISSING')));
for (const sub of ['containers','animated-charts']) {
  const dir = A(sub);
  for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.png'))) {
    if (!used.has(sub+'/'+f)) console.log('ORPHAN (built, unused):', sub+'/'+f);
  }
}
