// AIVsMLVerticalKit.tsx: the PORTRAIT (1080x1920) builds of the AI vs ML devices whose 16:9 versions hard-code the 1920x1080
// frame (AIVsMLKit.tsx, the shared KtSidePanel / HwAlphaPlate geometry). Same library rows, same motion numbers (durations,
// eases, travel as a fraction of the frame, shutters, hover); only the frame size and the layout move for the portrait frame
// (vertical-repurpose.md section 2: containers restack, they do not shrink). Shared engine parts are IMPORTED from
// ./effects/kinetic-text; the project's own helpers from ./AIVsMLKit. Nothing here is copied from another project's comp.
import React from 'react';
import { Easing, Freeze, Img, OffthreadVideo, interpolate, staticFile } from 'remotion';
import {
  At,
  CL,
  DirBlur,
  ELASTIC,
  KT_2023,
  KtLine,
  KtTextBlock,
  POP110_DUR,
  RISE,
  ShutterBlur,
  easeInfluence325,
  easeOut,
  easePremiere,
  elastic,
  hasKeys,
  hover,
  parseMarkup,
  pop110,
  riseIn,
  shutterTravel,
  streakSigma,
  useKtFps,
  useKtTime,
} from './effects/kinetic-text';
import { HwAlphaPlate } from './effects/halloween-2022';
import { AI_YELLOW, CaptionPhrase, MONT, SparkleBurst, pushX, useAbsFrame, wobble } from './AIVsMLKit';

export const VW = 1080;
export const VH = 1920;
export const VFULL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: VW, height: VH };

// ---------------------------------------------------------------------------------------------------------------------
// kt-push-slide in portrait: the same 0.100 s / 0.067 s slides, the travel kept as the row's fraction of the frame WIDTH
// ---------------------------------------------------------------------------------------------------------------------
export const PUSH_V = {
  inLeft: { from: -0.847 * VW, to: 0, dur: 0.1 },
  inRight: { from: 0.875 * VW, to: 0, dur: 0.067 },
  outLeft: { from: 0, to: -1.028 * VW, dur: 0.1 },
};
export const PushSlideV: React.FC<{ t0: number; from: number; to: number; dur: number; children: React.ReactNode }> = ({ t0, from, to, dur, children }) => {
  const t = useKtTime();
  const fps = useKtFps();
  const pos = (ts: number) => pushX(ts, t0, from, to, dur);
  const x = pos(t);
  const moving = t >= t0 && t < t0 + dur + 1 / fps;
  const sigma = moving ? streakSigma(shutterTravel(pos, t, t0, 360, fps)) : 0;
  return (
    <DirBlur sx={Math.min(sigma, 180)} sy={0}>
      <div style={{ ...VFULL, transform: `translateX(${x}px)` }}>{children}</div>
    </DirBlur>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// MIRROR TILES / kt-grid-zoom-in / kt-shake-cut / kt-spin-cut at the portrait frame (the 16:9 numbers, VW x VH tiles)
// ---------------------------------------------------------------------------------------------------------------------
export const MirrorTilesV: React.FC<{ rx: number; ry: number; render: () => React.ReactNode }> = ({ rx, ry, render }) => {
  const tiles: React.ReactNode[] = [];
  for (let j = -ry; j <= ry; j++)
    for (let i = -rx; i <= rx; i++) {
      const fx = Math.abs(i) % 2 === 1 ? -1 : 1;
      const fy = Math.abs(j) % 2 === 1 ? -1 : 1;
      tiles.push(
        <div key={`${i}_${j}`} style={{ ...VFULL, transform: `translate(${i * VW}px, ${j * VH}px) scale(${fx}, ${fy})` }}>
          {render()}
        </div>,
      );
    }
  return <div style={{ ...VFULL }}>{tiles}</div>;
};

export const GRID_OPEN_V = { dur: 0.483, s0: 0.334, skew0: 10 };
const gridEase = Easing.bezier(0, 0, 0, 1);
export const GridZoomInV: React.FC<{ t: number; render: () => React.ReactNode }> = ({ t, render }) => {
  const u = gridEase(interpolate(t, [0, GRID_OPEN_V.dur], [0, 1], CL));
  const s = GRID_OPEN_V.s0 + (1 - GRID_OPEN_V.s0) * u;
  const skew = GRID_OPEN_V.skew0 * (1 - u);
  const rx = Math.min(3, Math.ceil(0.5 / s + Math.tan((skew * Math.PI) / 180) * (VH / VW) * (0.5 / s) - 0.5) + 1);
  const ry = Math.min(2, Math.ceil(0.5 / s - 0.5));
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <div style={{ ...VFULL, transformOrigin: '50% 50%', transform: `scale(${s}) skewX(${skew}deg)` }}>
        <MirrorTilesV rx={Math.max(1, rx)} ry={Math.max(1, ry)} render={render} />
      </div>
    </div>
  );
};

const SHAKE_T = [0, 0.027, 0.053, 0.08, 0.107, 0.133, 0.16, 0.187, 0.213, 0.24, 0.267];
const SHAKE_X = [0.37, 0.51, 0.457, 0.526, 0.493, 0.51, 0.501, 0.498, 0.501, 0.5, 0.5];
const SHAKE_Y = [0.736, 0.575, 0.429, 0.546, 0.525, 0.488, 0.506, 0.497, 0.501, 0.5, 0.5];
export const SHAKE_DUR_V = 0.267;
const shakePos = (dt: number) => ({
  x: (interpolate(dt, SHAKE_T, SHAKE_X, CL) - 0.5) * VW,
  y: (interpolate(dt, SHAKE_T, SHAKE_Y, CL) - 0.5) * VH,
});
export const ShakeCutV: React.FC<{ t0: number; render: () => React.ReactNode }> = ({ t0, render }) => {
  const t = useKtTime();
  const dt = t - t0;
  const p = shakePos(dt);
  const q = shakePos(Math.max(0, dt - 1 / 60));
  const len = interpolate(dt, [0, SHAKE_DUR_V], [7.5, 1.5], CL);
  const vx = p.x - q.x;
  const vy = p.y - q.y;
  const vn = Math.hypot(vx, vy) || 1;
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <DirBlur sx={(len * Math.abs(vx)) / vn / 2} sy={(len * Math.abs(vy)) / vn / 2}>
        <div style={{ ...VFULL, transform: `translate(${p.x}px, ${p.y}px)` }}>
          <MirrorTilesV rx={1} ry={1} render={render} />
        </div>
      </DirBlur>
    </div>
  );
};

