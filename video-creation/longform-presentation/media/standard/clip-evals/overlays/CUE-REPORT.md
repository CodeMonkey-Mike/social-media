# CUE-REPORT

_Written by `cue_script.py` from `SCRIPT.md` and `clip-evals EDIT2.enhanced.medium-words.json`. Regenerated on every run: fix the script or pass a flag, never edit this file. Times are FINAL-spine seconds._

`SCRIPT-CUE PASS lines=145 kept=116 changed=21 missing=8 adlibs=3 number_mismatches=1 runs=6`

Extras named in the script header: vertical cut ON, short off, YT post off.

## 1. Numbers he said differently from the script (read these first)

| script line | at | the script says | he said | the line as heard |
|---|---|---|---|---|
| 272 | 11:22.08 | 20, 6, 23, 9 | 9.20, 6.23 | And it gets stamped the moment the plan passes validation, never at the gate. On my last livestream, the plan was written at 9.20 at night, and I approved it at 6.23 the next morning. That's nine hours. |

A mismatch is a FLAG, not a failure: a card prints the sourced figure, the voice says the other one. Mike rules (re-record the line, or leave it); Whisper can also mishear a number, so listen at the timecode before raising it.

Numbers only left out or only added (not counted in the machine line; usually harmless, a dropped year or an extra figure):

| script line | at | in the script only | said only | the line as heard |
|---|---|---|---|---|
| 104 | 1:16.82 |  | 2 | A model only produces text. The harness runs the loop, hands it tools, carries out the two calls and returns the result. |
| 260 | 10:51.58 | 168, 20 |  | A one-time script joined them. Two of those were too old to match a kill to a clip, so they're on record but left out of every scope. |
| 283 | 12:02.24 | 4 |  | On the first live run, I named one, a topic that kept coming back through the stream, and coincidentally, even though it was a crypto livestream, I had continuously talked about |

## 2. Script lines he did not say

| script line | scene | the line |
|---|---|---|
| 242 | SCREENSHARE | An eval layer that can break production is worse than no eval layer. |
| 297 | COVER replay-prompt.answer-key | And don't open the evals folder. The answer key is in this repo, and the agent can read files. If it reads them, that's data leakage. |
| 299 | SCREENSHARE | But here's the thing. That last line is a request, and nothing proves the agent obeyed it. So a score that looks too good gets a second look. |
| 300 | COVER replay-code | The replay goes through the same spawner as a live run, so it gets the same retries and the same fallback. The plan it returns gets checked, stamped with the prompt version and saved. One replay costs one strategist run, around 8 to 13 minutes. |
| 340 | COVER pairing-code | Measuring that took a stricter comparison, by the way. Picks get paired one to one between the 2 runs, so an extra short cut can't hide inside the long clip it came from. |
| 342 | COVER noise-floor | So on a single livestream, a swing of around 17 points is noise. A prompt edit has to beat that before I believe it. |
| 343 | COVER noise-floor | Anthropic describes a metric for exactly this: the probability that all of your trials succeed. At 75 percent per run, 3 runs in a row come out around 42 percent. |
| 344 | COVER noise-floor | One run of an eval can't tell you much about an agent. |

A missing `[COVER]` line has no window, so that card (or state) never shows for it. Accepted with --allow-missing.

## 3. Lines he reworded

