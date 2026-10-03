// GoldenKittyVerticalCharts.tsx: the six Type 1 ANIMATED charts of golden-kitty, re-laid for PORTRAIT (1080x1920).
// Each is a REAL useCurrentFrame-driven build (the comp passes the SOURCE-spine time `t`) of its vertical spec:
// assets/vertical/charts/<id>.vertical.spec.md + <id>.html (geometry), with <id>-{start,mid,payoff}.png as the spec stills.
// Content, copy, numbers, cue times and easing are byte-identical to the 16:9 charts (GoldenKittyCharts.tsx); only the
// GEOMETRY changes (vertical-repurpose.md §1: animated charts are re-laid out in code, never letterboxed).
// Every value is the DATA.md recording-day value (read Oct 1, 2026; PROJECT-LOG Open flags: never a live re-pull, never "15x").
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

// locked stylesheet (same tokens as the 16:9) + the VERTICAL 1080x1920 overrides from the chart HTML sources
const CSS = `
.gkv{--bg-deep:#0a0c10;--bg-card:#12151c;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;
  --accent-red:#ff4060;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330;
  --lime:#ccff00;--gold:#ffd700}
.gkv *{margin:0;padding:0;box-sizing:border-box}
.gkv .frame{width:1080px;height:1920px;background:var(--bg-deep);position:absolute;left:0;top:0;overflow:hidden;
  display:block;color:var(--text-primary);font-family:'DM Sans',sans-serif}
.gkv .frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:50;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.gkv .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.26;pointer-events:none;z-index:0}
.gkv .frame>*:not(.orb){z-index:1}
.gkv .ey{font-family:'DM Sans';font-size:28px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:18px}
.gkv h1{font-family:'Playfair Display',serif;font-weight:900;font-size:92px;line-height:1.04;letter-spacing:-.02em;color:var(--text-primary)}
.gkv .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));margin:26px 0 0}
.gkv .lm{color:var(--lime)} .gkv .gd{color:var(--gold)}
.gkv .hdr{position:absolute;left:90px;top:170px;width:900px}
.gkv .src{position:absolute;left:90px;right:90px;bottom:210px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:22px;line-height:1.55;color:var(--text-muted)}
.gkv svg.lay{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible}
.gkv .chip{display:inline-block;padding:8px 20px;border-radius:100px;font-family:'JetBrains Mono';font-weight:600;
  font-size:26px;border:2px solid var(--border);color:var(--text-primary);background:rgba(255,255,255,.03)}
.gkv .chip.green{color:var(--accent-green);border-color:rgba(0,230,138,.5);background:rgba(0,230,138,.09)}
/* cap-vs-volume: two columns rising from one baseline (y 1290) */
.gkv .col{position:absolute;top:530px;width:300px;height:760px;border-radius:12px;background:#141823;border:1px solid var(--border);overflow:hidden}
.gkv .col .fill{position:absolute;left:0;right:0;bottom:0;border-radius:10px}
.gkv .cv{position:absolute;top:1322px;width:450px;text-align:center;font-family:'JetBrains Mono';font-weight:600;font-size:112px;line-height:1}
.gkv .cl{position:absolute;top:1462px;width:450px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:28px;line-height:1.3;letter-spacing:.12em;text-transform:uppercase}
/* C2: three terms stack top to bottom, chips inside each card on the right */
.gkv .term{position:absolute;left:90px;width:900px;height:250px;border-radius:22px;border:2px solid var(--border);background:var(--bg-card);padding:34px 40px}
.gkv .term .lab{font-family:'DM Sans';font-weight:700;font-size:27px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-secondary)}
.gkv .term .v{font-family:'JetBrains Mono';font-weight:600;font-size:84px;line-height:1;margin-top:26px;white-space:pre}
.gkv .term .u{font-family:'DM Sans';font-size:26px;color:var(--text-secondary);margin-top:14px}
.gkv .term .ex{position:absolute;right:40px;top:50%;transform:translateY(-50%)}
.gkv .op{position:absolute;left:90px;width:900px;text-align:center;font-family:'JetBrains Mono';font-weight:400;font-size:96px;line-height:1;color:var(--text-muted)}
.gkv .exlab{position:absolute;left:90px;top:1512px;font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.18em;color:var(--text-muted)}
/* C3: hero on top, arrow DOWN, conversions stacked below */
.gkv .hero{position:absolute;left:90px;top:520px;width:900px;height:480px;border-radius:24px;border:2px solid rgba(255,215,0,.6);
  background:linear-gradient(160deg,rgba(255,215,0,.07),rgba(18,21,28,1) 60%);box-shadow:0 0 90px rgba(255,215,0,.12);padding:46px 52px}
.gkv .hero .lab{font-family:'DM Sans';font-weight:700;font-size:30px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}
.gkv .hero .ab{font-family:'DM Sans';font-weight:600;font-size:30px;color:var(--text-secondary);margin-top:34px}
.gkv .hero .num{font-family:'JetBrains Mono';font-weight:600;font-size:250px;line-height:1;color:var(--gold);display:flex;align-items:baseline;gap:26px}
.gkv .hero .num span{font-size:72px}
.gkv .conv{position:absolute;left:90px;width:900px;height:220px;border-radius:22px;border:2px solid var(--border);background:var(--bg-card);padding:30px 44px}
.gkv .conv .ab{font-family:'DM Sans';font-weight:600;font-size:26px;color:var(--text-secondary)}
.gkv .conv .v{font-family:'JetBrains Mono';font-weight:600;font-size:96px;line-height:1.05;color:var(--text-primary);margin-top:4px}
.gkv .conv .l{position:absolute;right:44px;bottom:42px;font-family:'DM Sans';font-size:28px;color:var(--text-secondary);text-align:right}
/* C19a / C19b: stat cards STACK (900 x 440, tops 520 / 1010) */
.gkv .stat{position:absolute;left:90px;width:900px;height:440px;border-radius:24px;border:2px solid var(--border);background:var(--bg-card);padding:52px 58px;overflow:hidden}
.gkv .stat .acc{position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,var(--lime),transparent)}
.gkv .stat .v{font-family:'JetBrains Mono';font-weight:600;font-size:190px;line-height:1;color:var(--lime);margin-top:26px}
.gkv .stat .l{font-family:'DM Sans';font-weight:700;font-size:36px;letter-spacing:.10em;text-transform:uppercase;color:var(--text-primary);line-height:1.35;margin-top:40px}
.gkv .stat.on{border-color:rgba(204,255,0,.55);box-shadow:0 0 80px rgba(204,255,0,.10)}
/* app-users-share: tall column (300 x 960, top 560), 1% = 10px, 2% = 19px, to scale */
.gkv .vlab{position:absolute;left:450px;top:560px;width:540px;font-family:'DM Sans';font-weight:700;font-size:32px;line-height:1.3;letter-spacing:.12em;text-transform:uppercase;color:var(--text-primary)}
.gkv .vtrack{position:absolute;left:90px;top:560px;width:300px;height:960px;border-radius:14px;background:#141823;border:1px solid var(--border);overflow:hidden}
.gkv .vsol{position:absolute;left:0;right:0;bottom:0;background:var(--lime);box-shadow:0 0 30px rgba(204,255,0,.8)}
.gkv .vhat{position:absolute;left:0;right:0;background:repeating-linear-gradient(135deg,rgba(204,255,0,.85) 0 4px,rgba(204,255,0,.15) 4px 9px)}
.gkv .callout{position:absolute;left:470px;top:1300px;width:520px;display:flex;flex-direction:column-reverse}
.gkv .callout .big{font-family:'JetBrains Mono';font-weight:600;font-size:150px;line-height:1;color:var(--lime)}
.gkv .callout .l{font-family:'DM Sans';font-weight:700;font-size:34px;line-height:1.3;letter-spacing:.10em;text-transform:uppercase;color:var(--text-primary);margin-bottom:18px}
`;

