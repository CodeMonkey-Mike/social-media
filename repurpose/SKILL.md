---
name: repurpose
description: Turns long-form content (livestream transcripts, podcast episodes, video scripts, talks) into ready-to-post tweets. Use this skill whenever the user mentions repurposing content, says things like "make tweets from this", "what can I post from my livestream", "turn my video into social posts", or refers to a transcript/recording they want to break down for Twitter/X. Also trigger when the user drops a transcript file into the repurpose/transcripts folder, even if they don't explicitly name the skill. Don't undertrigger — if the user is talking about reusing existing spoken or written content for social media, this skill applies.
---

# Repurpose

## Scope (read this first)

**This skill is for repurposing content into drafts and persisting approved drafts to the right files.** That's the whole job.

What is in scope:
- Reading transcripts and pulling out topics worth posting
- Drafting tweets and threads in the right format and voice
- Iterating on drafts based on user feedback
- Writing approved drafts to their target files (`data/x-tweets.json`, `data/x-threads.json`, etc.)
- **Structural changes** to the data files or the schedule-tweets skill that are needed to support a new content type — e.g., adding a column, defining a new file, documenting how a new content type should be posted mechanically. Do these when introducing a new repurposing format.

What is **out of scope** — these belong to the schedule-tweets skill in a separate chat:
- Decisions about *when* something gets posted (cadence, time of day, frequency)
- Decisions about the *order* in which content types are posted (tweets vs threads vs anything new)
- Decisions about which content types share a posting cadence vs run on separate cadences
- Status flips that affect the active queue (the user makes those calls in the schedule-tweets chat, or asks for them explicitly here)

If the user asks about scheduling here, redirect them: "That's a scheduling decision; the schedule-tweets chat is the place for that. Want me to wrap up the repurposing first?"

## Writing-style rules (apply to ALL repurposed content)

These rules apply to every piece of content this skill produces: single tweets, threads, YouTube community posts, and any future format. They reflect the user's personal voice and override generic Twitter/YouTube best practices when they conflict.

### Never use em dashes

The em dash (—) is banned from all content. Not in hooks. Not in CTAs. Not in body prose. Not in bullet expansions. Never.

When you would have reached for an em dash, use one of these instead, in this preference order:

1. **Semicolons** (default; this is the user's preferred substitute most of the time). Good for joining two related independent clauses where you want a pause stronger than a comma but weaker than a period. Example: *"The 4-year cycle is dead; not because of ETFs."*
2. **Ellipses** (second preference). Good for dramatic pauses, trailing thoughts, and rhetorical buildup. Example: *"If you had to bet right now... does Bitcoin top in 2026, or in 2030?"*
3. **Colons.** Good for label-explanation patterns and setup-payoff. Example: *"AlexNet: deep learning works."* or *"Take in the numbers:"*
4. **Parentheses.** Good for parenthetical asides, especially in stat lists. Example: *"ChatGPT (100M users in 2 months)"*
5. **Periods.** When the sentence naturally breaks, just break it. Two short sentences often beat one long one with a dash.
6. **Commas.** For light parenthetical breaks, simple appositives, and quick asides.

Hyphens (-) for compound words ("4-year cycle," "1-year mania") and en dashes in number ranges ("1980-86") are fine; the ban is specifically on em dashes used as dramatic pauses or parenthetical breaks.

When auditing content for em dashes, search for the literal `—` character (U+2014). The substitution should preserve flow; if a semicolon makes the prose feel awkward, try the next option in the list rather than forcing it.

### Moving-average notation: use "50-week SMA" / "200-week SMA"

Always write the long form. Mike does not use the compact "50WMA" or "200WMA" abbreviation, partly because WMA technically means weighted moving average (the chart he references is simple, not weighted).

- ✅ "50-week SMA"
- ✅ "200-week SMA"
- ❌ "50WMA"
- ❌ "200WMA"
- ❌ "50-week MA" (the simple vs weighted distinction matters)
- ❌ "50 WMA" (with space)

When checking drafts, do a `50WMA|200WMA` grep before saving and replace any matches. Same for any other "WMA" variant.

### Never write "Casper"; always "Kaspa"

The chain is **Kaspa**, ticker **$KAS**. Never write "Casper" anywhere in content (tweets, threads, YouTube posts, lead-gen, any repurposed output).

The transcripts the user records contain frequent transcription errors where "Kaspa" gets misheard as "Casper" by the speech-to-text engine; the two words sound nearly identical spoken aloud. **Normalize every instance of "Casper" to "Kaspa" during topic extraction, before drafting any output.** Treat this as a search-and-replace pass on the transcript content as part of Phase 1.

The brand mismatch matters: Casper Network ($CSPR) is a different, unrelated chain. Confusing the two undermines credibility with the Kaspa community and signals to outsiders that the writer doesn't know the project. The error also tends to compound through the writing because the misspelled name reads naturally to anyone who didn't catch it the first time.

When auditing drafts before saving, search for the literal string "Casper" (case-insensitive) and replace any occurrences with "Kaspa". Same audit applies to ticker drift: "$CASPER" or any variation should always be `$KAS`.

**Important nuance: "Kasper" (with K and -er) is a valid spelling — it is NOT the same as "Casper" or "Kaspa".** Kasper is a KRC20 meme token (the ghost-themed one). Its full brand name is **Kasper-the-Ghost**. Distinct treatment:

- ✅ "Kaspa" = the chain itself, ticker `$KAS`
- ✅ "Kasper" or "Kasper-the-Ghost" = the KRC20 ghost-themed meme token (different asset, same chain)
- ❌ "Casper" = a different, unrelated chain (`$CSPR`); never write this in Kaspa-context content
- ❌ "Kaspa-the-Ghost" = wrong; this conflates the chain with the meme. Use **"Kasper-the-Ghost"** for the meme token.

When the discussion is about a ghost-themed mascot or the ghost-themed KRC20 token, the correct spelling is "Kasper" / "Kasper-the-Ghost". When the discussion is about the chain or its architecture, the correct spelling is "Kaspa". When auditing drafts about Kaspa's mascot debate or any KRC20 ghost-themed token, search for the literal string "Kaspa-the-Ghost" and replace with "Kasper-the-Ghost".

### KRC20 meme-token glossary (the K-prefix STT trap)

The speech-to-text engines NoteGPT and similar transcript tools consistently mishear KRC20 meme-token names because most of them start with a **K** that sounds like a **C** when spoken. The transcripts will show C-prefix spellings; the actual project names use K-prefix. **Never inherit the C-prefix spelling from a transcript without verifying.**

The known canonical spellings for the KRC20 meme tokens that show up most often in Mike's transcripts:

| Transcript drift (wrong) | Canonical spelling | Notes |
|---|---|---|
| Caspie | **Kaspy** | KRC20 meme token |
| Cassie | **Kasy** | KRC20 meme token (cute anime girl mascot per transcript) |
| Cappy | **Kappy** | KRC20 meme token (cat-themed: "Kappy the cat, the happiest cat") |
| Casper | Kasper *only if* mascot/meme context (Kasper-the-Ghost); otherwise Kaspa | See above section |
| Caspby | unknown — flag for removal | Pronunciation not familiar to Mike. If it appears in a draft, ask before keeping; default to removing the reference rather than shipping a project name nobody recognizes. |

**Audit pass before saving any KRC20 content:** search for each C-prefix string in the table above (case-sensitive). For each hit, replace with the K-prefix canonical spelling. For "Caspby" specifically, surface the hit to Mike and remove unless he confirms.

**When new KRC20 names appear in a transcript that aren't in the table above:** assume the K-prefix transcription rule applies (any C/K confusion in the project name is more likely K than C, since KRC20 = Kaspa Request for Comment). Confirm with Mike before adding to a draft. When confirmed, append a new row to the glossary table above so future drafts get it right automatically.

### "Fully implemented GhostDAG" — never just "ghost"

When describing Kaspa's architecture, the technical term is **GhostDAG** (the protocol name). Never write "Kaspa is a fully implemented ghost" — that loses the technical precision and reads to anyone Kaspa-literate as a careless mistake. Always:

- ✅ "Kaspa is a fully implemented GhostDAG"
- ✅ "Kaspa is a fully implemented GHOSTDAG protocol" (all-caps stylization is also fine)
- ❌ "Kaspa is a fully implemented ghost"
- ❌ "Kaspa is a ghost chain"

The casing convention: `GhostDAG` (camel-case) reads as the protocol name; `GHOSTDAG` (all-caps) reads as the protocol acronym. Either is acceptable. The all-lowercase "ghost" is reserved for poetic / metaphorical phrasing only ("the ghost is in the architecture") and should never replace the protocol name itself.

When auditing drafts before saving, search for the literal phrase "fully implemented ghost" and verify the next word is "DAG" (or "GHOSTDAG" follows in context). If not, fix it.

### Invite correction without factual errors (the 1-in-10 rule)

Roughly 1 in 10 posts should lean into a framing that invites pushback or correction. The "well, actually" instinct on Crypto Twitter is a powerful engagement driver: people who would never reply to a regular post will reply to defend their position when something feels wrong-shaped to them. Comments are the algorithm's highest-weighted signal, so converting lurkers into correctors is a real engagement multiplier.

**This is bait without lying.** Never manufacture a factual error to drive corrections. Repeated factual mistakes erode the trust that makes the account valuable long-term, and X's Community Notes system increasingly suppresses reach on posts with verified issues. The strategy also degrades quickly once the audience pattern-recognizes it; people stop bothering to correct posts they suspect are bait.

**Techniques that capture the same engagement mechanic without lying:**

1. **Strong, defensible-but-debatable takes.** Example: *"$KAS is the only fair-launched chain that matters."* Tribally true to the user's camp, technically arguable. Same correction instinct, no factual error.
2. **Approximate framings that invite precision.** Example: *"Kaspa hits its supply cap around 2026-2027."* People who want to "correct" you to the exact year will still do it, but the underlying claim isn't wrong.
3. **"What am I missing?" closers.** Caitlin Long pattern from `VIRAL-TWEET-STANDARDS.md`. Explicit invitation to disagree without lying. Doubles as a humility flex that softens the bait.
4. **Polls.** Native correction-bait. Voting against the stated position is the lowest-friction way for a lurker to disagree. The poll modes already covered in this skill are the primary tool for this technique.
5. **Provocative predictions.** Forecasts can't be "wrong" yet; they invite debate. Example: *"$KAS hits top-10 by 2027."* Generates the same defenders + skeptics dynamic as a factual error would, with no credibility cost.

**Tagging convention:** when drafting a post that uses one of these techniques deliberately, note it in the markdown draft (e.g., `**Engagement note:** uses correction-bait technique #2 (approximate framing)`). This helps the user see at a glance which posts are leaning on this mechanic and keeps the cadence from drifting above the ~1-in-10 ratio.

**Real factual errors are different.** When an accidental mistake slips through (transcription drift, miscalled date, wrong number), don't manufacture an apology. Reply to corrections with grace and let the engagement happen naturally. Manufactured errors and accidental errors both drive engagement; only the accidental ones don't compound the credibility cost over time.

### What Mike picks vs cuts (brand voice patterns)

These patterns are observed across multiple drafting sessions, recorded so future drafts trend toward what Mike keeps without manual review. Honor them by default; deviate only when the user explicitly asks for something different.

**Defends every claim, even small ones.** If a draft references something Mike can't argue for in a thread (a specific L2 not yet proven, a project's rumored partnership, an unverified stat), he'll cut it. Example: drafts mentioning "Igra L2 going live" got stripped from Kaspa hard-fork tweets even though it strengthened the bull case, because he doesn't want to overhype an unproven L2 yet. Default behavior: only include named projects, products, or claims you're confident the user has verified. When in doubt, leave the claim general (e.g., "the L2 stack" instead of naming a specific L2).

**Cuts aphorism-style closing punchlines.** Lines like "X is alpha," "smart money is a label," "the structure never broke. The crowd did." get removed even when the rest of the tweet is kept. They read as performative rather than substantive. Default behavior: end tweets with a concrete claim, an actionable observation, or just stop after the last data point. Avoid the "drop-the-mic" final line.

**Rejects loose labels he disagrees with, even if they make the tweet stronger.** A draft framing long-term holders as "smart money" got rewritten because Mike doesn't believe LTH = smart money. He prefers "ill-advised long-term holders" — calling people by what their behavior actually is, not by an unearned status label. Default behavior: don't use shorthand labels (smart money, whales, OGs, diamond hands) without checking whether the user agrees with the implied valence. When in doubt, describe the behavior instead.

**Skips chain-rotation and trader-portfolio content** in favor of thesis-driven content. A "BNB chain on fire, Base chain dead" draft got cut entirely even though it surfaced legitimate alpha (LAB 61x, MYX 550x, DeAgent 130x), because the framing was rotation-trader rather than thesis-builder. Default behavior: when transcripts have both thesis material and rotation material, lead with thesis variations and only suggest rotation framings if the user explicitly asks. The account's voice is "here's the macro/structural take," not "here's what to buy this week."

**Keeps first-person conviction phrasing.** "I shed my four-year cycle belief in Q2 2025." "I'm watching the Iran situation like an ascending channel." "I'm trimming 5-10% on every pump." These get picked. Tweets in pure third-person observational mode get cut more often. Default behavior: when a thesis is genuinely Mike's (not just an industry observation), drop into first-person. It distinguishes him from the AI-generated noise floor.

