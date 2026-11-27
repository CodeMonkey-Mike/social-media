// LongestBearShort.tsx -- the ~30 s SHORT of the longform-PRESENTATION project `longest-bear`
// (video-creation/longform-presentation/media/standard/longest-bear), assembled per
// video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B
// + "A presentation project". 1080x1920, 30 fps, NO audio (mix_short.py lays the VO spans + the shared CTA take).
//
// Source = the delivered presentation VERTICAL, already native vertical with nothing burned in, pre-cut by the
// lane into span-NN.mp4 intermediates (the render's --public-dir is _previews/short/work). One MUTED
// OffthreadVideo per span, laid end to end exactly on spans.json (out_start / frames); never seeks into the master.
// No variants, no rebuilt cards: COVERS is declared empty on purpose.
// Captions run over EVERY span (nothing is burned), compared in whole FRAMES (CAPTION_WINDOWS_F), in the
// SCREENSHARE band (CAPTION_BAND_F, y 740-925) over span 4, in the safe-zone block elsewhere.
// Outro: the last 3.000 s hold span 5's final frame under a full-frame "WATCH THE FULL VIDEO" card in the
// video's own card look (assets/card-sources/cards-vertical.html tokens, portrait reflow).
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import {
  ZCAPTIONS,
  CAPTION_WINDOWS,
  CAPTION_WINDOWS_F,
  CAPTION_BAND,
  CAPTION_BAND_F,
  CAPTION_FPS,
} from './LongestBearShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: JETBRAINS } = loadJetBrains('normal', { weights: ['600'], subsets: ['latin'] }); // latin carries U+2193

export const FPS = 30;
if (CAPTION_FPS !== FPS) throw new Error(`LongestBearShortCaptions is at ${CAPTION_FPS} fps, the comp at ${FPS}`);

// ---- the span table (spans.json, verbatim; frame counts verified with ffprobe -count_frames) ----
type Span = { i: number; file: string; outStart: number; frames: number; sourced: 'COVER' | 'SCREENSHARE' };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 150, sourced: 'COVER' },       // hook: AI cold open, the kick + roar (no words)
  { i: 2, file: 'span-02.mp4', outStart: 5.0, frames: 219, sourced: 'COVER' },       // hook: "what's up ... longest bear market ever"
  { i: 3, file: 'span-03.mp4', outStart: 12.3, frames: 96, sourced: 'COVER' },       // body: longest-clock chart, gold NOW bar passes 406/364/378
  { i: 4, file: 'span-04.mp4', outStart: 15.5, frames: 270, sourced: 'SCREENSHARE' }, // body: Two bear markets? slide over webcam
  { i: 5, file: 'span-05.mp4', outStart: 24.5, frames: 98, sourced: 'COVER' },       // kicker: two-legs chart, "by the rule that bear market was over"
];
const SPAN_F = SPANS.map((s) => ({ ...s, from: Math.round(s.outStart * FPS) }));
// the table must be gapless and frame-exact end to end
SPAN_F.forEach((s, k) => {
  if (k > 0) {
    const prev = SPAN_F[k - 1];
    if (prev.from + prev.frames !== s.from) {
      throw new Error(`span ${s.i} starts at frame ${s.from}, span ${prev.i} ends at ${prev.from + prev.frames}`);
    }
  }
});
const LAST = SPAN_F[SPAN_F.length - 1];
export const SPANS_END_F = LAST.from + LAST.frames; // 833 = 27.767 s
export const OUTRO_S = 3.0;
export const OUTRO_F = Math.round(OUTRO_S * FPS); // 90
export const DUR = Math.round(30.767 * FPS); // 923 = spans 27.767 s + outro 3.000 s
if (SPANS_END_F + OUTRO_F !== DUR) throw new Error(`DUR ${DUR} != spans ${SPANS_END_F} + outro ${OUTRO_F}`);

// No variant overlays and no rebuilt cards on a presentation short (the cards are already native vertical).
export const COVERS: { tIn: number; tOut: number; kind: string; ref: string }[] = [];

