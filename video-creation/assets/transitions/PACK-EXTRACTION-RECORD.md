# The Swiftly pack extraction: a record of the 86 scripts (deleted 2026-11-27)

This folder's transition catalog, `library.json`, was built in June and July 2026 by 87 Node scripts that read
the purchased **Swiftly Studio 850 Seamless Transitions** Premiere Pro pack and turned every transition in it
into data the Remotion engines can play. The job finished on 2026-07-14 ("PACK COMPLETE": 853 rows, all 14
categories), and the scripts were never run again.

On 2026-11-27 Mike had them removed as part of making the repo Python only: they were written for one use,
that use happened months ago, and porting 14,500 lines that will not run again buys nothing. One of the 87,
the gallery builder, is still useful and was ported: `_gen_galleries.py`. The other 86 were deleted. This file
is the record of them, in case the same kind of extraction is ever needed again (a new pack, the 9:16
project of this one, a family that has to be re-read).

## Getting a script back

Nothing is lost: every script is in git history. Commit `f63e1fe0` (`master` on 2026-11-27) has all of them.

```
git show f63e1fe0:video-creation/assets/transitions/_extract-melt.js > _extract-melt.js     # one script
git checkout f63e1fe0 -- "video-creation/assets/transitions/_*.js"                        # all 87
git log --diff-filter=D --name-only -- "video-creation/assets/transitions/_*.js"             # the commit that removed them
```

The second command also brings back `_gen-galleries.js`; `_gen_galleries.py` replaced it and writes the same
pages byte for byte, so delete that one again.

## What is still here, and what it means for a redo

- **`library.json`**: the catalog, 873 rows today. It is the maintained source of truth. Rows are no longer
  rebuilt from the pack; new rows are added by the Python builders below.
- **The extracted data, `_*-clips.json` (and `_*-sample.json`, `_invert-sched.json`, `_survey-remaining.json`,
  `_badsignal-real.json`)**: what the extract scripts read out of the Premiere project, per family. All of it is
  still in this folder, so a family's rows can be rebuilt WITHOUT opening the Premiere project again. Only the
  build script would have to come back (or be rewritten in Python to read the same file).
- **`lib/`**: the plates, masks and sounds the engines load. **`browse/`**: the gallery pages and demo clips.
- **`_build-scary-rows.py`, `_build-bearmarkets-rows.py`**: the two Python builders that added the 20 rows that
  did not come from the pack (October 2026). They are the model for any new builder: measure, merge by id,
  keep the file byte-safe.
- **`_gen_galleries.py`**: rebuilds the `browse/**/gallery.html` pages from `library.json`.
- **`CLAUDE.md`**: the hard rules and the method (the build checklist, Rules 1 to 7, the extraction gotchas).
  That is the knowledge. The scripts were only the hands. **`PROJECT-LOG.md`**: the build diary, family by
  family, with what each one turned out to be made of.
- **The pack itself** is not in git. It sits in the main checkout at
  `video-creation/assets/transitions/Swiftly Studio 850 Seamless Transitions/`.

## Doing it again: what the scripts needed

1. **The pack on disk**, at the path above (the scripts look for it next to themselves).
2. **The Premiere project as plain XML.** A `.prproj` is a gzipped XML file. The extract scripts read
   `%TEMP%\sw.xml`; when it is missing, the newer ones gunzip
   `Transitions/Transitions - FullHD - 1920x1080.prproj` into it themselves. The ones marked "4K: yes" below
   honor the `SWXML` environment variable, which points them at another decompressed project (the 4K one).
   Without `SWXML`, a "4K run" silently re-reads the FullHD file.
3. **Node** to run them as they are (plain Node, no packages), and **ffmpeg** for the QA sweeps.
4. **The rules in `CLAUDE.md`**, read first. They exist because this went wrong more than once.

The order of work for one family was always the same:

1. `_extract-<family>.js` reads that family's sequences out of the project XML and writes `_<family>-clips.json`:
   per clip, every effect with its parameters and keyframes (with bezier handles in the later scripts), masks,
   source media, in and out points, time remaps, and the audio clips.
2. A look at that data, often with a throwaway script (the `_analyze-`, `_summ-`, `_dbg-`, `_verify-` files), to
   work out what the effect is made of before building anything.
3. `_build-<family>-rows.js` turns the data into rows and merges them into `library.json`, removing that
   family's earlier rows first. It stops with an error on anything it did not expect (an unknown effect, a
   missing curve, an audio clip that does not start at zero).
4. The demo clips are rendered from the rows (Remotion, `TransitionDemo`).
5. `_qa-<family>-sweep.js` puts the pack's own preview above our render, frame aligned, one image per
   transition, in `_qa/<family>/`. A person looks at every one (Rule 6).
6. The gallery pages are rebuilt (`_gen_galleries.py` today).

## Three things never to do with a restored script

- **Never run `_enrich-meta.js`.** It overwrites the `meta` block of EVERY row with the June 2026 Glitch
  template (verified 2026-10-25). Each build script writes its own rows' meta.
- **Never run `_build-lib.js` blindly.** It regenerates the Blocks rows only and wipes the hand-added rows
  (Strips, Bad Signal) and their meta.
- **Never rebuild a family that is approved and working** (Rule 3). A build script replaces its family's rows.
  Try a new reading on a copy or under a new id and get Mike's approval before replacing anything.

## The catalog today, by category

| Category | Rows | Engines (rows) |
|---|---|---|
| GLITCH | 89 | `GlitchBlocks` (15), `GlitchTurbulentDisplace` (10), `GlitchCinematicMonitor` (9), `GlitchInvert` (9), `GlitchTVSatellite` (9), `GlitchVHS` (9), `GlitchMonitor` (8), `GlitchOffset` (7), `GlitchRoughly` (7), `GlitchBadSignal` (6) |
| OFFSET | 152 | `OffsetSlide` (152) |
| DEVIATION | 5 | `DeviationGlitch` (5) |
| EXPAND | 20 | `ExpandZoom` (12), `ExpandPan` (8) |
| GLASS | 40 | `GlassBeveled` (40) |
| LIGHT LEAKS | 34 | `LightLeaks` (34) |
| MELT | 30 | `MeltRGB` (22), `MeltEquidistant` (8) |
| MOTION | 57 | `Motion3D` (40), `MotionShake` (17) |
| PERSPECTIVE | 72 | `PerspectiveEase` (72) |
| SHAKE | 34 | `ShakeJolt` (34) |
| SPIN | 68 | `PerspectiveEase` (64), `SpinTwirl` (4) |
| SPLIT | 144 | `GlassBeveled` (72), `SplitPanes` (64), `SplitPerspective` (8) |
| TRANSFORM | 40 | `TransformFly` (40) |
| ZOOM | 71 | `PerspectiveEase` (70), `MirrorZoomPunch` (1) |
| SCARY | 17 | `StingerPlate` (16), `AlphaPlate` (1) |

853 of these came from the pack through the scripts below. The other 20 came from the two Python builders:
the 17 SCARY rows, the two long `MotionShake` rows and the one `MirrorZoomPunch` row.

## Stage 1: the 32 extract scripts

Each reads the project XML and writes the data file named. "4K: yes" means it honors `SWXML`.

| Script | Lines | Writes | 4K | Its rows were built by |
|---|---|---|---|---|
| `_extract-badsignal.js` | 74 | `_badsignal-real.json` | no | no build script (see its header below) |
| `_extract-blocks-clips.js` | 88 | `_blocks-clips.json` | no | `_build-lib.js` |
| `_extract-deviation.js` | 188 | `_deviation-clips.json` | no | `_build-deviation-rows.js` |
| `_extract-deviation4k.js` | 188 | `_deviation4k-clips.json` | yes | no build script (see its header below) |
| `_extract-expandpan.js` | 188 | `_expandpan-clips.json` | no | `_build-expandpan-rows.js` |
| `_extract-expandrest.js` | 188 | `_expandrest-clips.json` | no | `_build-expandzoom-rows.js` |
| `_extract-glassbeveled.js` | 271 | `_glassbeveled-clips.json`, `_glassbeveled-sample.json` | yes | `_build-glassbeveled-rows.js` |
| `_extract-glassrest.js` | 285 | `_glassrest-clips.json`, `_glassrest-sample.json` | yes | `_build-glassrest-rows.js` |
| `_extract-glitchmonitor.js` | 160 | `_glitchmonitor-clips.json` | no | `_build-glitchmonitor-rows.js` |
| `_extract-invert.js` | 166 | `_invert-clips.json` | no | `_build-invert-rows.js` |
| `_extract-lightleaks-nested.js` | 283 | `_lightleaks-nested-clips.json`, `_lightleaks-sample.json` | yes | `_build-lightleaks-rows.js`, `_build-lightleaksrest-rows.js` |
| `_extract-lightleaks.js` | 282 | `_lightleaks-clips.json`, `_lightleaks-sample.json` | yes | `_build-lightleaks-rows.js` |
| `_extract-lightleaksrest.js` | 310 | `_lightleaks-sample.json`, `_lightleaksrest-clips.json` | yes | `_build-lightleaksrest-rows.js` |
| `_extract-melt.js` | 312 | `_melt-clips.json`, `_melt-sample.json` | yes | `_build-melt-rows.js` |
| `_extract-monitor.js` | 166 | `_monitor-clips.json` | no | `_build-monitor-rows.js` |
| `_extract-motion.js` | 337 | `_motion-clips.json`, `_motion-sample.json` | yes | `_build-motion-rows.js` |
| `_extract-offset.js` | 181 | `_offset-clips.json` | no | `_build-offset-rows.js` |
| `_extract-offsetgeo.js` | 199 | `_offsetgeo-clips.json`, `_offsetgeo-sample.json` | no | `_build-offsetgeo-rows.js` |
| `_extract-perspective.js` | 355 | `_perspective-clips.json`, `_perspective-sample.json` | yes | `_build-perspective-rows.js` |
| `_extract-prproj.js` | 139 | (prints to the terminal) | no | no build script (see its header below) |
| `_extract-roughly.js` | 181 | `_roughly-clips.json` | no | `_build-roughly-rows.js` |
| `_extract-roughly4k.js` | 181 | `_roughly4k-clips.json` | no | no build script (see its header below) |
| `_extract-shake.js` | 316 | `_shake-clips.json`, `_shake-sample.json` | yes | `_build-shake-rows.js` |
| `_extract-spin3d.js` | 306 | `_spin3d-clips.json`, `_spin3d-sample.json` | yes | `_build-spin3d-rows.js` |
| `_extract-spinrest.js` | 326 | `_spinrest-clips.json`, `_spinrest-sample.json` | yes | `_build-spinrest-rows.js` |
| `_extract-split.js` | 427 | `_split-clips.json`, `_split-sample.json` | yes | `_build-split-rows.js` |
| `_extract-texadj.js` | 181 | `_texadj-clips.json` | no | no build script (see its header below) |
| `_extract-transform.js` | 322 | `_transform-clips.json`, `_transform-sample.json` | yes | `_build-transform-rows.js` |
| `_extract-turbdisp.js` | 181 | `_turbdisp-clips.json` | no | `_build-turbdisp-rows.js` |
| `_extract-tvsat.js` | 181 | `_tvsat-clips.json` | no | `_build-tvsat-rows.js` |
| `_extract-vhs.js` | 181 | `_vhs-clips.json` | no | `_build-vhs-rows.js` |
| `_extract-zoom.js` | 352 | `_zoom-clips.json`, `_zoom-sample.json` | yes | `_build-zoom-rows.js` |

