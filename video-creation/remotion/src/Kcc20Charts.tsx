// Kcc20Charts.tsx: kcc20's code-built visuals (comp-build.md section 7 + overlays.md section 2).
// - the five Type 1 ANIMATED charts, ported 1:1 from their HTML sources in media/kcc20/assets/{charts,diagrams}/
//   (same absolute geometry, same stylesheet tokens), driven by the comp's ABSOLUTE clock (comp-build 6a), never a PNG:
//   C4 token count · C15 daily transactions · C17 supply ring · C5 board-game timeline · C5 final square + stamp
// - the 2023 kinetic-text devices (kt-side-panel, kt-keyword-pop) and the H0 motion card
// Every cue is a SOURCE-spine second (the comp publishes the source time through K20Clock).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600', '800'], subsets: ['latin'] });

/** The comp's absolute clock: `abs` = composition frame, `t` = SOURCE-spine seconds (held inside a spine pause). */
export const K20Clock = React.createContext<{ abs: number; t: number }>({ abs: 0, t: 0 });
export const useK20 = () => React.useContext(K20Clock);

export const ACCENT = { kaspa: '#70c7ba', cyan: '#00c2ff', gold: '#ffd700', amber: '#ffb000' };

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** eased 0..1 between two source times */
export const ramp = (t: number, a: number, b: number, ease: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// ---------------------------------------------------------------------------------------------------------------------
// THE STYLESHEET: the canonical longform-edited container stylesheet + the kcc20 chart-builder layer, verbatim tokens from
// the HTML sources, scoped under .k20 so nothing leaks into the rest of the comp.
// ---------------------------------------------------------------------------------------------------------------------
const CSS = `
.k20{--bg-deep:#0a0c10;--bg-card:#12151c;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;--accent-red:#ff4060;
  --text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330;--lit:#70c7ba;--lit-rgb:112,199,186}
.k20 *{margin:0;padding:0;box-sizing:border-box}
.k20.frame{position:absolute;left:0;top:0;width:1920px;height:1080px;background:var(--bg-deep);overflow:hidden;color:var(--text-primary);font-family:'DM Sans',sans-serif}
.k20.frame.cyanbg{background:radial-gradient(ellipse at 50% 120%,#0d2a27 0%,#0a0c10 55%)}
.k20.frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.k20 .orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0}
.k20 .abs{position:absolute;z-index:2;--c:var(--lit);--c-rgb:var(--lit-rgb)}
.k20 .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);margin-bottom:16px}
.k20 h1{font-family:'Playfair Display',serif;font-weight:900;font-size:70px;line-height:1.07;letter-spacing:-.02em;color:var(--text-primary);white-space:nowrap}
.k20 .divider{width:66px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--lit),rgba(var(--lit-rgb),.28));margin:26px 0 0}
.k20 .m{font-family:'JetBrains Mono',monospace;font-weight:600}
.k20 b{color:var(--text-primary);font-weight:700}
.k20 .lt{color:var(--lit)}
.k20 .src{font-family:'JetBrains Mono',monospace;font-size:19px;color:var(--text-muted);letter-spacing:.01em;white-space:nowrap}
.k20 .amber{--c:#ffb000;--c-rgb:255,176,0}
.k20 .teal{--c:#70c7ba;--c-rgb:112,199,186}
.k20 .chip{display:inline-flex;align-items:center;gap:10px;padding:7px 18px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-weight:600;
  font-size:22px;letter-spacing:.05em;white-space:nowrap;border:1.5px solid rgba(var(--c-rgb),.55);color:var(--c);background:rgba(var(--c-rgb),.10)}
.k20 .ghost{opacity:.18}
/* C4 lanes */
.k20 .lane .nm{font-family:'JetBrains Mono';font-weight:800;font-size:58px;color:var(--c);letter-spacing:.01em}
.k20 .lane .sb{font-family:'DM Sans';font-size:26px;color:var(--text-secondary);margin-top:4px}
.k20 .track{border-radius:16px;background:rgba(255,255,255,.025);border:2px dashed var(--border)}
.k20 .bar{border-radius:16px;background:linear-gradient(90deg,rgba(var(--c-rgb),.55),var(--c));box-shadow:0 0 50px rgba(var(--c-rgb),.40)}
.k20 .val{font-family:'JetBrains Mono';font-weight:800;font-size:76px;color:var(--c);line-height:1}
.k20 .axis{background:var(--text-muted);width:3px}
/* C15 / C17 */
.k20 .stars{position:absolute;inset:0;z-index:0;opacity:.55;
  background-image:radial-gradient(1px 1px at 12% 22%,#cfeee9 50%,transparent 51%),radial-gradient(1px 1px at 33% 12%,#cfeee9 50%,transparent 51%),
  radial-gradient(1.5px 1.5px at 58% 18%,#cfeee9 50%,transparent 51%),radial-gradient(1px 1px at 77% 9%,#cfeee9 50%,transparent 51%),
  radial-gradient(1px 1px at 91% 27%,#cfeee9 50%,transparent 51%),radial-gradient(1px 1px at 46% 31%,#cfeee9 50%,transparent 51%),
  radial-gradient(1.5px 1.5px at 69% 36%,#cfeee9 50%,transparent 51%),radial-gradient(1px 1px at 22% 40%,#cfeee9 50%,transparent 51%),
  radial-gradient(1px 1px at 86% 45%,#cfeee9 50%,transparent 51%),radial-gradient(1px 1px at 5% 8%,#cfeee9 50%,transparent 51%)}
.k20 .gl{background:rgba(136,146,164,.10);height:1px}
.k20 .yl{font-family:'JetBrains Mono';font-weight:600;font-size:20px;color:var(--text-muted);text-align:right;width:80px}
.k20 .xl{font-family:'JetBrains Mono';font-weight:600;font-size:20px;color:var(--text-muted);transform:translateX(-50%);white-space:nowrap}
.k20 .bx{border-radius:5px 5px 0 0;background:linear-gradient(180deg,rgba(112,199,186,.60),rgba(112,199,186,.22))}
.k20 .bx.hot{background:linear-gradient(180deg,#a8efe4,#70c7ba);box-shadow:0 0 22px rgba(112,199,186,.75)}
.k20 .bx.prev{background:linear-gradient(180deg,rgba(168,239,228,.85),rgba(112,199,186,.45))}
.k20 .avg{border-top:3px dashed rgba(232,234,240,.55)}
.k20 .avgl{font-family:'DM Sans';font-size:22px;color:var(--text-secondary);white-space:nowrap}
.k20 .brkt{border:3px solid var(--c);border-bottom:none;border-radius:8px 8px 0 0;height:18px}
.k20 .wl{font-family:'DM Sans';font-size:22px;color:var(--text-secondary);white-space:nowrap;text-align:center;line-height:1.25}
.k20 .wl .v{font-family:'JetBrains Mono';font-weight:800;font-size:40px;color:var(--text-primary)}
.k20 .wl.hot .v{color:var(--lit);font-size:48px;text-shadow:0 0 24px rgba(112,199,186,.6)}
.k20 .up{font-family:'JetBrains Mono';font-weight:800;font-size:30px;color:#0a0c10;background:var(--lit);padding:6px 16px;border-radius:12px;box-shadow:0 0 30px rgba(112,199,186,.6)}
.k20 .big{font-family:'JetBrains Mono';font-weight:800;font-size:112px;line-height:1;color:var(--text-primary);text-shadow:0 0 40px rgba(112,199,186,.45)}
.k20 .under{font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.2em;color:var(--lit);text-align:center}
.k20 .kas{font-family:'JetBrains Mono';font-weight:800;font-size:96px;color:var(--lit);line-height:1;text-shadow:0 0 34px rgba(112,199,186,.5)}
.k20 .of{font-family:'DM Sans';font-size:34px;color:var(--text-secondary);margin-top:14px}
.k20 .of .m{color:var(--text-primary)}
.k20 .chips3{display:flex;gap:14px;flex-wrap:wrap}
.k20 .chips3 .chip{font-size:22px;padding:10px 20px}
/* C5 board */
.k20 .sq{border-radius:30px;background:#171b25;border:3px solid #2a3142;box-shadow:0 14px 0 #0c0f15,0 22px 40px rgba(0,0,0,.45);
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.k20 .sq .mo{font-family:'JetBrains Mono';font-weight:800;font-size:30px;letter-spacing:.08em;color:var(--text-secondary)}
.k20 .sq .dy{font-family:'JetBrains Mono';font-weight:800;font-size:70px;line-height:1;color:var(--text-primary)}
.k20 .sq.blank{background:rgba(23,27,37,.55);border:3px dashed #2a3142;box-shadow:0 14px 0 rgba(12,15,21,.6)}
.k20 .sq.past{border-color:rgba(255,215,0,.65);background:linear-gradient(160deg,#2a2610,#191a17)}
.k20 .sq.past .mo{color:#e8c95a}
.k20 .sq.cur{border-color:#ffd700;background:linear-gradient(160deg,#3a3210,#1d1c14);box-shadow:0 14px 0 #6b5a00,0 0 70px rgba(255,215,0,.45)}
.k20 .sq.cur .mo{color:#ffd700}
.k20 .sq.goldsq{background:linear-gradient(160deg,#ffe45c,#ffc400);border-color:#fff1a0;box-shadow:0 14px 0 #9a7a00,0 0 90px rgba(255,215,0,.6)}
.k20 .sq.goldsq .mo,.k20 .sq.goldsq .dy{color:#1a1500}
.k20 .sq.fin{background:rgba(23,27,37,.55);border:3px dashed rgba(255,215,0,.40);box-shadow:0 14px 0 rgba(12,15,21,.6)}
.k20 .sq.fin .fw{font-family:'DM Sans';font-weight:800;font-size:34px;letter-spacing:.14em;color:rgba(255,215,0,.55)}
.k20 .sq.fin .fs{font-family:'DM Sans';font-size:22px;color:var(--text-muted);margin-top:6px}
.k20 .ev{font-family:'DM Sans';font-weight:700;font-size:27px;line-height:1.25;color:var(--text-primary);text-align:center}
.k20 .ev.mut{color:var(--text-secondary);font-weight:500;font-size:24px}
.k20 .pip{border-radius:50%;background:#2a3142}
.k20 .pip.on{background:#ffd700;box-shadow:0 0 14px rgba(255,215,0,.7)}
.k20 .chipd{font-family:'JetBrains Mono';font-weight:800;font-size:21px;padding:6px 14px;border-radius:10px;border:2px solid rgba(255,215,0,.7);
  color:#ffd700;background:rgba(255,215,0,.10);white-space:nowrap}
.k20 .piece{z-index:5}
.k20 .sq.finlit{background:linear-gradient(160deg,#ffe45c,#ffc400);border:3px solid #fff1a0;box-shadow:0 14px 0 #9a7a00}
.k20 .halo{z-index:1;border-radius:50%;background:radial-gradient(closest-side,rgba(255,215,0,.42),rgba(255,215,0,.16) 55%,rgba(255,215,0,0))}
.k20 .sq.finlit .fw{font-family:'DM Sans';font-weight:800;font-size:40px;letter-spacing:.12em;color:#1a1500;padding-left:.12em}
.k20 .sq.finlit .fd{font-family:'JetBrains Mono';font-weight:800;font-size:27px;letter-spacing:.06em;color:#3a3000;margin-top:4px}
.k20 .stamp{z-index:6;border-radius:26px;background:linear-gradient(160deg,#26210a,#100f0a);border:6px solid #ffd700;
  box-shadow:0 0 0 10px #0a0c10,0 0 0 13px rgba(255,215,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.k20 .stamp .su{font-family:'DM Sans';font-weight:800;font-size:30px;letter-spacing:.42em;padding-left:.42em;color:#ffd700}
.k20 .stamp .sr{width:120px;height:4px;border-radius:2px;background:linear-gradient(90deg,rgba(255,215,0,.25),#ffd700,rgba(255,215,0,.25));margin:20px 0 18px}
.k20 .stamp .sb{font-family:'DM Sans';font-weight:800;font-size:96px;line-height:1;letter-spacing:.01em;color:var(--text-primary);white-space:nowrap}
.k20 .stamp .sb .go{color:#ffd700}
.k20 .stamp .sd{font-family:'JetBrains Mono';font-weight:800;font-size:38px;letter-spacing:.10em;color:#ffd700;margin-top:24px}
.k20 .spark{z-index:7}
.k20 .sglow{z-index:5;border-radius:50%;background:radial-gradient(closest-side,rgba(255,215,0,.26),rgba(255,215,0,.08) 60%,rgba(255,215,0,0))}
`;
export const K20Style: React.FC = () => <style>{CSS}</style>;

// ---------------------------------------------------------------------------------------------------------------------
// tiny DOM helpers mirroring the HTML builders (A = absolute at x,y; B = absolute box)
// ---------------------------------------------------------------------------------------------------------------------
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
const Header: React.FC<{ ey: string; h1: string }> = ({ ey, h1 }) => (
  <div className="abs hdr" style={{ left: 120, top: 66 }}>
    <H className="ey" html={ey} />
    <h1 dangerouslySetInnerHTML={{ __html: h1 }} />
    <div className="divider" />
  </div>
);
const Src: React.FC<{ html: string }> = ({ html }) => <A x={120} y={1022} cls="src" html={html} />;
const Frame: React.FC<{ cyan?: boolean; gold?: boolean; children: React.ReactNode }> = ({ cyan, gold, children }) => (
  // CH4 (the C5 board) lights in gold: the HTML source's own :root --lit (COVER-PLAN chapter_themes CH4 accent)
  <div className={'k20 frame' + (cyan ? ' cyanbg' : '')} style={gold ? ({ '--lit': '#ffd700', '--lit-rgb': '255,215,0' } as React.CSSProperties) : undefined}>{children}</div>
);

// =====================================================================================================================
// C4: token count (CH3). s1 = the amber KRC-20 bar grows + counts up on 'Around' 125.46 -> 'tokens' 127.02;
// s2 (the MELT callback) = KRC-20 full, the KCC-20 lane lights on 'KCC-20' and its teal bar grows on 'Roughly' 167.58.
// =====================================================================================================================
const C4_MAXW = 900, C4_X0 = 640, C4_KRC = 2164, C4_KCC = 146;
export const ChartC4: React.FC<{ state: 's1' | 's2' }> = ({ state }) => {
  const { t } = useK20();
  const two = state === 's2';
  const a = two ? 1 : ramp(t, 125.46, 127.02, Easing.inOut(Easing.cubic));
  const kccOn = two && t >= 165.05;
  const kccFade = two ? ramp(t, 165.05, 165.35) : 0;
  const b = two ? ramp(t, 167.58, 169.0, Easing.inOut(Easing.cubic)) : 0;
  const wa = Math.round(C4_MAXW * a);
  const wb = Math.round(C4_MAXW * C4_KCC / C4_KRC * b);
  const noteOp = two ? ramp(t, 167.9, 168.3) : 0;
  return (
    <Frame>
      <Orb x={1400} y={-260} size={640} color="#ffb000" op={0.10} />
      <Orb x={-260} y={640} size={640} color="var(--lit)" op={0.14} />
      <Header ey={'Token count &middot; read <span class="m">2026-10-18</span>'} h1={'Tokens <span class="lt">deployed</span> so far'} />
      <A x={120} y={372} cls="lane amber" html={'<div class="nm">KRC-20</div><div class="sb">Kasplex &middot; since <span class="m">2024</span></div>'} />
      <B x={C4_X0} y={370} w={C4_MAXW} h={120} cls="track amber" />
      {wa > 0 && <B x={C4_X0} y={370} w={wa} h={120} cls="bar amber" />}
      <A x={C4_X0 + Math.max(wa, 0) + 34} y={392} cls="val amber" html={fmt(C4_KRC * a)} />
      <A x={120} y={602} cls="lane teal" style={{ opacity: 0.18 + 0.82 * kccFade }}
        html={'<div class="nm">KCC-20</div><div class="sb">kaspanet/kccs &middot; <span class="m">2026</span></div>'} />
      <B x={C4_X0} y={600} w={C4_MAXW} h={120} cls="track teal" />
      {wb > 0 && <B x={C4_X0} y={600} w={wb} h={120} cls="bar teal" />}
      {kccOn && <A x={C4_X0 + wb + 34} y={622} cls="val teal" html={fmt(C4_KCC * b)} style={{ opacity: kccFade }} />}
      {kccOn && <A x={C4_X0 + wb + 34 + 190} y={640} cls="chip teal" html="THIRD-PARTY COUNT" style={{ opacity: noteOp }} />}
      <B x={C4_X0 - 3} y={340} w={3} h={410} cls="axis" />
      {two && <A x={C4_X0} y={770} style={{ opacity: noteOp }}
        html={'<span style="font-family:DM Sans;font-size:26px;color:var(--text-secondary)"><b>KCC-20</b> is <span style="color:var(--lit);font-weight:700">very early</span>: a third-party tracker&rsquo;s count, same scale.</span>'} />}
      <Src html={'KRC-20: Kasplex indexer API (api.kasplex.org/v1/info, tokenTotal)' + (two ? ' &middot; KCC-20: KasStacker (kasstacker.org), third-party count' : '') + ' &middot; read <span class="m">2026-10-18</span>'} />
    </Frame>
  );
};

// =====================================================================================================================
// C15: daily standard transactions (CH5). Bars DRAW left to right from 'Usage' 225.48; Sep average marked as September
// completes; the Oct 12 to 15 bracket + 81,767 land ON '82' 227.42; the Oct 5 to 8 bracket on 'Up' 230.84 and the
// +21.5% chip ON '22' 231.40.
// =====================================================================================================================
const SER: [string, number][] = [["2026-09-01", 131711], ["2026-09-02", 79370], ["2026-09-03", 120187], ["2026-09-04", 95121], ["2026-09-05", 88765], ["2026-09-06", 112537], ["2026-09-07", 209620], ["2026-09-08", 89640], ["2026-09-09", 165236], ["2026-09-10", 96145], ["2026-09-11", 76899], ["2026-09-12", 86356], ["2026-09-13", 88619], ["2026-09-14", 74447], ["2026-09-15", 258386], ["2026-09-16", 85130], ["2026-09-17", 174538], ["2026-09-18", 108309], ["2026-09-19", 101192], ["2026-09-20", 89860], ["2026-09-21", 76542], ["2026-09-22", 71568], ["2026-09-23", 71517], ["2026-09-24", 98828], ["2026-09-25", 208480], ["2026-09-26", 113526], ["2026-09-27", 84169], ["2026-09-28", 72844], ["2026-09-29", 67467], ["2026-09-30", 71547], ["2026-10-01", 79364], ["2026-10-02", 110225], ["2026-10-03", 83292], ["2026-10-04", 70002], ["2026-10-05", 69912], ["2026-10-06", 64663], ["2026-10-07", 64536], ["2026-10-08", 70181], ["2026-10-09", 64736], ["2026-10-10", 68288], ["2026-10-11", 66650], ["2026-10-12", 71136], ["2026-10-13", 87600], ["2026-10-14", 93887], ["2026-10-15", 74444], ["2026-10-16", 85189], ["2026-10-17", 79988], ["2026-10-18", 78486], ["2026-10-19", 82728], ["2026-10-20", 77789]];
const C15 = { X0: 230, X1: 1800, Y0: 905, YT: 300, YMAX: 270000 };
const c15y = (v: number) => C15.Y0 - (C15.Y0 - C15.YT) * v / C15.YMAX;
const c15dw = (C15.X1 - C15.X0) / SER.length;
const c15bw = Math.round(c15dw * 0.66);
const c15x = (i: number) => C15.X0 + c15dw * i + c15dw / 2;
const c15i = (d: string) => SER.findIndex((r) => r[0] === d);
const C15_W1 = [c15i('2026-10-05'), c15i('2026-10-08')], C15_W2 = [c15i('2026-10-12'), c15i('2026-10-15')];
export const ChartC15: React.FC = () => {
  const { t } = useK20();
  const T0 = 225.7, SPAN = 1.55, GROW = 0.28;
  const w2 = ramp(t, 227.42, 227.7), w1 = ramp(t, 230.84, 231.1), up = ramp(t, 231.4, 231.62);
  const avg = ramp(t, 226.75, 227.05);
  return (
    <Frame cyan>
      <div className="stars" />
      <Orb x={1300} y={-320} size={760} color="var(--lit)" op={0.14} />
      <Orb x={-300} y={700} size={620} color="var(--lit)" op={0.10} />
      <Header ey="Kaspalytics &middot; standard (non-coinbase) accepted transactions per day" h1={'A tiny base, <span class="lt">ticking up</span>'} />
      {[0, 50000, 100000, 150000, 200000, 250000].map((v) => (
        <React.Fragment key={v}>
          <B x={C15.X0} y={Math.round(c15y(v))} w={C15.X1 - C15.X0} h={1} cls="gl" />
          <A x={C15.X0 - 96} y={Math.round(c15y(v)) - 13} cls="yl" html={v ? (v / 1000) + 'K' : '0'} />
        </React.Fragment>
      ))}
      {[['2026-09-01', 'SEP 1'], ['2026-09-15', 'SEP 15'], ['2026-10-01', 'OCT 1'], ['2026-10-12', 'OCT 12'], ['2026-10-20', 'OCT 20']].map(([d, l]) =>
        <A key={d} x={c15x(c15i(d))} y={C15.Y0 + 14} cls="xl" html={l} />)}
      {SER.map((r, i) => {
        const g = ramp(t, T0 + (SPAN * i) / SER.length, T0 + (SPAN * i) / SER.length + GROW);
        if (g <= 0) return null;
        const full = Math.max(2, Math.round(C15.Y0 - c15y(r[1])));
        const h = Math.max(2, Math.round(full * g));
        const inW2 = w2 > 0 && i >= C15_W2[0] && i <= C15_W2[1];
        const inW1 = w1 > 0 && i >= C15_W1[0] && i <= C15_W1[1];
        return <B key={i} x={Math.round(c15x(i) - c15bw / 2)} y={C15.Y0 - h} w={c15bw} h={h} cls={'bx' + (inW2 ? ' hot' : inW1 ? ' prev' : '')} />;
      })}
      {avg > 0 && (
        <>
          <B x={C15.X0} y={Math.round(c15y(108952)) - 1} w={Math.round((c15dw * 30) * avg)} h={3} cls="avg" />
          <A x={c15x(c15i('2026-09-20'))} y={Math.round(c15y(108952)) - 74} cls="avgl" style={{ transform: 'translateX(-50%)', textAlign: 'center', lineHeight: 1.2, opacity: avg }}
            html={'Sep average<br><b class="m" style="color:var(--text-primary);font-size:26px">108,952</b>'} />
        </>
      )}
      {w2 > 0 && (
        <>
          <B x={Math.round(c15x(C15_W2[0]) - c15bw / 2 - 4)} y={Math.round(c15y(95000)) - 26} w={Math.round(c15x(C15_W2[1]) - c15x(C15_W2[0]) + c15bw + 8)} h={18} cls="brkt" style={{ opacity: w2 }} />
          <A x={(c15x(C15_W2[0]) + c15x(C15_W2[1])) / 2} y={Math.round(c15y(95000)) - 200} cls="wl hot"
            style={{ opacity: w2, transform: `translateX(-50%) scale(${0.85 + 0.15 * w2})` }} html={'Oct 12 to 15 avg<br><span class="v">81,767</span>'} />
        </>
      )}
      {w1 > 0 && (
        <>
          <B x={Math.round(c15x(C15_W1[0]) - c15bw / 2 - 4)} y={Math.round(c15y(72000)) - 26} w={Math.round(c15x(C15_W1[1]) - c15x(C15_W1[0]) + c15bw + 8)} h={18} cls="brkt" style={{ opacity: w1 }} />
          <A x={(c15x(C15_W1[0]) + c15x(C15_W1[1])) / 2} y={Math.round(c15y(72000)) - 120} cls="wl"
            style={{ opacity: w1, transform: 'translateX(-50%)' }} html={'Oct 5 to 8 avg<br><span class="v">67,323</span>'} />
        </>
      )}
      {up > 0 && <A x={(c15x(C15_W2[0]) + c15x(C15_W2[1])) / 2 - 80} y={Math.round(c15y(95000)) - 268} cls="up"
        style={{ opacity: up, transform: `scale(${interpolate(up, [0, 0.6, 1], [0.6, 1.12, 1])})`, transformOrigin: '50% 50%' }} html="+21.5%" />}
      <Src html={'Kaspalytics API, accepted transactions &middot; Standard series only (coinbase excluded) &middot; Sep <span class="m">1</span> to Oct <span class="m">20</span>, <span class="m">2026</span> &middot; pulled <span class="m">2026-10-21</span>'} />
    </Frame>
  );
};

// =====================================================================================================================
// C17: the supply ring (CH5). Fills + counts up from 'Around' 236.78, lands the DATED 96.72% ON 'mined.' 240.16.
// (The braam-pause zoom to the figure is the comp's `bz` move on the cover, not part of the chart.)
// =====================================================================================================================
const C17 = { CIRC: 27763090854.57, PCT: 96.72 };
export const ChartC17: React.FC = () => {
  const { t } = useK20();
  const a = ramp(t, 236.9, 240.16, Easing.inOut(Easing.cubic));
  const cx = 600, cy = 640, r = 270, sw = 46, C = 2 * Math.PI * r;
  const sz = 2 * r + 2 * sw, o = r + sw;
  const frac = (C17.PCT / 100) * a;
  return (
    <Frame cyan>
      <div className="stars" />
      <Orb x={260} y={260} size={760} color="var(--lit)" op={0.16 + 0.08 * a} />
      <Orb x={1500} y={-300} size={560} color="var(--lit)" op={0.10} />
      <Header ey={'KAS supply &middot; read <span class="m">2026-10-18</span>'} h1={'Already <span class="lt">mined</span>'} />
      <div className="abs" style={{ left: cx - r - sw, top: cy - r - sw, width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
          <defs>
            <linearGradient id="k20-rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a8efe4" /><stop offset="1" stopColor="#3f9d90" /></linearGradient>
            <filter id="k20-gw" filterUnits="userSpaceOnUse" x="0" y="0" width={sz} height={sz}><feGaussianBlur stdDeviation="14" /></filter>
          </defs>
          <circle cx={o} cy={o} r={r} fill="none" stroke="#161c22" strokeWidth={sw} />
          <circle cx={o} cy={o} r={r} fill="none" stroke="rgba(112,199,186,.10)" strokeWidth={2} />
          {frac > 0 && (
            <>
              <circle cx={o} cy={o} r={r} fill="none" stroke="#70c7ba" strokeWidth={sw} opacity={0.55}
                strokeDasharray={`${C * frac} ${C}`} transform={`rotate(-90 ${o} ${o})`} filter="url(#k20-gw)" />
              <circle cx={o} cy={o} r={r} fill="none" stroke="url(#k20-rg)" strokeWidth={sw}
                strokeDasharray={`${C * frac} ${C}`} transform={`rotate(-90 ${o} ${o})`} />
            </>
          )}
        </svg>
      </div>
      <A x={cx - 260} y={cy - 78} cls="big" style={{ width: 520, textAlign: 'center' }} html={(C17.PCT * a).toFixed(2) + '%'} />
      <A x={cx - 260} y={cy + 52} cls="under" style={{ width: 520 }} html="MINED" />
      <A x={1060} y={440} html={'<div class="kas">' + ((C17.CIRC * a) / 1e9).toFixed(2) + 'B</div><div class="of">of <span class="m">28.70B</span> KAS max supply</div>'} />
      <div className="abs chips3" style={{ left: 1060, top: 680 }}>
        {['PROOF OF WORK', 'NO PREMINE', 'FAIR LAUNCH'].map((c) => <span key={c} className="chip">{c}</span>)}
      </div>
      <A x={1060} y={780} html={'<span style="font-family:DM Sans;font-size:24px;color:var(--text-muted)">&ldquo;No premine. No hidden allocation. Fair launch.&rdquo; (kaspa.org)</span>'} />
      <Src html={'api.kaspa.org/info/coinsupply: circulating <span class="m">27,763,090,854.57</span> of max <span class="m">28,704,035,605</span> KAS &middot; read <span class="m">2026-10-18</span>'} />
    </Frame>
  );
};

// =====================================================================================================================
// C5: the board-game timeline (CH4), ONE board in three cover rows: part 1 (177.06-190.52), part 2 (193.78-199.46),
// and the FINAL square (199.46 on, the hop to FINAL + the dated stamp). The K piece HOPS square to square on the words.
// Geometry = c5-timeline.html / c5-final-square.html (serpentine: top row left->right, U-turn, bottom row right->left).
// =====================================================================================================================
type Sq = { mo?: string; dy?: string; ev?: string; x: number; y: number; small?: boolean; gold?: boolean; fin?: boolean; chips?: boolean };
const SQ = 170;
const BOARD: Sq[] = [
  { mo: 'JUN', dy: '30', ev: 'Toccata activates', x: 330, y: 430 },
  { mo: 'JUL', dy: '15', ev: 'conventions repo opens', x: 740, y: 430 },
  { mo: 'AUG', dy: '20', ev: 'land as Drafts', x: 1150, y: 430, chips: true },
  { mo: 'SEP', dy: '21', ev: 'KCC-<span class="m">0</span> Final', x: 1560, y: 430, small: true },
  { mo: 'SEP', dy: '22', ev: 'Last Call PR for<br>KCC-<span class="m">20</span> opens', x: 1560, y: 790 },
  { mo: 'OCT', dy: '1', ev: 'KCC-<span class="m">1</span> + KCC-<span class="m">2</span><br>to Last Call', x: 1150, y: 790 },
  { mo: 'OCT', dy: '7', ev: 'KCC-<span class="m">20</span> joins them', x: 740, y: 790, gold: true },
  { x: 330, y: 790, fin: true },
];
type Hop = { from: number; to: number; t0: number; t1: number };
type BoardMode = 'p1' | 'p2' | 'final';
const BOARD_PLAN: Record<BoardMode, { start: number; hops: Hop[] }> = {
  // JUN 30 lands with the cover on 'June' 177.06; JUL 15 on 'July' 179.54; AUG 20 on 'August' 182.52;
  // the piece passes the drawn (unspoken) SEP 21 square and lands SEP 22 on 'September' 188.78
  p1: { start: 0, hops: [
    { from: 0, to: 1, t0: 179.19, t1: 179.54 }, { from: 1, to: 2, t0: 182.17, t1: 182.52 },
    { from: 2, to: 3, t0: 188.13, t1: 188.45 }, { from: 3, to: 4, t0: 188.45, t1: 188.78 }] },
  // the path returns, OCT 1 lands on 'October 1st' 193.78
  p2: { start: 4, hops: [{ from: 4, to: 5, t0: 193.8, t1: 194.15 }] },
  // OCT 7 on 'October 7th' 199.46, then one more hop to FINAL on 'joins them' 201.64 -> 202.02
  final: { start: 5, hops: [{ from: 5, to: 6, t0: 199.46, t1: 199.8 }, { from: 6, to: 7, t0: 201.64, t1: 202.02 }] },
};
const C5_CHIP_T = [183.84, 184.9, 186.32];
const C5_STAMP_T = 202.32;
const pieceAt = (i: number) => ({ x: BOARD[i].x + 94, y: BOARD[i].y - 114 });

const Piece: React.FC<{ cx: number; cy: number; s?: number; squash?: number }> = ({ cx, cy, s = 112, squash = 0 }) => (
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
const Spark: React.FC<{ cx: number; cy: number; s: number; col: string; k: number }> = ({ cx, cy, s, col, k }) => (
  <div className="abs spark" style={{ left: cx - s / 2, top: cy - s / 2, width: s, height: s, filter: 'drop-shadow(0 0 10px rgba(255,215,0,.85))', transform: `scale(${k})` }}>
    <svg width={s} height={s} viewBox="0 0 100 100"><path d="M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0Z" fill={col} /></svg>
  </div>
);

/** kt-keyword-pop motion (overlays.md section 2): appears at once, scale 100 -> 110 over 0.20 s with the rotation jiggle
 * 0 / +2 / -2 / +1 / -0.5 / 0 deg at 0 / 0.03 / 0.08 / 0.13 / 0.20 / 0.27 s, a 2-3 frame smear, then still. */
export const popMotion = (dt: number) => {
  const s = interpolate(dt, [0, 0.2], [1, 1.1], clamp);
  const rot = interpolate(dt, [0, 0.03, 0.08, 0.13, 0.2, 0.27], [0, 2, -2, 1, -0.5, 0], clamp);
  const blur = interpolate(dt, [0, 0.1], [5, 0], clamp);
  return { s, rot, blur };
};

export const ChartC5: React.FC<{ mode: BoardMode }> = ({ mode }) => {
  const { t } = useK20();
  const plan = BOARD_PLAN[mode];
  const isFinal = mode === 'final';
  // where is the piece, which squares have landed (and when)
  let cur = plan.start;
  let air: { x: number; y: number; u: number } | null = null;
  const landedAt: Record<number, number> = {};
  for (let i = 0; i <= plan.start; i++) landedAt[i] = -1e9;
  if (mode === 'p1') landedAt[0] = 177.06;                              // JUN 30 lands (pops) on 'June' with the cover
  if (plan.start >= 4) landedAt[3] = -1e9;
  for (const h of plan.hops) {
    if (t >= h.t1) { cur = h.to; landedAt[h.to] = h.t1; }
    else if (t >= h.t0) {
      const u = (t - h.t0) / (h.t1 - h.t0);
      const a = pieceAt(h.from), b = pieceAt(h.to);
      const e = Easing.inOut(Easing.quad)(u);
      air = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e - Math.sin(Math.PI * u) * (h.to === 7 ? 70 : 85), u };
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
  // pips between consecutive same-row squares (+ the U-turn arc on the right)
  for (let i = 0; i < BOARD.length - 1; i++) {
    const a = BOARD[i], b = BOARD[i + 1];
    if (a.y !== b.y) continue;
    const ha = (a.small ? 60 : 85) + 14, hb = (b.small ? 60 : 85) + 14, dir = Math.sign(b.x - a.x);
    const x1 = a.x + dir * ha, x2 = b.x - dir * hb;
    for (let k = 1; k < 4; k++) {
      const u = k / 4;
      board.push(<B key={`p${i}-${k}`} x={x1 + (x2 - x1) * u - 7} y={a.y - 7} w={14} h={14} cls={'pip' + (pipOn(i) ? ' on' : '')} />);
    }
  }
  for (let j = 1; j < 6; j++) {
    const ang = -Math.PI / 2 + (Math.PI * j) / 6;
    board.push(<B key={`u${j}`} x={1560 + Math.cos(ang) * 230 - 7} y={610 + Math.sin(ang) * 180 - 7} w={14} h={14} cls={'pip' + (isFinal || landed(4) ? ' on' : '')} />);
  }
  BOARD.forEach((s, i) => {
    const sz = s.small ? 120 : SQ;
    if (s.fin) { if (!finLanded) board.push(<B key="fin" x={s.x - sz / 2} y={s.y - sz / 2} w={sz} h={sz} cls="sq fin" html={'<div class="fw">FINAL</div><div class="fs">ahead</div>'} />); return; }
    const L = landed(i);
    const cls = 'sq' + (L ? (i === curSq ? (s.gold ? ' goldsq' : ' cur') : ' past') : ' blank');
    const inner = L ? `<div class="mo"${s.small ? ' style="font-size:22px"' : ''}>${s.mo}</div><div class="dy"${s.small ? ' style="font-size:50px"' : ''}>${s.dy}</div>` : '';
    board.push(<B key={`s${i}`} x={s.x - sz / 2} y={s.y - sz / 2} w={sz} h={sz} cls={cls} html={inner}
      style={{ transform: `scale(${L ? landPop(i) : 1})` }} />);
    const evY = s.y + sz / 2 + 30;
    if (L) {
      let ev = s.ev!;
      let op = labelOp(i);
      if (i === 5 && mode === 'p2') {
        // the KCC-1 / KCC-2 words hop on as he names them (195.68 / 196.64)
        const k1 = t >= 195.68, k2 = t >= 196.64;
        ev = `<span style="opacity:${k1 ? 1 : 0}">KCC-<span class="m">1</span></span><span style="opacity:${k2 ? 1 : 0}"> + KCC-<span class="m">2</span></span><br>to Last Call`;
      }
      if (i === 6 && isFinal) op = interpolate(t, [200.9, 201.1], [0, 1], clamp);   // 'KCC-20 joins them' on 'KCC-20'
      board.push(<A key={`e${i}`} x={s.x - 190} y={evY + (1 - op) * 10} cls={'ev' + (s.small ? ' mut' : '')} html={ev} style={{ width: 380, opacity: op }} />);
    }
    if (s.chips && L) {
      board.push(
        <div key={`c${i}`} className="abs" style={{ left: s.x - 190, top: evY + 40, width: 380, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {['KCC-1', 'KCC-2', 'KCC-20'].map((c, ci) => {
            const at = mode === 'p1' ? C5_CHIP_T[ci] : -1e9;
            const dt = t - at;
            return <span key={c} className="chipd" style={{ visibility: ci < chipsOut ? 'visible' : 'hidden', display: 'inline-block',
              transform: `translateY(${interpolate(dt, [0, 0.12, 0.25], [-22, 4, 0], clamp)}px)` }}>{c}</span>;
          })}
        </div>,
      );
    }
  });

  const finGroup: React.ReactNode[] = [];
  if (finLanded) {
    const s = BOARD[7];
    const k = landPop(7);
    finGroup.push(<B key="halo" x={s.x - 200} y={s.y - 190} w={400} h={400} cls="halo" style={{ opacity: labelOp(7) }} />);
    finGroup.push(<B key="fsq" x={s.x - SQ / 2} y={s.y - SQ / 2} w={SQ} h={SQ} cls="sq finlit" html={'<div class="fw">FINAL</div><div class="fd">OCT 21</div>'} style={{ transform: `scale(${k})` }} />);
    const evY = s.y + SQ / 2 + 30;
    finGroup.push(<A key="fev" x={s.x - 190} y={evY} cls="ev" html="go Final" style={{ width: 380, opacity: labelOp(7) }} />);
    finGroup.push(
      <div key="fch" className="abs" style={{ left: s.x - 190, top: evY + 40, width: 380, display: 'flex', justifyContent: 'center', gap: 10, opacity: labelOp(7) }}>
        {['KCC-1', 'KCC-2', 'KCC-20'].map((c) => <span key={c} className="chipd">{c}</span>)}
      </div>,
    );
  }
  // the piece
  let piece: React.ReactNode;
  if (air) {
    piece = <Piece cx={air.x} cy={air.y} />;
  } else {
    const P = pieceAt(cur);
    const dt = t - (landedAt[cur] ?? -1e9);
    const squash = dt >= 0 && dt < 0.18 ? Math.sin((Math.PI * dt) / 0.18) : 0;
    piece = <Piece cx={P.x} cy={P.y} squash={squash} />;
  }
  // the stamp (kt-keyword-pop motion on the -6 deg plate), then a slow push onto it while it reads
  let stampEl: React.ReactNode = null;
  let push = 1;
  if (stamp) {
    const dt = t - C5_STAMP_T;
    const pm = popMotion(dt);
    const cx = 1150, cy = 612, w = 900, h = 360;
    push = 1 + 0.06 * ramp(t, C5_STAMP_T + 0.3, C5_STAMP_T + 2.0, Easing.inOut(Easing.sin));
    const sk = (d: number) => interpolate(dt, [d, d + 0.15, d + 0.3], [0, 1.25, 1], clamp);
    stampEl = (
      <>
        <B x={cx - w / 2 - 180} y={cy - h / 2 - 170} w={w + 360} h={h + 340} cls="sglow" style={{ opacity: ramp(t, C5_STAMP_T, C5_STAMP_T + 0.2) }} />
        <B x={cx - w / 2} y={cy - h / 2} w={w} h={h} cls="stamp"
          style={{ transform: `rotate(${-6 + pm.rot}deg) scale(${pm.s / 1.1 * 1.0})`, filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined }}
          html={'<div class="su">UPDATE</div><div class="sr"></div><div class="sb">KCC-<span class="m">20</span> IS <span class="go">FINAL</span></div><div class="sd">OCT 21, 2026</div>'} />
        <Spark cx={975} cy={372} s={60} col="#fff3b0" k={sk(0.05)} />
        <Spark cx={1712} cy={562} s={40} col="#ffd700" k={sk(0.12)} />
        <Spark cx={1392} cy={856} s={56} col="#fff3b0" k={sk(0.08)} />
        <Spark cx={618} cy={690} s={34} col="#ffd700" k={sk(0.16)} />
      </>
    );
  }
  const srcLine = 'kaspanet/kccs commits + PRs #<span class="m">2</span>, #<span class="m">3</span>, #<span class="m">5</span>, #<span class="m">25</span>, #<span class="m">31</span>, #<span class="m">32</span>, #<span class="m">33</span> &middot; rusty-kaspa v<span class="m">2.0.0</span> release &middot; read <span class="m">2026-10-18</span>'
    + (isFinal ? ' &middot; PRs #<span class="m">39</span>, #<span class="m">40</span>, #<span class="m">41</span> merged <span class="m">2026-10-21</span>' : '');
  return (
    <Frame gold>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '1150px 612px' }}>
        <Orb x={1450} y={-280} size={640} color="var(--lit)" op={0.12} />
        <Orb x={-280} y={640} size={620} color="#70c7ba" op={0.08} />
        <Header ey={'kaspanet/kccs &middot; the timeline &middot; <span class="m">2026</span>'} h1={'Square by square, toward <span class="lt">Final</span>'} />
        <div style={{ position: 'absolute', inset: 0, opacity: dim }}>{board}</div>
        {finGroup}
        {piece}
        {stampEl}
        <Src html={srcLine} />
      </AbsoluteFill>
    </Frame>
  );
};

// =====================================================================================================================
// KINETIC TEXT (overlays.md section 2, the 2023 devices, house palette + font): kt-side-panel + kt-keyword-pop
// =====================================================================================================================
const KT_KEY = ACCENT.kaspa;   // key words Kaspa greenish cyan over white (Mike, 2026-10-21)
const PANEL_W = 862;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** kt-side-panel: panel slides in from fully off-screen to flush in 0.50 s ease-out; 0.23 s later the text rises 338 px over
 * 0.33 s scaling 80 -> 110 -> 100 (peak at 0.15 s), motion-blurred; then hovers (+-18 x / +-13 y, new target every ~0.7 s,
 * +-0.5 deg rock on a 3.0 s cycle). No exit move: the cover's cut removes it. */
export const KtSidePanel: React.FC<{ side: 'L' | 'R'; t0: number; eyebrow: string; lines: string[] }> = ({ side, t0, eyebrow, lines }) => {
  const { t } = useK20();
  const dt = t - t0;
  if (dt < 0) return null;
  const slide = interpolate(dt, [0, 0.5], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x0 = side === 'R' ? 1920 - PANEL_W : 0;
  const off = (side === 'R' ? 1 : -1) * PANEL_W * slide;
  const tr = dt - 0.23;
  const rise = interpolate(tr, [0, 0.33], [338, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(tr, [0, 0.15, 0.33], [0.8, 1.1, 1.0], clamp);
  const blur = interpolate(tr, [0, 0.25], [6, 0], clamp);
  // hover: eased drift between pseudo-random targets every 0.7 s + the 3 s rock
  const hv = Math.max(0, tr - 0.33);
  const seg = Math.floor(hv / 0.7), u = Easing.inOut(Easing.sin)((hv % 0.7) / 0.7);
  const tx = (k: number) => (hash(k * 2 + t0) * 2 - 1) * 18, ty = (k: number) => (hash(k * 2 + 1 + t0) * 2 - 1) * 13;
  const hx = seg === 0 && hv === 0 ? 0 : tx(seg) + (tx(seg + 1) - tx(seg)) * u;
  const hy = seg === 0 && hv === 0 ? 0 : ty(seg) + (ty(seg + 1) - ty(seg)) * u;
  const rock = 0.5 * Math.sin((2 * Math.PI * hv) / 3.0);
  return (
    <div style={{ position: 'absolute', top: 0, left: x0 + off, width: PANEL_W, height: 1080, overflow: 'hidden',
      background: 'linear-gradient(160deg,#10161c 0%,#0a0d12 60%,#0b1414 100%)',
      boxShadow: side === 'R' ? '-30px 0 60px rgba(0,0,0,.55)' : '30px 0 60px rgba(0,0,0,.55)' }}>
      {/* the textured dark panel: grain + a soft accent bloom + the accent edge on the picture side */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: 'absolute', width: 900, height: 900, left: -20, top: 90, borderRadius: '50%', background: 'rgba(112,199,186,.10)', filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [side === 'R' ? 'left' : 'right']: 0, width: 4, background: `linear-gradient(180deg, rgba(112,199,186,0), ${KT_KEY}, rgba(112,199,186,0))` } as React.CSSProperties} />
      {tr >= 0 && (
        <div style={{ position: 'absolute', left: 90, right: 70, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transform: `translate(${hx}px, ${rise + hy}px) scale(${sc}) rotate(${rock}deg)`, transformOrigin: '40% 50%', filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 34, letterSpacing: '.22em', color: KT_KEY, marginBottom: 22 }}>{eyebrow}</div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 92, lineHeight: 1.04, color: '#e8eaf0', letterSpacing: '-.01em' }}
              dangerouslySetInnerHTML={{ __html: l.replace(/\[([^\]]+)\]/g, `<span style="color:${KT_KEY}">$1</span>`) }} />
          ))}
          <div style={{ width: 90, height: 5, borderRadius: 3, marginTop: 34, background: `linear-gradient(90deg, ${KT_KEY}, rgba(112,199,186,.2))` }} />
        </div>
      )}
    </div>
  );
};

/** kt-keyword-pop: appears at once ON the word, centred at ~79% of the frame height, the 100 -> 110 jiggle pop, then still. */
export const KtKeywordPop: React.FC<{ t0: number; t1: number; cx: number; text: string }> = ({ t0, t1, cx, text }) => {
  const { t } = useK20();
  if (t < t0 || t >= t1) return null;
  const pm = popMotion(t - t0);
  return (
    <div style={{ position: 'absolute', left: cx, top: 853, transform: `translate(-50%, -50%) scale(${pm.s}) rotate(${pm.rot}deg)`,
      filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined, whiteSpace: 'nowrap', padding: '18px 40px 22px', borderRadius: 18,
      background: 'rgba(10,12,16,.90)', border: `3px solid ${KT_KEY}`, boxShadow: '0 0 50px rgba(112,199,186,.35), 0 18px 40px rgba(0,0,0,.6)',
      fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 70, lineHeight: 1.05, color: '#e8eaf0', letterSpacing: '.005em' }}
      dangerouslySetInnerHTML={{ __html: text.replace(/\[([^\]]+)\]/g, `<span style="color:${KT_KEY}">$1</span>`) }} />
  );
};

