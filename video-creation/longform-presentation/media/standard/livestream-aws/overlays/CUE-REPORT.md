# CUE-REPORT

_Written by `cue_script.py` from `SCRIPT.md` and `livestream-aws EDIT.enhanced.medium-words.json`. Regenerated on every run: fix the script or pass a flag, never edit this file. Times are FINAL-spine seconds._

`SCRIPT-CUE PASS lines=41 kept=31 changed=7 missing=3 adlibs=4 number_mismatches=2 runs=4 faces=2`

Extras named in the script header: vertical cut ON, short ON (30 s), YT post ON.

## 1. Numbers he said differently from the script (read these first)

| script line | at | the script says | he said | the line as heard |
|---|---|---|---|---|
| 108 | 3:43.00 | 38 | 30 | Now the bottleneck from my last video, one browser making the images, busy for 3.9 hours of a four hour and 30 minute build. |
| 144 | 5:33.86 | 1.64 | 1.6 | The media bill for a 63 minute live stream from my last video, the transcript, 38 cents. The images, $1.6. The renders, a few pennies. |

A mismatch is a FLAG, not a failure: a card prints the sourced figure, the voice says the other one. Mike rules (re-record the line, or leave it); Whisper can also mishear a number, so listen at the timecode before raising it.

## 2. Script lines he did not say

| script line | scene | the line |
|---|---|---|
| 110 | COVER images.after | On AWS, I'd drop the browser and call an image model on Bedrock. Stable Image Core, from Stability AI, is 4 cents an image, so that run's 41 images come to 1.64 dollars. |
| 118 | COVER aws-map.compute | That's layer 4, the heavy work. |
| 137 | COVER publish.browser | YouTube and X go through their APIs. The platforms with no posting API go through AgentCore Browser, a Chrome that AWS runs for my agents, and it keeps the login between runs. |

A missing `[COVER]` line has no window, so that card (or state) never shows for it. Accepted with --allow-missing.

## 3. Lines he reworded

| script line | at | match | as scripted | as heard |
|---|---|---|---|---|
| 57 | 0:00.00 | 0.56 | My livestream pipeline runs on one PC. Here's how I'd run the same LangGraph on AWS, Amazon's cloud, as a real production system. | My livestream pipeline runs on one PC. What I wanna do here is show you how I would set this up on AWS and like a real production environment. |
| 58 | 0:16.14 | 0.84 | Today, everything lives in one box: the graph and its checkpoints, 7 agents in Claude Code, one browser for the images, Whisper on my GPU, the renders and the posting scripts. | Today, everything lives in one box. A graph and its checkpoints, seven agents and cloud code, one browser for images, Whisper on my GPU, the renders and the posting scripts. |
| 63 | 0:43.18 | 0.67 | And I'll answer the question everyone asks first: does any of this run on EC2, Amazon's virtual servers? | And I'll answer the question that everybody asks first, does this run on EC2? All right, so |
| 87 | 2:22.26 | 0.82 | Now the human gates. My first gate once waited 9 hours for me. A session lasts 8. | Now the human gates. My first gate once waited nine hours for me. The session lasts eight |
| 100 | 3:19.12 | 0.73 | And the logins go in AgentCore Identity, a vault for the agents' keys and tokens. | And the logins go into Agent Core Identity, a vault for agent keys and tokens. |
| 111 | 3:55.92 | 0.73 | And the 7 shorts stop taking turns. No browser, no lock. | and the seven shorts stopped taking turns. No browser, no log. |
| 144 | 5:33.86 | 0.85 | The media bill for the 63-minute livestream from my last video: the transcript, 38 cents. The images, 1.64 dollars. The renders, a few pennies. | The media bill for a 63 minute live stream from my last video, the transcript, 38 cents. The images, $1.6. The renders, a few pennies. |

## 4. Ad-libs (said, in no script line)

| after script line | from | to | on screen | what he said |
|---|---|---|---|---|
| 57 | 0:13.46 | 0:16.00 | face scene, centred | Gonna be interesting, so let's get into it. |
| 108 | 3:51.78 | 3:55.92 | stays on images.before | On AWS, I dropped the browser and call an image model on Bedrock |
| 145 | 5:48.58 | 5:59.20 | stays on bill | To be clear, most of the costs will go to where the model tokens are. For a one 63 minute live stream, it could get up to $80 or maybe a little bit more. |
| 155 | 6:13.86 | 6:28.18 | screen share, as filmed | here. It's a playlist all about line graph. Make sure you subscribe if you're new here and you can check this playlist right here because we got tons of stuff related to AI engineering on this channel called AI Engineering Simplified. |

## 5. Flags

None.

## 5b. Face scenes (the full-camera OBS scene, found in the picture)

