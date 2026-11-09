# Visual QA: batch `kaspa-cocktails`, Lane 3 images (2026-11-02)

Checked against: `repurpose/output/kaspa-cocktails-lane3-plan.json` (each image's prompt + `carousel_versions`)
and the `repurpose/SKILL.md` image rules (tweet house style, Kaspa mark orientation, IG 4:5 companions, V2/V4
carousel templates + exemplars, counters exactly once, no stray text, no em dashes, no V4 page dots).
I opened all 21 files in full and zoomed in on every Kaspa mark, every text block and all four corners (with
brightness boosted, to look for watermarks).

**Batch-wide checks:**
- All 21 files exist.
- Every MD5 is unique. No file is a copy of a reference or exemplar.
- Sizes are right: X 1254x1254 (1:1), IG 1122x1402 (4:5), YT 1254x1254 (1:1).
- None of the images is blank or a failed capture.
- No watermark, signature or initials in any corner.
- **No V1 slides in this batch**, so the V1 chartreuse check does not apply.
- V2 teal measures 175.0 to 180.3 deg, in line with the healthy exemplars (174.5 to 178.9 deg).
- The V4 hook green measures 133 deg (RGB 33,248,81). That is house neon green, not chartreuse.
- No em dashes in any rendered text.

## Summary

| | |
|---|---|
| Checked | 21 |
| PASS | 16 |
| FAIL | 5 |

**must_fix (most severe first):**
1. `schedule-tweets/images/yt/yt-posts-f3e28fb4-04-kaspa-gets-a-ship.png`: a glitch on a word that you can see at full size
2. `schedule-tweets/images/yt/yt-posts-8ec97d8b-02-two-first-bear-markets.png`: Bitcoin and Kaspa logos the prompt banned, and the Kaspa mark is green instead of teal
3. `schedule-tweets/images/yt/yt-posts-718c52b0-03-kaspa-skipped-2022.png`: same logo problem
4. `schedule-tweets/images/yt/yt-posts-ffb24010-04-september-reclaim.png`: same logo problem
5. `schedule-tweets/images/yt/yt-posts-d07b1827-05-question.png`: Kaspa logo on option B

## Per-asset results

### X tweet images (1:1)

**PASS** `schedule-tweets/images/x/x-tweets-3ead6e3e-kaspa-chart-early-bitcoin.png`
- Kaspa mark is the correct mirrored K (bar on the right, chevron pointing left).
- The gold coin has no markings. Kaspa coin on the left, gold coin on the right, as specified.
- Advisory only: the Kaspa coin's mouth slightly overlaps the top of the logo bar, and the gold coin's hand is on the Kaspa coin's top edge rather than its shoulder.

**PASS** `schedule-tweets/images/x/x-tweets-a56362f4-no-october-bottom.png`
- Coin has no symbol, the notepads are blank (zoomed), the vault has no emblem, and there is no text anywhere.
- Advisory: the coin has NO face at all (no eyes or expression). The prompt's "face completely plain" wording made it faceless, so "chin up / triumphant" only comes across through the crossed arms. House style prefers coins with eyes. Mike's call. If he wants a face: regen with "expressive Pixar eyes and a smug grin, but no symbol or marking on the coin face".

**PASS** `schedule-tweets/images/x/x-tweets-9507cd93-nacho-migration-deadline.png`
- Nacho matches the reference (black cat, cyan eyes, collar with K pendant). Kaspa mark correct.
- The hourglass top bulb is mostly full and the bridge runs from crumbling stone to glowing bedrock.
- No text or posters copied from the reference.

**PASS** `schedule-tweets/images/x/x-tweets-63c1d197-kaspa-first-bear-market.png`
- Kaspa mark correct, footprint trail is in the canyon, and there is no text.
- The beam runs diagonally rather than horizontally, which is acceptable.

**PASS** `schedule-tweets/images/x/x-tweets-b74e7c17-kaspa-conference-cruise.png`
- Kaspa mark correct and the captain's hat is white.
- The ship has no name, flag or emblem (hull zoomed). Waterfront skyline with palms is present.

**PASS** `schedule-tweets/images/x/x-tweets-2fdc9ece-three-dollar-kaspa-is-bearish.png`
- Kaspa mark correct (zoomed), plus deck chair, cocktail and dusk skyline.
- No branding on the yacht and no text.

### IG single companions (4:5)

**PASS** `schedule-tweets/images/ig/ig-single-3ead6e3e-kaspa-chart-early-bitcoin.png`
- A 4:5 version of the same concept. Kaspa mark correct and gold coin unmarked.
- The repeated-ridge idea is weaker here (two glowing peaks) but still reads.

**PASS** `schedule-tweets/images/ig/ig-single-9507cd93-nacho-migration-deadline.png`
- Kaspa mark correct (zoomed), cat matches the reference, hourglass top bulb is full. No text.

**PASS** `schedule-tweets/images/ig/ig-single-63c1d197-kaspa-first-bear-market.png`
- Kaspa mark correct and footprints present. No text.

**PASS** `schedule-tweets/images/ig/ig-single-b74e7c17-kaspa-conference-cruise.png`
- Kaspa mark correct and the ship is unbranded.
- Advisory: the cap badge is a tiny gold medallion with a second Kaspa K. It is on-brand and has no lettering. The prompt's emblem ban covered the ship only.

**PASS** `schedule-tweets/images/ig/ig-single-2fdc9ece-three-dollar-kaspa-is-bearish.png`
- Kaspa mark correct (zoomed). No text and no branding.

### YT carousel 1: "Kaspa's chart looks just like early Bitcoin" (V4)

**PASS** `schedule-tweets/images/yt/yt-posts-03d61c1b-01-hook.png`
- Text is exact: "KASPA'S CHART LOOKS JUST LIKE" in white and "EARLY BITCOIN" in green, plus "SWIPE FOR MORE".
- Top-right bubble has two same-shape green lines with no numbers.
- No page dots and no shield badge (the divider gap is empty). Kaspa coin is faithful to the reference.
- Advisory: line 1 sits 82 px (6.5%) from the left edge and 79 px from the right, a little under the prompt's 8% margin, but nothing is clipped.

**FAIL** `schedule-tweets/images/yt/yt-posts-8ec97d8b-02-two-first-bear-markets.png`
- Defect: breaks the prompt's "no crypto coins, no Kaspa or Bitcoin logos, no ticker symbols". Stat box 1 has an orange Bitcoin logo icon and stat box 2 has a Kaspa mirrored-K icon.
- Defect: the Kaspa mark sits in a FOREST-GREEN circle, not Kaspa teal. That is brand colour drift (SKILL.md: Kaspa = teal/cyan).
- Everything else is right. Title, stat text, chart headers, bullets and page "2" are exact. Charts are shape-only with no axes. No watermark.
- Fix: fix in place, no regen (a regen risks ChatGPT rewriting the text). The icons are flat graphics, so replace the two coin-logo icons with neutral glyph icons in the exemplar style (e.g. a calendar and a chart-bars glyph on the same orange/green circles), then zoom to check. Alternatively Mike accepts the logos. If he does, at least recolour the Kaspa circle to teal.

**FAIL** `schedule-tweets/images/yt/yt-posts-718c52b0-03-kaspa-skipped-2022.png`
- Defect: same banned-logo problem. Bitcoin logo icon in stat box 1 and a green-circle Kaspa mark in stat box 2.
- Title, stat text, bars, both bullets and page "3" are exact. Box 1's "50-WEEK SMA" and box 3's "KASPA'S FIRST" come close to the box borders but fit.
- Advisory: the Kaspa bar splits about 70/30 green/red instead of the half/half in the prompt. That arguably reads better (the long 2022 bull run) and is not a defect.
- Fix: same in-place icon swap as slide 02.

**FAIL** `schedule-tweets/images/yt/yt-posts-ffb24010-04-september-reclaim.png`
- Defect: same banned-logo problem. Bitcoin logo icon in stat box 1 and a green-circle Kaspa mark in stat box 2.
- Title, stats and bullets are exact. The chart is right: dashed line, a green line that crosses above it, rides above it, then dips back to touch it at the right edge.
- Page "4" sits just above the end of the title ("SMA") without touching it. Box 3 (three lines) is tight against its bottom border, but nothing is clipped.
- Fix: same in-place icon swap as slide 02.

**FAIL** `schedule-tweets/images/yt/yt-posts-d07b1827-05-question.png`
- Defect: banned-logo problem. A green-circle Kaspa mark is the icon for answer "B: $1 TO $3". It also visually favours option B in what should be a neutral poll.
- Title, A/B/C stats, the empty A/B/C panels, the comments box text and page "5" are exact.
- Advisory: the three empty panels leave a big dead white block. That is what the prompt asked for, but it is weak composition.
- Fix: same in-place icon swap. Give B a neutral glyph like A (bars) and C (rocket) have.

### YT carousel 2: "The Bitcoin maxis will end up in Kaspa" (V2)

**PASS** `schedule-tweets/images/yt/yt-posts-e96ea539-01-hook.png`
- Matches the V2 exemplar. "1 OF 5" appears once, top left.
- Title, teal line and THE CLAIM box text are exact. Teal at 175 deg.

**PASS** `schedule-tweets/images/yt/yt-posts-1ca8a40d-02-written-for-bitcoin-first.png`
- "2 OF 5" appears once. All text is exact (GHOSTDAG, Sompolinsky, 2013).

**PASS** `schedule-tweets/images/yt/yt-posts-9ac196b0-03-twelve-lane-highway.png`
- "3 OF 5" appears once and the text is exact.
- The teal line "A blockDAG fans out..." ends about 51 px from the right edge: tight, not clipped.

**FAIL** `schedule-tweets/images/yt/yt-posts-f3e28fb4-04-kaspa-gets-a-ship.png`
- Defect: a stray white smudge is fused onto the descender of the "g" in "going". It is on box body line 1 ("Up to 1 million dollars going"), around x 610-635, y 995-1015. At full size the word reads like a broken glyph.
- "4 OF 5" appears once. All other text is exact (Miami, Devcon, April 9 to 12, 2027, KCC-20, L1).
- Fix: paint over the smudge in place with the flat dark box-fill colour, leaving the g's own descender loop intact, then zoom to check. If the g gets damaged, regen this one slide from the same prompt and exemplar.

**PASS** `schedule-tweets/images/yt/yt-posts-4982940f-05-question.png`
- "5 OF 5" appears once. Title, teal options line and comments box are exact.
- Teal at 180.3 deg, at the warm edge of the healthy range but still teal.

## Notes for the drafter (copy, not image defects)

- **Kaspa's first bear market has two start dates across the V4 carousel.** Slide 02 says "JUL 2024 TO AUG 2026" (the price drawdown from the ATH). Slide 03 says "DEC 2024: KASPA'S FIRST BEAR BEGINS" (the 50-week SMA definition). The body explains both, but a viewer swiping the slides sees a contradiction. Consider "KASPA: JUL 2024 TOP TO AUG 2026 LOW" on slide 02, or one line tying the two framings together.
- **The poll options skip $3 to $3.33** ("$1 TO $3" / "$3.33 AND HIGHER"). This is probably deliberate (the $3.33 meme target), but worth a glance.

## Fix-path note

All four V4 logo FAILs can be fixed in place, because the icons are flat circles on flat boxes (SKILL.md: flat texture regions tolerate surgery). Regenerating a V4 data slide risks ChatGPT rewriting the authored text (the 2026-09-10 figure-drift rule). The f3e28fb4 smudge also sits on a flat box fill.
