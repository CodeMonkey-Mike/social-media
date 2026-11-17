# peach: Lane 3 visual QA

QA'd 2026-11-15 by the visual-qa agent. I opened every image at full size, zoomed in on the details (logos, small text, stat boxes, the hook badge) and measured the hook margins, the green hue and the V2 text edges with PIL. I checked each one against its prompt in `peach-lane3-plan.json` and the house-style rules in `repurpose/SKILL.md`: V4 hook and data slides, V2 code-rendered slides, no stray text, no watermark or badge, counters shown once, no em dashes. I changed no assets. The zoom crops are in the temp folder (`peachqa`), outside the repo.

**Summary: 19 checked, 15 PASS, 4 FAIL.**

## Must fix (most severe first)

1. `schedule-tweets/images/yt/yt-posts-b98367d5-01-hook.png`: the exemplar's shield badge is still in the image.
2. `schedule-tweets/images/yt/yt-posts-1f22cba6-05-question.png`: the stat-box text runs into the icon.
3. `schedule-tweets/images/yt/yt-posts-afb34efc-04-the-debate.png`: the stat-box text runs into the icon, and there is a bump in the "ISSUED" panel border.
4. `schedule-tweets/images/x/x-tweets-2816776b-dtcc-plumbing-on-chain.png`: made-up lettering is engraved on the wrench.

---

## Single images (X / IG)

| Asset | Verdict | Notes / defects | Fix |
|---|---|---|---|
| `x/x-tweets-34835f3f-kaspa-dollar-question.png` | **PASS** | Pixar-style Kaspa coin with the correct mirrored-K logo (vertical bar on the right, chevron pointing into it, same as `kaspa-logo.png`). It is in front of an open vault of green-cyan Kaspa coins. The small coins in the vault have the same mirrored K (checked zoomed in). It holds up a blank silver coin, with one eyebrow raised and a hand on its chin. The minting press throws sparks. No text, nothing cut off. Small note: only one eye shows next to the logo, which reads fine. | none |
| `ig/ig-single-34835f3f-kaspa-dollar-question.png` | **PASS** | 4:5 version of the same scene, 1122x1402. The logo is correct, the held coin is blank, the questioning pose and the vault are both there. No text, nothing cut off. | none |
| `x/x-tweets-e399e643-tao-wick-buy-zone.png` | **PASS** | White TAO coin. Zoomed in, the emblem matches `bittensor-tao.png`: the bar's left end curls down and the stem flicks right at the bottom. It is calm (eyes closed), brushing snow off its shoulder at the bottom of an icy ravine. A violet network of nodes overhead is untouched. No other marks, no text. | none |
| `x/x-tweets-4539c067-pengu-flips-pepe.png` | **PASS** | Ice-blue coin in a knitted scarf leaping from the low step to the high step. The larger green coin on top looks surprised. Both coin faces are blank, with no penguin, frog or mascot. Snow, night, dark navy. No text. | none |
| `x/x-tweets-acfc49f0-kaspa-pain-now-bright-future.png` | **PASS** | Tough Kaspa coin with the correct mirrored K and a set jaw, climbing a wet rock path in the rain. The storm is breaking into a gold sunrise over a valley of lit factories and cranes. Green-cyan rim light. No text. | none |
| `ig/ig-single-acfc49f0-kaspa-pain-now-bright-future.png` | **PASS** | 4:5 version, same composition, logo correct. No text, nothing cut off. | none |
| `x/x-tweets-2816776b-dtcc-plumbing-on-chain.png` | **FAIL** (minor) | The scene matches the prompt: old brass pipes and valve wheels, glowing blue conduits rising into a marble exchange, a cheerful robot plumber tightening the last coupling, no coins, logos or screens. **Defect:** zoomed in, the handle of the adjustable wrench has made-up engraved lettering (roughly "...CAP/BAY...", plus a smaller mark near the jaw). The prompt says "No text or words anywhere in the image", so this is stray text. It is readable at full size. The pediment frieze is only sculpted relief, with no letters (checked). | Edit in place, don't regenerate: smooth the engraved strip on the wrench handle (about x 720-830, y 720-860 in 1254 px) into plain brushed steel by cloning from the clean steel next to it. Look at it again afterwards. |
| `x/x-tweets-def74728-kaspa-tao-lead-the-run.png` | **PASS** | Kaspa coin (correct mirrored K, green-cyan glow) and the white TAO coin (correct tau emblem) run out of a dark canyon, grinning and kicking up dust. In the canyon behind them is a crowd of small grey coins with blank faces. No other marks, no text. Kaspa is half a step ahead (closer to the camera), as the prompt asks. | none |
| `ig/ig-single-def74728-kaspa-tao-lead-the-run.png` | **PASS** | 4:5 version: Kaspa is in front on the left, TAO is at its shoulder, the grey crowd is behind. Both logos are correct, no text, nothing cut off. | none |

