// Kcc20Short.tsx: the kcc20 SHORT (longform-to-short.md section 5 Stage B; comp-builder SHORT mode, 2026-10-22).
// 1080x1920 @30. Three span intermediates (cut by s_extract from kcc20-VERTICAL.mp4) laid end to end, one muted
// OffthreadVideo each, played linearly from 0 (NEVER a seek into the master), a fast ~0.3 s hand-rolled hit on each seam,
// the lane's captions over the COVER-sourced frames only (the FACE span already carries its burned captions), and the
// 3.000 s outro: the last span's final frame held under a full-frame TITLE-SLIDE card "WATCH THE FULL VIDEO".
// NO AUDIO: the lane's mix_short.py lays the span VO (from the paused spine), the shared CTA take and the bed.
// Public dir = media/kcc20/_previews/short/work (span-NN.mp4 + spans.json).
// Variants (assets/short/variants.json): EMPTY for kcc20 (s_variants: no span carries an Envato clip or a ChatGPT image),
// so there is no variant overlay layer to wire.
import React from 'react';
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './Kcc20ShortCaptions';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ---------------------------------------------------------------------------------------------------------------------
// 1. THE SPAN TABLE (spans.json verbatim: out_start s / frames; frame counts verified with ffprobe -count_frames)
// ---------------------------------------------------------------------------------------------------------------------
type Span = { file: string; from: number; frames: number; sourced: 'FACE' | 'COVER'; role: string };
const SPANS: Span[] = [
  { file: 'span-01.mp4', from: 0, frames: 204, sourced: 'FACE', role: 'hook' },     // out_start 0.000   (burned captions)
  { file: 'span-02.mp4', from: 204, frames: 58, sourced: 'COVER', role: 'stamp' },  // out_start 6.800   (silent stamp)
  { file: 'span-03.mp4', from: 262, frames: 633, sourced: 'COVER', role: 'body' },  // out_start 8.7333  (captioned)
];
const SPANS_END = 895;                          // 29.833 s of spans
const OUTRO_S = 3.0;                            // the outro absorbs the rounding (s_comp): 32.833 - 29.833
export const DUR = Math.round(32.833 * FPS);    // 985
const OUTRO_FROM = SPANS_END;
const OUTRO_FRAMES = DUR - OUTRO_FROM;          // 90

// build-time asserts: the table is contiguous and the outro is exactly the brief's 3.000 s
SPANS.forEach((s, i) => {
  const prevEnd = i === 0 ? 0 : SPANS[i - 1].from + SPANS[i - 1].frames;
  if (s.from !== prevEnd) throw new Error(`Kcc20Short: span ${s.file} starts at ${s.from}, expected ${prevEnd} (spans must butt end to end)`);
});
if (SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].frames !== SPANS_END) throw new Error('Kcc20Short: SPANS_END mismatch');
if (OUTRO_FRAMES !== Math.round(OUTRO_S * FPS)) throw new Error(`Kcc20Short: outro is ${OUTRO_FRAMES} frames, expected ${OUTRO_S * FPS}`);

// The cover table the gates read (SHORT seconds). kind 'span' = a pre-composited span of the delivered vertical (not a
// b-roll asset, so the 4 s / reuse rules do not apply); span-03 is COVER-sourced and carries the lane's captions (cap).
const COVERS = [
  { tIn: 0.0, tOut: 6.8, kind: 'span', ref: 'span-01' },
  { tIn: 6.8, tOut: 8.733, kind: 'span', ref: 'span-02' },
  { tIn: 8.733, tOut: 29.833, kind: 'span', ref: 'span-03', cap: true },
  { tIn: 29.833, tOut: 32.833, kind: 'card', ref: 'outro-watch-full' },
];
// CAPTION_SRC mirrors the generated CAPTION_WINDOWS (asserted below) so lint_covers sees the caption scope.
const CAPTION_SRC: [number, number][] = [[8.733, 29.833]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('Kcc20Short: CAPTION_SRC drifted from Kcc20ShortCaptions.CAPTION_WINDOWS');
COVERS.forEach((c, i) => {
  if (i < SPANS.length && (Math.round(c.tIn * FPS) !== SPANS[i].from || Math.round(c.tOut * FPS) !== SPANS[i].from + SPANS[i].frames))
    throw new Error(`Kcc20Short: COVERS row ${c.ref} drifted from the span table`);
});

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// ---------------------------------------------------------------------------------------------------------------------
// 2. SEAM HITS (~0.3 s, the video's own family, TRANSITIONS.md):
//    seam 1 @204 FACE -> COVER  = hand:film-burn (the video's face-cut pick; span-01 already ends inside the longform's
//                                 own face-out burn, this hit peaks ON the seam and burns off into the stamp)
//    seam 2 @262 COVER -> COVER = hand:xfade-scale family as a fast flash + zoom (incoming 1.06 -> 1 over 9 f)
// ---------------------------------------------------------------------------------------------------------------------
const SEAMS = [
  { at: 204, id: 'hand:film-burn' },
  { at: 262, id: 'hand:flash-zoom' },
];
const HALF = 5;   // hit window = at-5 .. at+4 (10 f = 0.33 s)

const FilmBurn: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - HALF, at, at + HALF - 1], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: k,
      background: 'radial-gradient(ellipse 85% 60% at 55% 42%, rgba(255,236,200,0.95) 0%, rgba(255,170,70,0.85) 32%, rgba(230,90,20,0.55) 62%, rgba(120,30,0,0.0) 100%)' }} />
  );
};

const FlashZoom: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 3, at, at + HALF - 1], [0, 0.75, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  if (k <= 0) return null;
  return <AbsoluteFill style={{ pointerEvents: 'none', background: '#ffffff', opacity: k }} />;
};

