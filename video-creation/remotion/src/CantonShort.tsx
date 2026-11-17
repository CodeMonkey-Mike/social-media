// CantonShort.tsx: longform-edited `canton` SHORT (16:9-SOURCED mode, no full vertical), comp-builder SHORT mode 2026-11-10.
// Spec: video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B (+ the 16:9-SOURCED MODE notes).
// 1080x1920 @ 30 fps. Three span intermediates (work/span-NN.mp4, video only, painted off the 16:9 comp with captions + pops OFF)
// laid end to end, NEVER a seek into the master; a fast hand:film-burn hit (the video's face pick, TRANSITIONS.md section 3) at
// each seam; the native-vertical K5 card + the face hold from assets/short/vertical-cards.json; the short's captions
// (CantonShortCaptions.ts, SHORT seconds, rendered only inside CAPTION_WINDOWS, exactly as generated); and the outro: the last
// span's final frame held under a full-frame TITLE-SLIDE card "WATCH THE FULL VIDEO" (dark container stylesheet + accents/canton.css).
// NO audio in this comp: mix_short.py lays the crossfaded VO spans, the shared CTA take and the bed.
// Public dir for every render / still: media/canton/_previews/short/work (spans.json lives there).
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { CAPTION_WINDOWS, ZCAPTIONS } from './CantonShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;

// ── the span table: work/spans.json verbatim (out_start -> from = round(out_start * 30); frames = the intermediate's frame count,
//    verified with ffprobe -count_frames: 187 / 216 / 395) ─────────────────────────────────────────────────────────────────
//    lead = the intermediate's first-frame pts in frames (ffprobe start_time): span-03.mp4 starts at pts 0.033008 s, so a plain
//    OffthreadVideo asks for k/30 and gets decoded frame k-1 (it repeated f0, never showed f394, and put the cropped K5 f149 on
//    comp frame 553: caught on the smoke still). startFrom = lead makes comp frame k show decoded frame k for every span.
type Span = { i: number; file: string; from: number; frames: number; lead: number; role: string };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', from: 0, frames: 187, lead: 0, role: 'hook' },     // F1 face, final 0.000-6.245 (start_time 0.000)
  { i: 2, file: 'span-02.mp4', from: 187, frames: 216, lead: 0, role: 'body' },   // F5 face, final 174.130-181.320 (start_time 0.000)
  { i: 3, file: 'span-03.mp4', from: 403, frames: 395, lead: 1, role: 'kicker' }, // K5 card then F8 face, final 283.145-296.325 (start_time 0.033)
];
export const SPANS_FRAMES = 798;                                   // 26.6 s (spans.json spans_total_seconds)
export const DUR = Math.round(30.0 * FPS);                         // 900 = spans 26.6 s + outro 3.4 s (s_comp: target - spans)
const OUTRO_FROM = SPANS_FRAMES;                                   // frame 798
const OUTRO_FRAMES = DUR - SPANS_FRAMES;                           // 102 frames = 3.4 s
if (SPANS.reduce((n, s) => n + s.frames, 0) !== SPANS_FRAMES || SPANS.some((s, k) => k && s.from !== SPANS[k - 1].from + SPANS[k - 1].frames)) {
  throw new Error('CantonShort: the span table is not contiguous');
}

// ── frames INSIDE a span that are not a clean face (MEASURED on the intermediates, 2026-11-10; vertical-cards.json misses them because
//    each is under 1.5 frames on the plan clock): play the adjacent face frame of the SAME clip, frozen. No cropped 16:9 card and no
//    black frame may show (longform-to-short.md 16:9-SOURCED MODE). a/b = span-local frames [a, b), freeze = the span-local face frame.
type SpanHold = { a: number; b: number; freeze: number; why: string };
const SPAN_HOLDS: Record<number, SpanHold[]> = {
  2: [
    { a: 0, b: 1, freeze: 1, why: 'f0 = the cropped 16:9 C1 diagram under the C1 -> F5 film burn (face first at f1)' },
    { a: 215, b: 216, freeze: 214, why: 'f215 = pure black (luma 0.0), the unpainted adapter frame before the CH4 card pause' },
  ],
};

