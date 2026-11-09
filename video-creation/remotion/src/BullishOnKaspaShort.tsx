// BullishOnKaspaShort.tsx: bullish-on-kaspa, the 30 s SHORT (longform-to-short.md section 5 Stage B), 1080x1920 @30.
// Public dir: media/bullish-on-kaspa/_previews/short/work (span-NN.mp4, variants/, cutframes/).
// One muted OffthreadVideo per span intermediate laid end to end (spans.json), NEVER a seek into the master. NO audio in the comp:
// mix_short.py adds the crossfaded VO spans, the shared CTA take and the bed.
//
// LAYERS, bottom to top: spans -> variant overlays (assets/short/variants.json) -> outro hold + card -> film burns -> captions.
//
// WHAT IS BAKED: the spans are the delivered VERTICAL, so the film burn's PRE-cut half is already in the picture ahead of every
// face cut-out. A variant full-frame over the POST-cut half hides that half, so this comp redraws ONLY the post half on top
// (BURN_POST). The seams with no baked burn get a compressed whole burn (SEAM_HITS, 0.3 s).
//
// CAPTIONS (longform-to-short.md): s_captions writes ZCAPTIONS + CAPTION_WINDOWS. Its burned list reads assets/captions.json
// `windows` only, and on this video the F1 hook carries a burned kt-caption-highlight line that list does not know
// (BullishOnKaspaData KT_PHRASES t 0.0 + 1.94; F1 is not in `windows`). The short's track over it doubles the words on the hook,
// one block on top of the other, so BAKED_CAPTIONS drops those groups: section 5 "never blanket-overlay, or you double up".
// This DEPARTS from the lane's "never clip the windows further"; recorded under `deviations` in comp-build-report.json. The
// generated windows are untouched, and every other group renders as generated.
//
// CAPTION SLOTS: the default block sits in the safe zone (bottom pad 320). Two windows carry baked TEXT in that band, and a caption
// never sits on card text: F3's "BULLISH ON / KASPA" pop (y 1345-1580) and the C6 receipt (body text down to y 1740), so
// those groups move into the free band under the text (SLOTS).
//
// Transition ids (grep the plan against this comp): hand:film-burn · hand:kt-whip-cut · hand:fade · hand:xfade-scale
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { KtClock, KtWhipCut } from './effects/kinetic-text';
import { FilmBurn } from './BullishOnKaspaCharts';
import { CAPTION_WINDOWS, ZCAPTIONS } from './BullishOnKaspaShortCaptions';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ---------------------------------------------------------------------------------------------------------------------
// the span table (_previews/short/work/spans.json: out_start, frames), plus the 3.000 s outro
// ---------------------------------------------------------------------------------------------------------------------
const SPANS = [
  { file: 'span-01.mp4', from: 0, frames: 176 }, //   hook, F1 + the BR-1 beat
  { file: 'span-02.mp4', from: 176, frames: 226 }, // body, BR-4 + BR-5 beats, F3
  { file: 'span-03.mp4', from: 402, frames: 179 }, // body, BR-8 beat, C6 receipt
  { file: 'span-04.mp4', from: 581, frames: 233 }, // kicker, F7 (carries its own burned captions: no window here)
];
const OUTRO_FROM = 814; // spans_total_seconds 27.133
const OUTRO_FRAMES = 90;
export const DUR = 904; // round(30.133 * 30)

if (SPANS.some((s, i) => i > 0 && s.from !== SPANS[i - 1].from + SPANS[i - 1].frames) || SPANS[3].from + SPANS[3].frames !== OUTRO_FROM) {
  throw new Error('BullishOnKaspaShort: the spans are not laid end to end');
}
if (OUTRO_FROM + OUTRO_FRAMES !== DUR) throw new Error('BullishOnKaspaShort: the outro does not fill the comp');

const SEAMS = SPANS.slice(1).map((s) => s.from);
/** the frame the span holding second t ends on */
const spanEnd = (t: number) => {
  const s = SPANS.find((x) => t * FPS < x.from + x.frames) ?? SPANS[SPANS.length - 1];
  return s.from + s.frames;
};
/** seconds -> frame; a window edge within a frame of a seam IS the seam, so no sliver of the vertical's asset shows at the join */
const F = (t: number) => {
  const f = Math.round(t * FPS);
  return SEAMS.find((s) => Math.abs(s - f) <= 1) ?? f;
};

