#!/usr/bin/env node
/** Build the 9 Cinematic Monitor rows from _monitor-clips.json and MERGE them into
 * library.json (replaces monitor-* rows only; never touches other rows — safe unlike
 * _build-lib.js which regenerates the Blocks rows). Real values per sequence:
 *  - jolts: t1 "Texture Adjustment" windows — full-frame wrap Offset (dx = x-0.5, dy = y-0.5)
 *  - roll:  t3 "HST Adjustment" keyframed Offset — small vertical jitter (dy = y-0.5),
 *           rebased so the first keyframe sits at t=0 (Min-3 is authored at +0.88s)
 *  - wave:  t2 Wave Warp params verbatim (type 7, height 120, width 41.4, speed 2)
 *  - plate: t4 "Cinematic Monitor <V> <n>.mp4" overlay, Premiere Blend Mode 17 (Pin Light)
 *           → CSS 'hard-light' (closest CSS analog; no pin-light in CSS) — QA'd vs preview
 *  - swapAt: the t4 plate clip's split point / window duration (the A->B cut hides there)
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_monitor-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const m = seq.name.match(/Glitch Cinematic Monitor (Max|Min|Short) - (\d)/);
  const variant = m[1], n = m[2];
  const id = `monitor-${variant.toLowerCase()}-${n}`;

  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  // t1 jolt windows (constant full-frame Offset per window)
  const jolts = seq.clips
    .filter((c) => c.track === 1)
    .map((c) => {
      const off = c.effects.find((e) => /ADBE Offset/.test(e.matchName));
      const v = off && off.params.find((p) => p.name === 'Shift Center To');
      const [x, y] = v.value.split(':').map(Number);
      return { t0: c.start, t1: c.end, dx: +(x - 0.5).toFixed(4), dy: +(y - 0.5).toFixed(4) };
    });

  // t3 roll keyframes (vertical jitter), rebased to window start
  const t3 = seq.clips.find((c) => c.track === 3);
  const rollP = t3.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To');
  const kfs = rollP.keyframes;
  const base = kfs[0].t;
  const roll = kfs
    .map((k) => {
      const [, y] = k.v.split(':').map(Number);
      return { t: +(k.t - base).toFixed(4), dy: +(y - 0.5).toFixed(5) };
    })
    .filter((k) => k.t <= dur + 0.101);

  // t2 wave warp
  const t2 = seq.clips.find((c) => c.track === 2);
  const wp = t2.effects.find((e) => /Wave Warp/.test(e.matchName)).params;
  const wv = (nm) => Number(wp.find((p) => p.name === nm).value);
  const wave = { type: wv('Wave Type'), height: wv('Wave Height'), width: +wv('Wave Width').toFixed(2), speed: wv('Wave Speed') };

  // t4 plate split -> swapAt; the plate media does NOT start at 0 — it plays
  // continuously from the first segment's in-point (Max 0.08 / Min 0.24 / Short 0.16-0.2)
  const t4 = seq.clips.filter((c) => c.track === 4).sort((a, b) => a.start - b.start);
  const swapAt = +(t4[0].end / dur).toFixed(4);
  const plateIn = t4[0].inPoint || 0;

  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Cinematic Monitor',
    intensity: `${variant} ${n}`,
    label: `Glitch · Cinematic Monitor · ${variant} ${n}`,
    engine: 'GlitchCinematicMonitor',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      jolts,
      roll,
      wave,
      plateDir: `transitions/lib/plates/monitor-${variant.toLowerCase()}-${n}`,
      plateCount: 30,
      plateIn,
      // Premiere Blend Mode 17 = Pin Light @100%; the engine implements it exactly
      // as a darken+lighten layer pair with SVG component-transfer filters.
      plateBlend: 'pin-light',
      plateOpacity: 1,
      swapAt,
    },
    sfx: `transitions/lib/sfx-monitor-${variant.toLowerCase()}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchCinematicMonitor.tsx',
      description:
        'Broken-monitor glitch: rows tear into horizontally-shifted strips, the whole frame jolts in wrap-around jumps, colored signal bars and static noise flash over the footage; the cut hides mid-glitch.',
      energy: variant === 'Min' ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['glitch', 'monitor', 'signal', 'noise', 'tear', 'strips', variant.toLowerCase()],
      useWhen:
        variant === 'Max'
          ? 'Hard cut on a high-energy beat; the most violent of the family (0.8s).'
          : variant === 'Min'
            ? 'Quick subtle monitor blip between related shots (0.28s).'
            : 'Punchy mid-length monitor glitch (0.4-0.44s).',
    },
  });
}

const keep = lib.transitions.filter((r) => !/^monitor-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} monitor rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows) console.log(`  ${r.id}: dur=${r.durationSeconds}s jolts=${r.params.jolts.length} roll=${r.params.roll.length}kf swapAt=${r.params.swapAt}`);
