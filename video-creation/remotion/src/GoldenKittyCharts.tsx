// GoldenKittyCharts.tsx: the six Type 1 ANIMATED charts of golden-kitty (comp-build.md §7, charts.md).
// Each is a REAL useCurrentFrame build of its design spec (assets/charts/<id>-spec.md); the PNG states in
// assets/charts/ are only the spec. Layout + CSS are ported 1:1 from the chart's HTML source so the build
// reproduces the spec stills pixel-for-pixel at each state. Every value is the DATA.md recording-day value
// (read Oct 1, 2026, PROJECT-LOG Open flags: never a live re-pull, never "15x" on screen).
// Time input `t` = SOURCE-spine seconds (the comp passes c.tIn + local / FPS); no chart straddles a card pause.
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

const CSS = `
.gkc{--bg-deep:#0a0c10;--bg-card:#12151c;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;
  --accent-red:#ff4060;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330;
  --lime:#ccff00;--gold:#ffd700}
.gkc *{margin:0;padding:0;box-sizing:border-box}
.gkc .frame{width:1920px;height:1080px;background:var(--bg-deep);position:absolute;left:0;top:0;overflow:hidden;
  display:block;color:var(--text-primary);font-family:'DM Sans',sans-serif}
.gkc .frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:50;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.gkc .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.26;pointer-events:none;z-index:0}
.gkc .frame>*:not(.orb){z-index:1}
.gkc .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:18px}
.gkc h1{font-family:'Playfair Display',serif;font-weight:900;font-size:68px;line-height:1.07;letter-spacing:-.02em;color:var(--text-primary)}
.gkc .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));margin:26px 0 0}
.gkc .lm{color:var(--lime)} .gkc .gd{color:var(--gold)}
.gkc .hdr{position:absolute;left:140px;top:78px;width:1640px}
.gkc .src{position:absolute;left:140px;bottom:40px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:19px;color:var(--text-muted)}
.gkc svg.lay{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
.gkc .chip{display:inline-block;padding:8px 20px;border-radius:100px;font-family:'JetBrains Mono';font-weight:600;
  font-size:26px;border:2px solid var(--border);color:var(--text-primary);background:rgba(255,255,255,.03)}
.gkc .chip.green{color:var(--accent-green);border-color:rgba(0,230,138,.5);background:rgba(0,230,138,.09)}
/* cap-vs-volume */
.gkc .row{position:absolute;left:140px;width:1640px}
.gkc .row .lab{font-family:'DM Sans';font-weight:700;font-size:30px;letter-spacing:.12em;text-transform:uppercase}
.gkc .row .val{position:absolute;right:0;top:-36px;font-family:'JetBrains Mono';font-weight:600;font-size:118px;line-height:1}
.gkc .track{position:absolute;left:0;width:1640px;height:46px;border-radius:10px;background:#141823;border:1px solid var(--border)}
.gkc .fill{position:absolute;left:0;top:0;height:100%;border-radius:10px}
/* C2 */
.gkc .term{position:absolute;top:400px;height:280px;border-radius:22px;border:2px solid var(--border);background:var(--bg-card);padding:36px 34px;display:flex;flex-direction:column}
.gkc .term .lab{font-family:'DM Sans';font-weight:700;font-size:25px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-secondary)}
.gkc .term .v{font-family:'JetBrains Mono';font-weight:600;font-size:66px;line-height:1;margin-top:40px;white-space:pre}
.gkc .term .u{font-family:'DM Sans';font-size:24px;color:var(--text-secondary);margin-top:14px}
.gkc .op{position:absolute;top:490px;width:110px;text-align:center;font-family:'JetBrains Mono';font-weight:400;font-size:96px;line-height:1;color:var(--text-muted)}
.gkc .ex{position:absolute;top:712px}
.gkc .exlab{position:absolute;left:140px;top:820px;font-family:'DM Sans';font-weight:700;font-size:22px;letter-spacing:.18em;color:var(--text-muted)}
/* C3 */
.gkc .hero{position:absolute;left:140px;top:330px;width:900px;height:560px;border-radius:24px;border:2px solid rgba(255,215,0,.6);
  background:linear-gradient(160deg,rgba(255,215,0,.07),rgba(18,21,28,1) 60%);box-shadow:0 0 90px rgba(255,215,0,.12);padding:46px 52px}
.gkc .hero .lab{font-family:'DM Sans';font-weight:700;font-size:30px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}
.gkc .hero .ab{font-family:'DM Sans';font-weight:600;font-size:30px;color:var(--text-secondary);margin-top:40px}
.gkc .hero .num{font-family:'JetBrains Mono';font-weight:600;font-size:250px;line-height:1;color:var(--gold);display:flex;align-items:baseline;gap:26px}
.gkc .hero .num span{font-size:72px}
.gkc .conv{position:absolute;left:1160px;width:620px;height:250px;border-radius:22px;border:2px solid var(--border);background:var(--bg-card);padding:36px 40px}
.gkc .conv .ab{font-family:'DM Sans';font-weight:600;font-size:24px;color:var(--text-secondary)}
.gkc .conv .v{font-family:'JetBrains Mono';font-weight:600;font-size:86px;line-height:1.05;color:var(--text-primary);margin-top:6px}
.gkc .conv .l{font-family:'DM Sans';font-size:26px;color:var(--text-secondary);margin-top:8px}
/* C19a / C19b */
.gkc .stat{position:absolute;top:340px;width:790px;height:520px;border-radius:24px;border:2px solid var(--border);background:var(--bg-card);padding:54px 56px;overflow:hidden}
.gkc .stat .acc{position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,var(--lime),transparent)}
.gkc .stat .v{font-family:'JetBrains Mono';font-weight:600;font-size:170px;line-height:1;color:var(--lime);margin-top:30px}
.gkc .stat .l{font-family:'DM Sans';font-weight:700;font-size:34px;letter-spacing:.10em;text-transform:uppercase;color:var(--text-primary);line-height:1.35;margin-top:44px}
.gkc .stat.on{border-color:rgba(204,255,0,.55);box-shadow:0 0 80px rgba(204,255,0,.10)}
/* app-users-share */
.gkc .blab{position:absolute;left:140px;top:430px;font-family:'DM Sans';font-weight:700;font-size:30px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-primary)}
.gkc .btrack{position:absolute;left:140px;top:490px;width:1640px;height:150px;border-radius:14px;background:#141823;border:1px solid var(--border);overflow:hidden}
.gkc .bsol{position:absolute;left:0;top:0;height:100%;background:var(--lime);box-shadow:0 0 30px rgba(204,255,0,.8)}
.gkc .bhat{position:absolute;top:0;height:100%;background:repeating-linear-gradient(135deg,rgba(204,255,0,.85) 0 4px,rgba(204,255,0,.15) 4px 9px)}
.gkc .callout{position:absolute;left:140px;top:700px}
.gkc .callout .big{font-family:'JetBrains Mono';font-weight:600;font-size:120px;line-height:1;color:var(--lime)}
.gkc .callout .l{font-family:'DM Sans';font-weight:700;font-size:34px;letter-spacing:.10em;text-transform:uppercase;color:var(--text-primary);margin-top:14px}
`;

