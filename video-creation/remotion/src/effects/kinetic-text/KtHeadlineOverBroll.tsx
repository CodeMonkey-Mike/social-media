// KtHeadlineOverBroll.tsx: kt-headline-over-broll (library.json devices.kt-headline-over-broll).
// One huge word or a two-line sentence centred over a b-roll shot. The b-roll itself lands with the whip-zoom: that is
// the COMP's cut, wrapped in <KtWhipCut> (scale 200 -> 100 + curvature over 0.37 s). This engine is the TEXT: the
// kt-keyword-pop pop (scale 100 -> 110, the +-2 degree jiggle, 360-degree shutter) 0.8 s after the cut (t0 = cut + 0.8),
// centred mid-frame (y 43 to 50 percent), then STILL until the next cut (2.0 to 2.2 s). White, Montserrat ExtraBold
// Italic, ALL CAPS.
// Sizes (on screen, after the 110 hold): a single word fills about a quarter of the frame height (2023 'LEAD' caps 259 px,
// centre y 522 = 48 percent) -> base font 337 px; a two-line sentence (2023 'WHETHER OR NOT AN / EXPERIMENT WAS
// SUCCESSFUL') caps 72 px, pitch 104 px, centre y 540 -> base font 94 px, pitch 94 px. Frame reads of the source video;
// the row gives the quarter-height rule and the y band.
import React from 'react';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { POP110_DUR, pop110 } from './motion';
import { At, KtTextBlock, hasKeys } from './text';
import { onFrame } from './sfx';
import { KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export const KT_HEADLINE = {
  delay: 0.8,
  word: { fontSize: 337, linePitch: 330, y: 522 },
  sentence: { fontSize: 94, linePitch: 94, y: 540 },
};

export type KtHeadlineOverBrollProps = KtCommon & {
  lines: KtLine[];
  x?: number;
  y?: number;
  fontSize?: number;
  linePitch?: number;
};

export const KtHeadlineOverBroll: React.FC<KtHeadlineOverBrollProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, lines, motionBlur = true } = p;
  if (t < t0 || t >= t1) return null;
  const single = lines.length === 1 && lines[0].replace(/\*/g, '').trim().split(/\s+/).length === 1;
  const d = single ? KT_HEADLINE.word : KT_HEADLINE.sentence;
  const color = p.textColor ?? KT_2023.white;
  const block = (
    <KtTextBlock
      lines={lines}
      style={{
        font: p.font,
        fontWeight: p.fontWeight,
        fontStyle: p.fontStyle,
        fontSize: p.fontSize ?? d.fontSize,
        lineHeight: p.linePitch ?? d.linePitch,
        color,
        keyColor: hasKeys(lines) ? p.accent ?? KT_2023.yellow : undefined,
        shadow: KT_2023.shadow,
      }}
    />
  );
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={p.x ?? 960} y={p.y ?? d.y} s={pm.s} rot={pm.rot}>
        {block}
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={motionBlur && t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** kt-headline-over-broll sounds: ON the b-roll cut ea-glitch-21 (tech / data b-roll) or swoosh-3 (a calmer run); then by
 * the word's meaning: cash-register 0.17 s before a MONEY word, twinkle ON a positive sentence's first frame. "ON" = the
 * sound's attack_sec lands on that frame (overlays.md section 2, sfx.ts). */
export const ktHeadlineOverBrollSounds = (o: {
  cutT: number;
  t0: number;
  cut?: 'ea-glitch-21' | 'swoosh-3' | null;
  word?: 'cash-register' | 'twinkle' | null;
}): KtSoundCue[] => {
  const out: KtSoundCue[] = [];
  const cut = o.cut === undefined ? 'ea-glitch-21' : o.cut;
  if (cut) out.push(onFrame(cut, o.cutT, 'ON the b-roll cut'));
  if (o.word === 'cash-register') out.push({ id: 'cash-register', at: o.t0 - 0.17, note: 'MONEY word: 0.17 s before it appears' });
  if (o.word === 'twinkle') out.push(onFrame('twinkle', o.t0, 'POSITIVE statement: ON the first frame of the text'));
  return out;
};
