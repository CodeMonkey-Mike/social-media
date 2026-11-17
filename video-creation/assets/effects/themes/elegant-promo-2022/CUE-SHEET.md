# elegant-promo-2022 cue sheet: the time-ordered map of European Energy Crisis 1:07.200 to 1:27.020 (CodeMonkey 043)

_Theme `elegant-promo-2022` ("Elegant promo", label proposed 2026-11-09, Mike's to rename) of the EFFECTS library
(`video-creation/assets/effects/library.json`). Written 2026-11-09 from the Premiere project (every clip in the window read
from the XML) and from MEASUREMENTS of the After Effects render (the template's keyframes live in the binary .aep, so its
motion was measured on the clean render, as for `halloween-2022`'s two AE templates). The device NUMBERS live in
`library.json` (`devices.ep-*`); this file is the TIME MAP._

- Source: Mike's CodeMonkey 043 "European Energy Crisis in 2022 Explained" (rendered 2022-10-21, 3840x2160, 29.97 fps,
  10:35). Timeline of record: `_source/prproj/energy-crisis-final.prproj` (saved 2022-10-21 00:29, the render's project).
  `energy-crisis-final_1.prproj` (2023-02-12) and `energy-crisis-final_1_1.prproj` (2023-11-11) are re-saves, identical
  in 66-88 s; `energy-crisis.prproj` (2022-10-31) is a later re-cut (everything +0.2 s, no Main.avi in this window).
- The montage: ONE clip on V4, `final\Main.avi` = the render of the comp `Main` of the Motion Array template
  "Elegant Promo" (`_source/ae/Elegant Promo/Elegant Promo (converted).aep`, Mike filled 3 of its 12 scene slots).
  Measured on `_source/render/Main-avi-crf6.mp4` (the clean 1920x1080 render, 709 frames, 23.657 s, no audio).
- **Three time bases.** `main` = seconds in the main sequence (= the published video, `_source/video/043-energy-crisis-low-res-full.mp4`).
  `ex` = seconds in the 4K excerpt `_source/video/043-main-sequence-4k-0058-0132.mp4`: **its frame 0 is main 57.057, not
  58.0** (the 60.834 and 87.020 hard cuts land at ex 3.770 and 29.963), so `ex = main - 57.057`. `render` = seconds in the
  AE render = the template's own pace.
- **The clip is rate-stretched:** PlaybackSpeed 1.18960 (= 709 / 596: the 709-frame render stretched to 596 frames, then 2
  frames trimmed), source in 0.000 -> out 23.578. So `main = 67.200 + render / 1.18960`, and the WHOLE render plays except
  its last 0.079 s (section 7). Verified by matching every excerpt frame of the window to the render (within a few frames;
  the last timeline frame shows render frame ~705 of 709).
- Units: positions in **1920x1080 px** (the render's own size; Premiere scaled it 201 percent into the 4K sequence).
  Premiere audio level `dB = 20*log10(level) + 15` (the halloween-2022 decode).
- Tracks: V1 bottom ... V6 top; A1/A2 dialogue (alternating jump cuts), A3 music, A4 SFX.

## 1. What is on screen (top-most visible layer)

Scene times inside the template repeat every 210 frames (7.007 s): scene 2 = render 7.007 + scene t, scene 3 = render
14.014 + scene t. Narration from a Whisper pass on the excerpt (two mishears corrected: "price spout" = spike, "sexual
revenues" = essential revenues).

| main (s) | ex (s) | render (s) | picture | narration under it |
|---|---|---|---|---|
| 65.132-67.200 | 8.08-10.14 | | Mike seated (V2 grammar2 a-roll) | "That alone sent prices soaring high." (65.42-67.20) |
| **67.200** | **10.143** | **0.000** | **HARD CUT into the montage** (no transition): the navy field #04090F, a faint blue leak at the left edge | "But" 67.36 |
| 67.256-67.931 | 10.20-10.87 | 0.067-0.870 | **`ep-iris-open`**: a pinpoint glow at (620, 580), the first picture (armoured column) opens as a circle, edge radius 10 px (0.23) -> 174 (0.60) -> 326 (0.90), soft ~95 px halo | "when Russia invaded" 67.42-68.24 |
| 67.931-68.436 | 10.87-11.38 | 0.870-1.470 | **`ep-circle-burst`** (open variant): five more circles (top-right, top-left, a small one centre-right, bottom-left, bottom-right) take the rest of the navy; the dark leftovers read as liquid blobs | "Ukraine" 68.24-68.72 |
| 67.200-73.342 | | 0.000-7.307 | the picture pushes in all scene long (+3.8 percent a second, centred) | |
| 68.688-69.638 | 11.63-12.58 | 1.77-2.90 | **`ep-disc-sweep`** `corner_tl`: two translucent magenta discs scale in from (-333, -447) | "in February" 68.72-69.22 |
| 69.217-70.789 | 12.16-13.73 | 2.40-4.27 | **`ep-label-title`** `corner_tl`: the teal-to-blue bar wipes RIGHTWARD from x 96 (final x 96-788, y 169-259) | "of 2022," 69.22-70.18 |
| 69.781-70.899 | 12.72-13.84 | 3.07-4.40 | title **FEBRUARY 2022** fades on letter by letter in reading order, tracking closing (first letter x 262 -> 122) | |
| 69.949 / 70.176-70.848 | 12.89 / 13.12-13.79 | 3.27 / 3.54-4.34 | sub-line **THE ENERGY CRISIS IN EUROPE BEGINS** (ghost, then a left-to-right sweep) | |
| 70.815-71.319 | 13.76-14.26 | 4.30-4.90 | accent: one short white diagonal stroke shoots up-right across the lower right | "those supplies became to a complete halt" (as heard) 70.50-72.50 |
| 73.342-74.351 | 16.29-17.29 | 7.307-8.507 | **`ep-circle-burst`** (scene change): the lead circle at (1300, 500) carries scene 2 (the G7 map) in, five more circles follow; 50 percent at 73.973, 90 at 74.292; the old title is wiped with its picture | "and the energy crisis began." 72.50-74.22 |
| 74.587-75.528 | 17.53-18.47 | 8.787-9.907 | **`ep-disc-sweep`** `corner_br`: the discs scale in from (2253, 1528) | "However, just recently" 74.38-75.58 |
| 75.108-76.680 | 18.05-19.62 | 9.407-11.277 | **`ep-label-title`** `corner_br`: the bar wipes LEFTWARD from x 1821 (final x 1114-1821, y 692-783) | "the G7 group" 75.58-76.58 |
| 75.612-76.789 | 18.56-19.73 | 10.007-11.407 | title **G7 GROUP** (centred in the bar) fades on from its far end ("P" first) | |
| 76.066-76.739 | 19.01-19.68 | 10.547-11.347 | 2-line sub-line, right-aligned to x 1821: **KEEP RUSSIAN CRUDE OIL AND PETROLEUM PRODUCTS / ON THE MARKET TO AVOID A PRICE SPIKE WHILE** (the template's text box clipped Mike's longer sentence) | "of country confirmed its plan to impose a price cap on Russian oil." (as heard) 76.58-79.52 |
| ~76.6-77.2 | | ~11.0-11.8 | small white flecks near the G7 "G" (frame read) | |
| 79.233-80.241 | 22.18-23.18 | 14.314-15.514 | **`ep-circle-burst`**: the lead circle at (1300, 500) carries scene 3 (rouble bundles, footage) in; 50 percent at 79.863 | "The goal is" 79.60-80.10 |
| 80.603-81.418 | 23.55-24.36 | 15.944-16.914 | **`ep-disc-sweep`** `top_centre`: the discs scale in from (961, -925), a bowl hanging from the top edge (lowest y ~510) | "to keep Russian oil and petroleum" 80.10-81.50 |
| 80.998-82.570 | 23.94-25.51 | 16.414-18.284 | **`ep-label-title`** `top_centre`: the bar wipes LEFTWARD (final x 422-1497, y 136-227) | "on the market" 81.50-82.22 |
| 81.393-82.679 | 24.34-25.62 | 16.884-18.414 | title **ESSENTIAL REVENUES** (centred; Mike typed 9 leading spaces) fades on from its far end | "to avoid a price spike" 82.22-83.04 |
| 81.956-82.629 | 24.90-25.57 | 17.554-18.354 | sub-line **FOR ITS ECONOMY AND ITS WAR MACHINE** (centred) | |
| 82.343-83.436 | 25.29-26.38 | 18.014-19.314 | accents: thin white ring outlines (radius ~125 px) draw on and unwind at 3-4 spots in the lower half | "while depriving the country of its" 83.26-84.52 |
| 83.436-87.020 | 26.38-29.96 | 19.314-23.578 | hold: the rouble footage keeps its own pan and roll, discs + label held | "essential revenues for its economy and its war machine." 84.52-86.80 (the title landed ~3 s before its words) |
| **87.020** | **29.963** | **23.578** | **HARD CUT out**: V1 b-roll "global energy crisis related terms" (52.49 percent speed, opacity 80, 200 percent) + Mike keyed over it (V2 grammar3 green screen, 160 percent, Ultra Key) | "And in response to the price cap" 86.98-88.56 |

Narration sync: scene 1's title lands ~0.6 s after "February", scene 2's title lands ON "the G7 group", scene 3's title
lands ~3 s BEFORE "essential revenues". The template's fixed 7.007 s slot cadence was not retimed per scene: Mike stretched
the whole render to fit the window (`_source/ae/Elegant Promo/Assets/main-sequence.mp3` is a 19.7 s mixdown of main
67.19-86.9, the guide the comp was built against).

## 2. Full cue sheet (every item placed in 66-88 s, generated from the XML)

| t in -> out (s) | trk | item | src in -> out (s) | speed | motion / effects / levels |
|---|---|---|---|---|---|
| 42.075 -> 105.872 | A3 | Wicked_Cinema_Leatherface_instrumental_intro_1_24-2.wav - MUSIC: Leatherface (Wicked Cinema), instrumental INTRO cut 1:24 | 20.988 -> 84.785 | | Volume Level keys +10.0 dB @ media 0.00 -> 0.0 dB @ media 20.69, both BEFORE the in-point: the clip plays at 0.0 dB all through; track fader default (no keys) |
| 65.132 -> 67.434 | V2 + A2 | grammar2-audio-color.mp4 - Mike seated (a-roll) | 65.132 -> 67.434 | | Motion keyframed, pos (962, 543) px; on screen until 67.200 |
| 67.200 -> 70.537 | V1 + A1 | grammar2-audio-color.mp4 (a-roll jump cut, hidden under V4) | 68.769 -> 72.105 | | |
| **67.200 -> 87.020** | **V4** | **Main.avi - the "Elegant Promo" AE render (3 scenes)** | **0.000 -> 23.578** | **118.96%** | **Motion scale 201 percent, position centre, rotation 0; Opacity default (no keys); no transition at either end** |
| 70.404 -> 74.441 | V2 + A2 | grammar2-audio-color.mp4 (hidden) | 72.973 -> 77.010 | | |
| 74.207 -> 77.277 | V1 + A1 | grammar2-audio-color.mp4 (hidden) | 77.811 -> 80.881 | | |
| 77.044 -> 79.780 | V2 + A2 | grammar2-audio-color.mp4 (hidden) | 82.049 -> 84.785 | | |
| 79.513 -> 83.383 | V1 + A1 | grammar2-audio-color.mp4 (hidden) | 85.852 -> 89.723 | | |
| 83.150 -> 87.020 | V3 + A2 | grammar2-audio-color.mp4 (hidden) | 91.091 -> 94.962 | | |
| 86.853 -> 88.455 | V2 + A1 | grammar3-greenscreen-audio-color.mp4 - Mike standing, green screen (visible from 87.020) | 0.167 -> 1.768 | | scale 160 percent, pos (960, 682) px, Ultra Key |
| 87.020 -> 109.843 | V1 | 2021-2022-global-energy-crisis-related-terms-seaml-2021-11-03-00-49-12-utc.mov - b-roll | 0.000 -> 11.979 | 52.49% | opacity 80, scale 200 percent |

Nothing on V5 / V6 or A4 inside 67.200-87.020 (the next items: V4 `png3.png` 88.288, A4 `1 - swoosh - short.wav` 92.826).

## 3. Transitions (Premiere native)

None in the window: the montage cuts in and out hard. Every picture change inside it is the template's own circle burst
(`ep-circle-burst`), baked in the render.

## 4. The After Effects template ("Elegant Promo")

Read from the .aep files as RIFX chunks (comp tree, layer names, effect match names, the text documents, the Control
layer's static colours); keyframes NOT decoded.

- **Provenance:** a Motion Array template (its footage folder `(Footage)/Motion Array/03. Other/` holds the logo placeholder
  `Envato Logo Flat 2.psd`). `Elegant Promo.aep` = the template as first opened, `Elegant Promo (converted).aep` = the
  project Mike filled and rendered (2022-10-14), `Elegant Promo (converted)_AME/tmpAEtoAMEProject-Main(_1).aep` = Media
  Encoder's copies of the queued comp, `Main_1.mp4` = Media Encoder's h264 render (its audio track is SILENT).
- **Comp `Main`** (1920x1080, 29.97 fps, 23.657 s): `Control` (8 Color Controls), `Blackout`, `LEAK` (Fractal Noise, Tint,
  Exposure, Noise, 4-Color Gradient: the faint blue leak), `SC_03`, `SC_02`, `SC_01`, two unnamed footage layers.
- **12 scene slots** (folders Scene_01-12; the unfilled placeholder titles: "NO Plugins", "modern style", "EASY to
  customize", "FAST RENDERED", "COLOR CONTROL", "AE CS5.5 and above", "unique & clean", "minimal slides", "FREE FONT
  INCLUDED"). Mike's render keeps only SC_01-03; each slot is 210 frames (7.007 s).
- **Each `SC_0N`:** `Image 0N Comp` (a `Camera Control` null + `Camera 1` + 6 copies of the picture: the push-in is a 3D
  camera) · `Trans_BG 01` (6 shape layers) + `Trans_BG 01_sh` (6 shape layers, each matting a copy of the picture comp with
  a Drop Shadow, 4 with a Transform): **the circle burst** · `Shape Layer 34` (Ramp) + `Shape Layer 35` (Ramp + Drop
  Shadow): **the two discs** · `Text 01` (the title layer with Fill + Set Matte, and `Shape Layer 1` with a Ramp = **the
  label bar**) · `Text 02` (Fill: **the sub-line**) · `Logo` (Set Matte; not visible in Mike's render) · `Dots` (SC_01
  only: Fractal Noise, Mosaic, Curves, Hue/Saturation = the faint pixel blocks in scene 1's discs) · `Shape Layer 41/42`
  (43/44 in SC_03): **the white accents**.
- **Text (6 documents):** Scene_01 Text 01 "February 2022" / Text 02 "the energy crisis in europe begins"; Scene_02
  "G7 Group" / "keep Russian crude oil and petroleum products on the market to avoid a price spike while depriving the
  country of essential revenues for its economy and its war" (rendered clipped after WHILE); Scene_03 "         essential
  revenues" (9 leading spaces) / "for its economy and its war machine". All render ALL CAPS.
- **Fonts:** Roboto-Black (every Text 01), Roboto-Regular (every Text 02); Myriad-Roman and AdobeInvisFont sit in every
  document's font set as After Effects defaults and are not rendered.
- **Control colours** (static values, identical in all four .aep saves, i.e. the template defaults, kept by Mike):
  Text 01 / Text 02 / Small Text #FFFFFF · Line 01 #135FB5 · Line 02 #38C1A9 · Slide 01 #C3264B · Slide 02 #1C0924 ·
  Leaks #4378BB.
- **Footage:** `Assets/nintchdbpict000074711876.webp` (scene 1, an armoured column, 1920x1279), `Assets/6739g7.png`
  (scene 2, G7 map + flags, 838x486), `Assets/russian-ruble-money-banknote-pile-packs-2022-01-19-00-19-09-utc.mov`
  (scene 3, 3840x2160 MJPEG, 15 s), `Assets/main-sequence.mp3` (the narration guide). `Assets/group-seven-...-135503996.jpg`
  is a WATERMARKED stock picture that is not in the render: never reuse it.

## 5. Music and SFX

- Track: **Leatherface - Wicked Cinema** (Soundstripe 15092), the instrumental INTRO cut (1:24), catalogued in
  `video-creation/assets/music/library.json` as **`leatherface`** (the file is the row's section
  `Wicked_Cinema_Leatherface_instrumental_intro_1_24-2.wav`). Mood (catalog): low-energy, dark, atmospheric, scary /
  suspenseful underscore, G minor, 68 BPM.
- Placement: A3 42.075 -> 105.872, file 20.988 -> 84.785 (it plays to the file's end). Under the montage the file runs
  46.113 -> 65.933 s, inside its "bed" segment (28-86 s, building).
- Level: **0.0 dB clip level** (the +10 -> 0 dB keys sit before the in-point), track fader at its default. Verified on the
  final mix: the least-squares gain of the repo's file in the published audio is -0.06 dB over 67.2-87.02 (-0.08 dB
  before, -0.13 dB after). Bed RMS under the montage -18.8 dBFS vs the voice (the residual) -11.9 dBFS: the bed sits ~7 dB
  under the narration and is NOT ducked for the montage.
- **No SFX in the window** (A4 is empty from 67.200 to 87.020; the montage's own audio is silent). `_source/sfx/` holds
  the 2022 project's 15 sound files (swooshes, whooshes, paper, chalk, fire, a sonic boom, a reversed accent, T2 / T7) as
  REFERENCE ONLY: none fires here, none is in the SFX catalog.

## 6. Devices: which cue is which device (numbers in `library.json`)

| device | what | cues in main (render) | sound in the source |
|---|---|---|---|
| `ep-elegant-promo` | the whole montage (composite of the four below + the photo push + accents) | 67.200-87.020 (0.000-23.578) | none |
| `ep-iris-open` | a pinpoint circle opens the first picture out of the navy field | 67.256-67.931 (0.067-0.870) | none |
| `ep-circle-burst` | six staggered circles carry the next picture in | 67.931-68.436 (open variant) · 73.342-74.351 · 79.233-80.241 | none |
| `ep-disc-sweep` | two translucent magenta discs scale in from beyond a corner / the top edge | 68.688 (`corner_tl`) · 74.587 (`corner_br`) · 80.603 (`top_centre`) | none |
| `ep-label-title` | teal-to-blue bar wipe + Roboto Black title tracking in + caps sub-line | 69.217 FEBRUARY 2022 · 75.108 G7 GROUP · 80.998 ESSENTIAL REVENUES | none |

## 7. The render's unused tail

Only **render 23.578 -> 23.657 s (2.4 frames)**: the last of the scene-3 hold (ESSENTIAL REVENUES over the rouble
footage), never on screen. The rest of the render DID play: at 118.96 percent speed, render 0 -> 23.578 fills the 19.820 s
window, so there is no unused 19.82 -> 23.66 s stretch (a 1x reading of the clip would suggest one). At the template's own
pace (1x) the three scenes run 7.007 + 7.007 + 9.643 s.

## 8. Pattern to reuse

- A serious, cool news-promo run: 2 to 4 pictures, each with ONE short title (a date, a name, a key phrase) and one
  sub-line, the narration running under it; the montage cuts in and out hard and carries no sound of its own.
- Per picture (template pace): the burst in (0.30-1.50 s), the slow push all through, the discs (1.77-2.90), the bar
  (2.40-4.27), the title (2.87 / 3.07-4.40), the sub-line (3.54-4.34), the accents (~4.0-5.3), then a hold to 7.0 s; the
  corner alternates top-left -> bottom-right -> top-centre.
- 043 ran it at 1.1896x (5.89 s a picture) to fit the narration; a slow video can run the template pace (7.0 s a picture).
- Silent in its source: a screenplay may pair a catalog sound by id on the `[SHOW]` line (e.g. a soft whoosh on each
  burst); the bed carries it otherwise.
