'use strict';

// Shared mechanism for the cleanup tool: directory walking, sizing, and the
// Windows Recycle-Bin move. Target-specific POLICY lives in ./targets/*.js.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const DAY_MS = 24 * 60 * 60 * 1000;

// Recursively list files under dir. `skipDirs` is a Set of lowercased absolute
// dir paths to prune. `onDir` (optional) is called with each directory; return
// true to prune it (don't descend, don't list its files).
function walkFiles(dir, { skipDirs = new Set(), onDir = null } = {}) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(full.toLowerCase())) continue;
      if (onDir && onDir(full, entry.name)) continue;
      out.push(...walkFiles(full, { skipDirs, onDir }));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

// Find directories that will be left empty (no files anywhere in their subtree) under
// `roots`, so a recycle pass that removed a folder's files doesn't strand the now-empty
// folder. `removed` (lowercased abs paths) is the set of files/dirs already slated for
// recycling — they're treated as gone, so this can run BEFORE the move and predict which
// folders will be left empty (dry-run reporting + a single combined move). Returns the
// TOP-MOST empty dirs (a recursively-empty parent is returned, not its empty children), so
// recycling each one cleans its whole subtree. The roots themselves are never returned (we
// prune their contents, not the managed base dirs). `skipDirs` (lowercased abs paths) are
// treated as non-empty so neither they nor their ancestors are pruned.
function findEmptyDirs(roots, { skipDirs = new Set(), removed = new Set() } = {}) {
  const result = [];
  // Returns count of surviving files in dir's subtree (Infinity if it holds a protected skipDir).
  const visit = (dir, isRoot) => {
    if (!fs.existsSync(dir)) return 0;
    const dl = dir.toLowerCase();
    if (skipDirs.has(dl)) return Infinity;
    if (removed.has(dl)) return 0; // whole dir already slated for recycling
    let files = 0;
    const emptyChildren = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const fl = full.toLowerCase();
      if (entry.isDirectory()) {
        const sub = visit(full, false);
        // A child that survives empty is a prune candidate — unless it's already in `removed`
        // (its parent recycle entry covers it, so don't list it twice).
        if (sub === 0 && !removed.has(fl)) emptyChildren.push(full);
        files += sub;
      } else if (entry.isFile()) {
        if (!removed.has(fl)) files += 1;
      }
    }
    // A surviving non-empty dir (or a root) is the boundary: its empty children are top-most
    // empties. A recursively-empty non-root returns 0 and is emitted by its parent instead.
    if (files > 0 || isRoot) result.push(...emptyChildren);
    return files;
  };
  for (const r of roots) visit(r, true);
  return result;
}

function ageDays(p) {
  try {
    return (Date.now() - fs.statSync(p).mtimeMs) / DAY_MS;
  } catch {
    return 0;
  }
}

// Size of a file, or recursive size of a directory.
function sizeOf(p) {
  let st;
  try { st = fs.statSync(p); } catch { return 0; }
  if (st.isFile()) return st.size;
  if (st.isDirectory()) {
    let total = 0;
    for (const f of walkFiles(p)) {
      try { total += fs.statSync(f).size; } catch {}
    }
    return total;
  }
  return 0;
}

function fmtBytes(n) {
  if (n >= 1 << 30) return (n / (1 << 30)).toFixed(2) + ' GB';
  if (n >= 1 << 20) return (n / (1 << 20)).toFixed(1) + ' MB';
  if (n >= 1 << 10) return (n / (1 << 10)).toFixed(1) + ' KB';
  return n + ' B';
}

// Move each path (file OR directory) to the Recycle Bin in one PowerShell call.
function recyclePaths(paths) {
  if (paths.length === 0) return true;
  const lines = ['Add-Type -AssemblyName Microsoft.VisualBasic'];
  for (const p of paths) {
    const esc = p.replace(/'/g, "''");
    lines.push(
      `if (Test-Path -LiteralPath '${esc}' -PathType Container) { ` +
      `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory('${esc}','OnlyErrorDialogs','SendToRecycleBin') } ` +
      `elseif (Test-Path -LiteralPath '${esc}') { ` +
      `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('${esc}','OnlyErrorDialogs','SendToRecycleBin') }`
    );
  }
  const tmp = path.join(os.tmpdir(), `cleanup-${Date.now()}.ps1`);
  fs.writeFileSync(tmp, lines.join('\r\n'), 'utf8');
  const res = spawnSync(
    'powershell',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmp],
    { stdio: 'inherit' }
  );
  try { fs.unlinkSync(tmp); } catch {}
  return res.status === 0;
}

module.exports = { DAY_MS, walkFiles, findEmptyDirs, ageDays, sizeOf, fmtBytes, recyclePaths };
