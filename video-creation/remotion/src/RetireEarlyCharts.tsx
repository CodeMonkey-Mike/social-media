// RetireEarlyCharts.tsx: the four Type 1 ANIMATED charts of retire-early, built for real (comp-build §7, charts.md).
// Each chart is a pure function of `f` = frames since its cover's tIn, which the comp derives from the ABSOLUTE clock
// (comp-build §6a), so a chart mounted inside a transition engine shows the same frame the cover track shows.
// Geometry + copy lifted from render() in media/retire-early/assets/charts/<id>.html; the choreography from <id>.spec.md
// (tao-rev-vs-emissions: the row-1 growth waits for the spin to settle, per TRANSITIONS.md section 4 at 461.25).
// Design-state stills (<id>-start / -mid / -payoff.png) are the SPEC only; nothing here is a held bitmap.
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

export const PF = loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] }).fontFamily;
export const DM = loadDMSans('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] }).fontFamily;
export const MONO = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] }).fontFamily;

// the LOCKED container stylesheet tokens (assets/charts/*.html :root)
const K = {
  bg: '#0a0c10', t1: '#e8eaf0', t2: '#8892a4', t3: '#505a6e', green: '#00e68a', cyan: '#00c2ff',
};
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const lin = (f: number, a: number, b: number, v0: number, v1: number, easing?: (t: number) => number) =>
  interpolate(f, [a, b], [v0, v1], { ...CL, easing });
const EIO = Easing.inOut(Easing.cubic);
const EOUT = Easing.out(Easing.cubic);
const SIN = Easing.inOut(Easing.sin);

// chapter accents (COVER-PLAN chapter_themes): C2 + C4 = CH2 Arbitrum sky blue, C22 + tao-rev = CH4 purple
const CH2 = { acc: '#12aaff', rgb: '18,170,255' };
const CH4 = { acc: '#a855f7', rgb: '168,85,247' };

const tagStyle: React.CSSProperties = {
  fontFamily: DM, fontWeight: 700, fontSize: 16, letterSpacing: '.16em', textTransform: 'uppercase', color: K.t3,
};

const Stage: React.FC<{
  acc: string; orb: number; ey: string; title: React.ReactNode; src: string; push: number; children: React.ReactNode;
}> = ({ acc, orb, ey, title, src, push, children }) => (
  <AbsoluteFill style={{ background: K.bg, overflow: 'hidden' }}>
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 50%' }}>
      <div style={{ position: 'absolute', width: orb, height: orb, right: -300, top: -320, borderRadius: '50%',
        background: acc, filter: 'blur(120px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', left: 140, top: 76, width: 1640 }}>
        <div style={{ fontFamily: DM, fontSize: 27, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em',
          color: K.t3, marginBottom: 16 }}>{ey}</div>
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 62, lineHeight: 1.08, letterSpacing: '-.02em',
          color: K.t1, maxWidth: 1640 }}>{title}</div>
        <div style={{ width: 66, height: 4, borderRadius: 2, marginTop: 24,
          background: `linear-gradient(90deg, ${K.green}, ${K.cyan})` }} />
      </div>
      <div style={{ position: 'absolute', left: 140, bottom: 38, fontFamily: MONO, fontSize: 17, color: K.t3,
        letterSpacing: '.01em', whiteSpace: 'nowrap' }}>{src}</div>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ===================================================================================== C2
