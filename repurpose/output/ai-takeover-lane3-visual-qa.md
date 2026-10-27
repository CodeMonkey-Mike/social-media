# Visual QA: batch `ai-takeover`, Lane 3 images

QA date: 2026-10-20. Checked against `repurpose/output/ai-takeover-lane3-plan.json` (`images[]` prompts +
`carousel_versions`) and `repurpose/SKILL.md` (X/IG visual style, prompt-writing rules, YT carousel mode,
the V1 contamination note, the V2 em-dash note).
I opened every image at full size. I also zoomed in (2-3x) on logos, coin faces, props and edges, swept all four
corners with brightness boosted 3x (looking for signatures or watermarks), and swept the top and bottom bands
of every slide (looking for stray text or a second counter). The carousel accent hues were measured in PIL.
No asset was modified.

## Batch-wide checks
- **Aspect ratio:** all 8 X tweet images and all 10 slides are 1254x1254 (1:1). Both IG companions are
  1122x1402 (4:5). PASS.
- **Uniqueness (HARD RULE #1):** all 18 md5s are distinct. No slide is a copy of its exemplar.
- **Blank or failed captures:** none. Mean luminance runs 42-84, and every image is on-subject.
- **Watermarks / artist signatures:** none in any corner at 3x brightness.
- **V1 chartreuse drift:** none. Median hue of the green headline text per slide: 01 133.1 deg, 02 142.3, 03 135.5,
  04 124.4, 05 136.2. The exemplar `828eee71` measures 122.6, and the chartreuse band is 44-97. The set drifts
  slightly toward *cooler* spring green. It does not drift toward yellow-green.
- **V2 teal:** 179.5-181.7 deg on all 5 slides (exemplar 174.5). Healthy.
- **Counters:** each slide shows its 'N OF 5' exactly once, top-left, in the right sequence 1-5 on both sets.
  No exemplar counters were inherited.
- **Em dashes:** none on any slide (the V2 hook exemplar's em-dash hazard did not carry over).

## Per-asset verdicts

| # | Asset | Verdict |
|---|---|---|
| 1 | `images/x/x-tweets-c420e132-invest-while-you-still-have-the-paycheck.png` | PASS |
| 2 | `images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png` | **FAIL** |
| 3 | `images/x/x-tweets-7c15b746-buying-the-layer-the-ai-takeover-runs-on.png` | PASS |
| 4 | `images/x/x-tweets-9a52b532-calmer-than-57-percent-of-the-sp500.png` | PASS |
| 5 | `images/x/x-tweets-d6c8a42f-ai-prices-the-past-240k-sounds-low.png` | PASS |
| 6 | `images/x/x-tweets-cd13c616-kaspa-and-tao-lots-of-multipliers.png` | PASS |
| 7 | `images/ig/ig-single-cd13c616-kaspa-and-tao-lots-of-multipliers.png` | PASS |
| 8 | `images/x/x-tweets-b3ce2913-tokenized-stocks-run-through-arbitrum.png` | **FAIL** |
| 9 | `images/yt/yt-posts-c692054b-01-hook.png` (V2) | PASS |
| 10 | `images/yt/yt-posts-d9f297c3-02-the-bottleneck.png` (V2) | PASS |
| 11 | `images/yt/yt-posts-fc9c5f51-03-labor-not-needed.png` (V2) | PASS |
| 12 | `images/yt/yt-posts-9a3f7535-04-neutral-layers.png` (V2) | PASS |
| 13 | `images/yt/yt-posts-237a5a48-05-question.png` (V2) | PASS |
| 14 | `images/yt/yt-posts-bb366b2f-01-hook.png` (V1) | PASS |
| 15 | `images/yt/yt-posts-d1f2b0d8-02-the-chart.png` (V1) | PASS |
| 16 | `images/yt/yt-posts-e61714cd-03-front-run.png` (V1) | PASS |
| 17 | `images/yt/yt-posts-2811c27c-04-the-plan.png` (V1) | PASS |
| 18 | `images/yt/yt-posts-54afc8ca-05-question.png` (V1) | PASS |

### 1. x-tweets-c420e132 (Kaspa coin stacking in a vault, robot factory behind the window): PASS
- The prompt is fully realised: stone vault with a round vault door, a Kaspa character kneeling and placing a coin
  onto tall stacks, a wide window onto a factory floor of white robot arms with no humans, empty office chairs and
  blank monitors, plain silver discs on the conveyor. No text, and the screens are blank.
- Logo check at 2x: the hero face, the coin in its hand and every stacked or foreground coin show the
  **mirrored K** (bar on the right, chevron opening to the left), matching `reference/kaspa-logo.png`.
- Advisory (not blocking): the hero has no eyes or face, so the "calm, unbothered" mood comes only from body
  language. The house style says coins have eyes and emotions, and the IG companion (#2) does have eyes, so the
  pair is not a matched set. The prompt never asked for eyes, so this is not a prompt deviation.

### 2. ig-single-c420e132 (4:5 companion): **FAIL**
- **Defect: wrong Kaspa logo orientation on the largest foreground coins.** Three blurred foreground coins carry
  a **standard, non-mirrored "K"** (bar on the LEFT) instead of the Kaspa mirrored K:
  - bottom-left large coin, about x 0-300, y 1240-1402
  - the coin just behind it, about x 150-400, y 1180-1260
  - bottom-right large coin, about x 760-1100, y 1270-1402

  These are the biggest logo instances in the frame after the hero. This is the Kaspa-only IG post, where brand-mark
  accuracy is the point. The hero face and the coin in its hand are correct.
- Minor: several stack sides carry the K logo printed on the coin *edges*, as labels on a cylinder of stacked
  coins. Physically odd, but readable.
- Otherwise clean: portrait composition as specced (character and stacks low, factory window filling the upper half),
  the hero has eyes and a smile, no text, clean corners.
- **Fix:** the bad glyphs sit on out-of-focus flat coin faces. That is a texture region, not a face, so surgery is
  tolerated. Cheapest fix: mirror each of the three glyph patches horizontally in place, flipping the elliptical
  coin-face crop about its own vertical centre line, then feather the edge. If that looks wrong, regenerate this
  one item. Keep the same image_id and move the old file aside first, because gen_images skips existing files.
  Add to the prompt: "every Kaspa coin in the frame, including the blurred foreground coins, carries the MIRRORED K
  exactly as in the reference: vertical bar on the RIGHT, chevron opening to the LEFT".

### 3. x-tweets-7c15b746 (TAO coin lighting up a node lattice): PASS
- The TAO glyph matches `reference/bittensor-tao.png` (black tau, stem curving right at the base) on a white coin.
  The character has fists raised and a determined brow. Rings of glowing nodes are linked by light threads out to
  the horizon. Dark barred cabinets with padlocks stand in the far corners. The nodes and cabinets are plain.
  No text, and the corners are clean.

### 4. x-tweets-9a52b532 (calm gold coin on a beam among jittering coins): PASS
- A serene gold coin sits cross-legged (meditation mudra) on a steel beam under a single white spotlight. Grey and
  silver coins in suits wobble, sweat and fall, with motion blur. Red and green reflections come from background
  candles. A glowing blue line runs across the floor like a safety net. Every coin face is plain. No text.
- Advisory: the prompt asked for "eyes calm", but the gold hero is faceless (no eyes), so calm is carried only by the
  pose. It reads at thumbnail size. Also, one right-side jittering coin has a small ring loop on top, like a pocket
  watch. Cosmetic.

### 5. x-tweets-d6c8a42f (robot with a crystal ball, gold-coin launch outside the window): PASS
- A plain white robot (no brand) with glowing blue eyes sits contentedly at a desk, pencil over a blank sheet, and
  does not look at the window. Behind it, a column of plain gold coins blasts into a cloudy night sky over a city.
  Book spines are blank. At 2x the coins show only faint generic embossing, with no Bitcoin B or other glyph.
  No text, and the corners are clean.
- Advisory: the crystal ball holds a small **4-bar ascending chart**, not the specced "single simple glowing bar".
  It still reads as a modest forecast, so the metaphor survives.

### 6. x-tweets-cd13c616 (Kaspa + TAO on a mountain ledge at sunrise): PASS
- Kaspa (mirrored K, correct, greenish cyan) is on the left and slightly larger, as the hero. TAO (tau glyph,
  correct) is on the right. Both stand firm on the ledge above a sea of clouds, with a gold sunrise and a navy sky.
  Plain white discs sink into the clouds. No text, and the corners are clean.
- Advisory: both characters face the camera (logo-faces toward us) rather than "looking out at the rising sun".
  This is an inherent trade-off of logo-as-face, and acceptable. Also, the plain "paper coins" render as white or
  silver discs, close to the white TAO coin's colour, so a careless reader *could* take them as TAO coins
  falling. Low risk because they carry no tau.

### 7. ig-single-cd13c616 (4:5 companion): PASS
- It matches the X version: the logos are correct (mirrored K, tau), and the portrait composition is as specced
  (coins low-centre, sunrise and sky filling the upper half). The two coins' hands meet between them. No text,
  and the corners are clean. Same advisories as #6.

### 8. x-tweets-b3ce2913 (Arbitrum keystone over a river of tokens): **FAIL**
- **Defect: garbled pseudo-text on the old building.** The entablature frieze of the columned temple (top-left,
  about x 120-290, y 125-155) carries a carved "inscription" of garbled letterforms that reads like "IN WYGO" at 2x.
  This is exactly the banned garbled-text class. The prompt said "every building is completely plain: no
  lettering". It is small at feed size, but it is real pseudo-text.
- Secondary (advisory): the flowing "plain" certificate tokens all carry ruled grey document lines and a folded
  corner, despite "no marking of any kind". These are lines, not letters, so they read as documents. Acceptable
  unless the frieze fix becomes a regen, in which case fix both.
- Logo: rendered as the hexagonal Arbitrum badge, not a round coin. The two white slashes are correct. The two blue
  strokes are slightly merged into a lambda shape, but the badge stays recognisable and faithful to the real mark.
  Acceptable.
- Otherwise clean: arch over the dark river, the token stream flows from the old stone building through the gateway
  toward the glass city, cool blue rim light. Corners are clean.
- **Fix:** the frieze is flat stone texture, so surgery is tolerated. Clone or heal plain stone texture from the
  adjacent architrave across the band at about x 120-290, y 125-155, then re-check at 2x for leftover glyphs. If
  you regenerate instead (same image_id, old file moved aside), add: "the old building's pediment, frieze and
  architrave are smooth uncarved stone, no inscription, no carved letters; the certificate tokens are blank glowing
  rectangles with no lines".

### 9-13. V2 set (`yt-post-2026-10-19-ai-is-taking-the-jobs-invest-while-you-still-have-the-paycheck`): all PASS
All five match the V2 exemplar look: near-black textured background, small teal all-caps counter top-left,
heavy condensed white title, teal accent line, dark rounded box with a teal label and white body. Text was
checked word by word against the prompts:
- **01 hook:** '1 OF 5' / 'AI IS TAKING THE JOBS. INVEST WHILE YOU STILL HAVE THE PAYCHECK.' / 'Labor gets cheap. Assets
  get expensive.' / THE THESIS + body. Exact.
- **02:** '2 OF 5' / 'ENGINEERS NOW REVIEW AI CODE. AGENTS WILL REVIEW IT NEXT.' / bottleneck line / THE HORSELESS
  CARRIAGE + body. Exact.
- **03:** '3 OF 5' / 'FOR ALL OF HISTORY THEY NEEDED THE WORKERS. THAT ENDS WITH ROBOTS.' / accent / WHAT CHANGES +
  body. Exact.
- **04:** '4 OF 5' / 'ANTHROPIC PLEDGED 5% OF ITS SHARES. MUSK SAYS DEFLATION.' / accent / OWN THE NEUTRAL LAYERS +
  body with 'Bittensor ($TAO)' and 'Kaspa ($KAS)'. Exact, tickers correct.
- **05:** '5 OF 5' / 'DEFLATION OR INFLATION WHEN THE ROBOTS TAKE THE LABOR?' / 'Musk says deflation. The printer says
  otherwise.' / TELL ME IN THE COMMENTS + body. Exact.

Nothing is clipped. Advisory: the bottom box margins on 02 (box bottom at about y 1220) and 03 (about y 1210) are
tighter than the exemplar (about y 1183), but everything sits inside the frame. 04's body line "...AI inference
layer." ends about 20 px inside the box edge. Tight, not clipped.

### 14-18. V1 set (`yt-post-2026-10-19-bitcoin-under-the-may-high-where-i-buy-everything`): all PASS
All five were anchored on the clean `828eee71` exemplar. They match its look: bold condensed all-caps white plus
neon green headline, dark gridded chart panel with a neon-cut frame. Every gold or grey coin is plain at 2x (no
Bitcoin B, no Kaspa glyph, so nothing was lifted from the exemplar). Text checked word by word:
- **01:** '1 OF 5' / '57% OF S&P 500 STOCKS ARE NOW MORE VOLATILE THAN BITCOIN.' Exact. The chart matches the spec:
  a calm green line through a tangle of jagged grey lines, plain gold coin at the right end.
- **02:** '2 OF 5' / 'BTC CLOSED THE WEEK JUST UNDER THE MAY HIGH, ABOUT $82K, STILL ABOVE THE 50-WEEK SMA.' Exact.
  The chart matches the spec: price rises through the grey dashed line and rests just under the white dashed high,
  with a support curve well below.
- **03:** '3 OF 5' / 'THE ZOMBIES FRONT-RAN THE OCTOBER BOTTOM IN SEPTEMBER. NOW VOLUME IS SLIDING.' Exact.
  Surge-then-drift price; volume bars shrink to dim grey at the right edge.
- **04:** '4 OF 5' / 'OCTOBER 28: 84% PRICE A PAUSE. I SEE A HIKE. UNDER THE 50-WEEK SMA, I BUY EVERYTHING.' Exact.
  Breakdown through the support line into a lit lower zone holding a heap of plain gold coins, with marble columns
  on both sides.
- **05:** '5 OF 5' / 'DOES BITCOIN LOSE THE 50-WEEK SMA BEFORE OCTOBER ENDS?' Exact. Split panel: a red candle breaks
  below the line, a green candle bounces off it on a heap of plain grey coins, and a green "?" (the only extra mark
  allowed) sits in the middle.

Advisories (not blocking):
- **Hue consistency:** no chartreuse anywhere. The set spreads from 124 to 142 deg, though, and slide 02 is
  noticeably mintier (median RGB 1,250,93) than slide 04 (64,250,77). If Mike wants a matched set, apply the
  in-place band-limited hue rotation from SKILL.md to pull 01/02/03/05 back toward 122.6. Never regenerate for this.
- **04 buy-zone glow:** the lit lower zone measures 39-61% of its saturated pixels in the 44-97 deg band. That comes
  from the gold coins' warm glow bleeding into the green fill. On screen it reads as green with gold light, not
  chartreuse, so it is not flagged. If the hue rotation above is run, restrict the 04 pass to hues 65-110 inside
  about x 580-1110, y 960-1110, so the gold coins (about 45-55 deg) are untouched.
- **Tight margins:** the right edges of 'HIGH,' on 02 (about 34 px), 'EVERYTHING.' on 04 (about 39 px) and
  'ENDS?' on 05 (about 39 px) sit close to the frame edge. The V1 counter sits about 25 px from the top edge.
  Every character is whole, with nothing clipped.
- **04 copy read:** the accent split puts '84% PRICE' in green and 'A PAUSE.' in white, which visually groups
  "84% PRICE" as a noun phrase. The words are exactly as authored, so this is a judgment for Mike, not a defect.

## Machine-readable summary

```json
{
  "assets": [
    {"path": "schedule-tweets/images/x/x-tweets-c420e132-invest-while-you-still-have-the-paycheck.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: hero is faceless, unlike the IG companion)"},
    {"path": "schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png", "verdict": "FAIL", "defects": ["three large blurred foreground coins (bottom-left ~x0-300 y1240-1402, behind it ~x150-400 y1180-1260, bottom-right ~x760-1100 y1270-1402) carry a standard non-mirrored K instead of the Kaspa mirrored K", "minor: K logos printed on stacked-coin edges"], "fix": "mirror each bad glyph patch horizontally in place (flat out-of-focus texture), or regen this one item with the same image_id (old file moved aside), adding: every Kaspa coin incl. the blurred foreground ones carries the MIRRORED K, bar on the RIGHT, chevron opening LEFT"},
    {"path": "schedule-tweets/images/x/x-tweets-7c15b746-buying-the-layer-the-ai-takeover-runs-on.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-9a52b532-calmer-than-57-percent-of-the-sp500.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: gold hero is faceless though the prompt said eyes calm)"},
    {"path": "schedule-tweets/images/x/x-tweets-d6c8a42f-ai-prices-the-past-240k-sounds-low.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: crystal ball shows 4 ascending bars, not one bar)"},
    {"path": "schedule-tweets/images/x/x-tweets-cd13c616-kaspa-and-tao-lots-of-multipliers.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: characters face the camera; white paper coins are close to the TAO coin colour)"},
    {"path": "schedule-tweets/images/ig/ig-single-cd13c616-kaspa-and-tao-lots-of-multipliers.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-b3ce2913-tokenized-stocks-run-through-arbitrum.png", "verdict": "FAIL", "defects": ["garbled pseudo-lettering inscription carved on the temple frieze, top-left ~x120-290 y125-155 (prompt: buildings completely plain, no lettering)", "advisory: certificate tokens carry ruled document lines"], "fix": "clone/heal plain stone over the frieze band in place (flat texture) and re-check at 2x, or regen with the same image_id adding: smooth uncarved stone, no inscription; certificate tokens blank, no lines"},
    {"path": "schedule-tweets/images/yt/yt-posts-c692054b-01-hook.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-d9f297c3-02-the-bottleneck.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: tight bottom box margin)"},
    {"path": "schedule-tweets/images/yt/yt-posts-fc9c5f51-03-labor-not-needed.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-9a3f7535-04-neutral-layers.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-237a5a48-05-question.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-bb366b2f-01-hook.png", "verdict": "PASS", "defects": [], "fix": "none (hue 133.1, not chartreuse)"},
    {"path": "schedule-tweets/images/yt/yt-posts-d1f2b0d8-02-the-chart.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: coolest green of the set at 142.3; optional in-place hue rotation for set consistency)"},
    {"path": "schedule-tweets/images/yt/yt-posts-e61714cd-03-front-run.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-2811c27c-04-the-plan.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: buy-zone glow is partly yellow-green from gold bleed but reads green)"},
    {"path": "schedule-tweets/images/yt/yt-posts-54afc8ca-05-question.png", "verdict": "PASS", "defects": [], "fix": "none"}
  ],
  "summary": {"checked": 18, "passed": 16, "failed": 2},
  "must_fix": [
    "schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png",
    "schedule-tweets/images/x/x-tweets-b3ce2913-tokenized-stocks-run-through-arbitrum.png"
  ]
}
```

## Re-QA after regen (2026-10-20)

Both regenerated files were opened at full size. Glyph and logo regions were zoomed 2-3x. For the IG coins I also
built a cyan-channel mask (cyan minus red), so the glowing glyph shapes could be isolated from the bokeh. Corners
were swept at 3x brightness. All 18 batch md5s are still distinct, and neither regen duplicates another asset
(IG `0cfb75f0...`, X `995631c3...`).

| # | Asset | Verdict |
|---|---|---|
| 2 | `images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png` | **FAIL (defect persists)** |
| 8 | `images/x/x-tweets-b3ce2913-tokenized-stocks-run-through-arbitrum.png` | PASS |

### 2. ig-single-c420e132 (regen): FAIL
- **Same defect class as before.** All four large blurred foreground coins lying flat on the floor read as a
  **standard K** (stem on the LEFT, arms opening RIGHT):
  - bottom-left, about x 0-330, y 1230-1402
  - behind it, about x 130-400, y 1150-1250
  - bottom-centre, about x 450-760, y 1180-1290
  - bottom-right, about x 760-1122, y 1260-1402
- Perspective was considered. A flat coin is seen from its printed side, so viewing angle cannot mirror the glyph.
  Only a 180-degree in-plane spin could turn a correct mirrored K into this look. All four coins show the same
  upright standard K, so they were not spun: the model drew a standard K on all four.
- **Correct:** the hero face, the coin in its hand, and all six upright stack-face logos are mirrored K (stem RIGHT,
  chevron opening LEFT), matching `reference/kaspa-logo.png`.
- Advisory: K logos are again printed on the stacked-coin edges. Tiny pseudo-marks also sit on the centre robot
  arm's upper link (about x 520-560, y 180-205) and on its base (about x 410-430, y 320). Neither is legible at feed
  size. No watermark. The composition is otherwise as specced.
- **Fix:** do not regenerate a third time, because the prompt line did not hold. Fix it in place: these are
  defocused flat-coin textures, not a face. For each of the four glyph patches, mirror the glyph-bearing ellipse
  horizontally about its own centre, then feather the edge 6-10 px. Re-check with the cyan mask. Alternative: crop
  or scale the frame so the bottom foreground row is gone. That is weaker, because 4:5 leaves little to crop.

### 8. x-tweets-b3ce2913 (regen): PASS
- The temple pediment, frieze and architrave are now plain smooth stone, with no inscription and no pseudo-letters
  at 2x.
- The certificate tokens are now blank glowing rectangles with no ruled lines. That clears the prior advisory too.
- No text anywhere. Bridge, piers, quay, boats and city are all clean. The four corners are clean at 3x brightness:
  no watermark or signature.
- Logo: Arbitrum hexagon with a light-blue border, dark navy field and two white slashes, faithful to
  `reference/arbitrum-arb.png`. Advisory only: the two blue strokes converge into a caret/lambda shape, where the
  reference has two parallel strokes. The slashes are also contained inside the border, where the reference has
  them bleed past it. The mark is still clearly Arbitrum (same tolerance as the first pass).
- Advisory: the temple's left pediment runs off the left frame edge. This is a scenic bleed, with no content
  clipped.

```json
{"assets": [
  {"path": "schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png", "verdict": "FAIL", "defects": ["four blurred flat foreground coins (~x0-330 y1230-1402, ~x130-400 y1150-1250, ~x450-760 y1180-1290, ~x760-1122 y1260-1402) read as a standard K, not the Kaspa mirrored K", "advisory: K logos on stacked-coin edges; tiny pseudo-marks on the robot arm"], "fix": "in-place: mirror each glyph ellipse horizontally about its centre, feather, re-check with the cyan mask; do not regen again"},
  {"path": "schedule-tweets/images/x/x-tweets-b3ce2913-tokenized-stocks-run-through-arbitrum.png", "verdict": "PASS", "defects": [], "fix": "none (advisory: blue strokes merge into a caret)"}
 ],
 "summary": {"checked": 2, "passed": 1, "failed": 1},
 "must_fix": ["schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png"]}
```

## Re-QA 2 (regen 3 + retouch, 2026-10-20)

I opened `images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png` (1122x1402, md5 `6468a107...`)
at full size. I zoomed the hero glyph and the hand coin 2-4x, the stack logos 2x, and the conveyor 1x, 2x, 3x, and
6-7x with the contrast boosted. I also built a high-frequency (detail) map of the conveyor. All four corners were
swept at 3x brightness. Nothing was modified.

| # | Asset | Verdict |
|---|---|---|
| 2 | `images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png` | **FAIL (minor, retouch only)** |

### What is now fixed
- **Kaspa glyphs: all 7 are correct.** The hero face, the hand coin (about x725-830, y605-715) and all five
  stack-face logos are mirrored K (bar on the RIGHT, chevron opening LEFT), matching `reference/kaspa-logo.png`.
- **Hand-coin retouch is clean.** At 4x there is no seam, no ring at the edge of the mirrored ellipse and no ghost
  of the old stroke. The glow and the circuit texture are continuous.
- **The floor is clear.** There are no loose coins, so the prior defect class is gone.
- **Corners:** no watermark or signature in any corner at 3x brightness.
- **md5:** all 18 batch md5s are still distinct.

### Remaining defect (the conveyor retouch, about x510-1000, y420-515)
- The inpaint left soft, blurred patches on the disc tops. They are rectangular, grey or white, and smeared.
  - At 2-3x they are clearly visible.
  - At 1x (display size) they are barely visible and read as smudgy highlights.
- On several discs the patch **bleeds above the top rim** into the dark background. This breaks the clean ellipse
  outline as a light bump. Approximate locations:
  - Front-left disc: about x557-590, y466-476.
  - Second disc: about x657-690, y442-451.
  - Top-centre disc: about x733-770, y424-434.
  - Smear on the stack face below the 4th disc: about x790-830, y442-453.
  - Right column of discs: about x967-997, y446-454; x930-967, y471-479; x890-920, y504-512.
- Advisory: the tiny pseudo-mark on the centre robot arm's upper link (about x440-460, y240-250) is still there. It
  is an illegible 3-blob smudge and reads as nothing at feed size.
- Advisory carried over: the K logos sit on the sides of the coin stacks, which is physically odd. They are correctly
  mirrored.

### Fix
Redo only the conveyor inpaint, in place. Do not regenerate.
1. Clip each mask to the inside of its disc's top ellipse, inset 2 px from the rim, so no fill crosses the rim
   into the background.
2. Fill each top with a clean gradient cloned from an unmarked part of the same disc top, or with a smooth
   radial or linear fill sampled from it. Feather 2-3 px.
3. Restore the dark background where the patches currently poke above the rims.
4. Re-check at 1x and 3x. If Mike only judges at feed size, the current file can ship as-is: the defects show
   only at 2x and above.

```json
{"assets": [
  {"path": "schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png", "verdict": "FAIL", "defects": ["conveyor retouch ghosts: smeared grey/white inpaint patches on the disc tops, several bleeding above the rim into the background (~x557-590 y466-476, x657-690 y442-451, x733-770 y424-434, x790-830 y442-453, x967-997 y446-454, x930-967 y471-479, x890-920 y504-512); visible at 2x, barely at 1x", "advisory: illegible pseudo-mark on robot arm ~x440-460 y240-250; K logos on stack sides"], "fix": "re-inpaint conveyor disc tops only, masks clipped inside each top ellipse (2 px inset), fill from a clean sample of the same disc, feather 2-3 px, restore background above rims; Kaspa glyphs and hand-coin retouch are correct, leave them"}
 ],
 "summary": {"checked": 1, "passed": 0, "failed": 1},
 "must_fix": ["schedule-tweets/images/ig/ig-single-c420e132-invest-while-you-still-have-the-paycheck.png"]}
```

## Re-QA 2 follow-up: conveyor retouch redone (2026-10-20, main loop)
- The conveyor smudge FAIL was resolved by redoing the retouch from the raw regen-3 file: each disc-top mark was filled row by row, interpolating only between bright disc pixels on both sides, so nothing crosses the disc edge into the background. The approved hand-coin glyph fix was carried over unchanged.
- At 3x, the disc tops are plain and their outlines are intact. Glyph verdicts are unchanged: all 7 PASS.
- New md5: 60bf2e37d9c8c9df630348aa0db9ca00, still distinct from the other 17 batch images.
- **Verdict: PASS.** Lane 3 images: 18/18 PASS.
