// _playlist-download.js — batch-download a Soundstripe playlist into the reusable
// music library. For each track NOT already present: full-track mp3 (+ license code
// via the documented `download`) THEN the alternate-versions WAV bundle (instrumentals /
// section cuts via `download-alt`), unzip into the track's folder, delete the zip.
// Resumable: tracks progress in _recon/playlist-<id>-progress.json, so re-invoking
// continues where it left off. SEQUENTIAL by design (shared soundstripe Chrome profile).
//
//   node _playlist-download.js <playlistId> [--limit N] [--skip 9141,11370]
//
const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE      = __dirname;
const MUSIC_DIR = path.join(HERE, '..');                       // skills/music-sourcing
const RECON     = path.join(MUSIC_DIR, '_recon');
const ASSETS    = path.join(MUSIC_DIR, '..', '..', 'assets', 'music'); // video-creation/assets/music
const SS        = path.join(HERE, 'soundstripe.js');

function arg(flag, def) { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : def; }
function sanitize(name) {
  return String(name).replace(/[<>:"/\\|?*]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const playlistId = process.argv[2];
if (!playlistId) { console.error('Usage: node _playlist-download.js <playlistId> [--limit N] [--skip a,b]'); process.exit(1); }
const limit = parseInt(arg('--limit', '999'), 10);
const skipArg = (arg('--skip', '') || '').split(',').map(s => s.trim()).filter(Boolean);

const plPath = path.join(RECON, `playlist-${playlistId}.json`);
const playlist = JSON.parse(fs.readFileSync(plPath, 'utf8'));
const songs = playlist.songs;

const progPath = path.join(RECON, `playlist-${playlistId}-progress.json`);
let prog = { done: [], failed: [], skipped: [] };
if (fs.existsSync(progPath)) { try { prog = JSON.parse(fs.readFileSync(progPath, 'utf8')); } catch {} }
const saveProg = () => fs.writeFileSync(progPath, JSON.stringify(prog, null, 2));

const doneIds = new Set(prog.done.map(d => d.id));
const skipIds = new Set([...skipArg, ...prog.skipped]);

function runSS(args, label) {
  console.log(`\n  $ node soundstripe.js ${args.join(' ')}`);
  try {
    execFileSync('node', [SS, ...args], { stdio: 'inherit', cwd: HERE, timeout: 300000 });
    return true;
  } catch (e) {
    console.log(`  [${label}] exited non-zero: ${e.message.split('\n')[0]}`);
    return false;
  }
}

function unzipInto(folder) {
  const zips = fs.readdirSync(folder).filter(f => f.toLowerCase().endsWith('.zip'));
  for (const z of zips) {
    const zp = path.join(folder, z);
    console.log(`  unzip ${z}`);
    try { execFileSync('unzip', ['-o', zp, '-d', folder], { stdio: 'inherit', timeout: 120000 }); }
    catch (e) { console.log('  unzip err:', e.message.split('\n')[0]); continue; }
    // strip macOS junk, then delete the zip
    const junk = path.join(folder, '__MACOSX');
    if (fs.existsSync(junk)) fs.rmSync(junk, { recursive: true, force: true });
    for (const f of fs.readdirSync(folder)) if (f === '.DS_Store') fs.rmSync(path.join(folder, f), { force: true });
    fs.rmSync(zp, { force: true });
    console.log(`  deleted ${z}`);
  }
}

(async () => {
  let processed = 0;
  for (const s of songs) {
    if (doneIds.has(s.id) || skipIds.has(s.id)) continue;
    if (processed >= limit) break;
    processed++;
    const folderName = sanitize(s.title);
    const folder = path.join(ASSETS, folderName);
    fs.mkdirSync(folder, { recursive: true });
    console.log(`\n=== [${s.id}] ${s.title}  ->  assets/music/${folderName} ===`);

    const okFull = runSS(['download', s.id, '--dest', folder], 'download');
    if (!okFull) {
      prog.failed = prog.failed.filter(f => f.id !== s.id);
      prog.failed.push({ id: s.id, title: s.title, folder: folderName, reason: 'full-track download failed' });
      saveProg();
      continue; // don't grab alt if the master failed; leave for a retry pass
    }
    // alternate versions (instrumentals / section cuts). Some tracks have none -> non-fatal.
    const okAlt = runSS(['download-alt', s.id, '--dest', folder], 'download-alt');
    unzipInto(folder);

    const files = fs.readdirSync(folder);
    prog.done = prog.done.filter(d => d.id !== s.id);
    prog.done.push({ id: s.id, title: s.title, folder: folderName, alt: okAlt, files });
    prog.failed = prog.failed.filter(f => f.id !== s.id);
    saveProg();
    console.log(`  OK: ${files.length} file(s) in ${folderName}${okAlt ? '' : ' (no alt bundle)'}`);
  }

  const total = songs.length;
  console.log(`\n──────── progress ────────`);
  console.log(`playlist total : ${total}`);
  console.log(`done           : ${prog.done.length}`);
  console.log(`skipped(present): ${[...skipIds].join(', ') || '(none)'}`);
  console.log(`failed         : ${prog.failed.length}${prog.failed.length ? ' -> ' + prog.failed.map(f => f.id + ' ' + f.title).join('; ') : ''}`);
  const remaining = songs.filter(s => !doneIds.has(s.id) && !skipIds.has(s.id) && !prog.done.some(d => d.id === s.id)).length;
  console.log(`remaining      : ${remaining}`);
})();
