// InferenceVerticalCharts.tsx: the PORTRAIT (1080x1920) code-built pieces of the `inference` vertical cut (comp-builder, VERTICAL
// mode, 2026-10-27). vertical-repurpose.md section 1: animated charts are RE-LAID for portrait in code (never letterboxed), code
// containers fill the 1080 width. Every component reads `t` = SOURCE-spine seconds handed in by the comp (its absolute clock),
// never a local Sequence frame, so it renders identically inside a library-transition engine window (comp-build section 6a).
//   - VQuantizationChart / VThinkingTokensChart: the two Type 1 ANIMATED charts, built to
//     assets/vertical/charts/<id>.vertical.spec.md (geometry) on the SAME cues as the 16:9 (QUANT_CUES / THINK_CUES).
//   - VC3ListCard: kt-list-card motion (0.50 s slide from the RIGHT, influence 32.5 ease, 360-degree shutter streak) carrying
//     the portrait C3 card; item 1 pops lit (110 jiggle + hover). Same numbers as the 16:9 C3ListCard, portrait geometry.
//   - VIncentiveSpot: 'right.' pops (110 jiggle) ON "right" on the portrait incentive card.
//   - VEngineNames: the white mixed-case engine-name lines under 'THE INFERENCE ENGINE', stacked for the 1080 width.
//   - VPaperPanel / VDarkPanel: kt-side-panel re-laid for portrait. In 9:16 the free side of a cover / of the face is the
//     BOTTOM, so the panel is a full-width bottom panel: paper = LINEAR slide in from the right over 0.233 s, label pop 0.167 s
//     later (110 + jiggle + hover), icon via the shared KtIconPop; dark = slides in from its side (the bottom) over 0.50 s
//     ease-out, text rises 0.23 s later (riseIn 80 -> 110 -> 100 + hover, 24-sample shutter). The row's numbers, portrait
//     geometry (the shared KtSidePanel is hard-wired to a 1920x1080 frame).
//   - KtStage: a virtual 1920x1080 stage (uniform scale + offset) so a shared engine whose geometry is 16:9-only
//     (kt-lower-third-band, kt-subscribe-close) runs VERBATIM, with its picture mapped into the portrait frame.
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, Easing } from 'remotion';
import {
  At,
  CL,
  DirBlur,
  KtIconPop,
  KtTextBlock,
  KT_2023,
  POP110_DUR,
  RISE,
  ShutterBlur,
  easeInfluence325,
  easeOut,
  hasKeys,
  hover,
  pop110,
  riseIn,
  shutterTravel,
  streakSigma,
} from './effects/kinetic-text';
import { ACCENT_LIGHT, DISPLAY_FONT, QUANT_CUES, THINK_CUES, C3_CUES } from './InferenceCharts';

export const VW = 1080;
export const VH = 1920;
const INK = '#14161A';
const MUTED = '#5E6676';
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** the portrait light stage (spec: the HTML's two orbs, gradient stand-in) */
const VLightStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 62% 34% at 94% 8%, rgba(124,196,232,0.42), rgba(124,196,232,0) 100%),' +
        'radial-gradient(ellipse 58% 24% at 6% 95%, rgba(195,205,221,0.55), rgba(195,205,221,0) 100%), #F3F1EC',
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);
const VEyebrow: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 64, top: 170, fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.18em', color: MUTED, whiteSpace: 'nowrap' }}>{text}</div>
);
const VTitle: React.FC<{ a: string; b: string; c?: string }> = ({ a, b, c = '.' }) => (
  <>
    <div style={{ position: 'absolute', left: 64, top: 231, fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 96, lineHeight: '100px', letterSpacing: '-0.025em', color: INK }}>
      <div>{a}</div>
      <div>
        <span style={{ color: ACCENT_LIGHT }}>{b}</span>
        {c}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 64, top: 465, width: 66, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#007A55,#006A9E)' }} />
  </>
);
const VSource: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 64, top: 1653, width: 952, fontFamily: MONO, fontSize: 23, lineHeight: 1.45, color: MUTED }}>{text}</div>
);

