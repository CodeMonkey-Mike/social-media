// Summarize _offset-clips.json: merge the two t2 clips' keyframed wrap-Offset curves
// into ONE sequence-time curve per variant (t_seq = clip.start + (kf.t - inPoint)),
// report t1 HST window params, swapAt, duration, and sanity-check x is static.
const d = require('./_offset-clips.json');

for (const s of d) {
  const dur = Math.max(...s.clips.map((c) => c.end || 0));
  const t2 = s.clips.filter((c) => c.track === 2).sort((a, b) => a.start - b.start);
  const pts = new Map();
  let xMoves = false;
  for (const c of t2) {
    const off = c.effects.find((e) => /ADBE Offset/.test(e.matchName));
    const kfs = off.params.find((p) => p.name === 'Shift Center To').keyframes;
    for (const kf of kfs) {
      const tSeq = +(c.start + (kf.t - c.inPoint)).toFixed(4);
      if (tSeq < c.start - 1e-6 || tSeq > c.end + 1e-6) continue;
      const [x, y] = kf.v.split(':').map(Number);
      if (Math.abs(x - 0.5) > 1e-6) xMoves = true;
      pts.set(tSeq, { dx: +(x - 0.5).toFixed(5), dy: +(y - 0.5).toFixed(5) });
    }
  }
  const curve = [...pts.entries()].sort((a, b) => a[0] - b[0]).map(([t, v]) => ({ t, ...v }));
  const t1 = s.clips.find((c) => c.track === 1);
  const hOff = t1.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To').value.split(':').map(Number);
  const emb = t1.effects.find((e) => /ADBE Emboss/.test(e.matchName)).params;
  const ev = (nm) => Number(emb.find((p) => p.name === nm).value);
  const swapAt = +(t2[0].end / dur).toFixed(4);
  console.log(`=== ${s.name}  dur=${dur}s  cut@${t2[0].end}s (swapAt=${swapAt})  xMoves=${xMoves}`);
  console.log(`  t1 "${t1.subClipName}" [${t1.start}-${t1.end}] shift=(${(hOff[0] - 0.5).toFixed(5)},${(hOff[1] - 0.5).toFixed(5)}) emboss dir=${ev('Direction')} relief=${ev('Relief')} contrast=${ev('Contrast')}`);
  console.log('  curve: ' + curve.map((p) => `${p.t}:${p.dy}`).join(' '));
}
