# effects/: shared motion engines of the EFFECTS library

Skill: `video-creation/skills/effects-library/effects-library.md`. Catalog of record: `video-creation/assets/effects/library.json`
(a device = motion + sound + graphics; each device row names its engine here, e.g. `"engine": "kinetic-text/KtSidePanel.tsx"`).
Shared infra: project comps import from `./effects/...` (whitelisted by `lint_comp_imports.py`); nothing here imports a
project file, and every number of a row is a prop with the row's value as default (font and colours too: a house video
passes its own display font and chapter accent).

## kinetic-text/ (theme `kinetic-text-2023`)

| file | what |
|---|---|
| `types.ts` | `KtCommon` props (`t0`, `t1` in seconds on the comp clock, `font`, `accent`, `textColor`, `motionBlur`), `KtSoundCue`, the 2023 look `KT_2023` |
| `clock.tsx` | `KtClock` context `{t}` the comp provides (e.g. SOURCE-spine seconds held in a pause); engines fall back to frame / fps |
| `motion.ts` | the shared curves: the 110 jiggle pop, the elastic 0 -> 111 -> 93 -> 105 -> 98 -> 101 -> 100 bounce, the hover, the side-panel rise, the measured whip-zoom table, the `influence 32.5 -> 100` ease (`Easing.bezier(0.325, 0, 0, 1)`) |
| `blur.tsx` / `lens.tsx` / `text.tsx` | multi-sample shutter blur + directional blur; Premiere lens curvature on the shared transitions displacement map; the `*key*`-markup text block |
| `sfx.ts` / `sound.tsx` | SFX catalog lookups (file, attack) + `<KtSfx>` that places a device's sound cues |
| `Kt<Device>.tsx` | one engine per device + its `kt<Device>Sounds()` helper (the motion + sound pairing in code) |
| `registry.ts` | device id -> engine (read from the catalog's `engine` field) and -> sound helper |

A comp uses an engine in three lines (inside its `<KtClock.Provider value={{ t }}>`):

```tsx
import { KtKeywordPop, KtSfx, ktKeywordPopSounds, ktSfxFile } from './effects/kinetic-text';
<KtKeywordPop t0={12.23} t1={14.4} lines={['TACTICS THAT', 'GUARANTEE ATTRIBUTION']} font="'Playfair Display'" accent="#ffd700" />
<KtSfx cues={ktKeywordPopSounds({ t0: 12.23, meaning: 'neutral' })} src={(id) => staticFile(`sfx/kinetic-text/${ktSfxFile(id)}`)} />
```

Picture moves that belong to the COMP (its own footage layer) come as helpers: `ktSidePanelShift()` (the -80 px / 120
percent face shift, the paper panel's b-roll translate), `ktBandFaceLift()`; `KtWhipCut` wraps the incoming clip.
Assets come in as props (`textureSrc`, `paperSrc`, `buttonSrc`, `arrowSrc`), resolved in the comp's own public dir.

## halloween-2022/ (theme `halloween-2022`, Bear Markets 2022, 0:00-1:50)

Same contract (every row number a prop with the row's value as default, `t0` / `t1` in comp-clock seconds read through the
kinetic-text `KtClock`, each engine paired with a `hw...Sounds()` helper whose cues `KtSfx` places). The fonts and colours
are this theme's LOOK, so they are the defaults (Showcard Gothic #27FF14, Lato 900 for the template's Lato-Heavy, Montserrat
900 #E60003, Times New Roman for the missing aAntaraDistance serif): the comp loads Lato 900 + Montserrat 900 (Google Fonts);
Showcard Gothic is an installed system font.

| file | what |
|---|---|
| `types.ts` / `motion.ts` | the 2022 look `HW_2022`; the curves (word pop 75 -> 115 x 110 -> 100, drop bounce, zoom punch ease, expo ease-out) |
| `sfx.ts` | lookups over the ROOT SFX index (`assets/sfx/library.json`, any catalog id: `hwSfxPath`, `hwOnFrame`, `hwPaired`) |
| `media.tsx` | `HwVideoAt` (a source second, offset via trimBefore so it is never clamped by the comp length), `HwAlphaPlate` (FILL + KEY alpha plate, blend modes), `LumaMatte` (luma-matte compositing for the t_* plates), `Offset` (wrap), `HwLookLayer` (colour / B&W / grid / dim / red Tint panel treatments), `ChannelPlate` |
| `HwWordPop.tsx` | `hw-word-pop` (SVG text on its baseline, the non-uniform pop about (960, 940), 360-degree shutter) |
| `HwZoomSlideshow.tsx` | `hw-zoom-slideshow` (N photos; the four measured shot types cycled; `speed` 0.8278 = the 2022 timing) |
| `HwSplitPanels.tsx` / `HwBloodTitle.tsx` / `HwBloodPromo.tsx` | `hw-split-panels` (diagonal / vertical), `hw-blood-title` (+ `HwBloodSplat`, `HwBloodTitleText`), `hw-blood-promo` (scenes) |
| `HwCameraShake.tsx` | `hw-camera-shake`: places the TRANSITIONS rows `motion-shake-optics-2x-long` / `-3x-long` (engine `MotionShake`) on a face window; the comp's public dir must carry `transitions/lib/shake/*.json` |
| `HwDropBounce.tsx` / `HwZoomPunch.tsx` | picture-move wrappers around the comp's footage |
| `HwSubscribeLikeBell.tsx` | the Scene_19 MOGRT plate at (960, 934), 1.0667x, + woosh9 at +0.133 s |
| `registry.ts` | device id -> engine / sound helper (`hwEngineFor`, `hwSoundsFor`); `hw-keyed-presenter` has none (house rule) |

```tsx
import { KtClock, KtSfx } from './effects/kinetic-text';
import { HwWordPop, hwWordPopSounds, hwSfxPath } from './effects/halloween-2022';
<HwWordPop t1={19.6} words={[{ t: 16.933, t1: 17.367, text: 'All-time' }]} />
<KtSfx cues={hwWordPopSounds({ words, pair: undefined })} src={(id) => staticFile(`sfx/${hwSfxPath(id)}`)} />
```

The alpha plates and the blend-mode composites draw against the layers rendered before them: keep them in the same stacking
context as the footage they cover (no transform / opacity / filter wrapper between them and that footage).

## Demo

`src/EffectsDemo.tsx` (composition `EffectsDemo`, props `id` + optional `variant`) renders one device over a face or b-roll
stand-in with its sounds. ALWAYS pass the minimal public dir (the project config defaults to the whole assets tree):

```
cd video-creation/remotion
npx remotion render src/index.ts EffectsDemo ../assets/effects/_demo/kt-side-panel-dark.mp4 --props='{"id":"kt-side-panel","variant":"dark"}' --public-dir ../assets/effects/_demo/pub --concurrency 4
```

Variants: `kt-side-panel` dark | paper | paper-label · `kt-keyword-pop` jiggle | punch-red | punch-white · `kt-whip-cut`
default | open | blur-in · `hw-split-panels` diagonal | vertical. The `hw-*` demos use the bench's licence-clean Envato
items 12-14 (`_demo/pub/demo/halloween-2022/`, never a bear). Review page: `video-creation/assets/effects/_demo/gallery.html`.