## Stage 2: the 26 build scripts

Each reads the data file named and writes rows into `library.json`.

| Script | Lines | Reads | Category | Engine(s) | Data came from | QA sweep |
|---|---|---|---|---|---|---|
| `_build-deviation-rows.js` | 101 | `_deviation-clips.json` | DEVIATION | `DeviationGlitch` | `_extract-deviation.js` | none (compared by hand) |
| `_build-expandpan-rows.js` | 114 | `_expandpan-clips.json` | EXPAND | `ExpandPan` | `_extract-expandpan.js` | none (compared by hand) |
| `_build-expandzoom-rows.js` | 115 | `_expandrest-clips.json` | EXPAND | `ExpandZoom` | `_extract-expandrest.js` | none (compared by hand) |
| `_build-glassbeveled-rows.js` | 169 | `_glassbeveled-clips.json` | GLASS | `GlassBeveled` | `_extract-glassbeveled.js` | `_qa-glassbeveled-sweep.js` |
| `_build-glassrest-rows.js` | 182 | `_glassrest-clips.json` | GLASS | `GlassBeveled` | `_extract-glassrest.js` | none (compared by hand) |
| `_build-glitchmonitor-rows.js` | 113 | `_glitchmonitor-clips.json` | GLITCH | `GlitchMonitor` | `_extract-glitchmonitor.js` | none (compared by hand) |
| `_build-invert-rows.js` | 102 | `_invert-clips.json` | GLITCH | `GlitchInvert` | `_extract-invert.js` | none (compared by hand) |
| `_build-lib.js` | 44 | `_blocks-clips.json` | GLITCH | `GlitchBlocks` | `_extract-blocks-clips.js` | none (compared by hand) |
| `_build-lightleaks-rows.js` | 157 | `_lightleaks-clips.json`, `_lightleaks-nested-clips.json` | LIGHT LEAKS | `LightLeaks` | `_extract-lightleaks-nested.js`, `_extract-lightleaks.js` | `_qa-lightleaks-sweep.js` |
| `_build-lightleaksrest-rows.js` | 202 | `_lightleaks-nested-clips.json`, `_lightleaksrest-clips.json` | LIGHT LEAKS | `LightLeaks` | `_extract-lightleaks-nested.js`, `_extract-lightleaksrest.js` | none (compared by hand) |
| `_build-melt-rows.js` | 168 | `_melt-clips.json` | MELT | `MeltEquidistant`, `MeltRGB` | `_extract-melt.js` | `_qa-melt-sweep.js` |
| `_build-monitor-rows.js` | 114 | `_monitor-clips.json` | GLITCH | `GlitchCinematicMonitor` | `_extract-monitor.js` | none (compared by hand) |
| `_build-motion-rows.js` | 216 | `_motion-clips.json` | MOTION | `Motion3D`, `MotionShake` | `_extract-motion.js` | `_qa-motion-sweep.js` |
| `_build-offset-rows.js` | 101 | `_offset-clips.json` | GLITCH | `GlitchOffset` | `_extract-offset.js` | none (compared by hand) |
| `_build-offsetgeo-rows.js` | 191 | `_offsetgeo-clips.json` | OFFSET | `OffsetSlide` | `_extract-offsetgeo.js` | `_qa-offsetgeo-sweep.js` |
| `_build-perspective-rows.js` | 377 | `_perspective-clips.json` | PERSPECTIVE | `PerspectiveEase` | `_extract-perspective.js` | `_qa-perspective-sweep.js` |
| `_build-roughly-rows.js` | 148 | `_roughly-clips.json` | GLITCH | `GlitchRoughly` | `_extract-roughly.js` | none (compared by hand) |
| `_build-shake-rows.js` | 196 | `_shake-clips.json` | SHAKE | `ShakeJolt` | `_extract-shake.js` | `_qa-shake-sweep.js` |
| `_build-spin3d-rows.js` | 216 | `_spin3d-clips.json` | SPIN | `PerspectiveEase` | `_extract-spin3d.js` | `_qa-spin3d-sweep.js` |
| `_build-spinrest-rows.js` | 255 | `_spinrest-clips.json` | SPIN | `PerspectiveEase`, `SpinTwirl` | `_extract-spinrest.js` | none (compared by hand) |
| `_build-split-rows.js` | 552 | `_split-clips.json` | SPLIT | `GlassBeveled`, `SplitPanes`, `SplitPerspective` | `_extract-split.js` | `_qa-split-sweep.js` |
| `_build-transform-rows.js` | 265 | `_transform-clips.json` | TRANSFORM | `TransformFly` | `_extract-transform.js` | `_qa-transform-sweep.js` |
| `_build-turbdisp-rows.js` | 103 | `_turbdisp-clips.json` | GLITCH | `GlitchTurbulentDisplace` | `_extract-turbdisp.js` | none (compared by hand) |
| `_build-tvsat-rows.js` | 131 | `_tvsat-clips.json` | GLITCH | `GlitchTVSatellite` | `_extract-tvsat.js` | none (compared by hand) |
| `_build-vhs-rows.js` | 149 | `_vhs-clips.json` | GLITCH | `GlitchVHS` | `_extract-vhs.js` | none (compared by hand) |
| `_build-zoom-rows.js` | 511 | `_zoom-clips.json` | ZOOM | `PerspectiveEase` | `_extract-zoom.js` | `_qa-zoom-sweep.js` |

Two sets of GLITCH rows had no build script and were added to `library.json` by hand: the 6 Cinematic Bad Signal
rows (from `_badsignal-real.json`) and the Blocks Strips rows (their masks were derived from the pack's preview
clips, the one sanctioned use of a preview: `CLAUDE.md`, "THE PROPER METHOD"). The extract scripts with no build
script are the generic parameter dump (`_extract-prproj.js`), the two 4K cross-checks (`_extract-deviation4k.js`,
`_extract-roughly4k.js`), Bad Signal, and `_extract-texadj.js`.

## Stage 3: the 11 QA sweeps

Each renders nothing itself: it takes frames from the pack's preview clip and from our demo clip with ffmpeg and
stacks them (preview on top in yellow, ours below in cyan) into `_qa/<family>/sbs_<id>.png`.

| Script | Lines | Also reads |
|---|---|---|
| `_qa-glassbeveled-sweep.js` | 52 | only the clips on disk |
| `_qa-lightleaks-sweep.js` | 45 | only the clips on disk |
| `_qa-melt-sweep.js` | 47 | only the clips on disk |
| `_qa-motion-sweep.js` | 49 | only the clips on disk |
| `_qa-offsetgeo-sweep.js` | 45 | only the clips on disk |
| `_qa-perspective-sweep.js` | 52 | only the clips on disk |
| `_qa-shake-sweep.js` | 45 | only the clips on disk |
| `_qa-spin3d-sweep.js` | 79 | only the clips on disk |
| `_qa-split-sweep.js` | 64 | `_split-clips.json` |
| `_qa-transform-sweep.js` | 48 | `_transform-clips.json` |
| `_qa-zoom-sweep.js` | 51 | `_zoom-clips.json` |

## The 17 helpers and one-off investigations

| Script | Lines | Kind |
|---|---|---|
| `_analyze-glassbeveled.js` | 41 | one-off analysis of an extracted file |
| `_analyze-offsetgeo.js` | 67 | one-off analysis of an extracted file |
| `_dbg-glassbev-comp.js` | 93 | one-off debug dump |
| `_dbg-glassbev-mask.js` | 91 | one-off debug dump |
| `_dbg-offset-4k-audio.js` | 86 | one-off debug dump |
| `_dbg-offset-audio.js` | 39 | one-off debug dump |
| `_dump-kf-raw.js` | 75 | one-off raw dump |
| `_enrich-meta.js` | 74 | catalog descriptions (DO NOT RUN, see above) |
| `_gen-lens-map.js` | 94 | generator for a Remotion engine's data |
| `_gen-sphere-map.js` | 69 | generator for a Remotion engine's data |
| `_layers.js` | 52 | one-off dump of a sequence's layer stack |
| `_recipe-seq.js` | 63 | one-off full recipe of one sequence |
| `_summ-invert.js` | 54 | one-off summary of an extracted file |
| `_summ-offset.js` | 31 | one-off summary of an extracted file |
| `_survey-remaining.js` | 167 | one-off survey of every sequence in the project |
| `_verify-offset-sign.js` | 147 | one-off numeric check against the preview |
| `_verify-roughly-mech.js` | 75 | one-off numeric check against the preview |

