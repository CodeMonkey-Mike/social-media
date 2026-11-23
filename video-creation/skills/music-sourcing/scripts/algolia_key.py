"""
algolia_key.py: Soundstripe's PUBLIC search-only key, kept out of git. It's embedded in their web client,
so it isn't a credential of ours. Reads SOUNDSTRIPE_ALGOLIA_KEY, then the gitignored ../.algolia-key file.
On a new machine: open Soundstripe's library in a browser, and copy the X-Algolia-API-Key request header
from devtools. Python port of algolia-key.js (2026-11-23).

    from algolia_key import algolia_key
"""
import os
from pathlib import Path

KEY_FILE = Path(__file__).resolve().parent.parent / ".algolia-key"


def algolia_key():
    from_env = (os.environ.get("SOUNDSTRIPE_ALGOLIA_KEY") or "").strip()
    if from_env:
        return from_env
    try:
        from_file = KEY_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        from_file = ""
    if from_file:
        return from_file
    raise RuntimeError(f"Soundstripe search key missing: set SOUNDSTRIPE_ALGOLIA_KEY or create {KEY_FILE}")
