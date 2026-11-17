// AIVsMLShort.tsx: the ~30 s SHORT of "AI vs ML" (longform-edited, AI Engineering Simplified), built 2026-11-11 by the
// comp-builder in SHORT mode per longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B.
// A CONDENSATION, not a new edit: the picture is the three span intermediates cut from the delivered VERTICAL master
// (AI vs ML-VERTICAL.mp4; this is NOT 16:9-sourced mode: no assets/short/from-16x9.json, no vertical-cards.json), laid end
// to end, plus the four things the lane adds:
//   1. a fast seam hit at each span join, from the video's OWN transition family (TRANSITIONS.md: hand:kt-whip-cut);
//   2. the short's house captions, inside AIVsMLShortCaptions.ts CAPTION_WINDOWS (short seconds);
//   3. the variety overlays of assets/short/variants.json (IMG-1, IMG-4, BR-9), each with the ingress the vertical used;
//   4. the outro: the last span's final frame held under a full-frame TITLE SLIDE "WATCH THE FULL VIDEO".
// Public dir = _previews/short/work (span-NN.mp4, variants/, cutframes/). Every OffthreadVideo is a small linear clip, never
// a seek into the master. NO audio in the comp: mix_short.py lays the span VO (spine), the shared CTA take and a bed.
// Times: SHORT seconds / frames (frame / 30). Span-relative facts are mapped from the vertical's own frame numbers.
import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { CL, KtClock, KtWhipCut, useKtTime } from './effects/kinetic-text';
import { CAPTION_WINDOWS, ZCAPTIONS } from './AIVsMLShortCaptions';
import { wobbleCss } from './AIVsMLKit';
import { DownArrow, HeadlinePopV, VFULL, VH, VW } from './AIVsMLVerticalKit';

loadMontserrat('italic', { weights: ['800', '900'], subsets: ['latin'] }); // KtTextBlock (the redrawn IMG-1 headline)
loadMontserrat('normal', { weights: ['700', '800', '900'], subsets: ['latin'] }); // house captions (900)
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] }); // the outro TITLE SLIDE headline
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// =====================================================================================================================
// 1. THE SPAN TABLE (_previews/short/work/spans.json, verbatim) + timing
// =====================================================================================================================
export const FPS = 30;
type Span = { i: number; file: string; frames: number; outStart: number; srcStart: number; srcEnd: number; sourced: 'FACE' | 'COVER'; role: string };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', frames: 247, outStart: 0.0, srcStart: 0.005, srcEnd: 8.25, sourced: 'FACE', role: 'hook' },
  { i: 2, file: 'span-02.mp4', frames: 358, outStart: 8.2333, srcStart: 110.72, srcEnd: 122.65, sourced: 'COVER', role: 'body' },
  { i: 3, file: 'span-03.mp4', frames: 199, outStart: 20.1667, srcStart: 123.7, srcEnd: 130.35, sourced: 'FACE', role: 'kicker' },
];
/** each span's first frame in the short: the running sum of frames (asserted against spans.json out_start) */
const START: number[] = SPANS.map((_, k) => SPANS.slice(0, k).reduce((s, x) => s + x.frames, 0));
SPANS.forEach((s, k) => {
  if (Math.round(s.outStart * FPS) !== START[k]) throw new Error(`AIVsMLShort: span ${s.i} out_start ${s.outStart} != frame ${START[k]}`);
});
const SPAN_FRAMES = START[SPANS.length - 1] + SPANS[SPANS.length - 1].frames; // 804 = 26.800 s (spans.json spans_total_seconds)
const TARGET_S = 30.0; // run.py short --seconds (s_comp: DUR = round(30.000 * 30))
export const DUR = Math.round(TARGET_S * FPS); // 900
const OUTRO_FROM = SPAN_FRAMES; // 804
const OUTRO_FRAMES = DUR - SPAN_FRAMES; // 96 = 3.200 s (the outro absorbs the rounding: target - spans)
if (OUTRO_FRAMES < 90) throw new Error(`AIVsMLShort: outro ${OUTRO_FRAMES} frames, under 3 s`);
const Fr = (t: number) => Math.round(t * FPS);

