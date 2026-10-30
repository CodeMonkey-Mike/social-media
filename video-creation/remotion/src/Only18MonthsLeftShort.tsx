// Only18MonthsLeftShort: the ~30 s short (longform-to-short.md §5 Stage B). 1080x1920, 30 fps, NO audio (mix_short.py adds VO + CTA + bed).
// Public dir = media/only-18-months-left/_previews/short/work (span intermediates + variants/). Never seeks into the master.
import React from 'react';
import {
  AbsoluteFill, Sequence, OffthreadVideo, Img, Freeze, staticFile, useCurrentFrame, interpolate, Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { ZCAPTIONS, CAPTION_WINDOWS } from './Only18MonthsLeftShortCaptions';
import { HwWordPop } from './effects/halloween-2022';

loadMontserrat('normal', { weights: ['900'] });
loadPlayfair('normal', { weights: ['700', '900'] });
loadDMSans('normal', { weights: ['500', '700'] });

export const FPS = 30;
const OUTRO_S = 3.0;
// spans.json (out_start s, frames)
const SPANS = [
  { file: 'span-01.mp4', from: 0, frames: 197 },
  { file: 'span-02.mp4', from: 197, frames: 263 },
  { file: 'span-03.mp4', from: 460, frames: 186 },
  { file: 'span-04.mp4', from: 646, frames: 164 },
];
const SPANS_END = 810; // 27.0 s
export const DUR = Math.round(30.0 * FPS); // 900 = 27.0 s spans + 3.0 s outro
const OUTRO_F = SPANS_END;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// variants.json: overlay_short windows (SHORT seconds), full-frame
const VARIANTS = [
  { id: 'BR-2', kind: 'vid', src: 'variants/BR-2-head-shatter-blue.mp4', t0: 6.685, t1: 8.465 },
  { id: 'IMG-1', kind: 'img', src: 'variants/IMG-1-writer-window-silhouette.png', t0: 8.465, t1: 10.745 },
  { id: 'IMG-2', kind: 'img', src: 'variants/IMG-2-design-studio-lightbox.png', t0: 10.745, t1: 12.705 },
  { id: 'IMG-3', kind: 'img', src: 'variants/IMG-3-edit-suite-chair-fog.png', t0: 12.705, t1: 13.665 },
  { id: 'IMG-4', kind: 'img', src: 'variants/IMG-4-accounting-office-aisle.png', t0: 13.665, t1: 14.805 },
];
// lint_covers.py view of the cover layer (SHORT seconds, one row per variant). cap: true = the short is captioned end to end,
// the COVER-sourced span carries no burned captions, so the caption track sits over these variants by design.
type Cover = { tIn: number; tOut: number; kind: string; ref: string; cap?: boolean };
export const COVERS: Cover[] = [
  { tIn: 6.685, tOut: 8.465, kind: 'video', ref: 'BR-2-head-shatter-blue', cap: true },
  { tIn: 8.465, tOut: 10.745, kind: 'img', ref: 'IMG-1-writer-window-silhouette', cap: true },
  { tIn: 10.745, tOut: 12.705, kind: 'img', ref: 'IMG-2-design-studio-lightbox', cap: true },
  { tIn: 12.705, tOut: 13.665, kind: 'img', ref: 'IMG-3-edit-suite-chair-fog', cap: true },
  { tIn: 13.665, tOut: 14.805, kind: 'img', ref: 'IMG-4-accounting-office-aisle', cap: true },
];
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

// Seam hit (hand-rolled flash + zoom, ~0.3 s): incoming span punches 1.12 -> 1 while a white flash decays.
const SEAM_F = 9;
const SpanClip: React.FC<{ file: string; frames: number; seam: boolean }> = ({ file, seam }) => {
  const f = useCurrentFrame();
  const s = seam ? interpolate(f, [0, SEAM_F], [1.12, 1], { ...cl, easing: Easing.out(Easing.cubic) }) : 1;
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>
      <OffthreadVideo src={staticFile(file)} muted style={fill} />
    </AbsoluteFill>
  );
};
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 2, SEAM_F], [0, 0.85, 0], cl);
  return <AbsoluteFill style={{ background: '#fff', opacity: o }} />;
};

// Variant ingress: quick 6-frame fade + settle-in scale (the vertical's hand-rolled overlay ingress), slow push while held.
const Variant: React.FC<{ v: (typeof VARIANTS)[number]; len: number }> = ({ v, len }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6], [0, 1], cl);
  const s = interpolate(f, [0, 6, len], [1.08, 1.02, 1.0 + (v.kind === 'img' ? 0.06 : 0)], cl);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, background: '#000' }}>
      {v.kind === 'vid' ? <OffthreadVideo src={staticFile(v.src)} muted style={fill} /> : <Img src={staticFile(v.src)} style={fill} />}
    </AbsoluteFill>
  );
};

