import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

/**
 * kaspa 30bps VERTICAL — CHARTS H1 / C2 / C3 / FIN, portrait (1080x1920) layouts.
 *
 * This is a REFRAME of the finished 16:9 `Kaspa40Charts.tsx`, not a re-edit:
 * identical data, identical wording, identical palette/fonts, and every beat time
 * byte-identical (H1 20.90/29.82 · FIN 217.36/223.34 · C2 326.32 + 328.50/331.60/
 * 334.20/337.60/345.80 · C3 347.32/357.80/363.50/369.20).
 *
 * What changes is layout only:
 *   H1  — same centred column, type scaled for 1080 width, "Up to" stacked over the
 *         numeral so the 1.44x slam punch never leaves the frame; gold stamp centred-top.
 *   C2  — the wide "label | lane | count" row is RESTACKED: name + interval on the left of a
 *         header line, count on its right, and the cadence lane running the FULL width beneath.
 *   C3  — same restack: rate + sub above, bar full width beneath. The DEMONSTRATED marker
 *         hangs BELOW the 10 BPS bar (in the 16:9 it hangs above, where the label now lives).
 *   FIN — already stacked; bars go full width, type up, chip stays beside its row label.
 *
 * Contract: <H1V ts={sourceSeconds} /> — ts is ABSOLUTE e-spine SOURCE seconds.
 * Full-frame 1080x1920 AbsoluteFill, no <Sequence> inside, all motion from `ts` alone.
 */