`_gen-lens-map.js` and `_gen-sphere-map.js` made the two displacement maps that live as data in
`remotion/src/transitions/engines/lensMap.ts` and `sphereMap.ts`. Both files are checked in and still say
"AUTO-GENERATED by" one of these two scripts on their first line. The maps are frozen with the approved library,
so a generator is needed only to change the lens model itself; restore it from git for that. Their headers
below hold the model.

## Every script, in its own words

The header comment each script carried, unchanged. This is where the per-family findings are written down.

### Extract

**`_extract-badsignal.js`** (74 lines)

```text
Per-variant real data for all 9 Cinematic Bad Signal transitions: the Offset
"Shift Center To" roll keyframes + the window duration. Writes _badsignal-real.json.
```

**`_extract-blocks-clips.js`** (88 lines)

```text
Per-CLIP extractor for all 15 GLITCH/Blocks transitions (the correct,
non-leaky path): Sequence -> VideoTrackGroup -> Tracks -> TrackItems ->
each clip's OWN component chain. Pulls the real Offset "Shift Center To"
vectors, the Geometry2 vertical Scale Height, and each clip's source name
(which `Gth - Disp Blocks` mask it uses). Writes _blocks-clips.json.
```

**`_extract-deviation.js`** (188 lines)

```text
Per-clip real data for the whole OFFSET (motion push/slide) category:
  19 sub-families x 8 directions = 152 sequences.
Same closure-walk as _extract-offset.js (the GLITCH Offset extractor) — sequences
carry TWO TrackGroups and the audio one can come first (pick by tag), clips carry
media in-points, effects apply BOTTOM-UP. Per clip: time window, SubClip->MasterClip
(name / adjustment flag / media path), media in-point, every component with every
param (static value + ALL keyframes). Writes _deviation-clips.json.
Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = a substring filter to extract just a sample (e.g. "Simple - Right").
```

**`_extract-deviation4k.js`** (188 lines)

```text
Per-clip real data for the whole OFFSET (motion push/slide) category:
  19 sub-families x 8 directions = 152 sequences.
Same closure-walk as _extract-offset.js (the GLITCH Offset extractor) — sequences
carry TWO TrackGroups and the audio one can come first (pick by tag), clips carry
media in-points, effects apply BOTTOM-UP. Per clip: time window, SubClip->MasterClip
(name / adjustment flag / media path), media in-point, every component with every
param (static value + ALL keyframes). Writes _deviation4k-clips.json.
Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = a substring filter to extract just a sample (e.g. "Simple - Right").
```

**`_extract-expandpan.js`** (188 lines)

```text
Per-clip real data for the whole OFFSET (motion push/slide) category:
  19 sub-families x 8 directions = 152 sequences.
Same closure-walk as _extract-offset.js (the GLITCH Offset extractor) — sequences
carry TWO TrackGroups and the audio one can come first (pick by tag), clips carry
media in-points, effects apply BOTTOM-UP. Per clip: time window, SubClip->MasterClip
(name / adjustment flag / media path), media in-point, every component with every
param (static value + ALL keyframes). Writes _expandpan-clips.json.
Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = a substring filter to extract just a sample (e.g. "Simple - Right").
```

**`_extract-expandrest.js`** (188 lines)

```text
Per-clip real data for the whole OFFSET (motion push/slide) category:
  19 sub-families x 8 directions = 152 sequences.
Same closure-walk as _extract-offset.js (the GLITCH Offset extractor) — sequences
carry TWO TrackGroups and the audio one can come first (pick by tag), clips carry
media in-points, effects apply BOTTOM-UP. Per clip: time window, SubClip->MasterClip
(name / adjustment flag / media path), media in-point, every component with every
param (static value + ALL keyframes). Writes _expandrest-clips.json.
Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = a substring filter to extract just a sample (e.g. "Simple - Right").
```

**`_extract-glassbeveled.js`** (271 lines)

```text
Per-clip real data for the GLASS / Beveled sub-family (12 sequences):
  Beveled {1,2} x {Up,Down,Left,Right} + Beveled {3,4} x {Horizontal,Vertical}.
Each main sequence nests a "<name> (In)" and "<name> (Out)" sub-sequence; we extract
the main sequence AND both nested sub-sequences (they carry the real effect stacks).
Same closure-walk as _extract-offsetgeo.js: sequences carry TWO TrackGroups (pick the
VideoTrackGroup by tag), clips carry media in-points, effects apply BOTTOM-UP.
Per clip: time window, SubClip->MasterClip (name / adjustment flag / media path / nested
sequence name), media in-point, every component (MatchName) with every param
(static value + ALL keyframe fields incl. the temporal-bezier handles). Writes
_glassbeveled-clips.json. Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = substring filter (e.g. "1 - Left").
```

**`_extract-glassrest.js`** (285 lines)

```text
Per-clip real data for the REMAINING GLASS sub-families (28 sequences):
Beveled Short 12 + Blocks 4 + Blocks Corner 12. Same walker + AEMask decode as
_extract-glassbeveled.js (see that file for the architecture notes).
```

**`_extract-glitchmonitor.js`** (160 lines)

```text
Per-clip real data for all 8 Glitch Monitor transitions (Glitch Monitor - 1..8).
Adapted from _extract-monitor.js (same per-clip method; see that file for notes).
```

**`_extract-invert.js`** (166 lines)

```text
Per-clip real data for all 9 Glitch Invert transitions (Max/Min/Short x 1-3).
Walks each sequence's VIDEO TrackGroup only (NOTE: sequences carry TWO TrackGroups and
the audio one can come first — _recipe-seq.js's "first <Second ObjectRef>" grab walks
the 65-track audio group for this family; here we pick by tag === VideoTrackGroup).
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
every component with every param (static value + ALL keyframes), Opacity blend modes.
Writes _invert-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-lightleaks-nested.js`** (283 lines)

```text
Per-clip real data for LIGHT LEAKS / Light Leaks (8 sequences). Same walker +
AEMask decode as _extract-glassbeveled.js. Plates expected (Hst - Flr Light
Leaks + Blur Map videos) — mediaPath captured per MasterClip.
```

**`_extract-lightleaks.js`** (282 lines)

```text
Per-clip real data for LIGHT LEAKS / Light Leaks (8 sequences). Same walker +
AEMask decode as _extract-glassbeveled.js. Plates expected (Hst - Flr Light
Leaks + Blur Map videos) — mediaPath captured per MasterClip.
```

**`_extract-lightleaksrest.js`** (310 lines)

```text
Per-clip real data for LIGHT LEAKS / Light Leaks (8 sequences). Same walker +
AEMask decode as _extract-glassbeveled.js. Plates expected (Hst - Flr Light
Leaks + Blur Map videos) — mediaPath captured per MasterClip.
```

**`_extract-melt.js`** (312 lines)

```text
Per-clip real data for the MELT category (30 sequences: Equidistant 4+4, RGB 7+7, RGB Soft 4+4). Full capture: effects+kfs+handles, AEMasks, media (deep), in/out points, time remaps.
```

**`_extract-monitor.js`** (166 lines)

```text
Per-clip real data for all 9 Glitch Cinematic Monitor transitions (Max/Min/Short x 1-3).
Walks each sequence's VIDEO TrackGroup only (NOTE: sequences carry TWO TrackGroups and
the audio one can come first — _recipe-seq.js's "first <Second ObjectRef>" grab walks
the 65-track audio group for this family; here we pick by tag === VideoTrackGroup).
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
every component with every param (static value + ALL keyframes), Opacity blend modes.
Writes _monitor-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-motion.js`** (337 lines)

```text
Per-clip real data for the MOTION category (55 single-scene accent moves: 3D Offset 16, 3D Orbit 16, 3D Pan 8, Shake 3D 5, Shake Optics 6, Shake Simple 4). Full capture incl. masks, in/out points, remaps.
```

**`_extract-offset.js`** (181 lines)

```text
Per-clip real data for all 7 Glitch Offset transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _offset-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-offsetgeo.js`** (199 lines)

```text
Per-clip real data for the whole OFFSET (motion push/slide) category:
  19 sub-families x 8 directions = 152 sequences.
Same closure-walk as _extract-offset.js (the GLITCH Offset extractor) — sequences
carry TWO TrackGroups and the audio one can come first (pick by tag), clips carry
media in-points, effects apply BOTTOM-UP. Per clip: time window, SubClip->MasterClip
(name / adjustment flag / media path), media in-point, every component with every
param (static value + ALL keyframes). Writes _offsetgeo-clips.json.
Reads decompressed project XML from %TEMP%/sw.xml.

Optional CLI arg = a substring filter to extract just a sample (e.g. "Simple - Right").
```

**`_extract-perspective.js`** (355 lines)

```text
Per-clip real data for PERSPECTIVE all 8 Ease/Hit subgroups (64 A->B transitions; Hit Out uses a DOUBLE SPACE in its sequence names). Full capture incl. masks, in/out points, remaps.
```

**`_extract-prproj.js`** (139 lines)

```text
Extracts REAL effect parameters + keyframe values from the Swiftly .prproj
(Premiere stores them as plaintext inside an ObjectRef graph). Used to drive
the Remotion transition engines off the project's actual numbers instead of
hand-tuned guesses.

Usage:
  node _extract-prproj.js [matchName-substring]
  node _extract-prproj.js "Turbulent Displace"

Reads the decompressed XML from /tmp/sw.xml if present, else gunzips the prproj.
```

**`_extract-roughly.js`** (181 lines)

```text
Per-clip real data for all 7 Glitch Roughly transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _roughly-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-roughly4k.js`** (181 lines)

```text
Per-clip real data for all 7 Glitch Roughly transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _roughly4k-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - 4K UltraHD - 3840x2160.prproj" there first if missing).
```

**`_extract-shake.js`** (316 lines)

```text
Per-clip real data for the SHAKE category (Hit 6 + Horizontal 7 + Long 7 + Short 7 + Skew 7 = 34 A->B transitions). Full capture incl. masks, in/out points, remaps.
```