// --------------------------------------------------------------------------------------------------------------------
// quantization-memory, portrait: three COLUMNS growing UP from the baseline (charts/quantization-memory.vertical.spec.md).
// Lit = the 4-bit column only, exactly as the APPROVED 16:9 QuantizationChart (the spec's flag: the design states light 8-bit
// at -mid, the shipped 16:9 does not; the vertical matches the 16:9 FINAL).
const QV = { axisX: 190, base: 1440, top: 690, pxPerGB: 24, colW: 170 };
const QCOLS = [
  { label: '16-bit', sub: 'bfloat16', gb: 29.0, cx: 300, t: QUANT_CUES.t0 + 0.05, lit: false },
  { label: '8-bit', sub: '', gb: 15.2, cx: 545, t: QUANT_CUES.b8, lit: false },
  { label: '4-bit', sub: '', gb: 9.5, cx: 790, t: QUANT_CUES.b4, lit: true },
];
const GROW = 0.55;

export const VQuantizationChart: React.FC<{ t: number }> = ({ t }) => {
  const cardU = interpolate(t, [QUANT_CUES.card, QUANT_CUES.card + 0.35], [0, 1], { ...CL, easing: ease });
  return (
    <VLightStage>
      <VEyebrow text="LEVER 3 / 4 · QUANTIZATION" />
      <VTitle a="Fewer bits," b="less memory" />
      <div style={{ position: 'absolute', left: 64, top: 596, fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: '0.14em', color: MUTED }}>PEAK GPU MEMORY</div>
      {/* y axis + baseline */}
      <div style={{ position: 'absolute', left: QV.axisX - 1.25, top: QV.top, width: 2.5, height: QV.base - QV.top, background: '#7A808B' }} />
      <div style={{ position: 'absolute', left: QV.axisX, top: QV.base - 1.25, width: 1016 - QV.axisX, height: 2.5, background: '#7A808B' }} />
      {[0, 10, 20, 30].map((g) => {
        const y = QV.base - g * QV.pxPerGB;
        return (
          <React.Fragment key={g}>
            <div style={{ position: 'absolute', left: 178, top: y - 1.25, width: 12, height: 2.5, background: '#7A808B' }} />
            <div style={{ position: 'absolute', left: 64, top: y - 16, width: 102, textAlign: 'right', fontFamily: MONO, fontSize: 25, lineHeight: '32px', color: MUTED, whiteSpace: 'nowrap' }}>
              {g === 30 ? '30 GB' : String(g)}
            </div>
          </React.Fragment>
        );
      })}
      {QCOLS.map((c) => {
        const u = interpolate(t, [c.t, c.t + GROW], [0, 1], { ...CL, easing: ease });
        const shown = t >= c.t;
        const lit = c.lit && shown;
        const h = c.gb * QV.pxPerGB * u;
        const top = QV.base - h;
        const labelOp = interpolate(h, [96, 124], [0, 1], CL);
        const fg = lit ? '#FFFFFF' : INK;
        return (
          <React.Fragment key={c.label}>
            {shown && (
              <div
                style={{
                  position: 'absolute',
                  left: c.cx - QV.colW / 2,
                  top,
                  width: QV.colW,
                  height: Math.max(0, h),
                  borderRadius: '13px 13px 0 0',
                  background: lit ? 'linear-gradient(0deg, rgba(0,106,158,.80), #006A9E)' : '#B9B4A8',
                  boxShadow: lit ? '0 0 0 5px rgba(0,106,158,.14)' : 'none',
                }}
              />
            )}
            {shown && labelOp > 0 && (
              <div style={{ position: 'absolute', left: c.cx - QV.colW / 2, top: top + 16, width: QV.colW, textAlign: 'center', opacity: labelOp }}>
                <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 48, lineHeight: '52px', color: fg }}>{(c.gb * u).toFixed(1)}</div>
                <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, lineHeight: '30px', marginTop: 2, color: fg }}>GB</div>
              </div>
            )}
            <div style={{ position: 'absolute', left: c.cx - 110, top: 1460, width: 220, textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 46, lineHeight: 1.15, color: lit ? ACCENT_LIGHT : INK }}>{c.label}</div>
              {c.sub && <div style={{ fontFamily: SANS, fontSize: 24, color: MUTED, marginTop: 2 }}>{c.sub}</div>}
            </div>
          </React.Fragment>
        );
      })}
      {cardU > 0 && (
        <div
          style={{
            position: 'absolute',
            right: 64,
            top: 1128,
            padding: '10px 22px',
            borderRadius: 100,
            border: `2px solid ${ACCENT_LIGHT}`,
            background: 'rgba(0,106,158,.07)',
            boxShadow: '0 0 0 4px rgba(0,106,158,.10)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: cardU,
            transform: `scale(${0.85 + 0.15 * cardU})`,
            transformOrigin: '100% 50%',
          }}
        >
          <svg width="44" height="32" viewBox="0 0 40 28">
            <rect x="2" y="3" width="30" height="22" rx="5" fill="none" stroke={ACCENT_LIGHT} strokeWidth="3" />
            <rect x="8" y="9" width="14" height="10" rx="2" fill={ACCENT_LIGHT} />
            {[7, 12, 17, 22].map((y) => (
              <rect key={y} x="33" y={y - 1} width="5" height="2.4" fill={ACCENT_LIGHT} />
            ))}
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, color: ACCENT_LIGHT, whiteSpace: 'nowrap' }}>fits a smaller card</span>
        </div>
      )}
      <VSource text="Hugging Face, Optimizing LLMs for Speed and Memory: bigcode/octocoder, peak GPU memory · memory only" />
    </VLightStage>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// thinking-tokens, portrait: a 13-a-row grid, 9 rows (6 PROMPT + 105 THINKING + 6 ANSWER = 117 = 13 x 9), the answer closing