// Word pop (hw-word-pop, the longform's '18 MONTHS' at spine 38.88-40.1 = SHORT 17.213-18.433 s), drawn natively for 9:16:
// the span renders with pops={false} because a 608 px centre slice clipped the longform's 212 px pop to 'ONTH' (Mike,
// 2026-10-28). 160 px Showcard Gothic = ~840 px wide (~965 px at the 115 percent overshoot), centred, baseline 1380 = the
// caption slot; captions are OFF under the pop (the longform comp's rule).
const POPS = [{ t: 17.213, t1: 18.433, text: '18 MONTHS', size: 160 }];
const POP_BASELINE = 1380;
const PopLayer: React.FC = () => (
  <div style={{ position: 'absolute', left: 540 - 960, top: POP_BASELINE - 989, width: 1920, height: 1080 }}>
    {POPS.map((p) => (
      <HwWordPop key={p.text} t1={p.t1} words={[{ t: p.t, t1: p.t1, text: p.text }]} fontSize={p.size} />
    ))}
  </div>
);

// Captions: ONLY inside CAPTION_WINDOWS (SHORT seconds), Montserrat 900 house style; never under a word pop.
const Captions: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (POPS.some((p) => t >= p.t && t < p.t1)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) {
    if (c.t <= t) cur = c;
    else break;
  }
  if (!cur) return null;
  const c0 = cur;
  const next = ZCAPTIONS.find((c) => c.t > c0.t);
  if (t >= Math.min(next ? next.t : Infinity, c0.t + 1.3)) return null;
  const k = (t - c0.t) * FPS;
  const s = interpolate(k, [0, 3, 6], [0.7, 1.12, 1], cl);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 560 }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 92, color: '#ffffff',
          textTransform: 'lowercase', WebkitTextStroke: '14px #000', paintOrder: 'stroke fill', transform: `scale(${s})`,
          textAlign: 'center', maxWidth: 960, lineHeight: 1.1,
        }}
      >
        {c0.h}
      </div>
    </AbsoluteFill>
  );
};

// Outro: TITLE-SLIDE card (locked container stylesheet: #0a0c10, accent orb, Playfair headline, green accent word, DM Sans eyebrow).
const GREEN = '#3ddc84';
const OutroCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const y = interpolate(f, [0, 10], [60, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const bob = Math.sin((f / FPS) * Math.PI * 2 * 1.2) * 14;
  return (
    <AbsoluteFill style={{ opacity: o, background: 'rgba(10,12,16,0.94)', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: GREEN, opacity: 0.12, filter: 'blur(160px)', top: 420, left: 90 }} />
      <div style={{ transform: `translateY(${y}px)`, textAlign: 'center', padding: '0 90px' }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 38, letterSpacing: 10, color: '#8a909c', marginBottom: 40 }}>
          18 MONTHS LEFT
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: '#f3f1ea' }}>
          WATCH THE <span style={{ color: GREEN }}>FULL</span> VIDEO
        </div>
        <div style={{ marginTop: 90, fontSize: 170, lineHeight: 1, color: GREEN, transform: `translateY(${bob}px)`, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>
          &#8595;
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Only18MonthsLeftShort: React.FC = () => {
  const last = SPANS[SPANS.length - 1];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SPANS.map((s, i) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames}>
          <SpanClip file={s.file} frames={s.frames} seam={i > 0} />
        </Sequence>
      ))}
      {/* outro: hold the last span's final frame */}
      <Sequence from={OUTRO_F} durationInFrames={DUR - OUTRO_F}>
        <Freeze frame={last.frames - 1}>
          <OffthreadVideo src={staticFile(last.file)} muted style={fill} />
        </Freeze>
      </Sequence>
      {VARIANTS.map((v) => {
        const a = Math.round(v.t0 * FPS);
        const len = Math.round(v.t1 * FPS) - a;
        return (
          <Sequence key={v.id} from={a} durationInFrames={len}>
            <Variant v={v} len={len} />
          </Sequence>
        );
      })}
      {SPANS.slice(1).map((s) => (
        <Sequence key={`seam-${s.from}`} from={s.from} durationInFrames={SEAM_F}>
          <Flash />
        </Sequence>
      ))}
      <PopLayer />
      <Sequence from={0} durationInFrames={SPANS_END}>
        <Captions />
      </Sequence>
      <Sequence from={OUTRO_F} durationInFrames={DUR - OUTRO_F}>
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  );
};
