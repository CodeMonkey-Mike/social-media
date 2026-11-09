# longform-edited · OVERLAYS

Overlay effects for the longform-edited track: visual layers that sit **ON TOP of the footage for a DURATION**,
not at a single cut. This is the key distinction from **TRANSITIONS** (film burn, cross-warp, dissolve,
book-flip — those fire AT a cut; see `../broll-and-containers/broll-and-containers.md` + house rule #5).

> **An overlay and a transition are different devices and must NEVER be fired on the same frame.** A transition
> punctuates the *cut*; an overlay lives over the *sustained* footage between cuts. Conflating them (e.g. a
> light leak starting on the exact frame of a film-burn cut) is the bug this skill exists to prevent.

**Layer order — overlays render UNDER the text layer.** An overlay (light leak; future grain / vignette) is a
screen-blend / translucent layer, so it MUST sit **below captions and any on-screen text**, never above —
otherwise its warmth/texture tints and distorts the glyphs. **Captions are always the topmost content layer.**
In the comp the overlay component comes BEFORE `<Captions />` in the tree (verified: `LightLeak` precedes
`Captions`, so captions sit on top). Be deliberate about this when a caption and a light leak share a > 5s
face hold — the leak goes under the text.

## 1. Light leak (FACE punch-in on a desilencer join) — LIBRARY footage, rotated (Mike, 2026-10-07)
> A video run with **face style `glitch`** (`run.py --face-style glitch`, Mike 2026-10-16) carries NO light leaks on its
> punches: each punch gets a random Glitch Offset / Glitch Blocks hit across the join instead, and every face cut-in is a
> random Split Swinging Offset (comp-build.md section 5). Everything below is the default `leak` style.
> Face style **`optics`** (`run.py --face-style optics`, Mike 2026-11-03) only changes the cut-in, to a random ZOOM Optics
> move (comp-build.md section 5); the punches keep the light leaks below.
> **Light leaks stay the DEFAULT for every video.** `glitch` is a per-video exception Mike chose for TAO because the
> topic is AI-heavy and glitch hits suit it; only switch it on when Mike asks for it (2026-10-16).
- **Source: the transition library's LIGHT LEAKS family** (`assets/transitions/library.json`, 34 clips in four looks:
  Light Leaks 1-8 at 1.12 s, Light Leaks Short 1-8 at 0.4 s, Soft 1-9 at 1.44 s, Soft Short 1-9 at 0.4 s; browse them in
  `assets/transitions/browse/LIGHT LEAKS/gallery.html`; Remotion engine `transitions/engines/LightLeaks.tsx`). The
  Remotion-synthetic `<LightLeak>` glow is RETIRED for this track (it was the mid-hold pulse on holds over 5 s).
