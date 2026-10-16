# downtober: Lane 3 visual QA (2026-10-14)

Every asset was opened and checked against its prompt in `repurpose/output/downtober-lane3-plan.json` and the house style in `repurpose/SKILL.md`. Kaspa glyphs, sneakers, gloves, corners, axes and stat boxes were checked by zoomed crops. Hue was measured on the V1 slides, and the V4 data slides were contrast-stretched to look for watermarks. Nothing was changed except this report.

**Summary: 23 checked, 14 PASS, 9 FAIL.**

## Must fix (most severe first)

1. `yt-posts-8286ead6-04-what-a-chart-cannot-see.png`: the chart states false data. The x-axis reads Apr 2025 to **Sep 2025** (the 3.7% print is Sept **2026**), and the bar values are invented: Aug is shown at 3.1%, but the verified Aug 2026 figure is 3.4%.
2. `yt-posts-52119a60-02-the-model.png`: the chart shows an invented Bitcoin price history, about $130K in Jan 2024 sliding to about $72K in Oct 2026. It misses the $126K Oct 2025 ATH and never gets near the $57.7K July low, which contradicts slide 3. The slide also carries the Bitcoin ₿ logo, which the prompt banned.
3. `yt-posts-5091bdf2-03-what-the-chart-did.png`: the stat reads "$57. 7K" with a stray space. In the chart, the May price line sits at about $67K, roughly $15K under the "MAY HIGH" line it labels.
4. `x-tweets-3329ead0-everything-might-go-lower-still-buying-kaspa.png`: the grin covers the top of the logo's stem, so the hero mark reads as a ">" arrow. The coins on the pallet pile carry a normal K.
5. `x-tweets-a85418f9-no-team-to-quit-no-premine-to-dump.png`: the folded arms cut the hero's Kaspa logo into fragments.
6. `ig-single-3329ead0-everything-might-go-lower-still-buying-kaspa.png`: Nike swoosh on the sneaker, and normal-K coins at the top of the pile.
7. `x-tweets-59724c5c-zombies-wait-for-an-october-bottom-that-printed-in-july.png`: the backpack coins carry a normal K.
8. `x-tweets-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png`: the small coins on the steps and in the pile carry a normal K.
9. `ig-single-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png`: Nike swoosh on the sneaker, and a glyph leaked onto the glove. Both can be inpainted.

The plan expected ChatGPT to drift the numbers on the V4 data slides, and three of the four did. Code-render slides 2, 3 and 4 with `repurpose/output/kaspa-lane3-fix/render_v4_slide.py`, which SKILL.md names as the canonical path (2026-09-10 note). For a chart built from verified data, follow the pattern in `repurpose/build_v4_slides.py`.

## Per-asset report

