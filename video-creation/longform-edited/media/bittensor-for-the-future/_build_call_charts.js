// Build dark deck-styled "call" charts (TAO / LAB / VELVET) from CoinGecko JSON.
// Real price data, code-rendered SVG (text accuracy), arrow annotation per Mike's spec:
//   LAB & VELVET -> arrow at the BEGINNING of the chart ("where I called it")
//   TAO          -> arrow at the FEBRUARY bottom ("I called the bottom")
// No multiple printed on screen (VO carries 353x/58x; CG-tracked range differs).
// Usage: node _build_call_charts.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');

const ROOT = 'C:/Users/mnede/Documents/Claude/social-media';
const DATA = path.join(ROOT, '_chartdata');
const OUT = path.join(ROOT, 'video-creation/longform-edited/media/bittensor-for-the-future/render-assets/img');
const C = { bg: '#0a0c10', card: '#12151c', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', ink: '#e8eaf0', sec: '#8892a4', edge: '#1e2330' };

const W = 1920, H = 1080;
// chart plot box
const PX = 150, PY = 300, PW = W - 300, PH = 560;

function loadPrices(file) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
  let p = d.prices.filter((x) => x[1] > 0);
  // downsample to ~220 points for a clean path
  const step = Math.max(1, Math.floor(p.length / 220));
  const out = [];
  for (let i = 0; i < p.length; i += step) out.push(p[i]);
  if (out[out.length - 1] !== p[p.length - 1]) out.push(p[p.length - 1]);
  return out;
}

