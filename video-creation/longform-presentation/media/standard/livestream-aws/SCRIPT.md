# livestream-aws: SCRIPT

_The scripted standard video (`video-creation/longform-presentation/skills/script/script.md`) that follows the two
LangGraph videos (clip-evals, langgraph-updates): the same livestream graph, set up as a production system on AWS. A
hypothetical, said as one ("I'd"). AI Engineering Simplified. Every number and every AWS name comes from `RESEARCH.md`
in this folder. Every AWS term is introduced the first time it is said: what I do today, then the AWS service that would
do it, in one plain sentence (Mike, 2026-11-24). Target: around 4 minutes._

| Setting | Value |
|---|---|
| project | livestream-aws |
| channel | AI Engineering Simplified |
| silence | 800 ms min-silence, 300 ms left between sentences (the track preset) |
| enhance speech | on |
| vertical | on |
| short | on |
| yt post | on |
| music | a drone bed under the whole video, `sacral-i-feel-417-hz` (NOTES, "Music") |

## PRODUCTION CONVENTIONS

The same tags as a long-form edited screenplay. This track uses 5 of them.

| Tag | Means |
|---|---|
| 🖥️ `[SCREENSHARE]` | spoken, on the screen share as filmed: the deck slide named in the note above it, with your webcam. Say it to the camera |
| 🗣️ `[COVER]` | spoken, while a card fills the whole frame. Your webcam is hidden, so you can read the line |
| 👤 `[FACE]` | spoken to the lens, on your full-camera OBS scene: switch to it before the line, back after it. The video centres your face. 2 face scenes in this video, the first line and the takeaway |
| 🎬 `[SHOW]` | what is on screen for the `[COVER]` lines above it. It starts with the card's name from the CARDS table; a dot and a second word, as in `aws-map.graph`, is the same card with a different part lit. Not spoken |
| 💬 `[NOTE]` | a note to you. Not spoken |

## CARDS

Every AWS box on a card carries its plain one-line description under its name (S3: FILE STORAGE, Lambda: CODE THAT
RUNS WHEN CALLED), and every chart that swaps a piece shows TODAY beside ON AWS.

