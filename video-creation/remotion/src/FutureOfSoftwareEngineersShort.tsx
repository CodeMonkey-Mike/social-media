// FutureOfSoftwareEngineersShort: the ~30 s SHORT of future-of-software-engineers (1080x1920, 30 fps, NO audio).
// Built per video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B (comp-builder SHORT mode).
// Source = the APPROVED vertical (future-of-software-engineers-VERTICAL.mp4), cut by Stage A into the span intermediates in
// media/future-of-software-engineers/_previews/short/work/ (= the render's --public-dir): one muted OffthreadVideo per
// span-NN.mp4, laid end to end, NEVER seeking into the master. The VO (span wavs + the shared CTA take) and any bed are
// mixed later by mix_short.py; this comp has no audio at all.
//
// Mode: vertical-sourced (the full vertical exists; no assets/short/from-16x9.json, no vertical-cards.json). The longform
// burns NO captions anywhere (caption_scope none), so CAPTION_WINDOWS cover every span and the short is captioned end to end.
// Variants: assets/short/variants.json is empty (the video has no Envato clip and no ChatGPT image), so COVERS is empty.
import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './FutureOfSoftwareEngineersShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;

// ---------------------------------------------------------------------------------------------------------------------
// The span table: _previews/short/work/spans.json, verbatim (out_start * 30 = from; frames = the intermediate's frame
// count, verified with ffprobe -count_frames: 205 / 102 / 333 / 150 = 790 frames = 26.333 s).
// ---------------------------------------------------------------------------------------------------------------------
type Span = { i: number; file: string; from: number; frames: number; role: string };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', from: 0, frames: 205, role: 'hook' },     // final 0.00-6.83: F1 face, then the C5 receipt (from span frame 160)
  { i: 2, file: 'span-02.mp4', from: 205, frames: 102, role: 'body' },   // final 22.54-25.95: F2 face (the locked turn), burn peak at both edges
  { i: 3, file: 'span-03.mp4', from: 307, frames: 333, role: 'body' },   // final 118.79-129.89: D4 card | F3 face (span frames 136-193) | D5 card
  { i: 4, file: 'span-04.mp4', from: 640, frames: 150, role: 'kicker' }, // final 460.19-465.20: F9 face; frames 148-149 = the D17 end card (replaced below)
];
const SPANS_END = 790;                                    // 26.333 s
const TARGET_S = 30.0;
export const DUR = Math.round(TARGET_S * FPS);            // 900 = round(30.000 * 30): spans 26.333 s + 3.667 s outro
const OUTRO_FROM = SPANS_END;                             // the card starts on the first frame after the spans

// Declared empty on purpose: variants.json has no entries and there is no vertical-cards.json (vertical-sourced mode),
// so nothing is overlaid on the spans. lint_covers.py accepts a declared empty table.
type Cover = { tIn: number; tOut: number; kind: string; ref: string };
export const COVERS: Cover[] = [];

// ---------------------------------------------------------------------------------------------------------------------
// OUTRO HOLD (SHORT-CUT-PLAN.snapped.json outro.note): the last 2 frames of span 4 are the D17 end card (empty end-screen
// slots) under the face-out film-burn peak, so they never air. A real <Freeze> of span-04 frame 147 (the LAST F9 face
// frame, the baked burn near its peak) covers frames 148-149 and holds behind the card. The plan suggested frame 135
// (pre-burn); 147 is used so the picture does not drop from the burn's brightness (luma 130) to the clean face (luma 78)
// in one frame. The card is opaque from OUTRO_FROM + CARD_IN on, so the hold only shows through the card's fade-in.
// comp-build.md section 6a rule 1: the Freeze sits in a zero-offset Sequence (Remotion 4.0.462 sets a Freeze's timeline to
// frame + the PARENT Sequence's from and clamps past DUR - 1: 788 + 147 > 899 would freeze the wrong frame).
// ---------------------------------------------------------------------------------------------------------------------
const HOLD_SRC_FRAME = 147;
const HOLD_FROM = SPANS[3].from + 148;                    // 788: span 4's frame 148 onward
const SPAN4_AIRED = HOLD_FROM - SPANS[3].from;            // 148 frames of span 4 air live

