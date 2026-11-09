# whiteboard-beat: a 15 to 30 s hand-drawn explainer scene INSIDE a video (shared, both longform tracks)

**What this skill is:** the contract for one WHITEBOARD BEAT: a short code-rendered, hand-drawn SVG scene (the
rough.js kit of `video-creation/whiteboard/`, fixed seeds, no camera, no generated images) that draws itself on
under Mike's voice, cued to his words, in place of b-roll or a deck card. The kit, the style research and the
pen / vocabulary decisions live in **`video-creation/whiteboard/whiteboard.md`** (the track doc); this skill is
how a beat is BRIEFED, BUILT, RENDERED and PLACED in a video that is not a whiteboard video. It is shared
because both longform tracks use it (Mike, 2026-10-31: "in both the long-form edited and the long-form
presentation videos"), like defumbler / desilencer / captions; the kit itself stays with the whiteboard track.

**Who builds it:** the **`whiteboard-builder`** agent (`.claude/agents/shared/whiteboard-builder.md`, Fable at
max effort; the Opus fallback is the automatic one every agent dispatch has). It designs the storyboard,
authors the kit objects the scene lacks, writes the Remotion scene comp, and still-frame QAs it. The caller
(the main loop or the track's graph) renders the clip through `chunked-render` and composites it.

## The contract

| item | rule |
|---|---|
| length | 15 to 30 s (first videos: 15 to 20). 2 to 4 micro-scenes, 4 to 8 draw-on events each |
| canvas | the AREA the beat is composited into, decided by the track: **longform-edited** = the full frame 1920x1080; **longform-presentation standard format** = the deck area, **1464x1080** (the left of the frame; Mike's webcam + the Premium Membership box keep the right column, never covered, `longform-presentation/skills/card-overlays/card-overlays.md`) |
| pen | named in the brief, from `whiteboard/styles/styles.json` + `remotion/src/whiteboard/pen.ts` (`neon-ink` for a dark video: black + gold, no fills, glow; `paper-pastel` = paper and pencil). Never a new pen inside a beat |
| cues | LOCAL seconds (0 = the beat's `in` on the FINAL spine), each hung on a spoken word from the spine's word timings. A thing draws as he names it, never before |
| start / end | starts blank, ends on the finished drawing. The compositor fades it in (11 frames) and out (0.3 s) like a card; no transitions inside |
| facts | every number / name / date on screen from the video's fact source (`DATA.md` / `RESEARCH.md`); no em dashes on screen; labels 1 to 4 words, the DRAWING carries the explanation |
| output | one Remotion comp `remotion/src/whiteboard/beats/<Project><Beat>.tsx` (FPS 30, DUR = round((out - in) * 30) frames, no audio) registered in `Root.tsx` at the canvas size; new objects in `remotion/src/whiteboard/<domain>.tsx` (the kit grows every video); QA stills in the project's overlay folder |
| clip | rendered by the caller: `python video-creation/skills/chunked-render/chunked_render.py --comp <Comp> --out "<project>/overlays/<id>.mp4" --public-dir video-creation/whiteboard/demo/pub --crf 18 --no-audio --label <project>-wb` (work dir on C:, never D:: a removable drive, Mike 2026-11-08). **longform-edited:** the output is `<project>/assets/whiteboard/<id>.mp4` (the comp's public dir; comp-build.md §4b + §10), the brief `assets/whiteboard/<id>.brief.md`, the builder's CUES `assets/whiteboard/<id>.cues.md`, the QA stills `_previews/qa/whiteboard/<id>/` |
| sound | the house SFX like any cover (draw-on ticks / pops picked from `assets/sfx/library.json`, never by listening) on tracks that mix SFX; the standard-presentation format has no SFX layer (audio stream-copied) |

## Procedure (the caller's checklist)

1. **Pick the beat** on the FINAL spine's transcript: a span where Mike explains a MECHANISM or a FLOW (how the key
   was used, where the money went), 15 to 30 s, self-contained. Note `in` / `out` (spine seconds) and the words.
2. **Write the brief** (`<project>/overlays/<id>.brief.md`): the words he says in the window (verbatim, with the
   word timings' seconds), the scene idea in 3 to 6 lines (what is drawn, what moves, the payoff), the pen, the
   canvas, the fact source path, the out-of-bounds (what not to draw, a number not to air).
3. **Spawn `whiteboard-builder`** with the brief path, the word-timings JSON path and the fact source. It returns the
   comp id, the files, the QA stills and the CUES table.
4. **`visual-qa`** on its stills (text in frame, no overlaps, pen correct), then **render** the clip (the command
   above) and verify its frame count == the beat window's frames.
5. **Composite**: longform-presentation standard = a `kind: "clip"` card in `overlays/cards.json`
   (`card_overlays.py`); longform-edited = a cover row of `type: whiteboard` placed by the comp build.
6. **Mike gates the result in the video** (the contact sheet / the draft), not the stills alone.

### In the longform-edited GRAPH, steps 1-5 are nodes (2026-11-01, built for left-behind)
| step | where | gate in code |
|---|---|---|
| 1 pick the beat | `coverage` node: the coverage-strategist writes COVER-PLAN `whiteboards[]` (id WB<n>, tIn/tOut, words, scene, cues, numbers, do_not_draw, pen, canvas 1920x1080, comp `<Project>WB<n>`, out `assets/whiteboard/WB<n>.mp4`) + `whiteboard` cover rows | `_cover_plan_check`: 15 to 30 s, a kit pen, the full-frame canvas, the fixed out path, rows inside the window (split only around a FACE line), no title / clip-insert pause inside it, and the per-video SHARE when set (`run.py --whiteboard-share 0.25` = 22 to 28 percent of the delivered runtime, GRAPH-PROGRESS.json `settings.whiteboard_share`). Whiteboard seconds never count against the Envato / ChatGPT budgets |
| 2 the brief | `assets` node writes `assets/whiteboard/<id>.brief.md` from the row (+ the window's word timings) | regenerated every run |
| 3-4 build, QA, render | `assets` node's WHITEBOARD LANE, beside the five builders but its beats ONE AT A TIME (they share the kit + Root.tsx): `whiteboard-builder` -> `visual-qa` on its stills (one rebuild with the defects) -> chunked-render (the command above) | the comp file + its Root registration + >= 3 stills; the clip's frame count == round((out - in) * 30); `verify_assets`: silent, exact frames, no orphan |
| 5 composite | `comp_build`: a `kind: 'whiteboard'` cover row playing the clip (comp-build.md §4b) | `lint_covers.py --plan` (verify_comp): every beat placed at its tIn, #12 except the FACE-split continuation |
The vertical lane has no whiteboard path yet: `v_assets` halts on a video that carries beats (a portrait re-draw is needed).

## History

- 2026-10-30: the kit + two demos (`whiteboard/demo/`), paper-pastel pen; 2026-10-31 the neon-ink demo.
- 2026-10-31 **binance** (longform-presentation standard format): the FIRST beat in a real video, delivered. Pen
  `neon-ink` (Mike: "it's dark mode, and the colors already look like Binance's colors"), canvas 1464x1080 (the deck
  area), 19.25 s (577 frames), comp `BinanceSigning`, new kit file `remotion/src/whiteboard/crypto.tsx` (EthMark,
  Wallet, Key, PaperStack, Hooded, ContractBox, Calendar, StraightArrow, BurstArrow, MoneyCount, FloorShadow). The
  agent + this skill were created for it. Built in 4 rounds: 3 by the agent, 1 after `visual-qa`, which caught what
  the agent's own stills had not (see Lessons).

- 2026-11-04 **quant** (longform-edited, launched to GATE screenplay): the first HALF-whiteboard video (`--whiteboard-share 0.5`),
  pen `paper-quant` (paper-pastel re-inked to quant.network's white + orange, `whiteboard.md` "The paper-quant pen"), and the
  first SCREEN-SHARE face mode (longform-edited.md house rule #1b), where a beat can also be the BODY of a screen-share at the
  1464x1080 deck-area canvas (the binance canvas).

## Lessons (keep)

- **`visual-qa` is not optional after the builder's own QA.** The builder passed 13 stills; visual-qa failed 10 of them
  on things a builder stops seeing: "$2.53B" read "$253B" (the Rock Salt period is a 6 px dot that merges into the 2 at
  60 px), "NOT BROKEN" read "NOTBROKEN" (word gap = letter gap), a label touching its box, a push-in driving ink to 14 px
  from the webcam edge, a floor shadow drawn before its figure.
- **Decimals in a display hand-font: draw the point explicitly** (a circle, ~0.085 em, clear air both sides), or set
  the number in the label font. `MoneyCount` in `crypto.tsx` does this now.
- **Two words in Rock Salt caps = two `Type` elements**, each on its own spoken word; the font's spacing will not
  separate them.
- **The push-in margin is measured on the LAST frame at full zoom**, against the canvas edge that abuts the webcam:
  keep ~50 px. `NEON_INK.charWL` was re-measured for CAPS (0.45 -> 0.62) so centred labels land on their anchor.
- A contact shadow under a neon figure is gated to the figure's own draw-on and stays very faint (the pen has no fills).
- **left-behind WB2, round 2 (2026-11-02), what visual-qa caught on the paper-pastel pen:** digits in Gochi Hand fuse ("170K"
  read "1TOK": the 7's bar runs into the 0); `Type` now takes `spacing` (em), use ~0.1 on display-font numbers, and Gochi
  digits measure ~0.54 em wide (not the pen's 0.41 lowercase average), so pass `charW` or the label lands off-centre. Gochi's
  z draws as a 3 ("squee3e"): set words with a z in the label font. A word written on a gridded object (the calendar page)
  must knock the grid out behind it (`FlipCalendar` fades the middle row). A shrink of 1/1.2 is invisible on a still without
  a ghost of the old size (`Bill ghost`). The payoff needs ~1 s fully drawn before the compositor's 0.3 s fade: hang it on
  the clause's first word, or ask the caller for a longer `tOut`. The old `Person phone` (a blue slab at the waist) does not
  read as a phone; `phone="ear"` is the handset-at-the-ear pose.
- **left-behind WB3, round 2 (2026-11-02), paper-pastel:** a flat fill CLIPPED to a shape's ideal path and drawn AFTER the shape's rough
  outline hides the outline wherever the wobble fell inside the clip (the flask's lower-left wall "had no ink" while the right wall did):
  draw fills first, the rough outline last. A string drawn under the object it ties to stops at the object's edge (the tag read as
  glued on): draw the string over the body, the hole on top. A Kalam-bold "M" is ~0.8 em: fit a written number by measuring the still,
  not the charW estimate. An object held beside a figure needs its air measured against the torso ink on the un-zoomed still (~20 px
  here). Two separate leaves never read as a wallet: one bifold on a fold, stitching, stacked card pockets did.

- **quant WB1 (2026-11-04), paper-quant, the builder's own rounds:** a figure placed by its FEET keeps them pinned when it is lifted (the coin's legs
  stretched into a pole on its hop into the boat): a component that gets carried places itself by its body and hangs the legs from it (`LegCoin` takes
  `cy` or `gy`). A route drawn along a boat's waterline collides with the hull's own wave ticks: the ticks sit ~13 px under the waterline. An object
  standing off a frame edge is measured by its outermost tick, not its body (island C's wave tick was 10 px from the edge; the island moved 20 px).
  The four islands are a shared layout (`islands.tsx` `QUANT_ISLANDS`): a later beat that draws them places them from it, never from its own numbers.
- **quant WB1, round 4 (2026-11-04), what visual-qa caught on the paper-quant pen:** a tinted band with a ruler-straight top edge reads as a RENDER BAND in a
  rough-pen scene, not as water: the shore is a drawn coastline (`Sea` now draws one, with grass tufts). An unmarked pale disc on two thin legs with one
  shared foot bar read as a lollipop / a road sign: the protagonist coin carries a "$" mark (no amount), a bold ink rim, a concentric inner ring and two
  separate forward-pointing feet (`LegCoin`). A figure that pops in must be measured against the object beside it (the coin popped over the ledger's
  pedestal). An object placed "off the tip" of an island by a shared geometry is measured against the scene's business at that tip (the tick sat on the
  cross and under the hop; `islandGeom.waterR` moved). A route's dots stop short of the chevron (`DottedArrow tail`), and a moving boat's bow wave is
  measured against the arrowhead on the LAST frame (10 px/s, not 16).
- **quant WB10, round 3 (2026-11-05), what visual-qa caught on the paper-quant pen:** two `Type` words in a bubble are spaced by measuring the INK of
  the first word on a still (Kalam 700 "more" at 40 px inks 83 px, the charW estimate says 74) and the second word's left bearing (~1 px); a 16 to 18 px
  gap reads as two words, 8 px reads as one. A label in a bubble is centred by its ink BLOCK (ascender top to descender bottom) on the bubble's middle,
  not by its baseline on a fraction of the height (both labels sat 23 px low at y + 95 of a 120 px bubble; ~y + 72 centres them). A boat under a
  coastline is measured mast-top against the coast's LOWEST wobble across its whole drift (`boatGeom` mast top = y - 128; the coast wobbles +-12).
  When the brief names a label on an object ("boats labelled 'pilots'"), the same word in a quote bubble is not a substitute: once another object
  stands between the bubble and the boats, the boats lose their meaning; label the thing. A bond's seal needs the sheet's height: three text lines + a
  seal with ribbons + a signature want ~200 px, not 180. A guard rail of two posts and one tube reads as an empty box on the deck; a mid rail makes
  it a railing.
- **quant WB11, round 3 (2026-11-05), what visual-qa caught on the paper-quant pen:** a RE-INK of a furnished object (the island's land outline drawn
  again, heavier) painted as a separate layer after the object runs over everything standing on it (palm trunk, vault rim, entablature, ledger
  foot, flag pole) and the land reads as a transparent ellipse laid over the scene: the emphasis stroke is the object's own opt-in prop
  (`Island reinkT`), painted between the fill and the furniture. A strike's tip is measured against EVERY thing near it on the still, not the one
  it was placed against (the X was measured against the ledger; its lower-left tip sat on the UK flag's fly corner and read as a rope tied to the
  flag). Two sliders on a short thread need a landmark between them (the check in the sky above the coast, the padlock in the water below it), not
  two fractions of the same 60 px. The payoff's ~1 s hold is checked against the FADE START (out minus 0.3 s), by the frame: a payoff hung on the
  clause's last words finished under the fade; hang it on the clause's subject / verb (quant / holding / contracts) and state the hold in the cues.
  A shared layout's own marks (an island's shore tick) count toward the deck-scaled right margin too: drop the tick (`Island wavesR={false}`) rather
  than move the island.
- **quant WB12, round 3 (2026-11-05), what visual-qa caught on the paper-quant pen:** a rail track whose near end sits AT the floor line and climbs
  the white wall reads as a LADDER propped against the plinth (rung anatomy = sleepers stopping at the rails, ending in mid-air). A track that
  LIES ON THE GROUND is drawn in the floor band (below `gy`): wide and low at the near end, converging up toward the floor line as it recedes,
  sleepers overhanging both rails, heavier rails (`BankFacade rail={{ dy: 48, gap: 34, rise: 40, overhang: 0.25, heavy: 1.4 }}`); a label row
  under it is measured against the lowest sleeper end (~35 px). Two threads leaving a pill 15 px apart, one straight up and one at a shallow angle
  under the other's foot, read as one BRANCHING off the other: give the second its own face of the pill (the end cap, `capEdge(-20)`), 40+ px from
  the first root and heading away from it. A label's top margin is the INK top on the still (Kalam 700 at 42 px inks ~34 px above its baseline),
  keep it >= ~60 px from the frame edge.
- **quant WB12, round 4 (2026-11-05), what visual-qa caught on the round-3 stills (paper-quant):** a track whose sleepers are STROKED lines
  crossing two near-flat rails reads as a FENCE in perspective (posts + two rails = WB2's picket-fence anatomy, which the brief forbids),
  wherever it lies; sleepers drawn as FILLED wooden planks slanted along the track's perspective and lying UNDER two heavy rails
  (`PlankTrack` in `bank.tsx`, `BankFacade rail={{ planks: true, ... }}`) cannot. A hexagon around a solid dot inside concentric rings
  reads as a hex nut / a target, never a coin: a token carries a "$" (`HexToken`, no amount, so the no-numbers rule holds). A builder
  round whose stills were never shot is invisible to visual-qa: the stills are the deliverable, shoot them before returning.
