// KaspaVprogsVerticalLadder.tsx: the c3-ladder Type 1 ANIMATED chart, PORTRAIT re-layout (1080x1920) for
// KaspaVprogsVertical (CH3, 139.84-160.34 source s). Built to
// media/kaspa-vprogs/assets/vertical/charts/c3-ladder.vertical.spec.md + c3-ladder.html (geometry reused EXACTLY:
// rails x=110/250 · dashed y 420..860 · solid y 860..1580 · progress rail grows up from 1580 · rung centres
// CRESCENDO 1490 · YELLOW PAPER 1300 · TOCCATA 1100 · SILVERSCRIPT 900 · NEXT 740 · FULL vPROGS 610 · DAGKNIGHT 480 ·
// labels x=300 w=708, name line top = rung-28, date line top = rung-82, legend beside the headline at 660/196).
// Content, copy, cue times and easing are byte-identical to the 16:9 chart (same LADDER_CUES, imported from it).
// The five vertical c3-ladder-*.png are the design SPEC, never comp inputs (charts.md §3, comp-build §7).
// It reads ONE absolute clock (`frame` = the composition frame, passed in by the comp) and never
// useCurrentFrame(), so it stays correct when the SPIN engine re-mounts it inside nested Sequences (§6a).
// Only opacity / transform animate; every label is a fixed-position div laid out once (charts.md §6 jitter rule).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { LADDER_CUES } from './KaspaVprogsLadder';

const PLAYFAIR = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const DMSANS = loadDM('normal', { weights: ['500', '600', '700'], subsets: ['latin'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] }).fontFamily;

const C = {
  bg: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', purple: '#a855f7',
  text: '#e8eaf0', text2: '#8892a4', muted: '#505a6e',
};

// portrait geometry (vertical spec)
const Y = { cr: 1490, yp: 1300, to: 1100, ss: 900, next: 740, full: 610, dag: 480, base: 1580 };
const RL = 110, RR = 250, LX = 300, LW = 708;

const eo = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const prog = (f: number, a: number, n: number, ease = eo) => interpolate(f, [a, a + n], [0, 1], { ...clamp, easing: ease });

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const tagBase: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 100, fontWeight: 700, fontSize: 22, letterSpacing: '.12em',
  whiteSpace: 'nowrap', border: '2px solid', fontFamily: DMSANS, display: 'inline-block', lineHeight: 1.3,
};
const TAG = {
  g: { color: C.green, borderColor: 'rgba(0,230,138,.8)', background: 'rgba(0,230,138,.12)' },
  live: { color: '#0a0c10', background: C.green, borderColor: C.green },
  m: { color: C.text2, borderColor: '#3a4254', background: 'rgba(255,255,255,.02)' },
  mdk: { color: C.muted, borderColor: '#2c3342', background: 'rgba(255,255,255,.02)' },
  gold: { color: C.gold, borderColor: 'rgba(255,215,0,.6)', background: 'rgba(255,215,0,.08)' },
};
const nameStyle: React.CSSProperties = { fontWeight: 700, fontSize: 38, letterSpacing: '.05em', color: C.text, whiteSpace: 'nowrap', fontFamily: DMSANS };
const l1: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 18, height: 56 };
const l2: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8, fontWeight: 500, fontSize: 27, color: C.text2 };
const lab = (y: number): React.CSSProperties => ({ position: 'absolute', zIndex: 2, left: LX, top: y - 28, width: LW });

