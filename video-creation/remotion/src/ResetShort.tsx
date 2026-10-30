// ResetShort: 1080x1920 short assembled from the short lane's span intermediates (public dir = _previews/short/work).
// longform-to-short.md §5 Stage B. No audio in the comp (mix_short.py adds VO + CTA + bed).
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './ResetShortCaptions';

const MONTSERRAT = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true }).fontFamily;
const PLAYFAIR = loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true }).fontFamily;

export const FPS = 30;
const SPANS_SECS = 27.233;
const OUTRO_SECS = 3.0;
export const DUR = Math.round((SPANS_SECS + OUTRO_SECS) * FPS); // 907

// spans.json (out_start s, frames) laid end to end
const SPANS = [
  { file: 'span-01.mp4', out: 0.0, frames: 319 },
  { file: 'span-02.mp4', out: 10.6333, frames: 248 },
  { file: 'span-03.mp4', out: 18.9, frames: 182 },
  { file: 'span-04.mp4', out: 24.9667, frames: 68 },
].map((s) => ({ ...s, from: Math.round(s.out * FPS) }));
const SPANS_END = SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].frames; // 817
const OUTRO_FROM = Math.round(SPANS_SECS * FPS);
const SEAMS = SPANS.slice(1).map((s) => s.from);

