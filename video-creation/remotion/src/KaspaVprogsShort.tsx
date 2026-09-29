// KaspaVprogsShort: the ~30 s SHORT of longform-edited `kaspa-vprogs` (1080x1920 @30, NO audio).
// Canonical rules: video-creation/longform-edited/skills/longform-to-short/longform-to-short.md §5 Stage B.
//
// What this comp is (and is not):
//   - The BACKBONE is the lane's span intermediates (Stage A, short_extract_spans.py): one muted OffthreadVideo per
//     `span-NN.mp4`, laid end to end in Sequences per `_previews/short/work/spans.json` (out_start / frames). Each
//     span plays LINEARLY from its own frame 0; the comp never seeks into the 7-minute vertical master (§5: the
//     frame-proxy saturation trap). Nothing inside a span is re-timed (span rule #6).
//   - A fast ~0.3 s hand-rolled seam hit at each span join (`hand:zoom-flash`: outgoing punch 1 -> 1.06 over the
//     last 4 frames, incoming 1.06 -> 1 over 6 frames, a cold white flash peaking on the join frame). Hand-rolled on
//     purpose: the joins are between small linear clips and a library engine would need pre-extracted cut frames
//     for no visual gain at 0.3 s.
//   - CAPTIONS: the generated `KaspaVprogsShortCaptions.ts` (build_captions.py montserrat 2/4, COVER-sourced frames
//     only). Rendered ONLY inside CAPTION_WINDOWS; span 1 is the FACE hook and already carries burned captions, so
//     it gets none here (no double-up). House Montserrat style, same portrait placement as the vertical's burned
//     captions (bottom 480, 92 px) so the caption line does not jump at the first seam. Topmost.
//   - VARIANTS (Mike's variety rule): `assets/short/variants.json` is EMPTY for this cut (no span overlaps an Envato
//     clip or a ChatGPT image by >= 0.8 s), so VARIANTS below is empty; the overlay path is kept for parity.
//   - OUTRO: the last 3 s HOLD span 4's final frame (a real <Freeze>, muted) and bring in a full-frame TITLE-SLIDE
//     card reading "WATCH THE FULL VIDEO" (locked container stylesheet: #0a0c10, Playfair 900 headline, green accent
//     words, muted DM Sans eyebrow, green->cyan divider, no em dash) with a downward arrow glyph. The card enters with
//     the video's ONE card move, `hand:cube-3d` (rotateY in over 11 f, then HOLD; never cube back out).
//   - No music, no SFX, no CTA voice, no watermark: scripts/mix_short.py adds the crossfaded spine VO, the shared
//     CTA take (video-creation/assets/vo/cta-watch-full.mp3) and the bed onto the rendered video.
//
// Clock: SHORT seconds. The spans were cut on the FINAL-video clock (sh() already applied upstream), so there are no
// card pauses inside the short and F() here is a plain seconds -> frame map.
// Render public dir = media/kaspa-vprogs/_previews/short/work (the span intermediates live there).
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { ZCAPTIONS, CAPTION_WINDOWS } from './KaspaVprogsShortCaptions';

const MONTSERRAT = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const PLAYFAIR = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const DMSANS = loadDM('normal', { weights: ['600'], subsets: ['latin'] }).fontFamily;

export const W = 1080;
export const H = 1920;
export const FPS = 30;
const F = (t: number) => Math.round(t * FPS);   // SHORT seconds -> frame (no pauses inside the short)

