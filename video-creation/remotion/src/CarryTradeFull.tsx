import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, Easing } from 'remotion';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTIONS_CT } from './carryTradeCaptions';
import { CtC1, CtC2, CtC3, CtC4, CtC5, CtC6, CtDCycle } from './carryTradeCharts';
import { DOutflow, DDualflow, DSqueeze, DWorkedMath } from './carryTradeContainers';

/**
 * carry-trade — full longform comp (draft). Public dir = media/carry-trade/render-assets.
 *
 * TIMING NOTE: unlike SmkFull, every cue below is ALREADY in FINAL paused-spine seconds —
 * the single CH2 card pause (1s @79.04) was baked BEFORE transcription, and all cues were
 * measured on the paused spine's own word-level transcript. So sh() is identity; CARD_T
 * documents the card location. (comp-build.md §2's re-mapper collapses to this when the
 * transcript is measured post-pause.)
 *
 * TRANSITIONS (per-video plan, TRANSITIONS.md §2): cover ingress uses the real library
 * engines via TransitionClip (stills=Roughly, charts=Offset, containers=Turbulent Displace,
 * receipts=VHS); Envato video = fade. FACE cut-ins (Invert) and punch-in hits (Monitor) are
 * hand-rolled overlays approximating those family looks (difference-invert flicker /
 * scanline+invert pop) to avoid double spine decodes in the draft — swap to engine clips at
 * final if wanted (noted in PROJECT-LOG).
 */

export const CT_FPS = 30;
const SPINE = 'spine.mp4'; // ALL.d.paused.mp4 staged as render-assets/spine.mp4
const sh = (t: number) => t; // identity — cues are final-coords (see TIMING NOTE)
const F = (t: number) => Math.round(t * CT_FPS);
export const CT_DURATION = Math.round(601.494 * CT_FPS); // 18045

const ease = Easing.out(Easing.cubic);
const MONO = "'JetBrains Mono','Consolas',monospace";

// ---------- assets ----------
const STILL: Record<string, string> = {
  'BR-CAPITAL-FLOW-ABSTRACT': 'broll-ct05flw4-BR-CAPITAL-FLOW-ABSTRACT.png',
  'BR-TOKYO-COMMUTERS': 'broll-ct09slm8-BR-TOKYO-COMMUTERS.png',
  'BR-YEN-BANKNOTES': 'broll-ct03yen2-BR-YEN-BANKNOTES.png',
  'BR-SCALES-RISK': 'broll-ct10scl9-BR-SCALES-RISK.png',
  'BR-TOKYO-SKYLINE': 'broll-ct02tky1-BR-TOKYO-SKYLINE.png',
  'BR-TRADING-FLOOR': 'broll-ct04trd3-BR-TRADING-FLOOR.png',
  'BR-BOJ-BUILDING': 'broll-ct01boj0-BR-BOJ-BUILDING.png',
  'BR-BANK-VAULT': 'broll-ct06vlt5-BR-BANK-VAULT.png',
  'BR-MARKET-STORM-ABSTRACT': 'broll-ct07strm6-BR-MARKET-STORM-ABSTRACT.png',
  'BR-CRYPTO-NETWORK-ABSTRACT': 'broll-ct08cry7-BR-CRYPTO-NETWORK-ABSTRACT.png',
  'BR-AI-DATACENTER': 'broll-ct11ai10-BR-AI-DATACENTER.png',
  'BR-PRODUCTIVITY-CODE': 'broll-ct12prd11-BR-PRODUCTIVITY-CODE.png',
  'BR-GREEN-CANDLES': 'broll-ct13bull12-BR-GREEN-CANDLES.png',
};
const VID: Record<string, string> = {
  'yen-banknotes': 'yen-banknotes.mp4', 'btc-chart-falling': 'btc-chart-falling.mp4', 'bank-vault': 'bank-vault.mov',
  'fx-rate-board': 'fx-rate-board.mp4', 'trading-floor': 'trading-floor.mp4', 'tokyo-crosswalk': 'tokyo-crosswalk.mp4',
  'market-crash-screen': 'market-crash-screen.mp4', 'boj-building': 'boj-building.mp4', 'data-control-room': 'data-control-room.mp4',
  'tokyo-skyline': 'tokyo-skyline.mp4',
};
const RECEIPT: Record<string, string> = {
  'R-FORTUNE': 'R-FORTUNE-may2026.png', 'R-COINDESK': 'R-COINDESK-aug2024.png', 'R-BIS': 'R-BIS-bulletin90.png',
};

