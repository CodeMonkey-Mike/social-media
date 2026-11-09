// quant (longform-edited, 2026-11-05): the three REAL animated charts, built to assets/charts/C5-spec.md, C6-spec.md,
// C7-spec.md on the locked stylesheet + container-canonical-light.css + accents/quant.css. Every element is a pure function of
// `t`, the SOURCE spine time handed in by the comp (frozen through a pause), so one chart reads the same inside a screen-share
// deck area and full frame. No PNG stands in for a beat (comp-build section 7).
import React from 'react';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDmSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import {
  C5_AREA, C5_LINE, C6_COLORS, C6_END_LABELS, C6_LEGEND_X, C6_SCALE_A, C6_SCALE_B, C6_SERIES, C7_1Y, C7_LONG, C7_SCALE_S1, C7_SCALE_S2, ORD,
} from './QuantData';

loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
loadDmSans('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });

const FPS = 30;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, a: number, frames: number) => clamp01((t - a) / (frames / FPS));
const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// The stylesheet rules these charts use, the values copied from assets/charts/C5.html (locked + light + quant accent).
const CSS = `
.qc{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#FFFFFF;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start;padding:52px 96px 0;color:#43403E;font-family:'DM Sans',sans-serif;box-sizing:border-box}
.qc *{box-sizing:border-box}
.qc::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.05;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.qc .orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;width:720px;height:720px;top:-330px;right:-230px;background:#F15A22;opacity:.11}
.qc>*:not(.orb){position:relative;z-index:1}
.qc .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#737070;margin-bottom:8px;line-height:36px;height:36px}
.qc .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.qc .ey .mono{font-weight:600}
.qc h1{font-family:'Playfair Display',serif;font-weight:900;letter-spacing:-.02em;color:#43403E;max-width:1440px;margin:0;font-size:66px;line-height:72px}
.qc .hl{color:#D14A14;font-style:normal}
.qc .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,#F15A22,rgba(241,90,34,.25));margin:32px 0}
.qc svg{display:block;overflow:visible}
.qc svg text{font-family:'DM Sans',sans-serif}
.qc svg .lab,.qc svg .sub,.qc svg .big,.qc svg .end,.qc svg .cap{paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}
.qc svg .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.qc svg .tk{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600;fill:#737070}
.qc svg .cap{font-size:26px;font-weight:500;fill:#5C5855}
.qc svg .lab{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;fill:#43403E}
.qc svg .lab.o{fill:#D14A14}
.qc svg .sub{font-size:27px;font-weight:600;fill:#5C5855}
.qc svg .big{font-family:'JetBrains Mono',monospace;font-size:92px;font-weight:700;fill:#D14A14}
.qc svg .leg{font-size:29px;font-weight:600;fill:#5C5855}
.qc svg .leg.o{fill:#D14A14;font-weight:700}
.qc svg .end{font-family:'JetBrains Mono',monospace;font-size:29px;font-weight:600;fill:#5C5855}
.qc .foot{height:82px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.qc .take{font-family:'DM Sans';font-size:40px;font-weight:700;color:#43403E;white-space:nowrap}
.qc .src{font-family:'DM Sans';font-size:24px;font-weight:500;color:#737070;text-align:right;line-height:1.3;white-space:nowrap;margin-left:auto}
.qc .src .mono{font-weight:500}
`;

const Frame: React.FC<{ eyebrow: React.ReactNode; head: React.ReactNode; foot: React.ReactNode; children: React.ReactNode }> = ({ eyebrow, head, foot, children }) => (
  <div className="qc">
    <style>{CSS}</style>
    <div className="orb" />
    <div className="ey">{eyebrow}</div>
    <h1>{head}</h1>
    <div className="divider" />
    <svg width={1728} height={710} viewBox="0 0 1728 710">{children}</svg>
    <div className="foot">{foot}</div>
  </div>
);

