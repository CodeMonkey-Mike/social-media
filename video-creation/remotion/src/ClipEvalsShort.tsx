// ClipEvalsShort: the 30 s SHORT of clip-evals (AI Engineering Simplified; longform-presentation, scripted "standard" format).
// 1080x1920, 30 fps, NO audio. Built per video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5
// Stage B (comp-builder SHORT mode). Source = the delivered vertical (clip-evals VERTICAL-v1.mp4), cut by Stage A into the span
// intermediates in media/standard/clip-evals/_previews/short/work/ (= the render's --public-dir): one muted OffthreadVideo per
// span-NN.mp4, laid end to end, NEVER seeking into the master. The VO (span wavs + the shared CTA take
// video-creation/assets/vo/cta-watch-full.mp3) is mixed afterwards by mix_short.py; this comp has no audio at all.
//
// Mode: vertical-sourced, nothing burned in the source (the presentation track ships no captions), so CAPTION_WINDOWS cover
// every span and the short is captioned end to end. No variants (no Envato clip or ChatGPT image in any span): COVERS is empty.
// MUSIC-PLAN.json no_music + no_sfx: no bed, no seam whoosh, and (SHORT-CUT-PLAN outro.note) every seam is a PLAIN CUT.
import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './ClipEvalsShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;

// ---------------------------------------------------------------------------------------------------------------------
// The span table: _previews/short/work/spans.json, verbatim (out_start * 30 = from; frames = the intermediate's frame
// count, verified with ffprobe -count_frames: 131 / 319 / 352 = 802 frames = 26.733 s).
// ---------------------------------------------------------------------------------------------------------------------
type Span = { i: number; file: string; from: number; frames: number; role: string };
export const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', from: 0, frames: 131, role: 'hook' },     // final 58.92-63.28: screen share, CH1 title slide over the webcam pane
  { i: 2, file: 'span-02.mp4', from: 131, frames: 319, role: 'body' },   // final 907.44-918.08: noise-table card, state all (static)
  { i: 3, file: 'span-03.mp4', from: 450, frames: 352, role: 'kicker' }, // final 918.36-930.10: noise-table held, its own cross-fade to the red rows
];
const SPANS_END = 802;                                    // 26.733 s
const TARGET_S = 30.0;
export const DUR = Math.round(TARGET_S * FPS);            // 900 = spans 26.733 s + 3.267 s outro (SHORT-CUT-PLAN outro.seconds 3.27)
const OUTRO_FROM = SPANS_END;                             // the card starts on the first frame after the spans

// Declared empty on purpose: no variants.json and no vertical-cards.json (vertical-sourced mode, no Envato / AI still in any
// span), so nothing is overlaid on the spans. lint_covers.py accepts a declared empty table.
type Cover = { tIn: number; tOut: number; kind: string; ref: string };
export const COVERS: Cover[] = [];

// SEAMS (SHORT-CUT-PLAN.snapped.json + the brief): span 1 -> 2 (screen share -> card) and span 2 -> 3 (two settled states of
// the one NOISE card) are PLAIN CUTS. The video has no transitions and no SFX (MUSIC-PLAN no_music, no_sfx), so no seam hit
// is drawn: the Sequences simply abut at frames 131 and 450.

// ---------------------------------------------------------------------------------------------------------------------
// OUTRO HOLD (SHORT-CUT-PLAN outro.note): behind the card, span 3's LAST frame (frame 351: the NOISE table with the red rows,
// 100 / 83.3) holds from OUTRO_FROM to the end. A real <Freeze>, inside a zero-offset Sequence (comp-build.md section 6a rule 1:
// Remotion sets a Freeze's timeline to frame + the PARENT Sequence's from and clamps past DUR - 1, so 802 + 351 > 899 would
// freeze the wrong frame without it). The card is opaque from OUTRO_FROM + CARD_IN on, so the hold shows only through the fade.
// ---------------------------------------------------------------------------------------------------------------------
const HOLD_SRC_FRAME = SPANS[2].frames - 1;               // 351