// ---------- COVERS (every black span covered edge-to-edge; zero orphans vs EDIT-PLAN-prep) ----------
// DIAGRAM_REFS: D-OUTFLOW, D-DUALFLOW, D-SQUEEZE, D-WORKEDMATH  (code-rendered system-design containers, Convention 4 — no deck PNGs in this comp)
type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'vid' | 'deck' | 'receipt' | 'showcase'; ref: string; state?: string; lead?: boolean };
const COVERS: Cover[] = [
  // CH1 — span 14.40-45.12
  { tIn: 14.40, tOut: 18.40, kind: 'still', ref: 'BR-CAPITAL-FLOW-ABSTRACT' },
  { tIn: 18.40, tOut: 23.22, kind: 'vid', ref: 'tokyo-skyline', lead: true },
  { tIn: 23.22, tOut: 32.38, kind: 'deck', ref: 'D-OUTFLOW', state: 'out' },
  { tIn: 32.38, tOut: 38.78, kind: 'chart', ref: 'C4' },
  { tIn: 38.78, tOut: 45.12, kind: 'receipt', ref: 'R-FORTUNE' },
  // CH1 — span 57.54-72.90 (the promise montage)
  { tIn: 57.54, tOut: 61.54, kind: 'vid', ref: 'yen-banknotes' },
  { tIn: 61.54, tOut: 65.24, kind: 'still', ref: 'BR-TOKYO-COMMUTERS' },
  { tIn: 65.24, tOut: 69.26, kind: 'chart', ref: 'C3' },
  { tIn: 69.26, tOut: 72.90, kind: 'vid', ref: 'btc-chart-falling' },
  // CH2 — span 81.98-144.60
  { tIn: 81.98, tOut: 85.98, kind: 'still', ref: 'BR-YEN-BANKNOTES' },
  { tIn: 85.98, tOut: 89.98, kind: 'vid', ref: 'bank-vault' },
  { tIn: 89.98, tOut: 93.98, kind: 'still', ref: 'BR-SCALES-RISK' },
  // Mike 2026-07-06 review: spotlight the LANE being talked about, not the whole slide.
  { tIn: 93.98, tOut: 103.20, kind: 'deck', ref: 'D-DUALFLOW', state: 'lanes' },      // "two very different kinds" = the one overview
  { tIn: 103.20, tOut: 116.54, kind: 'deck', ref: 'D-DUALFLOW', state: 'lane1' },     // real-money talk -> Lane 1 SOLO
  { tIn: 116.54, tOut: 122.12, kind: 'chart', ref: 'C6' },
  { tIn: 122.12, tOut: 131.08, kind: 'deck', ref: 'D-DUALFLOW', state: 'lane2' },     // borrowed-money talk -> Lane 2 SOLO
  { tIn: 131.08, tOut: 135.08, kind: 'vid', ref: 'trading-floor' },
  { tIn: 135.08, tOut: 144.60, kind: 'deck', ref: 'D-DUALFLOW', state: 'scale' },     // justified callback (state swap)
  // CH2 — span 146.30-157.94
  { tIn: 146.30, tOut: 157.94, kind: 'deck', ref: 'D-DUALFLOW', state: 'conditions' },// justified callback (state swap)
  // CH3 — span 163.00-235.08
  { tIn: 163.00, tOut: 172.12, kind: 'deck', ref: 'D-SQUEEZE', state: 'intro' },
  { tIn: 172.12, tOut: 190.12, kind: 'deck', ref: 'D-SQUEEZE', state: 'slow' },
  { tIn: 190.12, tOut: 194.50, kind: 'vid', ref: 'tokyo-crosswalk', lead: true },
  { tIn: 194.50, tOut: 198.50, kind: 'still', ref: 'BR-TRADING-FLOOR' },
  { tIn: 198.50, tOut: 217.36, kind: 'deck', ref: 'D-SQUEEZE', state: 'fast' },
  { tIn: 217.36, tOut: 222.36, kind: 'vid', ref: 'market-crash-screen', lead: true },
  { tIn: 222.36, tOut: 235.08, kind: 'deck', ref: 'D-SQUEEZE', state: 'connect' },
  // CH4 — span 248.32-324.52
  { tIn: 248.32, tOut: 252.32, kind: 'vid', ref: 'boj-building' },
  { tIn: 252.32, tOut: 264.52, kind: 'chart', ref: 'C1' },
  { tIn: 264.52, tOut: 268.52, kind: 'vid', ref: 'data-control-room' },
  { tIn: 268.52, tOut: 277.28, kind: 'chart', ref: 'C2' },
  { tIn: 277.28, tOut: 284.04, kind: 'chart', ref: 'C3' },                            // 2nd spot: CH1 tease -> CH4 payoff (justified)
  { tIn: 284.04, tOut: 292.78, kind: 'receipt', ref: 'R-COINDESK' },
  { tIn: 292.78, tOut: 297.16, kind: 'receipt', ref: 'R-BIS' },
  { tIn: 297.16, tOut: 324.52, kind: 'deck', ref: 'D-WORKEDMATH', state: 'sequence' },  // frame-driven internal spotlight (cols reveal in turn)
  // PLUG — showcase while Mike says "50x's and 100x's... just take a look at this" (Mike 2026-07-06)
  { tIn: 339.74, tOut: 348.44, kind: 'showcase', ref: 'R-SHOWCASE-cryptorich' },
  // CH5 — span 353.76-461.62
  { tIn: 353.76, tOut: 357.76, kind: 'still', ref: 'BR-BANK-VAULT' },
  { tIn: 357.76, tOut: 361.76, kind: 'still', ref: 'BR-BOJ-BUILDING' },
  { tIn: 361.76, tOut: 380.14, kind: 'chart', ref: 'C4' },                            // 2nd spot: CH1 tease -> CH5 payoff (justified)
  { tIn: 380.14, tOut: 384.14, kind: 'vid', ref: 'fx-rate-board' },                  // re-slotted from CH2 (FX/hedges beat)
  { tIn: 384.14, tOut: 392.62, kind: 'receipt', ref: 'R-FORTUNE' },                   // 2nd spot: headline = this exact beat (justified)
  { tIn: 392.62, tOut: 422.52, kind: 'chart', ref: 'C5' },
  { tIn: 422.52, tOut: 426.52, kind: 'still', ref: 'BR-MARKET-STORM-ABSTRACT' },
  { tIn: 426.52, tOut: 434.54, kind: 'chart', ref: 'C1' },                            // 2nd spot: same rate line, extended (justified)
  { tIn: 434.54, tOut: 448.26, kind: 'chart', ref: 'C2' },                            // 2nd spot: 2026 window (justified)
  { tIn: 448.26, tOut: 461.62, kind: 'receipt', ref: 'R-BIS' },                       // 2nd spot: "people who watch this" (justified)
  // CH6 — span 477.20-503.26
  { tIn: 477.20, tOut: 499.26, kind: 'deck', ref: 'D-OUTFLOW', state: 'wobble' },     // 2nd spot: step-back state (justified)
  { tIn: 499.26, tOut: 503.26, kind: 'still', ref: 'BR-CRYPTO-NETWORK-ABSTRACT' },
  // CH6 ad-lib — span 521.42-580.64
  { tIn: 521.42, tOut: 525.42, kind: 'still', ref: 'BR-AI-DATACENTER' },
  { tIn: 525.42, tOut: 529.42, kind: 'still', ref: 'BR-PRODUCTIVITY-CODE' },
  { tIn: 529.42, tOut: 563.14, kind: 'chart', ref: 'DCYCLE' },
  { tIn: 563.14, tOut: 567.14, kind: 'still', ref: 'BR-GREEN-CANDLES' },              // lands on "multiple new all-time highs"
  { tIn: 567.14, tOut: 580.64, kind: 'chart', ref: 'DCYCLE' },                        // 2nd spot: thesis card = ad-lib spine visual (justified)
  // CH7 close — span 596.90-600.72
  { tIn: 596.90, tOut: 600.72, kind: 'still', ref: 'BR-TOKYO-SKYLINE' },              // re-slotted closing shot (was a 3rd DCYCLE spot)
];

