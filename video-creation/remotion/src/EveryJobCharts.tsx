// EveryJobCharts.tsx: the 31 Type 1 ANIMATED charts of every-job (comp-build §7, charts.md), animated FOR REAL.
// Each chart renders chart-builder's approved PAYOFF markup (EveryJobChartMarkup.ts, generated from
// assets/charts/<id>.html, one locked stylesheet scoped under .ejc) and drives, frame by frame, every element that
// differs between the design states, on the word cues of assets/charts/<id>.spec.md (SOURCE seconds; the comp passes
// t = the source time of the absolute frame, published from useCurrentFrame() at the comp root). No PNG is ever held.
import React from 'react';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadPF } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadJB } from '@remotion/google-fonts/JetBrainsMono';
import { CHART_CSS, CHART_TPL, CHART_SEG } from './EveryJobChartMarkup';

loadDM('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
loadDM('italic', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
loadPF('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadPF('italic', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadJB('normal', { weights: ['400', '600'], subsets: ['latin'] });

// Mike 2026-10-08 (draft v1 review): the corner tier pills (DEPLOYED / CLAIMED / FORECAST) are unnecessary. The approved
// sources assets/charts/<id>.html now carry `.badge.dep,.badge.for,.badge.cla,.badge.fc{display:none!important}` (every
// state PNG re-shot); EveryJobChartMarkup.ts was generated before that, so the same rule is scoped in here.
const PILLS_OFF = '.ejc .badge.dep,.ejc .badge.for,.ejc .badge.cla,.ejc .badge.fc{display:none!important}';
export const ChartStyle: React.FC = () => <style>{CHART_CSS + ' ' + PILLS_OFF}</style>;

// ------------------------------------------------------------------ math
const cl = (v: number) => Math.max(0, Math.min(1, v));
const pr = (t: number, a: number, b: number) => cl((t - a) / Math.max(1e-6, b - a));
const eOut = (x: number) => 1 - Math.pow(1 - x, 3);
const eIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eBack = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const bump = (t: number, a: number, b: number) => Math.sin(Math.PI * pr(t, a, b));   // 0 -> 1 -> 0
const fmt = (v: number) => Math.round(v).toLocaleString('en-US');
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ------------------------------------------------------------------ markup ops (all on balanced fragments)
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'stop']);
const toks = (s: string) => s.match(/<[^>]+>|[^<]+/g) ?? [];
const depth = (tk: string) => {
  if (!tk.startsWith('<')) return 0;
  if (tk.startsWith('</')) return -1;
  if (tk.endsWith('/>')) return 0;
  const m = tk.match(/^<([a-zA-Z0-9]+)/);
  return m && VOID.has(m[1].toLowerCase()) ? 0 : 1;
};
/** top-level sibling elements (and non-blank text runs) of a balanced fragment */
const splitTop = (html: string): string[] => {
  const out: string[] = []; let cur = ''; let d = 0;
  for (const tk of toks(html)) {
    cur += tk; d += depth(tk);
    if (d === 0) { if (cur.trim()) out.push(cur); cur = ''; }
  }
  if (cur.trim()) out.push(cur);
  return out;
};
/** inject CSS into the FIRST tag's style attribute (adds one if missing) */
const css = (el: string, c: string) => {
  const m = el.match(/^<[^>]+>/);
  if (!m) return el;
  let tag = m[0];
  if (/\sstyle="/.test(tag)) tag = tag.replace(/\sstyle="([^"]*)"/, (_, s) => ` style="${s}${s && !s.trim().endsWith(';') ? ';' : ''}${c}"`);
  else tag = tag.replace(/\s*(\/?)>$/, ` style="${c}"$1>`);
  return tag + el.slice(m[0].length);
};
/** set an attribute on the FIRST tag */
const attr = (el: string, name: string, val: string | number) => {
  const m = el.match(/^<[^>]+>/);
  if (!m) return el;
  let tag = m[0];
  const re = new RegExp(`\\s${name}="[^"]*"`);
  tag = re.test(tag) ? tag.replace(re, ` ${name}="${val}"`) : tag.replace(/\s*(\/?)>$/, ` ${name}="${val}"$1>`);
  return tag + el.slice(m[0].length);
};
const num = (el: string, name: string) => parseFloat((el.match(new RegExp(`\\s${name}="([-0-9.]+)"`)) ?? ['', 'NaN'])[1]);
/** every tag of a fragment matching `re` is mapped by fn */
const eachTag = (html: string, re: RegExp, fn: (tag: string, i: number) => string) => {
  let i = 0;
  return html.replace(/<[^>]+>/g, (tg) => (re.test(tg) ? fn(tg, i++) : tg));
};
/** element-level edit of a template: the balanced element whose opening tag contains `marker` */
const editEl = (html: string, marker: string, fn: (el: string) => string) => {
  const at = html.indexOf(marker);
  if (at < 0) return html;
  const s = html.lastIndexOf('<', at);
  let d = 0, k = s;
  const re = /<[^>]+>|[^<]+/g; re.lastIndex = s;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) { d += depth(m[0]); k = re.lastIndex; if (d === 0) break; }
  return html.slice(0, s) + fn(html.slice(s, k)) + html.slice(k);
};
/** HTML element fade (+ rise / scale); SVG element fade via <g> */
const fadeH = (el: string, p: number, dy = 0, sc?: number) =>
  p >= 1 && !sc ? el : p <= 0 ? css(el, 'opacity:0;') : css(el, `opacity:${p.toFixed(3)};transform:translateY(${((1 - p) * dy).toFixed(1)}px)${sc ? ` scale(${sc.toFixed(4)})` : ''};`);
const fadeS = (el: string, p: number) => (p >= 1 ? el : `<g opacity="${p.toFixed(3)}">${el}</g>`);
const scaleS = (el: string, s: number, cx: number, cy: number) => (Math.abs(s - 1) < 1e-4 ? el : `<g transform="translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})">${el}</g>`);
/** the C4 stamp slam: scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, settles in 4 frames */
const slam = (el: string, t: number, t0: number, s0 = 1.35) => {
  if (t < t0) return '';
  const p = pr(t, t0, t0 + 0.22); const e = eOut(p);
  return css(el, `opacity:${cl(p * 2.5).toFixed(3)};transform:rotate(${(-10 + 4 * e).toFixed(2)}deg) scale(${(s0 - (s0 - 1) * e).toFixed(4)});`);
};
/** a lamp ignites: 3-frame flicker (0, .7, .2, 1) of the lit markup over the dark one */
const ignite = (off: string, on: string, t: number, t0: number) => {
  if (t < t0) return off;
  const f = Math.floor((t - t0) * 30 + 1e-6);
  const o = [0, 0.7, 0.2][f] ?? 1;
  return o >= 1 ? on : off + `<g opacity="${o}">${on}</g>`;
};
/** stroke draw-on for SVG lines/paths/circles (pathLength-normalised dashoffset) */
const draw = (el: string, p: number) => (p >= 1 ? el : css(attr(attr(attr(el, 'pathLength', 1), 'stroke-dasharray', '1 1'), 'stroke-dashoffset', (1 - p).toFixed(4)), ''));
const tpl = (id: string, vals: Record<number, string>) => {
  const seg = CHART_SEG[id];
  return CHART_TPL[id].replace(/\{\{(\d+)\}\}/g, (_, n) => (vals[+n] !== undefined ? vals[+n] : seg[+n][1]));
};
const S = (id: string) => CHART_SEG[id];
const expect = (id: string, n: number) => { if (S(id).length !== n) throw new Error(`${id}: ${S(id).length} slots, choreography expects ${n}`); };

// ------------------------------------------------------------------ the C4 job card (12 cards, one template)
type JobCfg = { count: [number, number, number, number?]; dec?: number; lamp?: [number, 'fill' | 'outline']; stamp?: number; sub?: [number, number]; pulse?: [number, number] };
const jobCard = (id: string, c: JobCfg) => (t: number) => {
  const seg = S(id); const v: Record<number, string> = {};
  seg.forEach(([a, b], i) => {
    if (/^[0-9.,%+]+$/.test(a) && /^[0-9.,%+]+$/.test(b)) {
      const target = parseFloat(b.replace(/,/g, ''));
      const val = target * eOut(pr(t, c.count[0], c.count[1]));
      v[i] = c.dec ? val.toFixed(c.dec) : fmt(val);
    } else if (b.includes('class="stamp')) {
      v[i] = c.stamp !== undefined ? slam(b, t, c.stamp) : b;
    } else if (a.includes('<circle') && c.lamp) {
      if (c.lamp[1] === 'fill') v[i] = ignite(a, b, t, c.lamp[0]);
      else if (t < c.lamp[0]) v[i] = a;
      else {
        const p = eOut(pr(t, c.lamp[0], c.lamp[0] + 0.3));
        v[i] = b.replace(/<circle([^>]*)fill="none"([^>]*)\/>/, (m) => draw(m, p));
      }
    } else if (b.includes('COMPANY-REPORTED') && c.lamp) {
      v[i] = t < c.lamp[0] ? '' : fadeS(b, pr(t, c.lamp[0], c.lamp[0] + 0.3));
    } else if (b.includes('the job they told you') && c.sub) {
      v[i] = t < c.sub[0] ? css(b, 'opacity:0;') : fadeH(b, eOut(pr(t, c.sub[0], c.sub[1])), 12);
    }
  });
  let html = tpl(id, v);
  if (c.pulse) {
    const k = bump(t, c.pulse[0], c.pulse[1]);
    if (k > 0) html = editEl(html, 'left:140px;top:700px;width:470px;height:150px', (el) => css(el, `transform:scale(${(1 + 0.04 * k).toFixed(4)});border-color:rgba(0,194,255,${(0.25 + 0.6 * k).toFixed(3)});`));
  }
  return html;
};

// ------------------------------------------------------------------ choreographies (spec tables, SOURCE seconds)
type Choreo = (t: number) => string;
const CH: Record<string, Choreo> = {};

// H0: 13,000 humanoids, the 13-figure strip locked to the counter, '2025' flashes (the DEPLOYED badge stamp 32.96-33.20
// on 'shipped' is REMOVED, Mike 2026-10-08: tier badges off)
CH['H0'] = (t) => {
  expect('H0', 15);
  const seg = S('H0'); const v: Record<number, string> = {};
  const val = 13000 * eOut(pr(t, 31.3, 32.3));
  v[0] = fmt(val);
  for (let i = 1; i <= 13; i++) v[i] = attr(seg[i][1], 'opacity', (0.12 + 0.88 * cl((val - (i - 1) * 1000) / 1000)).toFixed(3));
  v[14] = '';                                                        // slot 14 = the DEPLOYED badge: never drawn
  let html = tpl('H0', v);
  const k = bump(t, 33.58, 33.9);
  if (k > 0) html = html.replace('<span class="num" style="color:var(--accent-cyan)">2025</span>', `<span class="num" style="color:var(--accent-cyan);display:inline-block;transform:scale(${(1 + 0.06 * k).toFixed(4)})">2025</span>`);
  return html;
};

// C5 ladder helpers
const growRects = (frag: string, w: (row: number, isGlow: boolean, full: number) => number, op?: (row: number, isGlow: boolean) => number) =>
  splitTop(frag).map((r) => {
    const y = num(r, 'y'); const full = num(r, 'width'); const row = Math.round((916 - y) / 58); const glow = r.includes('filter=');
    let out = attr(r, 'width', Math.max(0, w(row, glow, full)).toFixed(1));
    if (op) out = attr(out, 'opacity', op(row, glow).toFixed(3));
    return out;
  }).join('');
// C5-tease: rungs 0..11 climb bottom first (0.15 s apart, 0.35 s each); the top glow blooms + NEUROSURGEON
CH['C5-tease'] = (t) => {
  expect('C5-tease', 2);
  const seg = S('C5-tease');
  const g = pr(t, 52.98, 53.3);
  const v = {
    0: growRects(seg[0][1], (row, glow, full) => full * eOut(pr(t, 51.12 + 0.15 * row, 51.47 + 0.15 * row)), (row, glow) => (glow ? 0.55 * g : row === 11 ? 1 : 0.62)),
    1: fadeH(seg[1][1], g, 8),
  };
  return tpl('C5-tease', v);
};
// C5-climb: rows 0..8 fill (0.08 s apart, 0.25 s), values pop as each lands; the programmer bar jumps (easeOutBack)
CH['C5-climb'] = (t) => {
  expect('C5-climb', 22);
  const seg = S('C5-climb'); const v: Record<number, string> = {};
  const land = (row: number) => 577.42 + 0.08 * row + 0.25;
  const dim = pr(t, 578.3, 578.9);
  for (let r = 0; r <= 8; r++) {
    const full = num(seg[r][1], 'width');
    v[r] = attr(attr(seg[r][1], 'width', (full * eOut(pr(t, 577.42 + 0.08 * r, land(r)))).toFixed(1)), 'opacity', lerp(1, 0.62, dim).toFixed(3));
  }
  const jp = pr(t, 578.3, 578.9);
  v[9] = jp <= 0 ? '' : splitTop(seg[9][1]).map((r) => {
    const w = 1030.1 * eBack(jp);
    return r.includes('filter=') ? attr(attr(r, 'width', w.toFixed(1)), 'opacity', (0.55 * jp).toFixed(3)) : attr(r, 'width', w.toFixed(1));
  }).join('');
  // labels (start muted -> payoff secondary as their bar starts) + values (pop on landing)
  for (let i = 10; i <= 19; i++) {
    const row = i - 10;                       // label row of this slot
    const parts = splitTop(seg[i][1]);
    const label = parts[parts.length - 1];
    const lab = t >= (row === 9 ? 578.3 : 577.42 + 0.08 * row) ? label : seg[i][0].split('</div>')[0] + '</div>';
    const value = parts.length > 1 ? parts[0] : '';
    const vr = row - 1;                        // the value belongs to the row below
    const vp = value ? pr(t, land(vr), land(vr) + 0.12) : 0;
    v[i] = (value ? (t < land(vr) ? '' : fadeH(value, vp, 0, 1 + 0.15 * (1 - eOut(vp)))) : '') + lab;
  }
  const vp9 = pr(t, 578.85, 579.0);
  v[20] = t < 578.85 ? '' : fadeH(seg[20][1], vp9, 0, 1 + 0.2 * (1 - eOut(vp9)));
  v[21] = t < 579.0 ? '' : splitTop(seg[21][1]).map((el) => fadeH(el, eOut(pr(t, 579.0, 579.4)), -12)).join('');
  return tpl('C5-climb', v);
};
// C5-top: the ladder dims, the neurosurgeon bar grows past every rung with a live counter, lands on 829,161
CH['C5-top'] = (t) => {
  expect('C5-top', 25);
  const seg = S('C5-top'); const v: Record<number, string> = {};
  const dim = pr(t, 634.32, 634.9);
  for (let r = 0; r <= 10; r++) v[r] = attr(seg[r][1], 'opacity', lerp(1, 0.62, dim).toFixed(3));
  const gp = eIO(pr(t, 635.76, 638.66));
  const w = 1180 * gp;
  const landed = t >= 638.66;
  v[11] = gp <= 0 ? '' : splitTop(seg[11][1]).map((r) => (r.includes('filter=')
    ? attr(attr(r, 'width', w.toFixed(1)), 'opacity', (0.55 * pr(t, 638.66, 638.96)).toFixed(3))
    : attr(r, 'width', w.toFixed(1)))).join('');
  for (let i = 12; i <= 22; i++) v[i] = dim >= 0.5 ? seg[i][1] : seg[i][0];
  const parts23 = splitTop(seg[23][1]);
  const startLabel = seg[23][0];
  v[23] = fadeH(parts23[0], pr(t, 638.66, 638.96)) + (t >= 634.32 ? parts23.slice(1).join('') : startLabel);
  v[24] = landed ? fadeH(seg[24][1], pr(t, 638.66, 638.8)) : (gp > 0
    ? `<div class="abs num" style="left:${(548 + w + 14).toFixed(1)}px;top:281px;font-size:32px;color:#ffffff">${fmt(829161 * gp)}</div>` : '');
  return tpl('C5-top', v);
};

// C11: 2026 bar grows with its count riding above, then 2025, the bracket draws, 'about 7x', the label brightens
CH['C11'] = (t) => {
  expect('C11', 2);
  const seg = S('C11');
  const [b25, g25, b26, g26, brk] = splitTop(seg[0][1]);
  const p26 = eOut(pr(t, 88.1, 89.66)), p25 = eOut(pr(t, 90.48, 91.1));
  const bar = (el: string, h: number) => attr(attr(el, 'height', h.toFixed(1)), 'y', (900 - h).toFixed(1));
  const h26 = 520 * p26, h25 = 75.2 * p25;
  const s0 = (p26 > 0 ? bar(b26, h26) + bar(g26, h26) : '') + (p25 > 0 ? bar(b25, h25) + bar(g25, h25) : '') + (t >= 91.1 ? draw(brk, eOut(pr(t, 91.1, 91.42))) : '');
  const [v25, v26, sev] = splitTop(seg[1][1]);
  const val = (el: string, n: number, h: number) => css(el.replace(/>[0-9,]+</, `>${fmt(n)}<`), `top:${(900 - h - 96).toFixed(1)}px;`);
  const s1 = (p26 > 0 ? val(v26, 120136 * p26, h26) : '') + (p25 > 0 ? val(v25, 17375 * p25, h25) : '')
    + (t >= 91.42 ? fadeH(sev, eOut(pr(t, 91.42, 91.8)), 20) : '');
  let html = tpl('C11', { 0: s0, 1: s1 });
  const lb = pr(t, 92.2, 93.34);
  if (lb > 0) html = html.replace(/(>)(Jan to Sep <span class="num">2025<\/span>)/, `$1<span style="color:var(--bone);opacity:${(0.75 + 0.25 * lb).toFixed(2)}">$2</span>`);
  return html;
};

// C10R: opens on the old 15% read; the bar shrinks, the gap widens, 15 -> 19, the chip crosses; 'behind' flashes
CH['C10R'] = (t) => {
  expect('C10R', 4);
  const seg = S('C10R');
  const p = eOut(pr(t, 101.7, 102.16));
  const [bar, gap] = splitTop(seg[0][1]);
  const w = lerp(1037.0, 988.2, p);
  const s0 = attr(bar, 'width', w.toFixed(1)) + attr(attr(gap, 'x', (140 + w).toFixed(1)), 'width', (1360 - 140 - w).toFixed(1));
  const n = Math.round(lerp(15, 19, p));
  const crossed = p >= 0.5;
  let html = tpl('C10R', { 0: s0, 1: `${n}%`, 2: crossed ? seg[2][1] : seg[2][0], 3: crossed ? seg[3][1] : seg[3][0] });
  const k = bump(t, 102.74, 103.0);
  if (k > 0) html = html.replace('>behind</div>', `><span style="color:rgb(${Math.round(lerp(239, 227, k))},${Math.round(lerp(230, 35, k))},${Math.round(lerp(210, 47, k))})">behind</span></div>`);
  const lb = pr(t, 105.38, 106.06);
  if (lb > 0) html = html.replace('<b>less-exposed jobs</b>', `<b style="color:#fff;text-shadow:0 0 ${(18 * lb).toFixed(1)}px rgba(239,230,210,${(0.5 * lb).toFixed(2)})">less-exposed jobs</b>`);
  return html;
};

// horses-card: 20 ghosts fill solid (the count follows), the arrow + 1960, 17 go back to ghosts, 2 become the range
const HORSE_GHOST = (g: string) => g.replace(/fill="#c99c5c"/g, 'fill="none" stroke="#43382f" stroke-width="1.6" stroke-linejoin="round"');
CH['horses-card'] = (t) => {
  expect('horses-card', 21);
  const seg = S('horses-card'); const v: Record<number, string> = {};
  const fillAt = (k: number) => 167.12 + 0.05 * k;                    // k = 0..19 (row 1 L->R, then row 2)
  const ghostAt = (k: number) => 169.68 + 0.1 * (19 - k);              // horses 20 -> 4, last first
  const horse = (solid: string, k: number, final: string) => {
    if (t < fillAt(k)) return HORSE_GHOST(solid);
    if (k >= 3 && t >= ghostAt(k)) return final;                        // payoff ghost (#43382f)
    if ((k === 1 || k === 2) && t >= 171.3) return final;              // sepia range outline
    const p = pr(t, fillAt(k), fillAt(k) + 0.12);
    const m = solid.match(/translate\(([0-9.]+),([0-9.]+)\)/)!;
    const cx = parseFloat(m[1]) + 60, cy = parseFloat(m[2]) + 50;
    return p < 1 ? HORSE_GHOST(solid) + `<g opacity="${p.toFixed(3)}">${scaleS(solid, 0.85 + 0.15 * eOut(p), cx, cy)}</g>` : solid;
  };
  for (let i = 1; i <= 19; i++) v[i] = horse(seg[i][0], i, seg[i][1]);
  const [arrow, block] = splitTop(seg[0][1]);
  const ap = eOut(pr(t, 168.9, 169.68));
  const kids = splitTop(block.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, ''));
  const blockOpen = block.match(/^<div[^>]*>/)![0];
  const sl = pr(t, 171.52, 171.9);
  const kid0 = t < 168.9 ? css(kids[0], 'opacity:0;') : fadeH(kids[0], ap);
  const kid1 = t < 171.52 ? css(kids[1], 'opacity:0;') : css(kids[1], `opacity:${cl(sl * 3).toFixed(3)};transform:scale(${(1.12 - 0.12 * eOut(sl)).toFixed(4)});transform-origin:left center;`);
  const kid2 = t < 171.52 ? css(kids[2], 'opacity:0;') : fadeH(kids[2], sl);
  v[0] = (t < 168.9 ? '' : css(arrow, `clip-path:inset(0 ${((1 - ap) * 100).toFixed(1)}% 0 0);`)) + blockOpen + kid0 + kid1 + kid2 + '</div>';
  v[20] = t < 171.52 ? '' : fadeH(seg[20][1], sl);
  let html = tpl('horses-card', v);
  // horse 1 (static in both design states) fills with the others and stays solid; the '20' counts in step
  html = editEl(html, 'translate(146,612)', (g) => horse(g, 0, g));
  const filled = Array.from({ length: 20 }, (_, k) => k).filter((k) => t >= fillAt(k) + 0.06).length;
  html = html.replace('font-size:150px;line-height:1;color:var(--bone)">20<', `font-size:150px;line-height:1;color:var(--bone)">${filled}<`);
  return html;
};

// C2 / C2-surgeon: four lamps ignite on the four words, the rail draws between them, all four pulse on SAFER
const lampRow = (id: string, cy: number, times: [number, number, number, number], line: number, pulse: [number, number]) => (t: number) => {
  const seg = S(id); const v: Record<number, string> = {};
  const xs = [345, 755, 1165, 1575];
  const parts0 = splitTop(seg[0][1]);
  const rails = parts0.slice(0, 3);
  const on0 = parts0.slice(3).join('');
  const k = bump(t, pulse[0], pulse[1]);
  const lamp = (i: number, off: string, on: string) => {
    let el = ignite(off, on, t, times[i]);
    if (t >= times[i]) {
      const bloom = eOut(pr(t, times[i] + 0.1, times[i] + 0.28));
      el = el.replace(/stdDeviation="([0-9.]+)"/, (_, s) => `stdDeviation="${(parseFloat(s) * bloom).toFixed(1)}"`);
    }
    return scaleS(el, 1 + 0.04 * k, xs[i], cy);
  };
  const railEls = rails.map((r, i) => {
    const t0 = times[i + 1];
    if (t < t0) return '';
    const p = eOut(pr(t, t0, t0 + 0.28));
    const x1 = num(r, 'x1'), x2 = num(r, 'x2');
    return attr(r, 'x2', lerp(x1, x2, p).toFixed(1));
  }).join('');
  v[0] = railEls + lamp(0, seg[0][0], on0);
  for (let i = 1; i <= 3; i++) v[i] = lamp(i, seg[i][0], seg[i][1]);
  if (seg.length > 4) v[4] = t < line ? '' : fadeH(seg[4][1], eOut(pr(t, line, line + 0.54)), 10);
  return tpl(id, v);
};
CH['C2'] = (t) => { expect('C2', 5); return lampRow('C2', 560, [204.02, 204.58, 205.14, 206.18], 201.98, [206.18, 206.46])(t); };
CH['C2-surgeon'] = (t) => { expect('C2-surgeon', 4); return lampRow('C2-surgeon', 566, [683.3, 683.74, 684.06, 685.74], 1e9, [685.74, 685.98])(t); };

// figure-bmw-scoreboard: M..F pips light 0.2 s apart, PARTS and CARS count up, '+' snaps on landing
CH['figure-bmw-scoreboard'] = (t) => {
  expect('figure-bmw-scoreboard', 7);
  const seg = S('figure-bmw-scoreboard'); const v: Record<number, string> = {};
  for (let i = 0; i <= 4; i++) v[i] = t >= 249.98 + 0.2 * i ? seg[i][1] : seg[i][0];
  const cnt = (target: number, a: number, b: number) => (t >= b ? `${fmt(target)}+` : fmt(target * eOut(pr(t, a, b))));
  v[5] = cnt(90000, 252.28, 253.32);
  v[6] = cnt(30000, 254.52, 255.7);
  return tpl('figure-bmw-scoreboard', v);
};

// C6: the plumber's pay bar against the robot's rent: 499 a month, then the year (5,988), the caveat box
CH['C6'] = (t) => {
  expect('C6', 2);
  const seg = S('C6');
  const [pb, rb] = splitTop(seg[0][1]);
  const [pv, rv, buy, box] = splitTop(seg[1][1]);
  const pp = eOut(pr(t, 397.96, 398.82));
  const pw = 1300 * pp;
  const yr = eOut(pr(t, 404.38, 405.46));
  const rw = t < 402.44 ? 0 : lerp(10.2, 122.0, yr);
  let s0 = (pw > 0 ? attr(pb, 'width', pw.toFixed(1)) : '') + (rw > 0 ? attr(rb, 'width', rw.toFixed(1)) : '');
  let s1 = '';
  if (pw > 0) s1 += css(pv.replace(/>63,800</, `>${fmt(63800 * pp)}<`), `left:${(140 + pw - 24 - 640).toFixed(1)}px;opacity:${cl(pw / 400).toFixed(3)};`);
  if (t >= 402.44) {
    if (t < 404.38) {
      s1 += `<div class="abs" style="left:${(140 + 10.2 + 28).toFixed(1)}px;top:608px"><span class="num" style="font-size:66px;color:var(--pumpkin)">499</span><span style="font-family:'DM Sans';font-weight:700;font-size:32px;color:var(--bone)"> a month</span></div>`;
    } else if (t < 405.46) {
      s1 += `<div class="abs" style="left:${(140 + rw + 28).toFixed(1)}px;top:608px"><span class="num" style="font-size:66px;color:var(--pumpkin)">${fmt(lerp(499, 5988, yr))}</span><span style="font-family:'DM Sans';font-weight:700;font-size:32px;color:var(--bone)"> a year</span></div>`;
    } else s1 += rv;
  }
  if (t >= 405.46) s1 += fadeH(buy, eOut(pr(t, 405.46, 405.76)), 10);
  if (t >= 405.7) s1 += fadeH(box, eOut(pr(t, 405.7, 406.0)), 10);
  let html = tpl('C6', { 0: s0, 1: s1 });
  // the two row labels brighten on their words (they sit in the template as the design's muted labels)
  const l1 = pr(t, 396.74, 397.3), l2 = pr(t, 400.26, 400.62);
  html = html.replace(/(<div class="abs lbl"[^>]*top:2[0-9]{2}px[^>]*)>/, (m, a) => `${a};color:${l1 >= 1 ? 'var(--bone)' : l1 > 0 ? 'var(--bone-2)' : 'var(--ash)'}">`);
  html = html.replace(/(<div class="abs lbl"[^>]*top:5[0-9]{2}px[^>]*)>/, (m, a) => `${a};color:${l2 >= 1 ? 'var(--bone)' : l2 > 0 ? 'var(--bone-2)' : 'var(--ash)'}">`);
  return html;
};

// the twelve job cards
CH['C4-cashiers'] = jobCard('C4-cashiers', { count: [455.4, 456.42, 3106300], stamp: 457.16 });
CH['C4-taxi'] = jobCard('C4-taxi', { count: [465.16, 466.46, 455700], lamp: [467.56, 'fill'] });
CH['C4-warehouse'] = jobCard('C4-warehouse', { count: [479.9, 481.3, 6917800], stamp: 481.6 });
CH['C4-csr'] = jobCard('C4-csr', { count: [487.0, 488.28, 2666000], lamp: [488.98, 'fill'] });
CH['C4-roofers'] = jobCard('C4-roofers', { count: [501.8, 503.0, 166900], stamp: 504.08 });
CH['C4-truck'] = jobCard('C4-truck', { count: [513.24, 514.22, 2.22], dec: 2, lamp: [515.16, 'outline'] });
CH['C4-carpenters'] = jobCard('C4-carpenters', { count: [526.3, 527.22, 889700], lamp: [528.48, 'outline'], stamp: 529.48 });
CH['C4-electricians'] = jobCard('C4-electricians', { count: [538.9, 539.94, 821000], stamp: 541.18 });
CH['C4-plumbers'] = jobCard('C4-plumbers', { count: [557.3, 558.22, 510600], sub: [559.02, 559.42], stamp: 560.8 });
CH['C4-programmers'] = jobCard('C4-programmers', { count: [580.8, 581.3, 110800], stamp: 583.6 });
CH['C4-radiologists'] = jobCard('C4-radiologists', { count: [597.5, 598.52, 28700], stamp: 601.86, pulse: [600.32, 601.16] });
// the SECOND cover of the radiologist card: it returns on its payoff, '...YET' slams, MY TAKE fades up and pulses
CH['C4-radiologists:note'] = (t) => {
  expect('C4-radiologists:note', 1);
  const [yet, chip] = splitTop(S('C4-radiologists:note')[0][1]);
  const cp = eOut(pr(t, 630.06, 630.46));
  const k = bump(t, 632.1, 632.7);
  let chipEl = t < 630.06 ? '' : fadeH(chip, cp, 12, 1 + 0.03 * k);
  if (k > 0) chipEl = chipEl.replace('border-color:rgba(255,215,0,.30)', `border-color:rgba(255,215,0,${(0.3 + 0.45 * k).toFixed(3)})`);
  chipEl = chipEl.replace('<div class="top-accent" style="', `<div class="top-accent" style="clip-path:inset(0 ${((1 - cp) * 100).toFixed(1)}% 0 0);`);
  return tpl('C4-radiologists:note', { 0: slam(yet, t, 628.98) + chipEl });
};

// C8: procedures then installed base grow and count; 'up' tags; the takeaway slides up
CH['C8'] = (t) => {
  expect('C8', 6);
  const seg = S('C8'); const v: Record<number, string> = {};
  const bars = splitTop(seg[0][1]);
  const tracks = seg[0][0];
  const win: [number, number][] = [[646.56, 647.17], [646.71, 647.32], [647.4, 648.15], [647.55, 648.3]];
  const ps = win.map(([a, b]) => eOut(pr(t, a, b)));
  v[0] = tracks + bars.map((b, i) => {
    const h = num(b, 'height') * ps[i];
    return h > 0 ? attr(attr(b, 'height', h.toFixed(1)), 'y', (790 - h).toFixed(1)) : '';
  }).join('');
  const targets = [2683000, 3153000, 10488, 11710];
  for (let i = 1; i <= 4; i++) {
    const parts = splitTop(seg[i][1]);
    const valEl = parts.find((p) => /[0-9],[0-9]{3}</.test(p))!;
    const rest = parts.filter((p) => p !== valEl).join('');
    const p = ps[i - 1];
    const h = num(bars[i - 1], 'height') * p;
    const shown = p > 0 ? css(valEl.replace(/>[0-9,]+</, `>${fmt(targets[i - 1] * p)}<`), `top:${(num(bars[i - 1], 'y') + num(bars[i - 1], 'height') - h - 62).toFixed(1)}px;`) : '';
    v[i] = shown + rest;
  }
  const [up18, up12, take] = splitTop(seg[5][1]);
  v[5] = (t >= 647.32 ? fadeH(up18, pr(t, 647.32, 647.5), 8) : '') + (t >= 648.3 ? fadeH(up12, pr(t, 648.3, 648.5), 8) : '') + (t >= 649.38 ? fadeH(take, eOut(pr(t, 649.38, 649.8)), 16) : '');
  return tpl('C8', v);
};

// C13: the AI price line falls 280-fold while the CPI line drifts up 9.1%
CH['C13'] = (t) => {
  expect('C13', 2);
  const seg = S('C13');
  const [aiL, aiS, aiE, cpL, cpS, cpE] = splitTop(seg[0][1]);
  const line = (el: string, p: number) => attr(attr(el, 'x2', lerp(num(el, 'x1'), num(el, 'x2'), p).toFixed(1)), 'y2', lerp(num(el, 'y1'), num(el, 'y2'), p).toFixed(1));
  const dot = (el: string, a: number) => (t < a ? '' : attr(el, 'r', (11 * eBack(pr(t, a, a + 0.25))).toFixed(2)));
  const pa = eIO(pr(t, 720.52, 721.44)), pc = pr(t, 722.38, 725.52);
  const s0 = (t >= 720.52 ? line(aiL, pa) + aiS : '') + dot(aiE, 721.44) + (t >= 722.38 ? line(cpL, pc) + cpS : '') + dot(cpE, 725.52);
  const [aiB, cpB] = splitTop(seg[1][1]);
  const s1 = (t >= 721.44 ? fadeH(aiB, eOut(pr(t, 721.44, 721.84)), 12) : '') + (t >= 725.52 ? fadeH(cpB, eOut(pr(t, 725.52, 725.94)), 12) : '');
  return tpl('C13', { 0: s0, 1: s1 });
};

// consumption-67: the ring sweeps to 67.5 % with the counter, 'two-thirds' fades up, the phrase brightens
CH['consumption-67'] = (t) => {
  expect('consumption-67', 3);
  const seg = S('consumption-67');
  const p = eOut(pr(t, 736.58, 737.46));
  const ring = p > 0 ? seg[0][1].replace(/stroke-dasharray="[0-9.]+ ([0-9.]+)"/, (_, c) => `stroke-dasharray="${(1060.3 * p).toFixed(1)} ${c}"`) : '';
  let html = tpl('consumption-67', { 0: ring, 1: t < 737.2 ? '' : fadeS(seg[1][1], pr(t, 737.2, 737.5)), 2: `${(67.5 * p).toFixed(1)}%` });
  const b = pr(t, 739.22, 740.22);
  if (b > 0) html = html.replace('<b>regular people spending money</b>', `<b style="color:rgb(${Math.round(lerp(232, 255, b))},${Math.round(lerp(234, 255, b))},${Math.round(lerp(240, 255, b))});text-shadow:0 0 ${(16 * b).toFixed(1)}px rgba(255,255,255,${(0.35 * b).toFixed(2)})">regular people spending money</b>`);
  return html;
};

// C16-gates / C16-tao: the scarcity panel
const tile = (frag: string, t: number, t0: number, t1: number) => {
  // a lit tile assembling from its dashed slot: card fades solid, accent + mark circle draw, name fades in
  const p = eOut(pr(t, t0, t1));
  return css(frag, `opacity:${p.toFixed(3)};`).replace('<div class="top-accent" style="', `<div class="top-accent" style="clip-path:inset(0 ${((1 - p) * 100).toFixed(1)}% 0 0);`);
};
CH['C16-gates'] = (t) => {
  expect('C16-gates', 1);
  const [off, on] = S('C16-gates')[0];
  const p = pr(t, 890.52, 890.9);
  let lit = tile(on, t, 890.52, 890.9);
  const cnt = eOut(pr(t, 891.48, 892.86));
  lit = lit.replace(/>275,000</, `>${fmt(275000 * cnt)}<`);
  lit = lit.replace(/(top:372px;text-align:center;)/, `$1opacity:${cl(cnt * 3).toFixed(2)};`);
  const f = pr(t, 893.62, 893.9);
  lit = lit.replace(/(<div style="position:absolute;left:24px;right:24px;top:414px;)/, `$1opacity:${f.toFixed(3)};`);
  lit = lit.replace(/(<div style="position:absolute;left:0;right:0;top:548px;)/, `$1opacity:${f.toFixed(3)};`);
  let html = tpl('C16-gates', { 0: (p < 1 ? off : '') + lit });
  const br = bump(t, 894.1, 895.5);
  if (br > 0) html = html.replace(/border:2px dashed #2a3242"/g, `border:2px dashed rgba(${Math.round(lerp(42, 120, br))},${Math.round(lerp(50, 135, br))},${Math.round(lerp(66, 165, br))},1)"`);
  return html;
};
CH['C16-tao'] = (t) => {
  expect('C16-tao', 1);
  const [off, on] = S('C16-tao')[0];
  const p = pr(t, 960.16, 960.7);
  let lit = tile(on, t, 960.16, 960.7);
  const cnt = eOut(pr(t, 962.64, 963.9));
  lit = lit.replace(/>21,000,000</, `>${t < 962.64 ? '' : fmt(21000000 * cnt)}<`);
  const unit = t < 962.64 ? 'open AI network' : 'hard cap';
  lit = lit.replace('>hard cap<', `>${unit}<`).replace(/(top:372px;text-align:center;)/, `$1opacity:${(t < 962.64 ? pr(t, 961.1, 961.76) : 1).toFixed(3)};`);
  lit = lit.replace('width:54.0%;', `width:${(54.0 * cnt).toFixed(1)}%;`).replace('>54.0%<', `>${(54.0 * cnt).toFixed(1)}%<`);
  lit = lit.replace(/(<div style="position:absolute;left:0;right:0;top:502px;)/, `$1opacity:${cl(cnt * 4).toFixed(2)};`);
  lit = lit.replace(/(<div style="position:absolute;left:36px;right:36px;top:478px;)/, `$1opacity:${cl(cnt * 4).toFixed(2)};`);
  const pp = pr(t, 964.38, 964.7);
  lit = lit.replace(/(<div style="position:absolute;left:0;right:0;top:546px;)/, `$1opacity:${cl(pp * 2).toFixed(2)};transform:scale(${(1.2 - 0.2 * eOut(pp)).toFixed(3)});`);
  let html = tpl('C16-tao', { 0: (p < 1 ? off : '') + lit });
  if (t >= 964.38 && t < 964.78) html = editEl(html, 'left:562px;top:290px', (el) => el.replace(/opacity:\s*0?\.5/, 'opacity:1'));
  return html;
};

// early-x402: the Visa backdrop pulses, the x402 sliver fills, 24 million counts, the takeaway
CH['early-x402'] = (t) => {
  expect('early-x402', 2);
  const seg = S('early-x402');
  const [sl, lead] = splitTop(seg[0][1]);
  const p = eOut(pr(t, 935.1, 936.82));
  const h = 150 * p;
  const s0 = p > 0 ? attr(attr(sl, 'height', h.toFixed(1)), 'y', (730 - h).toFixed(1)) + draw(lead, pr(t, 935.4, 936.0)) : '';
  const [lab, take] = splitTop(seg[1][1]);
  const s1 = (p > 0 ? fadeH(lab.replace('>24 million<', `>${Math.round(24 * p)} million<`), pr(t, 935.1, 935.5), 8) : '') + (t >= 937.8 ? fadeH(take, eOut(pr(t, 937.8, 938.4)), 16) : '');
  let html = tpl('early-x402', { 0: s0, 1: s1 });
  const k = bump(t, 934.66, 935.1);
  if (k > 0) html = html.replace('stroke="#8892a4" stroke-width="2.5"/>', `stroke="rgb(${Math.round(lerp(136, 232, k))},${Math.round(lerp(146, 234, k))},${Math.round(lerp(164, 240, k))})" stroke-width="${(2.5 + 1.5 * k).toFixed(2)}"/>`);
  return html;
};

// home-invasions-1-20: the headline flashes, '1' slams with its red house, the arrow, 1 -> 20 house by house
CH['home-invasions-1-20'] = (t) => {
  expect('home-invasions-1-20', 22);
  const seg = S('home-invasions-1-20'); const v: Record<number, string> = {};
  const [one, twenty] = splitTop(seg[0][1]);
  const sp = pr(t, 992.84, 993.1);
  const filled = t < 993.24 ? 0 : Math.min(20, 1 + Math.floor((t - 993.24) / 0.025));
  v[0] = (t < 992.84 ? '' : css(one, `opacity:${cl(sp * 3).toFixed(2)};transform:scale(${(1.2 - 0.2 * eOut(sp)).toFixed(4)});transform-origin:left top;`))
    + (t < 993.24 ? '' : twenty.replace('>20<', `>${Math.max(1, filled)}<`));
  const [house1, shaft, head] = splitTop(seg[1][1]);
  const ap = eOut(pr(t, 992.84, 993.1));
  v[1] = t < 992.84 ? '' : fadeS(house1, cl(sp * 3)) + attr(shaft, 'd', `M560 480 H${lerp(560, 700, ap).toFixed(1)}`) + (ap > 0.85 ? head : '');
  for (let i = 2; i <= 21; i++) v[i] = filled >= i - 1 ? seg[i][1] : seg[i][0];
  let html = tpl('home-invasions-1-20', v);
  const k = bump(t, 991.66, 992.0);
  if (k > 0) html = html.replace('<span class="re">Home invasions</span>', `<span class="re" style="color:rgb(255,${Math.round(lerp(64, 255, k))},${Math.round(lerp(96, 255, k))})">Home invasions</span>`);
  return html;
};

// money-printer-card: 23.3 trillion fills the column to the record line, the forecast arrow + 'a lot higher', the two pills
// (the FORECAST tier pill that faded in with the label 1026.22-1026.94 is REMOVED, Mike 2026-10-08: tier badges off)
CH['money-printer-card'] = (t) => {
  expect('money-printer-card', 5);
  const seg = S('money-printer-card');
  const p = eOut(pr(t, 1025.36, 1025.88));
  const h = 410 * p;
  const col = p > 0 ? attr(attr(seg[0][1], 'height', h.toFixed(1)), 'y', (880 - h).toFixed(1)) : '';
  const [shaft, head] = splitTop(seg[1][1]);
  const ap = eOut(pr(t, 1026.22, 1026.94));
  const arrow = t < 1026.22 ? '' : attr(shaft, 'd', `M1430 462 L1430 ${(462 - 210 * ap).toFixed(1)}`) + (ap > 0.92 ? head : '');
  const lab = t < 1026.22 ? '' : splitTop(seg[2][1]).filter((e) => !e.includes('class="badge')).map((e) => fadeH(e, pr(t, 1026.3, 1026.94), 8)).join('');
  const pills = (() => {
    const el = seg[4][1];
    const pc = pr(t, 1027.26, 1027.56), pm = pr(t, 1028.14, 1028.44);
    let k = 0;
    return el.replace(/<span style="display:inline-flex;/g, (m) => {
      const q = k++ === 0 ? pc : pm;
      return `<span style="opacity:${cl(q * 3).toFixed(2)};transform:scale(${(0.9 + 0.1 * eOut(q)).toFixed(4)});display:inline-flex;`;
    });
  })();
  return tpl('money-printer-card', { 0: col, 1: arrow, 2: lab, 3: (23.3 * p).toFixed(1), 4: pills });
};

// C7: WHY NOW: '1992' flashes, 'It's early.', the forecast outline draws, the 2025 sliver, the x402 card counts to 32
CH['C7'] = (t) => {
  expect('C7', 1);
  const parts = splitTop(S('C7')[0][1]);
  const [svg, lbl, fc, y25, card, take] = parts;
  const op = eOut(pr(t, 1053.44, 1054.4));
  const sp = pr(t, 1054.4, 1054.6);
  // svg = <svg ...><rect dashed outline/><rect sliver/><path tick/></svg>
  const svgOpen = svg.match(/^<svg[^>]*>/)![0];
  const inner = splitTop(svg.slice(svgOpen.length, svg.length - 6));
  const [outline, sliver, tick] = inner;
  const clip = `<defs><clipPath id="c7draw"><rect x="130" y="340" width="${(1520 * op).toFixed(1)}" height="130"/></clipPath></defs>`;
  const svgOut = t < 1053.44 ? '' : svgOpen + clip + `<g clip-path="url(#c7draw)">${outline}</g>` + (t >= 1054.4 ? fadeS(sliver + tick, sp) : '') + '</svg>';
  const cp = eOut(pr(t, 1055.92, 1056.4));
  const cents = Math.round(32 * eOut(pr(t, 1055.92, 1057.42)));
  const cardEl = t < 1055.92 ? '' : fadeH(card.replace(/(font-size:80px;line-height:1;color:var\(--accent-green\)">)32</, `$1${cents}<`), cp, 20);
  const html0 = svgOut + (t < 1053.44 ? '' : fadeH(lbl, op)) + (t < 1053.44 ? '' : fadeH(fc, pr(t, 1054.0, 1054.4)))
    + (t < 1054.4 ? '' : fadeH(y25, eOut(pr(t, 1054.4, 1055.14)), 10)) + cardEl + (t < 1052.6 ? '' : fadeH(take, eOut(pr(t, 1052.6, 1053.16)), 16));
  let html = tpl('C7', { 0: html0 });
  const k = bump(t, 1050.12, 1050.5);
  if (k > 0) {
    html = html.replace('<span class="num g">1992</span>', `<span class="num g" style="color:rgb(${Math.round(lerp(0, 255, k))},${Math.round(lerp(230, 255, k))},${Math.round(lerp(138, 255, k))})">1992</span>`);
    html = editEl(html, 'left:1216px;top:132px', (el) => css(el, `transform:scale(${(1 + 0.08 * k).toFixed(4)});`));
  }
  return html;
};

// ------------------------------------------------------------------ the view
export const ChartView: React.FC<{ id: string; t: number }> = ({ id, t }) => {
  const fn = CH[id];
  if (!fn) throw new Error(`no choreography for chart ${id}`);
  return (
    <div className="ejc" style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', backgroundColor: '#0a0c10' }}
      dangerouslySetInnerHTML={{ __html: fn(t) }} />
  );
};
export const CHART_IDS = Object.keys(CH);
