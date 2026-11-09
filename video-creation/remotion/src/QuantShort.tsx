// QuantShort.tsx: longform-edited `quant` SHORT, 16:9-sourced mode (longform-to-short.md section 5 Stage B; comp-builder SHORT mode, 2026-11-06).
// 1080x1920 @30, 6 span intermediates end to end + a 3.467 s outro (30.000 s). Public dir = media/quant/_previews/short/work. NO audio in the comp
// (s_mix adds the crossfaded VO, the shared CTA take and the bed). NEVER seeks into the master.
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { CAPTION_WINDOWS, ZCAPTIONS } from './QuantShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
const F = (t: number) => Math.round(t * FPS);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const PAPER = '#FFFFFF'; // the video's white page (container-canonical-light + accents/quant.css)

// ------------------------------------------------------------------------------------------------ the span table (work/spans.json, frame-exact)
type SpanKind = 'face' | 'cover';
// blackLast: the intermediate's LAST frame is pure black (measured: mean luma 0.0), one unpainted frame of the adapter canvas. span-02 frame 94 would flash on screen
// right before the seam; span-05 frame 233 sits under the C14 card. SpanRow holds the frame before it; the picture never shows the canvas.
type Span = { file: string; frames: number; kind: SpanKind; blackLast?: boolean };
const SPANS: Span[] = [
  { file: 'span-01.mp4', frames: 40, kind: 'face' },    // hook   "So what is quant?"                             F1 screen share
  { file: 'span-02.mp4', frames: 95, kind: 'face', blackLast: true },    // hook   "And what they sell is not a new blockchain."   F1 screen share
  { file: 'span-03.mp4', frames: 182, kind: 'cover' },  // body   "On the left, what a bank already runs..."      under the C1 native card
  // NOT work/span-04.mp4: the painter's Haar pick took the deck's C20 headshot as the face (assets/short/span-face-crop.json, spread 24.6 percent), so that file centres on the
  // headshot and slices Mike's webcam + the CTA box at the right edge. span-04-strip.mp4 = the same 49 frames (_previews/short-16x9/span-04-16x9.mp4) at crop_x 1312, the crop spans 1 + 2 got.
  { file: 'span-04-strip.mp4', frames: 49, kind: 'face' }, // body "So who's actually using this?"                 F3 screen share
  { file: 'span-05.mp4', frames: 234, kind: 'cover', blackLast: true }, // body "Seven banks are on it..."            under the C14 native card
  { file: 'span-06.mp4', frames: 196, kind: 'cover' },  // kicker "And then one line leaves the group..."         under the C6 native card
];
const startOf = (i: number) => SPANS.slice(0, i).reduce((n, s) => n + s.frames, 0);
const SPANS_END = startOf(SPANS.length);
export const DUR = Math.round(30.0 * FPS);   // spans 26.533 s + the 3.467 s outro (s_comp: the outro absorbs the rounding)
const OUTRO_F = DUR - SPANS_END;
if (SPANS_END !== 796 || OUTRO_F !== 104) throw new Error(`QuantShort: span table drifted from spans.json (${SPANS_END} span frames, ${OUTRO_F} outro frames)`);

// ------------------------------------------------------------------------------------------------ the FACE strip
// All three face spans are the recorded OBS strip (CTA box + webcam, house rule 1b: VERBATIM) at x 269-1079 of the painted 608 px crop, which clamps at the recording's
// right edge (measured on the 16:9 renders of spans 1, 2 and 4: CTA box left and webcam left at x 1464 = painted 269-271). The x 0-269 sliver is the 16:9 deck area, slicing
// K1 / C20 fragments ("no frame of a cropped 16:9 card may show"), and uncentred the face fails the hook probe. So the strip is CENTRED on the white page and the sliver masked:
// no zoom, the CTA box whole, nothing re-timed.
const FACE_STRIP = { left: 272, shift: -135 }; // 272, not the measured 269: x 269-271 is the anti-aliased deck edge, a white hairline against the dark bars

