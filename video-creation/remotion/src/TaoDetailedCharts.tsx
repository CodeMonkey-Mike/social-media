// TaoDetailedCharts.tsx — the six Type 1 ANIMATED charts of tao-detailed (comp-build.md §7, charts.md).
// Each chart is a REAL useCurrentFrame-driven component (the comp passes `ts` = SOURCE-spine seconds read off the
// absolute clock), reproducing the design-spec stills in media/tao-detailed/assets/charts/C*-{start,mid,payoff}.png
// with the geometry from each C*.html #chart-data block and the choreography in C*-spec.md (times = source seconds).
// Values are the DATA.md reads carried in those specs ([VERIFY] re-pull at render is flagged in the build report).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

const FPSC = 30;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** progress 0..1 of a move that starts at source second t0 and lasts `frames` frames */
const P = (ts: number, t0: number, frames: number, ease: (x: number) => number = easeOutCubic) =>
  ease(clamp01(((ts - t0) * FPSC) / Math.max(1, frames)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// The locked container stylesheet (assets/charts/C*.html <style>), scoped to .tdc so it cannot leak.
const CSS = `
.tdc{--bg-deep:#0a0c10;--bg-card:#12151c;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330}
.tdc.frame{width:1920px;height:1080px;background:#0a0c10;position:absolute;left:0;top:0;overflow:hidden;color:#e8eaf0;font-family:'DM Sans',sans-serif}
.tdc.frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.tdc .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.30;pointer-events:none;z-index:0}
.tdc .stage{position:absolute;inset:0;z-index:1}
.tdc .ac{color:var(--acc)}
.tdc .hdr{position:absolute;left:120px;top:74px;right:120px}
.tdc .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#505a6e;margin-bottom:20px}
.tdc h1{font-family:'Playfair Display',serif;font-weight:900;font-size:70px;line-height:1.07;letter-spacing:-.02em;color:#e8eaf0;max-width:1680px;margin:0}
.tdc .divider{width:66px;height:4px;border-radius:2px;margin:28px 0 0;background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.30))}
.tdc .src{position:absolute;left:120px;right:120px;bottom:40px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:18px;color:#505a6e;letter-spacing:.01em}
.tdc .take{position:absolute;left:120px;right:120px;border-radius:14px;padding:24px 36px;
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.10),rgba(var(--acc-rgb),.03));
  border:1px solid rgba(var(--acc-rgb),.28);font-family:'DM Sans';font-weight:700;font-size:32px;color:#e8eaf0}
.tdc svg.w{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
.tdc .ax{font-family:'JetBrains Mono',monospace;font-weight:400;font-size:20px;fill:#505a6e}
.tdc .axt{font-family:'DM Sans';font-weight:600;font-size:19px;letter-spacing:.14em;text-transform:uppercase;fill:#505a6e}
.tdc .lbl{font-family:'DM Sans';font-weight:700;font-size:28px;fill:#e8eaf0}
.tdc .sub{font-family:'DM Sans';font-weight:400;font-size:21px;fill:#8892a4}
.tdc .val{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:26px;fill:#e8eaf0}
.tdc .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
`;

const CYAN = { acc: '#00c2ff', rgb: '0,194,255' };
const GREEN = { acc: '#22c55e', rgb: '34,197,94' };

const Frame: React.FC<{ tone: { acc: string; rgb: string }; ey: string; h1: React.ReactNode; src: string; children: React.ReactNode }> = ({
  tone, ey, h1, src, children,
}) => (
  <AbsoluteFill>
    <style>{CSS}</style>
    <div className="tdc frame" style={{ ['--acc' as any]: tone.acc, ['--acc-rgb' as any]: tone.rgb }}>
      <div className="orb" style={{ width: 700, height: 700, background: 'var(--acc)', right: -300, top: -320 }} />
      <div className="stage">
        <div className="hdr">
          <div className="ey">{ey}</div>
          <h1>{h1}</h1>
          <div className="divider" />
        </div>
        {children}
        <div className="src">{src}</div>
      </div>
    </div>
  </AbsoluteFill>
);

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');

// ─── C4 · top-10 subnets by emission share (CH3 cyan) · beat 298.40-306.66 ───────────────────────────────
const C4_ROWS = [
  { name: 'Lium', sn: 51, v: 13.82 }, { name: 'Chutes', sn: 64, v: 8.75 }, { name: 'Targon', sn: 4, v: 6.59 },
  { name: 'Affine', sn: 120, v: 5.52 }, { name: 'engy', sn: 53, v: 5.18 }, { name: 'Minos', sn: 107, v: 4.72 },
  { name: 'OpenRoboto', sn: 80, v: 3.14 }, { name: 'ORO', sn: 15, v: 2.77 }, { name: 'SOMA', sn: 114, v: 2.71 },
  { name: 'KubeTEE', sn: 90, v: 2.61 },
];
export const ChartC4: React.FC<{ ts: number }> = ({ ts }) => {
  const callP = P(ts, 304.2, 10);
  return (
    <Frame tone={CYAN} ey="128 slots · top 10 by emission share" h1={<>Every slot has to <span className="ac">earn its share</span></>}
      src="Source: taostats.io/subnets, emission share at read 2026-10-15 (re-pulled at render) · 24 revenue subnets: SubConnect, Aug 2026, via Crypto Briefing">
      <svg className="w" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="tdC4bar" x1="0" x2="1"><stop offset="0" stopColor="#00c2ff" stopOpacity=".55" /><stop offset="1" stopColor="#00c2ff" /></linearGradient>
        </defs>
        {[0, 5, 10, 15].map((p) => (
          <g key={p}>
            <line x1={540 + p * 72} y1={308} x2={540 + p * 72} y2={948} stroke="#1e2330" strokeWidth={2} strokeDasharray={p ? '4 8' : undefined} />
            <text className="ax" x={540 + p * 72} y={984} textAnchor="middle">{p}%</text>
          </g>
        ))}
        {C4_ROWS.map((r, i) => {
          const t0 = 298.7 + (i * 3) / FPSC;                  // 3-frame stagger, top to bottom
          const g = P(ts, t0, 16);                              // each bar 16 frames, ease-out cubic
          const landed = P(ts, t0 + 16 / FPSC, 6, (x) => x);    // value fades in (6 f) the frame its bar lands
          const w = r.v * 72 * g;
          const yb = 331.5 + i * 63;
          return (
            <g key={r.name}>
              <text className="lbl" x={120} y={359.5 + i * 63}>{r.name}</text>
              <text className="ax" x={516} y={357.5 + i * 63} textAnchor="end" style={{ fontSize: 22 }}>SN{r.sn}</text>
              {w > 0.5 && (
                <rect x={540} y={yb} width={w} height={36} rx={6} fill="url(#tdC4bar)"
                  style={i === 0 ? { filter: `drop-shadow(0 0 14px rgba(0,194,255,${(0.55 * landed).toFixed(3)}))` } : undefined} />
              )}
              <text className="val" x={540 + r.v * 72 + 18} y={358.5 + i * 63} opacity={landed} style={{ fill: i === 0 ? '#00c2ff' : '#e8eaf0' }}>
                {r.v.toFixed(2)}%
              </text>
            </g>
          );
        })}
      </svg>
      {callP > 0 && (
        <div style={{ position: 'absolute', right: 120, top: 712, width: 560, padding: '22px 28px', borderRadius: 16, border: '2px solid #00c2ff',
          background: 'linear-gradient(180deg,rgba(0,194,255,.16),rgba(0,194,255,.05)),#12151c', boxShadow: '0 0 50px rgba(0,194,255,.28)',
          opacity: callP, transform: `scale(${lerp(0.9, 1, callP)})`, transformOrigin: '50% 50%' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 60, color: '#00c2ff', lineHeight: 1 }}>24</div>
          <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 28, color: '#e8eaf0', marginTop: 10 }}>subnets earn real outside revenue</div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 20, color: '#8892a4', marginTop: 6 }}>SubConnect Revenue Index, as reported</div>
        </div>
      )}
    </Frame>
  );
};

