#!/usr/bin/env node
/** SURVEY (read-only, one-off): walk EVERY <Sequence> in the FullHD project and aggregate
 * per transition family: #variants, effect matchNames used, plate/footage clips referenced,
 * adjustment-layer usage, keyframed vs static params, audio presence.
 * Purpose: classify the remaining families as keyframe-only vs plate/procedural
 * (the "Blocks-type problem"). Writes _survey-remaining.json + prints a table.
 * Reads %TEMP%/sw.xml (same as the other extractors). */
const fs = require('fs');
const path = require('path');

const XML_PATH = path.join(process.env.TEMP, 'sw.xml');
const xml = fs.readFileSync(XML_PATH, 'utf8');
const TICKS = 254016000000;

const idIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g; let m; while ((m = re.exec(xml))) idIndex.set(m[2], { start: m.index, tag: m[1] }); }
const uidIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectUID="([0-9a-f-]{36})"/g; let m; while ((m = re.exec(xml))) uidIndex.set(m[2], { start: m.index, tag: m[1] }); }
process.stderr.write('indexes built\n');

function slice(start, tag) {
  const fc = xml.indexOf('>', start);
  if (xml[fc - 1] === '/') return xml.slice(start, fc + 1);
  const o = new RegExp('<' + tag + '(\\s|>)', 'g'); const ct = '</' + tag + '>';
  let d = 0, i = start;
  while (i < xml.length) {
    o.lastIndex = i; const mm = o.exec(xml); const no = mm ? mm.index : -1; const nc = xml.indexOf(ct, i);
    if (nc === -1) break;
    if (no !== -1 && no < nc) {
      // self-closing occurrences (e.g. nested <Sequence ObjectURef=".."/>) are not opens
      const gt = xml.indexOf('>', no);
      if (gt === -1) break;
      if (xml[gt - 1] !== '/') d++;
      i = gt + 1;
    } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); }
  }
  return xml.slice(start, start + 12000);
}
const sliceCache = new Map();
const byId = (id) => {
  id = String(id);
  if (sliceCache.has('i' + id)) return sliceCache.get('i' + id);
  const e = idIndex.get(id); const r = e ? { xml: slice(e.start, e.tag), tag: e.tag } : null;
  sliceCache.set('i' + id, r); return r;
};
const byUid = (id) => {
  id = String(id);
  if (sliceCache.has('u' + id)) return sliceCache.get('u' + id);
  const e = uidIndex.get(id); const r = e ? { xml: slice(e.start, e.tag), tag: e.tag } : null;
  sliceCache.set('u' + id, r); return r;
};

// ---- enumerate all Sequence objects (name + trackgroup refs), from each Sequence slice ----
const sequences = [];
let dbgSeq = 0, dbgNoName = 0, dbgNoTg = 0;
for (const [id, e] of [...idIndex, ...uidIndex]) {
  if (e.tag !== 'Sequence') continue;
  dbgSeq++;
  const sx = slice(e.start, 'Sequence');
  const name = (sx.match(/<Name>([^<]*)<\/Name>/) || [])[1];
  if (!name) { dbgNoName++; if (dbgNoName === 1) process.stderr.write('NO-NAME sample:\n' + sx.slice(0, 600) + '\n...\n' + sx.slice(-600) + '\n'); continue; }
  const tg = sx.match(/<TrackGroups[^>]*>([\s\S]*?)<\/TrackGroups>/);
  if (!tg) { dbgNoTg++; continue; }
  const refs = [...tg[1].matchAll(/<Second ObjectRef="(\d+)"\/>/g)].map((m) => m[1]);
  sequences.push({ id, name, refs });
}
process.stderr.write(`sequences: ${sequences.length} (tag hits ${dbgSeq}, noName ${dbgNoName}, noTrackGroups ${dbgNoTg})\n`);

