# Swiftly-style transition library (Remotion)

Remotion re-creation of the **Swiftly Studio 850 Seamless Transitions** pack
(`video-creation/assets/transitions/Swiftly Studio 850 .../`, a Premiere `.prproj`).

## Architecture (data + code, joined by a registry)

| Layer | Location | Role |
|---|---|---|
| **Catalog (data)** | `assets/transitions/library.json` | single source of truth; one row per transition (category, variant, intensity, engine, params, sfx, duration). Mirrors `assets/music/library.json` etc. |
| **Engines (code)** | `remotion/src/transitions/engines/` | ~12 parametric components, one per Swiftly category. Each reads a row's `params`. |
| **Registry (bridge)** | `remotion/src/transitions/registry.ts` | loads `library.json`, binds each row's `engine` string → component (`ENGINES` map). |
| **Demo comp** | `remotion/src/TransitionDemo.tsx` | renders one row (`id` prop) between two real stills; `calculateMetadata` sizes it per row. |
| **Browser** | `assets/transitions/browse/<CAT>/<VARIANT>/gallery.html` | per-folder video galleries, mirroring the Adobe tree. |

**850 transitions = 850 JSON rows + ~12 engines, NOT 850 components.** Variants
(ZOOM Ease/Hit/Optics; GLITCH Blocks Max/Medium/Short/Strips) are the *same engine*
with different `params`.

## Construction types (how each Swiftly category ports)

- **geometric** (ZOOM, SPIN, SPLIT, OFFSET, SHAKE…): keyframe math → `interpolate()` + CSS transform + blur. **near-1:1**.
- **footage** (GLITCH, LIGHT LEAKS): real plate/displacement → reproduced procedurally or via `OffthreadVideo`. **near-1:1**.
- **shader** (GLASS, MELT, PERSPECTIVE…): lens/refraction → SVG `feDisplacementMap`. **approximate**.

## Current scope

**GLITCH / Blocks** proof-of-concept: engine `engines/GlitchBlocks.tsx`, 4 rows
(`blocks-max/medium/short/strips`), rendered between two `bittensor-for-the-future`
stills (`assets/transitions/lib/demo/`). Earlier seeds `ZoomHit/GlitchVhs/GlassWarp.tsx`
remain for folding into the registry as those categories land.

## Workflow

1. Add/edit rows in `assets/transitions/library.json`.
2. Render each: `npx remotion render src/index.ts TransitionDemo <out>/<id>.mp4 --props='{"id":"<id>"}'`.
3. Build the browser: `node assets/transitions/_gen-galleries.js` (writes a `gallery.html` per folder + posters).
4. Tune params live in Remotion Studio: `npm run studio` → `TransitionDemo` (set the `id` prop).
