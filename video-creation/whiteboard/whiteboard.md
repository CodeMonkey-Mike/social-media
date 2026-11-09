# whiteboard — code-rendered explainer track (VO only, no camera, no generated images)

_Status 2026-10-30: STYLE EXPLORATION. Nothing here produces a video yet. The deliverable so far is the
style picker (`style-dashboard.html`) so Mike can lock a house look before any component kit is built._

## Why this track exists (the 2026-10-30 research, six reference videos)

Mike asked which "whiteboard / illustrated explainer" formats are feasible on our stack. All six were
watched frame by frame (frames kept under `%TEMP%\claude\watch-*` for this session only). Findings:

| Ref | Creator | What it actually is | Images generated? | Effort on our stack |
|---|---|---|---|---|
| 1, 2 | David Shapiro (`3199TC7Pt_o`, `VmrNsOVOAt4`) | 100% code-rendered SVG: rough.js-style wobbly strokes with a FIXED seed (no boil), two handwriting fonts, a reusable kit of 10-15 components (figure, robot mascot, repo, document, laptop, gear, bottle, conveyor, PR card, stack layers), typewriter text, stroke draw-ons, count-ups, particles along paths. ~4-6 scenes/min, 4-8 animated events per scene. Video 1 = every scene is a tile on ONE canvas, camera pans tile to tile, final zoom-out shows the grid; zero hard cuts. Video 2 = fixed camera, slide-out / fade-in scene changes, dry VO, no music. No webcam, no burned captions, no raster anywhere. | **None** | Medium build (component kit + scene manifest + strategist agent), ~zero per video. **Winner.** |
| 3 | Bitcoin Island (`nZBBt1R_DpI`) | ~220 AI stills (character-reference workflow, hero car drifts off-model late) each run through an image-to-video model for micro-motion (mouth, blink, 3-4 hand poses, head turn) + a slow editor push-in. Dip-to-black + dust overlay on EVERY transition (~10% of runtime is black), word-highlight captions, sparse music. | ~220 images + 220 i2v clips | Assembly trivial; cost = ~220 x 33 cr (Seedance 480p) ≈ 7,300 credits per video. Deferred. |
| 4 | SimpleProfessor (`KG8wHjcU1_U`) | Pure hard-cut slideshow of AI stills, zero motion, no music, no SFX. 227 stills / 17:48 = 12.75 per minute, median hold 4.5 s. Prompt reference tags leaked INTO the frames as text (`@character_2_lifter` 12:36, `@diagram_2_muscle_fiber` 7:16): no QA pass. Headlines + charts are generated inside the images. | ~230 images | Low build; cost = image generation (NOT the ChatGPT browser pipeline, which overloads at 25-30 per chat; Higgsfield image models with a character ref). Weakest product. Deferred. |
| 5 | Caleb Writes Code (`B18zBnjZKmc`) | LIVE screen recording of a human drawing on a tablet app on black (visible cursor, viewport zooms, partial letters), sped up ~5x, pasted screenshots, hard cuts, dry VO. Fixed 7-marker palette (white body, yellow titles, magenta flow, green good, red bad, periwinkle terms, grey ghosted). | None | Human hours, not a pipeline. A code-rendered facsimile = refs 1-2 with a dark theme (`blackboard-marker` style below). |
| 6 | FireHustle (`7KxsO5-zq0I`) | After-Effects-style MOTION GRAPHICS over a real presenter. NO AI images, NO i2v. The "consistent images" are Microsoft Fluent 3D emoji (MIT) in glowing discs + real brand logos + receipt screenshots; everything else is drawn geometry animated: ring fills (the 0:04 donut = a stroke-dashoffset arc to 20% + a count-up), packets along dashed paths, pool fills, pendulum rise/fall, highlighter sweeps on receipts, light leaks on webcam joins. ~90% of frames move. Continuous quiet bed, no burned captions. | **None** (downloaded assets) | Closest to longform-edited already. Delta = the Fluent emoji pack + denser mograph primitives (ring fill, counter, packet-along-path, highlighter sweep, glow tile) as an effects-library theme. **Winner #2.** |

