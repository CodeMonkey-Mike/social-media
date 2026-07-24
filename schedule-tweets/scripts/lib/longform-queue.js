'use strict';

// longform-queue.js — source the next longform to upload directly from data/longs.json.
//
// Previously the upload scripts read whatever video/thumbnail/metadata.json sat loose in the
// longform/ ROOT (pickFile), which forced the upload skill to COPY each entry's canonical file
// (often in a longform/<source>/ subfolder) into the root just so the dumb picker could see it —
// leaving an orphaned loose duplicate behind every time. Reading longs.json directly removes that
// copy step entirely: the canonical file is the entry's own video_path / thumbnail_path.
//
// Each upload script asks for ITS platform's next-pending entry (queue order). Status is still
// updated separately (this only sources the upload), so re-running before the status flips will
// re-pick the same entry — mark the platform posted in longs.json after a confirmed upload.

const fs = require('fs');
const path = require('path');

// __dirname = schedule-tweets/scripts/lib  ->  ST_ROOT = schedule-tweets
const ST_ROOT = path.resolve(__dirname, '..', '..');
const LONGS_JSON = path.join(ST_ROOT, 'data', 'longs.json');

// Longform is fanned out to EXACTLY these platforms. YouTube longform is uploaded by Mike
// HIMSELF, by hand — it is NOT a queue recipient and there is no upload-longform-youtube script.
// A stray `youtube` (or any other) platform on a longs.json entry pins that entry in the dashboard
// forever (it never terminalizes) and no uploader can ever clear it. So this is a HARD rule:
// longs.json entries may only carry these platforms. (Shorts DO go to YouTube — that's shorts.json,
// a separate queue; this allow-list is longform-only.)
const ALLOWED_PLATFORMS = new Set(['rumble', 'bitchute', 'facebook']);

// Throw if any entry declares a platform outside the allow-list. Called on every read below, so no
// upload script can ever act on (or even load) a longs.json with a disallowed platform — it fails
// loudly, naming the offenders, and forces the field to be removed. Exported for the lint suite too.
function assertAllowedPlatforms(longs) {
  const bad = [];
  for (const l of longs || []) {
    for (const plat of Object.keys(l.platforms || {})) {
      if (!ALLOWED_PLATFORMS.has(plat)) bad.push(`"${(l.title || '?').slice(0, 50)}" -> ${plat}`);
    }
  }
  if (bad.length) {
    throw new Error(
      `longs.json has disallowed longform platform(s). Allowed: ${[...ALLOWED_PLATFORMS].join(', ')}. ` +
      `YouTube longform is uploaded manually, never queued — remove these:\n  ` + bad.join('\n  '));
  }
}

// Queue paths (video_path / thumbnail_path) are relative to the schedule-tweets root.
function resolveRel(rel) {
  if (!rel) return null;
  return path.join(ST_ROOT, rel.replace(/^schedule-tweets[\\/]/, '').replace(/\//g, path.sep));
}

// Returns { entry, metadata, videoPath, thumbPath } for the first long whose
// platforms[platform].status === 'pending', or null if none are pending.
// `metadata` is the entry itself (same title/description/tags/categories/visibility shape the
// scripts already consume). thumbPath is null when absent or missing on disk.
function pickNextLongform(platform) {
  const longs = JSON.parse(fs.readFileSync(LONGS_JSON, 'utf8')).longs || [];
  assertAllowedPlatforms(longs);
  const entry = longs.find(l =>
    l.platforms && l.platforms[platform] && l.platforms[platform].status === 'pending');
  if (!entry) return null;
  const videoPath = resolveRel(entry.video_path);
  let thumbPath = resolveRel(entry.thumbnail_path);
  if (thumbPath && !fs.existsSync(thumbPath)) thumbPath = null;
  return { entry, metadata: entry, videoPath, thumbPath };
}

// Soundstripe (and any) music-license credits belong ONLY in the YouTube description — the codes
// are Content-ID clearance codes Mike pastes into YouTube. They must NOT appear on Facebook /
// Rumble / BitChute. The credit is its own paragraph (blank-line delimited), e.g.:
//   Music (licensed via Soundstripe):
//   Born Every Minute by Neon Beach | V6HIWVPVCE6SHQ4T
//   ...
// Drop any paragraph whose first line is a "Music ... (licensed via) Soundstripe" header.
function stripMusicCredits(desc) {
  if (!desc) return desc;
  const kept = desc
    .split(/\n{2,}/)
    .filter(p => !/^\s*music\b[^\n]*soundstripe/i.test(p));
  return kept.join('\n\n').trim();
}

module.exports = { pickNextLongform, LONGS_JSON, stripMusicCredits, ALLOWED_PLATFORMS, assertAllowedPlatforms };
