# clip-evals: the eval score layer for the clip-strategist

_Built 2026-11-13. Code: `clip_evals.py` (this folder). Data: `video-creation/livestream-repurpose/evals/`._

The livestream graph already grades its own work one run at a time: code graders (`validate_plan`), an LLM judge
(`visual-qa`) and a human grader (the 4b and 2nd gates). This layer adds what was missing: a permanent record of the
human grades, and a score that compares one version of the clip-strategist's prompt to the next.

It measures. It does not change the strategist. A person still edits the prompt, and the score says whether the edit
helped.

## Looking at it: the dashboard's Evals page

`http://localhost:8766/evals.html` (start the dashboard: `schedule-tweets/skills/dashboard.md`). It shows the
score per prompt version, the replays and their run-to-run noise, and every batch: open one to see each clip
with its verdict at both gates, the strategist's reasoning, any misses, and its replays pick by pick.

The page is read-only and holds no scoring logic. It draws `dashboard_data()` from `clip_evals.py`, served by
the dashboard at `/evals/data.json`. To see the same object in a terminal: `clip_evals.py dashboard-data`.

## What is where

| Path | What it holds |
|---|---|
| `evals/clip-verdicts.jsonl` | **The record.** Append-only, one JSON object per line. Committed to Git, never recycled. |
| `evals/transcripts/<batch>/` | The three transcript files the strategist read (`chunks_90s.txt`, `plain.txt`, `words.txt`) and `meta.json` (length, per-run brief). Kept so a batch can be replayed after cleanup recycled it. |
| `evals/replays/<batch>--<prompt version>--rN.json` | What the strategist picked when an old transcript was re-run. `rN` counts repeats under the same prompt. |
| `evals/scores.jsonl` | One line per distinct score, so prompt versions can be compared over time. |

`cleanup/cleanup.js` refuses to recycle anything in `evals/` (the `PROTECTED` guard), and nothing in this skill ever
rewrites or trims a `.jsonl` file.

**Not safe until pushed.** A new line exists only on this machine until it is committed and pushed. Commit `evals/`
with the batch it belongs to.

## The record: one line per clip per gate

Written by the batch graph, in `batch_graph.py`:

1. **When the plan validates** (`lane2_select`): the prompt version is stamped into `clip-plan.json` under `eval`, and
   the transcripts are copied. It is stamped then, not at the gate, because the prompt can change in the hours between.
2. **At each gate approval** (`_record_gate`): one `verdict` line per clip that was still alive at that gate.

```json
{"v":1,"type":"verdict","batch":"best-time","clip_id":1,"slug":"nobody-writes-code-anymore-every-job-next",
 "gate":"4b","verdict":"killed","at":"2026-10-27T08:32:58","segments":[[362.25,385.85],[432.25,448.65]],
 "seconds":57.35,"prompt_version":"3f9a1c0b7d2e","model":"fable/max","source":"gate",
 "title":"...","variant":"full","brief":"...","prompt_parts":{...},"proposal":{ the strategist's whole clip }}
```

- A clip kept at 4b gets a second line at the 2nd gate (`kept` or `killed`). A clip killed at 4b is not judged again.
- `proposal` (the full clip, with its rationale) and `prompt_parts` are stored once, on the clip's first line.
- A killed clip keeps its whole proposal. Before this, a kill kept only its number, slug and time.
- Recording a gate twice writes nothing: a (batch, clip, gate) already on record is skipped.
- A failure to record never stops a batch. It prints `EVALS WARNING`, shows in the gate's step detail as
  `evals: NOT RECORDED`, and is repaired with `clip_evals.py record --batch <b> --gate <g>`.

### Misses (what makes recall possible)

The gate only knows what was proposed. To measure recall, say what the strategist should have found when approving:

```
python video-creation/livestream-repurpose/graph/run.py batch --batch <b> --resume --approve 4b --delete 2 \
    --missed "12:30-14:10 the ETF rant; 45:00 kaspa hashrate"
```

- Items are separated by `;`. A time range or a single timestamp is optional but lets a replay be credited for
  finding the miss. Times are the vertical master's, as printed in the 90-second chunk transcript.
- `--missed none` means the review found nothing missing. Without it the batch's recall is "not reviewed", which is
  different from 100%.
- To add one later: `python .../clip_evals.py missed --batch <b> "..."`.

### The prompt version

`prompt_version` is a 12-character hash of four things. Change any of them and the version changes:

| Part | File |
|---|---|
| `agent` | `.claude/agents/clip-strategist.md` |
| `topic_finding` | `skills/topic-finding/SKILL.md` |
| `clip_selection` | `skills/clip-selection-dashboard/SKILL.md` |
| `template` | the instruction text in `batch_graph.clip_prompt_text` (with placeholders for the paths) |