Decisions from the conversation (Mike, 2026-10-30):
- Two winning directions: **Shapiro-class code-rendered whiteboard** (this track) and **FireHustle-class
  mograph density** (an effects theme inside longform-edited, not a new track). Refs 3 and 4 deferred.
- The whiteboard look must be **Mike's own**, not Shapiro's. rough.js is only the pen; the style is the
  background, ink, fill style, fonts, component designs, mascot, camera grammar and audio. Those are the
  knobs the picker varies.
- rough.js is installed in `video-creation/remotion` (`npm i roughjs`, pure JS, no native build; the
  earlier "3D" format that needed native packages is unrelated).

## The style picker (what exists now): TWO axes, DRAWING VOCABULARY x PEN

Mike's correction (2026-10-30, after the first nine samples): eight of nine looked alike because they
varied only the PEN (ink, wobble, fills, fonts) on ONE crude drawing vocabulary (box bodies, stick
figures). Shapiro's look is carried by the DRAWINGS: a protagonist horse with a curved body, mane,
tail, white hooves; people with hair variants, tapered shirts with sleeves, ties, glasses, hats; period
buildings, tractors with spoked wheels, wagons, a pram; a soft ground shadow under every standing
thing; semantic color (brown = the animal, periwinkle blue = every machine, gold = money/hay, red =
warning, cream = buildings). The pen is a small part of the style. So the picker now samples both:

Mike's second correction (2026-10-30): the goal is NOT Shapiro's style. The point of the horse was
that there are many ways to draw a person / an animal / an object that we were not seeing, so the
picker must MAKE a spread of drawing vocabularies and let Mike pick (or mix). Vocabulary and pen are
two separate decisions; the pen can be applied to whichever vocabulary wins.

```
video-creation/whiteboard/
  styles/vocabularies.json  AXIS A, the DRAWING VOCABULARIES (7): stick-hair · bean · geo-flat · pictogram · isometric · pixel · line-only
  styles/vocabularies.html  one draw-function set per vocabulary, each with its own natural pen, SAME scene (person, horse, vault, coins, tree)
  styles/styles.json        AXIS B, the PEN token sets (9): bg, ink, roughness, fillStyle, palette, fonts, caps, glow, paper, grid, mode
  styles/sample.html        the pen on a deliberately simple scene
  styles/vocab.html         the SAME pen on the stick-hair vocabulary (illustrated horse, people with hair, hay, tree)
  styles/_build/            generated pages (disposable)
  scripts/render_styles.py  Playwright screenshots everything at 1920x1080 -> samples/, then writes the dashboard
  samples/vocabulary-<v>.png   axis A        samples/<pen>.png + samples/vocab-<pen>.png   axis B
  style-dashboard.html      section A (vocabularies) + section B (pens); star, notes, Export JSON (localStorage, key v2)
```

The seven vocabularies, what each one IS (so a new one is added as an eighth, not by editing these):
- `stick-hair`: round heads, hair variants (cap / curly / bob / bun), tapered shirts with sleeves, stick limbs, the illustrated horse, ground shadows; wobbly ink + pastel fills.
- `bean`: no necks, tall pill bodies with the face ON the body, stubby capsule limbs, a plump horse with tufted mane/tail, cloud tree; clean 4 px outline.
- `geo-flat`: no outlines, no faces; circle heads, rounded-rect torsos, thick rounded limbs; the horse from rounded blocks; two tones per object.
- `pictogram`: everything a solid one-color glyph (airport signage), one accent color for the thing that matters; same-color 1.5 px stroke on every part hides seams.
- `isometric`: three-tone cuboids via one `cuboid(origin, w, d, h, tones)` helper on an iso dot grid; boxy horse, cube vault with the dial on the right face (`matrix(0.866 -0.5 0 -1 x y)`), cylinder coins, low-poly tree.
- `pixel`: text sprite maps (`'..HHHH..'` rows, one letter per palette entry) on a 22/24 px cell grid with `shape-rendering: crispEdges`; bitmap heading font (Press Start 2P).
- `line-only`: outlines only, no fills, one accent; hidden edges are NOT drawn (legs are open strokes from the belly down).