const FPS = 30;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
/** progress 0..1 of a move that starts at source time a and lasts d seconds */
const prog = (t: number, a: number, d: number, ease = easeOut) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: ease });
/** 0..1 over n frames from source time a (state cross-fades, card lifts) */
const fadeF = (t: number, a: number, nFrames: number) => interpolate(t, [a, a + nFrames / FPS], [0, 1], clamp);

const Frame: React.FC<{ orbs: 'gold' | 'gold2' | 'lime'; children: React.ReactNode }> = ({ orbs, children }) => (
  <AbsoluteFill className="gkc">
    <style>{CSS}</style>
    <div className="frame">
      {orbs === 'lime' ? (
        <>
          <div className="orb" style={{ left: 1350, top: -300, width: 640, height: 640, background: '#6d8a00' }} />
          <div className="orb" style={{ left: -300, top: 640, width: 520, height: 520, background: '#3d4a10' }} />
        </>
      ) : orbs === 'gold2' ? (
        <>
          <div className="orb" style={{ left: 1350, top: -300, width: 680, height: 680, background: '#b89400' }} />
          <div className="orb" style={{ left: -300, top: 640, width: 520, height: 520, background: '#7a6200' }} />
        </>
      ) : (
        <>
          <div className="orb" style={{ left: 1350, top: -300, width: 680, height: 680, background: '#b89400' }} />
          <div className="orb" style={{ left: -300, top: 620, width: 560, height: 560, background: '#6d8a00' }} />
        </>
      )}
      {children}
    </div>
  </AbsoluteFill>
);

