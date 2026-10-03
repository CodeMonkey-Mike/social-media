// GoldenKittyShort.tsx: golden-kitty SHORT (1080x1920, 30 fps), longform-to-short.md §5 Stage B.
// Assembled ONLY from the lane's span INTERMEDIATES (public dir = media/golden-kitty/_previews/short/work):
// one muted OffthreadVideo per span-NN.mp4 laid end to end per spans.json (out_start / frames), NEVER seeking into
// the master. Seams = fast hand-rolled hits from the video's own transition family (TRANSITIONS.md §3):
//   FACE<->COVER seams = hand:film-burn (the per-video face pick), COVER->COVER seam = hand:xfade+scale (0.93 -> 1).
// Captions: GoldenKittyShortCaptions.ts (SHORT seconds, generated), rendered ONLY inside CAPTION_WINDOWS (the
// COVER-sourced frames; the FACE-sourced frames already carry burned captions), Montserrat house style, topmost.
// Variant overlay (Mike's variety rule): assets/short/variants.json IMG-1 -> variants/IMG-1-eth-vs-stablecoin-lowangle.png,
// full-frame over overlay_short [9.685, 13.4] with the SAME ingress the vertical used for IMG-1 (hand:film-burn, face-owned,
// 0.76 s, peak 1; its rising half is already baked into span-01's tail, so the comp lays the falling half over the variant)
// and the vertical's gentle Ken Burns push on AI stills (1 -> 1.06).
// Outro: the last 3 s hold span-04's final frame (<Freeze>) under a full-frame TITLE-SLIDE card "WATCH THE FULL VIDEO"
// (locked container stylesheet: #0a0c10, Playfair 900 headline, green accent word, green->cyan divider, DM Sans eyebrow),
// flipped in from the right (the video's card pick, rmn:flip, hand-rolled here as a rotateY turn) + a downward arrow glyph.
// NO audio in the comp (all spans muted): mix_short.py lays the crossfaded VO, the shared CTA take and the bed.
// Imports: packages + own GoldenKitty* files only (lint_comp_imports.py).
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { ZCAPTIONS, CAPTION_WINDOWS } from './GoldenKittyShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['600'], subsets: ['latin'] });

export const FPS = 30;
const W = 1080, H = 1920;
const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// ── span table: spans.json verbatim (out_start in SHORT secs, frames = verified intermediate frame counts) ──────
const SPANS: { file: string; outStart: number; frames: number; sourced: 'FACE' | 'COVER' }[] = [
  { file: 'span-01.mp4', outStart: 0.0, frames: 291, sourced: 'FACE' },    // hook
  { file: 'span-02.mp4', outStart: 9.7, frames: 163, sourced: 'COVER' },   // body
  { file: 'span-03.mp4', outStart: 15.1333, frames: 212, sourced: 'COVER' }, // body
  { file: 'span-04.mp4', outStart: 22.2, frames: 130, sourced: 'FACE' },   // kicker
];
const SPANS_TOTAL_SECS = 26.533;                         // spans.json spans_total_seconds
const OUTRO_SECS = 3.467;                               // target 30.0 - spans 26.533: the card absorbs the rounding (s_verify_final wants 30.0 +-0.25)
const SPAN_FROM = SPANS.map((s) => Math.round(s.outStart * FPS));
SPANS.forEach((s, i) => {                                 // spans must butt end to end, no gap, no overlap
  const next = i + 1 < SPANS.length ? SPAN_FROM[i + 1] : Math.round(SPANS_TOTAL_SECS * FPS);
  if (SPAN_FROM[i] + s.frames !== next) throw new Error(`span ${i + 1}: from ${SPAN_FROM[i]} + ${s.frames} != ${next}`);
});
const SPANS_END = SPAN_FROM[SPANS.length - 1] + SPANS[SPANS.length - 1].frames;   // 796
export const DUR = Math.round((SPANS_TOTAL_SECS + OUTRO_SECS) * FPS);              // round(30.0 * 30) = 900
const OUTRO_F = DUR - SPANS_END;                                                    // 90

// ── COVERS: the comp's own overlay layer (lint_covers.py). The spans are the base track, not covers. ───────────
// cap: true on both: captions over these frames are the POINT of the short (COVER-sourced frames need them).
type Cover = { tIn: number; tOut: number; kind: 'still' | 'deck'; ref: string; state?: string; cap?: boolean };
const COVERS: Cover[] = [
  { tIn: 9.685, tOut: 13.4, kind: 'still', ref: 'IMG-1-eth-vs-stablecoin-lowangle', cap: true }, // variant; ingress hand:film-burn (as the vertical)
  { tIn: 26.533, tOut: 30.0, kind: 'deck', ref: 'OUTRO-watch-full', state: 'cta', cap: true },  // outro card; ingress hand:flip-card
];
// Captions (§8): the generated windows, mirrored for lint_covers.py
const CAPTION_SRC: [number, number][] = [[9.667, 9.685], [9.7, 15.15], [15.133, 22.188], [22.2, 26.55]];   // the kicker (F9) carries NO burned captions in the vertical (face holds under 5 s are not captioned), so it takes the track too
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS.map(([a, b]) => [a, b]))) {
  throw new Error('CAPTION_SRC drifted from GoldenKittyShortCaptions.ts CAPTION_WINDOWS');
}
const VARIANT = COVERS[0];
const VAR_FROM = Math.round(VARIANT.tIn * FPS), VAR_TO = Math.round(VARIANT.tOut * FPS);   // 291 .. 402