// ---------- FACE cut-ins (Invert family) + PUNCH windows (Monitor family) ----------
const FACE_CUTS = [45.12, 72.90, 144.60, 157.94, 235.08, 324.52, 461.62, 503.26, 580.64];
// Punch starts SNAPPED to desilencer jump-cut joins (spine/jumpcuts-final.json) so hits land at
// sentence boundaries, never mid-sentence (Mike 2026-07-06). Holds with no internal join get NO punch.
const PUNCH: [number, number][] = [
  [7.78, 13.0], [49.38, 56.5], [74.96, 78.6], [239.98, 247.5],
  [346.30, 352.5], [466.32, 476.0], [508.24, 520.0], [590.08, 596.0],
];
const CAPTION_SRC: [number, number][] = [[0, 14.40], [45.12, 57.54], [72.90, 79.04]]; // CH1 FACE spans (Mike: intro only)
const CARD_START = 79.04; // flip card over the baked 1s pause
const FACE_HOLDS: [number, number][] = [ // >5s gated-face holds → light leak pulse (overlays.md)
  [0, 14.40], [45.12, 57.54], [72.90, 79.04], [157.94, 163.00], [235.08, 248.32],
  [324.52, 353.76], [461.62, 477.20], [503.26, 521.42], [580.64, 596.90],
];

