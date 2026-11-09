# WB3 CUES (quant, longform-edited)

_Written by `whiteboard-builder` 2026-11-04 (round 3, after visual-qa on the round-2 stills). Comp `QuantWB3` (`video-creation/remotion/src/whiteboard/beats/QuantWB3.tsx`), 1920x1080 @30, 706 frames, pen `paper-quant`, no audio. LOCAL 0 = spine 95.580 s (`spine/ALL.f.enhanced.medium-words.json`); every cue hangs on the spoken word in its row, the thing draws as he names it. The edit-plan author hangs the draw-on SFX on this table. No numbers on screen; no product names, no venue names, no bank names; the four islands are `QUANT_ISLANDS` with WB1's seeds (the same drawings as WB1 / WB2)._

Micro-scenes: 1 the stage, the four islands return (0.0 to 1.7) · 2 the obvious move: one more island, one big chain, every bank pulled toward it, struck out (2.28 to 10.9) · 3 Quant is a layer above the islands; the bank keeps its core systems, its rails, its custody (11.04 to 17.1) · 4 connects through APIs, orchestrates the movement, never holds the funds (17.86 to 22.4).

| local s | spine s | frame | word | what draws |
|---|---|---|---|---|
| 0.00 | 95.58 | 0 | So | the coast and the sea return (the stage, under the compositor's fade-in): the coastline, the page tints below it, wave ticks |
| 0.46 | 96.04 | 14 | obvious | the four islands draw back on, A first, one every 0.08 s (land, palm, then its bank, vault door and ledger; ~1 s each, all done by 1.7) |
| 2.28 | 97.86 | 68 | island | a fifth, smaller island (no palm) sketches in the middle of the four, under island D (0.6 s) |
| 3.50 | 99.08 | 105 | chain | four chain-linked blocks land on it, one every 0.22 s (3.50 / 3.72 / 3.94 / 4.16), the links after each (done ~4.6) |
| 5.20 | 100.78 | 156 | come | four ink arrows pull from the four islands toward it, one every 0.1 s (A 5.20, B 5.30, D 5.40, C 5.50; 0.6 s each, done 6.1 = "here") |
| 9.26 | 104.84 | 278 | not | an orange X strikes the fifth island and its chain out (two strokes, 0.45 s) |
| 10.42 | 106.00 | 313 | Quant | the rejected idea ghosts: the fifth island, its chain, the four arrows and the X fade to 42 percent (0.5 s) |
| 11.04 | 106.62 | 331 | layer | the orange band draws in the sky over all four islands (0.7 s, no shadow) |
| 11.48 | 107.06 | 344 | above | "Quant" types onto the band (orange heading font, letter-spaced, centred) |
| 13.80 | 109.38 | 414 | core | a green check badge pops above every bank's roof, A first, one every 0.08 s |
| 15.30 | 110.88 | 459 | payment | a rail track draws on every island's lawn in front of the bank's steps, receding to the right (two heavy rails, sleepers past both rails), one every 0.06 s (0.3 s each) |
| 15.62 | 111.20 | 469 | rails | (the word runs 15.54 to 15.94; every track is complete by 15.78) a check badge pops under every track's far end, one every 0.06 s |
| 16.32 | 111.90 | 490 | custody | a check badge pops on every vault door's lower-right, A first, one every 0.08 s |
| 17.86 | 113.44 | 536 | connects | four orange threads drop from the band's bottom edge to the four vault doors, one every 0.12 s (A 17.86, B 17.98, C 18.10, D 18.22; 0.5 s each), a dot where each lands on the door's rim |
| 19.60 | 115.18 | 588 | APIs | a plug pops where each thread meets the band (prongs into the band, the thread leaving its body), one every 0.08 s |
| 20.40 | 115.98 | 612 | orchestrates | small ink arrows draw on along the band left of "Quant", one every 0.07 s from the left, and keep running right; the run right of "Quant" starts 0.35 s later (20.75) |
| 21.32 | 116.90 | 640 | movement | a coin pops into the band's right end, among the running arrows (the money moving through the layer) |
| 21.94 | 117.52 | 658 | And | a thin orange X crosses the coin out (0.45 s, done 22.39) |
| 21.98 | 117.56 | 659 | And | "never holds funds" types above the band in orange at 40 cps (done 22.41 = frame 672, 0.8 s before the compositor's 0.3 s fade starts at frame 697) |

Notes:
- Round 3 re-timed the payoff so the finished drawing holds ~0.8 s before the fade (visual-qa asked for a tOut ~0.6 s later OR an earlier label; the next beat's window begins at 119.100, so the window was not touched): the coin now pops on "movement" (21.32, the money moving through the layer, where it was on "And"), the cross and the label both hang on "And" (21.94 / 21.98, where the label was on "never" at 22.30). If the caller can still give the beat a longer `tOut`, nothing here needs to move.
- The band is hung on "layer" (11.04) and "Quant" on "above" (11.48), not both on "sits above" as the plan proposed: the band IS the layer, and the label needs the band to exist first.
- The ghost (10.42, "Quant") is the one cue not in the plan's list: the struck-out fifth island stays on the page (the beat ends on the finished drawing, nothing is cleared), but fades to 42 percent as the sentence moves to what Quant IS, so the orange X does not compete with the orange band at the payoff.
- The "payment rails" are drawn as a receding rail track on every island's lawn (the islands carried no rails in WB1 / WB2); round 3 made the sleepers overhang both rails and the rails heavier (`RailTrack overhang / heavy`, opt-in so WB12's track is unchanged) after the round-2 track read as a ladder; the badge lands under its far end on "rails".
- "chain-link blocks stacked on it" is drawn as the video's blockchain glyph (the WB12 row of chain-linked cubes, four of them), not a vertical pile, so the chain reads the same as in WB12.
- The orange accents are all the brief's: the strike through the fifth island, the band, "Quant", the four threads, the coin's cross and the payoff label (WB1 and WB2 set their payoff labels in orange too). The check badges are the pen's green with an ink check. Round 3 made the coin's cross thin and orange (an ink X over the ink "$" merged into a blob at viewing size).
- No fences: the brief's scene lists the four islands with bank, rails and vault; WB2's picket fences are not re-drawn.
