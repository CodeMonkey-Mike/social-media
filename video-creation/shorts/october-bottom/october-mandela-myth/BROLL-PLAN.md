# BROLL-PLAN — october-mandela-myth (batch `october-bottom`, clip 1, variant `long`)

Title (frame-0 cover): **"The October Bottom Is a Mandela Effect"**
Contract: `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` (halved b-roll budget:
~30 % generated b-roll / ~70 % base showing, 1-3 full-screens FIRM, BASE beats are explicit rows).

Spine: `october-mandela-myth-tightened-desilenced.mp4` — 114.20 s, 1080x1920, 25 fps, already tightened +
desilenced + burst-fixed (0.52 s cough excised at 47.68). FINAL, NOT re-cut here.
Render copy: `render-assets/october-mandela-myth.mp4` — the SAME picture/audio re-encoded to a seek-friendly
GOP (`-g 25 -keyint_min 25 -bf 0 -sc_threshold 0`, CRF 18) because Remotion's concurrent `OffthreadVideo`
seeks die mid-render on the long-GOP original (2026-08-03 finding). The canonical spine is untouched.
Measured seam (screen-share -> webcam): **y = 854** (row-mean gradient scan at t = 2/12/25/40/48/55/65/75/90/105/113 s;
all eleven samples land on row 854).
Caption centre `capY` = **892** (38 px under the seam, on his hairline, far above his eyes ~1150-1400).

## What the BASE video already shows (why coverage is deliberately low)

Content-zone change detection (2 fps, 64x50 luma diff over rows 0-854) finds exactly three states:

| base window | what is on the screen-share |
|---|---|
| 0.00-54.00 | **"The October Effect"** slide (S&P 500 since 1927): headline *"Everyone remembers 1929 and 1987. Almost no one remembers the other 97 years."* + three stat cards MEDIAN RETURN **1.03%** / NEGATIVE YEARS **38 / 99** / VOLATILITY **+36%** |
| 54.00-58.00 | the scroll transition between the two slides (low value — this is where B9 lands) |
| 58.00-86.00 | **"Not the Worst Month. Not Even Close."** slide: AVERAGE RETURN **~0.9-1.0%** / RANKING **6th Worst** (tied with July) / HIT RATE **62%** (share of years since 1927 that closed October positive), plus the summary paragraph. His mouse cursor highlights the 62 % card while he reads it |
| 86.00-114.20 | **TradingView BTCUSD monthly** + watchlist (BTC 63,658, 50-week MA, RSI panel, KAS in the watchlist) |

The screen-share is a genuine, on-message RECEIPT for essentially the whole clip: every number he says
(6th worst, 62 %, since 1927, positive on average) is legible on the slide as he says it. So the base is
SHOWN, not covered. The single longest deliberate BASE block, **58.30-76.90 (18.60 s)**, is exactly the
data readout, and covering it would delete the clip's proof. B-roll lands only where the base cannot
carry the idea (the Mandela-effect analogy, the 1929 crash, the zombie call-out, the odds, the front-run).

## Beat table

