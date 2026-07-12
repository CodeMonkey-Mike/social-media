#!/usr/bin/env node
/** Per-clip real data for the GLASS / Beveled sub-family (12 sequences):
 *   Beveled {1,2} x {Up,Down,Left,Right} + Beveled {3,4} x {Horizontal,Vertical}.
 * Each main sequence nests a "<name> (In)" and "<name> (Out)" sub-sequence; we extract
 * the main sequence AND both nested sub-sequences (they carry the real effect stacks).
 * Same closure-walk as _extract-offsetgeo.js: sequences carry TWO TrackGroups (pick the
 * VideoTrackGroup by tag), clips carry media in-points, effects apply BOTTOM-UP.
 * Per clip: time window, SubClip->MasterClip (name / adjustment flag / media path / nested
 * sequence name), media in-point, every component (MatchName) with every param
 * (static value + ALL keyframe fields incl. the temporal-bezier handles). Writes
 * _glassbeveled-clips.json. Reads decompressed project XML from %TEMP%/sw.xml.
 *
 * Optional CLI arg = substring filter (e.g. "1 - Left").
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Honor SWXML (the DEVIATION 4K-check gotcha: without this a "4K run" silently re-reads FullHD)
const XML_PATH = process.env.SWXML || path.join(process.env.TEMP, 'sw.xml');
if (!fs.existsSync(XML_PATH)) {
  const prproj = path.join(__dirname, 'Swiftly Studio 850 Seamless Transitions/Transitions/Transitions - FullHD - 1920x1080.prproj');
  process.stderr.write('decompressing prproj -> sw.xml ...\n');
  fs.writeFileSync(XML_PATH, zlib.gunzipSync(fs.readFileSync(prproj)));
}
process.stderr.write('XML: ' + XML_PATH + '\n');
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

// ---- AEMask support (new for GLASS) -------------------------------------------------
// Mask Path values are '2cin' binary blobs, base64 in StartKeyframeValue. Premiere DEDUPS
// them by BinaryHash: one occurrence carries the payload inline, the rest are self-closed
// references. Build hash -> base64 once.
const blobByHash = new Map();
{
  const re = /<StartKeyframeValue Encoding="base64" BinaryHash="([0-9a-f-]+)">([\s\S]*?)<\/StartKeyframeValue>/g;
  let m;
  while ((m = re.exec(xml))) { if (!blobByHash.has(m[1])) blobByHash.set(m[1], m[2].replace(/\s+/g, '')); }
  process.stderr.write('blob table: ' + blobByHash.size + ' hashes\n');
}
/** Decode a '2cin' mask path: header magic,i32 ver,i32 flag,i32 nVerts; per vertex
 *  separators (1 i32 for the first vertex, 2 for later ones) + 6 f32 = anchor,inTan,outTan;
 *  trailing i32. Coords are normalized frame space (y down), may extend past [0,1]. */
function decodeMaskPath(b64) {
  const b = Buffer.from(b64, 'base64');
  if (b.slice(0, 4).toString() !== '2cin') return { error: 'bad magic', b64 };
  const ver = b.readInt32LE(4), flag = b.readInt32LE(8), nVerts = b.readInt32LE(12);
  let o = 16;
  const verts = [];
  for (let v = 0; v < nVerts; v++) {
    o += v === 0 ? 4 : 8; // separators
    const f = [];
    for (let k = 0; k < 6; k++) { f.push(+b.readFloatLE(o).toFixed(5)); o += 4; }
    verts.push({ a: [f[0], f[1]], ti: [f[2], f[3]], to: [f[4], f[5]] });
  }
  o += 4; // trailing
  const out = { ver, flag, nVerts, verts };
  if (o !== b.length) out.layoutWarn = `consumed ${o} of ${b.length}`;
  return out;
}
function masks(compXml) {
  const out = [];
  const sr = /<SubComponent Index="\d+" ObjectRef="(\d+)"/g; let sm;
  while ((sm = sr.exec(compXml))) {
    const s = byId(sm[1]); if (!s) continue;
    const mn = (s.xml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1];
    if (mn !== 'AE.ADBE AEMask') { out.push({ matchName: mn, raw: true }); continue; }
    const mask = { matchName: mn };
    const prefs = [...s.xml.matchAll(/<Param Index="(\d+)" ObjectRef="(\d+)"/g)];
    for (const [, pi, pid] of prefs) {
      const p = byId(pid); if (!p) continue;
      const pnm = ((p.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '').trim();
      if (pnm === 'Mask Path') {
        // inline payload OR hash reference into the blob table
        const inline = (p.xml.match(/<StartKeyframeValue[^>]*>([\s\S]*?)<\/StartKeyframeValue>/) || [])[1];
        const hash = (p.xml.match(/BinaryHash="([0-9a-f-]+)"/) || [])[1];
        const b64 = inline ? inline.replace(/\s+/g, '') : hash ? blobByHash.get(hash) : null;
        mask.pathHash = hash;
        mask.path = b64 ? decodeMaskPath(b64) : { error: 'no payload for hash ' + hash };
        // keyframed mask paths would be a different beast — flag them loudly
        if (/<Keyframes>/.test(p.xml)) mask.pathKeyframed = true;
      } else {
        const sk = (p.xml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
        const kfRaw = (p.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
        const key = pnm || 'p' + pi;
        if (sk) mask[key] = sk.split(',')[1];
        if (kfRaw) mask[key + '_kf'] = kfRaw.split(';').filter(Boolean).map((k) => {
          const a = k.split(',');
          return { t: +(Number(a[0]) / TICKS).toFixed(4), v: a[1], a: a.slice(1) };
        });
      }
    }
    out.push(mask);
  }
  return out;
}
// -------------------------------------------------------------------------------------

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
        // Full row: time, value, interpA, interpB, inVel, inInf, outVel, outInf, [spatial extras]
        return { t: +(Number(a[0]) / TICKS).toFixed(4), v: a[1], a: a.slice(1) };
      });
    }
    if (entry.value !== undefined || entry.keyframes) out.push(entry);
  }
  return out;
}

