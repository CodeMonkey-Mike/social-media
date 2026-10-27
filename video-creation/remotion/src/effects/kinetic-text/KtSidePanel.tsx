// KtSidePanel.tsx: kt-side-panel (library.json devices.kt-side-panel + texture_variants.dark | paper).
//
// texture 'dark' (default, beside the FACE):
//   panel_in  a dark textured panel, full frame height, 45 percent of the width (862 px), slides in from fully off-screen
//             on its side to flush in 0.50 s ease-out. RIGHT on the first use, LEFT on the next (the comp alternates).
//             Texture = the 2023 'Animated Texture' clip used raw at 402.35 percent (2575x1448), centred (2346, 692) for a
//             right panel (left edge x 1058); textureSrc = that mp4, else a CSS #003C33 stand-in.
//   text_in   0.23 s after the panel starts: the block rises 338 px from below to rest over 0.33 s while scaling
//             80 -> 110 -> 100 (peak at 0.15 s), 360-degree shutter. The text is its own layer (2023 frames: it does not
//             ride the panel's slide), centred on the panel's rest position.
//   hover     then the HOVER for the life of the panel (+-18 / +-13 px drift, new target ~0.7 s, +-0.5 deg rock / 3 s).
//   exit      none: the comp's next cut removes it.
//   frame_split (the COMP's job, on its own picture layer): ktSidePanelShift() gives the -80 px (toward the free side)
//             + scale 100 -> 120 percent over 0.47 s.
//   look      Montserrat ExtraBold Italic caps, centred, 3 to 5 short lines at ~80 px pitch (the row), *key* words
//             yellow #FCFE40, the rest white, soft dark drop shadow.
//
// texture 'paper' (beside a B-ROLL, always RIGHT):
//   panel     the crumpled-paper video at 309 percent (1978x1112), covering x 947-1920 (50.7 percent, 973 px); in = Motion
//             position LINEAR 0.233 s from left edge x 1988 to 947 (1041 px).
//   broll_reframe (the COMP's job): ktSidePanelShift() gives the b-roll's LINEAR translate left (default -549 px over
//             0.267 s from 0.033 s after the panel; the row's three reads were -523 / 0.20 s, -706 / 0.267, -549 / 0.267).
//   text 'card' (cards[]: 75 s 'CUSTOMER / INTERVIEW', 'SEO / STRATEGIES'): Arial Black caps, black, soft grey shadow, NO
//             hover. In = the 'N.Hyper Zoom Decrease In' whip on the TEXT: scale 200 -> 100 over 0.40 s from 0.033 s
//             before the card (the measured 170 / 140 / 126 / 119 / 114 / 110 / 108 / 106 / 104 table), lens curvature
//             -100 -> 0 over 0.367 s, chromatic aberration -80 -> 0 over 0.333 s, pivot = the nested frame's centre at
//             (1714, 73) so the words fly in from the lower left, huge, bent and colour-fringed. 2 lines centred x 1440,
//             caps 87-91 px, pitch 117 px, block y 381-584. Out (when the next card swaps in): 'Slide RIGHT (OUT)'
//             +1848 px in 0.205 s, zero speed both ends (influence 37 / 100), 180-degree shutter, ending exactly on the
//             next card's first frame. The panel stays between cards.
//   text 'label' (lines: 92 / 95 s 'BIAS TOWARDS ...'): the kt-keyword-pop pop (110 + jiggle) + hover, 0.167 s after the
//             panel starts (0.133 on the 95 s one); Montserrat ExtraBold Italic, red #E70001 (or blue #030AF4) with a
//             white stroke and a dark drop shadow; caps 68-71 px, pitch 88 px, block centre (1485, 552).
//   icon      optional, under the card text (kt-icon-pop 'panel-right' / 'panel-up' entrances).
//   exit      panel + icon hard cut (t1).
//
// Approximations: the lens curvature decays LINEARLY (the 2023 frames: the card text stays invisible, folded out by the
// curvature, until 0.20 s after the whip starts, and is still bent at 0.27 s, which the scale curve's fast ease-out would
// not give); the fold is modelled (text hidden while |k| > 45) and the visible frames bend through the shared
// displacement map (lens.tsx) at 0.25 x the curvature, the range where it stays fold-free across the block. The chromatic aberration is three
// cyan / magenta / yellow text plates multiplied (a subtractive split, exact for dark text on the light paper) at +-2
// percent radial scale per 80 units.
import React from 'react';
import { Freeze, OffthreadVideo, interpolate } from 'remotion';
import { DirBlur, ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { KtIconPop, KtIconPreset } from './KtIconPop';
import { KtLens } from './lens';
import {
  CL,
  POP110_DUR,
  RISE,
  easeOut,
  easePremiere,
  easeSlideOut37,
  hover,
  pop110,
  riseIn,
  shutterTravel,
  streakSigma,
  whipProgress,
} from './motion';
import { At, KtTextBlock, hasKeys } from './text';
import { CAP, CAP_ARIAL_BLACK, KT_2023, KtCommon, KtLine, KtSoundCue } from './types';

export const KT_PANEL = {
  dark: { width: 862, slide: 0.5, textDelay: 0.23, tex: { w: 2575, h: 1448, cx: 2346, cy: 692, loopSec: 60 } },
  paper: { left: 947, width: 973, enterLeft: 1988, slide: 0.233, video: { w: 1978, h: 1112, loopSec: 32.3 } },
  shift: { dark: { x: 80, scale: 1.2, dur: 0.47 }, paper: { x: 549, delay: 0.033, dur: 0.267 } },
  card: { cx: 1440, cy: 482, caps: 89, pitch: 117, whipLead: 1 / 30, whipDur: 0.4, lensDur: 0.367, caDur: 0.333, pivot: { x: 1714, y: 73 }, outDist: 1848, outDur: 0.205 },
  label: { cx: 1485, cy: 552, caps: 70, pitch: 88, delay: 0.167 },
};

/** the card text is hidden while the lens curvature is beyond this (Premiere's fold), see PaperCardText */
export const KT_CARD_FOLD_K = 45;
/** the visible frames' curvature, scaled into the displacement map's fold-free range across the text block */
export const KT_CARD_LENS_GAIN = 0.25;

export type KtPanelCard = { t: number; lines: KtLine[]; icon?: React.ReactNode; iconPreset?: KtIconPreset };

export type KtSidePanelProps = KtCommon & {
  side?: 'L' | 'R';
  texture?: 'dark' | 'paper';
  /** dark: the panel text; paper: the LABEL text */
  lines?: KtLine[];
  /** paper: the CARD texts (Arial Black whip-in, slide-out right on the next card) */
  cards?: KtPanelCard[];
  /** dark: the animated texture mp4 (staticFile path); omitted = a CSS #003C33 stand-in */
  textureSrc?: string;
  /** paper: the crumpled-paper mp4 (staticFile path); omitted = a CSS light-grey stand-in */
  paperSrc?: string;
  /** source second of the texture video at t0 (it then plays and loops) */
  textureIn?: number;
  /** paper label fill (2023 red #E70001, or blue #030AF4) */
  labelColor?: string;
  labelDelay?: number;
  cardFont?: string;
  cardColor?: string;
  /** dark text size (default: the row's ~80 px pitch) */
  fontSize?: number;
  linePitch?: number;
  /** an icon under the label (paper label variant) */
  icon?: React.ReactNode;
  iconPreset?: KtIconPreset;
  seed?: number;
  /** lens curvature on the card whip (default true) */
  lens?: boolean;
};

/** The texture / paper video, frame-locked to the device clock (works under any comp clock) and looped. */
const TextureVideo: React.FC<{ src: string; t: number; t0: number; inSec: number; loopSec: number; fps: number; style: React.CSSProperties }> = ({
  src,
  t,
  t0,
  inSec,
  loopSec,
  fps,
  style,
}) => {
  const sec = (inSec + Math.max(0, t - t0)) % loopSec;
  return (
    <Freeze frame={Math.floor(sec * fps)}>
      <OffthreadVideo src={src} muted style={style} />
    </Freeze>
  );
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** CSS stand-in for the dark texture when no textureSrc is passed. */
export const KtDarkTexture: React.FC<{ color?: string }> = ({ color = KT_2023.panel }) => (
  <div style={{ position: 'absolute', inset: 0, background: color }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: NOISE, mixBlendMode: 'overlay' }} />
  </div>
);

export const KtSidePanel: React.FC<KtSidePanelProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, texture = 'dark' } = p;
  if (t < t0 || t >= t1) return null;
  return texture === 'paper' ? <PaperPanel {...p} t={t} fps={fps} /> : <DarkPanel {...p} t={t} fps={fps} />;
};