Adding a vocabulary = one entry in `vocabularies.json` + one `VOCABS['<id>'] = function () {...}` in `vocabularies.html`
drawing the same five things at the same positions (person x=380, horse centered ~900, vault 1300, coins 1620, tree 1800, ground y=880).

Run from the repo root: `python video-creation/whiteboard/scripts/render_styles.py [--only id,id] [--template sample|vocab|vocabularies|all]`.
Open `video-creation/whiteboard/style-dashboard.html` in a browser (never auto-opened; Mike opens it).

Candidate pens (ids): `paper-pastel` (the Shapiro-adjacent baseline, included to move AWAY from) ·
`navy-chalk` (house navy board, teal + gold hachure) · `blackboard-marker` (Caleb-adjacent, 7 markers,
no fills) · `kraft-ink` (kraft paper, zigzag fills) · `blueprint` (blue dot-grid, cross-hatch) ·
`flat-clean` (no wobble, rounded flat vector, no rough.js) · `neon-ink` (glowing strokes, the bridge to
mograph) · `marker-white` (thick marker + saturated fills) · `mograph-black` (the FireHustle direction).

### Decisions so far (Mike, 2026-10-30, after seeing section A + B)

- **Vocabulary: leaning to `stick-hair` (hand-drawn with hair).** Bean, isometric and pixel rejected as too
  playful; pictogram rejected as "more serious, but bland"; geo-flat and line-only set aside ("I don't want
  the other vocabularies"). Recorded as `status` / `status_note` in `styles/vocabularies.json`. Rejected and
  set-aside candidates are NOT rendered and NOT shown (the dashboard lists them in one grey line), their
  frames are deleted; the JSON entry stays so they are never re-proposed.
- **Pens eliminated: navy-chalk, kraft-ink, blueprint** (same mechanism, `status: rejected` in `styles/styles.json`).
- **Pen round 2 (added for "serious, not bland, not Shapiro" on the hand-drawn vocabulary):** `ink-wash`
  (warm paper, dark-navy ink, light wobble, muted solids, Fraunces serif heading) · `editorial-charcoal`
  (white, charcoal ink almost without wobble, two-tone restrained fills, Playfair heading + Source Sans
  labels) · `slate-board` (dark slate, off-white ink, SOLID muted-bright fills, not chalk hatching) ·
  `newsprint-accent` (cream, black ink, warm greys everywhere except gold + red accents). Pen still open:
  the six round-1 survivors (paper-pastel, blackboard-marker, flat-clean, neon-ink, marker-white,
  mograph-black) plus these four.
- Not done on purpose: a pen x vocabulary matrix (started, then dropped when Mike settled on one vocabulary).
  `penCompatible` in `vocabularies.json` is left in place in case a second vocabulary ever comes back.

### How a drawing (the horse, a person, a tractor) gets into the kit: three routes

1. **Hand-authored SVG paths, iterated against the render** (what `vocab.html` does; plausibly what
   "just Claude" means). The horse is one silhouette path (rump -> back -> neck -> head -> muzzle ->
   throat -> chest -> belly) plus mane band, tail, ear, four legs, hooves, eye/nostril/mouth, drawn via
   `rough.svg().path()` so it inherits the pen. Pass 1 was recognizable, pass 2 fixed the chest seam
   and the mane; a Shapiro-grade component is ~5-10 passes with a frame-QA look between each. Cost:
   zero credits, model time only. Every component is text, versioned, recolorable, reposable.
2. **Trace a generated flat illustration**: generate "flat vector illustration, side view, thick
   outline, solid fills, white background" (Higgsfield image model or ChatGPT), vectorize with
   `vtracer` (pip `vtracer` 0.6.15 is available, NOT installed; install with `--no-deps` per the
   torch-clobber rule) or potrace (not on PATH), recolor to the palette, then run the paths through
   rough.js. One image credit per COMPONENT (one-time), not per video. Paths come out as many small
   polygons; cleanup needed; the pen still unifies them.
3. **Open-licensed vector sets, restyled through the pen**: Open Peeps (CC0; hand-drawn people with
   hair, clothes, poses, mix-and-match, the closest ready-made match to Shapiro's cast), Open Doodles
   (CC0), unDraw, Humaaans, OpenMoji (CC BY-SA 4.0; has a horse), Twemoji (CC BY 4.0), Lucide / Tabler
   icons (ISC/MIT) for objects. Licence trail goes in the kit's README.

Rule for the kit: components are authored ONCE in a neutral form (paths + semantic color roles:
`ink`, `fillA`, `fillB`, `dark`, `light`), and the pen (style tokens) is applied at render time. That is
what lets one scene be re-rendered in nine pens here, and what keeps the vocabulary consistent across
videos.

### Reference study: "You Are The Next Horse" (Shapiro, `Kd8mpwU4-JA`, 10:39)

Same engine as his other two (jittered outlines, the same two hand fonts, typewriter text caught
mid-word, stick-leg humans, pan-between-tiles), but the richest asset library: the horse recurs in ~35
of 48 sampled scenes in 4-5 poses (standing, grazing from a bucket, trotting with mane up, saddled with
a rider, holding a "SHARE" certificate), period sets (1918 barn with dozens of horses, 1880s brownstone
street, fire department, Teamsters banner), pictogram charts (rows of horse icons vs tractor icons for
1960), a reusable checklist card (better / faster / cheaper / safer) shown for tractors and shown again
for AI, desks with lamp light-cones, a self-driving car, a pram. Ground line + soft shadow in every
scene. Verdict: the richness is in the LIBRARY (30-50 components, a protagonist, semantic color), not
in the engine. Our equivalent: a recurring crypto cast and real objects (vault, exchange, bank, ATM,
chart screens) in house semantic color (teal = Kaspa, gold = BTC, red = risk).

### Known gotchas baked into the samplers

- Never name a page-level constant `rough`: the rough.js UMD bundle owns that global (it blanked every frame once).
- An SVG `filter` on a zero-height element (a horizontal `<line>`) clips to nothing; draw a thin `<rect>`.
- `document.fonts.ready` can stall when a Google font 404s; every page marks itself ready after 8 s anyway.
- Shapes with no fill in `flat` mode get an ink stroke, otherwise the head disappears.
- Two overlapping same-color fills still show a hairline seam (anti-aliasing); give each part a 1-2 px stroke in its own color.
- Draw order IS the drawing: a joint hides only if the covering part is drawn after it (bean neck under body, far legs before the body).
- Pixel sprites: the anchor must use the SAME cell size as the sprite or the feet sink below the ground.
- Caps headings overflow 1920 px in display fonts: every heading carries `data-maxw` and `fitTexts()` shrinks it after fonts load.
- A LONG straight stroke comes out ruler-straight: rough.js scales a line's wobble DOWN with its length (`roughnessGain` 0.4 past 500 px, 1.0 under 200 px) and `preserveVertices` pins its ends, so a 1,100 px side of a loop had 0.0 px deviation (quant WB7, visual-qa 2026-11-05: "a CSS rounded rectangle"). Build any side longer than ~200 px from short segments joined on a seeded bounded random walk of +-2..4 px across the line (`harbour.tsx NetLoop`: `drift`, `seg`); each short segment then also gets rough.js's full bow.

## The first demo: `demo/whiteboard-demo-paper-pastel.mp4` (2026-10-30)

Mike's pick for the first demo: the **hand-drawn-with-hair vocabulary through the paper-pastel pen** ("paper and
pencil"). Every other pen and vocabulary STAYS in the picker as an option (a multi-chapter video may want a dark pen in
one chapter and a light one in another).

What the demo is: 15 s, 1920x1080 @30, 450 frames, no audio. One scene drawn on part by part the way a hand would:
heading types on, a person with hair draws on holding a phone, a dashed arc reveals and an envelope ("the fee") flies
along it into a vault that draws on and spins its dial, three coins pop with a check, a bar chart's axes draw and its
bars rise with a 20% count-up, "middlemen" is typed then struck in red, and a gentle push-in lands the payoff line.

Where it lives in Remotion (`video-creation/remotion/src/`):
- `whiteboard/pen.ts`: the pen tokens (mirrors ONE styles.json entry; `PAPER_PASTEL` today). A video imports a pen;
  every shape inherits it, so re-skinning a video is one import. Add a pen here only after it exists in styles.json.
- `whiteboard/Sketch.tsx`: ONE hand-drawn shape through rough.js used as a pure generator (`rough.generator()
  .toPaths()`): no DOM, deterministic per `seed` (no boil, identical across renders), multi-stroke off so a line draws
  once like a pen. Draw-on = SVG `pathLength="1"` + `strokeDashoffset = 1 - progress` (no path measuring); fills fade
  in behind the outline. Helpers `prog / easeOut / pop`. **Gotcha (quant WB2, 2026-11-04):** rough.js emits a separate
  `M` sub-path per curve / edge and Chrome restarts the dash pattern at every sub-path, so a LONG path (a fence rail of
  two arcs, a 300-degree loop) draws every piece at once from its own start (a rail section "floated on its own" mid
  draw-on). `Sketch sequential` reveals the sub-paths one after another like a pen (approximate lengths from the path
  data); opt-in so the shipped beats keep their frames. Use it on any stroke longer than a glyph (`FenceRing` rails,
  `LoopArc sequential`).
- `whiteboard/vocab.tsx`: the vocabulary as components, each taking the pen and a LOCAL time `t` (seconds since its
  cue) and drawing itself on part by part: `Person` (hair cap/curly/bob/bun, tapered shirt, tie, phone), `Envelope`,
  `Vault` (dial `spin`), `Coin`, `Check`, `Strike`, `BarChart` (bars rise by clip reveal so the outline never boils),
  `DashedArc` (left-to-right clip reveal + sketched arrowhead), `Type` (typewriter that types from the FINAL left edge
  so centered text does not shift), `CountUp`, `Shadow`. Geometry = the picker's `styles/vocab.html`.
- `WhiteboardDemo.tsx`: the storyboard is the `CUES` table (seconds). Re-timing = editing numbers, not code.
  Registered in `Root.tsx` as `WhiteboardDemo` (1920x1080 @30, `DUR` = 450).

Render (every Remotion render is chunked + queued, hard rule): from the repo root
```
set CHUNKED_RENDER_DIR=D:
emotion-tmp
python video-creation/skills/chunked-render/chunked_render.py --comp WhiteboardDemo ^
  --out video-creation/whiteboard/demo/whiteboard-demo-paper-pastel.mp4 ^
  --public-dir video-creation/whiteboard/demo/pub --crf 18 --no-audio --label whiteboard-demo
```
(absolute paths work too). `demo/pub/` is the comp's MINIMAL public dir (a `.keep` only): the default public dir is
the whole `video-creation/assets/` tree and bundling it filled C: (ENOSPC at 98%, 2026-10-30). Work dirs stay on C:, never D: (a removable drive, Mike 2026-11-08).
Still-frame QA without a render: `npx remotion bundle src/index.ts --public-dir ../whiteboard/demo/pub --out-dir
"%TEMP%/wb-bundle"` once, then `npx remotion still "%TEMP%/wb-bundle" WhiteboardDemo out.png --frame N
--public-dir ../whiteboard/demo/pub` per frame (stills and bundles are allowed outside the chunked path).

Lessons from the first build (keep):
- `npm install <pkg> --save` in `video-creation/remotion` PRUNES packages that were installed without being saved:
  `@remotion/transitions` (21 imports) vanished when roughjs was added. It is now in package.json at the core Remotion
  version (4.0.462). Never install anything there without `--save`.
- `@remotion/google-fonts` does not ship Shadows Into Light; the paper-pastel label face is **Kalam** in both the
  picker and the render (picker entry updated 2026-10-30).
- Typewriter centering uses a per-font average glyph width (Gochi Hand ~0.41 em, Kalam ~0.42 em); measure once per
  new font or the heading sits off-center.
- A camera push-in must be planned against the layout: 1.22x about the vault cropped the heading and the person;
  1.1x about (1100, 620) keeps everything in frame. Labels near the bottom must stay inside the zoomed safe area.

## Demo in the neon-ink pen: `demo/whiteboard-demo-neon-ink.mp4` (2026-10-31)

Mike wants neon ink for the upcoming Binance video (black + gold). `NEON_INK` is in `remotion/src/whiteboard/pen.ts`;
the demo composition now takes a `penId` prop (`WhiteboardDemoNeon` = the same 15 s storyboard through it). What the
pen changes in code: `fillStyle: 'none'` makes `Sketch` use a shape's fill color as its STROKE color (colored neon
outlines, nothing filled), `glow: true` wraps the scene in an SVG blur-merge filter, fonts come from the pen
(Rock Salt headings in caps at 50 px, Handlee labels), `light` = the background so faces stay hollow. Rock Salt is
very wide (~0.92 em per glyph): keep neon headings short.

