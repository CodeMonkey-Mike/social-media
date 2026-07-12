#!/usr/bin/env node
/** Summarize _glassbeveled-clips.json: per sequence, per (In)/(Out) clip — effect order,
 * each Offset's kf phase + mask geometry (bbox/center + straight-vs-curved corners),
 * so the mechanism can be decoded before building. */
const data = require(process.argv[2] ? './' + process.argv[2] : './_glassbeveled-clips.json');

function maskSummary(m) {
  if (!m || !m.path || m.path.error) return 'MASK-ERR:' + JSON.stringify(m && m.path);
  const vs = m.path.verts;
  const xs = vs.map((v) => v.a[0]), ys = vs.map((v) => v.a[1]);
  const bx = [Math.min(...xs), Math.max(...xs)].map((x) => +x.toFixed(3));
  const by = [Math.min(...ys), Math.max(...ys)].map((x) => +x.toFixed(3));
  const curved = vs.some((v) => Math.abs(v.ti[0] - v.a[0]) > 1e-4 || Math.abs(v.ti[1] - v.a[1]) > 1e-4);
  const anchors = vs.map((v) => `(${v.a[0].toFixed(2)},${v.a[1].toFixed(2)})`).join(' ');
  const extras = ['Mask Feather', 'Mask Opacity', 'Mask Expansion'].map((k) => m[k]).join('/');
  const others = Object.keys(m).filter((k) => /^p\d+$/.test(k)).map((k) => `${k}=${m[k]}`).join(',');
  return `n=${m.path.nVerts} flag=${m.path.flag} ${curved ? 'CURVED' : 'straight'} bbox x[${bx}] y[${by}] F/O/E=${extras} ${others}${m.pathKeyframed ? ' PATH-KEYFRAMED!' : ''}${m.path.layoutWarn ? ' WARN:' + m.path.layoutWarn : ''}\n        anchors: ${anchors}`;
}

for (const seq of data) {
  console.log('\n================ ' + seq.name);
  for (const c of seq.clips) {
    const nm = c.subClipName || c.masterClipName || '?';
    if (!/\((In|Out)\)/.test(nm)) { console.log(`  [content] ${nm} ${c.start}..${c.end} in=${c.inPoint}`); continue; }
    console.log(`  [${nm.match(/\((In|Out)\)/)[1]}] ${c.start}..${c.end} in=${c.inPoint} effects=${c.effects.length}`);
    c.effects.forEach((e, i) => {
      if (e.matchName === 'PR.ADBE Horizontal Flip') { console.log(`    ${i}: HFlip`); return; }
      if (e.matchName === 'PR.ADBE Vertical Flip') { console.log(`    ${i}: VFlip`); return; }
      if (e.matchName !== 'AE.ADBE Offset') {
        console.log(`    ${i}: ${e.matchName} params=${e.params.map((p) => p.name + '=' + (p.value || 'kf')).join(',')}`);
        return;
      }
      const shift = e.params.find((p) => p.name === 'Shift Center To');
      const kfs = shift && shift.keyframes ? shift.keyframes : [];
      const kfDesc = kfs.map((k) => `t=${k.t} v=${k.v}`).join(' | ');
      console.log(`    ${i}: Offset ${kfDesc}`);
      (e.masks || []).forEach((m) => console.log(`      mask ${m.pathHash ? m.pathHash.slice(0, 8) : '?'}: ${maskSummary(m)}`));
    });
  }
  if (seq.audio) seq.audio.forEach((a) => console.log(`  [audio] ${a.masterClipName} ${a.start}..${a.end} in=${a.inPoint}`));
}
