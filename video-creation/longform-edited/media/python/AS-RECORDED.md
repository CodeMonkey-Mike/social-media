# python EP01 — AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain
(defumble -> cover-blackout -> two-zone desilence 250 ms hook @<106 s / 500 ms body). Per
longform-edited house rule #6 the edit is cued off THIS, not `SCREENPLAY.md`. Divergences are listed
at the bottom, and they are substantial: the recorded take drops four scripted claims and adds a
~50 s ad-lib that replaces the scripted CH2._

- **Final spine:** `spine/ALL.c.desilenced.mp4` — 305.20 s (**5:05**), 1080p30, pillarboxed source
  (~80 px black bars L/R, baked in by the camera framing, not added by us). **LOCKED** (Mike,
  2026-08-05: "let's keep it as it is").
- **Picture-intact review copy** (same timing, no blackout): was `_previews/ALL.c.desilenced.PICTURE-for-review.mp4`
  — **recycled 2026-08-06** with the rest of `_previews/`. Regenerate from `spine/` if it is needed again.
  Review only, never a comp input.
- **Transcript (cue source):** `spine/ALL.c.desilenced.medium-words.json` — 957 word timings, 91
  segments, NOT hand-edited. Corrections live in the mishear table below and are applied at use time.
- **Timecode chain** (every timecode in this document is FINAL-SPINE coords, cue the comp directly off them):
  `raw/2026-08-05 15-28-19.mkv` (1000.83 s)
  -> `spine/ALL.lowbps.mp4` (same clock, transcode only)
  -> `spine/ALL.a.defumbled.mp4` (812.90 s; 30 cuts, 188.03 s removed; cut list `spine/ALL.cuts.txt`)
  -> `spine/ALL.b.blackout.mp4` (812.90 s; **paint only, clock unchanged**; spans `spine/ALL.face.txt`)
  -> `spine/ALL.c.desilenced.mp4` (305.20 s; 115 cuts, 508.24 s removed; remap `spine/ALL.c.desilenced.map.json`)
- **Spine QA (all passed):** 0 swallowed-speech flags across all 115 desilence cuts · A/V drift 30 ms
  · no partial/restart chunk survives the defumble (213 chunks -> 146 -> 37) · live footage both sides
  of the three biggest joins · blackout spans measure 100% black, FACE beats show picture.
- **Jump-cut anchors:** the 114 keep-boundaries in `ALL.c.desilenced.map.json` are the ONLY legal
  positions for a punch-in or a mid-face hit (desilencer skill). Convert to final coords after any
  card-pause bake and save as `spine/jumpcuts-final.json` before the comp.

---

## FACE windows (from `blackdetect` on the baked picture; non-black = FACE)

Everything NOT listed here is black video and **must** be covered in the comp. 28.1 s face of
305.20 s = **9% face / 91% cover**. Nine scripted `[FACE]` beats survive as **seven** windows: two
adjacent pairs merged when the dead air between them was desilenced away. Zero orphans, every window
lands on a scripted beat.

| # | Window (s) | m:ss | Content |
|---|---|---|---|
| 1 | 5.66-9.82 | 0:05.7-0:09.8 | "So why would you want to spend three months learning Python?" |
| 2 | 29.82-36.42 | 0:29.8-0:36.4 | **Merged pair.** "It's that you skip the part where you get good. So you never do." + CH2 opener "So I'm going to be making these videos, starting right here." |
| 3 | 107.52-108.92 | 1:47.5-1:48.9 | "Computers don't speak human." |
| 4 | 213.46-215.50 | 3:33.5-3:35.5 | "That's it. That's the whole list." |
| 5 | 224.06-226.50 | 3:44.1-3:46.5 | "Instead, build one project, four times." |
| 6 | 283.33-285.56 | 4:43.3-4:45.6 | "The struggle is the part where learning happens." |
| 7 | 295.96-305.20 | 4:56.0-5:05.2 | **Merged pair, runs to the last frame.** "Hit those three and you've earned the right to let the AI drive." + the close "So if you want to learn Python for AI engineering, subscribe and follow this playlist. I'll see you in the next one." |