## Carousel 1: `yt-post-2026-11-15-kaspa-dollar-why-not-usdt` (Version 4)

The slides are checked against `version4/hook.png` (slide 1) and `version4/slide.png` (slides 2-5). Layout across the set: slides 2-5 share a matching white data look (title + ornament divider, three stat boxes, centre panel, green insight box, page number in a circle at the top right). No @cryptodaily watermark was carried over.

| Asset | Verdict | Notes / defects | Fix |
|---|---|---|---|
| `yt/yt-posts-b98367d5-01-hook.png` | **FAIL** | The layout matches the V4 hook: the 3D Kaspa coin (correct mirrored K) bursts with green-cyan light, a round chart bubble is at the top right, and the bottom has two lines of bold all-caps text (white line 1, green line 2), with "SWIPE FOR MORE" below. There are no page dots, which is correct. The green measures hue 136 deg (RGB about 20,250,82): house green, not chartreuse. **Defect 1 (blocking): the exemplar shield badge was copied.** A white-and-green shield with a black figure sits in the gap of the divider line above the headline (about x 600-650, y 835-885). The prompt explicitly banned it ("no shield badge ... must NOT be reproduced"). It is the source account brand mark. **Defect 2 (minor):** "KASPA IS GETTING ITS OWN DOLLAR" spans x 77-1184, which leaves margins of 6.1 percent / 5.6 percent. The prompt asks for at least 8 percent (about 100 px). Nothing is cut off, but it misses the margin spec. **Note:** the bubble green line wobbles around the dashed line instead of running flat. It still reads as "stable", so I am not counting it as a defect. | Edit in place: fill the badge rectangle with black, then redraw the white divider line straight through the gap (match its y and thickness, close the gap so it is one continuous rule, or leave a plain gap with no mark). Do not regenerate for the margin alone. If the slide is regenerated for another reason, keep the 8 percent margin instruction and the no-badge instruction. |
| `yt/yt-posts-53b2c0d3-02-how-it-works.png` | **PASS** | Title "How Kaspa Dollar works" with the accent word in green. The stat boxes read COLLATERAL: KAS ONLY / PRICE FEED: THE MINERS / ADMIN KEY: NONE, word for word. The flow LOCK KAS -> VAULT -> MINT KSD has no extra labels. THE IDEA box has both bullets word for word. "2" appears once. No em dashes, no coins or logos, no watermark. Small note: the first bullet ends about 20 px from the edge of the insight box, which is tight but not cut off. | none |
| `yt/yt-posts-5eb21d2e-03-where-it-stands.png` | **PASS** | "Where it stands". The stat boxes read WHITEPAPER: NOV 2026 / TESTNET: MAY 2027 / MAINNET TARGET: SEPT 2027. The timeline has three markers (the first filled green, the other two hollow) and no labels. The STILL A DRAFT box has both bullets word for word. "3" appears once. Clean. | none |
| `yt/yt-posts-afb34efc-04-the-debate.png` | **FAIL** (minor) | The text is correct and word for word: title "Why not just USDT and USDC?", the three stat boxes, the ISSUED / MINTED columns, and both MY QUESTION bullets. "4" appears once and there are no em dashes. **Defect 1:** in box 1, "USDT AND USDC:" was squeezed narrow and its colon touches the bank icon circle (about 2 px gap). In the other two boxes the text and the icon have clear space between them. **Defect 2:** the top border of the "ISSUED" panel has a small lump (about x 360-400, y 605-612). | Regenerate this slide with the same exemplar, with the label shortened to fit, e.g. stat box 1 "USDT, USDC: AN ISSUER", or add "leave clear space between each label and its icon". Or code-render it with `kaspa-lane3-fix/render_v4_slide.py` to get exact spacing, provided it still matches slides 2, 3 and 5 when viewed together. |
| `yt/yt-posts-1f22cba6-05-question.png` | **FAIL** (minor) | The text is correct and word for word: title, A / B / C stat boxes, the A / B / C panels, "TELL ME IN THE COMMENTS" + "What am I missing?". "5" appears once and there are no em dashes. **Defect:** in box A, "A: A KAS-BACKED" was squeezed narrow and the last letter, D, runs into the coin-stack icon circle (no gap). In box B, the T of USDT almost touches the bank icon. These are the same squeezed-into-the-icon problem as slide 4. Small note: the coin-stack icon is a generic money icon, not a crypto coin, so it is acceptable. | Regenerate with the same exemplar and a shorter label in box A (e.g. "A: KAS-BACKED" over "DOLLAR"), plus "clear space between label and icon". Or code-render it, as for slide 4. |

