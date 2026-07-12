#!/usr/bin/env node
/** Dump the AEMask params of every Offset SubComponent on Glass Beveled 1 - Left (In)+(Out). */
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
  return xml.slice(start, start + 30000);
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
const TICKS = 254016000000;

const seqName = process.argv[2] || 'Glass Beveled 1 - Left';
const refs = seqTrackGroupRefs(seqName);
let vg = null;
for (const r of refs) { const g = byId(r); if (g && g.tag === 'VideoTrackGroup' && !vg) vg = g; }
const trackUids = [...vg.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
for (const [, ti, tu] of trackUids) {
  const t = byUid(tu); if (!t) continue;
  const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
  for (const id of items) {
    const it = byId(id);
    const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
    let nm = '?';
    if (subRef) { const sc = byId(subRef); nm = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '?'; }
    if (!/\((In|Out)\)/.test(nm)) continue;
    console.log('\n########', nm);
    const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
    const ch = byId(compRef);
    const comps = [...ch.xml.matchAll(/<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g)].map((x) => x[1]);
    let offIdx = 0;
    for (const cid of comps) {
      const c = byId(cid);
      const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
      if (mn !== 'AE.ADBE Offset') continue;
      const subs = [...c.xml.matchAll(/<SubComponent Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
      console.log(`\n== Offset[${offIdx++}] comp ${cid}, ${subs.length} mask(s)`);
      for (const sid of subs) {
        const s = byId(sid);
        const prefs = [...s.xml.matchAll(/<Param Index="(\d+)" ObjectRef="(\d+)"/g)];
        for (const [, pi, pid] of prefs) {
          const p = byId(pid);
          if (!p) { console.log(`  param[${pi}] UNRESOLVED`); continue; }
          const pnm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
          const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
          const kfRaw = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
          let desc = `  [${pi}] "${pnm}" tag=${p.tag} bytes=${p.xml.length}`;
          if (sk !== undefined) desc += ` START=${sk.length > 300 ? sk.slice(0, 300) + `...(${sk.length}ch)` : sk}`;
          if (kfRaw) {
            const kfs = kfRaw.split(';').filter(Boolean);
            desc += ` KF=${kfs.length}`;
            for (const k of kfs.slice(0, 3)) desc += `\n      kf t=${(Number(k.split(',')[0]) / TICKS).toFixed(3)} ${k.length > 260 ? k.slice(0, 260) + `...(${k.length}ch)` : k}`;
          }
          console.log(desc);
          // if the param body has other interesting tags, show them
          const extraTags = [...new Set([...p.xml.matchAll(/<([A-Za-z0-9_.]+)[\s>]/g)].map((m) => m[1]))]
            .filter((x) => !['Name', 'StartKeyframe', 'Keyframes', 'Param', 'ID', 'ParameterControlType', 'LowerBound', 'UpperBound', 'Component'].includes(x) && x !== p.tag);
          if (extraTags.length) console.log('      extra tags:', extraTags.join(','));
        }
      }
      if (offIdx >= 2 && /\(Out\)/.test(nm)) break; // 2 per clip is enough for structure discovery
    }
  }
}
