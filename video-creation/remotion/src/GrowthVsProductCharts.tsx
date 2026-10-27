// GrowthVsProductCharts.tsx: growth-vs-product's code-built visuals (comp-build.md section 7 + overlays.md section 2).
// - the two Type 1 ANIMATED charts, ported 1:1 from their HTML sources in media/growth-vs-product/assets/charts/
//   (split-test.html, pass-rate-meter.html: same absolute geometry, same stylesheet tokens), driven by the comp's
//   ABSOLUTE clock (comp-build 6a), never a PNG. Choreography = assets/charts/<id>.spec.md, cued to the words.
// - the 2023 kinetic-text devices (overlays.md section 2): kt-side-panel and the kt-keyword-pop motion, COPIED from the
//   reference implementation (kcc20's KtSidePanel / popMotion, never imported) and re-skinned for this video: house
//   display font (Playfair Display 900), role accents gold #ffd700 (GROWTH) / green #22c55e (PRODUCT), the CH2-CH4
//   teaching-block cyan #00c2ff on the panel edge.
// Every cue is a SOURCE-spine second (the comp publishes the source time through GvpClock).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] });
loadDMSans('italic', { weights: ['700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

/** The comp's absolute clock: `abs` = composition frame, `t` = SOURCE-spine seconds (held at `at` inside a spine pause). */
export const GvpClock = React.createContext<{ abs: number; t: number }>({ abs: 0, t: 0 });
export const useGvp = () => React.useContext(GvpClock);

export const ROLE = { a: '#ffd700', b: '#22c55e' };   // GROWTH gold, PRODUCT green (PROJECT-LOG 2026-10-22)
export const TEACH = '#00c2ff';                      // CH2-CH4 chapter accent (cyan teaching block)

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** eased 0..1 between two source times */
export const ramp = (t: number, a: number, b: number, ease: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });
const F30 = 1 / 30;

// ---------------------------------------------------------------------------------------------------------------------
// THE STYLESHEET: the canonical longform-edited container stylesheet + the chart layer, verbatim tokens from the two
// HTML sources, scoped under .gvp so nothing leaks into the rest of the comp.
// ---------------------------------------------------------------------------------------------------------------------
const CSS = `
.gvp{--bg-deep:#0a0c10;--bg-card:#12151c;--border:#1e2330;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;
  --accent-red:#ff4060;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--accent:#00c2ff;--role-a:#ffd700;--role-b:#22c55e}
.gvp.frame{position:absolute;left:0;top:0;width:1920px;height:1080px;background:var(--bg-deep);overflow:hidden;color:var(--text-primary);
  font-family:'DM Sans',sans-serif;padding:96px 140px 0;box-sizing:border-box}
.gvp *{box-sizing:border-box;margin:0;padding:0}
.gvp .grain{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.gvp .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.30;pointer-events:none;z-index:0}
.gvp .hd{position:relative;z-index:1}
.gvp .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:22px}
.gvp h1{font-family:'Playfair Display',serif;font-weight:900;font-size:68px;line-height:1.07;letter-spacing:-.02em;color:var(--text-primary);max-width:1440px}
.gvp .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));margin:28px 0 0}
.gvp .ck{color:var(--accent)}
.gvp .abs{position:absolute}
.gvp .role{top:92px;right:140px;font-family:'DM Sans',sans-serif;font-style:italic;font-weight:700;font-size:34px;letter-spacing:.02em;
  text-transform:uppercase;text-shadow:0 4px 18px rgba(0,0,0,.65);z-index:2;line-height:1}
.gvp .ra{color:var(--role-a)} .gvp .rb{color:var(--role-b)} .gvp .rw{color:#fff}
.gvp .src{left:140px;bottom:38px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:17px;color:var(--text-muted);z-index:2}
.gvp .stage{position:absolute;inset:0;z-index:1}
.gvp .stage>*{position:absolute}
.gvp .impact{background:linear-gradient(135deg,rgba(0,194,255,.10),rgba(0,194,255,.03));border:1px solid rgba(0,194,255,.32);
  border-radius:14px;display:flex;align-items:center;justify-content:center;gap:26px}
.gvp .caps{font-family:'DM Sans',sans-serif;font-weight:700;text-transform:uppercase}
/* split-test */
.gvp .ab{top:318px;width:780px;height:430px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);padding:26px 28px}
.gvp .abh{display:flex;align-items:center;gap:16px;height:46px}
.gvp .abl{width:46px;height:46px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-weight:600;font-size:26px;background:#1a1f2b;color:var(--text-primary)}
.gvp .abn{font-family:'DM Sans';font-weight:700;font-size:23px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.gvp .stamp{margin-left:auto;padding:8px 18px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.12em}
.gvp .stamp.kill{background:rgba(255,64,96,.14);color:var(--accent-red);border:1px solid rgba(255,64,96,.4)}
.gvp .stamp.scale{background:var(--accent);color:#04121c}
.gvp .br{margin-top:22px;height:310px;border-radius:12px;background:#0d1017;border:1px solid #232938;overflow:hidden;position:relative}
.gvp .bbar{height:34px;background:#161b26;display:flex;align-items:center;gap:8px;padding-left:14px}
.gvp .bbar i{width:11px;height:11px;border-radius:50%;background:#2c3344;display:block}
.gvp .bbar .url{margin-left:14px;width:300px;height:14px;border-radius:7px;background:#20263380}
.gvp .wb{position:absolute;border-radius:6px;background:#232a39}
.gvp .hero{position:absolute;left:24px;right:24px;top:58px;height:132px;border-radius:10px;background:#151a25}
.gvp .hero.ai{background:linear-gradient(120deg,rgba(0,194,255,.20),rgba(0,194,255,.04));border:1px solid rgba(0,194,255,.35)}
.gvp .spark{position:absolute;font-size:30px;color:var(--accent);line-height:1}
.gvp .track{top:774px;width:780px;height:26px;border-radius:13px;background:var(--border);overflow:hidden}
.gvp .fill{position:absolute;left:0;top:0;height:100%;border-radius:13px}
.gvp .tl{top:808px;font-family:'DM Sans';font-weight:600;font-size:19px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.gvp .take{left:140px;right:140px;top:864px;height:100px}
.gvp .take .k{font-family:'DM Sans';font-weight:700;font-size:48px;letter-spacing:.08em}
/* pass-rate-meter */
.gvp .lead{left:140px;top:420px;font-family:'DM Sans';font-weight:600;font-size:23px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.gvp .fix{left:140px;top:470px;width:560px;height:250px;border-radius:18px;background:var(--bg-card);border:2px solid var(--accent);
  box-shadow:0 0 60px rgba(0,194,255,.22);padding:34px 36px;overflow:hidden}
.gvp .fix .top-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),transparent)}
.gvp .fix .tag{display:inline-block;padding:6px 16px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:18px;letter-spacing:.12em;
  background:rgba(0,194,255,.15);color:var(--accent)}
.gvp .fix .ft{margin-top:22px;font-family:'Playfair Display',serif;font-weight:900;font-size:56px;line-height:1.05;color:var(--text-primary)}
.gvp .fix .fs{margin-top:14px;font-family:'DM Sans';font-size:26px;color:var(--text-secondary)}
.gvp .slot{left:140px;top:470px;width:560px;height:250px;border-radius:18px;border:2px dashed #2a3142}
.gvp .gl{left:860px;width:760px;text-align:center}
`;
export const GvpStyle: React.FC = () => <style>{CSS}</style>;

const Orbs: React.FC = () => (
  <>
    <div className="orb" style={{ width: 760, height: 760, right: -300, top: -360, background: '#00c2ff' }} />
    <div className="orb" style={{ width: 520, height: 520, left: -260, bottom: -320, background: '#0b3a66', opacity: 0.35 }} />
  </>
);
const Head: React.FC<{ h1: React.ReactNode; role: 'a' | 'b' }> = ({ h1, role }) => (
  <>
    <Orbs />
    <div className="hd">
      <div className="ey">Difference 1 &middot; The scoreboard</div>
      <h1>{h1}</h1>
      <div className="divider" />
    </div>
    <div className="abs role">
      {role === 'a' ? <span className="ra">GROWTH</span> : <span className="rb">PRODUCT</span>} <span className="rw">ENGINEER</span>
    </div>
  </>
);

// =====================================================================================================================
// CHART split-test (CH2@72.00-77.52): spec assets/charts/split-test.spec.md. NO figure printed anywhere.
// =====================================================================================================================
const ST = { T0: 72.0, GROW: 74.34, CREEP: 75.14, TAKE: 76.22, WIN: 77.04 };
const Page: React.FC<{ x: number; ai: boolean; win: number }> = ({ x, ai, win }) => {
  // win in [0,1]: the WINNER lights (B) / the LOSER dims (A) over 8 f from 77.04
  const lose = ai ? 0 : win;
  const w = ai ? win : 0;
  const stampPop = (s: number) => interpolate(s, [0, 1], [0.8, 1], clamp);
  return (
    <div className="ab" style={{ left: x, borderColor: w > 0 ? `rgba(0,194,255,${0.3 + 0.7 * w})` : undefined, borderWidth: 1 + w,
      boxShadow: w > 0 ? `0 0 ${70 * w}px rgba(0,194,255,${0.28 * w}), inset 0 0 40px rgba(0,194,255,${0.06 * w})` : undefined,
      padding: `${26 - w}px ${28 - w}px` }}>
      <div className="abh">
        <span className="abl" style={{ opacity: 1 - 0.62 * lose, background: w > 0 ? `rgba(0,194,255,${w})` : undefined,
          color: w > 0.5 ? '#04121c' : undefined }}>{ai ? 'B' : 'A'}</span>
        <span className="abn" style={{ opacity: 1 - 0.62 * lose, color: w > 0.5 ? '#e8eaf0' : undefined }}>{ai ? 'AI-personalized page' : 'Standard page'}</span>
        {win > 0 && (
          <span className={`stamp ${ai ? 'scale' : 'kill'}`} style={{ transform: `scale(${stampPop(Math.min(1, win * 8 / 6))})`, opacity: Math.min(1, win * 2) }}>
            {ai ? 'SCALE IT' : 'KILL IT'}
          </span>
        )}
      </div>
      <div className="br" style={{ opacity: 1 - 0.62 * lose }}>
        <div className="bbar"><i /><i /><i /><span className="url" /></div>
        <div className="wb" style={{ left: 24, top: 46, width: 70, height: 12, background: '#2c3344' }} />
        {ai ? (
          <div className="hero ai">
            <div className="wb" style={{ left: 22, top: 26, width: 58, height: 58, borderRadius: '50%', background: 'rgba(0,194,255,.45)' }} />
            <div className="wb" style={{ left: 100, top: 30, width: 300, height: 22, background: '#3a5f78' }} />
            <div className="wb" style={{ left: 100, top: 66, width: 220, height: 16, background: '#2c4458' }} />
            <div className="wb" style={{ left: 22, top: 100, width: 150, height: 20, borderRadius: 10, background: 'var(--accent)' }} />
            <div className="spark" style={{ right: 22, top: 18 }}>&#10022;</div>
          </div>
        ) : (
          <div className="hero">
            <div className="wb" style={{ left: 22, top: 28, width: 360, height: 22 }} />
            <div className="wb" style={{ left: 22, top: 64, width: 260, height: 16, background: '#1e2431' }} />
            <div className="wb" style={{ left: 22, top: 100, width: 150, height: 20, borderRadius: 10, background: '#3a4356' }} />
          </div>
        )}
        {[0, 1, 2].map((i) => <div key={i} className="wb" style={{ left: 24 + i * 228, top: 210, width: 206, height: 80, background: '#151a25' }} />)}
      </div>
    </div>
  );
};
const Bar: React.FC<{ x: number; pct: number; ai: boolean; win: number }> = ({ x, pct, ai, win }) => (
  <>
    <div className="track" style={{ left: x }}>
      <div className="fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2b5f7a,#3f8fb5)' }} />
      {win > 0 && (ai ? (
        <div className="fill" style={{ width: `${pct}%`, opacity: win, background: 'linear-gradient(90deg,#0a86b8,#00c2ff)', boxShadow: '0 0 28px rgba(0,194,255,.7)' }} />
      ) : (
        <div className="fill" style={{ width: `${pct}%`, opacity: win, background: '#3a4356' }} />
      ))}
    </div>
    <div className="tl" style={{ left: x }}>the number</div>
  </>
);
export const SplitTestChart: React.FC = () => {
  const { t } = useGvp();
  // both bars grow from 0, ease-out (cubic) over 24 f: A to 30, B to 46 (= mid)
  const g1 = ramp(t, ST.GROW, ST.GROW + 24 * F30);
  // A creeps 30 -> 34 and stalls; B keeps growing 46 -> 82 (ease-out, 30 f)
  const g2 = ramp(t, ST.CREEP, ST.CREEP + 30 * F30);
  const a = 30 * g1 + 4 * g2;
  const b = 46 * g1 + 36 * g2;
  const take = ramp(t, ST.TAKE, ST.TAKE + 8 * F30);
  const win = ramp(t, ST.WIN, ST.WIN + 8 * F30);
  return (
    <div className="gvp frame">
      <Head role="a" h1={<>Ship the AI page as a <span className="ck">split test</span>.</>} />
      <div className="stage">
        <Page x={140} ai={false} win={win} />
        <Page x={1000} ai={true} win={win} />
        <Bar x={140} pct={a} ai={false} win={win} />
        <Bar x={1000} pct={b} ai={true} win={win} />
        {take > 0 && (
          <div className="impact take" style={{ opacity: take, transform: `translateY(${16 * (1 - take)}px)` }}>
            <span className="k" style={{ color: 'var(--accent-red)' }}>KILL IT</span>
            <span className="k" style={{ color: 'var(--text-muted)', fontSize: 34 }}>OR</span>
            <span className="k ck">SCALE IT</span>
          </div>
        )}
      </div>
      <div className="abs src">Illustrative split test, no real figures. Control vs variation: Inside Atlassian, 2020-05-21</div>
      <div className="grain" />
    </div>
  );
};

// =====================================================================================================================
// CHART pass-rate-meter (CH2@77.52-82.60): spec assets/charts/pass-rate-meter.spec.md. The needle only, NO figure.
// =====================================================================================================================
const PM = { T0: 77.52, FIX: 79.5, CLIMB: 80.24, HIT: 82.14, CX: 1240, CY: 800, R: 340, TGT: 0.8 };
const pt = (f: number, r: number): [number, number] => { const a = Math.PI * (1 - f); return [PM.CX + r * Math.cos(a), PM.CY - r * Math.sin(a)]; };
const arc = (f0: number, f1: number, r: number) => {
  const [x0, y0] = pt(f0, r), [x1, y1] = pt(Math.max(f0 + 1e-4, f1), r);
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
};
export const PassRateMeterChart: React.FC = () => {
  const { t } = useGvp();
  // needle: rests at 0.22; climbs 0.22 -> 0.80 ease-in-out over 57 f from 80.24; 2 f overshoot to 0.82, back to 0.80
  let f = 0.22 + 0.58 * ramp(t, PM.CLIMB, PM.CLIMB + 57 * F30, Easing.inOut(Easing.cubic));
  if (t >= PM.HIT) f = interpolate(t, [PM.HIT, PM.HIT + 2 * F30, PM.HIT + 4 * F30], [0.8, 0.82, 0.8], clamp);
  const fix = ramp(t, PM.FIX, PM.FIX + 8 * F30);
  const arrow = ramp(t, PM.FIX + 8 * F30, PM.FIX + 14 * F30, Easing.linear);
  const hit = ramp(t, PM.HIT, PM.HIT + 6 * F30);
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const [a, b] = pt(i / 10, PM.R + 30), [c, d] = pt(i / 10, PM.R + (i % 5 === 0 ? 56 : 46));
    ticks.push(<line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#3a4356" strokeWidth={i % 5 === 0 ? 4 : 3} strokeLinecap="round" />);
  }
  const [tx, ty] = pt(PM.TGT, PM.R + 30), [tx2, ty2] = pt(PM.TGT, PM.R + 72), [lx, ly] = pt(PM.TGT, PM.R + 108);
  const [nx, ny] = pt(f, PM.R - 34);
  const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
  const notchCol = mix([136, 146, 164], [0, 194, 255], hit);
  const passCol = mix([232, 234, 240], [0, 194, 255], hit);
  return (
    <div className="gvp frame">
      <Head role="b" h1={<>Ship a grounding fix. Watch the <span className="ck">pass rate</span>.</>} />
      <div className="stage">
        <svg style={{ left: 0, top: 0 }} width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            {/* userSpaceOnUse over the full frame: an objectBoundingBox filter makes a vertical needle vanish (spec) */}
            <filter id="gvp-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="gvp-fg" x1="0" x2="1"><stop offset="0" stopColor="#0a6f9a" /><stop offset="1" stopColor="#00c2ff" /></linearGradient>
          </defs>
          <path d={arc(0, 1, PM.R)} fill="none" stroke="#1e2330" strokeWidth={36} strokeLinecap="round" />
          <path d={arc(0, f, PM.R)} fill="none" stroke="url(#gvp-fg)" strokeWidth={36} strokeLinecap="round" filter="url(#gvp-glow)" />
          {ticks}
          <line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke={notchCol} strokeWidth={6} strokeLinecap="round" filter={hit > 0 ? 'url(#gvp-glow)' : undefined} />
          <text x={lx} y={ly} textAnchor="middle" fontFamily="DM Sans" fontWeight={700} fontSize={22} letterSpacing={3.5} fill={notchCol}>TARGET</text>
          <line x1={PM.CX} y1={PM.CY} x2={nx} y2={ny} stroke="#e8eaf0" strokeWidth={7} strokeLinecap="round" filter="url(#gvp-glow)" />
          <circle cx={PM.CX} cy={PM.CY} r={24} fill="#12151c" stroke="#00c2ff" strokeWidth={5} />
          {arrow > 0 && (
            <>
              <path d="M 724 595 L 860 595" stroke="#00c2ff" strokeWidth={4} strokeLinecap="round" fill="none" strokeDasharray={140} strokeDashoffset={140 * (1 - arrow)} />
              {arrow >= 1 && <path d="M 846 583 L 864 595 L 846 607" stroke="#00c2ff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
            </>
          )}
        </svg>
        <div className="lead">The product engineer ships</div>
        {fix < 1 && <div className="slot" style={{ opacity: 1 - fix }} />}
        {fix > 0 && (
          <div className="fix" style={{ opacity: fix, transform: `translateY(${24 * (1 - fix)}px)` }}>
            <div className="top-accent" /><span className="tag">SHIPPED</span><div className="ft">Grounding fix</div>
            <div className="fs">answers grounded in real data</div>
          </div>
        )}
        <div className="gl caps" style={{ top: 852, fontSize: 42, letterSpacing: '.16em', color: passCol }}>Pass rate</div>
        <div className="gl" style={{ top: 912, fontFamily: "'DM Sans'", fontSize: 27, color: 'var(--text-secondary)' }}>on the eval set</div>
      </div>
      <div className="abs src">Illustrative, no figure printed. Pass-rate targets: GovWell, Our AI Stack. Grounding measures: Citian</div>
      <div className="grain" />
    </div>
  );
};

// =====================================================================================================================
// KINETIC TEXT (overlays.md section 2, the 2023 devices, house palette + font). Copied from the reference, adapted.
// =====================================================================================================================
const PANEL_W = 862;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** kt-keyword-pop motion: appears at once, scale 100 -> 110 over 0.20 s with the rotation jiggle
 * 0 / +2 / -2 / +1 / -0.5 / 0 deg at 0 / 0.03 / 0.08 / 0.13 / 0.20 / 0.27 s, a 2-3 frame smear, then still at 110. */
export const popMotion = (dt: number) => {
  const s = interpolate(dt, [0, 0.2], [1, 1.1], clamp);
  const rot = interpolate(dt, [0, 0.03, 0.08, 0.13, 0.2, 0.27], [0, 2, -2, 1, -0.5, 0], clamp);
  const blur = interpolate(dt, [0, 0.1], [5, 0], clamp);
  return { s, rot, blur };
};

/** kt-side-panel: the panel slides in from fully off-screen to flush in 0.50 s ease-out; 0.23 s later the text rises 338 px
 * over 0.33 s scaling 80 -> 110 -> 100 (peak at 0.15 s), motion-blurred; then hovers (+-18 x / +-13 y, a new target every
 * ~0.7 s, +-0.5 deg rock on a 3.0 s cycle). No exit move: the cut / whip removes it. Role name in the role accent, the
 * verdict white, the panel edge in the teaching-block cyan. */
export const KtSidePanel: React.FC<{ side: 'L' | 'R'; t0: number; t1: number; role: 'a' | 'b'; lines: string[] }> = ({ side, t0, t1, role, lines }) => {
  const { t } = useGvp();
  const dt = t - t0;
  if (dt < 0 || t >= t1) return null;
  const slide = interpolate(dt, [0, 0.5], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x0 = side === 'R' ? 1920 - PANEL_W : 0;
  const off = (side === 'R' ? 1 : -1) * PANEL_W * slide;
  const tr = dt - 0.23;
  const rise = interpolate(tr, [0, 0.33], [338, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(tr, [0, 0.15, 0.33], [0.8, 1.1, 1.0], clamp);
  const blur = interpolate(tr, [0, 0.25], [6, 0], clamp);
  const hv = Math.max(0, tr - 0.33);
  const seg = Math.floor(hv / 0.7), u = Easing.inOut(Easing.sin)((hv % 0.7) / 0.7);
  const tx = (k: number) => (hash(k * 2 + t0) * 2 - 1) * 18, ty = (k: number) => (hash(k * 2 + 1 + t0) * 2 - 1) * 13;
  const hx = hv === 0 ? 0 : (seg === 0 ? tx(0) * u : tx(seg - 1) + (tx(seg) - tx(seg - 1)) * u);
  const hy = hv === 0 ? 0 : (seg === 0 ? ty(0) * u : ty(seg - 1) + (ty(seg) - ty(seg - 1)) * u);
  const rock = 0.5 * Math.sin((2 * Math.PI * hv) / 3.0);
  const col = role === 'a' ? ROLE.a : ROLE.b;
  return (
    <div style={{ position: 'absolute', top: 0, left: x0 + off, width: PANEL_W, height: 1080, overflow: 'hidden',
      background: 'linear-gradient(160deg,#10161c 0%,#0a0d12 60%,#0b1418 100%)',
      boxShadow: side === 'R' ? '-30px 0 60px rgba(0,0,0,.55)' : '30px 0 60px rgba(0,0,0,.55)' }}>
      {/* the textured dark panel: grain + a soft teaching-cyan bloom + the accent edge on the picture side */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: 'absolute', width: 900, height: 900, left: -20, top: 90, borderRadius: '50%', background: 'rgba(0,194,255,.09)', filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [side === 'R' ? 'left' : 'right']: 0, width: 4, background: `linear-gradient(180deg, rgba(0,194,255,0), ${TEACH}, rgba(0,194,255,0))` } as React.CSSProperties} />
      {tr >= 0 && (
        <div style={{ position: 'absolute', left: 90, right: 70, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transform: `translate(${hx}px, ${rise + hy}px) scale(${sc}) rotate(${rock}deg)`, transformOrigin: '40% 50%', filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 46, lineHeight: 1.05, letterSpacing: '.02em', marginBottom: 26 }}>
            <span style={{ color: col }}>{role === 'a' ? 'GROWTH' : 'PRODUCT'}</span> <span style={{ color: '#fff' }}>ENGINEER</span>
          </div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: lines.length > 2 ? 74 : 84, lineHeight: 1.04, color: '#e8eaf0', letterSpacing: '-.005em' }}>{l}</div>
          ))}
          <div style={{ width: 90, height: 5, borderRadius: 3, marginTop: 34, background: `linear-gradient(90deg, ${col}, rgba(0,194,255,.25))` }} />
        </div>
      )}
    </div>
  );
};

