// GrowthScaleUpVertical.tsx: the 1080x1920 twin of GrowthScaleUp.tsx (media/growth-scale-up), per
// skills/vertical-repurpose/vertical-repurpose.md §1b + §2. SAME spine, DUR, CARD_T, PAUSE, SPINE_SECS, COVERS (imported,
// byte-identical beat times + transition ids) and caption windows. Public dir = assets/vertical ONLY.
// Imports: packages, the shared ./transitions + ./effects/kinetic-text engines, and this project's own files only.
//
// DIAGRAM_REFS: C1-split-diagram-strategy, C1-split-diagram-execution, C1-split-diagram-analysis, C3-experiment-loop-diagram-mine, C3-experiment-loop-diagram-backlog, C3-experiment-loop-diagram-plan, C3-experiment-loop-diagram-variants, C3-experiment-loop-diagram-readout, C3-experiment-loop-diagram-human
// TRANSITIONS_WAIVED: melt-rgb-short-3 — TRANSITIONS.md open question only (MELT = 0); Mike's GATE blueprint ruling: no melt, the face pick stays at 103.267
// (end declared refs)
import React, { useContext } from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, framesForRow, getTransition } from './transitions';
import {
  KtClock,
  KtWhipCut,
  KtSidePanel,
  KtKeywordPop,
  KtHeadlineOverBroll,
  KtWordByWord,
  KtLowerThirdBand,
  KtIconPop,
  KtSubscribeClose,
  KtScatterWords,
  easeInfluence325,
  KT_LIST,
} from './effects/kinetic-text';
import { ZCAPTIONS, CAPTION_WINDOWS } from './GrowthScaleUpCaptions';
import { SEAT_A, SEAT_B, SEAT_A_LIGHT, OnePersonIcon, FivePeopleIcon, CalendarIcon, AgentIcon, FunnelIcon, LifebuoyIcon, SeatTag } from './GrowthScaleUpIcons';
import { COVERS, FPS, DUR, PAUSE, CARD_T, INSERTS, SPINE_SECS } from './GrowthScaleUp';

export { COVERS, FPS, DUR, PAUSE, CARD_T, INSERTS, SPINE_SECS };

loadFont('normal', { weights: ['900'], subsets: ['latin'] });
loadFont('italic', { weights: ['800'], subsets: ['latin'] });

const W = 1080;
const H = 1920;
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
const F = (t: number) => Math.round(sh(t) * FPS);
type Cover = (typeof COVERS)[number];

