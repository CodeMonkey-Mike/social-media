/* two-legs-core.js: THE one drawing of the "two-legs" chart, shared by two-legs.html (part 1) and two-legs-2.html
   (part 2), so the two parts cannot drift: same DOM, same scales, same styling, same data. A page only supplies its own
   timeline (t -> state) and calls TwoLegs.render(state). Part 2 opens on TwoLegs.part1End(), part 1's exact last frame.

   Data: window.BTC_CHART from btc-closes.js (build_chart_data.py: Yahoo BTC-USD daily closes, 2025-10-06 to the read
   date, the 200-day and 50-week averages computed as research/btc_stats.py does, and the story's facts and label
   strings, each cross-checked against research/btc-stats.json). No price, date or figure is typed in here.
   Pure: render(state) draws the whole frame from the state alone (no CSS transitions or animations, no rAF, no clock).
   After editing this file, touch two-legs.html and two-legs-2.html (cover_runs.py keys a chart clip on the page's mtime). */
(function () {
'use strict';
var D = window.BTC_CHART;
if (!D) throw new Error('btc-closes.js did not load: run build_chart_data.py');
var F = D.facts, LB = D.labels;
var NS = 'http://www.w3.org/2000/svg';

/* ---------- palette: the locked tokens with THIS VIDEO's gold and red (its deck and cards, so a cut between a card
   and a chart holds its colour); white and gold ink, the red only for the falls ---------- */
var INK = '#e8eaf0', SEC = '#8892a4', MUT = '#505a6e', GOLD = '#f5b942', FALL = '#e0606e', BG = '#0a0c10';
var A200 = '#aab2c2';                       /* the 200-day line: a light slate, dashed (the 50-week is the gold one) */

/* ---------- pure helpers ---------- */
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function prog(t, t0, d) { return d > 0 ? clamp((t - t0) / d, 0, 1) : (t >= t0 ? 1 : 0); }
function eOut(u) { return 1 - Math.pow(1 - u, 3); }
function fade(t, t0, d) { return eOut(prog(t, t0, d === undefined ? 0.4 : d)); }
function bump(t, t0, d) { var u = prog(t, t0, d); return (u <= 0 || u >= 1) ? 0 : Math.sin(Math.PI * u); }
function f2(v) { return (+v).toFixed(2); }
function rgba(hex, a) {
  var n = parseInt(hex.slice(1), 16);
  return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + (+a).toFixed(4) + ')';
}
function mix(c1, c2, u) {
  var a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  return 'rgb(' + Math.round(lerp(a >> 16, b >> 16, u)) + ',' + Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, u)) + ',' +
         Math.round(lerp(a & 255, b & 255, u)) + ')';
}
/* monotone cubic through knots [[t, value], ...] (Fritsch-Carlson): smooth, never overshoots, at rest at both ends and
   wherever the value holds, exact at every knot. The cursor (the line's drawn end) is one of these. */
function pchip(K) {
  var n = K.length, h = [], s = [], m = [], i;
  for (i = 0; i < n - 1; i++) { h[i] = K[i + 1][0] - K[i][0]; s[i] = (K[i + 1][1] - K[i][1]) / h[i]; }
  m[0] = 0; m[n - 1] = 0;
  for (i = 1; i < n - 1; i++) {
    if (s[i - 1] * s[i] <= 0) m[i] = 0;
    else { var w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / s[i - 1] + w2 / s[i]); }
  }
  return function (t) {
    if (t <= K[0][0]) return K[0][1];
    if (t >= K[n - 1][0]) return K[n - 1][1];
    var j = 0; while (t > K[j + 1][0]) j++;
    var u = (t - K[j][0]) / h[j], u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * K[j][1] + (u3 - 2 * u2 + u) * h[j] * m[j] +
           (-2 * u3 + 3 * u2) * K[j + 1][1] + (u3 - u2) * h[j] * m[j + 1];
  };
}

