// ResetCharts.tsx: the reset video's Type 1 ANIMATED charts (C4, H5, C6, C7, C2, C8, C17), built in code from the
// chart-builder's design spec (media/reset/assets/charts/<id>.html: the per-state geometry + the ANIMATION / STATE
// SPEC comment; the <id>-<state>.png stills are the look these frames reproduce). Every chart is driven by ONE clock:
// `t` = SOURCE-spine seconds (the comp passes the absolute frame mapped back through the pause table), so a chart
// reads the same moment whether it is mounted by the cover track or inside a library transition engine.
// Light theme tokens = container-canonical-light.css (Mike 2026-10-25). Numbers trace to DATA.md via the spec.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJB } from '@remotion/google-fonts/JetBrainsMono';

export const PLAYFAIR = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
export const DMSANS = loadDM('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] }).fontFamily;
export const JBMONO = loadJB('normal', { weights: ['400', '600'], subsets: ['latin'] }).fontFamily;

// ---------- light-theme tokens ----------
export const LT = {
  bg: '#F6F4EE', card: '#FFFFFF', cardHover: '#F1EFE9', border: '#DDD9CF',
  text: '#14161A', text2: '#4A5263', muted: '#5E6676', grid: '#D6D2C7', axis: '#7A808B', wire: '#8A877E',
  red: '#C41E3A',
};
export type Theme = { acc: string; rgb: string; mid: string; pale: string; neutral: string; track: string };
export const RED: Theme = { acc: '#C41E3A', rgb: '196,30,58', mid: '#E6A0AC', pale: '#F7E2E5', neutral: '#BDB8AC', track: '#ECE9E1' };
export const GOLD: Theme = { acc: '#8F6500', rgb: '143,101,0', mid: '#D0BE94', pale: '#F0EBDE', neutral: '#BDB8AC', track: '#ECE9E1' };

// ---------- tiny math ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / Math.max(1e-6, b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const easeInOut = (x: number) => { const p = clamp01(x); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mixHex = (a: string, b: string, p: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const q = clamp01(p);
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], q)).toString(16).padStart(2, '0')).join('');
};

// ---------- shared typography ----------
export const M: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: JBMONO, fontWeight: 600, fontVariantLigatures: 'none', fontFeatureSettings: '"calt" 0, "liga" 0', ...style }}>{children}</span>
);
const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...s });

// ---------- the frame every chart sits in (hdr, orbs, source line) ----------
export const ChartFrame: React.FC<{ th: Theme; ey: React.ReactNode; h1: React.ReactNode; src: string; children?: React.ReactNode }> = ({ th, ey, h1, src, children }) => (
  <AbsoluteFill style={{ background: LT.bg, overflow: 'hidden', fontFamily: DMSANS, color: LT.text }}>
    {/* the two blurred orbs of the stylesheet, as cheap radial gradients (blur(120px) on a solid disc) */}
    <div style={abs({ width: 960, height: 960, right: -420, top: -500, borderRadius: '50%',
      background: `radial-gradient(circle closest-side, rgba(${th.rgb},0.18) 55%, rgba(${th.rgb},0) 100%)` })} />
    <div style={abs({ width: 860, height: 860, left: -440, bottom: -480, borderRadius: '50%',
      background: 'radial-gradient(circle closest-side, rgba(185,195,214,0.30) 55%, rgba(185,195,214,0) 100%)' })} />
    <div style={abs({ left: 120, top: 62, maxWidth: 1680, zIndex: 2 })}>
      <div style={{ fontFamily: DMSANS, fontSize: 24, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: LT.muted, marginBottom: 14 }}>{ey}</div>
      <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 64, lineHeight: 1.06, letterSpacing: '-.02em', color: LT.text }}>{h1}</div>
      <div style={{ width: 66, height: 4, borderRadius: 2, marginTop: 22, background: `linear-gradient(90deg, ${th.acc}, rgba(${th.rgb},.22))` }} />
    </div>
    {children}
    <div style={abs({ left: 120, bottom: 32, fontFamily: JBMONO, fontWeight: 400, fontSize: 18, color: LT.muted, letterSpacing: '.01em', whiteSpace: 'nowrap', zIndex: 2,
      fontVariantLigatures: 'none' })}>{src}</div>
  </AbsoluteFill>
);
const Ak: React.FC<{ th: Theme; children: React.ReactNode }> = ({ th, children }) => <span style={{ color: th.acc }}>{children}</span>;

// vertical motion blur for the spinning digit strips (the spec's #vblur / #vblurL)
const VBlurDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="rs-vblur" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="0 16" /></filter>
      <filter id="rs-vblurL" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="0 24" /></filter>
    </defs>
  </svg>
);

// A digit cell that is a placeholder zero, then a spinning 0-9 strip, then LOCKS on its digit (ease-out, 1-digit overshoot).
const DigitCell: React.FC<{ t: number; digit: number; spinAt: number; lockAt: number; th: Theme; w: number; h: number; fs: number; lh: number; radius: number; bar: number; blur: string; seed: number }> = (
  { t, digit, spinAt, lockAt, th, w, h, fs, lh, radius, bar, blur, seed }) => {
  const box: React.CSSProperties = { width: w, height: h, borderRadius: radius, background: LT.card, border: `2px solid ${LT.border}`,
    boxShadow: '0 1px 2px rgba(20,22,26,.05),0 10px 24px rgba(20,22,26,.07)', position: 'relative', overflow: 'hidden',
    fontFamily: JBMONO, fontWeight: 600, fontSize: fs, lineHeight: `${lh}px`, textAlign: 'center', color: LT.text, fontVariantLigatures: 'none', boxSizing: 'border-box' };
  if (t < spinAt) return <div style={{ ...box, color: 'rgba(94,102,118,.38)' }}>0</div>;
  if (t < lockAt) {
    // fast strip: 14 digits a second, each cell phase-shifted
    const pos = (t - spinAt) * 14 + seed * 3.7;
    const k = Math.floor(pos);
    const frac = pos - k;
    const digits = [0, 1, 2].map((i) => (k + i) % 10);
    return (
      <div style={box}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: -frac * lh - (h - lh) / 2 + 2, display: 'flex', flexDirection: 'column', filter: `url(#${blur})`, opacity: 0.55 }}>
          {digits.map((d, i) => <span key={i} style={{ display: 'block', height: lh, lineHeight: `${lh}px` }}>{d}</span>)}
        </div>
      </div>
    );
  }
  // locked: settle from a one-digit overshoot (the strip passes the digit, comes back), 7 frames
  const p = easeOut(prog(t, lockAt, lockAt + 0.23));
  const off = (1 - p) * -0.45 * lh;
  return (
    <div style={box}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: (h - lh) / 2 - 2 + off }}>{digit}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: th.acc }} />
    </div>
  );
};