// Robinhood Chain daily fees, 2026-05-05 to 2026-10-08 (assets/charts/C2-data.json, DefiLlama, read 2026-10-09).
// [VERIFY] at render: last day 83,952 vs peak 6,044,224 = 98.61% below -> rounds to the spoken "about 99%".
const C2_SERIES: number[] = [8.73, 4.71, 3.62, 26, 0, 0, 30, 33, 7.78, 7.93, 8.65, 47, 41, 39, 64, 36, 42, 65, 25, 23, 70, 81, 40, 40, 44, 32, 32, 44, 47, 42, 102, 106, 44, 38, 41, 45, 80, 47, 51, 32, 34, 66, 159, 462, 482, 391, 244, 274, 232, 240, 415, 192, 204, 163, 174, 295, 345, 1319, 4846, 4119, 3213, 2048, 3152, 3797, 38958, 60104, 328312, 152922, 113451, 108553, 126575, 182627, 195643, 183402, 136080, 118541, 140478, 198215, 250297, 349030, 283895, 155074, 110492, 93863, 73948, 58011, 53234, 54602, 44672, 48168, 56356, 64167, 90019, 122106, 104582, 94302, 87815, 86606, 118289, 408458, 120946, 128593, 68017, 39844, 45581, 61400, 59275, 58643, 66153, 54254, 56260, 84741, 105348, 138952, 200211, 279446, 550628, 1070833, 2131544, 3751220, 4454641, 4591743, 6044224, 2903475, 2078873, 2127468, 1580488, 1055389, 1049340, 936036, 804007, 485277, 448616, 524989, 234819, 307973, 312597, 291347, 206738, 312290, 355526, 226883, 174961, 140669, 91274, 68039, 107972, 166120, 97115, 82665, 100933, 59435, 49942, 55050, 49512, 51838, 83952];
const C2N = C2_SERIES.length; // 157
const c2x = (i: number) => 200 + (1340 - 200) * i / (C2N - 1);
const c2y = (v: number) => 850 - (850 - 320) * v / 6.5e6;
const c2pts = (to: number) => {
  const out: [number, number][] = [];
  const n = Math.floor(to);
  for (let i = 0; i <= n; i++) out.push([c2x(i), c2y(C2_SERIES[i])]);
  if (to > n && n + 1 < C2N) {
    const fr = to - n;
    out.push([c2x(n) + (c2x(n + 1) - c2x(n)) * fr, c2y(C2_SERIES[n] + (C2_SERIES[n + 1] - C2_SERIES[n]) * fr)]);
  }
  return out;
};
const C2_PCT = Math.round(100 * (1 - C2_SERIES[C2N - 1] / C2_SERIES[122]));
if (C2_PCT !== 99) throw new Error(`C2: the last day is ${C2_PCT}% below the peak; the VO says "about 99%" (STOP and flag)`);