// The margins beside the strip are ours, so they must carry the film burn baked into the strip where a span runs through one (spans 2 and 4, the cut plan's two RULE 2 exceptions),
// or two white bars sit beside a burning picture. Measured per frame: the median of the paper-white pixels of the deck sliver on the 16:9 render, normalised to its clean frame.
type RGB = [number, number, number];
const MARGIN_BURN: Record<string, { from: number; rgb: RGB[] }> = {
  'span-02.mp4': { from: 86, rgb: [[255, 254, 251], [254, 252, 245], [254, 248, 238], [255, 244, 229], [255, 239, 218], [255, 234, 208], [255, 230, 199], [255, 226, 191], [255, 226, 191]] }, // the last row is the held frame
  'span-04-strip.mp4': { from: 0, rgb: [[255, 208, 168], [255, 211, 173], [255, 215, 181], [255, 220, 192], [255, 227, 202], [255, 232, 215], [255, 240, 225], [255, 246, 236], [255, 250, 245], [255, 254, 251]] },
};
const marginAt = (s: Span, local: number) => {
  const m = MARGIN_BURN[s.file];
  const c = m ? m.rgb[local - m.from] : undefined;
  return c ? `rgb(${c[0]},${c[1]},${c[2]})` : PAPER;
};

// ------------------------------------------------------------------------------------------------ the seams: ~0.3 s hits from the video's OWN family (TRANSITIONS.md section 3)
// `burn` = hand:film-burn centred on the join. `burn-fall` / `burn-rise` = the same burn on the card side only: span 2's end and span 4's start already carry F1's cut-out and F3's
// cut-in burn (baked, peak on the join), and a second burn on those frames would blow out (cut plan, RULE 2 exceptions). `paper` = hand:paper-sheet between two white pages. The VO is never touched.
type HitKind = 'burn' | 'burn-rise' | 'burn-fall' | 'paper';
const HIT_HALF = 5;       // full hits: 10 frames, 0.33 s
const SIDE_F = 6;         // one-sided hits: 6 frames on the card side + the baked half on the face side
const SEAMS: { at: number; hit: HitKind }[] = [
  { at: startOf(1), hit: 'burn' },      // 1.333 hand:film-burn   F1 -> F1 (the jump cut inside the strip)
  { at: startOf(2), hit: 'burn-fall' }, // 4.500 hand:film-burn   F1 (baked rise) -> C1 card
  { at: startOf(3), hit: 'burn-rise' }, // 10.567 hand:film-burn  C1 card -> F3 (baked fall)
  { at: startOf(4), hit: 'burn' },      // 12.200 hand:film-burn  F3 -> C14 receipt
  { at: startOf(5), hit: 'paper' },     // 20.000 hand:paper-sheet C14 receipt -> C6 chart
];
const hitAt = (frame: number) => SEAMS.find((s) => s.at === frame);