// ============================== C4: the debt ticker (CH1 red) ==============================
export const ChartC4: React.FC<{ t: number }> = ({ t }) => {
  const th = RED;
  const digits = '40444342709389'.split('').map(Number);
  const groups = [2, 3, 3, 3, 3];
  const SPIN = 22.6;
  const lockAt = (i: number) => 23.0 + i * 0.215;           // 14 columns lock left to right 23.00 -> 25.80
  const pulse = prog(t, 25.96, 26.6);
  const rate = easeOut(prog(t, 26.3, 26.55));
  let idx = 0;
  const cells: React.ReactNode[] = [];
  groups.forEach((g, gi) => {
    if (gi > 0) cells.push(<div key={`c${gi}`} style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 118, color: LT.muted, width: 26, height: 184, lineHeight: '184px', display: 'flex', justifyContent: 'center', paddingTop: 22 }}>,</div>);
    for (let k = 0; k < g; k++, idx++) {
      cells.push(<DigitCell key={idx} t={t} digit={digits[idx]} spinAt={SPIN} lockAt={lockAt(idx)} th={th} w={92} h={184} fs={116} lh={180} radius={14} bar={6} blur="rs-vblur" seed={idx} />);
    }
  });
  return (
    <ChartFrame th={th} ey="The US national debt" h1={<>A number written in <Ak th={th}>dollars.</Ak></>}
      src="Source: US Treasury, Debt to the Penny (record date Oct 22, 2026) · daily growth = 12-month change / 365">
      <VBlurDefs />
      <div style={abs({ left: 120, top: 400, display: 'flex', gap: 10, zIndex: 2, borderRadius: 20,
        boxShadow: pulse > 0 && pulse < 1 ? `0 0 0 ${8 + 26 * pulse}px rgba(${th.rgb},${0.18 * (1 - pulse)})` : 'none' })}>
        <div style={{ fontFamily: JBMONO, fontWeight: 600, fontSize: 116, color: th.acc, width: 74, lineHeight: '184px' }}>$</div>
        {cells}
      </div>
      <div style={abs({ left: 120, top: 614, fontFamily: DMSANS, fontWeight: 500, fontSize: 32, color: LT.text2 })}>
        Total public debt outstanding, <M>Oct 22, 2026</M>
      </div>
      <div style={abs({ left: 120, top: 724, display: 'flex', alignItems: 'center', gap: 30, opacity: rate, transform: `scale(${lerp(0.92, 1, rate)})`, transformOrigin: 'left center' })}>
        <M style={{ fontSize: 56, color: th.acc, background: `rgba(${th.rgb},.08)`, border: `2px solid rgba(${th.rgb},.45)`, borderRadius: 100, padding: '10px 36px' }}>+6.7B a day</M>
        <div style={{ fontFamily: DMSANS, fontSize: 30, color: LT.text2 }}>average daily growth over the last <M>12</M> months</div>
      </div>
    </ChartFrame>
  );
};

// ============================== H5: 493 new billionaires (CH1 red) ==============================
const H5_K = Math.log(14 / 29) / Math.log((88.64 - 86.22) / (90.26 - 86.22));   // 14 columns lit at 'a record' 88.64
export const ChartH5: React.FC<{ t: number }> = ({ t }) => {
  const th = RED;
  const W0 = 86.22, W1 = 90.26;
  const colAt = (c: number) => W0 + (W1 - W0) * Math.pow((c + 1) / 29, 1 / H5_K);   // column c lands (0-based)
  const dots: React.ReactNode[] = [];
  for (let c = 0; c < 29; c++) {
    for (let r = 0; r < 17; r++) {
      const cx = 836.5 + c * 34, cy = 360 + r * 34;
      const at = colAt(c) - 4 / 30 + r * (0.5 / 30);
      const p = prog(t, at, at + 4 / 30);
      if (p <= 0) dots.push(<circle key={`${c}_${r}`} cx={cx} cy={cy} r={10.5} fill="#FFFFFF" stroke="#D3CFC4" strokeWidth={2} />);
      else dots.push(<circle key={`${c}_${r}`} cx={cx} cy={cy} r={11.5 * lerp(0.6, 1, easeOut(p))} fill={th.acc} />);
    }
  }
  const pulse = prog(t, 90.26, 90.9);
  const pill = easeOut(prog(t, 90.1, 90.4));
  const locks = [88.64, 89.52, 90.26];
  return (
    <ChartFrame th={th} ey={<><M>2020</M> to <M>2021</M></>} h1={<>A record wave of <Ak th={th}>brand new billionaires.</Ak></>}
      src="Source: Forbes World's Billionaires list, April 2021 (net worths as of March 5, 2021)">
      <VBlurDefs />
      <div style={abs({ left: 120, top: 372, display: 'flex', gap: 14, zIndex: 2, borderRadius: 22,
        boxShadow: pulse > 0 && pulse < 1 ? `0 0 0 ${8 + 30 * pulse}px rgba(${th.rgb},${0.2 * (1 - pulse)})` : 'none' })}>
        {[4, 9, 3].map((d, i) => (
          <DigitCell key={i} t={t} digit={d} spinAt={85.38} lockAt={locks[i]} th={th} w={176} h={250} fs={200} lh={246} radius={18} bar={7} blur="rs-vblurL" seed={i * 2.3} />
        ))}
      </div>
      <div style={abs({ left: 120, top: 660, zIndex: 2 })}>
        <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 40, color: LT.text }}>newcomers to the Forbes list</div>
        <div style={{ marginTop: 22, opacity: pill, transform: `scale(${lerp(0.9, 1, pill)})`, transformOrigin: 'left center' }}>
          <span style={{ display: 'inline-block', fontFamily: DMSANS, fontWeight: 700, fontSize: 24, letterSpacing: '.16em', textTransform: 'uppercase', color: th.acc,
            background: `rgba(${th.rgb},.08)`, border: `2px solid rgba(${th.rgb},.45)`, borderRadius: 100, padding: '8px 22px' }}>a record</span>
        </div>
      </div>
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">{dots}</svg>
      <div style={abs({ right: 120, top: 926, fontFamily: DMSANS, fontSize: 24, color: LT.muted, zIndex: 2 })}><M>1</M> dot = <M>1</M> new billionaire</div>
    </ChartFrame>
  );
};

