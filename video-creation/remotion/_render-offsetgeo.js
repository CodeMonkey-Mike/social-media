#!/usr/bin/env node
/** Batch-render OFFSET demos: bundle the Remotion project ONCE, then renderMedia
 * every OFFSET library row (optionally filtered) into the browse tree at
 * assets/transitions/browse/OFFSET/<Variant>/<id>.mp4.
 *
 * Usage:  node _render-offsetgeo.js [substringFilter]
 *   filter matches against the row id (e.g. "simple", "-right", "bounce").
 */
const path = require('path');
const fs = require('fs');
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderMedia } = require('@remotion/renderer');

const ROOT = __dirname;
const LIB = path.join(ROOT, '..', 'assets', 'transitions', 'library.json');
const BROWSE = path.join(ROOT, '..', 'assets', 'transitions', 'browse');

(async () => {
  const filter = process.argv[2] || '';
  const rows = JSON.parse(fs.readFileSync(LIB, 'utf8')).transitions
    .filter((r) => (r.category === 'OFFSET' && r.engine === 'OffsetSlide') || (r.category === 'DEVIATION' && r.engine === 'DeviationGlitch') || (r.category === 'EXPAND' && (r.engine === 'ExpandPan' || r.engine === 'ExpandZoom')) || (r.category === 'GLASS' && r.engine === 'GlassBeveled') || (r.category === 'LIGHT LEAKS' && r.engine === 'LightLeaks') || (r.category === 'MELT') || (r.category === 'MOTION') || (r.category === 'PERSPECTIVE' && r.engine === 'PerspectiveEase') || (r.category === 'SHAKE' && r.engine === 'ShakeJolt') || (r.category === 'SPIN' && (r.engine === 'PerspectiveEase' || r.engine === 'SpinTwirl')))
    .filter((r) => r.id.includes(filter));
  if (!rows.length) { console.log('no rows match filter', JSON.stringify(filter)); return; }

  console.log(`bundling… (${rows.length} demos to render)`);
  const t0 = Date.now();
  // publicDir defaults to the full assets/ dir, but that is multi-GB (the Swiftly
  // pack .prproj files etc.) and bundling COPIES it to temp every run -> ENOSPC.
  // TransitionDemo/OFFSET only loads the two demo stills + the sfx-offset-*.mp3, so
  // point it at a minimal pub (env OFFSET_PUBDIR) when provided.
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, 'src', 'index.ts'),
    publicDir: process.env.OFFSET_PUBDIR || path.join(ROOT, '..', 'assets'),
    onProgress: () => {},
  });
  console.log(`bundled in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  let done = 0, skipped = 0;
  for (const row of rows) {
    const outDir = path.join(BROWSE, row.category, row.variant);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${row.id}.mp4`);
    const marker = outPath + '.ok';
    if (fs.existsSync(marker)) { skipped++; continue; } // marker-based resume
    const comp = await selectComposition({
      serveUrl,
      id: 'TransitionDemo',
      inputProps: { id: row.id },
    });
    const s = Date.now();
    await renderMedia({
      composition: comp,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      inputProps: { id: row.id },
      concurrency: 8,
      overwrite: true,
      timeoutInMilliseconds: 120000, // headroom for the Hit deviation convolve frames
    });
    fs.writeFileSync(marker, ''); // mark complete so a resumed run skips it
    done++;
    console.log(`  [${done + skipped}/${rows.length}] ${row.id}  (${((Date.now() - s) / 1000).toFixed(1)}s)`);
  }
  console.log(`DONE: rendered ${done} OFFSET demos this run (${skipped} already done).`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