// ─── C5 · Lium subsidy ratio (CH3 cyan) · beat 345.00-356.08 ──────────────────────────────────────────────
const C5y = (x: number) => 860 - 92 * x;
const StatCard: React.FC<{ top: number; label: string; value: string; valueOn: number; lit: number; sub: string }> = ({ top, label, value, valueOn, lit, sub }) => (
  <div style={{ position: 'absolute', left: 1250, top, width: 550, height: 250, borderRadius: 18, padding: '28px 34px', boxSizing: 'border-box',
    border: `2px solid ${lit > 0.5 ? '#00c2ff' : '#1e2330'}`,
    background: `linear-gradient(180deg,rgba(0,194,255,${(0.14 * lit).toFixed(3)}),rgba(0,194,255,${(0.04 * lit).toFixed(3)})),#12151c`,
    boxShadow: `0 0 50px rgba(0,194,255,${(0.25 * lit).toFixed(3)})`, opacity: 0.55 + 0.45 * Math.max(lit, valueOn) }}>
    <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', color: '#505a6e', marginBottom: 10 }}>{label}</div>
    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 84, lineHeight: 1.05, color: '#00c2ff', opacity: valueOn, minHeight: 88 }}>{value}</div>
    <div style={{ fontFamily: 'DM Sans', fontSize: 23, color: '#8892a4', marginTop: 8 }}>{sub}</div>
  </div>
);
export const ChartC5: React.FC<{ ts: number }> = ({ ts }) => {
  const bill = P(ts, 345.0, 18);
  const billLit = P(ts, 345.0 + 18 / FPSC, 4, (x) => x);
  const yoyOn = P(ts, 346.38, 4, (x) => x);
  const yoy = P(ts, 346.38, 14);
  const dotRaw = clamp01(((ts - 349.2) * FPSC) / 8);
  const dotY = dotRaw <= 0 ? -1 : C5y(2.0) - (1 - easeOutBack(dotRaw)) * 60;   // drops in, 6 px-ish overshoot
  const dotLbl = P(ts, 349.2 + 4 / FPSC, 8, (x) => x);
  const may = P(ts, 352.44, 12);
  const mayLbl = P(ts, 352.44 + 8 / FPSC, 6, (x) => x);
  const edges = P(ts, 354.84, 16);
  const wedge = P(ts, 354.84 + 8 / FPSC, 10, (x) => x);
  const closing = P(ts, 355.42, 8, (x) => x);
  const yTop = C5y(4.9), yLow = C5y(3.5), xOct = 1037.9;
  const capH = (yLow - yTop) * may;
  return (
    <Frame tone={CYAN} ey="Lium · SN51 · emissions vs revenue" h1={<>Lium’s subsidy gap is <span className="ac">closing</span></>}
      src="Source: ownyourmind.ai Lium analysis (updated 2026-10-09, figures to 2026-10-14; Lium’s own billing endpoint, checked against on-chain payouts)">
      <svg className="w" viewBox="0 0 1920 1080">
        <text className="axt" x={120} y={306}>Subsidy ratio: emissions paid ÷ customer revenue</text>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <g key={k}>
            <line x1={230} y1={C5y(k)} x2={1130} y2={C5y(k)} stroke="#1e2330" strokeWidth={2} />
            <text className="ax" x={205} y={C5y(k) + 7} textAnchor="end">{k}x</text>
          </g>
        ))}
        {['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'].map((m, k) => (
          <text key={m} className="ax" x={300 + k * 150} y={900} textAnchor="middle">{m}</text>
        ))}
        <text className="ax" x={1130} y={930} textAnchor="end" style={{ fontSize: 18 }}>2026</text>
        <line x1={230} y1={768} x2={1130} y2={768} stroke="#8892a4" strokeWidth={2.5} strokeDasharray="10 8" />
        <text className="axt" x={240} y={754} style={{ fill: '#8892a4' }}>1.0x: customers cover the emissions</text>
        {/* the closing wedge: two measured reads only, never an interpolated series */}
        <polygon points={`300,${yTop} 300,${yLow} ${xOct},${C5y(2)}`} fill={`rgba(0,194,255,${(0.1 * wedge).toFixed(3)})`} />
        {edges > 0 && (
          <>
            <line x1={300} y1={yTop} x2={lerp(300, xOct, edges)} y2={lerp(yTop, C5y(2), edges)} stroke="#00c2ff" strokeWidth={2.5} strokeDasharray="8 7" />
            <line x1={300} y1={yLow} x2={lerp(300, xOct, edges)} y2={lerp(yLow, C5y(2), edges)} stroke="#00c2ff" strokeWidth={2.5} strokeDasharray="8 7" />
          </>
        )}
        <text className="axt" x={470} y={672} opacity={closing} style={{ fill: '#00c2ff', fontSize: 22 }}>the gap is closing →</text>
        {may > 0 && (
          <rect x={285} y={yLow - capH} width={30} height={Math.max(capH, 0.01)} rx={15} fill="rgba(0,194,255,.35)" stroke="#00c2ff" strokeWidth={2.5} />
        )}
        <g opacity={mayLbl}>
          <text className="val" x={334} y={yTop + 12} style={{ fill: '#e8eaf0', paintOrder: 'stroke', stroke: '#0a0c10', strokeWidth: 8 }}>4.9x</text>
          <text className="val" x={334} y={yLow + 8} style={{ fill: '#e8eaf0', paintOrder: 'stroke', stroke: '#0a0c10', strokeWidth: 8 }}>3.5x</text>
          <text className="axt" x={285} y={yTop - 22}>May 2026</text>
        </g>
        {dotY > 0 && (
          <circle cx={xOct} cy={dotY} r={14} fill="#00c2ff" style={{ filter: 'drop-shadow(0 0 12px rgba(0,194,255,.9))' }} />
        )}
        <g opacity={dotLbl}>
          <text x={xOct} y={642} textAnchor="middle" className="mono" style={{ fontSize: 44, fill: '#00c2ff' }}>2.0x</text>
          <text className="axt" x={xOct} y={726} textAnchor="middle">Oct 14</text>
        </g>
      </svg>
      <StatCard top={300} label="Last full month billing" value={`${(1.3 * bill).toFixed(1)}M`} valueOn={ts >= 345.0 ? 1 : 0} lit={billLit}
        sub="as of Oct 7, 2026, Lium’s own figure" />
      <StatCard top={590} label="Billing, year on year" value={`${lerp(1.0, 2.96, yoy).toFixed(2)}x`} valueOn={yoyOn} lit={yoyOn}
        sub="about 3x in a year" />
    </Frame>
  );
};