| id | kind | shows | states | numbers |
|---|---|---|---|---|
| today-pc | chart-still | System-design chart, one box labelled ONE PC with everything inside it: the LangGraph graph and its SQLite checkpoints, 7 agents in Claude Code, 1 browser making the images, Whisper on the GPU, the Remotion renders, the posting scripts | | 7, 1 |
| aws-map | chart-still | System-design chart, IF IT RAN ON AWS: 5 layers left to right, each AWS box with its one-line description. INGEST (S3, EventBridge, Lambda, MediaConvert, Rekognition, Transcribe), THE GRAPH (AgentCore Runtime, DynamoDB, SNS), THE AGENTS (Bedrock, Claude Agent SDK, Gateway, Identity, IAM), THE HEAVY WORK (AWS Batch on EC2 Spot, Remotion Lambda, Stable Image Core on Bedrock), PUBLISHING (DynamoDB, EventBridge Scheduler, Lambda, AgentCore Browser). `all` lights every layer; each other state lights one layer and dims the rest | all, ingest, graph, agents, compute, publish | 5 |
| ingest | chart-still | System-design chart, TODAY beside ON AWS. `trigger`: a folder on my PC -> S3 (FILE STORAGE) -> EventBridge (EVENT ROUTER) -> Lambda (CODE THAT RUNS WHEN CALLED) -> the graph. `convert`: ffmpeg -> MediaConvert (VIDEO CONVERTER). `face`: my face tracker -> Rekognition (IMAGE AND VIDEO ANALYSIS). `words`: Whisper -> Transcribe (SPEECH TO TEXT), a timestamp on every word, the custom vocabulary with TAO in it | trigger, convert, face, words | |
| graph-home | chart-still | System-design chart. `runtime`: TODAY a Python process on my PC, ON AWS an AgentCore Runtime box (HOSTING FOR AGENTS), a microVM (A SMALL, ISOLATED VIRTUAL MACHINE), up to 8 hours, around the graph's 14 nodes, and CPU BILLED AT ZERO WHILE IT WAITS. `checkpoint`: TODAY a SQLite file, ON AWS DynamoDB (MANAGED DATABASE), through `langgraph-checkpoint-aws` | runtime, checkpoint | 8, 14 |
| gate | chart-still | System-design chart of a human gate, the label 9 HOURS ON RECORD, 8-HOUR SESSION on top. `wait`: interrupt -> the state saved to DynamoDB -> the session ends -> SNS (NOTIFICATIONS) -> an email to me. `resume`: I approve on the dashboard -> Lambda -> the graph resumes, same thread -> a new Runtime session | wait, resume | 9, 8 |
| agents | chart-still | System-design chart. `models`: TODAY Claude Code -> Anthropic, ON AWS Claude Code -> Bedrock (AI MODELS AS A SERVICE) with Fable, Opus, Sonnet; the setting `CLAUDE_CODE_USE_BEDROCK`; each agent in its own Runtime session through the Claude Agent SDK (CLAUDE CODE AS A LIBRARY). `tools`: AgentCore Gateway (MY APIS AS MCP TOOLS) and AgentCore Identity (A VAULT FOR KEYS AND TOKENS). `role`: an IAM role per agent (WHO CAN CALL WHAT), the builder's role allowing only the Claude models, the image model crossed out | models, tools, role | 3 |
| images | chart-still | System-design chart. `before`: 7 shorts in a line, 1 lock, 1 browser, 3.9 H OF A 4 H 38 MIN BUILD. `after`: the 7 shorts side by side, each calling Stable Image Core on Bedrock, no browser, no lock, 41 IMAGES x 4 CENTS = 1.64 DOLLARS | before, after | 7, 1, 3.9, 4, 38, 41, 1.64 |
| ec2-answer | card | DOES IT RUN ON EC2? (EC2: AMAZON'S VIRTUAL SERVERS) 4 rows: THE GRAPH, AgentCore Runtime. THE MODELS, Bedrock. THE HEAVY MEDIA, EC2 Spot through AWS Batch (A JOB QUEUE THAT STARTS SERVERS WHEN WORK ARRIVES). THE RENDERS, Remotion Lambda | | |
| batch-spot | chart-still | System-design chart: an AWS Batch job queue -> EC2 Spot instances (SPARE CAPACITY, UP TO 90% OFF) -> the ffmpeg jobs, every step reading S3 first. `reclaim`: one instance taken back, 2-MINUTE WARNING, its job retried, the steps already done skipped. `gpu`: TODAY Whisper on my GPU, ON AWS a G6 instance (AN EC2 SERVER WITH AN NVIDIA L4) | reclaim, gpu | 90, 2 |
| render-fanout | chart-still | System-design chart: TODAY Remotion on my PC in 1-minute chunks; ON AWS one render -> Remotion Lambda -> up to 200 Lambda functions side by side, AT LEAST 20 FRAMES EACH -> stitched -> S3; under it, Remotion's example: 10-MINUTE HD VIDEO, AROUND 10 CENTS, and EACH RENDER INSIDE 15 MINUTES | | 1, 200, 20, 10, 15 |
| publish | chart-still | System-design chart. `schedule`: TODAY JSON queue files, ON AWS a DynamoDB table of posts -> a one-time EventBridge Scheduler schedule per post (AN ALARM CLOCK FOR CODE) -> Lambda. `browser`: YouTube and X through their APIs, and the platforms with no posting API through AgentCore Browser (A CHROME AWS RUNS FOR MY AGENTS), the login kept between runs | schedule, browser | |
| watch | chart-still | System-design chart: TODAY log files on my PC, ON AWS every agent run traced into CloudWatch (MONITORING), with the 3 readings LATENCY, TOKEN USAGE, ERRORS per session | | 3 |
| bill | card | THE MEDIA BILL, ONE 63-MINUTE LIVESTREAM: the transcript 38 CENTS, 41 images 1.64 DOLLARS, the renders A FEW PENNIES; under it BEFORE THE MODEL TOKENS and LIST PRICES, NOV 2026 | | 63, 38, 41, 1.64 |
| same-graph | card | THE GRAPH BARELY CHANGES. Under it, WHAT CHANGES: where the state lives, who holds the keys, what runs in parallel | | |

## CH1 - THE OPEN

💬 `[NOTE]` Start the recording on the full-camera scene. Switch to the screen share right after this line.
👤 `[FACE]` My livestream pipeline runs on one PC. Here's how I'd run the same LangGraph on AWS, Amazon's cloud, as a real production system.
🗣️ `[COVER]` Today, everything lives in one box: the graph and its checkpoints, 7 agents in Claude Code, one browser for the images, Whisper on my GPU, the renders and the posting scripts.
🎬 `[SHOW]` today-pc: a system-design chart, one box labelled ONE PC with every piece of the pipeline inside it.
🗣️ `[COVER]` For every piece, I'll show you what I do today and the AWS service that would do it, in 5 layers: ingest, the graph, the agents, the heavy work, and publishing.
🎬 `[SHOW]` aws-map.all: a system-design chart, IF IT RAN ON AWS, its 5 layers left to right, all lit, each AWS box with its one-line description.
💬 `[NOTE]` On screen: the deck slide Does It Run On EC2?
🖥️ `[SCREENSHARE]` And I'll answer the question everyone asks first: does any of this run on EC2, Amazon's virtual servers?

## CH2 - INGEST

🗣️ `[COVER]` Layer 1, ingest. Today the recording sits in a folder on my PC. On AWS, it goes to S3, Amazon's file storage.
🎬 `[SHOW]` aws-map.ingest: The INGEST layer lights, the rest dims.
🗣️ `[COVER]` S3 can announce every new file to EventBridge, Amazon's event router. EventBridge calls a Lambda function, a small piece of code AWS runs only when something calls it, and that starts the graph.
🎬 `[SHOW]` ingest.trigger: a system-design chart, TODAY beside ON AWS. The chain S3, EventBridge, Lambda, the graph is lit.
🗣️ `[COVER]` Today, ffmpeg makes the low-bitrate master. On AWS, that's MediaConvert, Amazon's video converter.
🎬 `[SHOW]` ingest.convert: ffmpeg beside MediaConvert lights.
🗣️ `[COVER]` My face tracker makes the vertical crop. On AWS, Rekognition, Amazon's image and video analysis service, finds my face in the video.
🎬 `[SHOW]` ingest.face: my face tracker beside Rekognition lights.
🗣️ `[COVER]` And Whisper writes the transcript. On AWS, that's Transcribe, Amazon's speech to text. It gives a timestamp on every word, and the words Whisper keeps getting wrong, like TAO, go into its custom vocabulary.
🎬 `[SHOW]` ingest.words: Whisper beside Transcribe lights, with the timestamp on every word and the custom vocabulary.

## CH3 - WHERE THE GRAPH RUNS

🗣️ `[COVER]` Layer 2, the graph. Today it's a Python process on my PC. On AWS, it runs on AgentCore Runtime, Amazon's hosting for agents.
🎬 `[SHOW]` aws-map.graph: The GRAPH layer lights, the rest dims.
🗣️ `[COVER]` Each run gets its own microVM, a small, isolated virtual machine, for up to 8 hours. It bills by the second, and the CPU charge drops to zero while it waits on a model.
🎬 `[SHOW]` graph-home.runtime: a system-design chart, TODAY a Python process, ON AWS the AgentCore Runtime microVM around the graph's 14 nodes. CPU BILLED AT ZERO WHILE IT WAITS is lit.
🗣️ `[COVER]` The checkpoints move too. Today they're in a SQLite file. On AWS, they go to DynamoDB, Amazon's managed database, through a LangGraph package called langgraph-checkpoint-aws.
🎬 `[SHOW]` graph-home.checkpoint: The checkpoint swap lights: TODAY a SQLite file, ON AWS DynamoDB.
💬 `[NOTE]` On screen: the deck slide The Gate.
🖥️ `[SCREENSHARE]` Now the human gates. My first gate once waited 9 hours for me. A session lasts 8.
🗣️ `[COVER]` So at the gate, the graph saves its state to DynamoDB and the session ends. SNS, Amazon's notification service, sends me an email.
🎬 `[SHOW]` gate.wait: a system-design chart of a human gate, 9 HOURS ON RECORD, 8-HOUR SESSION on top. The wait path is lit: interrupt, DynamoDB, the session ends, SNS, the email.
🗣️ `[COVER]` I approve on the dashboard, and a Lambda function resumes the graph on the same thread, in a new session.
🎬 `[SHOW]` gate.resume: The resume path lights: the dashboard, Lambda, the same thread, a new session.

## CH4 - THE AGENTS

🗣️ `[COVER]` Layer 3, the agents. Today Claude Code calls Anthropic directly. On AWS, it calls Bedrock, Amazon's service for running AI models, and Fable, Opus and Sonnet are all on it.
🎬 `[SHOW]` aws-map.agents: The AGENTS layer lights, the rest dims.
🗣️ `[COVER]` It's one setting, CLAUDE_CODE_USE_BEDROCK. And each agent runs through the Claude Agent SDK, which is Claude Code as a library, in its own Runtime session.
🎬 `[SHOW]` agents.models: a system-design chart, TODAY Claude Code to Anthropic, ON AWS Claude Code to Bedrock with the 3 model families. The setting and the Agent SDK are lit.
🗣️ `[COVER]` Their tools go behind AgentCore Gateway, which turns my APIs and functions into MCP tools, the open standard agents use to call tools.
🗣️ `[COVER]` And the logins go in AgentCore Identity, a vault for the agents' keys and tokens.
🎬 `[SHOW]` agents.tools: Gateway with the MCP tools and the Identity vault light.
🗣️ `[COVER]` Each agent also gets an IAM role. IAM is how AWS decides who can call what, and a role lists exactly what one agent is allowed to call.
🗣️ `[COVER]` Today, the builder doesn't make images, but nothing stops it. On AWS, its role only allows the Claude models, so it can't.
🎬 `[SHOW]` agents.role: An IAM role per agent lights; the builder's role allows only the Claude models, the image model crossed out.

## CH5 - THE IMAGES

🗣️ `[COVER]` Now the bottleneck from my last video: one browser making the images, busy for 3.9 hours of a 4 hour 38 minute build.
🎬 `[SHOW]` images.before: a system-design chart, 7 shorts in a line, 1 lock, 1 browser. The before is lit.
🗣️ `[COVER]` On AWS, I'd drop the browser and call an image model on Bedrock. Stable Image Core, from Stability AI, is 4 cents an image, so that run's 41 images come to 1.64 dollars.
🗣️ `[COVER]` And the 7 shorts stop taking turns. No browser, no lock.
🎬 `[SHOW]` images.after: The after lights: the 7 shorts side by side, each calling Stable Image Core, 41 IMAGES x 4 CENTS = 1.64 DOLLARS.

## CH6 - DOES IT RUN ON EC2?

💬 `[NOTE]` On screen: the deck slide Does It Run On EC2?, its answer showing.
🖥️ `[SCREENSHARE]` So, does it run on EC2? Yes, but only the heavy work, and only while there's a job to run.
🗣️ `[COVER]` That's layer 4, the heavy work.
🎬 `[SHOW]` aws-map.compute: The HEAVY WORK layer lights, the rest dims.
🗣️ `[COVER]` The graph's on AgentCore and the models are on Bedrock. The ffmpeg jobs go to AWS Batch, a job queue that starts servers when work arrives and stops them after.
🎬 `[SHOW]` ec2-answer: the card DOES IT RUN ON EC2?, its 4 rows: the graph, the models, the heavy media, the renders.
🗣️ `[COVER]` Those servers are EC2 Spot instances: spare capacity Amazon sells for up to 90 percent off, but it can take one back with 2 minutes' warning.
🗣️ `[COVER]` That's fine here, because every step reads what's already done and skips it. On AWS, what's done lives in S3.
🎬 `[SHOW]` batch-spot.reclaim: a system-design chart, a Batch job queue to EC2 Spot instances. One instance is taken back, 2-MINUTE WARNING, and its job is retried, the finished steps skipped.
🗣️ `[COVER]` Whisper, if I keep it over Transcribe, needs a GPU. On AWS, that's a G6 instance, an EC2 server with an NVIDIA L4.
🎬 `[SHOW]` batch-spot.gpu: TODAY Whisper on my GPU, ON AWS the G6 instance with its NVIDIA L4, lit.
🗣️ `[COVER]` Today, Remotion renders on my PC in 1-minute chunks. On AWS, Remotion Lambda splits a render across up to 200 Lambda functions at once, at least 20 frames each.
🗣️ `[COVER]` Remotion's own example is a 10-minute HD video for around 10 cents. Each render has to finish inside 15 minutes.
🎬 `[SHOW]` render-fanout: a system-design chart, TODAY 1-minute chunks on my PC, ON AWS one render fanned out across up to 200 Lambda functions and stitched back, with Remotion's 10-minute example under it.

## CH7 - PUBLISHING

🗣️ `[COVER]` Layer 5, publishing. Today the posts wait in JSON files. On AWS, they're rows in DynamoDB.
🎬 `[SHOW]` aws-map.publish: The PUBLISHING layer lights, the rest dims.
🗣️ `[COVER]` Each post gets a one-time schedule in EventBridge Scheduler, Amazon's alarm clock for code. At that time, it fires a Lambda function that posts it.
🎬 `[SHOW]` publish.schedule: a system-design chart, TODAY JSON files, ON AWS the posts table to a one-time schedule to Lambda. That chain is lit.
🗣️ `[COVER]` YouTube and X go through their APIs. The platforms with no posting API go through AgentCore Browser, a Chrome that AWS runs for my agents, and it keeps the login between runs.
🎬 `[SHOW]` publish.browser: The APIs and AgentCore Browser with its saved login light.

## CH8 - WATCHING IT

🗣️ `[COVER]` Today I read log files. On AWS, every agent run is traced into CloudWatch, Amazon's monitoring service: latency, token usage and errors, per session.
🎬 `[SHOW]` watch: a system-design chart, TODAY log files, ON AWS every agent run traced into CloudWatch, with its 3 readings.
🗣️ `[COVER]` The media bill for the 63-minute livestream from my last video: the transcript, 38 cents. The images, 1.64 dollars. The renders, a few pennies.
🗣️ `[COVER]` That's before the model tokens, which I'd watch per agent, in CloudWatch.
🎬 `[SHOW]` bill: the card THE MEDIA BILL, ONE 63-MINUTE LIVESTREAM, with BEFORE THE MODEL TOKENS and LIST PRICES, NOV 2026 under it.

## CH9 - THE TAKEAWAY

🗣️ `[COVER]` So the graph barely changes. What changes is everything around it.
🎬 `[SHOW]` same-graph: the card THE GRAPH BARELY CHANGES, with WHAT CHANGES under it.
💬 `[NOTE]` Switch to the full-camera scene for the next line, then back to the screen share for the last one.
👤 `[FACE]` Where the state lives, who holds the keys, and what runs in parallel. That's the production work.
💬 `[NOTE]` On screen: the deck slide The Map, or your end screen.
🖥️ `[SCREENSHARE]` If you haven't seen the last two videos on this graph, start there.

## NOTES

- **Every AWS term is introduced (Mike, 2026-11-24).** The first time a service is said, the line says what I do today,
  then the AWS service that would do it, and one plain sentence on what that service is. The cards print the same
  description under each AWS box. A term said again later needs no second introduction.
- **A hypothetical.** Nothing here is built on AWS. The lines say "I'd" where it matters, and the map's title is IF IT
  RAN ON AWS. Never "I run this on AWS".
- **Left out to keep it near 4 minutes** (each one now needed its own introduction): AgentCore Policy, the WebSearch
  gap on Bedrock, AgentCore Evaluations, OpenTelemetry, Fargate, the closing recap over the map. All are in
  `RESEARCH.md` if one should come back.
- **Scenes:** 4 screen-share lines (CH1, CH3, CH6, CH9) and 2 face scenes (the first line and the takeaway). Everything
  else is a card: 12 of the 14 cards are system-design charts.
- **The deck for the screen-share lines:** Mike recorded them over an empty deck area, so the slides are painted in
  after (`assets/paint/paint_spine.py`, the langgraph-updates way): Does It Run On EC2? (CH1, then its answer for
  CH6), The Gate (CH3), and for CH9 a "Start Here" slide of the LangGraph playlist (the two earlier videos' titles),
  since he points at the playlist on the recording ("check this playlist right here").
- **Recording:** a hotkey for each OBS scene (full camera, screen share). Switch in the pause between lines, never
  mid-word: the cue step fails a `[FACE]` line that is not on the full-camera scene.
- **Careful lines** (from the research): say "AgentCore", never "Bedrock Agents" (that is the old product, closed to new
  customers); never Nova Canvas (end of life Sep 30, 2026); "Remotion caps each render at 15 minutes", never "Lambda
  caps at 15" (Lambda is 30 now); no Claude token price on screen (not verified). "TAO" is the token, never "tau".
- **Music (new on this track).** A drone bed under the whole video, picked from the analysed catalog: `sacral-i-feel-417-hz`
  (Soundstripe, never used before, 255 s, so a 4-minute video needs no loop; YouTube license code
  `ETEORPHXRJHTSO60` goes in the description). The scripted track has no music step yet, so it is mixed in after the
  render, on both the FINAL and the VERTICAL, with the picture stream-copied, the way the coding format's
  `music-bed` does it. Its level is set by measuring the bed against your voice.
- **Extras:** the vertical cut (its cards are built with the 16:9 cards). The 30-second short and the YT post were
  added by Mike on 2026-11-25, after the spine was approved.
