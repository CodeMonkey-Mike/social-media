import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, spring, Easing,
} from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

/**
 * kaspa 30bps VERTICAL — CHART C1 "The Upgrade Ladder" (Type 1 ANIMATED), PORTRAIT.
 *
 *   <C1V ts={sourceSeconds} />  — ts is ABSOLUTE e-spine SOURCE seconds (pre-card-pause).
 *   Renders a full-frame 1080x1920 AbsoluteFill. No <Sequence> inside. All motion derives
 *   from `ts` alone, so the component can be mounted in any of its five placement windows
 *   and shows the correctly accumulated state.
 *
 * This is a REFRAME of `Kaspa40ChartC1.tsx` (the finished, approved, published 16:9), NOT a
 * re-edit. Identical beat sheet, identical placement windows, identical data + wording +
 * palette + fonts + animation behaviour. ONLY the layout changes, because 1250px-wide rungs
 * do not exist on a 1080-wide frame:
 *   - each rung restacks to 3 bands   value + name  /  description  /  chips
 *     (the 16:9 packs those into ONE wide row: value | name+desc | right-aligned chip column)
 *   - the ladder runs taller (340px rungs, 384px pitch) since portrait has the vertical room
 *   - every type size is scaled up ~1.6-2.0x relative to frame width, for phone viewing
 *   - the DONE/TARGETED stamp slams with transform-origin at its own right edge, so the 2.5x
 *     overshoot grows INWARD instead of off the (much closer) right frame edge
 *   - the "4x THE SPEED" flash sits over rung 3's top-right instead of the 16:9's right margin
 *
 * If the 16:9 design changes, re-port from it — do not restyle only here.
 */

