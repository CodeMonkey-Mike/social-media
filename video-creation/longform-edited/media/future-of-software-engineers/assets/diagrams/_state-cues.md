# future-of-software-engineers · assets/diagrams · STATE CUES (C1, C2)

Two Type 2 SYSTEM-DESIGN charts: **C1 "the pirate funnel" map** (DATA.md pillar 3 + T9, CHART-SOURCE INDEX C1) and **C2 "the
pod, then and now"** (pillar 2 + T6/T7, index C2). Sources `C1.html`, `C2.html` (every state is its own `.frame#<id>-<state>`
built from ONE layout table); stills shot by `../charts/_build_charts.py C1 C2` (Playwright, fonts awaited, em/en dash refused).
Element boxes per state: `C1.geometry.json`, `C2.geometry.json` (`elements.<state>.<data-k>`, stage px).

Cue times are FINAL-spine seconds (`spine/ALL.e.enhanced.medium-words.json`), checked word by word on 2026-11-14; every one
matches the COVER-PLAN row. The quoted word is the word the cue lands on.

**Pixel contract (verified by diff, `_previews/chart-build/C1-contract.json`, `C2-contract.json`):** header, divider, orbs,
grain, source line, every slice, bracket, node, seat and label sit at the same pixels in every state of its chart; a swap
changes only an element's level (hidden / ghost / rest / dim / lit / bright). The only off-element differences are a few
anti-alias pixels on the number badges (max 7 to 19 of 255, invisible). So a swap is a spotlight move, never a redraw, and a
MELT / SPIN marquee between two states transforms cleanly.

