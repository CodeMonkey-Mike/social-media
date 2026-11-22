# Visual QA: batch `ripping`, Lane 3 images

QA run 2026-11-18 by the visual-qa agent. All 19 files were opened and checked against their prompt or spec in
`repurpose/output/ripping-lane3-plan.json` and against `repurpose/SKILL.md` (tweet/IG Pixar style, V2 code-render, V4 hook and data slides).
Pixel checks: sizes and aspect ratios, edge margins, whether title glyphs touch across lines (V2), accent hues, and zoom crops
of the logos, coin faces and badges. **Report only. No file was changed.**

## Summary

| | |
|---|---|
| Checked | 19 |
| Passed | 18 |
| Failed | 1 |

**Must fix:** `schedule-tweets/images/yt/yt-posts-d8d4c59b-01-hook.png` (the V4 hook copied the exemplar's shield badge).

Batch-level checks:
- **V1 chartreuse drift: not applicable.** Neither post uses V1. The posts use V4 (Pieverse) and V2 (every coin gets its day).
- **Counters appear exactly once.**
  - V2 slides 1 to 6 each have one teal `N OF 6` at the top left, in order.
  - V4 data slides 2 to 5 each have one circled page number, matching the slide.
  - The V4 hook has no counter and no page dots, which is correct.
- **Exemplar match.**
  - The V4 data slides match `version4/slide.png`: white page, title, divider ornament, three outlined stat boxes, a centre panel and a green insight box. None copied the `@cryptodaily` watermark.
  - The V2 slides use the code-rendered Anton/Inter template. The teal accent measures 176.9 deg, inside the exemplar band of 174.5 to 178.9 deg.
- **Aspect ratios.**
  - X images and all carousel slides are 1254x1254 (1:1).
  - Both IG singles are 1122x1402 (0.800, which is 4:5).
- **No em dashes** were rendered in any slide. No stray text appears in any tweet or IG image.

---

## Per-asset results

### X tweets / IG singles (Pixar style, no text)

**1. `schedule-tweets/images/x/x-tweets-eb0326e3-ai-writes-code-own-assets.png`: PASS**
- Matches the prompt:
  - Programmer with bright green eyes, dark hair and a black hoodie, walking toward the viewer with a half smile.
  - The open chest holds plain gold coins (zoom confirmed: blank faces) and glowing miniature buildings.
  - The robot types at the desk with sparks.
  - The monitors show abstract glowing bars only, with no letters or numbers.
- Navy background, cool blue and warm gold lighting. No text.
- Nit (no action): a tiny blurred bezel badge under the left monitor (about 15x8 px). It is unreadable and not a brand at feed size.

**2. `schedule-tweets/images/x/x-tweets-79196981-pieverse-one-billion-red-day.png`: PASS**
- The plush white cat matches the `pieverse.jpg` mascot: round fluffy body, black button eyes, whiskers, glowing blue headband.
- It rides a rocket straight up with one paw raised, trailing a blue and violet trail.
- Plain red coins fall around it; zoom confirmed no symbols.
- No reference desk, city or panel text was copied. No signature or watermark. No text.

**3. `schedule-tweets/images/x/x-tweets-3340c74d-kaspa-dollar-bridge-answer.png`: PASS**
- The Kaspa logo is correct: the mirrored K (vertical bar on the right, arms pointing left), glowing greenish cyan, matching `kaspa-logo.png`.
- The coin tugs the rope bridge with one hand and has a raised-brow, skeptical look.
- The bridge has missing planks and one frayed rope.
- The stone mint glows warm and has a stack of plain silver coins beside it.
- No text.
- Nit: the mint's pediment has a faint round carved medallion. It is blank, so not a logo.

**4. `schedule-tweets/images/ig/ig-single-3340c74d-kaspa-dollar-bridge-answer.png`: PASS**
- 4:5 companion of #3, same concept.
- Logo zoom: the mirrored K is intact and correct. The eyes sit just above the upper arm without hiding it.
- Stone mint with plain silver coins, broken bridge, frayed rope, a calm and unhurried pose. No text.

**5. `schedule-tweets/images/x/x-tweets-1d69c6df-solana-runs-before-tao.png`: PASS**
- The TAO coin is white and shows the dark tau emblem, matching `bittensor-tao.png`. It stands at the starting blocks with arms folded and a knowing smile.
- The purple-to-green coin is plain and sprints ahead, kicking up dust. This is the intended stand-in, since Solana has no reference logo (`missing_references`).
- Night track, stadium lights. No text.

**6. `schedule-tweets/images/x/x-tweets-701346b5-kaspa-day-has-not-come.png`: PASS**
- The Kaspa mirrored-K logo is correct.
- The coin waits in the wings by the red curtain, clasping its hands with a hungry grin.
- Three plain coins (bronze, silver, white) take the stage under a spotlight before a cheering crowd.
- No text.
- Nit: the "second spotlight swinging toward the wings" is weak. The single beam points at the stage. This is minor and the story still reads.

**7. `schedule-tweets/images/ig/ig-single-701346b5-kaspa-day-has-not-come.png`: PASS**
- 4:5 companion of #6. The logo zoom is correct and intact.
- A wing light sits by the coin, so the "light coming to the wings" beat reads better here than in the X version.
- Three plain coins on stage. No text.

**8. `schedule-tweets/images/x/x-tweets-db1534e9-eth-twenty-thousand-conservative.png`: PASS**
- The silver Ethereum coin shows the correct two-pyramid diamond logo. It climbs the ridge, jaw set.
- The plain gold coin (Bitcoin stand-in, no reference logo) sits on a stone throne at the summit with a nervous, sweaty look over its shoulder.
- Violet rim light on ETH, gold glow on the summit. No text.

### YT post 1: Pieverse, Version 4 (`yt-post-2026-11-18-pieverse-one-billion-four-payment-lanes`)

**9. `schedule-tweets/images/yt/yt-posts-d8d4c59b-01-hook.png`: FAIL**

What is right:
- The cat matches the reference, and the holo panels are blank.
- The top-right bubble chart runs flat and then climbs steeply, with no numbers.
- The text is exact: "PIEVERSE TOUCHED $1 BILLION" in white, "ON A RED DAY" in green (hue 130 deg), and "SWIPE FOR MORE".
- There are no page dots.

Defects:
1. **Shield badge copied from the exemplar.** A white and green keyhole shield sits at the centre of the grey divider (about x 600-665, y 838-890). The prompt explicitly banned it: "no shield badge ... must NOT be reproduced". The exemplar's channel badge does not belong on Mike's slide.
2. **Margin below spec.** Line 1 sits 69 px (5.5%) from the left and 68 px (5.4%) from the right. The prompt requires at least 8%. Nothing is clipped, so this is secondary.

Fix:
- Do not regenerate for the badge. Patch it in place, the same way `repurpose/SKILL.md` handles the V4 page dots:
  1. Inpaint or fill the shield's bounding box from the surrounding dark background. The area averages RGB (68,78,82), with a gradient over the desk.
  2. Redraw the grey divider straight through the gap so the line is continuous.
  3. Re-QA.
- If the patch shows (the background there is a gradient, not flat black), regenerate one item per invocation. Add "the divider line is one unbroken grey line with no icon, badge or emblem on it" and keep the 8% margin line.

**10. `schedule-tweets/images/yt/yt-posts-35fffc22-02-the-day.png`: PASS**
- The text is exact:
  - Title: "The day Pieverse touched $1 billion".
  - Stat boxes: ONE DAY: UP 70% / ONE WEEK: UP 118% / BITCOIN, SAME WEEK: DOWN 15%.
  - Insight box "NOVEMBER 18" with both bullets.
- No figure drifted. The chart runs flat and then spikes, with no axis labels.
- Page "2" appears once. No watermark, coins or logos.
- Title ink spans x 63-1224, which is tight on the right (about 30 px), but nothing is clipped.

**11. `schedule-tweets/images/yt/yt-posts-ac749550-03-the-call.png`: PASS**
- The text is exact:
  - Title: "How the call went".
  - Stat boxes: BOT FLAG: NEAR $20M / MY BUY: NEAR $60M / NOV 18: $1 BILLION.
  - Insight box "THE TIMELINE" with "Called in November 2025." and "Public in September 2026."
- Three plain green step bars, the third far taller, with no labels.
- Page "3" appears once. No watermark.
- Nit: "NEAR $20M" is set in red, which reads as a negative even though the bot flag was the early entry. This is a cosmetic colour choice, so no action.

**12. `schedule-tweets/images/yt/yt-posts-c7209042-04-four-lanes.png`: PASS**
- The text is exact:
  - Title: "Payments is four lanes now".
  - Stat boxes: BANKS: ZELLE PICKS SOLANA / WIRES: SWIFT AND CONSENSYS / SETTLEMENT: DTCC ON CANTON.
  - Insight box "LANE FOUR" with both bullets.
- Four plain parallel arrows. No logos; Zelle, Swift, DTCC and Consensys appear as text only, as planned.
- Page "4" appears once.

**13. `schedule-tweets/images/yt/yt-posts-a22324cd-05-question.png`: PASS**
- The text is exact:
  - Title: "Which payments lane ends up the biggest?"
  - Stat boxes: A: BANK TRANSFERS / B: SETTLEMENT / C: AI AGENTS.
  - Three empty panels headed A, B and C.
  - "TELL ME IN THE COMMENTS" with "Pick a lane and tell me why."
- Page "5" appears once.
- Nit: the title's top ascenders sit at y = 13 px, about 1% from the top edge. Nothing is clipped, and YouTube shows a 1:1 post uncropped, but it is the tightest top margin in the set. If the slide is ever regenerated, ask for more top padding.

### YT post 2: every coin gets its day, Version 2 (code-rendered; `yt-post-2026-11-18-every-coin-gets-its-day`)

Checks that apply to all six V2 slides:
- Anton title and Inter body fonts both loaded.
- The teal is 176.9 deg.
- Counters run 1 to 6 of 6, one each.
- The title-line check found no glyphs touching across lines on any slide.
- The left margin is 64-68 px everywhere.
- The text matches the spec word for word.

**14. `schedule-tweets/images/yt/yt-posts-9c8a1dce-01-hook.png`: PASS**
- Title "Every coin / gets its day", the accent line, "THE QUESTION" and both box lines are all exact.
- The right margin is 58 px (4.6%). Nothing is clipped.

**15. `schedule-tweets/images/yt/yt-posts-ac252f88-02-quant-and-near.png`: PASS**
- Text is exact: "Quant: 5x in six weeks"; accent "Around $56 on August 19 to around $287 on October 1"; "THEN NEAR" with $1.59 to $5.89 by October 12 and "Almost 4x".
- Nit: the auto-fit wrapped the title as "Quant: 5x / in six / weeks", leaving the right third of the title area empty. This is cosmetic.

**16. `schedule-tweets/images/yt/yt-posts-52cc8abd-03-pieverse.png`: PASS**
- Text is exact: "Pieverse: / $1 billion / on a red day"; accent "Up 70% in one day while Bitcoin fell 15% on the week"; "NOVEMBER 18" with both lines.
- The right margin is 54 px. Nothing is clipped.

**17. `schedule-tweets/images/yt/yt-posts-2d21989f-04-everything-at-once.png`: PASS**
- Text is exact: "When does / everything / pump at once?"; accent "My read: a taste in 2027, the real thing in 2028"; "WHAT IT NEEDS" with all three lines.

**18. `schedule-tweets/images/yt/yt-posts-248a803d-05-kaspa.png`: PASS**
- Text is exact: "Kaspa has not had its day yet"; accent "Around 2.7 cents, 87% under its all-time high"; "THE SETUP I WANT" with all three lines.
- Nits, both optional polish:
  - (a) The accent line breaks at the hyphen as "all-" / "time high". A dash at the end of a line reads awkwardly. Use a non-breaking hyphen (U+2011) in the spec, or force the break before "87%".
  - (b) The title leaves "yet" alone on line 3. The spec asked for two lines ("Kaspa has not / had its day yet"), but the auto-fit could not keep "had its day yet" on one line.

**19. `schedule-tweets/images/yt/yt-posts-0d397400-06-question.png`: PASS**
- Text is exact: "When does / Kaspa get / its run?"; accent "First half of 2027, second half of 2027, or 2028?"; "TELL ME IN THE COMMENTS" with "Pick one and tell me why."
- The question matches the post's `engagement_question`.

---

## Machine-readable result

```json
{ "assets": [
  { "path": "schedule-tweets/images/x/x-tweets-eb0326e3-ai-writes-code-own-assets.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/x/x-tweets-79196981-pieverse-one-billion-red-day.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/x/x-tweets-3340c74d-kaspa-dollar-bridge-answer.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/ig/ig-single-3340c74d-kaspa-dollar-bridge-answer.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/x/x-tweets-1d69c6df-solana-runs-before-tao.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/x/x-tweets-701346b5-kaspa-day-has-not-come.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/ig/ig-single-701346b5-kaspa-day-has-not-come.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/x/x-tweets-db1534e9-eth-twenty-thousand-conservative.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-d8d4c59b-01-hook.png", "verdict": "FAIL",
    "defects": ["green/white keyhole shield badge from the V4 exemplar reproduced at the centre of the divider (x 600-665, y 838-890), explicitly banned in the prompt",
                "headline line 1 margin 5.5 pct left / 5.4 pct right, below the 8 pct minimum in the prompt (not clipped)"],
    "fix": "in-place patch: inpaint the shield box from the surrounding dark gradient and redraw the grey divider straight through, then re-QA; if the patch shows, regenerate one item per invocation adding: the divider is one unbroken grey line with no icon, badge or emblem" },
  { "path": "schedule-tweets/images/yt/yt-posts-35fffc22-02-the-day.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-ac749550-03-the-call.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-c7209042-04-four-lanes.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-a22324cd-05-question.png", "verdict": "PASS", "defects": [], "fix": "nit only: title 13 px from the top edge" },
  { "path": "schedule-tweets/images/yt/yt-posts-9c8a1dce-01-hook.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-ac252f88-02-quant-and-near.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-52cc8abd-03-pieverse.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-2d21989f-04-everything-at-once.png", "verdict": "PASS", "defects": [], "fix": "" },
  { "path": "schedule-tweets/images/yt/yt-posts-248a803d-05-kaspa.png", "verdict": "PASS", "defects": [], "fix": "optional polish: non-breaking hyphen in all-time (accent wraps at all-); yet is alone on title line 3" },
  { "path": "schedule-tweets/images/yt/yt-posts-0d397400-06-question.png", "verdict": "PASS", "defects": [], "fix": "" }
 ],
 "summary": { "checked": 19, "passed": 18, "failed": 1 },
 "must_fix": ["schedule-tweets/images/yt/yt-posts-d8d4c59b-01-hook.png"] }
```
