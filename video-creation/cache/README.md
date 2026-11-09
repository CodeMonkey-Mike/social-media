# video-creation/cache/

The ONE shared cache for video-creation tools (Mike, 2026-11-09). Everything in here except this README is ignored by git
and can be deleted at any time: every tool recreates its folder on its next run.

## What goes where

1. **A file that belongs to one video goes in that video's project folder**, never here: search results, pick sheets,
   contact sheets, preview frames, downloads, QA stills, logs, renders. They then disappear with the project.
2. **Only what several projects share, or a tool's own throwaway diagnostics, goes here**, under `cache/<tool>/`:
   debug screenshots, recon dumps, session cookies, audition boards, staging downloads.
3. **Never** the repo root, never inside a skill folder (skills hold code and docs only), never D: (a removable drive).

A temporary file that only lives while one command runs (render chunks, bundles) can use the OS temp folder (`%TEMP%`,
on C:) and be cleaned up by that command.

## How tools find it

- JavaScript: `const { cachePath, cacheDir } = require('<...>/video-creation/skills/cache-path');`
- Python: `from cache_path import cache_path, cache_dir` (in `video-creation/skills/`)

`python scripts/check-file-placement.py` enforces the rule: it flags anything new in the repo root, files left inside a
skill folder, and `Users...AppData...` folders (a Windows path whose backslashes were lost in a shell). It runs at the end
of every Claude Code session turn and before every commit.

## Current tools

| Folder | Holds |
|---|---|
| `music-sourcing/` | `candidates.json` + `board.html` (last search + audition board), `downloads/` (staging), `recon/` (playlist dumps, screenshots, **session cookies**) |
| `envato-broll/shots/` | debug screenshots from the search and download tools |
| `elevenlabs-lipsync/shots/` | screenshots from the lip-sync browser scripts |
| `higgsfield-voice/shots/` | screenshots from the voice browser scripts |