// ── cap-vs-volume (CH3 162.48-167.43) ───────────────────────────────────────────────────────────────
export const CapVsVolume: React.FC<{ t: number }> = ({ t }) => {
  const g = prog(t, 162.48, 0.92);                       // $0 -> $4.2M, sliver 0 -> 6px (= mid)
  const v = prog(t, 165.12, 1.1, easeInOut);             // "90 billion": $0 -> $90B+, bar races 0 -> 1640 (= payoff)
  const gVal = g <= 0 ? '$0' : `$${(4.2 * g).toFixed(1)}M`;
  const vVal = v >= 1 ? '$90B+' : Math.floor(90 * v) < 1 ? '$0' : `$${Math.floor(90 * v)}B`;
  return (
    <Frame orbs="gold">
      <div className="hdr"><div className="ey">THE SIZE GAP</div><h1>A <span className="gd">Small Cap</span> on a <span className="lm">Busy Chain</span></h1><div className="divider" /></div>
      <div className="row" style={{ top: 380 }}>
        <div className="lab gd">GOLDEN market cap</div><div className="val gd">{gVal}</div>
        <div className="track" style={{ top: 96 }}><div className="fill" style={{ width: 6 * g, background: 'var(--gold)', boxShadow: '0 0 22px rgba(255,215,0,.9)' }} /></div>
      </div>
      <div className="row" style={{ top: 680 }}>
        <div className="lab lm">Robinhood Chain DEX volume, all time</div><div className="val lm">{vVal}</div>
        <div className="track" style={{ top: 96 }}><div className="fill" style={{ width: 1640 * v, background: 'linear-gradient(90deg,rgba(204,255,0,.35),var(--lime))', boxShadow: '0 0 34px rgba(204,255,0,.45)' }} /></div>
      </div>
      <div className="src">Market cap: DexScreener · DEX volume: DefiLlama daily chain chart, summed · read Oct 1, 2026</div>
    </Frame>
  );
};

// ── C2 price formula (CH4 219.45-230.86) ────────────────────────────────────────────────────────────
const GREEN_BORDER = { borderColor: 'rgba(0,230,138,.75)', boxShadow: '0 0 0 6px rgba(0,230,138,.10),0 0 90px rgba(0,230,138,.25)' };
const countStr = (target: number, decimals: number, p: number, prefix = '') =>
  p <= 0 ? ' ' : `${prefix}${(target * p).toFixed(decimals)} `;
