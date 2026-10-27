// KtListCard.tsx: kt-list-card (library.json devices.kt-list-card).
//   card_in   FULL-FRAME crumpled-paper video at 306 percent (1958x1102, 2 percent overscan) slides in from the RIGHT:
//             0.50 s, the 'influence 32.5 -> 100' ease (progress 2 / 11 / 33 / 55 / 69 / 78 / 89 / 95 / 99 percent at
//             frames 1-14), 1714 px travel (first frame: left edge at ~87 percent of the width), 360-degree motion
//             blur (a horizontal smear on the fast frames). The paper plays from its in-point 0 (paperSrc, looped).
//   card_hold the card IS the whole picture until the hard cut (t1).
//   items     each item = the kt-keyword-pop pop (110 + jiggle, 360-degree shutter) + the hover for the rest of the
//             card; appears at once; earlier items STAY (keep hovering). 2023: item 1 0.567 s after the card starts,
//             item 2 +0.767 s.
//   layout    2023 (2 items, on screen at the 110 hold): item 1 caps 176 px centred (961, 341 = 31.6 percent); item 2 two
//             lines caps ~146 px, pitch 200 px, centred (931, 739 = 68.4 percent). Other counts: evenly stacked.
//   look      Montserrat ExtraBold Italic caps, flat fills, NO stroke, NO shadow: blue #0B81F6, red #E80101, ...
import React from 'react';
import { Freeze, OffthreadVideo, interpolate } from 'remotion';
import { DirBlur, ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { CL, POP110_DUR, easeInfluence325, hover, pop110, shutterTravel, streakSigma } from './motion';
import { At, KtTextBlock } from './text';
import { CAP, KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export const KT_LIST = {
  slide: 0.5,
  travel: 1714,
  video: { w: 1958, h: 1102, loopSec: 32.3 },
  item1Delay: 0.567,
  itemGap: 0.767,
  layout2: [
    { x: 961, y: 341, caps: 176, pitch: 200 },
    { x: 931, y: 739, caps: 146, pitch: 200 },
  ],
};

export type KtListItem = { t: number; lines: KtLine[]; color?: string; x?: number; y?: number; caps?: number; pitch?: number };

export type KtListCardProps = KtCommon & {
  items: KtListItem[];
  paperSrc?: string;
  paperIn?: number;
  seed?: number;
};

const defaultLayout = (n: number, i: number) => {
  if (n === 2) return KT_LIST.layout2[i];
  if (n === 1) return { x: 960, y: 540, caps: 176, pitch: 200 };
  const top = 230;
  const bottom = 850;
  return { x: 960, y: top + ((bottom - top) * i) / (n - 1), caps: Math.min(146, Math.round(560 / n)), pitch: Math.round(Math.min(146, 560 / n) * 1.37) };
};
const defaultColor = (i: number) => [KT_2023.listBlue, KT_2023.listRed][i % 2];

export const KtListCard: React.FC<KtListCardProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, items, motionBlur = true, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const xAt = (ts: number) => KT_LIST.travel * (1 - easeInfluence325(interpolate(ts - t0, [0, KT_LIST.slide], [0, 1], CL)));
  const off = xAt(t);
  const L = motionBlur && dt < KT_LIST.slide ? shutterTravel(xAt, t, t0, 360, fps) : 0;
  const sec = ((p.paperIn ?? 0) + Math.max(0, dt)) % KT_LIST.video.loopSec;
  const card = (
    <DirBlur sx={streakSigma(L)} sy={0}>
      <div style={{ position: 'absolute', left: (1920 - KT_LIST.video.w) / 2 + off, top: (1080 - KT_LIST.video.h) / 2, width: KT_LIST.video.w, height: KT_LIST.video.h }}>
        {p.paperSrc ? (
          <Freeze frame={Math.floor(sec * fps)}>
            <OffthreadVideo src={p.paperSrc} muted style={{ width: '100%', height: '100%' }} />
          </Freeze>
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#E1DFE1' }} />
        )}
      </div>
    </DirBlur>
  );
  return (
    <>
      {card}
      {items.map((it, i) => {
        if (t < it.t) return null;
        const lay = defaultLayout(items.length, i);
        const x = it.x ?? lay.x;
        const y = it.y ?? lay.y;
        const fontSize = Math.round((it.caps ?? lay.caps) / CAP / 1.1);
        const lineHeight = Math.round((it.pitch ?? lay.pitch) / 1.1);
        const block = (
          <KtTextBlock
            lines={it.lines}
            style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize, lineHeight, color: it.color ?? defaultColor(i) }}
          />
        );
        const render = (ts: number) => {
          const d = ts - it.t;
          const pm = pop110(d);
          const hv = hover(d - POP110_DUR, seed + it.t + i * 7);
          return (
            <At x={x} y={y} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
              {block}
            </At>
          );
        };
        return <ShutterBlur key={i} t={t} t0={it.t} fps={fps} angle={360} samples={8} active={motionBlur && t - it.t < POP110_DUR + 0.04} render={render} />;
      })}
    </>
  );
};

/** kt-list-card sounds: fast-swoosh for the card (file start 0.200 s before it moves, in-point 0.133: onset 0.014 s
 * before the move); ting per item (file start 0.800 s before the item with in-point 0.800: onset 0.016 s after the
 * item's first frame; clip ~0.95 s). The exit is silent (hard cut). */
export const ktListCardSounds = (o: { t0: number; items: { t: number }[] }): KtSoundCue[] => [
  { id: 'fast-swoosh', at: o.t0 - 0.2, trimIn: 0.133, note: 'card in' },
  ...o.items.map((it) => ({ id: 'ting', at: it.t - 0.8, trimIn: 0.8, dur: 0.95, note: 'item pop' })),
];