/* ---------- the data: day index = days since the top (2025-10-06); a missing day is a straight join ---------- */
function utc(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
var DAY0 = utc(D.start);
function day(s) { return Math.round((utc(s) - DAY0) / 864e5); }
var P = D.rows.map(function (r) { return { d: day(r[0]), c: r[1], a200: r[2], w50: r[3] }; });
/* the 50-week line is DRAWN through its weekly (Sunday) closes (D.weekly50, btc_stats.py's figure on those days, then the
   read date's): drawn daily, the average cycles through a different weekday's closes each day and shows a 7-day sawtooth */
var WK = (D.weekly50 || []).map(function (r) { return { d: day(r[0]), v: r[1] }; });
if (WK.length > 1) P.forEach(function (p) {
  var k = 0;
  while (k < WK.length - 2 && WK[k + 1].d <= p.d) k++;
  var a = WK[k], b = WK[k + 1];
  p.w50 = p.d <= a.d ? a.v : (p.d >= b.d ? b.v : lerp(a.v, b.v, (p.d - a.d) / (b.d - a.d)));
});
var LAST = P[P.length - 1].d;
var DAYS = {
  top: day(F.top.date), wk1: day(F.confirm[0].date), wk2: day(F.confirm[1].date), bottom: day(F.leg1.date),
  rally: day(F.rally.date), aboveFrom: day(F.above.from), aboveTo: day(F.above.to), lost: day(F.lost_both), end: LAST
};
/* the first daily close under the drawn 50-week line (2025-11-04, RESEARCH.md section 3): the line crosses the gold
   line on "closed BELOW" in part 1 */
DAYS.dip = (P.filter(function (p) { return p.d > DAYS.top && p.d < DAYS.wk1 && p.c < p.w50; })[0] || { d: DAYS.wk1 - 7 }).d;
function at(d, key) {                         /* a series at a fractional day: straight between two closes */
  if (d <= P[0].d) return P[0][key];
  if (d >= LAST) return P[P.length - 1][key];
  var lo = 0, hi = P.length - 1;
  while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (P[mid].d <= d) lo = mid; else hi = mid; }
  return lerp(P[lo][key], P[hi][key], (d - P[lo].d) / (P[hi].d - P[lo].d));
}
function days(a, b) {                         /* a, every close strictly between, b */
  var out = [a];
  for (var i = 0; i < P.length; i++) if (P[i].d > a && P[i].d < b) out.push(P[i].d);
  out.push(b);
  return out;
}

/* ---------- geometry (1920 x 1080): x = the whole range, the top to the read date, in BOTH parts ---------- */
var PX0 = 200, PX1 = 1790, PYT = 280, PYB = 905;
var vlo = Infinity, vhi = -Infinity;
P.forEach(function (p) { vlo = Math.min(vlo, p.c, p.a200, p.w50); vhi = Math.max(vhi, p.c, p.a200, p.w50); });
var VMIN = Math.min(40000, Math.floor((vlo - 9000) / 10000) * 10000);
var VMAX = Math.max(130000, Math.ceil((vhi + 4000) / 10000) * 10000);
function X(d) { return PX0 + (PX1 - PX0) * d / LAST; }
function Y(v) { return PYB - (PYB - PYT) * (v - VMIN) / (VMAX - VMIN); }

/* ---------- DOM ---------- */
var frame = document.createElement('div');
frame.className = 'frame';
frame.innerHTML =
  /* the orbs are the deck's gold and red: every channel sits above the page's, so a faint tint can only brighten
     (a colour with a channel under the page's lowers it at a tiny alpha and draws a dark ring) */
  '<div class="orb" id="orbGold" style="width:560px;height:560px;background:' + GOLD + ';left:-300px;top:-330px"></div>' +
  '<div class="orb" id="orbRed" style="width:520px;height:520px;background:' + FALL + ';left:1500px;top:820px"></div>' +
  '<div class="head"><div class="ey" id="ey">Bitcoin, counted by the rule</div>' +
  '<h1 id="h1"><span class="go">Two</span> Bear Markets</h1><div class="divider" id="divider"></div></div>' +
  '<svg id="plot" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg"></svg>' +
  '<div class="src" id="src"></div>';
document.body.appendChild(frame);
var svg = document.getElementById('plot');
var ey = document.getElementById('ey'), h1 = document.getElementById('h1'), divider = document.getElementById('divider'),
    src = document.getElementById('src'), orbGold = document.getElementById('orbGold'), orbRed = document.getElementById('orbRed');
var MON = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
(function () {
  var e = D.end.split('-');
  src.textContent = 'Bitcoin daily close, Yahoo Finance, read ' + MON[+e[1] - 1] + ' ' + (+e[2]) + ', ' + e[0] +
                    '. Averages: the last 50 weekly closes, the last 200 daily closes.';
})();