**Prefers pattern-break framings over single-point claims.** "Every previous crypto bear lined up with macro tightening. This one isn't" gets picked because it sets up the contrast. A standalone "this isn't a bear, it's a panic" gets a lukewarm response. Default behavior: when arguing something is anomalous, lead with the historical pattern, then break it. Don't just assert anomaly.

**Names the opposition he's arguing against.** "Four-year cycle zombies." "BTC maxis." "$KAS holders mad it's not on Coinbase." These give the tweet a target audience to react. Default behavior: when a tweet is contrarian, name the camp it's contradicting. Don't argue against a vague consensus.

**Two variations should be genuinely different angles, not paraphrases.** When two variations cover the same idea with similar structure, Mike picks one and cuts the other. When they take different angles (data-led vs personal-conviction; pattern-break vs counterfactual; etc.), he often picks both. Default behavior: when drafting two variations of the same concept, make sure each one has its own distinct hook pattern from `VIRAL-TWEET-STANDARDS.md`. Don't ship two variations of the same hook with different word choices.

**Mike's favorite-coins lineup (for image content and "coins I'm stacking" type posts).** When generating images that depict Mike's portfolio, his favorites, "coins I'm bullish on," "what I'm stacking," etc., use this exact lineup:

- **$KAS (Kaspa)** — primary. Mike is a Kaspa maxi. Always present, always the focal element when a single coin needs hero treatment, always rendered larger / more prominent than the others when they share a frame.
- **$TAO (Bittensor)**
- **$TON (Toncoin)**
- **$LINEA (Linea)** — Layer 2 from Consensys.
- **AI16Z / ElizaOS** — the AI agent project. Note: token migrated; use the current ticker. Render the ElizaOS branding rather than the old AI6Z.
- **Housecoin** — meme.

**Do NOT include in favorites lineups:** $BTC, $ETH, $SOL, $BNB, or any other major chain that isn't on this list. Mike posts about $BTC and others in thesis content, but they aren't in his "stacking" lineup. Including them in a favorites image misrepresents his portfolio. The Bitcoin/Ethereum tweets he writes are macro commentary, not endorsements.

**When generating an image with these coins:** name them by ticker explicitly in the prompt so the model renders the right logos (per the existing brand-naming rule in the Image generation mode section). For lesser-known projects, the model invents fake logos when left to its own — use the reference images stored at:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\reference\
  linea.png          — Linea (Ethereum L2)
  ElizaOS-ai16z.webp — ElizaOS / ai16z AI agent project
  housecoin.webp     — Housecoin (KRC20 meme token)
  kroak.png          — KROAK (KRC20 meme token)
  kappy.png          — KAPPY (KRC20 meme token; cat-themed "the happiest cat")
  kasy.png           — KASY (KRC20 meme token; cute anime girl mascot)
```

**Rule: before generating any image that mentions a lesser-known crypto project, scan the tweet/post text for project names or tickers and check if a matching reference file exists in this directory.** If a match is found, pass it via the `--reference-image=<path>` flag on `generate-image.js`. In the prompt, refer to it as "the logo shown in the attached reference image" so the model uses it instead of inventing.

**Multi-coin lineup constraint.** The current `generate-image.js` accepts only a single `--reference-image`. So for a single-coin spotlight image (e.g., just ElizaOS or just Linea), the reference flow works cleanly. For a multi-coin lineup that needs reference logos for two or more of the lesser-known coins (e.g., Linea + ElizaOS in the same frame), the script can't handle it — fall back to manual ChatGPT upload for that one image, save it manually with the right filename in `schedule-tweets/images/x/` (for x-tweets) or `schedule-tweets/images/yt/` (for yt-posts), and update the queue entry. Kaspa, Bittensor, and Toncoin are well-known enough that the model renders them correctly without references, so a typical favorites lineup with $KAS as hero only needs one reference upload per lesser-known coin in the frame.

**When the post text mentions "favorites" or "coins I'm stacking" but doesn't enumerate them:** ask Mike whether the current list still applies before generating the image. The lineup may evolve.

**Fact-checks specific claims before they ship.** Example: a draft cited "El Salvador and Kazakhstan" as sovereign Bitcoin holders; Mike asked for verification. Kazakhstan is a mining hub but doesn't actually hold sovereign BTC reserves. The verified set is El Salvador (active buying since 2021), Bhutan (sovereign reserves via state-owned mining), and Texas / New Hampshire (state legislation passed in 2025). Default behavior: any time a draft cites named entities (countries, companies, projects, dates, statistics, percentages), pause and verify before shipping. If the user hasn't asked explicitly, run the check anyway and either correct the draft or flag the uncertainty in the markdown.

**Numbers must reflect current reality, not just what was in the transcript.** Example: the May 11 transcript said "67x on Lab" but by the time drafts were being reviewed, Lab had hit 98x. Mike updated the number across every draft that cited it. Default behavior: when transcripts reference specific multipliers, prices, market caps, or any figure that could plausibly move between recording and posting, ask the user to confirm the number is still current. Don't inherit the transcript's snapshot blindly.

**Respects prior selections — don't bring back skipped concepts in later format passes.** Example: from the May 11 brainstorm, Mike picked concepts 2-6 + 9 and skipped concept 1 (Fed chair changeover). When recommending long YT post candidates later in the session, I added concept 1 back into the list and Mike had to correct me. Once a concept is filtered out, treat that as a permanent decision for the current cycle. Default behavior: the workflow is concept-level decisions first, then format adaptations of the chosen set. Don't re-surface skipped concepts when moving from tweets → threads → polls → YT posts.

**Geopolitical / dark-register content stays at tweet-tier; doesn't get YT amplification.** Example: Mike picked both Iran tweet variations (9A and 9B) and let them ship to tweets.json. But when offered 5 long-form YT post candidates from the same concept set, he chose the 4 non-Iran ones. When offered 11 polls, he picked 6 — skipping both Iran polls. Pattern: Iran / war / black-swan content gets a smaller surface area than other thesis content. It's OK on X (where reach is fast and the take is timely), but doesn't get the YT post or YT poll amplification that builds long-term audience association. Default behavior: when a concept is darker register, draft tweet variations but don't proactively suggest long YT posts or YT polls unless the user asks.

**Cross-platform parallel deployment is the default workflow.** Example from this session: same May-11 concepts went to tweets.json (long + one-liner versions), threads.json, x-polls.json, yt-text-polls.json, and yt-posts.json. Each chosen concept got 5+ format adaptations. Default behavior: when a transcript yields chosen concepts, assume each will be adapted to multiple formats. Plan in this order: long tweet → one-liner tweet → thread → X poll → YT poll → YT post. Don't ask format-by-format if the concept itself is approved; adapt to all unless the user opts out.

**One-liner image-first tweets are a separate format class, not a replacement.** This session introduced explicit "one-liner" tweet variants — single-sentence tweets paired with images. Mike asked for them in addition to the long-form versions, not instead of them. Default behavior: when tweet variations are approved, also offer image-first one-liners. They live alongside the long-form versions in `data/x-tweets.json` and serve different feed contexts (a one-liner with an image stops the scroll where a long tweet wouldn't, and vice versa).

**X image → IG cross-post always gets a 4:5 companion.** When a new image is generated for an X tweet, also generate a second version of the same image at **4:5 aspect ratio** for the Instagram single-image entry. Same prompt, same subject, same visual style — only the aspect ratio changes. Save the 4:5 version to `schedule-tweets/images/ig/` with the prefix `ig-single-` and the same `image_id` (e.g. `ig-single-a3f7c2e9-kaspa-coinbase-illustration.png`). The IG entry in `data/ig-single-image.json` references this 4:5 file; the tweet entry in `data/x-tweets.json` references the 1:1 file. Default behavior: after generating the X image, immediately generate the 4:5 companion and add both the tweet and the IG entry to their respective queues.

### What Mike's own tweets and replies look like (observed from live samples)

Captured from reading six of Mike's own posts directly on X. These reflect how his voice actually behaves in the wild, not just how it should behave on paper. Use them as patterns to match in drafts.

**Top-level tweet signature pattern: named-opposition + counter-claim + question.** Mike's strongest engagement-driver shape, observed directly:

```
Crypto Wendy thinks that XRP can go to $10,000

I think that Kaspa to $3 is more realistic.

What do you think?

#kaspa #xrp
```

Three lines, blank line between each, hashtags on their own line at the bottom. Named the specific opponent ("Crypto Wendy"), stated her specific claim ("XRP to $10K"), counter-positioned with his own specific claim ("Kaspa to $3"), invited debate ("What do you think?"). 1,130 views, 23 likes, 10 replies on this one. This pattern compounds because it gives readers three reasons to engage: defend Wendy, defend Mike, or post their own number. Default behavior: when a topic has a competing public claim from a named source, lead with this shape.

**Self-quote-tweets for second-wind engagement.** Mike quote-tweets his own posts to add commentary and surface the original again. Example: he quote-tweeted the XRP-vs-Kaspa post above with a snarky observation about the people on the other side of the debate. The second post drives new eyeballs to the original. Default behavior: don't draft self-quote-tweets yourself unless asked, but be aware Mike does this manually and the original post should be sturdy enough to support a second pass.

**Replies use a different register than top-level posts.** This is the biggest gap between the queued content and Mike's actual reply voice. Observed reply patterns:

- **Lowercase sentence starts and lowercase "i".** Example: *"oh, i often talk about the jobs data..."* and *"personally i think rates will be held in June."* Replies aren't proofread the way top-level posts are. The casing signals conversational/personal register.
- **Conversational fillers.** "oh, ...", "personally i think...", "yeah..." as openers signal the reply is talking-to-a-person, not broadcasting-to-an-audience.
- **Typos and small errors stay in.** Example: *"more massive layoffs at companies do to AI"* ("do to" should be "due to"). Mike doesn't polish replies. Don't fake-polish drafted replies either; the imperfections feel native.
- **Length depends on the question type.**
  - Ultra-short (10 words) for direct opinion questions: *"personally i think rates will be held in June."*
  - Single-sentence + emoji for tribal/community engagement: *"@peakymn Because Kaspa is amazing. It's like a supermodel that's still a virgin. Every guy is like 🤩"*
  - Multi-sentence analytical for macro questions: the jobs-data reply runs ~50 words with embedded mock-quotes ("yea!! more jobs are being created...").
- **Embedded mock-quotes for sarcastic emphasis.** Mike sometimes drops an inner-monologue quote into a reply to mock the consensus position. Pattern: `we think, "yea!! more jobs are being created..."`. Effective because it lets him voice the wrong take in scare quotes without committing to it.

If we ever build a reply-mode for this skill, default to this register: lowercase opener, first-person, short unless the question is analytical, don't sanitize typos.

**Edgy / spicy analogies are allowed in community-tribe replies (not in macro-thesis content).** Mike's reply *"Because Kaspa is amazing. It's like a supermodel that's still a virgin. Every guy is like 🤩"* is a vivid, sexually-suggestive analogy that lands inside the Kaspa community. He WILL use that register; the queue currently doesn't. Default behavior: keep tribal/community-engagement content (replies, occasional standalone tweets) free to use vivid analogies. Keep macro-thesis content (queued tweets, threads, YT posts) cleaner and more analytical. The two registers shouldn't blend in a single post.

**Off-the-cuff personal/political quote-tweets exist but don't belong in the automatable queue.** Mike posts the occasional personal-observation tweet — example: a quote-tweet about brunette-vs-blonde stereotypes referencing public figures. These are low-effort, off-cuff, and use a register that doesn't fit the macro-thesis queue. Default behavior: never draft this kind of content for him. If a transcript contains personal-observation throwaway material, surface it as a topic Mike can post manually if he wants — don't queue it.

**Hashtags on a separate line at the bottom is confirmed.** Mike does in fact put `#kaspa #xrp` on their own line below the body, separated by a blank line. The SKILL.md guidance ("one or two, at the bottom") is consistent with his actual practice.

**First-person conviction is the default top-level voice.** Both top-level posts observed used "I" / "I think" framing ("I think that Kaspa to $3 is more realistic"). Even the snarky personal post is in first-person observational mode ("When I was a kid..."). This reinforces the existing skill rule about preferring first-person.

## Workflow

This skill helps the user turn one long piece of content (typically a livestream transcript) into multiple tweets they can actually ship. It runs in two phases: first you surface the topics worth pulling out, then — once the user picks one — you draft tweet variations for that topic.

The whole thing lives in a folder on the user's machine. The default folder is wherever this `SKILL.md` is installed; if that's not obvious, ask. Inside that folder:

- `transcripts/` — the user drops raw transcript files here (`.txt`, `.md`, `.srt`, `.vtt`)
- `output/` — you write finished tweet files here

Read the transcript directly from the filesystem. Don't ask the user to paste it into chat — that defeats the point of the folder workflow.

## Phase 1 — Find the topics

When the user invokes the skill (or just says "repurpose my latest transcript"), do this:

1. **Pick the transcript.** If the user named a specific file, use that. Otherwise look in `transcripts/` and pick the most recently modified file. If there's only one file, just use it without asking. If there are multiple and the user wasn't specific, list them with their modified dates and ask which one.

