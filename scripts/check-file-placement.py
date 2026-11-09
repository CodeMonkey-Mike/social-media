"""check-file-placement.py: catch files left where they don't belong (Mike, 2026-11-09).

The rule (root CLAUDE.md, global hard rules, "Where files go"):
  1. A file that belongs to ONE video goes in that video's project folder.
  2. Only what several projects share, or a tool's own throwaway diagnostics, goes in video-creation/cache/<tool>/
     (git ignores it; video-creation/skills/cache-path.js and cache_path.py build the path).
  3. Never the repo root, never inside a skills/ folder (code and docs only), never D:.

What it flags:
  - anything in the repo root that isn't on ROOT_ALLOWED
  - media, log and temp files, and _previews / _recon / _debug / shots / downloads folders, inside any skills/ folder
  - a "Users...AppData..." folder anywhere: a Windows path whose backslashes a shell swallowed (typically a Chrome
    --user-data-dir), which quietly creates a duplicate browser profile, login data included, inside the repo

Usage:
  python scripts/check-file-placement.py                report everything, exit 1 if anything is out of place
  python scripts/check-file-placement.py --staged       git pre-commit (.githooks/pre-commit): only what's being added
  python scripts/check-file-placement.py --hook stop    Claude Code Stop hook (.claude/settings.json): reports what
                                                        appeared in the last 24 h and exits 2 so the session sees it,
                                                        once per turn (stop_hook_active)
  python scripts/check-file-placement.py --paths a b    check these repo-relative paths (testing)
"""

from __future__ import annotations

import fnmatch
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# What may sit in the repo root. Add an entry only with Mike's OK.
ROOT_ALLOWED = {
    ".claude", ".git", ".gitattributes", ".githooks", ".gitignore",
    "CLAUDE.md", "README.md", "ORCHESTRATOR-PLAN.md", "claudeisnaughty.md",
    "batches.json", "chatgpt-image-chats.json",
    "cleanup", "persona", "playbooks", "repurpose", "schedule-tweets", "scripts", "video-creation", "x-reply-guy",
    "linkedin-automation",  # disk only, gitignored on purpose (2026-11-06)
    # Orphan docs waiting for Mike's one-by-one review (2026-11-09). Remove each line once it's decided.
    "LANGCHAIN-LANGGRAPH-TOPICS.md", "PROJECT-LOG.md", "SHRINK-MY-SHARE.md", "TODO.md",
}

# Files inside a skills/ folder that are allowed to be media or logs (fnmatch on the repo-relative posix path).
SKILL_ALLOW = [
    "video-creation/longform-edited/skills/container-reference/*",  # reference images the skill's docs point at
    "video-creation/skills/run-queue/state/*",                      # the run queue's own live state + run logs
]

ARTIFACT_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".mp4", ".mov", ".webm", ".mkv", ".mp3", ".wav",
                ".flac", ".m4a", ".aac", ".pdf", ".log", ".tmp"}
WORK_DIRS = {"_previews", "_recon", "_debug", "shots", "downloads", "recon"}
PATH_BUG = re.compile(r"^Users.*AppData", re.I)
PRUNE = {".git", "node_modules", "__pycache__", "media", "out", "cache", "linkedin-automation"}

MESSAGE_FOOTER = (
    "Move each into its video's project folder, or into video-creation/cache/<tool>/ if it's shared tool cache\n"
    "(video-creation/skills/cache-path.js / cache_path.py build the path). A 'Users...AppData...' folder is a\n"
    "Windows path that lost its backslashes: fix the command that made it, then delete the copy. If an item isn't\n"
    "yours (another session is mid-run), tell Mike instead of moving it. Something that truly belongs where it is\n"
    "goes on the allowlist in scripts/check-file-placement.py, with Mike's OK."
)


def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def skill_roots() -> list[Path]:
    roots = []
    for dirpath, dirs, _ in os.walk(ROOT):
        depth = Path(dirpath).relative_to(ROOT).parts
        dirs[:] = [d for d in dirs if d not in PRUNE] if len(depth) < 3 else []
        roots += [Path(dirpath) / d for d in dirs if d == "skills"]
    return roots


def in_skill_violation(relpath: str, skill_root_rels: list[str]) -> str | None:
    """Why this path (inside a skills/ folder) is out of place, or None."""
    owner = next((s for s in skill_root_rels if relpath.startswith(s + "/")), None)
    if owner is None or any(fnmatch.fnmatch(relpath, pat) for pat in SKILL_ALLOW):
        return None
    parts = relpath[len(owner) + 1:].split("/")
    if any(p in WORK_DIRS for p in parts[:-1]):
        return "working folder inside a skill folder"
    if Path(relpath).suffix.lower() in ARTIFACT_EXT:
        return "media / log file inside a skill folder"
    return None


