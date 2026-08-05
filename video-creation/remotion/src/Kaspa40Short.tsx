import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { ZCAPTIONS } from './Kaspa40ShortCaptions';

/**
 * kaspa 30bps — 40-SECOND VERTICAL SHORT (1080x1920).
 *
 * Lane: video-creation/longform-edited/skills/longform-to-short.md
 * Cut plan: media/kaspa 30bps/SHORT-CUT-PLAN.snapped.json (short-cut-strategist, then
 *           skills/lint-short-spans.py snapped every boundary to a measured trough).
 *
 * This is a CONDENSATION, not a new edit. Every frame of picture already exists in
 * kaspa-40bps-VERTICAL.mp4; the spans were pre-extracted to small intermediates by
 * skills/short_extract_spans.py (Stage A) so nothing here seeks inside the 130 MB master.
 *
 * Music, SFX and the spoken CTA are NOT here — they are ffmpeg-mixed onto the finished
 * render (Stage C), exactly as the longform does it.
 */

const { fontFamily: MONT } = loadMontserrat('normal', {
  weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});

export const FPS = 30;
export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

/** GENERATED — copy of media/kaspa 30bps/_short/spans.json (skills/short_extract_spans.py).
 *  `src` is the span's start in FINAL-VIDEO seconds, which is the clock the captions use. */
const SPANS = [
  { file: 'span-01.mp4', frames: 344, out: 0,    src: 0.0,    sourced: 'MIXED'  },
  { file: 'span-02.mp4', frames: 431, out: 344,  src: 330.41, sourced: 'COVER'  },
  { file: 'span-03.mp4', frames: 324, out: 775,  src: 427.30, sourced: 'COVER'  },
] as const;

/** Only the part of each span that the longform did NOT already burn captions onto.
 *  The longform captions FACE beats only, and span 1's FACE window is [0, 4.70]. */
const CAPTION_FROM: Record<string, number> = { 'span-01.mp4': 4.70 };

const SPAN_FRAMES = SPANS.reduce((n, s) => n + s.frames, 0);
export const OUTRO_FRAMES = 101;
export const K40S_DURATION = SPAN_FRAMES + OUTRO_FRAMES;

if (K40S_DURATION !== 1200) {
  throw new Error(
    `short is ${K40S_DURATION} frames (${(K40S_DURATION / FPS).toFixed(3)}s), expected 1200 (40.000s). ` +
    `Re-run short_extract_spans.py and update SPANS + OUTRO_FRAMES together.`);
}
SPANS.forEach((s, i) => {
  const expect = SPANS.slice(0, i).reduce((n, p) => n + p.frames, 0);
  if (s.out !== expect) throw new Error(`span ${i + 1} out=${s.out}, expected ${expect}`);
});

