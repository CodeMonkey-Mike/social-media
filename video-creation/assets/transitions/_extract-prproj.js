#!/usr/bin/env node
/**
 * Extracts REAL effect parameters + keyframe values from the Swiftly .prproj
 * (Premiere stores them as plaintext inside an ObjectRef graph). Used to drive
 * the Remotion transition engines off the project's actual numbers instead of
 * hand-tuned guesses.
 *
 * Usage:
 *   node _extract-prproj.js [matchName-substring]
 *   node _extract-prproj.js "Turbulent Displace"
 *
 * Reads the decompressed XML from /tmp/sw.xml if present, else gunzips the prproj.
 */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const TICKS_PER_SEC = 254016000000; // Premiere tick rate

function loadXml() {
  const cached = '/tmp/sw.xml';
  if (fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');
  const prproj = path.join(__dirname, 'Swiftly Studio 850 Seamless Transitions', 'Transitions', 'Transitions - FullHD - 1920x1080_1.prproj');
  return zlib.gunzipSync(fs.readFileSync(prproj)).toString('utf8');
}

const xml = loadXml();

// Index every ObjectID -> char offset of its '<' tag start.
const idIndex = new Map();
{
  const re = /<([A-Za-z0-9_.]+)\s+ObjectID="(\d+)"/g;
  let m;
  while ((m = re.exec(xml))) {
    // offset of the '<' that opens this tag
    idIndex.set(m[2], { start: m.index, tag: m[1] });
  }
}

// Return the full XML slice of the element that starts at `start` (balanced).
function sliceElement(start, tag) {
  // self-closing?
  const firstClose = xml.indexOf('>', start);
  if (xml[firstClose - 1] === '/') return xml.slice(start, firstClose + 1);
  const openRe = new RegExp(`<${tag}(\\s|>)`, 'g');
  const closeTag = `</${tag}>`;
  let depth = 0;
  let i = start;
  while (i < xml.length) {
    const nextOpen = (() => { openRe.lastIndex = i; const mm = openRe.exec(xml); return mm ? mm.index : -1; })();
    const nextClose = xml.indexOf(closeTag, i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + tag.length + 1;
    } else {
      depth--;
      i = nextClose + closeTag.length;
      if (depth === 0) return xml.slice(start, i);
    }
  }
  return xml.slice(start, Math.min(xml.length, start + 4000));
}

function getElement(id) {
  const e = idIndex.get(String(id));
  if (!e) return null;
  return sliceElement(e.start, e.tag);
}

// Parse a keyframe value tuple list: "ticks,value,...;ticks,value,...;"
function parseKeyframes(str) {
  return str.split(';').filter(Boolean).map((k) => {
    const parts = k.split(',');
    const ticks = Number(parts[0]);
    const rawVal = parts[1];
    const num = Number(rawVal);
    return {
      tSec: Number.isFinite(ticks) ? +(ticks / TICKS_PER_SEC).toFixed(4) : null,
      value: Number.isFinite(num) ? num : rawVal,
    };
  });
}

// Extract the param set of a component (its element XML).
function paramsOf(componentXml) {
  const out = [];
  const refRe = /<Param\s+Index="(\d+)"\s+ObjectRef="(\d+)"/g;
  let m;
  while ((m = refRe.exec(componentXml))) {
    const pXml = getElement(m[2]);
    if (!pXml) continue;
    const name = (pXml.match(/<Name>([^<]*)<\/Name>/) || [])[1] || '';
    const timeVarying = /<IsTimeVarying>true<\/IsTimeVarying>/.test(pXml);
    const startKf = (pXml.match(/<StartKeyframe>([^<]*)<\/StartKeyframe>/) || [])[1];
    const kfBlock = (pXml.match(/<Keyframes>([^<]*)<\/Keyframes>/) || [])[1];
    const entry = { index: +m[1], name: name.trim() };
    if (startKf) entry.start = parseKeyframes(startKf)[0]?.value;
    if (timeVarying && kfBlock) {
      const kfs = parseKeyframes(kfBlock);
      entry.timeVarying = true;
      entry.keyframes = kfs;
      if (kfs.length >= 2) entry.spanSec = +(kfs[kfs.length - 1].tSec - kfs[0].tSec).toFixed(3);
    }
    out.push(entry);
  }
  return out;
}

// Walk every VideoFilterComponent, optionally filter by MatchName substring.
const wanted = process.argv[2] || 'Turbulent Displace';
const results = [];
{
  const re = /<VideoFilterComponent\s+ObjectID="(\d+)"/g;
  let m;
  while ((m = re.exec(xml))) {
    const elXml = sliceElement(m.index, 'VideoFilterComponent');
    const match = (elXml.match(/<MatchName>([^<]+)<\/MatchName>/) || [])[1] || '';
    if (!match.includes(wanted)) continue;
    const display = (elXml.match(/<DisplayName>([^<]*)<\/DisplayName>/) || [])[1] || '';
    results.push({ objectId: m[1], matchName: match, displayName: display, params: paramsOf(elXml) });
  }
}

console.log(`Found ${results.length} "${wanted}" component(s). Showing first 3:\n`);
for (const r of results.slice(0, 3)) {
  console.log(`# ${r.displayName} (${r.matchName}) obj=${r.objectId}`);
  for (const p of r.params) {
    if (p.timeVarying) {
      console.log(`   ${p.name}: ANIMATED span=${p.spanSec}s ${JSON.stringify(p.keyframes)}`);
    } else if (p.start !== undefined && p.start !== '' && p.name) {
      console.log(`   ${p.name}: ${p.start}`);
    }
  }
  console.log('');
}
// dump full json for downstream use
fs.writeFileSync(path.join(__dirname, `_extracted-${wanted.replace(/\W+/g, '_')}.json`), JSON.stringify(results, null, 2));
console.log(`Wrote _extracted-${wanted.replace(/\W+/g, '_')}.json (${results.length} components)`);
