// InferenceCharts.tsx: the project's own code-built pieces for the `inference` comp (comp-builder 2026-10-26).
//   - QuantizationChart / ThinkingTokensChart: the two Type 1 ANIMATED charts (comp-build §7, charts.md), REAL
//     time-driven components reproducing the design-spec states in assets/charts/*-start|mid|payoff.png (LIGHT theme).
//   - C3ListCard: kt-list-card motion (KtListCard row numbers: 0.50 s slide from the RIGHT, influence 32.5 -> 100 ease,
//     1714 px travel, 360-degree shutter streak) carrying the slide-built C3 card; item 1 pops lit (110 jiggle + hover).
//   - Flat SVG icons (TOKEN / CLOCK / CHIP / DOLLAR) for kt-icon-pop, house accent.
//   - EngineNamesLine: the white mixed-case second line of the 'THE INFERENCE ENGINE' headline (the shared headline
//     engine uppercases), same 110 jiggle pop.
// Every component is driven by `t` = SOURCE-spine seconds passed in by the comp (its absolute clock), never by a local
// Sequence frame, so it renders identically inside a library-transition engine window (comp-build §6a).
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, Easing } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { At, DirBlur, ShutterBlur, CL, POP110_DUR, easeInfluence325, hover, pop110, shutterTravel, streakSigma } from './effects/kinetic-text';

loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });

export const DISPLAY_FONT = "'Playfair Display', Georgia, serif"; // house display font (overlays.md section 2 house adaptation)
export const ACCENT = '#00c2ff'; // COVER-PLAN chapter_themes: one cyan for the whole video
export const ACCENT_LIGHT = '#006A9E'; // the cyan darkened on LIGHT containers (container-canonical-light.css)
const INK = '#14161A';
const MUTED = '#5E6676';
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** the light-theme stage the chart PNG states are drawn on */
const LightStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 34% 58% at 92% 16%, rgba(124,196,232,0.42), rgba(124,196,232,0) 100%),' +
        'radial-gradient(ellipse 32% 40% at 4% 98%, rgba(195,205,221,0.55), rgba(195,205,221,0) 100%), #F3F1EC',
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);

const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 140, top: 92, fontFamily: SANS, fontWeight: 600, fontSize: 27, letterSpacing: '0.2em', color: MUTED }}>{text}</div>
);
const Title: React.FC<{ a: string; b: string; c?: string }> = ({ a, b, c = '.' }) => (
  <>
    <div style={{ position: 'absolute', left: 138, top: 138, fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 84, letterSpacing: '-0.025em', color: INK, whiteSpace: 'nowrap' }}>
      {a}
      <span style={{ color: ACCENT_LIGHT }}>{b}</span>
      {c}
    </div>
    <div style={{ position: 'absolute', left: 140, top: 251, width: 66, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#007A55,#006A9E)' }} />
  </>
);
const Source: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 140, top: 1015, fontFamily: MONO, fontSize: 19, color: MUTED }}>{text}</div>
);

// --------------------------------------------------------------------------------------------------------------------
// quantization-memory (CH3 1:23.3 -> 1:28.6). Cues (EDIT-PLAN): start 83.3 (16-bit bar, 29.0 GB), 8-bit grows ON
// "8-bit" 83.98 (15.2 GB), 4-bit ON "4-bit" 85.48 (9.5 GB, lit), the smaller-card badge ON "smaller" 87.62.
// Values: DATA.md / Hugging Face octocoder peak GPU memory (memory only, NO speed multiplier).
export const QUANT_CUES = { t0: 83.3, b8: 83.98, b4: 85.48, card: 87.62 };
const AX = { x0: 420, pxPerGB: 40, yTop: 378, yAxis: 790 };
const BARS = [
  { label: '16-bit', sub: 'bfloat16', gb: 29.0, y: 404, t: QUANT_CUES.t0 + 0.05, lit: false },
  { label: '8-bit', sub: '', gb: 15.2, y: 538, t: QUANT_CUES.b8, lit: false },
  { label: '4-bit', sub: '', gb: 9.5, y: 672, t: QUANT_CUES.b4, lit: true },
];
const GROW = 0.55;

