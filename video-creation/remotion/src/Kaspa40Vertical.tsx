import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions/registry';
import { C1V } from './Kaspa40VerticalChartC1';
import { H1V, C2V, C3V, FINV } from './Kaspa40VerticalCharts';
import { ZCAPTIONS } from './Kaspa40Captions';
import {
  CARD_T, PAUSE, sh, cardStart, F, unsh, CAPTION_SRC, LEAKS, spineScale,
  COVERS, LIBCUTS, CARDS, CARD_TURN, LT_LINK, LINE_CAPTION, ip, ease,
  type Cover,
} from './Kaspa40Bps';

/**
 * kaspa 30bps — VERTICAL 1080x1920 cut.
 *
 * ⛔ A REFRAMING, NOT A RE-EDIT (skills/vertical-repurpose.md). Every timing table — COVERS, LIBCUTS,
 * CARDS, PUNCH/spineScale, FACE + caption windows, the card pauses and sh() — is IMPORTED from the
 * 16:9 comp rather than copied, so the two cuts cannot drift. Same spine, same 13720 frames, same
 * audio. The only thing that changes here is what fills the frame.
 *
 * Every asset is the NATIVE-VERTICAL rebuild under `assets/vertical/`, never a crop of a 16:9 one.
 */

const { fontFamily: MONT } = loadMontserrat('normal', {
  weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});

export const K40V_FPS = 30;
const FPS = K40V_FPS;
export const K40V_DURATION = Math.round((455.33 + CARD_T.length * PAUSE) * FPS);  // === the 16:9's 13720

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const AbsFrameCtx = React.createContext(0);

// ─── vertical asset tables (same refs, portrait files) ───────────────────────
const V = 'vertical/';
const SLIDE: Record<string, string> = {
  'card-40bps-open': V + 'title-slides/card-40bps-open.png',
  'card-fastest-pow': V + 'title-slides/card-fastest-pow.png',
  'card-negation': V + 'title-slides/card-negation.png',
  'card-dagknight-intro': V + 'title-slides/card-dagknight-intro.png',
  'stamp-subsecond': V + 'title-slides/stamp-subsecond.png',
  'toccata-features': V + 'card-slides/toccata-features.png',
  'card-security-50': V + 'card-slides/card-security-50.png',
  'compare-solana-kaspa': V + 'card-slides/compare-solana-kaspa.png',
  'card-honest-target': V + 'card-slides/card-honest-target.png',
};
const STATEFILE: Record<string, string> = {
  'toccata-features:s1': V + 'card-slides/toccata-features-s1.png',
  'toccata-features:s2': V + 'card-slides/toccata-features-s2.png',
  'toccata-features:s3': V + 'card-slides/toccata-features-s3.png',
  'compare-solana-kaspa:s1': V + 'card-slides/compare-solana-kaspa-s1.png',
  'compare-solana-kaspa:s2': V + 'card-slides/compare-solana-kaspa-s2.png',
  'compare-solana-kaspa:s3': V + 'card-slides/compare-solana-kaspa-s3.png',
  'compare-solana-kaspa:s4': V + 'card-slides/compare-solana-kaspa-s4.png',
  'card-honest-target:s1': V + 'card-slides/card-honest-target-s1.png',
  'card-honest-target:s3': V + 'card-slides/card-honest-target-s3.png',
  'd-dag:base': V + 'diagrams/d-dag-base.png',
  'd-dag:highlight': V + 'diagrams/d-dag-highlight.png',
  'c4-left:full': V + 'diagrams/c4-left-ghostdag.png',
  'c4-left:title': V + 'diagrams/c4-left-ghostdag.png',
  'c4-left:box': V + 'diagrams/c4-left-ghostdag.png',
  'c4-left:guess': V + 'diagrams/c4-left-ghostdag.png',
  'c4-left:readout': V + 'diagrams/c4-left-ghostdag.png',
  'c4-left:pulse': V + 'diagrams/c4-left-ghostdag.png',
  'c4-right:full': V + 'diagrams/c4-right-dagknight.png',
  'c4-right:readout': V + 'diagrams/c4-right-dagknight.png',
};
/**
 * Portrait spotlights, as measured RECTS on the shipped 1080x1920 diagram
 * (`assets/vertical/diagrams/c4-vertical-mesh.json`), not as guessed focus points.
 *
 * ⛔ TRANSLATE FIRST, THEN SCALE. Re-centre the rect and scale about the FRAME centre; scaling about
 * an off-centre origin is what cropped "GHOSTDAG" off the left edge (16:9 v1, and again in the first
 * vertical smoke test where "CONSENSUS" lost its C). Each `scale` here stays under the rect's
 * measured `max_scale`, which is the largest push that keeps the whole rect on canvas.
 */