// the last row (charts/thinking-tokens.vertical.spec.md). Same stream timing as the 16:9.
const TB = { x0: 64, y0: 646, size: 62, pitch: 74, perRow: 13 };
const N_PROMPT = 6;
const N_THINK = 105;
const N_ANSWER = 6;
const STREAM_DUR = THINK_CUES.answer - THINK_CUES.think - 0.08;
const vBlock = (i: number) => ({ x: TB.x0 + (i % TB.perRow) * TB.pitch, y: TB.y0 + Math.floor(i / TB.perRow) * TB.pitch });

export const VThinkingTokensChart: React.FC<{ t: number }> = ({ t }) => {
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < N_PROMPT; i++) {
    const p = vBlock(i);
    blocks.push(<div key={`p${i}`} style={{ position: 'absolute', left: p.x, top: p.y, width: TB.size, height: TB.size, borderRadius: 11, border: `2.5px solid ${INK}`, background: '#FFFFFF', boxSizing: 'border-box' }} />);
  }
  for (let k = 0; k < N_THINK; k++) {
    const at = THINK_CUES.think + (k / N_THINK) * STREAM_DUR;
    if (t < at) break;
    const u = interpolate(t, [at, at + 0.12], [0, 1], { ...CL, easing: ease });
    const p = vBlock(N_PROMPT + k);
    blocks.push(<div key={`t${k}`} style={{ position: 'absolute', left: p.x, top: p.y, width: TB.size, height: TB.size, borderRadius: 11, background: '#CFCAC0', border: '2.5px solid #CFCAC0', boxSizing: 'border-box', opacity: u, transform: `scale(${0.6 + 0.4 * u})` }} />);
  }
  for (let k = 0; k < N_ANSWER; k++) {
    const at = THINK_CUES.answer + k * 0.05;
    if (t < at) break;
    const u = interpolate(t, [at, at + 0.14], [0, 1], { ...CL, easing: ease });
    const p = vBlock(N_PROMPT + N_THINK + k);
    blocks.push(<div key={`a${k}`} style={{ position: 'absolute', left: p.x, top: p.y, width: TB.size, height: TB.size, borderRadius: 11, background: ACCENT_LIGHT, border: `2.5px solid ${ACCENT_LIGHT}`, boxSizing: 'border-box', opacity: u, transform: `scale(${0.6 + 0.4 * u})` }} />);
  }
  const headU = interpolate(t, [THINK_CUES.answer, THINK_CUES.answer + 0.35], [0, 1], { ...CL, easing: ease });
  const label = (x: number, y: number, text: string, color: string, op = 1) => (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: '0.14em', color, opacity: op, whiteSpace: 'nowrap' }}>{text}</div>
  );
  return (
    <VLightStage>
      <VEyebrow text="THE 2026 TWIST" />
      <VTitle a="Reasoning models" b="think first" />
      {label(64, 604, 'PROMPT', MUTED)}
      {t >= THINK_CUES.think && label(508, 604, 'THINKING', MUTED)}
      {blocks}
      {t >= THINK_CUES.answer && label(582, 1312, 'ANSWER', ACCENT_LIGHT, headU)}
      {headU > 0 && (
        <div style={{ position: 'absolute', left: 64, top: 1378, opacity: headU, transform: `translateY(${(1 - headU) * 30}px)` }}>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 84, lineHeight: 1.05, letterSpacing: '0.01em', color: ACCENT_LIGHT, whiteSpace: 'nowrap' }}>THINKING TOKENS</div>
          <div style={{ fontFamily: SANS, fontSize: 36, color: '#4A5263', marginTop: 10, whiteSpace: 'nowrap' }}>extra tokens, before the answer</div>
        </div>
      )}
      <VSource text="Sources: OpenAI reasoning guide · Anthropic extended thinking docs · block counts illustrative" />
    </VLightStage>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// C3 list card, portrait. ITEM1 = the lit item-1 box on card-slides/C3.png (1080x1920), MEASURED from the PNG (its accent
