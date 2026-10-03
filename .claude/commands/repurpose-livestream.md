---
description: Repurpose a livestream across all 3 lanes (longform, shorts, text/image) through the BATCH ORCHESTRATOR graph, which owns every lane and cannot forget one.
argument-hint: "<path-to-livestream> [optional run overrides, e.g. double the tweets / clips under 80s / skip the polls]"
model: opus
effort: medium
---

Let's repurpose a livestream across all three lanes.

## Run inputs — `$ARGUMENTS`

The input above is the **path to the livestream recording**, optionally followed by
**per-run overrides**.

- **Identify the livestream file path** — a video path (`.mp4`/`.mkv`/`.mov`), possibly quoted
  and possibly containing spaces. This is the source recording for the whole run.
- **Treat anything else as a per-run override.** Split the overrides into two briefs: things
  about the SHORTS (clip length caps, topic preferences, "skip lane 2") go into the clip brief;
  things about the TEXT/IMAGE content (tweet counts, "skip the polls", "threads only", carousel
  version preferences, facts Mike confirms) go into the Lane 3 brief. Every override is honored
  by passing it through; when none are given, the defaults in the agents' own instructions apply.
- If you cannot find a valid livestream path in the input, STOP and ask for it.

Observe all global rules in `CLAUDE.md` and `persona/persona.json` (no em dashes in anything
written to a queue file; edit `data/*.json` with Python/Node, never PowerShell; every image
unique).

---

## The procedure (the graph owns the lanes; you are its operator)

1. **Source housekeeping.** If the recording has an OBS timestamp name, rename it to match its
   folder (`media/<name>/<name>.mkv`); the folder name keys every downstream artifact.
2. **Author `longform-meta.json` next to the recording** (title / description / tags for the
   `longs.json` entry, Mike's brand voice, no em dashes). The graph validates it before any
   encoding. If you need content knowledge first, run a quick local whisper pass on the audio
   (the canonical transcript is produced later by the graph). Make sure the PNG thumbnail is in
   the media folder BEFORE launching (the Lane 1 stage node scans once, at its start).
3. **Check disk headroom** (the intake needs ~5 GB on the media drive). If it is short, tell
   Mike what you would free and ASK before running cleanup or anything destructive.
4. **Launch the batch orchestrator in a detached console** (it runs for hours and must survive
   the harness's background ceiling), logging to `video-creation/livestream-repurpose/graph/data/batch-<batch>.log`:
   ```
   python video-creation/livestream-repurpose/graph/run.py batch --source "<recording>" --min-sil 0.5 --shorts-min-sil 0.25 --lane3-brief "<lane 3 overrides>" --clip-brief "<clip overrides>"
   ```
   Lane 3 starts concurrently by itself. Never hand-invoke `run.py cut/tighten/repurpose` for
   this batch while the orchestrator runs; `run.py status --batch <batch>` shows every lane.
5. **Poll the log** (short foreground checks, never a busy loop). Adjudicate any GLOSSARY FLAGS
   the intake prints in the transcript artifacts (a real KRC20 token vs a Kaspa mishear) as soon
   as intake finishes; the strategist and drafter read the corrected files.
6. **At exit code 2 (WAITING)** the graph is at Mike's 4b review (raw cuts on
   `video-creation/shorts/<batch>/dashboard.html`) or his 2nd review (tightened clips). Tell Mike,
   with the clip table, and resume ONLY with his verdicts:
   `run.py batch --batch <batch> --resume --approve 4b [--delete N,N]` (same for `2nd`).
   Lane 3 keeps running through both gates; report its state from `run.py status`.
7. **Do not go past the 2nd-review gate unless Mike asks for renders/publish.** The default
   scope of this command is: Lane 1 queued, Lane 3 fully queued (images visual-QA'd), Lane 2
   tightened and waiting at the 2nd review.

## When done (or at each gate)

- **Status per lane in a table** (the `run.py status` footer is the source of truth).
- **Missing-reference list:** anything the drafter could not generate for lack of a reference
  image (`missing_references` in `repurpose/output/<batch>-lane3-plan.json`) and any visual-QA
  FAILs (`repurpose/output/<batch>-lane3-visual-qa.md`), so Mike can supply references.
- **Summary** of everything done, with the carousel version chosen per YT post and why.