type Spot = { rect: [number, number, number, number]; scale: number };
const SPOT: Record<string, Spot> = {
  'c4-left:full':    { rect: [0, 0, 1080, 1920], scale: 1.00 },
  // Scales are deliberately UNDER each rect's measured max: the rect fitting on canvas is not enough,
  // because pushing into a LOWER region drags the 730px-wide title block sideways until "GHOSTDAG"
  // clips mid-letter. Verified by render, not by arithmetic.
  'c4-left:title':   { rect: [60, 62, 790, 302], scale: 1.30 },   // max 1.48
  'c4-left:box':     { rect: [60, 356, 1020, 604], scale: 1.06 }, // max 1.12
  'c4-left:guess':   { rect: [104, 496, 945, 570], scale: 1.10 }, // max 1.28
  'c4-left:readout': { rect: [60, 1707, 1020, 1840], scale: 1.08 },
  'c4-left:pulse':   { rect: [115, 770, 965, 1650], scale: 1.04 },
  'c4-right:full':   { rect: [0, 0, 1080, 1920], scale: 1.00 },
  'c4-right:readout':{ rect: [60, 1707, 1020, 1840], scale: 1.06 },
};
/** Where a spotlight DRIFTS to by the end of its hold (same rect vocabulary). */
const MOTION: Record<string, Spot> = {
  'c4-right:full':   { rect: [0, 120, 1080, 1800], scale: 1.03 },
  'c4-right:readout':{ rect: [60, 1707, 1020, 1840], scale: 1.10 },
};
const CANVAS_W = 1080, CANVAS_H = 1920;
/** translate the rect centre to the frame centre, then scale about that centre */
const spotTransform = (s: Spot) => {
  const cx = (s.rect[0] + s.rect[2]) / 2, cy = (s.rect[1] + s.rect[3]) / 2;
  return `scale(${s.scale}) translate(${(CANVAS_W / 2 - cx).toFixed(1)}px, ${(CANVAS_H / 2 - cy).toFixed(1)}px)`;
};
const lerpSpot = (a: Spot, b: Spot | undefined, t: number): Spot => {
  if (!b) return a;
  return {
    rect: [0, 1, 2, 3].map((i) => a.rect[i] + (b.rect[i] - a.rect[i]) * t) as [number, number, number, number],
    scale: a.scale + (b.scale - a.scale) * t,
  };
};

const BROLL: Record<string, { file: string; off: number; rate?: number }> = {
  'BR-1': { file: V + 'vid/BR-1-warp-tunnel.mp4', off: 0 },
  'BR-2': { file: V + 'vid/BR-2-gauge-dial.mp4', off: 0 },
  'BR-3': { file: V + 'vid/BR-3-reactor-core.mp4', off: 0 },
  'BR-4': { file: V + 'vid/BR-4-storm-pov.mp4', off: 0 },
  'BR-5': { file: V + 'vid/BR-5-sunny-pov.mp4', off: 0, rate: 0.40 },   // slowed, exactly as the 16:9
  'BR-6': { file: V + 'vid/BR-6-traffic-jam.mp4', off: 0 },
  'BR-7': { file: V + 'vid/BR-7-rusty-gears.mp4', off: 0 },
  'BR-8': { file: V + 'vid/BR-8-boardroom.mp4', off: 0 },
  'BR-9': { file: V + 'vid/BR-9-cloud-ascent.mp4', off: 0 },
  'BR-10': { file: V + 'vid/BR-10-earth-network.mp4', off: 0 },
  'BR-11': { file: V + 'vid/BR-11-rail-junction.mp4', off: 0 },
  'BR-12': { file: V + 'vid/BR-12-purple-stage.mp4', off: 0 },
};
const STILL: Record<string, string> = {
  'IMG-1': V + 'img/IMG-1-kaspa-coin-teal-backwards-k.png',
  'IMG-2': V + 'img/IMG-2-dark-armored-knight.png',
  'IMG-4': V + 'img/IMG-4-bitcoin-museum-relic.png',
  'IMG-5': V + 'img/IMG-5-velvet-token-coin.png',
  'IMG-6': V + 'img/IMG-6-lab-token-flask-coin.png',
  'IMG-7': V + 'img/IMG-7-coin-cascade-momentum.png',
};
/** Receipts are re-captured in MOBILE VIEW, so each is already a tall single column: it fills the
 *  portrait frame by width and the reading treatment becomes a vertical pan down that column. */
