# sfx-library: every sound effect is catalogued, picked from the catalog, never by listening

_Canonical, track-agnostic. Sibling of `../music-sourcing/SKILL.md` (which owns `assets/music/library.json`). Mike,
2026-10-20: "a library.json in the SFX folder in the same way we have it for the music, so it tells us when
something should be used; going forward we add to it."_

## 1. The rule

- **Every SFX file under `video-creation/assets/sfx/` has a library row.** A file with no row is an ORPHAN and
  `sfx_catalog.py check` fails on it. A new sound gets its row the day it lands, with the pick fields filled.
- **One folder per TYPE, each with its own `library.json`** (the hand-edited source): `Impacts/`, `risers/`, `accents/`,
  `braams/`, `drones/`, `downshifters/`, `ding/` (dings + shock stingers), `kinetic-text/` (the 2023 text-pop set),
  `halloween-2022/` (the sounds of the effects theme halloween-2022: `woosh9`). An effects THEME's sounds are their own
  set folder, every row carrying `device`.
  Raw originals and pre-trim versions go in that folder's `_source/` (never catalogued).
- **The root `assets/sfx/library.json` is the ONE file a picker reads.** Its `index` is GENERATED from every folder
  library plus its own `loose` list (the sounds that sit in the root because comps and scripts reference them by
  that path: `mix_short.py`, the shorts comps' `SFX_PUNCH`, the SKILL.md cue table). Never edit `index` by hand.
- **Pick from the catalog, no listening.** `trigger` says the on-screen event a sound is cut to, `best_for` says when
  to prefer it over its neighbours, `mood_class` is the hard-gate mood of `longform-edited.md` section 7,
  `attack_sec` says where to place the file so its loudest sample lands ON the event's frame, `tail_sec` warns when
  a ring will smear over the next cut. The edit plan names sounds by `id`.
- **Variety:** `used_in[]` is frozen history (as in the music library); live usage goes through the graph's usage
  ledger (`video-creation/assets/usage-ledger.json`, `../usage-ledger/usage-ledger.md`).

## 2. The tool

```
python video-creation/skills/sfx-library/scripts/sfx_catalog.py build     # rebuild the root index; measure any row missing
                                                                           # duration / attack / peak / tail (writes the folder libs back)
python video-creation/skills/sfx-library/scripts/sfx_catalog.py check     # SFX-CATALOG PASS|FAIL: orphans on disk, rows with no file
python video-creation/skills/sfx-library/scripts/sfx_catalog.py report [--type whoosh] [--mood hype] [--grep label]
```

`report` is the picker's view: one block per sound with its trigger and best-for. Run `check` after adding or
trimming anything; run `build` after editing any folder library.

## 3. Adding a sound

1. Drop the file in the folder of its type (make a new typed folder with its own `library.json` if none fits; copy a
   neighbour's `$doc` / `$schema_note` shape). Keep the original in `_source/` if you trim it.
2. Add its row: `id` (kebab, unique across the whole catalog), `title`, `file`, `type`, `mood_class` + `mood_source`
   (`description` = from the source page, `measured+name` = inferred, `ear` = Mike confirmed), `character`, `trigger`,
   `best_for`, `source`, `license`, `used_in: []`. Leave the measured fields out; `build` fills them.
3. `build`, then `check` must print `SFX-CATALOG PASS`.

## 4. Row shape (every folder library, every `loose` row)

| field | meaning |
|---|---|
| `type` | impact · riser · whoosh · accent · braam · drone · downshifter · ding · stinger · kinetic-text · reaction |
| `mood_class` | dark · tense · epic · hype · neutral (hard gate, never `dark` in a hype chapter) |
| `character` | what it sounds like, one line |
| `trigger` | the on-screen EVENT it is cut to ("role label B pops in", "chapter card lands") |
| `best_for` | when to choose it over its neighbours; name the twin files |
| `duration_sec` · `attack_sec` · `peak_dbfs` · `tail_sec` | measured by `build` (ffmpeg decode, mono 44.1k) |
| `source` · `license` | where it came from; Soundstripe SFX carry no Content-ID code, nothing to paste |
| `used_in[]` | frozen history |

Folder-specific extras stay (Impacts: `weight` / `low_end` / `tail`; risers: `shape` / `ends_in_impact`; takes:
`take` / `source_in` / `source_out`); the index carries only the common fields.

## 5. Known gaps (2026-10-20)

- The 18 root `loose` files and `ding/` were described from their names + measurements (`mood_source:
  measured+name`), not by ear. Mike corrects a row by editing it and setting `mood_source: ear`.
- `video-creation/SKILL.md` section "SFX" still lists files that are not on disk (Whoosh 1/4/5.mp3, Fast whoosh.wav,
  BRUH, WOW, Record Scratch 2, ding/slide, ding/swipe, inception-horns, drum-roll). The catalog is the truth; that list
  is stale.
- `kinetic-text/` holds the full 2023 sound set (23 sounds), every row with `device`. **2026-10-25: the MOTION side moved OUT
  of this catalog** into the EFFECTS library (`video-creation/assets/effects/library.json`: `devices` + `themes`, with the
  textures, graphics and the cue sheet under `assets/effects/themes/kinetic-text-2023/`; skill
  `video-creation/skills/effects-library/effects-library.md`). Mike: "they are just effects, regardless of sound or not". The
  SFX catalog owns the SOUND FILES and nothing else; an effect references its sounds by catalog id.
