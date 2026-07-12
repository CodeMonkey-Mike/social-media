#!/usr/bin/env node
/** _lightleaks-clips.json + _lightleaks-nested-clips.json -> 8 LIGHT LEAKS rows,
 * engine LightLeaks.
 *
 * Mechanism (decoded 2026-07-12): content under a shared Gaussian-blur (0->35->0
 * peak at the 0.32 cut) + ProcAmp flash (brightness 0->25->0, contrast
 * 100->200->100), with the pack's REAL leak plates (1-3 per variant, nested
 * "Pre Light Leaks N" sequences) screen-composited ABOVE the blurred content.
 * "Change color here" layers carry Change To Color -> ARGB16-decoded targets.
 * The "Deviation" clip (Texture Adjustment rack slot 151 = flat Color Matte +
 * Emboss + green Tint) is verified VISUALLY NIL (preview window-edge A/B) and
 * ships documented but unrendered.
 *
 * Hard-fails on: unexpected duration/cut/windows/audio, missing plate files,
 * blur/procamp curves deviating from the canonical shape, unknown effects on
 * leak layers. Merges into library.json.
 */
const fs = require('fs');
const path = require('path');
const main = require('./_lightleaks-clips.json');
const nested = require('./_lightleaks-nested-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const die = (msg) => { throw new Error('LIGHT LEAKS BUILD FAIL: ' + msg); };
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

/** ARGB16 color value (e.g. 0xff0000002400ff00 = #0024FF) -> [r,g,b] 0..1. */
function decodeColor(v) {
  const n = BigInt(v);
  const a = Number((n >> 48n) & 0xffffn) / 0xff00;
  const r = Number((n >> 32n) & 0xffffn) / 0xff00;
  const g = Number((n >> 16n) & 0xffffn) / 0xff00;
  const b = Number(n & 0xffffn) / 0xff00;
  if (a < 0.99 || a > 1.01) die('color alpha != 1: 0x' + n.toString(16));
  return [r4(r), r4(g), r4(b)];
}

function buildRow(seq, i) {
  const n = i + 1;
  if (seq.name !== `Light Leaks - ${n}`) die(`order mismatch: ${seq.name} at ${i}`);
  const content = seq.clips.find((c) => c.track === 0);
  const dev = seq.clips.find((c) => c.subClipName === 'Deviation');
  const blurIn = seq.clips.find((c) => c.subClipName === 'Blur (In)');
  const blurOut = seq.clips.find((c) => c.subClipName === 'Blur (Out)');
  const leak = seq.clips.find((c) => /^Light Leaks \d+ \(Open it to change colors\)$/.test(c.subClipName || ''));
  if (!content || !blurIn || !blurOut || !leak) die(`${seq.name}: missing clips`);
  if (!dev || dev.inPoint !== 151) die(`${seq.name}: Deviation rack slot != 151`);

  const durationSeconds = r4(content.end);
  if (durationSeconds !== 1.12) die(`${seq.name}: duration ${durationSeconds}`);
  const cut = r4(blurOut.start / durationSeconds);
  if (blurOut.start !== 0.32) die(`${seq.name}: cut at ${blurOut.start}`);
  if (leak.start !== 0 || leak.end !== 1 || leak.inPoint !== 0) die(`${seq.name}: leak window ${leak.start}..${leak.end} in=${leak.inPoint}`);

  // shared envelope: read from Blur (In) (media-relative; identical across
  // variants — each variant's clips read a 2s slot: t_rel = kf.t - inPoint)
  const kfsOf = (clip, mn, pn) => {
    const e = clip.effects.find((x) => x.matchName === mn);
    const p = e && e.params.find((x) => x.name === pn);
    if (!p || !p.keyframes) die(`${seq.name}: missing ${mn}/${pn}`);
    const ip = clip.inPoint || 0;
    return p.keyframes.map((k) => ({ t: r4(k.t - ip), v: num(k.v), ...handles(k) }));
  };
  // v2: the Blur clips are Texture Adjustment RACK windows — slot 2(n-1) holds
  // 'Blur Map n' (self-luma-matted animated gradient) gating the envelope.
  const slot = 2 * (n - 1);
  const mapOffset = r4(blurIn.inPoint - slot);
  if (mapOffset < 0 || mapOffset > 0.5) die(`${seq.name}: map offset ${mapOffset}`);
  const blur = kfsOf(blurIn, 'AE.ADBE Gaussian Blur 2', 'Blurriness');
  const brightness = kfsOf(blurIn, 'AE.ADBE ProcAmp', 'Brightness');
  const contrast = kfsOf(blurIn, 'AE.ADBE ProcAmp', 'Contrast');
  // canonical-shape asserts (variant 7's last blur kf sits at 0.9938 — fine)
  if (blur[0].v !== 0 || blur[1].v !== 35 || Math.abs(blur[1].t - 0.32) > 1e-6) die(`${seq.name}: blur shape ${JSON.stringify(blur)}`);
  if (brightness[1].v !== 25 || contrast[1].v !== 200) die(`${seq.name}: procamp shape`);
  // the (Out) clip must carry the SAME curves (continuous across the cut)
  const blurOutKfs = kfsOf(blurOut, 'AE.ADBE Gaussian Blur 2', 'Blurriness');
  if (JSON.stringify(blurOutKfs.map((k) => [r4(k.t + (blurOut.inPoint - blurIn.inPoint)), k.v])) !==
      JSON.stringify(blur.map((k) => [k.t, k.v]))) die(`${seq.name}: (Out) blur curve differs`);

  // leak layers from the nested "Pre Light Leaks N" sequence
  const pre = nested.find((s) => s.name === `Pre Light Leaks ${n}`);
  if (!pre || !pre.clips || !pre.clips.length) die(`${seq.name}: nested seq missing`);
  const layers = pre.clips.map((c) => {
    const file = c.mediaPath && c.mediaPath.split(/[\\/]/).pop();
    const m = file && file.match(/^Hst - Flr Light Leaks - (\d+[ab]?)\.mp4$/);
    if (!m) die(`${seq.name}: layer media ${file}`);
    const local = path.join(__dirname, 'lib', 'leaks', `lightleaks-${m[1]}.mp4`);
    if (!fs.existsSync(local)) die(`${seq.name}: missing lib plate ${local}`);
    for (const e of c.effects) {
      if (!['AE.ADBE Opacity', 'AE.ADBE Motion', 'AE.ADBE Change To Color'].includes(e.matchName))
        die(`${seq.name}: unexpected layer effect ${e.matchName}`);
    }
    const ctc = c.effects.find((e) => e.matchName === 'AE.ADBE Change To Color');
    const layer = { src: `transitions/lib/leaks/lightleaks-${m[1]}.mp4`, win: [0, 1], mediaStart: 0 };
    if (ctc) {
      const toP = ctc.params.find((p) => p.name === 'To');
      layer.to = decodeColor(toP.value);
    }
    if (c.start !== 0 || c.end !== 1 || (c.inPoint || 0) !== 0) die(`${seq.name}: layer window`);
    return layer;
  });

  const aud = (seq.audio || [])[0];
  if (!aud || !/Simple_SFX/.test(aud.masterClipName || '') || aud.start !== 0 || (aud.inPoint || 0) !== 0)
    die(`${seq.name}: audio ${JSON.stringify(aud)}`);

  const colorWords = layers.filter((l) => l.to).map((l) => {
    const [r, g, b] = l.to;
    if (b > 0.8 && r < 0.3) return 'blue';
    if (r > 0.8 && b > 0.8) return 'magenta';
    if (r > 0.8 && g > 0.4 && b < 0.2) return 'orange';
    if (r > 0.8 && b > 0.4) return 'pink';
    return 'colored';
  });
  const palette = [...new Set(colorWords)].join('/') || 'natural';

  return {
    id: `lightleaks-${n}`,
    category: 'LIGHT LEAKS',
    variant: 'Light Leaks',
    intensity: String(n),
    label: `Light Leaks · ${n}`,
    engine: 'LightLeaks',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds,
    params: { cut, map: { dir: `transitions/lib/leaks/maps/bm${n}`, frames: 30, offset: mapOffset }, layers, blur, brightness, contrast },
    sfx: 'transitions/lib/sfx-lightleaks.mp3',
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Light Leaks',
      engineFile: 'remotion/src/transitions/engines/LightLeaks.tsx',
      description: `Organic film-style light leak flash (${palette} palette, ${layers.length} real leak plate${layers.length > 1 ? 's' : ''}): the frame blurs and blows out toward the cut while lens flares and bokeh wash over it, then settles clean. Warm, cinematic, softer than the glitch families.`,
      energy: 'medium',
      durationSeconds,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['light-leak', 'flare', 'bokeh', 'film', 'flash', 'organic', ...new Set(colorWords)],
      useWhen: `Soft cinematic scene change (~${durationSeconds}s) with a ${palette} leak flash; emotional/organic cuts rather than hard glitch energy.`,
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
console.log(`built ${rows.length} LightLeaks rows; library now ${lib.transitions.length}`);
for (const r of rows) console.log(' ', r.id, r.params.layers.map((l) => l.src.split('/').pop().replace('lightleaks-', '').replace('.mp4', '') + (l.to ? `→rgb(${l.to.map((x) => Math.round(x * 255)).join(',')})` : '')).join(' + '));