// ============================== C6: where every tax dollar went (CH2 gold) ==============================
const RowLabel: React.FC<{ top: number; name: string; value: string; vOp: number; faded?: number; acc?: string }> = ({ top, name, value, vOp, faded = 1, acc }) => (
  <div style={abs({ left: 120, top, zIndex: 2, opacity: faded })}>
    <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 36, color: LT.text, lineHeight: 1.1 }}>{name}</div>
    <M style={{ display: 'block', fontSize: 44, color: acc ?? LT.text, marginTop: 8, lineHeight: 1.1, opacity: vOp, fontWeight: 400 }}>{value}</M>
  </div>
);
const Seg: React.FC<{ left: number; top: number; w: number; h: number; name: string; value: string; white: boolean; big?: boolean; op?: number }> = ({ left, top, w, h, name, value, white, big, op = 1 }) => (
  <div style={abs({ left, top, width: w, height: h, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'visible', opacity: op })}>
    <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: big ? 30 : 23, lineHeight: 1.15, color: white ? '#FFFFFF' : LT.text }}>{name}</div>
    <M style={{ fontSize: big ? 34 : 26, marginTop: 4, color: white ? '#FFFFFF' : LT.text, fontWeight: 400 }}>{value}</M>
  </div>
);
export const ChartC6: React.FC<{ t: number }> = ({ t }) => {
  const th = GOLD;
  const X0 = 400, TI_W = 1021.2, SP_W = 1397.8, TI_Y = 452, SP_Y = 712, H = 124;
  const spot2 = t >= 134.1;                                   // the second spot (136.17-148.70) after FACE 6
  // ---- spot 1 ----
  const tiP = easeOut(prog(t, 120.86, 122.26));
  const spP = easeOut(prog(t, 123.76, 124.96));
  const redP = prog(t, 125.88, 126.28);
  const borrowOp = easeOut(prog(t, 126.0, 126.4));
  const centsOp = easeOut(prog(t, 128.4, 128.72));
  const tiFill = spot2 ? th.pale : (spP > 0 ? mixHex(th.acc, th.mid, prog(t, 123.76, 124.1)) : th.acc);
  const spFill = redP > 0 ? mixHex(th.acc, th.mid, prog(t, 125.88, 126.2)) : th.acc;
  // ---- spot 2 ----
  const SEGS = [
    { x: 400.0, w: 198.8, at: 138.1, name: 'Net interest', v: '1.05T', lx: 416.0, lw: 176.8 },
    { x: 598.8, w: 315.1, at: 141.22, name: 'Social Security', v: '1.67T', lx: 614.8, lw: 293.1 },
    { x: 913.9, w: 202.8, at: 142.56, name: 'Medicare', v: '1.07T', lx: 929.9, lw: 180.8 },
    { x: 1116.7, w: 136.6, at: 143.20, name: 'Medicaid', v: '0.72T', lx: 1132.7, lw: 114.6 },
    { x: 1253.3, w: 78.6, at: 144.50, name: 'Veterans', v: '0.42T', lx: 0, lw: 0 },
  ];
  const all5 = t >= 147.32;
  const brk5 = easeOut(prog(t, 147.32, 147.82));
  const c19 = spot2 ? easeOut(prog(t, 138.3, 138.62)) * (1 - prog(t, 141.04, 141.3)) : 0;
  const c91 = easeOut(prog(t, 147.5, 147.82));
  const newest = SEGS.reduce((n, s, i) => (t >= s.at ? i : n), -1);
  return (
    <ChartFrame th={th} ey={<><M>FY2026</M> federal budget</>} h1={<>Where every <Ak th={th}>tax dollar</Ak> went.</>}
      src="Source: US Treasury, Final Monthly Treasury Statement FY2026 (Tables 5 and 9) · net interest = budget function 900">
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        <defs>
          <clipPath id="rs-c6-ti"><rect x={X0} y={TI_Y} width={TI_W} height={H} rx={12} /></clipPath>
          <clipPath id="rs-c6-sp"><rect x={X0} y={SP_Y} width={SP_W} height={H} rx={12} /></clipPath>
        </defs>
        {/* took-in row */}
        {!spot2 && tiP <= 0 && <rect x={X0} y={TI_Y} width={TI_W} height={H} rx={12} fill={th.track} stroke="#CFCABF" strokeWidth={2} strokeDasharray="10 8" />}
        {(spot2 || tiP > 0) && (
          <g clipPath="url(#rs-c6-ti)">
            {!spot2 && <rect x={X0} y={TI_Y} width={TI_W} height={H} fill={th.track} />}
            <rect x={X0} y={TI_Y} width={spot2 ? TI_W : TI_W * tiP} height={H} fill={tiFill} />
            {spot2 && SEGS.map((s, i) => {
              const p = i === 0 ? easeOut(prog(t, s.at, s.at + 0.52)) : easeOut(prog(t, s.at, s.at + 0.4));
              if (p <= 0) return null;
              const fill = all5 || i === newest ? th.acc : th.mid;
              return <rect key={i} x={s.x} y={TI_Y} width={s.w * p} height={H} fill={fill} />;
            })}
            {spot2 && SEGS.map((s, i) => (t >= s.at + (i === 0 ? 0.52 : 0.4) ? <rect key={`w${i}`} x={s.x + s.w - 1.5} y={TI_Y} width={3} height={H} fill="#FFFFFF" /> : null))}
          </g>
        )}
        {/* spent row */}
        <g opacity={spot2 ? 0.3 : 1}>
          {!spot2 && spP <= 0 && <rect x={X0} y={SP_Y} width={SP_W} height={H} rx={12} fill={th.track} stroke="#CFCABF" strokeWidth={2} strokeDasharray="10 8" />}
          {(spot2 || spP > 0) && (
            <g clipPath="url(#rs-c6-sp)">
              {!spot2 && <rect x={X0} y={SP_Y} width={SP_W} height={H} fill={th.track} />}
              <rect x={X0} y={SP_Y} width={spot2 ? SP_W : SP_W * spP} height={H} fill={spot2 ? th.mid : spFill} />
              {(spot2 || redP > 0) && <rect x={1421.2} y={SP_Y} width={376.7 * (spot2 ? 1 : redP)} height={H} fill={LT.red} />}
              {(spot2 || redP > 0) && <rect x={1419.7} y={SP_Y} width={3} height={H} fill="#FFFFFF" />}
            </g>
          )}
        </g>
        {!spot2 && redP > 0 && <line x1={1421.2} y1={582} x2={1421.2} y2={582 + 124 * easeOut(prog(t, 125.88, 126.3))} stroke={LT.wire} strokeWidth={2.5} strokeDasharray="5 6" />}
        {/* brackets */}
        {spot2 && c19 > 0 && <path d="M402.0,440 v-18 H596.8 v18" fill="none" stroke={th.acc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" opacity={c19} />}
        {spot2 && brk5 > 0 && <path d="M402.0,440 v-18 H1330.0 v18" fill="none" stroke={th.acc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray="1000" strokeDashoffset={1000 * (1 - brk5)} />}
      </svg>
      <RowLabel top={468} name="Took in" value={`${(5.4 * (spot2 ? 1 : tiP)).toFixed(1)}T`} vOp={spot2 || tiP > 0 ? 1 : 0} acc={!spot2 && tiP > 0 && spP <= 0 ? th.acc : undefined} />
      <RowLabel top={728} name="Spent" value={`${(7.4 * (spot2 ? 1 : spP)).toFixed(1)}T`} vOp={spot2 || spP > 0 ? 1 : 0} faded={spot2 ? 0.3 : 1}
        acc={!spot2 && spP > 0 && redP <= 0 ? th.acc : undefined} />
      {(spot2 || borrowOp > 0) && <Seg left={1439.2} top={SP_Y} w={346.7} h={H} name="Borrowed" value="2T" white big op={spot2 ? 0.3 : borrowOp} />}
      {!spot2 && centsOp > 0 && (
        <div style={abs({ right: 122, top: 858, zIndex: 2, fontFamily: DMSANS, fontSize: 34, color: LT.text2, whiteSpace: 'nowrap', lineHeight: 1.3, opacity: centsOp,
          transform: `translateY(${(1 - centsOp) * 10}px)` })}>
          = <M style={{ fontSize: 46, color: LT.red }}>27 cents</M> of every dollar spent
        </div>
      )}
      {spot2 && SEGS.slice(0, 4).map((s, i) => {
        const op = prog(t, s.at + 0.25, s.at + 0.5);
        if (op <= 0) return null;
        return <Seg key={i} left={s.lx} top={TI_Y} w={s.lw} h={H} name={s.name} value={s.v} white={all5 || i === newest} op={op} />;
      })}
      {spot2 && t >= SEGS[4].at + 0.25 && (
        <>
          <div style={abs({ left: 1291.6, top: 576, width: 2, height: 16, background: LT.wire, zIndex: 2, opacity: prog(t, SEGS[4].at + 0.25, SEGS[4].at + 0.5) })} />
          <div style={abs({ left: 1286.6, top: 590, zIndex: 2, whiteSpace: 'nowrap', fontSize: 23, opacity: prog(t, SEGS[4].at + 0.25, SEGS[4].at + 0.5) })}>
            <span style={{ fontFamily: DMSANS, fontWeight: 700, color: all5 || newest === 4 ? th.acc : LT.text }}>Veterans</span>{' '}
            <M style={{ fontSize: 24, fontWeight: 400, color: all5 || newest === 4 ? th.acc : LT.text }}>0.42T</M>
          </div>
        </>
      )}
      {spot2 && c19 > 0 && (
        <div style={abs({ left: 400, top: 360, zIndex: 2, fontFamily: DMSANS, fontSize: 34, color: LT.text2, whiteSpace: 'nowrap', lineHeight: 1.3, opacity: c19 })}>
          <M style={{ fontSize: 46, color: th.acc }}>19 cents</M> of every tax dollar
        </div>
      )}
      {spot2 && c91 > 0 && (
        <div style={abs({ left: 400, top: 360, zIndex: 2, fontFamily: DMSANS, fontSize: 34, color: LT.text2, whiteSpace: 'nowrap', lineHeight: 1.3, opacity: c91 })}>
          <M style={{ color: LT.text, fontWeight: 400 }}>4.93T</M> = <M style={{ fontSize: 46, color: th.acc }}>91 cents</M> of every dollar collected
        </div>
      )}
    </ChartFrame>
  );
};

// ============================== C7: who owns the debt (CH2 gold) ==============================
const Chip: React.FC<{ label: string; on: boolean; th: Theme }> = ({ label, on, th }) => (
  <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, fontFamily: DMSANS, fontWeight: 700, fontSize: 24,
    border: `2px solid ${on ? `rgba(${th.rgb},.55)` : LT.border}`, background: on ? `rgba(${th.rgb},.08)` : LT.cardHover, color: on ? th.acc : LT.text2 }}>{label}</span>
);
export const ChartC7: React.FC<{ t: number }> = ({ t }) => {
  const th = GOLD;
  const fillIn = easeOut(prog(t, 180.52, 182.4));
  const fillFor = easeOut(prog(t, 182.4, 183.0));
  const brk = easeOut(prog(t, 182.1, 182.7));
  const pct77 = Math.round(77 * easeOut(prog(t, 180.52, 183.34)));
  const op23 = prog(t, 183.0, 183.34);
  const split = t >= 184.04;
  const seams = easeOut(prog(t, 184.04, 184.4));
  const fed = t >= 184.44, trust = t >= 185.76, rest = t >= 187.9, settle = t >= 192.1, china = t >= 193.9;
  const segFill = (i: number) => {
    if (settle) return th.mid;
    const lit = rest ? 2 : trust ? 1 : fed ? 0 : -1;
    if (i === lit) return th.acc;
    if (i < lit) return th.mid;
    return th.pale;
  };
  const chipOn = [188.24, 189.2, 190.02, 191.36].map((c) => t >= c);
  const labelState = (i: number) => (settle ? 'normal' : (rest ? 2 : trust ? 1 : fed ? 0 : -1) === i ? 'hi' : (rest ? 2 : trust ? 1 : 0) > i ? 'normal' : 'ghost');
  const lab = (i: number) => labelState(i);
  const chinaOp = easeOut(prog(t, 193.9, 194.2));
  return (
    <ChartFrame th={th} ey="Who holds the US debt" h1={<>Who <Ak th={th}>owns</Ak> the debt.</>}
      src="Sources: Treasury TIC (foreign holders, Aug 2026) · Fed H.4.1 (week ended Oct 21, 2026) · Debt to the Penny (intragovernmental holdings)">
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        <defs><clipPath id="rs-c7-b"><rect x={120} y={520} width={1680} height={140} rx={14} /></clipPath></defs>
        <rect x={120} y={520} width={1680} height={140} rx={14} fill={th.track} stroke="#CFCABF" strokeWidth={2} strokeDasharray="10 8" opacity={fillFor >= 1 ? 0 : 1} />
        <g clipPath="url(#rs-c7-b)">
          {!split && fillIn > 0 && <rect x={120} y={520} width={1290.2 * fillIn} height={140} fill={th.acc} />}
          {split && (
            <>
              <rect x={120} y={520} width={189.8} height={140} fill={segFill(0)} />
              <rect x={309.8} y={520} width={325.9} height={140} fill={segFill(1)} />
              <rect x={635.8} y={520} width={774.5} height={140} fill={segFill(2)} />
              <rect x={308.3} y={520} width={3} height={140 * seams} fill="#FFFFFF" />
              <rect x={634.3} y={520} width={3} height={140 * seams} fill="#FFFFFF" />
            </>
          )}
          {fillFor > 0 && <rect x={1410.2} y={520} width={389.8 * fillFor} height={140} fill={th.neutral} />}
          {fillFor > 0 && <rect x={1408.2} y={520} width={4} height={140} fill="#FFFFFF" />}
          {china && <rect x={1775.3} y={520} width={24.7} height={140} fill={th.acc} opacity={chinaOp} />}
          {china && <rect x={1773.8} y={520} width={3} height={140} fill="#FFFFFF" opacity={chinaOp} />}
        </g>
        {brk > 0 && <path d="M122.0,506 v-18 H1402.2 v18" fill="none" stroke={th.acc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - brk)} />}
        {brk > 0 && <path d="M1418.2,506 v-18 H1798.0 v18" fill="none" stroke={LT.wire} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - brk)} />}
        {china && <line x1={1787.7} y1={664} x2={1787.7} y2={664 + 26 * chinaOp} stroke={th.acc} strokeWidth={3} />}
      </svg>
      {fillIn > 0 && (
        <div style={abs({ left: 120, top: 398, zIndex: 2, display: 'flex', alignItems: 'baseline', gap: 18, whiteSpace: 'nowrap' })}>
          <M style={{ fontSize: 72, lineHeight: 1, color: th.acc, fontWeight: 600 }}>{pct77}%</M>
          <span style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 36, color: LT.text }}>Inside the US</span>
        </div>
      )}
      {op23 > 0 && (
        <div style={abs({ right: 120, top: 398, zIndex: 2, display: 'flex', alignItems: 'baseline', gap: 18, whiteSpace: 'nowrap', opacity: op23 })}>
          <span style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 36, color: LT.text2 }}>Foreign</span>
          <M style={{ fontSize: 72, lineHeight: 1, color: LT.text2 }}>23%</M>
        </div>
      )}
      {fed && (
        <>
          {[{ left: 120, w: 178, n: 'The Fed', v: '11%' }, { left: 325.8, w: 300, n: 'Social Security and other trust funds', v: '19%' }].map((l, i) => {
            const st = lab(i);
            return (
              <div key={i} style={abs({ left: l.left, top: 684, width: l.w, zIndex: 2, opacity: st === 'ghost' ? 0.35 : 1 })}>
                <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 27, lineHeight: 1.2, color: st === 'hi' ? th.acc : LT.text }}>{l.n}</div>
                <M style={{ display: 'block', fontSize: 36, marginTop: 6, color: st === 'hi' ? th.acc : LT.text }}>{l.v}</M>
              </div>
            );
          })}
          <div style={abs({ left: 651.8, top: 686, width: 754, zIndex: 2, display: 'flex', flexWrap: 'wrap', gap: 12, opacity: rest ? 1 : 0.35 })}>
            {['US banks', 'pension funds', 'insurers', 'households'].map((c, i) => <Chip key={c} label={c} on={chipOn[i]} th={th} />)}
          </div>
        </>
      )}
      {china && (
        <div style={abs({ right: 120, top: 694, zIndex: 2, textAlign: 'right', opacity: chinaOp })}>
          <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 27, lineHeight: 1.2, color: th.acc }}>China</div>
          <M style={{ display: 'block', fontSize: 36, marginTop: 6, color: th.acc }}>1.5%</M>
        </div>
      )}
    </ChartFrame>
  );
};