> [!NOTE]
> **Window 2's merge is a real edit constraint.** The face runs continuously across the CH1->CH2
> boundary, which is exactly where the video TITLE CARD lands. The card covers the join, so no black
> beat is needed, but the card cannot be dropped there without exposing a face-to-face cut across a
> chapter change. **Window 7's merge is by design** (the screenplay holds the face from the readiness
> payoff straight into the ask).

> [!NOTE]
> **CH2's ad-lib is 95% covered, by Mike's ruling.** Only the first sentence of the ~50 s ad-lib is
> FACE; 0:36.3-0:58.4 (the playlist line, "as you've seen in some of my other videos", the
> JavaScript-to-Python line, and the beginners-and-seasoned framing) is BLACK and needs 22 s of cover.
> I flagged this as a likely over-black and recommended making the whole block face; **Mike ruled keep
> it as is (2026-08-05)**. That ruling stands; do not re-open it, and do budget the cover for it.

---

## Whisper mishears to FIX in any on-screen text

The word-time JSON stays un-edited (it is the timing source), so THIS is the correction list. Captions
are OFF for this video (Mike, 2026-08-05), so these matter for **on-screen containers, the title, the
description and the chapter markers** only.

| TC | Whisper heard | Correct | Note |
|---|---|---|---|
| 0:00.7 | "Cloud Code" / "Claude code" | **Claude Code** | Both words capitalized, it is a product name |
| 0:01.9 | "a rag app" | **a RAG app** | Only ever appears as spoken jargon; never gloss it on screen (deliberate, see flags) |
| 0:47.8 | "Bython" (in the lowbps pass) | **Python** | Final pass got it right; watch it if re-transcribed |
| 0:53.2 | "skilled season programmers" | **skilled, seasoned programmers** | |
| 1:21.4 | "AI engineer and Ashley asked for" | **what AI engineering actually asks for** | Badly garbled, do not quote this line on screen from the JSON |
| 1:25.9 | "the AI engineer and world" | **the AI engineering world** | Same garble |
| 2:38.9 | "I think a TensorFlow or PyTorch" | **and think TensorFlow or PyTorch** | |
| 2:47.3 | "You'll build an assistance on top of models" | **You'll build systems on top of models** | |
| 3:08.1 | "handling linear keys" | **handling your keys** | |
| 3:20.8 | "this is a one everybody skips" | **this is the one everybody skips** | |
| 3:43.9 | "build one project for time" | **build one project, four times** | The chunk-level pass rendered this as "hurricane and thunderstorm related"; the audio is clean, Whisper is not |
| 4:06.3 | "then pointed out your own documents" | **then point it at your own documents** | |
| 2:26.4 | "chat, GPT" | **ChatGPT** | One word |

---

## AS-RECORDED beats (timecodes = FINAL spine)

Chapter numbering follows `SCREENPLAY.md`. **CH7 does not exist** (cut by Mike 2026-08-05 before
recording; the video ends inside CH6).

### CH1 — The shortcut is real (0:00-0:33.7) · card OFF · Bed A

| TC | As recorded | vs screenplay |
|---|---|---|
| 0:00.0 | "You can open Claude code right now, type, build me a rag app and have working Python in about an hour." | **KEPT** (locked `[SAY-EXACT]` line, delivered near-verbatim) |
| 0:05.7 | "So why would you want to spend three months learning Python?" `[FACE]` | **CHANGED**, harmless: "would you want to spend" for "would you spend", and "learning Python" for "learning this" |
| 0:09.9 | "Because here's the part that nobody tells you." | **KEPT** |
| 0:11.5 | "AI tools amplify the skill you already have." | **CHANGED**: "the skill" for "whatever skill". Slightly weaker, still carries the beat |
| 0:14.6 | "If you're already really good, they make you absolutely wicked. Like a Terminator, you just become unstoppable." | **AD-LIB**, expanded. Scripted was "they make you dangerous." The Terminator line is new and is the most quotable moment in CH1 |
| 0:21.9 | "And if you're not already really good, they just produce bad code faster than you could have before." | **KEPT** |
| 0:27.4 | "And the real cost isn't the bad code." | **KEPT** |
| 0:29.8 | "It's that you skip the part where you get good. So you never do." `[FACE]` | **KEPT** (present tense "skip" for "skipped") |

### CH2 — What this playlist is (0:33.7-1:33.6) · **card ON, video title card** · Bed B

