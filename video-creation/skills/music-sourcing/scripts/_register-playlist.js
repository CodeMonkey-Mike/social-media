// _register-playlist.js — register the freshly-downloaded playlist tracks into the
// canonical catalog video-creation/assets/music/library.json. Reads the skill's
// library.json (objectID -> license_code + Algolia meta) and the download progress
// file (folder + files). Idempotent: upserts by soundstripe_id. Node-only (no PS
// JSON round-trip, per repo rule). Throwaway one-shot.
//
//   node _register-playlist.js <playlistId> [--skip 9141,11370]
//
const fs   = require('fs');
const path = require('path');

const HERE      = __dirname;
const MUSIC_DIR = path.join(HERE, '..');
const RECON     = path.join(MUSIC_DIR, '_recon');
const ASSETS    = path.join(MUSIC_DIR, '..', '..', 'assets', 'music');
const ASSET_LIB = path.join(ASSETS, 'library.json');
const SKILL_LIB = path.join(MUSIC_DIR, 'library.json');

function arg(flag, def) { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : def; }
function slug(s) {
  return String(s).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const playlistId = process.argv[2] || '430508';
const skip = new Set((arg('--skip', '9141,11370') || '').split(',').map(s => s.trim()).filter(Boolean));

const skillLib = JSON.parse(fs.readFileSync(SKILL_LIB, 'utf8'));
const skillById = Object.fromEntries(skillLib.tracks.map(t => [String(t.objectID), t]));
const prog = JSON.parse(fs.readFileSync(path.join(RECON, `playlist-${playlistId}-progress.json`), 'utf8'));
const assetLib = JSON.parse(fs.readFileSync(ASSET_LIB, 'utf8'));

const existingSsIds = new Set(assetLib.tracks.map(t => t.soundstripe_id != null ? String(t.soundstripe_id) : null).filter(Boolean));
const usedIds = new Set(assetLib.tracks.map(t => t.id));

let added = 0, updated = 0;
for (const d of prog.done) {
  if (skip.has(d.id)) continue;
  const sk = skillById[d.id];
  if (!sk) { console.log('  no skill-lib entry for', d.id, d.title, '- skipping'); continue; }
  const meta = sk.meta || {};
  const folderRel = `assets/music/${d.folder}`;
  const files = d.files || [];
  const mp3 = files.find(f => f.toLowerCase().endsWith('.mp3')) || null;
  const sections = files.filter(f => f.toLowerCase().endsWith('.wav')).sort();

  // build a compact vibe line from the Algolia tags
  const bits = [];
  if (meta.energy) bits.push(`${meta.energy}-energy`);
  if (meta.genre && meta.genre.length) bits.push(meta.genre.join('/'));
  if (meta.mood && meta.mood.length) bits.push(meta.mood.join('/').toLowerCase());
  if (meta.characteristic && meta.characteristic.length) bits.push(meta.characteristic.join(', ').toLowerCase());
  const vibe = bits.join(' — ');

  // unique id from title slug
  let id = slug(d.title);
  if (usedIds.has(id) && !existingSsIds.has(d.id)) { let n = 2; while (usedIds.has(`${id}-${n}`)) n++; id = `${id}-${n}`; }
  usedIds.add(id);

  const entry = {
    id,
    title: d.title,
    artist: (meta.artists || []).join(', '),
    source: 'soundstripe',
    soundstripe_id: String(d.id),
    url: `https://www.soundstripe.com/library/songs/${d.id}`,
    yt_license_code: sk.license_code || null,
    folder: folderRel,
    primary_file: mp3,
    duration_sec: meta.duration_sec || null,
    vibe,
    genre: meta.genre || [],
    mood: meta.mood || [],
    bpm: meta.bpm != null ? meta.bpm : null,
    energy: meta.energy || null,
    key: meta.key || null,
    instrument: meta.instrument || [],
    characteristic: meta.characteristic || [],
    has_vocal_version: meta.has_vocal_version || false,
    metadata_complete: true,
    sections,
    sections_note: sections.length
      ? 'WAV section cuts from Soundstripe\'s Alternate Versions bundle (instrumental / bg-vocal section mixes). Same yt_license_code covers them.'
      : 'No Alternate Versions bundle for this track (full track only).',
    added_from: `soundstripe private playlist ${playlistId}`,
    downloaded_at: sk.downloaded_at || null,
    used_in: [],
  };

  const idx = assetLib.tracks.findIndex(t => String(t.soundstripe_id) === String(d.id));
  if (idx >= 0) { assetLib.tracks[idx] = { ...assetLib.tracks[idx], ...entry }; updated++; }
  else { assetLib.tracks.push(entry); added++; }
}

fs.writeFileSync(ASSET_LIB, JSON.stringify(assetLib, null, 1));
console.log(`Registered into assets/music/library.json: +${added} added, ${updated} updated. Total tracks now: ${assetLib.tracks.length}`);