// ─── C2 · issuance step chart (CH4 green) · beat 515.12-523.90 ────────────────────────────────────────────
const C2x = (m: number) => 260 + (m / 21) * 1380;
const C2y = (pb: number) => 860 - pb * 480;
export const ChartC2: React.FC<{ ts: number }> = ({ ts }) => {
  const cap = P(ts, 516.22, 10);
  const capCount = P(ts, 516.22, 20);
  const hard = P(ts, 518.4, 8, (x) => x);
  const tread1 = P(ts, 519.0, 20, (x) => x);                 // the 1-a-block tread draws
  const t1end = 519.0 + 20 / FPSC;
  const drop = P(ts, t1end, Math.round((520.06 - t1end) * FPSC), easeOutCubic); // lands ON "halving" 520.06
  const lbl1 = P(ts, 519.0 + 10 / FPSC, 8, (x) => x);
  const halv = P(ts, 520.06, 6, (x) => x);
  const tread2 = P(ts, 521.04, 10, (x) => x);
  const mk = clamp01(((ts - (521.04 + 10 / FPSC)) * FPSC) / 8);
  const mkS = mk <= 0 ? 0 : easeOutBack(mk);
  const issuedLbl = P(ts, 521.04 + 10 / FPSC, 10, (x) => x);
  const lbl2 = P(ts, 522.28, 8, (x) => x);
  const future = P(ts, 522.8, 12, (x) => x);
  const xI = 1023.6;
  const tread1X = lerp(260, 950, tread1);
  let path1 = '';
  if (tread1 > 0) path1 = `M260 380 L${tread1X} 380` + (drop > 0 ? ` L950 ${lerp(380, 620, drop)}` : '');
  return (
    <Frame tone={GREEN} ey="TAO supply · halvings fire on coins issued" h1={<>21 million, <span className="ac">ever</span></>}
      src="Sources: bittensor.com/docs emissions · Taostats halving doc · issued at read: taostats.io/yield, 2026-10-15, re-pulled at render">
      <svg className="w" viewBox="0 0 1920 1080">
        <text className="axt" x={120} y={318}>New TAO per block</text>
        {[1, 0.5, 0.25, 0.125].map((v) => (
          <g key={v}>
            <line x1={260} y1={C2y(v)} x2={1640} y2={C2y(v)} stroke="#1e2330" strokeWidth={1.5} strokeDasharray="3 9" />
            <text className="ax" x={240} y={C2y(v) + 7} textAnchor="end">{v}</text>
          </g>
        ))}
        <line x1={260} y1={860} x2={1660} y2={860} stroke="#2a3142" strokeWidth={2.5} />
        <text className="ax" x={260} y={900} textAnchor="middle">0</text>
        <text className="axt" x={260} y={960}>TAO issued →</text>
        {[10.5, 15.75, 18.375].map((m) => (
          <g key={m}>
            <line x1={C2x(m)} y1={860} x2={C2x(m)} y2={870} stroke="#2a3142" strokeWidth={2.5} />
            <text className="ax" x={C2x(m)} y={900} textAnchor="middle">{m}M</text>
          </g>
        ))}
        <text className="axt" x={950} y={930} textAnchor="middle" style={{ fill: halv > 0.5 ? '#22c55e' : '#505a6e' }}>Dec 2025</text>
        {cap > 0 && <line x1={1640} y1={300} x2={1640} y2={300 + 560 * cap} stroke="#22c55e" strokeWidth={3} strokeDasharray="10 8" />}
        {cap > 0 && (
          <>
            <text x={1622} y={330} textAnchor="end" className="mono" style={{ fontSize: 40, fill: '#22c55e' }}>{fmtInt(21000000 * capCount)}</text>
            <text className="ax" x={1640} y={900} textAnchor="middle" style={{ fill: '#22c55e' }}>21M</text>
          </>
        )}
        <text className="axt" x={1622} y={364} textAnchor="end" opacity={hard} style={{ fill: '#e8eaf0' }}>Hard cap, like Bitcoin</text>
        {path1 && <path d={path1} stroke="#22c55e" strokeWidth={6} fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,.6))' }} />}
        <text x={605} y={356} textAnchor="middle" className="lbl" opacity={lbl1} style={{ fontSize: 27 }}>
          1 TAO a block · <tspan className="mono" style={{ fontSize: 25 }}>7,200</tspan> a day
        </text>
        <text className="axt" x={968} y={500} opacity={halv} style={{ fill: '#22c55e' }}>First halving</text>
        {tread2 > 0 && (
          <path d={`M950 620 L${lerp(950, xI, tread2)} 620`} stroke="#22c55e" strokeWidth={6} fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,.6))' }} />
        )}
        {mkS > 0 && (
          <>
            <line x1={xI} y1={620} x2={xI} y2={860} stroke="#22c55e" strokeWidth={2} strokeDasharray="3 6" opacity={clamp01(mk * 2)} />
            <circle cx={xI} cy={620} r={12 * mkS} fill="#22c55e" style={{ filter: 'drop-shadow(0 0 12px rgba(34,197,94,.95))' }} />
          </>
        )}
        <g opacity={issuedLbl}>
          <text x={1001.6} y={712} textAnchor="end" className="mono" style={{ fontSize: 34, fill: '#22c55e', paintOrder: 'stroke', stroke: '#0a0c10', strokeWidth: 8 }}>11.62M issued</text>
          <text className="axt" x={1001.6} y={746} textAnchor="end" style={{ fill: '#e8eaf0', paintOrder: 'stroke', stroke: '#0a0c10', strokeWidth: 8 }}>55.3% of the cap, at read</text>
        </g>
        <text x={1122.5} y={596} textAnchor="middle" className="lbl" opacity={lbl2} style={{ fontSize: 27, fill: '#22c55e' }}>
          0.5 a block · <tspan className="mono" style={{ fontSize: 25 }}>3,600</tspan> a day
        </text>
        <g opacity={future * 0.999}>
          <path d={`M${xI} 620 L1295 620 L1295 740 L1467.5 740 L1467.5 800 L1634 800`} stroke="rgba(34,197,94,.55)" strokeWidth={4} fill="none" strokeDasharray="10 9" />
          <text className="ax" x={1381.1} y={724} textAnchor="middle" style={{ fill: '#8892a4' }}>0.25</text>
          <text className="ax" x={1553.8} y={784} textAnchor="middle" style={{ fill: '#8892a4' }}>0.125</text>
          <text className="axt" x={1309} y={680} style={{ fill: '#8892a4' }}>next</text>
        </g>
      </svg>
    </Frame>
  );
};

