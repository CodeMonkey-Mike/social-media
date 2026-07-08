# transitions — Remotion transition reference

Canonical reference for video transitions across all tracks. The top-level `../STYLE-GUIDE.md`
points here. This folder also holds **sample preview renders** of each chapter transition (drop
them here as we render them) so a transition can be PICKED BY WATCHING, not guessing.

> Package not installed yet: `npm i @remotion/transitions` in `video-creation/remotion/` when we
> build the first transition-using comp.

---

## Chapter / topic / slide transitions — pick exactly ONE per video

Choose a single presentation and use it for EVERY chapter change in that video. Mixing reads as
amateur; one consistent move reads as intentional.

### Safe defaults (CSS 3D, no special render config)

| Presentation | Import | Look | Key props |
|---|---|---|---|
| [slide](https://www.remotion.dev/docs/transitions/presentations/slide) | `@remotion/transitions/slide` | New scene pushes the old out | `direction`: from-left/right/top/bottom |
| [flip](https://www.remotion.dev/docs/transitions/presentations/flip) | `@remotion/transitions/flip` | 3D card flip | `direction` |
| [cube](https://www.remotion.dev/docs/transitions/presentations/cube) | `@remotion/transitions/cube` | 3D cube rotate | `direction` |

### Premium (HTML-in-canvas — REQUIRE a render flag, see below)

| Presentation | Import | Look | Key props |
|---|---|---|---|
| [book-flip](https://www.remotion.dev/docs/transitions/presentations/book-flip) | `@remotion/transitions/book-flip` | Page-turn with shading | `direction` (default from-right) |
| [swap](https://www.remotion.dev/docs/transitions/presentations/swap) | `@remotion/transitions/swap` | 3D perspective swap + floor reflection | `reflection` (0.4), `perspective` (0.2), `depth` (3) |

**Render requirement for book-flip & swap:** they draw HTML into `<canvas>`, which needs Chrome's
`chrome://flags/#canvas-draw-element` enabled and does NOT work in Firefox/Safari. Remotion renders
in headless Chrome, so this flag must be passed to the renderer or the effect breaks.
⚠ Confirm the exact Remotion render-config wiring (chromiumOptions / CLI flag) against the live
docs the first time we use one — don't assume the API; verify. Until then, default to a Safe pick.

---

## Micro / overlay transitions (b-roll cutaway / container in & out)

Not chapter changes. Keep a small consistent set:
- **fade** (`@remotion/transitions/fade`) — default for b-roll in/out.
- **wipe** (`@remotion/transitions/wipe`) — directional sweep.
- **clockWipe** / **iris** — reserve for ONE emphasis beat per video (e.g. a receipt "verdict").

Timings: `springTiming` on punchy beats, `linearTiming` (optionally with an Easing) on subtle ones.

---

## HARD RULE — never run a locked-audio talking-head spine through `<TransitionSeries>`

A `TransitionSeries.Transition` overlaps its neighbors and SHORTENS the timeline (Remotion's math:
40f + 60f scenes + 30f transition = 70f total). On a sync-locked talking head that drifts the
voice — the A/V desync we fight in the cutting pipeline, reintroduced at compositing.
- `TransitionSeries` is ONLY for self-contained sequential scenes (intro deck, montages).
- B-roll/containers over the face: the face is one continuous `OffthreadVideo`, never cut; the
  overlay animates its own in/out (interpolate/spring on opacity/clip). Same look, no swallowed
  frames, sync preserved.

Minimal sequential example:
```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>{/* slide 1 */}</TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={linearTiming({durationInFrames: 15})} presentation={slide()} />
  <TransitionSeries.Sequence durationInFrames={90}>{/* slide 2 */}</TransitionSeries.Sequence>
</TransitionSeries>
```

---

## Sample renders
_(none yet — render a short clip of each chapter transition here so Mike can pick by watching.)_
