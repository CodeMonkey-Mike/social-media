// RetireEarlyShort.tsx: longform-edited `retire-early` SHORT, 1080x1920 @30 (longform-to-short.md §5 Stage B).
// 16:9-SOURCED MODE (assets/short/from-16x9.json; Mike 2026-10-11 skipped the full vertical): the four span intermediates
// in the public dir (_previews/short/work) were cut frame-exact out of the adapter VERTICAL master by short_extract_spans.py.
// This comp lays them end to end, ONE muted OffthreadVideo per span-NN.mp4 (never a seek into the master), with:
//   · a fast seam hit at every span seam, from the video's own transition family (TRANSITIONS.md):
//       seam 1 (5.133 s) = the IMG-2 variant's ingress lib:glitchoffset-1x, the SAME ingress IMG-2 got at 0:56.9 in the
//                          16:9 (TRANSITIONS.md §2), run over PRE-EXTRACTED cut frames (cutframes/) + the variant still,
//                          never over live video (comp-build §6a cost trap);
//       seams 2 + 3        = hand:film-burn (the video's face-cut pick, §3), 0.30 s, + a hand-rolled 1.06 -> 1 zoom settle;
//   · the variant overlay (assets/short/variants.json, Mike's variety rule) full-frame over its overlay_short window;
//   · captions (RetireEarlyShortCaptions.ts, SHORT seconds) ONLY inside CAPTION_WINDOWS, Montserrat house style, TOPMOST;
//   · the outro: the last 3.000 s hold span 4's last good frame and flip in (rmn:flip from-right, the video's card move,
//     TRANSITIONS.md §1) a full-frame TITLE SLIDE reading "WATCH THE FULL VIDEO" (locked container stylesheet).
// NO audio in this comp (no music, no SFX, no VO): mix_short.py adds the span VO, the shared CTA take and the bed.
// No watermark.
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
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
import { getTransition, framesForRow } from './transitions';
import { CAPTION_WINDOWS, ZCAPTIONS } from './RetireEarlyShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
const W = 1080;
const H = 1920;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const FILL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover' };

// ============================================================================ the span table (work/spans.json, verbatim)
// out = round(out_start * 30); frames = the intermediate's frame count (ffprobe -count_frames, verified 154/74/445/161).
// good = frames that carry a real picture, MEASURED (per-frame luma, 2026-10-11): the adapter VERTICAL painted each span one
// frame short, so span 2 frame 73 and span 3 frame 444 are BLACK (luma 16); span 4 frames 155-158 are the as-filmed screen
// share (SHORT-CUT-PLAN risks[2], the F11 cut) and 159-160 are black. Every frame at or past `good` HOLDS the last good frame
// (a <Freeze>, picture only; the VO is untouched, nothing is re-timed).
type Span = { i: number; file: string; outS: number; out: number; frames: number; good: number; role: string; sourced: 'FACE' | 'COVER' };
const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outS: 0.0, out: 0, frames: 154, good: 154, role: 'hook', sourced: 'FACE' },
  { i: 2, file: 'span-02.mp4', outS: 5.1333, out: 154, frames: 74, good: 73, role: 'body', sourced: 'COVER' },
  { i: 3, file: 'span-03.mp4', outS: 7.6, out: 228, frames: 445, good: 444, role: 'body', sourced: 'FACE' },
  { i: 4, file: 'span-04.mp4', outS: 22.4333, out: 673, frames: 161, good: 155, role: 'kicker', sourced: 'FACE' },
];
SPANS.forEach((s, k) => {
  if (Math.round(s.outS * FPS) !== s.out) throw new Error(`span ${s.i}: out ${s.out} != round(out_start*30)`);
  if (k > 0 && s.out !== SPANS[k - 1].out + SPANS[k - 1].frames) throw new Error(`span ${s.i} does not butt onto span ${s.i - 1}`);
  if (s.good < 1 || s.good > s.frames) throw new Error(`span ${s.i}: bad good-frame count`);
});
const SPANS_END = SPANS[SPANS.length - 1].out + SPANS[SPANS.length - 1].frames;   // 834 = 27.800 s
const OUTRO_S = 3.0;
export const DUR = Math.round(30.8 * FPS);                                         // 924 = spans 27.800 s + 3.000 s outro
const OUTRO_F = DUR - SPANS_END;
if (OUTRO_F !== Math.round(OUTRO_S * FPS)) throw new Error(`outro is ${OUTRO_F} frames, expected ${OUTRO_S * FPS}`);

