// verify-tts.js — GATE: prove tts-chunks.json matches the canonical SCRIPT.md, per chunk,
// BEFORE any voice generation spends credits. Built 2026-07-16 after tts-chunks.json was
// hand-authored from a stale draft and 10 chunks were voiced with wrong text (QA had compared
// audio->tts-chunks instead of audio->SCRIPT.md, so it passed falsely).
//
// SCRIPT.md convention (ai-engineering screenplay): each chunk is
//   **Chunk N — <label>**
//   > spoken line 1
//   > spoken line 2
//   🎬 SHOW: ...      <- ends the spoken block
//
// Usage (CLI):  node verify-tts.js <SCRIPT.md> <tts-chunks.json>
//   exit 0 + "ALL <n> MATCH"   if every chunk's spoken text matches (after pronunciation/caps
//                               normalization); exit 1 + a per-chunk report otherwise.
// Usage (module): require('./verify-tts').check(scriptPath, chunksArray) -> {ok, mismatches[]}
const fs = require('fs');

// Map both the real word and its Seed-Speech phonetic spelling to one canonical token,
// so "FAY bull" (tts) and "Fable" (script) compare equal — real CONTENT drift still fails.
function norm(s) {
  return (s || '')
    .toLowerCase()
    .replace(/fay[- ]?bull/g, 'fable')
    .replace(/(?:oh|owe)[- ]?pus+/g, 'opus')  // "OH pus" / "OH-pus" / "OWE-pus" -> opus
    .replace(/\b(?:oh|o)[- ]?pis\b/g, 'opus')  // "Opis" / "OH-pis" (spoken spelling) -> opus
    .replace(/son[- ]?it/g, 'sonnet')
    .replace(/high[- ]?koo/g, 'haiku')
    .replace(/\broot\b/g, 'route')            // "root" (spoken spelling) -> route
    .replace(/sub[- ]?agents?/g, 'subagent')
    .replace(/read[- ]?only/g, 'readonly')
    .replace(/\bq a\b/g, 'qa')
    .replace(/extra[- ]?high/g, 'xhigh')
    .replace(/long[- ]?form/g, 'longform')
    .replace(/bug[- ]?sensitive/g, 'bugsensitive')
    .replace(/kind[- ]?of[- ]?thinking/g, 'kindofthinking')
    .replace(/frame[- ]?perfect/g, 'frameperfect')
    .replace(/b[- ]?roll/g, 'broll')
    .replace(/re[- ]?sent/g, 'resent')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Extract spoken text per chunk from SCRIPT.md ("> " blockquote lines under each **Chunk N**,
// stopped by the 🎬 SHOW line, the next **Chunk, or a chapter heading).
function extractScript(scriptPath) {
  const lines = fs.readFileSync(scriptPath, 'utf8').split(/\r?\n/);
  const out = {};
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^\*\*Chunk (\d+)\b/);
    if (m) { cur = +m[1]; out[cur] = ''; continue; }
    if (cur && line.startsWith('> ')) { out[cur] += (out[cur] ? ' ' : '') + line.slice(2).trim(); continue; }
    if (cur && (line.startsWith('🎬') || line.startsWith('**Chunk') || line.startsWith('##'))) cur = null;
  }
  return out;
}

function check(scriptPath, chunks) {
  const script = extractScript(scriptPath);
  const mismatches = [];
  // Key each chunk by its filename (chunk-09.mp3 -> 9), NOT by array position, so a SUBSET
  // (single-chunk re-roll) is still gated against the correct SCRIPT.md chunk.
  chunks.forEach((c, i) => {
    const fm = (c.file || '').match(/chunk-0*(\d+)/i);
    const n = fm ? +fm[1] : i + 1;
    const s = script[n];
    if (s === undefined) { mismatches.push({ n, reason: 'no matching **Chunk ' + n + '** in SCRIPT.md' }); return; }
    if (norm(s) !== norm(c.text)) mismatches.push({ n, reason: 'text drift', script: s, tts: c.text });
  });
  const scriptCount = Object.keys(script).length;
  // Full-set completeness is a WARN (not fatal) so subsets pass; a full run should still cover every chunk.
  const warnings = (chunks.length >= scriptCount && chunks.length !== scriptCount)
    ? [`count: SCRIPT.md has ${scriptCount} chunks, tts-chunks has ${chunks.length}`] : [];
  return { ok: mismatches.length === 0, mismatches, warnings, scriptCount };
}

module.exports = { check, extractScript, norm };

if (require.main === module) {
  const [scriptPath, chunksPath] = process.argv.slice(2);
  if (!scriptPath || !chunksPath) { console.error('usage: node verify-tts.js <SCRIPT.md> <tts-chunks.json>'); process.exit(2); }
  const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
  const { ok, mismatches } = check(scriptPath, chunks);
  if (ok) { console.log(`ALL ${chunks.length} chunks MATCH SCRIPT.md`); process.exit(0); }
  console.error(`GATE FAILED — ${mismatches.length} chunk(s) do NOT match SCRIPT.md:`);
  for (const m of mismatches) {
    console.error(`\n  chunk ${m.n}: ${m.reason}`);
    if (m.script !== undefined) { console.error(`    SCRIPT: ${m.script}`); console.error(`    tts   : ${m.tts}`); }
  }
  process.exit(1);
}
