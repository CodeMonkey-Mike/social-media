# coin-research: the one standard for researching a coin

_Canonical, track-agnostic. Every time a video, session or post needs facts about a COIN or TOKEN, the research
follows this file, whichever track it is for. Created 2026-11-11 after the JCT video (longform-presentation,
standard format) went out saying the project publishes "no GPU count, node count, revenue or user numbers,
anywhere" while the project's own product page showed live usage on its home page. another creator built a whole
video on that number. RESEARCH.md had it as "NOT FOUND" because we read the product's `/facts` page and never its
home page._

_Extended 2026-11-12 after the first live run (Pieverse, longform-edited). The same creator published a Pieverse video
two days before ours, and comparing the two showed three more misses: we had ONE market snapshot taken a day after the
all-time high (no flows around the event), we never read what holding the token earns (the staking terms and the
governance votes were on a Notion guide and a Snapshot space, not on the project's site), and we could not open the
project's own recent posts (X) and said nothing about it. Rows 13 and 14 and "The event window rule" below close those._

This file is coin-specific depth. The GENERIC sourcing rules (open what you cite, date everything, primary sources
first, never invent, conditional language for anything unresolved, no em dashes) stay canonical in
`.claude/agents/longform-edited/data-researcher.md` and `persona/persona.json` (`verified_claims_only`). Do not
copy them here; do not skip them.

## Who calls it, and what each writes

| Track | Research step | Output | Pointer lives in |
|---|---|---|---|
| longform-edited | `research` node, `data-researcher` agent | `media/<project>/DATA.md` | `data-researcher.md` |
| longform-presentation | pre-production, main loop | `media/<format>/<project>/RESEARCH.md` | `longform-presentation.md` |
| longform-discussion | Flow B step 3, coin topics | `media/<session>/TOPICS.json` facts | `longform-discussion.md` |
| livestream Lane 3 | fact-check of the coins the stream discussed | the plan's fact-check ledger | `lane3-drafter.md` |

The output SHAPE stays the track's own (DATA.md skeleton, RESEARCH.md, TOPICS.json). This file decides what the
research must COVER and how deep it must go, not where it is written. Working files (probe dumps, saved JSON,
screenshots) go in the video's project folder, never the repo root, never a `skills/` folder, never D:
(root `CLAUDE.md` "Where files go").

## A coin dossier covers all of these

Skip a row only by writing why. "Source" names where the number comes from; prefer the first one listed.

| # | Cover | Source |
|---|---|---|
| 1 | **Market snapshot**, timestamped to the minute: price, 24h/7d/30d change, market cap, FDV, rank, volume, ATH/ATL and dates | CoinGecko API (`/coins/<id>`, `/coins/markets`), CoinMarketCap page. Two sites disagree on circulating supply: say which one the video uses and why they differ |
| 2 | **What it is**, in the project's own words, and where the project's descriptions contradict each other | Project docs, whitepaper, X bio. List the contradictions, never pick one silently |
| 3 | **Tokenomics + unlock schedule**: allocation table, TGE %, cliffs, vesting, the next unlock date and size, in tokens AND dollars at today's price | Project docs first; on-chain to verify |
| 4 | **On-chain facts**: contract addresses per chain, supply per chain, holder count, top-holder concentration, who owns/controls the vesting wallets (multisig threshold? a vesting contract or a promise?) | Etherscan/BscScan APIs or Ethplorer/Binplorer, public RPC `eth_call`. Read it yourself; do not quote an article about it |
| 5 | **Derivatives + liquidity**: perp volume vs spot, open interest per venue, funding, DEX liquidity. Flag venues whose numbers are not credible. A snapshot is not enough when the coin just moved: see "The event window rule" | CoinGecko derivatives feed, exchange pages, the exchanges' own public APIs (history) |
| 6 | **Listings history**: exchange, date, time, product (spot / perp / Alpha), delistings | Exchange announcements; search snippets only as a lead |
| 7 | **Team, operator, backers, funding**: legal entity, people, rounds, amounts or "not disclosed" | Registry/press release first, coverage second |
| 8 | **Product + traction, from the PRODUCT'S OWN telemetry** (the sweep below). This is the row that was missed | The product's live pages and `/v1/*` endpoints |
| 9 | **News + catalysts** for the last ~6 months, as dated rows, and whether any move had a stated cause | Dated coverage |
| 10 | **Peers**: the same snapshot columns for comparables, plus FDV ratios and combined-volume ratios (show the arithmetic as "my calc") | CoinGecko `/coins/markets` with the peer ids, one call |
| 11 | **Risks / red flags** and the **do-not-air list** (popular but wrong, unverifiable, superseded), each with WHY | Your own findings |
| 12 | **Conflicts list**: every figure two sources disagree on, both values + sources | Your own findings |
| 13 | **What holding the token earns** (added 2026-11-12): staking terms (lock lengths, early withdrawal, what is paid: tokens, points, product access), revenue share or buybacks, fee discounts, and every governance proposal and vote (title, dates, options, scores, voter count, total voting weight as a share of supply). Say who authored the proposals. A vote result is a fact; what the team did with it is its own row | The project's staking guide (often a Notion page), its Snapshot space (`hub.snapshot.org/graphql`), the tokenomics doc, the contract |
| 14 | **The project's own recent posts** (added 2026-11-12): the last 30 days from its X account, blog and Discord/Telegram announcements, with dates: what it announced, what it promised without a date, and how long it was silent before and after any big move | X (read through the logged-in Chrome extension when a plain fetch hits the login wall), blog, announcement channels |

Tag every figure `(source, read YYYY-MM-DD HH:MM UTC)`; live-drift figures get `[VERIFY]` and a row in the snapshot.
Label arithmetic "my calc" with the method, on-chain reads "on-chain (verified)", and project-only statements
"project claim".

## The product telemetry sweep (row 8, required for any coin whose project runs a live product)

Rule of thumb: **if the project sells something, it counts it, and the count is usually on a page we can open.**
Docs and fact sheets describe the product; the HOME PAGE and the status endpoints often SHOW it working.

Run this in order and keep the result of every step (the saved page or JSON in the project folder):

1. **Open the product's HOME page**, not only its docs, `/facts`, blog or GitHub. Read the whole rendered text.
   Look for a section with live numbers ("On the wire", "Live usage", "Track record", "Network stats", a counter).
2. **Probe the standard paths** on the product's own domain (and its docs/app subdomains), and record the HTTP
   status of each, hits and 404s both:
   `/stats` `/v1/stats` `/api/stats` `/metrics` `/status` `/status.json` `/health` `/v1/health` `/facts` `/facts.json`
   `/.well-known/` (and any `*.json` it lists) `/version.json` `/changelog` `/changelog.json` `/llms.txt`
   `/llms-full.txt` `/openapi.json` `/sitemap.xml` `/robots.txt`.
3. **Mine the page you found the numbers on**: grep its HTML and scripts for `/v1/`, `/api/`, `fetch(`, `.json` to
   find the endpoint behind a counter; call it and save the raw JSON. The JSON beats the screenshot (exact counts,
   windows, breakdowns, an `updated_at`).
4. **Look for explorers/dashboards** when the product is a network: node/validator/GPU counts, staking totals, TVL
   (DefiLlama), fees/revenue (Token Terminal, DefiLlama fees), app-store or package downloads (PyPI/npm),
   GitHub activity (commits, last push, stars, releases), MCP/registry listings, the project's status page.
5. **Read the product's own disambiguation notes** ("X is not Y", "not affiliated with", "in development"). They
   settle which numbers and partners belong to which product. JANCTION's fact sheet states that Smart Render
   (the Panasonic announcement) is a different, in-development service from the live Render product; one outlet
   merged them.
6. **Turn usage into money and put it beside the token.** Revenue estimate = units sold x list price (state it is
   an upper bound if free credits or the operator's own use are mixed in). Then the one-number gap:
   `product sales so far` vs `new tokens reaching the market per month, in dollars`. Which currency the product bills
   in, and whether the token is part of any payment, is its own fact (row 8 must say it).
7. **Write down the windows and exclusions** the page states (24h/7d/30d, "external use only", "operator tests
   excluded"). A breakdown by client/app shifts between snapshots; quote a number with its read time, never as a
   standing fact. A big "API" or "other" bucket next to a small named-apps bucket is a finding, not a rounding error.
8. **Name a trigger to watch.** A number whose next value would change the story (daily renders, next unlock date)
   is the spine of a good video; note it.

### The "NOT FOUND" rule

A metric may be written "NOT FOUND" only with a **checked-list** beside it: each URL/endpoint tried and its result,
and what was searched. Format:

`NOT FOUND (checked: <home page> no counter; /stats 404; /v1/stats 200 but no GPU count; GitHub no dashboard; DefiLlama no entry; web search "<coin> GPU count" nothing primary)`

If the project plausibly publishes the metric (anything it sells, runs or staffs), a "NOT FOUND" with no checked-list
is unfinished research, and the sweep above is what finishes it.

### Absence claims need the same proof

A slide, line or note that says a thing "is not public", "does not exist" or "has no X anywhere" is a claim like any
other. It airs only if the checked-list that backs it is in the research file. When the sweep turns up the number,
the claim comes out. Prefer the true narrow form ("no GPU or node count published; usage counts are") over "anywhere".

## The event window rule (added 2026-11-12)

**Trigger:** the coin printed an all-time high, or moved more than 30% in 24 hours, or is within 7 days of a large unlock,
in the last 7 days. A market snapshot taken after the event cannot show it; a time series can.

Pull the window (from 3 days before the move to now) and save the raw JSON in the project's `research/` folder:

1. **Spot flow by venue and day**: exchange daily candles (Upbit, Bithumb, Coinbase, Kraken, the DEX pool) with the
   volume in the venue's own currency. Quote the day-over-day multiple as "my calc" with both numbers.
2. **Perp history**: daily volume, open interest and the funding rate for each reachable venue, plus the hourly candles
   around the high (the size of the drop in the 2 hours after it). Sum the funding per day before comparing it with a
   figure quoted as "per day".
3. **Do not trust one venue.** Funding and open interest are venue-specific; say which venue each number is from, and
   write the venues that could not be read ("Binance futures: HTTP 451 from this location") in the checked-list.
4. **Another creator's number is a lead, not a source.** If a competitor video quotes a flow figure you can reproduce,
   say so with your own read; if you cannot reproduce it on the venues you can reach, say that too. Both outcomes go in
   DATA.md.
5. **A stated cause needs a dated source.** Flows show WHO traded, never WHY. Keep "no clear cause found" unless a dated
   primary source names one.

**Reachable from Mike's machine (tested 2026-11-12):** OKX (`/api/v5/public/funding-rate-history`,
`/api/v5/market/history-candles`, `/api/v5/rubik/stat/contracts/open-interest-volume`; daily bars start 16:00 UTC),
Gate futures (`/api/v4/futures/usdt/funding_rate`), Upbit (`/v1/candles/days?market=KRW-<TICKER>`), CoinGecko,
Snapshot GraphQL. **Not reachable:** Binance futures (HTTP 451, restricted location), Bybit (CloudFront 403),
X without a login (rate-limited syndication endpoint), the Chrome extension when it is not connected. When a venue is
blocked, use the others and write the block in the checked-list; never silently skip.

**A Notion-hosted guide** (many projects keep their staking and FAQ pages there) renders blank to a plain fetch. Read it
through the public page API: POST `https://<workspace>.notion.site/api/v3/loadCachedPageChunkV2` for the page id, then the
same call for each child block id the first response lists but does not include (toggles and callouts hold the rules and
the FAQ). Save the text to `research/page-<name>.txt` and record the page's `last_edited_time`.

## Before it airs

- Re-pull every `[VERIFY]` figure and the telemetry JSON right before recording or render; a counter moves daily.
- A video that went out before this rule existed gets re-checked against the sweep when someone touches it again.
- Anything the sweep contradicts in an already-written deck/script goes to Mike as a list (line, old claim, what the
  source says), never silently rewritten.

## Worked example: JCT (read 2026-11-11, `render.janction.jp`)

- Home page "On the wire" section, source `/v1/stats`, refreshed every 5 minutes, external use only.
- Since launch (2026-09-30): 2,090 renders, 192,258 GPU-seconds. At 0.1 JPY per GPU-second that is about 19,200 JPY,
  roughly $120 at list price (an upper bound: 100 JPY welcome credits are free). Billed in yen by card; JCT is not
  part of the payment.
- Last 30 days: 1,713 renders, 98.5% success, median round trip 7 s. By client: API 1,207, Cursor 102, Claude 100,
  "MCP (other apps)" 95, CLI 57, Codex 39, ChatGPT 38, Sesame 17, Notion 14, DeepSeek Harness 13.
- `/status.json` (found by the standard-path probe, not linked from the home page) publishes `gpus: 3`,
  `workers_online: 5` and the queue. PyPI downloads (pypistats) were 2,473 in a month; the GitHub repo has 3 stars.
  So the deck's "no GPU count, node count, revenue or user numbers, anywhere" was wrong on three of four items.
- Against it: about 1.2B JCT a month starting 10 Nov 2026 (about $13M a month at about $0.011).
  Gap = about $120 of product sales vs about $13M of new tokens a month.
- Trigger to watch: renders per day (59 in the last 24 h) and the next unlock date.
- Saved evidence and the checked-list: `longform-presentation/media/standard/JCT/telemetry/` and the "UPDATE: PRODUCT
  TELEMETRY" section of that project's `RESEARCH.md`.

## Worked example 2: Pieverse (read 2026-11-11 to 2026-11-12, longform-edited `pieverse`)

- Row 13: the staking guide (Notion, last edited 2026-08-27) pays daily XP (points) plus a one-time Agent benefit
  (under 50 tokens = a Starter agent, 50 or more = a Basic agent, for the length of the lock), locks 90, 180 or 365
  days with no early withdrawal, and says XP's future use "will be announced". The Snapshot space `pieverse-snapshot.eth`
  holds 6 proposals; PIP-5 (staking reward model) closed 2026-10-08 with 1,130 votes and around 170 thousand tokens of
  voting weight (under 0.02% of supply), "Token Rewards" first. A video that only read the docs would say the token does
  nothing; the true narrow form is "the token is not in the product's payment path, and staking pays points".
- Event window: Upbit won volume on 9 Nov 2026 was 17.8x the day before (3.03B to 53.82B KRW, my calc); OKX hourly
  candles show a 14.6% fall in the 2 hours after the 2.2501 high (my calc); OKX and Gate funding stayed at their
  baseline (0.03% a day) through the move, so a competitor's "0.6% a day" funding figure was NOT reproducible on the
  venues that could be read (Binance returned HTTP 451).
- Saved evidence: `longform-edited/media/pieverse/research/` (`page-staking-guide.txt`, `snapshot-pieverse.json`,
  `event-window-derivs.json`) and DATA.md "Pillar 8".