// ── the overlay layer (lint_covers parses this table). Sources, SHORT seconds verbatim:
//    assets/short/variants.json      -> variants: [] (none for this short: no Envato clip, no ChatGPT image inside a span)
//    assets/short/vertical-cards.json -> cards: K5 [13.435, 18.357] · holds: hold-6.13 [6.133, 6.245]
//    Files copied into the public dir under vertical-cards/. Captions run over every span in 16:9-sourced mode, so each row is
//    `cap: true`; the K5 card's text ends at y 1245 and the caption block sits at y ~1420-1600, never on card text.
//    K5 tOut: the json says 18.357 (short frame 551), but span-03 f148-149 (short frames 551-552) still show the CROPPED 16:9 K5
//    under the K5 -> F8 film burn; his face first appears at f150 = short frame 553 = 18.433 s. The hard out moves to that frame.
type Overlay = { tIn: number; tOut: number; kind: 'card' | 'hold' | 'variant'; ref: string; file: string; cap?: boolean };
export const COVERS: Overlay[] = [
  { tIn: 6.133, tOut: 6.245, kind: 'hold', ref: 'hold-6.13', file: 'vertical-cards/hold-6.13.png', cap: true },   // F1 -> C9 burn sliver: span-01 f182 held over f184-186
  { tIn: 13.435, tOut: 18.433, kind: 'card', ref: 'K5', file: 'vertical-cards/K5-homework-v.png', cap: true },      // K5 'The homework', state s3 (three rows lit), native 1080x1920
];
const fr = (t: number) => Math.round(t * FPS);

// ── seam hits: hand:film-burn (TRANSITIONS.md section 3, the video's ONE face pick), warm radial flash peaking ON the cut, ~0.33 s
//    (5 frames each side). The spans already carry the longform's own burns at their edges (F1 -> C9 out, C1 -> F5 in, F5 -> T4 out,
//    F8 -> K5-s4 out), so each seam hit continues a baked burn instead of adding a second look. A 1.06 -> 1 settle on the incoming
//    picture (8 frames) is the zoom half of the hit. The K5 -> F8 row rebuilds the longform's film-burn RISE over the native card
//    (the vertical card carries no burn), cut hard into the span's baked burn peak at f150.
type Burn = { at: number; pre: number; post: number; peak: number; id: string };
const BURNS: Burn[] = [
  { at: SPANS[1].from, pre: 5, post: 5, peak: 0.55, id: 'hand:film-burn seam 1 (F1 hook -> F5 verdict)' },
  { at: SPANS[2].from, pre: 5, post: 5, peak: 0.6, id: 'hand:film-burn seam 2 (F5 verdict -> K5 card)' },
  { at: fr(18.433), pre: 12, post: 0, peak: 0.8, id: 'hand:film-burn K5 card -> F8 face (the longform cut, rise rebuilt on the card)' },
  { at: OUTRO_FROM, pre: 5, post: 5, peak: 0.55, id: 'hand:film-burn seam 3 (F8 -> outro card)' },
];
const burnAt = (f: number) => {
  let k = 0;
  for (const b of BURNS) {
    const x = f - (b.at - 0.5);                                    // the peak sits on the cut, between the last old and first new frame
    const v = x < 0 ? b.peak * (1 - Math.abs(x) / b.pre) : b.post ? b.peak * (1 - x / b.post) : 0;
    k = Math.max(k, v);
  }
  return Math.max(0, k);
};
const SEAM_ZOOM = [SPANS[1].from, SPANS[2].from];
const zoomAt = (f: number) => {
  for (const s of SEAM_ZOOM) {
    if (f >= s && f < s + 8) return interpolate(f, [s, s + 8], [1.06, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' });
  }
  return 1;
};

const FILL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, objectFit: 'cover' };

// A span clip, played linearly (the intermediate IS the span). A hold row swaps in a real <Freeze> of the same clip, wrapped in a
// zero-offset Sequence so the Freeze reads the span-local frame (comp-build.md section 6a rule 1: Remotion 4.0.462 adds the parent
// Sequence's `from` and clamps past DUR - 1). The tree is identical with or without a hold (Freeze `active` toggles it).
const SpanClip: React.FC<{ span: Span }> = ({ span }) => {
  const f = useCurrentFrame();
  const h = (SPAN_HOLDS[span.i] || []).find((x) => f >= x.a && f < x.b);
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={h ? h.freeze : 0} active={!!h}>
        <OffthreadVideo src={staticFile(span.file)} muted startFrom={span.lead} style={FILL} />
      </Freeze>
    </Sequence>
  );
};

