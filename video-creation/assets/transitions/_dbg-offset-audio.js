// debug: what's inside the AudioTrackGroup of "Glitch Offset - 1x"
const fs = require('fs');
const path = require('path');
const xml = fs.readFileSync(path.join(process.env.TEMP, 'sw.xml'), 'utf8');

const idIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g; let m; while ((m = re.exec(xml))) idIndex.set(m[2], { start: m.index, tag: m[1] }); }
const uidIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectUID="([0-9a-f-]{36})"/g; let m; while ((m = re.exec(xml))) uidIndex.set(m[2], { start: m.index, tag: m[1] }); }

function slice(start, tag) {
  const fc = xml.indexOf('>', start);
  if (xml[fc - 1] === '/') return xml.slice(start, fc + 1);
  const o = new RegExp('<' + tag + '(\\s|>)', 'g'); const ct = '</' + tag + '>';
  let d = 0, i = start;
  while (i < xml.length) {
    o.lastIndex = i; const mm = o.exec(xml); const no = mm ? mm.index : -1; const nc = xml.indexOf(ct, i);
    if (nc === -1) break;
    if (no !== -1 && no < nc) { d++; i = no + tag.length + 1; } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); }
  }
  return xml.slice(start, start + 12000);
}
const byId = (id) => { const e = idIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
const byUid = (id) => { const e = uidIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };

for (const ref of ['17332', '17333']) {
  const g = byId(ref);
  console.log('ref', ref, '->', g && g.tag, g && g.xml.length + ' chars');
  if (!g) continue;
  const tracks = [...g.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
  console.log('  tracks:', tracks.length);
  for (const [, ti, tu] of tracks.slice(0, 6)) {
    const t = byUid(tu);
    if (!t) { console.log('  t' + ti + ': UNRESOLVED'); continue; }
    const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)];
    console.log('  t' + ti + ' tag=' + t.tag + ' len=' + t.xml.length + ' items=' + items.length);
    if (t.tag !== 'VideoClipTrack' && t.xml.length < 3000) console.log(t.xml.slice(0, 1500));
  }
}