// ─── the span table: literal copy of _previews/short/work/spans.json (asserted contiguous below) ─────────────
type Span = { i: number; file: string; outStart: number; frames: number; role: string; src: [number, number] };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 219, role: 'hook', src: [0.0, 7.315] },         // FACE F1 (burned captions) -> baked lib:blocks-max-1 face-out tail
  { i: 2, file: 'span-02.mp4', outStart: 7.3, frames: 380, role: 'body', src: [90.875, 103.53] },     // c1-overview -> baked lib:melt-rgb-3 -> c1-kaspa-four-jobs -> c1-vprog-nodes
  { i: 3, file: 'span-03.mp4', outStart: 19.9667, frames: 94, role: 'body', src: [121.58, 124.725] }, // sovereignty-card s1 -> s3
  { i: 4, file: 'span-04.mp4', outStart: 23.1, frames: 115, role: 'kicker', src: [187.705, 191.555] }, // pow-money-hammer (opens on its baked xfade from IMG-2)
];
const SPANS_TOTAL_S = 26.933;                   // spans.json spans_total_seconds
const OUTRO_S = 3.0;                            // short_graph.OUTRO_S
const SPAN_FRAMES = SPANS.reduce((a, s) => a + s.frames, 0);   // 808
export const DUR = SPAN_FRAMES + F(OUTRO_S);                    // 898 = round((26.933 + 3.0) * 30)

// build-time assertions: a drifted table throws instead of rendering a wrong cut
(() => {
  let acc = 0;
  for (const s of SPANS) {
    if (F(s.outStart) !== acc) throw new Error(`span ${s.i}: out_start ${s.outStart}s = frame ${F(s.outStart)}, expected ${acc} (not contiguous)`);
    acc += s.frames;
  }
  if (DUR !== Math.round((SPANS_TOTAL_S + OUTRO_S) * FPS)) throw new Error(`DUR ${DUR} != round((${SPANS_TOTAL_S} + ${OUTRO_S}) * ${FPS})`);
})();
const spanFrom = (s: Span) => F(s.outStart);
const OUTRO_FROM = SPAN_FRAMES;                 // 808

// ─── COVERS: what sits OVER the span track in the short (lint_covers table) ───────────────────────────────────
// The spans are the short's backbone (its "spine"), not covers. The only overlay is the outro TITLE-SLIDE card
// (a code-rendered container). Variant overlays would be added here as 'vid'/'still' rows (none for this cut).
type Kind = 'deck' | 'vid' | 'still';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state?: string };
export const COVERS: Cover[] = [
  { tIn: 26.933, tOut: 29.933, kind: 'deck', ref: 'outro-watch-full', state: 'cta' },   // hand:cube-3d ingress, HOLD to the end
];
if (F(COVERS[0].tIn) !== OUTRO_FROM || F(COVERS[0].tOut) !== DUR) throw new Error('outro cover row does not match the span table');

// ─── VARIANTS (assets/short/variants.json -> copied into the public dir under variants/) ─────────────────────
type Variant = { id: string; kind: 'envato-video' | 'chatgpt-image'; file: string; overlay: [number, number] };
const VARIANTS: Variant[] = [];   // variants.json: {"variants": []} (no span overlaps an Envato / ChatGPT cover beat)

// ─── captions: the generated windows, clamped to the span track (the outro card is not captioned) ────────────
// CAPTION_SRC is the literal mirror lint_covers reads; it must equal CAPTION_WINDOWS clamped to the spans' end
// (the generator's last window runs to 26.950, 0.017 s past the last span frame, which is the outro card).
const CAPTION_SRC: [number, number][] = [[7.300, 19.955], [19.967, 23.112], [23.100, 26.933]];
(() => {
  const end = SPAN_FRAMES / FPS;
  const clamped = CAPTION_WINDOWS.map(([a, b]) => [a, Math.min(b, end)]);
  const ok = clamped.length === CAPTION_SRC.length && clamped.every(([a, b], k) => Math.abs(a - CAPTION_SRC[k][0]) < 0.002 && Math.abs(b - CAPTION_SRC[k][1]) < 0.002);
  if (!ok) throw new Error('CAPTION_SRC drifted from the generated CAPTION_WINDOWS (clamped to the span track)');
})();

