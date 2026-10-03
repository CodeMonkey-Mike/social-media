# spon — Lane 3 visual QA (persisted from agent output 2026-09-30T09:01:48)

I checked all 16 Lane 3 images for batch `spon` against their prompts in `spon-lane3-plan.json`. 13 pass and 3 fail: one V4 data slide has wrong and contradictory figures, one V4 slide is 40% empty panels, and one V2 slide switches to a different font.

- **No V1 slides in this batch**, so the chartreuse-drift rule doesn't apply to any carousel. The lime green in `007ae952` is the Robinhood colour (#CCFF00) the prompt asked for, not drift.
- **Counters and page numbers:** the V2 counters read "N OF 5" exactly once, with the right number on every slide. V4 page numbers 2 to 5 are correct.
- **Clean across all 16:** no em dashes (the V2 hook exemplar's em dash was not copied), no watermarks, handles or signatures, and nothing cut off at any edge.

```json
{
  "assets": [
    { "path": "schedule-tweets/images/yt/yt-posts-46dafdfb-02-the-retrace.png", "verdict": "FAIL",
      "defects": [
        "The y-axis says 'Price (USD)' but the scale runs 0 to 7M. That is $GOLDEN's market cap; its actual price is about $0.0045, so the label is factually wrong. (Slide 4 correctly says 'Market Cap (USD)', so the two slides also disagree.)",
        "The chart contradicts the slide. The title says 'this week' and a stat box says '7-DAY MOVE: STILL ABOUT +25%', but the line climbs from about $0.2M to $6M, which reads as a ~30x move. This is the V4 figure-drift the SKILL warns about (2026-09-10).",
        "The NOW point is plotted at about $4.7M while the stat box says 'ABOUT $4.5M'"
      ],
      "fix": "Code-render with repurpose/output/kaspa-lane3-fix/render_v4_slide.py: exact text, 'Market Cap (USD)' axis, a chart whose start is consistent with +25% on 7 days / +120% on 14 days, peak ~$6.09M on Sept 27, NOW at $4.5M. Do not re-roll in ChatGPT." },
    { "path": "schedule-tweets/images/yt/yt-posts-4ff05bc7-05-question.png", "verdict": "FAIL",
      "defects": [
        "About 40% of the frame (y≈470 to 985) is three empty pastel panels with no information, repeating the A/B/C letters already shown in the stat boxes above. The V4 exemplar fills its centre panel with a chart; this looks unfinished.",
        "The cause is in the plan: the prompt asked for panels that are 'otherwise empty'. The rendered text itself is exact."
      ],
      "fix": "Re-author the centre panel, then code-render with render_v4_slide.py. Example: one market-cap ladder with NOW $4.5M marked against the three zones A (<$10M), B ($20M to $30M), C ($100M+). Or drop the panel and enlarge the question." },
    { "path": "schedule-tweets/images/yt/yt-posts-81c1e035-04-the-flip.png", "verdict": "FAIL",
      "defects": [
        "Font drift within the carousel: the teal accent line and the body text use a condensed DIN/Barlow-style face. Slides 1, 2, 3 and 5 and the exemplar 074be0dc use a wide geometric sans. Side by side with slide 3 the difference is obvious.",
        "The headline's right margin is only 33px (2.6%). 'bottom.' almost touches the edge. It is not clipped, but it is the tightest edge in the set (the exemplar keeps at least 105px)."
      ],
      "fix": "Regen anchored on version2/yt-posts-074be0dc-04-the-solution.png. Add 'accent line and body in the same regular-width sans as the reference, not condensed' and 'keep all text at least 8% from every edge'. Consider breaking the 13-word headline so it wraps with a smaller cap height." },
    { "path": "schedule-tweets/images/x/x-tweets-007ae952-spon-pons-native-pays-in-pons.png", "verdict": "PASS",
      "defects": ["Minor: faint embossed marks on some lime reward coins (visible only at 2x zoom, no readable glyph), despite 'completely plain'. The yellow $SPON coin is plain. Lime hue is the intended Robinhood #CCFF00. Furnace and burn stream present, no text."],
      "fix": "none required" },
    { "path": "schedule-tweets/images/x/x-tweets-00ad322d-golden-kitty-retrace-loading-not-leaving.png", "verdict": "PASS",
      "defects": ["Trophy matches the golden-kitty.png statue, including the eye band and the collar medallion's 'P' mark from the reference. Nothing from the screenshot half leaked in, no text. The 'stepped down from a higher ledge' detail is weak, but the metaphor reads: steady on a ledge, lit summit ahead, coins tumbling past."],
      "fix": "none" },
    { "path": "schedule-tweets/images/x/x-tweets-062a912d-bitcoin-etf-streak-crypto-flips-the-script.png", "verdict": "PASS",
      "defects": ["Gold coin face plain, scrolls blank, zombies unlettered. The crumbling columns on the left versus the glowing coin and zombies climbing the ramp on the right match the prompt."],
      "fix": "none" },
    { "path": "schedule-tweets/images/x/x-tweets-083cdd12-robinhood-chain-board-two-charts-standing.png", "verdict": "PASS",
      "defects": ["Minor: the trophy's collar medallion carries 2 to 3 garbled pseudo-glyph marks (~25px, unreadable at feed size), despite 'no lettering'. The Kitsu tag is a plain gold disc as asked, and the dog is proper 3D, not the reference's 2D style. Trophy on the taller pedestal. Faint embossing on the fallen-pedestal coins, no readable symbol."],
      "fix": "none required; optional PIL blur of the medallion if Mike objects" },
    { "path": "schedule-tweets/images/x/x-tweets-1de894a8-not-a-rug-until-97-percent-down.png", "verdict": "PASS",
      "defects": ["Bandaged silver coin climbing well above the red gauge segments. Gauge has no numbers, coin faces plain, rim coins peering down, no text."],
      "fix": "none" },
    { "path": "schedule-tweets/images/x/x-tweets-2e08b3f1-golden-kitty-bots-cannot-shake-me-out.png", "verdict": "PASS",
      "defects": ["Red-eyed drones with snapping ropes around a calm trophy. Drones unmarked; medallion 'P' is faithful to the reference. No text."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-3bd3a25d-01-hook.png", "verdict": "PASS",
      "defects": ["Minor spec miss: the bottom text sits 4.2% to 4.9% from the edges instead of the requested 8%. No characters are clipped, and the V4 exemplar has the same edge-to-edge treatment. Text exact, 'LOADING' in green, chart bubble peaks then settles on a higher plateau, statue only (no screenshot leak), SWIPE FOR MORE present."],
      "fix": "none required" },
    { "path": "schedule-tweets/images/yt/yt-posts-498168cd-03-why-it-holds.png", "verdict": "PASS",
      "defects": ["All text exact, page 3 once, matches the V4 layout. The nodes are stacked vertically instead of in a row, but they converge into HOLDS THE LINE, which is fine. Icons only, no stray text."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-4bb8e5b0-04-the-targets.png", "verdict": "PASS",
      "defects": ["Minor: the 'TO $30M' line in the middle stat box is misaligned (indented). Value labels are repeated above the bars (duplicates of the spec text, nothing invented). Axis correctly reads 'Market Cap (USD)', bar heights proportional, page 4 once, bullets exact."],
      "fix": "none required" },
    { "path": "schedule-tweets/images/yt/yt-posts-50cd61a0-01-hook.png", "verdict": "PASS",
      "defects": ["'1 OF 5' once, text exact (a trailing period was added to the accent line). Advisory: the V2 teal measures 177.7° (the set runs 177.7 to 183°, brighter cyan) against the exemplar's 174.5 to 178.9°, a slight drift that is consistent across the set. Headline right margin 45px, not clipped."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-5b71261a-02-the-flows.png", "verdict": "PASS",
      "defects": ["'2 OF 5' once, text exact, Cowen quoted only as 'clearly got wrong', no em dash. Margins 52 to 57px, tight but not clipped."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-72d30224-03-the-cracks.png", "verdict": "PASS",
      "defects": ["'3 OF 5' once. Figures exact (5.62%, 2002, 81.9, 2014, 7.08M vs 7.23M). Layout matches the exemplar."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-868a5291-05-question.png", "verdict": "PASS",
      "defects": ["'5 OF 5' once, text exact, fonts match slides 1 to 3. 'everything' ends 49px from the right edge, not clipped."],
      "fix": "none" }
  ],
  "summary": { "checked": 16, "passed": 13, "failed": 3 },
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-46dafdfb-02-the-retrace.png",
    "schedule-tweets/images/yt/yt-posts-4ff05bc7-05-question.png",
    "schedule-tweets/images/yt/yt-posts-81c1e035-04-the-flip.png"
  ]
}
```

The Google Drive connector on claude.ai needs to be re-authorized in your connector settings. This check didn't use it.