**`_extract-spin3d.js`** (306 lines)

```text
Per-clip real data for SPIN 3D (Center/Corner Ease B|T CW|CCW + Side Ease 4 dirs, + Shorts = 24 A->B transitions). Full capture.
```

**`_extract-spinrest.js`** (326 lines)

```text
Per-clip real data for the remaining SPIN subgroups (Center/Corner Ease + Swinging, Corner Bounce, Shake 1x/2x, Twirl, each + Short = 44 A->B transitions). Full capture.
```

**`_extract-split.js`** (427 lines)

```text
Per-clip real data for the SPLIT category (144 sequences, 14 subgroups) + the Split Percent utility sequence. Full capture.
```

**`_extract-texadj.js`** (181 lines)

```text
Per-clip real data for all 7 Glitch Offset transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _texadj-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-transform.js`** (322 lines)

```text
Per-clip real data for the TRANSFORM category (40 sequences, 8 subgroups: 1/2/3/4 + Short twins). Full capture.
```

**`_extract-turbdisp.js`** (181 lines)

```text
Per-clip real data for all 10 Turbulent Displace transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _turbdisp-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-tvsat.js`** (181 lines)

```text
Per-clip real data for all 9 TV Satellite transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _tvsat-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-vhs.js`** (181 lines)

```text
Per-clip real data for all 9 VHS transitions (1x-7x).
Walks each sequence's VIDEO TrackGroup (sequences carry TWO TrackGroups and the audio
one can come first — pick by tag === VideoTrackGroup), AND the AUDIO TrackGroup so the
per-variant SFX file is read from the project, not guessed.
Per clip: time window, SubClip -> MasterClip (name / adjustment flag / media path),
media in-point, every component with every param (static value + ALL keyframes).
Writes _vhs-clips.json. Reads decompressed project XML from %TEMP%/sw.xml
(gunzip "Transitions - FullHD - 1920x1080.prproj" there first if missing).
```

**`_extract-zoom.js`** (352 lines)

```text
Per-clip real data for the ZOOM category (70 sequences, 16 subgroups: Ease/Hit/Optics/Optics Spin/Shake 1-2x/Simple/Spin/Swinging + Short twins). Full capture.
```

### Build

**`_build-deviation-rows.js`** (101 lines)

```text
_deviation-clips.json -> DEVIATION library rows: ALL Optics (1x-4x) + Shift 4x
ONLY (Mike's selection, 2026-07-11). Engine DeviationGlitch. Piecewise (In)/(Out)
Color Distortion + (Optics) Lens Distortion curves with bezier handles, exactly
like the OFFSET builder. No SFX (pack ships this category silent — verified
FullHD + 4K audio groups empty, previews video-only; Optics_0N.wav unreferenced).
Merges into library.json (removes prior DEVIATION rows first).
```

**`_build-expandpan-rows.js`** (114 lines)

```text
_expandpan-clips.json -> 8 EXPAND Pan rows (Pan + Pan Short x 4 dirs), engine
ExpandPan. Piecewise data with bezier handles: (In)/(Out) AECrop curves (the
expand edge-stretch; anchor = 1 when the cropped side is the LOW-coordinate
side Left/Top, else 0) + Geometry2 Position pan curves (screen fractions,
Position − 0.5, on the direction axis). SFX Simple_SFX.mp3 truncated to the
family window (Pan 1.24s / Short 0.64s), real in-point 0.08.
Merges into library.json (replaces prior EXPAND rows).
```

**`_build-expandzoom-rows.js`** (115 lines)

```text
_expandrest-clips.json -> 12 EXPAND In/Out/OutIn rows, engine ExpandZoom.
Per phase: 'rig' (Replicate present; curve = the KEYFRAMED Geometry2 Scale
param; S = 300/v) or 'crop' (curve = the keyframed AECrop side, both sides
carry the same values; S = 1/(1−2v/100); blur = Blur Length kfs). Shared:
Glow opacity envelope + Deviation (Mettle Master Amplitude + Scale pulse).
SFX Whoosh_02.wav truncated per audio-clip window. Merges into library.json
(keeps the ExpandPan rows).
```

**`_build-glassbeveled-rows.js`** (169 lines)

```text
_glassbeveled-clips.json -> 12 GLASS/Beveled rows, engine GlassBeveled.

Mechanism (decoded 2026-07-12): each sequence's (In)/(Out) HST Adjustment clips
stack FIVE AEMask-gated wrap-Offsets (straight-quad shards, feather 0, mode Add,
staggered 0.76s full-wrap phases) — plus, in Beveled 3/4, a SIXTH unmasked
full-frame push. Direction is encoded by PR H/V Flip SANDWICHES around subsets
of the stack; resolved here ANALYTICALLY (mirror mask coords + negate the shift)
so the engine gets flat stages in the REAL bottom-up apply order.

Hard-fails (Rule 2 — never paper over unread source data) on: curved mask
vertices, feather/opacity/expansion != 0/100/0, inverted masks, keyframed mask
paths, mixed axes in one row, unclosed flip sandwiches, or (In)/(Out) stage
mismatches. Merges into library.json (replaces prior glass-beveled-* rows).
```

**`_build-glassrest-rows.js`** (182 lines)

```text
_glassrest-clips.json -> 28 GLASS rows (Beveled Short 12, Blocks 4, Blocks
Corner 12), engine GlassBeveled. Same architecture as _build-glassbeveled-rows.js
(AEMask shard-gated staggered wrap-Offsets, flips resolved analytically) with the
three differences found in extraction (2026-07-12):
  - (Out) curves JUMP AHEAD at the cut (OFFSET-Short pattern, e.g. Beveled Short
    skips 0.44s) — the engine's piecewise curveIn/curveOut sampling handles it.
  - Blocks/Corner use a DOUBLE flip sandwich (H+V = 180 rotation) and rectangular
    block masks; Corner rows mix x-axis AND y-axis stages (axis asserted PER
    STAGE; row axis becomes 'xy').
  - Audio cuts differ per subgroup (Blocks plays Skew_Simple_01 from in 0.12) —
    sfx file chosen by the MEASURED (inPoint, window), asserted, not assumed.
Hard-fails on everything the Beveled builder does. Merges into library.json.
```

**`_build-glitchmonitor-rows.js`** (113 lines)

```text
Build the 8 Glitch Monitor rows from _glitchmonitor-clips.json and MERGE them into
library.json (replaces glitchmonitor-* rows only; never touches other rows).
Real values per sequence (see _extract-glitchmonitor.js):
 - offsets: t3 "Texture Adjustment" windows — full-frame wrap Offset (dx = x-0.5, dy = y-0.5),
            split at the 0.16s cut in every variant
 - hst:     t1 "HST Adjustment" window (Offset +0.36% x, Emboss 90deg/7/70, Tint
            black->GREEN / white->BLACK, Pin Light) — also the settle-envelope support
 - blur/stretch: t2 Fast Blur 100 + Geometry2 Scale Height 150 (ghost/smear copy)
 - plate:   t4 "Glitch Monitor <n>.mp4" (flat 50% gray + colored signal bands),
            Premiere Blend Mode 17 (Pin Light), media in-point 0
 - swapAt:  the t4 plate clip's split point / duration (the A->B cut hides there)
 - SFX:     Glitch_Overlay_1_0<n>.mp3, mapping verified from each sequence's audio
            track in the project XML (1:1 by number)
```

**`_build-invert-rows.js`** (102 lines)

```text
Build the 9 Glitch Invert rows from _invert-clips.json and MERGE them into
library.json (replaces invert-* rows only; never touches other rows).

Mechanism (verified numerically vs the pack previews, 2026-07-04):
 - Two back-to-back "HST Adjustment" clips carry stacks of AE.ADBE Invert effects
   (each on one Channel) + one AE.ADBE Tint. "Blend With Original" keyframes toggle
   each op per 25fps frame (100 = off, 0 = on; Tint: "Amount to Tint" 100 = on).
 - Channel enum is 0-based COUNTING the popup separators: 0=RGB, 2=Green, 6=Hue,
   7=Lightness, 12=In Phase Chrominance. Tint maps black->black, white->white = b/w.
 - The component list applies BOTTOM-UP: Tint (listed last) applies FIRST, then the
   inverts (verified: Max-2's green flash is green_neg(gray(A)), not gray(green_neg)).
 - Both adjustment clips play media from in-point 0.88 (timeline t = kf.t - inPoint
   + clip.start). The A->B cut sits at the boundary between the two clips.
 - Preview QA note: the pack previews are 25->29.97fps conversions with FRAME
   BLENDING — flat-gray frames in them are pulldown blend artifacts, not content.
```

**`_build-lib.js`** (44 lines)

```text
Build library.json from the REAL per-clip data in _blocks-clips.json.
Max/Medium use the Gth-Disp Blocks Max mask; Short uses the Small mask.
Strips are NOT built here (their strip pattern isn't reproducible project
data — it's baked into the preview render).
```

**`_build-lightleaks-rows.js`** (157 lines)

```text
_lightleaks-clips.json + _lightleaks-nested-clips.json -> 8 LIGHT LEAKS rows,
engine LightLeaks.

Mechanism (decoded 2026-07-12): content under a shared Gaussian-blur (0->35->0
peak at the 0.32 cut) + ProcAmp flash (brightness 0->25->0, contrast
100->200->100), with the pack's REAL leak plates (1-3 per variant, nested
"Pre Light Leaks N" sequences) screen-composited ABOVE the blurred content.
"Change color here" layers carry Change To Color -> ARGB16-decoded targets.
The "Deviation" clip (Texture Adjustment rack slot 151 = flat Color Matte +
Emboss + green Tint) is verified VISUALLY NIL (preview window-edge A/B) and
ships documented but unrendered.

Hard-fails on: unexpected duration/cut/windows/audio, missing plate files,
blur/procamp curves deviating from the canonical shape, unknown effects on
leak layers. Merges into library.json.
```

**`_build-lightleaksrest-rows.js`** (202 lines)

