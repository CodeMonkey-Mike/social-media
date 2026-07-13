#!/usr/bin/env node
/** Per-clip real data for PERSPECTIVE all 8 Ease/Hit subgroups (64 A->B transitions; Hit Out uses a DOUBLE SPACE in its sequence names). Full capture incl. masks, in/out points, remaps. */
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
            const op = cc && (cc.xml.match(/<OutPoint>(-?\d+)<\/OutPoint>/) || [])[1];
            if (op !== undefined && op !== null) clip.outPoint = +(op / TICKS).toFixed(4);
            // TIME REMAPPING (found on the Soft leak clips 2026-07-12: the (In)
            // side plays its file BACKWARD into the cut). VideoClip ->
            // TimeRemapping -> TimeComponentParam 'Speed' whose VALUE = media
            // seconds as a function of clip time.
            const trRef = cc && (cc.xml.match(/<TimeRemapping ObjectRef="(\d+)"\/>/) || [])[1];
            if (trRef) {
              const tr = byId(trRef);
              const kfRef = tr && (tr.xml.match(/<Keyframes ObjectRef="(\d+)"\/>/) || [])[1];
              const kp = kfRef && byId(kfRef);
              const kfRaw = kp && (kp.xml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
              if (kfRaw) clip.timeRemap = kfRaw.split(';').filter(Boolean).map((k) => {
                const a = k.split(',');
                return { t: +(Number(a[0]) / TICKS).toFixed(4), v: +(+a[1]).toFixed(4), a: a.slice(2) };
              });
            }
          }
          const mcUid = (sc.xml.match(/<MasterClip ObjectURef="([0-9a-f-]{36})"/) || [])[1];
          const mcRef = (sc.xml.match(/<MasterClip ObjectRef="(\d+)"/) || [])[1];
          const mc = mcUid ? byUid(mcUid) : mcRef ? byId(mcRef) : null;
          if (mc) {
            clip.masterClipName = (mc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || null;
            clip.isAdjustment = /AdjustmentLayer|isAdjustment/i.test(mc.xml);
            let mediaPath = (mc.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || mc.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1];
            // deep resolve: MasterClip -> Clips[0] -> Source -> Media (leak layers store it there)
            if (!mediaPath) {
              const clipRef0 = (mc.xml.match(/<Clip Index="0" ObjectRef="(\d+)"/) || [])[1];
              const c0 = clipRef0 && byId(clipRef0);
              const srcRef = c0 && (c0.xml.match(/<Source ObjectRef="(\d+)"/) || [])[1];
              const s0 = srcRef && byId(srcRef);
              const mRef = s0 && (s0.xml.match(/<Media ObjectU?Ref="([^"]+)"/) || [])[1];
              const m0 = mRef ? (mRef.length === 36 ? byUid(mRef) : byId(mRef)) : null;
              mediaPath = m0 ? ((m0.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || m0.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1]) : undefined;
            }
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
 "Perspective Ease In - Down",
 "Perspective Ease In - Left",
 "Perspective Ease In - Left Down",
 "Perspective Ease In - Left Up",
 "Perspective Ease In - Right",
 "Perspective Ease In - Right Down",
 "Perspective Ease In - Right Up",
 "Perspective Ease In - Up",
 "Perspective Ease In Short - Down",
 "Perspective Ease In Short - Left",
 "Perspective Ease In Short - Left Down",
 "Perspective Ease In Short - Left Up",
 "Perspective Ease In Short - Right",
 "Perspective Ease In Short - Right Down",
 "Perspective Ease In Short - Right Up",
 "Perspective Ease In Short - Up",
 "Perspective Ease Out - Down",
 "Perspective Ease Out - Left",
 "Perspective Ease Out - Left Down",
 "Perspective Ease Out - Left Up",
 "Perspective Ease Out - Right",
 "Perspective Ease Out - Right Down",
 "Perspective Ease Out - Right Up",
 "Perspective Ease Out - Up",
 "Perspective Ease Out Short - Down",
 "Perspective Ease Out Short - Left",
 "Perspective Ease Out Short - Left Down",
 "Perspective Ease Out Short - Left Up",
 "Perspective Ease Out Short - Right",
 "Perspective Ease Out Short - Right Down",
 "Perspective Ease Out Short - Right Up",
 "Perspective Ease Out Short - Up",
 "Perspective Hit In - Down",
 "Perspective Hit In - Left",
 "Perspective Hit In - Left Down",
 "Perspective Hit In - Left Up",
 "Perspective Hit In - Right",
 "Perspective Hit In - Right Down",
 "Perspective Hit In - Right Up",
 "Perspective Hit In - Up",
 "Perspective Hit In Short - Down",
 "Perspective Hit In Short - Left",
 "Perspective Hit In Short - Left Down",
 "Perspective Hit In Short - Left Up",
 "Perspective Hit In Short - Right",
 "Perspective Hit In Short - Right Down",
 "Perspective Hit In Short - Right Up",
 "Perspective Hit In Short - Up",
 "Perspective  Hit Out - Down",
 "Perspective  Hit Out - Left",
 "Perspective  Hit Out - Left Down",
 "Perspective  Hit Out - Left Up",
 "Perspective  Hit Out - Right",
 "Perspective  Hit Out - Right Down",
 "Perspective  Hit Out - Right Up",
 "Perspective  Hit Out - Up",
 "Perspective  Hit Out Short - Down",
 "Perspective  Hit Out Short - Left",
 "Perspective  Hit Out Short - Left Down",
 "Perspective  Hit Out Short - Left Up",
 "Perspective  Hit Out Short - Right",
 "Perspective  Hit Out Short - Right Down",
 "Perspective  Hit Out Short - Right Up",
 "Perspective  Hit Out Short - Up"
];
// NOTE: "(In)"/"(Out)" are SUBCLIP names on HST Adjustment clips INSIDE each main
// sequence (verified 2026-07-12), not nested sequences — extract main sequences only.
const NAMES = [...BASES,
 "Perspective Pan 3D Ease - Down",
 "Perspective Pan 3D Ease - Left",
 "Perspective Pan 3D Ease - Right",
 "Perspective Pan 3D Ease - Up",
 "Perspective Pan 3D Short Ease - Down",
 "Perspective Pan 3D Short Ease - Left",
 "Perspective Pan 3D Short Ease - Right",
 "Perspective Pan 3D Short Ease - Up"
];

const filter = process.argv[2];
const out = [];
for (const nm of NAMES) {
  if (filter && !nm.includes(filter)) continue;
  const r = analyze(nm);
  out.push(r);
  process.stdout.write(`${nm}: ${r.error ? 'ERROR ' + r.error : r.clips.length + ' clips, ' + ((r.audio || []).length) + ' audio'}\n`);
}
const outfile = filter ? '_perspective-sample.json' : '_perspective-clips.json';
fs.writeFileSync(path.join(__dirname, outfile), JSON.stringify(out, null, 2));
process.stdout.write(`DONE -> ${outfile} (${out.length} sequences)\n`);
