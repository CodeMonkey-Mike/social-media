// PlanToMakeMillionsShort: the ~30 s SHORT of the longform-edited video `plan-to-make-millions` (comp-builder SHORT mode,
// 2026-11-24). 16:9-SOURCED mode (assets/short/from-16x9.json): no full vertical exists, the span intermediates were painted
// off the 16:9 comp rendered WITHOUT captions, so NOTHING is burned and the short captions every span.
// Rules: video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B.
//
// Public dir = media/plan-to-make-millions/_previews/short/work (the span intermediates + vertical-cards/ + outro-hold.png).
//   - one MUTED OffthreadVideo per span-NN.mp4, laid end to end per spans.json (out_start / frames), never seeking a master
//   - a fast ~0.3 s seam hit at every span seam from the video's own face-cut family (TRANSITIONS.md: hand:film-burn, the warm
//     radial flash), hand-rolled, no library engine
//   - the NATIVE-VERTICAL cards of assets/short/vertical-cards.json over their overlay_short windows (hard in/out on the window
//     edges), C16 and beat86 stepped through their state files on the longform's own cues; the HL1 face hold over its sliver
//   - captions from PlanToMakeMillionsShortCaptions.ts, compared in WHOLE FRAMES, only inside CAPTION_WINDOWS_F, in the safe zone
//   - the outro: the last span's final frame held under a full-frame TITLE-SLIDE card "WATCH THE FULL VIDEO" (dark locked
//     stylesheet, Playfair headline, green accent, downward arrow)
// NO audio in the comp: mix_short.py lays the VO spans, the shared CTA take and the bed.
import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  Easing,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { ZCAPTIONS, CAPTION_WINDOWS_F, CAPTION_FPS } from './PlanToMakeMillionsShortCaptions';

loadMontserrat('normal', { weights: ['900'] });
loadPlayfair('normal', { weights: ['900'] });
loadDMSans('normal', { weights: ['600'] });

export const FPS = 30;
const SPANS_TOTAL_S = 27.8;
const OUTRO_S = 3.0;
export const DUR = Math.round((SPANS_TOTAL_S + OUTRO_S) * FPS); // round(30.800 * 30) = 924
const F = (s: number) => Math.round(s * FPS);

if (CAPTION_FPS !== FPS) {
  throw new Error(`PlanToMakeMillionsShort: CAPTION_FPS ${CAPTION_FPS} != FPS ${FPS}`);
}

// ---- the span table (spans.json, frame-exact; each intermediate's frame count verified with ffprobe -count_frames) ----
type Span = { i: number; file: string; from: number; frames: number; sourced: 'FACE' | 'COVER' };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', from: 0, frames: 214, sourced: 'FACE' },   // hook: "Crypto has been dumping ... millions in 2028."
  { i: 2, file: 'span-02.mp4', from: 214, frames: 192, sourced: 'FACE' }, // "Most people hear that ... I start buying."
  { i: 3, file: 'span-03.mp4', from: 406, frames: 171, sourced: 'COVER' }, // "Pieverse, I called it ... over a billion." (C16)
  { i: 4, file: 'span-04.mp4', from: 577, frames: 108, sourced: 'COVER' }, // "I need low entries ..." (D-ENTRIES, beat86)
  { i: 5, file: 'span-05.mp4', from: 685, frames: 149, sourced: 'FACE' },  // kicker: "Millions by 2028 ... that's my plan."
];
const SPANS_END = SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].frames; // 834
if (SPANS_END !== F(SPANS_TOTAL_S)) {
  throw new Error(`PlanToMakeMillionsShort: span table ends at ${SPANS_END}, spans_total_seconds says ${F(SPANS_TOTAL_S)}`);
}
for (let k = 1; k < SPANS.length; k++) {
  if (SPANS[k].from !== SPANS[k - 1].from + SPANS[k - 1].frames) {
    throw new Error(`PlanToMakeMillionsShort: span ${SPANS[k].i} does not butt span ${SPANS[k - 1].i}`);
  }
}
const SEAMS = SPANS.slice(1).map((s) => s.from); // 214, 406, 577, 685

