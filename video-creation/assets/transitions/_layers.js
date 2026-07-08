// For "Glitch Cinematic Bad Signal Max - 1": resolve each clip's SOURCE chain
// (SubClip -> MasterClip -> media kind/name) to learn if t1/t2/t3 are adjustment
// layers or nested sequences, and dump the Opacity blend-mode values + ALL
// component MatchNames (incl zero-param) per clip.
const fs = require('fs');
const path = require('path');
const xml = fs.readFileSync(path.join(process.env.TEMP, 'sw.xml'), 'utf8');
const idIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g; let m; while ((m = re.exec(xml))) idIndex.set(m[2], { start: m.index, tag: m[1] }); }
const uidIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectUID="([0-9a-f-]{36})"/g; let m; while ((m = re.exec(xml))) uidIndex.set(m[2], { start: m.index, tag: m[1] }); }
function slice(start, tag) {
  const fc = xml.indexOf('>', start);
  if (xml[fc - 1] === '/') return xml.slice(start, fc + 1);
  const o = new RegExp('<' + tag + '(\\s|>)', 'g'); const ct = '</' + tag + '>';
  let d = 0, i = start;
  while (i < xml.length) { o.lastIndex = i; const mm = o.exec(xml); const no = mm ? mm.index : -1; const nc = xml.indexOf(ct, i);
    if (nc === -1) break; if (no !== -1 && no < nc) { d++; i = no + tag.length + 1; } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); } }
  return xml.slice(start, start + 9000);
}
const byId = (id) => { const e = idIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
const byUid = (id) => { const e = uidIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };

const CLIPS = { 't1 Offset': '31366', 't2 Tint': '31367', 't3 Pixelate': '31368', 't4 content-a': '31369', 't4 content-b': '31370', 't0 base': '31365' };
for (const [lbl, id] of Object.entries(CLIPS)) {
  const it = byId(id); if (!it) { console.log(lbl, 'MISSING'); continue; }
  const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
  console.log(`\n#### ${lbl} (clip ${id}) ####`);
  // blend mode on the clip-item itself?
  const oFlags = it.xml.match(/<Opacity[^>]*>[\s\S]*?<\/Opacity>/);
  if (subRef) {
    const sc = byId(subRef);
    const mcUid = (sc.xml.match(/<MasterClip ObjectURef="([0-9a-f-]{36})"/) || [])[1];
    const scName = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1];
    console.log(`  SubClip ${subRef} name="${scName}" tag=${sc.tag}`);
    if (mcUid) {
      const mc = byUid(mcUid);
      if (mc) {
        const mcName = (mc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1];
        // media reference inside masterclip
        const media = (mc.xml.match(/<(MediaSource|Media|ClipNode)[^>]*Object[UR]*ef="([0-9a-f-]+|\d+)"/) || []);
        const isAdj = /Adjustment/i.test(mc.xml) ? 'ADJUSTMENT-LAYER' : (/<VideoMediaSource|Importer/.test(mc.xml) ? 'media-file' : (sc.tag));
        console.log(`  MasterClip "${mcName}" tag=${mc.tag}  kind≈${isAdj}`);
        // show a hint of media
        const imp = (mc.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || mc.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1];
        if (imp) console.log(`    media: ${imp}`);
        console.log(`    masterclip flags: AdjLayer=${/AdjustmentLayer|isAdjustment/i.test(mc.xml)}`);
      }
    }
  }
}
console.log('\nDONE');