// variants.json: BR-1 (envato, 24 fps) full-frame over overlay_short [11.6, 15.153]
const VID_FPS: Record<string, number> = { 'variants/BR-1-cash-reception-desk.mp4': 24 };
// COVERS (lint_covers): the one cover in the short is the variety overlay; captions ride over it on purpose
// (span 2 is COVER-sourced and carries no burned captions), hence cap: true.
const COVERS = [
  { tIn: 10.633, tOut: 11.833, kind: 'container', ref: 'C4-payoff-v', cap: true },
  { tIn: 11.6, tOut: 15.2, kind: 'vid', ref: 'BR-1-cash-reception-desk', cap: true },
  { tIn: 17.867, tOut: 18.9, kind: 'container', ref: 'H4-s1-v', cap: true },
];
// CAPTION_SRC restates ResetShortCaptions.ts CAPTION_WINDOWS as literals for lint_covers.py
const CAPTION_SRC: [number, number][] = [[0.000, 10.620], [10.633, 18.893], [18.900, 24.980], [24.967, 27.217]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('ResetShort: CAPTION_SRC drifted');
void COVERS;
// 16:9-SOURCED: every span is rendered from Reset.tsx with {captions:false} (the comp honors it since 2026-10-30), so NOTHING
// arrives burned and the short's own captions run over every span (CAPTION_WINDOWS). The earlier COVER-only clip hid the bug.
const VARIANTS = [{ id: 'BR-1', file: 'variants/BR-1-cash-reception-desk.mp4', a: 11.6, b: 15.2 }];  // through frame 455 (the cropped 16:9 BR-1 showed there); F2's face starts at 456
// NATIVE VERTICAL REBUILDS (Mike 2026-10-30: the short gets the vertical-repurpose treatment on its spans, never a crop or a
// letterbox): the C4 debt ticker (landed payoff state) and the H4 card s1 re-shot from their HTML sources at 1080x1920
// (media/reset/assets/short/vertical-cards/, copied into the public dir). C4 sits UNDER the BR-1 variant, which fades in over it.
const NATIVE_CARDS = [
  { id: 'C4', file: 'vertical-cards/C4-payoff-v.png', a: 10.6333, b: 11.8333, fadeIn: 0 },
  { id: 'H4', file: 'vertical-cards/H4-s1-v.png', a: 17.8333, b: 18.9, fadeIn: 0 },  // on the 16:9's own hard cut to H4 (span-02 f216)
];
// COVER SLIVERS at a FACE span's edges (frame QA 2026-10-30): span 3 opens on 3 frames of the 16:9 H5 chart (the F4 cut-in burn
// starts on the chart) and ends on 2 frames of the H2 card (the face-out burn). A 608 px crop of a chart for 0.1 s is a flicker,
// not a picture, so those frames HOLD the nearest face frame (span-03 f3 / f179, extracted to the public dir).
const HOLDS = [
  { file: 'span-03-head.png', from: 567, len: 6 },  // 6, not 3: the render showed a chart frame as late as 571
  { file: 'span-03-tail.png', from: 747, len: 2 },
];

// seam hit: hand-rolled zoom punch + white flash, ~0.3 s centred on the cut (the video's punch/flash family)
const HIT = 9;
const seamAmt = (f: number) => {
  let m = 0;
  for (const s of SEAMS) { const d = Math.abs(f - s); if (d < HIT / 2 + 1) m = Math.max(m, 1 - d / (HIT / 2 + 1)); }
  return m;
};

const SpanLayer: React.FC = () => {
  const f = useCurrentFrame();
  const amt = seamAmt(f);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 0.08 * amt})` }}>
      {SPANS.map((s) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames}>
          <OffthreadVideo src={staticFile(s.file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Sequence>
      ))}
      {/* outro hold: last span's final frame */}
      <Sequence from={SPANS_END - 1} durationInFrames={DUR - SPANS_END + 1}>
        {/* a still of span 4's last frame (span-04-last.png): Freeze over an OffthreadVideo past its end rendered BLACK for
            span 4's last frame and the outro (2026-10-30 QA; the still starts ON that frame), which read as a dip to black before the CTA card */}
        <Img src={staticFile('span-04-last.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Variant: React.FC<{ file: string; len: number }> = ({ file, len }) => {
  const f = useCurrentFrame();
  // fade IN only: a fade-out would show the cropped 16:9 b-roll underneath for 0.2 s before the film burn to F2
  const op = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sc = interpolate(f, [0, len], [1.04, 1.0]);
  const fps = VID_FPS[file] ?? 30;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>
      <OffthreadVideo src={staticFile(file)} muted playbackRate={30 / fps} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

const NativeCard: React.FC<{ file: string; fadeIn: number }> = ({ file, fadeIn }) => {
  const f = useCurrentFrame();
  const op = fadeIn ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: op }}><Img src={staticFile(file)} style={{ width: '100%', height: '100%' }} /></AbsoluteFill>;
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const a = seamAmt(f);
  return a > 0 ? <AbsoluteFill style={{ background: '#fff', opacity: 0.55 * a * a }} /> : null;
};

// CAPTIONS (ResetShortCaptions.ts, generated): only inside CAPTION_WINDOWS, Montserrat house style, topmost.
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) { if (c.t <= t) cur = c; else break; }
  if (!cur) return null;
  const nxt = ZCAPTIONS.find((c) => c.t > cur!.t);
  // hold until the next group (cap 2.6 s): a 1.3 s cap dropped groups mid-word over stretched words ('how', 'debt'), QA 2026-10-30
  if (t >= Math.min(nxt ? nxt.t : Infinity, cur.t + 2.6)) return null;
  const lf = f - Math.round(cur.t * FPS);
  const sc = interpolate(lf, [0, 3, 6], [0.7, 1.12, 1], { extrapolateRight: 'clamp' });
  return (
    // SAFE ZONE: the caption block sits in y ~1420-1600 (bottom pad 320, max 2 lines of 92 px), BELOW the fit-window letterbox
    // (cards shown whole occupy y 656-1264) and above the platform UI; maxWidth 860 keeps the 1.12 pop + 12 px stroke inside 1080.
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320 }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, textTransform: 'lowercase', fontSize: 92,
        color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', textAlign: 'center', maxWidth: 860, lineHeight: 1.1,
        transform: `scale(${sc})` }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// OUTRO: full-frame TITLE-SLIDE card, locked container stylesheet (dark, Playfair headline, green accent word)
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const pop = spring({ frame: f - 4, fps, config: { damping: 14 } });
  const bob = Math.sin((f / fps) * Math.PI * 2) * 14;
  return (
    // LIGHT container theme (the video's own: PROJECT-LOG 'Container theme: LIGHT'), light-theme house accent #007A55
    <AbsoluteFill style={{ opacity: op, background: 'radial-gradient(circle at 50% 40%, #fbf9f4 0%, #efebe2 75%)', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 120, height: 6, background: '#007A55', marginBottom: 60, borderRadius: 3 }} />
      <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, color: '#14161a', fontSize: 150, lineHeight: 1.05, textAlign: 'center',
        letterSpacing: '0.01em', transform: `scale(${0.85 + 0.15 * pop})` }}>
        WATCH THE<br /><span style={{ color: '#007A55' }}>FULL</span> VIDEO
      </div>
      <div style={{ marginTop: 90, color: '#007A55', fontSize: 200, fontFamily: 'Segoe UI Symbol, sans-serif', transform: `translateY(${bob}px)`, opacity: pop }}>↓</div>
    </AbsoluteFill>
  );
};

export const ResetShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <SpanLayer />
    {HOLDS.map((h) => (
      <Sequence key={h.file} from={h.from} durationInFrames={h.len}><Img src={staticFile(h.file)} style={{ width: '100%', height: '100%' }} /></Sequence>
    ))}
    {NATIVE_CARDS.map((c) => {
      const from = Math.round(c.a * FPS), len = Math.round(c.b * FPS) - from;
      return <Sequence key={c.id} from={from} durationInFrames={len}><NativeCard file={c.file} fadeIn={c.fadeIn} /></Sequence>;
    })}
    {VARIANTS.map((v) => {
      const from = Math.round(v.a * FPS), len = Math.round(v.b * FPS) - from;
      return <Sequence key={v.id} from={from} durationInFrames={len}><Variant file={v.file} len={len} /></Sequence>;
    })}
    <Flash />
    <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM}><Outro /></Sequence>
    <Captions />
  </AbsoluteFill>
);