const { fontFamily: PLAYFAIR } = loadPlayfair('normal', {
  weights: ['700', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});
const { fontFamily: DMSANS } = loadDMSans('normal', {
  weights: ['400', '600'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});
const { fontFamily: MONO } = loadMono('normal', {
  weights: ['600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});

// ─── palette (c1.html :root) — identical to the 16:9 ──────────────────────────────
const BG_DEEP = '#0a0c10';
const BG_CARD = '#12151c';
const GREEN = '#00e68a';
const CYAN = '#00c2ff';
const GOLD = '#ffd700';
const TXT = '#e8eaf0';
const TXT2 = '#8892a4';
const MUTED = '#505a6e';
const BORDER = '#1e2330';

const NOISE =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'` +
  `%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/` +
  `%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ARROW = '→';   // 1 → 10 BPS
const MIDDOT = '·';  // Locked · needs DAGKnight

// ─── beat sheet — BYTE-IDENTICAL to the 16:9 (EDIT-PLAN.md source seconds) ─────────
const T = {
  IN: 52.84,        // chart in, BUILD state: frame + rail draw, rows empty
  R1: 57.70,        // rung 1 lands (Crescendo)
  R2: 70.80,        // rung 2 lands (Toccata)
  R3: 94.70,        // rung 3 lands (DAGKnight)
  FLASH: 102.50,    // "4x THE SPEED" accent flash
  R4: 121.80,       // rung 4 tease, locked + dim
  CB: 305.07,       // callback: the full ladder returns
  R3_LIGHT: 315.90, // rung 3 re-lights
  UNLOCK: 319.20,   // rung 4 unlocks
  ASM: 423.94,      // grand assembly (marquee arrival)
  S1: 425.40,       // rung 1 stamp DONE
  S2: 427.80,       // rung 2 stamp DONE
  NOTE: 429.50,     // "shipped this summer" on rung 2
  S3: 431.20,       // rung 3 stamp TARGETED
  S4: 434.60,       // rung 4 "2027 TARGET" stamps
};

/** The five placement windows the comp mounts C1V in (start, end) — same as the 16:9. */
const WINDOWS: [number, number][] = [
  [52.84, 75.26],
  [94.70, 107.93],
  [121.80, 134.52],
  [305.07, 321.50],
  [423.94, 436.30],
];

const FPS = 30;

// ─── motion helpers (all pure functions of ts) — identical to the 16:9 ─────────────
const ez = (
  ts: number, t0: number, dur: number, easing: (n: number) => number = Easing.out(Easing.cubic),
) => interpolate(ts, [t0, t0 + dur], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing,
});

const pop = (
  ts: number, t0: number,
  config: Parameters<typeof spring>[0]['config'] = { damping: 12, mass: 0.6, stiffness: 190 },
) => (ts <= t0 ? 0 : spring({ frame: (ts - t0) * FPS, fps: FPS, config }));

/** 1 at t0, decaying linearly to 0 over `dur`. Used for land/stamp shockwaves. */
const decay = (ts: number, t0: number, dur: number) =>
  ts < t0 ? 0 : Math.max(0, 1 - (ts - t0) / dur);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const countTo = (ts: number, t0: number, from: number, to: number, dur = 0.55) =>
  Math.round(interpolate(ts, [t0, t0 + dur], [from, to], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  }));

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

// ─── portrait geometry (1080x1920) ────────────────────────────────────────────────
const RAIL_X = 80;          // rail left; centre 83
const DOT = 46;             // node dot diameter
const RUNG_L = 150;
const RUNG_W = 880;         // right edge 1030, 50px frame margin
const RUNG_H = 340;
const PITCH = 384;          // 44px between cards, room for the stamp to hang over the top edge
const TOP_R4 = 330;
const ROW_TOP = [TOP_R4 + 3 * PITCH, TOP_R4 + 2 * PITCH, TOP_R4 + PITCH, TOP_R4]; // r1..r4
const ROW_MID = ROW_TOP.map((t) => t + RUNG_H / 2);

const VAL_W = 390;          // fixed, so counting digits never shove the name sideways

type ChipKind = 'date' | 'green' | 'gold' | 'lock';
const CHIP_STYLE: Record<ChipKind, React.CSSProperties> = {
  date: { background: 'rgba(136,146,164,.1)', color: TXT2, border: `1px solid ${BORDER}` },
  green: { background: 'rgba(0,230,138,.12)', color: GREEN, border: '1px solid rgba(0,230,138,.4)' },
  gold: { background: 'rgba(255,215,0,.1)', color: GOLD, border: '1px solid rgba(255,215,0,.4)' },
  lock: { background: 'rgba(80,90,110,.12)', color: MUTED, border: `1px solid ${BORDER}` },
};

const Chip: React.FC<{
  kind: ChipKind; children: React.ReactNode; scale?: number; opacity?: number; glow?: string;
}> = ({ kind, children, scale = 1, opacity = 1, glow }) => (
  <span
    style={{
      fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: '.06em',
      padding: '11px 24px', borderRadius: 100, textTransform: 'uppercase', whiteSpace: 'nowrap',
      display: 'inline-block', transform: `scale(${scale})`, opacity,
      boxShadow: glow, ...CHIP_STYLE[kind],
    }}
  >
    {children}
  </span>
);

const Stamp: React.FC<{ tone: 'done' | 'targeted'; ts: number; at: number; text: string }> = ({
  tone, ts, at, text,
}) => {
  // Slam: big -> exact, over-rotated -> the locked 7deg, with a decaying shockwave.
  // PORTRAIT: transform-origin pinned to the stamp's own right edge, so the 2.5x overshoot
  // expands leftward into the card instead of past the (much nearer) right frame edge.
  const sp = pop(ts, at, { damping: 200, mass: 0.5, stiffness: 200 });
  if (sp <= 0) return null;
  const col = tone === 'done' ? GREEN : GOLD;
  const shock = decay(ts, at, 0.7);
  return (
    <div
      style={{
        position: 'absolute', right: -6, top: -34, zIndex: 3, transformOrigin: '100% 50%',
        transform: `rotate(${interpolate(sp, [0, 1], [26, 7])}deg) scale(${interpolate(sp, [0, 1], [2.5, 1])})`,
        fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: '.1em',
        borderRadius: 12, padding: '10px 24px',
        color: col, border: `4px solid ${col}`,
        background: rgba(col, tone === 'done' ? 0.1 : 0.08),
        opacity: ez(ts, at, 0.1, Easing.linear),
        boxShadow: shock > 0 ? `0 0 ${70 * shock}px ${rgba(col, 0.5 * shock)}` : undefined,
      }}
    >
      {text}
    </div>
  );
};

/** One ladder row: a ghost placeholder that cross-fades into the solid card. */
const Rung: React.FC<{
  top: number; landP: number; opacity: number; dx: number; scale: number;
  borderColor: string; boxShadow?: string; children: React.ReactNode;
}> = ({ top, landP, opacity, dx, scale, borderColor, boxShadow, children }) => (
  <div
    style={{
      position: 'absolute', left: RUNG_L, top, width: RUNG_W, height: RUNG_H, zIndex: 2,
      opacity, transform: `translateX(${dx}px) scale(${scale})`,
    }}
  >
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        // The un-landed rungs must READ, or the ladder is an empty frame with a headline for its
        // first ~40s and breaks "containers FILL THE FRAME". #1e2330 on #0a0c10 was invisible.
        border: '3px dashed #3a4358', background: 'rgba(24,29,40,.72)', opacity: 1 - landP,
      }}
    />
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        border: `1px solid ${borderColor}`, background: BG_CARD, opacity: landP, boxShadow,
      }}
    />
    <div
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 40px',
      }}
    >
      {children}
    </div>
  </div>
);

/** Content fade/slide, shared by the value, the name and the desc block. */
const fade = (p: number): React.CSSProperties => ({
  opacity: p, transform: `translateX(${(1 - p) * 26}px)`,
});

/** Band 1 of the restacked row: the big mono value + the name, on one line. */
const Head: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>{children}</div>
);

const Val: React.FC<{ color: string; p: number; children: React.ReactNode }> = ({
  color, p, children,
}) => (
  <div
    style={{
      fontFamily: MONO, fontWeight: 700, fontSize: 52, width: VAL_W, flex: 'none', color,
      whiteSpace: 'nowrap', ...fade(p),
    }}
  >
    {children}
  </div>
);

const Name: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <div
    style={{
      fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 48, lineHeight: 1.1, color: TXT,
      whiteSpace: 'nowrap', ...fade(p),
    }}
  >
    {children}
  </div>
);

/** Band 2: the description (+ rung 2's late note). */
const Desc: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: DMSANS, fontSize: 30, lineHeight: 1.35, color: TXT2, marginTop: 16 }}>
    {children}
  </div>
);

/** Band 3: the chips, a left-aligned row (the 16:9 stacks them right-aligned). */
const Chips: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
      marginTop: 22, flexWrap: 'nowrap',
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────────
export const C1V: React.FC<{ ts: number }> = ({ ts }) => {
  // Which placement window are we inside? (the last one that has started)
  const started = WINDOWS.filter((w) => ts >= w[0]);
  const win = started.length ? started[started.length - 1] : null;
  const winStart = win ? win[0] : T.IN;
  const winEnd = win ? win[1] : T.IN;
  const wt = ts - winStart;
  const isBuild = winStart === T.IN;
  const isCallback = winStart === T.CB;
  const isAsm = winStart === T.ASM;
  const isFlashWin = winStart === WINDOWS[1][0];

  // ── window entrance (index 0 = bottom rung r1 … 3 = top rung r4) ────────────────
  const rungIn = (i: number) => {
    if (isBuild) {
      const p = ez(wt, 0.22 + i * 0.09, 0.5);
      return { op: p, dx: -40 * (1 - p), sc: 1 };
    }
    if (isAsm) {
      // Marquee arrival: alternating slam from the sides, all landed by ~0.7s.
      // Opacity keeps a floor so the cut out of the SPIN never lands on a black frame.
      // Offset scaled 320 -> 200 for the narrower frame (same % of the card's width).
      const sp = pop(ts, T.ASM + i * 0.05, { damping: 17, mass: 0.6, stiffness: 210 });
      const op = 0.25 + 0.75 * ez(wt, i * 0.05, 0.14, Easing.linear);
      return { op, dx: (i % 2 === 0 ? 1 : -1) * 200 * (1 - sp), sc: interpolate(sp, [0, 1], [0.94, 1]) };
    }
    // Windows 2-4 are re-entries: the ladder is already ON at the cut, it only settles
    // into place (never a fade up from black on the first frame of the window).
    const slide = isCallback ? 56 : 20;
    const p = ez(wt, i * (isCallback ? 0.06 : 0.03), isCallback ? 0.34 : 0.3);
    return { op: 1, dx: -slide * (1 - p), sc: 1 };
  };

  const headerIn = isBuild ? ez(wt, 0, 0.55)
    : isAsm ? 0.4 + 0.6 * ez(wt, 0, 0.22)
      : 1;
  const railIn = isBuild ? ez(wt, 0.12, 0.7)
    : isAsm ? 0.35 + 0.65 * ez(wt, 0, 0.18)
      : 1;

  // ── per-rung landing ───────────────────────────────────────────────────────────
  const LAND = [T.R1, T.R2, T.R3, T.R4];
  const landP = LAND.map((t) => ez(ts, t, 0.55));
  const landFlash = LAND.map((t) => decay(ts, t, 0.8));
  // 1 -> 1.02 -> 1 nudge as a rung lands
  const landNudge = landP.map((p) => (p > 0 && p < 1 ? 1 + 0.02 * Math.sin(Math.PI * p) : 1));
  const contentP = (i: number, delay = 0) => ez(ts, LAND[i] + delay, 0.45);
  const chipPop = (i: number, j: number) => Math.min(1, pop(ts, LAND[i] + 0.18 + j * 0.12));

  // ── accumulated states ─────────────────────────────────────────────────────────
  // rungs 1+2 soften while rung 3 is the focus (c1.html: state "rung3")
  const soft = clamp01(ez(ts, T.R3, 0.5) - ez(ts, T.R4, 0.5));
  // rung 4 sits dim/locked from its tease until it unlocks
  const dim4 = clamp01(ez(ts, T.R4, 0.5) - ez(ts, T.UNLOCK, 0.6));
  // rung 3 glow: on at land, off when rung 4 teases, back on at the callback re-light
  const glow3 = clamp01(ez(ts, T.R3, 0.5) - ez(ts, T.R4, 0.6) + ez(ts, T.R3_LIGHT, 0.5));
  const glow3Pulse = decay(ts, T.R3_LIGHT, 0.9);
  const asmSoft = ez(ts, T.ASM, 0.5); // assembly uses the softer glow variant
  const g3Border = rgba(GREEN, glow3 * (0.6 - 0.15 * asmSoft));
  const g3Shadow = glow3 > 0
    ? `0 0 ${(55 - 15 * asmSoft) + 40 * glow3Pulse}px ${rgba(GREEN, glow3 * (0.18 - 0.04 * asmSoft) + 0.22 * glow3Pulse)}`
    : undefined;

  // rung 4 lock -> unlock chip swap
  const lockedChip = clamp01(landP[3] * (1 - ez(ts, T.UNLOCK, 0.35)));
  const unlockPop = Math.min(1.06, pop(ts, T.UNLOCK + 0.1, { damping: 10, mass: 0.5, stiffness: 200 }));
  const unlockFlash = decay(ts, T.UNLOCK, 0.9);

  // "shipped this summer" pushes the Toccata block up as it opens (flex re-centring)
  const noteP = ez(ts, T.NOTE, 0.4);

  // rung 4's gold chip is stamped at the last assembly beat
  const s4 = ts >= T.S4 ? clamp01((ts - T.S4) / 0.45) : 0;
  const s4Scale = 1 + 0.38 * Math.sin(Math.PI * s4);
  const s4Glow = decay(ts, T.S4, 0.8);

  // "4x THE SPEED" — window 2 only
  const fl = pop(ts, T.FLASH, { damping: 11, mass: 0.6, stiffness: 200 });
  const flOut = isFlashWin ? 1 - ez(ts, winEnd - 0.4, 0.4, Easing.linear) : 0;
  const flBreath = Math.max(0, ts - T.FLASH - 0.45);
  const flashOn = isFlashWin && fl > 0;

  // ── dots ───────────────────────────────────────────────────────────────────────
  const DOTS = [
    { top: ROW_MID[0] - DOT / 2, p: landP[0], lit: GREEN, blur: 26, alpha: 0.7, flash: landFlash[0] },
    { top: ROW_MID[1] - DOT / 2, p: landP[1], lit: CYAN, blur: 22, alpha: 0.55, flash: landFlash[1] },
    { top: ROW_MID[2] - DOT / 2, p: landP[2], lit: GOLD, blur: 22, alpha: 0.5, flash: landFlash[2] },
    { top: ROW_MID[3] - DOT / 2, p: landP[3], lit: MUTED, blur: 0, alpha: 0, flash: 0 },
  ];

  const rowOpacity = [
    (1 - 0.15 * soft), (1 - 0.15 * soft), 1, (1 - 0.45 * dim4),
  ];

  const rungShadow = (i: number, base?: string) => {
    const cols = [GREEN, CYAN, GOLD, TXT];
    const f = landFlash[i];
    const parts: string[] = [];
    if (base) parts.push(base);
    if (f > 0) parts.push(`0 0 ${70 * f}px ${rgba(cols[i], 0.32 * f)}`);
    if (i === 3 && unlockFlash > 0) parts.push(`0 0 ${60 * unlockFlash}px ${rgba(GREEN, 0.3 * unlockFlash)}`);
    return parts.length ? parts.join(', ') : undefined;
  };

  const in0 = rungIn(0); const in1 = rungIn(1); const in2 = rungIn(2); const in3 = rungIn(3);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DEEP, color: TXT, overflow: 'hidden' }}>
      {/* orbs */}
      <div style={{
        position: 'absolute', width: 560, height: 560, right: -190, top: -180, borderRadius: '50%',
        background: GREEN, filter: 'blur(120px)', opacity: 0.13 * headerIn, zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', width: 560, height: 560, left: -200, bottom: -220, borderRadius: '50%',
        background: CYAN, filter: 'blur(120px)', opacity: 0.13 * headerIn, zIndex: 0,
      }} />

      {/* header */}
      <div style={{
        position: 'absolute', left: 60, top: 60, zIndex: 2,
        opacity: headerIn, transform: `translateY(${(1 - headerIn) * 22}px)`,
      }}>
        <div style={{
          fontFamily: DMSANS, fontSize: 30, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '.18em', color: MUTED, marginBottom: 20,
        }}>
          The upgrade ladder
        </div>
        {/* portrait: the headline breaks after "a", so the cyan accent owns its own line */}
        <div style={{
          fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 78, lineHeight: 1.06,
          letterSpacing: '-.02em', whiteSpace: 'nowrap',
        }}>
          <div>Every rung is a</div>
          <div style={{ color: CYAN }}>hard fork</div>
        </div>
      </div>

      {/* rail */}
      <div style={{
        position: 'absolute', left: RAIL_X, top: 350, height: 1452, width: 6,
        borderRadius: 3, background: BORDER, zIndex: 1,
        transform: `scaleY(${railIn})`, transformOrigin: 'top center',
      }} />

      {/* dots */}
      {DOTS.map((d, i) => {
        const col = interpolateColors(d.p, [0, 1], [BORDER, d.lit]);
        const glow = d.blur > 0 && d.p > 0
          ? `0 0 ${(d.blur + 22 * d.flash) * d.p}px ${rgba(d.lit, (d.alpha + 0.25 * d.flash) * d.p)}`
          : undefined;
        return (
          <div key={i} style={{
            position: 'absolute', left: RAIL_X + 3 - DOT / 2, top: d.top, width: DOT, height: DOT,
            borderRadius: '50%',
            background: BG_CARD, border: `3px solid ${col}`, boxShadow: glow, zIndex: 2,
            opacity: railIn, transform: `scale(${0.6 + 0.4 * railIn + 0.12 * d.flash})`,
          }} />
        );
      })}

      {/* ── RUNG 4 — The 2027 Fork ─────────────────────────────────────────────── */}
      <Rung
        top={ROW_TOP[3]} landP={landP[3]} opacity={in3.op * rowOpacity[3]} dx={in3.dx}
        scale={in3.sc * landNudge[3]} borderColor={BORDER} boxShadow={rungShadow(3)}
      >
        <Head>
          <Val color={TXT} p={contentP(3)}>{countTo(ts, T.R4 + 0.1, 40, 100)} BPS</Val>
          <Name p={contentP(3, 0.08)}>The 2027 Fork</Name>
        </Head>
        <div style={fade(contentP(3, 0.08))}>
          <Desc>the rung after: it only exists<br />if DAGKnight lands first</Desc>
        </div>
        <Chips>
          <Chip
            kind="gold"
            scale={chipPop(3, 0) * s4Scale}
            opacity={Math.min(1, chipPop(3, 0))}
            glow={s4Glow > 0 ? `0 0 ${55 * s4Glow}px ${rgba(GOLD, 0.55 * s4Glow)}` : undefined}
          >
            2027 target
          </Chip>
          <div style={{ display: 'grid', justifyItems: 'start' }}>
            {lockedChip > 0 ? (
              <div style={{ gridArea: '1 / 1' }}>
                <Chip kind="lock" opacity={lockedChip} scale={0.9 + 0.1 * lockedChip}>
                  Locked {MIDDOT} needs DAGKnight
                </Chip>
              </div>
            ) : null}
            {unlockPop > 0 ? (
              <div style={{ gridArea: '1 / 1' }}>
                <Chip
                  kind="green" scale={unlockPop} opacity={Math.min(1, unlockPop * 1.4)}
                  glow={unlockFlash > 0 ? `0 0 ${45 * unlockFlash}px ${rgba(GREEN, 0.5 * unlockFlash)}` : undefined}
                >
                  Unlocked by DAGKnight
                </Chip>
              </div>
            ) : null}
          </div>
        </Chips>
      </Rung>

      {/* ── RUNG 3 — DAGKnight ─────────────────────────────────────────────────── */}
      <Rung
        top={ROW_TOP[2]} landP={landP[2]} opacity={in2.op * rowOpacity[2]} dx={in2.dx}
        scale={in2.sc * landNudge[2]}
        borderColor={glow3 > 0 ? g3Border : BORDER} boxShadow={rungShadow(2, g3Shadow)}
      >
        <Head>
          <Val color={GREEN} p={contentP(2)}>UP TO {countTo(ts, T.R3 + 0.1, 10, 40)} BPS</Val>
          <Name p={contentP(2, 0.08)}>DAGKnight</Name>
        </Head>
        <div style={fade(contentP(2, 0.08))}>
          <Desc>new consensus protocol,<br />four times today{"'"}s speed</Desc>
        </div>
        <Chips>
          <Chip kind="gold" scale={chipPop(2, 0)} opacity={Math.min(1, chipPop(2, 0))}>
            Target: end of 2026
          </Chip>
        </Chips>
        {isAsm ? <Stamp tone="targeted" ts={ts} at={T.S3} text="TARGETED" /> : null}
      </Rung>

      {/* ── RUNG 2 — Toccata ───────────────────────────────────────────────────── */}
      <Rung
        top={ROW_TOP[1]} landP={landP[1]} opacity={in1.op * rowOpacity[1]} dx={in1.dx}
        scale={in1.sc * landNudge[1]} borderColor={BORDER} boxShadow={rungShadow(1)}
      >
        <Head>
          <Val color={TXT2} p={contentP(1)}>STILL 10 BPS</Val>
          <Name p={contentP(1, 0.08)}>Toccata</Name>
        </Head>
        <div style={fade(contentP(1, 0.08))}>
          <Desc>programmability: covenants,<br />native tokens, ZK verification</Desc>
          <div style={{ height: 40 * noteP, overflow: 'hidden' }}>
            <div style={{
              fontFamily: DMSANS, fontWeight: 600, fontSize: 26, color: GREEN, marginTop: 8,
              opacity: noteP, transform: `translateY(${(1 - noteP) * 10}px)`,
            }}>
              shipped this summer
            </div>
          </div>
        </div>
        <Chips>
          <Chip kind="date" scale={chipPop(1, 0)} opacity={Math.min(1, chipPop(1, 0))}>
            Jun 30, 2026
          </Chip>
          <Chip kind="green" scale={chipPop(1, 1)} opacity={Math.min(1, chipPop(1, 1))}>
            Shipped
          </Chip>
        </Chips>
        {isAsm ? <Stamp tone="done" ts={ts} at={T.S2} text="DONE" /> : null}
      </Rung>

      {/* ── RUNG 1 — Crescendo ─────────────────────────────────────────────────── */}
      <Rung
        top={ROW_TOP[0]} landP={landP[0]} opacity={in0.op * rowOpacity[0]} dx={in0.dx}
        scale={in0.sc * landNudge[0]} borderColor={BORDER} boxShadow={rungShadow(0)}
      >
        <Head>
          <Val color={GREEN} p={contentP(0)}>
            1 {ARROW} {countTo(ts, T.R1 + 0.1, 1, 10)} BPS
          </Val>
          <Name p={contentP(0, 0.08)}>Crescendo</Name>
        </Head>
        <div style={fade(contentP(0, 0.08))}>
          <Desc>100 ms blocks, running live today</Desc>
        </div>
        <Chips>
          <Chip kind="date" scale={chipPop(0, 0)} opacity={Math.min(1, chipPop(0, 0))}>
            May 2025
          </Chip>
          <Chip kind="green" scale={chipPop(0, 1)} opacity={Math.min(1, chipPop(0, 1))}>
            Live
          </Chip>
        </Chips>
        {isAsm ? <Stamp tone="done" ts={ts} at={T.S1} text="DONE" /> : null}
      </Rung>

      {/* ── "4x THE SPEED" accent flash (window 2 only) — over rung 3's top-right ─ */}
      {flashOn ? (
        <div style={{
          // right margin keeps the breathing pulse + spring overshoot inside the frame
          position: 'absolute', right: 58, top: ROW_TOP[2] - 60, zIndex: 4,
          transform: `rotate(${interpolate(fl, [0, 1], [-16, -4])}deg) `
            + `scale(${interpolate(fl, [0, 1], [0.45, 1]) * (1 + 0.03 * Math.sin(flBreath * 7.5))})`,
          fontFamily: MONO, fontWeight: 700, fontSize: 52, color: GREEN,
          border: `4px solid ${GREEN}`, borderRadius: 14, padding: '12px 28px',
          background: 'rgba(0,230,138,.08)',
          boxShadow: `0 0 ${40 + 26 * (0.5 + 0.5 * Math.sin(flBreath * 7.5))}px `
            + `${rgba(GREEN, 0.25 + 0.18 * (0.5 + 0.5 * Math.sin(flBreath * 7.5)))}`,
          opacity: ez(ts, T.FLASH, 0.14, Easing.linear) * flOut,
        }}>
          4x THE SPEED
        </div>
      ) : null}

      {/* film grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9, opacity: 0.03,
        backgroundImage: NOISE,
      }} />
    </AbsoluteFill>
  );
};

/** Preview composition: frame N renders ts = N/30, so `--frame=2841` == ts 94.7s. */
export const C1VPreview: React.FC = () => {
  const frame = useCurrentFrame();
  return <C1V ts={frame / 30} />;
};
