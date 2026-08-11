# python EP01 — TRANSITIONS plan

_Three-bucket policy (canonical: `../../../assets/transitions/README.md` + `longform-edited.md` #5).
**This video deliberately does NOT use the three-bucket policy.** See the waiver below; it is a
per-video decision by Mike and it wins for this video (`screenplay.md`: "when a rule here conflicts
with a project's own decision, the project decision wins for that video")._

**Transition SOURCE prefix:** `rmn:` 📦 out-of-the-box `@remotion/transitions` · `lib:` 🧩 our
transition library · `hand:` ✋ hand-rolled overlay code.

---

> [!WARNING]
> ## ⛔ WAIVER — plain crossfade everywhere (Mike, 2026-08-05). Do not "fix" this.
>
> **The decision:** every transition in this video is `rmn:fade`, the stock `@remotion/transitions`
> crossfade. Nothing from the transition library, no glitch, no film burn, no MELT, no SPIN, no cube
> or flip cards. Mike's words: "just use the traditional crossfade that comes from Remotion, we don't
> need anything fancy from our library, it should be a much simpler and professional feeling."
>
> **What this overrides, explicitly:**
> - **`longform-edited/CLAUDE.md` PRE-RENDER GATE item #3**, which says FACE cuts must use the video's
>   picked film-burn or Blocks-Max glitch and "**NEVER a plain cross-fade to the face**". This video
>   uses a plain crossfade to the face, on purpose. Gate item #3 is **WAIVED for this project only.**
> - **Bucket 2 (glitch library) and Bucket 4 (MELT / SPIN marquees)**: unused, deliberately. There are
>   no AI-still ingresses in this video to carry them (see BROLL-PLAN), and the marquee diagrams get
>   their impact from their own build-in animation instead of a transition.
> - **Bucket 1's card presentation**: cards use `rmn:fade`, not cube/slide/flip.
>
> **Why it is not a violation:** gate #3 exists to stop lazy cross-dissolves from flattening a
> hype-register video. This is the calm-authority AI-engineering channel, the register is deliberately
> one notch down (SCREENPLAY: "no epic declamation, no rising-tide build"), and the music plan is five
> subtle beds with no epic hits. A glitch hit here would fight the video. The waiver is coherent with
> the video's whole design, not a shortcut.
>
> **Also waived by the same decision:** the `~15-20% punch-in on face beats > 2s` from gate #3. Face
> beats hold clean. (If a punch-in is wanted later it must still snap to a jump-cut anchor from
> `spine/ALL.c.desilenced.map.json`, never an arbitrary time.)
>
> **Lint consequence:** `node skills/lint-transition-assets.js` compares the comp against this file.
> With no library transitions planned, it has nothing to match and should pass trivially; if it flags,
> the comp has picked up a library transition that does not belong. Declare nothing in
> `// TRANSITIONS_WAIVED:` for library ids, because none are planned.

---

## 1. Chapter / title cards → `rmn:fade`

Cards ON at four points (the bed-change map in SCREENPLAY's MUSIC-MOOD-PLAN):

| TC (final spine) | Card | Note |
|---|---|---|
| 0:33.7 | **LEARNING PYTHON FOR AI ENGINEERING** (the video title card) | Lands mid-FACE-window-2, over the first ~1.2 s of "So I'm going to be making these videos". There is only a 0.14 s gap at the chapter boundary, far too short to hold a card, so the card must overlay the face and speech. It is also what hides the face-to-face cut across the CH1/CH2 boundary (AS-RECORDED, FACE windows note) |
| 2:32.2 | **WHAT YOU ACTUALLY NEED** | Doubles as the CH3 skip target; the YouTube chapter marker goes here |
| 3:35.5 | **BUILD ONE PROJECT, FOUR TIMES** | |
| 4:22.8 | **THE ONE RULE** | |

Each card: `rmn:fade` in and out, ~0.35 s each side, held so the text is legible for **at least 1.0 s**
at full opacity (chapter-card minimum). Self-contained scene, never wrap the locked spine in
`TransitionSeries`.

## 2. Glitchy-fast hits → **NONE** (waived)

No AI/atmosphere stills in this video's cover plan, and no glitch library use. Bucket empty by design.

## 3. Face + b-roll + containers → `rmn:fade` everywhere

| Cut type | Transition | Duration |
|---|---|---|
| COVER → FACE (7 windows) | `rmn:fade` | 0.30 s |
| FACE → COVER (7 windows) | `rmn:fade` | 0.30 s |
| container → container (spotlight swap) | `rmn:fade` | 0.35 s |
| container → b-roll / b-roll → container | `rmn:fade` | 0.40 s |
| into a card, out of a card | `rmn:fade` | 0.35 s |

One move, one duration band, whole video. A container may still animate its own contents in (build-in,
count-up, layer stacking); that is composition animation, not a transition, and it is unaffected by
this waiver.

## 4. DIAGRAM / CHART marquees → **NONE** (waived)

The three marquees (abstraction ladder, four groups, four-layer stack) earn their impact from their own
`useCurrentFrame` build-in animation, landing element-by-element on the spoken words. No MELT, no SPIN.

---

## Captions

**NONE anywhere in this video** (Mike, 2026-08-05). No caption track is built, and the
`captions-builder` step is skipped entirely. Recorded here as well as in AS-RECORDED because the
comp-build checklist otherwise expects a caption layer and its gating rules.