export const QuantizationChart: React.FC<{ t: number }> = ({ t }) => {
  const cardU = interpolate(t, [QUANT_CUES.card, QUANT_CUES.card + 0.35], [0, 1], { ...CL, easing: ease });
  return (
    <LightStage>
      <Eyebrow text="LEVER 3 / 4 · QUANTIZATION" />
      <Title a="Fewer bits, " b="less memory" />
      {/* axis */}
      <div style={{ position: 'absolute', left: AX.x0 - 1, top: AX.yTop, width: 2, height: AX.yAxis - AX.yTop, background: '#7A7F8A' }} />
      <div style={{ position: 'absolute', left: AX.x0, top: AX.yAxis - 1, width: 1200, height: 2, background: '#7A7F8A' }} />
      {[0, 10, 20, 30].map((g) => (
        <React.Fragment key={g}>
          <div style={{ position: 'absolute', left: AX.x0 + g * AX.pxPerGB - 1, top: AX.yAxis, width: 2, height: 10, background: '#7A7F8A' }} />
          <div style={{ position: 'absolute', left: AX.x0 + g * AX.pxPerGB - 8, top: AX.yAxis + 22, fontFamily: MONO, fontSize: 24, color: MUTED, whiteSpace: 'nowrap' }}>
            {g === 30 ? '30 GB' : String(g)}
          </div>
        </React.Fragment>
      ))}
      <div style={{ position: 'absolute', left: AX.x0, top: 860, fontFamily: SANS, fontWeight: 600, fontSize: 19, letterSpacing: '0.12em', color: MUTED }}>PEAK GPU MEMORY</div>
      {BARS.map((b) => {
        const u = interpolate(t, [b.t, b.t + GROW], [0, 1], { ...CL, easing: ease });
        const w = b.gb * AX.pxPerGB * u;
        const shown = t >= b.t;
        const lit = b.lit && shown;
        const val = (b.gb * u).toFixed(1);
        return (
          <React.Fragment key={b.label}>
            <div style={{ position: 'absolute', right: 1920 - 388, top: b.y + (b.sub ? 6 : 18), textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, lineHeight: '50px', color: lit ? ACCENT_LIGHT : INK }}>{b.label}</div>
              {b.sub && <div style={{ fontFamily: SANS, fontSize: 19, color: MUTED, marginTop: 4 }}>{b.sub}</div>}
            </div>
            {shown && (
              <div
                style={{
                  position: 'absolute',
                  left: AX.x0,
                  top: b.y,
                  width: Math.max(0, w),
                  height: 84,
                  borderRadius: '0 9px 9px 0',
                  background: lit ? 'linear-gradient(90deg, rgba(0,106,158,.80), #006A9E)' : '#B9B4A8',
                  boxShadow: lit ? '0 0 0 5px rgba(0,106,158,.15)' : 'none',
                }}
              />
            )}
            {shown && u > 0.05 && (
              <div style={{ position: 'absolute', left: AX.x0 + w + 22, top: b.y + 18, fontFamily: MONO, fontWeight: 500, fontSize: 40, lineHeight: '48px', color: lit ? ACCENT_LIGHT : INK, whiteSpace: 'nowrap', opacity: interpolate(u, [0.05, 0.3], [0, 1], CL) }}>
                {val} GB
              </div>
            )}
          </React.Fragment>
        );
      })}
      {cardU > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 1050,
            top: 684,
            height: 62,
            padding: '0 26px',
            borderRadius: 31,
            border: `3px solid ${ACCENT_LIGHT}`,
            background: 'rgba(0,106,158,.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: cardU,
            transform: `scale(${0.85 + 0.15 * cardU})`,
            transformOrigin: '0% 50%',
          }}
        >
          <svg width="40" height="28" viewBox="0 0 40 28">
            <rect x="2" y="3" width="30" height="22" rx="5" fill="none" stroke={ACCENT_LIGHT} strokeWidth="3" />
            <rect x="8" y="9" width="14" height="10" rx="2" fill={ACCENT_LIGHT} />
            {[7, 12, 17, 22].map((y) => (
              <rect key={y} x="33" y={y - 1} width="5" height="2.4" fill={ACCENT_LIGHT} />
            ))}
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: ACCENT_LIGHT, whiteSpace: 'nowrap' }}>fits a smaller card</span>
        </div>
      )}
      <Source text="Hugging Face, Optimizing LLMs for Speed and Memory: bigcode/octocoder, peak GPU memory · memory only" />
    </LightStage>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// thinking-tokens (CH5 2:30.1 -> 2:34.4). Cues: start 150.1 (PROMPT only), the grey THINKING stream ON "think" 150.76,