// deterministic per-index variant pick (no consecutive repeats within a family)
const pick = <T,>(pool: T[], i: number) => pool[(i * 3 + 1) % pool.length];
const ROUGHLY = ['roughly-1x', 'roughly-2x', 'roughly-3x', 'roughly-4x', 'roughly-5x', 'roughly-6x', 'roughly-7x'];
const OFFSET = ['glitchoffset-1x', 'glitchoffset-2x', 'glitchoffset-3x', 'glitchoffset-4x', 'glitchoffset-5x', 'glitchoffset-6x', 'glitchoffset-7x'];
const TURB = ['turbulent-h-1x', 'turbulent-h-2x', 'turbulent-h-3x', 'turbulent-v-1x', 'turbulent-v-2x', 'turbulent-v-3x', 'turbulent-h-4x', 'turbulent-v-4x'];
const VHS = ['vhs-short-1', 'vhs-short-2', 'vhs-short-3', 'vhs-min-1', 'vhs-min-2', 'vhs-min-3', 'vhs-max-1', 'vhs-max-2', 'vhs-max-3'];
const glitchFor = (c: Cover, i: number): string | null => {
  switch (c.kind) {
    case 'still': return pick(ROUGHLY, i);
    case 'chart': return pick(OFFSET, i);
    case 'deck': return pick(TURB, i);
    case 'receipt': return pick(VHS, i);
    case 'showcase': return pick(VHS, i);
    default: return null; // vid = fade
  }
};