const PF = loadPlayfair('normal', {
  weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
}).fontFamily;
const DM = loadDMSans('normal', {
  weights: ['400', '500', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
}).fontFamily;
const JB = loadJetBrains('normal', {
  weights: ['600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
}).fontFamily;

// ─── palette (identical to the 16:9 / the locked chart HTML) ──────────────────
const BG = '#0a0c10';
const CARD = '#12151c';
const GREEN = '#00e68a';
const CYAN = '#00c2ff';
const GOLD = '#ffd700';
const TEXT = '#e8eaf0';
const TEXT2 = '#8892a4';
const MUTED = '#505a6e';
const BORDER = '#1e2330';

const NOISE =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

const OUT = Easing.out(Easing.cubic);
const OUT5 = Easing.out(Easing.poly(5));
const INOUT = Easing.inOut(Easing.cubic);

// portrait gutter — every chart body runs 60 → 1020 (960 px of usable width)
const PAD = 60;

const ip = (
  t: number,
  range: number[],
  out: number[],
  easing?: (n: number) => number,
) =>
  interpolate(t, range, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    ...(easing ? { easing } : {}),
  });

const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const hexTriple = (h: string) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a: string, b: string, t: number) => {
  const A = hexTriple(a);
  const B = hexTriple(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

// ─── shared frame chrome ──────────────────────────────────────────────────────
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden', color: TEXT }}>
    {children}
    <AbsoluteFill
      style={{ zIndex: 9, opacity: 0.03, backgroundImage: NOISE, pointerEvents: 'none' }}
    />
  </AbsoluteFill>
);

type OrbProps = {
  size: number; color: string; opacity: number; blur?: number;
  left?: number | string; right?: number; top?: number | string; bottom?: number;
  center?: boolean;
};
const Orb: React.FC<OrbProps> = ({ size, color, opacity, blur = 130, left, right, top, bottom, center }) => (
  <div
    style={{
      position: 'absolute',
      width: size, height: size, borderRadius: '50%',
      filter: `blur(${blur}px)`, opacity, background: color,
      pointerEvents: 'none', zIndex: 0,
      ...(left !== undefined ? { left } : {}),
      ...(right !== undefined ? { right } : {}),
      ...(top !== undefined ? { top } : {}),
      ...(bottom !== undefined ? { bottom } : {}),
      ...(center ? { transform: 'translate(-50%,-50%)' } : {}),
    }}
  />
);

// Header block shared by C2 / C3 / FIN — portrait: full-gutter width so the
// headline wraps to two lines instead of running off a 1080 px frame.
const ChartHeader: React.FC<{
  eyebrow: string; children: React.ReactNode; op: number; dy: number; maxWidth?: number;
}> = ({ eyebrow, children, op, dy, maxWidth }) => (
  <div
    style={{
      position: 'absolute', left: PAD, right: PAD, top: 96, zIndex: 2,
      opacity: op, transform: `translateY(${dy}px)`,
    }}
  >
    <div
      style={{
        fontFamily: DM, fontSize: 30, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '.18em', color: MUTED, marginBottom: 20,
      }}
    >
      {eyebrow}
    </div>
    <h1
      style={{
        margin: 0, fontFamily: PF, fontWeight: 900, fontSize: 76,
        lineHeight: 1.08, letterSpacing: '-.02em',
        ...(maxWidth ? { maxWidth } : {}),
      }}
    >
      {children}
    </h1>
  </div>
);

const Foot: React.FC<{ children: React.ReactNode; op: number }> = ({ children, op }) => (
  <div
    style={{
      position: 'absolute', left: PAD, right: PAD, bottom: 74, fontFamily: DM, fontSize: 26,
      lineHeight: 1.4, color: MUTED, zIndex: 1, opacity: op,
    }}
  >
    {children}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// H1 — hook counter. Window 20.90 → 32.40. SLAM at 29.82.
// ═════════════════════════════════════════════════════════════════════════════
const H1_IN = 20.9;
const H1_SLAM = 29.82;
const H1_NUM = 470; // numeral size: "40" at 1.44x slam punch = 812 px, inside 1080

export const H1V: React.FC<{ ts: number }> = ({ ts }) => {
  const u = ts - H1_IN;
  const s = ts - H1_SLAM;
  const slam = s >= 0;

  // MELT arrival: reforms into life.
  const inOp = ip(u, [0, 0.42], [0, 1], OUT);
  const inBlur = ip(u, [0, 0.55], [26, 0], OUT);
  const inScale = ip(u, [0, 0.62], [1.09, 1], OUT);

  // live cadence: one block every 100 ms → the 10 dots fill and reset every second.
  const cyc = Math.max(0, u) % 1;
  const litIdx = Math.min(9, Math.floor(cyc * 10));
  const cycKick = ip(cyc, [0, 0.1], [1, 0]);

  // THE SLAM: hard, fast, forceful. No cross-fade.
  const slamScale = slam ? ip(s, [0, 0.09, 0.21], [1.44, 0.965, 1], OUT5) : 1;
  const flash = slam ? ip(s, [0, 0.045, 0.17], [0, 0.5, 0], OUT) : 0;
  const st = s - 0.1; // stamp punches in just behind the number

  const numScale = inScale * slamScale * (slam ? 1 : 1 + 0.006 * cycKick);
  const glowBlur = slam ? 110 + 70 * ip(s, [0, 0.28], [1, 0]) : 90 + 34 * cycKick;

  return (
    <Frame>
      <Orb
        size={760} color={CYAN} blur={150} left="50%" top="46%" center
        opacity={(slam ? ip(s, [0, 0.12], [0.17, 0]) : 0.17) * inOp}
      />
      <Orb
        size={820} color={GREEN} blur={150} left="50%" top="46%" center
        opacity={(slam ? ip(s, [0, 0.3], [0.05, 0.19]) : 0) * 1}
      />

      <div
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 1, textAlign: 'center',
          opacity: inOp, filter: `blur(${inBlur}px)`,
        }}
      >
        <div
          style={{
            fontFamily: DM, fontSize: 34, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '.22em', color: MUTED,
            opacity: slam ? ip(s, [0, 0.06, 0.2], [0, 0, 1]) : 1,
          }}
        >
          {slam ? 'The DAGKnight era' : 'Kaspa · live right now'}
        </div>

        <div
          style={{
            height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 26, position: 'relative',
          }}
        >
          {/* portrait: "Up to" is STACKED over the numeral (inline it would blow past
              1080 at the 1.44x punch), still inside the same slam-scaled group. */}
          <span
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', transform: `scale(${numScale})`,
            }}
          >
            {slam && (
              <span
                style={{
                  position: 'absolute', bottom: '100%', left: '50%', marginBottom: 12,
                  fontFamily: DM, fontWeight: 700, fontSize: 66, letterSpacing: '.18em',
                  color: TEXT2, textTransform: 'uppercase', whiteSpace: 'nowrap',
                  opacity: ip(s, [0.02, 0.26], [0, 1], OUT),
                  transform: `translateX(calc(-50% + ${ip(s, [0.02, 0.32], [-70, 0], OUT)}px))`,
                }}
              >
                Up to
              </span>
            )}
            <span
              style={{
                fontFamily: JB, fontWeight: 700, fontSize: H1_NUM, lineHeight: 0.95,
                letterSpacing: '-.02em', color: slam ? GREEN : TEXT,
                textShadow: slam
                  ? `0 0 ${glowBlur}px rgba(0,230,138,.4)`
                  : `0 0 ${glowBlur}px rgba(0,194,255,.35)`,
              }}
            >
              {slam ? '40' : '10'}
            </span>
          </span>
        </div>

        <div
          style={{
            fontFamily: DM, fontWeight: 700, fontSize: 72, letterSpacing: '.32em',
            textTransform: 'uppercase', color: TEXT, marginTop: 26, marginLeft: '.32em',
          }}
        >
          Blocks / Sec
        </div>

        {!slam && (
          <div style={{ display: 'flex', gap: 26, marginTop: 60, height: 26, alignItems: 'center' }}>
            {new Array(10).fill(0).map((_, i) => {
              const on = i <= litIdx;
              const fresh = i === litIdx ? 1 : 0;
              return (
                <span
                  key={i}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: on ? CYAN : 'rgba(0,194,255,.16)',
                    border: `2px solid ${on ? CYAN : 'rgba(0,194,255,.35)'}`,
                    boxShadow: on ? `0 0 ${26 + 18 * fresh}px rgba(0,194,255,.8)` : 'none',
                    transform: `scale(${1 + 0.16 * fresh})`,
                  }}
                />
              );
            })}
          </div>
        )}

        <div
          style={{
            fontFamily: JB, fontWeight: 600, fontSize: 38, color: TEXT2, marginTop: 52,
            opacity: slam ? ip(s, [0.06, 0.26], [0, 1]) : 1,
          }}
        >
          {slam ? "four times today's speed" : 'one block every 100 ms'}
        </div>
      </div>

      {st >= 0 && (
        <div
          style={{
            position: 'absolute', left: '54%', top: 236, zIndex: 2, whiteSpace: 'nowrap',
            transform: `translateX(-50%) rotate(${ip(st, [0, 0.28], [-21, -7], OUT)}deg) scale(${ip(
              st, [0, 0.16, 0.27], [2.35, 0.93, 1], OUT5,
            )})`,
            opacity: ip(st, [0, 0.08], [0, 1]),
            fontFamily: JB, fontWeight: 700, fontSize: 52, letterSpacing: '.1em', color: GOLD,
            border: `5px solid ${GOLD}`, borderRadius: 14, padding: '16px 34px',
            background: 'rgba(255,215,0,.07)', boxShadow: '0 0 50px rgba(255,215,0,.18)',
          }}
        >
          TARGET: 2026
        </div>
      )}

      {flash > 0 && (
        <AbsoluteFill
          style={{ background: 'rgba(0,230,138,.55)', opacity: flash, zIndex: 8, mixBlendMode: 'screen' }}
        />
      )}
    </Frame>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// FIN — finality drop. Window 217.36 → 227.77. COLLAPSE at 223.34.
