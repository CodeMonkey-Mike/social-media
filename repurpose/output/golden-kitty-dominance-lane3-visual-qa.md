# golden-kitty-dominance — Lane 3 visual QA (persisted from agent output 2026-09-25T07:26:03)

I opened and checked all 16 Lane 3 images for `golden-kitty-dominance`. 14 pass and 2 fail, both in the Golden Kitty carousel (V4). The failures are slide 02, which isn't a generated slide at all, and slide 04, whose bar chart contradicts its own numbers.

```json
{
  "assets": [
    {
      "path": "schedule-tweets/images/yt/yt-posts-698739ef-02-the-numbers.png",
      "verdict": "FAIL",
      "defects": [
        "WRONG IMAGE ENTIRELY: this file is a pixel-for-pixel copy of the V2 example slide reference/carousels/version2/yt-posts-81abb2d9-06-question.png (checked with PIL: np.abs(a-b).max()==0). This is the known bug where the generator saves an uploaded reference instead of the new render.",
        "It shows a dark V2 slide: '6 OF 6 / Does throughput decide the next monetary chain? / Or does Bitcoin brand recognition win anyway?' That's another post's content, a different style (V2 on a V4 post), a counter of 6 OF 6 on a 5-slide post, and no page number 2.",
        "Its body text has an EM DASH ('What do you think — is this a technical race').",
        "None of the intended content is there: no '$GOLDEN this week' title, no stat boxes (Sept 4 launch / +170% / $4.8M new ATH), no chart with the SEPT 16 low and NEW ATH, no 'THE READ' bullets."
      ],
      "fix": "Code-render with repurpose/output/kaspa-lane3-fix/render_v4_slide.py, using the exact text from the plan prompt and page number 2. SKILL.md (2026-09-10) says V4 data slides with specific figures are code-rendered because ChatGPT changes the numbers. If you use ChatGPT anyway, run one item per call and pixel-check the result against every reference that was uploaded."
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-821bfcdb-04-the-rest-of-the-board.png",
      "verdict": "FAIL",
      "defects": [
        "WRONG CHART NUMBERS: the chart has a numbered MARKET CAP axis (0/2M/4M/6M/8M/10M, about 90 px per $1M), and two bars disagree with the stat boxes on the same slide. $SWOLE ends at about $1.0M but its box says 'UNDER $350K'. $KITSU ends at about $2.4M but its box says 'ABOUT $1.1M'. ($IF at about $0.6M and $TENDIES at about $9.6M are roughly right.)",
        "The prompt itself is wrong: it orders the bars '$IF: UNDER $600K' shortest, then $SWOLE. The plan's own fact-check has $IF at about $524K and $SWOLE at about $340K, so $SWOLE should be the shortest bar. Even a faithful render would show the wrong order.",
        "Minor: odd random bolding in bullet 1 ('swole cat, Vlad's actual') and bullet 2 ('alone', 'not'). The text itself matches the prompt exactly."
      ],
      "fix": "Code-render with render_v4_slide.py (page 4) using real bar lengths: $SWOLE ~0.34M (shortest), $IF ~0.52M, $KITSU ~1.14M, $TENDIES ~9.4M. Correct the bar order in the plan prompt too. Keep the title, stat boxes and bullets as they are (they match)."
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-5832814c-01-hook.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Vlad Tenev likeness matches Vlad-Tenev.webp; blue studio background; green candlestick bubble top-right climbing to a new high. Text is exact: 'THE ONLY NEW ROBINHOOD CHAIN MEME / PRINTING NEW HIGHS THIS WEEK' with NEW HIGHS in green, and 'SWIPE FOR MORE'. No watermark, handle or shield logo carried over from the example. Nothing is clipped. Measured side margins are 3.4 to 4.9%, below the 8% the prompt asked for, but that matches the V4 example's own edge-to-edge text, so it's not blocking. The 5 page dots are correct for a 5-slide post.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-70f9bbad-03-the-attribute-stack.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Title, all three stat boxes, the diagram (LORE → PAIRING → CONTENT → PUSHERS → gold NEW HIGHS node), the 'WHY IT WORKS' bullets and page number 3 all match word for word. No em dashes and nothing clipped. Right stat box is tight (~2% margin) but inside the frame. Not blocking: the nodes have icons and colored glows where the prompt said 'plain', and at 4x zoom the gold-bar icon has faint unreadable fake engraving. Neither is readable at normal size.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-8ed5c07d-05-question.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Title, A/B/C stat boxes ($GOLDEN/$KITSU/$SWOLE), empty A/B/C panels, 'D: ONE THAT HAS NOT LAUNCHED YET', 'TELL ME IN THE COMMENTS' bullet and page 5 all match. Nothing clipped. Not blocking: at 4x zoom 'four-year' uses a wider dash (en dash or minus width), not a normal hyphen. It is not an em dash. The panel headers read 'A:' with a colon, which is harmless.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-a8a95c7d-01-hook.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "'1 OF 5' appears exactly once. Title, accent line and THE READ box text are exact. No em dash carried over from the 9611992a example. Matches the V2 layout.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-ab2f7777-02-the-line.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "'2 OF 5' appears exactly once. $81,159 / $78,800 / Sept 20, 2026 / Nov 9, 2025 / Galaxy 13-of-11 are all exact. Uses a colon, no em dash.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-af6d7e78-03-bounce-not-bottom.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "'3 OF 5' appears exactly once. Title, '$40K' accent line and WHY box are exact. The accent line comes close to the right edge (~4.5% margin) but is not clipped.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-b76e0feb-04-the-zombies.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "'4 OF 5' appears exactly once. All text is exact, with a normal hyphen in 'four-year'. Title line 3 ends about 40px from the right edge, not clipped.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/yt/yt-posts-b86e25f7-05-question.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "'5 OF 5' appears exactly once. Title, 'Bet right now, in the comments' and the AND ONE MORE box are exact. No em dash, even though its example slide (81abb2d9) has one.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-02f1f433-golden-kitty-only-meme-printing-highs.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Gold cat trophy on a black pedestal under a column of gold light, grey coin characters slumped around it, background screens showing red down charts. Coin faces are blank and the trophy has no plaque. The numbers on the background screens are bokeh and can't be read at any zoom. No signature in any corner.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-048d1fd0-robinhood-chain-lore-kitsu-golden-trophy.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "3D Shiba in the Kitsu colors from the reference (including the dark purple collar), with a blank gold tag. Gold cat trophy in a glass case. No teal/cyan (0 pixels at hue 150-200°). Not blocking: the pedestal ring measures hue 59° (RGB ~207,203,42), which is Robinhood yellow rather than the #CCFF00 lime (~72°) the prompt asked for. persona.json robinhood_coin allows yellow as the alternate, so it's within the rule.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-173ced78-bitcoin-not-going-to-40k-zombies-october.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "A blank gold coin bounces off a glowing horizontal line, with a spark burst where it hits. Zombies in suits with glowing gold eyes run down the ridge, and a gold sunrise sits under storm clouds. No text or signature. The top-left zombies are cut by the frame on purpose (a crowd running off-frame), with no subject clipped.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-263ad209-hormuz-wrench-out-of-the-machine.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Rusted wrench pulled out of giant gears at a sea strait, sparks and rust flakes, tankers moving through at sunrise, a channel of blank gold coins in the foreground. Ships have no flags or markings, and there is no text or signature. Close enough to the prompt: the gears sit on opposite banks rather than interlocking.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-29aed24d-golden-kitty-new-all-time-high.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Gold cat trophy rocketing up through a band of cloud on a column of gold sparks, starry navy sky, coin characters below looking up open-mouthed. No text, plaque or signature. Close enough to the prompt: the coins are lit warm gold/beige rather than dull grey.",
      "fix": ""
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-34dbfd4d-kitsu-holding-the-line.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "3D Shiba braced on a glowing lime line across a stormy chasm, fur whipping in the wind, blank gold tag, blue lightning. The lime measures hue 68.7°, close to #CCFF00, with no teal/cyan. No text or signature.",
      "fix": ""
    }
  ],
  "summary": { "checked": 16, "passed": 14, "failed": 2 },
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-698739ef-02-the-numbers.png",
    "schedule-tweets/images/yt/yt-posts-821bfcdb-04-the-rest-of-the-board.png"
  ]
}
```