const FPS = 30;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
/** progress 0..1 of a move that starts at source time a and lasts d seconds */
const prog = (t: number, a: number, d: number, ease = easeOut) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: ease });
/** 0..1 over n frames from source time a */
const fadeF = (t: number, a: number, nFrames: number) => interpolate(t, [a, a + nFrames / FPS], [0, 1], clamp);

// shared portrait frame: orb 1 left 560 / top -280 / 760, orb 2 left -340 / top 1300 / 700
const ORBS = { gold: ['#b89400', '#6d8a00'], gold2: ['#b89400', '#7a6200'], lime: ['#6d8a00', '#3d4a10'] } as const;
const Frame: React.FC<{ orbs: keyof typeof ORBS; children: React.ReactNode }> = ({ orbs, children }) => (
  <AbsoluteFill className="gkv">
    <style>{CSS}</style>
    <div className="frame">
      <div className="orb" style={{ left: 560, top: -280, width: 760, height: 760, background: ORBS[orbs][0] }} />
      <div className="orb" style={{ left: -340, top: 1300, width: 700, height: 700, background: ORBS[orbs][1] }} />
      {children}
    </div>
  </AbsoluteFill>
);

// ── cap-vs-volume (CH3 162.48-167.43): two columns from one baseline ─────────────────────────────────
export const VCapVsVolume: React.FC<{ t: number }> = ({ t }) => {
  const g = prog(t, 162.48, 0.92);                       // $0 -> $4.2M, gold sliver 0 -> 6px (= mid)
  const v = prog(t, 165.12, 1.1, easeInOut);             // "90 billion": $0 -> $90B+, lime column races 0 -> 760px (= payoff)
  const gVal = g <= 0 ? '$0' : `$${(4.2 * g).toFixed(1)}M`;
  const vVal = v >= 1 ? '$90B+' : Math.floor(90 * v) < 1 ? '$0' : `$${Math.floor(90 * v)}B`;
  return (
    <Frame orbs="gold">
      <div className="hdr"><div className="ey">THE SIZE GAP</div><h1>A <span className="gd">Small Cap</span> on a <span className="lm">Busy Chain</span></h1><div className="divider" /></div>
      <div className="col" style={{ left: 165 }}><div className="fill" style={{ height: 6 * g, background: 'var(--gold)', boxShadow: '0 0 22px rgba(255,215,0,.9)' }} /></div>
      <div className="col" style={{ left: 615 }}><div className="fill" style={{ height: 760 * v, background: 'linear-gradient(0deg,rgba(204,255,0,.35),var(--lime))', boxShadow: '0 0 34px rgba(204,255,0,.45)' }} /></div>
      <div className="cv gd" style={{ left: 90 }}>{gVal}</div><div className="cv lm" style={{ left: 540 }}>{vVal}</div>
      <div className="cl gd" style={{ left: 90 }}>GOLDEN<br />market cap</div><div className="cl lm" style={{ left: 540 }}>Robinhood Chain DEX volume, all time</div>
      <div className="src">Market cap: DexScreener · DEX volume: DefiLlama daily chain chart, summed · read Oct 1, 2026</div>
    </Frame>
  );
};