// --------------------------------------------------------------------------------------------------------------------
const DarkPanel: React.FC<KtSidePanelProps & { t: number; fps: number }> = (p) => {
  const { t, fps, t0, side = 'R', lines = [], motionBlur = true, seed = 0 } = p;
  const D = KT_PANEL.dark;
  const dt = t - t0;
  const slide = interpolate(dt, [0, D.slide], [1, 0], { ...CL, easing: easeOut });
  const x0 = side === 'R' ? 1920 - D.width : 0;
  const off = (side === 'R' ? 1 : -1) * D.width * slide;
  const texLeft = side === 'R' ? D.tex.cx - D.tex.w / 2 - x0 : D.width - (D.tex.cx - D.tex.w / 2 - (1920 - D.width)) - D.tex.w;
  const tText = t0 + D.textDelay;
  const fontSize = p.fontSize ?? 70;
  const lineHeight = p.linePitch ?? 80;
  const keyed = hasKeys(lines);
  const accent = p.accent ?? KT_2023.yellow;
  const block = (
    <KtTextBlock
      lines={lines}
      maxWidth={D.width - 110}
      style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize, lineHeight, color: keyed ? p.textColor ?? KT_2023.white : accent, keyColor: accent, shadow: KT_2023.shadow }}
    />
  );
  const cx = x0 + D.width / 2;
  const render = (ts: number) => {
    const tr = ts - tText;
    const r = riseIn(tr);
    const hv = hover(tr - RISE.dur, seed + t0);
    return (
      <At x={cx} y={540} dx={hv.x} dy={r.y + hv.y} s={r.s} rot={hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: x0 + off, width: D.width, height: 1080, overflow: 'hidden' }}>
        {p.textureSrc ? (
          <TextureVideo
            src={p.textureSrc}
            t={t}
            t0={t0}
            inSec={p.textureIn ?? 0}
            loopSec={D.tex.loopSec}
            fps={fps}
            style={{ position: 'absolute', left: texLeft, top: D.tex.cy - D.tex.h / 2, width: D.tex.w, height: D.tex.h }}
          />
        ) : (
          <KtDarkTexture />
        )}
      </div>
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={fps} angle={360} samples={24} active={motionBlur && t - tText < RISE.dur + 0.04} render={render} />}
    </>
  );
};

