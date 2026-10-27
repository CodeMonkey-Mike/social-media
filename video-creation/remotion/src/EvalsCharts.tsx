// EvalsCharts.tsx — the evals video's four Type 1 ANIMATED charts, built for real in code (comp-build.md §7,
// charts.md): each one reproduces its design-spec state stills in assets/charts/<id>-<state>.png (geometry and
// styling ported 1:1 from assets/charts/<id>.html, the locked container stylesheet) and ANIMATES between them on the
// narration's word times (COVER-PLAN cover_beats / EDIT-PLAN [CHART] rows). Values are ILLUSTRATIVE (labelled on screen).
// Every component is a PURE function of `lf` (frames since the cover row's tIn), so the comp can mount it under any
// Sequence / engine nesting (comp-build §6a absolute-clock rule).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

const FPS = 30;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.inOut(Easing.cubic);
/** 0 -> 1 over `d` seconds starting at source time `t0`. */
const on = (t: number, t0: number, d = 0.3) => interpolate(t, [t0, t0 + d], [0, 1], { ...clamp, easing: ease });
/** piecewise-linear lookup over [t, v] keys (eased per segment) */
const keys = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) return interpolate(t, [k[i - 1][0], k[i][0]], [k[i - 1][1], k[i][1]], { ...clamp, easing: ease });
  }
  return k[k.length - 1][1];
};

// ---- the locked longform-edited container stylesheet (assets/charts/*.html), scoped under .evc ----
const CSS = `
.evc{--bg-deep:#0a0c10;--bg-card:#12151c;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;--accent-red:#ff4060;
 --text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330;
 width:1920px;height:1080px;background:var(--bg-deep);position:relative;overflow:hidden;font-family:'DM Sans',sans-serif;color:var(--text-primary)}
.evc *{margin:0;padding:0;box-sizing:border-box}
.evc .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.30;pointer-events:none;z-index:0}
.evc .hdr{position:absolute;left:120px;top:60px;z-index:2;max-width:1680px}
.evc .ey{font-family:'DM Sans';font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:14px}
.evc h1{font-family:'Playfair Display',serif;font-weight:900;font-size:60px;line-height:1.08;letter-spacing:-.02em;color:var(--text-primary);max-width:1680px}
.evc .divider{width:66px;height:4px;border-radius:2px;margin:22px 0 0;background:linear-gradient(90deg,var(--lit),rgba(var(--lit-rgb),.22))}
.evc .lit{color:var(--lit)}
.evc .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.evc h1 .mono{letter-spacing:-.02em;font-size:.86em}
.evc .src{position:absolute;left:120px;bottom:30px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:18px;color:var(--text-muted);z-index:2;letter-spacing:.01em}
.evc .txt{position:absolute;z-index:2;font-family:'DM Sans';color:var(--text-secondary);font-size:24px;line-height:1.35}
.evc .ax{font-family:'JetBrains Mono';font-weight:600;font-size:22px;color:var(--text-muted)}
.evc .axl{font-size:20px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:var(--text-muted)}
.evc .pill{position:absolute;z-index:3;padding:7px 18px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:19px;letter-spacing:.12em;
 text-transform:uppercase;border:1.5px solid rgba(var(--lit-rgb),.55);background:rgba(var(--lit-rgb),.12);color:var(--lit);white-space:nowrap}
.evc .pill.st{position:static}
.evc .pill.ill{border:1.5px dashed rgba(136,146,164,.55);background:transparent;color:var(--text-secondary)}
.evc .pill.red{border-color:rgba(255,64,96,.6);background:rgba(255,64,96,.12);color:var(--accent-red)}
.evc .pill.grn{border-color:rgba(0,230,138,.6);background:rgba(0,230,138,.12);color:var(--accent-green)}
.evc .panel{position:absolute;z-index:1}
.evc .wire{position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:1;overflow:visible;pointer-events:none}
.evc .plabel{position:absolute;z-index:2;font-family:'DM Sans';font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.evc .plabel.on{color:var(--lit)}
.evc .node{position:absolute;z-index:2;background:var(--bg-card);border:2px solid var(--border);border-radius:16px;display:flex;flex-direction:column;
 justify-content:center;align-items:flex-start;text-align:left;padding:22px 30px}
.evc .node.on{border-color:var(--lit);background:linear-gradient(180deg,rgba(var(--lit-rgb),.15),rgba(var(--lit-rgb),.04)),var(--bg-card);
 box-shadow:0 0 0 1px rgba(var(--lit-rgb),.25),0 0 48px rgba(var(--lit-rgb),.22)}
.evc .cell{position:absolute;z-index:2;border:2px solid var(--border);background:var(--bg-card);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.evc .cell .t{font-family:'DM Sans';font-weight:700;font-size:30px;color:var(--text-primary)}
.evc .cell .s{font-family:'JetBrains Mono';font-weight:600;font-size:18px;color:var(--text-muted);margin-top:6px;letter-spacing:.04em}
.evc .cell.fill{background:linear-gradient(180deg,rgba(var(--lit-rgb),.42),rgba(var(--lit-rgb),.26));border-color:var(--lit);box-shadow:0 0 50px rgba(var(--lit-rgb),.3)}
.evc .cell.fill .t{color:#fff}.evc .cell.fill .s{color:rgba(255,255,255,.75)}
.evc .cell.ring{border-color:var(--lit);border-style:dashed}
.evc .ecard{position:absolute;z-index:2;background:var(--bg-card);border:2px solid var(--border);border-radius:18px;padding:22px 28px}
.evc .ecard .lb{display:flex;align-items:center;gap:14px;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.evc .ecard .lb .v{font-family:'JetBrains Mono',monospace;font-weight:600;letter-spacing:0;text-transform:none;font-size:20px;padding:3px 10px;border-radius:8px;border:1.5px solid #2a3142;color:var(--text-secondary)}
.evc .ecard .tx{font-family:'DM Sans';font-weight:500;font-size:29px;line-height:1.3;color:var(--text-primary);margin-top:12px}
.evc .ecard .df{font-family:'JetBrains Mono',monospace;font-weight:400;font-size:20px;line-height:1.55;margin-top:12px;white-space:pre}
.evc .ecard.on{border-color:var(--lit);background:linear-gradient(180deg,rgba(var(--lit-rgb),.13),rgba(var(--lit-rgb),.03)),var(--bg-card);
 box-shadow:0 0 0 1px rgba(var(--lit-rgb),.25),0 0 48px rgba(var(--lit-rgb),.18)}
.evc .ecard.on .lb{color:var(--lit)} .evc .ecard.on .lb .v{border-color:rgba(var(--lit-rgb),.6);color:var(--lit)}
.evc .ecard.done{border-color:rgba(var(--lit-rgb),.40)}
.evc .mono,.evc .ax,.evc .src{font-variant-ligatures:none;font-feature-settings:"calt" 0,"liga" 0}
`;

