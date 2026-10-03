# bull-trap · Lane 3 visual QA

_visual-qa agent, 2026-10-03. I opened all 9 assets and checked each one against its prompt in `bull-trap-lane3-plan.json` and the house style in `repurpose/SKILL.md` (Pixar default, no stray text or signatures, V4 hook and slide exemplars, no pagination dots, page counter exactly once). I swept all four corners of the X images at 2.5x brightness. I measured the hook text margins and the green hue in code. This is a report only. No files were changed._

## Verdicts

| # | Asset | Verdict |
|---|---|---|
| 1 | `x/x-tweets-5d1d5ba7-ism-pmi-short-of-60-no-parabolic-run-yet.png` | PASS (minor note) |
| 2 | `x/x-tweets-bc499b08-tao-textbook-bull-trap-290-better-deal.png` | PASS |
| 3 | `x/x-tweets-8fc37b57-golden-kitty-a-winner-among-winners.png` | PASS (minor note) |
| 4 | `yt/yt-posts-cdc2add9-01-hook.png` | PASS (minor note) |
| 5 | `yt/yt-posts-323cad15-02-the-trap-on-the-daily-chart.png` | PASS (prompt deviation noted) |
| 6 | `yt/yt-posts-b51de536-03-the-bullish-case-is-on-tv.png` | PASS (prompt deviation noted) |
| 7 | `yt/yt-posts-7a0385e9-04-the-level-that-decides-october.png` | PASS |
| 8 | `yt/yt-posts-2dfdc65a-05-not-parabolic-yet.png` | **FAIL** (low severity, can be fixed in place) |
| 9 | `yt/yt-posts-ae47c58a-06-question.png` | PASS |

## Per-asset detail

### 1. 5d1d5ba7 · ISM gauge (X). PASS
- **Matches the prompt:** Pixar CGI, square, dark factory hall. The gauge has three unlabeled zones (red, green, gold). The needle trembles in the green zone, short of gold. The rocket is cold and unmarked. The gold coin character has a plain face, crossed arms and a foot tap, and plain coins wait on crates. There’s no greenish cyan. The corners are clean: no signature or watermark.
- **Minor:** the front crate (around x 145-235, y 1015-1050) has a small brass nameplate with blurred **pseudo-lettering** on it. It’s illegible at feed size, but the prompt asked for no text.
- **Optional fix:** darken or blur that nameplate in place. Don’t regenerate.

### 2. bc499b08 · TAO and the glass bull in the trapdoor (X). PASS
- The coin is white and carries one black TAO glyph that is faithful to `bittensor-tao.png` (top bar, curved stem), and no other marking. The green-glass bull is half-fallen into an open trapdoor and looks surprised. The coin looks calm, arms folded, with a knowing smile. The staircase of server racks climbs to a white beacon. Navy background, lighting as specified, no greenish cyan. The corners are clean.
- **Nit, no action needed:** the shoe tongues carry tiny dark tabs with no readable lettering.

### 3. 8fc37b57 · Golden kitty hall of winners (X). PASS
- The hero gold cat trophy sits under a spotlight with confetti falling. A curved shelf of smaller trophies on plain black pedestals stands behind it, and a red velvet rope on brass posts runs in front. Nothing from the screenshot half of the reference leaked in: no Robinhood logo, no emojis, no tweet text. The corners are clean.
- **Minor:** the collar medallion carries a faint embossed "P" or keyhole mark, copied from the real trophy’s Product Hunt tag. The prompt asked for a "small round collar medallion" and no lettering. It’s only legible when zoomed in.
- **Minor:** the render reads as a glossy photoreal product shot rather than Pixar CGI. That suits a trophy and isn’t style drift that needs action.

### 4. cdc2add9 · V4 hook (YT carousel slide 1). PASS
- Saylor’s likeness is faithful. The conference backdrop ("CONSENSUS", "CoinDesk") is replaced with a clean, soft pale-blue background. The image-size label and the bitcoin logo on the T-shirt are gone. The circular candle bubble sits top right, green up to a peak and then red down.
- The text is exact: "EVERYBODY IS BULLISH / ON OCTOBER / IS IT A **BULL TRAP**?" with BULL TRAP in green (measured hue 129°, house neon green, no chartreuse). "SWIPE FOR MORE" is present. There are **no pagination dots**: the strip below SWIPE measures pure black (max value 2). There’s no watermark or @handle and no em dash.
- **Minor:** the right edge of headline line 1 ("BULLISH") ends at x=1182, a **5.7% margin** against the 8% the prompt asked for. Nothing is clipped and it reads cleanly, so no fix is needed.

