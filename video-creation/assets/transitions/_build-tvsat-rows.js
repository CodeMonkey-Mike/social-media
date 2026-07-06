#!/usr/bin/env node
/** Build the 9 TV Satellite rows from _tvsat-clips.json and MERGE into
 * library.json (replaces tvsat-* rows only).
 *
 * Mechanism (per-clip extraction, 2026-07-05) — a composite of three
 * already-verified mechanisms:
 *  - t1 (full length): Texture Adjustment rack window at the variant's
 *    "Tint Mask <V> <n>" slot (1s slots at 133/135/../149) — per the Roughly
 *    numeric verification this is a SCREEN-FIXED luma matte revealing EFFECTED
 *    content: Tint black->black/white->WHITE @100 = GRAYSCALE (Invert-family
 *    decode) applied FIRST (bottom-up), then Turbulent Displace Amount 635 /
 *    Size 11.9 / Complexity 2 / Horizontal / Evolution 0->360 over the window /
 *    seed 0 — an extreme horizontal shred = the satellite-static look.
 *    (Short-2's in-point starts 0.08s before its slot, in the empty rack gap ->
 *    no matte for those frames; engine clamps.)
 *  - t2 (full length): HST "Offset" adjustment — keyframed full-frame wrap
 *    Offset roll (25fps x/y curve), applies to content + t1 window (both roll).
 *  - t3: the REAL "TV Satellite <V> <n>.mp4" plate PIN-LIGHTED on top (Blend
 *    Mode 8+17 pair, Monitor-verified darken/lighten implementation), split at
 *    the A->B cut with a MEDIA JUMP: segment 1 plays media 0->cut, segment 2
 *    plays media from 0.32 (all variants).
 *  - SFX TV_Satellite_{Max,Min,Short}.mp3, in-points 0 / 0.16 / 0.16 (trimmed).
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_tvsat-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const maskFrames = (dir) =>
  fs.readdirSync(path.join(__dirname, 'lib/masks', dir)).filter((f) => /^m_\d+\.png$/.test(f)).length;
const plateFrames = (dir) =>
  fs.readdirSync(path.join(__dirname, 'lib/plates', dir)).filter((f) => /^p_\d+\.png$/.test(f)).length;

// Tint Mask rack slots (verified via _texadj-clips.json): Max1 133 .. Short3 149.
const SLOTS = {
  'max-1': 133, 'max-2': 135, 'max-3': 137,
  'min-1': 139, 'min-2': 141, 'min-3': 143,
  'short-1': 145, 'short-2': 147, 'short-3': 149,
};

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const m = seq.name.match(/Glitch TV Satellite (Max|Min|Short) - (\d)/);
  const v = m[1].toLowerCase();
  const n = +m[2];
  const id = `tvsat-${v}-${n}`;
  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  // t1: tint-mask window (turbulence + grayscale through the rack matte)
  const t1 = seq.clips.find((c) => c.effects.some((e) => /ADBE Turbulent Displace/.test(e.matchName)));
  const td = t1.effects.find((e) => /ADBE Turbulent Displace/.test(e.matchName)).params;
  const pv = (nm) => +td.find((p) => p.name === nm).value;
  const evoKf = td.find((p) => p.name === 'Evolution').keyframes.map((kf) => ({ t: +(kf.t - t1.inPoint).toFixed(4), v: +kf.v }));
  const slot = SLOTS[`${v}-${n}`];
  if (Math.abs(t1.inPoint - slot) > 0.1) throw new Error(`${id}: t1 inPoint ${t1.inPoint} far from slot ${slot}`);

  // t2: full-frame wrap offset roll
  const t2 = seq.clips.find((c) => c.subClipName === 'Offset');
  const offKfs = t2.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To').keyframes;
  const roll = offKfs.map((kf) => {
    const [x, y] = kf.v.split(':').map(Number);
    return { t: +(kf.t - (t2.inPoint || 0)).toFixed(4), dx: +(x - 0.5).toFixed(5), dy: +(y - 0.5).toFixed(5) };
  });

  // t3: pin-light plate pair split at the cut, with the media jump
  const t3s = seq.clips
    .filter((c) => /^TV Satellite/.test(c.masterClipName || ''))
    .sort((a, b) => a.start - b.start);
  if (t3s.length !== 2) throw new Error(`${id}: expected 2 plate clips, got ${t3s.length}`);
  const cut = t3s[1].start;
  const blend = t3s[0].effects.find((e) => /ADBE Opacity/.test(e.matchName)).params.filter((p) => p.name === 'Blend Mode').map((p) => +p.value);
  if (!blend.includes(17)) throw new Error(`${id}: plate blend is not Pin Light (${blend})`);

  const maskDir = `tvsat-${v}-${n}`;
  rows.push({
    id,
    category: 'GLITCH',
    variant: 'TV Satellite',
    intensity: `${m[1]} ${n}`,
    label: `Glitch · TV Satellite · ${m[1]} ${n}`,
    engine: 'GlitchTVSatellite',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      cut,
      window: {
        t0: t1.start,
        t1: t1.end,
        maskDir: `transitions/lib/masks/${maskDir}`,
        maskFrames: maskFrames(maskDir),
        maskStart: +(t1.inPoint - slot).toFixed(4),
        turb: { amount: pv('Amount'), size: pv('Size'), complexity: Math.round(pv('Complexity')), seed: pv('Random Seed'), evolution: evoKf },
      },
      roll,
      plate: {
        dir: `transitions/lib/plates/${maskDir}`,
        frames: plateFrames(maskDir),
        seg1In: t3s[0].inPoint || 0,
        seg2In: t3s[1].inPoint,
      },
    },
    sfx: `transitions/lib/sfx-tvsat-${v}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchTVSatellite.tsx',
      description:
        'Lost-satellite-feed glitch: ragged mask regions fill with grayscale static-shred of the footage while the whole frame rolls on a keyframed offset path and a real noise/scanline plate pin-lights over everything, then the signal locks back in. Max ~1s, Short ~0.5s, Min ~0.3s.',
      energy: v === 'min' ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['glitch', 'tv', 'satellite', 'static', 'signal-loss', 'analog'],
      useWhen:
        `TV-signal-loss cut (~${dur}s): grayscale shredded static in torn bands + frame roll + real noise plate. Approximate: the shred is AE Turbulent Displace, reproduced procedurally (real amount/size/evolution).`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^tvsat-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} tvsat rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows)
  console.log(`  ${r.id}: dur=${r.durationSeconds}s cut=${r.params.cut} rollKf=${r.params.roll.length} maskStart=${r.params.window.maskStart}`);