/** the VERTICAL master frame shown on each span's frame 0. MEASURED (mean abs diff of span frame 0 against master frames,
 * 2026-11-11): span-01 -> master 1 (0.15; the -ss 0.005 seek drops master frame 0), span-02 -> 3322 (0.06), span-03 -> 3711
 * (0.16, = the vertical's F6 whip cut-in frame F(123.7)). */
const SPAN_MASTER0 = [1, 3322, 3711];
/** a vertical master frame -> the short frame that shows it, inside span k (0-based) */
const toShort = (k: number, masterFrame: number) => Math.max(0, START[k] + masterFrame - SPAN_MASTER0[k]);
/** the vertical comp's F() for a cover cut (sh(t) = t, no pauses): Math.round(t * 30) */
const cutF = (t: number) => Math.round(t * FPS);
/** the first vertical frame a KT device keyed at t shows on (useKtTime reads 1 ms late-proof) */
const ktOn = (t: number) => Math.ceil((t - 0.001) * FPS - 1e-6);

// =====================================================================================================================
// 2. SEAMS (TRANSITIONS.md: the video's ONE face pick + headline landing move is hand:kt-whip-cut, the incoming shot
//    200 -> 100 percent over 0.37 s; lens off + 360-degree shutter on, exactly as the vertical wires it)
//    seam 1 (frame 247, span 1 IMG-1 -> span 2 C3 chart): hand:kt-whip-cut wrapped round span 2's first 11 frames.
//    seam 2 (frame 605, span 2 BR-9 -> span 3 F6 face): span-03 OPENS on the vertical's own F6 cut-in, hand:kt-whip-cut,
//    baked into its frames 0-10 (span 3 starts on F(123.7) = master 3711, measured), so the hit is already in the picture.
//    A second wrapper there would compound the zoom to 4x: the comp adds nothing on that seam.
// =====================================================================================================================
const SEAM_WHIP: Record<number, boolean> = { 1: true, 2: false };
const WHIP_LENS = false; // as the vertical (AIVsMLVertical WHIP_LENS)
const WHIP_BLUR = true;

// =====================================================================================================================
// 3. VARIANT OVERLAYS (assets/short/variants.json; Mike's variety rule): the file full-frame over its overlay_short window,
//    copied into the public dir under variants/. tr = the ingress the VERTICAL used for that beat (AIVsMLVertical COVERS:
//    IMG-1 hand:kt-whip-cut @5.25, IMG-4 hand:fade 0.33 s @117.18, BR-9 hand:kt-whip-cut @119.75). The vertical's own look
//    on that beat is kept: stills get its slow 1 -> 1.06 push + the kt-camera-wobble (StillView), IMG-1 its top shade, the
//    25 fps clip plays frame-for-frame (playbackRate 30 / 25). cap: true = the short captions run over them ON PURPOSE
//    (a short is captioned end to end; longform-to-short.md "Captions"). BR-1 and BR-10 were AUTO-WAIVED by s_variants
//    (variant-waivers.json): those beats show the vertical's own asset.
// =====================================================================================================================
type Cover = { tIn: number; tOut: number; kind: 'still' | 'vid'; ref: string; cap: true; file: string; tr: 'hand:kt-whip-cut' | 'hand:fade'; cut: number; fps?: number; shade?: string };
export const COVERS: Cover[] = [
  { tIn: 5.245, tOut: 8.245, kind: 'still', ref: 'IMG-1', cap: true, file: 'variants/IMG-1-cash-stacks-alt.png', tr: 'hand:kt-whip-cut', cut: toShort(0, cutF(5.25)),
    shade: 'linear-gradient(180deg, rgba(4,10,22,0.78) 0%, rgba(4,10,22,0.62) 22%, rgba(4,10,22,0.0) 38%)' },
  { tIn: 14.705, tOut: 17.275, kind: 'still', ref: 'IMG-4', cap: true, file: 'variants/IMG-4-three-chairs-alt.png', tr: 'hand:fade', cut: toShort(1, cutF(117.18)) },
  { tIn: 17.275, tOut: 20.175, kind: 'vid', ref: 'BR-9', cap: true, file: 'variants/BR-9-scientist-presenting-data.mp4', tr: 'hand:kt-whip-cut', cut: toShort(1, cutF(119.75)), fps: 25 },
];
const FADE_IN = 0.33; // hand:fade (the vertical's FADE_IN, the ONE soft move of the video)
/** the C3 frame the vertical's IMG-4 fade starts from (span-02 frame 193 = master 3515, opacity 0): held UNDER the variant
 * while it fades, so the vertical's own chairs (already fading in on the live span) never bleed through the variant */