// ───────────────────────────── the MEASURED face crop (§1b: assets/vertical/face-crop.json) ─────────────────────────────
// The spine (1920x1080) covers the 1080x1920 frame at 1.778x: the crop keeps 607.5 source px. face-crop.json gives the
// subject centre per FACE window as a percent of the SOURCE width (mean 54.53, spread [46.69, 72.08]). CSS objectPosition
// p places the crop's left edge at p * (1920 - 607.5), so the crop that CENTRES a face at c% is
// p = (c * 19.2 - 303.75) / 1312.5. Per-window offsets (the spread is large): window mean -> p.
const CROP_W = (1080 / 1920) * 1080;
const posFor = (c: number) => ((c * 19.2 - CROP_W / 2) / (1920 - CROP_W)) * 100;
// face-crop.json's per-window means are skewed by false detections (a wall picture at ~72%: lone 71-72 samples in F4, F7,
// F8 put the crop off his face; from 228.2 he turns to profile and leans right, 58 -> 66, chunk QA 2026-10-28). Re-tracked every 0.5 s with a face detector on the spine
// (_previews/vertical/qa/face-track.json), lone outliers dropped, keyframes [t, c%] interpolated within the window.
const FACE_CROP: { w: [number, number]; k: [number, number][] }[] = [
  { w: [0.0, 13.0], k: [[0, 50.7]] },
  { w: [23.4, 35.367], k: [[23.4, 49.5], [29.9, 51.8], [30.65, 45], [31.6, 49.5]] },
  { w: [68.133, 73.833], k: [[68.13, 49.7], [70.9, 49.2], [71.38, 58], [72.38, 56.5], [72.88, 50], [73.38, 47.5]] },
  { w: [99.6, 103.267], k: [[99.6, 49.5], [101.35, 53.5], [102.85, 56]] },
  { w: [120.7, 125.567], k: [[120.7, 51], [122.45, 50.3], [122.95, 54.8], [123.45, 55.5], [123.95, 50.6], [124.95, 47.6]] },
  { w: [138.567, 142.633], k: [[138.6, 49.5], [140.5, 52.9], [142.6, 52]] },
  { w: [158.367, 161.867], k: [[158.4, 54], [161.9, 52]] },
  { w: [216.933, 229.715], k: [[216.93, 45], [218.18, 51.5], [220.68, 54], [221.68, 51.6], [223.5, 55], [226.68, 56.3], [228.18, 58], [228.9, 66], [229.715, 66]] },
];
const trackC = (k: [number, number][], t: number) =>
  k.length === 1 ? k[0][1] : interpolate(t, k.map((p) => p[0]), k.map((p) => p[1]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const MEAN_C = 54.53; // face-crop.json mean_pct (cover beats: the spine is under a cover anyway)
const FACE_POINT = { x: 540, y: 768 }; // the 16:9 face point (960, 432) through the 1.778x cover crop, centred

// [PUNCH-IN] steps on the joins: the 16:9 values (same joins, same steps)
const PUNCH: [number, number][] = [
  [2.533, 1.15], [6.9, 1.0],
  [24.633, 1.15], [31.4, 1.0],
  [70.967, 1.15],
  [123.133, 1.15],
  [139.767, 1.15],
  [159.333, 1.15], [161.367, 1.0],
  [218.067, 1.15], [220.833, 1.0], [228.9, 1.15],
];
const LEAKS: { t: number; id: string }[] = [
  { t: 2.533, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 6.9, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 10.933, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4
  { t: 24.633, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 31.4, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 70.967, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 123.133, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4
  { t: 139.767, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 159.333, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 161.367, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 218.067, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4
  { t: 220.833, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 228.9, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
];
const BANDS = [
  { t0: 28.35, t1: 31.4, lines: ['LIST THE *WORK YOU HATE*'], swaps: [{ t: 31.14, lines: ['HIRE A *JUNIOR*'] }] },
  { t0: 123.01, t1: 125.567, lines: ['THE 1:1 =', '*JUDGMENT TRANSFER*'], swaps: [{ t: 124.96, lines: ['NOT A', '*STATUS UPDATE*'] }] },
];

const EPS = 0.001;
type Xf = { pos: number; punch: number };
const spineXf = (t: number): Xf => {
  const w = FACE_CROP.find(({ w: [a, b] }) => t >= a - 0.5 && t < b + 0.5);
  let punch = 1;
  if (w) for (const [j, s] of PUNCH) if (j >= w.w[0] - 0.5 && j <= t + EPS) punch = s;
  // "Welcome to the AI world" (10.933-13.0, arms raised): no punch (PROJECT-LOG 2026-10-27), same as the 16:9
  return { pos: posFor(w ? trackC(w.k, t) : MEAN_C), punch };
};

// ───────────────────────────── the absolute clock (§6a) ─────────────────────────────
const AbsFrame = React.createContext(0);
const useAbs = () => useContext(AbsFrame);

const SpinePicture: React.FC<{ xf: Xf; children: React.ReactNode }> = ({ xf, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: 'black' }}>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${xf.punch})` }}>{children}</div>
  </AbsoluteFill>
);
const spineStyle = (xf: Xf): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: W,
  height: H,
  objectFit: 'cover',
  objectPosition: `${xf.pos.toFixed(2)}% center`,
});

/** The spine frozen on ONE absolute frame, muted, same crop + punch (the zero-offset Sequence is load-bearing, see 16:9). */
const SpineFrozen: React.FC<{ at: number }> = ({ at }) => {
  const xf = spineXf(at / FPS);
  return (
    <SpinePicture xf={xf}>
      <Sequence from={0} layout="none">
        <Freeze frame={at}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle(xf)} />
        </Freeze>
      </Sequence>
    </SpinePicture>
  );
};
const SpineStill: React.FC = () => <SpineFrozen at={useAbs()} />;
const SpineLive: React.FC = () => {
  const f = useCurrentFrame();
  const xf = spineXf(f / FPS);
  return (
    <SpinePicture xf={xf}>
      <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle(xf)} />
    </SpinePicture>
  );
};

// ───────────────────────────── 16:9 ref -> VERTICAL asset (explicit lookups; a miss throws at build) ─────────────────────────────
const V_VID: Record<string, { src: string; fps: number }> = {
  'BR-1-solo-night-desk': { src: 'vid/BR-1-solo-night-desk.mp4', fps: 29.97 },
  'BR-2-chat-windows-monitors': { src: 'vid/BR-2-chat-windows-monitors.mp4', fps: 23.976 },
  'BR-3-team-table-pushin': { src: 'vid/BR-3-team-table-pushin.mp4', fps: 30 },
  'BR-4-sticky-notes-glass': { src: 'vid/BR-4-sticky-notes-glass.mp4', fps: 24 },
  'BR-5-team-laptops': { src: 'vid/BR-5-team-laptops.mp4', fps: 25 },
  'BR-6-document-laptop': { src: 'vid/BR-6-document-laptop.mp4', fps: 25 },
  'BR-7-one-on-one': { src: 'vid/BR-7-one-on-one.mp4', fps: 25 },
  'BR-8-whiteboard-pointing': { src: 'vid/BR-8-whiteboard-pointing.mp4', fps: 29.97 },
  'BR-9-present-back': { src: 'vid/BR-9-present-back.mp4', fps: 23.976 },
  'BR-10-team-shared-screen': { src: 'vid/BR-10-team-shared-screen.mp4', fps: 23.976 },
  'BR-11-analytics-dashboard': { src: 'vid/BR-11-analytics-dashboard.mp4', fps: 23.976 },
  'BR-12-screen-wall': { src: 'vid/BR-12-screen-wall.mp4', fps: 24 },
};
const V_CARD: Record<string, string> = Object.fromEntries(
  [
    'K1-better-move-card', 'K2-hire-into-impact-card', 'K3-anti-pattern-card',
    'C2-agents-take-list-s1', 'C2-agents-take-list-s2', 'C2-agents-take-list-s3', 'C2-agents-take-list-s4', 'C2-agents-take-list-s5', 'C2-agents-take-list-s6',
    'C1-seats-row-s1', 'C1-seats-row-s2',
    'L1-principles-list-s1', 'L1-principles-list-s2', 'L1-principles-list-s3',
    'L2-plays-list-s1', 'L2-plays-list-s2', 'L2-plays-list-s3', 'L2-plays-list-s4', 'L2-plays-list-s5', 'L2-plays-list-s6',
    'CHURN-agent-panel-s1', 'CHURN-agent-panel-s2',
  ].map((r) => [r, `card-slides/${r}.png`]),
);
const V_DIAGRAM: Record<string, string> = Object.fromEntries(
  [
    'C1-split-diagram-strategy', 'C1-split-diagram-execution', 'C1-split-diagram-analysis',
    'C3-experiment-loop-diagram-mine', 'C3-experiment-loop-diagram-backlog', 'C3-experiment-loop-diagram-plan',
    'C3-experiment-loop-diagram-variants', 'C3-experiment-loop-diagram-readout', 'C3-experiment-loop-diagram-human',
  ].map((r) => [r, `diagrams/${r}.png`]),
);
// receipts: MOBILE-VIEW captures at 1080x1920 (the highlight is baked into the capture where the 16:9 wiped one)
const V_RECEIPT: Record<string, string> = Object.fromEntries(
  [
    'C6-statsig-ai-experiment-summary', 'C14-agents-folder-29-definitions', 'C14b-claude-md-5-hitl-gates', 'C15-evan-miller-sample-size',
    'C11-amplitude-predictive-cohorts', 'C12-stripe-smart-retries', 'C13-google-scaled-content-abuse',
  ].map((r) => [r, `receipts/${r}.png`]),
);
const vAsset = (c: Cover): string => {
  const m = c.kind === 'vid' ? V_VID[c.ref]?.src : c.kind === 'container' ? V_CARD[c.ref] : c.kind === 'deck' ? V_DIAGRAM[c.ref] : V_RECEIPT[c.ref];
  if (!m) throw new Error(`GrowthScaleUpVertical: no vertical asset for ${c.kind} ${c.ref}`);
  return m;
};
for (const c of COVERS) vAsset(c); // build-time check: every 16:9 cover resolves to a vertical asset
const RECEIPT_BG: Record<string, string> = { 'C14-agents-folder-29-definitions': '#1e1e1e', 'C14b-claude-md-5-hitl-gates': '#1e1e1e' };

const CAPTION_SRC: [number, number][] = [[0.0, 13.0], [23.4, 35.367], [68.133, 73.833], [216.933, 229.715]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from GrowthScaleUpCaptions.ts');
const CAPTION_OFF: [number, number][] = [
  [3.48, 13.0], [24.34, 31.4], [32.86, 35.367], [71.62, 73.833], [217.06, 222.74], [222.74, 224.907], [228.94, 229.715],
];

// list-card item 1 masked until its word (the 16:9 gate ruling), redrawn as an EMPTY slot. Rects measured on the VERTICAL PNGs.
const MASKS: Record<string, { until: number; rect: [number, number, number, number] }> = {
  'C2-agents-take-list-s1': { until: 50.2, rect: [128, 580, 824, 136] },
  'L1-principles-list-s1': { until: 134.16, rect: [128, 724, 824, 140] },
  'L2-plays-list-s1': { until: 163.06, rect: [128, 676, 824, 140] },
};

const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover' };

const VidCover: React.FC<{ c: Cover }> = ({ c }) => {
  const v = V_VID[c.ref];
  return (
    <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
      <OffthreadVideo src={staticFile(v.src)} muted playbackRate={30 / v.fps} style={fill} />
    </AbsoluteFill>
  );
};

const MaskSlot: React.FC<{ m: (typeof MASKS)[string] }> = ({ m }) => {
  const [x, y, w, h] = m.rect;
  return (
    <>
      <div style={{ position: 'absolute', left: x - 12, top: y - 10, width: w + 24, height: h + 22, background: '#f8f8f6' }} />
      <div
        style={{
          position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: 14,
          border: '2px dashed #dcd8cd', background: '#fcfcfb', display: 'flex', alignItems: 'center', paddingLeft: 30,
          fontFamily: "'JetBrains Mono', 'Consolas', monospace", fontWeight: 600, fontSize: 32, color: '#6f7683',
        }}
      >
        01
      </div>
    </>
  );
};

const ContainerCover: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useAbs() / FPS;
  const m = MASKS[c.ref];
  return (
    <AbsoluteFill style={{ background: '#f1efe9' }}>
      <Img src={staticFile(vAsset(c))} style={fill} />
      {m && t + EPS < m.until && <MaskSlot m={m} />}
    </AbsoluteFill>
  );
};

const DIAGRAM_SPAN: Record<string, [number, number]> = { C1: [73.833, 90.5], C3: [164.1, 174.8] };
const DeckCover: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useAbs() / FPS;
  const [a, b] = DIAGRAM_SPAN[c.ref.slice(0, 2)];
  const s = interpolate(t, [a, b], [1.0, 1.035], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: '#f1efe9', overflow: 'hidden' }}>
      <Img src={staticFile(vAsset(c))} style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 45%' }} />
    </AbsoluteFill>
  );
};

/** a portrait receipt: the mobile capture full-frame, a settling push anchored on its upper third (the free area above a panel) */
const ReceiptView: React.FC<{ c: Cover; still?: boolean }> = ({ c, still }) => {
  const t = useAbs() / FPS;
  const u = still ? 0 : interpolate(t, [c.tIn, c.tOut], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: RECEIPT_BG[c.ref] ?? '#ffffff', overflow: 'hidden' }}>
      <Img src={staticFile(vAsset(c))} style={{ ...fill, transform: `scale(${1 + 0.05 * u})`, transformOrigin: '50% 20%' }} />
    </AbsoluteFill>
  );
};

// [MOTION] ids (the mo field of the imported cover table): motion-3d-pan-1-down (C14), motion-3d-offset-2-right-up (C12)
const MOTION_IDS = ['motion-3d-pan-1-down', 'motion-3d-offset-2-right-up'];
if (JSON.stringify(COVERS.filter((c) => c.mo).map((c) => c.mo)) !== JSON.stringify(MOTION_IDS)) throw new Error('MOTION_IDS drifted from COVERS');
const MotionWrap: React.FC<{ id: string; c: Cover }> = ({ id, c }) => {
  const abs = useAbs();
  const row = getTransition(id)!;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const total = framesForRow(row, FPS);
  const slot = F(c.tOut) - F(c.tIn);
  const ff = Math.min(total - 1, Math.max(0, Math.round(((abs - F(c.tIn)) * total) / slot)));
  const node = () => <ReceiptView c={c} still />;
  return (
    <AbsoluteFill style={{ background: RECEIPT_BG[c.ref] ?? '#0d1117' }}>
      <Freeze frame={ff}>
        <Engine from={node()} outClip={node} durationInFrames={total} params={row.params} />
      </Freeze>
    </AbsoluteFill>
  );
};

const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'vid':
      return <VidCover c={c} />;
    case 'container':
      return <ContainerCover c={c} />;
    case 'deck':
      return <DeckCover c={c} />;
    case 'receipt':
      return c.mo ? <MotionWrap id={c.mo} c={c} /> : <ReceiptView c={c} />;
  }
  return null;
};

const XFADE = 0.35;
const SLIDE = KT_LIST.slide;
const SLIDE_TRAVEL = Math.round((KT_LIST.travel / 1920) * W); // the same fraction of the frame width
const tailFor = (i: number) => {
  const n = COVERS[i + 1];
  if (!n || Math.abs(n.tIn - COVERS[i].tOut) > 0.05) return 0;
  if (n.tr === 'xfade') return Math.round(XFADE * FPS) + 1;
  if (n.tr === 'slide') return Math.round(SLIDE * FPS) + 1;
  return 0;
};

const Ingress: React.FC<{ c: Cover; children: React.ReactNode }> = ({ c, children }) => {
  const t = useAbs() / FPS + EPS;
  const dt = t - c.tIn;
  if (c.tr === 'whip' || c.tr === 'whipBlur') {
    const heavy = c.kind === 'vid' || !!c.mo;
    return (
      <KtWhipCut t0={c.tIn} variant={c.tr === 'whipBlur' ? 'blur-in' : 'default'} motionBlur={!heavy} width={W} height={H}>
        {children}
      </KtWhipCut>
    );
  }
  if (c.tr === 'xfade') {
    const u = interpolate(dt, [0, XFADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const e = Easing.out(Easing.cubic)(u);
    return <AbsoluteFill style={{ opacity: e, transform: `scale(${0.93 + 0.07 * e})` }}>{children}</AbsoluteFill>;
  }
  if (c.tr === 'slide') {
    const u = interpolate(dt, [0, SLIDE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return <AbsoluteFill style={{ transform: `translateX(${SLIDE_TRAVEL * (1 - easeInfluence325(u))}px)` }}>{children}</AbsoluteFill>;
  }
  return <>{children}</>;
};

const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => (
      <Sequence key={i} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn) + tailFor(i)} name={`cover ${c.ref}`}>
        <Ingress c={c}>
          <CoverEl c={c} />
        </Ingress>
      </Sequence>
    ))}
  </>
);

const HOLDS: { from: number; frames: number; at: number }[] = [
  { from: F(161.867), frames: Math.round(SLIDE * FPS) + 1, at: F(161.867) - 1 },
  { from: DUR - 2, frames: 2, at: DUR - 3 },
];
const SpineHolds: React.FC = () => (
  <>
    {HOLDS.map((h, i) => (
      <Sequence key={i} from={h.from} durationInFrames={h.frames} name={`spine hold ${h.at}`}>
        <SpineFrozen at={h.at} />
      </Sequence>
    ))}
  </>
);

const EngineWindow: React.FC<{ id: string; t: number; outgoing: () => React.ReactNode; incoming: () => React.ReactNode }> = ({ id, t, outgoing, incoming }) => {
  const row = getTransition(id)!;
  const win = framesForRow(row, FPS);
  const half = Math.round(win / 2);
  return (
    <Sequence from={F(t) - half} durationInFrames={win} name={`tr ${id}`}>
      <TransitionClip id={id} cutFrame={half} outgoing={outgoing} incoming={incoming} sfx={false} />
    </Sequence>
  );
};

const FACE_IN: { t: number; variant: 'open' | 'default' }[] = [
  { t: 0.0, variant: 'open' }, // hand:kt-whip-cut kt-signature-open part 1
  { t: 23.4, variant: 'default' }, // hand:kt-whip-cut F2
  { t: 68.133, variant: 'default' }, // hand:kt-whip-cut F3
  { t: 99.6, variant: 'default' }, // hand:kt-whip-cut F4
  { t: 120.7, variant: 'default' }, // hand:kt-whip-cut F5
  { t: 138.567, variant: 'default' }, // hand:kt-whip-cut F6
  { t: 158.367, variant: 'default' }, // hand:kt-whip-cut F7
  { t: 216.933, variant: 'default' }, // hand:kt-whip-cut F8
];
const FaceWhips: React.FC = () => (
  <>
    {FACE_IN.map((w, i) => {
      const dur = w.variant === 'open' ? 0.73 : 0.37;
      return (
        <Sequence key={i} from={F(w.t)} durationInFrames={Math.ceil(dur * FPS) + 1} name={`face whip ${w.t}`}>
          <KtWhipCut t0={w.t} variant={w.variant} motionBlur={false} width={W} height={H}>
            <SpineStill />
          </KtWhipCut>
        </Sequence>
      );
    })}
  </>
);

const Leaks: React.FC = () => (
  <>
    {LEAKS.map((l, i) => (
      <EngineWindow key={i} id={l.id} t={l.t} outgoing={() => <SpineStill />} incoming={() => <SpineStill />} />
    ))}
  </>
);

const coverByRef = (ref: string) => COVERS.find((c) => c.ref === ref)!;
const Spin: React.FC = () => (
  // lib:spin-corner-swinging-short-rb (SPIN-newfacet)
  <EngineWindow
    id="spin-corner-swinging-short-rb"
    t={164.1}
    outgoing={() => <ContainerCover c={coverByRef('L2-plays-list-s1')} />}
    incoming={() => <DeckCover c={coverByRef('C3-experiment-loop-diagram-mine')} />}
  />
);

// ───────────────────────────── kinetic-text devices, re-laid for portrait ─────────────────────────────
// The engines draw in a 1920x1080 coordinate space. <Land> maps that space into the portrait frame:
// frame = (ox + s*x, oy + s*y). POP = centre-cropped (landscape x 960 -> frame 540) and centred vertically (y 540 -> 960).
type LandXf = { s: number; ox: number; oy: number };
const Land: React.FC<{ xf: LandXf; children: React.ReactNode }> = ({ xf, children }) => (
  <div style={{ position: 'absolute', left: xf.ox, top: xf.oy, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${xf.s})` }}>{children}</div>
);
const pop = (s = 1, cy = 960): LandXf => ({ s, ox: 540 - 960 * s, oy: cy - 540 * s });
// a side panel fills the frame WIDTH along the bottom (dark: 862 px wide, paper: 973 px from x 947)
const DARK_S = W / 862;
const darkLand = (side: 'L' | 'R'): LandXf => ({ s: DARK_S, ox: side === 'R' ? -(1920 - 862) * DARK_S : 0, oy: H - 1080 * DARK_S });
const PAPER_S = W / 973;
const PAPER_LAND: LandXf = { s: PAPER_S, ox: -947 * PAPER_S, oy: H - 1080 * PAPER_S };
const BAND_S = 0.75;
const BAND_LAND: LandXf = { s: BAND_S, ox: 540 - 960 * BAND_S, oy: H - 1080 * BAND_S - 40 };
// landscape y that lands on portrait y (for the POP mapping at s=1)
const ly = (frameY: number) => frameY - 420;
const lx = (frameX: number) => frameX + 420;

const Win: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
  <Sequence from={Math.max(0, F(a) - 1)} durationInFrames={Math.max(1, F(b) - Math.max(0, F(a) - 1))} layout="none">
    {children}
  </Sequence>
);
const TEX = 'kt/animated-texture.mp4';
const PAPER = 'kt/paper-crumpled.mp4';
const WHITE = '#FFFFFF';
const BLUE = '#030AF4';

const DARK_PANELS = [
  { t0: 13.0, t1: 18.6, side: 'R' as const, accent: SEAT_A, lines: ['*TEAM OF ONE*', 'STRATEGIST', 'EXECUTOR · LEADER', 'YOUR AGENTS', 'ARE THE TEAM'], icon: 'one' as const },
  { t0: 18.6, t1: 23.4, side: 'L' as const, accent: SEAT_B, lines: ['*TEAM OF FIVE*', 'PLAYER-COACH', 'EVERY REPORT', 'RUNS AGENTS'], icon: 'five' as const },
  { t0: 154.2, t1: 158.367, side: 'L' as const, accent: SEAT_B, lines: ['*TEAM OF FIVE*', 'ONE DOC', 'PEOPLE AND AGENTS', 'ALIGNED'], icon: 'five' as const },
];

/** seat tag: L = upper-left, R = upper-right of the portrait frame (or near the bottom at y=1700) */
const seatTag = (seat: 'one' | 'five', side: 'L' | 'R', t0: number, t1: number, frameY = 170, frameX?: number) => (
  <Win a={t0} b={t1}>
    <Land xf={pop()}>
      <KtIconPop t0={t0} t1={t1} icon={<SeatTag seat={seat} />} x={lx(frameX ?? (side === 'L' ? 300 : 780))} y={ly(frameY)} w={520} h={112} dir={side === 'L' ? 'from-left' : 'from-right'} travel={700} />
    </Land>
  </Win>
);

const PirateBadge: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '9px solid #ffffff', boxSizing: 'border-box', background: '#000918', boxShadow: '0 10px 28px rgba(0,0,0,0.55)' }}>
    <Img src={staticFile('kt/icon-pirate.png')} style={{ position: 'absolute', left: '6%', top: '6%', width: '88%', height: '88%', objectFit: 'cover' }} />
  </div>
);