```text
_lightleaksrest-clips.json (+ _lightleaks-nested-clips.json for the Short
subgroup's Pre stacks) -> 26 LIGHT LEAKS rows: Light Leaks Short 8, Soft 9,
Soft Short 9. Engine LightLeaks (v2, map-matted envelope).

Subgroup shapes (decoded 2026-07-12):
 - Short: the Light Leaks recipe compressed to 0.4s (cut 0.16). SAME nested
   "Pre Light Leaks N" plate stacks windowed 0..0.36; Blur reads slot 2(n-1)
   from a PER-VARIANT offset 0.12-0.2 INTO the slot (envelope timing shifts
   slightly per variant — real data). Deviation = rack slot 151.2 (same flat
   Color Matte, visually nil, unrendered).
 - Soft (1.44s, cut 0.32) / Soft Short (0.4s, cut 0.16): NO Deviation, NO
   nested stack — TWO "_Simple Light Leaks" files, a DIFFERENT one each side
   of the cut ((Out) plays from media 0.04s), over a Blur Map VH matte
   (slots 16+2(n-1)). Same ambiguous (22,0) blend -> Screen (preview-proven).
Hard-fails on every unexpected value. Merges into library.json.
```

**`_build-melt-rows.js`** (168 lines)

```text
_melt-clips.json -> 30 MELT rows: Equidistant 4 + Equidistant Short 4 (engine
MeltEquidistant, VR-projection tilt/roll) and RGB 7 + RGB Soft 4 + RGB Short 7
+ RGB Soft Short 4 (engine MeltRGB, Mettle chromatic-aberration channel split).
Variant folders mirror the pack preview tree (Soft lives inside RGB / RGB Short).
Hard-fails on: unexpected effects/windows/rates, missing curves, non-zero audio
in-points, unmapped audio windows. Merges into library.json.
```

**`_build-monitor-rows.js`** (114 lines)

```text
Build the 9 Cinematic Monitor rows from _monitor-clips.json and MERGE them into
library.json (replaces monitor-* rows only; never touches other rows — safe unlike
_build-lib.js which regenerates the Blocks rows). Real values per sequence:
 - jolts: t1 "Texture Adjustment" windows — full-frame wrap Offset (dx = x-0.5, dy = y-0.5)
 - roll:  t3 "HST Adjustment" keyframed Offset — small vertical jitter (dy = y-0.5),
          rebased so the first keyframe sits at t=0 (Min-3 is authored at +0.88s)
 - wave:  t2 Wave Warp params verbatim (type 7, height 120, width 41.4, speed 2)
 - plate: t4 "Cinematic Monitor <V> <n>.mp4" overlay, Premiere Blend Mode 17 (Pin Light)
          → CSS 'hard-light' (closest CSS analog; no pin-light in CSS) — QA'd vs preview
 - swapAt: the t4 plate clip's split point / window duration (the A->B cut hides there)
```

**`_build-motion-rows.js`** (216 lines)

```text
_motion-clips.json -> 55 MOTION rows: 3D Offset 16 + 3D Orbit 16 + 3D Pan 8
(engine Motion3D) and Shake 3D 5 + Shake Optics 6 + Shake Simple 4 (engine
MotionShake). SINGLE-SCENE accent moves (Mike's receipt/article showcase
moves): no A->B, demoSameScene:true on every row, NO SFX (verified 3 ways).

Direction variants carry the same H/V flip on all three adjustment layers and
the previews show UPRIGHT content -> flips mirror the MOTION only, resolved
here analytically (mirror drift/geoPos, negate swivel/tilt/geoRot per axis).
Shake variants slice the first ~2s of a 60s baked wiggle master (1500 kfs)
-> keyframes trimmed to the clip window. Hard-fails on shape surprises.
```

**`_build-offset-rows.js`** (101 lines)

```text
Build the 7 Glitch Offset rows from _offset-clips.json and MERGE them into
library.json (replaces glitchoffset-* rows only; never touches other rows).
Real values per sequence (see _extract-offset.js / _summ-offset.js):
 - curve:  t2 "Glitch Offset - Nx" adjustment pair — ONE keyframed full-frame wrap
           Offset (y only; x static 0.5 in all 7), 25fps keyframes in media time
           (in-point 0.88), merged to sequence time via t_seq = clip.start + (kf.t - inPoint).
           The two clips stitch a single continuous curve across the cut.
 - swapAt: first t2 clip's end / duration — the A->B cut hides in the offset jump.
 - hst:    t1 "Abberations"/"Deviation" window — Offset tiny +y shift, Emboss
           dir 180 / relief 3-8 / contrast 60, Tint black->GREEN white->BLACK
           (decoded ff00ff00 / ff000000 ARGB), Pin Light (Blend Mode 17; the
           8+17 double param matches Glitch Monitor's verified t1 exactly).
 - SFX:    NONE. Verified 3 ways: FullHD + 4K sequences both have EMPTY audio
           groups (5 tracks, 0 items), previews are video-only streams, and no
           Offset-named file exists in (Footage)/Sound. hasSound: false is the
           pack's truth, not an omission (Rule 2: don't invent a mapping).
```

**`_build-offsetgeo-rows.js`** (191 lines)

```text
_offsetgeo-clips.json -> ALL 152 OFFSET library rows, engine OffsetSlide:
  14 PURE-PUSH sub-families (near-1:1) + Warp (lens distortion) + Hit (glitch
  Deviation flash) hybrids (approximate) x 8 dirs.
Merges into library.json.transitions (removes prior offset-* rows first).
```

**`_build-perspective-rows.js`** (377 lines)

```text
_perspective-clips.json -> 64 PERSPECTIVE rows (Ease In / Ease Out / Hit In /
Hit Out, each + Short, x 8 dirs), engine PerspectiveEase.

Mechanism (decoded 2026-07-13, verified vs previews): every phase = a uniform
zoom of the current scene about a PINNED point; three phase kinds:
 - plain (norm 100): raw Geometry2, anchor == position == the direction point.
 - rig2 (norm 200): Offset 0:0 (= HALF-FRAME wrap shift, quadrant swap) +
   Replicate(2) + 4 Mirrors -> coherent half-size copy at rig center w/ TRUE
   mirror padding; anchor = 0.25 + p/2 (quarter map).
 - rig3 (norm 300, Hit In's slam): Replicate(3) + 4 Mirrors at the 1/3 lines,
   NO Offset (odd grid centers itself); anchor = 1/3 + p/3 (hand-placed with
   tiny jitter on some rows — REAL values shipped, not snapped).
Families: Ease In = plain 100->300 | rig2 135->200. Ease Out = rig2 200->135 |
plain 300->100. Hit In = plain 100->300 | rig3 150->300 slam + Shake + Deviation.
Hit Out = rig2 200->135 | plain 300->100 slam + Shake + Deviation.
Shake = rig2-identity window + keyframed Position jitter (±3%, ends at rest).
Deviation = Tint black->RED white->BLUE (ARGB16; preview-verified ORANGE/BLUE
fringes — the white end is NOT black, unlike GLITCH/Offset) + Emboss 45/10/70
+ Pin Light = an R/B split along the 45 diagonal, windowed.

Pack data quirks handled here: subclip names are COPY-PASTED across dirs and
Hit In's "(In" is missing its closing paren -> phases are identified by SHAPE
and ORDER, never by subclip name; "Perspective  Hit Out" has a double space.

SFX by MEASURED (media, start, in-point, window) — asserted, not assumed:
Ease In: Spin_01 @0 from 0        -> sfx-perspective-ease-{84,44}.mp3
Ease Out: Spin_01 @0.04 from .048 -> sfx-perspective-easeout-{84,44}.mp3 (lead baked)
Hit long: Optics_02 @0.04 from 0  -> sfx-perspective-hit-{76,80}.mp3 (lead baked)
Hit Short: Optics_02 @0 from 0    -> sfx-perspective-hit-40.mp3

Hard-fails on any deviation from the verified recipe (Rule 2).
Merges into library.json (replaces prior PERSPECTIVE rows).
```

**`_build-roughly-rows.js`** (148 lines)

```text
Build the 7 Glitch Roughly rows from _roughly-clips.json and MERGE them into
library.json (replaces roughly-* rows only; never touches other rows).

Mechanism (per-clip extraction + numeric verification, 2026-07-05):
Every effect window is a SubClip of the shared "Texture Adjustment" utility
sequence — a rack of the pack's plate videos, each SELF-LUMA-MATTED
(Set Matte2: matte=self, channel=luminance, stretch-to-fit). Over content the
window renders as: CONTENT THROUGH THE PLATE'S LUMA (verified numerically vs
preview: fragment-region chroma == content baseline, nowhere near white-plate
H1) — i.e. the same real-matte mechanism as the approved Blocks family.
 - mosaic window ("Different Fragments Nx" plate, whole transition, split at
   the A->B cut with continuous media): matted content -> Geometry2 Scale
   Height 125% -> Mosaic 314x174 (bottom-up component order: Geometry2 listed
   last so it applies FIRST).
 - offset window(s) ("Blocks Nx" plate, mid-transition): matted content
   wrap-shifted by the clip's keyframed Offset "Shift Center To" (dx,dy =
   raw - 0.5; keyframes in media time, window-relative here). Plates carry
   GRAY levels -> partial alpha (baked into the mask PNGs). 1x has none;
   7x stacks TWO (Blocks 7x + Blocks 3x).
 - cut = the mosaic pair's split point. Windows play their plate from
   maskStart seconds in (window in-point minus the plate's rack slot start).
 - SFX: Composite_Roughly_Only_Displacement.mp3 on every variant's audio
   track, played from a per-variant in-point (trimmed copies in lib/).
```

**`_build-shake-rows.js`** (196 lines)

