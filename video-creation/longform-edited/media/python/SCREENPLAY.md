# python SCREENPLAY

**Working title:** Learning Python for AI Engineering (EP 01, series opener)
**Channel:** AI Engineering Simplified (`@aiEngineeringSimplified`), produced on the **longform-edited** track (heavily-edited 16:9), not the lighter deck-and-VO explainer format. Mike's call: this one gets the main channel's edit treatment.
**Source script:** `SCRIPT.md` (this folder). This screenplay is the production adaptation of it; every spoken beat below traces to a `SCRIPT.md` line. Adaptation deltas are listed at the bottom.
**⛔ STATUS: SUPERSEDED IN PART. The video is RECORDED (2026-08-05).** Build the edit to **`AS-RECORDED.md`**, not to this file, wherever they differ (house rule #6), and they differ substantially: the take drops the 76-episodes claim and adds a ~50 s CH2 ad-lib. This file remains the source for register, the visual plan and the music plan. Locked edit decisions (Mike, 2026-08-05): **plain Remotion crossfade only**, see `TRANSITIONS.md` for the hard-gate waiver, and **no captions anywhere in the video**.
**What this video is (Mike, 2026-08-05):** the **TRAILER for the playlist**, not a tutorial. Every OTHER episode in the series is a screen-share coding session; this one is the only produced, edited piece, and its job is to make someone want to take the tutorials and subscribe. Treat it as an advertisement for the curriculum: it teaches just enough to prove the path is real, then hands the viewer the first step. Nothing in it should feel like episode zero of the course.
**Runtime target:** ~5:20 (`SCRIPT.md`'s band was 5:30 to 6:00; cutting the standalone close chapter lands just under, and shorter favors retention). 6 chapters, no mid-roll plug.
**Archetype / register:** **CALM AUTHORITY.** Gear 2 (polished explainer) is the home register for the whole video, lifting only slightly on the CH1 hook and the CH6 payoff. This is NOT the crypto channel's gear-3 hype video: no epic declamation, no rising-tide build, no "let's dive in" energy spike. Peer-expert, steady, confident. The edit density is main-channel; the emotional temperature is one notch down, and the music plan is built to match (see MUSIC-MOOD-PLAN).
**Spine architecture:** a VALIDATE-THEN-TAKE-AWAY arc. Open by conceding the shortcut is real and genuinely impressive, then name its cost (CH1). Establish what the playlist is and is not (CH2). One fast, capped primer for anyone who needs it, with a visible exit for anyone who does not (CH3). Then the three payload chapters that carry the whole video: what you actually need (CH4), what you build (CH5), the one rule that decides whether any of it works (CH6), which closes the video: the readiness payoff holds straight into the ask. There is no separate close chapter; ending on the emotional peak is the point.
**Its one job:** make someone subscribe and start the playlist. Everything is subordinate to that. Any beat that does not move a viewer toward pressing play on episode 2 is a cut candidate. The ask itself lands once, at the very end of CH6, and it is the only sales line in the video.

---

## The hook / thesis

AI tools amplify whatever skill you already have. Someone who is already good gets dangerous; someone who is not just produces bad code faster. The real cost is not the bad code, it is skipping the phase where you get good, so you never do. This playlist is the fastest honest path through that phase: a complete Python course scoped to one job, AI engineering, everything the job asks for and nothing it does not, cut to 76 runnable episodes, four capability groups, one project built four times, and one rule (AI explains and quizzes, AI does not write your code) that decides whether the whole thing works.

> [!WARNING]
> **DO NOT AIR: the co-beginner framing.** To be clear about where this came from: it is **not in any spoken line of `SCRIPT.md`**. It appears once, in that file's "Two things to decide" section, as a SUGGESTION to Mike ("the honest and genuinely stronger one is that you're building this while learning it"). **That suggestion is declined and does not carry into this screenplay** (Mike confirmed 2026-08-05), and no line below implies it. It is boxed here so it cannot creep back in on the take or in a pickup. The framing is barred on this channel (⛔ ON-SCREEN AUTHORITY, Mike, hard rule 2026-07-01, `ai-engineering/ai_channel_plan.md`): never present on camera as a co-beginner. No "I'm learning this alongside you", no "I don't really know this either", no "figuring it out as we go." Empathy for what is hard is fine ("this trips everyone up"); confessing your own confusion is not. **Authority in this video comes from the curriculum instead**: 76 episodes, every one runs offline, mapped to what the job actually asks for. That is the whole authority play and it is already scripted into CH2.

> [!WARNING]
> **DO NOT AIR: borrowed credentials or any salary number.** Nothing in this video claims coaching placements, a job title, an employer, or a "$300,000 role." Those belong to the source material, not to us. No income claims, no salary figures, no "AI engineers make X." If a take drifts into any of them, that take does not air.

> [!WARNING]
> **Sources are research inputs, never on-screen citations.** The two videos this script was synthesized from are not named, quoted, shown, or screenshotted anywhere in the edit, and no b-roll frame includes their thumbnails, channel names, or UI. Same rule for the "standard Python course curriculum" visual in CH2: build it as our OWN generic container, never a screenshot of a real named course or brand. We are contrasting an approach, not attacking a product.

---

## Chapter map (the spine: CH1 carries the hook, there is NO separate cold open)

| # | Chapter | One-line | Target | Title card |
|---|---------|----------|--------|------------|
| CH1 | The shortcut is real | Hook: you can ship working Python in an hour with Claude Code, so why learn this? Because tools amplify, and the cost is skipping the part where you get good. | ~0:30 | OFF (pure hook, BED A starts with the video) |
| CH2 | What this playlist is | A complete Python course for one job, AI engineering: everything the job asks for, everything else cut. 76 runnable episodes. Roadmap tease + the skip exit. | ~0:30 | **ON, the VIDEO TITLE CARD "LEARNING PYTHON FOR AI ENGINEERING"** (BED B starts) |
| CH3 | Sixty seconds on Python | The abstraction ladder, binary up to English, Python one rung under human. `print(5 + 5)` lands. Python is the front door to the whole AI industry. | ~0:55 HARD CAP | OFF (continues BED B, flows straight in) |
| CH4 | What you actually need | Not TensorFlow/PyTorch. Four groups: fundamentals, APIs, files, environments. | ~1:15 | ON, "WHAT YOU ACTUALLY NEED" (BED C starts; this is the CH3 skip target) |
| CH5 | Build one project, four times | LLM call, then memory, then your documents, then tools. One system that got progressively more serious. | ~1:00 | ON, "BUILD ONE PROJECT, FOUR TIMES" (BED D starts) |
| CH6 | The one rule | Watching is why people do not learn. AI may explain and quiz, never write your code. The three readiness checks, holding into the close: subscribe and follow this playlist. | ~1:10 | ON, "THE ONE RULE" (BED E starts and resolves on the final frame) |

---

## Production conventions (this video)

### Line-tag legend (read this first; tags sit at the START of every line)

Each line does ONE job and is labeled. Tag = emoji + bracket, so it reads in raw text AND colors in the VS Code preview. Canonical definition: `screenplay.md` Convention 5.

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike's face on screen (gated, sparse, ONE sentence as punctuation) |
| 🗣️ `[COVER]` | spoken, voice over visuals (face off, the default) |
| 🔒 `[SAY-EXACT]` | spoken, the exact locked words (verbatim) |
| 🎬 `[SHOW]` | on-screen direction: b-roll, container, screen recording, receipt, transition |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |

- **Title-card flags (Convention 2 + the music-continuity rule):** a card lands ONLY at a chapter that STARTS A NEW music bed; a chapter that continues a bed flows in cardless, even if it teaches. The card set therefore falls out of the bed map in `## MUSIC-MOOD-PLAN`: **CH2** (which carries the VIDEO title card), **CH4**, **CH5**, **CH6**. CH1 is a pure hook (card OFF), CH3 continues BED B (cardless, which is deliberate: the 60-second primer should feel like a fast detour, not a section). Every card holds legible for at least one full second, led in BEFORE any baked pause.
- **FACE / COVER (Convention 3):** gated face, OFF by default. `[FACE]` = ONE sentence as punctuation, and the cut back to cover is always made explicit so it cannot carry across the following lines. Where the next SPOKEN line does that job, it is tagged `🗣️ [COVER]`; where the next line is not spoken (end of a beat or chapter), the return is a `🎬 [SHOW]` cut direction instead. **A `🗣️`/`👤` tag always means Mike opens his mouth, so a direction never rides one.** The vast majority of runtime is `[COVER]` over containers, screen recordings and b-roll. Every chapter gets exactly one face beat except CH1 (two: the hook question and the cost line) and CH6 (the struggle line, then the readiness payoff, which HOLDS into the closing ask, the one sanctioned face-forward stretch in the video).
- **Explainer visuals = system-design containers (Convention 4):** every teaching bullet gets a code-rendered HTML/SVG node-and-arrow diagram or card container, spotlight-swapped one at a time, full-frame. NOT tables, NOT AI images (every label, symbol and code line must be pixel-accurate). Build each container standalone at full frame, never cropped out of a deck.
- **Code on screen is PIXEL-ACCURATE** (revised by Mike, 2026-08-05). Any line of Python, any terminal output, any file tree is either a real recording OR a **code-rendered HTML/CSS container styled as an editor or terminal**, which is the house default (Convention 4: containers exist precisely so every character is exact). What stays banned is an **AI-generated picture of code** and any mocked-up screenshot that misrepresents a real product's UI. `print(5 + 5)` -> `10` is a container, not a screen capture.
- **Balance rule:** a rich diagram appears in full ONCE, then breaks into spotlight containers for the individual points. This bites hardest in CH4 (the four groups) and CH5 (the four-layer stack): show the whole shape once, then spotlight one element at a time as it is spoken.
- **Diction (persona `spoken_voice`):** whole numbers as words in spoken lines ("seventy six episodes", "forty hours"), exact digits on screen ("76 EPISODES", "40 HOURS"). No unglossed jargon: retrieval, chunking, virtual environments and agent are each glossed inside their own beat below; RAG appears only inside CH1's quoted prompt, where being opaque is the point; pip and uv ride unglossed as named tools, a deliberate call for this channel's peer-dev audience (they know package managers). Comma liberally for read-aloud pacing. **No em dashes anywhere**, spoken or on screen.
- **No premature summary:** CH2's roadmap line teases the shape without handing over the payoff. Nothing before CH4 states what the four things are, and nothing before CH6 states the rule.

---

## CH1: The shortcut is real  (hook)
**Register:** gear 2 lifting to a controlled 3 on the last two lines. Not hype, conviction. **Title card:** OFF (pure hook, flow straight in). **Face:** the hook question, and the cost line. **Music:** BED A starts, subtle from frame one, no cold-hot hit (see MUSIC-MOOD-PLAN).

> [!NOTE]
> This is the whole retention play. Do not rush it and do not undercut the tool. The Claude Code session on screen has to look genuinely impressive, because the argument only works if the shortcut is real first. The turn happens on "amplify", not before it. No greeting, no channel intro, no "hey guys."

**Beat 1: The concession (locked opening)**
🔒 `[SAY-EXACT]` 🗣️ `[COVER]` You can open Claude Code right now, type "build me a RAG app," and have working Python in about an hour.
🎬 `[SHOW]` **[R1-A] screen recording, real:** a live Claude Code session generating a working file fast. Real terminal, real file tree, real output. Let it run long enough to land as impressive. No caption, no snark overlay, nothing undercutting it.
👤 `[FACE]` So why would you spend three months learning this?
🗣️ `[COVER]` Because here's the part nobody tells you.

**Beat 2: The amplifier turn**
🗣️ `[COVER]` AI tools amplify whatever skill you already have. If you're already good, they make you dangerous. If you're not, they just let you produce bad code faster than you ever could before.
🎬 `[SHOW]` **[D1-A] the amplifier split**, system-design container, animated: ONE prompt node at the top, splitting into two paths. Left, SKILLED, arrow widens into shipped/working. Right, UNSKILLED, arrow widens into the same volume of output but flagged broken. Same input, same speed, two outcomes. The word AMPLIFIER sits on the split point. Build it in on "amplify", hold through both outcome lines.
💬 `[NOTE]` the container must not read as an insult to beginners. It is a statement about leverage, not about people. Neutral palette on both branches, no red X, no clown iconography.

**Beat 3: The real cost**
🗣️ `[COVER]` And the real cost isn't the bad code.
👤 `[FACE]` It's that you skipped the part where you get good, so you never do.
🎬 `[SHOW]` cut off the face the moment that sentence ends. No visual carry into what follows.
🎬 `[SHOW]` **[A1-A]** hold on a single quiet frame: someone scrolling past code they cannot read. Slow, no motion graphics, let the line sit. This is the beat the whole video pivots on; give it the extra half second. (The one AI-atmosphere asset in the video.)

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH1):**
> - The [R1-A] Claude Code recording contains no API keys, no account email, no client or project names, no unreleased work. Scrub or re-record on a clean throwaway folder.
> - "About an hour" is the honest claim for a scaffolded RAG app. If the recording lands materially faster or slower, tune the spoken number rather than the recording.
> - No competitor tool is disparaged on screen. Naming Claude Code is fine; the shortcut is presented as real and good.

---

## CH2: What this playlist is
**Register:** gear 2, plain and direct. **Title card:** **ON, and it is the VIDEO title card: "LEARNING PYTHON FOR AI ENGINEERING"** (BED B starts here, the card lands on the bed change). **Face:** the "complete course for one job" line. **Music:** BED B starts.

> [!NOTE]
> `SCRIPT.md` placed a title card at 0:30 to 0:33. Per the no-cold-open rule the opening IS Chapter 1, so that card is not a divider between an intro and the video, it is CH2's chapter card carrying the video title. It lands on the BED A to BED B change, using the video's ONE picked title-card transition (bucket 1, chosen once and reused for every card in this video).

**Beat 1: The deliberate cut**
👤 `[FACE]` This is a complete Python course for one job: AI engineering.
🗣️ `[COVER]` Open any standard "learn Python" course, and you'll spend weeks on things you will never use for that job.
🎬 `[SHOW]` **[D2-A] the struck-through curriculum**, our own container: a generic course outline, roughly twenty entries, with about two thirds of them striking through one after another. **Generic and unbranded, never a screenshot of a real named course.** The survivors stay lit.

**Beat 2: What is left**
🗣️ `[COVER]` So I went through what AI engineering actually asks for, and cut everything else. What's left is seventy six episodes. Every single one runs on your machine, no API key, nothing to install.
🎬 `[SHOW]` **[R2-A] receipt, real:** the actual playlist grid, scrolled slowly, with the episode count visible. Then **[D2-B]** a small stat container: "76 EPISODES · RUNS OFFLINE · NO API KEY".
💬 `[NOTE]` this is the authority beat, and it replaces every credential claim in the source material. Deliver it flat and factual, not as a boast. The curriculum is the argument.

**Beat 3: The tease and the exit**
🗣️ `[COVER]` Let me show you the shape of it. Starting with sixty seconds on what Python even is, and if you already know that, skip ahead to "what you actually need."
🎬 `[SHOW]` **[D2-C]** a skip cue card: the chapter name plus its timestamp, on screen for about two seconds, matching the YouTube chapter marker exactly. **Fill the timestamp in after the edit locks.**
💬 `[NOTE]` say the chapter by NAME, never by number. The source script said "skip to CHAPTER 2" using its own numbering, which does not match this screenplay's chapter numbers or the YouTube markers. The name plus the on-screen timestamp is unambiguous.
💬 `[NOTE]` the shape line teases without spoiling: do not list the four needs, the project ladder or the rule here.

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH2):**
> - **Episode count.** "76" must match the published playlist on the day of recording. If it has moved, change the spoken number and [D2-B].
> - **"No API key, nothing to install."** Confirm this holds for EVERY episode in the current playlist, not most of them. It is the strongest claim we make. If any episode needs a key or an install, the wording changes to the honest form.
> - The playlist grid capture shows no unlisted or draft episodes, and no personal browser data (tabs, bookmarks, account avatar).
> - The [D2-C] timestamp matches the final YouTube chapter marker for CH4.

