// EveryJobShort.tsx: the ~30 s SHORT of longform-edited `every-job` (16:9-SOURCED MODE, longform-to-short.md §5 Stage B).
// 1080x1920 @30. Public dir = media/every-job/_previews/short/work (span intermediates + variants/), NEVER the master.
// The comp has NO audio: every video is muted; mix_short.py lays the crossfaded spine VO + the shared CTA take + a bed.
//
// Layers (bottom -> top):
//   1. SPANS        one muted OffthreadVideo per span-NN.mp4, end to end (spans.json out_start/frames), each played
//                   linearly from its own frame 0 (no seeking into a long file).
//   2. SEAM HITS    hand:seam-zoom-flash at every span join (~0.3 s): outgoing pushes 1 -> 1.05 over its last 3 frames,
//                   incoming lands 1.10 -> 1 over 9 frames under a short cool-white flash. The video's own face-edge
//                   family is lib:blocks-max (TRANSITIONS.md §3); a library engine over these clips would need
//                   pre-extracted cut frames, so the seam is the brief's hand-rolled flash/zoom instead.
//   3. VARIANTS     Mike's variety rule (assets/short/variants.json): each alternate Envato clip full-frame over its
//                   overlay_short window, with the SAME ingress the 16:9 used on that beat (hand:fade, BR-27 0.27 s,
//                   BR-7 0.5 s; the vertical was skipped in 16:9-sourced mode, so the 16:9 row is the reference).
//   4. OUTRO        the last span's final frame held (pre-extracted still) + a full-frame TITLE SLIDE "WATCH THE FULL VIDEO"
//                   (locked container stylesheet: dark, Playfair 900 headline, green accent word, gradient divider)
//                   with a downward arrow glyph; it slides in from the top (hand:slide-from-top, echoes the video's
//                   rmn:slide chapter-card pick).
//   5. CAPTIONS     TOPMOST, Montserrat house style, rendered ONLY inside CAPTION_WINDOWS (from-16x9 mode: nothing is
//                   burned in, so the windows cover every span; they never run into the outro card).
import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './EveryJobShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ---- span table: _previews/short/work/spans.json (frames are the verified intermediate frame counts) ----
type Span = { i: number; file: string; outStart: number; frames: number; role: string; sourced: 'FACE' | 'COVER' };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 308, role: 'hook', sourced: 'FACE' },
  { i: 2, file: 'span-02.mp4', outStart: 10.2667, frames: 88, role: 'body', sourced: 'FACE' },
  { i: 3, file: 'span-03.mp4', outStart: 13.2, frames: 127, role: 'body', sourced: 'COVER' },
  { i: 4, file: 'span-04.mp4', outStart: 17.4333, frames: 100, role: 'body', sourced: 'FACE' },
  { i: 5, file: 'span-05.mp4', outStart: 20.7667, frames: 180, role: 'kicker', sourced: 'COVER' },
];
// Frame-exact placement: each span starts where the previous one ends (cumulative frames == round(out_start * 30)).
const SPAN_FROM: number[] = SPANS.reduce<number[]>((acc, s, k) => [...acc, k === 0 ? 0 : acc[k - 1] + SPANS[k - 1].frames], []);
SPANS.forEach((s, k) => {
  if (SPAN_FROM[k] !== Math.round(s.outStart * FPS)) throw new Error(`span ${s.i}: cumulative frame ${SPAN_FROM[k]} != out_start ${s.outStart}`);
});
export const SPANS_END = SPAN_FROM[SPANS.length - 1] + SPANS[SPANS.length - 1].frames;   // 803 = 26.767 s
export const DUR = Math.round(30.0 * FPS);                                                 // 900 = 30.000 s
export const OUTRO_FROM = SPANS_END;
export const OUTRO_FRAMES = DUR - SPANS_END;                                               // 97 = 3.233 s
if (OUTRO_FRAMES < 90) throw new Error(`outro too short: ${OUTRO_FRAMES} frames`);

// ---- seam hit (hand:seam-zoom-flash) ----
const SEAM_IN = 9;    // incoming settle + flash, 0.3 s
const SEAM_OUT = 3;   // outgoing push-through
const SEAMS = SPAN_FROM.slice(1);   // 308, 396, 523, 623