function surveyGroup(group) {
  const res = { clips: 0, effects: new Map(), plates: new Set(), adjustments: new Set(), keyframedEffects: new Set(), audioFiles: new Set() };
  const trackUids = [...group.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
  for (const [, , tu] of trackUids) {
    const t = byUid(tu); if (!t) continue;
    const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
    for (const id of items) {
      const it = byId(id); if (!it) continue;
      res.clips++;
      const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
      if (subRef) {
        const sc = byId(subRef);
        if (sc) {
          const mcUid = (sc.xml.match(/<MasterClip ObjectURef="([0-9a-f-]{36})"/) || [])[1];
          const mcRef = (sc.xml.match(/<MasterClip ObjectRef="(\d+)"/) || [])[1];
          const mc = mcUid ? byUid(mcUid) : mcRef ? byId(mcRef) : null;
          if (mc) {
            const mcName = (mc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '';
            const isAdj = /AdjustmentLayer|isAdjustment/i.test(mc.xml);
            const mediaPath = (mc.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || mc.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1];
            if (isAdj) res.adjustments.add(mcName);
            else if (mediaPath && /\.(mp4|mov|png|jpg)$/i.test(mediaPath)) {
              // footage clip — plate if it lives under (Footage), else it's demo content
              if (/\(Footage\)/i.test(mediaPath)) res.plates.add(path.basename(mediaPath));
            }
            if (mediaPath && /\.(mp3|wav)$/i.test(mediaPath)) res.audioFiles.add(path.basename(mediaPath));
          }
        }
      }
      const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
      if (compRef) {
        const ch = byId(compRef);
        if (ch) {
          const cr = /<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let m;
          while ((m = cr.exec(ch.xml))) {
            const c = byId(m[1]); if (!c) continue;
            const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
            if (!mn || !/^AE\./.test(mn)) continue;
            res.effects.set(mn, (res.effects.get(mn) || 0) + 1);
            if (/<Keyframes>[^<]/.test(c.xml)) res.keyframedEffects.add(mn.replace(/^AE\.ADBE /, ''));
          }
        }
      }
    }
  }
  return res;
}

// family key = sequence name minus trailing variant numbering (" - 3x", " 2", " - 1", "(Slow) 3"...)
function famKey(name) {
  return name
    .replace(/\s*[-–]?\s*\d+x?\s*$/i, '')
    .replace(/\s*\(\s*Slow\s*\)\s*$/i, ' (Slow)')
    .trim();
}

const fams = new Map();
let done = 0;
for (const s of sequences) {
  let vg = null, ag = null;
  for (const r of s.refs) {
    const g = byId(r);
    if (g && g.tag === 'VideoTrackGroup' && !vg) vg = g;
    if (g && g.tag === 'AudioTrackGroup' && !ag) ag = g;
  }
  if (!vg) continue;
  const v = surveyGroup(vg);
  const a = ag ? surveyGroup(ag) : null;
  const key = famKey(s.name);
  if (!fams.has(key)) fams.set(key, { family: key, variants: [], effects: {}, keyframed: new Set(), plates: new Set(), adjustments: new Set(), audio: new Set(), clipCounts: [] });
  const f = fams.get(key);
  f.variants.push(s.name);
  f.clipCounts.push(v.clips);
  for (const [k, n] of v.effects) f.effects[k.replace(/^AE\.ADBE /, '')] = (f.effects[k.replace(/^AE\.ADBE /, '')] || 0) + n;
  for (const k of v.keyframedEffects) f.keyframed.add(k);
  for (const p of v.plates) f.plates.add(p);
  for (const p of v.adjustments) f.adjustments.add(p);
  if (a) for (const x of a.audioFiles) f.audio.add(x);
  done++;
  if (done % 100 === 0) process.stderr.write(`  ${done}/${sequences.length}\n`);
}

const out = [...fams.values()].map((f) => ({
  family: f.family,
  variants: f.variants.length,
  clipsPerVariant: [...new Set(f.clipCounts)].sort((a, b) => a - b).join('/'),
  effects: f.effects,
  keyframedEffects: [...f.keyframed].sort(),
  plates: [...f.plates].sort(),
  adjustments: [...f.adjustments].sort(),
  audio: [...f.audio].sort(),
})).sort((a, b) => a.family.localeCompare(b.family));

fs.writeFileSync(path.join(__dirname, '_survey-remaining.json'), JSON.stringify(out, null, 2));
for (const f of out) {
  const eff = Object.entries(f.effects).map(([k, n]) => `${k}:${n}`).join(' ');
  process.stdout.write(`${f.family}  [${f.variants} seqs, clips ${f.clipsPerVariant}]\n  fx: ${eff}\n  plates: ${f.plates.length ? f.plates.slice(0, 4).join(', ') + (f.plates.length > 4 ? ` (+${f.plates.length - 4})` : '') : '-'}\n  sfx: ${f.audio.length ? f.audio.slice(0, 3).join(', ') + (f.audio.length > 3 ? ' …' : '') : '-'}\n`);
}
process.stdout.write('DONE -> _survey-remaining.json\n');