// --------------------------------------------------------------------------------------------------------------------
const PaperPanel: React.FC<KtSidePanelProps & { t: number; fps: number }> = (p) => {
  const { t, fps, t0, t1, motionBlur = true, seed = 0 } = p;
  const P = KT_PANEL.paper;
  const dt = t - t0;
  const left = interpolate(dt, [0, P.slide], [P.enterLeft, P.left], CL); // LINEAR
  const panel = (
    <div style={{ position: 'absolute', left, top: 0, width: 1920 - P.left + 200, height: 1080, overflow: 'hidden' }}>
      {p.paperSrc ? (
        <TextureVideo
          src={p.paperSrc}
          t={t}
          t0={t0}
          inSec={p.textureIn ?? 0}
          loopSec={P.video.loopSec}
          fps={fps}
          style={{ position: 'absolute', left: 0, top: (1080 - P.video.h) / 2, width: P.video.w, height: P.video.h }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#E1DFE1' }} />
      )}
    </div>
  );

  const cards = p.cards ?? [];
  if (cards.length) {
    return (
      <>
        {panel}
        {cards.map((c, i) => {
          const next = cards[i + 1]?.t ?? t1;
          const isLast = i === cards.length - 1;
          return (
            <React.Fragment key={i}>
              {c.icon && <KtIconPop t0={c.t} t1={next} icon={c.icon} preset={c.iconPreset ?? (i % 2 === 0 ? 'panel-right' : 'panel-up')} motionBlur={motionBlur} />}
              <PaperCardText card={c} next={isLast ? null : next} t={t} fps={fps} p={p} />
            </React.Fragment>
          );
        })}
      </>
    );
  }

  // LABEL variant
  const L = KT_PANEL.label;
  const lines = p.lines ?? [];
  const tText = t0 + (p.labelDelay ?? L.delay);
  const fontSize = p.fontSize ?? Math.round(L.caps / CAP / 1.1);
  const lineHeight = p.linePitch ?? Math.round(L.pitch / 1.1);
  const fill = p.labelColor ?? p.accent ?? KT_2023.red;
  const block = (
    <KtTextBlock
      lines={lines}
      style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize, lineHeight, color: fill, stroke: [3, '#FFFFFF'], shadow: KT_2023.shadow }}
    />
  );
  const render = (ts: number) => {
    const d = ts - tText;
    const pm = pop110(d);
    const hv = hover(d - POP110_DUR, seed + t0);
    return (
      <At x={L.cx} y={L.cy} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      {panel}
      {p.icon && <KtIconPop t0={t0} t1={t1} icon={p.icon} preset={p.iconPreset ?? 'panel-right'} motionBlur={motionBlur} />}
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={fps} angle={360} samples={8} active={motionBlur && t - tText < POP110_DUR + 0.04} render={render} />}
    </>
  );
};