/** A shipped rung + its date line above the name, landing at frame a (bar grows L->R 8f, date fades + slides 20px 10f). */
const ShipRung: React.FC<{ y: number; date: string; f: number; a: number }> = ({ y, date, f, a }) => {
  const g = prog(f, a, 8);
  const d = prog(f, a, 10);
  return (
    <>
      <div style={{
        position: 'absolute', zIndex: 2, left: RL, top: y - 6, width: RR - RL, height: 12, borderRadius: 6,
        background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, boxShadow: '0 0 22px rgba(0,230,138,.55)',
        transformOrigin: 'left center', transform: `scaleX(${g})`, opacity: g > 0 ? 1 : 0,
      }} />
      <div style={{
        position: 'absolute', zIndex: 2, left: LX, top: y - 82, fontFamily: MONO, fontWeight: 600, fontSize: 32,
        lineHeight: '40px', color: C.green, opacity: d, transform: `translateX(${(1 - d) * -20}px)`,
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

export const KaspaVprogsVerticalLadder: React.FC<{ frame: number; F: (t: number) => number }> = ({ frame, F }) => {
  const f = frame;
  const K = LADDER_CUES;
  const legs: [number, number, number][] = [
    [F(K.crRung), Y.base, Y.cr], [F(K.ypAll), Y.cr, Y.yp], [F(K.toRung), Y.yp, Y.to], [F(K.ssRung), Y.to, Y.ss],
  ];
  let railTop = Y.base;
  for (const [a, y0, y1] of legs) if (f >= a) railTop = y0 + (y1 - y0) * prog(f, a, 8);
  const railOn = f >= F(K.crRung);
  const la = F(K.toLive);
  const glow = interpolate(f, [la, la + 9, la + 18], [26, 44, 26], clamp);
  // payoff drift 1.00 -> 1.03 toward the rungs (origin 180px 1100px = the ladder), 158.60 -> 160.34 linear
  const drift = interpolate(f, [F(K.ssName), F(K.out)], [1, 1.03], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden', color: C.text, fontFamily: DMSANS }}>
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: '180px 1100px' }}>
        {/* orbs: radial-gradient discs standing in for the HTML's blur(120px) circles (no per-frame filter cost) */}
        <div style={{ position: 'absolute', left: 140 - 550, top: 1460 - 550, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,138,.16) 0%, rgba(0,230,138,.07) 32%, rgba(0,230,138,0) 62%)' }} />
        <div style={{ position: 'absolute', left: 1020 - 460, top: 80 - 460, width: 920, height: 920, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,.16) 0%, rgba(168,85,247,.07) 32%, rgba(168,85,247,0) 62%)' }} />

        {/* header */}
        <div style={{ position: 'absolute', left: 72, right: 72, top: 130, zIndex: 2 }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '.18em', color: C.muted, marginBottom: 22, lineHeight: 1.3 }}>WHERE IT STANDS</div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 108, lineHeight: 1.05, letterSpacing: '-.02em', color: C.text }}>
            The <span style={{ color: C.green }}>ladder</span>
          </div>
          <div style={{ width: 76, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, marginTop: 32 }} />
        </div>

        {/* legend beside the headline */}
        <div style={{ position: 'absolute', left: 660, top: 196, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontWeight: 600, fontSize: 25, letterSpacing: '.14em', color: C.text2 }}>
            <i style={{ display: 'block', width: 64, height: 10, borderRadius: 5, background: C.green, boxShadow: '0 0 14px rgba(0,230,138,.6)' }} />SHIPPED
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontWeight: 600, fontSize: 25, letterSpacing: '.14em', color: C.text2 }}>
            <i style={{ display: 'block', width: 64, height: 12, borderRadius: 5, border: '2px dashed #4a5366', boxSizing: 'border-box' }} />NOT YET
          </div>
        </div>

        {/* rails + progress rail */}
        <svg style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, zIndex: 1, overflow: 'visible' }} viewBox="0 0 1080 1920">
          <line x1={RL} y1="420" x2={RL} y2="860" stroke="#3a4254" strokeWidth="5" strokeDasharray="14 12" />
          <line x1={RR} y1="420" x2={RR} y2="860" stroke="#3a4254" strokeWidth="5" strokeDasharray="14 12" />
          <line x1={RL} y1="860" x2={RL} y2={Y.base} stroke="#2a3142" strokeWidth="6" />
          <line x1={RR} y1="860" x2={RR} y2={Y.base} stroke="#2a3142" strokeWidth="6" />
          {railOn && (
            <g style={{ filter: 'drop-shadow(0 0 8px rgba(0,230,138,.7))' }}>
              <line x1={RL} y1={railTop} x2={RL} y2={Y.base} stroke={C.green} strokeWidth="6" />
              <line x1={RR} y1={railTop} x2={RR} y2={Y.base} stroke={C.green} strokeWidth="6" />
            </g>
          )}
        </svg>

        {/* future rungs (always visible, dim, dashed; they never animate here) */}
        {[Y.dag, Y.full, Y.next].map((y) => (
          <div key={y} style={{ position: 'absolute', zIndex: 2, left: RL, top: y - 7, width: RR - RL, height: 14, border: '2px dashed #3d4557', borderRadius: 6, boxSizing: 'border-box' }} />
        ))}
        <div style={lab(Y.dag)}>
          <div style={l1}>
            <span style={{ ...nameStyle, fontSize: 34, color: C.muted }}>DAGKNIGHT</span>
            <span style={{ ...tagBase, ...TAG.mdk }}>PROPOSED · KIP-2</span>
          </div>
        </div>
        <div style={lab(Y.full)}>
          <div style={l1}>
            <span style={{ ...nameStyle, fontSize: 34, color: C.text2 }}>FULL vPROGS</span>
            <span style={{ ...tagBase, ...TAG.m }}>IN CONSTRUCTION</span>
          </div>
        </div>
        <div style={lab(Y.next)}>
          <div style={l1}>
            <span style={{ ...tagBase, ...TAG.m }}>NEXT</span>
            <span style={{ ...nameStyle, fontSize: 34, color: C.text2 }}>standalone based ZK apps</span>
          </div>
        </div>

        {/* CRESCENDO: rung 140.70 · name 142.74 · '10 BLOCKS / SEC' 143.64 */}
        <ShipRung y={Y.cr} date="2025-05-05" f={f} a={F(K.crRung)} />
        <div style={lab(Y.cr)}>
          <div style={l1}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.crName)) }}>CRESCENDO</span>
            <span style={{ ...tagBase, ...TAG.g, ...pop(f, F(K.crTag)) }}>10 BLOCKS / SEC</span>
          </div>
        </div>

        {/* YELLOW PAPER: rung + rail + date + name together 144.92 · 'DRAFT v0.0.1' 146.96 */}
        <ShipRung y={Y.yp} date="2025-09-11" f={f} a={F(K.ypAll)} />
        <div style={lab(Y.yp)}>
          <div style={l1}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.ypAll)) }}>vPROGS YELLOW PAPER</span>
            <span style={{ ...tagBase, ...TAG.gold, ...pop(f, F(K.ypTag)) }}>DRAFT v0.0.1</span>
          </div>
        </div>

        {/* TOCCATA: rung 147.46 · name 149.52 · ZK 150.54 · LIVE 153.02 · inside 154.54 */}
        <ShipRung y={Y.to} date="2026-06-30" f={f} a={F(K.toRung)} />
        <div style={lab(Y.to)}>
          <div style={l1}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.toName)) }}>TOCCATA</span>
            <span style={{ ...tagBase, ...TAG.live, boxShadow: `0 0 ${glow}px rgba(0,230,138,.6)`, ...pop(f, la) }}>LIVE ON MAINNET</span>
          </div>
          <div style={l2}>
            <span style={fadeUp(f, F(K.toZk))}>ZK verify + covenants</span>
            <span style={fadeUp(f, F(K.toIn))}>·&nbsp; inside Kaspa consensus</span>
          </div>
        </div>

        {/* SILVERSCRIPT: rung 156.28 · 'SILVERSCRIPT 1.0' + 'smart contract language' 158.60 (PAYOFF) */}
        <ShipRung y={Y.ss} date="2026-09-09" f={f} a={F(K.ssRung)} />
        <div style={lab(Y.ss)}>
          <div style={l1}>
            <span style={{ ...nameStyle, ...slideIn(f, F(K.ssName)) }}>SILVERSCRIPT 1.0</span>
          </div>
          <div style={l2}>
            <span style={fadeUp(f, F(K.ssName))}>smart contract language</span>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 72, right: 72, bottom: 196, zIndex: 2, fontFamily: MONO, fontSize: 21, lineHeight: 1.5, color: C.muted }}>
          Sources: KIP-14 · kaspanet/research (yellow paper) · docs.kaspa.org/toccata · silverscript v1.0.0 · kaspa.org/build · KIP-2
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.03, backgroundImage: NOISE, pointerEvents: 'none', zIndex: 9 }} />
    </AbsoluteFill>
  );
};
