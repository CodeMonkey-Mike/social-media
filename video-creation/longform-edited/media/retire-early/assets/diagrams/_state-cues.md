# retire-early - Type 2 SYSTEM-DESIGN diagrams: word-cued states

_Written by chart-builder, 2026-10-10. Read by edit_plan (the spotlight rows) and comp_build. Every time is a
FINAL-spine (`spine/ALL.e.desilenced.mp4`) second, taken from `spine/ALL.e.desilenced.medium-words.json` and the
cover windows in COVER-PLAN.json. Card pauses / clip inserts shift these the same way they shift every other cover
(comp-build `sh()`)._

**How to use them.** Each id is ONE cover row in the plan; its states are STATE SWAPS inside that row (comp-build
§5: no ingress transition between two states of the same id; cross-fade the two PNGs over 6 to 8 frames). Every
state PNG of a family is the same 1920x1080 layout with different spotlight classes, so shared elements are
pixel-identical and the swap reads as a light moving, never a redraw (verified: the title blocks differ by 0 px
across all states of every family). PNGs are 3840x2160 (the 1920x1080 layout at device scale 2) so the comp's
push-ins stay sharp. Per comp-build §7a no state sits dead still: give every full-view state a gentle push
(1.00 to about 1.03, never past 4 percent, the titles sit 140 px in), and on the long holds noted below a
slow drift toward the lit region is better than a centred push.

Chapter accents (COVER-PLAN `chapter_themes`): C1 = CH2 #12aaff · C16, gatekeepers, N3 = CH3 #49e0c8 ·
C21, ai-production = CH4 #a855f7 · ton-history, C26 = CH5 #0098ea.

## C1 · the Arbitrum system (CH2) · 4 ids, one model, 8 states

| id | state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|---|
| C1-s1 | `C1-s1-ethereum.png` | 108.60 | "Ethereum" 108.74 | 114.56 | Ethereum (layer 1, settlement, "slow and expensive when busy"); the rest of the graph a ghosted map |
| C1-s1 | `C1-s1-arbitrum-one.png` | 114.56 | "second layer" 114.56 (the name itself lands at 113.52 if you prefer the swap there) | 118.90 | Arbitrum One + "posts compressed batches" into Ethereum |
| C1-s2 | `C1-s2-treasury.png` | 132.60 | "the token ARB is a vote" 133.32 | 136.08 | dedicated chains group (said at 129.10) + ArbitrumDAO treasury, "ARB = a vote" |
| C1-s2 | `C1-s2-inflow.png` | 136.08 | "collects what the ecosystem earns" 136.08 | 137.90 | the inflow: Arbitrum One fees + the dedicated-chains feed, merging into the treasury ("what the ecosystem earns") |
| C1-s3 | `C1-s3-robinhood-chain.png` | 146.60 | "Robinhood built its own blockchain" 146.80 | 151.10 | the Robinhood Chain tile (a dedicated Arbitrum chain, ETH gas) + "settles to Ethereum" |
| C1-overview | `C1-overview-8.png` | 163.90 | "8 points" 164.38 | 167.12 | whole graph on; net revenue, "10% to the Arbitrum ecosystem", the 8% into the treasury lit |
| C1-overview | `C1-overview-2.png` | 167.12 | "2 to the Developer Guild" 167.12 | 168.40 | + the 2% into the Developer Guild |
| C1-overview | `C1-overview-90.png` | 168.40 | "Robinhood keeps" 168.40 ... "the other 90" 169.48 | 169.867 | + the 90% to Robinhood: the split is whole (THE BALANCE overview, shown once) |

Cue note: the plan cues the 90 on "the other 90" (169.48), which would leave it 0.39 s before the FACE cut; this
file moves it to "Robinhood keeps" (168.40) so the whole split holds 1.47 s. Push: C1-s1-ethereum drifts down
toward the Ethereum band; the overview states take the plain centred push.

## C16 · the Kaspa ladder (CH3) · 2 ids, one model, 4 states