const FADE_UNDER: Record<string, string> = { 'IMG-4': 'cutframes/span-02-f193.png' };
for (const c of COVERS) {
  // the overlay window must start within one frame of the vertical's cut, and never cross a seam
  if (Math.abs(Fr(c.tIn) - c.cut) > 1) throw new Error(`AIVsMLShort: variant ${c.ref} window ${Fr(c.tIn)} is off the vertical cut ${c.cut}`);
  const k = START.findIndex((s, i) => Fr(c.tIn) >= s && Fr(c.tIn) < s + SPANS[i].frames);
  if (k < 0 || Fr(c.tOut) > START[k] + SPANS[k].frames) throw new Error(`AIVsMLShort: variant ${c.ref} crosses a seam`);
}

// =====================================================================================================================
// 4. CAPTIONS: ZCAPTIONS + CAPTION_WINDOWS as generated (short seconds), the section 8 Montserrat style verbatim, in the
//    SAFE ZONE (block bottom at y 1600 = bottom pad 320; maxWidth 860 so the 1.12 pop + the 12 px stroke stay inside 1080).
//    A group holds until min(next.t, max(t + 1.3, e), the end of the CAPTION_WINDOWS window holding its t, the end of its span).
//    DEVIATION (flagged in the report): the vertical BURNS on-screen text that SAYS the spoken words in the caption slot in
//    three places s_captions did not exempt (it exempts assets/captions.json windows, the house captions; the vertical's
//    kt-caption-highlight line + KT word devices are not in that file). Doubling them would put the short's caption ON that
//    text and read every word twice, so the short shows no caption while the vertical's own text carries the words
//    (exactly what the approved vertical shows there). A group whose t falls inside one is dropped whole (never pops late).
// =====================================================================================================================
const BURNED: { a: number; b: number; what: string }[] = [
  // F1 the signature open: KtKeywordPop AI ENGINEER (0.483, y 1400) + ML ENGINEER (1.6, y 1560) to the whip at F(2.567)
  { a: 0, b: toShort(0, cutF(2.567)), what: 'F1 labels AI ENGINEER / ML ENGINEER' },
  // C3 kt-word-by-word AND IT GOES TO (114.54) / THE PEOPLE WHO (115.3), centred (540, 1595), until the payoff TRAIN (116.06)
  { a: toShort(1, ktOn(114.54)), b: toShort(1, ktOn(116.06)), what: 'C3 word-by-word AND IT GOES TO / THE PEOPLE WHO' },
  // F6: the kt caption line THEREFORE, FOR MOST DEVELOPERS (CAPTION_SRC 123.7-125.865) + the AI ENGINEERING pop (125.865-127.533, y 1520)
  { a: toShort(2, cutF(123.7)), b: toShort(2, cutF(127.533)), what: 'F6 kt caption line + AI ENGINEERING pop' },
];
const CAP = { bottom: 320, maxW: 860, fontSize: 80, lineHeight: 1.08 };
const CAP_FONT = "Montserrat,'Arial Black','Segoe UI',sans-serif";
const inWins = (t: number, wins: [number, number][]) => wins.some(([a, b]) => t >= a && t < b);
const burnedAt = (frame: number) => BURNED.some((w) => frame >= w.a && frame < w.b);
const windowEnd = (t: number) => (CAPTION_WINDOWS.find(([a, b]) => t >= a && t < b) ?? [0, Infinity])[1];
/** the end (seconds) of the span holding t. The generated windows are continuous-time (8.245, 26.817) while the seams are
 * frame-exact (8.2333, 26.8): without this a group held 1 frame onto the seam whip ('is huge.' on frame 247) and onto the
 * outro (frame 804). The lane's rule: a caption never crosses a span seam (longform-to-short.md, canton 2026-11-10). */