const SpanVideo: React.FC<{ file: string }> = ({ file }) => (
  <OffthreadVideo src={staticFile(file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
);

const HeldFrame: React.FC = () => (
  <Sequence from={0} layout="none" name="freeze-offset-zero">
    <Freeze frame={HOLD_SRC_FRAME}>
      <AbsoluteFill>
        <SpanVideo file={SPANS[3].file} />
      </AbsoluteFill>
    </Freeze>
  </Sequence>
);

// ---------------------------------------------------------------------------------------------------------------------
// SEAM HITS: hand:film-burn, the video's own face-cut family (TRANSITIONS.md section 3: the warm radial flash on all 17 face
// edges of the longform). Every seam of this short is a face edge (receipt -> F2, F2 -> D4, D5 -> F9, F9 -> outro), and
// spans 2 and 4 already start / end on their own burn peaks, so the seam hit continues that flash across the splice.
// Fast: 5 frames each side of the seam (~0.33 s), peak ON the splice (between the last outgoing and the first incoming
// frame), screen blend, the longform's colours at a lower peak (0.50 vs 0.82): it stacks on the baked burn at the face
// edges (0.70 washed the face to near white on the splice frames, smoke stills 205 / 306).
// ---------------------------------------------------------------------------------------------------------------------
const SEAM_HALF = 5;
const SEAMS: { at: number; dir: 'in' | 'out'; tag: string }[] = [
  { at: SPANS[1].from, dir: 'in', tag: 'span1 receipt C5 -> span2 F2' },   // hand:film-burn (short seam)
  { at: SPANS[2].from, dir: 'out', tag: 'span2 F2 -> span3 D4 card' },     // hand:film-burn (short seam)
  { at: SPANS[3].from, dir: 'in', tag: 'span3 D5 card -> span4 F9' },      // hand:film-burn (short seam)
  { at: OUTRO_FROM, dir: 'out', tag: 'span4 F9 -> outro card' },          // hand:film-burn (short seam)
];
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

const SeamBurn: React.FC<{ dir: 'in' | 'out' }> = ({ dir }) => {
  const f = useCurrentFrame();                            // 0 .. 2*SEAM_HALF-1 inside its Sequence; the splice sits at 4.5
  const x = (f - (SEAM_HALF - 0.5)) / SEAM_HALF;
  if (Math.abs(x) >= 1) return null;
  const env = Math.pow(Math.cos((x * Math.PI) / 2), 2);
  const sweep = (x + 1) / 2;
  const cx = dir === 'out' ? mix(22, 70, sweep) : mix(78, 30, sweep);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.5 * env,
        background: `radial-gradient(ellipse 95% 75% at ${cx}% 45%, rgba(255,206,140,0.95) 0%, rgba(255,138,48,0.78) 28%, rgba(196,58,12,0.38) 58%, rgba(0,0,0,0) 86%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.32 * env * env,
        background: `radial-gradient(circle at ${100 - cx}% 72%, rgba(255,238,205,0.9) 0%, rgba(255,168,88,0.35) 26%, rgba(0,0,0,0) 52%)` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// CAPTIONS: ZCAPTIONS + CAPTION_WINDOWS from the generated FutureOfSoftwareEngineersShortCaptions.ts (SHORT seconds, no sh():
// s_captions already remapped them through the span table). Montserrat 900 lowercase, #fff fill, 12 px #000 stroke painted
// under the fill, pop 0.7 -> 1.12 -> 1, bottom centre in the SAFE ZONE (block bottom at y 1600 = bottom pad 320, maxWidth 860
// so the 1.12 pop + stroke stay inside 1080), topmost. A group holds until min(next.t, max(t + 1.3, e), its window's end).
// ---------------------------------------------------------------------------------------------------------------------
const CAP_BOTTOM = 320;
const CAP_MAX_W = 860;
const CAP_SIZE = 76;

// A caption never sits on card text: the D4 card (span 3 frames 0-135 = comp frames 307-442) prints its question line at
// y ~1280-1490 of the portrait card, right on the caption safe zone (measured on span-03 frame 60; the card body ends at
// y ~1588, below it the platform UI). The card prints the spoken sentence ("How much demand is left for an engineer who
// only wants to sit there and code?") almost word for word, so the caption track yields to it for exactly those frames
// (SHORT-CUT-PLAN risk note, "dropping the captions for that window is the clean fix"). D5 (text ends y ~1260) keeps its
// captions. The group that straddles the cut ('code.', the spoken "code. Code") shows from the first F3 face frame. Short
// seconds, end-exclusive. Delete a row to put captions back.
// THE C5 RECEIPT (the Google blog in mobile view, span 1 frames 160-205 = 5.33 to 6.83 s) ALSO yields (Mike's final visual-qa,
// 2026-11-15: "Captions sit directly ON the C5 receipt's body text"; the first build kept them): the page's text fills the
// whole portrait frame, so there is no safe zone, and the receipt's own highlight ("approved by engineers") carries the
// spoken words ("Engineers approve it."). The caption 'ai.' therefore ends on the first receipt frame, and 'engineers approve' / 'it.'
// are not shown; the first caption after the window ('you just', 6.85 s) is on the face.
const CARD_TEXT_HOLDS: [number, number][] = [[307 / FPS, 443 / FPS], [160 / FPS, 205 / FPS]];

// AS-RECORDED.md "Whisper mishears": `24.70 "head down to write" -> "head down and write"` (final-video seconds; large-v3
// hears "and" on both audio passes; AS-RECORDED row 2 quotes the locked turn as "head down and write"). s_captions matches a
// fix phrase inside ONE group and the grouping split it ("your head down to" | "write code"), so it never landed. Applied
// here to the one group that holds 24.70 (span 2: short 6.833 + 24.70 - 22.54 = 8.993) and only while the generated text
// still reads the misheard form, so a regenerated captions file with the fix in place makes this a no-op.
const MISHEAR_FIXES: { at: number; from: string; to: string }[] = [
  { at: 6.8333 + (24.7 - 22.54), from: 'your head down to', to: 'your head down and' },
];

type Cap = { t: number; h: string; e: number };
const CAPS: Cap[] = ZCAPTIONS.map((c, i) => {
  const next = ZCAPTIONS[i + 1]?.t ?? Infinity;
  const fix = MISHEAR_FIXES.find((m) => m.at >= c.t && m.at < next && c.h === m.from);
  return fix ? { ...c, h: fix.to } : c;
});

const inAny = (t: number, ws: [number, number][]) => ws.some(([a, b]) => t >= a && t < b);

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!inAny(t, CAPTION_WINDOWS)) return null;
  if (inAny(t, CARD_TEXT_HOLDS)) return null;
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) {
    if (CAPS[i].t <= t + 1e-6) idx = i;
    else break;
  }
  if (idx < 0) return null;
  const cur = CAPS[idx];
  const nextT = CAPS[idx + 1]?.t ?? Infinity;
  const win = CAPTION_WINDOWS.find(([a, b]) => cur.t >= a && cur.t < b);
  const winEnd = win ? win[1] : Infinity;
  const hideAt = Math.min(nextT, Math.max(cur.t + 1.3, cur.e), winEnd);
  if (t >= hideAt) return null;
  // the pop runs from the moment the group becomes VISIBLE (a group released by a card hold pops on the release frame)
  const hold = CARD_TEXT_HOLDS.find(([a, b]) => cur.t >= a && cur.t < b);
  const shownFrom = hold ? hold[1] : cur.t;
  const k = frame - Math.round(shownFrom * FPS);
  const scale = interpolate(k, [0, 6, 12], [0.7, 1.12, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: (1080 - CAP_MAX_W) / 2, width: CAP_MAX_W, bottom: CAP_BOTTOM,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: CAP_SIZE,
          lineHeight: 1.08, letterSpacing: '0.01em', textTransform: 'lowercase', textAlign: 'center', color: '#fff',
          WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${scale})`, transformOrigin: '50% 100%',
          maxWidth: CAP_MAX_W, overflowWrap: 'break-word', textWrap: 'balance' } as React.CSSProperties}>
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// OUTRO CARD: a full-frame TITLE SLIDE on the locked container stylesheet (assets/slide-sources/containers.html tokens:
// --bg-deep #0a0c10, Playfair Display 900 headline in --text-primary #e8eaf0, the accent key words in --accent-green
// #00e68a, the green -> cyan gradient divider, the orbs + 0.03 film grain), reading exactly "WATCH THE FULL VIDEO" (no
// eyebrow, no other text, no em dash), with a downward arrow glyph toward the description / link. Container entrance:
// opacity + 0.97 -> 1 scale over 11 frames, through the decaying seam burn; then the arrow drops in and bobs.
// ---------------------------------------------------------------------------------------------------------------------
const TOK = { bgDeep: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', textPrimary: '#e8eaf0' };
const CARD_IN = 11;
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();                            // 0 at OUTRO_FROM
  const a = interpolate(f, [0, CARD_IN], [0, 1], { extrapolateRight: 'clamp' });
  const s = interpolate(f, [0, CARD_IN], [0.97, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const div = interpolate(f, [CARD_IN - 2, CARD_IN + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const arrowIn = interpolate(f, [CARD_IN + 4, CARD_IN + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bob = f > CARD_IN + 16 ? 12 * Math.sin(((f - CARD_IN - 16) / FPS) * Math.PI * 2 * 0.9) : 0;
  return (
    <AbsoluteFill style={{ opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%', background: TOK.bgDeep, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 820, height: 820, left: -300, top: 180, borderRadius: '50%', background: TOK.green, filter: 'blur(120px)', opacity: 0.22 }} />
      <div style={{ position: 'absolute', width: 820, height: 820, right: -320, bottom: 160, borderRadius: '50%', background: TOK.cyan, filter: 'blur(120px)', opacity: 0.22 }} />
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
        <div style={{ fontFamily: `${PLAYFAIR},'Playfair Display',serif`, fontWeight: 900, fontSize: 144, lineHeight: 1.06,
          letterSpacing: '-0.02em', color: TOK.textPrimary, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div>WATCH THE</div>
          <div style={{ color: TOK.green }}>FULL VIDEO</div>
        </div>
        <div style={{ width: 120 * div, height: 6, borderRadius: 3, margin: '46px 0 52px',
          background: `linear-gradient(90deg, ${TOK.green}, ${TOK.cyan})` }} />
        <svg width={120} height={170} viewBox="0 0 120 170" style={{ opacity: arrowIn,
          transform: `translateY(${(1 - arrowIn) * -30 + bob}px)`, filter: `drop-shadow(0 0 18px rgba(0,230,138,0.55))` }}>
          <path d="M60 10 L60 150 M18 108 L60 150 L102 108" fill="none" stroke={TOK.green} strokeWidth={14}
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.03, backgroundImage: GRAIN, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the composition
// ---------------------------------------------------------------------------------------------------------------------
export const FutureOfSoftwareEngineersShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {/* the spans, end to end: one muted OffthreadVideo per intermediate, played linearly from its frame 0 */}
    {SPANS.map((sp) => (
      <Sequence key={sp.i} from={sp.from} durationInFrames={sp.i === 4 ? SPAN4_AIRED : sp.frames} name={`span ${sp.i} ${sp.role}`}>
        <SpanVideo file={sp.file} />
      </Sequence>
    ))}

    {/* the outro hold: span-04 frame 147 frozen over span 4's last 2 frames (the D17 end card) and behind the card */}
    <Sequence from={HOLD_FROM} durationInFrames={DUR - HOLD_FROM} name="outro hold (span-04 f147)">
      <HeldFrame />
    </Sequence>

    {/* the outro card */}
    <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM} name="outro WATCH THE FULL VIDEO">
      <OutroCard />
    </Sequence>

    {/* seam hits: hand:film-burn, peak ON each splice, above the picture and the card, under the captions */}
    {SEAMS.map((sm) => (
      <Sequence key={sm.at} from={sm.at - SEAM_HALF} durationInFrames={2 * SEAM_HALF} name={`hand:film-burn ${sm.tag}`}>
        <SeamBurn dir={sm.dir} />
      </Sequence>
    ))}

    {/* captions, topmost */}
    <Captions />
  </AbsoluteFill>
);
