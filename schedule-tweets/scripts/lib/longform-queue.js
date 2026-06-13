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
  const entry = longs.find(l =>
    l.platforms && l.platforms[platform] && l.platforms[platform].status === 'pending');
  if (!entry) return null;
  const videoPath = resolveRel(entry.video_path);
  let thumbPath = resolveRel(entry.thumbnail_path);
  if (thumbPath && !fs.existsSync(thumbPath)) thumbPath = null;
  return { entry, metadata: entry, videoPath, thumbPath };
}

module.exports = { pickNextLongform, LONGS_JSON };