// the short ANSWER + THINKING TOKENS headline ON "extra" 153.46. Block counts illustrative (as the spec footer says).
export const THINK_CUES = { t0: 150.1, think: 150.76, answer: 153.46 };
const BLK = { x0: 140, y0: 430, pitchX: 52, pitchY: 64, size: 44, perRow: 31 };
const N_PROMPT = 6;
const N_THINK = 105;
const N_ANSWER = 6;
const STREAM_DUR = THINK_CUES.answer - THINK_CUES.think - 0.08;

const blockPos = (i: number) => ({ x: BLK.x0 + (i % BLK.perRow) * BLK.pitchX, y: BLK.y0 + Math.floor(i / BLK.perRow) * BLK.pitchY });

export const ThinkingTokensChart: React.FC<{ t: number }> = ({ t }) => {
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < N_PROMPT; i++) {
    const p = blockPos(i);
    blocks.push(
      <div key={`p${i}`} style={{ position: 'absolute', left: p.x, top: p.y, width: BLK.size, height: BLK.size, borderRadius: 9, border: `2.5px solid ${INK}`, background: '#FCFCFB', boxSizing: 'border-box' }} />,
    );
  }
  for (let k = 0; k < N_THINK; k++) {
    const at = THINK_CUES.think + (k / N_THINK) * STREAM_DUR;
    if (t < at) break;
    const u = interpolate(t, [at, at + 0.12], [0, 1], { ...CL, easing: ease });
    const p = blockPos(N_PROMPT + k);
    blocks.push(
      <div key={`t${k}`} style={{ position: 'absolute', left: p.x, top: p.y, width: BLK.size, height: BLK.size, borderRadius: 9, background: '#CDC8BD', opacity: u, transform: `scale(${0.6 + 0.4 * u})` }} />,
    );
  }
  for (let k = 0; k < N_ANSWER; k++) {
    const at = THINK_CUES.answer + k * 0.05;
    if (t < at) break;
    const u = interpolate(t, [at, at + 0.14], [0, 1], { ...CL, easing: ease });
    const p = blockPos(N_PROMPT + N_THINK + k);
    blocks.push(
      <div key={`a${k}`} style={{ position: 'absolute', left: p.x, top: p.y, width: BLK.size, height: BLK.size, borderRadius: 9, background: ACCENT_LIGHT, opacity: u, transform: `scale(${0.6 + 0.4 * u})` }} />,
    );
  }
  const ansP = blockPos(N_PROMPT + N_THINK);
  const headU = interpolate(t, [THINK_CUES.answer, THINK_CUES.answer + 0.35], [0, 1], { ...CL, easing: ease });
  const label = (x: number, y: number, text: string, color: string, op = 1) => (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: SANS, fontWeight: 600, fontSize: 19, letterSpacing: '0.14em', color, opacity: op }}>{text}</div>
  );
  return (
    <LightStage>
      <Eyebrow text="THE 2026 TWIST" />
      <Title a="Reasoning models " b="think first" />
      {label(140, 386, 'PROMPT', MUTED)}
      {t >= THINK_CUES.think && label(452, 386, 'THINKING', MUTED)}
      {blocks}
      {t >= THINK_CUES.answer && label(ansP.x, ansP.y + 58, 'ANSWER', ACCENT_LIGHT, headU)}
      {headU > 0 && (
        <div style={{ position: 'absolute', left: 140, top: 770, display: 'flex', alignItems: 'baseline', gap: 26, opacity: headU, transform: `translateY(${(1 - headU) * 30}px)` }}>
          <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 76, color: ACCENT_LIGHT, letterSpacing: '-0.01em' }}>THINKING TOKENS</span>
          <span style={{ fontFamily: SANS, fontSize: 31, color: '#4A5262' }}>extra tokens, before the answer</span>
        </div>
      )}
      <Source text="Sources: OpenAI reasoning guide · Anthropic extended thinking docs · block counts illustrative" />
    </LightStage>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// C3 list card (kt-list-card motion on the slide-built card PNG). t0 = the F4 face-out 70.267, item 1 ON "Continuous".
