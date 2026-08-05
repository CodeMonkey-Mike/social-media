# ethereum-rwa — WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.e.desilenced.mp4` (6:57.41 / 417.41s). Timecodes from the spine word-transcript
> (`spine/ALL.e.desilenced.medium-words.json`) + `blackdetect` FACE/COVER spans. Sibling of `EDIT-PLAN.md`
> (event log) + `EDIT-PLAN-prep.md` (beat-indexed). Format: `skills/edit-plan-and-cue-sheet.md` §2.
> FACE/COVER edges EXACT (blackdetect). Ids: `C*` chart · `D*` container/diagram · `R*` receipt ·
> `V*` Envato video · `I*` ChatGPT still · `MONT-*` CH5 callback montage · `T-CH*` title card.
> **CH1 is first, nothing before it.** Timecodes are PRE-card-pause; the three ~1s pauses at 0:48.9 / 2:09.9 /
> 3:20.3 shift everything after them through the comp's `sh()`.

## FACE spans (baked spine shows the face — face appears ONLY here)   7 spans · 115.8s (27.7%)
- 0:00.0 → 0:08.4   CH1.B1 locked opener — "While everybody in crypto has been staring at the price…"  (opens ON face, not a cut)
- 0:29.9 → 0:30.7   CH1.B2 the one-word reveal — "Ethereum."
- 1:47.5 → 1:51.9   CH2.B3 punctuation — "the most conservative money on earth is actually parking right on Ethereum."
- 2:22.7 → 2:24.8   CH3.B1 punctuation — "and they built it on Ethereum."
- 4:39.2 → 4:46.1   CH4.B3 asymmetry payoff — "…choosing Ethereum rails before the toll booth is even finished."
- 5:06.3 → 6:31.2   **CH5 AD-LIB block (84.9s)** — flippening call → disclaimer → track record → XRP → mid CTA
- 6:49.0 → 6:57.4   CH5.B10 closing CTA — runs to EOF (HARD OUT on the last word)

COVER (black) spans: 0:08.4-0:29.9 · 0:30.7-1:47.5 · 1:51.9-2:22.7 · 2:24.8-4:39.2 · 4:46.1-5:06.3 · 6:31.2-6:49.0
**= 301.59s (72.3%), fully assigned, exact partition (no gaps, no overlaps, no FACE collisions — verified).**

## TRANSITIONS (chapters + face + b-roll — MANDATORY)
✅ Full per-cut table: **`TRANSITIONS.md`** (every id verified against the 853-row library). Picks:
**cards = `rmn:cube` from-right ×3** (the only `@remotion/transitions` use) · **face = `lib:blocks` family**
(Blocks·Max on cuts, strips tier on punch-ins + the 0.77s FACE-2 window) · **melt = `lib:melt-rgb-*` ×4** ·
**spin = `lib:spin-3d-side-ease-*` ×2** · AI stills = `lib:badsignal-*` · Envato = `hand:fade` ~0.5s ·
container/chart swap = `hand:xfade+scale` ~0.35s · receipts = `hand:xfade+pop` ~0.4s.
**MELT/SPIN marquee budget (6 total, never sprayed):** SPIN `D3-A` @2:24.8 (NEW FACET, the marquee) ·
MELT `D3-A#L1` @3:12.6 · SPIN-short `C4` @3:23.0 · MELT `D4-C` @4:06.5 / 4:13.4 / 4:26.6 (the three tollbooth
states). **All six carry baked SFX that must duck UNDER the VO.**
CHAPTER cards (`rmn:cube`, cube-in starts ~0.5s BEFORE the pause so the title reads ≥1s; the cube-OUT is the
ingress for D2-A / V4 / V6 — do NOT add a second fade there): 0:48.9 · 2:09.9 · 3:20.3
FACE cut-ins/outs (`lib:blocks-max-*` rotating): 0:08.4 · 1:47.5 · 1:51.9 · 2:22.7 · 4:39.2 · 4:46.1 · 5:06.3 ·
6:31.2 · 6:49.0  (0:00.0 = opens ON face, no transition) · **0:29.9 + 0:30.7 use `blocks-strips-3x`** (the 0.77s
reveal window is shorter than a max glitch).
Intra-FACE punch-ins (`hand:punch` +15% + a strips glitch; snap to word onsets at build): ~0:04.2 · ~1:49.7 ·
~4:42.6 · **7 re-frames across the CH5 block: ~5:09.3 · ~5:22.6 · ~5:26.4 · ~5:46.7 · ~5:54.5 · ~6:13.0 ·
~6:24.7** · ~6:53.3.  **FACE 4 (2.04s) gets NO punch** — the glitch straddles leave no clean room.
**Two shared-boundary precedence calls:** @4:46.1 the face-out Blocks doubles as I2's glitch ingress (do NOT
stack a badsignal) · @2:24.8 the marquee SPIN replaces the Blocks face-out (the one deliberate exception).
MONT-1..5 use ONE repeated `hand:cross-warp` (~0.35s, same direction) — not five different moves.
Receipt push-ins are single-image MOTION moves ON the asset — they do NOT consume the marquee budget and do
NOT appear in these buckets; the comp must not double-apply a move at receipt boundaries.

