# Visual QA: batch `was-i-right`, Lane 3 images

QA by the visual-qa agent on 2026-10-17. Report only; no files were changed.
Checked against: the image prompts in `repurpose/output/was-i-right-lane3-plan.json` and the house style in `repurpose/SKILL.md`. That means:
- the Pixar 3D CGI look
- no text, no watermark or signature (all four corners were checked with brightness boosted)
- plain coins must be completely plain, with no leaked glyph
- the Kaspa mirrored-K must match `images/reference/kaspa-logo.png`
- Toshi must match `images/reference/toshi.png`
- X images are 1:1, IG images are 4:5
- the IG lane carries Kaspa images only

**Carousel checks (version exemplar, V1 chartreuse drift, counters exactly once): N/A.** The brief says "no carousels", `carousel_versions` is `{}`, and no slide files were handed in.

Every image was opened at full size, then cropped and zoomed at the risk spots: coin faces, small background coins, shoes, the thermometer, the blueprint rolls, and the corners.

**Sizes:** all X images are 1254x1254 (1:1). All IG images are 1122x1402 (4:5). All correct.
**IG lane:** 3 entries, all Kaspa subjects (5ab28f03, c80388aa, 56510706). Correct.

## Summary: 9 checked, 5 PASS, 4 FAIL

| # | Asset | Verdict |
|---|---|---|
| 1 | x-tweets-5ab28f03-long-way-since-early-krc20-days | PASS |
| 2 | ig-single-5ab28f03-long-way-since-early-krc20-days | PASS (advisory) |
| 3 | x-tweets-c80388aa-proof-of-work-without-a-premine-beats-memes | PASS |
| 4 | ig-single-c80388aa-proof-of-work-without-a-premine-beats-memes | **FAIL** |
| 5 | x-tweets-2bac3e32-zombies-buy-the-ppi-red-candle | PASS |
| 6 | x-tweets-7608aa6a-pause-camp-what-am-i-missing | PASS (advisory) |
| 7 | x-tweets-56510706-bear-market-mindset-stacking-kaspa | **FAIL** |
| 8 | ig-single-56510706-bear-market-mindset-stacking-kaspa | **FAIL** |
| 9 | x-tweets-799fe902-toshi-waiting-for-meme-season | **FAIL** (low severity) |

## Must fix (most severe first)
1. `schedule-tweets/images/ig/ig-single-c80388aa-proof-of-work-without-a-premine-beats-memes.png`: a Nike swoosh trademark on the hero character's shoes.
2. `schedule-tweets/images/x/x-tweets-56510706-bear-market-mindset-stacking-kaspa.png`: a Kaspa-like glyph leaked onto the "plain" storm paper coins, and X-shaped marks on the stacked coins.
3. `schedule-tweets/images/ig/ig-single-56510706-bear-market-mindset-stacking-kaspa.png`: seal and swirl emblems on the "plain" storm paper coins.
4. `schedule-tweets/images/x/x-tweets-799fe902-toshi-waiting-for-meme-season.png`: the paper coins render as leaves, so the meme-coin metaphor is lost (low severity).

## How to regenerate (all FAILs)
`gen_images` skips files that already exist, so move the old file aside first, and reuse the same image_id and filename so the queue reference stays stable. A leak onto a face or character is always a regen, never an inpaint. For 56510706, retire the contaminated pool chats before the regen (`node repurpose/delete-chats.js --retire x-tweets`, and the same for `ig-single`).

## Per-asset detail