def scan() -> list[tuple[str, str, float]]:
    """Everything currently out of place: (repo-relative path, reason, mtime)."""
    found: list[tuple[str, str, float]] = []
    for entry in ROOT.iterdir():
        if entry.name not in ROOT_ALLOWED:
            found.append((entry.name, "not allowed in the repo root", entry.stat().st_mtime))
    for dirpath, dirs, _ in os.walk(ROOT):
        depth = len(Path(dirpath).relative_to(ROOT).parts)
        dirs[:] = [d for d in dirs if d not in PRUNE] if depth < 6 else []
        for d in list(dirs):
            if PATH_BUG.match(d):
                p = Path(dirpath) / d
                found.append((rel(p), "'Users...AppData...' folder (a path that lost its backslashes)", p.stat().st_mtime))
                dirs.remove(d)
    roots = skill_roots()
    root_rels = sorted((rel(r) for r in roots), key=len, reverse=True)
    for sr in roots:
        for dirpath, dirs, files in os.walk(sr):
            dirs[:] = [d for d in dirs if d not in {"node_modules", "__pycache__", ".git"} and not PATH_BUG.match(d)]
            for d in dirs:
                p = Path(dirpath) / d
                if d in WORK_DIRS and not any(fnmatch.fnmatch(rel(p) + "/x", pat) for pat in SKILL_ALLOW):
                    found.append((rel(p), "working folder inside a skill folder", p.stat().st_mtime))
            dirs[:] = [d for d in dirs if d not in WORK_DIRS]
            for f in files:
                p = Path(dirpath) / f
                why = in_skill_violation(rel(p), root_rels)
                if why:
                    found.append((rel(p), why, p.stat().st_mtime))
    return found


def check_paths(paths: list[str]) -> list[tuple[str, str, float]]:
    """Check repo-relative paths that are about to exist (staged files, or --paths)."""
    root_rels = sorted((rel(r) for r in skill_roots()), key=len, reverse=True)
    found = []
    for p in paths:
        p = p.replace("\\", "/").strip("/")
        if not p:
            continue
        parts = p.split("/")
        if parts[0] not in ROOT_ALLOWED:
            found.append((p, "not allowed in the repo root", 0.0))
        elif any(PATH_BUG.match(x) for x in parts):
            found.append((p, "'Users...AppData...' folder (a path that lost its backslashes)", 0.0))
        else:
            why = in_skill_violation(p, root_rels)
            if why:
                found.append((p, why, 0.0))
    return found


def report(found, header: str, limit: int = 15) -> str:
    lines = [header]
    for path, why, _ in found[:limit]:
        lines.append(f"  - {path}  ({why})")
    if len(found) > limit:
        lines.append(f"  ... and {len(found) - limit} more (run: python scripts/check-file-placement.py)")
    lines.append(MESSAGE_FOOTER)
    return "\n".join(lines)


def main() -> int:
    args = [a.strip() for a in sys.argv[1:]]  # a CRLF-checked-out hook passes a trailing CR on --staged
    if args[:2] == ["--hook", "stop"]:
        try:
            raw = sys.stdin.read() if not sys.stdin.isatty() else ""
            data = json.loads(raw) if raw.strip() else {}
            if data.get("stop_hook_active"):
                return 0
            cutoff = time.time() - 24 * 3600
            found = [f for f in scan() if f[2] >= cutoff]
        except Exception:  # a broken check must never break a session
            return 0
        if found:
            print(report(found, "FILE PLACEMENT: new files were left where they don't belong (rule: root CLAUDE.md):"),
                  file=sys.stderr)
            return 2
        return 0
    if args[:1] == ["--staged"]:
        out = subprocess.run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACR", "-z"], cwd=ROOT,
                             capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
        found = check_paths([p for p in out.split("\0") if p])
        if found:
            print(report(found, "COMMIT BLOCKED: these files don't belong where they're being added "
                                "(rule: root CLAUDE.md):"), file=sys.stderr)
            return 1
        return 0
    if args[:1] == ["--paths"]:
        found = check_paths(args[1:])
    else:
        found = scan()
    if found:
        print(report(found, f"{len(found)} item(s) out of place:", limit=200))
        return 1
    print("file placement: clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