```text
_shake-clips.json -> 34 SHAKE rows (Hit 6 + Horizontal 7 + Long 7 + Short 7 +
Skew 7), engine ShakeJolt.

Mechanism (decoded 2026-07-13, verified vs previews): ONE full-window rig2
adjustment (Offset 0:0 half-frame quadrant swap + Replicate 2 + 4 Mirrors +
static Scale 200 = mirror-padded IDENTITY, center anchor) carrying a
continuous 25fps-keyed shake: Position jolts + Rotation (Hit/Long/Short) or
Skew (Skew: Axis 0 = skewX; Horizontal: Axis 90 = skewY). The A->B cut hides MID-SHAKE at the
split between two media-continuous "Deviation" clips (Tint black->RED
white->BLUE + Emboss dir 45/90, relief scales with intensity + Pin Light =
the R/B fringe bracketing the cut).

NO SFX — verified 3 ways (FullHD audio groups empty, previews video-only,
no Shake file in Sound/). Previews are NATIVE 25fps.

Hard-fails on any deviation from the verified recipe (Rule 2).
Merges into library.json (replaces prior SHAKE rows).
```

**`_build-spin3d-rows.js`** (216 lines)

```text
_spin3d-clips.json -> 24 SPIN rows (3D Center Ease, 3D Corner Ease, 3D Side
Ease, each + Short; Center/Corner in B|T x CW|CCW, Side in 4 dirs), engine
PerspectiveEase (rot phases).

Mechanism (decoded 2026-07-13, verified vs previews): (In)/(Out) rig2 clips
(Offset 0:0 quadrant swap + Replicate 2 + 4 Mirrors + STATIC Scale 200 =
mirror-padded identity) with keyframed ROTATION about a pinned anchor:
  Center = frame center (In 0->±60, Out ∓90->0);
  Corner = a frame CORNER, quarter-mapped (±28/26);
  Side   = an EDGE midpoint (±26..60 depending on the edge).
A spins out, B spins in from the opposite side of the cut — the swap hides
under peak rotational blur (shutter 320; Corner's (In) runs 180 — per-phase).
A full-window 3-kf Corner Pin stretches ONE edge (peak ~(-1 .. 1.95), at the
cut) and settles back = the 3D wobble; B/T variants differ ONLY by which
edge the pin stretches. All hand-placed values shipped as-is (26 vs 28 etc).

SFX: Spin_01.wav @0.04 from in-point 0, window = duration ->
lib/sfx-spin3d-{88,44}.mp3 (0.04 lead baked).

Hard-fails on any deviation (Rule 2). Merges into library.json (replaces
prior SPIN rows).
```

**`_build-spinrest-rows.js`** (255 lines)

```text
_spinrest-clips.json -> 44 SPIN rows (the 14 non-3D subgroups):
Center Ease 2 + Center Swinging 2 + Corner Bounce 4 + Corner Ease 4 +
Corner Swinging 4 + Shake 1x/2x 4 + Twirl 2, each + Short.

40 rows ride the generalized PerspectiveEase phases (rig2 mirror-padded
identity + keyframed ROTATION about a pinned anchor):
  Center Ease:    center pivot, In 0->±40, Out ∓90->±15->0 (3kf ease)
  Center Swinging: center, In 0->±50, Out 4kf PENDULUM (∓40->±15->∓1->0)
  Corner Bounce:  corner pivot, In 0->±25, Out small 4kf BOUNCE (∓5..10->0)
  Corner Ease:    corner, In 0->±26, Out ∓(22-27)->∓6->0
  Corner Swinging: corner, In 0->±26, Out 4kf pendulum
  Shake 1x/2x:    center + DENSE keyframed Position jitter riding the spin
                  (pan curves) + some (Out) scale settles (198/240 -> 200,
                  hand-authored per row — shipped as-is)
4 Twirl rows use the NEW SpinTwirl canvas engine (AE Twirl vortex, angle
0->∓180 | ±180->0, center raw(1,1) = frame CENTER, radius raw 30 = 60% of
width — the DOUBLED point normalization, preview-calibrated; shutter 0).

SFX by MEASURED (media, start, in-point, window):
  Center Ease: Spin_01 @.04 ip .06 -> sfx-spincenterease-{72,44}
  Swinging (both): Swinging_01 @.04 ip .08 -> sfx-spinswinging-{84,44}
  Corner Bounce: Bounce_01 @.04 ip .12 -> sfx-spinbounce-{92,44}
  Corner Ease: Spin_01 @.04 ip 0 -> sfx-spincornerease-{76,44}
  Shake: Spin_01 @.08 ip .04, ENDS EARLY (0.92 < dur) -> sfx-spinshake-{92,52}
  Twirl: Spin_03 @0 ip .09 -> sfx-spintwirl-{68,40}

Hard-fails on any deviation (Rule 2). Replaces only ITS OWN variants in
library.json (the SPIN 3D rows stay).
```

**`_build-split-rows.js`** (552 lines)

```text
_split-clips.json -> 144 SPLIT rows (14 subgroups, 4 architecture families).

Family A "panes" (64 = Ease/Swinging x long/Short):
  Two AEMask-gated Geometry2 HALVES over the rig2 mirror-padded identity
  (Offset 0:0 quadrant swap + Replicate 2 + the 4 ExpandPan Mirrors; uniform
  Scale Height 200 on each masked Geometry2 = identity at pos 0.5:0.5, so
  displacement = position - 0.5, unscaled). The halves slide apart ALONG the
  split line ((In)) and the incoming frame's halves slide back ((Out)); the
  split orientation MAY CHANGE at the cut (HV/VH). Every pane's motion is
  PARALLEL to its own split edge (builder-ASSERTED) -> panes never sample
  each other's output -> pure DOM compositing, engine SplitPanes. Shutter 0
  everywhere (no motion blur -- the geometry scramble IS the look).

Family B "offset panes" (32 = Easy Offset/Swinging Offset x long/Short):
  Two AEMask-gated wrap-OFFSETS (torus, no rig), same GLASS architecture ->
  engine GlassBeveled, using the NEW additive maskOut field (SPLIT masks can
  change at the cut; GLASS rows untouched).

Family C "slide" (40 = Slide 12 + Slide Short 12 + Cross 8 + Cross Short 8):
  4-5 masked wrap-Offsets = overlapping strip BANDS, GLASS-style
  time-staggered, each exactly ONE full wrap (0.5 -> 1.5, ends at identity).
  Direction via FULL-FRAME flip sandwiches; Cross interleaves flips so
  alternate bands counter-slide. Flips resolved ANALYTICALLY here (mirror
  the mask + negate the shift; parity-walked bottom-up, asserted balanced).
  -> engine GlassBeveled (bands OVERLAP and compound -> the filter chain).

Family D "perspective" (8 = Perspective/Short x Horizontal/Vertical 1-2):
  A masked-flip SANDWICH (one half of the frame mirrored for the whole
  window) around a 3-phase perspective move: plain zoom 100->300 into an
  edge-midpoint pin, then a WRAP-padded pan (Replicate 2 + Offset 0:0, NO
  mirrors) under a keyframed Corner Pin keystone that relaxes to identity
  across the A->B cut. -> NEW engine SplitPerspective (PerspectiveEase's
  evaluators; phase list per side + wrap tiles + the half-flip wrapper).

SFX by MEASURED (media, start 0, in-point 0, audio-clip window), asserted:
  A+B: Simple_SFX.mp3    win 0.88/0.44/0.48 -> sfx-split-simple-{88,44,48}
  C:   Skew_Simple_01    win 1.00/0.76      -> sfx-split-slide-{100,76}
  D:   Whoosh_02.wav     win 0.84/0.44      -> sfx-split-perspective-{84,44}

Hard-fails on any deviation (Rule 2). Replaces only category SPLIT rows.
```

**`_build-transform-rows.js`** (265 lines)

```text
_transform-clips.json -> 40 TRANSFORM rows (8 subgroups: 1/2/3/4 + Short twins).

Mechanism (all 40 assert-verified; effect set CLOSED = Alpha Adjust + Motion
Blur + Offset + Basic 3D + Geometry2 + H/V Flips, nothing else):
  - (In)/(Out) HST Adjustments: densely 25fps-baked 2D wrap-Offset curve (the
    push ARCS — both axes keyframed; (Out) starts multiple wraps out) + AE
    Motion Blur with KEYFRAMED Direction (tracks the path tangent) + Length.
  - Full-window "3D" HST Adjustment: Basic 3D Swivel/Tilt/Distance (sparse
    real-bezier curves, per subgroup) over Geometry2 uniform scale (rides
    Scale HEIGHT, SW static 100 — the PERSPECTIVE rule). Bottom-up: scale
    first, then pose.
  - Directions = flip sandwiches around identical curves (balanced pairs on
    (In)/(Out), a single flip on 3D whose parity must match). Preview-proved
    content stays UPRIGHT -> flips mirror the MOTION only; resolved HERE:
    H: dx -> -dx, blur angle phi -> 180-phi, swivel -> -swivel;
    V: dy -> -dy, phi -> -phi, tilt -> -tilt. (Scale/Distance invariant.)
  - Blur Direction is converted to blur-axis SCREEN angle phi = 90 - D (the
    OffsetSlide convention), velocities negated at conversion.

SFX by MEASURED (media, start, in-point, window), asserted:
  Long:  Camera_Flight_Long_01.mp3  @0.04 ip 0      win 1.52 -> sfx-transform-152.mp3
  Short: Camera_Flight_Short_01.mp3 @0.04 ip 0.1351 win 0.72 -> sfx-transform-short-72.mp3
  (0.04 lead baked into the lib file, 30ms tail guard — the GLASS rule.)

Hard-fails on any deviation (Rule 2). Replaces only category TRANSFORM rows.
Known pack quirks shipped as-is (real values): "Transform Short 1 - Up
Rightt (In)" subclip typo (classified by shape, not name); "Transform Short
3 - Right Down" cuts at 0.24 vs its siblings' 0.28 (hand-authored).
```

**`_build-turbdisp-rows.js`** (103 lines)

