// Kcc20VerticalCharts.tsx: the PORTRAIT (1080x1920) re-lay of kcc20's code-built visuals for Kcc20Vertical.tsx
// (vertical-repurpose.md section 1: animated charts are re-laid out IN CODE, never letterboxed).
// Geometry = media/kcc20/assets/vertical/charts/*.vertical.spec.md + diagrams/c5-timeline.vertical.spec.md (and their
// portrait HTML sources). The CLOCK is the 16:9 one, unchanged: same source-spine seconds, same easing, same data.
// Imports only this project's own files (Kcc20Charts: the shared clock, stylesheet tokens and motion helpers).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { ACCENT, popMotion, ramp, useK20 } from './Kcc20Charts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// the portrait layer of the stylesheet (verbatim from the vertical HTML sources' "VERTICAL 1080x1920 re-lay" block),
// scoped under .k20.v so the 16:9 rules stay untouched. K20Style (the base tokens) must be mounted too.
const VCSS = `
.k20.frame.v{width:1080px;height:1920px}
.k20.v h1{white-space:normal;font-size:80px;line-height:1.06;max-width:920px}
.k20.v .src{white-space:nowrap;font-size:21px;line-height:1.55}
.k20.v .lane{text-align:center}
.k20.v .lane .sb{margin-top:6px}
.k20.v .bar{background:linear-gradient(0deg,rgba(var(--c-rgb),.55),var(--c))}
.k20.v .val{text-align:center}
.k20.v .avgl{text-shadow:0 0 12px #0a0c10,0 0 6px #0a0c10}
.k20.v .lead{background:rgba(136,146,164,.55)}
.k20.v .lead.hot{background:var(--lit);box-shadow:0 0 10px rgba(112,199,186,.6)}
.k20.v .big{font-size:118px}
.k20.v .kas{text-align:center}
.k20.v .of{text-align:center}
.k20.v .chips3{justify-content:center}
.k20.v .evb{display:flex;flex-direction:column;gap:12px}
.k20.v .evb.l{align-items:flex-end}.k20.v .evb.l .ev{text-align:right}
.k20.v .evb.r{align-items:flex-start}.k20.v .evb.r .ev{text-align:left}
.k20.v .chrow{display:flex;flex-wrap:wrap;gap:8px}
.k20.v .evb.l .chrow{justify-content:flex-end}
.k20.v .chipd{font-size:20px;padding:5px 12px}
.k20.v .stamp .sb{font-size:90px}
`;
export const K20VStyle: React.FC = () => <style>{VCSS}</style>;

// tiny DOM helpers (same contract as the HTML builders: A = absolute at x,y; B = absolute box)
const H: React.FC<{ html: string; className?: string; style?: React.CSSProperties }> = ({ html, className, style }) => (
  <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
);
const A: React.FC<{ x: number; y: number; cls?: string; html?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, cls, html, style, children }) =>
  html != null ? <H className={'abs ' + (cls || '')} html={html} style={{ left: x, top: y, ...style }} />
    : <div className={'abs ' + (cls || '')} style={{ left: x, top: y, ...style }}>{children}</div>;
const B: React.FC<{ x: number; y: number; w: number; h: number; cls?: string; html?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, cls, html, style, children }) =>
  <A x={x} y={y} cls={cls} html={html} style={{ width: w, height: h, ...style }}>{children}</A>;
const Orb: React.FC<{ x: number; y: number; size: number; color: string; op: number }> = ({ x, y, size, color, op }) =>
  <div className="orb" style={{ left: x, top: y, width: size, height: size, background: color, opacity: op }} />;
const MX = 80, CW = 920;
const Header: React.FC<{ ey: string; h1: string }> = ({ ey, h1 }) => (
  <div className="abs hdr" style={{ left: MX, top: 150, width: CW }}>
    <H className="ey" html={ey} />
    <h1 dangerouslySetInnerHTML={{ __html: h1 }} />
    <div className="divider" />
  </div>
);
const Src: React.FC<{ html: string; y?: number }> = ({ html, y = 1640 }) => <A x={MX} y={y} cls="src" html={html} style={{ width: CW }} />;
const FrameV: React.FC<{ cyan?: boolean; gold?: boolean; children: React.ReactNode }> = ({ cyan, gold, children }) => (
  <div className={'k20 frame v' + (cyan ? ' cyanbg' : '')} style={gold ? ({ '--lit': '#ffd700', '--lit-rgb': '255,215,0' } as React.CSSProperties) : undefined}>{children}</div>
);

