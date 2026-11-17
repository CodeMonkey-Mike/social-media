# todo/: project log

_What this folder is for: ideas and to-dos from any source (work demos, the AI Engineering Simplified channel, things
to fix or build in this repo for ourselves). An idea can fan out into any part of the repo. **A new chat session should
read this file first**, then the file for the area it's working on (table below)._

_Started 2026-11-17 from one long chat that ran 2026-11-06 to 2026-11-17. Add a dated entry when something is decided
or finished, and move items between "Open" and "Done" instead of rewriting history._

**This file is committed, and the repo is public.** Details from the work demos (people, internal tools, the company's
code) stay in `demos/`, which is gitignored. Here they are only summarized.

## Where things live

| Area | Read | Public? |
|---|---|---|
| AI Engineering Simplified: topic backlog, engineering gaps, video ideas | `aiEngineeringSimplified.md` | yes |
| Ideas from work demo recordings (17 ideas, top three marked) | `demos/ideas.md`, `demos/README.md` | **no**, gitignored |
| What each work demo showed | `demos/demo-notes.md` | **no** |
| Our own code review agent (notes from a work reviewer's repo, do / don't lists) | `demos/code-review-agent/code-review-agent.md` | **no** |
| FinOps X recommendations doc (recreated) | `demos/finops-x-recommendations/` | **no** |
| Scripts for processing silent screen recordings (frames, OCR, stitching) | `demos/tools/`, recipe in `demos/README.md` | **no** |
| The clip-strategist eval score layer | `video-creation/livestream-repurpose/skills/clip-evals/clip-evals.md` | yes |
| System-design diagrams (Excalidraw, outside this repo) | `C:\Users\mnede\Documents\Claude\system-design\` (`livestream-evals/`, `simple-web-architecture/`) | outside the repo |

## Timeline (what happened, in order)

**2026-11-06: channel topics and this folder.**
- Asked which engineering concepts the channel hasn't covered yet (already covered: evals, guardrails, inference,
  LangGraph). That turned into `aiEngineeringSimplified.md`: 5 engineering gaps in the repo and 9 video ideas.
- Recalled what the evals video promised on camera: the eval score layer ("what I'm building next").
- Drew the evals flow as an Excalidraw diagram in the `system-design` folder. The viewer was changed to one port with a
  folder per diagram, instead of one port per diagram.
- First work demo recording tested: no need to maximize the window to record. `demos/` was made gitignored.

**2026-11-06 to 11-09: repo hygiene (security and identity).**
- Months of work were on a branch called `transitions-library`, so nothing counted on Mike's GitHub graph. It was merged
  and deleted. Rule since then: short-lived `type/topic` branches, merged into `master`.
- `linkedin-automation/` (it held LinkedIn members' records), an ElevenLabs Chrome profile and a music-search key were
  found in the public repo. All were purged from history and are ignored now.
- 2026-11-09: Mike deleted and recreated the GitHub repo with rewritten history. Every commit is now `CodeMonkey Mike`
  with the GitHub no-reply email. Old commit links are dead.
- New rules: **nothing is ever written to D:** (removable drive), and **where files go**: one video's files in its project
  folder, shared or throwaway files in `video-creation/cache/<tool>/`, enforced by `scripts/check-file-placement.py`.
  Stray folders like `_bad_transcript_kcc20/` and old chart data were cleaned out.

**2026-11-12 to 11-16: work demos mined for ideas** (details in `demos/`).
- Six recordings from three demo meetings were transcribed and turned into `demos/demo-notes.md` (12 demos) and
  `demos/ideas.md` (sorted by where each idea fits: this repo, the crypto site, the members area, a channel build, a
  talk-only topic). The videos were deleted after the notes were checked.
- 2026-11-12: Mike asked about a "what you missed" digest of the crypto community's Discord chats. Added as an idea,
  questions left open.
- 2026-11-13 and 11-16: two silent screen recordings of a work code-review agent's repo, plus two real review comments.
  Goal: our own code review agent for our GitHub repos. Documented only, not started.
- 2026-11-16: Mike's own "FinOps X 2026 Recommendations" document was recreated from a recording and became idea 17
  (video angles, and two parts that fit our repo: cost per agent and per video, and a cost estimate at the plan gate).

**2026-11-13 to 11-16: the eval score layer, built** (off camera, Mike's choice; branch `feat/clip-evals`, merged).
- Every clip kept or killed at the livestream gates (4b and 2nd) is recorded with the prompt version, in the
  append-only `video-creation/livestream-repurpose/evals/clip-verdicts.jsonl` (committed, never recycled).
- `clip_evals.py`: `list`, `score` (precision per prompt version and model), `replay --batch <b>`, `missed` (recall:
  `--missed "..."` on a gate approval), `why` (the reason a clip was killed, added 2026-11-15).
- Backfill: 168 records from 20 old batches.
- Noise runs: the same prompt replayed on the same transcripts scored differently run to run (100% on one run, 83.3% on
  the next). So a prompt change only counts when it moves the score by more than that.
- The dashboard got an **Evals** page (`http://localhost:8766/evals.html`), with replay listed there as an available
  option (Mike: he probably won't use it, but wants it visible).
- First real run: batch `peach` (2026-11-16). All clips approved, one missed topic named.
- Finding: 11 of the 17 backfilled kills were one half of a full / impact pair where the other half was kept.

**2026-11-16 to 11-17: the clip-evals video** (AI Engineering Simplified; project
`video-creation/longform-presentation/media/standard/clip-evals/`).
- Track chosen: longform-presentation, standard format, **scripted** (its first real run). One video, any length.
- The script format was changed to match the longform-edited screenplay (`[COVER]` / `[SCREENSHARE]` tags, `[SHOW]`
  lines) after Mike couldn't read the first draft. The parser, lint and docs changed with it.
- Approved, recorded (67 min raw), edited to 18:22. Delivered:
  - `clip-evals FINAL-v1.mp4`
  - `clip-evals FINAL-v1-LINKEDIN.mp4` and `clip-evals VERTICAL-v1-LINKEDIN.mp4`, both 8:59 (the vertical is the one for
    LinkedIn this time)
  - `clip-evals-SHORT-30s.mp4`
  - `thumbnail/clip-evals-thumb.jpg` (text "Eval Harness")
  - `YT-DELIVERY.md`
- Title: **"Evals in Production: Turning Human Verdicts Into a Score"**. Suggested short title: "Same Prompt, Same
  Model: 100% Then 83.3%".
- Lessons that became rules: a screen-share scene always shows content beside the webcam (paint the deck area if it was
  recorded empty, never ask); extract the WAV of a batched-desilenced edit with `aresample=async` or it drifts.

**2026-11-17: the longform-presentation track got a short.**
- The longform-edited short lane now accepts a presentation project:
  `python video-creation/longform-edited/graph/run.py short --project "<project folder>"`. It's the same lane, not a
  copy. It was tested by reproducing the clip-evals short byte for byte.
- The YouTube-post lane no longer mistakes a `-LINKEDIN` file for the FINAL.

## Open (where we left off)

**AI Engineering Simplified**
- Upload the clip-evals video, its LinkedIn cut and the short (Mike uploads by hand; the metadata is in `YT-DELIVERY.md`).
- Next video topic: see "Video ideas, in recommended order" in `aiEngineeringSimplified.md`. Prompt injection is #2,
  and its fix comes first (engineering gap 1).
- Possible later video: a results piece showing what the score said about a real prompt change.
- The FinOps X idea (17) and the talk-only topics (15) in `demos/ideas.md` are still candidates.

**Eval score layer**
- Learn how much the score moves on its own, then edit the clip-strategist's prompt and check the score.
- Add a `--why` option on the gate approval itself (held back on 2026-11-15 because a batch was running).
- Commit `video-creation/livestream-repurpose/evals/` with each batch, or the new verdicts exist only on this machine.
- Not started: feed kept and killed examples back into the prompt, and test whether a cheaper model picks as well as
  Fable (gap 5).

**Repo engineering gaps** (full list in `aiEngineeringSimplified.md`)
- 1, prompt injection: agents that read the open web run with skipped permissions. Fix before filming.
- 2 to 5: token and cost tracking, tracing inside agents, native structured outputs, cost-based model routing.

**Ideas from the work demos** (in `demos/ideas.md`, nothing started)
- Top three there: a token and cost dashboard for the agent pipelines, a health report for our agents and settings,
  tool health checks with one alert per outage.
- The Discord "what you missed" digest: questions left open on purpose.
- **Our own code review agent:** a proposal exists (a rules file plus a local review command before merging, with an
  evaluation set from our own past mistakes; later maybe a GitHub action). Questions for Mike: which repos, pull
  requests or local merges, advise only or ever block, and whether it's also a channel video.

**Repo housekeeping**
- Orphan Markdown files: Mike wants to go through them one by one before deleting any ("maybe there's some information
  that we wanted to put in there").
- The clip-evals video and the short-lane change are **not committed yet**. Commit on a branch when Mike asks.
- Small known bug: `cover_runs.py --vertical` writes a pixel aspect a hair off square. `linkedin_cut.py` corrects it,
  but the vertical master still has it.
- Short lane, not automated yet: joining a mishear to match a card ("live streams" to "livestreams"), and starting the
  first caption on frame 0. The lane's final visual check wasn't run in the test.
- ElevenLabs: Mike signs in with Google. After the Chrome-profile exposure, the advice was to sign out of all sessions
  (and review the Google account's connected sessions). Mike thinks it's fine.

## Done (closed, for reference)

- Topic backlog file created (2026-11-06).
- Branch cleanup, repo recreated with clean identity, secrets and private data purged (2026-11-06 to 11-09).
- No-D: rule and file-placement rule, with a checker and a Stop hook (2026-11-08 to 11-09).
- First batch of work demos processed, videos deleted (2026-11-12). Code-review repo recordings and the FinOps document
  processed (2026-11-13, 11-16).
- Eval score layer, kill reasons, dashboard Evals page, noise runs, first live batch (2026-11-13 to 11-16).
- Clip-evals video delivered with its LinkedIn cuts, thumbnail, metadata and 30 s short (2026-11-16 to 11-17).
- Short lane works on presentation projects (2026-11-17).