const Fade: React.FC<{ o: number; dy?: number; children: React.ReactNode }> = ({ o, dy = 0, children }) => (
  o <= 0 ? null : <g opacity={o} transform={`translate(0 ${dy})`}>{children}</g>
);
const land = (t: number, a: number, n = 8) => ({ o: ramp(t, a, n), dy: 6 * (1 - ramp(t, a, n)) });   // fade up 6 px over 8 frames (C5-spec)
const Ring: React.FC<{ x: number; y: number; r?: number; p: number }> = ({ x, y, r = 11, p }) => (
  p <= 0 ? null : <circle cx={x} cy={y} r={r * p} fill="#fff" stroke="#F15A22" strokeWidth={4.5} />
);
const Dot: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D14A14" strokeWidth={3.5} strokeDasharray="2 10" strokeLinecap="round" />
);
const SEP = <><tspan dx="5">·</tspan><tspan dx="5"> </tspan></>;
const Take: React.FC<{ t: number; at: number; children: React.ReactNode }> = ({ t, at, children }) => {
  const p = ramp(t, at, 12);
  return <div className="take" style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{children}</div>;
};

// ---------------------------------------------------------------- C5: QNT share of the total crypto market cap
const C5_TICKS_Y: [string, number][] = [['0%', 650], ['0.05%', 550.3], ['0.10%', 450.7], ['0.15%', 351], ['0.20%', 251.3], ['0.25%', 151.7], ['0.30%', 52]];
const C5_TICKS_X: [string, number][] = [['2019', 148.2], ['2020', 323.4], ['2021', 499.1], ['2022', 674.3], ['2023', 849.5], ['2024', 1024.7], ['2025', 1200.4], ['2026', 1375.6]];

export const C5Chart: React.FC<{ t: number }> = ({ t }) => {
  const clip = clamp01((t - 401.58) / (406.2 - 401.58));                     // line + area clip, linear, ending on "2018."
  const bandP = ramp(t, 413.72, 45);                                          // band wipes over 45 frames from "bled"
  const dotP = ramp(t, 431.28, 20);                                           // the dotted line: peak ring -> right edge -> down
  const d1 = clamp01(dotP / 0.68), d2 = clamp01((dotP - 0.68) / 0.32);
  const peakLab = land(t, 409.98), bandLab = land(t, 416.4), lowLab = land(t, 423.7), endLab = land(t, 426.24), runLab = land(t, 428.54), peakRef = land(t, 431.28 + 8 / FPS);
  return (
    <Frame
      eyebrow={<>Ratio <span className="mono">1</span> of <span className="mono">3</span></>}
      head={<>Share of the total <span className="hl">crypto market</span></>}
      foot={<>{t >= 431.28 ? <Take t={t} at={431.28}>Still only <span className="hl">a third</span> of where it was in <span className="mono">2022</span>.</Take> : null}<div className="src">Source: CoinMarketCap</div></>}
    >
      <defs><clipPath id="c5clip"><rect x={104} y={0} width={(1523 - 104) * clip + 6} height={710} /></clipPath></defs>
      <text x={0} y={24} className="cap" textAnchor="start"><tspan className="mono">QNT</tspan> market cap as a share of the total crypto market cap</text>
      {C5_TICKS_Y.map(([l, y], i) => (
        <React.Fragment key={l}>
          <line x1={104} y1={y} x2={1523} y2={y} stroke={i === 0 ? '#9A9693' : '#ECE9E5'} strokeWidth={i === 0 ? 2.5 : 2} />
          <text x={88} y={y + 8} className="tk" textAnchor="end">{l}</text>
        </React.Fragment>
      ))}
      {C5_TICKS_X.map(([l, x]) => (
        <React.Fragment key={l}>
          <line x1={x} y1={650} x2={x} y2={659} stroke="#9A9693" strokeWidth={2.5} />
          <text x={x} y={690} className="tk" textAnchor="middle">{l}</text>
        </React.Fragment>
      ))}
      {bandP > 0 ? <rect x={1106.3} y={570.3} width={384 * bandP} height={19.9} fill="rgba(241,90,34,.24)" /> : null}
      {clip > 0 ? (
        <g clipPath="url(#c5clip)">
          <path d={C5_AREA} fill="rgba(241,90,34,.14)" />
          <path d={C5_LINE} fill="none" stroke="#F15A22" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ) : null}
      <Ring x={813.5} y={113.8} p={ramp(t, 406.88, 8)} />
      <Fade {...peakLab}>
        <text x={837.5} y={97.8} className="lab o" textAnchor="start">0.269%</text>
        <text x={985.5} y={97.8} className="sub" textAnchor="start"><tspan className="mono">18 Oct 2022</tspan> {SEP}in a bear market</text>
      </Fade>
      <Fade {...bandLab}><text x={1348.3} y={532.3} className="lab o" textAnchor="middle">0.03 to 0.04%</text></Fade>
      <Ring x={1490.4} y={593.6} r={9} p={ramp(t, 423.7, 8)} />
      <Fade {...lowLab}>
        <text x={1474.4} y={638} className="sub" textAnchor="end"><tspan className="mono">28 Aug 2026</tspan></text>
        <text x={1278.4} y={638} className="lab o" textAnchor="end">0.028%</text>
      </Fade>
      <Ring x={1523} y={465.9} p={ramp(t, 426.24, 8)} />
      <Fade {...endLab}>
        <text x={1545} y={471.9} className="lab o" textAnchor="start">0.092%</text>
        <text x={1545} y={505.9} className="sub" textAnchor="start"><tspan className="mono">4 Nov 2026</tspan></text>
      </Fade>
      <Fade {...runLab}><text x={1493} y={391.9} className="sub" textAnchor="end">around <tspan className="mono">3.3x</tspan> in <tspan className="mono">10</tspan> weeks</text></Fade>
      {d1 > 0 ? <Dot x1={813.5} y1={113.8} x2={lerp(813.5, 1539, d1)} y2={113.8} /> : null}
      {d2 > 0 ? <Dot x1={1523} y1={113.8} x2={1523} y2={lerp(113.8, 449.9, d2)} /> : null}
      <Fade {...peakRef}>
        <text x={1545} y={119.8} className="lab" textAnchor="start">0.269%</text>
        <text x={1545} y={153.8} className="sub" textAnchor="start"><tspan className="mono">2022</tspan> peak</text>
      </Fade>
    </Frame>
  );
};