| # | window (s) | dur | spoken line | visual | mode | reference |
|---|---|---|---|---|---|---|
| BASE | 0.00-0.90 | 0.90 | "i've been saying" | frame-0 cover hands off to Mike + the October Effect slide | base | - |
| B1 | 0.90-2.65 | 1.75 | "there's not going to be a bottom in october" | HOOK full-screen: a colossal calendar-page monolith in a dark canyon, a stampede of faceless silhouettes charging it, a glowing floor line beneath | **full** | - |
| BASE | 2.65-11.20 | 8.55 | "because everybody and their grandma is going to be buying back in in october. and people have been pointing out that there's" | the October Effect slide IS the setup (the headline names 1929/1987 and the other 97 years) | base | - |
| B2 | 11.20-13.70 | 2.50 | "a four-year cycle even unrelated to bitcoin that goes way back" | content-zone: a colossal four-segment cycle dial turning in a dark hall, looping arrows, holographic bars orbiting the ring | content | - |
| BASE | 13.70-16.40 | 2.70 | "that goes like way back and october is" | his face carries the setup | base | - |
| B3 | 16.40-18.80 | 2.40 | "typically like the worst month for stock" | content-zone: a dark archive wall of curled, yellowed newspaper front pages all screaming the same illegible crash headline under one spotlight | content | - |
| BASE | 18.80-25.55 | 6.75 | "i actually thought that to be true, but i think that's just like some common myth. like what is that mandela effect, right?" | the turn is on HIS face; the slide stays up | base | - |
| B4 | 25.55-28.15 | 2.60 | "the mandela effect where a lot of people believe" | content-zone: a dark auditorium of faceless silhouettes, every one projecting the IDENTICAL glitching memory bubble | content | - |
| BASE | 28.15-35.60 | 7.45 | "that nelson mandela was killed in the 90s or something like that. and like when he never was" | deliberate base: a real person is named, so nothing is generated for him (see persona guards) | base | - |
| B5 | 35.60-38.40 | 2.80 | "all the mandela effect where everybody just believes something that's false" | content-zone: a history book on a lectern dissolving into digital noise, a cracking red wax seal on the page | content | - |
| BASE | 38.40-44.60 | 6.20 | "because this is the first time we even have a prediction for a bottom for the crypto market in october" | base | base | - |
| B6 | 44.60-47.30 | 2.70 | "because we've never had a bottom in october prior to this" | content-zone: a museum corridor of rows of EMPTY gilded frames, one spotlight on the emptiest | content | - |
| B7 | 47.30-49.90 | 2.60 | "but related to stocks, everyone remembers" | **MANDATORY COVER BEAT** (see below) + major transition, full-screen: a 1920s exchange floor in chaos, faceless period silhouettes, ticker tape, a red arrow of light through the smoke. EXACTLY butted to B6 (`tOut === tIn`) so `BrollLayer` HARD-CUTS | **full** | - |
| B8 | 49.90-52.60 | 2.70 | "1929 and 1987. almost no one remembers" | content-zone: a vast grid of grey stone tiles receding into fog, only TWO glowing hot red, the rest cold and forgotten. EXACTLY butted to B7, hard cut | content | - |
| BASE | 52.60-55.00 | 2.40 | "the other 97 years" | back to his face + the slide headline that says exactly this | base | - |
| B9 | 55.00-58.30 | 3.30 | "the two events spread across 90 years is not a pattern. it's an outlier" | content-zone: a holographic scatter plot, hundreds of teal dots in one tight cluster and ONE blazing red dot far outside, ringed. Lands on the slide's own scroll transition (lowest-value base window in the clip) | content | - |
| **BASE** | **58.30-76.90** | **18.60** | "it's not the worst month, that is not even close, right? the returns are positive on average. it's a six out of 12 months. it's the sixth worst month, which is right smack in the middle. 62% of the years since 1927, october returned positive. so this is for all you folks out there" | **THE RECEIPT BLOCK — nothing may cover this.** The "Not the Worst Month. Not Even Close." slide is on screen with `~0.9-1.0%`, `6th Worst`, `62%` and his cursor highlighting the 62 % card, i.e. every number he speaks is legible as he speaks it | base | - |
| B10 | 76.90-79.50 | 2.60 | "all your four-year cycle zombies that try to use" | CLIMAX full-screen: a horde of gaunt faceless hooded figures shuffling through a graveyard of shattered candlestick monuments under a blood moon, a broken cycle dial half buried | **full** | - |
| BASE | 79.50-88.00 | 8.50 | "that particular point that october is usually a bad october is usually bad for the markets anyway. and this time it's just going to happen with crypto" | the slide runs out at 86.00 and the **TradingView BTC monthly** chart takes over exactly on "happen with crypto" | base | - |
| B11 | 88.00-90.60 | 2.60 | "a 50% certainty that the bottom is behind us" | content-zone: a giant balance scale dead level in a dark void, one glowing green orb against one dim red orb | content | - |
| BASE | 90.60-93.00 | 2.40 | "and maybe like a" | the BTC monthly chart | base | - |
| B12 | 93.00-95.60 | 2.60 | "40% certainty that the bottom is in the next 30 days way before october" | content-zone: a wall of thirty small calendar tiles burning out left to right, a bright floor line already glowing well before the last tile | content | - |
| BASE | 95.60-107.40 | 11.80 | "and then the remaining 10% will be like, i'm open to entertaining the idea that there'll be a bottom after october because they believe that there's going to be a bottom in october. well, a lot of people who know that's going to happen" | the BTC monthly chart with the 50-week MA and the RSI panel is the right visual for the odds talk; his face carries the concession | base | - |
| B13 | 107.40-110.10 | 2.70 | "going to front run that and try to buy back in" | content-zone: faceless silhouetted runners sprinting out of the dark, ONE far ahead breaking a glowing teal barrier, motion-blur streaks | content | - |
| BASE | 110.10-111.50 | 1.40 | "before they're missing" | his face for the beat before the hard-out | base | - |
| B14 | 111.50-114.30 | 2.67* | "so the bottom might be front run. bottom might be happening early" | CLOSE content-zone: a teal price floor igniting EARLY on a dark holographic chart, a green candle launching off it while the calendar monolith still stands untouched further down the timeline | content | - |