---

## CH3: Sixty seconds on Python  (the capped primer)
**Register:** gear 2, brisk. This chapter moves. **Title card:** OFF (continues BED B, flows straight in). **Face:** one line only. **Music:** BED B continues.

> [!NOTE]
> **HARD CAP one minute.** This is the part most likely to lose an AI-motivated viewer, and the part Mike asked to minimize. If the recorded take runs long, this is the first chapter to tighten, before anything else in the video. Do not add examples, do not explain interpreters, compilers, bytecode or the PVM. Nothing in AI engineering needs it.

**Beat 1: Computers do not speak human**
🗣️ `[COVER]` Say "hey computer, calculate five plus five" out loud. Nothing happens.
👤 `[FACE]` Computers don't speak human.
🗣️ `[COVER]` Down at the bottom, all your machine actually understands is this. Ones and zeros.
🎬 `[SHOW]` **[D3-A] the abstraction ladder**, MARQUEE container, animated bottom up. Rung 1 BINARY (`01001000 01101001`) lands first, filling the frame.

**Beat 2: The ladder**
🗣️ `[COVER]` Above that, languages get steadily easier for people, and harder for machines. Assembly. C.
🗣️ `[COVER]` And at the top, closest to how you already think, Python.
🎬 `[SHOW]` **[D3-A]** continues building: ASSEMBLY, then C, then PYTHON, then HUMAN LANGUAGE at the very top. Each rung lands on its spoken word. Two axis labels run alongside the ladder: "easier for machines" pointing down, "easier for people" pointing up. Then the arrow REVERSES to show Python sitting one rung under human. That reversal is the single frame this chapter exists for.