// ============================================================================ COVERS (overlays over the span track)
// SHORT seconds. The variant still replaces span 2's centre-cropped 16:9 IMG-2 for its whole window (variants.json
// overlay_short [5.14, 7.61] -> frames 154..228 = exactly span 2). cap: true = the 16:9-sourced short is captioned end to
// end (nothing is burned in), so the caption window over this still is deliberate. The outro card is a code-rendered
// TITLE SLIDE (one solo state).
type Cover = { tIn: number; tOut: number; kind: 'still' | 'deck'; ref: string; cap?: boolean; state?: string; ingress?: string };
const COVERS: Cover[] = [
  { tIn: 5.14, tOut: 7.61, kind: 'still', ref: 'IMG-2-glass-door-closing-vert', cap: true, ingress: 'glitchoffset-1x' },   // lib:glitchoffset-1x ingress (= 16:9 IMG-2 @0:56.9)
  { tIn: 27.8, tOut: 30.8, kind: 'deck', ref: 'OUTRO-watch-full', state: 'cta' },                                       // rmn:flip from-right ingress
];
const fr = (t: number) => Math.round(t * FPS);
const VARIANT = COVERS[0];
const V_IN = fr(VARIANT.tIn);    // 154
const V_OUT = fr(VARIANT.tOut);  // 228
if (V_IN !== SPANS[1].out || V_OUT !== SPANS[2].out) throw new Error('variant window drifted off span 2');
if (fr(COVERS[1].tIn) !== SPANS_END || fr(COVERS[1].tOut) !== DUR) throw new Error('outro cover drifted off the outro window');

// ============================================================================ one ABSOLUTE clock (comp-build §6a)
// Nodes handed to a library engine are re-mounted inside nested Sequences, so they read the composition frame from here.
const AbsCtx = createContext(0);

// ============================================================================ the span track
const SEAM_ZOOM_F = 7;   // hand-rolled zoom settle on the incoming span at a film-burn seam (1.06 -> 1)
const SpanClip: React.FC<{ s: Span; zoomIn: boolean }> = ({ s, zoomIn }) => {
  const f = useCurrentFrame();   // local to this span's Sequence
  const video = <OffthreadVideo src={staticFile(s.file)} muted style={FILL} />;
  const z = zoomIn ? interpolate(f, [0, SEAM_ZOOM_F], [1.06, 1], { ...CL, easing: Easing.out(Easing.cubic) }) : 1;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: '50% 42%' }}>
        {f < s.good ? video : <Freeze frame={s.good - 1}>{video}</Freeze>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// seams 2 + 3 get the film burn + zoom; seam 1 is the variant's glitch ingress (the variant covers span 2 whole)
const BURN_SEAMS = SPANS.slice(1).map((s) => s.out).filter((f) => f !== V_IN);   // [228, 673]
const SpanTrack: React.FC = () => (
  <>
    {SPANS.map((s) => (
      <Sequence key={`span-${s.i}`} from={s.out} durationInFrames={s.frames}>
        <SpanClip s={s} zoomIn={BURN_SEAMS.includes(s.out)} />
      </Sequence>
    ))}
  </>
);

// ============================================================================ the variant overlay (IMG-2, native 9:16)
// Slow push 1.00 -> 1.04 over its window on the ABSOLUTE clock (the same node is the engine's incoming side).
const VariantStill: React.FC = () => {
  const abs = useContext(AbsCtx);
  const z = interpolate(abs, [V_IN, V_OUT], [1.0, 1.04], CL);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img src={staticFile(`variants/${VARIANT.ref}.png`)}
        style={{ ...FILL, transform: `scale(${z})`, transformOrigin: '50% 48%' }} />
    </AbsoluteFill>
  );
};