- full-camera window 0:00.00 to 0:13.33 (13.33 s)
- full-camera window 6:03.60 to 6:09.90 (6.30 s)
- script line 57 `[FACE]`, said 0:00.00 to 0:13.22: on the full-camera scene
- script line 153 `[FACE]`, said 6:03.58 to 6:09.84: on the full-camera scene

## 6. Cover runs (one clip each, built by `cover_runs.py`)

| run | from | to | length | cards in order |
|---|---|---|---|---|
| run-01 | 0:16.00 | 0:42.88 | 26.9 s | today-pc (13.5 s) > aws-map.all (13.3 s) |
| run-02 | 0:50.04 | 2:21.96 | 91.9 s | aws-map.ingest (9.2 s) > ingest.trigger (14.6 s) > ingest.convert (8.4 s) > ingest.face (9.4 s) > ingest.words (14.6 s) > aws-map.graph (10.6 s) > graph-home.runtime (12.2 s) > graph-home.checkpoint (12.9 s) |
| run-03 | 2:28.72 | 4:00.72 | 92.0 s | gate.wait (9.6 s) > gate.resume (6.4 s) > aws-map.agents (14.2 s) > agents.models (11.1 s) > agents.tools (14.4 s) > agents.role (18.6 s) > images.before (8.9 s) > images.after (8.9 s) |
| run-04 | 4:08.74 | 6:03.58 | 114.8 s | ec2-answer (10.9 s) > batch-spot.reclaim (16.2 s) > batch-spot.gpu (9.2 s) > render-fanout (19.3 s) > aws-map.publish (7.5 s) > publish.schedule (10.0 s) > watch (11.8 s) > bill (25.6 s) > same-graph (4.4 s) |

## 7. Every line