// ── seams (one hit per span boundary) ─────────────────────────────────────────────────────────────────
// S1 291 FACE->COVER  hand:film-burn  (the falling half of the vertical's 0.76 s IMG-1 burn; rising half is baked in span-01)
// S2 454 COVER->COVER hand:xfade+scale (0.3 s: span-02's last frame frozen under span-03 scaling 0.93 -> 1)
// S3 666 COVER->FACE  hand:film-burn  (0.3 s flash peaking on the cut)
const SEAM_F = SPAN_FROM.slice(1);                       // [291, 454, 666]
const XF_N = 9;                                          // 0.3 s

// ── film burn (hand:film-burn, the video's face-cut pick) ─────────────────────────────────────────────
// p runs 0..1 across the full burn; [p0, p1] lets the comp draw only one half of it.
const FilmBurn: React.FC<{ n: number; peak: number; p0?: number; p1?: number }> = ({ n, peak, p0 = 0, p1 = 1 }) => {
  const f = useCurrentFrame();
  const p = p0 + (p1 - p0) * ((f + 0.5) / n);
  const e = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, p))), 1.4) * peak;
  const y = 25 + 50 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e,
        background: `radial-gradient(circle at 45% ${y}%, rgba(255,250,235,1) 0%, rgba(255,196,96,.95) 20%, rgba(255,112,24,.78) 42%, rgba(150,30,0,.4) 64%, rgba(0,0,0,0) 82%),
          radial-gradient(circle at 75% ${100 - y}%, rgba(255,170,60,.9) 0%, rgba(200,60,0,.35) 40%, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ background: 'rgb(255,236,200)', opacity: Math.pow(e, 3) * 0.55, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

// ── span track ────────────────────────────────────────────────────────────────────────────────────────
const SpanVideo: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  // S2: the incoming COVER span scales in 0.93 -> 1 over the seam (hand:xfade+scale), fading up over the frozen outgoing frame
  const xs = i === 2 ? interpolate(f, [0, XF_N], [0.93, 1], { ...clampX, easing: Easing.out(Easing.cubic) }) : 1;
  const xo = i === 2 ? interpolate(f, [0, XF_N - 2], [0, 1], clampX) : 1;
  return (
    <AbsoluteFill style={{ opacity: xo, transform: `scale(${xs})` }}>
      <OffthreadVideo src={staticFile(SPANS[i].file)} muted style={fill} />
    </AbsoluteFill>
  );
};

// ── variant overlay (assets/short/variants.json) ─────────────────────────────────────────────────────
const BURN_N = Math.round(0.76 * FPS);                   // the vertical's IMG-1 burn length (23 f)
const BURN_HALF = Math.ceil(BURN_N / 2);                 // 12 f: the falling half, drawn over the variant
const VariantOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const n = VAR_TO - VAR_FROM;
  const k = 1 + 0.06 * interpolate(f, [0, n], [0, 1], clampX);      // the vertical's gentle Ken Burns push on AI stills
  const out = interpolate(f, [n - 6, n], [1, 0], clampX);            // quiet 0.2 s hand-off back to span-02's next cover
  return (
    <AbsoluteFill style={{ opacity: out, background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${k})` }}>
        <Img src={staticFile('variants/' + VARIANT.ref + '.png')} style={fill} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── outro: TITLE-SLIDE card (container-canonical.css tokens, verbatim) ───────────────────────────────
