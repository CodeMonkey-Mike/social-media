# Visual QA: batch `evaa-reveal`, Lane 3 images

QA date: 2026-11-22 · 18 assets checked · checked against `repurpose/output/evaa-reveal-lane3-plan.json` (`images[]` prompts and specs), the `repurpose/SKILL.md` image + carousel sections, `persona/persona.json` `image_generation`, and the exemplars `images/reference/carousels/version4/hook.png` + `slide.png` and `images/reference/kaspa-logo.png`.

**Method:** I opened every file at full size. I zoomed into every coin face, logo, Kaspa glyph and small detail, and swept all four corners at 3x brightness for signatures or watermarks. The 4 light V4 slides got a contrast-stretched sweep (200 to 250 luma) for faint `@handle` watermarks. On the code-rendered slides I measured text extents and checked that no title glyphs touch across lines. I also checked dimensions (X and YT = 1254x1254, IG = 1122x1402, 4:5) and MD5 hashes: all 18 files are unique, and none is reused.

**Scope note:** this batch has **no Version 1 carousel**. Post 1 is V4 and post 2 is code-rendered V2, so the chartreuse-drift check on V1 does not apply. The V4 hook green measures hue 140.5 (RGB 27,238,99). That is the V4 exemplar's emerald green, not chartreuse. The V2 teal is consistent across all 5 slides.

## Result

