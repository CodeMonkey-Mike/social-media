// AIDestroyingLivesVerticalCharts.tsx: the 12 Type 1 ANIMATED charts of "AI destroying lives", re-laid for the PORTRAIT
// (1080x1920) cut (vertical-repurpose.md section 1, comp-build.md section 7). Each template is the chart's portrait spec
// HTML (assets/vertical/charts/<id>.html, one .frame per state, from the chart-builder's _charts_portrait.py) rebuilt as a
// FRAME-DRIVEN template: the same markup, the 16:9 stylesheet VERBATIM (scoped under .aidl) + its layout-only portrait
// block, so every state lands on its spec PNG; every moving value is computed from the comp clock (source-spine seconds)
// at the IDENTICAL cue times of the 16:9 (the spine is the same), with the portrait numbers of
// assets/vertical/charts/<id>.vertical.spec.md section 2-3. Never a PNG with a wipe.
import React from 'react';
import { interpolate, interpolateColors } from 'remotion';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadDMSans('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin', 'latin-ext'] });
loadDMSans('italic', { weights: ['400'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin', 'latin-ext'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin', 'latin-ext'] });

const FPS = 30;
// the 16:9 chart stylesheet verbatim (scoped), then the portrait block of every assets/vertical/charts/<id>.html (scoped)
const CHART_CSS = `.aidl{--bg-deep:#0a0c10; --bg-card:#12151c; --bg-card-hover:#181c26;
  --accent-green:#00e68a; --accent-cyan:#00c2ff; --accent-gold:#ffd700;
  --accent-red:#ff4060; --accent-purple:#a855f7; --accent-teal:#49e0c8;
  --text-primary:#e8eaf0; --text-secondary:#8892a4; --text-muted:#505a6e;
  --border:#1e2330;}
.aidl *{margin:0;padding:0;box-sizing:border-box}
.aidl .frame{width:1920px;height:1080px;background:var(--bg-deep);position:relative;overflow:hidden;
  display:flex;flex-direction:column;justify-content:center;padding:0 140px;color:var(--text-primary)}
.aidl .frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.aidl .orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.30;pointer-events:none;z-index:0}
.aidl .frame>*:not(.orb){position:relative;z-index:1}
.aidl .ey{font-family:'DM Sans';font-size:27px;font-weight:600;text-transform:uppercase;
  letter-spacing:.18em;color:var(--text-muted);margin-bottom:26px}
.aidl h1{font-family:'Playfair Display',serif;font-weight:900;font-size:84px;line-height:1.07;
  letter-spacing:-.02em;color:var(--text-primary);max-width:1440px}
.aidl h1.sm{font-size:70px}
.aidl .divider{width:66px;height:4px;border-radius:2px;
  background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));margin:32px 0}
.aidl p,.aidl .body{font-family:'DM Sans';font-size:31px;line-height:1.55;color:var(--text-secondary);max-width:1240px}
.aidl .mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.aidl b{color:var(--text-primary);font-weight:700}
.aidl .g{color:var(--accent-green)}
.aidl .c{color:var(--accent-cyan)}
.aidl .go{color:var(--accent-gold)}
.aidl .re{color:var(--accent-red)}
.aidl .pu{color:var(--accent-purple)}
.aidl .tl{color:var(--accent-teal)}
.aidl .frame.ch{display:block;padding:0}
.aidl .frame .hdr{position:absolute;left:140px;top:78px;width:1640px}
.aidl .hdr .ey{margin-bottom:20px}
.aidl .hdr h1{font-size:74px}
.aidl .hdr .divider{margin:26px 0 0}
.aidl .frame .a{position:absolute}
.aidl .frame .src{position:absolute;left:140px;right:140px;bottom:40px;font-family:'JetBrains Mono',monospace;font-weight:400;
  font-size:19px;line-height:1.45;color:var(--text-muted)}
.aidl .frame svg.layer{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
.aidl .frame .off{opacity:0}
.aidl .frame .dim{opacity:.3}
.aidl .frame .half{opacity:.55}
.aidl .val{font-family:'JetBrains Mono',monospace;font-weight:600;line-height:1;white-space:nowrap}
.aidl .lbl{font-family:'DM Sans';font-size:32px;font-weight:500;line-height:1.25;color:var(--text-secondary)}
.aidl .lbl.pri{color:var(--text-primary);font-weight:700}
.aidl .cat{font-family:'DM Sans';font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);white-space:nowrap}
.aidl .pill{display:inline-block;padding:9px 20px 8px;border-radius:100px;font-family:'DM Sans';font-size:20px;font-weight:700;
  letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
.aidl .pill.gold{background:rgba(255,215,0,.10);color:var(--accent-gold);border:1px solid rgba(255,215,0,.35)}
.aidl .pill.green{background:rgba(0,230,138,.10);color:var(--accent-green);border:1px solid rgba(0,230,138,.35)}
.aidl .pill.cyan{background:rgba(0,194,255,.10);color:var(--accent-cyan);border:1px solid rgba(0,194,255,.35)}
.aidl .pill.red{background:rgba(255,64,96,.10);color:var(--accent-red);border:1px solid rgba(255,64,96,.38)}
.aidl .frame .take{position:absolute;left:140px;right:140px;bottom:92px;padding:28px 40px;border-radius:16px;
  background:linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.05));border:1px solid rgba(0,230,138,.22);
  font-family:'DM Sans';font-size:38px;font-weight:700;color:var(--text-primary);line-height:1.3}
.aidl .frame .callout{padding:18px 30px 18px 28px;border-left:4px solid var(--accent-red);border-radius:4px 12px 12px 4px;
  background:rgba(255,64,96,.08);font-family:'DM Sans';font-size:40px;font-weight:700;color:var(--text-primary);white-space:nowrap}
.aidl .frame .chip{padding:16px 28px;border-radius:14px;border:1px solid rgba(0,194,255,.35);background:rgba(0,194,255,.08);
  font-family:'DM Sans';font-size:38px;font-weight:700;color:var(--text-primary);white-space:nowrap}
.aidl .frame .card2{background:var(--bg-card);border:2px solid var(--border);border-radius:18px}
.aidl .bar{border-radius:8px}
.aidl .bar.red{background:linear-gradient(180deg,#ff4060,#a42c45)}
.aidl .bar.green{background:linear-gradient(0deg,#08935d,#00e68a)}
.aidl .bar.cyan{background:linear-gradient(0deg,#0a7fa8,#00c2ff)}
.aidl .bar.gold{background:linear-gradient(90deg,#b39a12,#ffd700)}
.aidl .bar.hred{background:linear-gradient(90deg,#b52e48,#ff4060)}
.aidl .glow-red{box-shadow:0 0 44px rgba(255,64,96,.45)}
.aidl .glow-green{box-shadow:0 0 44px rgba(0,230,138,.42)}
.aidl .glow-cyan{box-shadow:0 0 44px rgba(0,194,255,.45)}
.aidl .glow-gold{box-shadow:0 0 44px rgba(255,215,0,.35)}
.aidl .frame{width:1080px;height:1920px}
.aidl .frame .hdr{left:72px;top:110px;width:936px}
.aidl .hdr .ey{font-size:28px;line-height:1.45;margin-bottom:18px}
.aidl .hdr h1{font-size:82px;line-height:1.08;max-width:936px}
.aidl .hdr .divider{margin:26px 0 0}
.aidl .frame .src{left:72px;right:72px;bottom:110px;font-size:21px;line-height:1.5}
.aidl .frame svg.layer{width:1080px;height:1920px}
.aidl .frame .take{left:72px;right:72px;bottom:auto;padding:26px 36px;font-size:40px;line-height:1.3}
.aidl .frame .callout{font-size:44px}`;

