// HwWordPop.tsx: hw-word-pop (library.json devices.hw-word-pop). Bear Markets 0.767-19.567: ONE word at a time on the
// spoken word, Showcard Gothic, ALL CAPS, flat fill #27FF14, no stroke / shadow, centred low in the frame. Each word
// appears at 75 percent, then pops: Transform Scale W 75 -> 115 -> 100, H 75 -> 110 -> 100 percent at +0 / +0.067 /
// +0.117 s (LINEAR keys), pivot (960, 940) px, 360-degree shutter (the first pop frames smear). 17 of the 24 words held
// 75 percent for 2 frames before popping (popDelay 0.067, the default), the first 7 popped on their first frame (0),
// "In January" waited 0.163 s. Held 0.27-0.93 s, HARD CUT to the next word, gaps where Mike pauses. SILENT in the source.
// Size / place (measured on the 100 percent frames, cross-checked with the font's own metrics): font 212 px (ESTABLISHED
// 1359 px wide, ALL-TIME 954, IN JANUARY 1191 -> 211.6-212.7 px), baseline y 989 (glyph box 825-990 = 76.4-91.7 percent of
// the frame height). Words are centred on x 960 (the source's per-word centres sat 6-47 px left of it: pass `x`).
// The text is SVG (positioned by its BASELINE, independent of the font's line metrics).
import React from 'react';
import { ShutterBlur } from '../kinetic-text/blur';
import { useKtFps, useKtTime } from '../kinetic-text/clock';
import { WORD_POP, wordPop } from './motion';
import { hwPaired } from './sfx';
import { HW_2022, HwSoundCue } from './types';

export const HW_WORD_POP = {
  fontSize: 212,
  baseline: 989,
  x: 960,
  pivot: { x: 960, y: 940 },
};

export type HwWord = {
  /** first frame of the word (it shows at 75 percent until the pop) */
  t: number;
  /** the hard cut that removes it (default: the next word's t, else the run's t1) */
  t1?: number;
  text: string;
  /** horizontal centre (default 960) */
  x?: number;
  /** seconds at 75 percent before the pop (default 0.067: the source's majority; 0 = pop on the first frame) */
  popDelay?: number;
};

export type HwWordPopProps = {
  /** end of the run (exclusive): the last word's cut when it has no t1 */
  t1: number;
  words: HwWord[];
  font?: string;
  color?: string;
  fontSize?: number;
  baseline?: number;
  pivotX?: number;
  pivotY?: number;
  popDelay?: number;
  uppercase?: boolean;
  motionBlur?: boolean;
};

export const HwWordPop: React.FC<HwWordPopProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { words, motionBlur = true, uppercase = true } = p;
  let idx = -1;
  for (let i = 0; i < words.length; i++) if (words[i].t <= t) idx = i;
  if (idx < 0) return null;
  const w = words[idx];
  const end = w.t1 ?? (idx + 1 < words.length ? words[idx + 1].t : p.t1);
  if (t >= end || t >= p.t1) return null;
  const delay = w.popDelay ?? p.popDelay ?? WORD_POP.popDelay;
  const popAt = w.t + delay;
  const px = p.pivotX ?? HW_WORD_POP.pivot.x;
  const py = p.pivotY ?? HW_WORD_POP.pivot.y;
  const text = uppercase ? w.text.toUpperCase() : w.text;
  const render = (ts: number) => {
    const s = wordPop(ts - popAt);
    return (
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${px} ${py}) scale(${s.sx} ${s.sy}) translate(${-px} ${-py})`}>
          <text
            x={w.x ?? HW_WORD_POP.x}
            y={p.baseline ?? HW_WORD_POP.baseline}
            textAnchor="middle"
            fontFamily={p.font ?? HW_2022.wordFont}
            fontSize={p.fontSize ?? HW_WORD_POP.fontSize}
            fill={p.color ?? HW_2022.wordGreen}
          >
            {text}
          </text>
        </g>
      </svg>
    );
  };
  const popping = t >= popAt - 0.034 && t < popAt + WORD_POP.dur + 0.034;
  return <ShutterBlur t={t} t0={w.t} fps={fps} angle={360} samples={8} active={motionBlur && popping} render={render} />;
};

/** hw-word-pop sounds: SILENT in the source (music only). The screenplay may pair a catalog sound (`pair`): its attack
 * lands ON each word's pop. */
export const hwWordPopSounds = (o: { words: HwWord[]; popDelay?: number; pair?: string }): HwSoundCue[] =>
  hwPaired(o.pair, o.words.map((w) => w.t + (w.popDelay ?? o.popDelay ?? WORD_POP.popDelay)), 'screenplay-paired: attack ON the word pop');