// border runs x 125..954, y 803..973; 3 px margin). Travel = the 16:9 ratio (1714 / 1920) of the portrait width: the card
// enters from just off the right edge, exactly as the 16:9 card does.
const LIST_V = { slide: 0.5, travel: Math.round((1714 / 1920) * VW) };
const ITEM1_V = { x: 122, y: 800, w: 836, h: 177 };

export const VC3ListCard: React.FC<{ t: number; fps: number; underlay?: React.ReactNode }> = ({ t, fps, underlay }) => {
  const xAt = (ts: number) => LIST_V.travel * (1 - easeInfluence325(interpolate(ts - C3_CUES.t0, [0, LIST_V.slide], [0, 1], CL)));
  const dt = t - C3_CUES.t0;
  const off = xAt(t);
  const L = dt < LIST_V.slide ? shutterTravel(xAt, t, C3_CUES.t0, 360, fps) : 0;
  const src = staticFile('card-slides/C3.png');
  const crop = (filter?: string) => (
    <div style={{ width: ITEM1_V.w, height: ITEM1_V.h, overflow: 'hidden', position: 'relative', filter }}>
      <Img src={src} style={{ position: 'absolute', left: -ITEM1_V.x, top: -ITEM1_V.y, width: VW, height: VH }} />
    </div>
  );
  const lit = t >= C3_CUES.item1;
  const render = (ts: number) => {
    const d = ts - C3_CUES.item1;
    const pm = pop110(d);
    const hv = hover(d - POP110_DUR, 11);
    return (
      <At x={ITEM1_V.x + ITEM1_V.w / 2} y={ITEM1_V.y + ITEM1_V.h / 2} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {crop()}
      </At>
    );
  };
  return (
    <AbsoluteFill>
      {dt < LIST_V.slide + 0.04 && underlay}
      <DirBlur sx={streakSigma(L)} sy={0}>
        <div style={{ position: 'absolute', left: off, top: 0, width: VW, height: VH }}>
          <Img src={src} style={{ width: VW, height: VH }} />
          {!lit && <div style={{ position: 'absolute', left: ITEM1_V.x, top: ITEM1_V.y }}>{crop('grayscale(1) brightness(1.04)')}</div>}
        </div>
      </DirBlur>
      {lit && <ShutterBlur t={t} t0={C3_CUES.item1} fps={fps} angle={360} samples={8} active={t - C3_CUES.item1 < POP110_DUR + 0.04} render={render} />}
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// incentive-vs-engineering 'right.' spotlight, portrait (word box MEASURED on the portrait PNG: accent glyphs x 169..421,
// y 1266..1374, the period to x 445; margins as the 16:9 box).
const RIGHT_WORD_V = { x: 155, y: 1256, w: 305, h: 134 };
export const VIncentiveSpot: React.FC<{ t: number; t0: number; fps: number }> = ({ t, t0, fps }) => {
  if (t < t0) return null;
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={RIGHT_WORD_V.x + RIGHT_WORD_V.w / 2} y={RIGHT_WORD_V.y + RIGHT_WORD_V.h / 2} s={pm.s} rot={pm.rot}>
        <div style={{ width: RIGHT_WORD_V.w, height: RIGHT_WORD_V.h, overflow: 'hidden', position: 'relative', background: '#FDFDFD', borderRadius: 10 }}>
          <Img src={staticFile('card-slides/incentive-vs-engineering.png')} style={{ position: 'absolute', left: -RIGHT_WORD_V.x, top: -RIGHT_WORD_V.y, width: VW, height: VH }} />
        </div>
      </At>
    );
  };
  const glow = interpolate(t, [t0, t0 + 0.15, t0 + 0.6], [0, 1, 0.55], CL);
  return (
    <>
      <div style={{ position: 'absolute', left: RIGHT_WORD_V.x - 10, top: RIGHT_WORD_V.y + RIGHT_WORD_V.h - 8, width: (RIGHT_WORD_V.w - 30) * interpolate(t, [t0, t0 + 0.3], [0, 1], CL), height: 8, borderRadius: 4, background: ACCENT_LIGHT, opacity: glow }} />
      <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />
    </>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// the engine names under 'THE INFERENCE ENGINE', stacked into lines that fit the 1080 width (same 110 jiggle pop).
export const VEngineNames: React.FC<{ t: number; t0: number; t1: number; fps: number; lines: string[]; y: number; fontSize: number; linePitch: number; shadow: string }> = ({
  t,
  t0,
  t1,
  fps,
  lines,
  y,
  fontSize,
  linePitch,
  shadow,
}) => {
  if (t < t0 || t >= t1) return null;
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={VW / 2} y={y} s={pm.s} rot={pm.rot}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize, lineHeight: `${linePitch}px`, color: '#FFFFFF', whiteSpace: 'nowrap', textAlign: 'center', textShadow: shadow }}>
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

// --------------------------------------------------------------------------------------------------------------------
/** a texture / paper clip frame-locked to the device clock and looped (the shared engine's TextureVideo, which it does not export) */
const VTextureVideo: React.FC<{ src: string; t: number; t0: number; loopSec: number; fps: number; style: React.CSSProperties }> = ({ src, t, t0, loopSec, fps, style }) => {
  const sec = Math.max(0, t - t0) % loopSec;
  return (
    <Freeze frame={Math.floor(sec * fps)}>
      <OffthreadVideo src={src} muted style={style} />
    </Freeze>
  );
};

// kt-side-panel PAPER, portrait (row numbers: panel LINEAR 0.233 s from 68 px off the edge; label 0.167 s after the panel,
// the 110 pop + jiggle + hover, white 3 px stroke + drop shadow; icon = the shared KtIconPop with portrait coordinates).
export const V_PAPER = { slide: 0.233, enterOff: 68, labelDelay: 0.167, loopSec: 32.3, video: { w: 1978, h: 1112 } };
export type VIcon = { node: React.ReactNode; x: number; y: number; w: number; h: number; dir: 'from-right' | 'from-bottom'; travel: number };

export const VPaperPanel: React.FC<{
  t: number;
  t0: number;
  t1: number;
  fps: number;
  top: number;
  lines: string[];
  labelY: number;
  paperSrc: string;
  labelColor: string;
  fontSize: number;
  linePitch: number;
  font: string;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  icon?: VIcon;
  seed?: number;
}> = (p) => {
  const { t, t0, t1, fps, top, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const left = interpolate(dt, [0, V_PAPER.slide], [VW + V_PAPER.enterOff, 0], CL); // LINEAR
  const h = VH - top;
  const tText = t0 + V_PAPER.labelDelay;
  const block = (
    <KtTextBlock
      lines={p.lines}
      style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize: p.fontSize, lineHeight: p.linePitch, color: p.labelColor, stroke: [3, '#FFFFFF'], shadow: KT_2023.shadow }}
    />
  );
  const render = (ts: number) => {
    const d = ts - tText;
    const pm = pop110(d);
    const hv = hover(d - POP110_DUR, seed + t0);
    return (
      <At x={VW / 2} y={p.labelY} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', left, top, width: VW + 200, height: h + 40, overflow: 'hidden', boxShadow: '0 -10px 30px rgba(0,0,0,0.35)' }}>
        <VTextureVideo
          src={p.paperSrc}
          t={t}
          t0={t0}
          loopSec={V_PAPER.loopSec}
          fps={fps}
          style={{ position: 'absolute', left: 0, top: (h - V_PAPER.video.h) / 2, width: V_PAPER.video.w, height: V_PAPER.video.h }}
        />
      </div>
      {p.icon && <KtIconPop t0={t0} t1={t1} icon={p.icon.node} x={p.icon.x} y={p.icon.y} w={p.icon.w} h={p.icon.h} dir={p.icon.dir} travel={p.icon.travel} />}
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={fps} angle={360} samples={8} active={t - tText < POP110_DUR + 0.04} render={render} />}
    </>
  );
};