export const C2Formula: React.FC<{ t: number }> = ({ t }) => {
  // term 1 value counts in on "dollar" (219.70); '=' + term 2 on "price in gold" (220.94); 'x' + term 3 on "price of gold" (222.74)
  const v1 = prog(t, 219.7, 0.6);
  const in2 = prog(t, 220.94, 8 / FPS), v2 = prog(t, 220.94, 0.6);
  const in3 = prog(t, 222.74, 8 / FPS), v3 = prog(t, 222.74, 0.6);
  const ex = t >= 227.18;                                          // example-gold
  const exP = prog(t, 227.18, 8 / FPS);
  const pay = t >= 229.64;                                         // payoff
  const payP = prog(t, 229.64, 8 / FPS);
  const chipPop = (p: number) => ({ opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center', display: 'inline-block' });
  const up = (p: number) => ({ opacity: p, transform: `translateY(${20 * (1 - p)}px)` });
  return (
    <Frame orbs="gold">
      <div className="hdr"><div className="ey">THE PRICE MATH</div><h1>Priced in <span className="gd">Gold</span></h1><div className="divider" /></div>
      <div className="term" style={{ left: 140, width: 480, ...(pay ? GREEN_BORDER : { borderColor: 'rgba(232,234,240,.38)' }) }}>
        <div className="lab">GOLDEN in dollars</div>
        <div className="v" style={{ color: 'var(--text-primary)' }}>{countStr(0.004234, 6, v1, '$')}</div>
        <div className="u" style={{ opacity: v1 > 0 ? 1 : 0 }}>per GOLDEN</div>
      </div>
      <div className="term" style={{ left: 730, width: 520, borderColor: 'rgba(255,215,0,.6)', ...up(in2) }}>
        <div className="lab">GOLDEN in gold</div>
        <div className="v" style={{ color: 'var(--gold)' }}>{countStr(0.00001109, 8, v2)}</div>
        <div className="u">GLD per GOLDEN</div>
      </div>
      <div className="term" style={{ left: 1360, width: 420, ...(ex ? GREEN_BORDER : { borderColor: 'rgba(255,215,0,.6)' }), ...up(in3) }}>
        <div className="lab">Gold in dollars</div>
        <div className="v" style={{ color: 'var(--gold)' }}>{countStr(381.79, 2, v3, '$')}</div>
        <div className="u">per GLD</div>
      </div>
      <div className="op" style={{ left: 620, ...up(in2) }}>=</div>
      <div className="op" style={{ left: 1250, ...up(in3) }}>&times;</div>
      <div className="exlab" style={{ opacity: exP }}>EXAMPLE, NOT A FORECAST</div>
      <div className="ex" style={{ left: 140 }}><span className="chip green" style={{ fontSize: 34, ...chipPop(payP) }}>+10%</span></div>
      <div className="ex" style={{ left: 730 }}><span className="chip" style={{ fontSize: 34, ...chipPop(payP) }}>HOLDS</span></div>
      <div className="ex" style={{ left: 1360 }}><span className="chip green" style={{ fontSize: 34, ...chipPop(exP) }}>+10%</span></div>
      <div className="src">DexScreener pair data · project tracker GLD price · read Oct 1, 2026</div>
    </Frame>
  );
};

// ── C3 fees counter (CH4 238.66-248.14) ─────────────────────────────────────────────────────────────
export const C3Fees: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.round(236 * prog(t, 241.3, 1.2));                 // "236 GLD"
  const arrow = prog(t, 245.22, 8 / FPS, easeInOut);               // "90,000": arrow draws
  const c1 = prog(t, 245.22, 10 / FPS);                            // $90K card slides in from the right
  const c2 = prog(t, 245.22 + 10 / FPS, 10 / FPS);                 // oz card follows 10f later
  const LEN = 90;
  return (
    <Frame orbs="gold2">
      <div className="hdr"><div className="ey">PER THE PROJECT&#8217;S OWN TRACKER</div><h1>Trading Fees, Paid in <span className="gd">Gold</span></h1><div className="divider" /></div>
      <div className="hero"><div className="lab">Fees earned in GLD, since launch</div><div className="ab">about</div><div className="num">{n}<span>GLD</span></div></div>
      <svg className="lay" style={{ opacity: arrow > 0 ? 1 : 0 }}>
        <defs><marker id="gkc3-ag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ffd700" /></marker></defs>
        <line x1="1052" y1="610" x2="1142" y2="610" stroke="#ffd700" strokeWidth="4" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - arrow)} markerEnd={arrow >= 1 ? 'url(#gkc3-ag)' : undefined} />
      </svg>
      <div className="conv" style={{ top: 330, borderColor: 'rgba(255,215,0,.45)', opacity: c1, transform: `translateX(${30 * (1 - c1)}px)` }}><div className="ab">about</div><div className="v">$90K</div><div className="l">in tokenized gold</div></div>
      <div className="conv" style={{ top: 640, opacity: c2, transform: `translateX(${30 * (1 - c2)}px)` }}><div className="ab">about</div><div className="v gd">21.66 oz</div><div className="l">of gold, equivalent</div></div>
      <div className="src">goldenkitty.vip tracker (self-reported), stamp Oct 1, 2026 · fees earned only</div>
    </Frame>
  );
};

