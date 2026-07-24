# BROLL-PLAN — october-not-allowed-red (variant: full)

Batch `clarity-act`, clip #1. Base = `october-not-allowed-red-tightened-desilenced.mp4`
(1080x1920, 25 fps, **47.36 s**). Comp runs at 30 fps / 1420 frames (47.333 s, just inside the clip).

**Measured geometry:** the base is ALREADY composited vertical. Row-gradient scan at t=1/12/25/40 s all
agree on a hard seam at **y = 854** (screen-share above, webcam below). Content-zone b-roll therefore
covers 0..854. Caption centre at **y = 890** (below the seam, above Mike's hairline ~y1100, nowhere
near his eyes ~y1420).

**Screen-share content:** a single STATIC The Hill article ("Trump calls on Senate to pass the Clarity
Act"). It never changes across the clip and it is off-message for THIS clip (which is about October
demand, not the Clarity Act). Per the SKILL b-roll budget that is explicitly **not** a licence to
blanket: base still shows in real stretches, we just place the cutaways on the beats that earn them and
put the two code badges over the longest base stretches.

## Coverage budget (canonical rule: SKILL "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **15.50 s / 47.36 s = 32.7 %** | ~30 % (band 25-35 %) ✅ |
| base showing | **31.86 s = 67.3 %** | ~70 % (band 65-75 %) ✅ |
| distinct images | **7** (+1 thumbnail bg) | output of the budget, ~2.2 s per beat |
| full-screen beats | **3** (hook, climax, stress test) | 1-3 FIRM ✅ |
| max base gap | 6.14 s (34.60-40.74, badge-covered) | deliberate |
| reuse within clip | none, every beat has its own asset | ✅ |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| — | 0.00 | 1.20 | 1.20 | **BASE** | "like a lot of people are..." | open on Mike + the screen-share (frame-0 thumb is ONE frame, base from frame 1) | — |
| 1 | 1.20 | 3.40 | 2.20 | full | "...are **checked out** right now and they're not coming back" | HOOK: abandoned night trading floor, dead monitors, faceless silhouettes walking out toward a cold blue exit | `broll-onar-checked-out.png` |
| — | 3.40 | 5.70 | 2.30 | **BASE** | "in october. they're gonna buy in october." | base | — |
| 2 | 5.70 | 7.90 | 2.20 | content | "they're gonna cause october to be **green**" | glowing neon-green month grid, green candles ripping up out of it | `broll-onar-october-green.png` |
| — | 7.90 | 12.52 | 4.62 | **BASE** | "i mean personally i think something extraordinarily bad would have to happen" | base (Mike carries it) | — |
| 3 | 12.52 | 14.24 | 1.72 | content | "for october to be **red**" | same month grid drowned in blood red, candles crashing down through a storm | `broll-onar-october-red.png` |
| — | 14.24 | 17.78 | 3.54 | **BASE** | "because there's so many people that'll be buying back in october" | base | — |
| 4 | 17.78 | 20.72 | 2.94 | **full** | "**they're not even allowed it, not allowed it to go red**" (PEAK 1 / CLIMAX) | colossal faceless crowd silhouette surging into a wall of green light, a thin red barrier line shattering | `broll-onar-not-allowed.png` |
| — | 20.72 | 26.26 | 5.54 | **BASE** | "even if this really bad, how bad could it get? let's say this is the whole thing everybody always gives us an example." | base + BADGE `STRESS TEST` 23.60-26.10 | — |
| 5 | 26.26 | 28.60 | 2.34 | **full** | "**china invades taiwan.** okay that's, you know," (PEAK 2) | night strait, warship silhouettes on the horizon, red alert glow on the clouds, searchlights. No flags, no insignia | `broll-onar-stress-test.png` |
| — | 28.60 | 32.30 | 3.70 | **BASE** | "extraordinarily bearish. i still think there's gonna be a huge chunk of those" | base | — |
| 6 | 32.30 | 34.60 | 2.30 | content | "four-year cycle **zombies** that sold at the end of last year" | horde of faceless shambling silhouettes in fog, sickly green backlight, a broken 4-year dial behind them | `broll-onar-zombies.png` |
| — | 34.60 | 40.74 | 6.14 | **BASE** | "maybe half of them, maybe even 20 or 10%. they're still gonna buy back in october." | base + BADGE `10%` 37.30-39.60 (longest gap, badge instead of b-roll) | — |
| 7 | 40.74 | 42.54 | 1.80 | content | "wow, there's a **good deal**. let me buy back in." | faceless silhouetted hands reaching up to a blank glowing coin and a discount tag, gold-green light | `broll-onar-good-deal.png` |
| — | 42.54 | 47.36 | 4.82 | **BASE** | "we'll see what happens. maybe i'll be proven wrong, but i can't imagine a very very bad october." | close on Mike (the loop frame is his face, deliberate) | — |

Full-screen adjacency: no two full-screens are adjacent and every full->base gap is >= 1.5 s
(3.40->5.70 = 2.30 s, 20.72->26.26 = 5.54 s, 28.60->32.30 = 3.70 s). No sub-1 s flash anywhere.

