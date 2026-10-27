// KtLowerThirdBand.tsx: kt-lower-third-band (library.json devices.kt-lower-third-band + its text_swap sub-row).
//   band_in   a dark textured band over the bottom 35 percent (top edge y 706, 373 px) slides up from fully below to
//             flush over 0.27 s, ease-out. Texture = the 2023 'Animated Texture' clip raw at 402.35 percent (2575x1448)
//             centred x 1043 with its top edge on the band top (textureSrc), else a CSS #043E38 stand-in.
//   text_in   0.13 s after the band starts: the kt-keyword-pop pop (Transform '110' + the +-2 degree jiggle, 360-degree
//             shutter), then the kt-side-panel HOVER for the whole hold.
//   text_swap swaps[]: the band stays (no keyframes), statement 2 replaces statement 1 on its spoken word: exactly ONE
//             frame before the swap shows text 1 starting to drop as a 360-degree vertical streak (about 0 -> 32 -> 208
//             px across the shutter, the 'Out DOWN' preset's first frame), then a hard cut; text 2 pops on the swap
//             frame exactly as text 1 (110 + jiggle) with the hover restarted.
//   exit      NONE (corrected 2026-10-25): the band never animates out; the comp's next card / whip covers or cuts it.
//   look      Montserrat ExtraBold Italic caps, centred in the band, *key* words yellow + white body (both statements
//             white in the swap reading), drop shadow. Text 2: 2 lines, ~78 px pitch, ~55 px caps.
//   position  the text block centre sits at y 917 (2023 frames: 3-line text 1 spans 799-1036, 2-line text 2 caps 842-991
//             per the row; both centre ~917, 24 px below the band's centre). The row's 815 / 848 are the text LAYER
//             anchors, not the block centres.
// The face lift is the COMP's job: ktBandFaceLift() (68 px linear over 0.10 s from 0.13 s after the band; the swap's
// new angle sits 85 px up).
import React from 'react';
import { Freeze, OffthreadVideo, interpolate } from 'remotion';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { KtDarkTexture } from './KtSidePanel';
import { CL, POP110_DUR, easeOut, hover, pop110 } from './motion';
import { At, KtTextBlock } from './text';
import { onFrame } from './sfx';
import { CAP, KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export const KT_BAND = {
  top: 706,
  slide: 0.27,
  textDelay: 0.13,
  tex: { w: 2575, h: 1448, cx: 1043, loopSec: 60 },
  textY: 917,
  caps: 55,
  pitch: 78,
  streak: [0, 32, 208],
};

export type KtLowerThirdBandProps = KtCommon & {
  lines: KtLine[];
  /** statement swaps inside the same band: [{ t, lines }] */
  swaps?: { t: number; lines: KtLine[] }[];
  textureSrc?: string;
  textureIn?: number;
  fontSize?: number;
  linePitch?: number;
  textY?: number;
  seed?: number;
};

export const KtLowerThirdBand: React.FC<KtLowerThirdBandProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, lines, swaps = [], motionBlur = true, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const B = KT_BAND;
  const dt = t - t0;
  const top = interpolate(dt, [0, B.slide], [1080, B.top], { ...CL, easing: easeOut });
  const fontSize = p.fontSize ?? Math.round(B.caps / CAP);
  const lineHeight = p.linePitch ?? B.pitch;
  const accent = p.accent ?? KT_2023.yellow;
  const y = p.textY ?? B.textY;

  // which statement is up: [start, lines]
  const stmts = [{ t: t0 + B.textDelay, lines }, ...swaps.map((s) => ({ t: s.t, lines: s.lines }))];
  let i = -1;
  for (let k = 0; k < stmts.length; k++) if (stmts[k].t <= t) i = k;
  const nextT = stmts[i + 1]?.t;
  const lastFrameBeforeSwap = nextT !== undefined && i >= 0 && t >= nextT - 1 / fps - 1e-6;

  const blockFor = (ls: KtLine[]) => (
    <KtTextBlock
      lines={ls}
      style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize, lineHeight, color: p.textColor ?? KT_2023.white, keyColor: accent, shadow: KT_2023.shadow }}
    />
  );

  let text: React.ReactNode = null;
  if (i >= 0) {
    const st = stmts[i];
    const block = blockFor(st.lines);
    const pose = (ts: number) => {
      const d = ts - st.t;
      const pm = pop110(d);
      const hv = hover(d - POP110_DUR, seed + st.t);
      return { s: pm.s, rot: pm.rot + hv.rot, x: hv.x, y: hv.y };
    };
    if (lastFrameBeforeSwap) {
      // the ONE visible frame of the outgoing 'Out DOWN': a vertical streak 0 -> 32 -> 208 px across the shutter
      const ps = pose(t);
      const n = 12;
      text = (
        <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>
          {Array.from({ length: n }, (_, k) => {
            const u = k / (n - 1);
            const dy = interpolate(u, [0, 0.5, 1], B.streak);
            return (
              <div key={k} style={{ position: 'absolute', inset: 0, opacity: 1 / n, mixBlendMode: 'plus-lighter' }}>
                <At x={960} y={y} dx={ps.x} dy={ps.y + dy} s={ps.s} rot={ps.rot}>
                  {block}
                </At>
              </div>
            );
          })}
        </div>
      );
    } else {
      const render = (ts: number) => {
        const ps = pose(ts);
        return (
          <At x={960} y={y} dx={ps.x} dy={ps.y} s={ps.s} rot={ps.rot}>
            {block}
          </At>
        );
      };
      text = <ShutterBlur t={t} t0={st.t} fps={fps} angle={360} samples={8} active={motionBlur && t - st.t < POP110_DUR + 0.04} render={render} />;
    }
  }

  const sec = ((p.textureIn ?? 0) + Math.max(0, dt)) % B.tex.loopSec;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, width: 1920, height: 1080 - B.top + 40, overflow: 'hidden' }}>
        {p.textureSrc ? (
          <Freeze frame={Math.floor(sec * fps)}>
            <OffthreadVideo src={p.textureSrc} muted style={{ position: 'absolute', left: B.tex.cx - B.tex.w / 2, top: 0, width: B.tex.w, height: B.tex.h }} />
          </Freeze>
        ) : (
          <KtDarkTexture color={KT_2023.band} />
        )}
      </div>
      {text}
    </>
  );
};

/** The COMP's face move under a band: lifted 68 px linearly over 0.10 s from 0.13 s after the band starts (the face
 * clears the band); after a swap the new angle sits 85 px up (2023: the face shot cuts 1 frame after the swap). */
export const ktBandFaceLift = (t: number, t0: number, swapTs: number[] = []) => {
  const after = swapTs.filter((s) => t >= s + 1 / 30);
  if (after.length) return -85;
  return -68 * interpolate(t - t0 - 0.13, [0, 0.1], [0, 1], CL);
};

/** kt-lower-third-band sounds: swoosh-4 starting 0.34 s BEFORE the band moves; knock-pop ON text 1's first frame; each
 * swap: knock-pop ON text 2's first frame (clip trimmed to 0.167 s); the drop frame is silent. */
export const ktLowerThirdBandSounds = (o: { t0: number; swaps?: { t: number }[] }): KtSoundCue[] => [
  { id: 'swoosh-4', at: o.t0 - 0.34, note: 'band in: starts 0.34 s before the band moves' },
  onFrame('knock-pop', o.t0 + KT_BAND.textDelay, 'ON the first frame of the text'),
  ...(o.swaps ?? []).map((s) => ({ id: 'knock-pop', at: s.t, dur: 0.167, note: 'ON the first frame of text 2 (clip 0.167 s)' })),
];
