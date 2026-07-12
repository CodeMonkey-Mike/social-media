#!/usr/bin/env node
/** _lightleaksrest-clips.json (+ _lightleaks-nested-clips.json for the Short
 * subgroup's Pre stacks) -> 26 LIGHT LEAKS rows: Light Leaks Short 8, Soft 9,
 * Soft Short 9. Engine LightLeaks (v2, map-matted envelope).
 *
 * Subgroup shapes (decoded 2026-07-12):
 *  - Short: the Light Leaks recipe compressed to 0.4s (cut 0.16). SAME nested
 *    "Pre Light Leaks N" plate stacks windowed 0..0.36; Blur reads slot 2(n-1)
 *    from a PER-VARIANT offset 0.12-0.2 INTO the slot (envelope timing shifts
 *    slightly per variant — real data). Deviation = rack slot 151.2 (same flat
 *    Color Matte, visually nil, unrendered).
 *  - Soft (1.44s, cut 0.32) / Soft Short (0.4s, cut 0.16): NO Deviation, NO
 *    nested stack — TWO "_Simple Light Leaks" files, a DIFFERENT one each side
 *    of the cut ((Out) plays from media 0.04s), over a Blur Map VH matte
 *    (slots 16+2(n-1)). Same ambiguous (22,0) blend -> Screen (preview-proven).
 * Hard-fails on every unexpected value. Merges into library.json.
 */
const fs = require('fs');
const path = require('path');
const main = require('./_lightleaksrest-clips.json');
const nested = require('./_lightleaks-nested-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const die = (msg) => { throw new Error('LIGHT LEAKS REST BUILD FAIL: ' + msg); };
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});
function decodeColor(v) {
  const n = BigInt(v);
  const a = Number((n >> 48n) & 0xffffn) / 0xff00;
  const r = Number((n >> 32n) & 0xffffn) / 0xff00;
  const g = Number((n >> 16n) & 0xffffn) / 0xff00;
  const b = Number(n & 0xffffn) / 0xff00;
  if (a < 0.99 || a > 1.01) die('color alpha != 1: 0x' + n.toString(16));
  return [r4(r), r4(g), r4(b)];
}
const kfsOf = (clip, mn, pn, seqName) => {
  const e = clip.effects.find((x) => x.matchName === mn);
  const p = e && e.params.find((x) => x.name === pn);
  if (!p || !p.keyframes) die(`${seqName}: missing ${mn}/${pn}`);
  const ip = clip.inPoint || 0;
  return p.keyframes.map((k) => ({ t: r4(k.t - ip), v: num(k.v), ...handles(k) }));
};

