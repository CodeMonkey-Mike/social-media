#!/usr/bin/env node
/**
 * Generates the per-folder gallery.html browser for the transition library.
 *
 * Single source of truth = ./library.json. Mirrors the Adobe pack tree under
 * ./browse/<CATEGORY>/<VARIANT>/ and writes ONE gallery.html into each folder:
 *   - browse/gallery.html                  -> cards to each category
 *   - browse/<CAT>/gallery.html            -> cards to each variant
 *   - browse/<CAT>/<VARIANT>/gallery.html  -> the actual transition videos (play here)
 *
 * Each leaf page only embeds its own folder's clips, so no page ever loads the
 * whole library. Re-run after editing library.json or re-rendering clips:
 *   node assets/transitions/_gen-galleries.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const BROWSE = path.join(ROOT, 'browse');
const lib = JSON.parse(fs.readFileSync(path.join(ROOT, 'library.json'), 'utf8'));

const CSS = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0c0d10;color:#e8eaed}
header{padding:20px 28px;border-bottom:1px solid #23262d}
header .crumb{color:#8a90a0;font-size:14px}
header h1{margin:6px 0 0;font-size:24px;letter-spacing:.3px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px;padding:24px 28px}
.card{background:#15171c;border:1px solid #23262d;border-radius:12px;overflow:hidden;transition:border-color .15s}
.card:hover{border-color:#3a3f4b}
.card a{color:inherit;text-decoration:none;display:block}
.card video,.card .thumb{width:100%;aspect-ratio:16/9;display:block;background:#000;object-fit:cover}
.card .meta{padding:12px 14px}
.card .meta .label{font-size:15px;font-weight:600}
.badges{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.badge{font-size:11px;padding:3px 8px;border-radius:20px;background:#23262d;color:#aeb4c2}
.badge.near{background:#10331f;color:#5fe39a}
.badge.approx{background:#3a2a10;color:#f0b35f}
.folder .thumb{display:flex;align-items:center;justify-content:center;font-size:42px;color:#4a5160}
`;

const page = (crumb, title, bodyHtml) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${CSS}</style></head>
<body><header><div class="crumb">${crumb}</div><h1>${title}</h1></header>
<div class="grid">${bodyHtml}</div></body></html>`;

const fidBadge = (f) =>
  f === 'near-1:1' ? `<span class="badge near">near-1:1</span>` : `<span class="badge approx">approximate</span>`;

// group rows: category -> variant -> [rows]
const cats = {};
for (const r of lib.transitions) {
  (cats[r.category] ||= {});
  (cats[r.category][r.variant] ||= []).push(r);
}

const write = (dir, html) => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'gallery.html'), html);
};

// poster: pull a mid-transition frame so the tile signals the effect
const makePoster = (mp4, jpg) => {
  if (!fs.existsSync(mp4)) return false;
  try {
    execSync(`ffmpeg -y -ss 0.55 -i "${mp4}" -vframes 1 -q:v 4 "${jpg}"`, { stdio: 'ignore' });
    return true;
  } catch { return false; }
};

let leaves = 0, clips = 0;

// ---- leaf pages (the actual videos) ----
for (const [cat, variants] of Object.entries(cats)) {
  for (const [variant, rows] of Object.entries(variants)) {
    const dir = path.join(BROWSE, cat, variant);
    const cards = rows.map((r) => {
      const mp4 = `${r.id}.mp4`;
      const posterFile = `${r.id}.poster.jpg`;
      const hasPoster = makePoster(path.join(dir, mp4), path.join(dir, posterFile));
      if (fs.existsSync(path.join(dir, mp4))) clips++;
      const poster = hasPoster ? ` poster="${posterFile}"` : '';
      return `<div class="card"><video controls preload="none"${poster} src="${mp4}"></video>
<div class="meta"><div class="label">${r.label}</div>
<div class="badges"><span class="badge">${r.intensity}</span>
<span class="badge">${r.durationSeconds}s</span><span class="badge">${r.kind}</span>
${fidBadge(r.fidelity)}${r.sfx ? '<span class="badge">+ sfx</span>' : ''}</div></div></div>`;
    }).join('\n');
    write(dir, page(`transitions / ${cat} /`, `${cat} · ${variant}`, cards));
    leaves++;
  }
}

// ---- category pages (cards -> variants) ----
for (const [cat, variants] of Object.entries(cats)) {
  const cards = Object.entries(variants).map(([variant, rows]) => {
    const first = rows[0];
    const thumb = `<img class="thumb" src="${variant}/${first.id}.poster.jpg" alt="">`;
    return `<div class="card"><a href="${variant}/gallery.html">${thumb}
<div class="meta"><div class="label">${variant}</div>
<div class="badges"><span class="badge">${rows.length} transition${rows.length > 1 ? 's' : ''}</span></div></div></a></div>`;
  }).join('\n');
  write(path.join(BROWSE, cat), page(`transitions /`, cat, cards));
}

// ---- root index (cards -> categories) ----
const rootCards = Object.entries(cats).map(([cat, variants]) => {
  const total = Object.values(variants).reduce((n, rs) => n + rs.length, 0);
  return `<div class="card folder"><a href="${cat}/gallery.html">
<div class="thumb">▸ ${cat}</div>
<div class="meta"><div class="label">${cat}</div>
<div class="badges"><span class="badge">${Object.keys(variants).length} variant(s)</span>
<span class="badge">${total} transition(s)</span></div></div></a></div>`;
}).join('\n');
write(BROWSE, page('transitions', 'Transition Library', rootCards));

console.log(`Generated galleries: root + ${Object.keys(cats).length} category page(s) + ${leaves} leaf page(s), ${clips} clip(s).`);
console.log(`Open: ${path.join(BROWSE, 'gallery.html')}`);