export const ChartC2: React.FC<{ f: number }> = ({ f }) => {
  const { acc, rgb } = CH2;
  const to = f < 29 ? lin(f, 6, 29, 122, 147, EIO) : lin(f, 29, 40, 147, 156, EIO);
  const p = c2pts(to);
  const d = 'M' + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L');
  const last = p[p.length - 1];
  const mk = f >= 29 ? lin(f, 29, 35, 0, 1, EOUT) : 0;
  const endS = f >= 40 ? lin(f, 40, 46, 0, 1, Easing.out(Easing.back(1.6))) : 0;
  const q = f >= 46 ? ((f - 46) % 30) / 30 : 0;
  const roB = lin(f, 30, 38, 0, 1, EOUT);
  const pct = Math.round(lin(f, 30, 63, 0, C2_PCT, EOUT));
  const push = lin(f, 63, 120, 1, 1.03, SIN);
  const px = c2x(122), py = c2y(C2_SERIES[122]);
  const ex = c2x(C2N - 1), ey = c2y(C2_SERIES[C2N - 1]);
  const mx = c2x(147);
  return (
    <Stage acc={acc} orb={640} ey="ROBINHOOD CHAIN · FEES PER DAY" push={push}
      title={<>The peak, and the <span style={{ color: acc }}>fall</span></>}
      src="Source: DefiLlama, Robinhood Chain daily fees (api.llama.fi), 2026-05-05 to 2026-10-08, read 2026-10-09 · series in C2-data.json">
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="c2ar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgba(${rgb},.30)`} /><stop offset="1" stopColor={`rgba(${rgb},0)`} />
          </linearGradient>
        </defs>
        <text x={140} y={296} style={{ ...tagStyle, fill: K.t3 }}>fees per day, in dollars</text>
        {[2e6, 4e6, 6e6].map((m) => (
          <g key={m}>
            <line x1={200} x2={1340} y1={c2y(m)} y2={c2y(m)} stroke="rgba(136,146,164,.16)" strokeWidth={1.5} strokeDasharray="4 7" />
            <text x={184} y={c2y(m) + 7} textAnchor="end" style={{ fontFamily: MONO, fontSize: 20, fill: K.t3 }}>{m / 1e6}M</text>
          </g>
        ))}
        <line x1={200} x2={1340} y1={850} y2={850} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
        <text x={184} y={857} textAnchor="end" style={{ fontFamily: MONO, fontSize: 20, fill: K.t3 }}>0</text>
        {([[0, 'May 5'], [27, 'Jun'], [57, 'Jul'], [88, 'Aug'], [119, 'Sep'], [149, 'Oct']] as [number, string][]).map(([i, l]) => (
          <g key={l}>
            <line x1={c2x(i)} x2={c2x(i)} y1={850} y2={858} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
            <text x={c2x(i)} y={888} textAnchor={i === 0 ? 'start' : 'middle'} style={{ fontFamily: MONO, fontSize: 20, fill: K.t3 }}>{l}</text>
          </g>
        ))}
        <path d={`${d} L${last[0].toFixed(1)} 850 L200 850 Z`} fill="url(#c2ar)" />
        {mk > 0 && (
          <g opacity={mk}>
            <line x1={mx} x2={mx} y1={850} y2={850 - 300 * mk} stroke="rgba(232,234,240,.55)" strokeWidth={2} strokeDasharray="6 7" />
            <text x={mx - 14} y={578} textAnchor="end" style={{ fontFamily: DM, fontSize: 21, fill: K.t2 }}>free gas ends</text>
            <text x={mx - 14} y={608} textAnchor="end" style={{ fontFamily: MONO, fontWeight: 600, fontSize: 21, fill: K.t1 }}>2026-09-29</text>
          </g>
        )}
        <path d={d} fill="none" stroke={acc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px rgba(${rgb},.55))` }} />
        <circle cx={px} cy={py} r={9} fill={acc} />
        <circle cx={px} cy={py} r={17} fill="none" stroke={`rgba(${rgb},.45)`} strokeWidth={2} />
        <text x={px - 26} y={py + 7} textAnchor="end" style={{ fontFamily: MONO, fontWeight: 600, fontSize: 21, fill: K.t2 }}>2026-09-04</text>
        {endS > 0 && (
          <g transform={`translate(${ex} ${ey}) scale(${endS}) translate(${-ex} ${-ey})`}>
            <circle cx={ex} cy={ey} r={9} fill={acc} />
            <circle cx={ex} cy={ey} r={20} fill="none" stroke={`rgba(${rgb},.55)`} strokeWidth={2.5} />
          </g>
        )}
        {f >= 46 && <circle cx={ex} cy={ey} r={9 + 17 * q} fill="none" stroke={acc} strokeWidth={2} opacity={0.55 * (1 - q)} />}
      </svg>
      <div style={{ position: 'absolute', left: 1450, top: 318, width: 330 }}>
        <div style={tagStyle}>Peak day, 2026-09-04</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, lineHeight: 1, fontSize: 66, color: K.t1, marginTop: 12 }}>6.04M</div>
        <div style={{ fontFamily: DM, fontSize: 22, color: K.t2, marginTop: 10 }}>in fees in one day</div>
      </div>
      {roB > 0 && (
        <div style={{ position: 'absolute', left: 1450, top: 540, width: 330, paddingTop: 30, opacity: roB,
          transform: `translateY(${24 * (1 - roB)}px)`, borderTop: '1.5px solid rgba(136,146,164,.22)' }}>
          <div style={tagStyle}>Last full day, 2026-10-08</div>
          <div style={{ fontFamily: DM, fontSize: 30, color: K.t2, marginTop: 14 }}>about</div>
          <div style={{ fontFamily: MONO, fontWeight: 600, lineHeight: 1, fontSize: 140, color: acc, marginTop: 2,
            textShadow: `0 0 40px rgba(${rgb},.45)` }}>{pct}%</div>
          <div style={{ fontFamily: DM, fontWeight: 700, fontSize: 30, color: K.t1, marginTop: 8 }}>below the peak</div>
        </div>
      )}
    </Stage>
  );
};

// ===================================================================================== C4
// ARB's one number (COMPUTED): 1.225B market cap / 12.38M DAO income a year = about 99x; 65x and 150x alternates.
// [VERIFY] at render (DATA.md): each recomputed value must still round to the spoken one.
const C4_CAP = 1225.3e6, C4_DAO = 12.38e6, C4_LIC = 19.02e6, C4_REV = 8.2e6;
if (Math.round(C4_CAP / C4_DAO) !== 99) throw new Error('C4: market cap / DAO income no longer rounds to 99x (STOP and flag)');
if (Math.round(C4_CAP / C4_REV) !== 149 && Math.round(C4_CAP / C4_REV) !== 150) throw new Error('C4: the revenue-only multiple is no longer about 150x');
if (Math.round(C4_CAP / C4_LIC) !== 64 && Math.round(C4_CAP / C4_LIC) !== 65) throw new Error('C4: the revenue + license multiple is no longer about 65x');
const c4x = (v: number) => 200 + (1720 - 200) * v / 160;
const C4_PINS: Record<number, [string, string, string]> = {
  99: ['about 99x', 'the DAO’s own income', '6.19M (H1 2026) × 2'],
  65: ['about 65x', 'chain revenue + license line', '8.2M + 10.8M a year'],
  150: ['about 150x', 'Arbitrum One revenue only', '8.2M a year'],
};

export const ChartC4: React.FC<{ f: number }> = ({ f }) => {
  const { acc, rgb } = CH2;
  const AY = 800;
  const about = lin(f, 0, 6, 0, 1);
  const n = Math.round(lin(f, 0, 15, 0, 99, EOUT));
  const pop = f >= 15 && f <= 21 ? 1 + 0.04 * Math.sin(Math.PI * (f - 15) / 6) : 1;
  const comp = lin(f, 15, 23, 0, 1, EOUT);
  const axis = lin(f, 40, 48, 0.5, 1);
  const pinS = (a: number) => lin(f, a, a + 8, 0, 1, Easing.out(Easing.back(1.4)));
  const pinO = (a: number) => lin(f, a, a + 8, 0, 1);
  const pins: [number, number][] = [[99, 15], [65, 83], [150, 107]];
  const a = c4x(65), b = c4x(150), by = 708;
  const brLen = 14 + (b - a) + 14;
  const br = lin(f, 107, 125, 0, 1, EIO);
  const brl = lin(f, 120, 126, 0, 1);
  const push = lin(f, 125, 213, 1, 1.03, SIN);
  return (
    <Stage acc={acc} orb={640} ey="ARB · THE ONE NUMBER" push={push}
      title={<>Market cap against what it <span style={{ color: acc }}>earns</span></>}
      src="Computed. Market cap: CoinGecko, 2026-10-09 21:55 UTC · DAO income: Foundation H1 2026 report (The Block) · revenue: DefiLlama, 30 days × 12.17">
      <div style={{ position: 'absolute', left: 140, top: 300, width: 700 }}>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 92, lineHeight: 1, color: K.t1 }}>1.225B</div>
        <div style={{ fontFamily: DM, fontSize: 23, color: K.t2, marginTop: 12 }}>ARB market cap, 2026-10-09 21:55 UTC</div>
        <div style={{ height: 3, background: 'rgba(136,146,164,.5)', margin: '30px 0 28px', width: 640 }} />
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 92, lineHeight: 1, color: K.t1 }}>12.38M</div>
        <div style={{ fontFamily: DM, fontSize: 23, color: K.t2, marginTop: 12 }}>the DAO’s own income a year: 6.19M in H1 2026, × 2</div>
      </div>
      <div style={{ position: 'absolute', left: 820, top: 398, fontFamily: MONO, fontWeight: 600, fontSize: 92, color: K.t3 }}>=</div>
      <div style={{ position: 'absolute', left: 930, top: 290, width: 850 }}>
        <div style={{ fontFamily: DM, fontSize: 38, color: K.t2, opacity: about }}>about</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 250, lineHeight: 0.95, color: acc, letterSpacing: '-.02em',
          textShadow: `0 0 50px rgba(${rgb},.45)`, transform: `scale(${pop})`, transformOrigin: '0% 60%' }}>{n}x</div>
        <div style={{ fontFamily: DM, fontWeight: 500, fontSize: 24, color: K.t3, marginTop: 6, opacity: comp }}>computed from their own numbers</div>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <g opacity={axis}>
          <line x1={200} x2={1720} y1={AY} y2={AY} stroke="rgba(136,146,164,.5)" strokeWidth={2.5} />
          {[0, 50, 100, 150].map((v) => <line key={v} x1={c4x(v)} x2={c4x(v)} y1={AY - 8} y2={AY + 8} stroke="rgba(136,146,164,.5)" strokeWidth={2} />)}
          <text x={186} y={AY + 7} textAnchor="end" style={{ fontFamily: MONO, fontSize: 20, fill: K.t3 }}>0x</text>
        </g>
        {br > 0 && (
          <path d={`M${a} ${by + 14} L${a} ${by} L${b} ${by} L${b} ${by + 14}`} fill="none" stroke={`rgba(${rgb},.75)`} strokeWidth={2.5}
            strokeDasharray={brLen} strokeDashoffset={brLen * (1 - br)} />
        )}
        {brl > 0 && (
          <text x={(a + b) / 2} y={by - 16} textAnchor="middle" opacity={brl} style={{ fontFamily: DM, fontWeight: 700, fontSize: 23, fill: acc }}>
            65x to 150x, depending on what you count</text>
        )}
        {pins.map(([v, at]) => {
          if (f < at) return null;
          const x = c4x(v), hot = v === 99, t = C4_PINS[v], s = pinS(at), o = pinO(at);
          return (
            <g key={v}>
              <g transform={`translate(${x} ${AY}) scale(${s}) translate(${-x} ${-AY})`}>
                <circle cx={x} cy={AY} r={hot ? 15 : 11} fill={hot ? acc : '#e8eaf0'}
                  style={hot ? { filter: `drop-shadow(0 0 10px rgba(${rgb},.9))` } : undefined} />
              </g>
              <g opacity={o}>
                <text x={x} y={AY - 30} textAnchor="middle" style={{ fontFamily: MONO, fontWeight: 600, fontSize: hot ? 34 : 30, fill: hot ? acc : K.t1 }}>{t[0]}</text>
                <text x={x} y={AY + 50} textAnchor="middle" style={{ fontFamily: DM, fontSize: 20, fill: K.t2 }}>{t[1]}</text>
                <text x={x} y={AY + 80} textAnchor="middle" style={{ fontFamily: MONO, fontWeight: 600, fontSize: 19, fill: K.t3 }}>{t[2]}</text>
              </g>
            </g>
          );
        })}
      </svg>
    </Stage>
  );
};

// ===================================================================================== C22
// TAO issuance: 7,200 a day -> 3,600 a day at the December 2025 halving; 11,339,646 of 21,000,000 issued = 54.0%.
// Labels in TAO, NEVER dollars (flag 433.76). [VERIFY] at render: the fill must still round to 54.
const C22_FILL = 11339646 / 21e6;
if (Math.round(C22_FILL * 100) !== 54) throw new Error('C22: circulating TAO no longer rounds to 54% of the cap (STOP and flag)');
const c22x = (d: number) => 230 + (1060 - 230) * d / 495;
const c22y = (v: number) => 820 - (820 - 330) * v / 8000;
const c22s = (s: number) => 820 - (820 - 330) * s / 21e6;
const c22fill = (f: number) => C22_FILL * Easing.out(Easing.quad)(lin(f, 39, 68, 0, 1));
const C22_CROSS = (() => { for (let f = 39; f <= 68; f++) if (c22fill(f) * 21e6 >= 10.5e6) return f; return 68; })();

export const ChartC22: React.FC<{ f: number }> = ({ f }) => {
  const { acc, rgb } = CH4;
  const xh = c22x(197);
  const seg = lin(f, 0, 11, 0, 1, EOUT);
  const segLen = 1060 - xh;
  const lab = lin(f, 4, 11, 0, 1, EOUT);
  const fill = c22fill(f);
  const yf = c22s(21e6 * fill);
  const hot = f >= C22_CROSS && f < C22_CROSS + 10;
  const ro = f >= 39;
  const pct = Math.round(fill * 100);
  const tail = lin(f, 68, 76, 0, 1);
  const push = lin(f, 76, 120, 1, 1.03, SIN);
  const TX = 1240, TW = 130, TT = 330, TB = 820;
  return (
    <Stage acc={acc} orb={600} ey="TAO · NEW SUPPLY" push={push}
      title={<>Halved emission, a <span style={{ color: acc, fontFamily: MONO, fontWeight: 600 }}>21M</span> cap</>}
      src="Sources: Bittensor docs, emissions (0.5 TAO a block, about 3,600 a day; first halving December 2025; 21M max; halvings at 10.5M, 15.75M) · CoinGecko">
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="c22tf" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={`rgba(${rgb},.55)`} /><stop offset="1" stopColor={`rgba(${rgb},.95)`} />
          </linearGradient>
          <clipPath id="c22tc"><rect x={TX} y={TT} width={TW} height={TB - TT} rx={16} /></clipPath>
        </defs>
        <text x={140} y={296} style={{ ...tagStyle, fill: K.t3 }}>TAO issued per day</text>
        {[2000, 4000, 6000, 8000].map((v) => (
          <g key={v}>
            <line x1={230} x2={1060} y1={c22y(v)} y2={c22y(v)} stroke="rgba(136,146,164,.16)" strokeWidth={1.5} strokeDasharray="4 7" />
            <text x={216} y={c22y(v) + 7} textAnchor="end" style={{ fontFamily: MONO, fontSize: 19, fill: K.t3 }}>{v.toLocaleString('en-US')}</text>
          </g>
        ))}
        <line x1={230} x2={1060} y1={820} y2={820} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
        <text x={216} y={827} textAnchor="end" style={{ fontFamily: MONO, fontSize: 19, fill: K.t3 }}>0</text>
        {([[0, '2025-06'], [92, '2025-09'], [183, '2025-12'], [273, '2026-03'], [365, '2026-06'], [457, '2026-09']] as [number, string][]).map(([dd, l]) => (
          <g key={l}>
            <line x1={c22x(dd)} x2={c22x(dd)} y1={820} y2={828} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
            <text x={c22x(dd)} y={856} textAnchor="middle" style={{ fontFamily: MONO, fontSize: 19, fill: K.t3 }}>{l}</text>
          </g>
        ))}
        <line x1={xh} x2={xh} y1={820} y2={324} stroke="rgba(232,234,240,.35)" strokeWidth={2} strokeDasharray="6 7" />
        <text x={xh + 16} y={348} style={{ fontFamily: DM, fontSize: 21, fill: K.t2 }}>first halving</text>
        <text x={xh + 16} y={376} style={{ fontFamily: DM, fontWeight: 700, fontSize: 21, fill: K.t1 }}>December 2025</text>
        <path d={`M230 ${c22y(7200)} L${xh} ${c22y(7200)}`} fill="none" stroke="rgba(136,146,164,.75)" strokeWidth={4} strokeLinecap="round" />
        <line x1={xh} x2={xh} y1={c22y(7200)} y2={c22y(3600)} stroke={`rgba(${rgb},.6)`} strokeWidth={2.5} strokeDasharray="5 6" />
        <path d={`M${xh} ${c22y(3600)} L1060 ${c22y(3600)}`} fill="none" stroke={acc} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={segLen} strokeDashoffset={segLen * (1 - seg)} style={{ filter: `drop-shadow(0 0 7px rgba(${rgb},.7))` }} />
        {seg >= 1 && <circle cx={1060} cy={c22y(3600)} r={8} fill={acc} />}
        <text x={242} y={c22y(7200) - 20} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, fill: K.t2 }}>7,200 a day</text>
        <text x={xh + 24} y={c22y(3600) - 22 + 10 * (1 - lab)} opacity={lab} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, fill: acc }}>3,600 TAO a day</text>
        <rect x={TX} y={TT} width={TW} height={TB - TT} rx={16} fill="rgba(18,21,28,.9)" stroke="rgba(136,146,164,.5)" strokeWidth={2.5} />
        {fill > 0 && (
          <g>
            <rect x={TX} y={yf} width={TW} height={TB - yf} fill="url(#c22tf)" clipPath="url(#c22tc)" />
            <line x1={TX} x2={TX + TW} y1={yf} y2={yf} stroke="#fff" strokeOpacity={0.85} strokeWidth={3} />
          </g>
        )}
        {([[21e6, '21M', 'the cap'], [15.75e6, '15.75M', 'next halving'], [10.5e6, '10.5M', 'first halving']] as [number, string, string][]).map(([v, l, dd]) => {
          const y = c22s(v), h = hot && v === 10.5e6;
          return (
            <g key={l}>
              <line x1={TX + TW - 22} x2={TX + TW + 14} y1={y} y2={y} stroke={h ? acc : 'rgba(232,234,240,.55)'} strokeWidth={h ? 3 : 2} />
              <text x={TX + TW + 26} y={y + 2} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, fill: h ? acc : K.t1 }}>{l}</text>
              <text x={TX + TW + 26} y={y + 28} style={{ fontFamily: DM, fontSize: 20, fill: h ? acc : K.t2 }}>{dd}</text>
            </g>
          );
        })}
        <text x={TX + TW / 2} y={TB + 36} textAnchor="middle" style={{ fontFamily: MONO, fontSize: 19, fill: K.t3 }}>0</text>
      </svg>
      {ro && (
        <div style={{ position: 'absolute', left: 1420, top: 640, width: 380 }}>
          <div style={{ fontFamily: DM, fontSize: 30, color: K.t2 }}>about</div>
          <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 120, lineHeight: 1, color: acc, textShadow: `0 0 40px rgba(${rgb},.45)` }}>{pct}%</div>
          <div style={{ opacity: tail }}>
            <div style={{ fontFamily: DM, fontWeight: 700, fontSize: 28, color: K.t1, marginTop: 8 }}>of the 21M cap issued</div>
            <div style={{ fontFamily: MONO, fontSize: 18, color: K.t3, marginTop: 10 }}>11,339,646 of 21,000,000 TAO<br />CoinGecko, read 2026-10-09</div>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ===================================================================================== tao-rev-vs-emissions
// Customer money (28M to 35M a year, as reported) against new TAO (3,600 x 365 = about 1.3M TAO a year = about 360M
// dollars at the 2026-10-09 21:55 UTC TAO price; COMPUTED). The TAO price itself is never on screen.
// Timing: the row-1 bar grows from 461.69 (f13), after the spin settles (TRANSITIONS.md section 4 at 461.25).
const tvx = (v: number) => 600 + (1720 - 600) * v / 400;
const R1 = 372, R2 = 592, RH = 84;

export const ChartTaoRev: React.FC<{ f: number }> = ({ f }) => {
  const { acc, rgb } = CH4;
  const g1 = lin(f, 13, 21, 0, 28, EOUT);
  const hatch = lin(f, 36, 44, 28, 35, EOUT);
  const l1 = lin(f, 36, 44, 0, 1);
  const settle = lin(f, 107, 117, 0, 1);
  const r2l = lin(f, 107, 117, 0.14, 1);
  const emis = lin(f, 117, 211, 0, 360, EIO);
  const v2 = lin(f, 211, 217, 0, 1);
  const cmp = lin(f, 230, 240, 0, 1);
  const push = lin(f, 240, 295, 1, 1.03, SIN);
  const litA = 1 - 0.4 * settle; // row-1 solid opacity 1 -> .6
  const glow = 1 - settle;
  const c28 = tvx(Math.min(g1, 28)), c35 = tvx(f >= 36 ? hatch : g1);
  const hFill = 0.35 - 0.13 * settle, hLine = 0.95 - 0.35 * settle;
  const lab = (on: boolean, o: number, top: number, tag: string, ttl: string, sub: React.ReactNode) => (
    <div style={{ position: 'absolute', left: 140, top, width: 420, opacity: o }}>
      <div style={{ ...tagStyle, color: on ? acc : K.t3 }}>{tag}</div>
      <div style={{ fontFamily: DM, fontWeight: 700, fontSize: 34, color: K.t1, marginTop: 6 }}>{ttl}</div>
      <div style={{ fontFamily: DM, fontSize: 22, lineHeight: 1.35, color: K.t2, marginTop: 6 }}>{sub}</div>
    </div>
  );
  return (
    <Stage acc={acc} orb={600} ey="TAO · WHERE THE PAY COMES FROM" push={push}
      title={<>Customer money against <span style={{ color: acc }}>new coins</span></>}
      src="Sources: Crypto Briefing, 2026-09-29 · Bittensor docs, emissions · CoinGecko, 2026-10-09 21:55 UTC">
      {lab(true, 1, R1 - 6, 'Customer money', 'Paid by customers', <>about two dozen subnets,<br />a year, as reported</>)}
      {lab(r2l > 0.5, r2l, R2 - 6, 'New TAO issued', 'about 1.3M TAO a year', <>3,600 a day × 365</>)}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="tvg2" x1="0" x2="1"><stop offset="0" stopColor={`rgba(${rgb},.55)`} /><stop offset="1" stopColor={`rgba(${rgb},1)`} /></linearGradient>
          <pattern id="tvhatch" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={10} height={10} fill={`rgba(${rgb},${hFill})`} />
            <line x1={0} y1={0} x2={0} y2={10} stroke={`rgba(${rgb},${hLine})`} strokeWidth={4} />
          </pattern>
        </defs>
        {[100, 200, 300, 400].map((v) => <line key={v} x1={tvx(v)} x2={tvx(v)} y1={340} y2={760} stroke="rgba(136,146,164,.14)" strokeWidth={1.5} strokeDasharray="4 7" />)}
        <line x1={600} x2={1720} y1={780} y2={780} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
        {[0, 100, 200, 300, 400].map((v) => (
          <g key={v}>
            <line x1={tvx(v)} x2={tvx(v)} y1={780} y2={788} stroke="rgba(136,146,164,.45)" strokeWidth={2} />
            <text x={tvx(v)} y={816} textAnchor="middle" style={{ fontFamily: MONO, fontSize: 19, fill: K.t3 }}>{v ? `${v}M` : '0'}</text>
          </g>
        ))}
        <text x={1720} y={850} textAnchor="end" style={{ ...tagStyle, fill: K.t3 }}>dollars a year</text>
        <rect x={600} y={R1} width={1120} height={RH} rx={10} fill="rgba(136,146,164,.07)" />
        <rect x={600} y={R2} width={1120} height={RH} rx={10} fill="rgba(136,146,164,.07)" />
        {g1 > 0 && (
          <rect x={600} y={R1} width={c28 - 600} height={RH} rx={8} fill={`rgba(${rgb},${litA})`}
            style={glow > 0.01 ? { filter: `drop-shadow(0 0 ${12 * glow}px rgba(${rgb},${0.8 * glow}))` } : undefined} />
        )}
        {f >= 36 && hatch > 28 && <rect x={c28} y={R1} width={c35 - c28} height={RH} fill="url(#tvhatch)" />}
        {l1 > 0 && <text x={c35 + 22} y={R1 + RH / 2 + 11} opacity={l1} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, fill: K.t1 }}>28M to 35M</text>}
        {emis > 0 && (
          <rect x={600} y={R2} width={tvx(emis) - 600} height={RH} rx={8} fill="url(#tvg2)" style={{ filter: `drop-shadow(0 0 14px rgba(${rgb},.7))` }} />
        )}
        {v2 > 0 && (
          <g opacity={v2}>
            <text x={tvx(emis) - 24} y={R2 + RH / 2 + 13} textAnchor="end" style={{ fontFamily: MONO, fontWeight: 600, fontSize: 36, fill: '#fff' }}>about 360M</text>
            <text x={tvx(emis)} y={R2 + RH + 34} textAnchor="end" style={{ fontFamily: DM, fontSize: 20, fill: K.t2 }}>at the TAO price, read 2026-10-09 21:55 UTC</text>
          </g>
        )}
      </svg>
      {cmp > 0 && (
        <div style={{ position: 'absolute', left: 600, top: 880, width: 1180, opacity: cmp, fontFamily: DM, fontSize: 21, lineHeight: 1.45, color: K.t2 }}>
          <b style={{ color: acc, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', fontSize: 16, marginRight: 12 }}>Computed</b>
          3,600 TAO a day × 365 × the TAO price at read (CoinGecko). Customer money: Crypto Briefing on Steeves’ keynote, 2026-09-29 (a SubConnect index), annualized.
        </div>
      )}
    </Stage>
  );
};
