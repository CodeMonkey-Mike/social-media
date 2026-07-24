# Save Tokens with Sub-Agents — SCRIPT

**Video 3** on [@aiEngineeringSimplified](https://www.youtube.com/@aiEngineeringSimplified)
Source outline: `OUTLINE.md` (from the real 2026-07-09 session: 1 livestream → 7 vertical shorts).
**This script: the 10-11 minute cut.** All 10 outline sections kept at explainer depth.

## Title — ⬜ PICK ONE (Mike)
**"Stop Running Everything On Your Biggest Model At Max Effort"**
_Alternates: "I Cut My Agent's Token Bill By Delegating To Sub-Agents (The Pattern)" · "Sub-Agents, Model Routing, And Effort Levels: The Token-Saving Stack"_

---

## ⚠️ OUTLINE CORRECTION APPLIED (Mike approved 2026-07-15)

The outline's Lever 2 was **factually inverted** and is fixed throughout this script.

- **Fable 5 is NOT the cheap/fast model.** It is Anthropic's most capable widely released model, and it
  costs **$10 / $50 per 1M tokens (in/out) versus Opus 4.8 at $5 / $25**. Fable is **2x the price of Opus**,
  and it runs *longer* per turn, not faster. The outline's "cheap/fast (Fable) for judgment, expensive
  (Opus) for code" and Appendix A's "cheap to run it hard on a small model" are both wrong.
- **The repo configs are correct and unchanged** (verified against `.claude/agents/*.md` on 2026-07-15).
  What was wrong was only the *explanation*, not the setup.
- **The honest reframe this script teaches:** the two dials are MODEL and EFFORT, set independently per
  slice. You match the **model to the KIND of thinking** (strongest reasoner for the hardest judgment
  call, strong coder at precision effort for bug-sensitive code), and **effort to the difficulty**. The
  token savings come from **Lever 1 (isolation)** plus not defaulting everything to max effort. The two
  levers connect: **isolation is what buys you the right to be expensive where it counts.**
- **Token-table claim softened.** ~1.5M is *tokens processed across turns*, not resident context size.
  This script never says "the orchestrator's context would have grown by 1.5M." It says the orchestrator
  kept the ~1-2K reports instead of carrying each 100-220K transcript and re-sending it on every step.

---

## How this script works (format spec, same as need lang-graph)

Every word below is spoken **verbatim** by the **Higgsfield MIKE-CLONE** voice (Seed Speech, browser-driven
via `skills/higgsfield-voice/`). Numbered **chunks of 2-3 sentences** (the hallucination-safe window), one
generation per chunk. Each chunk carries a **🎬 SHOW** line: what's on screen while it plays (direction, not
spoken).

- **Register:** persona gear 2, confident conversational teaching. Peer-EXPERT authority (⛔ never
  co-beginner). Keep: direct second-person, translate-the-jargon, homespun analogy, "Now," transitions,
  sparse "right?". Drop: crypto-hype devices, profanity.
- **No em dashes** anywhere in chunk text (persona rule).
- **Structure = chapters; TTS unit = chunks.** Generation source will be `tts-chunks.json` (built after
  script approval, with pronunciation spellings + the caps-on-short-words rule applied).
- **Code cards + narrated code:** whenever a chunk teaches a config mechanism, the container shows the
  REAL file from this repo (3-8 lines, one highlighted line) **and the narration walks the viewer through
  it**, using the reference-the-screen device ("right here", "look at this", sparingly). Code chunks:
  15, 17, 21, 22, 26, 38, 39, 40.
- **Every config on screen is copy-pasted from the live repo**, not retyped. Sources:
  `.claude/agents/{clip-strategist,tighten-strategist,remotion-builder}.md`,
  `.claude/commands/repurpose-livestream.md`.

