# Visual QA: batch `stock-market`, Lane 3 images (2026-11-09)

_Run by the `visual-qa` agent from the operator session. The batch skips its own visual-QA node once
`pipelines.repurpose` is done, and Lane 3 was finished by a hand-run repair after the ChatGPT 429 fix._

**Result: all 31 images pass. Nothing must be fixed before posting.** Every image was opened, every logo
was cropped at full resolution, and each was checked against its prompt in
`repurpose/output/stock-market-lane3-plan.json` and the image rules in `repurpose/SKILL.md`. Six images
have minor advisory notes (listed at the end); none blocks posting.

## Checks that apply to every image
- **Sizes:** 12 X images 1254x1254 (1:1), 9 IG images 1122x1402 (4:5), 10 carousel slides 1254x1254.
- **Kaspa X/IG pairs:** all 9 pairs have different file hashes and are visibly separate renders.
- **No copied references:** no image matches any file in `images/reference/` pixel for pixel.
- **No swapped files:** every file shows its own prompt's subject.
- **No stray text:** no text, watermarks, signatures or corner badges in the illustrations. The only
  text-like marks are an illegible blurred exit sign (`adb7a459` X) and fake lettering on GPU parts
  (`ig-single-989a3a29`); neither can be read at feed size.
- **Kaspa logo:** the K is mirrored correctly on every Kaspa coin, including small coins in jars, the
  ocean and doorways, matching `kaspa-logo.png`.
- **No em dashes** in any rendered text.

## X tweets (1:1)
| Image | Verdict | Notes |
|---|---|---|
| `x-tweets-3a29b9e4-kaspa-below-50-week-sma.png` | PASS | Coin filling the jar under the light beam, crowd fleeing. Crowd lit teal, not grey (cosmetic). |
| `x-tweets-3f2c5024-tao-decentralized-ai-hedge.png` | PASS | TAO "T" matches `bittensor-tao.png`. |
| `x-tweets-8c2a6bef-kaspa-100-trillion-math.png` | PASS (advisory 1) | Logo correct. |
| `x-tweets-5150e09d-eth-flip-maxis-find-kaspa.png` | PASS | Old gold coin fully plain; doorway Kaspa coin correct. |
| `x-tweets-b1cc9ac1-sp500-3-trillion-bitcoin-holds.png` | PASS | Plain gold coin (no Bitcoin reference exists). |
| `x-tweets-989a3a29-kaspa-fair-launch-lore.png` | PASS | Logo correct. |
| `x-tweets-b5d09224-silverscript-live-dagknight-next.png` | PASS | Logo correct. |
| `x-tweets-4d4348cd-kaspa-born-in-a-bull.png` | PASS (advisory 3) | Logo correct. |
| `x-tweets-968a18b3-kaspa-speed-and-hard-money.png` | PASS | Speed/vault split, logo correct. |
| `x-tweets-bed16fe1-kaspa-under-three-cents.png` | PASS | Logo correct. |
| `x-tweets-a38eef83-banks-picked-quant.png` | PASS | Quant logo faithful to `Quant.png` (blades around a white hexagon), no "QUANT" lettering. |
| `x-tweets-adb7a459-kaspa-fear-is-the-sale.png` | PASS (advisory 2) | Logo correct. |

## IG single images (4:5), all Kaspa
| Image | Verdict | Notes |
|---|---|---|
| `ig-single-3a29b9e4-kaspa-below-50-week-sma.png` | PASS | Grey crowd, closer to the prompt than the X version. |
| `ig-single-8c2a6bef-kaspa-100-trillion-math.png` | PASS (advisory 1) | Logo correct. |
| `ig-single-5150e09d-eth-flip-maxis-find-kaspa.png` | PASS | Old coin has a face but no symbol (allowed). |
| `ig-single-989a3a29-kaspa-fair-launch-lore.png` | PASS | GPU lettering illegible. |
| `ig-single-b5d09224-silverscript-live-dagknight-next.png` | PASS | Logo correct. |
| `ig-single-4d4348cd-kaspa-born-in-a-bull.png` | PASS | Logo correct. |
| `ig-single-968a18b3-kaspa-speed-and-hard-money.png` | PASS | Logo correct. |
| `ig-single-bed16fe1-kaspa-under-three-cents.png` | PASS | Logo correct. |
| `ig-single-adb7a459-kaspa-fear-is-the-sale.png` | PASS (advisory 4) | Contrast reads better than on X. |

## YT carousel 1: Kaspa's first real bear market, reads as **Version 4**
| Image | Verdict | Notes |
|---|---|---|
| `yt-posts-6c1ede01-01-hook.png` | PASS (advisory 5) | Matches `version4/hook.png`. Green 140.8° (RGB 4,249,89), not chartreuse. |
| `yt-posts-705d0306-02-born-in-a-bull.png` | PASS | Text exact; page "2" once. |
| `yt-posts-35e85a84-03-where-it-sits.png` | PASS | 2.9 CENTS / 17% / 86% exact; page "3". |
| `yt-posts-e83a2473-04-the-math.png` | PASS | $3.33 and boxes exact; page "4". |
| `yt-posts-a214cbf2-05-question.png` | PASS | A/B/C exact; page "5". Empty panels are from the prompt. |

## YT carousel 2: the $3 trillion day, Bitcoin holds, reads as **Version 2**
| Image | Verdict | Notes |
|---|---|---|
| `yt-posts-761df2cd-01-hook.png` | PASS (advisory 6) | "1 OF 5" once; teal 174.9°. |
| `yt-posts-c1fb3895-02-the-drop.png` | PASS (advisory 6) | 4.36% / 5.8% / 12% exact. |
| `yt-posts-917a2384-03-the-economy.png` | PASS (advisory 6) | 7.5 million / 189K / 86K exact. |
| `yt-posts-cb6ab9cb-04-the-money.png` | PASS (advisory 6) | QE / October / 25 bp exact. |
| `yt-posts-43ae4ea2-05-question.png` | PASS (advisory 6) | 58K / 57K exact. |

## Advisories (no regeneration needed; Mike's call)
1. **`8c2a6bef` X and IG:** the coin is a large foreground figure, not "tiny against the ocean", and the
   ocean is Kaspa coins too, so it reads "a sea of Kaspa" rather than "Kaspa vs the $100T market". Fix
   if wanted: regen with "the Kaspa coin is very small in the frame, the ocean is made of plain unmarked
   gold and silver coins".
2. **`adb7a459` X:** coin and crowd both move toward the exit, weakening "going in while everyone runs
   out". Optional regen: "the coin walks deeper into the store, away from the exit, its back to the
   fleeing crowd".
3. **`4d4348cd` X:** the coin has no face, unlike the rest of the batch (the prompt does not require one).
4. **`adb7a459` IG:** the smile crosses the lower part of the K's vertical bar; still clearly Kaspa.
5. **`6c1ede01` hook:** side margins about 5.5% (72 px / 66 px) vs the 8% the prompt asked for. Nothing
   clipped; safe inside a square feed crop.
6. **V2 set (all 5):** titles are ALL CAPS; the V2 spec and exemplars use sentence case. The prompts were
   written in caps, so this is prompt drift, and earlier batches (30x-tao, ai-takeover, kaspa-cocktails,
   kcc20-live) shipped the same variant. Regen all 5 in sentence case only if V2 should hold its spec.

## Summary
`{ "summary": { "checked": 31, "passed": 31, "failed": 0 }, "must_fix": [] }`
