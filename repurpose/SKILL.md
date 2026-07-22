---
name: repurpose
description: Turns long-form content (livestream transcripts, podcast episodes, video scripts, talks) into ready-to-post tweets. Use this skill whenever the user mentions repurposing content, says things like "make tweets from this", "what can I post from my livestream", "turn my video into social posts", or refers to a transcript/recording they want to break down for Twitter/X. Also trigger when the user drops a transcript file into the repurpose/transcripts-ad-hoc folder, even if they don't explicitly name the skill. Don't undertrigger — if the user is talking about reusing existing spoken or written content for social media, this skill applies.
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

## Voice, terminology & brand rules → see the central persona

All of Mike's voice, terminology, and brand rules now live in the single source of truth: **`../persona/persona.json`** (see `../persona/README.md`). **Read it before drafting any content.** It is authoritative and **wins on conflict** with the viral-craft guidance in `VIRAL-TWEET-STANDARDS.md`. Do not restate voice rules here — link to persona instead.

`persona.json` covers:
- **Writing style & formatting** — top-level tweet pattern, tone, the **no-em-dash rule** (use semicolons/ellipses/colons/parentheses/periods), hashtags on their own line, "50-week SMA" notation (never "50WMA").
- **Reply voice** — lowercase register, openers, length tiers, reaction-only ratio, mock-quotes, edgy-analogy boundary.
- **Brand voice patterns** — named opposition, no aphorism/punchline closers, no loose status labels, no chain-rotation framing, first-person conviction, pattern-break framing, verified-claims-only (incl. fact-checking + updating transcript numbers to current reality), quantity-not-price framing, and the **1-in-10 correction-bait rule** (5 techniques, never manufacture a factual error).
- **Terminology** — Kaspa vs Casper ($CSPR), the KRC20 K-prefix glossary (Kaspy/Kasy/Kappy/Kasper-the-Ghost), GhostDAG (+ the "fully implemented ghost" audit).
- **Emoji rules** and the **avoid-in-drafts** list (incl. the personal/political quote-tweet boundary).

## Repurpose-specific drafting rules (process, not voice)

These are workflow rules for the repurpose pipeline — how to draft and deploy, not how Mike sounds. Voice/terminology lives in `../persona/persona.json`.

**Two variations should be genuinely different angles, not paraphrases.** When two variations cover the same idea with similar structure, Mike picks one and cuts the other; when they take different angles (data-led vs personal-conviction; pattern-break vs counterfactual), he often picks both. Give each variation its own distinct hook pattern from `VIRAL-TWEET-STANDARDS.md` — don't ship two variations of the same hook with different word choices.

**Don't re-surface skipped concepts within a session.** Once Mike picks which concepts to run with and drops others, the dropped ones don't reappear when moving across formats (tweets → threads → polls → YT posts). The workflow is concept-level decisions first, then format adaptations of the chosen set. Treat a filtered-out concept as a permanent decision for that cycle.

**Cross-platform parallel deployment is the default.** When a transcript yields chosen concepts, assume each will be adapted to multiple formats. Plan in this order: long tweet → one-liner tweet → thread → X poll → YT poll → YT post. Don't ask format-by-format once the concept is approved; adapt to all unless the user opts out.