\* declared `tOut` 114.30 so the image is fully opaque through the last rendered frame (114.167 s); effective 2.67 s.

**Budget: 36.52 s of b-roll / 114.17 s = 32.0 % b-roll, 68.0 % base showing** (bands 25-35 % / 65-75 %) => ON TARGET.
**Distinct images: 14** (+1 thumbnail background), zero reuse anywhere in the clip. That is 1 image per 8.2 s
of runtime; the documented anti-example (`millionaires-are-made-full`) was 1 per 4.7 s at 66.8 % coverage.
Image count is an OUTPUT of the 32 % budget at style-guide beat lengths (1.75-3.30 s, i.e. "changes every
1-3 s"), not a target.
**Full-screens: 3** (hook 0.90, the 1929 turn 47.30, the zombie climax 76.90) — the FIRM 1-3 cap, exactly at
hook / major transition / climax. Gaps between them are 44.65 s and 27.40 s, so no full-to-full base flash
can exist. The only image-to-image joins are B6 -> B7 and B7 -> B8, both EXACTLY butted (`tOut === tIn`),
which `BrollLayer` hard-cuts by design (adjacency <= 0.18 s), so no base frames flash between images.
**Longest base gap: 18.60 s (58.30-76.90)** — deliberate, it is the data-readout receipt described above.

## MANDATORY COVER BEAT — the burst-removal join (batch requirement)

`progress.json`: *"burst-removal 2026-08-04: 0.52 s cough excised at 47.68 clip-time, verified; builder must
cover 47.6-48.9 (new timeline) with b-roll to hide the join jump."*

Frame comparison at t=2 s vs t=48 s shows the jump is on the **FACE ZONE** (his head sits noticeably lower
and further right after the join); the content zone is byte-identical either side (same slide, no scroll).
**A content-zone image therefore cannot hide it — the cover MUST be full-screen.** B7 is that full-screen:
`tIn 47.30`, so it is at opacity 1.0 by **47.42** (the layer's 0.12 s fade), a clear 0.26 s before the
47.68 join, and it holds opacity 1.0 until **49.18** (fade-out 49.18-49.30 into B8's hard cut, which is
adjacent so the fade is suppressed entirely). Required window 47.6-48.9 is covered with margin on both
sides, and the beat is also a genuine editorial transition (myth setup -> the stock-market receipt), so it
does not spend a full-screen frivolously.

## Reference-image gate (MANDATORY, named projects)

`ls schedule-tweets/images/reference/` run LIVE for this build (2026-08-04): `DogInMe.png ·
ElizaOS-ai16z-2.png · ElizaOS-ai16z.webp · LAB.png · bittensor-tao.png · bobo.png · carousels ·
ethereum-eth.png · housecoin.webp · kappy.png · kaspa-logo.png · kasy.png · kroak.png · linea.png ·
michael-saylor.png · nacho.jpg · slippy.png · toshi.png · troll.png · velvet.png · what-if.jpg`.

- **Named projects/tickers in this clip: Bitcoin ONLY** ("a four year cycle even unrelated to Bitcoin",
  13.0 s). There is **no Bitcoin reference in the folder**, so per the gate no Bitcoin mark is invented:
  B2 is an abstract cycle dial with unmarked holographic bars. The real BTC branding the clip does carry
  comes from the BASE video instead (the TradingView **BTCUSD** monthly chart is on screen 86.00-114.20 s,
  ~28 s, with the real Bitcoin ticker and price).
- **No other project, ticker or exchange is named anywhere in the clip**, so no other reference applies.
  (Kaspa/TAO/LAB/What If etc. belong to other clips in this batch, not this one.)
- **Nelson Mandela is a real person.** No portrait, likeness, statue or face of him is generated anywhere
  (B4/B5 are a faceless crowd and a book). The Mandela beats at 28.15-35.60 run on BASE video on purpose.

## Persona guards applied

- Every human figure in every generated image is a **faceless silhouette** (hooded/backlit); no real-person
  faces, no recognisable likenesses.
- **No real cryptocurrency logos or marks** — no Bitcoin B, no Ethereum diamond, no exchange logos. Any
  coin-like object is a blank, unmarked disc; the chart/candle elements are generic holographic bars.
- **No baked text is relied on.** Newspaper/calendar surfaces are deliberately illegible; the cover title
  and chip are drawn in CODE over the art, never inside the image.
- Accent palette: **teal `#00e5ff`** (house accent for this non-Kaspa-branded topic) + amber/red for the
  crash and myth beats. Nothing depicts Mike's calls failing; the register is declarative and vindicated.
- No em dashes anywhere on screen (captions, cover, or badge text).

## Overlays (code-drawn badges) — deliberately NONE

There is no place to put one. The content zone is a full-bleed designed data slide from 0.00-86.00
(title y~200-300, stat cards y~295-650, summary paragraph y~560-680) and a full-bleed TradingView chart
from 86.00-114.20; the only empty band on slide 2 is y~690-850, and a badge there (height ~138-182 px
centred) collides with a wrapped two-line caption at `capY 892` (which spans y~803-977). Covering the stat
cards with a badge would hide the exact receipt the clip is built on. Badges are optional in the contract;
b-roll, captions and SFX carry the clip, so the only timed graphic is the frame-0 cover. Nothing else
starts before it ends, so no overlay can collide in time or space.

## SFX (from `video-creation/assets/sfx/`) — 16 events, 8 distinct files

Cue points are each file's MEASURED attack/peak offset on this machine (0.1 s RMS envelope), so the crest
lands on the frame it punctuates: `transition_rapid_whoosh` peak 0.10 s · `Cinematic Whoosh 02` peak 0.80 s ·
`ding/sudden-shock` attack 0.10 / peak 0.30 · `TING SOUND EFFECT` attack 0.70 / peak 0.80 · `DING.mp3`
peak 0.20 · `Tension_Rise_Logo_Reveal_2` peak 4.70 · `Tension_Rise_Logo_Reveal_3` peak 2.50 ·
`Impact_Hit_01-2` peak 0.10 · `Soundjay_Impact_Main_01` peak 0.20 · `Boom - Big Reveal` peak 0.00.

| t (s) | file | vol | why |
|---|---|---|---|
| 0.00 | transition_rapid_whoosh.mp3 | 0.30 | the frame-0 cover cut |
| 0.10 | Cinematic Whoosh 02.wav | 0.22 | sweeps INTO the hook full-screen (crest 0.90) |
| 11.10 | transition_rapid_whoosh.mp3 | 0.34 | cut into the four-year-cycle cutaway (11.20) |
| 16.30 | transition_rapid_whoosh.mp3 | 0.34 | cut into the crash-headline wall (16.40) |
| 25.45 | transition_rapid_whoosh.mp3 | 0.34 | cut into the false-memory crowd (25.55) |
| 35.50 | transition_rapid_whoosh.mp3 | 0.34 | cut into the dissolving history book (35.60) |
| 36.48 | ding/sudden-shock.mp3 | 0.26 | lands on "false" (38.20) via its 0.30 s peak -> see table note |
| 44.50 | transition_rapid_whoosh.mp3 | 0.34 | cut into the empty-frames corridor (44.60) |
| 45.20 | risers/Tension_Rise_Logo_Reveal_2.wav | 0.16 | riser BUILDS INTO the 1929 full-screen (crest 47.30 is 2.1 s in; see constants for the exact offset) |
| 47.20 | Impacts/Impact_Hit_01-2.wav | 0.34 | IMPACT on the cut to the 1929 full-screen (47.30) |
| 49.80 | transition_rapid_whoosh.mp3 | 0.34 | the B7 -> B8 hard cut (49.90) |
| 54.90 | transition_rapid_whoosh.mp3 | 0.34 | cut into the outlier scatter plot (55.00) |
| 68.20 | TING SOUND EFFECT.mp3 | 0.30 | receipt ding: lands on "62%" (69.00) |
| 74.60 | risers/Tension_Rise_Logo_Reveal_3.wav | 0.16 | riser BUILDS INTO the zombie climax (crest 76.90) |
| 76.70 | Impacts/Soundjay_Impact_Main_01.wav | 0.30 | IMPACT on the cut to the zombie full-screen (76.90) |
| 77.80 | Boom - Big Reveal.wav | 0.32 | the biggest hit of the short, on "zombies" (77.80) |
| 107.30 | transition_rapid_whoosh.mp3 | 0.34 | cut into the front-run sprint (107.40) |
| 111.40 | transition_rapid_whoosh.mp3 | 0.32 | cut into the closing early-bottom card (111.50) |
| 112.60 | DING.mp3 | 0.28 | the hard-out kicker on "happening early" (113.74) |

Every cue sits UNDER the VO; the final MIX is whisper-verified against the spine for masking (contract
item 7). Exact final values live in `constants-omm.ts` and win on conflict with this table.

## Caption corrections (verified against THIS clip's own whisper-words.json)

Source of truth = `video-creation/skills/captions/build_captions.py` (`CORRECTIONS` / `PHRASE_CORRECTIONS`),
never a hand edit of the emitted array. Built with `--style montserrat` off `whisper-words.json`
(transcribed AFTER the burst fix).

| delegated gate | verdict on THIS clip | evidence |
|---|---|---|
| "every remembers" -> "everybody remembers" | **NOT APPLIED (no-op)** — ships as "everyone remembers" | This clip's word pass has `everyone` (p 0.88) at 49.12-49.30, and a medium re-transcribe of 47.20-52.60 in isolation returns "But related to stocks, **everyone remembers** 1929 and 1987, almost no one remembers the other". The garble named in the gate does not exist here; forcing "everybody" would put a word on screen no 1x pass produced |
| "sick out of 12" -> "six out of 12" | **APPLIED** | Word pass has `sick` (p 0.83) at 63.68; medium re-transcribe of 62.80-65.40 also returns "It's a **sick** out of twelve months, it's the **sex**" — a garble on both passes. Shipped as "six out of 12 months" |
| "October return positive" -> "October returned positive" | **NOT APPLIED (no-op)** — already correct | Word pass already has `returned` (p 0.81) at 73.60 |
| "for your cycle zombies" -> "four-year cycle zombies" | **PARTIALLY APPLIED (hyphenation only)** | Word pass already has `four` `year` `cycle` `zombies` at 77.16-78.22 as four tokens; the only fix needed is the compound, so `("four","year") -> "four-year"` merges them (also fixes the 11.04 s occurrence). No word is changed |
| "the Nelson Mandela" -> "Nelson Mandela" | **NOT APPLIED (no-op)** — already correct | Word pass reads "people believe **that Nelson Mandela** was killed"; medium re-transcribe of 24.80-30.40 returns "The Mandela effect where a lot of people believe that Nelson Mandela". There is no "the Nelson Mandela" anywhere |
| *(found by this build, not delegated)* "it's an outline" -> "it's an **outlier**" | **APPLIED** | Three neutral 1x passes (base word pass p 0.63, medium 55.90-58.90, medium 53.60-58.60) all return the non-sequitur "outline"; a medium 1x pass over the same 53.60-58.60 audio with a market-statistics `initial_prompt` returns "The two events spread across 90 years is not a pattern, **it's an outlier**", which is also what the clip-strategist's `clip-plan.json` peak beat records ("338.00-343.14 not a pattern, an outlier"). Keyed tightly as `("pattern","its","an","outline")` so no legitimate "an outline" elsewhere can match |

Colour tags: `<y>` yellow for every number (1929, 1987, 97, 90, 62%, 12, 1927, 50%, 40%, 10%, 30),
`<r>` red for the myth vocabulary (myth, zombies, false, worst), `<gr>` green for positive,
`<g>` teal for mandela / outlier. No em dashes on screen.

## Files (zero orphans)

`render-assets/` (the render `--public-dir`):
`october-mandela-myth.mp4` (GOP-fixed spine copy) · `thumbnail-omm.png` · `broll-omm-hook.png` ·
`broll-omm-cycle.png` · `broll-omm-crash-myth.png` · `broll-omm-false-memory.png` ·
`broll-omm-false-stamp.png` · `broll-omm-never-happened.png` · `broll-omm-1929.png` ·
`broll-omm-97-years.png` · `broll-omm-outlier.png` · `broll-omm-zombies.png` · `broll-omm-5050.png` ·
`broll-omm-30-days.png` · `broll-omm-front-run.png` · `broll-omm-early-bottom.png` · `sfx/…` (8 shared files copied in).
Comp: `remotion/src/OctoberMandelaMyth.tsx` + `remotion/src/constants-omm.ts` + `remotion/src/captionsOmm.ts`.