| id | state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|---|
| C16-s1 | `C16-s1-fair-launch.png` | 284.60 | "launched in November of 2021" 285.32 | 289.40 | the bottom rung: 2021-11 fair launch, no premine, "DAGLabs, the research company, dissolved around the launch"; later rungs ghosted |
| C16-overview | `C16-overview-full.png` | 352.40 | "I've covered that in depth" 352.48 | 357.28 | the whole ladder once: four solid rungs on, three dashed rungs |
| C16-overview | `C16-overview-apps.png` | 357.28 | "The apps aren't live yet." 357.28 / "The tooling is early." 358.60 | 360.20 | the two app rungs: based ZK apps (next), full vProgs (under construction) |
| C16-overview | `C16-overview-dagknight.png` | 360.20 | "DAGKnight" 360.20 | 361.70 | DAGKnight, KIP-2, proposed, no date set |

Push: C16-s1 drifts toward the lit bottom rung; the overview rides a slow upward drift (the ladder climbs to the
dashed rungs being spotlit).

## gatekeepers (CH3; the gates in the stylesheet's red = risk) · 3 states

| state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|
| `gatekeepers-ai.png` | 292.10 | "In an AI world" 293.44, "the companies that run the models" 294.74 | 297.22 | row 1: You -> gatekeeper "The AI company, can be told what to do" -> AI models |
| `gatekeepers-bank.png` | 297.22 | "So can the bank" 297.22 | 298.04 | row 2: -> "The bank" -> your money (row 1 stays built) |
| `gatekeepers-foundation.png` | 298.04 | "So can any coin that a foundation controls" 298.04 | 300.30 | row 3: -> "The foundation" -> the coin (rows 1 and 2 built) |

The headline ("Every one of them has a gatekeeper", said at 300.74 under BR-10) is on screen from 292.10. Row 1 is
lit from the cover's first frame (a 2.5 s fully ghosted open would sit dead). This geometry is the A side that N3
answers (you -> gate -> asset versus miners -> blocks -> nodes with the gate slot empty).

## N3 · Kaspa, no gatekeeper (CH3) · 2 ids, one model, 4 states

| id | state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|---|
| N3-s1 | `N3-s1-supply.png` | 302.60 | "Kaspa doesn't." 302.64, "The supply comes only from mining" 303.56 | 307.75 | miners -> blocks ("supply comes only from mining") + the emission formula ("published since 2022"); full nodes ghosted; NO gatekeeper slot at all |
| N3-s2 | `N3-s2-whole.png` | 319.27 | "That's the architecture argument" 319.32 | 321.16 | the whole graph on, the empty dashed gatekeeper slot shown ("no one to call", its connector cut) |
| N3-s2 | `N3-s2-run.png` | 321.16 | "Who can run it" 321.16 | 322.04 | full nodes on home servers ("open code, anyone can run it") |
| N3-s2 | `N3-s2-noone.png` | 322.04 | "and who can't stop it" 322.04 | 325.80 | the empty slot: "where a gatekeeper would be: no one to call" |

## C21 · the Bittensor system (CH4) · 2 ids, one model, 10 states

| id | state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|---|
| C21-s1 | `C21-s1-network.png` | 379.80 | "an open network of markets" 380.60, "subnets" 382.72 | 383.70 | the subtensor chain (a block every 12 s, pays in TAO) -> the 128 subnet slots ("each one a market") |
| C21-s1 | `C21-s1-compute.png` | 383.70 | "And each subnet produces one digital commodity" 383.70 | 384.43 | one slot opens into ONE SUBNET; commodity chip "compute" |
| C21-s1 | `C21-s1-inference.png` | 384.43 | (label cycle) | 385.16 | chip "inference" |
| C21-s1 | `C21-s1-storage.png` | 385.16 | (label cycle) | 385.88 | chip "storage" |
| C21-s1 | `C21-s1-prediction.png` | 385.88 | (label cycle) | 386.60 | chip "prediction" |
| C21-s2 | `C21-s2-miners.png` | 389.40 | "Miners produce the thing" 389.44 | 390.68 | Miners |
| C21-s2 | `C21-s2-validators.png` | 390.68 | "validators score the miners" 390.68 | 392.42 | Validators + the miners -> validators arrow |
| C21-s2 | `C21-s2-stakers.png` | 392.42 | "stakers back the validators" 392.42 | 393.94 | Stakers + their arrow into the validators |
| C21-s2 | `C21-s2-owner.png` | 393.94 | "the subnet owner designs the rules" 393.94 | 396.12 | Subnet owner + "rules" |
| C21-s2 | `C21-s2-paid.png` | 396.12 | "Everybody gets paid in TAO" 396.12 | 397.55 | the TAO arrow into the subnet + the per-tempo split pills 41% miners · 41% validators and their stakers · 18% owner + the caption |