// ─── C7 · issued + staked donuts (CH4 green) · beat 523.90-533.14 ─────────────────────────────────────────
const RING = 2 * Math.PI * 200;
const Arc: React.FC<{ cx: number; len: number; off: number; color: string; glow?: boolean }> = ({ cx, len, off, color, glow }) =>
  len <= 0.01 ? null : (
    <circle cx={cx} cy={610} r={200} fill="none" stroke={color} strokeWidth={46} strokeDasharray={`${len} ${RING}`} strokeDashoffset={-off}
      transform={`rotate(-90 ${cx} 610)`} style={glow ? { filter: 'drop-shadow(0 0 10px rgba(34,197,94,.55))' } : undefined} />
  );
export const ChartC7: React.FC<{ ts: number }> = ({ ts }) => {
  const d1 = P(ts, 524.22, 24, easeInOut);
  const pct1 = P(ts, 527.68, 8);
  const conn = P(ts, 529.34, 10, (x) => x);
  const root = P(ts, 529.34, 18, easeInOut);
  const alpha = P(ts, 529.34 + 18 / FPSC, 10, easeInOut);
  const count2 = P(ts, 529.34, 28);
  const pct2 = P(ts, 529.34 + 28 / FPSC, 8);
  const leg1 = P(ts, 531.42, 8, (x) => x);
  const leg2 = P(ts, 531.42 + 4 / FPSC, 8, (x) => x);
  const rootLen = 588.63 * root, alphaLen = 216.07 * alpha;
  return (
    <Frame tone={GREEN} ey="TAO supply, at read" h1={<>Most of it is <span className="ac">put to work</span></>}
      src="Source: taostats.io/yield, read 2026-10-15 (re-pulled at render) · cap: bittensor.com/docs emissions">
      <svg className="w" viewBox="0 0 1920 1080">
        <circle cx={560} cy={610} r={200} fill="none" stroke="#1e2330" strokeWidth={46} />
        <circle cx={1290} cy={610} r={200} fill="none" stroke="#1e2330" strokeWidth={46} />
        <text className="axt" x={560} y={360} textAnchor="middle">Issued, of the 21M cap</text>
        <text className="axt" x={1290} y={360} textAnchor="middle">Staked, of what is issued</text>
        <Arc cx={560} len={695.34 * d1} off={0} color="#22c55e" glow />
        {d1 > 0 && (
          <>
            <text x={560} y={602} textAnchor="middle" className="mono" style={{ fontSize: 62, fill: '#e8eaf0' }}>{(11.62 * d1).toFixed(2)}M</text>
            <text x={560} y={644} textAnchor="middle" className="sub" style={{ fontSize: 24 }}>TAO issued</text>
          </>
        )}
        {pct1 > 0 && (
          <text x={560} y={694} textAnchor="middle" className="mono" opacity={pct1}
            style={{ fontSize: 38, fill: '#22c55e', transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${lerp(0.8, 1, pct1)})` }}>55.3%</text>
        )}
        <Arc cx={1290} len={rootLen} off={0} color="#22c55e" glow />
        <Arc cx={1290} len={alphaLen} off={588.63} color="rgba(34,197,94,.45)" />
        {count2 > 0 && (
          <>
            <text x={1290} y={602} textAnchor="middle" className="mono" style={{ fontSize: 62, fill: '#e8eaf0' }}>{(7.441 * count2).toFixed(3)}M</text>
            <text x={1290} y={644} textAnchor="middle" className="sub" style={{ fontSize: 24 }}>TAO staked</text>
          </>
        )}
        {pct2 > 0 && (
          <text x={1290} y={694} textAnchor="middle" className="mono" opacity={pct2}
            style={{ fontSize: 38, fill: '#22c55e', transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${lerp(0.8, 1, pct2)})` }}>64.03%</text>
        )}
        {/* connector: muted dotted at rest, draws in green on "64%" */}
        <path d="M800 610 L1044 610" stroke="#2a3142" strokeWidth={3} fill="none" strokeDasharray="4 8" />
        <path d="M1034 600 L1046 610 L1034 620" stroke="#2a3142" strokeWidth={3} fill="none" />
        <text className="axt" x={925} y={592} textAnchor="middle">of those</text>
        {conn > 0 && (
          <g>
            <path d={`M800 610 L${lerp(800, 1044, conn)} 610`} stroke="#22c55e" strokeWidth={3} fill="none" strokeDasharray="4 8" />
            <path d="M1034 600 L1046 610 L1034 620" stroke="#22c55e" strokeWidth={3} fill="none" opacity={conn} />
            <text className="axt" x={925} y={592} textAnchor="middle" opacity={conn} style={{ fill: '#e8eaf0' }}>of those</text>
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', left: 1560, top: 470, width: 280, opacity: leg1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: '#22c55e' }} />
          <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26, color: '#e8eaf0' }}>Root</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 34, color: '#e8eaf0', margin: '6px 0 0 36px' }}>5.443M</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 20, color: '#8892a4', marginLeft: 36 }}>73.15% of the stake</div>
      </div>
      <div style={{ position: 'absolute', left: 1560, top: 640, width: 280, opacity: leg2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(34,197,94,.45)' }} />
          <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26, color: '#e8eaf0' }}>Subnets (alpha)</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 34, color: '#e8eaf0', margin: '6px 0 0 36px' }}>1.998M</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 20, color: '#8892a4', marginLeft: 36 }}>26.85% of the stake</div>
      </div>
    </Frame>
  );
};