| script line | at | match | as scripted | as heard |
|---|---|---|---|---|
| 111 | 1:49.70 | 0.85 | LangChain splits this stack 3 ways: a framework, a runtime and a harness. | Lang chain splits this stack three ways. A framework, a runtime and a harness. |
| 129 | 2:56.02 | 0.82 | From that transcript the work fans out into 3 lanes. Lane 1 is the long-form video. | From that transcript, the work fans out into three lanes. Lane one is for a long form video. |
| 149 | 4:10.46 | 0.84 | 6 agents work inside this graph. 3 of them make judgment calls and hand back a plan, and 3 of them build or check things. | Six agents work inside this graph. Three of them make judgements calls and hand back a plan. And three of them build or check things. |
| 211 | 7:51.72 | 0.85 | So this graph was already grading its own work 3 ways. And they're the same 3 grader types Anthropic lists: code-based, model-based and human. | So this graph was already great in its own work three ways. And they're the same three greater types than Anthropic lists. Code-based, model-based, and human. |
| 218 | 8:32.20 | 0.82 | The fix has 3 parts. First, a record of every verdict. | the fix had three parts. First, a record of every verdict. |
| 247 | 9:58.16 | 0.82 | And if a line for that clip at that gate is already on record, it's skipped. So I can re-run a batch and nothing gets written twice. | And if a line for that clip at the gate is already on record, it's skipped. So I rerun the batch and nothing gets written twice. |
| 260 | 10:51.58 | 0.77 | A one-time script joined them into 168 lines covering 20 livestreams. 2 of those were too old to match a kill to a clip, so they're on record but left out of every score. | A one-time script joined them. Two of those were too old to match a kill to a clip, so they're on record but left out of every scope. |
| 283 | 12:02.24 | 0.55 | On the first live run I named one: a topic that kept coming back through the stream. It's stored as one miss with 4 stretches of time, so it counts once. | On the first live run, I named one, a topic that kept coming back through the stream, and coincidentally, even though it was a crypto livestream, I had continuously talked about |
| 291 | 12:50.74 | 0.83 | So when a plan validates, the harness also saves the 3 transcript files the strategist read. The batch folder gets cleaned up later, and the evals copy stays. Right now 5 livestreams can be replayed. | So when a plan validates, the harness also saves three transcript files the strategist run. The batch folder gets cleaned up later, and eval's copy stays. Right now, five livestreams can be replayed. |
| 311 | 13:50.74 | 0.84 | There's one complication. A topic can have 2 old clips on record: the full clip, and a short impact cut taken from inside it. So a new pick can overlap both. | There's one complication. A topic can have two clips on record, a full clip, and a shorter impact cut taken from inside it. So a new pic can overlap both. |
| 316 | 14:20.78 | 0.80 | Every new pick then lands in 1 of 4 buckets. It matches a clip I kept, and that's a hit. | Every new clip lands in one of four buckets. It matches a clip I kept, and that's a hit. |
| 324 | 14:41.78 | 0.77 | Precision is the good picks, over the good picks plus the repeated kills. | Precision is a good pic, so over the good pic plus the repeated kills. |
| 326 | 14:46.16 | 0.69 | And here's that logic in the scorer. 4 branches, 4 counters, and a detail row per pick, so I can read exactly why a replay scored what it scored. | And here's the logic in this score. Four branchers, four counters, and a detailed row pic, so I can read exactly why a replay scored what it scored. |
| 350 | 15:38.72 | 0.60 | Here's all of it on the dashboard. This page is read-only and it has no scoring logic of its own. One function in the evals module builds its data. | The page is read-only. It has no logic, no score and logic of its own. One function in the eval's model builds its data. |
| 352 | 15:53.98 | 0.82 | And under that, every replay of that livestream, pick by pick. | Under that, every replay of that live stream, pick by pick. |
| 355 | 16:10.38 | 0.75 | Split by model, the top model is at 84.1 percent. The livestreams where it ran out of quota and fell back are at 75. That's only 2 livestreams, so it's a lead, and now it's one I can test. | Split by model, the top model is 84.1%. The live streams were a round out of quarter and fell back, or at 75. That's only two live streams, so that's a lead. And now it's one that I can test. |
| 360 | 16:40.02 | 0.42 | So most of my kills aren't bad topics. They're a second version of a topic I already said yes to. That's a specific thing to fix in a prompt, and I'd never have seen it without the record. | That's a specific thing to fix in a prompt, and I had never seen it without the record. |
| 363 | 16:52.56 | 0.83 | And recall finally has a number. On the first livestream recorded live, I kept 7 and named 1 miss, so 87.5 percent. It's 1 livestream, and every stream from here on adds to it. | And recall finally has a number. On the first live stream recorded live, I kept seven and named one miss. So 87.5%. It's one live stream, and every stream from here adds to it. |
| 379 | 17:35.34 | 0.83 | If you run agents in production, find the spot where a human already says yes or no. That's a labeled dataset, and most pipelines throw it away. Start recording it. | If you run agents in production, find a spot where humans already say yes or no. That's a labeled data set, and most pipelines throw it away. So start recording it. |
| 380 | 17:45.58 | 0.36 | If you like this vid, make sure you give it a like. Comment below and let me know what you'd score in your own pipeline. | if you like this vid, give it a like, and if you like the channel, subscribe to the channel of course. AI |
| 381 | 18:18.72 | 0.78 | Hit subscribe, and I'm gonna catch you guys, later. | So subscribe, and I'm gonna catch you guys laters. |

## 4. Ad-libs (said, in no script line)

| after script line | from | to | on screen | what he said |
|---|---|---|---|---|
| 283 | 12:13.30 | 12:22.82 | stays on missed-option.stored | Anthropix IPO, and there was no clip created about that topic. And that's now stored as one miss with four stretches of time, so it counts once. |
| 338 | 15:36.80 | 15:38.34 | stays on noise-table.moved | So here's it all on a dashboard. |
| 380 | 17:51.16 | 18:17.76 | screen share, as filmed | engineering simplified. I've been producing a lot of vids just letting everybody know what I do, everything I got going. So if you wanna learn, just come here, comment below. I just love every minute of this. This one hell of a journey. So if you wanna learn, I got tons of playlists, like Python playlists and all this stuff, and now I got an eval's playlist of course. So I'm gonna keep on diving into all this stuff. |

## 5. Flags

None.

## 6. Cover runs (one clip each, built by `cover_runs.py`)

