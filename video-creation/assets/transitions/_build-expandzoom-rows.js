#!/usr/bin/env node
/** _expandrest-clips.json -> 12 EXPAND In/Out/OutIn rows, engine ExpandZoom.
 * Per phase: 'rig' (Replicate present; curve = the KEYFRAMED Geometry2 Scale
 * param; S = 300/v) or 'crop' (curve = the keyframed AECrop side, both sides
 * carry the same values; S = 1/(1−2v/100); blur = Blur Length kfs). Shared:
 * Glow opacity envelope + Deviation (Mettle Master Amplitude + Scale pulse).
 * SFX Whoosh_02.wav truncated per audio-clip window. Merges into library.json
 * (keeps the ExpandPan rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_expandrest-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

const kfsOfParam = (c, p) => {
  const ip = c.inPoint || 0;
  return p.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
};
const findEff = (c, mn) => (c.effects || []).find((e) => e.matchName === mn);
const keyframedParam = (eff, nameRe) => eff && eff.params.find((p) => p.keyframes && nameRe.test(p.name));

function phaseOf(c) {
  const win = [r4(c.start), r4(c.end)];
  if (findEff(c, 'PR.ADBE Replicate')) {
    const geo = findEff(c, 'AE.ADBE Geometry2');
    const scaleP = keyframedParam(geo, /^Scale (Width|Height)$/);
    return { win, kind: 'rig', curve: kfsOfParam(c, scaleP) };
  }
  const crop = findEff(c, 'AE.ADBE AECrop');
  const cropP = keyframedParam(crop, /^(Left|Right|Top|Bottom)$/);
  const ph = { win, kind: 'crop', curve: kfsOfParam(c, cropP) };
  const mb = findEff(c, 'AE.ADBE Motion Blur');
  const mbP = keyframedParam(mb, /^Blur Length$/);
  if (mbP) ph.blur = kfsOfParam(c, mbP);
  return ph;
}

function buildRow(seq) {
  const m = seq.name.match(/^Expand (In|In Short|Out|Out Short|Out In|Out In Short) - (Horizontal|Vertical)$/);
  const variant = m[1], dirWord = m[2];
  const axis = dirWord === 'Horizontal' ? 'x' : 'y';
  const dur = seq.clips.find((c) => c.track === 0).end;

  const inClip = seq.clips.find((c) => c.subClipName && /\(In\)/i.test(c.subClipName));
  const outClip = seq.clips.find((c) => c.subClipName && /\(Out\)/i.test(c.subClipName));
  const glowClip = seq.clips.find((c) => c.subClipName === 'Glow');
  const devClip = seq.clips.find((c) => c.subClipName === 'Deviation');

  const glowOpEff = findEff(glowClip, 'AE.ADBE Opacity');
  const glowOpP = keyframedParam(glowOpEff, /^Opacity$/);
  const met = findEff(devClip, 'AE.Mettle SkyBox Digital Glitch');
  const masterP = keyframedParam(met, /^Master Amplitude$/);
  const devGeo = findEff(devClip, 'AE.ADBE Geometry2');
  const pulseP = keyframedParam(devGeo, /^Scale (Width|Height)$/);

  const cut = r4(outClip.start / dur);
  const aud = (seq.audio || [])[0];
  const winLen = aud ? r4(aud.end - aud.start) : dur;
  const sfxName = winLen >= 0.9 ? '96' : winLen >= 0.8 ? '84' : '60';

  return {
    id: `expand-${slug(variant)}-${slug(dirWord)}`,
    category: 'EXPAND',
    variant,
    intensity: dirWord,
    label: `Expand · ${variant} · ${dirWord}`,
    engine: 'ExpandZoom',
    kind: 'geometric',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      cut,
      axis,
      phaseIn: phaseOf(inClip),
      phaseOut: phaseOf(outClip),
      glow: { win: [r4(glowClip.start), r4(glowClip.end)], opacity: kfsOfParam(glowClip, glowOpP) },
      deviation: {
        win: [r4(devClip.start), r4(devClip.end)],
        master: kfsOfParam(devClip, masterP),
        scalePulse: pulseP ? kfsOfParam(devClip, pulseP) : [],
      },
    },
    sfx: `transitions/lib/sfx-expandzoom-${sfxName}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Expand ${variant}`,
      engineFile: 'remotion/src/transitions/engines/ExpandZoom.tsx',
      description: `Center-anchored ${dirWord.toLowerCase()} stretch transition: the frame expands into glowing streaks with a chromatic pulse at the cut, then the new scene contracts back to rest. ${/Short/.test(variant) ? 'Short: fast and punchy.' : ''}`.trim(),
      energy: 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['expand', slug(variant), slug(dirWord), 'stretch', 'zoom', 'glow'],
      useWhen: `Energetic ${dirWord.toLowerCase()} expand cut (~${dur}s) with glow + chromatic pulse; scene-change accent. ${/Short/.test(variant) ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => !(r.category === 'EXPAND' && r.engine === 'ExpandZoom'));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} ExpandZoom rows; library now ${lib.transitions.length}`);
const s = rows.find((r) => r.id === 'expand-in-horizontal');
console.log('in-horizontal:', JSON.stringify({ cut: s.params.cut, phaseIn: { kind: s.params.phaseIn.kind, win: s.params.phaseIn.win }, phaseOut: { kind: s.params.phaseOut.kind, win: s.params.phaseOut.win, blur: !!s.params.phaseOut.blur } }));