The three file parts are Git blob hashes, so a committed version can be read back with `git cat-file -p <hash>`.
`persona/persona.json` is left out on purpose: it changes for reasons unrelated to clip selection. The per-run
`brief` and the `model` are stored beside the version, and the score splits by model, because a Fable run that fell
back to Opus is a different strategist.

## Commands

Run from the repo root.

```
python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py list
python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py score [--batch B] [--json]
python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py replay --batch B [--brief "..."]
python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py missed --batch B "..."
python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py record --batch B --gate 4b|2nd
python video-creation/livestream-repurpose/skills/clip-evals/test_clip_evals.py
```

## The score

### From the gate record

Per prompt version and model:

| Number | Meaning |
|---|---|
| selection precision | clips kept at 4b / clips judged at 4b. The 4b gate judges the CHOICE of clip. |
| final precision | clips kept at the 2nd gate / clips judged, in batches that reached the 2nd gate. A 2nd-gate kill may judge the edit, so it is reported apart. |
| recall | kept / (kept + missed), only over batches where a miss review was recorded. |

### From a replay

`replay` re-runs the clip-strategist on a saved transcript with the prompt as it is now. It sends the same
instruction text a real batch sends (`batch_graph.clip_prompt_text`) and the batch's original brief, through
`batch_graph.spawn_agent`, so the Fable-to-Opus fallback applies. It costs one strategist run. Nothing is cut.

Each new pick is matched to the clips that were judged at 4b:

- **Match rule:** a pick is "the same clip" when it shares at least 50% of the shorter clip's seconds
  (`MATCH_MIN`). Among candidates the highest intersection-over-union wins, which tells a long clip from the short
  impact clip cut out of it.
- **kept:** the pick matches a clip that was kept at 4b.
- **killed:** the pick matches a clip that was killed at 4b. The new prompt repeated a rejected choice.
- **misses:** the pick lands on a recorded miss (a time range it overlaps, or a timestamp within 30 s).
- **new:** no verdict on record. It is neither right nor wrong, and it is left out of precision.
- **carries killed material:** a flag, not a verdict. The match rule works on whole clips, so a pick can match
  a kept clip and still include a stretch of a killed one. A pick with 10 s or more of a killed clip
  (`REUSE_MIN_S`) is flagged. It does not lower precision; it is shown so a person can judge it.

| Number | Meaning |
|---|---|
| precision | (kept + misses) / (kept + misses + killed) |
| kept found | share of the batch's kept clips that the replay found again |
| kills repicked | share of the batch's killed clips that the replay picked again |

### Reading it honestly

- **The strategist varies between runs.** Replay the SAME prompt first (`r1`, `r2`): the spread between repeats is
  the noise floor. A prompt edit only counts when it moves the score by more than that. `noise_table` reports,
  per batch replayed more than once under one prompt and model, the share of picks the runs have in common
  and the spread in precision between them (the Evals page shows it under the replays). Picks are paired one
  to one for this, so a run that adds a short impact clip beside the same long clip counts as different.
- **First noise runs (2026-11-13, prompt `57ecbf267a8c`, Fable, two runs on each of the 4 replayable
  batches):** the strategist picked the same moments both times on every batch. What changed between runs
  was which impact clips it added, and that alone moved precision by 0 to 16.7 points on a single batch
  (one killed impact clip re-picked out of 6 judged picks). Across all 8 runs: 89.7% precision on judged
  picks. Treat a difference smaller than about 17 points on one batch as noise.
- **The sample is small.** With about 17 kills on record, one clip moves precision by about a point.
- **A replay is not blind by design, only by instruction.** The agent can read files, and the answer key is in this
  repo. The replay prompt tells it to work only from the transcript files and not to open `evals/` or an earlier
  plan. Nothing proves it obeyed: the replay's log (`graph/data/agent-clip-strategist-replay-<batch>.log`) holds
  only its final answer, not the files it opened. Treat a score that looks too good with suspicion.
- **Only batches with a saved transcript can be replayed.** `list` shows `saved` or `gone`.

## The backfill (2026-11-13)

`seed_verdicts.py` was run once. It joined the strategist logs (full plans) with the checkpoint database (which
clip numbers were deleted at each gate, and when), both in `graph/data/` with no backup, into 168 lines: 20 batches,
91 judged clips in 18 of them, 17 killed. Seeded lines have `"source":"seed"` and:

- `prompt_version` is null (shown as "not recorded"): the old prompt versions cannot be recovered.
- `perpspad` and `silver` have an older plan format with no clip numbers, so their 3 kills are stored with
  `"matched":false` and both batches are left out of every score.
- Nobody was asked about misses, so recall is "not reviewed" for all of them.
- Four batches still had transcripts on disk and can be replayed: `30x-tao`, `best-time`, `kaspa-cocktails`,
  `stock-market`.

It is safe to run again (it skips what is on record), but there is no reason to: new batches are recorded live.
