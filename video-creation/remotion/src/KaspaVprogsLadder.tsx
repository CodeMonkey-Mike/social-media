// KaspaVprogsLadder.tsx: the c3-ladder Type 1 ANIMATED chart for kaspa-vprogs (CH3, 139.84-160.34 source s).
// Built to media/kaspa-vprogs/assets/charts/c3-ladder.spec.md + c3-ladder.html (geometry reused EXACTLY:
// rails x=890/1030, rung centers CRESCENDO 925 · YELLOW PAPER 795 · TOCCATA 650 · SILVERSCRIPT 500 ·
// NEXT 365 · FULL vPROGS 245 · DAGKNIGHT 125, dates right-aligned to x=850, labels at x=1080).
// The five c3-ladder-*.png are the design SPEC, never comp inputs (charts.md §3, comp-build §7).
// It reads ONE absolute clock (`frame` = the composition frame, passed in by the comp) and never
// useCurrentFrame(), so it stays correct when the SPIN engine re-mounts it inside nested Sequences (§6a).
// Only opacity / transform animate; every label is a fixed-position div laid out once (charts.md §6 jitter rule).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const PLAYFAIR = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const DMSANS = loadDM('normal', { weights: ['500', '600', '700'], subsets: ['latin'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] }).fontFamily;

const C = {
  bg: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', purple: '#a855f7',
  text: '#e8eaf0', text2: '#8892a4', muted: '#505a6e',
};

// ── choreography (SOURCE-spine seconds = word onsets, spec table; the comp maps them through F()) ──
export const LADDER_CUES = {
  in: 139.84,
  crRung: 140.70, crName: 142.74, crTag: 143.64,
  ypAll: 144.92, ypTag: 146.96,
  toRung: 147.46, toName: 149.52, toZk: 150.54, toLive: 153.02, toIn: 154.54,
  ssRung: 156.28, ssName: 158.60,
  out: 160.34,
} as const;

const Y = { cr: 925, yp: 795, to: 650, ss: 500, next: 365, full: 245, dag: 125, base: 985 };

const eo = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** 0..1 progress of an n-frame move starting at frame a */
const prog = (f: number, a: number, n: number, ease = eo) => interpolate(f, [a, a + n], [0, 1], { ...clamp, easing: ease });

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const tagBase: React.CSSProperties = {
  padding: '7px 16px', borderRadius: 100, fontWeight: 700, fontSize: 20, letterSpacing: '.12em',
  whiteSpace: 'nowrap', border: '2px solid', fontFamily: DMSANS, display: 'inline-block',
};
const TAG = {
  g: { color: C.green, borderColor: 'rgba(0,230,138,.8)', background: 'rgba(0,230,138,.12)' },
  live: { color: '#0a0c10', background: C.green, borderColor: C.green },
  m: { color: C.text2, borderColor: '#3a4254', background: 'rgba(255,255,255,.02)' },
  mdk: { color: C.muted, borderColor: '#2c3342', background: 'rgba(255,255,255,.02)' },
  gold: { color: C.gold, borderColor: 'rgba(255,215,0,.6)', background: 'rgba(255,215,0,.08)' },
};

const nameStyle: React.CSSProperties = { fontWeight: 700, fontSize: 38, letterSpacing: '.07em', color: C.text, whiteSpace: 'nowrap', fontFamily: DMSANS };

/** A shipped rung + its date, landing at frame a (bar grows L->R 8f, date fades + slides 20px 10f). */
const ShipRung: React.FC<{ y: number; date: string; f: number; a: number }> = ({ y, date, f, a }) => {
  const g = prog(f, a, 8);
  const d = prog(f, a, 10);
  return (
    <>
      <div style={{
        position: 'absolute', zIndex: 2, left: 890, top: y - 6, width: 140, height: 12, borderRadius: 6,
        background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, boxShadow: '0 0 22px rgba(0,230,138,.55)',
        transformOrigin: 'left center', transform: `scaleX(${g})`, opacity: g > 0 ? 1 : 0,
      }} />
      <div style={{
        position: 'absolute', zIndex: 2, left: 560, top: y - 20, width: 290, textAlign: 'right',
        fontFamily: MONO, fontWeight: 600, fontSize: 30, color: C.green, lineHeight: 1.2,
        opacity: d, transform: `translateX(${(1 - d) * -20}px)`,
      }}>{date}</div>
    </>
  );
};

