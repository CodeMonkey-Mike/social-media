// Glitch Roughly mechanism test (2x): are the plate-window regions in the preview
//   H1: the PLATE's own pixels (white/gray chunks overlaid), or
//   H2: CONTENT shown through the plate luma (effects-on-content, Blocks-style)?
// Discriminators, measured inside each plate's white region at aligned frames:
//   chroma  = mean(max(RGB)-min(RGB))   -> ~0 for H1 (plates are B/W), content-like for H2
//   whiteness = mean luma                -> ~255 for H1 frag (plate is pure white), content-like for H2
// Preview frame n (29.97) ~ media frame n/29.97*25; use n where that lands near an integer.
const fs = require('fs');
const D = '_qa/roughly';

function readPPM(p) {
  const b = fs.readFileSync(p);
  let i = 0, tok = [], cur = '';
  while (tok.length < 4) {
    const c = String.fromCharCode(b[i++]);
    if (/\s/.test(c)) { if (cur) { tok.push(cur); cur = ''; } } else cur += c;
  }
  return { w: +tok[1], h: +tok[2], data: b.slice(i) };
}
const pad = (n) => String(n).padStart(2, '0');

// preview frame index (1-based ffmpeg) -> media frame (25fps, 0-based)
// n1: 1..11 ; media time (n1-1)/29.97 ; media frame = round(t*25) when close
const CASES = [
  { n1: 6, media: 4 },  // t=0.1668 -> 4.17 ~ frame 4 (just after cut 0.16)
  { n1: 7, media: 5 },  // t=0.2002 -> 5.005 ~ frame 5 (both windows active)
  { n1: 8, media: 6 },  // t=0.2335 -> 5.84 ~ frame 6 (borderline blend)
];

function stats(img, mask, thr) {
  // mask = plate image; region = mask luma > thr
  let n = 0, chroma = 0, luma = 0;
  for (let i = 0; i < img.w * img.h; i++) {
    const mr = mask.data[3 * i], mg = mask.data[3 * i + 1], mb = mask.data[3 * i + 2];
    const ml = 0.299 * mr + 0.587 * mg + 0.114 * mb;
    if (ml < thr) continue;
    const r = img.data[3 * i], g = img.data[3 * i + 1], b = img.data[3 * i + 2];
    chroma += Math.max(r, g, b) - Math.min(r, g, b);
    luma += 0.299 * r + 0.587 * g + 0.114 * b;
    n++;
  }
  return n ? { n, chroma: chroma / n, luma: luma / n } : { n: 0, chroma: NaN, luma: NaN };
}
function statsOutside(img, masks, thr) {
  let n = 0, chroma = 0, luma = 0;
  for (let i = 0; i < img.w * img.h; i++) {
    let inMask = false;
    for (const mask of masks) {
      const ml = 0.299 * mask.data[3 * i] + 0.587 * mask.data[3 * i + 1] + 0.114 * mask.data[3 * i + 2];
      if (ml > thr) { inMask = true; break; }
    }
    if (inMask) continue;
    const r = img.data[3 * i], g = img.data[3 * i + 1], b = img.data[3 * i + 2];
    chroma += Math.max(r, g, b) - Math.min(r, g, b);
    luma += 0.299 * r + 0.587 * g + 0.114 * b;
    n++;
  }
  return { n, chroma: chroma / n, luma: luma / n };
}

for (const c of CASES) {
  const pv = readPPM(`${D}/pv_${pad(c.n1)}.ppm`);
  // frag window: media frame f -> plate frame f (in-point 121 == plate 0, window from t=0)
  // blocks window: active 0.12-0.24 (media frames 3..6), in-point 127.12 -> plate frame (f-3)+3 = f
  //   (plate slot 127.00 == plate frame 0; window starts at 127.12 = plate frame 3 at media frame 3)
  const fg = readPPM(`${D}/fg_${pad(c.media + 1)}.ppm`);
  const bk = readPPM(`${D}/bk_${pad(c.media + 1)}.ppm`);
  const sFrag = stats(pv, fg, 128);
  const sBlk = stats(pv, bk, 128);
  const sOut = statsOutside(pv, [fg, bk], 60);
  console.log(`preview n=${c.n1} (media f${c.media}):`);
  console.log(`  frag region  n=${sFrag.n}  chroma=${sFrag.chroma?.toFixed(1)}  luma=${sFrag.luma?.toFixed(1)}   (H1 => chroma~0, luma~255)`);
  console.log(`  blocks region n=${sBlk.n}  chroma=${sBlk.chroma?.toFixed(1)}  luma=${sBlk.luma?.toFixed(1)}   (H1 => chroma~0, luma=plate gray)`);
  console.log(`  outside      n=${sOut.n}  chroma=${sOut.chroma.toFixed(1)}  luma=${sOut.luma.toFixed(1)}   (content baseline)`);
}