## Frame-0 thumbnail

`thumbnail-onar.png` = generated background (burning green month grid + falling shattered red arrow +
faceless crowd below, empty dark sky in the upper third) with the hook title drawn in CODE on top
(never baked into the art):

- title `OCTOBER ISN'T / ALLOWED TO / GO RED`, chip `THEY ALL BUY BACK IN` (green).
- ONE frame only (frame 0). Base video from frame 1. No badge/overlay may start under it (first
  badge tIn = 23.60).

## Overlays / badges (never collide in time OR space)

| tIn | tOut | band | content | sits over |
|---|---|---|---|---|
| 23.60 | 26.10 | y300 (content zone) | `STRESS TEST` / `THE WORST CASE THEY ALL CITE` | BASE stretch 20.72-26.26 |
| 37.30 | 39.60 | y300 (content zone) | `10%` / `IS STILL A WALL OF BIDS` | BASE stretch 34.60-40.74 |

Badges never overlap each other in time (13.7 s apart), never overlap a b-roll beat, sit at y300 while
captions live at y890, and both start long after the frame-0 thumb.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own PEAK/ATTACK landing on the beat, not the file start (envelopes measured at 0.2 s
RMS): rapid whoosh peaks 0.10 s in, Cinematic Whoosh 02 at 0.80 s, Whoosh 06 at 0.60 s, Edgy_Riser at
5.0 s, TING has 0.75 s of leading silence, Cash Register attacks 0.15 s in.

| fires at | cue t | file | vol | why |
|---|---|---|---|---|
| 0.10 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 1.20 | 0.40 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | sweeps INTO the HOOK full-screen |
| 7.50 | 6.75 | `sfx/TING SOUND EFFECT.mp3` | 0.50 | attacks on the word "green" |
| 12.58-17.78 | 12.58 | `sfx/risers/Edgy_Riser.wav` | 0.30 | riser BUILDS INTO the climax |
| 17.78 | 17.78 | `sfx/Impacts/Impact_3.wav` | 0.46 | hard cut to the climax full-screen |
| 20.12 | 20.12 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.52 | the punchline "go RED" (biggest hit) |
| 26.26 | 25.66 | `sfx/Cinematic Whoosh 06.wav` | 0.78 | sweeps INTO the stress-test full-screen |
| 27.08 | 27.08 | `sfx/ding/sudden-shock.mp3` | 0.40 | lands on "Taiwan" |
| 32.30 | 32.20 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the zombies cutaway |
| 33.16 | 33.16 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.38 | lands on "zombies" |
| 41.45 | 41.30 | `sfx/Cash Register.mp3` | 0.70 | kaching on the word "deal" |

11 events / 9 distinct refs (10 counted by the gate, which also matches the risers/ path).
Verified on the FINAL render by aligned subtraction of the source audio (lag-corrected, gain-fitted):
every cue measures 6-16 dB above the codec residual floor, i.e. all 11 are actually audible. Integrated
loudness -17.5 LUFS, true peak -3.0 dBFS, zero clipped samples.

## Reference-image gate

Named projects/coins in this clip: **none**. It is a macro/tribal take (the only proper nouns are
China, Taiwan, and "four-year cycle zombies", which is Mike's label for a crowd, not a project).
Live check of `schedule-tweets/images/reference/` run this build: DogInMe, ElizaOS-ai16z-2,
ElizaOS-ai16z, LAB, bittensor-tao, bobo, carousels, housecoin, kappy, kaspa-logo, kasy, kroak, linea,
michael-saylor, nacho, slippy, toshi, troll, velvet. **No match is required by this clip's script, so
no beat is reference-gated.** Gate result: CLEAN.

## Caption corrections (STT only, applied after whisper-verifying the first full render)

Grouping / lowercase / colour spans from the canonical builder are untouched; only garbled words were
fixed, and the same edit was written to BOTH `captions.ts` and the comp's copy so they stay identical.

| t | builder output | corrected | why |
|---|---|---|---|
| 5.98 | "they're gonna cost" | "they're gonna cause" | second Whisper pass + the clip brief both say "cause" |
| 8.56 / 9.22 | "i think they" / "had something" | "i think" / "something" | "they had" is a garble and the two passes disagree, so the unverifiable word is dropped, not guessed |
| 18.48 / 19.44 | "allowed it, not" / "allowed it to" | "allowed, not" / "allowed to" | the climax line is "they're not even allowed to go red" |
| 45.56 | "a very, bad" | "a very, very bad" | the builder dropped the second "very"; both passes have it |

Final whisper-verify of the shipped render: 0.915 word similarity vs the caption text (all remaining
diffs are Whisper run-to-run variance: gonna/going to, 10%/10 percent, deal/team). Caption onset drift
median +0.24 s, p05 +0.00 s, so no caption ever appears after its word.

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (no Bitcoin symbol, no Ethereum diamond), any coin is BLANK and
generic, no real-person faces, crowds/zombies are faceless silhouettes, no lettering/words/numbers in
the art (all text is code-drawn). Every image is inspected before render.
