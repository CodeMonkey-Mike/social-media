// GrowthVsProductShort: the ~31 s 9:16 short of growth-vs-product (longform-to-short.md section 5 Stage B, 16:9-SOURCED MODE).
// 1080x1920 @ 30 fps. Five muted span intermediates (_previews/short/work/span-NN.mp4, painted from the GrowthVsProduct comp with
// captions off, re-framed per span) laid END TO END, never seeking into a master; a fast hit at each seam from the video's own
// transition family (hand:film-burn, the face pick, + the Monitor glitch that is IMG-5's ingress); the short's caption track
// (generated, SHORT seconds, only inside CAPTION_WINDOWS); the two variety-rule variants (assets/short/variants.json) full-frame
// with the 16:9's own ingress (lib:glitchmonitor-2 / lib:glitchmonitor-5); the WATCH THE FULL VIDEO outro card.
// NO audio in the comp: mix_short.py lays the span VO, the shared CTA take and the bed.
// Public dir = media/growth-vs-product/_previews/short/work (spans, variants/, cutframes/, transitions/lib/plates/).
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition } from './transitions/registry';
import { CAPTION_WINDOWS, ZCAPTIONS } from './GrowthVsProductShortCaptions';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
const OUTRO_S = 3.0;
const SPANS_S = 27.833;                                   // spans.json spans_total_seconds
export const DUR = Math.round((SPANS_S + OUTRO_S) * FPS);  // round(30.833 * 30) = 925
const clampOpt = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ---------------------------------------------------------------------------------------------------------------------
// 1. SPAN TABLE (verbatim from spans.json: out_start s / frames; frame counts verified with ffprobe -count_frames).
//    tailStill: spans 2, 3 and 5 arrive with a pure-BLACK last frame (mean 0.0, measured 2026-10-23; the 16:9-sourced
//    painter leaves the span's final frame unpainted). That one frame is replaced by a still of the frame before it
//    (pre-extracted, exact frame index), so no black flash reaches a seam or the outro hold.
// ---------------------------------------------------------------------------------------------------------------------
type Span = { i: number; file: string; outStart: number; frames: number; sourced: 'FACE' | 'COVER'; tailStill?: string };
const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 141, sourced: 'FACE' },                                         // hook
  { i: 2, file: 'span-02.mp4', outStart: 4.7, frames: 110, sourced: 'FACE', tailStill: 'cutframes/span-02-f108.png' },  // body
  { i: 3, file: 'span-03.mp4', outStart: 8.3667, frames: 305, sourced: 'COVER' },                                      // body
  { i: 4, file: 'span-04.mp4', outStart: 18.5333, frames: 118, sourced: 'COVER' },                                      // body
  { i: 5, file: 'span-05.mp4', outStart: 22.4667, frames: 161, sourced: 'FACE', tailStill: 'cutframes/span-05-f159.png' }, // kicker
];
// span 3's black last frame (short frame 555) needs no still: it sits under the opaque glitchmonitor-5 window (546-565)
const SPAN_FROM: number[] = [];
{
  let acc = 0;
  for (const s of SPANS) {
    if (Math.round(s.outStart * FPS) !== acc) throw new Error(`span ${s.i}: out_start ${s.outStart}s is not end to end (expected frame ${acc})`);
    SPAN_FROM.push(acc);
    acc += s.frames;
  }
  if (acc !== Math.round(SPANS_S * FPS)) throw new Error(`spans total ${acc} f != ${Math.round(SPANS_S * FPS)} f`);
}
const SPANS_END = SPAN_FROM[SPAN_FROM.length - 1] + SPANS[SPANS.length - 1].frames; // 835
const OUTRO_F = DUR - SPANS_END;                                                   // 90
if (OUTRO_F !== Math.round(OUTRO_S * FPS)) throw new Error('outro is not 3.000 s');
const SEAM = SPAN_FROM.slice(1); // [141, 251, 556, 674]

// absolute clock (Sequences re-base useCurrentFrame; every effect here reads the SHORT's absolute frame)
const Clock = createContext(0);
const useAbs = () => useContext(Clock);