// ---- COVERS: the native-vertical overlays (assets/short/vertical-cards.json, SHORT seconds = whole frames / 30) ----
// variants.json is an EMPTY table for this short (no Envato / ChatGPT span), so every row below is a vertical-cards entry.
// Consecutive same-ref rows are STATE SWAPS (the 16:9 build progression, no ingress transition between them):
//   C16 (animated chart, HOOK run) cued off Mike's words: the line draws to the call 13.58 to 14.70, the call dot lands on
//   'called' (14.81), 'MY CALL, AROUND A 65M CAP' + badge AROUND 65M land on '65 million' (15.75), the line runs on to the read
//   15.93 to 18.53 while the badge counts up, the badge locks OVER 1B on 'billion' (18.75), hold to 19.235.
//   beat86 (D-ENTRIES card) per beat86-d-entries-v.states.json: s2 from 19.235, s3 from 19.475 (main_state) to 22.835.
//   The HL1 hold (a face frame) covers the 3.4-frame headline sliver at the end of span 1 (7.022 to 7.135; the hold starts
//   on frame 210 so the sliver's first frame, 210.66, is covered, and ends on the seam).
// The card windows are snapped to the seam frames (406 / 577 / 685): hard in/out exactly on the window edges.
export const COVERS = [
  { tIn: 7.0000, tOut: 7.1333, kind: 'still', ref: 'hold-7.02', file: 'vertical-cards/hold-7.02.png' },
  // C16 is a PER-FRAME DRAW-ON (2026-11-24 fix): one PNG per comp frame 406..576 from the same vertical chart file
  // (assets/short/vertical-cards/_build_C16_v_seq.py; cue table C16-seq.json). The first build swapped three stills: the plot
  // sat empty for 2.2 s and the run to OVER 1B showed for 14 frames. `file` is the poster (the payoff state).
  { tIn: 13.5333, tOut: 19.2333, kind: 'chart', ref: 'C16', state: 'hook-draw', file: 'vertical-cards/C16-hook-payoff-v.png', seq: 'vertical-cards/C16-seq', seqFrames: 171 },
  { tIn: 19.2333, tOut: 19.4667, kind: 'deck', ref: 'beat86', state: 's2', file: 'vertical-cards/beat86-d-entries-v-s2.png' },
  { tIn: 19.4667, tOut: 22.8333, kind: 'deck', ref: 'beat86', state: 's3', file: 'vertical-cards/beat86-d-entries-v-s3.png' },
];
const STATE_XFADE = 5; // frames: a state swap inside one card is a quick dissolve, never a transition

const CoverLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const out: React.ReactNode[] = [];
  COVERS.forEach((c, k) => {
    const a = F(c.tIn);
    const b = F(c.tOut);
    const prev = COVERS[k - 1];
    const swapIn = prev && prev.ref === c.ref && F(prev.tOut) === a; // a state swap: dissolve over the previous state
    if (frame < a || frame >= b) return;
    const op = swapIn ? interpolate(frame, [a, a + STATE_XFADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
    if (swapIn && op < 1) {
      out.push(<Img key={`p${k}`} src={staticFile(prev.file)} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920 }} />);
    }
    // a card that enters ON a span seam settles with the same zoom as the span under it (the seam hit)
    const z = SEAMS.includes(a) ? seamZoom(frame, a, false) : 1;
    // a row with `seq` plays one PNG per frame (f000.png = the row's first frame), holding its last frame
    const src = c.seq ? `${c.seq}/f${String(Math.min(frame - a, (c.seqFrames ?? 1) - 1)).padStart(3, '0')}.png` : c.file;
    out.push(<Img key={`c${k}`} src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: op, transform: `scale(${z})` }} />);
  });
  return <>{out}</>;
};

