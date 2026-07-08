// generate_reply_images.js — generate the images for queued image replies.
//
// Reads data/replies_to_post.json, finds entries with an image_prompt but no
// image_path, builds a gen-batch items list (reference image = the style's
// exemplar from example-images/library.json), runs the ONE ChatGPT image
// engine (repurpose/gen-batch-freshchat.js — never gpt_image_2 via Higgsfield),
// then writes each generated file's absolute path back into the queue entry
// as image_path.
//
// Usage:
//   node generate_reply_images.js            # generate + record image_path
//   node generate_reply_images.js --dry-run  # show what would generate, touch nothing
//
// After a run: QA EVERY generated image (open it, read every word) BEFORE
// python post_replies.py. A misspelled image is worse than no image.
//
// NOTE: only one ChatGPT automation may run at a time — the chatgpt-profile
// Chrome is single-user. If another session is generating, this run fails
// loudly at launch ("existing browser session"); wait and re-run.

const { spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HERE       = __dirname;
const QUEUE      = path.join(HERE, 'data', 'replies_to_post.json');
const LIB        = path.join(HERE, 'example-images', 'library.json');
const EXEMPLARS  = path.join(HERE, 'example-images');
const OUTDIR     = path.join(HERE, 'data', 'reply-images');
const GENERATOR  = path.join(HERE, '..', 'repurpose', 'gen-batch-freshchat.js');
const PREFIX     = 'reply';

const dryRun = process.argv.includes('--dry-run');

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf-8'));
const lib   = JSON.parse(fs.readFileSync(LIB, 'utf-8'));
const bySlug = Object.fromEntries(lib.styles.map(s => [s.slug, s]));

const todo = queue.filter(e => (e.image_prompt || '').trim() && !(e.image_path || '').trim());
if (!todo.length) {
  console.log('No queued image replies awaiting generation (image_prompt set, image_path empty).');
  process.exit(0);
}

const idFor = url => crypto.createHash('md5').update(url).digest('hex').slice(0, 8);

const items = [];
for (const e of todo) {
  const slug  = e.image_style || 'freestyle';
  const style = bySlug[slug];
  if (e.image_style && !style) {
    console.log(`WARN: unknown image_style "${e.image_style}" for ${e.author} — generating without a reference image.`);
  }
  const item = {
    image_id: idFor(e.tweet_url),
    slug,
    prompt: e.image_prompt,
  };
  if (style) {
    item.ref = path.join(EXEMPLARS, style.file);
    // The Kaspa logo K is a BACKWARDS (mirrored) K — describe it in words for
    // scene images; never attach the standalone logo file as a second ref
    // (persona.json: the model can reproduce the coin full-frame and discard
    // the scene). Skip the suffix when the drafted prompt already covers it.
    // Only applies when the reply's take is actually about Kaspa — exemplars
    // are STYLE references only; never inherit their Kaspa theming into an
    // unrelated tweet's image (Mike, 2026-07-07).
    if (style.needs_logo_ref && /kaspa|\bkas\b/i.test(item.prompt)
        && !/backwards[- ]?K|mirrored/i.test(item.prompt)) {
      item.prompt += ' Any Kaspa logo shown must be the backwards-K (a mirrored capital K) in glowing greenish-cyan teal.';
    }
    // Anti-leak guard: many exemplars are Kaspa-branded, and the model copies
    // their logos/text into unrelated replies (caught 2026-07-07: KASPA GREMLIN
    // card for a Solana account, Kaspa front page for a Bitcoin-reserve tweet).
    // For every non-Kaspa reply, spell out that the ref is style-only.
    if (style && !/kaspa|\bkas\b/i.test(e.image_prompt)) {
      item.prompt += ' IMPORTANT: the reference image is for artistic style only (medium, composition, texture). Do not copy its logos, coin symbols, tickers, brand names or any of its text content. No Kaspa branding, no K logos, no cryptocurrency names beyond what this prompt specifies.';
    }
  }
  items.push(item);
}

console.log(`${items.length} image repl${items.length === 1 ? 'y' : 'ies'} to generate -> ${OUTDIR}`);
for (const it of items) {
  console.log(`  ${it.image_id}  ${it.slug}\n    ${it.prompt.slice(0, 110)}...`);
}
if (dryRun) { console.log('\n[DRY RUN] nothing generated, queue untouched.'); process.exit(0); }

fs.mkdirSync(OUTDIR, { recursive: true });
const listPath = path.join(OUTDIR, '_batch-items.json');
fs.writeFileSync(listPath, JSON.stringify(items, null, 2));

const res = spawnSync(process.execPath,
  [GENERATOR, `--list=${listPath}`, `--prefix=${PREFIX}`, `--outdir=${OUTDIR}`, '--purpose=reply-images'],
  { stdio: 'inherit', cwd: path.join(HERE, '..') });
if (res.status !== 0) {
  console.error(`\ngen-batch-freshchat.js exited with ${res.status} — recording whatever finished.`);
}

// Re-read the queue (the run takes minutes) and record generated files.
const fresh = JSON.parse(fs.readFileSync(QUEUE, 'utf-8'));
let recorded = 0, missing = [];
for (const e of fresh) {
  if (!(e.image_prompt || '').trim() || (e.image_path || '').trim()) continue;
  const slug = e.image_style || 'freestyle';
  const out  = path.join(OUTDIR, `${PREFIX}-${idFor(e.tweet_url)}-${slug}.png`);
  if (fs.existsSync(out)) { e.image_path = out; recorded++; }
  else missing.push(`${e.author} (${slug})`);
}
fs.writeFileSync(QUEUE, JSON.stringify(fresh, null, 2) + '\n');

console.log(`\n${recorded}/${todo.length} image_path recorded in replies_to_post.json.`);
if (missing.length) console.log(`Still missing (re-run to retry): ${missing.join(', ')}`);
console.log('\nNEXT: QA every image in data/reply-images/ (read every word), then:');
console.log('  python post_replies.py --dry-run   # attaches + screenshots, does not post');
console.log('  python post_replies.py             # posts');