const OverlayEl: React.FC<{ o: Overlay }> = ({ o }) => {
  const f = useCurrentFrame();
  if (o.kind === 'variant') {                                      // a native-vertical alternate (none in this short): the Envato 0.5 s fade
    const a = interpolate(f, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const isVid = /\.mp4$/i.test(o.file);
    return <AbsoluteFill style={{ opacity: a }}>{isVid ? <OffthreadVideo src={staticFile(o.file)} muted style={FILL} /> : <Img src={staticFile(o.file)} style={FILL} />}</AbsoluteFill>;
  }
  return <Img src={staticFile(o.file)} style={FILL} />;            // card / hold: hard in and out on the window edges
};

// The outro's held picture: span-03's FINAL frame (f394), frozen (zero-offset Sequence: a bare Freeze under the outro Sequence
// would read 394 + 798 and clamp to DUR - 1, i.e. a K5 frame).
const LAST_SPAN = SPANS[SPANS.length - 1];
const OutroHold: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 15], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `translateX(${-1080 * p}px)` }}>
      <Sequence from={0} layout="none">
        <Freeze frame={LAST_SPAN.frames - 1}>
          <OffthreadVideo src={staticFile(LAST_SPAN.file)} muted startFrom={LAST_SPAN.lead} style={FILL} />
        </Freeze>
      </Sequence>
    </AbsoluteFill>
  );
};

const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const k = burnAt(f);
  if (k <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: k,
      background: 'radial-gradient(ellipse 80% 62% at 34% 46%, rgba(255,222,150,1) 0%, rgba(255,146,46,0.92) 34%, rgba(204,66,12,0.55) 66%, rgba(110,20,0,0) 100%)' }} />
  );
};

