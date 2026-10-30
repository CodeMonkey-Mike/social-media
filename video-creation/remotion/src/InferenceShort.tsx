// InferenceShort (comp-builder 2026-10-28): longform-to-short Stage B for `inference`. 1080x1920, 30 fps, NO audio
// (mix_short.py adds VO + CTA + bed). Public dir = _previews/short/work (span intermediates + variants/), never the master.
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { KtWhipCut } from './effects/kinetic-text';
import { ZCAPTIONS, CAPTION_WINDOWS } from './InferenceShortCaptions';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

export const FPS = 30;
const W = 1080, H = 1920;
// spans.json, verbatim (out_start s, frames)
const SPANS = [
  { file: 'span-01.mp4', out: 0.0, frames: 194 }, // hook, FACE
  { file: 'span-02.mp4', out: 6.4667, frames: 469 }, // body, COVER
  { file: 'span-03.mp4', out: 22.1, frames: 174 }, // kicker, FACE
];
const OUTRO_S = 3.0;
export const DUR = Math.round(30.9 * FPS); // 927 = 27.9 s spans + 3 s outro
const spanFrom = (i: number) => Math.round(SPANS[i].out * FPS);
const SPANS_END = spanFrom(SPANS.length - 1) + SPANS[SPANS.length - 1].frames; // 837
if (SPANS_END + OUTRO_S * FPS !== DUR) throw new Error(`span table ${SPANS_END} + outro != DUR ${DUR}`);
// variants.json: overlay_short windows, ingress = the vertical's hand:kt-whip-cut (blur-in) for both replaced beats
const COVERS = [
  { tIn: 11.485, tOut: 13.185, kind: 'still', ref: 'IMG-1-press-flashes-gpu-cluster-corridor', cap: true }, // hand:kt-whip-cut ingress
  { tIn: 17.035, tOut: 19.885, kind: 'vid', ref: 'BR-2-chat-ui-monitor', cap: true }, // hand:kt-whip-cut ingress
];
const VID_FPS: Record<string, number> = { 'BR-2-chat-ui-monitor': 24000 / 1001 };
const VAR_SRC = (c: { kind: string; ref: string }) => 'variants/' + c.ref + (c.kind === 'vid' ? '.mp4' : '.png');
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const SEAM = Math.round(0.3 * FPS);

/** hand:flash-zoom seam hit (~0.3 s): white flash peak at the cut + a quick scale settle on the incoming span */
const seamScale = (f: number) => {
  for (let i = 1; i < SPANS.length; i++) {
    const d = f - spanFrom(i);
    if (d >= 0 && d < SEAM) return interpolate(d, [0, SEAM], [1.12, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  }
  return 1;
};
const SeamFlash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  for (let i = 1; i < SPANS.length; i++) {
    const d = f - spanFrom(i);
    o = Math.max(o, interpolate(d, [-3, 0, SEAM - 3], [0, 0.85, 0], CL));
  }
  return o > 0 ? <AbsoluteFill style={{ background: '#fff', opacity: o }} /> : null;
};

const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) { if (c.t <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (ZCAPTIONS.find((c) => c.t > cur!.t) || { t: Infinity }).t;
  if (t >= Math.min(nextT, cur.t + 1.3)) return null;
  const s = interpolate(t - cur.t, [0, 0.08, 0.16], [0.7, 1.12, 1], CL);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 200 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 82, textTransform: 'lowercase',
        color: '#FFFFFF', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${s})`, whiteSpace: 'nowrap', lineHeight: 1.1 }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

/** TITLE-SLIDE outro card: dark, Playfair headline, green accent word, downward arrow */
const GREEN = '#22c55e';
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], CL);
  const y = interpolate(f, [0, 12], [60, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const bob = Math.sin((f / FPS) * Math.PI * 2 * 1.2) * 14;
  return (
    <AbsoluteFill style={{ background: `rgba(11,13,18,${0.94 * o})`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: o, transform: `translateY(${y}px)`, textAlign: 'center', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, color: '#F5F3EE' }}>
        <div style={{ fontSize: 132, lineHeight: 1.08 }}>WATCH THE</div>
        <div style={{ fontSize: 132, lineHeight: 1.08 }}><span style={{ color: GREEN }}>FULL</span> VIDEO</div>
        <div style={{ width: 220, height: 8, background: GREEN, margin: '48px auto 0', borderRadius: 4 }} />
        <svg width="200" height="240" viewBox="0 0 200 240" style={{ marginTop: 70, transform: `translateY(${bob}px)` }}>
          <path d="M100 10 V190 M30 130 L100 205 L170 130" stroke={GREEN} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const InferenceShort: React.FC = () => {
  const f = useCurrentFrame();
  const last = SPANS[SPANS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${seamScale(f)})` }}>
        {SPANS.map((s, i) => (
          <Sequence key={s.file} from={spanFrom(i)} durationInFrames={s.frames}>
            <OffthreadVideo src={staticFile(s.file)} muted style={{ width: W, height: H }} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {/* outro: hold the last span's final frame (a muted, frame-exact freeze) */}
      <Sequence from={SPANS_END} durationInFrames={DUR - SPANS_END}>
        <Freeze frame={last.frames - 1}>
          <OffthreadVideo src={staticFile(last.file)} muted style={{ width: W, height: H }} />
        </Freeze>
      </Sequence>
      {COVERS.map((v) => {
        const from = Math.round(v.tIn * FPS), dur = Math.round(v.tOut * FPS) - from;
        return (
          <KtWhipCut key={v.ref} t0={from / FPS} variant="blur-in" width={W} height={H}>{/* hand:kt-whip-cut (as the vertical) */}
            <Sequence from={from} durationInFrames={dur}>
              {v.kind === 'still'
                ? <Img src={staticFile(VAR_SRC(v))} style={{ width: W, height: H, objectFit: 'cover' }} />
                : <OffthreadVideo src={staticFile(VAR_SRC(v))} muted playbackRate={30 / VID_FPS[v.ref]} style={{ width: W, height: H, objectFit: 'cover' }} />}
            </Sequence>
          </KtWhipCut>
        );
      })}
      <SeamFlash />
      <Captions />
      <Sequence from={SPANS_END}><OutroCard /></Sequence>
    </AbsoluteFill>
  );
};
