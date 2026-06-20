#!/usr/bin/env node
/**
 * Per-CLIP extractor for all 15 GLITCH/Blocks transitions (the correct,
 * non-leaky path): Sequence -> VideoTrackGroup -> Tracks -> TrackItems ->
 * each clip's OWN component chain. Pulls the real Offset "Shift Center To"
 * vectors, the Geometry2 vertical Scale Height, and each clip's source name
 * (which `Gth - Disp Blocks` mask it uses). Writes _blocks-clips.json.
 */
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

function findSeq(name) {
  const re = /<Sequence\s+ObjectUID="[0-9a-f-]{36}"/g; let m;
  while ((m = re.exec(xml))) { const s = slice(m.index, 'Sequence'); const nm = (s.match(/<Name>([^<]*)<\/Name>/) || [])[1]; if (nm === name) return s; }
  return null;
}
function chainEffects(chainXml) {
  const fx = [];
  const cr = /<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let m;
  while ((m = cr.exec(chainXml))) {
    const c = byId(m[1]); if (!c) continue;
    const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1]; if (!mn) continue;
    const params = {};
    const pr = /<Param\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let pm;
    while ((pm = pr.exec(c.xml))) { const p = byId(pm[1]); if (!p) continue;
      const nm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
      const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
      if (nm && sk !== undefined) params[nm] = sk.split(',')[1];
    }
    fx.push({ matchName: mn, params });
  }
  return fx;
}
function analyze(name) {
  const seq = findSeq(name); if (!seq) return { name, error: 'no seq' };
  // first TrackGroup.Second = video group
  const vgRef = (seq.match(/<Second ObjectRef="(\d+)"/) || [])[1];
  const vg = byId(vgRef); if (!vg) return { name, error: 'no vgroup' };
  const trackUids = [...vg.xml.matchAll(/<Track Index="\d+" ObjectURef="([0-9a-f-]{36})"/g)].map((m) => m[1]);
  const clips = [];
  trackUids.forEach((tu, ti) => {
    const t = byUid(tu); if (!t) return;
    const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((m) => m[1]);
    for (const id of items) {
      const it = byId(id); if (!it) continue;
      const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
      const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
      const end = (it.xml.match(/<End>(\d+)<\/End>/) || [])[1];
      let src = '?'; if (subRef) { const sc = byId(subRef); if (sc) src = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || sc.tag; }
      let offset = null, scaleH = null;
      if (compRef) { const ch = byId(compRef); if (ch) { for (const f of chainEffects(ch.xml)) {
        if (f.matchName === 'AE.ADBE Offset' && f.params['Shift Center To']) { const [x, y] = f.params['Shift Center To'].split(':').map(Number); offset = { x, y, dx: +(x - 0.5).toFixed(4), dy: +(y - 0.5).toFixed(4) }; }
        if (f.matchName === 'AE.ADBE Geometry2' && f.params['Scale Height']) scaleH = parseFloat(f.params['Scale Height']);
      } } }
      clips.push({ track: ti, src, end: end ? +(end / TICKS).toFixed(3) : null, offset, scaleH });
    }
  });
  const offsets = clips.filter((c) => c.offset).map((c) => ({ dx: c.offset.dx, dy: c.offset.dy }));
  const masks = [...new Set(clips.map((c) => c.src).filter((s) => /Gth - Disp Blocks/.test(s)))];
  const scaleH = clips.map((c) => c.scaleH).filter(Boolean)[0] || null;
  return { name, offsets, masks, scaleH, clips };
}

const NAMES = [];
for (const v of ['Max', 'Medium', 'Short']) for (const n of [1, 2, 3]) NAMES.push(`Glitch Blocks ${v} - ${n}`);
for (const n of [1, 2, 3, 4, 5, 6]) NAMES.push(`Glitch Blocks Strips - ${n}x`);
const out = [];
for (const nm of NAMES) { const r = analyze(nm); out.push(r);
  process.stdout.write(`${nm}: offsets=${r.offsets ? r.offsets.length : '?'} masks=${JSON.stringify(r.masks)} scaleH=${r.scaleH}\n`); }
fs.writeFileSync(path.join(__dirname, '_blocks-clips.json'), JSON.stringify(out, null, 2));
process.stdout.write('DONE wrote _blocks-clips.json\n');