2. **Read the whole file.** Don't sample, don't truncate unless it's enormous. Quality of topic extraction depends on you actually understanding the full arc of what was said.

3. **Pull out 3–7 distinct topics.** Each topic should be:
   - Self-contained — it stands on its own without the rest of the transcript
   - Specific — "productivity is about doing less" beats "thoughts on productivity"
   - Tweet-worthy — there's a real claim, story, contrarian take, or practical tip in there
   - Drawn from what the speaker actually said, not generic advice you'd write yourself

   Aim for variety. If the transcript covers five different ideas, surface five topics — don't bunch them under one umbrella. If the transcript is really one extended argument, three or four angles on it is fine.

4. **Present the topics in chat as a numbered list.** For each one give a short title (4–8 words) and a one-sentence summary that includes the actual hook from the transcript. Then ask which topic the user wants to turn into tweets. Something like: "Which one should I draft tweets for? You can pick one or more."

## Phase 2 — Draft tweets for the chosen topic

**Before drafting, read `VIRAL-TWEET-STANDARDS.md` in this same folder.** It is the authoritative source for hook strategy on this account. It contains 12 reverse-engineered hook templates, 15 writing principles, lead-magnet mechanics, and niche-specific observations for BTC / macro / Kaspa Twitter — drawn from real high-performing tweets in the user's lane. Treat its hook templates and writing principles as constraints, not suggestions. The Phase 2 instructions below are the workflow; the swipe file is the style.

### Decide format first: single tweets or a thread?

Before drafting, decide whether the topic wants single tweets or a thread. The wrong format wastes both the topic and the user's time.

**Default to single tweets when:**
- The topic is one self-contained claim or hot take
- The transcript is short or covers many disconnected ideas
- The user has explicitly asked for tweets (plural, but not "a thread")

**Default to a thread when:**
- The topic is a sustained argument with multiple supporting beats (history, parallels, evidence chain)
- A single tweet can land the hook but not the proof
- The transcript is long-form and structured as one extended thesis (talks, deep-dives, narrative explainers)
- The user has explicitly asked for a thread

If you're not sure, ask the user once: "This one feels like a thread because [X]. Single tweets or a thread?" Don't ask every time.

The single-tweet workflow follows the rest of this Phase 2 section. The thread workflow has its own subsection at the end ("Thread mode") — use it when threads are the right format.

Once the user picks a topic (or several), generate **3 tweet variations** per topic. Variety across the three matters — don't just rephrase the same sentence three different ways. Reach for different hook patterns from the swipe file's library, e.g.:

- The stat-stack parallelism (Pattern 5)
- The contrarian aphorism with timestamp (Pattern 7)
- The before/after hypocrisy contrast (Pattern 9)
- The named-driver thesis (Pattern 8)
- The reframe / debunk (Pattern 10)
- The numbered-thread insider decode (Pattern 11)

Pick three patterns that each land the topic from a different angle. If a topic is naturally well-served by one pattern (e.g. Vanguard reversal → before/after diptych is the obvious play), use it for one variation but stretch the other two into different patterns to give the user real choice.

Constraints to respect:

- **Hard 280-character cap.** Count and trim. Tweets that overflow are useless.
- **Use the speaker's actual words and examples where possible.** This is the user's voice, not a generic brand. If the transcript has a specific number, anecdote, or phrase that lands, use it.
- **Hashtags: one or two, at the bottom.** Inline hashtags break readability and look bot-like. Put them on a final line below the body. None is fine if nothing fits naturally.
- **No "as an AI" hedging, no corporate softening, no "in today's fast-paced world" filler.**
- **Threads are OK** if the topic genuinely needs them. If you draft a thread, format it as numbered tweets (`1/`, `2/`, etc.) and make sure each individual tweet is under 280 characters.

### Writing for virality — the hook is everything

The first 1–2 lines of a tweet (the "hook") are roughly 80% of its performance. If the hook doesn't earn the scroll-stop, the rest of the tweet doesn't exist. Write the body around the hook, never the other way around.

The complete hook template library, writing principles, and niche-specific guidance live in **`VIRAL-TWEET-STANDARDS.md`** in this folder. Always consult that file when drafting. Key sections to pull from:

- **Synthesis A — Hook Pattern Library.** 12 fill-in-the-blank templates with examples and recommended use cases (M2, BTC ETF flows, Kaspa upgrades, FOMC, etc.).
- **Synthesis B — Writing Principles Cheat Sheet.** 15 principles including specificity beats adjectives, withhold the punchline, coin a phrase, borrow authority, end with a screenshot-bait line.
- **Synthesis D — Niche-specific observations for BTC/macro/Kaspa.** What the under-250K mid-tier crowd actually does that works; tribal contrast patterns; coined phrases (e.g. "the M2 Override," "the Kaspa Cliff," "the Covenant Premium") to use weekly.

**Hook anti-patterns — never use these openers:**

- Vague openers: "Some thoughts on X..."
- Hedging: "I might be wrong, but..."
- Permission-seeking: "Just a quick thought..."
- Filler phrases: "In today's fast-paced world..."
- Generic teaching openers: "Here's a tip..."
- Apologetic openers: "Sorry to bother..."
- Long setup before the actual point — if your hook needs three sentences of context to land, the hook isn't your hook

**Optional technique: Unicode bolding for the opening line.** Some accounts use Unicode bold (𝗯𝗼𝗹𝗱) on the hook to add visual weight, since the X composer doesn't natively support bold. Use sparingly — overusing it reads as gimmicky. Never bold more than the hook itself.

**Niche context.** This account's lane is BTC, macro, and Kaspa. When the transcript covers any of those, lean hard into the BTC/macro/Kaspa-specific observations in the swipe file (Synthesis D) — three-asset stat stacks, coined-phrase repetition, tribal contrast (PoW vs PoS, fair-launch vs founder-cult, etc.), and pre-positioning around the next Kaspa hardfork milestone. For non-niche transcripts (productivity, general interest), the universal templates in Synthesis A still apply.

### Formatting and engagement style

These patterns help tweets surface in feeds and earn replies. Use them as defaults; deviate only when a topic genuinely needs a different shape.

- **Cashtags for tickers.** When the topic involves a crypto coin or stock, use `$TICKER` format (`$PENGU`, `$BTC`, `$NVDA`). Twitter indexes cashtags separately from regular text, so traders searching by ticker will find the post. Use cashtags inline within the body, not just at the end.
- **Emojis: aim for at least 1 in every 10 posts.** Two flavors are both fair game: (a) **content-anchor emojis** tied to the subject (🐧 for Pengu, 🤔 to flag a question), which help the eye stop on color in a text feed; (b) **Mike's signature vibe emojis** (😎 sunglasses, 💪 flex, 🚀 rocket, 🔥 fire, 🧠 thread sign-off), which convey posture rather than meaning and feel native to his account voice. Use one or the other; combining both in the same tweet usually reads as overkill. Avoid emoji-stuffing; three or more in a single short tweet still reads as low-effort. The 10% floor is a minimum, not a ceiling: when the tweet's tone calls for it, lean in.
- **Never use market/chart emojis (📈 📉).** These are strongly associated with AI-generated content and signal to readers that the post wasn't written by a human. Avoid them in all contexts — hooks, body, sign-offs, and visual contrasts. Use descriptive language or other emojis instead.
- **Visual contrasts when comparing two things.** Emoji pairs like 🐧 vs 🐸 make the framing pop. Especially good for "X is going to flip Y" or "X vs Y" hot takes.
- **Open with a hook in line one.** First line decides whether someone keeps reading. Strong openers: a controversial claim, a specific number, a question, or a pattern-interrupt phrase ("Quick reality check:", "Hot take incoming:"). Don't bury the lede in setup.
- **At least one variation should open with a question.** Questions reliably earn more replies than statements, and replies are the strongest engagement signal Twitter weights. When generating 3 variations for a topic, make at least one of them a question hook.
- **Whitespace is a feature.** Short lines and blank lines between thoughts are easier to scan on mobile (where most of Twitter lives). Wall-of-text tweets get scrolled past.
- **Hard numbers when you have them.** Specific stats ($1.6B vs $640M, "82 days in this channel", "13x target on Bitcoin") are more credible and more shareable than vague claims. Pull the actual numbers from the transcript whenever they exist.

### Where to save the output

Write the tweets to a markdown file in `output/`. Use this filename pattern:

```
output/YYYY-MM-DD_<transcript-stem>.md
```

For example, if the transcript was `transcripts/2026-04-29_morning-stream.txt`, the output file is `output/2026-04-29_morning-stream.md`.

If the file already exists (because the user is repurposing the same transcript again, or coming back for a different topic), append a new section to it rather than overwriting.

### Output file format

Use this structure so the file is easy to scan and copy from:

```markdown
# Tweets from: <transcript filename>

Generated: YYYY-MM-DD

## Topic: <topic title>

> <one-sentence topic summary>

### Variation 1
**Hook:** <the first line, or first 1–2 lines if line one is very short>

<full tweet text>

*<character count>/280*

### Variation 2
**Hook:** <the first line, or first 1–2 lines if line one is very short>

<full tweet text>

*<character count>/280*

### Variation 3
**Hook:** <the first line, or first 1–2 lines if line one is very short>

<full tweet text>

*<character count>/280*

---
```

Repeat the `## Topic:` block for each topic the user picked. The horizontal rule separates topics so the file stays readable as it grows.

The **Hook:** line is required. It's the part of the tweet that determines whether anyone reads the rest, and pulling it out explicitly serves two purposes: (1) it forces you to think about the hook as a discrete unit while drafting, and (2) it's the value that gets tracked in `data/x-tweets.json` (see "After approval" below) so the user can later analyze which hook patterns drove the most reach.

## After saving — review and approve

Tell the user the file path with a `computer://` link so they can click straight to it. Then ask which variation(s) they want to add to the posting queue. Phrasing like: "Which of these should I add to the schedule? You can say '1', '2 and 3', 'all', or 'none — let me tweak first.'"

The user has three reasonable next moves:

- **Approve one or more.** Append each approved tweet to the schedule queue (see next section).
- **Tweak.** Rewrite the variation tighter, change the angle, swap the hook style, etc. — then re-confirm.
- **Reject all and move on.** Generate tweets for another topic from the same transcript, or pull a new transcript.

Keep the back-and-forth quick — the user is here to ship posts, not to chat about the process.

## Thread mode

When the topic is a sustained argument that single tweets can't carry, draft a thread instead. Threads work best for sub-250K accounts because they anchor the dwell-time signal that pushes posts to broader reach (per `VIRAL-TWEET-STANDARDS.md` Synthesis D #10).

### How threads differ from single tweets

- Generate **2 thread variations** per topic (not 3 — threads are bigger investments and 2 gives real choice without overwhelming the review).
- Each variation is **N content tweets + 1 CTA tweet**, where N is randomly chosen between 4 and 7 (giving a total of 5–8 tweets). Pick N independently for each variation so the two drafts don't always land at the same length. 8 total is the hard cap — don't go over. If the topic genuinely can't be told within 7 content tweets, suggest splitting it into two threads rather than blowing past the limit.
- The **first tweet is the only one that needs a viral hook** — it's the gate to the rest. Tweets 2–7 just need to deliver on the hook's promise.
- The **last content tweet is the takeaway**. Land it punchy — single line that's screenshot-bait, restating the thesis or its implication.
- The **final tweet is always a CTA**. See "CTA pattern" below.
- Each individual tweet still has the hard 280-char cap.
- Use `1/N` style numbering at the start of each tweet (where N is the total including the CTA) so readers know how many beats are coming. The CTA gets numbered like the rest — no need to flag it specially in the numbering.

### CTA pattern (8th tweet)

The CTA exists to convert thread readers into followers. Keep it short, value-focused, and consistent so people who see multiple threads recognize the pattern.

**Default CTA target:** Follow @mikeneder on X.

**Default CTA template:**

```
If [thread payoff] —

Follow @mikeneder for [value prop — what they'll get from following].

[short signature line, often emoji]
```

**Example:**

```
If this reframed how you're thinking about the cycle —

Follow @mikeneder for macro × crypto threads that ignore the 4-year cycle echo chamber.

🧠 + 📈
```

**CTA writing rules:**
- Open with an "if" clause that references what the thread just delivered ("If this reframed…", "If you got value from…", "If this hit…"). This filters for engaged readers and primes them with self-identification before the ask.
- The value prop should be specific to the niche, not generic ("for macro × crypto threads," not "for great content").
- Keep it under ~200 chars so it reads cleanly and leaves room for visual breathing space.
- **Never mention posting cadence or time frame.** No "weekly," "daily," "every week," "each week," "weekly threads," etc. Mike posts threads at irregular cadence (sometimes once a day, sometimes twice, sometimes a gap); putting a frequency word in the CTA misrepresents reality and creates an expectation he doesn't want to set. Same applies to YT post CTAs ("More macro × crypto each week" → "More macro × crypto"). The value prop describes what readers get, not how often.
- Sign off with a short emoji line or one-liner. Never with another full sentence.
- **Never use this slot for content.** It's CTA-only. If you find yourself trying to land a final argument here, move that to tweet 7 and rewrite the CTA.