// =====================================================================================================================
// H0 motion-type card on BR-1 (CH1): 'KCC-20 / LAST CALL / OCT 7, 2026' (dated: the Oct 7 headline, never today's status)
// =====================================================================================================================
export const H0Card: React.FC<{ t0: number; t1: number }> = ({ t0, t1 }) => {
  const { t } = useK20();
  const dt = t - t0;
  const line = (d: number) => { const pm = popMotion(Math.max(0, dt - d)); return { opacity: dt >= d ? 1 : 0, transform: `scale(${pm.s / 1.1}) rotate(${pm.rot}deg)`, filter: pm.blur > 0.2 && dt >= d ? `blur(${pm.blur}px)` : undefined }; };
  const drift = 1 + 0.04 * ramp(t, t0, t1, Easing.linear);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,12,16,.25) 0%, rgba(10,12,16,.72) 75%)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${drift})` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 170, lineHeight: 1, color: '#e8eaf0', letterSpacing: '.02em',
          textShadow: '0 0 60px rgba(112,199,186,.45)', ...line(0) }}>KCC-20</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 132, lineHeight: 1.1, color: ACCENT.kaspa, marginTop: 6,
          textShadow: '0 0 50px rgba(112,199,186,.55)', ...line(0.18) }}>Last Call</div>
        <div style={{ marginTop: 34, padding: '12px 30px', borderRadius: 100, border: `2px solid rgba(112,199,186,.7)`, background: 'rgba(112,199,186,.12)',
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 40, letterSpacing: '.12em', color: ACCENT.kaspa, ...line(0.36) }}>OCT 7, 2026</div>
      </div>
    </AbsoluteFill>
  );
};
