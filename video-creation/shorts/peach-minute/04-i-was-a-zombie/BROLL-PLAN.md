# BROLL-PLAN - peach-minute / clip 04 / `04-i-was-a-zombie`

Contract: `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md`
Budget rule: `video-creation/SKILL.md` -> "B-roll coverage budget (HALVED 2026-07-14)"
Spine: `preview.mp4` (54.227 s, 1080x1920, 25 fps source; comp renders 30 fps). Do NOT re-cut.

Title (Mike, verbatim, frame-0 cover): **"Kaspa $1 by the end of the year"**

## Measured base layout (this clip)

- Screen-share / webcam **seam = y 854** (green-screen onset scan at t=2/9/18/26/33/42/50 s: identical
  every frame). Content-mode b-roll covers 0..855.
- Caption centre **capY = 925** (71 px below the seam, over his hair, ~500 px above his eyes ~1450-1520).
- The content zone is a **static** HTML card deck for the whole clip: "Three Paths for Iran /
  Bitcoin-Kaspa Scenarios", three scenario cards ending in **KASPA $0.50 / $0.10 / $2.40**. Mean
  abs-diff vs t=2 s is 2.1-3.6/255 across the clip (cursor + a text selection only).
  It is **on-message for the hook** (literal Kaspa dollar-scenario prices while he answers "will
  Kaspa be a dollar"), so it is SHOWN in long deliberate stretches, not blanketed.

## Persona guards applied to every beat

- Mike is a **FORMER** four-year-cycle zombie. Past tense only, on screen and in art.
- Zombie imagery belongs to the **crowd/opposition**, never to Mike. The zombie beat runs in
  **content mode** so his live face stays on screen underneath, visually separating him from the horde.
- Register is **updated-before-the-crowd / vindicated**, never "he was wrong". Badges carry that
  ("CALLED IT EARLY", "THE CYCLE NEVER SHOWED"). No beat frames the belief change as a mistake.
- Generated coins other than the reference-gated Kaspa coin are blank/generic; no Bitcoin or Ethereum
  marks; every human figure is a faceless silhouette.

## Reference-image gate (named project = KASPA)

`ls schedule-tweets/images/reference/` run LIVE 2026-07-29 ->
`kaspa-logo.png` PRESENT (black coin, glowing teal **mirrored/backwards capital K**).
Both Kaspa-carrying assets (beat 1 hook + the frame-0 cover art) are generated **with that reference
attached** via `repurpose/generate-image.js --reference-image=...`. Never a forward K, never gold.

## Beat table

| # | window (s) | dur | mode | spoken line | visual | ref |
|---|---|---|---|---|---|---|
| - | 0.00-1.35 | 1.35 | **base** | "people, yeah, everybody asking me" | frame-0 cover hands off to Mike + the Kaspa-scenario screen-share | - |
| 1 | 1.35-4.50 | 3.15 | **full** | "you think Kaspa was going to be a dollar by the end of the year" | HOOK: giant dark coin with the glowing teal backwards-K, luminous question mark above it | **kaspa-logo.png** |
| - | 4.50-16.30 | 11.80 | **base** | "and no man, I wish... how much I wish Kaspa will be a dollar. I don't think so by the end of the year. I wish everything just gets awesome, it starts running" | DELIBERATE base stretch: the screen-share IS the argument here ($0.50 / $0.10 / $2.40 Kaspa scenarios) and his face carries the "I wish". Badge A only. | - |
| 2 | 16.30-19.55 | 3.25 | **content** | "I had really good hopes back when I was a four year cycle zombie" | Faceless zombie silhouettes shuffling in fog toward a dim cyan four-hump cycle wave. His live face stays below the seam. | - |
| - | 19.55-23.45 | 3.90 | **base** | "probably like a year and three or four months ago at this point" | base + Badge B (CALLED IT EARLY) | - |
| 3 | 23.45-26.00 | 2.55 | **full** | "because tariff season is what really changed me" | MAJOR TRANSITION: storm-lit container port, red candlestick chart plunging across the sky | - |
| - | 26.00-28.60 | 2.60 | **base** | "I was like, what the hell is going on?" + the 1.7 s beat of silence | - | - |
| 4 | 28.60-31.20 | 2.60 | **content** | "we actually went below the 50-week SMA in the post-halving year" | RECEIPT: red candles cutting DOWN through a thick glowing teal moving-average curve, break point flaring | - |
| - | 31.20-34.00 | 2.80 | **base** | "in the post-halving year when we're supposed to be" | - | - |
| 5 | 34.00-36.60 | 2.60 | **content** | "running like mad, like mad, you know, mad bulls" | Neon-green bull charging the camera through a dark arena (the run that was promised) | - |
| - | 36.60-48.35 | 11.75 | **base** | "mad bulls run on whatever type of drug... I thought everything was going to be pumping, a magnificent cycle top" | DELIBERATE base stretch: this is pure delivery, the joke lands on his face. Badge C only. | - |
| 6 | 48.35-51.40 | 3.05 | **full** | "no, that's not happening man. that's not happening." | CLIMAX: the glowing cycle wave shattering into frozen glass shards in a black void | - |
| - | 51.40-54.23 | 2.83 | **base** | "so we just got to take it as it comes right now" | base close + Badge D (follow), sitting ON the final line, hard out preserved | - |

## Budget check

- b-roll total **17.20 s / 54.23 s = 31.7 %** -> base showing **68.3 %**. Inside the 25-35 % band,
  near the 30 % target.
- **6 distinct images** for a 54 s clip (skill: ~6-8 per ~75 s). Zero reuse, zero loop-filling.
- **3 full-screens** (hook / the tariff turn / the climax) = the FIRM 1-3 cap, exactly.
- Full-screen separation: 4.50 -> 23.45 and 26.00 -> 48.35. No sub-1.5 s base flash between
  full-screens (production rule 4).
- Longest base gaps: 11.80 s and 11.75 s, both deliberate and both carrying a code badge, not a
  b-roll image.

## Assets (all generated straight into `render-assets/`)

| file | beat | generator |
|---|---|---|
| `thumbnail-zomb.png` | frame-0 cover art (title drawn in CODE on top) | generate-image.js + kaspa-logo.png |
| `broll-zomb-dollar-question.png` | 1 | generate-image.js + kaspa-logo.png |
| `broll-zomb-cycle-zombies.png` | 2 | generate-broll-reload.js |
| `broll-zomb-tariff-shock.png` | 3 | generate-broll-reload.js |
| `broll-zomb-below-sma.png` | 4 | generate-broll-reload.js |
| `broll-zomb-mad-bulls.png` | 5 | generate-broll-reload.js |
| `broll-zomb-not-happening.png` | 6 | generate-broll-reload.js |

## Overlays (code badges) - never collide in time AND space

All four sit **inside base stretches**, never under a b-roll image, and no two share a time window.
Single vertical band (top 300) is safe because they never co-occur.

| id | window (s) | colour | text | why it is not in the captions |
|---|---|---|---|---|
| A | 9.30-12.10 | teal | HE WANTS / IT TOO / STILL SAYS NO | stops the "no" reading as bearish |
| B | 20.90-23.10 | yellow | CALLED IT / EARLY / CROWD STILL WAITING | the vindication frame |
| C | 44.10-47.00 | red | THE CYCLE / NO SHOW / HE QUIT WAITING | names what broke |
| D | 51.90-54.00 | teal | FOLLOW ME / FOR THIS / DAILY CRYPTO STREAMS | CTA over the final line (hard out kept) |

Badge B ends 0.35 s before beat 3's full-screen; badge C ends 1.35 s before beat 6's; badge D starts
0.50 s after beat 6 ends. Nothing starts under the frame-0 cover (earliest tIn 9.30 >> 1/30 s).

Two constraints found while QA-ing the stills, both now baked into the data:

1. **Badge A moved off a BASE annotation.** The screen-share itself draws a giant red X over the
   middle scenario card from **5.80 to 8.15 s** (measured: 73.7k pure-red px, bbox x 54-619 /
   y 110-515, exactly the badge band). The first placement (6.40-9.20) sat on it. Badge A now runs
   9.30-12.10, straight over "how much I wish Kaspa will be a dollar. I don't think so".
   Every other badge window was diff-checked against a clean base frame: 1.1-2.1/255, i.e. no
   annotation present.
2. **Badge copy is length-capped by the component.** `Badge` is `position:absolute; left:50%`, so its
   shrink-to-fit width is measured against the 540 px from centre to right edge (~436 px of content).
   Caps: line1 ~9-10 chars at 60 px, line2 ~8 chars at 82 px, sub ~18 chars. "MORE THAN YOU" broke
   into three 82 px lines and grew the plate to y 45-545 before this was fixed.

## SFX (from `video-creation/assets/sfx/`)

| t (s) | cue | why |
|---|---|---|
| 0.02 | Cinematic Whoosh 02 | the frame-0 cover cut (vol 0.30, dur 0.55 after a whisper sweep, see below) |
| 1.33 | transition_rapid_whoosh | cut INTO the hook full-screen |
| 16.28 | Cinematic Whoosh 06 | cut into the zombie cutaway |
| 21.85 | risers/Tension_Rise_Logo_Reveal_2 | riser building INTO the tariff turn |
| 23.48 | Impacts/Impact_2 | IMPACT on "tariff season" (the turn) |
| 28.55 | DING | the 50-week SMA receipt lands |
| 48.32 | transition_rapid_whoosh | cut into the climax full-screen |
| 49.10 | Impacts/Impact_3 | payoff hit under "that's not happening" (kept low, VO first) |

8 events (>= 2 required). Every volume is swept against whisper-verify on the FINAL mix; any cue that
degrades its line gets its volume dropped, never the line.

**One cue actually failed that test and was fixed.** On the first full render the opening whoosh
(0.42 / 1.20 s) ran over "people, yeah, everybody asking me" and Whisper lost a word off the render
that it keeps off the spine ("People, maybe everybody asked me" -> "People ask me"). Swept on the real
mix: 0.42/1.20 and 0.24/1.20 still drop "everybody", 0.16/1.20 and 0.20/0.90 recover it, and
**0.30 / 0.55 s transcribes identically to the spine alone** (the TAIL was the problem, not the level).
Shipped at 0.30 / 0.55. Every other cue already transcribed at parity or better than the spine, most
notably "running like mad, like mad, you know, mad bulls" under the riser+impact and "that's not
happening, man" under the closing hit.
