#!/usr/bin/env node
/** _offsetgeo-clips.json -> ALL 152 OFFSET library rows, engine OffsetSlide:
 *   14 PURE-PUSH sub-families (near-1:1) + Warp (lens distortion) + Hit (glitch
 *   Deviation flash) hybrids (approximate) x 8 dirs.
 * Merges into library.json.transitions (removes prior offset-* rows first).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_offsetgeo-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => { const [a, b] = String(v).split(':'); return [num(a), num(b)]; };
const r4 = (n) => +n.toFixed(4);

const DIRS = ['Up', 'Down', 'Left', 'Right', 'Left Up', 'Left Down', 'Right Up', 'Right Down'];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// per-family SFX: the pack sound cut at the family's REAL project in-point AND
// TRUNCATED to the family's audio-clip window, exactly as the pack plays it
// (Adobe hard-cuts the sound at the transition end — Simple is a tight 0.24s
// "tk", NOT the file's full 0.86s whip; Mike A/B'd against Premiere and full
// ring-outs read as "different sound"). One file per family (windows differ
// between families sharing a source file), 30ms tail click-guard.
const sfxFor = (variant) => `transitions/lib/sfx-offset-${slug(variant)}.mp3`;

/** Temporal-bezier handles from a raw keyframe row (decoded 2026-07-11):
 * a = [value, interpA, interpB, inVel, inInf, outVel, outInf, ...spatial extras].
 * These are ESSENTIAL — e.g. Hit's offset has outInf 0.58 (slow half, then whip)
 * and its blur BULGES to ~100 mid-segment via inVel −7.1e6 @ inf 1e-4 despite the
 * end value being 8. Discarding them collapsed every curve to linear (QA failure). */
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

// mblur seq-time keyframes for a clip: t_seq = clip.start + kf.t - inPoint
function seqLenKfs(clip) {
  const eff = (clip.effects || []).find((e) => e.matchName === 'AE.ADBE Motion Blur');
  if (!eff) return null;
  const p = eff.params.find((x) => x.name === 'Blur Length');
  if (!p) return null;
  const ip = clip.inPoint || 0;
  if (p.keyframes) return p.keyframes.map((k) => ({ t: r4(clip.start + k.t - ip), len: num(k.v), ...handles(k) }));
  return [{ t: clip.start, len: num(p.value) }];
}