// ---- the seam hit: the video's face-cut family (hand:film-burn), compressed to ~0.3 s for a short ----
// A warm radial burn (orange -> gold -> white core) screened over the cut, peaking ON the seam frame, plus a small zoom
// settle on the incoming span. 9 frames total (4 before, the seam, 4 after) = 0.3 s.
const HIT_PRE = 4;
const HIT_POST = 4;
const SeamBurn: React.FC = () => {
  const frame = useCurrentFrame();
  const seam = SEAMS.find((s) => frame >= s - HIT_PRE && frame <= s + HIT_POST);
  if (seam === undefined) return null;
  const d = frame - seam;
  const amt = d <= 0
    ? interpolate(d, [-HIT_PRE, 0], [0, 1], { easing: Easing.in(Easing.quad) })
    : interpolate(d, [0, HIT_POST], [1, 0], { easing: Easing.out(Easing.quad) });
  const drift = interpolate(d, [-HIT_PRE, HIT_POST], [-90, 90]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <AbsoluteFill
        style={{
          opacity: amt,
          background: `radial-gradient(ellipse 85% 60% at ${540 + drift}px ${900 - drift * 0.6}px, rgba(255,250,235,1) 0%, rgba(255,205,120,0.95) 28%, rgba(255,120,30,0.75) 55%, rgba(170,40,0,0.0) 100%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: amt * 0.55, background: 'linear-gradient(180deg, rgba(255,150,40,0.6), rgba(255,80,0,0.15) 60%, rgba(255,190,90,0.5))' }} />
    </AbsoluteFill>
  );
};
const seamZoom = (frame: number, spanFrom: number, isFirst: boolean) => {
  if (isFirst) return 1;
  return interpolate(frame - spanFrom, [0, HIT_POST + 2], [1.06, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
};

const SpanLayer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {SPANS.map((s, k) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames} layout="none">
          <AbsoluteFill style={{ transform: `scale(${seamZoom(frame, s.from, k === 0)})` }}>
            <OffthreadVideo src={staticFile(s.file)} muted style={{ width: 1080, height: 1920 }} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </>
  );
};

// ---- captions: Montserrat house style, WHOLE-FRAME timing, only inside CAPTION_WINDOWS_F, safe zone ----
// A group shows from round(t*30) and hides at min(next group's frame, max(start + 1.3 s, round(e*30)), the end of the
// CAPTION_WINDOWS_F window that holds its start) (longform-to-short.md: never a flat 1.3 s cap, never across a span seam).
const CAPS = ZCAPTIONS.map((c) => ({ f: F(c.t), ef: F(c.e), h: c.h }));
const windowEndF = (f: number) => {
  const w = CAPTION_WINDOWS_F.find(([a, b]) => f >= a && f < b);
  return w ? w[1] : -1;
};
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  if (!CAPTION_WINDOWS_F.some(([a, b]) => frame >= a && frame < b)) return null;
  let idx = -1;
  for (let k = 0; k < CAPS.length; k++) {
    if (CAPS[k].f <= frame) idx = k;
    else break;
  }
  if (idx < 0) return null;
  const cur = CAPS[idx];
  const nextF = idx + 1 < CAPS.length ? CAPS[idx + 1].f : Infinity;
  const winEnd = windowEndF(cur.f);
  if (winEnd < 0) return null;
  const hideF = Math.min(nextF, Math.max(cur.f + Math.round(1.3 * FPS), cur.ef), winEnd);
  if (frame >= hideF) return null;
  const k = frame - cur.f;
  const scale = interpolate(k, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 320,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 840,
            textAlign: 'center',
            fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
            fontWeight: 900,
            fontSize: 76,
            lineHeight: 1.08,
            textTransform: 'lowercase',
            color: '#ffffff',
            WebkitTextStroke: '12px #000',
            paintOrder: 'stroke fill',
            transform: `scale(${scale})`,
            transformOrigin: '50% 100%',
          }}
        >
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- the outro: last span's final frame held, a TITLE-SLIDE card "WATCH THE FULL VIDEO" brought in over it ----
// Locked dark container stylesheet tokens (container-reference/container-canonical.css): bg-deep #0a0c10, text-primary
// #e8eaf0, accent-green #00e68a, the green -> cyan divider, Playfair Display 900 headline, grain + orbs. No eyebrow, no
// body: the card reads exactly "WATCH THE FULL VIDEO".
const OUTRO_FROM = SPANS_END; // 834
const Outro: React.FC = () => {
  const frame = useCurrentFrame(); // local to the Sequence
  const bg = interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const holdScale = interpolate(frame, [0, 90], [1, 1.04], { extrapolateRight: 'clamp' });
  const head = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const div = interpolate(frame, [12, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const arrowIn = interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bob = frame > 26 ? Math.sin(((frame - 26) / FPS) * Math.PI * 2 * 1.2) * 14 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${holdScale})` }}>
        <Img src={staticFile('outro-hold.png')} style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#0a0c10', opacity: bg }} />
      <AbsoluteFill style={{ opacity: bg, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 900, height: 900, right: -420, top: -380, borderRadius: '50%', background: 'rgba(0,230,138,0.55)', filter: 'blur(160px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', width: 760, height: 760, left: -380, bottom: -300, borderRadius: '50%', background: 'rgba(0,194,255,0.5)', filter: 'blur(160px)', opacity: 0.22 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: '0 110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ transform: `translateY(${(1 - head) * 40}px)`, opacity: head, marginTop: -120 }}>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              fontSize: 140,
              lineHeight: 1.07,
              letterSpacing: '-0.02em',
              color: '#e8eaf0',
            }}
          >
            WATCH THE
            <br />
            <span style={{ color: '#00e68a' }}>FULL VIDEO</span>
          </div>
        </div>
        <div
          style={{
            width: 96 * div,
            height: 5,
            borderRadius: 3,
            background: 'linear-gradient(90deg,#00e68a,#00c2ff)',
            margin: '48px 0 0 0',
          }}
        />
        <div style={{ marginTop: 120, marginLeft: -20, opacity: arrowIn, transform: `translateY(${(1 - arrowIn) * -30 + bob}px)` }}>
          <svg width="200" height="260" viewBox="0 0 150 190">
            <defs>
              {/* userSpaceOnUse: an objectBoundingBox gradient on a zero-width vertical line renders NOTHING (smoke still f900) */}
              <linearGradient id="ptmmArrow" gradientUnits="userSpaceOnUse" x1="75" y1="8" x2="75" y2="168">
                <stop offset="0%" stopColor="#00c2ff" />
                <stop offset="100%" stopColor="#00e68a" />
              </linearGradient>
            </defs>
            <path d="M75 8 L75 160" stroke="url(#ptmmArrow)" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M22 112 L75 168 L128 112" stroke="#00e68a" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </AbsoluteFill>
      {/* film grain, as the stylesheet's .frame::after */}
      <AbsoluteFill
        style={{
          opacity: 0.03 * bg,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </AbsoluteFill>
  );
};

export const PlanToMakeMillionsShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <SpanLayer />
      <CoverLayer />
      <SeamBurn />
      <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM} layout="none">
        <Outro />
      </Sequence>
      {/* captions TOPMOST; CAPTION_WINDOWS_F end at 834, so none rides into the outro card */}
      <Captions />
    </AbsoluteFill>
  );
};