/* the orbs, once: a disc blurred by sigma 120 px, drawn as that falloff in a radial gradient (same centre) */
[orbGold, orbRed].forEach(function (o) {
  var Dm = parseFloat(o.style.width), R = Dm / 2, W = R + 260, cx = parseFloat(o.style.left) + R, cy = parseFloat(o.style.top) + R;
  var col = getComputedStyle(o).backgroundColor.match(/\d+/g).slice(0, 3).join(',');
  var stops = [[0, .956], [Math.max(0, R - 120) / W, .80], [R / W, .46], [(R + 120) / W, .15], [(R + 180) / W, .06], [(R + 240) / W, .015], [1, 0]];
  o.style.left = (cx - W) + 'px'; o.style.top = (cy - W) + 'px'; o.style.width = o.style.height = (2 * W) + 'px';
  o.style.background = 'radial-gradient(closest-side, ' + stops.map(function (s) {
    return 'rgba(' + col + ',' + s[1] + ') ' + (100 * Math.min(1, s[0])).toFixed(2) + '%';
  }).join(', ') + ')';
});

function E(tag, attrs, parent) {
  var n = document.createElementNS(NS, tag);
  for (var k in attrs) n.setAttribute(k, attrs[k]);
  (parent || svg).appendChild(n);
  return n;
}
function TX(parent, attrs, parts) {           /* text with tspans: parts = [[str, cls, fill, size, dx], ...] */
  var n = E('text', attrs, parent);
  n.spans = parts.map(function (p) {
    var s = E('tspan', {}, n);
    if (p[1]) s.setAttribute('class', p[1]);
    if (p[2]) s.setAttribute('fill', p[2]);
    if (p[3]) s.setAttribute('font-size', p[3]);
    if (p[4]) s.setAttribute('dx', p[4]);
    s.textContent = p[0];
    return s;
  });
  return n;
}
function set(n, attrs) { for (var k in attrs) n.setAttribute(k, attrs[k]); }
function op(n, v) { n.setAttribute('opacity', clamp(v, 0, 1).toFixed(4)); }
function rise(g, a, px) { g.setAttribute('transform', 'translate(0,' + f2((px === undefined ? 10 : px) * (1 - a)) + ')'); op(g, a); }

var defs = E('defs', {});
defs.innerHTML =
  '<filter id="glow" filterUnits="userSpaceOnUse" x="150" y="230" width="1700" height="720"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>' +
    '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<filter id="glowS" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>' +
    '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<filter id="halo" filterUnits="userSpaceOnUse" x="150" y="230" width="1700" height="720"><feGaussianBlur in="SourceGraphic" stdDeviation="7"/></filter>';

var L = {};
['grid', 'axis', 'fill', 'avg', 'price', 'marks', 'labels', 'legend'].forEach(function (k) { L[k] = E('g', {}); });

/* gridlines + price labels (axis scale only) */
var grid = [];
for (var gv = VMIN + 20000; gv < VMAX; gv += 20000) {
  grid.push({ v: gv, y: Y(gv), line: E('path', {fill: 'none', stroke: '#ffffff', 'stroke-opacity': '.06', 'stroke-width': '1.5'}, L.grid),
              text: TX(L.grid, {'class': 't-mono', 'font-size': '26', fill: SEC, 'text-anchor': 'end', x: PX0 - 22, y: f2(Y(gv) + 9)},
                       [[(gv / 1000) + 'K']]) });
}

/* the time axis: a tick at each month's first day, the month centred in its slot, the year under its first month */
var axis = E('path', {fill: 'none', stroke: '#2a3142', 'stroke-width': '2'}, L.axis);
var months = [];
(function () {
  var s = D.start.split('-'), y = +s[0], m = +s[1] - 1, from = 0, first = true;
  for (;;) {
    var ny = m === 11 ? y + 1 : y, nm = (m + 1) % 12;
    var next = day(ny + '-' + String(nm + 1).padStart(2, '0') + '-01');
    var a = Math.max(0, from), b = Math.min(LAST, next);
    if (b - a >= 9) months.push({ m: m, y: y, a: a, b: b, first: first || m === 0 });
    first = false;
    if (next >= LAST) break;
    months.push({ tick: next });
    from = next; y = ny; m = nm;
  }
})();
months.forEach(function (o) {
  if (o.tick !== undefined) { o.n = E('path', {fill: 'none', stroke: MUT, 'stroke-width': '2'}, L.axis); return; }
  o.x = (X(o.a) + X(o.b)) / 2;
  o.text = TX(L.axis, {'class': 't-mono', 'font-size': '26', fill: SEC, 'text-anchor': 'middle', x: f2(o.x), y: PYB + 40}, [[MON[o.m].toUpperCase()]]);
  if (o.first) o.year = TX(L.axis, {'class': 't-mono4', 'font-size': '26', fill: MUT, 'text-anchor': 'middle', x: f2(o.x), y: PYB + 72}, [[String(o.y)]]);
});

