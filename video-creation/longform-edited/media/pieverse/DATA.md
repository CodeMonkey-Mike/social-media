# pieverse: DATA (research dump; every number carries a source)
**CARD NUMBERS: use section 5a (record-day read 2026-11-14) where a figure exists there; section 5 and the pillars are the 2026-11-11 read.**
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled 2026-11-11 for the LOCKED brief "What Is Pieverse?" (runtime open, default around 5 minutes; no receipts, no clips, no music, no captions; 2 animated charts + 1 system-design chart + deck cards). Spelling per persona. No em dashes._

_Every row: statement, source URL (opened, not just found), read date, confidence. Nothing here is invented; not found = Open questions. Labels used: "project claim" (only the project says it), "on-chain (verified)" (read from the contract through a public RPC or explorer API by the researcher), "my calc" (arithmetic, method shown), "secondary" (coverage, not the primary document)._

_Coin-research standard (`video-creation/skills/coin-research/coin-research.md`) followed in full: the 12-row dossier is mapped at the end of section 2, and the PRODUCT TELEMETRY SWEEP is under Pillar 3 with its checked-lists. Raw probe output (pages, JSON, script chunks) is saved in `media/pieverse/research/` (129 files)._

**Source access notes (read before citing):**
- **IDENTITY CHECK (the brief asked for it): CoinMarketCap and CoinGecko describe the SAME token.** Both list Pieverse, ticker PIEVERSE, contract `0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9`, 1B max supply (https://coinmarketcap.com/currencies/pieverse/ and https://api.coingecko.com/api/v3/coins/pieverse, both read 2026-11-11). The same address is the token on BNB Chain AND on Ethereum (on-chain verified, Pillar 4). They DISAGREE on circulating supply, market cap, rank and volume (section 5 and the conflicts list).
- **The project describes itself three different ways** depending on which of its own pages you open (litepaper, whitepaper, current home page). All three were opened and are quoted in Pillar 1. The CoinMarketCap "About" text and the CoinGecko "TimeFi" category both describe an OLDER version of the project than the current home page.
- **pieverse.io app pages are client-rendered** (`/skill-store`, `/agent-registry`, `/a2a-marketplace`, `/purrfect-claw`, `/purrfect-claw/plans`, `/invoice`, `/wallet-policies` return "Loading wallet services" to a plain fetch). Their data was reached by reading the site's script chunks and calling the API behind them (`https://purr.pieverse.io/api/app/...`), saved as `research/telemetry-*.json`.
- **Forbes article: HTTP 403** (https://www.forbes.com/sites/digital-assets/2026/03/29/missing-layer-in-agentic-commerce-trust-settlement-interoperability/). Not opened. The only source for "Forbes mentioned Pieverse" is Pieverse's own press page. Do-not-air as an endorsement (section 4).
- **CryptoTimes Upbit article: HTTP 403; MEXC-hosted Bithumb article: HTTP 410.** The Upbit date was confirmed on a second outlet that opened (bitcoinsistemi); the Bithumb date is search-result level only and tagged [VERIFY].
- **X (x.com) posts were not opened** (the project's and BNB Chain's posts sit behind X's login wall for a plain fetch). Anything whose only primary source is an X post is tagged [VERIFY].
- **Press releases are PAID releases.** The CoinDesk page for Purr-Fect Claw states: "This paid press release is provided by Pieverse and was not written by CoinDesk." The funding story on Decrypt and The Block is a Chainwire release. Treat every quote in them as a project claim.
- **Official vesting document: NOT FOUND.** The allocation percentages are primary (whitepaper and litepaper). The cliff and vesting LENGTHS come from a third-party tracker and a secondary news flash, and two trackers disagree on the size of the 14 Nov 2026 unlock. See Pillar 4 and Open question 1.
- Primary documents opened and read in full: https://www.pieverse.io/ (home), `/whitepaper` (v1.0, 2025-11-10), `/litepaper`, `/about`, `/press`, `/llms.txt`, `/index.md`, `/pricing.md`, `/sandbox.md`, `/developers.md`, `/openapi.json`, `/api/agent-discovery/status`, https://docs.pieverse.io/llms-full.txt (the whole docs site as text), the Binance pre-TGE announcement, the Decrypt and CoinDesk copies of the two press releases.

---

## 1. The thesis, sourced

The brief is an explainer, so the "thesis" is the set of plain statements the video stands on. Each row: statement, source URL, read date, confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | Pieverse TODAY presents itself as a Web3 AI agent platform. Home page title: "Web3 AI Agent for Line & Kakao". Its own summary: "Pieverse lets crypto-literate users provision web3-native AI agents, equip them with skills, and deploy them to messaging channels." | https://www.pieverse.io/ ; https://www.pieverse.io/llms.txt | 2026-11-11 | HIGH (primary, verbatim) |
| T2 | It did not start there. Litepaper: "The Compliance & Payment Infrastructure for the Web3 Economy" (invoices, receipts, "Time Economy"). Whitepaper v1.0 dated 2025-11-10: "Agent-Native, Compliant Payment Stack for Web3". So the project has had three framings in around 12 months: timestamped invoices and "TimeFi", then agent payments (x402b), then chat-app AI agents (Purr-Fect Claw). | https://www.pieverse.io/litepaper ; https://www.pieverse.io/whitepaper ; https://www.pieverse.io/ | 2026-11-11 | HIGH (primary, verbatim); the "three framings" reading is the researcher's summary |
| T3 | The token is PIEVERSE: 1,000,000,000 fixed supply, the same contract address on BNB Chain and Ethereum. 909.3M sits on Ethereum and 90.7M on BNB Chain. | whitepaper section 5.1; public RPC `eth_call` + Ethplorer/Binplorer APIs (`research/ethplorer-tokeninfo.json`, `research/binplorer-tokeninfo.json`) | 2026-11-11 | HIGH (primary + on-chain verified) |
| T4 | Allocation: Investors 15%, Community Growth 27.6%, Foundation Reserve 10%, Ecosystem & Marketing 27.4%, Team & Advisors 20%. | https://www.pieverse.io/whitepaper section 5.3 (identical in the litepaper 5.2) | 2026-11-11 | HIGH (primary) |
| T5 | Around 27% to 31% of the supply is counted as circulating, depending on who counts: CoinGecko 274.75M, CoinMarketCap 300.35M, the project's own API 309.5M. | section 5 | 2026-11-11 | HIGH that they disagree; no single "right" figure [VERIFY] |
| T6 | The 12-month lock on team and investor tokens ends 14 Nov 2026 (TGE was 14 Nov 2025). | Lock length: PANews via KuCoin flash 2025-11-08 (secondary). TGE date: Binance Alpha debut 14 Nov 2025 (secondary, bloomingbit) and first CoinGecko price print 2025-11-14. Unlock date: app.tokenomics.com, CoinMarketCap per cryptoticker (secondary) | 2026-11-11 | MEDIUM (no official vesting document opened; see Open question 1) [VERIFY] |
| T7 | What the product publishes about its own usage: a Skill Store counter (74,195 skills, 25,233 merchants). No count of agents, users, paying subscribers, payment volume or revenue is published anywhere that was checked. | https://purr.pieverse.io/api/app/skill-store/stats + the checked-list in Pillar 3 | 2026-11-11 20:10 UTC | HIGH for the counter; the absence claim is backed by the checked-list [VERIFY] |
| T8 | That counter is almost entirely a mirror of an outside catalog: 74,133 of 74,195 skills carry `source: clawhub`; 30 are native to Pieverse; 5 of all skills are priced. | `research/telemetry-skills-*.json` | 2026-11-11 20:12 UTC | HIGH (the product's own API) [VERIFY] |
| T9 | Backers: a 7M strategic round announced 24 Oct 2025, led by Animoca Brands and UOB Ventures; Binance MVB Season 9. | https://decrypt.co/345821/pieverse-secures-7-million-in-strategic-funding-round-led-by-animoca-brands-and-uob-ventures | 2026-11-11 | HIGH (the project's own press release) |
| T10 | Price: all-time high 2.23 on 9 Nov 2026 (CoinGecko; CoinMarketCap prints 2.22), all-time low 0.119 on 14 Nov 2025; 1.61 at read. | section 5 | 2026-11-11 20:04 UTC | HIGH at read time [VERIFY] |
| T11 | Staking is live and pays POINTS, not tokens: the live staking page says "Stake PIEVERSE, earn daily XP"; the official guide (Notion, last edited 2026-08-27) says fixed lock of 90, 180 or 365 days, no early or partial withdrawal, daily XP, and a one-time Agent benefit (under 50 PIEVERSE = a Starter agent, 50 or more = a Basic agent, for the length of the lock). XP's future use "will be announced". | https://www.pieverse.io/staking (meta text) · https://pieverse.notion.site/Pieverse-Staking-User-Guide-3c9cee2fa0e080b4bfe6dab45240cfc7 (`research/page-staking-guide.txt`) | 2026-11-12 | HIGH (the project's own pages) |
| T12 | Holders voted on how staking should be rewarded: PIP-5 on Snapshot (space `pieverse-snapshot.eth`, voting 2026-08-08 to 2026-10-08, closed): 1,130 votes, around 170 thousand tokens of voting weight in total (under 0.02% of the 1B supply, my calc). "Token Rewards" had the most weight (138,047 of 169,871, 81%), then "Governance Voting Power" (107,312), "Platform Revenue" (101,017), "Platform Perks" (97,843), "Other" (84,455). Approval voting, so the options overlap. | https://hub.snapshot.org/graphql (`research/snapshot-pieverse.json`) | 2026-11-12 | HIGH for the tallies (on-record); what the team does with the result is NOT FOUND |
| T13 | The sharp move on 9 Nov 2026 was a flow event on the Korean exchange first: Upbit won-traded value went from 3.03B KRW (8 Nov) to 53.82B KRW (9 Nov), 17.8x (my calc), and the price fell 14.6% in the 2 hours after the high on OKX futures (2.2501 to 1.9218, my calc). | Upbit `/v1/candles/days?market=KRW-PIEVERSE` · OKX hourly candles (`research/event-window-derivs.json`) | 2026-11-12 | HIGH for the series; no cause found (see Pillar 8) |

---

## 2. Pillar facts

### Pillar 1: What Pieverse is

**The three self-descriptions (all primary, all read 2026-11-11). List them, never pick one silently:**

1. **Litepaper (undated on the page; roadmap starts "2025 Q4"):** title "Pieverse Litepaper: The Compliance & Payment Infrastructure for the Web3 Economy". Two pillars: "Pieverse Timestamping" ("transforms on-chain transactions into verifiable, business-ready records ... jurisdiction-compliant invoicing and receipts") and "The Time Economy" ("stake-backed Time Challenges, an AI-powered Marketplace"). This is where the **TimeFi** label comes from. (https://www.pieverse.io/litepaper)
2. **Whitepaper v1.0 (Issue Date 2025-11-10, Last Updated 2025-11-10):** "Pieverse is an agent-native, compliant payment stack revolutionizing Web3 with auditable, gasless infrastructure that timestamps value through on-chain invoices, receipts, and checks." Core technology: "x402b, an extension of the x402 HTTP payment protocol, facilitating gasless, EIP-3009-style stablecoin transactions via pieUSD (a wrapped USDT)", receipts "stored on BNB Greenfield". (https://www.pieverse.io/whitepaper)
3. **Home page today:** title "Pieverse: Web3 AI Agent for Line & Kakao" (the original uses a dash where the colon is). Lead product "Purr-Fect Claw": "Provision a Web3-native AI agent for Line, Kakao, and other chat apps. Pieverse handles wallet creation, seed phrase custody, and setup." (https://www.pieverse.io/) The about page: "Web3-native AI agents that users can own, equip, and deploy." (https://www.pieverse.io/about)

**What "TimeFi" means here:** the litepaper's "Time Economy": tools built on timestamped payments, "Time Challenges" (stake-backed community campaigns), an "AI-Powered Marketplace & Calendar" that "matches contributors with paid micro-tasks". The word "TimeFi" itself does not appear on the current home page; it is a CoinGecko category tag (https://api.coingecko.com/api/v3/coins/pieverse, read 2026-11-11). The GitHub org still carries the oldest layer: repo `pieverse-deployments` is described as "Pieverse's AI-powered calendar aggregator" (created 2025-09-05) and `pieverse-receipt` as "One-click receipt generation for Web3 transactions with tax compliance" (created 2025-10-14) (https://api.github.com/orgs/Pieverse-Eng/repos, read 2026-11-11).

**What the AI angle means here:** not an AI model. Pieverse hosts an AI AGENT for you (a paid monthly instance), gives the agent its own crypto wallet, and lets you talk to it inside a chat app. The agent runtime is OpenClaw-compatible, and the home page lists "Works with Claude Code, Codex, OpenClaw, Hermes Agent & more". (https://www.pieverse.io/, https://docs.pieverse.io/llms-full.txt)

**Who builds it:**
- Whitepaper 7.1, first names only: "Colin (Co-founder & CEO): Ex-Google/Uber engineer with 9 years of blockchain experience; a Carnegie Mellon graduate." "David (Co-founder & CMO): Former ecosystem marketing lead at Polkadot and Paxful; an NYU graduate." "Alice (Head of BD): Harvard alumna". "Albert (Tech Lead): Former Google engineer and DeFi smart contract architect; an NYU graduate." "Alina (Head of Ecosystem): A Cornell graduate and LinkedIn alum". All project claims. (https://www.pieverse.io/whitepaper)
- The CEO's full name, Colin Ho, is in the funding press release: "said Colin Ho, Co-founder and CEO of Pieverse" (Decrypt copy, dateline 24 Oct 2025).
- Operating entity named on the site footer: "Developed by Pieverse Technology Limited." (https://www.pieverse.io/press). Jurisdiction and registry record: NOT FOUND (checked: home, about, press, whitepaper, litepaper, llms.txt; no registry number or country on any). The whitepaper also names "The Pieverse Foundation (@pieverse_fdn)" as managing governance.
- Press datelines: San Francisco (24 Oct 2025 and 19 Dec 2025 releases), Seoul (17 Mar 2026 release).

**Chains:**
- Token: BNB Chain (BEP-20) and Ethereum (ERC-20), whitepaper 5.1, on-chain verified.
- Product: agent wallets default to BNB Chain (`"chainId": 56` in the docs' registration example); the CLI covers "EVM or Solana wallets"; the app's explorer links cover BNB Chain, Ethereum, Base, Arbitrum, Monad and X Layer (docs.pieverse.io/llms-full.txt; `research/bundle/` script chunks, read 2026-11-11). The public sandbox names "Base Sepolia (84532)" and "BSC Testnet (97)" as test chains (https://www.pieverse.io/sandbox.md).

**Stage of the product (the project's own machine-readable words, read 2026-11-11):**
- LIVE: the website, paid Purr-Fect Claw plans (5 tiers, 10 to 279 USD a month), the Skill Store, the docs, the `purr` CLI repo (pushed 2026-10-30).
- The project's own `llms.txt` lists as **"deferred"**: "Live agent payments: deferred. No public live agent payment/action protocol is advertised as executable today." "x402, UCP, ACP, AP2-style agent transactions: deferred." "api.pieverse.io execution APIs: deferred. The API host is reserved for future execution APIs." And as **"protected"**: A2A merchant and agent SDK docs, instance management, skill installs.
- `https://www.pieverse.io/api/agent-discovery/status` returns `"executionApiStatus": "reserved-for-future-public-execution-apis"`, `"updatedAt": "2026-07-04"`.

**Where the project's own descriptions disagree with each other (contradictions list):**
1. Home page, "Why Pieverse": "Every major layer: a technical first. Shipped, not announced." including "First Web3-Native A2A Commerce Protocol: Agents discover, negotiate, pay each other (gasless via x402b)". Versus `llms.txt` on the same domain: "Live agent payments: deferred" and "x402 ... agent transactions: deferred ... specs do not claim these actions are live." The fair reading: the agent-to-agent payment layer is documented (SDK docs are public at docs.pieverse.io/pieverse-a2a) but the project's own discovery file does not claim it as publicly executable. Say "documented" or "being built", not "live".
2. `llms.txt` says "A2A merchant and agent SDK docs: protected", yet https://docs.pieverse.io/pieverse-a2a (Overview, Merchant SDK, Agent SDK) is public and was read. And the two SDK packages the docs import (`@pieverse-eng/agent-sdk`, `@pieverse-eng/merchant-sdk`) are not on the public npm registry (registry.npmjs.org returned "Not found" for both, 2026-11-11).
3. Whitepaper and CoinMarketCap describe a payments stack (x402b, pieUSD, BNB Greenfield receipts). The current docs site never mentions pieUSD, x402b as a product name, or the PIEVERSE token: a text search of the full docs dump found 0 mentions of "PIEVERSE", 0 of "pieUSD", 0 of "x402b", 0 of "stake", and 9 of "USDT" (`research/docs-llms-full.txt`, my count, 2026-11-11).
4. The whitepaper roadmap (2026 Q2: "Introduce the Pieverse DAO for community-led governance"; 2026 Q4: "Strategic partnerships with major accounting and audit firms") is a compliance-payments roadmap. Purr-Fect Claw, the product the home page now leads with, is not on that roadmap at all.
5. The CoinDesk-hosted release (17 Mar 2026) names "Line, Kakao, or WhatsApp". The home page today lists LINE, KakaoTalk, Telegram "+ more" and its title names only Line and Kakao. WhatsApp is not on the home page.

**Where outside coverage disagrees with the project:** CoinMarketCap's About text still says "an agent-native, compliant payment stack powered by x402b rails" (read 2026-11-11), which is the November 2025 whitepaper framing, not the current home page. CoinGecko's categories still include "TimeFi", the oldest framing.

### Pillar 2: How it works (the ONE system-design chart)

Everything below is from https://docs.pieverse.io/llms-full.txt and https://www.pieverse.io/ unless noted (read 2026-11-11). These are the nodes and arrows for C1.

- **You, in a chat app.** "Your agent lives in Line and Kakao: no new app to install, no dashboard to learn. Message it like a friend". (home)
- **Purr-Fect Claw instance.** A hosted, always-on agent you rent monthly. Tiers: Starter 10 USD (free model or your own API key, up to 1 vCPU / 2 GB RAM), Basic 29, Standard 49, Pro 99, Ultra 279 (2,000 AI credits a month, up to 6 vCPU / 16 GB RAM). "Currency: USD. Billing period: month." Payment: "Crypto-native checkout for product purchases and renewals." (https://www.pieverse.io/pricing.md)
- **The agent's own wallet, inside a TEE.** "Your purr wallet is TEE-backed. TEE stands for Trusted Execution Environment: a hardware-isolated area of a processor where code runs in a secure enclave. Private keys are: Generated inside the TEE; Never written to disk in plaintext; Never accessible to your skill code, the host OS, or any external party." "One wallet is provisioned per instance." (docs, Core Concepts). The home page's plain version: "Pieverse handles wallet creation, seed phrase custody, and setup." That is a CUSTODY statement: the user does not hold the keys. Worth one caveat line.
- **Second trust model:** "First ERC-6551 Agent Authorization: Agents operate from a user's existing wallet with programmable spending limits and expirations." (home, project claim)
- **Skills.** "A skill is a directory containing a SKILL.md file. Skills are operational instructions loaded into your agent's context: they tell the agent how to route and execute on-chain operations." "The onchain skill ... dispatches to the correct skill for each intent: swap, lend, bridge, buy". The CLI has built-in commands for PancakeSwap swaps, Solana swaps via DFlow, multi-chain swaps via Bitget, and Lista DAO vault deposits. (docs)
- **Skill Store.** "Equip your agent from the Purr-Fect Skill Store like installing apps on a phone. Developers publish a skill once and earn across every runtime." (home). Merchant sign-up is instant: "Your merchant account is activated immediately: no manual review." (docs)
- **On-chain action.** The agent signs with the TEE wallet and executes "native contract calls, swaps, and portfolio management directly from Line and Kakao" (home).
- **Agent-to-agent payments (documented, not claimed live; Pillar 1 contradiction 1).** "Pieverse A2A is an agent-to-agent payment and settlement system built on HTTP 402 Payment Required." Four steps, verbatim: "1. A merchant gates an API endpoint behind a 402 paywall using the Merchant SDK. 2. An agent hits the endpoint, receives a 402 challenge, authorizes payment via the Agent SDK, and retries. 3. The merchant settles the payment on-chain with proof of service delivery. 4. For repeated interactions, payment sessions aggregate micro-charges into a single on-chain settlement." The docs example settles in USDT on BNB Chain (`symbol: 'USDT'`, `chainId: 56`). (https://docs.pieverse.io/pieverse-a2a)
- **Where the PIEVERSE token sits in this mechanism:** nowhere in the docs (0 mentions, Pillar 1 contradiction 3). Plans are priced in USD; the A2A example pays in USDT. The token's stated jobs come from the whitepaper only (5.2): "Governance", "Incentives: Stake for yields", "Payments and Discounts: ... Users can pay for annual subscriptions and transaction fees using $PIEVERSE at a discount", "Access: Priority in events, betas, and campaigns." Whether a PIEVERSE discount or staking exists in the live checkout: NOT FOUND (checked: pricing.md no token mention; /api/agent-discovery/pricing no token field; docs 0 mentions; the checkout itself sits behind a wallet-signed session and was not entered).

**Plain-language summary the sources support (for the strategist, not a quote):** You rent an AI agent by the month. Pieverse runs it for you, hands it a crypto wallet whose keys live inside secure hardware so nobody (you included) handles a seed phrase, and puts it in the chat app you already use, so you can type "swap this" and the agent does it on-chain. You add abilities to it from a skill store, the way you add apps to a phone. The longer-term pitch is that these agents will also pay each other for services, with a receipt for every payment. The PIEVERSE token is described in the whitepaper as the governance, staking and fee-discount token for that system; the product docs do not show it inside the payment flow.

### Pillar 3: What is real today (the PRODUCT TELEMETRY SWEEP, coin-research row 8)

**Sweep step 1, the home page (https://www.pieverse.io/, saved `research/home.html`, read 2026-11-11 20:06 UTC):** no live counter, no "stats" or "track record" section. The only large number is "240M+ users across Asia", which is the audience of LINE and Kakao, not Pieverse's users (section 4).

**Sweep step 2, standard paths on `www.pieverse.io` (HTTP status at 2026-11-11 20:06 UTC):**
`/stats` 404 · `/v1/stats` 404 · `/api/stats` 404 (JSON: "Unknown Pieverse public API resource.") · `/metrics` 404 · `/status` 404 · `/status.json` 404 · `/health` 404 · `/v1/health` 404 · `/facts` 404 · `/facts.json` 404 · `/.well-known/` 404 · `/version.json` 404 · `/changelog` 404 · `/changelog.json` 404 · `/llms.txt` **200** · `/llms-full.txt` 404 · `/openapi.json` **200** · `/sitemap.xml` **200** (62 URLs) · `/robots.txt` **200**.
The hits led to: `/index.md`, `/pricing.md`, `/sandbox.md`, `/developers.md`, `/api/agent-discovery/status|pricing|sandbox|resources`, `/.well-known/agent-card.json` (all 200, all saved). None carries a usage number. The OpenAPI file ("Pieverse Public Read-Only Discovery API", version 2026-07-04) "intentionally excludes product writes, payment actions, protected A2A surfaces, merchant SDK actions, and user data."

**Same paths on the product API host `purr.pieverse.io` (2026-11-11 20:09 UTC):** `/`, `/stats`, `/api/stats`, `/metrics`, `/status`, `/status.json`, `/health`, `/openapi.json`, `/docs`, `/llms.txt`, `/version.json` all 404; every `/v1/*` path tried (`/v1/stats`, `/v1/health`, `/v1/status`, `/v1/skills`, `/v1/agents`, `/v1/agents/count`, `/v1/metrics`, `/v1/version`, `/v1/openapi.json`) returns **401** `{"ok":false,"error":"Missing Authorization header"}`. `api.pieverse.io`: no response on any path (connection failed), consistent with the project calling that host "reserved for future execution APIs".

**Sweep step 3, mining the page scripts (the step that found the numbers):** the Skill Store page's script chunk calls `skills`, `skills/featured`, `categories/counts` and `stats` on the app API (`research/bundle/skill-store-*.js`); the route table puts them under `/api/app/skill-store/` on `https://purr.pieverse.io` (`research/bundle/hc.js`, `env-*.js`). Called directly, no auth:

| Endpoint (GET, public) | Result at read | Read (UTC) |
|---|---|---|
| `https://purr.pieverse.io/api/app/skill-store/stats` | `{"totalSkills":74195,"totalMerchants":25233,"totalCategories":14}` | 2026-11-11 20:10 [VERIFY] |
| `.../skill-store/skills?source=clawhub` | `total: 74133` (every one sampled is `pricingType: free`, with a `tarballUrl` and `externalUrl` on clawhub.ai) | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/skills?source=builtin&limit=50` | `total: 32` (integrations Pieverse ships itself, named below) | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/skills?source=native&limit=50` | `total: 30` (skills published by merchants on Pieverse itself); install counts sum to **24**; highest single count is 3 | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/skills?pricingType=paid` | `total: 4`: "Paid Dumb Skill" 0.01 USD (1 install), "Paid Purr Skill" 0.01 USD (0 installs), "HK IPO Scanner" 9.99 USD (0), "Exposing Whale Dumping" 9.99 USD (0) | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/skills?pricingType=subscription` | `total: 1`: "purr-gemini-watermark-remover" 0.99 USD a month (0 installs) | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/skills?pricingType=free` | `total: 74190` | 2026-11-11 20:12 [VERIFY] |
| `.../skill-store/categories/counts` | 14 categories; largest "utility" 29,563 and "ai-ml" 21,616; "onchain" 525, "defi" 540, "trading" 1,244 | 2026-11-11 20:10 [VERIFY] |
| `https://purr.pieverse.io/api/app/circulating` | `{"result":"309500000"}` | 2026-11-11 20:10 [VERIFY] |
| `https://purr.pieverse.io/api/app/total-supply` | `{"result":"1000000000"}` | 2026-11-11 20:10 |

**How to read the Skill Store numbers (windows and exclusions, sweep step 7):**
- 74,133 + 32 + 30 = 74,195 (my calc): the three sources add up to the headline exactly. **99.9% of the catalog is mirrored from ClawHub** (74,133 / 74,195, my calc), an outside skill hub for OpenClaw agents. The first rows were created 2026-03-16, the day before the Purr-Fect Claw release.
- The big install counts belong to the mirrored skills and are too large to be Pieverse installs: the top skill "self-improving agent" shows `installCount: 491522`, more than the token's total holder count on both chains (411,428). The API does not label them as imported counts; the researcher's reading is that they travel with the ClawHub listing. Do-not-air as Pieverse usage (section 4).
- "25,233 merchants" is the same story: a mirrored skill's publisher is stored as a merchant (the top skill's merchant is ClawHub user "pskoett", `merchantId: 12393`). Native skills come from around 20 distinct merchant ids (my count from `research/telemetry-skills-native-all.json`).
- The 32 builtin skills are where the "skill partners" on the home page come from. Their names, from the API: Binance, Binance Agentic Wallet, OKX OnchainOS, OKX, AgentKey, Osero, Balancer, BNB Chain MCP, Kaia, Hyperliquid, Lighter, Orderly, Injective, Morph, Kraken, Bitget Wallet, Bitget, Mantle, PancakeSwap, DFlow, Gate.io, PANewsLab, BlockBeats, Four.Meme, Aster DEX, OpenSea, cobo-agentic-wallet, Surf, DuckDuckGo Search, Lista Vaults, OWS, RootData. Their `installCount` values run 32, 31, 30 ... down to 1 in exact steps of one, which reads as a display order, not usage. A skill for an exchange is an integration Pieverse built; it is NOT evidence that exchange is a partner (section 4).
- No time window is stated by any endpoint (no 24h / 7d / 30d, no `updated_at`).

**Sweep step 4, explorers, dashboards, packages, GitHub:**
- **GitHub org `Pieverse-Eng`** (https://api.github.com/orgs/Pieverse-Eng, read 2026-11-11): created 2025-03-11, 11 public repos, 7 followers. Most-starred repo: `purrfect-agent` 39 stars, 27 forks (created 2026-05-11, last push 2026-05-12). Active: `purrfect-skills` (Python, pushed 2026-11-10, 0 stars, 4 forks), `purr-cli` (TypeScript, pushed 2026-10-30, 0 stars). `hermes-agent` and `fx` are forks of other projects (NousResearch/hermes-agent, vercel-labs/fx); `openclaw` and `coinbase-x402` are copies of upstream projects by their descriptions.
- **npm:** `@pieverse-eng/agent-sdk`, `@pieverse-eng/merchant-sdk`, `@pieverse-eng/purr-cli`, `purr-cli`, `@pieverse/x402b`: all "package not found" on registry.npmjs.org and api.npmjs.org (2026-11-11). So there is no public download count to cite. The CLI installs from a GitHub script instead (docs).
- **DefiLlama:** no Pieverse entry in https://api.llama.fi/protocols (searched names containing "pie": 16 hits, none Pieverse; 2026-11-11). No TVL, fees or revenue page.
- **Third-party facilitator directory (secondary, not opened):** a search result for piprail.com/facilitators lists Pieverse as an x402 facilitator settling on BNB Chain and Monad with "32 settlements checked on-chain as of 2026-09-06", a verification sample, not a total. Not opened by the researcher: [VERIFY], do-not-air as a figure.

**Usage numbers the project has put in writing (project claims, dated):**
- Litepaper: Time Challenges "validated with over $5M in on-chain volume from the Binance Alpha Time Challenge." Undated on the page, from the pre-token era, and it is campaign purchase volume, not product revenue. (https://www.pieverse.io/litepaper)
- Litepaper: "near-instant settlement (~36 seconds)", "tax receipts for over 10 countries". Product specs, not usage.
- Launch-era coverage cites "about 500,000 transactions in its first week" for x402b after 26 Oct 2025 (search-result level, from exchange blogs; not opened, not primary). Do-not-air (section 4).

**NOT FOUND, each with its checked-list:**
- **Number of Purr-Fect Claw agents / instances running:** NOT FOUND (checked: home page no counter; www `/stats` `/v1/stats` `/status.json` `/facts.json` 404; `purr.pieverse.io/v1/agents`, `/v1/agents/count`, `/v1/stats` 401; `/api/app/skill-store/stats` 200 but skills and merchants only; the agent-registry and a2a-marketplace pages need a wallet session; OpenAPI excludes user data; the 17 Mar 2026 release gives no number; web search "Pieverse agents deployed" nothing primary).
- **Paying subscribers and product revenue:** NOT FOUND (checked: pricing.md and `/api/agent-discovery/pricing` list prices only; no revenue page; DefiLlama no entry; Token Terminal not checked by name, no listing surfaced in search; whitepaper section 4 describes revenue STREAMS, no amounts).
- **x402b / A2A payment volume, pieUSD supply:** NOT FOUND (checked: docs 0 mentions of pieUSD; `purr.pieverse.io/api/app/x402` and `/receipts` 404; `api.pieverse.io` no response; DefiLlama no entry; web search "Pieverse x402b facilitator transactions volume x402scan pieUSD" returned launch-week coverage only; pieUSD's contract address was not located, so its on-chain supply was not read. See Open question 4).
- **Skill Store sales:** the store itself answers it. Upper bound on paid-skill revenue = installs x list price = 1 x 0.01 USD + 0 = **0.01 USD** (my calc from the paid and subscription rows above; an upper bound, since "Paid Dumb Skill" is published by merchant id 1 and reads as the team's own test listing).

**Sweep step 6, usage turned into money, beside the token (the one-number gap):**
- Product side that can be evidenced from public numbers: paid Skill Store sales of 0.01 USD at most; subscription revenue not published. A reference point, NOT a measurement: every 1,000 subscribers on the 29 USD Basic plan would be 29,000 USD a month (my calc from pricing.md; the subscriber count is unknown).
- Token side: new tokens reaching unlocked status per month from 14 Nov 2026 on the tracker's schedule = around 33.4M PIEVERSE (my calc, matches app.tokenomics.com's 33,411,329), which is around 53.8M USD a month at 1.61 (my calc: 33,411,329 x 1.61). CoinMarketCap's schedule shows a larger first tranche of around 86.4M tokens (around 139M USD at 1.61, my calc). [VERIFY] both; they disagree (Pillar 4).
- Billing currency: USD, paid by "crypto-native checkout". Whether PIEVERSE is accepted or discounted at checkout: NOT FOUND (checked-list in Pillar 2).

**Sweep step 5, the product's own disambiguation notes:** `sandbox.md`: "Sandbox data is illustrative and non-production. It must not be treated as live user, wallet, or payment state." `llms.txt`: "Do not infer that write APIs or autonomous payment actions are public." These are the project telling readers not to treat its demo data or its payment specs as live activity.

**Sweep step 8, triggers to watch (a number whose next value changes the story):**
1. **14 Nov 2026: the 12-month cliff on team and investor tokens ends** (three days after this read). The number to watch: circulating supply on CoinGecko (274.75M at read) and CoinMarketCap (300.35M at read), and the balances of the big Ethereum Safes (Pillar 4).
2. **Native skills and paid installs in the Skill Store** (`source=native` total 30, installs 24, paid installs 1 at read). If the store is a real marketplace, these move.
3. **Whether the project ever publishes an agent or subscriber count.** At read it publishes none.

### Pillar 4: The token (supply, unlocks, listings, price)

**Identity and on-chain facts (on-chain verified, public RPC `eth_call` + Ethplorer/Binplorer free API, 2026-11-11 20:12 UTC):**
- Contract, both chains: `0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9`. `name()` = "Pieverse Token", `symbol()` = "PIEVERSE", `decimals()` = 18 on both.
- Supply per chain: Ethereum 909,309,478.63 · BNB Chain 90,690,521.37 · sum 1,000,000,000.00 (my calc). So around 91% of the supply sits on Ethereum and around 9% on BNB Chain [VERIFY: the split moves when tokens bridge].
- Holders: BNB Chain 348,762 · Ethereum 62,666 · sum 411,428 (my calc; CoinMarketCap shows 411.21K). [VERIFY]
- Transfers: BNB Chain 15,295,099 · Ethereum 147,053. Activity is on BNB Chain; the big balances are on Ethereum.
- `owner()`: Ethereum `0x1b24eea1585375ab78efa5baaf4111b83bdcae2c`, BNB Chain `0xd18d0d81b640ec77dada51ea2178659e835caaa5`. Both are contracts; the Ethereum owner answers the Safe multisig calls with threshold 2 of 3 owners. What the owner role can do (mint, pause, upgrade) was NOT read: Open question 5.
- **Top Ethereum holders (Ethplorer top 20):** 166,000,000 (`0x82a4...b441`) · 150,000,000 (`0xa8bc...84dd`) · 150,000,000 (`0xdef6...9ef4`) · 100,000,000 (`0x0df0...990e`) · 50,000,000 (`0x3d4f...c1d4`) · 33,000,000 (`0x0605...e934`) · 30,000,000 (`0xef1f...dff0`) · 30,000,000 (`0x428e...fff8`) · 27,500,000 (`0x053e...fab8`). The top four hold 566,000,000 = 56.6% of total supply (my calc).
- **Who controls them:** seven of those nine addresses (166M, 150M, 150M, 100M, 50M, 30M, 27.5M = 673,500,000 tokens, 67.35% of supply, my calc) are 171-byte Safe proxy contracts that return `getThreshold() = 2` and three owners (`research/onchain-eth-top-holders-code.txt`). The 33M and one 30M address are plain wallets (no code). So the locked supply is held in **2-of-3 multisig wallets, not in a vesting contract** that enforces the schedule in code, as far as these reads show. The researcher did not check for an attached timelock or module, and the wallets are unlabeled: which bucket each one is (team, investors, foundation) is an inference from the round numbers (150M = the 15% investor allocation size; 100M = the 10% foundation size), not a sourced fact. The 673.5M in Safes is close to the tracker's "locked per schedule" 668,594,293.
- Top BNB Chain holders (Binplorer): 17,000,000 · 15,000,000 · 15,000,000 · 11,903,502 · 10,822,201 (exchange and pool wallets are likely among them; unlabeled, not attributed).

**Allocation (primary: whitepaper 5.3, read 2026-11-11):**

| Bucket | % | Tokens (my calc) | Whitepaper's words |
|---|---|---|---|
| Community Growth | 27.6% | 276,000,000 | "Community rewards, airdrops, and growth initiatives" |
| Ecosystem & Marketing | 27.4% | 274,000,000 | "Platform development, partnerships, and marketing initiatives" |
| Team & Advisors | 20% | 200,000,000 | "Core team and advisors with long-term vesting" |
| Investors | 15% | 150,000,000 | "Strategic investors with vesting schedule" |
| Foundation Reserve | 10% | 100,000,000 | "Long-term ecosystem development and strategic reserves" |

Insider-side total (team + investors + foundation) = 45%; community-side total = 55% (my calc).

**Vesting terms (NOT in the whitepaper; third-party and secondary, [VERIFY]):**
- Secondary, dated 2025-11-08 (PANews, republished by KuCoin): allocations for "team, advisors, investors, and core contributors" are "subject to a 12-month vesting period followed by linear release." (https://www.kucoin.com/news/flash/pieverse-reveals-native-token-pieverse-economic-model-with-1-billion-supply)
- Tracker (https://app.tokenomics.com/tokenomics/pieverse/unlocks, read 2026-11-11): TGE 14 Nov 2025, final unlock 14 Nov 2028. Community Growth 14.5% at TGE then 36 months linear · Ecosystem & Marketing 49.3% at TGE then 30 months linear · Team & Advisors 12-month cliff then 24 months linear · Investors 12-month cliff then 18 months linear · Foundation Reserve 6-month cliff then 18 months linear.
- A second outlet's reading of the same schedule differs (Bitrue blog, 2026-11-09: Community Growth "about 21 months", Ecosystem "about 22 months", Investors "about 15 months"). The lengths are not settled.
- TGE float implied by the tracker's terms: 276M x 14.5% + 274M x 49.3% = 175.1M = 17.5% of supply (my calc). IQ.wiki also states "Circulating supply at launch: 175,000,000 (17.5%)" citing CoinMarketCap (https://iq.wiki/wiki/pieverse, read 2026-11-11, secondary).

**Supply released over time (my calc from the tracker's terms above; saved `research/mycalc-supply-schedule.json`; this is the candidate series for an animated chart, and it inherits the tracker's uncertainty):**

| Date | Released (M) | Of which team + investors (M) | Note |
|---|---|---|---|
| 2025-11-14 | 175.1 | 0 | TGE |
| 2026-02-14 | 208.7 | 0 | |
| 2026-05-14 | 242.2 | 0 | foundation cliff ends; its vesting starts |
| 2026-08-14 | 292.4 | 0 | |
| 2026-11-14 | 342.7 | 0 | team and investor cliff ends; their vesting starts |
| 2026-12-14 | 376.1 | 16.7 | first month with all five buckets vesting: +33.4M a month |
| 2027-05-14 | 543.1 | 100.0 | |
| 2027-11-14 | 743.6 | 200.0 | foundation fully vested |
| 2028-05-14 | 910.7 | 300.0 | investors and ecosystem fully vested |
| 2028-11-14 | 1,000.0 | 350.0 | everything vested |

Monthly release after 14 Nov 2026 (my calc): Community 6.56M + Ecosystem 4.63M + Team 8.33M + Investors 8.33M + Foundation 5.56M = 33.41M a month, around 12.2% of CoinGecko's circulating figure every month (33.41 / 274.75).

**The 14 Nov 2026 unlock: two trackers, two sizes (conflict, both secondary, [VERIFY]):**
- app.tokenomics.com: "Nov 14, 2026 (next)": 33,411,329 tokens, 3.3% of supply. At 1.61 that is around 53.8M USD (my calc).
- CoinMarketCap's unlock schedule as reported by cryptoticker (https://cryptoticker.io/en/pieverse-unlock-november-14-vesting-cliff/, published 2026-11-04, read 2026-11-11): around 86.4M tokens, 8.64% of supply: Investors 25.0M, Foundation reserve 25.0M, Ecosystem and marketing 19.75M (cliff), Team and advisers 8.33M, Community growth 8.3M. At 1.61 that is around 139M USD (my calc). The CoinMarketCap page itself showed an EMPTY "Token Unlocks" section to the researcher's fetch on 2026-11-11, so this breakdown is second-hand.
- Either way the direction is the same: the first team and investor tokens become unlockable on 14 Nov 2026, and the release rate steps up from that date.

**Circulating supply: three numbers (conflict):**
- CoinGecko: 274,750,000 (27.5%). (API, 2026-11-11 20:04 UTC)
- CoinMarketCap: 300.35M (30.04%). (page, 2026-11-11 around 20:13 UTC)
- The project's own endpoint: 309,500,000 (30.95%). (https://purr.pieverse.io/api/app/circulating, 2026-11-11 20:10 UTC)
- The tracker: "Circulating (market) 274,750,000 (27.5%)" plus "Unlocked but not yet in market: 56,655,707 (5.7%)" = 331.4M unlocked.
- **Which one the video uses:** recommend CoinGecko's 274.75M for market cap (it is the figure the price-history series is built on) and saying plainly that CoinMarketCap and the project count around 300M to 310M. Market cap at 1.61: 442.7M on CoinGecko vs 484.1M on CoinMarketCap.

**Listings history:**

| Date | Venue, product | Source (read 2026-11-11) | Grade |
|---|---|---|---|
| 2025-08-29 (announced) | Binance Wallet: "Exclusive Pre-Token Generation Event (Pre-TGE) and Booster Program". Pre-TGE: 20,000,000 PIEVERSE (2% of supply) for 200,000 USD in BNB, 0.01 USD a token, cap 3 BNB a user. Booster: 30,000,000 PIEVERSE (3%), start 2025-09-01 09:00 UTC | https://www.binance.com/en/support/announcement/detail/19c6b186757b489495d55611140135c2 | PRIMARY |
| 2025-11-14 19:00 UTC+8 (11:00 UTC) | Binance Alpha (first trading) | https://en.bloomingbit.io/feed/news/100668 (published 2025-11-13) | secondary [VERIFY against Binance's notice] |
| 2025-11-14 19:30 UTC+8 (11:30 UTC) | Binance Futures: PIEVERSEUSDT perpetual, up to 40x | same | secondary [VERIFY] |
| 2025-11-24 | Bithumb, KRW market | search results only (KuCoin flash, bloomingbit log); the page tried returned HTTP 410 | [VERIFY], not opened |
| 2026-04-20 16:00 KST | Upbit: KRW, BTC and USDT markets; deposits on the Ethereum network | https://en.bitcoinsistemi.com/bitcoin-exchange-upbit-announces-new-listing-here-are-the-details-3/ (published 2026-04-20) | secondary [VERIFY against Upbit's notice] |
| dates not found | Bybit, Gate, Kraken, OKX (perp), KuCoin (perp), MEXC, BingX, Bitkub spot or perp markets exist at read | CoinGecko tickers and derivatives feed, 2026-11-11 | venues confirmed live; listing dates NOT FOUND (checked: CoinGecko tickers carry no listing date; no exchange notices opened) |
| not listed at read | Binance SPOT and Coinbase do not appear in CoinGecko's ticker list for PIEVERSE (18 spot tickers returned) | https://api.coingecko.com/api/v3/coins/pieverse | at read only [VERIFY]; say "Binance Alpha and Binance Futures", never "listed on Binance" |
| delistings | none found | no delisting surfaced in search | [VERIFY] |

The "Binance Alpha Spotlight" tag is a CoinGecko category; CoinMarketCap's tags read "Binance Alpha, Binance Wallet IDO, Ethereum Ecosystem".

**Price history (CoinGecko daily series, 00:00 UTC prints, `research/coingecko-market-chart-365d.json`, pulled 2026-11-11 20:05 UTC; candidate series for an animated chart) [VERIFY the last point at render]:**

| Date | Price (USD) | 24h volume (M USD) | Note |
|---|---|---|---|
| 2025-11-14 | 0.220 | 1.4 | first print; ATL 0.119363 the same day at 13:01 UTC |
| 2025-11-15 | 0.134 | 36.8 | lowest daily print |
| 2025-11-25 | 0.518 | 150.0 | the day after the Bithumb KRW market date |
| 2025-11-26 | 0.484 | 406.0 | |
| 2025-12-15 | 0.452 | 41.2 | |
| 2026-01-15 | 0.502 | 19.9 | |
| 2026-02-15 | 0.429 | 4.4 | range 2026-02-01 to 2026-04-15: 0.382 to 0.574 |
| 2026-03-15 | 0.497 | 5.5 | |
| 2026-04-15 | 0.440 | 4.9 | |
| 2026-04-19 | 0.615 | 28.3 | |
| 2026-04-20 | 1.184 | 245.5 | Upbit listing day |
| 2026-04-21 | 0.968 | 613.7 | highest daily volume in the series |
| 2026-05-15 | 0.980 | 79.5 | |
| 2026-06-15 | 0.665 | 5.3 | |
| 2026-07-15 | 0.662 | 3.6 | |
| 2026-08-15 | 0.800 | 6.3 | |
| 2026-09-15 | 1.137 | 2.9 | |
| 2026-09-22 | 1.847 | 24.1 | September peak (daily print) |
| 2026-10-15 | 1.179 | 3.0 | |
| 2026-11-01 | 1.036 | 2.1 | |
| 2026-11-09 | 1.442 | 8.7 | intraday ATH 2.23 at 18:57 UTC |
| 2026-11-10 | 2.017 | 69.5 | highest daily print |
| 2026-11-11 | 1.61 | 25.0 | at read, 20:04 UTC |

- From the all-time low to the read price: 0.119363 to 1.61 = around 13.5x (my calc). From the Binance Wallet pre-TGE price of 0.01 to 1.61 = 161x (my calc; that price was available only to capped pre-TGE participants, and those tokens were locked "until the project team enables circulation").
- Stated causes: the 20 Apr 2026 jump coincides with the Upbit listing (dated coverage headline "PIEVERSE Jumps 60% After Upbit Listing", page returned 403, not opened). For the November 2026 run to the all-time high, coverage found in search says the trigger "remains unclear" and notes it came days before the 14 Nov unlock; no primary cause was found. Do not assert a cause for November.

**Derivatives vs spot (CoinGecko derivatives feed, 2026-11-11 20:14 UTC, `research/cg-derivatives-pieverse.json`) [VERIFY]:**
- 31 perpetual venues list PIEVERSE. Reported 24h perp volume summed: around 464.2M USD. Reported open interest summed: around 78.8M USD.
- Spot 24h volume: 25.0M USD (CoinGecko) or 63.8M USD (CoinMarketCap). Perp volume is around 18.5x CoinGecko's spot figure and around 7.3x CoinMarketCap's (my calc).
- Largest by open interest: Binance Futures 21.4M OI (59.6M volume), OrangeX 9.1M, KuCoin Futures 7.2M, OKX 7.1M, CoinW 6.3M, Gate 5.8M, XT.COM 5.7M, Bybit 4.9M.
- Not credible: Deepcoin reports 60.0M of 24h volume against 3,184 USD of open interest; Biconomy 20.6M against 10,930 USD; Hotcoin 36.9M against 110,954 USD. Exclude them and the perp total is around 346.7M (my calc).
- Funding at read: Binance 0.0102%, OKX 0.005%, Bybit 0.0051% (positive: longs pay).
- Spot venues by 24h volume (CoinGecko tickers, 20:03 UTC): PancakeSwap Infinity CLMM on BNB Chain 15.4M · Upbit KRW 12.6M · Bybit 2.9M · Bithumb KRW 2.9M · Gate 1.7M · DigiFinex 0.87M · Kraken 0.09M. The two Korean won markets are around 15.4M together, as large as the main DEX pool.

### Pillar 5: Who is behind it and who backs it

- **Funding (project press release, Chainwire, dateline "San Francisco, USA, 24th October 2025"):** "$7 million" strategic round, led by "Animoca Brands and UOB Ventures", with "10K Ventures, Signum Capital, Morningstar Ventures, Serafund, Undefined Labs, and Sonic Foundation". Quote: Colin Ho, Co-founder and CEO: "Every payment in Web3 deserves the same clarity and compliance standards as traditional finance." The release describes Pieverse as "a Web3 startup focused on building payment and compliance infrastructure". (https://decrypt.co/345821/pieverse-secures-7-million-in-strategic-funding-round-led-by-animoca-brands-and-uob-ventures, read 2026-11-11). Note what the money was raised FOR: payments and compliance, not chat-app agents.
- **Binance MVB:** the same release: backed by "Binance's Most Valuable Builder (MVB) Season 9 program"; the whitepaper: "Recognized by Binance MVB 9". An accelerator cohort, not an investment amount.
- **Earlier funding:** IQ.wiki says total funding reached 10M after a 3M round, citing the project's Medium (https://iq.wiki/wiki/pieverse, read 2026-11-11). Secondary; the Medium post was not opened. [VERIFY], see section 4.
- **Valuation and investor price:** NOT disclosed in the release. A figure of 0.06667 USD per token for investors circulates (Coin Edition via cryptoticker); third-hand, do-not-air.
- **Team:** Pillar 1. Only the CEO has a full name in a primary source.
- **Partners, graded (a pilot is a pilot, a logo is a logo):**
  - Named in the 17 Mar 2026 paid release as integrations: "BNB Chain, Aster, PancakeSwap, and FourMeme, plus and more" (CoinDesk copy). Project claim.
  - Home page logo groups: chat apps LINE, KakaoTalk, Telegram; harnesses Claude, Codex, OpenClaw, Hermes; "Skill partners" PancakeSwap, Four.Meme, Bitget Wallet, Kraken; "Chains & payments" BNB Chain, Base, "APP · OKX", "x402 · Coinbase", "AP2 · Google". Project claim. None of LINE, Kakao, Coinbase, Google, Kraken or OKX was found confirming a partnership in its own words (not searched exhaustively; none surfaced). Supporting x402 (an open protocol from Coinbase) or AP2 (a protocol from Google) is NOT a partnership with Coinbase or Google. Running inside LINE or Kakao as a chat bot is NOT a partnership with LINE or Kakao.
  - "Built with OpenSea" (home page, Skill Store line): project claim, no OpenSea source found.
  - BNB Chain: the token launched through Binance Wallet (primary, Binance announcement) and the project was in Binance's MVB program (project claim in a press release). A BNB Chain X post announcing the x402b facilitator exists in search results (x.com/BNBCHAIN/status/1983096402201981043) but was not opened: [VERIFY].
- **Press the project lists** (https://www.pieverse.io/press): Forbes mention 29 Mar 2026 (not opened, 403); CoinDesk 17 Mar 2026 (a paid release); Chainwire 19 Dec 2025 "Agentic Neobank"; RootData Dec 2025; Decrypt 24 Oct 2025 (the Chainwire funding release).

### Pillar 6: Risks and what to watch (as LINES for the chapters, not a section)

Each is one sourced line the strategist can place inside the chapter it belongs to.
- **The unlock (CH4):** team and investor tokens start unlocking 14 Nov 2026, and around 33M tokens a month become available after that on the tracker's schedule (Pillar 4). [VERIFY]
- **Float (CH4):** around 27% to 31% of the supply is circulating; FDV is 1.61B against a 443M to 484M market cap (section 5).
- **Concentration (CH4 or CH5):** four Ethereum wallets hold 56.6% of the supply; seven 2-of-3 multisigs hold 67.35% (on-chain verified, Pillar 4). Normal for a token one year past TGE with long vesting, and it means the schedule is kept by signers, not by a contract, as far as the reads show.
- **Product vs token (CH3):** the product publishes no agent, subscriber or revenue number; the one counter it publishes is 99.9% a mirrored outside catalog; paid skill installs total 1 (Pillar 3).
- **The pivot (CH2):** three framings in around a year; the 7M was raised for payments and compliance (Pillars 1 and 5).
- **Leverage (CH4):** perp volume is 7x to 18x spot volume across 31 venues (Pillar 4).
- **Custody (CH2):** "Pieverse handles wallet creation, seed phrase custody, and setup": the agent's keys sit in Pieverse-run secure hardware, not with the user (home page, docs).
- **Trigger to watch:** Pillar 3, sweep step 8.

### Pillar 7: where it stands (the dated timeline)

| Date | Event | Source (read 2026-11-11) |
|---|---|---|
| 2025-03-11 | GitHub org `Pieverse-Eng` created | https://api.github.com/orgs/Pieverse-Eng |
| 2025-08-29 | Binance announces the Pieverse Pre-TGE and Booster Program on Binance Wallet | Binance announcement (URL in Pillar 4) |
| 2025-09-01 | Booster Program starts, 09:00 UTC | same |
| 2025-10-24 | 7M strategic round announced (Animoca Brands, UOB Ventures) | Decrypt copy of the Chainwire release |
| 2025-10 (late) | x402b facilitator reported live on BNB Chain | search result of a BNB Chain X post, not opened [VERIFY] |
| 2025-11-08 | Token model published: 1B supply, the five allocations, 12-month lock for team, advisors, investors | PANews via KuCoin flash (secondary) |
| 2025-11-10 | Whitepaper v1.0 issued | https://www.pieverse.io/whitepaper |
| 2025-11-14 | TGE; Binance Alpha 11:00 UTC; Binance Futures perp 11:30 UTC; all-time low 0.119363 at 13:01 UTC | bloomingbit (secondary); CoinGecko API |
| 2025-11-24 | Bithumb KRW market | search results only [VERIFY] |
| 2025-12-19 | "Agentic Neobank" release (Chainwire) | https://www.pieverse.io/press (the project's own listing; the release was not opened) |
| 2026-03-16 | First Skill Store rows created; `purr-cli` repo created | `research/telemetry-*.json`; GitHub API |
| 2026-03-17 | Purr-Fect Claw announced, dateline Seoul; the Skill Store described as "coming soon" in it | https://www.coindesk.com/press-release/2026/03/17/pieverse-launches-purr-fect-claw-the-first-on-chain-openclaw-infrastructure-for-line-kakao-whatsapp (paid release) |
| 2026-04-20 | Upbit lists PIEVERSE (KRW, BTC, USDT) at 16:00 KST; daily print 1.184, volume 245.5M | bitcoinsistemi (secondary); CoinGecko series |
| 2026-05-14 | Foundation Reserve cliff ends (tracker terms) | app.tokenomics.com [VERIFY] |
| 2026-07-04 | Public read-only discovery API, version "2026-07-04" | https://www.pieverse.io/openapi.json |
| 2026-11-09 | All-time high 2.23 at 18:57 UTC (CoinGecko); 2.22 (CoinMarketCap) | CoinGecko API; CoinMarketCap page |
| 2026-11-14 | 12-month cliff for Team & Advisors and Investors ends | tracker + secondary [VERIFY] |
| 2028-11-14 | Final unlock on the tracker's schedule | app.tokenomics.com [VERIFY] |

**Shipped vs planned (one-line ledger for the close):**
- SHIPPED: the token on two chains (2025-11-14); Binance Alpha, Binance Futures, Bithumb, Upbit and other markets; paid Purr-Fect Claw plans; the Skill Store (74,195 listings, 30 native); public docs and the `purr` CLI; a read-only public API.
- IN PROGRESS, in the project's own words: "Live agent payments: deferred"; "api.pieverse.io execution APIs: deferred"; "Mutating MCP tools and product MCP Apps: deferred"; the fiat gateway is listed on the home page as a feature while the Dec 2025 release coverage called it planned (secondary).
- PLANNED / on the whitepaper roadmap with no evidence found either way: the Pieverse DAO (2026 Q2), "Enterprise-grade compliance features" (2026 Q3), "Strategic partnerships with major accounting and audit firms" (2026 Q4). Not searched exhaustively: Open question 6.

### Pillar 8: Addendum 2026-11-12 (coin-research update: what holding the token earns, the event window, recent posts)

_Added after Mike compared this run with another creator's Pieverse video (published 2026-11-10; used as a LEAD only, never named on air). Every item below was read by the researcher; where it could not be reproduced it says so. Raw files: `research/page-staking-guide.txt`, `research/snapshot-pieverse.json`, `research/event-window-derivs.json`, `research/staking-page.html`._

**A. What holding the token earns (coin-research row 13)**

- **Staking (project's own words).** Live page https://www.pieverse.io/staking, meta description: "Stake PIEVERSE, earn daily XP, and compare Human and Purr-Fect Claw staking." (HTTP 200, 2026-11-12; the app itself is client-rendered). Official guide https://pieverse.notion.site/Pieverse-Staking-User-Guide-3c9cee2fa0e080b4bfe6dab45240cfc7 (Notion, created 2026-08-27 01:45 UTC, last edited 2026-08-27 04:58 UTC, read 2026-11-12). It says:
  - Networks: Ethereum and BNB Chain. Terms: 90, 180 or 365 days. "Early and partial withdrawals are not supported." A matured position must be withdrawn by hand.
  - Two methods, "Human Staking" and "Purr-Fect Claw Staking" (the agent prepares the transaction; the user still signs). Both earn "daily XP"; the agent method earns "10% more daily XP". "Daily XP = Amount staked x Applicable combined multiplier". The multiplier tables are in blocks the page API did not return as text: the exact multipliers are NOT READ.
  - One-time Agent benefit, claimable once per user: "Less than 50 PIEVERSE: Starter Agent. 50 PIEVERSE or more: Basic Agent." The benefit lasts as long as the lock. At the 2026-11-11 read price of 1.61, 50 tokens is around 80 USD (my calc). The plans list at Starter 10 USD and Basic 29 USD a month (Pillar 2, pricing.md); that the "Basic Agent" is the 29 USD Basic plan is an inference from the matching tier names [VERIFY].
  - XP: "XP currently reflects your long-term participation and growth with Purr-Fect Claw. Details about XP levels, benefits, and future utility will be announced by Pieverse. Any unconfirmed redemption or benefit information should not be treated as an official commitment."
- **So, the token's first tie to the product is staking for an agent, not paying for one.** The plans are priced and paid in USD (Pillar 2); the docs never mention the token (Pillar 1). Airable: "Staking is live. You lock tokens for 90 to 365 days and earn points, and 50 or more gets you a Basic agent for as long as the lock runs."
- **Total staked / number of stakers:** NOT FOUND (checked: staking page and its 92 script files searched for quoted `/api` or `/v1` staking endpoints, none; the guide; Snapshot; no staking contract address located on the Ethereum or BNB Chain token pages; no DefiLlama entry, Pillar 3). Do not air any staked total.
- **Governance (Snapshot space "Pieverse Governance", `pieverse-snapshot.eth`, symbol vPIEVERSE, Ethereum, strategy `erc20-balance-of` on the token contract, read 2026-11-12 via https://hub.snapshot.org/graphql).** 6 proposals in total, 2,001 votes across all of them, 5 followers of the space. Voting weight comes from Ethereum balances only.

| Proposal | Voting | Votes | Total weight | Result |
|---|---|---|---|---|
| PIP-1 Foundation Mission Statement | 2026-04-17 to 2026-04-30 (a first copy ran 2026-04-01 to 04-30, 4 votes) | 286 | 37,184 | For 100% |
| PIP-2 Foundation Governance Principles | 2026-05-01 to 2026-05-14 | 245 | 31,536 | For 100% |
| PIP-3 Pieverse Protocol: Full Commitment to an Agent-Native Future | 2026-06-24 to 2026-07-15 | 168 | 25,010 | For 100% |
| PIP-4 Advancing Agent-Native Global Markets Through Purr-Fect Claw | 2026-07-26 to 2026-08-09 | 168 | 25,010 | For 100% |
| PIP-5 Establishing the Pieverse Staking Program and Reward Model | 2026-08-08 to 2026-10-08 | 1,130 | 169,871 | Token Rewards first (see T12) |

  - Observations: no proposal has an Against or Abstain vote. PIP-3 and PIP-4 show identical totals (168 votes, 25,009.9). The largest turnout, PIP-5, is under 0.02% of the 1B supply (my calc: 169,870.5 / 1,000,000,000), against 56.6% held by four Ethereum wallets (Pillar 4). Quorum is 0 on PIP-4 and PIP-5. PIP-4 and PIP-5 were submitted from the same address (`0x3cf4...60eF`); whether it is a Foundation wallet was not checked.
  - **PIP-5 text** (voting closed 2026-10-08): the options are "Token Rewards" ("Tokens released under the existing token-unlock schedule may be designated and distributed as staking rewards"), "Platform Revenue" ("Eligible revenue generated by the Pieverse platform may be allocated to staking rewards. This includes service fees collected by Pieverse when users trade through integrated venues such as Hyperliquid, as well as transaction fees, instance purchases, and other applicable platform charges"), "Platform Perks" (free instance vouchers, AI credits, fee rebates, airdrops) and "Governance Voting Power" ("Stakers who commit their tokens for six months or longer may receive enhanced voting power"). So the project itself names trading-fee and instance-purchase revenue as a possible reward pool; no amount of that revenue is published anywhere checked (Pillar 3).
  - **What happened after the vote:** the staking guide was last edited 2026-08-27, BEFORE voting closed, and still describes XP and the Agent benefit. A token-reward announcement after 2026-10-08: NOT FOUND (checked: the guide's edit date; the staking page meta text; Snapshot, no later proposal; web search "Pieverse staking rewards" returned the guide and third-party explainers only; X not readable, see C). Say only what is on record: the vote closed with Token Rewards on top, and the staking pages describe points.
  - **PIP-4** (voting ended 2026-08-09) declares "Purr-Fect Claw shall serve as Pieverse's primary Agent Trading Terminal" across crypto, tokenized equities, commodities, FX and prediction markets. It is a declaration of direction, not a shipped product; Hyperliquid and Lighter are among the 32 built-in skills today (Pillar 3). Whether a trading terminal has been released: NOT FOUND (checked: home page, docs, skill store list, web search "Pieverse trading desk").
- **Secondary claims NOT to air:** "one token, one vote" and "hold PIEVERSE to earn yield" appear in third-party explainers (search results, not opened); the whitepaper says the token is for governance, staking and discounts (5.2), which is a plan, not a reward rate.

**B. The event window around the 2026-11-09 all-time high (coin-research row 5, event window rule)**

All series read 2026-11-12. Venues READ: Upbit, OKX swap, Gate futures, CoinGecko. Venues NOT readable from this machine: Binance futures (HTTP 451, "restricted location"), Bybit (HTTP 403, CloudFront country block).

| Item | Number | Source / method |
|---|---|---|
| Upbit KRW-PIEVERSE, value traded per UTC day | 1 Nov 0.31B · 2 Nov 0.73B · 3 Nov 5.05B · 4 Nov 0.85B · 5 Nov 6.66B · 6 Nov 6.52B · 7 Nov 4.97B · 8 Nov 3.03B · **9 Nov 53.82B** · 10 Nov 53.46B · 11 Nov 17.48B · 12 Nov 5.23B (partial day) KRW | Upbit `candle_acc_trade_price` |
| Upbit close, 8 Nov to 9 Nov | 1,973 to 2,741 KRW (+38.9%, my calc) | same |
| Day-over-day multiple, value traded, 8 to 9 Nov | **17.8x** (53.82 / 3.03, my calc) | same |
| The high | 2.2501 USDT in the 19:00 UTC hour of 9 Nov (OKX swap); CoinGecko prints 2.23 at 18:57 UTC | OKX hourly candles |
| The drop right after | low 1.9218 in the 20:00 UTC hour, **14.6% below the high within about 2 hours** (my calc) | OKX hourly candles |
| Busiest hour | 16:00 UTC on 9 Nov, 26.3M USDT of swap volume | OKX hourly candles |
| OKX swap open interest, USD, daily points | 3 to 8 Nov: 4.4M to 6.2M · peak 11.8M · then 10.6M, 7.2M, 7.1M by 12 Nov | OKX `open-interest-volume`, ccy PIEVERSE (nearly doubled into the peak, my calc 11.79 / 6.23) |
| Funding, OKX | 0.005% per 4-hour period, 0.03% a day, every day from 28 Oct to 12 Nov (two days 0.021%) | OKX `funding-rate-history` |
| Funding, Gate | 0.01% per 8-hour period (the cap), so 0.03% a day or a little below it; no day above 0.03% from 28 Oct to 12 Nov (lowest day 0.0014%, 29 Oct) | Gate `funding_rate` |

- **Reading it:** the run was Korean cash first (Upbit prices in won, and Upbit trades it against KRW, BTC and USDT, Pillar 4), with leveraged volume on top. Funding on the two readable perp venues did NOT spike. The other creator's video quotes Binance funding of around 0.6% a day and Binance futures volume of around 17x; those are Binance figures and **could not be reproduced here** (Binance blocked). Do not air a funding spike. Airable: the Upbit multiple and the size of the drop, with the venue named.
- **Cause:** NOT FOUND, unchanged (no dated primary source names one). Flows show who traded, not why.
- **Peak-hour stack (for a card):** hour-by-hour OKX prints are in `research/event-window-derivs.json` (`okx_candles_1h_nov9_10`).

**C. The project's own recent posts (coin-research row 14)**

NOT FOUND for the last 30 days of X posts (checked: Claude in Chrome extension not connected on 2026-11-12; X's public syndication timeline `syndication.twitter.com/srv/timeline-profile/screen-name/pieverse_io` returned HTTP 429 rate limit; web searches "Pieverse trading desk" and "Pieverse announcement November 2026" returned nothing newer than the 30 Apr 2026 DGrid AI item; pieverse.io/press lists nothing newer than the Forbes mention of 29 Mar 2026; the staking guide and the Snapshot space carry no 2026-11 post). The other creator's video says the project's last post came 3 days before the run and was about a product not yet out, and that a trading desk for the agent has no date: **not verified**, do not air. Re-try with the Chrome extension connected before recording.

### Coin-research dossier map (the 14 rows, where each is covered)

| # | Row | Where | Status |
|---|---|---|---|
| 1 | Market snapshot | section 5 | done, timestamped |
| 2 | What it is + self-contradictions | Pillar 1 | done, 5 contradictions listed |
| 3 | Tokenomics + unlocks | Pillar 4 | allocation primary; vesting lengths and unlock size secondary and in conflict |
| 4 | On-chain facts | Pillar 4 | done by direct read; owner powers not read |
| 5 | Derivatives + liquidity | Pillar 4 | done; DEX pool depth in USD not read (volume only) |
| 6 | Listings history | Pillar 4 | Binance Wallet primary; others secondary; several dates NOT FOUND with checked-list |
| 7 | Team, operator, backers | Pillars 1 and 5 | done; registry record NOT FOUND with checked-list |
| 8 | Product telemetry | Pillar 3 | sweep run in full, raw JSON saved |
| 9 | News + catalysts | Pillar 7 timeline + Pillar 4 price notes | done; November cause not established |
| 10 | Peers | section 5 | 2 peers, researcher's pick, flagged |
| 11 | Risks + do-not-air | Pillar 6 + section 4 | done |
| 12 | Conflicts list | below | done |
| 13 | What holding the token earns | Pillar 8 A | done: staking terms, XP, Agent benefit, PIP-1 to PIP-5; total staked NOT FOUND with checked-list |
| 14 | The project's own recent posts | Pillar 8 C | NOT FOUND with checked-list (X not readable 2026-11-12); re-try with the Chrome extension connected |

**Conflicts list (every figure two sources disagree on):**

| Figure | Value A | Value B | Value C |
|---|---|---|---|
| Circulating supply | 274,750,000 (CoinGecko) | 300.35M (CoinMarketCap) | 309,500,000 (project API) |
| Market cap | 442.7M (CoinGecko) | 484.14M (CoinMarketCap) | |
| Rank | 112 (CoinGecko) | 85 (CoinMarketCap) | |
| 24h spot volume | 25.0M (CoinGecko) | 63.8M (CoinMarketCap) | |
| All-time high | 2.23, 2026-11-09 (CoinGecko) | 2.22, Nov 09 2026 (CoinMarketCap) | |
| All-time low | 0.119363 (CoinGecko) | 0.1145 (CoinMarketCap), both 2025-11-14 | |
| 14 Nov 2026 unlock | 33,411,329 tokens (app.tokenomics.com) | around 86.4M tokens (CoinMarketCap via cryptoticker) | |
| Investor vesting after cliff | 18 months (app.tokenomics.com) | "about 15 months" (Bitrue blog) | one sixth in the first tranche (CoinMarketCap via cryptoticker) |
| Lead of the 7M round | Animoca Brands and UOB Ventures (press release) | "UOB Venture Management" (IQ.wiki wording) | a funding database lists Undefined Labs as lead (search result, not opened) |
| What Pieverse is | AI agents for chat apps (home page) | agent payment stack, x402b (whitepaper, CoinMarketCap) | compliance invoices + Time Economy (litepaper, CoinGecko "TimeFi") |
| Agent payments | "Shipped, not announced" (home page) | "deferred" (llms.txt, same domain) | |
| Chat apps | Line, Kakao, WhatsApp (17 Mar 2026 release) | LINE, KakaoTalk, Telegram (home page today) | |
| What staking pays | Daily XP points plus a one-time Agent benefit (staking guide, live staking page meta) | "Stake for yields", "platform yield rewards" (whitepaper 5.2 and third-party explainers) | PIP-5 puts Token Rewards first among 4 options, no decision on record |
| Funding rate during the 9 Nov run | around 0.03% a day (OKX and Gate, read) | around 0.6% a day (another creator, Binance, not readable here) | |

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Pieverse** (X: @pieverse_io) | The project. Token ticker PIEVERSE. Site https://www.pieverse.io/ | home page; CoinGecko API links block; whitepaper contact block |
| **Pieverse Technology Limited** | Entity named as developer in the site footer | https://www.pieverse.io/press ("Developed by Pieverse Technology Limited.") |
| **Pieverse Foundation** (X: @pieverse_fdn) | Named as managing governance | whitepaper 7.2 |
| **Colin Ho** | Co-founder and CEO | Decrypt copy of the 24 Oct 2025 release; whitepaper gives "Colin (Co-founder & CEO)" |
| **David** (surname not in a primary source) | Co-founder and CMO | whitepaper 7.1 |
| **Alice**, **Albert**, **Alina** (first names only) | Head of BD; Tech Lead; Head of Ecosystem | whitepaper 7.1 |
| **Animoca Brands**, **UOB Ventures** | Co-leads of the 7M strategic round, 24 Oct 2025 | the release |
| **10K Ventures, Signum Capital, Morningstar Ventures, Serafund, Undefined Labs, Sonic Foundation** | Co-investors in that round | the release |
| **Binance MVB Season 9** | Accelerator program Pieverse says it was part of | the release; whitepaper |
| **Binance Wallet / Binance Alpha** | Where the token launched (Pre-TGE announced 2025-08-29; Alpha trading 2025-11-14) | Binance announcement (primary); bloomingbit (secondary) |
| **Upbit**, **Bithumb** | Korean exchanges with KRW markets for PIEVERSE (2026-04-20; 2025-11-24 [VERIFY]) | Pillar 4 |
| **Purr-Fect Claw** | The hosted agent product (hyphenated, capital P, F, C, as on the home page; the docs also write "Purr-fect Claw") | home page; docs |
| **Skill Store** / "Purr-Fect Skill Store" | The skill marketplace | home page |
| **purr** | The CLI that gives an agent its wallet | docs |
| **x402b**, **pieUSD** | The whitepaper's payment protocol and wrapped USDT | whitepaper 2.1 |
| **OpenClaw**, **ClawHub** | The open agent runtime Purr-Fect Claw is built around; the outside skill hub the store mirrors | home page; Skill Store API (`source: clawhub`, clawhub.ai URLs) |
| **LINE**, **KakaoTalk** | The chat apps the home page leads with (the title writes "Line & Kakao") | home page |

Terminology for captions/graphics: **Pieverse** (one word, capital P only), ticker **PIEVERSE** (no cashtag sign in a screenplay), **Purr-Fect Claw**, **Skill Store**, **x402b** (lowercase x, lowercase b), **pieUSD**, **BNB Chain** (not "BSC" on screen), **Ethereum**, **TEE** (say "secure hardware" once, then TEE), **TimeFi**, **Binance Alpha**, **Animoca Brands**, **UOB Ventures**, **Upbit**, **Bithumb**. Money on screen: K / M / B with no dollar sign (1.61B FDV). No em dashes.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "74,000 skills" / "25,000 merchants on Pieverse's marketplace" as traction | The product's own API shows 74,133 of 74,195 are mirrored from ClawHub; 30 are native; merchants include the mirrored publishers (Pillar 3) | "The store lists around 74 thousand skills, and almost all of them are imported from an outside catalog. 30 were published on Pieverse itself." [VERIFY] |
| "491,522 installs" (or any six-figure install count) as Pieverse usage | Belongs to a mirrored ClawHub listing; larger than the token's holder count; native skills total 24 installs | Do not cite an install total. "Native skills show a couple dozen installs." |
| "240M+ users" | Home page: "240M+ users across Asia" is the audience of Line and Kakao, not Pieverse users | "It runs inside chat apps that have a huge user base in Asia." No number attached to Pieverse. |
| "500,000 transactions in the first week" (x402b) | Launch-era exchange-blog coverage, not opened, not primary, unaudited, a year old | Say the payment volume is not published. |
| "Over 5M in on-chain volume" | Litepaper, undated, pre-token "Binance Alpha Time Challenge" campaign volume; not revenue, not the current product | Leave out, or "an early campaign the litepaper cites", with no figure as traction. |
| "Partnered with Coinbase / Google / OKX / Kraken / Binance / LINE / Kakao / OpenSea" | Logos, protocol support and built-in skills on the project's own pages; no counterparty source found (Pillar 5) | "It supports x402, the payment standard that came out of Coinbase", "it has built-in skills for exchanges like Kraken". Name as partners only the round's investors and what Binance itself announced. |
| "Forbes featured / endorsed Pieverse" | Forbes page returned 403; the only source is Pieverse's press page, which itself says "mentioned" | Leave out. |
| "Listed on Binance" | Binance Wallet Pre-TGE, Binance Alpha and Binance Futures only; no Binance spot ticker at read | "It launched through Binance's wallet and trades on Binance Alpha and Binance Futures." [VERIFY] |
| "First TEE-based keyless agent wallet", "First agent skill marketplace", and the other four "First" claims | Home page superlatives, unverified and unverifiable in the time available | "The project calls it a first." or describe the feature without the superlative. |
| "Agents pay each other on Pieverse today" / "Shipped, not announced" | The project's own llms.txt: "Live agent payments: deferred" | "Agent-to-agent payments are documented and being built; the project's own files don't claim them as live." |
| One exact size for the 14 Nov 2026 unlock ("86 million tokens" or "33 million tokens" or any dollar value such as "32.5M", "100M", "178M") | Two trackers disagree (33.4M vs 86.4M); dollar values in headlines were computed at older prices; no official schedule opened | "The 12-month lock on team and investor tokens ends November 14th, 2026, and trackers put the first release somewhere from around 33 million to around 86 million tokens." [VERIFY] |
| "Circulating supply is exactly X" | Three live figures: 274.75M, 300.35M, 309.5M | "Around 27 to 31 percent of the supply is circulating, depending on who is counting." |
| "Investors paid 0.0667 a token" / "valuation of ..." | Third-hand (Coin Edition via cryptoticker); not in the press release | Leave out. "The round's price wasn't disclosed." |
| "Total funding 10M" / "a 3M round" | IQ.wiki citing a Medium post that was not opened | "A 7 million dollar strategic round in October of 2025." |
| "25 whales control 96.73%" | Third-party article (search result, not opened); counts exchange, pool and vesting wallets together | Use the on-chain read: "four wallets hold around 57 percent, and they're team-controlled multisigs holding the locked supply." |
| "The November pump was caused by X" | Coverage itself says the trigger "remains unclear"; no primary cause found | State the move and its date; no cause. |
| A co-founder named "Junjia (Tim) He" | Only IQ.wiki citing RootData; not in the whitepaper or releases | Name Colin Ho only. |
| "Purr-Fect Claw works in WhatsApp" | In the March 2026 release; not on the home page at read | "Line and Kakao", plus Telegram as the home page lists it. |
| Any price target, or "will" language about the token after the unlock | Persona: verified claims only, conditional language, no targets | "CAN", "if", "the number to watch". |
| Perp volume totals that include Deepcoin, Biconomy, Hotcoin | Volume to open-interest ratios in the thousands (Pillar 4) | Use the Binance Futures figures, or "several times spot". |
| "Funding is at 0.6% a day" / "futures volume 17x the day before" / "open interest up 27%" (another creator's Binance figures) | Binance is unreadable from here (HTTP 451); OKX and Gate funding stayed at 0.03% a day through the move | Name the venue and use only what was read: the Upbit multiple (17.8x), the 14.6% fall on OKX. |
| "The community voted for token rewards and the team ignored it" | PIP-5 closed with Token Rewards on top, but the staking pages describe XP and no later decision was found; causes and intent are not on record | "The vote closed with token rewards on top. The staking pages I read pay points." |
| "XP will be convertible / will be an airdrop" or any XP value | The guide says future utility "will be announced" and unconfirmed redemption information is not an official commitment | "Points, and the project says what they are for will be announced." |
| "Staking gets you a free agent worth 29 dollars a month" as a flat fact | The Basic Agent = Basic plan link is an inference from tier names; the benefit is once per user and lasts only as long as the lock | "50 or more gets you a Basic agent for as long as the lock runs." [VERIFY] |
| "Pieverse is launching a trading desk" with a date | PIP-4 is a declaration of direction; no release, date or live terminal was found | "A governance vote in July and August called Purr-Fect Claw the project's trading terminal for agents. I didn't find a release." |

---

## 5. Market snapshot

Pulled **2026-11-11 20:04 UTC** from https://api.coingecko.com/api/v3/coins/pieverse (saved `research/coingecko-coin.json`), with CoinMarketCap read at around **2026-11-11 20:13 UTC** from https://coinmarketcap.com/currencies/pieverse/, the project API at **20:10 UTC**, on-chain at **20:12 UTC**, derivatives and peers at **20:14 UTC**. All [VERIFY] at record time and at render. The 14 Nov 2026 unlock lands between this read and any realistic record date, so every supply figure here is expected to move.

| Figure | Value at read | Note |
|---|---|---|
| Price | 1.61 USD | CoinGecko and CoinMarketCap agree [VERIFY] |
| 24h change | -11.0% | CoinGecko (CoinMarketCap -11.03%) [VERIFY] |
| 7d / 14d / 30d / 60d / 200d change | +35.8% / +54.1% / +28.9% / +32.3% / +116.8% | CoinGecko [VERIFY] |
| 24h high / low | 1.92 / 1.60 | CoinGecko [VERIFY] |
| Market cap | 442,686,292 USD (CoinGecko) · 484.14M (CoinMarketCap) | conflict: different circulating supply [VERIFY] |
| FDV | 1,611,233,093 USD (CoinGecko) · 1.61B (CoinMarketCap) | [VERIFY] |
| Market cap / FDV | 0.27 (CoinGecko) · 0.30 (CoinMarketCap, my calc) | [VERIFY] |
| Rank | 112 (CoinGecko) · 85 (CoinMarketCap) | conflict [VERIFY] |
| 24h spot volume | 25,049,208 USD (CoinGecko) · 63.8M (CoinMarketCap) | conflict [VERIFY] |
| Circulating supply | 274,750,000 (CoinGecko) · 300.35M (CoinMarketCap) · 309,500,000 (project API) | conflict; video uses CoinGecko and says the range [VERIFY] |
| Total / max supply | 1,000,000,000 | primary (whitepaper) + on-chain; not drifting |
| All-time high | 2.23 on 2026-11-09 18:57 UTC (CoinGecko) · 2.22 on Nov 09 2026 (CoinMarketCap) | -27.7% from ATH at read [VERIFY: a new high resets it] |
| All-time low | 0.119363 on 2025-11-14 13:01 UTC (CoinGecko) · 0.1145 on Nov 14 2025 (CoinMarketCap) | +1,250% from ATL at read (CoinGecko) |
| Holders | BNB Chain 348,762 · Ethereum 62,666 · total 411,428 | Binplorer / Ethplorer; CoinMarketCap 411.21K [VERIFY] |
| Supply per chain | Ethereum 909,309,478.63 · BNB Chain 90,690,521.37 | on-chain (verified) [VERIFY] |
| Top 4 Ethereum wallets | 566,000,000 (56.6% of supply) | on-chain (verified) [VERIFY: expected to change at the unlock] |
| Tokens in seven 2-of-3 Safes (Ethereum top 9) | 673,500,000 (67.35%) | on-chain (verified), my sum [VERIFY] |
| Perp venues / 24h perp volume / open interest | 31 / around 464.2M USD / around 78.8M USD | CoinGecko derivatives; includes non-credible venues [VERIFY] |
| Binance Futures PIEVERSEUSDT | 59.6M volume, 21.4M open interest, funding 0.0102% | CoinGecko derivatives [VERIFY] |
| Next unlock | 14 Nov 2026: 33,411,329 tokens (tracker) or around 86.4M (CoinMarketCap via cryptoticker) | conflict, secondary [VERIFY] |
| Unlock value at 1.61 | around 53.8M USD or around 139M USD | my calc [VERIFY] |
| Monthly release after 14 Nov 2026 | around 33.4M tokens, around 53.8M USD at 1.61 | my calc from tracker terms [VERIFY] |
| Skill Store: skills / merchants / categories | 74,195 / 25,233 / 14 | project API, 20:10 UTC [VERIFY] |
| Skill Store: mirrored / builtin / native | 74,133 / 32 / 30 | project API, 20:12 UTC [VERIFY] |
| Skill Store: priced skills / paid installs / native installs | 5 / 1 / 24 | project API, 20:12 UTC [VERIFY] |
| Purr-Fect Claw plan prices | 10 / 29 / 49 / 99 / 279 USD a month | pricing.md; a price list, slow-drifting [VERIFY] |
| GitHub: public repos / most stars | 11 / 39 (`purrfect-agent`) | GitHub API [VERIFY] |
| CoinGecko watchlist users | 2,384 | CoinGecko API [VERIFY] |

**Peers (same call, https://api.coingecko.com/api/v3/coins/markets, 2026-11-11 20:14 UTC). The peer set is the researcher's pick (AI-agent tokens with a product), not from the brief; use only if the strategist wants a comparison, and it is not one of the two animated charts by default.**

| Token | Price | Market cap | FDV | 24h volume | Rank | 7d | 30d |
|---|---|---|---|---|---|---|---|
| Pieverse (PIEVERSE) | 1.61 | 442.0M | 1,608.7M | 24.9M | 112 | +35.5% | +28.0% |
| Virtuals Protocol (VIRTUAL) | 0.538 | 354.3M | 538.1M | 29.8M | 120 | -9.8% | -24.1% |
| Kite (KITE) | 0.124 | 296.0M | 1,238.0M | 11.7M | 134 | +4.2% | -3.5% |

FDV ratios (my calc): PIEVERSE / VIRTUAL = 1,608.7 / 538.1 = around 3.0x; PIEVERSE / KITE = 1,608.7 / 1,238.0 = around 1.3x. PIEVERSE was up over 7 and 30 days while both peers were flat to down. [VERIFY]

---

## 5a. Record-day read 2026-11-14

Re-pull of every live-drift figure on the day Mike recorded, which is also the day the 12-month lock ends. Every read below was taken between **18:27 and 19:10 UTC (13:27 and 14:10 ET; ET is Eastern Standard Time, UTC-5) on 2026-11-14**, and each row carries its own read time. The recording itself ran 13:49:36 to 14:18:15 UTC (08:49:36 to 09:18:15 ET; raw file `2026-11-14 08-49-36.mkv`, 1719 s). Raw responses are saved in `research/`, every file named `*-2026-11-14.*`. Sections 1 to 5 and the pillars are untouched and remain the 2026-11-11 read. Labels as elsewhere: "my calc" = arithmetic with the method shown, "on-chain (verified)" = read from the contracts through a public RPC by the researcher. Every figure stays [VERIFY] until render. Rows whose last column says CONFLICT need a ruling before a card is built: see the notes under the table.

| Figure | 11 Nov read | 14 Nov read | Read time (UTC, and ET) | Source URL | Moved? |
|---|---|---|---|---|---|
| Price, live read (D9, C2 last point) | 1.61 USD | **1.81 USD** (CoinGecko 1.81; CoinMarketCap 1.81, unrounded 1.8068). A second CoinGecko read at 18:57:53 UTC printed 1.81 again (1.8076) | CoinGecko 18:27:20 UTC (13:27:20 ET), data stamp 18:26:42 UTC · CoinMarketCap 18:29:54 UTC (13:29:54 ET), data stamp 18:26:48 UTC | https://api.coingecko.com/api/v3/coins/pieverse (`research/coingecko-coin-2026-11-14.json`) · https://coinmarketcap.com/currencies/pieverse/ (`research/cmc-detail-2026-11-14.json`, `cmc-page-2026-11-14.txt`) | MOVED: +12.4% on the 11 Nov read (my calc). CONFLICT with the spoken 1.78: note 1 |
| Price while Mike was recording (D9, C2 last point: the read that matches "at the time of this recording") | not applicable | **1.76 to 1.78**: CoinGecko's 5-minute prints inside the recording are 1.7687 (13:50 UTC) · 1.7726 (13:55) · 1.7634 (14:00) · 1.7706 (14:05) · 1.7744 (14:10) · 1.7764 (14:15, rounds to 1.78) | series pulled 18:27:48 UTC (13:27:48 ET); the points are 13:50 to 14:15 UTC (08:50 to 09:15 ET) | https://api.coingecko.com/api/v3/coins/pieverse/market_chart?vs_currency=usd&days=1 (`research/coingecko-market-chart-1d-2026-11-14.json`) | matches the spoken 1.78 |
| 24h change | -11.0% | +8.4% (CoinGecko +8.40%; CoinMarketCap +8.39%) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ | MOVED (down day became an up day) |
| 7d / 14d / 30d / 60d / 200d change | +35.8% / +54.1% / +28.9% / +32.3% / +116.8% | +28.8% / +75.9% / +53.7% / +58.3% / +147.9%; 1 year +861.7% (the first full year since the first print) | 18:27:20 UTC (13:27:20 ET) | https://api.coingecko.com/api/v3/coins/pieverse | MOVED |
| 24h high / low | 1.92 / 1.60 | 1.90 / 1.63 (CoinGecko). On the UTC day of 14 Nov the 5-minute series ran from 1.64 (00:20 UTC) up to 1.89 (06:00 UTC), was 1.76 to 1.78 during the recording and 1.81 at the read | 18:27:20 and 18:27:48 UTC (13:27 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://api.coingecko.com/api/v3/coins/pieverse/market_chart?vs_currency=usd&days=1 | MOVED |
| Market cap (D9) | 442,686,292 USD (CoinGecko) · 484.14M (CoinMarketCap) | **496,453,374 USD (CoinGecko) · 542,690,240 USD (CoinMarketCap)**. During the recording CoinGecko's own series printed 484.5M to 488.1M (488,075,469 at 14:15 UTC) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET); series points 13:50 to 14:15 UTC | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ · https://api.coingecko.com/api/v3/coins/pieverse/market_chart?vs_currency=usd&days=1 | MOVED: +12.1% on both sites (my calc) |
| FDV (D9) | 1,611,233,093 USD (CoinGecko) · 1.61B (CoinMarketCap) | **1,806,927,657 USD (CoinGecko) · 1,806,846,107 USD (CoinMarketCap): 1.81B**. At the 14:15 UTC print of 1.7764 the FDV is 1.78B (my calc: price x 1,000,000,000 total supply, which is how both sites derive it) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ | MOVED: +12.1%. CONFLICT with the spoken "1.7 billion": note 1 |
| Market cap / FDV | 0.27 (CoinGecko) · 0.30 (CoinMarketCap) | 0.27 (CoinGecko) · 0.30 (CoinMarketCap, my calc 542.69 / 1,806.85) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | same two URLs | no |
| Rank (D9) | 112 (CoinGecko) · 85 (CoinMarketCap) | **99 (CoinGecko) · 76 (CoinMarketCap)**. Neither public API keeps a rank history, so there is no rank for the recording window | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ | MOVED: up 13 places (CoinGecko), up 9 (CoinMarketCap) |
| All-time high (D9, C2 marker 3) | 2.23 on 2026-11-09 18:57 UTC (CoinGecko) · 2.22 on Nov 09 2026 (CoinMarketCap) | **STANDS: 2.23 on 2026-11-09 18:57:20 UTC (CoinGecko) · 2.22 (2.2195) on 2026-11-09 19:19 UTC (CoinMarketCap)**. No new high on 14 Nov: the day's high through the read is 1.89. At the read the price is 18.9% below the high (CoinGecko) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ | no |
| All-time low (C2 marker 1) | 0.119363 on 2025-11-14 13:01 UTC (CoinGecko) · 0.1145 on Nov 14 2025 (CoinMarketCap) | unchanged: 0.119363 on 2025-11-14 13:01:21 UTC (CoinGecko) · 0.1145 (0.11448) on 2025-11-14 18:19 UTC (CoinMarketCap). The read price is 15.2x the low (my calc 1.81 / 0.119363) | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | same two URLs | no |
| Daily price series since the 11 Nov read (C2) | last point 1.61 at 20:04 UTC on 11 Nov (an at-read value, not a daily print) | CoinGecko 00:00 UTC prints: 11 Nov 1.843 · 12 Nov 1.635 · 13 Nov 1.638 · 14 Nov 1.636. The 362 days both pulls share are identical. Today's 365-day pull starts on 2025-11-15, so the first trading day (0.220 on 2025-11-14) exists only in the 11 Nov file; the two are merged, with nothing computed, in `research/coingecko-market-chart-daily-merged-2026-11-14.json` (366 daily prints, no gap, plus the live point and the recording-window points) | 18:27:47 UTC (13:27:47 ET) | https://api.coingecko.com/api/v3/coins/pieverse/market_chart?vs_currency=usd&days=365&interval=daily (`research/coingecko-market-chart-365d-2026-11-14.json`) | new prints |
| Circulating supply (D19) | 274,750,000 (CoinGecko) · 300.35M (CoinMarketCap) · 309,500,000 (project API) | 274,750,000 (CoinGecko, unchanged) · 300,352,220 (CoinMarketCap, unchanged) · **395,883,333 (the project's own API, up by 86,383,333)** | CoinGecko 18:27:20 UTC (13:27:20 ET) · CoinMarketCap 18:29:54 UTC (13:29:54 ET), its supply block stamped 17:52:25 UTC · project API 18:32:14 UTC (13:32:14 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ · https://purr.pieverse.io/api/app/circulating (`research/telemetry-purr-circulating-2026-11-14.json`) | MOVED on the project's own count only. CONFLICT with the spoken "27 to 31%": note 2 |
| Share of the 1,000,000,000 total (D19) | around 27% to 31% (27.5% · 30.0% · 30.95%) | **around 27% to 40%**: 27.5% (CoinGecko) · 30.0% (CoinMarketCap) · 39.6% (the project's own API) (my calc) | as the row above | as the row above | MOVED: the top of the range went from 31% to 40% |
| Total / max supply | 1,000,000,000 | 1,000,000,000 (project API; and the two chains sum to exactly 1,000,000,000.000000 on-chain) | 18:32:14 UTC (13:32:14 ET) · on-chain 18:34 UTC (13:34 ET) | https://purr.pieverse.io/api/app/total-supply · the on-chain row below | no |
| Supply per chain | Ethereum 909,309,478.63 · BNB Chain 90,690,521.37 | Ethereum 909,311,614.57 · BNB Chain 90,688,385.43, on-chain (verified); 2,135.94 tokens crossed to Ethereum since 11 Nov; still 909.3M / 90.7M, around 91% / 9% | Ethereum block 26,415,045 at 18:34:23 UTC (13:34:23 ET) · BNB Chain block 133,592,540 at 18:34:41 UTC (13:34:41 ET) | public RPC `eth_call totalSupply()` on the token `0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9`: https://ethereum-rpc.publicnode.com · https://bsc-rpc.publicnode.com (`research/onchain-eth-read-2026-11-14.json`) | no (the rounded split is unchanged) |
| Holders | BNB Chain 348,762 · Ethereum 62,666 · total 411,428 | BNB Chain 348,698 · Ethereum 62,669 · total 411,367 (my sum); CoinMarketCap prints 411.14K | 18:33:26 UTC (13:33:26 ET); Ethplorer's index is stamped 17:50:30 UTC, Binplorer's 18:33:00 UTC | https://api.ethplorer.io/getTokenInfo/0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9?apiKey=freekey · https://api.binplorer.com/getTokenInfo/0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9?apiKey=freekey | MOVED: 61 fewer (my calc) |
| Top 4 Ethereum wallets (D11) | 566,000,000 (56.6% of supply) | **566,000,000 (56.6%), unchanged to the token**: 166,000,000 · 150,000,000 · 150,000,000 · 100,000,000, on-chain (verified) | Ethereum block 26,415,045 at 18:34:23 UTC (13:34:23 ET) | public RPC `eth_call balanceOf()` on the token, https://ethereum-rpc.publicnode.com (`research/onchain-eth-read-2026-11-14.json`) | no |
| Tokens in the seven 2-of-3 Safes (D11) | 673,500,000 (67.35%) | **673,500,000 (67.35%), unchanged**: 166M · 150M · 150M · 100M · 50M · 30M · 27.5M, on-chain (verified). The other two of the top nine are still plain wallets holding 33M and 30M | same block | same | no |
| Safe thresholds (D11) | `getThreshold() = 2`, 3 owners, on seven of the top nine | **re-verified from the Safe contracts: `getThreshold() = 2` and 3 owners on all seven** (Safe version 1.4.1). New reads on the same seven: no module enabled, no guard set; all seven list the SAME three signer addresses, and one of the three (`0x7a37...4590`) is the address that created the token contract (Ethplorer `creatorAddress`); the five largest (166M, 150M, 150M, 100M, 50M) return `nonce() = 0`, so no transaction has ever been sent from them | thresholds at Ethereum block 26,415,045 (18:34:23 UTC, 13:34:23 ET); owners and nonces at block 26,415,095 (18:44:23 UTC, 13:44:23 ET) | public RPC `eth_call` to each Safe (`getThreshold`, `getOwners`, `getModulesPaginated`, `nonce`) and `eth_getStorageAt` for the guard slot, https://ethereum-rpc.publicnode.com and https://rpc.mevblocker.io (`research/onchain-eth-read-2026-11-14.json`, `onchain-safe-activity-2026-11-14.json`) | no: "2-of-3" stands |
| Who the big wallets are, per CoinMarketCap (new; a third-party label, not an on-chain fact) | not read (11 Nov: "the wallets are unlabeled") | CoinMarketCap lists 10 Ethereum wallets as non-circulating and labels them: `0xdef6...9ef4` 150M and `0x3d4f...c1d4` 50M "Team/Advisors/Contractors" (200M, the size of the 20% team allocation) · `0xa8bc...84dd` 150M "Private Sale investor" (the 15%) · `0x0df0...990e` 100M "Treasury" (the 10% foundation size) · `0x82a4...b441` 166M, `0xef1f...dff0` 30M, `0x053e...fab8` 27.5M "Ecosystem incentives" · `0xf9b1...4f65` 20M "Airdrops/Bounty" · `0x89df...95fd` 6.15M "Marketing/Operations". 1,000,000,000 minus their balances (699,647,780) is exactly CoinMarketCap's circulating 300,352,220 (my calc). All of those balances match the on-chain read | 18:29:54 UTC (13:29:54 ET) | https://coinmarketcap.com/currencies/pieverse/ (`research/cmc-detail-2026-11-14.json`, `supplyDetails.nonCirculatingWallets`) | new read |
| The 14 Nov 2026 unlock, as each schedule lists it (D10) | 33,411,329 (tracker) or around 86.4M (CoinMarketCap, second-hand through cryptoticker) | tracker: **33,411,329 tokens** (3.3% of supply), shown as "Unlock Today" · CoinMarketCap: **86,383,333.33 tokens** (8.64%), now read first-hand from CoinMarketCap's own unlock feed, listed as a past event dated 2026-11-14: Investors 25,000,000 · Foundation Reserve 25,000,000 · Ecosystem & Marketing 19,750,000 · Team & Advisors 8,333,333.33 · Community Growth 8,300,000 | tracker 18:38:48 UTC (13:38:48 ET) · CoinMarketCap feed 18:31:44 UTC (13:31:44 ET) | https://app.tokenomics.com/tokenomics/pieverse/unlocks (`research/tokenomics-unlocks-2026-11-14.txt`, `tokenomics-unlock-events-2026-11-14.json`) · https://api.coinmarketcap.com/data-api/v3/token-unlock/event?cryptoId=38849&type=past (`research/cmc-token-unlock-events-past-2026-11-14.json`) | no: "around 33M to around 86M" stands, and the 86.4M side is no longer second-hand |
| What the project's own number did (D10, D19) | 309,500,000 | 395,883,333: a step of exactly 86,383,333, the size of CoinMarketCap's 14 Nov event. The time of the change is not known; this is the value at the read | 18:32:14 UTC (13:32:14 ET) | https://purr.pieverse.io/api/app/circulating | MOVED |
| What moved on-chain on 14 Nov 2026 (D10, C3) | not applicable | **NOTHING from the team, investor, foundation or ecosystem wallets, as of the read.** From the 11 Nov read (Ethereum block 26,393,994) to block 26,415,049: 0 token transfers out of, and 0 into, the 15 watched wallets (the top 12 Ethereum holders of the 11 Nov read, the two further wallets CoinMarketCap lists as non-circulating, and the token owner Safe). To block 26,415,095: 0 events of any kind from the 11 Safe contracts among them and 0 new token approvals. No transfer of unlock size on either chain on 14 Nov UTC: Ethereum 287 transfers, 4,605,097 tokens in all, largest 2,000,000; BNB Chain 34,379 transfers, 6,861,158 tokens in all, largest 1,100,000. Those two largest transfers (13:13:47 and 13:12:37 UTC) are one Bybit wallet paying another ("Bybit: Hot Wallet" to "Bybit: Hot Wallet 4", Etherscan name tags), not a release. On-chain (verified) | Ethereum transfers to block 26,415,049 at 18:35:11 UTC (13:35:11 ET); Safe events and approvals to block 26,415,095 at 18:44:23 UTC (13:44:23 ET); BNB Chain to block 133,592,772 at 18:36:25 UTC (13:36:25 ET); Etherscan tags 18:37:44 UTC (13:37:44 ET) | public RPC `eth_getLogs` on the token and on the Safes, https://ethereum-rpc.publicnode.com · https://rpc.mevblocker.io · https://bsc-rpc.publicnode.com (`research/onchain-eth-transfers-2026-11-14.json`, `onchain-bsc-transfers-2026-11-14.json`, `onchain-safe-activity-2026-11-14.json`) · https://etherscan.io/address/0xf89d7b9c864f589bbf53a82105107622b35eaa40 (`research/etherscan-labels-2026-11-14.txt`) | nothing moved at read time: say only that, never that tokens were released or sold |
| Supply counted as unlocked once the 14 Nov event is in (C3 marker) | 342.7M (my calc from the tracker's terms) | three values, and none is 342.7M: **395,883,333** (CoinMarketCap's schedule and the project's own API; 309,500,000 before the event) · **364,817,036** (the tracker's own running total; 331,405,707 before the event) · 342.7M is the 11 Nov my-calc figure and matches neither source as read today | 18:31:44 to 18:38:48 UTC (13:31 to 13:38 ET) | https://api.coinmarketcap.com/data-api/v3/token-unlock/event?cryptoId=38849&type=past · https://app.tokenomics.com/tokenomics/pieverse/unlocks | CONFLICT inside C3: note 3 |
| Next unlock after 14 Nov | not applicable | 14 Dec 2026: 33,411,329 (tracker) or 21,633,333.33 (CoinMarketCap: Team & Advisors 8,333,333.33 · Community Growth 8,300,000 · Ecosystem & Marketing 5,000,000) | 18:38:48 UTC (13:38:48 ET) · 18:31:44 UTC (13:31:44 ET) | https://app.tokenomics.com/tokenomics/pieverse/unlocks · https://api.coinmarketcap.com/data-api/v3/token-unlock/event?cryptoId=38849&type=upcoming (`research/cmc-token-unlock-events-upcoming-2026-11-14.json`) | new read |
| Monthly release after 14 Nov 2026 (C3) | around 33.4M tokens a month (tracker terms) | tracker, unchanged, and now read event by event: 33,411,329 a month for 12 months (14 Nov 2026 to 14 Oct 2027), then 27,855,773 a month for 6 months, 19,522,440 once, 14,889,100 a month for 5 months, 6,555,767 on 14 Nov 2028 · CoinMarketCap's schedule is not flat: 21,633,333 on 14 Dec 2026 and 14 Jan 2027, 86,383,333 on 14 Feb 2027, then 16,633,333 in most months with a larger event every third month, last event 14 Oct 2028 | 18:38:48 UTC (13:38:48 ET) · 18:31:44 UTC (13:31:44 ET) | same two URLs | no change on the tracker. Precision flag on "every month until November of 2028": note 4 |
| Unlock value at the read price (no card carries a dollar value) | around 53.8M or around 139M USD at 1.61 | around 60.5M or around 156.4M USD at 1.81 (my calc: 33,411,329 x 1.81; 86,383,333 x 1.81) | 18:27:20 UTC (13:27:20 ET) for the price | the unlock and price rows above | MOVED with the price |
| The 12-month lock, primary source (D10; thesis row T6) | secondary only (PANews through KuCoin) | **PRIMARY, now opened**: Pieverse's own post "Introducing $PIEVERSE Tokenomics" (Medium, dated Nov 7, 2025): "All team, advisor, investor, and core-contributor allocations are subject to a 12-month lockup, followed by linear vesting thereafter." Trading began 14 Nov 2025 (CoinMarketCap `dateLaunched` 2025-11-14; CoinGecko's first print 2025-11-14), so the lockup ends 14 Nov 2026. The post's own unlock chart, measured by pixel against its gridlines (approximate), reads around 396M to 399M at month 12, 632M at month 18, 817M to 820M at month 24 and 951M at month 30: that is CoinMarketCap's schedule (395.9M · 631.7M · 819.0M · 950.0M), not the tracker's (364.8M · 565.3M · 760.2M · 919.0M) | 18:48:38 UTC (13:48:38 ET); chart image 18:49:17 UTC | https://medium.com/@pieverse/introducing-pieverse-307cfae3a76d (`research/medium-introducing-pieverse-tokenomics-2026-11-14.html`, `medium-tokenomics-unlock-schedule-2026-11-14.png`) | confirms "the 12-month lock ends 14 Nov 2026" |
| 24h spot volume (D14) | 25,049,208 USD (CoinGecko) · 63.8M (CoinMarketCap) | **21,414,482 USD (CoinGecko) · 68.43M USD (CoinMarketCap)**. CoinGecko's total equals the sum of its tickers that are not flagged `is_anomaly` or `is_stale` (21.41M, my calc); the flagged ones include its Upbit KRW ticker (21.18M) and its Bithumb KRW ticker (1.75M); all 20 tickers sum to 44.35M (my calc). Same 17 spot markets as 11 Nov: still no Binance spot or Coinbase ticker | 18:27:20 UTC (13:27:20 ET) · 18:29:54 UTC (13:29:54 ET) | https://api.coingecko.com/api/v3/coins/pieverse · https://coinmarketcap.com/currencies/pieverse/ | MOVED: CoinGecko -14.5%, CoinMarketCap +7.3% (my calc) |
| Perp venues (D14) | 31 | **33** (BBX and XOX added; none dropped) | 18:28:49 UTC (13:28:49 ET) | https://api.coingecko.com/api/v3/derivatives, filtered to PIEVERSE (`research/cg-derivatives-pieverse-2026-11-14.json`) | MOVED: 2 more |
| 24h perp volume across CREDIBLE venues (D14) | around 346.7M USD (28 venues) | **around 265.6M USD (30 venues)** (my calc: 329,169,320 for all 33 venues minus 63,561,130 for the three excluded; exclusions in note 5) | 18:28:49 UTC (13:28:49 ET) | same | MOVED: -23.4% (my calc) |
| 24h perp volume, all venues (not for a card) | around 464.2M USD | around 329.2M USD | 18:28:49 UTC (13:28:49 ET) | same | MOVED: -29.1% (my calc) |
| Open interest (D14) | around 78.8M USD (all venues) | **around 83.1M USD** (all 33 venues; 83.0M across the 30 credible venues, since the three excluded hold 0.13M between them) | 18:28:49 UTC (13:28:49 ET) | same | MOVED: +5.4% (my calc) |
| Perp volume against spot (D14) | 13.8x CoinGecko spot, 5.4x CoinMarketCap spot on the credible total (my calc today from the 11 Nov figures: 346.7 / 25.05, 346.7 / 63.8); Pillar 4 printed 18.5x and 7.3x on the all-venue total | **12.4x CoinGecko spot, 3.9x CoinMarketCap spot** on the credible total (my calc: 265.6 / 21.41, 265.6 / 68.43) | 18:27:20 to 18:29:54 UTC (13:27 to 13:29 ET) | the three rows above | no: still "several times the spot volume" on both counts |
| Binance Futures PIEVERSEUSDT (for the record only; section 4 bars it as a headline) | 59.6M volume, 21.4M open interest, funding 0.0102% | 40.5M USD volume, 23.2M USD open interest, funding 0.0105% | 18:28:49 UTC (13:28:49 ET) | https://api.coingecko.com/api/v3/derivatives | MOVED; not for a card |
| Skill Store: skills / merchants / categories (D5) | 74,195 / 25,233 / 14 | **74,195 / 25,233 / 14** | 18:32:22 UTC (13:32:22 ET) | https://purr.pieverse.io/api/app/skill-store/stats (`research/telemetry-purr-skill-store-stats-2026-11-14.json`) | no |
| Skill Store: mirrored / built in / native (D6) | 74,133 / 32 / 30 | **74,133 / 32 / 30** | 18:32:41 to 18:32:43 UTC (13:32 ET) | https://purr.pieverse.io/api/app/skill-store/skills?source=clawhub · the same with `source=builtin&limit=50` · and with `source=native&limit=50` (`research/telemetry-skills-source_*-2026-11-14.json`) | no |
| Skill Store: priced skills / paid installs / native installs (D6) | 5 / 1 / 24 | **5 (4 paid + 1 subscription) / 1 / 24**; the highest single native count is still 3, from 20 merchant ids; the newest listing in the store is still dated 2026-11-09; no row or count differs from 11 Nov | 18:32:43 to 18:32:47 UTC (13:32 ET) | https://purr.pieverse.io/api/app/skill-store/skills?pricingType=paid · the same with `pricingType=subscription` · and with `source=native&limit=50` | no |
| Usage counts the product publishes (D5, the NOT PUBLISHED half) | the Skill Store counter only | the Skill Store counter, plus ONE new public number, total staked (two rows down). Still no agent, subscriber or revenue count: 64 paths probed, only `skill-store/stats` and `staking/stats` answer 200; `purrfect-claw/stats`, `purrfect-claw/count`, `nft/erc8004/count`, `/v1/stats` and `/v1/agents/count` answer 401 (they sit behind a login); the home domain's `/stats`, `/v1/stats`, `/status.json`, `/facts.json` are still 404; the home page's visible text differs from 11 Nov by one banner and carries no counter | 18:56:25 to 18:57:16 UTC (13:56 to 13:57 ET); home page 18:39:49 UTC | https://purr.pieverse.io/api/app/ (each path and its status in `research/telemetry-probe-stats-routes-2026-11-14.json`) · https://www.pieverse.io/ (`research/home-2026-11-14.html`) | no for D5 |
| Staking: what it pays (D22) | daily XP (points) plus a one-time Agent benefit; lock 90, 180 or 365 days; no early or partial withdrawal | **unchanged.** Live page meta: "Stake PIEVERSE, earn daily XP, and compare Human and Purr-Fect Claw staking." The page's own FAQ, read from its script: "Each eligible daily boundary starts at 1 XP per staked PIEVERSE, then applies the selected term multiplier: 1x for 90 days, 1.2x for 180 days, or 1.5x for 365 days." · "Can I withdraw early?" "No. Every position stays locked until its selected term ends, and partial withdrawals are not available." · "Are token rewards or platform perks guaranteed?" "No. PIP-5 is an active community vote on possible token rewards, platform revenue, perks, governance, and other benefits. Amounts, eligibility, and claim rules are not finalized." The guide (Notion) is unchanged: last edited 2026-08-27 04:58:01 UTC, the same 82 text blocks | staking page 18:39:54 UTC (13:39:54 ET), its script 18:40:21 UTC (13:40:21 ET); guide 18:42:39 UTC (13:42:39 ET) | https://www.pieverse.io/staking (`research/staking-page-2026-11-14.html`) · https://www.pieverse.io/assets/staking-Doo74Gsj.js (`research/bundle-2026-11-14/`, with the copy in `staking-page-ui-copy.txt`) · https://pieverse.notion.site/Pieverse-Staking-User-Guide-3c9cee2fa0e080b4bfe6dab45240cfc7 (`research/notion-staking-guide-raw-2026-11-14.json`) | no. New detail: the XP multipliers (1x, 1.2x, 1.5x), which the 12 Nov read could not see |
| Total staked (new; not on a card) | NOT FOUND on 12 Nov | **10,866,556.28 PIEVERSE**, 1.09% of the supply, around 19.7M USD at 1.81 (both my calc). On-chain (verified): the staking contract `0xaE4c8Ca1dC8127C380099657774CB09ca8197e78` (address taken from the staking page's script) holds 10,715,351.16 on Ethereum and 151,205.12 on BNB Chain, which sum to the same figure; both balances are unchanged since the 11 Nov read | API 18:41:49 UTC (13:41:49 ET); Ethereum block 26,415,084 at 18:42:11 UTC, BNB Chain block 133,593,562 at 18:42:21 UTC | https://purr.pieverse.io/api/app/staking/stats (`research/telemetry-purr-staking-stats-2026-11-14.json`) · public RPC `eth_call balanceOf()` (`research/onchain-staking-contract-2026-11-14.json`) | new read: the "Total staked: NOT FOUND" line in Pillar 8 A is superseded by this row |
| PIP-5 vote (D23) | 1,130 votes · 169,871 tokens of weight | **1,130 votes · 169,870.45 tokens of voting weight.** In plain numbers: one hundred sixty-nine thousand, eight hundred seventy tokens, around 170 THOUSAND, not 170 million. That is 0.017% of the 1,000,000,000 supply (my calc 169,870.45 / 1,000,000,000); 170 million would be 17%. Token Rewards 138,047.25 · Governance Voting Power 107,311.75 · Platform Revenue 101,016.72 · Platform Perks 97,843.00 · Other (Suggest) 84,454.74. Closed 2026-10-08 00:00 UTC. The space still shows 6 proposals, 2,001 votes and 5 followers, and no proposal after PIP-5 | 18:42:55 UTC (13:42:55 ET) | https://hub.snapshot.org/graphql, space `pieverse-snapshot.eth` (`research/snapshot-pieverse-2026-11-14.json`) | no. The CONFLICT with the spoken "170 million" stands: note 6 |
| Reward announcement since the vote closed (D23) | NOT FOUND | NOT FOUND (checked: the staking page's FAQ, quoted in the staking row above, says the rules "are not finalized" and still calls PIP-5 "an active community vote"; the staking guide has not been edited since 2026-08-27; Snapshot has no proposal after PIP-5; X `@pieverse_io` through the public syndication timeline shows 20 posts dated 2026-10-21 to 2026-11-13 and none is about staking rewards, PIP-5 or the unlock, while posts from 2026-10-08 to 2026-10-20 are not in that feed; the Medium feed's newest item is dated 2026-01-15; the press page text is identical to 11 Nov; X `@pieverse_fdn` returned HTTP 429 at 18:46:54, 18:52:16 and 19:10:23 UTC and was not read; web search "Pieverse staking rewards PIP-5 result token rewards announcement" returned nothing on it) | 18:39:54 to 19:10:23 UTC (13:39 to 14:10 ET) | https://www.pieverse.io/assets/staking-Doo74Gsj.js · https://syndication.twitter.com/srv/timeline-profile/screen-name/pieverse_io (`research/x-posts-pieverse_io-2026-11-14.txt`) · https://medium.com/feed/@pieverse (`research/medium-feed-pieverse-2026-11-14.xml`) · https://www.pieverse.io/press | no: "the staking pages still pay points, no reward announcement found" stands |
| Mentions of the PIEVERSE token in the product docs (FB3) | 0 | **0.** The full docs dump is byte-identical to the 11 Nov copy (40,129 characters, 1,353 lines): "PIEVERSE" 0 · "pieUSD" 0 · "x402b" 0 · "stak" 0 · "governance" 0 · "USDT" 9. The word "token" appears 54 times and every use, read one by one, is another asset, a payment parameter (the examples pay in USDT) or a login token ("Check native or token balance", "JWT access token") | 18:43:12 UTC (13:43:12 ET) | https://docs.pieverse.io/llms-full.txt (`research/docs-llms-full-2026-11-14.txt`) | no: "the product docs never mention it" stands |
| Purr-Fect Claw plan prices (C1, D18) | 10 / 29 / 49 / 99 / 279 USD a month | unchanged (the file is identical to the 11 Nov copy): 10 / 29 / 49 / 99 / 279 USD a month, "Currency: USD" | 18:39:51 UTC (13:39:51 ET) | https://www.pieverse.io/pricing.md (`research/page-pricing_md-2026-11-14.txt`) | no |
| "Live agent payments: deferred." (D4) | present in llms.txt | unchanged: llms.txt is identical to the 11 Nov copy, and `/api/agent-discovery/status` still reads `"updatedAt": "2026-07-04"` | 18:39:51 to 18:39:56 UTC (13:39 ET) | https://www.pieverse.io/llms.txt (`research/probe-llms_txt-2026-11-14.txt`) · https://www.pieverse.io/api/agent-discovery/status | no |
| Home page and whitepaper lines (D1, D2, D17) | title "Pieverse: Web3 AI Agent for Line & Kakao"; the custody line; whitepaper v1.0 | unchanged: the same title; "Pieverse handles wallet creation, seed phrase custody, and setup."; the whitepaper text is identical (Version 1.0, Issue Date 2025-11-10) and still has no cliff or month count (0 hits for "cliff", "linear", "month") | 18:39:48 to 18:39:49 UTC (13:39 ET) | https://www.pieverse.io/ (`research/home-2026-11-14.html`) · https://www.pieverse.io/whitepaper (`research/page-whitepaper-2026-11-14.txt`) | no |
| Upbit won volume, 8 and 9 Nov (D21) | 3.03B to 53.82B KRW, 17.8x | unchanged: 3.03B to 53.82B KRW, 17.8x (my calc 53.818 / 3.029). New: 14 Nov, a partial UTC day up to the read, 27.53B KRW, already 4.3x the full day of 13 Nov (6.42B) (my calc) | 18:43:55 UTC (13:43:55 ET) | https://api.upbit.com/v1/candles/days?market=KRW-PIEVERSE&count=20 (`research/upbit-days-KRW-PIEVERSE-2026-11-14.json`) | no for D21 |
| Upbit listing date (C2 marker 2) | 2026-04-20 (secondary source) | confirmed on Upbit's own API: the first daily candle of KRW-PIEVERSE is 2026-04-20 | 18:54:50 UTC (13:54:50 ET) | https://api.upbit.com/v1/candles/days?market=KRW-PIEVERSE&count=12&to=2026-05-01T00:00:00Z (`research/upbit-days-KRW-PIEVERSE-first-2026-11-14.json`) | no; now primary |
| GitHub: public repos / most stars | 11 / 39 (`purrfect-agent`) | 11 / 39 (`purrfect-agent`); `purrfect-skills` last pushed 2026-11-12 | 18:43:43 UTC (13:43:43 ET) | https://api.github.com/orgs/Pieverse-Eng · https://api.github.com/orgs/Pieverse-Eng/repos (`research/github-repos-2026-11-14.json`) | no |
| CoinGecko watchlist users | 2,384 | 2,396 | 18:27:20 UTC (13:27:20 ET) | https://api.coingecko.com/api/v3/coins/pieverse | MOVED: 12 more |
| Peer: Virtuals Protocol (VIRTUAL) | 0.538 · market cap 354.3M · FDV 538.1M · 24h volume 29.8M · rank 120 · 7d -9.8% · 30d -24.1% | 0.457 · market cap 300.8M · FDV 456.8M · 24h volume 40.9M · rank 126 · 7d -18.5% · 30d -32.2% | 18:28:36 UTC (13:28:36 ET) | https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=pieverse,virtual-protocol,kite-2&price_change_percentage=7d,30d (`research/cg-peers-2026-11-14.json`) | MOVED |
| Peer: Kite (KITE) | 0.124 · market cap 296.0M · FDV 1,238.0M · 24h volume 11.7M · rank 134 · 7d +4.2% · 30d -3.5% | 0.128 · market cap 305.7M · FDV 1,278.5M · 24h volume 10.6M · rank 123 · 7d +19.8% · 30d +4.4% | 18:28:36 UTC (13:28:36 ET) | same call | MOVED |
| FDV ratios against the two peers | around 3.0x VIRTUAL · around 1.3x KITE | around 4.0x VIRTUAL · around 1.4x KITE (my calc: 1,809.3 / 456.8; 1,809.3 / 1,278.5, all three from the same call) | 18:28:36 UTC (13:28:36 ET) | same call | MOVED |
| OKX futures, 9 Nov: high 2.2501, low 1.9218, 14.6% in 2 hours (thesis row T13) | 2.2501 to 1.9218, -14.6% | 2.2501 to 1.9218, -14.6% `[STALE: not re-pulled, the OKX state of D21 was dropped at the plan gate and no card prints it]` | read 2026-11-12 | https://www.okx.com/api/v5/market/history-candles (`research/event-window-derivs.json`) | not re-pulled |
| First-trading times on Binance Alpha and Binance Futures (2025-11-14 11:00 and 11:30 UTC) and the Bithumb date (2025-11-24) | secondary sources | unchanged values `[STALE: not re-pulled, these are fixed past dates, not live-drift, their sources are the same secondary pages, and card D12 is not used]`. One supporting on-chain read: an unnamed view on the token contract returns 1763118000, which is 2025-11-14 11:00:00 UTC (reading it as the launch-time switch is an inference) | on-chain read at Ethereum block 26,415,177, 19:00:47 UTC (14:00:47 ET) | public RPC `eth_call` selector `0xb3df317a` on the token (`research/onchain-token-views-2026-11-14.json`) | not re-pulled |
| Mike's Discord timestamps behind D24 (the bot call at around 20M, his call at around 60M, the members-only software) | Mike's own claims, not in DATA.md | out of scope: these live in Mike's Discord and cannot be read or refreshed from here | not applicable | not applicable | not re-pulled |

**Notes to the table (the rulings the cards need, then the method).**

1. **D9 and the last point of C2: the price the card prints.** Two sourced record-day values exist. The live read, 18:27 UTC: price 1.81 · market cap 496M (CoinGecko) · FDV 1.81B · rank 99. CoinGecko's own print inside the recording, 14:15 UTC: price 1.78 (1.7764) · market cap 488M (488,075,469) · FDV 1.78B (my calc). The voice-over says "at the time of this recording, the token is sitting at $1.78 with a fully diluted value of $1.7 billion". The live read is 3 cents higher (around 1.7%, my calc on the rounded prints): not much of a market move, but a card printing 1.81 and 1.81B would not match the spoken 1.78 and 1.7 billion. The recording-window print matches the spoken price exactly and puts the FDV at 1.78B, which he rounded down. Whichever is chosen, the card states its read time, prints the read FDV (1.78B or 1.81B), never "1.7B", and takes rank 99 with the 18:27 UTC stamp or leaves the rank off, because no rank exists for 14:15 UTC.
2. **D19: the circulating range.** The voice-over says "around 27 to 31% of the supply is circulating, depending on who's counting". CoinGecko (27.5%) and CoinMarketCap (30.0%) are unchanged and sit inside that; the project's own count is now 39.6%. Do not print 309.5M as a 14 Nov number: it is the 11 Nov value. Options: (a) print the three counts as read with "around 27% to 40%", which the picture then says and the voice does not; (b) print CoinGecko and CoinMarketCap as the range and the project's count as its own dated line ("the project's own count after 14 Nov: 395.9M, 39.6%"); (c) keep the 11 Nov numbers with their 11 Nov date. Why the three differ (my readings of matching numbers, not statements by the sites): 274,750,000 equals the schedule's running total through 14 Jun 2026, and CoinMarketCap lists the same 274,750,000 as the project's self-reported figure, last updated 2026-06-16 from a URL (`https://www.pieverse.io/api/circulating?source=cmc`) that returns 404 today, so CoinGecko's count reads as five months old; CoinMarketCap's 300,352,220 is the total minus the balances of ten flagged wallets, so it moves only when tokens leave those wallets, and none has; the project's API follows the unlock schedule, so it stepped up on the unlock date although no token moved.
3. **D10 and C3: the unlock, and which schedule C3 draws.** D10's range ("around 33M to around 86M", "two trackers, two sizes") still matches the reads. What is new: the 86.4M figure is the PROJECT-REPORTED schedule. Three project-side reads agree with it: CoinMarketCap's feed marks the schedule `selfReported: true` (the page's tooltip text for that flag is "Reported directly by the project"); the project's own API returned exactly that schedule's running total on both dates (309,500,000 on 11 Nov, 395,883,333 on 14 Nov); and the unlock chart in the project's own Medium post matches it at months 12, 18, 24 and 30. The 33.4M figure is one third-party tracker's model: its page data gives the basis as "confirm: schedule via https://www.pieverse.io/whitepaper (2026-06-10)" (read 19:07:56 UTC), but the whitepaper has no cliff or month count. C3 as planned draws the tracker's schedule, which fits the voice-over ("on one tracker's schedule"), but its marker value "342.7M released" matches no source as read today (364.8M on the tracker after the event, 331.4M before; 395.9M on the project-reported schedule). Two month-by-month series by bucket were built for the chart-builder so that every plotted value is a source's own: `research/supply-schedule-tracker-2026-11-14.json` (rebuilt from the tracker's stated terms and checked against its own 37 event amounts, worst difference 0.33 tokens) and `research/supply-schedule-project-reported-2026-11-14.json` (straight from CoinMarketCap's feed). The CHART-SOURCE INDEX still names the 11 Nov file; which series C3 uses, and what its marker says, is the orchestrator's or Mike's ruling. Open question 1 ("no official vesting schedule was opened") is answered in part: the lockup sentence and the chart are now opened; a month-by-month table in the project's own words is still not.
4. **Precision flag, voice-over at 256.68 ("around 33 million tokens unlock every month until November of 2028").** Not a drift, but visible in today's event-by-event read: on the tracker the 33.4M a month runs for 12 months (through 14 Oct 2027), then steps down to 27.9M, 19.5M, 14.9M and 6.6M; November 2028 is where the schedule ENDS. C3 should draw the series as read, not a flat 33.4M to 2028.
5. **D14 method: which perp venues are excluded, and why.** The same three as section 5, for the same reason (reported volume out of all proportion to open interest): Deepcoin 24.0M of 24h volume against 3,752 USD of open interest (6,403x) · Biconomy 11.7M against 13,239 USD (884x) · Hotcoin 27.8M against 110,954 USD (251x; its open-interest figure, 110,953.83, has not changed by a cent since 11 Nov). Together 63.6M of volume and 0.13M of open interest. WEEX (19.8M against 143,180 USD, 138x) is kept, as it was on 11 Nov at 202x; if it were also excluded the credible total would be around 245.8M (my calc). Largest by open interest among the credible venues: Binance Futures 23.2M · KuCoin Futures 8.1M · OKX 7.5M · OrangeX 7.5M · CoinW 6.9M · XT.COM 6.7M · Gate 6.7M · Bybit 5.3M. Per the plan-gate ruling the card carries the credible total against spot and no single-venue number.
6. **What contradicts the recording, in one list.** (a) "$1.78" and "$1.7 billion": true for the recording window (1.76 to 1.78; FDV 1.78B), not for the live read (1.81; 1.81B): note 1. (b) "around 27 to 31% of the supply is circulating": the project's own count is now 39.6%: note 2. (c) "around 170 million tokens voted": the record is 169,870.45 tokens, around 170 thousand; the next spoken line, "under 0.02% of the supply", is right only for thousand (0.017%). D23 prints the sourced figure and never "170M"; the ruling on the audio stays Mike's. (d) "every month until November of 2028": note 4. Everything else the voice-over says about live figures still holds on the record-day read: the all-time high of 2.23 on 9 Nov stands; four wallets hold around 57% (56.6%); the wallets are 2-of-3 multisigs (so the card prints "2-of-3", not "2 or 3"); "the 12-month lock on the team and investors ends" on 14 Nov 2026 is now backed by the project's own post; "kept by people, not by a contract" is, if anything, firmer as far as the reads show (no module and no guard on the Safes, the tokens sit in them as plain balances, and the five largest have never sent a transaction); futures run at several times spot; the Skill Store counters are unchanged (74,195 · 25,233 · 30 native · 5 priced · 1 paid install); the docs never mention the token (0); plans run 10 to 279 USD; live agent payments are listed as deferred; staking pays XP on 90, 180 or 365 day locks; no reward announcement was found. One wording caution for any new on-screen text: the lock ENDED on 14 Nov and the project's own count went up, but no token has left the team, investor or foundation wallets, so nothing may say tokens were "released", "moved" or "sold".
7. **The project's own recent posts are readable today (coin-research row 14; Pillar 8 C had them NOT FOUND).** X's public syndication timeline for `@pieverse_io` answered HTTP 200 at 18:46:14 UTC with 20 posts from 2026-10-21 to 2026-11-13 and one older post from 2026-05-25 (`research/x-posts-pieverse_io-2026-11-14.txt`). The last post before the 9 Nov all-time high is dated 6 Nov 07:18 UTC ("Practice the trade before it counts. Your Agent's trading desk is on the way."); the next is 10 Nov 06:36 UTC. On 11 Nov 08:53 UTC the account announced "a strategic partnership" with four.meme (`@fourdotmemezh`), and the same day it reposted that account's own post ("Excited to team up with @pieverse_io"); on 13 Nov 04:58 UTC it announced "Confidential Agents, a new Purr-Fect Claw option". Nothing about the 14 Nov unlock or about staking rewards appears through the latest post. These are the two accounts' own claims; posts and flows show who and what, never why, so no cause for any price move is asserted, and section 4's partner rule is unchanged.
8. **Token contract, partly read (Open question 5 stays open).** On Ethereum the token is not a proxy. Its function list is a LayerZero cross-chain token with `mint` capped by `MAX_SUPPLY()` = 1,000,000,000, plus `setMinter`, `setWhitelisted` and a `multisig()` role that points to the creator address. Of the 55 function selectors in its bytecode, 49 resolve to a name in the public 4byte directory and none of those is for vesting, locking or releasing; 6 do not resolve, so their purpose is unread (`research/onchain-token-functions-2026-11-14.json`, `onchain-token-views-2026-11-14.json`, Ethereum block 26,415,177 at 19:00:47 UTC). Who can mint, and whether the cap can be reached again, was not established: keep contract powers out of any card.
9. **[STALE] and out-of-scope rows.** Nothing in section 5 failed to re-pull. Three rows were not re-pulled and say so in the table: the OKX 9 Nov series (no card uses it), the first-trading times and the Bithumb date (fixed past dates on secondary sources), and Mike's Discord timestamps behind D24 (out of scope). Also not read on record day: X `@pieverse_fdn` (HTTP 429 three times), Binance's and Bybit's own APIs (blocked from this machine as on 12 Nov; the Binance Futures row comes from CoinGecko's feed), and the rank for the recording window (no history exists).

---

## 6. Clip candidates

None, by Mike's call (2026-11-11: "No receipts, no clips"); not searched. The screenplay's `## CLIP-INSERTS` section is therefore NONE with that reason.

| ID | Who / what is said (verbatim, opened) | Source URL + window | Length | Context check | Supports |
|---|---|---|---|---|---|
| (none) | none, by Mike's call (2026-11-11); not searched: no keynote, podcast, interview or X video was looked for | | | | |

---

## CHART-SOURCE INDEX

Per Mike's constraints this index lists ONLY code-built graphics: TWO animated charts, ONE system-design chart, and deck cards. No screencaps, no restyles, no receipts. Every number a graphic shows is a number in this file. C2 and C3 are the two recommended animated charts; C2-ALT and C3-ALT are alternates the strategist may swap in (the budget stays at exactly two).

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design diagram: "How Pieverse works". Nodes, left to right: YOU IN A CHAT APP (LINE, KakaoTalk) -> PURR-FECT CLAW AGENT (hosted, monthly plan, 10 to 279 USD) -> AGENT WALLET IN A TEE (keys never leave secure hardware; one wallet per agent) -> ON-CHAIN ACTION (swap, lend, transfer; BNB Chain by default, other EVM chains and Solana). Feeding the agent from above: SKILL STORE (skills = instructions the agent loads). Branch off the agent, drawn as a dashed "documented, not claimed live" path: AGENT-TO-AGENT PAYMENT (request -> HTTP 402 challenge -> agent authorizes -> merchant settles on-chain -> receipt). A separate node, deliberately NOT wired into the payment path: PIEVERSE TOKEN (governance, staking, fee discounts per the whitepaper) | section 2, Pillar 2 (docs quotes) and Pillar 1 (stage) | **code** (Type 2 system-design, static states, node-by-node spotlight) |
| C2 | ANIMATED chart 1 (recommended): PIEVERSE price, 14 Nov 2025 to the read date, line draw-on with three markers: all-time low 0.119 (14 Nov 2025), Upbit listing day 1.184 (20 Apr 2026), all-time high 2.23 (9 Nov 2026), ending on the read price 1.61 | section 2, Pillar 4 price table (full daily series in `research/coingecko-market-chart-365d.json`); section 5 | **code** (Type 1 animated); last point and ATH [VERIFY] at render |
| C3 | ANIMATED chart 2 (recommended): supply released over time, 14 Nov 2025 to 14 Nov 2028, stacked area by bucket growing from 175.1M at TGE to 1,000M, with a "14 Nov 2026" marker where the team and investor layers switch on and the slope steps up to around 33.4M a month | section 2, Pillar 4 "Supply released over time" table (`research/mycalc-supply-schedule.json`) | **code** (Type 1 animated); built on third-party vesting terms, carries an on-screen "tracker schedule" label [VERIFY] |
| C2-ALT | ANIMATED alternate: market cap vs FDV bars growing to 443M and 1,611M, with the 27% circulating share filling in | section 5 | **code** (Type 1 animated) [VERIFY] |
| C3-ALT | ANIMATED alternate: the Skill Store count-up: 74,195 total, then the bar splits into 74,133 mirrored / 32 builtin / 30 native | section 2, Pillar 3 table | **code** (Type 1 animated) [VERIFY] |
| D1 | Deck card: what Pieverse says it is, in its own words (home page line) | Pillar 1, self-description 3 | **code** (deck card) |
| D2 | Deck card: three framings in a year (litepaper: compliance invoices + TimeFi · whitepaper Nov 2025: agent payment stack · home page 2026: AI agents for Line and Kakao) | Pillar 1 | **code** (deck card, 3 spotlight states) |
| D3 | Deck card: Purr-Fect Claw plans: Starter 10 · Basic 29 · Standard 49 · Pro 99 · Ultra 279 a month | Pillar 2 (pricing.md) | **code** (deck card) [VERIFY] |
| D4 | Deck card: live vs deferred, the project's own words ("Live agent payments: deferred") | Pillar 1 stage | **code** (deck card) |
| D5 | Deck card: what the product publishes: 74,195 skills · 25,233 merchants; and what it doesn't: agents, subscribers, revenue | Pillar 3 | **code** (deck card) [VERIFY] |
| D6 | Deck card: 74,133 mirrored · 32 builtin · 30 native · 5 priced · 1 paid install | Pillar 3 | **code** (deck card) [VERIFY] (not needed if C3-ALT is picked) |
| D7 | Deck card: token basics: 1B supply · BNB Chain and Ethereum · 909.3M / 90.7M split · 411,428 holders | Pillar 4 on-chain | **code** (deck card) [VERIFY] |
| D8 | Deck card: allocation: Community Growth 27.6% · Ecosystem & Marketing 27.4% · Team & Advisors 20% · Investors 15% · Foundation Reserve 10% | Pillar 4 allocation table | **code** (deck card) |
| D9 | Deck card: the snapshot: price 1.61 · market cap 443M · FDV 1.61B · rank 112 · all-time high 2.23 (9 Nov 2026) | section 5 | **code** (deck card) [VERIFY] |
| D10 | Deck card: 14 Nov 2026: the 12-month lock on team and investor tokens ends; trackers: around 33M to around 86M tokens | Pillar 4 unlock conflict | **code** (deck card) [VERIFY] |
| D11 | Deck card: who holds it: 4 wallets = 56.6% · seven 2-of-3 multisigs = 67.35% | Pillar 4 on-chain | **code** (deck card) [VERIFY] |
| D12 | Deck card: listings: Binance Wallet Pre-TGE (announced 29 Aug 2025) · Binance Alpha + Futures (14 Nov 2025) · Bithumb (24 Nov 2025) · Upbit (20 Apr 2026) | Pillar 4 listings table | **code** (deck card); Bithumb date [VERIFY] |
| D13 | Deck card: backers: 7M strategic round, 24 Oct 2025 · Animoca Brands, UOB Ventures · Binance MVB Season 9 | Pillar 5 | **code** (deck card) |
| D14 | Deck card: perps vs spot: 31 perp venues · Binance Futures 59.6M volume · spot 25.0M | Pillar 4 derivatives | **code** (deck card) [VERIFY] |
| D15 | Deck card: what to watch: circulating supply after 14 Nov 2026 · native skills and paid installs · a published agent count | Pillar 3, sweep step 8 | **code** (deck card) |
| D21 | Deck card: 9 Nov 2026, the day of the high: Upbit won traded 3.0B to 53.8B KRW (17.8x) · then 14.6% down in the 2 hours after the high (OKX futures) | Pillar 8 B, T13 | **code** (deck card) [VERIFY] |
| D22 | Deck card: staking: lock 90, 180 or 365 days · no early withdrawal · earns daily XP (points) · 50 or more tokens = a Basic agent for the length of the lock | Pillar 8 A, T11 | **code** (deck card) [VERIFY] |
| D23 | Deck card: the staking vote, PIP-5 (closed 8 Oct 2026): Token Rewards 138,047 · Governance Voting Power 107,312 · Platform Revenue 101,017 · Platform Perks 97,843 · 1,130 votes · around 170 thousand tokens voted, under 0.02% of supply | Pillar 8 A, T12 | **code** (deck card) |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. Code-built graphics are text-accurate and trace to section 2 and section 5. This video has no real-site captures by Mike's call, so the price line (C2) is our own code-rendered chart of CoinGecko's series, labeled with its source and read date on screen.

---

## Open questions for Mike

1. **No official vesting schedule was opened.** The allocation is primary (whitepaper), but the cliffs, vesting lengths and the size of the 14 Nov 2026 unlock come from trackers that disagree (33.4M vs around 86.4M tokens). Airable: "the 12-month lock on team and investor tokens ends November 14th, 2026" and the range. Recommendation: keep the range wording; C3 carries a "tracker schedule" label; if you want one number, someone needs the project's own vesting post (likely on X or Medium, which a plain fetch can't open).
2. **The video will be recorded AFTER 14 Nov 2026 in all likelihood.** Every supply figure here (circulating, top-wallet balances, market cap) is a pre-unlock read from 2026-11-11. Recommendation: re-pull section 5 and the Safe balances on record day, and let the script speak about the unlock in the tense that is true that day.
3. **Brief contradiction check (soft):** the brief's starting points call the project "TimeFi" and "AI Applications" (CoinGecko's tags). The project's current home page is an AI-agent product for chat apps, and "TimeFi" is its oldest framing. The angle survives: "what it is" becomes "what it was, and what it is now" (Pillar 1). CoinMarketCap and CoinGecko describe the same token; they differ on circulating supply, market cap, rank and volume, and on which era of the project their text describes.
4. **Payment-rail usage (x402b, pieUSD) could not be measured.** No endpoint, no dashboard, and the pieUSD contract address was not located, so its on-chain supply was not read. Airable: "the project doesn't publish payment volume" (checked-list in Pillar 3). Recommendation: say it that narrowly, never "there is no usage".
5. **What the token contract's owner can do was not read** (mint, pause, upgrade). The owner on Ethereum is a 2-of-3 multisig. Recommendation: leave contract powers out of the script unless you want that checked.
6. **Whitepaper roadmap items (the DAO in 2026 Q2, audit-firm partnerships in 2026 Q4) were not searched exhaustively.** No evidence found either way. Recommendation: do not say they slipped; at most "the whitepaper's roadmap is about the older payments product".
7. **Sources that could not be opened:** Forbes (403), CryptoTimes (403), the MEXC-hosted Bithumb article (410), X posts, the Chainwire "Agentic Neobank" release (cited from the project's press page only). The Bithumb date (24 Nov 2025) and the Binance Alpha and Futures times rest on secondary pages: tagged [VERIFY]. **Update 2026-11-12:** the staking guide (Notion) and the Snapshot space WERE opened (Pillar 8); X posts still were not (Chrome extension not connected, syndication rate limit).
8. **The Skill Store finding is new and not in any coverage found.** It comes from the product's own public API, saved in `research/telemetry-*.json` with read times. It is the strongest "what is real today" fact in the file and also the most sensitive. Recommendation: air it as a plain description ("almost all of the catalog is imported from an outside hub; 30 skills were published on Pieverse itself"), re-pull it on record day, and do not frame it as an accusation.
9. **Peers** (Virtuals Protocol, Kite) are the researcher's pick. Drop the comparison if it doesn't serve a 5-minute explainer.
10. **Operating entity:** "Pieverse Technology Limited" is named in the site footer; its jurisdiction and registry record were not found. Recommendation: name the CEO and the investors, leave the entity out of the script.
11. **The other creator's flow numbers (Pillar 8 B) could only be partly reproduced.** The Korean volume multiple and the drop after the high are confirmed on venues we can read; Binance funding, open interest and futures volume are not. Recommendation: air only the confirmed items, with the venue named, and re-try Binance data from a machine in an allowed region if you want the funding line.
12. **Staking pays points and the vote's top option was tokens (Pillar 8 A).** This is new to the explainer and bears on the "does the token earn anything" question. Recommendation: air it as two plain facts in CH4, no inference about the team. The 4 `[VERIFY]` items are the Basic-agent link to the 29 USD plan, the XP multipliers, whether a reward decision has been announced since 2026-10-08, and the project's recent X posts.
