// LeftBehindShort.tsx: the ~31 s SHORT of left-behind (16:9-sourced mode: no full vertical).
// Built per longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B.
// Public dir = media/left-behind/_previews/short/work (span intermediates + variants/ + vertical-cards/).
// One MUTED OffthreadVideo per span-NN.mp4 laid end to end (never seeking into the master); the VO, CTA take and
// bed are mixed afterwards by mix_short.py, so this comp has NO audio.
import React from 'react';
import {
  AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './LeftBehindShortCaptions';

loadMontserrat('normal', { weights: ['900'] });
loadPlayfair('normal', { weights: ['900'] });

export const FPS = 30;
const SPANS_TOTAL = 28.033;         // spans.json spans_total_seconds
const OUTRO_S = 3.0;
export const DUR = Math.round((SPANS_TOTAL + OUTRO_S) * FPS); // round(31.033 * 30) = 931
const F = (t: number) => Math.round(t * FPS);

// spans.json (out_start / frames), verbatim
const SPANS = [
  { file: 'span-01.mp4', out_start: 0.0, frames: 540, sourced: 'FACE' },
  { file: 'span-02.mp4', out_start: 18.0, frames: 301, sourced: 'COVER' },
];
const SPAN_END = F(SPANS[SPANS.length - 1].out_start) + SPANS[SPANS.length - 1].frames; // 841
const SEAMS = SPANS.slice(1).map((s) => F(s.out_start));                                  // [540]

// THE OVERLAY (cover) LAYER, one table, SHORT seconds, time-ordered (lint_covers.py parses it):
//  kind 'receipt' = assets/short/vertical-cards.json `cards` (native 1080x1920 re-shot, copied to vertical-cards/):
//    hard in on the window start; held UNDER the variant that fades in at its window end until that fade completes,
//    so no frame of the cropped 16:9 asset shows mid-fade. The card's content band (y0..y1 of the PNG, cut on a blank
//    row) is fitted into the top CARD_BOX so the caption block (y ~1420-1600) never sits on card text; the rest of the
//    frame is the page's own paper colour.
//  kind 'vid' = assets/short/variants.json (copied to variants/): the video's Envato ingress, TRANSITIONS.md section 3
//    hand:fade (~0.5 s). 25 / 23.976 fps clips play frame-for-frame: playbackRate = 30 / fps. cap: true = captions run
//    over it (16:9-sourced mode: nothing is burned, CAPTION_WINDOWS cover every span).
type Cover = { tIn: number; tOut: number; kind: 'receipt' | 'vid'; ref: string; file: string; fps?: number; y0?: number; y1?: number; bg?: string; cap?: boolean; fadeIn?: number };
export const COVERS: Cover[] = [
  // C3 enters EARLY with a 4-frame fade: the 16:9 F1-out film burn starts cross-fading the DESKTOP C3 in at frame 245 (8.167 s),
  // 6 frames before its 8.367 window, so the native card must be fully opaque by frame 244 (final visual QA 2026-11-03)
  { tIn: 8.0, tOut: 14.58, kind: 'receipt', ref: 'C3', file: 'vertical-cards/C3-challenger-ai-paragraph-v.png', y0: 230, y1: 1680, bg: 'rgb(252,250,241)', cap: true, fadeIn: 4 },
  { tIn: 14.58, tOut: 18.0, kind: 'vid', ref: 'BR-1', file: 'variants/BR-1-fired-box-walk.mp4', fps: 25, cap: true },
  { tIn: 18.0, tOut: 25.26, kind: 'receipt', ref: 'C12', file: 'vertical-cards/C12-fortune-accenture-v.png', y0: 80, y1: 1535, bg: 'rgb(254,254,254)', cap: true },
  { tIn: 25.26, tOut: 28.02, kind: 'vid', ref: 'BR-2', file: 'variants/BR-2-night-office-floor.mp4', fps: 24000 / 1001, cap: true },
];
const VAR_FADE = 0.5;
const VARIANTS = COVERS.filter((c) => c.kind === 'vid');
const CARDS = COVERS.filter((c) => c.kind === 'receipt');
// vertical-cards.json `holds`: none for this short.
const CARD_BOX = { top: 110, bottom: 1360 };

// ── spans ────────────────────────────────────────────────────────────────────
const SpanVideo: React.FC<{ file: string }> = ({ file }) => (
  <OffthreadVideo src={staticFile(file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
);

// ── seam hit: the video's face pick hand:film-burn, compressed to ~0.3 s (warm radial flash + tiny zoom kick) ──
const SEAM_HALF = 5; // frames each side of the cut (~0.33 s total)
const FilmBurnHit: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < -SEAM_HALF || d > SEAM_HALF) return null;
  const o = interpolate(Math.abs(d), [0, SEAM_HALF], [1, 0], { easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: o * 0.85 }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,236,200,1) 0%, rgba(255,150,40,0.95) 35%, rgba(200,60,0,0.75) 70%, rgba(80,10,0,0.4) 100%)' }} />
    </AbsoluteFill>
  );
};
const seamZoom = (f: number) => {
  for (const s of SEAMS) {
    const d = f - s;
    if (d >= 0 && d <= SEAM_HALF + 2) return interpolate(d, [0, SEAM_HALF + 2], [1.06, 1], { easing: Easing.out(Easing.cubic) });
  }
  return 1;
};