**Beat 3: The whole idea**
🗣️ `[COVER]` `print(5 + 5)`. Ten. That's the whole idea. You write something close to English, and a translator handles the rest.
🎬 `[SHOW]` **[R3-A] screen recording, real:** a real editor, `print(5 + 5)` typed, run, `10` printed in a real terminal. Full frame, large enough to read on a phone.
🗣️ `[COVER]` That's it. That's what Python is. There is a lot going on underneath, and you do not need any of it today.

**Beat 4: Why this language**
🗣️ `[COVER]` What you do need: the entire AI industry runs on this one language. ChatGPT, Claude, image models, self driving systems. Python is the front door to all of it.
🎬 `[SHOW]` **[D3-B]** a front-door container: PYTHON as the single entry node, arrows out to the named categories. Product marks only where we have clean rights to show them, otherwise category labels. Close the chapter on this frame.
🔍 `[VERIFY]` logo usage on [D3-B]: use plain text category labels if any mark is doubtful. A wordmark is never worth a claim.

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH3):**
> - The [R3-A] recording actually prints `10`. Record it, do not fake it.
> - Binary string on rung 1 decodes to something harmless and real, not gibberish. Someone will decode it.
> - "The entire AI industry runs on this one language" is a deliberate broad-strokes claim about the ecosystem's lingua franca. Keep it as spoken framing, do not put a percentage or a market-share number on screen behind it.
> - Chapter runtime at the rough cut is at or under one minute. If not, tighten here first.