function buildRow(seq) {
  const m = seq.name.match(/^Light Leaks (Short|Soft|Soft Short) - (\d)$/);
  if (!m) die(`unrecognized ${seq.name}`);
  const sub = m[1], n = +m[2];
  const content = seq.clips.find((c) => c.track === 0);
  const durationSeconds = r4(content.end);
  const isShortLen = sub !== 'Soft'; // Short + Soft Short are 0.4s
  if (durationSeconds !== (isShortLen ? 0.4 : 1.44)) die(`${seq.name}: dur ${durationSeconds}`);
  const cutTime = isShortLen ? 0.16 : 0.32;

  let blurClip, mapDir, mapFrames, slot, layers, sfx, devSlot = null;
  if (sub === 'Short') {
    // same architecture as Light Leaks, compressed
    const dev = seq.clips.find((c) => c.subClipName === 'Deviation');
    if (!dev || dev.inPoint !== 151.2) die(`${seq.name}: Deviation slot ${dev && dev.inPoint}`);
    devSlot = dev.inPoint;
    const blurIn = seq.clips.find((c) => c.subClipName === 'Blur (In)');
    const blurOut = seq.clips.find((c) => c.subClipName === 'Blur (Out)');
    if (!blurIn || !blurOut) die(`${seq.name}: missing Blur pair`);
    if (blurOut.start !== cutTime) die(`${seq.name}: cut at ${blurOut.start}`);
    // continuity: the (Out) window continues the same media mapping
    if (r4(blurOut.inPoint - blurIn.inPoint) !== r4(blurOut.start - blurIn.start))
      die(`${seq.name}: Blur (Out) not continuous`);
    blurClip = blurIn;
    slot = 2 * (n - 1);
    mapDir = `bm${n}`; mapFrames = 30;
    // nested Pre stack, windowed to the leak clip's real window
    const leak = seq.clips.find((c) => /\(Open it to change colors\)$/.test(c.subClipName || ''));
    if (!leak || leak.start !== 0 || leak.end !== 0.36 || leak.inPoint !== 0) die(`${seq.name}: leak window`);
    const pre = nested.find((s) => s.name === `Pre Light Leaks ${n}`);
    if (!pre) die(`${seq.name}: Pre stack missing`);
    // the Short nest plays its ~1s Pre stack at a CONSTANT SPEED-UP: clip rate =
    // media span / window = 0.972/0.36 = 2.7x (found when Short-3's leak ran
    // ~0.15s late in the sweep — In/Out points imply rate even without a remap)
    const nestRate = r4(((leak.outPoint ?? 0) - (leak.inPoint ?? 0)) / (leak.end - leak.start));
    if (Math.abs(nestRate - 2.7) > 0.01) die(`${seq.name}: nest rate ${nestRate}`);
    layers = pre.clips.map((c) => {
      const file = c.mediaPath && c.mediaPath.split(/[\\/]/).pop();
      const mm = file && file.match(/^Hst - Flr Light Leaks - (\d+[ab]?)\.mp4$/);
      if (!mm) die(`${seq.name}: layer media ${file}`);
      const layer = { src: `transitions/lib/leaks/lightleaks-${mm[1]}.mp4`, win: [0, 0.36], mediaStart: 0, rate: nestRate };
      const ctc = c.effects.find((e) => e.matchName === 'AE.ADBE Change To Color');
      if (ctc) layer.to = decodeColor(ctc.params.find((p) => p.name === 'To').value);
      return layer;
    });
    sfx = 'transitions/lib/sfx-lightleaks-40.mp3';
  } else {
    // Soft / Soft Short: single Blur clip + two plain leak files split at the cut
    blurClip = seq.clips.find((c) => c.subClipName === 'Blur');
    if (!blurClip) die(`${seq.name}: missing Blur`);
    slot = 16 + 2 * (n - 1);
    mapDir = `bmvh${n}`; mapFrames = 44;
    const leakIn = seq.clips.find((c) => /\(In\)$/.test(c.subClipName || ''));
    const leakOut = seq.clips.find((c) => /\(Out\)$/.test(c.subClipName || ''));
    if (!leakIn || !leakOut) die(`${seq.name}: missing leak pair`);
    if (leakOut.start !== cutTime) die(`${seq.name}: leak cut ${leakOut.start}`);
    if ((leakIn.inPoint || 0) !== 0 || leakOut.inPoint !== 0.04) die(`${seq.name}: leak in-points`);
    const fileOf = (c, rev) => {
      const mm = (c.masterClipName || '').match(/^_Simple Light Leaks (\d)$/);
      if (!mm) die(`${seq.name}: leak master ${c.masterClipName}`);
      const base = `lightleaks-soft-${mm[1]}${rev ? '-rev' : ''}.mp4`;
      if (!fs.existsSync(path.join(__dirname, 'lib', 'leaks', base))) die(`${seq.name}: missing ${base}`);
      return `transitions/lib/leaks/${base}`;
    };
    for (const c of [leakIn, leakOut]) for (const e of c.effects) {
      if (!['AE.ADBE Opacity', 'AE.ADBE Motion', 'AE.ADBE AECrop'].includes(e.matchName))
        die(`${seq.name}: unexpected leak effect ${e.matchName}`);
    }
    // TIME REMAPS (decoded 2026-07-12, uniform across all 18 Soft/Soft Short):
    //  (In):  media 1.16 -> 0 over clip 0..0.36 = REVERSED at 1.16/0.36x — the
    //         leak plays BACKWARD, cresting into the cut. Implemented as the
    //         pre-reversed asset played forward at the same rate (exact for the
    //         linear remap; OffthreadVideo cannot reverse).
    //  (Out): clip 0.04 -> media 0, clip 1.16 -> media 1.16 = the in-point is
    //         CANCELLED (media starts at 0 at the window start), rate 1.16/1.12.
    const tr = (c) => c.timeRemap || die(`${seq.name}: ${c.subClipName} missing time remap`);
    const inR = tr(leakIn), outR = tr(leakOut);
    if (inR[0].v !== 1.16 || inR[1].v !== 0 || r4(inR[1].t) !== 0.36) die(`${seq.name}: (In) remap ${JSON.stringify(inR)}`);
    if (r4(outR[0].t) !== 0.04 || outR[0].v !== 0 || outR[1].v !== 1.16) die(`${seq.name}: (Out) remap ${JSON.stringify(outR)}`);
    // effective rate = remap slope x CLIP RATE ((out-in)/window — Soft Short
    // squeezes the remapped clip 2x/5.6x on top of the remap; Soft is 1x)
    const clipRate = (c) => r4(((c.outPoint ?? 0) - (c.inPoint ?? 0)) / (c.end - c.start));
    const inRate = r4((1.16 / 0.36) * clipRate(leakIn));
    const outRate = r4((1.16 / (outR[1].t - outR[0].t)) * clipRate(leakOut));
    layers = [
      { src: fileOf(leakIn, true), win: [0, leakIn.end], mediaStart: 0, rate: inRate },
      { src: fileOf(leakOut, false), win: [leakOut.start, leakOut.end], mediaStart: 0, rate: outRate },
    ];
    sfx = sub === 'Soft' ? 'transitions/lib/sfx-lightleaks-soft.mp3' : 'transitions/lib/sfx-lightleaks-40.mp3';
  }

  const mapOffset = r4(blurClip.inPoint - slot);
  if (mapOffset < 0 || mapOffset > 0.5) die(`${seq.name}: map offset ${mapOffset} (slot ${slot}, in ${blurClip.inPoint})`);
  const blur = kfsOf(blurClip, 'AE.ADBE Gaussian Blur 2', 'Blurriness', seq.name);
  const brightness = kfsOf(blurClip, 'AE.ADBE ProcAmp', 'Brightness', seq.name);
  const contrast = kfsOf(blurClip, 'AE.ADBE ProcAmp', 'Contrast', seq.name);
  if (blur[1].v !== 35 || brightness[1].v !== 25 || contrast[1].v !== 200) die(`${seq.name}: envelope shape`);

  const aud = (seq.audio || [])[0];
  const expAudEnd = sub === 'Soft' ? 1.36 : 0.4;
  if (!aud || !/Simple_SFX/.test(aud.masterClipName || '') || aud.start !== 0 || (aud.inPoint || 0) !== 0 || r4(aud.end) !== expAudEnd)
    die(`${seq.name}: audio ${JSON.stringify(aud)}`);

  const cut = r4(cutTime / durationSeconds);
  const subSlug = sub.toLowerCase().replace(/ /g, '-');
  const isSoft = /Soft/.test(sub);
  const character = sub === 'Short'
    ? 'snappy film-leak flash: a fast blur/blowout pulse with real flares'
    : sub === 'Soft'
      ? 'gentle sweeping leak: a soft gradient wipe of blur and glow drifts across while two real leak plates hand over at the cut'
      : 'quick soft leak sweep: the gradient blur wipe and leak handover compressed to a blink';

  return {
    id: `lightleaks-${subSlug}-${n}`,
    category: 'LIGHT LEAKS',
    variant: sub === 'Short' ? 'Light Leaks Short' : sub,
    intensity: String(n),
    label: `Light Leaks · ${sub} · ${n}`,
    engine: 'LightLeaks',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds,
    params: {
      cut,
      map: { dir: `transitions/lib/leaks/maps/${mapDir}`, frames: mapFrames, offset: mapOffset },
      layers, blur, brightness, contrast,
    },
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Light Leaks ${sub}`,
      engineFile: 'remotion/src/transitions/engines/LightLeaks.tsx',
      description: `Organic ${character}; settles clean. Real pack plates + animated blur-map matte.`,
      energy: isShortLen ? 'high' : 'low',
      durationSeconds,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['light-leak', 'flare', 'film', 'organic', subSlug, ...(isSoft ? ['soft', 'wipe'] : ['flash'])],
      useWhen: `${sub === 'Soft' ? 'Slow, emotional scene change' : 'Quick organic accent cut'} (~${durationSeconds}s); ${character}.`,
    },
  };
}

const rows = main.map(buildRow);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const ids = new Set(rows.map((r) => r.id));
lib.transitions = lib.transitions.filter((r) => !ids.has(r.id));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} rows; library now ${lib.transitions.length}`);
for (const r of rows.filter((x) => x.intensity === '1' || x.intensity === '9')) {
  console.log(' ', r.id, 'cut=' + r.params.cut, 'map=' + r.params.map.dir.split('/').pop() + '+' + r.params.map.offset,
    '|', r.params.layers.map((l) => l.src.split('-').slice(-1)[0].replace('.mp4', '') + `[${l.win}]@${l.mediaStart}`).join(' '));
}
