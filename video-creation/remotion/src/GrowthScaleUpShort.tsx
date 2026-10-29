// GrowthScaleUpShort: the ~30 s 9:16 short of growth-scale-up (skills/longform-to-short/longform-to-short.md §5 Stage B).
// Public dir = media/growth-scale-up/_previews/short/work. One muted OffthreadVideo per span-NN.mp4 laid end to end
// (spans.json out_start/frames), never seeking into the master. Seams = hand-rolled ~0.3 s flash + zoom punch.
// Captions only inside CAPTION_WINDOWS (COVER-sourced span 2; FACE spans carry burned captions). variants.json is empty.
// Outro: last span frame frozen under a full-frame TITLE-SLIDE "WATCH THE FULL VIDEO". No audio (mix_short.py).
import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './GrowthScaleUpShortCaptions';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
export const DUR = Math.round(30.0 * 30); // 900: spans 800 f (26.667 s) + outro 100 f (3.333 s)

const SPANS = [
  { file: 'span-01.mp4', from: 0, frames: 390 },
  { file: 'span-02.mp4', from: 390, frames: 271 },
  { file: 'span-03.mp4', from: 661, frames: 139 },
];
const SPANS_END = SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].frames; // 800
const SEAMS = SPANS.slice(1).map((s) => s.from);
const HIT = 9; // ~0.3 s seam hit

const Span: React.FC<{ file: string }> = ({ file }) => (
  <OffthreadVideo src={staticFile(file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
);

// seam hit (hand-rolled flash + zoom punch, the video's flash/zoom family)
const seamScale = (f: number) => {
  for (const s of SEAMS) {
    const d = f - s;
    if (d >= -HIT / 2 && d < HIT / 2 + 1) {
      return d < 0
        ? interpolate(d, [-HIT / 2, 0], [1, 1.08], { easing: Easing.in(Easing.cubic) })
        : interpolate(d, [0, HIT / 2 + 1], [1.08, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' });
    }
  }
  return 1;
};
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  for (const s of SEAMS) o = Math.max(o, interpolate(f - s, [-3, 0, 6], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return o > 0 ? <AbsoluteFill style={{ background: '#ffffff', opacity: o }} /> : null;
};

// COVERS: the variety-rule variants (assets/short/variants.json, full-frame over overlay_short). variants.json is EMPTY
// for this short, so the table is empty; an entry would be copied to work/variants/ and listed here.
const COVERS: { ref: string; tIn: number; tOut: number }[] = [];
const Variants: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = COVERS.find((v) => t >= v.tIn && t < v.tOut);
  return c ? <AbsoluteFill><OffthreadVideo src={staticFile('variants/' + c.ref)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill> : null;
};

const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h }));
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const s = interpolate(t - cur.tf, [0, 0.08, 0.16], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1500 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 84,
        textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        transform: `scale(${s})`, maxWidth: 980, textAlign: 'center', lineHeight: 1.1 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// TITLE-SLIDE outro card (locked stylesheet: bg #0a0c10, Playfair Display 900, accent green #00e68a, gradient divider)
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, 12], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bob = Math.sin(f / 6) * 14;
  return (
    <AbsoluteFill style={{ background: '#0a0c10', opacity: o, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `translateY(${y}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 148, lineHeight: 1.04,
          letterSpacing: '-0.02em', color: '#e8eaf0', textAlign: 'center' }}>
          WATCH THE<br /><span style={{ color: '#00e68a' }}>FULL</span> VIDEO
        </div>
        <div style={{ width: 520, height: 6, marginTop: 56, borderRadius: 3,
          background: 'linear-gradient(90deg, rgba(0,230,138,0), #00e68a, rgba(0,230,138,0))' }} />
        <svg width={170} height={210} viewBox="0 0 170 210" style={{ marginTop: 70, transform: `translateY(${bob}px)` }}>
          <path d="M85 10 V170 M20 110 L85 190 L150 110" stroke="#00e68a" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const GrowthScaleUpShort: React.FC = () => {
  const f = useCurrentFrame();
  const last = SPANS[SPANS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${seamScale(f)})` }}>
        {SPANS.map((s) => (
          <Sequence key={s.file} from={s.from} durationInFrames={s.frames}><Span file={s.file} /></Sequence>
        ))}
        <Sequence from={SPANS_END} durationInFrames={DUR - SPANS_END}>
          <Freeze frame={last.frames - 1}><Span file={last.file} /></Freeze>
        </Sequence>
      </AbsoluteFill>
      <Variants />
      <Flash />
      <Sequence from={SPANS_END} durationInFrames={DUR - SPANS_END}><Outro /></Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