> [!CAUTION]
> **Accuracy pass (`skills/accuracy-pass/accuracy-pass.md`) is a MANDATORY gate before any VO generation.**
> Highest-risk claims, in priority order:
> 1. **Pricing (c16).** Re-verify Fable 5 / Opus 4.8 / Haiku 4.5 per-1M rates against live docs at build
>    time. Prices move. If they have moved, the *relative* teach (Fable above Opus) must be re-checked, not
>    just the digits, because the whole chapter depends on the direction.
> 2. **Model names + tiers (c14-c16).** "Fable 5 is the most capable widely released model" and "Opus 4.8".
> 3. **Effort levels (c17-c18).** `low / medium / high / xhigh / max`, default `high`, `xhigh` is the
>    recommended setting for most coding and agentic work.
> 4. **Frontmatter fields (c38-c40).** `name / description / tools / model / effort` in `.claude/agents/`,
>    and `model / effort` in `.claude/commands/`. Diff against the live files before rendering.
> 5. **Session numbers (c28-c31).** Re-add the token table from OUTLINE.md; it sums to ~1.53M.

> [!NOTE]
> **TTS normalization (apply per chunk at generation).** sub-agent → "sub agent" (no hyphen pause),
> sub-agents → "sub agents", YAML → "yamel", JSON → "jason", API → "A P I", LLM → "L L M",
> CLI → "C L I", `.md` → "dot M D", xhigh → "X high", QA → "Q A", Remotion → "ruh MOE shun",
> Opus 4.8 → "Opus four point eight", Fable 5 → "Fable five", Haiku → "HIGH koo",
> 223,626 → "two hundred twenty three thousand", 1.5M → "one point five million".
> Caps markup below is light; apply the caps rule (no ALL-CAPS on short words) when building
> `tts-chunks.json`.

## Chapter map (target ≈ 10.5 min at video-2 pacing, ~14-15 s/chunk)

| Ch | Title | Chunks | Outline section |
|---|---|---|---|
| 1 | Hook: one livestream, seven shorts | 1-3 | Cold open |
| 2 | The problem: one agent, one growing context | 4-7 | Seg 1 |
| 3 | Lever 1: context isolation | 8-13 | Seg 2 |
| 4 | Lever 2: two dials, and the one everyone gets backwards | 14-18 | Seg 3 |
| 5 | The advisor / executor pattern | 19-23 | Seg 4 |
| 6 | Self-QA: push verification DOWN | 24-26 | Seg 5 |
| 7 | The receipts | 27-31 | Seg 6 |
| 8 | Bonus: they run in parallel | 32-33 | Seg 7 |
| 9 | Where NOT to delegate | 34-37 | Seg 8 |
| 10 | Build it in Claude Code | 38-41 | Seg 9 |
| 11 | Wrap + CTA | 42-44 | Seg 10 |

---

## Chapter 1 — Hook: one livestream, seven shorts

**Chunk 1 — the receipt**
> One livestream went into this pipeline, and seven finished vertical shorts came out the other end. Along
> the way, about a MILLION and a half tokens of work got done. And the agent that ran the whole thing never
> held more than a sliver of it.

🎬 SHOW: title card, then a single livestream file icon fanning out into 7 finished short thumbnails, with a
running token counter ticking up to ~1.5M.

**Chunk 2 — the trick**
> That's not a trick of the billing. That's the whole technique, and it has a name: SUB-AGENTS. You hand the
> messy work to a separate agent with its own fresh context, and you keep only the answer it hands back.

🎬 SHOW: the core diagram (reused in ch3, ch5, ch7): a small ORCHESTRATOR node, a fat SUB-AGENT bubble beside
it, a thin arrow returning from the bubble.

**Chunk 3 — the promise**
> So here's what I'm gonna show you. The two levers that actually save the tokens, the exact pattern I run in
> production, the real numbers off a real session... and the honest part, the two places where handing work to
> a sub-agent blew up in my face.