// build chart geometry. arrowAt: 'start' | 'min'
function build(prices, arrowAt) {
  const ts = prices.map((p) => p[0]);
  const vs = prices.map((p) => p[1]);
  const tMin = ts[0], tMax = ts[ts.length - 1];
  const vMin = Math.min(...vs), vMax = Math.max(...vs);
  const pad = (vMax - vMin) * 0.10;
  const lo = Math.max(0, vMin - pad), hi = vMax + pad;
  const x = (t) => PX + ((t - tMin) / (tMax - tMin)) * PW;
  const y = (v) => PY + PH - ((v - lo) / (hi - lo)) * PH;
  const pts = prices.map((p) => [x(p[0]), y(p[1])]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = 'M' + pts[0][0].toFixed(1) + ' ' + (PY + PH) + ' ' + pts.map((p) => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (PY + PH) + ' Z';
  // arrow target
  let ai = 0;
  if (arrowAt === 'min') { let m = Infinity; vs.forEach((v, i) => { if (v < m) { m = v; ai = i; } }); }
  const target = pts[ai];
  const targetDate = new Date(ts[ai]);
  return { line, area, pts, target, targetDate, last: vs[vs.length - 1], lastPt: pts[pts.length - 1] };
}

function fmt(v) {
  if (v >= 100) return '$' + v.toFixed(0);
  if (v >= 1) return '$' + v.toFixed(2);
  if (v >= 0.01) return '$' + v.toFixed(3);
  return '$' + v.toExponential(1);
}
const MONTH = (d) => d.toLocaleString('en-US', { month: 'short' }) + " '" + String(d.getFullYear()).slice(2);

function chartHTML({ eyebrow, ticker, title, file, arrowAt, accent, showLast }) {
  const prices = loadPrices(file);
  const g = build(prices, arrowAt);
  const acc = accent || C.green;
  // arrow geometry: come in from upper area down to the target
  const tx = g.target[0], ty = g.target[1];
  // badge sits up-and-left of target (start arrow) — for 'start' badge to the right of left edge
  const badgeX = arrowAt === 'min' ? tx - 40 : tx + 30;
  const badgeY = ty - 150;
  const labelX = badgeX, labelY = badgeY - 16;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=JetBrains+Mono:wght@600;700&family=DM+Sans:wght@400;500;700&family=Inter:wght@800;900&display=swap" rel="stylesheet">
<style>*{margin:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;background:${C.bg};overflow:hidden}</style></head>
<body>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${acc}" stop-opacity="0.30"/><stop offset="100%" stop-color="${acc}" stop-opacity="0"/></radialGradient>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${acc}" stop-opacity="0.42"/><stop offset="100%" stop-color="${acc}" stop-opacity="0.02"/></linearGradient>
    <marker id="ah" markerWidth="13" markerHeight="13" refX="3" refY="6" orient="auto"><path d="M1 1 L11 6 L1 11 Z" fill="${C.gold}"/></marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <circle cx="${W - 120}" cy="160" r="520" fill="url(#orb)"/>
  <!-- header -->
  <text x="${PX}" y="150" font-family="'JetBrains Mono',monospace" font-size="28" letter-spacing="6" fill="${C.cyan}" font-weight="700">${eyebrow}</text>
  <text x="${PX}" y="232" font-family="'Playfair Display',serif" font-size="76" font-weight="900" fill="${C.ink}">${title}</text>
  <rect x="${PX}" y="262" width="70" height="4" rx="2" fill="${acc}"/>
  <!-- grid -->
  ${[0, 0.25, 0.5, 0.75, 1].map((f) => { const yy = PY + PH - f * PH; return `<line x1="${PX}" y1="${yy.toFixed(0)}" x2="${PX + PW}" y2="${yy.toFixed(0)}" stroke="${C.edge}" stroke-width="1"/>`; }).join('')}
  <!-- area + line -->
  <path d="${g.area}" fill="url(#fill)"/>
  <path d="${g.line}" fill="none" stroke="${acc}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- last price dot -->
  <circle cx="${g.lastPt[0].toFixed(1)}" cy="${g.lastPt[1].toFixed(1)}" r="9" fill="${acc}"/>
  ${showLast ? `<text x="${(g.lastPt[0] - 14).toFixed(1)}" y="${(g.lastPt[1] - 24).toFixed(1)}" text-anchor="end" font-family="'Inter',sans-serif" font-size="34" font-weight="900" fill="${C.ink}">${fmt(g.last)}</text>` : ''}
  <!-- ticker chip -->
  <rect x="${PX + PW - 168}" y="${PY - 64}" width="168" height="46" rx="10" fill="${C.card}" stroke="${C.edge}"/>
  <text x="${PX + PW - 84}" y="${PY - 32}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="26" font-weight="700" fill="${acc}">${ticker}</text>
  <!-- ARROW -> target -->
  <text x="${labelX.toFixed(0)}" y="${labelY.toFixed(0)}" text-anchor="${arrowAt === 'min' ? 'end' : 'start'}" font-family="'Inter',sans-serif" font-size="40" font-weight="900" fill="${C.gold}">MY CALL</text>
  <text x="${labelX.toFixed(0)}" y="${(labelY + 40).toFixed(0)}" text-anchor="${arrowAt === 'min' ? 'end' : 'start'}" font-family="'JetBrains Mono',monospace" font-size="24" font-weight="700" fill="${C.sec}">${MONTH(g.targetDate)}</text>
  <path d="M${badgeX.toFixed(0)} ${(badgeY + 8).toFixed(0)} Q${((badgeX + tx) / 2).toFixed(0)} ${((badgeY + ty) / 2 + 30).toFixed(0)} ${(tx + (arrowAt === 'min' ? 0 : 6)).toFixed(0)} ${(ty - 18).toFixed(0)}" fill="none" stroke="${C.gold}" stroke-width="4" marker-end="url(#ah)"/>
  <circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="11" fill="none" stroke="${C.gold}" stroke-width="4"/>
</svg></body></html>`;
}

const CHARTS = [
  { ticker: '$TAO', file: 'bittensor.json', arrowAt: 'min', eyebrow: 'THE CALL', title: 'I called the February bottom', accent: C.green, showLast: true, out: 'chart-tao.png' },
  { ticker: '$LAB', file: 'lab-90.json', arrowAt: 'start', eyebrow: 'THE CALL', title: 'Called it near the lows', accent: C.cyan, showLast: true, out: 'chart-lab.png' },
  { ticker: '$VELVET', file: 'velvet-90.json', arrowAt: 'start', eyebrow: 'THE CALL', title: 'Called it early', accent: C.gold, showLast: true, out: 'chart-velvet.png' },
];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const c of CHARTS) {
    const html = chartHTML(c);
    const tmp = path.join(DATA, '_chart.html');
    fs.writeFileSync(tmp, html);
    await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500); // let webfonts settle
    const outPath = path.join(OUT, c.out);
    await page.screenshot({ path: outPath });
    console.log('OK', c.out);
  }
  await browser.close();
})();
