#!/usr/bin/env node
/** Condense _invert-clips.json -> per-variant frame schedule.
 * For each sequence: duration, adjustment-clip windows, and per 0.04s timeline frame
 * the set of ACTIVE ops (invert channel N when Blend With Original == 0; tint when
 * Amount to Tint == 100). Media time -> timeline: t_timeline = kf.t - inPoint + clip.start.
 * Also dumps distinct channel values + tint colors (decoded from Premiere packed number).
 */
const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '_invert-clips.json'), 'utf8'));

const channels = new Set();
const tintColors = new Set();
const EPS = 1e-6;

for (const seq of data) {
  const adj = seq.clips.filter((c) => c.masterClipName === 'HST Adjustment');
  const others = seq.clips.filter((c) => c.masterClipName !== 'HST Adjustment');
  const dur = Math.max(...seq.clips.map((c) => c.end));
  console.log(`\n=== ${seq.name} | dur ${dur}s | adj windows: ${adj.map((c) => c.start + '-' + c.end).join(', ')} | other clips: ${others.map((c) => c.masterClipName + ' ' + c.start + '-' + c.end + (c.effects.length ? ' FX:' + c.effects.map((e) => e.matchName).join('+') : '')).join(' | ')}`);
  // frame grid
  const frames = Math.round(dur / 0.04);
  const sched = [];
  for (let f = 0; f < frames; f++) sched.push(new Set());
  for (const c of adj) {
    for (const fx of c.effects) {
      const chP = fx.params.find((p) => p.name === 'Channel');
      const isInvert = fx.matchName === 'AE.ADBE Invert';
      const isTint = fx.matchName === 'AE.ADBE Tint';
      if (isInvert && chP) channels.add(chP.value);
      if (isTint) { const w = fx.params.find((p) => p.name === 'Map White To'); if (w) tintColors.add(w.value); }
      const kfP = fx.params.find((p) => p.keyframes);
      if (!kfP) { console.log(`  !! ${fx.matchName} has NO keyframed param`); continue; }
      const onWhen = isInvert ? (v) => Math.abs(+v) < EPS : (v) => Math.abs(+v - 100) < EPS;
      for (const kf of kfP.keyframes) {
        const tl = +(kf.t - c.inPoint + c.start).toFixed(4);
        if (tl < c.start - EPS || tl > c.end - 0.04 + EPS) continue; // outside clip window
        const f = Math.round(tl / 0.04);
        if (f < 0 || f >= frames) continue;
        if (onWhen(kf.v)) sched[f].add(isInvert ? 'inv' + chP.value : 'tint');
      }
    }
  }
  for (let f = 0; f < frames; f++) {
    const t = (f * 0.04).toFixed(2);
    console.log(`  f${String(f).padStart(2)} t=${t}  ${sched[f].size ? [...sched[f]].sort().join(' ') : '-'}`);
  }
}

console.log('\nDistinct invert Channel values:', [...channels].sort((a, b) => a - b).join(', '));
for (const c of tintColors) {
  const n = BigInt(c);
  console.log(`Tint Map White To raw=${c} hex=0x${n.toString(16)}`);
}
