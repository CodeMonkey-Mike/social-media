// PlanToMakeMillionsCharts.tsx: the 11 Type 1 ANIMATED charts of plan-to-make-millions, LIVE in code (comp-build.md section 7).
// The geometry is the APPROVED chart HTML (assets/charts/<id>.html, _build.py, visual-qa PASS) exported by
// assets/charts/_export_comp.py into PlanToMakeMillionsChartData.ts as a template + per-state slots. This file holds the
// CHOREOGRAPHY, straight from each assets/charts/<id>.spec.md: which source-spine second every state change lands on, the
// draw-head windows (the clip rect grows, the head dot RIDES the data line), the house landing (opacity + 10 px rise over
// 8 frames, never a scale on SVG text), counters that read the value AT the head, bars that GROW from the zero line.
// Every chart reads ONE absolute clock: the SOURCE-spine second passed in by the comp (comp-build 6a), so a chart that
// returns later in the video shows exactly the state its words have reached, and an engine that re-mounts it stays in sync.
import React from 'react';
import { Easing } from 'remotion';
import { CHART_CSS, CHART_RUNS, ChartRun } from './PlanToMakeMillionsChartData';

type EaseName = 'linear' | 'inOut' | 'out' | 'in';
const EASE: Record<EaseName, (x: number) => number> = {
  linear: (x) => x,
  inOut: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
};
const LAND = 8 / 30;                 // the house landing: 8 frames
const RISE = 10;                     // px
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

type Cue = { at: number; draw?: [number, number, EaseName]; skip?: boolean };
type Ov = { at?: number; dur?: number; draw?: [number, number, EaseName]; reveal?: 'up' | 'down' | 'right' };
type Choreo = {
  cues: Cue[];                                       // one per state; cues[0].at = the run's frame-in
  ov?: Record<string, Ov>;                           // per slot ('7') or per slot at one state change ('7@4')
  custom?: (v: (string | number)[], t: number, run: ChartRun, out: string[]) => void;
};

