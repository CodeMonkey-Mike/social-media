// HwBloodTitle.tsx: hw-blood-title (library.json devices.hw-blood-title), the title moment of the Bear Markets "Halloween
// Party Promo" montage (85.6-104.0; title events 96.51 / 98.68 / 100.85 / 103.02, the first two scenes from their start):
// a red GLOWING title (Montserrat Black, #E60003, soft edges, a red outer glow, a left echo ghost that closes in), an
// optional white SERIF subtitle over it ("Just One Day", "Investors", "67 Days", "44.67%"), and a growing BLOOD SPLAT
// (the template's own Blood_1 / Blood_2 CineForm RGBA plates, here graphics/blood-<n>-fill.mp4 + blood-<n>-key.mp4, the alpha
// kept as a key matte and verified per second against the source) over
// the title, on a B&W vignetted photo (the `under` node; omit it to lay the title over the comp's own footage).
// Layer order (frames): photo, title, blood, subtitle on top. The title blurs in over 0.2 s.
// Approximations (documented): the title size / glow / echo are frame measurements (the template's text animators live in
// the binary .aep); the blood in-point / rate / placement are fitted to the frames (scene 5: the splat doubles in area over
// the ~1.1 s title phase = Blood_2 from ~5.5 s at ~4x); the serif is Times New Roman (aAntaraDistance not installed).
// SILENT in the source.
import React from 'react';
import { useKtTime } from '../kinetic-text/clock';
import { HwAlphaPlate } from './media';
import { hwPaired } from './sfx';
import { HW_2022, HwSoundCue } from './types';

/** Montserrat cap height (700 / 1000 units) */
const CAP_M = 0.7;

export const HW_BLOOD_TITLE = {
  /** caps px measured 105-135 on the render (S&P 500 105, DECLINE 110, Oct 29, 1929 135) */
  caps: 112,
  x: 960,
  y: 540,
  blurIn: 0.2,
  blurFrom: 14,
  soft: 0.35,
  glow: { blur: 18, opacity: 0.6 },
  echo: { from: -64, to: -16, dur: 0.5, opacity: 0.25 },
  subtitle: { size: 104, dx: -40, dy: 34 },
  /** Blood_2 from 5.5 s at 4x, 0.88 scale, plate centre placed at (700, 500) px (the grown splat then sits up-right of the
   * title centre: S&P 500 ~(664, 525), DECLINE ~(789, 450) in the 2022 frames) */
  blood: { in: 5.5, rate: 4, x: 700, y: 500, scale: 0.88, dur: 10.91 },
};

export type HwBloodSplatProps = {
  t0: number;
  t1: number;
  /** staticFile paths of the plate's FILL and KEY (graphics/blood-<n>-fill.mp4 / blood-<n>-key.mp4) */
  fillSrc: string;
  keySrc: string;
  /** plate second at t0 and playback rate (holds the last frame after the plate ends) */
  bloodIn?: number;
  bloodRate?: number;
  /** where the PLATE CENTRE sits on screen, px, and its scale */
  x?: number;
  y?: number;
  scale?: number;
};

/** The blood plate placed and time-mapped (fill + key, composited over whatever was drawn before it). */
export const HwBloodSplat: React.FC<HwBloodSplatProps> = (p) => {
  const t = useKtTime();
  if (t < p.t0 || t >= p.t1) return null;
  const B = HW_BLOOD_TITLE.blood;
  const sec = Math.min(B.dur - 0.05, (p.bloodIn ?? B.in) + (t - p.t0) * (p.bloodRate ?? B.rate));
  return <HwAlphaPlate fillSrc={p.fillSrc} keySrc={p.keySrc} sec={sec} cx={p.x ?? B.x} cy={p.y ?? B.y} scale={p.scale ?? B.scale} />;
};

export type HwBloodTitleTextProps = {
  t0: number;
  title: string;
  subtitle?: string;
  /** which part to draw ('title' under the blood, 'subtitle' over it, 'both') */
  part?: 'title' | 'subtitle' | 'both';
  caps?: number;
  x?: number;
  y?: number;
  color?: string;
  font?: string;
  fontWeight?: number;
  subtitleFont?: string;
  subtitleSize?: number;
  subtitleDx?: number;
  subtitleDy?: number;
  uppercase?: boolean;
  /** 1 = full; the panel copies of the promo dim it through their own treatment */
  opacity?: number;
};

