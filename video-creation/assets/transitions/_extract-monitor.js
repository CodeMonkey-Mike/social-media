#!/usr/bin/env node
/** Per-clip real data for all 9 Glitch Cinematic Monitor transitions (Max/Min/Short x 1-3).
 * Walks each sequence's VIDEO TrackGroup only (NOTE: sequences carry TWO TrackGroups and
 * the audio one can come first — _recipe-seq.js's "first <Second ObjectRef>" grab walks
 * the 65-track audio group for this family; here we pick by tag === VideoTrackGroup).
 * Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
 * every component with every param (static value + ALL keyframes), Opacity blend modes.
 * Writes _monitor-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
 * (gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing). */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const XML_PATH = path.join(process.env.TEMP, 'sw.xml');
if (!fs.existsSync(XML_PATH)) {
  const prproj = path.join(__dirname, 'Swiftly Studio 850 Seamless Transitions/Transitions/Transitions - FullHD - 1920x1080.prproj');
  process.stderr.write('decompressing prproj -> sw.xml ...\n');
  fs.writeFileSync(XML_PATH, zlib.gunzipSync(fs.readFileSync(prproj)));
}
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
    if (no !== -1 && no < nc) { d++; i = no + tag.length + 1; } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); }
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

/** Sequence footer looks like: <TrackGroups>...</TrackGroups><ID>..</ID><Name>SEQNAME</Name>...
 * Find the name occurrence with a TrackGroups block shortly before it (the Sequence object),
 * NOT the MasterClip/SubClip occurrences of the same string. */
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

function params(compXml) {
  const out = [];
  const pr = /<Param\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let pm;
  while ((pm = pr.exec(compXml))) {
    const p = byId(pm[1]); if (!p) continue;
    const nm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
    if (!nm) continue;
    const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
    const kfRaw = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
    const entry = { name: nm };
    if (sk) entry.value = sk.split(',')[1];
    if (kfRaw) {
      entry.keyframes = kfRaw.split(';').filter(Boolean).map((k) => {
        const a = k.split(',');
        return { t: +(Number(a[0]) / TICKS).toFixed(4), v: a[1] };
      });
    }
    if (entry.value !== undefined || entry.keyframes) out.push(entry);
  }
  return out;
}

function analyze(name) {
  const refs = seqTrackGroupRefs(name);
  if (!refs || !refs.length) return { name, error: 'no sequence/trackgroups' };
  let vg = null;
  for (const r of refs) { const g = byId(r); if (g && g.tag === 'VideoTrackGroup') { vg = g; break; } }
  if (!vg) return { name, error: 'no VideoTrackGroup among refs ' + refs.join(',') };
  const clips = [];
  const trackUids = [...vg.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
  for (const [, ti, tu] of trackUids) {
    const t = byUid(tu); if (!t) continue;
    const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
    for (const id of items) {
      const it = byId(id); if (!it) continue;
      const start = (it.xml.match(/<Start>(\d+)<\/Start>/) || [])[1];
      const end = (it.xml.match(/<End>(\d+)<\/End>/) || [])[1];
      const clip = {
        track: +ti,
        start: start ? +(start / TICKS).toFixed(4) : null,
        end: end ? +(end / TICKS).toFixed(4) : null,
      };
      const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
      if (subRef) {
        const sc = byId(subRef);
        if (sc) {
          clip.subClipName = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || null;
          // media in-point: the SubClip's inner Clip carries InPoint/OutPoint (the
          // plate clips do NOT start at media 0 — Max-1 t4 plays plate from 0.08s)
          const clipRef = (sc.xml.match(/<Clip ObjectRef="(\d+)"/) || [])[1];
          if (clipRef) {
            const cc = byId(clipRef);
            const ip = cc && (cc.xml.match(/<InPoint>(-?\d+)<\/InPoint>/) || [])[1];
            if (ip !== undefined && ip !== null) clip.inPoint = +(ip / TICKS).toFixed(4);
          }
          const mcUid = (sc.xml.match(/<MasterClip ObjectURef="([0-9a-f-]{36})"/) || [])[1];
          const mcRef = (sc.xml.match(/<MasterClip ObjectRef="(\d+)"/) || [])[1];
          const mc = mcUid ? byUid(mcUid) : mcRef ? byId(mcRef) : null;
          if (mc) {
            clip.masterClipName = (mc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || null;
            clip.isAdjustment = /AdjustmentLayer|isAdjustment/i.test(mc.xml);
            const mediaPath = (mc.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || mc.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1];
            if (mediaPath) clip.mediaPath = mediaPath;
          }
        }
      }
      const compRef = (it.xml.match(/<Components ObjectRef="(\d+)"/) || [])[1];
      clip.effects = [];
      if (compRef) {
        const ch = byId(compRef);
        if (ch) {
          const cr = /<Component\s+Index="\d+"\s+ObjectRef="(\d+)"/g; let m;
          while ((m = cr.exec(ch.xml))) {
            const c = byId(m[1]); if (!c) continue;
            const mn = (c.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
            if (!mn) continue;
            clip.effects.push({ matchName: mn, params: params(c.xml) });
          }
        }
      }
      clips.push(clip);
    }
  }
  return { name, clips };
}

const NAMES = [];
for (const v of ['Max', 'Min', 'Short']) for (const n of [1, 2, 3]) NAMES.push(`Glitch Cinematic Monitor ${v} - ${n}`);
const out = [];
for (const nm of NAMES) {
  const r = analyze(nm);
  out.push(r);
  process.stdout.write(`${nm}: ${r.error ? 'ERROR ' + r.error : r.clips.length + ' clips'}\n`);
}
fs.writeFileSync(path.join(__dirname, '_monitor-clips.json'), JSON.stringify(out, null, 2));
process.stdout.write('DONE -> _monitor-clips.json\n');