// ------------------------------------------------------------------------------------------------ geometry helpers
const lineY = (line: number[][], x: number) => {
  if (x <= line[0][0]) return line[0][1];
  for (let i = 1; i < line.length; i++) {
    if (line[i][0] >= x) {
      const [x0, y0] = line[i - 1];
      const [x1, y1] = line[i];
      return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return line[line.length - 1][1];
};
const minYUpTo = (line: number[][], x: number) => {   // the highest point (smallest y) the head has passed
  let m = Infinity;
  for (const [px, py] of line) {
    if (px > x) break;
    m = Math.min(m, py);
  }
  return Math.min(m, lineY(line, x));
};
const span = (t: number, a: number, b: number, from: number, to: number, e: EaseName) =>
  t <= a ? from : t >= b ? to : from + (to - from) * EASE[e]((t - a) / (b - a));
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ------------------------------------------------------------------------------------------------ choreography (spec.md)
const CHOREO: Record<string, Choreo> = {
  // C3 COUNT-DOWN, CH1 gold, 16.289-23.300. One head runs over the 24 CMC prints 16.60 -> 18.60 (ease-out cubic); the
  // counter shows the value AT the head, the date steps day by day; 697B + the end label land on '700 billion' (18.72),
  // MINUS 25.6% on 'three weeks' (22.12).
  C3: {
    cues: [{ at: 16.289 }, { at: 0, skip: true }, { at: 18.72, draw: [16.6, 18.6, 'out'] }],
    ov: { '8': { at: 22.12 } },
    custom: (v, _t, run, out) => {
      const cx = v[3] as number;
      const cy = lineY(run.line!, cx);
      const val = 2.0 + ((694.44 - cy) * 0.25) / 113.88;           // the chart's own linear axis: 2.00T @694.44, 2.25T @580.56
      out[5] = val.toFixed(3);
      const d = new Date(Date.UTC(2026, 9, 29) + Math.round((cx - 1080) / 30.4348) * 86400000);
      out[6] = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, 2026`;
    },
  },
  // C16 PIEVERSE, HOOK run (CH1 gold), 33.90-39.85.
  'C16-hook': {
    cues: [{ at: 33.9 }, { at: 36.12, draw: [33.95, 36.0, 'inOut'] }, { at: 39.12, draw: [36.3, 38.9, 'inOut'] }],
    custom: (v, t, run, out) => {
      // the MARKET CAP badge counts 65M -> OVER 1B in step with the head (log axis: 1 @567.9, 290 px a decade; the call = 0.338)
      if (t >= 36.12 && t < 39.12) {
        const headX = 204 + (v[0] as number);
        const price = Math.pow(10, (567.9 - minYUpTo(run.line!, headX)) / 290);
        const cap = Math.max(65, (65 * price) / 0.338);
        out[7] = cap >= 1000 ? 'OVER 1B' : `AROUND ${Math.round(cap)}M`;
      }
    },
  },
  // C14 EVAA, HOOK run (CH1 gold), 39.85-46.789. NO multiple on screen (the VO says 35X; Mike 2026-11-23).
  'C14-hook': {
    cues: [{ at: 39.85 }, { at: 42.32, draw: [39.95, 42.1, 'inOut'] }, { at: 44.78 }],
    ov: { '6': { at: 42.12 }, '11': { at: 42.12 } },               // the read dot + read card land as the draw reaches the drop
  },
  // C1 THE CENTERPIECE, CH2 red: 7 placements, 9 states, one absolute clock.
  C1: {
    cues: [
      { at: 79.2 },                                                 // s0 (the initial draw is in custom)
      { at: 88.22, draw: [87.6, 88.1, 'inOut'] },                   // s1 Binance hack
      { at: 97.9 },                                                 // s1b (the two tags staged in custom)
      { at: 111.64, draw: [108.9, 109.4, 'inOut'] },                // s2 oil 117
      { at: 150.2, draw: [147.0, 150.0, 'inOut'] },                 // s3 after the midterms
      { at: 161.5 },                                                // s3b minus 5.55%
      { at: 165.58, draw: [162.0, 165.3, 'inOut'] },                // s4 Nvidia's CEO resigns
      { at: 178.66, draw: [176.6, 178.5, 'inOut'] },                // s5 Anthropic lists
      { at: 203.3, draw: [201.5, 203.2, 'inOut'] },                 // s6 final: OCT 28 reference + end card
    ],
    ov: {
      '2': { at: 147.4 },                                           // NOV 3, ELECTION DAY tick as the line passes it
      '32': { at: 146.0 },                                          // STRAIT OF HORMUZ already under callout 2 on the return
      '1': { at: 203.3, reveal: 'right', dur: 0.4 },                // the dashed OCT 28 CLOSE reference draws on
      '24@8': { at: 203.2 }, '23@8': { at: 203.3 },
      // all five callouts light together on 'lost around a quarter' (~204.4)
      '4@8': { at: 204.4 }, '6@8': { at: 204.4 }, '8@8': { at: 204.4 }, '10@8': { at: 204.4 }, '12@8': { at: 204.4 },
      '14@8': { at: 204.4 }, '16@8': { at: 204.4 }, '18@8': { at: 204.4 }, '20@8': { at: 204.4 }, '22@8': { at: 204.4 },
      '28@8': { at: 204.4 }, '31@8': { at: 204.4 }, '34@8': { at: 204.4 }, '37@8': { at: 204.4 }, '39@8': { at: 204.4 },
    },
    custom: (_v, t, run, out) => {
      // s0: 79.30 -> 82.84 the line draws OCT 1 -> OCT 28 (ease-in-out) and holds
      if (t < 82.84) {
        const w = span(t, 79.3, 82.84, 0, 617.92, 'inOut');
        out[0] = w.toFixed(2);
        const cx = 226 + w + 2.5;
        out[25] = cx.toFixed(2);
        out[26] = lineY(run.line!, cx).toFixed(2);
      }
      // s1b: the callout-1 headline gains ', AROUND 6.3B' on the return; 98.74 BINANCE COVERED THE LOSSES; 102.04 MINUS 4.3%
      const blk = String(out[29]);
      if (blk.includes('BINANCE COVERED')) {
        const parts = blk.split('</div><div class="t');
        if (t < 98.74) out[29] = parts[0];
        else if (t < 102.04) out[29] = parts.slice(0, 2).join('</div><div class="t');
      }
    },
  },
  // C5 BRENT CRUDE, CH2 red, 117.15-122.45: the up-leg draws to OCT 30 (117.30-119.30), 117.64 lands 119.38, the dim fall
  // draws to NOV 20 (119.50-120.60) + its label.
  C5: {
    cues: [{ at: 117.15 }, { at: 0, skip: true }, { at: 119.38 }],
    ov: { '2': { at: 120.6 }, '5': { at: 120.6 } },
    custom: (_v, t, _run, out) => {
      const W30 = 1162;                                             // clip x 214 -> the OCT 30 point at x 1372 (+ the cap)
      const w = t < 119.4 ? span(t, 117.3, 119.3, 35.5, W30, 'inOut') : span(t, 119.5, 120.6, W30, 1251.5, 'inOut');
      out[0] = w.toFixed(2);
    },
  },
  // C-NVDA, CH2 red, 172.30-176.55: OCT 6 -> NOV 20 draws 172.40-173.90 (ease-in, it falls); payoff lands on '47%' 174.02.
  'C-NVDA': { cues: [{ at: 172.3 }, { at: 0, skip: true }, { at: 174.02, draw: [172.4, 173.9, 'in'] }] },
  // C-SPACEX, CH2 red, 192.90-201.45.
  'C-SPACEX': {
    cues: [
      { at: 192.9 },
      { at: 193.02, draw: [192.95, 193.0, 'linear'] },
      { at: 194.38, draw: [193.05, 194.3, 'inOut'] },
      { at: 196.4, draw: [194.45, 196.3, 'inOut'] },
      { at: 198.06 },
    ],
  },
  // C2 INDICES, CH2 red, 206.80-216.528. No CLOSING figure of 20% or more; 'bear market' never printed.
  C2: {
    cues: [{ at: 206.8 }, { at: 209.08, draw: [206.9, 208.9, 'inOut'] }, { at: 212.86 }, { at: 215.92 }],
    ov: { '1': { at: 215.92, reveal: 'right', dur: LAND } },     // the dashed MINUS 20% line draws left to right, 8 frames
  },
  // C16 PIEVERSE, WALK run (CH3 green), 272.15-290.40 and 294.30-300.15.
  'C16-walk': {
    cues: [
      { at: 272.15 },
      { at: 278.36, draw: [277.3, 278.3, 'inOut'] },               // the run to 0.518 + ALREADY RUNNING
      { at: 280.62, draw: [279.75, 280.55, 'inOut'] },             // the pullback to 0.338 + PULLED BACK
      { at: 284.16 },                                               // PULLED BACK swaps for MY CALL (same anchor)
      { at: 288.78, draw: [286.02, 288.7, 'inOut'] },              // through 2026 to NOV 18 + its date tick
      { at: 296.0, draw: [294.4, 295.9, 'inOut'] },                // the 5.33 HIGH card
      { at: 298.34, draw: [296.2, 298.2, 'inOut'] },               // the read card
    ],
    // the run's helpers (ALREADY RUNNING card, its leader and dot) clear as the line sets off through 2026
    ov: { '3@4': { at: 286.02 }, '9@4': { at: 286.02 }, '11@4': { at: 286.02 } },
    custom: (_v, t, _run, out) => {
      // the BOT ALERT card is on in the walk-1 still; on screen it lands on '20 million' (276.12)
      const p = clamp01((t - 276.12) / LAND);
      out[10] = String(out[10]).replace('style="', `style="opacity:${EASE.out(p).toFixed(3)};translate:0px ${((1 - EASE.out(p)) * RISE).toFixed(2)}px;`);
    },
  },
  // C14 EVAA, WALK run (CH3 green), 305.30-315.00 and 326.05-348.395.
  'C14-walk': {
    cues: [
      { at: 305.3 },
      { at: 307.36, draw: [307.5, 312.5, 'inOut'] },               // LAUNCHED OCT 3, 2025 tag, then the quiet months to OCT 27
      { at: 329.62 },                                               // the entry band
      { at: 333.48 },                                               // 0.51, OCT 27, 2026
      { at: 336.68, draw: [333.6, 336.6, 'inOut'] },               // the run + 6.62 THE PEAK
      { at: 340.56 },                                               // the dotted bracket + AROUND 13X / IN UNDER 4 WEEKS
      { at: 346.54, draw: [344.6, 346.4, 'inOut'] },               // the bracket dims, the RED drop draws, MINUS 64%
    ],
    ov: { '8': { at: 340.56, reveal: 'up', dur: 10 / 30 } },       // the bracket draws bottom to top, 10 frames
  },
  // C16-ZOOM, CH4 green, 437.55-444.58.
  'C16-ZOOM': {
    cues: [{ at: 437.55 }, { at: 440.42 }, { at: 441.48, draw: [440.5, 441.4, 'inOut'] }, { at: 444.0 }],
  },
  // C23 MIDTERM PRECEDENT, CH5 cyan, 474.65-489.20: 19 bars GROW from zero, left to right (0.45 s each, 0.19 s stagger).
  C23: {
    cues: [{ at: 474.65 }, { at: 0, skip: true }, { at: 481.56 }, { at: 485.52 }, { at: 486.8 }],
    ov: {
      '23': { at: 481.56, reveal: 'right', dur: 0.4 },             // the dashed median line draws
      '22': { at: 486.8, reveal: 'right', dur: 0.4 },
      '7': { at: 486.8, reveal: 'down', dur: 0.45 }, '15': { at: 486.85, reveal: 'down', dur: 0.45 }, '20': { at: 486.9, reveal: 'down', dur: 0.45 },
    },
    custom: (_v, t, _run, out) => {
      const bars = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21];
      const lit = new Set([6, 14, 19]);                             // 1974, 2002, 2018 stay lit through the dips
      bars.forEach((s, b) => {
        const g = EASE.out(clamp01((t - (477.54 + 0.19 * b)) / 0.45));
        const dim = lit.has(s) ? 1 : span(t, 486.8, 486.8 + LAND, 1, 0.45, 'out');
        out[s] = `${dim.toFixed(3)}" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(${g.toFixed(4)})`;
      });
    },
  },
  // C24, CH5 cyan, 489.20-495.60: both bars GROW together 491.80-493.70 (ease-out); 2.21x / 2.27x land 493.84.
  C24: {
    cues: [{ at: 489.2 }, { at: 0, skip: true }, { at: 493.84, draw: [491.8, 493.7, 'out'] }],
    ov: { '0': { at: 491.8, dur: 0.1 }, '3': { at: 491.8, dur: 0.1 } },
  },
};

// ------------------------------------------------------------------------------------------------ the engine
const fmt = (x: number, d: number) => (d ? x.toFixed(d) : String(Math.round(x)));

export const chartHtml = (id: string, t: number): string => {
  const run = CHART_RUNS[id];
  const ch = CHOREO[id];
  if (!run || !ch) throw new Error(`no chart run / choreography for ${id}`);
  const live = ch.cues.map((c, k) => (c.skip ? -1 : k)).filter((k) => k >= 0);
  const raw: (string | number)[] = [];
  const out: string[] = run.slots.map((sl, i) => {
    let v: string | number = sl.v[0];
    let vis = `opacity:${sl.v[0]};`;
    let prev = 0;
    for (const k of live.slice(1)) {
      const a = sl.v[prev];
      const b = sl.v[k];
      const cue = ch.cues[k];
      if (a !== b) {
        const o: Ov = ch.ov?.[`${i}@${k}`] ?? ch.ov?.[String(i)] ?? {};
        if (sl.k === 'num') {
          const w: [number, number, EaseName] = o.draw ?? (o.at !== undefined ? [o.at, o.at + (o.dur ?? LAND), 'out'] : cue.draw ?? [cue.at, cue.at + LAND, 'out']);
          if (t >= w[0]) v = (a as number) + ((b as number) - (a as number)) * EASE[w[2]](clamp01((t - w[0]) / Math.max(1e-6, w[1] - w[0])));
        } else if (sl.k === 'vis') {
          const at = o.at ?? cue.at;
          const dur = o.dur ?? LAND;
          if (t >= at) {
            const p = EASE.out(clamp01((t - at) / Math.max(1e-6, dur)));
            const x = (a as number) + ((b as number) - (a as number)) * p;
            v = x;
            if (o.reveal && (b as number) > (a as number)) {
              const r = ((1 - p) * 100).toFixed(2);
              const ins = o.reveal === 'right' ? `0 ${r}% 0 0` : o.reveal === 'down' ? `0 0 ${r}% 0` : `${r}% 0 0 0`;
              vis = `opacity:${b};clip-path:inset(${ins});`;
            } else {
              const rise = !sl.svg && (b as number) > (a as number) ? `translate:0px ${((1 - p) * RISE).toFixed(2)}px;` : '';
              vis = `opacity:${x.toFixed(3)};${rise}`;
            }
          }
        } else {
          const at = o.at ?? cue.at;
          if (t >= at) v = b;
        }
      }
      prev = k;
    }
    raw.push(v);
    if (sl.k === 'vis') return vis;
    if (sl.k === 'num') return fmt(v as number, sl.d ?? 0);
    return String(v);
  });
  // the head dot RIDES the data line: a circle's cy (#1) follows its cx (#0)
  if (run.line) {
    run.slots.forEach((sl, i) => {
      if (sl.k === 'num' && sl.desc.startsWith('<circle') && sl.desc.endsWith('#1') && i > 0 && run.slots[i - 1].el === sl.el) {
        out[i] = lineY(run.line!, Number(out[i - 1])).toFixed(2);
      }
    });
  }
  ch.custom?.(raw, t, run, out);
  let html = run.tpl[0];
  for (let i = 0; i < out.length; i++) html += out[i] + run.tpl[i + 1];
  return html;
};

// which run a chart ref plays at a given source second (C14 and C16 each have a CH1 HOOK run and a CH3 WALK run)
export const runFor = (ref: string, t: number) =>
  ref === 'C14' ? (t < 200 ? 'C14-hook' : 'C14-walk') : ref === 'C16' ? (t < 200 ? 'C16-hook' : 'C16-walk') : ref;

export const ChartStyles: React.FC = () => <style>{CHART_CSS}</style>;

/** A live chart: `t` = the SOURCE-spine second (the comp's absolute clock). */
export const LiveChart: React.FC<{ chartRef: string; t: number }> = ({ chartRef, t }) => (
  <div
    style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden' }}
    dangerouslySetInnerHTML={{ __html: chartHtml(runFor(chartRef, t), t) }}
  />
);

export const CHART_IDS = ['C3', 'C16', 'C14', 'C1', 'C5', 'C-NVDA', 'C-SPACEX', 'C2', 'C16-ZOOM', 'C23', 'C24'];
