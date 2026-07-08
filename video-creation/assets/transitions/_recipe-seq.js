// Full per-clip recipe for ONE sequence (source + every effect + key params).
// Usage: node _recipe-seq.js "Glitch Cinematic Bad Signal Max - 1"
const fs = require('fs');
const path = require('path');
const xml = fs.readFileSync(path.join(process.env.TEMP, 'sw.xml'), 'utf8');
const TICKS = 254016000000;
const idIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g; let m; while ((m = re.exec(xml))) idIndex.set(m[2], { start: m.index, tag: m[1] }); }
const uidIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectUID="([0-9a-f-]{36})"/g; let m; while ((m = re.exec(xml))) uidIndex.set(m[2], { start: m.index, tag: m[1] }); }
function slice(start, tag) {
  const fc = xml.indexOf('>', start);
  if (xml[fc - 1] === '/') return xml.slice(start, fc + 1);
  const o = new RegExp('<' + tag + '(\\s|>)', 'g'); const ct = '</' + tag + '>';
  let d = 0, i = start;
  while (i < xml.length) { o.lastIndex = i; const mm = o.exec(xml); const no = mm ? mm.index : -1; const nc = xml.indexOf(ct, i);
    if (nc === -1) break; if (no !== -1 && no < nc) { d++; i = no + tag.length + 1; } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); } }
  return xml.slice(start, start + 12000);
}
const byId = (id) => { const e = idIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
const byUid = (id) => { const e = uidIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
function findSeq(name) { const re = /<Sequence\s+ObjectUID="[0-9a-f-]{36}"/g; let m;
  while ((m = re.exec(xml))) { const s = slice(m.index, 'Sequence'); const nm = (s.match(/<Name>([^<]*)<\/Name>/) || [])[1]; if (nm === name) return s; } return null; }

const NAME = process.argv[2] || 'Glitch Cinematic Bad Signal Max - 1';
const seq = findSeq(NAME);
if (!seq) { console.log('NO SEQ', NAME); process.exit(1); }
const vgRef = (seq.match(/<Second ObjectRef="(\d+)"/) || [])[1];
const vg = byId(vgRef);
const trackUids = [...vg.xml.matchAll(/<Track Index="\d+" ObjectURef="([0-9a-f-]{36})"/g)].map((m) => m[1]);
console.log(`SEQUENCE: ${NAME}  (video tracks: ${trackUids.length})`);
trackUids.forEach((tu, ti) => {
  const t = byUid(tu); if (!t) return;
  const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((m) => m[1]);
  for (const id of items) {
    const it = byId(id); if (!it) continue;
    const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
    const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
    const end = (it.xml.match(/<End>(\d+)<\/End>/) || [])[1];
    let src = '?'; if (subRef) { const sc = byId(subRef); if (sc) src = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || sc.tag; }
    console.log(`\n  t${ti} clip ${id} end=${end ? (end / TICKS).toFixed(3) + 's' : '?'} src="${src}"`);
    if (!compRef) continue;
    const ch = byId(compRef); if (!ch) continue;
    const cr = /<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let m;
    while ((m = cr.exec(ch.xml))) { const c = byId(m[1]); if (!c) continue;
      const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1]; if (!mn) continue;
      const ps = [];
      const pr = /<Param\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let pm;
      while ((pm = pr.exec(c.xml))) { const p = byId(pm[1]); if (!p) continue;
        const nm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
        const tv = /<IsTimeVarying>true<\/IsTimeVarying>/.test(p.xml);
        const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
        const kf = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
        let val;
        if (tv && kf) { val = 'ANIM[' + kf.split(';').filter(Boolean).map((k) => { const a = k.split(','); return `${(Number(a[0]) / TICKS).toFixed(3)}:${a[1]}`; }).join(' ') + ']'; }
        else if (sk) val = sk.split(',')[1];
        if (nm && val !== undefined && val !== '' && !(typeof val === 'string' && /^0(\.0*)?$/.test(val))) ps.push(`${nm}=${val}`);
      }
      console.log(`      - ${mn.replace('AE.ADBE ', '')}${ps.length ? ': ' + ps.join(' | ') : ''}`);
    }
  }
});
console.log('\nDONE');