// ── C19a / C19b stat cards (CH6) ────────────────────────────────────────────────────────────────────
const StatPair: React.FC<{ ey: string; h1: React.ReactNode; v1: string; l1: string; card2On: number; v2: string; l2: string; src: string }> = ({ ey, h1, v1, l1, card2On, v2, l2, src }) => (
  <Frame orbs="lime">
    <div className="hdr"><div className="ey">{ey}</div><h1>{h1}</h1><div className="divider" /></div>
    <div className="stat on" style={{ left: 140 }}><div className="acc" /><div className="v">{v1}</div><div className="l">{l1}</div></div>
    <div className={`stat${card2On >= 1 ? ' on' : ''}`} style={{ left: 990, opacity: 0.16 + 0.84 * card2On }}><div className="acc" /><div className="v">{v2}</div><div className="l">{l2}</div></div>
    <div className="src">{src}</div>
  </Frame>
);
export const C19a: React.FC<{ t: number }> = ({ t }) => {
  const a = prog(t, 387.62, 0.9);                                  // "billion dollars locked": $0 -> $1B+ in 0.1B steps
  const lift = fadeF(t, 390.22, 8);                                // "90 billion": card 2 lifts
  const b = prog(t, 390.22, 1.1);
  const v1 = a <= 0 ? '$0' : a >= 1 ? '$1B+' : `$${(Math.floor(a * 10) / 10).toFixed(1)}B`;
  const v2 = b >= 1 ? '$90B+' : Math.floor(90 * b) < 1 ? '$0' : `$${Math.floor(90 * b)}B`;
  return <StatPair ey="ROBINHOOD CHAIN" h1={<>Three Months <span className="lm">In</span></>} v1={v1} l1="locked in its apps (TVL)" card2On={lift} v2={v2} l2="total DEX volume, 3 months" src="DefiLlama, read Oct 1, 2026 · DEX volume = daily chain chart summed since Jun 30, 2026" />;
};
export const C19b: React.FC<{ t: number }> = ({ t }) => {
  const a = prog(t, 395.04, 1.0);                                  // "28.4 million"
  const lift = fadeF(t, 398.06, 8);                                // "369 billion"
  const b = prog(t, 398.06, 1.0);
  const v1 = a <= 0 ? '0' : `${(28.4 * a).toFixed(1)}M`;
  const v2 = b <= 0 ? '$0' : `$${Math.round(369 * b)}B`;
  return <StatPair ey="ROBINHOOD, THE APP" h1={<>The <span className="lm">Distribution</span></>} v1={v1} l1="funded customers" card2On={lift} v2={v2} l2="in platform assets" src="Robinhood, Q2 2026" />;
};

// ── app-users-share (CH6 401.70-407.53) ─────────────────────────────────────────────────────────────
export const AppUsersShare: React.FC<{ t: number }> = ({ t }) => {
  const s = prog(t, 402.6, 0.5);                                   // solid sliver 0 -> 16px (1%, to scale)
  const h = prog(t, 403.32, 0.5);                                  // hatched 16 -> 33px (1% -> 2%)
  const call = prog(t, 403.32 + 0.5, 10 / FPS);                    // then tick + '1-2%' callout fade up
  return (
    <Frame orbs="lime">
      <div className="hdr"><div className="ey">ONE ESTIMATE</div><h1>App Users Have <span className="lm">Barely Arrived</span></h1><div className="divider" /></div>
      <div className="blab">Robinhood Chain transactions</div>
      <div className="btrack"><div className="bsol" style={{ width: 16 * s }} /><div className="bhat" style={{ left: 16, width: 17 * h }} /></div>
      <svg className="lay" style={{ opacity: call }}><line x1="157" y1="646" x2="157" y2="690" stroke="#ccff00" strokeWidth="3" /></svg>
      <div className="callout" style={{ opacity: call, transform: `translateY(${16 * (1 - call)}px)` }}><div className="big">1-2%</div><div className="l">from Robinhood app users</div></div>
      <div className="src">ETHNews, citing one estimate · read Oct 1, 2026</div>
    </Frame>
  );
};