export const SPIN_CUT_V = { pre: 0.1, post: 0.167, shutter: 260, samples: 6 };
const spinEase = Easing.inOut(Easing.quad);
const spinAngle = (ts: number, cut: number) => 360 * spinEase(interpolate(ts, [cut - SPIN_CUT_V.pre, cut + SPIN_CUT_V.post], [0, 1], CL));
export const SpinCutV: React.FC<{ cut: number; cutFrame: number; outStills: string[]; inStills: string[] }> = ({ cut, cutFrame, outStills, inStills }) => {
  const f = useAbsFrame();
  const fps = useKtFps();
  const t = f / fps;
  const k = f - cutFrame;
  const src = k < 0 ? outStills[Math.max(0, outStills.length + k)] : inStills[Math.min(inStills.length - 1, k)];
  const span = SPIN_CUT_V.shutter / 360 / fps;
  const n = SPIN_CUT_V.samples;
  const times = Array.from({ length: n }, (_, i) => t + (i / (n - 1) - 0.5) * span);
  return (
    <div style={{ ...VFULL, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {times.map((ts, i) => (
        <div key={i} style={{ ...VFULL, opacity: 1 / (i + 1), background: 'black', transformOrigin: '50% 50%', transform: `rotate(${spinAngle(ts, cut)}deg)` }}>
          <MirrorTilesV rx={1} ry={1} render={() => <Img src={staticFile(src)} style={{ ...VFULL, objectFit: 'cover' }} />} />
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-caption-highlight, PORTRAIT: the same running line (Montserrat ExtraBold Italic caps, white + *key* words yellow, the
// dark drop shadow, HARD CUT on each phrase's first word, held, never animated out), restyled for the 1080 frame: block
// centred at (540, CAPTION_V.y), 66 px, max 960 px wide; a phrase that does not fit on one line WRAPS to two balanced lines
// (key words stay key word by word) instead of shrinking below phone size.
// ---------------------------------------------------------------------------------------------------------------------
export const CAPTION_V = { y: 1530, fontSize: 66, maxW: 960, em: 0.74 };

const capStyleV = (fontSize: number): React.CSSProperties => ({
  fontFamily: MONT,
  fontWeight: 800,
  fontStyle: 'italic',
  fontSize,
  lineHeight: `${Math.round(fontSize * 1.08)}px`,
  textTransform: 'uppercase',
  letterSpacing: '0.005em',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  textShadow: KT_2023.shadow,
});

/** words with their key flag ('*AI ENGINEERING* JOURNEY' -> AI*, ENGINEERING*, JOURNEY) */
const markedWords = (line: KtLine) =>
  parseMarkup(line).flatMap((p) =>
    p.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, key: p.key })),
  );
const joinWords = (ws: { w: string; key: boolean }[]) => ws.map((x) => (x.key ? `*${x.w}*` : x.w)).join(' ');
/** one line if it fits at the base size, else the most balanced two-line break */
export const wrapCaption = (line: KtLine, fontSize = CAPTION_V.fontSize, maxW = CAPTION_V.maxW): KtLine[] => {
  const ws = markedWords(line);
  const len = (a: { w: string }[]) => a.map((x) => x.w).join(' ').length;
  if (len(ws) * CAPTION_V.em * fontSize <= maxW || ws.length < 2) return [line];
  let best = 1;
  let bestD = Infinity;
  for (let i = 1; i < ws.length; i++) {
    const d = Math.abs(len(ws.slice(0, i)) - len(ws.slice(i)));
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return [joinWords(ws.slice(0, best)), joinWords(ws.slice(best))];
};

/** one text line with *key* markup; the word named by `spark` carries the burst at its top-right */
export const MarkedLineV: React.FC<{ line: KtLine; color: string; keyColor: string; spark?: { word: string; dt: number } }> = ({ line, color, keyColor, spark }) => (
  <>
    {parseMarkup(line).map((p, i) => {
      if (!spark || !p.text.includes(spark.word))
        return (
          <span key={i} style={{ color: p.key ? keyColor : color }}>
            {p.text}
          </span>
        );
      const at = p.text.indexOf(spark.word);
      return (
        <span key={i} style={{ color: p.key ? keyColor : color }}>
          {p.text.slice(0, at)}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {spark.word}
            <span style={{ position: 'absolute', right: -6, top: '22%', width: 0, height: 0 }}>
              <SparkleBurst dt={spark.dt} />
            </span>
          </span>
          {p.text.slice(at + spark.word.length)}
        </span>
      );
    })}
  </>
);

export const CaptionLineV: React.FC<{ phrases: CaptionPhrase[]; spans: [number, number][] }> = ({ phrases, spans }) => {
  const t = useKtTime();
  const span = spans.find(([a, b]) => t >= a && t < b);
  if (!span) return null;
  let cur: CaptionPhrase | null = null;
  for (const p of phrases) if (p.t <= t && p.t < span[1] && p.t >= span[0] - 0.2) cur = p;
  if (!cur) return null;
  const lines = wrapCaption(cur.text);
  const longest = Math.max(...lines.map((l) => l.replace(/\*/g, '').length));
  const fs = Math.min(CAPTION_V.fontSize, Math.floor(CAPTION_V.maxW / (longest * CAPTION_V.em)));
  const spark = cur.spark ? { word: cur.spark.word, dt: t - cur.spark.t } : undefined;
  return (
    <div style={{ position: 'absolute', left: VW / 2, top: CAPTION_V.y, transform: 'translate(-50%, -50%)', width: 'max-content', ...capStyleV(fs) }}>
      {lines.map((l, i) => (
        <div key={i}>
          <MarkedLineV line={l} color={KT_2023.white} keyColor={AI_YELLOW} spark={spark} />
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// HEADLINE POP (kt-headline-over-broll text: the 110 pop + jiggle, 360-degree shutter, still to the cut), portrait: the
// framing line may wrap to several short lines so it stays readable at phone size
// ---------------------------------------------------------------------------------------------------------------------
export const HeadlinePopV: React.FC<{
  t0: number;
  t1: number;
  lines: KtLine[];
  x?: number;
  y: number;
  fontSize: number;
  pitch?: number;
  framing?: string[];
  framingSize?: number;
  uppercase?: boolean;
}> = ({ t0, t1, lines, x = VW / 2, y, fontSize, pitch, framing, framingSize = 27, uppercase = true }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const block = (
    <div style={{ textAlign: 'center' }}>
      <KtTextBlock lines={lines} style={{ fontSize, lineHeight: pitch ?? fontSize, color: KT_2023.white, keyColor: AI_YELLOW, shadow: KT_2023.shadow, uppercase }} />
      {framing && (
        <div
          style={{
            marginTop: 20,
            fontFamily: MONT,
            fontWeight: 700,
            fontSize: framingSize,
            lineHeight: `${Math.round(framingSize * 1.35)}px`,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.94)',
            textShadow: '2px 3px 6px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.55)',
            whiteSpace: 'nowrap',
          }}
        >
          {framing.map((f, i) => (
            <div key={i}>{f}</div>
          ))}
        </div>
      )}
    </div>
  );
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={x} y={y} s={pm.s} rot={pm.rot}>
        {block}
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** kt-keyword-pop with the sparkle anchor (the 110 pop + jiggle, 360-degree shutter), portrait: the size is a parameter so a
 * long word ('AI ENGINEERING') stays inside the 1080 frame */
export const KeywordPopSparkV: React.FC<{ t0: number; t1: number; text: string; color: string; x?: number; y: number; fontSize: number; spark?: { word: string; t: number } }> = ({
  t0,
  t1,
  text,
  color,
  x = VW / 2,
  y,
  fontSize,
  spark,
}) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const render = (ts: number, withSpark: boolean) => {
    const pm = pop110(ts - t0);
    return (
      <At x={x} y={y} s={pm.s} rot={pm.rot}>
        <div style={{ ...capStyleV(fontSize), lineHeight: `${Math.round(fontSize * 0.96)}px` }}>
          <MarkedLineV line={text} color={color} keyColor={color} spark={withSpark && spark ? { word: spark.word, dt: t - spark.t } : undefined} />
        </div>
      </At>
    );
  };
  if (t - t0 < POP110_DUR + 0.04) return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} render={(ts) => render(ts, false)} />;
  return <>{render(t, true)}</>;
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-side-panel 'dark', PORTRAIT: the row's panel (the animated texture used raw at 2575x1448, slides in from fully off-screen
// on ITS side to flush in 0.50 s ease-out; the text rises 0.23 s later, 338 px over 0.33 s, 80 -> 110 -> 100, 360-degree
// shutter, then the hover) with its rest rect turned for the portrait frame: the BOTTOM 45 percent of the height, full width
// (a 45-percent-of-1080 side strip cannot hold a readable line). R panels slide in from the right, L panels from the left,
// so the alternation still reads. The picture move (frame_split) goes toward the free side = UP: panelShiftV.
// ---------------------------------------------------------------------------------------------------------------------
export const PANEL_V = { top: Math.round(VH * 0.55), slide: 0.5, textDelay: 0.23, tex: { w: 2575, h: 1448, loopSec: 60 }, shift: { y: 160, scale: 1.2, dur: 0.47 } };
export const PANEL_V_CY = PANEL_V.top + (VH - PANEL_V.top) / 2 - 90; // the text centre (kept above the ~1680 phone-UI band)

const TextureAt: React.FC<{ src: string; sec: number; fps: number; style: React.CSSProperties }> = ({ src, sec, fps, style }) => (
  <Freeze frame={Math.floor(sec * fps)}>
    <OffthreadVideo src={src} muted style={style} />
  </Freeze>
);

export const PanelV: React.FC<{
  t0: number;
  t1: number;
  side: 'L' | 'R';
  textureSrc: string;
  textureIn?: number;
  lines?: KtLine[];
  accent?: string;
  fontSize?: number;
  linePitch?: number;
}> = ({ t0, t1, side, textureSrc, textureIn = 0, lines = [], accent = KT_2023.yellow, fontSize = 82, linePitch = 94 }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const slide = interpolate(dt, [0, PANEL_V.slide], [1, 0], { ...CL, easing: easeOut });
  const off = (side === 'R' ? 1 : -1) * VW * slide;
  const h = VH - PANEL_V.top;
  const sec = (textureIn + Math.max(0, dt)) % PANEL_V.tex.loopSec;
  const tText = t0 + PANEL_V.textDelay;
  const keyed = hasKeys(lines);
  const block = (
    <KtTextBlock lines={lines} maxWidth={VW - 110} style={{ fontSize, lineHeight: linePitch, color: keyed ? KT_2023.white : accent, keyColor: accent, shadow: KT_2023.shadow }} />
  );
  const render = (ts: number) => {
    const tr = ts - tText;
    const r = riseIn(tr);
    const hv = hover(tr - RISE.dur, t0);
    return (
      <At x={VW / 2} y={PANEL_V_CY} dx={hv.x} dy={r.y + hv.y} s={r.s} rot={hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', left: off, top: PANEL_V.top, width: VW, height: h, overflow: 'hidden' }}>
        <TextureAt
          src={textureSrc}
          sec={sec}
          fps={fps}
          style={{ position: 'absolute', left: (VW - PANEL_V.tex.w) / 2 + (side === 'R' ? 180 : -180), top: (h - PANEL_V.tex.h) / 2, width: PANEL_V.tex.w, height: PANEL_V.tex.h }}
        />
        <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: 6, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0))' }} />
      </div>
      {lines.length > 0 && t >= tText && <ShutterBlur t={t} t0={tText} fps={fps} angle={360} samples={24} active={t - tText < RISE.dur + 0.04} render={render} />}
    </>
  );
};
/** the b-roll's frame_split in portrait: toward the free side (UP) and 1.00 -> 1.20 over 0.47 s, the Premiere ease */
export const panelShiftV = (t: number, t0: number) => {
  const u = interpolate(t - t0, [0, PANEL_V.shift.dur], [0, 1], { ...CL, easing: easePremiere });
  return { y: -PANEL_V.shift.y * u, scale: 1 + (PANEL_V.shift.scale - 1) * u };
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-lower-third-band verdict_pop, PORTRAIT: the dark-teal texture band slides UP in 0.267 s (influence 32.5 -> 100) to its
// top edge (BAND_V.top, clear of the receipts' proof lines), the questions slide in from the LEFT (-0.847 of the width ->
// rest) over 0.262 s and hover, the verdicts do the 110 pop ON their word and hover; no exit (cut with the shot).
// ---------------------------------------------------------------------------------------------------------------------
export const BAND_V = { top: 1290, slide: 0.267, qSlide: 0.262, tex: { w: 2575, h: 1448, loopSec: 60 } };
export type BandItemV = { t: number; t1: number; kind: 'slide' | 'pop'; x?: number; y: number; node: React.ReactNode };
export const VerdictBandV: React.FC<{ t0: number; t1: number; textureSrc: string; textureIn?: number; items: BandItemV[]; seed?: number }> = ({
  t0,
  t1,
  textureSrc,
  textureIn = 0,
  items,
  seed = 0,
}) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const top = interpolate(dt, [0, BAND_V.slide], [VH, BAND_V.top], { ...CL, easing: easeInfluence325 });
  const sec = (textureIn + Math.max(0, dt)) % BAND_V.tex.loopSec;
  const qFrom = -0.847 * VW;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, width: VW, height: VH - BAND_V.top + 40, overflow: 'hidden' }}>
        <TextureAt src={textureSrc} sec={sec} fps={fps} style={{ position: 'absolute', left: (VW - BAND_V.tex.w) / 2, top: 0, width: BAND_V.tex.w, height: BAND_V.tex.h }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: 6, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0))' }} />
      </div>
      {items.map((it, i) => {
        if (t < it.t || t >= it.t1) return null;
        const hv = hover(t - it.t - 0.26, seed + i * 7 + it.t);
        const anchorX = it.x ?? VW / 2;
        if (it.kind === 'slide') {
          const pos = (ts: number) => qFrom * (1 - easeInfluence325(interpolate(ts - it.t, [0, BAND_V.qSlide], [0, 1], CL)));
          const x = pos(t);
          const sigma = t - it.t < BAND_V.qSlide + 0.04 ? streakSigma(shutterTravel(pos, t, it.t, 360, fps)) : 0;
          return (
            <DirBlur key={i} sx={Math.min(sigma, 120)} sy={0}>
              <div style={{ position: 'absolute', left: anchorX + x + hv.x, top: it.y + hv.y, transform: `translate(-50%, -50%) rotate(${hv.rot}deg)`, width: 'max-content' }}>
                {it.node}
              </div>
            </DirBlur>
          );
        }
        const render = (ts: number) => {
          const pm = pop110(ts - it.t);
          return (
            <div style={{ position: 'absolute', left: anchorX + hv.x, top: it.y + hv.y, transform: `translate(-50%, -50%) scale(${pm.s}) rotate(${pm.rot + hv.rot}deg)`, width: 'max-content' }}>
              {it.node}
            </div>
          );
        };
        return <ShutterBlur key={i} t={t} t0={it.t} fps={fps} angle={360} samples={8} active={t - it.t < POP110_DUR + 0.04} render={render} />;
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-versus-stack, PORTRAIT: the dark-teal Color Matte (79 percent, darken) slides DOWN in (0.683 of the frame height over
// 0.262 s, out 2.41 / 33 -> 0 / 100 ease), then each block slides DOWN in ON its words and hovers with the camera wobble
// ---------------------------------------------------------------------------------------------------------------------
export const VERSUS_V = { matte: '#2D4944', opacity: 0.79, slide: 0.262, travel: 0.683 * VH };
const versusEase = Easing.bezier(0.33, 0.8, 0, 1);
export type VersusLineV = { t: number; y: number; lines: KtLine[]; color: string; fontSize: number };
export const VersusStackV: React.FC<{ t0: number; t1: number; lines: VersusLineV[] }> = ({ t0, t1, lines }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const drop = (ts: number, start: number) => -VERSUS_V.travel * (1 - versusEase(interpolate(ts - start, [0, VERSUS_V.slide], [0, 1], CL)));
  return (
    <>
      <div style={{ ...VFULL, transform: `translateY(${drop(t, t0)}px)`, background: VERSUS_V.matte, opacity: VERSUS_V.opacity, mixBlendMode: 'darken' }} />
      {lines.map((ln, i) => {
        if (t < ln.t) return null;
        const pos = (ts: number) => drop(ts, ln.t);
        const y = pos(t);
        const sigma = t - ln.t < VERSUS_V.slide + 0.04 ? streakSigma(shutterTravel(pos, t, ln.t, 360, fps)) : 0;
        const wb = wobble(t - ln.t);
        return (
          <DirBlur key={i} sx={0} sy={Math.min(sigma, 120)}>
            <At x={VW / 2} y={ln.y} dx={wb.x} dy={y + wb.y} rot={wb.rot}>
              <KtTextBlock lines={ln.lines} style={{ fontSize: ln.fontSize, lineHeight: Math.round(ln.fontSize * 0.98), color: ln.color, shadow: KT_2023.shadow }} />
            </At>
          </DirBlur>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-boxed-words, PORTRAIT: the flat light-grey card (#BABABA, soft vignette) cut in SILENT; the two black rough boxes with
// yellow #FFFB23 caps, each whipping in from the upper left with a streak blur and settling by +0.6 s; the same rotations
// and shadow, the words stacked down the portrait frame and sized to stay inside it
// ---------------------------------------------------------------------------------------------------------------------
const boxEase = Easing.out(Easing.cubic);
const BOXED_V = { whip: 0.33, from: { x: -760, y: -430 }, fontSize: 168 };
const BoxWordV: React.FC<{ text: string; x: number; y: number; rx: number; ry: number; rz: number; t0: number; t: number; fps: number }> = ({ text, x, y, rx, ry, rz, t0, t, fps }) => {
  if (t < t0) return null;
  const pos = (ts: number) => boxEase(interpolate(ts - t0, [0, BOXED_V.whip], [0, 1], CL));
  const u = pos(t);
  const dx = BOXED_V.from.x * (1 - u);
  const dy = BOXED_V.from.y * (1 - u);
  const s = interpolate(t - t0, [0, BOXED_V.whip, 0.45, 0.6], [1.35, 0.97, 1.01, 1], CL);
  const prev = pos(Math.max(t0, t - 1 / fps));
  const travel = Math.hypot(BOXED_V.from.x, BOXED_V.from.y) * Math.abs(u - prev);
  const sig = Math.min(90, travel / 3);
  return (
    <DirBlur sx={sig * 0.87} sy={sig * 0.5}>
      <div style={{ position: 'absolute', left: x + dx, top: y + dy, transform: `translate(-50%, -50%) perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, width: 'max-content' }}>
        <div
          style={{
            background: '#0B0B0B',
            padding: '20px 40px 16px',
            filter: 'url(#aivsmlv-rough) drop-shadow(26px 15px 12px rgba(0,0,0,0.7))',
            fontFamily: MONT,
            fontWeight: 900,
            fontStyle: 'normal',
            fontSize: BOXED_V.fontSize,
            lineHeight: `${BOXED_V.fontSize}px`,
            color: '#FFFB23',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}
        >
          {text}
        </div>
      </div>
    </DirBlur>
  );
};
export const BoxedWordsCardV: React.FC<{ t0: number; t1: number; w1: { t: number; text: string }; w2: { t: number; text: string } }> = ({ t0, t1, w1, w2 }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: '#BABABA' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="aivsmlv-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div style={{ ...VFULL, background: 'radial-gradient(ellipse at 50% 48%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)' }} />
      <BoxWordV text={w1.text} x={560} y={780} rx={-11} ry={9} rz={1} t0={w1.t} t={t} fps={fps} />
      <BoxWordV text={w2.text} x={515} y={1110} rx={-8} ry={6} rz={-1} t0={w2.t} t={t} fps={fps} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// End-screen arrows, PORTRAIT: the same 'Zoom Bounce IN' pop; the sprites (assets/vertical/kt/end-screen-arrow-sN.png) were
// diffed off the portrait state PNGs (alpha = the state/base difference), the boxes below are their measured rects
// ---------------------------------------------------------------------------------------------------------------------
export const END_ARROW_BOX_V: Record<number, { x: number; y: number; w: number; h: number }> = {
  1: { x: 58, y: 485, w: 233, h: 183 },
  2: { x: 790, y: 799, w: 232, h: 183 },
  3: { x: 58, y: 1113, w: 233, h: 183 },
  4: { x: 790, y: 1427, w: 232, h: 183 },
};
export const EndScreenArrowV: React.FC<{ n: number; t0: number; base: string; sprite: string }> = ({ n, t0, base, sprite }) => {
  const t = useKtTime();
  const fps = useKtFps();
  const b = END_ARROW_BOX_V[n];
  const render = (ts: number) => {
    const e = elastic(ts - t0, ELASTIC.arrow.dur, ELASTIC.arrow.fade);
    return (
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: e.op, transform: `scale(${e.s})`, transformOrigin: '50% 50%' }}>
        <Img src={staticFile(sprite)} style={{ width: b.w, height: b.h }} />
      </div>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, overflow: 'hidden' }}>
        <Img src={staticFile(base)} style={{ position: 'absolute', left: -b.x, top: -b.y, width: VW, height: VH }} />
      </div>
      <ShutterBlur t={t} t0={t0} fps={fps} angle={180} samples={8} active={t - t0 < ELASTIC.arrow.dur + 0.04} render={render} />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-subscribe-close BAR, PORTRAIT: the plate's FILL + KEY pair (HwAlphaPlate, a 1920x1080 plate) hosted in a 1920x1080 box
// pinned to the TOP of the portrait frame (no transform / opacity / z-index on the box: the blend modes must still see the
// backdrop). The bar sits in the free headroom above Mike's head (centre y BAR_V.y), so the captions keep their place; it
// therefore enters from the top edge and leaves through it: the row's travel and eases (538 px over 0.262 s in, 796 px over
// 0.200 s out) mirrored to the top edge. Scale 0.90 (the bar ~856 x 164) for phone reading.
// ---------------------------------------------------------------------------------------------------------------------
export const BAR_V = { y: 335, scale: 0.9, barBelowPlate: 348 }; // the bar sits 348 plate-px below the plate centre (881 - 625 at 73.5 percent)
export const SubscribeBarV: React.FC<{ t0: number; tOut: number; fillSrc: string; keySrc: string }> = ({ t0, tOut, fillSrc, keySrc }) => {
  const t = useKtTime();
  if (t < t0 || t >= tOut + 0.2) return null;
  const rise = interpolate(t - t0, [0, 0.262], [538, 0], { ...CL, easing: Easing.bezier(0.19, 0.45, 0, 1) });
  const drop = interpolate(t - tOut, [0, 0.2], [0, 796], { ...CL, easing: Easing.in(Easing.cubic) });
  const cy = BAR_V.y - BAR_V.barBelowPlate * BAR_V.scale - rise - drop;
  return (
    <div style={{ position: 'absolute', left: (VW - 1920) / 2, top: 0, width: 1920, height: 1080 }}>
      <HwAlphaPlate fillSrc={fillSrc} keySrc={keySrc} sec={t - t0} cx={960} cy={cy} scale={BAR_V.scale} />
    </div>
  );
};

/** a down arrow after a band label (the stacked both-verdicts rows point DOWN at their verdict) */
export const DownArrow: React.FC<{ w?: number; color?: string }> = ({ w = 52, color = '#FFFFFF' }) => (
  <svg width={w * 0.5} height={w} viewBox="0 0 35 70" style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(3px 4px 4px rgba(0,0,0,0.55))' }}>
    <path d="M17.5 4 V 54 M 4 40 L 17.5 58 L 31 40" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