## CHAPTER cards begin  (ON only at a music-bed change)   3
- 0:00.0  CH1 "The wave nobody's watching" — **NO card** (first chapter, pure hook)
- 0:48.9  **T-CH2 "THE PROOF"** — +~1s pause · BED A→B  (lead the card in BEFORE the pause, ≥1s readable)
- 2:09.9  **T-CH3 "ROBINHOOD CHAIN"** — +~1s pause · BED B→C · neon green #CCFF00, NEVER teal
- 3:20.3  **T-CH4 "THE BULL CASE"** — +~1s pause · BED C→D
- 5:06.3  CH5 "Ride the wave" — **NO card** (BED D continues)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   24
- 0:15.3  C1 RWA growth — ~$5B → ~$31B+ count-up  `[VERIFY end value]`
- 0:23.5  C1 — "+400%" tag lands
- 0:26.2  C2 #A dominance donut — UNLABELED ("one chain")  `[VERIFY 61% vs 65%, cite one]`
- 0:30.7  C2 #B dominance donut — LABELED Ethereum + share %
- 0:36.0  D1-TEASE — "?" chain docking onto Ethereum L1 (brokerage unnamed)
- 0:44.5  D1-TEASE — roadmap chips: WHO IS BUILDING · WHAT JUST LAUNCHED · WHY IT'S MISPRICED
- 0:48.9  D2-A tokenization flow — REAL ASSET → ISSUER → SMART CONTRACT → TOKEN (animated L→R)
- 1:01.9  D2-A — satellites "settles in minutes · 24/7 · DeFi-ready"
- 1:15.3  D2-B BUIDL card — acronym gloss · March 2024 · Securitize · Ethereum first  `[VERIFY AUM/yield]`
- 1:25.3  C6 BUIDL 8-chain split — Ethereum ~$1.1B "largest single-chain slice"  `[VERIFY]`
- 1:33.2  C7 market composition — 80% treasuries + cash-type
- 1:58.0  D2-C "$2T BY 2028" + **FORECAST tag** + Standard Chartered attribution
- 2:07.4  D2-C — direction arrow animates up
- 2:24.8  **D3-A ⭐MARQUEE settlement stack** — top-down build begins
- 2:28.7  D3-A — ETHEREUM L1 "security + settlement"
- 2:32.6  D3-A — badge "built on Arbitrum"  ·  2:35.1 badge "100ms blocks"  ·  2:37.2 badge "gas = ETH"
- 2:41.3  D3-B tokenized stocks — NVDA/GOOG/AAPL orbiting a 24/7 clock, 120+ countries
- 2:53.5  C3 Robinhood momentum — 4M testnet tx  `[VERIFY]`
- 2:58.0  C3 — $257.4M TVL + gloss "value parked on the chain"  `[VERIFY fastest drift]`
- 3:03.0  C3 — $4.5B 7-day DEX volume  `[VERIFY]`
- 3:05.1  C8 tokenized-EQUITIES share — Solana ~95% vs ETH/Base/BNB (June 2026)  `[VERIFY]`
- 3:12.6  D3-A #L1 break-up — L1 enlarged, Robinhood docking, L1 pulses
- 3:23.0  C4 lock-up — STAKED grows to 28.91%  `[VERIFY]`
- 3:28.0  C4 — "securing · earning yield" glow  ·  3:30.0 entry-vs-exit queue ~10:1
- 3:34.0  C4 — CORPORATE TREASURIES +6.59% stacks  ·  3:39.5 total callout  `[VERIFY overlap]`
- 3:59.9  D4-B ETF card — $196.4M · Jul 14-21 · ETHA leading + staking ETFs live  `[VERIFY current week]`
- 4:06.5  **D4-C #1 ⭐ tollbooth overview** — wide fee stream, no numbers
- 4:13.4  **D4-C #2 ⭐ the split** — "~$816K CUMULATIVE through Jul 13 → ~$1.5K · 0.15%"  ⚠`FLAG D`
- 4:26.6  **D4-C #3 ⭐ Fusaka** — fee-floor bar slides in  `[VERIFY live status/tense]`
- 4:49.5  MONT-1 D2-B@end  ·  4:53.5 MONT-2 D3-A@end  ·  4:57.6 MONT-3 C4@end
- 5:01.9  MONT-4 D4-B@end  ·  5:04.2 MONT-5 D4-C@end
- 6:42.8  D5-CLOSE — "$2T BY 2028" (FORECAST) + Ethereum mark + "NOT PRICED FOR IT"

