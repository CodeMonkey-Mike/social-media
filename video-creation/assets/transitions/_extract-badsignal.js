#!/usr/bin/env node
/** Per-variant real data for all 9 Cinematic Bad Signal transitions: the Offset
 * "Shift Center To" roll keyframes + the window duration. Writes _badsignal-real.json. */
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

function offsetKeyframes(chainXml) {
  // find AE.ADBE Offset component -> Shift Center To param -> animated keyframes
  const cr = /<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let m;
  while ((m = cr.exec(chainXml))) {
    const c = byId(m[1]); if (!c) continue;
    if (!/AE\.ADBE Offset/.test(c.xml)) continue;
    const pr = /<Param\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let pm;
    while ((pm = pr.exec(c.xml))) {
      const p = byId(pm[1]); if (!p) continue;
      const nm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
      if (nm !== 'Shift Center To') continue;
      const kf = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
      if (!kf) {
        const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
        const v = sk ? sk.split(',')[1] : null; if (!v) return null;
        const [x, y] = v.split(':').map(Number); return [{ t: 0, dx: +(x - 0.5).toFixed(4), dy: +(y - 0.5).toFixed(4) }];
      }
      return kf.split(';').filter(Boolean).map((k) => { const a = k.split(','); const t = Number(a[0]) / TICKS; const [x, y] = a[1].split(':').map(Number); return { t: +t.toFixed(4), dx: +(x - 0.5).toFixed(4), dy: +(y - 0.5).toFixed(4) }; });
    }
  }
  return null;
}

function analyze(name) {
  const seq = findSeq(name); if (!seq) return { name, error: 'no seq' };
  const vgRef = (seq.match(/<Second ObjectRef="(\d+)"/) || [])[1];
  const vg = byId(vgRef); if (!vg) return { name, error: 'no vg' };
  const trackUids = [...vg.xml.matchAll(/<Track Index="\d+" ObjectURef="([0-9a-f-]{36})"/g)].map((x) => x[1]);
  let offsets = null, dur = 0;
  trackUids.forEach((tu) => {
    const t = byUid(tu); if (!t) return;
    const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
    for (const id of items) {
      const it = byId(id); if (!it) continue;
      const end = (it.xml.match(/<End>(\d+)<\/End>/) || [])[1];
      if (end) dur = Math.max(dur, +(Number(end) / TICKS).toFixed(3));
      const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
      if (compRef && !offsets) { const ch = byId(compRef); if (ch) { const kf = offsetKeyframes(ch.xml); if (kf && kf.length > 1) offsets = kf; } }
    }
  });
  return { name, durationSec: dur, offsets };
}

const NAMES = [];
for (const v of ['Max', 'Min', 'Short']) for (const n of [1, 2, 3]) NAMES.push(`Glitch Cinematic Bad Signal ${v} - ${n}`);
const out = [];
for (const nm of NAMES) { const r = analyze(nm); out.push(r); process.stdout.write(`${nm}: dur=${r.durationSec}s offsetKfs=${r.offsets ? r.offsets.length : 'NONE'}\n`); }
fs.writeFileSync(path.join(__dirname, '_badsignal-real.json'), JSON.stringify(out, null, 2));
process.stdout.write('DONE\n');
