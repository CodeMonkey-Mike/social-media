#!/usr/bin/env python
"""
lib.py: the shared mechanism of the cleanup tool: walking folders, sizing, and the move to the Windows Recycle
Bin. WHAT is eligible is policy, and lives in ./targets/*.py.

Python port of lib.js (2026-11-27; the JS was deleted the same day). Paths are plain strings throughout, as they
were in the JS: the policies compare them lowercased, so one string form everywhere keeps that simple.
"""
import json
import math
import os
import stat
import subprocess
import sys
import tempfile
import time

DAY_MS = 24 * 60 * 60 * 1000
MISSING = object()          # a field a JSON object does not have (JS: undefined)

# The Recycle Bin move. The paths are NOT written into the script: they are read from a UTF-8 list file, so a
# quote, an accent or an emoji in a file name cannot break the script or be misread by PowerShell. (The JS wrote
# each path into the script text, in a file with no byte-order mark. Windows PowerShell reads such a file in the
# system code page, so a path with a non-ASCII letter was not found and was skipped without a word.)
RECYCLE_PS = r"""param([string]$List)
Add-Type -AssemblyName Microsoft.VisualBasic
foreach ($p in [System.IO.File]::ReadAllLines($List, [System.Text.Encoding]::UTF8)) {
  if (-not $p) { continue }
  if (Test-Path -LiteralPath $p -PathType Container) {
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($p,'OnlyErrorDialogs','SendToRecycleBin')
  } elseif (Test-Path -LiteralPath $p) {
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p,'OnlyErrorDialogs','SendToRecycleBin')
  }
}
"""


def entry_kind(entry):
    """'dir', 'file' or None for one os.scandir entry. A link (symlink or junction) is None, as it was under
    Node: it is never walked into and never listed, so cleanup cannot follow one out of the folder it manages."""
    try:
        if entry.is_symlink() or entry.is_junction():
            return None
        if entry.is_dir(follow_symlinks=False):
            return "dir"
        if entry.is_file(follow_symlinks=False):
            return "file"
    except OSError:
        pass
    return None


def scan(folder):
    """The entries of a folder, in the order the file system lists them."""
    with os.scandir(folder) as it:
        return list(it)


def walk_files(folder, skip_dirs=frozenset(), on_dir=None):
    """Every file under `folder`, recursively. `skip_dirs` is a set of lowercased absolute folder paths that
    are not entered. `on_dir(full, name)`, when given, is called for each folder; a true result skips it."""
    out = []
    if not os.path.isdir(folder):
        return out
    for entry in scan(folder):
        kind = entry_kind(entry)
        full = os.path.join(folder, entry.name)
        if kind == "dir":
            if full.lower() in skip_dirs:
                continue
            if on_dir and on_dir(full, entry.name):
                continue
            out.extend(walk_files(full, skip_dirs, on_dir))
        elif kind == "file":
            out.append(full)
    return out


def find_empty_dirs(roots, skip_dirs=frozenset(), removed=frozenset()):
    """The folders under `roots` that will hold no file anywhere below them once `removed` is gone, so a
    recycle pass does not leave an empty folder behind.

    `removed` (lowercased absolute paths) is what is already going to the Recycle Bin: it is treated as gone,
    so this runs BEFORE the move (a dry run can report the folders, and the live run moves them in the same
    pass). Only the TOP-MOST empty folders are returned: an empty parent, not its empty children, so recycling
    each one takes its whole subtree. A root itself is never returned. `skip_dirs` (lowercased absolute paths)
    count as not empty, so neither they nor the folders above them are pruned.
    """
    result = []

    def visit(folder, is_root):
        """The number of files that survive under `folder` (infinite when it holds a skip_dir)."""
        if not os.path.isdir(folder):
            return 0
        key = folder.lower()
        if key in skip_dirs:
            return math.inf
        if key in removed:
            return 0                                   # the whole folder is already going
        files = 0
        empty_children = []
        for entry in scan(folder):
            kind = entry_kind(entry)
            full = os.path.join(folder, entry.name)
            if kind == "dir":
                sub = visit(full, False)
                # a child left empty is a candidate, unless it is in `removed` already (do not list it twice)
                if sub == 0 and full.lower() not in removed:
                    empty_children.append(full)
                files += sub
            elif kind == "file":
                if full.lower() not in removed:
                    files += 1
        # A folder that keeps a file (or a root) is the boundary: its empty children are the top-most empties.
        # An empty folder that is not a root returns 0 and is listed by its parent instead.
        if files > 0 or is_root:
            result.extend(empty_children)
        return files

    for root in roots:
        visit(root, True)
    return result