const C = { bg: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', text: '#e8eaf0', muted: '#505a6e' };
const CARD_TURN = 12;                                    // flip in over 0.4 s, then HOLD (never turn back out)
const DownArrow: React.FC<{ f: number }> = ({ f }) => {
  const bob = 18 * Math.sin((f / FPS) * Math.PI * 2 * 1.1);
  const a = interpolate(f, [CARD_TURN, CARD_TURN + 8], [0, 1], clampX);
  return (
    <svg width={190} height={250} viewBox="0 0 190 250" style={{ opacity: a, transform: `translateY(${bob}px)` }}>
      <defs>
        <linearGradient id="gkArrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} /><stop offset="100%" stopColor={C.green} />
        </linearGradient>
      </defs>
      <path d="M95 10 L95 200 M25 135 L95 210 L165 135" fill="none" stroke="url(#gkArrow)" strokeWidth={26}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, CARD_TURN], [90, 0], { ...clampX, easing: Easing.out(Easing.cubic) });   // from the right
  const vis = f < 1 ? 0 : 1;
  return (
    <AbsoluteFill style={{ perspective: 2400 }}>
      <AbsoluteFill style={{ opacity: vis, transform: `rotateY(${-rot}deg)`, transformOrigin: '0% 50%', backfaceVisibility: 'hidden',
        background: C.bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 96px' }}>
        <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -360, top: 120,
          background: C.green, filter: 'blur(160px)', opacity: 0.22 }} />
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', left: -320, bottom: 80,
          background: C.cyan, filter: 'blur(160px)', opacity: 0.14 }} />
        <div style={{ position: 'relative', fontFamily: `${DMSANS},sans-serif`, fontWeight: 600, fontSize: 40, letterSpacing: '.18em',
          textTransform: 'uppercase', color: C.muted, marginBottom: 40 }}>Link below</div>
        <div style={{ position: 'relative', fontFamily: `${PLAYFAIR},serif`, fontWeight: 900, fontSize: 168, lineHeight: 1.04,
          letterSpacing: '-.02em', color: C.text }}>
          WATCH THE<br /><span style={{ color: C.green }}>FULL</span> VIDEO
        </div>
        <div style={{ position: 'relative', width: 120, height: 7, borderRadius: 4, margin: '56px 0 70px',
          background: `linear-gradient(90deg, ${C.green}, ${C.cyan})` }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-start', paddingLeft: 10 }}>
          <DownArrow f={f} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── captions (§8, Montserrat house style; portrait size held above the platform UI band) ─────────────
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h.replace(/\\/g, '') }));     // already SHORT seconds: no remap
const CAP_WIN_F = CAPTION_WINDOWS.map(([a, b]) => [Math.round(a * FPS), Math.round(b * FPS)] as [number, number]);
const Captions: React.FC = () => {
  const abs = useCurrentFrame();                         // mounted at the root: absolute frame
  const t = abs / FPS;
  if (!CAP_WIN_F.some(([a, b]) => abs >= a && abs < b)) return null;   // ONLY inside the caption windows
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const lf = (t - cur.tf) * FPS;
  const pop = interpolate(lf, [0, 3, 6], [0.7, 1.12, 1], clampX);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 420, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 96, color: '#fff',
        textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`,
        textAlign: 'center', lineHeight: 1.05, maxWidth: 960 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ── the composition ─────────────────────────────────────────────────────────────────────────────────
export const GoldenKittyShort: React.FC = () => {
  const last = SPANS.length - 1;
  return (
    <AbsoluteFill style={{ background: '#000', width: W, height: H }}>
      {/* S2 underlay: span-02's final frame frozen under span-03's scale-in (hand:xfade+scale) */}
      <Sequence from={SEAM_F[1]} durationInFrames={XF_N}>
        <Freeze frame={SPANS[1].frames - 1}>
          <OffthreadVideo src={staticFile(SPANS[1].file)} muted style={fill} />
        </Freeze>
      </Sequence>
      {SPANS.map((s, i) => (
        <Sequence key={s.file} from={SPAN_FROM[i]} durationInFrames={s.frames}>
          <SpanVideo i={i} />
        </Sequence>
      ))}
      {/* outro hold: the last span's final frame */}
      <Sequence from={SPANS_END} durationInFrames={OUTRO_F}>
        <Freeze frame={SPANS[last].frames - 1}>
          <OffthreadVideo src={staticFile(SPANS[last].file)} muted style={fill} />
        </Freeze>
      </Sequence>
      {/* variant overlay IMG-1 (cover row 0) */}
      <Sequence from={VAR_FROM} durationInFrames={VAR_TO - VAR_FROM}>
        <VariantOverlay />
      </Sequence>
      {/* S1 hand:film-burn: the falling half of the vertical's IMG-1 ingress burn, over the variant */}
      <Sequence from={SEAM_F[0]} durationInFrames={BURN_HALF}>
        <FilmBurn n={BURN_HALF} peak={1} p0={0.5} p1={1} />
      </Sequence>
      {/* S3 hand:film-burn: 0.3 s flash peaking on the COVER -> FACE cut */}
      <Sequence from={SEAM_F[2] - Math.floor(XF_N / 2)} durationInFrames={XF_N}>
        <FilmBurn n={XF_N} peak={0.8} />
      </Sequence>
      {/* outro TITLE-SLIDE card (cover row 1) */}
      <Sequence from={SPANS_END} durationInFrames={OUTRO_F}>
        <OutroCard />
      </Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
