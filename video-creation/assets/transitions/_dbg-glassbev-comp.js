#!/usr/bin/env node
/** Dump RAW component XML for the Glass Beveled 1 - Left (In) adjustment clip —
 * looking for effect MASKS (facet regions) that params() doesn't capture. */
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
  return xml.slice(start, start + 20000);
}
const byId = (id) => { const e = idIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
const byUid = (id) => { const e = uidIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };

// find the sequence
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

const refs = seqTrackGroupRefs('Glass Beveled 1 - Left');
let vg = null;
for (const r of refs) { const g = byId(r); if (g && g.tag === 'VideoTrackGroup' && !vg) vg = g; }
const trackUids = [...vg.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
console.log('video tracks:', trackUids.length);
// PASS 1: full track/item survey
for (const [, ti, tu] of trackUids) {
  const t = byUid(tu); if (!t) { console.log('track', ti, 'UNRESOLVED tag'); continue; }
  console.log('track', ti, 'tag=' + t.tag, 'bytes=' + t.xml.length);
  const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
  console.log('  TrackItems:', items.length);
  // also list ANY ObjectRef-bearing child tags in case items are referenced differently
  const refTags = [...new Set([...t.xml.matchAll(/<([A-Za-z0-9_.]+)[^>]*ObjectRef="\d+"/g)].map((m) => m[1]))];
  console.log('  ref-bearing tags:', refTags.join(','));
  for (const id of items) {
    const it = byId(id);
    const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
    let nm = '?';
    if (subRef) { const sc = byId(subRef); nm = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '?'; }
    console.log('  item', id, JSON.stringify(nm));
  }
}
// PASS 2: dump the (In) clip's Offset SubComponents (suspected masks)
outer:
for (const [, ti, tu] of trackUids) {
  const t = byUid(tu); if (!t) continue;
  const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
  for (const id of items) {
    const it = byId(id);
    const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
    let nm = '?';
    if (subRef) { const sc = byId(subRef); nm = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '?'; }
    if (!/\(In\)/.test(nm)) continue;
    const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
    const ch = byId(compRef);
    const comps = [...ch.xml.matchAll(/<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g)].map((x) => x[1]);
    for (const cid of comps) {
      const c = byId(cid);
      const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
      const subs = [...c.xml.matchAll(/<SubComponent Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
      if (!subs.length) continue;
      console.log(`\n=== ${mn} comp ${cid}: ${subs.length} SubComponent(s)`);
      for (const sid of subs) {
        const s = byId(sid);
        console.log(`--- SubComponent ${sid} tag=${s.tag} bytes=${s.xml.length}`);
        console.log(s.xml.slice(0, 6000));
      }
      break outer; // one offset's mask is enough for structure
    }
  }
}