🎬 SHOW: hold the diagram, overlay a 4-item container: "1. Isolation · 2. Routing · 3. The receipts ·
4. Where it breaks".

---

## Chapter 2 — The problem: one agent, one growing context

**Chunk 4 — the naive way**
> Let's start with what most people build, because it's the obvious thing. ONE agent, one context window, and
> it does everything. Reads the files, writes the code, runs the render, checks its own work.

🎬 SHOW: single agent node with a small context bar underneath, tasks queuing into it.

**Chunk 5 — the balloon**
> And here's the problem with that. Every file it reads, every tool result, every render log... it all STAYS in
> the window. That transcript doesn't just sit there, it gets re-sent on every single step after it.

🎬 SHOW: the "context balloon": the context bar inflating with each step, each step re-transmitting the whole
bar (animated re-send arrows).

**Chunk 6 — the cost shape**
> So your cost doesn't scale with the work. It scales with the CONTEXT, and the context only grows. Step fifty
> is dragging everything steps one through forty-nine ever touched.

🎬 SHOW: two curves: "work done" (linear) vs "tokens paid" (quadratic), the gap between them shaded.

**Chunk 7 — context rot**
> And there's a second tax nobody puts on the invoice. As that window fills up with stale detail, the model
> gets WORSE. People call it context rot, and you feel it as the agent forgetting a rule it followed perfectly
> forty minutes ago.

🎬 SHOW: container: quality line degrading as the context bar fills; label "context rot".

---

## Chapter 3 — Lever 1: context isolation

**Chunk 8 — what a sub-agent is**
> Lever one is context isolation, and a sub-agent is the thing that gives it to you. When you spawn one, it
> gets its OWN fresh context window. Not a slice of yours. Its own.

🎬 SHOW: the core diagram: orchestrator's context bar (small, blue) beside the sub-agent's context bar (empty,
separate color) with a hard wall between them.

**Chunk 9 — what happens inside**
> And inside that window, it goes to town. It reads files, writes code, runs tools, checks itself... thirty,
> fifty, seventy-seven tool calls deep. A hundred thousand, two hundred thousand tokens of working transcript.

🎬 SHOW: the sub-agent bubble filling fast, tool-call counter spinning 0 → 77, token counter → 223,626.

**Chunk 10 — what comes back**
> And when it's done, what crosses back to the orchestrator? The final message. That's it. A compact plan or a
> build report, call it one to two thousand tokens.

🎬 SHOW: the fat bubble beside a thin arrow labeled "~1-2K"; the orchestrator's bar barely moves.

**Chunk 11 — the trick, stated plainly**
> So look at what just happened, because this IS the trick. You paid for that context ONCE, in isolation,
> instead of dragging it through every step for the rest of the run. The heavy transcript is disposable. The
> main loop never sees the mess.

🎬 SHOW: split container: "INLINE: pay once, then re-send forever" vs "ISOLATED: pay once, throw it away".

**Chunk 12 — the analogy**
> It's the difference between an employee who tells you what they found, and an employee who reads you every
> email they opened getting there. Same answer. Wildly different meeting.

🎬 SHOW: quote card of that line. Beat of silence after.

**Chunk 13 — the bonus**
> And you get context rot protection for free, right? The orchestrator's window stays clean and short, so it
> stays sharp deep into a long run. Cheaper AND smarter. Those usually don't come together.

🎬 SHOW: the ch2 quality-degradation line, now flat and healthy, labeled "orchestrator".

---

## Chapter 4 — Lever 2: two dials, and the one everyone gets backwards

**Chunk 14 — the two dials**
> Now lever two. Every sub-agent you define has TWO dials on it, and they're independent. Dial one is the
> MODEL. Dial two is the EFFORT.

🎬 SHOW: container: two literal dials side by side, "MODEL" and "EFFORT", unlabeled positions.

**Chunk 15 — the config, in code**
> And it really is two lines. Look at this: model, then effort. Two fields in a markdown file, and that's the
> entire routing decision for that slice of work.

