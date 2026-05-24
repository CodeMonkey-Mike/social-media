# Auto-Reply (x-reply-auto) — Design Notes (parked for later)

Status: **BUILT 2026-05-23.** Skill `x-reply-auto.md` + `auto_reply_scan.py` + `auto_reply_post.py` are in `x-reply-guy/`. All four open decisions resolved as the recommended defaults (source: both feeds freshest-wins; volume: one per invocation; all four guardrails on; ≤2min = discovery filter). Not yet live-tested end-to-end (no auto-reply has been fired). This doc is kept as the rationale record.

**Chosen skill name: `x-reply-auto`.** Named for the user-facing behavior — replies fire automatically, without Mike reviewing or authorizing. Pairs against `x-reply-curated` (the existing review-first flow). The `x-reply-*` prefix keeps it in the reply family. (The Claude-in-loop drafting is an internal detail; from Mike's seat it's automatic.)

## Concept

A new capability separate from the existing curated reply-guy flow. It captures a fresh tweet from Mike's Following feed and/or the Reply Guy list and **replies to it immediately, in Mike's voice, with no review step** — no "reply opportunity" presented, no pending authorization, no staging. Fire on the fly.

Meant to be invoked as **a task within a task-list orchestration** (like the multi-platform posting run), not as a standalone always-on service.

## Hard criteria

- Scan the last **~1 hour** (`MAX_AGE_SECONDS = 3600`) of the Following feed + Reply Guy list and **pick the BEST reply-worthy tweet** (Claude's judgment), not strictly the freshest. Evolved 2026-05-23: window went 2 min → 10 min → 30 min → 1 hour after observing the feeds are often quiet (freshest tweet was ~19 min old at test time). The window is a sanity bound, not a deadline; tune for busier/quieter hours.
- **Favor high-visibility targets.** Big crypto/news accounts (Cointelegraph, Watcher.Guru, alert bots, large creators) are *preferred*, not skipped — a reply there gets seen by their audience and retweeted. That's the point of reply-guy. (Mike's correction 2026-05-23: an earlier plan to skip bot/news accounts was wrong.)
- **No allow-list, no skip-list.** An allow-list is moot — anyone worth replying to is already in the Following feed or Reply Guy list. Only genuine spam/scam is filtered (blocklist), and partisan flamebait is a judgment skip.
- **Following tab stays on Popular sort (decided 2026-05-23).** Mike's UI showed the Following tab sorted by Popular; he chose to leave it there rather than toggle to Recent. Rationale: Popular surfaces high-engagement tweets, so the most recent of *those* is both fresh-ish and high-visibility. The scanner is **sort-agnostic** — it reads the top tweets, uses their real timestamps, and picks the freshest within the window — so no sort-toggling is needed or wanted (the two reply skills share `xbot-profile` and would fight over it).
- If nothing in the last-hour pool is worth a reply, **it does not execute** (clean no-op, no error).

## Decision made

**Option A — Claude-in-the-loop.** A fast-scrape helper dumps the freshest candidates; Claude reads them + `../persona/persona.json`, drafts the reply in voice, then a thin post step fires it. Chosen over a fully-scripted Anthropic-API version because:
- It matches how Mike wants to invoke it (a command/task in a list).
- Reuses everything already built.
- Highest voice fidelity (full persona context, not a crammed prompt).

Trade-off accepted: it only runs when Claude is driving a session (not cron-able). That's fine for the intended use.

## Structure (separate skill, reuses mechanical pieces)

It will be its **own skill** (own orchestration), but reuse:
- `post_reply(page, tweet_url, reply_text, author)` from `post_replies.py` — navigates, opens composer, types with human delays, JS-clicks Post, verifies. Directly reusable for a single ad-hoc reply.
- `../persona/persona.json` — Mike's voice/style/terminology rules (project-wide single source of truth).
- The timestamp / `minutes_ago` logic from `scrape_feed.py`.

New code needed:
- **A fast-scrape helper** (or `scrape_feed.py --fast --max-age=120`): grab only the **top of feed** for Following + Reply Guy list, **no scrolling** (top is freshest), compute age in **seconds** (minute-granularity is too coarse), write only candidates ≤120s old to a small JSON. Prints "no fresh tweets" and exits if none.
- **A new skill file** (e.g. `x-onthefly-reply.md`): run helper → if empty, no-op → else Claude drafts in-voice → fire via single-reply post step → archive to `posted_replies.json`. **Does NOT touch `reply_opportunities.json` or `replies_to_post.json`.**

## Open decisions (resolve before building)

1. **Source:** Following feed only / Reply Guy list only / both (freshest wins). Leaning: both, freshest wins, but Reply Guy list is the safer/more on-topic default.
2. **Volume per invocation:** one best tweet (recommended — controlled; repeat the task for more) vs. all qualifying ≤2 min.
3. **Guardrails — what to auto-skip** (no human catch, so this matters):
   - Tweets that are themselves replies (not top-level).
   - Scam/ragebait keyword blocklist (airdrop, giveaway, send eth, …) — Claude to propose the list.
   - Reply-restricted tweets ("Only some accounts can reply") — always fail anyway.
   - Tweets Mike already replied to (check `posted_replies.json` + live page).
4. **Freshness semantics:** confirmed assumption — "≤2 min" is a **discovery filter** (reply early to fresh tweets), NOT a post deadline. Reply realistically *lands* at ~2–3 min because of Chrome-launch + scrape + draft + post latency (~30–90s cold).

## Risks to keep in mind

- **No review = bad replies go out unseen** (ragebait, scams, sensitive news). Guardrails above are the mitigation.
- **Latency vs. the 2-min window** — see freshness semantics above. Cold Chrome each run is the dominant cost; a warm/persistent session would tighten it.
- **HARD RULE still applies, and matters more here:** never auto-retry a "failed" reply. X's verify step false-negatives under throttle — a "failed" reply has very often already posted, and retrying duplicates it. With no human watching, this rule is critical. See `x-reply-guy/CLAUDE.md`.
- **Reply throttle:** X throttles after ~24–30 replies / ~4-hour window. Auto-fire counts against the same budget.