type VReceipt = {
  file: string; video?: boolean; pos?: [number, number]; zoom?: [number, number]; libMove?: string;
  /** 'card' = the capture is a SHORT WIDE strip (a cropped panel, not a full page). Fit it by WIDTH and
   *  centre it vertically on the dark bg; a cover-fit would scale it >4x and shred it. */
  fit?: 'card';
};
const RECEIPT: Record<string, VReceipt> = {
  'R1': { file: V + 'receipts/R1-github-release-v2.0.0.png', pos: [4, 26], zoom: [1.0, 1.05] },
  'R2': { file: V + 'receipts/R2-explorer-kaspa-blocks.mp4', video: true },
  'R3': { file: V + 'receipts/R3-dagknight-paper-title.png', pos: [2, 22], libMove: 'motion-3d-pan-1-down' },
  'R4': { file: V + 'receipts/R4-rusty-kaspa-commits-scroll.mp4', video: true },
  // cropped to the supply block only (so the price header and the red "price down today" prompt that
  // undercut the bullish line in the 16:9 are out of frame) — that makes it a short wide card
  'R5': { file: V + 'receipts/R5-cmc-kaspa-supply.png', fit: 'card', zoom: [1.0, 1.06] },
  'R6': { file: V + 'receipts/R6-alpenglow-anza.png', pos: [6, 40] },
  'R7': { file: V + 'receipts/R7-cryptorich-products.png', pos: [2, 30], zoom: [1.0, 1.06] },
};
const CUTFRAME: Record<string, string> = { 'BR-8': V + 'vid/BR-8-cutframe.jpg' };

/** Fail at module load if any slide/diagram state resolves to no file (the 16:9 lost a whole render
 *  to exactly this, so the guard is carried over). */
COVERS.filter((c: Cover) => c.kind === 'deck' || c.kind === 'container').forEach((c: Cover) => {
  if (!(STATEFILE[`${c.ref}:${c.state}`] ?? SLIDE[c.ref])) {
    throw new Error(`vertical cover "${c.ref}" state "${c.state}" @${c.tIn}s resolves to no file`);
  }
});

// ─── C4 packets, portrait mesh ───────────────────────────────────────────────
/** Edge list of the REFLOWED portrait mesh (viewBox 0 0 1080 1920), filled from the vertical c4 SVG.
 *  Behaviour is identical to the 16:9: GHOSTDAG crawls at one fixed rate (that IS the hardcoded
 *  guess), DAGKnight starts at the same crawl then adapts to the VO. */