// ---------------------------------------------------------------------------------------------------------------------
// 2. COVERS: the variety-rule variants (assets/short/variants.json), full-frame over their overlay_short windows, entered
//    with the SAME ingress the 16:9 used for those slots (TRANSITIONS.md 2: IMG-1 lib:glitchmonitor-2, IMG-5
//    lib:glitchmonitor-5). Windows in SHORT seconds; tIn = the ingress window start, tOut = the next seam.
//    IMG-1: overlay_short 16.005 -> the 16:9 cut lands at short frame 479 (final 59.5), so the glitch-2 window is 471-487
//      (measured: the span's own baked glitch starts at 473), held to the 3->4 seam at 556.
//    IMG-5: overlay_short 18.655 -> its glitch-5 ingress is centred ON the 3->4 seam (556, 0.09 s before the 16:9 cut) so
//      the one hit is both the seam and the ingress, and it hides span 4's head (the 16:9 glitch, mid-flight); held to the
//      4->5 seam at 674 (overlay_short ends 675: clamped to the seam, frame 674 is span 5's first F6 face frame).
//    Captions run over both (16:9-sourced: nothing is burned, the whole short is captioned), hence cap: true.
// ---------------------------------------------------------------------------------------------------------------------
const COVERS = [
  { tIn: 15.7, tOut: 18.5333, kind: 'still', ref: 'IMG-1-feature-module-gauge-vertical', cap: true },   // lib:glitchmonitor-2 ingress
  { tIn: 18.5333, tOut: 22.4667, kind: 'still', ref: 'IMG-5-founder-late-night-desk-vertical', cap: true }, // lib:glitchmonitor-5 ingress (= seam 3->4)
];
const VAR_SRC = (ref: string) => 'variants/' + ref + '.png';
// the same slow push the 16:9 gives its stills (1.00 -> 1.06 over the hold), on the ABSOLUTE clock so the engine's live
// clip and the clean hold render the identical transform at every window edge (comp-build 6a)
const PUSH: Record<string, [number, number]> = {
  'IMG-1-feature-module-gauge-vertical': [471, 556],
  'IMG-5-founder-late-night-desk-vertical': [546, 674],
};
const VariantNode: React.FC<{ refId: string }> = ({ refId }) => {
  const abs = useAbs();
  const [a, b] = PUSH[refId];
  const s = interpolate(abs, [a, b], [1.0, 1.06], clampOpt);
  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <Img src={staticFile(VAR_SRC(refId))} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};
const StillNode: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: 'black' }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

// LIBRARY ENGINES: each TransitionClip gets a Sequence of EXACTLY its engine window (from = cut - round(win/2),
// durationInFrames = win, cutFrame = round(win/2)); sfx={false} (the post-mix owns sound). The outgoing video side is a
// pre-extracted CUTFRAME still (span-03 frame 220 = the window's first frame; frames 219/220 differ by 0.0).
const LIB_TR: { cut: number; id: string; out: () => React.ReactNode; inc: () => React.ReactNode; fromSrc: string; toSrc: string }[] = [
  { cut: 479, id: 'glitchmonitor-2',                                                        // lib:glitchmonitor-2 (glitch-still, 0.52s)
    out: () => <StillNode src="cutframes/span-03-f220.png" />, inc: () => <VariantNode refId="IMG-1-feature-module-gauge-vertical" />,
    fromSrc: 'cutframes/span-03-f220.png', toSrc: VAR_SRC('IMG-1-feature-module-gauge-vertical') },
  { cut: 556, id: 'glitchmonitor-5',                                                        // lib:glitchmonitor-5 (glitch-still, 0.64s) = seam 3->4
    out: () => <VariantNode refId="IMG-1-feature-module-gauge-vertical" />, inc: () => <VariantNode refId="IMG-5-founder-late-night-desk-vertical" />,
    fromSrc: VAR_SRC('IMG-1-feature-module-gauge-vertical'), toSrc: VAR_SRC('IMG-5-founder-late-night-desk-vertical') },
];
const libWin = (id: string) => {
  const row = getTransition(id);
  if (!row) throw new Error('unknown transition id ' + id);
  const win = Math.round(row.durationSeconds * FPS);
  return { win, half: Math.round(win / 2) };
};
// clean variant holds BETWEEN the engine windows
const g2 = libWin('glitchmonitor-2');
const g5 = libWin('glitchmonitor-5');
const HOLDS = [
  { ref: 'IMG-1-feature-module-gauge-vertical', a: 479 - g2.half + g2.win, b: 556 - g5.half },  // 487 -> 546
  { ref: 'IMG-5-founder-late-night-desk-vertical', a: 556 - g5.half + g5.win, b: SEAM[3] },     // 565 -> 674
];
if (Math.round(COVERS[0].tIn * FPS) !== 479 - g2.half) throw new Error('IMG-1 cover tIn != glitch-2 window start');
if (Math.round(COVERS[1].tIn * FPS) !== SEAM[2] || Math.round(COVERS[1].tOut * FPS) !== SEAM[3]) throw new Error('IMG-5 cover != seams');

