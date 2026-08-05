# ethereum-rwa — TRANSITIONS plan
_Three-bucket policy (canonical: ../../assets/transitions/README.md + longform-edited.md #5). Glitch ids:
assets/transitions/library.json. Do NOT collapse all cuts into the glitch library._

**Spine:** `spine/ALL.e.desilenced.mp4` (417.41s, LOCKED). **Aspect 16:9** (every `lib:` id below is a 16:9 row).
**Timebase:** all TCs are PRE-card-pause e-spine coords (same as COVER-PLAN.json). The three ~1s card-pauses at
48.92 / 129.92 / 200.34 shift every later cue: route EVERY value here through the comp's `sh()` mapping.
**HARD RULE:** the spine is ONE continuous `OffthreadVideo`. NOTHING here wraps it in `TransitionSeries` — every
move below is a self-contained card scene, a `TransitionClip` placed at a cut, or a hand-rolled overlay in/out.

**Transition SOURCE prefix (tag EVERY transition so a reviewer can tell the source at a glance — Mike, 2026-07-10):**
- `rmn:` 📦 = out-of-the-box `@remotion/transitions` (slide, fade, iris, cube…).
- `lib:` 🧩 = OURS, from the transition library (`../../assets/transitions/library.json`).
- `hand:` ✋ = hand-rolled overlay code (film-burn, xfade+scale, punch-in, pop — not a package/library).
A bare transition name (no prefix) is a gap to fix.

## 1. Chapter / title cards → ONE pick for the whole video
This video = **`rmn:cube`**, direction **from-right**, ~0.8s in / ~0.8s out (Safe CSS-3D pick, no render flag).
Cards ON at the three music-bed changes ONLY (CH5 is cardless by design, BED D continues):

| TC | Card | Bed change | Handling |
|---|---|---|---|
| 48.92 | THE PROOF | A→B | cube-in from D1-TEASE, hold across the ~1s pause, cube-out lands ON `D2-A` |
| 129.92 | ROBINHOOD CHAIN | B→C | cube-in from D2-C, cube-out lands ON `V4` |
| 200.34 | THE BULL CASE | C→D | cube-in from D3-A-L1, cube-out lands ON `V6` |

Each card is a self-contained `@remotion/transitions` scene + its inserted card-pause — never the spine wrapped
in `TransitionSeries`. **Cube-in STARTS ~0.5s BEFORE the pause point** so the title is readable >=1s (min-1s rule).
The cube-out IS the ingress move for D2-A / V4 / V6 — the comp must NOT add a second fade on those three cues.
Card impact SFX may ring (VO is silent inside the pause); mind the bed-change breath (MUSIC-PLAN breath 0.6s).

## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)
ChatGPT stills glitch on ingress; Envato VIDEO never glitches; no glitch on any container/diagram/chart/receipt.

| TC | Change | id | Note |
|---|---|---|---|
| 100.88 | C7 → I1 stampede still | `lib:badsignal-short-1` | low-energy variant: CH2 is the subtle explainer bed |
| 286.12 | FACE 5 → I2 tollbooth still | `lib:blocks-max-3` | ⚠ face-cut rule WINS on this shared boundary: the face-out Blocks hit doubles as I2's glitch ingress. Do NOT stack a badsignal on top |
| 395.00 | V8 → I3 real-assets still | `lib:badsignal-max-1` | max variant: CH5 epic crest |

## 3. Face + b-roll + TEXT-containers → hand-rolled overlays on the spine (house rule #5)
- **FACE cut in AND out → `lib:blocks` (Blocks glitch), the per-video pick.** Blocks·Max (`blocks-max-1/2/3`
  rotating) on every standard face cut; the strips tier (`blocks-strips-*`) ONLY where mechanics force it (the
  0.77s FACE 2 window) and on punch-ins, per the sanctioned convention. Why Blocks over film burn: this video's
  language is digital-epic (synthwave BED C, neon #CCFF00 Robinhood accents, RGB-melt + 3D-spin marquee kit);
  a warm analog burn would be the one orphaned device. NEVER a plain cross-fade to the face.
- **FACE holds > ~2s → a hard JUMP-CUT re-frame, ALTERNATING IN then OUT across the video (Mike, 2026-07-31).**
  Not every face beat pushing the same way: scene 1 punches IN, the next pulls OUT, and so on, so the film
  never falls into one repeated move. **Every re-frame fires a glitch from the library on the snap**
  (`lib:blocks-strips-*`, the same family as the face cuts) — the glitch IS the jump cut, the zoom is what it
  cuts to.
- **Anchors are MEASURED, not nominal.** Mike's rule is to land these where a cut would have happened anyway.
  Computed from the maps + word timings:
  - **FACE 6 is the only window with real desilence joins inside it** (10 of them). Its re-frames snap to
    those exact joins, listed in §5.
  - FACE 1/3/5/7 have **no** interior desilence join (their cuts fell on the window edges), so each takes its
    largest interior speech gap instead. A re-frame is picture-only, so a word boundary is sufficient:

  | Window | Length | Anchor | Move | Lands on |
  |---|---|---|---|---|
  | FACE 1 | 8.44s | **3.14** (320 ms gap) | **IN** →115% | after "price," / before "the" |
  | FACE 3 | 4.34s | **108.88** (word boundary) | **OUT** →100% (opens ~112%) | after "conservative" / before "money" |
  | FACE 5 | 6.94s | **280.40** (440 ms gap) | **IN** →115% | after "here," / before "the" |
  | FACE 7 | 8.37s | **410.38** (360 ms gap) | **OUT** →100% (opens ~112%) | after "video," / before "if" |

  FACE 2 (0.77s) and FACE 4 (2.04s) take **no** re-frame — too short, and FACE 4's glitch straddles already
  leave only ~1.1s of clean face.
- **Envato VIDEO b-roll → `hand:fade` (~0.5s)** each side (except where a face cut or card owns the boundary).
- **TEXT-container / card-slide / chart swap → `hand:xfade+scale` (~0.35s cross-fade + 0.93→1 scale-in)** — the
  quiet default (charts.md: charts enter same as containers). Kept deliberately quiet so the marquee moves stay special.
- **Receipts:** ingress = `hand:xfade+pop` (~0.4s scale-settle). Their single-image MOTION is an **ON-IMAGE
  effect inside the receipt's own window — NOT a transition row. It does not consume the marquee budget; the
  comp must not double-apply** a move at receipt boundaries. Per-receipt assignment in §3b below.

### 3b. Single-image MOTION on receipts — PERSPECTIVE on the data panels (Mike, 2026-07-31)
`broll-and-containers.md` §2 sanctions **PERSPECTIVE** (Ease In / Ease Out (+Short) · Pan 3D (+Short)) as a
single-image family, and requires that a video **mix its moves so the receipts don't all travel the same way**
(ONE move per receipt; subtle families on reading beats). The first pass had all seven receipts on a generic
"push", which is exactly the failure that rule exists to prevent. Split by receipt TYPE:

| Receipt | TC | Type | Move | Why this family |
|---|---|---|---|---|
| **R1** rwa.xyz total-value panel | 11.32 (3.94s) | R(other) | **`lib:perspective-ease-in-short-up`** | flat dashboard, no prose to read — the panel settles into place and lands the "$30 billion" number. SHORT variant for the tight 3.9s window |
| **R5** ETH treasury tracker | 222.88 (9.00s) | R(other) | **`lib:perspective-pan-3d-down`** | a ranked table: the 3D pan travels DOWN the rows to arrive on BitMine at #1, which does the "find the row" work a flat push only implies |
| **R6** farside ETF flow table | 234.82 (5.12s) | R(other) | **`lib:perspective-ease-in-left`** | a wide flat data grid; easing in across toward the leading ETHA column gives a flat UI capture dimensionality. ⚠️ **CORRECTED 2026-07-31** — was specced `-right` on the assumption ETHA sat right of centre. It does not: **ETHA is the LEFTMOST data column** (~19% from the left edge), so `-right` travelled AWAY from the column the move exists to point at. Caught by `visual-qa`. The recapture must also carry real horizontal headroom (the first capture had 1.1% margin, so any horizontal move ran off the table on frame one). |
| R2 Securitize BUIDL page | 69.58 | R(other) | `hand:ken-burns push` (subtle) | product page, mostly a mark + a figure |
| R3 The Block | 111.88 | R(article) | `zoom-ease-short-in` (subtle) | **reading beat** — keep it a quiet reading push |
| R4 Robinhood announcement | 133.30 | R(article) | two-stage zoom (wide → headline/date) | **reading beat**, sanctioned long-read treatment |
| R7 Vitalik quote | 261.68 | R(article) | `zoom-simple-short-in` (subtle) | **reading beat** onto the quoted passage |

**Why PERSPECTIVE lands on exactly these three:** they are the R(other) UI/data captures, where there is no
prose to read and the job is to make a flat screenshot feel like an object. The three R(article) prose receipts
stay on subtle zoom/push because the viewer is READING them and a tilt would fight the text. Perspective is
NOT used anywhere else in the video, so it stays a deliberate device rather than a fourth competing language.
⚠️ Same caveat as the spin (open question 4): confirm the direction suffix against the gallery preview at build
(`assets/transitions/browse/PERSPECTIVE/<family>/gallery.html`) and swap to the sibling variant in the SAME
family if the hinge reads the wrong way. These are on-image effects, so a direction swap costs nothing else.
- Light-leak overlay on sustained faces (>5s: FACE 1/5/6/7) is an OVERLAY per `skills/overlays.md` (inset ~0.6s
  off any cut) — owned there, listed here only so nobody adds a second device.

## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)
ONE melt look = **Melt RGB, full-length** (`lib:melt-rgb-*`, 0.76s, chromatic channels scale apart and REFORM —
on-brand for a chain video). ONE spin look = **Spin 3D Side Ease** (`lib:spin-3d-side-ease-*`, vertical-axis 3D
turn over mirrored padding — echoes the cube card; full 0.88s / short 0.44s by gear). Both are full-frame
cover-to-cover moves (melt warps full-frame, spin rides mirrored padding): the spine never peeks mid-transition.
**Every row below carries baked SFX → duck it UNDER the VO** (the narration keeps talking through all six).

| TC | move | id | TRANSFORM-vs-NEWFACET why |
|---|---|---|---|
| 144.78 | SPIN full 0.88s | `lib:spin-3d-side-ease-right` | **NEW FACET — the marquee frame of the video.** Off FACE 4's "and they built it on Ethereum," the Robinhood settlement stack TURNS IN as the argument's new face; the 3D turn echoes the cube chapter language, and Edgerunner's peak9 is already pushing. (Deliberate one-off exception to the Blocks face-out — flagged below.) |
| 192.60 | MELT 0.76s | `lib:melt-rgb-1` | **TRANSFORM (callback).** The honest Solana board (C8) liquefies and REFORMS into D3-A's re-lit state: L1 enlarged, Robinhood docking, exactly on the pivot "but that's exactly what makes this launch so loud." Same lineage, re-highlighted. |
| 202.96 | SPIN short 0.44s | `lib:spin-3d-side-ease-short-right` | **NEW FACET.** "Let's start with supply" — the bull case's first exhibit board turns in. SHORT variant: BED D enters soft (env 5-6) and the full spin would outgun the gear; the facet language stays, the energy matches. |
| 246.54 | MELT 0.76s | `lib:melt-rgb-2` | **TRANSFORM.** The ETF demand card (D4-B) reforms into the tollbooth system (D4-C #1) on "And this is where it gets interesting" — the demand story literally flows into the fee structure that should capture it. |
| 253.40 | MELT 0.76s | `lib:melt-rgb-3` | **TRANSFORM (state).** Same diagram, next state: the 0.15% red sliver lands ($816K cumulative → ~$1.5K). The reform-on-itself IS the story: the value stream re-forms and almost nothing reaches L1. |
| 266.60 | MELT 0.76s | `lib:melt-rgb-2` | **TRANSFORM (state, callback across the receipt).** Vitalik's quote reforms BACK into the tollbooth, now with the Fusaka fee floor sliding in — the fix his words demand, third state of the same structure. |

**melt_spin_budget: melt 4 · spin 2 — reserved to the marquee diagram beats only, never sprayed.** Deliberately
NOT melted/spun: C1→C2 (see below) · C6→C7 · every text card · D5-CLOSE (text card, quiet by rule — but see open
question 2) · the MONT montage (five moves would burn the language; it gets its own single fast device, §5 note).

## 5. Per-cut master list (time-ordered, every scene change assigned)

Punch rows marked ~ are nominal mid-beat TCs — snap to word onsets at build. `duck` = baked/added SFX sits under VO.

| TC | Change | Move | id | Dur | duck | Why |
|---|---|---|---|---|---|---|
| 0.00 | opens ON FACE 1 | none | — | — | — | video starts on the hook face; no transition |
| **3.14** | FACE 1 jump-cut **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | measured 320 ms gap after "price," |
| 8.44 | FACE 1 → V1 skyline | face glitch | `lib:blocks-max-1` | 0.96 | yes | face-out; owns V1's ingress (no extra fade) |
| 11.32 | V1 → R1 rwa.xyz | `hand:fade` + pop | — | 0.5 | — | video fades, receipt pops (push-in is on-image) |
| 15.26 | R1 → C1 growth chart | `hand:xfade+scale` | — | 0.35 | — | quiet chart default; C1 animates for real inside |
| 26.22 | C1 → C2-A donut | `hand:xfade+scale` | — | 0.35 | — | quiet; the C2 transform is carried by the FACE hinge (next 2 rows) |
| 29.96 | C2-A → FACE 2 | face glitch (short tier) | `lib:blocks-strips-3x` | 0.40 | yes | 0.77s window: a max glitch (0.96s) would swallow the "Ethereum." reveal; strips keep the word clean. Bed already dips -5dB here |
| 30.73 | FACE 2 → C2-B | face glitch (short tier) | `lib:blocks-strips-3x` | 0.40 | yes | matching out. **C2-B opens on the SAME donut geometry, label animates on in-chart** — the A→B transform reads through the face interruption, no melt spent |
| 36.04 | C2-B → D1-TEASE | `hand:xfade+scale` | — | 0.35 | — | text card, quiet |
| 48.92 | CARD: THE PROOF | card | `rmn:cube` | ~0.8×2 | n/a | §1; cube-out lands on D2-A (its ingress) |
| 65.76 | D2-A → V2 tower | `hand:fade` | — | 0.5 | — | video b-roll default |
| 69.58 | V2 → R2 BUIDL | `hand:fade` + pop | — | 0.5 | — | receipt ingress |
| 75.32 | R2 → D2-B card | `hand:xfade+scale` | — | 0.35 | — | text card, quiet (densest teaching line under it) |
| 85.30 | D2-B → C6 chains | `hand:xfade+scale` | — | 0.35 | — | quiet chart default |
| 93.20 | C6 → C7 mix | `hand:xfade+scale` | — | 0.35 | — | related charts but NOT a marquee; reserve the melt |
| 100.88 | C7 → I1 stampede | AI glitch | `lib:badsignal-short-1` | 0.48 | yes | §2 |
| 104.84 | I1 → V3 vault | `hand:fade` | — | 0.5 | — | video b-roll default |
| 107.54 | V3 → FACE 3 | face glitch | `lib:blocks-max-2` | 0.96 | yes | face-in for the CH2 punctuation line |
| **108.88** | FACE 3 jump-cut **OUT** →100% (opens ~112%) | `hand:punch` | + `lib:blocks-strips-2x` | 0.40 | yes | word boundary after "conservative"; alternates against FACE 1 |
| 111.88 | FACE 3 → R3 The Block | face glitch | `lib:blocks-max-3` | 0.96 | yes | face-out; owns R3's ingress |
| 118.00 | R3 → D2-C $2T card | `hand:xfade+scale` | — | 0.35 | — | text card, quiet; Fortitude's 9-run builds under it |
| 129.92 | CARD: ROBINHOOD CHAIN | card | `rmn:cube` | ~0.8×2 | n/a | §1; cube-out lands on V4 |
| 133.30 | V4 → R4 launch article | `hand:fade` + pop | — | 0.5 | — | receipt; its two-stage zoom is on-image |
| 142.74 | R4 → FACE 4 | face glitch | `lib:blocks-max-1` | 0.96 | yes | face-in, "they built it on Ethereum"; NO punch (2.04s window, glitch straddles leave no clean room — flagged) |
| **144.78** | **FACE 4 → D3-A stack** | **SPIN full** | **`lib:spin-3d-side-ease-right`** | 0.88 | **yes** | §4 — THE marquee new-facet turn |
| 161.26 | D3-A → D3-B stocks | `hand:xfade+scale` | — | 0.35 | — | text card, quiet |
| 170.00 | D3-B → V5 phone | `hand:fade` | — | 0.5 | — | video b-roll default |
| 173.46 | V5 → C3 momentum | `hand:xfade+scale` | — | 0.35 | — | quiet; C3's staged count-ups carry the energy |
| 185.10 | C3 → C8 Solana | `hand:xfade+scale` | — | 0.35 | — | the honesty beat is deliberately restrained (bed sits in the 7-groove); quiet is the point |
| **192.60** | **C8 → D3-A-L1** | **MELT** | **`lib:melt-rgb-1`** | 0.76 | **yes** | §4 — transform-callback |
| 200.34 | CARD: THE BULL CASE | card | `rmn:cube` | ~0.8×2 | n/a | §1; cube-out lands on V6 |
| **202.96** | **V6 → C4 lock-up** | **SPIN short** | **`lib:spin-3d-side-ease-short-right`** | 0.44 | **yes** | §4 — exhibit-board facet, short for the soft bed entry |
| 222.88 | C4 → R5 BitMine | `hand:xfade+pop` | — | 0.4 | — | receipt ingress |
| 231.88 | R5 → V7 ticker floor | `hand:fade` | — | 0.5 | — | video b-roll default |
| 234.82 | V7 → R6 ETF flows | `hand:fade` + pop | — | 0.5 | — | receipt ingress |
| 239.94 | R6 → D4-B ETF card | `hand:xfade+scale` | — | 0.35 | — | text card, quiet |
| **246.54** | **D4-B → D4-C #1** | **MELT** | **`lib:melt-rgb-2`** | 0.76 | **yes** | §4 — transform into the tollbooth |
| **253.40** | **D4-C #1 → #2** | **MELT** | **`lib:melt-rgb-3`** | 0.76 | **yes** | §4 — the split lands (state transform) |
| 261.68 | D4-C #2 → R7 Vitalik | `hand:xfade+pop` | — | 0.4 | — | receipts never melt; keeping this quiet is what makes the return-melt read |
| **266.60** | **R7 → D4-C #3** | **MELT** | **`lib:melt-rgb-2`** | 0.76 | **yes** | §4 — reform back, Fusaka floor state |
| 279.18 | D4-C #3 → FACE 5 | face glitch | `lib:blocks-max-2` | 0.96 | yes | face-in, asymmetry payoff |
| **280.40** | FACE 5 jump-cut **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | measured 440 ms gap after "here," |
| 286.12 | FACE 5 → I2 tollbooth | face glitch | `lib:blocks-max-3` | 0.96 | yes | §2 note: doubles as I2's AI-glitch ingress, no badsignal stacked |
| 289.54 | I2 → MONT-1 | `hand:cross-warp` | — | 0.35 | — | montage device begins (see note below) |
| 293.50 | MONT-1 → MONT-2 | `hand:cross-warp` | — | 0.35 | — | same direction, same speed |
| 297.62 | MONT-2 → MONT-3 | `hand:cross-warp` | — | 0.35 | — | " |
| 301.88 | MONT-3 → MONT-4 | `hand:cross-warp` | — | 0.35 | — | " |
| 304.20 | MONT-4 → MONT-5 | `hand:cross-warp` | — | 0.35 | — | " |
| 306.27 | MONT-5 → FACE 6 | face glitch | `lib:blocks-max-1` | 0.96 | **yes, firm** | face-in to the 84.9s ad-lib block; the bed is in its breakdown for the lean-in — duck the glitch SFX hard so "you guys want to know what my call is really?" gets air |
| **315.04** | FACE 6 re-frame 1 **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | snapped to a REAL desilence join |
| **326.24** | FACE 6 re-frame 2 **OUT** →100% | `hand:punch` | + `lib:blocks-strips-2x` | 0.40 | yes | snapped to a REAL desilence join |
| **346.90** | FACE 6 re-frame 3 **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | snapped to a REAL desilence join |
| **354.18** | FACE 6 re-frame 4 **OUT** →100% | `hand:punch` | + `lib:blocks-strips-2x` | 0.40 | yes | snapped to a REAL desilence join |
| **359.24** | FACE 6 re-frame 5 **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | snapped to a REAL desilence join |
| **376.48** | FACE 6 re-frame 6 **OUT** →100% | `hand:punch` | + `lib:blocks-strips-2x` | 0.40 | yes | snapped to a REAL desilence join |
| **383.36** | FACE 6 re-frame 7 **IN** →115% | `hand:punch` | + `lib:blocks-strips-1x` | 0.40 | yes | snapped to a REAL desilence join |
| 391.19 | FACE 6 → V8 wave | face glitch | `lib:blocks-max-2` | 0.96 | yes | face-out; owns V8's ingress |
| 395.00 | V8 → I3 real assets | AI glitch | `lib:badsignal-max-1` | 0.76 | yes | §2, epic register |
| 398.24 | I3 → V9 bank lobby | `hand:fade` | — | 0.5 | — | into the `lead:true` push-in clip |
| 402.78 | V9 → D5-CLOSE | `hand:xfade+scale` | — | 0.35 | — | text card = quiet by rule; the verdict's power is the end-aligned peak9 + the in-card "NOT PRICED FOR IT" word-landing (open question 2) |
| 409.04 | D5-CLOSE → FACE 7 | face glitch | `lib:blocks-max-3` | 0.96 | yes | face-in for the closing CTA |
| **410.38** | FACE 7 jump-cut **OUT** →100% (opens ~112%) | `hand:punch` | + `lib:blocks-strips-2x` | 0.40 | yes | measured 360 ms gap after "video," |
| 417.41 | HARD OUT | none | — | — | — | deliberate hard ending, no outro device |

**Montage note (MONT-1..5):** glitch is banned on containers/diagrams/charts, and five melts would spray the
marquee language — so the montage gets ONE consistent fast hand-rolled move: the house **cross-warp** (directional
gradient-mask sweep + skew/blur settle, ~0.35s, same L→R direction all five). It reads as flipping through the
whole board in one motion, distinct from both the quiet container x-fade and the marquee moves. These five stay
sequential cover slots with per-item in/out — NOT a `TransitionSeries`.

## Consistency check
ONE card move (`rmn:cube` from-right, ×3, the only `@remotion/transitions` use). ONE face family (`lib:blocks`:
max rotation on cuts, strips tier only for punch-ins + the mechanically-forced 0.77s FACE 2). ONE melt look
(Melt RGB full, ×4, all on the D-diagram lineage). ONE spin look (Spin 3D Side Ease right, full ×1 + short ×1,
both "a new board of the case turns in"). AI stills = badsignal only (×2 + one absorbed by a face cut). Every
text container/card/chart swap stays the quiet `hand:xfade+scale`; Envato video always `hand:fade`; receipts
`hand:xfade+pop` with on-image push-ins outside the transition system. Every `lib:` move's SFX ducks under VO;
card cubes fire inside VO-silent pauses. No bucket collapsed into another; no bare un-prefixed transition.

## Open questions (Mike)
1. **Face pick = Blocks glitch, not film burn.** Register call (digital-epic, synthwave, neon). 11 glitched face
   cuts + 11 strips snaps across 6:57 — if the draft strobes or the SFX cadence tires, film burn is the
   sanctioned softer swap (same placements, drop the strips SFX on punch-ins).
2. **D5-CLOSE @402.78 stays a quiet x-fade** by the text-cards-stay-quiet rule — but it IS the verdict board on
   the final crest. If you want the verdict spun in, a third `lib:spin-3d-side-ease-right` (full) is the move;
   budget goes to 3 spins. My letter-of-the-law call is quiet; your override is one line.
3. **FACE 4 (2.04s) gets NO punch-in** — the two 0.96s glitch straddles leave ~1.1s of clean face; a mid-snap
   would strobe. Confirm.
4. **Spin direction naming:** confirm on the gallery preview that `-right` is the vertical-axis turn matching
   `cube` from-right (the library's direction suffixes vs hinge descriptions are ambiguous on paper). If not,
   swap to the sibling variant in the SAME family at comp build.
5. **CH5 re-frame cadence:** 7 snaps across the 84.9s block (one per ~12s, on the beat boundaries listed). Say
   the word to thin to 5 (drop ~346.70 and ~373.00) if the draft feels twitchy.
6. **MONT device = cross-warp** (the image-b-roll house move repurposed as the montage's one fast move). The
   quieter alternative is the 0.93→1 x-fade ×5, but that undersells the "whole board" recap riding peak-1.
7. Card presentation is the Safe `cube`; `book-flip`/`swap` only if you accept the canvas render-flag risk
   (default: no).