export const C4_EDGES_V: [number, number, number, number][] = [
  [558, 850, 274, 962], [558, 850, 806, 978], [558, 850, 512, 1091], [274, 962, 145, 1139],
  [274, 962, 512, 1091], [806, 978, 512, 1091], [806, 978, 935, 1179], [512, 1091, 613, 1251],
  [145, 1139, 310, 1315], [935, 1179, 880, 1363], [613, 1251, 310, 1315], [613, 1251, 880, 1363],
  [613, 1251, 549, 1444], [310, 1315, 163, 1492], [880, 1363, 843, 1540], [549, 1444, 163, 1492],
  [549, 1444, 843, 1540], [549, 1444, 448, 1620], [163, 1492, 448, 1620], [843, 1540, 448, 1620],
];
const C4_PHASE_RIGHT: [number, number][] = [
  [194.80, 0.00], [200.90, 1.83], [205.50, 3.61], [206.80, 4.13], [207.50, 4.55],
  [208.60, 6.20], [209.20, 6.65], [210.40, 7.05], [211.20, 7.60], [212.60, 9.60],
];
const c4Phase = (state: 'left' | 'right', ts: number) => {
  if (state === 'left') return 0.30 * (ts - 148.98);
  const K = C4_PHASE_RIGHT;
  if (ts <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (ts <= K[i][0]) return ip(ts, [K[i - 1][0], K[i][0]], [K[i - 1][1], K[i][1]]);
  return K[K.length - 1][1] + 1.35 * (ts - K[K.length - 1][0]);
};
const C4Packets: React.FC<{ state: 'left' | 'right'; ts: number; tIn: number; tOut: number }> = ({ state, ts, tIn, tOut }) => {
  if (!C4_EDGES_V.length) return null;
  const p = c4Phase(state, ts);
  const col = state === 'left' ? '#00c2ff' : '#00e68a';
  const op = ip(ts, [tIn, tIn + 0.6, tOut - 0.4, tOut], [0, 1, 1, 0]);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: 'none' }}>
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {C4_EDGES_V.map(([x1, y1, x2, y2], i) => {
          const u = ((p + i * 0.137) % 1 + 1) % 1;
          const ut = Math.max(0, u - 0.11);
          const x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
          const xt = x1 + (x2 - x1) * ut, yt = y1 + (y2 - y1) * ut;
          return (
            <g key={i}>
              <line x1={xt} y1={yt} x2={x} y2={y} stroke={col} strokeWidth={4} strokeLinecap="round" opacity={0.45} />
              <circle cx={x} cy={y} r={13} fill={col} opacity={0.16} />
              <circle cx={x} cy={y} r={6} fill={col} opacity={0.95} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ─── cover rendering, portrait ───────────────────────────────────────────────
const CoverEl: React.FC<{ c: Cover; ts: number }> = ({ c, ts }) => {
  const age = ts - c.tIn;
  switch (c.kind) {
    case 'chart': {
      if (c.ref === 'C1') return <C1V ts={ts} />;
      if (c.ref === 'H1') return <H1V ts={ts} />;
      if (c.ref === 'C2') return <C2V ts={ts} />;
      if (c.ref === 'C3') return <C3V ts={ts} />;
      return <FINV ts={ts} />;
    }
    case 'deck':
    case 'container': {
      const key = `${c.ref}:${c.state}`;
      const file = STATEFILE[key] ?? SLIDE[c.ref];
      const spot = SPOT[key];
      if (spot) {
        const prog = ip(ts, [c.tIn, c.tOut], [0, 1]);
        // a still never sits dead still (§7a): it either travels to its MOTION target or eases in
        const to = MOTION[key] ?? { rect: spot.rect, scale: spot.scale * 1.03 };
        const cur = lerpSpot(spot, to, prog);
        const packets = c.ref === 'c4-left' ? 'left' : c.ref === 'c4-right' ? 'right' : null;
        const cy = (cur.rect[1] + cur.rect[3]) / 2;
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
            <AbsoluteFill style={{ transform: spotTransform(cur), transformOrigin: 'center center' }}>
              <Img src={staticFile(file)} style={fill} />
              {packets ? <C4Packets state={packets} ts={ts} tIn={c.tIn} tOut={c.tOut} /> : null}
            </AbsoluteFill>
            {cur.scale > 1.06 ? (
              <AbsoluteFill style={{
                background: `radial-gradient(ellipse 78% 40% at 50% ${(100 * cy / CANVAS_H).toFixed(0)}%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)`,
              }} />
            ) : null}
          </AbsoluteFill>
        );
      }
      const pulse = c.ref === 'card-40bps-open' ? 1 + 0.012 * Math.max(0, 1 - Math.abs(ts - 9.50) / 0.6) : 1;
      return <Img src={staticFile(file)} style={{ ...fill, transform: `scale(${pulse})` }} />;
    }
    case 'still': {
      const z = c.ref === 'IMG-2' ? [1.02, 1.05] : [1.03, 1.09];
      const kb = ip(age, [0, c.tOut - c.tIn], z);
      return <Img src={staticFile(STILL[c.ref])} style={{ ...fill, transform: `scale(${kb})` }} />;
    }
    case 'vid': {
      const b = BROLL[c.ref];
      return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
          <OffthreadVideo src={staticFile(b.file)} startFrom={Math.round(b.off * FPS)} playbackRate={b.rate ?? 1} muted style={fill} />
        </AbsoluteFill>
      );
    }
    case 'receipt': {
      const r = RECEIPT[c.ref];
      if (r.video) return <OffthreadVideo src={staticFile(r.file)} muted style={fill} />;
      const dur = c.tOut - c.tIn;
      const z = r.zoom ? ip(age, [0, dur], r.zoom) : 1;
      const y = r.pos ? ip(age, [0, dur], r.pos) : 50;
      if (r.fit === 'card') {
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            <Img src={staticFile(r.file)} style={{ width: '100%', height: 'auto', transform: `scale(${z})` }} />
          </AbsoluteFill>
        );
      }
      const plate = () => (
        <Img src={staticFile(r.file)} style={{ ...fill, objectPosition: `center ${y}%`, transform: `scale(${z})` }} />
      );
      if (r.libMove) {
        const row = getTransition(r.libMove);
        const win = row ? framesForRow(row, FPS) : 0;
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
            <TransitionClip id={r.libMove} cutFrame={Math.round(win / 2)} outgoing={plate} incoming={plate} />
          </AbsoluteFill>
        );
      }
      return <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>{plate()}</AbsoluteFill>;
    }
  }
};

