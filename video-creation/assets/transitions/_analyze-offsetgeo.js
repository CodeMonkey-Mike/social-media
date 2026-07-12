#!/usr/bin/env node
/** Compare the Offset sub-families for ONE direction to decode what distinguishes
 * Simple / Ease / Bounce / Hit / Swinging / Warp (+ Short/Long). Prints per sub-family:
 * total duration, cut point, the merged Offset curve (seq-time -> shift x/y), the
 * Motion Blur direction + length curve, the Alpha Adjust opacity, and any extra clips. */
const fs = require('fs');
const path = require('path');
const data = require('./_offsetgeo-clips.json');
const DIR = process.argv[2] || 'Right';

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => { const [a, b] = String(v).split(':'); return [num(a), num(b)]; };

// merge an adjustment clip's keyframes into SEQUENCE time (t_seq = clip.start + kf.t - inPoint)
function seqKfs(clip, effMatch, paramName) {
  const eff = (clip.effects || []).find((e) => e.matchName === effMatch);
  if (!eff) return null;
  const p = eff.params.find((x) => x.name === paramName);
  if (!p) return null;
  const ip = clip.inPoint || 0;
  if (p.keyframes) return p.keyframes.map((k) => ({ t: +(clip.start + k.t - ip).toFixed(4), v: k.v }));
  return [{ t: clip.start, v: p.value }];
}

for (const seq of data) {
  if (!seq.name.endsWith('- ' + DIR)) continue;
  const fam = seq.name.replace(' - ' + DIR, '');
  const dur = Math.max(...seq.clips.map((c) => c.end || 0));
  // offset clips = HST Adjustment with an Offset effect
  const offClips = seq.clips.filter((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Offset'));
  // build merged offset curve (dedupe by seq-time)
  const merged = new Map();
  let cut = null;
  for (const c of offClips) {
    if (c.subClipName && /\(Out\)/.test(c.subClipName)) cut = c.start;
    for (const k of seqKfs(c, 'AE.ADBE Offset', 'Shift Center To') || []) {
      const [x, y] = xy(k.v);
      merged.set(k.t, [x, y]);
    }
  }
  const curve = [...merged.entries()].sort((a, b) => a[0] - b[0])
    .map(([t, [x, y]]) => `${t}:(${x},${y})`).join(' ');
  // motion blur
  const mbClip = seq.clips.find((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Motion Blur'));
  const mb = mbClip && mbClip.effects.find((e) => e.matchName === 'AE.ADBE Motion Blur');
  const mbDir = mb && (mb.params.find((p) => p.name === 'Direction') || {}).value;
  const mbLenP = mb && mb.params.find((p) => p.name === 'Blur Length');
  const mbLen = mbLenP && (mbLenP.keyframes ? mbLenP.keyframes.map((k) => `${k.t}:${num(k.v)}`).join(' ') : mbLenP.value);
  // alpha adjust
  const aaClip = seq.clips.find((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Alpha Adjust'));
  const aa = aaClip && aaClip.effects.find((e) => e.matchName === 'AE.ADBE Alpha Adjust');
  const aaOpP = aa && aa.params.find((p) => p.name === 'Opacity');
  const aaOp = aaOpP && (aaOpP.keyframes ? aaOpP.keyframes.map((k) => `${k.t}:${num(k.v)}`).join(' ') : aaOpP.value);
  // extra clips (not content, not the 3 known adjustment roles)
  const extra = seq.clips.filter((c) => {
    const hasOff = (c.effects || []).some((e) => e.matchName === 'AE.ADBE Offset');
    const hasMB = (c.effects || []).some((e) => e.matchName === 'AE.ADBE Motion Blur');
    const isContent = (c.effects || []).length === 0 && c.track === 0;
    return !hasOff && !hasMB && !isContent;
  }).map((c) => `T${c.track} "${c.subClipName}" [${c.start}-${c.end}] fx=${(c.effects || []).map((e) => e.matchName.replace('AE.ADBE ', '')).join('+') || '-'}`);

  console.log(`\n=== ${fam}  (dur ${dur}s, ${seq.clips.length} clips, cut ${cut})`);
  console.log(`  OFFSET  ${curve}`);
  console.log(`  MBLUR   dir=${mbDir}  len=${mbLen}`);
  console.log(`  ALPHA   ${aaOp}`);
  if (extra.length) console.log(`  EXTRA   ${extra.join(' | ')}`);
}
