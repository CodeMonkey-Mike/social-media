# Shrink my share: cut Claude usage per video

_TODO list from the 2026-10-11 discussion (retire-early session). Goal: fit more longform videos per week inside the Max plan by
cutting the usage that does no work. Mike: "not now, maybe next week"._

## Baseline (last 7 days to 2026-10-11, measured from the local session transcripts)

Two longform videos (every-job, retire-early) nearly used up the weekly allowance on ALL models, not just Fable.

| Where it went | Text written | Text re-read |
|---|---|---|
| Pipeline agents, every-job | 31% | 22% |
| Pipeline agents, retire-early | 26% | 16% |
| **Interactive sessions (Mike + the main loop)** | **29%** | **45%** |
| coin-research project | 8% | 15% |
| Other lanes (livestream, LinkedIn, reply-guy) | 6% | 1% |

The biggest waste: ONE marathon session (~700 turns) re-reading ~500k tokens of context every turn, and every background
progress ping ("render 25%") is a turn. Anthropic does not publish how written vs re-read text counts against the cap, so treat
these as shares, not exact cost. Re-measure after each change below (see the last item).

## TODO

### 1. Lean sessions (free, biggest win)
- [ ] Launch the graph DETACHED and stop watching it. The graph already orchestrates (it spawns every agent itself and stops
      on its own at each gate, printing the resume command); the main loop is only the interface at gates and the repair crew.
- [ ] One FRESH short session per gate instead of one session for the whole video: e.g. "spine review for retire-early:
      bursts at 8:55 and 9:46, desilence 300/600, approve" -> one resume command -> session ends.
- [ ] No progress monitors. When something must be waited on, use ONE Bash `run_in_background` until-loop that notifies once on
      exit (never `tail -F` Monitors: on Windows their tail.exe outlives the monitor and locks files).
- [ ] Always name the video in a gate session (the project folder name is the key; two videos in flight never mix).

### 2. Gate notifications (small build)
- [ ] The graph itself sends a desktop / phone notification when it stops, naming the project and the gate or the failed node
      ("retire-early waiting at spine_review", "golden-kitty failed at verify_comp"). Today the main loop is the alert, which is
      what keeps a session open for hours.

### 3. `/longform` slash command (small build)
- [ ] `.claude/commands/longform.md`: `/longform <project> <gate notes>` pins the lane and the steps, so a gate session is one
      line (like the existing `/vertical-repurpose` and `/longform-short`).

### 4. Pipeline agents on a pay-per-use API key (decision first)
- [ ] Measure the token count per video for the headless `claude -p` agents (the graph's spawners), and price it against the
      current API rates.
- [ ] If it makes sense: run ONLY the pipeline agents on an API key, so the Max plan covers the interactive sessions and volume
      grows with money instead of hitting a weekly cap. A small change in the spawners (the Fable fallback stays).

### 5. Right-size agent models (Mike's call)
- [ ] Heaviest agents: the comp builder (Opus xhigh, ~0.3M output per video) and the asset build + visual-QA repair rounds.
- [ ] Candidates for Sonnet: the mechanical asset builders and the visual checks. Strategists and the comp builder stay on
      Fable / Opus.

### 6. Fewer repair rounds
- [ ] Fix the root causes that re-spawn agents: retire-early's visual QA failed 74 of 160 files in round 1 (52 were one
      systemic defect, the chart divider colour), so a build rule or check upstream saves a whole round of builders + QA.

### 7. Know the plan
- [ ] Check whether the account is on Max 5x or 20x (Settings > Usage on claude.ai). If 5x, 20x comes before item 4.

### 8. Keep measuring
- [ ] Turn the week tally used for the baseline into a repo script (it reads `~/.claude/projects/*/*.jsonl`, sums the
      per-message usage by model and by session kind) and re-run it after each change.

Related (not token usage, but the same "one video a day" talk): disk on C: is full (move `media/` to D:), one ChatGPT image lane,
six gates per video. Memory: `project_daily_video_scaling_ideas.md`.
