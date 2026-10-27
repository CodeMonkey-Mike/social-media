// GrowthVsProductVerticalCharts.tsx: the PORTRAIT (1080x1920) code-built visuals of growth-vs-product's vertical cut
// (vertical-repurpose.md section 1: animated charts are re-laid out for portrait IN CODE, never letterboxed).
// - SplitTestChartV / PassRateMeterChartV: ported 1:1 from assets/vertical/charts/<id>.html (the chart-builder's portrait
//   sources) to the geometry tables of assets/vertical/charts/<id>.vertical.spec.md. The CLOCK is the 16:9 one, unchanged:
//   same cue tables (ST / PM), same source-spine seconds, easings and frame counts, read off the comp's ABSOLUTE clock.
// - KtBottomPanelV: the kt-side-panel device (overlays.md section 2) re-laid for portrait: the panel takes the BOTTOM band
//   of the frame (the 16:9 takes the right / left 45 percent), still sliding in from the RIGHT for the growth verdict and
//   from the LEFT for the product verdict; same 0.50 s slide, 0.23 s text rise 80 -> 110 -> 100, the hover and the rock.
// Every cue is a SOURCE-spine second (the comp publishes it through GvpClock, owned by GrowthVsProductCharts).
import React from 'react';
import { Easing, interpolate } from 'remotion';
import { ROLE, TEACH, ramp, useGvp } from './GrowthVsProductCharts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const F30 = 1 / 30;

// ---------------------------------------------------------------------------------------------------------------------
// THE PORTRAIT STYLESHEET: the locked container tokens + the vertical chart layer, verbatim from the two portrait HTML
// sources, scoped under .gvpv (the 16:9 .gvp sheet stays untouched).
// ---------------------------------------------------------------------------------------------------------------------
const CSS = `
.gvpv{--bg-deep:#0a0c10;--bg-card:#12151c;--border:#1e2330;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;
  --accent-red:#ff4060;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--accent:#00c2ff;--role-a:#ffd700;--role-b:#22c55e}
.gvpv.frame{position:absolute;left:0;top:0;width:1080px;height:1920px;background:var(--bg-deep);overflow:hidden;color:var(--text-primary);
  font-family:'DM Sans',sans-serif;padding:130px 80px 0;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start}
.gvpv *{box-sizing:border-box;margin:0;padding:0}
.gvpv .grain{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.gvpv .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.30;pointer-events:none;z-index:0}
.gvpv .hd{position:relative;z-index:1}
.gvpv .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:22px}
.gvpv h1{font-family:'Playfair Display',serif;font-weight:900;font-size:78px;line-height:1.07;letter-spacing:-.02em;color:var(--text-primary);max-width:920px}
.gvpv .drow{display:flex;align-items:center;justify-content:space-between;margin-top:30px;height:40px}
.gvpv .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan))}
.gvpv .ck{color:var(--accent)}
.gvpv .abs{position:absolute}
.gvpv .role{font-family:'DM Sans',sans-serif;font-style:italic;font-weight:700;font-size:34px;letter-spacing:.02em;
  text-transform:uppercase;text-shadow:0 4px 18px rgba(0,0,0,.65);line-height:1}
.gvpv .ra{color:var(--role-a)} .gvpv .rb{color:var(--role-b)} .gvpv .rw{color:#fff}
.gvpv .src{left:80px;width:920px;bottom:160px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:18px;line-height:1.5;color:var(--text-muted);z-index:2}
.gvpv .stage{position:absolute;inset:0;z-index:1}
.gvpv .stage>*{position:absolute}
.gvpv .impact{background:linear-gradient(135deg,rgba(0,194,255,.10),rgba(0,194,255,.03));border:1px solid rgba(0,194,255,.32);
  border-radius:14px;display:flex;align-items:center;justify-content:center;gap:26px}
.gvpv .caps{font-family:'DM Sans',sans-serif;font-weight:700;text-transform:uppercase}
/* split-test (portrait) */
.gvpv .ab{left:80px;width:920px;height:400px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);padding:26px 28px}
.gvpv .abh{display:flex;align-items:center;gap:16px;height:50px}
.gvpv .abl{width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-weight:600;font-size:28px;background:#1a1f2b;color:var(--text-primary)}
.gvpv .abn{font-family:'DM Sans';font-weight:700;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.gvpv .stamp{margin-left:auto;padding:8px 18px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:21px;letter-spacing:.12em}
.gvpv .stamp.kill{background:rgba(255,64,96,.14);color:var(--accent-red);border:1px solid rgba(255,64,96,.4)}
.gvpv .stamp.scale{background:var(--accent);color:#04121c}
.gvpv .br{margin-top:20px;height:278px;border-radius:12px;background:#0d1017;border:1px solid #232938;overflow:hidden;position:relative}
.gvpv .bbar{height:34px;background:#161b26;display:flex;align-items:center;gap:8px;padding-left:14px}
.gvpv .bbar i{width:11px;height:11px;border-radius:50%;background:#2c3344;display:block}
.gvpv .bbar .url{margin-left:14px;width:340px;height:14px;border-radius:7px;background:#20263380}
.gvpv .wb{position:absolute;border-radius:6px;background:#232a39}
.gvpv .hero{position:absolute;left:24px;right:24px;top:58px;height:124px;border-radius:10px;background:#151a25}
.gvpv .hero.ai{background:linear-gradient(120deg,rgba(0,194,255,.20),rgba(0,194,255,.04));border:1px solid rgba(0,194,255,.35)}
.gvpv .spark{position:absolute;font-size:30px;color:var(--accent);line-height:1}
.gvpv .track{left:80px;width:920px;height:30px;border-radius:15px;background:var(--border);overflow:hidden}
.gvpv .fill{position:absolute;left:0;top:0;height:100%;border-radius:15px}
.gvpv .tl{left:80px;font-family:'DM Sans';font-weight:600;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.gvpv .take{left:80px;right:80px;top:1560px;height:120px}
.gvpv .take .k{font-family:'DM Sans';font-weight:700;font-size:54px;letter-spacing:.08em}
/* pass-rate-meter (portrait) */
.gvpv .lead{left:80px;top:500px;font-family:'DM Sans';font-weight:600;font-size:25px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.gvpv .fix{left:80px;top:552px;width:920px;height:246px;border-radius:18px;background:var(--bg-card);border:2px solid var(--accent);
  box-shadow:0 0 60px rgba(0,194,255,.22);padding:34px 40px;overflow:hidden}
.gvpv .fix .top-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),transparent)}
.gvpv .fix .tag{display:inline-block;padding:6px 16px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.12em;
  background:rgba(0,194,255,.15);color:var(--accent)}
.gvpv .fix .ft{margin-top:20px;font-family:'Playfair Display',serif;font-weight:900;font-size:62px;line-height:1.05;color:var(--text-primary)}
.gvpv .fix .fs{margin-top:12px;font-family:'DM Sans';font-size:28px;color:var(--text-secondary)}
.gvpv .slot{left:80px;top:552px;width:920px;height:246px;border-radius:18px;border:2px dashed #2a3142}
.gvpv .gl{left:80px;width:920px;text-align:center}
`;
export const GvpVStyle: React.FC = () => <style>{CSS}</style>;