**One-liner image-first tweets are a separate format class, not a replacement.** Single-sentence tweets paired with an image, offered *in addition to* the long-form versions (not instead). They live alongside the long-form versions in `data/x-tweets.json` and serve different feed contexts (a one-liner + image stops the scroll where a long tweet wouldn't, and vice versa).

**Geopolitical / dark-register content stays at tweet-tier.** War / Iran / black-swan content is OK on X (fast reach, timely take) but doesn't get YT post or YT poll amplification — those build long-term audience association. Draft tweet variations for dark-register concepts, but don't proactively suggest long YT posts or YT polls for them unless the user asks.

**Don't draft self-quote-tweets unless asked.** Mike quote-tweets his own posts manually for second-wind engagement; just make sure the original post is sturdy enough to support a second pass.

**Tag the project at the end of project-focused tweets — "Follow: @handle".** When a tweet is about a specific token / project (DogInMe, Toshi, Housecoin, Pengu, ElizaOS, Pythia, Turbo, etc.), append a final line:

```
Follow: @<handle>
```

This tags the project's official X account so they see the post and often retweet — meaningful additional reach for meme tokens. The handle map lives in `../persona/persona.json` → `project_handles.handles` (project name lowercased, no `$` prefix → X handle string including `@`, or `null` if unknown). When drafting:

1. Look up the project name in `project_handles.handles`.
2. If a non-null handle exists → append `\n\nFollow: @<handle>` to the tweet (account for the 280-char limit).
3. If the handle is `null` → either ask the user for it (and update the map), or omit the Follow line.
4. **Skip for Kaspa-focused tweets** — Mike is the Kaspa voice; tagging back to Kaspa adds nothing.
5. For multi-project tweets (e.g. "$PENGU vs $PEPE") use judgment: tag the one Mike is championing, or skip if the framing isn't a clear pitch for one side.

The map needs to be filled in over time — most handles are currently `null`. When drafting a tweet for a project whose handle isn't yet in the map, ask the user; if they confirm it, update the map so the next tweet about that project picks it up automatically.

### Image generation — favorites lineup & reference images

> **⛔ HARD RULE #1 — EVERY IMAGE IS UNIQUE. NEVER reuse an `image_id` or image file across two posts.**
> Not for a one-liner variant of a longer tweet, not for two posts on the same topic, not from an already-posted tweet, not "to save generation time." Each tweet / IG post / slide gets its own freshly generated UUID and its own freshly generated image. If you catch yourself about to point two entries at the same file, STOP and generate a new one. (This is the single most-repeated mistake on this account — full rule + the mandatory pre-save duplicate scan are in the "every tweet gets a unique image" section below. Read it.)

> **⛔ HARD RULE #2 — ALL IMAGE GENERATION RUNS THROUGH `gen-images.js` (pool-managed). NEVER loop `generate-image.js`.**
> Generate every batch with **`repurpose/gen-images.js`**. It consults the chat registry
> **`chatgpt-image-chats.json`** (repo root) via `repurpose/chat-pool.js`: it reuses the active ChatGPT
> chat for that `--prefix`/purpose while it's under the cap (~25 images), and **auto-rotates to a fresh
> chat when full, dead, or missing** — capturing and recording the new chat URL itself. Chats are isolated
> per purpose so styles never cross-contaminate. Just run it:
> ```
> node gen-images.js --list=<items.json> --prefix=x-tweets    # X tweets
> node gen-images.js --list=<items.json> --prefix=yt-posts     # YT carousel/posts
> node gen-images.js --list=<items.json> --prefix=ig-single    # IG 4:5 companions
> ```
> No hand-recorded chat URLs anymore — the pool manages them. `items.json` = `[{ "image_id":"<8hex>",
> "slug":"<kebab>", "prompt":"...", "ref":"<optional logo path>" }]`; skips already-existing files (resumable).
> B-roll uses the same pool (purpose `broll`) via **`generate-broll-reload.js`** — the RELIABLE capture that supersedes the flaky DOM-poll `generate-broll-wlw.js` (outputs to `video-creation/assets/`; a `..\shorts\...\render-assets\` prefix in the `file` field lands it in a clip folder). The `file` path is joined onto `video-creation/assets/`, so it must be **RELATIVE** to that dir (e.g. `../longform-edited/media/<project>/assets/img/x.png`), NEVER an absolute `C:\...` path (that produces a broken concatenated dir).
>
> **⚠️ ALWAYS state the target ASPECT RATIO / orientation in EVERY b-roll prompt — GPT-Image DEFAULTS TO PORTRAIT (1024×1536) (Mike, 2026-07-10).** Omit it and you get vertical stills that don't fit the frame. For a **16:9 track** (longform-edited / longform-presentation) START the prompt with *"Wide landscape 16:9 horizontal image."* and end with *"Horizontal landscape orientation."* (yields ~1672×941 / 1536×1024 landscape). For **9:16 shorts / vertical-ai-persona** say *"vertical 9:16 portrait."* This bit the Clarity-Act longform b-roll (portrait 1024×1536 → fixed to 1672×941 by adding the landscape instruction). Same rule as the X-image aspect note below — but the b-roll generator needs it stated too, because b-roll prompts are atmosphere descriptions that easily forget it.
>
> **⚠️ ChatGPT image generation GETS STUCK in the automated (bot-detected) browser — RELOAD the chat after ~80s to unstick it (Mike, 2026-07-09).** After a prompt is sent, the automated Chrome's live DOM often never surfaces the finished image (it just spins) even though the image IS finished server-side — you can confirm by opening the same chat in a normal/Edge browser and seeing it there. **The fix: wait up to ~80s, then RELOAD the chat room and grab the finished image from the reloaded page** (do NOT re-send the prompt — that starts a duplicate generation). `generate-broll-reload.js` does exactly this and also: keys capture on the stable estuary `file_id` (so it never grabs a wrong/pre-existing image); waits for a fresh chat's `/c/<id>` URL before reloading (else the first image of a fresh chat is lost); and dismisses the full-screen "Compare responses" A/B modal (`role=dialog`, `inset-0`) that ChatGPT sometimes overlays on the composer and hangs the next prompt. The older scripts (`gen-images.js`, `generate-broll-wlw.js`) do NOT reload and so hang / mis-capture — prefer `generate-broll-reload.js`, or port this reload-after-~80s behavior into them, for any ChatGPT image run.
> **Background (why the pool exists):** a ChatGPT chat degrades past ~25 images — it either stops rendering
> OR returns off-prompt/style-contaminated images (e.g. the b-roll chat forced icy/Bitcoin motifs onto every
> prompt, 2026-06-07). The pool caps + rotates to prevent both. Always QA a generated frame regardless.
> `gen-batch.js` / `gen-batch-freshchat.js` are SUPERSEDED (kept for reference); their hardcoded persistent
> chat URLs are overloaded/contaminated. **Do NOT loop `generate-image.js`** (a new chat per image = orphan-chat sprawl).
>
> **Every automation chat is RENAMED at birth, and that name is the deletion gate** (Mike, 2026-07-22).
> `chat-pool.js confirmAndRegister(page, purpose)` runs right after a fresh chat's first successful
> generation: it confirms the REAL conversation id via the backend API (never bare `page.url()` — its
> id silently diverged for ~2 weeks, leaving every registered pointer 404 while the real chats piled
> up unregistered in the sidebar), renames the chat to **`b-roll: <purpose>`** (any purpose containing
> `broll` — video b-roll for longform/shorts/persona) or **`social: <purpose>`** (all post-image
> purposes: x-tweets, yt-posts, ig-single, reply-images, carousels...), verifies the rename stuck, and
> registers the confirmed URL. **The ULTIMATE deletion check is the live title: `chat-delete.js`
> refuses to delete ANY chat whose title does not START with `b-roll` or `social`** — so a human's
> personal chat can never be swept even if the registry is wrong. Gate refusals land on the registry's
> `title_gate_skipped` list for Mike to handle; deletes are verified (API 404) or reported as failed.
> Reconcile tools: `list-chats-api.js` (inventory all conversations vs the registry, read-only),
> `test-chat-lifecycle.js` (end-to-end smoke test with throwaway chats).
>
> **Spent chats are DELETED, not abandoned** (Mike, 2026-07-08 — the sidebar was drowning in dead image
> chats; safe because every image downloads to the project folder at generation time). Two mechanisms,
> both automatic:
> 1. **Rotation:** a replaced/dead chat moves to the registry's `retired` list, and every gen script
>    sweeps that list at the end of its run (`chat-delete.js`, UI delete with backend-API fallback).
>    A failed delete just stays queued — never let it block a generation run.
> 2. **Batch completion:** a chat registered with a `batch` (batches.json id — pass `--chat-batch`,
>    or `--batch`, to `gen-batch-freshchat.js` for one-off project chats) is retired + deleted by
>    `repurpose/delete-chats.js` once that batch is completed/archived. Cleanup runs it automatically
>    (`cleanup/cleanup.js --target video-creation|all`); dry-run prints the plan, live run opens the
>    chatgpt-profile browser. No `batch` = evergreen purpose (rotation-only); a `batch` matching no
>    batches.json entry is kept. Manual one-off: `node repurpose/delete-chats.js --retire <purpose>`.

**Canonical coin lineup lives in `../persona/persona.json` → `stacking_lineup`.** When generating images that depict Mike's portfolio / favorites / "coins I'm stacking", use that lineup; render **$KAS as the hero** (larger / more prominent when coins share a frame). Never include $BTC, $ETH, $SOL, $BNB in a favorites image (persona covers why) — they're macro-commentary subjects, not stacking picks.

**Reference images for lesser-known coins.** The image model invents fake logos for lesser-known projects when left to its own. Before generating any image that mentions a lesser-known crypto project, scan the text for project names/tickers, then **list the live contents of the reference folder and match against THAT — never against any list written in this doc.**

```
schedule-tweets\images\reference\   ← glob / ls this folder EVERY time; it is the only source of truth
```

> Do not trust a remembered or doc-embedded set of filenames. New references get added over there continually, so a static list goes stale. (Real miss, 2026-06-03: `LAB.png` was sitting in the folder and had been used many times, but a hardcoded list here omitted it, so a draft wrongly claimed "no $LAB reference exists." Always `ls`/Glob the directory first.)

Filenames follow the project name (e.g. `LAB.png`, `toshi.png`, `DogInMe.png`, `kasy.png`). If a match exists, pass it via `--reference-image=<path>` on `generate-image.js` and refer to it in the prompt as "the logo shown in the attached reference image". Kaspa, Bittensor, and Toncoin are well-known enough to render correctly without a reference.

**Brand-safety — when a project has multiple reference variants, pick the brand-safe one for monetized YT/TikTok.** Some references have a risqué and a clean variant (e.g. ElizaOS: the orange-tee `ElizaOS-ai16z.webp` is brand-safe; `ElizaOS-ai16z-2.png` is the risqué one). Default to the clean variant for any monetized short/post.

**Multi-coin lineup constraint.** `generate-image.js` accepts only a single `--reference-image`. For a single-coin spotlight (just ElizaOS or just Linea), the reference flow works cleanly. For a multi-coin lineup needing reference logos for two or more lesser-known coins in the same frame, the script can't handle it — fall back to manual ChatGPT upload for that image, save it with the right filename in `images/x/` (tweets) or `images/yt/` (yt-posts), and update the queue entry. A typical favorites lineup with $KAS as hero needs one reference upload per lesser-known coin in the frame.

**When "favorites" / "coins I'm stacking" is mentioned but not enumerated:** ask Mike whether the current lineup still applies before generating — the list may evolve.

**X image → IG 4:5 companion.** When a new image is generated for an X tweet, also generate a **4:5** version of the same image (same prompt, subject, style — only the aspect ratio changes) for the Instagram single-image entry. Save the 4:5 version to `images/ig/` with prefix `ig-single-` and the same `image_id` (e.g. `ig-single-a3f7c2e9-...png`). The IG entry in `data/ig-single-image.json` references the 4:5 file; the tweet entry references the 1:1 file. Do this immediately after generating the X image and add both queue entries.

## Workflow

This skill helps the user turn one long piece of content (typically a livestream transcript) into multiple tweets they can actually ship. It runs in two phases: first you surface the topics worth pulling out, then — once the user picks one — you draft tweet variations for that topic.

The whole thing lives in a folder on the user's machine. The default folder is wherever this `SKILL.md` is installed; if that's not obvious, ask. Inside that folder:

- `transcripts-ad-hoc/` — manual drop folder for one-off transcripts that are NOT part of a video batch (`.txt`, `.md`, `.srt`, `.vtt`). This is the override path, not the default.
- `output/` — you write finished tweet files here

The **default** source of transcripts is the batch registry at `../batches.json` (repo root) — see Phase 1. Read the transcript directly from the filesystem. Don't ask the user to paste it into chat — that defeats the point of the folder workflow.

## Phase 1 — Find the topics

When the user invokes the skill (or just says "repurpose my latest transcript"), do this:

1. **Pick the transcript.** In priority order:
   - If the user named a specific file, use that.
   - **Default — the batch registry.** Read `../batches.json` (repo root) and find the first batch whose `pipelines.repurpose` is `"pending"`. Use its `transcript_plain` path (the exact `_plain.txt` file). When you finish generating, set that batch's `pipelines.repurpose` to `"done"` so it isn't picked again. If the user says "repurpose my latest transcript" with no file named, this is what you do.
   - **Fallback — the ad-hoc folder.** If no batch is pending (or there's no registry), look in `transcripts-ad-hoc/` and pick the most recently modified file. If there's only one, use it; if multiple and the user wasn't specific, list them with modified dates and ask which one.

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
- **Do NOT put `1/N` numbering in the tweet text.** Mike's actual threads never number the tweets; the chain reads as a natural sequence of replies. (The `### N/N` headers in the draft-markdown format below are just document labels for review; they never go into the posted tweet text.)

### CTA pattern (8th tweet)

The CTA exists to convert thread readers into followers. Keep it short, value-focused, and consistent so people who see multiple threads recognize the pattern.

**Default CTA target:** Follow me on X.

**ALWAYS write "Follow me" — NEVER spell out the @username (@mikeneder).** The reader is already on Mike's thread; "follow me" is the natural ask and reads as human. Spelling out "@mikeneder" reads like an AI-generated growth-hack template and is exactly what Mike does not want. This regressed once (drafts May 27 2026 onward reverted to "@mikeneder" because a session lost this instruction and fell back to the literal doc example) — that is why this rule is now spelled out explicitly. If you ever catch "@mikeneder" in a CTA, replace it with "me".

**Default CTA template:**

```
If [thread payoff] —

Follow me for [value prop — what they'll get from following].

[short signature line, often emoji]
```

**Example:**

```
If this reframed how you're thinking about the cycle —

Follow me for macro × crypto threads that ignore the 4-year cycle echo chamber.

🧠 + 😎
```

**CTA writing rules:**
- **"Follow me", never "@mikeneder"** (see the bolded rule above). No @username anywhere in the CTA.
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
      "text": "If this reframed how you're thinking about the cycle —\n\nFollow me for macro × crypto threads...",
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

When the user asks to draft for Instagram, port a tweet to IG, or says "make it an IG post," use this mode. This mode covers the **single-image feed post** format. Carousels have their own section below (**Instagram carousel mode**); reels will get a separate mode if the user adds it later.

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

## Instagram carousel mode

IG carousels are **repurposed from an existing YouTube community post** — not authored from scratch. Each IG carousel's `source_post` links to the YT post it came from.

1. **Reuse the YT carousel's slide images as-is — do NOT regenerate.** IG carousels post at **1:1** (the `post-ig-carousel.js` uploader clicks straight through the Crop screen and takes IG's 1:1 default; it does NOT select 4:5 — only `post-ig-single.js` selects 4:5). The YT slides are already 1:1, so the IG carousel's `slides[].image_path` point at the same `images/yt/yt-posts-*.png` files. No extra image generation, no 4:5 versions.

2. **The caption is SHORT — four sentences max.** This is the big difference from every other format. The YT post body is a long essay (up to ~2,500 chars); the IG **single-image** caption can run 1.5–3× a tweet. The IG **carousel** caption does neither — **the slides carry the content**, so the caption is just a brief hook + a line or two of setup + the engagement question. Never paste the YT essay into a carousel caption. (`ig-carousel.json` allows up to 2,200 chars, but that is a ceiling, not a target — stay around 3–4 sentences.)

3. **Hashtags:** 12–15, `caption_end` — same strategy as IG single-image.

4. **Write to `data/ig-carousel.json`** per its `$post_schema`: short `caption`, `hook`, `hashtags`, `slides[]` (2–10, reusing the YT `images/yt/...` paths, `aspect_ratio: "1:1"`), `source_post` (the YT post id), `status: "draft"`. Flip to `"pending"` only once 2–10 slides are present. Never regenerate a post that already has `slides` populated.

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

**⛔ MANDATORY — anchor EVERY slide on a reference exemplar image. This is the #1 repeated regression (Mike has flagged it many times).** A text prompt alone is NEVER acceptable for a carousel slide: generating without a reference produces minimalist, off-brand slides (floating-coin, sentence-case, no news-flash background) that do not match the account's look. For every slide — **whether generating a NEW carousel or regenerating an existing one** — you MUST:
1. **Make an independent per-post judgment and choose the best-fitting version (1, 2, or 4) for THIS post's content — there is NO default version.** Judge by tone: 1 = high-energy news-flash, 2 = analytical/editorial, 4 = hook photo + data/chart. When a run processes multiple YT posts, you make a SEPARATE version judgment for EACH post; never blanket one version across all of them. Then pull a matching exemplar from `images/reference/carousels/versionN/` (N = the version you chose), matched to the slide's ROLE: hook → `*-01-hook*`, middle beats → `*-02/03/04-*`, question → `*-05-question*`. `ls` the folder live each time.
2. Pass that exemplar via `--reference-image=` to `generate-image.js`, and in the prompt say **"match the layout, typography, color, and overall styling of the attached reference image."**
3. Keep slide text in the canonical ALL-CAPS punchy register (not sentence case).

The "When generating or regenerating carousel slides" steps in the version-selection section far below are the SAME requirement, restated — fresh generation is **not** exempt. If you ever find yourself building a carousel slide prompt with no `--reference-image`, stop: that is the bug.

**⛔ HARD RULE — no usable reference exemplar means DO NOT GENERATE.** If for any reason you cannot anchor on a Version 1/2/4 exemplar (the `images/reference/carousels/versionN/` folder is missing, no role-matching exemplar exists, the chat/tool can't attach the reference, etc.), you must **STOP and tell Mike** — do NOT fall back to a text-only prompt, an ad-hoc minimalist slide, or "best effort" carousel. A carousel generated without its version reference is worse than no carousel: producing one silently is the exact failure Mike has flagged repeatedly. Absence of a usable reference = do not generate at all; surface it to Mike and wait.

**Visual variety across the set**: vary the accent element or layout slightly from slide to slide so the carousel feels designed, not stamped. Slide 1 can have a stronger visual element (hero coin, bold graphic). Middle slides lean more text-only. Last slide (question) can echo slide 1's energy.

**Brand colors**: dark navy background, white headline text, teal or gold accent elements. Do not deviate — consistency across slides and across posts is what makes the account look intentional.

**Style reference vs logo/face reference — do not confuse the two.** The carousel STYLE exemplar from `images/reference/carousels/versionN/` is ALWAYS attached (mandatory, per the block above) — that is the one and only `--reference-image`. What this caveat restricts is slide *content*: do not try to render a specific lesser-known logo or a real face inside a slide. `generate-image.js` accepts only one `--reference-image`, and that slot belongs to the style exemplar — so for any exotic logo the generator won't recognize, use a **text label** (`"[PROJECT NAME]"` in the slide text) rather than spending the reference slot on a logo. Text + abstract visuals + the style exemplar. (Earlier wording here said "never use reference uploads for slides," which wrongly read as "skip the style exemplar" — that was the source of the off-reference regressions.)

### Version library

The versions below are platform-agnostic visual styles. They are currently wired up for YouTube community posts but will apply equally to Instagram when that pipeline is built out. When the user specifies a version, use the same prompt templates and subdir conventions regardless of platform — only the prefix, queue file, and aspect ratio will differ per platform.

**Instagram carousels are built.** Queue file: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-carousel.json`. Image prefix: `ig-carousel-` (e.g. `ig-carousel-<image_id>-<seq>-<slug>.png`), saved to `schedule-tweets/images/ig/`. Use the same YT Images ChatGPT chat (`https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa`). The version styles (1–4) apply directly — follow the same approval workflow as YT carousels (recommend version + slide plan, get approval, then generate). Aspect ratio: 1:1. **By default, IG carousels reuse the same images as the corresponding YT post** (same `image_id` and `image_path` values, pointing to the existing `yt-posts-*.png` files in `images/yt/`). Only generate separate `ig-carousel-` prefixed images when the user explicitly asks for different images for Instagram.

---

**Claude picks the version (1, 2, or 4) and generates without approval.** Choose the version that matches the post's tone — 1 = high-energy news-flash, 2 = analytical/editorial, 4 = hook + data/chart. Mike does NOT need to approve version selection or the slide plan; just pick what fits and generate. (Corrected 2026-05-24 at Mike's direction — the prior "wait for explicit approval" gate was removed; it was slowing the workflow and Mike never wanted it.)

**Slide count: use what the content needs, not a default.** The right number is 4–6 slides. Never pad to hit a target — if 4 slides covers the post cleanly, use 4. Only go to 6 if there's a genuine sixth beat worth a slide. Decide the slide plan yourself and run the script; no approval step.

**Never add slides to a post that already has an `images` array.** Check `data/yt-posts.json` (or `data/ig-carousel.json`) before generating. If the post's `images` field is already populated, skip it unless the user explicitly asks to replace or extend it.

Each version has a fixed style, subfolder, and prompt approach. Never mix versions within a single post's image set.

---

**Version 1 — News-flash** (`--subdir=version1`)

Near-black background, dramatic lighting, bold all-caps white + neon green typography, glowing crypto coin icons, chart/data panel elements. High-energy, aggressive feel. Modeled on viral crypto news graphics.

> **CAUTION (learned 2026-05-24) — image-capture bug in history-heavy chats:** The batch generators (`generate-yt-post-images-batch.js`, etc.) can save the WRONG image to a slide. In a persistent chat already full of prior generations, the response-capture sometimes grabs a *stale history image* instead of the freshly-generated one, so slides get cross-assigned (confirmed: a d3 slide's file contained an e1-e4 slide's image; an earlier d3 slide contained an old "retail flows back" graphic). **This affects all versions — it is NOT a V1-vs-V2 issue.** The single `generate-image.js` has robust baseline logic (block history during load → scroll to exhaust → 5s grace → baseline → only accept URLs ≥10s after prompt); the batch scripts used a thinner version that fails when history is large.
>
> **FIXED 2026-05-24:** all three batch scripts (`generate-yt-post-images-batch.js`, `generate-broll-batch.js`, `generate-tweet-images-batch.js`) now set `CHAT_URL = 'https://chatgpt.com/'` (a **fresh chat per run**, no history to mis-grab) plus a guard that forces a new conversation if redirected to `/c/`. Verified: re-running the YT carousels produced correctly-placed slides. **Keep batch chats fresh; still spot-check 1–2 slides per run.**
>
> **⛔ REGRESSED IN `gen-images.js` — RE-CONFIRMED 2026-07-14. The cross-assignment above is BACK, for a
> second reason, and the pool is what reinstated it.** `gen-images.js` types prompt N+1 **before image N has
> landed**, so two generations are in flight at once, finish out of order, and bind to the WRONG filenames
> (confirmed: two finished tweet images came back cleanly SWAPPED; both renders were fine, only the binding
> was wrong — the fix is to swap the files, NOT to regenerate). The 05-24 mitigation was *fresh chat per
> run*; `chat-pool.js` deliberately REUSES a chat up to ~25 images, which restores the history-heavy
> condition. Mike's old loop of the single `generate-image.js` was structurally immune (one prompt in
> flight = nothing to race).
> - **MITIGATION: run ONE ITEM PER INVOCATION** whenever binding matters (a `--reference` is attached,
>   carousels, or anything you will not eyeball). Slower, correct.
> - **VERIFY BY PIXELS, NEVER BY md5/bytes.** ChatGPT's CDN re-encodes PNGs, so a mis-captured copy of your
>   own uploaded `--reference` has a DIFFERENT md5 but IDENTICAL pixels. That false negative is exactly why
>   the 2026-07-11 session wrongly concluded "ChatGPT reproduces the carousel exemplar verbatim" and logged
>   it as an unresolved model quirk — it was this capture bug all along (see the carousel section; the
>   must-attach-version-ref rule STANDS). Test with PIL: `np.abs(a-b).max()==0` means it IS the reference.
> - **Two guards now in `gen-images.js` (2026-07-14):** the ref is uploaded BEFORE the baseline snapshot,
>   and a **post-send re-baseline** folds everything on the page 3s after Enter into `before` (a generation
>   never completes in 3s, so anything present is by definition not the result).
> - This defect is INVISIBLE to anyone who does not open the file and compare it to the intended subject.
>   Always run the visual-QA gate over a generated batch.

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

**Intent (read this first):** Slide 1 is a **topic-relevant PHOTO** that acts as the visual hook; slides 2–N are data-formatted "financial report" slides. The photo is chosen to fit the post's subject and is **NOT assumed to be Mike** — the canonical reference (`images/reference/carousels/version4/hook.png`) uses a **Trump photo on a stock-market post**. Use whatever image best illustrates the hook (public figure, news image, scene).

Two structurally different slide types within the same set:

*Slide 1 (hook):* Full-bleed **topic-relevant photo** as the background — whatever image best illustrates the post's subject (public figure, news image, or scene). **This is NOT Mike's photo** (common past misread); it's the topical photo for the hook. Small chart or data visualization bubble overlaid in one corner (e.g. a candlestick chart, supply curve, or stat callout in a circle). Bold all-caps text at the bottom in white + accent color (green or teal). "SWIPE FOR MORE" CTA at the very bottom. Requires that topic-relevant photo passed via `--reference-image`.

*Slides 2–N (data):* Light/white or near-white background — completely different from the hook. Structure: title at top, three stat boxes below it (current value / historical average / comparison point), a chart filling the center (line chart, candlestick, or bar chart with labeled axes), and a warning/insight box at the bottom with 2–3 bullet points. Small page-number indicator top-right. Dense, analytical, professional financial look.

**Important limitation:** ChatGPT generates charts as illustrations, not from real data. The visual layout will match but the numbers and lines on the chart will be approximated/invented. If you need exact data (specific KAS supply curve values, precise dates, real CAPE ratios), this style requires a code-generated chart approach rather than ChatGPT image generation — flag this to the user before running.

Hook prompt template:
```
Single editorial hook image, 1:1 square. Full-bleed photo from the reference image (the topic-relevant subject) as the background. In one corner, a small circular bubble overlay containing a [chart type] chart in [color]. Bold all-caps text at the bottom: white for '[HOOK LINE]', accent green for '[EMPHASIS WORD/PHRASE]'. 'SWIPE FOR MORE' in small white text at the very bottom. No other text.
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

### Batch generation (multiple images, one Chrome session)

For carousel regens, bulk post images, or any run of 3+ images: use `generate-image-batch.js` instead of calling `generate-image.js` in a loop. The batch script launches Chrome **once**, processes all jobs sequentially inside the single session, then closes Chrome. This eliminates the open/close cycle between images.

```
C:\Users\mnede\Documents\Claude\social-media\repurpose\generate-image-batch.js
```

**Usage:**
```powershell
cd C:\Users\mnede\Documents\Claude\social-media\repurpose
node generate-image-batch.js --jobs-file=<path-to-jobs.json>
```

**Jobs file format:** a JSON array where each object matches the `generate-image.js` CLI flags:

```json
[
  {
    "imageId": "2e48acb6",
    "slug": "03-priced-in-everyone-knows",
    "prefix": "yt-posts",
    "chatUrl": "https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa",
    "referenceImage": "C:\\path\\to\\ref.png",
    "prompt": "Bold crypto news graphic..."
  }
]
```

All fields match the `generate-image.js` flags: `imageId`, `slug`, `prefix` (default `x-tweets`), `chatUrl` (default fresh chat), `referenceImage` (optional), `prompt` or `promptFile`. The 15–45s rate-limit delay is applied **between** jobs (skipped before the first), so total time is roughly the same as the loop approach but with far less Chrome startup overhead.

**When to use which:**
- Single image or one-off regeneration → `generate-image.js`
- 3+ images in one batch (carousel regen, bulk tweet images) → `generate-image-batch.js` with a jobs JSON file

**Existing batch regen job files:**
- `repurpose/regen-remaining-carousels.json` — the 13 carousel slides from the 2026-05-22 session (hard-fork-23-days, institutions-infrastructure, ai-tug-of-war)

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

- **An OVERLOADED persistent chat stops rendering images entirely — symptom is a wall of `FAIL (timeout)`; this is the #1 cause and it WILL recur (observed 2026-06-05).** The persistent chats are long-lived conversations that accumulate every image ever generated in them. Once a chat holds enough images, it can stop producing new ones: mid-run, the YT Images chat (`.../69ffc14c...`) suddenly timed out on every remaining `gen-batch.js` slide (no image element ever appeared in the DOM), on both the first attempt and the retry, for 15+ min. **It is NOT a rate cap** (a real ChatGPT cap takes hundreds of gens) and **NOT prompt-specific** — the whole conversation is overloaded. Re-running the same 5 prompts in a **fresh chat** generated all 5 in ~5 min, first try.

  **Immediate fix (one run):** regenerate in a fresh `chatgpt.com/` chat. `gen-batch.js` refuses fresh chats by design; use `_gen-353x-redo.js` (fresh-chat pattern) or its carousel-output copy `_gen-neutral-freshchat.js` (writes `yt-posts-<id>-<slug>.png` into `images/yt/`). Succeeded files from the bad run are real (md5-unique, on disk); the fresh-chat regen skips them via its exists-check and fills only the missing ones.

  **⚠ STANDING INSTRUCTION — the recorded YT Images chat (`.../69ffc14c...`) is RETIRED as of 2026-06-05 (overloaded).** Do not expect it to work. **On the NEXT YT image generation, launch a brand-new chat, then record that new chat's URL as the persistent YT Images chat in all the places below, and reuse THAT one every time afterwards** (until it too overloads, then repeat). Until it has been re-recorded, generate YT carousels via the fresh-chat tool above.

  **Durable fix (when a persistent chat overloads, RETIRE it and register a NEW one):** start a brand-new ChatGPT conversation, do one generation in it, copy its `https://chatgpt.com/c/<new-id>` URL, then replace the old URL **everywhere it is recorded** so future `gen-batch.js`/`generate-image.js` runs use the healthy chat:
  - `repurpose/gen-batch.js` → `PERSISTENT_CHATS` (`yt-posts` **and** `ig-carousel` share the YT chat; `x-tweets` is separate).
  - `repurpose/generate-image.js` → `PERSISTENT_CHATS` (same keys; note `ig-single` shares the X-tweets chat).
  - This doc's inline URLs (search `69ffc14c` for the YT chat, `69fe9134` for the X-tweets chat).
  The X-tweets/IG-single chat (`.../69fe9134...`) will eventually overload the same way — same procedure applies to it.

### Image dimensions

Current ChatGPT output is **1254×1254** for 1:1 prompts. The platform-standard for X/IG/YT images is **1080×1080**. The current pipeline does not downscale; flag this if/when a downscale step gets added. The 1254×1254 still uploads cleanly to all platforms (X compresses; IG and YT accept it), so the impact is purely bandwidth/storage, not visual.

### YT/IG carousel image generation — version selection

When **generating OR regenerating** carousel slides (fresh generation is NOT exempt — same rule), **always use Version 1, 2, or 4** (Version 3 is retired — see earlier section). For each pass:
1. **Choose the best-fitting version (1, 2, or 4) for THIS post based on its content/tone — there is NO default.** 1 = high-energy news-flash, 2 = analytical/editorial, 4 = hook photo + data/chart. Make the judgment independently for every post: if a run has three YT posts with three carousels, that is three separate version judgments, one per post. Do NOT pick a single version and apply it across multiple posts for "consistency" — the right version is whatever each post's content calls for.
2. Pick a reference image from `images/reference/carousels/versionN/` that matches the slide's role (hook → 01-hook reference, mid-slide → 02/03/04 reference, question → 05-question reference). **This is mandatory, not optional — a carousel slide generated without a versionN reference exemplar is the regression Mike repeatedly catches.**
3. Pass it via `--reference-image=` to `generate-image.js`.
4. Use the version's prompt template, substituting in slide-text derived from the YT post body (the `images[]` entries often have null `slide_text`, so it must be inferred from the body and the slide slug).

### Profile conflicts that matter when posting in parallel

Each posting script uses a dedicated Chrome profile, but a few collisions exist:

- **X tweets / X polls / X threads / X shorts / reply-guy** all use `xbot-profile`.
- **ChatGPT (for image generation in `generate-image.js`)** uses `chatgpt-profile` — a dedicated profile created 2026-05-22 so image gen can run in parallel with X posting. Previously was `xbot-profile`.
- **TikTok (`post-tiktok-short.js`) uses the MAIN Chrome User Data profile + CDP port 9224.** Known issue: `node scripts/post-tiktok-short.js` sometimes fails with "Chrome did not open CDP 9224 within 15s" even when no Chrome processes exist (verified via PowerShell `Get-Process chrome` and `netstat`). Chrome appears to launch (a window briefly opens) but the CDP port never binds — likely because Chrome's launcher stub intercepts the spawn from Node's `child_process` and doesn't propagate `--remote-debugging-port` correctly.

  **Workaround that works reliably:** launch Chrome manually from PowerShell FIRST, then run the Node script — the script's `isCDPReady()` check will detect the live Chrome and reuse it. Manual launch:
  ```powershell
  Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList @(
    '--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\User Data',
    '--profile-directory=Default',
    '--remote-debugging-port=9224',
    '--no-first-run',
    'about:blank'
  )
  ```
  Wait 2–3 seconds (port 9224 binds almost instantly when launched this way), then `cd schedule-tweets; node scripts/post-tiktok-short.js`. The script will print "Chrome already on CDP 9224 ✓" and proceed.

Implication: with the dedicated `chatgpt-profile` (2026-05-22), image generation never collides with posting on the **Chrome** side. The only Chrome conflict left is two posting scripts sharing a profile (e.g. two X scripts), handled by the sequential posting list.

**BUT profile isolation does NOT solve a second conflict: shared JSON files (corrected 2026-05-24).** The image batches do per-item read-modify-write on `data/x-tweets.json` (tweet images), `data/ig-single-image.json` (IG companions), and `data/yt-posts.json` (carousel slides). The posting scripts write those SAME files. Running an image batch at the same time as a posting script that touches the same file is a write race: the posting script saves its stale in-memory copy and silently wipes the image links the batch just wrote. (Confirmed 2026-05-24: two tweet image links were clobbered exactly this way; had to re-link them.)

**Lane priority rule: posting (Lane B) ALWAYS beats image generation (Lane A). Never delay a post for image-gen.** When a Lane B step is about to write a JSON file that a running image batch also writes (tweet step vs the tweet-image batch; yt-post step vs the carousel batch; IG-single step vs the IG-companion batch), PAUSE the image batch first, run the post, then re-launch the batch. The batches are resumable (they skip already-generated files via `fs.existsSync`), so pausing wastes nothing. Steps that do NOT share a file with the running batch (X poll, reply-guy, shorts, IG Reel while the tweet-image batch runs) proceed in parallel as normal.

To pause the image batch without touching the posting profiles, kill ONLY its node process and its `chatgpt-profile` Chrome:
```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'"   | Where-Object { $_.CommandLine -like '*generate-*-images-batch*' -or $_.CommandLine -like '*generate-tweet-images-batch*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*chatgpt-profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

### Reply-guy `--limit` is not honored

`post_replies.py --limit 5` posted 7 replies in observed testing. The script appears to drain whatever is in the queue at run time, regardless of the `--limit` flag. Treat the limit flag as advisory; the queue empties to whatever is staged. If precise batch sizing matters, pre-trim the queue file before running.

### Status updates during long-running tasks

When running a long sequential posting list, emit a short status line per task in this shape: `[HH:MM:SS] Task N/M start: <script>` and `[HH:MM:SS] Task N/M done in <s>s` plus the live post URL. That gives the user enough info to know progress without a verbose stream.