const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const eo = Easing.out(Easing.cubic);
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// ─── seam hit: hand:zoom-flash (~0.3 s: 4 f out + 6 f in) ────────────────────────────────────────────────────
const SEAM_OUT_F = 4;
const SEAM_IN_F = 6;
const SEAM_ZOOM = 1.06;
const SEAMS = SPANS.slice(1).map((s) => spanFrom(s));   // join frames: 219, 599, 693

const SpanClip: React.FC<{ s: Span; seamIn: boolean; seamOut: boolean }> = ({ s, seamIn, seamOut }) => {
  const f = useCurrentFrame();   // local to the span's Sequence (the clip starts at its own frame 0, linear play)
  let sc = 1;
  if (seamIn) sc *= interpolate(f, [0, SEAM_IN_F], [SEAM_ZOOM, 1], { ...clampX, easing: eo });
  if (seamOut) sc *= interpolate(f, [s.frames - SEAM_OUT_F, s.frames - 1], [1, SEAM_ZOOM], { ...clampX, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${sc})` }}>
        <OffthreadVideo src={staticFile(s.file)} muted style={fill} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// the flash, as a Sequence starting SEAM_OUT_F before the join: rises over the outgoing frames, peaks on the join
const SeamFlash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, SEAM_OUT_F, SEAM_OUT_F + SEAM_IN_F], [0, 0.55, 0], clampX);
  return <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(235,248,255,1) 0%, rgba(190,230,255,.75) 55%, rgba(120,200,255,.35) 100%)', opacity: o, mixBlendMode: 'screen' }} />;
};

// ─── outro: held last frame + the TITLE-SLIDE card (hand:cube-3d in, hold) ───────────────────────────────────
const CUBE_TURN_F = 11;
// ⛔ Mounted at the comp ROOT (no Sequence around the Freeze), frozen at the ABSOLUTE frame OUTRO_FROM - 1 around the
// span's own Sequence, so the clip sees exactly its last local frame (114). Why not <Sequence from={808}><Freeze
// frame={114}>: Freeze sets the timeline to frame + relativeFrom (114 + 808 = 922) and useTimelinePosition CLAMPS that
// to durationInFrames - 1 (897), so the clip showed local frame 89 (the grey pre-'L2' state). Found in smoke stills.
const HeldLast: React.FC = () => {
  const f = useCurrentFrame();
  if (f < OUTRO_FROM) return null;
  const last = SPANS[SPANS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Freeze frame={OUTRO_FROM - 1}>
        <Sequence from={spanFrom(last)} durationInFrames={last.frames} name="outro held frame (span-04 f114)">
          <OffthreadVideo src={staticFile(last.file)} muted style={fill} />
        </Sequence>
      </Freeze>
    </AbsoluteFill>
  );
};
if (spanFrom(SPANS[SPANS.length - 1]) + SPANS[SPANS.length - 1].frames !== OUTRO_FROM) throw new Error('held frame is not the last span frame');

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, CUBE_TURN_F], [0, 1], { ...clampX, easing: eo });
  const rot = -90 * (1 - p);                        // hinge on the right edge, left edge swings in from behind
  const shade = interpolate(p, [0, 1], [0.55, 0]);  // the turning face is darker until it faces the camera
  const bob = Math.sin((f / FPS) * Math.PI * 2 * 0.9) * 14;
  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: '50% 50%' }}>
      <AbsoluteFill style={{ transformOrigin: '100% 50%', transform: `rotateY(${rot}deg)`, backfaceVisibility: 'hidden' }}>
        <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
          {/* accent orbs, as the project's vertical title slides */}
          <div style={{ position: 'absolute', width: 900, height: 900, right: -260, top: -200, borderRadius: '50%', background: '#00e68a', filter: 'blur(160px)', opacity: 0.22 }} />
          <div style={{ position: 'absolute', width: 760, height: 760, left: -300, bottom: -260, borderRadius: '50%', background: '#00c2ff', filter: 'blur(160px)', opacity: 0.16 }} />
          <div style={{ position: 'absolute', left: 60, right: 60, top: 700, color: '#e8eaf0' }}>
            <div style={{ fontFamily: DMSANS, fontWeight: 600, fontSize: 34, letterSpacing: '.18em', textTransform: 'uppercase', color: '#505a6e', marginBottom: 34 }}>
              Kaspa vProgs
            </div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 150, lineHeight: 1.02, letterSpacing: '-.02em' }}>
              WATCH THE<br /><span style={{ color: '#00e68a' }}>FULL VIDEO</span>
            </div>
            <div style={{ width: 66, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', margin: '44px 0 0' }} />
            {/* downward arrow glyph (SVG, so it never falls back to a missing font glyph) */}
            <svg width={150} height={210} viewBox="0 0 150 210" style={{ marginTop: 70, transform: `translateY(${bob}px)` }}>
              <line x1={75} y1={8} x2={75} y2={180} stroke="#00e68a" strokeWidth={16} strokeLinecap="round" />
              <polyline points="18,124 75,190 132,124" fill="none" stroke="#00e68a" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: '#000', opacity: shade }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── captions: Montserrat 900, lowercase, 12 px black stroke, pop 0.7 -> 1.12 -> 1, bottom-center, TOPMOST ────
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, h: c.h }));   // already SHORT seconds
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= OUTRO_FROM) return null;
  const t = frame / FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  // never carry a caption across a span seam (the phrase belongs to the previous span's audio): the group must start
  // inside the span now on screen (0.06 s tolerance = the generator's 0.05 s lead-in at a span's head)
  const span = [...SPANS].reverse().find((s) => frame >= spanFrom(s));
  if (!span || cur.tf < span.outStart - 0.06) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const age = frame - Math.round(cur.tf * FPS);
  const sc = interpolate(age, [0, 4, 9], [0.7, 1.12, 1], clampX);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 50, right: 50, bottom: 480, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 92,
          textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
          letterSpacing: '0.01em', lineHeight: 1.05, textAlign: 'center', transform: `scale(${sc})`,
        } as React.CSSProperties}>{cur.h}</div>
      </div>
    </AbsoluteFill>
  );
};

const VariantEl: React.FC<{ v: Variant }> = ({ v }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clampX);   // hand:fade ingress, as the vertical's b-roll
  return (
    <AbsoluteFill style={{ opacity: o, background: '#000' }}>
      {v.kind === 'envato-video'
        ? <OffthreadVideo src={staticFile('variants/' + v.file)} muted style={fill} />
        : <Img src={staticFile('variants/' + v.file)} style={fill} />}
    </AbsoluteFill>
  );
};

export const KaspaVprogsShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {SPANS.map((s, k) => (
      <Sequence key={s.file} from={spanFrom(s)} durationInFrames={s.frames} name={`span-${s.i} ${s.role}`}>
        <SpanClip s={s} seamIn={k > 0} seamOut={k < SPANS.length - 1} />
      </Sequence>
    ))}
    {VARIANTS.map((v) => (
      <Sequence key={v.id} from={F(v.overlay[0])} durationInFrames={F(v.overlay[1]) - F(v.overlay[0])} name={`variant ${v.id}`}>
        <VariantEl v={v} />
      </Sequence>
    ))}
    {/* hand:zoom-flash at every span join */}
    {SEAMS.map((j) => (
      <Sequence key={`seam-${j}`} from={j - SEAM_OUT_F} durationInFrames={SEAM_OUT_F + SEAM_IN_F} name={`seam hand:zoom-flash @${j}`}>
        <SeamFlash />
      </Sequence>
    ))}
    {/* outro: held last frame under the TITLE-SLIDE card (hand:cube-3d, hold to the end) */}
    <HeldLast />
    <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM} name="outro card hand:cube-3d">
      <OutroCard />
    </Sequence>
    <Captions />
  </AbsoluteFill>
);
