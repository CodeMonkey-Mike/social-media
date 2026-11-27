// LanggraphUpdatesShort.tsx: the ~30 s SHORT of the longform-PRESENTATION project `langgraph-updates`
// (video-creation/longform-presentation/media/standard/langgraph-updates), Stage B of
// video-creation/longform-edited/skills/longform-to-short/longform-to-short.md ("A presentation project").
//
// Source = the delivered presentation VERTICAL (native 1080x1920, nothing burned in), pre-cut by Stage A into
// span-NN.mp4 intermediates. The render's --public-dir is the lane's work folder:
//   media/standard/langgraph-updates/_previews/short/work   (spans.json, span-01..03.mp4)
// One muted OffthreadVideo per span, laid end to end in Sequences, never seeking into the master.
// The comp has NO audio: mix_short.py concats the span wavs (spine VO) + the shared CTA take (no bed, no SFX:
// MUSIC-PLAN.json no_music / no_sfx).
//
// Layers (bottom -> top): spans · seam hits · outro (held last frame + WATCH THE FULL VIDEO card) · captions.
// Captions: generated LanggraphUpdatesShortCaptions.ts (SHORT seconds), compared in WHOLE FRAMES only.
//   - full-frame face / card: the SAFE ZONE block (bottom pad 320 px, maxWidth 860, one line, clear of card text:
//     check-caught's lowest line ends at y 1460, the block's ink starts at y ~1508 at the pop peak)
//   - inside CAPTION_BAND_F (SCREENSHARE: slide stacked over the webcam): the band y 686-871, one line, the pop
//     scaled about the band's centre (the slide's lowest box ends at y 730 / 718, the webcam pane starts at y 880)
//
// TRANSITIONS (grep these tags against SHORT-CUT-PLAN.snapped.json "seams"):
//   hand:xfade-zoom 9f (0.3 s) @ short frame 335  span 1 (card six-to-seven, settled) -> span 2 (screen share)
//   hand:xfade-zoom 9f (0.3 s) @ short frame 706  span 2 (card check-caught coin-passed, settled) -> span 3 (screen share)
//   hand:fade+scale-in 11f     @ short frame 834  outro card over the held last frame of span 3
// No library transition is used (no plates / tiles / sfx to copy).
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
  CAPTION_FPS,
  CAPTION_WINDOWS_F,
  CAPTION_BAND,
  CAPTION_BAND_F,
} from './LanggraphUpdatesShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: JETBRAINS } = loadJetBrains('normal', { weights: ['700'], subsets: ['latin'] });

export const FPS = 30;

// ---- the span table (spans.json, verified: ffprobe nb_read_frames 335 / 371 / 128) ----------------------------
type Span = { i: number; file: string; outStart: number; frames: number; sourced: 'COVER' | 'SCREENSHARE'; srcStart: number; srcEnd: number };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 335, sourced: 'COVER', srcStart: 0.2, srcEnd: 11.36 },          // hook: FACE scene, then card six-to-seven
  { i: 2, file: 'span-02.mp4', outStart: 11.1667, frames: 371, sourced: 'COVER', srcStart: 256.74, srcEnd: 269.12 },  // body: screen-share lead, then card check-caught
  { i: 3, file: 'span-03.mp4', outStart: 23.5333, frames: 128, sourced: 'SCREENSHARE', srcStart: 84.06, srcEnd: 88.32 }, // kicker: screen share, the rule lit
];
// frame starts are the running sum of the frame counts; spans.json's out_start must agree to the frame
const SPAN_F = SPANS.map((s, k) => {
  const from = SPANS.slice(0, k).reduce((a, x) => a + x.frames, 0);
  if (Math.round(s.outStart * FPS) !== from) {
    throw new Error(`span ${s.i}: out_start ${s.outStart}s = frame ${Math.round(s.outStart * FPS)}, running sum says ${from}`);
  }
  return { ...s, from };
});
export const SPANS_F = SPANS.reduce((a, s) => a + s.frames, 0);             // 834 = 27.800 s
export const OUTRO_S = 3.0;
export const OUTRO_F = Math.round(OUTRO_S * FPS);                            // 90
export const DUR = Math.round(30.8 * FPS);                                   // 924 = spans 27.8 s + 3.000 s outro
if (SPANS_F + OUTRO_F !== DUR) throw new Error(`DUR ${DUR} != spans ${SPANS_F} + outro ${OUTRO_F}`);
if (CAPTION_FPS !== FPS) throw new Error(`captions are on ${CAPTION_FPS} fps, the comp on ${FPS}`);
if (CAPTION_WINDOWS.length !== CAPTION_WINDOWS_F.length) throw new Error('CAPTION_WINDOWS / CAPTION_WINDOWS_F disagree');