// ---- timing helpers (t and cue times are SOURCE-spine seconds; durations in frames at 30 fps) ----
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lin = (t: number, t0: number, frames: number) => clamp01((t - t0) / (frames / FPS));
const eOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const eOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);
const eInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const n1 = (x: number) => x.toFixed(1);
const n3 = (x: number) => (Math.round(x * 1000) / 1000).toString();
const fmt = (x: number) => Math.round(x).toLocaleString('en-US');
const fade = (t: number, t0: number, frames: number) => n3(lin(t, t0, frames));
const riseStyle = (t: number, t0: number, frames: number, px: number) => {
  const p = eOutCubic(lin(t, t0, frames));
  return `opacity:${n3(p)};transform:translateY(${n1((1 - p) * px)}px)`;
};
const col = (p: number, a: string, b: string) => interpolateColors(clamp01(p), [0, 1], [a, b]);
const PRI = '#e8eaf0';
const SEC = '#8892a4';

// =====================================================================================================================
// C10 · 2.0 million long-term unemployed (6.49-13.45): stacked number, two-line line, 936 track, fill 258.3
const C10 = (t: number) => {
  const num = lin(t, 6.54, 30);
  const mid = eOutCubic(lin(t, 8.38, 18));
  const fill = 258.3 * eOutCubic(lin(t, 9.42, 60));
  const lbl = lin(t, 11.42, 10);
  return `<div class="frame ch"><div class="orb" style="left:420px;top:1180px;width:900px;height:900px;background:#0b3a66"></div><div class="a ey" style="left:72px;top:470px;margin:0">United States &middot; October 2026</div><div class="a" style="left:58px;top:520px;white-space:nowrap;opacity:${n3(num)};filter:blur(${n1(8 * (1 - num))}px)"><div class="val" style="font-size:340px;color:var(--text-primary);letter-spacing:-.02em">2.0</div><div class="val" style="font-size:120px;font-weight:400;color:var(--text-secondary);letter-spacing:.06em;margin:8px 0 0 14px">MILLION</div></div><div class="a" style="left:72px;top:1040px;font-family:'Playfair Display',serif;font-weight:700;font-size:72px;line-height:1.1;color:var(--text-primary);white-space:nowrap;opacity:${n3(mid)};transform:translateY(${n1((1 - mid) * 12)}px)">out of work <span class="mono">27</span><br>weeks or more</div><div class="a divider" style="left:72px;top:1222px;margin:0;width:${n1(66 * mid)}px"></div><div class="a" style="left:72px;top:1282px;width:936px;height:20px;border-radius:10px;background:#161a23;border:1px solid var(--border);opacity:${n3(mid)}"></div><div class="a bar hred" style="left:72px;top:1282px;width:${n1(fill)}px;height:20px;border-radius:10px;box-shadow:0 0 26px rgba(255,64,96,.35);opacity:${fill > 0.5 ? 1 : 0}"></div><div class="a lbl" style="left:72px;top:1336px;white-space:nowrap;font-size:36px;opacity:${n3(lbl)}"><span class="mono re">27.6%</span> of all unemployed people in the US</div><div class="src">Source: U.S. Bureau of Labor Statistics,<br>The Employment Situation, October 2026 &middot;<br>long-term = jobless 27 weeks or more</div></div>`;
};