const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const box: React.CSSProperties = { position: 'absolute', inset: 0 };
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------------------------------------------------------------------------------------------------------------------
// the variant overlays, assets/short/variants.json (Mike's variety rule): full-frame over overlay_short, the vertical's ingress
// ---------------------------------------------------------------------------------------------------------------------
type Cover = { tIn: number; tOut: number; kind: 'vid'; ref: string; tx: 'whip' | 'fade' | 'cut'; d?: number; tail?: number; cap: boolean; fps: number };
export const COVERS: Cover[] = [
  { tIn: 3.367, tOut: 5.87, kind: 'vid', ref: 'BR-1-phone-chart-teal-night', tx: 'whip', cap: true, fps: 30 }, // hand:film-burn + hand:kt-whip-cut landing
  { tIn: 5.87, tOut: 7.1, kind: 'vid', ref: 'BR-4-terminal-build-angled', tx: 'whip', tail: 15, cap: true, fps: 24 }, // hand:film-burn + hand:kt-whip-cut landing, the seam hit
  { tIn: 7.1, tOut: 9.133, kind: 'vid', ref: 'BR-5-devs-code-lanyard-night', tx: 'fade', d: 15, cap: true, fps: 24 }, // hand:fade
  { tIn: 13.42, tOut: 15.615, kind: 'vid', ref: 'BR-8-container-ship-dusk-river', tx: 'cut', tail: 11, cap: true, fps: 25 }, // hand:film-burn, cut; tail = under the C6 landing
];

// 24 / 25 fps clips play frame-for-frame (comp-build.md section 11), each one covers its slot at that rate
const rate = (c: Cover) => FPS / c.fps;
const WHIP_DUR_FRAMES = 12; // KtWhipCut default: dt < 0.37 s = local frames 0-11

const VariantRow: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame();
  const clip = <OffthreadVideo src={staticFile(`variants/${c.ref}.mp4`)} muted playbackRate={rate(c)} style={fill} />;
  if (c.tx === 'whip') {
    // comp-build.md section 6a cost trap: the engine mounts the shot 8 times, so inside the whip it gets the CUTFRAME still
    // (the clip's own frame at the whip's landing, so the hand-over to the live clip is seamless)
    const shot = f < WHIP_DUR_FRAMES ? <Img src={staticFile(`cutframes/${c.ref}.jpg`)} style={fill} /> : clip;
    return (
      <KtWhipCut t0={F(c.tIn) / FPS} width={W} height={H}>
        {shot}
      </KtWhipCut>
    );
  }
  if (c.tx === 'fade' && f < (c.d ?? 15)) return <div style={{ ...box, opacity: f / (c.d ?? 15) }}>{clip}</div>;
  return clip;
};

const VariantTrack: React.FC = () => (
  <>
    {COVERS.map((c) => {
      const from = F(c.tIn);
      return (
        <Sequence key={c.ref} from={from} durationInFrames={F(c.tOut) - from + (c.tail ?? 0)} name={c.ref}>
          <VariantRow c={c} />
        </Sequence>
      );
    })}
  </>
);

