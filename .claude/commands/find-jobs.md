---
description: Find fresh LinkedIn job postings that fit Mike's criteria (last 48 h, fully remote, AI engineer / AI automation / founding / growth / small-company leadership) and rebuild linkedin-automation/private/jobs-dashboard.html.
argument-hint: "[optional overrides, e.g. 72h · no review · worldwide · add query 'MCP engineer' · scan only]"
model: opus
effort: medium
---

Let's run the job radar (LinkedIn + the public boards: RemoteOK, Remotive, We Work Remotely, HN
Who is hiring, and the Greenhouse / Lever / Ashby watchlist; `run` reads the boards first).
"LinkedIn only" -> `--no-boards`; "boards only" / "no LinkedIn" -> run the `boards` stage, then
`classify`, `review`, `dashboard` (no Chrome, no preflight needed).

## Run inputs — `$ARGUMENTS`

Everything above is an optional per-run override; with nothing given, the defaults in
`linkedin-automation/skills/find-jobs/find-jobs.md` apply (48 h window, United States, the
default query sweep, company sizes capped at 60 job views, reviewer on).

Translate overrides into flags of `find_jobs.py run`:
- a window like "72h" / "last 3 days" -> `--hours 72`
- "worldwide" or a LinkedIn geoId -> `--location worldwide` / `--location <geoId>`
- "add query X" -> `--add-query "X"`; "only query X" -> `--queries "X"`
- "no review" -> `--no-review`; "scan only" -> `--no-details --no-sizes --no-review`
- "more sizes" / a number of job views -> `--max-views N`
- "dashboard only" / "reclassify" -> run the `classify` then `dashboard` stages, nothing against LinkedIn

Observe the folder's hard rules in `linkedin-automation/CLAUDE.md`: ONE `li-bot-profile` Chrome
at a time, never while a LinkedIn lane runs; stop for the day on any restriction page.

---

## The procedure

1. **Read `linkedin-automation/skills/find-jobs/find-jobs.md`** (the skill is the procedure; this
   command only drives it).
2. **Preflight:** confirm no `li-bot-profile` Chrome is open (PowerShell
   `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*li-bot-profile*' }`)
   and no LinkedIn lane is mid-run. The script refuses (exit 3) if one is, but check first.
3. **Launch detached** (the run takes 20-45 minutes and must outlive the harness's background
   ceiling), logging to `linkedin-automation/private/data/logs/find-jobs-<YYYYMMDD-HHMM>.log`:
   ```
   python linkedin-automation/skills/find-jobs/find_jobs.py run <flags>
   ```
   via `Start-Process cmd.exe -ArgumentList '/c cd /d <repo> && python linkedin-automation\skills\find-jobs\find_jobs.py run <flags> > <log> 2>&1'`
   (visible window, no `-WindowStyle Hidden`).
4. **Poll the log** with short foreground checks (never a busy loop) for
   `FIND-JOBS DONE|FIND-JOBS HALTED|FIND-JOBS STOPPED|Traceback|restriction|HALTED`. The log
   gets a line every few seconds while LinkedIn work runs; >8 minutes idle means it died — read
   the tail and diagnose before anything else (never relaunch blind; the stages are resumable).
5. **On exit code 2 (HALTED)** a restriction page appeared: report it and run nothing else
   against LinkedIn today. The dashboard still rebuilt from what was on disk.

## When done

- `python linkedin-automation/skills/find-jobs/find_jobs.py status` for the counts.
- Report: tier counts (Strong / Good / Weak / Excluded), how many are NEW this run, the top
  Strong fits as a table (title · company · size · reviewer verdict · link), the run's LinkedIn
  activity (search pages + job views, both logged in `private/data/job-runs.json`), and anything that
  failed or was skipped (reviewer batches without output, companies still size-unread).
- **State the dashboard path** (`linkedin-automation/private/jobs-dashboard.html`); do not open it.
- Append a one-paragraph run entry to `linkedin-automation/private/PROJECT-LOG.md` (the folder's
  "update it after every run" rule), under the job-radar heading.
