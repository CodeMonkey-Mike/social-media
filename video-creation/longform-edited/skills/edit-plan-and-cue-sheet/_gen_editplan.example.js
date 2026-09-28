// Generate EDIT-PLAN.md — time-ordered event log (every spoken line + every layer), final-video timecode.
const fs = require('fs');
const dir = __dirname;
const src = fs.readFileSync('C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion/src/BittensorCh1to6.tsx', 'utf8');
const tmap = fs.readFileSync(dir + '/_tmap.txt', 'utf8');
const cutsBlock = src.slice(src.indexOf('const CUTS = ['), src.indexOf(']', src.indexOf('const CUTS = [')));
const CUTS = [...cutsBlock.matchAll(/at: ([\d.]+), dur: ([\d.]+)/g)].map((m) => ({ at: +m[1], dur: +m[2] }));
const sh = (t) => t - CUTS.reduce((s, c) => s + (t > c.at ? c.dur : 0), 0);
const fmt = (t) => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(1).padStart(4, '0')}`; };
const ev = [];
// transcript (CRLF-safe, no $-anchor)
tmap.split(/\r?\n/).forEach((l) => { const m = l.match(/^\s*([\d.]+)\s*-\s*([\d.]+)\s+(.+)/); if (m) ev.push({ t: sh(+m[1]), kind: 'SAY', txt: '"' + m[3].trim() + '"' }); });
let m, re;
const slice = (key) => src.slice(src.indexOf(key), src.indexOf('];', src.indexOf(key)));
// BROLL
const broll = slice('const BROLL: Slot[] = [');
re = /([VIJ])\('([^']+)',\s*([\d.]+),\s*([\d.]+)\)/g;
while ((m = re.exec(broll))) { const k = m[1], n = m[2], a = sh(+m[3]), b = sh(+m[4]);
  if (k === 'V') ev.push({ t: a, kind: 'VIDEO', txt: `${n}  (dissolve, ${(b - a).toFixed(1)}s)` });
  else ev.push({ t: a, kind: n.startsWith('chart-') ? 'CHART' : 'IMAGE', txt: `${n}  (cross-warp, ${(b - a).toFixed(1)}s)` }); }
// CONTAINERS
re = /\{ tIn: ([\d.]+), tOut: [\d.]+, eyebrow: '([^']+)'/g;
const cont = slice('const CONTAINERS'); while ((m = re.exec(cont))) ev.push({ t: sh(+m[1]), kind: 'CONTAINER', txt: `"${m[2]}"` });
// DIAGRAMS / RECEIPTS
re = /\{ tIn: ([\d.]+), tOut: [\d.]+, src: '([^']+)'/g; const dia = slice('const DIAGRAMS'); while ((m = re.exec(dia))) ev.push({ t: sh(+m[1]), kind: 'DIAGRAM', txt: m[2] });
re = /\{ tIn: ([\d.]+), tOut: [\d.]+, src: '([^']+)'/g; const rec = slice('const RECEIPTS'); while ((m = re.exec(rec))) ev.push({ t: sh(+m[1]), kind: 'RECEIPT', txt: m[2] });
// LOGO
re = /\[([\d.]+), ([\d.]+)\]/g; const lg = slice('LOGO_SPOTS'); while ((m = re.exec(lg))) ev.push({ t: sh(+m[1]), kind: 'LOGO', txt: 'Bittensor / $TAO logo reveal' });
// CHAPTERS
re = /\{ at: ([\d.]+), num: (\d+), title: '([^']+)'/g; const ch = slice('const CHAPTERS'); while ((m = re.exec(ch))) ev.push({ t: sh(+m[1]), kind: 'TRANSITION', txt: `book-flip → Chapter ${m[2]}: ${m[3]}` });
// CTA lower-third (CryptoRich.vip) windows
const ltBlock = src.slice(src.indexOf('LT_WINDOWS'), src.indexOf(';', src.indexOf('LT_WINDOWS')));
[...ltBlock.matchAll(/\[\s*([\d.]+),\s*([\d.]+)\s*\]/g)].forEach((x) => ev.push({ t: sh(+x[1]), kind: 'CTA', txt: `CryptoRich.vip lower-third (bottom-left) → ${fmt(sh(+x[2]))}` }));
// FACE spans -> light leaks + film burns
const fs2 = slice('FACE_SPANS'); const spans = [...fs2.matchAll(/\[\s*([\d.]+),\s*([\d.]+)\s*\]/g)].map((x) => [+x[1], +x[2]]);
spans.forEach(([a, b]) => { ev.push({ t: sh(a), kind: 'FILMBURN', txt: 'face cut in' }); ev.push({ t: sh(b), kind: 'FILMBURN', txt: 'face cut out' }); if (b - a > 5) { ev.push({ t: sh(a) + 2.0, kind: 'LIGHTLEAK', txt: `sustained-face warmth overlay → ${fmt(sh(b) - 0.6)} (starts 2s into the hold)` }); ev.push({ t: sh(a), kind: 'CAPTION', txt: `captions ON for this >5s face hold → ${fmt(sh(b))} (montserrat 1-2 word)` }); } });
// SFX (final time)
// SFX are placed at ORIGINAL event times and shifted by sh() (so they stay correct as cuts are added/changed).
[['RISER', 'DSGNRise build → resolves into the CH1 title [IMPACT]', 27.12], ['IMPACT', 'Impact_3 — CH1 title reveal (riser-led)', 40.3], ['IMPACT', 'Soundjay — CH2 transition', 49.78], ['IMPACT', 'Soundjay — CH3 transition', 165.2], ['IMPACT', 'Soundjay — CH4 transition', 241.7], ['RISER', 'Creepy Orchestral Rise build → resolves into the CH5 [IMPACT]', 420.02], ['IMPACT', 'Impact_3 — Bittensor logo reveal into CH5 (riser-led)', 436.0], ['IMPACT', 'Kick_Impact_01 — "vote gets clipped"', 520.4], ['IMPACT', 'Soundjay — CH6 transition', 606.46], ['IMPACT', 'Soundjay — CH8 transition', 700.38], ['IMPACT', 'Impact_3 — "Bitcoin at $200"', 765.78]].forEach(([k, t, tm]) => ev.push({ t: sh(tm), kind: k, txt: t }));
CUTS.forEach((c) => ev.push({ t: sh(c.at), kind: 'CUT', txt: `desilencer leftover removed (−${c.dur}s)` }));
ev.push({ t: 845.37, kind: 'FADE', txt: 'fade to black + audio fade-out (0.5s outro; plays out "...give it a like")' });

ev.sort((a, b) => a.t - b.t || (a.kind === 'SAY' ? 1 : -1));
const bounds = [[0, 'CH1 — Cold open'], [49.78, 'CH2 — What Happened'], [165.2, 'CH3 — Why It Matters'], [241.7, 'CH4 — Decentralized AI'], [440.76, 'CH5 — How It Works'], [606.46, 'CH6 — The Market Voted'], [644.9, 'CH7 — Plug (face)'], [700.0, 'CH8 — The Govt Backs It'], [794.14, 'CH9 — Close']];
const chOf = (t) => { let c = bounds[0][1]; for (const [bt, nm] of bounds) if (t >= bt - 1e-6) c = nm; return c; };
let out = `# bittensor-for-the-future — EDIT-PLAN  (watch file: renders/bittensor-FULL-v8-sfx.mp4)\n\n`;
out += `Time-ordered event log: every spoken line interleaved with every layer that lands on it. FINAL video\n`;
out += `timecode (post fumble-cut). Generated from the comp + transcript by _gen_editplan.js — re-run after edits.\n`;
out += `Layers: SAY · IMAGE · VIDEO · CHART · CONTAINER · DIAGRAM · RECEIPT · LOGO · TRANSITION · LIGHTLEAK ·\n`;
out += `FILMBURN · RISER · IMPACT · CTA · CAPTION · CUT. Every IMAGE/VIDEO/IMPACT/RISER asset is placed here or REJECTED/BENCH.\n`;
let cur = '';
for (const e of ev) { const c = chOf(e.t); if (c !== cur) { out += `\n## ${c}\n`; cur = c; }
  out += `${fmt(e.t).padEnd(7)} ${e.kind === 'SAY' ? 'SAY:  ' : '[' + e.kind + '] '}${e.txt}\n`; }
const cnt = {}; ev.forEach((e) => cnt[e.kind] = (cnt[e.kind] || 0) + 1);
out += `\n---\n## Layer tallies\n` + Object.entries(cnt).sort().map(([k, v]) => `- ${k}: ${v}`).join('\n') + '\n';
fs.writeFileSync(dir + '/EDIT-PLAN.md', out);
console.log('wrote EDIT-PLAN.md —', ev.length, 'events; SAY lines:', cnt.SAY);