**Future CTA targets** (not yet implemented — placeholder for when the user asks):
- YouTube subscribe (when there's a YouTube channel to drive to)
- Newsletter signup
- Community / paid offer
- Product launch

When the user adds a new CTA target, document it here with the same template structure. The system can then rotate or pick a CTA target per thread.

### Pick two distinct structures

Each variation should use a different structural shape. Don't draft the same arc twice with different words. Common thread structures:

- **Historical-parallel** — chronological walk through a precedent, overlaid on today.
- **Hook-and-thesis-first** — open with the punchline, back-fill with evidence.
- **Numbered-breakdown** — "5 things I learned about X. 1/ … 2/ …"
- **Personal-narrative** — "Here's what happened when I tried X." Story beats.
- **Stat-stack-and-conclusion** — open with a specific stat, expand with more, end with the implication.
- **Contrarian-debunk** — "Everyone thinks X. Here's why X is wrong." Dismantle the consensus piece by piece.

### Draft output format (markdown, in `output/`)

Filename: `output/YYYY-MM-DD_<transcript-stem>_threads.md`

```markdown
# Thread variations from: <transcript filename>

Generated: YYYY-MM-DD

## Topic: <topic title>

> <one-paragraph topic summary>

---

## Variation A — <short style label>
**Style:** <one-line description of the structural shape>
**Hook pattern:** #N <pattern name from VIRAL-TWEET-STANDARDS.md>
**Tweets:** N

### 1/N
**Hook:** <first line — only required on tweet 1, not the rest>

<full tweet text>

*<charcount>/280*

### 2/N
<full tweet text>

*<charcount>/280*

(...continue through N/N...)

---

## Variation B — <short style label>
(same structure as Variation A)

---
```

### After approval — write to data/x-threads.json

When the user picks a variation (or asks you to combine pieces of both), append a new thread object to `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-threads.json`. The `threads` array gets a new entry shaped like this:

```json
{
  "id": "thread-YYYY-MM-DD-<short-slug>",
  "topic": "<topic title>",
  "source_transcript": "transcripts/<filename>",
  "variation_label": "A | B | custom",
  "created_at": "<ISO 8601 timestamp>",
  "status": "pending",
  "posted_at": null,
  "thread_root_url": null,
  "tweets": [
    {
      "position": 1,
      "text": "<full tweet text, newlines preserved>",
      "hook": "<the hook line — only meaningful on position 1>",
      "char_count": 175,
      "posted_url": null,
      "views": null,
      "views_captured_at": null
    },
    {
      "position": 2,
      "text": "...",
      "hook": null,
      "char_count": 235,
      "posted_url": null,
      "views": null,
      "views_captured_at": null
    },
    {
      "position": 8,
      "text": "If this reframed how you're thinking about the cycle —\n\nFollow @mikeneder for weekly macro × crypto threads...",
      "hook": null,
      "is_cta": true,
      "char_count": 159,
      "posted_url": null,
      "views": null,
      "views_captured_at": null
    }
  ]
}
```

The `is_cta: true` flag on the final tweet is informational — it lets future analysis distinguish hook-driven engagement (positions 1–7) from CTA-driven follow conversions (position 8). The schedule-tweets skill posts CTAs the same as any other tweet in the chain; the flag just helps with later attribution.

Read the file, parse JSON, append the new thread to the `threads` array, write it back with proper indentation. Confirm with the user: "Added a thread of N tweets to the queue. Next time you run the schedule-tweets skill, it'll post the whole chain in one go."

The schedule-tweets skill handles the atomic posting — it picks up the first thread with `status: "pending"`, posts each tweet as a reply to the previous one, captures every URL, and marks the thread `posted` only when the entire chain shipped.

## X poll mode

When the user asks to draft an X poll (or says "make a poll", "let's do a poll on X", "ask the audience", or any setup where the goal is forced-choice engagement rather than a regular tweet), use this mode.

X polls are the highest comment-to-impression ratio format on the platform when the question is well-framed. They work because they reduce the cost of engagement to a single tap; readers who would never reply to a tweet will tap a poll option, and the algorithm weights poll votes as engagement.

### Topic filter — X polls only (do not apply to YouTube polls)

**Only create X polls for topics in these three categories:**

- **Kaspa / KRC20** — anything about $KAS, the Kaspa chain, its tokenomics, upcoming hard forks, KRC20 meme tokens (Kappy, Kasy, Kroak, Kasper, etc.), or Kaspa community debates.
- **TON / Toncoin** — anything about $TON, the TON ecosystem, Telegram-native crypto, or Notcoin.
- **TAU** — anything about TAU or its community.

**Do NOT create X polls for other topics**, including macro/Fed content (interest rate calls, inflation, jobs data), geopolitical/war content, general BTC/ETH cycle takes, or any other topic that isn't one of the three above. Observed engagement data shows X polls on non-community-coin topics get almost no votes; the audience engages with polls only when tribal identity is on the line. Macro/Washington/Fed content performs as tweets and threads on X but dies as polls.

This filter applies **only to X polls**. YouTube text polls are not restricted — they get engagement across all topic types and should still be drafted for any approved concept. When a concept passes the topic filter for X polls but wouldn't pass it for YouTube, draft both anyway (YT poll is not filtered); when a concept fails the X poll filter, skip the X poll but still offer the YT poll if the concept warrants it.

**When a transcript yields concepts that don't qualify for X polls,** skip the X poll draft step for those concepts and note why (e.g. "Skipping X poll for the Fed-rate concept — macro topics don't get poll engagement on X; drafted a YT poll instead"). Don't offer X poll drafts as if they're optional — the filter is a hard rule, not a preference.

### How polls differ from regular tweets

- A poll is a tweet with a poll widget attached. The tweet text frames the question; the poll itself is the answer mechanism.
- The tweet text must serve double duty: stop the scroll AND set up the poll question clearly. Short and punchy outperforms long context.
- Generate **3 poll variations** per topic (same as regular tweets), each with a different framing approach.
- Tribal contrasts work especially well. Forks like "Camp A vs Camp B" generate the most votes because readers want to declare allegiance.

### X poll constraints (hard limits, never violate)

- **Tweet text:** up to **280 characters** (same as a regular tweet).
- **Options:** anywhere from **2 to 4 options**. Each option max **25 characters**. Both numbers matter; the 4-option ceiling and the 25-char-per-option ceiling are X's hard limits, not preferences.
- **Duration:** one of `5m`, `1h`, `1d`, `7d`. Default to `1d` for active engagement; use `7d` for slower-burn macro questions where you want maximum reach over multiple days.

### How many options to use (don't default to 4)

The right option count depends on the kind of question. **Don't reflexively use 4 options every time.** Each count has a sweet spot:

- **2 options (yes/no, A/B, this/that).** Use when the question forces a clean binary stake. The lower the option count, the higher the vote rate per impression, because the cognitive load to answer drops to almost zero. Best for: "Does X happen by year Y?", "Bullish or bearish on Z?", "Maxi or realist?". Yes/no polls also dominate the algorithm because they convert lurkers (who would never reply) into voters.
- **3 options.** Use when there's a clear middle ground or a third meaningful position. Avoid the trap of making the third option a wishy-washy "maybe" or "depends" — that kills votes because nobody wants to mark themselves as undecided. The third option should be its own real position.
- **4 options.** Use for spectrum questions (price ranges, timeline buckets, ranked tradeoffs) where the answer space genuinely needs four distinct buckets. The cost is each option gets fewer votes (the pie slices smaller), but the upside is the poll captures granularity you can read in the results.

When in doubt, lean toward fewer options. 2-option polls outperform 4-option polls on raw vote count almost every time.

### Hook patterns that work best for polls

In rough order of historical engagement:

1. **Yes/no with a stake.** Binary, but the tweet text raises the stakes ("If you're wrong, you're early. If you're right, you called it first."). Often the highest-vote format because it's frictionless to answer.
2. **Forked debate ("Camp A vs Camp B").** Two clear sides, options labeled with the camp identifiers. Best for tribal questions: maxis vs altcoin holders, bulls vs bears, this cycle vs next cycle.
3. **Specific number prediction.** Ask for a price target, a year, a count. Options are ranges. Forces commitment without requiring expertise.
4. **Forced ranking.** "Which flips first?" or "Which one wins?" with named candidates as options. Works when the user has a roster to compare.

### What makes a poll question worth voting on

The bar for a poll question is much higher than for a regular tweet. A regular tweet can be informative, observational, or even neutral and still earn engagement. A poll has to **make the reader feel like NOT voting is a small failure of conviction**. If the question doesn't pull people out of their lurker mode, the poll dies in low single digits.

The questions that work share these traits:

- **Touch identity.** "Are you maxi or realist?" outperforms "Is BTC the best crypto?" because the first one lets the voter declare what kind of person they are. People love declaring identity.
- **Make neutral feel like a cop-out.** If the reader can vote "I don't know" without feeling like they're avoiding the question, they will. Design the options so every choice is a real position; if there's a middle option, it should be its own opinion, not an escape hatch.
- **Pick a fight politely.** The best polls challenge a widely-held assumption. "Is the 4-year cycle dead?" generates more votes than "What do you think of the cycle?" because it asks the reader to side with or against an emerging consensus.
- **Be answerable from the gut.** Polls that require expertise to answer ("Which Layer 1 has the best validator distribution?") get fewer votes than polls that anyone can vote on with a rough opinion. Lower the expertise bar; raise the conviction bar.
- **Stakes the reader already cares about.** Tie the question to something the reader is already thinking about (their bag, their bias, their tribe). Don't ask abstract questions; ask questions that connect to what they were already debating in their head.

The test: if the reader scrolling past thinks "I have to vote" rather than "interesting question," the poll is calibrated right.

### Crafting good options

- **Each option must be ≤ 25 characters.** Trim aggressively. Use abbreviations (`$1M+` instead of `over one million dollars`).
- **Options should be mutually exclusive.** Voters can only pick one; ambiguous overlap kills the poll.
- **Make every option feel like a defensible position.** Avoid joke options unless the entire poll is satirical; they suppress real engagement.
- **Order matters.** First and last options get slightly more clicks (recency/primacy bias). Put your two strongest framings at positions 1 and last.

### Hook field is required (and what it actually is)

Every poll object needs a `hook` field, same as every tweet. The hook is the **first line of the tweet text**, isolated for tracking purposes. Even though the whole tweet text is what gets posted, the hook is the line that determines scroll-stop, and storing it separately lets you analyze later which hook patterns actually drive votes versus which fall flat.

If you find yourself drafting a poll where the first line isn't strong enough to be called a hook, the poll itself probably isn't ready. Rewrite the opener until it stands on its own.

### Draft output format (markdown, in `output/`)

Filename: `output/YYYY-MM-DD_<transcript-stem>_x-poll-drafts.md`

```markdown
## Poll Variation 1: <short style label>
**Hook pattern:** <pattern name>
**Duration:** 1d (or 7d)

**Tweet text:**
> <the framing/question, ≤ 280 chars>

**Options:**
1. <option 1, ≤ 25 chars> (`X chars`)
2. <option 2, ≤ 25 chars> (`X chars`)
3. <option 3, ≤ 25 chars> (`X chars`)
4. <option 4, ≤ 25 chars> (`X chars`)

*Tweet text: <X>/280*
```

Show 3 variations. Ask the user to pick one before writing to `data/x-polls.json`.

### After approval — write to data/x-polls.json

When the user approves a poll, append a new poll object to:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-polls.json
```

The JSON schema is:

```json
{
  "id": "poll-YYYY-MM-DD-<short-slug>",
  "topic": "<topic title>",
  "source_transcript": "transcripts/<filename>",
  "tweet_text": "<the question/framing, newlines preserved>",
  "hook": "<the first line of tweet_text for tracking>",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "duration": "1d",
  "created_at": "<ISO 8601>",
  "status": "pending",
  "posted_at": null,
  "poll_url": null,
  "results": null,
  "results_captured_at": null
}
```

The `results` field stays null until the schedule-tweets skill captures the final vote tally after the voting duration ends. Format will be `{"Option 1": 234, "Option 2": 567, ...}`.

After appending, confirm with the user: "Added poll to the queue."

## YouTube text poll mode

When the user asks for a YouTube poll (or says "make a YT poll", "let's do a poll on YouTube", "add a poll to that YT post", etc.), use this mode.

YouTube text polls are the YouTube Community section equivalent of X polls. They share the same engagement mechanics (low-friction tap-to-vote, high vote-to-impression ratio when well-framed, identity-driven framing wins) but the platform allows different constraints than X.

### How YT text polls differ from X polls

- **Question text can be long.** YouTube community posts allow up to several thousand characters. Use the runway when the question benefits from setup, but don't pad. The "scroll-stop in the first 200-300 chars before the Read more fold" rule from YouTube community post mode still applies; the rest of the body adds context.
- **Options can be longer.** Each option can be up to **65 characters** (vs X's 25). This matters because YT options can be full phrases instead of compressed shorthand. Use the room to write options that read like real positions instead of cryptic abbreviations.
- **Same option count as X.** YT permits **2 to 4 options** (same as X). The "fewer is usually better" rule applies; don't reflexively use 4. The platform difference is the per-option character limit, not the count.
- **No duration / auto-close.** YouTube polls don't expire on a timer. They stay open until the post is deleted. The schedule-tweets skill captures a results snapshot at a configurable maturity window (default 7 days post-posting), but the poll itself remains live.

### All the X poll writing rules still apply

Re-read the X poll mode section above. Every rule about question quality (touch identity, make neutral feel like a cop-out, pick a fight politely, be answerable from the gut, stake the reader cares about), option crafting (mutually exclusive, defensible positions, no joke options, order matters), and the "I have to vote" calibration test applies identically here. The YT-vs-X differences are about format and platform constraints, not about what makes a poll worth voting on.

### How many options to use (same logic as X polls)

- **2 options:** binary stakes, yes/no, A/B. Highest vote rate per impression.
- **3 options:** when there's a real third position (not a wishy-washy middle).
- **4 options:** spectrum questions (price ranges, timeline buckets, ranked tradeoffs).

### Draft output format (markdown, in `output/`)

Filename: `output/YYYY-MM-DD_<transcript-stem>_yt-text-poll-drafts.md`

```markdown
## YT Poll Variation 1: <short style label>
**Hook pattern:** <pattern name>
**Source post:** <yt-post-id this poll relates to, if any>

**Question text:**
> <the post body framing the poll, ≤ ~3000 chars>

**Options:**
1. <option, ≤ 65 chars> (`X chars`)
2. <option, ≤ 65 chars> (`X chars`)
...

*Question text: <X> chars*
```

### After approval — write to data/yt-text-polls.json

When the user approves a poll, append a new poll object to:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-text-polls.json
```

The JSON schema is:

```json
{
  "id": "yt-text-poll-YYYY-MM-DD-<short-slug>",
  "topic": "<topic title>",
  "source_post": "<yt-post-id this relates to, or null if standalone>",
  "source_transcript": "transcripts/<filename>",
  "question_text": "<the full YT post body that frames the poll, newlines preserved>",
  "hook": "<the first line of question_text for tracking>",
  "options": ["Option 1", "Option 2", ...],
  "capture_results_after_days": 7,
  "created_at": "<ISO 8601>",
  "status": "pending",
  "posted_at": null,
  "post_url": null,
  "results": null,
  "results_captured_at": null
}
```

The `capture_results_after_days` field controls when the schedule-tweets skill snapshots the vote tally. Default 7 days; can be overridden per-poll if you want a faster or slower read.

The `source_post` field links the poll to the long-form YT post it accompanies. Useful when polls are paired with posts (which is the common case); set to null for standalone polls.

After appending, confirm with the user: "Added YT text poll to the queue."

## Lead-gen tweet mode

When the user asks to draft a tweet whose primary purpose is to drive comments that trigger an auto-DM with a lead magnet (PDF, mini-course, swipe file, etc.), use this mode. Common triggers: "lead gen tweet", "I have a PDF I want to send", "draft a tweet that gets people to comment X", or any setup where the goal is follower-acquisition + DM-list growth rather than pure topical engagement.

This is the format reverse-engineered in `VIRAL-TWEET-STANDARDS.md` Category 1. Read that section first; the patterns there are the proven shapes.

### How lead-gen tweets differ from regular tweets

- The tweet exists to convert scroll-stoppers into commenters. The body has to do double work: deliver enough value/proof to be screenshot-worthy on its own, while also creating a hunger for the deliverable in the DM.
- Generate **3 variations** per lead magnet (same as regular tweets), each using a different hook pattern from the swipe file (stat-shock, contrarian aphorism, stacked-receipts parallelism, etc.).
- Stack receipts when possible. Lead-gen tweets benefit more from showing track record than regular hot-take tweets do, because the reader needs to believe the deliverable is worth commenting for.
- Use cashtags inline for any tickers mentioned. Cashtags amplify discovery, which matters for lead-gen because every extra view is a potential commenter.

### CTA pattern (the closing block)

The default lead-gen CTA includes a trust-building disclaimer about what will and will not happen in the DM. This matters in crypto especially, where DM scams are constant and unsolicited PDFs from strangers create scam suspicion. The disclaimer disarms that concern up front, which lifts comment-conversion meaningfully.

**Default CTA template:**

```
Comment '<KEYWORD>' below, and follow so I can DM you <DELIVERABLE_DESCRIPTION>. (Note: I will NOT ask you to buy anything or to send me money in my DM, and there will be NO links in my PDF. I will only ask you to subscribe to me on YT. Don't trust anyone else.)
```

**Filled-in example** (from the CryptoRich 46x lead magnet):

```
Comment '46x' below, and follow so I can DM you a PDF with my strategies. (Note: I will NOT ask you to buy anything or to send me money in my DM, and there will be NO links in my PDF. I will only ask you to subscribe to me on YT. Don't trust anyone else.)
```

**Slot meanings:**

- `<KEYWORD>` — the comment trigger word, ideally short, related to the offer, and easy to type. **Match the keyword to the headline number of the specific story being told in the tweet, not to the lead magnet's filename.** A tweet leading with a 130x DeAgent AI call uses `130x`; a tweet leading with a 46x $LAB story uses `46x`; a tweet leading with a 550x $MYX play uses `550x`. Different keywords across tweets driving to the same PDF are fine; they help you track which hook is converting. Quote it as `'KEYWORD'` in the body so readers know to type it literally.
- `<DELIVERABLE_DESCRIPTION>` — what they'll receive in the DM. Default phrasing: "a PDF with my strategies." For other formats, swap to "a free guide", "the framework", "the swipe file", etc.
- The "subscribe to me on YT" line is the single soft upsell allowed inside the disclaimer. If the user wants to drive somewhere else (newsletter, community, etc.), swap that destination, but keep the structure: NO buying, NO links, only ONE soft upsell.

**Why the disclaimer works:**

- "I will NOT ask you to buy anything" disarms the most common scam expectation.
- "There will be NO links in my PDF" addresses malware/phishing concerns directly.
- "I will only ask you to subscribe to me on YT" sets a single, low-cost expectation so commenters are not blindsided by a sales push later.
- "Don't trust anyone else" inoculates against the wave of impersonator scammers who DM commenters pretending to be the OP. This is a well-documented attack vector on crypto Twitter.

### Char count and X Premium

The default CTA above is roughly 260 characters by itself. Combined with even a short body, the full tweet will exceed the 280-char free-tier cap. **Lead-gen tweets in this format require X Premium** for single-tweet posting. If the user is on the free tier and needs to keep it under 280, the alternatives are:

1. **Short-form CTA fallback:** `Comment '<KEYWORD>'. (Follow so I can DM you.)` This loses the trust-building benefit but fits in any tweet.
2. **Two-tweet split:** the body tweet first, then the long-form CTA as a reply to it. Lower conversion than single-tweet (each click loses readers) but works on free tier.

Confirm the user's posting tier before drafting if it's not obvious. Default assumption for Mike's account: X Premium, single-tweet long-form CTA.

### Hook patterns that work best for lead-gen

In order of historical performance based on the swipe file evidence:

1. **Stacked-receipts parallelism** (Pattern #5 in VIRAL-TWEET-STANDARDS.md). Open with a vertical list of cashtags + multiples. The eye stops on numbers; readers can't help but slow down. Best for accounts with real track records to display.
2. **Stat-shock + behind-the-scenes** (Pattern #5 + #1). Open with raw price specifics, then drop the "I was in early" receipt. Strong when there's a single hero trade.
3. **Contrarian aphorism + receipt** (Pattern #7 + #1). Open by reframing what the reader thinks is a strategy as the actual problem. Works when you can immediately back it up with a receipt that proves you're not just talking.

### After approval — write to tweets.json

Same flow as regular single tweets: append a new object to the `tweets` array in `data/x-tweets.json` with `status: "pending"`. The `hook` field gets the first line. The full body (including the long-form CTA) goes in the `tweet` field. If the char count exceeds 280, flag the user and confirm before saving; the schedule-tweets skill will refuse to post tweets over 280 unless the account has Premium.

## YouTube community post mode

When the user asks to repurpose content for the YouTube community section (or says "make a YT post", "youtube community post", "long-form post for my YouTube"), use this mode instead of single tweets or threads.

YouTube community posts are different from X in three important ways:

1. **No hard character cap.** Posts can run long. Take the room you need; do not pad to fill space.
2. **The "Read more" fold matters more than anything else.** YouTube cuts the post off after roughly 200 to 300 characters in the feed view, and the reader has to click "Read more" to see the rest. If your opening lines do not earn that click, the post is dead. Treat the pre-fold opening with the same intensity you would treat a tweet hook.
3. **Engagement is driven by comment-bait questions.** YouTube's algorithm weighs comments heavily. Every YT post should end with a specific question that invites a real reply, plus a like/subscribe ask.

### How YT posts differ from tweets and threads

- Generate **2 body variations + 3 CTA variations** per topic. Present them to the user so they can mix and match (e.g. "Body 1 with CTA 2, Body 2 with CTA 3"). Do not pre-combine without approval.
- Each body should use the full source content (no compaction). YT posts can carry the entire arc of a long-form video; threads compact and tweets distill, but YT posts unfold.
- The pre-fold opening (first 200 to 300 chars) is the only part that controls click-through. Spend most of your hook-writing energy here.
- The post ends with a CTA block that contains TWO things: a comment-driving question, and a like/subscribe ask.
- Style reference: Tom Bilyeu's YouTube community posts (bold opener, line breaks for visual punctuation, conversational direct address, ends with a question).

### Pre-fold opening rules

The first 200 to 300 characters need to do three things in order:

1. **Stop the scroll.** Lead with a contrarian claim, a stat shock, a named-incumbent-is-dying take, or a counterintuitive reframe. The same hook patterns that work for tweet hooks (see VIRAL-TWEET-STANDARDS.md Synthesis A) work here.
2. **Promise a payoff.** The reader needs to know what they get if they click "Read more." Be specific: "Here's the historical parallel that explains why this expansion is just getting started." Vague promises ("read on for more") do not earn clicks.
3. **Leave a curiosity gap.** Do not give the punchline before the fold. The fold itself should land in the middle of an unanswered question or unfinished thought.

### CTA pattern (last block of the post)

The CTA block always contains two parts; both are required:

1. **An engagement question.** A specific question that invites a real comment. Open-ended ("What do you think?") is weaker than forked ("1-year story or 5-year story?"). Forked is weaker than personal-stake ("If you had to bet right now, where do you put your money?"). Use forked or personal-stake by default.
2. **A like/subscribe ask.** Short, value-focused. Tied to what the reader just got from the post. Same template style as the X CTA pattern documented in the Thread mode section, just adapted for YouTube ("hit like and subscribe", "subscribe if you want to be early on the next one").

The engagement question gets stored as its own field in the JSON (`engagement_question`) for easy analysis later, in addition to being embedded in the body text.

### Draft output format (markdown, in `output/`)

Filename: `output/YYYY-MM-DD_<transcript-stem>_yt-post-drafts.md`

Show 2 body variations and 3 CTA variations clearly labeled, with `[FOLD ↓]` markers where the "Read more" cutoff is expected to land. Ask the user which body and which CTA to use; allow mix-and-match.

### After approval: write to `data/yt-posts.json`

When the user approves one or more body+CTA combinations, append each one as a new post object to:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-posts.json
```

The JSON schema is:

```json
{
  "id": "yt-post-YYYY-MM-DD-<short-slug>",
  "topic": "<topic title>",
  "source_transcript": "transcripts/<filename>",
  "variation_label": "<body label> + <cta label>",
  "body_style": "<short description, e.g. 'narrative arc'>",
  "cta_target": "follow_x | subscribe_youtube | newsletter | etc",
  "created_at": "<ISO 8601 timestamp>",
  "status": "pending",
  "posted_at": null,
  "post_url": null,
  "body": "<full post text including the CTA block at the end, with newlines preserved>",
  "engagement_question": "<the comment-driving question, extracted from the CTA block>",
  "char_count": 2400
}
```

The `cta_target` field allows future expansion when the user adds new CTA destinations (YouTube subscribe, newsletter signup, etc.). For now the default is `follow_x` (drives followers to @mikeneder on X) since YouTube community posts can still link out to X. When the user enables YouTube subscribe CTAs, switch to `subscribe_youtube`.

After appending, confirm with the user: "Added N YouTube post(s) to yt-posts.json. Ready when you are to post them via the schedule-tweets skill."

## Instagram single-image mode

When the user asks to draft for Instagram, port a tweet to IG, or says "make it an IG post," use this mode. This mode covers the **single-image feed post** format. Carousels and reels will have separate modes if the user adds them later.

### How IG single-image posts differ from tweets

- **Image is required.** IG cannot post text-only. Every entry must have an `image_id` and `image_path` pointing to a generated 1:1 (or 4:5) image. If the source tweet doesn't have an image, generate one before drafting the IG post.
- **Caption can be much longer.** Up to 2,200 characters. The right length is "as long as the content earns" — Mike's tweet captions are tight, so IG captions should expand modestly (typically 1.5–3x the tweet's length), not balloon into YT-post territory.
- **Hashtags actually work.** Unlike X (where hashtags hurt reach), IG rewards them with discovery. 12–15 well-chosen hashtags is the sweet spot. Twenty-plus starts to look spammy. Thirty is the hard cap.
- **No clickable links in captions.** IG strips links. Lead-gen flows don't translate from X to IG cleanly; skip lead-gen tweets when porting unless reframed for "link in bio" mechanics.
- **Aspect ratio: 4:5 for IG single-image posts.** Instagram's preferred portrait ratio (4:5) performs better in the feed than square. All IG single-image entries use 4:5. The corresponding X tweet always uses 1:1 — these are two separate generated files (same subject, same prompt, different ratio).

### Caption structure (the IG cousin of a tweet)

The same hook-first instinct applies: line one decides whether someone hits "more" on the caption preview. After the hook, IG allows breathing room the tweet doesn't.

A reusable structure for ported-from-tweet IG posts:

1. **Hook line** (same as the tweet's hook; hits the eye in feed preview).
2. **Body** (the tweet's body, possibly verbatim if the tweet was already long, or with one expanded sentence per beat if the tweet was tight).
3. **Optional context paragraph** (1–2 sentences that wouldn't fit on X but add depth on IG).
4. **Closing line** (a single-sentence call to engage; "Save this for the next time someone tells you the cycle is over" or "Tag someone who needed to read this," etc.).

Don't reflexively add the context paragraph. The tweet was already strong; sometimes the IG version should just match it length-for-length, with hashtags doing the discovery work.

### Hashtag strategy

- **Where to put them: `caption_end` is the default.** Mike's policy is hashtags go in the caption body, never as a comment. Set `hashtag_placement: "caption_end"` on every IG entry. The `first_comment` value exists in the schema for completeness but should not be used unless Mike explicitly reverses this.
- **How many: 12–15.** Enough to reach niche audiences, not so many that the post looks spammy.
- **What to pick:** mix three layers.
  - **Broad crypto** (5–6): `#crypto #cryptocurrency #bitcoin #btc #blockchain #altcoins`
  - **Topic-specific** (4–6): for Kaspa posts: `#kaspa #kas #krc20 #proofofwork #fairlaunch`. For macro/cycle posts: `#macro #fed #qe #cryptocycle #investing #markets`. For Toncoin: `#toncoin #ton #notcoin #telegram`. Etc.
  - **Mike's account/voice** (1–2): `#cryptotrading #cryptoinvesting #cryptonews` (these match the kind of audience the account targets).

Avoid shadowbanned or oversaturated tags (anything with hundreds of millions of posts is too noisy to surface in). Stick to tags in the 10K–10M post range for best discovery.

### Cross-posting workflow (the common case)

When the user says "port this tweet to IG" or "add to IG too":

1. **Check the tweet has an image.** If yes, reuse the same image (same `image_id`, same `image_path`). If no, generate one first via `generate-image.js`, then proceed.
2. **Draft the caption.** Default to `caption = tweet body`. If the tweet is short and would benefit from a context sentence or two, add them. Don't pad just to fill space.
3. **Pick hashtags** appropriate to the topic from the layered strategy above.
4. **Set `source_post`** to the tweet's hook string for traceability.
5. **Append to `data/ig-single-image.json`** with `status: "pending"`.

### Draft output format (markdown, in `output/`)

When drafting from scratch (rather than porting), use:

Filename: `output/YYYY-MM-DD_<transcript-stem>_ig-drafts.md`

```markdown
## IG Post 1: <topic>

**Image:** `x-tweets-<id>-<slug>.png` (1:1)
**Source:** <tweet hook or "original">

**Caption:**
> <full caption text>

**Hashtags (`caption_end`):**
#tag1 #tag2 #tag3 ...

*Caption: <X> chars*
```

When porting from existing tweets, this markdown step is optional; you can write directly to the JSON.

### After approval — write to data/ig-single-image.json

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-single-image.json
```

The schema is documented inline in the JSON file's `$schema_doc` and `$post_schema` keys. Required fields per post: `id`, `caption`, `hook`, `hashtags`, `image_id`, `image_path`, `aspect_ratio`, `status`, `created_at`. The optional `source_post` links to the original X tweet/thread/yt-post when cross-posted.

After appending, confirm with the user: "Added N Instagram post(s) to data/ig-single-image.json. Ready to schedule."

## YouTube post carousel image mode

When the user asks for images for a YouTube community post, use this mode. It is fundamentally different from the tweet image mode: slides are **text-forward and hook-driven**, not illustrative. The images carry the content of the post in compressed, scannable form — each slide is one punchy idea that earns the swipe to the next one.

### How it differs from tweet image mode

| | Tweet images | YT carousel slides |
|---|---|---|
| Text in image | Never | Always — text is the hero |
| Purpose | Visual accent | Compressed content delivery |
| Count per post | 1 | 2–10 |
| Aspect ratio | 1:1 | 1:1 |
| Prompt style | Scene description | Slide design with exact text specified |
| Filename prefix | `x-tweets-` | `yt-posts-` |

### Deciding the slide count and structure

You decide both — don't ask the user. Base the count on how many distinct, standalone ideas the post contains:

- **2–3 slides**: Short post or single sustained argument — hook, one or two supporting beats, closing question.
- **4–6 slides**: Medium post with several distinct points — hook, one slide per key beat, closing question.
- **7–10 slides**: Long post with a full argument chain — hook, one slide per major beat or stat, closing question.

**Fixed anchor rules** (apply regardless of count):
- **Slide 1 is always the hook.** The single most scroll-stopping line in the post — a stat, contrarian claim, or pattern-interrupt. Write it exactly like a tweet hook (see VIRAL-TWEET-STANDARDS.md). This is the only slide someone might see before deciding whether to swipe.
- **Last slide is always the engagement question.** Pull it directly from the post's `engagement_question` field. Frame it as a challenge or choice, not an open-ended "what do you think?" If the field is generic, sharpen it.

Middle slides: one idea per slide, drawn from the post's key beats in order. Each middle slide should be self-contained — a reader who only sees that slide should understand the point without the others.

### Writing the slide text

Each slide gets **one piece of text, ≤ 15 words**. Write it like you're writing a tweet hook:

- Specific over vague: "5,700 TPS vs 7" beats "Kaspa is faster than Bitcoin"
- Stat-forward when there's a number worth leading with
- Contrarian framing when the post is making a counter-consensus claim
- No hedging, no filler, no "in today's world"
- Never use em dashes (use colons, semicolons, or just a line break)

Slide 1 rules are strictest — it must earn the swipe on its own. If someone screenshots only one slide, it should be slide 1.

### Prompt structure for text-in-image

Unlike tweet image prompts (which ban text), carousel slide prompts specify the exact text to render. **Always use one of the four named version templates below** — never invent an ad-hoc minimalist prompt. The version templates are the canonical prompt structure; using anything else produces visual inconsistency across the account.

**Visual variety across the set**: vary the accent element or layout slightly from slide to slide so the carousel feels designed, not stamped. Slide 1 can have a stronger visual element (hero coin, bold graphic). Middle slides lean more text-only. Last slide (question) can echo slide 1's energy.

**Brand colors**: dark navy background, white headline text, teal or gold accent elements. Do not deviate — consistency across slides and across posts is what makes the account look intentional.

**Never use this slide prompt for images that need reference uploads** (lesser-known logos, faces). Text + abstract visuals only. If a slide concept needs a specific logo that the generator won't recognize, use a text label instead: `"[PROJECT NAME]"` in the slide text itself.

### Version library

The versions below are platform-agnostic visual styles. They are currently wired up for YouTube community posts but will apply equally to Instagram when that pipeline is built out. When the user specifies a version, use the same prompt templates and subdir conventions regardless of platform — only the prefix, queue file, and aspect ratio will differ per platform.

**Instagram carousels are built.** Queue file: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-carousel.json`. Image prefix: `ig-carousel-` (e.g. `ig-carousel-<image_id>-<seq>-<slug>.png`), saved to `schedule-tweets/images/ig/`. Use the same YT Images ChatGPT chat (`https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa`). The version styles (1–4) apply directly — follow the same approval workflow as YT carousels (recommend version + slide plan, get approval, then generate). Aspect ratio: 1:1. **By default, IG carousels reuse the same images as the corresponding YT post** (same `image_id` and `image_path` values, pointing to the existing `yt-posts-*.png` files in `images/yt/`). Only generate separate `ig-carousel-` prefixed images when the user explicitly asks for different images for Instagram.

---

**Never pick a version and start generating without approval.** Before generating any carousel images, present your version recommendation for each post with a one-line reason (e.g. "Post 1 → Version 1 because it's a high-energy announcement; Post 2 → Version 2 because it's analytical"). Wait for the user to confirm or redirect. Only generate after explicit approval.

**Slide count: use what the content needs, not a default.** The right number is 4–6 slides. Never pad to hit a target — if 4 slides covers the post cleanly, use 4. Only go to 6 if there's a genuine sixth beat worth a slide. Always present the slide plan (one line per slide) alongside the version recommendation and get approval before running the script.

**Never add slides to a post that already has an `images` array.** Check `data/yt-posts.json` (or `data/ig-carousel.json`) before generating. If the post's `images` field is already populated, skip it unless the user explicitly asks to replace or extend it.

Each version has a fixed style, subfolder, and prompt approach. Never mix versions within a single post's image set.

---

**Version 1 — News-flash** (`--subdir=version1`)

Near-black background, dramatic lighting, bold all-caps white + neon green typography, glowing crypto coin icons, chart/data panel elements. High-energy, aggressive feel. Modeled on viral crypto news graphics.

Prompt template:
```
Bold crypto news graphic, near-black background, dramatic lighting, bold all-caps white and neon green typography. No human faces. 1:1 square. [Describe the text and visual elements.]
```

---

**Version 2 — Tom Bilyeu carousel** (`--subdir=version2`)

Very dark near-black background, clean editorial layout. Small teal all-caps slide counter label top-left (e.g. "1 OF 6"), large bold white title in sentence case, teal accent line for the key insight, dark rounded content box at the bottom with a teal label and white body text. Premium, educational feel.

Prompt template:
```
Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Top-left small teal all-caps label: '[N OF TOTAL]'. Large bold white title: '[TITLE]'. Below, a teal accent line: '[INSIGHT]'. At the bottom a dark rounded box with teal label '[BOX LABEL]' and white body text: '[DETAIL]'. Clean minimal layout, no dramatic effects, no human faces.
```

---

**Version 3 — Tom Bilyeu single image** (`--subdir=version3`) — **RETIRED, do not use**

Previously: real photo of Mike as the full background with text overlay. **Removed from the active version menu as of 2026-05-22.** Only Versions 1, 2, and 4 should be offered for new carousels. Version 3 is left here for reference only; do not recommend it.

---

**Version 4 — Hook + data/chart slides** (`--subdir=version4`)

Two structurally different slide types within the same set:

*Slide 1 (hook):* Full-bleed real photo of Mike as the background. Small chart or data visualization bubble overlaid in one corner (e.g. a candlestick chart, supply curve, or stat callout in a circle). Bold all-caps text at the bottom in white + accent color (green or teal). "SWIPE FOR MORE" CTA at the very bottom. Requires Mike's photo via `--reference-image`.

*Slides 2–N (data):* Light/white or near-white background — completely different from the hook. Structure: title at top, three stat boxes below it (current value / historical average / comparison point), a chart filling the center (line chart, candlestick, or bar chart with labeled axes), and a warning/insight box at the bottom with 2–3 bullet points. Small page-number indicator top-right. Dense, analytical, professional financial look.

**Important limitation:** ChatGPT generates charts as illustrations, not from real data. The visual layout will match but the numbers and lines on the chart will be approximated/invented. If you need exact data (specific KAS supply curve values, precise dates, real CAPE ratios), this style requires a code-generated chart approach rather than ChatGPT image generation — flag this to the user before running.

Hook prompt template:
```
Single editorial hook image, 1:1 square. Full-bleed photo of the person from the reference image as the background. In one corner, a small circular bubble overlay containing a [chart type] chart in [color]. Bold all-caps text at the bottom: white for '[HOOK LINE]', accent green for '[EMPHASIS WORD/PHRASE]'. 'SWIPE FOR MORE' in small white text at the very bottom. No other text.
```

Data slide prompt template:
```
Financial data slide, 1:1 square. White or near-white background. Bold title at top: '[POST TITLE]'. Below it, three horizontal stat boxes showing: '[STAT 1 LABEL]: [VALUE]', '[STAT 2 LABEL]: [VALUE]', '[STAT 3 LABEL]: [VALUE]'. Center: a [line/candlestick/bar] chart with labeled axes showing [what the chart represents]. Bottom: a colored warning/insight box with 2–3 bullet points: [bullet points]. Small page number '[N]' top-right. Professional financial layout, no human faces.
```

---

### File location and naming

Save to:
```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt\
```

Filename convention: `yt-posts-<image_id>-<seq>-<slug>.png`

- `image_id` — 8 hex chars, one fresh UUID **per slide** (not shared across the set)
- `seq` — zero-padded 2-digit position: `01`, `02`, ... `10`
- `slug` — short kebab-case label for the slide content (e.g., `hook`, `tps-stat`, `maxi-question`)

**Example set for a 4-slide post:**
```
yt-posts-a1b2c3d4-01-hook.png
yt-posts-e5f6g7h8-02-dot-com-timeline.png
yt-posts-i9j0k1l2-03-ai-overlay.png
yt-posts-m3n4o5p6-04-engagement-question.png
```

### Running the script

One call per slide. Always pass `--prefix=yt-posts` and `--chat-url` pointing at the dedicated YouTube images chat:

```powershell
node generate-image.js --prefix=yt-posts --chat-url="https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa" --image-id=<8hex> --slug=<seq>-<slide-slug> --prompt="..."
```

**The `--chat-url` is required for YouTube carousel images.** Always use this specific chat — it is the persistent "YouTube Images" conversation. Never omit it and never use a fresh chat for yt-posts; the persistent chat builds up visual style context across sessions.

Generate UUIDs before the run: `python -c "import uuid; print(uuid.uuid4().hex[:8])"` — one per slide.

Reuse the same `--image-id` and `--slug` to regenerate a specific slide; the file is overwritten in place.

### After all slides are generated — update yt-posts.json

Add (or replace) an `images` array on the post object:

```json
"images": [
  {
    "seq": 1,
    "image_id": "a1b2c3d4",
    "image_path": "schedule-tweets/images/yt/yt-posts-a1b2c3d4-01-hook.png",
    "slide_text": "We're not in 2000. We're in 1992."
  },
  {
    "seq": 2,
    "image_id": "e5f6g7h8",
    "image_path": "schedule-tweets/images/yt/yt-posts-e5f6g7h8-02-dot-com-timeline.png",
    "slide_text": "30 years of groundwork. 5 years of mania."
  }
]
```

Do this immediately after all slides are saved — do not wait to be asked. Confirm with the user: "Generated N slides and updated yt-posts.json."

### The iteration workflow

1. Read the post body and `engagement_question` from `data/yt-posts.json`. Check whether the post already has an `images` array — if it does, skip it unless the user asked to replace or extend it.
2. For each post that needs images, recommend a version (1, 2, or 4 — Version 3 requires a reference photo) with a one-line reason per post. Also propose a slide count (4–6) and list the slide texts one line each. Present all of this together in a single message and wait for approval.
3. After the user approves (versions, counts, and slide texts), generate UUIDs — one per slide.
4. Run `generate-image.js` once per slide using the approved version's prompt template. Always pass `--prefix=yt-posts` and `--chat-url="https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa"`.
5. Show the user the file paths so they can preview.
6. Iterate on any slide the user wants changed (same `--image-id`, re-run).
7. Update `data/yt-posts.json` with the full `images` array immediately after generation — do not wait to be asked.

---

## Image generation mode

When the user asks for an image to accompany a tweet, thread, YT post, or poll (or you suggest one and they approve), use this mode. Posts with on-message images get meaningfully more engagement than text-only posts on every platform; the lift only happens if the image actually matches the message.

This mode covers the prompt-writing rules, the iteration workflow, and where the file lands. The image generator itself (ChatGPT / Nano Banana / DALL-E) is upstream of this skill; this skill drives the prompt.

### One image per tweet — no sharing (hard rule, no exceptions)

Every tweet in the queue is an independent post and gets its own unique image with its own unique `image_id`. **Never reuse the same `image_id` across two different tweets under any circumstances** — not even if the tweets cover the same topic, one is a shorter one-liner version of the other, or they were drafted in the same session.

**The most common cause of duplicates:** when a shorter/one-liner variation of a longer tweet is drafted, the shorter tweet incorrectly inherits the longer tweet's `image_id`. This must never happen. Every tweet object written to `data/x-tweets.json` requires its own freshly generated UUID and its own generated image, period.

**The second most common cause:** a pending tweet is assigned an `image_id` that was already used by a posted tweet. Reusing a posted tweet's image is also a duplicate — the image already ran on the platform.

**Mandatory pre-save duplicate check:** Before writing any new tweet(s) to `data/x-tweets.json`, scan the existing `image_id` values across the entire `tweets` array (both pending and posted). If the new tweet's `image_id` matches any existing entry, stop — generate a new UUID and a new image before saving.

**When drafting batches:** if you draft 3 tweet variations for a single topic and all 3 are approved, each one gets its own UUID and its own image generated separately. Never generate one image and assign it to all three.

### File location and naming

Save approved images to:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\x\
```

If the folder doesn't exist, create it.

**Filename convention: `x-tweets-<image_id>-<short-slug>.png`**

- `x-tweets-` — fixed prefix that identifies the file as belonging to the X-tweets repurposing system. Makes the file recognizable at a glance even if it ends up in a mixed folder (e.g. accidentally dropped in Downloads).
- `<image_id>` — short UUID (8 hex characters) generated at save time, used as a stable cross-reference back to the tweet/post/poll JSON. Comes second so the UUID is easy to scan visually after the prefix.
- `<short-slug>` — human-readable description of the subject in kebab-case (lowercase, hyphen-separated). So you can tell at a glance what the image is without opening it.

**Example:** `x-tweets-a3f7c2e9-kaspa-coinbase-illustration.png`

The date is NOT in the filename anymore; the UUID handles uniqueness, and the file system already tracks the creation date in metadata. If you need a date sort, sort by file mtime.

**How to generate the UUID:** in Python `uuid.uuid4().hex[:8]`; in JavaScript `crypto.randomUUID().replace(/-/g, '').slice(0, 8)`; in bash `python3 -c "import uuid; print(uuid.uuid4().hex[:8])"`. Eight hex characters is plenty — collision probability is roughly 1 in 4 billion, fine for personal-scale use.

The UUID lives in two places at once: in the filename (so you can identify the image by inspecting the folder) and in the source post's JSON entry (so the schedule-tweets skill can locate the file when posting). If the file is ever renamed or moved, the UUID is what stays stable.

### Visual style — X tweets and IG single-image posts

All images for X tweets and IG single-image posts share the same visual style and prompt. They are generated as **two separate files**: the X tweet gets a **1:1 square** saved to `images/x/`, and the IG single-image entry gets a **4:5 portrait** saved to `images/ig/`. Both use the same `image_id` and the same prompt — only the aspect ratio changes. Always generate both in the same session; never generate the X image without also generating the IG companion.

**Default style: Pixar/Disney 3D CGI illustration**

Film-quality, smooth, rounded character designs with expressive faces. This is the look to target in 90% of images. Key characteristics:

- **Anthropomorphized crypto coins as characters.** Coins have arms, legs, eyes, and emotions. They are the protagonists of every scene — not props. A Kaspa coin celebrating, a BTC coin looking confused, coins standing in a police lineup, coins being dumped off a cliff. The coin-character treatment is what makes these images immediately recognizable as this account's content.
- **Brand colors for coins, always consistent.** Kaspa = teal/cyan. Bitcoin = gold/orange. Ethereum = purple/blue. Binance = yellow. Stick to these; inconsistency breaks recognition.
- **Dark backgrounds.** Deep navy, near-black, or dark space. Avoid bright or white backgrounds unless the concept specifically needs contrast (e.g. a funnel scene or police lineup where a neutral wall reads better). When in doubt, go dark.
- **Dramatic cinematic lighting.** Rim lighting, spotlights, glows, lens flares. Kaspa characters and objects emit a teal/cyan glow; BTC emits gold/warm orange. The lighting should feel intentional, like a movie poster or a Pixar still frame.
- **Metaphorical storytelling.** Every image should visualize the tweet's core concept as a scene or metaphor — not just decorate it. A tweet about 90/10 wealth transfer → a crowd of cartoon people with coins flowing from one group to another. A tweet about surviving the bear → a character emerging from rubble into sunlight. The image should communicate the idea to someone who hasn't read the tweet.
- **1:1 square aspect ratio.** Always. Square fills the most vertical space in the X feed. Only deviate if the user explicitly asks for a different ratio.
- **No text in images.** Generators produce garbled, misspelled text. Always include "no text or words anywhere in the image" in the prompt.
- **One clear focal subject.** A single character, a single object, or a tight two-character interaction. Crowded multi-subject scenes lose clarity at thumbnail size.

**Secondary style: cinematic photorealistic**

Use this for darker, more dramatic concepts where the Pixar aesthetic would feel too playful — horror/zombie themes, ominous macro events, confrontational scenes. Key differences:

- More realistic rendering, less cartoon rounding
- Heavier atmosphere — storm clouds, moonlight, dramatic shadows
- Still uses the dark-background and dramatic-lighting principles
- Coin characters can still appear but with less exaggerated proportions

**Prompt skeleton (Pixar style):**
```
Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. [Scene description with anthropomorphized coin characters]. Deep navy/near-black background. Dramatic cinematic lighting — [teal glow / gold glow / etc.] rim light. [Mood word: triumphant / ominous / playful / tense]. No text or words anywhere in the image.
```

**Prompt skeleton (cinematic style):**
```
Cinematic photorealistic 3D render, 1:1 square aspect ratio. [Scene description]. Dark atmospheric background — [storm clouds / moonlit wasteland / near-black void]. Dramatic rim lighting and [teal / gold / cool blue] accent glow. [Mood word]. No text or words anywhere in the image.
```

---

### Prompt-writing rules

These rules are non-obvious and learned the hard way. Apply all of them when drafting an image prompt.

**Always name brands explicitly — but only if they're well-known.** Image generators recognize popular crypto/tech/company brands and reproduce their actual logos when named. If you say "a Kaspa coin," you get a recognizable Kaspa logo coin. If you say "a coin with a K on it," you get a generic placeholder. Same applies to Bitcoin, Ethereum, Solana, Coinbase, Binance, OpenAI, Apple, Tesla, etc. **Never describe a well-known brand abstractly when you can name it.**

**The catch — lesser-known brands break this rule.** ChatGPT (and Nano Banana, etc.) don't recognize newer or smaller crypto projects (DeAgent AI, Igra Network, smaller memecoins, etc.). When you name them, the model will either invent a placeholder logo, refuse, or produce something off-brand. For these:

1. **Upload the actual logo as a reference image** in the same prompt. Use the Chrome MCP's `file_upload` tool to attach the logo file to ChatGPT's composer. Reference it in the prompt as "the logo shown in the attached reference image."
2. If no reference logo is available, **skip the logo entirely** — use a clean text label of the project name instead (e.g. "Top center: clean white sans-serif text reading 'DEAGENT AI'"). Text labels render reliably and don't invent fake branding.
3. Never let the model invent a logo for a real project. The fake-logo result looks worse than no-logo, and creates brand-confusion downstream.

**Same principle applies to faces.** Image generators don't know what specific people look like (unless they're celebrities the model was trained on, which is itself a separate concern). To get an accurate likeness of yourself, an employee, or any non-famous person, **upload a reference photo to ChatGPT in the same prompt** and reference it as "the man/woman shown in the attached reference photo." Verbal descriptions like "curly dark hair, beard, mid-30s in a hoodie" produce warped, generic faces.

**When a character in the image represents Mike, always give them bright green eyes.** This applies whether the character is photorealistic or Pixar-style, whether a reference photo is used or not. Include "bright green eyes" explicitly in the character description every time. This is Mike's fixed identifying trait across all generated imagery — it makes the character recognizably consistent post to post without needing a reference upload every time.

**No text in images.** Image generators are notoriously bad at rendering text and will produce garbled letters, misspelled words, or fake-looking lorem ipsum unless explicitly told not to. Always include "no text or words anywhere in the image" in the prompt. If you want a slogan or label, plan to add it post-generation in a graphics tool.

**Specify style and commit.** "Modern editorial illustration", "cinematic photo", "flat vector design", "3D isometric render", "anime line-art" — pick one and stick to it. Mixed-style prompts produce muddy results. The style word is doing more work than people realize.

**Specify aspect ratio.** **X tweet images always use 1:1 square.** Square fills the most vertical space in the X feed and reads well at thumbnail size. Use "1:1 square aspect ratio" in the prompt. **IG single-image posts always use 4:5 portrait** — this is Instagram's preferred feed ratio. Use "4:5 aspect ratio" in the IG companion prompt. For Stories/Reels, use 9:16. Always specify the ratio explicitly; without it, the generator's default may not match what you want.

**Specify mood and lighting.** "Dark navy background with vibrant teal accents and cinematic spotlight" gives the generator a target. "A picture of a coin" leaves it to guess. Mood specification has almost as much impact on the final result as the subject description.

**One main subject.** Image generators handle single-subject compositions much better than multi-subject scenes. Pick the focal element (one Kaspa coin, one chart, one bouncer) and keep the rest as supporting context. If you need multiple subjects, accept some quality loss.

**Use natural language, not lists.** Generators do better with descriptive sentences than with comma-separated tag lists. Write the prompt as a scene description, not as a tag soup.

### Which ChatGPT chat to use

**X tweet images:** always pass `--chat-url` pointing at the dedicated "X Tweets" persistent chat. Never omit it and never open a fresh `https://chatgpt.com/` chat — doing so creates a new chat entry in ChatGPT's sidebar on every run, cluttering the interface with dozens of one-off chats.

```
X Tweets chat URL: https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24
```

**YouTube carousel images:** always pass `--chat-url` pointing at the dedicated "YouTube Images" chat:

```
https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa
```

Both persistent chats are safe because the route-blocking + 10-second generation delay filter in `generate-image.js` handles cached history: all image requests are blocked during page load, and any URL that arrives within 10 seconds of the prompt is ignored. Real generations take 15–60 seconds minimum, so there is no false-positive risk.

### Generation workflow (Playwright script)

Image generation runs through a Playwright script that drives ChatGPT directly: navigates to the X Tweets chat, types the prompt, waits for the image, downloads it to `schedule-tweets/images/x/` (x-tweets) or `schedule-tweets/images/yt/` (yt-posts) with the right filename. **No clicks required from the user.** The script lives at:

```
C:\Users\mnede\Documents\Claude\social-media\repurpose\generate-image.js
```

**Prereq (one-time):** the user runs `node setup-chatgpt.js` once from the repurpose folder to capture their ChatGPT session into `chatgpt-auth.json`. After that, generation is fully automated until the session expires.

**Per-image flow:**

1. **Draft the prompt** based on the tweet/thread/post topic. Apply all the rules above.
2. **Generate an 8-char UUID** for the image (`uuid.uuid4().hex[:8]` in Python, etc.). Reuse the same UUID across regenerations of the same image so the file path stays stable.
3. **Pick a short kebab-case slug** describing the subject (e.g. `kaspa-coinbase-illustration`).
4. **Run the script twice** — once for the X tweet (1:1), once for the IG post (4:5). Use the same `--image-id` and same base prompt for both; change only the aspect ratio in the prompt text and the output prefix/directory:

   **X tweet (1:1):**
   ```
   node generate-image.js --image-id=a3f7c2e9 --slug=kaspa-coinbase-illustration --prompt="<full prompt, '1:1 square aspect ratio'>"
   ```

   **IG companion (4:5) — run immediately after:**
   ```
   node generate-image.js --image-id=a3f7c2e9 --slug=kaspa-coinbase-illustration --prefix=ig-single --prompt="<same prompt, '4:5 aspect ratio'>"
   ```

   The `--prefix=ig-single` flag saves the file to `images/ig/ig-single-a3f7c2e9-kaspa-coinbase-illustration.png` instead of `images/x/`.

   For long prompts, write the prompt to a file and pass it via `--prompt-file=path/to/prompt.txt` instead.

5. **Show both results to the user** for review. The script overwrites the file at the same `<image_id>` slot on every run.
6. **Iterate.** If a result misses, adjust the prompt and re-run with the **same `--image-id`** for both versions. Both files get overwritten in place.
7. **Stop iterating once approved.** Update `data/x-tweets.json` with the 1:1 `image_id` and `image_path`, and add (or update) the IG entry in `data/ig-single-image.json` with the 4:5 `image_path` pointing to `images/ig/ig-single-<id>-<slug>.png` and `aspect_ratio: "4:5"`.

**Never assume the first generation is good.** Image generators routinely miss something subtle (wrong logo orientation, awkward composition, unintended text creeping in). Always show the result before declaring it done.

**Reference-image uploads (faces, lesser-known brand logos) are not yet supported by the script.** If the prompt requires uploading a reference asset, fall back to the manual ChatGPT flow for that one image, save it manually to `schedule-tweets/images/x/` with the same `x-tweets-<id>-<slug>.png` filename, and update `data/x-tweets.json` as usual.

### Linking images back to their tweets via UUID

When an image is generated for a specific tweet, store the image's UUID in the tweet's row so the schedule-tweets skill can locate the file when posting. **The UUID is the canonical link**; the path is convenience, the UUID is truth.

**Scope:** image attachment is currently only implemented for single tweets in `data/x-tweets.json`. Threads, YouTube posts, X polls, and YouTube text polls don't support images in this skill yet. If you generate an image for one of those content types, the user has to attach it manually post-publish.

Schema for `data/x-tweets.json` (only):

- `image_id` — the 8-char UUID, empty for tweets without an image
- `image_path` — full path including UUID, empty if no image. Computed convenience field.

**Example schema entry:**

```json
{
  ...,
  "image_id": "a3f7c2e9",
  "image_path": "schedule-tweets/images/x/x-tweets-a3f7c2e9-kaspa-coinbase-illustration.png"
}
```

**Why both fields:** the `image_id` is the stable identifier that survives renames and moves; the `image_path` is what the schedule-tweets skill uses directly when posting (no file-globbing needed). If `image_path` ever drifts out of sync with the actual file location (e.g. file moved manually), the schedule-tweets skill can fall back to globbing `images/**/*<image_id>*.png` to find the file by UUID.

**When generating an image:**

1. Generate the UUID first (or capture it from the filename you create).
2. Save the file to `images/x/` (for x-tweets) or `images/yt/` (for yt-posts) with the UUID embedded in the filename.
3. Update the source post's JSON row with both `image_id` and `image_path`.

If the JSON row already has an `image_id` and you're regenerating (replacing) the image, reuse the same UUID and just save the new file with the same UUID in the filename. The reference stays stable; only the bytes change.

### Lead-gen images: out of scope

**Lead-gen tweets are not part of this skill's image generation flow.** Lead-gen images (promotional designs with heavy text overlay, hero result numbers, branded compositions like the user's "61X" / "99% IGNORED" examples) require uploaded reference assets (face photos, project logos for non-famous brands) that don't currently work cleanly through automated prompts. Mike creates lead-gen images manually in ChatGPT and is not looking to automate that flow.

If the user asks for an image for a lead-gen tweet, decline politely and remind them they handle those manually. The image gen workflow in this skill is only for regular tweets/threads/posts that benefit from editorial-style illustrations.

### Common image-gen pitfalls

- **Wrong brand reproduction** when you describe a brand abstractly. Always name the brand. (See the rule above; this is by far the most common mistake.)
- **Garbled text** when text isn't explicitly excluded from the prompt. Always say "no text or words anywhere in the image."
- **Cluttered scenes** from too many subjects. Pick one focal element.
- **Style drift** from underspecified style. Pin a single style word up front.
- **Wrong aspect ratio** from not specifying. Default to 1:1 for X unless the user explicitly asks for something else.
- **Inadvertent likeness** when prompting near a real public figure. Image generators sometimes produce recognizable likenesses; if that's not intended, describe a generic person ("a man in a dark hoodie") instead of naming someone.

## After approval — write to the schedule queue

When the user approves one or more variations, append each one as a new object to the `tweets` array in:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-tweets.json
```

The JSON schema is:

| field | what to write |
|---|---|
| `tweet` | the full tweet text, preserving newlines as `\n`. JSON handles escaping natively — no special quote rules. |
| `hook` | the same **Hook:** line you identified in the output file. |
| `status` | `"pending"` (always — the schedule-tweets skill flips this to `"posted"` when it actually posts) |
| `posted_at` | `null` (the schedule-tweets skill fills it on post) |
| `url`, `views`, `views_captured_at` | `null` |
| `image_id`, `image_path` | `null` if no image attached, otherwise the 8-char UUID and the path under `schedule-tweets/images/x/` (for x-tweets) |

After appending, confirm with the user: "Added [N] tweet(s) to the queue. Next time you run the schedule-tweets skill, it'll post the topmost pending one."

**Recommended technique for safe append:** load the file with `json.load()`, append to `data["tweets"]`, then `json.dump()` back. Don't try to splice JSON via Edit on string anchors — easy to corrupt.

This closes the loop: a transcript becomes drafts, the user picks the keepers, and they automatically join the posting schedule with their hook tracked for future analysis.

## Why this skill exists

The bottleneck for most creators isn't ideas — it's pulling them back out of long-form content they've already made. A 60-minute livestream usually contains 5–10 standalone insights worth posting separately, but going back through the recording to find them is tedious enough that most people skip it. This skill is the "tedious extraction" step, automated. The user gets to stay in the creative seat (picking which topics matter, approving the voice) while you do the trawling and drafting.

## Edge cases

- **Transcript is in another language.** Generate tweets in the same language as the transcript unless the user specifies otherwise.
- **Transcript has speaker labels (e.g., "Mike:", "Guest:").** Treat the user's lines as the primary voice. If the guest said something striking, you can still surface it as a topic, but flag it as a quote.
- **Transcript has timestamps.** Strip them when extracting topics. Don't include them in tweets.
- **Transcript is too short to yield 3 topics.** Surface fewer topics rather than padding with weak ones. One strong topic is better than three forced ones.
- **User pastes a transcript directly into chat instead of using the folder.** Work with what they gave you. Skip the file-reading step, do the rest of the workflow normally, and still write the output file to `output/` using today's date and a slugified hint from the content (e.g., `output/2026-04-29_pasted.md`).

## Operational notes captured 2026-05-22

These are concrete operational lessons from a long multi-platform posting + image-regeneration session. They are NOT writing-style rules; they are about how the toolchain behaves and how to drive it without breaking things.

### Image cleanup — never delete by status alone

When cleaning up old image files to free disk, **do NOT use `status === 'posted'` on the X-tweet entry as a proxy for "image no longer needed."** The same `image_path` can be referenced from a pending YT post's `images[]` array or an IG carousel's `images[]` / `slides[]` array. The safe rule:

> Only delete an image file if **every** reference across **every** data file is in a `posted`/`draft` (already-shipped) state.

Specifically, the orphan-detection script must traverse, at minimum:
- `x-tweets.json` → `tweets[].image_path`
- `ig-single-image.json` → `posts[].image_path`
- `ig-carousel.json` → `posts[].slides[].image_path` AND `posts[].images[].image_path` (older entries use `slides`, newer use `images`)
- `yt-posts.json` → `posts[].images[].image_path` (text-only posts have no images array; carousel-style posts do)
- `shorts.json`, `x-polls.json`, `x-threads.json`, `yt-text-polls.json` — currently no image_path fields, but check before assuming.

Missing any of these nestings will misclassify in-use images as orphans and delete them. Treat the safe rule as a hard invariant.

### Images live in git now

The `.gitignore` was rewritten 2026-05-22 to **track all images under `schedule-tweets/images/`**, including `x/`, `yt/`, `ig/`, and `reference/`. The repo-size cost is accepted in exchange for the safety net: any future accidental deletion is recoverable via `git checkout`. The only image-related exclusions that remain are throwaway debug screenshots (`tmp-fb-debug/`, `tmp-tiktok-debug/`, `schedule-tweets/*.png`, `uploading/*.png`, `uploading/new/`).

### ChatGPT image generation — rate limits and delays

ChatGPT Plus allows ~40–50 image generations per 3 hours (one every 4–5 min). `repurpose/generate-image.js` was tuned 2026-05-22 to pace requests:

- **Pre-launch delay:** 15–45s random
- **Typing delay:** 60–100ms per char with jitter
- **Pre-Enter pause:** 10–20s after typing, before submit

These delays are the defaults. When generating in a posting-burst session, keep these or longer.

### Image dimensions

Current ChatGPT output is **1254×1254** for 1:1 prompts. The platform-standard for X/IG/YT images is **1080×1080**. The current pipeline does not downscale; flag this if/when a downscale step gets added. The 1254×1254 still uploads cleanly to all platforms (X compresses; IG and YT accept it), so the impact is purely bandwidth/storage, not visual.

### YT/IG carousel image generation — version selection

When regenerating carousel slides, **always use Version 1, 2, or 4** (Version 3 is retired — see earlier section). For each regen pass:
1. Pick a version (default to Version 1 — news-flash — unless the post body clearly fits another style).
2. Pick a reference image from `images/reference/carousels/versionN/` that matches the slide's role (hook → 01-hook reference, mid-slide → 02/03/04 reference, question → 05-question reference).
3. Pass it via `--reference-image=` to `generate-image.js`.
4. Use the version's prompt template, substituting in slide-text derived from the YT post body (the `images[]` entries often have null `slide_text`, so it must be inferred from the body and the slide slug).

### Profile conflicts that matter when posting in parallel

Each posting script uses a dedicated Chrome profile, but a few collisions exist:

- **X tweets / X polls / X threads / X shorts / reply-guy** all use `xbot-profile`.
- **ChatGPT (for image generation in `generate-image.js`)** also uses `xbot-profile`.
- **TikTok (`post-tiktok-short.js`) uses the MAIN Chrome User Data profile + CDP port 9224.** If any other Chrome window is open against `C:\Users\mnede\AppData\Local\Google\Chrome\User Data` — including stale Chrome processes from earlier runs — TikTok will fail with "Chrome did not open CDP 9224 within 15s." Close all Chrome windows (Task Manager if needed) before running TikTok.

Implication: when interleaving posting and image-gen tasks, **never run image-gen in parallel with an xbot-profile task** (X tweet/poll/thread/short, reply-guy). Image gen can run in parallel with: IG single, IG Reel, IG carousel, YT community post, YT poll, YT short, Rumble, Bitchute, Facebook.

### Recommended future change — dedicated `chatgpt-profile`

To eliminate the xbot collision, create a dedicated `chatgpt-profile` Chrome profile, log into ChatGPT once there, and change the `PROFILE_DIR` constant in `generate-image.js` (currently hardcoded to `xbot-profile`). After that change, image generation can run in parallel with X tweets / X polls / X threads / X shorts / reply-guy, doubling effective throughput during posting bursts.

### Reply-guy `--limit` is not honored

`post_replies.py --limit 5` posted 7 replies in observed testing. The script appears to drain whatever is in the queue at run time, regardless of the `--limit` flag. Treat the limit flag as advisory; the queue empties to whatever is staged. If precise batch sizing matters, pre-trim the queue file before running.

### Status updates during long-running tasks

When running a long sequential posting list, emit a short status line per task in this shape: `[HH:MM:SS] Task N/M start: <script>` and `[HH:MM:SS] Task N/M done in <s>s` plus the live post URL. That gives the user enough info to know progress without a verbose stream.
