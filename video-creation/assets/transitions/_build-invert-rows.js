#!/usr/bin/env node
/** Build the 9 Glitch Invert rows from _invert-clips.json and MERGE them into
 * library.json (replaces invert-* rows only; never touches other rows).
 *
 * Mechanism (verified numerically vs the pack previews, 2026-07-04):
 *  - Two back-to-back "HST Adjustment" clips carry stacks of AE.ADBE Invert effects
 *    (each on one Channel) + one AE.ADBE Tint. "Blend With Original" keyframes toggle
 *    each op per 25fps frame (100 = off, 0 = on; Tint: "Amount to Tint" 100 = on).
 *  - Channel enum is 0-based COUNTING the popup separators: 0=RGB, 2=Green, 6=Hue,
 *    7=Lightness, 12=In Phase Chrominance. Tint maps black->black, white->white = b/w.
 *  - The component list applies BOTTOM-UP: Tint (listed last) applies FIRST, then the
 *    inverts (verified: Max-2's green flash is green_neg(gray(A)), not gray(green_neg)).
 *  - Both adjustment clips play media from in-point 0.88 (timeline t = kf.t - inPoint
 *    + clip.start). The A->B cut sits at the boundary between the two clips.
 *  - Preview QA note: the pack previews are 25->29.97fps conversions with FRAME
 *    BLENDING — flat-gray frames in them are pulldown blend artifacts, not content.
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_invert-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const STEP = 0.04; // source keyframe grid (25fps)
const EPS = 1e-6;

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const m = seq.name.match(/Glitch Invert (Max|Min|Short) - (\d)/);
  const variant = m[1], n = m[2];
  const id = `invert-${variant.toLowerCase()}-${n}`;

  const adj = seq.clips
    .filter((c) => c.masterClipName === 'HST Adjustment')
    .sort((a, b) => a.start - b.start);
  if (adj.length !== 2) throw new Error(`${id}: expected 2 adjustment clips, got ${adj.length}`);
  const dur = adj[1].end;
  const nSteps = Math.round(dur / STEP);
  const swapAt = +(adj[0].end / dur).toFixed(4);

  const steps = Array.from({ length: nSteps }, () => []);
  for (const c of adj) {
    // application order = REVERSED component order (bottom-up: tint first)
    const ordered = [...c.effects].reverse();
    for (const fx of ordered) {
      const isTint = fx.matchName === 'AE.ADBE Tint';
      const op = isTint ? 'tint' : 'inv' + fx.params.find((p) => p.name === 'Channel').value;
      const kfP = fx.params.find((p) => p.keyframes);
      for (const kf of kfP.keyframes) {
        const tl = +(kf.t - c.inPoint + c.start).toFixed(4);
        if (tl < c.start - EPS || tl > c.end - STEP + EPS) continue; // outside clip window
        const s = Math.round(tl / STEP);
        if (s < 0 || s >= nSteps) continue;
        const on = isTint ? Math.abs(+kf.v - 100) < EPS : Math.abs(+kf.v) < EPS;
        if (on) steps[s].push(op);
      }
    }
  }

  const flashes = steps.filter((s) => s.length).length;
  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Invert',
    intensity: `${variant} ${n}`,
    label: `Glitch · Invert · ${variant} ${n}`,
    engine: 'GlitchInvert',
    kind: 'shader',
    fidelity: 'near-1:1',
    durationSeconds: dur,
    params: { stepSeconds: STEP, steps, swapAt },
    sfx: `transitions/lib/sfx-invert-${variant.toLowerCase()}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchInvert.tsx',
      description:
        'Color-invert strobe: the full frame flickers through negative, hue-flip, chroma-flip and b/w flashes at 25fps; no displacement, the cut hides inside the strobe.',
      energy: variant === 'Min' ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['glitch', 'invert', 'negative', 'strobe', 'flash', variant.toLowerCase()],
      useWhen:
        variant === 'Max'
          ? 'Hard cut on a big beat; longest, most aggressive invert strobe (0.44s).'
          : variant === 'Min'
            ? 'Blink-fast invert accent between related shots (0.12s).'
            : `Punchy short invert strobe (${dur}s).`,
    },
  });
  console.log(`  ${id}: dur=${dur}s steps=${nSteps} flashes=${flashes} swapAt=${swapAt}`);
}

const keep = lib.transitions.filter((r) => !/^invert-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} invert rows into library.json (total ${lib.transitions.length} rows)`);
