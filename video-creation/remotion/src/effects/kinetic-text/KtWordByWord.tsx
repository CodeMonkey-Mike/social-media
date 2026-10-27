// KtWordByWord.tsx: kt-word-by-word (library.json devices.kt-word-by-word, + kt-keyword-pop.punch for the bounce payoff).
// A sentence as 2 to 4 short phrases at the lower third, each REPLACING the last on a hard cut on its spoken word:
// opacity 0 -> 100 on the first frame and the elastic 'Zoom Bounce IN' scale 0 -> 111 -> 93 -> 105 -> 98 -> 101 -> 100
// over 0.15 s, centred at ~85 percent of the frame height, white. Ends on ONE payoff word that goes BIG, centred
// mid-frame, in the accent colour with a glow (2023 green #20F91A), with the kt-keyword-pop jiggle (payoffMotion
// 'jiggle', the row), held 0.8 to 1.0 s, then the comp's cut. payoffMotion 'bounce' = the CONVERSIONS reading of the
// punch row (the payoff of a run on the elastic instead of the jiggle, no hover) for the red punch word.
// Sizes: phrase caps 77 px (the punch row: CONVERSIONS 150 px caps at text-layer scale 390 vs 200 for the caption
// phrases; 2023 frames read 70 px) -> 110 px font; payoff caps 150 px (the measured CONVERSIONS) -> on the jiggle's 110
// hold the base font is 195 px. The row's "about 3x caption size" would overflow the frame on a two-word payoff, so the
// measured payoff size is the default (payoffFontSize overrides).
import React from 'react';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { ELASTIC, POP110_DUR, elastic, pop110 } from './motion';
import { At, KtTextBlock } from './text';
import { onFrame } from './sfx';
import { CAP, KT_2023, KtCommon, KtSoundCue } from './types';

export const KT_WBW = {
  phraseY: 0.85 * 1080,
  phraseFontSize: Math.round(77 / CAP),
  payoffY: 0.5 * 1080,
  payoffCaps: 150,
};

export type KtWordByWordProps = KtCommon & {
  /** the phrases, each from its t to the next phrase (or the payoff, or t1) */
  phrases: { t: number; text: string }[];
  payoff?: { t: number; text: string };
  payoffMotion?: 'jiggle' | 'bounce';
  payoffColor?: string;
  phraseY?: number;
  phraseFontSize?: number;
  payoffY?: number;
  payoffFontSize?: number;
};

export const KtWordByWord: React.FC<KtWordByWordProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, phrases, payoff, payoffMotion = 'jiggle', motionBlur = true } = p;
  if (t < t0 || t >= t1) return null;
  const font = { font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle };

  if (payoff && t >= payoff.t) {
    const col = p.payoffColor ?? p.accent ?? KT_2023.payoffGreen;
    const bounce = payoffMotion === 'bounce';
    const fs = p.payoffFontSize ?? Math.round(KT_WBW.payoffCaps / CAP / (bounce ? 1 : 1.1));
    const block = (
      <KtTextBlock
        lines={[payoff.text]}
        style={{ ...font, fontSize: fs, lineHeight: fs, color: col, glow: col, ...(bounce ? { stroke: [4.5, '#FFFFFF'] as [number, string] } : {}) }}
      />
    );
    const render = (ts: number) => {
      const d = ts - payoff.t;
      if (bounce) {
        const e = elastic(d, ELASTIC.phrase.dur, ELASTIC.phrase.fade);
        return (
          <At x={960} y={p.payoffY ?? KT_WBW.payoffY} s={e.s} opacity={e.op}>
            {block}
          </At>
        );
      }
      const pm = pop110(d);
      return (
        <At x={960} y={p.payoffY ?? KT_WBW.payoffY} s={pm.s} rot={pm.rot}>
          {block}
        </At>
      );
    };
    const win = bounce ? ELASTIC.phrase.dur : POP110_DUR;
    return <ShutterBlur t={t} t0={payoff.t} fps={fps} angle={bounce ? 180 : 360} samples={8} active={motionBlur && t - payoff.t < win + 0.04} render={render} />;
  }

  // the current phrase (the latest one that has started)
  let cur: { t: number; text: string } | null = null;
  for (const ph of phrases) if (ph.t <= t) cur = ph;
  if (!cur) return null;
  const c = cur;
  const fs = p.phraseFontSize ?? KT_WBW.phraseFontSize;
  const block = <KtTextBlock lines={[c.text]} style={{ ...font, fontSize: fs, lineHeight: fs, color: p.textColor ?? KT_2023.white, shadow: KT_2023.shadow }} />;
  const render = (ts: number) => {
    const e = elastic(ts - c.t, ELASTIC.phrase.dur, ELASTIC.phrase.fade);
    return (
      <At x={960} y={p.phraseY ?? KT_WBW.phraseY} s={e.s} opacity={e.op}>
        {block}
      </At>
    );
  };
  return <ShutterBlur t={t} t0={c.t} fps={fps} angle={180} samples={8} active={motionBlur && t - c.t < ELASTIC.phrase.dur + 0.04} render={render} />;
};

/** kt-word-by-word sounds: the phrases are SILENT; cash-register-2 ON the payoff word when it means money / scale. */
export const ktWordByWordSounds = (o: { payoffT?: number; money?: boolean }): KtSoundCue[] =>
  o.payoffT !== undefined && o.money !== false ? [onFrame('cash-register-2', o.payoffT, 'ON the payoff word (money / scale)')] : [];
