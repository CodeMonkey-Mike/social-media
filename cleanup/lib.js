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

module.exports = { DAY_MS, walkFiles, ageDays, sizeOf, fmtBytes, recyclePaths };
