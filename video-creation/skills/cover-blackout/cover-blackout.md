# cover-blackout — the canonical face-gating (black-screen) skill

Reusable, track-agnostic procedure for baking **black over the video during every COVER (non-FACE)
beat**, while leaving the audio completely untouched. Generic by file path: point it at any clean
spoken spine.

> **Why this exists.** In the `longform-edited` track Mike records the *whole* chapter to camera, but
> only the `[FACE]` beats may ever show his face. The `[COVER]` beats are him reading off-screen and
> must NEVER be seen (house rule: "Mike recorded reading off-screen, never show that"). Until now the
> only thing hiding the COVER face was b-roll layered on top in the comp, so any gap in b-roll
> coverage could leak the off-screen-reading face. This skill bakes black UNDER everything as a base
> layer: the spine file itself is self-safe, and any uncovered gap shows black, not the face.

This is the third sibling of **defumbler** and **desilencer** — one cross-cutting operation, one
tool, FACE/COVER spans as the only input. (See the repo rule: factor cross-cutting ops into ONE
track-agnostic skill, not inline copies.)

---

## HARD RULES (non-negotiable)

- **Paint, never cut.** The tool draws a full-frame black box gated by `enable` (ffmpeg drawbox
  `thickness=fill`); it removes NOTHING. So audio is copied verbatim and A/V cannot drift. Never
  implement face-gating by cutting + reinserting black — that risks drift and clipped audio.
- **Audio is never touched.** This op only changes video. The VO (and later the music/SFX it gets
  mixed with) is identical before and after.
- **Every blackout edge sits INSIDE a silence gap.** Use the same primitive as the defumbler: place
  each toggle at the midpoint of the silence between the last FACE chunk and the first COVER chunk
  (and vice versa), read from `chunk_map`'s `sil_before`/`sil_after`. This guarantees no half-lit
  face frame flashes at the on/off boundary.
- **Runs AFTER defumble (stage b); map FACE/COVER on the defumbled spine, never on the raw** (defumble
  shifts every timecode). Desilence (stage c) can run either before or after this — the baked black
  survives a later desilence because the desilencer cuts A+V together. In the smartmoney-backing-kaspa
  workflow desilence is deferred, so the order is defumble → blackout → (later) desilence. Whichever
  spine you feed this tool, map FACE/COVER on THAT spine.
- **COVER is the default; FACE is gated and sparse** (screenplay.md Convention 3). Expect most of the
  runtime to go black. That is correct, not a bug — the face is punctuation.

---

## Procedure

**Input:** a clean spoken spine (defumbled, ideally desilenced) + the screenplay's `[FACE]`/`[COVER]`
tags for that chapter.

**1. Build (or reuse) the chunk map of the spine:**
```
python <repo>/video-creation/skills/defumbler/scripts/chunk_map.py "<spine>.mp4"
```
Read `<spine>._chunkmap.txt` (text per chunk) + `._chunkmap.json` (silence math).

**2. Tag each chunk FACE or COVER** by matching its text to the screenplay's `[FACE]`/`[COVER]`
lines. Consecutive COVER chunks group into one blackout span.

**3. Derive each blackout span's edges inside silence.** For a COVER run between FACE_A and FACE_B:
`start = midpoint(silence after FACE_A's last chunk)`, `end = midpoint(silence before FACE_B's first
chunk)`, from the JSON `sil_after`/`sil_before`. A COVER run at the very head/tail of the file starts
at 0 / ends at duration.

**4. Render once:**
```
python <repo>/video-creation/skills/cover-blackout/scripts/blackout_spans.py "<spine>.mp4" \
    --out "<spine>.blackout.mp4"  --cover a-b --cover a-b ...
```
(Or `--face a-b ...` to pass the KEEP spans instead and let the tool black the complement.) Audio is
copied; the tool prints the % of runtime blacked and confirms zero drift.

**5. QA — verify by FRAME, not by trusting the math.** Extract a still from the middle of each
blackout span (must be **pure black**) and from the middle of each FACE beat (must show the **face**),
and confirm the output's audio duration equals the input's (paint = no length change, drift ~0):
```
ffmpeg -y -ss <mid_of_blackout> -i "<spine>.blackout.mp4" -frames:v 1 black_check.png
ffmpeg -y -ss <mid_of_face>     -i "<spine>.blackout.mp4" -frames:v 1 face_check.png
```

---

## Naming convention

Each spine-prep stage is named after the skill that produced it AND prefixed with a lowercase stage
letter (a/b/c…) so the files sort in pipeline order in a file browser (plain alphabetical would put
"blackout" above "defumbled"). The chain is then self-documenting:
`<CH>.mkv` (raw) → `<CH>.a.defumbled.mp4` (defumbler) → `<CH>.b.blackout.mp4` (this skill) → later
`<CH>.c.desilenced.mp4` (desilencer) if/when run. Working spines live in the project's `spine/` folder.
Sidecars carry the same stem (e.g. `<CH>.a.defumbled._chunkmap.txt`, `<CH>.b.blackout.mp4.cover.json`).

## Notes / learnings (append as we learn more)

- 2026-06-24: Skill created (named `cover-blackout` by Mike) and validated on
  `longform-edited/media/smartmoney-backing-kaspa/CH1`. CH1 = FACE head ("Let's start at the very
  top...") + FACE tail ("Somebody with serious size...") with the whole 28M-buy / custody / 42M-coins
  middle as COVER → one blackout span 13.259-63.879 on the defumbled spine (paint method, audio
  untouched, 0ms drift). Recurring ask across prior videos that had never been factored into a tool.