def age_days(path):
    """Days since the file was last written; 0 when it cannot be read."""
    try:
        return (time.time() * 1000 - os.stat(path).st_mtime_ns / 1e6) / DAY_MS
    except OSError:
        return 0


def size_of(path):
    """The size of a file, or of everything under a folder."""
    try:
        st = os.stat(path)
    except OSError:
        return 0
    if stat.S_ISREG(st.st_mode):
        return st.st_size
    if stat.S_ISDIR(st.st_mode):
        total = 0
        for f in walk_files(path):
            try:
                total += os.stat(f).st_size
            except OSError:
                pass
        return total
    return 0


def _fixed(n, shift, digits):
    """n / 2**shift with `digits` decimals, a half rounded up: what JS toFixed printed for these values."""
    scale = 10 ** digits
    q = (n * scale * 2 + (1 << shift)) >> (shift + 1)
    return f"{q // scale}.{q % scale:0{digits}d}"


def fmt_bytes(n):
    if n >= 1 << 30:
        return _fixed(n, 30, 2) + " GB"
    if n >= 1 << 20:
        return _fixed(n, 20, 1) + " MB"
    if n >= 1 << 10:
        return _fixed(n, 10, 1) + " KB"
    return f"{n} B"


def js_str(value):
    """A JSON value the way a JS template string printed it, so a report line reads as it always has: a
    missing field is 'undefined', null is 'null'."""
    if value is MISSING:
        return "undefined"
    if value is None:
        return "null"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def read_json(path, default=None):
    """The parsed file, or `default` when it is missing or is not valid JSON."""
    try:
        with open(path, encoding="utf-8-sig") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def rel_path(path, root):
    """`path` relative to `root` (the path itself when it is on another drive)."""
    try:
        return os.path.relpath(path, root)
    except ValueError:
        return path


def recycle_paths(paths):
    """Move each path (a file OR a folder) to the Recycle Bin in one PowerShell call.

    -> (ok, left): `left` is every path that is still on disk afterwards. `ok` is true only when PowerShell
    exited clean AND nothing is left, so "recycled" is never reported for something that did not move.
    """
    paths = [str(p) for p in paths]
    if not paths:
        return True, []
    tmp = tempfile.mkdtemp(prefix="cleanup-")
    script = os.path.join(tmp, "recycle.ps1")
    listing = os.path.join(tmp, "paths.txt")
    try:
        with open(script, "w", encoding="ascii", newline="\r\n") as f:
            f.write(RECYCLE_PS)
        with open(listing, "w", encoding="utf-8", newline="\r\n") as f:
            f.write("\n".join(paths) + "\n")
        sys.stdout.flush()
        try:
            status = subprocess.run(
                ["powershell", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass",
                 "-File", script, "-List", listing]).returncode
        except OSError as e:
            print(f"  could not start PowerShell: {e}", file=sys.stderr)
            status = 1
    finally:
        for f in (script, listing):
            try:
                os.unlink(f)
            except OSError:
                pass
        try:
            os.rmdir(tmp)
        except OSError:
            pass
    left = [p for p in paths if os.path.lexists(p)]
    return status == 0 and not left, left