// ============================== C2: the WWII playbook (CH3 gold) ==============================
const C2_PTS = [{ x: 533.3, y: 403.9 }, { x: 572.2, y: 480.5 }, { x: 727.8, y: 611.6 }, { x: 1622.2, y: 796.4 }];
export const ChartC2: React.FC<{ t: number }> = ({ t }) => {
  const th = GOLD;
  const spot2 = t >= 229.6;
  const axes = spot2 ? 1 : easeOut(prog(t, 205.85, 206.45));
  const pop = spot2 ? 1 : prog(t, 208.84, 209.2);
  const popS = pop <= 0 ? 0 : pop < 0.5 ? lerp(0, 1.15, pop / 0.5) : lerp(1.15, 1, (pop - 0.5) / 0.5);
  const halo = spot2 ? 1 : prog(t, 208.84, 209.5);
  const typeN = spot2 ? 16 : Math.floor(16 * prog(t, 210.6, 211.05));
  const band = spot2 ? 1 : easeInOut(prog(t, 211.58, 212.78));
  const bandLab = spot2 ? 1 : easeOut(prog(t, 217.1, 217.46));
  const pin = spot2 ? 1 : easeOut(prog(t, 219.16, 219.66));
  const box = spot2 ? 1 : easeOut(prog(t, 223.64, 224.0));
  // spot 2: the line draws 234.42 -> 238.08, linear in x
  const dp = spot2 ? prog(t, 234.42, 238.08) : 0;
  const xEnd = lerp(C2_PTS[0].x, C2_PTS[3].x, dp);
  const linePts: { x: number; y: number }[] = [C2_PTS[0]];
  for (let i = 1; i < C2_PTS.length; i++) {
    const a = C2_PTS[i - 1], b = C2_PTS[i];
    if (xEnd >= b.x) linePts.push(b);
    else { if (xEnd > a.x) linePts.push({ x: xEnd, y: lerp(a.y, b.y, (xEnd - a.x) / (b.x - a.x)) }); break; }
  }
  const lineD = linePts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = linePts[linePts.length - 1];
  const areaD = `${lineD} L${last.x.toFixed(1)},900 L533.3,900 Z`;
  const end74 = spot2 ? prog(t, 238.08, 238.4) : 0;
  const end74S = end74 <= 0 ? 0 : end74 < 0.5 ? lerp(0, 1.15, end74 / 0.5) : lerp(1.15, 1, (end74 - 0.5) / 0.5);
  const grid = [783.3, 666.7, 550.0, 433.3];
  const xt = [300.0, 494.4, 688.9, 883.3, 1077.8, 1272.2, 1466.7, 1661.1];
  const ys = [{ y: 885.0, l: '0%' }, { y: 768.3, l: '25%' }, { y: 651.7, l: '50%' }, { y: 535.0, l: '75%' }, { y: 418.3, l: '100%' }];
  const sub = 'still the record';
  return (
    <ChartFrame th={th} ey="Debt held by the public, % of GDP" h1={<>The <Ak th={th}>WWII</Ak> playbook.</>}
      src="Sources: OMB via FRED (FYPUGDA188S) · Federal Reserve History, The Treasury-Fed Accord · BLS CPI-U · points 1946, 1947, 1951, 1974">
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        {band > 0 && <rect x={387.5} y={340} width={348.1 * band} height={560} fill={`rgba(${th.rgb},.10)`} />}
        {bandLab > 0 && <path d="M389.5,330.0 v-16 H733.6 v16" fill="none" stroke={th.acc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" opacity={bandLab} />}
        {grid.map((y) => <line key={y} x1={300} y1={y} x2={300 + 1400 * axes} y2={y} stroke={LT.grid} strokeWidth={2} strokeDasharray="4 8" />)}
        <line x1={300} y1={900} x2={300 + 1400 * axes} y2={900} stroke={LT.axis} strokeWidth={3} />
        {xt.map((x) => (axes * 1400 + 300 >= x ? <line key={x} x1={x} y1={900} x2={x} y2={912} stroke={LT.axis} strokeWidth={3} /> : null))}
        {pin > 0 && <line x1={580} y1={900} x2={580} y2={900 - (900 - 462) * pin} stroke={th.acc} strokeWidth={3} strokeDasharray="8 7" />}
        {pin >= 1 && <line x1={580} y1={462} x2={580 + 220 * prog(t, spot2 ? 0 : 219.66, spot2 ? 1 : 219.96)} y2={462} stroke={th.acc} strokeWidth={3} />}
        {pin > 0 && <circle cx={580} cy={900} r={9} fill={th.acc} />}
        {dp > 0 && <path d={areaD} fill={`rgba(${th.rgb},.07)`} />}
        {dp > 0 && <path d={lineD} fill="none" stroke={th.acc} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />}
        {xEnd >= 572.2 && dp > 0 && <circle cx={572.2} cy={480.5} r={8} fill="#FFFFFF" stroke={th.acc} strokeWidth={4} />}
        {xEnd >= 727.8 && dp > 0 && <circle cx={727.8} cy={611.6} r={8} fill="#FFFFFF" stroke={th.acc} strokeWidth={4} />}
        {end74 > 0 && <circle cx={1622.2} cy={796.4} r={26 * end74S} fill={`rgba(${th.rgb},.16)`} />}
        {end74 > 0 && <circle cx={1622.2} cy={796.4} r={13 * end74S} fill={th.acc} />}
        {pop > 0 && <circle cx={533.3} cy={403.9} r={26 * lerp(1.6, 1, halo)} fill={`rgba(${th.rgb},${0.16 * (halo < 1 ? lerp(0.4, 1, halo) : 1)})`} />}
        {pop > 0 && <circle cx={533.3} cy={403.9} r={13 * popS} fill={th.acc} />}
      </svg>
      {ys.map((y) => <M key={y.l} style={abs({ left: 180, top: y.y, width: 96, textAlign: 'right', fontSize: 24, color: LT.muted, zIndex: 2, fontWeight: 600, opacity: axes })}>{y.l}</M>)}
      {xt.map((x, i) => <M key={x} style={abs({ left: x - 40, top: 922, width: 80, textAlign: 'center', fontSize: 24, color: LT.muted, zIndex: 2, opacity: axes })}>{1940 + 5 * i}</M>)}
      {bandLab > 0 && (
        <div style={abs({ left: 387.5, top: 260, zIndex: 2, fontFamily: DMSANS, fontWeight: 700, fontSize: 30, color: LT.text, whiteSpace: 'nowrap', opacity: bandLab })}>
          Long-term rates capped at <M style={{ color: th.acc }}>2.5%</M>{' '}
          <span style={{ fontWeight: 400, color: LT.text2 }}>(<M>1942</M> to <M>1951</M>)</span>
        </div>
      )}
      {pop > 0 && (
        <div style={abs({ left: 569.3, top: 351.9, zIndex: 2, whiteSpace: 'nowrap', opacity: prog(t, spot2 ? 0 : 208.84, spot2 ? 1 : 209.05) })}>
          <M style={{ display: 'block', fontSize: 48, lineHeight: 1.05, color: th.acc }}>106.3%</M>
          <div style={{ fontFamily: DMSANS, fontWeight: 500, fontSize: 28, color: LT.text2, marginTop: 4 }}>{sub.slice(0, typeN)}</div>
        </div>
      )}
      {box > 0 && (
        <div style={abs({ left: 800, top: 440, zIndex: 2, background: LT.card, border: `2px solid rgba(${th.rgb},.55)`, borderRadius: 14, padding: '12px 22px',
          boxShadow: '0 1px 2px rgba(20,22,26,.05),0 10px 24px rgba(20,22,26,.08)', whiteSpace: 'nowrap', opacity: box, transform: `scale(${lerp(0.9, 1, box)})`, transformOrigin: 'left center' })}>
          <div><span style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 30, color: LT.text }}>Inflation</span> <M style={{ fontSize: 32, color: th.acc }}>+19.7%</M></div>
          <div style={{ fontFamily: DMSANS, fontSize: 24, color: LT.text2, marginTop: 2 }}>March <M>1947</M></div>
        </div>
      )}
      {end74 > 0 && (
        <div style={abs({ left: 1558.2, top: 668.4, zIndex: 2, whiteSpace: 'nowrap', opacity: end74 })}>
          <M style={{ display: 'block', fontSize: 48, lineHeight: 1.05, color: th.acc }}>22.2%</M>
          <div style={{ fontFamily: DMSANS, fontWeight: 500, fontSize: 28, color: LT.text2, marginTop: 4 }}>in <M>1974</M></div>
        </div>
      )}
    </ChartFrame>
  );
};