```json
{
  "assets": [
    { "path": "schedule-tweets/images/x/x-tweets-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png", "verdict": "FAIL",
      "defects": [
        "Small Kaspa coins carry a NORMAL K (stem on the left, arms pointing right) instead of the mirrored Kaspa K the prompt asked for ('the small coins carry the same backwards-K logo'). It is unmistakable on the two step coins at about x915-1025, y605-755, and several coins in the bottom pile and the bag also show a normal K mixed in with mirrored ones.",
        "Minor: the hero's mouth sits on the top of the logo's right-hand stem, so the stem starts below the mouth. It still reads as the mirrored K."
      ],
      "fix": "Move the old file aside, then regenerate with the same image_id, slug and prompt, adding: 'every small Kaspa coin shows the MIRRORED K exactly like the reference: vertical stem on the RIGHT, both arms pointing LEFT, never a normal K' and 'the face sits above or beside the logo and never overlaps it'. Do not crop the IG companion instead: a square crop cuts off the waiting grey coins at the top of the stairs, which are half the metaphor." },

    { "path": "schedule-tweets/images/ig/ig-single-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png", "verdict": "FAIL",
      "defects": [
        "Real-brand logo: an unmistakable Nike swoosh (black swoosh on the white side panel) on the hero's right sneaker, at about x495-595, y930-990. It is visible at feed size.",
        "Leaked glyph: a small sketched pseudo-glyph on the back of the hero's left glove, at about x195-235, y755-795. This is the same defect class as the archie-promo glove leaks.",
        "Minor: the coin in the hero's right hand shows an asterisk-like glyph rather than a clean K."
      ],
      "fix": "Both marks sit on flat texture (the shoe side panel and the back of the glove), so SKILL.md allows a pixel inpaint. Paint the swoosh area to match the plain panel and the glove patch plain white. If either inpaint smears, regenerate with 'plain unbranded sneakers with no swoosh, stripe, logo or marking of any kind; plain white gloves'. Otherwise this image is clean: the hero's mirrored K is fully visible with the face beside it, every coin on the steps, in the bag and in the pile shows the mirrored K, it is 4:5 at 1122x1402, and it has no text." },

    { "path": "schedule-tweets/images/x/x-tweets-59724c5c-zombies-wait-for-an-october-bottom-that-printed-in-july.png", "verdict": "FAIL",
      "defects": [
        "The coins sticking out of the backpack carry a NORMAL K (stem left, arms right), readable even at half size, at about x680-800, y410-550. The prompt asked for the mirrored backwards-K.",
        "Minor: a faint pale curved stripe on the hero's right sneaker (generic, not an identifiable swoosh)."
      ],
      "fix": "Regenerate with the mirrored-K sentence given for 5a478e3b. Alternative: crop a 1122x1122 square from the IG companion (y about 180 to 1302, which keeps the zombie line and the hero) and resize it to 1254x1254. The IG backpack coins carry no normal K. Otherwise this image is correct: the hero reads as the mirrored K, the cardboard sign and the calendar page in the gutter are blank, the zombie coins are plain, and there is no text." },

    { "path": "schedule-tweets/images/ig/ig-single-59724c5c-zombies-wait-for-an-october-bottom-that-printed-in-july.png", "verdict": "PASS",
      "defects": [
        "Minor: the backpack coins show malformed asterisk-like glyphs instead of a clean mirrored K (about x430-680, y530-700). None is a normal K and none reads as another brand.",
        "Minor: a generic teal oval decal on the near sneaker."
      ],
      "fix": "None required. The hero's mirrored K is fully visible with the face beside it. The sign is blank, the calendar is a blank grid with no letters or numbers, the zombie coins are plain, the frame is 4:5, and there is no text." },

    { "path": "schedule-tweets/images/x/x-tweets-a85418f9-no-team-to-quit-no-premine-to-dump.png", "verdict": "FAIL",
      "defects": [
        "The hero's folded arms cross the middle of the Kaspa logo (logo at about x500-810, y150-460), cutting the mirrored K into fragments. At feed size it reads as a broken asterisk, not the Kaspa K. This is the same obstruction defect that failed in aliens (2b72506f) and uptober."
      ],
      "fix": "Fastest: crop a 1122x1122 square from the IG companion, whose logo is clean with the arms folded beside it. Use y about 0 to 1122 so the hero, the rigs and the front graves stay in frame, then resize to 1254x1254. Or regenerate with 'arms folded BELOW the logo; the full mirrored K completely visible and unobstructed'. Otherwise this image is correct: the rigs glow, the graveyard coins are plain, and there is no text." },

    { "path": "schedule-tweets/images/ig/ig-single-a85418f9-no-team-to-quit-no-premine-to-dump.png", "verdict": "PASS",
      "defects": [
        "Minor: a pale curved stripe on both sneakers, and 1-2 px pseudo-marks on the tongue labels. Neither is readable at feed size."
      ],
      "fix": "None required. The mirrored K is fully visible, with the face and folded arms to the right of it. The mining rigs have fans and cables, the graveyard coins are plain and slumped, the frame is 4:5, and there is no text." },

    { "path": "schedule-tweets/images/x/x-tweets-083e185a-rate-hikes-get-front-run-not-reacted-to.png", "verdict": "PASS",
      "defects": [
        "Minor: rendered closer to stylized 3D than 'cinematic photorealistic'. It reads fine for this concept.",
        "Note: the scroll's legs carry the ornamental border pattern (swirls, no letters)."
      ],
      "fix": "None required. The flexing bond-scroll giant has an angry face, and the tiny gold coin cowers with a plain face. The certificate has decorative borders only, the wall clock has hands and no numerals, and the paper stack is blank. The boardroom has leather chairs, a storm skyline and an amber desk lamp. There is no text or seal, and the corners are clean." },

    { "path": "schedule-tweets/images/x/x-tweets-bd8588b0-tao-to-3000-is-about-an-11x-from-here.png", "verdict": "PASS",
      "defects": [
        "Minor: one base-camp coin (at about x40-140, y950-1040) carries a faint grey 'T'. The TAO glyph has leaked onto a coin the prompt said must be plain. It is about 20 px and essentially invisible at 1x.",
        "Minor: the base-camp coins are white rather than grey."
      ],
      "fix": "None required. Optionally, inpaint that coin face plain (it is flat texture). The TAO coin is white with the single black bar-and-curved-stem glyph from the reference and no other marking. It grips the ledge looking up, a neural-network aurora sits over a glowing summit, the campfire base camp is below, there is no greenish cyan anywhere, and there is no text." },

    { "path": "schedule-tweets/images/x/x-tweets-1843683d-kaspa-green-on-the-month-while-the-meme-board-is-a-graveyard.png", "verdict": "PASS",
      "defects": [
        "Minor: the graveyard coins lie face up rather than face down, and their rims carry faint embossed pseudo-marks that are unreadable at feed size."
      ],
      "fix": "None required. The mirrored K is fully visible. The hero wears sunglasses, sits on a stump with legs crossed, and has a single green sprout beside it. The coins are plain and dull, the fog and moon are present, and there is no text." },

    { "path": "schedule-tweets/images/ig/ig-single-1843683d-kaspa-green-on-the-month-while-the-meme-board-is-a-graveyard.png", "verdict": "PASS",
      "defects": [
        "Minor: a teal pointed stripe on the near sneaker (generic, not an identifiable swoosh)."
      ],
      "fix": "None required. The mirrored K is fully visible with the face and sunglasses beside it, the stump and sprout are present, the coins are plain, the frame is 4:5, and there is no text." },

    { "path": "schedule-tweets/images/x/x-tweets-3329ead0-everything-might-go-lower-still-buying-kaspa.png", "verdict": "FAIL",
      "defects": [
        "The hero's big grin covers the top of the mirrored K's right-hand stem, so the logo reads as a '>' chevron or arrow rather than the Kaspa K. This is the same defect that failed in uptober ('the cartoon mouth sits over the top of the mirrored K's right stroke').",
        "The coins on the pallet pile carry a NORMAL K, e.g. at about x800-920, y565-670, x910-1060, y565-710 and x1000-1130, y490-600. The coins in the cart are a mix of normal K, mirrored K and asterisk glyphs."
      ],
      "fix": "Regenerate with the same image_id, slug and prompt, adding the mirrored-K sentence for every coin and 'the face sits above or beside the logo and never overlaps it'. Do not crop the IG companion: it has normal-K coins and a swoosh too. The red price tag with its diagonal slash and no text is correct." },

    { "path": "schedule-tweets/images/ig/ig-single-3329ead0-everything-might-go-lower-still-buying-kaspa.png", "verdict": "FAIL",
      "defects": [
        "Real-brand logo: an unmistakable Nike swoosh (teal) on the hero's front sneaker, at about x525-585, y1035-1085.",
        "The largest coins at the top of the pallet pile carry a NORMAL K, at about x1000-1120, y395-490 (the most prominent coin in the pile) and x930-1070, y480-580. One coin in the cart shows an asterisk glyph.",
        "Minor drift: the price tag is cream/white paper with a red slash. The prompt asked for a red tag (the X version has a red one)."
      ],
      "fix": "Regenerate with the mirrored-K sentence plus 'plain unbranded sneakers, no swoosh, stripe or logo'. An inpaint is not enough because the normal-K coins are prominent. The hero logo itself is clean: the mirrored K is fully visible with the face beside it." },

    { "path": "schedule-tweets/images/x/x-tweets-dda869d5-pengu-89-percent-under-ath-definitely-pengu.png", "verdict": "PASS",
      "defects": [
        "Minor: the lighthouse reads as stacked gold and stone blocks more than 'fused coins', and the block faces carry faint engraved scratch-marks that are not legible at 1x."
      ],
      "fix": "None required. The paper boats are capsizing with plain panicked coins, and a calm plain coin stands on the lighthouse gallery. The amber beam, lightning and spray are there. There are no animals and no mascot (Pengu is not rendered, as the plan specified), every coin face is plain, and there is no text." },

    { "path": "schedule-tweets/images/yt/yt-posts-cddd4668-01-hook.png", "verdict": "PASS",
      "defects": [
        "Minor: the chart panel's y-axis carries tiny pseudo tick labels (about 8 px), and the bank pediment has a small dark crest. Neither is readable at feed size."
      ],
      "fix": "None required. The headline matches the prompt word for word: 'CPI 3.7%. 5-YEAR YIELD ABOVE 5%, HIGHEST SINCE 2007. HIKE ODDS: ONE IN THREE.' '1 OF 5' appears once, white, top-left. The green hue is 124.6° (house 122.6°), with no chartreuse. The climbing line and bursting thermometer are there, there are no coins, and nothing is clipped (margins: L 33 px, R 40 px)." },

    { "path": "schedule-tweets/images/yt/yt-posts-90dc794b-02-the-bond-market.png", "verdict": "PASS",
      "defects": [
        "Minor: the frieze on the dim building at the left carries engraved pseudo-lettering, which is only visible when brightened."
      ],
      "fix": "None required. The headline matches word for word: 'THE BOND MARKET ALREADY HIKED: 5-YEAR ABOVE 5%, 10-YEAR ABOVE 5.2%.' '2 OF 5' appears once. The hue is 126.3°. There are five bars with the tallest two neon green, and a plain gold coin sits at the foot of the tallest. No Bitcoin or Kaspa coin was copied from the exemplar, and nothing is clipped." },

    { "path": "schedule-tweets/images/yt/yt-posts-41af9ea6-03-front-run.png", "verdict": "PASS",
      "defects": [],
      "fix": "None required. The headline matches word for word: 'HIKES GET FRONT-RUN, NOT REACTED TO. THE SELLING COMES BEFORE THE 28TH.' '3 OF 5' appears once. The hue is 126.7°. The line slides down, then ticks up at the vertical marker, and a plain gold coin sits at the low. Nothing is clipped (R margin 27 px, tight but it matches the exemplar)." },

    { "path": "schedule-tweets/images/yt/yt-posts-a9d62222-04-the-floor.png", "verdict": "PASS",
      "defects": [
        "Minor: the chart panel's right axis carries tiny pseudo tick labels ('110'), which are not readable at feed size."
      ],
      "fix": "None required. The headline matches word for word: 'BITCOIN AT $81K, 50-WEEK SMA AT ABOUT $77K. OCTOBER DIP BUYERS ARE THE FLOOR.' '4 OF 5' appears once. The text hue is 135.0°, the warmest of the set but inside the 126-143.5° range of past shipped V1 slides. The roughly 6% of pixels under 100° are the gold coins, not the type. The line bounces on a glowing support line with a wall of plain gold coins under it, and nothing is clipped." },

    { "path": "schedule-tweets/images/yt/yt-posts-b5715d87-05-question.png", "verdict": "PASS",
      "defects": [],
      "fix": "None required. The headline matches word for word: 'HIKE LANDS AND BITCOIN IS GREEN THAT DAY: FRONT-RUN OR FAKEOUT?' '5 OF 5' appears once. The hue is 130.6°. A green candle and a red candle sit over a calendar block with blank cells and no markings, with one neon question mark between them. The coins are plain and nothing is clipped." },

    { "path": "schedule-tweets/images/yt/yt-posts-cc1f184e-01-hook.png", "verdict": "PASS",
      "defects": [
        "Minor: the headline sits 43-47 px from the edges, against the 8% (100 px) margin the prompt asked for. No character is clipped, and the V4 exemplar uses the same edge-to-edge treatment (as in the spon precedent)."
      ],
      "fix": "None required. The face matches the Benjamin-Cowen.png reference, framed chest-up and left of centre. The top-right bubble chart drops to a low about a third of the way across, then climbs, in green with no numbers. 'THE OCTOBER BOTTOM' is white and 'ALREADY PRINTED IN JULY' is green, with 'SWIPE FOR MORE' at the bottom. There are no pagination dots, and no watermark or @handle in any corner (all four checked at 3x brightness)." },

    { "path": "schedule-tweets/images/yt/yt-posts-52119a60-02-the-model.png", "verdict": "FAIL",
      "defects": [
        "Figure drift: ChatGPT invented a dated Bitcoin price history. The axes run from Jan 2024 to Oct 2026 and $0 to $140K, and the line starts at about $130K in Jan 2024 and slides to about $72K. In reality BTC was about $42K in Jan 2024 and set its $126K ATH on Oct 6, 2025 (plan fact_check), and the 2026 low was $57.7K on July 1, which this line never approaches. That contradicts slide 3 of the same carousel.",
        "Banned logo: the third stat box carries the Bitcoin ₿ logo in an orange circle. The prompt said 'no company logos or ticker symbols', and the plan's missing_references states the Bitcoin logo is not rendered.",
        "Extra text: a 'Bitcoin price (USD)' legend and a 'Price (USD)' axis title that were not in the authored text.",
        "Correct: the title, the three stat boxes, the 'THE FOUR-YEAR CYCLE CALL' box, both bullets word for word, page number 2, and no watermark."
      ],
      "fix": "Code-render with repurpose/output/kaspa-lane3-fix/render_v4_slide.py using the exact authored text. Replace the ₿ icon with a generic one. Make the chart either schematic (a grey line sliding to the dashed OCT 2026 marker, with no dated axis and no dollar scale) or real: verified 2026 BTC closes up to the late-May call (about $75.6K, per fact_check), then a dashed projection to the OCT 2026 marker. Never plot fabricated history." },

    { "path": "schedule-tweets/images/yt/yt-posts-5091bdf2-03-what-the-chart-did.png", "verdict": "FAIL",
      "defects": [
        "Text defect in the lead stat: '$57.7K' renders as '$57. 7K', with a visible space after the decimal point.",
        "Figure drift in the chart: the dashed 'MAY HIGH' line and its marker sit at about $83K over May 2026, but the plotted price in May is about $67-70K, so the line never touches the high it labels. The verified May 2026 high is $82,814 (fact_check). The July 1 low (about $57K), the Sept peak (about $88K) and the right edge (about $81K) are roughly right.",
        "Extra text: a 'Bitcoin price (USD)' legend and a 'Price (USD)' axis title.",
        "Correct: the title, the 'MAY HIGH: ABOUT $82.8K' and 'SEPT HIGH: ABOUT $87K' boxes, the 'WHAT ACTUALLY HAPPENED' box, both bullets word for word, page number 3, and no watermark."
      ],
      "fix": "Code-render with render_v4_slide.py using the exact text '$57.7K ON JULY 1'. Plot the verified 2026 Coinbase daily closes the plan's fact_check already pulled: the $57,718 July 1 low, the $82,814 May high as the dashed line, the about $87K September high, and about $81.4K now. Follow the plotting pattern in repurpose/build_v4_slides.py (verified anchors only, nothing past this week)." },

    { "path": "schedule-tweets/images/yt/yt-posts-8286ead6-04-what-a-chart-cannot-see.png", "verdict": "FAIL",
      "defects": [
        "Wrong year: the x-axis reads Apr 2025, May 2025, Jun 2025, Jul 2025, Aug 2025, Sep 2025, and the red bar says 'Sep 2025: 3.7%'. The 3.7% CPI print is September 2026 (released Oct 14, 2026), so as drawn the slide makes a false claim about 2025.",
        "Invented values: the bars are labelled 2.3 / 2.4 / 2.7 / 2.9 / 3.1 / 3.7%. The verified August figure is 3.4% (fact_check: '3.4% in August'), not 3.1%, and the April to July values are unsourced.",
        "Extra text: an 'Inflation (CPI, YoY)' legend and an 'Inflation (YoY %)' axis title.",
        "Correct: the title, the stat boxes '+9.1%', '3.7%' and 'ABOUT 35%', the 'NOT A CALENDAR, THE WORLD' box, both bullets word for word, page number 4, and no watermark."
      ],
      "fix": "Code-render with render_v4_slide.py. Label the bars with 2026 months and plot the verified CPI YoY series: Aug 2026 3.4% and Sep 2026 3.7% from fact_check, with the Apr to Jul 2026 prints sourced from BLS before plotting. If they cannot be sourced, show only the Aug and Sep bars, or drop the value labels and the y-axis scale." },

    { "path": "schedule-tweets/images/yt/yt-posts-ac3ae8e0-05-question.png", "verdict": "PASS",
      "defects": [
        "Minor: the title's '?' ends about 49 px from the right edge (tight, not clipped)."
      ],
      "fix": "None required. Every figure matches the authored text: 'JULY 1 LOW: $57.7K', 'BTC THIS WEEK: ABOUT $81K', 'KASPA THIS WEEK: ABOUT 3.7 CENTS'. The check mark sits over 'JULY WAS THE LOW' and the question mark over 'OCTOBER STILL COMING'. The 'TELL ME IN THE COMMENTS' box and both bullets are word for word, the icons are generic (no logos), the page number is 5, there is no watermark, and there are no em dashes." }
  ],
  "summary": { "checked": 23, "passed": 14, "failed": 9 },
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-8286ead6-04-what-a-chart-cannot-see.png",
    "schedule-tweets/images/yt/yt-posts-52119a60-02-the-model.png",
    "schedule-tweets/images/yt/yt-posts-5091bdf2-03-what-the-chart-did.png",
    "schedule-tweets/images/x/x-tweets-3329ead0-everything-might-go-lower-still-buying-kaspa.png",
    "schedule-tweets/images/x/x-tweets-a85418f9-no-team-to-quit-no-premine-to-dump.png",
    "schedule-tweets/images/ig/ig-single-3329ead0-everything-might-go-lower-still-buying-kaspa.png",
    "schedule-tweets/images/x/x-tweets-59724c5c-zombies-wait-for-an-october-bottom-that-printed-in-july.png",
    "schedule-tweets/images/x/x-tweets-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png",
    "schedule-tweets/images/ig/ig-single-5a478e3b-kaspa-at-3-7-cents-another-great-buy.png"
  ]
}
```

