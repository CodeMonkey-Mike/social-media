#!/usr/bin/env node
/** Build the 10 Turbulent Displace rows from _turbdisp-clips.json and MERGE them
 * into library.json (replaces turbulent-* rows only).
 *
 * Mechanism (per-clip extraction, 2026-07-05): NO plates — the whole family is
 * one HST Adjustment clip carrying AE Turbulent Displace (t2, full length) under
 * a split HST emboss+tint pin-light pair (t1, split AT the A->B cut):
 *  - Turbulent Displace: Displacement enum 9 = Horizontal / 8 = Vertical
 *    (1-based counting the popup separator, same convention as the Invert
 *    channel enum), Amount keyframed 0 -> 110..300 -> 0 peaking AT the cut,
 *    Size 10..80 by density, Complexity 5.1, Evolution keyframed 0 -> 1080deg,
 *    per-variant Random Seed, Pinning 0. The fractal noise field itself is
 *    procedural and NOT extractable -> engine reproduces it with feTurbulence
 *    driven by these real params; fidelity = approximate (Wave Warp precedent).
 *  - t1 window: same recipe as Glitch Offset/Monitor's verified HST — Tint
 *    black->GREEN white->BLACK + Emboss (dir 90 horizontal variants / 0
 *    vertical, relief 5..20, contrast 70) + Pin Light (Blend Mode 8+17 pair).
 *    Component order bottom-up: Tint first. t2 sits ABOVE t1, so the fringe
 *    applies to the content FIRST and the turbulence displaces the fringed
 *    frame (same ordering as Glitch Offset).
 *  - SFX: Displacement_Turbulent.mp3, per-variant in-point (trimmed copies).
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_turbdisp-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const m = seq.name.match(/Turbulent Displace (Horizontal|Vertical) - (\d)x/);
  const axis = m[1] === 'Horizontal' ? 'x' : 'y';
  const n = +m[2];
  const id = `turbulent-${axis === 'x' ? 'h' : 'v'}-${n}x`;
  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  const t2 = seq.clips.find((c) => c.effects.some((e) => /ADBE Turbulent Displace/.test(e.matchName)));
  const td = t2.effects.find((e) => /ADBE Turbulent Displace/.test(e.matchName)).params;
  const pv = (nm) => td.find((p) => p.name === nm);
  const curve = (nm) => pv(nm).keyframes.map((kf) => ({ t: kf.t, v: +kf.v }));

  const disp = +pv('Displacement').value;
  if ((axis === 'x' && disp !== 9) || (axis === 'y' && disp !== 8))
    throw new Error(`${id}: Displacement enum ${disp} does not match axis ${axis}`);

  const t1s = seq.clips.filter((c) => c.track === 1).sort((a, b) => a.start - b.start);
  if (t1s.length !== 2) throw new Error(`${id}: expected 2 HST clips, got ${t1s.length}`);
  const cut = t1s[1].start;
  const emb = t1s[0].effects.find((e) => /ADBE Emboss/.test(e.matchName)).params;
  const ev = (nm) => +emb.find((p) => p.name === nm).value;

  const amount = curve('Amount');
  const peak = Math.max(...amount.map((k) => k.v));

  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Turbulent Displace',
    intensity: `${m[1]} ${n}x`,
    label: `Glitch · Turbulent Displace · ${m[1]} ${n}x`,
    engine: 'GlitchTurbulentDisplace',
    kind: 'shader',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      cut,
      axis,
      size: +pv('Size').value,
      complexity: Math.round(+pv('Complexity').value),
      seed: +pv('Random Seed').value,
      amount,
      evolution: curve('Evolution'),
      hst: { t0: t1s[0].start, t1: t1s[1].end },
      emboss: { reliefPx: ev('Relief'), contrast: +(ev('Contrast') / 100).toFixed(2), dir: ev('Direction') },
    },
    sfx: `transitions/lib/sfx-turbulent-${axis === 'x' ? 'h' : 'v'}-${n}x.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchTurbulentDisplace.tsx',
      description:
        `Heat-haze signal warp: fractal-noise ${m[1].toLowerCase()} displacement churns the frame (peak ${peak}px at the cut) with green/magenta emboss fringes biting during the hot zone, then it settles clean. Density 1x (fine jitter) to 5x (big molten waves).`,
      energy: n <= 2 ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['glitch', 'turbulent', 'displace', 'warp', 'noise', axis === 'x' ? 'horizontal' : 'vertical'],
      useWhen:
        `Analog-signal warp cut (~${dur}s); ${m[1].toLowerCase()} smear reads like heat haze / molten video. Approximate: the AE fractal noise field is procedural, reproduced with feTurbulence from the real params (amount/size/evolution/seed).`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^turbulent-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} turbulent rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows)
  console.log(`  ${r.id}: dur=${r.durationSeconds}s cut=${r.params.cut} size=${r.params.size} peak=${Math.max(...r.params.amount.map(k=>k.v))} relief=${r.params.emboss.reliefPx}`);