function buildRow(seq) {
  const dir = DIRS.find((d) => seq.name.endsWith(' - ' + d));
  const variant = seq.name.replace(' - ' + dir, '').replace(/^Offset /, '');
  const isHit = /Hit/.test(variant);
  const isWarp = /Warp/.test(variant);

  // --- merged wrap-Offset curve (seq-time) from ONLY the (In)/(Out) HST clips
  // (Hit's "Shake" and Warp's "Warp" clips also carry Offsets — exclude them) ---
  const offClips = seq.clips.filter((c) =>
    c.subClipName && /\((In|Out)\)/i.test(c.subClipName) && // "(in)" lowercase exists (Long Simple - Right)
    (c.effects || []).some((e) => e.matchName === 'AE.ADBE Offset'));
  // PIECEWISE curves — one per adjustment clip, in seq time. Do NOT merge them:
  // the (Out) clip's curve is the same motion RE-KEYED and (in the Short variants)
  // SHIFTED EARLIER — the transition JUMPS AHEAD in the motion at the cut (e.g.
  // Ease Out Short: (In) puts 1.4436 at seq 0.2, (Out) puts it at 0.12 = a 0.08s
  // skip hidden under the blur). A merged union smoothed over that jump and
  // distorted segment shapes (2026-07-11 QA). Premiere samples each clip's own
  // curve inside its own window; we reproduce exactly that.
  const clipCurve = (c) => {
    const eff = c.effects.find((e) => e.matchName === 'AE.ADBE Offset');
    const p = eff.params.find((x) => x.name === 'Shift Center To');
    const ip = c.inPoint || 0;
    const kfs = p.keyframes || [{ t: ip, v: p.value }];
    return kfs.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), dx: r4(x - 0.5), dy: r4(y - 0.5), ...handles(k) };
    });
  };
  const inClip = offClips.find((c) => /\(In\)/i.test(c.subClipName));
  const outClip = offClips.find((c) => /\(Out\)/i.test(c.subClipName));
  const cutStart = outClip ? outClip.start : null;
  const curveIn = clipCurve(inClip);
  const curveOut = clipCurve(outClip);

  const content = seq.clips.find((c) => c.track === 0);
  const durationSeconds = content ? content.end : Math.max(...seq.clips.map((c) => c.end || 0));
  const cut = r4((cutStart != null ? cutStart : durationSeconds / 2) / durationSeconds);

  const W = 1920, H = 1080;
  const last = curveOut[curveOut.length - 1];
  const angleDeg = r4(Math.atan2(last.dy * H, last.dx * W) * 180 / Math.PI);
  const mbClip = seq.clips.find((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Motion Blur'));
  const mblurCurve = seqLenKfs(mbClip) || [{ t: 0, len: 0 }];

  // The Motion Blur ADJUSTMENT CLIP has its own window — outside it there is NO
  // blur. Critical where the curve's last kf is nonzero (Long Hit ends 0.6:400,
  // clip ends 0.64): clamping to the last value kept the whole tail smeared; the
  // real render snaps CRISP when the clip ends (the slam). 2026-07-11 QA fix.
  const params = {
    curveIn, curveOut, cut,
    mblur: { angleDeg, window: [r4(mbClip.start), r4(mbClip.end)], curve: mblurCurve },
  };

  // --- Warp: keyframed Lens Distortion Curvature (seq-time) from the "Warp" clip ---
  if (isWarp) {
    const wClip = seq.clips.find((c) => (c.effects || []).some((e) => e.matchName === 'PR.ADBE Lens Distortion'));
    const eff = wClip && wClip.effects.find((e) => e.matchName === 'PR.ADBE Lens Distortion');
    const p = eff && eff.params.find((x) => x.name === 'Curvature');
    const ip = wClip ? (wClip.inPoint || 0) : 0;
    if (p && p.keyframes) params.lens = { curve: p.keyframes.map((k) => ({ t: r4(wClip.start + k.t - ip), k: num(k.v), ...handles(k) })) };
  }

  // --- Hit: green-emboss "Deviation" glitch flash window + Emboss params ---
  if (isHit) {
    const dClip = seq.clips.find((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Emboss'));
    const emb = dClip && dClip.effects.find((e) => e.matchName === 'AE.ADBE Emboss');
    if (dClip && emb) {
      const relief = num((emb.params.find((x) => x.name === 'Relief') || {}).value) || 10;
      const contrast = (num((emb.params.find((x) => x.name === 'Contrast') || {}).value) || 70) / 100;
      params.deviation = { t0: r4(dClip.start), t1: r4(dClip.end), reliefPx: Math.round(relief), contrast: r4(contrast) };
    }
    // impact "Shake": the real Geometry2 Position jitter on the "Shake" clip.
    // Keep only keyframes inside the clip window (the pre-window ones only shape
    // unused interpolation); dx/dy = position − 0.5 = screen-fraction jolts (~±3%).
    const sClip = seq.clips.find((c) => c.subClipName === 'Shake');
    const geo = sClip && (sClip.effects || []).find((e) => e.matchName === 'AE.ADBE Geometry2');
    const pos = geo && geo.params.find((x) => x.name === 'Position');
    if (sClip && pos && pos.keyframes) {
      const ip = sClip.inPoint || 0;
      params.shake = pos.keyframes
        .map((k) => {
          const [x, y] = xy(k.v);
          return { t: r4(sClip.start + k.t - ip), dx: r4(x - 0.5), dy: r4(y - 0.5), ...handles(k) };
        })
        .filter((k) => k.t >= sClip.start - 1e-6);
    }
  }

  const fidelity = (isWarp || isHit) ? 'approximate' : 'near-1:1';
  const wraps = Math.round(Math.abs(last.dx) || Math.abs(last.dy)) || 1;
  const isLong = /Long/.test(variant), isShort = /Short/.test(variant);
  const character = isHit ? 'slams to a hard stop with a glitch-fringe impact flash'
    : isWarp ? 'warps through a lens bulge as it eases to rest'
    : /Bounce/.test(variant) ? 'bounces to a stop'
    : /Swinging/.test(variant) ? 'overshoots and swings back to rest'
    : /Ease Out/.test(variant) ? 'launches fast and eases to a stop'
    : /Ease/.test(variant) ? 'eases in and out'
    : 'a clean linear whip';

  return {
    id: `offset-${slug(variant)}-${slug(dir)}`,
    category: 'OFFSET',
    variant,
    intensity: dir,
    label: `Offset · ${variant} · ${dir}`,
    engine: 'OffsetSlide',
    kind: 'geometric',
    fidelity,
    durationSeconds,
    params,
    sfx: sfxFor(variant),
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Offset',
      engineFile: 'remotion/src/transitions/engines/OffsetSlide.tsx',
      description: `Directional push/whip toward ${dir.toLowerCase()}: the frame wrap-scrolls ${wraps > 1 ? wraps + ' full widths' : 'one screen'} under a heavy directional motion blur that ${character}, hiding the cut inside the smear. ${isLong ? 'Long: multi-wrap streak.' : isShort ? 'Short: fast and punchy.' : ''}`.trim(),
      energy: 'high',
      durationSeconds,
      hasSound: sfxFor(variant) != null,
      fidelity,
      tags: ['offset', 'push', 'slide', 'whip', 'motion', slug(dir), slug(variant), ...(isHit ? ['glitch', 'hit'] : []), ...(isWarp ? ['warp', 'lens'] : [])],
      useWhen: `Fast ${dir.toLowerCase()} whip cut (~${durationSeconds}s); ${character}. Direction ${dir}. ${isLong ? 'Longer, wilder multi-wrap.' : isShort ? 'Snappy short version.' : ''}`.trim(),
    },
  };
}

const rows = [];
for (const seq of clips) {
  const dir = DIRS.find((d) => seq.name.endsWith(' - ' + d));
  if (!dir || !/^Offset /.test(seq.name)) continue;
  rows.push(buildRow(seq));
}

const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => !(r.category === 'OFFSET' && r.engine === 'OffsetSlide'));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));

const byFam = {};
for (const r of rows) byFam[r.fidelity] = (byFam[r.fidelity] || 0) + 1;
console.log(`built ${rows.length} OFFSET rows (${JSON.stringify(byFam)}); library now ${lib.transitions.length} rows`);
console.log('warp lens sample:', JSON.stringify(rows.find((r) => r.id === 'offset-warp-right').params.lens));
console.log('hit deviation sample:', JSON.stringify(rows.find((r) => r.id === 'offset-hit-right').params.deviation));