/** One Arial Black card text: the whip-in (scale table + lens + chromatic aberration about the (1714, 73) pivot), held
 * still, then slid out right ending on the next card's first frame. */
const PaperCardText: React.FC<{ card: KtPanelCard; next: number | null; t: number; fps: number; p: KtSidePanelProps }> = ({ card, next, t, fps, p }) => {
  const C = KT_PANEL.card;
  const ws = card.t - C.whipLead; // the whip starts 0.033 s before the card
  if (t < card.t) return null;
  if (next !== null && t >= next) return null;
  const dw = t - ws;
  const s = 2 - whipProgress(dw, C.whipDur);
  const k = -100 * (1 - interpolate(dw, [0, C.lensDur], [0, 1], CL));
  const ca = 1 - interpolate(dw, [0, C.caDur], [0, 1], CL);
  const outStart = next === null ? Infinity : next - C.outDur;
  const outX = (ts: number) => (ts < outStart ? 0 : C.outDist * easeSlideOut37(interpolate(ts, [outStart, outStart + C.outDur], [0, 1], CL)));
  const ox = outX(t);
  const sigmaOut = p.motionBlur === false || t < outStart ? 0 : streakSigma(shutterTravel(outX, t, outStart, 180, fps));

  const fontSize = Math.round(C.caps / CAP_ARIAL_BLACK);
  const blockIn = (color: string, shadow: string) => (
    <KtTextBlock
      lines={card.lines}
      style={{ font: p.cardFont ?? KT_2023.cardFont, fontWeight: 900, fontStyle: 'normal', fontSize, lineHeight: C.pitch, color, shadow, letterSpacing: '0' }}
    />
  );
  // the nested text frame: a 1920x1080 layer whose CENTRE sits on the pivot, the text at its on-screen rest place
  const nested = (color: string, shadow: string) => (
    <div style={{ position: 'absolute', left: C.pivot.x - 960, top: C.pivot.y - 540, width: 1920, height: 1080 }}>
      <div style={{ position: 'absolute', left: C.cx - (C.pivot.x - 960), top: C.cy - (C.pivot.y - 540), transform: 'translate(-50%, -50%)' }}>
        {blockIn(color, shadow)}
      </div>
    </div>
  );
  const ink = p.cardColor ?? KT_2023.cardColor;
  const whipping = dw < C.whipDur;
  let layer: React.ReactNode;
  if (whipping && ca > 0.01) {
    // subtractive RGB split of the dark text over the light paper: three plates printed in cyan / magenta / yellow
    // (each removes one channel), scaled +-2 percent per 80 units about the pivot, multiplied = black where they
    // overlap, colour fringes where they do not
    const a = 0.02 * ca;
    const plate = (c: string, sc: number) => (
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', transform: `scale(${sc})`, transformOrigin: `${C.pivot.x}px ${C.pivot.y}px` }}>
        {nested(c, `4px 5px 8px ${c}73`)}
      </div>
    );
    layer = (
      <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>
        {plate('#00FFFF', 1 + a)}
        {plate('#FF00FF', 1)}
        {plate('#FFFF00', 1 - a)}
      </div>
    );
  } else {
    layer = nested(ink, KT_2023.cardShadow);
  }
  // order: lens INSIDE the nested frame (centred on its centre = the pivot), then the whip scale about the pivot.
  // Premiere's model folds over across the text block at these curvatures (the block sits 0.6 to 1.6 half-heights from
  // the pivot): the 2023 frames show NO text until 0.20 s after the whip starts (75.233 -> first visible 75.433), then a
  // bent smear. The shared 8-bit displacement map cannot fold cleanly (it scatters the glyphs), so the fold is modelled:
  // hidden while |k| > KT_CARD_FOLD_K (45 = exactly 0.20 s on the linear decay), then the curvature scaled into the
  // fold-free range (x KT_CARD_LENS_GAIN) bends the lines as they settle. Documented approximation.
  if (whipping && p.lens !== false && -k > KT_CARD_FOLD_K) return null;
  const lensed = p.lens === false || !whipping ? layer : <KtLensAt k={k * KT_CARD_LENS_GAIN}>{layer}</KtLensAt>;
  return (
    <DirBlur sx={sigmaOut} sy={0}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${ox}px)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: `${C.pivot.x}px ${C.pivot.y}px` }}>{lensed}</div>
      </div>
    </DirBlur>
  );
};