| script line | scene | window in | window out | status | as heard |
|---|---|---|---|---|---|
| 57 | FACE | 0.000 | 16.000 | CHANGED | My livestream pipeline runs on one PC. What I wanna do here is show you how I would set this up on AWS and like a real production environment. |
| 58 | COVER today-pc | 16.000 | 29.540 | CHANGED | Today, everything lives in one box. A graph and its checkpoints, seven agents and cloud code, one browser for images, Whisper on my GPU, the renders and the posting scripts. |
| 60 | COVER aws-map.all | 29.540 | 42.880 | KEPT | For every piece, I'll show you what I do today and the AWS service that I would do it with in five layers. Injust, the graph, the agents, the heavy work and publishing. |
| 63 | SCREENSHARE | 42.880 | 50.040 | CHANGED | And I'll answer the question that everybody asks first, does this run on EC2? All right, so |
| 67 | COVER aws-map.ingest | 50.040 | 59.240 | KEPT | layer one, ingest. Today, the recording sits in my folder on my PC. On AWS, it goes to S3, which is Amazon's file storage. |
| 69 | COVER ingest.trigger | 59.240 | 73.860 | KEPT | S3 can announce every new file to EventBridge. EventBridge is the event router in Amazon. EventBridge runs a Lambda function, a small piece of code. AWS runs only when something calls it and that starts the graph. |
| 71 | COVER ingest.convert | 73.860 | 82.300 | KEPT | Today, FFmpeg makes the low bit rate master. On AWS, that's MediaConvert, which is Amazon's video converter. |
| 73 | COVER ingest.face | 82.300 | 91.660 | KEPT | My face tracker makes the vertical crop. On AWS, recognition, Amazon's image and video analysis service finds my face in a video. |
| 75 | COVER ingest.words | 91.660 | 106.240 | KEPT | And Whisper writes the transcript. On AWS, that's Transcribe, Amazon's speech to text. It gives a timestamp on every word and the words Whisper keeps gets wrong, like towel, go into its custom vocabulary. |
| 80 | COVER aws-map.graph | 106.240 | 116.840 | KEPT | Layer two, the graph. Today, it's a Python process on my PC. On AWS, it runs on Agent Core Runtime, Amazon hosting for agents. |
| 82 | COVER graph-home.runtime | 116.840 | 129.040 | KEPT | Each run gets its own MicroVM, a small, isolated virtual machine, for up to eight hours. It builds by the second and the CPU charge drops to zero while it waits on a model. |
| 84 | COVER graph-home.checkpoint | 129.040 | 141.960 | KEPT | The checkpoints move too. Today, they're in SQLite. On AWS, they go to DynamoDB, Amazon's managed database, through a LandGraph package called LandGraph Checkpoint AWS. |
| 87 | SCREENSHARE | 141.960 | 148.720 | CHANGED | Now the human gates. My first gate once waited nine hours for me. The session lasts eight |
| 88 | COVER gate.wait | 148.720 | 158.280 | KEPT | So at the gate, the graph saves the state to DynamoDB and the session ends. SMS, Amazon notification service, sends me an email. |
| 90 | COVER gate.resume | 158.280 | 164.660 | KEPT | I'll approve on the dashboard. A Lambda function resumes the graph on the same thread in a new session. |
| 95 | COVER aws-map.agents | 164.660 | 178.820 | KEPT | Layer three, the agents. Today, Cloud Code calls Anthropic directly. On AWS, it calls Bedrock, Amazon service for running AI models and Fable, Opus, and Sonnet are all on it. |
| 97 | COVER agents.models | 178.820 | 189.880 | KEPT | It's one-setting. Cloud Code use Bedrock and each agent runs through the Cloud Agent SDK, which is called code as a library in its own runtime session. |
| 99 | COVER agents.tools | 189.880 | 198.920 | KEPT | There are tools go behind Agent Core Gateway, which turns my APIs and functions into MCP tools, the open standard agents use to call tools. |
| 100 | COVER agents.tools | 198.920 | 204.320 | CHANGED | And the logins go into Agent Core Identity, a vault for agent keys and tokens. |
| 102 | COVER agents.role | 204.320 | 214.320 | KEPT | Each agent also gets an IAM role. IAM is how AWS decides who can call what and a role lists exactly what one agent is allowed to call. |
| 103 | COVER agents.role | 214.320 | 222.880 | KEPT | Today, the builder doesn't make images, but nothing stops it. On AWS, its role only allows Cloud models, so it can't. |
| 108 | COVER images.before | 222.880 | 231.780 | KEPT | Now the bottleneck from my last video, one browser making the images, busy for 3.9 hours of a four hour and 30 minute build. |
| 110 | COVER images.after | | | MISSING | (On AWS, I'd drop the browser and call an image model on Bedrock. Stable Image Core, from Stability AI, is 4 cents an image, so that run's 41 images come to 1.64 dollars.) |
| 111 | COVER images.after | 231.780 | 240.720 | CHANGED (pinned) | and the seven shorts stopped taking turns. No browser, no log. |
| 117 | SCREENSHARE | 240.720 | 248.740 | KEPT | So does it run on EC2? Well, yes, but only the heavy work and only when there's a job to run. |
| 118 | COVER aws-map.compute | | | MISSING | (That's layer 4, the heavy work.) |
| 120 | COVER ec2-answer | 248.740 | 259.640 | KEPT | The graphs agent on Agent Core and the models are on Bedrock. The FFMPIC jobs go to AWS batch, a job queue that starts the servers when the work arrives and stops them after. |
| 122 | COVER batch-spot.reclaim | 259.640 | 268.080 | KEPT | Those servers are EC2 spot instances. Spare capacity Amazon sells for up to 90% off, but it can take one back with two minutes warning. |
| 123 | COVER batch-spot.reclaim | 268.080 | 275.800 | KEPT | That's fine here because every step reads what's already done and skips it. On AWS, what's done lives in S3. |
| 125 | COVER batch-spot.gpu | 275.800 | 284.960 | KEPT | Whisper, if I keep it over transcribed, needs a GPU. On AWS, that's a G6 instance with an EC2 server with an Nvidia L4. |
| 127 | COVER render-fanout | 284.960 | 296.460 | KEPT | Today, Remotion renders on my PC in one minute chunks. On AWS, Remotion Lambda splits a render across up to 200 Lambda functions at once, at least 20 frames each. |
| 128 | COVER render-fanout | 296.460 | 304.220 | KEPT | Remotion's own example is a 10 minute HD video for around 10 cents. Each render has to finish inside 15 minutes. |
| 133 | COVER aws-map.publish | 304.220 | 311.760 | KEPT | Layer five publishing. Today, the posts wait in JSON files. On AWS, there are rows in DynamoDB. |
| 135 | COVER publish.schedule | 311.760 | 321.740 | KEPT | Each post gets a one time schedule in EventBridge Scheduler, Amazon's alarm clock for code. At that time, it fires a Lambda function that posts it. |
| 137 | COVER publish.browser | | | MISSING | (YouTube and X go through their APIs. The platforms with no posting API go through AgentCore Browser, a Chrome that AWS runs for my agents, and it keeps the login between runs.) |
| 142 | COVER watch | 321.740 | 333.580 | KEPT | Today, I read log files. On AWS, every agent is run and traced into CloudWatch, Amazon's monitoring servers, latency, token usage, and errors per session. |
| 144 | COVER bill | 333.580 | 344.220 | CHANGED | The media bill for a 63 minute live stream from my last video, the transcript, 38 cents. The images, $1.6. The renders, a few pennies. |
| 145 | COVER bill | 344.220 | 359.200 | KEPT | That's before the model tokens, which I'd watch per agent in CloudWatch. |
| 150 | COVER same-graph | 359.200 | 363.580 | KEPT | So the graph barely changes. What changes is everything around it. |
| 153 | FACE | 363.580 | 369.840 | KEPT | Where the state lives, who holds the keys, what runs in parallel, that's the production work. |
| 155 | SCREENSHARE | 369.840 | 388.400 | KEPT | If you haven't seen the last two videos on this graph, I would say start right |
