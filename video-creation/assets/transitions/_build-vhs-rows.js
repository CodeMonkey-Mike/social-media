#!/usr/bin/env node
/** Build the 9 VHS rows from _vhs-clips.json and MERGE into library.json
 * (replaces vhs-* rows only).
 *
 * Mechanism (per-clip extraction, 2026-07-05) — 4 adjustment layers + 1 plate,
 * the most stacked family; every piece maps to verified machinery:
 *  - t1 (full window): full-frame adjustment, components bottom-up
 *    Tint -> Unsharp Mask -> Turbulent Displace -> Solid Composite(black):
 *    Tint black->RGB(31,31,31) white->WHITE with KEYFRAMED amount (washed VHS
 *    lift); Unsharp Amount keyframed 0->500->0, Radius 4 (edge ringing);
 *    Turbulent Displace Amount keyframed 0->50->0, Size 100, Horizontal, with
 *    the noise field SCROLLED by keyframed "Offset (Turbulence)" (real scroll
 *    data — the same mechanism our engines emulate for Evolution). Solid
 *    Composite = black backing for unpinned edges (engine's wrap padding
 *    stands in; documented approximation).
 *  - t2 (window): Fast Blur 30 + Emboss 90/15/70 + the verified green/black
 *    HST Tint, bottom-up tint->emboss->blur; Blend Mode pair KEYFRAMED
 *    (18,0)->(8,17) at media t=0.36: NORMAL takeover first, switching to PIN
 *    LIGHT — the switch time only falls inside Max's window (Min/Short stay
 *    Normal for their whole window).
 *  - t3 (full window): keyframed 25fps full-frame wrap Offset roll (over
 *    content + t1 + t2).
 *  - t4: REAL `Gth - TV VHS <V> - <n>.mp4` plate PIN-LIGHTED on top (8+17),
 *    window starts at 0.04, media CONTINUOUS across the editorial split at the
 *    cut (Max 0.4 / Min 0.16 / Short 0.2).
 *  - SFX TV_VHS_{Max,Min,Short}.mp3 with real project timing: Max delayed
 *    0.08s (in 0), Min in-point 0.24 delayed 0.04s, Short in-point 0.16
 *    (baked into the trimmed lib copies).
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_vhs-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const plateFrames = (dir) =>
  fs.readdirSync(path.join(__dirname, 'lib/plates', dir)).filter((f) => /^p_\d+\.png$/.test(f)).length;

const kfCurve = (params, name, inPoint) => {
  const p = params.find((q) => q.name === name);
  if (!p || !p.keyframes) return null;
  return p.keyframes.map((kf) => ({ t: +(kf.t - (inPoint || 0)).toFixed(4), v: +kf.v.split(':')[0] }));
};

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const m = seq.name.match(/Glitch VHS (Max|Min|Short) - (\d)/);
  const v = m[1].toLowerCase();
  const n = +m[2];
  const id = `vhs-${v}-${n}`;
  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  // t1: tint/unsharp/turbulence adjustment
  const t1 = seq.clips.find((c) => c.effects.some((e) => /Solid Composite/.test(e.matchName)));
  const td = t1.effects.find((e) => /ADBE Turbulent Displace/.test(e.matchName)).params;
  const tintP = t1.effects.find((e) => /ADBE Tint/.test(e.matchName)).params;
  const usP = t1.effects.find((e) => /ADBE Unsharp Mask/.test(e.matchName)).params;
  const pv = (ps, nm) => +ps.find((p) => p.name === nm).value;
  const offTurb = td.find((p) => p.name === 'Offset (Turbulence)');
  const scrollKf = (offTurb.keyframes || []).map((kf) => {
    const [x, y] = kf.v.split(':').map(Number);
    return { t: +(kf.t - (t1.inPoint || 0)).toFixed(4), dx: +(x - 0.5).toFixed(5), dy: +(y - 0.5).toFixed(5) };
  });

  // t2: blur+emboss+green-tint window with the keyframed blend switch
  const t2 = seq.clips.find((c) => c.effects.some((e) => /ADBE Fast Blur/.test(e.matchName)));
  const embP = t2.effects.find((e) => /ADBE Emboss/.test(e.matchName)).params;
  // (18,0)->(8,17) keyframe at t=0.36 — TIMELINE-absolute (preview-verified: the
  // takeover ends by ~0.4; a media-time reading would put it at 0.48).
  const pinFrom = 0.36;

  // t3: roll
  const t3 = seq.clips.find((c) => c.subClipName === 'Offset');
  const rollKfs = t3.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To').keyframes;
  const roll = rollKfs.map((kf) => {
    const [x, y] = kf.v.split(':').map(Number);
    return { t: +(kf.t - (t3.inPoint || 0) + t3.start).toFixed(4), dx: +(x - 0.5).toFixed(5), dy: +(y - 0.5).toFixed(5) };
  });

  // t4: plate pair, continuous media
  const t4s = seq.clips.filter((c) => /^Gth - TV VHS/.test(c.masterClipName || '')).sort((a, b) => a.start - b.start);
  if (t4s.length !== 2) throw new Error(`${id}: expected 2 plate clips`);
  const cut = t4s[1].start;
  const cont = Math.abs((t4s[1].inPoint || 0) - ((t4s[0].inPoint || 0) + (t4s[1].start - t4s[0].start))) < 1e-3;
  if (!cont) throw new Error(`${id}: plate media not continuous`);

  const plateDir = `vhs-${v}-${n}`;
  rows.push({
    id,
    category: 'GLITCH',
    variant: 'VHS',
    intensity: `${m[1]} ${n}`,
    label: `Glitch · VHS · ${m[1]} ${n}`,
    engine: 'GlitchVHS',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      cut,
      adjust: {
        t0: t1.start,
        t1: t1.end,
        tintAmount: kfCurve(tintP, 'Amount to Tint', t1.inPoint).map((k) => ({ t: +(k.t + t1.start).toFixed(4), v: k.v })),
        tintBlack: [31 / 255, 31 / 255, 31 / 255],
        unsharpAmount: kfCurve(usP, 'Amount', t1.inPoint).map((k) => ({ t: +(k.t + t1.start).toFixed(4), v: k.v })),
        unsharpRadius: pv(usP, 'Radius'),
        turbAmount: kfCurve(td, 'Amount', t1.inPoint).map((k) => ({ t: +(k.t + t1.start).toFixed(4), v: k.v })),
        turbSize: pv(td, 'Size'),
        turbSeed: pv(td, 'Random Seed'),
        scroll: scrollKf.map((k) => ({ ...k, t: +(k.t + t1.start).toFixed(4) })),
      },
      hst: {
        t0: t2.start,
        t1: t2.end,
        pinFrom,
        blurPx: pv(t2.effects.find((e) => /ADBE Fast Blur/.test(e.matchName)).params, 'Blurriness'),
        emboss: { reliefPx: pv(embP, 'Relief'), contrast: +(pv(embP, 'Contrast') / 100).toFixed(2) },
      },
      roll,
      plate: { dir: `transitions/lib/plates/${plateDir}`, frames: plateFrames(plateDir), t0: t4s[0].start, in0: t4s[0].inPoint || 0 },
    },
    sfx: `transitions/lib/sfx-vhs-${v}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchVHS.tsx',
      description:
        'Worn-tape VHS glitch: the frame washes out and rings with oversharpened edges while soft noise waves bend it, a blurred green-embossed takeover slams in around the cut, everything rolls vertically, and a real tape-noise plate pin-lights scanline grit on top. Max ~1.1s, Short ~0.6s, Min ~0.5s.',
      energy: v === 'min' ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['glitch', 'vhs', 'tape', 'analog', 'retro', 'scanlines'],
      useWhen:
        `Retro tape-damage cut (~${dur}s); reads as a VHS tracking error. Approximate: the noise-wave warp is AE Turbulent Displace reproduced procedurally (real keyframes incl. the field scroll); the rest is real plates + real keyframes.`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^vhs-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} vhs rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows)
  console.log(`  ${r.id}: dur=${r.durationSeconds}s cut=${r.params.cut} hst=${r.params.hst.t0}-${r.params.hst.t1} pinFrom=${r.params.hst.pinFrom} rollKf=${r.params.roll.length}`);