/** the lens centred on the pivot (the nested frame's centre) */
const KtLensAt: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => {
  const C = KT_PANEL.card;
  return (
    <div style={{ position: 'absolute', left: C.pivot.x - 960, top: C.pivot.y - 540, width: 1920, height: 1080 }}>
      <KtLens k={k}>
        <div style={{ position: 'absolute', left: -(C.pivot.x - 960), top: -(C.pivot.y - 540), width: 1920, height: 1080 }}>{children}</div>
      </KtLens>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------------------

/** The COMP's picture move for a side panel (the frame_split / broll_reframe), at time t for a panel starting t0.
 * dark: x toward the free side (-80 px for a RIGHT panel, +80 for a LEFT one) and scale 1.00 -> 1.20 over 0.47 s, ease
 * (Premiere default ease); paper: LINEAR translate left, from 0.033 s after the panel, default -549 px over 0.267 s. */
export const ktSidePanelShift = (
  t: number,
  t0: number,
  o: { side?: 'L' | 'R'; texture?: 'dark' | 'paper'; px?: number; dur?: number } = {},
): { x: number; scale: number } => {
  const { side = 'R', texture = 'dark' } = o;
  if (texture === 'paper') {
    const S = KT_PANEL.shift.paper;
    const px = o.px ?? S.x;
    const dur = o.dur ?? S.dur;
    return { x: -px * interpolate(t - t0 - S.delay, [0, dur], [0, 1], CL), scale: 1 };
  }
  const S = KT_PANEL.shift.dark;
  const u = interpolate(t - t0, [0, o.dur ?? S.dur], [0, 1], { ...CL, easing: easePremiere });
  return { x: (side === 'R' ? -1 : 1) * (o.px ?? S.x) * u, scale: 1 + (S.scale - 1) * u };
};

/** kt-side-panel sounds. dark RIGHT: swoosh-1 starting 0.17 s BEFORE the panel moves; dark LEFT: swoosh-2 0.07 s before;
 * the text pop is silent. paper: whoosh-4 per entry (each card swap too), file start 0.267 s before with in-point 0.267. */
export const ktSidePanelSounds = (o: { t0: number; side?: 'L' | 'R'; texture?: 'dark' | 'paper'; cards?: { t: number }[] }): KtSoundCue[] => {
  const { t0, side = 'R', texture = 'dark' } = o;
  if (texture === 'paper') {
    const entries = o.cards && o.cards.length ? o.cards.map((c) => c.t) : [t0];
    return entries.map((e) => ({ id: 'whoosh-4', at: e - 0.267, trimIn: 0.267, note: 'paper panel / card entry: onset within -0.03..+0.04 s of the first frame' }));
  }
  return side === 'R'
    ? [{ id: 'swoosh-1', at: t0 - 0.17, note: 'RIGHT panel: starts 0.17 s before the panel moves' }]
    : [{ id: 'swoosh-2', at: t0 - 0.07, note: 'LEFT panel: starts 0.07 s before the panel moves' }];
};