---

## CH4: What you actually need  (payload 1, the skip target)
**Register:** gear 2, confident and list-clean. **Title card:** ON, "WHAT YOU ACTUALLY NEED" (BED C starts here, card on the bed change). **Face:** the closing "whole list" line. **Music:** BED C starts.

> [!NOTE]
> Viewers who took the CH2 skip land HERE, cold. The chapter has to stand on its own for three seconds: the card plus the opening question does that work, so do not open on a callback to CH3.

**Beat 1: Start with what you don't need**
🗣️ `[COVER]` So what do you actually need? Start with what you don't. Most people hear "AI engineering" and think TensorFlow and PyTorch.
🗣️ `[COVER]` Those are for training models from scratch, which, as an AI engineer, you will almost never do. You're building systems on top of models other people already trained.
🎬 `[SHOW]` **[D4-A]** brief, three seconds maximum: the two framework marks with a neutral "not this, not yet" treatment, then a small flow showing TRAIN A MODEL as one lane and BUILD ON TOP OF A MODEL as the lane we are in. Do not dwell, and do not disparage the frameworks; they are simply a different job.

**Beat 2: The four groups**
🗣️ `[COVER]` There are four things you need instead.
🗣️ `[COVER]` One, the fundamentals. Variables, lists, dictionaries, conditionals, loops, functions, and just enough object oriented programming to read someone else's code.
🗣️ `[COVER]` Two, APIs. Because calling APIs is most of what this job actually is. HTTP requests, JSON, handling your keys without leaking them, and dealing with it properly when the call fails at three in the morning.
🗣️ `[COVER]` Three, files. Loading documents, saving outputs, reading logs.
🗣️ `[COVER]` Four, and this is the one everybody skips, environments. Virtual environments, pip, uv. Two projects need two different versions of the same library, and without isolation, installing one quietly breaks the other.
🎬 `[SHOW]` **[D4-B] the four groups**, the chapter's marquee. Show the full four-card shape ONCE as the "four things" line lands, then spotlight ONE card full-frame per group as it is spoken, with the sub-items building inside it. Completed cards stay visible as a small persistent strip so the stack reads as cumulative. Palette: one color per group, reused later in CH5 so the mapping is felt, never stated.
🎬 `[SHOW]` as each group card lands, flash the matching season strip from the playlist for about a second. The curriculum mapping should be obvious without a word said about it.
🎬 `[SHOW]` **[D4-C]** on the environments line only: a small two-project container, PROJECT A needs v1, PROJECT B needs v2, one shared install, and the collision. This is the one item that needs a picture rather than a label, because it is the one everybody skips.

**Beat 3: Close the list**
👤 `[FACE]` That's the list. That's the whole list.
🎬 `[SHOW]` cut off the face on that sentence. The [D4-B] four-card overview comes back full frame for one held beat as the chapter ends.

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH4):**
> - The four groups match the actual season structure of the playlist, in this order. If the seasons are ordered differently, the flashed strips must match the spoken order or the mapping breaks.
> - `uv` is named correctly and is still the tool the curriculum teaches at record time. This ecosystem moves fast; confirm against the current episodes.
> - Framework marks in [D4-A] are used nominatively and neutrally. If in doubt, plain text labels.
> - The "three in the morning" line stays a texture line, not a claim about on-call work.

---