// zoom on the span layer: the outgoing span pushes 1 -> 1.04 over its last 4 f, the incoming lands 1.06 -> 1 over 9 f
const seamScale = (f: number) => {
  const s = SEAMS[1];
  if (f >= s.at - 4 && f < s.at) return interpolate(f, [s.at - 4, s.at], [1, 1.04], { easing: Easing.in(Easing.quad) });
  if (f >= s.at && f < s.at + 9) return interpolate(f, [s.at, s.at + 9], [1.06, 1], { easing: Easing.out(Easing.cubic) });
  return 1;
};

// ---------------------------------------------------------------------------------------------------------------------
// 3. CAPTIONS (comp-build section 8): the generated Kcc20ShortCaptions.ts, only inside CAPTION_WINDOWS (SHORT seconds),
//    TOPMOST, the Montserrat house style. Top at 1530 px, NOT the 1470 px of the burned FACE captions: span-03's diagram
//    ends its 'Balance =' payoff boxes at ~1490 px and a 1470 line covered them exactly on 'is the indexer's answer'
//    (smoke still f545, 2026-10-22); 1530 sits in the gap between the boxes and the source footer.
// ---------------------------------------------------------------------------------------------------------------------
// The generator escaped one apostrophe twice ('indexer\\\'s' -> a literal backslash); strip a backslash before a quote.
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h.replace(/\\+(?=['’])/g, '') }));
const CAP_TOP = 1530;
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const df = frame - Math.round(cur.tf * FPS);
  const s = interpolate(df, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: CAP_TOP, pointerEvents: 'none' }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 92, lineHeight: 1.05,
        color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', letterSpacing: '0.01em', textAlign: 'center',
        transform: `scale(${s})`, maxWidth: 960 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 4. OUTRO: TITLE-SLIDE card (the locked container stylesheet: bg-deep, eyebrow-less title anatomy, Playfair 900
//    headline with ONE green accent word, the green->cyan gradient divider, the accent orbs, film grain) + a downward
//    arrow glyph. Ingress = a fast slide from the right (echoes the video's rmn:slide card pick), hand-rolled, 10 f;
//    readable for the remaining 80 f (2.67 s >= 1 s).
// ---------------------------------------------------------------------------------------------------------------------
const C = { bg: '#0a0c10', text: '#e8eaf0', green: '#00e68a', cyan: '#00c2ff' };
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const CARD_IN = 10;
if (OUTRO_FRAMES - CARD_IN < 30) throw new Error('Kcc20Short: outro card readable < 1.0 s');

const DownArrow: React.FC<{ f: number }> = ({ f }) => {
  const bob = Math.sin((f / FPS) * Math.PI * 2 * 1.1) * 14;
  return (
    <svg width={200} height={253} viewBox="0 0 150 190" style={{ transform: `translateY(${bob}px)`, filter: `drop-shadow(0 0 28px rgba(0,230,138,0.45))` }}>
      <path d="M75 10 V160" stroke={C.green} strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d="M22 110 L75 166 L128 110" stroke={C.green} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();   // 0 at the outro start
  const x = interpolate(f, [0, CARD_IN], [W, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const lift = interpolate(f, [CARD_IN - 2, CARD_IN + 10], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const arrowIn = interpolate(f, [CARD_IN + 2, CARD_IN + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, background: C.bg, overflow: 'hidden', boxShadow: '-30px 0 60px rgba(0,0,0,0.6)' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, right: -380, top: -360, borderRadius: '50%', background: C.green, opacity: 0.17, filter: 'blur(120px)' }} />
      <div style={{ position: 'absolute', width: 700, height: 700, left: -300, bottom: -280, borderRadius: '50%', background: '#3a4f7a', opacity: 0.16, filter: 'blur(120px)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 96px', transform: `translateY(${lift}px)` }}>
        <div style={{ fontFamily: `${PLAYFAIR}, 'Playfair Display', serif`, fontWeight: 900, fontSize: 150, lineHeight: 1.02, letterSpacing: '-0.02em',
          color: C.text, fontVariantNumeric: 'lining-nums' }}>
          WATCH<br />THE <span style={{ color: C.green }}>FULL</span><br />VIDEO
        </div>
        <div style={{ width: 66, height: 4, borderRadius: 2, margin: '44px 0 0', background: `linear-gradient(90deg, ${C.green}, ${C.cyan})` }} />
        <div style={{ marginTop: 90, opacity: arrowIn }}><DownArrow f={f} /></div>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.03, backgroundImage: GRAIN }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 5. THE COMPOSITION
// ---------------------------------------------------------------------------------------------------------------------
export const Kcc20Short: React.FC = () => {
  const frame = useCurrentFrame();
  const last = SPANS[SPANS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* span layer: one muted OffthreadVideo per intermediate, played linearly from its own frame 0 */}
      <AbsoluteFill style={{ transform: `scale(${seamScale(frame)})` }}>
        {SPANS.map((s) => (
          <Sequence key={s.file} from={s.from} durationInFrames={s.frames}>
            <OffthreadVideo src={staticFile(s.file)} muted style={fill} />
          </Sequence>
        ))}
        {/* outro: hold span-03's final frame (frame frames-1) under the card */}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
          <Freeze frame={last.frames - 1}>
            <OffthreadVideo src={staticFile(last.file)} muted style={fill} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>
      {/* seam hits: hand:film-burn @204 (seam 1) · hand:flash-zoom @262 (seam 2) */}
      <FilmBurn at={SEAMS[0].at} />
      <FlashZoom at={SEAMS[1].at} />
      <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
        <OutroCard />
      </Sequence>
      {/* captions TOPMOST, COVER-sourced frames only */}
      <Captions />
    </AbsoluteFill>
  );
};
