// KtScatterWords.tsx: kt-scatter-words (library.json devices.kt-scatter-words).
// A list of 2 to 3 activities said in one breath, each placed in free space around the head: per word the
// kt-keyword-pop pop (110 + jiggle, 360-degree shutter) + the hover; appears at once; all STAY (hovering) until the cut.
// The three 2023 anchors are presets (on screen, at the 110 hold):
//   'right-of-head'  'CONDUCTING'  caps 61 px, centre (1573, 428) = 81.9 / 39.6 percent
//   'left-of-head'   'ANALYZING'   caps 58 px, centre (303, 414) = 15.8 / 38.3 percent
//   'chest'          'USING QUALITATIVE / CUSTOMER RESEARCH'  2 lines, caps ~67 px, pitch 73 px, centre (966, 852) =
//                    50.3 / 78.9 percent
// Look: Montserrat ExtraBold Italic caps, green #1EFF06, dark drop shadow, no stroke.
import React from 'react';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { POP110_DUR, hover, pop110 } from './motion';
import { At, KtTextBlock } from './text';
import { onFrame } from './sfx';
import { CAP, KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export type KtScatterAnchor = 'right-of-head' | 'left-of-head' | 'chest';

export const KT_SCATTER_ANCHORS: Record<KtScatterAnchor, { x: number; y: number; caps: number; pitch: number }> = {
  'right-of-head': { x: 1573, y: 428, caps: 61, pitch: 73 },
  'left-of-head': { x: 303, y: 414, caps: 58, pitch: 73 },
  chest: { x: 966, y: 852, caps: 67, pitch: 73 },
};

export type KtScatterWord = {
  t: number;
  /** one line, or several */
  text: KtLine | KtLine[];
  anchor?: KtScatterAnchor | { x: number; y: number };
  caps?: number;
  pitch?: number;
  /** sound override for ktScatterWordsSounds */
  sound?: 'pop-1' | 'knock-pop' | null;
};

export type KtScatterWordsProps = KtCommon & { words: KtScatterWord[]; seed?: number };

const ORDER: KtScatterAnchor[] = ['right-of-head', 'left-of-head', 'chest'];

export const KtScatterWords: React.FC<KtScatterWordsProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, words, motionBlur = true, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const color = p.accent ?? KT_2023.scatterGreen;
  return (
    <>
      {words.map((w, i) => {
        if (t < w.t) return null;
        const a = w.anchor ?? ORDER[i % 3];
        const preset = typeof a === 'string' ? KT_SCATTER_ANCHORS[a] : { ...KT_SCATTER_ANCHORS.chest, ...a };
        const lines = Array.isArray(w.text) ? w.text : [w.text];
        const fontSize = Math.round((w.caps ?? preset.caps) / CAP / 1.1);
        const lineHeight = Math.round((w.pitch ?? preset.pitch) / 1.1);
        const block = (
          <KtTextBlock lines={lines} style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize, lineHeight, color, shadow: KT_2023.shadow }} />
        );
        const render = (ts: number) => {
          const d = ts - w.t;
          const pm = pop110(d);
          const hv = hover(d - POP110_DUR, seed + w.t + i * 11);
          return (
            <At x={preset.x} y={preset.y} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
              {block}
            </At>
          );
        };
        return <ShutterBlur key={i} t={t} t0={w.t} fps={fps} angle={360} samples={8} active={motionBlur && t - w.t < POP110_DUR + 0.04} render={render} />;
      })}
    </>
  );
};

/** kt-scatter-words sounds (2023): word 1 pop-1 (file start 0.333 s before it, clip 0.733 s, onset 0.068 s after the
 * word), the MIDDLE word knock-pop ON its first frame, the last word pop-1 (file start 0.433 s before, onset 0.032 s
 * before the word). */
export const ktScatterWordsSounds = (o: { words: KtScatterWord[] }): KtSoundCue[] => {
  const n = o.words.length;
  return o.words.flatMap((w, i): KtSoundCue[] => {
    const mid = n >= 3 ? i > 0 && i < n - 1 : false;
    const id = w.sound === undefined ? (mid ? 'knock-pop' : 'pop-1') : w.sound;
    if (!id) return [];
    if (id === 'knock-pop') return [onFrame(id, w.t, 'the middle word: ON its first frame')];
    const lead = i === 0 ? 0.333 : 0.433;
    return [{ id, at: w.t - lead, dur: i === 0 ? 0.733 : undefined, note: i === 0 ? 'word 1: onset 0.068 s after the word' : 'last word: onset 0.032 s before the word' }];
  });
};