## Carousel 2: `yt-post-2026-11-15-midterms-or-the-ipo-both` (Version 2, code-rendered)

V2 is rendered by code: Anton title + Inter body on near-black, a teal counter top-left, a teal accent line and a dark rounded box. No exemplar is needed. For every slide I checked the text word for word against the plan `spec`. Each counter appears once and matches its slide. There are no em dashes. Measured content bounds for all five are x 64 to at most 1197 and y 62-1175 (at least 57 px from every edge), so nothing is cut off. The teal is the house V2 teal, not green.

| Asset | Verdict | Notes |
|---|---|---|
| `yt/yt-posts-ddc5f0c6-01-hook.png` | **PASS** | "1 OF 5", "Midterms or / the IPO?", accent and THE SETUP box (2 lines) match the spec. |
| `yt/yt-posts-abe91550-02-the-week.png` | **PASS** | "2 OF 5", "The week / of Nov 9", the figures 74.8K / 65.3K / 62K / 68K match the spec and the fact-check ledger. |
| `yt/yt-posts-0eb231d8-03-the-ipo.png` | **PASS** | "3 OF 5", the 3-line title fits (right edge 1193), "825 million shares at 70 to 78 dollars, slated for Nov 19" as in the spec, THE PRECEDENT box matches the spec. |
| `yt/yt-posts-3116882e-04-the-economy.png` | **PASS** | "4 OF 5", "ISM PMI at 55.5: ten straight months of expansion", WHAT WE NEED has 3 lines, word for word. |
| `yt/yt-posts-e17f0ac5-05-question.png` | **PASS** | "5 OF 5", "Midterms, / the IPO, / or both?", accent ending "near 57.7K?" as in the spec, TELL ME IN THE COMMENTS box matches the spec. |

---

```json
{
 "assets": [
  {
   "path": "schedule-tweets/images/x/x-tweets-34835f3f-kaspa-dollar-question.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/ig/ig-single-34835f3f-kaspa-dollar-question.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/x/x-tweets-e399e643-tao-wick-buy-zone.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/x/x-tweets-4539c067-pengu-flips-pepe.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/x/x-tweets-acfc49f0-kaspa-pain-now-bright-future.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/ig/ig-single-acfc49f0-kaspa-pain-now-bright-future.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/x/x-tweets-2816776b-dtcc-plumbing-on-chain.png",
   "verdict": "FAIL",
   "defects": [
    "made-up engraved lettering on the wrench handle (prompt: no text anywhere)"
   ],
   "fix": "edit in place: clone plain brushed steel over the engraving (about x720-830, y720-860)"
  },
  {
   "path": "schedule-tweets/images/x/x-tweets-def74728-kaspa-tao-lead-the-run.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/ig/ig-single-def74728-kaspa-tao-lead-the-run.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-b98367d5-01-hook.png",
   "verdict": "FAIL",
   "defects": [
    "exemplar shield badge copied into the divider gap above the headline (explicitly banned)",
    "headline line 1 margins 6.1%/5.6%, prompt asks for 8% or more"
   ],
   "fix": "fill the badge with black in place and redraw the divider line; no regeneration needed"
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-53b2c0d3-02-how-it-works.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-5eb21d2e-03-where-it-stands.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-afb34efc-04-the-debate.png",
   "verdict": "FAIL",
   "defects": [
    "stat box 1 'USDT AND USDC:' squeezed narrow, colon touches the icon circle",
    "small lump in the top border of the ISSUED panel"
   ],
   "fix": "regenerate on version4/slide.png with a shorter label and clear space before the icon, or code-render with render_v4_slide.py"
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-1f22cba6-05-question.png",
   "verdict": "FAIL",
   "defects": [
    "stat box A 'A: A KAS-BACKED' squeezed narrow, 'D' runs into the icon circle; box B 'USDT' almost touches its icon"
   ],
   "fix": "regenerate on version4/slide.png with a shorter label A and clear space before the icon, or code-render"
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-ddc5f0c6-01-hook.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-abe91550-02-the-week.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-0eb231d8-03-the-ipo.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-3116882e-04-the-economy.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  },
  {
   "path": "schedule-tweets/images/yt/yt-posts-e17f0ac5-05-question.png",
   "verdict": "PASS",
   "defects": [],
   "fix": ""
  }
 ],
 "summary": {
  "checked": 19,
  "passed": 15,
  "failed": 4
 },
 "must_fix": [
  "schedule-tweets/images/yt/yt-posts-b98367d5-01-hook.png",
  "schedule-tweets/images/yt/yt-posts-1f22cba6-05-question.png",
  "schedule-tweets/images/yt/yt-posts-afb34efc-04-the-debate.png",
  "schedule-tweets/images/x/x-tweets-2816776b-dtcc-plumbing-on-chain.png"
 ]
}
```