const Orbs: React.FC = () => (
  <>
    <div className="orb" style={{ width: 760, height: 760, right: -340, top: -320, background: '#00c2ff' }} />
    <div className="orb" style={{ width: 620, height: 620, left: -300, bottom: -300, background: '#0b3a66', opacity: 0.35 }} />
  </>
);
/** the shared 2-line portrait header: eyebrow y130, headline y187 (920x167), divider + role label on ONE row at y384 */
const HeadV: React.FC<{ h1: React.ReactNode; role: 'a' | 'b' }> = ({ h1, role }) => (
  <>
    <Orbs />
    <div className="hd">
      <div className="ey">Difference 1 &middot; The scoreboard</div>
      <h1>{h1}</h1>
      <div className="drow">
        <div className="divider" />
        <div className="role">
          {role === 'a' ? <span className="ra">GROWTH</span> : <span className="rb">PRODUCT</span>} <span className="rw">ENGINEER</span>
        </div>
      </div>
    </div>
  </>
);

// =====================================================================================================================
// CHART split-test, PORTRAIT (CH2@72.00-77.52): spec assets/vertical/charts/split-test.vertical.spec.md. The two cards
// STACK (A y490, B y1020), each bar 22 px under its own card on one shared 920 px scale. NO figure printed anywhere.
// =====================================================================================================================
const ST = { T0: 72.0, GROW: 74.34, CREEP: 75.14, TAKE: 76.22, WIN: 77.04 };   // the 16:9 cue table, unchanged
const CARD_Y = { A: 490, B: 1020 };
const TRACK_DY = 422, LABEL_DY = 464;
const PageV: React.FC<{ y: number; ai: boolean; win: number }> = ({ y, ai, win }) => {
  const lose = ai ? 0 : win;
  const w = ai ? win : 0;
  const stampPop = (s: number) => interpolate(s, [0, 1], [0.8, 1], clamp);
  return (
    <div className="ab" style={{ top: y, borderColor: w > 0 ? `rgba(0,194,255,${0.3 + 0.7 * w})` : undefined, borderWidth: 1 + w,
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
        <div className="wb" style={{ left: 24, top: 44, width: 80, height: 10, background: '#2c3344' }} />
        {ai ? (
          <div className="hero ai">
            <div className="wb" style={{ left: 24, top: 24, width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,194,255,.45)' }} />
            <div className="wb" style={{ left: 106, top: 28, width: 380, height: 22, background: '#3a5f78' }} />
            <div className="wb" style={{ left: 106, top: 64, width: 280, height: 16, background: '#2c4458' }} />
            <div className="wb" style={{ left: 24, top: 94, width: 170, height: 18, borderRadius: 9, background: 'var(--accent)' }} />
            <div className="spark" style={{ right: 24, top: 18 }}>&#10022;</div>
          </div>
        ) : (
          <div className="hero">
            <div className="wb" style={{ left: 24, top: 26, width: 440, height: 22 }} />
            <div className="wb" style={{ left: 24, top: 62, width: 320, height: 16, background: '#1e2431' }} />
            <div className="wb" style={{ left: 24, top: 94, width: 170, height: 18, borderRadius: 9, background: '#3a4356' }} />
          </div>
        )}
        {[0, 1, 2].map((i) => <div key={i} className="wb" style={{ left: 24 + i * 280, top: 198, width: 258, height: 62, background: '#151a25' }} />)}
      </div>
    </div>
  );
};
const BarV: React.FC<{ y: number; pct: number; ai: boolean; win: number }> = ({ y, pct, ai, win }) => (
  <>
    <div className="track" style={{ top: y + TRACK_DY }}>
      <div className="fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2b5f7a,#3f8fb5)' }} />
      {win > 0 && (ai ? (
        <div className="fill" style={{ width: `${pct}%`, opacity: win, background: 'linear-gradient(90deg,#0a86b8,#00c2ff)', boxShadow: '0 0 28px rgba(0,194,255,.7)' }} />
      ) : (
        <div className="fill" style={{ width: `${pct}%`, opacity: win, background: '#3a4356' }} />
      ))}
    </div>
    <div className="tl" style={{ top: y + LABEL_DY }}>the number</div>
  </>
);
export const SplitTestChartV: React.FC = () => {
  const { t } = useGvp();
  const g1 = ramp(t, ST.GROW, ST.GROW + 24 * F30);           // both bars grow from 0, ease-out 24 f: A to 30, B to 46 (= mid)
  const g2 = ramp(t, ST.CREEP, ST.CREEP + 30 * F30);         // A creeps 30 -> 34 and stalls; B keeps growing 46 -> 82
  const a = 30 * g1 + 4 * g2;
  const b = 46 * g1 + 36 * g2;
  const take = ramp(t, ST.TAKE, ST.TAKE + 8 * F30);
  const win = ramp(t, ST.WIN, ST.WIN + 8 * F30);
  return (
    <div className="gvpv frame">
      <HeadV role="a" h1={<>Ship the AI page<br />as a <span className="ck">split test</span>.</>} />
      <div className="stage">
        <PageV y={CARD_Y.A} ai={false} win={win} />
        <BarV y={CARD_Y.A} pct={a} ai={false} win={win} />
        <PageV y={CARD_Y.B} ai={true} win={win} />
        <BarV y={CARD_Y.B} pct={b} ai={true} win={win} />
        {take > 0 && (
          <div className="impact take" style={{ opacity: take, transform: `translateY(${16 * (1 - take)}px)` }}>
            <span className="k" style={{ color: 'var(--accent-red)' }}>KILL IT</span>
            <span className="k" style={{ color: 'var(--text-muted)', fontSize: 38 }}>OR</span>
            <span className="k ck">SCALE IT</span>
          </div>
        )}
      </div>
      <div className="abs src">Illustrative split test, no real figures.<br />Control vs variation: Inside Atlassian, 2020-05-21</div>
      <div className="grain" />
    </div>
  );
};

// =====================================================================================================================
// CHART pass-rate-meter, PORTRAIT (CH2@77.52-82.60): spec assets/vertical/charts/pass-rate-meter.vertical.spec.md. Card on
// top, the arrow pointing DOWN, the gauge below (centre 540,1420, R 350). The needle only, NO figure.
// =====================================================================================================================
const PM = { T0: 77.52, FIX: 79.5, CLIMB: 80.24, HIT: 82.14, CX: 540, CY: 1420, R: 350, TGT: 0.8 };   // 16:9 clock, portrait geometry
const pt = (f: number, r: number): [number, number] => { const a = Math.PI * (1 - f); return [PM.CX + r * Math.cos(a), PM.CY - r * Math.sin(a)]; };
const arc = (f0: number, f1: number, r: number) => {
  const [x0, y0] = pt(f0, r), [x1, y1] = pt(Math.max(f0 + 1e-4, f1), r);
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
};
export const PassRateMeterChartV: React.FC = () => {
  const { t } = useGvp();
  let f = 0.22 + 0.58 * ramp(t, PM.CLIMB, PM.CLIMB + 57 * F30, Easing.inOut(Easing.cubic));
  if (t >= PM.HIT) f = interpolate(t, [PM.HIT, PM.HIT + 2 * F30, PM.HIT + 4 * F30], [0.8, 0.82, 0.8], clamp);
  const fix = ramp(t, PM.FIX, PM.FIX + 8 * F30);
  const arrow = ramp(t, PM.FIX + 8 * F30, PM.FIX + 14 * F30, Easing.linear);
  const hit = ramp(t, PM.HIT, PM.HIT + 6 * F30);
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const [a, b] = pt(i / 10, PM.R + 32), [c, d] = pt(i / 10, PM.R + (i % 5 === 0 ? 58 : 48));
    ticks.push(<line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#3a4356" strokeWidth={i % 5 === 0 ? 4 : 3} strokeLinecap="round" />);
  }
  const [tx, ty] = pt(PM.TGT, PM.R + 32), [tx2, ty2] = pt(PM.TGT, PM.R + 74), [lx, ly] = pt(PM.TGT, PM.R + 110);
  const [nx, ny] = pt(f, PM.R - 36);
  const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
  const notchCol = mix([136, 146, 164], [0, 194, 255], hit);
  const passCol = mix([232, 234, 240], [0, 194, 255], hit);
  return (
    <div className="gvpv frame">
      <HeadV role="b" h1={<>Ship a grounding fix.<br />Watch the <span className="ck">pass rate</span>.</>} />
      <div className="stage">
        <svg style={{ left: 0, top: 0 }} width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            {/* userSpaceOnUse over the full portrait frame: the needle is exactly vertical mid-climb (spec) */}
            <filter id="gvpv-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="gvpv-fg" x1="0" x2="1"><stop offset="0" stopColor="#0a6f9a" /><stop offset="1" stopColor="#00c2ff" /></linearGradient>
          </defs>
          <path d={arc(0, 1, PM.R)} fill="none" stroke="#1e2330" strokeWidth={38} strokeLinecap="round" />
          <path d={arc(0, f, PM.R)} fill="none" stroke="url(#gvpv-fg)" strokeWidth={38} strokeLinecap="round" filter="url(#gvpv-glow)" />
          {ticks}
          <line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke={notchCol} strokeWidth={6} strokeLinecap="round" filter={hit > 0 ? 'url(#gvpv-glow)' : undefined} />
          <text x={lx} y={ly} textAnchor="middle" fontFamily="DM Sans" fontWeight={700} fontSize={24} letterSpacing={3.5} fill={notchCol}>TARGET</text>
          <line x1={PM.CX} y1={PM.CY} x2={nx} y2={ny} stroke="#e8eaf0" strokeWidth={7} strokeLinecap="round" filter="url(#gvpv-glow)" />
          <circle cx={PM.CX} cy={PM.CY} r={26} fill="#12151c" stroke="#00c2ff" strokeWidth={5} />
          {arrow > 0 && (
            <>
              <path d="M 540 806 L 540 940" stroke="#00c2ff" strokeWidth={4} strokeLinecap="round" fill="none" strokeDasharray={134} strokeDashoffset={134 * (1 - arrow)} />
              {arrow >= 1 && <path d="M 528 926 L 540 944 L 552 926" stroke="#00c2ff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
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
        <div className="gl caps" style={{ top: 1478, fontSize: 48, letterSpacing: '.16em', color: passCol }}>Pass rate</div>
        <div className="gl" style={{ top: 1546, fontFamily: "'DM Sans'", fontSize: 30, color: 'var(--text-secondary)' }}>on the eval set</div>
      </div>
      <div className="abs src">Illustrative, no figure printed. Pass-rate targets:<br />GovWell, Our AI Stack. Grounding measures: Citian</div>
      <div className="grain" />
    </div>
  );
};

// =====================================================================================================================
// KINETIC TEXT, PORTRAIT: kt-side-panel re-laid as a BOTTOM panel (overlays.md section 2, copied from the 16:9
// KtSidePanel of this project and adapted). Band y PANEL_TOP..1920; it slides in horizontally (R from the right edge,
// L from the left) in 0.50 s ease-out; the text block sits in the panel's lower part so the caption line (y ~1370-1460,
// topmost) stays readable above it; the comp lifts and enlarges the face into the free top of the frame.
// =====================================================================================================================
export const PANEL_TOP = 1180;
const PANEL_H = 1920 - PANEL_TOP;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const KtBottomPanelV: React.FC<{ side: 'L' | 'R'; t0: number; t1: number; role: 'a' | 'b'; lines: string[] }> = ({ side, t0, t1, role, lines }) => {
  const { t } = useGvp();
  const dt = t - t0;
  if (dt < 0 || t >= t1) return null;
  const slide = interpolate(dt, [0, 0.5], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const off = (side === 'R' ? 1 : -1) * 1080 * slide;
  const tr = dt - 0.23;
  const rise = interpolate(tr, [0, 0.33], [260, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(tr, [0, 0.15, 0.33], [0.8, 1.1, 1.0], clamp);
  const blur = interpolate(tr, [0, 0.25], [6, 0], clamp);
  const hv = Math.max(0, tr - 0.33);
  const seg = Math.floor(hv / 0.7), u = Easing.inOut(Easing.sin)((hv % 0.7) / 0.7);
  const tx = (k: number) => (hash(k * 2 + t0) * 2 - 1) * 14, ty = (k: number) => (hash(k * 2 + 1 + t0) * 2 - 1) * 10;
  const hx = hv === 0 ? 0 : (seg === 0 ? tx(0) * u : tx(seg - 1) + (tx(seg) - tx(seg - 1)) * u);
  const hy = hv === 0 ? 0 : (seg === 0 ? ty(0) * u : ty(seg - 1) + (ty(seg) - ty(seg - 1)) * u);
  const rock = 0.5 * Math.sin((2 * Math.PI * hv) / 3.0);
  const col = role === 'a' ? ROLE.a : ROLE.b;
  const big = lines.length > 2 ? 60 : 70;
  return (
    <div style={{ position: 'absolute', left: off, top: PANEL_TOP, width: 1080, height: PANEL_H, overflow: 'hidden',
      background: 'linear-gradient(160deg,#10161c 0%,#0a0d12 60%,#0b1418 100%)', boxShadow: '0 -30px 60px rgba(0,0,0,.55)' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: 'absolute', width: 900, height: 700, left: 90, top: 120, borderRadius: '50%', background: 'rgba(0,194,255,.09)', filter: 'blur(140px)' }} />
      {/* the accent edge on the picture side = the panel's top edge */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: `linear-gradient(90deg, rgba(0,194,255,0), ${TEACH}, rgba(0,194,255,0))` }} />
      {tr >= 0 && (
        <div style={{ position: 'absolute', left: 80, right: 70, top: 300, bottom: 70, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          transform: `translate(${hx}px, ${rise + hy}px) scale(${sc}) rotate(${rock}deg)`, transformOrigin: '40% 40%', filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 42, lineHeight: 1.05, letterSpacing: '.02em', marginBottom: 20 }}>
            <span style={{ color: col }}>{role === 'a' ? 'GROWTH' : 'PRODUCT'}</span> <span style={{ color: '#fff' }}>ENGINEER</span>
          </div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: big, lineHeight: 1.04, color: '#e8eaf0', letterSpacing: '-.005em' }}>{l}</div>
          ))}
          <div style={{ width: 90, height: 5, borderRadius: 3, marginTop: 26, background: `linear-gradient(90deg, ${col}, rgba(0,194,255,.25))` }} />
        </div>
      )}
    </div>
  );
};