// ── C2 price formula (CH4 219.45-230.86): the formula reads top to bottom ────────────────────────────
const GREEN_BORDER = { borderColor: 'rgba(0,230,138,.75)', boxShadow: '0 0 0 6px rgba(0,230,138,.10),0 0 90px rgba(0,230,138,.25)' };
const countStr = (target: number, decimals: number, p: number, prefix = '') => (p <= 0 ? ' ' : `${prefix}${(target * p).toFixed(decimals)}`);
export const VC2Formula: React.FC<{ t: number }> = ({ t }) => {
  const v1 = prog(t, 219.7, 0.6);                                  // term 1 counts in on "dollar"
  const in2 = prog(t, 220.94, 8 / FPS), v2 = prog(t, 220.94, 0.6); // '=' + term 2 on "price in gold"
  const in3 = prog(t, 222.74, 8 / FPS), v3 = prog(t, 222.74, 0.6); // 'x' + term 3 on "price of gold"
  const ex = t >= 227.18;                                          // example-gold: the BOTTOM (gold) card lights first
  const exP = prog(t, 227.18, 8 / FPS);
  const pay = t >= 229.64;                                         // payoff: the TOP card answers it
  const payP = prog(t, 229.64, 8 / FPS);
  const chipPop = (p: number) => ({ opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'right center', display: 'inline-block' });
  const up = (p: number) => ({ opacity: p, transform: `translateY(${20 * (1 - p)}px)` });
  return (
    <Frame orbs="gold">
      <div className="hdr"><div className="ey">THE PRICE MATH</div><h1>Priced in <span className="gd">Gold</span></h1><div className="divider" /></div>
      <div className="term" style={{ top: 500, ...(pay ? GREEN_BORDER : { borderColor: 'rgba(232,234,240,.38)' }) }}>
        <div className="lab">GOLDEN in dollars</div>
        <div className="v" style={{ color: 'var(--text-primary)' }}>{countStr(0.004234, 6, v1, '$')}</div>
        <div className="u" style={{ opacity: v1 > 0 ? 1 : 0 }}>per GOLDEN</div>
        <div className="ex"><span className="chip green" style={{ fontSize: 34, ...chipPop(payP) }}>+10%</span></div>
      </div>
      <div className="term" style={{ top: 862, borderColor: 'rgba(255,215,0,.6)', ...up(in2) }}>
        <div className="lab">GOLDEN in gold</div>
        <div className="v" style={{ color: 'var(--gold)' }}>{countStr(0.00001109, 8, v2)}</div>
        <div className="u">GLD per GOLDEN</div>
        <div className="ex"><span className="chip" style={{ fontSize: 34, ...chipPop(payP) }}>HOLDS</span></div>
      </div>
      <div className="term" style={{ top: 1224, ...(ex ? GREEN_BORDER : { borderColor: 'rgba(255,215,0,.6)' }), ...up(in3) }}>
        <div className="lab">Gold in dollars</div>
        <div className="v" style={{ color: 'var(--gold)' }}>{countStr(381.79, 2, v3, '$')}</div>
        <div className="u">per GLD</div>
        <div className="ex"><span className="chip green" style={{ fontSize: 34, ...chipPop(exP) }}>+10%</span></div>
      </div>
      <div className="op" style={{ top: 755, ...up(in2) }}>=</div>
      <div className="op" style={{ top: 1117, ...up(in3) }}>&times;</div>
      <div className="exlab" style={{ opacity: exP }}>EXAMPLE, NOT A FORECAST</div>
      <div className="src">DexScreener pair data · project tracker GLD price · read Oct 1, 2026</div>
    </Frame>
  );
};

