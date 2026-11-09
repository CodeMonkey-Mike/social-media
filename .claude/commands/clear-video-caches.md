---
description: Mike declared a video project complete. Mark it, then clear the After Effects + Remotion caches ONLY if no other video is in progress.
argument-hint: "<project name> (omit for a livestream batch, or to just re-check)"
model: opus
effort: medium
---

Read `video-creation/skills/cache-cleanup/cache-cleanup.md` first. It is canonical.

Project: $ARGUMENTS

1. Only write a completion mark if Mike himself declared this project complete: `cache_cleanup.py complete <project> --note "<date + his words>"`. Otherwise ask him.
2. Run `python video-creation/skills/cache-cleanup/cache_cleanup.py run`.
3. Report the result: what was deleted and the space freed, or the blockers by name. A blocked run deletes nothing; never work around it, never clear a cache by hand, and never include Claude conversations or the pagefile.