// ---- seams: all four change picture (AI shot -> room, room -> chart, chart -> screen share, dimmed slide -> chart),
// none is a cut between two settled card states, so each gets the fast (~0.3 s = 9 frames) hand-rolled HIT:
// outgoing last 4 frames push 1.00 -> 1.04, incoming first 5 frames settle 1.06 -> 1.00, and a warm screen-blend
// flash peaks on the seam frame. Strictly inside each span's own frames: nothing overlaps, nothing seeks.
const SEAMS_F = SPAN_F.slice(1).map((s) => s.from); // [150, 369, 465, 735]
const HIT_OUT = 4;
const HIT_IN = 5;

const spanScale = (local: number, frames: number, first: boolean, last: boolean): number => {
  let s = 1;
  if (!first && local < HIT_IN) {
    s *= interpolate(local, [0, HIT_IN], [1.06, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' });
  }
  if (!last && local >= frames - HIT_OUT) {
    s *= interpolate(local, [frames - HIT_OUT, frames - 1], [1.0, 1.04], { easing: Easing.in(Easing.quad), extrapolateLeft: 'clamp' });
  }
  return s;
};

const SpanClip: React.FC<{ span: (typeof SPAN_F)[number]; k: number }> = ({ span, k }) => {
  const local = useCurrentFrame();
  const scale = spanScale(local, span.frames, k === 0, k === SPAN_F.length - 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <OffthreadVideo
        src={staticFile(span.file)}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
    </AbsoluteFill>
  );
};

const SeamFlash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  for (const s of SEAMS_F) {
    if (f >= s - HIT_OUT && f < s + HIT_IN) {
      o = Math.max(o, interpolate(f, [s - HIT_OUT, s, s + HIT_IN], [0, 0.28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    }
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: '#fff4dc', opacity: o, mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

// ---- captions (whole FRAMES only; clip-evals 2026-11-17: a seconds compare rode one frame past a seam) ----
const toF = (s: number) => Math.round(s * FPS);
// sanity: the generated seconds windows and the frame windows agree
CAPTION_WINDOWS.forEach(([a, b], k) => {
  const [fa, fb] = CAPTION_WINDOWS_F[k];
  if (Math.abs(a * FPS - fa) > 0.5 || Math.abs(b * FPS - fb) > 1) throw new Error(`caption window ${k} seconds/frames disagree`);
});
const winOf = (f: number) => CAPTION_WINDOWS_F.findIndex(([a, b]) => f >= a && f < b);
const CAPS = ZCAPTIONS.map((c, k) => {
  const tf = toF(c.t);
  const w = winOf(tf);
  if (w < 0) throw new Error(`caption "${c.h}" at frame ${tf} sits outside every CAPTION_WINDOWS_F window`);
  const next = ZCAPTIONS[k + 1];
  const nextF = next ? toF(next.t) : Infinity;
  // hold until the LAST WORD ENDS (at least 1.3 s), never past the next group, never past its window (= span) end
  const endF = Math.min(nextF, Math.max(tf + toF(1.3), toF(c.e)), CAPTION_WINDOWS_F[w][1]);
  return { tf, endF, h: c.h };
});
const inBand = (f: number) => CAPTION_BAND_F.some(([a, b]) => f >= a && f < b);

// Montserrat Black advance widths (em), conservative, for the one-line fit; verified on smoke stills.
const advance = (ch: string): number => {
  if (ch === ' ') return 0.3;
  if ("iljtfr'.,:;!".includes(ch)) return 0.42;
  if ('mw'.includes(ch)) return 1.0;
  return 0.7;
};
const CAP_MAX_W = 860; // <= 860 so the 1.12 pop and the 12 px stroke stay inside 1080
const CAP_MAX_FONT = 74;
const fitFont = (text: string) => {
  const em = [...text.toLowerCase()].reduce((a, ch) => a + advance(ch), 0);
  return Math.min(CAP_MAX_FONT, Math.floor((CAP_MAX_W - 24) / em));
};
// Safe-zone block: ONE line whose popped box stays in y ~1505-1600 (bottom pad 320). It clears the charts'
// grey source footnotes, which end at y 1490 (measured on spans 3 and 5), so it never sits on card text.
const SAFE_CENTER_Y = 1553;
// SCREENSHARE band: y 740-925 between the slide (its text ends at y 745) and the webcam pane (y 934); the pop
// scales about the band's centre.
const BAND_CENTER_Y = (CAPTION_BAND.top + CAPTION_BAND.bottom) / 2; // 832.5

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  if (winOf(f) < 0) return null; // only inside the caption windows
  let cur: (typeof CAPS)[number] | null = null;
  for (const c of CAPS) {
    if (c.tf <= f) cur = c;
    else break;
  }
  if (!cur || f >= cur.endF) return null;
  const local = f - cur.tf;
  const pop = interpolate(local, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cy = inBand(f) ? BAND_CENTER_Y : SAFE_CENTER_Y;
  const fontSize = fitFont(cur.h);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy - 60,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: CAP_MAX_W,
            whiteSpace: 'nowrap',
            fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`,
            fontWeight: 900,
            fontSize,
            lineHeight: 1,
            color: '#ffffff',
            textTransform: 'lowercase',
            WebkitTextStroke: '12px #000',
            paintOrder: 'stroke fill',
            textAlign: 'center',
            transform: `scale(${pop})`,
            transformOrigin: '50% 50%',
          }}
        >
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- the outro: last frame of span 5 held, the card brought in over it (0.3 s), arrow bobbing ----
const OutroCard: React.FC = () => {
  const f = useCurrentFrame(); // local to the outro Sequence
  const IN = 9; // ~0.3 s
  const bgO = interpolate(f, [0, IN], [0, 0.93], { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' });
  const blur = interpolate(f, [0, IN], [0, 14], { extrapolateRight: 'clamp' });
  const textO = interpolate(f, [3, IN + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = interpolate(f, [3, IN + 5], [46, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const divW = interpolate(f, [8, 20], [0, 84], { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowO = interpolate(f, [12, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bob = f < 20 ? 0 : Math.sin(((f - 20) / FPS) * Math.PI * 2 * 1.1) * 14;
  return (
    <AbsoluteFill>
      {/* the held proof: span 5's final frame (frame 97 of 98), never a seek into the master */}
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
        <Freeze frame={LAST.frames - 1}>
          <OffthreadVideo src={staticFile(LAST.file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Freeze>
      </AbsoluteFill>
      {/* the card: bg-deep with the video's gold orb (cards-vertical.html tokens), portrait reflow */}
      <AbsoluteFill style={{ backgroundColor: `rgba(10,12,16,${bgO})` }} />
      <AbsoluteFill style={{ opacity: bgO / 0.93, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: '#f5b942',
            filter: 'blur(120px)',
            opacity: 0.16,
            top: -260,
            right: -200,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          padding: '150px 84px 600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: textO,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div
          style={{
            fontFamily: `${PLAYFAIR},serif`,
            fontWeight: 900,
            fontSize: 132,
            lineHeight: 1.04,
            letterSpacing: '-0.01em',
            color: '#f5f5f7',
          }}
        >
          WATCH THE
          <br />
          <span style={{ color: '#f5b942' }}>FULL VIDEO</span>
        </div>
        <div
          style={{
            width: divW,
            height: 5,
            borderRadius: 2,
            margin: '44px 0',
            background: 'linear-gradient(90deg,#f5b942,rgba(245,185,66,.18))',
          }}
        />
        <div
          style={{
            fontFamily: `${JETBRAINS},'Segoe UI Symbol',monospace`,
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 1,
            color: '#f5b942',
            textShadow: '0 0 40px rgba(245,185,66,.45)',
            opacity: arrowO,
            transform: `translateY(${bob}px)`,
          }}
        >
          {'↓'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LongestBearShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10' }}>
      {SPAN_F.map((s, k) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames} name={`span-${s.i} ${s.sourced}`}>
          <SpanClip span={s} k={k} />
        </Sequence>
      ))}
      <SeamFlash />
      <Sequence from={SPANS_END_F} durationInFrames={OUTRO_F} name="outro WATCH THE FULL VIDEO">
        <OutroCard />
      </Sequence>
      {/* captions: topmost, only inside CAPTION_WINDOWS_F (they end at the last span, so never over the outro) */}
      <Captions />
    </AbsoluteFill>
  );
};