const slideIn = (f: number, a: number): React.CSSProperties => {
  const p = prog(f, a, 10);
  return { opacity: p, transform: `translateX(${(1 - p) * 24}px)`, display: 'inline-block' };
};
const pop = (f: number, a: number): React.CSSProperties => {
  const p = prog(f, a, 8);
  return { opacity: p, transform: `scale(${0.9 + 0.1 * p})` };
};
const fadeUp = (f: number, a: number): React.CSSProperties => {
  const p = prog(f, a, 10);
  return { opacity: p, transform: `translateY(${(1 - p) * 8}px)`, display: 'inline-block' };
};

export const KaspaVprogsLadder: React.FC<{ frame: number; F: (t: number) => number }> = ({ frame, F }) => {
  const f = frame;
  const K = LADDER_CUES;
  // progress rail top: 985 -> latest landed rung, each leg drawn over 8f
  const legs: [number, number, number][] = [
    [F(K.crRung), Y.base, Y.cr], [F(K.ypAll), Y.cr, Y.yp], [F(K.toRung), Y.yp, Y.to], [F(K.ssRung), Y.to, Y.ss],
  ];
  let railTop = Y.base;
  for (const [a, y0, y1] of legs) if (f >= a) railTop = y0 + (y1 - y0) * prog(f, a, 8);
  const railOn = f >= F(K.crRung);
  // LIVE pill: pop + one glow pulse 26 -> 44 -> 26 px over 18f
  const la = F(K.toLive);
  const glow = interpolate(f, [la, la + 9, la + 18], [26, 44, 26], clamp);
  // payoff drift 1.00 -> 1.03 toward the rungs, 158.60 -> 160.34 (linear), then held
  const drift = interpolate(f, [F(K.ssName), F(K.out)], [1, 1.03], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden', color: C.text, fontFamily: DMSANS }}>
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: '960px 700px' }}>
        {/* orbs (radial gradients = the HTML's blur(120px) discs, no per-frame filter cost) */}
        <div style={{ position: 'absolute', left: 640 - 240, top: 720 - 240, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,138,.16) 0%, rgba(0,230,138,.07) 32%, rgba(0,230,138,0) 62%)' }} />
        <div style={{ position: 'absolute', left: 1600 - 200, top: -200 - 200, width: 920, height: 920, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,.16) 0%, rgba(168,85,247,.07) 32%, rgba(168,85,247,0) 62%)' }} />

        {/* header */}
        <div style={{ position: 'absolute', left: 120, top: 76, zIndex: 2 }}>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: '.18em', color: C.muted, marginBottom: 22 }}>WHERE IT STANDS</div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 84, lineHeight: 1.07, letterSpacing: '-.02em', color: C.text }}>
            The <span style={{ color: C.green }}>ladder</span>
          </div>
          <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, marginTop: 28 }} />
        </div>

        {/* legend */}
        <div style={{ position: 'absolute', left: 120, top: 404, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontWeight: 600, fontSize: 22, letterSpacing: '.14em', color: C.text2 }}>
            <i style={{ display: 'block', width: 64, height: 10, borderRadius: 5, background: C.green, boxShadow: '0 0 14px rgba(0,230,138,.6)' }} />SHIPPED
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontWeight: 600, fontSize: 22, letterSpacing: '.14em', color: C.text2 }}>
            <i style={{ display: 'block', width: 64, height: 12, borderRadius: 5, border: '2px dashed #4a5366', boxSizing: 'border-box' }} />NOT YET
          </div>
        </div>

        {/* rails + progress rail */}
        <svg style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, zIndex: 1, overflow: 'visible' }} viewBox="0 0 1920 1080">
          <line x1="890" y1="70" x2="890" y2="440" stroke="#3a4254" strokeWidth="5" strokeDasharray="14 12" />
          <line x1="1030" y1="70" x2="1030" y2="440" stroke="#3a4254" strokeWidth="5" strokeDasharray="14 12" />
          <line x1="890" y1="440" x2="890" y2="985" stroke="#2a3142" strokeWidth="6" />
          <line x1="1030" y1="440" x2="1030" y2="985" stroke="#2a3142" strokeWidth="6" />
          {railOn && (
            <g style={{ filter: 'drop-shadow(0 0 8px rgba(0,230,138,.7))' }}>
              <line x1="890" y1={railTop} x2="890" y2="985" stroke={C.green} strokeWidth="6" />
              <line x1="1030" y1={railTop} x2="1030" y2="985" stroke={C.green} strokeWidth="6" />
            </g>
          )}
        </svg>

        {/* future rungs (always visible, dim, dashed; they never animate here) */}
        {[Y.dag, Y.full, Y.next].map((y) => (
          <div key={y} style={{ position: 'absolute', zIndex: 2, left: 890, top: y - 7, width: 140, height: 14, border: '2px dashed #3d4557', borderRadius: 6, boxSizing: 'border-box' }} />
        ))}
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 100, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, fontSize: 32, color: C.muted }}>DAGKNIGHT</span>
            <span style={{ ...tagBase, ...TAG.mdk }}>PROPOSED · KIP-2</span>
          </div>
        </div>
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 220, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, fontSize: 32, color: C.text2 }}>FULL vPROGS</span>
            <span style={{ ...tagBase, ...TAG.m }}>IN CONSTRUCTION</span>
          </div>
        </div>
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 340, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...tagBase, ...TAG.m }}>NEXT</span>
            <span style={{ ...nameStyle, fontSize: 32, color: C.text2 }}>standalone based ZK apps</span>
          </div>
        </div>

        {/* CRESCENDO: rung 140.70 · name 142.74 · '10 BLOCKS / SEC' 143.64 */}
        <ShipRung y={Y.cr} date="2025-05-05" f={f} a={F(K.crRung)} />
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 900, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.crName)) }}>CRESCENDO</span>
            <span style={{ ...tagBase, ...TAG.g, ...pop(f, F(K.crTag)) }}>10 BLOCKS / SEC</span>
          </div>
        </div>

        {/* YELLOW PAPER: rung + rail + date + name together 144.92 · 'DRAFT v0.0.1' 146.96 */}
        <ShipRung y={Y.yp} date="2025-09-11" f={f} a={F(K.ypAll)} />
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 770, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.ypAll)) }}>vPROGS YELLOW PAPER</span>
            <span style={{ ...tagBase, ...TAG.gold, ...pop(f, F(K.ypTag)) }}>DRAFT v0.0.1</span>
          </div>
        </div>

        {/* TOCCATA: rung 147.46 · name 149.52 · ZK 150.54 · LIVE 153.02 · inside 154.54 */}
        <ShipRung y={Y.to} date="2026-06-30" f={f} a={F(K.toRung)} />
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 606, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.toName)) }}>TOCCATA</span>
            <span style={{ ...tagBase, ...TAG.live, boxShadow: `0 0 ${glow}px rgba(0,230,138,.6)`, ...pop(f, la) }}>LIVE ON MAINNET</span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontWeight: 500, fontSize: 24, color: C.text2 }}>
            <span style={fadeUp(f, F(K.toZk))}>ZK verify + covenants</span>
            <span style={fadeUp(f, F(K.toIn))}>·&nbsp; inside Kaspa consensus</span>
          </div>
        </div>

        {/* SILVERSCRIPT: rung 156.28 · 'SILVERSCRIPT 1.0' + 'smart contract language' 158.60 (PAYOFF) */}
        <ShipRung y={Y.ss} date="2026-09-09" f={f} a={F(K.ssRung)} />
        <div style={{ position: 'absolute', zIndex: 2, left: 1080, top: 456, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.ssName)) }}>SILVERSCRIPT 1.0</span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontWeight: 500, fontSize: 24, color: C.text2 }}>
            <span style={fadeUp(f, F(K.ssName))}>smart contract language</span>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 120, bottom: 38, zIndex: 2, fontFamily: MONO, fontSize: 19, color: C.muted }}>
          Sources: KIP-14 · kaspanet/research (yellow paper) · docs.kaspa.org/toccata · silverscript v1.0.0 · kaspa.org/build · KIP-2
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.03, backgroundImage: NOISE, pointerEvents: 'none', zIndex: 9 }} />
    </AbsoluteFill>
  );
};