// BR-8 -> C6: the span's own 11-frame cross-fade starts on the frame the BR-8 variant ends, so ending the variant there would
// show the vertical's OLD ship for 11 frames. The variant runs on under it, and the receipt lands over it from its first
// settled frame, on the vertical's own hand:xfade-scale (opacity, 0.93 -> 1), then hands over to the live span frame for frame.
const C6_LAND = { from: 468, frames: 11, spanFrame: 77 }; // span 3 starts at 402: frame 468 + 11 = span frame 77
const C6Landing: React.FC = () => {
  const f = useCurrentFrame();
  const u = f / C6_LAND.frames;
  return (
    // full size by u 0.7: a near-1 scale at high opacity leaves a 3-10 px strip of the ship down both edges (edge-text FAIL at 15.90, 15.93 s)
    <div style={{ ...box, opacity: u, transform: `scale(${Math.min(1, 0.93 + 0.1 * u)})` }}>
      <Sequence from={0} layout="none">
        <Freeze frame={C6_LAND.spanFrame}>
          <OffthreadVideo src={staticFile('span-03.mp4')} muted style={fill} />
        </Freeze>
      </Sequence>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the seam hits: the outgoing shot ramps up the last frames into the cut, the video's own film burn over the join
// ---------------------------------------------------------------------------------------------------------------------
const BURN_POST = [101, 402, 814]; // hand:film-burn: the pre-cut half is baked in the span; F1->BR-1, F3->BR-8, F7->outro
const SEAM_HITS = [176, 581]; //      hand:film-burn compressed to 0.3 s; the two seams with no baked burn
const SEAM_BURN_SPEED = 2.75; //      11 frames either side / 4
const OUT_RAMPS = [
  { cut: 176, n: 5, s: 0.3 }, // BR-1 into the whip
  { cut: 274, n: 5, s: 0.3 }, // BR-5 into the span's baked lib:zoom-optics-in-impact: the variant hides the engine's outgoing half
  // C6 into F7's baked optics. Mostly blur: the receipt's text and the LAYER 1 pop run to x 45-1040, and a bigger scale slices
  // them at the frame edge (check_short_edge_text.py checks every frame, its strip is 22 px)
  { cut: 581, n: 6, s: 0.03 },
];
const rampAt = (frame: number) => {
  const r = OUT_RAMPS.find((x) => frame >= x.cut - x.n && frame < x.cut);
  if (!r) return { s: 1, blur: 0 };
  const u = (frame - (r.cut - r.n) + 1) / r.n;
  return { s: 1 + r.s * u * u, blur: 9 * u * u };
};

// span-04 opens on the LAST frame of the vertical's baked optics move, which is still the vertical's previous cover (huge letters
// off a white card, from a beat the short never shows). Frame 581 holds the span's next frame instead, under the seam's burn peak.
const S4_HEAD = { from: 581, frames: 1, spanFrame: 1 };

const Burns: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {BURN_POST.map((c) => (frame >= c ? <FilmBurn key={c} frame={frame} cut={c} /> : null))}
    {SEAM_HITS.map((c) => (
      <FilmBurn key={c} frame={c + (frame - c) * SEAM_BURN_SPEED} cut={c} />
    ))}
  </>
);

const Picture: React.FC<{ frame: number }> = ({ frame }) => {
  const m = rampAt(frame);
  return (
    <div style={{ ...box, overflow: 'hidden', transform: `scale(${m.s})`, filter: m.blur > 0.3 ? `blur(${m.blur}px)` : undefined }}>
      {SPANS.map((s) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames} name={s.file}>
          <OffthreadVideo src={staticFile(s.file)} muted style={fill} />
        </Sequence>
      ))}
      <VariantTrack />
      <Sequence from={C6_LAND.from} durationInFrames={C6_LAND.frames} name="C6-landing">
        <C6Landing />
      </Sequence>
      <Sequence from={S4_HEAD.from} durationInFrames={S4_HEAD.frames} name="F7-head">
        <Sequence from={0} layout="none">
          <Freeze frame={S4_HEAD.spanFrame}>
            <OffthreadVideo src={staticFile('span-04.mp4')} muted style={fill} />
          </Freeze>
        </Sequence>
      </Sequence>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the outro: the last span's final frame holds, the TITLE-SLIDE card comes in over it (container-canonical.css: dark, Playfair
// headline, green accent word, gradient divider, orbs, grain). The CTA voice is mixed later.
// ---------------------------------------------------------------------------------------------------------------------
const CSS = {
  bgDeep: '#0a0c10',
  green: '#00e68a',
  cyan: '#00c2ff',
  text: '#e8eaf0',
};
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 9], [0, 1], CLAMP);
  const s = interpolate(f, [0, 9], [0.97, 1], CLAMP);
  // the arrow drops in, then keeps nudging downward toward the link under the video
  const arrowIn = interpolate(f, [8, 20], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const bob = f > 20 ? Math.abs(Math.sin(((f - 20) / FPS) * Math.PI * 1.1)) * 22 : 0;
  return (
    <AbsoluteFill style={{ background: CSS.bgDeep, opacity: a, transform: `scale(${s})`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 760, height: 760, right: -220, top: 180, borderRadius: '50%', background: CSS.green, filter: 'blur(120px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', width: 680, height: 680, left: -240, bottom: 200, borderRadius: '50%', background: CSS.cyan, filter: 'blur(120px)', opacity: 0.22 }} />
      <div style={{ position: 'absolute', left: 96, right: 96, top: 520 }}>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 176,
            lineHeight: 1.07,
            letterSpacing: '-0.02em',
            color: CSS.text,
          }}
        >
          WATCH
          <br />
          THE <span style={{ color: CSS.green }}>FULL</span>
          <br />
          VIDEO
        </div>
        <div style={{ width: 132, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${CSS.green}, ${CSS.cyan})`, margin: '56px 0 52px' }} />
        <svg
          width="170"
          height="230"
          viewBox="0 0 170 230"
          style={{ display: 'block', marginLeft: -6, opacity: arrowIn, transform: `translateY(${(1 - arrowIn) * -46 + bob}px)` }}
        >
          <path d="M85 14 L85 196 M20 134 L85 204 L150 134" fill="none" stroke={CSS.green} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ ...box, opacity: 0.03, backgroundImage: GRAIN, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_FRAMES} name="outro">
    <AbsoluteFill>
      <Sequence from={0} layout="none">
        <Freeze frame={SPANS[3].frames - 1}>
          <OffthreadVideo src={staticFile(SPANS[3].file)} muted style={fill} />
        </Freeze>
      </Sequence>
    </AbsoluteFill>
    <OutroCard />
  </Sequence>
);

// ---------------------------------------------------------------------------------------------------------------------
// captions, topmost: comp-build.md section 8 verbatim, in the short's safe zone
// ---------------------------------------------------------------------------------------------------------------------
// Short seconds where the picture already burns the words: the F1 hook's kt-caption-highlight line (see the file header)
const BAKED_CAPTIONS: [number, number][] = [[0, 3.367]];
const GROUPS = ZCAPTIONS.filter((c) => !BAKED_CAPTIONS.some(([a, b]) => c.t >= a && c.t < b));

// Where a group sits, by the group's START so it never jumps mid-group. Default = safe zone, bottom pad 320, maxWidth 860.
type Slot = { from: number; to: number; top: number; why: string };
const SLOTS: Slot[] = [
  { from: 9.797, to: 13.4, top: 1600, why: 'F3: under the baked BULLISH ON / KASPA pop (bottom edge y 1580)' },
  { from: 15.6, to: 19.375, top: 1752, why: 'C6 receipt: the free band under its body text (bottom edge y 1740)' },
];

const Captions: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let i = -1;
  for (let k = 0; k < GROUPS.length; k++) if (GROUPS[k].t <= t + 1e-6) i = k;
  if (i < 0) return null;
  const cur = GROUPS[i];
  const nextT = GROUPS[i + 1]?.t ?? Infinity;
  // a group holds until its LAST WORD ENDS (at least 1.3 s, never past the next group), and never crosses into the next span
  const until = Math.min(nextT, Math.max(cur.t + 1.3, cur.e), spanEnd(cur.t) / FPS);
  if (t >= until) return null;
  const age = frame - Math.round(cur.t * FPS);
  const pop = interpolate(age, [0, 4, 8], [0.7, 1.12, 1], CLAMP);
  const slot = SLOTS.find((s) => cur.t >= s.from && cur.t < s.to);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', ...(slot ? { top: slot.top } : { bottom: 320 }) }}>
      <div
        style={{
          maxWidth: 860,
          textAlign: 'center',
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.05,
          color: '#fff',
          textTransform: 'lowercase',
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          transform: `scale(${pop})`,
        }}
      >
        {cur.h}
      </div>
    </div>
  );
};

export const BullishOnKaspaShort: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <KtClock.Provider value={{ t: frame / FPS }}>
      <AbsoluteFill style={{ background: '#000' }}>
        <Picture frame={frame} />
        <Outro />
        <Burns frame={frame} />
        <Captions frame={frame} />
      </AbsoluteFill>
    </KtClock.Provider>
  );
};