// ============================== C8: the lenders say no (CH4 gold) ==============================
export const ChartC8: React.FC<{ t: number }> = ({ t }) => {
  const th = GOLD;
  const X0 = 520, PX = 162.85;                               // 2% = 325.7 px
  const rows = [
    { y: 318, nm: 'US', mt: '10', v: 5.31, dec: 2, grow: [355.72, 356.12], name: 355.72, note: <>highest close since <M>2002</M> · Oct <M>5</M>, <M>2026</M></> },
    { y: 528, nm: 'UK', mt: '30', v: 6.03, dec: 2, grow: [359.12, 359.84], name: 357.86, note: <>intraday · first above <M>6%</M> since <M>1998</M> · Oct <M>1</M>, <M>2026</M></> },
    { y: 738, nm: 'Japan', mt: '30', v: 4.168, dec: 3, grow: [363.78, 364.36], name: 362.68, note: <>a record · Oct <M>6</M>, <M>2026</M></> },
  ];
  const active = t >= 362.68 ? 2 : t >= 357.86 ? 1 : 0;
  return (
    <ChartFrame th={th} ey={<>Long-term government bond yields, October <M>2026</M></>} h1={<>The lenders <Ak th={th}>say no.</Ak></>}
      src="Sources: US Treasury par yield curve (close) · UK: LSEG data via roic.ai (intraday) · Japan Ministry of Finance (JGB yields)">
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        {[520.0, 845.7, 1171.4, 1497.1].map((x) => <line key={x} x1={x} y1={296} x2={x} y2={930} stroke={LT.grid} strokeWidth={2} strokeDasharray="4 8" />)}
        {rows.map((r, i) => {
          const p = easeOut(prog(t, r.grow[0], r.grow[1]));
          const w = r.v * PX * p;
          const fill = i === active ? th.acc : th.mid;
          return (
            <g key={i}>
              {p < 1 && <rect x={X0} y={r.y} width={1180} height={92} rx={10} fill={th.track} stroke="#CFCABF" strokeWidth={2} strokeDasharray="10 8" />}
              {p > 0 && <rect x={X0} y={r.y} width={w} height={92} rx={10} fill={fill} />}
            </g>
          );
        })}
        <line x1={520} y1={296} x2={520} y2={930} stroke={LT.axis} strokeWidth={3} />
      </svg>
      {['0%', '2%', '4%', '6%'].map((l, i) => <M key={l} style={abs({ left: 480 + i * 325.7, top: 942, width: 80, textAlign: 'center', fontSize: 24, color: LT.muted, zIndex: 2 })}>{l}</M>)}
      {rows.map((r, i) => {
        const p = easeOut(prog(t, r.grow[0], r.grow[1]));
        const hi = i === active && t >= r.name;
        const noteOp = i === 0 ? 1 : prog(t, r.grow[1] - 0.1, r.grow[1] + 0.25);
        return (
          <React.Fragment key={i}>
            <div style={abs({ left: 120, top: r.y + 2, zIndex: 2 })}>
              <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: hi ? th.acc : LT.text }}>{r.nm}</div>
              <div style={{ fontFamily: DMSANS, fontSize: 28, color: LT.text2, marginTop: 6 }}><M>{r.mt}</M>-year</div>
            </div>
            {p > 0 && (
              <M style={abs({ left: X0 + r.v * PX * p + 22, top: r.y + 14, fontSize: 56, lineHeight: 1.1, color: i === active ? th.acc : LT.text, zIndex: 2, whiteSpace: 'nowrap' })}>
                {(r.v * p).toFixed(r.dec)}%
              </M>
            )}
            {noteOp > 0 && p > 0 && (
              <div style={abs({ left: 536, top: r.y + 106, zIndex: 2, fontFamily: DMSANS, fontSize: 26, color: i === active ? LT.text : LT.text2, whiteSpace: 'nowrap', opacity: noteOp })}>{r.note}</div>
            )}
          </React.Fragment>
        );
      })}
    </ChartFrame>
  );
};