### 5. 323cad15 · "The bull trap on the daily chart" (slide 2). PASS
- The title, the three stat values (ABOUT $87K / ABOUT $434M / ABOUT 74%), the chart labels (ABOUT $87K peak, ABOUT $84.5K start) and both bullets are verbatim. There’s no number drift and nothing was copied from the exemplar (no CAPE figures, no @cryptodaily). The page number "2" appears once, top right. No em dashes, no logos, no faces.
- **Prompt deviation:** the bottom insight box is **red** ("WHAT HAPPENED" with a warning icon), but the prompt asked for **green**. Together with slide 3, the set reads red on 2-3 and green on 4-6. That fits the meaning (2 and 3 are the warnings, 4-6 are Mike’s read) and matches the exemplar’s red warning box, so it’s acceptable. Mike should still know it differs from the prompt.
- **Nit:** the peak marker and dashed line sit at about 87,350, a little above the $87,249 actual high. The label says "ABOUT", so this is fine.

### 6. b51de536 · "The bullish case is on national TV" (slide 3). PASS
- The title and all three stat boxes are verbatim (TARGET $240, FROM $136 / ONLY 3 / UP 40% TO $30.5B). The bar chart has 13 bars from 2013 to 2025, red exactly at 2014, 2018 and 2025, with no value labels. Both bullets are verbatim. The "3" appears once. No em dashes.
- **Prompt deviation:** the box is red where the prompt asked for green (same note as slide 2).
- **Nit:** the "3" badge sits close to "TV" (about 10 px apart) but doesn’t overlap. The "WHALE STABLECOINS TO BINANCE:" label has tight but clean padding inside its box.

### 7. 7a0385e9 · "The level that decides October" (slide 4). PASS
- The title, the stats (ABOUT $83,555 / MAYBE $90K FIRST / A CLOSE BELOW THE OPEN), the chart and the green "MY READ" box all match the prompt. On the chart, the dashed OCTOBER OPEN line sits at about 83.6K, the line peaks at "ABOUT $90K", and it ends below the open in red. Both bullets are verbatim, including "$58K". The "4" appears once. No em dashes.
- **Nit:** "holds." on bullet 2 ends about 12 px from the box edge. It’s tight but inside the box.

### 8. 2dfdc65a · "Why this is not parabolic yet" (slide 5). FAIL (low severity)
- The content is all correct: 54.5 / 9 IN A ROW / ABOVE 60, dashed lines labelled 50 and 60, and a line that stays under 50 most of the way, crosses it near the right, then moves sideways below 60. The green "THE GRIND" box and both bullets are verbatim. The "5" appears once. No em dashes.
- **Defect:** the title and the divider collide. The title is set lower than on the other slides, so the **descenders of "p" in "parabolic" and "y" in "yet" run through the ornamental divider line** under the title (around y 170-185). You can see the line pass through the letters. Slides 2, 3, 4 and 6 all leave the divider clear of the title.
- **Fix (in place, no regeneration needed):** paint out the divider (the background there is white or near-white) and redraw it about 15-20 px lower so it clears the descenders. Use the same thin dark rule with the centre chain ornament, and copy it from slide 4 for an exact match. Don’t regenerate: the figures are correct now, and the 2026-09-10 note says ChatGPT drifts V4 numbers on a regeneration. If an in-place edit isn’t practical, rebuild the slide with `render_v4_slide.py`.

### 9. ae47c58a · Question slide (slide 6). PASS
- The two-line title is verbatim ("Does Bitcoin close October / above or below $83,555?"). The stats are verbatim (ABOUT $83,555 / A: ABOVE IT, A GREEN OCTOBER / B: BELOW IT, THE BULL TRAP). There are two panels headed A and B and otherwise empty, as the prompt specified. The "TELL ME IN THE COMMENTS" box has a chat-bubble icon and the single bullet "Bet right now: A or B, and why?". The "6" appears once. No em dashes.
- **Note:** the two empty panels leave a large blank white area in the middle of the slide. That’s what the prompt asked for, but Mike may find it thin.

## Set-level checks (carousel)
- **Counters:** the hook has none, and slides 2-6 each show exactly one page number (2, 3, 4, 5, 6) in the correct order. **Pass.**
- **Pagination dots:** there are none on the hook. **Pass.**
- **Exemplar lifts:** no CAPE data, no @cryptodaily watermark, no "SWIPE FOR MORE" bar on the data slides, and no Trump or shield logo on the hook. **Pass.**
- **Chartreuse drift:** this is a V4 set, so the V1 rule doesn’t apply. The hook’s green measured 129° (on-hue). **Pass.**
- **Figure drift (the known V4 failure):** I checked every figure on slides 2-6 against the prompts. There’s **no drift**.

## Summary
```
{ "summary": { "checked": 9, "passed": 8, "failed": 1 },
  "must_fix": ["schedule-tweets/images/yt/yt-posts-2dfdc65a-05-not-parabolic-yet.png  (title descenders run through the divider; lower the divider in place)"],
  "optional": ["5d1d5ba7 crate nameplate pseudo-lettering (blur in place)",
               "slides 2-3 red insight box vs the prompt green (acceptable, Mike decides)"] }
```