// lib:glitchoffset-1x engine window: EXACTLY `win` frames, placed so the engine's own swap frame lands ON the seam (154).
// Outgoing = span 1's pre-extracted cut frames (cutframes/span-01-f150..153.png, one per frame, so the face still plays
// through the 4 outgoing frames), incoming = the variant node on the absolute clock. sfx={false}: no SFX in the comp.
const ING_ROW = getTransition(VARIANT.ingress!);
if (!ING_ROW) throw new Error(`unknown transition ${VARIANT.ingress}`);
const ING_WIN = framesForRow(ING_ROW, FPS);                                         // 12
const ING_SWAP = (() => {                                                           // first engine frame showing the incoming
  const swapAt = Number((ING_ROW.params as { swapAt: number }).swapAt);
  for (let f = 0; f < ING_WIN; f++) if (f / Math.max(1, ING_WIN - 1) >= swapAt) return f;
  return ING_WIN;
})();                                                                               // 4
const ING_START = V_IN - ING_SWAP;                                                  // 150
const CUT_FIRST = ING_START - SPANS[0].out;                                         // span-01 local 150
const CUT_LAST = V_IN - 1 - SPANS[0].out;                                           // span-01 local 153
const CutFrameStill: React.FC = () => {
  const abs = useContext(AbsCtx);
  const n = Math.max(CUT_FIRST, Math.min(CUT_LAST, abs - SPANS[0].out));
  return <Img src={staticFile(`cutframes/span-01-f${n}.png`)} style={FILL} />;
};
const VariantLayer: React.FC = () => (
  <>
    <Sequence from={V_IN} durationInFrames={V_OUT - V_IN}>
      <VariantStill />
    </Sequence>
    {/* lib:glitchoffset-1x : span 1 (FACE) -> IMG-2 variant, swap ON frame 154 */}
    <Sequence from={ING_START} durationInFrames={ING_WIN}>
      <TransitionClip id={VARIANT.ingress!} cutFrame={Math.round(ING_WIN / 2)} sfx={false}
        outgoing={() => <CutFrameStill />} incoming={() => <VariantStill />} />
    </Sequence>
  </>
);