// ═════════════════════════════════════════════════════════════════════════════
const FIN_IN = 217.36;
const FIN_COL = 223.34;
const FIN_END_PCT = 14.3; // row2 fill width in the locked design

export const FINV: React.FC<{ ts: number }> = ({ ts }) => {
  const u = ts - FIN_IN;
  const c = ts - FIN_COL;
  const collapse = c >= 0;

  const headOp = ip(u, [0, 0.35], [0, 1], OUT);
  const headDy = ip(u, [0, 0.45], [-26, 0], OUT);
  const rowsOp = ip(u, [0.1, 0.5], [0, 1]);

  // Today bar fills left → right to UNDER 7 SECONDS.
  const p1 = ip(u, [0.25, 1.15], [0, 1], OUT);
  const row1Dim = collapse ? ip(c, [0, 0.32], [1, 0.72]) : 1;

  // DAGKnight era: sweeps the full lane, then COLLAPSES in to under 1 second.
  const w2 = !collapse
    ? 0
    : c < 0.16
      ? ip(c, [0, 0.16], [0, 100], OUT)
      : ip(c, [0.16, 0.56, 0.72], [100, 12.4, FIN_END_PCT], INOUT);
  const fill2Op = collapse ? ip(c, [0, 0.05], [0, 1]) : 0;
  const val2Op = collapse ? ip(c, [0.26, 0.46], [0, 1]) : 0;
  // the label rides the collapsing bar's right edge, clamped so it never runs off
  // frame (52% of the 960 px portrait lane keeps "UNDER 1 SECOND" fully inside)
  const val2X = Math.min(w2, 52);
  const impact = collapse ? ip(c, [0.56, 0.6, 0.7], [0, 0.2, 0], OUT) : 0;
  const chip = c - 0.6;

  const axisOp = ip(u, [0.5, 0.95], [0, 1]);

  const barStyle: React.CSSProperties = {
    height: 175, borderRadius: 20, background: CARD, border: `1px solid ${BORDER}`,
    position: 'relative',
  };
  const rowLabel: React.CSSProperties = {
    fontFamily: DM, fontWeight: 700, fontSize: 46, marginBottom: 24,
    display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap', minHeight: 64,
  };

  return (
    <Frame>
      <Orb size={600} color={CYAN} opacity={0.14} right={-190} top={-200} />
      <Orb size={600} color={GREEN} opacity={0.13} left={-210} bottom={-220} />

      <ChartHeader eyebrow="Finality" op={headOp} dy={headDy}>
        How long until a transaction is <span style={{ color: GREEN }}>final</span>
      </ChartHeader>

      <div style={{ position: 'absolute', left: PAD, right: PAD, top: 660, zIndex: 1, opacity: rowsOp }}>
        {/* row1 — Today */}
        <div style={{ marginBottom: 200, opacity: row1Dim }}>
          <div style={rowLabel}>Today</div>
          <div style={{ ...barStyle, overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 20,
                width: `${p1 * 100}%`, display: 'flex', alignItems: 'center',
                background: `linear-gradient(90deg,#0e5d8c,${CYAN})`,
              }}
            >
              <span
                style={{
                  fontFamily: JB, fontWeight: 700, fontSize: 48, whiteSpace: 'nowrap',
                  color: '#04060d', marginLeft: 'auto', marginRight: 34,
                  opacity: ip(p1, [0.55, 0.82], [0, 1]),
                }}
              >
                UNDER 7 SECONDS
              </span>
            </div>
          </div>
        </div>

        {/* row2 — DAGKnight era */}
        <div>
          <div style={rowLabel}>
            DAGKnight era
            {chip >= 0 && (
              <span
                style={{
                  fontFamily: JB, fontWeight: 700, fontSize: 24, letterSpacing: '.08em',
                  padding: '11px 24px', borderRadius: 100, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', background: 'rgba(255,215,0,.1)', color: GOLD,
                  border: '2px solid rgba(255,215,0,.45)',
                  opacity: ip(chip, [0, 0.09], [0, 1]),
                  transform: `scale(${ip(chip, [0, 0.11, 0.2], [1.7, 0.95, 1], OUT5)})`,
                }}
              >
                Potential · on proof of work
              </span>
            )}
          </div>
          <div style={barStyle}>
            <div
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 20,
                width: `${w2}%`, opacity: fill2Op,
                background: `linear-gradient(90deg,#0a7a54,${GREEN})`,
                boxShadow: `0 0 ${collapse ? ip(c, [0.4, 0.72], [10, 44]) : 0}px rgba(0,230,138,.35)`,
              }}
            />
            <span
              style={{
                position: 'absolute', left: `calc(${val2X}% + 30px)`, top: '50%',
                transform: 'translateY(-50%)', fontFamily: JB, fontWeight: 700, fontSize: 48,
                whiteSpace: 'nowrap', color: GREEN, opacity: val2Op,
              }}
            >
              UNDER 1 SECOND
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 34,
            fontFamily: JB, fontSize: 24, color: MUTED, opacity: axisOp,
          }}
        >
          {['0 s', '1 s', '2 s', '3 s', '4 s', '5 s', '6 s', '7 s'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <Foot op={ip(u, [0.6, 1.0], [0, 1])}>
        DAGKnight opens the door to sub-second settlement: a potential, not a promise
      </Foot>

      {impact > 0 && (
        <AbsoluteFill
          style={{ background: 'rgba(0,230,138,.5)', opacity: impact, zIndex: 8, mixBlendMode: 'screen' }}
        />
      )}
    </Frame>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// C2 — block cadence race. Window 326.32 → 347.32.
// ═════════════════════════════════════════════════════════════════════════════
const C2_IN = 326.32;
const C2_BLINK = 345.8;

type Lane = {
  name: string; int: string; at: number;
  zero?: string; count: string; countColor: string;
  ticks?: number; tickColor?: string; tickShadow?: string; step?: number; spread?: number;
};

const C2_LANES: Lane[] = [
  {
    name: 'Bitcoin', int: '1 block every ~10 MIN', at: 328.5,
    zero: 'no block this second · next in minutes', count: '0', countColor: MUTED,
  },
  {
    name: 'Ethereum', int: '1 block every ~12 SEC', at: 331.6,
    zero: 'no block this second · next in seconds', count: '0', countColor: MUTED,
  },
  {
    name: 'Kaspa · today', int: '1 block every 100 MS', at: 334.2,
    count: '10', countColor: CYAN,
    ticks: 10, tickColor: CYAN, tickShadow: '0,194,255', step: 10, spread: 1.2,
  },
  {
    name: 'DAGKnight era', int: '1 block every ~25 MS', at: 337.6,
    count: 'UP TO 40', countColor: GREEN,
    ticks: 40, tickColor: GREEN, tickShadow: '0,230,138', step: 2.5, spread: 3.0,
  },
];

export const C2V: React.FC<{ ts: number }> = ({ ts }) => {
  const u = ts - C2_IN;
  const b = ts - C2_BLINK;
  const headOp = ip(u, [0, 0.35], [0, 1], OUT);
  const headDy = ip(u, [0, 0.45], [-26, 0], OUT);

  return (
    <Frame>
      <Orb size={600} color={GREEN} opacity={0.13} right={-190} top={-200} />
      <Orb size={580} color={CYAN} opacity={0.13} left={-200} bottom={-220} />

      <ChartHeader eyebrow="Block cadence" op={headOp} dy={headDy}>
        <span style={{ color: GREEN }}>One second</span> of block production
      </ChartHeader>

      {/* portrait RESTACK: name + interval and the count share a header line,
          the cadence lane runs the full 960 px width underneath it. */}
      <div style={{ position: 'absolute', left: PAD, right: PAD, top: 384, zIndex: 1 }}>
        {C2_LANES.map((ln, i) => {
          const rowIn = 0.12 + i * 0.09;
          const rowOp = ip(u, [rowIn, rowIn + 0.38], [0, 1], OUT);
          const rowDx = ip(u, [rowIn, rowIn + 0.45], [-34, 0], OUT);
          const a = ts - ln.at; // lane pulse local time
          const live = a >= 0;

          // dense-lane reveal at the real cadence, then a running "hot" sweep.
          const nTicks = ln.ticks ?? 0;
          const revealed = live ? Math.min(nTicks, Math.floor(ip(a, [0, 1.0], [0, nTicks]) + 1e-6)) : 0;
          const pos = live ? ((a % 1) + 1) % 1 * nTicks : -99;

          // BTC / ETH: a slow waiting sweep so the lane is never a dead bitmap.
          const waitSweep = live ? (((a % 3.5) / 3.5)) : -1;

          const zeroOp = live ? ip(a, [0, 0.3], [0, 1], OUT) : 0;
          const countOp = live ? ip(a, [0, 0.22], [0, 1], OUT) : 0;
          const countScale = live ? ip(a, [0, 0.14, 0.26], [1.45, 0.96, 1], OUT5) : 1;
          const trackGlow = live ? ip(a, [0, 0.18, 0.9], [0, 1, 0.18], OUT) : 0;

          return (
            <div
              key={ln.name}
              style={{
                marginBottom: 56, opacity: rowOp, transform: `translateX(${rowDx}px)`,
              }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  gap: 30, marginBottom: 30,
                }}
              >
                <div>
                  <div style={{ fontFamily: DM, fontWeight: 700, fontSize: 42, letterSpacing: '.02em' }}>
                    {ln.name}
                  </div>
                  <div style={{ fontFamily: JB, fontWeight: 600, fontSize: 28, color: MUTED, marginTop: 8 }}>
                    {ln.int}
                  </div>
                </div>

                <div
                  style={{
                    flex: 'none', textAlign: 'right', fontFamily: JB, fontWeight: 700,
                    fontSize: 44, color: ln.countColor, opacity: countOp,
                    transform: `scale(${countScale})`, transformOrigin: 'right bottom',
                  }}
                >
                  {ln.count}
                  <small
                    style={{
                      display: 'block', fontSize: 21, fontWeight: 600, color: MUTED,
                      marginTop: 6, letterSpacing: '.1em',
                    }}
                  >
                    THIS SECOND
                  </small>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    height: 88, borderRadius: 16, background: CARD,
                    border: `1px solid ${trackGlow > 0 ? mix(BORDER, ln.countColor, 0.45 * trackGlow) : BORDER}`,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {ln.zero && (
                    <>
                      <div
                        style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                          paddingLeft: 30, fontFamily: JB, fontWeight: 600, fontSize: 28,
                          color: MUTED, opacity: zeroOp,
                        }}
                      >
                        {ln.zero}
                      </div>
                      {waitSweep >= 0 && (
                        <div
                          style={{
                            position: 'absolute', top: 0, bottom: 0, width: 220,
                            left: `${waitSweep * 118 - 12}%`,
                            background:
                              'linear-gradient(90deg,rgba(136,146,164,0),rgba(136,146,164,.10),rgba(136,146,164,0))',
                            opacity: zeroOp,
                          }}
                        />
                      )}
                    </>
                  )}

                  {nTicks > 0 &&
                    new Array(nTicks).fill(0).map((_, k) => {
                      if (k >= revealed) return null;
                      const raw = Math.abs(k - pos);
                      const d = Math.min(raw, nTicks - raw);
                      const g = Math.max(0, 1 - d / (ln.spread ?? 1.5));
                      return (
                        <div
                          key={k}
                          style={{
                            position: 'absolute', top: 16, bottom: 16, width: 8, borderRadius: 4,
                            left: `calc(${k * (ln.step ?? 10)}% + ${nTicks === 10 ? 14 : 6}px)`,
                            background: ln.tickColor,
                            opacity: 0.72 + 0.28 * g,
                            boxShadow: `0 0 ${12 + 20 * g}px rgba(${ln.tickShadow},${0.6 + 0.35 * g})`,
                            transform: `scaleX(${1 + 0.5 * g})`,
                          }}
                        />
                      );
                    })}
                </div>

                {/* the blink window — the first 100 ms of the DAGKnight lane */}
                {ln.ticks === 40 && b >= 0 && (
                  <div
                    style={{
                      position: 'absolute', left: 0, top: -14, bottom: -14, width: '10%',
                      border: `3px solid ${GOLD}`, borderRadius: 14, background: 'rgba(255,215,0,.06)',
                      boxShadow: '0 0 34px rgba(255,215,0,.2)',
                      opacity: ip(b, [0, 0.12], [0, 1]),
                      transform: `scale(${ip(b, [0, 0.18, 0.3], [1.65, 0.96, 1], OUT5)})`,
                      transformOrigin: 'left center',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', marginTop: -20,
            fontFamily: JB, fontSize: 24, color: MUTED,
            opacity: ip(u, [0.55, 0.95], [0, 1]),
          }}
        >
          {['0 ms', '250 ms', '500 ms', '750 ms', '1,000 ms'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      {b >= 0 && (
        <>
          <div
            style={{
              position: 'absolute', left: PAD, top: 1520, zIndex: 3, fontFamily: DM,
              fontWeight: 600, fontSize: 30, color: GOLD,
              opacity: 0.85 * ip(b, [0.08, 0.28], [0, 1]),
              transform: `translateY(${ip(b, [0.08, 0.3], [16, 0], OUT)}px)`,
            }}
          >
            a blink lasts about 100 ms
          </div>
          <div style={{ position: 'absolute', left: '50%', top: 1610, zIndex: 3 }}>
            <div
              style={{
                fontFamily: JB, fontWeight: 700, fontSize: 54, color: GOLD, whiteSpace: 'nowrap',
                border: `5px solid ${GOLD}`, borderRadius: 14, padding: '14px 30px',
                display: 'inline-block', background: 'rgba(255,215,0,.07)',
                boxShadow: '0 0 50px rgba(255,215,0,.16)',
                opacity: ip(b, [0.04, 0.16], [0, 1]),
                transform: `translateX(-50%) rotate(${ip(b, [0.04, 0.34], [-15, -3], OUT)}deg) scale(${ip(
                  b, [0.04, 0.22, 0.34], [1.95, 0.94, 1], OUT5,
                )})`,
              }}
            >
              4 BLOCKS PER BLINK
            </div>
          </div>
        </>
      )}

      <Foot op={ip(u, [0.6, 1.0], [0, 1])}>
        BTC and ETH cadence approximate · DAGKnight era: up to 40 blocks per second, targeted
      </Foot>
    </Frame>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// C3 — TPS capacity. Window 347.32 → 373.26. (arrives out of a reserved SPIN)
// ═════════════════════════════════════════════════════════════════════════════
const C3_IN = 347.32;
const C3_DEMO = 357.8;
const C3_SPOT = 363.5;
const C3_CAP = 369.2;
const DEMO_PCT = 11.17; // 5,584 of the 50,000 full-scale lane

const C3_ROWS = [
  { bps: '10 BPS', sub: 'today', pct: 10, val: 5000, valPct: DEMO_PCT, off: 30, demo: true, spot: false },
  { bps: '25 BPS', sub: 'DAGKnight range', pct: 25, val: 12500, valPct: 25, off: 22, demo: false, spot: false },
  { bps: 'UP TO 40 BPS', sub: 'target: end of 2026', pct: 40, val: 20000, valPct: 40, off: 22, demo: false, spot: true },
  { bps: '100 BPS', sub: '2027 target', pct: 100, val: 50000, valPct: 100, off: 0, demo: false, spot: false, inside: true },
];

export const C3V: React.FC<{ ts: number }> = ({ ts }) => {
  const u = ts - C3_IN;
  const d = ts - C3_DEMO;
  const cap = ts - C3_CAP;

  const inOp = ip(u, [0, 0.4], [0, 1], OUT);
  const inScale = ip(u, [0, 0.6], [1.045, 1], OUT);
  const headDy = ip(u, [0, 0.45], [-24, 0], OUT);

  // spotlight comes on at C3_SPOT, and is RELEASED by the capacity slam (per fin design stills).
  const spotRaw = ip(ts, [C3_SPOT, C3_SPOT + 0.4], [0, 1], INOUT);
  const capOn = ip(ts, [C3_CAP, C3_CAP + 0.25], [0, 1], OUT);
  const spot = spotRaw * (1 - capOn);
  const rowsOp = 1 - 0.5 * capOn;
  const spotPunch = 1 + 0.018 * ip(ts, [C3_SPOT, C3_SPOT + 0.13, C3_SPOT + 0.45], [0, 1, 0], OUT);

  return (
    <Frame>
      <Orb size={600} color={GREEN} opacity={0.13} right={-190} top={-200} />
      <Orb size={580} color={GOLD} opacity={0.1} left={-200} bottom={-220} />

      <ChartHeader eyebrow="Transactions per second · capacity" op={inOp} dy={headDy} maxWidth={790}>
        What each block rate <span style={{ color: GREEN }}>can carry</span>
      </ChartHeader>

      {/* portrait RESTACK: rate + sub-label above, the capacity bar full 960 px beneath.
          The 10 BPS row reserves extra space below its bar for the DEMONSTRATED marker
          (which hangs above the bar in the 16:9, where the row label now sits). */}
      <div
        style={{
          position: 'absolute', left: PAD, right: PAD, top: 430, zIndex: 1,
          opacity: inOp * rowsOp, transform: `scale(${inScale})`, transformOrigin: '50% 40%',
        }}
      >
        {C3_ROWS.map((r, i) => {
          const start = 0.25 + i * 0.18;
          const p = ip(u, [start, start + 0.8], [0, 1], OUT);
          const w = r.pct * p;
          const vx = r.valPct * p;
          const rowOp = r.spot ? 1 : 1 - 0.65 * spot;
          const litBorder = r.spot ? mix(BORDER, '#00e68a', 0.65 * spot) : BORDER;

          return (
            <div
              key={r.bps}
              style={{
                marginBottom: 120, position: 'relative', opacity: rowOp,
                transform: r.spot ? `scale(${spotPunch})` : undefined,
                transformOrigin: 'left center',
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontFamily: JB, fontWeight: 700, fontSize: 44,
                    color: r.spot ? mix(TEXT, GREEN, spot) : TEXT,
                  }}
                >
                  {r.bps}
                </div>
                <div
                  style={{
                    fontFamily: DM, fontWeight: 600, fontSize: 24, color: MUTED, marginTop: 8,
                    textTransform: 'uppercase', letterSpacing: '.1em',
                  }}
                >
                  {r.sub}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    height: 84, borderRadius: 14, background: CARD,
                    border: `1px solid ${litBorder}`, position: 'relative',
                    boxShadow: r.spot && spot > 0 ? `0 0 ${55 * spot}px rgba(0,230,138,${0.22 * spot})` : 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 14,
                      width: `${w}%`, overflow: 'hidden',
                      background: `linear-gradient(90deg,${GREEN},${CYAN})`,
                    }}
                  >
                    {r.inside && (
                      <span
                        style={{
                          position: 'absolute', top: '50%', right: 28, transform: 'translateY(-50%)',
                          fontFamily: JB, fontWeight: 700, fontSize: 38, color: '#04060d',
                          whiteSpace: 'nowrap', opacity: ip(p, [0.3, 0.55], [0, 1]),
                        }}
                      >
                        {fmt(r.val * p)}+
                        <small style={{ fontSize: 24, color: 'rgba(4,6,13,.7)', fontWeight: 600, marginLeft: 10 }}>
                          TPS
                        </small>
                      </span>
                    )}
                  </div>
                  {!r.inside && (
                    <div
                      style={{
                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                        left: `calc(${vx}% + ${r.off}px)`, fontFamily: JB, fontWeight: 700,
                        fontSize: 38, color: TEXT, whiteSpace: 'nowrap',
                        opacity: ip(p, [0.06, 0.28], [0, 1]),
                      }}
                    >
                      {fmt(r.val * p)}+
                      <small style={{ fontSize: 24, color: TEXT2, fontWeight: 600, marginLeft: 10 }}>TPS</small>
                    </div>
                  )}
                </div>

                {/* DEMONSTRATED marker — stamps onto the 10 BPS row, hanging BELOW the bar */}
                {r.demo && d >= 0 && (
                  <>
                    <div
                      style={{
                        position: 'absolute', left: `calc(${DEMO_PCT}% - 2px)`, top: -10, height: 152,
                        width: 4, borderRadius: 2, background: GREEN,
                        boxShadow: '0 0 18px rgba(0,230,138,.7)', zIndex: 3,
                        transform: `scaleY(${ip(d, [0, 0.22], [0, 1], OUT)})`, transformOrigin: 'top center',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute', left: `calc(${DEMO_PCT}% + 18px)`, top: 106, zIndex: 3,
                        whiteSpace: 'nowrap', fontFamily: JB, fontWeight: 700, fontSize: 25, color: GREEN,
                        background: 'rgba(0,230,138,.1)', border: '2px solid rgba(0,230,138,.5)',
                        borderRadius: 10, padding: '10px 20px',
                        opacity: ip(d, [0.06, 0.17], [0, 1]),
                        transform: `scale(${ip(d, [0.06, 0.22, 0.33], [1.7, 0.94, 1], OUT5)})`,
                        transformOrigin: 'left center',
                      }}
                    >
                      DEMONSTRATED: 5,584 · mainnet · Oct 2025
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Foot op={ip(u, [0.6, 1.0], [0, 1]) * rowsOp}>
        capacity ceilings by block rate · demonstrated peak: 5,584 TPS on mainnet, Oct 2025
      </Foot>

      {/* THEORETICAL CAPACITY slam */}
      {cap >= 0 && (
        <div
          style={{
            position: 'absolute', left: '50%', top: '48%', width: 940, zIndex: 5, textAlign: 'center',
            transform: `translate(-50%,-50%) rotate(${ip(cap, [0, 0.28], [-16, -4], OUT)}deg) scale(${ip(
              cap, [0, 0.16, 0.27], [2.1, 0.95, 1], OUT5,
            )})`,
            opacity: ip(cap, [0, 0.1], [0, 1]),
          }}
        >
          <div
            style={{
              fontFamily: JB, fontWeight: 700, fontSize: 84, lineHeight: 1.12,
              letterSpacing: '.04em', color: GOLD,
              border: `8px solid ${GOLD}`, borderRadius: 20, padding: '24px 44px',
              background: 'rgba(10,12,16,.82)', boxShadow: '0 0 90px rgba(255,215,0,.22)',
              display: 'inline-block',
            }}
          >
            THEORETICAL<br />CAPACITY
          </div>
          <div
            style={{
              fontFamily: DM, fontWeight: 600, fontSize: 28, lineHeight: 1.4, color: TEXT2, marginTop: 48,
              display: 'inline-block', background: 'rgba(10,12,16,.88)',
              border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 28px',
              opacity: ip(cap, [0.14, 0.36], [0, 1]),
              transform: `translateY(${ip(cap, [0.14, 0.38], [22, 0], OUT)}px)`,
            }}
          >
            ceilings, not throughput · demonstrated so far:{' '}
            <span style={{ fontFamily: JB, fontWeight: 600, color: GREEN }}>5,584 TPS</span>
          </div>
        </div>
      )}

      {cap >= 0 && (
        <AbsoluteFill
          style={{
            background: 'rgba(255,215,0,.45)',
            opacity: ip(cap, [0, 0.05, 0.18], [0, 0.3, 0], OUT),
            zIndex: 8, mixBlendMode: 'screen',
          }}
        />
      )}
    </Frame>
  );
};

/** Preview composition: frame N renders ts = N/30 for whichever chart owns that time. */
export const ChartsVPreview: React.FC = () => {
  const ts = useCurrentFrame() / 30;
  if (ts < 40) return <H1V ts={ts} />;
  if (ts < 240) return <FINV ts={ts} />;
  if (ts < 347.32) return <C2V ts={ts} />;
  return <C3V ts={ts} />;
};