/** The glowing red title (+ the white serif subtitle) at time t (reads the comp clock). */
export const HwBloodTitleText: React.FC<HwBloodTitleTextProps> = (p) => {
  const t = useKtTime();
  const dt = t - p.t0;
  if (dt < 0) return null;
  const T = HW_BLOOD_TITLE;
  const part = p.part ?? 'both';
  const size = Math.round((p.caps ?? T.caps) / CAP_M);
  const col = p.color ?? HW_2022.promoRed;
  const k = Math.min(1, dt / T.blurIn);
  const blur = T.blurFrom * (1 - k) * (1 - k) + T.soft;
  const op = Math.min(1, dt / 0.1) * (p.opacity ?? 1);
  const echoDx = T.echo.from + (T.echo.to - T.echo.from) * Math.min(1, dt / T.echo.dur);
  const text = p.uppercase === false ? p.title : p.title.toUpperCase();
  const base: React.CSSProperties = {
    position: 'absolute',
    left: p.x ?? T.x,
    top: p.y ?? T.y,
    width: 'max-content',
    transform: 'translate(-50%, -50%)',
    fontFamily: p.font ?? HW_2022.promoFont,
    fontWeight: p.fontWeight ?? HW_2022.promoWeight,
    fontSize: size,
    lineHeight: `${size}px`,
    whiteSpace: 'nowrap',
    color: col,
  };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {part !== 'subtitle' && (
        <>
          {/* outer glow: a blurred copy */}
          <div style={{ ...base, filter: `blur(${T.glow.blur}px)`, opacity: T.glow.opacity }}>{text}</div>
          {/* the echo ghost that closes in from the left */}
          <div style={{ ...base, left: (p.x ?? T.x) + echoDx, filter: `blur(${blur + 2}px)`, opacity: T.echo.opacity }}>{text}</div>
          <div style={{ ...base, filter: `blur(${blur}px)`, textShadow: `0 0 6px ${col}, 0 0 16px ${col}` }}>{text}</div>
        </>
      )}
      {part !== 'title' && p.subtitle && (
        <div
          style={{
            ...base,
            left: (p.x ?? T.x) + (p.subtitleDx ?? T.subtitle.dx),
            top: (p.y ?? T.y) + (p.subtitleDy ?? T.subtitle.dy),
            fontFamily: p.subtitleFont ?? HW_2022.serifFont,
            fontWeight: 400,
            fontSize: p.subtitleSize ?? T.subtitle.size,
            lineHeight: `${p.subtitleSize ?? T.subtitle.size}px`,
            color: '#FFFFFF',
            filter: blur > 2 ? `blur(${(blur - T.soft) * 0.6}px)` : undefined,
          }}
        >
          {p.subtitle}
        </div>
      )}
    </div>
  );
};

export type HwBloodTitleProps = Omit<HwBloodTitleTextProps, 'part'> & {
  t1: number;
  /** staticFile paths of the blood plate's fill + key (graphics/blood-2-fill.mp4 / blood-2-key.mp4 in the promo's title scenes) */
  bloodFill: string;
  bloodKey: string;
  bloodIn?: number;
  bloodRate?: number;
  bloodX?: number;
  bloodY?: number;
  bloodScale?: number;
  /** optional underlay: the B&W vignetted photo (render it with HwLookLayer look 'bw' + vignette) */
  under?: React.ReactNode;
};

export const HwBloodTitle: React.FC<HwBloodTitleProps> = (p) => {
  const t = useKtTime();
  if (t < p.t0 || t >= p.t1) return null;
  const { t1, bloodFill, bloodKey, bloodIn, bloodRate, bloodX, bloodY, bloodScale, under, ...text } = p;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {under}
      <HwBloodTitleText {...text} part="title" />
      <HwBloodSplat t0={p.t0} t1={t1} fillSrc={bloodFill} keySrc={bloodKey} bloodIn={bloodIn} bloodRate={bloodRate} x={bloodX} y={bloodY} scale={bloodScale} />
      <HwBloodTitleText {...text} part="subtitle" />
    </div>
  );
};

/** hw-blood-title sounds: SILENT in the source. `pair` = a screenplay-paired catalog sound, attack ON the title. */
export const hwBloodTitleSounds = (o: { t0: number; pair?: string }): HwSoundCue[] => hwPaired(o.pair, [o.t0], 'screenplay-paired: attack ON the blood title');