// No cover overlays: a presentation short's cards are already native vertical in the span pictures (no variants, no
// rebuilt cards). Declared empty on purpose (lint_covers.py accepts a declared empty table).
type Cover = { tIn: number; tOut: number; kind: 'vid' | 'still'; ref: string };
export const COVERS: Cover[] = [];

const FILL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 };

// A FAITHFUL still of a span frame: a real <Freeze> on the SAME source, muted, untransformed (comp-build.md §6a),
// wrapped in a zero-offset Sequence so the parent Sequence's `from` never shifts the frozen frame.
const SpanFrame: React.FC<{ file: string; frame: number }> = ({ file, frame }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={frame}>
      <OffthreadVideo src={staticFile(file)} muted style={FILL} />
    </Freeze>
  </Sequence>
);

// ---- seam hit: hand:xfade-zoom, 9 frames (0.3 s) centred on the seam -----------------------------------------
// i = 0..8 over [seam-4, seam+5). A = the outgoing span's own frames (its live frame while it lasts, then its last
// frame held), zooming 1 -> 1.06; B = the incoming span's frames (its first frame held before the seam, then live),
// settling 1.06 -> 1 while it fades in over A. At i = 0 the picture equals the live outgoing frame, at i = 8 the live
// incoming frame, so the window edges are seamless; the VO stays frame-locked (B is never shifted in time).
const HIT_PRE = 4;
const HIT_LEN = 9;
const SeamHit: React.FC<{ out: { file: string; frames: number }; inc: { file: string } }> = ({ out, inc }) => {
  const i = useCurrentFrame();
  const aFrame = Math.min(out.frames - HIT_PRE + i, out.frames - 1);
  const bFrame = Math.max(0, i - HIT_PRE);
  const bOpacity = interpolate(i, [0, HIT_LEN - 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const aScale = interpolate(i, [0, HIT_LEN - 1], [1, 1.06], {
    easing: Easing.in(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bScale = interpolate(i, [0, HIT_LEN - 1], [1.06, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // snap to 4 decimals: 1.06 - 0.06 lands a float hair under 1, which let A's orb bleed through B's last pixel column
  // (x 1079) on the window's last frame (smoke QA 2026-11-23); once B is fully opaque A is not drawn at all
  const snap = (v: number) => Math.round(v * 1e4) / 1e4;
  const bFull = snap(bOpacity) >= 1;
  return (
    <AbsoluteFill style={{ background: '#0a0c10' }}>
      {!bFull && (
        <AbsoluteFill style={{ transform: `scale(${snap(aScale)})`, transformOrigin: '50% 50%' }}>
          <SpanFrame file={out.file} frame={aFrame} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ transform: `scale(${snap(bScale)})`, transformOrigin: '50% 50%', opacity: bFull ? 1 : snap(bOpacity) }}>
        <SpanFrame file={inc.file} frame={bFrame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const SEAMS = SPAN_F.slice(1).map((s) => s.from);                    // [335, 706]

// ---- the outro card: WATCH THE FULL VIDEO, in the video's own card look -----------------------------------------
// Tokens from assets/card-sources/text/base.css (container-canonical): --bg-deep #0a0c10, the cyan orb (blur 120 px,
// opacity .30), the 3% film grain, Playfair Display 900 headline (letter-spacing -.02em, line-height 1.07,
// --text-primary #e8eaf0) with the key words in --accent-cyan (this video's lit colour), the green -> cyan gradient
// divider, JetBrains Mono for the glyph. Portrait reflow (portrait-text.css): 72 px side margins, content centred in
// the safe band y 120..1450. Ingress = the video's own card entrance: 11-frame fade + 0.97 -> 1 scale-in.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 11], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = interpolate(f, [0, 11], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowIn = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bob = f > 20 ? 12 * Math.sin(((f - 20) / FPS) * 2 * Math.PI * 0.9) : 0;  // a slow bob so the card never sits dead still
  return (
    <AbsoluteFill style={{ opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 560, top: -300, width: 820, height: 820, borderRadius: '50%',
                      background: '#00c2ff', filter: 'blur(120px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: GRAIN }} />
        <div style={{ position: 'absolute', left: 72, right: 72, top: 120, bottom: 470, display: 'flex',
                      flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 128, lineHeight: 1.07, letterSpacing: '-0.02em',
                        color: '#e8eaf0' }}>
            WATCH THE<br /><span style={{ color: '#00c2ff' }}>FULL VIDEO</span>
          </div>
          <div style={{ width: 66, height: 4, borderRadius: 2, margin: '40px 0 24px',
                        background: 'linear-gradient(90deg, #00e68a, #00c2ff)' }} />
          <div style={{ fontFamily: JETBRAINS, fontWeight: 700, fontSize: 220, lineHeight: 1, color: '#00c2ff',
                        opacity: arrowIn, transform: `translateY(${(1 - arrowIn) * -28 + bob}px)` }}>
            {'↓'}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- captions (house style, Montserrat 900, lowercase, 12 px black stroke, pop 0.7 -> 1.12 -> 1) ---------------
// Every time is compared in WHOLE FRAMES. A group shows from round(t * FPS) and hides at
//   min(next group's frame, max(frame + 1.3 s, round(e * FPS)), the end of the CAPTION_WINDOWS_F window holding it)
// and never crosses a CAPTION_BAND_F edge (it never jumps between the band and the bottom block mid-word).
const CAPS = ZCAPTIONS.map((c) => ({ f: Math.round(c.t * FPS), e: Math.round(c.e * FPS), h: c.h }));
const MIN_HOLD_F = Math.round(1.3 * FPS);
const inWin = (wins: [number, number][], fr: number) => wins.find(([a, b]) => fr >= a && fr < b);

export const captionAt = (frame: number) => {
  if (!inWin(CAPTION_WINDOWS_F, frame)) return null;
  let k = -1;
  for (let j = 0; j < CAPS.length; j++) {
    if (CAPS[j].f <= frame) k = j;
    else break;
  }
  if (k < 0) return null;
  const cur = CAPS[k];
  const win = inWin(CAPTION_WINDOWS_F, cur.f);
  if (!win) return null;
  const next = k + 1 < CAPS.length ? CAPS[k + 1].f : Infinity;
  let end = Math.min(next, Math.max(cur.f + MIN_HOLD_F, cur.e), win[1]);
  for (const [a, b] of CAPTION_BAND_F) {
    if (cur.f >= a && cur.f < b) end = Math.min(end, b);
    else if (a > cur.f) end = Math.min(end, a);
  }
  if (frame >= end) return null;
  return { h: cur.h, local: frame - cur.f, band: !!inWin(CAPTION_BAND_F, frame) };
};

const CAP_FONT = 80;
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = captionAt(frame);
  if (!c) return null;
  const pop = interpolate(c.local, [0, 3, 7], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const text = (
    <span style={{ display: 'inline-block', maxWidth: 860, whiteSpace: 'nowrap', textAlign: 'center',
                   fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, fontSize: CAP_FONT,
                   lineHeight: 1, textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000',
                   paintOrder: 'stroke fill', transform: `scale(${pop})`, transformOrigin: '50% 50%' }}>
      {c.h}
    </span>
  );
  if (c.band) {
    // SCREENSHARE: the band between the slide pane and the webcam pane, the pop about the band's centre
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: CAPTION_BAND.top, height: CAPTION_BAND.bottom - CAPTION_BAND.top,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {text}
      </div>
    );
  }
  // full-frame face / card: the SAFE ZONE block, bottom pad 320 px
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 320, height: CAP_FONT, display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
      {text}
    </div>
  );
};

export const LanggraphUpdatesShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#0a0c10' }}>
    {SPAN_F.map((s) => (
      <Sequence key={s.file} from={s.from} durationInFrames={s.frames} name={`span ${s.i} ${s.sourced}`}>
        <OffthreadVideo src={staticFile(s.file)} muted style={FILL} />
      </Sequence>
    ))}
    {SPAN_F.slice(1).map((s, k) => (
      // hand:xfade-zoom 0.3 s at each seam
      <Sequence key={'hit' + s.i} from={s.from - HIT_PRE} durationInFrames={HIT_LEN} name={`seam hit ${SPAN_F[k].i}->${s.i}`}>
        <SeamHit out={{ file: SPAN_F[k].file, frames: SPAN_F[k].frames }} inc={{ file: s.file }} />
      </Sequence>
    ))}
    <Sequence from={SPANS_F} durationInFrames={OUTRO_F} name="outro: held last frame + WATCH THE FULL VIDEO">
      <SpanFrame file={SPAN_F[SPAN_F.length - 1].file} frame={SPAN_F[SPAN_F.length - 1].frames - 1} />
      <OutroCard />
    </Sequence>
    <Captions />
  </AbsoluteFill>
);