const spanEnd = (t: number) => {
  const f = Math.max(0, Math.round(t * FPS));
  const k = START.findIndex((s, i) => f >= s && f < s + SPANS[i].frames);
  return k < 0 ? SPAN_FRAMES / FPS : (START[k] + SPANS[k].frames) / FPS;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!inWins(t, CAPTION_WINDOWS) || burnedAt(frame)) return null;
  let i = -1;
  for (let k = 0; k < ZCAPTIONS.length; k++) {
    if (ZCAPTIONS[k].t <= t) i = k;
    else break;
  }
  if (i < 0) return null;
  const cur = ZCAPTIONS[i];
  if (burnedAt(Math.round(Math.max(0, cur.t) * FPS))) return null;
  const next = i + 1 < ZCAPTIONS.length ? ZCAPTIONS[i + 1].t : Infinity;
  const end = Math.min(next, Math.max(cur.t + 1.3, cur.e), windowEnd(Math.max(0, cur.t)), spanEnd(cur.t));
  if (t >= end) return null;
  const df = frame - Math.max(0, Math.ceil(cur.t * FPS - 1e-6)); // frames since the group's first frame
  const s = interpolate(df, [0, 5, 9], [0.7, 1.12, 1], CL);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, width: VW, bottom: CAP.bottom, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: CAP.maxW,
            textAlign: 'center',
            fontFamily: CAP_FONT,
            fontWeight: 900,
            fontSize: CAP.fontSize,
            lineHeight: CAP.lineHeight,
            color: '#FFFFFF',
            textTransform: 'lowercase',
            WebkitTextStroke: '12px #000',
            paintOrder: 'stroke fill',
            transform: `scale(${s})`,
            transformOrigin: '50% 50%',
          }}
        >
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// 5. THE OUTRO: the last span's final frame (span-03 frame 198, pre-extracted) held under a full-frame TITLE SLIDE in the
//    locked container stylesheet (skills/container-reference/container-canonical.css, dark: --bg-deep, the blurred accent
//    orb, the grain, Playfair Display 900 headline with the accent key words in --accent-green, the green -> cyan divider),
//    reading exactly WATCH THE FULL VIDEO, + a downward arrow glyph. Entrance = the container cross-fade + 0.93 -> 1
//    scale-in (comp-build section 5) over 11 frames; the arrow bobs so the card is never a dead still.
// =====================================================================================================================
const CSS = { bgDeep: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', text: '#e8eaf0' };
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const OUTRO_HOLD = 'cutframes/span-03-last.png';
const OUTRO_IN = 11;

const OutroCard: React.FC = () => {
  const f = useCurrentFrame(); // relative to the outro Sequence
  const a = interpolate(f, [0, OUTRO_IN], [0, 1], CL);
  const s = interpolate(f, [0, OUTRO_IN], [0.93, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const bob = 16 * Math.sin((2 * Math.PI * Math.max(0, f - OUTRO_IN)) / 27); // a 0.9 s nudge downward
  return (
    <AbsoluteFill style={{ opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <div style={{ ...VFULL, background: CSS.bgDeep, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -260, top: 560, width: 900, height: 900, borderRadius: '50%', background: CSS.green, filter: 'blur(160px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: 96, right: 96, top: 640 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 136, lineHeight: 1.07, letterSpacing: '-0.02em', wordSpacing: '0.12em', color: CSS.text }}>
            WATCH THE
            <br />
            <span style={{ color: CSS.green }}>FULL VIDEO</span>
          </div>
          <div style={{ width: 110, height: 7, borderRadius: 4, background: `linear-gradient(90deg, ${CSS.green}, ${CSS.cyan})`, margin: '52px 0 44px' }} />
          <div style={{ transform: `translateY(${bob}px)`, width: 120 }}>
            <DownArrow w={200} color={CSS.green} />
          </div>
        </div>
        <div style={{ ...VFULL, opacity: 0.03, backgroundImage: GRAIN, pointerEvents: 'none' }} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// 6. LAYERS
// =====================================================================================================================
const SpanVideo: React.FC<{ file: string }> = ({ file }) => <OffthreadVideo src={staticFile(file)} muted style={{ ...VFULL, objectFit: 'cover' }} />;

const VariantView: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const dt = t - Fr(c.tIn) / FPS;
  if (c.kind === 'vid')
    return (
      <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
        <OffthreadVideo src={staticFile(c.file)} muted playbackRate={FPS / (c.fps ?? FPS)} style={{ ...VFULL, objectFit: 'cover' }} />
      </div>
    );
  const push = interpolate(dt, [0, c.tOut - c.tIn], [1, 1.06], CL); // the vertical's slow push over the slot
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <Img src={staticFile(c.file)} style={{ ...VFULL, objectFit: 'cover', transformOrigin: '50% 50%', transform: wobbleCss(dt, false, push) }} />
      {c.shade && <div style={{ ...VFULL, background: c.shade }} />}
    </div>
  );
};

const VariantRow: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const node = <VariantView c={c} />;
  if (c.tr === 'hand:kt-whip-cut')
    // the vertical's ingress for this beat, from the same cut frame (the overlay window starts on it)
    return (
      <KtWhipCut t0={c.cut / FPS} lens={WHIP_LENS} motionBlur={WHIP_BLUR} width={VW} height={VH}>
        {node}
      </KtWhipCut>
    );
  // hand:fade from the vertical's cut frame: the variant fades in over the C3 frame the vertical fades FROM
  const op = interpolate(t - c.cut / FPS, [0, FADE_IN], [0, 1], CL);
  return (
    <>
      {op < 1 && FADE_UNDER[c.ref] && <Img src={staticFile(FADE_UNDER[c.ref])} style={{ ...VFULL }} />}
      <div style={{ ...VFULL, opacity: op }}>{node}</div>
    </>
  );
};

export const AIVsMLShort: React.FC = () => {
  const frame = useCurrentFrame();
  const clock = React.useMemo(() => ({ t: frame / FPS }), [frame]); // ONE absolute clock for every kt engine (comp-build 6a)
  return (
    <KtClock.Provider value={clock}>
      <AbsoluteFill style={{ background: 'black' }}>
        {/* the spans, end to end (one muted OffthreadVideo each) */}
        {SPANS.map((s, k) => (
          <Sequence key={s.file} from={START[k]} durationInFrames={s.frames}>
            {SEAM_WHIP[k] ? (
              // seam hit: hand:kt-whip-cut on the incoming span (TRANSITIONS.md face pick / headline landing move)
              <KtWhipCut t0={START[k] / FPS} lens={WHIP_LENS} motionBlur={WHIP_BLUR} width={VW} height={VH}>
                <SpanVideo file={s.file} />
              </KtWhipCut>
            ) : (
              <SpanVideo file={s.file} />
            )}
          </Sequence>
        ))}
        {/* the outro hold: span 3's final frame under the card */}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
          <Img src={staticFile(OUTRO_HOLD)} style={{ ...VFULL }} />
        </Sequence>
        {/* the variety overlays (hand:kt-whip-cut IMG-1 + BR-9, hand:fade IMG-4) */}
        {COVERS.map((c) => {
          const from = Math.min(Fr(c.tIn), c.cut);
          return (
            <Sequence key={c.ref} from={from} durationInFrames={Fr(c.tOut) - from}>
              <VariantRow c={c} />
            </Sequence>
          );
        })}
        {/* the IMG-1 headline, REDRAWN over its variant (the vertical's [KT-HEADLINE] HeadlinePopV, same props; span 1 shows
            master frame n + 1, so its times move 1 frame earlier and the pop keeps its exact phase). The variant hides the
            vertical's baked copy; without the redraw the short loses the $340K plant (SHORT-CUT-PLAN risk 8). */}
        <HeadlinePopV
          t0={7.68 - 1 / FPS}
          t1={8.267 - 1 / FPS}
          lines={['AT THE TOP:', 'A *$340K* GAP']}
          y={330}
          fontSize={100}
          pitch={102}
          framing={['TOP 10% VS TYPICAL · LEVELS.FYI', 'US · TOTAL COMP · 2026']}
        />
        {/* the captions, topmost over the picture */}
        <Captions />
        {/* the outro card */}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES}>
          <OutroCard />
        </Sequence>
      </AbsoluteFill>
    </KtClock.Provider>
  );
};