| TC | As recorded | vs screenplay |
|---|---|---|
| 0:33.7 | "So I'm going to be making these videos, starting right here and putting them into a playlist. And it's going to be like an overall Python course," `[FACE]` on the first sentence only | **AD-LIB.** Replaces the scripted face line "This is a complete Python course for one job: AI engineering." Same idea, his words |
| 0:41.3 | "as you've seen in some of my other videos, I'm sort of like coming from the JavaScript world and I'm coming over to Python." | **AD-LIB.** The JS-to-Python positioning. Reads peer-expert, NOT co-beginner, so the authority guard HELD |
| 0:48.3 | "So this is going to be a course for beginners and as well as skilled, seasoned programmers who just are switching over from another programming language." | **AD-LIB.** New audience framing, not in the plan |
| 0:58.5 | "And it's going to be a little bit different. There's going to be weekly or bi-weekly episodes, depending on how often I publish them." | **AD-LIB.** Publishing cadence. This is the line he fought hardest for on the take (6 false starts, 32 s of fumbles removed) |
| 1:06.3 | "And it's going to start out as like very, very beginner level and then move on into the more complex stuff over time." | **AD-LIB.** Difficulty ramp |
| 1:12.9 | "But I want to make this different because if you open any standard learn Python course, you'll spend weeks learning things that you'll never use for that job." | **KEPT** (scripted Beat 1's cover line, arriving here instead) |
| 1:21.4 | "So I went through what AI engineering actually asks for and cut everything else out." | **KEPT** |
| 1:25.9 | "This is going to be specific to what you need to know in the AI engineering world. Not going to be about gaming. It's not going to be about web development and so on." | **AD-LIB.** This is what now carries the authority beat, in place of the dropped 76-episodes claim |
| 1:33.5 | "So let me show you the shape of it, starting with what Python even is." | **KEPT** |

> [!IMPORTANT]
> **DROPPED from CH2, deliberately (Mike, 2026-08-05): "What's left is seventy six episodes. Every
> single one runs on your machine, no API key, nothing to install."** Left out on purpose. Consequence
> for the edit: the episode count, the "runs offline" promise and the playlist-grid receipt are **not
> in this video at all**. Do NOT put 76, an episode count, or a "no API key" claim on screen anywhere.
> The `[D2-B]` stat card from the screenplay's VISUAL-PLAN is CANCELLED.

### CH3 — Sixty seconds on Python (1:33.6-2:32.2) · card OFF (continues Bed B) · **58.6 s, cap held**

| TC | As recorded | vs screenplay |
|---|---|---|
| 1:37.4 | "And if you know that already, you skip ahead to what you actually need and so on." | **CHANGED.** The skip cue survives but without a named target ("what you actually need" is spoken as a phrase, not as a chapter name). The on-screen `[D2-C]` cue must supply the chapter name AND the timestamp, since the VO no longer does |
| 1:41.6 | "Say, Hey computer, calculate five plus five out loud. Nothing happens." | **KEPT** |
| 1:47.5 | "Computers don't speak human." `[FACE]` | **KEPT** |
| 1:49.1 | "Down at the bottom, your machine actually understands this. Zeros and ones, ones and zeros." | **KEPT** ("zeros and ones, ones and zeros" is his doubling, keep both on screen or neither) |
| 1:54.5 | "Above that languages get steadily easier for people and harder for machines. Assembly. C. And at the top, closest to how you already think, is Python." | **KEPT.** The whole ladder in one breath |
| 2:04.3 | "print five plus five. 10. That's the whole idea." | **KEPT.** Container shows `print(5 + 5)` -> `10` |
| 2:08.9 | "You write something close to English and a translator handles the rest." | **KEPT** |
| 2:12.5 | "So that's it. That's it, from a very high level perspective. That's what Python is." | **CHANGED**, expanded with the "high level perspective" hedge |
| 2:17.2 | "There's a whole lot of stuff going on underneath and you don't really need any of it today." | **KEPT** |
| 2:22.3 | "What you do need: the entire AI industry runs on this one language, whether it be ChatGPT, Claude, image models, self-driving systems. Python is at the front door of all of it." | **KEPT** |

### CH4 — What you actually need (2:32.2-3:35.5) · card ON "WHAT YOU ACTUALLY NEED" · Bed C

| TC | As recorded | vs screenplay |
|---|---|---|
| 2:32.2 | "So what do you actually need to get started? First, you can start with what you don't need. Most people hear AI engineering and think TensorFlow or PyTorch." | **KEPT** |
| 2:38.9 | "Those are for training models from scratch, which as an AI engineer, you almost never do. You'll build systems on top of models other people already trained." | **KEPT** |
| 2:50.4 | "There are four things you need. One, the fundamentals: variables, lists, dictionaries, conditionals, loops, functions, and just enough object oriented programming to read somebody else's code." | **KEPT** |
| 3:03.2 | "Two, APIs. Because most of the time calling APIs is most of what this job actually is. HTTP requests, JSON, handling your keys without leaking them, and dealing with it properly when the call fails at three in the morning." | **KEPT** |
| 3:16.8 | "Three, files: loading documents, saving outputs, reading logs." | **KEPT** |
| 3:20.6 | "Four, and this is the one everybody skips: environments. Virtual environments, PIP, UV." | **KEPT** |
| 3:29.6 | "Two projects need two different versions of the same library. And without isolation, installing one quietly breaks the other." | **KEPT** |
| 3:33.5 | "That's it. That's the whole list." `[FACE]` | **CHANGED**: "That's it" for the scripted "That's the list" |

### CH5 — Build one project, four times (3:35.5-4:22.8) · card ON · Bed D

| TC | As recorded | vs screenplay |
|---|---|---|
| 3:36.5 | "And then you build. And what you build matters more than more people think." | **CHANGED.** "more than more people think" is a slip, present in BOTH takes. See flags |
| 3:39.4 | "Standard portfolio advice is to go train a simple model. That's not AI engineering." | **KEPT** |
| 3:44.1 | "Instead, build one project, four times." `[FACE]` | **KEPT** |
| 3:48.3 | "Start by calling an LLM, a script that takes some text, sends it to a model, gets a response back, does something useful with it. Done properly, that one project teaches you JSON requests, error handling, and environment management all at once." | **KEPT** |
| 4:01.8 | "Then give it memory, so it remembers the conversation instead of forgetting you every single message." | **KEPT** |
| 4:06.3 | "Then point it at your own documents. Now you're doing retrieval, chunking, similarity." | **KEPT** |
| 4:10.1 | "And give it tools and let it decide which ones to use. That's an agent." | **KEPT** ("And" for "Then") |
| 4:16.6 | "You don't end up with four toy projects. You end up with one system that got progressively more serious, which is exactly what the job looks like." | **KEPT** |

### CH6 — The one rule + the close (4:22.8-5:05.2) · card ON "THE ONE RULE" · Bed E, resolves on the last frame

| TC | As recorded | vs screenplay |
|---|---|---|
| 4:22.8 | "One rule, and it decides whether any of this works." | **KEPT** |
| 4:26.9 | "Most people learn Python by watching. You can sit through 40 hours of somebody else typing and retain absolutely nothing. Watching is why people don't learn." | **KEPT** |
| 4:33.1 | "So while you're building the foundations, AI is allowed to explain things to you and quiz you. It's not allowed to write your code." | **KEPT.** The load-bearing rule, delivered clean |
| 4:42.1 | "I mean, yeah, that's slower, but again, that's really the point." | **CHANGED**, softened with "I mean, yeah" |
| 4:43.3 | "The struggle is the part where learning happens." `[FACE]` | **KEPT** ("where learning happens", no "the") |
| 4:45.7 | "You'll know you're through this phase when three things are true. You can read unfamiliar code and say what it does. You can debug a failing test on your own. You can look at a system and guess where it's going to break." | **KEPT.** All three criteria intact, this is the screenshot frame |
| 4:56.2 | "Hit those three and you've earned the right to let the AI drive." `[FACE]` | **KEPT** |
| 4:59.4 | "So if you want to learn Python for AI engineering, subscribe and follow this playlist." `[FACE]` | **KEPT.** The single ask, exactly as re-scripted 2026-08-05 |
| 5:02.4 | "I'll see you in the next one." `[FACE]` | **KEPT.** Ends at 5:05.2 |

---

## Divergences from SCREENPLAY.md

**Dropped (scripted, not said) — all RESOLVED, none to be recovered:**
1. **"76 episodes / no API key / nothing to install"** (CH2). Mike, 2026-08-05: intentional. **RESOLVED.**
   Kills `[D2-B]` and the playlist-grid receipt `[R2-A]`.
2. **The whole scripted CH2 Beat 1 face line** ("a complete Python course for one job"). Replaced by
   the ad-lib. **RESOLVED** (the ad-lib carries it).
3. **The named skip target.** He says "what you actually need" as prose, not as a chapter name, so the
   on-screen cue now has to carry the name and timestamp alone. **RESOLVED**, handled on screen.
4. **CH7 entirely** (run-the-folder demo, "next video, ten minutes", episode 2 queued). Cut by Mike
   before recording. **RESOLVED.** Kills `[R7-A]`, `[R7-B]`, `[R7-C]`, `[R5-A]`.

**Added (ad-libs, all KEPT as content):**
1. **The CH2 channel intro, ~50 s** (0:33.7-1:23): playlist framing, "as you've seen in some of my
   other videos", the JavaScript-to-Python positioning, beginners-and-seasoned audience, weekly /
   bi-weekly cadence, beginner-to-complex ramp. This is the single biggest divergence in the video and
   it needs its own cover plan; the screenplay budgeted nothing for it.
2. **"They make you absolutely wicked. Like a Terminator, you just become unstoppable."** (0:14.6).
   Expands the scripted "they make you dangerous."
3. **"Not going to be about gaming, not about web development"** (1:25.9), the scoping line that now
   does the authority job.

**Guards, and whether they HELD:**
- ⛔ **ON-SCREEN AUTHORITY: HELD.** No co-beginner framing anywhere. The JS-to-Python line reads as a
  senior dev switching languages, which is the sanctioned peer-expert angle.
- ⛔ **Borrowed credentials / salary: HELD.** No placements, no title, no employer, no income figure.
- ⛔ **Sources never cited: HELD.** Neither source video is named or referenced.
- ⛔ **No em dashes: N/A** (spoken take).
- ⛔ **CH3 one-minute cap: HELD at 58.6 s.**

---

## Flags carried into the edit

1. **"more than more people think"** (3:36.5) is a verbal slip and it is in BOTH takes, so there is no
   clean alternative in the raw. Options: leave it (it passes at speed), or micro-cut "more than" via
   burst-removal to yield "what you build matters more people think" (worse), or accept. **Recommend
   leaving it.** Do NOT reproduce the slip in any on-screen text.
2. **"handling your keys without leaking them"** rides directly into an API-keys visual. Any container
   here must not show a real key, even a fake-looking one that could be mistaken for real.
3. **"a RAG app" is deliberately unglossed** (0:01.9). It is jargon coming out of a tool in the hook,
   and the video never explains it. Do not add an on-screen gloss; that would undercut the joke that
   the shortcut hands you something you do not understand.
4. **The pillarbox.** The source has ~80 px black bars L/R baked in. Every full-frame container must
   be built to the true 1920x1080 frame, NOT matched to the pillarboxed camera area, or the containers
   will look inset next to the face beats.
5. **Green screen: never matte.** House rule, no chroma key or RVM on his footage. The green stays.
6. **CH2's 22 s black block** (0:36.3-0:58.4) is the largest single cover demand in the video and has
   the least concrete content to illustrate. Plan it first, it is the hardest cover problem here.

---

## Locked edit decisions (Mike, 2026-08-05)

- **Face spine, not clone VO.** SCREENPLAY open question 1 is **RESOLVED** by the recording.
- **Spine LOCKED** at `ALL.c.desilenced.mp4`, 5:05, including CH2's face gating as baked.
- **Transitions: plain Remotion crossfade ONLY.** No transition library, no glitch, no film burn, no
  MELT/SPIN, nothing from `assets/transitions/`. Simpler and more professional is the intent.
  **This overrides longform-edited hard-gate item #3** (which forbids a plain cross-fade to the face
  and requires a picked film-burn/glitch face transition). Recorded as a deliberate per-video waiver;
  the project decision wins. `TRANSITIONS.md` must carry the waiver so a later pass does not "fix" it.
- **NO CAPTIONS anywhere in the video.** Removes the caption layer entirely and the `captions-builder`
  step with it. The mishear table above therefore only governs containers, title, description and
  chapter markers.