const SpanVideo: React.FC<{ file: string }> = ({ file }) => (
  <OffthreadVideo src={staticFile(file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
);

const HeldFrame: React.FC = () => (
  <Sequence from={0} layout="none" name="freeze-offset-zero">
    <Freeze frame={HOLD_SRC_FRAME}>
      <AbsoluteFill>
        <SpanVideo file={SPANS[2].file} />
      </AbsoluteFill>
    </Freeze>
  </Sequence>
);

// ---------------------------------------------------------------------------------------------------------------------
// CAPTIONS: ZCAPTIONS + CAPTION_WINDOWS from the generated ClipEvalsShortCaptions.ts (SHORT seconds, already remapped through the
// span table; only the words each span keeps). Montserrat 900 lowercase, #fff fill, 12 px #000 stroke painted under the fill,
// pop 0.7 -> 1.12 -> 1, maxWidth 860 so the 1.12 pop + stroke stay inside 1080, topmost. A group holds until
// min(next.t, max(t + 1.3, e), its window's end), so no group crosses a span seam and none runs into the outro.
//
// PLACEMENT, per span (measured on the span intermediates, _previews/short/qa/src/):
//  * span 1 (screen share): the slide's content ends at y ~724 and Mike's webcam pane starts at y 934 (mouth near y 1420), so
//    the usual bottom block would sit on his mouth. The caption sits in the BAND between them, y 740-925, centred in it
//    (one line: every span-1 group is <= 16 characters; the pop scales about the band's centre so it never leaves the band).
//  * spans 2 + 3 (the full-frame NOISE card, its content y 330-1240): the usual SAFE-ZONE block, bottom pad 320 (block bottom
//    at y 1600, a two-line group tops out at y ~1430), clear of the card's text.
// ---------------------------------------------------------------------------------------------------------------------
const CAP_MAX_W = 860;
const CAP_SIZE = 76;
const CAP_BOTTOM = 320;                                    // spans 2-3: bottom of the block at y 1600
const BAND_TOP = 740;                                      // span 1: the gap between the slide and the webcam pane
const BAND_H = 925 - 740;
const SPAN1_END_F = SPANS[0].from + SPANS[0].frames;     // 131: the first frame of span 2

// EVERY caption time is compared in whole FRAMES (Math.round(s * FPS)), never in seconds: the generated file writes
// 3-decimal seconds, and span 1's window end 131/30 = 4.36667 s is written 4.367, so a seconds test kept "at all." on the
// NOISE card for the first frame of span 2 (QA still f131, first build). Rounded to frames, every window edge IS its seam.
type Cap = { f: number; h: string; ef: number };
const toF = (s: number) => Math.round(s * FPS);
const CAPS: Cap[] = ZCAPTIONS.map((c) => ({ f: toF(c.t), h: c.h, ef: toF(Math.max(c.t + 1.3, c.e)) }));
const WINS_F: [number, number][] = CAPTION_WINDOWS.map(([a, b]) => [toF(a), toF(b)]);

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  if (!WINS_F.some(([a, b]) => frame >= a && frame < b)) return null;
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) {
    if (CAPS[i].f <= frame) idx = i;
    else break;
  }
  if (idx < 0) return null;
  const cur = CAPS[idx];
  const nextF = CAPS[idx + 1]?.f ?? Infinity;
  const win = WINS_F.find(([a, b]) => cur.f >= a && cur.f < b);
  const winEndF = win ? win[1] : Infinity;
  const hideAtF = Math.min(nextF, cur.ef, winEndF);        // min(next group, max(t + 1.3 s, last word end), window end)
  if (frame >= hideAtF) return null;
  const k = frame - cur.f;
  const scale = interpolate(k, [0, 6, 12], [0.7, 1.12, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });
  const inBand = cur.f < SPAN1_END_F;                     // span 1: the band between the slide and the webcam
  const text = (
    <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: CAP_SIZE,
      lineHeight: 1.08, letterSpacing: '0.01em', textTransform: 'lowercase', textAlign: 'center', color: '#fff',
      WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${scale})`,
      transformOrigin: inBand ? '50% 50%' : '50% 100%', maxWidth: CAP_MAX_W, overflowWrap: 'break-word',
      whiteSpace: inBand ? 'nowrap' : 'normal', textWrap: 'balance' } as React.CSSProperties}>
      {cur.h}
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {inBand ? (
        <div style={{ position: 'absolute', left: (1080 - CAP_MAX_W) / 2, width: CAP_MAX_W, top: BAND_TOP, height: BAND_H,
          display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {text}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: (1080 - CAP_MAX_W) / 2, width: CAP_MAX_W, bottom: CAP_BOTTOM,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {text}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// OUTRO CARD: a full-frame card in the video's OWN card look (assets/card-sources/base.css tokens + the portrait reflow rules
// of portrait-text.css): page --bg-deep #0a0c10, content LEFT-aligned at the 72 px portrait margin like every clip-evals card,
// the Playfair Display 900 headline in --text-primary #e8eaf0 with the key words in --accent-cyan #00c2ff (this video's accent
// for "the part being talked about"), the green -> cyan gradient divider, the .orb glow (cyan, blur 120, opacity .30) in the
// top-right corner as on the NOISE card the viewer just left, and the 0.03 film grain. It reads exactly "WATCH THE FULL VIDEO"
// (no eyebrow, no other text, no em dash), with a downward arrow toward the title / link. Everything sits inside the phone-safe
// band (portrait-text.css: y 120-1450). Entrance: opacity + 0.97 -> 1 scale over 9 frames (fast; the CTA line starts about
// 0.15 s after OUTRO_FROM), then the divider grows and the arrow drops in and bobs.
// ---------------------------------------------------------------------------------------------------------------------
const TOK = { bgDeep: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', textPrimary: '#e8eaf0' };
const CARD_IN = 9;
const SIDE = 72;
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
      <div style={{ position: 'absolute', width: 900, height: 900, right: -380, top: -300, borderRadius: '50%', background: TOK.cyan, filter: 'blur(120px)', opacity: 0.3 }} />
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
        padding: `120px ${SIDE}px 470px` }}>
        <div style={{ fontFamily: `${PLAYFAIR},'Playfair Display',serif`, fontWeight: 900, fontSize: 132, lineHeight: 1.06,
          letterSpacing: '-0.02em', color: TOK.textPrimary, textAlign: 'left', whiteSpace: 'nowrap' }}>
          <div>WATCH THE</div>
          <div style={{ color: TOK.cyan }}>FULL VIDEO</div>
        </div>
        <div style={{ width: 110 * div, height: 6, borderRadius: 3, margin: '44px 0 50px',
          background: `linear-gradient(90deg, ${TOK.green}, ${TOK.cyan})` }} />
        <svg width={120} height={170} viewBox="0 0 120 170" style={{ marginLeft: -14, opacity: arrowIn,
          transform: `translateY(${(1 - arrowIn) * -30 + bob}px)`, filter: 'drop-shadow(0 0 18px rgba(0,194,255,0.5))' }}>
          <path d="M60 10 L60 150 M18 108 L60 150 L102 108" fill="none" stroke={TOK.cyan} strokeWidth={14}
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
export const ClipEvalsShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {/* the spans, end to end: one muted OffthreadVideo per intermediate, played linearly from its frame 0; plain cuts */}
    {SPANS.map((sp) => (
      <Sequence key={sp.i} from={sp.from} durationInFrames={sp.frames} name={`span ${sp.i} ${sp.role}`}>
        <SpanVideo file={sp.file} />
      </Sequence>
    ))}

    {/* the outro hold: span-03 frame 351 (the red-row NOISE table) frozen behind the card */}
    <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM} name="outro hold (span-03 f351)">
      <HeldFrame />
    </Sequence>

    {/* the outro card */}
    <Sequence from={OUTRO_FROM} durationInFrames={DUR - OUTRO_FROM} name="outro WATCH THE FULL VIDEO">
      <OutroCard />
    </Sequence>

    {/* captions, topmost (none in the outro: CAPTION_WINDOWS end at SPANS_END) */}
    <Captions />
  </AbsoluteFill>
);