// ─── C3 · revenue against issuance (CH4 green) · beat 566.30-576.70 ──────────────────────────────────────
export const ChartC3: React.FC<{ ts: number }> = ({ ts }) => {
  const rev = P(ts, 569.38, 12);
  const range = P(ts, 569.38 + 12 / FPSC, 8);
  const revLbl = P(ts, 570.28, 6, (x) => x);
  const asRep = P(ts, 572.38, 6, (x) => x);
  const emi = P(ts, 573.78, 24, easeInOut);
  const chev = P(ts, 573.78 + 18 / FPSC, 6, (x) => x);
  const tenth = P(ts, 576.34, 6, (x) => x);
  const take = 0.35 + 0.65 * tenth;
  return (
    <Frame tone={GREEN} ey="Demand vs issuance, per year" h1={<>Outside <span className="ac">revenue</span> against new TAO</>}
      src="Source: SubConnect Revenue Index, August 2026, as reported by Crypto Briefing, 2026-09-21 · estimates, not audits">
      <svg className="w" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="tdC3g" x1="0" x2="1"><stop offset="0" stopColor="#22c55e" stopOpacity=".6" /><stop offset="1" stopColor="#22c55e" /></linearGradient>
          <linearGradient id="tdC3m" x1="0" x2="1"><stop offset="0" stopColor="#2a3142" /><stop offset="1" stopColor="#505a6e" /></linearGradient>
        </defs>
        <line x1={560} y1={350} x2={560} y2={724} stroke="#2a3142" strokeWidth={2.5} />
        <text className="lbl" x={120} y={424} style={{ fontSize: 31 }}>Outside customers</text>
        <text className="sub" x={120} y={458}>24 subnets, per year</text>
        <text className="lbl" x={120} y={644} style={{ fontSize: 31 }}>New TAO paid out</text>
        <text className="sub" x={120} y={678}>network emissions, per year</text>
        {rev > 0 && <rect x={560} y={390} width={96.7 * rev} height={74} rx={6} fill="url(#tdC3g)" style={{ filter: 'drop-shadow(0 0 12px rgba(34,197,94,.6))' }} />}
        {range > 0 && <rect x={656.7} y={390} width={24.2 * range} height={74} rx={4} fill="rgba(34,197,94,.30)" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />}
        <text x={706.9} y={440} className="mono" opacity={revLbl} style={{ fontSize: 44, fill: '#22c55e' }}>28 to 35M</text>
        <text className="sub" x={706.9} y={376} opacity={asRep}>as reported</text>
        {emi > 0 && <rect x={560} y={610} width={1036 * emi} height={74} rx={6} fill="url(#tdC3m)" />}
        <g opacity={chev}>
          <path d="M1594 610 L1630 647 L1594 684" fill="#505a6e" />
          <text x={1646} y={660} className="mono" style={{ fontSize: 44, fill: '#e8eaf0' }}>300M+</text>
        </g>
        {Array.from({ length: 9 }).map((_, k) => {
          const on = P(ts, 576.34 + (k * 2) / FPSC, 1, (x) => x);
          return on > 0 ? <line key={k} x1={663.6 + k * 103.6} y1={614} x2={663.6 + k * 103.6} y2={680} stroke="#0a0c10" strokeWidth={4} /> : null;
        })}
        <g opacity={tenth}>
          <rect x={560} y={610} width={103.6} height={74} rx={6} fill="rgba(34,197,94,.30)" stroke="#22c55e" strokeWidth={3} />
          <line x1={663.6} y1={472} x2={663.6} y2={602} stroke="#22c55e" strokeWidth={2.5} strokeDasharray="5 6" />
          <text className="axt" x={683.6} y={545} style={{ fill: '#22c55e', fontSize: 22 }}>one tenth of the payout</text>
        </g>
      </svg>
      <div className="take" style={{ top: 800, opacity: take }}>
        Customer money covers <span className="ac">about a tenth</span> of what the network pays out.
        <span style={{ fontWeight: 500, fontSize: 24, color: '#8892a4' }}> (9% to 12%, as reported)</span>
      </div>
    </Frame>
  );
};