| # | Asset | Verdict |
|---|---|---|
| 1 | x/x-tweets-bb6e271e-evaa-profits-before-the-drop.png | PASS (advisory) |
| 2 | x/x-tweets-50a5a803-everybody-gets-hacked.png | PASS |
| 3 | x/x-tweets-7f7c4852-jobless-claims-ai-jobs.png | **FAIL** (low: Mike's call) |
| 4 | x/x-tweets-f34d742c-kaspa-tier-one-listings.png | PASS |
| 5 | ig/ig-single-f34d742c-kaspa-tier-one-listings.png | PASS |
| 6 | x/x-tweets-1304b219-kaspa-top-100-without-them.png | PASS (advisory) |
| 7 | ig/ig-single-1304b219-kaspa-top-100-without-them.png | PASS |
| 8 | x/x-tweets-b6f7f45b-gram-telegram-top-three.png | PASS (advisory) |
| 9 | yt/yt-posts-35d0766a-01-hook.png (V4 hook) | **FAIL** |
| 10 | yt/yt-posts-56ed9eaa-02-where-it-trades.png (V4) | PASS (advisory) |
| 11 | yt/yt-posts-cb8362c4-03-why-they-waited.png (V4) | PASS |
| 12 | yt/yt-posts-8b8a155e-04-when-they-list.png (V4) | PASS (advisory) |
| 13 | yt/yt-posts-9b0b0c26-05-question.png (V4) | PASS (advisory) |
| 14 | yt/yt-posts-8b23ac46-01-hook.png (V2 code) | PASS |
| 15 | yt/yt-posts-abfe3729-02-the-run.png (V2 code) | PASS |
| 16 | yt/yt-posts-9e03c41e-03-the-drop.png (V2 code) | PASS |
| 17 | yt/yt-posts-42e09d06-04-the-precedent.png (V2 code) | PASS |
| 18 | yt/yt-posts-26edbea5-05-question.png (V2 code) | PASS |

**18 checked · 16 passed · 2 failed.** "Advisory" means it is clean enough to ship, but there is a small deviation from the prompt that Mike may want to know about.

## Per-asset findings

### 1. x-tweets-bb6e271e-evaa-profits-before-the-drop.png: PASS (advisory)
- Matches: Pixar 3D, deep navy night, green-eyed man in a black hoodie with a calm half smile, a burlap sack of gold coins buckled into the seat with his arm resting on it, his other hand loose on the bar, warm coin glow and a cool rim. Coin faces zoomed 3x: all plain, with no glyphs. No text, and all 4 corners are clean.
- Advisory: the "at the crest, track plunging into the dark just ahead" beat does not read. The lit track keeps **rising above and behind him** (upper left), so the car looks mid-climb, and the track under the car just recedes toward the camera, not a plunge. The tweet's "profits before the drop" idea comes across only as "calm rider with secured coins". That is still on message, so I am not failing it.
- Fix (optional): leave it. If Mike wants the drop visible, regen in a fresh chat with "the car is stopped at the very top; directly in front of it the track bends sharply down out of frame into darkness; nothing of the track rises above the car".

### 2. x-tweets-50a5a803-everybody-gets-hacked.png: PASS
- Matches: hotel room at night, green-eyed man in a black hoodie looking back in surprise, a blue hex shield dome over the desk, laptop and router (the router has a single blue light). A floating window glows red, and a gloved hand reaches out of it holding a leather wallet with gold coins spilling out. The laptop screen and the window show only abstract shapes (the window has three browser-chrome dots, no letters). Coins zoomed: plain. No text, and the corners are clean.

### 3. x-tweets-7f7c4852-jobless-claims-ai-jobs.png: FAIL (low severity, Mike can waive)
- The scene matches: a robot working calmly behind glass with sparks at its fingertips, a long line of Pixar office workers with boxes and briefcases outside a plain glass door, a sunrise with cranes and steel frames. Signs, boxes and buildings are blank, and the corners are clean.
- **Defect: an element the prompt did not ask for, and it is off message.** The worker at the **front of the line is Mike's avatar** (zoomed: green eyes, dark swept hair, beard, black hoodie) carrying a cardboard box with a plant. The prompt asked for generic "office workers". The generator injected the persona character, so Mike appears in his own post as one of the people AI put out of work. His tweet frames AI job loss as *his read*, from the AI-engineer side.
- Fix: regen in a **fresh chat**, adding "every worker is a generic office worker in business clothes; no man in a black hoodie, no green eyes, no beard on the front figure". Or Mike keeps it if he likes the self-insert.

### 4. x-tweets-f34d742c-kaspa-tier-one-listings.png: PASS
- Kaspa glyph zoomed: correct mirrored K (vertical bar on the right, chevron vertex touching it, matching `kaspa-logo.png`), teal glow, arms folded, unbothered half-lidded look. Binance door: official 5-diamond mark, correct. Coinbase door: white C on a blue circle, correct. Warm light under the Binance door is present. The crowd coins are plain (bronze, silver, gold, no marks), with fists raised. No text besides the two logos, and the corners are clean.

### 5. ig-single-f34d742c-kaspa-tier-one-listings.png: PASS
- 1122x1402 (4:5). Same scene as the X version, re-composed. Logos zoomed: both official and correct. The Kaspa glyph is the correct mirrored K. The top of the bar tucks under the eye sockets, but the glyph still reads clearly. Crowd coins are plain silver. Light under the Binance door is present. Corners are clean.

### 6. x-tweets-1304b219-kaspa-top-100-without-them.png: PASS (advisory)
- Kaspa glyph zoomed: correct mirrored K, teal, with a hungry determined grin, climbing on foot with nothing on its back, under a moonlit sea of clouds. The Binance (official mark) and Coinbase (white C on blue) jetpacks sit unused and dark on a rack.
- Advisory: (a) the jetpacks sit at a base camp **beside** the climber, not "far below", which slightly weakens the "got this high on foot" read. (b) The yellow Binance jetpack has two tiny illegible pseudo-text decals (about 10 px tall: a top-cap label and a side-strap label). They are invisible at feed size, but technically stray marks.
- Fix: none needed. If it were a regen, add "no labels or decals on the jetpacks other than the logo".

### 7. ig-single-1304b219-kaspa-top-100-without-them.png: PASS
- 1122x1402. Kaspa glyph zoomed: correct mirrored K. The Binance mark is on a dark panel between yellow tanks, and the Coinbase C is on a blue square panel (app-icon style, acceptable). The rack sits lower and farther back than in the X version, which reads better. No stray text, and the corners are clean.

### 8. x-tweets-b6f7f45b-gram-telegram-top-three.png: PASS (advisory)
- The TON mark (white rounded downward triangle with a centre line on sky blue) matches `toncoin-ton.png`. The white Telegram paper plane glides overhead with a light trail. A giant phone with a round vault door swung open and warm gold light inside. Tiny plain coin characters queue at two glowing counters, handing gold coins across (zoomed: faint emboss texture only, no symbol). The phone shows no UI, and the corners are clean.
- Advisory: (a) the expression is off. The prompt asks for a "proud triumphant smile", but the coin has a **furrowed scowl and no mouth**, which reads as annoyed on a bullish fire-emoji one-liner. (b) A small render glitch: at the left counter, a thin rod passes through the coin being handed over (about 80 px region, mid-frame).
- Fix: optional regen in a fresh chat with "a big open-mouthed proud grin, raised eyebrows". Ship as is if Mike is fine with the "tough" look.

### 9. yt-posts-35d0766a-01-hook.png (V4 hook): **FAIL**
- Matches: the full-bleed Kaspa coin is faithful to `kaspa-logo.png` (mirrored K, teal burst) in the upper two thirds. A top-right white-ring bubble holds a flat green line along a dashed line with no numbers. Line 1 "NO BINANCE SPOT. NO COINBASE." is white and line 2 "KASPA IS STILL TOP 100" is green, both spelled exactly. "SWIPE FOR MORE" is at the bottom. **No pagination dots** (0 bright px below the CTA), no @handle, no em dash, corners clean.
- **Defect 1 (the FAIL): the exemplar's SHIELD BADGE is reproduced.** A white and green shield logo with a keyhole and a tiny registered-mark circle sits in the gap of the divider line at about **x 604-652, y 842-905**. The prompt explicitly says "no shield badge" and that the exemplar badge "must NOT be reproduced". It is a third-party brand mark from the reference account.
- Defect 2 (minor): both text lines run from **x 72 to 1183** (5.7% left margin, 5.7% right). The prompt asked for at least 8% (100 px). The text is not clipped, but it is tighter than specified.
- Fix: **fix it in place, no regen** (the same principle as the skill's page-dot rule). Inpaint or clone the badge box (about x 598-660, y 838-910) from the surrounding dark particle texture (`cv2.inpaint`, TELEA, radius about 7), then redraw the white divider straight across the gap at **y 879-881** so the two half-lines join. Re-open it after the fix and check that no teal-particle seam shows above the line. The margin is acceptable to keep; it matches the exemplar's own edge spacing.

### 10. yt-posts-56ed9eaa-02-where-it-trades.png (V4 data): PASS (advisory)
- Layout matches `version4/slide.png`: white page, bold dark title, a flourish divider, 3 outlined coloured stat boxes, a centre panel, and a green insight box. Text is exact: title "Where Kaspa trades right now", "BINANCE SPOT: NO", "COINBASE SPOT: NO", "MARKET CAP RANK: TOP 100", six tiles KRAKEN, BYBIT, GATE, MEXC, KUCOIN, HTX, and "THE GAP" with both bullets word for word. Page "2" appears exactly once, top right. Contrast sweep: **no @cryptodaily watermark**, no faint text. No logos, no em dash, no added figures.
- Advisory: (a) the page circle sits tight against the end of the title (the title runs to x 1130, the circle starts at about 1150). (b) The colour logic: "COINBASE SPOT: **NO**" is in the exemplar's green box, so a negative reads in the "good" colour. That comes from copying the red, green and orange box order. Cosmetic only.

### 11. yt-posts-cb8362c4-03-why-they-waited.png (V4 data): PASS
- Text is exact: "Why the tier ones waited", "PREMINE: NONE", "PRESALE: NONE", "INSIDER ALLOCATION: NONE", an empty open vault (no numbers or labels), "THE RECEIPT" and both bullets. Page "3" once. No watermark in the sweep, no em dash. The receipt icon's lines are an icon, not text.

### 12. yt-posts-8b8a155e-04-when-they-list.png (V4 data): PASS (advisory)
- Text is exact: "When do they list?", "I SAID IT IN: 2025", "LATE 2026: STILL NO LISTING", "A VIEWER SAYS: 2027". The timeline has three markers (two filled green, one hollow) with no labels. "MY READ" and both bullets. Page "4" once. No watermark, no em dash.
- Advisory: "STILL NO LISTING" is rendered in a **horizontally squashed condensed face** to fit the box. It is visibly a different font width from the other two values. Cosmetic.

### 13. yt-posts-9b0b0c26-05-question.png (V4 data): PASS (advisory)
- Text is exact: "Who lists Kaspa first?", "A: BINANCE SPOT", "B: COINBASE", "C: NEITHER BEFORE 2028", three panels headed A, B, C, and "TELL ME IN THE COMMENTS" with "Pick one and give me the year." Page "5" once. No watermark, no em dash.
- Advisory: (a) the three A, B, C panels are empty as the prompt specified, so about 40% of the slide is blank white boxes, which makes for a thin composition. (b) "A: BINANCE SPOT" nearly touches its box walls (about 15 px padding). Not clipped.

### 14-18. V2 code-rendered slides (8b23ac46, abfe3729, 9e03c41e, 42e09d06, 26edbea5): PASS
- Each matches its `spec` word for word, as rendered: label, title (with its forced line breaks), accent, box_label, and box lines. Counters "1 OF 5" through "5 OF 5" each appear **exactly once**, top left, in teal. Anton title, Inter body, near-black page, teal accent, dark rounded box, consistent with the V2 template.
- Measured: all text sits between x 64 and x 1195 (5 to 5.1% margins, inside the frame and level with the box edges). No glyph from one title line touches the next (connected-component check: no component spans two lines, including "dropped" over "than", "Nobody" over "how far", and "you" over "with a"). Accent lines are at most 2 lines (slide 4 wraps to 2, allowed). No em dashes, and every figure ("13x", "51 cents", "$6.60", "Oct 27 to Nov 21", "$4 million", "20%", "50%", "353x", "$1 billion", "$7 billion", "20x") matches the plan exactly.

## Output (as specified)

```json
{
  "assets": [
    {"path": "schedule-tweets/images/x/x-tweets-bb6e271e-evaa-profits-before-the-drop.png", "verdict": "PASS",
     "defects": ["advisory: crest-with-plunge-ahead does not read; the lit track rises above and behind the rider, so he looks mid-climb"],
     "fix": "none required; optional fresh-chat regen with the car stopped at the very top and the track bending sharply down out of frame"},
    {"path": "schedule-tweets/images/x/x-tweets-50a5a803-everybody-gets-hacked.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/x/x-tweets-7f7c4852-jobless-claims-ai-jobs.png", "verdict": "FAIL",
     "defects": ["unrequested element: the front worker in the laid-off line is Mike's avatar (green eyes, beard, black hoodie) holding a box; the prompt asked for generic office workers, and it shows Mike as an AI job-loss victim"],
     "fix": "fresh-chat regen: every worker is a generic office worker in business clothes; no man in a black hoodie, no green eyes, no beard on the front figure. Or Mike waives"},
    {"path": "schedule-tweets/images/x/x-tweets-f34d742c-kaspa-tier-one-listings.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/ig/ig-single-f34d742c-kaspa-tier-one-listings.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/x/x-tweets-1304b219-kaspa-top-100-without-them.png", "verdict": "PASS",
     "defects": ["advisory: jetpacks are beside the climber, not far below", "advisory: two tiny illegible pseudo-text decals on the yellow jetpack (about 10 px, invisible at feed size)"],
     "fix": "none required"},
    {"path": "schedule-tweets/images/ig/ig-single-1304b219-kaspa-top-100-without-them.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/x/x-tweets-b6f7f45b-gram-telegram-top-three.png", "verdict": "PASS",
     "defects": ["advisory: the TON coin scowls with no mouth; the prompt asked for a proud triumphant smile", "advisory: a small rod artifact passes through the coin at the left counter"],
     "fix": "none required; optional fresh-chat regen with a big open-mouthed proud grin"},
    {"path": "schedule-tweets/images/yt/yt-posts-35d0766a-01-hook.png", "verdict": "FAIL",
     "defects": ["the exemplar's shield badge (white and green keyhole shield plus a tiny registered-mark circle) is reproduced in the divider gap at about x 604-652, y 842-905; the prompt explicitly banned it", "minor: text margins 72 px (5.7%), the prompt asked for at least 8%; not clipped"],
     "fix": "in-place fix, no regen: inpaint the badge box (about x 598-660, y 838-910) from the surrounding dark texture and redraw the white divider across the gap at y 879-881; re-open and check for a seam"},
    {"path": "schedule-tweets/images/yt/yt-posts-56ed9eaa-02-where-it-trades.png", "verdict": "PASS",
     "defects": ["advisory: page circle tight against the end of the title", "advisory: Coinbase NO shown in the green (positive) box colour"], "fix": "none required"},
    {"path": "schedule-tweets/images/yt/yt-posts-cb8362c4-03-why-they-waited.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/yt/yt-posts-8b8a155e-04-when-they-list.png", "verdict": "PASS",
     "defects": ["advisory: STILL NO LISTING rendered in a squashed condensed face, inconsistent with the other values"], "fix": "none required"},
    {"path": "schedule-tweets/images/yt/yt-posts-9b0b0c26-05-question.png", "verdict": "PASS",
     "defects": ["advisory: the empty A, B, C panels leave about 40% of the slide blank (as specified)", "advisory: A: BINANCE SPOT about 15 px from its box walls"], "fix": "none required"},
    {"path": "schedule-tweets/images/yt/yt-posts-8b23ac46-01-hook.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/yt/yt-posts-abfe3729-02-the-run.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/yt/yt-posts-9e03c41e-03-the-drop.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/yt/yt-posts-42e09d06-04-the-precedent.png", "verdict": "PASS", "defects": [], "fix": ""},
    {"path": "schedule-tweets/images/yt/yt-posts-26edbea5-05-question.png", "verdict": "PASS", "defects": [], "fix": ""}
  ],
  "summary": {"checked": 18, "passed": 16, "failed": 2},
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-35d0766a-01-hook.png",
    "schedule-tweets/images/x/x-tweets-7f7c4852-jobless-claims-ai-jobs.png"
  ]
}
```

Report only: no image, plan or queue file was changed by this QA pass.