function walkGroup(group) {
  const clips = [];
  const trackUids = [...group.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
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
            // a nested SEQUENCE master clip has no media path but references a Sequence
            if (/<Sequence /.test(mc.xml) || /SequenceMasterClip|isSequence/i.test(mc.xml)) clip.isSequence = true;
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
            // also capture the human component name for readability
            const cn = (c.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1];
            const eff = { matchName: mn, name: cn || undefined, params: params(c.xml) };
            const mk = masks(c.xml);
            if (mk.length) eff.masks = mk;
            clip.effects.push(eff);
          }
        }
      }
      clips.push(clip);
    }
  }
  return clips;
}

function analyze(name) {
  const refs = seqTrackGroupRefs(name);
  if (!refs || !refs.length) return { name, error: 'no sequence/trackgroups' };
  let vg = null, ag = null;
  for (const r of refs) {
    const g = byId(r);
    if (g && g.tag === 'VideoTrackGroup' && !vg) vg = g;
    if (g && g.tag === 'AudioTrackGroup' && !ag) ag = g;
  }
  if (!vg) return { name, error: 'no VideoTrackGroup among refs ' + refs.join(',') };
  const out = { name, clips: walkGroup(vg) };
  if (ag) {
    out.audio = walkGroup(ag)
      .filter((c) => c.subClipName || c.masterClipName || c.mediaPath)
      .map(({ track, start, end, inPoint, subClipName, masterClipName, mediaPath }) =>
        ({ track, start, end, inPoint, subClipName, masterClipName, mediaPath }));
  }
  return out;
}

const BASES = [
  'Glass Beveled 1 - Up', 'Glass Beveled 1 - Down', 'Glass Beveled 1 - Left', 'Glass Beveled 1 - Right',
  'Glass Beveled 2 - Up', 'Glass Beveled 2 - Down', 'Glass Beveled 2 - Left', 'Glass Beveled 2 - Right',
  'Glass Beveled 3 - Horizontal', 'Glass Beveled 3 - Vertical',
  'Glass Beveled 4 - Horizontal', 'Glass Beveled 4 - Vertical',
];
// NOTE: "(In)"/"(Out)" are SUBCLIP names on HST Adjustment clips INSIDE each main
// sequence (verified 2026-07-12), not nested sequences — extract main sequences only.
const NAMES = [...BASES];

const filter = process.argv[2];
const out = [];
for (const nm of NAMES) {
  if (filter && !nm.includes(filter)) continue;
  const r = analyze(nm);
  out.push(r);
  process.stdout.write(`${nm}: ${r.error ? 'ERROR ' + r.error : r.clips.length + ' clips, ' + ((r.audio || []).length) + ' audio'}\n`);
}
const outfile = filter ? '_glassbeveled-sample.json' : '_glassbeveled-clips.json';
fs.writeFileSync(path.join(__dirname, outfile), JSON.stringify(out, null, 2));
process.stdout.write(`DONE -> ${outfile} (${out.length} sequences)\n`);
