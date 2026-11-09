"""Where a tool's SHARED cache goes (Mike, 2026-11-09). The JavaScript twin is cache-path.js.

The rule: a file that belongs to ONE video (search results, picks, previews, downloads, QA stills, logs) goes in that
video's project folder. Only a file several projects share, or a tool's own throwaway diagnostics (debug screenshots,
recon dumps, session cookies), goes in video-creation/cache/<tool>/, which git ignores. Never the repo root, never
inside a skill folder, never D:. scripts/check-file-placement.py enforces it.

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))   # from a script inside a skill folder
    from cache_path import cache_path
    page.screenshot(path=str(cache_path("envato-broll", "shots", "item-debug.png")))
"""

from pathlib import Path

CACHE_ROOT = Path(__file__).resolve().parent.parent / "cache"


def cache_dir(tool: str, *parts: str) -> Path:
    """video-creation/cache/<tool>/<parts...>, created if missing."""
    d = CACHE_ROOT.joinpath(tool, *parts)
    d.mkdir(parents=True, exist_ok=True)
    return d


def cache_path(tool: str, *parts: str) -> Path:
    """A file path inside video-creation/cache/<tool>/, with its folder created."""
    p = CACHE_ROOT.joinpath(tool, *parts)
    p.parent.mkdir(parents=True, exist_ok=True)
    return p
