# effects-library: an effect is motion + sound + graphics, grabbed as ONE unit, from a THEME

_Canonical, track-agnostic. Siblings: `../sfx-library/sfx-library.md` (owns the SOUND files), `../music-sourcing/SKILL.md`
(music), `../../assets/transitions/README.md` (transitions fire AT a cut; effects live OVER sustained footage). Mike,
2026-10-25: "I started to copy things from this video and put it into a library in the sfx folder but now I realize that
they are just effects, regardless of sound or not."_

## 1. The model

- **An EFFECT = a DEVICE.** One motion recipe + the sound(s) that fire with it (with the sound-to-motion offset) + the
  graphics it needs (a texture, an icon, a button animation). It is picked and placed as ONE thing: never the motion
  silent, never the sound on a static card, one sound per event, never two stacked. (Exception by source: a device its
  source fired SILENT, as most of `halloween-2022`, stays silent unless the screenplay pairs a catalog sound with it.)
- **Devices belong to a THEME.** A theme is the set of devices, palette, textures, graphics and sounds that make one
  look (first theme: `kinetic-text-2023`, Mike's 2023 "Growth Marketer vs Growth Hacker" video; second: `halloween-2022`,
  his 2022 "Bear Markets" video; third: `elegant-promo-2022`, the "Elegant Promo" AE montage in his 2022 "European Energy
  Crisis" video). **A video picks ONE theme and declares which of its devices it uses; a longer video may
  pick a theme per CHAPTER.** Flourishes inside a theme (the icons, the scatter words) are a per-video decision written in
  the screenplay, never sprinkled across every video by default.
- **Which theme:** `kinetic-text-2023` for a bright head-to-head / straight-to-the-point explainer; **`halloween-2022` for
  a horror / Halloween register** (a scary, high-stakes explainer); **`elegant-promo-2022` for a serious news-promo run of
  2 to 4 dated or labelled fact cards** over photos or footage (cool and measured, never loud). One theme per video or per chapter, never two themes
  mixed inside one chapter. Each theme row's `rule` says how it is used whole.
- **The catalog of record is `video-creation/assets/effects/library.json`**: `devices` (keyed by id, the motion numbers at
  1920x1080, the sound ids and offsets, the asset paths, the source-video cues) + `themes` (keyed by id: source, look,
  cue sheet, textures, graphics, the device list, the rule for when to pick it). Theme files live beside it:
  `assets/effects/themes/<theme>/CUE-SHEET.md` (the time-ordered map of the source video), `textures/`, `graphics/`.
- **Sounds stay in the SFX catalog** (`assets/sfx/<set>/library.json`, every file a row, `sfx_catalog.py check`). A device
  names its sounds by catalog id; the edit plan's `[WHOOSH]` / `[ACCENT]` rows name the same id. The 2023 set is
  `assets/sfx/kinetic-text/`, the 2022 set `assets/sfx/halloween-2022/`, each row carrying `device`.
- **Motion engines are shared Remotion code** in `video-creation/remotion/src/effects/<theme>/` (one component per device,
  parametric, imported by the comp; `lint_comp_imports.py` whitelists `./effects/*`). A device row names its `engine`
  file once one exists; until then the comp-builder builds the device in the project's own file to the row's numbers
  (never copied from another project's comp, memory `feedback_no_remotion_comp_references`).
- **Placement rules are per track.** longform-edited: `video-creation/longform-edited/skills/overlays/overlays.md` section 2
  (layer order, captions OFF under a pop, overlay vs transition, how a `[SHOW]` device line becomes `[KT-*]` rows in
  the EDIT-PLAN and a `## KINETIC TEXT` CUE-SHEET section; `[HW-*]` rows for halloween-2022). Shorts reuse the same
  devices through their own comp.

## 2. The tools

```
python video-creation/skills/effects-library/scripts/effects_gallery.py [--force] [--theme <id>]   # the BROWSE dashboard (Mike, 2026-10-31):
                                                                                   # assets/effects/browse/gallery.html -> one card per theme
                                                                                   # (by its `label`: Energetic, Halloween horror) ->
                                                                                   # browse/<label>/gallery.html = one card per device and
                                                                                   # per sub-variant, each with PLAY buttons: the engine's
                                                                                   # demo render (approved) AND the source-video excerpt at
                                                                                   # its `browse_cues`, both with sound; excerpts are cut
                                                                                   # once from the theme's `sources` videos (gitignored
                                                                                   # mp4s, tracked html), mirrors assets/transitions/browse/
python video-creation/skills/effects-library/scripts/effects_catalog.py check      # EFFECTS-CATALOG PASS|FAIL: every device's
                                                                                   # sound ids exist in the SFX index, every asset
                                                                                   # path and engine file exists, every device has
                                                                                   # exactly one theme; PENDING rows are WARNs; a
                                                                                   # `house_rule_conflict` row is DOCUMENTATION ONLY
                                                                                   # (WARN, and FAIL if it names an engine)
python video-creation/skills/effects-library/scripts/effects_catalog.py report [--theme <id>] [--grep <text>]   # the picker's view
python video-creation/skills/effects-library/scripts/effects_catalog.py engines    # which devices have a shared engine
```

Run `check` after editing the library, adding a sound a device names, moving a texture, or landing an engine; run the gallery after
adding a device, a `browse_cues` window or a demo render (it skips excerpts already cut; `--force` re-cuts them).

- **A theme has a `label`** = the name Mike thinks of the look by ("Energetic" = `kinetic-text-2023`, "Halloween horror" =
  `halloween-2022`); the id is the stable key every engine, doc and screenplay names, the label is what the dashboard, the reports and
  new screenplays say. A theme's `sources` are its source videos keyed by a short name (`main`, `skills`, `hw`) with the video path, the
  duration and the project; a device's `browse_cues` are `[{src, t0, t1, label}]` windows of those videos = what the dashboard plays
  as "source". A theme can have MORE THAN ONE source video (Energetic has 004, 005 and 007): the later source adds devices and variants to
  the same theme, it never starts a second theme (Mike, 2026-10-31: "it's all the same theme").

## 3. Picking (the screenplay step)

1. Pick the THEME for the video (or per chapter): `report --theme <id>` reads the rule and the device list.
2. For each line that carries a label, a verdict, a list, a headline word or the close, pick the DEVICE by its
   `trigger` (what the text does), then its SOUND by meaning from the device row (neutral / negative / money /
   positive / impact). Write it on the 🎬 `[SHOW]` line: device id + sound id.
3. Keep the theme's MOTION and SOUND pairing exactly; colours and typeface are the house look (house display font,
   the chapter accent) unless the video is a deliberate remake of the source look. `halloween-2022` IS such a look: its
   fonts and colours (Showcard Gothic #27FF14, Lato-Heavy, Montserrat Black #E60003, the blood plates) stay. A device that
   was silent in its source stays silent unless the [SHOW] line pairs a catalog sound (written there, by id).
4. The edit-plan author places every named device at the spoken word's onset (overlays.md section 2); an unplaced
   device is an orphan, exactly like an unplaced asset.
5. **An After Effects template device is OPTIONAL and never blocks a run (Mike, 2026-11-10, AI vs ML: "if there is any issue
   with using that effect, I don't want that to become a blocker. The effect is not worth it").** This covers `kt-wave-wall`,
   `kt-text-wall`, `kt-boxed-words`, `kt-emoji-pop`, `hw-subscribe-like-bell` and any later device whose `build` says render the
   template. Builders render with headless `aerender` only. Never open the After Effects app (`AfterFX.exe` / `AfterFX.com -r`,
   which pops the UI on Mike's screen), and never iterate on a template. If the one headless render fails or the template
   misbehaves, drop the device and use the COVER-PLAN `bench` for that beat, say so in the builder's report, and move on.
   Put a rendered template clip under `assets/kt-renders/`, not in a reconciled asset folder (an mp4 in `card-slides/` is
   an orphan for `verify_assets`).

## 4. Adding a device or a theme

1. A NEW DEVICE from a source video: read its keyframes from the source PROJECT (never eyeball a render for numbers),
   convert to 1920x1080 and seconds, write the row (`name` · `trigger` · `motion {sub-steps}` · `text_look_<source>` ·
   `assets {}` · `sound [{id, when}]` or `sound_by_meaning` · `reference_cues_main_sequence` · `used_in`), add its id to
   the theme's `devices`, add any new sound to the SFX catalog FIRST (`sfx_catalog.py build && check`), drop its
   textures / graphics under the theme folder, `effects_catalog.py check`.
2. A NEW THEME: `themes/<id>/` with `CUE-SHEET.md` (the time-ordered sound -> visual map of the source), `textures/`,
   `graphics/`; a `themes` row (source, look, cue_sheet, textures, graphics, devices, rule); its sound set as its own
   folder under `assets/sfx/` (`sfx-library.md` section 3).
3. A NEW ENGINE: `remotion/src/effects/<theme>/<Device>.tsx`, parametric (every number from the row is a prop with the
   row's value as default), plus a row in the theme's demo comp; set `engine` on the device row; `check` must PASS.

## 5. State (2026-11-09)

- **NEW THEME `elegant-promo-2022` (label "Elegant promo", Mike's to rename) captured 2026-11-09: the "Elegant Promo" After Effects
  montage (a Motion Array template, 3 of its 12 scene slots) in Mike's CodeMonkey 043 "European Energy Crisis in 2022 Explained" at
  1:07.200-1:27.020, ONE clip on V4 of `energy-crisis-final.prproj`. FIVE devices, NO ENGINE YET (the comp-builder builds them to the
  row): `ep-elegant-promo` (the composite: one picture per 7.007 s slot, slow push-in, white accents) and its parts `ep-iris-open` (a
  pinpoint circle opens the first picture out of a navy field), `ep-circle-burst` (six staggered circles carry the next picture in: the
  scene change), `ep-disc-sweep` (two translucent magenta discs scale in from beyond a corner or the top edge) and `ep-label-title`
  (teal-to-blue bar wipe, Roboto Black title tracking in, Roboto Regular caps sub-line). As for halloween-2022's templates, the AE
  keyframes live in the binary .aep, so every motion number was MEASURED on the clean render (`_source/render/Main-avi-crf6.mp4`:
  radial profiles, circle fits, colour masks, feature tracking) at the template's own pace; the Premiere placement (scale 201 percent,
  speed 118.96 percent, no transitions) and the bed level were read from the .prproj; text, fonts and the 8 Control colours from the
  .aep strings (Mike kept the template palette: magenta #C3264B, plum #1C0924, teal #38C1A9, blue #135FB5, navy field #04090F as
  rendered). Two facts the brief had wrong: the clip is rate-stretched, so the whole 23.657 s render plays (only its last 0.079 s is
  unused), and the 4K excerpt starts at main 57.057, not 58.0. SILENT in its source (no SFX in the window; `_source/sfx/` is reference
  only, nothing added to the SFX catalog); the 043 bed is `leatherface` (intro cut) at 0 dB clip level, ~7 dB under the voice. Time map
  `themes/elegant-promo-2022/CUE-SHEET.md`; sources `themes/elegant-promo-2022/_source/` (copied from the E: drive, now unplugged: the
  only local copies, gitignored); browse page `browse/elegant-promo/gallery.html` (14 source excerpts). Pick it for a serious
  news-promo run of 2 to 4 dated or labelled fact cards; first use planned: a serious, slow-paced AI-jobs video on the crypto channel.

## 5c. State (2026-11-09)

- **THIRD source of `kinetic-text-2023` ("Energetic") captured 2026-11-09: Mike's 2023 "How to choose between Growth Marketing and Growth
  Hacking" (GrowthMarketingMike 005, 1:09), decoded from `Delivery/Copied_choose revision/choose revision.prproj` (8 video + 6 audio tracks,
  16 nested sequences; the named Transform presets carry their own keyframes, all read). ELEVEN new devices, NO ENGINE YET (the
  comp-builder builds them to the row): `kt-versus-stack` (A / VS / B dropping in over the face under a dark-teal matte, whoosh-4 each),
  `kt-spin-cut` (the 0:27 "vortex": a full 360 in 5 to 8 frames, mirror-tiled, shutter 260), `kt-wave-wall` (the Scene_22 MOGRT, two phrases
  in alternating outlined / green rows: RENDER the template like `kt-text-wall`), `kt-meme-inset`, `kt-emoji-pop` (Smiles.aegraphic),
  `kt-boxed-words` (the Scene_11 MOGRT: CAN / SHOULD), `kt-camera-wobble` (a modifier: the 13-key 8.6 s drift every held card floats on),
  `kt-snap-zoom` (face jump cuts 100 <-> 120 / 130 in 2 frames), `kt-shake-cut`, `kt-grid-zoom-in` (the open) and `kt-topic-backdrop`
  (DOCUMENTATION ONLY: it keys the face). SIX variants: `kt-statement-over-broll.paper`, `kt-lower-third-band.verdict_pop`,
  `kt-side-panel.snap_reframe`, `kt-whip-cut.offset_pan`, `kt-caption-highlight.payoff_120`, `kt-icon-pop.cutout_sticker`. ONE new sound:
  `punch-2-2023` ("Punch 2.mp3", shared by 004 and 005; the catalog had logged it as a byte-twin of Punch 1 because the sizes match,
  but it is a different, louder hit, so 004's TECHNICAL SKILLS pop now names it too); every other 005 sound byte-matches the catalog. The bed
  was `concrete-mazes` at -15 -> -23 dB. "The aqua background" Mike asked about is the
  turquoise suede already in `textures/` (the 004 file): in a house video it backs the cards, panels and the versus stack, never a keyed face.
  Time map: the third section of `themes/kinetic-text-2023/CUE-SHEET.md`. The three template / texture files (the glitch-noise texture, Scene_11's .aep, the Smiles
  pack) were copied from D: once it was back, and the browse page carries the 005 excerpts. First video to pick from it: `longform-edited/media/AI vs ML` (AI Engineering channel).

## 5b. State (2026-10-31)

- **Second source of `kinetic-text-2023` ("Energetic") captured 2026-10-31: Mike's 2023 "Skills of a Growth Engineer" (GrowthMarketingMike
  007, 1:13), decoded from `Delivery2/Skills GM_1_1.prproj` (9 video + 5 audio tracks, 13 nested sequences; the AE templates measured on
  the render as the halloween ones were). SEVEN new devices, all keyframe-read, NO ENGINE YET (the comp-builder builds them to the row):
  `kt-caption-highlight` (the running caption line, hard cuts, lime key word, `open_stretch` on the first), `kt-typewriter-card` (paper
  card, lines wiped in left to right under `typing`, the key phrase pops blue on cash-register), `kt-stacked-list-over-broll` (headline +
  sub-line + skew-pop items on fast-reverse-5), `kt-statement-over-broll` (5 hovering lines over a 55 percent white matte),
  `kt-text-wall` (the Monument Extended MOGRT + the red punch word), `kt-keyword-sparkle` (a cartoon star burst on a caption word, ting),
  `kt-push-slide` (the 3-frame push cut, bucket 3). FOUR variants on existing rows: `kt-keyword-pop.chip` (a boxed label rising from
  below on cartoon-accent), `kt-headline-over-broll.zoom_drop` (250 -> 100 in 3 frames), `kt-icon-pop.image_sticker` (a picture on the
  chest / an animated sticker; the Wikimedia brain GIF is CC BY-SA, attribution required), `kt-subscribe-close.bar` (the keyed like /
  SUBSCRIBE / bell bar with its own click track + `mouse-click` on the playlist line). New theme assets: `textures/chevron-gray.webp`,
  `graphics/subscribe-bar-fill|key.mp4`, `graphics/thinking-brain-sticker.gif`, `graphics/_source/` (the AE templates, reference only).
  New sounds in `assets/sfx/kinetic-text/`: `typing`, `mouse-click`, `subscribe-bar-clicks`. Time map: the second section of
  `themes/kinetic-text-2023/CUE-SHEET.md`. The 007 bed was `get-it` (Raw Lew) at -20 / -25 dB, in the music library.
- **The browse dashboard** (`effects_gallery.py`, section 2) built the same day: `assets/effects/browse/gallery.html`, every device of both
  themes with its demo render and its source excerpt playable in place.
- First video to pick from the widened theme: `longform-edited/media/lets-get-rich` (crypto channel, 2026-10-31).

## 5a. State (2026-10-25)

- Theme `kinetic-text-2023`: 10 devices catalogued (`kt-signature-open` is a composite written as its parts, overlays.md
  section 2), ALL with keyframe-read numbers: the six read 2026-10-21 (side panel, keyword pop, headline over b-roll,
  word-by-word, lower-third band, whip cut) and the ones read 2026-10-25 from Mike's cues (`kt-list-card`, `kt-icon-pop`,
  `kt-subscribe-close`, `kt-scatter-words`, the band's `text_swap`, the side panel's `paper` variant, the keyword pop's
  `punch`). The 2023 icon artwork does not survive (the .aegraphic templates are AE shape layers only): a video that
  uses `kt-icon-pop` renders its own flat SVG icons to the row's sizes.
- Engines: ALL TEN promoted 2026-10-25 to `remotion/src/effects/kinetic-text/` (parametric, every row number a prop with the
  row's value as default; `KtClock` context for the comp clock; each engine exports a `kt...Sounds()` helper so a comp gets
  motion + sound together); demo comp `EffectsDemo` (prop `id`) in Root.tsx; 16 demo clips with sound + `gallery.html` in
  `assets/effects/_demo/` (render with `--public-dir assets/effects/_demo/pub`, NEVER the whole assets tree: 8.5 GB copy).
  Approximations noted in the README there: lens curvature capped at -60 (shared displacement map), the Ultra Key green
  key, measured text sizes where a row gave none. **APPROVED by Mike 2026-10-25 ("I approve of everything in the demo. I like
  what I see"): the 16 demo clips are the reference renders of the theme.** That approval settles the sound rule: a sound
  marked "ON the frame" is placed so its loudest sample (the catalog's `attack_sec`) lands on the frame, so a slow-attack
  file (twinkle, minecraft-damage, ea-glitch-21) STARTS 0.7 to 0.9 s before the frame. Never start-on-frame.
- First video on the full theme: `longform-edited/media/inference` (AI Engineering channel).
- Theme `halloween-2022` (added 2026-10-25, NOT yet reviewed by Mike): the look of "Bear Markets" (CodeMonkey 044), studied
  0:00-1:50 ONLY (Mike's hard rule: nothing after 1:50 of that video is reviewed, extracted or imitated). Time map
  `themes/halloween-2022/CUE-SHEET.md`, b-roll bench `BROLL-BENCH.md` (bears excluded; shots 15-17 DO NOT REUSE unless Mike
  clears them; 18, the alamy photo, NEVER). 10 rows: `hw-word-pop` (green Showcard Gothic word pop), `hw-zoom-slideshow`
  (the "Zooming Dynamic Slideshow" AE montage), `hw-blood-promo` + its parts `hw-split-panels` / `hw-blood-title` (the
  "Halloween Party Promo" AE montage), `hw-camera-shake` (the FACE-hold Motion Shake Optics: its data is the TRANSITIONS rows
  `motion-shake-optics-2x-long` / `-3x-long`, engine `MotionShake`), `hw-drop-bounce` (Finzar "Down"), `hw-zoom-punch` (Finzar
  "1. Zoom IN"), `hw-subscribe-like-bell` (the Scene_19 MOGRT, rendered with aerender, + `woosh9`) and `hw-keyed-presenter`, a
  DOCUMENTATION-ONLY row (`house_rule_conflict`: never key or matte Mike's face; no engine; the check prints it as such).
  Premiere numbers are keyframe reads; the two AE templates' motion is measured on their renders by feature tracking (their
  keyframes live in the binary .aep); the promo's panel stack is fitted to frames. Its fonts and colours ARE the look (a
  halloween-2022 video keeps them). Sounds: `assets/sfx/halloween-2022/` (`woosh9` only: every other device was SILENT in the
  source; the screenplay may pair a catalog sound, the sound helpers take it as `pair`). Engines: ALL NINE buildable devices
  in `remotion/src/effects/halloween-2022/` (same pattern: every row number a prop, KtClock, `hw...Sounds()`); alpha plates
  are FILL + KEY H.264 pairs composited with blend modes (`HwAlphaPlate`); 11 demo clips (9 devices, split panels in 3 variants) in `assets/effects/_demo/`
  (`hw-*.mp4`, in `gallery.html`).