| run | from | to | length | cards in order |
|---|---|---|---|---|
| run-01 | 0:11.30 | 0:51.60 | 40.3 s | the-job (6.3 s) > last-video (17.2 s) > roadmap.harness (5.7 s) > roadmap.graph (3.9 s) > roadmap.evals (7.3 s) |
| run-02 | 1:03.32 | 2:37.22 | 93.9 s | agent-harness (21.9 s) > eval-harness (13.4 s) > harness-plus-model (10.8 s) > three-layers.all (6.4 s) > three-layers.runtime (8.6 s) > three-layers.blurry (5.4 s) > nested.claude-code (11.0 s) > nested.graph (9.3 s) > nested.evals (7.2 s) |
| run-03 | 2:46.68 | 4:42.60 | 115.9 s | pipeline.intake (9.1 s) > pipeline.lane-1 (6.5 s) > pipeline.lanes-2-3 (8.8 s) > pipeline.queues (6.7 s) > batch-graph.start (8.7 s) > batch-graph.lane-3 (6.2 s) > batch-graph.strategist (9.1 s) > batch-graph.gate-1 (7.7 s) > batch-graph.gate-2 (6.9 s) > batch-graph.build (5.6 s) > batch-graph.verify (8.2 s) > six-agents (13.6 s) > wiring-code.nodes (6.8 s) > wiring-code.router (12.0 s) |
| run-04 | 4:50.24 | 6:39.86 | 109.6 s | spawn-code.spawn (5.7 s) > spawn-code.retry (5.7 s) > spawn-code.fallback (8.3 s) > select-code.spawn (6.7 s) > select-code.artifact (12.6 s) > select-code.validate (6.9 s) > validator-code (17.5 s) > context-engineering (19.2 s) > rules-in-code.plan (7.4 s) > rules-in-code.files (6.9 s) > rules-in-code.fallback (5.2 s) > rules-in-code.done (7.7 s) |
| run-05 | 6:44.14 | 15:36.80 | 532.7 s | what-survives.nothing (15.7 s) > what-survives.checkpoints (12.7 s) > what-survives.files (13.5 s) > what-survives.docs (4.5 s) > gate-code.interrupt (5.0 s) > gate-code.exit (10.4 s) > gate-code.approve (5.4 s) > three-graders (24.8 s) > score-layer.lost (16.0 s) > score-layer.record (4.2 s) > score-layer.replay (5.3 s) > score-layer.score (7.4 s) > what-changed.added (12.7 s) > what-changed.changed (11.3 s) > kill-code (18.2 s) > record-call-code.call (6.4 s) > record-call-code.guard (9.4 s) > record-code.kept (7.3 s) > record-code.killed (3.5 s) > record-code.skip (8.2 s) > verdict-line.verdict (9.0 s) > verdict-line.segments (5.4 s) > verdict-line.version (4.1 s) > verdict-line.proposal (7.1 s) > record-guarantees (9.9 s) > backfill (17.0 s) > version-code.files (14.6 s) > version-code.template (5.4 s) > version-code.hash (3.1 s) > stamp-code (21.3 s) > precision-recall (12.7 s) > missed-option.command (6.1 s) > missed-option.stored (27.0 s) > saved-transcripts (34.2 s) > replay-prompt.shared (8.4 s) > replay-prompt.note (6.0 s) > match-rule.overlap (29.0 s) > match-rule.half (4.1 s) > match-rule.long-short (20.2 s) > match-code (9.8 s) > four-outcomes.kept (5.9 s) > four-outcomes.killed (4.9 s) > four-outcomes.missed (3.9 s) > four-outcomes.new (6.3 s) > four-outcomes.formula (4.4 s) > scorer-code (9.8 s) > scorer-tests (10.0 s) > noise-table.all (12.5 s) > noise-table.held (3.4 s) > noise-table.moved (15.3 s) |
| run-06 | 15:57.74 | 17:27.32 | 89.6 s | record-today (12.4 s) > by-model (12.9 s) > kills.pairs (10.5 s) > kills.rates (18.8 s) > recall (13.7 s) > not-yet.not-memory (7.2 s) > not-yet.feed-back (6.7 s) > not-yet.cheaper-model (7.5 s) |

## 7. Every line