- **Trigger = a PUNCH-IN inside a face window, and a punch-in lands ONLY on a desilencer / defumbler JOIN** inside that
  window (`spine/jumpcuts-final.json`, written by `scripts/list_face_joins.py`, frame-exact; a join within 0.5 s of the
  window's edges is not a punch point, and two candidates closer than 1.5 s keep only the first). The jump cut is already in
  the footage, so the ~15-20% scale step and the leak sit on a cut the viewer expects. Successive punch points in one window
  ALTERNATE: step in on the first, step back to the base frame on the next, in again on the third (never compound the zoom).
  **A face hold with NO interior join gets NO punch and NO leak.** Hold length no longer matters.
- **Placement:** the leak is a TRANSITION row in `TRANSITIONS.md` bucket 3 (`bucket: face`, `role: punch-leak`,
  `source: lib`, id `lib:lightleaks-*`), its flash peaking ON the join frame, the punch-in stepping on the same frame
  (`[PUNCH-IN]` + `[LIGHTLEAK]` events in EDIT-PLAN.md, seeded by `gen_editplan.py` from the joins file). Screen blend,
  real footage, under the captions.
- **Variety (usage ledger slot `face_leak`, GATED):** each video picks a SET of 3 or 4 leak ids from the family and cycles
  them across its punch points (one look per video is fine, mixed looks are fine). The ids the previous video used are
  BLOCKED; prefer `fresh`, then least recently used (`usage_ledger.py report --what transitions`, slot `face_leak`). The
  transition-strategist picks the set; the graph's `transitions` node fails a repeat without a waiver.
- **Verify on a CHUNK, not a still:** render the 10 s chunk around a punch point: the step lands on the join frame (no
  mid-word jump), the leak peaks on it, captions stay un-tinted on top.

## 2. Kinetic text: the 2023 MOTION + SOUND devices (Mike, 2026-10-21)

> Source: Mike's 2023 video "Growth Marketer vs Growth Hacker" (`D:\Dropbox\mikeneder.me\videos\GrowthMarketingMike\004 ...\main-sequence.mp4`),
> keyframes read out of its Premiere project (`differences revision_1.prproj`) on 2026-10-21 and converted to the house 1920x1080 frame.
> The catalog of record is **the EFFECTS library `video-creation/assets/effects/library.json`** (`devices` = the motion recipes with
> their sound offsets and graphics, `themes` = which devices, textures, graphics and sounds belong together; theme `kinetic-text-2023`,
> its time-ordered map `assets/effects/themes/kinetic-text-2023/CUE-SHEET.md`; skill `video-creation/skills/effects-library/effects-library.md`).
> The SOUNDS stay in the SFX catalog (`video-creation/assets/sfx/kinetic-text/library.json`, each row with `device`). Moved out of the
> sfx folder 2026-10-25 (Mike: "they are just effects, regardless of sound or not"). This section = the longform-edited PLACEMENT rules
> plus the recipe table of the first six devices; the newer devices (`kt-list-card`, `kt-icon-pop`, `kt-subscribe-close`,
> `kt-scatter-words`, the band's `text_swap`, the side panel's `paper` texture, the keyword pop's `punch`) are in the library only.
> Mike's rule: **a kinetic-text device is a MOTION and a SOUND together, grabbed as a pair.** Never the motion silent, never the
> sound on a static card, one sound per event. The sound is chosen by MEANING (neutral / negative / money / positive), the motion by
> what the text does. Colours and typeface are per video (the 2023 look was Montserrat ExtraBold Italic, ALL CAPS, yellow `#FCFE40`
> key words over white, on dark green `#003C33` texture; a house video keeps the motion + sound and uses its own palette and font).
> These are OVERLAYS (they live over sustained footage); `kt-whip-cut` is the one TRANSITION in the set and belongs to bucket 3.

| device id | what the text does | motion (1080p numbers) | sound (offset to the motion) |
|---|---|---|---|
| **`kt-side-panel`** | a label / short statement sits BESIDE the main picture 2 to 3 s | the picture shifts toward the free side (2023: -80 px, scale 120 percent, 0.47 s) · a dark textured panel, full height, **45 percent of the width (862 px)**, slides in from fully off-screen to flush in **0.50 s ease-out**, RIGHT on the first use and LEFT on the next (alternate) · **0.23 s later** the text block rises **338 px** from below to rest over **0.33 s** while scaling **80 -> 110 -> 100** (peak at 0.15 s), motion-blurred · then it **HOVERS** for the life of the panel: eased drift inside a **+-18 px x / +-13 px y** box with a new target every **~0.7 s**, plus a **+-0.5 degree rock on a 3.0 s cycle** · no exit move, the next cut removes it | `swoosh-1` (right) / `swoosh-2` (left), starting **0.1 to 0.2 s BEFORE** the panel moves; the text pop is silent |
| **`kt-keyword-pop`** | a 1 to 2 line keyword or verdict pops onto the lower picture ON the spoken word, holds 1.2 to 2.2 s | appears at once (no fade) centred at **~79 percent** of the frame height · **scale 100 -> 110 over 0.20 s** with a **rotation jiggle 0 / +2 / -2 / +1 / -0.5 / 0 degrees at 0 / 0.03 / 0.08 / 0.13 / 0.20 / 0.27 s**, 360 degree motion blur (the first 2 to 3 frames smear) · then still · the next cut removes it | by MEANING, ON the first frame: `knock-pop` neutral · `minecraft-damage` NEGATIVE verdict (comedic, at most once a video) · `twinkle` POSITIVE / discovery · `punch-1-2023` one emphatic accent-red word · `cash-register` MONEY word, started **0.17 s early** so the bell lands on the text |
| **`kt-headline-over-broll`** | one huge word or a two-line sentence centred over b-roll | the b-roll lands with a **whip-zoom: scale 200 -> 100 + lens-distortion curvature -100 -> 0 over 0.37 s** · **0.8 s after the cut** the text does the `kt-keyword-pop` pop, centred mid-frame (y 43 to 50 percent), a single word about a quarter of the frame tall · holds still 2 s | `ea-glitch-21` ON the cut (tech b-roll) or `swoosh-3` (calm b-roll); then `cash-register` 0.17 s before a MONEY word, or `twinkle` ON a positive sentence |
| **`kt-word-by-word`** | a sentence as 2 to 4 short phrases, each replacing the last on its spoken word, ending on ONE payoff word | each phrase: opacity 0 -> 100 on frame one and **scale 0 -> 111 -> 93 -> 105 -> 98 -> 101 -> 100 over 0.15 s** (elastic), white, at **~85 percent** height · the payoff word goes big, centred, accent colour with a glow (2023 green `#20F91A`), with the keyword-pop jiggle, held ~1 s | the phrases are SILENT; `cash-register-2` ON the payoff word when it means money / scale |
| **`kt-lower-third-band`** | a 2 to 3 line statement that needs ~4 s under the picture | a dark textured band over the **bottom 35 percent (373 px)** slides up from below to flush in **0.27 s ease-out** · **0.13 s later** the text does the keyword-pop pop, then the side-panel HOVER for the whole hold · after ~4 s band and text **slide back down over 0.9 s** (the only device with an exit) | `swoosh-4` starting **0.34 s BEFORE** the band moves, `knock-pop` ON the text; the slide-out is silent |
| **`kt-signature-open`** (composite: the hook line of a head-to-head video, growth-vs-product 2026-10-22) | the two role labels pop in beside the face while the hook names them | frame 0: `kt-whip-cut` IN onto the face (the open's 0.73 s whip + 25 -> 0 degree roll) · a slow punch-in (~5 percent over the line) while the two names are said · ROLE LABEL A does the `kt-keyword-pop` motion on the RIGHT THIRD ON the first role's name (two lines, the role words in that role's accent, the shared noun white, drop shadow) · ROLE LABEL B pops stacked BELOW it ON the second role's name (2023: 0.60 s later) · both hold to the end of the line · `kt-whip-cut` OUT into the next beat (the blur-in variant) | `swoosh-4` file start at frame 0 (its 0.23 s attack peaks inside the whip) · `cash-register` starting **0.17 s BEFORE** label A so the bell lands on it · `wooden-rattle-whoosh` ON label B · `whoosh-4` ON the whip-out. 2023 reference: 0.00 / 1.83 / 2.43 / 3.13 of main-sequence.mp4 (the cue sheet in the kinetic-text folder). The two label sounds are the ROLES' signatures: they fire again whenever the same labels return as pops (a role-label card), never inside a side panel |
| `kt-whip-cut` (transition) | every angle change / face <-> b-roll cut in 2023 | incoming shot **scale 200 -> 100 + curvature -100 -> 0 over 0.37 s** (the open: 0.73 s with a 25 -> 0 degree roll) · blur-in variant 0.17 s: gaussian blur 800 -> 0, chromatic aberration -60 -> 0, scale 120 -> 100, a half-frame vertical offset smearing in | `whoosh-4` ON the cut (default), `fast-reverse-1/5` variety, `fast-reverse-2` onto a chapter's first band, `swoosh-8` chapter-level |

- **Placement.** `kt-side-panel` and `kt-lower-third-band` are PANELS: they sit above the b-roll / container layer and below captions;
  on a COVER beat they ride on top of the container (the panel is then the container's label, not a second container). The
  `kt-keyword-pop` text lands in the caption zone, so **captions are OFF for the hold of a keyword pop** (never a caption and a pop
  stacked). Each sound is cut with its `attack_sec` on the frame named in the table (`library.json` carries the measured attack).
- **House adaptation.** Keep the motion numbers and the sound pairing exactly. Panel and band colours come from the video's chapter
  accent, the text uses the house display font, and the face shift of `kt-side-panel` is only done when a face is on screen (on a
  cover beat the container is reframed into the free 55 percent instead).
- **Variety and restraint.** A device set is a CHAPTER-level decision written in the SCREENPLAY (`[SHOW]` lines name the device id and
  its sound) so the coverage strategist and the edit-plan author place them (EDIT-PLAN rows `[KT-PANEL]` / `[KT-POP]` with their
  `[WHOOSH]` / `[ACCENT]` sound rows and a `## KINETIC TEXT` CUE-SHEET section, the kcc20 shape; `kt-signature-open` is written as
  its parts: two `[KT-POP]` label rows between a `[TRANSITION]` whip-in and whip-out), and the comp-builder builds them (reference
  implementation `KtSidePanel` / `KtKeywordPop` in `remotion/src/Kcc20Charts.tsx`, COPIED into the project's own file, never imported); the 2023 video used them on every line, a house video uses
  them on the lines that carry a label or a verdict. `minecraft-damage` at most once per video.
- **Verify on a CHUNK:** render the 10 s chunk around each device: the sound's attack lands on the frame the table says, the pop smears
  for 2 to 3 frames then holds, the hover is visible but never reads as a jitter, nothing else fires on the same frame.
- **The 007 devices of the same theme (added 2026-10-31 from Mike's 2023 "Skills of a Growth Engineer"; numbers in the library, time
  map = the second section of the theme's CUE-SHEET.md; no engines yet, the comp-builder builds them to the row):** the same placement
  rules. EDIT-PLAN rows: `[KT-CAPTION]` for `kt-caption-highlight` (one row per phrase, ON its first spoken word; it IS the caption, the
  house caption track is OFF for its span), `[KT-TYPE]` for `kt-typewriter-card` (a COVER beat: card push-in, one sub-row per wiped
  line with its `typing` slice, the key-phrase pop, the push-out), `[KT-STACK]` for `kt-stacked-list-over-broll` (headline row, then one
  row per item ON its word with its fast-reverse-5), `[KT-STATEMENT]` for `kt-statement-over-broll` (one row, the hold), `[KT-WALL]` for
  `kt-text-wall` (a COVER beat, 3 to 4 s, the red word's row inside it), `[KT-SPARK]` for `kt-keyword-sparkle` (ON the key word, with
  `ting`), `[TRANSITION] hand:kt-push-slide` for the push cuts (bucket 3, like `kt-whip-cut`), and the variants ride on their parent's row
  tag (`[KT-POP] chip`, `[KT-HEADLINE] zoom_drop`, `[KT-ICON] image_sticker`, `[KT-CTA] bar`). Captions OFF under a chip, a pop and the
  wall; the statement and the typewriter card carry their own words.
- **Theme `halloween-2022`** (the 2022 "Bear Markets" horror look, picked for a horror / Halloween register; rows `hw-*` in the
  effects library, engines `remotion/src/effects/halloween-2022/`, time map `assets/effects/themes/halloween-2022/CUE-SHEET.md`):
  the same placement rules. The `[SHOW]` line names the device id and, only if the screenplay pairs one, a catalog sound (the
  source fired none except `woosh9` under `hw-subscribe-like-bell`). EDIT-PLAN rows: `[HW-POP]` per word of `hw-word-pop` (ON
  the spoken word; captions OFF under it), `[HW-MONTAGE]` for `hw-zoom-slideshow` / `hw-blood-promo` (a COVER beat, the
  narration runs under it), `[HW-SHAKE]` for `hw-camera-shake` (a FACE window after a montage / cut-away, starting and stopping
  with the shot), `[HW-PUNCH]` for `hw-drop-bounce` / `hw-zoom-punch` (on the jump cut), `[HW-CTA]` for `hw-subscribe-like-bell`.
  The look's splits and pumpkin stinger are TRANSITIONS rows (`[TRANSITION]`). `hw-keyed-presenter` is never placed (house rule:
  never key or matte Mike's face).

<!-- Future overlays (film grain, vignette, light flares, scanlines, etc.) get their own numbered rule here,
     each stating: trigger · look · placement (how it relates to transitions/cuts) · verify. -->