// C7 · entry-level vs senior postings (52.30-64.45): 34 px / point, values ride 22 px off the bar end
const C7 = (t: number) => {
  const pe = eOutCubic(lin(t, 54.14, 27));
  const ps = eOutCubic(lin(t, 58.58, 27));
  const hEntry = 255.0 * pe;
  const hSen = 499.8 * ps;
  const hire = lin(t, 60.74, 15);
  const beg = lin(t, 63.54, 12);
  const entryOp = 1 - 0.7 * hire + 0.7 * beg;
  const senOp = 1 - 0.7 * beg;
  const entryGlow = Math.max(1 - hire, beg);
  const takeP = eOutCubic(hire);
  const still = col(hire - beg, PRI, '#00e68a');
  const begC = col(beg, PRI, '#ff4060');
  return `<div class="frame ch"><div class="orb" style="left:560px;top:-380px;width:760px;height:760px;background:rgba(255,64,96,.55)"></div><div class="hdr"><div class="ey">Job postings &middot; year over year,<br>as of May 2026</div><h1>The bottom rung<br>is <span class="re">shrinking</span></h1><div class="divider"></div></div><svg class="layer"><line x1="176" y1="1090" x2="1008" y2="1090" stroke="#3a4357" stroke-width="3"/></svg><div class="a val" style="left:72px;top:1076px;width:88px;text-align:right;font-size:26px;color:var(--text-muted)">0%</div><div class="a cat" style="left:240px;top:1038px;width:300px;text-align:center;font-size:28px;color:var(--text-secondary)">Entry-level</div><div class="a bar red" style="left:240px;top:1090px;width:300px;height:${n1(hEntry)}px;border-radius:0 0 10px 10px;opacity:${n3(hEntry > 0.5 ? entryOp : 0)};box-shadow:0 0 44px rgba(255,64,96,${n3(0.45 * entryGlow)})"></div><div class="a val" style="left:170px;top:${n1(1090 + hEntry + 22)}px;width:440px;text-align:center;font-size:100px;color:var(--accent-red);opacity:${n3(lin(t, 54.14, 6) * entryOp)}">−${n1(7.5 * pe)}%</div><div class="a cat" style="left:640px;top:1114px;width:300px;text-align:center;font-size:28px;color:var(--text-secondary)">Senior</div><div class="a bar green" style="left:640px;top:${n1(1090 - hSen)}px;width:300px;height:${n1(hSen)}px;border-radius:10px 10px 0 0;opacity:${n3(hSen > 0.5 ? senOp : 0)};box-shadow:0 0 44px rgba(0,230,138,${n3(0.42 * (1 - beg))})"></div><div class="a val" style="left:570px;top:${n1(1090 - hSen - 22 - 100)}px;width:440px;text-align:center;font-size:100px;color:var(--accent-green);opacity:${n3(lin(t, 58.58, 6) * senOp)}">+${n1(14.7 * ps)}%</div><div class="take" style="top:1528px;opacity:${n3(takeP)};transform:translateY(${n1((1 - takeP) * 16)}px)">Companies are <span style="color:${still}">still hiring</span>.<br>They’re not hiring the <span style="color:${begC}">beginners</span>.</div><div class="src">Source: Indeed Hiring Lab, &ldquo;The Labor Market Is Tilting Toward Seniority&rdquo;,<br>July 23, 2026 &middot; postings, year over year</div></div>`;
};

// C6 · -752,100 office and administrative support, projected (78.20-85.90): left-anchored 184 px counter at x62
const C6 = (t: number) => {
  const p = eOutQuart(lin(t, 80.0, 70));
  const show = lin(t, 80.0, 4);
  const c = eOutCubic(lin(t, 84.46, 12));
  return `<div class="frame ch"><div class="orb" style="left:380px;top:1150px;width:900px;height:900px;background:rgba(255,64,96,.45)"></div><div class="a ey" style="left:72px;top:560px;margin:0;line-height:1.45">BLS Employment Projections &middot;<br>2025 to 2035</div><div class="a pill gold" style="left:72px;top:666px">Projected</div><div class="a val" style="left:62px;top:740px;font-size:184px;color:var(--accent-red);letter-spacing:-.02em;text-shadow:0 0 60px rgba(255,64,96,.28);opacity:${n3(show)};font-variant-numeric:tabular-nums">−${fmt(752100 * p)}</div><div class="a" style="left:72px;top:972px;font-family:'Playfair Display',serif;font-weight:700;font-size:72px;line-height:1.1;color:var(--text-primary);white-space:nowrap">office and administrative<br>support jobs</div><div class="a divider" style="left:72px;top:1160px;margin:0"></div><div class="a callout" style="left:72px;top:1210px;opacity:${n3(c)};transform:translateX(${n1((1 - c) * -24)}px);border-left-color:transparent"><div style="position:absolute;left:-4px;top:0;width:4px;height:${n1(100 * c)}%;background:var(--accent-red);border-radius:4px 0 0 4px"></div>the most of any group</div><div class="src">Source: U.S. Bureau of Labor Statistics, Employment Projections<br>2025 to 2035 (Aug 27, 2026) &middot; a projection, not jobs already lost</div></div>`;
};