## The paper-quant pen (2026-11-04, the `quant` video)

Mike wants half of the Quant video as paper-and-pastel whiteboard "with some orange", in quant.network's look (white page,
warm near-black Heebo headlines #43403E, one orange #F15A22 on the highlighted word, thin orange line-art diagrams). Added as
a NEW pen, never an edit to paper-pastel: `styles.json` `paper-quant` + `remotion/src/whiteboard/pen.ts` `PAPER_QUANT`
(`...PAPER_PASTEL` with ink #43403E, floor #F7F9FC, palette blue #DDD9D4 (machines, warm light grey so nothing competes
with the orange) · gold #F9C2A6 (money, pale orange) · red #F15A22 (the highlighted / hot thing, the brand orange) · green
#BFEBDC · brown #E7A77F · grey #E8E5E1; headings in the site's ORANGE #F15A22 (Mike, 2026-11-04, after the first sample: "the titles at the top in the orange font color that is on their website"), labels #5C5855; same fonts and wobble). Samples:
`samples/paper-quant.png` + `samples/vocab-paper-quant.png` (the picker renders it like any pen). Every other pen stays an
option. A beat names it in its brief (`pen: paper-quant`); the coverage check reads the pen list from pen.ts, so it passes.

## Test 2: `demo/whiteboard-test2-horse-15to38.mp4` (2026-10-30), a like-for-like re-draw

