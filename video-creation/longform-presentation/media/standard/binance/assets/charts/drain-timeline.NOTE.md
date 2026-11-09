# drain-timeline: animation spec (ov2-drain, "The Drain")

Clip: card `ov2-drain` in `../../overlays/cards.json`, spine 76.0 to 112.3 s = **36.3 s = 1089 frames at 30 fps**, canvas
**1464 x 1080** (the deck area). Local t = spine seconds minus 76.0. Brief: `../../overlays/ov2-drain.brief.md`.

The page IS the animation: `window.setT(t)` sets the whole frame as a pure function of t (no CSS transitions or
animations, no rAF, no clock; frames verified byte-identical whatever order t is visited in). Open the page with
`#t=12.5` in the URL to inspect one moment; with no hash it shows the final state.

Render (the caller, ~0.44 s per frame here, so ~8 min for the clip):
```
python video-creation/longform-presentation/skills/card-overlays/html_clip.py "video-creation/longform-presentation/media/standard/binance/assets/charts/drain-timeline.html" --frames 1089 --out "video-creation/longform-presentation/media/standard/binance/overlays/ov2-drain.mp4"
```

## The picture
- A time BAND across the middle (y 680 to 720). Thefts rise ABOVE it (red bars), the defense hangs BELOW it (cyan
  bars, a cyan pill). One vertical scale for both sides: 156 px per $1B. Amounts are gold, drain times red, freeze
  times cyan (the brief's roles). Faint gridlines $1B / $2B above, $1B below (the lower one only once a freeze exists);
  each gridline stops short of any amount block it would run through (recomputed every frame from the text boxes).
- The band runs 66 px past its first and last tick (64 to 1400 zoomed, 274 to 1400 for the night), so no label sits
  on a rounded end. Night ticks are 20:00, 21:00, 22:00, 23:00: no 00:00 label, because the 23:56 tick would sit on
  it and read as a midnight mark (the scale still runs to 00:00).
- Each amount label hangs to the LEFT of its bar top, right-aligned. The three bars get taller left to right, so a
  label can never sit over a taller bar, zoomed in or out.
- Two scales, both linear: ZOOMED 20:00 to 20:30 while he walks the drain (the three marks need the room: on the
  full-night scale 20:20 and 20:23 are 13 px apart), then one camera pull-back to the full night 20:00 to 00:00
  as he reaches the freezes. The pull-back itself shows "most of it in ~20 min": the spike collapses to a sliver
  at the left of a long, quiet night.

## What moves when (cued to the transcript, `spine/binance EDIT.medium-words.json`)
| t (local) | he says | what moves |
|---|---|---|
| 0.00 to 1.50 | (pause, "initially at") | eyebrow fades 0.0 to 0.4; headline fades and rises 14 px 0.1 to 0.6; divider grows 0.35 to 0.75; the band draws left to right 0.15 to 1.2 (ease-out) and each tick label appears as the band passes it; gridlines fade in 0.6 to 1.4; source line 0.8 to 1.4 |
| 1.60 | "2005" (1.58) | 20:05 turns red in the band (0.3 s); the XRP bar rises to ~$296M (0.45 s, ease-out cubic); "~$296M" fades in at 1.85 |
| 5.46 | "wallets first emptied on the XRP ledger" | a flag line drops from 20:05 (0.25 s); "First wallets emptied / on the XRP Ledger" and "233.46M XRP" fade in (0.35 s) |
| 10.28 | "18,270 Bitcoin leave" | 20:20 turns red; the BTC bar rises to ~$1.47B (0.45 s); "~$1.47B / 18,270 BTC leave" at 10.45 |
| 14.36 | "50 pre-signed approvals hit Ethereum in one transaction" | a connector drops from 20:20; the ONE ETHEREUM TRANSACTION card scales 0.94 to 1 and fades in (0.35 s); its 50 ticks stack in left to right, dim, 14.50 to 15.17 |
| 17.58 | "pre-signed approvals" (the repeat) | the 50 ticks light up left to right 17.60 to 18.50; the card border brightens 18.3 to 18.7 |
| 21.14 | "three minutes later" | an arrow draws up from the card to the 20:23 column (0.45 s): the transaction triggers the sweep; "20:23" appears red in the band at 21.30 while "20:25" fades out (0.3 s), so the two never read as one clump |
| 23.28 | "2.5 billion" | the tallest bar rises to ~$2.53B (0.6 s); "~$2.53B" at 23.50 |
| 26.06 | "in a single transaction" | "167,464 ETH + 63 tokens" and "In a single transaction:" fade in (0.35 s) |
| 27.62 | "the wallet sweeps itself" | "the wallet sweeps itself" fades in; the bracket draws over 20:05 to 20:25 (0.5 s); "most of it in ~20 min" at 27.80 |
| 28.43 to 29.68 | (end of "itself" 28.42) | THE PULL-BACK, ease-in-out cubic: the visible span goes 30 min to 240 min (interpolated geometrically, so it reads as one even camera move), the plot's left edge slides 130 to 340 px to make room for the hanging labels; bars narrow 48 to ~10 px; every label rides its bar; 5-minute ticks fade as they crowd; hour ticks slide in and fade in at the band end; the band's "20:23" fades over the first 30 % of the move |
| 28.50 to 28.85 | | the zoomed-phase story below the band (XRP flag, the transaction card, its arrow) fades out, clearing that space for the defense |
| 29.00 | "Tether starts freezing" (28.92; 21:01 enters the scale at 28.98) | the Tether bar drops below the band to 971.1M USDT (0.45 s); "21:01 / Tether starts freezing / 971.1M USDT, first wallet" at 29.15; the lower $1B gridline and a faint cyan orb (bottom left) fade in from 29.0 |
| 30.00 to 31.25 | | the further ETH sweeps tick up quietly on the band: 20:41 (30.00), 20:59 (30.25), 21:04 (30.50), 21:44 (30.85), 22:39 (31.25), 0.3 s each. Small, uniform marks: they are unsized |
| 31.45 | | a faint bracket draws over 20:41 to 22:39 (0.45 s); "more ETH sweeps" fades in centred over it at 31.60 |
| 31.88 | "40 minutes later" | the Circle bar drops to 823M USDC at its real 21:04 (0.45 s); "21:04 / Circle freezes / 823M USDC" at 32.03 |
| 34.24 | "withdrawals are switched off that night" | the pill scales 0.94 to 1 and fades in (0.4 s); its padlock shackle closes 34.50 to 34.80 |
| 35.10 | (before "that night", 35.54) | the last sweep ticks up at 23:56 and closes the window; "23:56 last sweep" at 35.20 |
| 35.55 to 36.30 | | hold on the final state (s5). card_overlays adds its own 11-frame fade in and 0.3 s fade out over the clip |

## State stills (shot after `setT`, 1464 x 1080)
- `drain-timeline-s1.png` t=0.5: the build-in (title up, the band drawing)
- `drain-timeline-s2.png` t=8: the XRP mark with its description
- `drain-timeline-s3.png` t=20: + the BTC mark and the lit 50-approval transaction
- `drain-timeline-s4.png` t=28.5: the zoomed payoff: all three marks, the arrow, the bracket
- `drain-timeline-s5.png` t=36.3: the whole night: the spike, the sweeps to 23:56 (the last one labelled alone), the freezes, withdrawals off

## Every number and where it comes from (`../../RESEARCH.md`)
| on screen | RESEARCH |
|---|---|
| Thursday, 29 Oct 2026, UTC | 1.1 Date; header (times UTC) |
| 20:05, ~$296M, 233.46M XRP, XRP Ledger | 1.3 "20:05 to 20:09 ... 233.46M XRP"; 1.2 "XRP Ledger: 233.46M XRP (~$296M)" |
| 20:20, 18,270 BTC, ~$1.47B | 1.3 "20:20 ... 18,270 BTC"; 1.2 "18,270 BTC (~$1.47B TRM ...)" |
| one Ethereum transaction, 50 pre-signed approvals | 1.3 "20:20 ... ONE Ethereum tx carrying 50 EIP-7702 authorizations"; 1.4 |
| 20:23, ~$2.53B, 167,464 ETH + 63 tokens, single transaction | 1.3 "~20:23/20:24: Binance 14 swept: 167,464 ETH + 63 tokens ... ~$2.53B ... in ONE transaction" |
| most of it in ~20 min | 1.1 Speed "most of the theft occurred in about 20 minutes starting 20:05 UTC" |
| sweeps 20:41, 20:59, 21:04, 21:44, 22:39, 23:56 | 1.3 "Further ETH sweeps: ..." |
| 21:01 Tether, 971.1M USDT, first wallet | 1.3 "21:01: Tether freezes 971.1M USDT in main receiving wallet" |
| 21:04 Circle, 823M USDC | 1.3 "21:04: Circle freezes 823M USDC" |
| Withdrawals switched off that night | the deck's wording (slide 2); RESEARCH has no switch-off time (only Binance saying at 22:32 that withdrawals were paused), so it is a status pill, not a timed mark |
| $1B / $2B | axis scale only |

## Calls made here (worth a look)
- Circle is never named aloud; it is cued to "40 minutes later" as the brief asks (the repeat "starts freezing" at 33.08 is the alternative).
- The XRP bar rises on "2005" (1.58) as the brief asks; its description and "233.46M XRP" wait for "XRP ledger" (5.46) so XRP is not on screen before he says it.
- The 50-approval transaction is drawn as one card holding 50 marks (one per approval), and an arrow from it to 20:23 lands on "three minutes later": the cause, then the $2.53B effect on "2.5 billion".
- Amounts carry a tilde on all three bars (RESEARCH gives all three as approximate); the deck prints "$2.53B" without one.
