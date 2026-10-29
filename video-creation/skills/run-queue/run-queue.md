# run-queue — one video-production run owns the machine at a time; failures retry once and always notify

_Canonical skill (Mike's design, 2026-10-27). Code: `run_queue.py` (queue + supervisor + CLI) · `notify.py` (desktop
notifications) · tests in `../chunked-render/test_chunked_render.py`. Sibling: `../chunked-render/chunked-render.md`._

## The rule

ONE video-production run owns the machine at a time. A run takes its **turn** when it starts or resumes and
**releases** it the moment it stops: at a HITL gate (exit 2), done, or failed. The next waiting run then starts on its
own, first come first served. Example: the longform gathers its assets overnight up to its plan gate, THEN the waiting
livestream batch starts. Mike never tells one session to wait for another again (the hand-made waits broke on
2026-10-27: one matched its own process query, one crashed on a missing `wmic`).

| In the queue (takes turns) | Never in the queue (runs whenever started) |
|---|---|
| longform-edited graph runs (`run.py longform`) | posting task lists (`schedule-tweets` posters) |
| livestream batches (`run.py batch`; Lane 3 runs inside the batch's turn) | the LinkedIn lanes |
| vertical + short lanes (`run.py vertical` / `run.py short`) | reply-guy, find-jobs |
| hand-run renders (`render_comp.py`, `chunked_render.py`, `render_spotlight.py`) | |

Those outside keep their own rules (posting one script at a time; find-jobs never beside a LinkedIn lane).

## What Mike does

Nothing different: start runs as always. A run that has to wait prints `QUEUED #n behind <run>` and waits in its own
console; the session that launched it can close. When he wants something else:

| He says | Command |
|---|---|
| "what's in the queue?" | `python video-creation/skills/run-queue/run_queue.py status` |
| "pause the queue" (a meeting) | `run_queue.py pause`: a running render stops at its next chunk boundary (nothing lost), nothing new starts |
| "resume" | `run_queue.py resume` |
| "let this one go first" | `run_queue.py front <id>` |
| "cancel it" | `run_queue.py cancel <id>` (a WAITING run exits cleanly) |
| "run this now, skip the queue" | add `--skip-queue` to the run command: it starts immediately and overlaps (still listed in `status`) |

## The supervisor

`supervise()` wraps every graph invocation: take the turn, run, and on a FAILURE of a node in that graph's retry set
(render/build work: `RETRY_LONGFORM`, `RETRY_VERTICAL`, `RETRY_SHORT` in `longform-edited/graph/run.py`, `RETRY_BATCH`
in `livestream-repurpose/graph/run.py`), or a graph crash, re-drive ONCE automatically (a fresh run on the same thread:
artifacts on disk skip, approvals live on disk, the documented manual re-drive). Then release the turn and send ONE
desktop notification: waiting at a gate / done / failed again. Never retried: gates, deterministic lints and `verify_*`
(a re-drive fails the same way), `stage_longform` / `lane2_publish` / `register` / `launch_lane3` (side effects).
Posting is never retried anywhere (hard rule); no graph node posts.

**A re-drive must be able to change something (2026-10-28).** An asset node that fails visual-qa (`assets`, `v_assets`,
`s_variants`) MOVES the failing files to `_previews/.../qa/rejected/` before it fails (`longform_graph._reject_qa_fails`), so
the re-drive rebuilds ONLY that gap with the verdict as feedback. Before this, the failing file stayed, the re-drive re-judged
it and failed identically in seconds: the retry was a no-op and the run sat failed overnight (inference vertical + only-18
short, 2026-10-27). An OPTIONAL output never fails the run at all: the short's variants auto-waive after 2 rounds
(`longform-to-short.md`). Proven by `longform-edited/graph/test_asset_qa_retry.py`.

## Every run is DETACHED + GUARDED, in code (Mike, 2026-10-29)

**Why:** 2026-10-28 night a vertical-approve + short run was launched as a Claude Code background task. Claude Code
reaped it for low memory while it WAITED in the queue: it never took its turn, so the supervisor never ran and nothing
notified Mike. He found out only by asking for the status. HOW a run is launched is no longer anyone's choice:

- `run.py longform|vertical|short` (longform-edited) and `run.py batch` (livestream) call `run_queue.detach()` FIRST.
  It hands the run to a trampoline that starts a GUARD as a detached, broken-away process and exits, so the run has no
  living parent: killing the launcher, its whole process tree or the Claude session never touches it. The launcher
  mirrors the run's log and exits with the run's exit code (2 = gate), so it reads like a foreground run.
  Logs: `state/logs/<stamp>-<label>.log`. `--stub` runs and `status` stay in-process.
- The GUARD notifies when the run ends WITHOUT its supervisor's end report (killed, crashed, out of memory):
  "STOPPED without reporting ... start it again". A deliberate `cancel` is not a silent death.
- The queue never prunes silently: an entry whose process is gone sends "DIED while waiting/running".
- Proof: `python video-creation/skills/run-queue/test_detach.py` (launcher tree-killed -> the run finishes and
  reports; run killed -> notified; dead entry -> notified). Run it after touching `detach` / `_guard`.

## Desktop notifications

`notify.py` sends a Windows toast from the SCRIPT (works with no Claude session open), using PowerShell's always-
registered app id (nothing installed). Mike keeps **Do Not Disturb ON**: toasts land silently in the notification
centre and he reads them later, so every message is self-explanatory (project, what happened, what is next). Never ask
him to turn DND off. History: `state/notifications.log`. Sent on: queued, turn started after a wait, gate reached,
done, failed, render chunk stall + retry, render failed, render done, pause/resume.

## Mechanics

`state/queue.json` (gitignored) under an msvcrt byte lock; each entry carries its PID + process creation time, and an
entry whose process is gone is pruned on the next look (ctypes `OpenProcess`, no `wmic`, no command-line matching).
A child of a run inherits the turn through `RUN_QUEUE_HELD` (nested `turn()` calls pass straight through).
Tests point `RUN_QUEUE_STATE_DIR` at a temp dir and set `RUN_QUEUE_NO_TOAST=1`.

Known gap: Lane 3 of a livestream batch is a separate process that can keep working (browser image generation) after
the batch stops at its 4b gate and releases the turn.