**Other findings:**
- **The capture bug is still happening.** Slide 698739ef saved the V2 example image that was uploaded for a different item (b86e25f7). That means the generator mixed up files between items in this run. I checked the other 15 images against their own prompts and found no swaps.
- **The plan has an error too.** The 821bfcdb prompt puts the bars in the wrong order. Fix it in `golden-kitty-dominance-lane3-plan.json` so a redraw doesn't repeat it.
- **Not blocking:** the 5 new V2 slides use a brighter cyan (hue 180–183°, about RGB 5,235,240) than the V2 examples (174.5°, RGB 1,207,188). All 5 match each other, so the set looks consistent. Say if you want it held to the example's hue.
- **Carousel checks you asked for:**
  - No V1 slides this batch, so the chartreuse check didn't apply.
  - Every V2 slide shows its counter exactly once.
  - The V4 slides picked up no watermark or text from their examples.
  - The only em dash is on the bad copy (698739ef).

Separately, the claude.ai Google Drive connector needs authorizing in your claude.ai connector settings before it can be used. It wasn't needed for this check.

## Re-QA 2026-09-25 (after fix)

Slides 02 (698739ef) and 04 (821bfcdb) replaced with CODE-RENDERED V4 data slides
(`repurpose/output/golden-kitty-dominance-lane3-fix/render_v4_slide.py`, SKILL.md 2026-09-10 path;
04's bar order corrected to $SWOLE shortest per fact-check). visual-qa re-check: **both PASS**,
no must-fix. Batch total: 16/16 PASS.