```json
{ "assets": [
  { "path": "schedule-tweets/images/x/x-tweets-5ab28f03-long-way-since-early-krc20-days.png",
    "verdict": "PASS",
    "defects": [],
    "notes": "The Kaspa coin character in a dark workshop wears a tool belt and guides a glowing chain that arcs up like a bridge. The racks of edge-glow tools, the old cobwebbed bench (right) and the warm lamp are all there. The mirrored-K faces the right way (bar on the right) and matches the ref. The blueprint rolls are blank. Drawer fronts have no labels. Corners are clean. Pixar 3D.",
    "fix": "none" },
  { "path": "schedule-tweets/images/ig/ig-single-5ab28f03-long-way-since-early-krc20-days.png",
    "verdict": "PASS",
    "defects": [],
    "notes": "Portrait recomposition is correct: the character is lower centre and the chain arcs through the upper half. The logo is correct. The cobweb corner is on the right. ADVISORY ONLY: the back blueprint roll (top right of the bench, around x 960-1122, y 970-1070) has very faint pencil-like arcs. They are not letters or glyphs, and they cannot be seen at feed size.",
    "fix": "none (optional: regen if Mike wants the rolls perfectly blank)" },
  { "path": "schedule-tweets/images/x/x-tweets-c80388aa-proof-of-work-without-a-premine-beats-memes.png",
    "verdict": "PASS",
    "defects": [],
    "notes": "The determined Kaspa coin stands on bedrock with a pickaxe over its shoulder and glowing ore at its feet. Candy-colour balloon coins sag and crumple around it. The logo is correct. The balloon faces are plain, with only a rim emboss and no symbol. The shoes are plain, with no brand mark. White spotlight from above. Corners are clean.",
    "fix": "none" },
  { "path": "schedule-tweets/images/ig/ig-single-c80388aa-proof-of-work-without-a-premine-beats-memes.png",
    "verdict": "FAIL",
    "defects": [
      "BRAND LOGO: both sneakers show a clear NIKE SWOOSH (a cyan swoosh on the black upper, at about x 430-560, y 880-940 on the left shoe and on the right shoe). It is a real third-party trademark on the hero character, which breaks the prompt rule (no symbol, no logo of any kind) and the plain-surface rule. It is clearly visible at feed size."
    ],
    "notes": "Everything else is on spec: logo orientation, plain balloons, bedrock, ore, portrait composition. The X 1:1 twin has plain shoes, so this leak is only on the 4:5.",
    "fix": "Regen the 4:5 with the same prompt plus: the character wears plain shoes with no swoosh, no brand mark, no logo of any kind. Move the old file aside first and keep the same image_id/filename. Do NOT inpaint." },
  { "path": "schedule-tweets/images/x/x-tweets-2bac3e32-zombies-buy-the-ppi-red-candle.png",
    "verdict": "PASS",
    "defects": [],
    "notes": "Grey-green zombie coins in torn jackets lunge and lift a startled gold coin back upward, on a rainy night street. The red neon tube sits under a green neon tube. The gold coin and the zombie faces are plain, with no BTC glyph (this matches the missing_references note). The background city has no signage text. Corners are clean.",
    "fix": "none" },
  { "path": "schedule-tweets/images/x/x-tweets-7608aa6a-pause-camp-what-am-i-missing.png",
    "verdict": "PASS",
    "defects": [],
    "notes": "There is a mahogany boardroom with sleeping grey coins in suits, arms folded, and one in a sleep mask. A cherry-red thermometer cracks the wall. An oil barrel spills toward the table. The standing coin is wide awake with green eyes and open palms. All faces are plain. The folders on the table have no text. ADVISORY: the thermometer tube has small tick marks down both sides, but the prompt asked for no numbers or scale marks. Zoomed in, they are plain ticks, not numerals or pseudo-text.",
    "fix": "none (optional: regen with a completely smooth glass tube with no tick marks if Mike wants a strict prompt match)" },
  { "path": "schedule-tweets/images/x/x-tweets-56510706-bear-market-mindset-stacking-kaspa.png",
    "verdict": "FAIL",
    "defects": [
      "LEAKED GLYPHS: the flimsy paper coins blowing past the barred window are NOT plain. At least 5 carry a dark stick glyph (a K/X/arrow-like mark, clearly the Kaspa mark bleeding onto coins that were meant to be plain), at about x 760-1180, y 80-560. The prompt explicitly requires them to be completely plain, with no symbol, logo or glyph. This undoes the visual contrast: the storm coins are supposed to be generic junk that the Kaspa stack outlasts.",
      "Secondary: many of the small stacked Kaspa coins (the floor coins and the coin being placed) render the mark as a symmetric X/asterisk-like cross rather than the clean mirrored-K of the reference."
    ],
    "notes": "The hero character logo is correct. The composition, storm, lantern and vault door are all fine. Corners are clean.",
    "fix": "Retire the x-tweets pool chat first (the Kaspa ref is contaminating sibling props), then regen the 1:1. Strengthen the prompt: the paper coins outside the window are blank white discs with no mark, no symbol, no line of any kind; every small stacked coin shows exactly the mirrored-K of the reference, not an X. Move the old file aside first and keep the image_id/filename." },
  { "path": "schedule-tweets/images/ig/ig-single-56510706-bear-market-mindset-stacking-kaspa.png",
    "verdict": "FAIL",
    "defects": [
      "Paper coins outside the window are NOT plain. Several carry embossed seal/ring emblems and a swirl/spiral glyph in the centre, at about x 640-1060, y 250-520. This is a milder leak than the 1:1, but they are still visible symbols, and the prompt requires them to be completely plain."
    ],
    "notes": "The hero logo and the small stacked coins correctly show the mirrored-K. Portrait composition is correct: the window and storm are high and the character with its stacks is lower centre. Shoe laces only, no brand mark. Corners are clean.",
    "fix": "Regen the 4:5 with the same strengthened paper-coin wording as the 1:1 (blank white discs, no emblem, no ring, no mark of any kind), after retiring/rotating the ig-single chat. Move the old file aside first and keep the image_id/filename." },
  { "path": "schedule-tweets/images/x/x-tweets-799fe902-toshi-waiting-for-meme-season.png",
    "verdict": "FAIL",
    "defects": [
      "CONTENT: the flimsy, torn, half-transparent plain paper coins rendered as LEAVES and PETALS. They are teardrop and leaf shapes with stems and vein-like creases, and none of them reads as a coin, even when zoomed. The whole metaphor of the image (meme coins blowing away while Toshi waits) is lost; it reads as autumn leaves on a train platform."
    ],
    "notes": "Toshi itself is excellent. It matches the ref: blue with sky-blue stripes, white muzzle and chest, half-lidded smug eyes, a small closed smile, an orange hoodie with green drawstrings and cuffs, and a peace sign. It is properly sculpted 3D, with no flat linework carried over from the ref. The station clock face is blank. No signature or watermark in any corner (checked boosted). Low severity: Mike may accept it as mood art, but it does not meet the spec.",
    "fix": "Regen the 1:1 with the coins made unmistakable: round, flat, coin-shaped discs of thin torn paper with a raised rim, clearly coins and not leaves, completely plain with no mark. Keep the rest of the prompt and the toshi.png ref (positive 3D geometry block included). Move the old file aside and keep the image_id/filename." }
],
  "summary": { "checked": 9, "passed": 5, "failed": 4 },
  "must_fix": [
    "schedule-tweets/images/ig/ig-single-c80388aa-proof-of-work-without-a-premine-beats-memes.png",
    "schedule-tweets/images/x/x-tweets-56510706-bear-market-mindset-stacking-kaspa.png",
    "schedule-tweets/images/ig/ig-single-56510706-bear-market-mindset-stacking-kaspa.png",
    "schedule-tweets/images/x/x-tweets-799fe902-toshi-waiting-for-meme-season.png"
  ]
}
```