// ── C3 fees counter (CH4 238.66-248.14): hero on top, arrow DOWN, conversions below ─────────────────
export const VC3Fees: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.round(236 * prog(t, 241.3, 1.2));                 // "236 GLD"
  const arrow = prog(t, 245.22, 8 / FPS, easeInOut);               // "90,000": the arrow draws downward
  const c1 = prog(t, 245.22, 10 / FPS);                            // $90K card slides UP 30px into place
  const c2 = prog(t, 245.22 + 10 / FPS, 10 / FPS);                 // oz card follows 10f later
  const LEN = 72;
  return (
    <Frame orbs="gold2">
      <div className="hdr"><div className="ey">PER THE PROJECT&#8217;S OWN TRACKER</div><h1>Trading Fees, Paid in <span className="gd">Gold</span></h1><div className="divider" /></div>
      <div className="hero"><div className="lab">Fees earned in GLD, since launch</div><div className="ab">about</div><div className="num">{n}<span>GLD</span></div></div>
      <svg className="lay" style={{ opacity: arrow > 0 ? 1 : 0 }}>
        <defs><marker id="gkv3-ag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ffd700" /></marker></defs>
        <line x1="540" y1="1014" x2="540" y2="1086" stroke="#ffd700" strokeWidth="4" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - arrow)} markerEnd={arrow >= 1 ? 'url(#gkv3-ag)' : undefined} />
      </svg>
      <div className="conv" style={{ top: 1100, borderColor: 'rgba(255,215,0,.45)', opacity: c1, transform: `translateY(${30 * (1 - c1)}px)` }}><div className="ab">about</div><div className="v">$90K</div><div className="l">in tokenized gold</div></div>
      <div className="conv" style={{ top: 1350, opacity: c2, transform: `translateY(${30 * (1 - c2)}px)` }}><div className="ab">about</div><div className="v gd">21.66 oz</div><div className="l">of gold, equivalent</div></div>
      <div className="src">goldenkitty.vip tracker (self-reported), stamp Oct 1, 2026 · fees earned only</div>
    </Frame>
  );
};