/* the series: the 200-day (dashed slate), the 50-week (gold), the price (white; the falls turn muted red at the payoff) */
var a200Path = E('path', {fill: 'none', stroke: A200, 'stroke-opacity': '.72', 'stroke-width': '3', 'stroke-dasharray': '11 9',
                          'stroke-linecap': 'butt', 'stroke-linejoin': 'round'}, L.avg);
var w50Halo = E('path', {fill: 'none', stroke: GOLD, 'stroke-width': '10', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', filter: 'url(#halo)'}, L.avg);
var w50Path = E('path', {fill: 'none', stroke: GOLD, 'stroke-width': '3', 'stroke-linejoin': 'round', 'stroke-linecap': 'round'}, L.avg);
/* the ABOVE BOTH gold: brighter at the price, so it reads gold and not olive on the near-black page */
(function () {
  var ys = [], d;
  for (d = DAYS.aboveFrom; d <= DAYS.aboveTo; d++) ys.push(Y(at(d, 'c')), Y(Math.max(at(d, 'a200'), at(d, 'w50'))));
  var g = E('linearGradient', {id: 'gAbove', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0,
                               y1: f2(Math.min.apply(null, ys)), y2: f2(Math.max.apply(null, ys))}, defs);
  E('stop', {offset: '0', 'stop-color': GOLD, 'stop-opacity': '.62'}, g);
  E('stop', {offset: '1', 'stop-color': GOLD, 'stop-opacity': '.22'}, g);
})();
var aboveFill = E('path', {fill: 'url(#gAbove)', stroke: 'none'}, L.fill);
var segs = [                                  /* the price line in three runs: leg 1, between, leg 2 (shared end points) */
  { a: DAYS.top, b: DAYS.bottom, leg: true },
  { a: DAYS.bottom, b: DAYS.lost, leg: false },
  { a: DAYS.lost, b: LAST, leg: true }
];
segs.forEach(function (s) {
  s.n = E('path', {fill: 'none', stroke: INK, 'stroke-width': '4.5', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', filter: 'url(#glow)'}, L.price);
});

/* ---------- markers + labels (each label lands on its point of the line) ---------- */
function pt(d) { return { x: X(d), y: Y(at(d, 'c')) }; }
var pTop = pt(DAYS.top), pW1 = pt(DAYS.wk1), pW2 = pt(DAYS.wk2), pBot = pt(DAYS.bottom), pRal = pt(DAYS.rally),
    pLost = pt(DAYS.lost), pEnd = pt(LAST);

/* TOP */
var topDot = E('circle', {cx: f2(pTop.x), cy: f2(pTop.y), r: 9, fill: INK, filter: 'url(#glowS)'}, L.marks);
var topLbl = E('g', {}, L.labels);
TX(topLbl, {'class': 't-caps', 'font-size': '32', fill: INK, x: f2(pTop.x + 28), y: f2(pTop.y + 2)}, [['TOP']]);
TX(topLbl, {'class': 't-mono', 'font-size': '26', fill: SEC, x: f2(pTop.x + 28), y: f2(pTop.y + 38)}, [[LB.top_date]]);

/* BEAR CONFIRMED: the two weekly (Sunday) closes under the 50-week, each hanging from the gold line */
var wk = [[pW1, DAYS.wk1], [pW2, DAYS.wk2]].map(function (q) {
  var p = q[0];
  return { p: p, yw: Y(at(q[1], 'w50')),
           tick: E('path', {fill: 'none', stroke: FALL, 'stroke-width': '3', 'stroke-dasharray': '5 5'}, L.marks),
           cap: E('circle', {cx: f2(p.x), r: 5.5, fill: GOLD}, L.marks),
           ring: E('circle', {cx: f2(p.x), cy: f2(p.y), r: 10, fill: BG, stroke: FALL, 'stroke-width': '4'}, L.marks) };
});
var confLbl = E('g', {}, L.labels);
var CX = PX0 + 40, CY = pW2.y + 92;
TX(confLbl, {'class': 't-caps', 'font-size': '34', fill: FALL, x: f2(CX), y: f2(CY)}, [['BEAR CONFIRMED']]);
TX(confLbl, {'class': 't-sans', 'font-size': '28', fill: INK, x: f2(CX), y: f2(CY + 42)}, [['2', 't-mono'], [' WEEKLY CLOSES']]);
TX(confLbl, {'class': 't-sans', 'font-size': '28', fill: INK, x: f2(CX), y: f2(CY + 80)}, [['UNDER THE '], ['50', 't-mono'], ['-WEEK']]);
(function () {                                  /* the two weeks, as said: "the weeks ending November 16 and November 23" */
  function md(s) { var p = s.split('-'); return MON[+p[1] - 1].toUpperCase() + ' ' + (+p[2]); }
  TX(confLbl, {'class': 't-mono', 'font-size': '26', fill: INK, x: f2(CX), y: f2(CY + 118)},     /* main ink (visual-qa) */
     [[md(F.confirm[0].date)], ['AND', 't-sans', INK, '24', '12'], [md(F.confirm[1].date), 't-mono', INK, '26', '12']]);
})();

/* LEG 1: at the first bottom; "267 DAYS" then the fall (its own entrance), the block centred under the dot */
var botDot = E('circle', {cx: f2(pBot.x), cy: f2(pBot.y), r: 10, fill: FALL, filter: 'url(#glowS)'}, L.marks);
var leg1 = E('g', {}, L.labels);
var LY1 = Math.max(pBot.y, pEnd.y) + 62;       /* LEG 1 and LEG 2 share one baseline: the two lows sit a few px apart */
var leg1Head = TX(leg1, {'class': 't-caps', 'font-size': '34', fill: FALL, 'text-anchor': 'middle', x: f2(pBot.x), y: f2(LY1)}, [['LEG 1']]);
var leg1Line = TX(leg1, {'class': 't-mono', 'font-size': '32', fill: INK, 'text-anchor': 'middle', x: f2(pBot.x), y: f2(LY1 + 44)},
                  [[LB.leg1_days], [LB.leg1_pct, 't-mono', FALL, '40', '26']]);

/* the rally: "+48% TO 86K", upper left of the rally top ("TO 86K" lands on "86") */
var ralDot = E('circle', {cx: f2(pRal.x), cy: f2(pRal.y), r: 9, fill: INK, filter: 'url(#glowS)'}, L.marks);
var rally = E('g', {}, L.labels);
var rallyTxt = TX(rally, {'class': 't-mono', 'font-size': '36', fill: INK, 'text-anchor': 'end', x: f2(pRal.x - 16), y: f2(pRal.y - 26)},
                  [[LB.rally_pct], ['TO', 't-sans', SEC, '30', '16'], [LB.rally_to, 't-mono', INK, '36', '12']]);

/* ABOVE BOTH: the gold run between the price and the higher average, a bracket over it, the label above the bracket */
var xA = X(DAYS.aboveFrom), xB = X(DAYS.aboveTo), BRY = pRal.y - 104;   /* 12 px clear of the 100K gridline (visual-qa) */
var bracket = E('path', {fill: 'none', stroke: GOLD, 'stroke-width': '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, L.marks);
var aboveLbl = E('g', {}, L.labels);
var aboveHead = TX(aboveLbl, {'class': 't-caps', 'font-size': '34', fill: GOLD, 'text-anchor': 'middle', x: f2((xA + xB) / 2), y: f2(BRY - 62)}, [['ABOVE BOTH']]);
var aboveDays = TX(aboveLbl, {'class': 't-mono', 'font-size': '32', fill: INK, 'text-anchor': 'middle', x: f2((xA + xB) / 2), y: f2(BRY - 20)}, [[LB.above_days]]);

/* part 2: lost both (a ring on the line), LEG 2 at the read date, the block right-aligned to the end of the line */
var lostRing = E('circle', {cx: f2(pLost.x), cy: f2(pLost.y), r: 10, fill: BG, stroke: FALL, 'stroke-width': '4'}, L.marks);
var endDot = E('circle', {cx: f2(pEnd.x), cy: f2(pEnd.y), r: 10, fill: FALL, filter: 'url(#glowS)'}, L.marks);
var leg2 = E('g', {}, L.labels);
var LY2 = LY1;
/* line 1: LEG 2 and its age; line 2: the fall, measured FROM the rally top, so it never reads as a two-week fall
   (visual-qa): "-32% FROM 86K" (RESEARCH.md 3c: 32% since the rally top, around 86 thousand) */
var leg2Head = TX(leg2, {'class': 't-caps', 'font-size': '34', fill: FALL, 'text-anchor': 'end', x: f2(pEnd.x + 10), y: f2(LY2)},
                  [['LEG 2'], [LB.leg2_age, 't-mono', INK, '32', '18']]);
leg2Head.spans[1].setAttribute('letter-spacing', '0');
var leg2Line = TX(leg2, {'class': 't-mono', 'font-size': '40', fill: FALL, 'text-anchor': 'end', x: f2(pEnd.x + 10), y: f2(LY2 + 44)},
                  [[LB.leg2_pct], ['FROM', 't-sans', SEC, '28', '16'], [LB.rally_to, 't-mono', INK, '32', '12']]);

/* the legend, top right (its right edge on the 1800 px margin) */
var legend = E('g', {}, L.legend);
var LGY = 98;
var lgRows = [
  { label: 'PRICE, DAILY CLOSE', stroke: INK, w: 4.5, dash: null },
  { label: '50-WEEK AVERAGE', stroke: GOLD, w: 3, dash: null },
  { label: '200-DAY AVERAGE', stroke: A200, w: 3, dash: '11 9' }
].map(function (r, i) {
  var y = LGY + 44 * i;
  var ln = E('path', {d: 'M0,' + (y - 9) + ' H50', fill: 'none', stroke: r.stroke, 'stroke-width': r.w,
                      'stroke-linecap': r.dash ? 'butt' : 'round', 'stroke-opacity': r.stroke === A200 ? '.72' : '1'}, legend);
  if (r.dash) ln.setAttribute('stroke-dasharray', r.dash);
  var tx = TX(legend, {'class': 't-sans', 'font-size': '26', fill: SEC, x: 66, y: y, 'letter-spacing': '1.5'}, [[r.label]]);
  return { ln: ln, tx: tx };
});

/* ---------- the drawn line to a fractional day ---------- */
function run(key, a, b) { return b <= a ? [] : days(a, b).map(function (d) { return [X(d), Y(at(d, key))]; }); }
function dOf(pts) { return pts.length > 1 ? 'M' + pts.map(function (q) { return f2(q[0]) + ',' + f2(q[1]); }).join(' L') : 'M0,0'; }

var LABELS = [topLbl, confLbl, leg1, rally, aboveLbl, leg2, legend];
var lastBoxes = [];

/* =====================================================================================================================
   render(S): the whole frame from the state alone. Fields (all 0..1 unless noted):
   head, legend, axis, grid, src | cur (the drawn end, in days since the top) | top, topLbl | lit50 (a pulse) |
   wk1, wk2, conf | bottom, leg1, leg1Pct | rallyDot, rally, rallyTo | above, aboveLbl, aboveDays, abovePulse (a pulse) |
   lost, end, leg2, leg2Pct | payoff (the falls turn red), pulse2 (a pulse on both legs)
   ===================================================================================================================== */
function render(S) {
  var cur = clamp(S.cur, 0, LAST);

  /* head, atmosphere, source, legend */
  ey.style.opacity = S.head.toFixed(4);
  h1.style.opacity = S.head.toFixed(4); h1.style.transform = 'translateY(' + f2(12 * (1 - S.head)) + 'px)';
  divider.style.width = f2(66 * S.head) + 'px';
  src.style.opacity = S.src.toFixed(4);
  orbGold.style.opacity = (0.11 * S.head).toFixed(4);
  orbRed.style.opacity = (0.10 * S.payoff).toFixed(4);
  op(legend, S.legend);
  legend.setAttribute('transform', 'translate(' + f2(1800 - legend.getBBox().width) + ',0)');
  lgRows[1].tx.setAttribute('fill', mix(SEC, GOLD, S.lit50));

  /* axes: the time axis draws left to right; ticks, months and years appear as it passes */
  var axEnd = lerp(PX0, PX1, S.axis);
  set(axis, {d: 'M' + PX0 + ',' + PYB + ' H' + f2(axEnd), opacity: S.axis > 0 ? 1 : 0});
  months.forEach(function (o) {
    if (o.tick !== undefined) {
      var xt = X(o.tick);
      set(o.n, {d: 'M' + f2(xt) + ',' + PYB + ' V' + (PYB + 10), opacity: clamp((axEnd - xt) / 30 + 0.5, 0, 1).toFixed(4)});
      return;
    }
    var on = clamp((axEnd - o.x) / 40 + 0.5, 0, 1);
    op(o.text, on); if (o.year) op(o.year, on);
  });
  grid.forEach(function (g) { op(g.text, S.grid); });

  /* the averages and the price, drawn to the cursor */
  set(a200Path, {d: dOf(run('a200', 0, cur))});
  var w50d = dOf(run('w50', 0, cur));
  set(w50Path, {d: w50d, 'stroke-opacity': (0.86 + 0.14 * S.lit50).toFixed(4), 'stroke-width': f2(3 + 2 * S.lit50)});
  set(w50Halo, {d: S.lit50 > 0 ? w50d : 'M0,0', opacity: (0.55 * S.lit50).toFixed(4)});
  segs.forEach(function (s) {
    set(s.n, {d: dOf(run('c', s.a, Math.min(cur, s.b))), stroke: s.leg ? mix(INK, FALL, S.payoff) : INK});
  });

  /* ABOVE BOTH: the gold between the price and the higher average, from its first day to the cursor */
  var fb = Math.min(cur, DAYS.aboveTo);
  if (S.above > 0 && fb > DAYS.aboveFrom) {
    var ds = days(DAYS.aboveFrom, fb);
    var topE = ds.map(function (d) { return [X(d), Y(at(d, 'c'))]; });
    var botE = ds.map(function (d) { return [X(d), Y(Math.max(at(d, 'a200'), at(d, 'w50')))]; }).reverse();
    set(aboveFill, {d: dOf(topE.concat(botE)) + ' Z', opacity: (S.above * (1 + 0.6 * S.abovePulse)).toFixed(4)});
  } else set(aboveFill, {d: 'M0,0', opacity: 0});
  var bw = S.aboveLbl;
  set(bracket, {d: 'M' + f2(xA) + ',' + f2(BRY + 14) + ' V' + f2(BRY) + ' H' + f2(lerp(xA, xB, bw)) + (bw >= 1 ? ' V' + f2(BRY + 14) : ''),
                opacity: bw > 0 ? 1 : 0});

  /* markers and labels */
  op(topDot, S.top); rise(topLbl, S.topLbl);
  wk.forEach(function (w, i) {
    var v = i ? S.wk2 : S.wk1;
    set(w.tick, {d: 'M' + f2(w.p.x) + ',' + f2(w.yw) + ' V' + f2(lerp(w.yw, w.p.y - 10, v)), opacity: v > 0 ? 1 : 0});
    set(w.cap, {cy: f2(w.yw), opacity: v.toFixed(4)});
    op(w.ring, v);
  });
  rise(confLbl, S.conf);
  op(botDot, S.bottom); rise(leg1, S.leg1); leg1Line.spans[1].setAttribute('fill-opacity', S.leg1Pct.toFixed(4));
  op(ralDot, S.rallyDot); rise(rally, S.rally);
  rallyTxt.spans[1].setAttribute('fill-opacity', S.rallyTo.toFixed(4)); rallyTxt.spans[2].setAttribute('fill-opacity', S.rallyTo.toFixed(4));
  rise(aboveLbl, S.aboveLbl); aboveDays.setAttribute('fill-opacity', S.aboveDays.toFixed(4));
  op(lostRing, S.lost); op(endDot, S.end);
  rise(leg2, S.leg2); op(leg2Line, S.leg2Pct);              /* "-32% FROM 86K" lands whole, on "32" */

  /* the payoff pulse: both legs glow once ("Two bear markets"); the ABOVE BOTH pulse on "that bear market was over".
     The pulse tints are the deck's red and gold, lightened */
  var pg = S.pulse2;
  [leg1Head, leg2Head].forEach(function (n) { n.setAttribute('fill', mix(FALL, '#eb98a1', pg)); });
  [botDot, endDot].forEach(function (n) { n.setAttribute('r', f2(10 + 5 * pg)); });
  aboveHead.setAttribute('fill', mix(GOLD, '#f9e3b2', S.abovePulse));

  /* gridlines LAST: each stops short of any visible label it would run through (boxes at rest, so cuts never move) */
  var cuts = [];
  LABELS.forEach(function (g) {
    if (parseFloat(g.getAttribute('opacity') || '1') < 0.01) return;
    var bb = g.getBBox(), dx = g === legend ? 1800 - bb.width : 0;      /* the legend is translated to the margin */
    if (bb.width > 0) cuts.push({x0: bb.x + dx, y0: bb.y, x1: bb.x + dx + bb.width, y1: bb.y + bb.height});
  });
  lastBoxes = cuts.slice();
  /* the ABOVE BOTH bracket too: its end ticks reach down past the 100K gridline, which stops short of it (visual-qa) */
  if (S.aboveLbl > 0) cuts.push({x0: xA - 4, y0: BRY - 4, x1: xB + 4, y1: BRY + 18});
  grid.forEach(function (gl) {
    var segsX = [], c = PX0;
    cuts.filter(function (r) { return gl.y >= r.y0 - 8 && gl.y <= r.y1 + 8; })
        .map(function (r) { return [r.x0 - 14, r.x1 + 14]; })
        .sort(function (p, q) { return p[0] - q[0]; })
        .forEach(function (k) { if (k[0] > c) segsX.push([c, Math.min(k[0], PX1)]); c = Math.max(c, k[1]); });
    if (c < PX1) segsX.push([c, PX1]);
    var dd = segsX.filter(function (s) { return s[1] - s[0] > 1; }).map(function (s) { return 'M' + f2(s[0]) + ',' + f2(gl.y) + ' H' + f2(s[1]); }).join(' ');
    set(gl.line, {d: dd || 'M0,0', opacity: S.grid.toFixed(4)});
  });
}

/* part 1's last frame, exactly: every part-1 field landed, every pulse over, the cursor on the last day above both */
function part1End() {
  return { head: 1, legend: 1, axis: 1, grid: 1, src: 1, cur: DAYS.aboveTo, top: 1, topLbl: 1, lit50: 0, wk1: 1, wk2: 1, conf: 1,
           bottom: 1, leg1: 1, leg1Pct: 1, rallyDot: 1, rally: 1, rallyTo: 1, above: 1, aboveLbl: 1, aboveDays: 1, abovePulse: 0,
           lost: 0, end: 0, leg2: 0, leg2Pct: 0, payoff: 0, pulse2: 0 };
}

/* QA: the boxes of the visible labels and the drawn series in frame pixels (the chart's own collision check) */
function qa() {
  var series = [['200-day', a200Path], ['50-week', w50Path], ['price leg 1', segs[0].n], ['price', segs[1].n], ['price leg 2', segs[2].n]].map(function (q) {
    var d = q[1].getAttribute('d');
    return { name: q[0], pts: (!d || d === 'M0,0') ? [] : d.slice(1).split(' L').map(function (s) { return s.split(',').map(Number); }) };
  });
  var names = ['TOP', 'BEAR CONFIRMED', 'LEG 1', 'RALLY', 'ABOVE BOTH', 'LEG 2', 'LEGEND'];
  var boxes = [];
  LABELS.forEach(function (g, i) {
    if (parseFloat(g.getAttribute('opacity') || '1') < 0.01) return;
    var bb = g.getBBox(), dx = g === legend ? 1800 - bb.width : 0;
    boxes.push({ name: names[i], x0: bb.x + dx, y0: bb.y, x1: bb.x + dx + bb.width, y1: bb.y + bb.height });
  });
  var marks = [['TOP', pTop], ['WK1', pW1], ['WK2', pW2], ['BOTTOM', pBot], ['RALLY TOP', pRal], ['LOST BOTH', pLost], ['END', pEnd]];
  return { boxes: boxes, series: series, marks: marks.map(function (m) { return { name: m[0], x: m[1].x, y: m[1].y }; }),
           bracket: { x0: xA, x1: xB, y: BRY } };
}

/* load every face this chart uses up front, so html_clip.py's document.fonts.ready covers them before frame 0 */
['900 78px "Playfair Display"', '600 27px "DM Sans"', '700 34px "DM Sans"', '500 24px "DM Sans"',
 '600 32px "JetBrains Mono"', '400 24px "JetBrains Mono"'].forEach(function (f) { document.fonts.load(f, 'TOP 0123456789K%-+,'); });

window.TwoLegs = { render: render, part1End: part1End, day: day, DAYS: DAYS, LAST: LAST, facts: F,
                   h: { clamp: clamp, lerp: lerp, prog: prog, eOut: eOut, fade: fade, bump: bump, pchip: pchip }, qa: qa };
})();
