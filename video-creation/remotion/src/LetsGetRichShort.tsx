// LetsGetRichShort.tsx: the ~30 s SHORT of lets-get-rich (16:9-SOURCED mode, no full vertical).
// Built per video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B.
// 1080x1920 @ 30 fps. Public dir = media/lets-get-rich/_previews/short/work (span intermediates + variants/).
// Layers, bottom to top: span intermediates end to end (muted, linear, never the master) -> variant overlays
// (BR-6/BR-7/BR-8/BR-9 native-vertical Envato alternates) -> seam hit (hand:kt-whip-cut family, ~0.3 s) ->
// captions (generated, SHORT seconds, only inside CAPTION_WINDOWS) -> outro WATCH THE FULL VIDEO card.
// No audio: the lane's mix_short.py concats the span wavs + the shared CTA take + the bed.
import React from 'react';
import {
  AbsoluteFill, Easing, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { ZCAPTIONS, CAPTION_WINDOWS } from './LetsGetRichShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'] });

export const FPS = 30;
const SPANS_SECS = 27.9;   // spans.json spans_total_seconds
const OUTRO_SECS = 3.0;
export const DUR = Math.round(30.9 * FPS);   // 927 = spans 27.9 s + 3.0 s outro

// spans.json, verbatim (out_start in SHORT seconds, frames = the intermediate's verified frame count)
const SPANS = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 204, sourced: 'FACE' },
  { i: 2, file: 'span-02.mp4', outStart: 6.8, frames: 67, sourced: 'COVER' },
  { i: 3, file: 'span-03.mp4', outStart: 9.0333, frames: 245, sourced: 'COVER' },
  { i: 4, file: 'span-04.mp4', outStart: 17.2, frames: 156, sourced: 'FACE' },
  { i: 5, file: 'span-05.mp4', outStart: 22.4, frames: 165, sourced: 'FACE' },
];
const spanFrom = (s: { outStart: number }) => Math.round(s.outStart * FPS);
const SPANS_END = spanFrom(SPANS[SPANS.length - 1]) + SPANS[SPANS.length - 1].frames;   // 837
const SEAMS = SPANS.slice(1).map(spanFrom);                                             // [204, 271, 516, 672]

// COVERS = the variant overlays (assets/short/variants.json, overlay_short in SHORT seconds). cap: true = captions run
// over them on purpose (16:9-sourced mode: nothing is burned, every span is captioned).
// ingress = the move the longform used INTO that beat (TRANSITIONS.md section 5):
//   BR-6 @1:33.1 hand:kt-whip-cut (lands on the span 1->2 seam, so the seam's whip IS its ingress)
//   BR-7 @2:11.7 hand:kt-whip-cut (the span 2->3 seam; re-sourced 2026-11-01: the waived slot shipped a cropped 16:9 clip,
//   caught by s_verify_final; the new clip is native 1080x1920 abstract chat bubbles, like the longform's BR-7)
//   BR-8 @2:14.5 hand:fade 0.5 s · BR-9 @2:18.0 hand:fade 0.5 s
export const COVERS = [
  { tIn: 6.79, tOut: 9.03, kind: 'vid', ref: 'BR-6-blackfriday-neon-storefront.mp4', cap: true, ingress: 'hand:kt-whip-cut' },
  { tIn: 9.03, tOut: 11.84, kind: 'vid', ref: 'BR-7-neon-heart-bubbles.mp4', cap: true, ingress: 'hand:kt-whip-cut' },
  { tIn: 11.84, tOut: 15.34, kind: 'vid', ref: 'BR-8-hands-laptop-trading-dark.mp4', cap: true, ingress: 'hand:fade' },
  { tIn: 15.34, tOut: 17.19, kind: 'vid', ref: 'BR-9-btc-green-arrow-rip.mp4', cap: true, ingress: 'hand:fade' },
];
// clips that are not 30 fps play frame-for-frame (comp-build.md section 11)
const VID_FPS: Record<string, number> = {
  'BR-6-blackfriday-neon-storefront.mp4': 24000 / 1001,
  'BR-7-neon-heart-bubbles.mp4': 30000 / 1001,
  'BR-8-hands-laptop-trading-dark.mp4': 25,
  'BR-9-btc-green-arrow-rip.mp4': 30,
};
// assets/short/vertical-cards.json: cards [] and holds [] (s_vertical_cards found no card/chart beat in the spans).
const VERTICAL_CARDS: { file: string; a: number; b: number }[] = [];
const HOLDS: { file: string; frame: number; a: number; b: number }[] = [];