const Frame: React.FC<{ lit: string; litRgb: string; orb: string; ey: string; title: React.ReactNode; src?: string; ill?: boolean; children: React.ReactNode }> =
  ({ lit, litRgb, orb, ey, title, src, ill = true, children }) => (
    <AbsoluteFill>
      <style>{CSS}</style>
      <div className="evc" style={{ ['--lit' as any]: lit, ['--lit-rgb' as any]: litRgb }}>
        <div className="orb" style={{ left: 1440, top: -320, width: 600, height: 600, background: orb }} />
        <div className="hdr"><div className="ey">{ey}</div><h1>{title}</h1><div className="divider" /></div>
        {ill && <div className="pill ill" style={{ left: 1592, top: 74 }}>ILLUSTRATIVE</div>}
        {children}
        {src && <div className="src">{src}</div>}
      </div>
    </AbsoluteFill>
  );

/** grid + y labels (0/50/100%) + x labels for the line charts (geometry from the spec html) */
const LineAxes: React.FC<{ x0: number; x1: number; ylab: number; xs: number[]; verLeft: number }> = ({ x0, x1, ylab, xs, verLeft }) => (
  <>
    <svg className="wire" viewBox="0 0 1920 1080" style={{ zIndex: 1 }}>
      {[742.5, 625, 507.5, 390].map((y) => <line key={y} x1={x0} y1={y} x2={x1} y2={y} stroke="#1e2330" strokeWidth={1.5} strokeDasharray="4 8" />)}
      <line x1={x0} y1={860} x2={x1} y2={860} stroke="#3a4357" strokeWidth={2.5} />
    </svg>
    {[['0%', 844], ['50%', 609], ['100%', 374]].map(([l, y]) => (
      <div key={l as string} className="txt ax" style={{ left: ylab, top: y as number, width: 110, textAlign: 'right' }}>{l}</div>
    ))}
    {xs.map((x, i) => <div key={i} className="txt ax" style={{ left: x - 50, top: 878, width: 100, textAlign: 'center' }}>v{i + 1}</div>)}
    <div className="txt axl" style={{ left: ylab, top: 326, width: 200 }}>score</div>
    <div className="txt axl" style={{ left: verLeft, top: 916, width: 200, textAlign: 'right' }}>version</div>
  </>
);

