# longform-edited · OVERLAYS

Overlay effects for the longform-edited track: visual layers that sit **ON TOP of the footage for a DURATION**,
not at a single cut. This is the key distinction from **TRANSITIONS** (film burn, cross-warp, dissolve,
book-flip — those fire AT a cut; see `broll-and-containers.md` + house rule #5).

> **An overlay and a transition are different devices and must NEVER be fired on the same frame.** A transition
> punctuates the *cut*; an overlay lives over the *sustained* footage between cuts. Conflating them (e.g. a
> light leak starting on the exact frame of a film-burn cut) is the bug this skill exists to prevent.

**Layer order — overlays render UNDER the text layer.** An overlay (light leak; future grain / vignette) is a
screen-blend / translucent layer, so it MUST sit **below captions and any on-screen text**, never above —
otherwise its warmth/texture tints and distorts the glyphs. **Captions are always the topmost content layer.**
In the comp the overlay component comes BEFORE `<Captions />` in the tree (verified: `LightLeak` precedes
`Captions`, so captions sit on top). Be deliberate about this when a caption and a light leak share a > 5s
face hold — the leak goes under the text.

## 1. Light leak (sustained-face warmth)
- **Trigger (applies to ANY light leak — the current Remotion-synthetic one AND any custom light-leak FOOTAGE
  we add later):** a light leak goes **only over a gated-face hold (house rule #6) longer than 5s.** That is the
  single condition. Short punctuation faces (< 5s) stay clean — **film-burn only, no leak.** (Mike, 2026-06-18:
  any leak, present or future/custom, is placed as if over a >5s face view; the source of the leak doesn't
  change the rule.)
- **Look:** slow-drifting, screen-blend warmth at **~0.3 opacity** (Mike, 2026-06-18: 0.15 was too subtle to
  see on screen — bumped to ~0.3 so it's visibly there without being garish). An ONGOING overlay, never a cut.
- **Placement = a short pulse in the MIDDLE of the hold (Mike, 2026-06-18).** Do NOT span the leak to the end —
  a leak that ends at the face-moment's end reads wrong. CENTER it on the hold midpoint, duration
  `min(holdLen − 2, 4)s`. Current comp (over the shifted face spans where `b−a>5`):
  `{ const m=(a+b)/2, d=Math.min(b−a−2,4); <LightLeak a={m−d/2} b={m+d/2} /> }`.
- **Renders UNDER all cover — right after `<Spine />`, before containers/diagrams/b-roll** — so it ONLY tints
  the bare FACE, never a chart/container/b-roll cutaway. It's part of the face presentation; any cover layer on
  top masks it (e.g. the CH7 plug charts mask the leak). **Captions still render ABOVE it** (text never tinted).
  (This supersedes the earlier "render on top, inset off the film-burn" approach — putting it under cover is
  cleaner and removes any film-burn collision automatically.)
- **Verify on a CHUNK, not a still:** render the 10s chunk of a >5s hold and compare a leak-OFF frame vs the
  leak-peak frame — the warm glow must be visible on the face (a still alone can't confirm a drifting overlay).

<!-- Future overlays (film grain, vignette, light flares, scanlines, etc.) get their own numbered rule here,
     each stating: trigger · look · placement (how it relates to transitions/cuts) · verify. -->