// =====================================================================================================================
// C4 token count, portrait: the horizontal bars become COLUMNS growing UP from one baseline (c4-token-count.vertical.spec.md)
// =====================================================================================================================
const C4V = { MAXH: 800, BASE: 1360, KRC: 2164, KCC: 146 };
export const ChartC4V: React.FC<{ state: 's1' | 's2' }> = ({ state }) => {
  const { t } = useK20();
  const two = state === 's2';
  const a = two ? 1 : ramp(t, 125.46, 127.02, Easing.inOut(Easing.cubic));
  const kccOn = two && t >= 165.05;
  const kccFade = two ? ramp(t, 165.05, 165.35) : 0;
  const b = two ? ramp(t, 167.58, 169.0, Easing.inOut(Easing.cubic)) : 0;
  const ha = Math.round(C4V.MAXH * a);
  const hb = Math.round(C4V.MAXH * C4V.KCC / C4V.KRC * b);
  const noteOp = two ? ramp(t, 167.9, 168.3) : 0;
  return (
    <FrameV>
      <Orb x={-280} y={380} size={680} color="#ffb000" op={0.10} />
      <Orb x={540} y={1100} size={700} color="var(--lit)" op={0.14} />
      <Header ey={'Token count &middot; read <span class="m">2026-10-18</span>'} h1={'Tokens <span class="lt">deployed</span> so far'} />
      <B x={150} y={560} w={300} h={800} cls="track amber" />
      {ha > 0 && <B x={150} y={C4V.BASE - ha} w={300} h={ha} cls="bar amber" />}
      <A x={80} y={C4V.BASE - ha - 100} cls="val amber" html={fmt(C4V.KRC * a)} style={{ width: 440 }} />
      <A x={80} y={1390} cls="lane amber" style={{ width: 440 }} html={'<div class="nm">KRC-20</div><div class="sb">Kasplex &middot; since <span class="m">2024</span></div>'} />
      <B x={630} y={560} w={300} h={800} cls="track teal" />
      {hb > 0 && <B x={630} y={C4V.BASE - hb} w={300} h={hb} cls="bar teal" />}
      {kccOn && <A x={560} y={C4V.BASE - hb - 100} cls="val teal" html={fmt(C4V.KCC * b)} style={{ width: 440, opacity: kccFade }} />}
      {kccOn && <A x={780} y={C4V.BASE - hb - 168} cls="chip teal" html="THIRD-PARTY COUNT" style={{ transform: 'translateX(-50%)', opacity: noteOp }} />}
      <A x={560} y={1390} cls="lane teal" style={{ width: 440, opacity: 0.18 + 0.82 * kccFade }}
        html={'<div class="nm">KCC-20</div><div class="sb">kaspanet/kccs &middot; <span class="m">2026</span></div>'} />
      <B x={110} y={C4V.BASE} w={860} h={3} cls="axis" />
      {two && <A x={80} y={1530} style={{ width: 920, opacity: noteOp }}
        html={'<span style="font-family:DM Sans;font-size:27px;color:var(--text-secondary)"><b>KCC-20</b> is <span style="color:var(--lit);font-weight:700">very early</span>: a third-party tracker&rsquo;s count, same scale.</span>'} />}
      <Src html={'KRC-20: Kasplex indexer API (api.kasplex.org/v1/info, tokenTotal)' + (two ? '<br>KCC-20: KasStacker (kasstacker.org), third-party count' : '') + '<br>read <span class="m">2026-10-18</span>'} />
    </FrameV>
  );
};

