import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { GlitchBlocks } from './transitions/engines/GlitchBlocks';
import { CAPTIONS } from './kaspaCovenantsYuliCaptions';
import { Caption2 } from './captions/Caption2';

// ─────────────────────────────────────────────────────────────────────────────
// Kaspa Covenants — YULI (9:16 vertical, AI persona). Continuous desil spine
// (faces baked + black + VO audio); FRESH ChatGPT b-roll over the 3 black gaps
// (NO reuse across channels — CLAUDE.md rule). Caption2 arial-black karaoke,
// Race Against Time bed, SFX, + 2 GlitchBlocks swaps. Mirrors AnaToccata.tsx.
// ─────────────────────────────────────────────────────────────────────────────
export const KCY_FPS = 30;
export const KCY_DURATION = 1989; // 66.31s

const asset = (f: string) => staticFile(f);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const useT = () => useCurrentFrame() / KCY_FPS;

// ── spine: desil video (faces + black + VO) ──
const Spine: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <OffthreadVideo src={asset('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

// ── b-roll scene: full-frame image/video over the black gap, ken-burns + entrance fx ──
type FX = 'fade' | 'wipe' | 'slide' | 'none';
type Slot = { kind: 'image' | 'video'; src: string; tIn: number; tOut: number; fx: FX };
const BrollScene: React.FC<{ s: Slot }> = ({ s }) => {
  const t = useT();
  const dur = s.tOut - s.tIn;
  const local = t - s.tIn;
  // opacity: quick in/out fade always (prevents black flash at gap edges)
  const o = Math.min(interpolate(t, [s.tIn, s.tIn + 0.25], [0, 1], clamp), interpolate(t, [s.tOut - 0.3, s.tOut], [1, 0], clamp));
  if (o <= 0.001) return null;
  const kb = 1.04 + 0.07 * (local / dur); // slow ken-burns push
  // entrance fx (Remotion-default vocabulary)
  let tx = 0, mask: string | undefined;
  if (s.fx === 'slide') tx = interpolate(t, [s.tIn, s.tIn + 0.45], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (s.fx === 'wipe') {
    const p = interpolate(t, [s.tIn, s.tIn + 0.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const sweep = p * 130 - 15;
    mask = p >= 1 ? undefined : `linear-gradient(110deg, #000 ${sweep}%, transparent ${sweep + 18}%)`;
  }
  const style: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb}) translateX(${tx}px)` };
  return (
    <AbsoluteFill style={{ opacity: o, background: '#000', WebkitMaskImage: mask, maskImage: mask }}>
      {s.kind === 'image'
        ? <Img src={asset(s.src)} style={style} />
        : <OffthreadVideo src={asset(s.src)} muted style={style} />}
    </AbsoluteFill>
  );
};

// ── glitch swap (real GlitchBlocks engine; mirrors KaspaCovenants longform) ──
const BLOCKS_MAX = { offsets: [{ dx: 0.15, dy: 0 }, { dx: 0.3188, dy: 0.3583 }, { dx: -0.2953, dy: 0.2259 }, { dx: 0.4443, dy: 0.663 }, { dx: 0.2828, dy: 0.4241 }, { dx: 0, dy: 0.4241 }], opacityPeak: 0.333, maskDir: 'transitions/lib/masks/blocks-max', maskCount: 30, scaleH: 150 as number | null, durSec: 0.96, sfx: 'transitions/lib/sfx-blocks-max.mp3' };
const BLOCKS_STRIPS = { offsets: [{ dx: 0.2828, dy: 0.4241 }, { dx: 0.5359, dy: 0.4241 }], opacityPeak: 0.333, maskDir: 'transitions/lib/masks/blocks-strips-3x', maskCount: 12, scaleH: null as number | null, durSec: 0.4, sfx: 'transitions/lib/sfx-blocks-min.mp3' };
const Glitch: React.FC<{ cut: number; kind: 'max' | 'strips'; fromSrc: string; toSrc: string }> = ({ cut, kind, fromSrc, toSrc }) => {
  const params = kind === 'max' ? BLOCKS_MAX : BLOCKS_STRIPS;
  const dur = Math.round(params.durSec * KCY_FPS);
  const fromF = Math.round(cut * KCY_FPS - dur * params.opacityPeak); // bury the A->B cut at opacityPeak onto `cut`
  const node = (src: string) => <Img src={asset(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.06)' }} />;
  return (
    <Sequence from={Math.max(0, fromF)} durationInFrames={dur} layout="none">
      <GlitchBlocks from={node(fromSrc)} to={node(toSrc)} fromSrc={fromSrc} toSrc={toSrc} durationInFrames={dur} params={params as any} />
      <Audio src={asset(params.sfx)} volume={0.7} />
    </Sequence>
  );
};

// caption2 = the canonical flicker-free renderer in ./captions/Caption2 (do NOT inline a copy).

// ── scene table (b-roll only over the 3 black gaps; faces come from the spine) ──
// FACE windows (spine): 0-7.5 / 21.1-29.6 / 36.6-46.6 / 64.1-66.1
const BROLL: Slot[] = [
  // gap1: 1s green-corridor motion punch -> covenant -> (glitch) -> rules
  { kind: 'video', src: 'video/env-tech.mp4', tIn: 7.1, tOut: 8.3, fx: 'fade' },                               // motion punch (kills the hook-face black sliver too)
  { kind: 'image', src: 'images/yulibroll-yulcovcoin-covenant-coin.png', tIn: 8.2, tOut: 14.5, fx: 'fade' },    // gap1a: covenant
  { kind: 'image', src: 'images/yulibroll-yulrulegate-rule-gates.png', tIn: 14.1, tOut: 21.2, fx: 'none' },     // gap1b: rules (via glitch1)
  // gap2: 1s green-corridor motion punch -> ethereum
  { kind: 'video', src: 'video/env-data.mp4', tIn: 29.5, tOut: 30.65, fx: 'fade' },                            // motion punch
  { kind: 'image', src: 'images/yulibroll-yulethovl-ethereum-overload.png', tIn: 30.55, tOut: 36.7, fx: 'wipe' },// gap2: ethereum
  // gap3: 1s green-corridor motion punch -> ecosystem -> (glitch) -> city
  { kind: 'video', src: 'video/env-clean.mp4', tIn: 46.5, tOut: 47.6, fx: 'fade' },                            // motion punch
  { kind: 'image', src: 'images/yulibroll-yulecorise-ecosystem-rising.png', tIn: 47.5, tOut: 55.6, fx: 'slide' },// gap3a: unlock
  { kind: 'image', src: 'images/yulibroll-yulkascity-kaspa-ecosystem-city.png', tIn: 55.2, tOut: 64.2, fx: 'none' }, // gap3b: payoff (via glitch2)
];
const GLITCHES = [
  { cut: 14.3, kind: 'max' as const, fromSrc: 'images/yulibroll-yulcovcoin-covenant-coin.png', toSrc: 'images/yulibroll-yulrulegate-rule-gates.png' },
  { cut: 55.4, kind: 'strips' as const, fromSrc: 'images/yulibroll-yulecorise-ecosystem-rising.png', toSrc: 'images/yulibroll-yulkascity-kaspa-ecosystem-city.png' },
];

// ── SFX (under the VO) ──
type Sfx = { src: string; at: number; vol: number; from?: number };
const SFX: Sfx[] = [
  { src: 'audio/sfx-impact.wav', at: 21.07, vol: 0.3 },    // Toccata face cut-in
  { src: 'audio/sfx-impact.wav', at: 36.57, vol: 0.3 },    // conviction face cut-in
  { src: 'audio/sfx-riser.wav', at: 44.6, vol: 0.18 },     // riser into the ecosystem reveal
  { src: 'audio/sfx-bigimpact.wav', at: 46.57, vol: 0.28 }, // ecosystem reveal hit (kept under VO)
  { src: 'audio/sfx-impact.wav', at: 64.07, vol: 0.32 },   // close face cut-in
];

// ── music bed (Race Against Time, ~ -21 dB under VO; fade in/out) ──
const Music: React.FC = () => (
  <Audio src={asset('audio/music.mp3')} volume={(f) => 0.08 * Math.min(interpolate(f / KCY_FPS, [0, 0.8], [0, 1], clamp), interpolate(f / KCY_FPS, [64.5, 66.2], [1, 0], clamp))} />
);

export const KaspaCovenantsYuli: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Spine />
    {BROLL.map((s, i) => <BrollScene key={`b${i}`} s={s} />)}
    {GLITCHES.map((g, i) => <Glitch key={`g${i}`} {...g} />)}
    <Caption2 captions={CAPTIONS} />
    {SFX.map((s, i) => (
      <Sequence key={`s${i}`} from={Math.round((s.from ?? s.at) * KCY_FPS)} layout="none">
        <Audio src={asset(s.src)} volume={s.vol} />
      </Sequence>
    ))}
    <Music />
  </AbsoluteFill>
);
