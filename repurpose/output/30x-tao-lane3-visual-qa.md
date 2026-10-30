# 30x-tao: Lane 3 visual QA

**QA date:** 2026-10-28. Every one of the 18 images was opened and checked against its prompt in `30x-tao-lane3-plan.json` and against the image rules in `repurpose/SKILL.md`.
Carousel versions: the Kaspa set (470961cc to 181dfd47) uses **V4** (a hook photo, then white data slides). The TAO set (67669f04 to 5d125c0a) uses **V2** (teal editorial). Neither set is V1, so the V1 chartreuse rule does not apply to this batch.

## Summary
- Checked: 18 · Passed: 16 · Failed: 2
- Must fix (most severe first):
  1. `yt/yt-posts-cf92d75e-04-check-your-wallet.png`: the headline is misspelled ("youhold").
  2. `yt/yt-posts-5d125c0a-05-question.png`: the comma in the title overlaps the line below it.

## Per asset

| # | Asset | Verdict | Defects / notes | Fix |
|---|---|---|---|---|
| 1 | x/x-tweets-759ab28b-kaspa-tokens-bridge-to-the-l1.png | PASS | All prompt beats are there: the Kaspa coin with the mirrored-K logo on glowing bedrock, plain-faced coins crossing the bridge, and a rickety scaffold propped up by a server rack. No text. Nothing is clipped. Minor: the Kaspa coin has no visible face, although the prompt asked for "a calm confident face". | none |
| 2 | x/x-tweets-93d3543b-tao-is-the-arena.png | PASS | The arena floor carries a large glowing tau. The competitor coins are plain. No text. Note: the tau stem curves right, not left as the prompt says. That matches the real Bittensor glyph, so it is acceptable. | none |
| 3 | x/x-tweets-387cac08-new-high-every-year.png | PASS | Blank gold coin with a raised fist, a chain of flagged peaks with plain flags, a rusty wrench and a sunrise. Minor: the wrench handle has faint engraved marks, but no characters can be read. | none |
| 4 | x/x-tweets-37518187-not-a-bubble-revenue-is-here.png | PASS | Coin in a hard hat, a crane lowering a server rack onto the foundation, and the bubble beside it. The bubble is shown shattered rather than "deflated", which still reads as popped. The blueprints in the bottom-right corner have no legible text. | none |
| 5 | x/x-tweets-cd1eb7d1-kaspa-haters-proven-wrong.png | PASS | Kaspa coin stacking a glowing tower, with slumped hecklers behind glass. Minor: the coin's expression reads more weary than "quietly amused". | none |
| 6 | x/x-tweets-2144c1b6-robots-mass-produced-like-cars.png | PASS | Unbranded white humanoid robots on a line that runs to the horizon, and an awed coin in a hard hat. The coin has cartoon eyes and a mouth but no symbol, logo or text. No text anywhere. | none |
| 7 | ig/ig-single-759ab28b-kaspa-tokens-bridge-to-the-l1.png | PASS | Proper 4:5 recomposition of #1, with the same beats. The Kaspa coin now has a face. Nothing is clipped. | none |
| 8 | ig/ig-single-cd1eb7d1-kaspa-haters-proven-wrong.png | PASS | 4:5 version of #5. Hecklers with their heads in their hands behind glass. Tower and coin are clean. No text. | none |
| 9 | yt/yt-posts-470961cc-01-hook.png | PASS | Matches the V4 hook: a full-bleed Kaspa coin with the mirrored K, a chart bubble at top right, "KASPA TOKENS ARE LIVE" in white and "ON THE L1 ITSELF" in green, and "SWIPE FOR MORE". **No pagination dots**, so the V4 dots hazard did not ship. Nothing is clipped. | none |
| 10 | yt/yt-posts-0874b19f-02-what-changed.png | PASS | All text matches the prompt exactly (stat boxes, column heads, both bullets). Page number "2" appears once. Advisory: the six comparison rows are empty, as the prompt specified, but they look unfinished. If Mike flags this, regenerate with short row text (for example "indexer decides ownership" / "covenant enforces rules"). | none (advisory) |
| 11 | yt/yt-posts-24deabac-03-the-migration.png | PASS | Text matches the prompt. The KRC20 → BRIDGE → KCC-20 flow uses green arrows. Page number "3" appears once. Minor: the "BRIDGE: ONE WAY" stat box uses a wallet icon. | none |
| 12 | yt/yt-posts-cf92d75e-04-check-your-wallet.png | **FAIL** | **The title is misspelled: it renders as "Check where youhold them"**, with no space between "you" and "hold". This is on the headline, which every viewer reads first. Everything else matches: the stat boxes, the dim cobwebbed wallet with an arrow to the checked wallet, both "MY MOVE" bullets, and page number "4" once. | Regenerate this slide (same V4 reference and prompt) and add: "title must read exactly 'Check where you hold them' with normal word spacing". Do not patch it in place, because the bold title kerning will not survive an inpaint. |
| 13 | yt/yt-posts-181dfd47-05-question.png | PASS | Text matches the prompt. Page number "5" appears once. Advisory: the A/B/C options appear twice (in the stat boxes and again as panel heads), and the three panels below them are empty. The prompt asked for this, but the slide has a lot of redundant white space. | none (advisory) |
| 14 | yt/yt-posts-67669f04-01-hook.png | PASS | V2 editorial look: teal counter, white all-caps title, teal accent line, dark box with "THE CLAIM". The counter "1 OF 5" appears exactly once. No em dashes. Text matches the prompt. Nothing is clipped. | none |
| 15 | yt/yt-posts-9276dbdb-02-one-subnet-each.png | PASS | "2 OF 5" appears exactly once. Title, accent line and the "HOW IT WORKS" body all match, and the body uses a semicolon rather than an em dash. Nothing is clipped. | none |
| 16 | yt/yt-posts-b072cf73-03-centralized-talk.png | PASS | "3 OF 5" appears exactly once. All text matches ("21 million hard cap...", "THE RECEIPT"). Nothing is clipped. | none |
| 17 | yt/yt-posts-277c6c82-04-robotics-narrative.png | PASS | "4 OF 5" appears exactly once. RBTX, October 21, Tesla/AMD/Nvidia and the "WHY TAO" body all match. Nothing is clipped. | none |
| 18 | yt/yt-posts-5d125c0a-05-question.png | **FAIL** | **The text collides in the title: the comma after "TAO," hangs down into line 2 and sits on top of the "E" in "RENDER"**, so it reads like "RENDÉR". The leading is too tight for a comma on line 1. Everything else is correct: "5 OF 5" appears once, "Pick one and defend it", and the "TELL ME IN THE COMMENTS" body. | Regenerate (same V2 reference and prompt) and add: "generous line spacing in the title; the comma after TAO must not touch the line below". If a regeneration still collides, change the title to "TAO, NEAR OR RENDER: FIVE YEARS?" only with Mike's OK, since that changes the copy. |

## House-style checks (batch-wide)
- **Counters:** V2 counters "N OF 5" each appear exactly once, top left, on all five TAO slides. On the V4 Kaspa slides, the circled page numbers 2 to 5 each appear once, and the hook has none. Correct throughout.
- **No stray text:** none of the six X images or the two IG images contains any text. Faint wrench engraving (#3) and blueprint lines (#4) are not legible.
- **Exemplar match:** the Kaspa set is consistent with V4 (photo hook plus white data cards) and the TAO set is consistent with V2 (near-black, teal accent, dark box). No minimalist off-brand slides.
- **Em dashes:** none rendered on any slide.
- **Palette:** V2 teal is on-hue on every slide. V1 is not used, so there is no chartreuse risk.

## Must fix
1. `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt\yt-posts-cf92d75e-04-check-your-wallet.png`: the headline reads "youhold". Regenerate.
2. `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt\yt-posts-5d125c0a-05-question.png`: the comma after "TAO," collides with the "E" in "RENDER". Regenerate with looser title leading.