// =====================================================================================================================
// C15 daily transactions, portrait: time stays on x, the plot goes TALL; the two week callouts STACK above the October
// bars with leaders down to their brackets (c15-daily-transactions.vertical.spec.md). Same 50-day series as the 16:9.
// =====================================================================================================================
const SER: [string, number][] = [["2026-09-01", 131711], ["2026-09-02", 79370], ["2026-09-03", 120187], ["2026-09-04", 95121], ["2026-09-05", 88765], ["2026-09-06", 112537], ["2026-09-07", 209620], ["2026-09-08", 89640], ["2026-09-09", 165236], ["2026-09-10", 96145], ["2026-09-11", 76899], ["2026-09-12", 86356], ["2026-09-13", 88619], ["2026-09-14", 74447], ["2026-09-15", 258386], ["2026-09-16", 85130], ["2026-09-17", 174538], ["2026-09-18", 108309], ["2026-09-19", 101192], ["2026-09-20", 89860], ["2026-09-21", 76542], ["2026-09-22", 71568], ["2026-09-23", 71517], ["2026-09-24", 98828], ["2026-09-25", 208480], ["2026-09-26", 113526], ["2026-09-27", 84169], ["2026-09-28", 72844], ["2026-09-29", 67467], ["2026-09-30", 71547], ["2026-10-01", 79364], ["2026-10-02", 110225], ["2026-10-03", 83292], ["2026-10-04", 70002], ["2026-10-05", 69912], ["2026-10-06", 64663], ["2026-10-07", 64536], ["2026-10-08", 70181], ["2026-10-09", 64736], ["2026-10-10", 68288], ["2026-10-11", 66650], ["2026-10-12", 71136], ["2026-10-13", 87600], ["2026-10-14", 93887], ["2026-10-15", 74444], ["2026-10-16", 85189], ["2026-10-17", 79988], ["2026-10-18", 78486], ["2026-10-19", 82728], ["2026-10-20", 77789]];
const C15V = { X0: 150, X1: 1000, Y0: 1400, YT: 440, YMAX: 270000 };
const vy = (v: number) => C15V.Y0 - (C15V.Y0 - C15V.YT) * v / C15V.YMAX;
const vdw = (C15V.X1 - C15V.X0) / SER.length;            // 17
const vbw = Math.round(vdw * 0.66);                        // 11
const vx = (i: number) => C15V.X0 + vdw * i + vdw / 2;
const vi = (d: string) => SER.findIndex((r) => r[0] === d);
const W1 = [vi('2026-10-05'), vi('2026-10-08')], W2 = [vi('2026-10-12'), vi('2026-10-15')];
export const ChartC15V: React.FC = () => {
  const { t } = useK20();
  const T0 = 225.7, SPAN = 1.55, GROW = 0.28;
  const w2 = ramp(t, 227.42, 227.7), w1 = ramp(t, 230.84, 231.1), up = ramp(t, 231.4, 231.62);
  const avg = ramp(t, 226.75, 227.05);
  const c1 = (vx(W1[0]) + vx(W1[1])) / 2, c2 = (vx(W2[0]) + vx(W2[1])) / 2;        // 762, 881
  const l1 = Math.round(vy(160000)), l2 = l1 - 140;                                  // 831, 691
  const b1y = Math.round(vy(72000)) - 26, b2y = Math.round(vy(95000)) - 26;          // 1118, 1036
  return (
    <FrameV cyan>
      <div className="stars" />
      <Orb x={480} y={-320} size={760} color="var(--lit)" op={0.14} />
      <Orb x={-320} y={1200} size={680} color="var(--lit)" op={0.10} />
      <Header ey="Kaspalytics &middot; standard (non-coinbase)<br>accepted transactions per day" h1={'A tiny base, <span class="lt">ticking up</span>'} />
      {[0, 50000, 100000, 150000, 200000, 250000].map((v) => (
        <React.Fragment key={v}>
          <B x={C15V.X0} y={Math.round(vy(v))} w={C15V.X1 - C15V.X0} h={1} cls="gl" />
          <A x={54} y={Math.round(vy(v)) - 13} cls="yl" html={v ? (v / 1000) + 'K' : '0'} />
        </React.Fragment>
      ))}
      {[['2026-09-01', 'SEP 1'], ['2026-09-15', 'SEP 15'], ['2026-10-01', 'OCT 1'], ['2026-10-12', 'OCT 12'], ['2026-10-20', 'OCT 20']].map(([d, l]) =>
        <A key={d} x={vx(vi(d))} y={C15V.Y0 + 14} cls="xl" html={l} />)}
      {SER.map((r, i) => {
        const g = ramp(t, T0 + (SPAN * i) / SER.length, T0 + (SPAN * i) / SER.length + GROW);
        if (g <= 0) return null;
        const full = Math.max(2, Math.round(C15V.Y0 - vy(r[1])));
        const h = Math.max(2, Math.round(full * g));
        const inW2 = w2 > 0 && i >= W2[0] && i <= W2[1];
        const inW1 = w1 > 0 && i >= W1[0] && i <= W1[1];
        return <B key={i} x={Math.round(vx(i) - vbw / 2)} y={C15V.Y0 - h} w={vbw} h={h} cls={'bx' + (inW2 ? ' hot' : inW1 ? ' prev' : '')} />;
      })}
      {avg > 0 && (
        <>
          <B x={C15V.X0} y={Math.round(vy(108952)) - 1} w={Math.round((vdw * 30) * avg)} h={3} cls="avg" />
          <A x={vx(vi('2026-09-20'))} y={Math.round(vy(108952)) - 74} cls="avgl" style={{ transform: 'translateX(-50%)', textAlign: 'center', lineHeight: 1.2, opacity: avg }}
            html={'Sep average<br><b class="m" style="color:var(--text-primary);font-size:26px">108,952</b>'} />
        </>
      )}
      {w2 > 0 && (
        <>
          <B x={Math.round(vx(W2[0]) - vbw / 2 - 4)} y={b2y} w={Math.round(vx(W2[1]) - vx(W2[0]) + vbw + 8)} h={18} cls="brkt" style={{ opacity: w2 }} />
          <B x={Math.round(c2) - 1} y={l2 + 6} w={2} h={Math.round(335 * w2)} cls="lead hot" />
          <A x={c2} y={l2 - 98} cls="wl hot" style={{ opacity: w2, transform: `translateX(-62%) scale(${0.85 + 0.15 * w2})` }} html={'Oct 12 to 15 avg<br><span class="v">81,767</span>'} />
        </>
      )}
      {w1 > 0 && (
        <>
          <B x={Math.round(vx(W1[0]) - vbw / 2 - 4)} y={b1y} w={Math.round(vx(W1[1]) - vx(W1[0]) + vbw + 8)} h={18} cls="brkt" style={{ opacity: w1 }} />
          <B x={Math.round(c1) - 1} y={l1 + 6} w={2} h={Math.round((b1y - 4 - (l1 + 6)) * w1)} cls="lead" />
          <A x={c1} y={l1 - 84} cls="wl" style={{ opacity: w1, transform: 'translateX(-50%)' }} html={'Oct 5 to 8 avg<br><span class="v">67,323</span>'} />
        </>
      )}
      {up > 0 && <A x={c2 + 8} y={l2 - 158} cls="up"
        style={{ opacity: up, transform: `translateX(-62%) scale(${interpolate(up, [0, 0.6, 1], [0.6, 1.12, 1])})`, transformOrigin: '50% 50%' }} html="+21.5%" />}
      <Src y={1520} html={'Kaspalytics API, accepted transactions<br>Standard series only (coinbase excluded)<br>Sep <span class="m">1</span> to Oct <span class="m">20</span>, <span class="m">2026</span> &middot; pulled <span class="m">2026-10-21</span>'} />
    </FrameV>
  );
};