## RECEIPTS / inserts begin   7  (assigned FIRST — Mike's priority order)
Single-image MOTION is MIXED per `broll-and-containers.md` §2 — **PERSPECTIVE on the 3 flat data panels,
subtle reading zooms on the 3 prose articles.** These are ON-IMAGE effects, NOT transition-bucket rows, and
they do not consume the marquee budget (full table: `TRANSITIONS.md` §3b).
- 0:11.3  **R1** rwa.xyz global total-value panel — R(other) · **`lib:perspective-ease-in-short-up`**  `[VERIFY live]`
- 1:09.6  **R2** Securitize BUIDL fund page — R(other) · subtle ken-burns push
- 1:51.9  **R3** The Block "$17 billion / 300% YoY" — R(article) · `zoom-ease-short-in` reading push
- 2:13.3  **R4** Robinhood mainnet announcement (July 1 2026) — R(article) · two-stage zoom (wide → headline/date)
- 3:42.9  **R5** ETH corporate-treasury tracker — R(other) · **`lib:perspective-pan-3d-down`**, pans down the rows onto BitMine
- 3:54.8  **R6** farside.co.uk ETH ETF flow table — R(other) · **`lib:perspective-ease-in-LEFT`**, toward the ETHA column (ETHA is the LEFTMOST column; `-right` was a plan error, corrected 2026-07-31)  `[VERIFY current week]`
- 4:21.7  **R7** Vitalik value-accrual quote — R(article) · `zoom-simple-short-in` reading push  (bench: attributed quote card)
⛔ The Motley Fool article is NEVER a receipt (bearish headline); its fee DATA lives inside D4-C only.

## VIDEO b-roll begins  (Envato)   9 · all ≤4s except the one lead exception
- 0:08.4  V1 br-skyline (CH1 atmosphere) — fade
- 1:05.8  V2 br-hq-tower ("not startups in a sandbox") — fade
- 1:44.8  V3 br-vault ("most battle tested chain") — fade
- 2:09.9  V4 br-trader-react ("sit up in their chair") — fade
- 2:50.0  V5 br-phone-app ("their Robinhood wallet") — fade · generic app UI only
- 3:20.3  V6 br-eth-coin ("Ethereum, the asset") — fade
- 3:51.9  V7 br-ticker-floor ("through a ticker") — fade
- 6:31.2  V8 br-wave (the title metaphor) — fade
- 6:38.2  V9 br-bank-lobby ("if the banks are even half right") — fade · **`lead:true` 4.54s**

## IMAGE b-roll begins  (ChatGPT stills)   3 placed · 0 BENCH · 2 slots unspent
- 1:40.9  I1 stampede vs institutional figure — glitch ingress
- 4:46.1  I2 tollbooth under construction — glitch ingress
- 6:35.0  I3 real assets crystallizing into tokens — glitch ingress

## MUSIC beds begin   4 · full coverage, zero loops
- 0:00.0  **BED A** Down To The Wire (src 0.0) — aggressive · −23.5 dB · duck −5 dB @0:29.7-0:31.2 under the reveal
- 0:48.9  **BED B** Fortitude (src 0.0) — subtle · −28.5 dB · duck −2 dB @1:14.5-1:21.0 under the BUIDL gloss
- 2:09.9  **BED C** Edgerunner (src 14.2) — aggressive · −27.0 dB · first drop lands on "July 1st" @2:13.3
- 3:20.3  **BED D** Searching For Signs Of Life (src 34.36) — **END-ALIGNED**, spans CH4+CH5 · −25.5 dB
  - 5:06.3 breakdown recedes under the lean-in · 5:09.3 swell returns as the flippening call lands
  - 5:22.6 dip under the disclaimer · 6:46.0 final peak carries "not priced for it" · hit resolves ON the final frame
0.6s inter-bed breath at each of the three changes, inside the card pauses.

## CAPTIONS
- ⏳ **PENDING decision** — CH1 was planned caption-ON, but CH1 is 79% cover and captions may never sit over a
  cover (`lint-covers.js` enforces). Options: face-opener only (0:00.0-0:08.4), or none.
- ⚠ Caption build MUST apply the mishear list in `AS-RECORDED.md`, above all **"flips"** not "flipped" @5:09.3.

## LIGHT LEAKS (face holds > 5s — `skills/overlays.md`, inset ~0.6s off the cut)
- 4:39.2 → 4:46.1  CH4 asymmetry payoff (6.9s)
- 5:06.3 → 6:31.2  CH5 ad-lib block (84.9s)
- 6:49.0 → 6:57.4  closing CTA (8.4s)
(0:00.0-0:08.4 opener is 8.4s — leak optional, it opens the video cold; short face beats get punch/glitch only, NO leak.)

## IMPACTS + RISERS (audio — mixed with ffmpeg, NOT in the comp)
- **None planned.** If the transition plan adds SFX on a marquee MELT/SPIN, every hit ducks UNDER the VO and
  is QA'd by rendering the chunk and LISTENING (never integrated-LUFS-only).