const KtLayer: React.FC = () => (
  <>
    {/* CH1 signature open: the two seat labels stacked under the face */}
    <Win a={3.48} b={10.933}>
      <Land xf={pop()}>
        <KtKeywordPop t0={3.48} t1={10.933} lines={['TEAM OF', '*ONE*']} accent={SEAT_A} textColor={WHITE} x={lx(540)} y={ly(330)} />
      </Land>
    </Win>
    <Win a={7.74} b={10.933}>
      <Land xf={pop()}>
        <KtKeywordPop t0={7.74} t1={10.933} lines={['TEAM OF', '*FIVE*']} accent={SEAT_B} textColor={WHITE} x={lx(540)} y={ly(610)} seed={2} />
      </Land>
    </Win>
    <Win a={11.06} b={13.0}>
      <Land xf={pop()}>
        <KtKeywordPop t0={11.06} t1={13.0} lines={['WELCOME TO', 'THE AI WORLD']} accent={WHITE} x={lx(540)} y={ly(430)} />
      </Land>
    </Win>
    {DARK_PANELS.map((p, i) => (
      <Win key={i} a={p.t0} b={p.t1}>
        <Land xf={darkLand(p.side)}>
          <KtSidePanel t0={p.t0} t1={p.t1} side={p.side} texture="dark" textureSrc={staticFile(TEX)} textureIn={i * 9} lines={p.lines} accent={p.accent} seed={i} fontSize={66} linePitch={76} />
          <KtIconPop
            t0={p.t0 + 0.23}
            t1={p.t1}
            icon={p.icon === 'one' ? <OnePersonIcon /> : <FivePeopleIcon />}
            x={p.side === 'R' ? 1489 : 431}
            y={190}
            w={170}
            h={170}
            dir={p.side === 'R' ? 'from-right' : 'from-left'}
            travel={700}
          />
        </Land>
      </Win>
    ))}
    {/* CH2 */}
    <Win a={24.34} b={28.35}>
      <Land xf={pop()}>
        <KtKeywordPop t0={24.34} t1={28.35} lines={['THE FORK']} accent={WHITE} x={lx(540)} y={ly(430)} />
      </Land>
    </Win>
    {BANDS.map((b, i) => (
      <Win key={i} a={b.t0} b={b.t1}>
        <Land xf={BAND_LAND}>
          <KtLowerThirdBand t0={b.t0} t1={b.t1} lines={b.lines} swaps={b.swaps} textureSrc={staticFile(TEX)} textureIn={20 + i * 7} accent={i === 0 ? '#FCFE40' : SEAT_A} seed={i} fontSize={80} linePitch={86} />
        </Land>
      </Win>
    ))}
    <Win a={32.86} b={35.367}>
      <Land xf={pop()}>
        <KtKeywordPop t0={32.86} t1={35.367} lines={['ZERO', 'LEVERAGE']} accent={WHITE} x={lx(540)} y={ly(430)} />
      </Land>
    </Win>
    <Win a={36.2} b={39.36}>
      <Land xf={pop(0.7)}>
        <KtHeadlineOverBroll t0={36.2} t1={39.36} lines={['LIST THE', 'HIGHEST-IMPACT WORK']} />
      </Land>
    </Win>
    {seatTag('five', 'L', 59.0, 63.0)}
    <Win a={59.8} b={63.0}>
      <Land xf={pop(0.7)}>
        <KtHeadlineOverBroll t0={59.8} t1={63.0} lines={['HIRE INTO', 'THE HIGHEST-IMPACT WORK']} />
      </Land>
    </Win>
    {/* CH3: the scatter words stack under the face (the 16:9 head-side anchors fall outside a portrait crop) */}
    <Win a={71.62} b={73.833}>
      <Land xf={pop()}>
        <KtScatterWords
          t0={71.62}
          t1={73.833}
          accent={WHITE}
          words={[
            { t: 71.62, text: 'STRATEGY', anchor: { x: lx(540), y: ly(260) }, caps: 70 },
            { t: 72.06, text: 'EXECUTION', anchor: { x: lx(540), y: ly(400) }, caps: 70 },
            { t: 73.04, text: 'ANALYSIS', anchor: { x: lx(540), y: ly(540) }, caps: 70 },
          ]}
        />
      </Land>
    </Win>
    {seatTag('five', 'L', 95.9, 99.6)}
    <Win a={96.7} b={99.6}>
      <Land xf={pop(0.7)}>
        <KtHeadlineOverBroll t0={96.7} t1={99.6} lines={['THE LONG', 'AI-WRITTEN STRATEGY DOC']} />
      </Land>
    </Win>
    <Win a={102.14} b={103.267}>
      <Land xf={pop(0.6)}>
        <KtKeywordPop t0={102.14} t1={103.267} variant="punch-red" lines={['NOT WHY YOU', 'HIRED THEM']} y={540 + (430 - 960) / 0.6} />
      </Land>
    </Win>
    {/* CH4 */}
    {seatTag('five', 'L', 112.4, 116.1)}
    <Win a={113.4} b={116.1}>
      <Land xf={pop()}>
        <KtIconPop t0={113.4} t1={116.1} preset="gauge-right" icon={<CalendarIcon />} x={lx(800)} y={ly(420)} />
      </Land>
    </Win>
    <Win a={116.1} b={120.7}>
      <Land xf={PAPER_LAND}>
        <KtSidePanel t0={116.1} t1={120.7} texture="paper" paperSrc={staticFile(PAPER)} lines={['THE READOUT', "IS THE AGENT'S", 'JOB']} labelColor={BLUE} />
      </Land>
    </Win>
    <Win a={126.4} b={132.5}>
      <Land xf={pop(0.7)}>
        <KtHeadlineOverBroll t0={126.4} t1={132.5} lines={['SAY IT.', 'HAVE THEM PLAY IT BACK.']} />
      </Land>
    </Win>
    <Win a={138.567} b={142.633}>
      <Land xf={pop()}>
        <KtIconPop t0={138.567} t1={142.633} preset="chest-up" icon={<AgentIcon />} y={ly(1700)} />
      </Land>
    </Win>
    <Win a={142.4} b={142.633}>
      <Land xf={pop()}>
        <KtKeywordPop t0={142.4} t1={142.633} lines={['PUT IT IN WRITING']} accent={WHITE} x={lx(540)} y={ly(430)} />
      </Land>
    </Win>
    <Win a={143.0} b={154.2}>
      <Land xf={PAPER_LAND}>
        <KtSidePanel t0={143.0} t1={154.2} texture="paper" paperSrc={staticFile(PAPER)} lines={['TEAM OF ONE', '29 AGENT', 'DEFINITIONS', '5 HUMAN GATES']} labelColor={SEAT_A_LIGHT} fontSize={80} linePitch={86} />
      </Land>
    </Win>
    {seatTag('one', 'R', 142.633, 154.2)}
    {/* CH5 */}
    <Win a={159.18} b={161.867}>
      <Land xf={pop()}>
        <KtKeywordPop t0={159.18} t1={161.867} lines={['SCALE-UP MODE']} accent={WHITE} x={lx(540)} y={ly(430)} />
      </Land>
    </Win>
    <Win a={174.8} b={179.0}>
      <Land xf={PAPER_LAND}>
        <KtSidePanel t0={174.8} t1={179.0} texture="paper" paperSrc={staticFile(PAPER)} lines={['SAME', 'SAMPLE SIZE']} labelColor={BLUE} />
      </Land>
    </Win>
    <Win a={180.9} b={186.9}>
      <Land xf={PAPER_LAND}>
        <KtSidePanel
          t0={180.9}
          t1={186.9}
          texture="paper"
          paperSrc={staticFile(PAPER)}
          lines={['CHURN AGENT', 'FLAGS · RETRIES', '· DRAFTS', 'YOU OWN', 'THE OFFER']}
          labelColor={BLUE}
          fontSize={74}
          linePitch={80}
          icon={<LifebuoyIcon />}
          iconPreset="panel-up"
        />
      </Land>
    </Win>
    <Win a={192.9} b={196.9}>
      <Land xf={pop()}>
        <KtIconPop t0={192.9} t1={196.9} preset="gauge-right" icon={<FunnelIcon />} x={lx(800)} y={ly(420)} />
      </Land>
    </Win>
    <Win a={194.08} b={195.38}>
      <Land xf={pop(0.62)}>
        <KtKeywordPop t0={194.08} t1={195.38} variant="punch-red" lines={['AAARRR']} y={540 + (450 - 960) / 0.62} fontSize={264} linePitch={264} />
      </Land>
    </Win>
    <Win a={194.08} b={196.9}>
      <Land xf={pop()}>
        <KtIconPop t0={194.08} t1={196.9} preset="rocket-left" w={260} h={260} icon={<PirateBadge />} x={lx(230)} y={ly(780)} />
      </Land>
    </Win>
    <Win a={197.78} b={199.96}>
      <Land xf={BAND_LAND}>
        <KtLowerThirdBand t0={197.78} t1={199.96} lines={['*NO* STATUS MEETING']} textureSrc={staticFile(TEX)} textureIn={34} accent="#FCFE40" seed={2} fontSize={80} linePitch={86} />
      </Land>
    </Win>
    <Win a={204.0} b={210.5}>
      <Land xf={PAPER_LAND}>
        <KtSidePanel t0={204.0} t1={210.5} texture="paper" paperSrc={staticFile(PAPER)} lines={['VALUE TO', 'THE USER,', 'NO MATTER', "HOW IT'S MADE"]} labelColor={BLUE} fontSize={80} linePitch={86} />
      </Land>
    </Win>
    {seatTag('one', 'R', 210.72, 216.933, 1640, 540)}
    {seatTag('five', 'L', 212.88, 216.933, 1780, 540)}
    {/* CH6 close */}
    <Win a={217.06} b={222.74}>
      <Land xf={pop(0.68)}>
        <KtWordByWord
          t0={217.06}
          t1={222.74}
          phrases={[
            { t: 217.06, text: 'FEWER PEOPLE' },
            { t: 218.16, text: 'HIGHER VELOCITY' },
          ]}
          payoff={{ t: 221.26, text: 'JUDGMENT' }}
          payoffColor={SEAT_A}
          phraseY={540 + (380 - 960) / 0.68}
          payoffY={540 + (620 - 960) / 0.68}
        />
      </Land>
    </Win>
    <Win a={222.74} b={224.907}>
      <Land xf={pop(1, 1334)}>
        <KtSubscribeClose t0={222.74} t1={224.907} buttonSrc={staticFile('kt/subscribe-button-alt.mp4')} arrowSrc={staticFile('kt/arrow-red.png')} />
      </Land>
    </Win>
    <Win a={228.94} b={229.715}>
      <Land xf={pop(1, 850)}>
        <KtSubscribeClose t0={228.94} t1={229.8} arrowT={228.94} arrowSide="left" buttonSrc={staticFile('kt/subscribe-button-alt.mp4')} arrowSrc={staticFile('kt/arrow-red.png')} />
      </Land>
    </Win>
  </>
);

// ───────────────────────────── captions (§8 house style, restyled for portrait: under the face, wraps) ─────────────────────────────
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= sh(a) && t < sh(b))) return null;
  if (CAPTION_OFF.some(([a, b]) => t + EPS >= sh(a) && t < sh(b))) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) {
    if (c.tf <= t + EPS) cur = c;
    else break;
  }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const d = t - cur.tf;
  const s = interpolate(d, [0, 0.08, 0.16], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1600 }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 84,
          textTransform: 'lowercase',
          color: '#ffffff',
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          transform: `scale(${s})`,
          maxWidth: 980,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

export const GrowthScaleUpVertical: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: frame / FPS }}>
        <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
          <SpineLive />
          <SpineHolds />
          <Leaks />
          <CoverTrack />
          <Spin />
          <FaceWhips />
          <KtLayer />
          <Captions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};