## CH5: Build one project, four times  (payload 2, the strongest visual)
**Register:** gear 2, warm and concrete. **Title card:** ON, "BUILD ONE PROJECT, FOUR TIMES" (BED D starts here, card on the bed change). **Face:** the "four times" line. **Music:** BED D starts.

> [!NOTE]
> The stack is the strongest visual in the video. Give it room, let the layers land on the words, and do not cut away from it for b-roll. Every previous layer stays on screen as the next one arrives; nothing is ever thrown away. That visual IS the argument.

**Beat 1: What you build matters**
🗣️ `[COVER]` Then you build. And what you build matters more than people think. Standard portfolio advice is to go train a simple model. That is not AI engineering.
👤 `[FACE]` Instead, build one project, four times.
🎬 `[SHOW]` cut off the face on that sentence, straight into the [D5-A] stack beginning to build.

**Beat 2: The four upgrades**
🗣️ `[COVER]` Start by calling an LLM. A script that takes some text, sends it to a model, gets a response back, does something useful with it. Done properly, that one project teaches you JSON, requests, error handling and environment management all at once.
🗣️ `[COVER]` Then give it memory, so it remembers the conversation instead of forgetting you every single message.
🗣️ `[COVER]` Then point it at your own documents. Now you're doing retrieval, chunking, similarity.
🗣️ `[COVER]` Then give it tools, and let it decide which ones to use. That's an agent.
🎬 `[SHOW]` **[D5-A] the four-layer stack**, THE MARQUEE OF THE VIDEO, animated, one layer per spoken upgrade:
  1. **CALL** the base box: YOUR SCRIPT, arrow to MODEL, arrow back. Satellite tags in the CH4 group colors, JSON, REQUESTS, ERROR HANDLING, ENVIRONMENTS, so the mapping to the previous chapter reads visually.
  2. **MEMORY** a conversation-store node clips onto the same box. The base does not move or shrink.
  3. **DOCUMENTS** a retrieval path clips on: YOUR DOCS, arrow to CHUNKS, arrow to SIMILARITY SEARCH, arrow into the existing model call.
  4. **TOOLS** a tool belt clips on with a decision arrow from the model out to the tools, and the word AGENT lands on the finished system.
  Camera pulls back slightly at each layer so the whole assembly stays in frame. **Never a rebuild, never a wipe, always an addition.**
🎬 `[SHOW]` on "That's an agent", hold the completed stack for a full beat with the AGENT label lit. This is the frame people screenshot.

**Beat 3: The payoff**
🗣️ `[COVER]` You don't end up with four toy projects. You end up with one system that got progressively more serious, which is exactly what the job looks like.
🎬 `[SHOW]` **[R5-A] receipt, real:** the four capstone project files or folders in a real file tree, side by side with the finished stack. Real repo, real names.

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH5):**
> - **The four capstones exist and are in this order** in the current curriculum: call, memory, documents/retrieval, tools/agent. Confirm against the actual repo before recording, and match [R5-A] to the real folder names.
> - The retrieval layer is described in plain language (your own documents, chunking, similarity) and never leans on the acronym as an explanation. "RAG" appears only in CH1's quoted prompt, where it is deliberately unexplained jargon coming out of a tool.
> - **Evals are not mentioned anywhere in this video.** There is no evals capstone in the playlist, and this script describes what exists. See OPEN QUESTIONS item 5.

---

## CH6: The one rule  (payload 3, the emotional payoff + the close)
**Register:** gear 2 lifting toward 3 on the struggle line, then settling warm for the close. This is the closest the video gets to conviction pitch, and it still stays calm. **Title card:** ON, "THE ONE RULE" (BED E starts here, card on the bed change). **Face:** the struggle line, then the payoff line, which HOLDS into the closing ask (the one sanctioned face-forward stretch). **Music:** BED E starts, carries the whole chapter, and resolves on the final frame.

**Beat 1: Watching is the trap**
🗣️ `[COVER]` One rule. It decides whether any of this works.
🗣️ `[COVER]` Most people learn Python by watching. You can sit through forty hours of someone else typing, and retain almost nothing. Watching is why people don't learn.
🎬 `[SHOW]` **[D6-A] the split comparison**, animated: LEFT, a progress bar crawling across a "40 HOURS" tutorial with a retention meter flat near zero. RIGHT, a real screen recording of one broken line being typed, failing, and getting fixed, with the meter climbing. Both sides run at once. The right side is real footage, not a graphic.
💬 `[NOTE]` this beat is aimed at a viewer who is currently watching a video. That is the point, and it is why the next line hands them the rule instead of more watching. Do not soften it, and do not wink at it.

**Beat 2: The rule**
🗣️ `[COVER]` So while you're building the foundations: AI is allowed to explain things to you, and quiz you. It is not allowed to write your code.
🎬 `[SHOW]` **[D6-B] the rule card**, full frame, two columns: ALLOWED, explain, quiz, review after you've tried. NOT ALLOWED, write it for you. Held long and clean, this is a screenshot frame.
🗣️ `[COVER]` Yes, that's slower. That's the point.
👤 `[FACE]` The struggle is the part where the learning happens.
🎬 `[SHOW]` cut off the face on that sentence. Beat 3 opens back on cover.

**Beat 3: The three readiness checks**
🗣️ `[COVER]` You'll know you're through this phase when three things are true. You can read unfamiliar code and say what it does. You can debug a failing test on your own. And you can look at a system and guess where it's going to break.
🎬 `[SHOW]` **[D6-C] the three checks**, checkbox container, one line landing per spoken criterion, then **held on screen long enough to screenshot**, at least three full seconds with nothing else moving. People save this frame; treat it as a deliverable, not a transition.
👤 `[FACE]` Hit those three, and you've earned the right to let the AI drive.
🎬 `[SHOW]` the face HOLDS from this sentence straight into Beat 4. No cutaway; the payoff and the ask are one unbroken face-forward stretch.