**Colour:** the LIT colour is `--accent-green` #00e68a (stylesheet default: COVER-PLAN has no `chapter_themes`; role colours
NOT taken at GATE 3). The four C1 roles share it and are told apart by PLACE: growth = the tier-1 bracket above, product =
the tier-2 bracket, platform = the floor, GTM = the side lane; each carries the role card's number (1 to 4, as D7, D9, D11,
D12). Red appears once, on the SCRAPPED tag (the stylesheet's negative role). Dimmed = opacity .30.

## Three reveal moves (the comp implements them; all are spotlights over the shared pixels)

1. **Cross-fade** `A -> B`: 0.3 s (0.4 s where noted). The default.
2. **Stepped mask** `B over A`: B is drawn on top of A inside a mask rect that GROWS in steps; each step's newly exposed strip
   fades in over 0.15 s (soft edge, never a hard cut). L->R masks span the full frame height from x = 0 to the edge; T->B masks
   span the stated x range from y = 0 to the edge. After the last step B is fully shown and becomes the base for the next cue.
   Every edge below sits in a measured gap between elements (checked against the pixel diff).
3. **Region box** `B over A`: B shown only inside one box (stage px, padded 4), fading in 0.25 s. Used for the C2 seats.

---

## C1 · the pirate funnel map (24 PNGs, 1920x1080)

Layout, stage px: six slices left to right, AWARENESS to REVENUE, x 120-1386 (slice i spans `120 + 212 i` to `+206`, centres
223, 435, 647, 859, 1071, 1283), the funnel tapering 340 -> 130 px tall around y 615. GROWTH bracket y 418 over slices 0-2,
PRODUCT bracket y 452 over slices 2-3 (they overlap on ACTIVATION), PLATFORM floor x 120-1386 y 850-912 with an arrow up
into every slice, GTM lane x 1440-1800 y 376-680 linked into REVENUE at y 630. Role labels on one row (y 206), OWNS lines
on the next (y 252); platform's sit inside the floor.

### FUNNEL · cover 194.41-209.72 (15.3 s)

| t | word | move | PNG |
|---|---|---|---|
| 194.41 | "To (see them)" | entry (the plan's entrance; the ghost funnel IS the "outline", it reads as drawn by the entrance at "one map" 195.52) | `C1-funnel-outline` |
| 196.46 | "the (pirate funnel)" | cross-fade: eyebrow ONE MAP + headline The pirate funnel + divider | `C1-funnel-title` |
| 197.40 / 198.14 / 198.34 / 198.66 / 198.92 / 199.18 | "A" "A" "A" "R" "R" "R" | L->R mask of `C1-funnel-letters` over `C1-funnel-title`, edges x 329 / 541 / 753 / 965 / 1177 / 1920 (one letter per spelled letter) | `C1-funnel-letters` |
| 199.86 / 200.32 / 201.12 / 201.76 / 202.34 / 202.90 | awareness, acquisition, activation, retention, referral, revenue | L->R mask of `C1-funnel-names` over `C1-funnel-letters`, same edges 329 / 541 / 753 / 965 / 1177 / 1920 (each slice firms up and its name lights) | `C1-funnel-names` |
| 204.00 | "Dave (McClure's)" | cross-fade: source line `after Dave McClure, Startup Metrics for Pirates (AARRR)` (no year: guard) | `C1-funnel` |
| 206.76 -> 209.25 | "customer" ... "steps" | **the customer dot (comp-drawn):** circle r 9 fill #e8eaf0 + halo r 20 rgba(0,230,138,.35), fades in at x 96, y 668, then glides through the slice centres x 223 (207.00), 435 (207.45), 647 (207.90), 859 (208.35), 1071 (208.80), 1283 (209.25), ease in-out per hop, holds in REVENUE to 209.72. Optional travelling spotlight: reveal `C1-funnel-glow` only inside the column of the slice the dot is in (same slice edges), opacity .6 | `C1-funnel` (+ dot) |

### GROWTH · cover 235.48-250.508 (15.0 s; ends on the FACE 4 cut-in)

| t | word | move | PNG |
|---|---|---|---|
| 235.48 | "They (know)" | entry (C1 returns after D7 + D8) | `C1-funnel` |
| 236.02 -> 237.20 | "all (six steps)" | all six stages glow ONCE: cross-fade up 0.25 s, hold to 236.80, back down 0.4 s | `C1-funnel-glow` then `C1-funnel` |
| 237.80 | "and (they work in one or more)" | cross-fade: tier-1 bracket over AWARENESS-ACTIVATION + `1 GROWTH ENGINEER` | `C1-growth-bracket` |
| 239.60 / 240.52 / 241.18 / 241.80 / 242.80 | landing, sign(-ups), onboarding, activation, retention | L->R mask of `C1-growth-tags` over `C1-growth-bracket`, edges x 302 / 422 / 586 / 760 / 1920: the four work chips one by one, then the LIGHT tick on RETENTION (RETENTION stays the product engineer's brightest stage, GATE 3 ruling 4) | `C1-growth-tags` |
| 243.76 / 245.80 / 246.42 | "Every (idea)", scrapped, scaled | L->R mask of `C1-growth-test` over `C1-growth-tags`, edges x 395 / 535 / 1920: EVERY IDEA IS AN EXPERIMENT, then SCRAPPED (red, struck), then SCALED | `C1-growth-test` |
| 248.60 / 249.90 | sign(-ups) / revenue | L->R mask of `C1-growth` over `C1-growth-test`, edges x 760 / 1920: `OWNS SIGNUPS, SUBSCRIPTIONS, REVENUE` (PostHog's targets), then the light ticks on REFERRAL + REVENUE | `C1-growth` |

### PRODUCT · cover 262.89-275.03 (12.1 s)

| t | word | move | PNG |
|---|---|---|---|
| 262.89 | (cover edge; "There's" 263.00) | entry: growth steps back to its bracket + label at .30; tier-2 bracket over ACTIVATION + RETENTION + `2 PRODUCT ENGINEER` lit (the plan's "draws on 263.00" is the entrance) | `C1-product-bracket` |
| 263.84 | "overlap" | cross-fade: OVERLAP tag inside ACTIVATION (the two brackets meet there) | `C1-product-overlap` |
| 269.38 | "customer" | cross-fade: THE CUSTOMER tag | `C1-product-customer` |
| 272.02 | "retention" | cross-fade 0.35 s: RETENTION lights brightest (green fill, glow, green R) | `C1-product-retention` |
| 272.98 | "getting" | cross-fade: THE CUSTOMER KEEPS USING THE PRODUCT | `C1-product` |

### PLATFORM · cover 304.14-317.975 (13.8 s; ends on the FACE 6 cut-in)

| t | word | move | PNG |
|---|---|---|---|
| 304.14 | (cover edge; "Their" 304.28) | entry: growth + product dimmed; the floor under the whole funnel + `3 PLATFORM ENGINEER` lit | `C1-platform-floor` |
| 306.46 / 307.78 | application / data | L->R mask of `C1-platform-customers` over `C1-platform-floor`, edges x 633 / 1920: INTERNAL CUSTOMERS: APPLICATION DEVELOPERS, then DATA SCIENTISTS (CNCF's users) | `C1-platform-customers` |
| 310.02 -> 310.52 | "serve" | **bottom-to-top wipe**: `C1-platform-arrows` over `C1-platform-customers` in a full-width mask whose top edge rises y 852 -> 690 (ease out): the six arrows rise from the floor into every stage | `C1-platform-arrows` |
| 312.98 | "product (manager)" | cross-fade: ITS OWN PRODUCT MANAGER | `C1-platform-pm` |
| 316.34 / 316.50 / 317.48 | speed, reliability, cost | L->R mask of `C1-platform` over `C1-platform-pm`, edges x 1156 / 1300 / 1920: `OWNS SPEED, RELIABILITY, COST` word by word | `C1-platform` |

### GTM · cover 339.35-350.481 (11.1 s; ends on the FACE 7 cut-in)

| t | word | move | PNG |
|---|---|---|---|
| 339.35 | (cover edge; "There's" 339.58) | entry: growth, product, platform dimmed (the growth bracket stays visible, dimmed, so the split reads); `4 GTM ENGINEER`, the side lane and its link into REVENUE lit; the three nodes ghosted | `C1-gtm-lane` |
| 343.40 / 344.64 / 348.08 / 349.52 | CRM / sales (team's) / outbound / sales (pipeline) | **T->B mask** of `C1-gtm` over `C1-gtm-lane`, x 1440-1800, edges y 460 / 516 / 592 / 1080: CRM, its line `the sales team's customer database, e.g. Salesforce`, OUTBOUND, PIPELINE | `C1-gtm` |

No on-screen text quotes the unclear 340.66 words.

### ALL · cover 353.481-368.28 (14.8 s; the finished map, shown ONCE; the marquee)

| t | word | move | PNG |
|---|---|---|---|
| 353.481 | (cover edge; "So look at the whole map" 353.66) | entry: funnel, both brackets, floor + arrows, lane + nodes all lit. If the transition-strategist reserves a MELT / SPIN here, `C1-all-base` is the post-transform look | `C1-all-base` |
| 355.02 / 355.32 / 355.62 / 355.92 | "Four" ... "engineers" | **label pulses 1, 2, 3, 4** (comp spotlight ring, drawn on top): rounded rect r 22, 2.5 px #00e68a, glow 0 0 24 px rgba(0,230,138,.5), around each label box padded 10; fade in 0.12 s, out 0.35 s. Boxes (stage px): 1 GROWTH (120,206)-(473,242) · 2 PRODUCT (810,206)-(1172,242) · 3 PLATFORM (142,863)-(521,899) · 4 GTM (1440,206)-(1724,242) | `C1-all-base` |
| 359.06 | "Each (one is defined by the outcome)" | cross-fade 0.4 s: the four OWNS lines light together (SIGNUPS, SUBSCRIPTIONS, REVENUE · RETENTION · SPEED, RELIABILITY, COST · THE SALES PIPELINE) and the headline turns to `Defined by the outcome they own.` | `C1-all` |
| 361.40 -> 368.28 | the rewatch line | holds unchanged (the J-key line points back at this map) | `C1-all` |

### Never dead still (comp-build 7a)

Every C1 hold gets a slow push 1.00 -> 1.03 (ALL: 1.025), eased in-out over the cover, centred on the active zone:
FUNNEL (750, 560) · GROWTH (430, 420) · PRODUCT (860, 500) · PLATFORM (750, 760) · GTM (1500, 520) · ALL (960, 560).
Never deeper: the header and the source line clip past about 4%.

---

## C2 · the pod, then and now (10 PNGs, **4320x2430 = the 1920x1080 stage shot at 2.25x**)

ONE canvas, TWO 16:9 panels: THEN at stage (100,316) 830x467, NOW at (990,316) 830x467, header above, takeaway line below
(y 832), source line y 1022. The PNGs carry 2.25x pixels so the comp's camera can push 2.21x into one panel and stay sharp
(1958 source px per 1920 output px). **Render each PNG into a 1920x1080 box (`width:1920, height:1080`) and apply the camera
transform to that box:** for a camera rect `{x, y, w, h}` (stage px), `s = 1920 / w`, `transform: translate(-x*s px, -y*s px)
scale(s)` with `transform-origin: 0 0`. Camera rects (`C2.geometry.json` `geom.camera`):

| camera | rect (x, y, w, h) | scale |
|---|---|---|
| LEFT (the THEN panel fills the frame) | 80, 304.8, 870, 489.4 | 2.2069 |
| RIGHT (the NOW panel fills the frame) | 970, 304.8, 870, 489.4 | 2.2069 |
| FULL (both panels, header, takeaway) | 0, 0, 1920, 1080 | 1 |

Camera moves ease in-out (cubic). Previews of the pushed views: `_previews/chart-build/C2-then-camLEFT.png`,
`C2-now-camRIGHT.png`.

### THEN · cover 129.92-153.40 (23.5 s, camera LEFT)

| t | word | move | PNG |
|---|---|---|---|
| 129.92 | (cover edge; "Here's" 130.12) | entry on camera LEFT: the frame A TYPICAL POD with six empty (dashed) seats | `C2-empty` |
| 135.78 / 139.32 | cross(-functional) / working | **T->B mask** of `C2-scope` over `C2-empty`, x 100-930, edges y 420 / 1080: `cross-functional, typically 10 or fewer people (Scrum Guide 2020)`, then `works on funnel steps or product features` | `C2-scope` |
| 144.78 / 145.82 / 146.84 / 148.22 / 149.84 / 150.74 | front / backend / QA / project / designer / marketer | **region boxes** of `C2-seats` over `C2-scope`, one seat per spoken role, a person in each. Boxes (stage px, padded 4): FRONTEND (137,463)-(383,571) · BACKEND (393,463)-(639,571) · QA (649,463)-(895,571) · PROJECT MANAGER (137,581)-(383,689) · DESIGNER (393,581)-(639,689) · MARKETER (649,581)-(895,689) | `C2-seats` |
| 151.60 | "six (seats)" | cross-fade: all six light + `6 SEATS, 6 PEOPLE` | `C2-then` |

Seat label stays FRONTEND (he says "a front engineer"); no squad size, no two-pizza team.

### NOW · cover 153.40-167.38 (14.0 s, a contiguous STATE SWAP: no ingress transition at 153.40)

| t | word | move | PNG |
|---|---|---|---|
| 153.40 -> 154.25 | (slot edge; "Now" 153.58) | camera pans LEFT -> RIGHT (0.85 s); at 153.58 cross-fade 0.4 s into the drawn NOW panel (header `NOW · ONE ENGINEER CAN FILL ALMOST EVERY SEAT`: the capability claim says CAN, nothing measured) | `C2-now-base` |
| 158.18 | "supplies" | cross-fade: arrow out + SUPPLIES THE GOAL | `C2-goal` |
| 159.92 | "AI (agents)" | cross-fade: the six agent seats light + AI AGENTS DO THE WORK | `C2-agents` |
| 162.54 | "reviews" | cross-fade: arrow back + REVIEWS | `C2-now` |
| 163.98 -> 164.78 | "The (pod doesn't disappear)" | camera pulls back RIGHT -> FULL (0.8 s) while cross-fading: the old pod dims to .30, takeaway `The pod doesn't disappear.` | `C2-dim` |
| 165.60 | "One (engineer runs the whole pod)" | cross-fade: ONE ENGINEER lights (green, glow) + `One engineer runs the whole pod.` | `C2-final` |

Holds drift 1.00 -> 1.015 inside the current camera (LEFT through 153.40, RIGHT 154.25-163.98, FULL 164.78-167.38).
C2 holds 37.5 s across its two slots (declare it in `// DIAGRAM_REFS:`; the LONG HOLD warning is an actively explained,
camera-moved system-design diagram, GATE 3 ruling 10).

---

## Wording guards held (DATA.md, AS-RECORDED)

AAARRR on screen; "AARRR" only in the McClure source line; no year, no venue (WARNING 7). OWNS wordings: growth = PostHog's
"signups, subscriptions, and revenue"; platform = CNCF's internal users "application developers, data scientists"; GTM = Clay's
CRM + outbound, Salesforce as the CRM example. Retention as the product engineer's stage is Mike's mapping, drawn as his
mapping. Pod caption verbatim "typically 10 or fewer people (Scrum Guide 2020)"; the six seats are Mike's illustration
("a typical pod"); "supply the goal" = the Anthropic essay, "direct and review" = the S-1; the NOW header says CAN. No numbers
other than 10, 2020 and the seat count. No em dashes (the build refuses one).