// ---------- spans ----------
const Spans: React.FC = () => (
  <>
    {SPANS.map((s) => (
      <Sequence key={s.i} from={spanFrom(s)} durationInFrames={s.frames} name={`span-${s.i}`}>
        <OffthreadVideo src={staticFile(s.file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Sequence>
    ))}
  </>
);

// ---------- variant overlays ----------
const FADE_IN = 15; // hand:fade 0.5 s
const VariantClip: React.FC<{ c: (typeof COVERS)[number]; dur: number }> = ({ c, dur }) => {
  const f = useCurrentFrame();
  const opacity = c.ingress === 'hand:fade' ? interpolate(f, [0, FADE_IN], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  const fps = VID_FPS[c.ref] ?? 30;
  // a slow push keeps the clip alive (and hides the 4:3-free edges): 1.0 -> 1.04 over the slot
  const scale = interpolate(f, [0, dur], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={staticFile(`variants/${c.ref}`)} muted playbackRate={30 / fps}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
    </AbsoluteFill>
  );
};
const Variants: React.FC = () => (
  <>
    {VERTICAL_CARDS.map((v, k) => (
      <Sequence key={`vc${k}`} from={Math.round(v.a * FPS)} durationInFrames={Math.round(v.b * FPS) - Math.round(v.a * FPS)}>
        <AbsoluteFill><img src={staticFile(v.file)} style={{ width: '100%', height: '100%' }} /></AbsoluteFill>
      </Sequence>
    ))}
    {HOLDS.map((h, k) => (
      <Sequence key={`hd${k}`} from={Math.round(h.a * FPS)} durationInFrames={Math.round(h.b * FPS) - Math.round(h.a * FPS)}>
        <Freeze frame={h.frame}><OffthreadVideo src={staticFile(h.file)} muted /></Freeze>
      </Sequence>
    ))}
    {COVERS.map((c) => {
      const from = Math.round(c.tIn * FPS);
      const dur = Math.round(c.tOut * FPS) - from;
      return (
        <Sequence key={c.ref} from={from} durationInFrames={dur} name={c.ref}>
          <VariantClip c={c} dur={dur} />
        </Sequence>
      );
    })}
  </>
);

// ---------- seam hit: hand:kt-whip-cut family, ~0.3 s (4 frames whip-out + 5 frames whip-in) ----------
const WHIP_OUT = 4;
const WHIP_IN = 5;
const seamFx = (f: number) => {
  for (const s of SEAMS) {
    if (f >= s - WHIP_OUT && f < s) {          // outgoing whips away: zoom up + blur
      const p = (f - (s - WHIP_OUT) + 1) / WHIP_OUT;
      return { scale: 1 + 0.35 * Easing.in(Easing.cubic)(p), blur: 10 * p, flash: 0.35 * p };
    }
    if (f >= s && f < s + WHIP_IN) {           // incoming lands: 1.5 -> 1.0 whip-zoom, blur off, flash decays
      const p = (f - s) / WHIP_IN;
      const e = Easing.out(Easing.cubic)(p);
      return { scale: 1.5 - 0.5 * e, blur: 12 * (1 - e), flash: 0.55 * (1 - p) };
    }
  }
  return { scale: 1, blur: 0, flash: 0 };
};

// ---------- captions (generated data, Montserrat house style, SAFE ZONE) ----------
const CAPS = ZCAPTIONS.map((c) => ({ tf: c.t, te: c.e, h: c.h }));   // already SHORT seconds: no sh()
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; te: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  // a group holds until its LAST word ends (te), at least 1.3 s, never past the next group: under the old flat 1.3 s cap the
  // 2.4 s word "353x" lost its caption mid-word (lets-get-rich 2026-11-01, final visual-qa)
  if (t >= Math.min(nextT, Math.max(cur.tf + 1.3, cur.te))) return null;
  const lf = frame - Math.round(cur.tf * FPS);
  const pop = interpolate(lf, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320 }}>
      <div style={{
        maxWidth: 860, textAlign: 'center', transform: `scale(${pop})`,
        fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 72,
        lineHeight: 1.12, letterSpacing: '0.01em', textTransform: 'lowercase', color: '#fff',
        WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
      }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// ---------- outro: hold span 5's last frame + the WATCH THE FULL VIDEO title-slide card ----------
// locked container stylesheet (assets/slide-sources/containers.html): --bg-deep #0a0c10, Playfair 900 headline,
// --text-primary #e8eaf0, accent word --accent-green #00e68a, green->cyan gradient divider, grain.
const CARD_IN = 6;   // the held frame reads for 0.2 s, then the card comes in (quiet xfade + 0.93 -> 1 scale)
const CARD_RAMP = 9;
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [CARD_IN, CARD_IN + CARD_RAMP], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const arrowK = interpolate(f, [CARD_IN + 6, CARD_IN + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bob = Math.sin(((f - CARD_IN) / FPS) * Math.PI * 2 * 1.4) * 18 * arrowK;
  return (
    <AbsoluteFill style={{ opacity: k, transform: `scale(${0.93 + 0.07 * k})`, background: '#0a0c10' }}>
      <AbsoluteFill style={{ backgroundImage: NOISE, opacity: 0.05 }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(0,230,138,0.10), rgba(0,0,0,0) 60%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 120 }}>
        <div style={{
          fontFamily: `${PLAYFAIR},serif`, fontWeight: 900, fontSize: 150, lineHeight: 1.04, letterSpacing: '-0.02em',
          color: '#e8eaf0', textAlign: 'center', maxWidth: 940,
        }}>
          WATCH THE<br /><span style={{ color: '#00e68a' }}>FULL</span> VIDEO
        </div>
        <div style={{ width: 120, height: 6, borderRadius: 3, margin: '56px 0 40px',
          background: 'linear-gradient(90deg,#00e68a,#00c2ff)' }} />
        <svg width={170} height={220} viewBox="0 0 170 220"
          style={{ opacity: arrowK, transform: `translateY(${bob}px)`, filter: 'drop-shadow(0 0 24px rgba(0,230,138,0.45))' }}>
          <path d="M85 10 V170 M22 110 L85 175 L148 110" fill="none" stroke="#00e68a" strokeWidth={22}
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Outro: React.FC = () => {
  const last = SPANS[SPANS.length - 1];
  return (
    <>
      <Freeze frame={last.frames - 1}>
        <OffthreadVideo src={staticFile(last.file)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Freeze>
      <OutroCard />
    </>
  );
};

export const LetsGetRichShort: React.FC = () => {
  const f = useCurrentFrame();
  const fx = seamFx(f);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${fx.scale})`, filter: fx.blur > 0.05 ? `blur(${fx.blur.toFixed(2)}px)` : undefined }}>
        <Spans />
        <Variants />
      </AbsoluteFill>
      {fx.flash > 0 && <AbsoluteFill style={{ background: '#fff', opacity: fx.flash, mixBlendMode: 'screen' }} />}
      <Sequence from={SPANS_END} durationInFrames={DUR - SPANS_END} name="outro">
        <Outro />
      </Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
// sanity: DUR must equal spans + outro
if (DUR !== Math.round((SPANS_SECS + OUTRO_SECS) * FPS) || SPANS_END !== Math.round(SPANS_SECS * FPS)) {
  throw new Error(`LetsGetRichShort: DUR ${DUR} / SPANS_END ${SPANS_END} disagree with spans.json`);
}