// ============================================================================ seam hits: hand:film-burn (0.30 s)
// The video's warm optical flash (its face-cut pick), PEAKING on the seam frame; the hard cut hides under it.
const BURN_F = 9;                     // 0.30 s
const BURN_PEAK = Math.floor(BURN_F / 2);
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const x = (f - BURN_PEAK) / Math.max(1, f < BURN_PEAK ? BURN_PEAK : BURN_F - 1 - BURN_PEAK);   // -1 .. 0 .. 1
  const a = Math.pow(Math.max(0, Math.min(1, 1 - Math.abs(x))), 1.4);
  const sweep = interpolate(f, [0, BURN_F - 1], [22, 78], CL);   // the burn travels across the frame
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: a,
        background: `radial-gradient(ellipse 95% 70% at ${sweep}% 48%, rgba(255,214,140,1) 0%, rgba(255,146,40,.95) 28%, rgba(226,72,8,.75) 52%, rgba(120,18,0,.35) 74%, rgba(0,0,0,0) 92%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55 * a,
        background: 'linear-gradient(170deg, rgba(255,110,20,.9) 0%, rgba(255,170,60,.5) 45%, rgba(255,80,0,.85) 100%)' }} />
      <AbsoluteFill style={{ opacity: Math.pow(a, 3) * 0.85,
        background: `radial-gradient(ellipse 80% 55% at ${sweep}% 45%, rgba(255,246,226,1) 0%, rgba(255,230,190,.85) 40%, rgba(255,200,140,0) 85%)` }} />
    </AbsoluteFill>
  );
};
const SeamBurns: React.FC = () => (
  <>
    {BURN_SEAMS.map((seam) => (
      // hand:film-burn @ seam (0.30 s, peak on the seam frame)
      <Sequence key={`burn-${seam}`} from={seam - BURN_PEAK} durationInFrames={BURN_F}>
        <FilmBurn />
      </Sequence>
    ))}
  </>
);

// ============================================================================ the outro: held last frame -> TITLE SLIDE
// rmn:flip from-right over 12 frames (the chapter cards' move and timing in the 16:9), starting ON the outro's first frame;
// a self-contained scene of a FROZEN still -> the card (nothing live is wrapped in TransitionSeries). The card lands at
// 28.200 s and is readable for the remaining 2.6 s.
const OUTRO_IN_F = 12;
const LAST = SPANS[SPANS.length - 1];
const HeldLast: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <Freeze frame={LAST.good - 1}>
    <OffthreadVideo src={staticFile(LAST.file)} muted style={{ ...FILL, ...style }} />
  </Freeze>
);
const ArrowDown: React.FC<{ bob: number }> = ({ bob }) => (
  <svg width={132} height={176} viewBox="0 0 132 176" style={{ transform: `translateY(${bob}px)`, overflow: 'visible' }}>
    <path d="M66 10 L66 156" stroke="#00e68a" strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d="M16 106 L66 158 L116 106" stroke="#00e68a" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
// Locked container stylesheet (skills/container-reference/container-canonical.css): --bg-deep #0a0c10, Playfair Display 900
// headline in --text-primary #e8eaf0 with the key words in --accent-green #00e68a, the green -> cyan divider, one blurred
// accent orb, LEFT-aligned. TITLE SLIDE = no card box, here over the held last frame (blurred, under the dark bg).
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();   // local to the card's TransitionSeries.Sequence (0 = outro start)
  const bob = f < OUTRO_IN_F ? 0 : 14 * Math.sin(((f - OUTRO_IN_F) / FPS) * 2 * Math.PI / 0.9);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <HeldLast style={{ filter: 'blur(26px)', transform: 'scale(1.08)' }} />
      <AbsoluteFill style={{ backgroundColor: 'rgba(10,12,16,0.86)' }} />
      <div style={{ position: 'absolute', width: 760, height: 760, borderRadius: '50%', right: -260, top: 260,
        background: '#00e68a', filter: 'blur(160px)', opacity: 0.22 }} />
      <AbsoluteFill style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        padding: '0 96px', paddingBottom: 300 }}>
        <div style={{ fontFamily: `${PLAYFAIR}, 'Playfair Display', serif`, fontWeight: 900, fontSize: 132, lineHeight: 1.04,
          letterSpacing: '-0.02em', color: '#e8eaf0' }}>
          WATCH THE<br />
          <span style={{ color: '#00e68a' }}>FULL VIDEO</span>
        </div>
        <div style={{ width: 66, height: 4, borderRadius: 2, margin: '44px 0 56px',
          background: 'linear-gradient(90deg, #00e68a, #00c2ff)' }} />
        <ArrowDown bob={bob} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={OUTRO_IN_F}>
        <HeldLast />
      </TransitionSeries.Sequence>
      {/* rmn:flip from-right : held last frame -> WATCH THE FULL VIDEO card */}
      <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: OUTRO_IN_F, easing: Easing.inOut(Easing.cubic) })} />
      <TransitionSeries.Sequence durationInFrames={OUTRO_F}>
        <OutroCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// ============================================================================ captions (§8 Montserrat house style, TOPMOST)
// ONLY inside CAPTION_WINDOWS (the COVER-sourced frames; in 16:9-sourced mode that is every span frame, nothing is burned).
// CAPTION_SRC mirrors the generated windows for lint_covers.py.
const CAPTION_SRC: [number, number][] = [[0.000, 5.140], [5.133, 7.603], [7.600, 22.430], [22.433, 27.788]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from RetireEarlyShortCaptions.CAPTION_WINDOWS');
const CAPWIN = CAPTION_WINDOWS.map(([a, b]) => [fr(a), fr(b)] as [number, number]);   // frame-exact
// The generator double-escapes apostrophes (`it\\\'ll` in the .ts = the string "it\'ll"): strip the stray backslash at
// render; the words themselves are never retyped.
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h.replace(/\\(?=')/g, '') }));
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPWIN.some(([a, b]) => frame >= a && frame < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t + 1e-6) cur = c; else break; }
  if (!cur) return null;
  const nxt = CAPS.find((c) => c.tf > cur!.tf);
  if (t >= Math.min(nxt ? nxt.tf : Infinity, cur.tf + 1.3)) return null;   // hold to the next phrase, clear on a gap
  const df = (t - cur.tf) * FPS;
  const pop = interpolate(df, [0, 4, 9], [0.7, 1.12, 1], CL);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 470, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, fontSize: 90, lineHeight: 1.08,
        textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        textAlign: 'center', maxWidth: 960, transform: `scale(${pop})`, transformOrigin: '50% 80%' }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ============================================================================ the composition
export const RetireEarlyShort: React.FC = () => {
  const abs = useCurrentFrame();
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <SpanTrack />
        <VariantLayer />
        <SeamBurns />
        <Sequence from={SPANS_END} durationInFrames={OUTRO_F}>
          <OutroScene />
        </Sequence>
        <Captions />
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};