const BURN_PEAK = 0.7;
const FilmBurnHit: React.FC<{ hit: 'burn' | 'burn-rise' | 'burn-fall' }> = ({ hit }) => {
  const f = useCurrentFrame();
  const x = hit === 'burn' ? Math.max(0, 1 - Math.abs(f - (HIT_HALF - 0.5)) / HIT_HALF) : hit === 'burn-rise' ? (f + 1) / SIDE_F : 1 - f / SIDE_F;
  const a = x * x * (3 - 2 * x) * BURN_PEAK;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 78% 88% at 50% 50%, rgba(255,241,216,${a}) 0%, rgba(255,186,112,${a * 0.92}) 44%, rgba(241,90,34,${a * 0.8}) 82%, rgba(209,74,20,${a * 0.7}) 100%)`,
    }} />
  );
};
// The sheet: the outgoing frame goes to paper by the last frame before the join, the incoming one comes up out of it.
const PaperHit: React.FC = () => {
  const f = useCurrentFrame();
  const a = f < HIT_HALF ? (f + 1) / HIT_HALF : (2 * HIT_HALF - f) / (HIT_HALF + 1);
  return <AbsoluteFill style={{ background: PAPER, opacity: a }} />;
};
const SeamHit: React.FC<{ hit: HitKind }> = ({ hit }) => (hit === 'paper' ? <PaperHit /> : <FilmBurnHit hit={hit} />);
const seamFrom = (s: { at: number; hit: HitKind }) => (s.hit === 'burn-fall' ? s.at : s.hit === 'burn-rise' ? s.at - SIDE_F : s.at - HIT_HALF);
const seamDur = (s: { hit: HitKind }) => (s.hit === 'burn-fall' || s.hit === 'burn-rise' ? SIDE_F : 2 * HIT_HALF);

// a face span's own push through its seams: a punch settling in (1.05 -> 1), and 1 -> 1.03 out. Cover spans sit under their cards, which carry their own push.
const seamScale = (s: Span, frame: number, start: number, end: number) => {
  if (s.kind !== 'face') return 1;
  if (hitAt(start) && frame < start + 6) return interpolate(frame, [start, start + 6], [1.05, 1], clamp);
  if (hitAt(end) && frame >= end - 4) return interpolate(frame, [end - 4, end - 1], [1, 1.03], clamp);
  return 1;
};

// The bars beside the strip (final visual-qa, 2026-11-06: white bars sliced Mike's hair) = a blurred, darkened copy of the strip itself, clipped to the strip BEFORE the blur so the
// deck sliver never bleeds in, oversized so the blur's soft edge sits off frame. The strip's film burns ride the copy on their own. Filling the frame instead (1.33x) put the caption
// across his nose and mouth, so the strip keeps its size and the caption stays under the chin.
const FACE_BAR = { scale: 1.5, blur: 40, brightness: 0.45 };
const SpanPicture: React.FC<{ s: Span }> = ({ s }) => (
  s.kind === 'face' ? (
    <>
      <AbsoluteFill style={{ background: '#000', filter: `blur(${FACE_BAR.blur}px) brightness(${FACE_BAR.brightness})` }}>
        <OffthreadVideo muted src={staticFile(s.file)} style={{
          position: 'absolute', left: 0, top: 0, width: 1080, height: 1920,
          clipPath: `inset(0 0 0 ${FACE_STRIP.left}px)`,
          transform: `translateX(${FACE_STRIP.shift}px) scale(${FACE_BAR.scale})`, transformOrigin: `${(FACE_STRIP.left + 1080) / 2}px 50%`,
        }} />
      </AbsoluteFill>
      <OffthreadVideo muted src={staticFile(s.file)} style={{
        position: 'absolute', left: 0, top: 0, width: 1080, height: 1920,
        clipPath: `inset(0 0 0 ${FACE_STRIP.left}px)`, transform: `translateX(${FACE_STRIP.shift}px)`,
      }} />
    </>
  ) : (
    <OffthreadVideo muted src={staticFile(s.file)} style={{ width: '100%', height: '100%' }} />
  )
);

const SpanRow: React.FC<{ s: Span; start: number }> = ({ s, start }) => {
  const local = useCurrentFrame();
  const frame = local + start;
  return (
    <AbsoluteFill style={{
      transform: `scale(${seamScale(s, frame, start, start + s.frames)})`, transformOrigin: '50% 50%',
      background: marginAt(s, local), overflow: 'hidden',
    }}>
      {s.blackLast && local >= s.frames - 1 ? (
        <Sequence from={0} layout="none">
          <Freeze frame={s.frames - 2}>
            <SpanPicture s={s} />
          </Freeze>
        </Sequence>
      ) : <SpanPicture s={s} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ the native-vertical overlays (assets/short/vertical-cards.json, SHORT seconds)
// Hard in / hard out on the window edges, under the seam hits and the captions. holds: [] and variants.json: [] for this short (envato_max 0, chatgpt_max 0).
export const COVERS: { tIn: number; tOut: number; kind: 'chart' | 'receipt'; ref: string; cap: boolean }[] = [
  { tIn: 4.5, tOut: 10.56, kind: 'chart', ref: 'C1-one-layer-v', cap: true },       // C1 system-design diagram, bank stack left, Quant in the middle
  { tIn: 12.19, tOut: 19.99, kind: 'receipt', ref: 'C14-gbtd-v', cap: true },       // C14 UK Finance GBTD page, the seven banks + Quant highlighted (baked)
  { tIn: 19.99, tOut: 26.53, kind: 'chart', ref: 'C6-peers-payoff-v', cap: true },  // C6 peers chart, the payoff state
];
// every card edge must land on its span's edge: a one-frame miss would show the cropped 16:9 asset under it
if (F(COVERS[0].tIn) !== startOf(2) || F(COVERS[0].tOut) !== startOf(3) || F(COVERS[1].tIn) !== startOf(4) || F(COVERS[1].tOut) !== startOf(5) || F(COVERS[2].tIn) !== startOf(5) || F(COVERS[2].tOut) !== SPANS_END) {
  throw new Error('QuantShort: a native card window no longer matches its span');
}
// A still must not sit dead still (comp-build 7a): a slow push, anchored and sized from the measured ink boxes (VERTICAL-CARDS-QA.json) so the ink stays out of the 22 px edge-text strip
// and above the caption band (y 1420): C1 anchors on its bottom ink and tops at x 32-1025; C14 anchors on the top of the frame (the logo sits at y 18) and ends at x 38-1041, y 18-1379; C6 anchors on its bottom ink and ends at x 33-1040.
const CARD_PUSH: Record<string, { s: number; ox: number; oy: number }> = {
  'C1-one-layer-v': { s: 1.03, ox: 540, oy: 1388 },
  'C14-gbtd-v': { s: 1.02, ox: 540, oy: 0 },
  'C6-peers-payoff-v': { s: 1.03, ox: 540, oy: 1404 },
};
const CardPicture: React.FC<{ id: string; p: number }> = ({ id, p }) => {
  const push = CARD_PUSH[id];
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: 'hidden' }}>
      <Img src={staticFile(`vertical-cards/${id}.png`)} style={{
        position: 'absolute', left: 0, top: 0, width: 1080, height: 1920,
        transformOrigin: `${push.ox}px ${push.oy}px`, transform: `scale(${1 + (push.s - 1) * p})`,
      }} />
    </AbsoluteFill>
  );
};
const NativeCard: React.FC<{ id: string; durFrames: number }> = ({ id, durFrames }) => {
  const f = useCurrentFrame();
  return <CardPicture id={id} p={interpolate(f, [0, durFrames - 1], [0, 1], clamp)} />;
};

// ------------------------------------------------------------------------------------------------ the outro: the last frame held, the TITLE-SLIDE card over it
// The last frame AS AIRED is the C6 native card at the end of its push, not span-06's own picture (the cropped 16:9 chart, which must never show); the cut plan's outro.note says the same. No video fetch.
const OutroHold: React.FC = () => <CardPicture id={COVERS[COVERS.length - 1].ref} p={1} />;

// The locked stylesheet resolves per video through settings.container_theme + container_accent. Mike ruled this video light + Quant accent (PROJECT-LOG: "every deck card, title card ...";
// GRAPH-PROGRESS.json settings) and assets/title-slides/T2-T6 are built that way. To use the dark default the s_comp brief describes (dark, green accent word) instead, set OUTRO_LOOK to LOOKS.lockedDark: nothing else changes.
const LOOKS = {
  quantLight: { page: '#FFFFFF', ink: '#43403E', word: '#D14A14', mark: '#F15A22', divider: 'linear-gradient(90deg,#F15A22,rgba(241,90,34,.25))', orbOpacity: 0.1, grain: { opacity: 0.05, blend: 'multiply' as const } },
  lockedDark: { page: '#0a0c10', ink: '#e8eaf0', word: '#00e68a', mark: '#00e68a', divider: 'linear-gradient(90deg,#00e68a,#00c2ff)', orbOpacity: 0.3, grain: { opacity: 0.03, blend: 'normal' as const } },
};
const OUTRO_LOOK = LOOKS.quantLight;
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const CARD_IN_F = 11;    // hand:xfade-scale, the video's text-container ingress

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const L = OUTRO_LOOK;
  const bob = Math.sin((f / FPS) * Math.PI * 2) * 12;   // the arrow keeps pointing down at the link while the CTA line plays
  return (
    <AbsoluteFill style={{
      background: L.page, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 96px 120px',
      opacity: interpolate(f, [0, CARD_IN_F], [0, 1], clamp),
      transform: `scale(${interpolate(f, [0, CARD_IN_F], [0.93, 1], clamp)})`, transformOrigin: '50% 50%',
    }}>
      <div style={{ position: 'absolute', width: 900, height: 900, right: -280, top: -400, borderRadius: '50%', background: L.mark, opacity: L.orbOpacity, filter: 'blur(120px)' }} />
      <div style={{ position: 'relative', fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 180, lineHeight: 1.05, letterSpacing: '-.02em', color: L.ink }}>
        <div>WATCH</div>
        <div>THE <span style={{ color: L.word }}>FULL</span></div>
        <div>VIDEO</div>
      </div>
      <div style={{ position: 'relative', width: 132, height: 7, borderRadius: 4, background: L.divider, margin: '60px 0 66px' }} />
      <svg width={158} height={240} viewBox="0 0 132 200" style={{ position: 'relative', transform: `translateY(${bob}px)` }}>
        <path d="M66 10 V182" stroke={L.mark} strokeWidth={15} strokeLinecap="round" fill="none" />
        <path d="M12 128 L66 186 L120 128" stroke={L.mark} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: L.grain.opacity, mixBlendMode: L.grain.blend, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ captions: generated data, the Montserrat house style, the SAFE ZONE, TOPMOST
// Rendered only inside CAPTION_WINDOWS, exactly as generated. A group holds until min(next.t, max(t + 1.3, e)) (longform-to-short.md, lets-get-rich 2026-11-01).
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let i = -1;
  for (let k = 0; k < ZCAPTIONS.length; k++) {
    if (ZCAPTIONS[k].t <= t) i = k;
    else break;
  }
  if (i < 0) return null;
  const cur = ZCAPTIONS[i];
  const next = ZCAPTIONS[i + 1];
  if (t >= Math.min(next ? next.t : Infinity, Math.max(cur.t + 1.3, cur.e))) return null;
  const pop = interpolate(frame - Math.round(cur.t * FPS), [0, 3, 6], [0.7, 1.12, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320, pointerEvents: 'none' }}>
      <div style={{
        maxWidth: 860, textAlign: 'center', transform: `scale(${pop})`,
        fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 72, lineHeight: 1.15, letterSpacing: '.01em',
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
      }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ the composition
export const QuantShort: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    {SPANS.map((s, i) => (
      <Sequence key={s.file} from={startOf(i)} durationInFrames={s.frames}>
        <SpanRow s={s} start={startOf(i)} />
      </Sequence>
    ))}
    {COVERS.map((c) => (
      <Sequence key={c.ref} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn)}>
        <NativeCard id={c.ref} durFrames={F(c.tOut) - F(c.tIn)} />
      </Sequence>
    ))}
    <Sequence from={SPANS_END} durationInFrames={OUTRO_F}>
      <OutroHold />
    </Sequence>
    {SEAMS.map((s) => (
      <Sequence key={s.at} from={seamFrom(s)} durationInFrames={seamDur(s)}>
        <SeamHit hit={s.hit} />
      </Sequence>
    ))}
    <Sequence from={SPANS_END} durationInFrames={OUTRO_F}>
      <OutroCard />
    </Sequence>
    <Captions />
  </AbsoluteFill>
);