const ease = Easing.out(Easing.cubic);
const ip = (t: number, rng: number[], out: number[], easing?: (n: number) => number) =>
  interpolate(t, rng, out, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', ...(easing ? { easing } : {}) });

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// ─── captions: source clock -> the short's output clock ──────────────────────
/** ZCAPTIONS carries FINAL-VIDEO seconds. Each group belongs to whichever span contains it;
 *  groups outside every span, or inside a stretch the longform already burned, are dropped. */
const CAPS = ZCAPTIONS.flatMap((c) => {
  for (const s of SPANS) {
    const a = s.src;
    const b = s.src + s.frames / FPS;
    if (c.t < a || c.t >= b) continue;
    if (c.t < (CAPTION_FROM[s.file] ?? -Infinity)) return [];
    return [{ tf: s.out / FPS + (c.t - a), h: c.h }];
  }
  return [];
}).sort((x, y) => x.tf - y.tf);

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Hard stop at the last span's end. A group that starts late in the kicker would otherwise hold
  // its full 1.3s and paint across the CTA card, which it did on the first render.
  if (t >= SPAN_FRAMES / FPS) return null;
  let cur: { tf: number; h: string } | null = null;
  let next = Infinity;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else { next = c.tf; break; } }
  if (!cur || t >= Math.min(next, cur.tf + 1.3)) return null;
  const age = frame - Math.round(cur.tf * FPS);
  const scale = ip(age, [0, 4, 9], [0.7, 1.12, 1], ease);
  return (
    <AbsoluteFill style={{ zIndex: 400, pointerEvents: 'none' }}>
      {/* SIZE AND STROKE COME FROM THE CAPTIONS SKILL, NOT FROM A COMP: canon is 72px / 13px stroke /
          0.01em at 1080x1920 (skills/captions/captions.md, montserrat preset). The vertical longform
          had drifted to 84px, and copying a comp is exactly how caption style has propagated wrong
          before.
          BOTTOM 300, not the longform's 560: the longform captioned FACE beats only, so it never had
          to clear a chart. Two of this short's three spans are full-frame charts, and at 560 the text
          landed straight across the DAGKnight cadence label and the Toccata rung. 300 drops it into
          the empty band between the last data row and the footnote, still clear of the platform UI. */}
      {/* Soft scrim under the text. The C2 cadence chart leaves an empty band at 300, but the C1
          ladder fills the frame edge to edge, so on the kicker the caption necessarily lands on a
          rung card. A feathered ellipse (no hard edge, nothing that reads as a bar) darkens just
          enough for the glyphs to win, and makes the overlap look authored rather than accidental. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 300 - 130, height: 360,
        background: 'radial-gradient(ellipse 60% 54% at 50% 50%, rgba(4,6,13,0.94) 0%, rgba(4,6,13,0.70) 42%, rgba(4,6,13,0.28) 62%, rgba(4,6,13,0) 78%)',
      }} />
      <div style={{ position: 'absolute', bottom: 300, left: 80, right: 80, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: `${MONT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 72,
          letterSpacing: '0.01em', color: '#fff', textTransform: 'lowercase', textAlign: 'center',
          lineHeight: 1.06, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
          transform: `scale(${scale})`,
        }}>
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── seam hit ────────────────────────────────────────────────────────────────
/**
 * A 5-frame glitch flash on each span join, in the blocks-max family the longform uses for
 * its hard cuts. Deliberately hand-rolled rather than driven off the transition library: a
 * library engine wants to sample BOTH neighbouring clips, which is what saturated Remotion's
 * frame proxy and killed three renders on this project (comp-build.md §6a). This paints over
 * the cut instead of reading through it, so it cannot stall.
 */
const SeamHit: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const age = frame - at;
  if (age < 0 || age >= 5) return null;
  const p = age / 5;
  const fade = Math.sin(Math.PI * p);
  const bars = [
    { top: '18%', h: 46, dx: -38, c: 'rgba(0,230,138,0.55)' },
    { top: '37%', h: 22, dx: 54, c: 'rgba(255,255,255,0.42)' },
    { top: '52%', h: 64, dx: -26, c: 'rgba(0,194,255,0.45)' },
    { top: '71%', h: 30, dx: 44, c: 'rgba(255,255,255,0.30)' },
  ];
  return (
    <AbsoluteFill style={{ zIndex: 350, pointerEvents: 'none', opacity: fade }}>
      <AbsoluteFill style={{ background: '#fff', opacity: 0.10 * fade, mixBlendMode: 'screen' }} />
      {bars.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.dx, right: -b.dx, top: b.top, height: b.h,
          background: b.c, mixBlendMode: 'screen',
          opacity: age % 2 === 0 ? 1 : 0.35,
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ─── outro ───────────────────────────────────────────────────────────────────
/** The kicker's last frame dips away and the CTA card takes the screen. The frozen ladder
 *  behind it is the whole claim as one image, so it earns the half second it gets. */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = ip(frame, [0, 12], [1, 0.22], ease);
  const blur = ip(frame, [0, 12], [0, 9], ease);
  const cardIn = ip(frame, [6, 16], [0, 1], ease);
  const cardRise = ip(frame, [6, 18], [26, 0], ease);
  const bounce = Math.sin((frame / FPS) * Math.PI * 1.6) * 9;
  return (
    <AbsoluteFill style={{ backgroundColor: '#04060d' }}>
      <Img src={staticFile('outro-back.png')}
           style={{ ...fill, opacity: dim, filter: `blur(${blur}px)` }} />
      <AbsoluteFill style={{ opacity: cardIn, transform: `translateY(${cardRise}px)` }}>
        <Img src={staticFile('card-cta-watch.png')} style={fill} />
        {/* the arrow lives at ~66% of the card; a slow bob keeps a static outro alive */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '61.5%', height: 200,
          transform: `translateY(${bounce}px)`,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── the short ───────────────────────────────────────────────────────────────
export const Kaspa40Short: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#04060d' }}>
    {SPANS.map((s) => (
      <Sequence key={s.file} from={s.out} durationInFrames={s.frames}>
        <OffthreadVideo src={staticFile(s.file)} style={fill} />
      </Sequence>
    ))}

    <Sequence from={SPAN_FRAMES} durationInFrames={OUTRO_FRAMES}>
      <Outro />
    </Sequence>

    <Captions />

    {SPANS.slice(1).map((s) => <SeamHit key={s.file} at={s.out} />)}
    <SeamHit at={SPAN_FRAMES} />
  </AbsoluteFill>
);