```text
Build the 10 Turbulent Displace rows from _turbdisp-clips.json and MERGE them
into library.json (replaces turbulent-* rows only).

Mechanism (per-clip extraction, 2026-07-05): NO plates — the whole family is
one HST Adjustment clip carrying AE Turbulent Displace (t2, full length) under
a split HST emboss+tint pin-light pair (t1, split AT the A->B cut):
 - Turbulent Displace: Displacement enum 9 = Horizontal / 8 = Vertical
   (1-based counting the popup separator, same convention as the Invert
   channel enum), Amount keyframed 0 -> 110..300 -> 0 peaking AT the cut,
   Size 10..80 by density, Complexity 5.1, Evolution keyframed 0 -> 1080deg,
   per-variant Random Seed, Pinning 0. The fractal noise field itself is
   procedural and NOT extractable -> engine reproduces it with feTurbulence
   driven by these real params; fidelity = approximate (Wave Warp precedent).
 - t1 window: same recipe as Glitch Offset/Monitor's verified HST — Tint
   black->GREEN white->BLACK + Emboss (dir 90 horizontal variants / 0
   vertical, relief 5..20, contrast 70) + Pin Light (Blend Mode 8+17 pair).
   Component order bottom-up: Tint first. t2 sits ABOVE t1, so the fringe
   applies to the content FIRST and the turbulence displaces the fringed
   frame (same ordering as Glitch Offset).
 - SFX: Displacement_Turbulent.mp3, per-variant in-point (trimmed copies).
```

**`_build-tvsat-rows.js`** (131 lines)

```text
Build the 9 TV Satellite rows from _tvsat-clips.json and MERGE into
library.json (replaces tvsat-* rows only).

Mechanism (per-clip extraction, 2026-07-05) — a composite of three
already-verified mechanisms:
 - t1 (full length): Texture Adjustment rack window at the variant's
   "Tint Mask <V> <n>" slot (1s slots at 133/135/../149) — per the Roughly
   numeric verification this is a SCREEN-FIXED luma matte revealing EFFECTED
   content: Tint black->black/white->WHITE @100 = GRAYSCALE (Invert-family
   decode) applied FIRST (bottom-up), then Turbulent Displace Amount 635 /
   Size 11.9 / Complexity 2 / Horizontal / Evolution 0->360 over the window /
   seed 0 — an extreme horizontal shred = the satellite-static look.
   (Short-2's in-point starts 0.08s before its slot, in the empty rack gap ->
   no matte for those frames; engine clamps.)
 - t2 (full length): HST "Offset" adjustment — keyframed full-frame wrap
   Offset roll (25fps x/y curve), applies to content + t1 window (both roll).
 - t3: the REAL "TV Satellite <V> <n>.mp4" plate PIN-LIGHTED on top (Blend
   Mode 8+17 pair, Monitor-verified darken/lighten implementation), split at
   the A->B cut with a MEDIA JUMP: segment 1 plays media 0->cut, segment 2
   plays media from 0.32 (all variants).
 - SFX TV_Satellite_{Max,Min,Short}.mp3, in-points 0 / 0.16 / 0.16 (trimmed).
```

**`_build-vhs-rows.js`** (149 lines)

```text
Build the 9 VHS rows from _vhs-clips.json and MERGE into library.json
(replaces vhs-* rows only).

Mechanism (per-clip extraction, 2026-07-05) — 4 adjustment layers + 1 plate,
the most stacked family; every piece maps to verified machinery:
 - t1 (full window): full-frame adjustment, components bottom-up
   Tint -> Unsharp Mask -> Turbulent Displace -> Solid Composite(black):
   Tint black->RGB(31,31,31) white->WHITE with KEYFRAMED amount (washed VHS
   lift); Unsharp Amount keyframed 0->500->0, Radius 4 (edge ringing);
   Turbulent Displace Amount keyframed 0->50->0, Size 100, Horizontal, with
   the noise field SCROLLED by keyframed "Offset (Turbulence)" (real scroll
   data — the same mechanism our engines emulate for Evolution). Solid
   Composite = black backing for unpinned edges (engine's wrap padding
   stands in; documented approximation).
 - t2 (window): Fast Blur 30 + Emboss 90/15/70 + the verified green/black
   HST Tint, bottom-up tint->emboss->blur; Blend Mode pair KEYFRAMED
   (18,0)->(8,17) at media t=0.36: NORMAL takeover first, switching to PIN
   LIGHT — the switch time only falls inside Max's window (Min/Short stay
   Normal for their whole window).
 - t3 (full window): keyframed 25fps full-frame wrap Offset roll (over
   content + t1 + t2).
 - t4: REAL `Gth - TV VHS <V> - <n>.mp4` plate PIN-LIGHTED on top (8+17),
   window starts at 0.04, media CONTINUOUS across the editorial split at the
   cut (Max 0.4 / Min 0.16 / Short 0.2).
 - SFX TV_VHS_{Max,Min,Short}.mp3 with real project timing: Max delayed
   0.08s (in 0), Min in-point 0.24 delayed 0.04s, Short in-point 0.16
   (baked into the trimmed lib copies).
```

**`_build-zoom-rows.js`** (511 lines)

```text
_zoom-clips.json -> 70 ZOOM rows (16 subgroups: Ease / Hit / Optics /
Optics Spin / Shake 1x-2x / Simple / Spin / Swinging, each + Short twin),
ALL on engine PerspectiveEase (center-pinned zoom phases + the new additive
`fx` overlay stages).

Mechanism (decoded 2026-07-14, all real per-clip data): every ZOOM variant =
the PERSPECTIVE phase architecture pinned at FRAME CENTER (anchor = position
= 0.5:0.5 everywhere):
 - plain (norm 100): raw Geometry2 zoom, curve endpoints >= 100.
 - rig2 (norm 200): Offset 0:0 + Replicate(2) + 4 quarter-Mirrors =
   mirror-padded half-size identity (the PERSPECTIVE rig, same constants).
 - rig3 (norm 300, Hit In's slam): Replicate(3) + third-line Mirrors, no
   Offset.
Variant kinds per family: In (plain whip-in | rig grow-to-rest), In Out
(plain | plain 300->100 — no rig needed, scale never dips), Out (rig2
recede | plain 300->100).
Family extras:
 - Spin / Optics Spin: keyframed Rotation riding the phases (CW/CCW pairs).
 - Swinging: multi-kf scale PENDULUM (Out variant's (Out) enters mid-flight
   via a negative-time kf).
 - Hit: the PERSPECTIVE Hit trio verbatim — linear slam + rig2-identity
   Shake jitter + Deviation fringe (Tint RED/BLUE + Emboss 45/10/70 + Pin
   Light; identical ARGB16 tint pair).
 - Optics (+ Spin): two full-window overlay adjustments -> fx stages:
   "Deviation" = Mettle SkyBox Digital Glitch, ONLY Color Distortion
   keyframed 0->50->0 (geometry-distortion group disabled; Master Amplitude
   static 100) = the DEVIATION-category radial spectral dispersion;
   "Optics" = PR Lens Distortion Curvature pulse (0->-67..-100->rest);
   In Impact adds a Geometry2 zoom pulse (100->158.8->100, shutter 80) on
   the lens clip; In Out 3 has NO Geometry2 phases at all — identity phases
   with PIECEWISE lens curves on the (In)/(Out) clips.
 - Shake 1x/2x: dense baked Position jitter + Rotation wobble riding BOTH
   phases (the SPIN-Shake pan convention) + ONE Deviation overlay carrying
   lens (0->-8->-1) AND color (0->50/75->0).

Track order (bottom-up) = fx array order: color glitch below lens; within
the Shake Deviation clip the component stack is glitch -> lens (bottom-up).

SFX by MEASURED (media, start, in-point, window), asserted per family —
lead baked, window-truncated, 30ms tail guard (see SFX table below).

Hard-fails on any deviation from the decoded recipe (Rule 2).
Merges into library.json (replaces prior ZOOM rows).
```

### QA

**`_qa-glassbeveled-sweep.js`** (52 lines)

```text
QA sweep for the whole GLASS category (Beveled, Beveled Short, Blocks, Blocks
Corner): side-by-side sheet per variant — pack preview (top, yellow) vs our
render (bottom, cyan) — frame-aligned from the transition start (demo lead-in =
18 frames, both ~30fps). Writes _qa/glassbeveled/sbs_<id>.png.
Usage: node _qa-glassbeveled-sweep.js [idFilter]
```

**`_qa-lightleaks-sweep.js`** (45 lines)

```text
QA sweep for the whole LIGHT LEAKS category (Light Leaks, Light Leaks Short,
Soft, Soft Short): side-by-side sheet per variant — pack preview (top, yellow)
vs our render (bottom, cyan), frame-aligned. Writes _qa/lightleaks/sbs_<id>.png.
```

**`_qa-melt-sweep.js`** (47 lines)

```text
QA sweep for the MELT category (Equidistant/RGB families incl. Soft): pack
preview (top, yellow) vs our render (bottom, cyan), frame-aligned.
Writes _qa/melt/sbs_<id>.png.
```

**`_qa-motion-sweep.js`** (49 lines)

```text
QA sweep for the MOTION category (single-scene moves/shakes): pack preview
(top, yellow) vs our render (bottom, cyan). MOTION previews are NATIVE 25fps
(no pulldown) - both sides sampled at 10fps. Writes _qa/motion/.
```

**`_qa-offsetgeo-sweep.js`** (45 lines)

```text
QA sweep: for every OFFSET sub-family, build a side-by-side sheet — pack preview
(top row, yellow) vs our render (bottom row, cyan) — frame-aligned from the
transition start, both at 200x112. Writes _qa/offsetgeo/sweep/sbs_<fam>_<dir>.png.
Default: all 19 families x the "Right" direction (+ any extra dirs passed).
Usage: node _qa-offsetgeo-sweep.js [dir ...]   (e.g. "Right" "Left Up")
```

**`_qa-perspective-sweep.js`** (52 lines)

```text
QA sweep for PERSPECTIVE Ease In / Ease In Short: pack preview (top, yellow)
vs our render (bottom, cyan), frame-aligned from the transition start.
Previews are 25->29.97 pulldown conversions — both sides sampled at 12.5fps.
Writes _qa/perspective/.
```

