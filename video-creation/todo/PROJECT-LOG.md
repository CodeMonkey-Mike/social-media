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
| Ideas from work demo recordings (19 ideas, top three marked; 18 is Mike's pick of 2026-11-18) | `demos/ideas.md`, `demos/README.md` | **no**, gitignored |
| What each work demo showed | `demos/demo-notes.md` | **no** |
| Demo recordings kept on purpose (meeting D, 2026-11-18) | `demos/recordings/` | **no** |
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

**2026-11-17: clip-evals is live, its short is approved, and the AI channel got its own YouTube-post queue.**
- The video is live on AI Engineering Simplified: https://youtu.be/U26NDilqCDo
- Mike approved the short (`clip-evals-SHORT-30s.mp4`).
- The YouTube-post lane (`run.py ytpost`) now picks its queue by the channel the live video is on, for a longform-edited
  or a longform-presentation video: the crypto channel stays on `schedule-tweets/data/yt-posts.json`, AI Engineering
  Simplified goes to the new `schedule-tweets/data/ai-yt-posts.json`, shown in a new dashboard tab, **AI YouTube
  Posts**. Nothing posts that queue yet: Mike posts by hand. The cleanup tool scans the new queue too.
- First test, clip-evals: `ai-yt-post-2026-11-17-clip-evals-video` is queued (`pending`), 10 slides, every number
  checked against the final transcript, visual-qa PASS. The first build failed QA on the face (a narrow crop of the
  Python-video picture), so the picture is now used full width with that video's title cleared from the blue backdrop
  in code (`clip-evals/thumbnail/yt_post_face.py`; Mike's pixels unchanged), and two image slides became text rows.

**2026-11-17: one agent per decision, plain code for the rest (a design talk about the livestream graph).**
- Mike asked why the clip-evals slide "Six agents work inside this graph" has no desilencer. The livestream batch graph
  removes silence in code (`desilence.py` at the lane's fixed setting). There is nothing to decide there, so an agent
  would only add time and tokens.
- The shorts' ChatGPT b-roll has no agent of its own either: each clip's `remotion-builder` writes the image prompts,
  runs the generator (`repurpose/gen_batch.py`) itself and judges its own images.
- The design rule from that talk: one agent per decision, plain code where there's nothing to decide. By that rule the
  images should be their own step. Keeping them inside the builder has cost us:
  - a build that quit: on archie-promo (2026-09-24) a builder found another one using the ChatGPT browser, said "I'll
    continue when it finishes" and exited. The fix is only a line in the builder's prompt.
  - no independent check: in the batch graph, visual-qa opens only Lane 3's images, where it caught ChatGPT inventing
    chart numbers (batch `johnny`).
  - the wrong price: the image work runs at the builder's Opus / xhigh tier, while `image-gen` runs on Sonnet.
- The cost, accepted: two builder runs per clip, the BROLL-PLAN becomes a file one agent hands the other, and a builder
  that dislikes an image sends it back instead of redoing it.
- Decided: build it the next time Mike has a livestream to process (Open, "Livestream pipeline").

**2026-11-18: a fourth demo meeting, kept as a video** (details in `demos/`, private).
- Two recordings of one meeting were joined into one MP4 with a repeated 24 s cut out: 36:52, 92 MB instead of 1.9 GB,
  screen text still readable. Mike asked to keep this one, so it's in `demos/recordings/` (gitignored) and the D:
  originals weren't touched. Transcript in `demos/transcripts/2026-11-18.txt`, 18 screenshots, notes as demos 13-15.
- Three demos: an AI tools portal (give a license back, no double requests, your own usage), a workflow that upgrades
  a self-hosted app with an agent reading the release notes, and a Claude Code skill that reviews **how the person
  prompts** from their local session logs (Mike's favourite).
- Became ideas 18 and 19 in `demos/ideas.md`, plus an addition to idea 8 (members area). Video idea 10 in
  `aiEngineeringSimplified.md`.

**2026-11-18 to 11-19: the image-agent split, built and run live on batch `ripping`.**
- Built before the build step of that batch (`_build_clip` in the batch graph): the builder plans and stops, the
  graph takes the ChatGPT browser lock in code, `image-gen` generates, visual-qa checks, the builder builds.
- Live result, 7 shorts, all built with PASS gates and staged (no long-form, every clip under 60 s by Mike's brief):
  - First image check: clips 2 and 5 passed, five failed. After one fix round clips 3 and 4 passed. Clips 1, 6 and 7
    failed twice and their builders remapped the beat (two code-drawn cards, one base-showing beat, one cover made
    from a crop of another image). Nothing shipped with a failed image.
  - What the independent check caught: a made-up brand label on a tool (clip 3), a cartoon face added to the
    Ethereum coin (clip 4), a satchel and bedroll the model invented on the Pieverse mascot in all five images of
    clip 6, and subjects placed where the content-zone crop cuts them (clips 1, 6, 7).
  - Time: the build ran 21:56 to 02:34 (4 h 38 min, three clips at a time). The ChatGPT browser was busy for about
    3.9 h of it: 168 min for the first rounds (about 4 min an image) and 67 min for fix rounds. The builder's plan
    stage takes about 4 min a clip, its build stage 20 to 30 min.
  - No builder waited on the browser lock or quit, the failure the split was built to end.
- One change after the run: a re-driven batch no longer regenerates images for a clip that already used its two
  rounds; it resumes at the fix round or goes straight to the build.
- Found by a builder, fixed the same night: clip 7's out point sat inside the word "unemployed", so the short ended
  on "find yourself unem". The cut was moved to the dip after the word (1739.17 to 1739.45), the clip re-tightened
  alone (`tighten_clips.py --only`), rebuilt and re-staged; the old version is in the clip's `_qa/pre-recut/`.
- The text and image lane's drafter listed Bitcoin and Solana as missing references and drew them as blank coins.
  Mike: "solana and bitcoin are common. there is no need for their images". The drafter's rule now names well-known
  brands and asks for the real logo; the two tweet images were regenerated.

## Open (where we left off)

**AI Engineering Simplified**
- **langgraph-updates (new, 2026-11-19): at Mike's gate.** A freeform recording on the image-agent split, set up as the
  first AI-channel session of the longform-discussion track (`"channel": "ai"`, with `code` tabs that open a repo file
  at a line in VS Code). Folder: `video-creation/longform-discussion/media/langgraph-updates/`: `TOPICS.docx` (9 topics,
  11 tabs, around 16 minutes), 5 single-slide tabs in `slides/`, the numbers and term lists in `research/`. Next: Mike
  narrows the document, then `discussion.py approve langgraph-updates --from-doc`. The code tabs show uncommitted
  changes: a commit before he records empties VS Code's green "added line" view, and any edit to those files means
  `discussion.py render langgraph-updates` to re-check the line numbers. Thumbnail (2026-11-19): four takes in
  `thumbnail/takes/take-a.jpg` to `take-d.jpg`, the dark look of his "Do You Actually Need LangGraph?" thumbnail with
  his exact picture from the "Python over JavaScript" one, composed in code (`thumbnail/build.py`, `cut_mike.py`).
  Mike picked take C ("ONE AGENT PER DECISION", the four steps in a row): `thumbnail/langgraph-updates-thumb.jpg`.
  He uploads it himself with the video.
- clip-evals: the video is live and the short is approved. Still to upload by hand if not done yet: the LinkedIn cut
  and the short (the metadata is in `YT-DELIVERY.md`).
- Heads-up: the JS crypto poster still uploads to the page's first file input, so it fails once the crypto account
  gets YouTube's new search box (fixed in the Python poster).
- Next video topic: see "Video ideas, in recommended order" in `aiEngineeringSimplified.md`. Prompt injection is #2,
  and its fix comes first (engineering gap 1).
- Possible later video: a results piece showing what the score said about a real prompt change.
- The FinOps X idea (17) and the talk-only topics (15) in `demos/ideas.md` are still candidates.

**Livestream pipeline**
- **The image-agent split is live** (Done; the 2026-11-18 timeline entry has the numbers). Two things the first run
  showed, for Mike to decide:
  - Framing fails cost the most and never got fixed by regenerating: ChatGPT does not place a subject where a
    prompt says, so clips 1, 6 and 7 each spent a fix round (14 to 30 min of browser time) and still ended in a
    remap. Option: the image check reports a framing defect as "the builder fixes it with the crop position"
    instead of FAIL, and only content defects (wrong subject, invented logo or text, off-model mascot) go back to
    `image-gen`.
  - The browser is the bottleneck of the whole build (3.9 h of 4.6 h), so the fix-round policy sets the batch time.
- **Make the 4 build steps real LangGraph nodes** (Mike, 2026-11-22, while scripting langgraph-updates: the current
  shape came from a Claude session's recommendation while he was learning LangGraph, and a seasoned LangGraph
  developer would ask why the steps aren't nodes). Today `lane2_build` is ONE node: `_build_clip` runs plan, images
  (under the `chatgpt` lock), image check (a Python `for` loop, at most `BROLL_QA_ROUNDS` = 2) and build as plain
  Python, 2 shorts at a time in a thread pool. Target: a **per-short subgraph** (nodes plan, images, image_check, build;
  image_check back to images as a conditional edge capped at 2 rounds) fanned out from `lane2_build` with `Send`
  ([docs](https://docs.langchain.com/oss/python/langgraph/graph-api-send-command#use-send-for-map-reduce)). Not 4 nodes
  in the main graph: LangGraph runs in supersteps, so every short's plan would finish before any short's images start.
  Must keep: the resume from disk (plan files present, the round number in the image check's report), the wait on
  `.building.pid` builders started outside the graph, the cap of 2 (likely the run config's `max_concurrency`; check),
  the cross-process `chatgpt` lock taken in code with its `finally`, and per-short failures gathered without stopping
  the other shorts. First step: turn the fake-agent test below into a `scripts/check-*.py` and prove the subgraph
  against it before a live batch. Video: langgraph-updates is recorded as built (its script says the 4 steps are
  plain Python inside one node); the refactor can be its own before-and-after video.
- The fake-agent test of `_build_clip` (twelve cases) lives only in a temp folder. Worth keeping as
  `scripts/check-*.py` next to the spawner check if Mike wants it.
- The cut tool has no single-clip redo (`cut_topics.py` re-cuts every clip), so clip 7's raw `-full.mp4` on the
  clip-review dashboard is still the old cut. The tightened, final and staged files are the repaired ones.
- The tighten-strategist took 46 min for four clips, most of it re-transcribing with Whisper large-v3 to check its
  own cuts, and its check still passed clip 7's out point inside a word. Worth a look at that agent's method.
- Noted, not decided: the longform-edited graph's first silence pass (`desilence_coarse`) has nothing to decide and
  could be plain code instead of the desilencer agent. Its final pass keeps the agent: when Mike gives two silence
  settings without a split point, the agent finds where the hook ends.

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
- **Review my own prompting (idea 18, Mike's pick from 2026-11-18):** a skill that reads Mike's Claude Code
  sessions for this repo and reports the habits that cost turns, quoted, each with its cost and a one-line fix, plus
  a trend verdict. Our addition: every correction loop gets an owner, either the prompt or **the repo doc that should
  have prevented it**, so the report doubles as a fix list for the skills. Scale is the engineering problem (about
  1,000 sessions a month, many of them headless agents to filter out). First step: the plain-code turn extractor on
  the last 7 days. No further recording needed.
- **Upgrade agent for our dependencies (idea 19):** plain code finds what moved, one version step at a time, and a
  model reads only the release notes against how we use the package; branch, snapshot, checks, smoke test on Mike's
  OK. First step: write the runbook for one risky package (torch with CUDA).
- **Our own code review agent:** a proposal exists (a rules file plus a local review command before merging, with an
  evaluation set from our own past mistakes; later maybe a GitHub action). Questions for Mike: which repos, pull
  requests or local merges, advise only or ever block, and whether it's also a channel video.

**Repo housekeeping**
- **Change the JavaScript files over to Python** (Mike, 2026-11-17: "this is a python repo. we should not be using
  javascript unless it is a remotion file"). 315 tracked `.js` files outside `remotion/` on 2026-11-17, **265 on
  2026-11-22** after `schedule-tweets/scripts/` was done (first row). Where a Python twin exists (same name, `_` for
  `-`) the work is switching callers and docs to the Python one and retiring the JS:

  | Folder | JS files | Python twin exists | Note |
  |---|---|---|---|
  | `schedule-tweets/scripts/` | **0** | all | **DONE 2026-11-22** (branch `chore/schedule-tweets-js-to-python`): all 49 JS files deleted. 19 already had a twin, 14 were ported that day (the read-only check and diagnostic tools + `yt_reauth.py`), 16 were deleted with no port (banned, a one-off, or already replaced: the table in `schedule-tweets/skills/SKILL.md`). Ten posters have not posted live in Python yet (that doc's live-proof ledger); the new check tools have not been run yet either. |
  | `video-creation/assets/transitions/` | 87 | 0 | checked 2026-11-22: none is Remotion-side (Remotion code names them only in comments), so all are portable build tools |
  | `repurpose/archive/` | 43 | 0 | archived: delete or leave, not port |
  | `video-creation/longform-edited/media/` | 39 | 0 | per-video files, go with each project folder after publish |
  | `repurpose/` | 23 | 6 | |
  | `video-creation/skills/higgsfield-voice/` | 19 | 0 | |
  | `video-creation/skills/music-sourcing/` | 14 | 0 | |
  | `video-creation/ai-engineering/media/` | 8 | 0 | per-video |
  | `video-creation/skills/elevenlabs-lipsync/` | 7 | 0 | |
  | `video-creation/longform-edited/skills/` | 5 | 5 | frozen twins of the Python lints |
  | everything else (`cleanup/`, `scripts/`, `x-reply-guy/`, `topic-radar/`, a few skills) | 20 | 5 | |

  First steps: (1) DONE 2026-11-22: the crypto channel's YT posts go through `post_yt_community.py` (the JS poster is
  deleted; the first live crypto post through it is still to come); (2) HALF DONE 2026-11-22: `CLAUDE.md`'s
  Python-first rule no longer lists the `schedule-tweets` posters as a JS exception. Still open, for Mike to rule on:
  the LinkedIn and reply-guy exception, the "edit data/*.json with Node" line (Python with `ensure_ascii=False` keeps
  emoji just as safely), and the `node -e` queue-reset snippets in the posting docs. Note `schedule-tweets/package.json`
  + `node_modules` must stay for now: 15 JS files elsewhere (music-sourcing, ai-engineering media) load Playwright
  from there. Recount with `git ls-files "*.js"` minus `remotion/`.
- Orphan Markdown files: Mike wants to go through them one by one before deleting any ("maybe there's some information
  that we wanted to put in there").
- The clip-evals video, the short-lane change and the AI channel's YouTube-post queue are **not committed yet**. Commit
  on a branch when Mike asks. Also uncommitted since 2026-11-19: the image-agent split (`batch_graph.py`, the
  `remotion-builder`, `image-gen` and `lane3-drafter` agent files, the shorts build `SKILL.md`), batch `ripping`'s
  queue rows and its new eval verdicts.
- Batch `ripping`, Pieverse YT post: the hook slide (`schedule-tweets/images/yt/yt-posts-d8d4c59b-01-hook.png`)
  failed its image check (a shield badge copied from the exemplar) and is still queued as it is. Regenerate that
  one slide before the post goes out.
- Small known bug: `cover_runs.py --vertical` writes a pixel aspect a hair off square. `linkedin_cut.py` corrects it,
  but the vertical master still has it.
- Short lane, not automated yet: joining a mishear to match a card ("live streams" to "livestreams"), and starting the
  first caption on frame 0. The lane's final visual check wasn't run in the test.
- ElevenLabs: Mike signs in with Google. After the Chrome-profile exposure, the advice was to sign out of all sessions
  (and review the Google account's connected sessions). Mike thinks it's fine.

## Done (closed, for reference)

- The shorts' ChatGPT b-roll has its own agent: built 2026-11-18, proven live on batch `ripping` (7 shorts built and
  staged, 2026-11-19). Spec: `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md`, "One clip
  = FOUR steps".
- Livestream batch `ripping` run end to end: 7 shorts staged, 16 text and image entries queued (2026-11-19).

- Topic backlog file created (2026-11-06).
- Branch cleanup, repo recreated with clean identity, secrets and private data purged (2026-11-06 to 11-09).
- No-D: rule and file-placement rule, with a checker and a Stop hook (2026-11-08 to 11-09).
- Fourth demo meeting joined into one small MP4 and kept, notes and ideas 18-19 written (2026-11-18).
- First batch of work demos processed, videos deleted (2026-11-12). Code-review repo recordings and the FinOps document
  processed (2026-11-13, 11-16).
- Eval score layer, kill reasons, dashboard Evals page, noise runs, first live batch (2026-11-13 to 11-16).
- Clip-evals video delivered with its LinkedIn cuts, thumbnail, metadata and 30 s short (2026-11-16 to 11-17).
- Short lane works on presentation projects (2026-11-17).
- Clip-evals live (https://youtu.be/U26NDilqCDo) and its short approved by Mike (2026-11-17).
- YouTube-post queue for AI Engineering Simplified (`ai-yt-posts.json`) and the dashboard's AI YouTube Posts tab
  (2026-11-17).
- The AI channel's YT poster, `python -u schedule-tweets/scripts/post_yt_community.py --channel ai` (its own
  `ai-ytbot-profile` signed in as @aiEngineeringSimplified, CDP 9225, a wrong-account guard, the same delays as the
  crypto posts). First post, the clip-evals carousel, 10/10 images (2026-11-17):
  https://www.youtube.com/post/UgkxGCVWtK3K2PQoaVcU6L147fneXwkssnse. Two earlier runs failed before the Post click
  (YouTube's search box has a hidden image input that comes first on the page; the posts page took over 30 s to
  load); both fixed in the poster.
