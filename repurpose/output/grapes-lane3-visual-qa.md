# grapes - Lane 3 visual QA

_Re-run by the main loop 2026-10-05: the batch's own visual-qa agent died on an API 529 (Overloaded) with no report._

**Result: 11 PASS, 2 FAIL.** All V4 figures on data slides 2-4 match the plan exactly (no drift); the hook uses the statue only (no screenshot half).

| # | Asset | Verdict | Defects / notes | Fix |
|---|---|---|---|---|
| 1 | x-tweets-7bd4ad20-citi-coinbase-stablecoin-checkout-no-crypto | PASS | Blank pediment, plain coin, no green-cyan drift (<1%), clean corners | none |
| 2 | x-tweets-7b6dc09b-bitcoin-best-q3-since-2017-zombies-waiting | PASS | Minor: coin faces camera, sunset backdrop instead of deep navy | none |
| 3 | x-tweets-eba0398a-golden-kitty-one-of-five-memes-standing | **FAIL** | (a) FIVE background coins + statue = six survivors on a "one of five" post (prompt said four). (b) faint script-like pseudo-glyphs on all five background coins (spec: plain faces) | Regenerate (move old file aside, keep image_id); stress "EXACTLY FOUR small plain coins" |
| 4 | x-tweets-a08ed049-swift-picked-consensys-team-behind-linea | PASS | Linea mark matches linea.png; no lettering; all windows already lit (minor) | none |
| 5 | x-tweets-a3373a36-krc20-season-waits-for-kaspa-10-cents | PASS | Kaspa glyph correct; bars teal not pale, crowd saturated not pastel (minor) | none |
| 6 | ig-single-a3373a36-krc20-season-waits-for-kaspa-10-cents | PASS | 1122x1402 (4:5); glyph correct; pale bars | none |
| 7 | x-tweets-0259135e-five-thousand-dollars-how-much-kaspa | PASS | Glyph correct; plain wallet + coins; single "?" | none |
| 8 | ig-single-0259135e-five-thousand-dollars-how-much-kaspa | PASS | 4:5; "?" high in frame | none |
| 9 | yt-posts-1c14a967-01-hook | PASS | Statue only; text exact; SWIPE FOR MORE, no pagination dots; no watermark. Side margin ~6.3% vs 8% (not clipped); "DYING" runs into "I COUNTED" | none (optional punctuation in a future regen) |
| 10 | yt-posts-119f38ba-02-the-three-week-test | **FAIL** (cosmetic) | Figures exact. (a) stray 1px grey frame line on all four edges (slides 3-5 have none). (b) style drift vs exemplar + slides 3-5: no ornament divider, no stat icons, single-colour heavier title. Minor: "DAY 5" in green | Paint the 1px border white in place (safe). Style drift: leave, or rebuild via render_v4_slide.py (a ChatGPT regen risks number drift) |
| 11 | yt-posts-5020ed93-03-retracement-or-rug | PASS | Figures exact; bar lengths ~correct; "86%: NORMAL" box uses red warning icon (minor) | none |
| 12 | yt-posts-125b76f0-04-golden-kitty-still-standing | PASS | Figures exact; line pulls back to 50.6% of peak | none |
| 13 | yt-posts-68fc2709-05-question | PASS | Text exact; empty A/B panels take ~45% of the slide (as planned) | none |

## V4 figure-drift check (slides 2-4)

Every stat, chart label and bullet matches the plan text exactly. The code-rendered fallback is not needed for any figure.

## Must fix

1. `schedule-tweets/images/x/x-tweets-eba0398a-golden-kitty-one-of-five-memes-standing.png`: count wrong (six survivors) + glyph squiggles. Regenerate.
2. `schedule-tweets/images/yt/yt-posts-119f38ba-02-the-three-week-test.png`: 1px border (paint white in place); the style drift is Mike's call.
