import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition, framesForRow } from './transitions';
import { COVERS, FACE, CARDS, CAPTION_SRC, type Cover } from './ethereumData';
import { ECAPTIONS } from './ethereumCaptions';

const { fontFamily: MONT } = loadFont();

/* ────────────────────────────────────────────────────────────────────────────
   TIMING MODEL  (comp-build.md §2 — EVERY time value routes through sh()/F())

   The paused spine = the desilenced spine with a card-pause freeze baked in at
   each chapter card. Both constants below are MEASURED off the built file, not
   assumed: blackdetect on assets/spine.mp4 was regressed against the source
   cover spans, and PAUSE=30f scored a mean boundary error of 0.77 frames vs
   1.01f at 31f and 2.76f at 32f. The residual is a flat +1 frame after the
   first pause (one frame of concat A/V padding, NOT accumulating drift), so it
   is folded in as PAD rather than left to smear.
   ──────────────────────────────────────────────────────────────────────────── */
export const FPS = 30;
const SPINE_FRAMES = 12504;               // source spine, counted (not container duration)
const PAUSE = 30 / FPS;                   // 1.001s baked freeze per card
const PAD = 1 / FPS;                      // measured concat padding, applies after pause #1
const CARD_T = [48.782067, 129.863067, 200.2];   // silence troughs: -87.1 / -83.4 / -112.8 dB

const nPauses = (t: number) => CARD_T.filter((c) => c <= t).length;
export const sh = (t: number) => {
  const n = nPauses(t);
  return t + PAUSE * n + (n > 0 ? PAD : 0);
};
export const F = (t: number) => Math.round(sh(t) * FPS);
/** a card's own scene start (the pause it rides is not yet counted) */
const cardStart = (b: number) => {
  const n = CARD_T.filter((c) => c < b).length;
  return b + PAUSE * n + (n > 0 ? PAD : 0);
};
/* Card pauses are BAKED into assets/spine.mp4. Declared here (not only in ethereumData)
   because lint-pause-silence reads INSERTS from the comp file itself and does not follow
   imports. Each `at` must sit in a real silence trough on the SOURCE spine. */
export const INSERTS = [
  { at: 48.782067, dur: 1.001 },
  { at: 129.863067, dur: 1.001 },
  { at: 200.2, dur: 1.001 },
];

export const DUR = 12616;  // spine is 29.97fps; at comp fps=30 its 12600 frames span 420.42s,
                           // so DUR must cover 420.528s * 30 or the final words are clipped.

/* Absolute-clock context — comp-build §6a trap 2: any node handed to a
   transition engine is re-mounted inside nested Sequences, so it must read one
   absolute frame, never useCurrentFrame(). */
const AbsFrame = createContext(0);
const useAbs = () => useContext(AbsFrame);

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const fitW = { width: '100%', height: 'auto', objectFit: 'cover' } as const;

/* ── palette (locked stylesheet) ─────────────────────────────────────────── */
const GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700', RED = '#ff4060', BG = '#0a0c10';

/* ────────────────────────────────────────────────────────────────────────────
   FACE / SPINE
   Face re-frames: 11 MEASURED anchors, alternating IN/OUT (TRANSITIONS.md §3).
   FACE 6's seven land on real desilence joins; the rest on measured speech gaps.
   ──────────────────────────────────────────────────────────────────────────── */
type Reframe = { t: number; to: number };
const REFRAMES: Reframe[] = [
  { t: 3.14, to: 1.15 },     // FACE 1 IN
  { t: 108.88, to: 1.0 },    // FACE 3 OUT (opens 1.12)
  { t: 280.4, to: 1.15 },    // FACE 5 IN
  { t: 315.04, to: 1.15 },   // FACE 6 ×7, snapped to desilence joins
  { t: 326.24, to: 1.0 },
  { t: 346.9, to: 1.15 },
  { t: 354.18, to: 1.0 },
  { t: 359.24, to: 1.15 },
  { t: 376.48, to: 1.0 },
  { t: 383.36, to: 1.15 },
  { t: 410.38, to: 1.0 },    // FACE 7 OUT (opens 1.12)
];
/** windows that OPEN pushed-in so their re-frame can pull OUT */
const OPENS_TIGHT = new Set([2, 6]); // FACE 3 and FACE 7 (0-indexed)

