// cache-path.js: where a tool's SHARED cache goes (Mike, 2026-11-09). The Python twin is cache_path.py.
//
// The rule: a file that belongs to ONE video (search results, picks, previews, downloads, QA stills, logs) goes in that
// video's project folder. Only a file several projects share, or a tool's own throwaway diagnostics (debug
// screenshots, recon dumps, session cookies), goes in video-creation/cache/<tool>/, which git ignores. Never the repo
// root, never inside a skill folder, never D:. scripts/check-file-placement.py enforces it.
//
//   const { cachePath, cacheDir } = require('../cache-path');
//   await page.screenshot({ path: cachePath('higgsfield-voice', 'shots', 'login.png') });

const fs = require('fs');
const path = require('path');

const CACHE_ROOT = path.join(__dirname, '..', 'cache');

// cacheDir('music-sourcing', 'recon') -> <repo>/video-creation/cache/music-sourcing/recon, created if missing
function cacheDir(tool, ...parts) {
  const dir = path.join(CACHE_ROOT, tool, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// cachePath('elevenlabs-lipsync', 'shots', 'el-staged.png') -> that file's path, with its folder created
function cachePath(tool, ...parts) {
  const file = path.join(CACHE_ROOT, tool, ...parts);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

module.exports = { CACHE_ROOT, cacheDir, cachePath };
