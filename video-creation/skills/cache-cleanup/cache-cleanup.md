# cache-cleanup: clear the After Effects + Remotion caches when a video project ends, only if nothing else is in progress

_Canonical skill (Mike's design, 2026-11-05). Code: `cache_cleanup.py`. Tests: `test_cache_cleanup.py`. Slash command:
`/clear-video-caches <project>`. Serves longform-edited, longform-presentation and livestream repurpose._

## When it runs

Only when Mike declares a project complete, in his own words. Finishing a render, delivering or approving a cut is not that
moment: the vertical and the short often still follow. No graph node calls this skill.

```
python video-creation/skills/cache-cleanup/cache_cleanup.py complete <project> --note "<date + his words>"
python video-creation/skills/cache-cleanup/cache_cleanup.py run
```

A livestream batch counts as finished when `batches.json` says `completed`, or when Mike declares it complete:
`cache_cleanup.py complete-batch <batch> --note "<date + his words>"` records that in `completed-batches.json` beside this skill.
Never flip `batches.json` for this: `completed` opens the batch's folder to `cleanup/cleanup.js`, a separate decision.
`check` shows the blockers and the cache sizes and deletes nothing. Exit 0 = clear (`run`: deleted), 3 = blocked.

## The one rule

**If ANY other video is in progress, delete NOTHING.** No partial sweep, no force flag, and never by hand around it. A blocked
run is a normal result: report the blockers by name and stop. The next completion runs it again.

| Blocks | Read from |
|---|---|
| any open run-queue entry, running or waiting, or a paused queue | `run-queue` state |
| a running After Effects or Remotion process (a `--skip-queue` run, a hand-run still) | process list |
| a project folder with files and no `PROJECT-COMPLETE.json`: paused or at a gate counts | `longform-edited`, `longform-presentation/<format>`, `ai-engineering`, `yuli-y-ana` under `media/` |
| a livestream batch whose status is not `completed` and with no mark from Mike | `batches.json` + `completed-batches.json` |
| any of these checks failing to answer | fail-closed |

`ai-engineering` and `yuli-y-ana` are there because they render through the same caches. The queue and process checks repeat
before every delete, so a run starting mid-sweep stops it. Anything written in the last 10 minutes is left alone.

**Low disk:** if blocked with C: under 25 GB free, the report adds a warning with the cache size. It still deletes nothing; what
to do is Mike's call.

## What goes

Hard deleted, not recycled, because the Recycle Bin would free no space and all of it rebuilds itself. A strict allowlist:

- **After Effects:** `Temp\Adobe\After Effects\<version>\Disk Cache*`. It grows whenever a video has an AE element.
- **Remotion:** `remotion-*`, `react-motion-*`, `puppeteer_dev_chrome_profile-*`, `chunked-render-test-*`, and the contents of
  `chunked-render\`, as direct children of `%LOCALAPPDATA%\Temp`, `D:\remotion-tmp`, `D:\remotion-work`, `D:\tmp`. A missing D:
  is skipped. Clearing `chunked-render\` is the reason for the rule above: those are another run's resumable chunks.

## What never goes

- **Claude conversations.** Mike's say only, in no automated process (Mike, 2026-11-05).
- **The pagefile.** Not touched and not moved; D: is external and sometimes unplugged.
- Masters and project files (`D:\video-work`, `media/`), and hand-made scratch such as `wb*` and `build-*` on D:.
