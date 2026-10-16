# longform-edited · OVERLAYS

Overlay effects for the longform-edited track: visual layers that sit **ON TOP of the footage for a DURATION**,
not at a single cut. This is the key distinction from **TRANSITIONS** (film burn, cross-warp, dissolve,
book-flip — those fire AT a cut; see `../broll-and-containers/broll-and-containers.md` + house rule #5).

> **An overlay and a transition are different devices and must NEVER be fired on the same frame.** A transition
> punctuates the *cut*; an overlay lives over the *sustained* footage between cuts. Conflating them (e.g. a
> light leak starting on the exact frame of a film-burn cut) is the bug this skill exists to prevent.

**Layer order — overlays render UNDER the text layer.** An overlay (light leak; future grain / vignette) is a
screen-blend / translucent layer, so it MUST sit **below captions and any on-screen text**, never above —
otherwise its warmth/texture tints and distorts the glyphs. **Captions are always the topmost content layer.**
In the comp the overlay component comes BEFORE `<Captions />` in the tree (verified: `LightLeak` precedes
`Captions`, so captions sit on top). Be deliberate about this when a caption and a light leak share a > 5s
face hold — the leak goes under the text.

## 1. Light leak (FACE punch-in on a desilencer join) — LIBRARY footage, rotated (Mike, 2026-10-07)
> A video run with **face style `glitch`** (`run.py --face-style glitch`, Mike 2026-10-16) carries NO light leaks on its
> punches: each punch gets a random Glitch Offset / Glitch Blocks hit across the join instead, and every face cut-in is a
> random Split Swinging Offset (comp-build.md section 5). Everything below is the default `leak` style.
> **Light leaks stay the DEFAULT for every video.** `glitch` is a per-video exception Mike chose for TAO because the
> topic is AI-heavy and glitch hits suit it; only switch it on when Mike asks for it (2026-10-16).
- **Source: the transition library's LIGHT LEAKS family** (`assets/transitions/library.json`, 34 clips in four looks:
  Light Leaks 1-8 at 1.12 s, Light Leaks Short 1-8 at 0.4 s, Soft 1-9 at 1.44 s, Soft Short 1-9 at 0.4 s; browse them in
  `assets/transitions/browse/LIGHT LEAKS/gallery.html`; Remotion engine `transitions/engines/LightLeaks.tsx`). The
  Remotion-synthetic `<LightLeak>` glow is RETIRED for this track (it was the mid-hold pulse on holds over 5 s).
- **Trigger = a PUNCH-IN inside a face window, and a punch-in lands ONLY on a desilencer / defumbler JOIN** inside that
  window (`spine/jumpcuts-final.json`, written by `scripts/list_face_joins.py`, frame-exact; a join within 0.5 s of the
  window's edges is not a punch point, and two candidates closer than 1.5 s keep only the first). The jump cut is already in
  the footage, so the ~15-20% scale step and the leak sit on a cut the viewer expects. Successive punch points in one window
  ALTERNATE: step in on the first, step back to the base frame on the next, in again on the third (never compound the zoom).
  **A face hold with NO interior join gets NO punch and NO leak.** Hold length no longer matters.
- **Placement:** the leak is a TRANSITION row in `TRANSITIONS.md` bucket 3 (`bucket: face`, `role: punch-leak`,
  `source: lib`, id `lib:lightleaks-*`), its flash peaking ON the join frame, the punch-in stepping on the same frame
  (`[PUNCH-IN]` + `[LIGHTLEAK]` events in EDIT-PLAN.md, seeded by `gen_editplan.py` from the joins file). Screen blend,
  real footage, under the captions.
- **Variety (usage ledger slot `face_leak`, GATED):** each video picks a SET of 3 or 4 leak ids from the family and cycles
  them across its punch points (one look per video is fine, mixed looks are fine). The ids the previous video used are
  BLOCKED; prefer `fresh`, then least recently used (`usage_ledger.py report --what transitions`, slot `face_leak`). The
  transition-strategist picks the set; the graph's `transitions` node fails a repeat without a waiver.
- **Verify on a CHUNK, not a still:** render the 10 s chunk around a punch point: the step lands on the join frame (no
  mid-word jump), the leak peaks on it, captions stay un-tinted on top.

<!-- Future overlays (film grain, vignette, light flares, scanlines, etc.) get their own numbered rule here,
     each stating: trigger · look · placement (how it relates to transitions/cuts) · verify. -->