/** A ROLE LABEL (kt-signature-open / the role-label pops): two lines, the role words in the role accent, ENGINEER white,
 * house display font, drop shadow, doing the kt-keyword-pop motion from t0 (held at 110 until t1, the cut removes it). */
export const RoleLabelPop: React.FC<{ t0: number; t1: number; role: 'a' | 'b'; line1: string; x: number; y: number; size: number;
  align?: 'left' | 'center'; boxed?: boolean }> = ({ t0, t1, role, line1, x, y, size, align = 'left', boxed = false }) => {
  const { t } = useGvp();
  if (t < t0 || t >= t1) return null;
  const pm = popMotion(t - t0);
  const col = role === 'a' ? ROLE.a : ROLE.b;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, -50%) scale(${pm.s}) rotate(${pm.rot}deg)`,
      transformOrigin: align === 'center' ? '50% 50%' : '0% 50%', filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined,
      fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: size, lineHeight: 1.0, letterSpacing: '.005em', whiteSpace: 'nowrap',
      textAlign: align, textShadow: '0 6px 26px rgba(0,0,0,.85), 0 2px 6px rgba(0,0,0,.7)',
      ...(boxed ? { padding: '20px 38px 22px', borderRadius: 18, background: 'rgba(10,12,16,.88)', border: `3px solid ${col}`,
        boxShadow: `0 0 50px ${col}44, 0 18px 40px rgba(0,0,0,.6)` } : {}) }}>
      <div style={{ color: col }}>{line1}</div>
      <div style={{ color: '#ffffff' }}>ENGINEER</div>
    </div>
  );
};

export const ChartFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill>{children}</AbsoluteFill>;
