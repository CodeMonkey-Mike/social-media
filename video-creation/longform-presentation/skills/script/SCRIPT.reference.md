# examplecoin: SCRIPT

_The SHAPE of a `SCRIPT.md` for the scripted option of a standard presentation video (`script.md`, this folder).
Every fact here is made up (EXAMPLECOIN does not exist, the numbers are fake on purpose): copy the shape, never the
content. Gate: `python video-creation/longform-presentation/skills/script/lint_script.py "media/standard/<p>/SCRIPT.md"`._

| Setting | Value |
|---|---|
| project | examplecoin |
| channel | CryptoRich |
| silence | 800 ms min-silence, 300 ms left between sentences (the track preset) |
| enhance speech | on |
| vertical | on |
| yt post | on |

_The last two rows are EXTRAS (`script.md`, "The extras"): `vertical`, `short`, `yt post`. Write only the ones Mike named
when he started the video; a missing row is off (this example has no `short` row)._

## PRODUCTION CONVENTIONS

The same tags as a long-form edited screenplay. This track uses 5 of them.

| Tag | Means |
|---|---|
| 🖥️ `[SCREENSHARE]` | spoken, on the screen share as filmed: the deck or the browser, with your webcam |
| 🗣️ `[COVER]` | spoken, while a card fills the whole frame. Your webcam is hidden, so you can read the line |
| 👤 `[FACE]` | spoken to the lens, on your full-camera OBS scene: switch to it before the line, back after it. The video centres your face. At most 3 face scenes |
| 🎬 `[SHOW]` | what is on screen for the `[COVER]` lines above it. It starts with the card's name from the CARDS table; a dot and a second word, as in `supply.locked`, is the same card with a different part lit. Not spoken |
| 💬 `[NOTE]` | a note to you. Not spoken |

This track has no title cards or music yet, so the file has no chapter map and no budgets.

## CARDS

| id | kind | shows | states | numbers |
|---|---|---|---|---|
| what-it-is | card | WHAT IT IS: a payment network for vending machines | | |
| how-it-works | chart-still | System-design chart: you, the machine, the network, the token off to the side | | |
| price-line | animated-chart | The price line drawing on from launch to the read date, 2 markers | | 0.11, 9.99 |
| supply | card | THE SUPPLY: total, circulating, locked. One row lit per state | total, circulating, locked | 999, 111, 888 |
| what-to-watch | card | WHAT TO WATCH: 3 things | | 3 |

## CH1 - THE OPEN

💬 `[NOTE]` Look at the slide, not the notes. One breath before the first line.
🖥️ `[SCREENSHARE]` EXAMPLECOIN went from around 11 cents to 9.99 in under a year, and I wanted to know what's behind it.
🖥️ `[SCREENSHARE]` So let's go through it, piece by piece.

## CH2 - WHAT IT IS

🗣️ `[COVER]` EXAMPLECOIN is a payment network for vending machines, and that's the whole product.
🎬 `[SHOW]` what-it-is: the card WHAT IT IS. One line: a payment network for vending machines.
🗣️ `[COVER]` You pay the machine, the machine talks to the network, and the token sits off to the side.
🗣️ `[COVER]` It's off to the side because the product docs never mention it.
🎬 `[SHOW]` how-it-works: a system-design chart. You, the machine, the network, and the token off to the side. It holds for both lines.

## CH3 - THE TOKEN

🗣️ `[COVER]` It started trading at around 0.11, and it's been climbing ever since.
🗣️ `[COVER]` The all-time high is 9.99.
🎬 `[SHOW]` price-line: an animated chart. The price line draws on from launch to the read date, with 2 markers.
🗣️ `[COVER]` The total supply is 999 million tokens.
🎬 `[SHOW]` supply.total: the card THE SUPPLY, 3 rows. The total row is lit.
🗣️ `[COVER]` Only 111 million of those are circulating today.
🎬 `[SHOW]` supply.circulating: The circulating row lights.
🗣️ `[COVER]` The other 888 million are still locked.
🎬 `[SHOW]` supply.locked: The locked row lights.

## CH4 - THE CLOSE

🗣️ `[COVER]` So there are 3 things I'm watching from here.
🎬 `[SHOW]` what-to-watch: the card WHAT TO WATCH, 3 things.
💬 `[NOTE]` Switch OBS to the full-camera scene for the next line, then back.
👤 `[FACE]` That's EXAMPLECOIN. Let me know in the comments if you're holding it.

## NOTES

Prose outside the `## CH<n>` sections is a note for whoever builds the video: it is never spoken and never linted as a
line. Open questions for Mike, the do-not-air list and the recording logistics go here.