const CoverTrack: React.FC = () => (
  <>
    {HOLDS.map((h) => (
      <Sequence key={h.ref} from={h.a} durationInFrames={h.b - h.a} name={'cover ' + h.ref}>
        <VariantNode refId={h.ref} />
      </Sequence>
    ))}
    {LIB_TR.map((r) => {
      const { win, half } = libWin(r.id);
      return (
        <Sequence key={r.id} from={r.cut - half} durationInFrames={win} name={'lib:' + r.id}>
          <TransitionClip id={r.id} cutFrame={half} sfx={false} outgoing={r.out} incoming={r.inc} fromSrc={r.fromSrc} toSrc={r.toSrc} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 3. SPANS, end to end, muted, with the seam ZOOM punch on the two real face seams (hand-rolled, ~0.37 s: outgoing punches
//    in 1.00 -> 1.06 over its last 5 frames, incoming settles 1.06 -> 1.00 over its first 6).
// ---------------------------------------------------------------------------------------------------------------------
const ZOOM_SEAMS = [SEAM[0], SEAM[1]]; // 141 (face -> face), 251 (face -> card exit / BR-1)
const zoomAt = (f: number) => {
  for (const s of ZOOM_SEAMS) {
    if (f >= s - 5 && f < s) return 1 + 0.06 * interpolate(f, [s - 6, s - 1], [0, 1], { ...clampOpt, easing: Easing.in(Easing.cubic) });
    if (f >= s && f < s + 6) return 1 + 0.06 * interpolate(f, [s, s + 6], [1, 0], { ...clampOpt, easing: Easing.out(Easing.cubic) });
  }
  return 1;
};
const SpanTrack: React.FC = () => {
  const abs = useAbs();
  const z = zoomAt(abs);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      {SPANS.map((s, k) => {
        const n = s.tailStill ? s.frames - 1 : s.frames;
        return (
          <React.Fragment key={s.i}>
            <Sequence from={SPAN_FROM[k]} durationInFrames={n} name={`span ${s.i} (${s.sourced})`}>
              <OffthreadVideo src={staticFile(s.file)} muted style={{ width: '100%', height: '100%' }} />
            </Sequence>
            {s.tailStill && (
              <Sequence from={SPAN_FROM[k] + n} durationInFrames={1} name={`span ${s.i} tail still`}>
                <StillNode src={s.tailStill} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 4. SEAM FILM BURNS (hand:film-burn, the video's face pick, TRANSITIONS.md 3). The 16:9 burns sit ON several span edges
//    and are baked into the intermediates (measured warmth per frame): span 2 opens on the F2 cut-in burn's DECAY, span 2
//    and span 5 end on a face-out burn's RISE (peak = their last frame), span 5 opens on the F6 cut-in burn's decay. So each
//    seam hit = the baked half + this hand-rolled complementary half, never a second burn stacked on a baked one:
//      141  rise over span 1's last 5 f (span 2's head carries the decay)          + zoom punch
//      251  decay over span 3's first 6 f (span 2's tail carries the rise)          + zoom punch
//      674  rise over the IMG-5 variant's last 12 f, the 16:9 F6 cut-in timing (u = d / 11.4), span 5 carries the decay
//      835  decay over the held last frame into the outro card (span 5 carries the rise)
//    Same radial screen-blend glow as the 16:9 FilmBurn (warm core, ember sweep left to right).
// ---------------------------------------------------------------------------------------------------------------------
const BURN_HALVES: { peak: number; half: number; side: 'rise' | 'decay' }[] = [
  { peak: SEAM[0], half: 5, side: 'rise' },
  { peak: SEAM[1], half: 6, side: 'decay' },
  { peak: SEAM[3], half: 11.4, side: 'rise' },
  { peak: SPANS_END, half: 11.4, side: 'decay' },
];
const BurnLayer: React.FC = () => {
  const abs = useAbs();
  let u: number | null = null;
  for (const b of BURN_HALVES) {
    const d = abs - b.peak;
    if (b.side === 'rise' && d < 0 && d >= -Math.ceil(b.half)) u = d / b.half;
    if (b.side === 'decay' && d >= 0 && d <= Math.ceil(b.half)) u = d / b.half;
  }
  if (u === null || Math.abs(u) > 1) return null;
  const env = Math.pow(1 - Math.abs(u), 1.6);
  const x = 28 + 44 * ((u + 1) / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env,
        background: `radial-gradient(ellipse 95% 70% at ${x}% 45%, rgba(255,240,210,1) 0%, rgba(255,160,50,.95) 26%, rgba(225,80,15,.75) 52%, rgba(120,25,0,0) 86%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env * 0.55,
        background: `radial-gradient(circle at ${100 - x}% 72%, rgba(255,120,30,.9) 0%, rgba(255,60,0,0) 58%)` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 5. OUTRO (longform-to-short.md 4): the last span's final frame held, then the video's ONE card move (rmn:flip, from-right,
//    0.50 s) turns it into a full-frame TITLE-SLIDE card reading exactly "WATCH THE FULL VIDEO" in the locked container
//    stylesheet (bg #0a0c10, Playfair Display 900, locked accent green #00e68a on the key words, gradient divider, accent
//    orb), with a downward arrow. Readable >= 1.0 s asserted. The CTA voice is mixed later (mix_short.py).
// ---------------------------------------------------------------------------------------------------------------------
const FLIP_F = 15;
const HOLD_F = 15;
const CARD_F = OUTRO_F - HOLD_F + FLIP_F; // TransitionSeries: hold + card - flip = OUTRO_F
const CARD_READABLE_S = (OUTRO_F - HOLD_F) / FPS;
if (CARD_READABLE_S < 1.0) throw new Error(`outro card readable ${CARD_READABLE_S}s < 1.0s`);
const HELD = 'cutframes/span-05-f159.png'; // span 5's last real frame (frame 160 is the unpainted black one)

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin((f / FPS) * Math.PI * 1.6) * 14;
  const arrowIn = interpolate(f, [FLIP_F, FLIP_F + 10], [0, 1], { ...clampOpt, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1100, height: 1100, right: -520, top: -460, borderRadius: '50%',
        background: '#00e68a', opacity: 0.16, filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', width: 820, height: 820, left: -380, bottom: -360, borderRadius: '50%',
        background: '#3a4f7a', opacity: 0.18, filter: 'blur(140px)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '0 90px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 148, lineHeight: 1.04,
          letterSpacing: '-0.02em', color: '#e8eaf0', textAlign: 'center', fontVariantNumeric: 'lining-nums' }}>
          WATCH THE<br /><span style={{ color: '#00e68a' }}>FULL VIDEO</span>
        </div>
        <div style={{ width: 96, height: 5, borderRadius: 3, margin: '54px 0 70px',
          background: 'linear-gradient(90deg, #00e68a, #00c2ff)' }} />
        <svg width="150" height="190" viewBox="0 0 150 190" style={{ opacity: arrowIn, transform: `translateY(${bob}px)` }}>
          <path d="M75 8 V160 M18 108 L75 168 L132 108" stroke="#00e68a" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Outro: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={HOLD_F}>
      <StillNode src={HELD} />
    </TransitionSeries.Sequence>
    {/* rmn:flip (card, 0.50s), from-right: the video's ONE card move, on the outro card too */}
    <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: FLIP_F })} />
    <TransitionSeries.Sequence durationInFrames={CARD_F}>
      <OutroCard />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

// ---------------------------------------------------------------------------------------------------------------------
// 6. CAPTIONS (comp-build 8): GrowthVsProductShortCaptions.ts (generated, SHORT seconds), only inside CAPTION_WINDOWS,
//    Montserrat 900 lowercase house style, 12 px black stroke, pop 0.7 -> 1.12 -> 1, bottom-centre in the 9:16 safe zone,
//    TOPMOST.
// ---------------------------------------------------------------------------------------------------------------------
const Captions: React.FC = () => {
  const abs = useAbs();
  const T = abs / FPS;
  if (abs >= SPANS_END) return null; // the last window ends 27.847 s, past the spans (835 f): never a caption on the outro
  if (!CAPTION_WINDOWS.some(([a, b]) => T >= a && T < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) { if (c.t <= T) cur = c; else break; }
  if (!cur) return null;
  const nextT = (ZCAPTIONS.find((c) => c.t > cur!.t) || { t: Infinity }).t;
  if (T >= Math.min(nextT, cur.t + 1.3)) return null;
  const k = (T - cur.t) * FPS;
  const s = interpolate(k, [0, 5, 9], [0.7, 1.12, 1], clampOpt);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 470, pointerEvents: 'none' }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 84,
        color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', lineHeight: 1.05, textAlign: 'center', maxWidth: 980,
        transform: `scale(${s})`, letterSpacing: '0.01em' }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// THE COMPOSITION
// ---------------------------------------------------------------------------------------------------------------------
export const GrowthVsProductShort: React.FC = () => {
  const abs = useCurrentFrame();
  return (
    <Clock.Provider value={abs}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <SpanTrack />
        <CoverTrack />
        <Sequence from={SPANS_END} durationInFrames={OUTRO_F} name="outro WATCH THE FULL VIDEO">
          <Outro />
        </Sequence>
        <BurnLayer />
        <Captions />
      </AbsoluteFill>
    </Clock.Provider>
  );
};