// ── native-vertical card ────────────────────────────────────────────────────
const NativeCard: React.FC<{ c: Cover }> = ({ c }) => {
  const y0 = c.y0 ?? 0, y1 = c.y1 ?? 1920;
  const boxH = CARD_BOX.bottom - CARD_BOX.top;
  const s = Math.min(1, boxH / (y1 - y0));
  const w = 1080 * s;
  const h = (y1 - y0) * s;
  const f = useCurrentFrame(); // local to its Sequence
  const o = c.fadeIn ? interpolate(f, [0, c.fadeIn], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return (
    <AbsoluteFill style={{ background: c.bg, opacity: o }}>
      <div style={{ position: 'absolute', left: (1080 - w) / 2, top: CARD_BOX.top + (boxH - h) / 2, width: w, height: h, overflow: 'hidden' }}>
        <Img src={staticFile(c.file)} style={{ position: 'absolute', left: 0, top: -y0 * s, width: w, height: 1920 * s }} />
      </div>
    </AbsoluteFill>
  );
};

// ── variant overlay (fade in, hard out on the window end) ─────────────────────
const Variant: React.FC<{ v: Cover }> = ({ v }) => {
  const f = useCurrentFrame(); // local to its Sequence
  const o = interpolate(f, [0, F(VAR_FADE)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <OffthreadVideo src={staticFile(v.file)} muted playbackRate={30 / (v.fps ?? 30)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// ── captions (house Montserrat style, SAFE ZONE) ─────────────────────────────
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let idx = -1;
  for (let i = 0; i < ZCAPTIONS.length; i++) { if (ZCAPTIONS[i].t <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cur = ZCAPTIONS[idx];
  const nextT = idx + 1 < ZCAPTIONS.length ? ZCAPTIONS[idx + 1].t : Infinity;
  if (t >= Math.min(nextT, Math.max(cur.t + 1.3, cur.e))) return null;
  const lf = frame - Math.round(cur.t * FPS);
  const sc = interpolate(lf, [0, 4, 7], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320, pointerEvents: 'none' }}>
      <div style={{
        maxWidth: 860, textAlign: 'center', transform: `scale(${sc})`, transformOrigin: '50% 100%',
        fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 92, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
      }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ── outro: TITLE-SLIDE card in the locked container stylesheet (dark, Playfair, green accent word) ────────────
const OUTRO_IN = 9; // frames, fade + settle
const OutroCard: React.FC = () => {
  const f = useCurrentFrame(); // local
  const o = interpolate(f, [0, OUTRO_IN], [0, 1], { extrapolateRight: 'clamp' });
  const s = interpolate(f, [0, OUTRO_IN], [1.04, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bob = Math.sin(Math.max(0, f - OUTRO_IN) / 7) * 14;
  return (
    <AbsoluteFill style={{ opacity: o, background: '#0a0c10', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 760, height: 760, left: -220, top: 260, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.3, background: '#00e68a' }} />
      <div style={{ position: 'absolute', width: 700, height: 700, right: -240, bottom: 300, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.3, background: '#00c2ff' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${s})`, padding: '0 90px' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 150, lineHeight: 1.04, letterSpacing: '-0.02em', color: '#e8eaf0', textAlign: 'center' }}>
          WATCH THE<br /><span style={{ color: '#00e68a' }}>FULL</span> VIDEO
        </div>
        <div style={{ width: 110, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', margin: '48px 0 40px' }} />
        <svg width={150} height={190} viewBox="0 0 150 190" style={{ transform: `translateY(${bob}px)` }}>
          <path d="M75 10 V160 M18 104 L75 165 L132 104" fill="none" stroke="#00e68a" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LeftBehindShort: React.FC = () => {
  const frame = useCurrentFrame();
  const z = seamZoom(frame);
  const last = SPANS[SPANS.length - 1];
  const lastVar = VARIANTS[VARIANTS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        {/* spans, end to end */}
        {SPANS.map((s) => (
          <Sequence key={s.file} from={F(s.out_start)} durationInFrames={s.frames}>
            <SpanVideo file={s.file} />
          </Sequence>
        ))}
        {/* outro hold: the last span's final frame */}
        <Sequence from={SPAN_END} durationInFrames={DUR - SPAN_END}>
          <Freeze frame={last.frames - 1}><SpanVideo file={last.file} /></Freeze>
        </Sequence>

        {/* native-vertical cards (hard in; held under the next variant's fade) */}
        {CARDS.map((c) => {
          const v = VARIANTS.find((x) => Math.abs(x.tIn - c.tOut) < 0.02);
          const end = v ? F(c.tOut + VAR_FADE) : F(c.tOut);
          return (
            <Sequence key={c.ref} from={F(c.tIn)} durationInFrames={end - F(c.tIn)}>
              <NativeCard c={c} />
            </Sequence>
          );
        })}

        {/* variants (Envato fade in). The last one runs to the span end and freezes under the outro card. */}
        {VARIANTS.map((v) => {
          const to = v === lastVar ? SPAN_END : F(v.tOut);
          return (
            <Sequence key={v.ref} from={F(v.tIn)} durationInFrames={to - F(v.tIn)}>
              <Variant v={v} />
            </Sequence>
          );
        })}
        <Sequence from={SPAN_END} durationInFrames={DUR - SPAN_END}>
          <Freeze frame={SPAN_END - 1 - F(lastVar.tIn)}>
            <Variant v={lastVar} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>

      {SEAMS.map((s) => <FilmBurnHit key={s} at={s} />)}

      {/* outro card (CTA voice is mixed later) */}
      <Sequence from={SPAN_END} durationInFrames={DUR - SPAN_END}>
        <OutroCard />
      </Sequence>

      {/* captions: topmost, only inside CAPTION_WINDOWS */}
      <Captions />
    </AbsoluteFill>
  );
};