// ---------- cover element ----------
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const chartEl = (ref: string) => {
  switch (ref) {
    case 'C1': return <CtC1 />; case 'C2': return <CtC2 />; case 'C3': return <CtC3 />;
    case 'C4': return <CtC4 />; case 'C5': return <CtC5 />; case 'C6': return <CtC6 />;
    default: return <CtDCycle />;
  }
};
const deckEl = (ref: string, state?: string) => {
  switch (ref) {
    case 'D-OUTFLOW': return <DOutflow state={(state as any) ?? 'out'} />;
    case 'D-DUALFLOW': return <DDualflow state={(state as any) ?? 'lanes'} />;
    case 'D-SQUEEZE': return <DSqueeze state={(state as any) ?? 'intro'} />;
    default: return <DWorkedMath />;
  }
};
const useEnt = () => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: interpolate(f, [0, 14], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  };
};
const ShowcasePan: React.FC<{ file: string; durFrames: number }> = ({ file, durFrames }) => {
  const f = useCurrentFrame();
  const pos = interpolate(f, [10, durFrames - 10], [0, 88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + file + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${pos}%` }} /></AbsoluteFill>;
};
const CoverEl: React.FC<{ c: Cover; i: number; noGlitch?: boolean }> = ({ c, i, noGlitch }) => {
  const { opacity, scale } = useEnt();
  const node = () => {
    if (c.kind === 'chart') return <AbsoluteFill>{chartEl(c.ref)}</AbsoluteFill>;
    if (c.kind === 'deck') return <AbsoluteFill>{deckEl(c.ref, c.state)}</AbsoluteFill>;
    if (c.kind === 'showcase') return <ShowcasePan file={c.ref} durFrames={F(c.tOut) - F(c.tIn)} />;
    if (c.kind === 'receipt')
      return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + RECEIPT[c.ref])} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /></AbsoluteFill>;
    return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('broll/chatgpt/' + STILL[c.ref])} style={fill} /></AbsoluteFill>;
  };
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + VID[c.ref])} muted style={{ ...fill, opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  if (noGlitch) return node() as React.ReactElement; // contiguous same-ref state swap: NO re-transition (Mike 2026-07-06, the 2:53 note)
  const id = glitchFor(c, i)!;
  return <TransitionClip id={id} cutFrame={8} outgoing={() => <AbsoluteFill />} incoming={node} />;
};

// ---------- hand-rolled family-look overlays (see header note) ----------
/** Invert-family face cut: 2-pulse difference flicker (~0.33s) */
const InvertHit: React.FC<{ variant: number }> = ({ variant }) => {
  const f = useCurrentFrame();
  const pat = variant % 3 === 0 ? [0, 0.9, 0.15, 0.7, 0] : variant % 3 === 1 ? [0, 1, 0, 0.5, 0] : [0, 0.7, 0.3, 0.9, 0];
  const o = interpolate(f, [0, 2, 5, 7, 10], pat, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#fff', mixBlendMode: 'difference', opacity: o }} />;
};
/** Monitor-family punch hit: scanlines + brief invert pop (~0.27s) */
const MonitorHit: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 2, 6, 8], [0, 0.85, 0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: '#fff', mixBlendMode: 'difference', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 3px, transparent 3px 7px)' }} />
    </AbsoluteFill>
  );
};
const LightLeak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur * 0.3, dur * 0.7, dur], [0, 0.3, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(f, [0, dur], [38, 62]);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% 30%, rgba(255,190,120,0.9), rgba(255,140,60,0.25) 45%, transparent 70%)`, opacity: o, mixBlendMode: 'screen' }} />;
};

