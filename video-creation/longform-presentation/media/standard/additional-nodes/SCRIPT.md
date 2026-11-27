# additional-nodes: SCRIPT

_The scripted standard video (`video-creation/longform-presentation/skills/script/script.md`) that keeps the promise
the last LangGraph video made: "those 4 steps become real LangGraph nodes". AI Engineering Simplified. Every number
and every LangGraph claim comes from `RESEARCH.md` in this folder (section 3 holds the docs' own words). Target: 3
minutes at most (Mike, 2026-11-27)._

| Setting | Value |
|---|---|
| project | additional-nodes |
| channel | AI Engineering Simplified |
| silence | 800 ms min-silence, 300 ms left between sentences (the track preset) |
| enhance speech | on |

_Both settings are the last AI video's, written in so the script lints. They are Mike's to confirm before the spine is
cut (`script.md`, "The questions asked AT THE START")._

## PRODUCTION CONVENTIONS

The same tags as a long-form edited screenplay. This track uses 5 of them.

| Tag | Means |
|---|---|
| 🖥️ `[SCREENSHARE]` | spoken, on the screen share as filmed: the deck slide named in the note above it, with your webcam. Say it to the camera |
| 🗣️ `[COVER]` | spoken, while a card fills the whole frame. Your webcam is hidden, so you can read the line |
| 👤 `[FACE]` | spoken to the lens, on your full-camera OBS scene: switch to it before the line, back after it. The video centres your face. 2 face scenes in this video, the open and the close |
| 🎬 `[SHOW]` | what is on screen for the `[COVER]` lines above it. It starts with the card's name from the CARDS table; a dot and a second word, as in `subgraph.loop`, is the same card with a different part lit. Not spoken |
| 💬 `[NOTE]` | a note to you. Not spoken |

## CARDS

| id | kind | shows | states | numbers |
|---|---|---|---|---|
| before | chart-still | System-design chart, BEFORE: the batch graph's nodes in a row, `lane2_build` opened up below them. Inside it, a thread pool takes each short through PLAN, IMAGES, IMAGE CHECK, BUILD. `loop`: a `for` loop arrow from IMAGE CHECK back to IMAGES, and ONE CHECKPOINT at the end of the node | steps, loop | 4 |
| supersteps | chart-still | System-design chart of super-steps. `rule`: SUPER-STEP 1 and SUPER-STEP 2 side by side, the parallel nodes of the first both finishing before the second starts. `lockstep`: 4 shorts in rows across 4 columns, PLAN, IMAGES, IMAGE CHECK, BUILD; short 3's plan runs long and the other shorts wait at the line between the columns | rule, lockstep | 1, 2, 4, 3 |
| subgraph | chart-still | System-design chart of the subgraph `clip_build`: START, `plan`, `images`, `image_check`, `build`, END. `nodes`: the 4 nodes lit, with who does each under it: BUILDER AGENT, PLAIN CODE, VISUAL-QA AGENT, BUILDER AGENT. `loop`: the conditional edge after `image_check` lit, PASS to `build`, FAIL back to `images`, MAX 2 ROUNDS | nodes, loop | 4, 2 |
| fanout | chart-still | System-design chart, MAP-REDUCE: `lane2_build` sending one copy of `clip_build` per short with Send, 4 copies stacked, each with its 4 nodes. `send`: the Send arrows lit. `join`: the 4 copies meeting at `lane2_build_join`, which checks every short on disk | send, join | 4 |
| subgraph-code | card | Code from `batch_graph.py`, `build_clip_graph`: the 4 `add_node` lines and the 3 `add_conditional_edges` lines lit, the rest of the function dim | | 4, 3 |
| limits | chart-still | System-design chart, the `clip_build` runs side by side. `slots`: 4 SLOTS around plan, images and image_check, 2 SLOTS around build, and off to the side `max_concurrency`: ONE NUMBER PER RUN. `more`: 2 more boxes light, THE BROWSER LOCK and READ THE DISK FIRST | slots, more | 4, 2 |
| check | card | THE CHECK, 4 rows: THE REAL BATCH GRAPH, FAKE AGENTS, FAKE IMAGES, A FAKE LOCK (69 CHECKS, AROUND 15 S) · PASSED ON THE OLD CODE, A CHARACTERIZATION TEST · PASSED ON THE NEW GRAPH · 6 BREAKAGES, 6 CAUGHT, MUTATION TESTING. One row lit per state | setup, old, new, mutants | 69, 15, 6 |
| crash | chart-still | System-design chart, 2 shorts in one run: short 1 done, short 2 killed in its build. Then the resume: short 1 PENDING WRITES KEPT, NOT RUN AGAIN; short 2 picks up at BUILD | | 1, 2 |

## CH1 - THE PROMISE

💬 `[NOTE]` Start the recording on the full-camera scene. Switch to the screen share right after this line.
👤 `[FACE]` My last LangGraph video ended with a promise: the 4 steps that build each short would become real nodes. Now they are.

## CH2 - THE BEFORE

🗣️ `[COVER]` Here's the before. One node, lane2_build, took every short through 4 steps: plan, images, image check and build.
🎬 `[SHOW]` before.steps: a system-design chart, BEFORE. The batch graph's nodes in a row, lane2_build opened up, a thread pool taking each short through the 4 steps. The 4 steps are lit.
🗣️ `[COVER]` When the image check failed, a for loop sent it back. To LangGraph, all of it was one step, with one checkpoint.
🎬 `[SHOW]` before.loop: The for loop from IMAGE CHECK back to IMAGES lights, and ONE CHECKPOINT at the end of the node.

## CH3 - WHY NOT 4 NODES

💬 `[NOTE]` On screen: the deck slide Why Not 4 Nodes?
🖥️ `[SCREENSHARE]` The obvious fix is 4 nodes in the main graph, and that's the part that trips people up.
🗣️ `[COVER]` LangGraph runs in super-steps. Nodes that run in parallel share one super-step, and the next starts when they've all finished.
🎬 `[SHOW]` supersteps.rule: a system-design chart of super-steps, SUPER-STEP 1 and SUPER-STEP 2 side by side, the parallel nodes of the first both finishing before the second starts.
🗣️ `[COVER]` With 4 nodes, no short could start its images until every short finished planning. The slowest short holds up the rest, at every step.
🎬 `[SHOW]` supersteps.lockstep: 4 shorts in rows across the 4 steps. Short 3's plan runs long, and the other shorts wait at the line.

## CH4 - THE SUBGRAPH

🗣️ `[COVER]` The fix is a subgraph: a graph that's used as one node of another graph. Mine is clip_build, and its 4 nodes are the 4 steps.
🗣️ `[COVER]` The agents plan, check and build. And since my last video, the images node is plain code, not an agent.
🎬 `[SHOW]` subgraph.nodes: a system-design chart of the subgraph clip_build, START to END. The 4 nodes are lit, with who does each under it.
🗣️ `[COVER]` After lane2_build, Send starts one run per short. Send runs the same node once per item, each with its own input. That's map-reduce.
🗣️ `[COVER]` So a slow short holds up nobody.
🎬 `[SHOW]` fanout.send: a system-design chart, MAP-REDUCE. lane2_build sends one copy of clip_build per short, 4 copies stacked. The Send arrows are lit.
🗣️ `[COVER]` Then a new node, lane2_build_join, waits for every run and checks every short on disk.
🎬 `[SHOW]` fanout.join: The 4 copies meet at lane2_build_join, which lights.

## CH5 - THE LOOP IS AN EDGE

🗣️ `[COVER]` The retry is a conditional edge now. After image_check, a routing function reads the state: pass goes to build, fail goes back to images, 2 rounds at most.
🗣️ `[COVER]` That's the evaluator-optimizer loop: one agent checks, another fixes, and now it's in the graph.
🎬 `[SHOW]` subgraph.loop: The conditional edge after image_check lights: PASS to build, FAIL back to images, MAX 2 ROUNDS.
🗣️ `[COVER]` In code, that's 4 add_node calls and 3 conditional edges.
🎬 `[SHOW]` subgraph-code: code from batch_graph.py, the function build_clip_graph. The 4 add_node lines and the 3 add_conditional_edges lines are lit.

## CH6 - WHAT STAYS IN CODE

💬 `[NOTE]` On screen: the deck slide What Stays In Code.
🖥️ `[SCREENSHARE]` Not everything moved into the graph, and that's on purpose.
🗣️ `[COVER]` Up to 4 shorts work through the first 3 steps at once, but only 2 build, because rendering is heavy.
🗣️ `[COVER]` LangGraph's max_concurrency is one number for the whole run, so my 2 limits are semaphores: counters in code that let only so many threads through.
🎬 `[SHOW]` limits.slots: a system-design chart, the clip_build runs side by side, 4 SLOTS around the first 3 steps, 2 SLOTS around build, and max_concurrency, ONE NUMBER PER RUN, off to the side.
🗣️ `[COVER]` The lock on the ChatGPT browser stays in code too, and so does reading the disk first, so a re-run skips finished work.
🎬 `[SHOW]` limits.more: THE BROWSER LOCK and READ THE DISK FIRST light.

## CH7 - THE PROOF

🗣️ `[COVER]` Before I touched the code, I wrote a check: the real batch graph with fake agents, fake images and a fake lock. 69 checks, in around 15 seconds.
🎬 `[SHOW]` check.setup: the card THE CHECK, 4 rows. The first row is lit: the real batch graph with its fakes, 69 CHECKS, AROUND 15 S.
🗣️ `[COVER]` It passed on the old code first. That's a characterization test: it pins down what the code does before you change it.
🎬 `[SHOW]` check.old: The row PASSED ON THE OLD CODE lights.
🗣️ `[COVER]` Then it passed on the new graph.
🎬 `[SHOW]` check.new: The row PASSED ON THE NEW GRAPH lights.
🗣️ `[COVER]` When I broke the new graph on purpose, 6 ways, it caught every one. That's the idea behind mutation testing.
🎬 `[SHOW]` check.mutants: The row 6 BREAKAGES, 6 CAUGHT lights.
🗣️ `[COVER]` One case kills the run mid-build. On the resume, LangGraph keeps the pending writes of the shorts that finished, so only the killed one runs again, from its build.
🎬 `[SHOW]` crash: a system-design chart, 2 shorts in one run: short 1 done, short 2 killed in its build, then the resume.

## CH8 - THE CLOSE

💬 `[NOTE]` Switch to the full-camera scene for the next line, then back to the screen share for the last one.
👤 `[FACE]` It hasn't run on a real livestream yet. My next stream is its first real test.
💬 `[NOTE]` On screen: the deck slide The LangGraph Playlist, or your end screen.
🖥️ `[SCREENSHARE]` If you missed the other LangGraph videos, start with the playlist.

## NOTES

- **The promise it keeps.** langgraph-updates ended on "And after that, those 4 steps become real LangGraph nodes."
  This video is that "after that". It names no other video by title.
- **Never "it ran" or "it's faster".** It has not run on a real livestream, and the scheduling is the same as before,
  so the video claims no speed change (`RESEARCH.md`, section 5).
- **Not "4 nodes in the main graph".** The 4 nodes live in the subgraph; the batch graph gained 2 nodes
  (`clip_build` and `lane2_build_join`).
- **The images node is plain code.** The last video said an agent made the images; that changed the evening it was
  recorded, so CH4 says it in one clause.
- **Scenes:** 2 face scenes (the open and the close), 3 screen-share lines (CH3, CH6, CH8), everything else a card:
  6 system-design charts and 2 cards (the code and THE CHECK).
- **The deck for the screen-share lines:** 3 slides, Why Not 4 Nodes? (CH3), What Stays In Code (CH6), The LangGraph
  Playlist (CH8, the 3 earlier videos' titles).
- **Spoken names:** lane2_build is "lane 2 build", clip_build is "clip build", lane2_build_join is "lane 2 build join",
  image_check is "image check", max_concurrency is "max concurrency", add_node is "add node".
- **Terms** (`RESEARCH.md`, section 4): super-step, subgraph, Send, map-reduce, conditional edge, routing function,
  pending writes and max_concurrency are LangGraph's own words; semaphore, characterization test and mutation testing
  are standard computing terms; evaluator-optimizer is Anthropic's name for the pattern.
- **Recording:** a hotkey for each OBS scene (full camera, screen share). Switch in the pause between lines, never
  mid-word: the cue step fails a `[FACE]` line that is not on the full-camera scene.