// ============================== C17: printing into a crisis (CH6 gold) ==============================
type PanelSt = 'on' | 'seen' | 'dim';
const Panel: React.FC<{ left: number; st: PanelSt; th: Theme; label: string; big: string; bigOp: number; tag: React.ReactNode; tagOp: number }> = ({ left, st, th, label, big, bigOp, tag, tagOp }) => {
  const on = st === 'on';
  return (
    <div style={abs({ left, top: 282, width: 520, height: 700, zIndex: 1, boxSizing: 'border-box', borderRadius: 18, padding: '30px 36px',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      border: `3px solid ${on ? th.acc : st === 'seen' ? `rgba(${th.rgb},.42)` : LT.border}`,
      background: on ? `linear-gradient(180deg, rgba(${th.rgb},.09), rgba(${th.rgb},.02)), ${LT.card}` : LT.card,
      boxShadow: on ? `0 0 0 7px rgba(${th.rgb},.13), 0 16px 34px rgba(20,22,26,.14)` : st === 'dim' ? 'none' : '0 1px 2px rgba(20,22,26,.05),0 14px 34px rgba(20,22,26,.08)',
      opacity: st === 'dim' ? 0.36 : 1 })}>
      <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 34, color: on ? th.acc : LT.text }}>{label}</div>
      <M style={{ display: 'block', fontSize: 88, lineHeight: 1, marginTop: 18, color: on ? th.acc : LT.text, opacity: bigOp }}>{big}</M>
      <div style={{ fontFamily: DMSANS, fontSize: 25, lineHeight: 1.35, color: LT.text2, marginTop: 16, opacity: tagOp }}>{tag}</div>
    </div>
  );
};
export const ChartC17: React.FC<{ t: number }> = ({ t }) => {
  const th = GOLD;
  const spot2 = t >= 604.1;
  // panel 1 (fed)
  const fedBar = easeOut(prog(t, 588.64, 589.64));
  const fedNum = lerp(4.16, 8.97, easeOut(prog(t, 588.64, 589.54)));
  const fedTag = prog(t, 591.3, 591.6);
  // panel 2 (M2)
  const p2on = t >= 593.6;
  const m2a = easeOut(prog(t, 593.7, 594.5));
  const m2b = easeOut(prog(t, 598.0, 599.0));
  const m2Num = 40.6 * easeOut(prog(t, 598.0, 599.16));
  // panel 3 (wealth)
  const wb = easeOut(prog(t, 608.36, 610.02));
  const wNum = lerp(8, 13.1, wb);
  const wTag = prog(t, 609.7, 610.02);
  const ring = easeOut(prog(t, 611.4, 611.7));
  const st1: PanelSt = spot2 || p2on ? 'seen' : 'on';
  const st2: PanelSt = spot2 ? 'seen' : p2on ? 'on' : 'dim';
  const st3: PanelSt = spot2 ? 'on' : 'dim';
  const bar = (x: number, h: number, p: number, fill: string, key: string) => (p > 0 ? <rect key={key} x={x} y={890 - h * p} width={120} height={h * p} rx={8} fill={fill} /> : null);
  const bv = (left: number, top: number, s: string, op: number, hi: boolean) => (op > 0 ? <M key={`${left}`} style={abs({ left, top, width: 180, textAlign: 'center', fontSize: 28, color: hi ? th.acc : LT.text2, zIndex: 4, opacity: op })}>{s}</M> : null);
  const bd = (left: number, label: React.ReactNode, key: string, call = 0) => (
    <div key={key} style={abs({ left, top: 904, width: 200, textAlign: 'center', fontFamily: DMSANS, fontWeight: call > 0.5 ? 700 : 500, fontSize: 24, color: call > 0.5 ? th.acc : LT.text2, whiteSpace: 'nowrap', zIndex: 4 })}>
      {call > 0 && <div style={abs({ left: 6, right: 6, top: -6, bottom: -6, border: `2.5px solid ${th.acc}`, borderRadius: 100, background: `rgba(${th.rgb},.07)`, zIndex: -1, opacity: call, transform: `scale(${lerp(1.15, 1, call)})` })} />}
      {label}
    </div>
  );
  const p1Active = !spot2 && !p2on;
  return (
    <ChartFrame th={th} ey={<><M>2020</M> to <M>2022</M></>} h1={<>Printing into a <Ak th={th}>crisis.</Ak></>}
      src="Sources: FRED WALCL (Fed total assets) · FRED M2SL · Forbes World's Billionaires lists, 2020 and 2021 (via Forbes' April 2021 coverage)">
      <Panel left={120} st={st1} th={th} label="Fed balance sheet" big={`${(spot2 ? 8.97 : fedNum).toFixed(2)}T`} bigOp={1}
        tag={<>more than double<br />Feb <M style={{ color: LT.text }}>2020</M> to Apr <M style={{ color: LT.text }}>2022</M></>} tagOp={spot2 ? 1 : fedTag} />
      <Panel left={680} st={st2} th={th} label="Money supply (M2)" big={`+${(spot2 ? 40.6 : m2Num).toFixed(1)}%`} bigOp={spot2 || p2on ? 1 : 0}
        tag={<>Feb <M style={{ color: LT.text }}>2020</M> to Mar <M style={{ color: LT.text }}>2022</M></>} tagOp={spot2 ? 1 : prog(t, 598.0, 598.4)} />
      <Panel left={1240} st={st3} th={th} label="Billionaire wealth" big={wb <= 0 ? '8T' : `${wNum.toFixed(1)}T`} bigOp={spot2 ? 1 : 0}
        tag={<><M style={{ color: LT.text }}>2,755</M> billionaires, a record<br />(Forbes <M style={{ color: LT.text }}>2021</M>)</>} tagOp={spot2 ? wTag : 0} />
      <svg style={abs({ left: 0, top: 0, width: 1920, height: 1080, zIndex: 3 })} viewBox="0 0 1920 1080">
        {bar(230, 109.5, 1, th.mid, 'f1')}
        {bar(410, 236, spot2 ? 1 : fedBar, p1Active ? th.acc : th.mid, 'f2')}
        <line x1={190} y1={890} x2={570} y2={890} stroke={LT.axis} strokeWidth={3} />
        {(spot2 || p2on) && bar(790, 167.8, spot2 ? 1 : m2a, th.mid, 'm1')}
        {(spot2 || p2on) && bar(970, 236, spot2 ? 1 : m2b, !spot2 ? th.acc : th.mid, 'm2')}
        {(spot2 || p2on) && <line x1={750} y1={890} x2={1130} y2={890} stroke={LT.axis} strokeWidth={3} />}
        {spot2 && bar(1350, 144.1, 1, th.mid, 'w1')}
        {spot2 && bar(1530, 236, wb, th.acc, 'w2')}
        {spot2 && <line x1={1310} y1={890} x2={1690} y2={890} stroke={LT.axis} strokeWidth={3} />}
      </svg>
      {bv(200, 736.5, '4.16T', 1, false)}
      {bv(380, 610, '8.97T', spot2 ? 1 : prog(t, 589.3, 589.6), p1Active)}
      {bd(190, <>Feb <M>2020</M></>, 'd1')}
      {bd(370, <>Apr <M>2022</M></>, 'd2')}
      {(spot2 || p2on) && bv(760, 678.2, '15.5T', spot2 ? 1 : prog(t, 594.3, 594.6), false)}
      {(spot2 || p2on) && bv(940, 610, '21.8T', spot2 ? 1 : prog(t, 598.8, 599.1), !spot2)}
      {(spot2 || p2on) && bd(750, <>Feb <M>2020</M></>, 'd3')}
      {(spot2 || p2on) && bd(930, <>Mar <M>2022</M></>, 'd4')}
      {spot2 && bv(1320, 701.9, '8T', 1, false)}
      {spot2 && bv(1500, 610, '13.1T', prog(t, 609.8, 610.05), true)}
      {spot2 && bd(1310, <><M>2020</M> list</>, 'd5', ring)}
      {spot2 && bd(1490, <><M>2021</M> list</>, 'd6')}
    </ChartFrame>
  );
};