Mike's second test: reproduce the BEATS of 0:15 to 0:38 of Shapiro's "You Are The Next Horse" (`Kd8mpwU4-JA`) in
our vocabulary + pen, so the two can be compared side by side. Studied at 2 fps (50 frames, 0:14 to 0:39) + captions.
What his 23 s do, and what ours do at the same local times (t = original minus 15.0 s):

| t | his beat | ours |
|---|---|---|
| 0.0 | "today / 6.6 million horses in America" on screen; card 1 (sport: horse + rider jumping a bar, speed lines) draws, label types | same: `Card` + `Horse pose=jump rider speed` + `JumpBar`, `Type` label |
| 0.5 / 2.0 | card 2 (recreation: rider walking past a tree), card 3 (therapy: horse nuzzling a person in yellow, hearts) | `Horse pose=trot rider` + `Tree`; `Horse pose=graze` + mirrored `Person hair=bun shirt=gold` + `Hearts` |
| 5.0 | heading fades | `headingA` fade |
| 5.5 - 9.0 | pink heart + "we like them" type; "the economy needs them" types grey; red strike draws through it | `HeartIcon`, `Type`, `Strike` |
| 9.0 - 9.5 | hard cut: barn outline, hills, plow horse draw on | scene A fades 0.35 s; `Hills`, `Barn`, `Fence`, `Tree`, `Horse pose=trot plow` draw on |
| 9.6 / 11.5 | plow horse draws on standing, then PULLS the plow across the screen at a steady walk (about a third of the width by 0:38), leaving a furrow and dust | `Horse pose=pull plow` with `plowX` interpolated from 11.5 s, `Furrow` revealed behind the share |
| 10.0 | "a century ago" types top-left | same |
| 12.0 | the year rolls DOWN to 1918 (his shows 2008 -> 1918) | `RollNumber 2025 -> 1918` over 1 s |
| 15.0 - 17.0 | "26.7 million" types top-right while ~40 small horses populate the field; "horses and mules" types | `herdLayout(38)` pops in staggered, back of the fence first, then front; `Type` x2 |
| 18.5 | the count dims | `millionOp` fade |
| 19.0 | year flips to 1920; a half-dial gauge draws with ticks + needle | `RollNumber 1918 -> 1920`, `Gauge` |
| 21.5 - 23.0 | gauge fills to 89 %, "89%" counts, "draft power" types | `Gauge value` sweep (sector clip over a pre-drawn half-disc), `CountUp`, `Type` |