const coverEnvelope = (c: Cover, ts: number, nextIsLib: boolean, contiguous: boolean) => {
  const inD = c.ing === 'sw' ? 0.25 : 0.35;
  const opIn = c.ing === 'lib' || c.ing === 'cut' ? 1 : ip(ts, [c.tIn, c.tIn + inD], [0, 1]);
  const opOut = nextIsLib || contiguous ? 1 : ip(ts, [c.tOut - 0.25, c.tOut], [1, 0]);
  const scale = c.ing === 'x' ? ip(ts, [c.tIn, c.tIn + 0.35], [0.93, 1], ease) : 1;
  return { opacity: Math.min(opIn, opOut), scale };
};
const handover = (c: Cover) => {
  const nextIsLib = LIBCUTS.some((L) => Math.abs(L.at - c.tOut) < 0.01);
  const next = COVERS.find((x: Cover) => x.tIn >= c.tOut - 0.01);
  const contiguous = !nextIsLib && !!next && next.tIn - c.tOut < 0.05 && next.ing !== 'cut';
  return { nextIsLib, contiguous, tail: contiguous ? Math.round(0.35 * FPS) : 0 };
};

const CoverWrap: React.FC<{ c: Cover; nextIsLib: boolean; contiguous: boolean }> = ({ c, nextIsLib, contiguous }) => {
  const ts = unsh(React.useContext(AbsFrameCtx) / FPS);
  const env = coverEnvelope(c, ts, nextIsLib, contiguous);
  return (
    <AbsoluteFill style={{ opacity: env.opacity, transform: `scale(${env.scale})` }}>
      <CoverEl c={c} ts={ts} />
      {LINE_CAPTION.ref === c.ref && (
        <div style={{
          position: 'absolute', left: 64, right: 64, bottom: 470,
          fontFamily: `${MONT},'Arial Black',sans-serif`, fontWeight: 900,
          fontSize: 68, lineHeight: 1.06, color: '#fff', textTransform: 'uppercase',
          WebkitTextStroke: '11px #000', paintOrder: 'stroke fill' as any,
          textShadow: '0 8px 34px rgba(0,0,0,0.9)',
          opacity: ip(ts, [c.tIn + 0.15, c.tIn + 0.5, c.tOut - 0.35, c.tOut - 0.1], [0, 1, 1, 0]),
          transform: `translateY(${ip(ts, [c.tIn + 0.15, c.tIn + 0.6], [26, 0], ease)}px)`,
        }}>
          {LINE_CAPTION.text}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── spine, transitions, cards, captions, overlays (portrait) ────────────────
const SpineAt: React.FC = () => {
  const abs = React.useContext(AbsFrameCtx);
  const local = useCurrentFrame();
  return <OffthreadVideo src={staticFile('spine.mp4')} startFrom={abs - local} muted style={fill} />;
};

const LiveCover: React.FC<{ c: Cover }> = ({ c }) => {
  const abs = React.useContext(AbsFrameCtx);
  const ts = Math.min(Math.max(unsh(abs / FPS), c.tIn), c.tOut - 0.01);
  return <CoverEl c={c} ts={ts} />;
};

const LibCutClip: React.FC<{ cut: (typeof LIBCUTS)[number] }> = ({ cut }) => {
  const row = getTransition(cut.id);
  if (!row) return null;
  const win = framesForRow(row, FPS);
  const p = row.params as { cut?: number; opacityPeak?: number };
  const swapFrac = p?.cut ?? p?.opacityPeak ?? 0.5;
  const start = F(cut.at) - Math.round(win * swapFrac);
  const before = COVERS.filter((c: Cover) => c.tOut <= cut.at + 0.01).slice(-1)[0];
  const after = COVERS.find((c: Cover) => c.tIn >= cut.at - 0.01);
  const nodeFor = (side: 'from' | 'to') => {
    if (cut[side] === 'face') return () => <SpineAt />;
    const c = side === 'from' ? before : after;
    if (!c) return () => <AbsoluteFill style={{ backgroundColor: '#0a0c10' }} />;
    const frozen = c.kind === 'vid' ? CUTFRAME[c.ref] : undefined;
    if (frozen) return () => <Img src={staticFile(frozen)} style={fill} />;
    return () => <LiveCover c={c} />;
  };
  return (
    <Sequence from={start} durationInFrames={win + 12} layout="none">
      <TransitionClip id={cut.id} cutFrame={Math.round(win / 2)} outgoing={nodeFor('from')} incoming={nodeFor('to')} />
    </Sequence>
  );
};

const CubeCard: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const f = useCurrentFrame();
  const rot = ip(f, [0, CARD_TURN], [90, 0], Easing.out(Easing.cubic));
  const dep = ip(f, [0, CARD_TURN], [420, 0], Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ perspective: 1500 }}>
      <AbsoluteFill style={{
        transform: `translateZ(${-dep}px) rotateY(${rot}deg)`, backgroundColor: '#0a0c10',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backfaceVisibility: 'hidden', padding: '0 70px',
      }}>
        <div style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%', filter: 'blur(150px)',
          background: '#00e68a', opacity: 0.16, left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        }} />
        <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 30, letterSpacing: '0.34em', color: '#505a6e', marginBottom: 34, zIndex: 1 }}>
          {eyebrow}
        </div>
        <div style={{
          fontFamily: MONT, fontWeight: 900, fontSize: 96, letterSpacing: '0.01em', color: '#e8eaf0',
          textAlign: 'center', lineHeight: 1.06, zIndex: 1, textShadow: '0 0 70px rgba(0,230,138,0.35)',
        }}>
          {title}
        </div>
        <div style={{ width: ip(f, [8, 26], [0, 420]), height: 6, marginTop: 44, zIndex: 1, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', borderRadius: 3 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const src = unsh(t);
  if (!CAPTION_SRC.some(([a, b]) => src >= a && src < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  let next = Infinity;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else { next = c.tf; break; } }
  if (!cur || t >= Math.min(next, cur.tf + 1.3)) return null;
  const age = frame - Math.round(cur.tf * FPS);
  const scale = ip(age, [0, 4, 9], [0.7, 1.12, 1], ease);
  return (
    <AbsoluteFill style={{ zIndex: 400, pointerEvents: 'none' }}>
      {/* seated above the phone's own UI furniture, not hard against the bottom edge */}
      <div style={{ position: 'absolute', bottom: 560, left: 50, right: 50, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: `${MONT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 84,
          color: '#fff', textTransform: 'lowercase', textAlign: 'center', lineHeight: 1.06,
          WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any, transform: `scale(${scale})`,
        }}>
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LightLeak: React.FC<{ a: number; b: number; ts: number }> = ({ a, b, ts }) => {
  if (ts < a || ts > b) return null;
  const p = (ts - a) / (b - a);
  const op = Math.sin(Math.PI * p) * 0.3;
  const drift = ip(p, [0, 1], [-14, 16]);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: op, pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 55% at ${60 + drift}% ${28 + drift * 0.5}%, rgba(255,178,92,0.85) 0%, rgba(255,120,40,0.34) 38%, rgba(0,0,0,0) 72%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at ${22 - drift * 0.5}% ${74 - drift * 0.35}%, rgba(255,214,150,0.5) 0%, rgba(0,0,0,0) 66%)` }} />
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{ ts: number }> = ({ ts }) => {
  if (ts < LT_LINK.tIn || ts > LT_LINK.tOut) return null;
  const op = ip(ts, [LT_LINK.tIn, LT_LINK.tIn + 0.35, LT_LINK.tOut - 0.4, LT_LINK.tOut], [0, 1, 1, 0]);
  const dx = ip(ts, [LT_LINK.tIn, LT_LINK.tIn + 0.5], [-60, 0], ease);
  return (
    <AbsoluteFill style={{ zIndex: 380, pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', left: 60, right: 60, bottom: 760, transform: `translateX(${dx}px)`,
        display: 'flex', background: 'rgba(10,12,16,0.88)', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      }}>
        <div style={{ width: 10, background: 'linear-gradient(180deg,#00e68a,#00c2ff)' }} />
        <div style={{ padding: '22px 28px' }}>
          <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 46, letterSpacing: '0.05em', color: '#e8eaf0', textTransform: 'uppercase', lineHeight: 1.05 }}>
            {LT_LINK.text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── composition ─────────────────────────────────────────────────────────────
export const Kaspa40Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const tp = frame / FPS;
  const ts = unsh(tp);
  const sc = spineScale(ts);
  const inPause = CARDS.some((c) => tp >= cardStart(c.t) && tp < cardStart(c.t) + PAUSE);

  return (
    <AbsFrameCtx.Provider value={frame}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {/* 1 — spine. `cover` at 1080x1920 crops to the CENTRE, which is exactly where the face sits
               (measured ~46-50% across every FACE window) and it drops the raw master's 82px
               pillarbox for free, so no width correction is needed here. */}
        <AbsoluteFill style={{ transform: `scale(${sc})`, overflow: 'hidden' }}>
          <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
          <Sequence from={0} durationInFrames={F(4.70)} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile('vid/F1-higgsfield-bg-swap.mp4')} startFrom={12} muted style={fill} />
            </AbsoluteFill>
          </Sequence>
        </AbsoluteFill>

        {/* 2 — light leaks, under all cover */}
        {LEAKS.map(([a, b], i) => <LightLeak key={i} a={a} b={b} ts={ts} />)}

        {/* 3 — the COVER track */}
        {COVERS.map((c: Cover, i: number) => {
          const { nextIsLib, contiguous, tail } = handover(c);
          const dur = F(c.tOut) - F(c.tIn) + tail;
          if (dur <= 0) return null;
          return (
            <Sequence key={i} from={F(c.tIn)} durationInFrames={dur} layout="none">
              <CoverWrap c={c} nextIsLib={nextIsLib} contiguous={contiguous} />
            </Sequence>
          );
        })}

        {/* 4 — library transitions */}
        {LIBCUTS.map((cut, i) => <LibCutClip key={i} cut={cut} />)}

        {/* 5 — chapter cards inside the baked pause */}
        {CARDS.map((c, i) => (
          <Sequence key={i} from={Math.round((cardStart(c.t) - c.lead) * FPS)} durationInFrames={Math.round((c.lead + PAUSE) * FPS)} layout="none">
            <CubeCard title={c.title} eyebrow={c.eyebrow} />
          </Sequence>
        ))}

        <LowerThird ts={ts} />
        {!inPause && <Captions />}
      </AbsoluteFill>
    </AbsFrameCtx.Provider>
  );
};
