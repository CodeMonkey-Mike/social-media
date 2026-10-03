# archie-promo — Lane 3 visual QA (persisted from agent output 2026-09-23T21:56:16)

I QA'd all 22 Lane 3 images for `archie-promo`: **11 pass, 11 fail.** Your file list came through empty, so I took the 22 image IDs from the lane-3 plan. All 22 are on disk under `schedule-tweets/images/x/` and `schedule-tweets/images/yt/`. I opened every one and zoomed into details, and I measured hue and text margins where the eye isn't reliable.

The main problems:
- **Two V4 data charts invent figures.** Slide 3 plots data to Oct 10, and slide 2 plots the breakout after its Oct 2026 tick with a made-up price history. Both need the code-rendered slide path, not another ChatGPT roll.
- **Five promo tweets are missing the ARCHIE code in the image.** The 2026-09-23 house rule says any tweet that pushes a promo code carries it in the image. The plan's prompts left it out for these five, so the prompts need patching before a regen.
- **Two tweet images have a small mark leaked onto a character's glove** (708e665e, 5a094cad).

```json
{
  "assets": [
    { "path": "schedule-tweets/images/yt/yt-posts-87022d56-02-the-timing.png", "verdict": "FAIL",
      "defects": ["The chart invents figures (SKILL.md says to check ChatGPT data slides for this). The x-axis runs Oct 2024 to Oct 2026, and the SEPT 20 breakout dot sits AFTER the Oct 2026 tick, with the price line continuing past it into dates that haven't happened yet (today is Sept 23).",
                  "The price history is made up and contradicts the slide's own stat box. It shows BTC at $52-60K through 2025, below the 50-week SMA for the whole two-year span, while the box says 45 weeks below (below only since Nov 2025).",
                  "Minor: the stat-box icons were copied from the reference, so a red warning triangle sits beside the bullish $81,159 close and a star beside '45 weeks below'."],
      "fix": "Code-render with repurpose/output/kaspa-lane3-fix/render_v4_slide.py (SKILL.md's rule for data slides that carry specific numbers). Use real weekly closes, or a schematic with no axis values, and end the data at Sept 20. Do not reroll in ChatGPT." },
    { "path": "schedule-tweets/images/yt/yt-posts-920b3df9-03-the-damage.png", "verdict": "FAIL",
      "defects": ["Future dates: the x-axis and the plotted line run to Oct 10, which hasn't happened yet.",
                  "The SEPT 18 cliff marker sits on the Sep 19 tick.",
                  "The chart peaks at about $26M while the stat box says 'about $24M', so the slide contradicts itself."],
      "fix": "Code-render with render_v4_slide.py: an Aug 1 to Sept 23 axis, a $24M peak, about $9M on Sept 17, the cliff on Sept 18, and under $600K at the end." },
    { "path": "schedule-tweets/images/x/x-tweets-708e665e-knocking-over-your-own-king.png", "verdict": "FAIL",
      "defects": ["A glyph leaked onto the $IF coin's left glove: a sketched oval-and-line mark on the back of the glove (about x150-300, y570-700). The prompt required the emblem to be the only marking.",
                  "Advisory only: two floating 3D '?' marks over the gold coin. They aren't words, but they are stray symbols."],
      "fix": "Glove is a flat texture, so per SKILL.md a pixel inpaint is allowed. Paint that patch plain white; if the inpaint fails, regen." },
    { "path": "schedule-tweets/images/x/x-tweets-5a094cad-what-if-i-get-rugged-not-in-my-group.png", "verdict": "FAIL",
      "defects": ["A green '//'-like glyph leaked onto the back of the $IF coin's right glove (about x960-1010, y640-680).",
                  "Promo text is spelled correctly ('PROMO CODE: ARCHIE' / '50% OFF YOUR FIRST MONTH') and nothing is clipped, but it sits 4.5-4.8% from the edges, not the 8% the prompt asked for."],
      "fix": "Inpaint the glove patch plain white. A regen would risk the correct text, so keep the tight margin unless Mike wants it redone." },
    { "path": "schedule-tweets/images/x/x-tweets-0ef46de8-promo-code-archie-what-if-rugged.png", "verdict": "FAIL",
      "defects": ["Promo-code rule (SKILL.md, 2026-09-23): this tweet's hook IS the ARCHIE code, but the image has no 'PROMO CODE: ARCHIE / 50% OFF YOUR FIRST MONTH' headline. The plan's prompt left it out.",
                  "The cartoon face is drawn over the emblem figure's shoulder, so the coin reads as a figure with a second face beside it.",
                  "The rug appears to start at the platform edge by the coin's feet rather than under empty air. The joke still mostly reads."],
      "fix": "Patch the prompt with the promo headline block, move the grin/eyes clear of the emblem (or make the coin faceless), then regen." },
    { "path": "schedule-tweets/images/x/x-tweets-41fd11c5-most-viewed-livestream-promo-code.png", "verdict": "FAIL",
      "defects": ["Promo-code rule: the tweet pushes code ARCHIE but the image carries no code headline.",
                  "Minor: faint made-up text on the left monitor's bottom bezel (about x600, y878). The prompt required 'no lettering'."],
      "fix": "Regen with the promo headline block. Keep the rest: green-eyed Pixar Mike, blank screens, plain coins." },
    { "path": "schedule-tweets/images/x/x-tweets-6ee9ba82-thanks-archie-promo-code.png", "verdict": "FAIL",
      "defects": ["Promo-code rule: the tweet is entirely about code ARCHIE but the image has no code headline. The scene itself is clean: blank screen, blank ticket, plain coins, no signature."],
      "fix": "Regen with the promo headline block; the empty cinema screen area is a natural spot for it." },
    { "path": "schedule-tweets/images/x/x-tweets-50c0385d-vip-59-premium-79-half-off.png", "verdict": "FAIL",
      "defects": ["Promo-code rule: the tweet says 'Promo code ARCHIE cuts your first month in half' but the image has no code headline. Otherwise clean: blank ticket, plain coin, no signature."],
      "fix": "Regen with the promo headline block." },
    { "path": "schedule-tweets/images/x/x-tweets-1e738f3d-sell-alerts-always-go-out.png", "verdict": "FAIL",
      "defects": ["Promo-code rule: the tweet closes with 'Promo code ARCHIE: 50% off your first month' but the image has no code headline. This is the weakest case, since the hook is the sell-alerts story. The scene itself is clean: plain coins, no text, corners clear."],
      "fix": "Regen with the promo headline block. Or, if you count this as a sell-alert tweet rather than a promo tweet, override to PASS." },
    { "path": "schedule-tweets/images/x/x-tweets-2e3e0ff4-if-chart-from-24m-to-600k.png", "verdict": "FAIL",
      "defects": ["Brand safety: the What If figure is rendered full-body nude, kneeling, with bare buttocks as the dead-center focal point. The reference crops at the upper back. This invites replies and undercuts the 'stunned at the edge' read.",
                  "Otherwise faithful: faceless, engraved hatching, back view, lime staircase ending at a cliff, tiny lime speck below."],
      "fix": "Regen, adding 'the figure is visible only from the mid-back up; the lower body is hidden behind the top step'. Or Mike accepts the mascot's nudity and this becomes a PASS." },
    { "path": "schedule-tweets/images/yt/yt-posts-a87f1fc2-05-question.png", "verdict": "FAIL",
      "defects": ["Composition: about 40% of the slide is three empty A/B/C panels, so it reads as an unfinished template. The V4 house layout puts a chart in the center. All the text itself is exact, and the page number '5' is correct."],
      "fix": "Code-render with render_v4_slide.py. Either drop the empty panels and enlarge the three answer cards with 'Comment A, B or C', or put the answer text inside the panels." },
    { "path": "schedule-tweets/images/x/x-tweets-06cf5a58-archie-sold-the-day-bitcoin-turned.png", "verdict": "PASS",
      "defects": ["Advisory: the top of the figure's bare buttocks shows above the cliff ledge. It's far less prominent than in 2e3e0ff4. The emblem (head and shoulders from behind, faceless) is correct, the gold coin is plain, there is no text and the corners are clean."], "fix": "" },
    { "path": "schedule-tweets/images/x/x-tweets-125a35ad-zombies-front-run-october.png", "verdict": "PASS", "defects": [], "fix": "" },
    { "path": "schedule-tweets/images/x/x-tweets-4c77d992-cowen-and-archie-wrong-same-week.png", "verdict": "PASS",
      "defects": [], "fix": "" },
    { "path": "schedule-tweets/images/x/x-tweets-646377a6-if-fell-77-percent-the-day-btc-reclaimed.png", "verdict": "PASS", "defects": [], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-787ba3fa-01-hook.png", "verdict": "PASS",
      "defects": ["Advisory: text is exact and nothing is clipped, but margins are 4.3-4.5% against the 8% the prompt asked for.",
                  "Copy advisory, not a visual defect: 'SOLD $IF THE DAY BITCOIN RECLAIMED THE 50-WEEK SMA' conflates Sept 18 (the sell alert) with Sept 20 (the weekly close). The plan's own fact-check says 'the day the breakout was holding'."], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-96552efc-04-the-zombies.png", "verdict": "PASS", "defects": [], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-a92f1bdd-01-hook.png", "verdict": "PASS",
      "defects": ["Advisory: green hue 126°, not chartreuse. Counter '1 OF 5' appears once. Headline sits 2.3-3.0% from the edges versus 6-9% on the exemplar; not clipped."], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-b5b102d8-02-sell-alerts.png", "verdict": "PASS",
      "defects": ["Advisory: hue 128°. '2 OF 5' appears once. Edge margin 2.1-3.7%; not clipped."], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-bc537924-03-what-you-get.png", "verdict": "PASS",
      "defects": ["Advisory: hue 131°. '3 OF 5' appears once. Edge margin 1.9-3.3%; not clipped."], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-c44cb02e-04-the-code.png", "verdict": "PASS",
      "defects": ["Advisory: hue 137.8°, about 15° cyan-ward of the house 122.6° and nowhere near chartreuse. '4 OF 5' appears once. Edge margin 1.9-3.0%."], "fix": "" },
    { "path": "schedule-tweets/images/yt/yt-posts-c6c937a3-05-question.png", "verdict": "PASS",
      "defects": ["Advisory: hue 125°. '5 OF 5' appears once. The left coin is gold with a green glow rather than 'bright green'. Edge margin 2.3-2.9%."], "fix": "" }
  ],
  "summary": { "checked": 22, "passed": 11, "failed": 11 },
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-87022d56-02-the-timing.png",
    "schedule-tweets/images/yt/yt-posts-920b3df9-03-the-damage.png",
    "schedule-tweets/images/x/x-tweets-708e665e-knocking-over-your-own-king.png",
    "schedule-tweets/images/x/x-tweets-5a094cad-what-if-i-get-rugged-not-in-my-group.png",
    "schedule-tweets/images/x/x-tweets-0ef46de8-promo-code-archie-what-if-rugged.png",
    "schedule-tweets/images/x/x-tweets-41fd11c5-most-viewed-livestream-promo-code.png",
    "schedule-tweets/images/x/x-tweets-6ee9ba82-thanks-archie-promo-code.png",
    "schedule-tweets/images/x/x-tweets-50c0385d-vip-59-premium-79-half-off.png",
    "schedule-tweets/images/x/x-tweets-1e738f3d-sell-alerts-always-go-out.png",
    "schedule-tweets/images/x/x-tweets-2e3e0ff4-if-chart-from-24m-to-600k.png",
    "schedule-tweets/images/yt/yt-posts-a87f1fc2-05-question.png"
  ]
}
```

**Checks that came back clean:**
- **Carousel V1:** no chartreuse on any slide (hue 125–138° against the house 122.6°; chartreuse is 44–97°). Each counter appears exactly once, top-left. There's no stray text, and all five match the 828eee71 exemplar style.
- **Tweet images:** no artist signatures in any corner (checked at 3× brightness). Every $IF emblem is faithful to what-if.jpg (faceless, seen from behind), every non-$IF coin is plain, and no image is a copy of its reference.
- **Carousel V4:** the "@cryptodaily" watermark from the exemplar was not copied onto any slide.
- **Text:** no em dashes in any rendered text, and every headline is spelled exactly as prompted.

My zoomed crops and measurement sheets are in a new folder, `repurpose/output/archie-promo-vqa/`. It's scratch and can be deleted.