New vocabulary for it lives in `remotion/src/whiteboard/farm.tsx`: `Horse` (poses stand / trot / jump / graze as rigid
leg-group rotations about hip/shoulder pivots + a body bob; optional `rider`, `plow`, `speed` lines; `drawOn` or pop;
`hooves` / `detail` off for the herd), `JumpBar`, `Hearts`, `HeartIcon`, `Card`, `Barn` (gambrel roof, X door, X
window, silo with dome and bands), `Hills` (two fills + faint crop rows), `Fence`, `Tree`, `Gauge`, `RollNumber`,
`herdLayout` (seeded LCG, sorted back to front). Composition: `WhiteboardHorseTest.tsx` (`C` cue table), 705 frames.

Lessons (keep):
- A part that rides a moving group must be listed in the SAME order as the group it rides: the hoof array was in a
  different order than the leg array, so every swinging leg lost its hoof to another leg's pivot (invisible while
  standing, obvious when trotting or jumping). Checked at 2.6 s and 10.6 s after the fix.
- The herd (38 horses x 8 rough paths) renders fine; rough.js generation is memoised per component, so the cost is paid
  once per render worker, not per frame.
- A bash heredoc is the wrong tool for a 300-line TSX append (quoting); write a module file instead.
- **Read motion at the right frame rate.** The first pass sampled the reference once every ~13 s and I concluded the
  plow horse walked in place; the 2 fps pass showed it crawls across a third of the screen (first ~2 s standing). The
  watch script caps at 2 fps, but the downloaded source sits in its out-dir, so `ffmpeg -ss <t> -i <src> -vf fps=10`
  gives any rate when a motion question matters. Never infer motion from sparse frames.