## Global checks

- **Sizes and aspect ratios:** all 13 X and YT files are 1254x1254 (1:1), and all 5 IG companions are 1122x1402 (4:5). None is blank, white, a failed capture or a wrong-subject swap: every image shows its own prompt's scene.
- **Uniqueness:** md5 is unique for 23 of 23. A perceptual-hash (dHash) sweep against all 119 images under `schedule-tweets/images/`, including `reference/`, found no near-duplicate and no mis-captured copy of an attached reference or exemplar.
- **V1 carousel (rate hikes):** every slide is anchored on the pinned clean exemplar, and the look matches it: near-black background, condensed all-caps white and neon green headline, chart panel, glowing props. Counters run '1 OF 5' to '5 OF 5', each exactly once, white, top-left, with no inherited exemplar badges. The measured text-green hues are 124.6 / 126.3 / 126.7 / 135.0 / 130.6°, against the house 122.6° and the pinned exemplar's 122.7°. None is in the 44-97° chartreuse band, so there is no chartreuse drift. Every headline is word for word, there are no em dashes, nothing is clipped, and every coin is plain (no Bitcoin or Kaspa coin copied from the exemplar).
- **V4 carousel (October bottom):** the hook has no pagination dots and no watermark. All four data slides were contrast-stretched in the near-white band, and none shows the exemplar's repeating @handle watermark. Page numbers 2 to 5 are correct, and the stat boxes and bullets are word for word on every slide except slide 3's '$57. 7K'. The defects are all in the ChatGPT-drawn charts (slides 2 to 4) and the ₿ icon on slide 2. Slide 5 has no chart and is clean.
- **Kaspa glyph audit (hero / small coins):**
  - 5a478e3b X: hero OK, small coins normal K (FAIL). IG: hero OK, small coins mirrored.
  - 59724c5c X: hero OK, backpack coins normal K (FAIL). IG: hero OK, backpack coins asterisk-like (note).
  - a85418f9 X: hero obstructed by the arms (FAIL). IG: clean.
  - 1843683d X and IG: clean, no small Kaspa coins.
  - 3329ead0 X: hero obstructed by the mouth, pile coins normal K (FAIL). IG: hero OK, pile coins normal K (FAIL).
  - Root cause: ChatGPT keeps drawing small Kaspa coins with a standard K. Every Kaspa prompt in the next batch should spell out the orientation ('vertical stem on the RIGHT, both arms pointing LEFT, never a normal K') rather than relying on 'backwards-K'.
- **Sneaker / glove audit:** the Pixar hero's sneakers picked up an unmistakable Nike swoosh on 2 IG files (5a478e3b, 3329ead0: FAIL). Generic stripes or decals appear on 4 others (59724c5c X and IG, a85418f9 IG, 1843683d IG: note only), and a pseudo-glyph appears on one glove (5a478e3b IG). Future coin-character prompts should add 'plain unbranded sneakers with no swoosh, stripe, logo or marking; plain white gloves'.
- **Non-Kaspa images:** the bond scroll, the TAO climb and the PENGU lighthouse have no text, no watermark, and no invented logos.