// ---------------------------------------------------------------- C6: Quant against the peers, indexed to 100
const C6_TICKS_X: [string, number][] = [['Nov 2025', 84], ['Jan', 302.3], ['Mar', 528.2], ['May', 761.9], ['Jul', 995.5], ['Sep', 1232.9], ['Nov 2026', 1466.5]];
const C6_ORDER = ['CC', 'HBAR', 'XRP', 'XLM', 'LINK', 'BTC', 'QNT'];
const C6_LEGEND: { k: string; name: string; at: number }[] = [
  { k: 'QNT', name: 'Quant', at: 0 }, { k: 'LINK', name: 'Chainlink', at: 434.68 }, { k: 'HBAR', name: 'Hedera', at: 435.22 },
  { k: 'XRP', name: 'XRP', at: 435.94 }, { k: 'XLM', name: 'Stellar', at: 436.48 }, { k: 'CC', name: 'Canton', at: 436.86 }, { k: 'BTC', name: 'Bitcoin', at: 441.46 },
];
const X0 = C6_SCALE_A.x0, X1 = C6_SCALE_A.x1;
const c6X = (ord: number) => C6_SCALE_A.left + ((ord - X0) / (X1 - X0)) * (C6_SCALE_A.right - C6_SCALE_A.left);

// the draw's date cut (ordinal): 434.68 -> 442.30 reaches 2026-08-31; holds; 455.84 -> 456.52 to 2026-10-01; 456.66 -> 458.38 to 2026-11-04
const c6Cut = (t: number) => {
  if (t < 434.68) return X0;
  if (t < 442.3) return lerp(X0, ORD.d20260831, (t - 434.68) / (442.3 - 434.68));
  if (t < 455.84) return ORD.d20260831;
  if (t < 456.52) return lerp(ORD.d20260831, ORD.d20261001, (t - 455.84) / (456.52 - 455.84));
  if (t < 456.66) return ORD.d20261001;
  if (t < 458.38) return lerp(ORD.d20261001, ORD.d20261104, (t - 456.66) / (458.38 - 456.66));
  return ORD.d20261104;
};
const c6Path = (s: [number, number][], cut: number, y: (v: number) => number) => {
  let d = '';
  for (let i = 0; i < s.length; i++) {
    const [o, v] = s[i];
    if (o > cut) {
      if (i > 0) {
        const [po, pv] = s[i - 1];
        const p = (cut - po) / (o - po);
        d += `L${c6X(cut).toFixed(1)} ${y(lerp(pv, v, p)).toFixed(1)}`;
      }
      break;
    }
    d += `${i ? 'L' : 'M'}${c6X(o).toFixed(1)} ${y(v).toFixed(1)}`;
  }
  return d;
};