// =====================================================================================================================
// C17 supply ring, portrait: the ring centred on top, the KAS figure stacked under it (c17-supply-ring.vertical.spec.md)
// =====================================================================================================================
const C17V = { CIRC: 27763090854.57, PCT: 96.72 };
export const ChartC17V: React.FC = () => {
  const { t } = useK20();
  const a = ramp(t, 236.9, 240.16, Easing.inOut(Easing.cubic));
  const cx = 540, cy = 860, r = 300, sw = 50, C = 2 * Math.PI * r;
  const sz = 2 * r + 2 * sw, o = r + sw;
  const frac = (C17V.PCT / 100) * a;
  return (
    <FrameV cyan>
      <div className="stars" />
      <Orb x={160} y={480} size={760} color="var(--lit)" op={0.16 + 0.08 * a} />
      <Orb x={620} y={-320} size={560} color="var(--lit)" op={0.10} />
      <Header ey={'KAS supply &middot; read <span class="m">2026-10-18</span>'} h1={'Already <span class="lt">mined</span>'} />
      <div className="abs" style={{ left: cx - r - sw, top: cy - r - sw, width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
          <defs>
            <linearGradient id="k20v-rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a8efe4" /><stop offset="1" stopColor="#3f9d90" /></linearGradient>
            <filter id="k20v-gw" filterUnits="userSpaceOnUse" x="0" y="0" width={sz} height={sz}><feGaussianBlur stdDeviation="14" /></filter>
          </defs>
          <circle cx={o} cy={o} r={r} fill="none" stroke="#161c22" strokeWidth={sw} />
          <circle cx={o} cy={o} r={r} fill="none" stroke="rgba(112,199,186,.10)" strokeWidth={2} />
          {frac > 0 && (
            <>
              <circle cx={o} cy={o} r={r} fill="none" stroke="#70c7ba" strokeWidth={sw} opacity={0.55}
                strokeDasharray={`${C * frac} ${C}`} transform={`rotate(-90 ${o} ${o})`} filter="url(#k20v-gw)" />
              <circle cx={o} cy={o} r={r} fill="none" stroke="url(#k20v-rg)" strokeWidth={sw}
                strokeDasharray={`${C * frac} ${C}`} transform={`rotate(-90 ${o} ${o})`} />
            </>
          )}
        </svg>
      </div>
      <A x={260} y={778} cls="big" style={{ width: 560, textAlign: 'center' }} html={(C17V.PCT * a).toFixed(2) + '%'} />
      <A x={260} y={916} cls="under" style={{ width: 560 }} html="MINED" />
      <A x={80} y={1250} style={{ width: 920 }} html={'<div class="kas">' + ((C17V.CIRC * a) / 1e9).toFixed(2) + 'B</div><div class="of">of <span class="m">28.70B</span> KAS max supply</div>'} />
      <div className="abs chips3" style={{ left: 80, top: 1440, width: 920 }}>
        {['PROOF OF WORK', 'NO PREMINE', 'FAIR LAUNCH'].map((c) => <span key={c} className="chip">{c}</span>)}
      </div>
      <A x={80} y={1522} style={{ width: 920, textAlign: 'center' }} html={'<span style="font-family:DM Sans;font-size:24px;color:var(--text-muted)">&ldquo;No premine. No hidden allocation. Fair launch.&rdquo; (kaspa.org)</span>'} />
      <Src y={1600} html={'api.kaspa.org/info/coinsupply: circulating <span class="m">27,763,090,854.57</span><br>of max <span class="m">28,704,035,605</span> KAS &middot; read <span class="m">2026-10-18</span>'} />
    </FrameV>
  );
};

// =====================================================================================================================
// C5 board, portrait: the serpentine becomes a U (down the left column, U-turn under the board, up the right column to
// FINAL at the top right). Hop times, chip times, stamp time, landPop / labelOp / popMotion / squash = the 16:9's.
// =====================================================================================================================
type Sq = { mo?: string; dy?: string; ev?: string; x: number; y: number; small?: boolean; gold?: boolean; fin?: boolean; chips?: boolean };
const SQV = 160;
const LXc = 405, RXc = 675;
const BOARDV: Sq[] = [
  { mo: 'JUN', dy: '30', ev: 'Toccata activates', x: LXc, y: 590 },
  { mo: 'JUL', dy: '15', ev: 'conventions repo opens', x: LXc, y: 850 },
  { mo: 'AUG', dy: '20', ev: 'land as Drafts', x: LXc, y: 1110, chips: true },
  { mo: 'SEP', dy: '21', ev: 'KCC-<span class="m">0</span> Final', x: LXc, y: 1370, small: true },
  { mo: 'SEP', dy: '22', ev: 'Last Call PR for<br>KCC-<span class="m">20</span> opens', x: RXc, y: 1370 },
  { mo: 'OCT', dy: '1', ev: 'KCC-<span class="m">1</span> + KCC-<span class="m">2</span><br>to Last Call', x: RXc, y: 1110 },
  { mo: 'OCT', dy: '7', ev: 'KCC-<span class="m">20</span> joins them', x: RXc, y: 850, gold: true },
  { x: RXc, y: 590, fin: true },
];
type Hop = { from: number; to: number; t0: number; t1: number };
type BoardMode = 'p1' | 'p2' | 'final';
// the 16:9 BOARD_PLAN, verbatim (source-spine seconds)
const BOARD_PLAN: Record<BoardMode, { start: number; hops: Hop[] }> = {
  p1: { start: 0, hops: [
    { from: 0, to: 1, t0: 179.19, t1: 179.54 }, { from: 1, to: 2, t0: 182.17, t1: 182.52 },
    { from: 2, to: 3, t0: 188.13, t1: 188.45 }, { from: 3, to: 4, t0: 188.45, t1: 188.78 }] },
  p2: { start: 4, hops: [{ from: 4, to: 5, t0: 193.8, t1: 194.15 }] },
  final: { start: 5, hops: [{ from: 5, to: 6, t0: 199.46, t1: 199.8 }, { from: 6, to: 7, t0: 201.64, t1: 202.02 }] },
};
const C5_CHIP_T = [183.84, 184.9, 186.32];
const C5_STAMP_T = 202.32;
const halfV = (s: Sq) => (s.small ? 60 : SQV / 2);
const pieceAtV = (i: number) => ({ x: BOARDV[i].x + (BOARDV[i].x < 540 ? 70 : -70), y: BOARDV[i].y - 95 });

const PieceV: React.FC<{ cx: number; cy: number; s?: number; squash?: number }> = ({ cx, cy, s = 100, squash = 0 }) => (
  <div className="abs piece" style={{ left: cx - s / 2, top: cy - s / 2, width: s, height: s + 16, filter: 'drop-shadow(0 0 18px rgba(112,199,186,.55))',
    transform: `scale(${1 + squash * 0.08}, ${1 - squash * 0.1})`, transformOrigin: '50% 100%' }}>
    <svg width={s} height={s + 16} viewBox="0 0 110 126">
      <ellipse cx="55" cy="112" rx="40" ry="10" fill="rgba(0,0,0,.45)" />
      <circle cx="55" cy="63" r="46" fill="#2b6c63" />
      <circle cx="55" cy="55" r="46" fill="#0f2422" stroke="#70c7ba" strokeWidth="5" />
      <circle cx="55" cy="55" r="38" fill="none" stroke="rgba(112,199,186,.30)" strokeWidth="2" />
      <g fill="#70c7ba"><rect x="62" y="31" width="11" height="48" rx="1.5" />
        <polygon points="64,49 64,61 38,34 38,26 44,26" /><polygon points="64,49 64,61 44,84 38,84 38,76" /></g>
    </svg>
  </div>
);
const SparkV: React.FC<{ cx: number; cy: number; s: number; col: string; k: number }> = ({ cx, cy, s, col, k }) => (
  <div className="abs spark" style={{ left: cx - s / 2, top: cy - s / 2, width: s, height: s, filter: 'drop-shadow(0 0 10px rgba(255,215,0,.85))', transform: `scale(${k})` }}>
    <svg width={s} height={s} viewBox="0 0 100 100"><path d="M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0Z" fill={col} /></svg>
  </div>
);
/** the event label box on the OUTER side of the column, vertically centred on the square */
const EvBox: React.FC<{ s: Sq; cls: string; html: string; op: number; dy?: number; children?: React.ReactNode }> = ({ s, cls, html, op, dy = 0, children }) => {
  const left = s.x < 540;
  const bx = left ? s.x - halfV(s) - 22 - 232 : s.x + halfV(s) + 22;
  return (
    <div className={'abs evb' + (left ? ' l' : ' r')} style={{ left: bx, top: s.y, width: 232, transform: `translateY(calc(-50% + ${dy}px))`, opacity: op }}>
      <H className={'ev' + cls} html={html} />
      {children}
    </div>
  );
};

export const ChartC5V: React.FC<{ mode: BoardMode }> = ({ mode }) => {
  const { t } = useK20();
  const plan = BOARD_PLAN[mode];
  const isFinal = mode === 'final';
  let cur = plan.start;
  let air: { x: number; y: number; u: number } | null = null;
  const landedAt: Record<number, number> = {};
  for (let i = 0; i <= plan.start; i++) landedAt[i] = -1e9;
  if (mode === 'p1') landedAt[0] = 177.06;
  if (plan.start >= 4) landedAt[3] = -1e9;
  for (const h of plan.hops) {
    if (t >= h.t1) { cur = h.to; landedAt[h.to] = h.t1; }
    else if (t >= h.t0) {
      const u = (t - h.t0) / (h.t1 - h.t0);
      const a = pieceAtV(h.from), b = pieceAtV(h.to);
      const e = Easing.inOut(Easing.quad)(u);
      const across = BOARDV[h.from].x !== BOARDV[h.to].x;
      // across the columns (SEP 21 -> SEP 22): the 16:9 lift; within a column: no lift, the piece BOWS INWARD
      const bow = across ? 0 : (BOARDV[h.from].x < 540 ? 40 : -40) * Math.sin(Math.PI * u);
      air = { x: a.x + (b.x - a.x) * e + bow, y: a.y + (b.y - a.y) * e - (across ? Math.sin(Math.PI * u) * 85 : 0), u };
      cur = h.from;
      break;
    } else break;
  }
  const landed = (i: number) => landedAt[i] !== undefined && t >= landedAt[i];
  const finLanded = isFinal && landed(7);
  const stamp = isFinal && t >= C5_STAMP_T;
  const dim = stamp ? interpolate(t, [C5_STAMP_T, C5_STAMP_T + 0.2], [1, 0.24], clamp) : 1;
  const landPop = (i: number) => { const dt = t - (landedAt[i] ?? -1e9); return dt < 0.3 ? interpolate(dt, [0, 0.1, 0.3], [0.86, 1.08, 1], clamp) : 1; };
  const labelOp = (i: number) => { const dt = t - (landedAt[i] ?? -1e9); return interpolate(dt, [0, 0.2], [0, 1], clamp); };
  const pipOn = (i: number) => landed(i + 1);
  const chipsOut = mode === 'p1' ? C5_CHIP_T.filter((c) => t >= c).length : 3;
  const curSq = air ? -1 : cur;

  const board: React.ReactNode[] = [];
  // pips between consecutive same-COLUMN squares
  for (let i = 0; i < BOARDV.length - 1; i++) {
    const a = BOARDV[i], b = BOARDV[i + 1];
    if (a.x !== b.x) continue;
    const dir = Math.sign(b.y - a.y);
    const y1 = a.y + dir * (halfV(a) + 18), y2 = b.y - dir * (halfV(b) + 18);
    for (let k = 1; k < 4; k++) {
      const u = k / 4;
      board.push(<B key={`p${i}-${k}`} x={a.x - 7} y={y1 + (y2 - y1) * u - 7} w={14} h={14} cls={'pip' + (pipOn(i) ? ' on' : '')} />);
    }
  }
  // the U-turn under the board (SEP 21 -> SEP 22)
  for (let j = 1; j < 6; j++) {
    const th = Math.PI - (Math.PI * j) / 6;
    board.push(<B key={`u${j}`} x={540 + Math.cos(th) * 135 - 7} y={1400 + Math.sin(th) * 150 - 7} w={14} h={14} cls={'pip' + (isFinal || landed(4) ? ' on' : '')} />);
  }
  BOARDV.forEach((s, i) => {
    const sz = s.small ? 120 : SQV;
    if (s.fin) { if (!finLanded) board.push(<B key="fin" x={s.x - sz / 2} y={s.y - sz / 2} w={sz} h={sz} cls="sq fin" html={'<div class="fw">FINAL</div><div class="fs">ahead</div>'} />); return; }
    const L = landed(i);
    const cls = 'sq' + (L ? (i === curSq ? (s.gold ? ' goldsq' : ' cur') : ' past') : ' blank');
    const inner = L ? `<div class="mo"${s.small ? ' style="font-size:22px"' : ''}>${s.mo}</div><div class="dy"${s.small ? ' style="font-size:50px"' : ''}>${s.dy}</div>` : '';
    board.push(<B key={`s${i}`} x={s.x - sz / 2} y={s.y - sz / 2} w={sz} h={sz} cls={cls} html={inner} style={{ transform: `scale(${L ? landPop(i) : 1})` }} />);
    if (L) {
      let ev = s.ev!;
      let op = labelOp(i);
      if (i === 5 && mode === 'p2') {
        const k1 = t >= 195.68, k2 = t >= 196.64;
        ev = `<span style="opacity:${k1 ? 1 : 0}">KCC-<span class="m">1</span></span><span style="opacity:${k2 ? 1 : 0}"> + KCC-<span class="m">2</span></span><br>to Last Call`;
      }
      if (i === 6 && isFinal) op = interpolate(t, [200.9, 201.1], [0, 1], clamp);
      board.push(
        <EvBox key={`e${i}`} s={s} cls={s.small ? ' mut' : ''} html={ev} op={op} dy={(1 - op) * 10}>
          {s.chips && (
            <div className="chrow">
              {['KCC-1', 'KCC-2', 'KCC-20'].map((c, ci) => {
                const at = mode === 'p1' ? C5_CHIP_T[ci] : -1e9;
                const dt = t - at;
                return <span key={c} className="chipd" style={{ visibility: ci < chipsOut ? 'visible' : 'hidden', display: 'inline-block',
                  transform: `translateY(${interpolate(dt, [0, 0.12, 0.25], [-22, 4, 0], clamp)}px)` }}>{c}</span>;
              })}
            </div>
          )}
        </EvBox>,
      );
    }
  });

  const finGroup: React.ReactNode[] = [];
  if (finLanded) {
    const s = BOARDV[7];
    finGroup.push(<B key="halo" x={s.x - 200} y={s.y - 200} w={400} h={400} cls="halo" style={{ opacity: labelOp(7) }} />);
    finGroup.push(<B key="fsq" x={s.x - SQV / 2} y={s.y - SQV / 2} w={SQV} h={SQV} cls="sq finlit" html={'<div class="fw">FINAL</div><div class="fd">OCT 21</div>'} style={{ transform: `scale(${landPop(7)})` }} />);
    finGroup.push(
      <EvBox key="fev" s={s} cls="" html="go Final" op={labelOp(7)}>
        <div className="chrow">{['KCC-1', 'KCC-2', 'KCC-20'].map((c) => <span key={c} className="chipd">{c}</span>)}</div>
      </EvBox>,
    );
  }
  let piece: React.ReactNode;
  if (air) {
    piece = <PieceV cx={air.x} cy={air.y} />;
  } else {
    const P = pieceAtV(cur);
    const dt = t - (landedAt[cur] ?? -1e9);
    const squash = dt >= 0 && dt < 0.18 ? Math.sin((Math.PI * dt) / 0.18) : 0;
    piece = <PieceV cx={P.x} cy={P.y} squash={squash} />;
  }
  let stampEl: React.ReactNode = null;
  let push = 1;
  const SCX = 540, SCY = 1010;
  if (stamp) {
    const dt = t - C5_STAMP_T;
    const pm = popMotion(dt);
    const w = 900, h = 380;
    push = 1 + 0.06 * ramp(t, C5_STAMP_T + 0.3, C5_STAMP_T + 2.0, Easing.inOut(Easing.sin));
    const sk = (d: number) => interpolate(dt, [d, d + 0.15, d + 0.3], [0, 1.25, 1], clamp);
    stampEl = (
      <>
        <B x={SCX - w / 2 - 90} y={SCY - h / 2 - 200} w={w + 180} h={h + 400} cls="sglow" style={{ opacity: ramp(t, C5_STAMP_T, C5_STAMP_T + 0.2) }} />
        <B x={SCX - w / 2} y={SCY - h / 2} w={w} h={h} cls="stamp"
          style={{ transform: `rotate(${-6 + pm.rot}deg) scale(${pm.s / 1.1})`, filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined }}
          html={'<div class="su">UPDATE</div><div class="sr"></div><div class="sb">KCC-<span class="m">20</span> IS <span class="go">FINAL</span></div><div class="sd">OCT 21, 2026</div>'} />
        <SparkV cx={190} cy={770} s={60} col="#fff3b0" k={sk(0.05)} />
        <SparkV cx={975} cy={880} s={40} col="#ffd700" k={sk(0.12)} />
        <SparkV cx={880} cy={1260} s={56} col="#fff3b0" k={sk(0.08)} />
        <SparkV cx={130} cy={1150} s={34} col="#ffd700" k={sk(0.16)} />
      </>
    );
  }
  const srcLine = 'kaspanet/kccs commits + PRs #<span class="m">2</span>, #<span class="m">3</span>, #<span class="m">5</span>, #<span class="m">25</span>, #<span class="m">31</span>, #<span class="m">32</span>, #<span class="m">33</span><br>rusty-kaspa v<span class="m">2.0.0</span> release &middot; read <span class="m">2026-10-18</span>'
    + (isFinal ? '<br>PRs #<span class="m">39</span>, #<span class="m">40</span>, #<span class="m">41</span> merged <span class="m">2026-10-21</span>' : '');
  return (
    <FrameV gold>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${SCX}px ${SCY}px` }}>
        <Orb x={560} y={-300} size={640} color="var(--lit)" op={0.12} />
        <Orb x={-320} y={1180} size={620} color="#70c7ba" op={0.08} />
        <Header ey={'kaspanet/kccs &middot; the timeline &middot; <span class="m">2026</span>'} h1={'Square by square,<br>toward <span class="lt">Final</span>'} />
        <div style={{ position: 'absolute', inset: 0, opacity: dim }}>{board}</div>
        {finGroup}
        {piece}
        {stampEl}
        <Src html={srcLine} />
      </AbsoluteFill>
    </FrameV>
  );
};

// =====================================================================================================================
// KINETIC TEXT, portrait (overlays.md section 2): the kt-side-panel has no side to sit on in a 1080-wide frame, so it
// becomes a TOP BAND (same panel, same type, same slide / rise / hover / rock motion, sliding down from off-frame) and the
// diagram is reframed into the frame below it (the comp's job). kt-keyword-pop: the same pop at 79% of the frame height.
// =====================================================================================================================
const KT_KEY = ACCENT.kaspa;
export const PANEL_H_V = 440;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const KtTopPanelV: React.FC<{ t0: number; eyebrow: string; lines: string[] }> = ({ t0, eyebrow, lines }) => {
  const { t } = useK20();
  const dt = t - t0;
  if (dt < 0) return null;
  const slide = interpolate(dt, [0, 0.5], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const off = -PANEL_H_V * slide;
  const tr = dt - 0.23;
  const rise = interpolate(tr, [0, 0.33], [200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(tr, [0, 0.15, 0.33], [0.8, 1.1, 1.0], clamp);
  const blur = interpolate(tr, [0, 0.25], [6, 0], clamp);
  const hv = Math.max(0, tr - 0.33);
  const seg = Math.floor(hv / 0.7), u = Easing.inOut(Easing.sin)((hv % 0.7) / 0.7);
  const tx = (k: number) => (hash(k * 2 + t0) * 2 - 1) * 18, ty = (k: number) => (hash(k * 2 + 1 + t0) * 2 - 1) * 13;
  const hx = seg === 0 && hv === 0 ? 0 : tx(seg) + (tx(seg + 1) - tx(seg)) * u;
  const hy = seg === 0 && hv === 0 ? 0 : ty(seg) + (ty(seg + 1) - ty(seg)) * u;
  const rock = 0.5 * Math.sin((2 * Math.PI * hv) / 3.0);
  return (
    <div style={{ position: 'absolute', left: 0, top: off, width: 1080, height: PANEL_H_V, overflow: 'hidden',
      background: 'linear-gradient(160deg,#10161c 0%,#0a0d12 60%,#0b1414 100%)', boxShadow: '0 30px 60px rgba(0,0,0,.55)' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: 'absolute', width: 900, height: 900, left: 60, top: -380, borderRadius: '50%', background: 'rgba(112,199,186,.10)', filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: `linear-gradient(90deg, rgba(112,199,186,0), ${KT_KEY}, rgba(112,199,186,0))` }} />
      {tr >= 0 && (
        <div style={{ position: 'absolute', left: 90, right: 70, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transform: `translate(${hx}px, ${rise + hy}px) scale(${sc}) rotate(${rock}deg)`, transformOrigin: '40% 50%', filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 32, letterSpacing: '.22em', color: KT_KEY, marginBottom: 16 }}>{eyebrow}</div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 84, lineHeight: 1.02, color: '#e8eaf0', letterSpacing: '-.01em' }}
              dangerouslySetInnerHTML={{ __html: l.replace(/\[([^\]]+)\]/g, `<span style="color:${KT_KEY}">$1</span>`) }} />
          ))}
          <div style={{ width: 90, height: 5, borderRadius: 3, marginTop: 24, background: `linear-gradient(90deg, ${KT_KEY}, rgba(112,199,186,.2))` }} />
        </div>
      )}
    </div>
  );
};
export const KtKeywordPopV: React.FC<{ t0: number; t1: number; text: string; cy?: number }> = ({ t0, t1, text, cy = 1517 }) => {
  const { t } = useK20();
  if (t < t0 || t >= t1) return null;
  const pm = popMotion(t - t0);
  return (
    <div style={{ position: 'absolute', left: 540, top: cy, transform: `translate(-50%, -50%) scale(${pm.s}) rotate(${pm.rot}deg)`,
      filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined, whiteSpace: 'nowrap', padding: '18px 40px 22px', borderRadius: 18, textAlign: 'center',
      background: 'rgba(10,12,16,.90)', border: `3px solid ${KT_KEY}`, boxShadow: '0 0 50px rgba(112,199,186,.35), 0 18px 40px rgba(0,0,0,.6)',
      fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 70, lineHeight: 1.05, color: '#e8eaf0', letterSpacing: '.005em' }}
      dangerouslySetInnerHTML={{ __html: text.replace(/\[([^\]]+)\]/g, `<span style="color:${KT_KEY}">$1</span>`) }} />
  );
};