**`_qa-shake-sweep.js`** (45 lines)

```text
QA sweep for the SHAKE category: pack preview (top, yellow) vs our render
(bottom, cyan), frame-aligned from the transition start. SHAKE previews are
NATIVE 25fps (no pulldown) — both sides sampled at 12.5fps. NOTE: the pack
previews demo SHAKE over ONE continuous scene; our demos are A->B (the
Deviation split is a real editorial cut) — compare motion/fringe character,
not content. Writes _qa/shake/.
```

**`_qa-spin3d-sweep.js`** (79 lines)

```text
QA sweep for SPIN 3D (Center/Corner/Side Ease + Shorts): pack preview (top,
yellow) vs our render (bottom, cyan), frame-aligned from the transition
start. Previews are 25->29.97 pulldown — both sides sampled at 12.5fps.
NOTE: the Short PREVIEW FOLDERS carry a "(Slow)" suffix; sequence names and
preview filenames don't. Writes _qa/spin3d/.
```

**`_qa-split-sweep.js`** (64 lines)

```text
QA sweep for the SPLIT category: pack preview (top, yellow) vs our render
(bottom, cyan), frame-aligned from the transition start, both resampled at
12.5fps. Compare motion character (split orientation, shear direction,
stagger cadence, keystone swing, settle), not content — preview sources are
moving clips, ours are stills. Writes _qa/split/.
```

**`_qa-transform-sweep.js`** (48 lines)

```text
QA sweep for the TRANSFORM category: pack preview (top, yellow) vs our
render (bottom, cyan), frame-aligned from the transition start, both
resampled at 12.5fps. Compare motion character (push arc direction, blur
axis rotation, 3D wobble/keystone, zoom ride, settle), not content —
preview sources are real clips, ours are stills. Writes _qa/transform/.
```

**`_qa-zoom-sweep.js`** (51 lines)

```text
QA sweep for the ZOOM category: pack preview (top, yellow) vs our render
(bottom, cyan), frame-aligned from the transition start, both resampled at
12.5fps. Compare motion character (whip/recede smear, rig padding at the
cut, spin handedness, pendulum cadence, slam + fringe, lens bulge, jitter
ride, settle), not content — preview sources are real clips, ours stills.
Writes _qa/zoom/.
```

### Helpers and one-offs

**`_analyze-glassbeveled.js`** (41 lines)

```text
Summarize _glassbeveled-clips.json: per sequence, per (In)/(Out) clip — effect order,
each Offset's kf phase + mask geometry (bbox/center + straight-vs-curved corners),
so the mechanism can be decoded before building.
```

**`_analyze-offsetgeo.js`** (67 lines)

```text
Compare the Offset sub-families for ONE direction to decode what distinguishes
Simple / Ease / Bounce / Hit / Swinging / Warp (+ Short/Long). Prints per sub-family:
total duration, cut point, the merged Offset curve (seq-time -> shift x/y), the
Motion Blur direction + length curve, the Alpha Adjust opacity, and any extra clips.
```

**`_dbg-glassbev-comp.js`** (93 lines)

```text
Dump RAW component XML for the Glass Beveled 1 - Left (In) adjustment clip —
looking for effect MASKS (facet regions) that params() doesn't capture.
```

**`_dbg-glassbev-mask.js`** (91 lines)

```text
Dump the AEMask params of every Offset SubComponent on Glass Beveled 1 - Left (In)+(Out).
```

**`_dbg-offset-4k-audio.js`** (86 lines)

```text
debug: does the 4K project's "Glitch Offset - Nx" sequence carry SFX clips?
```

**`_dbg-offset-audio.js`** (39 lines)

```text
debug: what's inside the AudioTrackGroup of "Glitch Offset - 1x"
```

**`_dump-kf-raw.js`** (75 lines)

```text
One-off: print the RAW <Keyframes> + <StartKeyframe> strings for the Offset and
Motion Blur params of a named sequence's clips, so the temporal-bezier field
format can be decoded (the builder currently discards the handle fields).
```

**`_enrich-meta.js`** (74 lines)

```text
Adds/updates the `meta` block on every transition object in library.json so
a future Claude (or Mike) can SCAN the catalog and pick a fitting transition:
aspect ratios it's authored for, a plain-language description, energy, tags,
when-to-use, sound, and the engine file. Re-runnable.
```

**`_gen-lens-map.js`** (94 lines)

```text
Generates the radial displacement map for the OFFSET "Warp" lens distortion
(PR.ADBE Lens Distortion). Encodes an OUTWARD radial field with NONLINEAR
(∝ r²) magnitude so feDisplacementMap gives a real barrel/pincushion bulge
(uniform scale would not be a lens distortion). R = x-displacement, G = y,
128 = neutral. feDisplacementMap scale = Curvature·K (negative Curvature =
negative scale = inward sampling = center magnified = barrel bulge).

Writes a small PPM (smooth field, upscaled by the filter), converts to PNG via
ffmpeg, base64-inlines it into remotion/src/transitions/engines/lensMap.ts
(data-URI so the SVG feImage never waits on an external file load in Chromium).
```

**`_gen-sphere-map.js`** (69 lines)

```text
Generates the EDGE-ANCHORED spherize displacement map for the ZOOM Optics
lens (PR.ADBE Lens Distortion at BIG curvatures, decoded from the pure-lens
"Zoom Optics - In Out 3" preview 2026-07-14):

  Negative Curvature = a center-MAGNIFYING bulge whose frame stays FULL —
  the distortion is zero at the frame boundary (corner-normalized), maximal
  mid-radius. The OFFSET-Warp LENS_MAP (magnitude growing to the EDGE,
  calibrated at |k| <= 30) is the WRONG profile out at |k| 70-100: it pulls
  the whole frame inward into a black-bordered porthole (probe QA caught it).

Model: with n = frame offset in half-frame-height units and rn = r/R_corner
(corners at rn = 1): sample u = r + (c/100)·d, d_vec = n_vec·(1 − rn²).
c<0 ⇒ samples pull toward center everywhere INSIDE the frame ⇒ magnified
center, pinned corners, no fill ever exposed. c>0 (pincushion, only the
In Impact overshoot +71) samples outward — its zoom pulse covers the edge.
R = x-displacement, G = y, 128 neutral; same raster/overscan conventions as
_gen-lens-map.js. Writes remotion/src/transitions/engines/sphereMap.ts.
```

**`_layers.js`** (52 lines)

```text
For "Glitch Cinematic Bad Signal Max - 1": resolve each clip's SOURCE chain
(SubClip -> MasterClip -> media kind/name) to learn if t1/t2/t3 are adjustment
layers or nested sequences, and dump the Opacity blend-mode values + ALL
component MatchNames (incl zero-param) per clip.
```

**`_recipe-seq.js`** (63 lines)

```text
Full per-clip recipe for ONE sequence (source + every effect + key params).
Usage: node _recipe-seq.js "Glitch Cinematic Bad Signal Max - 1"
```

**`_summ-invert.js`** (54 lines)

```text
Condense _invert-clips.json -> per-variant frame schedule.
For each sequence: duration, adjustment-clip windows, and per 0.04s timeline frame
the set of ACTIVE ops (invert channel N when Blend With Original == 0; tint when
Amount to Tint == 100). Media time -> timeline: t_timeline = kf.t - inPoint + clip.start.
Also dumps distinct channel values + tint colors (decoded from Premiere packed number).
```

**`_summ-offset.js`** (31 lines)

```text
Summarize _offset-clips.json: merge the two t2 clips' keyframed wrap-Offset curves
into ONE sequence-time curve per variant (t_seq = clip.start + (kf.t - inPoint)),
report t1 HST window params, swapAt, duration, and sanity-check x is static.
```

**`_survey-remaining.js`** (167 lines)

```text
SURVEY (read-only, one-off): walk EVERY <Sequence> in the FullHD project and aggregate
per transition family: #variants, effect matchNames used, plate/footage clips referenced,
adjustment-layer usage, keyframed vs static params, audio presence.
Purpose: classify the remaining families as keyframe-only vs plate/procedural
(the "Blocks-type problem"). Writes _survey-remaining.json + prints a table.
Reads %TEMP%/sw.xml (same as the other extractors).
```

**`_verify-offset-sign.js`** (147 lines)

```text
Which emboss kernel sign/orientation matches the pack preview? (Glitch Offset,
2026-07-05 — settled the engine's "direction 180" reading: VERTICAL kernel,
green on TOP edges of bright objects. Mirrors the Invert numeric verification.)

Reconstruct: tint(green=1-luma) -> emboss(bias .5, contrast .6, relief d) ->
tiny +y shift -> Pin Light onto base, then compare MSE against the real
aberrated preview frames (raw_2..raw_4 = n1..n3; raw_1 = n0 clean base),
applying the t2 roll dy (small integer px search). MSE alone favors roll-only
(pulldown blending softens the target), so the decisive part is the residual
CORRELATION test at the bottom — plus viewing the amplified residual image
(green-above/magenta-below pairs on horizontal edges = vertical kernel).

Input frames (PPM) — regenerate with:
  ffmpeg -i "Swiftly .../Preview Transitions/GLITCH/Offset/Glitch Offset - 1x.mp4" \
    -vf "select='lt(n,4)'" -vsync vfr -pix_fmt rgb24 <dir>/raw_%d.ppm
then: node _verify-offset-sign.js <dir>
```

**`_verify-roughly-mech.js`** (75 lines)

```text
Glitch Roughly mechanism test (2x): are the plate-window regions in the preview
  H1: the PLATE's own pixels (white/gray chunks overlaid), or
  H2: CONTENT shown through the plate luma (effects-on-content, Blocks-style)?
Discriminators, measured inside each plate's white region at aligned frames:
  chroma  = mean(max(RGB)-min(RGB))   -> ~0 for H1 (plates are B/W), content-like for H2
  whiteness = mean luma                -> ~255 for H1 frag (plate is pure white), content-like for H2
Preview frame n (29.97) ~ media frame n/29.97*25; use n where that lands near an integer.
```