/** YT subscribe CTA lower-third (code-rendered) — fires while Mike says like/subscribe/bell (PLUG). */
const SubscribeOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const total = F(334.2) - F(325.5);
  const inO = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const outO = interpolate(f, [total - 8, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wob = Math.sin(f / 3) * (f % 60 < 14 ? 7 : 0);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64, opacity: Math.min(inO, outO) }}>
      <div style={{ transform: `translateY(${(1 - inO) * 60}px)`, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(10,12,16,0.92)', border: '1px solid #2a3040', borderRadius: 100, padding: '18px 34px' }}>
        <div style={{ background: '#ff0000', color: '#fff', fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 34, borderRadius: 10, padding: '10px 28px' }}>SUBSCRIBE</div>
        <div style={{ fontSize: 38, transform: `rotate(${wob}deg)`, display: 'inline-block' }}>{'\uD83D\uDD14'}</div>
        <div style={{ color: '#e8eaf0', fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 700, fontSize: 28 }}>+ the like button</div>
      </div>
    </AbsoluteFill>
  );
};
/** "pip" jargon gloss — on-screen definition under the 500-1,000-pips line (Mike 2026-07-06). */
const PipGloss: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, F(461.5) - F(454.0) - 8, F(461.5) - F(454.0)], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56, opacity: o }}>
      <div style={{ background: 'rgba(10,12,16,0.92)', border: '1px solid #2a3040', borderRadius: 14, padding: '16px 30px', fontFamily: "'JetBrains Mono','Consolas',monospace", fontSize: 27, color: '#e8eaf0' }}>
        1 pip = ¥0.01 on USD/JPY {'\u2192'} 500–1,000 pips {'\u2248'} a ¥5–10 move in days
      </div>
    </AbsoluteFill>
  );
};
const FlipCard: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 42;
  const rot = interpolate(f, [0, 11, dur - 11, dur], [90, 0, 0, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const op = interpolate(f, [0, 7, dur - 7, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1600 }}>
      <div style={{ transform: `rotateX(${rot}deg) translateZ(120px)`, opacity: op, transformStyle: 'preserve-3d', background: '#0a1012', width: 1920, height: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: 110, height: 6, background: '#00c2ff', borderRadius: 3, marginBottom: 40 }} />
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{'What Exactly Is\na Carry Trade?'}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- captions (montserrat preset, 1 word / 2 short; CH1 FACE spans only) ----------
const COVER_WINDOWS = COVERS.map((c) => [sh(c.tIn), sh(c.tOut)] as [number, number]);
const CAPS = CAPTIONS_CT.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const t = useCurrentFrame() / CT_FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= sh(a) && t < sh(b))) return null;
  if (COVER_WINDOWS.some(([a, b]) => t >= a && t < b)) return null; // never over a cover
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) { if (CAPS[i].tf <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPS[idx];
  const nextT = idx + 1 < CAPS.length ? CAPS[idx + 1].tf : Infinity;
  if (t >= Math.min(nextT, cap.tf + 1.1)) return null;
  const since = (t - cap.tf) * CT_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 92, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '13px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 1 }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

// ---------- main ----------
export const CarryTradeFull: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / CT_FPS;
  let scale = 1;
  for (const [s, e] of PUNCH) { if (t >= s && t < e) scale = interpolate(t, [s, s + 0.4], [1, 1.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }); }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile(SPINE)} style={fill} />
      </AbsoluteFill>
      {/* light leaks: centered pulse on each >5s face hold, UNDER covers + captions */}
      {FACE_HOLDS.map(([a, b], i) => {
        const m = (a + b) / 2, d = Math.min(b - a - 2, 4);
        return <Sequence key={'ll' + i} from={F(m - d / 2)} durationInFrames={F(m + d / 2) - F(m - d / 2)}><LightLeak dur={F(m + d / 2) - F(m - d / 2)} /></Sequence>;
      })}
      {COVERS.map((c, i) => {
        const prev = COVERS[i - 1];
        const contiguousSameRef = !!prev && prev.ref === c.ref && Math.abs(prev.tOut - c.tIn) < 0.05;
        return (
          <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} i={i} noGlitch={contiguousSameRef} /></Sequence>
        );
      })}
      {FACE_CUTS.map((tc, i) => (
        <Sequence key={'fc' + i} from={F(tc) - 4} durationInFrames={11}><InvertHit variant={i} /></Sequence>
      ))}
      {PUNCH.map(([s], i) => (
        <Sequence key={'ph' + i} from={F(s)} durationInFrames={9}><MonitorHit /></Sequence>
      ))}
      <Sequence from={F(325.5)} durationInFrames={F(334.2) - F(325.5)}><SubscribeOverlay /></Sequence>
      <Sequence from={F(454.0)} durationInFrames={F(461.5) - F(454.0)}><PipGloss /></Sequence>
      <Sequence from={F(CARD_START)} durationInFrames={42}><FlipCard /></Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