export const C6Chart: React.FC<{ t: number }> = ({ t }) => {
  const rs = easeInOut((t - 455.84) / (456.52 - 455.84));                     // y axis rescale A -> B, ending on "group."
  const y1 = lerp(C6_SCALE_A.y1, C6_SCALE_B.y1, rs);
  const yOf = (v: number) => C6_SCALE_A.bottom - (v / y1) * (C6_SCALE_A.bottom - C6_SCALE_A.top);
  const cut = c6Cut(t);
  const marks = 1 - ramp(t, 455.84, 8);                                       // the 140 and 82 markers fade on "line leaves the group"
  const base = ramp(t, 438.1, 8);
  const btc = t >= 441.46 ? ramp(t, 441.46, 8) : 0;
  const payoff = t >= 461.06;
  const bl = { x: lerp(1472, 1267.4, rs), y: lerp(273.5, 461.5, rs) };        // the baseline label moves with the rescale
  const ticks: { v: number; o: number }[] = [
    { v: 0, o: 1 }, { v: 100, o: 1 }, { v: 50, o: 1 - rs }, { v: 150, o: 1 - rs },
    { v: 200, o: rs }, { v: 300, o: rs }, { v: 400, o: rs },
  ];
  return (
    <Frame
      eyebrow={<>Ratio <span className="mono">2</span> of <span className="mono">3</span></>}
      head={<>Quant against <span className="hl">the peers</span></>}
      foot={<>{payoff ? <Take t={t} at={461.06}>Every other line ends <span className="hl">below <span className="mono">100</span></span>.</Take> : null}<div className="src">Source: CoinGecko<br />Canton indexed from its first CoinGecko day, <span className="mono">2025-11-10</span></div></>}
    >
      {ticks.map(({ v, o }) => {
        const y = yOf(v);
        if (o <= 0 || y < C6_SCALE_A.top - 2) return null;
        return (
          <g key={v} opacity={o}>
            <line x1={84} y1={y} x2={1478} y2={y} stroke={v === 0 ? '#9A9693' : '#ECE9E5'} strokeWidth={v === 0 ? 2.5 : 2} />
            <text x={68} y={y + 8} className="tk" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {C6_TICKS_X.map(([l, x]) => (
        <React.Fragment key={l}>
          <line x1={x} y1={650} x2={x} y2={659} stroke="#9A9693" strokeWidth={2.5} />
          <text x={x} y={690} className="tk" textAnchor="middle">{l}</text>
        </React.Fragment>
      ))}
      {base > 0 ? (
        <g opacity={base}>
          <line x1={84} y1={yOf(100)} x2={1478} y2={yOf(100)} stroke="#43403E" strokeWidth={2.5} strokeDasharray="10 8" />
          <text x={bl.x} y={bl.y} className="sub" textAnchor="end">indexed to <tspan className="mono">100</tspan> {SEP}<tspan className="mono">2025-11-05</tspan></text>
        </g>
      ) : null}
      {C6_LEGEND.map((l, i) => {
        const p = l.k === 'QNT' ? 1 : ramp(t, l.at, 8);
        if (p <= 0) return null;
        const x = C6_LEGEND_X[i];
        return (
          <g key={l.k} opacity={p} transform={`translate(0 ${(1 - p) * 6})`}>
            {l.k === 'BTC'
              ? <line x1={x} y1={26} x2={x + 36} y2={26} stroke={C6_COLORS[l.k]} strokeWidth={4} strokeDasharray="8 7" />
              : <line x1={x} y1={26} x2={x + 36} y2={26} stroke={C6_COLORS[l.k]} strokeWidth={l.k === 'QNT' ? 6 : 4.5} strokeLinecap="round" />}
            <text x={x + 46} y={36} className={l.k === 'QNT' ? 'leg o' : 'leg'} textAnchor="start">{l.name}</text>
          </g>
        );
      })}
      {t >= 434.68 ? C6_ORDER.map((k) => {
        if (k === 'BTC' && btc <= 0) return null;
        const w = k === 'QNT' ? 5.5 : k === 'BTC' ? 3.2 : 3;
        return (
          <path key={k} d={c6Path(C6_SERIES[k], cut, yOf)} fill="none" stroke={C6_COLORS[k]} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={k === 'BTC' ? '9 8' : undefined} opacity={k === 'BTC' ? btc : 1} />
        );
      }) : null}
      {t >= 445.92 && marks > 0 ? (
        <g opacity={marks}>
          <Ring x={183.6} y={yOf(140.04)} p={ramp(t, 445.92, 8)} />
          <Fade {...land(t, 445.92)}>
            <text x={217.6} y={148.4} className="lab o" textAnchor="start">140</text>
            <text x={217.6} y={184.4} className="sub" textAnchor="start"><tspan className="mono">1 Dec 2025</tspan></text>
          </Fade>
        </g>
      ) : null}
      {t >= 449.42 && marks > 0 ? (
        <g opacity={marks}>
          <Ring x={1229.1} y={351.2} p={ramp(t, 449.42, 8)} />
          <Fade {...land(t, 449.42)}>
            <text x={1251.1} y={365.2} className="lab o" textAnchor="start">82</text>
            <text x={1251.1} y={399.2} className="sub" textAnchor="start"><tspan className="mono">31 Aug 2026</tspan></text>
          </Fade>
        </g>
      ) : null}
      <Ring x={1478} y={254.3} p={ramp(t, 458.38, 8)} />
      <Fade {...land(t, 458.38)}>
        <text x={1500} y={284.3} className="big" textAnchor="start">273</text>
        <text x={1502} y={322.3} className="sub" textAnchor="start">Quant</text>
      </Fade>
      {payoff ? C6_END_LABELS.map((e, i) => {
        const p = ramp(t, 461.06 + (i * 3) / FPS, 6);                         // stagger top to bottom, 3 frames apart
        return p <= 0 ? null : (
          <g key={e.k} opacity={p}>
            <path d={`M1481 ${e.true_y} L1504 ${e.label_y}`} stroke={C6_COLORS[e.k]} strokeWidth={2} fill="none" />
            <text x={1512} y={e.label_y + 10} className="end" textAnchor="start">{`${e.k} ${e.v}`}</text>
          </g>
        );
      }) : null}
    </Frame>
  );
};

// ---------------------------------------------------------------- C7: Quant priced in Bitcoin, one chart, two states
const C7_S1_X: [string, number][] = [['Nov 2025', 120], ['Jan', 320.1], ['Mar', 527.3], ['May', 741.4], ['Jul', 955.6], ['Sep', 1173.3], ['Nov 2026', 1387.5]];
const C7_S2_X: [string, number][] = [['2019', 181.2], ['2020', 336.3], ['2021', 491.8], ['2022', 646.8], ['2023', 801.9], ['2024', 957], ['2025', 1112.5], ['2026', 1267.6]];
const C7_ROWS: number[] = [650, 500.5, 351, 201.5, 52];
const C7_S1_Y = ['0', '0.001', '0.002', '0.003', '0.004'];
const C7_S2_Y = ['0', '0.003', '0.006', '0.009', '0.012'];
const ZOOM_A = 481.08, ZOOM_F = 46;

const c7Paths = (s: [number, number][], cut: number, xOf: (o: number) => number, yOf: (v: number) => number) => {
  let d = '', lastX = xOf(s[0][0]);
  for (let i = 0; i < s.length; i++) {
    const [o, v] = s[i];
    if (o > cut) {
      if (i > 0) {
        const [po, pv] = s[i - 1];
        const p = (cut - po) / (o - po);
        lastX = xOf(cut);
        d += `L${lastX.toFixed(1)} ${yOf(lerp(pv, v, p)).toFixed(1)}`;
      }
      break;
    }
    lastX = xOf(o);
    d += `${i ? 'L' : 'M'}${lastX.toFixed(1)} ${yOf(v).toFixed(1)}`;
  }
  const area = `${d}L${lastX.toFixed(1)} 650L${xOf(s[0][0]).toFixed(1)} 650Z`;
  return { line: d, area };
};

export const C7Chart: React.FC<{ t: number }> = ({ t }) => {
  const zp = ramp(t, ZOOM_A, ZOOM_F);
  const z = easeInOut(zp);                                                    // the zoom: both domains interpolate, ease-in-out, about 46 frames
  const xa = lerp(C7_SCALE_S1.x0, C7_SCALE_S2.x0, z);
  const y1 = lerp(C7_SCALE_S1.y1, C7_SCALE_S2.y1, z);
  const L = C7_SCALE_S1.left, R = C7_SCALE_S1.right, T = C7_SCALE_S1.top, B = C7_SCALE_S1.bottom;
  const xOf = (o: number) => L + ((o - xa) / (C7_SCALE_S1.x1 - xa)) * (R - L);
  const yOf = (v: number) => B - (v / y1) * (B - T);
  const cut = t < 462.36 ? C7_SCALE_S1.x0 : lerp(C7_SCALE_S1.x0, C7_SCALE_S1.x1, clamp01((t - 462.36) / (473.86 - 462.36)));   // date-linear draw
  const s1 = t >= 462.36 ? c7Paths(C7_1Y, cut, xOf, yOf) : null;
  const longOp = zp;                                                          // the long-run line fades in over the same frames
  const oneOp = 1 - ramp(t, ZOOM_A + (ZOOM_F - 12) / FPS, 12);                // the 1-year line fades out over the last 12
  const s2 = zp > 0 ? c7Paths(C7_LONG, C7_SCALE_S1.x1, xOf, yOf) : null;
  const s1Lab = 1 - ramp(t, ZOOM_A, 8);                                       // every s1 label + the ratio go in the first 8 frames
  const tickA = 1 - clamp01(zp / 0.5), tickB = clamp01((zp - 0.5) / 0.5);     // ticks cross-fade
  const peakDrawn = cut >= ORD.d20261001;
  const peakAt = 462.36 + ((ORD.d20261001 - C7_SCALE_S1.x0) / (C7_SCALE_S1.x1 - C7_SCALE_S1.x0)) * (473.86 - 462.36);
  const dotP = ramp(t, 491.14, 20);
  const d1 = clamp01(dotP / 0.59), d2 = clamp01((dotP - 0.59) / 0.41);
  return (
    <Frame
      eyebrow={<>Ratio <span className="mono">3</span> of <span className="mono">3</span></>}
      head={<>Quant priced in <span className="hl">Bitcoin</span></>}
      foot={<>
        {t >= 491.14 ? <Take t={t} at={491.14}>Even after this run: <span className="hl">around <span className="mono">22%</span></span> of the ATH.</Take> : null}
        <div className="src">Source: CoinGecko / CoinMarketCap{zp > 0 ? <><br /><span style={{ opacity: tickB }}>Line: CoinMarketCap, every <span className="mono">4</span> to <span className="mono">5</span> days. ATH: CoinGecko</span></> : null}</div>
      </>}
    >
      {tickA > 0 ? <text x={0} y={24} className="cap" textAnchor="start" opacity={tickA}><tspan className="mono">$QNT/BTC</tspan>, daily, in <tspan className="mono">BTC</tspan></text> : null}
      {tickB > 0 ? <text x={0} y={24} className="cap" textAnchor="start" opacity={tickB}><tspan className="mono">$QNT/BTC</tspan>, <tspan className="mono">2018</tspan> to <tspan className="mono">2026</tspan>, in <tspan className="mono">BTC</tspan></text> : null}
      {C7_ROWS.map((y, i) => (
        <React.Fragment key={y}>
          <line x1={L} y1={y} x2={R} y2={y} stroke={i === 0 ? '#9A9693' : '#ECE9E5'} strokeWidth={i === 0 ? 2.5 : 2} />
          {tickA > 0 ? <text x={104} y={y + 8} className="tk" textAnchor="end" opacity={tickA}>{C7_S1_Y[i]}</text> : null}
          {tickB > 0 ? <text x={104} y={y + 8} className="tk" textAnchor="end" opacity={tickB}>{C7_S2_Y[i]}</text> : null}
        </React.Fragment>
      ))}
      {tickA > 0 ? C7_S1_X.map(([l, x]) => (
        <g key={l} opacity={tickA}><line x1={x} y1={650} x2={x} y2={659} stroke="#9A9693" strokeWidth={2.5} /><text x={x} y={690} className="tk" textAnchor="middle">{l}</text></g>
      )) : null}
      {tickB > 0 ? C7_S2_X.map(([l, x]) => (
        <g key={l} opacity={tickB}><line x1={x} y1={650} x2={x} y2={659} stroke="#9A9693" strokeWidth={2.5} /><text x={x} y={690} className="tk" textAnchor="middle">{l}</text></g>
      )) : null}
      <defs><clipPath id="c7plot"><rect x={L - 4} y={T - 6} width={R - L + 8} height={B - T + 8} /></clipPath></defs>
      {/* mid-zoom the domains are between the two scales: whatever falls outside the plot is clipped, never drawn over the headline */}
      <g clipPath="url(#c7plot)">
        {s2 ? <g opacity={longOp}><path d={s2.area} fill="rgba(241,90,34,.14)" /><path d={s2.line} fill="none" stroke="#F15A22" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" /></g> : null}
        {s1 && oneOp > 0 ? <g opacity={oneOp}><path d={s1.area} fill="rgba(241,90,34,.14)" /><path d={s1.line} fill="none" stroke="#F15A22" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" /></g> : null}
      </g>
      {s1Lab > 0 ? (
        <g opacity={s1Lab}>
          {t >= 467.96 ? (
            <Fade {...land(t, 467.96)}>
              <line x1={120} y1={529.7} x2={120} y2={223.2} stroke="#9A9693" strokeWidth={2} />
              <text x={134} y={249.2} className="lab" textAnchor="start">0.00071745 BTC</text>
              <text x={134} y={291.2} className="lab o" textAnchor="start">71,745 sats</text>
              <text x={134} y={329.2} className="sub" textAnchor="start"><tspan className="mono">5 Nov 2025</tspan></text>
            </Fade>
          ) : null}
          <Ring x={120} y={542.7} p={ramp(t, 467.96, 8)} />
          {peakDrawn ? (
            <>
              <Ring x={1278.6} y={135.9} r={9} p={ramp(t, peakAt, 8)} />
              <Fade {...land(t, peakAt)}>
                <text x={1256.6} y={139.9} className="lab" textAnchor="end">0.003438 BTC</text>
                <text x={1256.6} y={177.9} className="sub" textAnchor="end">peak {SEP}<tspan className="mono">343,849 sats</tspan> {SEP}<tspan className="mono">1 Oct 2026</tspan></text>
              </Fade>
            </>
          ) : null}
          <Ring x={1398} y={270} p={ramp(t, 473.86, 8)} />
          <Fade {...land(t, 473.86)}>
            <text x={1418} y={276} className="lab" textAnchor="start">0.00254198 BTC</text>
            <text x={1418} y={318} className="lab o" textAnchor="start">254,198 sats</text>
            <text x={1418} y={354} className="sub" textAnchor="start"><tspan className="mono">4 Nov 2026</tspan></text>
          </Fade>
          <Fade {...land(t, 475.34)}><text x={495.7} y={430} className="big" textAnchor="start">3.54x</text></Fade>
          <Fade {...land(t, 479.34)}><text x={787.7} y={426} className="lab" textAnchor="start">BTC in USD: -23.0%</text></Fade>
        </g>
      ) : null}
      {t >= 483.9 ? (
        <>
          <Fade {...land(t, 483.9)}><line x1={769.2} y1={81.6} x2={770} y2={118} stroke="#9A9693" strokeWidth={2.5} strokeDasharray="3 5" /></Fade>
          <Ring x={769.2} y={68.6} p={ramp(t, 483.9, 8)} />
          <Fade {...land(t, 483.9)}>
            <text x={793.2} y={118.6} className="lab" textAnchor="start">0.01167 BTC</text>
            <text x={1053.2} y={118.6} className="sub" textAnchor="start"><tspan className="mono">16 Oct 2022</tspan></text>
          </Fade>
          <Ring x={1398} y={523.4} p={ramp(t, 483.9, 8)} />
          <Fade {...land(t, 483.9)}>
            <text x={1418} y={529.4} className="lab" textAnchor="start">0.00254 BTC</text>
            <text x={1418} y={571.4} className="lab o" textAnchor="start">254,198 sats</text>
            <text x={1418} y={607.4} className="sub" textAnchor="start"><tspan className="mono">4 Nov 2026</tspan></text>
          </Fade>
        </>
      ) : null}
      <Fade {...land(t, 486.52)}><text x={793.2} y={160.6} className="lab o" textAnchor="start">around 1.17 million sats</text></Fade>
      {d1 > 0 ? <Dot x1={769.2} y1={68.6} x2={lerp(769.2, 1398, d1)} y2={68.6} /> : null}
      {d2 > 0 ? <Dot x1={1398} y1={68.6} x2={1398} y2={lerp(68.6, 507.4, d2)} /> : null}
      <Fade {...land(t, 491.14 + 8 / FPS)}>
        <text x={1418} y={261.3} className="lab o" textAnchor="start">around 22%</text>
        <text x={1418} y={299.3} className="sub" textAnchor="start">of the ATH</text>
      </Fade>
    </Frame>
  );
};