const spineScale = (tSrc: number) => {
  const idx = FACE.findIndex(([a, b]) => tSrc >= a && tSrc < b);
  if (idx < 0) return 1;
  const base = OPENS_TIGHT.has(idx) ? 1.12 : 1.0;
  const inWin = REFRAMES.filter((r) => r.t >= FACE[idx][0] && r.t < FACE[idx][1]);
  let s = base;
  for (const r of inWin) {
    if (tSrc >= r.t) s = r.to;
  }
  // 6-frame ease into each re-frame so the snap reads as a cut, not a slide
  const active = inWin.filter((r) => tSrc >= r.t - 0.2 && tSrc < r.t);
  if (active.length) {
    const r = active[active.length - 1];
    const prev = s;
    return interpolate(tSrc, [r.t - 0.2, r.t], [prev, r.to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  }
  return s;
};

const Spine: React.FC = () => {
  const abs = useAbs();
  const local = useCurrentFrame();
  // source time from the ABSOLUTE frame, un-shifted back through the pauses
  const tPaused = abs / FPS;
  let tSrc = tPaused;
  for (let i = CARD_T.length - 1; i >= 0; i--) {
    if (tPaused >= sh(CARD_T[i])) { tSrc = tPaused - PAUSE * (i + 1) - PAD; break; }
  }
  const s = spineScale(tSrc);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <OffthreadVideo
        src={staticFile('spine.mp4')}
        startFrom={abs - local}
        style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 42%' }}
      />
    </AbsoluteFill>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   ANIMATED CHARTS (comp-build §7 / charts.md — code-driven, never a held PNG).
   Design + exact values come from assets/charts/*.html; the motion is here.
   Each takes `p` = 0..1 progress across its own cover window.
   ──────────────────────────────────────────────────────────────────────────── */
const ease = (p: number) => Easing.out(Easing.cubic)(Math.min(1, Math.max(0, p)));
const countUp = (p: number, to: number, dp = 1) => (to * ease(p)).toFixed(dp);

const ChartFrame: React.FC<{ eyebrow: string; title: string; children: React.ReactNode; source: string }> = ({ eyebrow, title, children, source }) => (
  <AbsoluteFill style={{ backgroundColor: BG, padding: '54px 110px', fontFamily: MONT }}>
    <div style={{ color: '#505a6e', fontSize: 26, letterSpacing: 6, fontWeight: 700 }}>{eyebrow}</div>
    <div style={{ color: '#fff', fontSize: 66, fontWeight: 900, marginTop: 10, lineHeight: 1.08 }}>{title}</div>
    <div style={{ flex: 1, position: 'relative', marginTop: 26 }}>{children}</div>
    <div style={{ color: '#3d4657', fontSize: 20, letterSpacing: 1 }}>{source}</div>
  </AbsoluteFill>
);

/** C1 — RWA growth $5B -> $37.5B, axis domain $0-$40B (rescaled after the R1 conflict) */
const C1: React.FC<{ p: number }> = ({ p }) => {
  const draw = interpolate(p, [0.02, 0.72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const val = 5 + (37.55 - 5) * ease(draw);
  const W = 1560, H = 470, y = (v: number) => H - (v / 40) * (H - 60);
  const x = (u: number) => 40 + u * (W - 120);
  const pts = Array.from({ length: 60 }, (_, i) => i / 59).filter((u) => u <= draw)
    .map((u) => `${x(u)},${y(5 + (37.55 - 5) * Math.pow(u, 1.7))}`).join(' ');
  return (
    <ChartFrame eyebrow="TOKENIZED REAL WORLD ASSETS" title="From nothing to thirty seven billion" source="rwa.xyz, read live 2026-07-31 · The Block · Yellow.com">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
        {[0, 10, 20, 30, 40].map((g) => (
          <g key={g}>
            <line x1={40} x2={W - 80} y1={y(g)} y2={y(g)} stroke="#1b2130" strokeWidth={2} />
            <text x={0} y={y(g) + 8} fill="#505a6e" fontSize={22} fontFamily="JetBrains Mono, monospace">${g}B</text>
          </g>
        ))}
        {pts && <polyline points={pts} fill="none" stroke={GREEN} strokeWidth={6} strokeLinecap="round" />}
        {draw > 0.02 && <circle cx={x(draw)} cy={y(5 + (37.55 - 5) * Math.pow(draw, 1.7))} r={11} fill={GREEN} />}
        <text x={40} y={y(5) - 18} fill={CYAN} fontSize={24} fontFamily="JetBrains Mono, monospace">~$5B JAN 2025</text>
      </svg>
      <div style={{ position: 'absolute', right: 0, top: 0, textAlign: 'right' }}>
        <div style={{ color: GREEN, fontSize: 74, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace' }}>${val.toFixed(1)}B{draw >= 1 ? '+' : ''}</div>
        <div style={{ color: '#505a6e', fontSize: 22, letterSpacing: 3 }}>JUL 2026 · TOTAL ONCHAIN</div>
      </div>
      {p > 0.74 && (
        <div style={{ position: 'absolute', left: 0, bottom: 6, background: 'rgba(0,230,138,.12)', border: `2px solid ${GREEN}`, color: GREEN, padding: '10px 22px', borderRadius: 40, fontSize: 30, fontWeight: 900, transform: `scale(${interpolate(p, [0.74, 0.8], [0.92, 1], { extrapolateRight: 'clamp' })})` }}>
          MORE THAN +400%
        </div>
      )}
    </ChartFrame>
  );
};

/** C2 — dominance donut. state A unlabeled ("one chain"), state B revealed. */
const C2: React.FC<{ p: number; revealed: boolean }> = ({ p, revealed }) => {
  const sweep = revealed ? 1 : interpolate(p, [0.05, 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pct = 61 * ease(sweep);
  const R = 165, C = 2 * Math.PI * R;
  return (
    <ChartFrame eyebrow="SHARE OF ALL ONCHAIN RWA VALUE" title={revealed ? 'One chain holds the majority' : 'More than sixty percent sits on one chain'} source="KuCoin · Yahoo Finance · Cryptic — 61-65% range, low end plotted">
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 90 }}>
        <svg width={420} height={420} viewBox="-210 -210 420 420">
          <circle r={R} fill="none" stroke="#161c28" strokeWidth={54} />
          <circle r={R} fill="none" stroke={GREEN} strokeWidth={54} strokeDasharray={`${(C * pct) / 100} ${C}`} transform="rotate(-90)" strokeLinecap="butt" />
          <text textAnchor="middle" y={16} fill="#fff" fontSize={62} fontWeight={900} fontFamily="JetBrains Mono, monospace">{pct.toFixed(0)}%</text>
        </svg>
        <div>
          <div style={{ color: revealed ? GREEN : '#fff', fontSize: 58, fontWeight: 900, letterSpacing: 2 }}>{revealed ? 'ETHEREUM' : 'ONE CHAIN'}</div>
          <div style={{ color: '#505a6e', fontSize: 26, marginTop: 8 }}>TOTAL ONCHAIN · OVER $37B</div>
          {revealed && p > 0.14 && <div style={{ color: '#6a7488', fontSize: 30, marginTop: 26 }}>not the fastest</div>}
          {revealed && p > 0.3 && <div style={{ color: '#6a7488', fontSize: 30, marginTop: 6 }}>not the cheapest</div>}
        </div>
      </div>
    </ChartFrame>
  );
};

/** generic staged count-up card row (C3 momentum, C6, C7, C8, C4) */
const StatRow: React.FC<{ p: number; at: number; label: string; value: string; sub?: string; color?: string }> = ({ p, at, label, value, sub, color = GREEN }) => {
  if (p < at) return null;
  const l = interpolate(p, [at, at + 0.06], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: l, transform: `translateY(${(1 - l) * 14}px)`, marginBottom: 26 }}>
      <div style={{ color: '#505a6e', fontSize: 24, letterSpacing: 3 }}>{label}</div>
      <div style={{ color, fontSize: 78, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.05 }}>{value}</div>
      {sub && <div style={{ color: '#6a7488', fontSize: 26 }}>{sub}</div>}
    </div>
  );
};

const C3: React.FC<{ p: number }> = ({ p }) => (
  <ChartFrame eyebrow="ROBINHOOD CHAIN · SINCE JULY 1 2026" title="Three weeks of a brand new chain" source="on-chain data, week ending Jul 20 2026">
    <div style={{ display: 'flex', gap: 70 }}>
      <StatRow p={p} at={0.03} label="TESTNET, FIRST WEEK" value={`${countUp(interpolate(p, [0.03, 0.12], [0, 1], { extrapolateRight: 'clamp' }), 4, 0)}M`} sub="transactions" color="#CCFF00" />
      <StatRow p={p} at={0.38} label="VALUE PARKED ON THE CHAIN" value={`$${countUp(interpolate(p, [0.38, 0.5], [0, 1], { extrapolateRight: 'clamp' }), 257.4, 1)}M`} sub="total value locked" color="#CCFF00" />
      <StatRow p={p} at={0.8} label="DEX VOLUME, ONE WEEK" value={`$${countUp(interpolate(p, [0.8, 0.92], [0, 1], { extrapolateRight: 'clamp' }), 4.5, 1)}B`} sub="seven days" color="#CCFF00" />
    </div>
  </ChartFrame>
);

const Bar: React.FC<{ p: number; at: number; frac: number; color: string; label: string; value: string }> = ({ p, at, frac, color, label, value }) => {
  const g = interpolate(p, [at, at + 0.18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b94a8', fontSize: 26, marginBottom: 8 }}>
        <span>{label}</span><span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 900 }}>{value}</span>
      </div>
      <div style={{ height: 46, background: '#141a26', borderRadius: 6 }}>
        <div style={{ height: '100%', width: `${frac * 100 * ease(g)}%`, background: color, borderRadius: 6 }} />
      </div>
    </div>
  );
};

const C6: React.FC<{ p: number }> = ({ p }) => (
  <ChartFrame eyebrow="BLACKROCK BUIDL · WHERE IT LIVES" title="The largest single-chain slice" source="Securitize · gncrypto.news — other-chain split not disclosed, shown combined">
    <Bar p={p} at={0.30} frac={1.1 / 2.9} color={GREEN} label="ETHEREUM" value="~$1.1B" />
    <Bar p={p} at={0.42} frac={1.8 / 2.9} color={CYAN} label="7 OTHER CHAINS COMBINED" value="~$1.8B" />
    <div style={{ position: 'absolute', right: 0, top: 0, color: '#fff', fontSize: 54, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace' }}>
      ${countUp(interpolate(p, [0.02, 0.14], [0, 1], { extrapolateRight: 'clamp' }), 2.9, 1)}B
    </div>
  </ChartFrame>
);

const C7: React.FC<{ p: number }> = ({ p }) => (
  <ChartFrame eyebrow="WHAT THE MARKET IS ACTUALLY MADE OF" title="Four fifths of it is Treasuries and cash" source="Yellow.com — treasury + cash-equivalent concentration">
    <Bar p={p} at={0.05} frac={0.8} color={GOLD} label="TREASURIES + CASH-TYPE" value={`${countUp(interpolate(p, [0.05, 0.25], [0, 1], { extrapolateRight: 'clamp' }), 80, 0)}%`} />
    <Bar p={p} at={0.3} frac={0.2} color="#3d4657" label="EVERYTHING ELSE" value="20%" />
    {p > 0.5 && <div style={{ marginTop: 20, display: 'inline-block', border: `2px solid ${GOLD}`, color: GOLD, padding: '10px 22px', borderRadius: 40, fontSize: 30, fontWeight: 900 }}>INSTITUTIONAL MONEY</div>}
  </ChartFrame>
);

const C8: React.FC<{ p: number }> = ({ p }) => (
  <ChartFrame eyebrow="SCOPE: TOKENIZED EQUITIES TRADING VOLUME ONLY. NOT TOTAL RWA VALUE." title="Solana owns tokenized stock trading" source="The Coin Republic · gncrypto · SpotedCrypto — June 2026 volume">
    <Bar p={p} at={0.05} frac={0.956} color="#8d4acd" label="SOLANA" value="$3.31B · 95%" />
    <Bar p={p} at={0.30} frac={0.024} color={CYAN} label="BASE" value="$81M" />
    <Bar p={p} at={0.40} frac={0.018} color={CYAN} label="BNB CHAIN" value="$59.6M" />
    <Bar p={p} at={0.50} frac={0.001} color={GREEN} label="ETHEREUM" value="$2M" />
  </ChartFrame>
);

const C4: React.FC<{ p: number; recap?: boolean }> = ({ p, recap }) => (
  <ChartFrame eyebrow="ETH CIRCULATING SUPPLY" title={recap ? 'Locked up. Or held.' : 'A third of it is not for sale'} source="ainvest · coinpaper — measured separately against the same supply. Staked and corporate-held ETH can overlap, so they are NOT summed here.">
    <Bar p={p} at={0.03} frac={0.2891} color={GREEN} label="STAKED" value={`${countUp(interpolate(p, [0.03, 0.15], [0, 1], { extrapolateRight: 'clamp' }), 28.91, 2)}%`} />
    <Bar p={p} at={0.55} frac={0.0659} color={CYAN} label="CORPORATE TREASURIES" value={`${countUp(interpolate(p, [0.55, 0.68], [0, 1], { extrapolateRight: 'clamp' }), 6.59, 2)}%`} />
    {!recap && p > 0.32 && p < 0.6 && (
      <div style={{ marginTop: 12, color: '#8b94a8', fontSize: 30 }}>
        the line in is about <span style={{ color: GREEN, fontWeight: 900 }}>10x</span> the line out
      </div>
    )}
  </ChartFrame>
);


/* FACE 1 background swap — Higgsfield Seedance v2v over the raw green screen.
   Mike picked backdrop A (node lattice) 2026-07-31. Source clip carries a 0.40s head
   handle (clip t=0.40 == spine t=0.00), so startFrom skips 12 comp frames.
   If Mike rejects the regenerated face, delete this one Sequence and FACE 1 airs as recorded. */
const F1Swap: React.FC = () => {
  const abs = useAbs();
  const local = useCurrentFrame();
  /* The re-frame zoom lives on the SPINE layer, but FACE 1 does not air from the spine — it
     airs from this swap, which sat at a fixed scale. So FACE 1's 3.14s re-frame fired its
     glitch over a picture that never moved (Mike, 0:02: "glitch but there is no zoom in").
     FACE 1 is entirely before the first card pause, so comp time == source time here. */
  const s = spineScale(abs / FPS);
  return (
    <OffthreadVideo
      src={staticFile('vid/F1-higgsfield-bg-swap.mp4')}
      startFrom={12 + (abs - local)}
      muted
      style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 42%' }}
    />
  );
};

/* ── cover element dispatch ───────────────────────────────────────────────── */
const CHART: Record<string, React.FC<{ p: number }>> = {
  'C1': C1,
  'C2-A': (x) => <C2 {...x} revealed={false} />,
  'C2-B': (x) => <C2 {...x} revealed />,
  'C3': C3, 'C6': C6, 'C7': C7, 'C8': C8, 'C4': C4,
};

/** Type 2 stills must never sit dead still (comp-build §7a): gentle push. */
const StillPush: React.FC<{ src: string; p: number; amt?: number }> = ({ src, p, amt = 0.04 }) => (
  <Img src={src} style={{ ...fill, transform: `scale(${1 + amt * p})` }} />
);

const CoverEl: React.FC<{ c: Cover; p: number }> = ({ c, p }) => {
  // c.ref is the FULL resolved path (generator existence-checks every one).
  // Never rebuild the folder from kind/sub — that is what broke CH5.
  switch (c.sub) {
    case 'chart': {
      const Cmp = CHART[c.id.replace(/-s\d$/, '')] ?? CHART[c.id];
      return Cmp ? <Cmp p={p} /> : <StillPush src={staticFile(c.ref)} p={p} amt={0.03} />;
    }
    case 'vid':
      return <OffthreadVideo src={staticFile(c.ref)} muted style={fill} />;
    case 'receipt':
      // Aspect-aware (comp-build §4). A capture TALLER than 16:9 gets the documented slow
      // vertical pan, never a static top-crop that hides its bottom. A wide/short capture is
      // centred, not top-aligned, so it does not read as a thin band on black.
      {
        const fx = RECEIPT_FX[c.ref];
        const node = () => <Receipt refPath={c.ref} p={p} />;
        return fx ? <MotionFX id={fx} dur={Math.max(2, Math.round((c.tOut - c.tIn) * FPS))} node={node} /> : node();
      }
    case 'still':
      // ingress badsignal is a CUT transition, fired by FxLayer at c.tIn — not an overlay here
      return <StillPush src={staticFile(c.ref)} p={p} amt={0.05} />;
    default:
      // diagram / card / title — a Type 2 still must never sit dead still (comp-build §7a)
      return <StillPush src={staticFile(c.ref)} p={p} amt={c.sub === 'diagram' ? 0.04 : 0.02} />;
  }
};


const RECEIPT_AR: Record<string, number> = {
  'receipts/R1-rwaxyz.png': 3350 / 1560,
  'receipts/R2-buidl.png': 3840 / 1500,
  'receipts/R3-theblock.png': 1290 / 640,
  'receipts/R4-rh-launch.png': 3840 / 2300,
  'receipts/R5-bitmine.png': 2300 / 1748,
  'receipts/R6-etf-flows.png': 3840 / 1914,
  'receipts/R7-vitalik.png': 2100 / 760,
};
const FRAME_AR = 16 / 9;
const Receipt: React.FC<{ refPath: string; p: number }> = ({ refPath, p }) => {
  const ar = RECEIPT_AR[refPath] ?? FRAME_AR;
  if (ar < FRAME_AR) {
    // TALLER than the frame -> fill width and PAN down it, so the viewer reads the page.
    const pan = interpolate(p, [0.08, 0.92], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (
      <AbsoluteFill style={{ backgroundColor: BG }}>
        <Img src={staticFile(refPath)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${pan}%` }} />
      </AbsoluteFill>
    );
  }
  // WIDER than the frame -> fit width, CENTRED, gentle push.
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
      <Img src={staticFile(refPath)} style={{ width: '100%', height: 'auto', transform: `scale(${1 + 0.05 * p})` }} />
    </AbsoluteFill>
  );
};


/* ────────────────────────────────────────────────────────────────────────────
   TWO DISTINCT LAYERS (broll-and-containers.md §2 — do NOT collapse them):

   1. MotionFX = a SINGLE-IMAGE motion effect. The SAME asset on both sides of
      the engine, running for the ENTIRE time the asset is on screen. Nothing is
      revealed; the frame itself moves. This is the receipt "pan" look.
      TransitionClip cannot do this: it hardcodes its window to row.durationSeconds.
      The Engine takes durationInFrames as a prop, so we drive it directly.
   2. TransitionClip = a CUT transition between two DIFFERENT assets, ~0.4-0.9s.
   ──────────────────────────────────────────────────────────────────────────── */
const MotionFX: React.FC<{ id: string; dur: number; node: () => React.ReactNode }> = ({ id, dur, node }) => {
  const row = getTransition(id);
  if (!row) return <AbsoluteFill>{node()}</AbsoluteFill>;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  return (
    <AbsoluteFill>
      <Engine from={node()} to={node()} outClip={node} inClip={node}
        durationInFrames={dur} params={row.params} />
    </AbsoluteFill>
  );
};

/** per-receipt single-image move (TRANSITIONS.md §3b) */
const RECEIPT_FX: Record<string, string> = {
  'receipts/R1-rwaxyz.png': 'perspective-ease-in-short-up',
  'receipts/R5-bitmine.png': 'perspective-pan-3d-down',
  'receipts/R6-etf-flows.png': 'perspective-ease-in-left',
  'receipts/R3-theblock.png': 'zoom-ease-short-in',
  'receipts/R7-vitalik.png': 'zoom-simple-short-in',
  'receipts/R4-rh-launch.png': 'zoom-ease-in',
};
/** AI stills glitch on ingress (§2) */
const STILL_FX: Record<string, string> = {
  'img/I1-stampede.png': 'badsignal-short-1',
  'img/I3-real-assets.png': 'badsignal-max-1',
};
/** the six reserved marquees: cut transitions at cover boundaries (§4) */
const MARQUEE: { t: number; id: string }[] = [
  { t: 144.78, id: 'spin-3d-side-ease-right' },
  { t: 192.60, id: 'melt-rgb-1' },
  { t: 202.96, id: 'spin-3d-side-ease-short-right' },
  { t: 246.54, id: 'melt-rgb-2' },
  { t: 253.40, id: 'melt-rgb-3' },
  { t: 266.60, id: 'melt-rgb-2' },
];
/** face cut in/out — Blocks family, the per-video pick (§3) */
const FACE_GLITCH = ['blocks-max-1', 'blocks-max-2', 'blocks-max-3'];
const FACE_EDGES: number[] = [8.44, 107.54, 111.88, 142.74, 279.18, 286.12, 306.27, 391.19, 409.04];
const SHORT_EDGES: number[] = [29.96, 30.73];   // FACE 2 is 0.77s: strips tier only
/** strips glitch on each measured jump-cut re-frame */
const REFRAME_TS = REFRAMES.map((r) => r.t);



/* ────────────────────────────────────────────────────────────────────────────
   TRANSITION LAYER — done the documented way (comp-build §6a).
   TransitionClip gets the REAL outgoing + incoming nodes, and a Sequence of
   EXACTLY the engine window so its clean-head/tail copies never paint a stale
   frame over the live cover track. Outside the window the cover track is the
   single source of truth.
   Passing blank scenes here renders BLACK, not transparent — that was the v6 bug.
   ──────────────────────────────────────────────────────────────────────────── */
const coverAt = (t: number): Cover | null =>
  COVERS.find((c) => t >= c.tIn && t < c.tOut) ?? null;

const nodeAt = (t: number, eps: number): (() => React.ReactNode) => {
  const c = coverAt(t + eps);
  if (!c) return () => <SpineStill tSrc={t + eps} />;
  const p = Math.min(1, Math.max(0, (t + eps - c.tIn) / Math.max(0.01, c.tOut - c.tIn)));
  return () => <CoverEl c={c} p={p} />;
};

/** a still of the spine at a source time — used when one side of a cut is the face.
    MUST be a real FREEZE: `startFrom` only sets the ENTRY point, the video then ADVANCES
    with the frame. On a face-OUT that walks straight off the end of the FACE window into
    the cover-blackout region, so the outgoing face turned BLACK one frame into the
    transition (v7: all 6 face-outs — 8.44 / 30.73 / 111.88 / 144.78 / 286.12 / 391.19).
    <Freeze> pins the child's frame, which is what "Still" always meant. */
const SpineStill: React.FC<{ tSrc: number }> = ({ tSrc }) => {
  /* Inside FACE 1 the SPINE is the raw green screen — what actually airs there is the
     F1Swap backdrop. Pulling spine.mp4 would pop the node lattice back to green screen
     for the length of the 8.44 face-out, so match the layer that is really on screen
     (same 0.40s head handle: clip frame = 12 + comp frame). */
  const f = Math.round(sh(tSrc) * FPS);
  const swapped = f < F(8.44);
  /* Freeze the RE-FRAME ZOOM too, not just the picture. The live face layer is scaled by
     spineScale; an unscaled still snapped the frame back to 1.0 the instant a transition
     took over (visible 15% zoom-out at 0:08, and again at 4:46 / 6:31 / the 1:48 + 6:49
     face-ins). It also flattened the re-frame snaps: both sides of a re-frame glitch showed
     the SAME scale, so the glitch fired over a zoom that never happened. */
  const s = spineScale(tSrc);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Freeze frame={swapped ? 12 + f : f}>
        {/* MUTED is load-bearing, not tidiness: this node is mounted TWICE by every
            TransitionClip (outgoing + incoming, 0.1s apart) on top of the live Spine, so an
            unmuted copy plays the VO again a few ms late. Mike heard it as "right" twice at
            5:30 and a doubled "but" at 5:49 — both sit exactly on re-frame anchors. */}
        <OffthreadVideo src={staticFile(swapped ? 'vid/F1-higgsfield-bg-swap.mp4' : 'spine.mp4')} muted
          style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 42%' }} />
      </Freeze>
    </AbsoluteFill>
  );
};

const FX: { t: number; id: string }[] = [
  ...MARQUEE,
  ...FACE_EDGES.map((t, i) => ({ t, id: FACE_GLITCH[i % FACE_GLITCH.length] })),
  ...REFRAME_TS.map((t, i) => ({ t, id: i % 2 === 0 ? 'blocks-strips-1x' : 'blocks-strips-2x' })),
  /* NO AI-still ingress glitch. TRANSITIONS.md §2 planned badsignal on I1 (100.88) and I3
     (395.00) and STILL_FX still holds that mapping, but Mike ruled it OUT (2026-08-01, on
     v8 @1:42): the glitch kit is for the in-face zoom snaps, not for cutting to an image.
     STILL_FX is kept as the record of the superseded plan — do not re-wire it. */
];

/* ── FACE 2 (0:30) — plain silent CROSS-FADE, per-video exception ──────────────
   Mike, 2026-08-01 on v8: the strips glitch on this 0.77s window read as a "pop" at both
   its edges, and the glitch kit belongs to the in-face zoom snaps. These two edges (and
   ONLY these two) become a traditional cross-fade; the other 7 face edges keep Blocks, so
   house rule #3 still governs everywhere else. A hand-rolled fade carries no SFX, which is
   what removes the pop. */
// TRANSITIONS_WAIVED: blocks-strips-3x — Mike 2026-08-01 replaced FACE 2's two strips hits
//   with this silent cross-fade (the glitch SFX popped on a 0.77s window). (end waivers)
const XFADE_TS: number[] = SHORT_EDGES;      // [29.96, 30.73]
const XFADE_FRAMES = 12;                     // 0.4s

/** the face side of a cross-fade: LIVE spine while the face is still on screen, a frozen
    still once cover-blackout has already taken the spine (there is no face left to fade). */
const xfNode = (t: number, eps: number): (() => React.ReactNode) => {
  const tt = t + eps;
  if (!FACE.some(([a, b]) => tt >= a && tt < b)) return nodeAt(t, eps);
  return eps > 0 ? () => <Spine /> : () => <SpineStill tSrc={tt} />;
};

const XFade: React.FC<{ out: () => React.ReactNode; inc: () => React.ReactNode; dur: number }> = ({ out, inc, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <AbsoluteFill>{out()}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: o }}>{inc()}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const FxLayer: React.FC = () => (
  <>
    {FX.map((x, i) => {
      const row = getTransition(x.id);
      if (!row) return null;
      const win = framesForRow(row, FPS);
      const from = Math.max(0, F(x.t) - Math.round(win / 2));
      return (
        <Sequence key={`fx${i}`} from={from} durationInFrames={win} name={`fx ${x.id} @${x.t}`}>
          <TransitionClip id={x.id} cutFrame={Math.round(win / 2)}
            outgoing={nodeAt(x.t, -0.05)} incoming={nodeAt(x.t, 0.05)} />
        </Sequence>
      );
    })}
    {XFADE_TS.map((t, i) => {
      const from = Math.max(0, F(t) - Math.round(XFADE_FRAMES / 2));
      return (
        <Sequence key={`xf${i}`} from={from} durationInFrames={XFADE_FRAMES} name={`xfade @${t}`}>
          <XFade out={xfNode(t, -0.05)} inc={xfNode(t, 0.05)} dur={XFADE_FRAMES} />
        </Sequence>
      );
    })}
  </>
);

/* ── chapter card: hand-rolled 3D cube turn (comp-build §6 — @remotion/transitions
      ships NO cube; TRANSITIONS.md said rmn:cube, corrected here to hand:cube-3d) ── */
const CubeCard: React.FC<{ title: string; local: number }> = ({ title, local }) => {
  const rot = interpolate(local, [0, 11], [90, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      <AbsoluteFill style={{ backgroundColor: BG, transform: `rotateY(${rot}deg)`, transformOrigin: '50% 50%', justifyContent: 'center', alignItems: 'center', fontFamily: MONT }}>
        <div style={{ color: GREEN, fontSize: 30, letterSpacing: 10, fontWeight: 700, marginBottom: 18 }}>ETHEREUM &amp; RWA</div>
        <div style={{ color: '#fff', fontSize: 128, fontWeight: 900, letterSpacing: 2 }}>{title}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── captions: CH1 ONLY, incl. its covers (Mike 2026-07-31, deliberate exception) ── */
const CAP_WINDOWS = CAPTION_SRC;
const CAPS = ECAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const t = useAbs() / FPS;
  const tSrc = t;
  if (!CAP_WINDOWS.some(([a, b]) => tSrc >= sh(a) && tSrc < sh(b))) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const next = CAPS.find((c) => c.tf > cur!.tf);
  if (t >= Math.min(next ? next.tf : Infinity, cur.tf + 1.3)) return null;
  const age = t - cur.tf;
  const pop = interpolate(age, [0, 0.09, 0.17], [0.7, 1.12, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96 }}>
      <div style={{
        fontFamily: `${MONT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 92,
        color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000',
        paintOrder: 'stroke fill', transform: `scale(${pop})`, textAlign: 'center', lineHeight: 1.05,
      }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

/* ── face-cut glitch overlay (Blocks family, the per-video pick) ───────────── */
const FACE_CUTS = FACE.flatMap(([a, b], i) => (i === 0 ? [b] : [a, b])).filter((t) => t < 417.3);

/* ────────────────────────────────────────────────────────────────────────────
   COMP
   ──────────────────────────────────────────────────────────────────────────── */
export const EthereumRwa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <Spine />

        {/* FACE 1 background swap (0 -> 8.44s source) */}
        <Sequence from={0} durationInFrames={F(8.44)} name="F1 bg-swap">
          <F1Swap />
        </Sequence>

        {/* COVER layer — 44 cues, exact partition (verified: no gaps/overlaps/FACE collisions) */}
        {COVERS.map((c, i) => {
          const from = F(c.tIn), to = F(c.tOut);
          return (
            <Sequence key={c.id} from={from} durationInFrames={Math.max(1, to - from)} name={`${c.id} ${c.sub}`}>
              <CoverInner c={c} from={from} to={to} />
            </Sequence>
          );
        })}

        {/* chapter cards — scene leads IN before the pause so the title reads >=1s */}
        {CARDS.map((cd) => {
          const start = Math.round((cardStart(cd.t) - 0.5) * FPS);
          const len = Math.round((0.5 + PAUSE) * FPS);
          return (
            <Sequence key={cd.text} from={start} durationInFrames={len} name={`CARD ${cd.text}`}>
              <CardInner title={cd.text} start={start} />
            </Sequence>
          );
        })}


        {/* MARQUEE melt/spin at the six reserved diagram beats */}


        {/* strips glitch ON each jump-cut re-frame (the glitch IS the cut) */}

        <FxLayer />

        <Captions />
      </AbsoluteFill>
    </AbsFrame.Provider>
  );
};

const CoverInner: React.FC<{ c: Cover; from: number; to: number }> = ({ c, from, to }) => {
  const abs = useAbs();
  const p = Math.min(1, Math.max(0, (abs - from) / Math.max(1, to - from)));
  const fadeIn = interpolate(abs - from, [0, c.sub === 'vid' ? 15 : 10], [0, 1], { extrapolateRight: 'clamp' });
  const scaleIn = c.sub === 'vid' ? 1 : interpolate(abs - from, [0, 10], [0.93, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: fadeIn, transform: `scale(${scaleIn})` }}>
      <CoverEl c={c} p={p} />
    </AbsoluteFill>
  );
};

const CardInner: React.FC<{ title: string; start: number }> = ({ title, start }) => {
  const abs = useAbs();
  return <CubeCard title={title} local={abs - start} />;
};

export default EthereumRwa;
