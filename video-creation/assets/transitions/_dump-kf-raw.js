#!/usr/bin/env node
/** One-off: print the RAW <Keyframes> + <StartKeyframe> strings for the Offset and
 * Motion Blur params of a named sequence's clips, so the temporal-bezier field
 * format can be decoded (the builder currently discards the handle fields). */
const fs = require('fs');
const path = require('path');

const XML_PATH = process.env.SWXML || path.join(process.env.TEMP, 'sw.xml');
const xml = fs.readFileSync(XML_PATH, 'utf8');

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

function seqTrackGroupRefs(name) {
  let pos = -1;
  while ((pos = xml.indexOf('<Name>' + name + '</Name>', pos + 1)) !== -1) {
    const back = xml.slice(Math.max(0, pos - 4000), pos);
    const tgStart = back.lastIndexOf('<TrackGroups');
    if (tgStart === -1) continue;
    const tgXml = back.slice(tgStart);
    if (!/<\/TrackGroups>/.test(tgXml)) continue;
    return [...tgXml.matchAll(/<Second ObjectRef="(\d+)"\/>/g)].map((m) => m[1]);
  }
  return null;
}

const name = process.argv[2] || 'Offset Hit - Right';
const refs = seqTrackGroupRefs(name);
let vg = null;
for (const r of refs) { const g = byId(r); if (g && g.tag === 'VideoTrackGroup') { vg = g; break; } }
const trackUids = [...vg.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
for (const [, ti, tu] of trackUids) {
  const t = byUid(tu); if (!t) continue;
  for (const [, itemId] of t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)) {
    const it = byId(itemId); if (!it) continue;
    const sub = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
    const sc = sub && byId(sub);
    const clipName = sc ? (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] : '?';
    const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
    if (!compRef) continue;
    const ch = byId(compRef); if (!ch) continue;
    for (const [, compId] of ch.xml.matchAll(/<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g)) {
      const c = byId(compId); if (!c) continue;
      const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
      if (!/Offset|Motion Blur/.test(mn || '')) continue;
      for (const [, paramId] of c.xml.matchAll(/<Param\s+Index="\d+"\s+ObjectRef="(\d+)"/g)) {
        const p = byId(paramId); if (!p) continue;
        const nm = (p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1];
        if (!/Shift Center To|Blur Length/.test(nm || '')) continue;
        const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
        const kf = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
        console.log(`\nT${ti} "${clipName}" ${mn} :: ${nm}`);
        console.log(`  StartKeyframe RAW: ${sk}`);
        if (kf) for (const row of kf.split(';').filter(Boolean)) console.log(`  KF RAW: ${row}`);
      }
    }
  }
}
