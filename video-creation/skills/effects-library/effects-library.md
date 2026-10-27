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
  his 2022 "Bear Markets" video). **A video picks ONE theme and declares which of its devices it uses; a longer video may
  pick a theme per CHAPTER.** Flourishes inside a theme (the icons, the scatter words) are a per-video decision written in
  the screenplay, never sprinkled across every video by default.
- **Which theme:** `kinetic-text-2023` for a bright head-to-head / straight-to-the-point explainer; **`halloween-2022` for
  a horror / Halloween register** (a scary, high-stakes explainer). One theme per video or per chapter, never two themes
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

## 2. The tool

```
python video-creation/skills/effects-library/scripts/effects_catalog.py check      # EFFECTS-CATALOG PASS|FAIL: every device's
                                                                                   # sound ids exist in the SFX index, every asset
                                                                                   # path and engine file exists, every device has
                                                                                   # exactly one theme; PENDING rows are WARNs; a
                                                                                   # `house_rule_conflict` row is DOCUMENTATION ONLY
                                                                                   # (WARN, and FAIL if it names an engine)
python video-creation/skills/effects-library/scripts/effects_catalog.py report [--theme <id>] [--grep <text>]   # the picker's view
python video-creation/skills/effects-library/scripts/effects_catalog.py engines    # which devices have a shared engine
```

Run `check` after editing the library, adding a sound a device names, moving a texture, or landing an engine.

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

## 5. State (2026-10-25)

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