export const C3_CUES = { t0: 70.267, item1: 70.56 };
const LIST = { slide: 0.5, travel: 1714 };
const ITEM1 = { x: 224, y: 466, w: 726, h: 162 }; // the lit item-1 box on card-slides/C3.png (1920x1080 px)

export const C3ListCard: React.FC<{ t: number; fps: number; underlay?: React.ReactNode }> = ({ t, fps, underlay }) => {
  const xAt = (ts: number) => LIST.travel * (1 - easeInfluence325(interpolate(ts - C3_CUES.t0, [0, LIST.slide], [0, 1], CL)));
  const dt = t - C3_CUES.t0;
  const off = xAt(t);
  const L = dt < LIST.slide ? shutterTravel(xAt, t, C3_CUES.t0, 360, fps) : 0;
  const src = staticFile('card-slides/C3.png');
  const crop = (filter?: string) => (
    <div style={{ width: ITEM1.w, height: ITEM1.h, overflow: 'hidden', position: 'relative', filter }}>
      <Img src={src} style={{ position: 'absolute', left: -ITEM1.x, top: -ITEM1.y, width: 1920, height: 1080 }} />
    </div>
  );
  const lit = t >= C3_CUES.item1;
  const render = (ts: number) => {
    const d = ts - C3_CUES.item1;
    const pm = pop110(d);
    const hv = hover(d - POP110_DUR, 11);
    return (
      <At x={ITEM1.x + ITEM1.w / 2} y={ITEM1.y + ITEM1.h / 2} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {crop()}
      </At>
    );
  };
  return (
    <AbsoluteFill>
      {dt < LIST.slide + 0.04 && underlay}
      <DirBlur sx={streakSigma(L)} sy={0}>
        <div style={{ position: 'absolute', left: off, top: 0, width: 1920, height: 1080 }}>
          <Img src={src} style={{ width: 1920, height: 1080 }} />
          {!lit && <div style={{ position: 'absolute', left: ITEM1.x, top: ITEM1.y }}>{crop('grayscale(1) brightness(1.04)')}</div>}
        </div>
      </DirBlur>
      {lit && <ShutterBlur t={t} t0={C3_CUES.item1} fps={fps} angle={360} samples={8} active={t - C3_CUES.item1 < POP110_DUR + 0.04} render={render} />}
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// incentive-vs-engineering comp-level spotlight: 'right.' pops (110 jiggle) ON "right" 176.14 (card-slides PNG coords).
const RIGHT_WORD = { x: 1205, y: 640, w: 290, h: 130 };
export const IncentiveSpot: React.FC<{ t: number; t0: number; fps: number }> = ({ t, t0, fps }) => {
  if (t < t0) return null;
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={RIGHT_WORD.x + RIGHT_WORD.w / 2} y={RIGHT_WORD.y + RIGHT_WORD.h / 2} s={pm.s} rot={pm.rot}>
        <div style={{ width: RIGHT_WORD.w, height: RIGHT_WORD.h, overflow: 'hidden', position: 'relative', background: '#FDFDFD', borderRadius: 10 }}>
          <Img src={staticFile('card-slides/incentive-vs-engineering.png')} style={{ position: 'absolute', left: -RIGHT_WORD.x, top: -RIGHT_WORD.y, width: 1920, height: 1080 }} />
        </div>
      </At>
    );
  };
  const glow = interpolate(t, [t0, t0 + 0.15, t0 + 0.6], [0, 1, 0.55], CL);
  return (
    <>
      <div style={{ position: 'absolute', left: RIGHT_WORD.x - 10, top: RIGHT_WORD.y + RIGHT_WORD.h - 8, width: (RIGHT_WORD.w - 30) * interpolate(t, [t0, t0 + 0.3], [0, 1], CL), height: 8, borderRadius: 4, background: ACCENT_LIGHT, opacity: glow }} />
      <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />
    </>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// EngineNamesLine: the mixed-case white second line under 'THE INFERENCE ENGINE' (kt-headline-over-broll pop).
export const EngineNamesLine: React.FC<{ t: number; t0: number; t1: number; fps: number; text: string; y: number; fontSize: number; shadow: string }> = ({ t, t0, t1, fps, text, y, fontSize, shadow }) => {
  if (t < t0 || t >= t1) return null;
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={960} y={y} s={pm.s} rot={pm.rot}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize, color: '#FFFFFF', whiteSpace: 'nowrap', textShadow: shadow }}>{text}</div>
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

// --------------------------------------------------------------------------------------------------------------------
// Flat icons (the 2023 icon art did not survive; PROJECT-LOG 2026-10-25: this video renders its own flat SVG icons).
const ICON_STROKE = '#0B2A3A';
const IconFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible', filter: 'drop-shadow(5px 7px 8px rgba(0,0,0,0.35))' }}>
    {children}
  </svg>
);
export const IconToken: React.FC = () => (
  <IconFrame>
    <rect x="22" y="38" width="156" height="124" rx="26" fill={ACCENT} stroke={ICON_STROKE} strokeWidth="9" />
    <text x="100" y="122" textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize="58" fill={ICON_STROKE}>
      #ID
    </text>
  </IconFrame>
);
export const IconClock: React.FC = () => (
  <IconFrame>
    <circle cx="100" cy="104" r="78" fill={ACCENT} stroke={ICON_STROKE} strokeWidth="9" />
    <rect x="86" y="10" width="28" height="18" rx="5" fill={ICON_STROKE} />
    <line x1="100" y1="104" x2="100" y2="54" stroke={ICON_STROKE} strokeWidth="11" strokeLinecap="round" />
    <line x1="100" y1="104" x2="138" y2="122" stroke={ICON_STROKE} strokeWidth="11" strokeLinecap="round" />
    <circle cx="100" cy="104" r="9" fill={ICON_STROKE} />
  </IconFrame>
);
export const IconChip: React.FC = () => (
  <IconFrame>
    {[52, 82, 112, 142].map((p) => (
      <React.Fragment key={p}>
        <rect x={p - 6} y="10" width="12" height="28" rx="3" fill={ICON_STROKE} />
        <rect x={p - 6} y="162" width="12" height="28" rx="3" fill={ICON_STROKE} />
        <rect x="10" y={p - 6} width="28" height="12" rx="3" fill={ICON_STROKE} />
        <rect x="162" y={p - 6} width="28" height="12" rx="3" fill={ICON_STROKE} />
      </React.Fragment>
    ))}
    <rect x="34" y="34" width="132" height="132" rx="18" fill={ACCENT} stroke={ICON_STROKE} strokeWidth="9" />
    <rect x="68" y="68" width="64" height="64" rx="8" fill={ICON_STROKE} />
  </IconFrame>
);
export const IconDollar: React.FC = () => (
  <IconFrame>
    <circle cx="100" cy="100" r="82" fill={ACCENT} stroke={ICON_STROKE} strokeWidth="9" />
    <text x="100" y="138" textAnchor="middle" fontFamily={DISPLAY_FONT} fontWeight={900} fontSize="118" fill={ICON_STROKE}>
      $
    </text>
  </IconFrame>
);