**Beat 4: The ask (close)**
> [!NOTE]
> The only ask in the video, delivered as the obvious next move, not a pitch: the previous chapters made the case, the close just points at the door. One ask, once. No stacked "like, comment, subscribe, ring the bell", no earlier CTA anywhere. The register stays calm right through it.

👤 `[FACE]` HOLD So if you want to learn Python for AI engineering, subscribe, and follow this playlist.
👤 `[FACE]` HOLD I'll see you in the next one.
🎬 `[SHOW]` on the ask, a clean subscribe prompt plus the playlist card together in one frame. Both visible at once, held. No animated arrows, no sound effect, no shouting graphic.
🎬 `[SHOW]` end card: playlist pointer plus channel mark, BED E resolving under it, then out.
💬 `[NOTE]` no crypto-channel CTA and no community link; this is a different channel with a different ask. The subscribe line is a plain bullet, say it your way; the shape that matters is subscribe + follow this playlist, as one sentence.

> [!IMPORTANT]
> **🔍 VERIFY before screen (CH6):**
> - "Forty hours" is illustrative framing, not a cited statistic. Keep it spoken; do not put a sourced-looking number or a study citation on screen behind it.
> - The retention meter in [D6-A] carries no numbers and no axis, it is a mood indicator. A quantified retention chart would be an invented statistic and does not air.
> - [D6-C] holds at least three seconds on the final state, verified on the render, not assumed.
> - The rule as worded (explain and quiz yes, write your code no) matches whatever the playlist episodes tell people to do. If an episode hands out code, the rule and the episode disagree in public.
> - The subscribe frame in Beat 4 uses the channel's own mark. No fabricated subscriber count, no fake notification graphic.
> - The playlist card shown in Beat 4 matches the real playlist (title and ordering) on publish day.

---

## MUSIC-MOOD-PLAN

**Mike's brief for this video: subtle, steady, no intense intro.** So the whole plan sits in a narrow low-energy band, and the five beds are FLAVOR changes at a roughly constant level, never energy steps. Nothing hits cold and hot at the top, nothing peaks, nothing ends on an epic hit. The bed changes exist to mark the act structure (and to carry the title cards per Convention 2), not to lift the room.

All candidates are picked from `video-creation/assets/music/library.json` by the machine-written analysis meta (aggression, opening, ending, env, segments), per music-sourcing SKILL.md §2c. No listening pass.

| Bed | Chapters | Mood + intent | Bed change? | Candidates (primary first) |
|---|---|---|---|---|
| **A** | CH1 | **QUIET, slightly unresolved.** Minimal and reflective under the hook, present from frame one but never announcing itself. Must have a STEADY or AMBIENT opening; a cold-hot opener is disqualifying for this video. | STARTS the video (card OFF) | **Old Moon** (Lincoln Davis, aggr 49, opening `steady`, ending `fade`, 142s, "low-energy underscore, minimal, beautiful"; file `Lincoln_Davis_Old_Moon_instrumental_2_21.mp3`, code `PA5AM8QJQJURZVWY`; three instrumental section cuts of 43 to 50s exist, one of which covers CH1 outright). Alts: **Theta Rest** (Outside The Sky, aggr 28, `ambient`, calm reflective bed, 204s, code `VHWICIAB6U5Y9OHE`) · **Price To Pay** (Kevin Graham, aggr 26, `ambient`, 160s, code `YTJL2UP1UZURHDZN`). |
| **B** | CH2 + CH3 | **UNDERSTATED EXPLANATORY.** The orientation movement: what this is, then the fast primer. Has to sit under the densest teaching VO in the video without pulling focus. | NEW BED at CH2 → **the VIDEO TITLE CARD** | **Accomplishments** (`accomplishments-subtle`, 305s, Mike-designated in the catalog for NON-HYPE sections: explanatory passages, calm walkthroughs; file `accomplishments-SBA-346786802.mp3`, source `free_local`, no Soundstripe code needed). Alts: **Slow Rise** (EVOE, aggr 33, `build`→`resolve`, use an INSTRUMENTAL cut, code `LMNT8RRL5UMI78DW`) · **Theta Rest**. |
| **C** | CH4 | **CALM FORWARD MOTION.** A list chapter needs quiet momentum so four groups do not feel like four stops. Chill electronic texture reads as tech without reading as hype. | NEW BED at CH4 → card "WHAT YOU ACTUALLY NEED" | **Lightbeams** (MJ Cook, 184s, catalog vibe "low-energy synthwave, chill, cruising, atmospheric"; file `MJ_Cook_Lightbeams_instrumental_3_03.mp3`, code `JOKCE60CX9DFYHRW`. ⚠️ its measured aggression is 86, driven by transient density rather than loudness, so it MUST be auditioned against the subtle brief before it is locked. Section cut `..._0_41-1.wav` measures 48 and is the calmer flavor, but at 41s it does NOT cover the ~1:15 chapter on its own; if the calm cut wins the audition, the placement agent carves the matching quiet passage out of the FULL file instead, or falls back to an alt). Alts: **Slow Rise** instrumental · **Old Moon** (different section cut than BED A). |
| **D** | CH5 | **GENTLE BUILD.** The stack assembles layer by layer, and the bed rises with it, still subtle. Ends resolved, not hit. | NEW BED at CH5 → card "BUILD ONE PROJECT, FOUR TIMES" | **Slow Rise** (EVOE, aggr 33, `build`→`resolve`, 276s, "inspiring, hopeful, reflective, atmospheric, building"; **use the INSTRUMENTAL cut** `EVOE_Slow_Rise_instrumental_4_36-4.wav`, the primary file is a background-vocals mix; code `LMNT8RRL5UMI78DW`). Alts: **Mighty Hand** (Third Age, aggr 31, `build`→`resolve`, 285s, code `LWFYBEWYSTPY7GCD`) · **Lightheart** instrumental. |
| **E** | CH6 (incl. the close) | **WARM RESOLVE.** Carries the rule, the three checks, the readiness payoff and the closing ask as one movement, and lands the final frame on a resolve, not an epic hit. | NEW BED at CH6 → card "THE ONE RULE" | **Lightheart** (Cody Martin, aggr 44, `build`→`resolve`, 185s, "inspiring, building"; **use the INSTRUMENTAL cut** `Cody_Martin_Lightheart_instrumental_3_05-3.wav`, the primary file is a background-vocals mix; code `KJJXYONMGGIIAJIU`). Alts: **Mighty Hand** · **Slow Rise** instrumental carried on from BED D with a section change instead of a track change. |