- **Study the object before drawing it.** The first plow was primitives from memory (a trapezoid and two sticks) and
  read as a shape dragging behind the horse. Cropping and enlarging the reference (collar, traces along the body, beam
  with a gauge wheel, two long handles, a share with dust) made the second pass readable in one iteration. Same for the
  therapy card: his person's hand is ON the horse's nose; ours had a gap until `Person reach` + moving the pair together.
- Contact and proximity between two drawn things is part of the beat (petting, pulling); place them from the reference's
  geometry, not from a tidy layout grid.

## Direction (Mike, 2026-10-30): whiteboard beats INSIDE longform-edited videos, 15-30 s per video to start

**Built 2026-10-31 for the first real beat (binance, longform-presentation standard format, neon-ink):** the beat
contract is the shared skill **`video-creation/skills/whiteboard-beat/whiteboard-beat.md`** (both longform tracks:
canvas per track, pen, cues, the clip rules) and the builder is the shared agent
**`.claude/agents/shared/whiteboard-builder.md`** (Fable at max effort, Opus fallback automatic): it designs the
storyboard, authors the kit objects the scene lacks, writes the Remotion scene comp and still-frame QAs it; the
caller renders through chunked-render and composites. The manifest-only `whiteboard-strategist` + comp-builder split
sketched below is the LATER shape, once the kit is rich enough that a scene is placement alone. The first beat shipped
the same day (binance, 19 s, `remotion/src/whiteboard/beats/BinanceSigning.tsx`, kit `crypto.tsx`: wallet, key, paper
stack, hooded attacker, contract box, calendar, burst arrow, Ethereum mark, money count-up); its lessons (explicit
decimal points, word gaps, push-in margin, visual-qa after the builder's own stills) are in the skill's "Lessons".

Not a separate VO-only track yet. The first real use is a `whiteboard` COVER TYPE in longform-edited: in a few of the
next videos, one cover beat of 15-30 s (2-4 scenes) is drawn on under Mike's voice instead of b-roll / a container.
Why this ramp: low risk, real retention data on exactly those seconds, and every object authored for one video joins the
kit for the next (the library is the asset; his looks better only because his has been through more videos).

How it plugs into the existing graph (nothing here is built yet; build it on the first video that asks for it):
1. **COVER-PLAN**: `coverage-strategist` may mark a beat `type: whiteboard` with a one-line scene brief (what is drawn,
   what moves, the cue words). Same budget rules as the other cover types; a whiteboard beat replaces b-roll, it is not
   added on top.
2. **Scene manifest**: a `whiteboard-strategist` (Fable advisor, read-only, JSON out) turns the brief + the AS-RECORDED
   word timings into a manifest: elements from the kit (ids + positions + style roles), cues in seconds taken from the
   words, the pen. Mike gates it with the blueprint (EDIT-PLAN), no extra gate.
3. **Build**: `comp-builder` drops a `<WhiteboardScene manifest=...>` (to write: a thin wrapper over
   `remotion/src/whiteboard/{Sketch,vocab,farm}.tsx` that maps manifest cues to local `t` per element) into the comp at
   the beat's frames. No PNG assets, nothing to source, nothing to license. Still-frame QA by `visual-qa` on 3-5 frames
   of the beat (text in frame, no overlaps, hooves on legs) before the draft render.
4. **Pen per video, decided in the plan**: the main channel's longform look is dark (navy near-black, Pixar b-roll). A
   white-paper scene dropped into it is a tonal jump. Two options to test on the first video: (a) the paper-pastel
   scene inset as a full-frame "paper sheet" that slides in like a container; (b) a dark pen from the picker
   (`slate-board` / `navy-chalk`) so the beat sits in the video's own tonality. The picker keeps every pen for this reason.
5. **Sound**: whiteboard beats take the house SFX like any other cover (draw-on ticks / pops from the SFX catalog, never
   by listening); if a pen-scribble sound is wanted it is sourced into `assets/sfx/library.json` first.
6. **Kit growth**: every new object is authored once in `remotion/src/whiteboard/` with fixed seeds and role colors,
   studied from a reference crop (never from memory), iterated against stills; the kit README lists what exists.
   Next authored pieces already known: an ARTICULATED horse head (body / neck / head as overlapping parts), 3 more herd
   poses, and the first dozen objects from Mike's world (exchange, bank, ATM, chart screen, wallet, phone, laptop).

Then, once a few beats have shipped, the standalone VO-only whiteboard video (a whole chapter or a whole short) is the
same machinery with the camera grammar (tile canvas + pans) added.
