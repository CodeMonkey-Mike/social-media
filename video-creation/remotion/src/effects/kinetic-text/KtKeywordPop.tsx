// KtKeywordPop.tsx: kt-keyword-pop (library.json devices.kt-keyword-pop + its `punch` sub-row).
//   'jiggle' (default): a 1 to 2 line keyword / verdict appears at once (no fade) centred at ~79 percent of the frame
//      height ON the spoken word: the Transform '110' pop (scale 100 -> 110 + the +-2 degree jiggle, 360-degree motion
//      blur so the first 2-3 frames smear), then STILL at 110; the next cut removes it. Yellow; with *key* markup the
//      key words are yellow over white (the 'POORLY / ATTRIBUTABLE' verdict).
//   'punch-red': CONVERSIONS. NOT the 110 jiggle: 'Zoom Bounce IN' elastic 0 -> 111 -> 93 -> 105 -> 98 -> 101 -> 100
//      over 0.155 s, opacity in 0.014 s, 180-degree motion blur, first frame at scale 0 (invisible); no hover. Centre
//      (965, 560), caps 150 px; fill #E70001 + white stroke ~4.5 px + a red outer glow fading out ~35-40 px.
//   'punch-white': the 97-99 s headlines ('TECHNICAL SKILLS', 'CUSTOMER OBSESSED'): the 110 jiggle pop + the hover
//      wobble, white #FDFDFD, dark drop shadow, no glow; 2 lines, caps 151-156 px on screen, pitch ~193 px, block
//      centred (960, 545).
// Sizes: rows give caps px measured ON SCREEN (after the pop's 110 percent hold); the base font size here is
// caps / 0.70 (Montserrat cap height) / 1.10 for the 110 pops, caps / 0.70 for the elastic (it settles at 100).
// The 'jiggle' size is not in the row: 2023 frame reads (12.23 'TACTICS THAT / GUARANTEE ATTRIBUTION', 25.17 'POORLY /
// ATTRIBUTABLE') measure caps 73-85 px, pitch 104-115 px at 110 percent -> base 104 px font, 100 px pitch.
import React from 'react';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { ELASTIC, POP110_DUR, elastic, hover, pop110 } from './motion';
import { At, KtTextBlock, hasKeys } from './text';
import { onFrame } from './sfx';
import { CAP, KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export type KtKeywordPopVariant = 'jiggle' | 'punch-red' | 'punch-white';

export type KtKeywordPopProps = KtCommon & {
  lines: KtLine[];
  variant?: KtKeywordPopVariant;
  /** block centre, px (defaults per variant from the row) */
  x?: number;
  y?: number;
  fontSize?: number;
  linePitch?: number;
  /** colour of non-key text when the lines carry *key* markup */
  textColor?: string;
  /** punch-red stroke colour / glow colour */
  strokeColor?: string;
  glowColor?: string;
  /** hover seed (punch-white) */
  seed?: number;
};

export const KT_KEYWORD_POP_DEFAULTS: Record<KtKeywordPopVariant, { x: number; y: number; fontSize: number; linePitch: number }> = {
  jiggle: { x: 960, y: 0.79 * 1080, fontSize: 104, linePitch: 100 },
  'punch-red': { x: 965, y: 560, fontSize: Math.round(150 / CAP), linePitch: Math.round(150 / CAP) },
  'punch-white': { x: 960, y: 545, fontSize: Math.round(153 / CAP / 1.1), linePitch: Math.round(193 / 1.1) },
};

export const KtKeywordPop: React.FC<KtKeywordPopProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, lines, variant = 'jiggle', motionBlur = true, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const d = KT_KEYWORD_POP_DEFAULTS[variant];
  const x = p.x ?? d.x;
  const y = p.y ?? d.y;
  const fontSize = p.fontSize ?? d.fontSize;
  const lineHeight = p.linePitch ?? d.linePitch;
  const font = { font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle };

  if (variant === 'punch-red') {
    const fill = p.accent ?? KT_2023.red;
    const block = (
      <KtTextBlock
        lines={lines}
        style={{ ...font, fontSize, lineHeight, color: fill, stroke: [4.5, p.strokeColor ?? '#FFFFFF'], glow: p.glowColor ?? fill }}
      />
    );
    const render = (ts: number) => {
      const e = elastic(ts - t0, ELASTIC.phrase.dur, ELASTIC.phrase.fade);
      return (
        <At x={x} y={y} s={e.s} opacity={e.op}>
          {block}
        </At>
      );
    };
    return (
      <ShutterBlur t={t} t0={t0} fps={fps} angle={180} samples={8} active={motionBlur && t - t0 < ELASTIC.phrase.dur + 0.04} render={render} />
    );
  }

  const keyed = hasKeys(lines);
  const accent = p.accent ?? (variant === 'punch-white' ? KT_2023.whiteHeadline : KT_2023.yellow);
  const body = p.textColor ?? KT_2023.white;
  const block = (
    <KtTextBlock
      lines={lines}
      style={{ ...font, fontSize, lineHeight, color: keyed ? body : accent, keyColor: accent, shadow: KT_2023.shadow }}
    />
  );
  const wobble = variant === 'punch-white';
  const render = (ts: number) => {
    const dt = ts - t0;
    const pm = pop110(dt);
    const hv = wobble ? hover(dt - POP110_DUR, seed + t0) : { x: 0, y: 0, rot: 0 };
    return (
      <At x={x} y={y} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {block}
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={motionBlur && t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** The sound by MEANING (kt-keyword-pop.sound_by_meaning) or the punch placements (kt-keyword-pop.punch.sound).
 * "ON the first frame" = the sound's attack_sec lands on the text's first frame (overlays.md section 2, sfx.ts). */
export type KtPopMeaning = 'neutral' | 'negative' | 'money' | 'positive' | 'emphatic';

export const ktKeywordPopSounds = (o: {
  t0: number;
  variant?: KtKeywordPopVariant;
  meaning?: KtPopMeaning;
  /** punch-white only: 'punch-1-2023' (TECHNICAL SKILLS, default) or 'punch-sound-effect' (CUSTOMER OBSESSED) */
  punch?: 'punch-1-2023' | 'punch-sound-effect';
}): KtSoundCue[] => {
  const { t0, variant = 'jiggle', meaning = 'neutral' } = o;
  if (variant === 'punch-red')
    return [{ id: 'punch-1-2023', at: t0 - 0.166, trimIn: 0.1, note: 'CONVERSIONS: file start 53.367 (clip in 0.100) for the item at 53.533; peak on the 111 overshoot' }];
  if (variant === 'punch-white') {
    if (o.punch === 'punch-sound-effect')
      return [{ id: 'punch-sound-effect', at: t0 - 0.933, trimIn: 0.633, note: 'CUSTOMER OBSESSED: file start 98.767 (clip in 0.633), onset 0.021 s before the text' }];
    return [{ id: 'punch-1-2023', at: t0 - 0.166, note: 'TECHNICAL SKILLS: file start 97.767, onset / peak ON the text 97.933' }];
  }
  switch (meaning) {
    case 'negative':
      return [onFrame('minecraft-damage', t0, 'NEGATIVE verdict, ON the first frame (at most once per video)')];
    case 'money':
      return [{ id: 'cash-register', at: t0 - 0.17, note: 'MONEY word: starts 0.17 s before the text so the bell lands on it' }];
    case 'positive':
      return [onFrame('twinkle', t0, 'POSITIVE / discovery, ON the first frame')];
    case 'emphatic':
      return [onFrame('punch-1-2023', t0, 'one emphatic accent-red word, ON the first frame')];
    default:
      return [onFrame('knock-pop', t0, 'neutral keyword, ON the first frame')];
  }
};