🎬 SHOW: code card: a stripped `.claude/agents/` frontmatter showing only
`model: fable` / `effort: max`, both lines highlighted.

**Chunk 16 — kill the myth**
> Now, here's where I have to correct something, because I had this backwards myself. People say "route the
> cheap stuff to the cheap model." Fine. But go look at the actual price list, because Fable is not the cheap
> model. Fable is the most capable model, and it costs about DOUBLE what Opus does.

🎬 SHOW: container: pricing table, per 1M tokens, in/out. Fable 5 $10/$50 · Opus 4.8 $5/$25 · Haiku 4.5 $1/$5.
The Fable row pulses. **ACCURACY-PASS: re-verify all six numbers against live docs before rendering.**

**Chunk 17 — what the model dial is actually for**
> So the model dial is not a cheap-versus-expensive dial. It's a KIND-of-thinking dial. Hardest reasoning goes
> to your strongest reasoner. Bug-sensitive code goes to your strongest coder. Those are different jobs, and
> they're different models.

🎬 SHOW: container: "MODEL = what KIND of thinking?" with two branches: "hard judgment → strongest reasoner"
and "intricate code → strongest coder".

**Chunk 18 — the effort dial, and where the savings live**
> The effort dial is the one that actually saves you money. Low, medium, high, extra-high, max. Match it to
> the DIFFICULTY, and stop cranking everything to max by default... because max on a job that needed medium is
> just money you set on fire.

🎬 SHOW: container: the effort ladder low → medium → high → xhigh → max, with "default: high" marked and
"xhigh: best for most coding + agentic work" called out. **ACCURACY-PASS: verify ladder + default.**

---

## Chapter 5 — The advisor / executor pattern

**Chunk 19 — the split**
> Okay, so what do you DO with two dials? Here's the pattern I actually run, and it's a split. Every slice of
> work is either an ADVISOR or an EXECUTOR, and that one question decides both dials for you.

🎬 SHOW: the core diagram re-dressed: orchestrator on top, two branches labeled ADVISOR and EXECUTOR.

**Chunk 20 — the advisor**
> An advisor does the judgment. Mine reads a whole livestream transcript and decides which seven moments
> become shorts, including stitching together bits scattered across two hours. It's READ-ONLY, it can't touch
> the repo, and it hands back a JSON plan.

🎬 SHOW: diagram: transcript scrolling, 7 highlighted segments, scattered pieces snapping into one clip;
"read-only" padlock badge; JSON plan icon out.

**Chunk 21 — the advisor's config, in code**
> And its config says exactly that. Look at the tools line, right here: read, grep, glob, bash. Nothing that
> writes. Then the strongest reasoning model, at max effort... because picking those moments is genuinely the
> hardest thinking in the whole pipeline.

🎬 SHOW: code card: real `clip-strategist.md` frontmatter, `tools: Read, Grep, Glob, Bash` highlighted first,
then `model: fable` / `effort: max`.

**Chunk 22 — the executor's config, in code**
> The executor is the other animal. Look what it gets: read, write, edit, bash. It builds the composition and
> runs the render. Strong coding model, extra-high effort... because this is frame math and overlay collisions,
> and precision pays for itself here.

🎬 SHOW: code card: real `remotion-builder.md` frontmatter, `tools: Read, Write, Edit, Bash, Grep, Glob`
highlighted, then `model: opus` / `effort: xhigh`.

**Chunk 23 — the two levers meet**
> And now the two levers snap together, so don't miss this. I can afford to run my most expensive model at MAX
> effort on that judgment call... precisely BECAUSE the slice is small and isolated. Isolation is what buys you
> the right to be expensive exactly where it counts.

🎬 SHOW: quote card: "Isolation buys you the right to be expensive where it counts." Beat of silence.

---

## Chapter 6 — Self-QA: push verification DOWN