// C3 · BLS Table 1.5 ladder (91.90-99.30): each row = label on top, pct on the label line, full-width 936 bar under it
const C3_ARROW = `<svg width="34" height="20" viewBox="0 0 34 20" style="vertical-align:middle;margin:0 2px"><path d="M2 10 H29 M20 3 L30 10 L20 17" stroke="#8892a4" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const c3Row = (top: number, name: string, a: string, b: string, inT: number | null, shrinkT: number, w: number, pctT: number, pct: string, t: number) => {
  const rin = inT === null ? 1 : eOutCubic(lin(t, inT, 10));
  const rinStyle = `opacity:${n3(rin)};transform:translateY(${n1((1 - rin) * 20)}px)`;
  const width = 936 - (936 - w) * eInOutCubic(lin(t, shrinkT, 20));
  return `<div class="a" style="left:72px;top:${top}px;width:640px;${rinStyle}"><div style="font-family:'DM Sans';font-size:42px;font-weight:700;color:var(--text-primary);line-height:1.15;white-space:nowrap">${name}</div><div class="val" style="font-size:32px;color:var(--text-secondary);margin-top:14px">${a} ${C3_ARROW} ${b}<span style="font-family:'DM Sans';font-weight:500;font-size:26px;color:var(--text-muted);margin-left:14px">thousand jobs</span></div></div><div class="a" style="left:72px;top:${top + 122}px;width:936px;height:84px;border-radius:12px;background:repeating-linear-gradient(45deg,rgba(255,64,96,.30) 0 6px,rgba(255,64,96,.07) 6px 14px);border:2px solid rgba(136,146,164,.30);${rinStyle}"></div><div class="a bar hred" style="left:72px;top:${top + 122}px;width:${n1(width)}px;height:84px;border-radius:12px;box-shadow:0 0 30px rgba(255,64,96,.30);${rinStyle}"></div><div class="a val" style="left:668px;top:${top + 4}px;width:340px;text-align:right;font-size:76px;color:var(--accent-red);opacity:${fade(t, pctT, 8)}">${pct}</div>`;
};
const C3 = (t: number) =>
  `<div class="frame ch"><div class="orb" style="left:600px;top:-380px;width:760px;height:760px;background:rgba(255,64,96,.50)"></div><div class="hdr"><div class="ey">BLS &middot; fastest declining occupations &middot;<br>2025 to 2035</div><h1>Projected to <span class="re">shrink</span></h1><div class="divider"></div></div><div class="a" style="left:72px;top:446px;display:flex;align-items:center;gap:14px;font-family:'DM Sans';font-size:24px;color:var(--text-secondary);white-space:nowrap"><span style="display:inline-block;width:28px;height:18px;border-radius:4px;background:repeating-linear-gradient(45deg,rgba(255,64,96,.34) 0 5px,rgba(255,64,96,.08) 5px 11px);border:2px solid rgba(136,146,164,.30)"></span><span>full bar = <span class="mono">2025</span> jobs</span><span style="display:inline-block;width:28px;height:18px;border-radius:4px;background:#ff4060;margin-left:22px"></span><span>left in <span class="mono">2035</span>, projected</span></div>` +
  c3Row(540, 'Word processors and typists', '40.4', '26.5', null, 92.76, 614.0, 93.1, '−34.4%', t) +
  c3Row(900, 'Data entry keyers', '131.8', '98.2', 94.84, 95.6, 697.4, 95.94, '−25.5%', t) +
  c3Row(1260, 'Telemarketers', '60.9', '47.8', 97.14, 98.18, 734.7, 98.58, '−21.4%', t) +
  `<div class="src">Source: U.S. Bureau of Labor Statistics, Table 1.5, Fastest declining<br>occupations, 2025 and projected 2035 &middot; jobs in thousands</div></div>`;

// C8 · freelance postings fell (114.50-124.25): three columns (centres 352/636/912, w190), 18 px / point
const C8 = (t: number) => {
  const l1 = lin(t, 117.16, 10), l2 = lin(t, 120.24, 10), l3 = lin(t, 121.86, 10);
  const b1 = 540 * eOutCubic(lin(t, 119.16, 18));
  const b2 = 360 * eOutCubic(lin(t, 120.24, 15));
  const b3 = 900 * eOutCubic(lin(t, 122.7, 22));
  const g3 = lin(t, 122.7, 22);
  const lab = (x: number, p: number, html: string) =>
    `<div class="a" style="left:${x}px;top:472px;width:300px;text-align:center;font-family:'DM Sans';font-size:28px;font-weight:700;line-height:1.2;color:${col(p, SEC, PRI)}">${html}</div>`;
  const bar = (x: number, h: number, glow: number) =>
    `<div class="a bar red" style="left:${x}px;top:576px;width:190px;height:${n1(h)}px;border-radius:0 0 10px 10px;opacity:${h > 0.5 ? 1 : 0};box-shadow:0 0 44px rgba(255,64,96,${n3(0.45 * glow)})"></div>`;
  return `<div class="frame ch"><div class="orb" style="left:640px;top:-360px;width:720px;height:720px;background:rgba(255,64,96,.50)"></div><div class="hdr"><div class="ey">Freelance job postings &middot;<br>first year after ChatGPT</div><h1>Translation and<br>writing work <span class="re">fell</span></h1><div class="divider"></div></div><svg class="layer"><line x1="236" y1="576" x2="1008" y2="576" stroke="#3a4357" stroke-width="3"/></svg><div class="a" style="left:72px;top:562px;width:148px;text-align:right;font-family:'DM Sans';font-size:22px;color:var(--text-muted);line-height:1.2"><span class="mono">0</span> = the<br>market trend</div>` +
    lab(202, l1, 'Translation,<br>Western languages') + bar(257, b1, 0) +
    `<div class="a val" style="left:202px;top:1138.0px;width:300px;text-align:center;font-size:72px;color:var(--accent-red);opacity:${fade(t, 119.54, 8)}">−30%</div>` +
    lab(486, l2, 'Translation,<br>other languages') + bar(541, b2, 0) +
    `<div class="a val" style="left:486px;top:958.0px;width:300px;text-align:center;font-size:72px;color:var(--accent-red);opacity:${fade(t, 120.74, 8)}"><span style="font-family:'DM Sans';font-weight:500;font-size:30px;color:var(--text-secondary);margin-right:12px">about</span>−20%</div>` +
    lab(762, l3, '&ldquo;About Us&rdquo;<br>page writing') + bar(817, b3, g3) +
    `<div class="a val" style="left:762px;top:1498.0px;width:300px;text-align:center;font-size:72px;color:var(--accent-red);opacity:${fade(t, 123.36, 8)}">−50%</div><div class="src">Source: Teutloff et al., Journal of Economic Behavior<br>&amp; Organization, 2025 &middot; over 3 million freelance postings &middot;<br>vs. the market trend</div></div>`;
};

// C8-shift · total freelance demand went up (132.40-139.555): FELL left of the x588 rule, GREW right, one zero line y1040
const C8shift = (t: number) => {
  const badge = eOutCubic(lin(t, 133.98, 12));
  const up = lin(t, 135.72, 10);
  const upS = 0.8 + 0.2 * eOutCubic(up);
  const glowOff = lin(t, 137.54, 15);
  const badgeGlow = up * (1 - glowOff);
  const ml = eOutCubic(lin(t, 137.54, 20));
  const mlCount = Math.round(24 * clamp01((t - 137.54) / (138.2 - 137.54)));
  const fellLbl = (x: number, html: string) =>
    `<div class="a half" style="left:${x}px;top:958px;width:172px;text-align:center;font-family:'DM Sans';font-size:26px;font-weight:700;line-height:1.2;color:var(--text-secondary)">${html}</div>`;
  return `<div class="frame ch"><div class="orb" style="left:640px;top:-360px;width:760px;height:760px;background:rgba(0,230,138,.42)"></div><div class="hdr"><div class="ey">Same study &middot; same year</div><h1>Total freelance<br>demand went <span class="g">up</span></h1><div class="divider"></div></div><svg class="layer"><line x1="72" y1="1040" x2="1008" y2="1040" stroke="#3a4357" stroke-width="3"/><line x1="588" y1="430" x2="588" y2="1590" stroke="#1e2330" stroke-width="2" stroke-dasharray="4 8"/></svg><div class="a cat" style="left:72px;top:432px;font-size:24px;color:var(--accent-red)">Fell</div><div class="a cat" style="left:628px;top:432px;font-size:24px;color:var(--accent-green)">Grew</div>` +
    fellLbl(64, 'Translation<br>(Western)') +
    `<div class="a bar red half" style="left:90px;top:1040px;width:120px;height:270.0px;border-radius:0 0 8px 8px"></div><div class="a val half" style="left:50px;top:1324.0px;width:200px;text-align:center;font-size:44px;color:var(--accent-red)">−30%</div>` +
    fellLbl(236, 'Translation<br>(other)') +
    `<div class="a bar red half" style="left:262px;top:1040px;width:120px;height:180.0px;border-radius:0 0 8px 8px"></div><div class="a val half" style="left:222px;top:1234.0px;width:200px;text-align:center;font-size:44px;color:var(--accent-red)"><span style="font-family:'DM Sans';font-weight:500;font-size:24px;color:var(--text-secondary);margin-right:8px">about</span>−20%</div>` +
    fellLbl(408, '&ldquo;About Us&rdquo;<br>writing') +
    `<div class="a bar red half" style="left:434px;top:1040px;width:120px;height:450.0px;border-radius:0 0 8px 8px"></div><div class="a val half" style="left:394px;top:1504.0px;width:200px;text-align:center;font-size:44px;color:var(--accent-red)">−50%</div>` +
    `<div class="a card2" style="left:628px;top:500px;width:380px;height:190px;border-color:rgba(0,230,138,.45);text-align:center;opacity:${n3(badge)};transform:translateY(${n1((1 - badge) * 16)}px);box-shadow:0 0 44px rgba(0,230,138,${n3(0.42 * badgeGlow)})"><div class="cat" style="margin-top:30px;font-size:19px;color:var(--text-secondary)">Total freelance demand</div><div style="margin-top:22px;display:flex;align-items:center;justify-content:center;gap:20px;opacity:${n3(up)};transform:scale(${n3(upS)})"><svg width="62" height="54" viewBox="0 0 62 54"><polygon points="31,2 60,52 2,52" fill="#00e68a"/></svg><span class="val" style="font-size:84px;color:var(--accent-green)">UP</span></div></div>` +
    `<div class="a bar green glow-green" style="left:708px;top:${n1(1040 - 216 * ml)}px;width:220px;height:${n1(216 * ml)}px;border-radius:8px 8px 0 0;opacity:${ml > 0.003 ? 1 : 0}"></div><div class="a val" style="left:638px;top:${n1(1040 - 216 * ml - 20 - 80)}px;width:360px;text-align:center;font-size:80px;color:var(--accent-green);opacity:${fade(t, 137.54, 6)}">+${mlCount}%</div><div class="a" style="left:638px;top:1062px;width:360px;text-align:center;font-family:'DM Sans';font-size:30px;font-weight:700;line-height:1.2;color:${col(lin(t, 137.54, 12), SEC, PRI)}">Machine-learning<br>work</div><div class="src">Source: Teutloff et al., Journal of Economic Behavior<br>&amp; Organization, 2025 &middot; first year after ChatGPT &middot;<br>vs. the market trend</div></div>`;
};

// C11-count · HD Hyundai robots 129 -> 211 (168.90-173.95): 16 x 14 waffle, square 46, pitch 56, origin x97 y702
const C11count = (t: number) => {
  let rects = '';
  for (let i = 0; i < 129; i++) {
    const r = Math.floor(i / 16), c = i % 16;
    const x = 97 + 56 * c, y = 702 + 56 * r;
    const p = eOutCubic(lin(t, 168.9 + (r * (14 / 8)) / FPS, 5));   // 8 full rows + 1, row by row over 14f
    const s = 0.6 + 0.4 * p;
    rects += `<rect x="${x}" y="${y}" width="46" height="46" rx="9" fill="#c9cfdb" fill-opacity="${n3(0.62 * p)}" transform="translate(${x + 23} ${y + 23}) scale(${n3(s)}) translate(${-x - 23} ${-y - 23})"/>`;
  }
  const slots = lin(t, 170.28, 10);
  for (let k = 0; k < 82; k++) {
    const i = 129 + k;
    const r = Math.floor(i / 16), c = i % 16;
    const x = 97 + 56 * c, y = 702 + 56 * r;
    const fillP = lin(t, 171.08 + (k * (24 / 82)) / FPS, 3);
    rects += `<rect x="${x + 1.5}" y="${y + 1.5}" width="43" height="43" rx="8" fill="none" stroke="#00c2ff" stroke-opacity="${n3(0.55 * slots * (1 - fillP))}" stroke-width="2" stroke-dasharray="5 4"/>`;
    if (fillP > 0) rects += `<rect x="${x}" y="${y}" width="46" height="46" rx="9" fill="#00c2ff" fill-opacity="${n3(fillP)}" filter="url(#vc11gl)"/>`;
  }
  const count = 129 + Math.round(82 * clamp01((t - 171.08) / (171.88 - 171.08)));
  const arrow = lin(t, 170.28, 10);
  return `<div class="frame ch"><div class="orb" style="left:600px;top:-360px;width:760px;height:760px;background:rgba(0,194,255,.50)"></div><div class="hdr"><div class="ey">HD Hyundai shipyards &middot;<br>industrial and collaborative robots</div><h1>The robot count<br>is <span class="c">climbing</span></h1><div class="divider"></div></div><div class="a" style="left:72px;top:452px;width:300px"><div class="val" style="font-size:150px;color:var(--text-secondary)">129</div><div class="lbl" style="margin-top:6px">robots</div></div><div class="a" style="left:376px;top:500px;opacity:${n3(arrow)};clip-path:inset(0 ${n1(100 * (1 - arrow))}% 0 0)"><svg width="124" height="44" viewBox="0 0 124 44"><path d="M4 22 H116 M100 7 L118 22 L100 37" stroke="#00c2ff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="a" style="left:534px;top:452px;width:300px;opacity:${fade(t, 171.08, 4)}"><div class="val" style="font-size:150px;color:var(--accent-cyan);text-shadow:0 0 50px rgba(0,194,255,.35)">${count}</div><div class="lbl" style="margin-top:6px">robots</div></div><svg class="layer"><defs><filter id="vc11gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${rects}</svg><div class="a" style="left:97px;top:1512px;font-family:'DM Sans';font-size:40px;font-weight:700;color:var(--text-primary);white-space:nowrap;opacity:${fade(t, 172.02, 10)}">mostly for cutting and welding steel</div><div class="a" style="left:97px;top:1584px;font-family:'DM Sans';font-size:26px;color:var(--text-muted);white-space:nowrap"><span style="display:inline-block;width:20px;height:20px;border-radius:5px;background:#c9cfdb;opacity:.62;vertical-align:-2px;margin-right:12px"></span>one square = one robot</div><div class="src">Source: BusinessKorea via Cyprus Shipping News, Feb 27, 2026 &middot;<br>HD Hyundai shipbuilding affiliates &middot; arms and cobots, not humanoids</div></div>`;
};

// C12 · welding shortage (177.95-187.20): number on its own line (144 px), label under, 936 track under that
const C12 = (t: number) => {
  const r1 = eOutCubic(lin(t, 179.02, 12));
  const p1 = eOutQuart(lin(t, 180.62, 42));
  const r2 = eOutCubic(lin(t, 184.7, 12));
  const p2 = eOutQuart(lin(t, 185.58, 34));
  const plus = lin(t, 186.72, 6);
  const num = (final: string, live: string, color: string, show: number) =>
    `<span class="val" style="font-size:144px;color:${color};position:relative"><span style="visibility:hidden">${final}</span><span style="position:absolute;left:0;top:0;opacity:${n3(show)}">${live}</span></span>`;
  return `<div class="frame ch"><div class="orb" style="left:620px;top:-360px;width:760px;height:760px;background:rgba(255,215,0,.32)"></div><div class="hdr"><div class="ey">US welding workforce</div><h1>The industry cannot<br>find <span class="go">the people</span></h1><div class="divider"></div></div>` +
    `<div class="a" style="left:66px;top:590px;white-space:nowrap">${num('320,500', fmt(320500 * p1), 'var(--accent-gold)', lin(t, 180.62, 4))}</div><div class="a" style="left:72px;top:756px;white-space:nowrap;opacity:${n3(r1)};transform:translateY(${n1((1 - r1) * 12)}px)"><div style="font-family:'DM Sans';font-size:36px;font-weight:700;color:var(--text-primary);line-height:1.2">new welding professionals needed by <span class="mono">2029</span></div><div style="font-family:'DM Sans';font-size:28px;color:var(--text-muted);margin-top:6px">projected</div></div><div class="a" style="left:72px;top:868px;width:936px;height:72px;border-radius:12px;background:#141821;border:1px solid var(--border)"></div><div class="a bar gold glow-gold" style="left:72px;top:868px;width:${n1(857.1 * p1)}px;height:72px;border-radius:12px;opacity:${p1 > 0.001 ? 1 : 0}"></div>` +
    `<div class="a" style="left:66px;top:1046px;white-space:nowrap">${num('157,000+', fmt(157000 * p2) + `<span style="opacity:${n3(plus)}">+</span>`, 'var(--accent-red)', lin(t, 185.58, 4))}</div><div class="a" style="left:72px;top:1212px;white-space:nowrap;opacity:${n3(r2)};transform:translateY(${n1((1 - r2) * 12)}px)"><div style="font-family:'DM Sans';font-size:36px;font-weight:700;color:var(--text-primary);line-height:1.2">welding professionals approaching retirement</div><div style="font-family:'DM Sans';font-size:28px;color:var(--text-muted);margin-top:6px">more than <span class="mono">157,000</span></div></div><div class="a" style="left:72px;top:1324px;width:936px;height:72px;border-radius:12px;background:#141821;border:1px solid var(--border)"></div><div class="a bar hred glow-red" style="left:72px;top:1324px;width:${n1(419.9 * p2)}px;height:72px;border-radius:12px;opacity:${p2 > 0.001 ? 1 : 0}"></div>` +
    `<div class="src">Source: weldingworkforcedata.com (Lightcast data, endorsed by<br>the American Welding Society) &middot; both bars on one scale</div></div>`;
};

// C21 · 1.6 million maintenance workers (275.75-281.10): stacked number like C10, chip on two lines
const C21 = (t: number) => {
  const p = eOutQuart(lin(t, 278.2, 44));
  const chip = eOutCubic(lin(t, 279.92, 10));
  return `<div class="frame ch"><div class="orb" style="left:380px;top:1150px;width:880px;height:880px;background:rgba(0,194,255,.42)"></div><div class="a ey" style="left:72px;top:440px;margin:0;line-height:1.45">BLS Occupational<br>Outlook Handbook &middot; 2025</div><div class="a" style="left:58px;top:540px;white-space:nowrap;opacity:${fade(t, 278.2, 5)}"><div class="val" style="font-size:340px;color:var(--accent-cyan);letter-spacing:-.02em;text-shadow:0 0 60px rgba(0,194,255,.28)">${n1(1.6 * p)}</div><div class="val" style="font-size:120px;font-weight:400;color:var(--text-secondary);letter-spacing:.06em;margin:8px 0 0 14px">MILLION</div></div><div class="a" style="left:72px;top:1060px;font-family:'Playfair Display',serif;font-weight:700;font-size:64px;line-height:1.1;color:var(--text-primary);white-space:nowrap">general maintenance and<br>repair workers, US</div><div class="a val" style="left:72px;top:1220px;font-size:32px;font-weight:400;color:var(--text-muted);opacity:${fade(t, 279.67, 8)}">1,621,800 jobs in 2025</div><div class="a divider" style="left:72px;top:1282px;margin:0"></div><div class="a chip" style="left:72px;top:1330px;white-space:normal;line-height:1.25;font-size:40px;opacity:${n3(chip)};transform:translateX(${n1((1 - chip) * -24)}px)">about <span class="mono c">148,700</span> openings a year<div style="font-weight:500;font-size:28px;color:var(--text-muted);margin-top:8px">projected, <span class="mono">2025</span> to <span class="mono">2035</span></div></div><div class="src">Source: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook,<br>General Maintenance and Repair Workers (Oct 29, 2026)</div></div>`;
};

// C32 · 70% vs 30% (385.72-394.47): 8 px / point, values ride 22 px above the bar top
const C32 = (t: number) => {
  const pr = eOutCubic(lin(t, 387.61, 24));
  const pc = eOutCubic(lin(t, 391.19, 18));
  const hand = lin(t, 393.27, 12);
  const hr = 560 * pr, hc = 240 * pc;
  return `<div class="frame ch"><div class="orb" style="left:600px;top:-360px;width:760px;height:760px;background:rgba(0,194,255,.45)"></div><div class="hdr"><div class="ey">One poll &middot; March 2026</div><h1>It will happen to<br><span class="c">somebody else</span></h1><div class="divider"></div></div><svg class="layer"><line x1="176" y1="560" x2="1008" y2="560" stroke="#1e2330" stroke-width="2" stroke-dasharray="4 8"/><line x1="176" y1="1360" x2="1008" y2="1360" stroke="#3a4357" stroke-width="3"/></svg><div class="a val" style="left:72px;top:547px;width:92px;text-align:right;font-size:26px;color:var(--text-muted)">100%</div><div class="a val" style="left:72px;top:1347px;width:92px;text-align:right;font-size:26px;color:var(--text-muted)">0%</div>` +
    `<div class="a bar red" style="left:230px;top:${n1(1360 - hr)}px;width:300px;height:${n1(hr)}px;border-radius:10px 10px 0 0;opacity:${pr > 0.002 ? 1 : 0};box-shadow:0 0 44px rgba(255,64,96,${n3(0.45 * (1 - hand))})"></div><div class="a val" style="left:160px;top:${n1(1360 - hr - 22 - 112)}px;width:440px;text-align:center;font-size:112px;color:var(--accent-red);opacity:${fade(t, 387.61, 5)}">${Math.round(70 * pr)}%</div><div class="a" style="left:170px;top:1384px;width:420px;text-align:center;line-height:1.15;opacity:${fade(t, 388.73, 10)}"><div style="font-family:'DM Sans';font-size:38px;font-weight:700;color:var(--text-primary)">say AI will<br>cut jobs</div><div style="font-family:'DM Sans';font-size:27px;color:var(--text-muted);margin-top:8px">US adults</div></div>` +
    `<div class="a bar cyan" style="left:650px;top:${n1(1360 - hc)}px;width:300px;height:${n1(hc)}px;border-radius:10px 10px 0 0;opacity:${pc > 0.002 ? 1 : 0};box-shadow:0 0 44px rgba(0,194,255,${n3(0.45 * hand)})"></div><div class="a val" style="left:580px;top:${n1(1360 - hc - 22 - 112)}px;width:440px;text-align:center;font-size:112px;color:var(--accent-cyan);opacity:${fade(t, 391.19, 5)}">${Math.round(30 * pc)}%</div><div class="a" style="left:590px;top:1384px;width:420px;text-align:center;line-height:1.15;opacity:${fade(t, 391.95, 10)}"><div style="font-family:'DM Sans';font-size:38px;font-weight:700;color:var(--text-primary)">worry about<br>their own job</div><div style="font-family:'DM Sans';font-size:27px;color:var(--text-muted);margin-top:8px">adults with a job</div></div>` +
    `<div class="src">Source: Quinnipiac University Poll, March 30, 2026 &middot;<br>1,397 US adults; own-job question: 800 employed adults,<br>very or somewhat concerned</div></div>`;
};

// C33 · blue-collar split, about 3 in 4 (394.47-402.23): the two panels STACKED (red on top, cyan below)
const C33 = (t: number) => {
  const fig = (x: number, y: number, litP: number, color: string, glowId: string) => {
    const s = 0.9 + 0.1 * eOutCubic(litP);
    const body = (fillC: string, stroke: boolean) =>
      `<circle cx="60.0" cy="38" r="34" fill="${fillC}"${stroke ? ' stroke="#2a3142" stroke-width="2.5"' : ''}/><path d="M6 196 L6 144 C6 106 30 84 60 84 C90 84 114 106 114 144 L114 196 Z" fill="${fillC}"${stroke ? ' stroke="#2a3142" stroke-width="2.5"' : ''}/>`;
    const lit = litP > 0
      ? `<g transform="translate(60 98) scale(${n3(s)}) translate(-60 -98)" opacity="${n3(litP)}" filter="url(#${glowId})">${body(color, false)}</g>`
      : '';
    return `<g transform="translate(${x},${y})">${body('#161a23', true)}${lit}</g>`;
  };
  const L = [0, 1, 2].map((i) => lin(t, 396.95 + (i * 5) / FPS, 6));
  const R = [0, 1, 2].map((i) => lin(t, 399.99 + (i * 5) / FPS, 6));
  const bl = lin(t, 396.95, 12), br = lin(t, 399.99, 12);
  const panel = (top: number, p: number, rgb: string) =>
    `<div class="a card2" style="left:72px;top:${top}px;width:936px;height:506px;border-color:${interpolateColors(p, [0, 1], ['#1e2330', `rgba(${rgb},.55)`])};box-shadow:0 0 50px rgba(${rgb},${n3(0.14 * p)});"></div>`;
  const ratio = (top: number, c: string, t0: number) =>
    `<div class="a" style="left:72px;top:${top}px;width:936px;text-align:center;white-space:nowrap;${riseStyle(t, t0, 12, 12)}"><span style="font-family:'DM Sans';font-size:36px;font-weight:500;color:var(--text-secondary);margin-right:16px">about</span><span class="val" style="font-size:104px;color:${c}">3</span><span style="font-family:DM Sans;font-size:60px;font-weight:700;color:${c};margin:0 18px">in</span><span class="val" style="font-size:104px;color:${c}">4</span></div>`;
  const stmt = (top: number, text: string, t0: number) =>
    `<div class="a" style="left:72px;top:${top}px;width:936px;text-align:center;font-family:'DM Sans';font-size:42px;font-weight:700;color:var(--text-primary);white-space:nowrap;${riseStyle(t, t0, 12, 12)}">${text}</div>`;
  return `<div class="frame ch"><div class="orb" style="left:600px;top:-360px;width:760px;height:760px;background:rgba(0,194,255,.42)"></div><div class="hdr"><div class="ey">Blue-collar workers &middot; same poll</div><h1>Blue-collar workers<br>show it <span class="c">the most</span></h1><div class="divider"></div></div>` +
    panel(452, bl, '255,64,96') + ratio(720, '#ff4060', 397.83) + stmt(856, 'say AI will cut jobs', 397.83) +
    panel(1000, br, '0,194,255') + ratio(1268, '#00c2ff', 400.69) + stmt(1404, 'are not worried about theirs', 400.69) +
    `<svg class="layer"><defs><filter id="vc33gr" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="vc33gc" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    fig(180, 496, L[0], '#ff4060', 'vc33gr') + fig(380, 496, L[1], '#ff4060', 'vc33gr') + fig(580, 496, L[2], '#ff4060', 'vc33gr') + fig(780, 496, 0, '#ff4060', 'vc33gr') +
    fig(180, 1044, R[0], '#00c2ff', 'vc33gc') + fig(380, 1044, R[1], '#00c2ff', 'vc33gc') + fig(580, 1044, R[2], '#00c2ff', 'vc33gc') + fig(780, 1044, 0, '#00c2ff', 'vc33gc') +
    `</svg><div class="src">Source: Quinnipiac University Poll, March 2026, crosstab:<br>blue-collar workers (about 270 people) &middot; rounded on purpose</div></div>`;
};