const SpanClip: React.FC<{ s: Span; k: number }> = ({ s, k }) => {
  const f = useCurrentFrame();   // Sequence-relative
  const isFirst = k === 0;
  const isLast = k === SPANS.length - 1;
  const inScale = isFirst ? 1 : interpolate(f, [0, SEAM_IN], [1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const outScale = isLast ? 1 : interpolate(f, [s.frames - SEAM_OUT, s.frames - 1], [1, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${inScale * outScale})`, transformOrigin: '50% 42%' }}>
        <OffthreadVideo src={staticFile(s.file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SeamFlash: React.FC = () => {
  const f = useCurrentFrame();   // 0 = SEAM_OUT frames before the join
  const o = interpolate(f, [0, SEAM_OUT, SEAM_OUT + 6], [0, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: o,
      background: 'radial-gradient(ellipse at 50% 42%, rgba(235,250,255,1) 0%, rgba(150,225,255,0.85) 45%, rgba(0,194,255,0.35) 100%)',
      mixBlendMode: 'screen' }} />
  );
};

// ---- variant overlays (assets/short/variants.json, copied into the public dir under variants/) ----
// The COVERS table is the lint_covers.py view of the short's cover layer: SHORT seconds, one row per variant.
// cap: true = captions deliberately run over these covers (16:9-sourced mode burns nothing, the short is captioned end to end).
type Cover = { tIn: number; tOut: number; kind: 'vid'; ref: string; file: string; clipStart: number; fxd: number; cap: boolean };
export const COVERS: Cover[] = [
  { tIn: 13.365, tOut: 15.032, kind: 'vid', ref: 'BR-27-electrician-lighting-track', file: 'variants/BR-27-electrician-lighting-track.mp4', clipStart: 1.0, fxd: 0.27, cap: true },  // 16:9 BR-27 ingress hand:fade 0.27 s
  { tIn: 24.25, tOut: 26.69, kind: 'vid', ref: 'BR-7-dark-corridor-flythrough', file: 'variants/BR-7-dark-corridor-flythrough.mp4', clipStart: 1.0, fxd: 0.5, cap: true },      // 16:9 BR-7 ingress hand:fade 0.5 s
];
const F = (t: number) => Math.round(t * FPS);

const VariantEl: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame();
  const d = F(c.tOut) - F(c.tIn);
  const fx = Math.max(1, Math.round(c.fxd * FPS));
  const o = interpolate(f, [0, fx, d - fx, d], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* trimmed with ~1 s handles each side by envato-sourcer: play from the head handle, never stretched */}
      <OffthreadVideo src={staticFile(c.file)} muted startFrom={Math.round(c.clipStart * FPS)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// ---- outro: held last frame + TITLE SLIDE "WATCH THE FULL VIDEO" ----
const LAST = SPANS[SPANS.length - 1];
const LAST_STILL = LAST.file.replace('.mp4', '-last.png');   // span-05-last.png, frame LAST.frames - 1
const C = { bgDeep: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', text: '#e8eaf0' };   // locked container stylesheet tokens
const CARD_IN = 10;   // slide from top, 0.33 s; readable for the remaining ~2.9 s

const DownArrow: React.FC<{ f: number }> = ({ f }) => {
  const bob = Math.sin((f / FPS) * Math.PI * 2 * 1.1) * 14;
  const o = interpolate(f, [CARD_IN, CARD_IN + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <svg width={230} height={302} viewBox="0 0 190 250" style={{ opacity: o, transform: `translateY(${bob}px)`, filter: `drop-shadow(0 0 28px rgba(0,230,138,0.45))` }}>
      <defs>
        <linearGradient id="ejs-arrow" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="225">
          <stop offset="0%" stopColor={C.green} />
          <stop offset="100%" stopColor={C.cyan} />
        </linearGradient>
      </defs>
      <path d="M95 10 L95 205" stroke="url(#ejs-arrow)" strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d="M22 140 L95 225 L168 140" stroke="url(#ejs-arrow)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();   // 0 = OUTRO_FROM
  const y = interpolate(f, [0, CARD_IN], [-H, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const h1: React.CSSProperties = { fontFamily: `${PLAYFAIR}, 'Playfair Display', serif`, fontWeight: 900, fontSize: 168, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.text, margin: 0 };
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: C.bgDeep, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', filter: 'blur(140px)', opacity: 0.3, background: C.green, left: -380, top: 180 }} />
        <div style={{ position: 'absolute', width: 820, height: 820, borderRadius: '50%', filter: 'blur(140px)', opacity: 0.24, background: C.cyan, right: -360, bottom: 120 }} />
        <div style={{ position: 'absolute', left: 96, right: 96, top: 560, display: 'flex', flexDirection: 'column' }}>
          <h1 style={h1}>WATCH<br />THE <span style={{ color: C.green }}>FULL</span><br />VIDEO</h1>
          <div style={{ width: 120, height: 6, borderRadius: 3, marginTop: 56, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})` }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center' }}>
          <DownArrow f={f} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- captions (Montserrat house style; ONLY inside CAPTION_WINDOWS; topmost) ----
// The generated file double-escapes apostrophes ("can\\\'t" -> the string can\'t); strip the stray backslash at render.
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h.replace(/\\/g, '') }));
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (frame >= OUTRO_FROM) return null;                                     // never over the outro card
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const curTf = cur.tf;
  const nextT = (CAPS.find((c) => c.tf > curTf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, curTf + 1.3)) return null;
  const lf = frame - Math.round(curTf * FPS);
  const pop = interpolate(lf, [0, 6, 12], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1330, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, fontSize: 84, lineHeight: 1.12,
          textTransform: 'lowercase', letterSpacing: '0.01em', color: '#fff', textAlign: 'center',
          WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, transformOrigin: '50% 50%' }}>
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EveryJobShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {SPANS.map((s, k) => (
      <Sequence key={s.file} from={SPAN_FROM[k]} durationInFrames={s.frames} name={`span-${s.i} ${s.sourced} ${s.role}`}>
        <SpanClip s={s} k={k} />
      </Sequence>
    ))}
    {SEAMS.map((sf) => (
      <Sequence key={`seam-${sf}`} from={sf - SEAM_OUT} durationInFrames={SEAM_OUT + SEAM_IN} name={`seam hand:seam-zoom-flash @${sf}`}>
        <SeamFlash />
      </Sequence>
    ))}
    {COVERS.map((c) => (
      <Sequence key={c.ref} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn)} name={`variant ${c.ref} hand:fade ${c.fxd}s`}>
        <VariantEl c={c} />
      </Sequence>
    ))}
    <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES} name="outro: held last frame + WATCH THE FULL VIDEO">
      {/* the held frame = span-05 frame 179 (its LAST), pre-extracted frame-exact with ffmpeg select=eq(n,179):
          a <Freeze> over the OffthreadVideo resolved to the wrong time in the smoke still (it showed ~1.5 s in) */}
      <Img src={staticFile(LAST_STILL)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <OutroCard />
    </Sequence>
    <Captions />
  </AbsoluteFill>
);
