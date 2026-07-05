// Which emboss kernel sign/orientation matches the pack preview? (Glitch Offset,
// 2026-07-05 — settled the engine's "direction 180" reading: VERTICAL kernel,
// green on TOP edges of bright objects. Mirrors the Invert numeric verification.)
//
// Reconstruct: tint(green=1-luma) -> emboss(bias .5, contrast .6, relief d) ->
// tiny +y shift -> Pin Light onto base, then compare MSE against the real
// aberrated preview frames (raw_2..raw_4 = n1..n3; raw_1 = n0 clean base),
// applying the t2 roll dy (small integer px search). MSE alone favors roll-only
// (pulldown blending softens the target), so the decisive part is the residual
// CORRELATION test at the bottom — plus viewing the amplified residual image
// (green-above/magenta-below pairs on horizontal edges = vertical kernel).
//
// Input frames (PPM) — regenerate with:
//   ffmpeg -i "Swiftly .../Preview Transitions/GLITCH/Offset/Glitch Offset - 1x.mp4" \
//     -vf "select='lt(n,4)'" -vsync vfr -pix_fmt rgb24 <dir>/raw_%d.ppm
// then: node _verify-offset-sign.js <dir>
const fs = require('fs');
const dir = process.argv[2] || 'C:/Users/mnede/AppData/Local/Temp/offset-qa';

function readPPM(p) {
  const b = fs.readFileSync(p);
  // P6\nW H\n255\n
  let i = 0, tok = [], cur = '';
  while (tok.length < 4) {
    const c = String.fromCharCode(b[i++]);
    if (/\s/.test(c)) { if (cur) { tok.push(cur); cur = ''; } } else cur += c;
  }
  const [, w, h] = [tok[0], +tok[1], +tok[2]];
  return { w, h, data: b.slice(i) };
}

const base = readPPM(dir + '/raw_1.ppm');
const W = base.w, H = base.h;
const px = (img, x, y, c) => img.data[(y * W + x) * 3 + c] / 255;

// tint-green plane of the base: g = 1 - Rec601 luma
const tintG = new Float64Array(W * H);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    tintG[y * W + x] = 1 - (0.299 * px(base, x, y, 0) + 0.587 * px(base, x, y, 1) + 0.114 * px(base, x, y, 2));

const clampi = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** emboss plane: 0.5 + k*(g(p-d) - g(p+d)), d along x (horiz) or y (vert), sign s. */
function embossPlane(k, d, horiz, s) {
  const out = new Float64Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const a = horiz ? tintG[y * W + clampi(x - d, 0, W - 1)] : tintG[clampi(y - d, 0, H - 1) * W + x];
      const b2 = horiz ? tintG[y * W + clampi(x + d, 0, W - 1)] : tintG[clampi(y + d, 0, H - 1) * W + x];
      out[y * W + x] = 0.5 + s * k * (a - b2);
    }
  return out;
}

const pin = (b, s) => (s > 0.5 ? Math.max(b, 2 * s - 1) : Math.min(b, 2 * s));

/** Build full effect frame: pin light of green emboss (shifted by embShift y) on base, then roll by dy px (wrap). */
function makeFrame(emb, embShift, dy) {
  const out = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    const ySrc = ((y - dy) % H + H) % H; // roll
    const yEmb = clampi(ySrc - embShift, 0, H - 1);
    for (let x = 0; x < W; x++) {
      const e = emb[yEmb * W + x];
      // emboss layer after conv+bias: R=B=0.5 flat (pin-light neutral), G carries relief
      const r = pin(px(base, x, ySrc, 0), 0.5);
      const g = pin(px(base, x, ySrc, 1), e);
      const bl = pin(px(base, x, ySrc, 2), 0.5);
      out[(y * W + x) * 3] = Math.round(r * 255);
      out[(y * W + x) * 3 + 1] = Math.round(g * 255);
      out[(y * W + x) * 3 + 2] = Math.round(bl * 255);
    }
  }
  return out;
}

function mse(bufA, imgB) {
  let s = 0;
  for (let i = 0; i < bufA.length; i++) { const d2 = bufA[i] - imgB.data[i]; s += d2 * d2; }
  return s / bufA.length;
}

// ALSO: no-tint / no-effect baselines for reference
function rollOnly(dy) {
  const out = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    const ySrc = ((y - dy) % H + H) % H;
    base.data.copy(out, y * W * 3, ySrc * W * 3, (ySrc + 1) * W * 3);
  }
  return out;
}

const k = 0.6, d = 1, embShift = 1; // relief 3 @1920 -> ~0.75px @480; shift 0.278%*270 ~ 0.75px
const variants = {
  'horiz +': embossPlane(k, d, true, 1),
  'horiz -': embossPlane(k, d, true, -1),
  'vert  +': embossPlane(k, d, false, 1),
  'vert  -': embossPlane(k, d, false, -1),
};

for (const fi of [2, 3, 4]) {
  const target = readPPM(`${dir}/raw_${fi}.ppm`);
  // dy candidates: around curve values (fractions of H=270): 0, -3, -4, +33 (0.123*270)
  const results = [];
  for (const dy of [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3]) {
    results.push({ name: `roll-only dy=${dy}`, mse: mse(rollOnly(dy), target) });
    for (const [nm, emb] of Object.entries(variants))
      results.push({ name: `${nm} dy=${dy}`, mse: mse(makeFrame(emb, embShift, dy), target) });
  }
  results.sort((a, b) => a.mse - b.mse);
  console.log(`--- target n${fi - 1}: best 6 of ${results.length}`);
  for (const r of results.slice(0, 6)) console.log(`   ${r.name}  mse=${r.mse.toFixed(1)}`);
}

// --- decisive orientation test: correlate the target's G residual (vs roll-only)
// with each emboss plane; amplitude-insensitive, immune to pulldown softening.
console.log('\n=== residual correlation (G channel) ===');
for (const [fi, dy] of [[2, -2], [3, -5], [4, 3]]) {
  const target = readPPM(`${dir}/raw_${fi}.ppm`);
  const res = new Float64Array(W * H);
  for (let y = 0; y < H; y++) {
    const ySrc = ((y - dy) % H + H) % H;
    for (let x = 0; x < W; x++)
      res[y * W + x] = target.data[(y * W + x) * 3 + 1] / 255 - px(base, x, ySrc, 1);
  }
  const out = [];
  for (const [nm, emb] of Object.entries(variants)) {
    // predicted G delta from pin light: pin(b, e) - b, rolled like the content
    let se = 0, sr = 0, see = 0, srr = 0, n = 0;
    for (let y = 0; y < H; y++) {
      const ySrc = ((y - dy) % H + H) % H;
      const yEmb = clampi(ySrc - 1, 0, H - 1);
      for (let x = 0; x < W; x++) {
        const b = px(base, x, ySrc, 1);
        const pred = pin(b, emb[yEmb * W + x]) - b;
        const r = res[y * W + x];
        se += pred * r; sr += pred; srr += r; see += pred * pred; n++;
      }
    }
    const cov = se / n - (sr / n) * (srr / n);
    const corr = cov / Math.sqrt((see / n - (sr / n) ** 2) || 1e-12);
    out.push({ nm, corr });
  }
  out.sort((a, b) => b.corr - a.corr);
  console.log(`n${fi - 1} (dy=${dy}): ` + out.map((o) => `${o.nm}=${o.corr.toFixed(4)}`).join('  '));
}