// ─── C8 · the size of the prize (CH4 green) · beat 603.50-614.48 ─────────────────────────────────────────
const C8_ROWS = [
  { name: 'Amazon', low: 200, high: 0, open: false, at: 604.9, lbl: '200B' },
  { name: 'Alphabet', low: 175, high: 185, open: false, at: 604.38, lbl: '175 to 185B' },
  { name: 'Microsoft', low: 120, high: 0, open: true, at: 603.5, lbl: '120B+' },
  { name: 'Meta', low: 115, high: 135, open: false, at: 605.42, lbl: '115 to 135B' },
  { name: 'Oracle', low: 50, high: 0, open: false, at: 605.98, lbl: '50B' },
];
export const ChartC8: React.FC<{ ts: number }> = ({ ts }) => {
  const c25 = P(ts, 607.48, 10);
  const c26 = P(ts, 607.48 + 10 / FPSC, 18);
  const top = P(ts, 609.96, 8);
  const dbl = P(ts, 611.22, 10, (x) => x);
  const h25 = 258.4 * c25, h26 = 448.8 * c26;
  return (
    <Frame tone={GREEN} ey="AI capex · the five hyperscalers" h1={<>The size of the <span className="ac">prize</span></>}
      src="Source: Futurum, 2026-02-12 (company guidance as estimated; 2025: about 380B)">
      <svg className="w" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="tdC8g" x1="0" x2="1"><stop offset="0" stopColor="#22c55e" stopOpacity=".55" /><stop offset="1" stopColor="#22c55e" /></linearGradient>
          <linearGradient id="tdC8gv" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#22c55e" stopOpacity=".55" /><stop offset="1" stopColor="#22c55e" /></linearGradient>
        </defs>
        <text className="axt" x={120} y={302}>2026 capex, by company</text>
        <line x1={420} y1={324} x2={420} y2={800} stroke="#2a3142" strokeWidth={2.5} />
        {C8_ROWS.map((r, i) => {
          const y = 330 + i * 100;
          const g = P(ts, r.at, 12);                                  // each lands on its spoken name
          const land = P(ts, r.at + 12 / FPSC, 6, (x) => x);
          const w = r.low * 3.5 * g;
          const xe = 420 + r.low * 3.5;
          return (
            <g key={r.name}>
              <text className="lbl" x={120} y={y + 39} style={{ fontSize: 30 }}>{r.name}</text>
              {w > 0.5 && <rect x={420} y={y} width={w} height={58} rx={6} fill="url(#tdC8g)" />}
              <g opacity={land}>
                {r.high > 0 && <rect x={xe} y={y} width={(r.high - r.low) * 3.5} height={58} rx={4} fill="rgba(34,197,94,.28)" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />}
                {r.open && <path d={`M${xe - 2} ${y} L${xe + 24} ${y + 29} L${xe - 2} ${y + 58}`} fill="#22c55e" />}
                <text className="val" x={xe + (r.high > 0 ? (r.high - r.low) * 3.5 + 20 : r.open ? 46 : 20)} y={y + 39} style={{ fontSize: 30 }}>{r.lbl}</text>
              </g>
            </g>
          );
        })}
        <text className="ax" x={120} y={844} style={{ fontSize: 18 }}>Microsoft: fiscal 2026 · ranges as estimated</text>
        <text className="axt" x={1560} y={302} textAnchor="middle">All five, per year</text>
        <line x1={1350} y1={840} x2={1770} y2={840} stroke="#2a3142" strokeWidth={2.5} />
        <text className="ax" x={1455} y={880} textAnchor="middle" style={{ fontSize: 24, fill: '#8892a4' }}>2025</text>
        <text className="ax" x={1665} y={880} textAnchor="middle" style={{ fontSize: 24, fill: '#22c55e' }}>2026</text>
        {h25 > 0.5 && <rect x={1380} y={840 - h25} width={150} height={h25} rx={6} fill="#3a4358" />}
        <g opacity={c25}>
          <text x={1455} y={840 - h25 - 20} textAnchor="middle" className="mono" style={{ fontSize: 32, fill: '#e8eaf0' }}>380B</text>
          <text className="sub" x={1455} y={840 - h25 - 62} textAnchor="middle">about</text>
        </g>
        {h26 > 0.5 && <rect x={1590} y={840 - h26} width={150} height={h26} rx={6} fill="url(#tdC8gv)" style={{ filter: 'drop-shadow(0 0 16px rgba(34,197,94,.55))' }} />}
        {top > 0 && <rect x={1590} y={391.2 - 20.4 * top} width={150} height={20.4 * top} rx={4} fill="rgba(34,197,94,.28)" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />}
        {c26 > 0 && (
          <text x={1665} y={840 - h26 - 20.4 * top - 22} textAnchor="middle" className="mono" style={{ fontSize: 32, fill: '#22c55e' }}>
            {top > 0 ? '660 to 690B' : `${Math.round(660 * c26)}B`}
          </text>
        )}
        <text className="axt" x={1560} y={920} textAnchor="middle" opacity={dbl} style={{ fill: '#e8eaf0' }}>a near-doubling in one year</text>
      </svg>
    </Frame>
  );
};

/** ref -> live animated chart. The comp routes every `chart` cover through this (lint_animated_charts). */
export const CHARTS: Record<string, React.FC<{ ts: number }>> = {
  C2: ChartC2, C3: ChartC3, C4: ChartC4, C5: ChartC5, C7: ChartC7, C8: ChartC8,
};