**Chunk 24 — the trap**
> Now there's a trap waiting right here, and it'll undo everything. The executor hands back a video. So you
> read the file, check the frames, scan the log... and congratulations, you just pulled the whole mess back
> into the context you were protecting.

🎬 SHOW: the orchestrator's clean context bar suddenly ballooning as QA artifacts flow back in, red.

**Chunk 25 — the fix**
> So you push the verification DOWN, into the isolated context. The executor QAs ITSELF, and it runs a
> mechanical gate on its own output. Not a vibe check. A script that has to print the word PASS.

🎬 SHOW: the sub-agent bubble containing the QA loop; a terminal inside it printing `gate: PASS`.

**Chunk 26 — what crosses back**
> And now the thing that crosses back is a verified claim, not a pile of evidence. Gate passed, here's the
> report. The orchestrator trusts the result and stays thin... and "done" stops being an opinion.

🎬 SHOW: code card: the gate command + `PASS` output, then the thin arrow back to a still-small orchestrator
bar.

---

## Chapter 7 — The receipts

**Chunk 27 — setting up the table**
> Alright, enough theory. Real session, one livestream, seven finished shorts. Here's every sub-agent run, what
> it burned, and how long it took.

🎬 SHOW: the token table begins building, row by row (from OUTLINE.md, verbatim).

**Chunk 28 — read the table**
> Look at the top row. Two hundred twenty three thousand tokens. Seventy-seven tool calls. Twenty-eight
> minutes... to build ONE short. And that is not the outlier, that's just the biggest one.

🎬 SHOW: table with the clip-2 row highlighted: 223,626 / 77 / ~28 min.

**Chunk 29 — the headline**
> Add it up and you get about a million and a half tokens of working transcript. And every one of those tokens
> ran inside a disposable context that got thrown away.

🎬 SHOW: table totals to ~1.53M, then the rows dissolve into a trash icon, leaving 8 small report cards.

**Chunk 30 — the contrast**
> Now compare the two columns that matter. Each sub-agent's transcript: a hundred thousand to two hundred
> twenty thousand tokens. Each report the orchestrator actually kept: one to two thousand.

🎬 SHOW: bar-chart container: a giant bar (100-220K) beside a sliver (1-2K), ~100x scale, on the same axis.

**Chunk 31 — the honest framing**
> If I'd done that work inline, every one of those transcripts lands in the main loop's window... and then gets
> re-sent on every step after. Instead it kept the reports. Same seven shorts. A fraction of the context on the
> expensive main loop.

🎬 SHOW: split container: "INLINE: 8 fat transcripts, re-sent forever" vs "DELEGATED: 8 thin reports". No
"1.5M context" claim on screen.

---

## Chapter 8 — Bonus: they run in parallel

**Chunk 32 — the free win**
> And here's a bonus that falls out of isolation for free. Separate contexts means they don't collide... so you
> can fan them out. In that session, clip four's plan was getting written WHILE clip three's b-roll was still
> generating.

🎬 SHOW: gantt-style container: two sub-agent bars overlapping in time, labeled "clip 3 b-roll" and "clip 4
plan".

**Chunk 33 — the caveat**
> But be careful here, because this is where people get burned. Anything sharing a scarce resource has to be
> SERIALIZED. I had one browser profile and one CPU for renders, so image-gen and renders take turns. Isolated
> contexts, shared hardware.

🎬 SHOW: the same gantt, now with a render lane forced sequential; a "1 browser · 1 CPU" badge; a red X on two
overlapping render bars.

---

## Chapter 9 — Where NOT to delegate

**Chunk 34 — the honest part**
> Now the honest part, because I learned both of these the expensive way. There are places you should NOT hand
> work to a sub-agent yet, and the first one is anything fragile.

🎬 SHOW: container: "Where it breaks" headline, two numbered slots, empty.