| script line | scene | window in | window out | status | as heard |
|---|---|---|---|---|---|
| 85 | SCREENSHARE | 0.000 | 11.300 | KEPT | Every time I go live, an AI pipeline takes our livestream and converts it into short clips, right? 30 seconds, 60 seconds, 90 seconds, up to 8 per stream. |
| 86 | COVER the-job | 11.300 | 17.560 | KEPT | An agent reads the transcript and picks the moments. Then I watch every clip and I keep it or kill it. |
| 88 | COVER last-video | 17.560 | 28.080 | KEPT | In my last video on evals, I said those verdicts were going nowhere. The pipeline had no record of what I rejected, so it couldn't tell if the next run was any better than the last one. |
| 89 | COVER last-video | 28.080 | 34.760 | KEPT | I said the next layer was a data set and a score, so I built it. And I'm going to show you all of it |
| 91 | COVER roadmap.harness | 34.760 | 40.440 | KEPT | We're going to start with the harness, which is the code that surrounds the agents and holds them all with the rules. |
| 93 | COVER roadmap.graph | 40.440 | 44.320 | KEPT | Then the whole graph, every step and every agent in it. |
| 95 | COVER roadmap.evals | 44.320 | 51.600 | KEPT | Then the evals, how a verdict gets recorded, how an old livestream gets replayed, and how a prompt gets a score. |
| 97 | SCREENSHARE | 51.600 | 58.900 | KEPT | And we're going to do all of it at the code level. The Python, the JSON, what I added and what I changed. |
| 98 | SCREENSHARE | 58.900 | 63.320 | KEPT | And stay for the first thing the scores told me because it wasn't about the prompt at all. |
| 102 | COVER agent-harness | 63.320 | 68.380 | KEPT | So let's start with the word harness because people use it for two different things. |
| 103 | COVER agent-harness | 68.380 | 76.520 | KEPT | The first one is the agent harness. Anthropic defines it as the system that enables a model to act as an agent. |
| 104 | COVER agent-harness | 76.520 | 85.180 | KEPT | A model only produces text. The harness runs the loop, hands it tools, carries out the two calls and returns the result. |
| 106 | COVER eval-harness | 85.180 | 92.080 | KEPT | The second one is the evaluation harness. Same source, the infrastructure that runs the evals end to end. |
| 107 | COVER eval-harness | 92.080 | 98.580 | KEPT | It hands out the task, records every step, grades the output and adds up the results. |
| 109 | COVER harness-plus-model | 98.580 | 109.400 | KEPT | And here's why both belong in this video. When you evaluate an agent, you're never grading the model alone. You're grading the model and its harness working together. |
| 111 | COVER three-layers.all | 109.400 | 115.780 | CHANGED | Lang chain splits this stack three ways. A framework, a runtime and a harness. |
| 113 | COVER three-layers.runtime | 115.780 | 124.380 | KEPT | By their own labels, lang graph is the runtime. It gives you durable execution, persistence and human in a loop support. |
| 115 | COVER three-layers.blurry | 124.380 | 129.800 | KEPT | And they say outright that the lines are blurry, so don't get stuck on the labels. |
| 117 | COVER nested.claude-code | 129.800 | 140.780 | KEPT | Here's how those words map onto what I run. Every one of my agents runs inside Claude code and Claude code is an agent harness. It owns the loop and the tools. |
| 119 | COVER nested.graph | 140.780 | 150.040 | KEPT | Around the agents sits a lang graph graph. It decides the order, checks every output, stops for a human and retries what fails. |
| 121 | COVER nested.evals | 150.040 | 157.220 | KEPT | And right beside the graph sits the evaluation harness. That's the new part and it's where we're going to end up. |
| 123 | SCREENSHARE | 157.220 | 166.680 | KEPT | You'll hear people call all of this harness engineering. It's everything you build around the model so that the result doesn't depend on the model behaving. |
| 127 | COVER pipeline.intake | 166.680 | 175.800 | KEPT | Now, the system itself, a live stream comes in and the first step re-encodes it. It makes it a vertical version and transcribes it. |
| 129 | COVER pipeline.lane-1 | 175.800 | 182.320 | CHANGED | From that transcript, the work fans out into three lanes. Lane one is for a long form video. |
| 131 | COVER pipeline.lanes-2-3 | 182.320 | 191.080 | KEPT | Lane two is the vertical shorts and those are the clips. Lane three is text and images such as tweets, threads and posts. |
| 133 | COVER pipeline.queues | 191.080 | 197.760 | KEPT | Everything lands in queues and separate scripts post from those queues. Today, what we care about is lane two. |
| 135 | COVER batch-graph.start | 197.760 | 206.480 | KEPT | One lang graph graph owns all three lanes and it has 14 steps. It starts with the intake and then it registers the batch. |
| 137 | COVER batch-graph.lane-3 | 206.480 | 212.680 | KEPT | Lane three gets launched right away as its own process. So the posts are being draft while the clips are being made. |
| 139 | COVER batch-graph.strategist | 212.680 | 221.740 | KEPT | Then the clip strategist. That's the agent that reads the transcript and proposes the clips and it's the one we're going to evaluate. |
| 141 | COVER batch-graph.gate-1 | 221.740 | 229.400 | KEPT | The clips get out and the graph stops. That's the human in the loop gate. I watch raw cuts and I keep or kill each one. |
| 143 | COVER batch-graph.gate-2 | 229.400 | 236.280 | KEPT | The survivors get tightened, which means an agent plans which filler to remove. And then there's a second human gate. |
| 145 | COVER batch-graph.build | 236.280 | 241.920 | KEPT | After that, the graph finishes the clips, builds each short and publishes them to the queue. |
| 147 | COVER batch-graph.verify | 241.920 | 250.160 | KEPT | The last two steps wait for lane three and verify the whole batch. The graph refuses to report done while any lane is pending. |
| 149 | COVER six-agents | 250.160 | 258.560 | CHANGED | Six agents work inside this graph. Three of them make judgements calls and hand back a plan. And three of them build or check things. |
| 150 | COVER six-agents | 258.560 | 263.740 | KEPT | And each one sits on the model tier that matches how much judgment its job needs. |
| 152 | COVER wiring-code.nodes | 263.740 | 270.560 | KEPT | In code, the graph is short, 14 nodes, each one a plain Python function wired in a chain. |
| 154 | COVER wiring-code.router | 270.560 | 282.600 | KEPT | And every edge between two steps is a conditional edge. It has the same small routing function behind it. If a step reports failed, the next stop is the end. The run halts where it broke. |
| 159 | SCREENSHARE | 282.600 | 290.240 | KEPT | So how does a step use an agent? Well, it spawns one headless the same way you just run a command line tool. |
| 160 | COVER spawn-code.spawn | 290.240 | 295.900 | KEPT | The agent gets a prompt, does its work and everything prints streams into a log file. |
| 162 | COVER spawn-code.retry | 295.900 | 301.580 | KEPT | If the API comes back overloaded, the harness waits 60 seconds and retries it once. |
| 164 | COVER spawn-code.fallback | 301.580 | 309.840 | KEPT | And if the top model is out of quota, it retries the same agent once on the next model down. A run never stalls on a quota. |
| 166 | COVER select-code.spawn | 309.840 | 316.520 | KEPT | Here's a step that picks the clips. It spawns a strategist and then it doesn't trust a word of the reply. |
| 168 | COVER select-code.artifact | 316.520 | 329.080 | KEPT | What it trusts is the artifact. The plan has to exist on disk as a JSON file. And if the agent only answered in the chat, the harness pulls the JSON out of the text and writes the file itself. |
| 170 | COVER select-code.validate | 329.080 | 336.020 | KEPT | Then the file goes through a validator. It's the same validator the cutting step uses. So there's one source of truth. |
| 172 | COVER validator-code | 336.020 | 348.280 | KEPT | The validator isn't smart and that's the point. Every clip needs an ID, a title and a list of segments. Every segment has to end after it starts. And nothing can run past the end of the recording. |
| 173 | COVER validator-code | 348.280 | 353.500 | KEPT | If the plan fails, the run stops right there before a single frame gets cut. |
| 178 | COVER context-engineering | 353.500 | 364.520 | KEPT | There's a name for deciding what the model sees. Context engineering. Anthropi calls it the art and science of curating what will go into the limited context window. |
| 179 | COVER context-engineering | 364.520 | 372.720 | KEPT | That work matters and it's one part of a harness. But a rule that only lives in the context is a request. The model can miss it. |
| 181 | COVER rules-in-code.plan | 372.720 | 380.080 | KEPT | So every rule that has to hold goes into the code. The shape of a clip plan lives in the validator. |
| 183 | COVER rules-in-code.files | 380.080 | 387.000 | KEPT | Where files are allowed to go lives a hook. It runs at the end of every turn and again before every commit. |
| 185 | COVER rules-in-code.fallback | 387.000 | 392.180 | KEPT | The model fallback lives in the spawner. And there's a script that proves every spawner has it. |
| 187 | COVER rules-in-code.done | 392.180 | 399.860 | KEPT | And done isn't something an agent gets to claim. The last step of the graph checks the disk and the queues for itself. |
| 189 | SCREENSHARE | 399.860 | 404.140 | KEPT | The prompt explains the job. The code enforces the rules. |
| 193 | COVER what-survives.nothing | 404.140 | 412.140 | KEPT | Next is memory. And this is the part that trips people up. My agents don't remember anything. Every run starts fresh. |
| 194 | COVER what-survives.nothing | 412.140 | 419.820 | KEPT | Anthropic described the same problem for long running agents. Each new session begins with no memory of what came before. |
| 196 | COVER what-survives.checkpoints | 419.820 | 432.480 | KEPT | So the harness holds the state. The graph checkpoints every step into SQLite. One thread per batch. So a run can stop and pick up later. |
| 198 | COVER what-survives.files | 432.480 | 446.020 | KEPT | The work itself lives in files. The clip plan and a progress file are the contract between the steps. And every step checks the disk before it does anything. We run a batch and it skips whatever's already done. |
| 200 | COVER what-survives.docs | 446.020 | 450.540 | KEPT | And the knowledge lives in docs that the agents read at the start of every run. |
| 202 | COVER gate-code.interrupt | 450.540 | 455.560 | KEPT | That's what makes a human gate possible. In code, the gate is a LandGraph interrupt. |
| 204 | COVER gate-code.exit | 455.560 | 466.000 | KEPT | The run exits with code 2, prints the exact command to resume, and hands the machine the next job. I can come back five minutes later or the next morning. |
| 206 | COVER gate-code.approve | 466.000 | 471.420 | KEPT | When I approve, that same step runs again. Applies my kills and moves on. |
| 211 | COVER three-graders | 471.420 | 482.300 | CHANGED | So this graph was already great in its own work three ways. And they're the same three greater types than Anthropic lists. Code-based, model-based, and human. |
| 212 | COVER three-graders | 482.300 | 490.220 | KEPT | The valid editors are code. The visual QA agent is a model judging another model's images. And the two gates are me. |
| 213 | COVER three-graders | 490.220 | 496.240 | KEPT | When every one of them judges a single run, nothing compared this week's strategists to last week's. |
| 215 | COVER score-layer.lost | 496.240 | 506.040 | KEPT | And my verdicts were being thrown away. Those are human labels, the best signal in the whole system. A killed clip kept its number and its name, and that was all. |
| 216 | COVER score-layer.lost | 506.040 | 512.200 | KEPT | So when I changed the strategist's prompt, I had no way to know if it got better. I was just guessing. |
| 218 | COVER score-layer.record | 512.200 | 516.400 | CHANGED | the fix had three parts. First, a record of every verdict. |
| 220 | COVER score-layer.replay | 516.400 | 521.700 | KEPT | Second, a way to replay an old livestream through the strategist the way it's written today. |
| 222 | COVER score-layer.score | 521.700 | 529.100 | KEPT | And third, a score that compares the new pics to my old verdicts. Put that together, that's an evaluation harness. |
| 227 | COVER what-changed.added | 529.100 | 541.760 | KEPT | Here's the whole change on one screen. Most of the work is new code that sits outside of the graph. One module of around 1,000 lines, its tests, a one-time backfill script, and a dashboard page. |
| 229 | COVER what-changed.changed | 541.760 | 548.880 | KEPT | Inside the graph, the change is small on purpose. 86 lines added to the graph and 16 to the command that drives it. |
| 230 | COVER what-changed.changed | 548.880 | 553.060 | KEPT | An eval layer should watch production. It shouldn't be woven through it. |
| 235 | COVER kill-code | 553.060 | 560.800 | KEPT | Let's follow one verdict through the code, starting at the gate. This function applies my skills, and it changed by one line. |
| 236 | COVER kill-code | 560.800 | 571.240 | KEPT | A killed clip used to leave the plan with just its ID and its slug. Now the whole proposal goes with it, the segments, the title, and a strategist's reasoning. |
| 238 | COVER record-call-code.call | 571.240 | 577.660 | KEPT | Then the gate records its approval the way it always did and makes one new call into the evals module. |
| 240 | COVER record-call-code.guard | 577.660 | 587.020 | KEPT | Look at how the call is wrapped. If the record can't be written, the batch keeps going, the failure prints loudly, and the repair command prints with it. |
| 242 | SCREENSHARE | | | MISSING | (An eval layer that can break production is worse than no eval layer.) |
| 243 | COVER record-code.kept | 587.020 | 594.360 | KEPT | And this is the function that writes the record. Every clip still in the plan at this gate gets a line that says kept. |
| 245 | COVER record-code.killed | 594.360 | 597.880 | KEPT | Every clip I deleted at this gate gets a line that says killed. |
| 247 | COVER record-code.skip | 597.880 | 606.080 | CHANGED | And if a line for that clip at the gate is already on record, it's skipped. So I rerun the batch and nothing gets written twice. |
| 249 | COVER verdict-line.verdict | 606.080 | 615.100 | KEPT | Here's one real line. The format is JSON, one object per line. It starts with the batch, the clip, the gate, and the verdict. |
| 251 | COVER verdict-line.segments | 615.100 | 620.520 | KEPT | The segments are the exact seconds of the recording, and they're what makes scoring possible later. |
| 253 | COVER verdict-line.version | 620.520 | 624.620 | KEPT | The prompt version and the model say which strategist made the pick. |
| 255 | COVER verdict-line.proposal | 624.620 | 631.700 | KEPT | And the proposal is the full clip exactly as the agent wrote it, so I can go back and see what kind of clip I reject. |
| 257 | COVER record-guarantees | 631.700 | 641.640 | KEPT | The file is append only. Nothing in the code ever rewrites a line. It's committed to git, and the cleanup tool that recycles old batches refuses to touch that folder. |
| 259 | COVER backfill | 641.640 | 651.280 | KEPT | I didn't start from zero either. The old verdicts were still sitting in two places. The strategist's logs had every plan, and the checkpoint database had every kill. |
| 260 | COVER backfill | 651.280 | 658.680 | CHANGED | A one-time script joined them. Two of those were too old to match a kill to a clip, so they're on record but left out of every scope. |
| 265 | COVER version-code.files | 658.680 | 667.180 | KEPT | Now, which strategist made the pick? A score per prompt change needs a definition of a prompt change. So the version is a hash of four things. |
| 266 | COVER version-code.files | 667.180 | 673.320 | KEPT | Three of them are files. The agent's own definition and the two skill docs it reads before it picks. |
| 268 | COVER version-code.template | 673.320 | 678.680 | KEPT | The last one is the instruction text the graph sends with the file pass blanked out. |
| 270 | COVER version-code.hash | 678.680 | 681.800 | KEPT | Change any one of those and you get a new 12-character version. |
| 272 | COVER stamp-code | 681.800 | 694.880 | KEPT | And it gets stamped the moment the plan passes validation, never at the gate. On my last livestream, the plan was written at 9.20 at night, and I approved it at 6.23 the next morning. That's nine hours. |
| 273 | COVER stamp-code | 694.880 | 703.140 | KEPT | Say I edited the prompt during those nine hours, a stamp at the gate would read the new prompt and give it the credit for the clips the old prompt picked. |
| 278 | COVER precision-recall | 703.140 | 708.080 | KEPT | That record gives me precision. Of the clips it proposed, how many did I keep? |
| 279 | COVER precision-recall | 708.080 | 715.880 | KEPT | It can't give me recall because the gate only sees what was proposed. It never sees the great moment the strategist walked right past. |
| 281 | COVER missed-option.command | 715.880 | 721.940 | KEPT | So the approval command takes one more option. When I approve the gate, I can name what it missed. |
| 283 | COVER missed-option.stored | 721.940 | 742.820 | CHANGED | On the first live run, I named one, a topic that kept coming back through the stream, and coincidentally, even though it was a crypto livestream, I had continuously talked about |
| 284 | COVER missed-option.stored | 742.820 | 748.940 | KEPT | And when nothing was missed, I would say that too. No answer and nothing missed aren't the same data. |
| 289 | COVER saved-transcripts | 748.940 | 757.360 | KEPT | The record alone only scores the past. To score prompt change, I need a strategist to pick again from a livestream that I've already judged. |
| 290 | COVER saved-transcripts | 757.360 | 770.440 | KEPT | I call that a replay. It's the same transcript with today's prompt, and all that comes back is a new list of proposed clips. Nothing gets cut and nothing gets posted. In eval terms, that's an offline evaluation. |
| 291 | COVER saved-transcripts | 770.440 | 783.100 | CHANGED | So when a plan validates, the harness also saves three transcript files the strategist run. The batch folder gets cleaned up later, and eval's copy stays. Right now, five livestreams can be replayed. |
| 293 | COVER replay-prompt.shared | 783.100 | 791.460 | KEPT | A replay sends the exact same instructions a live run sends. I pulled that text into one function, so the two can't drift apart. |
| 295 | COVER replay-prompt.note | 791.460 | 797.420 | KEPT | Then it adds a note. This is a production, nothing gets cut, and work only from these transcript files. |
| 297 | COVER replay-prompt.answer-key | | | MISSING | (And don't open the evals folder. The answer key is in this repo, and the agent can read files. If it reads them, that's data leakage.) |
| 299 | SCREENSHARE | | | MISSING | (But here's the thing. That last line is a request, and nothing proves the agent obeyed it. So a score that looks too good gets a second look.) |
| 300 | COVER replay-code | | | MISSING | (The replay goes through the same spawner as a live run, so it gets the same retries and the same fallback. The plan it returns gets checked, stamped with the prompt version and saved. One replay costs one strategist run, around 8 to 13 minutes.) |
| 305 | COVER match-rule.overlap | 797.420 | 809.180 | KEPT | Now the hard part. Score in a replay. A replay hands me a list of clips, and I already have a verdict on every clip in the old list. So for every new clip, the code has to find the old clip and matches, |
| 306 | COVER match-rule.overlap | 809.180 | 819.180 | KEPT | and the two lists never line up exactly. The new prompt might start a clip five seconds later, or let it run a little longer. So I need a rule for when the two clips are the same. |
| 307 | COVER match-rule.overlap | 819.180 | 826.380 | KEPT | Every clip is stored as start and end times in the recording. So the code counts how many seconds of the recording two clips share. |
| 309 | COVER match-rule.half | 826.380 | 830.440 | KEPT | If the overlap is at least 50% of the shorter clip, that's a match. |
| 311 | COVER match-rule.long-short | 830.440 | 840.960 | CHANGED | There's one complication. A topic can have two clips on record, a full clip, and a shorter impact cut taken from inside it. So a new pic can overlap both. |
| 312 | COVER match-rule.long-short | 840.960 | 850.640 | KEPT | In that case, it gets matched to a closer fit, and the measure is intersection over union, the seconds they share, divided by the seconds of the two clips together. |
| 314 | COVER match-code | 850.640 | 860.480 | KEPT | In code, that's two small functions. One returns a shared portion and the intersection over union. The other walks the judged clips and keeps the best candidate above the threshold. |
| 316 | COVER four-outcomes.kept | 860.480 | 866.380 | CHANGED | Every new clip lands in one of four buckets. It matches a clip I kept, and that's a hit. |
| 318 | COVER four-outcomes.killed | 866.380 | 871.280 | KEPT | It matches a clip I killed, so the new prompt repeated the choice already rejected. |
| 320 | COVER four-outcomes.missed | 871.280 | 875.140 | KEPT | It lands on a moment I said was missed, and that counts in its favor. |
| 322 | COVER four-outcomes.new | 875.140 | 881.480 | KEPT | Or it's new, with no verdict at all. That pic is neither right or wrong, so it stays out of the score. |
| 324 | COVER four-outcomes.formula | 881.480 | 885.860 | CHANGED | Precision is a good pic, so over the good pic plus the repeated kills. |
| 326 | COVER scorer-code | 885.860 | 895.640 | CHANGED | And here's the logic in this score. Four branchers, four counters, and a detailed row pic, so I can read exactly why a replay scored what it scored. |
| 328 | COVER scorer-tests | 895.640 | 905.680 | KEPT | The score has its own test. 70 checks on made up clips. If the matching math is wrong, every score that follows is wrong, and nothing would tell you. |
| 333 | COVER noise-table.all | 905.680 | 918.140 | KEPT | So now I had a score, and before I touched any prompt, I ran the same prompt on four live streams. A score means nothing until you know how much it moves all by itself. That's a run-to-run variance. |
| 335 | COVER noise-table.held | 918.140 | 921.500 | KEPT | On two of them, both runs scored the same. |
| 337 | COVER noise-table.moved | 921.500 | 930.100 | KEPT | On the other two, the first run scored 100% and the second scored 83.3. Same prompt, same transcript, same model. |
| 338 | COVER noise-table.moved | 930.100 | 936.800 | KEPT | And the moments it picked were almost identical. The difference was one impact cut, and it happened to be one I had killed. |
| 340 | COVER pairing-code | | | MISSING | (Measuring that took a stricter comparison, by the way. Picks get paired one to one between the 2 runs, so an extra short cut can't hide inside the long clip it came from.) |
| 342 | COVER noise-floor | | | MISSING | (So on a single livestream, a swing of around 17 points is noise. A prompt edit has to beat that before I believe it.) |
| 343 | COVER noise-floor | | | MISSING | (Anthropic describes a metric for exactly this: the probability that all of your trials succeed. At 75 percent per run, 3 runs in a row come out around 42 percent.) |
| 344 | COVER noise-floor | | | MISSING | (One run of an eval can't tell you much about an agent.) |
| 350 | SCREENSHARE | 936.800 | 945.420 | CHANGED (pinned) | The page is read-only. It has no logic, no score and logic of its own. One function in the eval's model builds its data. |
| 351 | SCREENSHARE | 945.420 | 953.760 | KEPT | Every live stream in a row, when I open one, I get every clip, the vertigo at each gate, and the strategist's own reasoning for proposing it. |
| 352 | SCREENSHARE | 953.760 | 957.740 | CHANGED | Under that, every replay of that live stream, pick by pick. |
| 353 | COVER record-today | 957.740 | 970.120 | KEPT | So what's in the record? 184 lines covering 21 live streams, 98 clips judged, 81 kept, and 17 killed. That's 82.7% precision. |
| 355 | COVER by-model | 970.120 | 982.980 | CHANGED | Split by model, the top model is 84.1%. The live streams were a round out of quarter and fell back, or at 75. That's only two live streams, so that's a lead. And now it's one that I can test. |
| 357 | COVER kills.pairs | 982.980 | 993.460 | KEPT | And here's the finding I didn't expect. Of the 17 kills, 11 were one half of a pair, a full clip and its impact cut, while I kept the other half. |
| 359 | COVER kills.rates | 993.460 | 999.720 | KEPT | full clips get 88.3% of the time, impact cuts get 61.9% of the time. |
| 360 | COVER kills.rates | 999.720 | 1004.640 | CHANGED | That's a specific thing to fix in a prompt, and I had never seen it without the record. |
| 361 | COVER kills.rates | 1004.640 | 1012.260 | KEPT | And from here, I can attach a reason to kill, in a few words. The pattern tells me where to look, and the reason tells me what to change. |
| 363 | COVER recall | 1012.260 | 1025.940 | CHANGED | And recall finally has a number. On the first live stream recorded live, I kept seven and named one miss. So 87.5%. It's one live stream, and every stream from here adds to it. |
| 368 | COVER not-yet.not-memory | 1025.940 | 1033.120 | KEPT | One thing this record isn't, memory. The strategist never sees it. It's a measurement, and it's for me. |
| 370 | COVER not-yet.feed-back | 1033.120 | 1039.860 | KEPT | It turns into memory the day I feed kept and killed examples back into the prompt. And now I can measure if that helps. |
| 372 | COVER not-yet.cheaper-model | 1039.860 | 1047.320 | KEPT | The same goes for the model. Can a cheaper one pick as well? That used to be an opinion. Now it's a replay. |
| 378 | SCREENSHARE | 1047.320 | 1055.040 | KEPT | So that's the setup, an agent harness that holds the model to its rules, and an evaluation harness that lets you know if it's getting any better. |
| 379 | SCREENSHARE | 1055.040 | 1065.580 | CHANGED | If you run agents in production, find a spot where humans already say yes or no. That's a labeled data set, and most pipelines throw it away. So start recording it. |
| 380 | SCREENSHARE | 1065.580 | 1098.420 | CHANGED | if you like this vid, give it a like, and if you like the channel, subscribe to the channel of course. AI |
| 381 | SCREENSHARE | 1098.420 | 1101.533 | CHANGED | So subscribe, and I'm gonna catch you guys laters. |