// kt-side-panel DARK, portrait (row numbers: panel in from its side over 0.50 s ease-out, text 0.23 s later rising 338 px with
// 80 -> 110 -> 100, the hover for the life of the panel, 24-sample shutter; texture = the animated-texture clip).
export const V_DARK = { slide: 0.5, textDelay: 0.23, loopSec: 60, tex: { w: 2575, h: 1448 } };
export const VDarkPanel: React.FC<{
  t: number;
  t0: number;
  t1: number;
  fps: number;
  top: number;
  lines: string[];
  textureSrc: string;
  accent: string;
  fontSize: number;
  linePitch: number;
  font: string;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  seed?: number;
}> = (p) => {
  const { t, t0, t1, fps, top, seed = 0 } = p;
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const h = VH - top;
  const slide = interpolate(dt, [0, V_DARK.slide], [1, 0], { ...CL, easing: easeOut });
  const tText = t0 + V_DARK.textDelay;
  const keyed = hasKeys(p.lines);
  const block = (
    <KtTextBlock
      lines={p.lines}
      maxWidth={VW - 110}
      style={{ font: p.font, fontWeight: p.fontWeight, fontStyle: p.fontStyle, fontSize: p.fontSize, lineHeight: p.linePitch, color: keyed ? KT_2023.white : p.accent, keyColor: p.accent, shadow: KT_2023.shadow }}
    />
  );
  const cy = top + h / 2;
  const render = (ts: number) => {
    const tr = ts - tText;
    const r = riseIn(tr);
    const hv = hover(tr - RISE.dur, seed + t0);
    return (
      <At x={VW / 2} y={cy} dx={hv.x} dy={r.y + hv.y} s={r.s} rot={hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: top + (h + 40) * slide, width: VW, height: h + 40, overflow: 'hidden' }}>
        <VTextureVideo src={p.textureSrc} t={t} t0={t0} loopSec={V_DARK.loopSec} fps={fps} style={{ position: 'absolute', left: (VW - V_DARK.tex.w) / 2, top: (h - V_DARK.tex.h) / 2, width: V_DARK.tex.w, height: V_DARK.tex.h }} />
      </div>
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={fps} angle={360} samples={24} active={t - tText < RISE.dur + 0.04} render={render} />}
    </>
  );
};

// --------------------------------------------------------------------------------------------------------------------
/** A virtual 1920x1080 stage mapped into the portrait frame: stage px (x, y) lands at (tx + k x, ty + k y). A shared engine
 * whose geometry is 16:9-only runs inside it verbatim (its numbers, its motion), only its picture is placed for portrait. */
export const KtStage: React.FC<{ k: number; tx: number; ty: number; children: React.ReactNode }> = ({ k, tx, ty, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>{children}</div>
);
/** the stage transform that lands stage point (sx, sy) on portrait point (px, py) at scale k */
export const stageAt = (k: number, sx: number, sy: number, px: number, py: number) => ({ k, tx: px - sx * k, ty: py - sy * k });
