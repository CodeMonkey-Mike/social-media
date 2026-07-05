// debug: does the 4K project's "Glitch Offset - Nx" sequence carry SFX clips?
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const XML_PATH = path.join(process.env.TEMP, 'sw4k.xml');
if (!fs.existsSync(XML_PATH)) {
  const prproj = path.join(__dirname, 'Swiftly Studio 850 Seamless Transitions/Transitions/Transitions - 4K UltraHD - 3840x2160.prproj');
  process.stderr.write('decompressing 4K prproj -> sw4k.xml ...\n');
  fs.writeFileSync(XML_PATH, zlib.gunzipSync(fs.readFileSync(prproj)));
}
const xml = fs.readFileSync(XML_PATH, 'utf8');
const TICKS = 254016000000;

const idIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g; let m; while ((m = re.exec(xml))) idIndex.set(m[2], { start: m.index, tag: m[1] }); }
const uidIndex = new Map();
{ const re = /<([A-Za-z0-9_.]+)\s+ObjectUID="([0-9a-f-]{36})"/g; let m; while ((m = re.exec(xml))) uidIndex.set(m[2], { start: m.index, tag: m[1] }); }
process.stderr.write('indexes built\n');

function slice(start, tag) {
  const fc = xml.indexOf('>', start);
  if (xml[fc - 1] === '/') return xml.slice(start, fc + 1);
  const o = new RegExp('<' + tag + '(\\s|>)', 'g'); const ct = '</' + tag + '>';
  let d = 0, i = start;
  while (i < xml.length) {
    o.lastIndex = i; const mm = o.exec(xml); const no = mm ? mm.index : -1; const nc = xml.indexOf(ct, i);
    if (nc === -1) break;
    if (no !== -1 && no < nc) { d++; i = no + tag.length + 1; } else { d--; i = nc + ct.length; if (d === 0) return xml.slice(start, i); }
  }
  return xml.slice(start, start + 12000);
}
const byId = (id) => { const e = idIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };
const byUid = (id) => { const e = uidIndex.get(String(id)); return e ? { xml: slice(e.start, e.tag), tag: e.tag } : null; };

function seqTrackGroupRefs(name) {
  let pos = -1;
  while ((pos = xml.indexOf('<Name>' + name + '</Name>', pos + 1)) !== -1) {
    const back = xml.slice(Math.max(0, pos - 4000), pos);
    const tgStart = back.lastIndexOf('<TrackGroups');
    if (tgStart === -1) continue;
    const tgXml = back.slice(tgStart);
    if (!/<\/TrackGroups>/.test(tgXml)) continue;
    return [...tgXml.matchAll(/<Second ObjectRef="(\d+)"\/>/g)].map((m) => m[1]);
  }
  return null;
}

for (const n of [1, 2, 3, 4, 5, 6, 7]) {
  const name = `Glitch Offset - ${n}x`;
  const refs = seqTrackGroupRefs(name);
  if (!refs) { console.log(name + ': no sequence'); continue; }
  for (const r of refs) {
    const g = byId(r);
    if (!g || g.tag !== 'AudioTrackGroup') continue;
    const tracks = [...g.xml.matchAll(/<Track Index="(\d+)" ObjectURef="([0-9a-f-]{36})"/g)];
    let total = 0;
    for (const [, ti, tu] of tracks) {
      const t = byUid(tu); if (!t) continue;
      const items = [...t.xml.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((x) => x[1]);
      total += items.length;
      for (const id of items) {
        const it = byId(id); if (!it) continue;
        const start = (it.xml.match(/<Start>(\d+)<\/Start>/) || [])[1];
        const end = (it.xml.match(/<End>(\d+)<\/End>/) || [])[1];
        const subRef = (it.xml.match(/<SubClip ObjectRef="(\d+)"/) || [])[1];
        let label = '?';
        if (subRef) {
          const sc = byId(subRef);
          if (sc) {
            label = (sc.xml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '?';
            const mcUid = (sc.xml.match(/<MasterClip ObjectURef="([0-9a-f-]{36})"/) || [])[1];
            const mcRef = (sc.xml.match(/<MasterClip ObjectRef="(\d+)"/) || [])[1];
            const mc = mcUid ? byUid(mcUid) : mcRef ? byId(mcRef) : null;
            if (mc) {
              const mp = (mc.xml.match(/<ActualMediaFilePath>([^<]*)<\/ActualMediaFilePath>/) || mc.xml.match(/<FilePath>([^<]*)<\/FilePath>/) || [])[1];
              if (mp) label += ' <- ' + mp.split(/[\\\/]/).pop();
            }
          }
        }
        console.log(`${name}: t${ti} [${(start / TICKS).toFixed(2)} - ${(end / TICKS).toFixed(2)}] ${label}`);
      }
    }
    if (!total) console.log(name + ': audio group EMPTY (' + tracks.length + ' tracks)');
  }
}