// ── the OUTRO card: a TITLE SLIDE (no card box) in the locked container stylesheet, Canton accent (container-canonical.css +
//    accents/canton.css: page #030206 with the navy glow top-left and the violet / mauve glow lower-right, white Playfair Display
//    900 uppercase headline whose second line is the accent word in Canton lime #F3FF97 (the "green" role of the canon is lime in
//    this accent), the lime -> violet gradient divider). Anatomy left-aligned. Text exactly "WATCH THE FULL VIDEO", no em dash.
//    Ingress = the video's card move (TRANSITIONS.md section 1: rmn:slide from the right, hand-rolled here as a push over 0.5 s;
//    the held frame pushes out to the left), after the film burn on the cut. A downward arrow glyph eases in once the card lands.
export const OUTRO_TEXT = 'WATCH THE FULL VIDEO';
const [OUTRO_L1, OUTRO_L2] = [OUTRO_TEXT.split(' ').slice(0, 2).join(' '), OUTRO_TEXT.split(' ').slice(2).join(' ')];
const LIME = '#F3FF97';
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 15], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowA = interpolate(f, [17, 27], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bob = f < 17 ? 0 : Math.sin(((f - 17) / FPS) * Math.PI * 2 / 1.1) * 14;
  return (
    <AbsoluteFill style={{ transform: `translateX(${1080 * (1 - p)}px)`, overflow: 'hidden',
      background: 'radial-gradient(ellipse 62% 58% at 14% 8%, rgba(2,2,71,.95) 0%, rgba(2,2,71,.55) 40%, rgba(2,2,71,0) 75%),'
        + 'radial-gradient(ellipse 42% 40% at 86% 88%, rgba(78,34,201,.30) 0%, rgba(59,30,58,.30) 45%, rgba(59,30,58,0) 78%), #030206' }}>
      <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.03 }} />
      <div style={{ position: 'absolute', left: 100, right: 90, top: 0, bottom: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', paddingBottom: 240 }}>
        <div style={{ fontFamily: `${PLAYFAIR}, 'Playfair Display', serif`, fontWeight: 900, fontSize: 132, lineHeight: 1.06,
          letterSpacing: '-0.02em', wordSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          <div>{OUTRO_L1}</div>
          <div style={{ color: LIME }}>{OUTRO_L2}</div>
        </div>
        <div style={{ width: 96, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,#F3FF97,#875CFF)', margin: '46px 0 54px' }} />
        <svg width={124} height={176} viewBox="0 0 124 176" style={{ opacity: arrowA, transform: `translateY(${bob}px)`, overflow: 'visible',
          filter: 'drop-shadow(0 0 16px rgba(243,255,151,0.35))' }}>
          <line x1={62} y1={10} x2={62} y2={156} stroke={LIME} strokeWidth={14} strokeLinecap="round" />
          <polyline points="14,108 62,160 110,108" fill="none" stroke={LIME} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── captions: CantonShortCaptions.ts (generated by s_captions; SHORT seconds). Rendered ONLY inside CAPTION_WINDOWS, exactly as
//    generated (16:9-sourced: nothing is burned, the windows cover every span). A group holds until its last word ENDS:
//    hide at min(next.t, max(cur.t + 1.3, cur.e), end of its caption window) (longform-to-short.md). House style (comp-build.md section 8, verbatim):
//    Montserrat 900, lowercase, 12 px black stroke, paint-order stroke fill, pop 0.7 -> 1.12 -> 1, bottom-centre, TOPMOST.
//    SAFE ZONE: bottom pad 320 px (block at y ~1420-1600), maxWidth 860 so the 1.12 pop + stroke stay inside 1080.
const CAP_BOTTOM = 320;
const CAP_MAXW = 860;
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let idx = -1;
  for (let i = 0; i < ZCAPTIONS.length; i++) {
    if (ZCAPTIONS[i].t <= t + 1e-9) idx = i;
    else break;
  }
  if (idx < 0) return null;
  const cur = ZCAPTIONS[idx];
  const nextT = idx + 1 < ZCAPTIONS.length ? ZCAPTIONS[idx + 1].t : Infinity;
  // never past the end of the caption window holding cur.t (final visual-qa 2026-11-10: 'network they join.' held 8 frames
  // past the span-2/span-3 seam, because the two spans' windows abut)
  const win = CAPTION_WINDOWS.find(([a, b]) => cur.t >= a - 1e-6 && cur.t < b);
  const winEnd = win ? win[1] : Infinity;
  if (t >= Math.min(nextT, Math.max(cur.t + 1.3, cur.e), winEnd)) return null;
  const lf = (t - cur.t) * FPS;
  const s = interpolate(lf, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: CAP_BOTTOM, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ maxWidth: CAP_MAXW, textAlign: 'center', fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900,
        fontSize: 84, lineHeight: 1.08, letterSpacing: '0.01em', color: '#FFFFFF', textTransform: 'lowercase', WebkitTextStroke: '12px #000',
        paintOrder: 'stroke fill', transform: `scale(${s})`, transformOrigin: '50% 100%' }}>
        {cur.h}
      </div>
    </div>
  );
};

export const CantonShort: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* picture: spans + overlays + the outro hold, with the seam settle */}
      <AbsoluteFill style={{ transform: `scale(${zoomAt(f)})`, transformOrigin: '50% 50%' }}>
        {SPANS.map((s) => (
          <Sequence key={s.file} from={s.from} durationInFrames={s.frames}>
            <SpanClip span={s} />
          </Sequence>
        ))}
        {COVERS.map((o) => (
          <Sequence key={o.ref} from={fr(o.tIn)} durationInFrames={fr(o.tOut) - fr(o.tIn)}>
            <OverlayEl o={o} />
          </Sequence>
        ))}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
          <OutroHold />
        </Sequence>
      </AbsoluteFill>
      <FilmBurn />
      <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
        <OutroCard />
      </Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
