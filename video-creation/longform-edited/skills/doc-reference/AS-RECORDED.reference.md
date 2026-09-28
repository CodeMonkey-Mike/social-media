# <project> - AS-RECORDED (build the edit to THIS, not the plan)

_REFERENCE SHAPE (skills/doc-reference, 2026-09-27). Copy this structure; replace the content. Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py` (run by the longform graph's `as_recorded` node). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence 700 ms -> burst removal x1 -> two-zone desilence 250 ms intro / 500 ms body @<split>s -> content cut x1). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/<scope>.<letter>.<stage>.mp4` - <seconds>s (<m:ss>), 1080p30. LOCKED.
- **Transcript (cue source):** `spine/<scope>.<letter>.<stage>.medium-words.json` (word-level, NOT hand-edited). Human-review breakdown: `spine/<scope>.<letter>.<stage>.segments.txt`.
- **Timecode chain:** `<scope>.c.desilenced.map.json` (blackout -> c) -> `<scope>.d.cleaned.mp4.cuts.json` (c -> d) -> `<scope>.e.desilenced.map.json` (d -> e) -> `<scope>.f.cut` (e -> f: one span removed). **Every timecode below is already a FINAL-spine coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced` -> `f.cut`.

## FACE windows

From `blackdetect` on the blacked picture (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face <n>% / cover <n>%. Zero orphans: every window lands on a scripted `[FACE]` beat.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-7.333 | "<the hook line as spoken>" | CH1 Beat 1 `[FACE]` |
| 2 | 28.167-31.933 | "<the thesis line as spoken>" | CH1 Beat 3 `[FACE]` |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- <TC> "Vprog" -> "vProg" (persona spelling).
- <TC> "<mishear>" -> "<right word>" (<why it matters>).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - <TITLE> (0.00-<end>) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "<quote the spoken line>" | KEPT (locked `[SAY-EXACT]`; minor wording drift: "<x>" for "<y>") |
| 12.40 | "<spoken>" | CHANGED ("<spoken word>" for "<scripted word>") |
| 20.75 | "<spoken>" | AD-LIB (not in the script) |
| 33.10 | (not said) | DROPPED: "<scripted line>" |

### CH2 - <TITLE> (<start>-<end>) · card ON "<CARD TEXT>" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 40.22 | "<spoken>" | KEPT · guard [!WARNING <n>] HELD |

### CH3 - <TITLE> (<start>-<end>) · card ON "<CARD TEXT>" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 137.58 | "<spoken>" | KEPT |

## Divergences from SCREENPLAY.md

- **Dropped:** <scripted lines not said> - RESOLVED by Mike <date> (<ruling>) | OPEN.
- **Added (ad-libs):** <TC> "<words>" - <keep / cut ruling or OPEN>.
- **Guards:** every `[!WARNING]` do-not-air claim: HELD / BROKEN at <TC> (<what was said, ruling>).

## Flags carried into the edit

- <TC> fact-framing trap: the VO says "<x>"; the on-screen graphic must show "<y>" (DATA.md row).
- <TC> ambiguous audio / low-confidence word: "<...>" (check at captions).
- `[VERIFY]` items from DATA.md still open at render: <list>.
- Runtime measured: <m:ss> against the <target> target (measurement only).