/** a polyline drawn up to `n` points (float: the last segment is partial), with dots, area fill and the glowing head */
const Line: React.FC<{ pts: [number, number][]; n: number; color: string; rgb: string; area?: boolean; w?: number; id: string }> =
  ({ pts, n, color, rgb, area = true, w = 6, id }) => {
    const k = Math.max(0, Math.min(pts.length - 1, n));
    const i = Math.floor(k);
    const fr = k - i;
    const shown: [number, number][] = pts.slice(0, i + 1);
    if (fr > 0 && i + 1 < pts.length) {
      const [ax, ay] = pts[i]; const [bx, by] = pts[i + 1];
      shown.push([ax + (bx - ax) * fr, ay + (by - ay) * fr]);
    }
    const d = shown.map(([x, y], j) => `${j ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const head = shown[shown.length - 1];
    return (
      <svg className="wire" viewBox="0 0 1920 1080" style={{ zIndex: 2 }}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`rgba(${rgb},.20)`} /><stop offset="1" stopColor={`rgba(${rgb},0)`} /></linearGradient></defs>
        {area && shown.length > 1 && <path d={`${d} L${head[0].toFixed(1)},860 L${shown[0][0]},860 Z`} fill={`url(#${id})`} />}
        {shown.length > 1 && <path d={d} style={{ fill: 'none', stroke: color, strokeWidth: w }} strokeLinecap="round" strokeLinejoin="round" />}
        {pts.slice(0, i + 1).map(([x, y], j) => (fr === 0 && j === i) ? null : <circle key={j} cx={x} cy={y} r={7} style={{ fill: '#0a0c10', stroke: color, strokeWidth: 4 }} />)}
        <circle cx={head[0]} cy={head[1]} r={26} style={{ fill: `rgba(${rgb},.22)` }} />
        <circle cx={head[0]} cy={head[1]} r={10} style={{ fill: color }} />
      </svg>
    );
  };

const Trophy: React.FC = () => (
  <svg viewBox="0 0 240 260" width={240} height={260} style={{ overflow: 'visible' }}>
    <path d="M60 20 H180 V80 C180 135 150 160 120 165 C90 160 60 135 60 80 Z" style={{ fill: 'rgba(136,146,164,.10)', stroke: '#8892a4', strokeWidth: 7, strokeLinejoin: 'round' }} />
    <path d="M60 40 H25 C25 85 40 105 66 112 M180 40 H215 C215 85 200 105 174 112" style={{ fill: 'none', stroke: '#8892a4', strokeWidth: 7, strokeLinecap: 'round' }} />
    <path d="M120 165 V205 M80 215 H160 V240 H80 Z" style={{ fill: 'rgba(136,146,164,.10)', stroke: '#8892a4', strokeWidth: 7, strokeLinejoin: 'round' }} />
    <line x1="12" y1="238" x2="228" y2="18" style={{ stroke: '#ff4060', strokeWidth: 12, strokeLinecap: 'round' }} />
  </svg>
);

const pop = (p: number) => ({ opacity: p, transform: `scale(${0.92 + 0.08 * p})` });

// ---------------------------------------------------------------------------------------------------------------
// chart-saturation (CH2 cyan, 198.38-206.14): line climbs, pins flat at 100% on '100%' @201.92 (spec mid = v1..v4,
// payoff = v1..v8); SATURATED + crossed-out trophy + 'nowhere left to climb' @203.54 (spec payoff).
const SAT_T0 = 198.38;
const SAT_PTS: [number, number][] = [[330, 681.4], [480, 601.5], [630, 526.3], [780, 455.8], [930, 404.1], [1080, 390], [1230, 390], [1380, 390]];
export const ChartSaturation: React.FC<{ lf: number }> = ({ lf }) => {
  const t = SAT_T0 + lf / FPS;
  const n = keys(t, [[198.8, 0], [200.4, 3], [201.92, 5], [202.7, 7]]);
  const pay = on(t, 203.54, 0.35);
  return (
    <Frame lit="#00c2ff" litRgb="0,194,255" orb="rgba(0,194,255,.55)" ey="EVAL SATURATION"
      title={<>An eval at <span className="lit mono">100%</span> is not a trophy</>}>
      <LineAxes x0={310} x1={1410} ylab={180} xs={[330, 480, 630, 780, 930, 1080, 1230, 1380]} verLeft={1310} />
      <Line pts={SAT_PTS} n={n} color="#00c2ff" rgb="0,194,255" id="evc-sat" />
      <div className="panel" style={{ left: 1046, top: 344, width: 368, height: 92, border: '2px dashed rgba(255,215,0,.75)', background: 'rgba(255,215,0,.06)', borderRadius: 46, opacity: pay }} />
      <div className="txt" style={{ left: 1046, top: 290, width: 368, textAlign: 'center', ...pop(pay) }}>
        <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26, letterSpacing: '.16em', color: '#ffd700' }}>SATURATED</span>
      </div>
      <div className="txt" style={{ left: 1500, top: 440, ...pop(on(t, 203.7, 0.35)) }}><Trophy /></div>
      <div className="txt" style={{ left: 1452, top: 726, width: 340, textAlign: 'center', fontSize: 27, color: '#e8eaf0', opacity: on(t, 203.9, 0.35) }}>nowhere left<br />to climb</div>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// C5 JUDGE CALIBRATION (CH3 purple, 381.62-404.14): the 2x2 draws @381.62; step chips @387.02 / @389.74; TP cell +
// TPR card @392.58 (spec mid); TN cell + TNR card @398.56 (spec payoff).
const C5_T0 = 381.62;
export const ChartC5: React.FC<{ lf: number }> = ({ lf }) => {
  const t = C5_T0 + lf / FPS;
  const grid = (i: number) => on(t, 381.75 + i * 0.12, 0.3);
  const tp = on(t, 392.58, 0.3);
  const tn = on(t, 398.56, 0.3);
  const cells = [
    { l: 430, tp: 420, r: '18px 0 0 0', t: 'caught', s: 'TRUE POSITIVE', fill: tp },
    { l: 730, tp: 420, r: '0 18px 0 0', t: 'missed', s: 'FALSE NEGATIVE', ring: tp },
    { l: 430, tp: 610, r: '0 0 0 18px', t: 'false alarm', s: 'FALSE POSITIVE', ring: tn },
    { l: 730, tp: 610, r: '0 0 18px 0', t: 'correctly passed', s: 'TRUE NEGATIVE', fill: tn },
  ];
  const card = (top: number, abbr: string, sub: string, quote: string, formula: string, p: number) => (
    <div className={`node${p > 0.5 ? ' on' : ''}`} style={{ left: 1120, top, width: 680, height: 236, ...pop(p) }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 44, color: 'var(--lit)' }}>{abbr}</span>
        <span style={{ fontSize: 22, color: 'var(--text-secondary)' }}>{sub}</span>
      </div>
      <div style={{ fontSize: 25, lineHeight: 1.4, color: 'var(--text-primary)', marginTop: 12 }}>{quote}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 19, color: 'var(--text-secondary)', marginTop: 14 }}>{formula}</div>
    </div>
  );
  return (
    <Frame lit="#a78bfa" litRgb="167,139,250" orb="rgba(167,139,250,.55)" ey="JUDGE CALIBRATION" ill={false}
      title={<>Measure the <span className="lit">judge</span> before you trust it</>}
      src={'TPR and TNR definitions: Hamel Husain and Shreya Shankar, “AI Evals: Everything You Need to Know” (2026)'}>
      <div className={`plabel${tp > 0.5 ? ' on' : ''}`} style={{ left: 430, top: 296, width: 600, textAlign: 'center' }}>THE JUDGE SAYS</div>
      <div className="txt" style={{ left: 430, top: 340, width: 300, textAlign: 'center' }}><span className="pill red st">FAIL</span></div>
      <div className="txt" style={{ left: 730, top: 340, width: 300, textAlign: 'center' }}><span className="pill grn st">PASS</span></div>
      <div className={`plabel${tp > 0.5 ? ' on' : ''}`} style={{ left: -40, top: 594, width: 380, textAlign: 'center', transform: 'rotate(-90deg)', transformOrigin: 'center' }}>THE HUMAN SAYS</div>
      <div className="txt" style={{ left: 250, top: 493, width: 150, textAlign: 'center' }}><span className="pill red st">FAIL</span></div>
      <div className="txt" style={{ left: 250, top: 683, width: 150, textAlign: 'center' }}><span className="pill grn st">PASS</span></div>
      {cells.map((c, i) => {
        const g = grid(i);
        const cls = `cell${(c.fill ?? 0) > 0.5 ? ' fill' : ''}${(c.ring ?? 0) > 0.5 ? ' ring' : ''}`;
        return (
          <div key={i} className={cls} style={{ left: c.l, top: c.tp, width: 300, height: 190, borderRadius: c.r, opacity: g, transform: `scale(${0.9 + 0.1 * g})` }}>
            <div className="t">{c.t}</div><div className="s">{c.s}</div>
          </div>
        );
      })}
      <div className="txt" style={{ left: 120, top: 838, ...pop(on(t, 387.02)) }}><span className="pill st">1 &middot; label the set yourself</span></div>
      <div className="txt" style={{ left: 540, top: 838, ...pop(on(t, 389.74)) }}><span className="pill st">2 &middot; run the judge on the same set</span></div>
      {card(340, 'TPR', 'true positive rate · also called recall', '“measures how many actual failures the evaluator catches.”', 'caught ÷ (caught + missed)', tp)}
      {card(600, 'TNR', 'true negative rate', '“measures how many good outputs the evaluator correctly passes.”', 'correctly passed ÷ (correctly passed + false alarm)', tn)}
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// chart-two-suites (CH5 green, 880.10-890.04): CAPABILITY line climbs @881.72 ('a hill you climb' @884.58, spec mid);
// REGRESSION line flat near 100% @885.68 (spec regression); 'the floor you never fall through' @888.52 (spec payoff).
const TS_T0 = 880.1;
const CAP_PTS: [number, number][] = [[330, 775.4], [480, 737.8], [630, 695.5], [780, 657.9], [930, 620.3], [1080, 582.7], [1230, 549.8], [1380, 521.6]];
const REG_PTS: [number, number][] = [[330, 399.4], [480, 394.7], [630, 399.4], [780, 394.7], [930, 394.7], [1080, 399.4], [1230, 394.7], [1380, 394.7]];
export const ChartTwoSuites: React.FC<{ lf: number }> = ({ lf }) => {
  const t = TS_T0 + lf / FPS;
  const nc = keys(t, [[881.72, 0], [884.2, 7]]);
  const nr = keys(t, [[885.68, 0], [887.1, 7]]);
  const floor = on(t, 888.52, 0.35);
  return (
    <Frame lit="#22c55e" litRgb="34,197,94" orb="rgba(34,197,94,.50)" ey="Two kinds of suite"
      title={<>A <span className="lit">hill</span> to climb, a <span className="lit">floor</span> to hold</>}
      src={'Capability and regression evals: Anthropic, “Demystifying evals for AI agents” (Jan 2026) · values illustrative'}>
      <LineAxes x0={310} x1={1410} ylab={180} xs={[330, 480, 630, 780, 930, 1080, 1230, 1380]} verLeft={1310} />
      <div className="panel" style={{ left: 310, top: 403.4, width: 1100, height: 26, borderRadius: 4, background: 'linear-gradient(180deg,rgba(232,234,240,.16),rgba(232,234,240,0))', opacity: floor }} />
      {t >= 885.68 && <Line pts={REG_PTS} n={nr} color="#e8eaf0" rgb="232,234,240" area={false} w={5} id="evc-reg" />}
      <Line pts={CAP_PTS} n={nc} color="#22c55e" rgb="34,197,94" id="evc-cap" />
      <div className="txt" style={{ left: 1440, top: 489.6, width: 380, lineHeight: 1.25, opacity: on(t, 882.6) }}>
        <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: '.14em', color: 'var(--lit)' }}>CAPABILITY</span><br />
        <span style={{ fontSize: 25, color: 'var(--text-secondary)' }}>starts low, climbs</span>
      </div>
      <div className="txt" style={{ left: 1440, top: 362.7, width: 380, lineHeight: 1.25, opacity: on(t, 886.2) }}>
        <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: '.14em', color: 'var(--text-primary)' }}>REGRESSION</span><br />
        <span style={{ fontSize: 25, color: 'var(--text-secondary)' }}>stays near <span className="mono">100%</span></span>
      </div>
      <div className="txt" style={{ left: 640, top: 549.8, width: 420, fontSize: 30, fontWeight: 700, color: 'var(--lit)', ...pop(on(t, 884.58)) }}>a hill you climb</div>
      <div className="txt" style={{ left: 330, top: 437.4, width: 600, fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', ...pop(floor) }}>the floor you never fall through</div>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// chart-score-over-versions (CH6 gold, 995.62-1007.64): the score climbs one version per sentence: prompt @995.84,
// model @999.60, complaint @1002.16, payoff @1005.70 (spec prompt / model / complaint / payoff).
const SV_T0 = 995.62;
const SV_PTS: [number, number][] = [[330, 672], [488, 606.2], [646, 554.5], [804, 516.9], [962, 484], [1120, 460.5]];
export const ChartScoreOverVersions: React.FC<{ lf: number }> = ({ lf }) => {
  const t = SV_T0 + lf / FPS;
  const n = keys(t, [[995.84, 0], [996.5, 1], [999.6, 1], [1000.2, 2], [1002.16, 2], [1002.8, 3], [1005.7, 3], [1006.8, 5]]);
  const st = (a: number, b?: number) => (t >= a ? (b !== undefined && t >= b ? 'done' : 'on') : 'fut');
  const ecard = (top: number, h: number, v: string, lb: string, tx: string, state: string, extra?: React.ReactNode) => (
    <div className={`ecard ${state === 'fut' ? '' : state}`} style={{ left: 1250, top, width: 550, height: h, opacity: state === 'fut' ? 0.32 : 1 }}>
      <div className="lb"><span className="v">{v}</span>{lb}</div>
      <div className="tx">{tx}</div>
      {extra}
    </div>
  );
  const num = on(t, 995.84, 0.4);
  return (
    <Frame lit="#ffd700" litRgb="255,215,0" orb="rgba(255,215,0,.50)" ey="Once you measure"
      title={<>Every change gets a <span className="lit">number</span></>}
      src={'User-reported failures into test cases: Anthropic, “Demystifying evals for AI agents” (Jan 2026) · values illustrative'}>
      <LineAxes x0={300} x1={1150} ylab={170} xs={[330, 488, 646, 804, 962, 1120]} verLeft={1050} />
      <Line pts={SV_PTS} n={n} color="#ffd700" rgb="255,215,0" id="evc-sv" />
      <svg className="wire" viewBox="0 0 1920 1080" style={{ zIndex: 2, opacity: num }}>
        <line x1="330" y1="672" x2="532" y2="672" stroke="rgba(255,215,0,.55)" strokeWidth={2} strokeDasharray="6 7" />
        <path d="M522,672 h10 V606.2 h-10" style={{ fill: 'none', stroke: '#ffd700', strokeWidth: 3 }} strokeLinejoin="round" />
      </svg>
      <div className="txt" style={{ left: 548, top: 623.1, width: 220, fontSize: 24, fontWeight: 700, color: 'var(--lit)', opacity: num }}>the number</div>
      <div className="txt" style={{ left: 526, top: 484.5, width: 240, textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: '.06em', color: 'var(--text-primary)', ...pop(on(t, 999.6)) }}>model upgrade</div>
      <div className="txt" style={{ left: 684, top: 446.9, width: 240, textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: '.06em', color: 'var(--text-primary)', ...pop(on(t, 1002.16)) }}>new case</div>
      {ecard(244, 236, 'v2', 'a prompt change', 'stops being a vibe, becomes a diff with a number', st(995.84, 999.6),
        <div className="df"><span style={{ color: '#ff6b81' }}>- Be helpful and friendly.</span>{'\n'}<span style={{ color: 'var(--accent-green)' }}>+ Answer only from the docs.</span></div>)}
      {ecard(500, 168, 'v3', 'a model upgrade', 'stops being a leap of faith', st(999.6, 1002.16))}
      {ecard(688, 206, 'v4', 'a user complaint', 'becomes a new case in the dataset', st(1002.16),
        <div className="tx" style={{ color: 'var(--lit)', fontWeight: 700, marginTop: 8, opacity: on(t, 1005.7) }}>and never surprises you twice</div>)}
    </Frame>
  );
};