// C36 · guessed 30% vs measured 75% (419.50-428.30): the race lane turned into a VERTICAL gauge (x330, 0% y1420 to 100% y580)
const C36 = (t: number) => {
  const cm = lin(t, 422.17, 12);
  const cs = 1.4 - 0.4 * eOutCubic(cm);
  const seg = eInOutCubic(lin(t, 426.51, 30));
  const y2 = 1168 + (790 - 1168) * seg;
  const segOn = t >= 426.51;
  const land = lin(t, 427.49, 8);
  const ticks = [1420, 1210, 1000, 790, 580].map((y) => `<line x1="262" y1="${y}.0" x2="274" y2="${y}.0" stroke="#3a4357" stroke-width="2"/>`).join('');
  const tickLbl = [['1407.0', '0%'], ['1197.0', '25%'], ['987.0', '50%'], ['777.0', '75%'], ['567.0', '100%']]
    .map(([y, s]) => `<div class="a val" style="left:72px;top:${y}px;width:172px;text-align:right;font-size:26px;color:var(--text-muted)">${s}</div>`).join('');
  return `<div class="frame ch"><div class="orb" style="left:600px;top:-360px;width:760px;height:760px;background:rgba(255,64,96,.46)"></div><div class="hdr"><div class="ey">One study &middot; Germany, 2022</div><h1>Workers in the most<br><span class="re">automatable</span> jobs</h1><div class="divider"></div></div><svg class="layer"><defs><linearGradient id="vc36gap" gradientUnits="userSpaceOnUse" x1="0" y1="1168.0" x2="0" y2="790.0"><stop offset="0" stop-color="#00c2ff" stop-opacity=".85"/><stop offset="1" stop-color="#ff4060" stop-opacity=".85"/></linearGradient><filter id="vc36g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="330" y1="580" x2="330" y2="1420" stroke="#1e2330" stroke-width="14" stroke-linecap="round"/>${ticks}` +
    (segOn ? `<line x1="330" y1="1168.0" x2="330" y2="${n1(y2)}" stroke="url(#vc36gap)" stroke-width="14"/>` : '') +
    `<g opacity="${n3(cm)}" transform="translate(330 1168) scale(${n3(cs)}) translate(-330 -1168)"><circle cx="330" cy="1168.0" r="44" fill="rgba(0,194,255,.18)"/><circle cx="330" cy="1168.0" r="24" fill="#00c2ff" filter="url(#vc36g)"/></g>` +
    (segOn ? `<circle cx="330" cy="${n1(y2)}" r="44" fill="rgba(255,64,96,.18)"/><circle cx="330" cy="${n1(y2)}" r="24" fill="#ff4060" filter="url(#vc36g)"/>` : '') +
    `</svg>${tickLbl}<div class="a" style="left:430px;top:724.0px;width:560px;opacity:${n3(land)}"><div class="val" style="font-size:124px;color:var(--accent-red)">75%</div><div style="font-family:'DM Sans';font-size:42px;font-weight:700;color:var(--text-primary);margin-top:12px;white-space:nowrap">what was measured</div></div><div class="a" style="left:430px;top:1102.0px;width:560px;${riseStyle(t, 423.03, 12, 12)}"><div class="val" style="font-size:124px;color:var(--accent-cyan)">30%</div><div style="font-family:'DM Sans';font-size:42px;font-weight:700;color:var(--text-primary);margin-top:12px;white-space:nowrap">what they guessed</div></div><div class="a val" style="left:430px;top:977.0px;font-size:32px;color:var(--text-primary);opacity:${n3(land)}">45-point gap</div><div class="a" style="left:72px;top:1478px;width:936px;font-family:'DM Sans';font-size:30px;line-height:1.35;color:var(--text-secondary)">share of their job’s core tasks a machine could do,<br>with the technology of <span class="mono">2019</span></div><div class="src">Source: Lergetporer, Wedel, Werner, IZA DP 16687 &middot;<br>3,012 employed people, May/June 2022 &middot; medians &middot;<br>tasks, not job loss</div></div>`;
};

// chart id -> portrait frame template (the vertical comp routes each `kind: 'chart'` COVERS row here by its ref)
export const V_CHART_TEMPLATES: Record<string, (t: number) => string> = {
  C10, C7, C6, C3, C8, 'C8-shift': C8shift, 'C11-count': C11count, C12, C21, C32, C33, C36,
};

// the portrait chart stage (1080x1920): scoped stylesheet + the frame for source second t; `push` = a whole-beat slow push
export const VChartStage: React.FC<{ id: string; t: number; push?: [number, number, number, number] }> = ({ id, t, push }) => {
  const tpl = V_CHART_TEMPLATES[id];
  if (!tpl) throw new Error(`no portrait animated chart template for ${id}`);
  const s = push ? interpolate(t, [push[0], push[1]], [push[2], push[3]], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return (
    <div className="aidl" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0a0c10' }}>
      <style>{CHART_CSS}</style>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: '50% 50%' }}
        dangerouslySetInnerHTML={{ __html: tpl(t) }} />
    </div>
  );
};
