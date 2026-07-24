# Save Tokens with Sub-Agents — SCRIPT

**Video 3** on [@aiEngineeringSimplified](https://www.youtube.com/@aiEngineeringSimplified)
Source outline: `OUTLINE.md` (from the real 2026-07-09 session: 1 livestream → the 3 repurpose lanes).
**This cut: the 3-LANE / ROSTER + ROADMAP version (Mike, 2026-07-16).** 10 chapters / 22 chunks, ~6.5 min at
video-2 pacing (~144 wpm). Covers the whole operation (all three lanes), the real sub-agent roster that runs
today, AND a clearly-labeled roadmap for the two lanes still run by hand. Token numbers are Mike's own
workflow estimate (~200K → ~130-140K, ~30%), not the audited session table — see the correction notes.

The 11-minute version is preserved at `SCRIPT-LONG-11MIN.md`.

## Title — ⬜ PICK ONE (Mike)
**"Stop Running Everything On Your Biggest Model At Max Effort"**
_Alternates: "I Cut My Agent's Token Bill By A Third By Dividing The Work" · "One Livestream, Three Lanes,
A Roster Of Sub-Agents: The Token-Saving Stack"_

---

## ⚠️ OUTLINE CORRECTION APPLIED (Mike approved 2026-07-15)

The outline's Lever 2 was **factually inverted** and is fixed in this script.

- **Fable 5 is NOT the cheap/fast model.** It is Anthropic's most capable widely released model, and it
  costs **$10 / $50 per 1M tokens (in/out) versus Opus 4.8 at $5 / $25**. Fable is **2x the price of Opus**,
  and it runs *longer* per turn, not faster. The outline's "cheap/fast (Fable) for judgment, expensive
  (Opus) for code" and Appendix A's "cheap to run it hard on a small model" are both wrong.
- **The repo configs are correct and unchanged** (verified against `.claude/agents/*.md` on 2026-07-16).
  What was wrong was only the *explanation*, not the setup.
- **The honest reframe this script teaches:** two dials, MODEL and EFFORT, set independently per slice.
  Match the **model to the KIND of thinking**, and **effort to the difficulty**.

## ⚠️ TOKEN NUMBERS: MIKE'S OWN ESTIMATE, NOT THE AUDITED SESSION TOTAL (updated 2026-07-16)

The outline's real-session token table (`OUTLINE.md` "REAL NUMBERS FROM THE SESSION") is **not used
in this script** — not the ~1.5M total, not the per-agent 100K-224K figures, not the "eleven runs" count.

- **Why it was pulled:** those figures are the Agent tool's own self-reported completion totals, cumulative
  input+output across every turn of an isolated sub-agent conversation. In an agentic loop most of each
  turn's input is the same growing context re-sent from the prior turn, billed as heavily-discounted cache
  reads under prompt caching, and Max-plan usage limits meter cost-weighted consumption, not a literal raw
  token count. So the headline total isn't directly comparable to what actually gets deducted from a usage
  window, and there's no billing log in this repo to verify the real cost-equivalent. Don't assert it on screen.
- **The replacement (Mike, 2026-07-16):** the script states Mike's own round estimate of his real weekly
  workflow, going from **~200K tokens** on a straight one-orchestrator-one-agent build down to **~130-140K**
  with a tuned roster of sub-agents, about a **30% cut**. Personal estimate of repeated practice, not one
  audited log. It appears in c2 and c20.
- **What stays real:** the three lanes, the sub-agent roster and every model/effort value in it, the agent
  configs (Appendix A), and the pricing table (c11) are all verified facts from the live repo.

## ⚠️ SCOPE: ALL 3 LANES + REAL ROSTER (ch6) + LABELED ROADMAP (ch7) (Mike, 2026-07-16)

The earlier under-4-min cut had narrowed to only the shorts lane and gone vague on numbers. Mike's call:
that gutted the point. This cut restores the concrete operation, adds the real roster, and adds a clearly
separated roadmap beat for the lanes still run by hand.

- **All three lanes are named (c8):** (1) long-form video, (2) vertical shorts, (3) text + image posts,
  all off one livestream. Canonical map: `playbooks/livestream-repurpose.md`.
- **Honest delegation boundary TODAY (c9), kept accurate:** the orchestrator (Opus main loop) runs the
  *plan* plus the light mechanical lanes (long-form queue, text/image repurpose) **inline itself**, and
  **delegates the heavy specialized slices** to sub-agents. The real per-slice roster is concentrated on
  Lane 2 + shared video spine-prep. No dedicated tweet/image sub-agent exists yet.
- **The roadmap (ch7) is explicitly ASPIRATIONAL.** Mike wants the video to also show where the pattern is
  going: applying the same two dials to lanes 1 and 3. Those sub-agents are **NOT built yet**. Hard rule for
  the render (see accuracy-pass gate): roadmap rows are visually marked **PLANNED / NOT BUILT YET** and must
  **never display fabricated frontmatter as if copied from the repo**. Only the real roster (ch6) shows real
  configs. The roadmap also carries the real "harden the tool first" lesson (the ChatGPT-image browser hang
  that needed reload-after-80s hardening before an unattended agent could own it).

### The REAL roster that runs today (ch6) — every row verified 2026-07-16

| Slice | Sub-agent | Model | Effort | Access | Returns |
|---|---|---|---|---|---|
| strip silence | desilencer | sonnet | low | tool | cleaned track |
| black out cover beats | cover-blackout | sonnet | high | tool | blacked spine |
| pick which moments become shorts | clip-strategist | **fable** | **max** | read-only | JSON clip plan |
| author the tighten cuts | tighten-strategist | **fable** | **max** | read-only | JSON removal spans |
| remove retakes w/o clipping words | defumbler | **opus** | **xhigh** | read/write | clean spine |
| build + render one short | remotion-builder | **opus** | **xhigh** | read/write | mp4 + gate PASS |
| transcript / captions / burst-fix | transcriber · captions-builder · burst-removal | opus | medium | mixed | asset |
| adversarial visual QA gate | visual-qa | opus | high | read-only | PASS / FAIL |

### The PLANNED roadmap roster (ch7) — ⛔ NOT BUILT, proposed dials only, mark PLANNED on screen

| Slice (lane) | Proposed sub-agent | Proposed model | Proposed effort | Access | Status |
|---|---|---|---|---|---|
| long-form title / desc / thumbnail (L1) | longform-meta-strategist | fable | high | read-only | PLANNED |
| tweets + threads drafting (L3) | copy-strategist | fable | max | read-only | PLANNED |
| image-post generation (L3) | image-builder | opus | high | read/write | PLANNED — needs a hardened tool first |

## What changed from the 11-min and the earlier <4-min cut (all live in `SCRIPT-LONG-11MIN.md`)

| Item | Status here |
|---|---|
| Context rot as its own beat | Folded into c4 as one clause ("the model gets dumber") |
| Self-QA / push-verification-down | Its own beat again (c17), the roster earns it |
| The 3 lanes of the operation | **Restored + expanded (c8-c9)** |
| Per-slice sub-agent roster (today) | **Centerpiece (ch6, c14-c17)** |
| Roadmap for lanes 1 & 3 | **New, clearly labeled aspirational (ch7, c18-c19)** |
| Fragile-browser-tool "harden it first" lesson | **Restored** inside the roadmap (c19) |
| Parallelism + serialize-shared-resources caveat | Still dropped. CTA teaser. |
| Narrated code-card walkthroughs | Collapsed to c22 naming the 5 fields; cards still show on screen |
| The audited token table read aloud | Dropped. c2/c20 use Mike's own ~200K→~130-140K estimate instead |

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
- **Pacing note:** the roster chapter (ch6) is dense; the table must be on screen and readable while the VO
  walks it top to bottom. Every code/table card holds long enough to pause on, but is NOT read line by line.
- **REAL configs on screen are copy-pasted from the live repo** (ch6 + the c22 frontmatter), sources:
  `.claude/agents/{clip-strategist,tighten-strategist,remotion-builder}.md` and
  `.claude/agents/shared/{desilencer,cover-blackout,defumbler,transcriber,captions-builder,burst-removal,visual-qa}.md`.
  **ROADMAP rows on screen (ch7) are labeled PLANNED and are NOT real repo files** — never render fake
  frontmatter for them.

> [!CAUTION]
> **Accuracy pass (`skills/accuracy-pass/accuracy-pass.md`) is a MANDATORY gate before any VO generation.**
> Highest-risk claims, in priority order:
> 1. **Pricing (c11).** Re-verify Fable 5 / Opus 4.8 / Haiku 4.5 per-1M rates against live docs at build
>    time. Prices move. Re-check the *direction* (Fable above Opus), not just the digits, because c11 and
>    c12 both collapse if that flips. If you add Sonnet's price to the table, verify it too.
> 2. **Real roster values (ch6 table + c14-c17).** Diff every model/effort/access value against the live
>    agent files. As of 2026-07-16: desilencer sonnet/low, cover-blackout sonnet/high, clip-strategist +
>    tighten-strategist fable/max/read-only, defumbler + remotion-builder opus/xhigh/read-write, transcriber
>    + captions-builder + burst-removal opus/medium, visual-qa opus/high.
> 3. **Roadmap is aspirational (ch7, c18-c19).** These sub-agents do NOT exist in the repo. The VO must keep
>    the future framing ("still run by hand", "how I'm going to split them", "the next hand-off"); the visuals
>    must mark every roadmap row **PLANNED / NOT BUILT** and must not show fabricated frontmatter. If any of
>    these agents actually gets built before render, move it up into the real roster and restyle its row.
> 4. **Model names + tiers (c11-c12).** "Fable 5 is the most capable widely released model" and "Opus 4.8".
> 5. **Effort levels (c13).** `low / medium / high / xhigh / max`, default `high`.
> 6. **Frontmatter fields (c22).** `name / description / tools / model / effort` in `.claude/agents/`.
> 7. **The 3 lanes (c8) + delegation boundary (c9).** Confirm against `playbooks/livestream-repurpose.md`
>    that lanes 1 & 3 still run orchestrator-inline today.
> 8. **The tool-hardening claim (c19).** The image tool really did hang on a browser popup and was hardened
>    (reload-after-80s / stable-id capture) — keep it truthful, don't embellish.
> 9. **Personal-estimate numbers (c2, c20).** "~200K → ~130-140K, about 30%" is Mike's own round estimate,
>    not an audited figure. Confirm Mike is comfortable stating it. The old ~1.5M / 223,626 per-agent figures
>    and any 5-hour-window framing must NOT reappear.

> [!NOTE]
> **TTS normalization (apply per chunk at generation).** sub-agent → "sub agent" (no hyphen pause),
> sub-agents → "sub agents", JSON → "jason", b-roll → "B roll", extra-high → "extra high",
> Opus → "OH pus", Fable → "FAY bull", Sonnet → "SON it", read-only → "read only",
> dot-claude slash agents → "dot claude slash agents", 200K → "two hundred thousand",
> 130-140K → "a hundred thirty, a hundred forty thousand", 30 percent → "thirty percent".
> Caps markup below is light; apply the caps rule (no ALL-CAPS on short words) when building
> `tts-chunks.json`. **Watch at generation:** "THAT is the trick" (c7) caps THAT (4 letters) and
> "KIND-of-thinking" (c12) caps KIND (4 letters), both in the same risk band as the confirmed
> ISN'T/ALL/OWN/EDGE clips (Mike, 2026-07-16). Whisper-QA those two takes specifically; if either clips,
> shift the emphasis to the neighboring long word (TRICK / THINKING).

## Chapter map (target ≈ 6.5 min, ~14-16 s/chunk)

| Ch | Title | Chunks |
|---|---|---|
| 1 | Hook: one livestream, a whole week of content | 1-2 |
| 2 | The problem: one agent, one lane, the balloon | 3-4 |
| 3 | Lever 1: isolation | 5-7 |
| 4 | The operation: three lanes | 8-9 |
| 5 | Lever 2: two dials | 10-13 |
| 6 | The roster: how the work gets assigned (today) | 14-17 |
| 7 | Where this is going: the other two lanes | 18-19 |
| 8 | The payoff | 20 |
| 9 | The honest part | 21 |
| 10 | Build it + CTA | 22 |

---

## Chapter 1 — Hook: one livestream, a whole week of content

**Chunk 1 — the operation**
> Every week I take one livestream and turn it into a whole week of content. A long-form video, a stack of
> vertical shorts, tweets, threads, image posts. One recording goes in, dozens of finished pieces come out.

🎬 SHOW: title card, then one livestream file icon fanning out into three labeled lanes ("LONG-FORM",
"SHORTS", "TEXT + IMAGE"), each spawning finished-post thumbnails.

**Chunk 2 — the before/after**
> For a long time, one agent did all of it, start to finish, in a straight line. Then I broke the work into
> sub-agents, and my token bill dropped by about a third. Here is exactly how the work gets divided up.

🎬 SHOW: split card. LEFT "one agent, straight line, ~200K" with a fat context bar. RIGHT "a roster of
sub-agents, ~130-140K" with a thin bar + "~30% LESS" chip.

---

## Chapter 2 — The problem: one agent, one lane, the balloon

**Chunk 3 — the balloon**
> Here is the trap most people fall into. One agent, one context window, running every lane end to end. And
> every file it reads, every transcript, every render log STAYS in that window, and gets re-sent on every
> step after.

🎬 SHOW: the "context balloon": single agent, context bar inflating with each step, animated re-send arrows
firing the whole bar again on every step.

**Chunk 4 — the cost shape**
> So your cost does not scale with the work. It scales with the CONTEXT, and the context only grows. On a
> full repurpose run, that was costing me something like two hundred thousand tokens. And as the window
> fills with stale detail, the model gets dumber too.

🎬 SHOW: two curves, "work done" (linear) vs "tokens paid" (quadratic), gap shaded, a "~200K" marker on the
tokens curve. Then a quality line sagging as the bar fills, small label "context rot".

---

## Chapter 3 — Lever 1: isolation

**Chunk 5 — the fresh window**
> Lever one is context isolation. Instead of one agent holding everything, I spawn a sub-agent for a single
> slice of the work. It gets its OWN fresh window, does the messy part in there, and I never have to hold the
> mess.

🎬 SHOW: core diagram with a hard wall between two context bars; sub-agent bubble filling fast on the far
side of the wall. Orchestrator bar untouched.

**Chunk 6 — what comes back**
> And when it is done, what crosses back to me? Just the final answer. A compact plan, or a short build
> report. The fat transcript it built up along the way gets thrown away.

🎬 SHOW: thin arrow labeled "~1-2K" crossing the wall; the fat bubble dissolving into a trash icon.

**Chunk 7 — the trick, stated plainly**
> THAT is the trick. You pay for that context once, in isolation, instead of dragging it through every other
> step of the run. It is the difference between an employee who tells you what they found... and one who
> reads you every email they opened.

🎬 SHOW: split container "PAY ONCE, THROW IT AWAY" vs "PAY ONCE, RE-SEND FOREVER", then hard cut to a quote
card of the employee line. Beat of silence.

---

## Chapter 4 — The operation: three lanes

**Chunk 8 — the three lanes**
> So what am I actually dividing up? One livestream fans out into three lanes. Lane one is a long-form video.
> Lane two is the vertical shorts. Lane three is all the text and image posts, the tweets, the threads, the
> whole spread.

🎬 SHOW: the three-lane fan-out from c1, now static and labeled, each lane showing its end products
(long-form → Rumble/BitChute/FB; shorts → all platforms; text+image → X/IG/YT).

**Chunk 9 — the orchestrator divides it**
> My main agent, the orchestrator, keeps the plan and runs the light mechanical lanes itself. But the heavy,
> specialized slices, it hands each one off to its own sub-agent. And here is the part that actually saves
> the money. Every one of those gets tuned.

🎬 SHOW: orchestrator node in the center; light lanes (long-form queue, text/image) stay attached to it,
heavy slices detach into separate sub-agent bubbles labeled "TUNED". Arrow forward to ch5.

---

## Chapter 5 — Lever 2: two dials

**Chunk 10 — the two dials**
> Because every sub-agent has two dials, and they are independent. Dial one is the MODEL. Dial two is the
> EFFORT. Two lines in a markdown file.

🎬 SHOW: two literal dials, "MODEL" and "EFFORT". Then a code card: real frontmatter with only `model:` and
`effort:` highlighted. Hold long enough to pause on; not read aloud.

**Chunk 11 — kill the myth**
> And here is where I had it backwards. People say route the cheap work to the cheap model. Go look at the
> price list, because Fable is not the cheap model. It is the most capable one, and it costs double what Opus
> does.

🎬 SHOW: pricing table, per 1M tokens, in/out. Fable 5 $10/$50 · Opus 4.8 $5/$25 · Haiku 4.5 $1/$5. Fable
row pulses; a "2x" bracket spans Fable vs Opus. **ACCURACY-PASS: re-verify all numbers AND the direction.**

**Chunk 12 — what the model dial is for**
> So the model dial is not cheap versus expensive. It is a KIND-of-thinking dial. Your hardest reasoning goes
> to your strongest reasoner. Your bug-sensitive code goes to your strongest coder.

🎬 SHOW: container "MODEL = what KIND of thinking?" with two branches: "hard judgment → strongest reasoner
(Fable)", "intricate code → strongest coder (Opus)".

**Chunk 13 — the effort dial**
> The effort dial is where the money leaks. Low, medium, high, extra-high, max. Match it to the DIFFICULTY,
> and stop pinning everything at max... because max on a job that only needed medium is money you set on
> fire.

🎬 SHOW: the effort ladder low → medium → high → xhigh → max, "default: high" marked. On "money you set on
fire", the max rung burns. **ACCURACY-PASS: verify ladder + default.**

---

## Chapter 6 — The roster: how the work gets assigned (today)

**Chunk 14 — the bottom of the roster**
> So here is how my actual roster gets set. Start at the bottom. Stripping the silence out of a recording is
> pure mechanical work, no judgment in it at all. That goes to a cheaper, faster model at low effort, and it
> is done.

🎬 SHOW: the real roster table builds ROW BY ROW; the bottom row, "strip silence → desilencer · sonnet ·
low", highlights first.

**Chunk 15 — the hardest judgment**
> Now go to the top. Picking which moments out of a two-hour stream become the shorts, that is the hardest
> judgment call in the whole pipeline. So that one gets my strongest reasoner, cranked all the way to max...
> but locked to read-only. It hands back a plan. It cannot touch a single file.

🎬 SHOW: the "pick which moments become shorts → clip-strategist · fable · max · read-only" row highlights;
a padlock icon snaps onto the "read-only" cell.

**Chunk 16 — the precise execution**
> Then the precise, breakable execution. Cutting the retakes out without ever clipping a word. Building the
> final render with frame-perfect timing. That is my strongest coder, at the highest precision effort, and
> THESE are the ones allowed to write files and render.

🎬 SHOW: the "defumbler · opus · xhigh" and "remotion-builder · opus · xhigh · read/write" rows highlight; a
pencil/write icon snaps onto their access cells.

**Chunk 17 — the QA gate**
> And nothing they build gets trusted until a separate QA agent opens the actual pixels and signs off. Every
> slice, its own two dials. That table right there is the whole method.

🎬 SHOW: the "visual-qa · opus · high · PASS/FAIL" row highlights and stamps a green "PASS" on a rendered
frame; then the whole real roster pulls back into view as one unit.

---

## Chapter 7 — Where this is going: the other two lanes

**Chunk 18 — the roadmap for judgment slices**
> Now, that roster only covers my shorts lane so far. The other two lanes I still run mostly by hand. But the
> same two dials tell me exactly how to split them. The long-form title and thumbnail, that is judgment, so
> it becomes a read-only strategist on my strongest reasoner. The tweets and threads, same story, a read-only
> copy strategist that just hands back drafts.

🎬 SHOW: the roster table gains two GREYED, DASHED rows stamped "PLANNED": "long-form meta → fable · high ·
read-only" and "tweets + threads → fable · max · read-only". Clear visual break from the solid real rows.

**Chunk 19 — the executor + harden-the-tool lesson**
> The image posts are the one execution slice left to hand off. That would be a builder that actually
> generates the images. And that one taught me the real prerequisite. Before you give a slice to an
> unattended agent, the tool underneath it has to be ROBUST. Mine used to hang on a browser popup, so I
> hardened it first. You delegate a reliable tool, never a flaky one.

🎬 SHOW: a third PLANNED row "image posts → opus · high · read/write" with a red "needs a hardened tool"
flag. Then a small before/after of the image tool: "hangs on popup" ✗ → "reload + stable-id capture" ✓.

---

## Chapter 8 — The payoff

**Chunk 20 — the payoff**
> Add it up on that same weekly run. One agent doing it in a straight line, call it two hundred thousand
> tokens. Split into a tuned roster of sub-agents, I have got it down to around a hundred thirty, a hundred
> forty thousand instead. Same output, about a third less.

🎬 SHOW: reprise the two-bar comparison, "ONE AGENT ~200K" vs "SUB-AGENT ROSTER ~130-140K", bars scaled to
the numbers, "~30%" delta bracket between them.

---

## Chapter 9 — The honest part

**Chunk 21 — the contract gap**
> One more honest warning. A rule I actually cared about lived in a different file than the one my sub-agents
> read... so they followed the gap. A sub-agent is only as good as its contract. It never infers your
> unwritten standards.

🎬 SHOW: two skill files, the agent's read-arrow pointing at the wrong one, the rule orphaned in the other.
Then the fix: rule slides INTO the file the agent reads.

---

## Chapter 10 — Build it + CTA

**Chunk 22 — the definition + CTA**
> And the whole definition of one of these is just a markdown file. Name, description, tools, model, effort.
> That is the entire thing. Tell me which slice of your pipeline you would hand off first, hit subscribe for
> the full build, and I am gonna catch you guys, later.

🎬 SHOW: full real `clip-strategist.md` frontmatter, the 5 fields highlighting as named. Then outro card:
channel handle chip + three teaser tiles (the QA gate / parallel fan-out / hardening a flaky tool).
