# Clarity Act ensure US Dominance — EDIT-PLAN-prep (pre-build beat ledger)

Beat-indexed plan: every beat → its layer/asset, **zero orphans** (every asset placed or REJECTED). Post-build,
the time-ordered `EDIT-PLAN.md` is generated from the comp; this prep file is preserved. Detail/timing = CUE-SHEET.
Spine: `clarity.d2.deburst.mp4` (6:59). Face gated (blackdetect); COVER = the black beats (most of the runtime).

Layer model: SPINE(face) · COVER{D#|C#|R#|CG#|BR#} · CAPTION(CH1) · TRANSITION · SUB overlay · MUSIC(post-mix).

**⛔ Transition SOURCE prefix (so you can tell at a glance where each transition comes from):**
- **`rmn:`** 📦 = out-of-the-box `@remotion/transitions` (e.g. `rmn:slide`, `rmn:fade`, `rmn:iris`).
- **`lib:`** 🧩 = OUR transition **library** (`../../assets/transitions/library.json` — the Swiftly glitch pack, via `TransitionClip`), e.g. `lib:badsignal-short-1`.
- **`hand:`** ✋ = our **hand-rolled** bespoke overlay code (interpolate/spring; NOT a package or the library), e.g. `hand:film-burn`, `hand:xfade+scale`, `hand:punch-in`, `hand:pop`.
_(Full transition plan + why-each-pick: TRANSITIONS.md. These three prefixes = the canonical three-bucket policy.)_

| Chapter | Beat (spine tc) | Face? | Cover asset(s) | Transition |
|---|---|---|---|---|
| **CH1 hook** | 0:00 "bill stalled" | COVER | R-STALL + BR-CAPITOL | `rmn:fade` / `rmn:iris`(R-STALL) |
| | 0:09 "question too small" | COVER | BR-HEADLINES | `rmn:fade` |
| | 0:16 "biggest money moves" | **FACE** | — | `hand:film-burn` |
| | 0:21 "two bills… 50 years… with crypto" | COVER | BR-CRYPTO | `rmn:fade` |
| | 0:32 "GENIUS signed / CLARITY stuck" | COVER | BR-CRYPTO cont. | `rmn:fade` |
| | 0:38 "Trojan horse for the dollar" | COVER | CG1 (Trojan-horse still) | `lib:badsignal-short-1` |
| **CH2** (card) | 0:43 WWII gold → peg → reserve | COVER | D1 (spotlight 1944) + BR-GOLD | `rmn:slide` (card) |
| | 0:58 abuse / printed more | COVER | D1 (abuse) + BR-PRINT | `hand:xfade+scale` |
| | 1:09 Nixon 1971 | COVER | D1 (spotlight 1971) | `hand:xfade+scale` |
| | 1:22 petrodollar → Treasuries | COVER | D1 (spotlight 1974) + BR-OIL | `hand:xfade+scale` |
| | 1:32 "That's the trick…" | **FACE** | — | `hand:film-burn` |
| | 1:40 "no gold required… slipping" | COVER | D1 (TODAY / takeaway) | `hand:xfade+scale` |
| **CH3** | 1:57 stablecoin isn't magic | COVER | D2 (spotlight coin→reserves) | `hand:xfade+scale` |
| | 1:55 "printing more than economy" | COVER | BR-PRINT2 (or C4 optional) | `rmn:fade` |
| | 2:09 GENIUS 100% reserves | COVER | D2 (reserves) + R-GENIUS | `hand:xfade+scale` |
| | 2:24 "forced buyer, by law" | COVER | D2 (takeaway) + BR-TREASURY | `hand:xfade+scale` |
| | 2:42 "Bretton Woods 3.0… phone" | **FACE** | — | `hand:film-burn` |
| **PLUG** | 2:51 community / link / 50-100x | **FACE** | — | `hand:punch-in` + light leaks |
| | 3:13 "like / subscribe / bell" | FACE | **SUB overlay** (≤1s pop) | `hand:pop` |
| | 3:18 "in a second… loophole tease" | FACE | — | — |
| **CH4** (card) | 3:30 "every gov wants a CBDC" | COVER | CG3 (surveillance) + BR-WORLD | `rmn:slide` (card); CG3 = `lib:badsignal-short-3` |
| | 3:39 "citizens reject / pilot" | COVER | D3 (gov CBDC col) + BR-SURVEIL | `hand:xfade+scale` |
| | 3:52 "private coin / Treasury control" | COVER | D3 (private col) | `hand:xfade+scale` |
| | 4:10 "That is the Trojan horse…" | **FACE** | — | `hand:film-burn` |
| | 4:21 "app that pays them" | COVER | D3 (takeaway) | `hand:xfade+scale` |
| **CH5** | 4:27 "ban's in GENIUS, Circle can't pay" | COVER | D4 (spotlight issuer) | `hand:xfade+scale` |
| | 4:47 "still earning… what gives?" | **FACE** | — | `hand:film-burn` |
| | 4:55 "ban stops at issuer" | COVER | D4 (issuer) | `hand:xfade+scale` |
| | 5:00 "Coinbase 3.5% loyalty reward" | COVER | D4 (platform) + C3 + R-FORBES | `hand:xfade+scale` |
| | 5:12 "Coinbase-shaped hole" | COVER | D4 (full/takeaway) | `hand:xfade+scale` |
| | 5:14 "$1.35B to Coinbase alone" | **FACE** | — | `hand:film-burn` |
| | 5:19 "banks want it closed / CLARITY fight" | COVER | R-CLARITY (verdict) | `rmn:iris` |
| | 5:28 "decides if loophole lives/dies" | COVER | D4 held / BR reuse-avoid | `rmn:fade` |
| **CH6** | 5:48 "yields near multi-decade highs" | COVER | C1 (yields) | `hand:xfade+scale` |
| | 5:59 "manufactured new dollar users" | COVER | D1 callback / BR reuse-avoid | `hand:xfade+scale` |
| | 6:09 "trillions of new demand" | COVER | C2 ($2-3T) | `hand:xfade+scale` |
| | 6:19 "put the dollar in every hand" | **FACE** | — | `hand:film-burn` |
| | 6:29 "purchasing power → debt / prices ↑" | COVER | CG2 (dollar→globe) + BR-INFLATION | CG2 = `lib:badsignal-short-2`; BR = `rmn:fade` |
| | 6:46 "guarantees another 50" | COVER | BR-INFLATION cont. | `rmn:fade` |
| | 6:53 "smart money… can't print" | **FACE** | — END on the face; HARD CUT to black on the last word (Mike: cut tight, NO cutaway) | `hand:film-burn` |

**Orphan check:** every built asset (D1-D4, C1-C3, SUB, CG1-CG3) is placed above. Every specified acquire (R-STALL,
R-GENIUS, R-CLARITY, R-FORBES, BR-CAPITOL/HEADLINES/CRYPTO/GOLD/PRINT/PRINT2/OIL/TREASURY/WORLD/SURVEIL/INFLATION) is placed.
**BENCH (deliberately unused):** BR-BITCOIN (CH6 ends on the face, no hard-asset cutaway — Mike); C4 money-printing
chart DROPPED (CH3 stays on BR-PRINT2 — Mike). Both are intentional drops, not orphans.
**No-reuse:** BR-PRINT + BR-PRINT2 are two distinct clips; CH5 5:28 + CH6 5:59 must NOT reuse an earlier BR — hold a
container (D4/D1-callback) instead. Enforced by `lint-covers.js` at comp time.
