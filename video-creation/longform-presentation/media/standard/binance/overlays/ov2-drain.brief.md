# ov2-drain: ANIMATED chart "The Drain" (Thursday night, UTC), a time-driven HTML page

Video: `media/standard/binance/` (longform-presentation, format 4 "standard"). The chart is composited INSIDE
the deck area of the screen share: **canvas 1464 x 1080** (not 1920). Mike's webcam stays visible to the right.
It plays for **36.30 s = 1089 frames at 30 fps** while he narrates the timeline on slide 2 of `../binance.html`
(the "The Drain" column). Fact source: `../RESEARCH.md` (the timeline, lines ~40-60, and the EIP-7702 section).
Every number on screen must be in RESEARCH.md; the deck's wording is the wording to keep.

## What it shows
An EVENT TIMELINE with amounts: a horizontal time axis (20:00 to 00:00 UTC, Thu 29 Oct 2026) with event marks
rising as he names them, their height = the amount where one is sourced, a bracket over 20:05 to 20:25 reading
"most of it in ~20 min", and the defensive events (Tether freezes, Circle freezes, withdrawals switched off) in
a second color below or after the thefts. Chapter accent: red for the drain, cyan for the freezes, gold for the
amounts. Keep it a chart (axis, marks, labels), not a table.

Events (from RESEARCH.md; check them there):
| UTC | event | amount |
|---|---|---|
| 20:05 to 20:09 | five Binance XRP wallets emptied to one attacker address (first move) | 233.46M XRP, ~$296M |
| 20:20 | 18,270 BTC leave the BTC hot wallet; same moment ONE Ethereum tx carries 50 EIP-7702 authorizations signed with the "Binance 14" key | ~$1.47B (TRM, at the time) |
| ~20:23 | Binance 14 swept in ONE transaction (167,464 ETH + 63 tokens) | ~$2.53B |
| 20:41, 20:59, 21:04, 21:44, 22:39, 23:56 | further ETH sweeps (small marks, the last one closes the window) | unsized |
| 21:01 | Tether freezes 971.1M USDT (first wallet; more within 17 min) | 971M USDT |
| 21:04 | Circle freezes 823M USDC | 823M USDC |
| that night | Binance switches withdrawals off | (no amount) |

## The narration it is cued to (LOCAL seconds = spine seconds minus 76.0; the clip's t)
```
0.38 initially at   1.58 20:05 ("2005")   3.98 8 p.m.   5.46 wallets first emptied on the XRP ledger (7.04)
9.24 15 minutes later   10.28 18,270 Bitcoin leave (13.18)   14.36 50 pre-signed approvals hit Ethereum in one transaction (16.92)
17.58 pre-signed approvals (19.18)   20.02 crazy
21.14 three minutes later (22.52)   23.28 2.5 billion (25.34)   26.06 in a single transaction   27.62 the wallet sweeps itself (28.42)
28.92 Tether starts freezing (29.84)   31.88 40 minutes later   33.08 starts freezing   34.24 withdrawals are switched off that night (35.82)
36.30 END
```
Choreography (what appears when): axis + title draw 0.0 to 1.5; the 20:05 XRP mark at 1.6; the 20:20 BTC mark at
10.3 and the "50 approvals, one tx" callout at 14.4; the 20:23 $2.53B mark (the tallest) at 23.3 with "one
transaction" at 26.1; the ~20 min bracket at 27.6; Tether freeze mark at 28.9; Circle at 31.9 (he says "40 minutes
later" loosely, keep the real 21:04); "withdrawals off" at 34.2; the later ETH sweeps can tick in quietly between
28 and 36 (or as the window extends to 23:56). Each appearance: a quick rise / draw (0.3 to 0.5 s), ease-out.
Nothing should appear BEFORE he says it.

## Deliverable (your fixed layout, but the project is this one)
- `media/standard/binance/assets/charts/drain-timeline.html`: ONE standalone page, body exactly 1464 x 1080, the
  locked stylesheet / fonts of the longform-edited presentation system (dark navy near-black, Playfair / JetBrains
  Mono / DM Sans), and a global **`window.setT(t)`** (t = local seconds, 0 to 36.3) that sets the WHOLE visual
  state as a PURE FUNCTION of t: no CSS transitions, no CSS animations, no requestAnimationFrame, no Date.now().
  The caller renders it frame by frame (`setT(f / 30)` + screenshot) into the clip, so the same t must always give
  the same pixels. Easing is done in your JS from t.
- State stills for QA: `drain-timeline-s1.png` (t=0.5), `-s2.png` (t=8), `-s3.png` (t=20), `-s4.png` (t=28.5),
  `-s5.png` (t=36.3), shot at 1464 x 1080 after `setT`.
- The animation-spec note (what moves, when, hung on which word) in `drain-timeline.NOTE.md`.
No em dashes on screen. No table. Numbers only from RESEARCH.md.