**Constraints this plan must satisfy (longform-edited.md #10 + house rules; execution belongs to `music-placement-strategist` post-record):**
- Music covers EVERY chapter, no silent stretch. Loop or carve any bed shorter than its span. The longest spans are BED C (~75s) and BED E (~70s) and every PRIMARY full-length candidate exceeds every span, so no looping should be needed. (Section CUTS are a different story: several are shorter than their span, see the Lightbeams flag.)
- Inter-bed breath at each of the four changes (CH1→CH2, CH3→CH4, CH4→CH5, CH5→CH6). The breath is what sells a card landing; it matters more here than usual because the beds themselves are so close in level.
- **No cold-hot openings anywhere in this video, and no epic-hit endings.** That is a hard filter on any substitution.
- Measure LUFS first. Beds sit ~16 to 18 dB under the VO. Given the calm register, start at the quieter end of that band, and duck under every screen-recording beat that has real terminal audio.
- Where a folder ships both a background-vocals mix and instrumental cuts, the INSTRUMENTAL goes under VO. Flagged above for Slow Rise and Lightheart.
- Soundstripe `yt_license_code`s above go in the YOUTUBE description only. The `accomplishments-subtle` track is `free_local` with no code; confirm its license terms cover this channel before it is locked.
- **Hand-off:** this plan fixes the sonic identity and the bed-change map that drives the title cards. In-points, carve points, per-bed dB, ducks and breath placements get set by **`music-placement-strategist`** against the FINAL recorded spine.

> [!IMPORTANT]
> Every track title, file and code above is a PROPOSED pick and must be reconciled against `video-creation/assets/music/library.json` before use (file exists, code matches, instrumental cut available where flagged). Treat the codes as candidates, not confirmed. Lightbeams in particular is flagged for an audition against the subtle brief.

---

## VISUAL-PLAN (marquee 🎬 [SHOW] cues; pointers for the coverage-strategist, not the full cover plan)

**The centerpieces (build these first, they carry the video):**
1. **[D5-A] the four-layer stack** (CH5): call → memory → documents → tools, each layer clipping onto the last, nothing ever removed, AGENT landing on the finished system. The single most important sequence in the video. Colors inherit from the CH4 group palette so the two chapters visibly connect.
2. **[D3-A] the abstraction ladder** (CH3): binary → assembly → C → Python → human, built bottom up on the spoken words, then the arrow reverses to place Python one rung under human.
3. **[D4-B] the four groups** (CH4): full shape once, then one card spotlighted full-frame per group, completed cards persisting as a strip, playlist season strips flashing against each.
4. **[D6-C] the three readiness checks** (CH6): a clean checkbox card held at least three seconds on its final state. Built to be screenshotted.
5. **[D1-A] the amplifier split** (CH1): one prompt, two outcomes, same speed. Neutral on both branches.

**Supporting containers:** [D2-A] struck-through generic curriculum · [D2-B] "76 EPISODES · RUNS OFFLINE · NO API KEY" stat card · [D2-C] skip cue with timestamp · [D3-B] Python as the front door · [D4-A] train-vs-build lanes (3s max) · [D4-C] the two-projects dependency collision · [D6-A] 40 hours vs one broken line · [D6-B] the allowed/not-allowed rule card.

**Real recordings and receipts (never a graphic, never AI):** [R1-A] the Claude Code session · [R2-A] the playlist grid · [R3-A] `print(5 + 5)` printing `10` · [R5-A] the four capstone folders · the CH6 close's subscribe-plus-playlist frame, built from the channel's own mark and the real playlist.

**Guardrails:** every character of code, every terminal line and every file name on screen is real and pixel-accurate, built as a code-rendered container or captured from a real machine. AI image generation is reserved for the text-free atmosphere layer only, which in this video is exactly one asset: **[A1-A]**, the CH1 "scrolling past code" frame. No invented statistics on screen, ever, including behind a spoken illustrative number.

---

## Facts + receipts (sources)

This video makes almost no external factual claims, which is deliberate: the authority comes from the curriculum, not from cited numbers. The claims that DO need checking are all curriculum facts, and their source of truth is the published playlist plus the course repo, not a research document. There is no `DATA.md` for this project and none is needed unless a statistic gets added.

The load-bearing set, all repeated in the per-chapter VERIFY boxes: the episode count (76) · "no API key, nothing to install" holding for every episode · the four capability groups matching the season structure and their order · the four capstones existing in the order call, memory, documents, tools. Every one of these is checked against the live playlist and repo within a few days of recording.

`SCRIPT.md` was synthesized from two third-party videos. They are research inputs only: never named, quoted, shown or linked, and no third-party links go in the description.

---

## OPEN QUESTIONS / NEXT SESSION

**Mike to decide:**
1. ~~Face spine or MIKE-CLONE VO.~~ **RESOLVED by the recording (2026-08-05): face spine.** Recorded to camera on green screen, spine locked at `spine/ALL.c.desilenced.mp4` (5:05). Never matte the green screen (house rule). See `AS-RECORDED.md`, which supersedes this screenplay wherever they differ.
2. **Working title.** "Learning Python for AI Engineering" (the playlist name, on the title card as scripted) versus a more search-shaped alternative, for example "The Only Python You Need for AI Engineering" or "Don't Let AI Write Your Code Yet."
3. **Title-card texts** as proposed: the video card, then "WHAT YOU ACTUALLY NEED", "BUILD ONE PROJECT, FOUR TIMES", "THE ONE RULE".
4. ~~Close: clean playlist CTA, or add a subscribe ask.~~ **RESOLVED (Mike, 2026-08-05, twice):** first, the ask is subscribe plus follow the playlist; second, the standalone close chapter is CUT and the ask lives at the very end of CH6 (Beat 4), holding off the readiness payoff. The ask appears nowhere else.
5. **The evals gap** (flagged at the bottom of `SCRIPT.md`). The playlist ladder is call → memory → documents → agent, with no LLM-as-judge or evals capstone. The video describes what exists, so nothing changes on screen. But if you want to add an evals capstone to the curriculum, the natural slot is between documents and agent, or as a fifth, and CH5's stack visual would grow a layer. Curriculum decision, not a script decision.
6. **CH3's fate if the take runs long.** Scripted at a hard one-minute cap. If the recorded video overruns the six-minute band, confirm CH3 is the first place to cut rather than anything in CH4 to CH6.
7. **[R1-A], the Claude Code recording.** Confirm what it builds. A RAG app matches the spoken line, but it needs to look genuinely impressive in about fifteen seconds of screen time, so a smaller, faster, visibly working scaffold may sell it better.

**Live 🔍 VERIFY checklist (run within a few days of recording):**
- [ ] Episode count is 76 on the published playlist → tune the spoken number and [D2-B]
- [ ] "No API key, nothing to install" holds for EVERY episode (stated once, CH2, and it is the video's strongest claim)
- [ ] Four capability groups match the season structure AND their spoken order
- [ ] `uv` is still the environment tool the curriculum teaches
- [ ] Four capstones exist in order: call, memory, documents, tools/agent → match [R5-A] to real folder names
- [ ] [D2-C] skip timestamp matches the final YouTube chapter marker for CH4
- [ ] The CH6 close's playlist card matches the real playlist (title, ordering) on publish day
- [ ] Every screen recording scrubbed of keys, emails, client names and personal browser data
- [ ] [R3-A] actually prints `10`, recorded not mocked

**Then:** Mike gates this screenplay → build the containers and the BROLL-PLAN off `## VISUAL-PLAN` → record → Phase 1 to 4 per `longform-edited.md` → `music-placement-strategist` carves the beds on the final spine.

---

## Adaptation notes (this screenplay vs `SCRIPT.md`)

Recorded so the deltas are deliberate and traceable, not drift.

| `SCRIPT.md` | Here | Why |
|---|---|---|
| "Cold open, 0:00 to 0:30" | **CH1** | Hard rule: there is no cold open on this track, the opening IS Chapter 1 and nothing precedes it. |
| Separate "Title card, 0:30 to 0:33" | CH2's chapter card, carrying the video title | Cards land on music-bed changes (Convention 2). The BED A to BED B change is exactly at 0:30, so the card lands where the script wanted it while obeying the rule. |
| Sections numbered 1 to 4 | CH3 to CH6 (7 chapters total) | The screenplay counts every chapter including the hook and the close, so the numbers necessarily differ. Handled in-script by having Mike name the skip target instead of numbering it. |
| "skip to [CHAPTER 2]" | "skip ahead to what you actually need", plus an on-screen timestamp | Chapter numbers do not survive the renumbering, and a spoken number is fragile if the edit moves. A name plus the on-screen marker is stable. |
| Em dashes in several spoken lines | commas, colons and periods | Persona rule: no em dashes anywhere, spoken or on screen. |
| "This is not a complete Python course. That's the point." | "This is a complete Python course for one job: AI engineering." | Mike, 2026-08-05: the playlist IS the course he is building, so the trailer must never disown the word "course." The curation contrast survives, flipped positive; the cut-everything-else claim lands one line later in Beat 2 unchanged. |
| "Two things to decide", item 1: the "building this while learning it" angle | **Declined and barred**, see the WARNING box | It was a suggestion to Mike, never a spoken line. Mike declined it 2026-08-05; it also collides with the channel's ON-SCREEN AUTHORITY rule. Authority is routed through the curriculum instead, which the script already set up. |
| The whole "Close, 5:10 to 5:40" section (run-the-folder demo, "next video" preview, episode 2 queued) | **CUT.** The video ends at CH6: the readiness payoff holds into a one-sentence ask (subscribe + follow this playlist) and the end card | Mike, 2026-08-05: previewing the next video is too much; conclude at the emotional peak instead of walking the viewer through episode 2. The trailer's job is to make them click it, not describe it. |
| No CTA anywhere | **Subscribe plus follow this playlist**, one sentence, CH6 Beat 4 only | Mike, 2026-08-05: this video is the trailer for the playlist, so it earns exactly one ask. |
| "$300,000 salary" framing, already left out | Left out, and promoted to a WARNING box | It is a claim, and it is not ours. A box makes it a gate rather than a footnote. |
| On-screen notes written as prose | 🎬 `[SHOW]` lines with asset IDs | So the coverage plan, the containers and the EDIT-PLAN can all reference the same IDs with zero orphans. |
| No music direction | Full MUSIC-MOOD-PLAN, five subtle beds | Mike's brief: steady, subtle, no intense intro. The bed map also determines the title cards. |