**Chunk 35 — fragile tools**
> My image generation drives a real browser, and that browser gets bot-detected and hangs. A human notices and
> nudges it. A headless agent just sits there and burns your run.

🎬 SHOW: a hung browser window, spinner frozen; the sub-agent bubble waiting, tokens still ticking.

**Chunk 36 — the lesson**
> So it took real hardening before an agent could own that step. Reload after eighty seconds, capture by a
> stable ID, dismiss the modal. And the lesson generalizes: make the TOOL robust BEFORE you hand it to an
> agent, because an agent can't improvise around your flaky script.

🎬 SHOW: container: "Harden the tool, THEN delegate" with the 3 fixes listed.

**Chunk 37 — the contract gap**
> Second one, and this one stings. A rule I care about, my b-roll coverage budget, lived in a DIFFERENT file
> than the one the sub-agents actually read. So they followed the gap, not the rule, and buried the screen in
> b-roll. A sub-agent is only as good as its contract... it will never infer your unwritten standards.

🎬 SHOW: diagram: two skill files, the agent's read-arrow pointing at the wrong one; the rule sitting orphaned
in the other. Then the fix: rule moved INTO the read file.

---

## Chapter 10 — Build it in Claude Code

**Chunk 38 — the whole definition**
> Okay, so how do you actually build one? In Claude Code, a sub-agent is a markdown file in dot-claude slash
> agents. That's it. YAML frontmatter on top, the agent's instructions underneath.

🎬 SHOW: file tree: `.claude/agents/{clip-strategist,tighten-strategist,remotion-builder}.md` +
`.claude/commands/repurpose-livestream.md`.

**Chunk 39 — the five fields**
> And there are five fields that matter. Name. Description, which is how the orchestrator knows when to reach
> for it. Tools, which is your blast radius. Then your two dials, model and effort, right here at the bottom.

🎬 SHOW: code card: full real `clip-strategist.md` frontmatter, each field highlighting as named, `model` +
`effort` highlighted last and held.

**Chunk 40 — the entry point**
> Then you give the whole thing a front door. A slash command in dot-claude slash commands, which is the same
> deal: frontmatter, and it carries its own model and effort. That's the orchestrator, and it delegates to the
> agents.

🎬 SHOW: code card: real `repurpose-livestream.md` frontmatter, `model: opus` / `effort: medium` highlighted.

**Chunk 41 — the call**
> And at runtime the orchestrator calls a sub-agent with the Agent tool, and the sub-agent's final message
> comes back as the result. That's the whole contract. Everything I just showed you rides on that one boundary.

🎬 SHOW: the core diagram one last time, the thin return arrow labeled "final message = the result", pulsing.

---

## Chapter 11 — Wrap + CTA

**Chunk 42 — recap in one breath**
> Let's put it back together in one breath. Isolate the heavy work in sub-agents, so the big context never sees
> the mess. Route model AND effort per slice: strongest reasoner for judgment, strongest coder for the
> bug-sensitive build, and effort matched to difficulty instead of pinned at max.

🎬 SHOW: full-frame recap container: the core diagram with the recap phrases appearing as chips around it.

**Chunk 43 — the meta-lesson**
> And the two rules I'd tattoo on it. Make the tool robust and the contract explicit BEFORE you delegate. And
> scope every agent to ONE slice with a definition of done it can prove... because a vague scope doesn't fail
> loudly, it just wanders and bills you.

🎬 SHOW: quote card: "Scope one slice. Prove it done." Beat of silence after.

**Chunk 44 — tease + CTA**
> There's more I didn't cover here: the mechanical gate itself, the parallel fan-out, and what it takes to make
> a flaky browser tool agent-proof... those are their own videos, so hit subscribe if you want them. And drop a
> comment: what's the one slice of YOUR pipeline you'd hand off first? I'm gonna catch you guys, later.

🎬 SHOW: outro card: channel handle chip + three teaser tiles (the gate / parallel fan-out / hardening a flaky
tool).