Cycle note: the spoken list "Compute, inference, storage, prediction" lands at 386.64 to 388.76, under IMG-15 (the
four-stall night market), so the chip cycles BEFORE the words (about 0.73 s a label) as the illustration of "one
digital commodity"; C21-s2 re-enters on "compute". The split pills are hidden until "paid" (they appear on the
spoken line, never as a preview inside a lit card).

## ai-production (CH4) · 4 states · deliberately NEUTRAL on ownership

| state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|
| `ai-production-wages.png` | 409.45 | "was paid in wages" 409.96 | 410.54 | Wages ("the labor AI replaces was paid in wages") |
| `ai-production-production.png` | 410.54 | "The AI itself" 410.54 | 412.08 | Wages dims; "replaced by" -> AI production lit |
| `ai-production-inputs.png` | 412.08 | "compute, models, and data" 412.08 to 413.26 | 414.42 | the three inputs (no ownership label on any of them; RULED at GATE 3) |
| `ai-production-paid.png` | 414.42 | "and gets paid for" 414.42 to 415.36 | 415.433 | the output arrow -> "Gets paid for" |

Cue note: the plan's cue for the last state is "gets paid for" (414.86, 0.57 s before the FACE cut); "and" at
414.42 gives it a full second.

## ton-history (CH5) · 3 states

| state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|
| `ton-history-2018.png` | 505.65 | "Telegram designed it in 2018" 506.56 to 507.86 | 508.72 | 2018: Telegram designs TON (a whitepaper and a 1.7B private sale of Gram) |
| `ton-history-2020.png` | 508.72 | "The SEC shut down the sale in 2020" 508.72 to 510.50 | 510.98 | 2020: the SEC shuts the sale down (Telegram returns 1.2B, pays an 18.5M penalty) |
| `ton-history-2021.png` | 510.98 | "The community rebuilt it as Toncoin" 510.98 to 512.60 | 513.45 | 2021: the community relaunches it (The Open Network, the coin renamed Toncoin) |

## C26 · the TON system (CH5) · 2 ids, one model, 4 states

| id | state PNG | in (s) | cue word (s) | out (s) | what is lit |
|---|---|---|---|---|---|
| C26-s1 | `C26-s1-miniapps.png` | 529.50 | "Every crypto mini app inside Telegram" 530.00 | 534.64 | Telegram on (over 1B monthly users, Durov's count, March 2025); Mini Apps lit, "must run on TON since January 2025", wired into the (ghosted) chain |
| C26-s1 | `C26-s1-wallet.png` | 534.64 | "A built-in Gram wallet" 534.64 | 538.80 | Gram Wallet, "rolling out since 2026-08-31", "holds Gram on TON" |
| C26-overview | `C26-overview-full.png` | 555.60 | "the chain wired into a platform" 555.92 | 557.64 | the whole graph once: + The Open Network (coin Gram, about 400 validators, Telegram the largest), Stablecoins on TON (about 720M, mostly USDT), Cocoon (GPU owners paid in TON, live since November 2025, scale not disclosed) |
| C26-overview | `C26-overview-billion.png` | 557.64 | "with over a billion users" 557.64 | 562.033 | the platform box + its wires into the chain spotlit |

## Live figures on these diagrams ([VERIFY] at render, per DATA.md)
C26: "about 400 validators" (Durov 2026-05-12; Coin Bureau counted 382 on 2026-09-04) and "about 720M, mostly USDT" stablecoins on TON (the R7 default ruling: DefiLlama TOTAL stablecoin float, 718.93M read 2026-10-10, matching R7 on screen ~30 s earlier; the VO says "about 750 million").
Everything else on the Type 2 diagrams is fixed history or documentation.