// ── C19a / C19b stacked stat cards (CH6) ─────────────────────────────────────────────────────────────
const StatPair: React.FC<{ ey: string; h1: React.ReactNode; v1: string; l1: string; card2On: number; v2: string; l2: string; src: string }> = ({ ey, h1, v1, l1, card2On, v2, l2, src }) => (
  <Frame orbs="lime">
    <div className="hdr"><div className="ey">{ey}</div><h1>{h1}</h1><div className="divider" /></div>
    <div className="stat on" style={{ top: 520 }}><div className="acc" /><div className="v">{v1}</div><div className="l">{l1}</div></div>
    <div className={`stat${card2On >= 1 ? ' on' : ''}`} style={{ top: 1010, opacity: 0.16 + 0.84 * card2On }}><div className="acc" /><div className="v">{v2}</div><div className="l">{l2}</div></div>
    <div className="src">{src}</div>
  </Frame>
);
export const VC19a: React.FC<{ t: number }> = ({ t }) => {
  const a = prog(t, 387.62, 0.9);                                  // "billion dollars locked": $0 -> $1B+ in 0.1B steps
  const lift = fadeF(t, 390.22, 8);                                // "90 billion": card 2 lifts
  const b = prog(t, 390.22, 1.1);
  const v1 = a <= 0 ? '$0' : a >= 1 ? '$1B+' : `$${(Math.floor(a * 10) / 10).toFixed(1)}B`;
  const v2 = b >= 1 ? '$90B+' : Math.floor(90 * b) < 1 ? '$0' : `$${Math.floor(90 * b)}B`;
  return <StatPair ey="ROBINHOOD CHAIN" h1={<>Three Months <span className="lm">In</span></>} v1={v1} l1="locked in its apps (TVL)" card2On={lift} v2={v2} l2="total DEX volume, 3 months" src="DefiLlama, read Oct 1, 2026 · DEX volume = daily chain chart summed since Jun 30, 2026" />;
};
export const VC19b: React.FC<{ t: number }> = ({ t }) => {
  const a = prog(t, 395.04, 1.0);                                  // "28.4 million"
  const lift = fadeF(t, 398.06, 8);                                // "369 billion"
  const b = prog(t, 398.06, 1.0);
  const v1 = a <= 0 ? '0' : `${(28.4 * a).toFixed(1)}M`;
  const v2 = b <= 0 ? '$0' : `$${Math.round(369 * b)}B`;
  return <StatPair ey="ROBINHOOD, THE APP" h1={<>The <span className="lm">Distribution</span></>} v1={v1} l1="funded customers" card2On={lift} v2={v2} l2="in platform assets" src="Robinhood, Q2 2026" />;
};

// ── app-users-share (CH6 401.70-407.53): the track becomes a tall column filling from the bottom ──────
export const VAppUsersShare: React.FC<{ t: number }> = ({ t }) => {
  const s = prog(t, 402.6, 0.5);                                   // solid sliver 0 -> 10px (1%, to scale)
  const h = prog(t, 403.32, 0.5);                                  // hatched 0 -> 9px on top (1% -> 2%)
  const call = prog(t, 403.32 + 0.5, 10 / FPS);                    // then tick + '1-2%' callout fade up
  return (
    <Frame orbs="lime">
      <div className="hdr"><div className="ey">ONE ESTIMATE</div><h1>App Users Have <span className="lm">Barely Arrived</span></h1><div className="divider" /></div>
      <div className="vlab">Robinhood Chain transactions</div>
      <div className="vtrack"><div className="vsol" style={{ height: 10 * s }} /><div className="vhat" style={{ bottom: 10, height: 9 * h }} /></div>
      <svg className="lay" style={{ opacity: call }}><line x1="398" y1="1510" x2="456" y2="1510" stroke="#ccff00" strokeWidth="3" /></svg>
      <div className="callout" style={{ opacity: call, transform: `translateY(${16 * (1 - call)}px)` }}><div className="big">1-2%</div><div className="l">from Robinhood app users</div></div>
      <div className="src">ETHNews, citing one estimate · read Oct 1, 2026</div>
    </Frame>
  );
};
